---
title: Authentication Cheat Sheet
hide_title: true
---

<div className="docHero" data-category="authentication">
  <h1>認証チートシート</h1>
  <div className="docMeta">
    <span className="docPill">最終更新: 2026-05-20</span>
    <span className="docPill">読了時間: 約 20 分</span>
    <span className="docPill">カテゴリ: 認証</span>
  </div>
</div>

<p className="docLead">認証チートシートを、原文・翻訳・対比表示で確認できます。ASVS Index 対応の文脈で、公式原文と日本語訳を確認しやすく整理しています。</p>

<div className="tabbedContent">
  <input className="tabInput" type="radio" name="authentication-view" id="authentication-original" />
  <input className="tabInput" type="radio" name="authentication-view" id="authentication-translation" defaultChecked />
  <input className="tabInput" type="radio" name="authentication-view" id="authentication-bilingual" />

  <div className="contentTabs">
    <label htmlFor="authentication-original" title="OWASP 原文">原文</label>
    <label htmlFor="authentication-translation" title="日本語訳">翻訳</label>
    <label htmlFor="authentication-bilingual" title="原文と翻訳を並べて確認">対比表示</label>
  </div>

<section id="authentication-original-panel" className="tabPanel originalPanel contentPanel">

## Introduction

**Authentication** (**AuthN**) is the process of verifying that an individual, entity, or website is who or what it claims to be by determining the validity of one or more authenticators (like passwords, fingerprints, or security tokens) that are used to back up this claim.

**Digital Identity** is the unique representation of a subject engaged in an online transaction. A digital identity is always unique in the context of a digital service but does not necessarily need to be traceable back to a specific real-life subject.

**Identity Proofing** establishes that a subject is actually who they claim to be. This concept is related to KYC concepts and it aims to bind a digital identity with a real person.

**Session Management** is a process by which a server maintains the state of an entity interacting with it. This is required for a server to remember how to react to subsequent requests throughout a transaction. Sessions are maintained on the server by a session identifier which can be passed back and forth between the client and server when transmitting and receiving requests. Sessions should be unique per user and computationally very difficult to predict. The [Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html) contains further guidance on the best practices in this area.

## Authentication General Guidelines

### User IDs

The primary function of a User ID is to uniquely identify a user within a system. Ideally, User IDs should be randomly generated to prevent the creation of predictable or sequential IDs, which could pose a security risk, especially in systems where User IDs might be exposed or inferred from external sources.

### Usernames

Usernames are easy-to-remember identifiers chosen by the user and used for identifying themselves when logging into a system or service. The terms User ID and username might be used interchangeably if the username chosen by the user also serves as their unique identifier within the system.

