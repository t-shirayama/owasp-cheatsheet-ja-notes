---
title: Java Security Cheat Sheet
hide_title: true
---

<div className="docHero" data-category="encoding-and-sanitization">
  <h1>Java セキュリティチートシート</h1>
  <div className="docMeta">
    <span className="docPill">最終更新: 2026-05-20</span>
    <span className="docPill">読了時間: 約 15 分</span>
    <span className="docPill">カテゴリ: 入力検証とサニタイズ</span>
  </div>
</div>

<p className="docLead">Java セキュリティチートシートを、原文・翻訳・対比表示で確認できます。ASVS Index 対応の文脈で、公式原文と日本語訳を確認しやすく整理しています。</p>

<div className="tabbedContent">
  <input className="tabInput" type="radio" name="java-security-view" id="java-security-original" />
  <input className="tabInput" type="radio" name="java-security-view" id="java-security-translation" defaultChecked />
  <input className="tabInput" type="radio" name="java-security-view" id="java-security-bilingual" />

  <div className="contentTabs">
    <label htmlFor="java-security-original" title="OWASP 原文">原文</label>
    <label htmlFor="java-security-translation" title="日本語訳">翻訳</label>
    <label htmlFor="java-security-bilingual" title="原文と翻訳を並べて確認">対比表示</label>
  </div>

<section id="java-security-original-panel" className="tabPanel originalPanel contentPanel">

## Injection Prevention in Java

This section aims to provide tips to handle *Injection* in Java application code.

