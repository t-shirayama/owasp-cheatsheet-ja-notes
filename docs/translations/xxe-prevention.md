# XML 外部エンティティ防止チートシート 日本語訳

## Attribution

- Original: XML External Entity Prevention Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/XML_External_Entity_Prevention_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-21

## 日本語訳

# XML 外部エンティティ防止チートシート

## はじめに

*XML eXternal Entity injection* (XXE) は、現在 [OWASP Top 10](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A4-XML_External_Entities_%28XXE%29) の **A4** に含まれている、XML 入力を解析するアプリケーションに対する攻撃です。この問題は [Common Weakness Enumeration](https://cwe.mitre.org/index.html) の ID [611](https://cwe.mitre.org/data/definitions/611.html) として参照されています。XXE 攻撃は、**外部エンティティへの参照を含む信頼できない XML 入力が、弱く設定された XML パーサによって処理される**と発生し、次のような複数のインシデントにつながる可能性があります。

- システムに対するサービス拒否攻撃
- [Server Side Request Forgery](https://owasp.org/www-community/attacks/Server_Side_Request_Forgery) (SSRF) 攻撃
- パーサが配置されているマシンからのポートスキャン能力
- その他のシステムへの影響

このチートシートは、この脆弱性を防止するために役立ちます。

XXE の詳細については、[XML External Entity (XXE)](https://en.wikipedia.org/wiki/XML_external_entity_attack) を参照してください。

## 一般的なガイダンス

**XXE を防止する最も安全な方法は、常に DTD (外部エンティティ) を完全に無効化することです。** パーサによって異なりますが、方法は概ね次のようになります。

```java
factory.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);
```

[DTD](https://www.w3schools.com/xml/xml_dtd.asp) を無効化すると、[Billion Laughs](https://en.wikipedia.org/wiki/Billion_laughs_attack) のようなサービス拒否 (DOS) 攻撃に対してもパーサを安全にできます。**DTD を完全に無効化できない場合は、各パーサ固有の方法で外部エンティティと外部文書型宣言を無効化しなければなりません。**

### XML パーサセキュリティ機能マトリクス

| セキュリティ機能 | デフォルト (パーサ依存) | 目的 | **欠けている場合に起きること** |
| --- | --- | --- | --- |
| **外部エンティティの無効化** | 通常は **無効** (安全) | 外部リソースの読み込みをブロックする | 完全な XXE が可能 → SSRF、ファイル漏えい、内部スキャン |
| **DOCTYPE 宣言の禁止** | さまざま | ENTITY 定義を防止する | 古典的な XXE ペイロードが完全に機能する |
| **外部 DTD 読み込みの無効化** | 通常は **無効** | リモート DTD の読み込みを停止する | Blind XXE、ファイアウォール内側への SSRF が可能になる |
| **セキュア処理モード** | さまざま | 再帰、ネットワークアクセス、エンティティ展開を制限する | Billion Laughs DoS とリソース枯渇が可能になる |
| **パラメータエンティティの無効化** | さまざま | `%entity;` インジェクションを防止する | 高度な XXE ペイロードが単純な保護をバイパスする |
| **XInclude の無効化** | 通常は **無効** | 外部ファイルの取り込みを防止する | `file://` によるファイル読み取りと SSRF が可能になる |
| **エンティティ展開回数の制限** | 通常は **有効** | 再帰的なエンティティ悪用を防止する | メモリ枯渇 → パーサまたはサーバの DoS |
| **外部取得なしのスキーマ検証** | 通常は安全 | 検証時に外部 URL を取得しないようにする | 検証中に意図しない外部 HTTP 呼び出しが暗黙的に発生する |

### クイック影響マトリクス (欠けている場合に起きること)

| 欠けている制御 | 結果として生じる脆弱性 |
| --- | --- |
| DOCTYPE が無効化されていない | 標準的な XXE を完全に悪用可能 |
| 外部エンティティが有効 | SSRF、ファイル流出、ポートスキャン |
| 外部 DTD 読み込みが許可されている | Blind XXE → 隠れた SSRF 攻撃 |
| 展開制限がない | Billion Laughs DoS |
| XInclude が有効 | ローカルファイル漏えい + SSRF |
| セキュア処理が無効 | 重要な保護のバイパス |
| スキーマ検証が外部 URL を取得する | アプリケーションが不要な外向きリクエストを行う |

### 最小限の XML 強化ルール

- DOCTYPE を無効化する
- 外部エンティティを無効化する
- 外部 DTD 読み込みを無効化する
- セキュア処理モードを有効化する
- XInclude を無効化する
- エンティティ展開を制限する
- レガシー XML パーサを使用しない
- 信頼できない XML をデフォルト設定で解析しない

**複数の言語 (C++、Cold Fusion、Java、.NET、iOS、PHP、Python、Semgrep Rules) と、それらで一般的に使用される XML パーサについての詳細な XXE 防止ガイダンスを以下に示します。**

## C/C++

### libxml2

[xmlParserOption](http://xmlsoft.org/html/libxml-parser.html#xmlParserOption) Enum では、次のオプションを定義してはいけません。

- `XML_PARSE_NOENT`: エンティティを展開し、置換テキストに置き換える
- `XML_PARSE_DTDLOAD`: 外部 DTD を読み込む

注:

[この投稿](https://mail.gnome.org/archives/xml/2012-October/msg00045.html)によると、libxml2 バージョン 2.9 以降では、次の[パッチ](https://gitlab.gnome.org/GNOME/libxml2/commit/4629ee02ac649c27f9c0cf98ba017c6b5526070f)でコミットされたように、XXE はデフォルトで無効化されています。

次の API が使用されているかを検索し、パラメータに `XML_PARSE_NOENT` と `XML_PARSE_DTDLOAD` が定義されていないことを確認してください。

- `xmlCtxtReadDoc`
- `xmlCtxtReadFd`
- `xmlCtxtReadFile`
- `xmlCtxtReadIO`
- `xmlCtxtReadMemory`
- `xmlCtxtUseOptions`
- `xmlParseInNodeContext`
- `xmlReadDoc`
- `xmlReadFd`
- `xmlReadFile`
- `xmlReadIO`
- `xmlReadMemory`

### libxerces-c

`XercesDOMParser` を使用する場合、XXE を防止するには次のようにします。

```cpp
XercesDOMParser *parser = new XercesDOMParser;
parser->setCreateEntityReferenceNodes(true);
parser->setDisableDefaultEntityResolution(true);
```

SAXParser を使用する場合、XXE を防止するには次のようにします。

```cpp
SAXParser* parser = new SAXParser;
parser->setDisableDefaultEntityResolution(true);
```

SAX2XMLReader を使用する場合、XXE を防止するには次のようにします。

```cpp
SAX2XMLReader* reader = XMLReaderFactory::createXMLReader();
parser->setFeature(XMLUni::fgXercesDisableDefaultEntityResolution, true);
```

## ColdFusion

[このブログ投稿](https://hoyahaxa.blogspot.com/2022/11/on-coldfusion-xxe-and-other-xml-attacks.html)によると、Adobe ColdFusion と Lucee のどちらにも、外部 XML エンティティのサポートを無効化する組み込みメカニズムがあります。

### Adobe ColdFusion

ColdFusion 2018 Update 14 および ColdFusion 2021 Update 4 以降、XML を処理するすべてのネイティブ ColdFusion 関数には、外部 XML エンティティのサポートを無効化する XML パーサ引数があります。外部エンティティを無効化するグローバル設定はないため、開発者は XML 関数呼び出しのすべてで正しいセキュリティオプションを使用していることを確認しなければなりません。

[XmlParse() 関数のドキュメント](https://helpx.adobe.com/coldfusion/cfml-reference/coldfusion-functions/functions-t-z/xmlparse.html)では、次のコードで XXE を無効化できます。

```html
<cfset parseroptions = structnew()>
<cfset parseroptions.ALLOWEXTERNALENTITIES = false>
<cfscript>
a = XmlParse("xml.xml", false, parseroptions);
writeDump(a);
</cfscript>
```

上記の `"parseroptions"` 構造体は、XML を処理する他の関数を保護する引数としても使用できます。例:

```text
XxmlSearch(xmldoc, xpath,parseroptions);

XmlTransform(xmldoc,xslt,parseroptions);

isXML(xmldoc,parseroptions);
```

### Lucee

Lucee 5.3.4.51 以降では、Application.cfc に次を追加することで、XML 外部エンティティのサポートを無効化できます。

```text
this.xmlFeatures = {
     externalGeneralEntities: false,
     secure: true,
     disallowDoctypeDecl: true
};
```

Lucee 5.4.2.10 および Lucee 6.0.0.514 以降では、外部 XML エンティティのサポートはデフォルトで無効化されています。

## Java

**ほとんどの Java XML パーサでは XXE がデフォルトで有効なため、この言語は特に XXE 攻撃を受けやすく、これらのパーサを安全に使用するには XXE を明示的に無効化しなければなりません。** このセクションでは、最も一般的に使用される Java XML パーサで XXE を無効化する方法を説明します。

### JAXP DocumentBuilderFactory、SAXParserFactory、DOM4J

`DocumentBuilderFactory,` `SAXParserFactory`、`DOM4J` `XML` パーサは、同じ手法で XXE 攻撃から保護できます。

**簡潔にするため、ここでは `DocumentBuilderFactory` パーサを保護する方法のみを示します。このパーサを保護する追加の手順はサンプルコード内に埋め込まれています。**

JAXP `DocumentBuilderFactory` の [setFeature](https://docs.oracle.com/javase/7/docs/api/javax/xml/parsers/DocumentBuilderFactory.html#setFeature%28java.lang.String,%20boolean)) メソッドにより、開発者は実装固有の XML プロセッサ機能を有効化または無効化するかを制御できます。

これらの機能は、ファクトリまたは基盤となる `XMLReader` の [setFeature](https://docs.oracle.com/javase/7/docs/api/org/xml/sax/XMLReader.html#setFeature%28java.lang.String,%20boolean%29) メソッドのどちらにも設定できます。

**各 XML プロセッサ実装には、DTD と外部エンティティの処理方法を制御する独自の機能があります。DTD 処理を完全に無効化することで、ほとんどの XXE 攻撃を回避できますが、XInclude が有効化されていないことを無効化または検証することも必要です。**

**JDK 6 以降では、[FEATURE_SECURE_PROCESSING](https://docs.oracle.com/javase/6/docs/api/javax/xml/XMLConstants.html#FEATURE_SECURE_PROCESSING) フラグを使用して、パーサ実装に XML を安全に処理するよう指示できます。** その動作は実装依存です。リソース枯渇には役立つ可能性がありますが、エンティティ展開を常に緩和できるとは限りません。このフラグの詳細は[こちら](https://docs.oracle.com/en/java/javase/13/security/java-api-xml-processing-jaxp-security-guide.html#GUID-88B04BE2-35EF-4F61-B4FA-57A0E9102342)を参照してください。

`SAXParserFactory` を使用した構文ハイライト付きのサンプルコードスニペットは[こちら](https://gist.github.com/asudhakar02/45e2e6fd8bcdfb4bc3b2)を参照してください。DTD (doctype) を完全に無効化するサンプルコード:

```java
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException; // catching unsupported features
import javax.xml.XMLConstants;

...

DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
String FEATURE = null;
try {
    // This is the PRIMARY defense. If DTDs (doctypes) are disallowed, almost all
    // XML entity attacks are prevented
    // Xerces 2 only - http://xerces.apache.org/xerces2-j/features.html#disallow-doctype-decl
    FEATURE = "http://apache.org/xml/features/disallow-doctype-decl";
    dbf.setFeature(FEATURE, true);

    // and these as well, per Timothy Morgan's 2014 paper: "XML Schema, DTD, and Entity Attacks"
    dbf.setXIncludeAware(false);

    // remaining parser logic
    ...
} catch (ParserConfigurationException e) {
    // This should catch a failed setFeature feature
    // NOTE: Each call to setFeature() should be in its own try/catch otherwise subsequent calls will be skipped.
    // This is only important if you're ignoring errors for multi-provider support.
    logger.info("ParserConfigurationException was thrown. The feature '" + FEATURE
    + "' is not supported by your XML processor.");
    ...
} catch (SAXException e) {
    // On Apache, this should be thrown when disallowing DOCTYPE
    logger.warning("A DOCTYPE was passed into the XML document");
    ...
} catch (IOException e) {
    // XXE that points to a file that doesn't exist
    logger.error("IOException occurred, XXE may still possible: " + e.getMessage());
    ...
}

// Load XML file or stream using a XXE agnostic configured parser...
DocumentBuilder safebuilder = dbf.newDocumentBuilder();
```

DTD を完全に無効化できない場合:

```java
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException; // catching unsupported features
import javax.xml.XMLConstants;

...

DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();

String[] featuresToDisable = {
    // Xerces 1 - http://xerces.apache.org/xerces-j/features.html#external-general-entities
    // Xerces 2 - http://xerces.apache.org/xerces2-j/features.html#external-general-entities
    // JDK7+ - http://xml.org/sax/features/external-general-entities
    //This feature has to be used together with the following one, otherwise it will not protect you from XXE for sure
    "http://xml.org/sax/features/external-general-entities",

    // Xerces 1 - http://xerces.apache.org/xerces-j/features.html#external-parameter-entities
    // Xerces 2 - http://xerces.apache.org/xerces2-j/features.html#external-parameter-entities
    // JDK7+ - http://xml.org/sax/features/external-parameter-entities
    //This feature has to be used together with the previous one, otherwise it will not protect you from XXE for sure
    "http://xml.org/sax/features/external-parameter-entities",

    // Disable external DTDs as well
    "http://apache.org/xml/features/nonvalidating/load-external-dtd"
}

for (String feature : featuresToDisable) {
    try {
        dbf.setFeature(feature, false);
    } catch (ParserConfigurationException e) {
        // This should catch a failed setFeature feature
        logger.info("ParserConfigurationException was thrown. The feature '" + feature
        + "' is probably not supported by your XML processor.");
        ...
    }
}

try {
    // Add these as per Timothy Morgan's 2014 paper: "XML Schema, DTD, and Entity Attacks"
    dbf.setXIncludeAware(false);
    dbf.setExpandEntityReferences(false);

    // As stated in the documentation, "Feature for Secure Processing (FSP)" is the central mechanism that will
    // help you safeguard XML processing. It instructs XML processors, such as parsers, validators,
    // and transformers, to try and process XML securely, and the FSP can be used as an alternative to
    // dbf.setExpandEntityReferences(false); to allow some safe level of Entity Expansion
    // Exists from JDK6.
    dbf.setFeature(XMLConstants.FEATURE_SECURE_PROCESSING, true);

    // And, per Timothy Morgan: "If for some reason support for inline DOCTYPEs are a requirement, then
    // ensure the entity settings are disabled (as shown above) and beware that SSRF attacks
    // (http://cwe.mitre.org/data/definitions/918.html) and denial
    // of service attacks (such as billion laughs or decompression bombs via "jar:") are a risk."

    // remaining parser logic
    ...
} catch (ParserConfigurationException e) {
    // This should catch a failed setFeature feature
    logger.info("ParserConfigurationException was thrown. The feature 'XMLConstants.FEATURE_SECURE_PROCESSING'"
    + " is probably not supported by your XML processor.");
    ...
} catch (SAXException e) {
    // On Apache, this should be thrown when disallowing DOCTYPE
    logger.warning("A DOCTYPE was passed into the XML document");
    ...
} catch (IOException e) {
    // XXE that points to a file that doesn't exist
    logger.error("IOException occurred, XXE may still possible: " + e.getMessage());
    ...
}

// Load XML file or stream using a XXE agnostic configured parser...
DocumentBuilder safebuilder = dbf.newDocumentBuilder();
```

[Xerces 1](https://xerces.apache.org/xerces-j/) の [Features](https://xerces.apache.org/xerces-j/features.html):

- [この機能](https://xerces.apache.org/xerces-j/features.html#external-general-entities)を `false` に設定して、外部エンティティを含めないようにする。
- [この機能](https://xerces.apache.org/xerces-j/features.html#external-parameter-entities)を `false` に設定して、パラメータエンティティを含めないようにする。
- [この機能](https://xerces.apache.org/xerces-j/features.html#load-external-dtd)を `false` に設定して、外部 DTD を含めないようにする。

[Xerces 2](https://xerces.apache.org/xerces2-j/) の [Features](https://xerces.apache.org/xerces2-j/features.html):

- [この機能](https://xerces.apache.org/xerces2-j/features.html#disallow-doctype-decl)を `true` に設定して、インライン DTD を禁止する。
- [この機能](https://xerces.apache.org/xerces2-j/features.html#external-general-entities)を `false` に設定して、外部エンティティを含めないようにする。
- [この機能](https://xerces.apache.org/xerces2-j/features.html#external-parameter-entities)を `false` に設定して、パラメータエンティティを含めないようにする。
- [この機能](https://xerces.apache.org/xerces-j/features.html#load-external-dtd)を `false` に設定して、外部 DTD を含めないようにする。

**注:** 上記の防御策には Java 7 update 67、Java 8 update 20 以降が必要です。それ以前の Java バージョンでは、[CVE-2014-6517](http://www.cvedetails.com/cve/CVE-2014-6517/) によると、`DocumentBuilderFactory` と SAXParserFactory の対策が壊れています。

### XMLInputFactory (StAX パーサ)

[`XMLInputFactory`](http://docs.oracle.com/javase/7/docs/api/javax/xml/stream/XMLInputFactory.html) などの [StAX](http://en.wikipedia.org/wiki/StAX) パーサでは、さまざまなプロパティと機能を設定できます。

Java `XMLInputFactory` を XXE から保護するには、DTD (doctype) を完全に無効化します。

```java
// This disables DTDs entirely for that factory
xmlInputFactory.setProperty(XMLInputFactory.SUPPORT_DTD, false);
```

または、DTD を完全に無効化できない場合:

```java
// This causes XMLStreamException to be thrown if external DTDs are accessed.
xmlInputFactory.setProperty(XMLConstants.ACCESS_EXTERNAL_DTD, "");
// disable external entities
xmlInputFactory.setProperty("javax.xml.stream.isSupportingExternalEntities", false);
```

`XMLInputFactory` はスキーマに対する XML 検証を実行するために Validator に依存しているため、`xmlInputFactory.setProperty(XMLConstants.ACCESS_EXTERNAL_SCHEMA, "");` の設定は不要です。具体的な設定については [Validator](#validator) セクションを確認してください。

### Oracle DOM Parser

[Oracle の推奨事項](https://docs.oracle.com/en/database/oracle/oracle-database/18/adxdk/security-considerations-oracle-xml-developers-kit.html#GUID-45303542-41DE-4455-93B3-854A826EF8BB)に従います。例:

```java
    // Extend oracle.xml.parser.v2.XMLParser
    DOMParser domParser = new DOMParser();

    // Do not expand entity references
    domParser.setAttribute(DOMParser.EXPAND_ENTITYREF, false);

    // dtdObj is an instance of oracle.xml.parser.v2.DTD
    domParser.setAttribute(DOMParser.DTD_OBJECT, dtdObj);

    // Do not allow more than 11 levels of entity expansion
    domParser.setAttribute(DOMParser.ENTITY_EXPANSION_DEPTH, 12);
```

### TransformerFactory

`javax.xml.transform.TransformerFactory` を XXE から保護するには、次のようにします。

```java
TransformerFactory tf = TransformerFactory.newInstance();
tf.setAttribute(XMLConstants.ACCESS_EXTERNAL_DTD, "");
tf.setAttribute(XMLConstants.ACCESS_EXTERNAL_STYLESHEET, "");
```

### Validator

`javax.xml.validation.Validator` を XXE から保護するには、次のようにします。

```java
SchemaFactory factory = SchemaFactory.newInstance("http://www.w3.org/2001/XMLSchema");
factory.setProperty(XMLConstants.ACCESS_EXTERNAL_DTD, "");
factory.setProperty(XMLConstants.ACCESS_EXTERNAL_SCHEMA, "");
Schema schema = factory.newSchema();
Validator validator = schema.newValidator();
validator.setProperty(XMLConstants.ACCESS_EXTERNAL_DTD, "");
validator.setProperty(XMLConstants.ACCESS_EXTERNAL_SCHEMA, "");
```

### SchemaFactory

`javax.xml.validation.SchemaFactory` を XXE から保護するには、次のようにします。

```java
SchemaFactory factory = SchemaFactory.newInstance("http://www.w3.org/2001/XMLSchema");
factory.setProperty(XMLConstants.ACCESS_EXTERNAL_DTD, "");
factory.setProperty(XMLConstants.ACCESS_EXTERNAL_SCHEMA, "");
Schema schema = factory.newSchema(Source);
```

### SAXTransformerFactory

`javax.xml.transform.sax.SAXTransformerFactory` を XXE から保護するには、次のようにします。

```java
SAXTransformerFactory sf = SAXTransformerFactory.newInstance();
sf.setAttribute(XMLConstants.ACCESS_EXTERNAL_DTD, "");
sf.setAttribute(XMLConstants.ACCESS_EXTERNAL_STYLESHEET, "");
sf.newXMLFilter(Source);
```

**注: 次の `XMLConstants` の使用には JAXP 1.5 が必要です。これは Java 7u40 および Java 8 で追加されました。**

- `javax.xml.XMLConstants.ACCESS_EXTERNAL_DTD`
- `javax.xml.XMLConstants.ACCESS_EXTERNAL_SCHEMA`
- `javax.xml.XMLConstants.ACCESS_EXTERNAL_STYLESHEET`

### XMLReader

Java `org.xml.sax.XMLReader` を XXE 攻撃から保護するには、次のようにします。

```java
XMLReader reader = XMLReaderFactory.createXMLReader();
reader.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);
// This may not be strictly required as DTDs shouldn't be allowed at all, per previous line.
reader.setFeature("http://apache.org/xml/features/nonvalidating/load-external-dtd", false);
reader.setFeature("http://xml.org/sax/features/external-general-entities", false);
reader.setFeature("http://xml.org/sax/features/external-parameter-entities", false);
```

### SAXReader

Java `org.dom4j.io.SAXReader` を XXE 攻撃から保護するには、次のようにします。

```java
saxReader.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);
saxReader.setFeature("http://xml.org/sax/features/external-general-entities", false);
saxReader.setFeature("http://xml.org/sax/features/external-parameter-entities", false);
```

コードにこれらすべての行がない場合、XXE 攻撃に対して脆弱である可能性があります。

### SAXBuilder

Java `org.jdom2.input.SAXBuilder` を XXE 攻撃から保護するには、DTD (doctype) を完全に禁止します。

```java
SAXBuilder builder = new SAXBuilder();
builder.setFeature("http://apache.org/xml/features/disallow-doctype-decl",true);
Document doc = builder.build(new File(fileName));
```

または、DTD を完全に無効化できない場合は、外部エンティティとエンティティ展開を無効化します。

```java
SAXBuilder builder = new SAXBuilder();
builder.setFeature("http://xml.org/sax/features/external-general-entities", false);
builder.setFeature("http://xml.org/sax/features/external-parameter-entities", false);
builder.setFeature("http://apache.org/xml/features/nonvalidating/load-external-dtd", false);
builder.setExpandEntities(false);
Document doc = builder.build(new File(fileName));
```

### No-op EntityResolver

`EntityResolver` を受け取る API では、[no-op 実装を提供](https://wiki.sei.cmu.edu/confluence/display/java/IDS17-J.+Prevent+XML+External+Entity+Attacks)することで、XML パーサがエンティティを解決する能力を無効化できます。

```java
public final class NoOpEntityResolver implements EntityResolver {
    public InputSource resolveEntity(String publicId, String systemId) {
        return new InputSource(new StringReader(""));
    }
}

// ...

xmlReader.setEntityResolver(new NoOpEntityResolver());
documentBuilder.setEntityResolver(new NoOpEntityResolver());
```

または、より簡単には次のようにします。

```java
EntityResolver noop = (publicId, systemId) -> new InputSource(new StringReader(""));
xmlReader.setEntityResolver(noop);
documentBuilder.setEntityResolver(noop);
```

### JAXB Unmarshaller

**`javax.xml.bind.Unmarshaller` の `unmarshal` 関数に渡すソースが、安全なプロパティ、すなわち `XMLInputFactory.SUPPORT_DTD` と `XMLInputFactory.IS_SUPPORTING_EXTERNAL_ENTITIES` を `false` に設定した `javax.xml.stream.XMLInputFactory` で生成された `javax.xml.stream.XMLStreamReader` であることを確認すべきです。** 例:

```java
File file = new File(xmlPath);
XMLInputFactory xif = XMLInputFactory.newFactory();
xif.setProperty(XMLInputFactory.SUPPORT_DTD, false);
xif.setProperty(XMLInputFactory.IS_SUPPORTING_EXTERNAL_ENTITIES, false);
XMLStreamReader xsr = null;
try {
    xsr = xif.createXMLStreamReader(new StreamSource(file));
} catch (XMLStreamException e) {
    throw new RuntimeException(e);
}
Unmarshaller um = jc.createUnmarshaller();
um.unmarshal(xsr);
```

`createXMLStreamReader` と `unmarshal` の両メソッドには、さまざまなソース型を取る複数のオーバーロードがあるため、適切なものを選び、必要に応じて変換する必要があります。

### XPathExpression

**`javax.xml.xpath.XPathExpression` はそれ自体を安全に設定できないため、信頼できないデータはまず別の安全に設定可能な XML パーサで解析しなければなりません。**

例:

```java
DocumentBuilderFactory df = DocumentBuilderFactory.newInstance();
df.setAttribute(XMLConstants.ACCESS_EXTERNAL_DTD, "");
df.setAttribute(XMLConstants.ACCESS_EXTERNAL_SCHEMA, "");
DocumentBuilder builder = df.newDocumentBuilder();
String result = new XPathExpression().evaluate( builder.parse(
                            new ByteArrayInputStream(xml.getBytes())) );
```

### java.beans.XMLDecoder

**このクラスの [readObject()](https://docs.oracle.com/javase/8/docs/api/java/beans/XMLDecoder.html#readObject--) メソッドは根本的に安全ではありません。**

**解析する XML が XXE の対象になるだけでなく、このメソッドは任意の Java オブジェクトを構築し、[ここで説明されているように任意のコードを実行](http://stackoverflow.com/questions/14307442/is-it-safe-to-use-xmldecoder-to-read-document-files)するためにも使用できます。**

**このクラスを安全に使用する方法は、渡される入力を信頼するか適切に検証すること以外にありません。**

**そのため、このクラスの使用を完全に避け、このチートシートの他の箇所で説明している安全な、または適切に設定された XML パーサに置き換えることを強く推奨します。**

### その他の XML パーサ

**XML を直接、または他のライブラリの使用を通じて解析するサードパーティライブラリは多数あります。その XML パーサがデフォルトで XXE に対して安全であることをテストし、検証してください。** パーサがデフォルトで安全でない場合は、上記の例のように、外部リソースの取り込みをすべて無効化するためにパーサがサポートするフラグを探してください。外部に公開された制御がない場合は、Unmarshaller を安全にする方法と同様に、信頼できない内容をまず安全なパーサに通し、その後で安全でないサードパーティパーサに渡してください。

#### Spring Framework MVC/OXM XXE 脆弱性

**[Spring OXM](https://pivotal.io/security/cve-2013-4152) と [Spring MVC](https://pivotal.io/security/cve-2013-7315) でいくつかの XXE 脆弱性が見つかりました。次の Spring Framework バージョンは XXE に対して脆弱です。**

- **3.0.0** から **3.2.3** (Spring OXM & Spring MVC)
- **4.0.0.M1** (Spring OXM)
- **4.0.0.M1-4.0.0.M2** (Spring MVC)

後で修正された他の問題もあったため、これらの問題に完全に対処するには、Spring は Spring Framework 3.2.8+ または 4.0.2+ へのアップグレードを推奨しています。

Spring OXM では、これは org.springframework.oxm.jaxb.Jaxb2Marshaller の使用を指しています。**Spring OXM の CVE は、2 つの XML 解析状況については開発者が正しく処理する必要があり、残り 2 つは Spring の責任であり、この CVE に対処するため修正されたことを明示しています。**

記載内容は次のとおりです。

開発者が処理しなければならない 2 つの状況:

- `DOMSource` の場合、XML はすでにユーザーコードによって解析されており、そのコードが XXE から保護する責任を持ちます。
- `StAXSource` の場合、XMLStreamReader はすでにユーザーコードによって作成されており、そのコードが XXE から保護する責任を持ちます。

Spring が修正した問題:

SAXSource および StreamSource インスタンスでは、Spring がデフォルトで外部エンティティを処理していたため、この脆弱性が生じていました。

次は、以前は脆弱でしたが、修正版の Spring OXM または Spring MVC を使用していれば現在は安全な StreamSource の使用例です。

```java
import org.springframework.oxm.Jaxb2Marshaller;
import org.springframework.oxm.jaxb.Jaxb2Marshaller;

Jaxb2Marshaller marshaller = new Jaxb2Marshaller();
// Must cast return Object to whatever type you are unmarshalling
marshaller.unmarshal(new StreamSource(new StringReader(some_string_containing_XML));
```

したがって、[Spring OXM CVE の説明](https://pivotal.io/security/cve-2013-4152)によれば、上記は現在安全です。ただし、代わりに DOMSource または StAXSource を使用する場合は、それらのソースを XXE から安全になるよう自分で設定する必要があります。

#### Castor

**Castor は Java のデータバインディングフレームワークです。Java オブジェクト、XML、リレーショナルテーブル間の変換を可能にします。バージョン 1.3.3 より前の Castor の XML 機能は XXE に対して脆弱であり、最新バージョンにアップグレードすべきです。** 追加情報については、公式の [XML configuration file](https://castor-data-binding.github.io/castor/reference-guide/reference/xml/xml-properties.html) を確認してください。

## .NET

**.NET における XXE インジェクションの最新情報は、現在サポートされているすべての .NET XML パーサを対象とし、XXE インジェクションに対して安全な場合とそうでない場合を示すテストケースを含む、Dean Fleming による[ユニットテストの Web アプリケーション](https://github.com/deanf1/dotnet-security-unit-tests)から直接取得されています。ただし、これらのテストはファイルからのインジェクションのみを対象としており、DoS 攻撃で使用される直接 DTD は対象外です。**

直接 DTD を使用した DoS 攻撃 ([Billion laughs attack](https://en.wikipedia.org/wiki/Billion_laughs_attack) など) については、Bounce Security の Josh Grossman による[別のテストアプリケーション](https://github.com/BounceSecurity/BillionLaughsTester)が作成され、.NET >=4.5.2 がこれらの攻撃に対して安全であることを検証しています。

以前、この情報は 100% 正確とは限らない古い記事に基づいていました。例:

- [James Jardine's excellent .NET XXE article](https://www.jardinesoftware.net/2016/05/26/xxe-and-net/)
- [Guidance from Microsoft on how to prevent XXE and XML Denial of Service in .NET](http://msdn.microsoft.com/en-us/magazine/ee335713.aspx)

### .NET パーサ安全レベルの概要

**以下は、サポートされているすべての .NET XML パーサとそのデフォルト安全レベルの概要です。各パーサの詳細は、この一覧の後に含まれています。**

**XDocument (LINQ to XML)**

このパーサは .NET Framework バージョン 4.5.2 では外部エンティティから保護され、バージョン 4.5.2 以上では Billion Laughs から保護されます。ただし、バージョン 4.5.2 より前に Billion Laughs から保護されるかは不確かです。

#### XmlDocument、XmlTextReader、XPathNavigator のデフォルト安全レベル

これらのパーサは、バージョン 4.5.2 未満では外部エンティティ攻撃と Billion Laughs に対して脆弱ですが、バージョン 4.5.2 以上では保護されています。

#### XmlDictionaryReader、XmlNodeReader、XmlReader のデフォルト安全レベル

これらのパーサは、バージョン 4.5.2 の前後を問わず、外部エンティティ攻撃や Billion Laughs に対して脆弱ではありません。また、バージョン ≥4.5.2 以上では、これらのライブラリはデフォルトでインライン DTD さえ処理しません。DTD の処理を許可するようデフォルトを変更した場合でも、上記のとおり DoS 試行が行われると例外がスローされます。

### ASP.NET

ASP.NET アプリケーション ≥ .NET 4.5.2 では、実際の .NET バージョンにかかわらず脆弱になるリスクを避けるため、`Web.config` の `<httpRuntime targetFramework="..." />` を ≥4.5.2 に設定していることも確認しなければなりません。このタグを省略しても、安全でないデフォルト動作になります。

上記の表を理解するうえで、ASP.NET アプリケーションの `.NET Framework Version` は、アプリケーションがビルドされた .NET バージョン、または httpRuntime の `targetFramework` (Web.config) の**どちらか低い方**です。

この設定タグは、類似した設定タグである `<compilation targetFramework="..." />` や、アセンブリ / プロジェクトの targetFramework と混同してはいけません。これらは、上記の表で示される安全なデフォルト動作を実現するには**十分ではありません**。

### LINQ to XML

**`System.Xml.Linq` ライブラリの `XElement` と `XDocument` オブジェクトはどちらも、デフォルトで外部ファイルからの XXE インジェクションと DoS 攻撃に対して安全です。** `XElement` は XML ファイル内の要素のみを解析するため、DTD は完全に無視されます。`XDocument` は XmlResolver が[デフォルトで無効化](https://docs.microsoft.com/en-us/dotnet/standard/linq/linq-xml-security)されているため、SSRF に対して安全です。DTD は[デフォルトで有効](https://referencesource.microsoft.com/#System.Xml.Linq/System/Xml/Linq/XLinq.cs,71f4626a3d6f9bad)ですが、Framework バージョン ≥4.5.2 では前述のとおり DoS に対して**脆弱ではありません**。ただし、それ以前の Framework バージョンでは脆弱である可能性があります。詳細については、[Microsoft's guidance on how to prevent XXE and XML Denial of Service in .NET](http://msdn.microsoft.com/en-us/magazine/ee335713.aspx) を参照してください。

### XmlDictionaryReader

**`System.Xml.XmlDictionaryReader` はデフォルトで安全です。DTD を解析しようとすると、コンパイラが `"CData elements not valid at top level of an XML document"` という例外をスローするためです。別の安全でない XML パーサで構築された場合は安全でなくなります。**

### XmlDocument

**.NET Framework バージョン 4.5.2 より前では、`System.Xml.XmlDocument` はデフォルトで安全ではありません。`XmlDocument` オブジェクトには `XmlResolver` オブジェクトが含まれており、4.5.2 より前のバージョンでは null に設定する必要があります。バージョン 4.5.2 以降では、この `XmlResolver` はデフォルトで null に設定されています。**

次の例は、安全にする方法を示しています。

```csharp
 static void LoadXML()
 {
   string xxePayload = "<!DOCTYPE doc [<!ENTITY win SYSTEM 'file:///C:/Users/testdata2.txt'>]>"
                     + "<doc>&win;</doc>";
   string xml = "<?xml version='1.0' ?>" + xxePayload;

   XmlDocument xmlDoc = new XmlDocument();
   // Setting this to NULL disables DTDs - Its NOT null by default.
   xmlDoc.XmlResolver = null;
   xmlDoc.LoadXml(xml);
   Console.WriteLine(xmlDoc.InnerText);
   Console.ReadLine();
 }
```

**.NET Framework バージョン ≥4.5.2 では、これはデフォルトで安全です。**

デフォルトまたは安全でない設定を持つ null ではない独自の `XmlResolver` を作成すると、`XmlDocument` は安全でなくなる可能性があります。DTD 処理を有効化する必要がある場合、安全に行う方法は[参照先の MSDN 記事](https://msdn.microsoft.com/en-us/magazine/ee335713.aspx)で詳しく説明されています。

### XmlNodeReader

`System.Xml.XmlNodeReader` オブジェクトはデフォルトで安全であり、安全でないパーサで構築された場合や別の安全でないパーサにラップされた場合でも DTD を無視します。

### XmlReader

`System.Xml.XmlReader` オブジェクトはデフォルトで安全です。

.NET Framework バージョン 4.0 以前では ProhibitDtd プロパティが false に設定され、.NET バージョン 4.0 以降では `DtdProcessing` プロパティが Prohibit に設定されるようデフォルト設定されています。

さらに、.NET バージョン 4.5.2 以降では、`XmlReader` に属する `XmlReaderSettings` の `XmlResolver` はデフォルトで null に設定されており、追加の安全層を提供します。

したがって、バージョン 4.5.2 以降で `XmlReader` オブジェクトが安全でなくなるのは、`DtdProcessing` プロパティが Parse に設定され、かつ `XmlReaderSetting` の `XmlResolver` がデフォルトまたは安全でない設定を持つ null ではない XmlResolver に設定されている場合のみです。DTD 処理を有効化する必要がある場合、安全に行う方法は[参照先の MSDN 記事](https://msdn.microsoft.com/en-us/magazine/ee335713.aspx)で詳しく説明されています。

### XmlTextReader

`System.Xml.XmlTextReader` は、.NET Framework バージョン 4.5.2 より前ではデフォルトで**安全ではありません**。各 .NET バージョンで安全にする方法は次のとおりです。

#### .NET 4.0 より前

.NET Framework バージョン 4.0 より前では、`XmlTextReader` のような `XmlReader` オブジェクトの DTD 解析動作は、`System.Xml.XmlReaderSettings` クラスと `System.Xml.XmlTextReader` クラスにある Boolean の `ProhibitDtd` プロパティで制御されます。

インライン DTD を完全に無効化するには、これらの値を true に設定します。

```csharp
XmlTextReader reader = new XmlTextReader(stream);
// NEEDED because the default is FALSE!!
reader.ProhibitDtd = true;
```

#### .NET 4.0 - .NET 4.5.2

**.NET Framework バージョン 4.0 では、DTD 解析動作が変更されました。`ProhibitDtd` プロパティは非推奨となり、新しい `DtdProcessing` プロパティが使用されるようになりました。**

**しかし、デフォルト設定は変更されなかったため、`XmlTextReader` は依然としてデフォルトで XXE に対して脆弱です。**

**`DtdProcessing` を `Prohibit` に設定すると、XML に `<!DOCTYPE>` 要素が存在する場合、ランタイムが例外をスローします。**

この値を自分で設定するには、次のようにします。

```csharp
XmlTextReader reader = new XmlTextReader(stream);
// NEEDED because the default is Parse!!
reader.DtdProcessing = DtdProcessing.Prohibit;
```

または、`DtdProcessing` プロパティを `Ignore` に設定できます。これは `<!DOCTYPE>` 要素に遭遇しても例外をスローせず、単にスキップして処理しません。最後に、インライン DTD を許可して処理したい場合は、`DtdProcessing` を `Parse` に設定できます。

#### .NET 4.5.2 以降

.NET Framework バージョン 4.5.2 以降では、`XmlTextReader` の内部 `XmlResolver` はデフォルトで null に設定されており、`XmlTextReader` はデフォルトで DTD を無視します。デフォルトまたは安全でない設定を持つ null ではない独自の `XmlResolver` を作成すると、`XmlTextReader` は安全でなくなる可能性があります。

### XPathNavigator

`System.Xml.XPath.XPathNavigator` は、.NET Framework バージョン 4.5.2 より前ではデフォルトで**安全ではありません**。

これは、`XmlDocument` のような `IXPathNavigable` オブジェクトを実装しており、それらも 4.5.2 より前のバージョンではデフォルトで安全でないためです。

`XPathDocument` のコンストラクタで、デフォルトで安全な `XmlReader` のような安全なパーサを与えることで、`XPathNavigator` を安全にできます。

例:

```csharp
XmlReader reader = XmlReader.Create("example.xml");
XPathDocument doc = new XPathDocument(reader);
XPathNavigator nav = doc.CreateNavigator();
string xml = nav.InnerXml.ToString();
```

.NET Framework バージョン ≥4.5.2 では、XPathNavigator は**デフォルトで安全**です。

### XslCompiledTransform

`System.Xml.Xsl.XslCompiledTransform` (XML トランスフォーマ) は、渡されるパーサが安全である限り、デフォルトで安全です。

`Transform()` メソッドのデフォルトパーサは、上記のとおりデフォルトで安全な `XmlReader` であるため、デフォルトで安全です。

[このメソッドのソースコードはこちらです。](http://www.dotnetframework.org/default.aspx/4@0/4@0/DEVDIV_TFS/Dev10/Releases/RTMRel/ndp/fx/src/Xml/System/Xml/Xslt/XslCompiledTransform@cs/1305376/XslCompiledTransform@cs)

一部の `Transform()` メソッドは、`XmlReader` または `IXPathNavigable` (`XmlDocument` など) を入力として受け取ります。安全でない XML パーサを渡すと、`Transform` も安全でなくなります。

## iOS

### libxml2

**iOS には上記で説明した C/C++ libxml2 ライブラリが含まれているため、libxml2 を直接使用する場合はそのガイダンスが適用されます。**

**ただし、iOS6 までで提供される libxml2 のバージョンは 2.9 より前です。libxml2 2.9 はデフォルトで XXE から保護します。**

### NSXMLDocument

**iOS は libxml2 の上に構築された `NSXMLDocument` 型も提供しています。**

**ただし、`NSXMLDocument` は libxml2 を直接使用する場合には利用できない、XXE に対する追加の保護を提供します。**

この[ページ](https://developer.apple.com/library/archive/releasenotes/Foundation/RN-Foundation-iOS/Foundation_iOS5.html)の 'NSXMLDocument External Entity Restriction API' セクションによると:

- iOS4 以前: すべての外部エンティティがデフォルトで読み込まれます。
- iOS5 以降: ネットワークアクセスを必要としないエンティティのみが読み込まれます。(より安全です)

**ただし、どの iOS バージョンでも `NSXMLDocument` の XXE を完全に無効化するには、`NSXMLDocument` の作成時に `NSXMLNodeLoadExternalEntitiesNever` を指定するだけです。**

## PHP

**デフォルトの XML パーサ (libxml2 ベース) を使用する場合、PHP 8.0 以降は[デフォルトで XXE を防止](https://www.php.net/manual/en/function.libxml-disable-entity-loader.php)します。**

**PHP 8.0 より前のバージョンでは、[PHP ドキュメント](https://www.php.net/manual/en/function.libxml-set-external-entity-loader.php)によると、XXE を防止するため、デフォルトの PHP XML パーサを使用する際に次を設定すべきです。**

```php
libxml_set_external_entity_loader(null);
```

PHP でこれを悪用する方法の説明は、Facebook で修正された興味深い PHP ベースの XXE 脆弱性を説明する優れた [SensePost article](https://www.sensepost.com/blog/2014/revisting-xxe-and-abusing-protocols/) に示されています。

## Python

Python 3 の公式ドキュメントには、[xml vulnerabilities](https://docs.python.org/3/library/xml.html#xml-vulnerabilities) に関するセクションがあります。2020 年 1 月 1 日をもって Python 2 はサポートされなくなりましたが、Python の Web サイトにはまだ[一部のレガシードキュメント](https://docs.Python.org/2/library/xml.html#xml-vulnerabilities)があります。

次の表は、Python 3 のさまざまな XML 解析モジュールが、特定の XXE 攻撃に対して脆弱かどうかを示しています。

| 攻撃タイプ | sax | etree | minidom | pulldom | xmlrpc |
| --- | --- | --- | --- | --- | --- |
| Billion Laughs | 脆弱 | 脆弱 | 脆弱 | 脆弱 | 脆弱 |
| Quadratic Blowup | 脆弱 | 脆弱 | 脆弱 | 脆弱 | 脆弱 |
| External Entity Expansion | 安全 | 安全 | 安全 | 安全 | 安全 |
| DTD Retrieval | 安全 | 安全 | 安全 | 安全 | 安全 |
| Decompression Bomb | 安全 | 安全 | 安全 | 安全 | 脆弱 |

該当する攻撃からアプリケーションを保護するため、入力をサニタイズし、DDoS とリモート攻撃からアプリケーションを保護するのに役立つ[2 つのパッケージ](https://docs.python.org/3/library/xml.html#the-defusedxml-and-defusedexpat-packages)があります。

## Semgrep Rules

[Semgrep](https://semgrep.dev/) は、オフライン静的解析のためのコマンドラインツールです。事前構築済みまたはカスタムのルールを使用して、コードベース内のコード標準とセキュリティ標準を適用します。

### Java

以下は Java の各種 XML パーサ向けルールです。

#### Digester

`org.apache.commons.digester3.Digester` ライブラリにおける XXE 脆弱性を識別します。
ルールはここで実行できます [https://semgrep.dev/s/salecharohit:xxe-Digester]%28https://semgrep.dev/s/salecharohit:xxe-Digester)

#### DocumentBuilderFactory

`javax.xml.parsers.DocumentBuilderFactory` ライブラリにおける XXE 脆弱性を識別します。
ルールはここで実行できます [https://semgrep.dev/s/salecharohit:xxe-dbf]%28https://semgrep.dev/s/salecharohit:xxe-dbf)

#### SAXBuilder

`org.jdom2.input.SAXBuilder` ライブラリにおける XXE 脆弱性を識別します。
ルールはここで実行できます [https://semgrep.dev/s/salecharohit:xxe-saxbuilder]%28https://semgrep.dev/s/salecharohit:xxe-saxbuilder)

#### SAXParserFactory

`javax.xml.parsers.SAXParserFactory` ライブラリにおける XXE 脆弱性を識別します。
ルールはここで実行できます [https://semgrep.dev/s/salecharohit:xxe-SAXParserFactory]%28https://semgrep.dev/s/salecharohit:xxe-SAXParserFactory)

#### SAXReader

`org.dom4j.io.SAXReader` ライブラリにおける XXE 脆弱性を識別します。
ルールはここで実行できます [https://semgrep.dev/s/salecharohit:xxe-SAXReader]%28https://semgrep.dev/s/salecharohit:xxe-SAXReader)

#### XMLInputFactory

`javax.xml.stream.XMLInputFactory` ライブラリにおける XXE 脆弱性を識別します。
ルールはここで実行できます [https://semgrep.dev/s/salecharohit:xxe-XMLInputFactory]%28https://semgrep.dev/s/salecharohit:xxe-XMLInputFactory)

#### XMLReader

`org.xml.sax.XMLReader` ライブラリにおける XXE 脆弱性を識別します。
ルールはここで実行できます [https://semgrep.dev/s/salecharohit:xxe-XMLReader]%28https://semgrep.dev/s/salecharohit:xxe-XMLReader)

## References

- [XXE by InfoSecInstitute](https://resources.infosecinstitute.com/identify-mitigate-xxe-vulnerabilities/)
- [OWASP Top 10-2017 A4: XML External Entities (XXE)](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A4-XML_External_Entities_%28XXE%29)
- [Timothy Morgan's 2014 paper: "XML Schema, DTD, and Entity Attacks"](https://vsecurity.com//download/papers/XMLDTDEntityAttacks.pdf)
- [FindSecBugs XXE Detection](https://find-sec-bugs.github.io/bugs.htm#XXE_SAXPARSER)
- [XXEbugFind Tool](https://github.com/ssexxe/XXEBugFind)
- [Testing for XML Injection](https://owasp.org/www-project-web-security-testing-guide/stable/4-Web_Application_Security_Testing/07-Input_Validation_Testing/07-Testing_for_XML_Injection.html)

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V1.2 | 入力処理、XML パーサ設定、DTD・外部エンティティ無効化 |
| V1.3 | SSRF、ローカルファイル漏えい、エンティティ展開による DoS の防止 |
| V1.5 | 安全なコンポーネント設定と外部リソース取得の制御 |