Users should be permitted to use their email address as a username, provided the email is verified during sign-up. Additionally, they should have the option to choose a username other than an email address. For information on validating email addresses, please visit the [input validation cheat sheet email discussion](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html#email-address-validation).

### Authentication Solution and Sensitive Accounts

- Do **NOT** allow login with sensitive accounts (i.e. accounts that can be used internally within the solution such as to a backend / middleware / database) to any front-end user interface
- Do **NOT** use the same authentication solution (e.g. IDP / AD) used internally for unsecured access (e.g., public access / DMZ)

### Implement Proper Password Strength Controls

A key concern when using passwords for authentication is password strength. A "strong" password policy makes it difficult or even improbable for one to guess the password through either manual or automated means. The following characteristics define a strong password:

- Password Length
    - **Minimum** length for passwords should be enforced by the application.
        - If MFA is enabled passwords **shorter than 8 characters** are considered to be weak ([NIST SP800-63B](https://pages.nist.gov/800-63-4/sp800-63b.html#passwordver)).
        - If MFA is not enabled passwords **shorter than 15 characters** are considered to be weak ([NIST SP800-63B](https://pages.nist.gov/800-63-4/sp800-63b.html#passwordver)).
    - **Maximum** password length should be **at least 64 characters** to allow passphrases ([NIST SP800-63B](https://pages.nist.gov/800-63-3/sp800-63b.html)). Note that certain implementations of hashing algorithms may cause [long password denial of service](https://www.acunetix.com/vulnerabilities/web/long-password-denial-of-service/).
- Do not silently truncate passwords. The [Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#maximum-password-lengths) provides further guidance on how to handle passwords that are longer than the maximum length.
- Allow usage of **all** characters including unicode and whitespace. There should be no password composition rules limiting the type of characters permitted. There should be no requirement for upper or lower case or numbers or special characters.
- Ensure credential rotation when a password leak occurs, at the time of compromise identification or when authenticator technology changes. Avoid requiring periodic password changes; instead, encourage users to pick strong passwords and enable [Multifactor Authentication Cheat Sheet (MFA)](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html). According to NIST guidelines, verifiers should not mandate arbitrary password changes (e.g., periodically).
- Include a password strength meter to help users create a more complex password
    - [zxcvbn-ts library](https://github.com/zxcvbn-ts/zxcvbn) can be used for this purpose.
    - Other language implementations of zxcvbn [listed here](https://github.com/dropbox/zxcvbn?tab=readme-ov-file); however check the age and maturity of each example before use.
- Block common and previously breached passwords
    - [Pwned Passwords](https://haveibeenpwned.com/Passwords) is a service where passwords can be checked against previously breached passwords. Details on the API [are here](https://haveibeenpwned.com/API/v3#PwnedPasswords).
    - Alternatively, you can download the [Pwned Passwords](https://haveibeenpwned.com/Passwords) database [using this mechanism](https://github.com/HaveIBeenPwned/PwnedPasswordsDownloader?tab=readme-ov-file#what-is-haveibeenpwned-downloader) to host it yourself.
    - Other top password lists are available but there is no guarantee as to how updated they are:
        - [Various password lists](https://github.com/danielmiessler/SecLists/tree/master/Passwords) hosted by SecLists from Daniel Miessler.
        - Static copy of the top 100,000 passwords from "Have I Been Pwned" hosted by NCSC in [text](https://www.ncsc.gov.uk/static-assets/documents/PwnedPasswordsTop100k.txt) and [JSON](https://www.ncsc.gov.uk/static-assets/documents/PwnedPasswordsTop100k.json) format.

#### For more detailed information check

- [ASVS v5.0 Password Security Requirements](https://github.com/OWASP/ASVS/blob/master/5.0/en/0x15-V6-Authentication.md#v62-password-security)
- [Passwords Evolved: Authentication Guidance for the Modern Era](https://www.troyhunt.com/passwords-evolved-authentication-guidance-for-the-modern-era/)

### Implement Secure Password Recovery Mechanism

It is common for an application to have a mechanism that provides a means for a user to gain access to their account in the event they forget their password. Please see [Forgot Password Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html) for details on this feature.

### Store Passwords in a Secure Fashion

It is critical for an application to store a password using the right cryptographic technique. Please see [Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html) for details on this feature.

### Compare Password Hashes Using Safe Functions

Where possible, the user-supplied password should be compared to the stored password hash using a secure password comparison function provided by the language or framework, such as the [password_verify()](https://www.php.net/manual/en/function.password-verify.php) function in PHP. Where this is not possible, ensure that the comparison function:

- Has a maximum input length, to protect against denial of service attacks with very long inputs.
- Explicitly sets the type of both variables, to protect against type confusion attacks such as Magic Hashes in PHP.
- Returns in constant time, to protect against timing attacks.

### Change Password Feature

When developing a change password feature, ensure to have:

- The user is authenticated with an active session.
- Current password verification. This is to ensure that it's the legitimate user who is changing the password. Consider this abuse case: a user logs in on a public computer and forgets to log out. Another person could then use that active session. If we don't verify the current password, this other person may be able to change the password.

### Transmit Passwords Only Over TLS or Other Strong Transport

See: [Transport Layer Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html)

The login page and all subsequent authenticated pages must be exclusively accessed over TLS or other strong transport. Failure to utilize TLS or other strong transport for the login page allows an attacker to modify the login form action, causing the user's credentials to be posted to an arbitrary location. Failure to utilize TLS or other strong transport for authenticated pages after login enables an attacker to view the unencrypted session ID and compromise the user's authenticated session.

### Require Re-authentication for Sensitive Features

In order to mitigate CSRF and session hijacking, it's important to require the current credentials for an account before updating sensitive account information such as the user's password or email address -- or before sensitive transactions, such as shipping a purchase to a new address. Without this countermeasure, an attacker may be able to execute sensitive transactions through a CSRF or XSS attack without needing to know the user's current credentials. Additionally, an attacker may get temporary physical access to a user's browser or steal their session ID to take over the user's session.

### Reauthentication After Risk Events

**Overview:**
Reauthentication is critical when an account has experienced high-risk activity such as account recovery, password resets, or suspicious behavior patterns. This section outlines when and how to trigger reauthentication to protect users and prevent unauthorized access. For further details, see the [Require Re-authentication for Sensitive Features](#require-re-authentication-for-sensitive-features) section.

#### When to Trigger Reauthentication

- **Suspicious Account Activity**
  When unusual login patterns, IP address changes, or device enrollments occur
- **Account Recovery**
  After users reset their passwords or change sensitive account details
- **Critical Actions**
  For high-risk actions like changing payment details or adding new trusted devices

#### Reauthentication Mechanisms

- **Adaptive Authentication**
  Use risk-based authentication models that adapt to the user's behavior and context
- **Multi-Factor Authentication (MFA)**
  Require an additional layer of verification for sensitive actions or events
- **Challenge-Based Verification**
  Prompt users to confirm their identity with a challenge question or secondary method

#### Implementation Recommendations

- **Minimize User Friction**
  Ensure that reauthentication does not disrupt the user experience unnecessarily
- **Context-Aware Decisions**
  Make reauthentication decisions based on context (e.g., geolocation, device type, prior patterns)
- **Secure Session Management**
  Invalidate sessions after reauthentication and rotate tokens—see the [OWASP Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)

### Consider Strong Transaction Authentication

Some applications should use a second factor to check whether a user may perform sensitive operations. For more information, see the [Transaction Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Transaction_Authorization_Cheat_Sheet.html).

#### TLS Client Authentication

TLS Client Authentication, also known as two-way TLS authentication, consists of both browser and server sending their respective TLS certificates during the TLS handshake process. Just as you can validate the authenticity of a server by using the certificate and asking a verifiably-valid Certificate Authority (CA) if the certificate is valid, the server can authenticate the user by receiving a certificate from the client and validating against a third-party CA or its own CA. To do this, the server must provide the user with a certificate generated specifically for him, assigning values to the subject so that these can be used to determine what user the certificate should validate. The user installs the certificate on a browser and now uses it for the website.

This approach is appropriate when:

- It is acceptable (or even preferred) that the user has access to the website only from a single computer/browser.
- The user is not easily scared by the process of installing TLS certificates on their browser, or there will be someone, probably from IT support, who will do this for the user.
- The website requires an extra step of security.
- It is also a good thing to use when the website is for an intranet of a company or organization.

It is generally not a good idea to use this method for widely and publicly available websites that will have an average user. For example, it wouldn't be a good idea to implement this for a website like Facebook. While this technique can prevent the user from having to type a password (thus protecting against an average keylogger from stealing it), it is still considered a good idea to consider using both a password and TLS client authentication combined.

Additionally, if the client is behind an enterprise proxy that performs SSL/TLS decryption, this will break certificate authentication unless the site is allowed on the proxy.

For more information, see: [Client-authenticated TLS handshake](https://en.wikipedia.org/wiki/Transport_Layer_Security#Client-authenticated_TLS_handshake)

### Authentication and Error Messages

Incorrectly implemented error messages in the case of authentication functionality can be used for the purposes of user ID and password enumeration. An application should respond (both HTTP and HTML) in a generic manner.

#### Authentication Responses

Using any of the authentication mechanisms (login, password reset, or password recovery), an application must respond with a generic error message regardless of whether:

- The user ID or password was incorrect.
- The account does not exist.
- The account is locked or disabled.

The account registration feature should also be taken into consideration, and the same approach of a generic error message can be applied regarding the case in which the user exists.

The objective is to prevent the creation of a [discrepancy factor](https://cwe.mitre.org/data/definitions/204.html), allowing an attacker to mount a user enumeration action against the application.

It is interesting to note that the business logic itself can bring a discrepancy factor related to the processing time taken. Indeed, depending on the implementation, the processing time can be significantly different according to the case (success vs failure) allowing an attacker to mount a [time-based attack](https://en.wikipedia.org/wiki/Timing_attack) (delta of some seconds for example).

Example using pseudo-code for a login feature:

- First implementation using the "quick exit" approach

```text
IF USER_EXISTS(username) THEN
    password_hash=HASH(password)
    IS_VALID=LOOKUP_CREDENTIALS_IN_STORE(username, password_hash)
    IF NOT IS_VALID THEN
        RETURN Error("Invalid Username or Password!")
    ENDIF
ELSE
   RETURN Error("Invalid Username or Password!")
ENDIF
```

It can be clearly seen that if the user doesn't exist, the application will directly throw an error. Otherwise, when the user exists and the password doesn't, it is apparent that there will be more processing before the application errors out. In return, the response time will be different for the same error, allowing the attacker to differentiate between a wrong username and a wrong password.

- Second implementation without relying on the "quick exit" approach:

```text
password_hash=HASH(password)
IS_VALID=LOOKUP_CREDENTIALS_IN_STORE(username, password_hash)
IF NOT IS_VALID THEN
   RETURN Error("Invalid Username or Password!")
ENDIF
```

This code will go through the same process no matter what the user or the password is, allowing the application to return in approximately the same response time.

The problem with returning a generic error message for the user is a User Experience (UX) matter. A legitimate user might feel confused with the generic messages, thus making it hard for them to use the application, and might after several retries, leave the application because of its complexity. The decision to return a *generic error message* can be determined based on the criticality of the application and its data. For example, for critical applications, the team can decide that under the failure scenario, a user will always be redirected to the support page and a *generic error message* will be returned.

Regarding the user enumeration itself, protection against [brute-force attacks](#protect-against-automated-attacks) is also effective because it prevents an attacker from applying the enumeration at scale. Usage of [CAPTCHA](https://en.wikipedia.org/wiki/CAPTCHA) can be applied to a feature for which a *generic error message* cannot be returned because the *user experience* must be preserved.

##### Incorrect and correct response examples

###### Login

Incorrect response examples:

- "Login for User foo: invalid password."
- "Login failed, invalid user ID."
- "Login failed; account disabled."
- "Login failed; this user is not active."

Correct response example:

- "Login failed; Invalid user ID or password."

###### Password recovery

Incorrect response examples:

- "We just sent you a password reset link."
- "This email address doesn't exist in our database."

Correct response example:

- "If that email address is in our database, we will send you an email to reset your password."

###### Account creation

Incorrect response examples:

- "This user ID is already in use."
- "Welcome! You have signed up successfully."

Correct response example:

- "A link to activate your account has been emailed to the address provided."

##### Error Codes and URLs

The application may return a different [HTTP Error code](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) depending on the authentication attempt response. It may respond with a 200 for a positive result and a 403 for a negative result. Even though a generic error page is shown to a user, the HTTP response code may differ which can leak information about whether the account is valid or not.

Error disclosure can also be used as a discrepancy factor, consult the [error handling cheat sheet](https://cheatsheetseries.owasp.org/cheatsheets/Error_Handling_Cheat_Sheet.html) regarding the global handling of different errors in an application.

### Protect Against Automated Attacks

There are a number of different types of automated attacks that attackers can use to try and compromise user accounts. The most common types are listed below:

| Attack Type | Description |
|-------------|-------------|
| Brute Force | Testing multiple passwords from a dictionary or other source against a single account. |
| Credential Stuffing | Testing username/password pairs obtained from the breach of another site. |
| Password Spraying | Testing a single weak password against a large number of different accounts.|

Different protection mechanisms can be implemented to protect against these attacks. In many cases, these defenses do not provide complete protection, but when a number of them are implemented in a defense-in-depth approach, a reasonable level of protection can be achieved.

The following sections will focus primarily on preventing brute-force attacks, although these controls can also be effective against other types of attacks. For further guidance on defending against credential stuffing and password spraying, see the [Credential Stuffing Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Credential_Stuffing_Prevention_Cheat_Sheet.html).

#### Multi-Factor Authentication

Multi-factor authentication (MFA) is by far the best defense against the majority of password-related attacks, including brute-force attacks, with analysis by Microsoft suggesting that it would have stopped [99.9% of account compromises](https://techcommunity.microsoft.com/t5/Azure-Active-Directory-Identity/Your-Pa-word-doesn-t-matter/ba-p/731984). As such, it should be implemented wherever possible; however, depending on the audience of the application, it may not be practical or feasible to enforce the use of MFA.

The [Multifactor Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html) contains further guidance on implementing MFA.

#### Login Throttling

Login Throttling is a protocol used to prevent an attacker from making too many attempts at guessing a password through normal interactive means, it includes the following controls:

- Maximum number of attempts.

##### Account Lockout

The most common protection against these attacks is to implement account lockout, which prevents any more login attempts for a period after a certain number of failed logins.

The counter of failed logins should be associated with the account itself, rather than the source IP address, in order to prevent an attacker from making login attempts from a large number of different IP addresses. There are a number of different factors that should be considered when implementing an account lockout policy in order to find a balance between security and usability:

- The number of failed attempts before the account is locked out (lockout threshold).
- The time period that these attempts must occur within (observation window).
- How long the account is locked out for (lockout duration).

Rather than implementing a fixed lockout duration (e.g., ten minutes), some applications use an exponential lockout, where the lockout duration starts as a very short period (e.g., one second), but doubles after each failed login attempt.

- Amount of time to delay after each account lockout (max 2-3, after that permanent account lockout).

When designing an account lockout system, care must be taken to prevent it from being used to cause a denial of service by locking out other users' accounts. One way this could be performed is to allow the use of the forgotten password functionality to log in, even if the account is locked out.

#### CAPTCHA

The use of an effective CAPTCHA can help to prevent automated login attempts against accounts. However, many CAPTCHA implementations have weaknesses that allow them to be solved using automated techniques or can be outsourced to services that can solve them. As such, the use of CAPTCHA should be viewed as a defense-in-depth control to make brute-force attacks more time-consuming and expensive, rather than as a preventative.

It may be more user-friendly to only require a CAPTCHA be solved after a small number of failed login attempts, rather than requiring it from the very first login.

#### Security Questions and Memorable Words

The addition of a security question or memorable word can also help protect against automated attacks, especially when the user is asked to enter a number of randomly chosen characters from the word. It should be noted that this does **not** constitute multi-factor authentication, as both factors are the same (something you know). Furthermore, security questions are often weak and have predictable answers, so they must be carefully chosen. The [Choosing and Using Security Questions cheat sheet](https://cheatsheetseries.owasp.org/cheatsheets/Choosing_and_Using_Security_Questions_Cheat_Sheet.html) contains further guidance on this.

## Logging and Monitoring

Enable logging and monitoring of authentication functions to detect attacks/failures on a real-time basis

- Ensure that all failures are logged and reviewed
- Ensure that all password failures are logged and reviewed
- Ensure that all account lockouts are logged and reviewed

## Use of authentication protocols that require no password

While authentication through a combination of username, password, and multi-factor authentication is considered generally secure, there are use cases where it isn't considered the best option or even safe. Examples of this are third-party applications that desire to connect to the web application, either from a mobile device, another website, desktop, or other situations. When this happens, it is NOT considered safe to allow the third-party application to store the user/password combo, since then it extends the attack surface into their hands, where it isn't in your control. For this and other use cases, there are several authentication protocols that can protect you from exposing your users' data to attackers.

### OAuth 2.0 and 2.1

OAuth is an **authorization** framework for delegated access to APIs. See also: [OAuth 2.0 Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/OAuth2_Cheat_Sheet.html).

> **Note:** OAuth 2.1 is an IETF Working Group draft that consolidates OAuth 2.0 and widely adopted best practices and is intended to replace RFC 6749/6750; guidance in this cheat sheet applies to both OAuth 2.0 and OAuth 2.1. References: [draft-ietf-oauth-v2-1-13](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-v2-1-13), [oauth.net/2.1](https://oauth.net/2.1/)

### OpenID Connect (OIDC)

**OpenID Connect 1.0 (OIDC)** is an identity layer **on top of OAuth**. It defines how a client (**relying party**) verifies the **end user's** identity using an **ID Token** (a signed JWT) and how to obtain user claims in an interoperable way. Use **OIDC for authentication/SSO**; use **OAuth for authorization** to APIs.

#### OIDC implementation guidance

- **Validate ID Tokens** on the relying party: issuer (`iss`), audience (`aud`), signature (per provider JWKs), expiration (`exp`).
- Prefer **well-maintained libraries/SDKs** and provider discovery/JWKS endpoints.
- Use the **UserInfo** endpoint when additional claims beyond the ID Token are required.

> **Avoid confusion:** **OpenID 2.0 ("OpenID")** was a separate, legacy authentication protocol that has been **superseded by OpenID Connect** and is considered obsolete. New systems should not implement OpenID 2.0. References: [OpenID Foundation — obsolete OpenID 2.0 libraries](https://openid.net/developers/libraries-for-obsolete-specifications/), [OpenID 2.0 → OIDC migration](https://openid.net/specs/openid-connect-migration-1_0.html)

### SAML

Security Assertion Markup Language (SAML) is often considered to compete with OpenId. The most recommended version is 2.0 since it is very feature-complete and provides strong security. Like OpenId, SAML uses identity providers, but unlike OpenId, it is XML-based and provides more flexibility. SAML is based on browser redirects which send XML data. Furthermore, SAML isn't only initiated by a service provider; it can also be initiated from the identity provider. This allows the user to navigate through different portals while still being authenticated without having to do anything, making the process transparent.

While OpenId has taken most of the consumer market, SAML is often the choice for enterprise applications because there are few OpenId identity providers which are considered enterprise-class (meaning that the way they validate the user identity doesn't have high standards required for enterprise identity). It is more common to see SAML being used inside of intranet websites, sometimes even using a server from the intranet as the identity provider.

In the past few years, applications like SAP ERP and SharePoint (SharePoint by using Active Directory Federation Services 2.0) have decided to use SAML 2.0 authentication as an often preferred method for single sign-on implementations whenever enterprise federation is required for web services and web applications.

**See also: [SAML Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/SAML_Security_Cheat_Sheet.html)**

### FIDO

The Fast Identity Online (FIDO) Alliance has created two protocols to facilitate online authentication: the Universal Authentication Framework (UAF) protocol and the Universal Second Factor (U2F) protocol. While UAF focuses on passwordless authentication, U2F allows the addition of a second factor to existing password-based authentication. Both protocols are based on a public key cryptography challenge-response model.

UAF takes advantage of existing security technologies present on devices for authentication including fingerprint sensors, cameras (face biometrics), microphones (voice biometrics), Trusted Execution Environments (TEEs), Secure Elements (SEs), and others. The protocol is designed to plug these device capabilities into a common authentication framework. UAF works with both native applications and web applications.

U2F augments password-based authentication using a hardware token (typically USB) that stores cryptographic authentication keys and uses them for signing. The user can use the same token as a second factor for multiple applications. U2F works with web applications. It provides **protection against phishing** by using the URL of the website to look up the stored authentication key.

**FIDO2**: FIDO2 and WebAuthn, encompassing previous standards (UAF/U2F), form the foundation of modern **Passkeys** technology. Passkeys enable users to securely log in using local user verification (such as biometrics or device PINs) and often supporting cloud synchronization across devices. This technology is widely supported by major platforms. (Windows Hello/Mac Touch ID)

## Password Managers

Password managers are programs, browser plugins, or web services that automate the management of a large quantity of different credentials. Most password managers have functionality to allow users to easily use them on websites, either:
(a) by pasting the passwords into the login form
-- or --
(b) by simulating the user typing them in.

Web applications should not make the job of password managers more difficult than necessary by observing the following recommendations:

- Use standard HTML forms for username and password input with appropriate `type` attributes.
- Avoid plugin-based login pages (such as Flash or Silverlight).
- Implement a reasonable maximum password length, at least 64 characters, as discussed in the [Implement Proper Password Strength Controls section](#implement-proper-password-strength-controls).
- Allow any printable characters to be used in passwords.
- Allow users to paste into the username, password, and MFA fields.
- Allow users to navigate between the username and password field with a single press of the `Tab` key.

## Changing A User's Registered Email Address

User email addresses often change. The following process is recommended to handle such situations in a system:

*Note: The process is less stringent with [Multifactor Authentication](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html), as proof-of-identity is stronger than relying solely on a password.*

### Recommended Process If the User HAS [Multifactor Authentication](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html) Enabled

1. Confirm the validity of the user's authentication cookie/token. If not valid, display a login screen.
2. Describe the process for changing the registered email address to the user.
3. Ask the user to submit a proposed new email address, ensuring it complies with system rules.
4. Request the use of [Multifactor Authentication](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html) for identity verification.
5. Store the proposed new email address as a pending change.
6. Create and store **two** time-limited nonces for (a) system administrators' notification, and (b) user confirmation.
7. Send two email messages with links that include those nonces:

    - A **notification-only email message** to the current address, alerting the user to the impending change and providing a link to report unexpected activity.

    - A **confirmation-required email message** to the proposed new address, instructing the user to confirm the change and providing a link for unexpected situations.

8. Handle responses from the links accordingly.

### Recommended Process If the User DOES NOT HAVE Multifactor Authentication Enabled

1. Confirm the validity of the user's authentication cookie/token. If not valid, display a login screen.
2. Describe the process for changing the registered email address to the user.
3. Ask the user to submit a proposed new email address, ensuring it complies with system rules.
4. Request the user's current password for identity verification.
5. Store the proposed new email address as a pending change.
6. Create and store three time-limited nonces for system administrators' notification, user confirmation, and an additional step for password reliance.
7. Send two email messages with links to those nonces:

    - A **confirmation-required email message** to the current address, instructing the user to confirm the change and providing a link for an unexpected situation.

    - A **separate confirmation-required email message** to the proposed new address, instructing the user to confirm the change and providing a link for unexpected situations.

8. Handle responses from the links accordingly.

### Notes on the Above Processes

- It's worth noting that Google adopts a different approach with accounts secured only by a password -- [where the current email address receives a notification-only email](https://support.google.com/accounts/answer/55393?hl=en). This method carries risks and requires user vigilance.

- Regular social engineering training is crucial. System administrators and help desk staff should be trained to follow the prescribed process and recognize and respond to social engineering attacks. Refer to [CISA's "Avoiding Social Engineering and Phishing Attacks"](https://www.cisa.gov/news-events/news/avoiding-social-engineering-and-phishing-attacks) for guidance.

## Adaptive or Risk Based Authentication

A feature of more advanced applications is the ability to require different authentication stages depending on various environmental and contextual attributes (including but not limited to, the sensitivity of the data for which access is being requested, time of day, user location, IP address, or device fingerprint).

For example, an application may require MFA for the first login from a particular device but not for subsequent logins from that device. Alternatively, a single sign-on solution may authenticate the user and allow them to remain logged in for a day but require a reauthentication if they try to access their profile page.

Another option is the opposite approach where an application allows low risk access with just something that identifies the device (e.g., a specific mobile device fingerprint, a persistent cookie and browser fingerprint, etc. from the previous IP address) and then gradually requires stronger authentication for more sensitive operations. An example might be to allow someone to trigger something to see their current bank balance, but not the account number or anything else. If they need to see transactions, then the application puts them through some base level authentication and if they want to do any money movement, then MFA is required.

Questions that should be considered when implementing a mechanism like this include:

- Are the policies being put in place in line with any corporate policies and especially any regulatory policy?
- Which user‑ or device‑attributes (IP, geolocation, device fingerprint, time‑of‑day, behavioral biometrics, etc.) will we monitor at session start?
- Which of those signals need to be refreshed during an active session, and at what cadence?
- How will we ensure each signal’s accuracy and handle missing or low‑confidence data?
- What scoring model (weights, thresholds, ML, rule‑based, hybrid) will convert raw signals into a risk tier?
- Where will the model run (edge, API gateway, central service), and what is our latency budget?
- What action maps to each risk tier (allow, CAPTCHA, step‑up MFA, block, revoke session)?
- What user‑facing messages and error codes will accompany each action?
- At which exact code or platform layers will we invoke the risk engine (login controller, middleware, API gateway, service mesh)?
- How do we propagate decisions consistently across web, mobile, and API clients?
- How do we mutate, extend, or revoke tokens/cookies when a mid‑session risk check escalates?
- How do we synchronize state across multiple concurrent devices or browser tabs?
- What monitoring and alerting will be in place for potentially suspicious activity, including how the user is notified.

</section>

<section id="authentication-translation-panel" className="tabPanel translationPanel contentPanel">

## はじめに

**認証** (**AuthN**) は、個人、エンティティ、または Web サイトが主張どおりのものであることを、その主張を裏付けるために使われる一つ以上の認証器 (パスワード、指紋、セキュリティトークンなど) の妥当性を判定して検証するプロセスです。

**デジタルアイデンティティ**は、オンライン取引に関与する主体の一意な表現です。デジタルアイデンティティは、デジタルサービスの文脈では常に一意ですが、必ずしも現実世界の特定の主体まで追跡可能である必要はありません。

**身元確認** (Identity Proofing) は、主体が実際に主張どおりの者であることを確立します。この概念は KYC の考え方に関連しており、デジタルアイデンティティを実在の人物に結び付けることを目的としています。

**セッション管理**は、サーバーがやり取りしているエンティティの状態を維持するプロセスです。これは、トランザクション中の後続リクエストに対してサーバーがどのように応答すべきかを記憶するために必要です。セッションは、リクエストの送受信時にクライアントとサーバー間でやり取りできるセッション識別子によってサーバー上で維持されます。セッションはユーザーごとに一意であり、計算上予測が非常に困難であるべきです。この分野のベストプラクティスについては、[Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html) に詳しいガイダンスがあります。

## 認証に関する一般ガイドライン

### User ID

User ID の主な機能は、システム内でユーザーを一意に識別することです。理想的には、User ID はランダムに生成するべきです。これにより、予測可能または連番の ID が作成されることを防げます。特に User ID が外部ソースから露出または推測される可能性のあるシステムでは、予測可能な ID はセキュリティリスクになり得ます。

### ユーザー名

ユーザー名は、ユーザーが選択し、システムまたはサービスへログインするときに自分を識別するために使う、覚えやすい識別子です。ユーザーが選んだユーザー名がシステム内の一意識別子としても機能する場合、User ID とユーザー名という用語が同じ意味で使われることがあります。

サインアップ時にメールアドレスを検証するなら、ユーザーがメールアドレスをユーザー名として使用することを許可するべきです。加えて、メールアドレス以外のユーザー名を選択できる選択肢も提供するべきです。メールアドレスの検証については、[input validation cheat sheet のメールアドレス検証の説明](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html#email-address-validation) を参照してください。

### 認証ソリューションと機密アカウント

- 機密アカウント (バックエンド、ミドルウェア、データベースなど、ソリューション内部で使われるアカウント) で、フロントエンドのユーザーインターフェースへログインすることを**許可してはいけません**。
- 内部で使われるものと同じ認証ソリューション (IDP / AD など) を、安全でないアクセス (公開アクセス / DMZ など) に使っては**いけません**。

### 適切なパスワード強度管理の実装

パスワードを認証に使う場合、重要な懸念事項の一つはパスワード強度です。「強い」パスワードポリシーは、手動または自動のどちらの手段でも、パスワードを推測することを困難、あるいは実質的に不可能にします。強いパスワードは次の特性で定義されます。

- パスワード長
    - パスワードの**最小**長は、アプリケーションで強制するべきです。
        - MFA が有効な場合、**8 文字未満**のパスワードは弱いとみなされます ([NIST SP800-63B](https://pages.nist.gov/800-63-4/sp800-63b.html#passwordver))。
        - MFA が有効でない場合、**15 文字未満**のパスワードは弱いとみなされます ([NIST SP800-63B](https://pages.nist.gov/800-63-4/sp800-63b.html#passwordver))。
    - パスフレーズを許容するため、パスワードの**最大**長は**少なくとも 64 文字**にするべきです ([NIST SP800-63B](https://pages.nist.gov/800-63-3/sp800-63b.html))。ハッシュアルゴリズムの実装によっては、[長いパスワードによるサービス拒否](https://www.acunetix.com/vulnerabilities/web/long-password-denial-of-service/) が発生する可能性がある点に注意してください。
- パスワードを黙って切り詰めてはいけません。最大長を超えるパスワードの扱いについては、[Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#maximum-password-lengths) に追加のガイダンスがあります。
- Unicode と空白を含む**すべて**の文字の使用を許可します。許可される文字種を制限するパスワード構成ルールを設けるべきではありません。大文字、小文字、数字、特殊文字を必須にする要件も設けるべきではありません。
- パスワード漏えいが発生した場合、侵害を特定した時点、または認証器技術が変わった時点で、認証情報をローテーションしてください。任意の定期的なパスワード変更を要求することは避け、代わりに、強いパスワードを選び、[Multifactor Authentication Cheat Sheet (MFA)](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html) を有効にするようユーザーに促してください。NIST ガイドラインによれば、検証者は任意のパスワード変更 (定期変更など) を義務付けるべきではありません。
- ユーザーがより複雑なパスワードを作成できるよう、パスワード強度メーターを含めます。
    - この目的には [zxcvbn-ts library](https://github.com/zxcvbn-ts/zxcvbn) を使用できます。
    - zxcvbn の他言語実装は[こちらに一覧](https://github.com/dropbox/zxcvbn?tab=readme-ov-file)されています。ただし、使用前に各実装の古さと成熟度を確認してください。
- 一般的なパスワードや、過去に侵害されたパスワードをブロックします。
    - [Pwned Passwords](https://haveibeenpwned.com/Passwords) は、過去に侵害されたパスワードと照合できるサービスです。API の詳細は[こちら](https://haveibeenpwned.com/API/v3#PwnedPasswords)にあります。
    - あるいは、[この仕組み](https://github.com/HaveIBeenPwned/PwnedPasswordsDownloader?tab=readme-ov-file#what-is-haveibeenpwned-downloader)を使って [Pwned Passwords](https://haveibeenpwned.com/Passwords) データベースをダウンロードし、自分でホストすることもできます。
    - その他の上位パスワードリストもありますが、どの程度更新されているかは保証されません。
        - Daniel Miessler の SecLists がホストする[各種パスワードリスト](https://github.com/danielmiessler/SecLists/tree/master/Passwords)。
        - NCSC が [text](https://www.ncsc.gov.uk/static-assets/documents/PwnedPasswordsTop100k.txt) および [JSON](https://www.ncsc.gov.uk/static-assets/documents/PwnedPasswordsTop100k.json) 形式でホストする、"Have I Been Pwned" の上位 100,000 パスワードの静的コピー。

#### より詳しい情報

- [ASVS v5.0 Password Security Requirements](https://github.com/OWASP/ASVS/blob/master/5.0/en/0x15-V6-Authentication.md#v62-password-security)
- [Passwords Evolved: Authentication Guidance for the Modern Era](https://www.troyhunt.com/passwords-evolved-authentication-guidance-for-the-modern-era/)

### 安全なパスワードリカバリメカニズムの実装

ユーザーがパスワードを忘れた場合にアカウントへ再びアクセスする手段を提供する仕組みは、アプリケーションでは一般的です。この機能の詳細については、[Forgot Password Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html) を参照してください。

### パスワードの安全な保存

アプリケーションが適切な暗号技術を使ってパスワードを保存することは非常に重要です。この機能の詳細については、[Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html) を参照してください。

### 安全な関数によるパスワードハッシュの比較

可能な場合、ユーザーが入力したパスワードは、PHP の [password_verify()](https://www.php.net/manual/en/function.password-verify.php) 関数など、言語またはフレームワークが提供する安全なパスワード比較関数を使って、保存済みのパスワードハッシュと比較するべきです。これが不可能な場合は、比較関数が次を満たすようにしてください。

- 非常に長い入力によるサービス拒否攻撃から保護するため、最大入力長を持つこと。
- PHP の Magic Hashes のような型混同攻撃から保護するため、両方の変数の型を明示的に設定すること。
- タイミング攻撃から保護するため、定数時間で返ること。

### パスワード変更機能

パスワード変更機能を開発する際は、次を満たすようにしてください。

- ユーザーがアクティブなセッションで認証済みであること。
- 現在のパスワードを検証すること。これは、パスワードを変更しているのが正当なユーザーであることを保証するためです。次の悪用ケースを考えてください。ユーザーが公共のコンピューターにログインし、ログアウトを忘れます。その後、別の人物がそのアクティブなセッションを使用できてしまいます。現在のパスワードを検証しない場合、その別の人物がパスワードを変更できる可能性があります。

### TLS またはその他の強力なトランスポートでのみパスワードを送信する

参照: [Transport Layer Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html)

ログインページと、その後のすべての認証済みページは、TLS またはその他の強力なトランスポートだけでアクセスされなければなりません。ログインページで TLS またはその他の強力なトランスポートを使用しないと、攻撃者がログインフォームの action を変更し、ユーザーの認証情報を任意の場所へ送信させることができます。ログイン後の認証済みページで TLS またはその他の強力なトランスポートを使用しないと、攻撃者が暗号化されていないセッション ID を閲覧し、ユーザーの認証済みセッションを侵害できるようになります。

### 機密機能では再認証を要求する

CSRF とセッションハイジャックを緩和するには、ユーザーのパスワードやメールアドレスなどの機密アカウント情報を更新する前、または購入品を新しい住所へ配送するような機密トランザクションの前に、そのアカウントの現在の認証情報を要求することが重要です。この対策がないと、攻撃者はユーザーの現在の認証情報を知らなくても、CSRF または XSS 攻撃を通じて機密トランザクションを実行できる可能性があります。さらに、攻撃者がユーザーのブラウザへ一時的に物理アクセスしたり、セッション ID を盗んだりして、ユーザーのセッションを乗っ取る可能性があります。

### リスクイベント後の再認証

**概要:**
アカウントリカバリ、パスワードリセット、不審な行動パターンなどの高リスク活動がアカウントで発生した場合、再認証は重要です。このセクションでは、ユーザーを保護し、不正アクセスを防ぐために、いつ、どのように再認証を発火させるかを説明します。詳細については、[機密機能では再認証を要求する](#機密機能では再認証を要求する) セクションを参照してください。

#### 再認証を発火させるタイミング

- **不審なアカウント活動**
  通常とは異なるログインパターン、IP アドレスの変化、デバイス登録が発生した場合。
- **アカウントリカバリ**
  ユーザーがパスワードをリセットした後、または機密アカウント詳細を変更した後。
- **重要な操作**
  支払い詳細の変更や新しい信頼済みデバイスの追加など、高リスクな操作の場合。

#### 再認証メカニズム

- **適応型認証**
  ユーザーの行動と文脈に適応するリスクベース認証モデルを使用します。
- **多要素認証 (MFA)**
  機密操作または機密イベントに追加の検証層を要求します。
- **チャレンジベース検証**
  チャレンジ質問または二次的な方法で、ユーザーに本人確認を促します。

#### 実装上の推奨事項

- **ユーザー摩擦の最小化**
  再認証がユーザー体験を不必要に妨げないようにします。
- **文脈を考慮した判断**
  位置情報、デバイス種別、過去のパターンなどの文脈に基づいて再認証を判断します。
- **安全なセッション管理**
  再認証後にセッションを無効化し、トークンをローテーションします。詳細は [OWASP Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html) を参照してください。

### 強いトランザクション認証の検討

一部のアプリケーションでは、ユーザーが機密操作を実行してよいかを確認するために第二要素を使用するべきです。詳細については、[Transaction Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Transaction_Authorization_Cheat_Sheet.html) を参照してください。

#### TLS クライアント認証

TLS クライアント認証は双方向 TLS 認証とも呼ばれ、TLS ハンドシェイク処理中にブラウザとサーバーの双方がそれぞれの TLS 証明書を送信します。証明書を使い、検証可能で有効な認証局 (CA) に証明書の有効性を問い合わせることでサーバーの真正性を検証できるのと同様に、サーバーはクライアントから証明書を受け取り、第三者 CA または自組織の CA に対して検証することでユーザーを認証できます。これを行うには、サーバーはそのユーザー専用に生成した証明書をユーザーに提供し、その証明書がどのユーザーを検証すべきか判断できるように subject に値を割り当てなければなりません。ユーザーは証明書をブラウザにインストールし、その Web サイトで使用します。

この方式は次の場合に適しています。

- ユーザーが単一のコンピューターまたはブラウザからのみ Web サイトへアクセスすることが許容される、または望ましい場合。
- ユーザーがブラウザへ TLS 証明書をインストールするプロセスに過度な不安を感じない場合、または IT サポートなどがユーザーのために実施する場合。
- Web サイトが追加のセキュリティ手順を必要とする場合。
- 企業や組織のイントラネット向け Web サイトである場合にも有効です。

広く一般に公開される Web サイトで、平均的なユーザーを対象とする場合、この方式を使うことは一般に良い考えではありません。たとえば、Facebook のような Web サイトにこれを実装するのは良い考えではありません。この技術は、ユーザーがパスワードを入力する必要をなくせるため、一般的なキーロガーによる窃取から保護できますが、それでもパスワードと TLS クライアント認証の併用を検討することは良い考えとされています。

さらに、クライアントが SSL/TLS 復号を行う企業プロキシの背後にいる場合、そのサイトがプロキシで許可されていない限り、証明書認証は機能しなくなります。

詳細は、[Client-authenticated TLS handshake](https://en.wikipedia.org/wiki/Transport_Layer_Security#Client-authenticated_TLS_handshake) を参照してください。

### 認証とエラーメッセージ

認証機能におけるエラーメッセージの実装が不適切だと、User ID とパスワードの列挙に使われる可能性があります。アプリケーションは、HTTP と HTML の両方で一般化された方法で応答するべきです。

#### 認証応答

認証メカニズム (ログイン、パスワードリセット、パスワードリカバリ) のいずれを使用する場合でも、アプリケーションは次のどれに該当するかに関係なく、一般化されたエラーメッセージで応答しなければなりません。

- User ID またはパスワードが誤っている。
- アカウントが存在しない。
- アカウントがロックまたは無効化されている。

アカウント登録機能も考慮するべきです。ユーザーが存在する場合にも、同じ一般化されたエラーメッセージのアプローチを適用できます。

目的は、攻撃者がアプリケーションに対してユーザー列挙を実行できるようにする[不一致要因](https://cwe.mitre.org/data/definitions/204.html)の生成を防ぐことです。

ビジネスロジック自体が、処理時間に関連する不一致要因を生み出す可能性がある点は注目に値します。実際、実装によっては、ケース (成功と失敗) に応じて処理時間が大きく異なり、攻撃者が[時間ベース攻撃](https://en.wikipedia.org/wiki/Timing_attack) (たとえば数秒の差分) を実行できるようになります。

ログイン機能の擬似コード例:

- "quick exit" アプローチを使う最初の実装

```text
IF USER_EXISTS(username) THEN
    password_hash=HASH(password)
    IS_VALID=LOOKUP_CREDENTIALS_IN_STORE(username, password_hash)
    IF NOT IS_VALID THEN
        RETURN Error("Invalid Username or Password!")
    ENDIF
ELSE
   RETURN Error("Invalid Username or Password!")
ENDIF
```

ユーザーが存在しない場合、アプリケーションが直接エラーを返すことが明確に分かります。一方、ユーザーは存在するがパスワードが一致しない場合、アプリケーションがエラーを返すまでにより多くの処理が行われることは明らかです。その結果、同じエラーであっても応答時間が異なり、攻撃者が誤ったユーザー名と誤ったパスワードを区別できるようになります。

- "quick exit" アプローチに依存しない二つ目の実装:

```text
password_hash=HASH(password)
IS_VALID=LOOKUP_CREDENTIALS_IN_STORE(username, password_hash)
IF NOT IS_VALID THEN
   RETURN Error("Invalid Username or Password!")
ENDIF
```

このコードは、ユーザーやパスワードが何であっても同じプロセスを通るため、アプリケーションはほぼ同じ応答時間で返せます。

ユーザーに一般化されたエラーメッセージを返すことの問題は、ユーザー体験 (UX) に関するものです。正当なユーザーは一般化されたメッセージに混乱し、アプリケーションの利用が難しくなり、何度か再試行した後に複雑さを理由としてアプリケーションから離脱する可能性があります。*一般化されたエラーメッセージ*を返すかどうかは、アプリケーションとそのデータの重要度に基づいて判断できます。たとえば重要なアプリケーションでは、チームは失敗シナリオにおいてユーザーを常にサポートページへリダイレクトし、*一般化されたエラーメッセージ*を返すと決めることができます。

ユーザー列挙そのものについては、[ブルートフォース攻撃](#自動攻撃からの保護)への対策も有効です。これは、攻撃者が列挙を大規模に適用することを防ぐためです。*ユーザー体験*を維持する必要があるために*一般化されたエラーメッセージ*を返せない機能には、[CAPTCHA](https://en.wikipedia.org/wiki/CAPTCHA) の使用を適用できます。

##### 誤った応答例と正しい応答例

###### ログイン

誤った応答例:

- "Login for User foo: invalid password."
- "Login failed, invalid user ID."
- "Login failed; account disabled."
- "Login failed; this user is not active."

正しい応答例:

- "Login failed; Invalid user ID or password."

###### パスワードリカバリ

誤った応答例:

- "We just sent you a password reset link."
- "This email address doesn't exist in our database."

正しい応答例:

- "If that email address is in our database, we will send you an email to reset your password."

###### アカウント作成

誤った応答例:

- "This user ID is already in use."
- "Welcome! You have signed up successfully."

正しい応答例:

- "A link to activate your account has been emailed to the address provided."

##### エラーコードと URL

アプリケーションは、認証試行の応答に応じて異なる [HTTP Error code](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) を返す場合があります。肯定的な結果では 200、否定的な結果では 403 を返すかもしれません。一般化されたエラーページがユーザーに表示されていても、HTTP レスポンスコードが異なれば、アカウントが有効かどうかに関する情報が漏えいする可能性があります。

エラー開示も不一致要因として使われる可能性があります。アプリケーションで異なるエラーを全体として扱う方法については、[error handling cheat sheet](https://cheatsheetseries.owasp.org/cheatsheets/Error_Handling_Cheat_Sheet.html) を参照してください。

### 自動攻撃からの保護

攻撃者がユーザーアカウントを侵害しようとするときに使用できる自動攻撃には、さまざまな種類があります。最も一般的な種類を以下に示します。

| 攻撃タイプ | 説明 |
|-------------|-------------|
| ブルートフォース | 辞書またはその他のソースにある複数のパスワードを、単一アカウントに対して試す。 |
| クレデンシャルスタッフィング | 別サイトの侵害から取得したユーザー名とパスワードのペアを試す。 |
| パスワードスプレー | 単一の弱いパスワードを、多数の異なるアカウントに対して試す。|

これらの攻撃から保護するために、さまざまな保護メカニズムを実装できます。多くの場合、これらの防御は完全な保護を提供しませんが、多層防御のアプローチで複数を実装すれば、妥当なレベルの保護を達成できます。

以下のセクションでは主にブルートフォース攻撃の防止に焦点を当てますが、これらの管理策は他の種類の攻撃に対しても有効な場合があります。クレデンシャルスタッフィングとパスワードスプレーの防御に関する追加ガイダンスについては、[Credential Stuffing Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Credential_Stuffing_Prevention_Cheat_Sheet.html) を参照してください。

#### 多要素認証

多要素認証 (MFA) は、ブルートフォース攻撃を含む大多数のパスワード関連攻撃に対する、圧倒的に最良の防御です。Microsoft の分析では、MFA は[アカウント侵害の 99.9%](https://techcommunity.microsoft.com/t5/Azure-Active-Directory-Identity/Your-Pa-word-doesn-t-matter/ba-p/731984)を防止できた可能性があると示されています。したがって、可能な限り実装するべきです。ただし、アプリケーションの対象者によっては、MFA の使用を強制することが実用的または実現可能ではない場合があります。

[Multifactor Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html) には、MFA の実装に関する追加ガイダンスがあります。

#### ログインスロットリング

ログインスロットリングは、攻撃者が通常の対話的な手段でパスワード推測を過剰に試行することを防ぐために使われるプロトコルで、次の管理策を含みます。

- 最大試行回数。

##### アカウントロックアウト

これらの攻撃に対する最も一般的な保護は、一定回数のログイン失敗後、一定期間それ以上のログイン試行を防ぐアカウントロックアウトを実装することです。

攻撃者が多数の異なる IP アドレスからログイン試行を行うことを防ぐため、ログイン失敗のカウンターは送信元 IP アドレスではなく、アカウント自体に関連付けるべきです。セキュリティと使いやすさのバランスを見つけるため、アカウントロックアウトポリシーを実装するときには次のような複数の要因を考慮するべきです。

- アカウントがロックアウトされるまでの失敗回数 (ロックアウトしきい値)。
- これらの試行が発生しなければならない期間 (観測ウィンドウ)。
- アカウントをロックアウトする時間 (ロックアウト期間)。

固定のロックアウト期間 (例: 10 分) を実装する代わりに、一部のアプリケーションでは指数ロックアウトを使用します。これは、ロックアウト期間を非常に短い時間 (例: 1 秒) から開始し、ログイン失敗のたびに倍増させる方式です。

- 各アカウントロックアウト後に遅延させる時間 (最大 2-3 回、その後は永続的なアカウントロックアウト)。

アカウントロックアウトシステムを設計する際は、他のユーザーのアカウントをロックアウトすることによるサービス拒否に悪用されないよう注意が必要です。これを実現する方法の一つは、アカウントがロックアウトされている場合でも、パスワード忘れ機能を使ってログインできるようにすることです。

#### CAPTCHA

有効な CAPTCHA の使用は、アカウントに対する自動ログイン試行を防ぐ助けになります。しかし、多くの CAPTCHA 実装には、自動化技術で解ける、または解決サービスへ外注できる弱点があります。そのため、CAPTCHA の使用は、ブルートフォース攻撃の時間とコストを増やす多層防御の管理策として捉えるべきであり、予防策そのものとして捉えるべきではありません。

最初のログインから CAPTCHA の解決を必須にするよりも、少数のログイン失敗後にのみ CAPTCHA を要求する方が、ユーザーにとって使いやすい場合があります。

#### セキュリティ質問と記憶語

セキュリティ質問または記憶語の追加も、自動攻撃から保護する助けになります。特に、ユーザーが記憶語からランダムに選ばれたいくつかの文字を入力するよう求められる場合に有効です。ただし、これは多要素認証を構成するものでは**ない**点に注意してください。どちらの要素も同じもの (知っているもの) だからです。さらに、セキュリティ質問は弱く、回答が予測可能であることが多いため、慎重に選ばなければなりません。[Choosing and Using Security Questions cheat sheet](https://cheatsheetseries.owasp.org/cheatsheets/Choosing_and_Using_Security_Questions_Cheat_Sheet.html) には、この点に関する追加ガイダンスがあります。

## ログと監視

攻撃や失敗をリアルタイムで検知するため、認証機能のログと監視を有効にします。

- すべての失敗がログに記録され、レビューされるようにします。
- すべてのパスワード失敗がログに記録され、レビューされるようにします。
- すべてのアカウントロックアウトがログに記録され、レビューされるようにします。

## パスワードを必要としない認証プロトコルの使用

ユーザー名、パスワード、多要素認証の組み合わせによる認証は一般に安全と考えられますが、それが最善の選択肢ではない、または安全でさえないユースケースがあります。例として、モバイルデバイス、別の Web サイト、デスクトップ、その他の状況から Web アプリケーションへ接続したいサードパーティアプリケーションがあります。この場合、サードパーティアプリケーションにユーザー名とパスワードの組み合わせを保存させることは安全とは**みなされません**。攻撃面がその第三者の手元まで拡大し、自分の管理外になるためです。このようなユースケースやその他のユースケースでは、攻撃者にユーザーのデータを露出させないよう保護できる認証プロトコルがいくつかあります。

### OAuth 2.0 と 2.1

OAuth は、API への委任アクセスのための**認可**フレームワークです。あわせて [OAuth 2.0 Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/OAuth2_Cheat_Sheet.html) も参照してください。

> **注:** OAuth 2.1 は、OAuth 2.0 と広く採用されたベストプラクティスを統合する IETF ワーキンググループのドラフトであり、RFC 6749/6750 を置き換えることを意図しています。このチートシートのガイダンスは OAuth 2.0 と OAuth 2.1 の両方に適用されます。参考: [draft-ietf-oauth-v2-1-13](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-v2-1-13), [oauth.net/2.1](https://oauth.net/2.1/)

### OpenID Connect (OIDC)

**OpenID Connect 1.0 (OIDC)** は、**OAuth の上にある**アイデンティティ層です。クライアント (**relying party**) が、**エンドユーザー**のアイデンティティを **ID Token** (署名付き JWT) で検証する方法と、相互運用可能な方法でユーザー Claim を取得する方法を定義します。認証/SSO には **OIDC** を使い、API への認可には **OAuth** を使います。

#### OIDC 実装ガイダンス

- relying party で **ID Token を検証**します。issuer (`iss`)、audience (`aud`)、署名 (プロバイダの JWK に基づく)、有効期限 (`exp`) を検証します。
- **よく保守されたライブラリ/SDK** と、プロバイダ discovery/JWKS エンドポイントを優先して使用します。
- ID Token を超える追加 Claim が必要な場合は、**UserInfo** エンドポイントを使用します。

> **混同を避ける:** **OpenID 2.0 ("OpenID")** は別個のレガシー認証プロトコルであり、**OpenID Connect に置き換えられて**おり、廃止されたものとみなされています。新しいシステムでは OpenID 2.0 を実装するべきではありません。参考: [OpenID Foundation — obsolete OpenID 2.0 libraries](https://openid.net/developers/libraries-for-obsolete-specifications/), [OpenID 2.0 → OIDC migration](https://openid.net/specs/openid-connect-migration-1_0.html)

### SAML

Security Assertion Markup Language (SAML) は、OpenId と競合するものとみなされることがよくあります。最も推奨されるバージョンは 2.0 です。非常に機能が充実しており、強いセキュリティを提供するためです。OpenId と同様に、SAML はアイデンティティプロバイダを使用しますが、OpenId と異なり XML ベースで、より高い柔軟性を提供します。SAML は XML データを送信するブラウザリダイレクトに基づいています。さらに、SAML はサービスプロバイダから開始されるだけではなく、アイデンティティプロバイダから開始することもできます。これにより、ユーザーは何もしなくても認証されたまま複数のポータルを移動でき、プロセスが透過的になります。

OpenId はコンシューマー市場の大部分を占めてきましたが、SAML は企業アプリケーションで選ばれることが多いです。企業クラスとみなされる OpenId アイデンティティプロバイダは少ないためです (つまり、ユーザーアイデンティティの検証方法が、企業アイデンティティに必要な高い基準を満たしていないという意味です)。SAML はイントラネット Web サイト内で使われることがより一般的であり、イントラネット上のサーバーをアイデンティティプロバイダとして使う場合さえあります。

ここ数年、SAP ERP や SharePoint (Active Directory Federation Services 2.0 を使う SharePoint) などのアプリケーションは、Web サービスと Web アプリケーションで企業フェデレーションが必要な場合に、シングルサインオン実装の好ましい方法として SAML 2.0 認証を使用することを決定しています。

**関連: [SAML Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/SAML_Security_Cheat_Sheet.html)**

### FIDO

Fast Identity Online (FIDO) Alliance は、オンライン認証を容易にする二つのプロトコルを作成しました。Universal Authentication Framework (UAF) プロトコルと Universal Second Factor (U2F) プロトコルです。UAF はパスワードレス認証に焦点を当て、U2F は既存のパスワードベース認証に第二要素を追加できるようにします。どちらのプロトコルも、公開鍵暗号のチャレンジレスポンスモデルに基づいています。

UAF は、指紋センサー、カメラ (顔バイオメトリクス)、マイク (音声バイオメトリクス)、Trusted Execution Environments (TEEs)、Secure Elements (SEs) など、デバイスに存在する既存のセキュリティ技術を認証に活用します。このプロトコルは、これらのデバイス機能を共通の認証フレームワークへ組み込むよう設計されています。UAF はネイティブアプリケーションと Web アプリケーションの両方で機能します。

U2F は、暗号学的な認証鍵を保存し、それを署名に使うハードウェアトークン (通常は USB) を使用して、パスワードベース認証を補強します。ユーザーは同じトークンを複数のアプリケーションの第二要素として使用できます。U2F は Web アプリケーションで機能します。保存された認証鍵を検索するために Web サイトの URL を使うことで、**フィッシングに対する保護**を提供します。

**FIDO2**: FIDO2 と WebAuthn は、以前の標準 (UAF/U2F) を包含し、現代の **Passkeys** 技術の基盤を形成します。Passkeys により、ユーザーはローカルのユーザー検証 (バイオメトリクスやデバイス PIN など) を使って安全にログインでき、多くの場合、デバイス間のクラウド同期にも対応します。この技術は主要プラットフォームで広くサポートされています。(Windows Hello/Mac Touch ID)

## パスワードマネージャー

パスワードマネージャーは、大量の異なる認証情報の管理を自動化するプログラム、ブラウザプラグイン、または Web サービスです。ほとんどのパスワードマネージャーには、ユーザーが Web サイトで容易に利用できるようにする機能があります。方法は次のいずれかです。
(a) パスワードをログインフォームへ貼り付ける
-- または --
(b) ユーザーが入力しているようにシミュレートする。

Web アプリケーションは、次の推奨事項を守り、パスワードマネージャーの仕事を必要以上に難しくしないようにするべきです。

- ユーザー名とパスワード入力には、適切な `type` 属性を持つ標準 HTML フォームを使用します。
- プラグインベースのログインページ (Flash や Silverlight など) を避けます。
- [適切なパスワード強度管理の実装セクション](#適切なパスワード強度管理の実装)で説明したように、少なくとも 64 文字の妥当な最大パスワード長を実装します。
- パスワードに任意の印字可能文字を使えるようにします。
- ユーザー名、パスワード、MFA フィールドへの貼り付けを許可します。
- `Tab` キーを 1 回押すだけで、ユーザー名フィールドとパスワードフィールドの間を移動できるようにします。

## ユーザーの登録メールアドレス変更

ユーザーのメールアドレスはしばしば変更されます。このような状況をシステムで扱うため、次のプロセスが推奨されます。

*注: [Multifactor Authentication](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html) がある場合、本人性の証明はパスワードのみに依存するよりも強いため、プロセスはやや厳格でなくなります。*

### ユーザーが [Multifactor Authentication](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html) を有効にしている場合の推奨プロセス

1. ユーザーの認証 Cookie/トークンの妥当性を確認します。有効でない場合は、ログイン画面を表示します。
2. 登録メールアドレス変更のプロセスをユーザーに説明します。
3. 提案する新しいメールアドレスをユーザーに送信させ、システムルールに準拠していることを確認します。
4. 本人確認のため、[Multifactor Authentication](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html) の使用を要求します。
5. 提案された新しいメールアドレスを pending change として保存します。
6. (a) システム管理者への通知、および (b) ユーザー確認のために、時間制限付き nonce を**二つ**作成して保存します。
7. それらの nonce を含むリンク付きのメールメッセージを二つ送信します。

    - 変更が差し迫っていることをユーザーに警告し、予期しない活動を報告するためのリンクを提供する、現在のアドレスへの**通知のみのメールメッセージ**。

    - 変更を確認するようユーザーに指示し、予期しない状況のためのリンクを提供する、提案された新しいアドレスへの**確認が必要なメールメッセージ**。

8. リンクからの応答を適切に処理します。

### ユーザーが Multifactor Authentication を有効にしていない場合の推奨プロセス

1. ユーザーの認証 Cookie/トークンの妥当性を確認します。有効でない場合は、ログイン画面を表示します。
2. 登録メールアドレス変更のプロセスをユーザーに説明します。
3. 提案する新しいメールアドレスをユーザーに送信させ、システムルールに準拠していることを確認します。
4. 本人確認のため、ユーザーの現在のパスワードを要求します。
5. 提案された新しいメールアドレスを pending change として保存します。
6. システム管理者への通知、ユーザー確認、およびパスワード依存に対する追加ステップのために、時間制限付き nonce を三つ作成して保存します。
7. それらの nonce へのリンクを含むメールメッセージを二つ送信します。

    - 変更を確認するようユーザーに指示し、予期しない状況のためのリンクを提供する、現在のアドレスへの**確認が必要なメールメッセージ**。

    - 変更を確認するようユーザーに指示し、予期しない状況のためのリンクを提供する、提案された新しいアドレスへの**別個の確認が必要なメールメッセージ**。

8. リンクからの応答を適切に処理します。

### 上記プロセスに関する注記

- Google は、パスワードのみで保護されたアカウントについて、異なるアプローチ、すなわち[現在のメールアドレスが通知のみのメールを受け取る](https://support.google.com/accounts/answer/55393?hl=en)方法を採用している点は注目に値します。この方法にはリスクがあり、ユーザーの警戒が必要です。

- 定期的なソーシャルエンジニアリング訓練は重要です。システム管理者とヘルプデスクスタッフは、定められたプロセスに従い、ソーシャルエンジニアリング攻撃を認識して対応するための訓練を受けるべきです。ガイダンスについては、[CISA's "Avoiding Social Engineering and Phishing Attacks"](https://www.cisa.gov/news-events/news/avoiding-social-engineering-and-phishing-attacks) を参照してください。

## 適応型またはリスクベース認証

より高度なアプリケーションの機能の一つは、さまざまな環境属性および文脈属性 (アクセスが要求されているデータの機密性、時刻、ユーザーの位置、IP アドレス、デバイスフィンガープリントなどを含みますが、これらに限定されません) に応じて、異なる認証段階を要求できることです。

たとえば、アプリケーションは、特定のデバイスからの初回ログインでは MFA を要求し、そのデバイスからの以後のログインでは要求しないことがあります。あるいは、シングルサインオンソリューションがユーザーを認証し、1 日ログイン状態を維持できるようにする一方で、プロフィールページへアクセスしようとした場合には再認証を要求することがあります。

別の選択肢は、反対のアプローチです。アプリケーションは、デバイスを識別するもの (例: 特定のモバイルデバイスフィンガープリント、永続 Cookie とブラウザフィンガープリント、以前の IP アドレスなど) だけで低リスクアクセスを許可し、その後、より機密性の高い操作に対して段階的に強い認証を要求します。例として、現在の銀行残高は表示できるが、口座番号やその他の情報は表示できないようにすることがあります。取引を確認する必要がある場合、アプリケーションは何らかの基本レベルの認証を要求し、資金移動を行いたい場合には MFA を要求します。

このようなメカニズムを実装するときに検討するべき質問には、次のものがあります。

- 導入されるポリシーは、企業ポリシー、特に規制上のポリシーに沿っていますか。
- セッション開始時に、どのユーザー属性またはデバイス属性 (IP、位置情報、デバイスフィンガープリント、時刻、行動バイオメトリクスなど) を監視しますか。
- それらのシグナルのうち、アクティブセッション中に更新する必要があるものはどれで、どの頻度で更新しますか。
- 各シグナルの正確性をどのように保証し、欠損データや信頼度の低いデータをどのように扱いますか。
- 生のシグナルをリスク階層へ変換するスコアリングモデル (重み、しきい値、ML、ルールベース、ハイブリッド) は何ですか。
- モデルはどこで実行しますか (エッジ、API ゲートウェイ、中央サービス)。また、レイテンシ予算はどれくらいですか。
- 各リスク階層に対応するアクション (許可、CAPTCHA、step-up MFA、ブロック、セッション失効) は何ですか。
- 各アクションには、どのユーザー向けメッセージとエラーコードを伴わせますか。
- どの正確なコード層またはプラットフォーム層でリスクエンジンを呼び出しますか (ログインコントローラー、ミドルウェア、API ゲートウェイ、サービスメッシュ)。
- Web、モバイル、API クライアント全体で、判断をどのように一貫して伝播しますか。
- セッション中のリスクチェックでリスクが上昇した場合、トークン/Cookie をどのように変更、延長、または失効させますか。
- 複数の同時デバイスまたはブラウザタブ間で、状態をどのように同期しますか。
- 潜在的に不審な活動について、どのような監視とアラートを設けますか。ユーザーへの通知方法も含めて検討します。

</section>

<section id="authentication-bilingual-panel" className="tabPanel bilingualPanel">

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Introduction

**Authentication** (**AuthN**) is the process of verifying that an individual, entity, or website is who or what it claims to be by determining the validity of one or more authenticators (like passwords, fingerprints, or security tokens) that are used to back up this claim.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## はじめに

**認証** (**AuthN**) は、個人、エンティティ、または Web サイトが主張どおりのものであることを、その主張を裏付けるために使われる一つ以上の認証器 (パスワード、指紋、セキュリティトークンなど) の妥当性を判定して検証するプロセスです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Digital Identity** is the unique representation of a subject engaged in an online transaction. A digital identity is always unique in the context of a digital service but does not necessarily need to be traceable back to a specific real-life subject.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**デジタルアイデンティティ**は、オンライン取引に関与する主体の一意な表現です。デジタルアイデンティティは、デジタルサービスの文脈では常に一意ですが、必ずしも現実世界の特定の主体まで追跡可能である必要はありません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Identity Proofing** establishes that a subject is actually who they claim to be. This concept is related to KYC concepts and it aims to bind a digital identity with a real person.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**身元確認** (Identity Proofing) は、主体が実際に主張どおりの者であることを確立します。この概念は KYC の考え方に関連しており、デジタルアイデンティティを実在の人物に結び付けることを目的としています。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Session Management** is a process by which a server maintains the state of an entity interacting with it. This is required for a server to remember how to react to subsequent requests throughout a transaction. Sessions are maintained on the server by a session identifier which can be passed back and forth between the client and server when transmitting and receiving requests. Sessions should be unique per user and computationally very difficult to predict. The [Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html) contains further guidance on the best practices in this area.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**セッション管理**は、サーバーがやり取りしているエンティティの状態を維持するプロセスです。これは、トランザクション中の後続リクエストに対してサーバーがどのように応答すべきかを記憶するために必要です。セッションは、リクエストの送受信時にクライアントとサーバー間でやり取りできるセッション識別子によってサーバー上で維持されます。セッションはユーザーごとに一意であり、計算上予測が非常に困難であるべきです。この分野のベストプラクティスについては、[Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html) に詳しいガイダンスがあります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Authentication General Guidelines

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 認証に関する一般ガイドライン

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### User IDs

The primary function of a User ID is to uniquely identify a user within a system. Ideally, User IDs should be randomly generated to prevent the creation of predictable or sequential IDs, which could pose a security risk, especially in systems where User IDs might be exposed or inferred from external sources.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### User ID

User ID の主な機能は、システム内でユーザーを一意に識別することです。理想的には、User ID はランダムに生成するべきです。これにより、予測可能または連番の ID が作成されることを防げます。特に User ID が外部ソースから露出または推測される可能性のあるシステムでは、予測可能な ID はセキュリティリスクになり得ます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Usernames

Usernames are easy-to-remember identifiers chosen by the user and used for identifying themselves when logging into a system or service. The terms User ID and username might be used interchangeably if the username chosen by the user also serves as their unique identifier within the system.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### ユーザー名

ユーザー名は、ユーザーが選択し、システムまたはサービスへログインするときに自分を識別するために使う、覚えやすい識別子です。ユーザーが選んだユーザー名がシステム内の一意識別子としても機能する場合、User ID とユーザー名という用語が同じ意味で使われることがあります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Users should be permitted to use their email address as a username, provided the email is verified during sign-up. Additionally, they should have the option to choose a username other than an email address. For information on validating email addresses, please visit the [input validation cheat sheet email discussion](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html#email-address-validation).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

サインアップ時にメールアドレスを検証するなら、ユーザーがメールアドレスをユーザー名として使用することを許可するべきです。加えて、メールアドレス以外のユーザー名を選択できる選択肢も提供するべきです。メールアドレスの検証については、[input validation cheat sheet のメールアドレス検証の説明](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html#email-address-validation) を参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Authentication Solution and Sensitive Accounts

- Do **NOT** allow login with sensitive accounts (i.e. accounts that can be used internally within the solution such as to a backend / middleware / database) to any front-end user interface
- Do **NOT** use the same authentication solution (e.g. IDP / AD) used internally for unsecured access (e.g., public access / DMZ)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 認証ソリューションと機密アカウント

- 機密アカウント (バックエンド、ミドルウェア、データベースなど、ソリューション内部で使われるアカウント) で、フロントエンドのユーザーインターフェースへログインすることを**許可してはいけません**。
- 内部で使われるものと同じ認証ソリューション (IDP / AD など) を、安全でないアクセス (公開アクセス / DMZ など) に使っては**いけません**。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Implement Proper Password Strength Controls

A key concern when using passwords for authentication is password strength. A "strong" password policy makes it difficult or even improbable for one to guess the password through either manual or automated means. The following characteristics define a strong password:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 適切なパスワード強度管理の実装

パスワードを認証に使う場合、重要な懸念事項の一つはパスワード強度です。「強い」パスワードポリシーは、手動または自動のどちらの手段でも、パスワードを推測することを困難、あるいは実質的に不可能にします。強いパスワードは次の特性で定義されます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Password Length
    - **Minimum** length for passwords should be enforced by the application.
        - If MFA is enabled passwords **shorter than 8 characters** are considered to be weak ([NIST SP800-63B](https://pages.nist.gov/800-63-4/sp800-63b.html#passwordver)).
        - If MFA is not enabled passwords **shorter than 15 characters** are considered to be weak ([NIST SP800-63B](https://pages.nist.gov/800-63-4/sp800-63b.html#passwordver)).
    - **Maximum** password length should be **at least 64 characters** to allow passphrases ([NIST SP800-63B](https://pages.nist.gov/800-63-3/sp800-63b.html)). Note that certain implementations of hashing algorithms may cause [long password denial of service](https://www.acunetix.com/vulnerabilities/web/long-password-denial-of-service/).
- Do not silently truncate passwords. The [Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#maximum-password-lengths) provides further guidance on how to handle passwords that are longer than the maximum length.
- Allow usage of **all** characters including unicode and whitespace. There should be no password composition rules limiting the type of characters permitted. There should be no requirement for upper or lower case or numbers or special characters.
- Ensure credential rotation when a password leak occurs, at the time of compromise identification or when authenticator technology changes. Avoid requiring periodic password changes; instead, encourage users to pick strong passwords and enable [Multifactor Authentication Cheat Sheet (MFA)](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html). According to NIST guidelines, verifiers should not mandate arbitrary password changes (e.g., periodically).
- Include a password strength meter to help users create a more complex password
    - [zxcvbn-ts library](https://github.com/zxcvbn-ts/zxcvbn) can be used for this purpose.
    - Other language implementations of zxcvbn [listed here](https://github.com/dropbox/zxcvbn?tab=readme-ov-file); however check the age and maturity of each example before use.
- Block common and previously breached passwords
    - [Pwned Passwords](https://haveibeenpwned.com/Passwords) is a service where passwords can be checked against previously breached passwords. Details on the API [are here](https://haveibeenpwned.com/API/v3#PwnedPasswords).
    - Alternatively, you can download the [Pwned Passwords](https://haveibeenpwned.com/Passwords) database [using this mechanism](https://github.com/HaveIBeenPwned/PwnedPasswordsDownloader?tab=readme-ov-file#what-is-haveibeenpwned-downloader) to host it yourself.
    - Other top password lists are available but there is no guarantee as to how updated they are:
        - [Various password lists](https://github.com/danielmiessler/SecLists/tree/master/Passwords) hosted by SecLists from Daniel Miessler.
        - Static copy of the top 100,000 passwords from "Have I Been Pwned" hosted by NCSC in [text](https://www.ncsc.gov.uk/static-assets/documents/PwnedPasswordsTop100k.txt) and [JSON](https://www.ncsc.gov.uk/static-assets/documents/PwnedPasswordsTop100k.json) format.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- パスワード長
    - パスワードの**最小**長は、アプリケーションで強制するべきです。
        - MFA が有効な場合、**8 文字未満**のパスワードは弱いとみなされます ([NIST SP800-63B](https://pages.nist.gov/800-63-4/sp800-63b.html#passwordver))。
        - MFA が有効でない場合、**15 文字未満**のパスワードは弱いとみなされます ([NIST SP800-63B](https://pages.nist.gov/800-63-4/sp800-63b.html#passwordver))。
    - パスフレーズを許容するため、パスワードの**最大**長は**少なくとも 64 文字**にするべきです ([NIST SP800-63B](https://pages.nist.gov/800-63-3/sp800-63b.html))。ハッシュアルゴリズムの実装によっては、[長いパスワードによるサービス拒否](https://www.acunetix.com/vulnerabilities/web/long-password-denial-of-service/) が発生する可能性がある点に注意してください。
- パスワードを黙って切り詰めてはいけません。最大長を超えるパスワードの扱いについては、[Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#maximum-password-lengths) に追加のガイダンスがあります。
- Unicode と空白を含む**すべて**の文字の使用を許可します。許可される文字種を制限するパスワード構成ルールを設けるべきではありません。大文字、小文字、数字、特殊文字を必須にする要件も設けるべきではありません。
- パスワード漏えいが発生した場合、侵害を特定した時点、または認証器技術が変わった時点で、認証情報をローテーションしてください。任意の定期的なパスワード変更を要求することは避け、代わりに、強いパスワードを選び、[Multifactor Authentication Cheat Sheet (MFA)](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html) を有効にするようユーザーに促してください。NIST ガイドラインによれば、検証者は任意のパスワード変更 (定期変更など) を義務付けるべきではありません。
- ユーザーがより複雑なパスワードを作成できるよう、パスワード強度メーターを含めます。
    - この目的には [zxcvbn-ts library](https://github.com/zxcvbn-ts/zxcvbn) を使用できます。
    - zxcvbn の他言語実装は[こちらに一覧](https://github.com/dropbox/zxcvbn?tab=readme-ov-file)されています。ただし、使用前に各実装の古さと成熟度を確認してください。
- 一般的なパスワードや、過去に侵害されたパスワードをブロックします。
    - [Pwned Passwords](https://haveibeenpwned.com/Passwords) は、過去に侵害されたパスワードと照合できるサービスです。API の詳細は[こちら](https://haveibeenpwned.com/API/v3#PwnedPasswords)にあります。
    - あるいは、[この仕組み](https://github.com/HaveIBeenPwned/PwnedPasswordsDownloader?tab=readme-ov-file#what-is-haveibeenpwned-downloader)を使って [Pwned Passwords](https://haveibeenpwned.com/Passwords) データベースをダウンロードし、自分でホストすることもできます。
    - その他の上位パスワードリストもありますが、どの程度更新されているかは保証されません。
        - Daniel Miessler の SecLists がホストする[各種パスワードリスト](https://github.com/danielmiessler/SecLists/tree/master/Passwords)。
        - NCSC が [text](https://www.ncsc.gov.uk/static-assets/documents/PwnedPasswordsTop100k.txt) および [JSON](https://www.ncsc.gov.uk/static-assets/documents/PwnedPasswordsTop100k.json) 形式でホストする、"Have I Been Pwned" の上位 100,000 パスワードの静的コピー。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### For more detailed information check

- [ASVS v5.0 Password Security Requirements](https://github.com/OWASP/ASVS/blob/master/5.0/en/0x15-V6-Authentication.md#v62-password-security)
- [Passwords Evolved: Authentication Guidance for the Modern Era](https://www.troyhunt.com/passwords-evolved-authentication-guidance-for-the-modern-era/)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### より詳しい情報

- [ASVS v5.0 Password Security Requirements](https://github.com/OWASP/ASVS/blob/master/5.0/en/0x15-V6-Authentication.md#v62-password-security)
- [Passwords Evolved: Authentication Guidance for the Modern Era](https://www.troyhunt.com/passwords-evolved-authentication-guidance-for-the-modern-era/)

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Implement Secure Password Recovery Mechanism

It is common for an application to have a mechanism that provides a means for a user to gain access to their account in the event they forget their password. Please see [Forgot Password Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html) for details on this feature.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 安全なパスワードリカバリメカニズムの実装

ユーザーがパスワードを忘れた場合にアカウントへ再びアクセスする手段を提供する仕組みは、アプリケーションでは一般的です。この機能の詳細については、[Forgot Password Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html) を参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Store Passwords in a Secure Fashion

It is critical for an application to store a password using the right cryptographic technique. Please see [Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html) for details on this feature.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### パスワードの安全な保存

アプリケーションが適切な暗号技術を使ってパスワードを保存することは非常に重要です。この機能の詳細については、[Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html) を参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Compare Password Hashes Using Safe Functions

Where possible, the user-supplied password should be compared to the stored password hash using a secure password comparison function provided by the language or framework, such as the [password_verify()](https://www.php.net/manual/en/function.password-verify.php) function in PHP. Where this is not possible, ensure that the comparison function:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 安全な関数によるパスワードハッシュの比較

可能な場合、ユーザーが入力したパスワードは、PHP の [password_verify()](https://www.php.net/manual/en/function.password-verify.php) 関数など、言語またはフレームワークが提供する安全なパスワード比較関数を使って、保存済みのパスワードハッシュと比較するべきです。これが不可能な場合は、比較関数が次を満たすようにしてください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Has a maximum input length, to protect against denial of service attacks with very long inputs.
- Explicitly sets the type of both variables, to protect against type confusion attacks such as Magic Hashes in PHP.
- Returns in constant time, to protect against timing attacks.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- 非常に長い入力によるサービス拒否攻撃から保護するため、最大入力長を持つこと。
- PHP の Magic Hashes のような型混同攻撃から保護するため、両方の変数の型を明示的に設定すること。
- タイミング攻撃から保護するため、定数時間で返ること。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Change Password Feature

When developing a change password feature, ensure to have:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### パスワード変更機能

パスワード変更機能を開発する際は、次を満たすようにしてください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- The user is authenticated with an active session.
- Current password verification. This is to ensure that it's the legitimate user who is changing the password. Consider this abuse case: a user logs in on a public computer and forgets to log out. Another person could then use that active session. If we don't verify the current password, this other person may be able to change the password.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- ユーザーがアクティブなセッションで認証済みであること。
- 現在のパスワードを検証すること。これは、パスワードを変更しているのが正当なユーザーであることを保証するためです。次の悪用ケースを考えてください。ユーザーが公共のコンピューターにログインし、ログアウトを忘れます。その後、別の人物がそのアクティブなセッションを使用できてしまいます。現在のパスワードを検証しない場合、その別の人物がパスワードを変更できる可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Transmit Passwords Only Over TLS or Other Strong Transport

See: [Transport Layer Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### TLS またはその他の強力なトランスポートでのみパスワードを送信する

参照: [Transport Layer Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html)

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The login page and all subsequent authenticated pages must be exclusively accessed over TLS or other strong transport. Failure to utilize TLS or other strong transport for the login page allows an attacker to modify the login form action, causing the user's credentials to be posted to an arbitrary location. Failure to utilize TLS or other strong transport for authenticated pages after login enables an attacker to view the unencrypted session ID and compromise the user's authenticated session.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

ログインページと、その後のすべての認証済みページは、TLS またはその他の強力なトランスポートだけでアクセスされなければなりません。ログインページで TLS またはその他の強力なトランスポートを使用しないと、攻撃者がログインフォームの action を変更し、ユーザーの認証情報を任意の場所へ送信させることができます。ログイン後の認証済みページで TLS またはその他の強力なトランスポートを使用しないと、攻撃者が暗号化されていないセッション ID を閲覧し、ユーザーの認証済みセッションを侵害できるようになります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Require Re-authentication for Sensitive Features

In order to mitigate CSRF and session hijacking, it's important to require the current credentials for an account before updating sensitive account information such as the user's password or email address -- or before sensitive transactions, such as shipping a purchase to a new address. Without this countermeasure, an attacker may be able to execute sensitive transactions through a CSRF or XSS attack without needing to know the user's current credentials. Additionally, an attacker may get temporary physical access to a user's browser or steal their session ID to take over the user's session.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 機密機能では再認証を要求する

CSRF とセッションハイジャックを緩和するには、ユーザーのパスワードやメールアドレスなどの機密アカウント情報を更新する前、または購入品を新しい住所へ配送するような機密トランザクションの前に、そのアカウントの現在の認証情報を要求することが重要です。この対策がないと、攻撃者はユーザーの現在の認証情報を知らなくても、CSRF または XSS 攻撃を通じて機密トランザクションを実行できる可能性があります。さらに、攻撃者がユーザーのブラウザへ一時的に物理アクセスしたり、セッション ID を盗んだりして、ユーザーのセッションを乗っ取る可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Reauthentication After Risk Events

**Overview:**
Reauthentication is critical when an account has experienced high-risk activity such as account recovery, password resets, or suspicious behavior patterns. This section outlines when and how to trigger reauthentication to protect users and prevent unauthorized access. For further details, see the [Require Re-authentication for Sensitive Features](#require-re-authentication-for-sensitive-features) section.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### リスクイベント後の再認証

**概要:**
アカウントリカバリ、パスワードリセット、不審な行動パターンなどの高リスク活動がアカウントで発生した場合、再認証は重要です。このセクションでは、ユーザーを保護し、不正アクセスを防ぐために、いつ、どのように再認証を発火させるかを説明します。詳細については、[機密機能では再認証を要求する](#機密機能では再認証を要求する) セクションを参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### When to Trigger Reauthentication

- **Suspicious Account Activity**
  When unusual login patterns, IP address changes, or device enrollments occur
- **Account Recovery**
  After users reset their passwords or change sensitive account details
- **Critical Actions**
  For high-risk actions like changing payment details or adding new trusted devices

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 再認証を発火させるタイミング

- **不審なアカウント活動**
  通常とは異なるログインパターン、IP アドレスの変化、デバイス登録が発生した場合。
- **アカウントリカバリ**
  ユーザーがパスワードをリセットした後、または機密アカウント詳細を変更した後。
- **重要な操作**
  支払い詳細の変更や新しい信頼済みデバイスの追加など、高リスクな操作の場合。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Reauthentication Mechanisms

- **Adaptive Authentication**
  Use risk-based authentication models that adapt to the user's behavior and context
- **Multi-Factor Authentication (MFA)**
  Require an additional layer of verification for sensitive actions or events
- **Challenge-Based Verification**
  Prompt users to confirm their identity with a challenge question or secondary method

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 再認証メカニズム

- **適応型認証**
  ユーザーの行動と文脈に適応するリスクベース認証モデルを使用します。
- **多要素認証 (MFA)**
  機密操作または機密イベントに追加の検証層を要求します。
- **チャレンジベース検証**
  チャレンジ質問または二次的な方法で、ユーザーに本人確認を促します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Implementation Recommendations

- **Minimize User Friction**
  Ensure that reauthentication does not disrupt the user experience unnecessarily
- **Context-Aware Decisions**
  Make reauthentication decisions based on context (e.g., geolocation, device type, prior patterns)
- **Secure Session Management**
  Invalidate sessions after reauthentication and rotate tokens—see the [OWASP Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 実装上の推奨事項

- **ユーザー摩擦の最小化**
  再認証がユーザー体験を不必要に妨げないようにします。
- **文脈を考慮した判断**
  位置情報、デバイス種別、過去のパターンなどの文脈に基づいて再認証を判断します。
- **安全なセッション管理**
  再認証後にセッションを無効化し、トークンをローテーションします。詳細は [OWASP Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html) を参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Consider Strong Transaction Authentication

Some applications should use a second factor to check whether a user may perform sensitive operations. For more information, see the [Transaction Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Transaction_Authorization_Cheat_Sheet.html).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 強いトランザクション認証の検討

一部のアプリケーションでは、ユーザーが機密操作を実行してよいかを確認するために第二要素を使用するべきです。詳細については、[Transaction Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Transaction_Authorization_Cheat_Sheet.html) を参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### TLS Client Authentication

TLS Client Authentication, also known as two-way TLS authentication, consists of both browser and server sending their respective TLS certificates during the TLS handshake process. Just as you can validate the authenticity of a server by using the certificate and asking a verifiably-valid Certificate Authority (CA) if the certificate is valid, the server can authenticate the user by receiving a certificate from the client and validating against a third-party CA or its own CA. To do this, the server must provide the user with a certificate generated specifically for him, assigning values to the subject so that these can be used to determine what user the certificate should validate. The user installs the certificate on a browser and now uses it for the website.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### TLS クライアント認証

TLS クライアント認証は双方向 TLS 認証とも呼ばれ、TLS ハンドシェイク処理中にブラウザとサーバーの双方がそれぞれの TLS 証明書を送信します。証明書を使い、検証可能で有効な認証局 (CA) に証明書の有効性を問い合わせることでサーバーの真正性を検証できるのと同様に、サーバーはクライアントから証明書を受け取り、第三者 CA または自組織の CA に対して検証することでユーザーを認証できます。これを行うには、サーバーはそのユーザー専用に生成した証明書をユーザーに提供し、その証明書がどのユーザーを検証すべきか判断できるように subject に値を割り当てなければなりません。ユーザーは証明書をブラウザにインストールし、その Web サイトで使用します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

This approach is appropriate when:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

この方式は次の場合に適しています。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- It is acceptable (or even preferred) that the user has access to the website only from a single computer/browser.
- The user is not easily scared by the process of installing TLS certificates on their browser, or there will be someone, probably from IT support, who will do this for the user.
- The website requires an extra step of security.
- It is also a good thing to use when the website is for an intranet of a company or organization.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- ユーザーが単一のコンピューターまたはブラウザからのみ Web サイトへアクセスすることが許容される、または望ましい場合。
- ユーザーがブラウザへ TLS 証明書をインストールするプロセスに過度な不安を感じない場合、または IT サポートなどがユーザーのために実施する場合。
- Web サイトが追加のセキュリティ手順を必要とする場合。
- 企業や組織のイントラネット向け Web サイトである場合にも有効です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

It is generally not a good idea to use this method for widely and publicly available websites that will have an average user. For example, it wouldn't be a good idea to implement this for a website like Facebook. While this technique can prevent the user from having to type a password (thus protecting against an average keylogger from stealing it), it is still considered a good idea to consider using both a password and TLS client authentication combined.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

広く一般に公開される Web サイトで、平均的なユーザーを対象とする場合、この方式を使うことは一般に良い考えではありません。たとえば、Facebook のような Web サイトにこれを実装するのは良い考えではありません。この技術は、ユーザーがパスワードを入力する必要をなくせるため、一般的なキーロガーによる窃取から保護できますが、それでもパスワードと TLS クライアント認証の併用を検討することは良い考えとされています。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Additionally, if the client is behind an enterprise proxy that performs SSL/TLS decryption, this will break certificate authentication unless the site is allowed on the proxy.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

さらに、クライアントが SSL/TLS 復号を行う企業プロキシの背後にいる場合、そのサイトがプロキシで許可されていない限り、証明書認証は機能しなくなります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

For more information, see: [Client-authenticated TLS handshake](https://en.wikipedia.org/wiki/Transport_Layer_Security#Client-authenticated_TLS_handshake)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

詳細は、[Client-authenticated TLS handshake](https://en.wikipedia.org/wiki/Transport_Layer_Security#Client-authenticated_TLS_handshake) を参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Authentication and Error Messages

Incorrectly implemented error messages in the case of authentication functionality can be used for the purposes of user ID and password enumeration. An application should respond (both HTTP and HTML) in a generic manner.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 認証とエラーメッセージ

認証機能におけるエラーメッセージの実装が不適切だと、User ID とパスワードの列挙に使われる可能性があります。アプリケーションは、HTTP と HTML の両方で一般化された方法で応答するべきです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Authentication Responses

Using any of the authentication mechanisms (login, password reset, or password recovery), an application must respond with a generic error message regardless of whether:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 認証応答

認証メカニズム (ログイン、パスワードリセット、パスワードリカバリ) のいずれを使用する場合でも、アプリケーションは次のどれに該当するかに関係なく、一般化されたエラーメッセージで応答しなければなりません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- The user ID or password was incorrect.
- The account does not exist.
- The account is locked or disabled.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- User ID またはパスワードが誤っている。
- アカウントが存在しない。
- アカウントがロックまたは無効化されている。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The account registration feature should also be taken into consideration, and the same approach of a generic error message can be applied regarding the case in which the user exists.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

アカウント登録機能も考慮するべきです。ユーザーが存在する場合にも、同じ一般化されたエラーメッセージのアプローチを適用できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The objective is to prevent the creation of a [discrepancy factor](https://cwe.mitre.org/data/definitions/204.html), allowing an attacker to mount a user enumeration action against the application.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

目的は、攻撃者がアプリケーションに対してユーザー列挙を実行できるようにする[不一致要因](https://cwe.mitre.org/data/definitions/204.html)の生成を防ぐことです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

It is interesting to note that the business logic itself can bring a discrepancy factor related to the processing time taken. Indeed, depending on the implementation, the processing time can be significantly different according to the case (success vs failure) allowing an attacker to mount a [time-based attack](https://en.wikipedia.org/wiki/Timing_attack) (delta of some seconds for example).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

ビジネスロジック自体が、処理時間に関連する不一致要因を生み出す可能性がある点は注目に値します。実際、実装によっては、ケース (成功と失敗) に応じて処理時間が大きく異なり、攻撃者が[時間ベース攻撃](https://en.wikipedia.org/wiki/Timing_attack) (たとえば数秒の差分) を実行できるようになります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Example using pseudo-code for a login feature:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

ログイン機能の擬似コード例:

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- First implementation using the "quick exit" approach

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- "quick exit" アプローチを使う最初の実装

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```text
IF USER_EXISTS(username) THEN
    password_hash=HASH(password)
    IS_VALID=LOOKUP_CREDENTIALS_IN_STORE(username, password_hash)
    IF NOT IS_VALID THEN
        RETURN Error("Invalid Username or Password!")
    ENDIF
ELSE
   RETURN Error("Invalid Username or Password!")
ENDIF
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

It can be clearly seen that if the user doesn't exist, the application will directly throw an error. Otherwise, when the user exists and the password doesn't, it is apparent that there will be more processing before the application errors out. In return, the response time will be different for the same error, allowing the attacker to differentiate between a wrong username and a wrong password.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

ユーザーが存在しない場合、アプリケーションが直接エラーを返すことが明確に分かります。一方、ユーザーは存在するがパスワードが一致しない場合、アプリケーションがエラーを返すまでにより多くの処理が行われることは明らかです。その結果、同じエラーであっても応答時間が異なり、攻撃者が誤ったユーザー名と誤ったパスワードを区別できるようになります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Second implementation without relying on the "quick exit" approach:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- "quick exit" アプローチに依存しない二つ目の実装:

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```text
password_hash=HASH(password)
IS_VALID=LOOKUP_CREDENTIALS_IN_STORE(username, password_hash)
IF NOT IS_VALID THEN
   RETURN Error("Invalid Username or Password!")
ENDIF
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

This code will go through the same process no matter what the user or the password is, allowing the application to return in approximately the same response time.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

このコードは、ユーザーやパスワードが何であっても同じプロセスを通るため、アプリケーションはほぼ同じ応答時間で返せます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The problem with returning a generic error message for the user is a User Experience (UX) matter. A legitimate user might feel confused with the generic messages, thus making it hard for them to use the application, and might after several retries, leave the application because of its complexity. The decision to return a *generic error message* can be determined based on the criticality of the application and its data. For example, for critical applications, the team can decide that under the failure scenario, a user will always be redirected to the support page and a *generic error message* will be returned.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

ユーザーに一般化されたエラーメッセージを返すことの問題は、ユーザー体験 (UX) に関するものです。正当なユーザーは一般化されたメッセージに混乱し、アプリケーションの利用が難しくなり、何度か再試行した後に複雑さを理由としてアプリケーションから離脱する可能性があります。*一般化されたエラーメッセージ*を返すかどうかは、アプリケーションとそのデータの重要度に基づいて判断できます。たとえば重要なアプリケーションでは、チームは失敗シナリオにおいてユーザーを常にサポートページへリダイレクトし、*一般化されたエラーメッセージ*を返すと決めることができます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Regarding the user enumeration itself, protection against [brute-force attacks](#protect-against-automated-attacks) is also effective because it prevents an attacker from applying the enumeration at scale. Usage of [CAPTCHA](https://en.wikipedia.org/wiki/CAPTCHA) can be applied to a feature for which a *generic error message* cannot be returned because the *user experience* must be preserved.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

ユーザー列挙そのものについては、[ブルートフォース攻撃](#自動攻撃からの保護)への対策も有効です。これは、攻撃者が列挙を大規模に適用することを防ぐためです。*ユーザー体験*を維持する必要があるために*一般化されたエラーメッセージ*を返せない機能には、[CAPTCHA](https://en.wikipedia.org/wiki/CAPTCHA) の使用を適用できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

##### Incorrect and correct response examples

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

##### 誤った応答例と正しい応答例

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

###### Login

Incorrect response examples:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

###### ログイン

誤った応答例:

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- "Login for User foo: invalid password."
- "Login failed, invalid user ID."
- "Login failed; account disabled."
- "Login failed; this user is not active."

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- "Login for User foo: invalid password."
- "Login failed, invalid user ID."
- "Login failed; account disabled."
- "Login failed; this user is not active."

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Correct response example:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

正しい応答例:

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- "Login failed; Invalid user ID or password."

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- "Login failed; Invalid user ID or password."

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

###### Password recovery

Incorrect response examples:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

###### パスワードリカバリ

誤った応答例:

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- "We just sent you a password reset link."
- "This email address doesn't exist in our database."

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- "We just sent you a password reset link."
- "This email address doesn't exist in our database."

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Correct response example:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

正しい応答例:

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- "If that email address is in our database, we will send you an email to reset your password."

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- "If that email address is in our database, we will send you an email to reset your password."

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

###### Account creation

Incorrect response examples:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

###### アカウント作成

誤った応答例:

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- "This user ID is already in use."
- "Welcome! You have signed up successfully."

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- "This user ID is already in use."
- "Welcome! You have signed up successfully."

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Correct response example:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

正しい応答例:

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- "A link to activate your account has been emailed to the address provided."

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- "A link to activate your account has been emailed to the address provided."

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

##### Error Codes and URLs

The application may return a different [HTTP Error code](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) depending on the authentication attempt response. It may respond with a 200 for a positive result and a 403 for a negative result. Even though a generic error page is shown to a user, the HTTP response code may differ which can leak information about whether the account is valid or not.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

##### エラーコードと URL

アプリケーションは、認証試行の応答に応じて異なる [HTTP Error code](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) を返す場合があります。肯定的な結果では 200、否定的な結果では 403 を返すかもしれません。一般化されたエラーページがユーザーに表示されていても、HTTP レスポンスコードが異なれば、アカウントが有効かどうかに関する情報が漏えいする可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Error disclosure can also be used as a discrepancy factor, consult the [error handling cheat sheet](https://cheatsheetseries.owasp.org/cheatsheets/Error_Handling_Cheat_Sheet.html) regarding the global handling of different errors in an application.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

エラー開示も不一致要因として使われる可能性があります。アプリケーションで異なるエラーを全体として扱う方法については、[error handling cheat sheet](https://cheatsheetseries.owasp.org/cheatsheets/Error_Handling_Cheat_Sheet.html) を参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Protect Against Automated Attacks

There are a number of different types of automated attacks that attackers can use to try and compromise user accounts. The most common types are listed below:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 自動攻撃からの保護

攻撃者がユーザーアカウントを侵害しようとするときに使用できる自動攻撃には、さまざまな種類があります。最も一般的な種類を以下に示します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

| Attack Type | Description |
|-------------|-------------|
| Brute Force | Testing multiple passwords from a dictionary or other source against a single account. |
| Credential Stuffing | Testing username/password pairs obtained from the breach of another site. |
| Password Spraying | Testing a single weak password against a large number of different accounts.|

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

| 攻撃タイプ | 説明 |
|-------------|-------------|
| ブルートフォース | 辞書またはその他のソースにある複数のパスワードを、単一アカウントに対して試す。 |
| クレデンシャルスタッフィング | 別サイトの侵害から取得したユーザー名とパスワードのペアを試す。 |
| パスワードスプレー | 単一の弱いパスワードを、多数の異なるアカウントに対して試す。|

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Different protection mechanisms can be implemented to protect against these attacks. In many cases, these defenses do not provide complete protection, but when a number of them are implemented in a defense-in-depth approach, a reasonable level of protection can be achieved.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

これらの攻撃から保護するために、さまざまな保護メカニズムを実装できます。多くの場合、これらの防御は完全な保護を提供しませんが、多層防御のアプローチで複数を実装すれば、妥当なレベルの保護を達成できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The following sections will focus primarily on preventing brute-force attacks, although these controls can also be effective against other types of attacks. For further guidance on defending against credential stuffing and password spraying, see the [Credential Stuffing Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Credential_Stuffing_Prevention_Cheat_Sheet.html).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

以下のセクションでは主にブルートフォース攻撃の防止に焦点を当てますが、これらの管理策は他の種類の攻撃に対しても有効な場合があります。クレデンシャルスタッフィングとパスワードスプレーの防御に関する追加ガイダンスについては、[Credential Stuffing Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Credential_Stuffing_Prevention_Cheat_Sheet.html) を参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Multi-Factor Authentication

Multi-factor authentication (MFA) is by far the best defense against the majority of password-related attacks, including brute-force attacks, with analysis by Microsoft suggesting that it would have stopped [99.9% of account compromises](https://techcommunity.microsoft.com/t5/Azure-Active-Directory-Identity/Your-Pa-word-doesn-t-matter/ba-p/731984). As such, it should be implemented wherever possible; however, depending on the audience of the application, it may not be practical or feasible to enforce the use of MFA.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 多要素認証

多要素認証 (MFA) は、ブルートフォース攻撃を含む大多数のパスワード関連攻撃に対する、圧倒的に最良の防御です。Microsoft の分析では、MFA は[アカウント侵害の 99.9%](https://techcommunity.microsoft.com/t5/Azure-Active-Directory-Identity/Your-Pa-word-doesn-t-matter/ba-p/731984)を防止できた可能性があると示されています。したがって、可能な限り実装するべきです。ただし、アプリケーションの対象者によっては、MFA の使用を強制することが実用的または実現可能ではない場合があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The [Multifactor Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html) contains further guidance on implementing MFA.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

[Multifactor Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html) には、MFA の実装に関する追加ガイダンスがあります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Login Throttling

Login Throttling is a protocol used to prevent an attacker from making too many attempts at guessing a password through normal interactive means, it includes the following controls:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### ログインスロットリング

ログインスロットリングは、攻撃者が通常の対話的な手段でパスワード推測を過剰に試行することを防ぐために使われるプロトコルで、次の管理策を含みます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Maximum number of attempts.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- 最大試行回数。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

##### Account Lockout

The most common protection against these attacks is to implement account lockout, which prevents any more login attempts for a period after a certain number of failed logins.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

##### アカウントロックアウト

これらの攻撃に対する最も一般的な保護は、一定回数のログイン失敗後、一定期間それ以上のログイン試行を防ぐアカウントロックアウトを実装することです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The counter of failed logins should be associated with the account itself, rather than the source IP address, in order to prevent an attacker from making login attempts from a large number of different IP addresses. There are a number of different factors that should be considered when implementing an account lockout policy in order to find a balance between security and usability:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

攻撃者が多数の異なる IP アドレスからログイン試行を行うことを防ぐため、ログイン失敗のカウンターは送信元 IP アドレスではなく、アカウント自体に関連付けるべきです。セキュリティと使いやすさのバランスを見つけるため、アカウントロックアウトポリシーを実装するときには次のような複数の要因を考慮するべきです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- The number of failed attempts before the account is locked out (lockout threshold).
- The time period that these attempts must occur within (observation window).
- How long the account is locked out for (lockout duration).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- アカウントがロックアウトされるまでの失敗回数 (ロックアウトしきい値)。
- これらの試行が発生しなければならない期間 (観測ウィンドウ)。
- アカウントをロックアウトする時間 (ロックアウト期間)。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Rather than implementing a fixed lockout duration (e.g., ten minutes), some applications use an exponential lockout, where the lockout duration starts as a very short period (e.g., one second), but doubles after each failed login attempt.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

固定のロックアウト期間 (例: 10 分) を実装する代わりに、一部のアプリケーションでは指数ロックアウトを使用します。これは、ロックアウト期間を非常に短い時間 (例: 1 秒) から開始し、ログイン失敗のたびに倍増させる方式です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Amount of time to delay after each account lockout (max 2-3, after that permanent account lockout).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- 各アカウントロックアウト後に遅延させる時間 (最大 2-3 回、その後は永続的なアカウントロックアウト)。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

When designing an account lockout system, care must be taken to prevent it from being used to cause a denial of service by locking out other users' accounts. One way this could be performed is to allow the use of the forgotten password functionality to log in, even if the account is locked out.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

アカウントロックアウトシステムを設計する際は、他のユーザーのアカウントをロックアウトすることによるサービス拒否に悪用されないよう注意が必要です。これを実現する方法の一つは、アカウントがロックアウトされている場合でも、パスワード忘れ機能を使ってログインできるようにすることです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### CAPTCHA

The use of an effective CAPTCHA can help to prevent automated login attempts against accounts. However, many CAPTCHA implementations have weaknesses that allow them to be solved using automated techniques or can be outsourced to services that can solve them. As such, the use of CAPTCHA should be viewed as a defense-in-depth control to make brute-force attacks more time-consuming and expensive, rather than as a preventative.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### CAPTCHA

有効な CAPTCHA の使用は、アカウントに対する自動ログイン試行を防ぐ助けになります。しかし、多くの CAPTCHA 実装には、自動化技術で解ける、または解決サービスへ外注できる弱点があります。そのため、CAPTCHA の使用は、ブルートフォース攻撃の時間とコストを増やす多層防御の管理策として捉えるべきであり、予防策そのものとして捉えるべきではありません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

It may be more user-friendly to only require a CAPTCHA be solved after a small number of failed login attempts, rather than requiring it from the very first login.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

最初のログインから CAPTCHA の解決を必須にするよりも、少数のログイン失敗後にのみ CAPTCHA を要求する方が、ユーザーにとって使いやすい場合があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Security Questions and Memorable Words

The addition of a security question or memorable word can also help protect against automated attacks, especially when the user is asked to enter a number of randomly chosen characters from the word. It should be noted that this does **not** constitute multi-factor authentication, as both factors are the same (something you know). Furthermore, security questions are often weak and have predictable answers, so they must be carefully chosen. The [Choosing and Using Security Questions cheat sheet](https://cheatsheetseries.owasp.org/cheatsheets/Choosing_and_Using_Security_Questions_Cheat_Sheet.html) contains further guidance on this.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### セキュリティ質問と記憶語

セキュリティ質問または記憶語の追加も、自動攻撃から保護する助けになります。特に、ユーザーが記憶語からランダムに選ばれたいくつかの文字を入力するよう求められる場合に有効です。ただし、これは多要素認証を構成するものでは**ない**点に注意してください。どちらの要素も同じもの (知っているもの) だからです。さらに、セキュリティ質問は弱く、回答が予測可能であることが多いため、慎重に選ばなければなりません。[Choosing and Using Security Questions cheat sheet](https://cheatsheetseries.owasp.org/cheatsheets/Choosing_and_Using_Security_Questions_Cheat_Sheet.html) には、この点に関する追加ガイダンスがあります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Logging and Monitoring

Enable logging and monitoring of authentication functions to detect attacks/failures on a real-time basis

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## ログと監視

攻撃や失敗をリアルタイムで検知するため、認証機能のログと監視を有効にします。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Ensure that all failures are logged and reviewed
- Ensure that all password failures are logged and reviewed
- Ensure that all account lockouts are logged and reviewed

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- すべての失敗がログに記録され、レビューされるようにします。
- すべてのパスワード失敗がログに記録され、レビューされるようにします。
- すべてのアカウントロックアウトがログに記録され、レビューされるようにします。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Use of authentication protocols that require no password

While authentication through a combination of username, password, and multi-factor authentication is considered generally secure, there are use cases where it isn't considered the best option or even safe. Examples of this are third-party applications that desire to connect to the web application, either from a mobile device, another website, desktop, or other situations. When this happens, it is NOT considered safe to allow the third-party application to store the user/password combo, since then it extends the attack surface into their hands, where it isn't in your control. For this and other use cases, there are several authentication protocols that can protect you from exposing your users' data to attackers.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## パスワードを必要としない認証プロトコルの使用

ユーザー名、パスワード、多要素認証の組み合わせによる認証は一般に安全と考えられますが、それが最善の選択肢ではない、または安全でさえないユースケースがあります。例として、モバイルデバイス、別の Web サイト、デスクトップ、その他の状況から Web アプリケーションへ接続したいサードパーティアプリケーションがあります。この場合、サードパーティアプリケーションにユーザー名とパスワードの組み合わせを保存させることは安全とは**みなされません**。攻撃面がその第三者の手元まで拡大し、自分の管理外になるためです。このようなユースケースやその他のユースケースでは、攻撃者にユーザーのデータを露出させないよう保護できる認証プロトコルがいくつかあります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### OAuth 2.0 and 2.1

OAuth is an **authorization** framework for delegated access to APIs. See also: [OAuth 2.0 Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/OAuth2_Cheat_Sheet.html).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### OAuth 2.0 と 2.1

OAuth は、API への委任アクセスのための**認可**フレームワークです。あわせて [OAuth 2.0 Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/OAuth2_Cheat_Sheet.html) も参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

> **Note:** OAuth 2.1 is an IETF Working Group draft that consolidates OAuth 2.0 and widely adopted best practices and is intended to replace RFC 6749/6750; guidance in this cheat sheet applies to both OAuth 2.0 and OAuth 2.1. References: [draft-ietf-oauth-v2-1-13](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-v2-1-13), [oauth.net/2.1](https://oauth.net/2.1/)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

> **注:** OAuth 2.1 は、OAuth 2.0 と広く採用されたベストプラクティスを統合する IETF ワーキンググループのドラフトであり、RFC 6749/6750 を置き換えることを意図しています。このチートシートのガイダンスは OAuth 2.0 と OAuth 2.1 の両方に適用されます。参考: [draft-ietf-oauth-v2-1-13](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-v2-1-13), [oauth.net/2.1](https://oauth.net/2.1/)

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### OpenID Connect (OIDC)

**OpenID Connect 1.0 (OIDC)** is an identity layer **on top of OAuth**. It defines how a client (**relying party**) verifies the **end user's** identity using an **ID Token** (a signed JWT) and how to obtain user claims in an interoperable way. Use **OIDC for authentication/SSO**; use **OAuth for authorization** to APIs.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### OpenID Connect (OIDC)

**OpenID Connect 1.0 (OIDC)** は、**OAuth の上にある**アイデンティティ層です。クライアント (**relying party**) が、**エンドユーザー**のアイデンティティを **ID Token** (署名付き JWT) で検証する方法と、相互運用可能な方法でユーザー Claim を取得する方法を定義します。認証/SSO には **OIDC** を使い、API への認可には **OAuth** を使います。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### OIDC implementation guidance

- **Validate ID Tokens** on the relying party: issuer (`iss`), audience (`aud`), signature (per provider JWKs), expiration (`exp`).
- Prefer **well-maintained libraries/SDKs** and provider discovery/JWKS endpoints.
- Use the **UserInfo** endpoint when additional claims beyond the ID Token are required.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### OIDC 実装ガイダンス

- relying party で **ID Token を検証**します。issuer (`iss`)、audience (`aud`)、署名 (プロバイダの JWK に基づく)、有効期限 (`exp`) を検証します。
- **よく保守されたライブラリ/SDK** と、プロバイダ discovery/JWKS エンドポイントを優先して使用します。
- ID Token を超える追加 Claim が必要な場合は、**UserInfo** エンドポイントを使用します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

> **Avoid confusion:** **OpenID 2.0 ("OpenID")** was a separate, legacy authentication protocol that has been **superseded by OpenID Connect** and is considered obsolete. New systems should not implement OpenID 2.0. References: [OpenID Foundation — obsolete OpenID 2.0 libraries](https://openid.net/developers/libraries-for-obsolete-specifications/), [OpenID 2.0 → OIDC migration](https://openid.net/specs/openid-connect-migration-1_0.html)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

> **混同を避ける:** **OpenID 2.0 ("OpenID")** は別個のレガシー認証プロトコルであり、**OpenID Connect に置き換えられて**おり、廃止されたものとみなされています。新しいシステムでは OpenID 2.0 を実装するべきではありません。参考: [OpenID Foundation — obsolete OpenID 2.0 libraries](https://openid.net/developers/libraries-for-obsolete-specifications/), [OpenID 2.0 → OIDC migration](https://openid.net/specs/openid-connect-migration-1_0.html)

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### SAML

Security Assertion Markup Language (SAML) is often considered to compete with OpenId. The most recommended version is 2.0 since it is very feature-complete and provides strong security. Like OpenId, SAML uses identity providers, but unlike OpenId, it is XML-based and provides more flexibility. SAML is based on browser redirects which send XML data. Furthermore, SAML isn't only initiated by a service provider; it can also be initiated from the identity provider. This allows the user to navigate through different portals while still being authenticated without having to do anything, making the process transparent.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### SAML

Security Assertion Markup Language (SAML) は、OpenId と競合するものとみなされることがよくあります。最も推奨されるバージョンは 2.0 です。非常に機能が充実しており、強いセキュリティを提供するためです。OpenId と同様に、SAML はアイデンティティプロバイダを使用しますが、OpenId と異なり XML ベースで、より高い柔軟性を提供します。SAML は XML データを送信するブラウザリダイレクトに基づいています。さらに、SAML はサービスプロバイダから開始されるだけではなく、アイデンティティプロバイダから開始することもできます。これにより、ユーザーは何もしなくても認証されたまま複数のポータルを移動でき、プロセスが透過的になります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

While OpenId has taken most of the consumer market, SAML is often the choice for enterprise applications because there are few OpenId identity providers which are considered enterprise-class (meaning that the way they validate the user identity doesn't have high standards required for enterprise identity). It is more common to see SAML being used inside of intranet websites, sometimes even using a server from the intranet as the identity provider.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

OpenId はコンシューマー市場の大部分を占めてきましたが、SAML は企業アプリケーションで選ばれることが多いです。企業クラスとみなされる OpenId アイデンティティプロバイダは少ないためです (つまり、ユーザーアイデンティティの検証方法が、企業アイデンティティに必要な高い基準を満たしていないという意味です)。SAML はイントラネット Web サイト内で使われることがより一般的であり、イントラネット上のサーバーをアイデンティティプロバイダとして使う場合さえあります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

In the past few years, applications like SAP ERP and SharePoint (SharePoint by using Active Directory Federation Services 2.0) have decided to use SAML 2.0 authentication as an often preferred method for single sign-on implementations whenever enterprise federation is required for web services and web applications.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

ここ数年、SAP ERP や SharePoint (Active Directory Federation Services 2.0 を使う SharePoint) などのアプリケーションは、Web サービスと Web アプリケーションで企業フェデレーションが必要な場合に、シングルサインオン実装の好ましい方法として SAML 2.0 認証を使用することを決定しています。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**See also: [SAML Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/SAML_Security_Cheat_Sheet.html)**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**関連: [SAML Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/SAML_Security_Cheat_Sheet.html)**

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### FIDO

The Fast Identity Online (FIDO) Alliance has created two protocols to facilitate online authentication: the Universal Authentication Framework (UAF) protocol and the Universal Second Factor (U2F) protocol. While UAF focuses on passwordless authentication, U2F allows the addition of a second factor to existing password-based authentication. Both protocols are based on a public key cryptography challenge-response model.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### FIDO

Fast Identity Online (FIDO) Alliance は、オンライン認証を容易にする二つのプロトコルを作成しました。Universal Authentication Framework (UAF) プロトコルと Universal Second Factor (U2F) プロトコルです。UAF はパスワードレス認証に焦点を当て、U2F は既存のパスワードベース認証に第二要素を追加できるようにします。どちらのプロトコルも、公開鍵暗号のチャレンジレスポンスモデルに基づいています。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

UAF takes advantage of existing security technologies present on devices for authentication including fingerprint sensors, cameras (face biometrics), microphones (voice biometrics), Trusted Execution Environments (TEEs), Secure Elements (SEs), and others. The protocol is designed to plug these device capabilities into a common authentication framework. UAF works with both native applications and web applications.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

UAF は、指紋センサー、カメラ (顔バイオメトリクス)、マイク (音声バイオメトリクス)、Trusted Execution Environments (TEEs)、Secure Elements (SEs) など、デバイスに存在する既存のセキュリティ技術を認証に活用します。このプロトコルは、これらのデバイス機能を共通の認証フレームワークへ組み込むよう設計されています。UAF はネイティブアプリケーションと Web アプリケーションの両方で機能します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

U2F augments password-based authentication using a hardware token (typically USB) that stores cryptographic authentication keys and uses them for signing. The user can use the same token as a second factor for multiple applications. U2F works with web applications. It provides **protection against phishing** by using the URL of the website to look up the stored authentication key.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

U2F は、暗号学的な認証鍵を保存し、それを署名に使うハードウェアトークン (通常は USB) を使用して、パスワードベース認証を補強します。ユーザーは同じトークンを複数のアプリケーションの第二要素として使用できます。U2F は Web アプリケーションで機能します。保存された認証鍵を検索するために Web サイトの URL を使うことで、**フィッシングに対する保護**を提供します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**FIDO2**: FIDO2 and WebAuthn, encompassing previous standards (UAF/U2F), form the foundation of modern **Passkeys** technology. Passkeys enable users to securely log in using local user verification (such as biometrics or device PINs) and often supporting cloud synchronization across devices. This technology is widely supported by major platforms. (Windows Hello/Mac Touch ID)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**FIDO2**: FIDO2 と WebAuthn は、以前の標準 (UAF/U2F) を包含し、現代の **Passkeys** 技術の基盤を形成します。Passkeys により、ユーザーはローカルのユーザー検証 (バイオメトリクスやデバイス PIN など) を使って安全にログインでき、多くの場合、デバイス間のクラウド同期にも対応します。この技術は主要プラットフォームで広くサポートされています。(Windows Hello/Mac Touch ID)

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Password Managers

Password managers are programs, browser plugins, or web services that automate the management of a large quantity of different credentials. Most password managers have functionality to allow users to easily use them on websites, either:
(a) by pasting the passwords into the login form
-- or --
(b) by simulating the user typing them in.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## パスワードマネージャー

パスワードマネージャーは、大量の異なる認証情報の管理を自動化するプログラム、ブラウザプラグイン、または Web サービスです。ほとんどのパスワードマネージャーには、ユーザーが Web サイトで容易に利用できるようにする機能があります。方法は次のいずれかです。
(a) パスワードをログインフォームへ貼り付ける
-- または --
(b) ユーザーが入力しているようにシミュレートする。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Web applications should not make the job of password managers more difficult than necessary by observing the following recommendations:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Web アプリケーションは、次の推奨事項を守り、パスワードマネージャーの仕事を必要以上に難しくしないようにするべきです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Use standard HTML forms for username and password input with appropriate `type` attributes.
- Avoid plugin-based login pages (such as Flash or Silverlight).
- Implement a reasonable maximum password length, at least 64 characters, as discussed in the [Implement Proper Password Strength Controls section](#implement-proper-password-strength-controls).
- Allow any printable characters to be used in passwords.
- Allow users to paste into the username, password, and MFA fields.
- Allow users to navigate between the username and password field with a single press of the `Tab` key.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- ユーザー名とパスワード入力には、適切な `type` 属性を持つ標準 HTML フォームを使用します。
- プラグインベースのログインページ (Flash や Silverlight など) を避けます。
- [適切なパスワード強度管理の実装セクション](#適切なパスワード強度管理の実装)で説明したように、少なくとも 64 文字の妥当な最大パスワード長を実装します。
- パスワードに任意の印字可能文字を使えるようにします。
- ユーザー名、パスワード、MFA フィールドへの貼り付けを許可します。
- `Tab` キーを 1 回押すだけで、ユーザー名フィールドとパスワードフィールドの間を移動できるようにします。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Changing A User's Registered Email Address

User email addresses often change. The following process is recommended to handle such situations in a system:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## ユーザーの登録メールアドレス変更

ユーザーのメールアドレスはしばしば変更されます。このような状況をシステムで扱うため、次のプロセスが推奨されます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

*Note: The process is less stringent with [Multifactor Authentication](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html), as proof-of-identity is stronger than relying solely on a password.*

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

*注: [Multifactor Authentication](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html) がある場合、本人性の証明はパスワードのみに依存するよりも強いため、プロセスはやや厳格でなくなります。*

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Recommended Process If the User HAS [Multifactor Authentication](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html) Enabled

1. Confirm the validity of the user's authentication cookie/token. If not valid, display a login screen.
2. Describe the process for changing the registered email address to the user.
3. Ask the user to submit a proposed new email address, ensuring it complies with system rules.
4. Request the use of [Multifactor Authentication](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html) for identity verification.
5. Store the proposed new email address as a pending change.
6. Create and store **two** time-limited nonces for (a) system administrators' notification, and (b) user confirmation.
7. Send two email messages with links that include those nonces:

- A **notification-only email message** to the current address, alerting the user to the impending change and providing a link to report unexpected activity.

- A **confirmation-required email message** to the proposed new address, instructing the user to confirm the change and providing a link for unexpected situations.

8. Handle responses from the links accordingly.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### ユーザーが [Multifactor Authentication](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html) を有効にしている場合の推奨プロセス

1. ユーザーの認証 Cookie/トークンの妥当性を確認します。有効でない場合は、ログイン画面を表示します。
2. 登録メールアドレス変更のプロセスをユーザーに説明します。
3. 提案する新しいメールアドレスをユーザーに送信させ、システムルールに準拠していることを確認します。
4. 本人確認のため、[Multifactor Authentication](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html) の使用を要求します。
5. 提案された新しいメールアドレスを pending change として保存します。
6. (a) システム管理者への通知、および (b) ユーザー確認のために、時間制限付き nonce を**二つ**作成して保存します。
7. それらの nonce を含むリンク付きのメールメッセージを二つ送信します。

- 変更が差し迫っていることをユーザーに警告し、予期しない活動を報告するためのリンクを提供する、現在のアドレスへの**通知のみのメールメッセージ**。

- 変更を確認するようユーザーに指示し、予期しない状況のためのリンクを提供する、提案された新しいアドレスへの**確認が必要なメールメッセージ**。

8. リンクからの応答を適切に処理します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Recommended Process If the User DOES NOT HAVE Multifactor Authentication Enabled

1. Confirm the validity of the user's authentication cookie/token. If not valid, display a login screen.
2. Describe the process for changing the registered email address to the user.
3. Ask the user to submit a proposed new email address, ensuring it complies with system rules.
4. Request the user's current password for identity verification.
5. Store the proposed new email address as a pending change.
6. Create and store three time-limited nonces for system administrators' notification, user confirmation, and an additional step for password reliance.
7. Send two email messages with links to those nonces:

- A **confirmation-required email message** to the current address, instructing the user to confirm the change and providing a link for an unexpected situation.

- A **separate confirmation-required email message** to the proposed new address, instructing the user to confirm the change and providing a link for unexpected situations.

8. Handle responses from the links accordingly.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### ユーザーが Multifactor Authentication を有効にしていない場合の推奨プロセス

1. ユーザーの認証 Cookie/トークンの妥当性を確認します。有効でない場合は、ログイン画面を表示します。
2. 登録メールアドレス変更のプロセスをユーザーに説明します。
3. 提案する新しいメールアドレスをユーザーに送信させ、システムルールに準拠していることを確認します。
4. 本人確認のため、ユーザーの現在のパスワードを要求します。
5. 提案された新しいメールアドレスを pending change として保存します。
6. システム管理者への通知、ユーザー確認、およびパスワード依存に対する追加ステップのために、時間制限付き nonce を三つ作成して保存します。
7. それらの nonce へのリンクを含むメールメッセージを二つ送信します。

- 変更を確認するようユーザーに指示し、予期しない状況のためのリンクを提供する、現在のアドレスへの**確認が必要なメールメッセージ**。

- 変更を確認するようユーザーに指示し、予期しない状況のためのリンクを提供する、提案された新しいアドレスへの**別個の確認が必要なメールメッセージ**。

8. リンクからの応答を適切に処理します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Notes on the Above Processes

- It's worth noting that Google adopts a different approach with accounts secured only by a password -- [where the current email address receives a notification-only email](https://support.google.com/accounts/answer/55393?hl=en). This method carries risks and requires user vigilance.

- Regular social engineering training is crucial. System administrators and help desk staff should be trained to follow the prescribed process and recognize and respond to social engineering attacks. Refer to [CISA's "Avoiding Social Engineering and Phishing Attacks"](https://www.cisa.gov/news-events/news/avoiding-social-engineering-and-phishing-attacks) for guidance.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 上記プロセスに関する注記

- Google は、パスワードのみで保護されたアカウントについて、異なるアプローチ、すなわち[現在のメールアドレスが通知のみのメールを受け取る](https://support.google.com/accounts/answer/55393?hl=en)方法を採用している点は注目に値します。この方法にはリスクがあり、ユーザーの警戒が必要です。

- 定期的なソーシャルエンジニアリング訓練は重要です。システム管理者とヘルプデスクスタッフは、定められたプロセスに従い、ソーシャルエンジニアリング攻撃を認識して対応するための訓練を受けるべきです。ガイダンスについては、[CISA's "Avoiding Social Engineering and Phishing Attacks"](https://www.cisa.gov/news-events/news/avoiding-social-engineering-and-phishing-attacks) を参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Adaptive or Risk Based Authentication

A feature of more advanced applications is the ability to require different authentication stages depending on various environmental and contextual attributes (including but not limited to, the sensitivity of the data for which access is being requested, time of day, user location, IP address, or device fingerprint).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 適応型またはリスクベース認証

より高度なアプリケーションの機能の一つは、さまざまな環境属性および文脈属性 (アクセスが要求されているデータの機密性、時刻、ユーザーの位置、IP アドレス、デバイスフィンガープリントなどを含みますが、これらに限定されません) に応じて、異なる認証段階を要求できることです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

For example, an application may require MFA for the first login from a particular device but not for subsequent logins from that device. Alternatively, a single sign-on solution may authenticate the user and allow them to remain logged in for a day but require a reauthentication if they try to access their profile page.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

たとえば、アプリケーションは、特定のデバイスからの初回ログインでは MFA を要求し、そのデバイスからの以後のログインでは要求しないことがあります。あるいは、シングルサインオンソリューションがユーザーを認証し、1 日ログイン状態を維持できるようにする一方で、プロフィールページへアクセスしようとした場合には再認証を要求することがあります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Another option is the opposite approach where an application allows low risk access with just something that identifies the device (e.g., a specific mobile device fingerprint, a persistent cookie and browser fingerprint, etc. from the previous IP address) and then gradually requires stronger authentication for more sensitive operations. An example might be to allow someone to trigger something to see their current bank balance, but not the account number or anything else. If they need to see transactions, then the application puts them through some base level authentication and if they want to do any money movement, then MFA is required.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

別の選択肢は、反対のアプローチです。アプリケーションは、デバイスを識別するもの (例: 特定のモバイルデバイスフィンガープリント、永続 Cookie とブラウザフィンガープリント、以前の IP アドレスなど) だけで低リスクアクセスを許可し、その後、より機密性の高い操作に対して段階的に強い認証を要求します。例として、現在の銀行残高は表示できるが、口座番号やその他の情報は表示できないようにすることがあります。取引を確認する必要がある場合、アプリケーションは何らかの基本レベルの認証を要求し、資金移動を行いたい場合には MFA を要求します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Questions that should be considered when implementing a mechanism like this include:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

このようなメカニズムを実装するときに検討するべき質問には、次のものがあります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Are the policies being put in place in line with any corporate policies and especially any regulatory policy?
- Which user‑ or device‑attributes (IP, geolocation, device fingerprint, time‑of‑day, behavioral biometrics, etc.) will we monitor at session start?
- Which of those signals need to be refreshed during an active session, and at what cadence?
- How will we ensure each signal’s accuracy and handle missing or low‑confidence data?
- What scoring model (weights, thresholds, ML, rule‑based, hybrid) will convert raw signals into a risk tier?
- Where will the model run (edge, API gateway, central service), and what is our latency budget?
- What action maps to each risk tier (allow, CAPTCHA, step‑up MFA, block, revoke session)?
- What user‑facing messages and error codes will accompany each action?
- At which exact code or platform layers will we invoke the risk engine (login controller, middleware, API gateway, service mesh)?
- How do we propagate decisions consistently across web, mobile, and API clients?
- How do we mutate, extend, or revoke tokens/cookies when a mid‑session risk check escalates?
- How do we synchronize state across multiple concurrent devices or browser tabs?
- What monitoring and alerting will be in place for potentially suspicious activity, including how the user is notified.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- 導入されるポリシーは、企業ポリシー、特に規制上のポリシーに沿っていますか。
- セッション開始時に、どのユーザー属性またはデバイス属性 (IP、位置情報、デバイスフィンガープリント、時刻、行動バイオメトリクスなど) を監視しますか。
- それらのシグナルのうち、アクティブセッション中に更新する必要があるものはどれで、どの頻度で更新しますか。
- 各シグナルの正確性をどのように保証し、欠損データや信頼度の低いデータをどのように扱いますか。
- 生のシグナルをリスク階層へ変換するスコアリングモデル (重み、しきい値、ML、ルールベース、ハイブリッド) は何ですか。
- モデルはどこで実行しますか (エッジ、API ゲートウェイ、中央サービス)。また、レイテンシ予算はどれくらいですか。
- 各リスク階層に対応するアクション (許可、CAPTCHA、step-up MFA、ブロック、セッション失効) は何ですか。
- 各アクションには、どのユーザー向けメッセージとエラーコードを伴わせますか。
- どの正確なコード層またはプラットフォーム層でリスクエンジンを呼び出しますか (ログインコントローラー、ミドルウェア、API ゲートウェイ、サービスメッシュ)。
- Web、モバイル、API クライアント全体で、判断をどのように一貫して伝播しますか。
- セッション中のリスクチェックでリスクが上昇した場合、トークン/Cookie をどのように変更、延長、または失効させますか。
- 複数の同時デバイスまたはブラウザタブ間で、状態をどのように同期しますか。
- 潜在的に不審な活動について、どのような監視とアラートを設けますか。ユーザーへの通知方法も含めて検討します。

</div>
</div>

</section>
</div>

## References

<div className="referenceFooter">

- [OWASP Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- OWASP ASVS – 2.2.2: Reauthentication requirements
- NIST 800-63B: Digital Identity Guidelines – Authentication Assurance Levels

</div>


## Attribution

<div className="attributionFooter">

- Original: Authentication Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: English original retained for comparison. Japanese translation added. Bilingual display generated from official source and local Japanese translation.
- Retrieved: 2026-05-20

</div>
