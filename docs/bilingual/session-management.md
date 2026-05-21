---
title: Session Management Cheat Sheet
hide_title: true
---

<div className="docHero" data-category="session-management">
  <h1>セッション管理チートシート</h1>
  <div className="docMeta">
    <span className="docPill">最終更新: 2026-05-21</span>
    <span className="docPill">読了時間: 約 14 分</span>
    <span className="docPill">カテゴリ: Session Management</span>
  </div>
</div>

<p className="docLead">セッション管理チートシートを、原文・翻訳・対比表示で確認できます。ASVS Index 対応の文脈で、公式原文と日本語訳を確認しやすく整理しています。</p>

<div className="tabbedContent">
  <input className="tabInput" type="radio" name="session-management-view" id="session-management-original" />
  <input className="tabInput" type="radio" name="session-management-view" id="session-management-translation" defaultChecked />
  <input className="tabInput" type="radio" name="session-management-view" id="session-management-bilingual" />

  <div className="contentTabs">
    <label htmlFor="session-management-original" title="OWASP 原文">原文</label>
    <label htmlFor="session-management-translation" title="日本語訳">翻訳</label>
    <label htmlFor="session-management-bilingual" title="原文と翻訳を並べて確認">対比表示</label>
  </div>

<section id="session-management-original-panel" className="tabPanel originalPanel contentPanel">

# Session Management Cheat Sheet

## Introduction

**Web Authentication, Session Management, and Access Control**:

A web session is a sequence of network HTTP request and response transactions associated with the same user. Modern and complex web applications require the retaining of information or status about each user for the duration of multiple requests. Therefore, sessions provide the ability to establish variables – such as access rights and localization settings – which will apply to each and every interaction a user has with the web application for the duration of the session.

Web applications can create sessions to keep track of anonymous users after the very first user request. An example would be maintaining the user language preference. Additionally, web applications will make use of sessions once the user has authenticated. This ensures the ability to identify the user on any subsequent requests as well as being able to apply security access controls, authorized access to the user private data, and to increase the usability of the application. Therefore, current web applications can provide session capabilities both pre and post authentication.

Once an authenticated session has been established, the session ID (or token) is temporarily equivalent to the strongest authentication method used by the application, such as username and password, passphrases, one-time passwords (OTP), client-based digital certificates, smartcards, or biometrics (such as fingerprint or eye retina). See the OWASP [Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html).

