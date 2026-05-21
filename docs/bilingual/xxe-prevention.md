---
title: XML External Entity Prevention Cheat Sheet
hide_title: true
---

<div className="docHero" data-category="encoding-and-sanitization">
  <h1>XXE 防止チートシート</h1>
  <div className="docMeta">
    <span className="docPill">最終更新: 2026-05-20</span>
    <span className="docPill">読了時間: 約 15 分</span>
    <span className="docPill">カテゴリ: 入力検証とサニタイズ</span>
  </div>
</div>

<p className="docLead">XXE 防止チートシートを、原文・翻訳・対比表示で確認できます。ASVS Index 対応の文脈で、公式原文と日本語訳を確認しやすく整理しています。</p>

<div className="tabbedContent">
  <input className="tabInput" type="radio" name="xxe-prevention-view" id="xxe-prevention-original" />
  <input className="tabInput" type="radio" name="xxe-prevention-view" id="xxe-prevention-translation" defaultChecked />
  <input className="tabInput" type="radio" name="xxe-prevention-view" id="xxe-prevention-bilingual" />

  <div className="contentTabs">
    <label htmlFor="xxe-prevention-original" title="OWASP 原文">原文</label>
    <label htmlFor="xxe-prevention-translation" title="日本語訳">翻訳</label>
    <label htmlFor="xxe-prevention-bilingual" title="原文と翻訳を並べて確認">対比表示</label>
  </div>

<section id="xxe-prevention-original-panel" className="tabPanel originalPanel contentPanel">

## Introduction

