---
title: JSON Web Token Cheat Sheet for Java
hide_title: true
---

<div className="docHero" data-category="asvs-v9">
  <h1>Java 向け JSON Web Token チートシート</h1>
  <div className="docMeta">
    <span className="docPill">最終更新: 2026-05-21</span>
    <span className="docPill">読了時間: 約 10 分</span>
    <span className="docPill">カテゴリ: セルフコンテインドトークン</span>
  </div>
</div>

<p className="docLead">JSON Web Token Cheat Sheet for Java を、原文・翻訳・対比表示で確認できます。Java で JWT を扱う際の署名検証、サイドジャッキング対策、失効、情報漏えい、トークン保存、シークレット強度を整理しています。</p>

<div className="tabbedContent">
  <input className="tabInput" type="radio" name="json-web-token-for-java-view" id="json-web-token-for-java-original" />
  <input className="tabInput" type="radio" name="json-web-token-for-java-view" id="json-web-token-for-java-translation" defaultChecked />
  <input className="tabInput" type="radio" name="json-web-token-for-java-view" id="json-web-token-for-java-bilingual" />

  <div className="contentTabs">
    <label htmlFor="json-web-token-for-java-original" title="OWASP 原文">原文</label>
    <label htmlFor="json-web-token-for-java-translation" title="日本語訳">翻訳</label>
    <label htmlFor="json-web-token-for-java-bilingual" title="原文と翻訳を並べて確認">対比表示</label>
  </div>

<section id="json-web-token-for-java-original-panel" className="tabPanel originalPanel contentPanel">

# JSON Web Token Cheat Sheet for Java

## Introduction

Many applications use **JSON Web Tokens** (JWT) to allow the client to indicate its identity for further exchange after authentication.

