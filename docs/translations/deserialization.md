# デシリアライゼーションチートシート 日本語訳

## Attribution

- Original: Deserialization Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Deserialization_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-21

## 日本語訳

# デシリアライゼーションチートシート

## はじめに

この記事は、アプリケーションで信頼できないデータを安全にデシリアライズするための、明確で実行可能なガイダンスを提供することに焦点を当てています。

## デシリアライゼーションとは

**シリアライゼーション**とは、何らかのオブジェクトを、後で復元できるデータ形式に変換するプロセスです。オブジェクトは、保存のため、または通信の一部として送信するためにシリアライズされることがよくあります。

**デシリアライゼーション**はその逆のプロセスであり、何らかの形式で構造化されたデータを受け取り、それをオブジェクトとして再構築します。現在、データのシリアライズに最もよく使われているデータ形式は JSON です。その前は XML でした。

しかし、多くのプログラミング言語には、オブジェクトをシリアライズするためのネイティブな方法があります。これらのネイティブ形式は通常、JSON や XML より多くの機能を備えており、シリアライゼーションプロセスのカスタマイズも含まれます。

残念ながら、これらのネイティブなデシリアライゼーション機構の機能は、信頼できないデータを処理する際に、悪意ある効果のために転用されることがあります。デシリアライザに対する攻撃では、サービス拒否、アクセス制御、またはリモートコード実行 (RCE) 攻撃が可能になることが確認されています。

## オブジェクトを安全にデシリアライズするためのガイダンス

以下の言語別ガイダンスでは、信頼できないデータをデシリアライズするための安全な方法を列挙することを試みています。

### PHP

#### クリアボックスレビュー