Sample code used in tips is located [here](https://github.com/righettod/injection-cheat-sheets).

### What is Injection

[Injection](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A1-Injection) in OWASP Top 10 is defined as following:

*Consider anyone who can send untrusted data to the system, including external users, internal users, and administrators.*

### General advice to prevent Injection

The following point can be applied, in a general way, to prevent *Injection* issue:

1. Apply **Input Validation** (using allowlist approach) combined with **Output Sanitizing+Escaping** on user input/output.
2. If you need to interact with system, try to use API features provided by your technology stack (Java / .Net / PHP...) instead of building command.

Additional advice is provided on this [cheatsheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html).

## Specific Injection types

*Examples in this section will be provided in Java technology (see Maven project associated) but advice is applicable to others technologies like .Net / PHP / Ruby / Python...*

### SQL

#### Symptom

Injection of this type occur when the application uses untrusted user input to build an SQL query using a String and execute it.

#### How to prevent

Use *Query Parameterization* in order to prevent injection.

#### Example

``` java
/*No DB framework used here in order to show the real use of
  Prepared Statement from Java API*/
/*Open connection with H2 database and use it*/
Class.forName("org.h2.Driver");
String jdbcUrl = "jdbc:h2:file:" + new File(".").getAbsolutePath() + "/target/db";
try (Connection con = DriverManager.getConnection(jdbcUrl)) {

    /* Sample A: Select data using Prepared Statement*/
    String query = "select * from color where friendly_name = ?";
    List<String> colors = new ArrayList<>();
    try (PreparedStatement pStatement = con.prepareStatement(query)) {
        pStatement.setString(1, "yellow");
        try (ResultSet rSet = pStatement.executeQuery()) {
            while (rSet.next()) {
                colors.add(rSet.getString(1));
            }
        }
    }

    /* Sample B: Insert data using Prepared Statement*/
    query = "insert into color(friendly_name, red, green, blue) values(?, ?, ?, ?)";
    int insertedRecordCount;
    try (PreparedStatement pStatement = con.prepareStatement(query)) {
        pStatement.setString(1, "orange");
        pStatement.setInt(2, 239);
        pStatement.setInt(3, 125);
        pStatement.setInt(4, 11);
        insertedRecordCount = pStatement.executeUpdate();
    }

   /* Sample C: Update data using Prepared Statement*/
    query = "update color set blue = ? where friendly_name = ?";
    int updatedRecordCount;
    try (PreparedStatement pStatement = con.prepareStatement(query)) {
        pStatement.setInt(1, 10);
        pStatement.setString(2, "orange");
        updatedRecordCount = pStatement.executeUpdate();
    }

   /* Sample D: Delete data using Prepared Statement*/
    query = "delete from color where friendly_name = ?";
    int deletedRecordCount;
    try (PreparedStatement pStatement = con.prepareStatement(query)) {
        pStatement.setString(1, "orange");
        deletedRecordCount = pStatement.executeUpdate();
    }

}
```

### JPA

#### Symptom

Injection of this type occur when the application uses untrusted user input to build a JPA query using a String and execute it. It's quite similar to SQL injection but here the altered language is not SQL but JPA QL.

#### How to prevent

Use Java Persistence Query Language **Query Parameterization** in order to prevent injection.

#### Example

``` java
EntityManager entityManager = null;
try {
    /* Get a ref on EntityManager to access DB */
    entityManager = Persistence.createEntityManagerFactory("testJPA").createEntityManager();

    /* Define parameterized query prototype using named parameter to enhance readability */
    String queryPrototype = "select c from Color c where c.friendlyName = :colorName";

    /* Create the query, set the named parameter and execute the query */
    Query queryObject = entityManager.createQuery(queryPrototype);
    Color c = (Color) queryObject.setParameter("colorName", "yellow").getSingleResult();

} finally {
    if (entityManager != null && entityManager.isOpen()) {
        entityManager.close();
    }
}
```

### Operating System

#### Symptom

Injection of this type occur when the application uses untrusted user input to build an Operating System command using a String and execute it.

#### How to prevent

Use technology stack **API** in order to prevent injection.

#### Example

``` java
/* The context taken is, for example, to perform a PING against a computer.
* The prevention is to use the feature provided by the Java API instead of building
* a system command as String and execute it */
InetAddress host = InetAddress.getByName("localhost");
var reachable = host.isReachable(5000);
```

### XML: XPath Injection

#### Symptom

Injection of this type occur when the application uses untrusted user input to build a XPath query using a String and execute it.

#### How to prevent

Use **XPath Variable Resolver** in order to prevent injection.

#### Example

**Variable Resolver** implementation.

``` java
/**
 * Resolver in order to define parameter for XPATH expression.
 *
 */
public class SimpleVariableResolver implements XPathVariableResolver {

    private final Map<QName, Object> vars = new HashMap<QName, Object>();

    /**
     * External methods to add parameter
     *
     * @param name Parameter name
     * @param value Parameter value
     */
    public void addVariable(QName name, Object value) {
        vars.put(name, value);
    }

    /**
     * {@inheritDoc}
     *
     * @see javax.xml.xpath.XPathVariableResolver#resolveVariable(javax.xml.namespace.QName)
     */
    public Object resolveVariable(QName variableName) {
        return vars.get(variableName);
    }
}
```

Code using it to perform XPath query.

``` java
/*Create a XML document builder factory*/
DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();

/*Disable External Entity resolution for different cases*/
//Do not performed here in order to focus on variable resolver code
//but do it for production code !

/*Load XML file*/
DocumentBuilder builder = dbf.newDocumentBuilder();
Document doc = builder.parse(new File("src/test/resources/SampleXPath.xml"));

/* Create and configure parameter resolver */
String bid = "bk102";
SimpleVariableResolver variableResolver = new SimpleVariableResolver();
variableResolver.addVariable(new QName("bookId"), bid);

/*Create and configure XPATH expression*/
XPath xpath = XPathFactory.newInstance().newXPath();
xpath.setXPathVariableResolver(variableResolver);
XPathExpression xPathExpression = xpath.compile("//book[@id=$bookId]");

/* Apply expression on XML document */
Object nodes = xPathExpression.evaluate(doc, XPathConstants.NODESET);
NodeList nodesList = (NodeList) nodes;
Element book = (Element)nodesList.item(0);
var containsRalls = book.getTextContent().contains("Ralls, Kim");
```

### HTML/JavaScript/CSS

#### Symptom

Injection of this type occur when the application uses untrusted user input to build an HTTP response and sent it to browser.

#### How to prevent

Either apply strict input validation (allowlist approach) or use output sanitizing+escaping if input validation is not possible (combine both every time is possible).

#### Example

``` java
/*
INPUT WAY: Receive data from user
Here it's recommended to use strict input validation using allowlist approach.
In fact, you ensure that only allowed characters are part of the input received.
*/

String userInput = "You user login is owasp-user01";

/* First we check that the value contains only expected character*/
if (!Pattern.matches("[a-zA-Z0-9\\s\\-]{1,50}", userInput))
{
    return false;
}

/* If the first check pass then ensure that potential dangerous character
that we have allowed for business requirement are not used in a dangerous way.
For example here we have allowed the character '-', and, this can
be used in SQL injection so, we
ensure that this character is not used is a continuous form.
Use the API COMMONS LANG v3 to help in String analysis...
*/
If (0 != StringUtils.countMatches(userInput.replace(" ", ""), "--"))
{
    return false;
}

/*
OUTPUT WAY: Send data to user
Here we escape + sanitize any data sent to user
Use the OWASP Java HTML Sanitizer API to handle sanitizing
Use the OWASP Java Encoder API to handle HTML tag encoding (escaping)
*/

String outputToUser = "You <p>user login</p> is <strong>owasp-user01</strong>";
outputToUser += "<script>alert(22);</script><img src='#' onload='javascript:alert(23);'>";

/* Create a sanitizing policy that only allow tag '<p>' and '<strong>'*/
PolicyFactory policy = new HtmlPolicyBuilder().allowElements("p", "strong").toFactory();

/* Sanitize the output that will be sent to user*/
String safeOutput = policy.sanitize(outputToUser);

/* Encode HTML Tag*/
safeOutput = Encode.forHtml(safeOutput);
String finalSafeOutputExpected = "You <p>user login</p> is <strong>owasp-user01</strong>";
if (!finalSafeOutputExpected.equals(safeOutput))
{
    return false;
}
```

### LDAP

A dedicated [cheatsheet](https://cheatsheetseries.owasp.org/cheatsheets/LDAP_Injection_Prevention_Cheat_Sheet.html) has been created.

### NoSQL

#### Symptom

Injection of this type occur when the application uses untrusted user input to build a NoSQL API call expression.

#### How to prevent

As there many NoSQL database system and each one use an API for call, it's important to ensure that user input received and used to build the API call expression does not contain any character that have a special meaning in the target API syntax. This in order to avoid that it will be used to escape the initial call expression in order to create another one based on crafted user input. It's also important to not use string concatenation to build API call expression but use the API to create the expression.

#### Example - MongoDB

``` java
 /* Here use MongoDB as target NoSQL DB */
String userInput = "Brooklyn";

/* First ensure that the input do no contains any special characters
for the current NoSQL DB call API,
here they are: ' " \ ; { } $
*/
//Avoid regexp this time in order to made validation code
//more easy to read and understand...
ArrayList < String > specialCharsList = new ArrayList < String > () {
    {
        add("'");
        add("\"");
        add("\\");
        add(";");
        add("{");
        add("}");
        add("$");
    }
};

for (String specChar: specialCharsList) {
    if (userInput.contains(specChar)) {
        return false;
    }
}

//Add also a check on input max size
if (!userInput.length() <= 50)
{
    return false;
}

/* Then perform query on database using API to build expression */
//Connect to the local MongoDB instance
try(MongoClient mongoClient = new MongoClient()){
    MongoDatabase db = mongoClient.getDatabase("test");
    //Use API query builder to create call expression
    //Create expression
    Bson expression = eq("borough", userInput);
    //Perform call
    FindIterable<org.bson.Document> restaurants = db.getCollection("restaurants").find(expression);
    //Verify result consistency
    restaurants.forEach(new Block<org.bson.Document>() {
        @Override
        public void apply(final org.bson.Document doc) {
            String restBorough = (String)doc.get("borough");
            if (!"Brooklyn".equals(restBorough))
            {
                return false;
            }
        }
    });
}
```

### Log Injection

#### Symptom

[Log Injection](https://owasp.org/www-community/attacks/Log_Injection) occurs when an application includes untrusted data in an application log message (e.g., an attacker can cause an additional log entry that looks like it came from a completely different user, if they can inject CRLF characters in the untrusted data). More information about this attack is available on the OWASP [Log Injection](https://owasp.org/www-community/attacks/Log_Injection) page.

#### How to prevent

To prevent an attacker from writing malicious content into the application log, apply defenses such as:

- Use structured log formats, such as JSON, instead of unstructured text formats.
  Unstructured formats are susceptible to **C**arriage **R**eturn (CR) and **L**ine **F**eed (LF) injection (see [CWE-93](https://cwe.mitre.org/data/definitions/93.html)).
- Limit the size of the user input value used to create the log message.
- Make sure [all XSS defenses](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html) are applied when viewing log files in a web browser.

#### Example using Log4j Core 2

The recommended logging policy for a production environment is sending logs to a network socket using the structured
[JSON Template Layout](https://logging.apache.org/log4j/2.x/manual/json-template-layout.html)
introduced in
[Log4j 2.14.0](https://logging.apache.org/log4j/2.x/release-notes.html#release-notes-2-14-0)
and limit the size of strings to 500 bytes using the
[`maxStringLength` configuration attribute](https://logging.apache.org/log4j/2.x/manual/json-template-layout.html#plugin-attr-maxStringLength):

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Configuration xmlns="https://logging.apache.org/xml/ns"
               xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
               xsi:schemaLocation="
                   https://logging.apache.org/xml/ns
                   https://logging.apache.org/xml/ns/log4j-config-2.xsd">
  <Appenders>
    <Socket name="SOCKET"
            host="localhost"
            port="12345">
      <!-- Limit the size of any string field in the produced JSON document to 500 bytes -->
      <JsonTemplateLayout maxStringLength="500"
                          nullEventDelimiterEnabled="true"/>
    </Socket>
  </Appenders>
  <Loggers>
    <Root level="DEBUG">
      <AppenderRef ref="SOCKET"/>
    </Root>
  </Loggers>
</Configuration>
```

See
[Integration with service-oriented architectures](https://logging.apache.org/log4j/2.x/soa.html)
on
[Log4j website](https://logging.apache.org/log4j/2.x/index.html)
for more tips.

Usage of the logger at code level:

``` java
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
...
// Most common way to declare a logger
private static final LOGGER = LogManager.getLogger();
// GOOD!
//
// Use parameterized logging to add user data to a message
// The pattern should be a compile-time constant
logger.warn("Login failed for user {}.", username);
// BAD!
//
// Don't mix string concatenation and parameters
// If `username` contains `{}`, the exception will leak into the message
logger.warn("Failure for user " + username + " and role {}.", role, ex);
...
```

See
[Log4j API Best Practices](https://logging.apache.org/log4j/2.x/manual/api.html#best-practice)
for more information.

#### Example using Logback

The recommended logging policy for a production environment is using the structured
[JsonEncoder](https://logback.qos.ch/manual/encoders.html#JsonEncoder)
introduced in
[Logback 1.3.8](https://logback.qos.ch/news.html#1.3.8).
In the example below, Logback is configured to roll on 10 log files of 5 MiB each:

``` xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration>
<configuration>
  <import class="ch.qos.logback.classic.encoder.JsonEncoder"/>
  <import class="ch.qos.logback.core.rolling.FixedWindowRollingPolicy"/>
  <import class="ch.qos.logback.core.rolling.RollingFileAppender"/>
  <import class="ch.qos.logback.core.rolling.SizeBasedTriggeringPolicy"/>

  <appender name="RollingFile" class="RollingFileAppender">
    <file>app.log</file>
    <rollingPolicy class="FixedWindowRollingPolicy">
      <fileNamePattern>app-%i.log</fileNamePattern>
      <minIndex>1</minIndex>
      <maxIndex>10</maxIndex>
    </rollingPolicy>
    <triggeringPolicy class="SizeBasedTriggeringPolicy">
      <maxFileSize>5MB</maxFileSize>
    </triggeringPolicy>
    <encoder class="JsonEncoder"/>
  </appender>

  <root level="DEBUG">
    <appender-ref ref="SOCKET"/>
  </root>
</configuration>
```

Usage of the logger at code level:

``` java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
...
// Most common way to declare a logger
Logger logger = LoggerFactory.getLogger(MyClass.class);
// GOOD!
//
// Use parameterized logging to add user data to a message
// The pattern should be a compile-time constant
logger.warn("Login failed for user {}.", username);
// BAD!
//
// Don't mix string concatenation and parameters
// If `username` contains `{}`, the exception will leak into the message
logger.warn("Failure for user " + username + " and role {}.", role, ex);
...
```

## Cryptography

### General cryptography guidance

- **Never, ever write your own cryptographic functions.**
- Wherever possible, try and avoid writing any cryptographic code at all. Instead try and either use pre-existing secret management solutions or the secret management solution provided by your cloud provider. For more information, see the [OWASP Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html).
- If you cannot use a pre-existing secret management solution, try and use a trusted and well known implementation library rather than using the libraries built into JCA/JCE as it is far too easy to make cryptographic errors with them.
- Make sure your application or protocol can easily support a future change of cryptographic algorithms.
- Use your package manager wherever possible to keep all of your packages up to date. Watch the updates on your development setup, and plan updates to your applications accordingly.
- We will show examples below based on Google Tink, which is a library created by cryptography experts for using cryptography safely (in the sense of minimizing common mistakes made when using standard cryptography libraries).

### Encryption for storage

Follow the algorithm guidance in the [OWASP Cryptographic Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html#algorithms).

#### Symmetric example using Google Tink

Google Tink has documentation on performing common tasks.

For example, this page (from Google's website) shows [how to perform simple symmetric encryption](https://developers.google.com/tink/encrypt-data).

The following code snippet shows an encapsulated use of this functionality:

&lt;details&gt;
  &lt;summary&gt;Click here to view the "Tink symmetric encryption" code snippet.&lt;/summary&gt;

``` java
import static java.nio.charset.StandardCharsets.UTF_8;

import com.google.crypto.tink.Aead;
import com.google.crypto.tink.InsecureSecretKeyAccess;
import com.google.crypto.tink.KeysetHandle;
import com.google.crypto.tink.TinkJsonProtoKeysetFormat;
import com.google.crypto.tink.aead.AeadConfig;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;

// AesGcmSimpleTest
public class App {

    // Based on example from:
    // https://github.com/tink-crypto/tink-java/tree/main/examples/aead

    public static void main(String[] args) throws Exception {

        // Key securely generated using:
        // tinkey create-keyset --key-template AES128_GCM --out-format JSON --out aead_test_keyset.json

        // Register all AEAD key types with the Tink runtime.
        AeadConfig.register();

        // Read the keyset into a KeysetHandle.
        KeysetHandle handle =
        TinkJsonProtoKeysetFormat.parseKeyset(
            new String(Files.readAllBytes( Paths.get("/home/fredbloggs/aead_test_keyset.json")), UTF_8), InsecureSecretKeyAccess.get());

        String message = "This message to be encrypted";
        System.out.println(message);

        // Add some relevant context about the encrypted data that should be verified
        // on decryption
        String metadata = "Sender: fredbloggs@example.com";

        // Encrypt the message
        byte[] cipherText = AesGcmSimple.encrypt(message, metadata, handle);
        System.out.println(Base64.getEncoder().encodeToString(cipherText));

        // Decrypt the message
        String message2 = AesGcmSimple.decrypt(cipherText, metadata, handle);
        System.out.println(message2);
    }
}

class AesGcmSimple {

    public static byte[] encrypt(String plaintext, String metadata, KeysetHandle handle) throws Exception {
        // Get the primitive.
        Aead aead = handle.getPrimitive(Aead.class);
        return aead.encrypt(plaintext.getBytes(UTF_8), metadata.getBytes(UTF_8));
    }

    public static String decrypt(byte[] ciphertext, String metadata, KeysetHandle handle) throws Exception {
        // Get the primitive.
        Aead aead = handle.getPrimitive(Aead.class);
        return new String(aead.decrypt(ciphertext, metadata.getBytes(UTF_8)),UTF_8);
    }

}

```

&lt;/details&gt;

#### Symmetric example using built-in JCA/JCE classes

If you absolutely cannot use a separate library, it is still possible to use the built JCA/JCE classes but it is strongly recommended to have a cryptography expert review the full design and code, as even the most trivial error can severely weaken your encryption.

The following code snippet shows an example of using AES-GCM to perform encryption/decryption of data.

A few constraints/pitfalls with this code:

- It does not take into account key rotation or management which is a whole topic in itself.
- It is important to use a different nonce for every encryption operation, especially if the same key is used. For more information, see [this answer on Cryptography Stack Exchange](https://crypto.stackexchange.com/a/66500).
- The key will need to be stored securely.

&lt;details&gt;
  &lt;summary&gt;Click here to view the "JCA/JCE symmetric encryption" code snippet.&lt;/summary&gt;

```java
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import javax.crypto.spec.*;
import javax.crypto.*;
import java.util.Base64;

// AesGcmSimpleTest
class Main {

    public static void main(String[] args) throws Exception {
        // Key of 32 bytes / 256 bits for AES
        KeyGenerator keyGen = KeyGenerator.getInstance(AesGcmSimple.ALGORITHM);
        keyGen.init(AesGcmSimple.KEY_SIZE, new SecureRandom());
        SecretKey secretKey = keyGen.generateKey();

        // Nonce of 12 bytes / 96 bits and this size should always be used.
        // It is critical for AES-GCM that a unique nonce is used for every cryptographic operation.
        byte[] nonce = new byte[AesGcmSimple.IV_LENGTH];
        SecureRandom random = new SecureRandom();
        random.nextBytes(nonce);

        var message = "This message to be encrypted";
        System.out.println(message);

        // Encrypt the message
        byte[] cipherText = AesGcmSimple.encrypt(message, nonce, secretKey);
        System.out.println(Base64.getEncoder().encodeToString(cipherText));

        // Decrypt the message
        var message2 = AesGcmSimple.decrypt(cipherText, nonce, secretKey);
        System.out.println(message2);
    }
}

class AesGcmSimple {

    public static final String ALGORITHM = "AES";
    public static final String CIPHER_ALGORITHM = "AES/GCM/NoPadding";
    public static final int KEY_SIZE = 256;
    public static final int TAG_LENGTH = 128;
    public static final int IV_LENGTH = 12;

    public static byte[] encrypt(String plaintext, byte[] nonce, SecretKey secretKey) throws Exception {
        return cryptoOperation(plaintext.getBytes(StandardCharsets.UTF_8), nonce, secretKey, Cipher.ENCRYPT_MODE);
    }

    public static String decrypt(byte[] ciphertext, byte[] nonce, SecretKey secretKey) throws Exception {
        return new String(cryptoOperation(ciphertext, nonce, secretKey, Cipher.DECRYPT_MODE), StandardCharsets.UTF_8);
    }

    private static byte[] cryptoOperation(byte[] text, byte[] nonce, SecretKey secretKey, int mode) throws Exception {
        Cipher cipher = Cipher.getInstance(CIPHER_ALGORITHM);
        GCMParameterSpec gcmParameterSpec = new GCMParameterSpec(TAG_LENGTH, nonce);
        cipher.init(mode, secretKey, gcmParameterSpec);
        return cipher.doFinal(text);
    }

}
```

&lt;/details&gt;

### Encryption for transmission

Again, follow the algorithm guidance in the [OWASP Cryptographic Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html#algorithms).

#### Asymmetric example using Google Tink

Google Tink has documentation on performing common tasks.

For example, this page (from Google's website) shows [how to perform a hybrid encryption process](https://developers.google.com/tink/exchange-data) where two parties want to share data based on their asymmetric key pair.

The following code snippet shows how this functionality can be used to share secrets between Alice and Bob:

&lt;details&gt;
  &lt;summary&gt;Click here to view the "Tink hybrid encryption" code snippet.&lt;/summary&gt;

``` java
import static java.nio.charset.StandardCharsets.UTF_8;

import com.google.crypto.tink.HybridDecrypt;
import com.google.crypto.tink.HybridEncrypt;
import com.google.crypto.tink.InsecureSecretKeyAccess;
import com.google.crypto.tink.KeysetHandle;
import com.google.crypto.tink.TinkJsonProtoKeysetFormat;
import com.google.crypto.tink.hybrid.HybridConfig;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;

// HybridReplaceTest
class App {
    public static void main(String[] args) throws Exception {
        /*

        Generated public/private keypairs for Bob and Alice using the
        following tinkey commands:

        ./tinkey create-keyset \
        --key-template DHKEM_X25519_HKDF_SHA256_HKDF_SHA256_AES_256_GCM \
        --out-format JSON --out alice_private_keyset.json

        ./tinkey create-keyset \
        --key-template DHKEM_X25519_HKDF_SHA256_HKDF_SHA256_AES_256_GCM \
        --out-format JSON --out bob_private_keyset.json

        ./tinkey create-public-keyset --in alice_private_keyset.json \
        --in-format JSON --out-format JSON --out alice_public_keyset.json

        ./tinkey create-public-keyset --in bob_private_keyset.json \
        --in-format JSON --out-format JSON --out bob_public_keyset.json
        */

        HybridConfig.register();

        // Generate ECC key pair for Alice
        var alice = new HybridSimple(
                getKeysetHandle("/home/alicesmith/private_keyset.json"),
                getKeysetHandle("/home/alicesmith/public_keyset.json")

        );

        KeysetHandle alicePublicKey = alice.getPublicKey();

        // Generate ECC key pair for Bob
        var bob = new HybridSimple(
                getKeysetHandle("/home/bobjones/private_keyset.json"),
                getKeysetHandle("/home/bobjones/public_keyset.json")

        );

        KeysetHandle bobPublicKey = bob.getPublicKey();

        // This keypair generation should be reperformed every so often in order to
        // obtain a new shared secret to avoid a long lived shared secret.

        // Alice encrypts a message to send to Bob
        String plaintext = "Hello, Bob!";

        // Add some relevant context about the encrypted data that should be verified
        // on decryption
        String metadata = "Sender: alicesmith@example.com";

        System.out.println("Secret being sent from Alice to Bob: " + plaintext);
        var cipherText = alice.encrypt(bobPublicKey, plaintext, metadata);
        System.out.println("Ciphertext being sent from Alice to Bob: " + Base64.getEncoder().encodeToString(cipherText));

        // Bob decrypts the message
        var decrypted = bob.decrypt(cipherText, metadata);
        System.out.println("Secret received by Bob from Alice: " + decrypted);
        System.out.println();

        // Bob encrypts a message to send to Alice
        String plaintext2 = "Hello, Alice!";

        // Add some relevant context about the encrypted data that should be verified
        // on decryption
        String metadata2 = "Sender: bobjones@example.com";

        System.out.println("Secret being sent from Bob to Alice: " + plaintext2);
        var cipherText2 = bob.encrypt(alicePublicKey, plaintext2, metadata2);
        System.out.println("Ciphertext being sent from Bob to Alice: " + Base64.getEncoder().encodeToString(cipherText2));

        // Bob decrypts the message
        var decrypted2 = alice.decrypt(cipherText2, metadata2);
        System.out.println("Secret received by Alice from Bob: " + decrypted2);
    }

    private static KeysetHandle getKeysetHandle(String filename) throws Exception
    {
        return TinkJsonProtoKeysetFormat.parseKeyset(
                new String(Files.readAllBytes( Paths.get(filename)), UTF_8), InsecureSecretKeyAccess.get());
    }
}
class HybridSimple {

    private KeysetHandle privateKey;
    private KeysetHandle publicKey;

    public HybridSimple(KeysetHandle privateKeyIn, KeysetHandle publicKeyIn) throws Exception {
        privateKey = privateKeyIn;
        publicKey = publicKeyIn;
    }

    public KeysetHandle getPublicKey() {
        return publicKey;
    }

    public byte[] encrypt(KeysetHandle partnerPublicKey, String message, String metadata) throws Exception {

        HybridEncrypt encryptor = partnerPublicKey.getPrimitive(HybridEncrypt.class);

        // return the encrypted value
        return encryptor.encrypt(message.getBytes(UTF_8), metadata.getBytes(UTF_8));
    }
    public String decrypt(byte[] ciphertext, String metadata) throws Exception {

        HybridDecrypt decryptor = privateKey.getPrimitive(HybridDecrypt.class);

        // return the encrypted value
        return new String(decryptor.decrypt(ciphertext, metadata.getBytes(UTF_8)),UTF_8);
    }

}
```

&lt;/details&gt;

#### Asymmetric example using built-in JCA/JCE classes

If you absolutely cannot use a separate library, it is still possible to use the built JCA/JCE classes but it is strongly recommended to have a cryptography expert review the full design and code, as even the most trivial error can severely weaken your encryption.

The following code snippet shows an example of using Elliptic Curve/Diffie Helman (ECDH) together with AES-GCM to perform encryption/decryption of data between two different sides without the need the transfer the symmetric key between the two sides. Instead, the sides exchange public keys and can then use ECDH to generate a shared secret which can be used for the symmetric encryption.

Note that this code sample relies on the AesGcmSimple class from the [previous section](#symmetric-example-using-built-in-jcajce-classes).

A few constraints/pitfalls with this code:

- It does not take into account key rotation or management which is a whole topic in itself.
- The code deliberately enforces a new nonce for every encryption operation but this must be managed as a separate data item alongside the ciphertext.
- The private keys will need to be stored securely.
- The code does not consider the validation of public keys before use.
- Overall, there is no verification of authenticity between the two sides.

&lt;details&gt;
  &lt;summary&gt;Click here to view the "JCA/JCE hybrid encryption" code snippet.&lt;/summary&gt;

```java
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import javax.crypto.spec.*;
import javax.crypto.*;
import java.util.*;
import java.security.*;
import java.security.spec.*;
import java.util.Arrays;

// ECDHSimpleTest
class Main {
    public static void main(String[] args) throws Exception {

        // Generate ECC key pair for Alice
        var alice = new ECDHSimple();
        Key alicePublicKey = alice.getPublicKey();

        // Generate ECC key pair for Bob
        var bob = new ECDHSimple();
        Key bobPublicKey = bob.getPublicKey();

        // This keypair generation should be reperformed every so often in order to
        // obtain a new shared secret to avoid a long lived shared secret.

        // Alice encrypts a message to send to Bob
        String plaintext = "Hello"; //, Bob!";
        System.out.println("Secret being sent from Alice to Bob: " + plaintext);

        var retPair = alice.encrypt(bobPublicKey, plaintext);
        var nonce = retPair.getKey();
        var cipherText = retPair.getValue();

        System.out.println("Both cipherText and nonce being sent from Alice to Bob: " + Base64.getEncoder().encodeToString(cipherText) + " " + Base64.getEncoder().encodeToString(nonce));

        // Bob decrypts the message
        var decrypted = bob.decrypt(alicePublicKey, cipherText, nonce);
        System.out.println("Secret received by Bob from Alice: " + decrypted);
        System.out.println();

        // Bob encrypts a message to send to Alice
        String plaintext2 = "Hello"; //, Alice!";
        System.out.println("Secret being sent from Bob to Alice: " + plaintext2);

        var retPair2 = bob.encrypt(alicePublicKey, plaintext2);
        var nonce2 = retPair2.getKey();
        var cipherText2 = retPair2.getValue();
        System.out.println("Both cipherText2 and nonce2 being sent from Bob to Alice: " + Base64.getEncoder().encodeToString(cipherText2) + " " + Base64.getEncoder().encodeToString(nonce2));

        // Bob decrypts the message
        var decrypted2 = alice.decrypt(bobPublicKey, cipherText2, nonce2);
        System.out.println("Secret received by Alice from Bob: " + decrypted2);
    }
}
class ECDHSimple {
    private KeyPair keyPair;

    public class AesKeyNonce {
        public SecretKey Key;
        public byte[] Nonce;
    }

    public ECDHSimple() throws Exception {
        KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance("EC");
        ECGenParameterSpec ecSpec = new ECGenParameterSpec("secp256r1"); // Using secp256r1 curve
        keyPairGenerator.initialize(ecSpec);
        keyPair = keyPairGenerator.generateKeyPair();
    }

    public Key getPublicKey() {
        return keyPair.getPublic();
    }

    public AbstractMap.SimpleEntry<byte[], byte[]> encrypt(Key partnerPublicKey, String message) throws Exception {

        // Generate the AES Key and Nonce
        AesKeyNonce aesParams = generateAESParams(partnerPublicKey);

        // return the encrypted value
        return new AbstractMap.SimpleEntry<>(
            aesParams.Nonce,
            AesGcmSimple.encrypt(message, aesParams.Nonce, aesParams.Key)
            );
    }
    public String decrypt(Key partnerPublicKey, byte[] ciphertext, byte[] nonce) throws Exception {

        // Generate the AES Key and Nonce
        AesKeyNonce aesParams = generateAESParams(partnerPublicKey, nonce);

        // return the decrypted value
        return AesGcmSimple.decrypt(ciphertext, aesParams.Nonce, aesParams.Key);
    }

    private AesKeyNonce generateAESParams(Key partnerPublicKey, byte[] nonce) throws Exception {

        // Derive the secret based on this side's private key and the other side's public key
        KeyAgreement keyAgreement = KeyAgreement.getInstance("ECDH");
        keyAgreement.init(keyPair.getPrivate());
        keyAgreement.doPhase(partnerPublicKey, true);
        byte[] secret = keyAgreement.generateSecret();

        AesKeyNonce aesKeyNonce = new AesKeyNonce();

        // Copy first 32 bytes as the key
        byte[] key = Arrays.copyOfRange(secret, 0, (AesGcmSimple.KEY_SIZE / 8));
        aesKeyNonce.Key = new SecretKeySpec(key, 0, key.length, "AES");

        // Passed in nonce will be used.
        aesKeyNonce.Nonce = nonce;
        return aesKeyNonce;

    }

    private AesKeyNonce generateAESParams(Key partnerPublicKey) throws Exception {

        // Nonce of 12 bytes / 96 bits and this size should always be used.
        // It is critical for AES-GCM that a unique nonce is used for every cryptographic operation.
        // Therefore this is not generated from the shared secret
        byte[] nonce = new byte[AesGcmSimple.IV_LENGTH];
        SecureRandom random = new SecureRandom();
        random.nextBytes(nonce);
        return generateAESParams(partnerPublicKey, nonce);

    }
}
```

&lt;/details&gt;

</section>

<section id="java-security-translation-panel" className="tabPanel translationPanel contentPanel">

## Java におけるインジェクション防止

このセクションでは、Java アプリケーションコードで *インジェクション (Injection)* を扱うためのヒントを提供します。

ヒントで使用しているサンプルコードは [こちら](https://github.com/righettod/injection-cheat-sheets) にあります。

### インジェクションとは

OWASP Top 10 における [インジェクション](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A1-Injection) は、次のように定義されています。

*外部ユーザー、内部ユーザー、管理者を含め、信頼できないデータをシステムに送信できるすべての人を考慮します。*

### インジェクションを防止するための一般的な助言

*インジェクション* の問題を防止するために、一般的には次の点を適用できます。

1. ユーザーの入力/出力に対して、**入力検証** (許可リスト方式を使用) と **出力のサニタイズ + エスケープ** を組み合わせて適用します。
2. システムとやり取りする必要がある場合は、コマンドを組み立てるのではなく、使用している技術スタック (Java / .Net / PHP など) が提供する API 機能を使用するようにします。

追加の助言は、この [チートシート](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html) で提供されています。

## 特定のインジェクション種別

*このセクションの例は Java 技術で示します (関連する Maven プロジェクトを参照) が、助言は .Net / PHP / Ruby / Python など他の技術にも適用できます。*

### SQL

#### 症状

この種のインジェクションは、アプリケーションが信頼できないユーザー入力を使用して String で SQL クエリを組み立て、それを実行する場合に発生します。

#### 防止方法

インジェクションを防止するために、*クエリのパラメータ化 (Query Parameterization)* を使用します。

#### 例

``` java
/*No DB framework used here in order to show the real use of
  Prepared Statement from Java API*/
/*Open connection with H2 database and use it*/
Class.forName("org.h2.Driver");
String jdbcUrl = "jdbc:h2:file:" + new File(".").getAbsolutePath() + "/target/db";
try (Connection con = DriverManager.getConnection(jdbcUrl)) {

    /* Sample A: Select data using Prepared Statement*/
    String query = "select * from color where friendly_name = ?";
    List<String> colors = new ArrayList<>();
    try (PreparedStatement pStatement = con.prepareStatement(query)) {
        pStatement.setString(1, "yellow");
        try (ResultSet rSet = pStatement.executeQuery()) {
            while (rSet.next()) {
                colors.add(rSet.getString(1));
            }
        }
    }

    /* Sample B: Insert data using Prepared Statement*/
    query = "insert into color(friendly_name, red, green, blue) values(?, ?, ?, ?)";
    int insertedRecordCount;
    try (PreparedStatement pStatement = con.prepareStatement(query)) {
        pStatement.setString(1, "orange");
        pStatement.setInt(2, 239);
        pStatement.setInt(3, 125);
        pStatement.setInt(4, 11);
        insertedRecordCount = pStatement.executeUpdate();
    }

   /* Sample C: Update data using Prepared Statement*/
    query = "update color set blue = ? where friendly_name = ?";
    int updatedRecordCount;
    try (PreparedStatement pStatement = con.prepareStatement(query)) {
        pStatement.setInt(1, 10);
        pStatement.setString(2, "orange");
        updatedRecordCount = pStatement.executeUpdate();
    }

   /* Sample D: Delete data using Prepared Statement*/
    query = "delete from color where friendly_name = ?";
    int deletedRecordCount;
    try (PreparedStatement pStatement = con.prepareStatement(query)) {
        pStatement.setString(1, "orange");
        deletedRecordCount = pStatement.executeUpdate();
    }

}
```

### JPA

#### 症状

この種のインジェクションは、アプリケーションが信頼できないユーザー入力を使用して String で JPA クエリを組み立て、それを実行する場合に発生します。SQL インジェクションとかなり似ていますが、ここで改変される言語は SQL ではなく JPA QL です。

#### 防止方法

インジェクションを防止するために、Java Persistence Query Language の **クエリのパラメータ化** を使用します。

#### 例

``` java
EntityManager entityManager = null;
try {
    /* Get a ref on EntityManager to access DB */
    entityManager = Persistence.createEntityManagerFactory("testJPA").createEntityManager();

    /* Define parameterized query prototype using named parameter to enhance readability */
    String queryPrototype = "select c from Color c where c.friendlyName = :colorName";

    /* Create the query, set the named parameter and execute the query */
    Query queryObject = entityManager.createQuery(queryPrototype);
    Color c = (Color) queryObject.setParameter("colorName", "yellow").getSingleResult();

} finally {
    if (entityManager != null && entityManager.isOpen()) {
        entityManager.close();
    }
}
```

### オペレーティングシステム

#### 症状

この種のインジェクションは、アプリケーションが信頼できないユーザー入力を使用して String でオペレーティングシステムコマンドを組み立て、それを実行する場合に発生します。

#### 防止方法

インジェクションを防止するために、技術スタックの **API** を使用します。

#### 例

``` java
/* The context taken is, for example, to perform a PING against a computer.
* The prevention is to use the feature provided by the Java API instead of building
* a system command as String and execute it */
InetAddress host = InetAddress.getByName("localhost");
var reachable = host.isReachable(5000);
```

### XML: XPath インジェクション

#### 症状

この種のインジェクションは、アプリケーションが信頼できないユーザー入力を使用して String で XPath クエリを組み立て、それを実行する場合に発生します。

#### 防止方法

インジェクションを防止するために、**XPath Variable Resolver** を使用します。

#### 例

**Variable Resolver** の実装です。

``` java
/**
 * Resolver in order to define parameter for XPATH expression.
 *
 */
public class SimpleVariableResolver implements XPathVariableResolver {

    private final Map<QName, Object> vars = new HashMap<QName, Object>();

    /**
     * External methods to add parameter
     *
     * @param name Parameter name
     * @param value Parameter value
     */
    public void addVariable(QName name, Object value) {
        vars.put(name, value);
    }

    /**
     * {@inheritDoc}
     *
     * @see javax.xml.xpath.XPathVariableResolver#resolveVariable(javax.xml.namespace.QName)
     */
    public Object resolveVariable(QName variableName) {
        return vars.get(variableName);
    }
}
```

これを使用して XPath クエリを実行するコードです。

``` java
/*Create a XML document builder factory*/
DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();

/*Disable External Entity resolution for different cases*/
//Do not performed here in order to focus on variable resolver code
//but do it for production code !

/*Load XML file*/
DocumentBuilder builder = dbf.newDocumentBuilder();
Document doc = builder.parse(new File("src/test/resources/SampleXPath.xml"));

/* Create and configure parameter resolver */
String bid = "bk102";
SimpleVariableResolver variableResolver = new SimpleVariableResolver();
variableResolver.addVariable(new QName("bookId"), bid);

/*Create and configure XPATH expression*/
XPath xpath = XPathFactory.newInstance().newXPath();
xpath.setXPathVariableResolver(variableResolver);
XPathExpression xPathExpression = xpath.compile("//book[@id=$bookId]");

/* Apply expression on XML document */
Object nodes = xPathExpression.evaluate(doc, XPathConstants.NODESET);
NodeList nodesList = (NodeList) nodes;
Element book = (Element)nodesList.item(0);
var containsRalls = book.getTextContent().contains("Ralls, Kim");
```

### HTML/JavaScript/CSS

#### 症状

この種のインジェクションは、アプリケーションが信頼できないユーザー入力を使用して HTTP レスポンスを組み立て、ブラウザに送信する場合に発生します。

#### 防止方法

厳格な入力検証 (許可リスト方式) を適用するか、入力検証ができない場合は出力のサニタイズ + エスケープを使用します (可能な場合は常に両方を組み合わせます)。

#### 例

``` java
/*
INPUT WAY: Receive data from user
Here it's recommended to use strict input validation using allowlist approach.
In fact, you ensure that only allowed characters are part of the input received.
*/

String userInput = "You user login is owasp-user01";

/* First we check that the value contains only expected character*/
if (!Pattern.matches("[a-zA-Z0-9\\s\\-]{1,50}", userInput))
{
    return false;
}

/* If the first check pass then ensure that potential dangerous character
that we have allowed for business requirement are not used in a dangerous way.
For example here we have allowed the character '-', and, this can
be used in SQL injection so, we
ensure that this character is not used is a continuous form.
Use the API COMMONS LANG v3 to help in String analysis...
*/
If (0 != StringUtils.countMatches(userInput.replace(" ", ""), "--"))
{
    return false;
}

/*
OUTPUT WAY: Send data to user
Here we escape + sanitize any data sent to user
Use the OWASP Java HTML Sanitizer API to handle sanitizing
Use the OWASP Java Encoder API to handle HTML tag encoding (escaping)
*/

String outputToUser = "You <p>user login</p> is <strong>owasp-user01</strong>";
outputToUser += "<script>alert(22);</script><img src='#' onload='javascript:alert(23);'>";

/* Create a sanitizing policy that only allow tag '<p>' and '<strong>'*/
PolicyFactory policy = new HtmlPolicyBuilder().allowElements("p", "strong").toFactory();

/* Sanitize the output that will be sent to user*/
String safeOutput = policy.sanitize(outputToUser);

/* Encode HTML Tag*/
safeOutput = Encode.forHtml(safeOutput);
String finalSafeOutputExpected = "You <p>user login</p> is <strong>owasp-user01</strong>";
if (!finalSafeOutputExpected.equals(safeOutput))
{
    return false;
}
```

### LDAP

専用の [チートシート](https://cheatsheetseries.owasp.org/cheatsheets/LDAP_Injection_Prevention_Cheat_Sheet.html) が作成されています。

### NoSQL

#### 症状

この種のインジェクションは、アプリケーションが信頼できないユーザー入力を使用して NoSQL API 呼び出し式を組み立てる場合に発生します。

#### 防止方法

NoSQL データベースシステムは数多くあり、それぞれが呼び出しに API を使用するため、API 呼び出し式を組み立てるために受け取り使用するユーザー入力に、対象 API 構文で特別な意味を持つ文字が含まれていないことを確認することが重要です。これは、細工されたユーザー入力に基づいて別の式を作成するために、初期の呼び出し式から抜け出す用途で使われることを避けるためです。また、API 呼び出し式を組み立てるために文字列連結を使わず、API を使用して式を作成することも重要です。

#### 例 - MongoDB

``` java
 /* Here use MongoDB as target NoSQL DB */
String userInput = "Brooklyn";

/* First ensure that the input do no contains any special characters
for the current NoSQL DB call API,
here they are: ' " \ ; { } $
*/
//Avoid regexp this time in order to made validation code
//more easy to read and understand...
ArrayList < String > specialCharsList = new ArrayList < String > () {
    {
        add("'");
        add("\"");
        add("\\");
        add(";");
        add("{");
        add("}");
        add("$");
    }
};

for (String specChar: specialCharsList) {
    if (userInput.contains(specChar)) {
        return false;
    }
}

//Add also a check on input max size
if (!userInput.length() <= 50)
{
    return false;
}

/* Then perform query on database using API to build expression */
//Connect to the local MongoDB instance
try(MongoClient mongoClient = new MongoClient()){
    MongoDatabase db = mongoClient.getDatabase("test");
    //Use API query builder to create call expression
    //Create expression
    Bson expression = eq("borough", userInput);
    //Perform call
    FindIterable<org.bson.Document> restaurants = db.getCollection("restaurants").find(expression);
    //Verify result consistency
    restaurants.forEach(new Block<org.bson.Document>() {
        @Override
        public void apply(final org.bson.Document doc) {
            String restBorough = (String)doc.get("borough");
            if (!"Brooklyn".equals(restBorough))
            {
                return false;
            }
        }
    });
}
```

### ログインジェクション

#### 症状

[ログインジェクション](https://owasp.org/www-community/attacks/Log_Injection) は、アプリケーションが信頼できないデータをアプリケーションログメッセージに含める場合に発生します (たとえば、攻撃者が信頼できないデータに CRLF 文字を注入できると、まったく別のユーザーから発生したように見える追加のログエントリを作成できます)。この攻撃の詳細は、OWASP の [Log Injection](https://owasp.org/www-community/attacks/Log_Injection) ページで確認できます。

#### 防止方法

攻撃者がアプリケーションログに悪意のある内容を書き込むことを防ぐには、次のような防御策を適用します。

- 非構造化テキスト形式ではなく、JSON などの構造化ログ形式を使用します。
  非構造化形式は、**C**arriage **R**eturn (CR) と **L**ine **F**eed (LF) のインジェクションを受けやすくなります ([CWE-93](https://cwe.mitre.org/data/definitions/93.html) を参照)。
- ログメッセージの作成に使用するユーザー入力値のサイズを制限します。
- Web ブラウザでログファイルを表示する場合は、[すべての XSS 防御策](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html) が適用されていることを確認します。

#### Log4j Core 2 を使用する例

本番環境で推奨されるロギングポリシーは、構造化された
[JSON Template Layout](https://logging.apache.org/log4j/2.x/manual/json-template-layout.html)
を使用してネットワークソケットにログを送信することです。これは
[Log4j 2.14.0](https://logging.apache.org/log4j/2.x/release-notes.html#release-notes-2-14-0)
で導入され、さらに
[`maxStringLength` 設定属性](https://logging.apache.org/log4j/2.x/manual/json-template-layout.html#plugin-attr-maxStringLength) を使用して文字列のサイズを 500 バイトに制限します。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Configuration xmlns="https://logging.apache.org/xml/ns"
               xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
               xsi:schemaLocation="
                   https://logging.apache.org/xml/ns
                   https://logging.apache.org/xml/ns/log4j-config-2.xsd">
  <Appenders>
    <Socket name="SOCKET"
            host="localhost"
            port="12345">
      <!-- Limit the size of any string field in the produced JSON document to 500 bytes -->
      <JsonTemplateLayout maxStringLength="500"
                          nullEventDelimiterEnabled="true"/>
    </Socket>
  </Appenders>
  <Loggers>
    <Root level="DEBUG">
      <AppenderRef ref="SOCKET"/>
    </Root>
  </Loggers>
</Configuration>
```

詳細なヒントについては、
[Integration with service-oriented architectures](https://logging.apache.org/log4j/2.x/soa.html)
を
[Log4j website](https://logging.apache.org/log4j/2.x/index.html)
で参照してください。

コードレベルでのロガーの使用方法です。

``` java
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
...
// Most common way to declare a logger
private static final LOGGER = LogManager.getLogger();
// GOOD!
//
// Use parameterized logging to add user data to a message
// The pattern should be a compile-time constant
logger.warn("Login failed for user {}.", username);
// BAD!
//
// Don't mix string concatenation and parameters
// If `username` contains `{}`, the exception will leak into the message
logger.warn("Failure for user " + username + " and role {}.", role, ex);
...
```

詳細なヒントについては、
[Log4j API Best Practices](https://logging.apache.org/log4j/2.x/manual/api.html#best-practice)
を参照してください。

#### Logback を使用する例

本番環境で推奨されるロギングポリシーは、構造化された
[JsonEncoder](https://logback.qos.ch/manual/encoders.html#JsonEncoder)
を使用してネットワークソケットにログを送信することです。これは
[Logback 1.3.8](https://logback.qos.ch/news.html#1.3.8) で導入されたものです。
以下の例では、Logback は 5 MiB ずつ 10 個のログファイルでローテーションするように設定されています。

``` xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration>
<configuration>
  <import class="ch.qos.logback.classic.encoder.JsonEncoder"/>
  <import class="ch.qos.logback.core.rolling.FixedWindowRollingPolicy"/>
  <import class="ch.qos.logback.core.rolling.RollingFileAppender"/>
  <import class="ch.qos.logback.core.rolling.SizeBasedTriggeringPolicy"/>

  <appender name="RollingFile" class="RollingFileAppender">
    <file>app.log</file>
    <rollingPolicy class="FixedWindowRollingPolicy">
      <fileNamePattern>app-%i.log</fileNamePattern>
      <minIndex>1</minIndex>
      <maxIndex>10</maxIndex>
    </rollingPolicy>
    <triggeringPolicy class="SizeBasedTriggeringPolicy">
      <maxFileSize>5MB</maxFileSize>
    </triggeringPolicy>
    <encoder class="JsonEncoder"/>
  </appender>

  <root level="DEBUG">
    <appender-ref ref="SOCKET"/>
  </root>
</configuration>
```

コードレベルでのロガーの使用方法です。

``` java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
...
// Most common way to declare a logger
Logger logger = LoggerFactory.getLogger(MyClass.class);
// GOOD!
//
// Use parameterized logging to add user data to a message
// The pattern should be a compile-time constant
logger.warn("Login failed for user {}.", username);
// BAD!
//
// Don't mix string concatenation and parameters
// If `username` contains `{}`, the exception will leak into the message
logger.warn("Failure for user " + username + " and role {}.", role, ex);
...
```

## 暗号

### 暗号に関する一般的なガイダンス

- **決して独自の暗号関数を書いてはいけません。**
- 可能な限り、暗号コードを一切書かないようにします。代わりに、既存のシークレット管理ソリューション、またはクラウドプロバイダが提供するシークレット管理ソリューションの使用を試みます。詳細については、[OWASP Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html) を参照してください。
- 既存のシークレット管理ソリューションを使用できない場合は、JCA/JCE に組み込まれたライブラリを使用するのではなく、信頼され広く知られた実装ライブラリを使用するようにします。JCA/JCE では暗号上の誤りを起こすことが非常に容易だからです。
- アプリケーションまたはプロトコルが、将来の暗号アルゴリズム変更を容易にサポートできるようにします。
- 可能な限りパッケージマネージャを使用して、すべてのパッケージを最新に保ちます。開発環境で更新を監視し、それに応じてアプリケーションの更新を計画します。
- 以下では Google Tink に基づく例を示します。Google Tink は、標準的な暗号ライブラリ使用時に起こりがちなミスを最小化するという意味で、安全に暗号を使用するために暗号専門家が作成したライブラリです。

### 保存のための暗号化

[OWASP Cryptographic Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html#algorithms) のアルゴリズムに関するガイダンスに従います。

#### Google Tink を使用した対称暗号の例

Google Tink には、一般的なタスクを実行するためのドキュメントがあります。

たとえば、Google の Web サイトにあるこのページでは、[単純な対称暗号化を実行する方法](https://developers.google.com/tink/encrypt-data) が示されています。

次のコードスニペットは、この機能をカプセル化して使用する方法を示しています。

<details>
  <summary>「Tink symmetric encryption」コードスニペットを表示するにはここをクリックしてください。</summary>

``` java
import static java.nio.charset.StandardCharsets.UTF_8;

import com.google.crypto.tink.Aead;
import com.google.crypto.tink.InsecureSecretKeyAccess;
import com.google.crypto.tink.KeysetHandle;
import com.google.crypto.tink.TinkJsonProtoKeysetFormat;
import com.google.crypto.tink.aead.AeadConfig;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;

// AesGcmSimpleTest
public class App {

    // Based on example from:
    // https://github.com/tink-crypto/tink-java/tree/main/examples/aead

    public static void main(String[] args) throws Exception {

        // Key securely generated using:
        // tinkey create-keyset --key-template AES128_GCM --out-format JSON --out aead_test_keyset.json

        // Register all AEAD key types with the Tink runtime.
        AeadConfig.register();

        // Read the keyset into a KeysetHandle.
        KeysetHandle handle =
        TinkJsonProtoKeysetFormat.parseKeyset(
            new String(Files.readAllBytes( Paths.get("/home/fredbloggs/aead_test_keyset.json")), UTF_8), InsecureSecretKeyAccess.get());

        String message = "This message to be encrypted";
        System.out.println(message);

        // Add some relevant context about the encrypted data that should be verified
        // on decryption
        String metadata = "Sender: fredbloggs@example.com";

        // Encrypt the message
        byte[] cipherText = AesGcmSimple.encrypt(message, metadata, handle);
        System.out.println(Base64.getEncoder().encodeToString(cipherText));

        // Decrypt the message
        String message2 = AesGcmSimple.decrypt(cipherText, metadata, handle);
        System.out.println(message2);
    }
}

class AesGcmSimple {

    public static byte[] encrypt(String plaintext, String metadata, KeysetHandle handle) throws Exception {
        // Get the primitive.
        Aead aead = handle.getPrimitive(Aead.class);
        return aead.encrypt(plaintext.getBytes(UTF_8), metadata.getBytes(UTF_8));
    }

    public static String decrypt(byte[] ciphertext, String metadata, KeysetHandle handle) throws Exception {
        // Get the primitive.
        Aead aead = handle.getPrimitive(Aead.class);
        return new String(aead.decrypt(ciphertext, metadata.getBytes(UTF_8)),UTF_8);
    }

}

```

</details>

#### 組み込み JCA/JCE クラスを使用した対称暗号の例

別のライブラリをどうしても使用できない場合は、組み込みの JCA/JCE クラスを使用することも可能です。ただし、ごく些細な誤りでも暗号を深刻に弱体化させる可能性があるため、設計とコード全体を暗号専門家にレビューしてもらうことを強く推奨します。

次のコードスニペットは、AES-GCM を使用してデータの暗号化/復号を実行する例を示しています。

このコードには、いくつかの制約/落とし穴があります。

- 鍵のローテーションや管理は、それ自体が大きなトピックですが、このコードでは考慮していません。
- 暗号化操作ごとに異なる nonce を使用することが重要です。同じ鍵を使用する場合は特に重要です。詳細については、[Cryptography Stack Exchange のこの回答](https://crypto.stackexchange.com/a/66500) を参照してください。
- 鍵は安全に保存する必要があります。

<details>
  <summary>「JCA/JCE symmetric encryption」コードスニペットを表示するにはここをクリックしてください。</summary>

```java
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import javax.crypto.spec.*;
import javax.crypto.*;
import java.util.Base64;

// AesGcmSimpleTest
class Main {

    public static void main(String[] args) throws Exception {
        // Key of 32 bytes / 256 bits for AES
        KeyGenerator keyGen = KeyGenerator.getInstance(AesGcmSimple.ALGORITHM);
        keyGen.init(AesGcmSimple.KEY_SIZE, new SecureRandom());
        SecretKey secretKey = keyGen.generateKey();

        // Nonce of 12 bytes / 96 bits and this size should always be used.
        // It is critical for AES-GCM that a unique nonce is used for every cryptographic operation.
        byte[] nonce = new byte[AesGcmSimple.IV_LENGTH];
        SecureRandom random = new SecureRandom();
        random.nextBytes(nonce);

        var message = "This message to be encrypted";
        System.out.println(message);

        // Encrypt the message
        byte[] cipherText = AesGcmSimple.encrypt(message, nonce, secretKey);
        System.out.println(Base64.getEncoder().encodeToString(cipherText));

        // Decrypt the message
        var message2 = AesGcmSimple.decrypt(cipherText, nonce, secretKey);
        System.out.println(message2);
    }
}

class AesGcmSimple {

    public static final String ALGORITHM = "AES";
    public static final String CIPHER_ALGORITHM = "AES/GCM/NoPadding";
    public static final int KEY_SIZE = 256;
    public static final int TAG_LENGTH = 128;
    public static final int IV_LENGTH = 12;

    public static byte[] encrypt(String plaintext, byte[] nonce, SecretKey secretKey) throws Exception {
        return cryptoOperation(plaintext.getBytes(StandardCharsets.UTF_8), nonce, secretKey, Cipher.ENCRYPT_MODE);
    }

    public static String decrypt(byte[] ciphertext, byte[] nonce, SecretKey secretKey) throws Exception {
        return new String(cryptoOperation(ciphertext, nonce, secretKey, Cipher.DECRYPT_MODE), StandardCharsets.UTF_8);
    }

    private static byte[] cryptoOperation(byte[] text, byte[] nonce, SecretKey secretKey, int mode) throws Exception {
        Cipher cipher = Cipher.getInstance(CIPHER_ALGORITHM);
        GCMParameterSpec gcmParameterSpec = new GCMParameterSpec(TAG_LENGTH, nonce);
        cipher.init(mode, secretKey, gcmParameterSpec);
        return cipher.doFinal(text);
    }

}
```

</details>

### 伝送のための暗号化

ここでも、[OWASP Cryptographic Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html#algorithms) のアルゴリズムに関するガイダンスに従います。

#### Google Tink を使用した非対称暗号の例

Google Tink には、一般的なタスクを実行するためのドキュメントがあります。

たとえば、Google の Web サイトにあるこのページでは、二者が非対称鍵ペアに基づいてデータを共有したい場合に、[ハイブリッド暗号化プロセスを実行する方法](https://developers.google.com/tink/exchange-data) が示されています。

次のコードスニペットは、この機能を使用して Alice と Bob の間でシークレットを共有する方法を示しています。

<details>
  <summary>「Tink hybrid encryption」コードスニペットを表示するにはここをクリックしてください。</summary>

``` java
import static java.nio.charset.StandardCharsets.UTF_8;

import com.google.crypto.tink.HybridDecrypt;
import com.google.crypto.tink.HybridEncrypt;
import com.google.crypto.tink.InsecureSecretKeyAccess;
import com.google.crypto.tink.KeysetHandle;
import com.google.crypto.tink.TinkJsonProtoKeysetFormat;
import com.google.crypto.tink.hybrid.HybridConfig;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;

// HybridReplaceTest
class App {
    public static void main(String[] args) throws Exception {
        /*

        Generated public/private keypairs for Bob and Alice using the
        following tinkey commands:

        ./tinkey create-keyset \
        --key-template DHKEM_X25519_HKDF_SHA256_HKDF_SHA256_AES_256_GCM \
        --out-format JSON --out alice_private_keyset.json

        ./tinkey create-keyset \
        --key-template DHKEM_X25519_HKDF_SHA256_HKDF_SHA256_AES_256_GCM \
        --out-format JSON --out bob_private_keyset.json

        ./tinkey create-public-keyset --in alice_private_keyset.json \
        --in-format JSON --out-format JSON --out alice_public_keyset.json

        ./tinkey create-public-keyset --in bob_private_keyset.json \
        --in-format JSON --out-format JSON --out bob_public_keyset.json
        */

        HybridConfig.register();

        // Generate ECC key pair for Alice
        var alice = new HybridSimple(
                getKeysetHandle("/home/alicesmith/private_keyset.json"),
                getKeysetHandle("/home/alicesmith/public_keyset.json")

        );

        KeysetHandle alicePublicKey = alice.getPublicKey();

        // Generate ECC key pair for Bob
        var bob = new HybridSimple(
                getKeysetHandle("/home/bobjones/private_keyset.json"),
                getKeysetHandle("/home/bobjones/public_keyset.json")

        );

        KeysetHandle bobPublicKey = bob.getPublicKey();

        // This keypair generation should be reperformed every so often in order to
        // obtain a new shared secret to avoid a long lived shared secret.

        // Alice encrypts a message to send to Bob
        String plaintext = "Hello, Bob!";

        // Add some relevant context about the encrypted data that should be verified
        // on decryption
        String metadata = "Sender: alicesmith@example.com";

        System.out.println("Secret being sent from Alice to Bob: " + plaintext);
        var cipherText = alice.encrypt(bobPublicKey, plaintext, metadata);
        System.out.println("Ciphertext being sent from Alice to Bob: " + Base64.getEncoder().encodeToString(cipherText));

        // Bob decrypts the message
        var decrypted = bob.decrypt(cipherText, metadata);
        System.out.println("Secret received by Bob from Alice: " + decrypted);
        System.out.println();

        // Bob encrypts a message to send to Alice
        String plaintext2 = "Hello, Alice!";

        // Add some relevant context about the encrypted data that should be verified
        // on decryption
        String metadata2 = "Sender: bobjones@example.com";

        System.out.println("Secret being sent from Bob to Alice: " + plaintext2);
        var cipherText2 = bob.encrypt(alicePublicKey, plaintext2, metadata2);
        System.out.println("Ciphertext being sent from Bob to Alice: " + Base64.getEncoder().encodeToString(cipherText2));

        // Bob decrypts the message
        var decrypted2 = alice.decrypt(cipherText2, metadata2);
        System.out.println("Secret received by Alice from Bob: " + decrypted2);
    }

    private static KeysetHandle getKeysetHandle(String filename) throws Exception
    {
        return TinkJsonProtoKeysetFormat.parseKeyset(
                new String(Files.readAllBytes( Paths.get(filename)), UTF_8), InsecureSecretKeyAccess.get());
    }
}
class HybridSimple {

    private KeysetHandle privateKey;
    private KeysetHandle publicKey;

    public HybridSimple(KeysetHandle privateKeyIn, KeysetHandle publicKeyIn) throws Exception {
        privateKey = privateKeyIn;
        publicKey = publicKeyIn;
    }

    public KeysetHandle getPublicKey() {
        return publicKey;
    }

    public byte[] encrypt(KeysetHandle partnerPublicKey, String message, String metadata) throws Exception {

        HybridEncrypt encryptor = partnerPublicKey.getPrimitive(HybridEncrypt.class);

        // return the encrypted value
        return encryptor.encrypt(message.getBytes(UTF_8), metadata.getBytes(UTF_8));
    }
    public String decrypt(byte[] ciphertext, String metadata) throws Exception {

        HybridDecrypt decryptor = privateKey.getPrimitive(HybridDecrypt.class);

        // return the encrypted value
        return new String(decryptor.decrypt(ciphertext, metadata.getBytes(UTF_8)),UTF_8);
    }

}
```

</details>

#### 組み込み JCA/JCE クラスを使用した非対称暗号の例

別のライブラリをどうしても使用できない場合は、組み込みの JCA/JCE クラスを使用することも可能です。ただし、ごく些細な誤りでも暗号を深刻に弱体化させる可能性があるため、設計とコード全体を暗号専門家にレビューしてもらうことを強く推奨します。

次のコードスニペットは、Elliptic Curve/Diffie Helman (ECDH) と AES-GCM を組み合わせて、二者間で対称鍵を転送する必要なしにデータの暗号化/復号を実行する例を示しています。代わりに、双方が公開鍵を交換し、その後 ECDH を使用して対称暗号化に使用できる共有シークレットを生成できます。

このコードサンプルは、[前のセクション](#組み込み-jcajce-クラスを使用した対称暗号の例) の AesGcmSimple クラスに依存していることに注意してください。

このコードには、いくつかの制約/落とし穴があります。

- 鍵のローテーションや管理は、それ自体が大きなトピックですが、このコードでは考慮していません。
- このコードは暗号化操作ごとに新しい nonce を意図的に強制しますが、これは暗号文とともに別個のデータ項目として管理する必要があります。
- 秘密鍵は安全に保存する必要があります。
- このコードは、使用前の公開鍵の検証を考慮していません。
- 全体として、二者間の真正性検証はありません。

<details>
  <summary>「JCA/JCE hybrid encryption」コードスニペットを表示するにはここをクリックしてください。</summary>

```java
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import javax.crypto.spec.*;
import javax.crypto.*;
import java.util.*;
import java.security.*;
import java.security.spec.*;
import java.util.Arrays;

// ECDHSimpleTest
class Main {
    public static void main(String[] args) throws Exception {

        // Generate ECC key pair for Alice
        var alice = new ECDHSimple();
        Key alicePublicKey = alice.getPublicKey();

        // Generate ECC key pair for Bob
        var bob = new ECDHSimple();
        Key bobPublicKey = bob.getPublicKey();

        // This keypair generation should be reperformed every so often in order to
        // obtain a new shared secret to avoid a long lived shared secret.

        // Alice encrypts a message to send to Bob
        String plaintext = "Hello"; //, Bob!";
        System.out.println("Secret being sent from Alice to Bob: " + plaintext);

        var retPair = alice.encrypt(bobPublicKey, plaintext);
        var nonce = retPair.getKey();
        var cipherText = retPair.getValue();

        System.out.println("Both cipherText and nonce being sent from Alice to Bob: " + Base64.getEncoder().encodeToString(cipherText) + " " + Base64.getEncoder().encodeToString(nonce));

        // Bob decrypts the message
        var decrypted = bob.decrypt(alicePublicKey, cipherText, nonce);
        System.out.println("Secret received by Bob from Alice: " + decrypted);
        System.out.println();

        // Bob encrypts a message to send to Alice
        String plaintext2 = "Hello"; //, Alice!";
        System.out.println("Secret being sent from Bob to Alice: " + plaintext2);

        var retPair2 = bob.encrypt(alicePublicKey, plaintext2);
        var nonce2 = retPair2.getKey();
        var cipherText2 = retPair2.getValue();
        System.out.println("Both cipherText2 and nonce2 being sent from Bob to Alice: " + Base64.getEncoder().encodeToString(cipherText2) + " " + Base64.getEncoder().encodeToString(nonce2));

        // Bob decrypts the message
        var decrypted2 = alice.decrypt(bobPublicKey, cipherText2, nonce2);
        System.out.println("Secret received by Alice from Bob: " + decrypted2);
    }
}
class ECDHSimple {
    private KeyPair keyPair;

    public class AesKeyNonce {
        public SecretKey Key;
        public byte[] Nonce;
    }

    public ECDHSimple() throws Exception {
        KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance("EC");
        ECGenParameterSpec ecSpec = new ECGenParameterSpec("secp256r1"); // Using secp256r1 curve
        keyPairGenerator.initialize(ecSpec);
        keyPair = keyPairGenerator.generateKeyPair();
    }

    public Key getPublicKey() {
        return keyPair.getPublic();
    }

    public AbstractMap.SimpleEntry<byte[], byte[]> encrypt(Key partnerPublicKey, String message) throws Exception {

        // Generate the AES Key and Nonce
        AesKeyNonce aesParams = generateAESParams(partnerPublicKey);

        // return the encrypted value
        return new AbstractMap.SimpleEntry<>(
            aesParams.Nonce,
            AesGcmSimple.encrypt(message, aesParams.Nonce, aesParams.Key)
            );
    }
    public String decrypt(Key partnerPublicKey, byte[] ciphertext, byte[] nonce) throws Exception {

        // Generate the AES Key and Nonce
        AesKeyNonce aesParams = generateAESParams(partnerPublicKey, nonce);

        // return the decrypted value
        return AesGcmSimple.decrypt(ciphertext, aesParams.Nonce, aesParams.Key);
    }

    private AesKeyNonce generateAESParams(Key partnerPublicKey, byte[] nonce) throws Exception {

        // Derive the secret based on this side's private key and the other side's public key
        KeyAgreement keyAgreement = KeyAgreement.getInstance("ECDH");
        keyAgreement.init(keyPair.getPrivate());
        keyAgreement.doPhase(partnerPublicKey, true);
        byte[] secret = keyAgreement.generateSecret();

        AesKeyNonce aesKeyNonce = new AesKeyNonce();

        // Copy first 32 bytes as the key
        byte[] key = Arrays.copyOfRange(secret, 0, (AesGcmSimple.KEY_SIZE / 8));
        aesKeyNonce.Key = new SecretKeySpec(key, 0, key.length, "AES");

        // Passed in nonce will be used.
        aesKeyNonce.Nonce = nonce;
        return aesKeyNonce;

    }

    private AesKeyNonce generateAESParams(Key partnerPublicKey) throws Exception {

        // Nonce of 12 bytes / 96 bits and this size should always be used.
        // It is critical for AES-GCM that a unique nonce is used for every cryptographic operation.
        // Therefore this is not generated from the shared secret
        byte[] nonce = new byte[AesGcmSimple.IV_LENGTH];
        SecureRandom random = new SecureRandom();
        random.nextBytes(nonce);
        return generateAESParams(partnerPublicKey, nonce);

    }
}
```

</details>

</section>

<section id="java-security-bilingual-panel" className="tabPanel bilingualPanel">

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Injection Prevention in Java

This section aims to provide tips to handle *Injection* in Java application code.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## Java におけるインジェクション防止

このセクションでは、Java アプリケーションコードで *インジェクション (Injection)* を扱うためのヒントを提供します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Sample code used in tips is located [here](https://github.com/righettod/injection-cheat-sheets).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

ヒントで使用しているサンプルコードは [こちら](https://github.com/righettod/injection-cheat-sheets) にあります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### What is Injection

[Injection](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A1-Injection) in OWASP Top 10 is defined as following:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### インジェクションとは

OWASP Top 10 における [インジェクション](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A1-Injection) は、次のように定義されています。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

*Consider anyone who can send untrusted data to the system, including external users, internal users, and administrators.*

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

*外部ユーザー、内部ユーザー、管理者を含め、信頼できないデータをシステムに送信できるすべての人を考慮します。*

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### General advice to prevent Injection

The following point can be applied, in a general way, to prevent *Injection* issue:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### インジェクションを防止するための一般的な助言

*インジェクション* の問題を防止するために、一般的には次の点を適用できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

1. Apply **Input Validation** (using allowlist approach) combined with **Output Sanitizing+Escaping** on user input/output.
2. If you need to interact with system, try to use API features provided by your technology stack (Java / .Net / PHP...) instead of building command.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

1. ユーザーの入力/出力に対して、**入力検証** (許可リスト方式を使用) と **出力のサニタイズ + エスケープ** を組み合わせて適用します。
2. システムとやり取りする必要がある場合は、コマンドを組み立てるのではなく、使用している技術スタック (Java / .Net / PHP など) が提供する API 機能を使用するようにします。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Additional advice is provided on this [cheatsheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

追加の助言は、この [チートシート](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html) で提供されています。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Specific Injection types

*Examples in this section will be provided in Java technology (see Maven project associated) but advice is applicable to others technologies like .Net / PHP / Ruby / Python...*

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 特定のインジェクション種別

*このセクションの例は Java 技術で示します (関連する Maven プロジェクトを参照) が、助言は .Net / PHP / Ruby / Python など他の技術にも適用できます。*

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### SQL

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### SQL

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Symptom

Injection of this type occur when the application uses untrusted user input to build an SQL query using a String and execute it.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 症状

この種のインジェクションは、アプリケーションが信頼できないユーザー入力を使用して String で SQL クエリを組み立て、それを実行する場合に発生します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### How to prevent

Use *Query Parameterization* in order to prevent injection.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 防止方法

インジェクションを防止するために、*クエリのパラメータ化 (Query Parameterization)* を使用します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Example

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 例

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

``` java
/*No DB framework used here in order to show the real use of
  Prepared Statement from Java API*/
/*Open connection with H2 database and use it*/
Class.forName("org.h2.Driver");
String jdbcUrl = "jdbc:h2:file:" + new File(".").getAbsolutePath() + "/target/db";
try (Connection con = DriverManager.getConnection(jdbcUrl)) {

    /* Sample A: Select data using Prepared Statement*/
    String query = "select * from color where friendly_name = ?";
    List<String> colors = new ArrayList<>();
    try (PreparedStatement pStatement = con.prepareStatement(query)) {
        pStatement.setString(1, "yellow");
        try (ResultSet rSet = pStatement.executeQuery()) {
            while (rSet.next()) {
                colors.add(rSet.getString(1));
            }
        }
    }

    /* Sample B: Insert data using Prepared Statement*/
    query = "insert into color(friendly_name, red, green, blue) values(?, ?, ?, ?)";
    int insertedRecordCount;
    try (PreparedStatement pStatement = con.prepareStatement(query)) {
        pStatement.setString(1, "orange");
        pStatement.setInt(2, 239);
        pStatement.setInt(3, 125);
        pStatement.setInt(4, 11);
        insertedRecordCount = pStatement.executeUpdate();
    }

   /* Sample C: Update data using Prepared Statement*/
    query = "update color set blue = ? where friendly_name = ?";
    int updatedRecordCount;
    try (PreparedStatement pStatement = con.prepareStatement(query)) {
        pStatement.setInt(1, 10);
        pStatement.setString(2, "orange");
        updatedRecordCount = pStatement.executeUpdate();
    }

   /* Sample D: Delete data using Prepared Statement*/
    query = "delete from color where friendly_name = ?";
    int deletedRecordCount;
    try (PreparedStatement pStatement = con.prepareStatement(query)) {
        pStatement.setString(1, "orange");
        deletedRecordCount = pStatement.executeUpdate();
    }

}
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### JPA

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### JPA

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Symptom

Injection of this type occur when the application uses untrusted user input to build a JPA query using a String and execute it. It's quite similar to SQL injection but here the altered language is not SQL but JPA QL.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 症状

この種のインジェクションは、アプリケーションが信頼できないユーザー入力を使用して String で JPA クエリを組み立て、それを実行する場合に発生します。SQL インジェクションとかなり似ていますが、ここで改変される言語は SQL ではなく JPA QL です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### How to prevent

Use Java Persistence Query Language **Query Parameterization** in order to prevent injection.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 防止方法

インジェクションを防止するために、Java Persistence Query Language の **クエリのパラメータ化** を使用します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Example

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 例

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

``` java
EntityManager entityManager = null;
try {
    /* Get a ref on EntityManager to access DB */
    entityManager = Persistence.createEntityManagerFactory("testJPA").createEntityManager();

    /* Define parameterized query prototype using named parameter to enhance readability */
    String queryPrototype = "select c from Color c where c.friendlyName = :colorName";

    /* Create the query, set the named parameter and execute the query */
    Query queryObject = entityManager.createQuery(queryPrototype);
    Color c = (Color) queryObject.setParameter("colorName", "yellow").getSingleResult();

} finally {
    if (entityManager != null && entityManager.isOpen()) {
        entityManager.close();
    }
}
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Operating System

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### オペレーティングシステム

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Symptom

Injection of this type occur when the application uses untrusted user input to build an Operating System command using a String and execute it.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 症状

この種のインジェクションは、アプリケーションが信頼できないユーザー入力を使用して String でオペレーティングシステムコマンドを組み立て、それを実行する場合に発生します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### How to prevent

Use technology stack **API** in order to prevent injection.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 防止方法

インジェクションを防止するために、技術スタックの **API** を使用します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Example

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 例

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

``` java
/* The context taken is, for example, to perform a PING against a computer.
* The prevention is to use the feature provided by the Java API instead of building
* a system command as String and execute it */
InetAddress host = InetAddress.getByName("localhost");
var reachable = host.isReachable(5000);
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### XML: XPath Injection

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### XML: XPath インジェクション

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Symptom

Injection of this type occur when the application uses untrusted user input to build a XPath query using a String and execute it.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 症状

この種のインジェクションは、アプリケーションが信頼できないユーザー入力を使用して String で XPath クエリを組み立て、それを実行する場合に発生します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### How to prevent

Use **XPath Variable Resolver** in order to prevent injection.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 防止方法

インジェクションを防止するために、**XPath Variable Resolver** を使用します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Example

**Variable Resolver** implementation.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 例

**Variable Resolver** の実装です。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

``` java
/**
 * Resolver in order to define parameter for XPATH expression.
 *
 */
public class SimpleVariableResolver implements XPathVariableResolver {

    private final Map<QName, Object> vars = new HashMap<QName, Object>();

    /**
     * External methods to add parameter
     *
     * @param name Parameter name
     * @param value Parameter value
     */
    public void addVariable(QName name, Object value) {
        vars.put(name, value);
    }

    /**
     * {@inheritDoc}
     *
     * @see javax.xml.xpath.XPathVariableResolver#resolveVariable(javax.xml.namespace.QName)
     */
    public Object resolveVariable(QName variableName) {
        return vars.get(variableName);
    }
}
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Code using it to perform XPath query.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

これを使用して XPath クエリを実行するコードです。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

``` java
/*Create a XML document builder factory*/
DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();

/*Disable External Entity resolution for different cases*/
//Do not performed here in order to focus on variable resolver code
//but do it for production code !

/*Load XML file*/
DocumentBuilder builder = dbf.newDocumentBuilder();
Document doc = builder.parse(new File("src/test/resources/SampleXPath.xml"));

/* Create and configure parameter resolver */
String bid = "bk102";
SimpleVariableResolver variableResolver = new SimpleVariableResolver();
variableResolver.addVariable(new QName("bookId"), bid);

/*Create and configure XPATH expression*/
XPath xpath = XPathFactory.newInstance().newXPath();
xpath.setXPathVariableResolver(variableResolver);
XPathExpression xPathExpression = xpath.compile("//book[@id=$bookId]");

/* Apply expression on XML document */
Object nodes = xPathExpression.evaluate(doc, XPathConstants.NODESET);
NodeList nodesList = (NodeList) nodes;
Element book = (Element)nodesList.item(0);
var containsRalls = book.getTextContent().contains("Ralls, Kim");
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### HTML/JavaScript/CSS

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### HTML/JavaScript/CSS

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Symptom

Injection of this type occur when the application uses untrusted user input to build an HTTP response and sent it to browser.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 症状

この種のインジェクションは、アプリケーションが信頼できないユーザー入力を使用して HTTP レスポンスを組み立て、ブラウザに送信する場合に発生します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### How to prevent

Either apply strict input validation (allowlist approach) or use output sanitizing+escaping if input validation is not possible (combine both every time is possible).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 防止方法

厳格な入力検証 (許可リスト方式) を適用するか、入力検証ができない場合は出力のサニタイズ + エスケープを使用します (可能な場合は常に両方を組み合わせます)。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Example

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 例

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

``` java
/*
INPUT WAY: Receive data from user
Here it's recommended to use strict input validation using allowlist approach.
In fact, you ensure that only allowed characters are part of the input received.
*/

String userInput = "You user login is owasp-user01";

/* First we check that the value contains only expected character*/
if (!Pattern.matches("[a-zA-Z0-9\\s\\-]{1,50}", userInput))
{
    return false;
}

/* If the first check pass then ensure that potential dangerous character
that we have allowed for business requirement are not used in a dangerous way.
For example here we have allowed the character '-', and, this can
be used in SQL injection so, we
ensure that this character is not used is a continuous form.
Use the API COMMONS LANG v3 to help in String analysis...
*/
If (0 != StringUtils.countMatches(userInput.replace(" ", ""), "--"))
{
    return false;
}

/*
OUTPUT WAY: Send data to user
Here we escape + sanitize any data sent to user
Use the OWASP Java HTML Sanitizer API to handle sanitizing
Use the OWASP Java Encoder API to handle HTML tag encoding (escaping)
*/

String outputToUser = "You <p>user login</p> is <strong>owasp-user01</strong>";
outputToUser += "<script>alert(22);</script><img src='#' onload='javascript:alert(23);'>";

/* Create a sanitizing policy that only allow tag '<p>' and '<strong>'*/
PolicyFactory policy = new HtmlPolicyBuilder().allowElements("p", "strong").toFactory();

/* Sanitize the output that will be sent to user*/
String safeOutput = policy.sanitize(outputToUser);

/* Encode HTML Tag*/
safeOutput = Encode.forHtml(safeOutput);
String finalSafeOutputExpected = "You <p>user login</p> is <strong>owasp-user01</strong>";
if (!finalSafeOutputExpected.equals(safeOutput))
{
    return false;
}
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### LDAP

A dedicated [cheatsheet](https://cheatsheetseries.owasp.org/cheatsheets/LDAP_Injection_Prevention_Cheat_Sheet.html) has been created.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### LDAP

専用の [チートシート](https://cheatsheetseries.owasp.org/cheatsheets/LDAP_Injection_Prevention_Cheat_Sheet.html) が作成されています。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### NoSQL

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### NoSQL

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Symptom

Injection of this type occur when the application uses untrusted user input to build a NoSQL API call expression.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 症状

この種のインジェクションは、アプリケーションが信頼できないユーザー入力を使用して NoSQL API 呼び出し式を組み立てる場合に発生します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### How to prevent

As there many NoSQL database system and each one use an API for call, it's important to ensure that user input received and used to build the API call expression does not contain any character that have a special meaning in the target API syntax. This in order to avoid that it will be used to escape the initial call expression in order to create another one based on crafted user input. It's also important to not use string concatenation to build API call expression but use the API to create the expression.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 防止方法

NoSQL データベースシステムは数多くあり、それぞれが呼び出しに API を使用するため、API 呼び出し式を組み立てるために受け取り使用するユーザー入力に、対象 API 構文で特別な意味を持つ文字が含まれていないことを確認することが重要です。これは、細工されたユーザー入力に基づいて別の式を作成するために、初期の呼び出し式から抜け出す用途で使われることを避けるためです。また、API 呼び出し式を組み立てるために文字列連結を使わず、API を使用して式を作成することも重要です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Example - MongoDB

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 例 - MongoDB

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

``` java
 /* Here use MongoDB as target NoSQL DB */
String userInput = "Brooklyn";

/* First ensure that the input do no contains any special characters
for the current NoSQL DB call API,
here they are: ' " \ ; { } $
*/
//Avoid regexp this time in order to made validation code
//more easy to read and understand...
ArrayList < String > specialCharsList = new ArrayList < String > () {
    {
        add("'");
        add("\"");
        add("\\");
        add(";");
        add("{");
        add("}");
        add("$");
    }
};

for (String specChar: specialCharsList) {
    if (userInput.contains(specChar)) {
        return false;
    }
}

//Add also a check on input max size
if (!userInput.length() <= 50)
{
    return false;
}

/* Then perform query on database using API to build expression */
//Connect to the local MongoDB instance
try(MongoClient mongoClient = new MongoClient()){
    MongoDatabase db = mongoClient.getDatabase("test");
    //Use API query builder to create call expression
    //Create expression
    Bson expression = eq("borough", userInput);
    //Perform call
    FindIterable<org.bson.Document> restaurants = db.getCollection("restaurants").find(expression);
    //Verify result consistency
    restaurants.forEach(new Block<org.bson.Document>() {
        @Override
        public void apply(final org.bson.Document doc) {
            String restBorough = (String)doc.get("borough");
            if (!"Brooklyn".equals(restBorough))
            {
                return false;
            }
        }
    });
}
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Log Injection

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### ログインジェクション

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Symptom

[Log Injection](https://owasp.org/www-community/attacks/Log_Injection) occurs when an application includes untrusted data in an application log message (e.g., an attacker can cause an additional log entry that looks like it came from a completely different user, if they can inject CRLF characters in the untrusted data). More information about this attack is available on the OWASP [Log Injection](https://owasp.org/www-community/attacks/Log_Injection) page.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 症状

[ログインジェクション](https://owasp.org/www-community/attacks/Log_Injection) は、アプリケーションが信頼できないデータをアプリケーションログメッセージに含める場合に発生します (たとえば、攻撃者が信頼できないデータに CRLF 文字を注入できると、まったく別のユーザーから発生したように見える追加のログエントリを作成できます)。この攻撃の詳細は、OWASP の [Log Injection](https://owasp.org/www-community/attacks/Log_Injection) ページで確認できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### How to prevent

To prevent an attacker from writing malicious content into the application log, apply defenses such as:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 防止方法

攻撃者がアプリケーションログに悪意のある内容を書き込むことを防ぐには、次のような防御策を適用します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Use structured log formats, such as JSON, instead of unstructured text formats.
  Unstructured formats are susceptible to **C**arriage **R**eturn (CR) and **L**ine **F**eed (LF) injection (see [CWE-93](https://cwe.mitre.org/data/definitions/93.html)).
- Limit the size of the user input value used to create the log message.
- Make sure [all XSS defenses](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html) are applied when viewing log files in a web browser.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- 非構造化テキスト形式ではなく、JSON などの構造化ログ形式を使用します。
  非構造化形式は、**C**arriage **R**eturn (CR) と **L**ine **F**eed (LF) のインジェクションを受けやすくなります ([CWE-93](https://cwe.mitre.org/data/definitions/93.html) を参照)。
- ログメッセージの作成に使用するユーザー入力値のサイズを制限します。
- Web ブラウザでログファイルを表示する場合は、[すべての XSS 防御策](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html) が適用されていることを確認します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Example using Log4j Core 2

The recommended logging policy for a production environment is sending logs to a network socket using the structured
[JSON Template Layout](https://logging.apache.org/log4j/2.x/manual/json-template-layout.html)
introduced in
[Log4j 2.14.0](https://logging.apache.org/log4j/2.x/release-notes.html#release-notes-2-14-0)
and limit the size of strings to 500 bytes using the
[`maxStringLength` configuration attribute](https://logging.apache.org/log4j/2.x/manual/json-template-layout.html#plugin-attr-maxStringLength):

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### Log4j Core 2 を使用する例

本番環境で推奨されるロギングポリシーは、構造化された
[JSON Template Layout](https://logging.apache.org/log4j/2.x/manual/json-template-layout.html)
を使用してネットワークソケットにログを送信することです。これは
[Log4j 2.14.0](https://logging.apache.org/log4j/2.x/release-notes.html#release-notes-2-14-0)
で導入され、さらに
[`maxStringLength` 設定属性](https://logging.apache.org/log4j/2.x/manual/json-template-layout.html#plugin-attr-maxStringLength) を使用して文字列のサイズを 500 バイトに制限します。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Configuration xmlns="https://logging.apache.org/xml/ns"
               xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
               xsi:schemaLocation="
                   https://logging.apache.org/xml/ns
                   https://logging.apache.org/xml/ns/log4j-config-2.xsd">
  <Appenders>
    <Socket name="SOCKET"
            host="localhost"
            port="12345">
      <!-- Limit the size of any string field in the produced JSON document to 500 bytes -->
      <JsonTemplateLayout maxStringLength="500"
                          nullEventDelimiterEnabled="true"/>
    </Socket>
  </Appenders>
  <Loggers>
    <Root level="DEBUG">
      <AppenderRef ref="SOCKET"/>
    </Root>
  </Loggers>
</Configuration>
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

See
[Integration with service-oriented architectures](https://logging.apache.org/log4j/2.x/soa.html)
on
[Log4j website](https://logging.apache.org/log4j/2.x/index.html)
for more tips.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

詳細なヒントについては、
[Integration with service-oriented architectures](https://logging.apache.org/log4j/2.x/soa.html)
を
[Log4j website](https://logging.apache.org/log4j/2.x/index.html)
で参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Usage of the logger at code level:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

コードレベルでのロガーの使用方法です。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

``` java
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
...
// Most common way to declare a logger
private static final LOGGER = LogManager.getLogger();
// GOOD!
//
// Use parameterized logging to add user data to a message
// The pattern should be a compile-time constant
logger.warn("Login failed for user {}.", username);
// BAD!
//
// Don't mix string concatenation and parameters
// If `username` contains `{}`, the exception will leak into the message
logger.warn("Failure for user " + username + " and role {}.", role, ex);
...
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

See
[Log4j API Best Practices](https://logging.apache.org/log4j/2.x/manual/api.html#best-practice)
for more information.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

詳細なヒントについては、
[Log4j API Best Practices](https://logging.apache.org/log4j/2.x/manual/api.html#best-practice)
を参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Example using Logback

The recommended logging policy for a production environment is using the structured
[JsonEncoder](https://logback.qos.ch/manual/encoders.html#JsonEncoder)
introduced in
[Logback 1.3.8](https://logback.qos.ch/news.html#1.3.8).
In the example below, Logback is configured to roll on 10 log files of 5 MiB each:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### Logback を使用する例

本番環境で推奨されるロギングポリシーは、構造化された
[JsonEncoder](https://logback.qos.ch/manual/encoders.html#JsonEncoder)
を使用してネットワークソケットにログを送信することです。これは
[Logback 1.3.8](https://logback.qos.ch/news.html#1.3.8) で導入されたものです。
以下の例では、Logback は 5 MiB ずつ 10 個のログファイルでローテーションするように設定されています。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

``` xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration>
<configuration>
  <import class="ch.qos.logback.classic.encoder.JsonEncoder"/>
  <import class="ch.qos.logback.core.rolling.FixedWindowRollingPolicy"/>
  <import class="ch.qos.logback.core.rolling.RollingFileAppender"/>
  <import class="ch.qos.logback.core.rolling.SizeBasedTriggeringPolicy"/>

  <appender name="RollingFile" class="RollingFileAppender">
    <file>app.log</file>
    <rollingPolicy class="FixedWindowRollingPolicy">
      <fileNamePattern>app-%i.log</fileNamePattern>
      <minIndex>1</minIndex>
      <maxIndex>10</maxIndex>
    </rollingPolicy>
    <triggeringPolicy class="SizeBasedTriggeringPolicy">
      <maxFileSize>5MB</maxFileSize>
    </triggeringPolicy>
    <encoder class="JsonEncoder"/>
  </appender>

  <root level="DEBUG">
    <appender-ref ref="SOCKET"/>
  </root>
</configuration>
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Usage of the logger at code level:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

コードレベルでのロガーの使用方法です。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

``` java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
...
// Most common way to declare a logger
Logger logger = LoggerFactory.getLogger(MyClass.class);
// GOOD!
//
// Use parameterized logging to add user data to a message
// The pattern should be a compile-time constant
logger.warn("Login failed for user {}.", username);
// BAD!
//
// Don't mix string concatenation and parameters
// If `username` contains `{}`, the exception will leak into the message
logger.warn("Failure for user " + username + " and role {}.", role, ex);
...
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Cryptography

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 暗号

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### General cryptography guidance

- **Never, ever write your own cryptographic functions.**
- Wherever possible, try and avoid writing any cryptographic code at all. Instead try and either use pre-existing secret management solutions or the secret management solution provided by your cloud provider. For more information, see the [OWASP Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html).
- If you cannot use a pre-existing secret management solution, try and use a trusted and well known implementation library rather than using the libraries built into JCA/JCE as it is far too easy to make cryptographic errors with them.
- Make sure your application or protocol can easily support a future change of cryptographic algorithms.
- Use your package manager wherever possible to keep all of your packages up to date. Watch the updates on your development setup, and plan updates to your applications accordingly.
- We will show examples below based on Google Tink, which is a library created by cryptography experts for using cryptography safely (in the sense of minimizing common mistakes made when using standard cryptography libraries).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 暗号に関する一般的なガイダンス

- **決して独自の暗号関数を書いてはいけません。**
- 可能な限り、暗号コードを一切書かないようにします。代わりに、既存のシークレット管理ソリューション、またはクラウドプロバイダが提供するシークレット管理ソリューションの使用を試みます。詳細については、[OWASP Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html) を参照してください。
- 既存のシークレット管理ソリューションを使用できない場合は、JCA/JCE に組み込まれたライブラリを使用するのではなく、信頼され広く知られた実装ライブラリを使用するようにします。JCA/JCE では暗号上の誤りを起こすことが非常に容易だからです。
- アプリケーションまたはプロトコルが、将来の暗号アルゴリズム変更を容易にサポートできるようにします。
- 可能な限りパッケージマネージャを使用して、すべてのパッケージを最新に保ちます。開発環境で更新を監視し、それに応じてアプリケーションの更新を計画します。
- 以下では Google Tink に基づく例を示します。Google Tink は、標準的な暗号ライブラリ使用時に起こりがちなミスを最小化するという意味で、安全に暗号を使用するために暗号専門家が作成したライブラリです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Encryption for storage

Follow the algorithm guidance in the [OWASP Cryptographic Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html#algorithms).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 保存のための暗号化

[OWASP Cryptographic Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html#algorithms) のアルゴリズムに関するガイダンスに従います。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Symmetric example using Google Tink

Google Tink has documentation on performing common tasks.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### Google Tink を使用した対称暗号の例

Google Tink には、一般的なタスクを実行するためのドキュメントがあります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

For example, this page (from Google's website) shows [how to perform simple symmetric encryption](https://developers.google.com/tink/encrypt-data).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

たとえば、Google の Web サイトにあるこのページでは、[単純な対称暗号化を実行する方法](https://developers.google.com/tink/encrypt-data) が示されています。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The following code snippet shows an encapsulated use of this functionality:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

次のコードスニペットは、この機能をカプセル化して使用する方法を示しています。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

&lt;details&gt;
  &lt;summary&gt;Click here to view the "Tink symmetric encryption" code snippet.&lt;/summary&gt;

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

<details>
  <summary>「Tink symmetric encryption」コードスニペットを表示するにはここをクリックしてください。</summary>

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

``` java
import static java.nio.charset.StandardCharsets.UTF_8;

import com.google.crypto.tink.Aead;
import com.google.crypto.tink.InsecureSecretKeyAccess;
import com.google.crypto.tink.KeysetHandle;
import com.google.crypto.tink.TinkJsonProtoKeysetFormat;
import com.google.crypto.tink.aead.AeadConfig;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;

// AesGcmSimpleTest
public class App {

    // Based on example from:
    // https://github.com/tink-crypto/tink-java/tree/main/examples/aead

    public static void main(String[] args) throws Exception {

        // Key securely generated using:
        // tinkey create-keyset --key-template AES128_GCM --out-format JSON --out aead_test_keyset.json

        // Register all AEAD key types with the Tink runtime.
        AeadConfig.register();

        // Read the keyset into a KeysetHandle.
        KeysetHandle handle =
        TinkJsonProtoKeysetFormat.parseKeyset(
            new String(Files.readAllBytes( Paths.get("/home/fredbloggs/aead_test_keyset.json")), UTF_8), InsecureSecretKeyAccess.get());

        String message = "This message to be encrypted";
        System.out.println(message);

        // Add some relevant context about the encrypted data that should be verified
        // on decryption
        String metadata = "Sender: fredbloggs@example.com";

        // Encrypt the message
        byte[] cipherText = AesGcmSimple.encrypt(message, metadata, handle);
        System.out.println(Base64.getEncoder().encodeToString(cipherText));

        // Decrypt the message
        String message2 = AesGcmSimple.decrypt(cipherText, metadata, handle);
        System.out.println(message2);
    }
}

class AesGcmSimple {

    public static byte[] encrypt(String plaintext, String metadata, KeysetHandle handle) throws Exception {
        // Get the primitive.
        Aead aead = handle.getPrimitive(Aead.class);
        return aead.encrypt(plaintext.getBytes(UTF_8), metadata.getBytes(UTF_8));
    }

    public static String decrypt(byte[] ciphertext, String metadata, KeysetHandle handle) throws Exception {
        // Get the primitive.
        Aead aead = handle.getPrimitive(Aead.class);
        return new String(aead.decrypt(ciphertext, metadata.getBytes(UTF_8)),UTF_8);
    }

}

```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

&lt;/details&gt;

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

</details>

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Symmetric example using built-in JCA/JCE classes

If you absolutely cannot use a separate library, it is still possible to use the built JCA/JCE classes but it is strongly recommended to have a cryptography expert review the full design and code, as even the most trivial error can severely weaken your encryption.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 組み込み JCA/JCE クラスを使用した対称暗号の例

別のライブラリをどうしても使用できない場合は、組み込みの JCA/JCE クラスを使用することも可能です。ただし、ごく些細な誤りでも暗号を深刻に弱体化させる可能性があるため、設計とコード全体を暗号専門家にレビューしてもらうことを強く推奨します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The following code snippet shows an example of using AES-GCM to perform encryption/decryption of data.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

次のコードスニペットは、AES-GCM を使用してデータの暗号化/復号を実行する例を示しています。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

A few constraints/pitfalls with this code:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

このコードには、いくつかの制約/落とし穴があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- It does not take into account key rotation or management which is a whole topic in itself.
- It is important to use a different nonce for every encryption operation, especially if the same key is used. For more information, see [this answer on Cryptography Stack Exchange](https://crypto.stackexchange.com/a/66500).
- The key will need to be stored securely.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- 鍵のローテーションや管理は、それ自体が大きなトピックですが、このコードでは考慮していません。
- 暗号化操作ごとに異なる nonce を使用することが重要です。同じ鍵を使用する場合は特に重要です。詳細については、[Cryptography Stack Exchange のこの回答](https://crypto.stackexchange.com/a/66500) を参照してください。
- 鍵は安全に保存する必要があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

&lt;details&gt;
  &lt;summary&gt;Click here to view the "JCA/JCE symmetric encryption" code snippet.&lt;/summary&gt;

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

<details>
  <summary>「JCA/JCE symmetric encryption」コードスニペットを表示するにはここをクリックしてください。</summary>

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```java
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import javax.crypto.spec.*;
import javax.crypto.*;
import java.util.Base64;

// AesGcmSimpleTest
class Main {

    public static void main(String[] args) throws Exception {
        // Key of 32 bytes / 256 bits for AES
        KeyGenerator keyGen = KeyGenerator.getInstance(AesGcmSimple.ALGORITHM);
        keyGen.init(AesGcmSimple.KEY_SIZE, new SecureRandom());
        SecretKey secretKey = keyGen.generateKey();

        // Nonce of 12 bytes / 96 bits and this size should always be used.
        // It is critical for AES-GCM that a unique nonce is used for every cryptographic operation.
        byte[] nonce = new byte[AesGcmSimple.IV_LENGTH];
        SecureRandom random = new SecureRandom();
        random.nextBytes(nonce);

        var message = "This message to be encrypted";
        System.out.println(message);

        // Encrypt the message
        byte[] cipherText = AesGcmSimple.encrypt(message, nonce, secretKey);
        System.out.println(Base64.getEncoder().encodeToString(cipherText));

        // Decrypt the message
        var message2 = AesGcmSimple.decrypt(cipherText, nonce, secretKey);
        System.out.println(message2);
    }
}

class AesGcmSimple {

    public static final String ALGORITHM = "AES";
    public static final String CIPHER_ALGORITHM = "AES/GCM/NoPadding";
    public static final int KEY_SIZE = 256;
    public static final int TAG_LENGTH = 128;
    public static final int IV_LENGTH = 12;

    public static byte[] encrypt(String plaintext, byte[] nonce, SecretKey secretKey) throws Exception {
        return cryptoOperation(plaintext.getBytes(StandardCharsets.UTF_8), nonce, secretKey, Cipher.ENCRYPT_MODE);
    }

    public static String decrypt(byte[] ciphertext, byte[] nonce, SecretKey secretKey) throws Exception {
        return new String(cryptoOperation(ciphertext, nonce, secretKey, Cipher.DECRYPT_MODE), StandardCharsets.UTF_8);
    }

    private static byte[] cryptoOperation(byte[] text, byte[] nonce, SecretKey secretKey, int mode) throws Exception {
        Cipher cipher = Cipher.getInstance(CIPHER_ALGORITHM);
        GCMParameterSpec gcmParameterSpec = new GCMParameterSpec(TAG_LENGTH, nonce);
        cipher.init(mode, secretKey, gcmParameterSpec);
        return cipher.doFinal(text);
    }

}
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

&lt;/details&gt;

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

</details>

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Encryption for transmission

Again, follow the algorithm guidance in the [OWASP Cryptographic Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html#algorithms).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 伝送のための暗号化

ここでも、[OWASP Cryptographic Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html#algorithms) のアルゴリズムに関するガイダンスに従います。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Asymmetric example using Google Tink

Google Tink has documentation on performing common tasks.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### Google Tink を使用した非対称暗号の例

Google Tink には、一般的なタスクを実行するためのドキュメントがあります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

For example, this page (from Google's website) shows [how to perform a hybrid encryption process](https://developers.google.com/tink/exchange-data) where two parties want to share data based on their asymmetric key pair.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

たとえば、Google の Web サイトにあるこのページでは、二者が非対称鍵ペアに基づいてデータを共有したい場合に、[ハイブリッド暗号化プロセスを実行する方法](https://developers.google.com/tink/exchange-data) が示されています。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The following code snippet shows how this functionality can be used to share secrets between Alice and Bob:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

次のコードスニペットは、この機能を使用して Alice と Bob の間でシークレットを共有する方法を示しています。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

&lt;details&gt;
  &lt;summary&gt;Click here to view the "Tink hybrid encryption" code snippet.&lt;/summary&gt;

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

<details>
  <summary>「Tink hybrid encryption」コードスニペットを表示するにはここをクリックしてください。</summary>

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

``` java
import static java.nio.charset.StandardCharsets.UTF_8;

import com.google.crypto.tink.HybridDecrypt;
import com.google.crypto.tink.HybridEncrypt;
import com.google.crypto.tink.InsecureSecretKeyAccess;
import com.google.crypto.tink.KeysetHandle;
import com.google.crypto.tink.TinkJsonProtoKeysetFormat;
import com.google.crypto.tink.hybrid.HybridConfig;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;

// HybridReplaceTest
class App {
    public static void main(String[] args) throws Exception {
        /*

        Generated public/private keypairs for Bob and Alice using the
        following tinkey commands:

        ./tinkey create-keyset \
        --key-template DHKEM_X25519_HKDF_SHA256_HKDF_SHA256_AES_256_GCM \
        --out-format JSON --out alice_private_keyset.json

        ./tinkey create-keyset \
        --key-template DHKEM_X25519_HKDF_SHA256_HKDF_SHA256_AES_256_GCM \
        --out-format JSON --out bob_private_keyset.json

        ./tinkey create-public-keyset --in alice_private_keyset.json \
        --in-format JSON --out-format JSON --out alice_public_keyset.json

        ./tinkey create-public-keyset --in bob_private_keyset.json \
        --in-format JSON --out-format JSON --out bob_public_keyset.json
        */

        HybridConfig.register();

        // Generate ECC key pair for Alice
        var alice = new HybridSimple(
                getKeysetHandle("/home/alicesmith/private_keyset.json"),
                getKeysetHandle("/home/alicesmith/public_keyset.json")

        );

        KeysetHandle alicePublicKey = alice.getPublicKey();

        // Generate ECC key pair for Bob
        var bob = new HybridSimple(
                getKeysetHandle("/home/bobjones/private_keyset.json"),
                getKeysetHandle("/home/bobjones/public_keyset.json")

        );

        KeysetHandle bobPublicKey = bob.getPublicKey();

        // This keypair generation should be reperformed every so often in order to
        // obtain a new shared secret to avoid a long lived shared secret.

        // Alice encrypts a message to send to Bob
        String plaintext = "Hello, Bob!";

        // Add some relevant context about the encrypted data that should be verified
        // on decryption
        String metadata = "Sender: alicesmith@example.com";

        System.out.println("Secret being sent from Alice to Bob: " + plaintext);
        var cipherText = alice.encrypt(bobPublicKey, plaintext, metadata);
        System.out.println("Ciphertext being sent from Alice to Bob: " + Base64.getEncoder().encodeToString(cipherText));

        // Bob decrypts the message
        var decrypted = bob.decrypt(cipherText, metadata);
        System.out.println("Secret received by Bob from Alice: " + decrypted);
        System.out.println();

        // Bob encrypts a message to send to Alice
        String plaintext2 = "Hello, Alice!";

        // Add some relevant context about the encrypted data that should be verified
        // on decryption
        String metadata2 = "Sender: bobjones@example.com";

        System.out.println("Secret being sent from Bob to Alice: " + plaintext2);
        var cipherText2 = bob.encrypt(alicePublicKey, plaintext2, metadata2);
        System.out.println("Ciphertext being sent from Bob to Alice: " + Base64.getEncoder().encodeToString(cipherText2));

        // Bob decrypts the message
        var decrypted2 = alice.decrypt(cipherText2, metadata2);
        System.out.println("Secret received by Alice from Bob: " + decrypted2);
    }

    private static KeysetHandle getKeysetHandle(String filename) throws Exception
    {
        return TinkJsonProtoKeysetFormat.parseKeyset(
                new String(Files.readAllBytes( Paths.get(filename)), UTF_8), InsecureSecretKeyAccess.get());
    }
}
class HybridSimple {

    private KeysetHandle privateKey;
    private KeysetHandle publicKey;

    public HybridSimple(KeysetHandle privateKeyIn, KeysetHandle publicKeyIn) throws Exception {
        privateKey = privateKeyIn;
        publicKey = publicKeyIn;
    }

    public KeysetHandle getPublicKey() {
        return publicKey;
    }

    public byte[] encrypt(KeysetHandle partnerPublicKey, String message, String metadata) throws Exception {

        HybridEncrypt encryptor = partnerPublicKey.getPrimitive(HybridEncrypt.class);

        // return the encrypted value
        return encryptor.encrypt(message.getBytes(UTF_8), metadata.getBytes(UTF_8));
    }
    public String decrypt(byte[] ciphertext, String metadata) throws Exception {

        HybridDecrypt decryptor = privateKey.getPrimitive(HybridDecrypt.class);

        // return the encrypted value
        return new String(decryptor.decrypt(ciphertext, metadata.getBytes(UTF_8)),UTF_8);
    }

}
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

&lt;/details&gt;

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

</details>

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Asymmetric example using built-in JCA/JCE classes

If you absolutely cannot use a separate library, it is still possible to use the built JCA/JCE classes but it is strongly recommended to have a cryptography expert review the full design and code, as even the most trivial error can severely weaken your encryption.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 組み込み JCA/JCE クラスを使用した非対称暗号の例

別のライブラリをどうしても使用できない場合は、組み込みの JCA/JCE クラスを使用することも可能です。ただし、ごく些細な誤りでも暗号を深刻に弱体化させる可能性があるため、設計とコード全体を暗号専門家にレビューしてもらうことを強く推奨します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The following code snippet shows an example of using Elliptic Curve/Diffie Helman (ECDH) together with AES-GCM to perform encryption/decryption of data between two different sides without the need the transfer the symmetric key between the two sides. Instead, the sides exchange public keys and can then use ECDH to generate a shared secret which can be used for the symmetric encryption.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

次のコードスニペットは、Elliptic Curve/Diffie Helman (ECDH) と AES-GCM を組み合わせて、二者間で対称鍵を転送する必要なしにデータの暗号化/復号を実行する例を示しています。代わりに、双方が公開鍵を交換し、その後 ECDH を使用して対称暗号化に使用できる共有シークレットを生成できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Note that this code sample relies on the AesGcmSimple class from the [previous section](#symmetric-example-using-built-in-jcajce-classes).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

このコードサンプルは、[前のセクション](#組み込み-jcajce-クラスを使用した対称暗号の例) の AesGcmSimple クラスに依存していることに注意してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

A few constraints/pitfalls with this code:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

このコードには、いくつかの制約/落とし穴があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- It does not take into account key rotation or management which is a whole topic in itself.
- The code deliberately enforces a new nonce for every encryption operation but this must be managed as a separate data item alongside the ciphertext.
- The private keys will need to be stored securely.
- The code does not consider the validation of public keys before use.
- Overall, there is no verification of authenticity between the two sides.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- 鍵のローテーションや管理は、それ自体が大きなトピックですが、このコードでは考慮していません。
- このコードは暗号化操作ごとに新しい nonce を意図的に強制しますが、これは暗号文とともに別個のデータ項目として管理する必要があります。
- 秘密鍵は安全に保存する必要があります。
- このコードは、使用前の公開鍵の検証を考慮していません。
- 全体として、二者間の真正性検証はありません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

&lt;details&gt;
  &lt;summary&gt;Click here to view the "JCA/JCE hybrid encryption" code snippet.&lt;/summary&gt;

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

<details>
  <summary>「JCA/JCE hybrid encryption」コードスニペットを表示するにはここをクリックしてください。</summary>

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```java
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import javax.crypto.spec.*;
import javax.crypto.*;
import java.util.*;
import java.security.*;
import java.security.spec.*;
import java.util.Arrays;

// ECDHSimpleTest
class Main {
    public static void main(String[] args) throws Exception {

        // Generate ECC key pair for Alice
        var alice = new ECDHSimple();
        Key alicePublicKey = alice.getPublicKey();

        // Generate ECC key pair for Bob
        var bob = new ECDHSimple();
        Key bobPublicKey = bob.getPublicKey();

        // This keypair generation should be reperformed every so often in order to
        // obtain a new shared secret to avoid a long lived shared secret.

        // Alice encrypts a message to send to Bob
        String plaintext = "Hello"; //, Bob!";
        System.out.println("Secret being sent from Alice to Bob: " + plaintext);

        var retPair = alice.encrypt(bobPublicKey, plaintext);
        var nonce = retPair.getKey();
        var cipherText = retPair.getValue();

        System.out.println("Both cipherText and nonce being sent from Alice to Bob: " + Base64.getEncoder().encodeToString(cipherText) + " " + Base64.getEncoder().encodeToString(nonce));

        // Bob decrypts the message
        var decrypted = bob.decrypt(alicePublicKey, cipherText, nonce);
        System.out.println("Secret received by Bob from Alice: " + decrypted);
        System.out.println();

        // Bob encrypts a message to send to Alice
        String plaintext2 = "Hello"; //, Alice!";
        System.out.println("Secret being sent from Bob to Alice: " + plaintext2);

        var retPair2 = bob.encrypt(alicePublicKey, plaintext2);
        var nonce2 = retPair2.getKey();
        var cipherText2 = retPair2.getValue();
        System.out.println("Both cipherText2 and nonce2 being sent from Bob to Alice: " + Base64.getEncoder().encodeToString(cipherText2) + " " + Base64.getEncoder().encodeToString(nonce2));

        // Bob decrypts the message
        var decrypted2 = alice.decrypt(bobPublicKey, cipherText2, nonce2);
        System.out.println("Secret received by Alice from Bob: " + decrypted2);
    }
}
class ECDHSimple {
    private KeyPair keyPair;

    public class AesKeyNonce {
        public SecretKey Key;
        public byte[] Nonce;
    }

    public ECDHSimple() throws Exception {
        KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance("EC");
        ECGenParameterSpec ecSpec = new ECGenParameterSpec("secp256r1"); // Using secp256r1 curve
        keyPairGenerator.initialize(ecSpec);
        keyPair = keyPairGenerator.generateKeyPair();
    }

    public Key getPublicKey() {
        return keyPair.getPublic();
    }

    public AbstractMap.SimpleEntry<byte[], byte[]> encrypt(Key partnerPublicKey, String message) throws Exception {

        // Generate the AES Key and Nonce
        AesKeyNonce aesParams = generateAESParams(partnerPublicKey);

        // return the encrypted value
        return new AbstractMap.SimpleEntry<>(
            aesParams.Nonce,
            AesGcmSimple.encrypt(message, aesParams.Nonce, aesParams.Key)
            );
    }
    public String decrypt(Key partnerPublicKey, byte[] ciphertext, byte[] nonce) throws Exception {

        // Generate the AES Key and Nonce
        AesKeyNonce aesParams = generateAESParams(partnerPublicKey, nonce);

        // return the decrypted value
        return AesGcmSimple.decrypt(ciphertext, aesParams.Nonce, aesParams.Key);
    }

    private AesKeyNonce generateAESParams(Key partnerPublicKey, byte[] nonce) throws Exception {

        // Derive the secret based on this side's private key and the other side's public key
        KeyAgreement keyAgreement = KeyAgreement.getInstance("ECDH");
        keyAgreement.init(keyPair.getPrivate());
        keyAgreement.doPhase(partnerPublicKey, true);
        byte[] secret = keyAgreement.generateSecret();

        AesKeyNonce aesKeyNonce = new AesKeyNonce();

        // Copy first 32 bytes as the key
        byte[] key = Arrays.copyOfRange(secret, 0, (AesGcmSimple.KEY_SIZE / 8));
        aesKeyNonce.Key = new SecretKeySpec(key, 0, key.length, "AES");

        // Passed in nonce will be used.
        aesKeyNonce.Nonce = nonce;
        return aesKeyNonce;

    }

    private AesKeyNonce generateAESParams(Key partnerPublicKey) throws Exception {

        // Nonce of 12 bytes / 96 bits and this size should always be used.
        // It is critical for AES-GCM that a unique nonce is used for every cryptographic operation.
        // Therefore this is not generated from the shared secret
        byte[] nonce = new byte[AesGcmSimple.IV_LENGTH];
        SecureRandom random = new SecureRandom();
        random.nextBytes(nonce);
        return generateAESParams(partnerPublicKey, nonce);

    }
}
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

&lt;/details&gt;

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

</details>

</div>
</div>

</section>
</div>

## References

<div className="referenceFooter">

- [SQL Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)

- [SQLi and JPA](https://software-security.sans.org/developer-how-to/fix-sql-injection-in-java-persistence-api-jpa)

- [Command Injection](https://owasp.org/www-community/attacks/Command_Injection)

- [XPATH Injection](https://owasp.org/www-community/attacks/XPATH_Injection)

- [XSS](https://owasp.org/www-community/attacks/xss/)
- [OWASP Java HTML Sanitizer](https://github.com/owasp/java-html-sanitizer)
- [OWASP Java Encoder](https://github.com/owasp/owasp-java-encoder)
- [Java RegEx](https://docs.oracle.com/javase/8/docs/api/java/util/regex/Pattern.html)

- [Testing for NoSQL injection](https://owasp.org/www-project-web-security-testing-guide/stable/4-Web_Application_Security_Testing/07-Input_Validation_Testing/05.6-Testing_for_NoSQL_Injection.html)
- [SQL and NoSQL Injection](https://ckarande.gitbooks.io/owasp-nodegoat-tutorial/content/tutorial/a1_-_sql_and_nosql_injection.html)
- [No SQL, No Injection?](https://arxiv.org/ftp/arxiv/papers/1506/1506.04082.pdf)

- [Log4j Core Configuration File](https://logging.apache.org/log4j/2.x/manual/configuration.html)
- [Log4j JSON Template Layout](https://logging.apache.org/log4j/2.x/manual/json-template-layout.html)
- [Log4j Appenders](https://logging.apache.org/log4j/2.x/manual/appenders.html)
- [Logback Configuration File](https://logback.qos.ch/manual/configuration.html)
- [Logback JsonEncoder](https://logback.qos.ch/manual/encoders.html#JsonEncoder)
- [Logback Appenders](https://logback.qos.ch/manual/appenders.html)

</div>


## Attribution

<div className="attributionFooter">

- Original: Java Security Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Java_Security_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: English original retained for comparison. Japanese translation added. Bilingual display generated from official source and local Japanese translation.
- Retrieved: 2026-05-20

</div>
