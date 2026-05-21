---
title: Deserialization Cheat Sheet
hide_title: true
---

<div className="docHero" data-category="encoding-and-sanitization">
  <h1>デシリアライゼーションチートシート</h1>
  <div className="docMeta">
    <span className="docPill">最終更新: 2026-05-20</span>
    <span className="docPill">読了時間: 約 15 分</span>
    <span className="docPill">カテゴリ: 入力検証とサニタイズ</span>
  </div>
</div>

<p className="docLead">デシリアライゼーションチートシートを、原文・翻訳・対比表示で確認できます。ASVS Index 対応の文脈で、公式原文と日本語訳を確認しやすく整理しています。</p>

<div className="tabbedContent">
  <input className="tabInput" type="radio" name="deserialization-view" id="deserialization-original" />
  <input className="tabInput" type="radio" name="deserialization-view" id="deserialization-translation" defaultChecked />
  <input className="tabInput" type="radio" name="deserialization-view" id="deserialization-bilingual" />

  <div className="contentTabs">
    <label htmlFor="deserialization-original" title="OWASP 原文">原文</label>
    <label htmlFor="deserialization-translation" title="日本語訳">翻訳</label>
    <label htmlFor="deserialization-bilingual" title="原文と翻訳を並べて確認">対比表示</label>
  </div>

<section id="deserialization-original-panel" className="tabPanel originalPanel contentPanel">

## Introduction

This article is focused on providing clear, actionable guidance for safely deserializing untrusted data in your applications.

## What is Deserialization

**Serialization** is the process of turning some object into a data format that can be restored later. People often serialize objects in order to save them for storage, or to send as part of communications.

**Deserialization** is the reverse of that process, taking data structured in some format, and rebuilding it into an object. Today, the most popular data format for serializing data is JSON. Before that, it was XML.

However, many programming languages have native ways to serialize objects. These native formats usually offer more features than JSON or XML, including customization of the serialization process.

Unfortunately, the features of these native deserialization mechanisms can sometimes be repurposed for malicious effect when operating on untrusted data. Attacks against deserializers have been found to allow denial-of-service, access control, or remote code execution (RCE) attacks.

## Guidance on Deserializing Objects Safely

The following language-specific guidance attempts to enumerate safe methodologies for deserializing data that can't be trusted.

### PHP

#### Clear-box Review

