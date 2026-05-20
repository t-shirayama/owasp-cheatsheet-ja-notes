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

認証 (Authentication / AuthN) は、個人、エンティティ、Web サイトが主張どおりの主体であることを、パスワード、指紋、セキュリティトークンなどの認証器の妥当性を確認して検証するプロセスです。デジタルアイデンティティは、オンライン取引に参加する主体の一意な表現です。特定のデジタルサービス内では一意である必要がありますが、必ずしも現実世界の特定人物へ追跡可能である必要はありません。

Identity Proofing は、主体が実際に主張どおりの人物であることを確立するプロセスです。これは KYC の考え方と関連し、デジタルアイデンティティを現実の人物へ結び付けることを目的とします。セッション管理は、サーバーがやり取りしている主体の状態を維持するプロセスであり、以降のリクエストへどう応答するかを判断するために必要です。セッション識別子はユーザーごとに一意で、推測困難である必要があります。

## ユーザー ID とユーザー名

User ID の主な役割は、システム内でユーザーを一意に識別することです。User ID が外部から露出または推測され得る場合、連番や予測可能な値はリスクになります。理想的にはランダムに生成します。

ユーザー名は、ログイン時にユーザーが自分を識別するために選ぶ覚えやすい識別子です。ユーザーが選んだユーザー名がシステム内の一意識別子としても機能する場合、User ID とユーザー名が同じ意味で使われることがあります。メールアドレスをユーザー名として使うことは、サインアップ時にメールアドレスを検証するなら許容できます。ユーザーには、メールアドレス以外のユーザー名を選べる選択肢も与えることが推奨されます。

## 認証ソリューションと機密アカウント

バックエンド、ミドルウェア、データベースなど内部で使う機密アカウントは、フロントエンドのユーザーインターフェースからログインできないようにします。また、内部利用の Identity Provider (IdP) や Active Directory などと同じ認証ソリューションを、公開アクセスや DMZ など安全でない経路の認証に使わないようにします。

## パスワード強度管理

パスワード認証では、パスワード強度が重要です。強いパスワードポリシーは、手動または自動の推測を困難にします。

- 最小長を強制します。MFA が有効な場合、8 文字未満のパスワードは弱いとみなされます。MFA がない場合、15 文字未満のパスワードは弱いとみなされます。
- パスフレーズを許容するため、最大長は少なくとも 64 文字にします。ただし、非常に長いパスワードによるサービス拒否の可能性に注意します。
- パスワードを黙って切り詰めてはいけません。最大長を超えるパスワードの扱いは明示します。
- Unicode と空白を含むすべての文字を許可します。大文字、小文字、数字、特殊文字などの構成ルールを必須にしないことが推奨されます。
- パスワード漏えい、侵害の特定、認証器技術の変更時には認証情報をローテーションします。一方、任意の定期パスワード変更は避け、強いパスワードと MFA の利用を促します。
- パスワード強度メーターを提供し、ユーザーがより強いパスワードを選べるようにします。
- 一般的なパスワードや、過去に漏えいしたパスワードをブロックします。

## パスワードリカバリ、保存、比較

パスワードを忘れたユーザーがアカウントへ復帰できる仕組みはよく使われますが、リカバリ機能は認証を迂回する経路になりやすいため、Forgot Password Cheat Sheet の管理策に従って実装します。

パスワード保存では適切な暗号学的手法を使います。パスワードを平文、可逆暗号、一般的な高速ハッシュだけで保存してはいけません。Password Storage Cheat Sheet を参照し、パスワードハッシュ、ソルト、ワークファクター、長い入力への扱いを設計します。

ユーザーが入力したパスワードと保存済みハッシュの比較では、可能な限り言語やフレームワークが提供する安全な比較関数を使います。独自実装が必要な場合は、サービス拒否を避ける最大入力長、型混同を避ける明示的な型設定、タイミング攻撃を避ける定数時間比較を満たします。

## パスワード変更と TLS

パスワード変更機能では、有効なセッションで認証済みであることを確認し、現在のパスワードを検証します。これにより、公共端末でログアウトを忘れた場合など、第三者が既存セッションを使ってパスワードを変更するリスクを下げます。

ログインページと認証後のすべてのページは、TLS または同等に強いトランスポートだけで提供します。ログインページが TLS で保護されていない場合、攻撃者がログインフォームの送信先を改ざんし、認証情報を任意の場所へ送信させる可能性があります。認証後ページが TLS で保護されていない場合、セッション ID が平文で見られ、認証済みセッションが侵害される可能性があります。

## 機密機能とリスクイベントでの再認証

パスワードやメールアドレスの変更、購入商品の配送先変更、支払い情報変更、信頼済みデバイス追加などの機密操作では、現在の認証情報または強い追加要素による再認証を要求します。再認証は、CSRF、XSS、セッションハイジャック、端末の一時的な不正利用による被害を緩和します。

リスクイベント後の再認証は、アカウントリカバリ、パスワードリセット、不審なログインパターン、IP アドレス変化、デバイス登録、重要操作などで発火させます。再認証方式には、リスクベース認証、MFA、チャレンジベース検証があります。実装では、ユーザー体験を過度に妨げず、位置情報、デバイス種別、過去の行動などの文脈に基づいて判断し、再認証後はセッション無効化やトークンローテーションを検討します。

