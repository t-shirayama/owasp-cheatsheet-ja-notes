# インジェクション防止チートシート 日本語訳

## Attribution

- Original: Injection Prevention Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Injection_Prevention_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-21

## 日本語訳

# インジェクション防止チートシート

## はじめに

この記事は、アプリケーションにおけるインジェクション欠陥というカテゴリ全体を防止するための、明確で簡潔かつ実行可能なガイダンスを提供することに重点を置いています。インジェクション攻撃、特に [SQL Injection](https://owasp.org/www-community/attacks/SQL_Injection) は、残念ながら非常に一般的です。

アプリケーションへどの程度アクセスできるかは、インジェクション欠陥の保護と防止において非常に重要な要素です。企業内のすべてのアプリケーションのうち、社内で開発されるものは少数であり、多くは外部由来です。オープンソースアプリケーションであれば少なくとも問題を修正する機会がありますが、クローズドソースアプリケーションではインジェクション欠陥に対して別のアプローチが必要です。

インジェクション欠陥は、アプリケーションが信頼できないデータをインタプリタへ送信するときに発生します。インジェクション欠陥は非常に広く存在し、特にレガシーコードで多く見られ、SQL クエリ、LDAP クエリ、XPath クエリ、OS コマンド、プログラム引数などでよく発生します。インジェクション欠陥は、コードを調べると発見しやすい一方、テストではより発見が困難です。スキャナやファザーは、攻撃者がそれらを見つける助けになります。

アクセス可能性に応じて、修正のために取るべき対応は異なります。問題をソースコード自体で修正すること、あるいはアプリケーションの一部を再設計することが、常に最善の方法です。しかし、ソースコードを利用できない場合や、レガシーソフトウェアを修正することが単純に経済的ではない場合には、仮想パッチのみが現実的です。

## アプリケーションの種類

企業内では通常、三つのクラスのアプリケーションが見られます。これら三つの種類は、インジェクション欠陥を防止または修正するために必要な対応を特定するために必要です。

### A1: 新規アプリケーション

設計段階、または開発初期段階にある新しい Web アプリケーションです。

### A2: 稼働中のオープンソースアプリケーション

すでに稼働しており、容易に適応できるアプリケーションです。Model-View-Controller (MVC) 型アプリケーションは、アクセスしやすいアプリケーションアーキテクチャの一例です。

### A3: 稼働中のクローズドソースアプリケーション

変更できない、または変更が困難な、稼働中のアプリケーションです。

## インジェクションの形態

SQL クエリ、LDAP クエリ、XPath クエリ、OS コマンドなど、さまざまな技術を対象とするインジェクションの形態があります。

### クエリ言語

最も有名なインジェクションの形態は SQL Injection であり、攻撃者は既存のデータベースクエリを変更できます。詳細については、[SQL Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html) を参照してください。

LDAP、SOAP、XPath、REST ベースのクエリもインジェクション攻撃の影響を受ける可能性があり、データ取得や制御回避を許すことがあります。

#### SQL インジェクション

SQL インジェクション攻撃は、データ入力またはクライアント (ブラウザ) から Web アプリケーションへ送信されるデータを通じて、SQL クエリの一部または完全な SQL クエリを挿入、すなわち「インジェクション」することで成立します。

SQL インジェクション攻撃が成功すると、データベースから機密データを読み取る、データベースデータを変更する (insert/update/delete)、データベース上で管理操作を実行する (DBMS の shutdown など)、DBMS ファイルシステム上に存在する特定ファイルの内容を復元する、ファイルシステムへファイルを書き込む、場合によってはオペレーティングシステムへコマンドを発行する、といったことが可能になります。SQL インジェクション攻撃はインジェクション攻撃の一種であり、あらかじめ定義された SQL コマンドの実行に影響を与えるため、データプレーン入力に SQL コマンドを注入します。

SQL Injection 攻撃は、次の三つのクラスに分けられます。

- **Inband:** SQL コードの注入に使われるものと同じチャネルを使ってデータを抽出します。これは最も単純な種類の攻撃であり、取得されたデータはアプリケーションの Web ページに直接表示されます。
- **Out-of-band:** 別のチャネルを使ってデータを取得します。たとえば、クエリ結果を含むメールが生成され、テスターへ送信されます。
- **Inferential or Blind:** 実際のデータ転送はありませんが、テスターは特定のリクエストを送信し、DB Server の結果の挙動を観察することで情報を再構成できます。

##### 問題のテスト方法

###### コードレビュー時

データベースへのクエリが prepared statement を使わずに実行されていないか確認してください。

動的ステートメントが作成されている場合は、そのステートメントの一部として使用される前にデータがサニタイズされているか確認してください。

監査者は、SQL Server のストアドプロシージャ内で `sp_execute`、`execute`、`exec` が使われていないか常に確認すべきです。他のベンダーにおける同様の関数についても、同様の監査ガイドラインが必要です。

###### 自動化された悪用

以下の状況や技術の多くは、いくつかのツールを使って自動化された方法で実行できます。この記事では、テスターは [SQLMap](https://wiki.owasp.org/index.php/Automated_Audit_using_SQLMap) を使った自動監査の実施方法に関する情報を見つけることができます。

同様に、静的コード解析のデータフロールールは、サニタイズされていないユーザー制御入力が SQL クエリを変更できることを検出できます。

###### ストアドプロシージャインジェクション

ストアドプロシージャ内で動的 SQL を使用する場合、アプリケーションはコードインジェクションのリスクを排除するため、ユーザー入力を適切にサニタイズしなければなりません。サニタイズされていない場合、ユーザーは悪意のある SQL を入力でき、それがストアドプロシージャ内で実行されます。

###### 時間遅延を用いた悪用技術

時間遅延を用いた悪用技術は、操作結果について何も分からない Blind SQL Injection の状況をテスターが見つけた場合に非常に有用です。この技術は、注入したクエリを送信し、条件が真の場合に、サーバーが応答するまでにかかった時間をテスターが監視するというものです。遅延がある場合、テスターは条件付きクエリの結果が真であると推測できます。この悪用技術は DBMS によって異なる場合があります (DBMS 固有のセクションを確認してください)。

```text
http://www.example.com/product.php?id=10 AND IF(version() like '5%', sleep(10), 'false'))--
```text

この例では、テスターは MySql のバージョンが 5.x であるかどうかを確認し、サーバーの応答を 10 秒遅らせています。テスターは遅延時間を増やし、応答を監視できます。また、テスターは応答を待つ必要もありません。非常に大きな値 (例: 100) を設定し、数秒後にリクエストをキャンセルできる場合もあります。

###### Out of band を用いた悪用技術

この技術は、操作結果について何も分からない Blind SQL Injection の状況をテスターが見つけた場合に非常に有用です。この技術は、DBMS 関数を使って out of band 接続を実行し、注入されたクエリの結果をテスターのサーバーへのリクエストの一部として配送するものです。エラーベースの技術と同様に、各 DBMS には独自の関数があります。特定の DBMS セクションを確認してください。

##### 修復

###### 防御策 1: Prepared Statement (パラメータ化クエリ)

Prepared statement は、攻撃者が SQL コマンドを挿入した場合でも、クエリの意図を変更できないことを保証します。下の安全な例では、攻撃者が userID として `tom' or '1'='1` を入力したとしても、パラメータ化クエリは脆弱にならず、代わりに文字列全体 `tom' or '1'='1` と文字どおり一致するユーザー名を探します。

###### 防御策 2: ストアドプロシージャ

Prepared statement とストアドプロシージャの違いは、ストアドプロシージャの SQL コードがデータベース自体で定義および保存され、アプリケーションから呼び出される点です。

これら二つの技術は SQL インジェクション防止において同等の効果を持つため、組織はどちらのアプローチが最も合理的かを選択すべきです。ストアドプロシージャは、SQL インジェクションに対して常に安全とは限りません。ただし、標準的なストアドプロシージャのプログラミング構造の中には、安全に実装された場合にパラメータ化クエリの使用と同じ効果を持つものがあります。これは多くのストアドプロシージャ言語では通常の形です。

*注:* 「安全に実装」とは、ストアドプロシージャに安全ではない動的 SQL 生成が含まれていないことを意味します。

###### 防御策 3: 許可リストによる入力検証

テーブル名やカラム名、並び替え順を示す指示子 (ASC または DESC) など、SQL クエリのさまざまな部分ではバインド変数を使用できない場所があります。このような状況では、入力検証またはクエリの再設計が最も適切な防御です。テーブル名やカラム名については、理想的にはそれらの値はユーザーパラメータではなくコードから来るべきです。

しかし、ユーザーパラメータ値を使ってテーブル名やカラム名を切り替える場合は、未検証のユーザー入力がクエリに入らないようにするため、そのパラメータ値を正当かつ期待されるテーブル名またはカラム名にマッピングすべきです。これは設計不良の兆候であり、時間が許す場合は全面的な書き換えを検討すべきである点に注意してください。

###### 防御策 4: すべてのユーザー指定入力のエスケープ

この技術は、上記のいずれも実現できない場合の最後の手段としてのみ使用すべきです。この方法は他の防御策に比べて脆弱であり、あらゆる状況ですべての SQL Injection を防げるとは保証できないため、入力検証の方がより良い選択である可能性があります。

この技術は、ユーザー入力をクエリに入れる前にエスケープするものです。通常、入力検証の実装が費用対効果に合わない場合に、レガシーコードへ後付けする目的でのみ推奨されます。

##### コード例 - Java

###### 安全な Java Prepared Statement の例

次のコード例では、パラメータ化クエリの Java 実装である `PreparedStatement` を使って、同じデータベースクエリを実行します。

```java
// This should REALLY be validated too
String custname = request.getParameter("customerName");
// Perform input validation to detect attacks
String query = "SELECT account_balance FROM user_data WHERE user_name = ?";
PreparedStatement pstmt = connection.prepareStatement(query);
pstmt.setString(1, custname);
ResultSet results = pstmt.executeQuery();
```text

ここでは Java の例を示しましたが、Cold Fusion や Classic ASP を含む、実質的に他のすべての言語でも、パラメータ化クエリインターフェースがサポートされています。

###### 安全な Java ストアドプロシージャの例

次のコード例では、ストアドプロシージャインターフェースの Java 実装である `CallableStatement` を使って、同じデータベースクエリを実行します。`sp_getAccountBalance` ストアドプロシージャはデータベース内で事前定義されており、上で定義したクエリと同じ機能を実装している必要があります。

```java
// This should REALLY be validated
String custname = request.getParameter("customerName");
try {
 CallableStatement cs = connection.prepareCall("{call sp_getAccountBalance(?)}");
 cs.setString(1, custname);
 ResultSet results = cs.executeQuery();
 // Result set handling...
} catch (SQLException se) {
 // Logging and error handling...
}
```text

#### LDAP インジェクション

LDAP Injection は、ユーザー入力に基づいて LDAP ステートメントを構築する Web ベースアプリケーションを悪用する攻撃です。アプリケーションがユーザー入力を適切にサニタイズしない場合、[SQL Injection](https://owasp.org/www-community/attacks/SQL_Injection) と似た技術によって LDAP ステートメントを変更できる可能性があります。LDAP インジェクション攻撃は、認可されていないクエリへの権限付与や、LDAP ツリー内の内容変更につながる可能性があります。LDAP Injection 攻撃の詳細については、[LDAP injection](https://owasp.org/www-community/attacks/LDAP_Injection) を参照してください。

[LDAP injection](https://owasp.org/www-community/attacks/LDAP_Injection) 攻撃は、次の二つの要因により一般的です。

1. より安全な、パラメータ化された LDAP クエリインターフェースが不足していること。
2. システムへのユーザー認証に LDAP が広く使用されていること。

##### 問題のテスト方法

###### コードレビュー時

LDAP へのクエリで特殊文字がエスケープされているか確認してください。[こちら](https://cheatsheetseries.owasp.org/cheatsheets/LDAP_Injection_Prevention_Cheat_Sheet.html#defense-option-1-escape-all-variables-using-the-right-ldap-encoding-function) を参照してください。

###### 自動化された悪用

OWASP [ZAP](https://www.zaproxy.org/) のようなツールのスキャナモジュールには、LDAP インジェクション問題を検出するモジュールがあります。

##### 修復

###### 適切な LDAP エンコーディング関数を使用してすべての変数をエスケープする

LDAP が名前を保存する主な方法は、DN ([distinguished name](https://ldapwiki.com/wiki/Distinguished%20Names)) に基づいています。これは一意識別子のようなものだと考えることができます。これらは、ユーザー名のように、リソースへアクセスするために使われることがあります。

DN は次のような形式になります。

```text
cn=Richard Feynman, ou=Physics Department, dc=Caltech, dc=edu
```text

または次のような形式です。

```text
uid=inewton, ou=Mathematics Department, dc=Cambridge, dc=com
```text

DN では特殊文字と見なされる文字があります。網羅的な一覧は、`\ # + < > , ; " =` と、先頭または末尾の空白です。

各 DN は厳密に 1 つのエントリを指し、RDBMS における行のようなものと考えられます。各エントリには、RDBMS のカラムに相当する 1 つ以上の属性があります。LDAP 内で特定の属性を持つユーザーを検索したい場合は、検索フィルタを使用できます。検索フィルタでは、標準的なブール論理を使って任意の制約に一致するユーザー一覧を取得できます。検索フィルタはポーランド記法、すなわち前置記法で書かれます。

例:

```text
(&(ou=Physics)(| (manager=cn=Freeman Dyson,ou=Physics,dc=Caltech,dc=edu)
(manager=cn=Albert Einstein,ou=Physics,dc=Princeton,dc=edu) ))
```text

アプリケーションコードで LDAP クエリを構築する場合、LDAP クエリに追加される信頼できないデータはすべてエスケープすることが必須です。LDAP エスケープには二つの形式があります。LDAP Search 用のエンコーディングと、LDAP DN (distinguished name) 用のエンコーディングです。適切なエスケープは、検索フィルタ用に入力をサニタイズしているのか、何らかのリソースへアクセスするためのユーザー名に似た資格情報として DN を使っているのかによって異なります。

##### コード例 - Java

###### LDAP エスケープのための安全な Java の例

```java
public String escapeDN (String name) {
 //From RFC 2253 and the / character for JNDI
 final char[] META_CHARS = {'+', '"', '<', '>', ';', '/'};
 String escapedStr = new String(name);
 //Backslash is both a Java and an LDAP escape character,
 //so escape it first
 escapedStr = escapedStr.replaceAll("\\\\\\\\","\\\\\\\\");
 //Positional characters - see RFC 2253
 escapedStr = escapedStr.replaceAll("\^#","\\\\\\\\#");
 escapedStr = escapedStr.replaceAll("\^ | $","\\\\\\\\ ");
 for (int i=0 ; i < META_CHARS.length ; i++) {
        escapedStr = escapedStr.replaceAll("\\\\" +
                     META_CHARS[i],"\\\\\\\\" + META_CHARS[i]);
 }
 return escapedStr;
}
```text

バックスラッシュ文字は Java 文字列リテラルであり、正規表現のエスケープ文字でもある点に注意してください。

```java
public String escapeSearchFilter (String filter) {
 //From RFC 2254
 String escapedStr = new String(filter);
 escapedStr = escapedStr.replaceAll("\\\\\\\\","\\\\\\\\5c");
 escapedStr = escapedStr.replaceAll("\\\\\*","\\\\\\\\2a");
 escapedStr = escapedStr.replaceAll("\\\\(","\\\\\\\\28");
 escapedStr = escapedStr.replaceAll("\\\\)","\\\\\\\\29");
 escapedStr = escapedStr.replaceAll("\\\\" +
               Character.toString('\\u0000'), "\\\\\\\\00");
 return escapedStr;
}
```text

#### XPath インジェクション

TODO

### スクリプト言語

Web アプリケーションで使われるすべてのスクリプト言語には、実行時にコードを受け取り、それを実行する `eval` 呼び出しの形態があります。未検証かつ未エスケープのユーザー入力を使ってコードが組み立てられる場合、コードインジェクションが発生し、攻撃者がアプリケーションロジックを破壊し、最終的にはローカルアクセスを得ることを可能にします。

スクリプト言語が使われるたびに、その「高水準」スクリプト言語の実際の実装は C のような「低水準」言語を使って行われます。スクリプト言語のデータ処理コードに欠陥がある場合、'[Null Byte Injection](http://projects.webappsec.org/w/page/13246949/Null%20Byte%20Injection)' 攻撃ベクターを展開してメモリ内の他領域へアクセスでき、攻撃が成功する結果になります。

### オペレーティングシステムコマンド

OS コマンドインジェクションは、Web サーバー上で OS コマンドを実行するために Web インターフェースを介して使用される技術です。ユーザーは、OS コマンドを実行するために Web インターフェースを通じてオペレーティングシステムコマンドを提供します。

適切にサニタイズされていない Web インターフェースは、すべてこの悪用の対象になります。OS コマンドを実行できる能力により、ユーザーは悪意のあるプログラムをアップロードしたり、パスワードを取得したりできます。OS コマンドインジェクションは、アプリケーションの設計と開発においてセキュリティを重視すれば防止できます。

#### 問題のテスト方法

##### コードレビュー時

コマンド実行メソッドが呼び出されていないか、また、未検証のユーザー入力がそのコマンドのデータとして使用されていないか確認してください。

それ以外にも、URL クエリパラメータの末尾にセミコロンを追加し、その後にオペレーティングシステムコマンドを続けると、コマンドが実行されます。`%3B` は URL エンコードされており、デコードするとセミコロンになります。これは、`;` がコマンド区切りとして解釈されるためです。

例: `http://sensitive/something.php?dir=%3Bcat%20/etc/passwd`

アプリケーションが `/etc/passwd` ファイルの出力で応答した場合、攻撃が成功したことが分かります。多くの Web アプリケーションスキャナは、この攻撃のテストに使用できます。それらはコマンドインジェクションのバリエーションを注入し、応答をテストします。

同様に、静的コード解析ツールは、信頼できないユーザー入力が Web アプリケーション内を流れるデータフローを確認し、そのデータがユーザー入力をコマンドとして実行する危険なメソッドへ入力されていないか確認します。

#### 修復

ユーザー指定値を組み込んだシステムコマンド呼び出しが避けられないと考えられる場合、攻撃を防ぐために、ソフトウェア内で次の二層の防御を使用すべきです。

1. **パラメータ化** - 利用可能な場合は、データとコマンドの分離を自動的に強制する構造化された仕組みを使用します。これらの仕組みは、適切なクォートやエンコーディングの提供に役立ちます。
2. **入力検証** - コマンドと関連する引数の値は、どちらも検証する必要があります。実際のコマンドとその引数には、検証の程度に違いがあります。
    - 使用される **コマンド** については、許可されたコマンドのリストと照合して検証しなければなりません。
    - これらのコマンドに使用される **引数** については、次の選択肢を使って検証すべきです。
        - ポジティブ入力検証または許可リスト入力検証 - 許可される引数を明示的に定義します。
        - 許可リスト正規表現 - 良好な文字として許可されるリストと、文字列の最大長を明示的に定義します。`& | ; $ > < \` \ !` のようなメタ文字や空白文字が正規表現に含まれないようにしてください。たとえば、次の正規表現は小文字と数字のみを許可し、メタ文字を含みません。また、長さも 3 から 10 文字に制限されています。

`^[a-z0-9]{3,10}$`

#### コード例 - Java

##### 誤った使用例

```java
ProcessBuilder b = new ProcessBuilder("C:\DoStuff.exe -arg1 -arg2");
```text

この例では、コマンドと引数が 1 つの文字列として渡されています。そのため、この式を操作して悪意のある文字列を注入しやすくなります。

##### 正しい使用例

次の例は、変更された作業ディレクトリでプロセスを開始します。コマンドと各引数は個別に渡されます。これにより、各要素を検証しやすくなり、悪意のある文字列が挿入されるリスクを低減できます。

```java
ProcessBuilder pb = new ProcessBuilder("TrustedCmd", "TrustedArg1", "TrustedArg2");
Map<String, String> env = pb.environment();
pb.directory(new File("TrustedDir"));
Process p = pb.start();
```

### ネットワークプロトコル

Web アプリケーションは、ユーザー入力が通信ストリームの一部になるネットワークデーモン (SMTP、IMAP、FTP など) と通信することがよくあります。ここでは、確立済みセッションを悪用するためにコマンドシーケンスを注入できる可能性があります。

## インジェクション防止ルール

### ルール #1 (適切な入力検証を実施する)

適切な入力検証を実施します。適切な正規化を伴うポジティブ入力検証または許可リスト入力検証も推奨されますが、多くのアプリケーションでは入力に特殊文字が必要になるため、これは **完全な防御ではありません**。

### ルール #2 (安全な API を使用する)

推奨される選択肢は、インタプリタの使用を完全に避ける、またはパラメータ化インターフェースを提供する安全な API を使用することです。ストアドプロシージャのように、パラメータ化されていても内部でインジェクションを引き起こし得る API には注意してください。

### ルール #3 (ユーザーデータをコンテキストに応じてエスケープする)

パラメータ化 API を利用できない場合は、そのインタプリタ固有のエスケープ構文を使って特殊文字を慎重にエスケープすべきです。

## その他のインジェクションチートシート

[SQL Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)

[OS Command Injection Defense Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/OS_Command_Injection_Defense_Cheat_Sheet.html)

[LDAP Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/LDAP_Injection_Prevention_Cheat_Sheet.html)

[Injection Prevention Cheat Sheet in Java](https://cheatsheetseries.owasp.org/cheatsheets/Injection_Prevention_in_Java_Cheat_Sheet.html)

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V1.2 | インジェクション防止、クエリ言語、OS コマンド、LDAP などの入力処理 |
| V1.3 | コンテキストに応じたエスケープ、サニタイズ、入力検証 |