From [JWT.IO](https://jwt.io/introduction):

> JSON Web Token (JWT) is an open standard (RFC 7519) that defines a compact and self-contained way for securely transmitting information between parties as a JSON object. This information can be verified and trusted because it is digitally signed. JWTs can be signed using a secret (with the HMAC algorithm) or a public/private key pair using RSA.

JWTs are used to carry information related to the identity and characteristics (claims) of a client. This information is signed by the server to ensure it has not been tampered with after being sent to the client. This prevents an attacker from modifying the identity or characteristics — for example, changing the role from a simple user to an admin or altering the client's login.

The token is created during authentication (it is issued upon successful authentication) and is verified by the server before any processing. Applications use the token to allow a client to present what is essentially an "identity card" to the server. The server can then securely verify the token's validity and integrity. This approach is stateless and portable, meaning it works across different client and server technologies, and over various transport channels — although HTTP is the most commonly used.

## Token Structure

Token structure example taken from [JWT.IO](https://jwt.io/#debugger):

`[Base64(HEADER)].[Base64(PAYLOAD)].[Base64(SIGNATURE)]`

```text
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.
TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ
```

Chunk 1: **Header**

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

Chunk 2: **Payload**

```json
{
  "sub": "1234567890",
  "name": "John Doe",
  "admin": true
}
```

Chunk 3: **Signature**

```javascript
HMACSHA256( base64UrlEncode(header) + "." + base64UrlEncode(payload), KEY )
```

## Objective

This cheatsheet provides tips to prevent common security issues when using JSON Web Tokens (JWT) with Java.

The tips presented in this article are part of a Java project that was created to show the correct way to handle creation and validation of JSON Web Tokens.

You can find the Java project [here](https://github.com/righettod/poc-jwt), it uses the official [JWT library](https://jwt.io/#libraries).

In the rest of the article, the term **token** refers to the **JSON Web Tokens** (JWT).

## Consideration about Using JWT

Even if a JWT is "easy" to use and allow to expose services (mostly REST style) in a stateless way, it's not the solution that fits for all applications because it comes with some caveats, like for example the question of the storage of the token (tackled in this cheatsheet) and others...

If your application does not need to be fully stateless, you can consider using traditional session system provided by all web frameworks and follow the advice from the dedicated [session management cheat sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html). However, for stateless applications, when well implemented, it's a good candidate.

## Issues

### None Hashing Algorithm

#### Symptom

This attack, described [here](https://auth0.com/blog/critical-vulnerabilities-in-json-web-token-libraries/), occurs when an attacker alters the token and changes the hashing algorithm to indicate, through the *none* keyword, that the integrity of the token has already been verified. As explained in the link above *some libraries treated tokens signed with the none algorithm as a valid token with a verified signature*, so an attacker can alter the token claims and the modified token will still be trusted by the application.

#### How to Prevent

First, use a JWT library that is not exposed to this vulnerability.

Last, during token validation, explicitly request that the expected algorithm was used.

#### Implementation Example

``` java
// HMAC key - Block serialization and storage as String in JVM memory
private transient byte[] keyHMAC = ...;

...

//Create a verification context for the token requesting
//explicitly the use of the HMAC-256 hashing algorithm
JWTVerifier verifier = JWT.require(Algorithm.HMAC256(keyHMAC)).build();

//Verify the token, if the verification fail then a exception is thrown
DecodedJWT decodedToken = verifier.verify(token);
```

### Token Sidejacking

#### Symptom

This attack occurs when a token has been intercepted/stolen by an attacker and they use it to gain access to the system using targeted user identity.

#### How to Prevent

One way to prevent this is by adding a "user context" to the token. The user context should consist of the following:

- A random string generated during the authentication phase. This string is sent to the client as a hardened cookie (with the following flags: [HttpOnly + Secure](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#Secure_and_HttpOnly_cookies), [SameSite](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#SameSite_cookies), [Max-Age](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie), and [cookie prefixes](https://googlechrome.github.io/samples/cookie-prefixes/)). Avoid setting the *expires* header so the cookie is cleared when the browser is closed. Set *Max-Age* to a value equal to or less than the JWT's expiry time — never more.
- A SHA256 hash of the random string will be stored in the token (instead of the raw value) in order to prevent any XSS issues allowing the attacker to read the random string value and setting the expected cookie.

Avoid using IP addresses as part of the context. IP addresses can change during a single session due to legitimate reasons — for example, when a user accesses the application on a mobile device and switches network providers. Additionally, IP tracking can raise concerns related to [GDPR compliance](https://gdpr.eu/) in the EU.

During token validation, if the received token does not contain the correct context (e.g., if it is being replayed by an attacker), it must be rejected.

#### Implementation example

Code to create the token after successful authentication.

``` java
// HMAC key - Block serialization and storage as String in JVM memory
private transient byte[] keyHMAC = ...;
// Random data generator
private SecureRandom secureRandom = new SecureRandom();

...

//Generate a random string that will constitute the fingerprint for this user
byte[] randomFgp = new byte[50];
secureRandom.nextBytes(randomFgp);
String userFingerprint = DatatypeConverter.printHexBinary(randomFgp);

//Add the fingerprint in a hardened cookie - Add cookie manually because
//SameSite attribute is not supported by javax.servlet.http.Cookie class
String fingerprintCookie = "__Secure-Fgp=" + userFingerprint
                           + "; SameSite=Strict; HttpOnly; Secure";
response.addHeader("Set-Cookie", fingerprintCookie);

//Compute a SHA256 hash of the fingerprint in order to store the
//fingerprint hash (instead of the raw value) in the token
//to prevent an XSS to be able to read the fingerprint and
//set the expected cookie itself
MessageDigest digest = MessageDigest.getInstance("SHA-256");
byte[] userFingerprintDigest = digest.digest(userFingerprint.getBytes("utf-8"));
String userFingerprintHash = DatatypeConverter.printHexBinary(userFingerprintDigest);

//Create the token with a validity of 15 minutes and client context (fingerprint) information
Calendar c = Calendar.getInstance();
Date now = c.getTime();
c.add(Calendar.MINUTE, 15);
Date expirationDate = c.getTime();
Map<String, Object> headerClaims = new HashMap<>();
headerClaims.put("typ", "JWT");
String token = JWT.create().withSubject(login)
   .withExpiresAt(expirationDate)
   .withIssuer(this.issuerID)
   .withIssuedAt(now)
   .withNotBefore(now)
   .withClaim("userFingerprint", userFingerprintHash)
   .withHeader(headerClaims)
   .sign(Algorithm.HMAC256(this.keyHMAC));
```

Code to validate the token.

``` java
// HMAC key - Block serialization and storage as String in JVM memory
private transient byte[] keyHMAC = ...;

...

//Retrieve the user fingerprint from the dedicated cookie
String userFingerprint = null;
if (request.getCookies() != null && request.getCookies().length > 0) {
 List<Cookie> cookies = Arrays.stream(request.getCookies()).collect(Collectors.toList());
 Optional<Cookie> cookie = cookies.stream().filter(c -> "__Secure-Fgp"
                                            .equals(c.getName())).findFirst();
 if (cookie.isPresent()) {
   userFingerprint = cookie.get().getValue();
 }
}

//Compute a SHA256 hash of the received fingerprint in cookie in order to compare
//it to the fingerprint hash stored in the token
MessageDigest digest = MessageDigest.getInstance("SHA-256");
byte[] userFingerprintDigest = digest.digest(userFingerprint.getBytes("utf-8"));
String userFingerprintHash = DatatypeConverter.printHexBinary(userFingerprintDigest);

//Create a verification context for the token
JWTVerifier verifier = JWT.require(Algorithm.HMAC256(keyHMAC))
                              .withIssuer(issuerID)
                              .withClaim("userFingerprint", userFingerprintHash)
                              .build();

//Verify the token, if the verification fail then an exception is thrown
DecodedJWT decodedToken = verifier.verify(token);
```

### No Built-In Token Revocation by the User

#### Symptom

This problem is inherent to JWT because a token only becomes invalid when it expires. The user has no built-in feature to explicitly revoke the validity of a token. This means that if it is stolen, a user cannot revoke the token itself thereby blocking the attacker.

#### How to Prevent

Since JWTs are stateless, There is no session maintained on the server(s) serving client requests. As such, there is no session to invalidate on the server side. A well implemented Token Sidejacking solution (as explained above) should alleviate the need for maintaining denylist on server side. This is because a hardened cookie used in the Token Sidejacking can be considered as secure as a session ID used in the traditional session system, and unless both the cookie and the JWT are intercepted/stolen, the JWT is unusable. A logout can thus be 'simulated' by clearing the JWT from session storage. If the user chooses to close the browser instead, then both the cookie and sessionStorage are cleared automatically.

Another way to protect against this is to implement a token denylist that will be used to mimic the "logout" feature that exists with traditional session management system.

The denylist will keep a digest (SHA-256 encoded in HEX) of the token with a revocation date. This entry must endure at least until the expiration of the token.

When the user wants to "logout" then it call a dedicated service that will add the provided user token to the denylist resulting in an immediate invalidation of the token for further usage in the application.

#### Implementation Example

##### Block List Storage

A database table with the following structure will be used as the central denylist storage.

``` sql
create table if not exists revoked_token(jwt_token_digest varchar(255) primary key,
revocation_date timestamp default now());
```

##### Token Revocation Management

Code in charge of adding a token to the denylist and checking if a token is revoked.

``` java
/**
* Handle the revocation of the token (logout).
* Use a DB in order to allow multiple instances to check for revoked token
* and allow cleanup at centralized DB level.
*/
public class TokenRevoker {

 /** DB Connection */
 @Resource("jdbc/storeDS")
 private DataSource storeDS;

 /**
  * Verify if a digest encoded in HEX of the ciphered token is present
  * in the revocation table
  *
  * @param jwtInHex Token encoded in HEX
  * @return Presence flag
  * @throws Exception If any issue occur during communication with DB
  */
 public boolean isTokenRevoked(String jwtInHex) throws Exception {
     boolean tokenIsPresent = false;
     if (jwtInHex != null && !jwtInHex.trim().isEmpty()) {
         //Decode the ciphered token
         byte[] cipheredToken = DatatypeConverter.parseHexBinary(jwtInHex);

         //Compute a SHA256 of the ciphered token
         MessageDigest digest = MessageDigest.getInstance("SHA-256");
         byte[] cipheredTokenDigest = digest.digest(cipheredToken);
         String jwtTokenDigestInHex = DatatypeConverter.printHexBinary(cipheredTokenDigest);

         //Search token digest in HEX in DB
         try (Connection con = this.storeDS.getConnection()) {
             String query = "select jwt_token_digest from revoked_token where jwt_token_digest = ?";
             try (PreparedStatement pStatement = con.prepareStatement(query)) {
                 pStatement.setString(1, jwtTokenDigestInHex);
                 try (ResultSet rSet = pStatement.executeQuery()) {
                     tokenIsPresent = rSet.next();
                 }
             }
         }
     }

     return tokenIsPresent;
 }


 /**
  * Add a digest encoded in HEX of the ciphered token to the revocation token table
  *
  * @param jwtInHex Token encoded in HEX
  * @throws Exception If any issue occur during communication with DB
  */
 public void revokeToken(String jwtInHex) throws Exception {
     if (jwtInHex != null && !jwtInHex.trim().isEmpty()) {
         //Decode the ciphered token
         byte[] cipheredToken = DatatypeConverter.parseHexBinary(jwtInHex);

         //Compute a SHA256 of the ciphered token
         MessageDigest digest = MessageDigest.getInstance("SHA-256");
         byte[] cipheredTokenDigest = digest.digest(cipheredToken);
         String jwtTokenDigestInHex = DatatypeConverter.printHexBinary(cipheredTokenDigest);

         //Check if the token digest in HEX is already in the DB and add it if it is absent
         if (!this.isTokenRevoked(jwtInHex)) {
             try (Connection con = this.storeDS.getConnection()) {
                 String query = "insert into revoked_token(jwt_token_digest) values(?)";
                 int insertedRecordCount;
                 try (PreparedStatement pStatement = con.prepareStatement(query)) {
                     pStatement.setString(1, jwtTokenDigestInHex);
                     insertedRecordCount = pStatement.executeUpdate();
                 }
                 if (insertedRecordCount != 1) {
                     throw new IllegalStateException("Number of inserted record is invalid," +
                     " 1 expected but is " + insertedRecordCount);
                 }
             }
         }

     }
 }
```

### Token Information Disclosure

#### Symptom

This attack occurs when an attacker has access to a token (or a set of tokens) and extracts information stored in it (the contents of JWTs are base64 encoded, but is not encrypted by default) in order to obtain information about the system. Information can be for example the security roles, login format...

#### How to Prevent

A way to protect against this attack is to cipher the token using, for example, a symmetric algorithm.

It's also important to protect the ciphered data against attack like [Padding Oracle](https://owasp.org/www-project-web-security-testing-guide/stable/4-Web_Application_Security_Testing/09-Testing_for_Weak_Cryptography/02-Testing_for_Padding_Oracle.html) or any other attack using cryptanalysis.

In order to achieve all these goals, the *AES-[GCM](https://en.wikipedia.org/wiki/Galois/Counter_Mode)* algorithm is used which provides *Authenticated Encryption with Associated Data*.

More details from [here](https://github.com/google/tink/blob/master/docs/PRIMITIVES.md#deterministic-authenticated-encryption-with-associated-data):

```text
AEAD primitive (Authenticated Encryption with Associated Data) provides functionality of symmetric
authenticated encryption.

Implementations of this primitive are secure against adaptive chosen ciphertext attacks.

When encrypting a plaintext one can optionally provide associated data that should be authenticated
but not encrypted.

That is, the encryption with associated data ensures authenticity (ie. who the sender is) and
integrity (ie. data has not been tampered with) of that data, but not its secrecy.

See RFC5116: https://tools.ietf.org/html/rfc5116
```

**Note:**

Here ciphering is added mainly to hide internal information but it's very important to remember that the first protection against tampering of the JWT is the signature. So, the token signature and its verification must be always in place.

#### Implementation Example

##### Token Ciphering

Code in charge of managing the ciphering. [Google Tink](https://github.com/google/tink) dedicated crypto library is used to handle ciphering operations in order to use built-in best practices provided by this library.

``` java
/**
 * Handle ciphering and deciphering of the token using AES-GCM.
 *
 * @see "https://github.com/google/tink/blob/master/docs/JAVA-HOWTO.md"
 */
public class TokenCipher {

    /**
     * Constructor - Register AEAD configuration
     *
     * @throws Exception If any issue occur during AEAD configuration registration
     */
    public TokenCipher() throws Exception {
        AeadConfig.register();
    }

    /**
     * Cipher a JWT
     *
     * @param jwt          Token to cipher
     * @param keysetHandle Pointer to the keyset handle
     * @return The ciphered version of the token encoded in HEX
     * @throws Exception If any issue occur during token ciphering operation
     */
    public String cipherToken(String jwt, KeysetHandle keysetHandle) throws Exception {
        //Verify parameters
        if (jwt == null || jwt.isEmpty() || keysetHandle == null) {
            throw new IllegalArgumentException("Both parameters must be specified!");
        }

        //Get the primitive
        Aead aead = AeadFactory.getPrimitive(keysetHandle);

        //Cipher the token
        byte[] cipheredToken = aead.encrypt(jwt.getBytes(), null);

        return DatatypeConverter.printHexBinary(cipheredToken);
    }

    /**
     * Decipher a JWT
     *
     * @param jwtInHex     Token to decipher encoded in HEX
     * @param keysetHandle Pointer to the keyset handle
     * @return The token in clear text
     * @throws Exception If any issue occur during token deciphering operation
     */
    public String decipherToken(String jwtInHex, KeysetHandle keysetHandle) throws Exception {
        //Verify parameters
        if (jwtInHex == null || jwtInHex.isEmpty() || keysetHandle == null) {
            throw new IllegalArgumentException("Both parameters must be specified !");
        }

        //Decode the ciphered token
        byte[] cipheredToken = DatatypeConverter.parseHexBinary(jwtInHex);

        //Get the primitive
        Aead aead = AeadFactory.getPrimitive(keysetHandle);

        //Decipher the token
        byte[] decipheredToken = aead.decrypt(cipheredToken, null);

        return new String(decipheredToken);
    }
}
```

##### Creation / Validation of the Token

Use the token ciphering handler during the creation and the validation of the token.

Load keys (ciphering key was generated and stored using [Google Tink](https://github.com/google/tink/blob/master/docs/JAVA-HOWTO.md#generating-new-keysets)) and setup cipher.

``` java
//Load keys from configuration text/json files in order to avoid to storing keys as a String in JVM memory
private transient byte[] keyHMAC = Files.readAllBytes(Paths.get("src", "main", "conf", "key-hmac.txt"));
private transient KeysetHandle keyCiphering = CleartextKeysetHandle.read(JsonKeysetReader.withFile(
Paths.get("src", "main", "conf", "key-ciphering.json").toFile()));

...

//Init token ciphering handler
TokenCipher tokenCipher = new TokenCipher();
```

Token creation.

``` java
//Generate the JWT token using the JWT API...
//Cipher the token (String JSON representation)
String cipheredToken = tokenCipher.cipherToken(token, this.keyCiphering);
//Send the ciphered token encoded in HEX to the client in HTTP response...
```

Token validation.

``` java
//Retrieve the ciphered token encoded in HEX from the HTTP request...
//Decipher the token
String token = tokenCipher.decipherToken(cipheredToken, this.keyCiphering);
//Verify the token using the JWT API...
//Verify access...
```

### Token Storage on Client Side

#### Symptom

This occurs when an application stores the token in a manner exhibiting the following behavior:

- Automatically sent by the browser (*Cookie* storage).
- Retrieved even if the browser is restarted (Use of browser *localStorage* container).
- Retrieved in case of [XSS](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html) issue (Cookie accessible to JavaScript code or Token stored in browser local/session storage).

#### How to Prevent

1. Store the token using the browser *sessionStorage* container, or use JavaScript *closures* with *private* variables
1. Add it as a *Bearer* HTTP `Authentication` header with JavaScript when calling services.
1. Add [fingerprint](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html#token-sidejacking) information to the token.

By storing the token in browser *sessionStorage* container it exposes the token to being stolen through an XSS attack. However, fingerprints added to the token prevent reuse of the stolen token by the attacker on their machine. To close a maximum of exploitation surfaces for an attacker, add a browser [Content Security Policy](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html) to harden the execution context.

But, we know that *sessionStorage* is not always practical due to its per-tab scope, and the storage method for tokens should balance *security* and *usability*.

*LocalStorage* is a better method than *sessionStorage* for usability because it allows the session to persist between browser restarts and across tabs, but you must use strict security controls:

- Tokens stored in *localStorage* should have *short expiration times* (e.g., *15-30 minutes idle timeout, 8-hour absolute timeout*).
- Implement mechanisms such as *token rotation* and *refresh tokens* to minimize risk.

If *session persistence across tabs* and *sessionStorage* are required, consider using *BroadcastChannel API* or *Single Sign-On (SSO)* to re-authenticate users automatically when they open new tabs.

An alternative to storing token in browser *sessionStorage* or in *localStorage* is to use JavaScript private variable or Closures. In this, access to all web requests are routed through a JavaScript module that encapsulates the token in a private variable which can not be accessed other than from within the module.

*Note:*

- The remaining case is when an attacker uses the user's browsing context as a proxy to use the target application through the legitimate user but the Content Security Policy can prevent communication with non expected domains.
- It's also possible to implement the authentication service in a way that the token is issued within a hardened cookie, but in this case, protection against a [Cross-Site Request Forgery](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html) attack must be implemented.

#### Implementation Example

JavaScript code to store the token after authentication.

``` javascript
/* Handle request for JWT token and local storage*/
function authenticate() {
    const login = $("#login").val();
    const postData = "login=" + encodeURIComponent(login) + "&password=test";

    $.post("/services/authenticate", postData, function (data) {
        if (data.status == "Authentication successful!") {
            ...
            sessionStorage.setItem("token", data.token);
        }
        else {
            ...
            sessionStorage.removeItem("token");
        }
    })
    .fail(function (jqXHR, textStatus, error) {
        ...
        sessionStorage.removeItem("token");
    });
}
```

JavaScript code to add the token as a *Bearer* HTTP Authentication header when calling a service, for example a service to validate token here.

``` javascript
/* Handle request for JWT token validation */
function validateToken() {
    var token = sessionStorage.getItem("token");

    if (token == undefined || token == "") {
        $("#infoZone").removeClass();
        $("#infoZone").addClass("alert alert-warning");
        $("#infoZone").text("Obtain a JWT token first :)");
        return;
    }

    $.ajax({
        url: "/services/validate",
        type: "POST",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "bearer " + token);
        },
        success: function (data) {
            ...
        },
        error: function (jqXHR, textStatus, error) {
            ...
        },
    });
}
```

JavaScript code to implement closures with private variables:

``` javascript
function myFetchModule() {
    // Protect the original 'fetch' from getting overwritten via XSS
    const fetch = window.fetch;

    const authOrigins = ["https://yourorigin", "http://localhost"];
    let token = '';

    this.setToken = (value) => {
        token = value
    }

    this.fetch = (resource, options) => {
        let req = new Request(resource, options);
        destOrigin = new URL(req.url).origin;
        if (token && authOrigins.includes(destOrigin)) {
            req.headers.set('Authorization', token);
        }
        return fetch(req)
    }
}

...

// usage:
const myFetch = new myFetchModule()

function login() {
  fetch("/api/login")
      .then((res) => {
          if (res.status == 200) {
              return res.json()
          } else {
              throw Error(res.statusText)
          }
      })
      .then(data => {
          myFetch.setToken(data.token)
          console.log("Token received and stored.")
      })
      .catch(console.error)
}

...

// after login, subsequent api calls:
function makeRequest() {
    myFetch.fetch("/api/hello", {headers: {"MyHeader": "foobar"}})
        .then((res) => {
            if (res.status == 200) {
                return res.text()
            } else {
                throw Error(res.statusText)
            }
        }).then(responseText => console.log("helloResponse", responseText))
        .catch(console.error)
}
```

### Weak Token Secret

#### Symptom

When the token is protected using an HMAC based algorithm, the security of the token is entirely dependent on the strength of the secret used with the HMAC. If an attacker can obtain a valid JWT, they can then carry out an offline attack and attempt to crack the secret using tools such as [John the Ripper](https://github.com/magnumripper/JohnTheRipper) or [Hashcat](https://github.com/hashcat/hashcat).

If they are successful, they would then be able to modify the token and re-sign it with the key they had obtained. This could let them escalate their privileges, compromise other users' accounts, or perform other actions depending on the contents of the JWT.

There are a number of [guides](https://www.notsosecure.com/crafting-way-json-web-tokens/) that document this process in greater detail.

#### How to Prevent

The simplest way to prevent this attack is to ensure that the secret used to sign the JWTs is strong and unique, in order to make it harder for an attacker to crack. As this secret would never need to be typed by a human, it should be at least 64 characters, and generated using a [secure source of randomness](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html#secure-random-number-generation).

Alternatively, consider the use of tokens that are signed with RSA rather than using an HMAC and secret key.

#### Further Reading

- [`{JWT}.{Attack}.Playbook`](https://github.com/ticarpi/jwt_tool/wiki) - A project documents the known attacks and potential security vulnerabilities and misconfigurations of JSON Web Tokens.
- [JWT Best Practices Internet Draft](https://datatracker.ietf.org/doc/draft-ietf-oauth-jwt-bcp/)

</section>

<section id="json-web-token-for-java-translation-panel" className="tabPanel translationPanel contentPanel">

# Java 向け JSON Web Token チートシート

## はじめに

多くのアプリケーションでは、認証後の以降のやり取りでクライアントが自身のアイデンティティを示せるようにするため、**JSON Web Token** (JWT) を使用します。

[JWT.IO](https://jwt.io/introduction) より:

> JSON Web Token (JWT) is an open standard (RFC 7519) that defines a compact and self-contained way for securely transmitting information between parties as a JSON object. This information can be verified and trusted because it is digitally signed. JWTs can be signed using a secret (with the HMAC algorithm) or a public/private key pair using RSA.

JWT は、クライアントのアイデンティティや特性 (クレーム) に関連する情報を運ぶために使用されます。この情報は、クライアントへ送信された後に改ざんされていないことを保証するため、サーバによって署名されます。これにより、攻撃者がアイデンティティや特性を変更すること、たとえばロールを一般ユーザーから管理者へ変更したり、クライアントのログイン名を変更したりすることを防ぎます。

トークンは認証時、つまり認証成功時に作成され、処理を行う前にサーバによって検証されます。アプリケーションは、クライアントがサーバへ「身分証明書」のようなものを提示できるようにするためにトークンを使用します。サーバはその後、トークンの有効性と完全性を安全に検証できます。この方式はステートレスかつポータブルです。つまり、さまざまなクライアント技術やサーバ技術、さまざまな転送チャネルで機能します。ただし、最も一般的に使用されるのは HTTP です。

## トークン構造

トークン構造の例は [JWT.IO](https://jwt.io/#debugger) から引用しています。

`[Base64(HEADER)].[Base64(PAYLOAD)].[Base64(SIGNATURE)]`

```text
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.
TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ
```

チャンク 1: **ヘッダー**

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

チャンク 2: **ペイロード**

```json
{
  "sub": "1234567890",
  "name": "John Doe",
  "admin": true
}
```

チャンク 3: **署名**

```javascript
HMACSHA256( base64UrlEncode(header) + "." + base64UrlEncode(payload), KEY )
```

## 目的

このチートシートは、Java で JSON Web Token (JWT) を使用するときの一般的なセキュリティ問題を防ぐためのヒントを提供します。

この記事で示すヒントは、JSON Web Token の作成と検証を正しく扱う方法を示すために作成された Java プロジェクトの一部です。

Java プロジェクトは[こちら](https://github.com/righettod/poc-jwt)にあります。このプロジェクトは公式の [JWT ライブラリ](https://jwt.io/#libraries)を使用しています。

この記事の残りの部分では、**トークン**という用語は **JSON Web Token** (JWT) を指します。

## JWT 使用に関する考慮事項

JWT は「簡単」に使用でき、サービス (主に REST スタイル) をステートレスに公開できますが、すべてのアプリケーションに適した解決策ではありません。たとえばトークンの保存方法 (このチートシートで扱います) など、いくつかの注意点があるためです。

アプリケーションが完全にステートレスである必要がない場合は、すべての Web フレームワークが提供する従来のセッションシステムを使用し、専用の[セッション管理チートシート](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)の助言に従うことを検討できます。ただし、ステートレスアプリケーションでは、適切に実装されていれば JWT は有力な候補です。

## 問題

### None ハッシュアルゴリズム

#### 症状

この攻撃は[こちら](https://auth0.com/blog/critical-vulnerabilities-in-json-web-token-libraries/)で説明されています。攻撃者がトークンを改変し、ハッシュアルゴリズムを変更して、*none* キーワードによりトークンの完全性がすでに検証済みであることを示す場合に発生します。上記リンクで説明されているように、*一部のライブラリは none アルゴリズムで署名されたトークンを、署名検証済みの有効なトークンとして扱っていました*。そのため攻撃者はトークンのクレームを改変でき、改変されたトークンがアプリケーションに信頼され続けます。

#### 防止方法

まず、この脆弱性にさらされていない JWT ライブラリを使用します。

最後に、トークン検証時に、期待されるアルゴリズムが使用されたことを明示的に要求します。

#### 実装例

``` java
// HMAC key - Block serialization and storage as String in JVM memory
private transient byte[] keyHMAC = ...;

...

//Create a verification context for the token requesting
//explicitly the use of the HMAC-256 hashing algorithm
JWTVerifier verifier = JWT.require(Algorithm.HMAC256(keyHMAC)).build();

//Verify the token, if the verification fail then a exception is thrown
DecodedJWT decodedToken = verifier.verify(token);
```

### トークンのサイドジャッキング

#### 症状

この攻撃は、攻撃者がトークンを傍受または窃取し、対象ユーザーのアイデンティティを使ってシステムへアクセスするときに発生します。

#### 防止方法

これを防ぐ一つの方法は、トークンに「ユーザーコンテキスト」を追加することです。ユーザーコンテキストは次で構成するべきです。

- 認証フェーズで生成されるランダム文字列。この文字列は、強化された Cookie としてクライアントへ送信します。Cookie には [HttpOnly + Secure](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#Secure_and_HttpOnly_cookies)、[SameSite](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#SameSite_cookies)、[Max-Age](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie)、[cookie prefixes](https://googlechrome.github.io/samples/cookie-prefixes/) のフラグを付与します。ブラウザを閉じたときに Cookie が削除されるよう、*expires* ヘッダーの設定は避けます。*Max-Age* は JWT の有効期限以下の値に設定し、決して JWT より長くしてはいけません。
- ランダム文字列の SHA256 ハッシュを、生の値の代わりにトークンへ保存します。これにより、攻撃者が XSS の問題を悪用してランダム文字列の値を読み取り、期待される Cookie を設定することを防ぎます。

コンテキストの一部として IP アドレスを使用することは避けます。IP アドレスは、正当な理由で単一セッション中に変化することがあります。たとえば、ユーザーがモバイルデバイスでアプリケーションへアクセスし、ネットワークプロバイダを切り替える場合です。さらに、IP 追跡は EU における [GDPR compliance](https://gdpr.eu/) に関連する懸念を生じさせる可能性があります。

トークン検証時に、受信したトークンが正しいコンテキストを含まない場合、たとえば攻撃者によって再利用されている場合は、拒否しなければなりません。

#### 実装例

認証成功後にトークンを作成するコードです。

``` java
// HMAC key - Block serialization and storage as String in JVM memory
private transient byte[] keyHMAC = ...;
// Random data generator
private SecureRandom secureRandom = new SecureRandom();

...

//Generate a random string that will constitute the fingerprint for this user
byte[] randomFgp = new byte[50];
secureRandom.nextBytes(randomFgp);
String userFingerprint = DatatypeConverter.printHexBinary(randomFgp);

//Add the fingerprint in a hardened cookie - Add cookie manually because
//SameSite attribute is not supported by javax.servlet.http.Cookie class
String fingerprintCookie = "__Secure-Fgp=" + userFingerprint
                           + "; SameSite=Strict; HttpOnly; Secure";
response.addHeader("Set-Cookie", fingerprintCookie);

//Compute a SHA256 hash of the fingerprint in order to store the
//fingerprint hash (instead of the raw value) in the token
//to prevent an XSS to be able to read the fingerprint and
//set the expected cookie itself
MessageDigest digest = MessageDigest.getInstance("SHA-256");
byte[] userFingerprintDigest = digest.digest(userFingerprint.getBytes("utf-8"));
String userFingerprintHash = DatatypeConverter.printHexBinary(userFingerprintDigest);

//Create the token with a validity of 15 minutes and client context (fingerprint) information
Calendar c = Calendar.getInstance();
Date now = c.getTime();
c.add(Calendar.MINUTE, 15);
Date expirationDate = c.getTime();
Map<String, Object> headerClaims = new HashMap<>();
headerClaims.put("typ", "JWT");
String token = JWT.create().withSubject(login)
   .withExpiresAt(expirationDate)
   .withIssuer(this.issuerID)
   .withIssuedAt(now)
   .withNotBefore(now)
   .withClaim("userFingerprint", userFingerprintHash)
   .withHeader(headerClaims)
   .sign(Algorithm.HMAC256(this.keyHMAC));
```

トークンを検証するコードです。

``` java
// HMAC key - Block serialization and storage as String in JVM memory
private transient byte[] keyHMAC = ...;

...

//Retrieve the user fingerprint from the dedicated cookie
String userFingerprint = null;
if (request.getCookies() != null && request.getCookies().length > 0) {
 List<Cookie> cookies = Arrays.stream(request.getCookies()).collect(Collectors.toList());
 Optional<Cookie> cookie = cookies.stream().filter(c -> "__Secure-Fgp"
                                            .equals(c.getName())).findFirst();
 if (cookie.isPresent()) {
   userFingerprint = cookie.get().getValue();
 }
}

//Compute a SHA256 hash of the received fingerprint in cookie in order to compare
//it to the fingerprint hash stored in the token
MessageDigest digest = MessageDigest.getInstance("SHA-256");
byte[] userFingerprintDigest = digest.digest(userFingerprint.getBytes("utf-8"));
String userFingerprintHash = DatatypeConverter.printHexBinary(userFingerprintDigest);

//Create a verification context for the token
JWTVerifier verifier = JWT.require(Algorithm.HMAC256(keyHMAC))
                              .withIssuer(issuerID)
                              .withClaim("userFingerprint", userFingerprintHash)
                              .build();

//Verify the token, if the verification fail then an exception is thrown
DecodedJWT decodedToken = verifier.verify(token);
```

### ユーザーによるトークン失効機能が組み込まれていない

#### 症状

この問題は JWT に固有のものです。トークンは期限切れになるまで無効にならないためです。ユーザーには、トークンの有効性を明示的に取り消す組み込み機能がありません。つまりトークンが窃取された場合、ユーザーはトークン自体を失効させて攻撃者をブロックできません。

#### 防止方法

JWT はステートレスであるため、クライアント要求を処理するサーバ側にはセッションが維持されません。そのため、サーバ側で無効化するセッションはありません。上記で説明した、適切に実装されたトークンのサイドジャッキング対策は、サーバ側で denylist を維持する必要性を軽減するはずです。これは、トークンのサイドジャッキング対策で使用する強化された Cookie は、従来のセッションシステムで使用されるセッション ID と同程度に安全と考えられ、Cookie と JWT の両方が傍受または窃取されない限り JWT は使用できないためです。したがって、session storage から JWT を削除することで「ログアウト」を模擬できます。ユーザーが代わりにブラウザを閉じることを選んだ場合、Cookie と sessionStorage の両方が自動的に削除されます。

これに対する別の保護方法は、従来のセッション管理システムに存在する「ログアウト」機能を模倣するために使用するトークン denylist を実装することです。

denylist は、トークンのダイジェスト (SHA-256 を HEX でエンコードしたもの) と失効日を保持します。このエントリは、少なくともトークンの有効期限まで保持されなければなりません。

ユーザーが「ログアウト」したい場合、専用サービスを呼び出して、提供されたユーザートークンを denylist に追加します。その結果、そのトークンはアプリケーションでの以降の使用に対して即時に無効化されます。

#### 実装例

##### ブロックリストストレージ

中央の denylist ストレージとして、次の構造を持つデータベーステーブルを使用します。

``` sql
create table if not exists revoked_token(jwt_token_digest varchar(255) primary key,
revocation_date timestamp default now());
```

##### トークン失効管理

トークンを denylist に追加し、トークンが失効済みかどうかを確認するコードです。

``` java
/**
* Handle the revocation of the token (logout).
* Use a DB in order to allow multiple instances to check for revoked token
* and allow cleanup at centralized DB level.
*/
public class TokenRevoker {

 /** DB Connection */
 @Resource("jdbc/storeDS")
 private DataSource storeDS;

 /**
  * Verify if a digest encoded in HEX of the ciphered token is present
  * in the revocation table
  *
  * @param jwtInHex Token encoded in HEX
  * @return Presence flag
  * @throws Exception If any issue occur during communication with DB
  */
 public boolean isTokenRevoked(String jwtInHex) throws Exception {
     boolean tokenIsPresent = false;
     if (jwtInHex != null && !jwtInHex.trim().isEmpty()) {
         //Decode the ciphered token
         byte[] cipheredToken = DatatypeConverter.parseHexBinary(jwtInHex);

         //Compute a SHA256 of the ciphered token
         MessageDigest digest = MessageDigest.getInstance("SHA-256");
         byte[] cipheredTokenDigest = digest.digest(cipheredToken);
         String jwtTokenDigestInHex = DatatypeConverter.printHexBinary(cipheredTokenDigest);

         //Search token digest in HEX in DB
         try (Connection con = this.storeDS.getConnection()) {
             String query = "select jwt_token_digest from revoked_token where jwt_token_digest = ?";
             try (PreparedStatement pStatement = con.prepareStatement(query)) {
                 pStatement.setString(1, jwtTokenDigestInHex);
                 try (ResultSet rSet = pStatement.executeQuery()) {
                     tokenIsPresent = rSet.next();
                 }
             }
         }
     }

     return tokenIsPresent;
 }


 /**
  * Add a digest encoded in HEX of the ciphered token to the revocation token table
  *
  * @param jwtInHex Token encoded in HEX
  * @throws Exception If any issue occur during communication with DB
  */
 public void revokeToken(String jwtInHex) throws Exception {
     if (jwtInHex != null && !jwtInHex.trim().isEmpty()) {
         //Decode the ciphered token
         byte[] cipheredToken = DatatypeConverter.parseHexBinary(jwtInHex);

         //Compute a SHA256 of the ciphered token
         MessageDigest digest = MessageDigest.getInstance("SHA-256");
         byte[] cipheredTokenDigest = digest.digest(cipheredToken);
         String jwtTokenDigestInHex = DatatypeConverter.printHexBinary(cipheredTokenDigest);

         //Check if the token digest in HEX is already in the DB and add it if it is absent
         if (!this.isTokenRevoked(jwtInHex)) {
             try (Connection con = this.storeDS.getConnection()) {
                 String query = "insert into revoked_token(jwt_token_digest) values(?)";
                 int insertedRecordCount;
                 try (PreparedStatement pStatement = con.prepareStatement(query)) {
                     pStatement.setString(1, jwtTokenDigestInHex);
                     insertedRecordCount = pStatement.executeUpdate();
                 }
                 if (insertedRecordCount != 1) {
                     throw new IllegalStateException("Number of inserted record is invalid," +
                     " 1 expected but is " + insertedRecordCount);
                 }
             }
         }

     }
 }
```

### トークン情報の漏えい

#### 症状

この攻撃は、攻撃者がトークン (または一連のトークン) にアクセスし、そこに保存された情報を抽出する場合に発生します。JWT の内容は base64 エンコードされていますが、デフォルトでは暗号化されていません。攻撃者はこれにより、システムに関する情報を取得します。情報には、たとえばセキュリティロールやログイン形式などがあります。

#### 防止方法

この攻撃から保護する方法の一つは、たとえば対称アルゴリズムを使用してトークンを暗号化することです。

暗号化されたデータを [Padding Oracle](https://owasp.org/www-project-web-security-testing-guide/stable/4-Web_Application_Security_Testing/09-Testing_for_Weak_Cryptography/02-Testing_for_Padding_Oracle.html) のような攻撃や、暗号解読を使うその他の攻撃から保護することも重要です。

これらすべての目的を達成するために、*Authenticated Encryption with Associated Data* を提供する *AES-[GCM](https://en.wikipedia.org/wiki/Galois/Counter_Mode)* アルゴリズムを使用します。

詳細は[こちら](https://github.com/google/tink/blob/master/docs/PRIMITIVES.md#deterministic-authenticated-encryption-with-associated-data)から引用します。

```text
AEAD primitive (Authenticated Encryption with Associated Data) provides functionality of symmetric
authenticated encryption.

Implementations of this primitive are secure against adaptive chosen ciphertext attacks.

When encrypting a plaintext one can optionally provide associated data that should be authenticated
but not encrypted.

That is, the encryption with associated data ensures authenticity (ie. who the sender is) and
integrity (ie. data has not been tampered with) of that data, but not its secrecy.

See RFC5116: https://tools.ietf.org/html/rfc5116
```

**注記:**

ここで暗号化を追加する主な目的は内部情報を隠すことです。ただし、JWT の改ざんに対する第一の保護は署名であることを忘れないことが非常に重要です。したがって、トークン署名とその検証は常に配置されていなければなりません。

#### 実装例

##### トークン暗号化

暗号化を管理するコードです。暗号化処理では、[Google Tink](https://github.com/google/tink) 専用暗号ライブラリを使用し、このライブラリが提供する組み込みのベストプラクティスを利用します。

``` java
/**
 * Handle ciphering and deciphering of the token using AES-GCM.
 *
 * @see "https://github.com/google/tink/blob/master/docs/JAVA-HOWTO.md"
 */
public class TokenCipher {

    /**
     * Constructor - Register AEAD configuration
     *
     * @throws Exception If any issue occur during AEAD configuration registration
     */
    public TokenCipher() throws Exception {
        AeadConfig.register();
    }

    /**
     * Cipher a JWT
     *
     * @param jwt          Token to cipher
     * @param keysetHandle Pointer to the keyset handle
     * @return The ciphered version of the token encoded in HEX
     * @throws Exception If any issue occur during token ciphering operation
     */
    public String cipherToken(String jwt, KeysetHandle keysetHandle) throws Exception {
        //Verify parameters
        if (jwt == null || jwt.isEmpty() || keysetHandle == null) {
            throw new IllegalArgumentException("Both parameters must be specified!");
        }

        //Get the primitive
        Aead aead = AeadFactory.getPrimitive(keysetHandle);

        //Cipher the token
        byte[] cipheredToken = aead.encrypt(jwt.getBytes(), null);

        return DatatypeConverter.printHexBinary(cipheredToken);
    }

    /**
     * Decipher a JWT
     *
     * @param jwtInHex     Token to decipher encoded in HEX
     * @param keysetHandle Pointer to the keyset handle
     * @return The token in clear text
     * @throws Exception If any issue occur during token deciphering operation
     */
    public String decipherToken(String jwtInHex, KeysetHandle keysetHandle) throws Exception {
        //Verify parameters
        if (jwtInHex == null || jwtInHex.isEmpty() || keysetHandle == null) {
            throw new IllegalArgumentException("Both parameters must be specified !");
        }

        //Decode the ciphered token
        byte[] cipheredToken = DatatypeConverter.parseHexBinary(jwtInHex);

        //Get the primitive
        Aead aead = AeadFactory.getPrimitive(keysetHandle);

        //Decipher the token
        byte[] decipheredToken = aead.decrypt(cipheredToken, null);

        return new String(decipheredToken);
    }
}
```

##### トークンの作成 / 検証

トークンの作成と検証時に、トークン暗号化ハンドラを使用します。

鍵を読み込み (暗号化鍵は [Google Tink](https://github.com/google/tink/blob/master/docs/JAVA-HOWTO.md#generating-new-keysets) を使用して生成および保存)、暗号化をセットアップします。

``` java
//Load keys from configuration text/json files in order to avoid to storing keys as a String in JVM memory
private transient byte[] keyHMAC = Files.readAllBytes(Paths.get("src", "main", "conf", "key-hmac.txt"));
private transient KeysetHandle keyCiphering = CleartextKeysetHandle.read(JsonKeysetReader.withFile(
Paths.get("src", "main", "conf", "key-ciphering.json").toFile()));

...

//Init token ciphering handler
TokenCipher tokenCipher = new TokenCipher();
```

トークン作成。

``` java
//Generate the JWT token using the JWT API...
//Cipher the token (String JSON representation)
String cipheredToken = tokenCipher.cipherToken(token, this.keyCiphering);
//Send the ciphered token encoded in HEX to the client in HTTP response...
```

トークン検証。

``` java
//Retrieve the ciphered token encoded in HEX from the HTTP request...
//Decipher the token
String token = tokenCipher.decipherToken(cipheredToken, this.keyCiphering);
//Verify the token using the JWT API...
//Verify access...
```

### クライアント側でのトークン保存

#### 症状

これは、アプリケーションが次のような動作を示す方法でトークンを保存するときに発生します。

- ブラウザによって自動送信される (*Cookie* ストレージ)。
- ブラウザを再起動しても取得される (ブラウザの *localStorage* コンテナの使用)。
- [XSS](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html) の問題がある場合に取得される (JavaScript コードからアクセス可能な Cookie、またはブラウザの local/session storage に保存されたトークン)。

#### 防止方法

1. ブラウザの *sessionStorage* コンテナを使用してトークンを保存するか、JavaScript の *closures* と *private* 変数を使用します。
1. サービス呼び出し時に、JavaScript で *Bearer* HTTP `Authentication` ヘッダーとして追加します。
1. トークンに [fingerprint](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html#token-sidejacking) 情報を追加します。

ブラウザの *sessionStorage* コンテナにトークンを保存すると、XSS 攻撃によってトークンが窃取される可能性にさらされます。ただし、トークンに追加された fingerprint により、攻撃者が自身のマシンで窃取したトークンを再利用することを防ぎます。攻撃者の悪用面を最大限に閉じるには、ブラウザの [Content Security Policy](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html) を追加して実行コンテキストを強化します。

ただし、*sessionStorage* はタブ単位のスコープを持つため、常に実用的とは限りません。トークンの保存方法は、*security* と *usability* のバランスを取るべきです。

*LocalStorage* は、ブラウザ再起動後やタブ間でセッションを維持できるため、ユーザビリティの面では *sessionStorage* より優れています。ただし、厳格なセキュリティ制御を使用しなければなりません。

- *localStorage* に保存するトークンは、*短い有効期限* (例: *15-30 分のアイドルタイムアウト、8 時間の絶対タイムアウト*) を持つべきです。
- リスクを最小化するために、*token rotation* や *refresh tokens* などの仕組みを実装します。

*タブ間のセッション永続性* と *sessionStorage* が必要な場合は、ユーザーが新しいタブを開いたときに自動的に再認証するため、*BroadcastChannel API* または *Single Sign-On (SSO)* の使用を検討します。

ブラウザの *sessionStorage* や *localStorage* にトークンを保存する代替策は、JavaScript の private 変数または Closures を使用することです。この方式では、すべての Web リクエストへのアクセスを JavaScript モジュール経由にし、そのモジュールがトークンを private 変数にカプセル化します。この変数はモジュール内部からしかアクセスできません。

*注記:*

- 残るケースは、攻撃者がユーザーのブラウジングコンテキストをプロキシとして使用し、正規ユーザーを通じて対象アプリケーションを利用する場合です。ただし Content Security Policy は、期待されないドメインとの通信を防止できます。
- 認証サービスを、強化された Cookie 内でトークンを発行する形で実装することも可能です。ただしこの場合、[Cross-Site Request Forgery](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html) 攻撃に対する保護を実装しなければなりません。

#### 実装例

認証後にトークンを保存する JavaScript コードです。

``` javascript
/* Handle request for JWT token and local storage*/
function authenticate() {
    const login = $("#login").val();
    const postData = "login=" + encodeURIComponent(login) + "&password=test";

    $.post("/services/authenticate", postData, function (data) {
        if (data.status == "Authentication successful!") {
            ...
            sessionStorage.setItem("token", data.token);
        }
        else {
            ...
            sessionStorage.removeItem("token");
        }
    })
    .fail(function (jqXHR, textStatus, error) {
        ...
        sessionStorage.removeItem("token");
    });
}
```

サービス呼び出し時に、トークンを *Bearer* HTTP Authentication ヘッダーとして追加する JavaScript コードです。ここでは例として、トークンを検証するサービスを呼び出します。

``` javascript
/* Handle request for JWT token validation */
function validateToken() {
    var token = sessionStorage.getItem("token");

    if (token == undefined || token == "") {
        $("#infoZone").removeClass();
        $("#infoZone").addClass("alert alert-warning");
        $("#infoZone").text("Obtain a JWT token first :)");
        return;
    }

    $.ajax({
        url: "/services/validate",
        type: "POST",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "bearer " + token);
        },
        success: function (data) {
            ...
        },
        error: function (jqXHR, textStatus, error) {
            ...
        },
    });
}
```

private 変数を持つ closure を実装する JavaScript コードです。

``` javascript
function myFetchModule() {
    // Protect the original 'fetch' from getting overwritten via XSS
    const fetch = window.fetch;

    const authOrigins = ["https://yourorigin", "http://localhost"];
    let token = '';

    this.setToken = (value) => {
        token = value
    }

    this.fetch = (resource, options) => {
        let req = new Request(resource, options);
        destOrigin = new URL(req.url).origin;
        if (token && authOrigins.includes(destOrigin)) {
            req.headers.set('Authorization', token);
        }
        return fetch(req)
    }
}

...

// usage:
const myFetch = new myFetchModule()

function login() {
  fetch("/api/login")
      .then((res) => {
          if (res.status == 200) {
              return res.json()
          } else {
              throw Error(res.statusText)
          }
      })
      .then(data => {
          myFetch.setToken(data.token)
          console.log("Token received and stored.")
      })
      .catch(console.error)
}

...

// after login, subsequent api calls:
function makeRequest() {
    myFetch.fetch("/api/hello", {headers: {"MyHeader": "foobar"}})
        .then((res) => {
            if (res.status == 200) {
                return res.text()
            } else {
                throw Error(res.statusText)
            }
        }).then(responseText => console.log("helloResponse", responseText))
        .catch(console.error)
}
```

### 弱いトークンシークレット

#### 症状

トークンが HMAC ベースのアルゴリズムで保護されている場合、トークンのセキュリティは HMAC で使用されるシークレットの強度に完全に依存します。攻撃者が有効な JWT を取得できる場合、[John the Ripper](https://github.com/magnumripper/JohnTheRipper) や [Hashcat](https://github.com/hashcat/hashcat) などのツールを使ってオフライン攻撃を行い、シークレットの解読を試みることができます。

攻撃者が成功した場合、トークンを変更し、取得した鍵で再署名できるようになります。これにより、JWT の内容に応じて、権限昇格、他ユーザーアカウントの侵害、またはその他の操作が可能になる可能性があります。

このプロセスをより詳しく記録した[ガイド](https://www.notsosecure.com/crafting-way-json-web-tokens/)がいくつかあります。

#### 防止方法

この攻撃を防ぐ最も単純な方法は、JWT の署名に使用するシークレットが強力かつ一意であることを保証し、攻撃者が解読しにくくすることです。このシークレットは人間が入力する必要がないため、少なくとも 64 文字以上とし、[安全なランダム性のソース](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html#secure-random-number-generation)を使用して生成するべきです。

代替として、HMAC と秘密鍵を使用するのではなく、RSA で署名されたトークンの使用を検討します。

#### 参考資料

- [`{JWT}.{Attack}.Playbook`](https://github.com/ticarpi/jwt_tool/wiki) - JSON Web Token の既知の攻撃、潜在的なセキュリティ脆弱性、設定ミスを文書化したプロジェクトです。
- [JWT Best Practices Internet Draft](https://datatracker.ietf.org/doc/draft-ietf-oauth-jwt-bcp/)

</section>

<section id="json-web-token-for-java-bilingual-panel" className="tabPanel bilingualPanel">

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

# JSON Web Token Cheat Sheet for Java

## Introduction

Many applications use **JSON Web Tokens** (JWT) to allow the client to indicate its identity for further exchange after authentication.

From [JWT.IO](https://jwt.io/introduction):

> JSON Web Token (JWT) is an open standard (RFC 7519) that defines a compact and self-contained way for securely transmitting information between parties as a JSON object. This information can be verified and trusted because it is digitally signed. JWTs can be signed using a secret (with the HMAC algorithm) or a public/private key pair using RSA.

JWTs are used to carry information related to the identity and characteristics (claims) of a client. This information is signed by the server to ensure it has not been tampered with after being sent to the client. This prevents an attacker from modifying the identity or characteristics — for example, changing the role from a simple user to an admin or altering the client's login.

The token is created during authentication (it is issued upon successful authentication) and is verified by the server before any processing. Applications use the token to allow a client to present what is essentially an "identity card" to the server. The server can then securely verify the token's validity and integrity. This approach is stateless and portable, meaning it works across different client and server technologies, and over various transport channels — although HTTP is the most commonly used.

## Token Structure

Token structure example taken from [JWT.IO](https://jwt.io/#debugger):

`[Base64(HEADER)].[Base64(PAYLOAD)].[Base64(SIGNATURE)]`

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

# Java 向け JSON Web Token チートシート

## はじめに

多くのアプリケーションでは、認証後の以降のやり取りでクライアントが自身のアイデンティティを示せるようにするため、**JSON Web Token** (JWT) を使用します。

[JWT.IO](https://jwt.io/introduction) より:

> JSON Web Token (JWT) is an open standard (RFC 7519) that defines a compact and self-contained way for securely transmitting information between parties as a JSON object. This information can be verified and trusted because it is digitally signed. JWTs can be signed using a secret (with the HMAC algorithm) or a public/private key pair using RSA.

JWT は、クライアントのアイデンティティや特性 (クレーム) に関連する情報を運ぶために使用されます。この情報は、クライアントへ送信された後に改ざんされていないことを保証するため、サーバによって署名されます。これにより、攻撃者がアイデンティティや特性を変更すること、たとえばロールを一般ユーザーから管理者へ変更したり、クライアントのログイン名を変更したりすることを防ぎます。

トークンは認証時、つまり認証成功時に作成され、処理を行う前にサーバによって検証されます。アプリケーションは、クライアントがサーバへ「身分証明書」のようなものを提示できるようにするためにトークンを使用します。サーバはその後、トークンの有効性と完全性を安全に検証できます。この方式はステートレスかつポータブルです。つまり、さまざまなクライアント技術やサーバ技術、さまざまな転送チャネルで機能します。ただし、最も一般的に使用されるのは HTTP です。

## トークン構造

トークン構造の例は [JWT.IO](https://jwt.io/#debugger) から引用しています。

`[Base64(HEADER)].[Base64(PAYLOAD)].[Base64(SIGNATURE)]`

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```text
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.
TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Chunk 1: **Header**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

チャンク 1: **ヘッダー**

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Chunk 2: **Payload**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

チャンク 2: **ペイロード**

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```json
{
  "sub": "1234567890",
  "name": "John Doe",
  "admin": true
}
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Chunk 3: **Signature**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

チャンク 3: **署名**

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```javascript
HMACSHA256( base64UrlEncode(header) + "." + base64UrlEncode(payload), KEY )
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Objective

This cheatsheet provides tips to prevent common security issues when using JSON Web Tokens (JWT) with Java.

The tips presented in this article are part of a Java project that was created to show the correct way to handle creation and validation of JSON Web Tokens.

You can find the Java project [here](https://github.com/righettod/poc-jwt), it uses the official [JWT library](https://jwt.io/#libraries).

In the rest of the article, the term **token** refers to the **JSON Web Tokens** (JWT).

## Consideration about Using JWT

Even if a JWT is "easy" to use and allow to expose services (mostly REST style) in a stateless way, it's not the solution that fits for all applications because it comes with some caveats, like for example the question of the storage of the token (tackled in this cheatsheet) and others...

If your application does not need to be fully stateless, you can consider using traditional session system provided by all web frameworks and follow the advice from the dedicated [session management cheat sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html). However, for stateless applications, when well implemented, it's a good candidate.

## Issues

### None Hashing Algorithm

#### Symptom

This attack, described [here](https://auth0.com/blog/critical-vulnerabilities-in-json-web-token-libraries/), occurs when an attacker alters the token and changes the hashing algorithm to indicate, through the *none* keyword, that the integrity of the token has already been verified. As explained in the link above *some libraries treated tokens signed with the none algorithm as a valid token with a verified signature*, so an attacker can alter the token claims and the modified token will still be trusted by the application.

#### How to Prevent

First, use a JWT library that is not exposed to this vulnerability.

Last, during token validation, explicitly request that the expected algorithm was used.

#### Implementation Example

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 目的

このチートシートは、Java で JSON Web Token (JWT) を使用するときの一般的なセキュリティ問題を防ぐためのヒントを提供します。

この記事で示すヒントは、JSON Web Token の作成と検証を正しく扱う方法を示すために作成された Java プロジェクトの一部です。

Java プロジェクトは[こちら](https://github.com/righettod/poc-jwt)にあります。このプロジェクトは公式の [JWT ライブラリ](https://jwt.io/#libraries)を使用しています。

この記事の残りの部分では、**トークン**という用語は **JSON Web Token** (JWT) を指します。

## JWT 使用に関する考慮事項

JWT は「簡単」に使用でき、サービス (主に REST スタイル) をステートレスに公開できますが、すべてのアプリケーションに適した解決策ではありません。たとえばトークンの保存方法 (このチートシートで扱います) など、いくつかの注意点があるためです。

アプリケーションが完全にステートレスである必要がない場合は、すべての Web フレームワークが提供する従来のセッションシステムを使用し、専用の[セッション管理チートシート](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)の助言に従うことを検討できます。ただし、ステートレスアプリケーションでは、適切に実装されていれば JWT は有力な候補です。

## 問題

### None ハッシュアルゴリズム

#### 症状

この攻撃は[こちら](https://auth0.com/blog/critical-vulnerabilities-in-json-web-token-libraries/)で説明されています。攻撃者がトークンを改変し、ハッシュアルゴリズムを変更して、*none* キーワードによりトークンの完全性がすでに検証済みであることを示す場合に発生します。上記リンクで説明されているように、*一部のライブラリは none アルゴリズムで署名されたトークンを、署名検証済みの有効なトークンとして扱っていました*。そのため攻撃者はトークンのクレームを改変でき、改変されたトークンがアプリケーションに信頼され続けます。

#### 防止方法

まず、この脆弱性にさらされていない JWT ライブラリを使用します。

最後に、トークン検証時に、期待されるアルゴリズムが使用されたことを明示的に要求します。

#### 実装例

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

``` java
// HMAC key - Block serialization and storage as String in JVM memory
private transient byte[] keyHMAC = ...;

...

//Create a verification context for the token requesting
//explicitly the use of the HMAC-256 hashing algorithm
JWTVerifier verifier = JWT.require(Algorithm.HMAC256(keyHMAC)).build();

//Verify the token, if the verification fail then a exception is thrown
DecodedJWT decodedToken = verifier.verify(token);
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Token Sidejacking

#### Symptom

This attack occurs when a token has been intercepted/stolen by an attacker and they use it to gain access to the system using targeted user identity.

#### How to Prevent

One way to prevent this is by adding a "user context" to the token. The user context should consist of the following:

- A random string generated during the authentication phase. This string is sent to the client as a hardened cookie (with the following flags: [HttpOnly + Secure](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#Secure_and_HttpOnly_cookies), [SameSite](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#SameSite_cookies), [Max-Age](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie), and [cookie prefixes](https://googlechrome.github.io/samples/cookie-prefixes/)). Avoid setting the *expires* header so the cookie is cleared when the browser is closed. Set *Max-Age* to a value equal to or less than the JWT's expiry time — never more.
- A SHA256 hash of the random string will be stored in the token (instead of the raw value) in order to prevent any XSS issues allowing the attacker to read the random string value and setting the expected cookie.

Avoid using IP addresses as part of the context. IP addresses can change during a single session due to legitimate reasons — for example, when a user accesses the application on a mobile device and switches network providers. Additionally, IP tracking can raise concerns related to [GDPR compliance](https://gdpr.eu/) in the EU.

During token validation, if the received token does not contain the correct context (e.g., if it is being replayed by an attacker), it must be rejected.

#### Implementation example

Code to create the token after successful authentication.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### トークンのサイドジャッキング

#### 症状

この攻撃は、攻撃者がトークンを傍受または窃取し、対象ユーザーのアイデンティティを使ってシステムへアクセスするときに発生します。

#### 防止方法

これを防ぐ一つの方法は、トークンに「ユーザーコンテキスト」を追加することです。ユーザーコンテキストは次で構成するべきです。

- 認証フェーズで生成されるランダム文字列。この文字列は、強化された Cookie としてクライアントへ送信します。Cookie には [HttpOnly + Secure](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#Secure_and_HttpOnly_cookies)、[SameSite](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#SameSite_cookies)、[Max-Age](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie)、[cookie prefixes](https://googlechrome.github.io/samples/cookie-prefixes/) のフラグを付与します。ブラウザを閉じたときに Cookie が削除されるよう、*expires* ヘッダーの設定は避けます。*Max-Age* は JWT の有効期限以下の値に設定し、決して JWT より長くしてはいけません。
- ランダム文字列の SHA256 ハッシュを、生の値の代わりにトークンへ保存します。これにより、攻撃者が XSS の問題を悪用してランダム文字列の値を読み取り、期待される Cookie を設定することを防ぎます。

コンテキストの一部として IP アドレスを使用することは避けます。IP アドレスは、正当な理由で単一セッション中に変化することがあります。たとえば、ユーザーがモバイルデバイスでアプリケーションへアクセスし、ネットワークプロバイダを切り替える場合です。さらに、IP 追跡は EU における [GDPR compliance](https://gdpr.eu/) に関連する懸念を生じさせる可能性があります。

トークン検証時に、受信したトークンが正しいコンテキストを含まない場合、たとえば攻撃者によって再利用されている場合は、拒否しなければなりません。

#### 実装例

認証成功後にトークンを作成するコードです。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

``` java
// HMAC key - Block serialization and storage as String in JVM memory
private transient byte[] keyHMAC = ...;
// Random data generator
private SecureRandom secureRandom = new SecureRandom();

...

//Generate a random string that will constitute the fingerprint for this user
byte[] randomFgp = new byte[50];
secureRandom.nextBytes(randomFgp);
String userFingerprint = DatatypeConverter.printHexBinary(randomFgp);

//Add the fingerprint in a hardened cookie - Add cookie manually because
//SameSite attribute is not supported by javax.servlet.http.Cookie class
String fingerprintCookie = "__Secure-Fgp=" + userFingerprint
                           + "; SameSite=Strict; HttpOnly; Secure";
response.addHeader("Set-Cookie", fingerprintCookie);

//Compute a SHA256 hash of the fingerprint in order to store the
//fingerprint hash (instead of the raw value) in the token
//to prevent an XSS to be able to read the fingerprint and
//set the expected cookie itself
MessageDigest digest = MessageDigest.getInstance("SHA-256");
byte[] userFingerprintDigest = digest.digest(userFingerprint.getBytes("utf-8"));
String userFingerprintHash = DatatypeConverter.printHexBinary(userFingerprintDigest);

//Create the token with a validity of 15 minutes and client context (fingerprint) information
Calendar c = Calendar.getInstance();
Date now = c.getTime();
c.add(Calendar.MINUTE, 15);
Date expirationDate = c.getTime();
Map<String, Object> headerClaims = new HashMap<>();
headerClaims.put("typ", "JWT");
String token = JWT.create().withSubject(login)
   .withExpiresAt(expirationDate)
   .withIssuer(this.issuerID)
   .withIssuedAt(now)
   .withNotBefore(now)
   .withClaim("userFingerprint", userFingerprintHash)
   .withHeader(headerClaims)
   .sign(Algorithm.HMAC256(this.keyHMAC));
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Code to validate the token.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

トークンを検証するコードです。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

``` java
// HMAC key - Block serialization and storage as String in JVM memory
private transient byte[] keyHMAC = ...;

...

//Retrieve the user fingerprint from the dedicated cookie
String userFingerprint = null;
if (request.getCookies() != null && request.getCookies().length > 0) {
 List<Cookie> cookies = Arrays.stream(request.getCookies()).collect(Collectors.toList());
 Optional<Cookie> cookie = cookies.stream().filter(c -> "__Secure-Fgp"
                                            .equals(c.getName())).findFirst();
 if (cookie.isPresent()) {
   userFingerprint = cookie.get().getValue();
 }
}

//Compute a SHA256 hash of the received fingerprint in cookie in order to compare
//it to the fingerprint hash stored in the token
MessageDigest digest = MessageDigest.getInstance("SHA-256");
byte[] userFingerprintDigest = digest.digest(userFingerprint.getBytes("utf-8"));
String userFingerprintHash = DatatypeConverter.printHexBinary(userFingerprintDigest);

//Create a verification context for the token
JWTVerifier verifier = JWT.require(Algorithm.HMAC256(keyHMAC))
                              .withIssuer(issuerID)
                              .withClaim("userFingerprint", userFingerprintHash)
                              .build();

//Verify the token, if the verification fail then an exception is thrown
DecodedJWT decodedToken = verifier.verify(token);
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### No Built-In Token Revocation by the User

#### Symptom

This problem is inherent to JWT because a token only becomes invalid when it expires. The user has no built-in feature to explicitly revoke the validity of a token. This means that if it is stolen, a user cannot revoke the token itself thereby blocking the attacker.

#### How to Prevent

Since JWTs are stateless, There is no session maintained on the server(s) serving client requests. As such, there is no session to invalidate on the server side. A well implemented Token Sidejacking solution (as explained above) should alleviate the need for maintaining denylist on server side. This is because a hardened cookie used in the Token Sidejacking can be considered as secure as a session ID used in the traditional session system, and unless both the cookie and the JWT are intercepted/stolen, the JWT is unusable. A logout can thus be 'simulated' by clearing the JWT from session storage. If the user chooses to close the browser instead, then both the cookie and sessionStorage are cleared automatically.

Another way to protect against this is to implement a token denylist that will be used to mimic the "logout" feature that exists with traditional session management system.

The denylist will keep a digest (SHA-256 encoded in HEX) of the token with a revocation date. This entry must endure at least until the expiration of the token.

When the user wants to "logout" then it call a dedicated service that will add the provided user token to the denylist resulting in an immediate invalidation of the token for further usage in the application.

#### Implementation Example

##### Block List Storage

A database table with the following structure will be used as the central denylist storage.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### ユーザーによるトークン失効機能が組み込まれていない

#### 症状

この問題は JWT に固有のものです。トークンは期限切れになるまで無効にならないためです。ユーザーには、トークンの有効性を明示的に取り消す組み込み機能がありません。つまりトークンが窃取された場合、ユーザーはトークン自体を失効させて攻撃者をブロックできません。

#### 防止方法

JWT はステートレスであるため、クライアント要求を処理するサーバ側にはセッションが維持されません。そのため、サーバ側で無効化するセッションはありません。上記で説明した、適切に実装されたトークンのサイドジャッキング対策は、サーバ側で denylist を維持する必要性を軽減するはずです。これは、トークンのサイドジャッキング対策で使用する強化された Cookie は、従来のセッションシステムで使用されるセッション ID と同程度に安全と考えられ、Cookie と JWT の両方が傍受または窃取されない限り JWT は使用できないためです。したがって、session storage から JWT を削除することで「ログアウト」を模擬できます。ユーザーが代わりにブラウザを閉じることを選んだ場合、Cookie と sessionStorage の両方が自動的に削除されます。

これに対する別の保護方法は、従来のセッション管理システムに存在する「ログアウト」機能を模倣するために使用するトークン denylist を実装することです。

denylist は、トークンのダイジェスト (SHA-256 を HEX でエンコードしたもの) と失効日を保持します。このエントリは、少なくともトークンの有効期限まで保持されなければなりません。

ユーザーが「ログアウト」したい場合、専用サービスを呼び出して、提供されたユーザートークンを denylist に追加します。その結果、そのトークンはアプリケーションでの以降の使用に対して即時に無効化されます。

#### 実装例

##### ブロックリストストレージ

中央の denylist ストレージとして、次の構造を持つデータベーステーブルを使用します。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

``` sql
create table if not exists revoked_token(jwt_token_digest varchar(255) primary key,
revocation_date timestamp default now());
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

##### Token Revocation Management

Code in charge of adding a token to the denylist and checking if a token is revoked.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

##### トークン失効管理

トークンを denylist に追加し、トークンが失効済みかどうかを確認するコードです。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

``` java
/**
* Handle the revocation of the token (logout).
* Use a DB in order to allow multiple instances to check for revoked token
* and allow cleanup at centralized DB level.
*/
public class TokenRevoker {

 /** DB Connection */
 @Resource("jdbc/storeDS")
 private DataSource storeDS;

 /**
  * Verify if a digest encoded in HEX of the ciphered token is present
  * in the revocation table
  *
  * @param jwtInHex Token encoded in HEX
  * @return Presence flag
  * @throws Exception If any issue occur during communication with DB
  */
 public boolean isTokenRevoked(String jwtInHex) throws Exception {
     boolean tokenIsPresent = false;
     if (jwtInHex != null && !jwtInHex.trim().isEmpty()) {
         //Decode the ciphered token
         byte[] cipheredToken = DatatypeConverter.parseHexBinary(jwtInHex);

         //Compute a SHA256 of the ciphered token
         MessageDigest digest = MessageDigest.getInstance("SHA-256");
         byte[] cipheredTokenDigest = digest.digest(cipheredToken);
         String jwtTokenDigestInHex = DatatypeConverter.printHexBinary(cipheredTokenDigest);

         //Search token digest in HEX in DB
         try (Connection con = this.storeDS.getConnection()) {
             String query = "select jwt_token_digest from revoked_token where jwt_token_digest = ?";
             try (PreparedStatement pStatement = con.prepareStatement(query)) {
                 pStatement.setString(1, jwtTokenDigestInHex);
                 try (ResultSet rSet = pStatement.executeQuery()) {
                     tokenIsPresent = rSet.next();
                 }
             }
         }
     }

     return tokenIsPresent;
 }


 /**
  * Add a digest encoded in HEX of the ciphered token to the revocation token table
  *
  * @param jwtInHex Token encoded in HEX
  * @throws Exception If any issue occur during communication with DB
  */
 public void revokeToken(String jwtInHex) throws Exception {
     if (jwtInHex != null && !jwtInHex.trim().isEmpty()) {
         //Decode the ciphered token
         byte[] cipheredToken = DatatypeConverter.parseHexBinary(jwtInHex);

         //Compute a SHA256 of the ciphered token
         MessageDigest digest = MessageDigest.getInstance("SHA-256");
         byte[] cipheredTokenDigest = digest.digest(cipheredToken);
         String jwtTokenDigestInHex = DatatypeConverter.printHexBinary(cipheredTokenDigest);

         //Check if the token digest in HEX is already in the DB and add it if it is absent
         if (!this.isTokenRevoked(jwtInHex)) {
             try (Connection con = this.storeDS.getConnection()) {
                 String query = "insert into revoked_token(jwt_token_digest) values(?)";
                 int insertedRecordCount;
                 try (PreparedStatement pStatement = con.prepareStatement(query)) {
                     pStatement.setString(1, jwtTokenDigestInHex);
                     insertedRecordCount = pStatement.executeUpdate();
                 }
                 if (insertedRecordCount != 1) {
                     throw new IllegalStateException("Number of inserted record is invalid," +
                     " 1 expected but is " + insertedRecordCount);
                 }
             }
         }

     }
 }
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Token Information Disclosure

#### Symptom

This attack occurs when an attacker has access to a token (or a set of tokens) and extracts information stored in it (the contents of JWTs are base64 encoded, but is not encrypted by default) in order to obtain information about the system. Information can be for example the security roles, login format...

#### How to Prevent

A way to protect against this attack is to cipher the token using, for example, a symmetric algorithm.

It's also important to protect the ciphered data against attack like [Padding Oracle](https://owasp.org/www-project-web-security-testing-guide/stable/4-Web_Application_Security_Testing/09-Testing_for_Weak_Cryptography/02-Testing_for_Padding_Oracle.html) or any other attack using cryptanalysis.

In order to achieve all these goals, the *AES-[GCM](https://en.wikipedia.org/wiki/Galois/Counter_Mode)* algorithm is used which provides *Authenticated Encryption with Associated Data*.

More details from [here](https://github.com/google/tink/blob/master/docs/PRIMITIVES.md#deterministic-authenticated-encryption-with-associated-data):

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### トークン情報の漏えい

#### 症状

この攻撃は、攻撃者がトークン (または一連のトークン) にアクセスし、そこに保存された情報を抽出する場合に発生します。JWT の内容は base64 エンコードされていますが、デフォルトでは暗号化されていません。攻撃者はこれにより、システムに関する情報を取得します。情報には、たとえばセキュリティロールやログイン形式などがあります。

#### 防止方法

この攻撃から保護する方法の一つは、たとえば対称アルゴリズムを使用してトークンを暗号化することです。

暗号化されたデータを [Padding Oracle](https://owasp.org/www-project-web-security-testing-guide/stable/4-Web_Application_Security_Testing/09-Testing_for_Weak_Cryptography/02-Testing_for_Padding_Oracle.html) のような攻撃や、暗号解読を使うその他の攻撃から保護することも重要です。

これらすべての目的を達成するために、*Authenticated Encryption with Associated Data* を提供する *AES-[GCM](https://en.wikipedia.org/wiki/Galois/Counter_Mode)* アルゴリズムを使用します。

詳細は[こちら](https://github.com/google/tink/blob/master/docs/PRIMITIVES.md#deterministic-authenticated-encryption-with-associated-data)から引用します。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```text
AEAD primitive (Authenticated Encryption with Associated Data) provides functionality of symmetric
authenticated encryption.

Implementations of this primitive are secure against adaptive chosen ciphertext attacks.

When encrypting a plaintext one can optionally provide associated data that should be authenticated
but not encrypted.

That is, the encryption with associated data ensures authenticity (ie. who the sender is) and
integrity (ie. data has not been tampered with) of that data, but not its secrecy.

See RFC5116: https://tools.ietf.org/html/rfc5116
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Note:**

Here ciphering is added mainly to hide internal information but it's very important to remember that the first protection against tampering of the JWT is the signature. So, the token signature and its verification must be always in place.

#### Implementation Example

##### Token Ciphering

Code in charge of managing the ciphering. [Google Tink](https://github.com/google/tink) dedicated crypto library is used to handle ciphering operations in order to use built-in best practices provided by this library.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**注記:**

ここで暗号化を追加する主な目的は内部情報を隠すことです。ただし、JWT の改ざんに対する第一の保護は署名であることを忘れないことが非常に重要です。したがって、トークン署名とその検証は常に配置されていなければなりません。

#### 実装例

##### トークン暗号化

暗号化を管理するコードです。暗号化処理では、[Google Tink](https://github.com/google/tink) 専用暗号ライブラリを使用し、このライブラリが提供する組み込みのベストプラクティスを利用します。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

``` java
/**
 * Handle ciphering and deciphering of the token using AES-GCM.
 *
 * @see "https://github.com/google/tink/blob/master/docs/JAVA-HOWTO.md"
 */
public class TokenCipher {

    /**
     * Constructor - Register AEAD configuration
     *
     * @throws Exception If any issue occur during AEAD configuration registration
     */
    public TokenCipher() throws Exception {
        AeadConfig.register();
    }

    /**
     * Cipher a JWT
     *
     * @param jwt          Token to cipher
     * @param keysetHandle Pointer to the keyset handle
     * @return The ciphered version of the token encoded in HEX
     * @throws Exception If any issue occur during token ciphering operation
     */
    public String cipherToken(String jwt, KeysetHandle keysetHandle) throws Exception {
        //Verify parameters
        if (jwt == null || jwt.isEmpty() || keysetHandle == null) {
            throw new IllegalArgumentException("Both parameters must be specified!");
        }

        //Get the primitive
        Aead aead = AeadFactory.getPrimitive(keysetHandle);

        //Cipher the token
        byte[] cipheredToken = aead.encrypt(jwt.getBytes(), null);

        return DatatypeConverter.printHexBinary(cipheredToken);
    }

    /**
     * Decipher a JWT
     *
     * @param jwtInHex     Token to decipher encoded in HEX
     * @param keysetHandle Pointer to the keyset handle
     * @return The token in clear text
     * @throws Exception If any issue occur during token deciphering operation
     */
    public String decipherToken(String jwtInHex, KeysetHandle keysetHandle) throws Exception {
        //Verify parameters
        if (jwtInHex == null || jwtInHex.isEmpty() || keysetHandle == null) {
            throw new IllegalArgumentException("Both parameters must be specified !");
        }

        //Decode the ciphered token
        byte[] cipheredToken = DatatypeConverter.parseHexBinary(jwtInHex);

        //Get the primitive
        Aead aead = AeadFactory.getPrimitive(keysetHandle);

        //Decipher the token
        byte[] decipheredToken = aead.decrypt(cipheredToken, null);

        return new String(decipheredToken);
    }
}
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

##### Creation / Validation of the Token

Use the token ciphering handler during the creation and the validation of the token.

Load keys (ciphering key was generated and stored using [Google Tink](https://github.com/google/tink/blob/master/docs/JAVA-HOWTO.md#generating-new-keysets)) and setup cipher.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

##### トークンの作成 / 検証

トークンの作成と検証時に、トークン暗号化ハンドラを使用します。

鍵を読み込み (暗号化鍵は [Google Tink](https://github.com/google/tink/blob/master/docs/JAVA-HOWTO.md#generating-new-keysets) を使用して生成および保存)、暗号化をセットアップします。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

``` java
//Load keys from configuration text/json files in order to avoid to storing keys as a String in JVM memory
private transient byte[] keyHMAC = Files.readAllBytes(Paths.get("src", "main", "conf", "key-hmac.txt"));
private transient KeysetHandle keyCiphering = CleartextKeysetHandle.read(JsonKeysetReader.withFile(
Paths.get("src", "main", "conf", "key-ciphering.json").toFile()));

...

//Init token ciphering handler
TokenCipher tokenCipher = new TokenCipher();
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Token creation.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

トークン作成。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

``` java
//Generate the JWT token using the JWT API...
//Cipher the token (String JSON representation)
String cipheredToken = tokenCipher.cipherToken(token, this.keyCiphering);
//Send the ciphered token encoded in HEX to the client in HTTP response...
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Token validation.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

トークン検証。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

``` java
//Retrieve the ciphered token encoded in HEX from the HTTP request...
//Decipher the token
String token = tokenCipher.decipherToken(cipheredToken, this.keyCiphering);
//Verify the token using the JWT API...
//Verify access...
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Token Storage on Client Side

#### Symptom

This occurs when an application stores the token in a manner exhibiting the following behavior:

- Automatically sent by the browser (*Cookie* storage).
- Retrieved even if the browser is restarted (Use of browser *localStorage* container).
- Retrieved in case of [XSS](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html) issue (Cookie accessible to JavaScript code or Token stored in browser local/session storage).

#### How to Prevent

1. Store the token using the browser *sessionStorage* container, or use JavaScript *closures* with *private* variables
1. Add it as a *Bearer* HTTP `Authentication` header with JavaScript when calling services.
1. Add [fingerprint](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html#token-sidejacking) information to the token.

By storing the token in browser *sessionStorage* container it exposes the token to being stolen through an XSS attack. However, fingerprints added to the token prevent reuse of the stolen token by the attacker on their machine. To close a maximum of exploitation surfaces for an attacker, add a browser [Content Security Policy](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html) to harden the execution context.

But, we know that *sessionStorage* is not always practical due to its per-tab scope, and the storage method for tokens should balance *security* and *usability*.

*LocalStorage* is a better method than *sessionStorage* for usability because it allows the session to persist between browser restarts and across tabs, but you must use strict security controls:

- Tokens stored in *localStorage* should have *short expiration times* (e.g., *15-30 minutes idle timeout, 8-hour absolute timeout*).
- Implement mechanisms such as *token rotation* and *refresh tokens* to minimize risk.

If *session persistence across tabs* and *sessionStorage* are required, consider using *BroadcastChannel API* or *Single Sign-On (SSO)* to re-authenticate users automatically when they open new tabs.

An alternative to storing token in browser *sessionStorage* or in *localStorage* is to use JavaScript private variable or Closures. In this, access to all web requests are routed through a JavaScript module that encapsulates the token in a private variable which can not be accessed other than from within the module.

*Note:*

- The remaining case is when an attacker uses the user's browsing context as a proxy to use the target application through the legitimate user but the Content Security Policy can prevent communication with non expected domains.
- It's also possible to implement the authentication service in a way that the token is issued within a hardened cookie, but in this case, protection against a [Cross-Site Request Forgery](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html) attack must be implemented.

#### Implementation Example

JavaScript code to store the token after authentication.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### クライアント側でのトークン保存

#### 症状

これは、アプリケーションが次のような動作を示す方法でトークンを保存するときに発生します。

- ブラウザによって自動送信される (*Cookie* ストレージ)。
- ブラウザを再起動しても取得される (ブラウザの *localStorage* コンテナの使用)。
- [XSS](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html) の問題がある場合に取得される (JavaScript コードからアクセス可能な Cookie、またはブラウザの local/session storage に保存されたトークン)。

#### 防止方法

1. ブラウザの *sessionStorage* コンテナを使用してトークンを保存するか、JavaScript の *closures* と *private* 変数を使用します。
1. サービス呼び出し時に、JavaScript で *Bearer* HTTP `Authentication` ヘッダーとして追加します。
1. トークンに [fingerprint](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html#token-sidejacking) 情報を追加します。

ブラウザの *sessionStorage* コンテナにトークンを保存すると、XSS 攻撃によってトークンが窃取される可能性にさらされます。ただし、トークンに追加された fingerprint により、攻撃者が自身のマシンで窃取したトークンを再利用することを防ぎます。攻撃者の悪用面を最大限に閉じるには、ブラウザの [Content Security Policy](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html) を追加して実行コンテキストを強化します。

ただし、*sessionStorage* はタブ単位のスコープを持つため、常に実用的とは限りません。トークンの保存方法は、*security* と *usability* のバランスを取るべきです。

*LocalStorage* は、ブラウザ再起動後やタブ間でセッションを維持できるため、ユーザビリティの面では *sessionStorage* より優れています。ただし、厳格なセキュリティ制御を使用しなければなりません。

- *localStorage* に保存するトークンは、*短い有効期限* (例: *15-30 分のアイドルタイムアウト、8 時間の絶対タイムアウト*) を持つべきです。
- リスクを最小化するために、*token rotation* や *refresh tokens* などの仕組みを実装します。

*タブ間のセッション永続性* と *sessionStorage* が必要な場合は、ユーザーが新しいタブを開いたときに自動的に再認証するため、*BroadcastChannel API* または *Single Sign-On (SSO)* の使用を検討します。

ブラウザの *sessionStorage* や *localStorage* にトークンを保存する代替策は、JavaScript の private 変数または Closures を使用することです。この方式では、すべての Web リクエストへのアクセスを JavaScript モジュール経由にし、そのモジュールがトークンを private 変数にカプセル化します。この変数はモジュール内部からしかアクセスできません。

*注記:*

- 残るケースは、攻撃者がユーザーのブラウジングコンテキストをプロキシとして使用し、正規ユーザーを通じて対象アプリケーションを利用する場合です。ただし Content Security Policy は、期待されないドメインとの通信を防止できます。
- 認証サービスを、強化された Cookie 内でトークンを発行する形で実装することも可能です。ただしこの場合、[Cross-Site Request Forgery](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html) 攻撃に対する保護を実装しなければなりません。

#### 実装例

認証後にトークンを保存する JavaScript コードです。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

``` javascript
/* Handle request for JWT token and local storage*/
function authenticate() {
    const login = $("#login").val();
    const postData = "login=" + encodeURIComponent(login) + "&password=test";

    $.post("/services/authenticate", postData, function (data) {
        if (data.status == "Authentication successful!") {
            ...
            sessionStorage.setItem("token", data.token);
        }
        else {
            ...
            sessionStorage.removeItem("token");
        }
    })
    .fail(function (jqXHR, textStatus, error) {
        ...
        sessionStorage.removeItem("token");
    });
}
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

JavaScript code to add the token as a *Bearer* HTTP Authentication header when calling a service, for example a service to validate token here.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

サービス呼び出し時に、トークンを *Bearer* HTTP Authentication ヘッダーとして追加する JavaScript コードです。ここでは例として、トークンを検証するサービスを呼び出します。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

``` javascript
/* Handle request for JWT token validation */
function validateToken() {
    var token = sessionStorage.getItem("token");

    if (token == undefined || token == "") {
        $("#infoZone").removeClass();
        $("#infoZone").addClass("alert alert-warning");
        $("#infoZone").text("Obtain a JWT token first :)");
        return;
    }

    $.ajax({
        url: "/services/validate",
        type: "POST",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "bearer " + token);
        },
        success: function (data) {
            ...
        },
        error: function (jqXHR, textStatus, error) {
            ...
        },
    });
}
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

JavaScript code to implement closures with private variables:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

private 変数を持つ closure を実装する JavaScript コードです。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

``` javascript
function myFetchModule() {
    // Protect the original 'fetch' from getting overwritten via XSS
    const fetch = window.fetch;

    const authOrigins = ["https://yourorigin", "http://localhost"];
    let token = '';

    this.setToken = (value) => {
        token = value
    }

    this.fetch = (resource, options) => {
        let req = new Request(resource, options);
        destOrigin = new URL(req.url).origin;
        if (token && authOrigins.includes(destOrigin)) {
            req.headers.set('Authorization', token);
        }
        return fetch(req)
    }
}

...

// usage:
const myFetch = new myFetchModule()

function login() {
  fetch("/api/login")
      .then((res) => {
          if (res.status == 200) {
              return res.json()
          } else {
              throw Error(res.statusText)
          }
      })
      .then(data => {
          myFetch.setToken(data.token)
          console.log("Token received and stored.")
      })
      .catch(console.error)
}

...

// after login, subsequent api calls:
function makeRequest() {
    myFetch.fetch("/api/hello", {headers: {"MyHeader": "foobar"}})
        .then((res) => {
            if (res.status == 200) {
                return res.text()
            } else {
                throw Error(res.statusText)
            }
        }).then(responseText => console.log("helloResponse", responseText))
        .catch(console.error)
}
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Weak Token Secret

#### Symptom

When the token is protected using an HMAC based algorithm, the security of the token is entirely dependent on the strength of the secret used with the HMAC. If an attacker can obtain a valid JWT, they can then carry out an offline attack and attempt to crack the secret using tools such as [John the Ripper](https://github.com/magnumripper/JohnTheRipper) or [Hashcat](https://github.com/hashcat/hashcat).

If they are successful, they would then be able to modify the token and re-sign it with the key they had obtained. This could let them escalate their privileges, compromise other users' accounts, or perform other actions depending on the contents of the JWT.

There are a number of [guides](https://www.notsosecure.com/crafting-way-json-web-tokens/) that document this process in greater detail.

#### How to Prevent

The simplest way to prevent this attack is to ensure that the secret used to sign the JWTs is strong and unique, in order to make it harder for an attacker to crack. As this secret would never need to be typed by a human, it should be at least 64 characters, and generated using a [secure source of randomness](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html#secure-random-number-generation).

Alternatively, consider the use of tokens that are signed with RSA rather than using an HMAC and secret key.

#### Further Reading

- [`{JWT}.{Attack}.Playbook`](https://github.com/ticarpi/jwt_tool/wiki) - A project documents the known attacks and potential security vulnerabilities and misconfigurations of JSON Web Tokens.
- [JWT Best Practices Internet Draft](https://datatracker.ietf.org/doc/draft-ietf-oauth-jwt-bcp/)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 弱いトークンシークレット

#### 症状

トークンが HMAC ベースのアルゴリズムで保護されている場合、トークンのセキュリティは HMAC で使用されるシークレットの強度に完全に依存します。攻撃者が有効な JWT を取得できる場合、[John the Ripper](https://github.com/magnumripper/JohnTheRipper) や [Hashcat](https://github.com/hashcat/hashcat) などのツールを使ってオフライン攻撃を行い、シークレットの解読を試みることができます。

攻撃者が成功した場合、トークンを変更し、取得した鍵で再署名できるようになります。これにより、JWT の内容に応じて、権限昇格、他ユーザーアカウントの侵害、またはその他の操作が可能になる可能性があります。

このプロセスをより詳しく記録した[ガイド](https://www.notsosecure.com/crafting-way-json-web-tokens/)がいくつかあります。

#### 防止方法

この攻撃を防ぐ最も単純な方法は、JWT の署名に使用するシークレットが強力かつ一意であることを保証し、攻撃者が解読しにくくすることです。このシークレットは人間が入力する必要がないため、少なくとも 64 文字以上とし、[安全なランダム性のソース](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html#secure-random-number-generation)を使用して生成するべきです。

代替として、HMAC と秘密鍵を使用するのではなく、RSA で署名されたトークンの使用を検討します。

#### 参考資料

- [`{JWT}.{Attack}.Playbook`](https://github.com/ticarpi/jwt_tool/wiki) - JSON Web Token の既知の攻撃、潜在的なセキュリティ脆弱性、設定ミスを文書化したプロジェクトです。
- [JWT Best Practices Internet Draft](https://datatracker.ietf.org/doc/draft-ietf-oauth-jwt-bcp/)

</div>
</div>

</section>
</div>

## Attribution

<div className="attributionFooter">

- Original: JSON Web Token Cheat Sheet for Java
- Source: https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: English original retained for comparison. Japanese translation added. Bilingual display generated from official source and local Japanese translation.
- Retrieved: 2026-05-21

</div>