## 強いトランザクション認証と TLS クライアント認証

一部のアプリケーションでは、ユーザーが機密操作を実行できるかを確認するために第二要素を使うべきです。支払い、送金、重要設定変更などでは、Transaction Authorization Cheat Sheet の考え方に従い、操作内容と認証を結び付けます。

TLS クライアント認証は、ブラウザとサーバーの双方が TLS ハンドシェイク中に証明書を提示する方式です。サーバーは、ユーザー専用に発行した証明書を検証し、その証明書の subject などからユーザーを判断できます。この方式は、単一の端末やブラウザからの利用が許容される場合、追加のセキュリティが必要な場合、企業内イントラネットなどで有効です。一方、一般消費者向けサイトには適さないことが多く、企業プロキシが TLS 復号を行う場合は証明書認証が壊れる可能性があります。

## 認証エラーメッセージ

認証機能のエラーメッセージを誤って実装すると、User ID やパスワードの列挙に使われます。ログイン、パスワードリセット、パスワードリカバリでは、ユーザー ID またはパスワードが誤っている、アカウントが存在しない、アカウントがロックまたは無効化されている、という場合でも一般化された応答を返します。アカウント作成機能でも、既存ユーザーの有無を漏らさないよう同じ考え方を適用します。

応答本文だけでなく、HTTP ステータスコード、エラー URL、処理時間も discrepancy factor になり得ます。たとえば、存在しないユーザーでは即時エラー、存在するユーザーではハッシュ計算後エラーになると、応答時間差でユーザー存在を推測できます。高重要度アプリケーションでは、失敗時に常に汎用メッセージとサポート導線を返すなど、列挙リスクを下げます。

## 自動攻撃対策

アカウント侵害を狙う自動攻撃には、単一アカウントへ多数のパスワードを試すブルートフォース、別サイト漏えいのユーザー名とパスワードの組み合わせを試すクレデンシャルスタッフィング、単一の弱いパスワードを多数アカウントへ試すパスワードスプレーがあります。防御は単独では完全ではないため、多層防御として組み合わせます。

MFA は、多くのパスワード関連攻撃に対する最も強い防御です。可能な限り導入しますが、対象ユーザーや利用環境によって強制が現実的でない場合もあります。

ログインスロットリングでは、通常の対話的なパスワード推測を防ぐため、最大試行回数を制御します。アカウントロックアウトは、一定回数の失敗後に一定期間ログイン試行を止めます。失敗カウンターは送信元 IP ではなくアカウント自体に関連付けます。ロックアウトしきい値、観測期間、ロックアウト期間のバランスを設計し、他ユーザーのアカウントを意図的にロックするサービス拒否に注意します。固定期間ではなく指数バックオフを使う場合もあります。

CAPTCHA は自動ログイン試行を遅くできますが、突破や外部代行が可能なため、予防策ではなく多層防御の一部として扱います。ユーザー体験のため、初回から常に要求するのではなく、一定回数の失敗後に要求する設計が考えられます。セキュリティ質問や記憶語は、どちらも「知っているもの」であるため MFA ではありません。予測しやすい回答になりやすいため、慎重に設計します。

## ログと監視

認証機能では、攻撃や失敗をリアルタイムに検知できるようログと監視を有効化します。すべての認証失敗、パスワード失敗、アカウントロックアウトを記録し、レビューします。監査ログには、パスワードやトークンなどの機密値を平文で記録しないようにします。

## パスワードを必要としない認証プロトコル

サードパーティアプリケーションやモバイルアプリなどが Web アプリケーションへ接続する場合、ユーザー名とパスワードをそのアプリケーションに保存させるのは安全ではありません。この場合、ユーザーのデータを攻撃者へ露出させないため、OAuth、OpenID Connect、SAML、FIDO などの認証・連携プロトコルを利用します。

OAuth 2.0/2.1 は API への委任アクセスのための認可フレームワークです。OpenID Connect (OIDC) は OAuth の上に構築されたアイデンティティ層で、クライアントが ID Token によりエンドユーザーの本人性を検証し、相互運用可能な方法でユーザー Claim を取得する方法を定義します。認証や SSO には OIDC を使い、API への認可には OAuth を使います。OIDC では issuer、audience、署名、有効期限を検証し、よく保守されたライブラリ、プロバイダ discovery、JWKS エンドポイントを利用します。OpenID 2.0 は OIDC とは別の古いプロトコルであり、新規システムで実装してはいけません。

SAML 2.0 は XML ベースのアイデンティティ連携方式で、企業向け SSO でよく使われます。FIDO/U2F/FIDO2/WebAuthn は公開鍵暗号に基づくチャレンジレスポンスモデルで、パスワードレス認証や強い第二要素に利用できます。Passkey は WebAuthn を基盤とし、デバイス PIN や生体認証などのローカルユーザー検証と組み合わせて利用されます。

## パスワードマネージャー

Web アプリケーションは、パスワードマネージャーの利用を妨げないようにします。ユーザー名とパスワード入力には標準 HTML フォームと適切な `type` 属性を使い、Flash や Silverlight などプラグインベースのログインページは避けます。少なくとも 64 文字の合理的な最大長を実装し、印字可能な文字を許可し、ユーザー名、パスワード、MFA フィールドへの貼り付けを許可し、Tab キーでフィールド間を移動できるようにします。