Check the use of [`unserialize()`](https://www.php.net/manual/en/function.unserialize.php) function and review how the external parameters are accepted. Use a safe, standard data interchange format such as JSON (via `json_decode()` and `json_encode()`) if you need to pass serialized data to the user.

### Python

#### Opaque-box Review

If the traffic data contains the symbol dot `.` at the end, it's very likely that the data was sent in serialization. It will be only true if the data is not being encoded using Base64 or Hexadecimal schemas. If the data is being encoded, then it's best to check if the serialization is likely happening or not by looking at the starting characters of the parameter value. For example if data is Base64 encoded, then it will most likely start with `gASV`.

#### Clear-box Review

The following API in Python will be vulnerable to serialization attack. Search code for the pattern below.

1. The uses of `pickle/c_pickle/_pickle` with `load/loads`:

```python
import pickle
data = """ cos.system(S'dir')tR. """
pickle.loads(data)
```

2. Uses of `PyYAML` with `load`:

```python
import yaml
document = "!!python/object/apply:os.system ['ipconfig']"
print(yaml.load(document))
```

3. Uses of `jsonpickle` with `encode` or `store` methods.

### Java

The following techniques are all good for preventing attacks against deserialization against [Java's Serializable format](https://docs.oracle.com/javase/7/docs/api/java/io/Serializable.html).

Implementation advice:

- In your code, override the `ObjectInputStream#resolveClass()` method to prevent arbitrary classes from being deserialized. This safe behavior can be wrapped in a library like [SerialKiller](https://github.com/ikkisoft/SerialKiller).
- Use a safe replacement for the generic `readObject()` method as seen here. Note that this addresses "[billion laughs](https://en.wikipedia.org/wiki/Billion_laughs_attack)" type attacks by checking input length and number of objects deserialized.

#### Clear-box Review

Be aware of the following Java API uses for potential serialization vulnerability.

1. `XMLdecoder` with external user defined parameters

2. `XStream` with `fromXML` method (xstream version &lt;= v1.4.6 is vulnerable to the serialization issue)

3. `ObjectInputStream` with `readObject`

4. Uses of `readObject`, `readObjectNoData`, `readResolve` or `readExternal`

5. `ObjectInputStream.readUnshared`

6. `Serializable`

#### Opaque-box Review

If the captured traffic data includes the following patterns, it may suggest that the data was sent in Java serialization streams:

- `AC ED 00 05` in Hex
- `rO0` in Base64
- `Content-type` header of an HTTP response set to `application/x-java-serialized-object`

#### Prevent Data Leakage and Trusted Field Clobbering

If there are data members of an object that should never be controlled by end users during deserialization or exposed to users during serialization, they should be declared as [the `transient` keyword](https://docs.oracle.com/javase/7/docs/platform/serialization/spec/serial-arch.html#7231) (section *Protecting Sensitive Information*).

For a class that defined as Serializable, the sensitive information variable should be declared as `private transient`.

For example, the class `myAccount`, the variables 'profit' and 'margin' were declared as transient to prevent them from being serialized.

```java
public class myAccount implements Serializable
{
    private transient double profit; // declared transient

    private transient double margin; // declared transient
    ....
```

#### Prevent Deserialization of Domain Objects

Some of your application objects may be forced to implement `Serializable` due to their hierarchy. To guarantee that your application objects can't be deserialized, a `readObject()` method should be declared (with a `final` modifier) which always throws an exception:

```java
private final void readObject(ObjectInputStream in) throws java.io.IOException {
    throw new java.io.IOException("Cannot be deserialized");
}
```

#### Harden Your Own java.io.ObjectInputStream

The `java.io.ObjectInputStream` class is used to deserialize objects. It's possible to harden its behavior by subclassing it. This is the best solution if:

- you can change the code that does the deserialization;
- you know what classes you expect to deserialize.

The general idea is to override [`ObjectInputStream.html#resolveClass()`](http://docs.oracle.com/javase/7/docs/api/java/io/ObjectInputStream.html#resolveClass%28java.io.ObjectStreamClass)) in order to restrict which classes are allowed to be deserialized.

Because this call happens before a `readObject()` is called, you can be sure that no deserialization activity will occur unless the type is one that you allow.

A simple example is shown here, where the `LookAheadObjectInputStream` class is guaranteed to **not** deserialize any other type besides the `Bicycle` class:

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

More complete implementations of this approach have been proposed by various community members:

- [NibbleSec](https://github.com/ikkisoft/SerialKiller) - a library that allows creating lists of classes that are allowed to be deserialized
- [IBM](https://www.ibm.com/developerworks/library/se-lookahead/) - the seminal protection, written years before the most devastating exploitation scenarios were envisioned.
- [Apache Commons IO classes](https://commons.apache.org/proper/commons-io/javadocs/api-2.5/org/apache/commons/io/serialization/ValidatingObjectInputStream.html)

#### Harden All java.io.ObjectInputStream Usage with an Agent

As mentioned above, the `java.io.ObjectInputStream` class is used to deserialize objects. It's possible to harden its behavior by subclassing it. However, if you don't own the code or can't wait for a patch, using an agent to weave in hardening to `java.io.ObjectInputStream` is the best solution.

Globally changing `ObjectInputStream` is only safe for block-listing known malicious types, because it's not possible to know for all applications what the expected classes to be deserialized are. Fortunately, there are very few classes needed in the denylist to be safe from all the known attack vectors, today.

It's inevitable that more "gadget" classes will be discovered that can be abused. However, there is an incredible amount of vulnerable software exposed today, in need of a fix. In some cases, "fixing" the vulnerability may involve re-architecting messaging systems and breaking backwards compatibility as developers move towards not accepting serialized objects.

To enable these agents, simply add a new JVM parameter:

```text
-javaagent:name-of-agent.jar
```

Agents taking this approach have been released by various community members:

- [rO0 by Contrast Security](https://github.com/Contrast-Security-OSS/contrast-rO0)

A similar, but less scalable approach would be to manually patch and bootstrap your JVM's ObjectInputStream. Guidance on this approach is available [here](https://github.com/wsargent/paranoid-java-serialization).

#### Other Deserialization Libraries and Formats

While the advice above is focused on [Java's Serializable format](https://docs.oracle.com/javase/7/docs/api/java/io/Serializable.html), there are a number of other libraries
that use other formats for deserialization. Many of these libraries may have similar security
issues if not configured correctly. This section lists some of these libraries and
recommended configuration options to avoid security issues when deserializing untrusted data:

**Can be used safely with default configuration:**

The following libraries can be used safely with default configuration:

- **[fastjson2](https://github.com/alibaba/fastjson2)** (JSON) - can be used safely as long as
the [**autotype**](https://github.com/alibaba/fastjson2/wiki/fastjson2_autotype_cn) option is not turned on
- **[jackson-databind](https://github.com/FasterXML/jackson-databind)** (JSON) - can be used safely as long
as polymorphism is not used ([see blog post](https://cowtowncoder.medium.com/on-jackson-cves-dont-panic-here-is-what-you-need-to-know-54cd0d6e8062))
- **[Kryo v5.0.0+](https://github.com/EsotericSoftware/kryo)** (custom format) - can be used safely
as long as class registration is not turned **off** ([see documentation](https://github.com/EsotericSoftware/kryo#optional-registration)
and [this issue](https://github.com/EsotericSoftware/kryo/issues/929))
- **[YamlBeans v1.16+](https://github.com/EsotericSoftware/yamlbeans)** (YAML) - can be used safely
as long as the **UnsafeYamlConfig** class isn't used (see [this commit](https://github.com/EsotericSoftware/yamlbeans/commit/b1122588e7610ae4e0d516c50d08c94ee87946e6))
    - *NOTE: because these versions are not available in Maven Central,
[a fork exists](https://github.com/Contrast-Security-OSS/yamlbeans) that can be used instead.*
- **[XStream v1.4.17+](https://x-stream.github.io/)** (JSON and XML) - can be used safely
as long as the allowlist and other security controls are not relaxed ([see documentation](https://x-stream.github.io/security.html))

**Requires configuration before can be used safely:**

The following libraries require configuration options to be set before they can be used safely:

- **[fastjson v1.2.68+](https://github.com/alibaba/fastjson)** (JSON) - cannot be used safely unless
the [**safemode**](https://github.com/alibaba/fastjson/wiki/fastjson_safemode_en) option is turned on, which disables
deserialization of any class ([see documentation](https://github.com/alibaba/fastjson/wiki/enable_autotype)).
Previous versions are not safe.
- **[json-io](https://github.com/jdereg/json-io)** (JSON) - cannot be used safely since the use of **@type** property in
JSON allows deserialization of any class. Can only be used safely in following situations:
    - In [non-typed mode](https://github.com/jdereg/json-io/blob/master/user-guide.md#non-typed-usage) using the **JsonReader.USE_MAPS** setting which turns off generic object deserialization
    - [With a custom deserializer](https://github.com/jdereg/json-io/blob/master/user-guide.md#customization-technique-4-custom-serializer) controlling which classes get deserialized
- **[Kryo < v5.0.0](https://github.com/EsotericSoftware/kryo)** (custom format) - cannot be used safely unless class registration is turned **on**,
which disables deserialization of any class ([see documentation](https://github.com/EsotericSoftware/kryo#optional-registration)
and [this issue](https://github.com/EsotericSoftware/kryo/issues/929))
    - *NOTE: other wrappers exist around Kryo such as [Chill](https://github.com/twitter/chill), which may also have class registration
not required by default regardless of the underlying version of Kryo being used*
- **[SnakeYAML](https://bitbucket.org/snakeyaml/snakeyaml/src)** (YAML) - cannot be used safely unless
the **org.yaml.snakeyaml.constructor.SafeConstructor** class is used, which disables
deserialization of any class ([see docs](https://bitbucket.org/snakeyaml/snakeyaml/wiki/CVE-2022-1471))

**Cannot be used safely:**

The following libraries are either no longer maintained or cannot be used safely with untrusted input:

- **[Castor](https://github.com/castor-data-binding/castor)** (XML) - appears to be abandoned with no commits since 2016
- **[fastjson < v1.2.68](https://github.com/alibaba/fastjson)** (JSON) - these versions allows deserialization of any class
([see documentation](https://github.com/alibaba/fastjson/wiki/enable_autotype))
- **[XMLDecoder in the JDK](https://docs.oracle.com/javase/8/docs/api/java/beans/XMLDecoder.html)** (XML) - *"close to impossible to securely deserialize Java objects in this format from untrusted inputs"*
("Red Hat Defensive Coding Guide", [end of section 2.6.5](https://redhat-crypto.gitlab.io/defensive-coding-guide/#sect-Defensive_Coding-Tasks-Serialization-XML))
- **[XStream < v1.4.17](https://x-stream.github.io/)** (JSON and XML) - these versions allows deserialization of any class (see [documentation](https://x-stream.github.io/security.html#explicit))
- **[YamlBeans < v1.16](https://github.com/EsotericSoftware/yamlbeans)** (YAML) - these versions allows deserialization of any class
(see [this document](https://github.com/Contrast-Security-OSS/yamlbeans/blob/main/SECURITY.md))

### .Net CSharp

#### Clear-box Review

Search the source code for the following terms:

1. `TypeNameHandling`
2. `JavaScriptTypeResolver`

Look for any serializers where the type is set by a user controlled variable.

#### Opaque-box Review

Search for the following base64 encoded content that starts with:

```text
AAEAAAD/////
```

Search for content with the following text:

1. `TypeObject`
2. `$type:`

#### General Precautions

Microsoft has stated that the `BinaryFormatter` type is dangerous and cannot be secured. As such, it should not be used. Full details are in the [BinaryFormatter security guide](https://docs.microsoft.com/en-us/dotnet/standard/serialization/binaryformatter-security-guide).

Don't allow the datastream to define the type of object that the stream will be deserialized to. You can prevent this by for example using the `DataContractSerializer` or `XmlSerializer` if at all possible.

Where `JSON.Net` is being used make sure the `TypeNameHandling` is only set to `None`.

```csharp
TypeNameHandling = TypeNameHandling.None
```

If `JavaScriptSerializer` is to be used then do not use it with a `JavaScriptTypeResolver`.

If you must deserialize data streams that define their own type, then restrict the types that are allowed to be deserialized. One should be aware that this is still risky as many native .Net types potentially dangerous in themselves. e.g.

```csharp
System.IO.FileInfo
```

`FileInfo` objects that reference files actually on the server can when deserialized, change the properties of those files e.g. to read-only, creating a potential denial of service attack.

Even if you have limited the types that can be deserialized remember that some types have properties that are risky. `System.ComponentModel.DataAnnotations.ValidationException`, for example has a property `Value` of type `Object`. if this type is the type allowed for deserialization then an attacker can set the `Value` property to any object type they choose.

Attackers should be prevented from steering the type that will be instantiated. If this is possible then even `DataContractSerializer` or `XmlSerializer` can be subverted e.g.

```csharp
// Action below is dangerous if the attacker can change the data in the database
var typename = GetTransactionTypeFromDatabase();

var serializer = new DataContractJsonSerializer(Type.GetType(typename));

var obj = serializer.ReadObject(ms);
```

Execution can occur within certain .Net types during deserialization. Creating a control such as the one shown below is ineffective.

```csharp
var suspectObject = myBinaryFormatter.Deserialize(untrustedData);

//Check below is too late! Execution may have already occurred.
if (suspectObject is SomeDangerousObjectType)
{
    //generate warnings and dispose of suspectObject
}
```

For `JSON.Net` it is possible to create a safer form of allow-list control using a custom `SerializationBinder`.

Try to keep up-to-date on known .Net insecure deserialization gadgets and pay special attention where such types can be created by your deserialization processes. **A deserializer can only instantiate types that it knows about**.

Try to keep any code that might create potential gadgets separate from any code that has internet connectivity. As an example `System.Windows.Data.ObjectDataProvider` used in WPF applications is a known gadget that allows arbitrary method invocation. It would be risky to have this a reference to this assembly in a REST service project that deserializes untrusted data.

#### Known .NET RCE Gadgets

- `System.Configuration.Install.AssemblyInstaller`
- `System.Activities.Presentation.WorkflowDesigner`
- `System.Windows.ResourceDictionary`
- `System.Windows.Data.ObjectDataProvider`
- `System.Windows.Forms.BindingSource`
- `Microsoft.Exchange.Management.SystemManager.WinForms.ExchangeSettingsProvider`
- `System.Data.DataViewManager, System.Xml.XmlDocument/XmlDataDocument`
- `System.Management.Automation.PSObject`

## Language-Agnostic Methods for Deserializing Safely

### Using Alternative Data Formats

A great reduction of risk is achieved by avoiding native (de)serialization formats. By switching to a pure data format like JSON or XML, you lessen the chance of custom deserialization logic being repurposed towards malicious ends.

Many applications rely on a [data-transfer object pattern](https://en.wikipedia.org/wiki/Data_transfer_object) that involves creating a separate domain of objects for the explicit purpose data transfer. Of course, it's still possible that the application will make security mistakes after a pure data object is parsed.

### Only Deserialize Signed Data

If the application knows before deserialization which messages will need to be processed, they could sign them as part of the serialization process. The application could then to choose not to deserialize any message which didn't have an authenticated signature.

## Mitigation Tools/Libraries

- [Java secure deserialization library](https://github.com/ikkisoft/SerialKiller)
- [SWAT - tool for creating allowlists](https://github.com/cschneider4711/SWAT)
- [NotSoSerial](https://github.com/kantega/notsoserial)

## Detection Tools

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

</section>

<section id="deserialization-translation-panel" className="tabPanel translationPanel contentPanel">

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

2. `fromXML` メソッドを伴う `XStream` (xstream バージョン &lt;= v1.4.6 はシリアライゼーションの問題に対して脆弱です)

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

</section>

<section id="deserialization-bilingual-panel" className="tabPanel bilingualPanel">

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Introduction

This article is focused on providing clear, actionable guidance for safely deserializing untrusted data in your applications.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## はじめに

この記事は、アプリケーションで信頼できないデータを安全にデシリアライズするための、明確で実行可能なガイダンスを提供することに焦点を当てています。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## What is Deserialization

**Serialization** is the process of turning some object into a data format that can be restored later. People often serialize objects in order to save them for storage, or to send as part of communications.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## デシリアライゼーションとは

**シリアライゼーション**とは、何らかのオブジェクトを、後で復元できるデータ形式に変換するプロセスです。オブジェクトは、保存のため、または通信の一部として送信するためにシリアライズされることがよくあります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Deserialization** is the reverse of that process, taking data structured in some format, and rebuilding it into an object. Today, the most popular data format for serializing data is JSON. Before that, it was XML.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**デシリアライゼーション**はその逆のプロセスであり、何らかの形式で構造化されたデータを受け取り、それをオブジェクトとして再構築します。現在、データのシリアライズに最もよく使われているデータ形式は JSON です。その前は XML でした。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

However, many programming languages have native ways to serialize objects. These native formats usually offer more features than JSON or XML, including customization of the serialization process.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

しかし、多くのプログラミング言語には、オブジェクトをシリアライズするためのネイティブな方法があります。これらのネイティブ形式は通常、JSON や XML より多くの機能を備えており、シリアライゼーションプロセスのカスタマイズも含まれます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Unfortunately, the features of these native deserialization mechanisms can sometimes be repurposed for malicious effect when operating on untrusted data. Attacks against deserializers have been found to allow denial-of-service, access control, or remote code execution (RCE) attacks.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

残念ながら、これらのネイティブなデシリアライゼーション機構の機能は、信頼できないデータを処理する際に、悪意ある効果のために転用されることがあります。デシリアライザに対する攻撃では、サービス拒否、アクセス制御、またはリモートコード実行 (RCE) 攻撃が可能になることが確認されています。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Guidance on Deserializing Objects Safely

The following language-specific guidance attempts to enumerate safe methodologies for deserializing data that can't be trusted.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## オブジェクトを安全にデシリアライズするためのガイダンス

以下の言語別ガイダンスでは、信頼できないデータをデシリアライズするための安全な方法を列挙することを試みています。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### PHP

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### PHP

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Clear-box Review

Check the use of [`unserialize()`](https://www.php.net/manual/en/function.unserialize.php) function and review how the external parameters are accepted. Use a safe, standard data interchange format such as JSON (via `json_decode()` and `json_encode()`) if you need to pass serialized data to the user.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### クリアボックスレビュー

[`unserialize()`](https://www.php.net/manual/en/function.unserialize.php) 関数の使用を確認し、外部パラメータがどのように受け入れられているかをレビューします。シリアライズされたデータをユーザーに渡す必要がある場合は、`json_decode()` と `json_encode()` を介した JSON など、安全で標準的なデータ交換形式を使用します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Python

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Python

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Opaque-box Review

If the traffic data contains the symbol dot `.` at the end, it's very likely that the data was sent in serialization. It will be only true if the data is not being encoded using Base64 or Hexadecimal schemas. If the data is being encoded, then it's best to check if the serialization is likely happening or not by looking at the starting characters of the parameter value. For example if data is Base64 encoded, then it will most likely start with `gASV`.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### オペークボックスレビュー

トラフィックデータの末尾にドット記号 `.` が含まれる場合、そのデータはシリアライゼーションで送信された可能性が非常に高いです。これは、データが Base64 または Hexadecimal スキーマでエンコードされていない場合にのみ当てはまります。データがエンコードされている場合は、パラメータ値の先頭文字を見て、シリアライゼーションが行われている可能性があるかどうかを確認するのが最善です。たとえば、データが Base64 エンコードされている場合、ほとんどの場合 `gASV` で始まります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Clear-box Review

The following API in Python will be vulnerable to serialization attack. Search code for the pattern below.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### クリアボックスレビュー

Python の以下の API はシリアライゼーション攻撃に対して脆弱になります。以下のパターンでコードを検索します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

1. The uses of `pickle/c_pickle/_pickle` with `load/loads`:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

1. `pickle/c_pickle/_pickle` と `load/loads` の使用:

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```python
import pickle
data = """ cos.system(S'dir')tR. """
pickle.loads(data)
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

2. Uses of `PyYAML` with `load`:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

2. `PyYAML` と `load` の使用:

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```python
import yaml
document = "!!python/object/apply:os.system ['ipconfig']"
print(yaml.load(document))
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

3. Uses of `jsonpickle` with `encode` or `store` methods.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

3. `jsonpickle` と `encode` または `store` メソッドの使用。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Java

The following techniques are all good for preventing attacks against deserialization against [Java's Serializable format](https://docs.oracle.com/javase/7/docs/api/java/io/Serializable.html).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Java

以下の手法はすべて、[Java の Serializable 形式](https://docs.oracle.com/javase/7/docs/api/java/io/Serializable.html)に対するデシリアライゼーション攻撃を防止するうえで有効です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Implementation advice:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

実装上の助言:

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- In your code, override the `ObjectInputStream#resolveClass()` method to prevent arbitrary classes from being deserialized. This safe behavior can be wrapped in a library like [SerialKiller](https://github.com/ikkisoft/SerialKiller).
- Use a safe replacement for the generic `readObject()` method as seen here. Note that this addresses "[billion laughs](https://en.wikipedia.org/wiki/Billion_laughs_attack)" type attacks by checking input length and number of objects deserialized.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- コード内で `ObjectInputStream#resolveClass()` メソッドをオーバーライドし、任意のクラスがデシリアライズされないようにします。この安全な動作は、[SerialKiller](https://github.com/ikkisoft/SerialKiller) のようなライブラリでラップできます。
- ここで示すように、汎用的な `readObject()` メソッドの安全な代替を使用します。これは、入力長とデシリアライズされるオブジェクト数を確認することで、"[billion laughs](https://en.wikipedia.org/wiki/Billion_laughs_attack)" 型の攻撃に対処する点に注意してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Clear-box Review

Be aware of the following Java API uses for potential serialization vulnerability.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### クリアボックスレビュー

潜在的なシリアライゼーション脆弱性として、以下の Java API の使用に注意してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

1. `XMLdecoder` with external user defined parameters

2. `XStream` with `fromXML` method (xstream version &lt;= v1.4.6 is vulnerable to the serialization issue)

3. `ObjectInputStream` with `readObject`

4. Uses of `readObject`, `readObjectNoData`, `readResolve` or `readExternal`

5. `ObjectInputStream.readUnshared`

6. `Serializable`

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

1. 外部のユーザー定義パラメータを伴う `XMLdecoder`

2. `fromXML` メソッドを伴う `XStream` (xstream バージョン &lt;= v1.4.6 はシリアライゼーションの問題に対して脆弱です)

3. `readObject` を伴う `ObjectInputStream`

4. `readObject`、`readObjectNoData`、`readResolve` または `readExternal` の使用

5. `ObjectInputStream.readUnshared`

6. `Serializable`

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Opaque-box Review

If the captured traffic data includes the following patterns, it may suggest that the data was sent in Java serialization streams:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### オペークボックスレビュー

キャプチャしたトラフィックデータに以下のパターンが含まれる場合、そのデータが Java シリアライゼーションストリームで送信されたことを示している可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- `AC ED 00 05` in Hex
- `rO0` in Base64
- `Content-type` header of an HTTP response set to `application/x-java-serialized-object`

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- Hex の `AC ED 00 05`
- Base64 の `rO0`
- HTTP レスポンスの `Content-type` ヘッダーが `application/x-java-serialized-object` に設定されている

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Prevent Data Leakage and Trusted Field Clobbering

If there are data members of an object that should never be controlled by end users during deserialization or exposed to users during serialization, they should be declared as [the `transient` keyword](https://docs.oracle.com/javase/7/docs/platform/serialization/spec/serial-arch.html#7231) (section *Protecting Sensitive Information*).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### データ漏洩と信頼済みフィールドの上書きを防止する

デシリアライゼーション中にエンドユーザーが制御してはならない、またはシリアライゼーション中にユーザーへ露出してはならないオブジェクトのデータメンバーがある場合、それらは [`transient` キーワード](https://docs.oracle.com/javase/7/docs/platform/serialization/spec/serial-arch.html#7231) (セクション *Protecting Sensitive Information*) として宣言する必要があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

For a class that defined as Serializable, the sensitive information variable should be declared as `private transient`.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Serializable として定義されたクラスでは、機密情報の変数を `private transient` として宣言する必要があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

For example, the class `myAccount`, the variables 'profit' and 'margin' were declared as transient to prevent them from being serialized.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

たとえば、`myAccount` クラスでは、変数 'profit' と 'margin' がシリアライズされないように transient として宣言されています。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```java
public class myAccount implements Serializable
{
    private transient double profit; // declared transient

    private transient double margin; // declared transient
    ....
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Prevent Deserialization of Domain Objects

Some of your application objects may be forced to implement `Serializable` due to their hierarchy. To guarantee that your application objects can't be deserialized, a `readObject()` method should be declared (with a `final` modifier) which always throws an exception:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### ドメインオブジェクトのデシリアライゼーションを防止する

アプリケーションオブジェクトの一部は、その階層のために `Serializable` の実装を強制される場合があります。アプリケーションオブジェクトがデシリアライズされないことを保証するには、常に例外をスローする `readObject()` メソッドを `final` 修飾子付きで宣言する必要があります。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```java
private final void readObject(ObjectInputStream in) throws java.io.IOException {
    throw new java.io.IOException("Cannot be deserialized");
}
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Harden Your Own java.io.ObjectInputStream

The `java.io.ObjectInputStream` class is used to deserialize objects. It's possible to harden its behavior by subclassing it. This is the best solution if:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 独自の java.io.ObjectInputStream を堅牢化する

`java.io.ObjectInputStream` クラスはオブジェクトをデシリアライズするために使用されます。このクラスをサブクラス化することで、その動作を堅牢化できます。これは、以下の場合に最善の解決策です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- you can change the code that does the deserialization;
- you know what classes you expect to deserialize.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- デシリアライゼーションを行うコードを変更できる。
- デシリアライズされることを期待するクラスが分かっている。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The general idea is to override [`ObjectInputStream.html#resolveClass()`](http://docs.oracle.com/javase/7/docs/api/java/io/ObjectInputStream.html#resolveClass%28java.io.ObjectStreamClass)) in order to restrict which classes are allowed to be deserialized.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

一般的な考え方は、デシリアライズを許可するクラスを制限するために [`ObjectInputStream.html#resolveClass()`](http://docs.oracle.com/javase/7/docs/api/java/io/ObjectInputStream.html#resolveClass%28java.io.ObjectStreamClass)) をオーバーライドすることです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Because this call happens before a `readObject()` is called, you can be sure that no deserialization activity will occur unless the type is one that you allow.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

この呼び出しは `readObject()` が呼び出される前に発生するため、許可した型でない限り、デシリアライゼーション処理が発生しないことを保証できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

A simple example is shown here, where the `LookAheadObjectInputStream` class is guaranteed to **not** deserialize any other type besides the `Bicycle` class:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

ここでは単純な例として、`LookAheadObjectInputStream` クラスが `Bicycle` クラス以外の型をデシリアライズしないことを保証する例を示します。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

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

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

More complete implementations of this approach have been proposed by various community members:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

このアプローチのより完全な実装が、さまざまなコミュニティメンバーによって提案されています。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- [NibbleSec](https://github.com/ikkisoft/SerialKiller) - a library that allows creating lists of classes that are allowed to be deserialized
- [IBM](https://www.ibm.com/developerworks/library/se-lookahead/) - the seminal protection, written years before the most devastating exploitation scenarios were envisioned.
- [Apache Commons IO classes](https://commons.apache.org/proper/commons-io/javadocs/api-2.5/org/apache/commons/io/serialization/ValidatingObjectInputStream.html)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- [NibbleSec](https://github.com/ikkisoft/SerialKiller) - デシリアライズを許可するクラスのリストを作成できるライブラリ
- [IBM](https://www.ibm.com/developerworks/library/se-lookahead/) - 最も破壊的な悪用シナリオが想定される何年も前に書かれた、先駆的な防御策。
- [Apache Commons IO classes](https://commons.apache.org/proper/commons-io/javadocs/api-2.5/org/apache/commons/io/serialization/ValidatingObjectInputStream.html)

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Harden All java.io.ObjectInputStream Usage with an Agent

As mentioned above, the `java.io.ObjectInputStream` class is used to deserialize objects. It's possible to harden its behavior by subclassing it. However, if you don't own the code or can't wait for a patch, using an agent to weave in hardening to `java.io.ObjectInputStream` is the best solution.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### エージェントで java.io.ObjectInputStream のすべての使用を堅牢化する

前述のとおり、`java.io.ObjectInputStream` クラスはオブジェクトをデシリアライズするために使用されます。このクラスをサブクラス化することで、その動作を堅牢化できます。しかし、コードを所有していない場合やパッチを待てない場合は、エージェントを使用して `java.io.ObjectInputStream` に堅牢化を織り込むことが最善の解決策です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Globally changing `ObjectInputStream` is only safe for block-listing known malicious types, because it's not possible to know for all applications what the expected classes to be deserialized are. Fortunately, there are very few classes needed in the denylist to be safe from all the known attack vectors, today.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

`ObjectInputStream` をグローバルに変更することは、既知の悪意ある型をブロックリスト化する場合にのみ安全です。これは、すべてのアプリケーションについて、デシリアライズされることを期待するクラスを知ることは不可能だからです。幸いなことに、現在知られているすべての攻撃ベクトルから安全であるために拒否リストに必要なクラスはごく少数です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

It's inevitable that more "gadget" classes will be discovered that can be abused. However, there is an incredible amount of vulnerable software exposed today, in need of a fix. In some cases, "fixing" the vulnerability may involve re-architecting messaging systems and breaking backwards compatibility as developers move towards not accepting serialized objects.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

悪用可能な "gadget" クラスがさらに発見されることは避けられません。しかし、今日でも修正を必要とする脆弱なソフトウェアが非常に多く公開されています。場合によっては、脆弱性の「修正」とは、開発者がシリアライズされたオブジェクトを受け入れない方向へ移行する中で、メッセージングシステムを再設計し、後方互換性を壊すことを含むかもしれません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

To enable these agents, simply add a new JVM parameter:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

これらのエージェントを有効にするには、新しい JVM パラメータを追加するだけです。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```text
-javaagent:name-of-agent.jar
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Agents taking this approach have been released by various community members:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

このアプローチを取るエージェントが、さまざまなコミュニティメンバーによって公開されています。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- [rO0 by Contrast Security](https://github.com/Contrast-Security-OSS/contrast-rO0)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- [rO0 by Contrast Security](https://github.com/Contrast-Security-OSS/contrast-rO0)

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

A similar, but less scalable approach would be to manually patch and bootstrap your JVM's ObjectInputStream. Guidance on this approach is available [here](https://github.com/wsargent/paranoid-java-serialization).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

似ているもののスケールしにくいアプローチとして、JVM の ObjectInputStream を手動でパッチしてブートストラップする方法もあります。このアプローチに関するガイダンスは[こちら](https://github.com/wsargent/paranoid-java-serialization)で入手できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Other Deserialization Libraries and Formats

While the advice above is focused on [Java's Serializable format](https://docs.oracle.com/javase/7/docs/api/java/io/Serializable.html), there are a number of other libraries
that use other formats for deserialization. Many of these libraries may have similar security
issues if not configured correctly. This section lists some of these libraries and
recommended configuration options to avoid security issues when deserializing untrusted data:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### その他のデシリアライゼーションライブラリと形式

上記の助言は [Java の Serializable 形式](https://docs.oracle.com/javase/7/docs/api/java/io/Serializable.html)に焦点を当てていますが、デシリアライゼーションに他の形式を使用するライブラリは多数あります。これらのライブラリの多くは、正しく構成されていない場合、同様のセキュリティ問題を抱える可能性があります。このセクションでは、信頼できないデータをデシリアライズする際のセキュリティ問題を避けるために、これらのライブラリの一部と推奨構成オプションを示します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Can be used safely with default configuration:**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**デフォルト構成で安全に使用可能:**

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The following libraries can be used safely with default configuration:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

以下のライブラリはデフォルト構成で安全に使用できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- **[fastjson2](https://github.com/alibaba/fastjson2)** (JSON) - can be used safely as long as
the [**autotype**](https://github.com/alibaba/fastjson2/wiki/fastjson2_autotype_cn) option is not turned on
- **[jackson-databind](https://github.com/FasterXML/jackson-databind)** (JSON) - can be used safely as long
as polymorphism is not used ([see blog post](https://cowtowncoder.medium.com/on-jackson-cves-dont-panic-here-is-what-you-need-to-know-54cd0d6e8062))
- **[Kryo v5.0.0+](https://github.com/EsotericSoftware/kryo)** (custom format) - can be used safely
as long as class registration is not turned **off** ([see documentation](https://github.com/EsotericSoftware/kryo#optional-registration)
and [this issue](https://github.com/EsotericSoftware/kryo/issues/929))
- **[YamlBeans v1.16+](https://github.com/EsotericSoftware/yamlbeans)** (YAML) - can be used safely
as long as the **UnsafeYamlConfig** class isn't used (see [this commit](https://github.com/EsotericSoftware/yamlbeans/commit/b1122588e7610ae4e0d516c50d08c94ee87946e6))
    - *NOTE: because these versions are not available in Maven Central,
[a fork exists](https://github.com/Contrast-Security-OSS/yamlbeans) that can be used instead.*
- **[XStream v1.4.17+](https://x-stream.github.io/)** (JSON and XML) - can be used safely
as long as the allowlist and other security controls are not relaxed ([see documentation](https://x-stream.github.io/security.html))

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- **[fastjson2](https://github.com/alibaba/fastjson2)** (JSON) - [**autotype**](https://github.com/alibaba/fastjson2/wiki/fastjson2_autotype_cn) オプションが有効になっていない限り、安全に使用できます。
- **[jackson-databind](https://github.com/FasterXML/jackson-databind)** (JSON) - ポリモーフィズムが使用されていない限り、安全に使用できます ([ブログ記事を参照](https://cowtowncoder.medium.com/on-jackson-cves-dont-panic-here-is-what-you-need-to-know-54cd0d6e8062))。
- **[Kryo v5.0.0+](https://github.com/EsotericSoftware/kryo)** (カスタム形式) - クラス登録がオフにされていない限り、安全に使用できます ([ドキュメント](https://github.com/EsotericSoftware/kryo#optional-registration)および[この issue](https://github.com/EsotericSoftware/kryo/issues/929)を参照)。
- **[YamlBeans v1.16+](https://github.com/EsotericSoftware/yamlbeans)** (YAML) - **UnsafeYamlConfig** クラスが使用されていない限り、安全に使用できます ([このコミット](https://github.com/EsotericSoftware/yamlbeans/commit/b1122588e7610ae4e0d516c50d08c94ee87946e6)を参照)。
    - *注: これらのバージョンは Maven Central で利用できないため、代わりに使用できる[フォーク](https://github.com/Contrast-Security-OSS/yamlbeans)が存在します。*
- **[XStream v1.4.17+](https://x-stream.github.io/)** (JSON および XML) - 許可リストとその他のセキュリティ制御が緩和されていない限り、安全に使用できます ([ドキュメントを参照](https://x-stream.github.io/security.html))。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Requires configuration before can be used safely:**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**安全に使用するには事前構成が必要:**

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The following libraries require configuration options to be set before they can be used safely:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

以下のライブラリは、安全に使用する前に構成オプションを設定する必要があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- **[fastjson v1.2.68+](https://github.com/alibaba/fastjson)** (JSON) - cannot be used safely unless
the [**safemode**](https://github.com/alibaba/fastjson/wiki/fastjson_safemode_en) option is turned on, which disables
deserialization of any class ([see documentation](https://github.com/alibaba/fastjson/wiki/enable_autotype)).
Previous versions are not safe.
- **[json-io](https://github.com/jdereg/json-io)** (JSON) - cannot be used safely since the use of **@type** property in
JSON allows deserialization of any class. Can only be used safely in following situations:
    - In [non-typed mode](https://github.com/jdereg/json-io/blob/master/user-guide.md#non-typed-usage) using the **JsonReader.USE_MAPS** setting which turns off generic object deserialization
    - [With a custom deserializer](https://github.com/jdereg/json-io/blob/master/user-guide.md#customization-technique-4-custom-serializer) controlling which classes get deserialized
- **[Kryo < v5.0.0](https://github.com/EsotericSoftware/kryo)** (custom format) - cannot be used safely unless class registration is turned **on**,
which disables deserialization of any class ([see documentation](https://github.com/EsotericSoftware/kryo#optional-registration)
and [this issue](https://github.com/EsotericSoftware/kryo/issues/929))
    - *NOTE: other wrappers exist around Kryo such as [Chill](https://github.com/twitter/chill), which may also have class registration
not required by default regardless of the underlying version of Kryo being used*
- **[SnakeYAML](https://bitbucket.org/snakeyaml/snakeyaml/src)** (YAML) - cannot be used safely unless
the **org.yaml.snakeyaml.constructor.SafeConstructor** class is used, which disables
deserialization of any class ([see docs](https://bitbucket.org/snakeyaml/snakeyaml/wiki/CVE-2022-1471))

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- **[fastjson v1.2.68+](https://github.com/alibaba/fastjson)** (JSON) - 任意のクラスのデシリアライゼーションを無効にする [**safemode**](https://github.com/alibaba/fastjson/wiki/fastjson_safemode_en) オプションを有効にしない限り、安全に使用できません ([ドキュメントを参照](https://github.com/alibaba/fastjson/wiki/enable_autotype))。以前のバージョンは安全ではありません。
- **[json-io](https://github.com/jdereg/json-io)** (JSON) - JSON の **@type** プロパティを使用すると任意のクラスのデシリアライゼーションが可能になるため、安全に使用できません。以下の状況でのみ安全に使用できます。
    - 汎用オブジェクトのデシリアライゼーションをオフにする **JsonReader.USE_MAPS** 設定を使用した[非型付きモード](https://github.com/jdereg/json-io/blob/master/user-guide.md#non-typed-usage)
    - デシリアライズされるクラスを制御する[カスタムデシリアライザ](https://github.com/jdereg/json-io/blob/master/user-guide.md#customization-technique-4-custom-serializer)を使用する場合
- **[Kryo < v5.0.0](https://github.com/EsotericSoftware/kryo)** (カスタム形式) - 任意のクラスのデシリアライゼーションを無効にするクラス登録をオンにしない限り、安全に使用できません ([ドキュメント](https://github.com/EsotericSoftware/kryo#optional-registration)および[この issue](https://github.com/EsotericSoftware/kryo/issues/929)を参照)。
    - *注: Kryo の周辺には [Chill](https://github.com/twitter/chill) など他のラッパーが存在し、使用されている Kryo の基礎バージョンにかかわらず、デフォルトではクラス登録を要求しない場合もあります。*
- **[SnakeYAML](https://bitbucket.org/snakeyaml/snakeyaml/src)** (YAML) - 任意のクラスのデシリアライゼーションを無効にする **org.yaml.snakeyaml.constructor.SafeConstructor** クラスを使用しない限り、安全に使用できません ([ドキュメントを参照](https://bitbucket.org/snakeyaml/snakeyaml/wiki/CVE-2022-1471))。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Cannot be used safely:**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**安全に使用できない:**

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The following libraries are either no longer maintained or cannot be used safely with untrusted input:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

以下のライブラリは、メンテナンスされていないか、信頼できない入力に対して安全に使用できません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- **[Castor](https://github.com/castor-data-binding/castor)** (XML) - appears to be abandoned with no commits since 2016
- **[fastjson < v1.2.68](https://github.com/alibaba/fastjson)** (JSON) - these versions allows deserialization of any class
([see documentation](https://github.com/alibaba/fastjson/wiki/enable_autotype))
- **[XMLDecoder in the JDK](https://docs.oracle.com/javase/8/docs/api/java/beans/XMLDecoder.html)** (XML) - *"close to impossible to securely deserialize Java objects in this format from untrusted inputs"*
("Red Hat Defensive Coding Guide", [end of section 2.6.5](https://redhat-crypto.gitlab.io/defensive-coding-guide/#sect-Defensive_Coding-Tasks-Serialization-XML))
- **[XStream < v1.4.17](https://x-stream.github.io/)** (JSON and XML) - these versions allows deserialization of any class (see [documentation](https://x-stream.github.io/security.html#explicit))
- **[YamlBeans < v1.16](https://github.com/EsotericSoftware/yamlbeans)** (YAML) - these versions allows deserialization of any class
(see [this document](https://github.com/Contrast-Security-OSS/yamlbeans/blob/main/SECURITY.md))

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- **[Castor](https://github.com/castor-data-binding/castor)** (XML) - 2016 年以降コミットがなく、放棄されているようです。
- **[fastjson < v1.2.68](https://github.com/alibaba/fastjson)** (JSON) - これらのバージョンでは任意のクラスのデシリアライゼーションが可能です ([ドキュメントを参照](https://github.com/alibaba/fastjson/wiki/enable_autotype))。
- **[XMLDecoder in the JDK](https://docs.oracle.com/javase/8/docs/api/java/beans/XMLDecoder.html)** (XML) - *"close to impossible to securely deserialize Java objects in this format from untrusted inputs"* ("Red Hat Defensive Coding Guide", [セクション 2.6.5 の末尾](https://redhat-crypto.gitlab.io/defensive-coding-guide/#sect-Defensive_Coding-Tasks-Serialization-XML))。
- **[XStream < v1.4.17](https://x-stream.github.io/)** (JSON および XML) - これらのバージョンでは任意のクラスのデシリアライゼーションが可能です ([ドキュメント](https://x-stream.github.io/security.html#explicit)を参照)。
- **[YamlBeans < v1.16](https://github.com/EsotericSoftware/yamlbeans)** (YAML) - これらのバージョンでは任意のクラスのデシリアライゼーションが可能です ([このドキュメント](https://github.com/Contrast-Security-OSS/yamlbeans/blob/main/SECURITY.md)を参照)。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### .Net CSharp

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### .Net CSharp

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Clear-box Review

Search the source code for the following terms:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### クリアボックスレビュー

以下の用語でソースコードを検索します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

1. `TypeNameHandling`
2. `JavaScriptTypeResolver`

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

1. `TypeNameHandling`
2. `JavaScriptTypeResolver`

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Look for any serializers where the type is set by a user controlled variable.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

型がユーザー制御変数によって設定されているシリアライザを探します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Opaque-box Review

Search for the following base64 encoded content that starts with:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### オペークボックスレビュー

以下で始まる base64 エンコードされたコンテンツを検索します。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```text
AAEAAAD/////
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Search for content with the following text:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

以下のテキストを含むコンテンツを検索します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

1. `TypeObject`
2. `$type:`

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

1. `TypeObject`
2. `$type:`

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### General Precautions

Microsoft has stated that the `BinaryFormatter` type is dangerous and cannot be secured. As such, it should not be used. Full details are in the [BinaryFormatter security guide](https://docs.microsoft.com/en-us/dotnet/standard/serialization/binaryformatter-security-guide).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 一般的な予防策

Microsoft は、`BinaryFormatter` 型は危険であり安全にできないと述べています。そのため、使用すべきではありません。詳細は [BinaryFormatter security guide](https://docs.microsoft.com/en-us/dotnet/standard/serialization/binaryformatter-security-guide) にあります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Don't allow the datastream to define the type of object that the stream will be deserialized to. You can prevent this by for example using the `DataContractSerializer` or `XmlSerializer` if at all possible.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

データストリームが、デシリアライズ先となるオブジェクトの型を定義できるようにしてはいけません。可能であれば、たとえば `DataContractSerializer` または `XmlSerializer` を使用することで、これを防止できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Where `JSON.Net` is being used make sure the `TypeNameHandling` is only set to `None`.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

`JSON.Net` を使用している場合は、`TypeNameHandling` が `None` にのみ設定されていることを確認します。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```csharp
TypeNameHandling = TypeNameHandling.None
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

If `JavaScriptSerializer` is to be used then do not use it with a `JavaScriptTypeResolver`.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

`JavaScriptSerializer` を使用する場合は、`JavaScriptTypeResolver` とともに使用してはいけません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

If you must deserialize data streams that define their own type, then restrict the types that are allowed to be deserialized. One should be aware that this is still risky as many native .Net types potentially dangerous in themselves. e.g.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

独自の型を定義するデータストリームをどうしてもデシリアライズしなければならない場合は、デシリアライズを許可する型を制限します。ただし、多くのネイティブ .Net 型はそれ自体が潜在的に危険であるため、これには依然としてリスクがあることを認識する必要があります。例:

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```csharp
System.IO.FileInfo
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

`FileInfo` objects that reference files actually on the server can when deserialized, change the properties of those files e.g. to read-only, creating a potential denial of service attack.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

サーバー上に実際に存在するファイルを参照する `FileInfo` オブジェクトは、デシリアライズされると、それらのファイルのプロパティを読み取り専用に変更するなどして、潜在的なサービス拒否攻撃を引き起こす可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Even if you have limited the types that can be deserialized remember that some types have properties that are risky. `System.ComponentModel.DataAnnotations.ValidationException`, for example has a property `Value` of type `Object`. if this type is the type allowed for deserialization then an attacker can set the `Value` property to any object type they choose.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

デシリアライズ可能な型を制限していても、リスクのあるプロパティを持つ型があることを忘れないでください。たとえば `System.ComponentModel.DataAnnotations.ValidationException` には、`Object` 型の `Value` プロパティがあります。この型がデシリアライゼーションを許可された型である場合、攻撃者は `Value` プロパティを任意のオブジェクト型に設定できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Attackers should be prevented from steering the type that will be instantiated. If this is possible then even `DataContractSerializer` or `XmlSerializer` can be subverted e.g.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

攻撃者がインスタンス化される型を誘導できないようにする必要があります。これが可能であれば、`DataContractSerializer` や `XmlSerializer` でさえも破られる可能性があります。例:

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```csharp
// Action below is dangerous if the attacker can change the data in the database
var typename = GetTransactionTypeFromDatabase();

var serializer = new DataContractJsonSerializer(Type.GetType(typename));

var obj = serializer.ReadObject(ms);
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Execution can occur within certain .Net types during deserialization. Creating a control such as the one shown below is ineffective.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

デシリアライゼーション中に特定の .Net 型内で実行が発生する可能性があります。以下に示すような制御を作成しても効果はありません。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```csharp
var suspectObject = myBinaryFormatter.Deserialize(untrustedData);

//Check below is too late! Execution may have already occurred.
if (suspectObject is SomeDangerousObjectType)
{
    //generate warnings and dispose of suspectObject
}
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

For `JSON.Net` it is possible to create a safer form of allow-list control using a custom `SerializationBinder`.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

`JSON.Net` では、カスタム `SerializationBinder` を使用することで、より安全な許可リスト制御を作成できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Try to keep up-to-date on known .Net insecure deserialization gadgets and pay special attention where such types can be created by your deserialization processes. **A deserializer can only instantiate types that it knows about**.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

既知の .Net の安全でないデシリアライゼーション gadget について最新情報を追跡し、そのような型がデシリアライゼーションプロセスによって作成され得る箇所には特に注意してください。**デシリアライザは、それが知っている型のみをインスタンス化できます**。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Try to keep any code that might create potential gadgets separate from any code that has internet connectivity. As an example `System.Windows.Data.ObjectDataProvider` used in WPF applications is a known gadget that allows arbitrary method invocation. It would be risky to have this a reference to this assembly in a REST service project that deserializes untrusted data.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

潜在的な gadget を作成する可能性のあるコードは、インターネット接続を持つコードから分離するよう努めます。たとえば WPF アプリケーションで使用される `System.Windows.Data.ObjectDataProvider` は、任意のメソッド呼び出しを可能にする既知の gadget です。信頼できないデータをデシリアライズする REST サービスプロジェクトで、このアセンブリへの参照を持つことはリスクがあります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Known .NET RCE Gadgets

- `System.Configuration.Install.AssemblyInstaller`
- `System.Activities.Presentation.WorkflowDesigner`
- `System.Windows.ResourceDictionary`
- `System.Windows.Data.ObjectDataProvider`
- `System.Windows.Forms.BindingSource`
- `Microsoft.Exchange.Management.SystemManager.WinForms.ExchangeSettingsProvider`
- `System.Data.DataViewManager, System.Xml.XmlDocument/XmlDataDocument`
- `System.Management.Automation.PSObject`

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 既知の .NET RCE Gadget

- `System.Configuration.Install.AssemblyInstaller`
- `System.Activities.Presentation.WorkflowDesigner`
- `System.Windows.ResourceDictionary`
- `System.Windows.Data.ObjectDataProvider`
- `System.Windows.Forms.BindingSource`
- `Microsoft.Exchange.Management.SystemManager.WinForms.ExchangeSettingsProvider`
- `System.Data.DataViewManager, System.Xml.XmlDocument/XmlDataDocument`
- `System.Management.Automation.PSObject`

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Language-Agnostic Methods for Deserializing Safely

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 安全にデシリアライズするための言語非依存の方法

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Using Alternative Data Formats

A great reduction of risk is achieved by avoiding native (de)serialization formats. By switching to a pure data format like JSON or XML, you lessen the chance of custom deserialization logic being repurposed towards malicious ends.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 代替データ形式の使用

ネイティブな (デ)シリアライゼーション形式を避けることで、リスクは大きく低減されます。JSON や XML のような純粋なデータ形式に切り替えることで、カスタムデシリアライゼーションロジックが悪意ある目的に転用される可能性を下げられます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Many applications rely on a [data-transfer object pattern](https://en.wikipedia.org/wiki/Data_transfer_object) that involves creating a separate domain of objects for the explicit purpose data transfer. Of course, it's still possible that the application will make security mistakes after a pure data object is parsed.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

多くのアプリケーションは、データ転送を明示的な目的とする別個のオブジェクト領域を作成する [data-transfer object pattern](https://en.wikipedia.org/wiki/Data_transfer_object) に依存しています。もちろん、純粋なデータオブジェクトが解析された後に、アプリケーションがセキュリティ上の誤りを犯す可能性は依然としてあります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Only Deserialize Signed Data

If the application knows before deserialization which messages will need to be processed, they could sign them as part of the serialization process. The application could then to choose not to deserialize any message which didn't have an authenticated signature.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 署名済みデータのみをデシリアライズする

アプリケーションが、どのメッセージを処理する必要があるかをデシリアライゼーション前に把握している場合、シリアライゼーションプロセスの一部としてそれらに署名できます。アプリケーションは、認証済み署名を持たないメッセージをデシリアライズしないことを選択できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Mitigation Tools/Libraries

- [Java secure deserialization library](https://github.com/ikkisoft/SerialKiller)
- [SWAT - tool for creating allowlists](https://github.com/cschneider4711/SWAT)
- [NotSoSerial](https://github.com/kantega/notsoserial)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 緩和ツール/ライブラリ

- [Java secure deserialization library](https://github.com/ikkisoft/SerialKiller)
- [SWAT - tool for creating allowlists](https://github.com/cschneider4711/SWAT)
- [NotSoSerial](https://github.com/kantega/notsoserial)

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Detection Tools

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

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

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

</div>
</div>

</section>
</div>

## References

<div className="referenceFooter">

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

</div>


## Attribution

<div className="attributionFooter">

- Original: Deserialization Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Deserialization_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: English original retained for comparison. Japanese translation added. Bilingual display generated from official source and local Japanese translation.
- Retrieved: 2026-05-20

</div>
