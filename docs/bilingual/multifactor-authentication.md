---
title: Multifactor Authentication Cheat Sheet
hide_title: true
---

<div className="docHero" data-category="authentication">
  <h1>多要素認証チートシート</h1>
  <div className="docMeta">
    <span className="docPill">最終更新: 2026-05-21</span>
    <span className="docPill">読了時間: 約 12 分</span>
    <span className="docPill">カテゴリ: 認証</span>
  </div>
</div>

<div className="tabbedContent">
  <input className="tabInput" type="radio" name="multifactor-authentication-view" id="multifactor-authentication-original" />
  <input className="tabInput" type="radio" name="multifactor-authentication-view" id="multifactor-authentication-translation" defaultChecked />
  <input className="tabInput" type="radio" name="multifactor-authentication-view" id="multifactor-authentication-bilingual" />

  <div className="contentTabs">
    <label htmlFor="multifactor-authentication-original" title="OWASP 原文">原文</label>
    <label htmlFor="multifactor-authentication-translation" title="日本語訳">翻訳</label>
    <label htmlFor="multifactor-authentication-bilingual" title="原文と翻訳を並べて確認">対比表示</label>
  </div>

<section id="multifactor-authentication-original-panel" className="tabPanel originalPanel contentPanel">

## Introduction

Multifactor Authentication (MFA) or Two-Factor Authentication (2FA) is when a user is required to present more than one type of evidence in order to authenticate on a system. There are five different types of evidence (or factors) and any combination of these can be used, however in practice only the first three are common in web applications. The five types are as follows:

| Factor | Examples |
|--------|----------|
| [Something You Know](#something-you-know) | [Passwords and PINs](#passwords-and-pins), [Security Questions](#security-questions) |
| [Something You Have](#something-you-have) | [OTP Tokens](#one-time-password-tokens), [U2F Tokens](#universal-second-factor), [Certificates](#certificates),[Smart Cards](#smart-cards), [Email](#email), [SMS and Phone Calls](#sms-messages-and-phone-calls) |
| [Something You Are](#something-you-are) | [Fingerprints, Facial Recognition, Iris Scans](#biometrics) |
| [Somewhere You Are](#somewhere-you-are) | [Source IP Address](#source-ip-address), [Geolocation](#geolocation), [Geofencing](#geofencing) |
| [Something You Do](#something-you-do) | [Behavioral Profiling](#behavioral-profiling), [Keystroke & Mouse Dynamics](#keystroke--mouse-dynamics), [Gait Analysis](#gait-analysis) |

It should be noted that requiring multiple instances of the same authentication factor (such as needing both a password and a PIN) **does not constitute MFA** and offers minimal additional security. The factors used should be independent of each other and should not be able to be compromised by the same attack. While the following sections discuss the disadvantage and weaknesses of various different types of MFA, in many cases these are only relevant against targeted attacks. **Any MFA is better than no MFA**.

## Advantages

The most common way that user accounts get compromised on applications is through weak, re-used or stolen passwords. Despite any technical security controls implemented on the application, users are liable to choose weak passwords, or to use the same password on different applications. As developers or system administrators, it should be assumed that users' passwords will be compromised at some point, and the system should be designed in order to defend against this.

MFA is by far the best defense against the majority of password-related attacks, including brute-force, [credential stuffing](https://cheatsheetseries.owasp.org/cheatsheets/Credential_Stuffing_Prevention_Cheat_Sheet.html) and password spraying, with analysis by Microsoft suggesting that it would have stopped [99.9% of account compromises](https://techcommunity.microsoft.com/t5/Azure-Active-Directory-Identity/Your-Pa-word-doesn-t-matter/ba-p/731984).

## Disadvantages

The biggest disadvantage of MFA is the increase in management complexity for both administrators and end users. Many less technical users may find it difficult to configure and use MFA. Additionally, there are a number of other common issues encountered:

- Types of MFA that require users to have specific hardware can introduce significant costs and administrative overheads.
- Users may become locked out of their accounts if they lose or are unable to use their other factors.
- MFA introduces additional complexity into the application.
- Many MFA solutions add external dependencies to systems, which can introduce security vulnerabilities or single points of failure.
- Processes implemented to allow users to bypass or reset MFA may be exploitable by attackers.
- Requiring MFA may prevent some users from accessing the application.

## Quick Recommendations

Exactly when and how MFA is implemented in an application will vary on a number of different factors, including the threat model of the application, the technical level of the users, and the level of administrative control over the users. These need to be considered on a per-application basis.

However, the following recommendations are generally appropriate for most applications, and provide an initial starting point to consider.

- Require some form of MFA for all users.
- Provide the option for users to enable MFA on their accounts using [TOTP](#software-otp-tokens).
- Require MFA for administrative or other high privileged users.
- Implement a secure procedure to allow users to reset their MFA.
- Consider [MFA as a service](#consider-using-a-third-party-service).

## Implementing MFA

MFA is a critical security control, and is recommended for all applications. The following sections provide guidance on how to implement MFA, and the considerations that should be taken into account.

### Regulatory and Compliance Requirements

Many industries and countries have regulations that require the use of MFA. This is particularly common in the finance and healthcare sectors, and is often required in order to comply with the General Data Protection Regulation (GDPR) in the European Union. It is important to consider these requirements when implementing MFA.

### When to Require MFA

The most important place to require MFA on an application is when the user logs in. However, depending on the functionality available, it may also be appropriate to require MFA for performing sensitive actions, such as:

- Changing passwords or security questions.
- Changing the email address associated with the account.
- Disabling MFA.
- Elevating a user session to an administrative session.

If the application provides multiple ways for a user to authenticate these should all require MFA, or have other protections implemented. A common area that is missed is if the application provides a separate API that can be used to login, or has an associated mobile application.

### One-Time Password (OTP) Handling and Storage

OTPs are authentication secrets and should be handled with password-like hygiene. While their security traits differ from long-lived passwords, improper handling can still lead to user account compromise.

At a minimum, OTP implementations SHOULD:

- Enforce a short time-to-live (TTL)
- Ensure OTPs are single use
- Apply strict attempt limits
- Invalidate the OTP on successful verification

OTP implementations SHOULD NOT:

- Log OTP values
- Store OTPs in long-term plaintext form

To further reduce risk and limit exposure, it is RECOMMENDED to:

- Generate OTPs using a cryptographically secure random number generator
- Consider 8-digit or longer codes where usability allows
- On "resend", generate a new OTP and overwrite the old record

#### Hashing OTPs

Hashing OTPs is still recommended, but for different reasons than password hashing. OTPs typically have a very small keyspace (for example, ~1 million possibilities for a 6-digit code), which means a database attacker can brute-force any OTP hash quickly.

As a result, hashing OTPs does not provide strong offline attack resistance in the way password hashing does.

However, hashing remains useful to:

- Prevent accidental disclosure via logs, metrics, or debugging tools
- Reduce blast radius if the database is briefly exposed during the OTP’s validity window
- Enforce good secret-handling discipline and avoid plaintext storage by default

The goal is short-term exposure protection, not long-term cryptographic secrecy.

### Improving User Experience

#### Risk Based Authentication

Having to frequently login with MFA creates an additional burden for users, and may cause them to disable MFA on the application. Risk based authentication can be used to reduce the frequency of MFA prompts, by only requiring MFA when the user is performing an action that is considered to be high risk. Some examples of this include:

- Requiring MFA when the user logs in from a new device or location.
- Requiring MFA when the user logs in from a location that is considered to be high risk.
- Allowing corporate IP ranges (or using [geolocation](#geolocation) as an additional factor).

#### Passkeys

[Passkeys](https://passkeys.dev/) based on the FIDO2 standard are a new form of MFA that combines characteristics of [possession-based](#something-you-have) and either [knowledge-based](#something-you-know) or [inherence-based](#something-you-are) authentication. The user is required to have a physical device (such as a mobile phone) and to enter a [PIN](#passwords-and-pins) or use [biometric authentication](#biometrics) in order to authenticate. The user's device then generates a cryptographic key that is used to authenticate with the server. This is a very secure form of MFA and is resistant to phishing attacks while also being frictionless for the user.

### Failed Login Attempts

When a user enters their password, but fails to authenticate using a second factor, this could mean one of two things:

- The user has lost their second factor, or doesn't have it available (for example, they don't have their mobile phone, or have no signal).
- The user's password has been compromised.

There are a number of steps that should be taken when this occurs:

- Prompt the user to try another form of MFA.
- Allow the user to attempt to [reset their MFA](#resetting-mfa).
- Notify the user of the failed login attempt, and encourage them to change their password if they don't recognize it.
    - The notification should include the time, browser and geographic location of the login attempt.
    - This should be displayed next time they login, and optionally emailed to them as well.

### Resetting MFA

One of the biggest challenges with implementing MFA is handling users who forget or lose their additional factors. There are many ways this could happen, such as:

- Re-installing a workstation without backing up digital certificates.
- Wiping or losing a phone without backing up OTP codes.
- Changing mobile numbers.

In order to prevent users from being locked out of the application, there needs to be a mechanism for them to regain access to their account if they can't use their existing MFA; however it is also crucial that this doesn't provide an attacker with a way to bypass MFA and hijack their account.

There is no definitive "best way" to do this, and what is appropriate will vary hugely based on the security of the application, and also the level of control over the users. Solutions that work for a corporate application where all the staff know each other are unlikely to be feasible for a publicly available application with thousands of users all over the world. Every recovery method has its own advantages and disadvantages, and these need to be evaluated in the context of the application.

Some suggestions of possible methods include:

- Providing the user with a number of single-use recovery codes when they first setup MFA.
- Requiring the user to setup multiple types of MFA (such as a digital certificate, OTP core and phone number for SMS), so that they are unlikely to lose access to all of them at once.
- Mailing a one-use recovery code (or new hardware token) to the user's registered address.
- Requiring the user contact the support team and having a rigorous process in place to verify their identity.
- Requiring another trusted user to vouch for them.

### Changing MFA Factors

Users may need to update their authentication factors, such as changing a phone number, migrating to a new authenticator app, or replacing a lost hardware token. Because attackers can exploit this process to take over accounts, it must be strictly secured.

Best practices include:

- Require reauthentication with an existing enrolled factor before allowing changes.
- Do not rely solely on the active session, as it may be hijacked.
- Treat factor replacement as a high-risk action and apply risk-based checks (e.g., new device, unusual location).
- Notify the user through out-of-band channels (such as email or push notification) whenever an MFA factor is changed.
- Consider applying delays or step-up verification for high-value accounts.

This ensures that even if a session is compromised, attackers cannot silently replace the user’s MFA factors and lock the legitimate user out.

### Consider Using a Third Party Service

There are a number of third party services that provide MFA as a service. These can be a good option for applications that don't have the resources to implement MFA themselves, or for applications that require a high level of assurance in their MFA. However, it is important to consider the security of the third party service, and the implications of using it. For example, if the third party service is compromised, it could allow an attacker to bypass MFA on all of the applications that use it.

## Something You Know

Knowledge-based, the most common type of authentication is based on something the users knows - typically a password. The biggest advantage of this factor is that it has very low requirements for both the developers and the end user, as it does not require any special hardware, or integration with other services.

### Passwords and PINs

Passwords and PINs are the most common form of authentication due to the simplicity of implementing them. The [Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#implement-proper-password-strength-controls) has guidance on how to implement a strong password policy, and the [Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html) has guidance on how to securely store passwords. Most multifactor authentication systems make use of a password, as well as at least one other factor.

#### Pros

- Simple and well understood.
- Native support in every authentication framework.
- Easy to implement.

#### Cons

- Users are prone to choosing weak passwords.
- Passwords are commonly re-used between systems.
- Susceptible to phishing.

### Security Questions

**Security questions are no longer recognized as an acceptable authentication factor** per [NIST SP 800-63](https://pages.nist.gov/800-63-3/sp800-63b.html). Account recovery is just an alternate way to authenticate so it should be no weaker than regular authentication.

#### Pros

- None that are not also present in passwords.

#### Cons

- No longer recognized as an acceptable authentication factor.
- Questions often have easily guessable answers.
- Answers to questions can often be obtained from social media or other sources.
- Questions must be carefully chosen so that users will remember answers years later.
- Susceptible to phishing.

## Something You Have

Possession-based authentication is based on the user having a physical or digital item that is required to authenticate. This is the most common form of MFA, and is often used in conjunction with passwords. The most common types of possession-based authentication are hardware and software tokens, and digital certificates. If properly implemented then this can be significantly more difficult for a remote attacker to compromise; however it also creates an additional administrative burden on the user, as they must keep the authentication factor with them whenever they wish to use it.

### One-Time Password Tokens

One-Time Password (OTP) tokens are a form of possession-based authentication, where the user is required to submit a constantly changing numeric code in order to authenticate. The most common of which is Time-based One-Time Password (TOTP) tokens, which can be both hardware and software based.

#### Hardware OTP Tokens

Hardware OTP Tokens generate a constantly changing numeric codes, which must be submitted when authenticating. Most well-known of these is the [RSA SecureID](https://en.wikipedia.org/wiki/RSA_SecurID), which generates a six digit number that changes every 60 seconds.

##### Pros

- As the tokens are separate physical devices, they are almost impossible for an attacker to compromise remotely.
- Tokens can be used without requiring the user to have a mobile phone or other device.

##### Cons

- Deploying physical tokens to users is expensive and complicated.
- If a user loses their token it could take a significant amount of time to purchase and ship them a new one.
- Some implementations require a backend server, which can introduce new vulnerabilities as well as a single point of failure.
- Stolen tokens can be used without a PIN or device unlock code.
- Susceptible to phishing (although short-lived).

#### Software OTP Tokens

A cheaper and easier alternative to hardware tokens is using software to generate Time-based One-Time Password (TOTP) codes. This would typically involve the user installing a TOTP application on their mobile phone, and then scanning a QR code provided by the web application which provides the initial seed. The authenticator app then generates a six digit number every 60 seconds, in much the same way as a hardware token.

Most websites use standardized TOTP tokens, allowing the user to install any authenticator app that supports TOTP. However, a small number of applications use their own variants of this (such as Symantec), which requires the users to install a specific app in order to use the service. This should be avoided in favour of a standards-based approach.

##### Pros

- The absence of physical tokens greatly reduces the cost and administrative overhead of implementing the system.
- When users lose access to their TOTP app, a new one can be configured without needing to ship a physical token to them.
- TOTP is widely used, and many users will already have at least one TOTP app installed.
- As long as the user has a screen lock on their phone, an attacker will be unable to use the code if they steal the phone.

##### Cons

- TOTP apps are usually installed on mobile devices, which are vulnerable to compromise.
- The TOTP app may be installed on the same mobile device (or workstation) that is used to authenticate.
- Users may store the backup seeds insecurely.
- Not all users have mobile devices to use with TOTP.
- If the user's mobile device is lost, stolen or out of battery, they will be unable to authenticate.
- Susceptible to phishing (although short-lived).

### Universal Second Factor

Hardware U2F tokens

Universal Second Factor (U2F) is a standard for USB/NFC hardware tokens that  implement challenge-response based authentication, rather than requiring the user to manually enter the code. This would typically be done by the user pressing a button on the token, or tapping it against their NFC reader. The most common U2F token is the [YubiKey](https://www.yubico.com/products/yubikey-hardware/).

#### Pros

- U2F tokens are resistant to phishing since the private key never leaves the token.
- Users can simply press a button rather than typing in a code.
- As the tokens are separate physical devices, they are almost impossible for an attacker to compromise remotely.
- U2F is natively supported by a number of major web browsers.
- U2F tokens can be used without requiring the user to have a mobile phone or other device.

#### Cons

- As with hardware OTP tokens, the use of physical tokens introduces significant costs and administrative overheads.
- Stolen tokens can be used without a PIN or device unlock code.
- As the tokens are usually connected to the workstation via USB, users are more likely to forget them.

### Certificates

Digital certificates are files that are stored on the user's device which are automatically provided alongside the user's password when authenticating. The most common type is X.509 certificates more commonly known as [client certificates](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html#client-certificates-and-mutual-tls). Certificates are supported by all major web browsers, and once installed require no further interaction from the user. The certificates should be linked to an individual's user account in order to prevent users from trying to authenticate against other accounts.

#### Pros

- There is no need to purchase and manage hardware tokens.
- Once installed, certificates are very simple for users.
- Certificates can be centrally managed and revoked.
- Resistant to phishing.

#### Cons

- Using digital certificates requires a backend Private Key Infrastructure (PKI).
- Installing certificates can be difficult for users, particularly in a highly restricted environment.
- Enterprise proxy servers which perform SSL decryption will prevent the use of certificates.
- The certificates are stored on the user's workstation, and as such can be stolen if their system is compromised.

### Smart Cards

Smartcards are credit-card size cards with a chip containing a digital certificate for the user, which is unlocked with a PIN. They are commonly used for operating system authentication, but are rarely used in web applications.

#### Pros

- Stolen smartcards cannot be used without the PIN.
- Smartcards can be used across multiple applications and systems.
- Resistant to phishing.

#### Cons

- Managing and distributing smartcards has the same costs and overheads as hardware tokens.
- Smartcards are not natively supported by modern browsers, so require third party software.
- Although most business-class laptops have smartcard readers built-in, home systems often do not.
- The use of smartcards requires backend PKIs.

### SMS Messages and Phone Calls

> [!WARNING]
> NIST SP 800-63B-4 designates SMS and PSTN-delivered codes as a *restricted* authenticator because of SS7 interception, SIM-swap, and number-porting attacks. Do not use SMS for high-value or PII-handling applications. Where it is the only available factor, document the risk acceptance, enforce per-account rate limits, monitor for SIM-swap signals, and plan migration to TOTP, push notifications, or WebAuthn/FIDO2.

SMS messages or phone calls can be used to provide users with a single-use code that they must submit as an additional factor. Due to the risks posed by these methods, they should not be used to protect applications that hold Personally Identifiable Information (PII) or where there is financial risk. e.g. healthcare and banking. [NIST SP 800-63B](https://pages.nist.gov/800-63-3/sp800-63b.html) classifies these as restricted authenticators and discourages their use for applications containing PII.

#### Pros

- Relatively simple to implement.
- Requires user to link their account to a mobile number.

#### Cons

- Requires the user to have a mobile device or landline.
- Require user to have signal or internet access to receive the call or message.
- Calls and SMS messages may cost money to send need to protect against attackers requesting a large number of messages to exhaust funds.
- Susceptible to SIM swapping attacks.
- SMS messages may be received on the same device the user is authenticating from.
- Susceptible to phishing.
- SMS may be previewed when the device is locked.
- SMS may be read by malicious or insecure applications.

### Email

Email verification requires that the user enters a code or clicks a link sent to their email address. There is some debate as to whether email constitutes a form of MFA, because if the user does not have MFA configured on their email account, it simply requires knowledge of the user's email password (which is often the same as their application password). However, it is included here for completeness.

#### Pros

- Very easy to implement.
- No requirements for separate hardware or a mobile device.

#### Cons

- Relies entirely on the security of the email account, which often lacks MFA.
- Email passwords are commonly the same as application passwords.
- Provides no protection if the user's email is compromised first.
- Email may be received by the same device the user is authenticating from.
- Susceptible to phishing.

## Something You Are

Inherence-based authentication is based on the physical attributes of the user. This is less common for web applications as it requires the user to have specific hardware, and is often considered to be the most invasive in terms of privacy. However, it is commonly used for operating system authentication, and is also used in some mobile applications.

### Biometrics

The are a number of common types of biometrics that are used, including:

- Fingerprint scans
- Facial recognition
- Iris scans
- Voice recognition

#### Pros

- Well-implemented biometrics are hard to spoof, and require a targeted attack.
- Fast and convenient for users.

#### Cons

- Manual enrollment is required for the user.
- Custom (sometimes expensive) hardware is often required to read biometrics.
- Privacy concerns: Sensitive physical information must be stored about users.
- If compromised, biometric data can be difficult to change.
- Hardware may be vulnerable to additional attack vectors.

## Somewhere You Are

Location-based authentication is based on the user's physical location. It is sometimes argued that location is used when deciding whether or not to require MFA (as discussed [above](#when-to-require-mfa)) however this is effectively the same as considering it to be a factor in its own right. Two prominent examples of this are the [Conditional Access Policies](https://docs.microsoft.com/en-us/azure/active-directory/conditional-access/overview) available in Microsoft Azure, and the [Network Unlock](https://docs.microsoft.com/en-us/windows/security/information-protection/bitlocker/bitlocker-how-to-enable-network-unlock) functionality in BitLocker.

### Source IP Address

The source IP address the user is connecting from can be used as a factor, typically in an allow-list based approach. This could either be based on a static list (such as corporate office ranges) or a dynamic list (such as previous IP addresses the user has authenticated from).

#### Pros

- Very easy for users.
- Requires minimal configuration and management from administrative staff.

#### Cons

- Doesn't provide any protection if the user's system is compromised.
- Doesn't provide any protection against rogue insiders.
- Trusted IP addresses must be carefully restricted (for example, if the open guest Wi-Fi uses the main corporate IP range).

### Geolocation

Rather than using the exact IP address of the user, the geographic location that the IP address is registered to can be used. This is less precise, but may be more feasible to implement in environments where IP addresses are not static. A common usage would be to require additional authentication factors when an authentication attempt is made from outside of the user's normal country.

#### Pros

- Very easy for users.

#### Cons

- Doesn't provide any protection if the user's system is compromised.
- Doesn't provide any protection against rogue insiders.
- Easy for an attacker to bypass by obtaining IP addresses in the trusted country or location.
- Privacy features such as Apple's [iCloud Private Relay](https://support.apple.com/en-us/102602) and VPNs can make this less accurate.

### Geofencing

Geofencing is a more precise version of geolocation, which allows the user to define a specific area in which they are allowed to authenticate. This is often used in mobile applications, where the user's location can be determined with a high degree of accuracy using geopositioning hardware like GPS.

#### Pros

- Very easy for users.
- Provides a high level of protection against remote attackers.

#### Cons

- Doesn't provide any protection if the user's system is compromised.
- Doesn't provide any protection against rogue insiders.
- Doesn't provide any protection against attackers who are physically close to the trusted location.

## Something You Do

Behavior-based authentication is based on the user's behavior, such as the way they type, move their mouse, or use their mobile device. This is the least common form of MFA and is combined with other factors to increase the level of assurance in the user's identity. It is also the most difficult to implement and may require specific hardware along with a significant amount of data and processing power to analyze the user's behavior.

### Behavioral Profiling

Behavioral profiling is based on the way the user interacts with the application, such as the time of day they log in, the devices they use, and the way they navigate the application. This is rapidly becoming more common in web applications when combined with [Risk Based Authentication](#risk-based-authentication) and [User and Entity Behavior Analytics](https://learn.microsoft.com/en-us/azure/sentinel/identify-threats-with-entity-behavior-analytics) (UEBA) systems.

#### Pros

- Doesn't require user interaction.
- Can be used to continuously authenticate the user.
- Combines well with other factors to increase the level of assurance in the user's identity.

#### Cons

- Early implementations of behavioral profiling were often inaccurate and caused a significant number of false positives.
- Requires large amounts of data and processing power to analyze the user's behavior.
- May be difficult to implement in environments where the user's behavior is likely to change frequently.

### Keystroke & Mouse Dynamics

Keystroke and mouse dynamics are based on the way the user types and moves their mouse. For example, the time between key presses, the time between key presses and releases, and the speed and acceleration of the mouse. Largely theoretical, and not widely used in practice.

#### Pros

- Can be used without requiring any additional hardware.
- Can be used without requiring any additional interaction from the user.
- Can be used to continuously authenticate the user.
- Can be used to detect when the user is not the one using the system.
- Can be used to detect when the user is under duress.
- Can be used to detect when the user is not in a fit state to use the system.

#### Cons

- Unlikely to be accurate enough to be used as a standalone factor.
- May be spoofed by AI or other advanced attacks.

### Gait Analysis

Gait analysis is based on the way the user walks using cameras and sensors. They are often used in physical security systems, but are not widely used in web applications. Mobile device applications may be able to use the accelerometer to detect the user's gait and use this as an additional factor, however this is still largely theoretical.

#### Pros

- Very difficult to spoof.
- May be used without requiring any additional interaction from the user.

#### Cons

- Requires specific hardware to implement.
- Use outside of physical security systems is not widely tested.

## Adaptive or Risk-Based Authentication

Adaptive (or Risk-Based) Authentication adjusts authentication requirements dynamically based on the context of the login attempt. This technique helps improve user experience while strengthening security by applying additional verification steps only when risk is elevated.

Common signals used to determine risk include:

- Geolocation and IP reputation
- Device fingerprinting
- Time of access (e.g., 3 AM login)
- Behavioral biometrics (e.g., typing speed or mouse movements)
- Known compromised credentials

If risk is detected, the system may:

- Prompt for an additional factor (e.g., OTP)
- Enforce re-authentication
- Deny access and trigger alerting or account protection flows

For more details on when to trigger reauthentication after high-risk events—such as account recovery or suspicious activity—see the [Reauthentication After Risk Events](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#reauthentication-after-risk-events) section in the Authentication Cheat Sheet

This method is widely used in modern authentication systems to balance usability and security. However, developers must ensure that risk signals cannot be spoofed and that fallback mechanisms are not weaker than the primary MFA methods.

**Example Use Case**: A user logs in from a trusted device in a usual location — no additional prompt is needed. But if they log in from a new country using a Tor exit node, the system requires SMS verification or triggers an account lock until further verification.

</section>

<section id="multifactor-authentication-translation-panel" className="tabPanel translationPanel contentPanel">

## はじめに

多要素認証 (Multifactor Authentication: MFA) または二要素認証 (Two-Factor Authentication: 2FA) とは、利用者がシステムで認証するために複数種類の証拠を提示することを要求される仕組みです。証拠 (または要素) には五つの異なる種類があり、これらはどの組み合わせでも使用できます。ただし実際には、Web アプリケーションで一般的なのは最初の三つだけです。五つの種類は次のとおりです。

| 要素 | 例 |
|--------|----------|
| [知っているもの](#知っているもの) | [パスワードと PIN](#パスワードと-pin)、[秘密の質問](#秘密の質問) |
| [持っているもの](#持っているもの) | [OTP トークン](#ワンタイムパスワードトークン)、[U2F トークン](#universal-second-factor)、[証明書](#証明書)、[スマートカード](#スマートカード)、[メール](#メール)、[SMS と電話](#sms-と電話) |
| [本人であること](#本人であること) | [指紋、顔認識、虹彩スキャン](#生体認証) |
| [いる場所](#いる場所) | [送信元 IP アドレス](#送信元-ip-アドレス)、[地理的位置](#地理的位置)、[ジオフェンシング](#ジオフェンシング) |
| [行うこと](#行うこと) | [行動プロファイリング](#行動プロファイリング)、[キーストロークとマウス動作](#キーストロークとマウス動作)、[歩行分析](#歩行分析) |

同じ認証要素を複数インスタンス要求すること (たとえばパスワードと PIN の両方を必要とすること) は **MFA には該当せず**、追加のセキュリティは最小限しか提供しない点に注意する必要があります。使用する要素は互いに独立しているべきであり、同じ攻撃で侵害できてはなりません。以下のセクションでは、さまざまな種類の MFA の欠点と弱点を説明しますが、多くの場合、これらが関連するのは標的型攻撃に対してだけです。**MFA がないより、どのような MFA でもある方が優れています**。

## 利点

アプリケーションで利用者アカウントが侵害される最も一般的な方法は、弱いパスワード、再利用されたパスワード、または盗まれたパスワードによるものです。アプリケーションにどのような技術的セキュリティ制御が実装されていても、利用者は弱いパスワードを選んだり、複数のアプリケーションで同じパスワードを使ったりしがちです。開発者またはシステム管理者としては、利用者のパスワードはいずれ侵害されるものと想定し、それに対して防御できるようシステムを設計すべきです。

MFA は、ブルートフォース、[クレデンシャルスタッフィング](https://cheatsheetseries.owasp.org/cheatsheets/Credential_Stuffing_Prevention_Cheat_Sheet.html)、パスワードスプレーを含む大多数のパスワード関連攻撃に対する、群を抜いて最良の防御策です。Microsoft の分析では、MFA により[アカウント侵害の 99.9%](https://techcommunity.microsoft.com/t5/Azure-Active-Directory-Identity/Your-Pa-word-doesn-t-matter/ba-p/731984)を防止できたと示唆されています。

## 欠点

MFA の最大の欠点は、管理者とエンドユーザーの双方にとって管理の複雑さが増すことです。技術に詳しくない多くの利用者は、MFA の設定と使用を難しいと感じる可能性があります。さらに、よく遭遇する問題がいくつかあります。

- 利用者に特定のハードウェアを持たせる必要がある種類の MFA は、大きなコストと管理上のオーバーヘッドを招く可能性があります。
- 利用者が他の要素を紛失したり使用できなかったりすると、アカウントからロックアウトされる可能性があります。
- MFA はアプリケーションに追加の複雑さを導入します。
- 多くの MFA ソリューションはシステムに外部依存を追加し、それがセキュリティ脆弱性や単一障害点を導入する可能性があります。
- 利用者が MFA をバイパスまたはリセットできるように実装されたプロセスは、攻撃者に悪用される可能性があります。
- MFA の要求により、一部の利用者がアプリケーションにアクセスできなくなる可能性があります。

## クイック推奨事項

アプリケーションに MFA をいつ、どのように実装するかは、アプリケーションの脅威モデル、利用者の技術レベル、利用者に対する管理上の制御レベルなど、さまざまな要因によって異なります。これらはアプリケーションごとに考慮する必要があります。

ただし、以下の推奨事項は多くのアプリケーションにおいて概ね適切であり、検討の初期出発点になります。

- すべての利用者に何らかの形式の MFA を要求します。
- 利用者が [TOTP](#ソフトウェア-otp-トークン) を使用して自分のアカウントで MFA を有効化できる選択肢を提供します。
- 管理者またはその他の高権限利用者には MFA を要求します。
- 利用者が MFA をリセットできる安全な手順を実装します。
- [サービスとしての MFA](#サードパーティサービスの利用を検討する)を検討します。

## MFA の実装

MFA は重要なセキュリティ制御であり、すべてのアプリケーションに推奨されます。以下のセクションでは、MFA の実装方法と、考慮すべき事項についてガイダンスを示します。

### 規制およびコンプライアンス要件

多くの業界や国には、MFA の使用を要求する規制があります。これは特に金融およびヘルスケア分野で一般的であり、欧州連合の一般データ保護規則 (General Data Protection Regulation: GDPR) に準拠するために要求されることもよくあります。MFA を実装する際には、これらの要件を考慮することが重要です。

### MFA を要求するタイミング

アプリケーションで MFA を要求する最も重要な場所は、利用者がログインするときです。ただし、利用可能な機能によっては、次のような機密性の高い操作を実行するときにも MFA を要求することが適切な場合があります。

- パスワードまたは秘密の質問を変更する。
- アカウントに関連付けられたメールアドレスを変更する。
- MFA を無効化する。
- 利用者セッションを管理者セッションに昇格する。

アプリケーションが利用者に複数の認証方法を提供している場合、それらすべてで MFA を要求するか、他の保護を実装すべきです。よく見落とされる領域として、アプリケーションがログインに使用できる別個の API を提供している場合や、関連するモバイルアプリケーションを持っている場合があります。

### ワンタイムパスワード (OTP) の処理と保存

OTP は認証シークレットであり、パスワードと同等の衛生管理で取り扱うべきです。長期的なパスワードとはセキュリティ特性が異なりますが、不適切に取り扱うと利用者アカウントの侵害につながる可能性があります。

最低限、OTP 実装では次を行うことが**推奨**されます。

- 短い有効期間 (Time-to-Live: TTL) を強制する
- OTP が単回使用であることを保証する
- 厳格な試行回数制限を適用する
- 検証に成功したら OTP を無効化する

OTP 実装では次を行うべきでは**ありません**。

- OTP 値をログに記録する
- OTP を長期にわたり平文形式で保存する

リスクをさらに低減し、露出を制限するため、次を行うことが**推奨**されます。

- 暗号学的に安全な乱数生成器を使用して OTP を生成する
- ユーザビリティが許す場合、8 桁以上のコードを検討する
- 「再送」時には新しい OTP を生成し、古いレコードを上書きする

#### OTP のハッシュ化

OTP のハッシュ化は現在も推奨されますが、その理由はパスワードハッシュとは異なります。OTP は通常、非常に小さなキー空間 (たとえば 6 桁コードでは約 100 万通り) しか持たないため、データベース攻撃者は任意の OTP ハッシュをすばやくブルートフォースできます。

そのため、OTP のハッシュ化は、パスワードハッシュのような強力なオフライン攻撃耐性を提供しません。

しかし、ハッシュ化は次の用途で引き続き有用です。

- ログ、メトリクス、デバッグツールを通じた偶発的な開示を防止する
- OTP の有効期間中にデータベースが短時間露出した場合の影響範囲を低減する
- 適切なシークレット取り扱い規律を強制し、デフォルトで平文保存を避ける

目的は短期的な露出保護であり、長期的な暗号学的秘匿性ではありません。

### ユーザー体験の改善

#### リスクベース認証

MFA を使って頻繁にログインしなければならないことは利用者に追加の負担を生じさせ、アプリケーションで MFA を無効化する原因になる可能性があります。リスクベース認証を使用すると、高リスクとみなされる操作を利用者が実行している場合にのみ MFA を要求することで、MFA プロンプトの頻度を減らせます。これには次のような例があります。

- 利用者が新しいデバイスまたは場所からログインするときに MFA を要求する。
- 高リスクとみなされる場所から利用者がログインするときに MFA を要求する。
- 企業 IP 範囲を許可する (または追加要素として[地理的位置](#地理的位置)を使用する)。

#### パスキー

FIDO2 標準に基づく[パスキー](https://passkeys.dev/)は、[所持ベース](#持っているもの)の認証と、[知識ベース](#知っているもの)または[本人性ベース](#本人であること)の認証のいずれかの特性を組み合わせた、新しい形式の MFA です。利用者は認証のために物理デバイス (モバイル電話など) を持ち、[PIN](#パスワードと-pin) を入力するか[生体認証](#生体認証)を使用する必要があります。その後、利用者のデバイスはサーバーとの認証に使用される暗号鍵を生成します。これは非常に安全な MFA 形式であり、フィッシング攻撃に耐性がありながら、利用者にとっても摩擦が少ないものです。

### ログイン試行の失敗

利用者がパスワードを入力したものの、第二要素による認証に失敗した場合、これは次の二つのいずれかを意味する可能性があります。

- 利用者が第二要素を紛失した、または利用できない状態にある (たとえばモバイル電話を持っていない、または電波がない)。
- 利用者のパスワードが侵害されている。

この状況では、いくつかの手順を実施すべきです。

- 利用者に別の形式の MFA を試すよう促す。
- 利用者が [MFA をリセット](#mfa-のリセット)できるようにする。
- 失敗したログイン試行を利用者に通知し、心当たりがない場合はパスワードを変更するよう促す。
    - 通知には、ログイン試行の時刻、ブラウザ、地理的位置を含めるべきです。
    - これは次回ログイン時に表示し、任意でメールでも送信すべきです。

### MFA のリセット

MFA 実装における最大の課題の一つは、追加要素を忘れた、または紛失した利用者への対応です。これには次のようにさまざまな原因があります。

- デジタル証明書をバックアップせずにワークステーションを再インストールする。
- OTP コードをバックアップせずに電話を初期化または紛失する。
- 携帯電話番号を変更する。

利用者がアプリケーションからロックアウトされることを防ぐため、既存の MFA を使用できない場合にアカウントへのアクセスを回復する仕組みが必要です。しかし同時に、その仕組みが攻撃者に MFA をバイパスしてアカウントを乗っ取る手段を提供しないことも重要です。

これを行う決定的な「最善の方法」はなく、何が適切かはアプリケーションのセキュリティや、利用者に対する制御レベルによって大きく異なります。すべてのスタッフが互いを知っている企業アプリケーションで機能するソリューションは、世界中に数千人の利用者がいる公開アプリケーションでは実現困難である可能性があります。すべての回復方法には固有の利点と欠点があり、アプリケーションの文脈で評価する必要があります。

考えられる方法の例は次のとおりです。

- 利用者が初めて MFA を設定するときに、複数の単回使用リカバリコードを提供する。
- 利用者に複数種類の MFA (デジタル証明書、OTP コード、SMS 用の電話番号など) を設定させ、すべてに同時にアクセスできなくなる可能性を低くする。
- 利用者の登録住所へ単回使用リカバリコード (または新しいハードウェアトークン) を郵送する。
- 利用者にサポートチームへの連絡を要求し、本人確認のための厳格なプロセスを用意する。
- 別の信頼済み利用者に保証してもらう。

### MFA 要素の変更

利用者は、電話番号の変更、新しい認証アプリへの移行、紛失したハードウェアトークンの交換など、認証要素を更新する必要がある場合があります。攻撃者はこのプロセスを悪用してアカウントを乗っ取ることができるため、厳格に保護しなければなりません。

ベストプラクティスには次が含まれます。

- 変更を許可する前に、既存の登録済み要素による再認証を要求する。
- アクティブセッションは乗っ取られている可能性があるため、それだけに依存しない。
- 要素の置き換えを高リスク操作として扱い、リスクベースのチェック (例: 新しいデバイス、通常と異なる場所) を適用する。
- MFA 要素が変更されるたびに、メールやプッシュ通知などのアウトオブバンドチャネルで利用者に通知する。
- 高価値アカウントでは、遅延適用またはステップアップ検証の適用を検討する。

これにより、セッションが侵害された場合でも、攻撃者が利用者の MFA 要素を密かに置き換えて正当な利用者をロックアウトすることを防げます。

### サードパーティサービスの利用を検討する

サービスとして MFA を提供するサードパーティサービスは多数あります。これらは、自前で MFA を実装するリソースがないアプリケーションや、MFA に高い保証レベルを必要とするアプリケーションにとって良い選択肢になり得ます。ただし、サードパーティサービスのセキュリティと、それを使用することの影響を考慮することが重要です。たとえば、サードパーティサービスが侵害された場合、そのサービスを使用するすべてのアプリケーションで攻撃者が MFA をバイパスできる可能性があります。

## 知っているもの

知識ベース認証は、最も一般的な認証の種類であり、利用者が知っているもの、通常はパスワードに基づきます。この要素の最大の利点は、特別なハードウェアや他サービスとの統合を必要としないため、開発者とエンドユーザーの双方に対する要件が非常に低いことです。

### パスワードと PIN

パスワードと PIN は、実装が単純であるため最も一般的な認証形式です。[Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#implement-proper-password-strength-controls) には強力なパスワードポリシーを実装する方法に関するガイダンスがあり、[Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html) にはパスワードを安全に保存する方法に関するガイダンスがあります。ほとんどの多要素認証システムは、パスワードに加えて少なくとも一つの他の要素を使用します。

#### 長所

- 単純でよく理解されています。
- すべての認証フレームワークでネイティブにサポートされています。
- 実装が容易です。

#### 短所

- 利用者は弱いパスワードを選びがちです。
- パスワードはシステム間で再利用されることがよくあります。
- フィッシングの影響を受けやすいです。

### 秘密の質問

[NIST SP 800-63](https://pages.nist.gov/800-63-3/sp800-63b.html) によれば、**秘密の質問はもはや許容可能な認証要素として認識されていません**。アカウント回復は認証の代替手段にすぎないため、通常の認証より弱くすべきではありません。

#### 長所

- パスワードにも存在するもの以外にはありません。

#### 短所

- もはや許容可能な認証要素として認識されていません。
- 質問の答えは推測しやすいことがよくあります。
- 質問の答えはソーシャルメディアや他の情報源から入手できることがよくあります。
- 利用者が何年も後に答えを覚えていられるよう、質問は慎重に選ぶ必要があります。
- フィッシングの影響を受けやすいです。

## 持っているもの

所持ベース認証は、認証に必要な物理的またはデジタルのアイテムを利用者が持っていることに基づきます。これは最も一般的な MFA 形式であり、パスワードと組み合わせて使用されることがよくあります。最も一般的な所持ベース認証の種類は、ハードウェアトークン、ソフトウェアトークン、デジタル証明書です。適切に実装されていれば、リモート攻撃者が侵害することはかなり難しくなります。ただし、利用者は使用したいときに常に認証要素を持っている必要があるため、利用者に追加の管理負担も生じます。

### ワンタイムパスワードトークン

ワンタイムパスワード (One-Time Password: OTP) トークンは所持ベース認証の一形式であり、利用者は認証のために絶えず変化する数字コードを送信する必要があります。最も一般的なのは時間ベースワンタイムパスワード (Time-based One-Time Password: TOTP) トークンで、ハードウェアベースとソフトウェアベースの両方があります。

#### ハードウェア OTP トークン

ハードウェア OTP トークンは、認証時に送信しなければならない、絶えず変化する数字コードを生成します。最もよく知られているものは [RSA SecureID](https://en.wikipedia.org/wiki/RSA_SecurID) で、60 秒ごとに変化する 6 桁の数字を生成します。

##### 長所

- トークンは別個の物理デバイスであるため、攻撃者がリモートで侵害することはほぼ不可能です。
- 利用者がモバイル電話やその他のデバイスを持つ必要なく、トークンを使用できます。

##### 短所

- 物理トークンを利用者に配布することは高価で複雑です。
- 利用者がトークンを紛失した場合、新しいトークンを購入して発送するまでにかなりの時間がかかる可能性があります。
- 実装によってはバックエンドサーバーが必要であり、新たな脆弱性や単一障害点を導入する可能性があります。
- 盗まれたトークンは、PIN やデバイスロック解除コードなしで使用される可能性があります。
- フィッシングの影響を受けやすいです (ただし有効期間は短いです)。

#### ソフトウェア OTP トークン

ハードウェアトークンのより安価で容易な代替手段は、ソフトウェアを使用して時間ベースワンタイムパスワード (TOTP) コードを生成することです。通常、利用者がモバイル電話に TOTP アプリケーションをインストールし、Web アプリケーションから提供される初期シードを含む QR コードをスキャンします。その後、認証アプリはハードウェアトークンとほぼ同じ方法で、60 秒ごとに 6 桁の数字を生成します。

ほとんどの Web サイトは標準化された TOTP トークンを使用しており、利用者は TOTP をサポートする任意の認証アプリをインストールできます。ただし、少数のアプリケーションは独自の変種 (Symantec など) を使用しており、利用者はサービスを使用するために特定のアプリをインストールする必要があります。これは避け、標準ベースのアプローチを採用すべきです。

##### 長所

- 物理トークンが不要なため、システム実装のコストと管理上のオーバーヘッドが大幅に低減されます。
- 利用者が TOTP アプリへアクセスできなくなった場合でも、物理トークンを発送せずに新しいものを設定できます。
- TOTP は広く使用されており、多くの利用者はすでに少なくとも一つの TOTP アプリをインストールしています。
- 利用者の電話に画面ロックが設定されている限り、攻撃者が電話を盗んだとしてもコードを使用できません。

##### 短所

- TOTP アプリは通常、侵害されやすいモバイルデバイスにインストールされます。
- TOTP アプリが、認証に使用される同じモバイルデバイス (またはワークステーション) にインストールされている可能性があります。
- 利用者がバックアップシードを安全でない方法で保存する可能性があります。
- すべての利用者が TOTP に使用できるモバイルデバイスを持っているわけではありません。
- 利用者のモバイルデバイスが紛失、盗難、またはバッテリー切れになった場合、認証できなくなります。
- フィッシングの影響を受けやすいです (ただし有効期間は短いです)。

### Universal Second Factor

ハードウェア U2F トークン

Universal Second Factor (U2F) は、利用者にコードを手入力させるのではなく、チャレンジレスポンスベースの認証を実装する USB/NFC ハードウェアトークンの標準です。通常、これは利用者がトークン上のボタンを押すか、NFC リーダーにタップすることで行われます。最も一般的な U2F トークンは [YubiKey](https://www.yubico.com/products/yubikey-hardware/) です。

#### 長所

- 秘密鍵がトークンから出ないため、U2F トークンはフィッシングに耐性があります。
- 利用者はコードを入力する代わりに、ボタンを押すだけで済みます。
- トークンは別個の物理デバイスであるため、攻撃者がリモートで侵害することはほぼ不可能です。
- U2F は多くの主要 Web ブラウザでネイティブにサポートされています。
- U2F トークンは、利用者がモバイル電話やその他のデバイスを持つ必要なく使用できます。

#### 短所

- ハードウェア OTP トークンと同様に、物理トークンの使用は大きなコストと管理上のオーバーヘッドを導入します。
- 盗まれたトークンは、PIN やデバイスロック解除コードなしで使用される可能性があります。
- トークンは通常 USB 経由でワークステーションに接続されるため、利用者は忘れやすくなります。

### 証明書

デジタル証明書は利用者のデバイスに保存されるファイルであり、認証時に利用者のパスワードとともに自動的に提供されます。最も一般的な種類は X.509 証明書で、より一般的には[クライアント証明書](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html#client-certificates-and-mutual-tls)として知られています。証明書はすべての主要 Web ブラウザでサポートされており、一度インストールすれば利用者による追加操作は不要です。証明書は、利用者が他のアカウントに対して認証しようとすることを防ぐため、個人の利用者アカウントに紐付けるべきです。

#### 長所

- ハードウェアトークンを購入および管理する必要がありません。
- インストール後、証明書は利用者にとって非常に単純です。
- 証明書は一元管理および失効できます。
- フィッシングに耐性があります。

#### 短所

- デジタル証明書を使用するには、バックエンドの公開鍵基盤 (Public Key Infrastructure: PKI) が必要です。
- 特に厳しく制限された環境では、利用者が証明書をインストールすることが難しい場合があります。
- SSL 復号を行う企業プロキシサーバーは、証明書の使用を妨げます。
- 証明書は利用者のワークステーションに保存されるため、システムが侵害されると盗まれる可能性があります。

### スマートカード

スマートカードは、利用者用のデジタル証明書を含むチップを備えたクレジットカードサイズのカードであり、PIN でロック解除されます。オペレーティングシステム認証には一般的に使用されますが、Web アプリケーションではまれです。

#### 長所

- 盗まれたスマートカードは PIN なしでは使用できません。
- スマートカードは複数のアプリケーションやシステムで使用できます。
- フィッシングに耐性があります。

#### 短所

- スマートカードの管理と配布には、ハードウェアトークンと同じコストとオーバーヘッドがあります。
- スマートカードは現代のブラウザでネイティブにサポートされていないため、サードパーティソフトウェアが必要です。
- 多くのビジネスクラスのノート PC にはスマートカードリーダーが組み込まれていますが、家庭用システムにはないことがよくあります。
- スマートカードの使用にはバックエンド PKI が必要です。

### SMS と電話

> [!WARNING]
> NIST SP 800-63B-4 は、SS7 盗聴、SIM スワップ、番号移管攻撃のため、SMS および PSTN で配信されるコードを*制限付き*認証器と位置付けています。高価値アプリケーションや PII を扱うアプリケーションでは SMS を使用しないでください。SMS が唯一利用可能な要素である場合は、リスク受容を文書化し、アカウントごとのレート制限を強制し、SIM スワップのシグナルを監視し、TOTP、プッシュ通知、または WebAuthn/FIDO2 への移行を計画してください。

SMS メッセージまたは電話は、利用者が追加要素として送信しなければならない単回使用コードを提供するために使用できます。これらの方法がもたらすリスクのため、個人識別情報 (Personally Identifiable Information: PII) を保持するアプリケーションや、医療および銀行のように金融リスクがあるアプリケーションを保護するために使用すべきではありません。[NIST SP 800-63B](https://pages.nist.gov/800-63-3/sp800-63b.html) は、これらを制限付き認証器として分類し、PII を含むアプリケーションでの使用を推奨していません。

#### 長所

- 実装が比較的単純です。
- 利用者が自分のアカウントを携帯電話番号に紐付ける必要があります。

#### 短所

- 利用者がモバイルデバイスまたは固定電話を持っている必要があります。
- 通話またはメッセージを受信するため、利用者に電波またはインターネットアクセスが必要です。
- 通話や SMS メッセージの送信には費用がかかる可能性があり、攻撃者が大量のメッセージを要求して資金を使い果たさせることから保護する必要があります。
- SIM スワップ攻撃の影響を受けやすいです。
- SMS メッセージは、利用者が認証に使用している同じデバイスで受信される可能性があります。
- フィッシングの影響を受けやすいです。
- SMS はデバイスがロックされているときにプレビューされる可能性があります。
- SMS は悪意のある、または安全でないアプリケーションに読み取られる可能性があります。

### メール

メール検証では、利用者がメールアドレスに送信されたコードを入力するか、リンクをクリックする必要があります。メールが MFA の一形式に該当するかについては議論があります。なぜなら、利用者がメールアカウントに MFA を設定していない場合、それは単に利用者のメールパスワード (多くの場合、アプリケーションのパスワードと同じです) の知識を要求しているだけだからです。ただし、完全性のためここに含めています。

#### 長所

- 実装が非常に容易です。
- 別個のハードウェアやモバイルデバイスの要件がありません。

#### 短所

- メールアカウントのセキュリティに完全に依存しますが、メールアカウントには MFA がないことがよくあります。
- メールパスワードはアプリケーションパスワードと同じであることがよくあります。
- 利用者のメールが先に侵害された場合、保護を提供しません。
- メールは、利用者が認証に使用している同じデバイスで受信される可能性があります。
- フィッシングの影響を受けやすいです。

## 本人であること

本人性ベース認証は、利用者の身体的属性に基づきます。これは、利用者が特定のハードウェアを持つ必要があり、プライバシーの観点で最も侵襲的とみなされることが多いため、Web アプリケーションではあまり一般的ではありません。ただし、オペレーティングシステム認証では一般的に使用され、一部のモバイルアプリケーションでも使用されます。

### 生体認証

使用される一般的な生体認証には、次のようなものがあります。

- 指紋スキャン
- 顔認識
- 虹彩スキャン
- 音声認識

#### 長所

- 適切に実装された生体認証はなりすましが難しく、標的型攻撃を必要とします。
- 利用者にとって高速で便利です。

#### 短所

- 利用者の手動登録が必要です。
- 生体情報を読み取るために、専用の (場合によっては高価な) ハードウェアが必要になることがよくあります。
- プライバシー上の懸念: 利用者に関する機微な身体情報を保存しなければなりません。
- 侵害された場合、生体データは変更が難しい可能性があります。
- ハードウェアが追加の攻撃ベクトルに対して脆弱な可能性があります。

## いる場所

位置ベース認証は、利用者の物理的位置に基づきます。位置は MFA を要求するかどうかを判断するときに使用される (上記で[説明](#mfa-を要求するタイミング)した) と主張されることもありますが、これは実質的には位置をそれ自体の要素とみなすことと同じです。代表的な二つの例は、Microsoft Azure で利用可能な[条件付きアクセス ポリシー](https://docs.microsoft.com/en-us/azure/active-directory/conditional-access/overview)と、BitLocker の [Network Unlock](https://docs.microsoft.com/en-us/windows/security/information-protection/bitlocker/bitlocker-how-to-enable-network-unlock) 機能です。

### 送信元 IP アドレス

利用者が接続している送信元 IP アドレスは、通常は許可リストベースのアプローチで、要素として使用できます。これは静的リスト (企業オフィスの範囲など) または動的リスト (利用者が以前に認証した IP アドレスなど) に基づくことができます。

#### 長所

- 利用者にとって非常に容易です。
- 管理スタッフによる設定と管理が最小限で済みます。

#### 短所

- 利用者のシステムが侵害された場合、保護を提供しません。
- 悪意のある内部者に対する保護を提供しません。
- 信頼済み IP アドレスは慎重に制限する必要があります (たとえば、オープンなゲスト Wi-Fi が主要な企業 IP 範囲を使用している場合など)。

### 地理的位置

利用者の正確な IP アドレスを使用する代わりに、その IP アドレスが登録されている地理的位置を使用できます。これは精度は低いですが、IP アドレスが静的でない環境では実装しやすい可能性があります。一般的な使用例は、利用者の通常の国の外から認証試行が行われたときに追加の認証要素を要求することです。

#### 長所

- 利用者にとって非常に容易です。

#### 短所

- 利用者のシステムが侵害された場合、保護を提供しません。
- 悪意のある内部者に対する保護を提供しません。
- 攻撃者が信頼済みの国または場所の IP アドレスを取得することで容易にバイパスできます。
- Apple の [iCloud Private Relay](https://support.apple.com/en-us/102602) や VPN などのプライバシー機能により、精度が低下する可能性があります。

### ジオフェンシング

ジオフェンシングは地理的位置のより精密なバージョンであり、利用者が認証を許可される特定の領域を定義できます。これはモバイルアプリケーションでよく使用されます。モバイルアプリケーションでは、GPS のような測位ハードウェアを使用して、利用者の位置を高い精度で判断できるためです。

#### 長所

- 利用者にとって非常に容易です。
- リモート攻撃者に対して高い保護レベルを提供します。

#### 短所

- 利用者のシステムが侵害された場合、保護を提供しません。
- 悪意のある内部者に対する保護を提供しません。
- 信頼済み場所の物理的近くにいる攻撃者に対する保護を提供しません。

## 行うこと

行動ベース認証は、利用者の入力方法、マウスの動かし方、モバイルデバイスの使い方など、利用者の行動に基づきます。これは最も一般的でない MFA 形式であり、利用者のアイデンティティに対する保証レベルを高めるため、他の要素と組み合わせて使用されます。また実装が最も難しく、利用者の行動を分析するために特定のハードウェアに加え、大量のデータと処理能力を必要とする可能性があります。

### 行動プロファイリング

行動プロファイリングは、利用者がログインする時間帯、使用するデバイス、アプリケーション内を移動する方法など、利用者がアプリケーションとやり取りする方法に基づきます。これは [Risk Based Authentication](#リスクベース認証) および [User and Entity Behavior Analytics](https://learn.microsoft.com/en-us/azure/sentinel/identify-threats-with-entity-behavior-analytics) (UEBA) システムと組み合わせることで、Web アプリケーションで急速に一般化しつつあります。

#### 長所

- 利用者の操作を必要としません。
- 利用者を継続的に認証するために使用できます。
- 利用者のアイデンティティに対する保証レベルを高めるため、他の要素とうまく組み合わせられます。

#### 短所

- 行動プロファイリングの初期実装は不正確なことが多く、多数の誤検知を引き起こしていました。
- 利用者の行動を分析するため、大量のデータと処理能力が必要です。
- 利用者の行動が頻繁に変化しやすい環境では、実装が難しい場合があります。

### キーストロークとマウス動作

キーストロークとマウス動作は、利用者の入力方法とマウスの動かし方に基づきます。たとえば、キー押下間の時間、キー押下と解放の間の時間、マウスの速度と加速度です。これは大部分が理論的なものであり、実際には広く使用されていません。

#### 長所

- 追加のハードウェアを必要とせずに使用できます。
- 利用者から追加の操作を必要とせずに使用できます。
- 利用者を継続的に認証するために使用できます。
- システムを使用しているのが利用者本人ではない場合を検出するために使用できます。
- 利用者が強要下にある場合を検出するために使用できます。
- 利用者がシステムを使用するのに適した状態ではない場合を検出するために使用できます。

#### 短所

- 単独の要素として使用できるほど十分に正確である可能性は低いです。
- AI またはその他の高度な攻撃によってなりすまされる可能性があります。

### 歩行分析

歩行分析は、カメラとセンサーを使用して利用者の歩き方に基づきます。これは物理セキュリティシステムでよく使用されますが、Web アプリケーションでは広く使用されていません。モバイルデバイスアプリケーションでは、加速度計を使用して利用者の歩行を検出し、追加要素として使用できる可能性がありますが、これはまだ大部分が理論的なものです。

#### 長所

- なりすましが非常に困難です。
- 利用者に追加操作を要求せずに使用できる可能性があります。

#### 短所

- 実装には特定のハードウェアが必要です。
- 物理セキュリティシステム以外での使用は広くテストされていません。

## 適応型またはリスクベース認証

適応型 (またはリスクベース) 認証は、ログイン試行のコンテキストに基づいて認証要件を動的に調整します。この技術は、リスクが高まった場合にのみ追加の検証手順を適用することで、セキュリティを強化しながらユーザー体験を改善するのに役立ちます。

リスクを判断するために使用される一般的なシグナルには次が含まれます。

- 地理的位置と IP レピュテーション
- デバイスフィンガープリンティング
- アクセス時刻 (例: 午前 3 時のログイン)
- 行動生体情報 (例: 入力速度やマウスの動き)
- 既知の侵害済み認証情報

リスクが検出された場合、システムは次を行う可能性があります。

- 追加要素 (例: OTP) を要求する
- 再認証を強制する
- アクセスを拒否し、アラートまたはアカウント保護フローをトリガーする

アカウント回復や疑わしいアクティビティなど、高リスクイベント後にいつ再認証をトリガーするかの詳細については、Authentication Cheat Sheet の [Reauthentication After Risk Events](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#reauthentication-after-risk-events) セクションを参照してください。

この方法は、ユーザビリティとセキュリティのバランスを取るため、現代の認証システムで広く使用されています。ただし開発者は、リスクシグナルがなりすまされないこと、およびフォールバック機構が主要な MFA 方法より弱くないことを保証しなければなりません。

**ユースケース例**: 利用者が信頼済みデバイスから通常の場所でログインする場合、追加プロンプトは不要です。しかし、新しい国から Tor 出口ノードを使用してログインした場合、システムは SMS 検証を要求するか、追加確認が完了するまでアカウントロックをトリガーします。

</section>

<section id="multifactor-authentication-bilingual-panel" className="tabPanel bilingualPanel">

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Introduction

Multifactor Authentication (MFA) or Two-Factor Authentication (2FA) is when a user is required to present more than one type of evidence in order to authenticate on a system. There are five different types of evidence (or factors) and any combination of these can be used, however in practice only the first three are common in web applications. The five types are as follows:

| Factor | Examples |
|--------|----------|
| [Something You Know](#something-you-know) | [Passwords and PINs](#passwords-and-pins), [Security Questions](#security-questions) |
| [Something You Have](#something-you-have) | [OTP Tokens](#one-time-password-tokens), [U2F Tokens](#universal-second-factor), [Certificates](#certificates),[Smart Cards](#smart-cards), [Email](#email), [SMS and Phone Calls](#sms-messages-and-phone-calls) |
| [Something You Are](#something-you-are) | [Fingerprints, Facial Recognition, Iris Scans](#biometrics) |
| [Somewhere You Are](#somewhere-you-are) | [Source IP Address](#source-ip-address), [Geolocation](#geolocation), [Geofencing](#geofencing) |
| [Something You Do](#something-you-do) | [Behavioral Profiling](#behavioral-profiling), [Keystroke & Mouse Dynamics](#keystroke--mouse-dynamics), [Gait Analysis](#gait-analysis) |

It should be noted that requiring multiple instances of the same authentication factor (such as needing both a password and a PIN) **does not constitute MFA** and offers minimal additional security. The factors used should be independent of each other and should not be able to be compromised by the same attack. While the following sections discuss the disadvantage and weaknesses of various different types of MFA, in many cases these are only relevant against targeted attacks. **Any MFA is better than no MFA**.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## はじめに

多要素認証 (Multifactor Authentication: MFA) または二要素認証 (Two-Factor Authentication: 2FA) とは、利用者がシステムで認証するために複数種類の証拠を提示することを要求される仕組みです。証拠 (または要素) には五つの異なる種類があり、これらはどの組み合わせでも使用できます。ただし実際には、Web アプリケーションで一般的なのは最初の三つだけです。五つの種類は次のとおりです。

| 要素 | 例 |
|--------|----------|
| [知っているもの](#知っているもの) | [パスワードと PIN](#パスワードと-pin)、[秘密の質問](#秘密の質問) |
| [持っているもの](#持っているもの) | [OTP トークン](#ワンタイムパスワードトークン)、[U2F トークン](#universal-second-factor)、[証明書](#証明書)、[スマートカード](#スマートカード)、[メール](#メール)、[SMS と電話](#sms-と電話) |
| [本人であること](#本人であること) | [指紋、顔認識、虹彩スキャン](#生体認証) |
| [いる場所](#いる場所) | [送信元 IP アドレス](#送信元-ip-アドレス)、[地理的位置](#地理的位置)、[ジオフェンシング](#ジオフェンシング) |
| [行うこと](#行うこと) | [行動プロファイリング](#行動プロファイリング)、[キーストロークとマウス動作](#キーストロークとマウス動作)、[歩行分析](#歩行分析) |

同じ認証要素を複数インスタンス要求すること (たとえばパスワードと PIN の両方を必要とすること) は **MFA には該当せず**、追加のセキュリティは最小限しか提供しない点に注意する必要があります。使用する要素は互いに独立しているべきであり、同じ攻撃で侵害できてはなりません。以下のセクションでは、さまざまな種類の MFA の欠点と弱点を説明しますが、多くの場合、これらが関連するのは標的型攻撃に対してだけです。**MFA がないより、どのような MFA でもある方が優れています**。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Advantages

The most common way that user accounts get compromised on applications is through weak, re-used or stolen passwords. Despite any technical security controls implemented on the application, users are liable to choose weak passwords, or to use the same password on different applications. As developers or system administrators, it should be assumed that users' passwords will be compromised at some point, and the system should be designed in order to defend against this.

MFA is by far the best defense against the majority of password-related attacks, including brute-force, [credential stuffing](https://cheatsheetseries.owasp.org/cheatsheets/Credential_Stuffing_Prevention_Cheat_Sheet.html) and password spraying, with analysis by Microsoft suggesting that it would have stopped [99.9% of account compromises](https://techcommunity.microsoft.com/t5/Azure-Active-Directory-Identity/Your-Pa-word-doesn-t-matter/ba-p/731984).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 利点

アプリケーションで利用者アカウントが侵害される最も一般的な方法は、弱いパスワード、再利用されたパスワード、または盗まれたパスワードによるものです。アプリケーションにどのような技術的セキュリティ制御が実装されていても、利用者は弱いパスワードを選んだり、複数のアプリケーションで同じパスワードを使ったりしがちです。開発者またはシステム管理者としては、利用者のパスワードはいずれ侵害されるものと想定し、それに対して防御できるようシステムを設計すべきです。

MFA は、ブルートフォース、[クレデンシャルスタッフィング](https://cheatsheetseries.owasp.org/cheatsheets/Credential_Stuffing_Prevention_Cheat_Sheet.html)、パスワードスプレーを含む大多数のパスワード関連攻撃に対する、群を抜いて最良の防御策です。Microsoft の分析では、MFA により[アカウント侵害の 99.9%](https://techcommunity.microsoft.com/t5/Azure-Active-Directory-Identity/Your-Pa-word-doesn-t-matter/ba-p/731984)を防止できたと示唆されています。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Disadvantages

The biggest disadvantage of MFA is the increase in management complexity for both administrators and end users. Many less technical users may find it difficult to configure and use MFA. Additionally, there are a number of other common issues encountered:

- Types of MFA that require users to have specific hardware can introduce significant costs and administrative overheads.
- Users may become locked out of their accounts if they lose or are unable to use their other factors.
- MFA introduces additional complexity into the application.
- Many MFA solutions add external dependencies to systems, which can introduce security vulnerabilities or single points of failure.
- Processes implemented to allow users to bypass or reset MFA may be exploitable by attackers.
- Requiring MFA may prevent some users from accessing the application.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 欠点

MFA の最大の欠点は、管理者とエンドユーザーの双方にとって管理の複雑さが増すことです。技術に詳しくない多くの利用者は、MFA の設定と使用を難しいと感じる可能性があります。さらに、よく遭遇する問題がいくつかあります。

- 利用者に特定のハードウェアを持たせる必要がある種類の MFA は、大きなコストと管理上のオーバーヘッドを招く可能性があります。
- 利用者が他の要素を紛失したり使用できなかったりすると、アカウントからロックアウトされる可能性があります。
- MFA はアプリケーションに追加の複雑さを導入します。
- 多くの MFA ソリューションはシステムに外部依存を追加し、それがセキュリティ脆弱性や単一障害点を導入する可能性があります。
- 利用者が MFA をバイパスまたはリセットできるように実装されたプロセスは、攻撃者に悪用される可能性があります。
- MFA の要求により、一部の利用者がアプリケーションにアクセスできなくなる可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Quick Recommendations

Exactly when and how MFA is implemented in an application will vary on a number of different factors, including the threat model of the application, the technical level of the users, and the level of administrative control over the users. These need to be considered on a per-application basis.

However, the following recommendations are generally appropriate for most applications, and provide an initial starting point to consider.

- Require some form of MFA for all users.
- Provide the option for users to enable MFA on their accounts using [TOTP](#software-otp-tokens).
- Require MFA for administrative or other high privileged users.
- Implement a secure procedure to allow users to reset their MFA.
- Consider [MFA as a service](#consider-using-a-third-party-service).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## クイック推奨事項

アプリケーションに MFA をいつ、どのように実装するかは、アプリケーションの脅威モデル、利用者の技術レベル、利用者に対する管理上の制御レベルなど、さまざまな要因によって異なります。これらはアプリケーションごとに考慮する必要があります。

ただし、以下の推奨事項は多くのアプリケーションにおいて概ね適切であり、検討の初期出発点になります。

- すべての利用者に何らかの形式の MFA を要求します。
- 利用者が [TOTP](#ソフトウェア-otp-トークン) を使用して自分のアカウントで MFA を有効化できる選択肢を提供します。
- 管理者またはその他の高権限利用者には MFA を要求します。
- 利用者が MFA をリセットできる安全な手順を実装します。
- [サービスとしての MFA](#サードパーティサービスの利用を検討する)を検討します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Implementing MFA

MFA is a critical security control, and is recommended for all applications. The following sections provide guidance on how to implement MFA, and the considerations that should be taken into account.

### Regulatory and Compliance Requirements

Many industries and countries have regulations that require the use of MFA. This is particularly common in the finance and healthcare sectors, and is often required in order to comply with the General Data Protection Regulation (GDPR) in the European Union. It is important to consider these requirements when implementing MFA.

### When to Require MFA

The most important place to require MFA on an application is when the user logs in. However, depending on the functionality available, it may also be appropriate to require MFA for performing sensitive actions, such as:

- Changing passwords or security questions.
- Changing the email address associated with the account.
- Disabling MFA.
- Elevating a user session to an administrative session.

If the application provides multiple ways for a user to authenticate these should all require MFA, or have other protections implemented. A common area that is missed is if the application provides a separate API that can be used to login, or has an associated mobile application.

### One-Time Password (OTP) Handling and Storage

OTPs are authentication secrets and should be handled with password-like hygiene. While their security traits differ from long-lived passwords, improper handling can still lead to user account compromise.

At a minimum, OTP implementations SHOULD:

- Enforce a short time-to-live (TTL)
- Ensure OTPs are single use
- Apply strict attempt limits
- Invalidate the OTP on successful verification

OTP implementations SHOULD NOT:

- Log OTP values
- Store OTPs in long-term plaintext form

To further reduce risk and limit exposure, it is RECOMMENDED to:

- Generate OTPs using a cryptographically secure random number generator
- Consider 8-digit or longer codes where usability allows
- On "resend", generate a new OTP and overwrite the old record

#### Hashing OTPs

Hashing OTPs is still recommended, but for different reasons than password hashing. OTPs typically have a very small keyspace (for example, ~1 million possibilities for a 6-digit code), which means a database attacker can brute-force any OTP hash quickly.

As a result, hashing OTPs does not provide strong offline attack resistance in the way password hashing does.

However, hashing remains useful to:

- Prevent accidental disclosure via logs, metrics, or debugging tools
- Reduce blast radius if the database is briefly exposed during the OTP’s validity window
- Enforce good secret-handling discipline and avoid plaintext storage by default

The goal is short-term exposure protection, not long-term cryptographic secrecy.

### Improving User Experience

#### Risk Based Authentication

Having to frequently login with MFA creates an additional burden for users, and may cause them to disable MFA on the application. Risk based authentication can be used to reduce the frequency of MFA prompts, by only requiring MFA when the user is performing an action that is considered to be high risk. Some examples of this include:

- Requiring MFA when the user logs in from a new device or location.
- Requiring MFA when the user logs in from a location that is considered to be high risk.
- Allowing corporate IP ranges (or using [geolocation](#geolocation) as an additional factor).

#### Passkeys

[Passkeys](https://passkeys.dev/) based on the FIDO2 standard are a new form of MFA that combines characteristics of [possession-based](#something-you-have) and either [knowledge-based](#something-you-know) or [inherence-based](#something-you-are) authentication. The user is required to have a physical device (such as a mobile phone) and to enter a [PIN](#passwords-and-pins) or use [biometric authentication](#biometrics) in order to authenticate. The user's device then generates a cryptographic key that is used to authenticate with the server. This is a very secure form of MFA and is resistant to phishing attacks while also being frictionless for the user.

### Failed Login Attempts

When a user enters their password, but fails to authenticate using a second factor, this could mean one of two things:

- The user has lost their second factor, or doesn't have it available (for example, they don't have their mobile phone, or have no signal).
- The user's password has been compromised.

There are a number of steps that should be taken when this occurs:

- Prompt the user to try another form of MFA.
- Allow the user to attempt to [reset their MFA](#resetting-mfa).
- Notify the user of the failed login attempt, and encourage them to change their password if they don't recognize it.
    - The notification should include the time, browser and geographic location of the login attempt.
    - This should be displayed next time they login, and optionally emailed to them as well.

### Resetting MFA

One of the biggest challenges with implementing MFA is handling users who forget or lose their additional factors. There are many ways this could happen, such as:

- Re-installing a workstation without backing up digital certificates.
- Wiping or losing a phone without backing up OTP codes.
- Changing mobile numbers.

In order to prevent users from being locked out of the application, there needs to be a mechanism for them to regain access to their account if they can't use their existing MFA; however it is also crucial that this doesn't provide an attacker with a way to bypass MFA and hijack their account.

There is no definitive "best way" to do this, and what is appropriate will vary hugely based on the security of the application, and also the level of control over the users. Solutions that work for a corporate application where all the staff know each other are unlikely to be feasible for a publicly available application with thousands of users all over the world. Every recovery method has its own advantages and disadvantages, and these need to be evaluated in the context of the application.

Some suggestions of possible methods include:

- Providing the user with a number of single-use recovery codes when they first setup MFA.
- Requiring the user to setup multiple types of MFA (such as a digital certificate, OTP core and phone number for SMS), so that they are unlikely to lose access to all of them at once.
- Mailing a one-use recovery code (or new hardware token) to the user's registered address.
- Requiring the user contact the support team and having a rigorous process in place to verify their identity.
- Requiring another trusted user to vouch for them.

### Changing MFA Factors

Users may need to update their authentication factors, such as changing a phone number, migrating to a new authenticator app, or replacing a lost hardware token. Because attackers can exploit this process to take over accounts, it must be strictly secured.

Best practices include:

- Require reauthentication with an existing enrolled factor before allowing changes.
- Do not rely solely on the active session, as it may be hijacked.
- Treat factor replacement as a high-risk action and apply risk-based checks (e.g., new device, unusual location).
- Notify the user through out-of-band channels (such as email or push notification) whenever an MFA factor is changed.
- Consider applying delays or step-up verification for high-value accounts.

This ensures that even if a session is compromised, attackers cannot silently replace the user’s MFA factors and lock the legitimate user out.

### Consider Using a Third Party Service

There are a number of third party services that provide MFA as a service. These can be a good option for applications that don't have the resources to implement MFA themselves, or for applications that require a high level of assurance in their MFA. However, it is important to consider the security of the third party service, and the implications of using it. For example, if the third party service is compromised, it could allow an attacker to bypass MFA on all of the applications that use it.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## MFA の実装

MFA は重要なセキュリティ制御であり、すべてのアプリケーションに推奨されます。以下のセクションでは、MFA の実装方法と、考慮すべき事項についてガイダンスを示します。

### 規制およびコンプライアンス要件

多くの業界や国には、MFA の使用を要求する規制があります。これは特に金融およびヘルスケア分野で一般的であり、欧州連合の一般データ保護規則 (General Data Protection Regulation: GDPR) に準拠するために要求されることもよくあります。MFA を実装する際には、これらの要件を考慮することが重要です。

### MFA を要求するタイミング

アプリケーションで MFA を要求する最も重要な場所は、利用者がログインするときです。ただし、利用可能な機能によっては、次のような機密性の高い操作を実行するときにも MFA を要求することが適切な場合があります。

- パスワードまたは秘密の質問を変更する。
- アカウントに関連付けられたメールアドレスを変更する。
- MFA を無効化する。
- 利用者セッションを管理者セッションに昇格する。

アプリケーションが利用者に複数の認証方法を提供している場合、それらすべてで MFA を要求するか、他の保護を実装すべきです。よく見落とされる領域として、アプリケーションがログインに使用できる別個の API を提供している場合や、関連するモバイルアプリケーションを持っている場合があります。

### ワンタイムパスワード (OTP) の処理と保存

OTP は認証シークレットであり、パスワードと同等の衛生管理で取り扱うべきです。長期的なパスワードとはセキュリティ特性が異なりますが、不適切に取り扱うと利用者アカウントの侵害につながる可能性があります。

最低限、OTP 実装では次を行うことが**推奨**されます。

- 短い有効期間 (Time-to-Live: TTL) を強制する
- OTP が単回使用であることを保証する
- 厳格な試行回数制限を適用する
- 検証に成功したら OTP を無効化する

OTP 実装では次を行うべきでは**ありません**。

- OTP 値をログに記録する
- OTP を長期にわたり平文形式で保存する

リスクをさらに低減し、露出を制限するため、次を行うことが**推奨**されます。

- 暗号学的に安全な乱数生成器を使用して OTP を生成する
- ユーザビリティが許す場合、8 桁以上のコードを検討する
- 「再送」時には新しい OTP を生成し、古いレコードを上書きする

#### OTP のハッシュ化

OTP のハッシュ化は現在も推奨されますが、その理由はパスワードハッシュとは異なります。OTP は通常、非常に小さなキー空間 (たとえば 6 桁コードでは約 100 万通り) しか持たないため、データベース攻撃者は任意の OTP ハッシュをすばやくブルートフォースできます。

そのため、OTP のハッシュ化は、パスワードハッシュのような強力なオフライン攻撃耐性を提供しません。

しかし、ハッシュ化は次の用途で引き続き有用です。

- ログ、メトリクス、デバッグツールを通じた偶発的な開示を防止する
- OTP の有効期間中にデータベースが短時間露出した場合の影響範囲を低減する
- 適切なシークレット取り扱い規律を強制し、デフォルトで平文保存を避ける

目的は短期的な露出保護であり、長期的な暗号学的秘匿性ではありません。

### ユーザー体験の改善

#### リスクベース認証

MFA を使って頻繁にログインしなければならないことは利用者に追加の負担を生じさせ、アプリケーションで MFA を無効化する原因になる可能性があります。リスクベース認証を使用すると、高リスクとみなされる操作を利用者が実行している場合にのみ MFA を要求することで、MFA プロンプトの頻度を減らせます。これには次のような例があります。

- 利用者が新しいデバイスまたは場所からログインするときに MFA を要求する。
- 高リスクとみなされる場所から利用者がログインするときに MFA を要求する。
- 企業 IP 範囲を許可する (または追加要素として[地理的位置](#地理的位置)を使用する)。

#### パスキー

FIDO2 標準に基づく[パスキー](https://passkeys.dev/)は、[所持ベース](#持っているもの)の認証と、[知識ベース](#知っているもの)または[本人性ベース](#本人であること)の認証のいずれかの特性を組み合わせた、新しい形式の MFA です。利用者は認証のために物理デバイス (モバイル電話など) を持ち、[PIN](#パスワードと-pin) を入力するか[生体認証](#生体認証)を使用する必要があります。その後、利用者のデバイスはサーバーとの認証に使用される暗号鍵を生成します。これは非常に安全な MFA 形式であり、フィッシング攻撃に耐性がありながら、利用者にとっても摩擦が少ないものです。

### ログイン試行の失敗

利用者がパスワードを入力したものの、第二要素による認証に失敗した場合、これは次の二つのいずれかを意味する可能性があります。

- 利用者が第二要素を紛失した、または利用できない状態にある (たとえばモバイル電話を持っていない、または電波がない)。
- 利用者のパスワードが侵害されている。

この状況では、いくつかの手順を実施すべきです。

- 利用者に別の形式の MFA を試すよう促す。
- 利用者が [MFA をリセット](#mfa-のリセット)できるようにする。
- 失敗したログイン試行を利用者に通知し、心当たりがない場合はパスワードを変更するよう促す。
    - 通知には、ログイン試行の時刻、ブラウザ、地理的位置を含めるべきです。
    - これは次回ログイン時に表示し、任意でメールでも送信すべきです。

### MFA のリセット

MFA 実装における最大の課題の一つは、追加要素を忘れた、または紛失した利用者への対応です。これには次のようにさまざまな原因があります。

- デジタル証明書をバックアップせずにワークステーションを再インストールする。
- OTP コードをバックアップせずに電話を初期化または紛失する。
- 携帯電話番号を変更する。

利用者がアプリケーションからロックアウトされることを防ぐため、既存の MFA を使用できない場合にアカウントへのアクセスを回復する仕組みが必要です。しかし同時に、その仕組みが攻撃者に MFA をバイパスしてアカウントを乗っ取る手段を提供しないことも重要です。

これを行う決定的な「最善の方法」はなく、何が適切かはアプリケーションのセキュリティや、利用者に対する制御レベルによって大きく異なります。すべてのスタッフが互いを知っている企業アプリケーションで機能するソリューションは、世界中に数千人の利用者がいる公開アプリケーションでは実現困難である可能性があります。すべての回復方法には固有の利点と欠点があり、アプリケーションの文脈で評価する必要があります。

考えられる方法の例は次のとおりです。

- 利用者が初めて MFA を設定するときに、複数の単回使用リカバリコードを提供する。
- 利用者に複数種類の MFA (デジタル証明書、OTP コード、SMS 用の電話番号など) を設定させ、すべてに同時にアクセスできなくなる可能性を低くする。
- 利用者の登録住所へ単回使用リカバリコード (または新しいハードウェアトークン) を郵送する。
- 利用者にサポートチームへの連絡を要求し、本人確認のための厳格なプロセスを用意する。
- 別の信頼済み利用者に保証してもらう。

### MFA 要素の変更

利用者は、電話番号の変更、新しい認証アプリへの移行、紛失したハードウェアトークンの交換など、認証要素を更新する必要がある場合があります。攻撃者はこのプロセスを悪用してアカウントを乗っ取ることができるため、厳格に保護しなければなりません。

ベストプラクティスには次が含まれます。

- 変更を許可する前に、既存の登録済み要素による再認証を要求する。
- アクティブセッションは乗っ取られている可能性があるため、それだけに依存しない。
- 要素の置き換えを高リスク操作として扱い、リスクベースのチェック (例: 新しいデバイス、通常と異なる場所) を適用する。
- MFA 要素が変更されるたびに、メールやプッシュ通知などのアウトオブバンドチャネルで利用者に通知する。
- 高価値アカウントでは、遅延適用またはステップアップ検証の適用を検討する。

これにより、セッションが侵害された場合でも、攻撃者が利用者の MFA 要素を密かに置き換えて正当な利用者をロックアウトすることを防げます。

### サードパーティサービスの利用を検討する

サービスとして MFA を提供するサードパーティサービスは多数あります。これらは、自前で MFA を実装するリソースがないアプリケーションや、MFA に高い保証レベルを必要とするアプリケーションにとって良い選択肢になり得ます。ただし、サードパーティサービスのセキュリティと、それを使用することの影響を考慮することが重要です。たとえば、サードパーティサービスが侵害された場合、そのサービスを使用するすべてのアプリケーションで攻撃者が MFA をバイパスできる可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Something You Know

Knowledge-based, the most common type of authentication is based on something the users knows - typically a password. The biggest advantage of this factor is that it has very low requirements for both the developers and the end user, as it does not require any special hardware, or integration with other services.

### Passwords and PINs

Passwords and PINs are the most common form of authentication due to the simplicity of implementing them. The [Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#implement-proper-password-strength-controls) has guidance on how to implement a strong password policy, and the [Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html) has guidance on how to securely store passwords. Most multifactor authentication systems make use of a password, as well as at least one other factor.

#### Pros

- Simple and well understood.
- Native support in every authentication framework.
- Easy to implement.

#### Cons

- Users are prone to choosing weak passwords.
- Passwords are commonly re-used between systems.
- Susceptible to phishing.

### Security Questions

**Security questions are no longer recognized as an acceptable authentication factor** per [NIST SP 800-63](https://pages.nist.gov/800-63-3/sp800-63b.html). Account recovery is just an alternate way to authenticate so it should be no weaker than regular authentication.

#### Pros

- None that are not also present in passwords.

#### Cons

- No longer recognized as an acceptable authentication factor.
- Questions often have easily guessable answers.
- Answers to questions can often be obtained from social media or other sources.
- Questions must be carefully chosen so that users will remember answers years later.
- Susceptible to phishing.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 知っているもの

知識ベース認証は、最も一般的な認証の種類であり、利用者が知っているもの、通常はパスワードに基づきます。この要素の最大の利点は、特別なハードウェアや他サービスとの統合を必要としないため、開発者とエンドユーザーの双方に対する要件が非常に低いことです。

### パスワードと PIN

パスワードと PIN は、実装が単純であるため最も一般的な認証形式です。[Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#implement-proper-password-strength-controls) には強力なパスワードポリシーを実装する方法に関するガイダンスがあり、[Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html) にはパスワードを安全に保存する方法に関するガイダンスがあります。ほとんどの多要素認証システムは、パスワードに加えて少なくとも一つの他の要素を使用します。

#### 長所

- 単純でよく理解されています。
- すべての認証フレームワークでネイティブにサポートされています。
- 実装が容易です。

#### 短所

- 利用者は弱いパスワードを選びがちです。
- パスワードはシステム間で再利用されることがよくあります。
- フィッシングの影響を受けやすいです。

### 秘密の質問

[NIST SP 800-63](https://pages.nist.gov/800-63-3/sp800-63b.html) によれば、**秘密の質問はもはや許容可能な認証要素として認識されていません**。アカウント回復は認証の代替手段にすぎないため、通常の認証より弱くすべきではありません。

#### 長所

- パスワードにも存在するもの以外にはありません。

#### 短所

- もはや許容可能な認証要素として認識されていません。
- 質問の答えは推測しやすいことがよくあります。
- 質問の答えはソーシャルメディアや他の情報源から入手できることがよくあります。
- 利用者が何年も後に答えを覚えていられるよう、質問は慎重に選ぶ必要があります。
- フィッシングの影響を受けやすいです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Something You Have

Possession-based authentication is based on the user having a physical or digital item that is required to authenticate. This is the most common form of MFA, and is often used in conjunction with passwords. The most common types of possession-based authentication are hardware and software tokens, and digital certificates. If properly implemented then this can be significantly more difficult for a remote attacker to compromise; however it also creates an additional administrative burden on the user, as they must keep the authentication factor with them whenever they wish to use it.

### One-Time Password Tokens

One-Time Password (OTP) tokens are a form of possession-based authentication, where the user is required to submit a constantly changing numeric code in order to authenticate. The most common of which is Time-based One-Time Password (TOTP) tokens, which can be both hardware and software based.

#### Hardware OTP Tokens

Hardware OTP Tokens generate a constantly changing numeric codes, which must be submitted when authenticating. Most well-known of these is the [RSA SecureID](https://en.wikipedia.org/wiki/RSA_SecurID), which generates a six digit number that changes every 60 seconds.

##### Pros

- As the tokens are separate physical devices, they are almost impossible for an attacker to compromise remotely.
- Tokens can be used without requiring the user to have a mobile phone or other device.

##### Cons

- Deploying physical tokens to users is expensive and complicated.
- If a user loses their token it could take a significant amount of time to purchase and ship them a new one.
- Some implementations require a backend server, which can introduce new vulnerabilities as well as a single point of failure.
- Stolen tokens can be used without a PIN or device unlock code.
- Susceptible to phishing (although short-lived).

#### Software OTP Tokens

A cheaper and easier alternative to hardware tokens is using software to generate Time-based One-Time Password (TOTP) codes. This would typically involve the user installing a TOTP application on their mobile phone, and then scanning a QR code provided by the web application which provides the initial seed. The authenticator app then generates a six digit number every 60 seconds, in much the same way as a hardware token.

Most websites use standardized TOTP tokens, allowing the user to install any authenticator app that supports TOTP. However, a small number of applications use their own variants of this (such as Symantec), which requires the users to install a specific app in order to use the service. This should be avoided in favour of a standards-based approach.

##### Pros

- The absence of physical tokens greatly reduces the cost and administrative overhead of implementing the system.
- When users lose access to their TOTP app, a new one can be configured without needing to ship a physical token to them.
- TOTP is widely used, and many users will already have at least one TOTP app installed.
- As long as the user has a screen lock on their phone, an attacker will be unable to use the code if they steal the phone.

##### Cons

- TOTP apps are usually installed on mobile devices, which are vulnerable to compromise.
- The TOTP app may be installed on the same mobile device (or workstation) that is used to authenticate.
- Users may store the backup seeds insecurely.
- Not all users have mobile devices to use with TOTP.
- If the user's mobile device is lost, stolen or out of battery, they will be unable to authenticate.
- Susceptible to phishing (although short-lived).

### Universal Second Factor

Hardware U2F tokens

Universal Second Factor (U2F) is a standard for USB/NFC hardware tokens that  implement challenge-response based authentication, rather than requiring the user to manually enter the code. This would typically be done by the user pressing a button on the token, or tapping it against their NFC reader. The most common U2F token is the [YubiKey](https://www.yubico.com/products/yubikey-hardware/).

#### Pros

- U2F tokens are resistant to phishing since the private key never leaves the token.
- Users can simply press a button rather than typing in a code.
- As the tokens are separate physical devices, they are almost impossible for an attacker to compromise remotely.
- U2F is natively supported by a number of major web browsers.
- U2F tokens can be used without requiring the user to have a mobile phone or other device.

#### Cons

- As with hardware OTP tokens, the use of physical tokens introduces significant costs and administrative overheads.
- Stolen tokens can be used without a PIN or device unlock code.
- As the tokens are usually connected to the workstation via USB, users are more likely to forget them.

### Certificates

Digital certificates are files that are stored on the user's device which are automatically provided alongside the user's password when authenticating. The most common type is X.509 certificates more commonly known as [client certificates](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html#client-certificates-and-mutual-tls). Certificates are supported by all major web browsers, and once installed require no further interaction from the user. The certificates should be linked to an individual's user account in order to prevent users from trying to authenticate against other accounts.

#### Pros

- There is no need to purchase and manage hardware tokens.
- Once installed, certificates are very simple for users.
- Certificates can be centrally managed and revoked.
- Resistant to phishing.

#### Cons

- Using digital certificates requires a backend Private Key Infrastructure (PKI).
- Installing certificates can be difficult for users, particularly in a highly restricted environment.
- Enterprise proxy servers which perform SSL decryption will prevent the use of certificates.
- The certificates are stored on the user's workstation, and as such can be stolen if their system is compromised.

### Smart Cards

Smartcards are credit-card size cards with a chip containing a digital certificate for the user, which is unlocked with a PIN. They are commonly used for operating system authentication, but are rarely used in web applications.

#### Pros

- Stolen smartcards cannot be used without the PIN.
- Smartcards can be used across multiple applications and systems.
- Resistant to phishing.

#### Cons

- Managing and distributing smartcards has the same costs and overheads as hardware tokens.
- Smartcards are not natively supported by modern browsers, so require third party software.
- Although most business-class laptops have smartcard readers built-in, home systems often do not.
- The use of smartcards requires backend PKIs.

### SMS Messages and Phone Calls

> [!WARNING]
> NIST SP 800-63B-4 designates SMS and PSTN-delivered codes as a *restricted* authenticator because of SS7 interception, SIM-swap, and number-porting attacks. Do not use SMS for high-value or PII-handling applications. Where it is the only available factor, document the risk acceptance, enforce per-account rate limits, monitor for SIM-swap signals, and plan migration to TOTP, push notifications, or WebAuthn/FIDO2.

SMS messages or phone calls can be used to provide users with a single-use code that they must submit as an additional factor. Due to the risks posed by these methods, they should not be used to protect applications that hold Personally Identifiable Information (PII) or where there is financial risk. e.g. healthcare and banking. [NIST SP 800-63B](https://pages.nist.gov/800-63-3/sp800-63b.html) classifies these as restricted authenticators and discourages their use for applications containing PII.

#### Pros

- Relatively simple to implement.
- Requires user to link their account to a mobile number.

#### Cons

- Requires the user to have a mobile device or landline.
- Require user to have signal or internet access to receive the call or message.
- Calls and SMS messages may cost money to send need to protect against attackers requesting a large number of messages to exhaust funds.
- Susceptible to SIM swapping attacks.
- SMS messages may be received on the same device the user is authenticating from.
- Susceptible to phishing.
- SMS may be previewed when the device is locked.
- SMS may be read by malicious or insecure applications.

### Email

Email verification requires that the user enters a code or clicks a link sent to their email address. There is some debate as to whether email constitutes a form of MFA, because if the user does not have MFA configured on their email account, it simply requires knowledge of the user's email password (which is often the same as their application password). However, it is included here for completeness.

#### Pros

- Very easy to implement.
- No requirements for separate hardware or a mobile device.

#### Cons

- Relies entirely on the security of the email account, which often lacks MFA.
- Email passwords are commonly the same as application passwords.
- Provides no protection if the user's email is compromised first.
- Email may be received by the same device the user is authenticating from.
- Susceptible to phishing.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 持っているもの

所持ベース認証は、認証に必要な物理的またはデジタルのアイテムを利用者が持っていることに基づきます。これは最も一般的な MFA 形式であり、パスワードと組み合わせて使用されることがよくあります。最も一般的な所持ベース認証の種類は、ハードウェアトークン、ソフトウェアトークン、デジタル証明書です。適切に実装されていれば、リモート攻撃者が侵害することはかなり難しくなります。ただし、利用者は使用したいときに常に認証要素を持っている必要があるため、利用者に追加の管理負担も生じます。

### ワンタイムパスワードトークン

ワンタイムパスワード (One-Time Password: OTP) トークンは所持ベース認証の一形式であり、利用者は認証のために絶えず変化する数字コードを送信する必要があります。最も一般的なのは時間ベースワンタイムパスワード (Time-based One-Time Password: TOTP) トークンで、ハードウェアベースとソフトウェアベースの両方があります。

#### ハードウェア OTP トークン

ハードウェア OTP トークンは、認証時に送信しなければならない、絶えず変化する数字コードを生成します。最もよく知られているものは [RSA SecureID](https://en.wikipedia.org/wiki/RSA_SecurID) で、60 秒ごとに変化する 6 桁の数字を生成します。

##### 長所

- トークンは別個の物理デバイスであるため、攻撃者がリモートで侵害することはほぼ不可能です。
- 利用者がモバイル電話やその他のデバイスを持つ必要なく、トークンを使用できます。

##### 短所

- 物理トークンを利用者に配布することは高価で複雑です。
- 利用者がトークンを紛失した場合、新しいトークンを購入して発送するまでにかなりの時間がかかる可能性があります。
- 実装によってはバックエンドサーバーが必要であり、新たな脆弱性や単一障害点を導入する可能性があります。
- 盗まれたトークンは、PIN やデバイスロック解除コードなしで使用される可能性があります。
- フィッシングの影響を受けやすいです (ただし有効期間は短いです)。

#### ソフトウェア OTP トークン

ハードウェアトークンのより安価で容易な代替手段は、ソフトウェアを使用して時間ベースワンタイムパスワード (TOTP) コードを生成することです。通常、利用者がモバイル電話に TOTP アプリケーションをインストールし、Web アプリケーションから提供される初期シードを含む QR コードをスキャンします。その後、認証アプリはハードウェアトークンとほぼ同じ方法で、60 秒ごとに 6 桁の数字を生成します。

ほとんどの Web サイトは標準化された TOTP トークンを使用しており、利用者は TOTP をサポートする任意の認証アプリをインストールできます。ただし、少数のアプリケーションは独自の変種 (Symantec など) を使用しており、利用者はサービスを使用するために特定のアプリをインストールする必要があります。これは避け、標準ベースのアプローチを採用すべきです。

##### 長所

- 物理トークンが不要なため、システム実装のコストと管理上のオーバーヘッドが大幅に低減されます。
- 利用者が TOTP アプリへアクセスできなくなった場合でも、物理トークンを発送せずに新しいものを設定できます。
- TOTP は広く使用されており、多くの利用者はすでに少なくとも一つの TOTP アプリをインストールしています。
- 利用者の電話に画面ロックが設定されている限り、攻撃者が電話を盗んだとしてもコードを使用できません。

##### 短所

- TOTP アプリは通常、侵害されやすいモバイルデバイスにインストールされます。
- TOTP アプリが、認証に使用される同じモバイルデバイス (またはワークステーション) にインストールされている可能性があります。
- 利用者がバックアップシードを安全でない方法で保存する可能性があります。
- すべての利用者が TOTP に使用できるモバイルデバイスを持っているわけではありません。
- 利用者のモバイルデバイスが紛失、盗難、またはバッテリー切れになった場合、認証できなくなります。
- フィッシングの影響を受けやすいです (ただし有効期間は短いです)。

### Universal Second Factor

ハードウェア U2F トークン

Universal Second Factor (U2F) は、利用者にコードを手入力させるのではなく、チャレンジレスポンスベースの認証を実装する USB/NFC ハードウェアトークンの標準です。通常、これは利用者がトークン上のボタンを押すか、NFC リーダーにタップすることで行われます。最も一般的な U2F トークンは [YubiKey](https://www.yubico.com/products/yubikey-hardware/) です。

#### 長所

- 秘密鍵がトークンから出ないため、U2F トークンはフィッシングに耐性があります。
- 利用者はコードを入力する代わりに、ボタンを押すだけで済みます。
- トークンは別個の物理デバイスであるため、攻撃者がリモートで侵害することはほぼ不可能です。
- U2F は多くの主要 Web ブラウザでネイティブにサポートされています。
- U2F トークンは、利用者がモバイル電話やその他のデバイスを持つ必要なく使用できます。

#### 短所

- ハードウェア OTP トークンと同様に、物理トークンの使用は大きなコストと管理上のオーバーヘッドを導入します。
- 盗まれたトークンは、PIN やデバイスロック解除コードなしで使用される可能性があります。
- トークンは通常 USB 経由でワークステーションに接続されるため、利用者は忘れやすくなります。

### 証明書

デジタル証明書は利用者のデバイスに保存されるファイルであり、認証時に利用者のパスワードとともに自動的に提供されます。最も一般的な種類は X.509 証明書で、より一般的には[クライアント証明書](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html#client-certificates-and-mutual-tls)として知られています。証明書はすべての主要 Web ブラウザでサポートされており、一度インストールすれば利用者による追加操作は不要です。証明書は、利用者が他のアカウントに対して認証しようとすることを防ぐため、個人の利用者アカウントに紐付けるべきです。

#### 長所

- ハードウェアトークンを購入および管理する必要がありません。
- インストール後、証明書は利用者にとって非常に単純です。
- 証明書は一元管理および失効できます。
- フィッシングに耐性があります。

#### 短所

- デジタル証明書を使用するには、バックエンドの公開鍵基盤 (Public Key Infrastructure: PKI) が必要です。
- 特に厳しく制限された環境では、利用者が証明書をインストールすることが難しい場合があります。
- SSL 復号を行う企業プロキシサーバーは、証明書の使用を妨げます。
- 証明書は利用者のワークステーションに保存されるため、システムが侵害されると盗まれる可能性があります。

### スマートカード

スマートカードは、利用者用のデジタル証明書を含むチップを備えたクレジットカードサイズのカードであり、PIN でロック解除されます。オペレーティングシステム認証には一般的に使用されますが、Web アプリケーションではまれです。

#### 長所

- 盗まれたスマートカードは PIN なしでは使用できません。
- スマートカードは複数のアプリケーションやシステムで使用できます。
- フィッシングに耐性があります。

#### 短所

- スマートカードの管理と配布には、ハードウェアトークンと同じコストとオーバーヘッドがあります。
- スマートカードは現代のブラウザでネイティブにサポートされていないため、サードパーティソフトウェアが必要です。
- 多くのビジネスクラスのノート PC にはスマートカードリーダーが組み込まれていますが、家庭用システムにはないことがよくあります。
- スマートカードの使用にはバックエンド PKI が必要です。

### SMS と電話

> [!WARNING]
> NIST SP 800-63B-4 は、SS7 盗聴、SIM スワップ、番号移管攻撃のため、SMS および PSTN で配信されるコードを*制限付き*認証器と位置付けています。高価値アプリケーションや PII を扱うアプリケーションでは SMS を使用しないでください。SMS が唯一利用可能な要素である場合は、リスク受容を文書化し、アカウントごとのレート制限を強制し、SIM スワップのシグナルを監視し、TOTP、プッシュ通知、または WebAuthn/FIDO2 への移行を計画してください。

SMS メッセージまたは電話は、利用者が追加要素として送信しなければならない単回使用コードを提供するために使用できます。これらの方法がもたらすリスクのため、個人識別情報 (Personally Identifiable Information: PII) を保持するアプリケーションや、医療および銀行のように金融リスクがあるアプリケーションを保護するために使用すべきではありません。[NIST SP 800-63B](https://pages.nist.gov/800-63-3/sp800-63b.html) は、これらを制限付き認証器として分類し、PII を含むアプリケーションでの使用を推奨していません。

#### 長所

- 実装が比較的単純です。
- 利用者が自分のアカウントを携帯電話番号に紐付ける必要があります。

#### 短所

- 利用者がモバイルデバイスまたは固定電話を持っている必要があります。
- 通話またはメッセージを受信するため、利用者に電波またはインターネットアクセスが必要です。
- 通話や SMS メッセージの送信には費用がかかる可能性があり、攻撃者が大量のメッセージを要求して資金を使い果たさせることから保護する必要があります。
- SIM スワップ攻撃の影響を受けやすいです。
- SMS メッセージは、利用者が認証に使用している同じデバイスで受信される可能性があります。
- フィッシングの影響を受けやすいです。
- SMS はデバイスがロックされているときにプレビューされる可能性があります。
- SMS は悪意のある、または安全でないアプリケーションに読み取られる可能性があります。

### メール

メール検証では、利用者がメールアドレスに送信されたコードを入力するか、リンクをクリックする必要があります。メールが MFA の一形式に該当するかについては議論があります。なぜなら、利用者がメールアカウントに MFA を設定していない場合、それは単に利用者のメールパスワード (多くの場合、アプリケーションのパスワードと同じです) の知識を要求しているだけだからです。ただし、完全性のためここに含めています。

#### 長所

- 実装が非常に容易です。
- 別個のハードウェアやモバイルデバイスの要件がありません。

#### 短所

- メールアカウントのセキュリティに完全に依存しますが、メールアカウントには MFA がないことがよくあります。
- メールパスワードはアプリケーションパスワードと同じであることがよくあります。
- 利用者のメールが先に侵害された場合、保護を提供しません。
- メールは、利用者が認証に使用している同じデバイスで受信される可能性があります。
- フィッシングの影響を受けやすいです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Something You Are

Inherence-based authentication is based on the physical attributes of the user. This is less common for web applications as it requires the user to have specific hardware, and is often considered to be the most invasive in terms of privacy. However, it is commonly used for operating system authentication, and is also used in some mobile applications.

### Biometrics

The are a number of common types of biometrics that are used, including:

- Fingerprint scans
- Facial recognition
- Iris scans
- Voice recognition

#### Pros

- Well-implemented biometrics are hard to spoof, and require a targeted attack.
- Fast and convenient for users.

#### Cons

- Manual enrollment is required for the user.
- Custom (sometimes expensive) hardware is often required to read biometrics.
- Privacy concerns: Sensitive physical information must be stored about users.
- If compromised, biometric data can be difficult to change.
- Hardware may be vulnerable to additional attack vectors.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 本人であること

本人性ベース認証は、利用者の身体的属性に基づきます。これは、利用者が特定のハードウェアを持つ必要があり、プライバシーの観点で最も侵襲的とみなされることが多いため、Web アプリケーションではあまり一般的ではありません。ただし、オペレーティングシステム認証では一般的に使用され、一部のモバイルアプリケーションでも使用されます。

### 生体認証

使用される一般的な生体認証には、次のようなものがあります。

- 指紋スキャン
- 顔認識
- 虹彩スキャン
- 音声認識

#### 長所

- 適切に実装された生体認証はなりすましが難しく、標的型攻撃を必要とします。
- 利用者にとって高速で便利です。

#### 短所

- 利用者の手動登録が必要です。
- 生体情報を読み取るために、専用の (場合によっては高価な) ハードウェアが必要になることがよくあります。
- プライバシー上の懸念: 利用者に関する機微な身体情報を保存しなければなりません。
- 侵害された場合、生体データは変更が難しい可能性があります。
- ハードウェアが追加の攻撃ベクトルに対して脆弱な可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Somewhere You Are

Location-based authentication is based on the user's physical location. It is sometimes argued that location is used when deciding whether or not to require MFA (as discussed [above](#when-to-require-mfa)) however this is effectively the same as considering it to be a factor in its own right. Two prominent examples of this are the [Conditional Access Policies](https://docs.microsoft.com/en-us/azure/active-directory/conditional-access/overview) available in Microsoft Azure, and the [Network Unlock](https://docs.microsoft.com/en-us/windows/security/information-protection/bitlocker/bitlocker-how-to-enable-network-unlock) functionality in BitLocker.

### Source IP Address

The source IP address the user is connecting from can be used as a factor, typically in an allow-list based approach. This could either be based on a static list (such as corporate office ranges) or a dynamic list (such as previous IP addresses the user has authenticated from).

#### Pros

- Very easy for users.
- Requires minimal configuration and management from administrative staff.

#### Cons

- Doesn't provide any protection if the user's system is compromised.
- Doesn't provide any protection against rogue insiders.
- Trusted IP addresses must be carefully restricted (for example, if the open guest Wi-Fi uses the main corporate IP range).

### Geolocation

Rather than using the exact IP address of the user, the geographic location that the IP address is registered to can be used. This is less precise, but may be more feasible to implement in environments where IP addresses are not static. A common usage would be to require additional authentication factors when an authentication attempt is made from outside of the user's normal country.

#### Pros

- Very easy for users.

#### Cons

- Doesn't provide any protection if the user's system is compromised.
- Doesn't provide any protection against rogue insiders.
- Easy for an attacker to bypass by obtaining IP addresses in the trusted country or location.
- Privacy features such as Apple's [iCloud Private Relay](https://support.apple.com/en-us/102602) and VPNs can make this less accurate.

### Geofencing

Geofencing is a more precise version of geolocation, which allows the user to define a specific area in which they are allowed to authenticate. This is often used in mobile applications, where the user's location can be determined with a high degree of accuracy using geopositioning hardware like GPS.

#### Pros

- Very easy for users.
- Provides a high level of protection against remote attackers.

#### Cons

- Doesn't provide any protection if the user's system is compromised.
- Doesn't provide any protection against rogue insiders.
- Doesn't provide any protection against attackers who are physically close to the trusted location.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## いる場所

位置ベース認証は、利用者の物理的位置に基づきます。位置は MFA を要求するかどうかを判断するときに使用される (上記で[説明](#mfa-を要求するタイミング)した) と主張されることもありますが、これは実質的には位置をそれ自体の要素とみなすことと同じです。代表的な二つの例は、Microsoft Azure で利用可能な[条件付きアクセス ポリシー](https://docs.microsoft.com/en-us/azure/active-directory/conditional-access/overview)と、BitLocker の [Network Unlock](https://docs.microsoft.com/en-us/windows/security/information-protection/bitlocker/bitlocker-how-to-enable-network-unlock) 機能です。

### 送信元 IP アドレス

利用者が接続している送信元 IP アドレスは、通常は許可リストベースのアプローチで、要素として使用できます。これは静的リスト (企業オフィスの範囲など) または動的リスト (利用者が以前に認証した IP アドレスなど) に基づくことができます。

#### 長所

- 利用者にとって非常に容易です。
- 管理スタッフによる設定と管理が最小限で済みます。

#### 短所

- 利用者のシステムが侵害された場合、保護を提供しません。
- 悪意のある内部者に対する保護を提供しません。
- 信頼済み IP アドレスは慎重に制限する必要があります (たとえば、オープンなゲスト Wi-Fi が主要な企業 IP 範囲を使用している場合など)。

### 地理的位置

利用者の正確な IP アドレスを使用する代わりに、その IP アドレスが登録されている地理的位置を使用できます。これは精度は低いですが、IP アドレスが静的でない環境では実装しやすい可能性があります。一般的な使用例は、利用者の通常の国の外から認証試行が行われたときに追加の認証要素を要求することです。

#### 長所

- 利用者にとって非常に容易です。

#### 短所

- 利用者のシステムが侵害された場合、保護を提供しません。
- 悪意のある内部者に対する保護を提供しません。
- 攻撃者が信頼済みの国または場所の IP アドレスを取得することで容易にバイパスできます。
- Apple の [iCloud Private Relay](https://support.apple.com/en-us/102602) や VPN などのプライバシー機能により、精度が低下する可能性があります。

### ジオフェンシング

ジオフェンシングは地理的位置のより精密なバージョンであり、利用者が認証を許可される特定の領域を定義できます。これはモバイルアプリケーションでよく使用されます。モバイルアプリケーションでは、GPS のような測位ハードウェアを使用して、利用者の位置を高い精度で判断できるためです。

#### 長所

- 利用者にとって非常に容易です。
- リモート攻撃者に対して高い保護レベルを提供します。

#### 短所

- 利用者のシステムが侵害された場合、保護を提供しません。
- 悪意のある内部者に対する保護を提供しません。
- 信頼済み場所の物理的近くにいる攻撃者に対する保護を提供しません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Something You Do

Behavior-based authentication is based on the user's behavior, such as the way they type, move their mouse, or use their mobile device. This is the least common form of MFA and is combined with other factors to increase the level of assurance in the user's identity. It is also the most difficult to implement and may require specific hardware along with a significant amount of data and processing power to analyze the user's behavior.

### Behavioral Profiling

Behavioral profiling is based on the way the user interacts with the application, such as the time of day they log in, the devices they use, and the way they navigate the application. This is rapidly becoming more common in web applications when combined with [Risk Based Authentication](#risk-based-authentication) and [User and Entity Behavior Analytics](https://learn.microsoft.com/en-us/azure/sentinel/identify-threats-with-entity-behavior-analytics) (UEBA) systems.

#### Pros

- Doesn't require user interaction.
- Can be used to continuously authenticate the user.
- Combines well with other factors to increase the level of assurance in the user's identity.

#### Cons

- Early implementations of behavioral profiling were often inaccurate and caused a significant number of false positives.
- Requires large amounts of data and processing power to analyze the user's behavior.
- May be difficult to implement in environments where the user's behavior is likely to change frequently.

### Keystroke & Mouse Dynamics

Keystroke and mouse dynamics are based on the way the user types and moves their mouse. For example, the time between key presses, the time between key presses and releases, and the speed and acceleration of the mouse. Largely theoretical, and not widely used in practice.

#### Pros

- Can be used without requiring any additional hardware.
- Can be used without requiring any additional interaction from the user.
- Can be used to continuously authenticate the user.
- Can be used to detect when the user is not the one using the system.
- Can be used to detect when the user is under duress.
- Can be used to detect when the user is not in a fit state to use the system.

#### Cons

- Unlikely to be accurate enough to be used as a standalone factor.
- May be spoofed by AI or other advanced attacks.

### Gait Analysis

Gait analysis is based on the way the user walks using cameras and sensors. They are often used in physical security systems, but are not widely used in web applications. Mobile device applications may be able to use the accelerometer to detect the user's gait and use this as an additional factor, however this is still largely theoretical.

#### Pros

- Very difficult to spoof.
- May be used without requiring any additional interaction from the user.

#### Cons

- Requires specific hardware to implement.
- Use outside of physical security systems is not widely tested.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 行うこと

行動ベース認証は、利用者の入力方法、マウスの動かし方、モバイルデバイスの使い方など、利用者の行動に基づきます。これは最も一般的でない MFA 形式であり、利用者のアイデンティティに対する保証レベルを高めるため、他の要素と組み合わせて使用されます。また実装が最も難しく、利用者の行動を分析するために特定のハードウェアに加え、大量のデータと処理能力を必要とする可能性があります。

### 行動プロファイリング

行動プロファイリングは、利用者がログインする時間帯、使用するデバイス、アプリケーション内を移動する方法など、利用者がアプリケーションとやり取りする方法に基づきます。これは [Risk Based Authentication](#リスクベース認証) および [User and Entity Behavior Analytics](https://learn.microsoft.com/en-us/azure/sentinel/identify-threats-with-entity-behavior-analytics) (UEBA) システムと組み合わせることで、Web アプリケーションで急速に一般化しつつあります。

#### 長所

- 利用者の操作を必要としません。
- 利用者を継続的に認証するために使用できます。
- 利用者のアイデンティティに対する保証レベルを高めるため、他の要素とうまく組み合わせられます。

#### 短所

- 行動プロファイリングの初期実装は不正確なことが多く、多数の誤検知を引き起こしていました。
- 利用者の行動を分析するため、大量のデータと処理能力が必要です。
- 利用者の行動が頻繁に変化しやすい環境では、実装が難しい場合があります。

### キーストロークとマウス動作

キーストロークとマウス動作は、利用者の入力方法とマウスの動かし方に基づきます。たとえば、キー押下間の時間、キー押下と解放の間の時間、マウスの速度と加速度です。これは大部分が理論的なものであり、実際には広く使用されていません。

#### 長所

- 追加のハードウェアを必要とせずに使用できます。
- 利用者から追加の操作を必要とせずに使用できます。
- 利用者を継続的に認証するために使用できます。
- システムを使用しているのが利用者本人ではない場合を検出するために使用できます。
- 利用者が強要下にある場合を検出するために使用できます。
- 利用者がシステムを使用するのに適した状態ではない場合を検出するために使用できます。

#### 短所

- 単独の要素として使用できるほど十分に正確である可能性は低いです。
- AI またはその他の高度な攻撃によってなりすまされる可能性があります。

### 歩行分析

歩行分析は、カメラとセンサーを使用して利用者の歩き方に基づきます。これは物理セキュリティシステムでよく使用されますが、Web アプリケーションでは広く使用されていません。モバイルデバイスアプリケーションでは、加速度計を使用して利用者の歩行を検出し、追加要素として使用できる可能性がありますが、これはまだ大部分が理論的なものです。

#### 長所

- なりすましが非常に困難です。
- 利用者に追加操作を要求せずに使用できる可能性があります。

#### 短所

- 実装には特定のハードウェアが必要です。
- 物理セキュリティシステム以外での使用は広くテストされていません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Adaptive or Risk-Based Authentication

Adaptive (or Risk-Based) Authentication adjusts authentication requirements dynamically based on the context of the login attempt. This technique helps improve user experience while strengthening security by applying additional verification steps only when risk is elevated.

Common signals used to determine risk include:

- Geolocation and IP reputation
- Device fingerprinting
- Time of access (e.g., 3 AM login)
- Behavioral biometrics (e.g., typing speed or mouse movements)
- Known compromised credentials

If risk is detected, the system may:

- Prompt for an additional factor (e.g., OTP)
- Enforce re-authentication
- Deny access and trigger alerting or account protection flows

For more details on when to trigger reauthentication after high-risk events—such as account recovery or suspicious activity—see the [Reauthentication After Risk Events](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#reauthentication-after-risk-events) section in the Authentication Cheat Sheet

This method is widely used in modern authentication systems to balance usability and security. However, developers must ensure that risk signals cannot be spoofed and that fallback mechanisms are not weaker than the primary MFA methods.

**Example Use Case**: A user logs in from a trusted device in a usual location — no additional prompt is needed. But if they log in from a new country using a Tor exit node, the system requires SMS verification or triggers an account lock until further verification.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 適応型またはリスクベース認証

適応型 (またはリスクベース) 認証は、ログイン試行のコンテキストに基づいて認証要件を動的に調整します。この技術は、リスクが高まった場合にのみ追加の検証手順を適用することで、セキュリティを強化しながらユーザー体験を改善するのに役立ちます。

リスクを判断するために使用される一般的なシグナルには次が含まれます。

- 地理的位置と IP レピュテーション
- デバイスフィンガープリンティング
- アクセス時刻 (例: 午前 3 時のログイン)
- 行動生体情報 (例: 入力速度やマウスの動き)
- 既知の侵害済み認証情報

リスクが検出された場合、システムは次を行う可能性があります。

- 追加要素 (例: OTP) を要求する
- 再認証を強制する
- アクセスを拒否し、アラートまたはアカウント保護フローをトリガーする

アカウント回復や疑わしいアクティビティなど、高リスクイベント後にいつ再認証をトリガーするかの詳細については、Authentication Cheat Sheet の [Reauthentication After Risk Events](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#reauthentication-after-risk-events) セクションを参照してください。

この方法は、ユーザビリティとセキュリティのバランスを取るため、現代の認証システムで広く使用されています。ただし開発者は、リスクシグナルがなりすまされないこと、およびフォールバック機構が主要な MFA 方法より弱くないことを保証しなければなりません。

**ユースケース例**: 利用者が信頼済みデバイスから通常の場所でログインする場合、追加プロンプトは不要です。しかし、新しい国から Tor 出口ノードを使用してログインした場合、システムは SMS 検証を要求するか、追加確認が完了するまでアカウントロックをトリガーします。

</div>
</div>

</section>
</div>

## References

<div className="referenceFooter">

- [NIST SP 800-63](https://pages.nist.gov/800-63-3/sp800-63b.html)
- [Your Pa$$word doesn't matter](https://techcommunity.microsoft.com/t5/Azure-Active-Directory-Identity/Your-Pa-word-doesn-t-matter/ba-p/731984)
- [FIDO2](https://fidoalliance.org/fido2/)
- [ENISA Handbook on Security of Personal Data Processing](https://www.enisa.europa.eu/publications/handbook-on-security-of-personal-data-processing/@@download/fullReport)
- [Google Cloud Adding MFA](https://cloud.google.com/identity-platform/docs/web/mfa)

</div>

## Attribution

<div className="attributionFooter">

- Original: Multifactor Authentication Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: English original retained for comparison. Japanese translation added. Bilingual display generated from official source and local Japanese translation.
- Retrieved: 2026-05-21

</div>