## 登録メールアドレス変更

登録メールアドレス変更では、現在の認証 Cookie またはトークンの妥当性を確認し、無効ならログインへ戻します。ユーザーに手順を説明し、新しいメールアドレスをシステムルールに従って入力させます。MFA が有効な場合は MFA で本人確認し、新しいメールアドレスを pending change として保存し、現在のアドレスへの通知と新しいアドレスへの確認リンクを送ります。MFA がない場合は現在のパスワードを要求し、現在のアドレスと新しいアドレスの双方で確認を要求します。管理者やヘルプデスクは、ソーシャルエンジニアリングに対する訓練を受け、定められた手順に従う必要があります。

## 適応型またはリスクベース認証

高度なアプリケーションでは、アクセス対象データの機密性、時刻、ユーザーの位置、IP アドレス、デバイスフィンガープリントなどの環境・文脈属性に応じて、異なる認証段階を要求できます。たとえば、初めて使うデバイスからのログインでは MFA を要求し、以降のログインでは要求しないことがあります。逆に、低リスク操作は既知デバイスだけで許可し、取引明細閲覧や送金ではより強い認証を要求する設計もあります。

実装時は、企業ポリシーや規制に沿っているか、どのユーザー属性・デバイス属性を監視するか、どの信号をセッション中に更新するか、信号の精度や欠損をどう扱うか、リスク階層へ変換するモデルをどう設計するか、各リスク階層に対するアクションをどう定義するかを明確にします。アクションには、許可、CAPTCHA、step-up MFA、ブロック、セッション失効などがあります。Web、モバイル、API クライアント間で一貫して判断を伝播し、中間セッション中のリスク上昇時にトークンや Cookie をどう変更・拡張・失効するかも決めます。

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

認証 (Authentication / AuthN) は、個人、エンティティ、Web サイトが主張どおりの主体であることを、パスワード、指紋、セキュリティトークンなどの認証器の妥当性を確認して検証するプロセスです。デジタルアイデンティティは、オンライン取引に参加する主体の一意な表現です。特定のデジタルサービス内では一意である必要がありますが、必ずしも現実世界の特定人物へ追跡可能である必要はありません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Digital Identity** is the unique representation of a subject engaged in an online transaction. A digital identity is always unique in the context of a digital service but does not necessarily need to be traceable back to a specific real-life subject.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Identity Proofing は、主体が実際に主張どおりの人物であることを確立するプロセスです。これは KYC の考え方と関連し、デジタルアイデンティティを現実の人物へ結び付けることを目的とします。セッション管理は、サーバーがやり取りしている主体の状態を維持するプロセスであり、以降のリクエストへどう応答するかを判断するために必要です。セッション識別子はユーザーごとに一意で、推測困難である必要があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Identity Proofing** establishes that a subject is actually who they claim to be. This concept is related to KYC concepts and it aims to bind a digital identity with a real person.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Session Management** is a process by which a server maintains the state of an entity interacting with it. This is required for a server to remember how to react to subsequent requests throughout a transaction. Sessions are maintained on the server by a session identifier which can be passed back and forth between the client and server when transmitting and receiving requests. Sessions should be unique per user and computationally very difficult to predict. The [Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html) contains further guidance on the best practices in this area.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Authentication General Guidelines

### User IDs

The primary function of a User ID is to uniquely identify a user within a system. Ideally, User IDs should be randomly generated to prevent the creation of predictable or sequential IDs, which could pose a security risk, especially in systems where User IDs might be exposed or inferred from external sources.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## ユーザー ID とユーザー名

User ID の主な役割は、システム内でユーザーを一意に識別することです。User ID が外部から露出または推測され得る場合、連番や予測可能な値はリスクになります。理想的にはランダムに生成します。

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