HTTP is a stateless protocol ([RFC2616](https://www.ietf.org/rfc/rfc2616.txt) section 5), where each request and response pair is independent of other web interactions. Therefore, in order to introduce the concept of a session, it is required to implement session management capabilities that link both the authentication and access control (or authorization) modules commonly available in web applications:

![SessionDiagram](https://cheatsheetseries.owasp.org/assets/Session_Management_Cheat_Sheet_Diagram.png)

The session ID or token binds the user authentication credentials (in the form of a user session) to the user HTTP traffic and the appropriate access controls enforced by the web application. The complexity of these three components (authentication, session management, and access control) in modern web applications, plus the fact that its implementation and binding resides on the web developer's hands (as web development frameworks do not provide strict relationships between these modules), makes the implementation of a secure session management module very challenging.

The disclosure, capture, prediction, brute force, or fixation of the session ID will lead to session hijacking (or sidejacking) attacks, where an attacker is able to fully impersonate a victim user in the web application. Attackers can perform two types of session hijacking attacks, targeted or generic. In a targeted attack, the attacker's goal is to impersonate a specific (or privileged) web application victim user. For generic attacks, the attacker's goal is to impersonate (or get access as) any valid or legitimate user in the web application.

## Session ID Properties

In order to keep the authenticated state and track the users progress within the web application, applications provide users with a **session identifier** (session ID or token) that is assigned at session creation time, and is shared and exchanged by the user and the web application for the duration of the session (it is sent on every HTTP request). The session ID is a `name=value` pair.

With the goal of implementing secure session IDs, the generation of identifiers (IDs or tokens) must meet the following properties.

### Session ID Name Fingerprinting

The name used by the session ID should not be extremely descriptive nor offer unnecessary details about the purpose and meaning of the ID.

The session ID names used by the most common web application development frameworks [can be easily fingerprinted](https://wiki.owasp.org/index.php/Category:OWASP_Cookies_Database), such as `PHPSESSID` (PHP), `JSESSIONID` (J2EE), `CFID` & `CFTOKEN` (ColdFusion), `ASP.NET_SessionId` (ASP .NET), etc. Therefore, the session ID name can disclose the technologies and programming languages used by the web application.

It is recommended to change the default session ID name of the web development framework to a generic name, such as `id`.

### Session ID Entropy

Session identifiers must have at least `64 bits` of entropy to prevent brute-force session guessing attacks. Entropy refers to the amount of randomness or unpredictability in a value. Each “bit” of entropy doubles the number of possible outcomes, meaning a session ID with 64 bits of entropy can have `2^64` possible values.

A strong [CSPRNG](https://en.wikipedia.org/wiki/Cryptographically_secure_pseudorandom_number_generator) (Cryptographically Secure Pseudorandom Number Generator) must be used to generate session IDs. This ensures the generated values are evenly distributed among all possible values. Otherwise, attackers may be able to use statistical analysis techniques to identify patterns in how the session IDs are created, effectively reducing the entropy and allowing the attacker to guess or predict valid session IDs more easily.

**NOTE**:

- The expected time for an attacker to brute-force a valid session ID depends on factors such as the number of bits of entropy, the number of active sessions, session expiration times, and the attacker's guessing rate.
- If a web application generates session IDs with 64 bits of entropy, an attacker can expect to spend approximately 585 years to successfully guess a valid session ID, assuming the attacker can try 10,000 guesses per second with 100,000 valid simultaneous sessions available in the application.
- Further analysis of the expected time for an attacker to brute-force session identifiers is available [here](https://owasp.org/www-community/vulnerabilities/Insufficient_Session-ID_Length#estimating-attack-time).

### Session ID Length

As mentioned in the previous *Session ID Entropy* section, a primary security requirement for session IDs is that they contain at least `64 bits` of entropy to prevent brute-force guessing attacks. Although session ID length matters, it's the entropy that ensures security. The session ID must be long enough to encode sufficient entropy, preventing brute force attacks where an attacker guesses valid session IDs.

Different encoding methods can result in different lengths for the same amount of entropy. Session IDs are often represented using hexadecimal encoding. When using hexadecimal encoding, a session ID must be at least 16 hexadecimal characters long to achieve the required 64 bits of entropy.  When using different encodings (e.g. Base64 or [Microsoft's encoding for ASP.NET session IDs](https://docs.microsoft.com/en-us/dotnet/api/system.web.sessionstate.sessionidmanager?redirectedfrom=MSDN&view=netframework-4.7.2)) a different number of characters may be required to represent the minimum 64 bits of entropy.

It’s important to note that if any part of the session ID is fixed or predictable, the effective entropy is reduced, and the length may need to be increased to compensate. For example, if half of a 16-character hexadecimal session ID is fixed, only the remaining 8 characters are random, providing just 32 bits of entropy — which is insufficient for strong security. To maintain security, ensure that the entire session ID is randomly generated and unpredictable, or increase the overall length if parts of the ID are not random.

**NOTE**:

- More information about the relationship between Session ID Length and Session ID Entropy is available [here](https://owasp.org/www-community/vulnerabilities/Insufficient_Session-ID_Length#session-id-length-and-entropy-relationship).

### Session ID Content (or Value)

The session ID content (or value) must be meaningless to prevent information disclosure attacks, where an attacker is able to decode the contents of the ID and extract details of the user, the session, or the inner workings of the web application.

The session ID must simply be an identifier on the client side, and its value must never include sensitive information or Personally Identifiable Information (PII). To read more about PII, refer to [Wikipedia](https://en.wikipedia.org/wiki/Personally_identifiable_information) or this [post](https://www.idshield.com/blog/identity-theft/what-pii-and-why-should-i-care/).

The meaning and business or application logic associated with the session ID must be stored on the server side, and specifically, in session objects or in a session management database or repository.

The stored information can include the client IP address, User-Agent, email, username, user ID, role, privilege level, access rights, language preferences, account ID, current state, last login, session timeouts, and other internal session details. If the session objects and properties contain sensitive information, such as credit card numbers, it is required to duly encrypt and protect the session management repository.

It is recommended to use the session ID created by your language or framework. If you need to create your own sessionID, use a cryptographically secure pseudorandom number generator (CSPRNG) with a size of at least 128 bits and ensure that each sessionID is unique.

## Session Management Implementation

The session management implementation defines the exchange mechanism that will be used between the user and the web application to share and continuously exchange the session ID. There are multiple mechanisms available in HTTP to maintain session state within web applications, such as cookies (standard HTTP header), URL parameters (URL rewriting – [RFC2396](https://www.ietf.org/rfc/rfc2396.txt)), URL arguments on GET requests, body arguments on POST requests, such as hidden form fields (HTML forms), or proprietary HTTP headers.

The preferred session ID exchange mechanism should allow defining advanced token properties, such as the token expiration date and time, or granular usage constraints. This is one of the reasons why cookies (RFCs [2109](https://www.ietf.org/rfc/rfc2109.txt) & [2965](https://www.ietf.org/rfc/rfc2965.txt) & [6265](https://www.ietf.org/rfc/rfc6265.txt)) are one of the most extensively used session ID exchange mechanisms, offering advanced capabilities not available in other methods.

The usage of specific session ID exchange mechanisms, such as those where the ID is included in the URL, might disclose the session ID (in web links and logs, web browser history and bookmarks, the Referer header or search engines), as well as facilitate other attacks, such as the manipulation of the ID or [session fixation attacks](https://www.acrossecurity.com/papers/session_fixation.pdf).

### Built-in Session Management Implementations

Web development frameworks, such as J2EE, ASP .NET, PHP, and others, provide their own session management features and associated implementation. It is recommended to use these built-in frameworks versus building a home made one from scratch, as they are used worldwide on multiple web environments and have been tested by the web application security and development communities over time.

However, be advised that these frameworks have also presented vulnerabilities and weaknesses in the past, so it is always recommended to use the latest version available, that potentially fixes all the well-known vulnerabilities, as well as review and change the default configuration to enhance its security by following the recommendations described along this document.

The storage capabilities or repository used by the session management mechanism to temporarily save the session IDs must be secure, protecting the session IDs against local or remote accidental disclosure or unauthorized access.

### Used vs. Accepted Session ID Exchange Mechanisms

A web application should make use of cookies for session ID exchange management. If a user submits a session ID through a different exchange mechanism, such as a URL parameter, the web application should avoid accepting it as part of a defensive strategy to stop session fixation.

**NOTE**:

- Even if a web application makes use of cookies as its default session ID exchange mechanism, it might accept other exchange mechanisms too.
- It is therefore required to confirm via thorough testing all the different mechanisms currently accepted by the web application when processing and managing session IDs, and limit the accepted session ID tracking mechanisms to just cookies.
- In the past, some web applications used URL parameters, or even switched from cookies to URL parameters (via automatic URL rewriting), if certain conditions are met (for example, the identification of web clients without support for cookies or not accepting cookies due to user privacy concerns).

### Transport Layer Security

In order to protect the session ID exchange from active eavesdropping and passive disclosure in the network traffic, it is essential to use an encrypted HTTPS (TLS) connection for the entire web session, not only for the authentication process where the user credentials are exchanged. This may be mitigated by [HTTP Strict Transport Security (HSTS)](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Strict_Transport_Security_Cheat_Sheet.html) for a client that supports it.

Additionally, the `Secure` [cookie attribute](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#Secure_and_HttpOnly_cookies) must be used to ensure the session ID is only exchanged through an encrypted channel. The usage of an encrypted communication channel also protects the session against some session fixation attacks where the attacker is able to intercept and manipulate the web traffic to inject (or fix) the session ID on the victim's web browser.

The following set of best practices are focused on protecting the session ID (specifically when cookies are used) and helping with the integration of HTTPS within the web application:

- Do not switch a given session from HTTP to HTTPS, or vice-versa, as this will disclose the session ID in the clear through the network.
    - When redirecting to HTTPS, ensure that the cookie is set or regenerated **after** the redirect has occurred.
- Do not mix encrypted and unencrypted contents (HTML pages, images, CSS, JavaScript files, etc) in the same page, or from the same domain.
- Where possible, avoid offering public unencrypted contents and private encrypted contents from the same host. Where insecure content is required, consider hosting this on a separate insecure domain.
- Implement [HTTP Strict Transport Security (HSTS)](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Strict_Transport_Security_Cheat_Sheet.html) to enforce HTTPS connections.

See the OWASP [Transport Layer Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html) for more general guidance on implementing TLS securely.

It is important to emphasize that TLS does not protect against session ID prediction, brute force, client-side tampering or fixation; however, it does provide effective protection against an attacker intercepting or stealing session IDs through a man in the middle attack.

## Cookies

The session ID exchange mechanism based on cookies provides multiple security features in the form of cookie attributes that can be used to protect the exchange of the session ID:

### Secure Attribute

The `Secure` cookie attribute instructs web browsers to only send the cookie through an encrypted HTTPS (SSL/TLS) connection. This session protection mechanism is mandatory to prevent the disclosure of the session ID through MitM (Man-in-the-Middle) attacks. It ensures that an attacker cannot simply capture the session ID from web browser traffic.

Forcing the web application to only use HTTPS for its communication (even when port TCP/80, HTTP, is closed in the web application host) does not protect against session ID disclosure if the `Secure` cookie has not been set - the web browser can be deceived to disclose the session ID over an unencrypted HTTP connection. The attacker can intercept and manipulate the victim user traffic and inject an HTTP unencrypted reference to the web application that will force the web browser to submit the session ID in the clear.

See also: [SecureFlag](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#Secure_and_HttpOnly_cookies)

### HttpOnly Attribute

The `HttpOnly` cookie attribute instructs web browsers not to allow scripts (e.g. JavaScript or VBscript) an ability to access the cookies via the DOM document.cookie object. This session ID protection is mandatory to prevent session ID stealing through XSS attacks. However, if an XSS attack is combined with a CSRF attack, the requests sent to the web application will include the session cookie, as the browser always includes the cookies when sending requests. The `HttpOnly` cookie only protects the confidentiality of the cookie; the attacker cannot use it offline, outside of the context of an XSS attack.

See the OWASP [XSS (Cross Site Scripting) Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html).

See also: [HttpOnly](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#Secure_and_HttpOnly_cookies)

### SameSite Attribute

The `SameSite` attribute prevents the browser from sending the cookie on cross-site requests, mitigating cross-origin leakage and providing CSRF defense. Session cookies must explicitly set `SameSite=Strict` (preferred) or `SameSite=Lax`. Never use `SameSite=None` without `Secure`, and do not rely on the browser-default value, which varies across browsers and versions.

See also: [SameSite](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#SameSite_cookies)

### Cookie Name Prefixes

Use cookie name prefixes to bind cookies to security properties at the browser level ([RFC 6265bis §4.1.3](https://datatracker.ietf.org/doc/html/draft-ietf-httpbis-rfc6265bis)):

- `__Host-` — the cookie must be set with `Secure`, must not have a `Domain` attribute, and must use `Path=/`. Prevents subdomain forgery and HTTPS downgrade attacks. **Recommended for session IDs.**
- `__Secure-` — the cookie must be set with `Secure`. Use only when subdomain sharing is required.

Example:

```http
Set-Cookie: __Host-SessionID=<value>; Secure; HttpOnly; SameSite=Strict; Path=/
```

### Domain and Path Attributes

The [`Domain` cookie attribute](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#Directives) instructs web browsers to only send the cookie to the specified domain and all subdomains. If the attribute is not set, by default the cookie will only be sent to the origin server. The [`Path` cookie attribute](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#Directives) instructs web browsers to only send the cookie to the specified directory or subdirectories (or paths or resources) within the web application. If the attribute is not set, by default the cookie will only be sent for the directory (or path) of the resource requested and setting the cookie.

It is recommended to use a narrow or restricted scope for these two attributes. In this way, the `Domain` attribute should not be set (restricting the cookie just to the origin server) and the `Path` attribute should be set as restrictive as possible to the web application path that makes use of the session ID.

Setting the `Domain` attribute to a too permissive value, such as `example.com` allows an attacker to launch attacks on the session IDs between different hosts and web applications belonging to the same domain, known as cross-subdomain cookies. For example, vulnerabilities in `www.example.com` might allow an attacker to get access to the session IDs from `secure.example.com`.

Additionally, it is recommended not to mix web applications of different security levels on the same domain. Vulnerabilities in one of the web applications would allow an attacker to set the session ID for a different web application on the same domain by using a permissive `Domain` attribute (such as `example.com`) which is a technique that can be used in [session fixation attacks](https://www.acrossecurity.com/papers/session_fixation.pdf).

Although the `Path` attribute allows the isolation of session IDs between different web applications using different paths on the same host, it is highly recommended not to run different web applications (especially from different security levels or scopes) on the same host. Other methods can be used by these applications to access the session IDs, such as the `document.cookie` object. Also, any web application can set cookies for any path on that host.

Cookies are vulnerable to DNS spoofing/hijacking/poisoning attacks, where an attacker can manipulate the DNS resolution to force the web browser to disclose the session ID for a given host or domain.

### Expire and Max-Age Attributes

Session management mechanisms based on cookies can make use of two types of cookies, non-persistent (or session) cookies, and persistent cookies. If a cookie presents the [`Max-Age`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#Directives) (that has preference over `Expires`) or [`Expires`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#Directives) attributes, it will be considered a persistent cookie and will be stored on disk by the web browser based until the expiration time.

Typically, session management capabilities to track users after authentication make use of non-persistent cookies. This forces the session to disappear from the client if the current web browser instance is closed. Therefore, it is highly recommended to use non-persistent cookies for session management purposes, so that the session ID does not remain on the web client cache for long periods of time, from where an attacker can obtain it.

- Ensure that sensitive information is not compromised by ensuring that it is not persistent, encrypting it, and storing it only for the duration of the need
- Ensure that unauthorized activities cannot take place via cookie manipulation
- Ensure secure flag is set to prevent accidental transmission over the wire in a non-secure manner
- Determine if all state transitions in the application code properly check for the cookies and enforce their use
- Ensure entire cookie should be encrypted if sensitive data is persisted in the cookie
- Define all cookies being used by the application, their name and why they are needed

## HTML5 Web Storage API

The Web Hypertext Application Technology Working Group (WHATWG) describes the HTML5 Web Storage APIs, `localStorage` and `sessionStorage`, as mechanisms for storing name-value pairs client-side.
Unlike HTTP cookies, the contents of `localStorage` and `sessionStorage` are not automatically shared within requests or responses by the browser and are used for storing data client-side.

### The localStorage API

> [!WARNING]
> Do not store authentication tokens, session IDs, JWTs, refresh tokens, or any credential in `localStorage` or `sessionStorage`. These APIs are accessible to any JavaScript executing in the origin, so a single XSS vulnerability discloses every token. Use `HttpOnly; Secure; SameSite=Strict` cookies (preferred) or a Backend-for-Frontend (BFF) pattern. See [OAuth 2.0 for Browser-Based Apps](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-browser-based-apps).

#### Scope

Data stored using the `localStorage` API is accessible by pages which are loaded from the same origin, which is defined as the scheme (`https://`), host (`example.com`), port (`443`) and domain/realm (`example.com`).
This provides similar access to this data as would be achieved by using the `secure` flag on a cookie, meaning that data stored from `https` could not be retrieved via `http`. Due to potential concurrent access from separate windows/threads, data stored using `localStorage` may be susceptible to shared access issues (such as race-conditions) and should be considered non-locking ([Web Storage API Spec](https://html.spec.whatwg.org/multipage/webstorage.html#the-localstorage-attribute)).

#### Duration

Data stored using the `localStorage` API is persisted across browsing sessions, extending the timeframe in which it may be accessible to other system users.

#### Offline Access

The standards do not require `localStorage` data to be encrypted-at-rest, meaning it may be possible to directly access this data from disk.

#### Use Case

WHATWG suggests the use of `localStorage` for data that needs to be accessed across windows or tabs, across multiple sessions, and where large (multi-megabyte) volumes of data may need to be stored for performance reasons.

### The sessionStorage API

#### Scope

The `sessionStorage` API stores data within the window context from which it was called, meaning that Tab 1 cannot access data which was stored from Tab 2.
Also, like the `localStorage` API, data stored using the `sessionStorage` API is accessible by pages which are loaded from the same origin, which is defined as the scheme (`https://`), host (`example.com`), port (`443`) and domain/realm (`example.com`).
This provides similar access to this data as would be achieved by using the `secure` flag on a cookie, meaning that data stored from `https` could not be retrieved via `http`.

#### Duration

The `sessionStorage` API only stores data for the duration of the current browsing session. Once the tab is closed, that data is no longer retrievable. This does not necessarily prevent access, should a browser tab be reused or left open. Data may also persist in memory until a garbage collection event.

#### Offline Access

The standards do not require `sessionStorage` data to be encrypted-at-rest, meaning it may be possible to directly access this data from disk.

#### Use Case

WHATWG suggests the use of `sessionStorage` for data that is relevant for one-instance of a workflow, such as details for a ticket booking, but where multiple workflows could be performed in other tabs concurrently. The window/tab bound nature will keep the data from leaking between workflows in separate tabs.

## Web Workers

Web Workers run JavaScript code in a global context separate from the one of the current window. A communication channel with the main execution window exists, which is called `MessageChannel`.

### Use Case

Web Workers are an alternative for browser storage of (session) secrets when storage persistence across page refresh is not a requirement. For Web Workers to provide secure browser storage, any code that requires the secret should exist within the Web Worker and the secret should never be transmitted to the main window context.

Storing secrets within the memory of a Web Worker offers the same security guarantees as an HttpOnly cookie: the confidentiality of the secret is protected. Still, an XSS attack can be used to send messages to the Web Worker to perform an operation that requires the secret. The Web Worker will return the result of the operation to the main execution thread.

The advantage of a Web Worker implementation compared to an HttpOnly cookie is that a Web Worker allows for some isolated JavaScript code to access the secret; an HttpOnly cookie is not accessible to any JavaScript. If the frontend JavaScript code requires access to the secret, the Web Worker implementation is the only browser storage option that preserves the secret confidentiality.

## Session ID Life Cycle

### Session ID Generation and Verification: Permissive and Strict Session Management

There are two types of session management mechanisms for web applications, permissive and strict, related to session fixation vulnerabilities. The permissive mechanism allows the web application to initially accept any session ID value set by the user as valid, creating a new session for it, while the strict mechanism enforces that the web application will only accept session ID values that have been previously generated by the web application.

The session tokens should be handled by the web server if possible or generated via a cryptographically secure random number generator.

Although the most common mechanism in use today is the strict one (more secure), [PHP defaults to permissive](https://wiki.php.net/rfc/session-use-strict-mode). Developers must ensure that the web application does not use a permissive mechanism under certain circumstances. Web applications should never accept a session ID they have never generated, and in case of receiving one, they should generate and offer the user a new valid session ID. Additionally, this scenario should be detected as a suspicious activity and an alert should be generated.

### Manage Session ID as Any Other User Input

Session IDs must be considered untrusted, as any other user input processed by the web application, and they must be thoroughly validated and verified. Depending on the session management mechanism used, the session ID will be received in a GET or POST parameter, in the URL or in an HTTP header (e.g. cookies). If web applications do not validate and filter out invalid session ID values before processing them, they can potentially be used to exploit other web vulnerabilities, such as SQL injection if the session IDs are stored on a relational database, or persistent XSS if the session IDs are stored and reflected back afterwards by the web application.

### Renew the Session ID After Any Privilege Level Change

The session ID must be renewed or regenerated by the web application after any privilege level change within the associated user session. The most common scenario where the session ID regeneration is mandatory is during the authentication process, as the privilege level of the user changes from the unauthenticated (or anonymous) state to the authenticated state though in some cases still not yet the authorized state. Common scenarios to consider include; password changes, permission changes, or switching from a regular user role to an administrator role within the web application. For all sensitive pages of the web application, any previous session IDs must be ignored, only the current session ID must be assigned to every new request received for the protected resource, and the old or previous session ID must be destroyed.

The most common web development frameworks provide session functions and methods to renew the session ID, such as `request.getSession(true)` & `HttpSession.invalidate()` (J2EE), `Session.Abandon()` & `Response.Cookies.Add(new...)` (ASP .NET), or `session_start()` & `session_regenerate_id(true)` (PHP).

The session ID regeneration is mandatory to prevent [session fixation attacks](https://www.acrossecurity.com/papers/session_fixation.pdf), where an attacker sets the session ID on the victim user's web browser instead of gathering the victim's session ID, as in most of the other session-based attacks, and independently of using HTTP or HTTPS. This protection mitigates the impact of other web-based vulnerabilities that can also be used to launch session fixation attacks, such as HTTP response splitting or XSS (see [here](https://media.blackhat.com/bh-eu-11/Raul_Siles/BlackHat_EU_2011_Siles_SAP_Session-Slides.pdf) and [here](https://media.blackhat.com/bh-eu-11/Raul_Siles/BlackHat_EU_2011_Siles_SAP_Session-WP.pdf)).

A complementary recommendation is to use a different session ID or token name (or set of session IDs) pre and post authentication, so that the web application can keep track of anonymous users and authenticated users without the risk of exposing or binding the user session between both states.

### Reauthentication After Risk Events

Web applications should require reauthentication after high-risk events such as:

- Changes to critical user information (e.g., password, email address)
- Login attempts from new or suspicious IP addresses or devices
- Account recovery flows (e.g., password reset or compromised-account detection)

For best practices on implementing reauthentication after these events, see the [Reauthentication After Risk Events](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#reauthentication-after-risk-events) section in the Authentication Cheat Sheet

### Additional Resources

- [Why Frequent Reauthentication Can Be a UX Pitfall](https://tailscale.com/blog/frequent-reauth-security?lid=5wso20mx4knj) by Tailscale

### Considerations When Using Multiple Cookies

If the web application uses cookies as the session ID exchange mechanism, and multiple cookies are set for a given session, the web application must verify all cookies (and enforce relationships between them) before allowing access to the user session.

It is very common for web applications to set a user cookie pre-authentication over HTTP to keep track of unauthenticated (or anonymous) users. Once the user authenticates in the web application, a new post-authentication secure cookie is set over HTTPS, and a binding between both cookies and the user session is established. If the web application does not verify both cookies for authenticated sessions, an attacker can make use of the pre-authentication unprotected cookie to get access to the authenticated user session (see [here](https://media.blackhat.com/bh-eu-11/Raul_Siles/BlackHat_EU_2011_Siles_SAP_Session-Slides.pdf) and [here](https://media.blackhat.com/bh-eu-11/Raul_Siles/BlackHat_EU_2011_Siles_SAP_Session-WP.pdf)).

Web applications should try to avoid the same cookie name for different paths or domain scopes within the same web application, as this increases the complexity of the solution and potentially introduces scoping issues.

## Session Expiration

In order to minimize the time period an attacker can launch attacks over active sessions and hijack them, it is mandatory to set expiration timeouts for every session, establishing the amount of time a session will remain active. Insufficient session expiration by the web application increases the exposure of other session-based attacks, as for the attacker to be able to reuse a valid session ID and hijack the associated session, it must still be active.

The shorter the session interval is, the lesser the time an attacker has to use the valid session ID. The session expiration timeout values must be set accordingly with the purpose and nature of the web application, and balance security and usability, so that the user can comfortably complete the operations within the web application without the session frequently expiring.

Both the idle and absolute timeout values are highly dependent on how critical the web application and its data are. Common idle timeouts ranges are 2-5 minutes for high-value applications and 15-30 minutes for low risk applications. Absolute timeouts depend on how long a user usually uses the application. If the application is intended to be used by an office worker for a full day, an appropriate absolute timeout range could be between 4 and 8 hours.

When a session expires, the web application must take active actions to invalidate the session on both sides, client and server. The latter is the most relevant and mandatory from a security perspective.

For most session exchange mechanisms, client side actions to invalidate the session ID are based on clearing out the token value. For example, to invalidate a cookie it is recommended to provide an empty (or invalid) value for the session ID, and set the `Expires` (or `Max-Age`) attribute to a date from the past (in case a persistent cookie is being used): `Set-Cookie: id=; Expires=Friday, 17-May-03 18:45:00 GMT`

In order to close and invalidate the session on the server side, it is mandatory for the web application to take active actions when the session expires, or the user actively logs out, by using the functions and methods offered by the session management mechanisms, such as `HttpSession.invalidate()` (J2EE), `Session.Abandon()` (ASP .NET) or `session_destroy()/unset()` (PHP).

### Automatic Session Expiration

#### Idle Timeout

All sessions should implement an idle or inactivity timeout. This timeout defines the amount of time a session will remain active in case there is no activity in the session, closing and invalidating the session upon the defined idle period since the last HTTP request received by the web application for a given session ID.

The idle timeout limits the chances an attacker has to guess and use a valid session ID from another user. However, if the attacker is able to hijack a given session, the idle timeout does not limit the attacker's actions, as they can generate activity on the session periodically to keep the session active for longer periods of time.

Session timeout management and expiration must be enforced server-side. If the client is used to enforce the session timeout, for example using the session token or other client parameters to track time references (e.g. number of minutes since login time), an attacker could manipulate these to extend the session duration.

#### Absolute Timeout

All sessions should implement an absolute timeout, regardless of session activity. This timeout defines the maximum amount of time a session can be active, closing and invalidating the session upon the defined absolute period since the given session was initially created by the web application. After invalidating the session, the user is forced to (re)authenticate again in the web application and establish a new session.

The absolute session limits the amount of time an attacker can use a hijacked session and impersonate the victim user.

#### Renewal Timeout

Alternatively, the web application can implement an additional renewal timeout after which the session ID is automatically renewed, in the middle of the user session, and independently of the session activity and, therefore, of the idle timeout.

After a specific amount of time since the session was initially created, the web application can regenerate a new ID for the user session and try to set it, or renew it, on the client. The previous session ID value would still be valid for some time, accommodating a safety interval, before the client is aware of the new ID and starts using it. At that time, when the client switches to the new ID inside the current session, the application invalidates the previous ID.

This scenario minimizes the amount of time a given session ID value, potentially obtained by an attacker, can be reused to hijack the user session, even when the victim user session is still active. The user session remains alive and open on the legitimate client, although its associated session ID value is transparently renewed periodically during the session duration, every time the renewal timeout expires. Therefore, the renewal timeout complements the idle and absolute timeouts, specially when the absolute timeout value extends significantly over time (e.g. it is an application requirement to keep the user sessions open for long periods of time).

Depending on the implementation, potentially there could be a race condition where the attacker with a still valid previous session ID sends a request before the victim user, right after the renewal timeout has just expired, and obtains first the value for the renewed session ID. At least in this scenario, the victim user might be aware of the attack as the session will be suddenly terminated because the associated session ID is not valid anymore.

### Manual Session Expiration

Web applications should provide mechanisms that allow security aware users to actively close their session once they have finished using the web application.

#### Logout Button

Web applications must provide a visible and easily accessible logout (logoff, exit, or close session) button that is available on the web application header or menu and reachable from every web application resource and page, so that the user can manually close the session at any time. As described in *Session_Expiration* section, the web application must invalidate the session at least on server side.

**NOTE**: Unfortunately, not all web applications facilitate users to close their current session. Thus, client-side enhancements allow conscientious users to protect their sessions by helping to close them diligently.

### Web Content Caching and Clear-Site-Data

Even after the session has ended, private or sensitive data exchanged during the session may still be accessible through the web browser's cache. To mitigate this, web applications must use restrictive cache directives for all HTTP and HTTPS traffic. This includes the use of HTTP headers such as [`Cache-Control`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control) and [`Pragma`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Pragma), or equivalent `<meta>` tags on all pages—especially those displaying sensitive content.

Session identifiers must never be cached. To prevent this, it is highly recommended to include the `Cache-Control: no-store` directive in responses containing session IDs. Unlike `no-cache`, which allows caching but requires revalidation, `no-store` ensures that the response (including headers like `Set-Cookie`) is never stored in any cache.

In addition to preventing future caching, applications should ensure that previously stored sensitive data is removed when a session ends. This can be achieved by returning the Clear-Site-Data response header (for example, `Clear-Site-Data: "cache", "cookies", "storage"`) during logout or session termination. This instructs the browser to delete cached resources, cookies, and other client-side storage associated with the origin, helping ensure a complete session cleanup.

> **Note:** The directive `Cache-Control: no-cache="Set-Cookie, Set-Cookie2"` is sometimes suggested to prevent session ID caching. However, this syntax is not widely supported and may lead to unintended behavior. Instead, use `Cache-Control: no-store` for stronger protection. `Clear-Site-Data: cache` can be used to clear every stored response for a site in the browser cache, so use this with care. Note that this will not affect shared or intermediate caches.
> **Reference:** [MDN - Cache-Control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control) and [MDN - Clear-Site-Data header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Clear-Site-Data)

## Reauthentication After Risk Events

To ensure session integrity and account protection, applications should require reauthentication when specific high-risk events are detected. These may include:

- Attempted or completed password changes
- Login from a new or suspicious IP address or device
- Completion of account recovery or challenge flows (e.g., hacked-lock scenarios)

Requiring reauthentication helps mitigate session hijacking and unauthorized access—especially when long-lived sessions or external identity providers are in use.

**Recommended Practices:**

- Prompt users for primary credentials (e.g., password) or enforce MFA
- Provide clear messaging explaining the need to reauthenticate

## Additional Client-Side Defenses for Session Management

Web applications can complement the previously described session management defenses with additional countermeasures on the client side. Client-side protections, typically in the form of JavaScript checks and verifications, are not bullet proof and can easily be defeated by a skilled attacker, but can introduce another layer of defense that has to be bypassed by intruders.

### Initial Login Timeout

Web applications can use JavaScript code in the login page to evaluate and measure the amount of time since the page was loaded and a session ID was granted. If a login attempt is tried after a specific amount of time, the client code can notify the user that the maximum amount of time to log in has passed and reload the login page, hence retrieving a new session ID.

This extra protection mechanism tries to force the renewal of the session ID pre-authentication, avoiding scenarios where a previously used (or manually set) session ID is reused by the next victim using the same computer, for example, in session fixation attacks.

### Force Session Logout On Web Browser Window Close Events

Web applications can use JavaScript code to capture all the web browser tab or window close (or even back) events and take the appropriate actions to close the current session before closing the web browser, emulating that the user has manually closed the session via the logout button.

### Disable Web Browser Cross-Tab Sessions

Web applications can use JavaScript code once the user has logged in and a session has been established to force the user to re-authenticate if a new web browser tab or window is opened against the same web application. The web application does not want to allow multiple web browser tabs or windows to share the same session. Therefore, the application tries to force the web browser to not share the same session ID simultaneously between them.

**NOTE**: This mechanism cannot be implemented if the session ID is exchanged through cookies, as cookies are shared by all web browser tabs/windows.

### Automatic Client Logout

JavaScript code can be used by the web application in all (or critical) pages to automatically logout client sessions after the idle timeout expires, for example, by redirecting the user to the logout page (the same resource used by the logout button mentioned previously).

The benefit of enhancing the server-side idle timeout functionality with client-side code is that the user can see that the session has finished due to inactivity, or even can be notified in advance that the session is about to expire through a count down timer and warning messages. This user-friendly approach helps to avoid loss of work in web pages that require extensive input data due to server-side silently expired sessions.

## Session Attacks Detection

### Session ID Guessing and Brute Force Detection

If an attacker tries to guess or brute force a valid session ID, they need to launch multiple sequential requests against the target web application using different session IDs from a single (or set of) IP address(es). Additionally, if an attacker tries to analyze the predictability of the session ID (e.g. using statistical analysis), they need to launch multiple sequential requests from a single (or set of) IP address(es) against the target web application to gather new valid session IDs.

Web applications must be able to detect both scenarios based on the number of attempts to gather (or use) different session IDs and alert and/or block the offending IP address(es).

### Detecting Session ID Anomalies

Web applications should focus on detecting anomalies associated to the session ID, such as its manipulation. The OWASP [AppSensor Project](https://owasp.org/www-project-appsensor/) provides a framework and methodology to implement built-in intrusion detection capabilities within web applications focused on the detection of anomalies and unexpected behaviors, in the form of detection points and response actions. Instead of using external protection layers, sometimes the business logic details and advanced intelligence are only available from inside the web application, where it is possible to establish multiple session related detection points, such as when an existing cookie is modified or deleted, a new cookie is added, the session ID from another user is reused, or when the user location or User-Agent changes in the middle of a session.

### Binding the Session ID to Other User Properties

With the goal of detecting (and, in some scenarios, protecting against) user misbehaviors and session hijacking, it is highly recommended to bind the session ID to other user or client properties, such as the client IP address, User-Agent, or client-based digital certificate. If the web application detects any change or anomaly between these different properties in the middle of an established session, this is a very good indicator of session manipulation and hijacking attempts, and this simple fact can be used to alert and/or terminate the suspicious session.

Although these properties cannot be used by web applications to trustingly defend against session attacks, they significantly increase the web application detection (and protection) capabilities. However, a skilled attacker can bypass these controls by reusing the same IP address assigned to the victim user by sharing the same network (very common in NAT environments, like Wi-Fi hotspots) or by using the same outbound web proxy (very common in corporate environments), or by manually modifying the User-Agent to look exactly like the victim user's.

### Logging Sessions Life Cycle: Monitoring Creation, Usage, and Destruction of Session IDs

Web applications should increase their logging capabilities by including information regarding the full life cycle of sessions. In particular, it is recommended to record session related events, such as the creation, renewal, and destruction of session IDs, as well as details about its usage within login and logout operations, privilege level changes within the session, timeout expiration, invalid session activities (when detected), and critical business operations during the session.

The log details might include a timestamp, source IP address, web target resource requested (and involved in a session operation), HTTP headers (including the User-Agent and Referer), GET and POST parameters, error codes and messages, username (or user ID), plus the session ID (cookies, URL, GET, POST…).

Sensitive data like the session ID should not be included in the logs in order to protect the session logs against session ID local or remote disclosure or unauthorized access. However, some kind of session-specific information must be logged in order to correlate log entries to specific sessions. It is recommended to log a salted-hash of the session ID instead of the session ID itself in order to allow for session-specific log correlation without exposing the session ID.

In particular, web applications must thoroughly protect administrative interfaces that allow to manage all the current active sessions. Frequently these are used by support personnel to solve session related issues, or even general issues, by impersonating the user and looking at the web application as the user does.

The session logs become one of the main web application intrusion detection data sources, and can also be used by intrusion protection systems to automatically terminate sessions and/or disable user accounts when (one or many) attacks are detected. If active protections are implemented, these defensive actions must be logged too.

### Simultaneous Session Logons

It is the web application design decision to determine if multiple simultaneous logons from the same user are allowed from the same or from different client IP addresses. If the web application does not want to allow simultaneous session logons, it must take effective actions after each new authentication event, implicitly terminating the previously available session, or asking the user (through the old, new or both sessions) about the session that must remain active.

It is recommended for web applications to add user capabilities that allow checking the details of active sessions at any time, monitor and alert the user about concurrent logons, provide user features to remotely terminate sessions manually, and track account activity history (logbook) by recording multiple client details such as IP address, User-Agent, login date and time, idle time, etc.

## Session Management WAF Protections

There are situations where the web application source code is not available or cannot be modified, or when the changes required to implement the multiple security recommendations and best practices detailed above imply a full redesign of the web application architecture, and therefore, cannot be easily implemented in the short term.

In these scenarios, or to complement the web application defenses, and with the goal of keeping the web application as secure as possible, it is recommended to use external protections such as Web Application Firewalls (WAFs) that can mitigate the session management threats already described.

Web Application Firewalls offer detection and protection capabilities against session based attacks. On the one hand, it is trivial for WAFs to enforce the usage of security attributes on cookies, such as the `Secure` and `HttpOnly` flags, applying basic rewriting rules on the `Set-Cookie` header for all the web application responses that set a new cookie.

On the other hand, more advanced capabilities can be implemented to allow the WAF to keep track of sessions, and the corresponding session IDs, and apply all kind of protections against session fixation (by renewing the session ID on the client-side when privilege changes are detected), enforcing sticky sessions (by verifying the relationship between the session ID and other client properties, like the IP address or User-Agent), or managing session expiration (by forcing both the client and the web application to finalize the session).

The open-source ModSecurity WAF, plus the OWASP [Core Rule Set](https://owasp.org/www-project-modsecurity-core-rule-set/), provide capabilities to detect and apply security cookie attributes, countermeasures against session fixation attacks, and session tracking features to enforce sticky sessions.

</section>

<section id="session-management-translation-panel" className="tabPanel translationPanel contentPanel">

# セッション管理チートシート

## はじめに

**Web 認証、セッション管理、アクセス制御**:

Web セッションとは、同じユーザーに関連付けられた一連の HTTP リクエストとレスポンスのネットワークトランザクションです。現代の複雑な Web アプリケーションでは、複数のリクエストの間、各ユーザーに関する情報や状態を保持する必要があります。そのためセッションは、アクセス権やローカライズ設定など、セッション期間中にユーザーが Web アプリケーションと行うすべてのやり取りへ適用される変数を確立する機能を提供します。

Web アプリケーションは、最初のユーザーリクエスト後に匿名ユーザーを追跡するためにセッションを作成できます。たとえばユーザーの言語設定を維持する場合です。さらに Web アプリケーションは、ユーザーが認証された後にもセッションを使用します。これにより、以後のリクエストでユーザーを識別し、セキュリティアクセス制御を適用し、ユーザーのプライベートデータへの認可済みアクセスを扱い、アプリケーションの使いやすさを高められます。したがって、現在の Web アプリケーションは認証前と認証後の両方でセッション機能を提供できます。

認証済みセッションが確立されると、セッション ID (またはトークン) は、ユーザー名とパスワード、パスフレーズ、ワンタイムパスワード (OTP)、クライアントベースのデジタル証明書、スマートカード、生体認証 (指紋や網膜など) といった、アプリケーションが使用した最も強い認証方式と一時的に同等になります。OWASP [Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html) を参照してください。

HTTP はステートレスなプロトコル ([RFC2616](https://www.ietf.org/rfc/rfc2616.txt) section 5) であり、各リクエストとレスポンスのペアは他の Web 上のやり取りから独立しています。したがって、セッションという概念を導入するには、Web アプリケーションで一般に利用される認証モジュールとアクセス制御 (または認可) モジュールを結び付けるセッション管理機能を実装する必要があります。

![SessionDiagram](https://cheatsheetseries.owasp.org/assets/Session_Management_Cheat_Sheet_Diagram.png)

セッション ID またはトークンは、ユーザー認証資格情報 (ユーザーセッションの形) を、ユーザーの HTTP トラフィックおよび Web アプリケーションが強制する適切なアクセス制御に結び付けます。現代の Web アプリケーションでは、認証、セッション管理、アクセス制御という三つのコンポーネントが複雑であり、さらに Web 開発フレームワークはこれらのモジュール間に厳密な関係を提供しないため、その実装と結合は Web 開発者の手に委ねられています。このことが、安全なセッション管理モジュールの実装を非常に難しくしています。

セッション ID の漏えい、取得、予測、総当たり、または固定化は、セッションハイジャック (またはサイドジャッキング) 攻撃につながります。この攻撃では、攻撃者が Web アプリケーション内で被害者ユーザーになりすますことができます。攻撃者は標的型と汎用型の二種類のセッションハイジャック攻撃を実行できます。標的型攻撃では、特定の (または特権を持つ) Web アプリケーション利用者になりすますことが攻撃者の目的です。汎用型攻撃では、Web アプリケーション内の任意の有効または正当なユーザーになりすますこと、またはそのユーザーとしてアクセスすることが目的です。

## セッション ID の性質

認証済み状態を維持し、Web アプリケーション内でのユーザーの進行状況を追跡するために、アプリケーションはユーザーへ **セッション識別子** (セッション ID またはトークン) を提供します。これはセッション作成時に割り当てられ、セッション期間中、ユーザーと Web アプリケーションの間で共有および交換されます (すべての HTTP リクエストで送信されます)。セッション ID は `name=value` ペアです。

安全なセッション ID を実装するには、識別子 (ID またはトークン) の生成が次の性質を満たす必要があります。

### セッション ID 名のフィンガープリンティング

セッション ID に使用する名前は、極端に説明的であったり、ID の目的や意味について不要な詳細を提供したりすべきではありません。

一般的な Web アプリケーション開発フレームワークで使われるセッション ID 名は、`PHPSESSID` (PHP)、`JSESSIONID` (J2EE)、`CFID` と `CFTOKEN` (ColdFusion)、`ASP.NET_SessionId` (ASP .NET) などのように、[容易にフィンガープリントできます](https://wiki.owasp.org/index.php/Category:OWASP_Cookies_Database)。したがって、セッション ID 名は Web アプリケーションで使用されている技術やプログラミング言語を明らかにする可能性があります。

Web 開発フレームワークの既定のセッション ID 名は、`id` などの汎用的な名前に変更することが推奨されます。

### セッション ID のエントロピー

セッション識別子は、総当たりによるセッション推測攻撃を防ぐために、少なくとも `64 bits` のエントロピーを持たなければなりません。エントロピーとは、値に含まれるランダム性または予測不能性の量です。エントロピーの各「ビット」は可能な結果数を倍にするため、64 ビットのエントロピーを持つセッション ID は `2^64` 個の可能な値を持てます。

セッション ID の生成には、強力な [CSPRNG](https://en.wikipedia.org/wiki/Cryptographically_secure_pseudorandom_number_generator) (Cryptographically Secure Pseudorandom Number Generator、暗号論的に安全な疑似乱数生成器) を使用しなければなりません。これにより、生成される値はすべての可能な値の間で均等に分布します。そうでない場合、攻撃者は統計分析手法を使ってセッション ID の生成方法に含まれるパターンを特定でき、実効エントロピーを下げ、有効なセッション ID をより容易に推測または予測できるようになります。

**注記**:

- 攻撃者が有効なセッション ID を総当たりで見つけるまでの期待時間は、エントロピーのビット数、アクティブセッション数、セッション有効期限、攻撃者の推測速度などの要因に依存します。
- Web アプリケーションが 64 ビットのエントロピーを持つセッション ID を生成する場合、攻撃者が毎秒 10,000 回の推測を実行でき、アプリケーション内に 100,000 個の有効な同時セッションがあると仮定すると、有効なセッション ID の推測に成功するまで約 585 年かかると期待されます。
- セッション識別子の総当たりに必要な期待時間についてのさらなる分析は、[こちら](https://owasp.org/www-community/vulnerabilities/Insufficient_Session-ID_Length#estimating-attack-time)で入手できます。

### セッション ID の長さ

前の *セッション ID のエントロピー* セクションで述べたように、セッション ID の主要なセキュリティ要件は、総当たり推測攻撃を防ぐために少なくとも `64 bits` のエントロピーを含むことです。セッション ID の長さは重要ですが、セキュリティを保証するのはエントロピーです。セッション ID は十分なエントロピーをエンコードできる長さを持ち、攻撃者が有効なセッション ID を推測する総当たり攻撃を防がなければなりません。

エンコード方式が異なると、同じエントロピー量でも必要な長さが異なることがあります。セッション ID はしばしば 16 進エンコードで表現されます。16 進エンコードを使用する場合、必要な 64 ビットのエントロピーを達成するには、セッション ID は少なくとも 16 個の 16 進文字でなければなりません。Base64 や [ASP.NET セッション ID 用の Microsoft のエンコード](https://docs.microsoft.com/en-us/dotnet/api/system.web.sessionstate.sessionidmanager?redirectedfrom=MSDN&view=netframework-4.7.2) など、異なるエンコードを使用する場合、最小 64 ビットのエントロピーを表現するために必要な文字数は異なる可能性があります。

セッション ID の一部が固定または予測可能である場合、実効エントロピーは低下し、それを補うために長さを増やす必要があるかもしれない点が重要です。たとえば、16 文字の 16 進セッション ID の半分が固定されている場合、残りの 8 文字だけがランダムであり、32 ビットのエントロピーしか提供しません。これは強力なセキュリティには不十分です。セキュリティを維持するには、セッション ID 全体がランダムに生成され予測不能であることを確認するか、ID の一部がランダムでない場合は全体の長さを増やしてください。

**注記**:

- セッション ID の長さとセッション ID のエントロピーの関係についての詳細は、[こちら](https://owasp.org/www-community/vulnerabilities/Insufficient_Session-ID_Length#session-id-length-and-entropy-relationship)で入手できます。

### セッション ID の内容 (または値)

セッション ID の内容 (または値) は、情報漏えい攻撃を防ぐため、意味のないものでなければなりません。意味を持つ値では、攻撃者が ID の内容をデコードし、ユーザー、セッション、または Web アプリケーション内部の動作に関する詳細を抽出できる可能性があります。

セッション ID はクライアント側では単なる識別子でなければならず、その値に機密情報や個人識別情報 (PII) を決して含めてはなりません。PII について詳しくは、[Wikipedia](https://en.wikipedia.org/wiki/Personally_identifiable_information) またはこの[投稿](https://www.idshield.com/blog/identity-theft/what-pii-and-why-should-i-care/)を参照してください。

セッション ID に関連する意味、ビジネスロジック、またはアプリケーションロジックはサーバー側に保存しなければならず、具体的にはセッションオブジェクト、またはセッション管理データベースやリポジトリに保存します。

保存される情報には、クライアント IP アドレス、User-Agent、メールアドレス、ユーザー名、ユーザー ID、ロール、権限レベル、アクセス権、言語設定、アカウント ID、現在の状態、最終ログイン、セッションタイムアウト、その他の内部セッション詳細が含まれる場合があります。セッションオブジェクトやプロパティにクレジットカード番号などの機密情報が含まれる場合は、セッション管理リポジトリを適切に暗号化し保護する必要があります。

言語やフレームワークが作成するセッション ID を使用することが推奨されます。独自の sessionID を作成する必要がある場合は、少なくとも 128 ビットのサイズを持つ暗号論的に安全な疑似乱数生成器 (CSPRNG) を使用し、各 sessionID が一意であることを確認してください。

## セッション管理の実装

セッション管理の実装は、ユーザーと Web アプリケーションの間でセッション ID を共有し継続的に交換するために使用される交換メカニズムを定義します。Web アプリケーション内でセッション状態を維持するために、HTTP では複数のメカニズムが利用できます。たとえば Cookie (標準 HTTP ヘッダー)、URL パラメータ (URL rewriting - [RFC2396](https://www.ietf.org/rfc/rfc2396.txt))、GET リクエストの URL 引数、POST リクエストのボディ引数、hidden form fields (HTML フォーム)、独自 HTTP ヘッダーなどです。

推奨されるセッション ID 交換メカニズムは、トークンの有効期限日時や細かな利用制約など、高度なトークンプロパティを定義できるべきです。これが、Cookie (RFC [2109](https://www.ietf.org/rfc/rfc2109.txt)、[2965](https://www.ietf.org/rfc/rfc2965.txt)、[6265](https://www.ietf.org/rfc/rfc6265.txt)) が最も広く使われるセッション ID 交換メカニズムの一つであり、他の方式では利用できない高度な機能を提供する理由の一つです。

ID が URL に含まれる方式など、特定のセッション ID 交換メカニズムを使用すると、Web リンクやログ、Web ブラウザの履歴やブックマーク、Referer ヘッダー、検索エンジンでセッション ID が漏えいする可能性があります。また、ID の改ざんや[セッション固定攻撃](https://www.acrossecurity.com/papers/session_fixation.pdf)など、他の攻撃も容易にします。

### 組み込みのセッション管理実装

J2EE、ASP .NET、PHP などの Web 開発フレームワークは、それぞれ独自のセッション管理機能と関連実装を提供しています。これらは世界中の複数の Web 環境で使用され、Web アプリケーションセキュリティおよび開発コミュニティによって長期間テストされているため、自作のものを一から構築するよりも、これらの組み込みフレームワークを使用することが推奨されます。

ただし、これらのフレームワークにも過去に脆弱性や弱点が存在したことに注意してください。そのため、よく知られた脆弱性を修正している可能性がある最新バージョンを常に使用し、この文書で説明する推奨事項に従って、セキュリティを強化するために既定設定を見直し変更することが常に推奨されます。

セッション ID を一時的に保存するためにセッション管理メカニズムが使用するストレージ機能またはリポジトリは、安全でなければなりません。ローカルまたはリモートでの偶発的な漏えいや不正アクセスからセッション ID を保護する必要があります。

### 使用する交換メカニズムと受け入れる交換メカニズム

Web アプリケーションは、セッション ID 交換管理に Cookie を使用すべきです。ユーザーが URL パラメータなど、異なる交換メカニズムでセッション ID を送信した場合、Web アプリケーションはセッション固定を止める防御戦略の一部として、それを受け入れることを避けるべきです。

**注記**:

- Web アプリケーションが Cookie を既定のセッション ID 交換メカニズムとして使用していても、他の交換メカニズムも受け入れている可能性があります。
- したがって、セッション ID を処理および管理するときに Web アプリケーションが現在受け入れているすべてのメカニズムを徹底的なテストで確認し、受け入れるセッション ID 追跡メカニズムを Cookie のみに制限する必要があります。
- 過去には、Cookie をサポートしない、またはプライバシー上の懸念から Cookie を受け入れない Web クライアントの識別など、特定の条件が満たされた場合に URL パラメータを使用したり、Cookie から URL パラメータへ (自動 URL rewriting により) 切り替えたりする Web アプリケーションがありました。

### トランスポート層セキュリティ

ネットワークトラフィックでの能動的な盗聴と受動的な漏えいからセッション ID 交換を保護するには、ユーザー資格情報が交換される認証プロセスだけでなく、Web セッション全体で暗号化された HTTPS (TLS) 接続を使用することが不可欠です。これをサポートするクライアントでは、[HTTP Strict Transport Security (HSTS)](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Strict_Transport_Security_Cheat_Sheet.html) によって軽減できます。

さらに、セッション ID が暗号化チャネルを通してのみ交換されることを保証するために、`Secure` [Cookie 属性](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#Secure_and_HttpOnly_cookies)を使用しなければなりません。暗号化された通信チャネルの使用は、攻撃者が Web トラフィックを傍受して操作し、被害者の Web ブラウザにセッション ID を注入 (または固定) できる一部のセッション固定攻撃からもセッションを保護します。

次のベストプラクティスは、セッション ID (特に Cookie が使われる場合) を保護し、Web アプリケーションで HTTPS を統合しやすくすることに焦点を当てています。

- あるセッションを HTTP から HTTPS へ、またはその逆へ切り替えないでください。ネットワーク上でセッション ID が平文で漏えいします。
    - HTTPS へリダイレクトする場合は、リダイレクトが完了した **後** に Cookie を設定または再生成してください。
- 暗号化されたコンテンツと暗号化されていないコンテンツ (HTML ページ、画像、CSS、JavaScript ファイルなど) を、同じページまたは同じドメインから混在させないでください。
- 可能であれば、公開の暗号化されていないコンテンツと、非公開の暗号化されたコンテンツを同じホストから提供することは避けてください。安全でないコンテンツが必要な場合は、別の安全でないドメインでホストすることを検討してください。
- HTTPS 接続を強制するために [HTTP Strict Transport Security (HSTS)](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Strict_Transport_Security_Cheat_Sheet.html) を実装してください。

TLS を安全に実装するための一般的なガイダンスについては、OWASP [Transport Layer Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html) を参照してください。

TLS はセッション ID の予測、総当たり、クライアント側の改ざん、固定化を防ぐものではないことを強調しておくことが重要です。しかし、攻撃者が中間者攻撃によってセッション ID を傍受または盗むことに対しては有効な保護を提供します。

## Cookie

Cookie に基づくセッション ID 交換メカニズムは、セッション ID の交換を保護するために使用できる Cookie 属性という形で、複数のセキュリティ機能を提供します。

### Secure 属性

`Secure` Cookie 属性は、暗号化された HTTPS (SSL/TLS) 接続を通してのみ Cookie を送信するよう Web ブラウザに指示します。このセッション保護メカニズムは、MitM (Man-in-the-Middle、中間者) 攻撃によるセッション ID の漏えいを防ぐために必須です。これにより、攻撃者が Web ブラウザのトラフィックから単純にセッション ID を取得できないようにします。

Web アプリケーションが通信に HTTPS のみを使用するよう強制していても (Web アプリケーションホストで TCP/80、HTTP ポートが閉じられている場合でも)、`Secure` Cookie が設定されていなければセッション ID の漏えいは防げません。Web ブラウザはだまされて、暗号化されていない HTTP 接続上でセッション ID を漏えいする可能性があります。攻撃者は被害者ユーザーのトラフィックを傍受および操作し、Web アプリケーションへの暗号化されていない HTTP 参照を注入して、Web ブラウザにセッション ID を平文で送信させることができます。

関連項目: [SecureFlag](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#Secure_and_HttpOnly_cookies)

### HttpOnly 属性

`HttpOnly` Cookie 属性は、DOM の document.cookie オブジェクトを介してスクリプト (JavaScript や VBscript など) が Cookie にアクセスする能力を許可しないよう Web ブラウザに指示します。このセッション ID 保護は、XSS 攻撃によるセッション ID の窃取を防ぐために必須です。ただし、XSS 攻撃が CSRF 攻撃と組み合わされた場合、ブラウザはリクエスト送信時に常に Cookie を含めるため、Web アプリケーションへ送信されるリクエストにはセッション Cookie が含まれます。`HttpOnly` Cookie は Cookie の機密性だけを保護します。攻撃者は、XSS 攻撃の文脈外で、オフラインでそれを使用することはできません。

OWASP [XSS (Cross Site Scripting) Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html) を参照してください。

関連項目: [HttpOnly](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#Secure_and_HttpOnly_cookies)

### SameSite 属性

`SameSite` 属性は、クロスサイトリクエストでブラウザが Cookie を送信することを防ぎ、クロスオリジン漏えいを軽減し、CSRF 防御を提供します。セッション Cookie は `SameSite=Strict` (推奨) または `SameSite=Lax` を明示的に設定しなければなりません。`Secure` なしで `SameSite=None` を使用してはならず、ブラウザやバージョンによって異なるブラウザ既定値に依存してはいけません。

関連項目: [SameSite](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#SameSite_cookies)

### Cookie 名プレフィックス

Cookie 名プレフィックスを使用して、ブラウザレベルで Cookie をセキュリティプロパティに結び付けます ([RFC 6265bis §4.1.3](https://datatracker.ietf.org/doc/html/draft-ietf-httpbis-rfc6265bis))。

- `__Host-` - Cookie は `Secure` とともに設定されなければならず、`Domain` 属性を持ってはならず、`Path=/` を使用しなければなりません。サブドメイン偽造と HTTPS ダウングレード攻撃を防ぎます。**セッション ID に推奨されます。**
- `__Secure-` - Cookie は `Secure` とともに設定されなければなりません。サブドメイン共有が必要な場合にのみ使用してください。

例:

```http
Set-Cookie: __Host-SessionID=<value>; Secure; HttpOnly; SameSite=Strict; Path=/
```

### Domain 属性と Path 属性

[`Domain` Cookie 属性](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#Directives)は、指定されたドメインおよびすべてのサブドメインにのみ Cookie を送信するよう Web ブラウザに指示します。この属性が設定されていない場合、既定では Cookie はオリジンサーバーにのみ送信されます。[`Path` Cookie 属性](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#Directives)は、Web アプリケーション内の指定されたディレクトリまたはサブディレクトリ (またはパスやリソース) にのみ Cookie を送信するよう Web ブラウザに指示します。この属性が設定されていない場合、既定では Cookie を設定したリクエスト対象リソースのディレクトリ (またはパス) に対してのみ送信されます。

これら二つの属性には、狭く制限されたスコープを使用することが推奨されます。つまり、`Domain` 属性は設定せず (Cookie をオリジンサーバーのみに制限する)、`Path` 属性はセッション ID を使用する Web アプリケーションパスにできる限り制限して設定すべきです。

`Domain` 属性を `example.com` など過度に許容的な値に設定すると、同じドメインに属する異なるホストや Web アプリケーション間で、攻撃者がセッション ID に対する攻撃を行えるようになります。これは cross-subdomain cookies として知られています。たとえば、`www.example.com` の脆弱性により、攻撃者が `secure.example.com` のセッション ID にアクセスできる可能性があります。

さらに、異なるセキュリティレベルの Web アプリケーションを同じドメイン上で混在させないことが推奨されます。いずれかの Web アプリケーションの脆弱性により、攻撃者は `example.com` のような許容的な `Domain` 属性を使って、同じドメイン上の別の Web アプリケーションに対してセッション ID を設定できる可能性があります。これは[セッション固定攻撃](https://www.acrossecurity.com/papers/session_fixation.pdf)で使用される技法です。

`Path` 属性は、同じホスト上で異なるパスを使う Web アプリケーション間でセッション ID を分離できますが、異なる Web アプリケーション (特に異なるセキュリティレベルまたはスコープのもの) を同じホスト上で動かさないことが強く推奨されます。これらのアプリケーションは `document.cookie` オブジェクトなど、他の方法でセッション ID にアクセスできる可能性があります。また、どの Web アプリケーションもそのホスト上の任意のパスに Cookie を設定できます。

Cookie は DNS spoofing/hijacking/poisoning 攻撃に対して脆弱です。攻撃者が DNS 解決を操作し、特定のホストまたはドメインのセッション ID を Web ブラウザに漏えいさせることができます。

### Expires 属性と Max-Age 属性

Cookie に基づくセッション管理メカニズムは、非永続 (またはセッション) Cookie と永続 Cookie の二種類の Cookie を使用できます。Cookie が [`Max-Age`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#Directives) (`Expires` より優先されます) または [`Expires`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#Directives) 属性を持つ場合、その Cookie は永続 Cookie と見なされ、有効期限まで Web ブラウザによってディスクに保存されます。

通常、認証後にユーザーを追跡するセッション管理機能は非永続 Cookie を使用します。これにより、現在の Web ブラウザインスタンスが閉じられると、クライアントからセッションが消えます。したがって、セッション管理目的では非永続 Cookie を使用することが強く推奨されます。これにより、攻撃者が取得できる Web クライアントキャッシュにセッション ID が長期間残らないようにします。

- 機密情報が永続化されないこと、暗号化されること、必要な期間だけ保存されることを確認し、侵害されないようにします。
- Cookie 操作によって不正な活動が発生できないことを確認します。
- 安全でない方法でネットワーク上に誤って送信されることを防ぐため、secure flag が設定されていることを確認します。
- アプリケーションコード内のすべての状態遷移が Cookie を適切に確認し、その使用を強制しているかを判断します。
- 機密データが Cookie に永続化される場合は、Cookie 全体を暗号化すべきです。
- アプリケーションが使用しているすべての Cookie、その名前、および必要な理由を定義します。

## HTML5 Web Storage API

Web Hypertext Application Technology Working Group (WHATWG) は、HTML5 Web Storage API である `localStorage` と `sessionStorage` を、クライアント側で name-value ペアを保存するメカニズムとして説明しています。
HTTP Cookie とは異なり、`localStorage` と `sessionStorage` の内容はブラウザによってリクエストやレスポンス内で自動的に共有されず、クライアント側でデータを保存するために使用されます。

### localStorage API

> [!WARNING]
> 認証トークン、セッション ID、JWT、リフレッシュトークン、または資格情報を `localStorage` や `sessionStorage` に保存してはいけません。これらの API は、同じオリジンで実行されるすべての JavaScript からアクセスできるため、一つの XSS 脆弱性ですべてのトークンが漏えいします。`HttpOnly; Secure; SameSite=Strict` Cookie (推奨) または Backend-for-Frontend (BFF) パターンを使用してください。[OAuth 2.0 for Browser-Based Apps](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-browser-based-apps) を参照してください。

#### スコープ

`localStorage` API を使って保存されたデータは、同じオリジンから読み込まれたページからアクセスできます。オリジンは、スキーム (`https://`)、ホスト (`example.com`)、ポート (`443`)、ドメイン/レルム (`example.com`) で定義されます。

これは Cookie の `secure` flag を使用した場合と同様のアクセスをこのデータに提供します。つまり、`https` から保存されたデータは `http` 経由では取得できません。別々のウィンドウやスレッドからの同時アクセスの可能性があるため、`localStorage` に保存されたデータは共有アクセスの問題 (競合状態など) の影響を受ける可能性があり、非ロックであると考えるべきです ([Web Storage API Spec](https://html.spec.whatwg.org/multipage/webstorage.html#the-localstorage-attribute))。

#### 期間

`localStorage` API を使って保存されたデータはブラウジングセッションをまたいで永続化され、他のシステムユーザーからアクセスされ得る時間枠を広げます。

#### オフラインアクセス

標準は `localStorage` データの保存時暗号化を要求していないため、ディスクから直接このデータにアクセスできる可能性があります。

#### ユースケース

WHATWG は、ウィンドウやタブをまたいで、複数セッションをまたいでアクセスする必要があるデータや、パフォーマンス上の理由から大容量 (数メガバイト) のデータを保存する必要がある場合に `localStorage` を使用することを提案しています。

### sessionStorage API

#### スコープ

`sessionStorage` API は、それが呼び出されたウィンドウコンテキスト内にデータを保存します。つまり、タブ 1 はタブ 2 から保存されたデータにアクセスできません。

また、`localStorage` API と同様に、`sessionStorage` API を使って保存されたデータは、同じオリジンから読み込まれたページからアクセスできます。オリジンは、スキーム (`https://`)、ホスト (`example.com`)、ポート (`443`)、ドメイン/レルム (`example.com`) で定義されます。これは Cookie の `secure` flag を使用した場合と同様のアクセスをこのデータに提供します。つまり、`https` から保存されたデータは `http` 経由では取得できません。

#### 期間

`sessionStorage` API は現在のブラウジングセッションの間だけデータを保存します。タブが閉じられると、そのデータは取得できなくなります。ただし、ブラウザタブが再利用されたり開いたまま残されたりした場合、アクセスを必ず防げるわけではありません。データはガベージコレクションイベントが発生するまでメモリに残ることもあります。

#### オフラインアクセス

標準は `sessionStorage` データの保存時暗号化を要求していないため、ディスクから直接このデータにアクセスできる可能性があります。

#### ユースケース

WHATWG は、チケット予約の詳細など、一つのワークフローインスタンスに関連するデータで、他のタブでは複数のワークフローが同時に実行され得る場合に `sessionStorage` を使用することを提案しています。ウィンドウ/タブに束縛される性質により、別々のタブにあるワークフロー間でデータが漏れることを防ぎます。

## Web Workers

Web Workers は、現在のウィンドウとは別のグローバルコンテキストで JavaScript コードを実行します。メイン実行ウィンドウとの通信チャネルが存在し、これは `MessageChannel` と呼ばれます。

### ユースケース

Web Workers は、ページ更新をまたいだストレージ永続化が要件でない場合に、ブラウザで (セッション) シークレットを保存する代替手段です。Web Workers が安全なブラウザストレージを提供するには、シークレットを必要とするコードは Web Worker 内に存在すべきであり、シークレットをメインウィンドウコンテキストへ送信してはなりません。

Web Worker のメモリ内にシークレットを保存すると、HttpOnly Cookie と同じセキュリティ保証、すなわちシークレットの機密性保護が得られます。それでも、XSS 攻撃により Web Worker へメッセージを送信し、シークレットを必要とする操作を実行させることは可能です。Web Worker はその操作の結果をメイン実行スレッドへ返します。

HttpOnly Cookie と比較した Web Worker 実装の利点は、Web Worker が分離された一部の JavaScript コードにシークレットへのアクセスを許可できることです。HttpOnly Cookie はどの JavaScript からもアクセスできません。フロントエンド JavaScript コードがシークレットへのアクセスを必要とする場合、シークレットの機密性を保つブラウザストレージの選択肢は Web Worker 実装だけです。

## セッション ID のライフサイクル

### セッション ID の生成と検証: 許容型と厳格型のセッション管理

Web アプリケーションには、セッション固定脆弱性に関連する二種類のセッション管理メカニズム、許容型と厳格型があります。許容型メカニズムは、ユーザーが設定した任意のセッション ID 値を Web アプリケーションが最初に有効なものとして受け入れ、その値に対して新しいセッションを作成します。一方、厳格型メカニズムは、Web アプリケーションが以前に生成したセッション ID 値だけを受け入れるよう強制します。セッショントークンは、可能であれば Web サーバーによって処理されるか、暗号論的に安全な乱数生成器で生成されるべきです。

現在最も一般的に使用されているメカニズムは厳格型 (より安全) ですが、[PHP は既定で許容型](https://wiki.php.net/rfc/session-use-strict-mode)です。開発者は、特定の状況で Web アプリケーションが許容型メカニズムを使用しないようにしなければなりません。Web アプリケーションは、自身が生成したことのないセッション ID を決して受け入れるべきではありません。そのような ID を受け取った場合は、ユーザーに新しい有効なセッション ID を生成して提供すべきです。

さらに、このシナリオは疑わしい活動として検出され、アラートを生成すべきです。

### セッション ID を他のユーザー入力と同様に管理する

セッション ID は、Web アプリケーションが処理する他のユーザー入力と同じく信頼できないものと見なし、徹底的に検証および確認しなければなりません。使用されるセッション管理メカニズムによって、セッション ID は GET または POST パラメータ、URL、HTTP ヘッダー (Cookie など) で受信されます。

Web アプリケーションが無効なセッション ID 値を処理前に検証およびフィルタリングしない場合、セッション ID がリレーショナルデータベースに保存されていると SQL インジェクションに、セッション ID が保存され後で Web アプリケーションから反映されると永続 XSS に悪用されるなど、他の Web 脆弱性を悪用するために使われる可能性があります。

### 権限レベル変更後にセッション ID を更新する

関連付けられたユーザーセッション内で権限レベルが変更された後、Web アプリケーションはセッション ID を更新または再生成しなければなりません。セッション ID の再生成が必須となる最も一般的なシナリオは認証プロセスです。ユーザーの権限レベルが未認証 (または匿名) 状態から認証済み状態へ変化するためです。ただし、場合によってはまだ認可済み状態ではありません。

考慮すべき一般的なシナリオには、パスワード変更、権限変更、Web アプリケーション内で通常ユーザーロールから管理者ロールへ切り替わる場合が含まれます。Web アプリケーションのすべての機密ページについて、以前のセッション ID は無視されなければならず、保護されたリソースに対して受信される各新規リクエストには現在のセッション ID だけが割り当てられ、古いまたは以前のセッション ID は破棄されなければなりません。

最も一般的な Web 開発フレームワークは、`request.getSession(true)` と `HttpSession.invalidate()` (J2EE)、`Session.Abandon()` と `Response.Cookies.Add(new...)` (ASP .NET)、`session_start()` と `session_regenerate_id(true)` (PHP) など、セッション ID を更新するためのセッション関数やメソッドを提供しています。

セッション ID の再生成は、[セッション固定攻撃](https://www.acrossecurity.com/papers/session_fixation.pdf)を防ぐために必須です。この攻撃では、攻撃者は他の多くのセッションベース攻撃のように被害者のセッション ID を収集するのではなく、被害者ユーザーの Web ブラウザにセッション ID を設定します。これは HTTP または HTTPS の使用にかかわらず成立します。この保護は、HTTP response splitting や XSS など、セッション固定攻撃の起動にも使用できる他の Web ベース脆弱性の影響を軽減します ([こちら](https://media.blackhat.com/bh-eu-11/Raul_Siles/BlackHat_EU_2011_Siles_SAP_Session-Slides.pdf) と [こちら](https://media.blackhat.com/bh-eu-11/Raul_Siles/BlackHat_EU_2011_Siles_SAP_Session-WP.pdf)を参照)。

補完的な推奨事項として、認証前と認証後で異なるセッション ID またはトークン名 (またはセッション ID の集合) を使用し、Web アプリケーションが匿名ユーザーと認証済みユーザーを追跡できる一方で、両状態間でユーザーセッションを露出または結合するリスクを避けることが挙げられます。

### リスクイベント後の再認証

Web アプリケーションは、次のような高リスクイベント後に再認証を要求すべきです。

- 重要なユーザー情報 (パスワード、メールアドレスなど) の変更
- 新しい、または疑わしい IP アドレスやデバイスからのログイン試行
- アカウント復旧フロー (パスワードリセットや侵害アカウント検出など)

これらのイベント後に再認証を実装するベストプラクティスについては、Authentication Cheat Sheet の [Reauthentication After Risk Events](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#reauthentication-after-risk-events) セクションを参照してください。

### 追加リソース

- Tailscale による [Why Frequent Reauthentication Can Be a UX Pitfall](https://tailscale.com/blog/frequent-reauth-security?lid=5wso20mx4knj)

### 複数 Cookie 使用時の考慮事項

Web アプリケーションがセッション ID 交換メカニズムとして Cookie を使用し、あるセッションに対して複数の Cookie が設定される場合、Web アプリケーションはユーザーセッションへのアクセスを許可する前に、すべての Cookie を検証しなければなりません (かつ、それらの関係を強制しなければなりません)。

Web アプリケーションが、未認証 (または匿名) ユーザーを追跡するために、認証前に HTTP 上でユーザー Cookie を設定することは非常に一般的です。ユーザーが Web アプリケーションで認証されると、新しい認証後の安全な Cookie が HTTPS 上で設定され、両方の Cookie とユーザーセッションの間に結合が確立されます。Web アプリケーションが認証済みセッションで両方の Cookie を検証しない場合、攻撃者は認証前の保護されていない Cookie を使用して、認証済みユーザーセッションにアクセスできる可能性があります ([こちら](https://media.blackhat.com/bh-eu-11/Raul_Siles/BlackHat_EU_2011_Siles_SAP_Session-Slides.pdf) と [こちら](https://media.blackhat.com/bh-eu-11/Raul_Siles/BlackHat_EU_2011_Siles_SAP_Session-WP.pdf)を参照)。

Web アプリケーションは、同じ Web アプリケーション内の異なるパスやドメインスコープで同じ Cookie 名を使用することを避けるよう努めるべきです。これは解決策の複雑さを増し、スコープに関する問題を生じさせる可能性があります。

## セッションの有効期限

攻撃者がアクティブセッションに対して攻撃を行い、それをハイジャックできる時間を最小化するために、すべてのセッションに有効期限タイムアウトを設定し、セッションがアクティブであり続ける時間を定めることは必須です。Web アプリケーションによるセッション有効期限が不十分であると、他のセッションベース攻撃への露出が増えます。攻撃者が有効なセッション ID を再利用し、関連するセッションをハイジャックするには、そのセッションがまだアクティブでなければならないためです。

セッション間隔が短いほど、攻撃者が有効なセッション ID を使用できる時間は短くなります。セッション有効期限タイムアウト値は、Web アプリケーションの目的と性質に応じて設定し、セキュリティとユーザビリティのバランスを取る必要があります。ユーザーが Web アプリケーション内の操作を快適に完了でき、セッションが頻繁に期限切れにならないようにします。

アイドルタイムアウト値と絶対タイムアウト値は、Web アプリケーションとそのデータがどれほど重要かに大きく依存します。一般的なアイドルタイムアウトの範囲は、高価値アプリケーションでは 2-5 分、低リスクアプリケーションでは 15-30 分です。絶対タイムアウトは、ユーザーが通常どれくらいの時間アプリケーションを使用するかに依存します。アプリケーションがオフィスワーカーによって一日中使用されることを想定している場合、適切な絶対タイムアウト範囲は 4-8 時間程度になり得ます。

セッションが期限切れになると、Web アプリケーションはクライアント側とサーバー側の両方でセッションを無効化するために能動的な処理を行わなければなりません。後者はセキュリティの観点から最も重要であり、必須です。

ほとんどのセッション交換メカニズムでは、クライアント側でセッション ID を無効化する処理はトークン値を消去することに基づきます。たとえば Cookie を無効化するには、セッション ID に空 (または無効) の値を設定し、永続 Cookie が使用されている場合には `Expires` (または `Max-Age`) 属性を過去の日付に設定することが推奨されます: `Set-Cookie: id=; Expires=Friday, 17-May-03 18:45:00 GMT`

サーバー側でセッションを閉じて無効化するには、セッションが期限切れになったとき、またはユーザーが能動的にログアウトしたときに、Web アプリケーションが能動的な処理を行うことが必須です。たとえば `HttpSession.invalidate()` (J2EE)、`Session.Abandon()` (ASP .NET)、`session_destroy()/unset()` (PHP) など、セッション管理メカニズムが提供する関数やメソッドを使用します。

### 自動セッション有効期限

#### アイドルタイムアウト

すべてのセッションは、アイドルまたは非アクティビティタイムアウトを実装すべきです。このタイムアウトは、セッションに活動がない場合にセッションがアクティブであり続ける時間を定義し、特定のセッション ID について Web アプリケーションが最後に受信した HTTP リクエストから定義されたアイドル期間が経過した時点でセッションを閉じて無効化します。

アイドルタイムアウトは、攻撃者が他のユーザーの有効なセッション ID を推測して使用できる可能性を制限します。ただし、攻撃者が特定のセッションをハイジャックできた場合、攻撃者はセッション上で定期的に活動を発生させて長時間アクティブに保てるため、アイドルタイムアウトは攻撃者の行動を制限しません。

セッションタイムアウト管理と有効期限はサーバー側で強制されなければなりません。クライアントがセッションタイムアウトを強制する場合、たとえばセッショントークンや他のクライアントパラメータを使用して時間参照 (ログイン時からの経過分数など) を追跡すると、攻撃者はそれらを操作してセッション期間を延長できる可能性があります。

#### 絶対タイムアウト

すべてのセッションは、セッション活動にかかわらず絶対タイムアウトを実装すべきです。このタイムアウトは、セッションがアクティブであり得る最大時間を定義し、Web アプリケーションによって特定のセッションが最初に作成されてから定義された絶対期間が経過した時点で、セッションを閉じて無効化します。セッションを無効化した後、ユーザーは Web アプリケーションで再度認証し、新しいセッションを確立することを強制されます。

絶対セッションは、攻撃者がハイジャックしたセッションを使用して被害者ユーザーになりすませる時間を制限します。

#### 更新タイムアウト

代替として、Web アプリケーションは、一定時間後にセッション ID を自動的に更新する追加の更新タイムアウトを、ユーザーセッションの途中で、かつセッション活動、したがってアイドルタイムアウトとは独立して実装できます。

セッションが最初に作成されてから特定の時間が経過した後、Web アプリケーションはユーザーセッション用の新しい ID を再生成し、それをクライアントに設定または更新しようとできます。以前のセッション ID 値は、クライアントが新しい ID を認識し使い始めるまで、安全のための猶予期間としてしばらく有効なままになります。その時点で、クライアントが現在のセッション内で新しい ID に切り替えると、アプリケーションは以前の ID を無効化します。

このシナリオは、攻撃者が取得した可能性のある特定のセッション ID 値を、被害者ユーザーのセッションがまだアクティブな場合でも、ユーザーセッションのハイジャックに再利用できる時間を最小化します。正当なクライアント上のユーザーセッションは生存し開いたままですが、関連付けられたセッション ID 値はセッション期間中、更新タイムアウトが切れるたびに透過的に定期更新されます。したがって、更新タイムアウトは、特に絶対タイムアウト値が大きく時間的に延びる場合 (たとえばユーザーセッションを長時間開いたままにすることがアプリケーション要件である場合)、アイドルタイムアウトと絶対タイムアウトを補完します。

実装によっては、更新タイムアウトが切れた直後に、まだ有効な以前のセッション ID を持つ攻撃者が被害者ユーザーより先にリクエストを送信し、更新されたセッション ID の値を先に取得する競合状態が起きる可能性があります。少なくともこのシナリオでは、関連付けられたセッション ID がもはや有効でないためセッションが突然終了し、被害者ユーザーが攻撃に気付く可能性があります。

### 手動セッション有効期限

Web アプリケーションは、セキュリティ意識のあるユーザーが Web アプリケーションの使用を終えた後に、自分のセッションを能動的に閉じることを可能にするメカニズムを提供すべきです。

#### ログアウトボタン

Web アプリケーションは、表示され、容易にアクセスできるログアウト (logoff、exit、close session) ボタンを提供しなければなりません。このボタンは Web アプリケーションのヘッダーまたはメニューにあり、すべての Web アプリケーションリソースとページから到達可能である必要があります。これにより、ユーザーはいつでも手動でセッションを閉じられます。*Session_Expiration* セクションで説明したように、Web アプリケーションは少なくともサーバー側でセッションを無効化しなければなりません。

**注記**: 残念ながら、すべての Web アプリケーションがユーザーに現在のセッションを閉じる手段を提供しているわけではありません。そのため、クライアント側の拡張は、意識の高いユーザーがセッションをきちんと閉じることを支援し、セッションを保護する助けになります。

### Web コンテンツキャッシュと Clear-Site-Data

セッション終了後であっても、セッション中に交換された非公開データや機密データが Web ブラウザのキャッシュからアクセス可能な場合があります。これを軽減するために、Web アプリケーションはすべての HTTP および HTTPS トラフィックに対して制限的なキャッシュディレクティブを使用しなければなりません。これには、[`Cache-Control`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control) や [`Pragma`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Pragma) などの HTTP ヘッダー、またはすべてのページ、特に機密コンテンツを表示するページ上の同等の `<meta>` タグの使用が含まれます。

セッション識別子は決してキャッシュされてはなりません。これを防ぐため、セッション ID を含むレスポンスには `Cache-Control: no-store` ディレクティブを含めることが強く推奨されます。再検証を要求しつつキャッシュを許可する `no-cache` とは異なり、`no-store` はレスポンス (`Set-Cookie` のようなヘッダーを含む) がどのキャッシュにも保存されないことを保証します。

将来のキャッシュを防ぐだけでなく、アプリケーションはセッション終了時に以前保存された機密データが削除されることを確認すべきです。これは、ログアウトまたはセッション終了時に Clear-Site-Data レスポンスヘッダー (例: `Clear-Site-Data: "cache", "cookies", "storage"`) を返すことで実現できます。これはブラウザに対し、オリジンに関連付けられたキャッシュ済みリソース、Cookie、その他のクライアント側ストレージを削除するよう指示し、完全なセッションクリーンアップの確保を助けます。

> **注記:** `Cache-Control: no-cache="Set-Cookie, Set-Cookie2"` ディレクティブは、セッション ID のキャッシュを防ぐために提案されることがあります。しかし、この構文は広くサポートされておらず、意図しない挙動につながる可能性があります。より強い保護には `Cache-Control: no-store` を使用してください。`Clear-Site-Data: cache` はブラウザキャッシュ内のサイトのすべての保存済みレスポンスを消去するために使用できるため、注意して使用してください。これは共有キャッシュや中間キャッシュには影響しない点に注意してください。
> **参考:** [MDN - Cache-Control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control) と [MDN - Clear-Site-Data header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Clear-Site-Data)

## リスクイベント後の再認証

セッションの完全性とアカウント保護を確保するために、アプリケーションは特定の高リスクイベントが検出されたときに再認証を要求すべきです。これには次のものが含まれます。

- パスワード変更の試行または完了
- 新しい、または疑わしい IP アドレスやデバイスからのログイン
- アカウント復旧またはチャレンジフロー (hacked-lock シナリオなど) の完了

再認証を要求することで、特に長期間有効なセッションや外部 ID プロバイダが使用されている場合に、セッションハイジャックと不正アクセスの軽減に役立ちます。

**推奨プラクティス:**

- ユーザーに主要資格情報 (パスワードなど) の入力を求める、または MFA を強制します。
- 再認証が必要な理由を説明する明確なメッセージを提供します。

## セッション管理のための追加のクライアント側防御

Web アプリケーションは、前述のセッション管理防御を、クライアント側の追加対策で補完できます。通常 JavaScript のチェックや検証として実装されるクライアント側保護は、防弾ではなく、熟練した攻撃者によって容易に突破され得ます。それでも侵入者が回避しなければならない追加の防御層を導入できます。

### 初期ログインタイムアウト

Web アプリケーションはログインページで JavaScript コードを使用し、ページが読み込まれてからセッション ID が付与されてからの経過時間を評価および測定できます。特定の時間が経過した後にログイン試行が行われた場合、クライアントコードはログイン可能な最大時間が過ぎたことをユーザーに通知し、ログインページを再読み込みして新しいセッション ID を取得できます。

この追加保護メカニズムは、認証前のセッション ID の更新を強制しようとするものです。たとえばセッション固定攻撃で、以前に使用された (または手動で設定された) セッション ID が同じコンピュータを使う次の被害者に再利用されるシナリオを避けるためです。

### Web ブラウザウィンドウ終了イベントでセッションログアウトを強制する

Web アプリケーションは JavaScript コードを使用して、Web ブラウザのタブまたはウィンドウの close イベント (または back イベント) をすべて捕捉し、Web ブラウザが閉じられる前に現在のセッションを閉じるための適切な処理を行えます。これは、ユーザーがログアウトボタンで手動でセッションを閉じたことを模倣します。

### Web ブラウザのクロスタブセッションを無効化する

Web アプリケーションは、ユーザーがログインしセッションが確立された後に JavaScript コードを使用し、同じ Web アプリケーションに対して新しい Web ブラウザタブまたはウィンドウが開かれた場合に、ユーザーへ再認証を強制できます。Web アプリケーションは、複数の Web ブラウザタブまたはウィンドウが同じセッションを共有することを許可したくありません。そのため、ブラウザがそれらの間で同じセッション ID を同時に共有しないよう強制しようとします。

**注記**: セッション ID が Cookie で交換される場合、このメカニズムは実装できません。Cookie はすべての Web ブラウザタブ/ウィンドウで共有されるためです。

### 自動クライアントログアウト

JavaScript コードを Web アプリケーションのすべての (または重要な) ページで使用し、アイドルタイムアウトが切れた後にクライアントセッションを自動的にログアウトできます。たとえば、前述のログアウトボタンで使われるものと同じリソースであるログアウトページへユーザーをリダイレクトします。

サーバー側のアイドルタイムアウト機能をクライアント側コードで補強する利点は、ユーザーが非アクティビティによりセッションが終了したことを確認できること、またはカウントダウンタイマーや警告メッセージにより、セッションが間もなく期限切れになることを事前に通知できることです。このユーザーフレンドリーなアプローチは、サーバー側でセッションが静かに期限切れになることにより、大量の入力データを必要とする Web ページで作業内容が失われることを避ける助けになります。

## セッション攻撃の検知

### セッション ID 推測と総当たりの検知

攻撃者が有効なセッション ID を推測または総当たりしようとする場合、単一の (または一組の) IP アドレスから、異なるセッション ID を使って標的 Web アプリケーションへ複数の連続したリクエストを送る必要があります。さらに、攻撃者がセッション ID の予測可能性を分析しようとする場合 (統計分析など)、新しい有効なセッション ID を収集するために、単一の (または一組の) IP アドレスから標的 Web アプリケーションへ複数の連続したリクエストを送る必要があります。

Web アプリケーションは、異なるセッション ID を収集 (または使用) しようとする試行回数に基づいて、両方のシナリオを検出し、問題の IP アドレスに対してアラートおよび/またはブロックを行える必要があります。

### セッション ID 異常の検知

Web アプリケーションは、セッション ID に関連する異常、たとえばその操作に焦点を当てて検出すべきです。OWASP [AppSensor Project](https://owasp.org/www-project-appsensor/) は、検出ポイントとレスポンスアクションの形で、異常や予期しない動作の検出に焦点を当てた組み込み侵入検知機能を Web アプリケーション内に実装するためのフレームワークと方法論を提供します。外部の保護層を使用する代わりに、ビジネスロジックの詳細や高度なインテリジェンスが Web アプリケーション内部でのみ利用できる場合があります。その場所では、既存の Cookie が変更または削除されたとき、新しい Cookie が追加されたとき、別ユーザーのセッション ID が再利用されたとき、セッションの途中でユーザーの位置や User-Agent が変化したときなど、複数のセッション関連検出ポイントを確立できます。

### セッション ID を他のユーザープロパティに結び付ける

ユーザーの不正行為やセッションハイジャックを検出する (場合によっては防ぐ) 目的で、セッション ID をクライアント IP アドレス、User-Agent、クライアントベースのデジタル証明書など、他のユーザーまたはクライアントのプロパティに結び付けることが強く推奨されます。確立済みセッションの途中で、これらの異なるプロパティ間に変化や異常を Web アプリケーションが検出した場合、それはセッション操作やハイジャック試行の非常に良い指標であり、この事実だけで疑わしいセッションに対してアラートを出す、または終了するために使用できます。

これらのプロパティは Web アプリケーションがセッション攻撃に対して信頼して防御するためには使用できませんが、Web アプリケーションの検知 (および保護) 能力を大幅に高めます。ただし、熟練した攻撃者は、被害者ユーザーと同じネットワークを共有することで同じ IP アドレスを再利用したり (Wi-Fi ホットスポットのような NAT 環境で非常に一般的)、同じ外向き Web プロキシを使用したり (企業環境で非常に一般的)、User-Agent を手動で変更して被害者ユーザーのものとまったく同じに見せたりすることで、これらの制御を回避できます。

### セッションライフサイクルのログ記録: セッション ID の作成、使用、破棄の監視

Web アプリケーションは、セッションの完全なライフサイクルに関する情報を含めることでログ記録能力を高めるべきです。特に、セッション ID の作成、更新、破棄などのセッション関連イベントに加え、ログインおよびログアウト操作内での使用、セッション内での権限レベル変更、タイムアウト期限切れ、無効なセッション活動 (検出された場合)、セッション中の重要なビジネス操作に関する詳細を記録することが推奨されます。

ログの詳細には、タイムスタンプ、送信元 IP アドレス、リクエストされた Web 対象リソース (およびセッション操作に関与したリソース)、HTTP ヘッダー (User-Agent と Referer を含む)、GET および POST パラメータ、エラーコードとメッセージ、ユーザー名 (またはユーザー ID)、さらにセッション ID (Cookie、URL、GET、POST...) が含まれる場合があります。

セッション ID のような機密データは、セッションログをセッション ID のローカルまたはリモートでの漏えいや不正アクセスから保護するため、ログに含めるべきではありません。ただし、特定のセッションにログエントリを関連付けるために、何らかのセッション固有情報をログに記録しなければなりません。セッション ID そのものを露出せずにセッション固有のログ相関を可能にするため、セッション ID の代わりに salted-hash をログに記録することが推奨されます。

特に Web アプリケーションは、現在アクティブなすべてのセッションを管理できる管理インターフェースを徹底的に保護しなければなりません。これらは、サポート担当者がセッション関連の問題や一般的な問題を解決するために、ユーザーになりすましてユーザーと同じように Web アプリケーションを見る目的で頻繁に使用されます。

セッションログは Web アプリケーション侵入検知の主要なデータソースの一つとなり、攻撃が検出されたときにセッションを自動的に終了したりユーザーアカウントを無効化したりする侵入防止システムにも使用できます。能動的な保護が実装されている場合、これらの防御アクションもログに記録しなければなりません。

### 同時セッションログオン

同じユーザーからの複数の同時ログオンを、同じクライアント IP アドレスから、または異なるクライアント IP アドレスから許可するかどうかは、Web アプリケーションの設計判断です。Web アプリケーションが同時セッションログオンを許可したくない場合、各新規認証イベントの後に有効な処理を行い、以前利用可能だったセッションを暗黙的に終了するか、旧セッション、新セッション、またはその両方を通じて、どのセッションをアクティブなままにするかをユーザーに尋ねなければなりません。

Web アプリケーションには、ユーザーがいつでもアクティブセッションの詳細を確認できる機能、同時ログオンを監視してユーザーへ通知する機能、セッションを手動でリモート終了できるユーザー機能、IP アドレス、User-Agent、ログイン日時、アイドル時間など複数のクライアント詳細を記録してアカウント活動履歴 (logbook) を追跡する機能を追加することが推奨されます。

## セッション管理の WAF 保護

Web アプリケーションのソースコードが利用できない、または変更できない場合や、上記で詳述した複数のセキュリティ推奨事項とベストプラクティスを実装するために必要な変更が Web アプリケーションアーキテクチャの全面的な再設計を伴い、短期的には容易に実装できない場合があります。

このようなシナリオでは、または Web アプリケーション防御を補完するため、そして Web アプリケーションを可能な限り安全に保つ目的で、すでに説明したセッション管理上の脅威を軽減できる Web Application Firewall (WAF) などの外部保護を使用することが推奨されます。

Web Application Firewall は、セッションベース攻撃に対する検知および保護機能を提供します。一方では、WAF が `Secure` や `HttpOnly` フラグなどの Cookie 上のセキュリティ属性の使用を強制することは容易です。新しい Cookie を設定するすべての Web アプリケーションレスポンスについて、`Set-Cookie` ヘッダーに基本的な書き換えルールを適用できます。

他方では、WAF がセッションと対応するセッション ID を追跡し、あらゆる種類の保護を適用できるようにする、より高度な機能も実装できます。たとえば、権限変更が検出されたときにクライアント側でセッション ID を更新することでセッション固定に対抗する、セッション ID と IP アドレスや User-Agent などの他のクライアントプロパティとの関係を検証して sticky sessions を強制する、クライアントと Web アプリケーションの両方にセッションを終了させてセッション有効期限を管理する、といった機能です。

オープンソースの ModSecurity WAF と OWASP [Core Rule Set](https://owasp.org/www-project-modsecurity-core-rule-set/) は、セキュリティ Cookie 属性の検出と適用、セッション固定攻撃への対策、sticky sessions を強制するためのセッション追跡機能を提供します。

</section>

<section id="session-management-bilingual-panel" className="tabPanel bilingualPanel">

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

# Session Management Cheat Sheet

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

# セッション管理チートシート

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Introduction

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## はじめに

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Web Authentication, Session Management, and Access Control**:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**Web 認証、セッション管理、アクセス制御**:

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

A web session is a sequence of network HTTP request and response transactions associated with the same user. Modern and complex web applications require the retaining of information or status about each user for the duration of multiple requests. Therefore, sessions provide the ability to establish variables – such as access rights and localization settings – which will apply to each and every interaction a user has with the web application for the duration of the session.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Web セッションとは、同じユーザーに関連付けられた一連の HTTP リクエストとレスポンスのネットワークトランザクションです。現代の複雑な Web アプリケーションでは、複数のリクエストの間、各ユーザーに関する情報や状態を保持する必要があります。そのためセッションは、アクセス権やローカライズ設定など、セッション期間中にユーザーが Web アプリケーションと行うすべてのやり取りへ適用される変数を確立する機能を提供します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Web applications can create sessions to keep track of anonymous users after the very first user request. An example would be maintaining the user language preference. Additionally, web applications will make use of sessions once the user has authenticated. This ensures the ability to identify the user on any subsequent requests as well as being able to apply security access controls, authorized access to the user private data, and to increase the usability of the application. Therefore, current web applications can provide session capabilities both pre and post authentication.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Web アプリケーションは、最初のユーザーリクエスト後に匿名ユーザーを追跡するためにセッションを作成できます。たとえばユーザーの言語設定を維持する場合です。さらに Web アプリケーションは、ユーザーが認証された後にもセッションを使用します。これにより、以後のリクエストでユーザーを識別し、セキュリティアクセス制御を適用し、ユーザーのプライベートデータへの認可済みアクセスを扱い、アプリケーションの使いやすさを高められます。したがって、現在の Web アプリケーションは認証前と認証後の両方でセッション機能を提供できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Once an authenticated session has been established, the session ID (or token) is temporarily equivalent to the strongest authentication method used by the application, such as username and password, passphrases, one-time passwords (OTP), client-based digital certificates, smartcards, or biometrics (such as fingerprint or eye retina). See the OWASP [Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

認証済みセッションが確立されると、セッション ID (またはトークン) は、ユーザー名とパスワード、パスフレーズ、ワンタイムパスワード (OTP)、クライアントベースのデジタル証明書、スマートカード、生体認証 (指紋や網膜など) といった、アプリケーションが使用した最も強い認証方式と一時的に同等になります。OWASP [Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html) を参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

HTTP is a stateless protocol ([RFC2616](https://www.ietf.org/rfc/rfc2616.txt) section 5), where each request and response pair is independent of other web interactions. Therefore, in order to introduce the concept of a session, it is required to implement session management capabilities that link both the authentication and access control (or authorization) modules commonly available in web applications:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

HTTP はステートレスなプロトコル ([RFC2616](https://www.ietf.org/rfc/rfc2616.txt) section 5) であり、各リクエストとレスポンスのペアは他の Web 上のやり取りから独立しています。したがって、セッションという概念を導入するには、Web アプリケーションで一般に利用される認証モジュールとアクセス制御 (または認可) モジュールを結び付けるセッション管理機能を実装する必要があります。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

![SessionDiagram](https://cheatsheetseries.owasp.org/assets/Session_Management_Cheat_Sheet_Diagram.png)

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The session ID or token binds the user authentication credentials (in the form of a user session) to the user HTTP traffic and the appropriate access controls enforced by the web application. The complexity of these three components (authentication, session management, and access control) in modern web applications, plus the fact that its implementation and binding resides on the web developer's hands (as web development frameworks do not provide strict relationships between these modules), makes the implementation of a secure session management module very challenging.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

セッション ID またはトークンは、ユーザー認証資格情報 (ユーザーセッションの形) を、ユーザーの HTTP トラフィックおよび Web アプリケーションが強制する適切なアクセス制御に結び付けます。現代の Web アプリケーションでは、認証、セッション管理、アクセス制御という三つのコンポーネントが複雑であり、さらに Web 開発フレームワークはこれらのモジュール間に厳密な関係を提供しないため、その実装と結合は Web 開発者の手に委ねられています。このことが、安全なセッション管理モジュールの実装を非常に難しくしています。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The disclosure, capture, prediction, brute force, or fixation of the session ID will lead to session hijacking (or sidejacking) attacks, where an attacker is able to fully impersonate a victim user in the web application. Attackers can perform two types of session hijacking attacks, targeted or generic. In a targeted attack, the attacker's goal is to impersonate a specific (or privileged) web application victim user. For generic attacks, the attacker's goal is to impersonate (or get access as) any valid or legitimate user in the web application.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

セッション ID の漏えい、取得、予測、総当たり、または固定化は、セッションハイジャック (またはサイドジャッキング) 攻撃につながります。この攻撃では、攻撃者が Web アプリケーション内で被害者ユーザーになりすますことができます。攻撃者は標的型と汎用型の二種類のセッションハイジャック攻撃を実行できます。標的型攻撃では、特定の (または特権を持つ) Web アプリケーション利用者になりすますことが攻撃者の目的です。汎用型攻撃では、Web アプリケーション内の任意の有効または正当なユーザーになりすますこと、またはそのユーザーとしてアクセスすることが目的です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Session ID Properties

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## セッション ID の性質

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

In order to keep the authenticated state and track the users progress within the web application, applications provide users with a **session identifier** (session ID or token) that is assigned at session creation time, and is shared and exchanged by the user and the web application for the duration of the session (it is sent on every HTTP request). The session ID is a `name=value` pair.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

認証済み状態を維持し、Web アプリケーション内でのユーザーの進行状況を追跡するために、アプリケーションはユーザーへ **セッション識別子** (セッション ID またはトークン) を提供します。これはセッション作成時に割り当てられ、セッション期間中、ユーザーと Web アプリケーションの間で共有および交換されます (すべての HTTP リクエストで送信されます)。セッション ID は `name=value` ペアです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

With the goal of implementing secure session IDs, the generation of identifiers (IDs or tokens) must meet the following properties.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

安全なセッション ID を実装するには、識別子 (ID またはトークン) の生成が次の性質を満たす必要があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Session ID Name Fingerprinting

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### セッション ID 名のフィンガープリンティング

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The name used by the session ID should not be extremely descriptive nor offer unnecessary details about the purpose and meaning of the ID.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

セッション ID に使用する名前は、極端に説明的であったり、ID の目的や意味について不要な詳細を提供したりすべきではありません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The session ID names used by the most common web application development frameworks [can be easily fingerprinted](https://wiki.owasp.org/index.php/Category:OWASP_Cookies_Database), such as `PHPSESSID` (PHP), `JSESSIONID` (J2EE), `CFID` & `CFTOKEN` (ColdFusion), `ASP.NET_SessionId` (ASP .NET), etc. Therefore, the session ID name can disclose the technologies and programming languages used by the web application.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

一般的な Web アプリケーション開発フレームワークで使われるセッション ID 名は、`PHPSESSID` (PHP)、`JSESSIONID` (J2EE)、`CFID` と `CFTOKEN` (ColdFusion)、`ASP.NET_SessionId` (ASP .NET) などのように、[容易にフィンガープリントできます](https://wiki.owasp.org/index.php/Category:OWASP_Cookies_Database)。したがって、セッション ID 名は Web アプリケーションで使用されている技術やプログラミング言語を明らかにする可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

It is recommended to change the default session ID name of the web development framework to a generic name, such as `id`.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Web 開発フレームワークの既定のセッション ID 名は、`id` などの汎用的な名前に変更することが推奨されます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Session ID Entropy

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### セッション ID のエントロピー

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Session identifiers must have at least `64 bits` of entropy to prevent brute-force session guessing attacks. Entropy refers to the amount of randomness or unpredictability in a value. Each “bit” of entropy doubles the number of possible outcomes, meaning a session ID with 64 bits of entropy can have `2^64` possible values.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

セッション識別子は、総当たりによるセッション推測攻撃を防ぐために、少なくとも `64 bits` のエントロピーを持たなければなりません。エントロピーとは、値に含まれるランダム性または予測不能性の量です。エントロピーの各「ビット」は可能な結果数を倍にするため、64 ビットのエントロピーを持つセッション ID は `2^64` 個の可能な値を持てます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

A strong [CSPRNG](https://en.wikipedia.org/wiki/Cryptographically_secure_pseudorandom_number_generator) (Cryptographically Secure Pseudorandom Number Generator) must be used to generate session IDs. This ensures the generated values are evenly distributed among all possible values. Otherwise, attackers may be able to use statistical analysis techniques to identify patterns in how the session IDs are created, effectively reducing the entropy and allowing the attacker to guess or predict valid session IDs more easily.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

セッション ID の生成には、強力な [CSPRNG](https://en.wikipedia.org/wiki/Cryptographically_secure_pseudorandom_number_generator) (Cryptographically Secure Pseudorandom Number Generator、暗号論的に安全な疑似乱数生成器) を使用しなければなりません。これにより、生成される値はすべての可能な値の間で均等に分布します。そうでない場合、攻撃者は統計分析手法を使ってセッション ID の生成方法に含まれるパターンを特定でき、実効エントロピーを下げ、有効なセッション ID をより容易に推測または予測できるようになります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**NOTE**:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**注記**:

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- The expected time for an attacker to brute-force a valid session ID depends on factors such as the number of bits of entropy, the number of active sessions, session expiration times, and the attacker's guessing rate.
- If a web application generates session IDs with 64 bits of entropy, an attacker can expect to spend approximately 585 years to successfully guess a valid session ID, assuming the attacker can try 10,000 guesses per second with 100,000 valid simultaneous sessions available in the application.
- Further analysis of the expected time for an attacker to brute-force session identifiers is available [here](https://owasp.org/www-community/vulnerabilities/Insufficient_Session-ID_Length#estimating-attack-time).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- 攻撃者が有効なセッション ID を総当たりで見つけるまでの期待時間は、エントロピーのビット数、アクティブセッション数、セッション有効期限、攻撃者の推測速度などの要因に依存します。
- Web アプリケーションが 64 ビットのエントロピーを持つセッション ID を生成する場合、攻撃者が毎秒 10,000 回の推測を実行でき、アプリケーション内に 100,000 個の有効な同時セッションがあると仮定すると、有効なセッション ID の推測に成功するまで約 585 年かかると期待されます。
- セッション識別子の総当たりに必要な期待時間についてのさらなる分析は、[こちら](https://owasp.org/www-community/vulnerabilities/Insufficient_Session-ID_Length#estimating-attack-time)で入手できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Session ID Length

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### セッション ID の長さ

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

As mentioned in the previous *Session ID Entropy* section, a primary security requirement for session IDs is that they contain at least `64 bits` of entropy to prevent brute-force guessing attacks. Although session ID length matters, it's the entropy that ensures security. The session ID must be long enough to encode sufficient entropy, preventing brute force attacks where an attacker guesses valid session IDs.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

前の *セッション ID のエントロピー* セクションで述べたように、セッション ID の主要なセキュリティ要件は、総当たり推測攻撃を防ぐために少なくとも `64 bits` のエントロピーを含むことです。セッション ID の長さは重要ですが、セキュリティを保証するのはエントロピーです。セッション ID は十分なエントロピーをエンコードできる長さを持ち、攻撃者が有効なセッション ID を推測する総当たり攻撃を防がなければなりません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Different encoding methods can result in different lengths for the same amount of entropy. Session IDs are often represented using hexadecimal encoding. When using hexadecimal encoding, a session ID must be at least 16 hexadecimal characters long to achieve the required 64 bits of entropy.  When using different encodings (e.g. Base64 or [Microsoft's encoding for ASP.NET session IDs](https://docs.microsoft.com/en-us/dotnet/api/system.web.sessionstate.sessionidmanager?redirectedfrom=MSDN&view=netframework-4.7.2)) a different number of characters may be required to represent the minimum 64 bits of entropy.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

エンコード方式が異なると、同じエントロピー量でも必要な長さが異なることがあります。セッション ID はしばしば 16 進エンコードで表現されます。16 進エンコードを使用する場合、必要な 64 ビットのエントロピーを達成するには、セッション ID は少なくとも 16 個の 16 進文字でなければなりません。Base64 や [ASP.NET セッション ID 用の Microsoft のエンコード](https://docs.microsoft.com/en-us/dotnet/api/system.web.sessionstate.sessionidmanager?redirectedfrom=MSDN&view=netframework-4.7.2) など、異なるエンコードを使用する場合、最小 64 ビットのエントロピーを表現するために必要な文字数は異なる可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

It’s important to note that if any part of the session ID is fixed or predictable, the effective entropy is reduced, and the length may need to be increased to compensate. For example, if half of a 16-character hexadecimal session ID is fixed, only the remaining 8 characters are random, providing just 32 bits of entropy — which is insufficient for strong security. To maintain security, ensure that the entire session ID is randomly generated and unpredictable, or increase the overall length if parts of the ID are not random.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

セッション ID の一部が固定または予測可能である場合、実効エントロピーは低下し、それを補うために長さを増やす必要があるかもしれない点が重要です。たとえば、16 文字の 16 進セッション ID の半分が固定されている場合、残りの 8 文字だけがランダムであり、32 ビットのエントロピーしか提供しません。これは強力なセキュリティには不十分です。セキュリティを維持するには、セッション ID 全体がランダムに生成され予測不能であることを確認するか、ID の一部がランダムでない場合は全体の長さを増やしてください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**NOTE**:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**注記**:

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- More information about the relationship between Session ID Length and Session ID Entropy is available [here](https://owasp.org/www-community/vulnerabilities/Insufficient_Session-ID_Length#session-id-length-and-entropy-relationship).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- セッション ID の長さとセッション ID のエントロピーの関係についての詳細は、[こちら](https://owasp.org/www-community/vulnerabilities/Insufficient_Session-ID_Length#session-id-length-and-entropy-relationship)で入手できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Session ID Content (or Value)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### セッション ID の内容 (または値)

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The session ID content (or value) must be meaningless to prevent information disclosure attacks, where an attacker is able to decode the contents of the ID and extract details of the user, the session, or the inner workings of the web application.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

セッション ID の内容 (または値) は、情報漏えい攻撃を防ぐため、意味のないものでなければなりません。意味を持つ値では、攻撃者が ID の内容をデコードし、ユーザー、セッション、または Web アプリケーション内部の動作に関する詳細を抽出できる可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The session ID must simply be an identifier on the client side, and its value must never include sensitive information or Personally Identifiable Information (PII). To read more about PII, refer to [Wikipedia](https://en.wikipedia.org/wiki/Personally_identifiable_information) or this [post](https://www.idshield.com/blog/identity-theft/what-pii-and-why-should-i-care/).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

セッション ID はクライアント側では単なる識別子でなければならず、その値に機密情報や個人識別情報 (PII) を決して含めてはなりません。PII について詳しくは、[Wikipedia](https://en.wikipedia.org/wiki/Personally_identifiable_information) またはこの[投稿](https://www.idshield.com/blog/identity-theft/what-pii-and-why-should-i-care/)を参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The meaning and business or application logic associated with the session ID must be stored on the server side, and specifically, in session objects or in a session management database or repository.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

セッション ID に関連する意味、ビジネスロジック、またはアプリケーションロジックはサーバー側に保存しなければならず、具体的にはセッションオブジェクト、またはセッション管理データベースやリポジトリに保存します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The stored information can include the client IP address, User-Agent, email, username, user ID, role, privilege level, access rights, language preferences, account ID, current state, last login, session timeouts, and other internal session details. If the session objects and properties contain sensitive information, such as credit card numbers, it is required to duly encrypt and protect the session management repository.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

保存される情報には、クライアント IP アドレス、User-Agent、メールアドレス、ユーザー名、ユーザー ID、ロール、権限レベル、アクセス権、言語設定、アカウント ID、現在の状態、最終ログイン、セッションタイムアウト、その他の内部セッション詳細が含まれる場合があります。セッションオブジェクトやプロパティにクレジットカード番号などの機密情報が含まれる場合は、セッション管理リポジトリを適切に暗号化し保護する必要があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

It is recommended to use the session ID created by your language or framework. If you need to create your own sessionID, use a cryptographically secure pseudorandom number generator (CSPRNG) with a size of at least 128 bits and ensure that each sessionID is unique.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

言語やフレームワークが作成するセッション ID を使用することが推奨されます。独自の sessionID を作成する必要がある場合は、少なくとも 128 ビットのサイズを持つ暗号論的に安全な疑似乱数生成器 (CSPRNG) を使用し、各 sessionID が一意であることを確認してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Session Management Implementation

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## セッション管理の実装

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The session management implementation defines the exchange mechanism that will be used between the user and the web application to share and continuously exchange the session ID. There are multiple mechanisms available in HTTP to maintain session state within web applications, such as cookies (standard HTTP header), URL parameters (URL rewriting – [RFC2396](https://www.ietf.org/rfc/rfc2396.txt)), URL arguments on GET requests, body arguments on POST requests, such as hidden form fields (HTML forms), or proprietary HTTP headers.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

セッション管理の実装は、ユーザーと Web アプリケーションの間でセッション ID を共有し継続的に交換するために使用される交換メカニズムを定義します。Web アプリケーション内でセッション状態を維持するために、HTTP では複数のメカニズムが利用できます。たとえば Cookie (標準 HTTP ヘッダー)、URL パラメータ (URL rewriting - [RFC2396](https://www.ietf.org/rfc/rfc2396.txt))、GET リクエストの URL 引数、POST リクエストのボディ引数、hidden form fields (HTML フォーム)、独自 HTTP ヘッダーなどです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The preferred session ID exchange mechanism should allow defining advanced token properties, such as the token expiration date and time, or granular usage constraints. This is one of the reasons why cookies (RFCs [2109](https://www.ietf.org/rfc/rfc2109.txt) & [2965](https://www.ietf.org/rfc/rfc2965.txt) & [6265](https://www.ietf.org/rfc/rfc6265.txt)) are one of the most extensively used session ID exchange mechanisms, offering advanced capabilities not available in other methods.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

推奨されるセッション ID 交換メカニズムは、トークンの有効期限日時や細かな利用制約など、高度なトークンプロパティを定義できるべきです。これが、Cookie (RFC [2109](https://www.ietf.org/rfc/rfc2109.txt)、[2965](https://www.ietf.org/rfc/rfc2965.txt)、[6265](https://www.ietf.org/rfc/rfc6265.txt)) が最も広く使われるセッション ID 交換メカニズムの一つであり、他の方式では利用できない高度な機能を提供する理由の一つです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The usage of specific session ID exchange mechanisms, such as those where the ID is included in the URL, might disclose the session ID (in web links and logs, web browser history and bookmarks, the Referer header or search engines), as well as facilitate other attacks, such as the manipulation of the ID or [session fixation attacks](https://www.acrossecurity.com/papers/session_fixation.pdf).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

ID が URL に含まれる方式など、特定のセッション ID 交換メカニズムを使用すると、Web リンクやログ、Web ブラウザの履歴やブックマーク、Referer ヘッダー、検索エンジンでセッション ID が漏えいする可能性があります。また、ID の改ざんや[セッション固定攻撃](https://www.acrossecurity.com/papers/session_fixation.pdf)など、他の攻撃も容易にします。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Built-in Session Management Implementations

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 組み込みのセッション管理実装

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Web development frameworks, such as J2EE, ASP .NET, PHP, and others, provide their own session management features and associated implementation. It is recommended to use these built-in frameworks versus building a home made one from scratch, as they are used worldwide on multiple web environments and have been tested by the web application security and development communities over time.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

J2EE、ASP .NET、PHP などの Web 開発フレームワークは、それぞれ独自のセッション管理機能と関連実装を提供しています。これらは世界中の複数の Web 環境で使用され、Web アプリケーションセキュリティおよび開発コミュニティによって長期間テストされているため、自作のものを一から構築するよりも、これらの組み込みフレームワークを使用することが推奨されます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

However, be advised that these frameworks have also presented vulnerabilities and weaknesses in the past, so it is always recommended to use the latest version available, that potentially fixes all the well-known vulnerabilities, as well as review and change the default configuration to enhance its security by following the recommendations described along this document.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

ただし、これらのフレームワークにも過去に脆弱性や弱点が存在したことに注意してください。そのため、よく知られた脆弱性を修正している可能性がある最新バージョンを常に使用し、この文書で説明する推奨事項に従って、セキュリティを強化するために既定設定を見直し変更することが常に推奨されます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The storage capabilities or repository used by the session management mechanism to temporarily save the session IDs must be secure, protecting the session IDs against local or remote accidental disclosure or unauthorized access.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

セッション ID を一時的に保存するためにセッション管理メカニズムが使用するストレージ機能またはリポジトリは、安全でなければなりません。ローカルまたはリモートでの偶発的な漏えいや不正アクセスからセッション ID を保護する必要があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Used vs. Accepted Session ID Exchange Mechanisms

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 使用する交換メカニズムと受け入れる交換メカニズム

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

A web application should make use of cookies for session ID exchange management. If a user submits a session ID through a different exchange mechanism, such as a URL parameter, the web application should avoid accepting it as part of a defensive strategy to stop session fixation.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Web アプリケーションは、セッション ID 交換管理に Cookie を使用すべきです。ユーザーが URL パラメータなど、異なる交換メカニズムでセッション ID を送信した場合、Web アプリケーションはセッション固定を止める防御戦略の一部として、それを受け入れることを避けるべきです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**NOTE**:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**注記**:

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Even if a web application makes use of cookies as its default session ID exchange mechanism, it might accept other exchange mechanisms too.
- It is therefore required to confirm via thorough testing all the different mechanisms currently accepted by the web application when processing and managing session IDs, and limit the accepted session ID tracking mechanisms to just cookies.
- In the past, some web applications used URL parameters, or even switched from cookies to URL parameters (via automatic URL rewriting), if certain conditions are met (for example, the identification of web clients without support for cookies or not accepting cookies due to user privacy concerns).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- Web アプリケーションが Cookie を既定のセッション ID 交換メカニズムとして使用していても、他の交換メカニズムも受け入れている可能性があります。
- したがって、セッション ID を処理および管理するときに Web アプリケーションが現在受け入れているすべてのメカニズムを徹底的なテストで確認し、受け入れるセッション ID 追跡メカニズムを Cookie のみに制限する必要があります。
- 過去には、Cookie をサポートしない、またはプライバシー上の懸念から Cookie を受け入れない Web クライアントの識別など、特定の条件が満たされた場合に URL パラメータを使用したり、Cookie から URL パラメータへ (自動 URL rewriting により) 切り替えたりする Web アプリケーションがありました。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Transport Layer Security

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### トランスポート層セキュリティ

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

In order to protect the session ID exchange from active eavesdropping and passive disclosure in the network traffic, it is essential to use an encrypted HTTPS (TLS) connection for the entire web session, not only for the authentication process where the user credentials are exchanged. This may be mitigated by [HTTP Strict Transport Security (HSTS)](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Strict_Transport_Security_Cheat_Sheet.html) for a client that supports it.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

ネットワークトラフィックでの能動的な盗聴と受動的な漏えいからセッション ID 交換を保護するには、ユーザー資格情報が交換される認証プロセスだけでなく、Web セッション全体で暗号化された HTTPS (TLS) 接続を使用することが不可欠です。これをサポートするクライアントでは、[HTTP Strict Transport Security (HSTS)](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Strict_Transport_Security_Cheat_Sheet.html) によって軽減できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Additionally, the `Secure` [cookie attribute](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#Secure_and_HttpOnly_cookies) must be used to ensure the session ID is only exchanged through an encrypted channel. The usage of an encrypted communication channel also protects the session against some session fixation attacks where the attacker is able to intercept and manipulate the web traffic to inject (or fix) the session ID on the victim's web browser.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

さらに、セッション ID が暗号化チャネルを通してのみ交換されることを保証するために、`Secure` [Cookie 属性](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#Secure_and_HttpOnly_cookies)を使用しなければなりません。暗号化された通信チャネルの使用は、攻撃者が Web トラフィックを傍受して操作し、被害者の Web ブラウザにセッション ID を注入 (または固定) できる一部のセッション固定攻撃からもセッションを保護します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The following set of best practices are focused on protecting the session ID (specifically when cookies are used) and helping with the integration of HTTPS within the web application:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

次のベストプラクティスは、セッション ID (特に Cookie が使われる場合) を保護し、Web アプリケーションで HTTPS を統合しやすくすることに焦点を当てています。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Do not switch a given session from HTTP to HTTPS, or vice-versa, as this will disclose the session ID in the clear through the network.
    - When redirecting to HTTPS, ensure that the cookie is set or regenerated **after** the redirect has occurred.
- Do not mix encrypted and unencrypted contents (HTML pages, images, CSS, JavaScript files, etc) in the same page, or from the same domain.
- Where possible, avoid offering public unencrypted contents and private encrypted contents from the same host. Where insecure content is required, consider hosting this on a separate insecure domain.
- Implement [HTTP Strict Transport Security (HSTS)](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Strict_Transport_Security_Cheat_Sheet.html) to enforce HTTPS connections.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- あるセッションを HTTP から HTTPS へ、またはその逆へ切り替えないでください。ネットワーク上でセッション ID が平文で漏えいします。
    - HTTPS へリダイレクトする場合は、リダイレクトが完了した **後** に Cookie を設定または再生成してください。
- 暗号化されたコンテンツと暗号化されていないコンテンツ (HTML ページ、画像、CSS、JavaScript ファイルなど) を、同じページまたは同じドメインから混在させないでください。
- 可能であれば、公開の暗号化されていないコンテンツと、非公開の暗号化されたコンテンツを同じホストから提供することは避けてください。安全でないコンテンツが必要な場合は、別の安全でないドメインでホストすることを検討してください。
- HTTPS 接続を強制するために [HTTP Strict Transport Security (HSTS)](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Strict_Transport_Security_Cheat_Sheet.html) を実装してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

See the OWASP [Transport Layer Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html) for more general guidance on implementing TLS securely.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

TLS を安全に実装するための一般的なガイダンスについては、OWASP [Transport Layer Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html) を参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

It is important to emphasize that TLS does not protect against session ID prediction, brute force, client-side tampering or fixation; however, it does provide effective protection against an attacker intercepting or stealing session IDs through a man in the middle attack.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

TLS はセッション ID の予測、総当たり、クライアント側の改ざん、固定化を防ぐものではないことを強調しておくことが重要です。しかし、攻撃者が中間者攻撃によってセッション ID を傍受または盗むことに対しては有効な保護を提供します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Cookies

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## Cookie

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The session ID exchange mechanism based on cookies provides multiple security features in the form of cookie attributes that can be used to protect the exchange of the session ID:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Cookie に基づくセッション ID 交換メカニズムは、セッション ID の交換を保護するために使用できる Cookie 属性という形で、複数のセキュリティ機能を提供します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Secure Attribute

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Secure 属性

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The `Secure` cookie attribute instructs web browsers to only send the cookie through an encrypted HTTPS (SSL/TLS) connection. This session protection mechanism is mandatory to prevent the disclosure of the session ID through MitM (Man-in-the-Middle) attacks. It ensures that an attacker cannot simply capture the session ID from web browser traffic.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

`Secure` Cookie 属性は、暗号化された HTTPS (SSL/TLS) 接続を通してのみ Cookie を送信するよう Web ブラウザに指示します。このセッション保護メカニズムは、MitM (Man-in-the-Middle、中間者) 攻撃によるセッション ID の漏えいを防ぐために必須です。これにより、攻撃者が Web ブラウザのトラフィックから単純にセッション ID を取得できないようにします。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Forcing the web application to only use HTTPS for its communication (even when port TCP/80, HTTP, is closed in the web application host) does not protect against session ID disclosure if the `Secure` cookie has not been set - the web browser can be deceived to disclose the session ID over an unencrypted HTTP connection. The attacker can intercept and manipulate the victim user traffic and inject an HTTP unencrypted reference to the web application that will force the web browser to submit the session ID in the clear.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Web アプリケーションが通信に HTTPS のみを使用するよう強制していても (Web アプリケーションホストで TCP/80、HTTP ポートが閉じられている場合でも)、`Secure` Cookie が設定されていなければセッション ID の漏えいは防げません。Web ブラウザはだまされて、暗号化されていない HTTP 接続上でセッション ID を漏えいする可能性があります。攻撃者は被害者ユーザーのトラフィックを傍受および操作し、Web アプリケーションへの暗号化されていない HTTP 参照を注入して、Web ブラウザにセッション ID を平文で送信させることができます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

See also: [SecureFlag](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#Secure_and_HttpOnly_cookies)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

関連項目: [SecureFlag](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#Secure_and_HttpOnly_cookies)

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### HttpOnly Attribute

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### HttpOnly 属性

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The `HttpOnly` cookie attribute instructs web browsers not to allow scripts (e.g. JavaScript or VBscript) an ability to access the cookies via the DOM document.cookie object. This session ID protection is mandatory to prevent session ID stealing through XSS attacks. However, if an XSS attack is combined with a CSRF attack, the requests sent to the web application will include the session cookie, as the browser always includes the cookies when sending requests. The `HttpOnly` cookie only protects the confidentiality of the cookie; the attacker cannot use it offline, outside of the context of an XSS attack.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

`HttpOnly` Cookie 属性は、DOM の document.cookie オブジェクトを介してスクリプト (JavaScript や VBscript など) が Cookie にアクセスする能力を許可しないよう Web ブラウザに指示します。このセッション ID 保護は、XSS 攻撃によるセッション ID の窃取を防ぐために必須です。ただし、XSS 攻撃が CSRF 攻撃と組み合わされた場合、ブラウザはリクエスト送信時に常に Cookie を含めるため、Web アプリケーションへ送信されるリクエストにはセッション Cookie が含まれます。`HttpOnly` Cookie は Cookie の機密性だけを保護します。攻撃者は、XSS 攻撃の文脈外で、オフラインでそれを使用することはできません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

See the OWASP [XSS (Cross Site Scripting) Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

OWASP [XSS (Cross Site Scripting) Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html) を参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

See also: [HttpOnly](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#Secure_and_HttpOnly_cookies)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

関連項目: [HttpOnly](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#Secure_and_HttpOnly_cookies)

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### SameSite Attribute

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### SameSite 属性

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The `SameSite` attribute prevents the browser from sending the cookie on cross-site requests, mitigating cross-origin leakage and providing CSRF defense. Session cookies must explicitly set `SameSite=Strict` (preferred) or `SameSite=Lax`. Never use `SameSite=None` without `Secure`, and do not rely on the browser-default value, which varies across browsers and versions.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

`SameSite` 属性は、クロスサイトリクエストでブラウザが Cookie を送信することを防ぎ、クロスオリジン漏えいを軽減し、CSRF 防御を提供します。セッション Cookie は `SameSite=Strict` (推奨) または `SameSite=Lax` を明示的に設定しなければなりません。`Secure` なしで `SameSite=None` を使用してはならず、ブラウザやバージョンによって異なるブラウザ既定値に依存してはいけません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

See also: [SameSite](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#SameSite_cookies)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

関連項目: [SameSite](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#SameSite_cookies)

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Cookie Name Prefixes

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Cookie 名プレフィックス

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Use cookie name prefixes to bind cookies to security properties at the browser level ([RFC 6265bis §4.1.3](https://datatracker.ietf.org/doc/html/draft-ietf-httpbis-rfc6265bis)):

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Cookie 名プレフィックスを使用して、ブラウザレベルで Cookie をセキュリティプロパティに結び付けます ([RFC 6265bis §4.1.3](https://datatracker.ietf.org/doc/html/draft-ietf-httpbis-rfc6265bis))。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- `__Host-` — the cookie must be set with `Secure`, must not have a `Domain` attribute, and must use `Path=/`. Prevents subdomain forgery and HTTPS downgrade attacks. **Recommended for session IDs.**
- `__Secure-` — the cookie must be set with `Secure`. Use only when subdomain sharing is required.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- `__Host-` - Cookie は `Secure` とともに設定されなければならず、`Domain` 属性を持ってはならず、`Path=/` を使用しなければなりません。サブドメイン偽造と HTTPS ダウングレード攻撃を防ぎます。**セッション ID に推奨されます。**
- `__Secure-` - Cookie は `Secure` とともに設定されなければなりません。サブドメイン共有が必要な場合にのみ使用してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Example:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

例:

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```http
Set-Cookie: __Host-SessionID=<value>; Secure; HttpOnly; SameSite=Strict; Path=/
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Domain and Path Attributes

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Domain 属性と Path 属性

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The [`Domain` cookie attribute](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#Directives) instructs web browsers to only send the cookie to the specified domain and all subdomains. If the attribute is not set, by default the cookie will only be sent to the origin server. The [`Path` cookie attribute](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#Directives) instructs web browsers to only send the cookie to the specified directory or subdirectories (or paths or resources) within the web application. If the attribute is not set, by default the cookie will only be sent for the directory (or path) of the resource requested and setting the cookie.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

[`Domain` Cookie 属性](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#Directives)は、指定されたドメインおよびすべてのサブドメインにのみ Cookie を送信するよう Web ブラウザに指示します。この属性が設定されていない場合、既定では Cookie はオリジンサーバーにのみ送信されます。[`Path` Cookie 属性](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#Directives)は、Web アプリケーション内の指定されたディレクトリまたはサブディレクトリ (またはパスやリソース) にのみ Cookie を送信するよう Web ブラウザに指示します。この属性が設定されていない場合、既定では Cookie を設定したリクエスト対象リソースのディレクトリ (またはパス) に対してのみ送信されます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

It is recommended to use a narrow or restricted scope for these two attributes. In this way, the `Domain` attribute should not be set (restricting the cookie just to the origin server) and the `Path` attribute should be set as restrictive as possible to the web application path that makes use of the session ID.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

これら二つの属性には、狭く制限されたスコープを使用することが推奨されます。つまり、`Domain` 属性は設定せず (Cookie をオリジンサーバーのみに制限する)、`Path` 属性はセッション ID を使用する Web アプリケーションパスにできる限り制限して設定すべきです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Setting the `Domain` attribute to a too permissive value, such as `example.com` allows an attacker to launch attacks on the session IDs between different hosts and web applications belonging to the same domain, known as cross-subdomain cookies. For example, vulnerabilities in `www.example.com` might allow an attacker to get access to the session IDs from `secure.example.com`.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

`Domain` 属性を `example.com` など過度に許容的な値に設定すると、同じドメインに属する異なるホストや Web アプリケーション間で、攻撃者がセッション ID に対する攻撃を行えるようになります。これは cross-subdomain cookies として知られています。たとえば、`www.example.com` の脆弱性により、攻撃者が `secure.example.com` のセッション ID にアクセスできる可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Additionally, it is recommended not to mix web applications of different security levels on the same domain. Vulnerabilities in one of the web applications would allow an attacker to set the session ID for a different web application on the same domain by using a permissive `Domain` attribute (such as `example.com`) which is a technique that can be used in [session fixation attacks](https://www.acrossecurity.com/papers/session_fixation.pdf).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

さらに、異なるセキュリティレベルの Web アプリケーションを同じドメイン上で混在させないことが推奨されます。いずれかの Web アプリケーションの脆弱性により、攻撃者は `example.com` のような許容的な `Domain` 属性を使って、同じドメイン上の別の Web アプリケーションに対してセッション ID を設定できる可能性があります。これは[セッション固定攻撃](https://www.acrossecurity.com/papers/session_fixation.pdf)で使用される技法です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Although the `Path` attribute allows the isolation of session IDs between different web applications using different paths on the same host, it is highly recommended not to run different web applications (especially from different security levels or scopes) on the same host. Other methods can be used by these applications to access the session IDs, such as the `document.cookie` object. Also, any web application can set cookies for any path on that host.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

`Path` 属性は、同じホスト上で異なるパスを使う Web アプリケーション間でセッション ID を分離できますが、異なる Web アプリケーション (特に異なるセキュリティレベルまたはスコープのもの) を同じホスト上で動かさないことが強く推奨されます。これらのアプリケーションは `document.cookie` オブジェクトなど、他の方法でセッション ID にアクセスできる可能性があります。また、どの Web アプリケーションもそのホスト上の任意のパスに Cookie を設定できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Cookies are vulnerable to DNS spoofing/hijacking/poisoning attacks, where an attacker can manipulate the DNS resolution to force the web browser to disclose the session ID for a given host or domain.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Cookie は DNS spoofing/hijacking/poisoning 攻撃に対して脆弱です。攻撃者が DNS 解決を操作し、特定のホストまたはドメインのセッション ID を Web ブラウザに漏えいさせることができます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Expire and Max-Age Attributes

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Expires 属性と Max-Age 属性

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Session management mechanisms based on cookies can make use of two types of cookies, non-persistent (or session) cookies, and persistent cookies. If a cookie presents the [`Max-Age`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#Directives) (that has preference over `Expires`) or [`Expires`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#Directives) attributes, it will be considered a persistent cookie and will be stored on disk by the web browser based until the expiration time.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Cookie に基づくセッション管理メカニズムは、非永続 (またはセッション) Cookie と永続 Cookie の二種類の Cookie を使用できます。Cookie が [`Max-Age`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#Directives) (`Expires` より優先されます) または [`Expires`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#Directives) 属性を持つ場合、その Cookie は永続 Cookie と見なされ、有効期限まで Web ブラウザによってディスクに保存されます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Typically, session management capabilities to track users after authentication make use of non-persistent cookies. This forces the session to disappear from the client if the current web browser instance is closed. Therefore, it is highly recommended to use non-persistent cookies for session management purposes, so that the session ID does not remain on the web client cache for long periods of time, from where an attacker can obtain it.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

通常、認証後にユーザーを追跡するセッション管理機能は非永続 Cookie を使用します。これにより、現在の Web ブラウザインスタンスが閉じられると、クライアントからセッションが消えます。したがって、セッション管理目的では非永続 Cookie を使用することが強く推奨されます。これにより、攻撃者が取得できる Web クライアントキャッシュにセッション ID が長期間残らないようにします。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Ensure that sensitive information is not compromised by ensuring that it is not persistent, encrypting it, and storing it only for the duration of the need
- Ensure that unauthorized activities cannot take place via cookie manipulation
- Ensure secure flag is set to prevent accidental transmission over the wire in a non-secure manner
- Determine if all state transitions in the application code properly check for the cookies and enforce their use
- Ensure entire cookie should be encrypted if sensitive data is persisted in the cookie
- Define all cookies being used by the application, their name and why they are needed

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- 機密情報が永続化されないこと、暗号化されること、必要な期間だけ保存されることを確認し、侵害されないようにします。
- Cookie 操作によって不正な活動が発生できないことを確認します。
- 安全でない方法でネットワーク上に誤って送信されることを防ぐため、secure flag が設定されていることを確認します。
- アプリケーションコード内のすべての状態遷移が Cookie を適切に確認し、その使用を強制しているかを判断します。
- 機密データが Cookie に永続化される場合は、Cookie 全体を暗号化すべきです。
- アプリケーションが使用しているすべての Cookie、その名前、および必要な理由を定義します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## HTML5 Web Storage API

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## HTML5 Web Storage API

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The Web Hypertext Application Technology Working Group (WHATWG) describes the HTML5 Web Storage APIs, `localStorage` and `sessionStorage`, as mechanisms for storing name-value pairs client-side.
Unlike HTTP cookies, the contents of `localStorage` and `sessionStorage` are not automatically shared within requests or responses by the browser and are used for storing data client-side.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Web Hypertext Application Technology Working Group (WHATWG) は、HTML5 Web Storage API である `localStorage` と `sessionStorage` を、クライアント側で name-value ペアを保存するメカニズムとして説明しています。
HTTP Cookie とは異なり、`localStorage` と `sessionStorage` の内容はブラウザによってリクエストやレスポンス内で自動的に共有されず、クライアント側でデータを保存するために使用されます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### The localStorage API

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### localStorage API

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

> [!WARNING]
> Do not store authentication tokens, session IDs, JWTs, refresh tokens, or any credential in `localStorage` or `sessionStorage`. These APIs are accessible to any JavaScript executing in the origin, so a single XSS vulnerability discloses every token. Use `HttpOnly; Secure; SameSite=Strict` cookies (preferred) or a Backend-for-Frontend (BFF) pattern. See [OAuth 2.0 for Browser-Based Apps](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-browser-based-apps).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

> [!WARNING]
> 認証トークン、セッション ID、JWT、リフレッシュトークン、または資格情報を `localStorage` や `sessionStorage` に保存してはいけません。これらの API は、同じオリジンで実行されるすべての JavaScript からアクセスできるため、一つの XSS 脆弱性ですべてのトークンが漏えいします。`HttpOnly; Secure; SameSite=Strict` Cookie (推奨) または Backend-for-Frontend (BFF) パターンを使用してください。[OAuth 2.0 for Browser-Based Apps](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-browser-based-apps) を参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Scope

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### スコープ

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Data stored using the `localStorage` API is accessible by pages which are loaded from the same origin, which is defined as the scheme (`https://`), host (`example.com`), port (`443`) and domain/realm (`example.com`).
This provides similar access to this data as would be achieved by using the `secure` flag on a cookie, meaning that data stored from `https` could not be retrieved via `http`. Due to potential concurrent access from separate windows/threads, data stored using `localStorage` may be susceptible to shared access issues (such as race-conditions) and should be considered non-locking ([Web Storage API Spec](https://html.spec.whatwg.org/multipage/webstorage.html#the-localstorage-attribute)).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

`localStorage` API を使って保存されたデータは、同じオリジンから読み込まれたページからアクセスできます。オリジンは、スキーム (`https://`)、ホスト (`example.com`)、ポート (`443`)、ドメイン/レルム (`example.com`) で定義されます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Duration

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

これは Cookie の `secure` flag を使用した場合と同様のアクセスをこのデータに提供します。つまり、`https` から保存されたデータは `http` 経由では取得できません。別々のウィンドウやスレッドからの同時アクセスの可能性があるため、`localStorage` に保存されたデータは共有アクセスの問題 (競合状態など) の影響を受ける可能性があり、非ロックであると考えるべきです ([Web Storage API Spec](https://html.spec.whatwg.org/multipage/webstorage.html#the-localstorage-attribute))。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Data stored using the `localStorage` API is persisted across browsing sessions, extending the timeframe in which it may be accessible to other system users.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 期間

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Offline Access

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

`localStorage` API を使って保存されたデータはブラウジングセッションをまたいで永続化され、他のシステムユーザーからアクセスされ得る時間枠を広げます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The standards do not require `localStorage` data to be encrypted-at-rest, meaning it may be possible to directly access this data from disk.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### オフラインアクセス

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Use Case

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

標準は `localStorage` データの保存時暗号化を要求していないため、ディスクから直接このデータにアクセスできる可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

WHATWG suggests the use of `localStorage` for data that needs to be accessed across windows or tabs, across multiple sessions, and where large (multi-megabyte) volumes of data may need to be stored for performance reasons.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### ユースケース

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### The sessionStorage API

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

WHATWG は、ウィンドウやタブをまたいで、複数セッションをまたいでアクセスする必要があるデータや、パフォーマンス上の理由から大容量 (数メガバイト) のデータを保存する必要がある場合に `localStorage` を使用することを提案しています。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Scope

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### sessionStorage API

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The `sessionStorage` API stores data within the window context from which it was called, meaning that Tab 1 cannot access data which was stored from Tab 2.
Also, like the `localStorage` API, data stored using the `sessionStorage` API is accessible by pages which are loaded from the same origin, which is defined as the scheme (`https://`), host (`example.com`), port (`443`) and domain/realm (`example.com`).
This provides similar access to this data as would be achieved by using the `secure` flag on a cookie, meaning that data stored from `https` could not be retrieved via `http`.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### スコープ

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Duration

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

`sessionStorage` API は、それが呼び出されたウィンドウコンテキスト内にデータを保存します。つまり、タブ 1 はタブ 2 から保存されたデータにアクセスできません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The `sessionStorage` API only stores data for the duration of the current browsing session. Once the tab is closed, that data is no longer retrievable. This does not necessarily prevent access, should a browser tab be reused or left open. Data may also persist in memory until a garbage collection event.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

また、`localStorage` API と同様に、`sessionStorage` API を使って保存されたデータは、同じオリジンから読み込まれたページからアクセスできます。オリジンは、スキーム (`https://`)、ホスト (`example.com`)、ポート (`443`)、ドメイン/レルム (`example.com`) で定義されます。これは Cookie の `secure` flag を使用した場合と同様のアクセスをこのデータに提供します。つまり、`https` から保存されたデータは `http` 経由では取得できません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Offline Access

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 期間

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The standards do not require `sessionStorage` data to be encrypted-at-rest, meaning it may be possible to directly access this data from disk.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

`sessionStorage` API は現在のブラウジングセッションの間だけデータを保存します。タブが閉じられると、そのデータは取得できなくなります。ただし、ブラウザタブが再利用されたり開いたまま残されたりした場合、アクセスを必ず防げるわけではありません。データはガベージコレクションイベントが発生するまでメモリに残ることもあります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Use Case

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### オフラインアクセス

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

WHATWG suggests the use of `sessionStorage` for data that is relevant for one-instance of a workflow, such as details for a ticket booking, but where multiple workflows could be performed in other tabs concurrently. The window/tab bound nature will keep the data from leaking between workflows in separate tabs.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

標準は `sessionStorage` データの保存時暗号化を要求していないため、ディスクから直接このデータにアクセスできる可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Web Workers

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### ユースケース

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Web Workers run JavaScript code in a global context separate from the one of the current window. A communication channel with the main execution window exists, which is called `MessageChannel`.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

WHATWG は、チケット予約の詳細など、一つのワークフローインスタンスに関連するデータで、他のタブでは複数のワークフローが同時に実行され得る場合に `sessionStorage` を使用することを提案しています。ウィンドウ/タブに束縛される性質により、別々のタブにあるワークフロー間でデータが漏れることを防ぎます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Use Case

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## Web Workers

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Web Workers are an alternative for browser storage of (session) secrets when storage persistence across page refresh is not a requirement. For Web Workers to provide secure browser storage, any code that requires the secret should exist within the Web Worker and the secret should never be transmitted to the main window context.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Web Workers は、現在のウィンドウとは別のグローバルコンテキストで JavaScript コードを実行します。メイン実行ウィンドウとの通信チャネルが存在し、これは `MessageChannel` と呼ばれます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Storing secrets within the memory of a Web Worker offers the same security guarantees as an HttpOnly cookie: the confidentiality of the secret is protected. Still, an XSS attack can be used to send messages to the Web Worker to perform an operation that requires the secret. The Web Worker will return the result of the operation to the main execution thread.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### ユースケース

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The advantage of a Web Worker implementation compared to an HttpOnly cookie is that a Web Worker allows for some isolated JavaScript code to access the secret; an HttpOnly cookie is not accessible to any JavaScript. If the frontend JavaScript code requires access to the secret, the Web Worker implementation is the only browser storage option that preserves the secret confidentiality.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Web Workers は、ページ更新をまたいだストレージ永続化が要件でない場合に、ブラウザで (セッション) シークレットを保存する代替手段です。Web Workers が安全なブラウザストレージを提供するには、シークレットを必要とするコードは Web Worker 内に存在すべきであり、シークレットをメインウィンドウコンテキストへ送信してはなりません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Session ID Life Cycle

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Web Worker のメモリ内にシークレットを保存すると、HttpOnly Cookie と同じセキュリティ保証、すなわちシークレットの機密性保護が得られます。それでも、XSS 攻撃により Web Worker へメッセージを送信し、シークレットを必要とする操作を実行させることは可能です。Web Worker はその操作の結果をメイン実行スレッドへ返します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Session ID Generation and Verification: Permissive and Strict Session Management

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

HttpOnly Cookie と比較した Web Worker 実装の利点は、Web Worker が分離された一部の JavaScript コードにシークレットへのアクセスを許可できることです。HttpOnly Cookie はどの JavaScript からもアクセスできません。フロントエンド JavaScript コードがシークレットへのアクセスを必要とする場合、シークレットの機密性を保つブラウザストレージの選択肢は Web Worker 実装だけです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

There are two types of session management mechanisms for web applications, permissive and strict, related to session fixation vulnerabilities. The permissive mechanism allows the web application to initially accept any session ID value set by the user as valid, creating a new session for it, while the strict mechanism enforces that the web application will only accept session ID values that have been previously generated by the web application.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## セッション ID のライフサイクル

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The session tokens should be handled by the web server if possible or generated via a cryptographically secure random number generator.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### セッション ID の生成と検証: 許容型と厳格型のセッション管理

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Although the most common mechanism in use today is the strict one (more secure), [PHP defaults to permissive](https://wiki.php.net/rfc/session-use-strict-mode). Developers must ensure that the web application does not use a permissive mechanism under certain circumstances. Web applications should never accept a session ID they have never generated, and in case of receiving one, they should generate and offer the user a new valid session ID. Additionally, this scenario should be detected as a suspicious activity and an alert should be generated.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Web アプリケーションには、セッション固定脆弱性に関連する二種類のセッション管理メカニズム、許容型と厳格型があります。許容型メカニズムは、ユーザーが設定した任意のセッション ID 値を Web アプリケーションが最初に有効なものとして受け入れ、その値に対して新しいセッションを作成します。一方、厳格型メカニズムは、Web アプリケーションが以前に生成したセッション ID 値だけを受け入れるよう強制します。セッショントークンは、可能であれば Web サーバーによって処理されるか、暗号論的に安全な乱数生成器で生成されるべきです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Manage Session ID as Any Other User Input

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

現在最も一般的に使用されているメカニズムは厳格型 (より安全) ですが、[PHP は既定で許容型](https://wiki.php.net/rfc/session-use-strict-mode)です。開発者は、特定の状況で Web アプリケーションが許容型メカニズムを使用しないようにしなければなりません。Web アプリケーションは、自身が生成したことのないセッション ID を決して受け入れるべきではありません。そのような ID を受け取った場合は、ユーザーに新しい有効なセッション ID を生成して提供すべきです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Session IDs must be considered untrusted, as any other user input processed by the web application, and they must be thoroughly validated and verified. Depending on the session management mechanism used, the session ID will be received in a GET or POST parameter, in the URL or in an HTTP header (e.g. cookies). If web applications do not validate and filter out invalid session ID values before processing them, they can potentially be used to exploit other web vulnerabilities, such as SQL injection if the session IDs are stored on a relational database, or persistent XSS if the session IDs are stored and reflected back afterwards by the web application.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

さらに、このシナリオは疑わしい活動として検出され、アラートを生成すべきです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Renew the Session ID After Any Privilege Level Change

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### セッション ID を他のユーザー入力と同様に管理する

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The session ID must be renewed or regenerated by the web application after any privilege level change within the associated user session. The most common scenario where the session ID regeneration is mandatory is during the authentication process, as the privilege level of the user changes from the unauthenticated (or anonymous) state to the authenticated state though in some cases still not yet the authorized state. Common scenarios to consider include; password changes, permission changes, or switching from a regular user role to an administrator role within the web application. For all sensitive pages of the web application, any previous session IDs must be ignored, only the current session ID must be assigned to every new request received for the protected resource, and the old or previous session ID must be destroyed.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

セッション ID は、Web アプリケーションが処理する他のユーザー入力と同じく信頼できないものと見なし、徹底的に検証および確認しなければなりません。使用されるセッション管理メカニズムによって、セッション ID は GET または POST パラメータ、URL、HTTP ヘッダー (Cookie など) で受信されます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The most common web development frameworks provide session functions and methods to renew the session ID, such as `request.getSession(true)` & `HttpSession.invalidate()` (J2EE), `Session.Abandon()` & `Response.Cookies.Add(new...)` (ASP .NET), or `session_start()` & `session_regenerate_id(true)` (PHP).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Web アプリケーションが無効なセッション ID 値を処理前に検証およびフィルタリングしない場合、セッション ID がリレーショナルデータベースに保存されていると SQL インジェクションに、セッション ID が保存され後で Web アプリケーションから反映されると永続 XSS に悪用されるなど、他の Web 脆弱性を悪用するために使われる可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The session ID regeneration is mandatory to prevent [session fixation attacks](https://www.acrossecurity.com/papers/session_fixation.pdf), where an attacker sets the session ID on the victim user's web browser instead of gathering the victim's session ID, as in most of the other session-based attacks, and independently of using HTTP or HTTPS. This protection mitigates the impact of other web-based vulnerabilities that can also be used to launch session fixation attacks, such as HTTP response splitting or XSS (see [here](https://media.blackhat.com/bh-eu-11/Raul_Siles/BlackHat_EU_2011_Siles_SAP_Session-Slides.pdf) and [here](https://media.blackhat.com/bh-eu-11/Raul_Siles/BlackHat_EU_2011_Siles_SAP_Session-WP.pdf)).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 権限レベル変更後にセッション ID を更新する

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

A complementary recommendation is to use a different session ID or token name (or set of session IDs) pre and post authentication, so that the web application can keep track of anonymous users and authenticated users without the risk of exposing or binding the user session between both states.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

関連付けられたユーザーセッション内で権限レベルが変更された後、Web アプリケーションはセッション ID を更新または再生成しなければなりません。セッション ID の再生成が必須となる最も一般的なシナリオは認証プロセスです。ユーザーの権限レベルが未認証 (または匿名) 状態から認証済み状態へ変化するためです。ただし、場合によってはまだ認可済み状態ではありません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Reauthentication After Risk Events

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

考慮すべき一般的なシナリオには、パスワード変更、権限変更、Web アプリケーション内で通常ユーザーロールから管理者ロールへ切り替わる場合が含まれます。Web アプリケーションのすべての機密ページについて、以前のセッション ID は無視されなければならず、保護されたリソースに対して受信される各新規リクエストには現在のセッション ID だけが割り当てられ、古いまたは以前のセッション ID は破棄されなければなりません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Web applications should require reauthentication after high-risk events such as:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

最も一般的な Web 開発フレームワークは、`request.getSession(true)` と `HttpSession.invalidate()` (J2EE)、`Session.Abandon()` と `Response.Cookies.Add(new...)` (ASP .NET)、`session_start()` と `session_regenerate_id(true)` (PHP) など、セッション ID を更新するためのセッション関数やメソッドを提供しています。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Changes to critical user information (e.g., password, email address)
- Login attempts from new or suspicious IP addresses or devices
- Account recovery flows (e.g., password reset or compromised-account detection)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

セッション ID の再生成は、[セッション固定攻撃](https://www.acrossecurity.com/papers/session_fixation.pdf)を防ぐために必須です。この攻撃では、攻撃者は他の多くのセッションベース攻撃のように被害者のセッション ID を収集するのではなく、被害者ユーザーの Web ブラウザにセッション ID を設定します。これは HTTP または HTTPS の使用にかかわらず成立します。この保護は、HTTP response splitting や XSS など、セッション固定攻撃の起動にも使用できる他の Web ベース脆弱性の影響を軽減します ([こちら](https://media.blackhat.com/bh-eu-11/Raul_Siles/BlackHat_EU_2011_Siles_SAP_Session-Slides.pdf) と [こちら](https://media.blackhat.com/bh-eu-11/Raul_Siles/BlackHat_EU_2011_Siles_SAP_Session-WP.pdf)を参照)。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

For best practices on implementing reauthentication after these events, see the [Reauthentication After Risk Events](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#reauthentication-after-risk-events) section in the Authentication Cheat Sheet

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

補完的な推奨事項として、認証前と認証後で異なるセッション ID またはトークン名 (またはセッション ID の集合) を使用し、Web アプリケーションが匿名ユーザーと認証済みユーザーを追跡できる一方で、両状態間でユーザーセッションを露出または結合するリスクを避けることが挙げられます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Additional Resources

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### リスクイベント後の再認証

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- [Why Frequent Reauthentication Can Be a UX Pitfall](https://tailscale.com/blog/frequent-reauth-security?lid=5wso20mx4knj) by Tailscale

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Web アプリケーションは、次のような高リスクイベント後に再認証を要求すべきです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Considerations When Using Multiple Cookies

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- 重要なユーザー情報 (パスワード、メールアドレスなど) の変更
- 新しい、または疑わしい IP アドレスやデバイスからのログイン試行
- アカウント復旧フロー (パスワードリセットや侵害アカウント検出など)

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

If the web application uses cookies as the session ID exchange mechanism, and multiple cookies are set for a given session, the web application must verify all cookies (and enforce relationships between them) before allowing access to the user session.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

これらのイベント後に再認証を実装するベストプラクティスについては、Authentication Cheat Sheet の [Reauthentication After Risk Events](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#reauthentication-after-risk-events) セクションを参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

It is very common for web applications to set a user cookie pre-authentication over HTTP to keep track of unauthenticated (or anonymous) users. Once the user authenticates in the web application, a new post-authentication secure cookie is set over HTTPS, and a binding between both cookies and the user session is established. If the web application does not verify both cookies for authenticated sessions, an attacker can make use of the pre-authentication unprotected cookie to get access to the authenticated user session (see [here](https://media.blackhat.com/bh-eu-11/Raul_Siles/BlackHat_EU_2011_Siles_SAP_Session-Slides.pdf) and [here](https://media.blackhat.com/bh-eu-11/Raul_Siles/BlackHat_EU_2011_Siles_SAP_Session-WP.pdf)).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 追加リソース

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Web applications should try to avoid the same cookie name for different paths or domain scopes within the same web application, as this increases the complexity of the solution and potentially introduces scoping issues.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- Tailscale による [Why Frequent Reauthentication Can Be a UX Pitfall](https://tailscale.com/blog/frequent-reauth-security?lid=5wso20mx4knj)

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Session Expiration

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 複数 Cookie 使用時の考慮事項

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

In order to minimize the time period an attacker can launch attacks over active sessions and hijack them, it is mandatory to set expiration timeouts for every session, establishing the amount of time a session will remain active. Insufficient session expiration by the web application increases the exposure of other session-based attacks, as for the attacker to be able to reuse a valid session ID and hijack the associated session, it must still be active.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Web アプリケーションがセッション ID 交換メカニズムとして Cookie を使用し、あるセッションに対して複数の Cookie が設定される場合、Web アプリケーションはユーザーセッションへのアクセスを許可する前に、すべての Cookie を検証しなければなりません (かつ、それらの関係を強制しなければなりません)。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The shorter the session interval is, the lesser the time an attacker has to use the valid session ID. The session expiration timeout values must be set accordingly with the purpose and nature of the web application, and balance security and usability, so that the user can comfortably complete the operations within the web application without the session frequently expiring.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Web アプリケーションが、未認証 (または匿名) ユーザーを追跡するために、認証前に HTTP 上でユーザー Cookie を設定することは非常に一般的です。ユーザーが Web アプリケーションで認証されると、新しい認証後の安全な Cookie が HTTPS 上で設定され、両方の Cookie とユーザーセッションの間に結合が確立されます。Web アプリケーションが認証済みセッションで両方の Cookie を検証しない場合、攻撃者は認証前の保護されていない Cookie を使用して、認証済みユーザーセッションにアクセスできる可能性があります ([こちら](https://media.blackhat.com/bh-eu-11/Raul_Siles/BlackHat_EU_2011_Siles_SAP_Session-Slides.pdf) と [こちら](https://media.blackhat.com/bh-eu-11/Raul_Siles/BlackHat_EU_2011_Siles_SAP_Session-WP.pdf)を参照)。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Both the idle and absolute timeout values are highly dependent on how critical the web application and its data are. Common idle timeouts ranges are 2-5 minutes for high-value applications and 15-30 minutes for low risk applications. Absolute timeouts depend on how long a user usually uses the application. If the application is intended to be used by an office worker for a full day, an appropriate absolute timeout range could be between 4 and 8 hours.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Web アプリケーションは、同じ Web アプリケーション内の異なるパスやドメインスコープで同じ Cookie 名を使用することを避けるよう努めるべきです。これは解決策の複雑さを増し、スコープに関する問題を生じさせる可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

When a session expires, the web application must take active actions to invalidate the session on both sides, client and server. The latter is the most relevant and mandatory from a security perspective.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## セッションの有効期限

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

For most session exchange mechanisms, client side actions to invalidate the session ID are based on clearing out the token value. For example, to invalidate a cookie it is recommended to provide an empty (or invalid) value for the session ID, and set the `Expires` (or `Max-Age`) attribute to a date from the past (in case a persistent cookie is being used): `Set-Cookie: id=; Expires=Friday, 17-May-03 18:45:00 GMT`

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

攻撃者がアクティブセッションに対して攻撃を行い、それをハイジャックできる時間を最小化するために、すべてのセッションに有効期限タイムアウトを設定し、セッションがアクティブであり続ける時間を定めることは必須です。Web アプリケーションによるセッション有効期限が不十分であると、他のセッションベース攻撃への露出が増えます。攻撃者が有効なセッション ID を再利用し、関連するセッションをハイジャックするには、そのセッションがまだアクティブでなければならないためです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

In order to close and invalidate the session on the server side, it is mandatory for the web application to take active actions when the session expires, or the user actively logs out, by using the functions and methods offered by the session management mechanisms, such as `HttpSession.invalidate()` (J2EE), `Session.Abandon()` (ASP .NET) or `session_destroy()/unset()` (PHP).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

セッション間隔が短いほど、攻撃者が有効なセッション ID を使用できる時間は短くなります。セッション有効期限タイムアウト値は、Web アプリケーションの目的と性質に応じて設定し、セキュリティとユーザビリティのバランスを取る必要があります。ユーザーが Web アプリケーション内の操作を快適に完了でき、セッションが頻繁に期限切れにならないようにします。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Automatic Session Expiration

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

アイドルタイムアウト値と絶対タイムアウト値は、Web アプリケーションとそのデータがどれほど重要かに大きく依存します。一般的なアイドルタイムアウトの範囲は、高価値アプリケーションでは 2-5 分、低リスクアプリケーションでは 15-30 分です。絶対タイムアウトは、ユーザーが通常どれくらいの時間アプリケーションを使用するかに依存します。アプリケーションがオフィスワーカーによって一日中使用されることを想定している場合、適切な絶対タイムアウト範囲は 4-8 時間程度になり得ます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Idle Timeout

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

セッションが期限切れになると、Web アプリケーションはクライアント側とサーバー側の両方でセッションを無効化するために能動的な処理を行わなければなりません。後者はセキュリティの観点から最も重要であり、必須です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

All sessions should implement an idle or inactivity timeout. This timeout defines the amount of time a session will remain active in case there is no activity in the session, closing and invalidating the session upon the defined idle period since the last HTTP request received by the web application for a given session ID.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

ほとんどのセッション交換メカニズムでは、クライアント側でセッション ID を無効化する処理はトークン値を消去することに基づきます。たとえば Cookie を無効化するには、セッション ID に空 (または無効) の値を設定し、永続 Cookie が使用されている場合には `Expires` (または `Max-Age`) 属性を過去の日付に設定することが推奨されます: `Set-Cookie: id=; Expires=Friday, 17-May-03 18:45:00 GMT`

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The idle timeout limits the chances an attacker has to guess and use a valid session ID from another user. However, if the attacker is able to hijack a given session, the idle timeout does not limit the attacker's actions, as they can generate activity on the session periodically to keep the session active for longer periods of time.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

サーバー側でセッションを閉じて無効化するには、セッションが期限切れになったとき、またはユーザーが能動的にログアウトしたときに、Web アプリケーションが能動的な処理を行うことが必須です。たとえば `HttpSession.invalidate()` (J2EE)、`Session.Abandon()` (ASP .NET)、`session_destroy()/unset()` (PHP) など、セッション管理メカニズムが提供する関数やメソッドを使用します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Session timeout management and expiration must be enforced server-side. If the client is used to enforce the session timeout, for example using the session token or other client parameters to track time references (e.g. number of minutes since login time), an attacker could manipulate these to extend the session duration.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 自動セッション有効期限

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Absolute Timeout

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### アイドルタイムアウト

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

All sessions should implement an absolute timeout, regardless of session activity. This timeout defines the maximum amount of time a session can be active, closing and invalidating the session upon the defined absolute period since the given session was initially created by the web application. After invalidating the session, the user is forced to (re)authenticate again in the web application and establish a new session.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

すべてのセッションは、アイドルまたは非アクティビティタイムアウトを実装すべきです。このタイムアウトは、セッションに活動がない場合にセッションがアクティブであり続ける時間を定義し、特定のセッション ID について Web アプリケーションが最後に受信した HTTP リクエストから定義されたアイドル期間が経過した時点でセッションを閉じて無効化します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The absolute session limits the amount of time an attacker can use a hijacked session and impersonate the victim user.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

アイドルタイムアウトは、攻撃者が他のユーザーの有効なセッション ID を推測して使用できる可能性を制限します。ただし、攻撃者が特定のセッションをハイジャックできた場合、攻撃者はセッション上で定期的に活動を発生させて長時間アクティブに保てるため、アイドルタイムアウトは攻撃者の行動を制限しません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Renewal Timeout

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

セッションタイムアウト管理と有効期限はサーバー側で強制されなければなりません。クライアントがセッションタイムアウトを強制する場合、たとえばセッショントークンや他のクライアントパラメータを使用して時間参照 (ログイン時からの経過分数など) を追跡すると、攻撃者はそれらを操作してセッション期間を延長できる可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Alternatively, the web application can implement an additional renewal timeout after which the session ID is automatically renewed, in the middle of the user session, and independently of the session activity and, therefore, of the idle timeout.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 絶対タイムアウト

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

After a specific amount of time since the session was initially created, the web application can regenerate a new ID for the user session and try to set it, or renew it, on the client. The previous session ID value would still be valid for some time, accommodating a safety interval, before the client is aware of the new ID and starts using it. At that time, when the client switches to the new ID inside the current session, the application invalidates the previous ID.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

すべてのセッションは、セッション活動にかかわらず絶対タイムアウトを実装すべきです。このタイムアウトは、セッションがアクティブであり得る最大時間を定義し、Web アプリケーションによって特定のセッションが最初に作成されてから定義された絶対期間が経過した時点で、セッションを閉じて無効化します。セッションを無効化した後、ユーザーは Web アプリケーションで再度認証し、新しいセッションを確立することを強制されます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

This scenario minimizes the amount of time a given session ID value, potentially obtained by an attacker, can be reused to hijack the user session, even when the victim user session is still active. The user session remains alive and open on the legitimate client, although its associated session ID value is transparently renewed periodically during the session duration, every time the renewal timeout expires. Therefore, the renewal timeout complements the idle and absolute timeouts, specially when the absolute timeout value extends significantly over time (e.g. it is an application requirement to keep the user sessions open for long periods of time).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

絶対セッションは、攻撃者がハイジャックしたセッションを使用して被害者ユーザーになりすませる時間を制限します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Depending on the implementation, potentially there could be a race condition where the attacker with a still valid previous session ID sends a request before the victim user, right after the renewal timeout has just expired, and obtains first the value for the renewed session ID. At least in this scenario, the victim user might be aware of the attack as the session will be suddenly terminated because the associated session ID is not valid anymore.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 更新タイムアウト

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Manual Session Expiration

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

代替として、Web アプリケーションは、一定時間後にセッション ID を自動的に更新する追加の更新タイムアウトを、ユーザーセッションの途中で、かつセッション活動、したがってアイドルタイムアウトとは独立して実装できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Web applications should provide mechanisms that allow security aware users to actively close their session once they have finished using the web application.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

セッションが最初に作成されてから特定の時間が経過した後、Web アプリケーションはユーザーセッション用の新しい ID を再生成し、それをクライアントに設定または更新しようとできます。以前のセッション ID 値は、クライアントが新しい ID を認識し使い始めるまで、安全のための猶予期間としてしばらく有効なままになります。その時点で、クライアントが現在のセッション内で新しい ID に切り替えると、アプリケーションは以前の ID を無効化します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Logout Button

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

このシナリオは、攻撃者が取得した可能性のある特定のセッション ID 値を、被害者ユーザーのセッションがまだアクティブな場合でも、ユーザーセッションのハイジャックに再利用できる時間を最小化します。正当なクライアント上のユーザーセッションは生存し開いたままですが、関連付けられたセッション ID 値はセッション期間中、更新タイムアウトが切れるたびに透過的に定期更新されます。したがって、更新タイムアウトは、特に絶対タイムアウト値が大きく時間的に延びる場合 (たとえばユーザーセッションを長時間開いたままにすることがアプリケーション要件である場合)、アイドルタイムアウトと絶対タイムアウトを補完します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Web applications must provide a visible and easily accessible logout (logoff, exit, or close session) button that is available on the web application header or menu and reachable from every web application resource and page, so that the user can manually close the session at any time. As described in *Session_Expiration* section, the web application must invalidate the session at least on server side.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

実装によっては、更新タイムアウトが切れた直後に、まだ有効な以前のセッション ID を持つ攻撃者が被害者ユーザーより先にリクエストを送信し、更新されたセッション ID の値を先に取得する競合状態が起きる可能性があります。少なくともこのシナリオでは、関連付けられたセッション ID がもはや有効でないためセッションが突然終了し、被害者ユーザーが攻撃に気付く可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**NOTE**: Unfortunately, not all web applications facilitate users to close their current session. Thus, client-side enhancements allow conscientious users to protect their sessions by helping to close them diligently.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 手動セッション有効期限

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Web Content Caching and Clear-Site-Data

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Web アプリケーションは、セキュリティ意識のあるユーザーが Web アプリケーションの使用を終えた後に、自分のセッションを能動的に閉じることを可能にするメカニズムを提供すべきです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Even after the session has ended, private or sensitive data exchanged during the session may still be accessible through the web browser's cache. To mitigate this, web applications must use restrictive cache directives for all HTTP and HTTPS traffic. This includes the use of HTTP headers such as [`Cache-Control`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control) and [`Pragma`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Pragma), or equivalent `<meta>` tags on all pages—especially those displaying sensitive content.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### ログアウトボタン

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Session identifiers must never be cached. To prevent this, it is highly recommended to include the `Cache-Control: no-store` directive in responses containing session IDs. Unlike `no-cache`, which allows caching but requires revalidation, `no-store` ensures that the response (including headers like `Set-Cookie`) is never stored in any cache.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Web アプリケーションは、表示され、容易にアクセスできるログアウト (logoff、exit、close session) ボタンを提供しなければなりません。このボタンは Web アプリケーションのヘッダーまたはメニューにあり、すべての Web アプリケーションリソースとページから到達可能である必要があります。これにより、ユーザーはいつでも手動でセッションを閉じられます。*Session_Expiration* セクションで説明したように、Web アプリケーションは少なくともサーバー側でセッションを無効化しなければなりません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

In addition to preventing future caching, applications should ensure that previously stored sensitive data is removed when a session ends. This can be achieved by returning the Clear-Site-Data response header (for example, `Clear-Site-Data: "cache", "cookies", "storage"`) during logout or session termination. This instructs the browser to delete cached resources, cookies, and other client-side storage associated with the origin, helping ensure a complete session cleanup.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**注記**: 残念ながら、すべての Web アプリケーションがユーザーに現在のセッションを閉じる手段を提供しているわけではありません。そのため、クライアント側の拡張は、意識の高いユーザーがセッションをきちんと閉じることを支援し、セッションを保護する助けになります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

> **Note:** The directive `Cache-Control: no-cache="Set-Cookie, Set-Cookie2"` is sometimes suggested to prevent session ID caching. However, this syntax is not widely supported and may lead to unintended behavior. Instead, use `Cache-Control: no-store` for stronger protection. `Clear-Site-Data: cache` can be used to clear every stored response for a site in the browser cache, so use this with care. Note that this will not affect shared or intermediate caches.
> **Reference:** [MDN - Cache-Control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control) and [MDN - Clear-Site-Data header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Clear-Site-Data)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Web コンテンツキャッシュと Clear-Site-Data

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Reauthentication After Risk Events

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

セッション終了後であっても、セッション中に交換された非公開データや機密データが Web ブラウザのキャッシュからアクセス可能な場合があります。これを軽減するために、Web アプリケーションはすべての HTTP および HTTPS トラフィックに対して制限的なキャッシュディレクティブを使用しなければなりません。これには、[`Cache-Control`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control) や [`Pragma`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Pragma) などの HTTP ヘッダー、またはすべてのページ、特に機密コンテンツを表示するページ上の同等の `<meta>` タグの使用が含まれます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

To ensure session integrity and account protection, applications should require reauthentication when specific high-risk events are detected. These may include:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

セッション識別子は決してキャッシュされてはなりません。これを防ぐため、セッション ID を含むレスポンスには `Cache-Control: no-store` ディレクティブを含めることが強く推奨されます。再検証を要求しつつキャッシュを許可する `no-cache` とは異なり、`no-store` はレスポンス (`Set-Cookie` のようなヘッダーを含む) がどのキャッシュにも保存されないことを保証します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Attempted or completed password changes
- Login from a new or suspicious IP address or device
- Completion of account recovery or challenge flows (e.g., hacked-lock scenarios)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

将来のキャッシュを防ぐだけでなく、アプリケーションはセッション終了時に以前保存された機密データが削除されることを確認すべきです。これは、ログアウトまたはセッション終了時に Clear-Site-Data レスポンスヘッダー (例: `Clear-Site-Data: "cache", "cookies", "storage"`) を返すことで実現できます。これはブラウザに対し、オリジンに関連付けられたキャッシュ済みリソース、Cookie、その他のクライアント側ストレージを削除するよう指示し、完全なセッションクリーンアップの確保を助けます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Requiring reauthentication helps mitigate session hijacking and unauthorized access—especially when long-lived sessions or external identity providers are in use.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

> **注記:** `Cache-Control: no-cache="Set-Cookie, Set-Cookie2"` ディレクティブは、セッション ID のキャッシュを防ぐために提案されることがあります。しかし、この構文は広くサポートされておらず、意図しない挙動につながる可能性があります。より強い保護には `Cache-Control: no-store` を使用してください。`Clear-Site-Data: cache` はブラウザキャッシュ内のサイトのすべての保存済みレスポンスを消去するために使用できるため、注意して使用してください。これは共有キャッシュや中間キャッシュには影響しない点に注意してください。
> **参考:** [MDN - Cache-Control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control) と [MDN - Clear-Site-Data header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Clear-Site-Data)

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Recommended Practices:**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## リスクイベント後の再認証

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Prompt users for primary credentials (e.g., password) or enforce MFA
- Provide clear messaging explaining the need to reauthenticate

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

セッションの完全性とアカウント保護を確保するために、アプリケーションは特定の高リスクイベントが検出されたときに再認証を要求すべきです。これには次のものが含まれます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Additional Client-Side Defenses for Session Management

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- パスワード変更の試行または完了
- 新しい、または疑わしい IP アドレスやデバイスからのログイン
- アカウント復旧またはチャレンジフロー (hacked-lock シナリオなど) の完了

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Web applications can complement the previously described session management defenses with additional countermeasures on the client side. Client-side protections, typically in the form of JavaScript checks and verifications, are not bullet proof and can easily be defeated by a skilled attacker, but can introduce another layer of defense that has to be bypassed by intruders.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

再認証を要求することで、特に長期間有効なセッションや外部 ID プロバイダが使用されている場合に、セッションハイジャックと不正アクセスの軽減に役立ちます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Initial Login Timeout

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**推奨プラクティス:**

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Web applications can use JavaScript code in the login page to evaluate and measure the amount of time since the page was loaded and a session ID was granted. If a login attempt is tried after a specific amount of time, the client code can notify the user that the maximum amount of time to log in has passed and reload the login page, hence retrieving a new session ID.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- ユーザーに主要資格情報 (パスワードなど) の入力を求める、または MFA を強制します。
- 再認証が必要な理由を説明する明確なメッセージを提供します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

This extra protection mechanism tries to force the renewal of the session ID pre-authentication, avoiding scenarios where a previously used (or manually set) session ID is reused by the next victim using the same computer, for example, in session fixation attacks.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## セッション管理のための追加のクライアント側防御

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Force Session Logout On Web Browser Window Close Events

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Web アプリケーションは、前述のセッション管理防御を、クライアント側の追加対策で補完できます。通常 JavaScript のチェックや検証として実装されるクライアント側保護は、防弾ではなく、熟練した攻撃者によって容易に突破され得ます。それでも侵入者が回避しなければならない追加の防御層を導入できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Web applications can use JavaScript code to capture all the web browser tab or window close (or even back) events and take the appropriate actions to close the current session before closing the web browser, emulating that the user has manually closed the session via the logout button.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 初期ログインタイムアウト

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Disable Web Browser Cross-Tab Sessions

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Web アプリケーションはログインページで JavaScript コードを使用し、ページが読み込まれてからセッション ID が付与されてからの経過時間を評価および測定できます。特定の時間が経過した後にログイン試行が行われた場合、クライアントコードはログイン可能な最大時間が過ぎたことをユーザーに通知し、ログインページを再読み込みして新しいセッション ID を取得できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Web applications can use JavaScript code once the user has logged in and a session has been established to force the user to re-authenticate if a new web browser tab or window is opened against the same web application. The web application does not want to allow multiple web browser tabs or windows to share the same session. Therefore, the application tries to force the web browser to not share the same session ID simultaneously between them.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

この追加保護メカニズムは、認証前のセッション ID の更新を強制しようとするものです。たとえばセッション固定攻撃で、以前に使用された (または手動で設定された) セッション ID が同じコンピュータを使う次の被害者に再利用されるシナリオを避けるためです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**NOTE**: This mechanism cannot be implemented if the session ID is exchanged through cookies, as cookies are shared by all web browser tabs/windows.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Web ブラウザウィンドウ終了イベントでセッションログアウトを強制する

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Automatic Client Logout

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Web アプリケーションは JavaScript コードを使用して、Web ブラウザのタブまたはウィンドウの close イベント (または back イベント) をすべて捕捉し、Web ブラウザが閉じられる前に現在のセッションを閉じるための適切な処理を行えます。これは、ユーザーがログアウトボタンで手動でセッションを閉じたことを模倣します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

JavaScript code can be used by the web application in all (or critical) pages to automatically logout client sessions after the idle timeout expires, for example, by redirecting the user to the logout page (the same resource used by the logout button mentioned previously).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Web ブラウザのクロスタブセッションを無効化する

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The benefit of enhancing the server-side idle timeout functionality with client-side code is that the user can see that the session has finished due to inactivity, or even can be notified in advance that the session is about to expire through a count down timer and warning messages. This user-friendly approach helps to avoid loss of work in web pages that require extensive input data due to server-side silently expired sessions.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Web アプリケーションは、ユーザーがログインしセッションが確立された後に JavaScript コードを使用し、同じ Web アプリケーションに対して新しい Web ブラウザタブまたはウィンドウが開かれた場合に、ユーザーへ再認証を強制できます。Web アプリケーションは、複数の Web ブラウザタブまたはウィンドウが同じセッションを共有することを許可したくありません。そのため、ブラウザがそれらの間で同じセッション ID を同時に共有しないよう強制しようとします。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Session Attacks Detection

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**注記**: セッション ID が Cookie で交換される場合、このメカニズムは実装できません。Cookie はすべての Web ブラウザタブ/ウィンドウで共有されるためです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Session ID Guessing and Brute Force Detection

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 自動クライアントログアウト

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

If an attacker tries to guess or brute force a valid session ID, they need to launch multiple sequential requests against the target web application using different session IDs from a single (or set of) IP address(es). Additionally, if an attacker tries to analyze the predictability of the session ID (e.g. using statistical analysis), they need to launch multiple sequential requests from a single (or set of) IP address(es) against the target web application to gather new valid session IDs.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

JavaScript コードを Web アプリケーションのすべての (または重要な) ページで使用し、アイドルタイムアウトが切れた後にクライアントセッションを自動的にログアウトできます。たとえば、前述のログアウトボタンで使われるものと同じリソースであるログアウトページへユーザーをリダイレクトします。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Web applications must be able to detect both scenarios based on the number of attempts to gather (or use) different session IDs and alert and/or block the offending IP address(es).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

サーバー側のアイドルタイムアウト機能をクライアント側コードで補強する利点は、ユーザーが非アクティビティによりセッションが終了したことを確認できること、またはカウントダウンタイマーや警告メッセージにより、セッションが間もなく期限切れになることを事前に通知できることです。このユーザーフレンドリーなアプローチは、サーバー側でセッションが静かに期限切れになることにより、大量の入力データを必要とする Web ページで作業内容が失われることを避ける助けになります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Detecting Session ID Anomalies

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## セッション攻撃の検知

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Web applications should focus on detecting anomalies associated to the session ID, such as its manipulation. The OWASP [AppSensor Project](https://owasp.org/www-project-appsensor/) provides a framework and methodology to implement built-in intrusion detection capabilities within web applications focused on the detection of anomalies and unexpected behaviors, in the form of detection points and response actions. Instead of using external protection layers, sometimes the business logic details and advanced intelligence are only available from inside the web application, where it is possible to establish multiple session related detection points, such as when an existing cookie is modified or deleted, a new cookie is added, the session ID from another user is reused, or when the user location or User-Agent changes in the middle of a session.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### セッション ID 推測と総当たりの検知

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Binding the Session ID to Other User Properties

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

攻撃者が有効なセッション ID を推測または総当たりしようとする場合、単一の (または一組の) IP アドレスから、異なるセッション ID を使って標的 Web アプリケーションへ複数の連続したリクエストを送る必要があります。さらに、攻撃者がセッション ID の予測可能性を分析しようとする場合 (統計分析など)、新しい有効なセッション ID を収集するために、単一の (または一組の) IP アドレスから標的 Web アプリケーションへ複数の連続したリクエストを送る必要があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

With the goal of detecting (and, in some scenarios, protecting against) user misbehaviors and session hijacking, it is highly recommended to bind the session ID to other user or client properties, such as the client IP address, User-Agent, or client-based digital certificate. If the web application detects any change or anomaly between these different properties in the middle of an established session, this is a very good indicator of session manipulation and hijacking attempts, and this simple fact can be used to alert and/or terminate the suspicious session.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Web アプリケーションは、異なるセッション ID を収集 (または使用) しようとする試行回数に基づいて、両方のシナリオを検出し、問題の IP アドレスに対してアラートおよび/またはブロックを行える必要があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Although these properties cannot be used by web applications to trustingly defend against session attacks, they significantly increase the web application detection (and protection) capabilities. However, a skilled attacker can bypass these controls by reusing the same IP address assigned to the victim user by sharing the same network (very common in NAT environments, like Wi-Fi hotspots) or by using the same outbound web proxy (very common in corporate environments), or by manually modifying the User-Agent to look exactly like the victim user's.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### セッション ID 異常の検知

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Logging Sessions Life Cycle: Monitoring Creation, Usage, and Destruction of Session IDs

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Web アプリケーションは、セッション ID に関連する異常、たとえばその操作に焦点を当てて検出すべきです。OWASP [AppSensor Project](https://owasp.org/www-project-appsensor/) は、検出ポイントとレスポンスアクションの形で、異常や予期しない動作の検出に焦点を当てた組み込み侵入検知機能を Web アプリケーション内に実装するためのフレームワークと方法論を提供します。外部の保護層を使用する代わりに、ビジネスロジックの詳細や高度なインテリジェンスが Web アプリケーション内部でのみ利用できる場合があります。その場所では、既存の Cookie が変更または削除されたとき、新しい Cookie が追加されたとき、別ユーザーのセッション ID が再利用されたとき、セッションの途中でユーザーの位置や User-Agent が変化したときなど、複数のセッション関連検出ポイントを確立できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Web applications should increase their logging capabilities by including information regarding the full life cycle of sessions. In particular, it is recommended to record session related events, such as the creation, renewal, and destruction of session IDs, as well as details about its usage within login and logout operations, privilege level changes within the session, timeout expiration, invalid session activities (when detected), and critical business operations during the session.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### セッション ID を他のユーザープロパティに結び付ける

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The log details might include a timestamp, source IP address, web target resource requested (and involved in a session operation), HTTP headers (including the User-Agent and Referer), GET and POST parameters, error codes and messages, username (or user ID), plus the session ID (cookies, URL, GET, POST…).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

ユーザーの不正行為やセッションハイジャックを検出する (場合によっては防ぐ) 目的で、セッション ID をクライアント IP アドレス、User-Agent、クライアントベースのデジタル証明書など、他のユーザーまたはクライアントのプロパティに結び付けることが強く推奨されます。確立済みセッションの途中で、これらの異なるプロパティ間に変化や異常を Web アプリケーションが検出した場合、それはセッション操作やハイジャック試行の非常に良い指標であり、この事実だけで疑わしいセッションに対してアラートを出す、または終了するために使用できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Sensitive data like the session ID should not be included in the logs in order to protect the session logs against session ID local or remote disclosure or unauthorized access. However, some kind of session-specific information must be logged in order to correlate log entries to specific sessions. It is recommended to log a salted-hash of the session ID instead of the session ID itself in order to allow for session-specific log correlation without exposing the session ID.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

これらのプロパティは Web アプリケーションがセッション攻撃に対して信頼して防御するためには使用できませんが、Web アプリケーションの検知 (および保護) 能力を大幅に高めます。ただし、熟練した攻撃者は、被害者ユーザーと同じネットワークを共有することで同じ IP アドレスを再利用したり (Wi-Fi ホットスポットのような NAT 環境で非常に一般的)、同じ外向き Web プロキシを使用したり (企業環境で非常に一般的)、User-Agent を手動で変更して被害者ユーザーのものとまったく同じに見せたりすることで、これらの制御を回避できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

In particular, web applications must thoroughly protect administrative interfaces that allow to manage all the current active sessions. Frequently these are used by support personnel to solve session related issues, or even general issues, by impersonating the user and looking at the web application as the user does.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### セッションライフサイクルのログ記録: セッション ID の作成、使用、破棄の監視

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The session logs become one of the main web application intrusion detection data sources, and can also be used by intrusion protection systems to automatically terminate sessions and/or disable user accounts when (one or many) attacks are detected. If active protections are implemented, these defensive actions must be logged too.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Web アプリケーションは、セッションの完全なライフサイクルに関する情報を含めることでログ記録能力を高めるべきです。特に、セッション ID の作成、更新、破棄などのセッション関連イベントに加え、ログインおよびログアウト操作内での使用、セッション内での権限レベル変更、タイムアウト期限切れ、無効なセッション活動 (検出された場合)、セッション中の重要なビジネス操作に関する詳細を記録することが推奨されます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Simultaneous Session Logons

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

ログの詳細には、タイムスタンプ、送信元 IP アドレス、リクエストされた Web 対象リソース (およびセッション操作に関与したリソース)、HTTP ヘッダー (User-Agent と Referer を含む)、GET および POST パラメータ、エラーコードとメッセージ、ユーザー名 (またはユーザー ID)、さらにセッション ID (Cookie、URL、GET、POST...) が含まれる場合があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

It is the web application design decision to determine if multiple simultaneous logons from the same user are allowed from the same or from different client IP addresses. If the web application does not want to allow simultaneous session logons, it must take effective actions after each new authentication event, implicitly terminating the previously available session, or asking the user (through the old, new or both sessions) about the session that must remain active.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

セッション ID のような機密データは、セッションログをセッション ID のローカルまたはリモートでの漏えいや不正アクセスから保護するため、ログに含めるべきではありません。ただし、特定のセッションにログエントリを関連付けるために、何らかのセッション固有情報をログに記録しなければなりません。セッション ID そのものを露出せずにセッション固有のログ相関を可能にするため、セッション ID の代わりに salted-hash をログに記録することが推奨されます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

It is recommended for web applications to add user capabilities that allow checking the details of active sessions at any time, monitor and alert the user about concurrent logons, provide user features to remotely terminate sessions manually, and track account activity history (logbook) by recording multiple client details such as IP address, User-Agent, login date and time, idle time, etc.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

特に Web アプリケーションは、現在アクティブなすべてのセッションを管理できる管理インターフェースを徹底的に保護しなければなりません。これらは、サポート担当者がセッション関連の問題や一般的な問題を解決するために、ユーザーになりすましてユーザーと同じように Web アプリケーションを見る目的で頻繁に使用されます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Session Management WAF Protections

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

セッションログは Web アプリケーション侵入検知の主要なデータソースの一つとなり、攻撃が検出されたときにセッションを自動的に終了したりユーザーアカウントを無効化したりする侵入防止システムにも使用できます。能動的な保護が実装されている場合、これらの防御アクションもログに記録しなければなりません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

There are situations where the web application source code is not available or cannot be modified, or when the changes required to implement the multiple security recommendations and best practices detailed above imply a full redesign of the web application architecture, and therefore, cannot be easily implemented in the short term.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 同時セッションログオン

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

In these scenarios, or to complement the web application defenses, and with the goal of keeping the web application as secure as possible, it is recommended to use external protections such as Web Application Firewalls (WAFs) that can mitigate the session management threats already described.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

同じユーザーからの複数の同時ログオンを、同じクライアント IP アドレスから、または異なるクライアント IP アドレスから許可するかどうかは、Web アプリケーションの設計判断です。Web アプリケーションが同時セッションログオンを許可したくない場合、各新規認証イベントの後に有効な処理を行い、以前利用可能だったセッションを暗黙的に終了するか、旧セッション、新セッション、またはその両方を通じて、どのセッションをアクティブなままにするかをユーザーに尋ねなければなりません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Web Application Firewalls offer detection and protection capabilities against session based attacks. On the one hand, it is trivial for WAFs to enforce the usage of security attributes on cookies, such as the `Secure` and `HttpOnly` flags, applying basic rewriting rules on the `Set-Cookie` header for all the web application responses that set a new cookie.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Web アプリケーションには、ユーザーがいつでもアクティブセッションの詳細を確認できる機能、同時ログオンを監視してユーザーへ通知する機能、セッションを手動でリモート終了できるユーザー機能、IP アドレス、User-Agent、ログイン日時、アイドル時間など複数のクライアント詳細を記録してアカウント活動履歴 (logbook) を追跡する機能を追加することが推奨されます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

On the other hand, more advanced capabilities can be implemented to allow the WAF to keep track of sessions, and the corresponding session IDs, and apply all kind of protections against session fixation (by renewing the session ID on the client-side when privilege changes are detected), enforcing sticky sessions (by verifying the relationship between the session ID and other client properties, like the IP address or User-Agent), or managing session expiration (by forcing both the client and the web application to finalize the session).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## セッション管理の WAF 保護

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The open-source ModSecurity WAF, plus the OWASP [Core Rule Set](https://owasp.org/www-project-modsecurity-core-rule-set/), provide capabilities to detect and apply security cookie attributes, countermeasures against session fixation attacks, and session tracking features to enforce sticky sessions.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Web アプリケーションのソースコードが利用できない、または変更できない場合や、上記で詳述した複数のセキュリティ推奨事項とベストプラクティスを実装するために必要な変更が Web アプリケーションアーキテクチャの全面的な再設計を伴い、短期的には容易に実装できない場合があります。

</div>
</div>

<div className="bilingualPair">

<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

このようなシナリオでは、または Web アプリケーション防御を補完するため、そして Web アプリケーションを可能な限り安全に保つ目的で、すでに説明したセッション管理上の脅威を軽減できる Web Application Firewall (WAF) などの外部保護を使用することが推奨されます。

</div>
</div>

<div className="bilingualPair">

<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Web Application Firewall は、セッションベース攻撃に対する検知および保護機能を提供します。一方では、WAF が `Secure` や `HttpOnly` フラグなどの Cookie 上のセキュリティ属性の使用を強制することは容易です。新しい Cookie を設定するすべての Web アプリケーションレスポンスについて、`Set-Cookie` ヘッダーに基本的な書き換えルールを適用できます。

</div>
</div>

<div className="bilingualPair">

<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

他方では、WAF がセッションと対応するセッション ID を追跡し、あらゆる種類の保護を適用できるようにする、より高度な機能も実装できます。たとえば、権限変更が検出されたときにクライアント側でセッション ID を更新することでセッション固定に対抗する、セッション ID と IP アドレスや User-Agent などの他のクライアントプロパティとの関係を検証して sticky sessions を強制する、クライアントと Web アプリケーションの両方にセッションを終了させてセッション有効期限を管理する、といった機能です。

</div>
</div>

<div className="bilingualPair">

<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

オープンソースの ModSecurity WAF と OWASP [Core Rule Set](https://owasp.org/www-project-modsecurity-core-rule-set/) は、セキュリティ Cookie 属性の検出と適用、セッション固定攻撃への対策、sticky sessions を強制するためのセッション追跡機能を提供します。

</div>
</div>

</section>
</div>


## References

<div className="referenceFooter">

- [Web Storage APIs](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API)
- [LocalStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [SessionStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage)
- [WHATWG Web Storage Spec](https://html.spec.whatwg.org/multipage/webstorage.html#webstorage)

</div>

## Attribution

<div className="attributionFooter">

- Original: Session Management Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: English original retained for comparison. Japanese translation added. Bilingual display generated from official source and local Japanese translation.
- Retrieved: 2026-05-21

</div>