An *XML eXternal Entity injection* (XXE), which is now part of the [OWASP Top 10](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A4-XML_External_Entities_%28XXE%29) via the point **A4**, is attack against applications that parse XML input. This issue is referenced in the ID [611](https://cwe.mitre.org/data/definitions/611.html) in the [Common Weakness Enumeration](https://cwe.mitre.org/index.html) referential. An XXE attack occurs when untrusted XML input with a **reference to an external entity is processed by a weakly configured XML parser**, and this attack could be used to stage multiple incidents, including:

- A denial of service attack on the system
- A [Server Side Request Forgery](https://owasp.org/www-community/attacks/Server_Side_Request_Forgery) (SSRF) attack
- The ability to scan ports from the machine where the parser is located
- Other system impacts.

This cheat sheet will help you prevent this vulnerability.

For more information on XXE, please visit [XML External Entity (XXE)](https://en.wikipedia.org/wiki/XML_external_entity_attack).

## General Guidance

**The safest way to prevent XXE is always to disable DTDs (External Entities) completely.** Depending on the parser, the method should be similar to the following:

```java
factory.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);
```

Disabling [DTD](https://www.w3schools.com/xml/xml_dtd.asp)s also makes the parser secure against denial of services (DOS) attacks such as [Billion Laughs](https://en.wikipedia.org/wiki/Billion_laughs_attack). **If it is not possible to disable DTDs completely, then external entities and external document type declarations must be disabled in the way that's specific to each parser.**

### XML Parser Security Features Matrix

| Security Feature                                | Default (Parser-Dependent)  | Purpose                                               | **What Happens If Missing?**                              |
| ----------------------------------------------- | --------------------------- | ----------------------------------------------------- | --------------------------------------------------------- |
| **External Entities Disabled**                  | Usually **disabled** (safe) | Blocks external resource loading                      | Full XXE possible → SSRF, file disclosure, internal scans |
| **Disallow DOCTYPE Declaration**                | Varies                      | Prevents ENTITY definitions                           | Classic XXE payloads become fully functional              |
| **Disable External DTD Loading**                | Usually **disabled**        | Stops loading remote DTDs                             | Enables Blind XXE, SSRF behind firewalls                  |
| **Secure Processing Mode**                      | Varies                      | Restricts recursion, network access, entity expansion | Billion Laughs DoS and resource depletion become possible |
| **Disable Parameter Entities**                  | Varies                      | Prevents `%entity;` injections                        | Advanced XXE payloads bypass simple protections           |
| **XInclude Disabled**                           | Usually **disabled**        | Prevents including external files                     | File read via `file://` and SSRF becomes possible         |
| **Limit Entity Expansion Count**                | Usually **enabled**         | Prevents recursive entity abuse                       | Memory exhaustion → parser or server DoS                  |
| **Schema Validation Without External Fetching** | Usually safe                | Ensures validation does not fetch external URLs       | Silent external HTTP calls triggered during validation    |

### Quick Impact Matrix (What Happens If Missing?)

| Missing Control                         | Resulting Vulnerability                      |
| --------------------------------------- | -------------------------------------------- |
| DOCTYPE not disabled                    | Standard XXE fully exploitable               |
| External entities enabled               | SSRF, file exfiltration, port scanning       |
| External DTD loading allowed            | Blind XXE → hidden SSRF attacks              |
| No expansion limits                     | Billion Laughs DoS                           |
| XInclude enabled                        | Local file disclosure + SSRF                 |
| Secure processing disabled              | Critical protections bypassed                |
| Schema validation fetches external URLs | Application makes unwanted outbound requests |

### Minimal XML Hardening Rules

- Disable DOCTYPE
- Disable external entities
- Disable external DTD loading
- Enable secure processing mode
- Disable XInclude
- Limit entity expansion
- Do not use legacy XML parsers
- Never parse untrusted XML with default settings

**Detailed XXE Prevention guidance is provided below for multiple languages (C++, Cold Fusion, Java, .NET, iOS, PHP, Python, Semgrep Rules) and their commonly used XML parsers.**

## C/C++

### libxml2

The Enum [xmlParserOption](http://xmlsoft.org/html/libxml-parser.html#xmlParserOption) should not have the following options defined:

- `XML_PARSE_NOENT`: Expands entities and substitutes them with replacement text
- `XML_PARSE_DTDLOAD`: Load the external DTD

Note:

Per: According to [this post](https://mail.gnome.org/archives/xml/2012-October/msg00045.html), starting with libxml2 version 2.9, XXE has been disabled by default as committed by the following [patch](https://gitlab.gnome.org/GNOME/libxml2/commit/4629ee02ac649c27f9c0cf98ba017c6b5526070f).

Search whether the following APIs are being used and make sure there is no `XML_PARSE_NOENT` and `XML_PARSE_DTDLOAD` defined in the parameters:

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

Use of `XercesDOMParser` do this to prevent XXE:

```cpp
XercesDOMParser *parser = new XercesDOMParser;
parser->setCreateEntityReferenceNodes(true);
parser->setDisableDefaultEntityResolution(true);
```

Use of SAXParser, do this to prevent XXE:

```cpp
SAXParser* parser = new SAXParser;
parser->setDisableDefaultEntityResolution(true);
```

Use of SAX2XMLReader, do this to prevent XXE:

```cpp
SAX2XMLReader* reader = XMLReaderFactory::createXMLReader();
parser->setFeature(XMLUni::fgXercesDisableDefaultEntityResolution, true);
```

## ColdFusion

Per [this blog post](https://hoyahaxa.blogspot.com/2022/11/on-coldfusion-xxe-and-other-xml-attacks.html), both Adobe ColdFusion and Lucee have built-in mechanisms to disable support for external XML entities.

### Adobe ColdFusion

As of ColdFusion 2018 Update 14 and ColdFusion 2021 Update 4, all native ColdFusion functions that process XML have a XML parser argument that disables support for external XML entities. Since there is no global setting that disables external entities, developers must ensure that every XML function call uses the correct security options.

From the [documentation for the XmlParse() function](https://helpx.adobe.com/coldfusion/cfml-reference/coldfusion-functions/functions-t-z/xmlparse.html), you can disable XXE with the code below:

```cfscript
<cfset parseroptions = structnew()>
<cfset parseroptions.ALLOWEXTERNALENTITIES = false>
<cfscript>
a = XmlParse("xml.xml", false, parseroptions);
writeDump(a);
</cfscript>
```

You can use the "parseroptions" structure shown above as an argument to secure other functions that process XML as well, such as:

```text
XxmlSearch(xmldoc, xpath,parseroptions);

XmlTransform(xmldoc,xslt,parseroptions);

isXML(xmldoc,parseroptions);
```

### Lucee

As of Lucee 5.3.4.51 and later, you can disable support for XML external entities by adding the following to your Application.cfc:

```text
this.xmlFeatures = {
     externalGeneralEntities: false,
     secure: true,
     disallowDoctypeDecl: true
};
```

Support for external XML entities is disabled by default as of Lucee 5.4.2.10 and Lucee 6.0.0.514.

## Java

**Since most Java XML parsers have XXE enabled by default, this language is especially vulnerable to XXE attack, so you must explicitly disable XXE to use these parsers safely.** This section describes how to disable XXE in the most commonly used Java XML parsers.

### JAXP DocumentBuilderFactory, SAXParserFactory and DOM4J

The`DocumentBuilderFactory,` `SAXParserFactory` and `DOM4J` `XML` parsers can be protected against XXE attacks with the same techniques.

**For brevity, we will only show you how to protect the `DocumentBuilderFactory` parser. Additional instructions for protecting this parser are embedded within the example code**

 The JAXP `DocumentBuilderFactory` [setFeature](https://docs.oracle.com/javase/7/docs/api/javax/xml/parsers/DocumentBuilderFactory.html#setFeature%28java.lang.String,%20boolean)) method allows a developer to control which implementation-specific XML processor features are enabled or disabled.

These features can either be set on the factory or the underlying `XMLReader` [setFeature](https://docs.oracle.com/javase/7/docs/api/org/xml/sax/XMLReader.html#setFeature%28java.lang.String,%20boolean%29) method.

**Each XML processor implementation has its own features that govern how DTDs and external entities are processed. By disabling DTD processing entirely, most XXE attacks can be averted, although it is also necessary to disable or verify that XInclude is not enabled.**

**Since the JDK 6, the flag [FEATURE_SECURE_PROCESSING](https://docs.oracle.com/javase/6/docs/api/javax/xml/XMLConstants.html#FEATURE_SECURE_PROCESSING) can be used to instruct the implementation of the parser to process XML securely**. Its behavior is implementation-dependent. It may help with resource exhaustion but it may not always mitigate entity expansion. More details on this flag can be found [here](https://docs.oracle.com/en/java/javase/13/security/java-api-xml-processing-jaxp-security-guide.html#GUID-88B04BE2-35EF-4F61-B4FA-57A0E9102342).

For a syntax highlighted example code snippet using `SAXParserFactory`, look [here](https://gist.github.com/asudhakar02/45e2e6fd8bcdfb4bc3b2).
Example code disabling DTDs (doctypes) altogether:

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

If you can't completely disable DTDs:

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

[Xerces 1](https://xerces.apache.org/xerces-j/) [Features](https://xerces.apache.org/xerces-j/features.html):

- Do not include external entities by setting [this feature](https://xerces.apache.org/xerces-j/features.html#external-general-entities) to `false`.
- Do not include parameter entities by setting [this feature](https://xerces.apache.org/xerces-j/features.html#external-parameter-entities) to `false`.
- Do not include external DTDs by setting [this feature](https://xerces.apache.org/xerces-j/features.html#load-external-dtd) to `false`.

[Xerces 2](https://xerces.apache.org/xerces2-j/) [Features](https://xerces.apache.org/xerces2-j/features.html):

- Disallow an inline DTD by setting [this feature](https://xerces.apache.org/xerces2-j/features.html#disallow-doctype-decl) to `true`.
- Do not include external entities by setting [this feature](https://xerces.apache.org/xerces2-j/features.html#external-general-entities) to `false`.
- Do not include parameter entities by setting [this feature](https://xerces.apache.org/xerces2-j/features.html#external-parameter-entities) to `false`.
- Do not include external DTDs by setting [this feature](https://xerces.apache.org/xerces-j/features.html#load-external-dtd) to `false`.

**Note:** The above defenses require Java 7 update 67, Java 8 update 20, or above, because the countermeasures for `DocumentBuilderFactory` and SAXParserFactory are broken in earlier Java versions, per: [CVE-2014-6517](http://www.cvedetails.com/cve/CVE-2014-6517/).

### XMLInputFactory (a StAX parser)

[StAX](http://en.wikipedia.org/wiki/StAX) parsers such as [`XMLInputFactory`](http://docs.oracle.com/javase/7/docs/api/javax/xml/stream/XMLInputFactory.html) allow various properties and features to be set.

To protect a Java `XMLInputFactory` from XXE, disable DTDs (doctypes) altogether:

```java
// This disables DTDs entirely for that factory
xmlInputFactory.setProperty(XMLInputFactory.SUPPORT_DTD, false);
```

or if you can't completely disable DTDs:

```java
// This causes XMLStreamException to be thrown if external DTDs are accessed.
xmlInputFactory.setProperty(XMLConstants.ACCESS_EXTERNAL_DTD, "");
// disable external entities
xmlInputFactory.setProperty("javax.xml.stream.isSupportingExternalEntities", false);
```

The setting `xmlInputFactory.setProperty(XMLConstants.ACCESS_EXTERNAL_SCHEMA, "");` is not required, as XMLInputFactory is dependent on Validator to perform XML validation against Schemas. Check the [Validator](#validator) section for the specific configuration.

### Oracle DOM Parser

Follow [Oracle recommendation](https://docs.oracle.com/en/database/oracle/oracle-database/18/adxdk/security-considerations-oracle-xml-developers-kit.html#GUID-45303542-41DE-4455-93B3-854A826EF8BB) e.g.:

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

To protect a `javax.xml.transform.TransformerFactory` from XXE, do this:

```java
TransformerFactory tf = TransformerFactory.newInstance();
tf.setAttribute(XMLConstants.ACCESS_EXTERNAL_DTD, "");
tf.setAttribute(XMLConstants.ACCESS_EXTERNAL_STYLESHEET, "");
```

### Validator

To protect a `javax.xml.validation.Validator` from XXE, do this:

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

To protect a `javax.xml.validation.SchemaFactory` from XXE, do this:

```java
SchemaFactory factory = SchemaFactory.newInstance("http://www.w3.org/2001/XMLSchema");
factory.setProperty(XMLConstants.ACCESS_EXTERNAL_DTD, "");
factory.setProperty(XMLConstants.ACCESS_EXTERNAL_SCHEMA, "");
Schema schema = factory.newSchema(Source);
```

### SAXTransformerFactory

To protect a `javax.xml.transform.sax.SAXTransformerFactory` from XXE, do this:

```java
SAXTransformerFactory sf = SAXTransformerFactory.newInstance();
sf.setAttribute(XMLConstants.ACCESS_EXTERNAL_DTD, "");
sf.setAttribute(XMLConstants.ACCESS_EXTERNAL_STYLESHEET, "");
sf.newXMLFilter(Source);
```

**Note: Use of the following `XMLConstants` requires JAXP 1.5, which was added to Java in 7u40 and Java 8:**

- `javax.xml.XMLConstants.ACCESS_EXTERNAL_DTD`
- `javax.xml.XMLConstants.ACCESS_EXTERNAL_SCHEMA`
- `javax.xml.XMLConstants.ACCESS_EXTERNAL_STYLESHEET`

### XMLReader

To protect the Java `org.xml.sax.XMLReader` from an XXE attack, do this:

```java
XMLReader reader = XMLReaderFactory.createXMLReader();
reader.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);
// This may not be strictly required as DTDs shouldn't be allowed at all, per previous line.
reader.setFeature("http://apache.org/xml/features/nonvalidating/load-external-dtd", false);
reader.setFeature("http://xml.org/sax/features/external-general-entities", false);
reader.setFeature("http://xml.org/sax/features/external-parameter-entities", false);
```

### SAXReader

To protect a Java `org.dom4j.io.SAXReader` from an XXE attack, do this:

```java
saxReader.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);
saxReader.setFeature("http://xml.org/sax/features/external-general-entities", false);
saxReader.setFeature("http://xml.org/sax/features/external-parameter-entities", false);
```

If your code does not have all of these lines, you could be vulnerable to an XXE attack.

### SAXBuilder

To protect a Java `org.jdom2.input.SAXBuilder` from an XXE attack, disallow DTDs (doctypes) entirely:

```java
SAXBuilder builder = new SAXBuilder();
builder.setFeature("http://apache.org/xml/features/disallow-doctype-decl",true);
Document doc = builder.build(new File(fileName));
```

Alternatively, if DTDs can't be completely disabled, disable external entities and entity expansion:

```java
SAXBuilder builder = new SAXBuilder();
builder.setFeature("http://xml.org/sax/features/external-general-entities", false);
builder.setFeature("http://xml.org/sax/features/external-parameter-entities", false);
builder.setFeature("http://apache.org/xml/features/nonvalidating/load-external-dtd", false);
builder.setExpandEntities(false);
Document doc = builder.build(new File(fileName));
```

### No-op EntityResolver

For APIs that take an `EntityResolver`, you can neutralize an XML parser's ability to resolve entities by [supplying a no-op implementation](https://wiki.sei.cmu.edu/confluence/display/java/IDS17-J.+Prevent+XML+External+Entity+Attacks):

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

or more simply:

```java
EntityResolver noop = (publicId, systemId) -> new InputSource(new StringReader(""));
xmlReader.setEntityResolver(noop);
documentBuilder.setEntityResolver(noop);
```

### JAXB Unmarshaller

**You should ensure that the source to the `unmarshal` function of `javax.xml.bind.Unmarshaller` is `javax.xml.stream.XMLStreamReader` that was generated using `javax.xml.stream.XMLInputFactory` with safe properties, i.e. `XMLInputFactory.SUPPORT_DTD` and `XMLInputFactory.IS_SUPPORTING_EXTERNAL_ENTITIES` set to `false`.** For example:

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

Note that both the `createXMLStreamReader` and `unmarshal` methods have several overloads with various source types, so you need to pick the right one and do a possible conversion.

### XPathExpression

**Since `javax.xml.xpath.XPathExpression` can not be configured securely by itself, the untrusted data must be parsed through another securable XML parser first.**

For example:

```java
DocumentBuilderFactory df = DocumentBuilderFactory.newInstance();
df.setAttribute(XMLConstants.ACCESS_EXTERNAL_DTD, "");
df.setAttribute(XMLConstants.ACCESS_EXTERNAL_SCHEMA, "");
DocumentBuilder builder = df.newDocumentBuilder();
String result = new XPathExpression().evaluate( builder.parse(
                            new ByteArrayInputStream(xml.getBytes())) );
```

### java.beans.XMLDecoder

**The [readObject()](https://docs.oracle.com/javase/8/docs/api/java/beans/XMLDecoder.html#readObject--) method in this class is fundamentally unsafe.**

**Not only is the XML it parses subject to XXE, but the method can be used to construct any Java object, and [execute arbitrary code as described here](http://stackoverflow.com/questions/14307442/is-it-safe-to-use-xmldecoder-to-read-document-files).**

**And there is no way to make use of this class safe except to trust or properly validate the input being passed into it.**

**As such, we'd strongly recommend completely avoiding the use of this class and replacing it with a safe or properly configured XML parser as described elsewhere in this cheat sheet.**

### Other XML Parsers

**There are many third-party libraries that parse XML either directly or through their use of other libraries. Please test and verify their XML parser is secure against XXE by default.** If the parser is not secure by default, look for flags supported by the parser to disable all possible external resource inclusions like the examples given above. If there's no control exposed to the outside, make sure the untrusted content is passed through a secure parser first and then passed to insecure third-party parser similar to how the Unmarshaller is secured.

#### Spring Framework MVC/OXM XXE Vulnerabilities

**Some XXE vulnerabilities were found in [Spring OXM](https://pivotal.io/security/cve-2013-4152) and [Spring MVC](https://pivotal.io/security/cve-2013-7315) . The following versions of the Spring Framework are vulnerable to XXE:

- **3.0.0** to **3.2.3** (Spring OXM & Spring MVC)
- **4.0.0.M1** (Spring OXM)
- **4.0.0.M1-4.0.0.M2** (Spring MVC)

There were other issues as well that were fixed later, so to fully address these issues, Spring recommends you upgrade to Spring Framework 3.2.8+ or 4.0.2+.

For Spring OXM, this is referring to the use of org.springframework.oxm.jaxb.Jaxb2Marshaller. **Note that the CVE for Spring OXM specifically indicates that two XML parsing situations are up to the developer to get right, and the other two are the responsibility of Spring and were fixed to address this CVE.**

Here's what they say:

Two situations developers must handle:

- For a `DOMSource`, the XML has already been parsed by user code and that code is responsible for protecting against XXE.
- For a `StAXSource`, the XMLStreamReader has already been created by user code and that code is responsible for protecting against XXE.

The issue Spring fixed:

For SAXSource and StreamSource instances, Spring processed external entities by default thereby creating this vulnerability.

Here's an example of using a StreamSource that was vulnerable, but is now safe, if you are using a fixed version of Spring OXM or Spring MVC:

```java
import org.springframework.oxm.Jaxb2Marshaller;
import org.springframework.oxm.jaxb.Jaxb2Marshaller;

Jaxb2Marshaller marshaller = new Jaxb2Marshaller();
// Must cast return Object to whatever type you are unmarshalling
marshaller.unmarshal(new StreamSource(new StringReader(some_string_containing_XML));
```

So, per the [Spring OXM CVE writeup](https://pivotal.io/security/cve-2013-4152), the above is now safe. But if you were to use a DOMSource or StAXSource instead, it would be up to you to configure those sources to be safe from XXE.

#### Castor

**Castor is a data binding framework for Java. It allows conversion between Java objects, XML, and relational tables. The XML features in Castor prior to version 1.3.3 are vulnerable to XXE, and should be upgraded to the latest version.** For additional information, check the official [XML configuration file](https://castor-data-binding.github.io/castor/reference-guide/reference/xml/xml-properties.html)

## .NET

**Up-to-date information for XXE injection in .NET is taken directly from the [web application of unit tests by Dean Fleming](https://github.com/deanf1/dotnet-security-unit-tests), which covers all currently supported .NET XML parsers, and has test cases that demonstrate when they are safe from XXE injection and when they are not, but these tests are only with injection from file and not direct DTD (used by DoS attacks).**

For DoS attacks using a direct DTD (such as the [Billion laughs attack](https://en.wikipedia.org/wiki/Billion_laughs_attack)), a [separate testing application from Josh Grossman at Bounce Security](https://github.com/BounceSecurity/BillionLaughsTester) has been created to verify that .NET >=4.5.2 is safe from these attacks.

Previously, this information was based on some older articles which may not be 100% accurate including:

- [James Jardine's excellent .NET XXE article](https://www.jardinesoftware.net/2016/05/26/xxe-and-net/).
- [Guidance from Microsoft on how to prevent XXE and XML Denial of Service in .NET](http://msdn.microsoft.com/en-us/magazine/ee335713.aspx).

### Overview of .NET Parser Safety Levels

**Below is an overview of all supported .NET XML parsers and their default safety levels. More details about each parser are included after this list.

**XDocument (LINQ to XML)

This parser is protected from external entities at .NET Framework version 4.5.2 and protected from Billion Laughs at version 4.5.2 or greater, but it is uncertain if this parser is protected from Billion Laughs before version 4.5.2.

#### XmlDocument, XmlTextReader, XPathNavigator default safety levels

These parsers are vulnerable to external entity attacks and Billion Laughs at versions below version 4.5.2 but protected at versions equal or greater than 4.5.2.

#### XmlDictionaryReader, XmlNodeReader, XmlReader default safety levels

These parsers are not vulnerable to external entity attacks or Billion Laughs before or after version 4.5.2. Also, at or greater than versions ≥4.5.2, these libraries won't even process the in-line DTD by default. Even if you change the default to allow processing a DTD, if a DoS attempt is performed an exception will still be thrown as documented above.

### ASP.NET

ASP.NET applications ≥ .NET 4.5.2 must also ensure setting the `<httpRuntime targetFramework="..." />` in their `Web.config` to ≥4.5.2 or risk being vulnerable regardless or the actual .NET version. Omitting this tag will also result in unsafe-by-default behavior.

For the purpose of understanding the above table, the `.NET Framework Version` for an ASP.NET applications is either the .NET version the application was build with or the httpRuntime's `targetFramework` (Web.config), **whichever is lower**.

This configuration tag should not be confused with a similar configuration tag: `<compilation targetFramework="..." />` or the assemblies / projects targetFramework, which are **not** sufficient for achieving secure-by-default behaviour as advertised in the above table.

### LINQ to XML

**Both the `XElement` and `XDocument` objects in the `System.Xml.Linq` library are safe from XXE injection from external file and DoS attack by default.** `XElement` parses only the elements within the XML file, so DTDs are ignored altogether. `XDocument` has XmlResolver [disabled by default](https://docs.microsoft.com/en-us/dotnet/standard/linq/linq-xml-security) so it's safe from SSRF. Whilst DTDs are [enabled by default](https://referencesource.microsoft.com/#System.Xml.Linq/System/Xml/Linq/XLinq.cs,71f4626a3d6f9bad), from Framework versions ≥4.5.2, it is **not** vulnerable to DoS as noted but it may be vulnerable in earlier Framework versions. For more information, see [Microsoft's guidance on how to prevent XXE and XML Denial of Service in .NET](http://msdn.microsoft.com/en-us/magazine/ee335713.aspx)

### XmlDictionaryReader

**`System.Xml.XmlDictionaryReader` is safe by default, as when it attempts to parse the DTD, the compiler throws an exception saying that "CData elements not valid at top level of an XML document". It becomes unsafe if constructed with a different unsafe XML parser.**

### XmlDocument

**Prior to .NET Framework version 4.5.2, `System.Xml.XmlDocument` is unsafe by default. The `XmlDocument` object has an `XmlResolver` object within it that needs to be set to null in versions prior to 4.5.2. In versions 4.5.2 and up, this `XmlResolver` is set to null by default.**

The following example shows how it is made safe:

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

**For .NET Framework version ≥4.5.2, this is safe by default**.

`XmlDocument` can become unsafe if you create your own nonnull `XmlResolver` with default or unsafe settings. If you need to enable DTD processing, instructions on how to do so safely are described in detail in the [referenced MSDN article](https://msdn.microsoft.com/en-us/magazine/ee335713.aspx).

### XmlNodeReader

`System.Xml.XmlNodeReader` objects are safe by default and will ignore DTDs even when constructed with an unsafe parser or wrapped in another unsafe parser.

### XmlReader

`System.Xml.XmlReader` objects are safe by default.

They are set by default to have their ProhibitDtd property set to false in .NET Framework versions 4.0 and earlier, or their `DtdProcessing` property set to Prohibit in .NET versions 4.0 and later.

Additionally, in .NET versions 4.5.2 and later, the `XmlReaderSettings` belonging to the `XmlReader` has its `XmlResolver` set to null by default, which provides an additional layer of safety.

Therefore, `XmlReader` objects will only become unsafe in version 4.5.2 and up if both the `DtdProcessing` property is set to Parse and the `XmlReaderSetting`'s `XmlResolver` is set to a nonnull XmlResolver with default or unsafe settings. If you need to enable DTD processing, instructions on how to do so safely are described in detail in the [referenced MSDN article](https://msdn.microsoft.com/en-us/magazine/ee335713.aspx).

### XmlTextReader

`System.Xml.XmlTextReader` is **unsafe** by default in .NET Framework versions prior to 4.5.2. Here is how to make it safe in various .NET versions:

#### Prior to .NET 4.0

In .NET Framework versions prior to 4.0, DTD parsing behavior for `XmlReader` objects like `XmlTextReader` are controlled by the Boolean `ProhibitDtd` property found in the `System.Xml.XmlReaderSettings` and `System.Xml.XmlTextReader` classes.

Set these values to true to disable inline DTDs completely.

```csharp
XmlTextReader reader = new XmlTextReader(stream);
// NEEDED because the default is FALSE!!
reader.ProhibitDtd = true;
```

#### .NET 4.0 - .NET 4.5.2

**In .NET Framework version 4.0, DTD parsing behavior has been changed. The `ProhibitDtd` property has been deprecated in favor of the new `DtdProcessing` property.**

**However, they didn't change the default settings so `XmlTextReader` is still vulnerable to XXE by default.**

**Setting `DtdProcessing` to `Prohibit` causes the runtime to throw an exception if a `<!DOCTYPE>` element is present in the XML.**

To set this value yourself, it looks like this:

```csharp
XmlTextReader reader = new XmlTextReader(stream);
// NEEDED because the default is Parse!!
reader.DtdProcessing = DtdProcessing.Prohibit;
```

Alternatively, you can set the `DtdProcessing` property to `Ignore`, which will not throw an exception on encountering a `<!DOCTYPE>` element but will simply skip over it and not process it. Finally, you can set `DtdProcessing` to `Parse` if you do want to allow and process inline DTDs.

#### .NET 4.5.2 and later

In .NET Framework versions 4.5.2 and up, `XmlTextReader`'s internal `XmlResolver` is set to null by default, making the `XmlTextReader` ignore DTDs by default. The `XmlTextReader` can become unsafe if you create your own nonnull `XmlResolver` with default or unsafe settings.

### XPathNavigator

`System.Xml.XPath.XPathNavigator` is **unsafe** by default in .NET Framework versions prior to 4.5.2.

This is due to the fact that it implements `IXPathNavigable` objects like `XmlDocument`, which are also unsafe by default in versions prior to 4.5.2.

You can make `XPathNavigator` safe by giving it a safe parser like `XmlReader` (which is safe by default) in the `XPathDocument`'s constructor.

Here is an example:

```csharp
XmlReader reader = XmlReader.Create("example.xml");
XPathDocument doc = new XPathDocument(reader);
XPathNavigator nav = doc.CreateNavigator();
string xml = nav.InnerXml.ToString();
```

For .NET Framework version ≥4.5.2, XPathNavigator is **safe by default**.

### XslCompiledTransform

`System.Xml.Xsl.XslCompiledTransform` (an XML transformer) is safe by default as long as the parser it's given is safe.

It is safe by default because the default parser of the `Transform()` methods is an `XmlReader`, which is safe by default (per above).

[The source code for this method is here.](http://www.dotnetframework.org/default.aspx/4@0/4@0/DEVDIV_TFS/Dev10/Releases/RTMRel/ndp/fx/src/Xml/System/Xml/Xslt/XslCompiledTransform@cs/1305376/XslCompiledTransform@cs)

Some of the `Transform()` methods accept an `XmlReader` or `IXPathNavigable` (e.g., `XmlDocument`) as an input, and if you pass in an unsafe XML Parser then the `Transform` will also be unsafe.

## iOS

### libxml2

**iOS includes the C/C++ libxml2 library described above, so that guidance applies if you are using libxml2 directly.**

**However, the version of libxml2 provided up through iOS6 is prior to version 2.9 of libxml2 (which protects against XXE by default).**

### NSXMLDocument

**iOS also provides an `NSXMLDocument` type, which is built on top of libxml2.**

**However, `NSXMLDocument` provides some additional protections against XXE that aren't available in libxml2 directly.**

Per the 'NSXMLDocument External Entity Restriction API' section of this [page](https://developer.apple.com/library/archive/releasenotes/Foundation/RN-Foundation-iOS/Foundation_iOS5.html):

- iOS4 and earlier: All external entities are loaded by default.
- iOS5 and later: Only entities that don't require network access are loaded. (which is safer)

**However, to completely disable XXE in an `NSXMLDocument` in any version of iOS you simply specify `NSXMLNodeLoadExternalEntitiesNever` when creating the `NSXMLDocument`.**

## PHP

**When using the default XML parser (based on libxml2), PHP 8.0 and newer [prevent XXE by default](https://www.php.net/manual/en/function.libxml-disable-entity-loader.php).**

**For PHP versions prior to 8.0, per [the PHP documentation](https://www.php.net/manual/en/function.libxml-set-external-entity-loader.php), the following should be set when using the default PHP XML parser in order to prevent XXE:**

```php
libxml_set_external_entity_loader(null);
```

A description of how to abuse this in PHP is presented in a good [SensePost article](https://www.sensepost.com/blog/2014/revisting-xxe-and-abusing-protocols/) describing a cool PHP based XXE vulnerability that was fixed in Facebook.

## Python

The Python 3 official documentation contains a section on [xml vulnerabilities](https://docs.python.org/3/library/xml.html#xml-vulnerabilities). As of the 1st January 2020 Python 2 is no longer supported, however the Python website still contains [some legacy documentation](https://docs.Python.org/2/library/xml.html#xml-vulnerabilities).

The table below shows you which various XML parsing modules in Python 3 are vulnerable to certain XXE attacks.

| Attack Type               | sax        | etree      | minidom    | pulldom    | xmlrpc     |
|---------------------------|------------|------------|------------|------------|------------|
| Billion Laughs            | Vulnerable | Vulnerable | Vulnerable | Vulnerable | Vulnerable |
| Quadratic Blowup          | Vulnerable | Vulnerable | Vulnerable | Vulnerable | Vulnerable |
| External Entity Expansion | Safe       | Safe       | Safe       | Safe       | Safe       |
| DTD Retrieval             | Safe       | Safe       | Safe       | Safe       | Safe       |
| Decompression Bomb        | Safe       | Safe       | Safe       | Safe       | Vulnerable |

To protect your application from the applicable attacks, [two packages](https://docs.python.org/3/library/xml.html#the-defusedxml-and-defusedexpat-packages) exist to help you sanitize your input and protect your application against DDoS and remote attacks.

## Semgrep Rules

[Semgrep](https://semgrep.dev/) is a command-line tool for offline static analysis. Use pre-built or custom rules to enforce code and security standards in your codebase.

### Java

Below are the rules for different XML parsers in Java

#### Digester

Identifying XXE vulnerability in the `org.apache.commons.digester3.Digester` library
Rule can be played here [https://semgrep.dev/s/salecharohit:xxe-Digester]%28https://semgrep.dev/s/salecharohit:xxe-Digester)

#### DocumentBuilderFactory

Identifying XXE vulnerability in the `javax.xml.parsers.DocumentBuilderFactory` library
Rule can be played here [https://semgrep.dev/s/salecharohit:xxe-dbf]%28https://semgrep.dev/s/salecharohit:xxe-dbf)

#### SAXBuilder

Identifying XXE vulnerability in the `org.jdom2.input.SAXBuilder` library
Rule can be played here [https://semgrep.dev/s/salecharohit:xxe-saxbuilder]%28https://semgrep.dev/s/salecharohit:xxe-saxbuilder)

#### SAXParserFactory

Identifying XXE vulnerability in the `javax.xml.parsers.SAXParserFactory` library
Rule can be played here [https://semgrep.dev/s/salecharohit:xxe-SAXParserFactory]%28https://semgrep.dev/s/salecharohit:xxe-SAXParserFactory)

#### SAXReader

Identifying XXE vulnerability in the `org.dom4j.io.SAXReader` library
Rule can be played here [https://semgrep.dev/s/salecharohit:xxe-SAXReader]%28https://semgrep.dev/s/salecharohit:xxe-SAXReader)

#### XMLInputFactory

Identifying XXE vulnerability in the `javax.xml.stream.XMLInputFactory` library
Rule can be played here [https://semgrep.dev/s/salecharohit:xxe-XMLInputFactory]%28https://semgrep.dev/s/salecharohit:xxe-XMLInputFactory)

#### XMLReader

Identifying XXE vulnerability in the `org.xml.sax.XMLReader` library
Rule can be played here [https://semgrep.dev/s/salecharohit:xxe-XMLReader]%28https://semgrep.dev/s/salecharohit:xxe-XMLReader)

</section>

<section id="xxe-prevention-translation-panel" className="tabPanel translationPanel contentPanel">

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

```cfscript
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

</section>

<section id="xxe-prevention-bilingual-panel" className="tabPanel bilingualPanel">

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Introduction

An *XML eXternal Entity injection* (XXE), which is now part of the [OWASP Top 10](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A4-XML_External_Entities_%28XXE%29) via the point **A4**, is attack against applications that parse XML input. This issue is referenced in the ID [611](https://cwe.mitre.org/data/definitions/611.html) in the [Common Weakness Enumeration](https://cwe.mitre.org/index.html) referential. An XXE attack occurs when untrusted XML input with a **reference to an external entity is processed by a weakly configured XML parser**, and this attack could be used to stage multiple incidents, including:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## はじめに

*XML eXternal Entity injection* (XXE) は、現在 [OWASP Top 10](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A4-XML_External_Entities_%28XXE%29) の **A4** に含まれている、XML 入力を解析するアプリケーションに対する攻撃です。この問題は [Common Weakness Enumeration](https://cwe.mitre.org/index.html) の ID [611](https://cwe.mitre.org/data/definitions/611.html) として参照されています。XXE 攻撃は、**外部エンティティへの参照を含む信頼できない XML 入力が、弱く設定された XML パーサによって処理される**と発生し、次のような複数のインシデントにつながる可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- A denial of service attack on the system
- A [Server Side Request Forgery](https://owasp.org/www-community/attacks/Server_Side_Request_Forgery) (SSRF) attack
- The ability to scan ports from the machine where the parser is located
- Other system impacts.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- システムに対するサービス拒否攻撃
- [Server Side Request Forgery](https://owasp.org/www-community/attacks/Server_Side_Request_Forgery) (SSRF) 攻撃
- パーサが配置されているマシンからのポートスキャン能力
- その他のシステムへの影響

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

This cheat sheet will help you prevent this vulnerability.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

このチートシートは、この脆弱性を防止するために役立ちます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

For more information on XXE, please visit [XML External Entity (XXE)](https://en.wikipedia.org/wiki/XML_external_entity_attack).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

XXE の詳細については、[XML External Entity (XXE)](https://en.wikipedia.org/wiki/XML_external_entity_attack) を参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## General Guidance

**The safest way to prevent XXE is always to disable DTDs (External Entities) completely.** Depending on the parser, the method should be similar to the following:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 一般的なガイダンス

**XXE を防止する最も安全な方法は、常に DTD (外部エンティティ) を完全に無効化することです。** パーサによって異なりますが、方法は概ね次のようになります。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```java
factory.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Disabling [DTD](https://www.w3schools.com/xml/xml_dtd.asp)s also makes the parser secure against denial of services (DOS) attacks such as [Billion Laughs](https://en.wikipedia.org/wiki/Billion_laughs_attack). **If it is not possible to disable DTDs completely, then external entities and external document type declarations must be disabled in the way that's specific to each parser.**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

[DTD](https://www.w3schools.com/xml/xml_dtd.asp) を無効化すると、[Billion Laughs](https://en.wikipedia.org/wiki/Billion_laughs_attack) のようなサービス拒否 (DOS) 攻撃に対してもパーサを安全にできます。**DTD を完全に無効化できない場合は、各パーサ固有の方法で外部エンティティと外部文書型宣言を無効化しなければなりません。**

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### XML Parser Security Features Matrix

| Security Feature                                | Default (Parser-Dependent)  | Purpose                                               | **What Happens If Missing?**                              |
| ----------------------------------------------- | --------------------------- | ----------------------------------------------------- | --------------------------------------------------------- |
| **External Entities Disabled**                  | Usually **disabled** (safe) | Blocks external resource loading                      | Full XXE possible → SSRF, file disclosure, internal scans |
| **Disallow DOCTYPE Declaration**                | Varies                      | Prevents ENTITY definitions                           | Classic XXE payloads become fully functional              |
| **Disable External DTD Loading**                | Usually **disabled**        | Stops loading remote DTDs                             | Enables Blind XXE, SSRF behind firewalls                  |
| **Secure Processing Mode**                      | Varies                      | Restricts recursion, network access, entity expansion | Billion Laughs DoS and resource depletion become possible |
| **Disable Parameter Entities**                  | Varies                      | Prevents `%entity;` injections                        | Advanced XXE payloads bypass simple protections           |
| **XInclude Disabled**                           | Usually **disabled**        | Prevents including external files                     | File read via `file://` and SSRF becomes possible         |
| **Limit Entity Expansion Count**                | Usually **enabled**         | Prevents recursive entity abuse                       | Memory exhaustion → parser or server DoS                  |
| **Schema Validation Without External Fetching** | Usually safe                | Ensures validation does not fetch external URLs       | Silent external HTTP calls triggered during validation    |

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

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

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Quick Impact Matrix (What Happens If Missing?)

| Missing Control                         | Resulting Vulnerability                      |
| --------------------------------------- | -------------------------------------------- |
| DOCTYPE not disabled                    | Standard XXE fully exploitable               |
| External entities enabled               | SSRF, file exfiltration, port scanning       |
| External DTD loading allowed            | Blind XXE → hidden SSRF attacks              |
| No expansion limits                     | Billion Laughs DoS                           |
| XInclude enabled                        | Local file disclosure + SSRF                 |
| Secure processing disabled              | Critical protections bypassed                |
| Schema validation fetches external URLs | Application makes unwanted outbound requests |

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

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

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Minimal XML Hardening Rules

- Disable DOCTYPE
- Disable external entities
- Disable external DTD loading
- Enable secure processing mode
- Disable XInclude
- Limit entity expansion
- Do not use legacy XML parsers
- Never parse untrusted XML with default settings

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 最小限の XML 強化ルール

- DOCTYPE を無効化する
- 外部エンティティを無効化する
- 外部 DTD 読み込みを無効化する
- セキュア処理モードを有効化する
- XInclude を無効化する
- エンティティ展開を制限する
- レガシー XML パーサを使用しない
- 信頼できない XML をデフォルト設定で解析しない

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Detailed XXE Prevention guidance is provided below for multiple languages (C++, Cold Fusion, Java, .NET, iOS, PHP, Python, Semgrep Rules) and their commonly used XML parsers.**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**複数の言語 (C++、Cold Fusion、Java、.NET、iOS、PHP、Python、Semgrep Rules) と、それらで一般的に使用される XML パーサについての詳細な XXE 防止ガイダンスを以下に示します。**

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## C/C++

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## C/C++

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### libxml2

The Enum [xmlParserOption](http://xmlsoft.org/html/libxml-parser.html#xmlParserOption) should not have the following options defined:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### libxml2

[xmlParserOption](http://xmlsoft.org/html/libxml-parser.html#xmlParserOption) Enum では、次のオプションを定義してはいけません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- `XML_PARSE_NOENT`: Expands entities and substitutes them with replacement text
- `XML_PARSE_DTDLOAD`: Load the external DTD

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- `XML_PARSE_NOENT`: エンティティを展開し、置換テキストに置き換える
- `XML_PARSE_DTDLOAD`: 外部 DTD を読み込む

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Note:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

注:

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Per: According to [this post](https://mail.gnome.org/archives/xml/2012-October/msg00045.html), starting with libxml2 version 2.9, XXE has been disabled by default as committed by the following [patch](https://gitlab.gnome.org/GNOME/libxml2/commit/4629ee02ac649c27f9c0cf98ba017c6b5526070f).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

[この投稿](https://mail.gnome.org/archives/xml/2012-October/msg00045.html)によると、libxml2 バージョン 2.9 以降では、次の[パッチ](https://gitlab.gnome.org/GNOME/libxml2/commit/4629ee02ac649c27f9c0cf98ba017c6b5526070f)でコミットされたように、XXE はデフォルトで無効化されています。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Search whether the following APIs are being used and make sure there is no `XML_PARSE_NOENT` and `XML_PARSE_DTDLOAD` defined in the parameters:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

次の API が使用されているかを検索し、パラメータに `XML_PARSE_NOENT` と `XML_PARSE_DTDLOAD` が定義されていないことを確認してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

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

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

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

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### libxerces-c

Use of `XercesDOMParser` do this to prevent XXE:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### libxerces-c

`XercesDOMParser` を使用する場合、XXE を防止するには次のようにします。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```cpp
XercesDOMParser *parser = new XercesDOMParser;
parser->setCreateEntityReferenceNodes(true);
parser->setDisableDefaultEntityResolution(true);
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Use of SAXParser, do this to prevent XXE:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

SAXParser を使用する場合、XXE を防止するには次のようにします。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```cpp
SAXParser* parser = new SAXParser;
parser->setDisableDefaultEntityResolution(true);
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Use of SAX2XMLReader, do this to prevent XXE:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

SAX2XMLReader を使用する場合、XXE を防止するには次のようにします。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```cpp
SAX2XMLReader* reader = XMLReaderFactory::createXMLReader();
parser->setFeature(XMLUni::fgXercesDisableDefaultEntityResolution, true);
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## ColdFusion

Per [this blog post](https://hoyahaxa.blogspot.com/2022/11/on-coldfusion-xxe-and-other-xml-attacks.html), both Adobe ColdFusion and Lucee have built-in mechanisms to disable support for external XML entities.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## ColdFusion

[このブログ投稿](https://hoyahaxa.blogspot.com/2022/11/on-coldfusion-xxe-and-other-xml-attacks.html)によると、Adobe ColdFusion と Lucee のどちらにも、外部 XML エンティティのサポートを無効化する組み込みメカニズムがあります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Adobe ColdFusion

As of ColdFusion 2018 Update 14 and ColdFusion 2021 Update 4, all native ColdFusion functions that process XML have a XML parser argument that disables support for external XML entities. Since there is no global setting that disables external entities, developers must ensure that every XML function call uses the correct security options.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Adobe ColdFusion

ColdFusion 2018 Update 14 および ColdFusion 2021 Update 4 以降、XML を処理するすべてのネイティブ ColdFusion 関数には、外部 XML エンティティのサポートを無効化する XML パーサ引数があります。外部エンティティを無効化するグローバル設定はないため、開発者は XML 関数呼び出しのすべてで正しいセキュリティオプションを使用していることを確認しなければなりません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

From the [documentation for the XmlParse() function](https://helpx.adobe.com/coldfusion/cfml-reference/coldfusion-functions/functions-t-z/xmlparse.html), you can disable XXE with the code below:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

[XmlParse() 関数のドキュメント](https://helpx.adobe.com/coldfusion/cfml-reference/coldfusion-functions/functions-t-z/xmlparse.html)では、次のコードで XXE を無効化できます。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```cfscript
<cfset parseroptions = structnew()>
<cfset parseroptions.ALLOWEXTERNALENTITIES = false>
<cfscript>
a = XmlParse("xml.xml", false, parseroptions);
writeDump(a);
</cfscript>
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

You can use the "parseroptions" structure shown above as an argument to secure other functions that process XML as well, such as:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

上記の `"parseroptions"` 構造体は、XML を処理する他の関数を保護する引数としても使用できます。例:

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```text
XxmlSearch(xmldoc, xpath,parseroptions);

XmlTransform(xmldoc,xslt,parseroptions);

isXML(xmldoc,parseroptions);
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Lucee

As of Lucee 5.3.4.51 and later, you can disable support for XML external entities by adding the following to your Application.cfc:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Lucee

Lucee 5.3.4.51 以降では、Application.cfc に次を追加することで、XML 外部エンティティのサポートを無効化できます。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```text
this.xmlFeatures = {
     externalGeneralEntities: false,
     secure: true,
     disallowDoctypeDecl: true
};
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Support for external XML entities is disabled by default as of Lucee 5.4.2.10 and Lucee 6.0.0.514.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Lucee 5.4.2.10 および Lucee 6.0.0.514 以降では、外部 XML エンティティのサポートはデフォルトで無効化されています。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Java

**Since most Java XML parsers have XXE enabled by default, this language is especially vulnerable to XXE attack, so you must explicitly disable XXE to use these parsers safely.** This section describes how to disable XXE in the most commonly used Java XML parsers.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## Java

**ほとんどの Java XML パーサでは XXE がデフォルトで有効なため、この言語は特に XXE 攻撃を受けやすく、これらのパーサを安全に使用するには XXE を明示的に無効化しなければなりません。** このセクションでは、最も一般的に使用される Java XML パーサで XXE を無効化する方法を説明します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### JAXP DocumentBuilderFactory, SAXParserFactory and DOM4J

The`DocumentBuilderFactory,` `SAXParserFactory` and `DOM4J` `XML` parsers can be protected against XXE attacks with the same techniques.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### JAXP DocumentBuilderFactory、SAXParserFactory、DOM4J

`DocumentBuilderFactory,` `SAXParserFactory`、`DOM4J` `XML` パーサは、同じ手法で XXE 攻撃から保護できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**For brevity, we will only show you how to protect the `DocumentBuilderFactory` parser. Additional instructions for protecting this parser are embedded within the example code**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**簡潔にするため、ここでは `DocumentBuilderFactory` パーサを保護する方法のみを示します。このパーサを保護する追加の手順はサンプルコード内に埋め込まれています。**

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The JAXP `DocumentBuilderFactory` [setFeature](https://docs.oracle.com/javase/7/docs/api/javax/xml/parsers/DocumentBuilderFactory.html#setFeature%28java.lang.String,%20boolean)) method allows a developer to control which implementation-specific XML processor features are enabled or disabled.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

JAXP `DocumentBuilderFactory` の [setFeature](https://docs.oracle.com/javase/7/docs/api/javax/xml/parsers/DocumentBuilderFactory.html#setFeature%28java.lang.String,%20boolean)) メソッドにより、開発者は実装固有の XML プロセッサ機能を有効化または無効化するかを制御できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

These features can either be set on the factory or the underlying `XMLReader` [setFeature](https://docs.oracle.com/javase/7/docs/api/org/xml/sax/XMLReader.html#setFeature%28java.lang.String,%20boolean%29) method.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

これらの機能は、ファクトリまたは基盤となる `XMLReader` の [setFeature](https://docs.oracle.com/javase/7/docs/api/org/xml/sax/XMLReader.html#setFeature%28java.lang.String,%20boolean%29) メソッドのどちらにも設定できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Each XML processor implementation has its own features that govern how DTDs and external entities are processed. By disabling DTD processing entirely, most XXE attacks can be averted, although it is also necessary to disable or verify that XInclude is not enabled.**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**各 XML プロセッサ実装には、DTD と外部エンティティの処理方法を制御する独自の機能があります。DTD 処理を完全に無効化することで、ほとんどの XXE 攻撃を回避できますが、XInclude が有効化されていないことを無効化または検証することも必要です。**

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Since the JDK 6, the flag [FEATURE_SECURE_PROCESSING](https://docs.oracle.com/javase/6/docs/api/javax/xml/XMLConstants.html#FEATURE_SECURE_PROCESSING) can be used to instruct the implementation of the parser to process XML securely**. Its behavior is implementation-dependent. It may help with resource exhaustion but it may not always mitigate entity expansion. More details on this flag can be found [here](https://docs.oracle.com/en/java/javase/13/security/java-api-xml-processing-jaxp-security-guide.html#GUID-88B04BE2-35EF-4F61-B4FA-57A0E9102342).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**JDK 6 以降では、[FEATURE_SECURE_PROCESSING](https://docs.oracle.com/javase/6/docs/api/javax/xml/XMLConstants.html#FEATURE_SECURE_PROCESSING) フラグを使用して、パーサ実装に XML を安全に処理するよう指示できます。** その動作は実装依存です。リソース枯渇には役立つ可能性がありますが、エンティティ展開を常に緩和できるとは限りません。このフラグの詳細は[こちら](https://docs.oracle.com/en/java/javase/13/security/java-api-xml-processing-jaxp-security-guide.html#GUID-88B04BE2-35EF-4F61-B4FA-57A0E9102342)を参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

For a syntax highlighted example code snippet using `SAXParserFactory`, look [here](https://gist.github.com/asudhakar02/45e2e6fd8bcdfb4bc3b2).
Example code disabling DTDs (doctypes) altogether:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

`SAXParserFactory` を使用した構文ハイライト付きのサンプルコードスニペットは[こちら](https://gist.github.com/asudhakar02/45e2e6fd8bcdfb4bc3b2)を参照してください。DTD (doctype) を完全に無効化するサンプルコード:

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

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

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

If you can't completely disable DTDs:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

DTD を完全に無効化できない場合:

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

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

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

[Xerces 1](https://xerces.apache.org/xerces-j/) [Features](https://xerces.apache.org/xerces-j/features.html):

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

[Xerces 1](https://xerces.apache.org/xerces-j/) の [Features](https://xerces.apache.org/xerces-j/features.html):

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Do not include external entities by setting [this feature](https://xerces.apache.org/xerces-j/features.html#external-general-entities) to `false`.
- Do not include parameter entities by setting [this feature](https://xerces.apache.org/xerces-j/features.html#external-parameter-entities) to `false`.
- Do not include external DTDs by setting [this feature](https://xerces.apache.org/xerces-j/features.html#load-external-dtd) to `false`.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- [この機能](https://xerces.apache.org/xerces-j/features.html#external-general-entities)を `false` に設定して、外部エンティティを含めないようにする。
- [この機能](https://xerces.apache.org/xerces-j/features.html#external-parameter-entities)を `false` に設定して、パラメータエンティティを含めないようにする。
- [この機能](https://xerces.apache.org/xerces-j/features.html#load-external-dtd)を `false` に設定して、外部 DTD を含めないようにする。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

[Xerces 2](https://xerces.apache.org/xerces2-j/) [Features](https://xerces.apache.org/xerces2-j/features.html):

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

[Xerces 2](https://xerces.apache.org/xerces2-j/) の [Features](https://xerces.apache.org/xerces2-j/features.html):

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Disallow an inline DTD by setting [this feature](https://xerces.apache.org/xerces2-j/features.html#disallow-doctype-decl) to `true`.
- Do not include external entities by setting [this feature](https://xerces.apache.org/xerces2-j/features.html#external-general-entities) to `false`.
- Do not include parameter entities by setting [this feature](https://xerces.apache.org/xerces2-j/features.html#external-parameter-entities) to `false`.
- Do not include external DTDs by setting [this feature](https://xerces.apache.org/xerces-j/features.html#load-external-dtd) to `false`.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- [この機能](https://xerces.apache.org/xerces2-j/features.html#disallow-doctype-decl)を `true` に設定して、インライン DTD を禁止する。
- [この機能](https://xerces.apache.org/xerces2-j/features.html#external-general-entities)を `false` に設定して、外部エンティティを含めないようにする。
- [この機能](https://xerces.apache.org/xerces2-j/features.html#external-parameter-entities)を `false` に設定して、パラメータエンティティを含めないようにする。
- [この機能](https://xerces.apache.org/xerces-j/features.html#load-external-dtd)を `false` に設定して、外部 DTD を含めないようにする。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Note:** The above defenses require Java 7 update 67, Java 8 update 20, or above, because the countermeasures for `DocumentBuilderFactory` and SAXParserFactory are broken in earlier Java versions, per: [CVE-2014-6517](http://www.cvedetails.com/cve/CVE-2014-6517/).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**注:** 上記の防御策には Java 7 update 67、Java 8 update 20 以降が必要です。それ以前の Java バージョンでは、[CVE-2014-6517](http://www.cvedetails.com/cve/CVE-2014-6517/) によると、`DocumentBuilderFactory` と SAXParserFactory の対策が壊れています。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### XMLInputFactory (a StAX parser)

[StAX](http://en.wikipedia.org/wiki/StAX) parsers such as [`XMLInputFactory`](http://docs.oracle.com/javase/7/docs/api/javax/xml/stream/XMLInputFactory.html) allow various properties and features to be set.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### XMLInputFactory (StAX パーサ)

[`XMLInputFactory`](http://docs.oracle.com/javase/7/docs/api/javax/xml/stream/XMLInputFactory.html) などの [StAX](http://en.wikipedia.org/wiki/StAX) パーサでは、さまざまなプロパティと機能を設定できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

To protect a Java `XMLInputFactory` from XXE, disable DTDs (doctypes) altogether:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Java `XMLInputFactory` を XXE から保護するには、DTD (doctype) を完全に無効化します。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```java
// This disables DTDs entirely for that factory
xmlInputFactory.setProperty(XMLInputFactory.SUPPORT_DTD, false);
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

or if you can't completely disable DTDs:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

または、DTD を完全に無効化できない場合:

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```java
// This causes XMLStreamException to be thrown if external DTDs are accessed.
xmlInputFactory.setProperty(XMLConstants.ACCESS_EXTERNAL_DTD, "");
// disable external entities
xmlInputFactory.setProperty("javax.xml.stream.isSupportingExternalEntities", false);
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The setting `xmlInputFactory.setProperty(XMLConstants.ACCESS_EXTERNAL_SCHEMA, "");` is not required, as XMLInputFactory is dependent on Validator to perform XML validation against Schemas. Check the [Validator](#validator) section for the specific configuration.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

`XMLInputFactory` はスキーマに対する XML 検証を実行するために Validator に依存しているため、`xmlInputFactory.setProperty(XMLConstants.ACCESS_EXTERNAL_SCHEMA, "");` の設定は不要です。具体的な設定については [Validator](#validator) セクションを確認してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Oracle DOM Parser

Follow [Oracle recommendation](https://docs.oracle.com/en/database/oracle/oracle-database/18/adxdk/security-considerations-oracle-xml-developers-kit.html#GUID-45303542-41DE-4455-93B3-854A826EF8BB) e.g.:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Oracle DOM Parser

[Oracle の推奨事項](https://docs.oracle.com/en/database/oracle/oracle-database/18/adxdk/security-considerations-oracle-xml-developers-kit.html#GUID-45303542-41DE-4455-93B3-854A826EF8BB)に従います。例:

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

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

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### TransformerFactory

To protect a `javax.xml.transform.TransformerFactory` from XXE, do this:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### TransformerFactory

`javax.xml.transform.TransformerFactory` を XXE から保護するには、次のようにします。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```java
TransformerFactory tf = TransformerFactory.newInstance();
tf.setAttribute(XMLConstants.ACCESS_EXTERNAL_DTD, "");
tf.setAttribute(XMLConstants.ACCESS_EXTERNAL_STYLESHEET, "");
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Validator

To protect a `javax.xml.validation.Validator` from XXE, do this:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Validator

`javax.xml.validation.Validator` を XXE から保護するには、次のようにします。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```java
SchemaFactory factory = SchemaFactory.newInstance("http://www.w3.org/2001/XMLSchema");
factory.setProperty(XMLConstants.ACCESS_EXTERNAL_DTD, "");
factory.setProperty(XMLConstants.ACCESS_EXTERNAL_SCHEMA, "");
Schema schema = factory.newSchema();
Validator validator = schema.newValidator();
validator.setProperty(XMLConstants.ACCESS_EXTERNAL_DTD, "");
validator.setProperty(XMLConstants.ACCESS_EXTERNAL_SCHEMA, "");
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### SchemaFactory

To protect a `javax.xml.validation.SchemaFactory` from XXE, do this:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### SchemaFactory

`javax.xml.validation.SchemaFactory` を XXE から保護するには、次のようにします。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```java
SchemaFactory factory = SchemaFactory.newInstance("http://www.w3.org/2001/XMLSchema");
factory.setProperty(XMLConstants.ACCESS_EXTERNAL_DTD, "");
factory.setProperty(XMLConstants.ACCESS_EXTERNAL_SCHEMA, "");
Schema schema = factory.newSchema(Source);
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### SAXTransformerFactory

To protect a `javax.xml.transform.sax.SAXTransformerFactory` from XXE, do this:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### SAXTransformerFactory

`javax.xml.transform.sax.SAXTransformerFactory` を XXE から保護するには、次のようにします。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```java
SAXTransformerFactory sf = SAXTransformerFactory.newInstance();
sf.setAttribute(XMLConstants.ACCESS_EXTERNAL_DTD, "");
sf.setAttribute(XMLConstants.ACCESS_EXTERNAL_STYLESHEET, "");
sf.newXMLFilter(Source);
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Note: Use of the following `XMLConstants` requires JAXP 1.5, which was added to Java in 7u40 and Java 8:**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**注: 次の `XMLConstants` の使用には JAXP 1.5 が必要です。これは Java 7u40 および Java 8 で追加されました。**

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- `javax.xml.XMLConstants.ACCESS_EXTERNAL_DTD`
- `javax.xml.XMLConstants.ACCESS_EXTERNAL_SCHEMA`
- `javax.xml.XMLConstants.ACCESS_EXTERNAL_STYLESHEET`

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- `javax.xml.XMLConstants.ACCESS_EXTERNAL_DTD`
- `javax.xml.XMLConstants.ACCESS_EXTERNAL_SCHEMA`
- `javax.xml.XMLConstants.ACCESS_EXTERNAL_STYLESHEET`

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### XMLReader

To protect the Java `org.xml.sax.XMLReader` from an XXE attack, do this:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### XMLReader

Java `org.xml.sax.XMLReader` を XXE 攻撃から保護するには、次のようにします。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```java
XMLReader reader = XMLReaderFactory.createXMLReader();
reader.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);
// This may not be strictly required as DTDs shouldn't be allowed at all, per previous line.
reader.setFeature("http://apache.org/xml/features/nonvalidating/load-external-dtd", false);
reader.setFeature("http://xml.org/sax/features/external-general-entities", false);
reader.setFeature("http://xml.org/sax/features/external-parameter-entities", false);
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### SAXReader

To protect a Java `org.dom4j.io.SAXReader` from an XXE attack, do this:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### SAXReader

Java `org.dom4j.io.SAXReader` を XXE 攻撃から保護するには、次のようにします。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```java
saxReader.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);
saxReader.setFeature("http://xml.org/sax/features/external-general-entities", false);
saxReader.setFeature("http://xml.org/sax/features/external-parameter-entities", false);
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

If your code does not have all of these lines, you could be vulnerable to an XXE attack.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

コードにこれらすべての行がない場合、XXE 攻撃に対して脆弱である可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### SAXBuilder

To protect a Java `org.jdom2.input.SAXBuilder` from an XXE attack, disallow DTDs (doctypes) entirely:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### SAXBuilder

Java `org.jdom2.input.SAXBuilder` を XXE 攻撃から保護するには、DTD (doctype) を完全に禁止します。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```java
SAXBuilder builder = new SAXBuilder();
builder.setFeature("http://apache.org/xml/features/disallow-doctype-decl",true);
Document doc = builder.build(new File(fileName));
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Alternatively, if DTDs can't be completely disabled, disable external entities and entity expansion:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

または、DTD を完全に無効化できない場合は、外部エンティティとエンティティ展開を無効化します。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```java
SAXBuilder builder = new SAXBuilder();
builder.setFeature("http://xml.org/sax/features/external-general-entities", false);
builder.setFeature("http://xml.org/sax/features/external-parameter-entities", false);
builder.setFeature("http://apache.org/xml/features/nonvalidating/load-external-dtd", false);
builder.setExpandEntities(false);
Document doc = builder.build(new File(fileName));
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### No-op EntityResolver

For APIs that take an `EntityResolver`, you can neutralize an XML parser's ability to resolve entities by [supplying a no-op implementation](https://wiki.sei.cmu.edu/confluence/display/java/IDS17-J.+Prevent+XML+External+Entity+Attacks):

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### No-op EntityResolver

`EntityResolver` を受け取る API では、[no-op 実装を提供](https://wiki.sei.cmu.edu/confluence/display/java/IDS17-J.+Prevent+XML+External+Entity+Attacks)することで、XML パーサがエンティティを解決する能力を無効化できます。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

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

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

or more simply:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

または、より簡単には次のようにします。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```java
EntityResolver noop = (publicId, systemId) -> new InputSource(new StringReader(""));
xmlReader.setEntityResolver(noop);
documentBuilder.setEntityResolver(noop);
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### JAXB Unmarshaller

**You should ensure that the source to the `unmarshal` function of `javax.xml.bind.Unmarshaller` is `javax.xml.stream.XMLStreamReader` that was generated using `javax.xml.stream.XMLInputFactory` with safe properties, i.e. `XMLInputFactory.SUPPORT_DTD` and `XMLInputFactory.IS_SUPPORTING_EXTERNAL_ENTITIES` set to `false`.** For example:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### JAXB Unmarshaller

**`javax.xml.bind.Unmarshaller` の `unmarshal` 関数に渡すソースが、安全なプロパティ、すなわち `XMLInputFactory.SUPPORT_DTD` と `XMLInputFactory.IS_SUPPORTING_EXTERNAL_ENTITIES` を `false` に設定した `javax.xml.stream.XMLInputFactory` で生成された `javax.xml.stream.XMLStreamReader` であることを確認すべきです。** 例:

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

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

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Note that both the `createXMLStreamReader` and `unmarshal` methods have several overloads with various source types, so you need to pick the right one and do a possible conversion.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

`createXMLStreamReader` と `unmarshal` の両メソッドには、さまざまなソース型を取る複数のオーバーロードがあるため、適切なものを選び、必要に応じて変換する必要があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### XPathExpression

**Since `javax.xml.xpath.XPathExpression` can not be configured securely by itself, the untrusted data must be parsed through another securable XML parser first.**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### XPathExpression

**`javax.xml.xpath.XPathExpression` はそれ自体を安全に設定できないため、信頼できないデータはまず別の安全に設定可能な XML パーサで解析しなければなりません。**

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

For example:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

例:

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```java
DocumentBuilderFactory df = DocumentBuilderFactory.newInstance();
df.setAttribute(XMLConstants.ACCESS_EXTERNAL_DTD, "");
df.setAttribute(XMLConstants.ACCESS_EXTERNAL_SCHEMA, "");
DocumentBuilder builder = df.newDocumentBuilder();
String result = new XPathExpression().evaluate( builder.parse(
                            new ByteArrayInputStream(xml.getBytes())) );
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### java.beans.XMLDecoder

**The [readObject()](https://docs.oracle.com/javase/8/docs/api/java/beans/XMLDecoder.html#readObject--) method in this class is fundamentally unsafe.**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### java.beans.XMLDecoder

**このクラスの [readObject()](https://docs.oracle.com/javase/8/docs/api/java/beans/XMLDecoder.html#readObject--) メソッドは根本的に安全ではありません。**

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Not only is the XML it parses subject to XXE, but the method can be used to construct any Java object, and [execute arbitrary code as described here](http://stackoverflow.com/questions/14307442/is-it-safe-to-use-xmldecoder-to-read-document-files).**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**解析する XML が XXE の対象になるだけでなく、このメソッドは任意の Java オブジェクトを構築し、[ここで説明されているように任意のコードを実行](http://stackoverflow.com/questions/14307442/is-it-safe-to-use-xmldecoder-to-read-document-files)するためにも使用できます。**

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**And there is no way to make use of this class safe except to trust or properly validate the input being passed into it.**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**このクラスを安全に使用する方法は、渡される入力を信頼するか適切に検証すること以外にありません。**

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**As such, we'd strongly recommend completely avoiding the use of this class and replacing it with a safe or properly configured XML parser as described elsewhere in this cheat sheet.**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**そのため、このクラスの使用を完全に避け、このチートシートの他の箇所で説明している安全な、または適切に設定された XML パーサに置き換えることを強く推奨します。**

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Other XML Parsers

**There are many third-party libraries that parse XML either directly or through their use of other libraries. Please test and verify their XML parser is secure against XXE by default.** If the parser is not secure by default, look for flags supported by the parser to disable all possible external resource inclusions like the examples given above. If there's no control exposed to the outside, make sure the untrusted content is passed through a secure parser first and then passed to insecure third-party parser similar to how the Unmarshaller is secured.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### その他の XML パーサ

**XML を直接、または他のライブラリの使用を通じて解析するサードパーティライブラリは多数あります。その XML パーサがデフォルトで XXE に対して安全であることをテストし、検証してください。** パーサがデフォルトで安全でない場合は、上記の例のように、外部リソースの取り込みをすべて無効化するためにパーサがサポートするフラグを探してください。外部に公開された制御がない場合は、Unmarshaller を安全にする方法と同様に、信頼できない内容をまず安全なパーサに通し、その後で安全でないサードパーティパーサに渡してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Spring Framework MVC/OXM XXE Vulnerabilities

**Some XXE vulnerabilities were found in [Spring OXM](https://pivotal.io/security/cve-2013-4152) and [Spring MVC](https://pivotal.io/security/cve-2013-7315) . The following versions of the Spring Framework are vulnerable to XXE:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### Spring Framework MVC/OXM XXE 脆弱性

**[Spring OXM](https://pivotal.io/security/cve-2013-4152) と [Spring MVC](https://pivotal.io/security/cve-2013-7315) でいくつかの XXE 脆弱性が見つかりました。次の Spring Framework バージョンは XXE に対して脆弱です。**

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- **3.0.0** to **3.2.3** (Spring OXM & Spring MVC)
- **4.0.0.M1** (Spring OXM)
- **4.0.0.M1-4.0.0.M2** (Spring MVC)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- **3.0.0** から **3.2.3** (Spring OXM & Spring MVC)
- **4.0.0.M1** (Spring OXM)
- **4.0.0.M1-4.0.0.M2** (Spring MVC)

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

There were other issues as well that were fixed later, so to fully address these issues, Spring recommends you upgrade to Spring Framework 3.2.8+ or 4.0.2+.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

後で修正された他の問題もあったため、これらの問題に完全に対処するには、Spring は Spring Framework 3.2.8+ または 4.0.2+ へのアップグレードを推奨しています。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

For Spring OXM, this is referring to the use of org.springframework.oxm.jaxb.Jaxb2Marshaller. **Note that the CVE for Spring OXM specifically indicates that two XML parsing situations are up to the developer to get right, and the other two are the responsibility of Spring and were fixed to address this CVE.**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Spring OXM では、これは org.springframework.oxm.jaxb.Jaxb2Marshaller の使用を指しています。**Spring OXM の CVE は、2 つの XML 解析状況については開発者が正しく処理する必要があり、残り 2 つは Spring の責任であり、この CVE に対処するため修正されたことを明示しています。**

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Here's what they say:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

記載内容は次のとおりです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Two situations developers must handle:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

開発者が処理しなければならない 2 つの状況:

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- For a `DOMSource`, the XML has already been parsed by user code and that code is responsible for protecting against XXE.
- For a `StAXSource`, the XMLStreamReader has already been created by user code and that code is responsible for protecting against XXE.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- `DOMSource` の場合、XML はすでにユーザーコードによって解析されており、そのコードが XXE から保護する責任を持ちます。
- `StAXSource` の場合、XMLStreamReader はすでにユーザーコードによって作成されており、そのコードが XXE から保護する責任を持ちます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The issue Spring fixed:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Spring が修正した問題:

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

For SAXSource and StreamSource instances, Spring processed external entities by default thereby creating this vulnerability.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

SAXSource および StreamSource インスタンスでは、Spring がデフォルトで外部エンティティを処理していたため、この脆弱性が生じていました。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Here's an example of using a StreamSource that was vulnerable, but is now safe, if you are using a fixed version of Spring OXM or Spring MVC:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

次は、以前は脆弱でしたが、修正版の Spring OXM または Spring MVC を使用していれば現在は安全な StreamSource の使用例です。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```java
import org.springframework.oxm.Jaxb2Marshaller;
import org.springframework.oxm.jaxb.Jaxb2Marshaller;

Jaxb2Marshaller marshaller = new Jaxb2Marshaller();
// Must cast return Object to whatever type you are unmarshalling
marshaller.unmarshal(new StreamSource(new StringReader(some_string_containing_XML));
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

So, per the [Spring OXM CVE writeup](https://pivotal.io/security/cve-2013-4152), the above is now safe. But if you were to use a DOMSource or StAXSource instead, it would be up to you to configure those sources to be safe from XXE.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

したがって、[Spring OXM CVE の説明](https://pivotal.io/security/cve-2013-4152)によれば、上記は現在安全です。ただし、代わりに DOMSource または StAXSource を使用する場合は、それらのソースを XXE から安全になるよう自分で設定する必要があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Castor

**Castor is a data binding framework for Java. It allows conversion between Java objects, XML, and relational tables. The XML features in Castor prior to version 1.3.3 are vulnerable to XXE, and should be upgraded to the latest version.** For additional information, check the official [XML configuration file](https://castor-data-binding.github.io/castor/reference-guide/reference/xml/xml-properties.html)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### Castor

**Castor は Java のデータバインディングフレームワークです。Java オブジェクト、XML、リレーショナルテーブル間の変換を可能にします。バージョン 1.3.3 より前の Castor の XML 機能は XXE に対して脆弱であり、最新バージョンにアップグレードすべきです。** 追加情報については、公式の [XML configuration file](https://castor-data-binding.github.io/castor/reference-guide/reference/xml/xml-properties.html) を確認してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## .NET

**Up-to-date information for XXE injection in .NET is taken directly from the [web application of unit tests by Dean Fleming](https://github.com/deanf1/dotnet-security-unit-tests), which covers all currently supported .NET XML parsers, and has test cases that demonstrate when they are safe from XXE injection and when they are not, but these tests are only with injection from file and not direct DTD (used by DoS attacks).**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## .NET

**.NET における XXE インジェクションの最新情報は、現在サポートされているすべての .NET XML パーサを対象とし、XXE インジェクションに対して安全な場合とそうでない場合を示すテストケースを含む、Dean Fleming による[ユニットテストの Web アプリケーション](https://github.com/deanf1/dotnet-security-unit-tests)から直接取得されています。ただし、これらのテストはファイルからのインジェクションのみを対象としており、DoS 攻撃で使用される直接 DTD は対象外です。**

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

For DoS attacks using a direct DTD (such as the [Billion laughs attack](https://en.wikipedia.org/wiki/Billion_laughs_attack)), a [separate testing application from Josh Grossman at Bounce Security](https://github.com/BounceSecurity/BillionLaughsTester) has been created to verify that .NET >=4.5.2 is safe from these attacks.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

直接 DTD を使用した DoS 攻撃 ([Billion laughs attack](https://en.wikipedia.org/wiki/Billion_laughs_attack) など) については、Bounce Security の Josh Grossman による[別のテストアプリケーション](https://github.com/BounceSecurity/BillionLaughsTester)が作成され、.NET >=4.5.2 がこれらの攻撃に対して安全であることを検証しています。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Previously, this information was based on some older articles which may not be 100% accurate including:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

以前、この情報は 100% 正確とは限らない古い記事に基づいていました。例:

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- [James Jardine's excellent .NET XXE article](https://www.jardinesoftware.net/2016/05/26/xxe-and-net/).
- [Guidance from Microsoft on how to prevent XXE and XML Denial of Service in .NET](http://msdn.microsoft.com/en-us/magazine/ee335713.aspx).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- [James Jardine's excellent .NET XXE article](https://www.jardinesoftware.net/2016/05/26/xxe-and-net/)
- [Guidance from Microsoft on how to prevent XXE and XML Denial of Service in .NET](http://msdn.microsoft.com/en-us/magazine/ee335713.aspx)

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Overview of .NET Parser Safety Levels

**Below is an overview of all supported .NET XML parsers and their default safety levels. More details about each parser are included after this list.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### .NET パーサ安全レベルの概要

**以下は、サポートされているすべての .NET XML パーサとそのデフォルト安全レベルの概要です。各パーサの詳細は、この一覧の後に含まれています。**

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**XDocument (LINQ to XML)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**XDocument (LINQ to XML)**

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

This parser is protected from external entities at .NET Framework version 4.5.2 and protected from Billion Laughs at version 4.5.2 or greater, but it is uncertain if this parser is protected from Billion Laughs before version 4.5.2.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

このパーサは .NET Framework バージョン 4.5.2 では外部エンティティから保護され、バージョン 4.5.2 以上では Billion Laughs から保護されます。ただし、バージョン 4.5.2 より前に Billion Laughs から保護されるかは不確かです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### XmlDocument, XmlTextReader, XPathNavigator default safety levels

These parsers are vulnerable to external entity attacks and Billion Laughs at versions below version 4.5.2 but protected at versions equal or greater than 4.5.2.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### XmlDocument、XmlTextReader、XPathNavigator のデフォルト安全レベル

これらのパーサは、バージョン 4.5.2 未満では外部エンティティ攻撃と Billion Laughs に対して脆弱ですが、バージョン 4.5.2 以上では保護されています。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### XmlDictionaryReader, XmlNodeReader, XmlReader default safety levels

These parsers are not vulnerable to external entity attacks or Billion Laughs before or after version 4.5.2. Also, at or greater than versions ≥4.5.2, these libraries won't even process the in-line DTD by default. Even if you change the default to allow processing a DTD, if a DoS attempt is performed an exception will still be thrown as documented above.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### XmlDictionaryReader、XmlNodeReader、XmlReader のデフォルト安全レベル

これらのパーサは、バージョン 4.5.2 の前後を問わず、外部エンティティ攻撃や Billion Laughs に対して脆弱ではありません。また、バージョン ≥4.5.2 以上では、これらのライブラリはデフォルトでインライン DTD さえ処理しません。DTD の処理を許可するようデフォルトを変更した場合でも、上記のとおり DoS 試行が行われると例外がスローされます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### ASP.NET

ASP.NET applications ≥ .NET 4.5.2 must also ensure setting the `<httpRuntime targetFramework="..." />` in their `Web.config` to ≥4.5.2 or risk being vulnerable regardless or the actual .NET version. Omitting this tag will also result in unsafe-by-default behavior.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### ASP.NET

ASP.NET アプリケーション ≥ .NET 4.5.2 では、実際の .NET バージョンにかかわらず脆弱になるリスクを避けるため、`Web.config` の `<httpRuntime targetFramework="..." />` を ≥4.5.2 に設定していることも確認しなければなりません。このタグを省略しても、安全でないデフォルト動作になります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

For the purpose of understanding the above table, the `.NET Framework Version` for an ASP.NET applications is either the .NET version the application was build with or the httpRuntime's `targetFramework` (Web.config), **whichever is lower**.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

上記の表を理解するうえで、ASP.NET アプリケーションの `.NET Framework Version` は、アプリケーションがビルドされた .NET バージョン、または httpRuntime の `targetFramework` (Web.config) の**どちらか低い方**です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

This configuration tag should not be confused with a similar configuration tag: `<compilation targetFramework="..." />` or the assemblies / projects targetFramework, which are **not** sufficient for achieving secure-by-default behaviour as advertised in the above table.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

この設定タグは、類似した設定タグである `<compilation targetFramework="..." />` や、アセンブリ / プロジェクトの targetFramework と混同してはいけません。これらは、上記の表で示される安全なデフォルト動作を実現するには**十分ではありません**。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### LINQ to XML

**Both the `XElement` and `XDocument` objects in the `System.Xml.Linq` library are safe from XXE injection from external file and DoS attack by default.** `XElement` parses only the elements within the XML file, so DTDs are ignored altogether. `XDocument` has XmlResolver [disabled by default](https://docs.microsoft.com/en-us/dotnet/standard/linq/linq-xml-security) so it's safe from SSRF. Whilst DTDs are [enabled by default](https://referencesource.microsoft.com/#System.Xml.Linq/System/Xml/Linq/XLinq.cs,71f4626a3d6f9bad), from Framework versions ≥4.5.2, it is **not** vulnerable to DoS as noted but it may be vulnerable in earlier Framework versions. For more information, see [Microsoft's guidance on how to prevent XXE and XML Denial of Service in .NET](http://msdn.microsoft.com/en-us/magazine/ee335713.aspx)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### LINQ to XML

**`System.Xml.Linq` ライブラリの `XElement` と `XDocument` オブジェクトはどちらも、デフォルトで外部ファイルからの XXE インジェクションと DoS 攻撃に対して安全です。** `XElement` は XML ファイル内の要素のみを解析するため、DTD は完全に無視されます。`XDocument` は XmlResolver が[デフォルトで無効化](https://docs.microsoft.com/en-us/dotnet/standard/linq/linq-xml-security)されているため、SSRF に対して安全です。DTD は[デフォルトで有効](https://referencesource.microsoft.com/#System.Xml.Linq/System/Xml/Linq/XLinq.cs,71f4626a3d6f9bad)ですが、Framework バージョン ≥4.5.2 では前述のとおり DoS に対して**脆弱ではありません**。ただし、それ以前の Framework バージョンでは脆弱である可能性があります。詳細については、[Microsoft's guidance on how to prevent XXE and XML Denial of Service in .NET](http://msdn.microsoft.com/en-us/magazine/ee335713.aspx) を参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### XmlDictionaryReader

**`System.Xml.XmlDictionaryReader` is safe by default, as when it attempts to parse the DTD, the compiler throws an exception saying that "CData elements not valid at top level of an XML document". It becomes unsafe if constructed with a different unsafe XML parser.**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### XmlDictionaryReader

**`System.Xml.XmlDictionaryReader` はデフォルトで安全です。DTD を解析しようとすると、コンパイラが `"CData elements not valid at top level of an XML document"` という例外をスローするためです。別の安全でない XML パーサで構築された場合は安全でなくなります。**

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### XmlDocument

**Prior to .NET Framework version 4.5.2, `System.Xml.XmlDocument` is unsafe by default. The `XmlDocument` object has an `XmlResolver` object within it that needs to be set to null in versions prior to 4.5.2. In versions 4.5.2 and up, this `XmlResolver` is set to null by default.**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### XmlDocument

**.NET Framework バージョン 4.5.2 より前では、`System.Xml.XmlDocument` はデフォルトで安全ではありません。`XmlDocument` オブジェクトには `XmlResolver` オブジェクトが含まれており、4.5.2 より前のバージョンでは null に設定する必要があります。バージョン 4.5.2 以降では、この `XmlResolver` はデフォルトで null に設定されています。**

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The following example shows how it is made safe:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

次の例は、安全にする方法を示しています。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

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

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**For .NET Framework version ≥4.5.2, this is safe by default**.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**.NET Framework バージョン ≥4.5.2 では、これはデフォルトで安全です。**

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

`XmlDocument` can become unsafe if you create your own nonnull `XmlResolver` with default or unsafe settings. If you need to enable DTD processing, instructions on how to do so safely are described in detail in the [referenced MSDN article](https://msdn.microsoft.com/en-us/magazine/ee335713.aspx).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

デフォルトまたは安全でない設定を持つ null ではない独自の `XmlResolver` を作成すると、`XmlDocument` は安全でなくなる可能性があります。DTD 処理を有効化する必要がある場合、安全に行う方法は[参照先の MSDN 記事](https://msdn.microsoft.com/en-us/magazine/ee335713.aspx)で詳しく説明されています。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### XmlNodeReader

`System.Xml.XmlNodeReader` objects are safe by default and will ignore DTDs even when constructed with an unsafe parser or wrapped in another unsafe parser.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### XmlNodeReader

`System.Xml.XmlNodeReader` オブジェクトはデフォルトで安全であり、安全でないパーサで構築された場合や別の安全でないパーサにラップされた場合でも DTD を無視します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### XmlReader

`System.Xml.XmlReader` objects are safe by default.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### XmlReader

`System.Xml.XmlReader` オブジェクトはデフォルトで安全です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

They are set by default to have their ProhibitDtd property set to false in .NET Framework versions 4.0 and earlier, or their `DtdProcessing` property set to Prohibit in .NET versions 4.0 and later.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

.NET Framework バージョン 4.0 以前では ProhibitDtd プロパティが false に設定され、.NET バージョン 4.0 以降では `DtdProcessing` プロパティが Prohibit に設定されるようデフォルト設定されています。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Additionally, in .NET versions 4.5.2 and later, the `XmlReaderSettings` belonging to the `XmlReader` has its `XmlResolver` set to null by default, which provides an additional layer of safety.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

さらに、.NET バージョン 4.5.2 以降では、`XmlReader` に属する `XmlReaderSettings` の `XmlResolver` はデフォルトで null に設定されており、追加の安全層を提供します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Therefore, `XmlReader` objects will only become unsafe in version 4.5.2 and up if both the `DtdProcessing` property is set to Parse and the `XmlReaderSetting`'s `XmlResolver` is set to a nonnull XmlResolver with default or unsafe settings. If you need to enable DTD processing, instructions on how to do so safely are described in detail in the [referenced MSDN article](https://msdn.microsoft.com/en-us/magazine/ee335713.aspx).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

したがって、バージョン 4.5.2 以降で `XmlReader` オブジェクトが安全でなくなるのは、`DtdProcessing` プロパティが Parse に設定され、かつ `XmlReaderSetting` の `XmlResolver` がデフォルトまたは安全でない設定を持つ null ではない XmlResolver に設定されている場合のみです。DTD 処理を有効化する必要がある場合、安全に行う方法は[参照先の MSDN 記事](https://msdn.microsoft.com/en-us/magazine/ee335713.aspx)で詳しく説明されています。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### XmlTextReader

`System.Xml.XmlTextReader` is **unsafe** by default in .NET Framework versions prior to 4.5.2. Here is how to make it safe in various .NET versions:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### XmlTextReader

`System.Xml.XmlTextReader` は、.NET Framework バージョン 4.5.2 より前ではデフォルトで**安全ではありません**。各 .NET バージョンで安全にする方法は次のとおりです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Prior to .NET 4.0

In .NET Framework versions prior to 4.0, DTD parsing behavior for `XmlReader` objects like `XmlTextReader` are controlled by the Boolean `ProhibitDtd` property found in the `System.Xml.XmlReaderSettings` and `System.Xml.XmlTextReader` classes.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### .NET 4.0 より前

.NET Framework バージョン 4.0 より前では、`XmlTextReader` のような `XmlReader` オブジェクトの DTD 解析動作は、`System.Xml.XmlReaderSettings` クラスと `System.Xml.XmlTextReader` クラスにある Boolean の `ProhibitDtd` プロパティで制御されます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Set these values to true to disable inline DTDs completely.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

インライン DTD を完全に無効化するには、これらの値を true に設定します。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```csharp
XmlTextReader reader = new XmlTextReader(stream);
// NEEDED because the default is FALSE!!
reader.ProhibitDtd = true;
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### .NET 4.0 - .NET 4.5.2

**In .NET Framework version 4.0, DTD parsing behavior has been changed. The `ProhibitDtd` property has been deprecated in favor of the new `DtdProcessing` property.**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### .NET 4.0 - .NET 4.5.2

**.NET Framework バージョン 4.0 では、DTD 解析動作が変更されました。`ProhibitDtd` プロパティは非推奨となり、新しい `DtdProcessing` プロパティが使用されるようになりました。**

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**However, they didn't change the default settings so `XmlTextReader` is still vulnerable to XXE by default.**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**しかし、デフォルト設定は変更されなかったため、`XmlTextReader` は依然としてデフォルトで XXE に対して脆弱です。**

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Setting `DtdProcessing` to `Prohibit` causes the runtime to throw an exception if a `<!DOCTYPE>` element is present in the XML.**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**`DtdProcessing` を `Prohibit` に設定すると、XML に `<!DOCTYPE>` 要素が存在する場合、ランタイムが例外をスローします。**

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

To set this value yourself, it looks like this:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

この値を自分で設定するには、次のようにします。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```csharp
XmlTextReader reader = new XmlTextReader(stream);
// NEEDED because the default is Parse!!
reader.DtdProcessing = DtdProcessing.Prohibit;
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Alternatively, you can set the `DtdProcessing` property to `Ignore`, which will not throw an exception on encountering a `<!DOCTYPE>` element but will simply skip over it and not process it. Finally, you can set `DtdProcessing` to `Parse` if you do want to allow and process inline DTDs.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

または、`DtdProcessing` プロパティを `Ignore` に設定できます。これは `<!DOCTYPE>` 要素に遭遇しても例外をスローせず、単にスキップして処理しません。最後に、インライン DTD を許可して処理したい場合は、`DtdProcessing` を `Parse` に設定できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### .NET 4.5.2 and later

In .NET Framework versions 4.5.2 and up, `XmlTextReader`'s internal `XmlResolver` is set to null by default, making the `XmlTextReader` ignore DTDs by default. The `XmlTextReader` can become unsafe if you create your own nonnull `XmlResolver` with default or unsafe settings.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### .NET 4.5.2 以降

.NET Framework バージョン 4.5.2 以降では、`XmlTextReader` の内部 `XmlResolver` はデフォルトで null に設定されており、`XmlTextReader` はデフォルトで DTD を無視します。デフォルトまたは安全でない設定を持つ null ではない独自の `XmlResolver` を作成すると、`XmlTextReader` は安全でなくなる可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### XPathNavigator

`System.Xml.XPath.XPathNavigator` is **unsafe** by default in .NET Framework versions prior to 4.5.2.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### XPathNavigator

`System.Xml.XPath.XPathNavigator` は、.NET Framework バージョン 4.5.2 より前ではデフォルトで**安全ではありません**。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

This is due to the fact that it implements `IXPathNavigable` objects like `XmlDocument`, which are also unsafe by default in versions prior to 4.5.2.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

これは、`XmlDocument` のような `IXPathNavigable` オブジェクトを実装しており、それらも 4.5.2 より前のバージョンではデフォルトで安全でないためです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

You can make `XPathNavigator` safe by giving it a safe parser like `XmlReader` (which is safe by default) in the `XPathDocument`'s constructor.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

`XPathDocument` のコンストラクタで、デフォルトで安全な `XmlReader` のような安全なパーサを与えることで、`XPathNavigator` を安全にできます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Here is an example:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

例:

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```csharp
XmlReader reader = XmlReader.Create("example.xml");
XPathDocument doc = new XPathDocument(reader);
XPathNavigator nav = doc.CreateNavigator();
string xml = nav.InnerXml.ToString();
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

For .NET Framework version ≥4.5.2, XPathNavigator is **safe by default**.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

.NET Framework バージョン ≥4.5.2 では、XPathNavigator は**デフォルトで安全**です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### XslCompiledTransform

`System.Xml.Xsl.XslCompiledTransform` (an XML transformer) is safe by default as long as the parser it's given is safe.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### XslCompiledTransform

`System.Xml.Xsl.XslCompiledTransform` (XML トランスフォーマ) は、渡されるパーサが安全である限り、デフォルトで安全です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

It is safe by default because the default parser of the `Transform()` methods is an `XmlReader`, which is safe by default (per above).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

`Transform()` メソッドのデフォルトパーサは、上記のとおりデフォルトで安全な `XmlReader` であるため、デフォルトで安全です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

[The source code for this method is here.](http://www.dotnetframework.org/default.aspx/4@0/4@0/DEVDIV_TFS/Dev10/Releases/RTMRel/ndp/fx/src/Xml/System/Xml/Xslt/XslCompiledTransform@cs/1305376/XslCompiledTransform@cs)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

[このメソッドのソースコードはこちらです。](http://www.dotnetframework.org/default.aspx/4@0/4@0/DEVDIV_TFS/Dev10/Releases/RTMRel/ndp/fx/src/Xml/System/Xml/Xslt/XslCompiledTransform@cs/1305376/XslCompiledTransform@cs)

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Some of the `Transform()` methods accept an `XmlReader` or `IXPathNavigable` (e.g., `XmlDocument`) as an input, and if you pass in an unsafe XML Parser then the `Transform` will also be unsafe.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

一部の `Transform()` メソッドは、`XmlReader` または `IXPathNavigable` (`XmlDocument` など) を入力として受け取ります。安全でない XML パーサを渡すと、`Transform` も安全でなくなります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## iOS

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## iOS

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### libxml2

**iOS includes the C/C++ libxml2 library described above, so that guidance applies if you are using libxml2 directly.**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### libxml2

**iOS には上記で説明した C/C++ libxml2 ライブラリが含まれているため、libxml2 を直接使用する場合はそのガイダンスが適用されます。**

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**However, the version of libxml2 provided up through iOS6 is prior to version 2.9 of libxml2 (which protects against XXE by default).**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**ただし、iOS6 までで提供される libxml2 のバージョンは 2.9 より前です。libxml2 2.9 はデフォルトで XXE から保護します。**

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### NSXMLDocument

**iOS also provides an `NSXMLDocument` type, which is built on top of libxml2.**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### NSXMLDocument

**iOS は libxml2 の上に構築された `NSXMLDocument` 型も提供しています。**

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**However, `NSXMLDocument` provides some additional protections against XXE that aren't available in libxml2 directly.**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**ただし、`NSXMLDocument` は libxml2 を直接使用する場合には利用できない、XXE に対する追加の保護を提供します。**

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Per the 'NSXMLDocument External Entity Restriction API' section of this [page](https://developer.apple.com/library/archive/releasenotes/Foundation/RN-Foundation-iOS/Foundation_iOS5.html):

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

この[ページ](https://developer.apple.com/library/archive/releasenotes/Foundation/RN-Foundation-iOS/Foundation_iOS5.html)の 'NSXMLDocument External Entity Restriction API' セクションによると:

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- iOS4 and earlier: All external entities are loaded by default.
- iOS5 and later: Only entities that don't require network access are loaded. (which is safer)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- iOS4 以前: すべての外部エンティティがデフォルトで読み込まれます。
- iOS5 以降: ネットワークアクセスを必要としないエンティティのみが読み込まれます。(より安全です)

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**However, to completely disable XXE in an `NSXMLDocument` in any version of iOS you simply specify `NSXMLNodeLoadExternalEntitiesNever` when creating the `NSXMLDocument`.**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**ただし、どの iOS バージョンでも `NSXMLDocument` の XXE を完全に無効化するには、`NSXMLDocument` の作成時に `NSXMLNodeLoadExternalEntitiesNever` を指定するだけです。**

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## PHP

**When using the default XML parser (based on libxml2), PHP 8.0 and newer [prevent XXE by default](https://www.php.net/manual/en/function.libxml-disable-entity-loader.php).**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## PHP

**デフォルトの XML パーサ (libxml2 ベース) を使用する場合、PHP 8.0 以降は[デフォルトで XXE を防止](https://www.php.net/manual/en/function.libxml-disable-entity-loader.php)します。**

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**For PHP versions prior to 8.0, per [the PHP documentation](https://www.php.net/manual/en/function.libxml-set-external-entity-loader.php), the following should be set when using the default PHP XML parser in order to prevent XXE:**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**PHP 8.0 より前のバージョンでは、[PHP ドキュメント](https://www.php.net/manual/en/function.libxml-set-external-entity-loader.php)によると、XXE を防止するため、デフォルトの PHP XML パーサを使用する際に次を設定すべきです。**

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```php
libxml_set_external_entity_loader(null);
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

A description of how to abuse this in PHP is presented in a good [SensePost article](https://www.sensepost.com/blog/2014/revisting-xxe-and-abusing-protocols/) describing a cool PHP based XXE vulnerability that was fixed in Facebook.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

PHP でこれを悪用する方法の説明は、Facebook で修正された興味深い PHP ベースの XXE 脆弱性を説明する優れた [SensePost article](https://www.sensepost.com/blog/2014/revisting-xxe-and-abusing-protocols/) に示されています。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Python

The Python 3 official documentation contains a section on [xml vulnerabilities](https://docs.python.org/3/library/xml.html#xml-vulnerabilities). As of the 1st January 2020 Python 2 is no longer supported, however the Python website still contains [some legacy documentation](https://docs.Python.org/2/library/xml.html#xml-vulnerabilities).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## Python

Python 3 の公式ドキュメントには、[xml vulnerabilities](https://docs.python.org/3/library/xml.html#xml-vulnerabilities) に関するセクションがあります。2020 年 1 月 1 日をもって Python 2 はサポートされなくなりましたが、Python の Web サイトにはまだ[一部のレガシードキュメント](https://docs.Python.org/2/library/xml.html#xml-vulnerabilities)があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The table below shows you which various XML parsing modules in Python 3 are vulnerable to certain XXE attacks.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

次の表は、Python 3 のさまざまな XML 解析モジュールが、特定の XXE 攻撃に対して脆弱かどうかを示しています。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

| Attack Type               | sax        | etree      | minidom    | pulldom    | xmlrpc     |
|---------------------------|------------|------------|------------|------------|------------|
| Billion Laughs            | Vulnerable | Vulnerable | Vulnerable | Vulnerable | Vulnerable |
| Quadratic Blowup          | Vulnerable | Vulnerable | Vulnerable | Vulnerable | Vulnerable |
| External Entity Expansion | Safe       | Safe       | Safe       | Safe       | Safe       |
| DTD Retrieval             | Safe       | Safe       | Safe       | Safe       | Safe       |
| Decompression Bomb        | Safe       | Safe       | Safe       | Safe       | Vulnerable |

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

| 攻撃タイプ | sax | etree | minidom | pulldom | xmlrpc |
| --- | --- | --- | --- | --- | --- |
| Billion Laughs | 脆弱 | 脆弱 | 脆弱 | 脆弱 | 脆弱 |
| Quadratic Blowup | 脆弱 | 脆弱 | 脆弱 | 脆弱 | 脆弱 |
| External Entity Expansion | 安全 | 安全 | 安全 | 安全 | 安全 |
| DTD Retrieval | 安全 | 安全 | 安全 | 安全 | 安全 |
| Decompression Bomb | 安全 | 安全 | 安全 | 安全 | 脆弱 |

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

To protect your application from the applicable attacks, [two packages](https://docs.python.org/3/library/xml.html#the-defusedxml-and-defusedexpat-packages) exist to help you sanitize your input and protect your application against DDoS and remote attacks.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

該当する攻撃からアプリケーションを保護するため、入力をサニタイズし、DDoS とリモート攻撃からアプリケーションを保護するのに役立つ[2 つのパッケージ](https://docs.python.org/3/library/xml.html#the-defusedxml-and-defusedexpat-packages)があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Semgrep Rules

[Semgrep](https://semgrep.dev/) is a command-line tool for offline static analysis. Use pre-built or custom rules to enforce code and security standards in your codebase.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## Semgrep Rules

[Semgrep](https://semgrep.dev/) は、オフライン静的解析のためのコマンドラインツールです。事前構築済みまたはカスタムのルールを使用して、コードベース内のコード標準とセキュリティ標準を適用します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Java

Below are the rules for different XML parsers in Java

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Java

以下は Java の各種 XML パーサ向けルールです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Digester

Identifying XXE vulnerability in the `org.apache.commons.digester3.Digester` library
Rule can be played here [https://semgrep.dev/s/salecharohit:xxe-Digester]%28https://semgrep.dev/s/salecharohit:xxe-Digester)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### Digester

`org.apache.commons.digester3.Digester` ライブラリにおける XXE 脆弱性を識別します。
ルールはここで実行できます [https://semgrep.dev/s/salecharohit:xxe-Digester]%28https://semgrep.dev/s/salecharohit:xxe-Digester)

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### DocumentBuilderFactory

Identifying XXE vulnerability in the `javax.xml.parsers.DocumentBuilderFactory` library
Rule can be played here [https://semgrep.dev/s/salecharohit:xxe-dbf]%28https://semgrep.dev/s/salecharohit:xxe-dbf)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### DocumentBuilderFactory

`javax.xml.parsers.DocumentBuilderFactory` ライブラリにおける XXE 脆弱性を識別します。
ルールはここで実行できます [https://semgrep.dev/s/salecharohit:xxe-dbf]%28https://semgrep.dev/s/salecharohit:xxe-dbf)

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### SAXBuilder

Identifying XXE vulnerability in the `org.jdom2.input.SAXBuilder` library
Rule can be played here [https://semgrep.dev/s/salecharohit:xxe-saxbuilder]%28https://semgrep.dev/s/salecharohit:xxe-saxbuilder)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### SAXBuilder

`org.jdom2.input.SAXBuilder` ライブラリにおける XXE 脆弱性を識別します。
ルールはここで実行できます [https://semgrep.dev/s/salecharohit:xxe-saxbuilder]%28https://semgrep.dev/s/salecharohit:xxe-saxbuilder)

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### SAXParserFactory

Identifying XXE vulnerability in the `javax.xml.parsers.SAXParserFactory` library
Rule can be played here [https://semgrep.dev/s/salecharohit:xxe-SAXParserFactory]%28https://semgrep.dev/s/salecharohit:xxe-SAXParserFactory)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### SAXParserFactory

`javax.xml.parsers.SAXParserFactory` ライブラリにおける XXE 脆弱性を識別します。
ルールはここで実行できます [https://semgrep.dev/s/salecharohit:xxe-SAXParserFactory]%28https://semgrep.dev/s/salecharohit:xxe-SAXParserFactory)

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### SAXReader

Identifying XXE vulnerability in the `org.dom4j.io.SAXReader` library
Rule can be played here [https://semgrep.dev/s/salecharohit:xxe-SAXReader]%28https://semgrep.dev/s/salecharohit:xxe-SAXReader)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### SAXReader

`org.dom4j.io.SAXReader` ライブラリにおける XXE 脆弱性を識別します。
ルールはここで実行できます [https://semgrep.dev/s/salecharohit:xxe-SAXReader]%28https://semgrep.dev/s/salecharohit:xxe-SAXReader)

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### XMLInputFactory

Identifying XXE vulnerability in the `javax.xml.stream.XMLInputFactory` library
Rule can be played here [https://semgrep.dev/s/salecharohit:xxe-XMLInputFactory]%28https://semgrep.dev/s/salecharohit:xxe-XMLInputFactory)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### XMLInputFactory

`javax.xml.stream.XMLInputFactory` ライブラリにおける XXE 脆弱性を識別します。
ルールはここで実行できます [https://semgrep.dev/s/salecharohit:xxe-XMLInputFactory]%28https://semgrep.dev/s/salecharohit:xxe-XMLInputFactory)

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### XMLReader

Identifying XXE vulnerability in the `org.xml.sax.XMLReader` library
Rule can be played here [https://semgrep.dev/s/salecharohit:xxe-XMLReader]%28https://semgrep.dev/s/salecharohit:xxe-XMLReader)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### XMLReader

`org.xml.sax.XMLReader` ライブラリにおける XXE 脆弱性を識別します。
ルールはここで実行できます [https://semgrep.dev/s/salecharohit:xxe-XMLReader]%28https://semgrep.dev/s/salecharohit:xxe-XMLReader)

</div>
</div>

</section>
</div>

## References

<div className="referenceFooter">

- [XXE by InfoSecInstitute](https://resources.infosecinstitute.com/identify-mitigate-xxe-vulnerabilities/)
- [OWASP Top 10-2017 A4: XML External Entities (XXE)](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A4-XML_External_Entities_%28XXE%29)
- [Timothy Morgan's 2014 paper: "XML Schema, DTD, and Entity Attacks"](https://vsecurity.com//download/papers/XMLDTDEntityAttacks.pdf)
- [FindSecBugs XXE Detection](https://find-sec-bugs.github.io/bugs.htm#XXE_SAXPARSER)
- [XXEbugFind Tool](https://github.com/ssexxe/XXEBugFind)
- [Testing for XML Injection](https://owasp.org/www-project-web-security-testing-guide/stable/4-Web_Application_Security_Testing/07-Input_Validation_Testing/07-Testing_for_XML_Injection.html)

</div>


## Attribution

<div className="attributionFooter">

- Original: XML External Entity Prevention Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/XML_External_Entity_Prevention_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: English original retained for comparison. Japanese translation added. Bilingual display generated from official source and local Japanese translation.
- Retrieved: 2026-05-20

</div>