ユーザー名は、ログイン時にユーザーが自分を識別するために選ぶ覚えやすい識別子です。ユーザーが選んだユーザー名がシステム内の一意識別子としても機能する場合、User ID とユーザー名が同じ意味で使われることがあります。メールアドレスをユーザー名として使うことは、サインアップ時にメールアドレスを検証するなら許容できます。ユーザーには、メールアドレス以外のユーザー名を選べる選択肢も与えることが推奨されます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Users should be permitted to use their email address as a username, provided the email is verified during sign-up. Additionally, they should have the option to choose a username other than an email address. For information on validating email addresses, please visit the [input validation cheat sheet email discussion](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html#email-address-validation).

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Authentication Solution and Sensitive Accounts

- Do **NOT** allow login with sensitive accounts (i.e. accounts that can be used internally within the solution such as to a backend / middleware / database) to any front-end user interface
- Do **NOT** use the same authentication solution (e.g. IDP / AD) used internally for unsecured access (e.g., public access / DMZ)

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Implement Proper Password Strength Controls

A key concern when using passwords for authentication is password strength. A "strong" password policy makes it difficult or even improbable for one to guess the password through either manual or automated means. The following characteristics define a strong password:

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

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### For more detailed information check

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

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Store Passwords in a Secure Fashion

It is critical for an application to store a password using the right cryptographic technique. Please see [Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html) for details on this feature.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Compare Password Hashes Using Safe Functions

Where possible, the user-supplied password should be compared to the stored password hash using a secure password comparison function provided by the language or framework, such as the [password_verify()](https://www.php.net/manual/en/function.password-verify.php) function in PHP. Where this is not possible, ensure that the comparison function:

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Has a maximum input length, to protect against denial of service attacks with very long inputs.
- Explicitly sets the type of both variables, to protect against type confusion attacks such as Magic Hashes in PHP.
- Returns in constant time, to protect against timing attacks.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Change Password Feature

When developing a change password feature, ensure to have:

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- The user is authenticated with an active session.
- Current password verification. This is to ensure that it's the legitimate user who is changing the password. Consider this abuse case: a user logs in on a public computer and forgets to log out. Another person could then use that active session. If we don't verify the current password, this other person may be able to change the password.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Transmit Passwords Only Over TLS or Other Strong Transport

See: [Transport Layer Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html)

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The login page and all subsequent authenticated pages must be exclusively accessed over TLS or other strong transport. Failure to utilize TLS or other strong transport for the login page allows an attacker to modify the login form action, causing the user's credentials to be posted to an arbitrary location. Failure to utilize TLS or other strong transport for authenticated pages after login enables an attacker to view the unencrypted session ID and compromise the user's authenticated session.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Require Re-authentication for Sensitive Features

In order to mitigate CSRF and session hijacking, it's important to require the current credentials for an account before updating sensitive account information such as the user's password or email address -- or before sensitive transactions, such as shipping a purchase to a new address. Without this countermeasure, an attacker may be able to execute sensitive transactions through a CSRF or XSS attack without needing to know the user's current credentials. Additionally, an attacker may get temporary physical access to a user's browser or steal their session ID to take over the user's session.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Reauthentication After Risk Events

**Overview:**
Reauthentication is critical when an account has experienced high-risk activity such as account recovery, password resets, or suspicious behavior patterns. This section outlines when and how to trigger reauthentication to protect users and prevent unauthorized access. For further details, see the [Require Re-authentication for Sensitive Features](#require-re-authentication-for-sensitive-features) section.

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

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Consider Strong Transaction Authentication

Some applications should use a second factor to check whether a user may perform sensitive operations. For more information, see the [Transaction Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Transaction_Authorization_Cheat_Sheet.html).

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### TLS Client Authentication

TLS Client Authentication, also known as two-way TLS authentication, consists of both browser and server sending their respective TLS certificates during the TLS handshake process. Just as you can validate the authenticity of a server by using the certificate and asking a verifiably-valid Certificate Authority (CA) if the certificate is valid, the server can authenticate the user by receiving a certificate from the client and validating against a third-party CA or its own CA. To do this, the server must provide the user with a certificate generated specifically for him, assigning values to the subject so that these can be used to determine what user the certificate should validate. The user installs the certificate on a browser and now uses it for the website.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

This approach is appropriate when:

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

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

It is generally not a good idea to use this method for widely and publicly available websites that will have an average user. For example, it wouldn't be a good idea to implement this for a website like Facebook. While this technique can prevent the user from having to type a password (thus protecting against an average keylogger from stealing it), it is still considered a good idea to consider using both a password and TLS client authentication combined.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Additionally, if the client is behind an enterprise proxy that performs SSL/TLS decryption, this will break certificate authentication unless the site is allowed on the proxy.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

For more information, see: [Client-authenticated TLS handshake](https://en.wikipedia.org/wiki/Transport_Layer_Security#Client-authenticated_TLS_handshake)

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Authentication and Error Messages

Incorrectly implemented error messages in the case of authentication functionality can be used for the purposes of user ID and password enumeration. An application should respond (both HTTP and HTML) in a generic manner.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Authentication Responses

Using any of the authentication mechanisms (login, password reset, or password recovery), an application must respond with a generic error message regardless of whether:

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- The user ID or password was incorrect.
- The account does not exist.
- The account is locked or disabled.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The account registration feature should also be taken into consideration, and the same approach of a generic error message can be applied regarding the case in which the user exists.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The objective is to prevent the creation of a [discrepancy factor](https://cwe.mitre.org/data/definitions/204.html), allowing an attacker to mount a user enumeration action against the application.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

It is interesting to note that the business logic itself can bring a discrepancy factor related to the processing time taken. Indeed, depending on the implementation, the processing time can be significantly different according to the case (success vs failure) allowing an attacker to mount a [time-based attack](https://en.wikipedia.org/wiki/Timing_attack) (delta of some seconds for example).

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Example using pseudo-code for a login feature:

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- First implementation using the "quick exit" approach

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

## 認証ソリューションと機密アカウント

バックエンド、ミドルウェア、データベースなど内部で使う機密アカウントは、フロントエンドのユーザーインターフェースからログインできないようにします。また、内部利用の Identity Provider (IdP) や Active Directory などと同じ認証ソリューションを、公開アクセスや DMZ など安全でない経路の認証に使わないようにします。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>
### - Second implementation without relying on the "quick exit" approach


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

## パスワード強度管理

パスワード認証では、パスワード強度が重要です。強いパスワードポリシーは、手動または自動の推測を困難にします。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The problem with returning a generic error message for the user is a User Experience (UX) matter. A legitimate user might feel confused with the generic messages, thus making it hard for them to use the application, and might after several retries, leave the application because of its complexity. The decision to return a *generic error message* can be determined based on the criticality of the application and its data. For example, for critical applications, the team can decide that under the failure scenario, a user will always be redirected to the support page and a *generic error message* will be returned.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- 最小長を強制します。MFA が有効な場合、8 文字未満のパスワードは弱いとみなされます。MFA がない場合、15 文字未満のパスワードは弱いとみなされます。
- パスフレーズを許容するため、最大長は少なくとも 64 文字にします。ただし、非常に長いパスワードによるサービス拒否の可能性に注意します。
- パスワードを黙って切り詰めてはいけません。最大長を超えるパスワードの扱いは明示します。
- Unicode と空白を含むすべての文字を許可します。大文字、小文字、数字、特殊文字などの構成ルールを必須にしないことが推奨されます。
- パスワード漏えい、侵害の特定、認証器技術の変更時には認証情報をローテーションします。一方、任意の定期パスワード変更は避け、強いパスワードと MFA の利用を促します。
- パスワード強度メーターを提供し、ユーザーがより強いパスワードを選べるようにします。
- 一般的なパスワードや、過去に漏えいしたパスワードをブロックします。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Regarding the user enumeration itself, protection against [brute-force attacks](#protect-against-automated-attacks) is also effective because it prevents an attacker from applying the enumeration at scale. Usage of [CAPTCHA](https://en.wikipedia.org/wiki/CAPTCHA) can be applied to a feature for which a *generic error message* cannot be returned because the *user experience* must be preserved.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Incorrect and correct response examples

#### Login

Incorrect response examples:

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

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Correct response example:

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- "Login failed; Invalid user ID or password."

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

##### Password recovery

Incorrect response examples:

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- "We just sent you a password reset link."
- "This email address doesn't exist in our database."

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Correct response example:

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- "If that email address is in our database, we will send you an email to reset your password."

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

###### Account creation

Incorrect response examples:

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- "This user ID is already in use."
- "Welcome! You have signed up successfully."

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Correct response example:

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- "A link to activate your account has been emailed to the address provided."

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

##### Error Codes and URLs

The application may return a different [HTTP Error code](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) depending on the authentication attempt response. It may respond with a 200 for a positive result and a 403 for a negative result. Even though a generic error page is shown to a user, the HTTP response code may differ which can leak information about whether the account is valid or not.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Error disclosure can also be used as a discrepancy factor, consult the [error handling cheat sheet](https://cheatsheetseries.owasp.org/cheatsheets/Error_Handling_Cheat_Sheet.html) regarding the global handling of different errors in an application.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Protect Against Automated Attacks

There are a number of different types of automated attacks that attackers can use to try and compromise user accounts. The most common types are listed below:

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

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Different protection mechanisms can be implemented to protect against these attacks. In many cases, these defenses do not provide complete protection, but when a number of them are implemented in a defense-in-depth approach, a reasonable level of protection can be achieved.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The following sections will focus primarily on preventing brute-force attacks, although these controls can also be effective against other types of attacks. For further guidance on defending against credential stuffing and password spraying, see the [Credential Stuffing Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Credential_Stuffing_Prevention_Cheat_Sheet.html).

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Multi-Factor Authentication

Multi-factor authentication (MFA) is by far the best defense against the majority of password-related attacks, including brute-force attacks, with analysis by Microsoft suggesting that it would have stopped [99.9% of account compromises](https://techcommunity.microsoft.com/t5/Azure-Active-Directory-Identity/Your-Pa-word-doesn-t-matter/ba-p/731984). As such, it should be implemented wherever possible; however, depending on the audience of the application, it may not be practical or feasible to enforce the use of MFA.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The [Multifactor Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html) contains further guidance on implementing MFA.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Login Throttling

Login Throttling is a protocol used to prevent an attacker from making too many attempts at guessing a password through normal interactive means, it includes the following controls:

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Maximum number of attempts.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

##### Account Lockout

The most common protection against these attacks is to implement account lockout, which prevents any more login attempts for a period after a certain number of failed logins.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The counter of failed logins should be associated with the account itself, rather than the source IP address, in order to prevent an attacker from making login attempts from a large number of different IP addresses. There are a number of different factors that should be considered when implementing an account lockout policy in order to find a balance between security and usability:

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- The number of failed attempts before the account is locked out (lockout threshold).
- The time period that these attempts must occur within (observation window).
- How long the account is locked out for (lockout duration).

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Rather than implementing a fixed lockout duration (e.g., ten minutes), some applications use an exponential lockout, where the lockout duration starts as a very short period (e.g., one second), but doubles after each failed login attempt.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Amount of time to delay after each account lockout (max 2-3, after that permanent account lockout).

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

When designing an account lockout system, care must be taken to prevent it from being used to cause a denial of service by locking out other users' accounts. One way this could be performed is to allow the use of the forgotten password functionality to log in, even if the account is locked out.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### CAPTCHA

The use of an effective CAPTCHA can help to prevent automated login attempts against accounts. However, many CAPTCHA implementations have weaknesses that allow them to be solved using automated techniques or can be outsourced to services that can solve them. As such, the use of CAPTCHA should be viewed as a defense-in-depth control to make brute-force attacks more time-consuming and expensive, rather than as a preventative.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

It may be more user-friendly to only require a CAPTCHA be solved after a small number of failed login attempts, rather than requiring it from the very first login.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Security Questions and Memorable Words

The addition of a security question or memorable word can also help protect against automated attacks, especially when the user is asked to enter a number of randomly chosen characters from the word. It should be noted that this does **not** constitute multi-factor authentication, as both factors are the same (something you know). Furthermore, security questions are often weak and have predictable answers, so they must be carefully chosen. The [Choosing and Using Security Questions cheat sheet](https://cheatsheetseries.owasp.org/cheatsheets/Choosing_and_Using_Security_Questions_Cheat_Sheet.html) contains further guidance on this.

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

## パスワードリカバリ、保存、比較

パスワードを忘れたユーザーがアカウントへ復帰できる仕組みはよく使われますが、リカバリ機能は認証を迂回する経路になりやすいため、Forgot Password Cheat Sheet の管理策に従って実装します。

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

パスワード保存では適切な暗号学的手法を使います。パスワードを平文、可逆暗号、一般的な高速ハッシュだけで保存してはいけません。Password Storage Cheat Sheet を参照し、パスワードハッシュ、ソルト、ワークファクター、長い入力への扱いを設計します。

</div>
</div>

<div className="bilingualPair">

<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

ユーザーが入力したパスワードと保存済みハッシュの比較では、可能な限り言語やフレームワークが提供する安全な比較関数を使います。独自実装が必要な場合は、サービス拒否を避ける最大入力長、型混同を避ける明示的な型設定、タイミング攻撃を避ける定数時間比較を満たします。

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

## パスワード変更と TLS

パスワード変更機能では、有効なセッションで認証済みであることを確認し、現在のパスワードを検証します。これにより、公共端末でログアウトを忘れた場合など、第三者が既存セッションを使ってパスワードを変更するリスクを下げます。

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

ログインページと認証後のすべてのページは、TLS または同等に強いトランスポートだけで提供します。ログインページが TLS で保護されていない場合、攻撃者がログインフォームの送信先を改ざんし、認証情報を任意の場所へ送信させる可能性があります。認証後ページが TLS で保護されていない場合、セッション ID が平文で見られ、認証済みセッションが侵害される可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

> **Note:** OAuth 2.1 is an IETF Working Group draft that consolidates OAuth 2.0 and widely adopted best practices and is intended to replace RFC 6749/6750; guidance in this cheat sheet applies to both OAuth 2.0 and OAuth 2.1. References: [draft-ietf-oauth-v2-1-13](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-v2-1-13), [oauth.net/2.1](https://oauth.net/2.1/)

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### OpenID Connect (OIDC)

**OpenID Connect 1.0 (OIDC)** is an identity layer **on top of OAuth**. It defines how a client (**relying party**) verifies the **end user's** identity using an **ID Token** (a signed JWT) and how to obtain user claims in an interoperable way. Use **OIDC for authentication/SSO**; use **OAuth for authorization** to APIs.

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

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

> **Avoid confusion:** **OpenID 2.0 ("OpenID")** was a separate, legacy authentication protocol that has been **superseded by OpenID Connect** and is considered obsolete. New systems should not implement OpenID 2.0. References: [OpenID Foundation — obsolete OpenID 2.0 libraries](https://openid.net/developers/libraries-for-obsolete-specifications/), [OpenID 2.0 → OIDC migration](https://openid.net/specs/openid-connect-migration-1_0.html)

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### SAML

Security Assertion Markup Language (SAML) is often considered to compete with OpenId. The most recommended version is 2.0 since it is very feature-complete and provides strong security. Like OpenId, SAML uses identity providers, but unlike OpenId, it is XML-based and provides more flexibility. SAML is based on browser redirects which send XML data. Furthermore, SAML isn't only initiated by a service provider; it can also be initiated from the identity provider. This allows the user to navigate through different portals while still being authenticated without having to do anything, making the process transparent.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

While OpenId has taken most of the consumer market, SAML is often the choice for enterprise applications because there are few OpenId identity providers which are considered enterprise-class (meaning that the way they validate the user identity doesn't have high standards required for enterprise identity). It is more common to see SAML being used inside of intranet websites, sometimes even using a server from the intranet as the identity provider.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

In the past few years, applications like SAP ERP and SharePoint (SharePoint by using Active Directory Federation Services 2.0) have decided to use SAML 2.0 authentication as an often preferred method for single sign-on implementations whenever enterprise federation is required for web services and web applications.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**See also: [SAML Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/SAML_Security_Cheat_Sheet.html)**

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### FIDO

The Fast Identity Online (FIDO) Alliance has created two protocols to facilitate online authentication: the Universal Authentication Framework (UAF) protocol and the Universal Second Factor (U2F) protocol. While UAF focuses on passwordless authentication, U2F allows the addition of a second factor to existing password-based authentication. Both protocols are based on a public key cryptography challenge-response model.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

UAF takes advantage of existing security technologies present on devices for authentication including fingerprint sensors, cameras (face biometrics), microphones (voice biometrics), Trusted Execution Environments (TEEs), Secure Elements (SEs), and others. The protocol is designed to plug these device capabilities into a common authentication framework. UAF works with both native applications and web applications.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

U2F augments password-based authentication using a hardware token (typically USB) that stores cryptographic authentication keys and uses them for signing. The user can use the same token as a second factor for multiple applications. U2F works with web applications. It provides **protection against phishing** by using the URL of the website to look up the stored authentication key.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**FIDO2**: FIDO2 and WebAuthn, encompassing previous standards (UAF/U2F), form the foundation of modern **Passkeys** technology. Passkeys enable users to securely log in using local user verification (such as biometrics or device PINs) and often supporting cloud synchronization across devices. This technology is widely supported by major platforms. (Windows Hello/Mac Touch ID)

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

## 機密機能とリスクイベントでの再認証

パスワードやメールアドレスの変更、購入商品の配送先変更、支払い情報変更、信頼済みデバイス追加などの機密操作では、現在の認証情報または強い追加要素による再認証を要求します。再認証は、CSRF、XSS、セッションハイジャック、端末の一時的な不正利用による被害を緩和します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Web applications should not make the job of password managers more difficult than necessary by observing the following recommendations:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

リスクイベント後の再認証は、アカウントリカバリ、パスワードリセット、不審なログインパターン、IP アドレス変化、デバイス登録、重要操作などで発火させます。再認証方式には、リスクベース認証、MFA、チャレンジベース検証があります。実装では、ユーザー体験を過度に妨げず、位置情報、デバイス種別、過去の行動などの文脈に基づいて判断し、再認証後はセッション無効化やトークンローテーションを検討します。

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

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Changing A User's Registered Email Address

User email addresses often change. The following process is recommended to handle such situations in a system:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 強いトランザクション認証と TLS クライアント認証

一部のアプリケーションでは、ユーザーが機密操作を実行できるかを確認するために第二要素を使うべきです。支払い、送金、重要設定変更などでは、Transaction Authorization Cheat Sheet の考え方に従い、操作内容と認証を結び付けます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

*Note: The process is less stringent with [Multifactor Authentication](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html), as proof-of-identity is stronger than relying solely on a password.*

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

TLS クライアント認証は、ブラウザとサーバーの双方が TLS ハンドシェイク中に証明書を提示する方式です。サーバーは、ユーザー専用に発行した証明書を検証し、その証明書の subject などからユーザーを判断できます。この方式は、単一の端末やブラウザからの利用が許容される場合、追加のセキュリティが必要な場合、企業内イントラネットなどで有効です。一方、一般消費者向けサイトには適さないことが多く、企業プロキシが TLS 復号を行う場合は証明書認証が壊れる可能性があります。

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

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Notes on the Above Processes

- It's worth noting that Google adopts a different approach with accounts secured only by a password -- [where the current email address receives a notification-only email](https://support.google.com/accounts/answer/55393?hl=en). This method carries risks and requires user vigilance.

- Regular social engineering training is crucial. System administrators and help desk staff should be trained to follow the prescribed process and recognize and respond to social engineering attacks. Refer to [CISA's "Avoiding Social Engineering and Phishing Attacks"](https://www.cisa.gov/news-events/news/avoiding-social-engineering-and-phishing-attacks) for guidance.

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

## 認証エラーメッセージ

認証機能のエラーメッセージを誤って実装すると、User ID やパスワードの列挙に使われます。ログイン、パスワードリセット、パスワードリカバリでは、ユーザー ID またはパスワードが誤っている、アカウントが存在しない、アカウントがロックまたは無効化されている、という場合でも一般化された応答を返します。アカウント作成機能でも、既存ユーザーの有無を漏らさないよう同じ考え方を適用します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

For example, an application may require MFA for the first login from a particular device but not for subsequent logins from that device. Alternatively, a single sign-on solution may authenticate the user and allow them to remain logged in for a day but require a reauthentication if they try to access their profile page.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

応答本文だけでなく、HTTP ステータスコード、エラー URL、処理時間も discrepancy factor になり得ます。たとえば、存在しないユーザーでは即時エラー、存在するユーザーではハッシュ計算後エラーになると、応答時間差でユーザー存在を推測できます。高重要度アプリケーションでは、失敗時に常に汎用メッセージとサポート導線を返すなど、列挙リスクを下げます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Another option is the opposite approach where an application allows low risk access with just something that identifies the device (e.g., a specific mobile device fingerprint, a persistent cookie and browser fingerprint, etc. from the previous IP address) and then gradually requires stronger authentication for more sensitive operations. An example might be to allow someone to trigger something to see their current bank balance, but not the account number or anything else. If they need to see transactions, then the application puts them through some base level authentication and if they want to do any money movement, then MFA is required.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Questions that should be considered when implementing a mechanism like this include:

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

</div>

<div className="bilingualPair">

<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 自動攻撃対策

アカウント侵害を狙う自動攻撃には、単一アカウントへ多数のパスワードを試すブルートフォース、別サイト漏えいのユーザー名とパスワードの組み合わせを試すクレデンシャルスタッフィング、単一の弱いパスワードを多数アカウントへ試すパスワードスプレーがあります。防御は単独では完全ではないため、多層防御として組み合わせます。

</div>
</div>

<div className="bilingualPair">

<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

MFA は、多くのパスワード関連攻撃に対する最も強い防御です。可能な限り導入しますが、対象ユーザーや利用環境によって強制が現実的でない場合もあります。

</div>
</div>

<div className="bilingualPair">

<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

ログインスロットリングでは、通常の対話的なパスワード推測を防ぐため、最大試行回数を制御します。アカウントロックアウトは、一定回数の失敗後に一定期間ログイン試行を止めます。失敗カウンターは送信元 IP ではなくアカウント自体に関連付けます。ロックアウトしきい値、観測期間、ロックアウト期間のバランスを設計し、他ユーザーのアカウントを意図的にロックするサービス拒否に注意します。固定期間ではなく指数バックオフを使う場合もあります。

</div>
</div>

<div className="bilingualPair">

<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

CAPTCHA は自動ログイン試行を遅くできますが、突破や外部代行が可能なため、予防策ではなく多層防御の一部として扱います。ユーザー体験のため、初回から常に要求するのではなく、一定回数の失敗後に要求する設計が考えられます。セキュリティ質問や記憶語は、どちらも「知っているもの」であるため MFA ではありません。予測しやすい回答になりやすいため、慎重に設計します。

</div>
</div>

<div className="bilingualPair">

<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## ログと監視

認証機能では、攻撃や失敗をリアルタイムに検知できるようログと監視を有効化します。すべての認証失敗、パスワード失敗、アカウントロックアウトを記録し、レビューします。監査ログには、パスワードやトークンなどの機密値を平文で記録しないようにします。

</div>
</div>

<div className="bilingualPair">

<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## パスワードを必要としない認証プロトコル

サードパーティアプリケーションやモバイルアプリなどが Web アプリケーションへ接続する場合、ユーザー名とパスワードをそのアプリケーションに保存させるのは安全ではありません。この場合、ユーザーのデータを攻撃者へ露出させないため、OAuth、OpenID Connect、SAML、FIDO などの認証・連携プロトコルを利用します。

</div>
</div>

<div className="bilingualPair">

<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

OAuth 2.0/2.1 は API への委任アクセスのための認可フレームワークです。OpenID Connect (OIDC) は OAuth の上に構築されたアイデンティティ層で、クライアントが ID Token によりエンドユーザーの本人性を検証し、相互運用可能な方法でユーザー Claim を取得する方法を定義します。認証や SSO には OIDC を使い、API への認可には OAuth を使います。OIDC では issuer、audience、署名、有効期限を検証し、よく保守されたライブラリ、プロバイダ discovery、JWKS エンドポイントを利用します。OpenID 2.0 は OIDC とは別の古いプロトコルであり、新規システムで実装してはいけません。

</div>
</div>

<div className="bilingualPair">

<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

SAML 2.0 は XML ベースのアイデンティティ連携方式で、企業向け SSO でよく使われます。FIDO/U2F/FIDO2/WebAuthn は公開鍵暗号に基づくチャレンジレスポンスモデルで、パスワードレス認証や強い第二要素に利用できます。Passkey は WebAuthn を基盤とし、デバイス PIN や生体認証などのローカルユーザー検証と組み合わせて利用されます。

</div>
</div>

<div className="bilingualPair">

<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## パスワードマネージャー

Web アプリケーションは、パスワードマネージャーの利用を妨げないようにします。ユーザー名とパスワード入力には標準 HTML フォームと適切な `type` 属性を使い、Flash や Silverlight などプラグインベースのログインページは避けます。少なくとも 64 文字の合理的な最大長を実装し、印字可能な文字を許可し、ユーザー名、パスワード、MFA フィールドへの貼り付けを許可し、Tab キーでフィールド間を移動できるようにします。

</div>
</div>

<div className="bilingualPair">

<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 登録メールアドレス変更

登録メールアドレス変更では、現在の認証 Cookie またはトークンの妥当性を確認し、無効ならログインへ戻します。ユーザーに手順を説明し、新しいメールアドレスをシステムルールに従って入力させます。MFA が有効な場合は MFA で本人確認し、新しいメールアドレスを pending change として保存し、現在のアドレスへの通知と新しいアドレスへの確認リンクを送ります。MFA がない場合は現在のパスワードを要求し、現在のアドレスと新しいアドレスの双方で確認を要求します。管理者やヘルプデスクは、ソーシャルエンジニアリングに対する訓練を受け、定められた手順に従う必要があります。

</div>
</div>

<div className="bilingualPair">

<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 適応型またはリスクベース認証

高度なアプリケーションでは、アクセス対象データの機密性、時刻、ユーザーの位置、IP アドレス、デバイスフィンガープリントなどの環境・文脈属性に応じて、異なる認証段階を要求できます。たとえば、初めて使うデバイスからのログインでは MFA を要求し、以降のログインでは要求しないことがあります。逆に、低リスク操作は既知デバイスだけで許可し、取引明細閲覧や送金ではより強い認証を要求する設計もあります。

</div>
</div>

<div className="bilingualPair">

<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

実装時は、企業ポリシーや規制に沿っているか、どのユーザー属性・デバイス属性を監視するか、どの信号をセッション中に更新するか、信号の精度や欠損をどう扱うか、リスク階層へ変換するモデルをどう設計するか、各リスク階層に対するアクションをどう定義するかを明確にします。アクションには、許可、CAPTCHA、step-up MFA、ブロック、セッション失効などがあります。Web、モバイル、API クライアント間で一貫して判断を伝播し、中間セッション中のリスク上昇時にトークンや Cookie をどう変更・拡張・失効するかも決めます。

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