[`unserialize()`](https://www.php.net/manual/en/function.unserialize.php) 関数の使用を確認し、外部パラメータがどのように受け入れられているかをレビューします。シリアライズされたデータをユーザーに渡す必要がある場合は、`json_decode()` と `json_encode()` を介した JSON など、安全で標準的なデータ交換形式を使用します。

### Python

#### オペークボックスレビュー

トラフィックデータの末尾にドット記号 `.` が含まれる場合、そのデータはシリアライゼーションで送信された可能性が非常に高いです。これは、データが Base64 または Hexadecimal スキーマでエンコードされていない場合にのみ当てはまります。データがエンコードされている場合は、パラメータ値の先頭文字を見て、シリアライゼーションが行われている可能性があるかどうかを確認するのが最善です。たとえば、データが Base64 エンコードされている場合、ほとんどの場合 `gASV` で始まります。

#### クリアボックスレビュー

Python の以下の API はシリアライゼーション攻撃に対して脆弱になります。以下のパターンでコードを検索します。

1. `pickle/c_pickle/_pickle` と `load/loads` の使用:

```python
import pickle
data = """ cos.system(S'dir')tR. """
pickle.loads(data)
```

2. `PyYAML` と `load` の使用:

```python
import yaml
document = "!!python/object/apply:os.system ['ipconfig']"
print(yaml.load(document))
```

3. `jsonpickle` と `encode` または `store` メソッドの使用。

### Java

以下の手法はすべて、[Java の Serializable 形式](https://docs.oracle.com/javase/7/docs/api/java/io/Serializable.html)に対するデシリアライゼーション攻撃を防止するうえで有効です。

実装上の助言:

- コード内で `ObjectInputStream#resolveClass()` メソッドをオーバーライドし、任意のクラスがデシリアライズされないようにします。この安全な動作は、[SerialKiller](https://github.com/ikkisoft/SerialKiller) のようなライブラリでラップできます。
- ここで示すように、汎用的な `readObject()` メソッドの安全な代替を使用します。これは、入力長とデシリアライズされるオブジェクト数を確認することで、"[billion laughs](https://en.wikipedia.org/wiki/Billion_laughs_attack)" 型の攻撃に対処する点に注意してください。

#### クリアボックスレビュー

潜在的なシリアライゼーション脆弱性として、以下の Java API の使用に注意してください。

1. 外部のユーザー定義パラメータを伴う `XMLdecoder`

2. `fromXML` メソッドを伴う `XStream` (xstream バージョン <= v1.4.6 はシリアライゼーションの問題に対して脆弱です)

3. `readObject` を伴う `ObjectInputStream`

4. `readObject`、`readObjectNoData`、`readResolve` または `readExternal` の使用

5. `ObjectInputStream.readUnshared`

6. `Serializable`

#### オペークボックスレビュー

キャプチャしたトラフィックデータに以下のパターンが含まれる場合、そのデータが Java シリアライゼーションストリームで送信されたことを示している可能性があります。

- Hex の `AC ED 00 05`
- Base64 の `rO0`
- HTTP レスポンスの `Content-type` ヘッダーが `application/x-java-serialized-object` に設定されている

#### データ漏洩と信頼済みフィールドの上書きを防止する

デシリアライゼーション中にエンドユーザーが制御してはならない、またはシリアライゼーション中にユーザーへ露出してはならないオブジェクトのデータメンバーがある場合、それらは [`transient` キーワード](https://docs.oracle.com/javase/7/docs/platform/serialization/spec/serial-arch.html#7231) (セクション *Protecting Sensitive Information*) として宣言する必要があります。

Serializable として定義されたクラスでは、機密情報の変数を `private transient` として宣言する必要があります。

たとえば、`myAccount` クラスでは、変数 'profit' と 'margin' がシリアライズされないように transient として宣言されています。

```java
public class myAccount implements Serializable
{
    private transient double profit; // declared transient

    private transient double margin; // declared transient
    ....
```

#### ドメインオブジェクトのデシリアライゼーションを防止する

アプリケーションオブジェクトの一部は、その階層のために `Serializable` の実装を強制される場合があります。アプリケーションオブジェクトがデシリアライズされないことを保証するには、常に例外をスローする `readObject()` メソッドを `final` 修飾子付きで宣言する必要があります。

```java
private final void readObject(ObjectInputStream in) throws java.io.IOException {
    throw new java.io.IOException("Cannot be deserialized");
}
```

#### 独自の java.io.ObjectInputStream を堅牢化する

`java.io.ObjectInputStream` クラスはオブジェクトをデシリアライズするために使用されます。このクラスをサブクラス化することで、その動作を堅牢化できます。これは、以下の場合に最善の解決策です。

- デシリアライゼーションを行うコードを変更できる。
- デシリアライズされることを期待するクラスが分かっている。

一般的な考え方は、デシリアライズを許可するクラスを制限するために [`ObjectInputStream.html#resolveClass()`](http://docs.oracle.com/javase/7/docs/api/java/io/ObjectInputStream.html#resolveClass%28java.io.ObjectStreamClass)) をオーバーライドすることです。

この呼び出しは `readObject()` が呼び出される前に発生するため、許可した型でない限り、デシリアライゼーション処理が発生しないことを保証できます。

ここでは単純な例として、`LookAheadObjectInputStream` クラスが `Bicycle` クラス以外の型をデシリアライズしないことを保証する例を示します。

```java
public class LookAheadObjectInputStream extends ObjectInputStream {

    public LookAheadObjectInputStream(InputStream inputStream) throws IOException {
        super(inputStream);
    }

    /**
    * Only deserialize instances of our expected Bicycle class
    */
    @Override
    protected Class<?> resolveClass(ObjectStreamClass desc) throws IOException, ClassNotFoundException {
        if (!desc.getName().equals(Bicycle.class.getName())) {
            throw new InvalidClassException("Unauthorized deserialization attempt", desc.getName());
        }
        return super.resolveClass(desc);
    }
}
```

このアプローチのより完全な実装が、さまざまなコミュニティメンバーによって提案されています。

- [NibbleSec](https://github.com/ikkisoft/SerialKiller) - デシリアライズを許可するクラスのリストを作成できるライブラリ
- [IBM](https://www.ibm.com/developerworks/library/se-lookahead/) - 最も破壊的な悪用シナリオが想定される何年も前に書かれた、先駆的な防御策。
- [Apache Commons IO classes](https://commons.apache.org/proper/commons-io/javadocs/api-2.5/org/apache/commons/io/serialization/ValidatingObjectInputStream.html)

#### エージェントで java.io.ObjectInputStream のすべての使用を堅牢化する

前述のとおり、`java.io.ObjectInputStream` クラスはオブジェクトをデシリアライズするために使用されます。このクラスをサブクラス化することで、その動作を堅牢化できます。しかし、コードを所有していない場合やパッチを待てない場合は、エージェントを使用して `java.io.ObjectInputStream` に堅牢化を織り込むことが最善の解決策です。

`ObjectInputStream` をグローバルに変更することは、既知の悪意ある型をブロックリスト化する場合にのみ安全です。これは、すべてのアプリケーションについて、デシリアライズされることを期待するクラスを知ることは不可能だからです。幸いなことに、現在知られているすべての攻撃ベクトルから安全であるために拒否リストに必要なクラスはごく少数です。

悪用可能な "gadget" クラスがさらに発見されることは避けられません。しかし、今日でも修正を必要とする脆弱なソフトウェアが非常に多く公開されています。場合によっては、脆弱性の「修正」とは、開発者がシリアライズされたオブジェクトを受け入れない方向へ移行する中で、メッセージングシステムを再設計し、後方互換性を壊すことを含むかもしれません。

これらのエージェントを有効にするには、新しい JVM パラメータを追加するだけです。

```text
-javaagent:name-of-agent.jar
```

このアプローチを取るエージェントが、さまざまなコミュニティメンバーによって公開されています。

- [rO0 by Contrast Security](https://github.com/Contrast-Security-OSS/contrast-rO0)

似ているもののスケールしにくいアプローチとして、JVM の ObjectInputStream を手動でパッチしてブートストラップする方法もあります。このアプローチに関するガイダンスは[こちら](https://github.com/wsargent/paranoid-java-serialization)で入手できます。

#### その他のデシリアライゼーションライブラリと形式

上記の助言は [Java の Serializable 形式](https://docs.oracle.com/javase/7/docs/api/java/io/Serializable.html)に焦点を当てていますが、デシリアライゼーションに他の形式を使用するライブラリは多数あります。これらのライブラリの多くは、正しく構成されていない場合、同様のセキュリティ問題を抱える可能性があります。このセクションでは、信頼できないデータをデシリアライズする際のセキュリティ問題を避けるために、これらのライブラリの一部と推奨構成オプションを示します。

**デフォルト構成で安全に使用可能:**

以下のライブラリはデフォルト構成で安全に使用できます。

- **[fastjson2](https://github.com/alibaba/fastjson2)** (JSON) - [**autotype**](https://github.com/alibaba/fastjson2/wiki/fastjson2_autotype_cn) オプションが有効になっていない限り、安全に使用できます。
- **[jackson-databind](https://github.com/FasterXML/jackson-databind)** (JSON) - ポリモーフィズムが使用されていない限り、安全に使用できます ([ブログ記事を参照](https://cowtowncoder.medium.com/on-jackson-cves-dont-panic-here-is-what-you-need-to-know-54cd0d6e8062))。
- **[Kryo v5.0.0+](https://github.com/EsotericSoftware/kryo)** (カスタム形式) - クラス登録がオフにされていない限り、安全に使用できます ([ドキュメント](https://github.com/EsotericSoftware/kryo#optional-registration)および[この issue](https://github.com/EsotericSoftware/kryo/issues/929)を参照)。
- **[YamlBeans v1.16+](https://github.com/EsotericSoftware/yamlbeans)** (YAML) - **UnsafeYamlConfig** クラスが使用されていない限り、安全に使用できます ([このコミット](https://github.com/EsotericSoftware/yamlbeans/commit/b1122588e7610ae4e0d516c50d08c94ee87946e6)を参照)。
    - *注: これらのバージョンは Maven Central で利用できないため、代わりに使用できる[フォーク](https://github.com/Contrast-Security-OSS/yamlbeans)が存在します。*
- **[XStream v1.4.17+](https://x-stream.github.io/)** (JSON および XML) - 許可リストとその他のセキュリティ制御が緩和されていない限り、安全に使用できます ([ドキュメントを参照](https://x-stream.github.io/security.html))。

**安全に使用するには事前構成が必要:**

以下のライブラリは、安全に使用する前に構成オプションを設定する必要があります。

- **[fastjson v1.2.68+](https://github.com/alibaba/fastjson)** (JSON) - 任意のクラスのデシリアライゼーションを無効にする [**safemode**](https://github.com/alibaba/fastjson/wiki/fastjson_safemode_en) オプションを有効にしない限り、安全に使用できません ([ドキュメントを参照](https://github.com/alibaba/fastjson/wiki/enable_autotype))。以前のバージョンは安全ではありません。
- **[json-io](https://github.com/jdereg/json-io)** (JSON) - JSON の **@type** プロパティを使用すると任意のクラスのデシリアライゼーションが可能になるため、安全に使用できません。以下の状況でのみ安全に使用できます。
    - 汎用オブジェクトのデシリアライゼーションをオフにする **JsonReader.USE_MAPS** 設定を使用した[非型付きモード](https://github.com/jdereg/json-io/blob/master/user-guide.md#non-typed-usage)
    - デシリアライズされるクラスを制御する[カスタムデシリアライザ](https://github.com/jdereg/json-io/blob/master/user-guide.md#customization-technique-4-custom-serializer)を使用する場合
- **[Kryo < v5.0.0](https://github.com/EsotericSoftware/kryo)** (カスタム形式) - 任意のクラスのデシリアライゼーションを無効にするクラス登録をオンにしない限り、安全に使用できません ([ドキュメント](https://github.com/EsotericSoftware/kryo#optional-registration)および[この issue](https://github.com/EsotericSoftware/kryo/issues/929)を参照)。
    - *注: Kryo の周辺には [Chill](https://github.com/twitter/chill) など他のラッパーが存在し、使用されている Kryo の基礎バージョンにかかわらず、デフォルトではクラス登録を要求しない場合もあります。*
- **[SnakeYAML](https://bitbucket.org/snakeyaml/snakeyaml/src)** (YAML) - 任意のクラスのデシリアライゼーションを無効にする **org.yaml.snakeyaml.constructor.SafeConstructor** クラスを使用しない限り、安全に使用できません ([ドキュメントを参照](https://bitbucket.org/snakeyaml/snakeyaml/wiki/CVE-2022-1471))。

**安全に使用できない:**

以下のライブラリは、メンテナンスされていないか、信頼できない入力に対して安全に使用できません。

- **[Castor](https://github.com/castor-data-binding/castor)** (XML) - 2016 年以降コミットがなく、放棄されているようです。
- **[fastjson < v1.2.68](https://github.com/alibaba/fastjson)** (JSON) - これらのバージョンでは任意のクラスのデシリアライゼーションが可能です ([ドキュメントを参照](https://github.com/alibaba/fastjson/wiki/enable_autotype))。
- **[XMLDecoder in the JDK](https://docs.oracle.com/javase/8/docs/api/java/beans/XMLDecoder.html)** (XML) - *"close to impossible to securely deserialize Java objects in this format from untrusted inputs"* ("Red Hat Defensive Coding Guide", [セクション 2.6.5 の末尾](https://redhat-crypto.gitlab.io/defensive-coding-guide/#sect-Defensive_Coding-Tasks-Serialization-XML))。
- **[XStream < v1.4.17](https://x-stream.github.io/)** (JSON および XML) - これらのバージョンでは任意のクラスのデシリアライゼーションが可能です ([ドキュメント](https://x-stream.github.io/security.html#explicit)を参照)。
- **[YamlBeans < v1.16](https://github.com/EsotericSoftware/yamlbeans)** (YAML) - これらのバージョンでは任意のクラスのデシリアライゼーションが可能です ([このドキュメント](https://github.com/Contrast-Security-OSS/yamlbeans/blob/main/SECURITY.md)を参照)。

### .Net CSharp

#### クリアボックスレビュー

以下の用語でソースコードを検索します。

1. `TypeNameHandling`
2. `JavaScriptTypeResolver`

型がユーザー制御変数によって設定されているシリアライザを探します。

#### オペークボックスレビュー

以下で始まる base64 エンコードされたコンテンツを検索します。

```text
AAEAAAD/////
```

以下のテキストを含むコンテンツを検索します。

1. `TypeObject`
2. `$type:`

#### 一般的な予防策

Microsoft は、`BinaryFormatter` 型は危険であり安全にできないと述べています。そのため、使用すべきではありません。詳細は [BinaryFormatter security guide](https://docs.microsoft.com/en-us/dotnet/standard/serialization/binaryformatter-security-guide) にあります。

データストリームが、デシリアライズ先となるオブジェクトの型を定義できるようにしてはいけません。可能であれば、たとえば `DataContractSerializer` または `XmlSerializer` を使用することで、これを防止できます。

`JSON.Net` を使用している場合は、`TypeNameHandling` が `None` にのみ設定されていることを確認します。

```csharp
TypeNameHandling = TypeNameHandling.None
```

`JavaScriptSerializer` を使用する場合は、`JavaScriptTypeResolver` とともに使用してはいけません。

独自の型を定義するデータストリームをどうしてもデシリアライズしなければならない場合は、デシリアライズを許可する型を制限します。ただし、多くのネイティブ .Net 型はそれ自体が潜在的に危険であるため、これには依然としてリスクがあることを認識する必要があります。例:

```csharp
System.IO.FileInfo
```

サーバー上に実際に存在するファイルを参照する `FileInfo` オブジェクトは、デシリアライズされると、それらのファイルのプロパティを読み取り専用に変更するなどして、潜在的なサービス拒否攻撃を引き起こす可能性があります。

デシリアライズ可能な型を制限していても、リスクのあるプロパティを持つ型があることを忘れないでください。たとえば `System.ComponentModel.DataAnnotations.ValidationException` には、`Object` 型の `Value` プロパティがあります。この型がデシリアライゼーションを許可された型である場合、攻撃者は `Value` プロパティを任意のオブジェクト型に設定できます。

攻撃者がインスタンス化される型を誘導できないようにする必要があります。これが可能であれば、`DataContractSerializer` や `XmlSerializer` でさえも破られる可能性があります。例:

```csharp
// Action below is dangerous if the attacker can change the data in the database
var typename = GetTransactionTypeFromDatabase();

var serializer = new DataContractJsonSerializer(Type.GetType(typename));

var obj = serializer.ReadObject(ms);
```

デシリアライゼーション中に特定の .Net 型内で実行が発生する可能性があります。以下に示すような制御を作成しても効果はありません。

```csharp
var suspectObject = myBinaryFormatter.Deserialize(untrustedData);

//Check below is too late! Execution may have already occurred.
if (suspectObject is SomeDangerousObjectType)
{
    //generate warnings and dispose of suspectObject
}
```

`JSON.Net` では、カスタム `SerializationBinder` を使用することで、より安全な許可リスト制御を作成できます。

既知の .Net の安全でないデシリアライゼーション gadget について最新情報を追跡し、そのような型がデシリアライゼーションプロセスによって作成され得る箇所には特に注意してください。**デシリアライザは、それが知っている型のみをインスタンス化できます**。

潜在的な gadget を作成する可能性のあるコードは、インターネット接続を持つコードから分離するよう努めます。たとえば WPF アプリケーションで使用される `System.Windows.Data.ObjectDataProvider` は、任意のメソッド呼び出しを可能にする既知の gadget です。信頼できないデータをデシリアライズする REST サービスプロジェクトで、このアセンブリへの参照を持つことはリスクがあります。

#### 既知の .NET RCE Gadget

- `System.Configuration.Install.AssemblyInstaller`
- `System.Activities.Presentation.WorkflowDesigner`
- `System.Windows.ResourceDictionary`
- `System.Windows.Data.ObjectDataProvider`
- `System.Windows.Forms.BindingSource`
- `Microsoft.Exchange.Management.SystemManager.WinForms.ExchangeSettingsProvider`
- `System.Data.DataViewManager, System.Xml.XmlDocument/XmlDataDocument`
- `System.Management.Automation.PSObject`

## 安全にデシリアライズするための言語非依存の方法

### 代替データ形式の使用

ネイティブな (デ)シリアライゼーション形式を避けることで、リスクは大きく低減されます。JSON や XML のような純粋なデータ形式に切り替えることで、カスタムデシリアライゼーションロジックが悪意ある目的に転用される可能性を下げられます。

多くのアプリケーションは、データ転送を明示的な目的とする別個のオブジェクト領域を作成する [data-transfer object pattern](https://en.wikipedia.org/wiki/Data_transfer_object) に依存しています。もちろん、純粋なデータオブジェクトが解析された後に、アプリケーションがセキュリティ上の誤りを犯す可能性は依然としてあります。

### 署名済みデータのみをデシリアライズする

アプリケーションが、どのメッセージを処理する必要があるかをデシリアライゼーション前に把握している場合、シリアライゼーションプロセスの一部としてそれらに署名できます。アプリケーションは、認証済み署名を持たないメッセージをデシリアライズしないことを選択できます。

## 緩和ツール/ライブラリ

- [Java secure deserialization library](https://github.com/ikkisoft/SerialKiller)
- [SWAT - tool for creating allowlists](https://github.com/cschneider4711/SWAT)
- [NotSoSerial](https://github.com/kantega/notsoserial)

## 検出ツール

- [Java deserialization cheat sheet aimed at pen testers](https://github.com/GrrrDog/Java-Deserialization-Cheat-Sheet)
- [A proof-of-concept tool for generating payloads that exploit unsafe Java object deserialization.](https://github.com/frohoff/ysoserial)
- [Java De-serialization toolkits](https://github.com/brianwrf/hackUtils)
- [Java de-serialization tool](https://github.com/frohoff/ysoserial)
- [.Net payload generator](https://github.com/pwntester/ysoserial.net)
- [Burp Suite extension](https://github.com/federicodotta/Java-Deserialization-Scanner/releases)
- [Java secure deserialization library](https://github.com/ikkisoft/SerialKiller)
- [Serianalyzer is a static bytecode analyzer for deserialization](https://github.com/mbechler/serianalyzer)
- [Payload generator](https://github.com/mbechler/marshalsec)
- [Android Java Deserialization Vulnerability Tester](https://github.com/modzero/modjoda)
- Burp Suite Extension
    - [JavaSerialKiller](https://github.com/NetSPI/JavaSerialKiller)
    - [Java Deserialization Scanner](https://github.com/federicodotta/Java-Deserialization-Scanner)
    - [Burp-ysoserial](https://github.com/summitt/burp-ysoserial)
    - [SuperSerial](https://github.com/DirectDefense/SuperSerial)
    - [SuperSerial-Active](https://github.com/DirectDefense/SuperSerial-Active)

## References

- [Java-Deserialization-Cheat-Sheet](https://github.com/GrrrDog/Java-Deserialization-Cheat-Sheet)
- [Deserialization of untrusted data](https://owasp.org/www-community/vulnerabilities/Deserialization_of_untrusted_data)
- [Java Deserialization Attacks - German OWASP Day 2016](https://cheatsheetseries.owasp.org/assets/Deserialization_Cheat_Sheet_GOD16Deserialization.pdf)
- [AppSecCali 2015 - Marshalling Pickles](http://www.slideshare.net/frohoff1/appseccali-2015-marshalling-pickles)
- [FoxGlove Security - Vulnerability Announcement](http://foxglovesecurity.com/2015/11/06/what-do-weblogic-websphere-jboss-jenkins-opennms-and-your-application-have-in-common-this-vulnerability/#websphere)
- [Java deserialization cheat sheet aimed at pen testers](https://github.com/GrrrDog/Java-Deserialization-Cheat-Sheet)
- [A proof-of-concept tool for generating payloads that exploit unsafe Java object deserialization.](https://github.com/frohoff/ysoserial)
- [Java De-serialization toolkits](https://github.com/brianwrf/hackUtils)
- [Java de-serialization tool](https://github.com/frohoff/ysoserial)
- [Burp Suite extension](https://github.com/federicodotta/Java-Deserialization-Scanner/releases)
- [Java secure deserialization library](https://github.com/ikkisoft/SerialKiller)
- [Serianalyzer is a static bytecode analyzer for deserialization](https://github.com/mbechler/serianalyzer)
- [Payload generator](https://github.com/mbechler/marshalsec)
- [Android Java Deserialization Vulnerability Tester](https://github.com/modzero/modjoda)
- Burp Suite Extension
    - [JavaSerialKiller](https://github.com/NetSPI/JavaSerialKiller)
    - [Java Deserialization Scanner](https://github.com/federicodotta/Java-Deserialization-Scanner)
    - [Burp-ysoserial](https://github.com/summitt/burp-ysoserial)
    - [SuperSerial](https://github.com/DirectDefense/SuperSerial)
    - [SuperSerial-Active](https://github.com/DirectDefense/SuperSerial-Active)
- .Net
    - [Alvaro Muñoz: .NET Serialization: Detecting and defending vulnerable endpoints](https://www.youtube.com/watch?v=qDoBlLwREYk)
    - [James Forshaw - Black Hat USA 2012 - Are You My Type? Breaking .net Sandboxes Through Serialization](https://www.youtube.com/watch?v=Xfbu-pQ1tIc)
    - [Jonathan Birch BlueHat v17 - Dangerous Contents - Securing .Net Deserialization](https://www.youtube.com/watch?v=oxlD8VWWHE8)
    - [Alvaro Muñoz & Oleksandr Mirosh - Friday the 13th: Attacking JSON - AppSecUSA 2017](https://www.youtube.com/watch?v=NqHsaVhlxAQ)
- Python
    - [Exploiting Insecure Deserialization bugs found in the Wild (Python Pickles)](https://macrosec.tech/index.php/2021/06/29/exploiting-insecuredeserialization-bugs-found-in-the-wild-python-pickles.)

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V1.5 | 信頼できないデータの安全なデシリアライゼーション、型制限、署名済みデータ、危険なライブラリ/形式の回避 |
