---
title: Forgot Password Cheat Sheet
hide_title: true
---

<div className="docHero" data-category="authentication">
  <h1>パスワード忘れ対応チートシート</h1>
  <div className="docMeta">
    <span className="docPill">最終更新: 2026-05-20</span>
    <span className="docPill">読了時間: 約 10 分</span>
    <span className="docPill">カテゴリ: 認証</span>
  </div>
</div>

<p className="docLead">パスワード忘れ対応チートシートを、原文・翻訳・対比表示で確認できます。ASVS Index 対応の文脈で、公式原文と日本語訳を確認しやすく整理しています。</p>

<div className="tabbedContent">
  <input className="tabInput" type="radio" name="forgot-password-view" id="forgot-password-original" />
  <input className="tabInput" type="radio" name="forgot-password-view" id="forgot-password-translation" defaultChecked />
  <input className="tabInput" type="radio" name="forgot-password-view" id="forgot-password-bilingual" />

  <div className="contentTabs">
    <label htmlFor="forgot-password-original" title="OWASP 原文">原文</label>
    <label htmlFor="forgot-password-translation" title="日本語訳">翻訳</label>
    <label htmlFor="forgot-password-bilingual" title="原文と翻訳を並べて確認">対比表示</label>
  </div>

<section id="forgot-password-original-panel" className="tabPanel originalPanel contentPanel">

## Introduction

In order to implement a proper user management system, systems integrate a **Forgot Password** service that allows the user to request a password reset.

Even though this functionality looks straightforward and easy to implement, it is a common source of vulnerabilities, such as the renowned [user enumeration attack](https://owasp.org/www-project-web-security-testing-guide/stable/4-Web_Application_Security_Testing/03-Identity_Management_Testing/04-Testing_for_Account_Enumeration_and_Guessable_User_Account.html).

The following short guidelines can be used as a quick reference to protect the forgot password service:

- **Return a consistent message for both existent and non-existent accounts.**
- **Ensure that the time taken for the user response message is uniform.**
- **Use a side-channel to communicate the method to reset their password.**
- **Use [URL tokens](#url-tokens) for the simplest and fastest implementation.**
- **Ensure that generated tokens or codes are:**
    - **Randomly generated using a cryptographically safe algorithm.**
    - **Sufficiently long to protect against brute-force attacks.**
    - **Stored securely.**
    - **Single use and expire after an appropriate period.**
- **Do not make a change to the account until a valid token is presented, such as locking out the account.**

This cheat sheet is focused on resetting users passwords. For guidance on resetting multifactor authentication (MFA), see the relevant section in the [Multifactor Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html#resetting-mfa).

## Forgot Password Service

The password reset process can be broken into two main steps, detailed in the following sections.

### Forgot Password Request

When a user uses the forgot password service and inputs their username or email, the below should be followed to implement a secure process:

- Return a consistent message for both existent and non-existent accounts.
- Ensure that responses return in a consistent amount of time to prevent an attacker enumerating which accounts exist. This could be achieved by using asynchronous calls or by making sure that the same logic is followed, instead of using a quick exit method.
- Implement protections against excessive automated submissions such as rate-limiting on a per-account basis, requiring a CAPTCHA, or other controls. Otherwise an attacker could make thousands of password reset requests per hour for a given account, flooding the user's intake system (e.g., email inbox or SMS) with useless requests.
- Employ normal security measures, such as [SQL Injection Prevention methods](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html) and [Input Validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html).

### User Resets Password

Once the user has proved their identity by providing the token (sent via an email) or code (sent via SMS or other mechanisms), they should reset their password to a new secure one. In order to secure this step, the measures that should be taken are:

- The user should confirm the password they set by writing it twice.
- Ensure that a secure password policy is in place, and is consistent with the rest of the application.
- Update and store the password following [secure practices](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html).
- Send the user an email informing them that their password has been reset (do not send the password in the email!).
- Once they have set their new password, the user should then login through the usual mechanism. Don't automatically log the user in, as this introduces additional complexity to the authentication and session handling code, and increases the likelihood of introducing vulnerabilities.
- Ask the user if they want to invalidate all of their existing sessions, or invalidate the sessions automatically.

## Methods

In order to allow a user to request a password reset, you will need to have some way to identify the user, or a means to reach out to them through a side-channel.

This can be done through any of the following methods:

- [URL tokens](#url-tokens).
- [PINs](#pins)
- [Offline methods](#offline-methods)
- [Security questions](#security-questions).

These methods can be used together to provide a greater degree of assurance that the user is who they claim to be. No matter what, you must ensure that a user always has a way to recover their account, even if that involves contacting the support team and proving their identity to staff.

### General Security Practices

It is essential to employ good security practices for the reset identifiers (tokens, codes, PINs, etc.). Some points don't apply to the [offline methods](#offline-methods), such as the lifetime restriction. All tokens and codes should be:

- Generated using a [cryptographically secure random number generator](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html#secure-random-number-generation).
    - It is also possible to use JSON Web Tokens (JWTs) in place of random tokens, although this can introduce additional vulnerability, such as those discussed in the [JSON Web Token Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html).
- Long enough to protect against brute-force attacks.
- Linked to an individual user in the database.
- Invalidated after they have been used.
- Stored in a secure manner, as discussed in the [Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html).

### URL Tokens

URL tokens are passed in the query string of the URL, and are typically sent to the user via email. The basic overview of the process is as follows:

1. Generate a token for the user and attach it in the URL query string.
2. Send this token to the user via email.
   - Don't rely on the [Host](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Host) header while creating the reset URLs to avoid [Host Header Injection](https://owasp.org/www-project-web-security-testing-guide/stable/4-Web_Application_Security_Testing/07-Input_Validation_Testing/17-Testing_for_Host_Header_Injection) attacks. The URL should either be hard-coded, or validated against a list of trusted domains.
   - Ensure that the URL is using HTTPS.
3. The user receives the email, and browses to the URL with the attached token.
   - Ensure that the reset password page adds the [Referrer Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy) tag with the `noreferrer` value in order to avoid [referrer leakage](https://portswigger.net/kb/issues/00500400_cross-domain-referer-leakage).
   - Implement appropriate protection to prevent users from brute-forcing tokens in the URL, such as rate limiting.
4. If required, perform any additional validation steps such as requiring the user to answer [security questions](#security-questions).
5. Let the user create a new password and confirm it. Ensure that the same password policy used elsewhere in the application is applied.

*Note:* URL tokens can follow on the same behavior of the [PINs](#pins) by creating a restricted session from the token. Decision should be made based on the needs and the expertise of the developer.

### PINs

PINs are numbers (between 6 and 12 digits) that are sent to the user through a side-channel such as SMS.

1. Generate a PIN.
2. Send it to the user via SMS or another mechanism.
   - Breaking the PIN up with spaces makes it easier for the user to read and enter.
3. The user then enters the PIN along with their username on the password reset page.
4. Create a limited session from that PIN that only permits the user to reset their password.
5. Let the user create a new password and confirm it. Ensure that the same password policy used elsewhere in the application is applied.

### Offline Methods

Offline methods differ from other methods by allowing the user to reset their password without requesting a special identifier (such as a token or PIN) from the backend. However, authentication still needs to be conducted by the backend to ensure that the request is legitimate. Offline methods provide a certain identifier either on registration, or when the user wishes to configure it.

These identifiers should be stored offline and in a secure fashion (*e.g.* password managers), and the backend should properly follow the [general security practices](#general-security-practices). Some implementations are built on [hardware OTP tokens](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html#hardware-otp-tokens), [certificates](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html#certificates), or any other implementation that could be used inside of an enterprise. These are out of scope for this cheat sheet.

If account has MFA enabled, and you are looking for MFA recovery, different methods can be found in the corresponding [Multifactor Authentication cheat sheet](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html#resetting-mfa).

### Security Questions

Security questions should not be used as the sole mechanism for resetting passwords due to their answers frequently being easily guessable or obtainable by attackers. However, they can provide an additional layer of security when combined with the other methods discussed in this cheat sheet. If they are used, then ensure that secure questions are chosen as discussed in the [Security Questions cheat sheet](https://cheatsheetseries.owasp.org/cheatsheets/Choosing_and_Using_Security_Questions_Cheat_Sheet.html).

## Account Lockout

Accounts should not be locked out in response to a forgotten password attack, as this can be used to deny access to users with known usernames. For more details on account lockouts, see the [Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html).

</section>

<section id="forgot-password-translation-panel" className="tabPanel translationPanel contentPanel">

## はじめに

適切なユーザー管理システムを実装するため、システムは利用者がパスワードリセットを要求できる **パスワード忘れ対応 (Forgot Password)** サービスを組み込む。

この機能は単純で実装しやすいように見えるが、よく知られた [ユーザー列挙攻撃](https://owasp.org/www-project-web-security-testing-guide/stable/4-Web_Application_Security_Testing/03-Identity_Management_Testing/04-Testing_for_Account_Enumeration_and_Guessable_User_Account.html) など、脆弱性の一般的な発生源である。

以下の短いガイドラインは、パスワード忘れ対応サービスを保護するためのクイックリファレンスとして使用できる。

- **存在するアカウントと存在しないアカウントの両方に、一貫したメッセージを返す。**
- **ユーザーへの応答メッセージにかかる時間が一定になるようにする。**
- **パスワードをリセットする方法を伝えるためにサイドチャネルを使用する。**
- **最も単純で迅速な実装には [URL トークン](#url-トークン) を使用する。**
- **生成されるトークンやコードが以下を満たすようにする。**
    - **暗号学的に安全なアルゴリズムを使用してランダムに生成される。**
    - **総当たり攻撃に耐える十分な長さがある。**
    - **安全に保存される。**
    - **単回使用であり、適切な期間後に失効する。**
- **アカウントのロックアウトなど、有効なトークンが提示されるまでアカウントに変更を加えない。**

このチートシートは、利用者のパスワードリセットに焦点を当てている。多要素認証 (MFA) のリセットに関するガイダンスについては、[多要素認証チートシート](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html#resetting-mfa) の関連セクションを参照する。

## パスワード忘れ対応サービス

パスワードリセットプロセスは、以下のセクションで詳述する二つの主なステップに分けられる。

### パスワード忘れ対応リクエスト

利用者がパスワード忘れ対応サービスを使用し、ユーザー名またはメールアドレスを入力する場合、安全なプロセスを実装するために以下に従うべきである。

- 存在するアカウントと存在しないアカウントの両方に、一貫したメッセージを返す。
- 攻撃者がどのアカウントが存在するかを列挙できないよう、応答が一貫した時間で返るようにする。これは非同期呼び出しを使用する、または早期終了方式ではなく同じロジックが実行されるようにすることで実現できる。
- アカウント単位のレート制限、CAPTCHA の要求、その他の制御など、過剰な自動送信に対する保護を実装する。そうしない場合、攻撃者は特定アカウントに対して 1 時間に何千件ものパスワードリセット要求を行い、利用者の受信システム (メール受信箱や SMS など) を無用な要求であふれさせる可能性がある。
- [SQL インジェクション防止方法](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html) や [入力検証](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html) など、通常のセキュリティ対策を適用する。

### 利用者によるパスワードリセット

利用者が (メールで送信された) トークン、または (SMS やその他の仕組みで送信された) コードを提示して本人性を証明したら、新しい安全なパスワードにリセットすべきである。このステップを保護するために取るべき対策は以下である。

- 利用者は、設定するパスワードを 2 回入力して確認すべきである。
- 安全なパスワードポリシーが導入され、アプリケーションの他の部分と一貫していることを確認する。
- [安全なプラクティス](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html) に従ってパスワードを更新し保存する。
- パスワードがリセットされたことを利用者に知らせるメールを送信する (メールにパスワードを含めてはならない)。
- 新しいパスワードを設定した後、利用者は通常の仕組みでログインすべきである。利用者を自動的にログインさせてはならない。これは認証およびセッション処理コードに追加の複雑さを持ち込み、脆弱性を混入させる可能性を高めるためである。
- 既存のすべてのセッションを無効化するか利用者に確認する、または自動的にセッションを無効化する。

## 方法

利用者がパスワードリセットを要求できるようにするには、利用者を識別する何らかの方法、またはサイドチャネルを通じて利用者に連絡する手段が必要である。

これは以下のいずれかの方法で実現できる。

- [URL トークン](#url-トークン)。
- [PIN](#pin)
- [オフライン方式](#オフライン方式)
- [秘密の質問](#秘密の質問)。

これらの方法は、利用者が主張どおりの本人であることに対する保証度を高めるために併用できる。いずれの場合でも、サポートチームに連絡してスタッフに本人性を証明する必要があるとしても、利用者が常にアカウントを回復する手段を持つようにしなければならない。

### 一般的なセキュリティプラクティス

リセット識別子 (トークン、コード、PIN など) には、適切なセキュリティプラクティスを適用することが不可欠である。有効期間の制限など、一部の事項は [オフライン方式](#オフライン方式) には適用されない。すべてのトークンとコードは以下を満たすべきである。

- [暗号学的に安全な乱数生成器](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html#secure-random-number-generation) を使用して生成する。
    - ランダムトークンの代わりに JSON Web Token (JWT) を使用することも可能だが、[JSON Web Token チートシート](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html) で説明されているような追加の脆弱性を持ち込む可能性がある。
- 総当たり攻撃に耐える十分な長さにする。
- データベース内の個別利用者に紐付ける。
- 使用後に無効化する。
- [パスワードストレージチートシート](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html) で説明されているように、安全な方法で保存する。

### URL トークン

URL トークンは URL のクエリ文字列で渡され、通常はメールで利用者に送信される。プロセスの基本的な概要は以下のとおりである。

1. 利用者用のトークンを生成し、URL クエリ文字列に付加する。
2. このトークンをメールで利用者に送信する。
   - リセット URL の作成時には、[Host](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Host) ヘッダーに依存してはならない。これは [Host ヘッダーインジェクション](https://owasp.org/www-project-web-security-testing-guide/stable/4-Web_Application_Security_Testing/07-Input_Validation_Testing/17-Testing_for_Host_Header_Injection) 攻撃を避けるためである。URL はハードコードするか、信頼済みドメインのリストに照らして検証すべきである。
   - URL が HTTPS を使用していることを確認する。
3. 利用者はメールを受け取り、付加されたトークンを含む URL にアクセスする。
   - リファラ漏えいを避けるため、パスワードリセットページが `noreferrer` 値を持つ [Referrer Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy) タグを追加するようにする。
   - レート制限など、利用者が URL 内のトークンを総当たりできないようにする適切な保護を実装する。
4. 必要に応じて、利用者に [秘密の質問](#秘密の質問) への回答を要求するなど、追加の検証ステップを実行する。
5. 利用者に新しいパスワードを作成して確認させる。アプリケーションの他の場所で使用しているものと同じパスワードポリシーが適用されることを確認する。

*注:* URL トークンは、トークンから制限付きセッションを作成することで、[PIN](#pin) と同じ挙動に従うこともできる。判断は開発者のニーズと専門性に基づいて行うべきである。

### PIN

PIN は、SMS などのサイドチャネルを通じて利用者に送信される数字 (6 から 12 桁) である。

1. PIN を生成する。
2. SMS または別の仕組みで利用者に送信する。
   - PIN をスペースで区切ると、利用者が読み取り入力しやすくなる。
3. 利用者はパスワードリセットページで、ユーザー名とともに PIN を入力する。
4. その PIN から、利用者のパスワードリセットのみを許可する制限付きセッションを作成する。
5. 利用者に新しいパスワードを作成して確認させる。アプリケーションの他の場所で使用しているものと同じパスワードポリシーが適用されることを確認する。

### オフライン方式

オフライン方式は、利用者がバックエンドから特別な識別子 (トークンや PIN など) を要求せずにパスワードをリセットできる点で、他の方式と異なる。ただし、要求が正当であることを確認するため、認証は引き続きバックエンドで行う必要がある。オフライン方式では、登録時、または利用者が設定したいときに特定の識別子を提供する。

これらの識別子はオフラインかつ安全な方法 (*例:* パスワードマネージャー) で保存されるべきであり、バックエンドは [一般的なセキュリティプラクティス](#一般的なセキュリティプラクティス) に適切に従うべきである。一部の実装は、[ハードウェア OTP トークン](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html#hardware-otp-tokens)、[証明書](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html#certificates)、またはエンタープライズ内で使用できるその他の実装に基づいている。これらはこのチートシートの対象外である。

アカウントで MFA が有効化されており、MFA 回復を探している場合は、対応する [多要素認証チートシート](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html#resetting-mfa) に別の方法が記載されている。

### 秘密の質問

秘密の質問は、その回答が攻撃者に推測されやすい、または入手されやすいことが多いため、パスワードリセットの唯一の仕組みとして使用すべきではない。ただし、このチートシートで説明した他の方法と組み合わせることで、追加のセキュリティ層を提供できる。使用する場合は、[秘密の質問チートシート](https://cheatsheetseries.owasp.org/cheatsheets/Choosing_and_Using_Security_Questions_Cheat_Sheet.html) で説明されているように、安全な質問が選ばれていることを確認する。

## アカウントロックアウト

パスワード忘れ攻撃に応答してアカウントをロックアウトすべきではない。これは、既知のユーザー名を持つ利用者へのアクセスを拒否するために悪用される可能性があるためである。アカウントロックアウトの詳細については、[認証チートシート](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html) を参照する。

</section>

<section id="forgot-password-bilingual-panel" className="tabPanel bilingualPanel">

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Introduction

In order to implement a proper user management system, systems integrate a **Forgot Password** service that allows the user to request a password reset.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## はじめに

適切なユーザー管理システムを実装するため、システムは利用者がパスワードリセットを要求できる **パスワード忘れ対応 (Forgot Password)** サービスを組み込む。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Even though this functionality looks straightforward and easy to implement, it is a common source of vulnerabilities, such as the renowned [user enumeration attack](https://owasp.org/www-project-web-security-testing-guide/stable/4-Web_Application_Security_Testing/03-Identity_Management_Testing/04-Testing_for_Account_Enumeration_and_Guessable_User_Account.html).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

この機能は単純で実装しやすいように見えるが、よく知られた [ユーザー列挙攻撃](https://owasp.org/www-project-web-security-testing-guide/stable/4-Web_Application_Security_Testing/03-Identity_Management_Testing/04-Testing_for_Account_Enumeration_and_Guessable_User_Account.html) など、脆弱性の一般的な発生源である。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The following short guidelines can be used as a quick reference to protect the forgot password service:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

以下の短いガイドラインは、パスワード忘れ対応サービスを保護するためのクイックリファレンスとして使用できる。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- **Return a consistent message for both existent and non-existent accounts.**
- **Ensure that the time taken for the user response message is uniform.**
- **Use a side-channel to communicate the method to reset their password.**
- **Use [URL tokens](#url-tokens) for the simplest and fastest implementation.**
- **Ensure that generated tokens or codes are:**
    - **Randomly generated using a cryptographically safe algorithm.**
    - **Sufficiently long to protect against brute-force attacks.**
    - **Stored securely.**
    - **Single use and expire after an appropriate period.**
- **Do not make a change to the account until a valid token is presented, such as locking out the account.**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- **存在するアカウントと存在しないアカウントの両方に、一貫したメッセージを返す。**
- **ユーザーへの応答メッセージにかかる時間が一定になるようにする。**
- **パスワードをリセットする方法を伝えるためにサイドチャネルを使用する。**
- **最も単純で迅速な実装には [URL トークン](#url-トークン) を使用する。**
- **生成されるトークンやコードが以下を満たすようにする。**
    - **暗号学的に安全なアルゴリズムを使用してランダムに生成される。**
    - **総当たり攻撃に耐える十分な長さがある。**
    - **安全に保存される。**
    - **単回使用であり、適切な期間後に失効する。**
- **アカウントのロックアウトなど、有効なトークンが提示されるまでアカウントに変更を加えない。**

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

This cheat sheet is focused on resetting users passwords. For guidance on resetting multifactor authentication (MFA), see the relevant section in the [Multifactor Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html#resetting-mfa).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

このチートシートは、利用者のパスワードリセットに焦点を当てている。多要素認証 (MFA) のリセットに関するガイダンスについては、[多要素認証チートシート](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html#resetting-mfa) の関連セクションを参照する。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Forgot Password Service

The password reset process can be broken into two main steps, detailed in the following sections.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## パスワード忘れ対応サービス

パスワードリセットプロセスは、以下のセクションで詳述する二つの主なステップに分けられる。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Forgot Password Request

When a user uses the forgot password service and inputs their username or email, the below should be followed to implement a secure process:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### パスワード忘れ対応リクエスト

利用者がパスワード忘れ対応サービスを使用し、ユーザー名またはメールアドレスを入力する場合、安全なプロセスを実装するために以下に従うべきである。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Return a consistent message for both existent and non-existent accounts.
- Ensure that responses return in a consistent amount of time to prevent an attacker enumerating which accounts exist. This could be achieved by using asynchronous calls or by making sure that the same logic is followed, instead of using a quick exit method.
- Implement protections against excessive automated submissions such as rate-limiting on a per-account basis, requiring a CAPTCHA, or other controls. Otherwise an attacker could make thousands of password reset requests per hour for a given account, flooding the user's intake system (e.g., email inbox or SMS) with useless requests.
- Employ normal security measures, such as [SQL Injection Prevention methods](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html) and [Input Validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- 存在するアカウントと存在しないアカウントの両方に、一貫したメッセージを返す。
- 攻撃者がどのアカウントが存在するかを列挙できないよう、応答が一貫した時間で返るようにする。これは非同期呼び出しを使用する、または早期終了方式ではなく同じロジックが実行されるようにすることで実現できる。
- アカウント単位のレート制限、CAPTCHA の要求、その他の制御など、過剰な自動送信に対する保護を実装する。そうしない場合、攻撃者は特定アカウントに対して 1 時間に何千件ものパスワードリセット要求を行い、利用者の受信システム (メール受信箱や SMS など) を無用な要求であふれさせる可能性がある。
- [SQL インジェクション防止方法](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html) や [入力検証](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html) など、通常のセキュリティ対策を適用する。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### User Resets Password

Once the user has proved their identity by providing the token (sent via an email) or code (sent via SMS or other mechanisms), they should reset their password to a new secure one. In order to secure this step, the measures that should be taken are:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 利用者によるパスワードリセット

利用者が (メールで送信された) トークン、または (SMS やその他の仕組みで送信された) コードを提示して本人性を証明したら、新しい安全なパスワードにリセットすべきである。このステップを保護するために取るべき対策は以下である。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- The user should confirm the password they set by writing it twice.
- Ensure that a secure password policy is in place, and is consistent with the rest of the application.
- Update and store the password following [secure practices](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html).
- Send the user an email informing them that their password has been reset (do not send the password in the email!).
- Once they have set their new password, the user should then login through the usual mechanism. Don't automatically log the user in, as this introduces additional complexity to the authentication and session handling code, and increases the likelihood of introducing vulnerabilities.
- Ask the user if they want to invalidate all of their existing sessions, or invalidate the sessions automatically.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- 利用者は、設定するパスワードを 2 回入力して確認すべきである。
- 安全なパスワードポリシーが導入され、アプリケーションの他の部分と一貫していることを確認する。
- [安全なプラクティス](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html) に従ってパスワードを更新し保存する。
- パスワードがリセットされたことを利用者に知らせるメールを送信する (メールにパスワードを含めてはならない)。
- 新しいパスワードを設定した後、利用者は通常の仕組みでログインすべきである。利用者を自動的にログインさせてはならない。これは認証およびセッション処理コードに追加の複雑さを持ち込み、脆弱性を混入させる可能性を高めるためである。
- 既存のすべてのセッションを無効化するか利用者に確認する、または自動的にセッションを無効化する。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Methods

In order to allow a user to request a password reset, you will need to have some way to identify the user, or a means to reach out to them through a side-channel.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 方法

利用者がパスワードリセットを要求できるようにするには、利用者を識別する何らかの方法、またはサイドチャネルを通じて利用者に連絡する手段が必要である。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

This can be done through any of the following methods:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

これは以下のいずれかの方法で実現できる。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- [URL tokens](#url-tokens).
- [PINs](#pins)
- [Offline methods](#offline-methods)
- [Security questions](#security-questions).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- [URL トークン](#url-トークン)。
- [PIN](#pin)
- [オフライン方式](#オフライン方式)
- [秘密の質問](#秘密の質問)。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

These methods can be used together to provide a greater degree of assurance that the user is who they claim to be. No matter what, you must ensure that a user always has a way to recover their account, even if that involves contacting the support team and proving their identity to staff.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

これらの方法は、利用者が主張どおりの本人であることに対する保証度を高めるために併用できる。いずれの場合でも、サポートチームに連絡してスタッフに本人性を証明する必要があるとしても、利用者が常にアカウントを回復する手段を持つようにしなければならない。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### General Security Practices

It is essential to employ good security practices for the reset identifiers (tokens, codes, PINs, etc.). Some points don't apply to the [offline methods](#offline-methods), such as the lifetime restriction. All tokens and codes should be:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 一般的なセキュリティプラクティス

リセット識別子 (トークン、コード、PIN など) には、適切なセキュリティプラクティスを適用することが不可欠である。有効期間の制限など、一部の事項は [オフライン方式](#オフライン方式) には適用されない。すべてのトークンとコードは以下を満たすべきである。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Generated using a [cryptographically secure random number generator](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html#secure-random-number-generation).
    - It is also possible to use JSON Web Tokens (JWTs) in place of random tokens, although this can introduce additional vulnerability, such as those discussed in the [JSON Web Token Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html).
- Long enough to protect against brute-force attacks.
- Linked to an individual user in the database.
- Invalidated after they have been used.
- Stored in a secure manner, as discussed in the [Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- [暗号学的に安全な乱数生成器](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html#secure-random-number-generation) を使用して生成する。
    - ランダムトークンの代わりに JSON Web Token (JWT) を使用することも可能だが、[JSON Web Token チートシート](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html) で説明されているような追加の脆弱性を持ち込む可能性がある。
- 総当たり攻撃に耐える十分な長さにする。
- データベース内の個別利用者に紐付ける。
- 使用後に無効化する。
- [パスワードストレージチートシート](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html) で説明されているように、安全な方法で保存する。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### URL Tokens

URL tokens are passed in the query string of the URL, and are typically sent to the user via email. The basic overview of the process is as follows:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### URL トークン

URL トークンは URL のクエリ文字列で渡され、通常はメールで利用者に送信される。プロセスの基本的な概要は以下のとおりである。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

1. Generate a token for the user and attach it in the URL query string.
2. Send this token to the user via email.
   - Don't rely on the [Host](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Host) header while creating the reset URLs to avoid [Host Header Injection](https://owasp.org/www-project-web-security-testing-guide/stable/4-Web_Application_Security_Testing/07-Input_Validation_Testing/17-Testing_for_Host_Header_Injection) attacks. The URL should either be hard-coded, or validated against a list of trusted domains.
   - Ensure that the URL is using HTTPS.
3. The user receives the email, and browses to the URL with the attached token.
   - Ensure that the reset password page adds the [Referrer Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy) tag with the `noreferrer` value in order to avoid [referrer leakage](https://portswigger.net/kb/issues/00500400_cross-domain-referer-leakage).
   - Implement appropriate protection to prevent users from brute-forcing tokens in the URL, such as rate limiting.
4. If required, perform any additional validation steps such as requiring the user to answer [security questions](#security-questions).
5. Let the user create a new password and confirm it. Ensure that the same password policy used elsewhere in the application is applied.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

1. 利用者用のトークンを生成し、URL クエリ文字列に付加する。
2. このトークンをメールで利用者に送信する。
   - リセット URL の作成時には、[Host](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Host) ヘッダーに依存してはならない。これは [Host ヘッダーインジェクション](https://owasp.org/www-project-web-security-testing-guide/stable/4-Web_Application_Security_Testing/07-Input_Validation_Testing/17-Testing_for_Host_Header_Injection) 攻撃を避けるためである。URL はハードコードするか、信頼済みドメインのリストに照らして検証すべきである。
   - URL が HTTPS を使用していることを確認する。
3. 利用者はメールを受け取り、付加されたトークンを含む URL にアクセスする。
   - リファラ漏えいを避けるため、パスワードリセットページが `noreferrer` 値を持つ [Referrer Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy) タグを追加するようにする。
   - レート制限など、利用者が URL 内のトークンを総当たりできないようにする適切な保護を実装する。
4. 必要に応じて、利用者に [秘密の質問](#秘密の質問) への回答を要求するなど、追加の検証ステップを実行する。
5. 利用者に新しいパスワードを作成して確認させる。アプリケーションの他の場所で使用しているものと同じパスワードポリシーが適用されることを確認する。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

*Note:* URL tokens can follow on the same behavior of the [PINs](#pins) by creating a restricted session from the token. Decision should be made based on the needs and the expertise of the developer.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

*注:* URL トークンは、トークンから制限付きセッションを作成することで、[PIN](#pin) と同じ挙動に従うこともできる。判断は開発者のニーズと専門性に基づいて行うべきである。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### PINs

PINs are numbers (between 6 and 12 digits) that are sent to the user through a side-channel such as SMS.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### PIN

PIN は、SMS などのサイドチャネルを通じて利用者に送信される数字 (6 から 12 桁) である。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

1. Generate a PIN.
2. Send it to the user via SMS or another mechanism.
   - Breaking the PIN up with spaces makes it easier for the user to read and enter.
3. The user then enters the PIN along with their username on the password reset page.
4. Create a limited session from that PIN that only permits the user to reset their password.
5. Let the user create a new password and confirm it. Ensure that the same password policy used elsewhere in the application is applied.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

1. PIN を生成する。
2. SMS または別の仕組みで利用者に送信する。
   - PIN をスペースで区切ると、利用者が読み取り入力しやすくなる。
3. 利用者はパスワードリセットページで、ユーザー名とともに PIN を入力する。
4. その PIN から、利用者のパスワードリセットのみを許可する制限付きセッションを作成する。
5. 利用者に新しいパスワードを作成して確認させる。アプリケーションの他の場所で使用しているものと同じパスワードポリシーが適用されることを確認する。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Offline Methods

Offline methods differ from other methods by allowing the user to reset their password without requesting a special identifier (such as a token or PIN) from the backend. However, authentication still needs to be conducted by the backend to ensure that the request is legitimate. Offline methods provide a certain identifier either on registration, or when the user wishes to configure it.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### オフライン方式

オフライン方式は、利用者がバックエンドから特別な識別子 (トークンや PIN など) を要求せずにパスワードをリセットできる点で、他の方式と異なる。ただし、要求が正当であることを確認するため、認証は引き続きバックエンドで行う必要がある。オフライン方式では、登録時、または利用者が設定したいときに特定の識別子を提供する。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

These identifiers should be stored offline and in a secure fashion (*e.g.* password managers), and the backend should properly follow the [general security practices](#general-security-practices). Some implementations are built on [hardware OTP tokens](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html#hardware-otp-tokens), [certificates](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html#certificates), or any other implementation that could be used inside of an enterprise. These are out of scope for this cheat sheet.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

これらの識別子はオフラインかつ安全な方法 (*例:* パスワードマネージャー) で保存されるべきであり、バックエンドは [一般的なセキュリティプラクティス](#一般的なセキュリティプラクティス) に適切に従うべきである。一部の実装は、[ハードウェア OTP トークン](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html#hardware-otp-tokens)、[証明書](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html#certificates)、またはエンタープライズ内で使用できるその他の実装に基づいている。これらはこのチートシートの対象外である。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

If account has MFA enabled, and you are looking for MFA recovery, different methods can be found in the corresponding [Multifactor Authentication cheat sheet](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html#resetting-mfa).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

アカウントで MFA が有効化されており、MFA 回復を探している場合は、対応する [多要素認証チートシート](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html#resetting-mfa) に別の方法が記載されている。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Security Questions

Security questions should not be used as the sole mechanism for resetting passwords due to their answers frequently being easily guessable or obtainable by attackers. However, they can provide an additional layer of security when combined with the other methods discussed in this cheat sheet. If they are used, then ensure that secure questions are chosen as discussed in the [Security Questions cheat sheet](https://cheatsheetseries.owasp.org/cheatsheets/Choosing_and_Using_Security_Questions_Cheat_Sheet.html).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 秘密の質問

秘密の質問は、その回答が攻撃者に推測されやすい、または入手されやすいことが多いため、パスワードリセットの唯一の仕組みとして使用すべきではない。ただし、このチートシートで説明した他の方法と組み合わせることで、追加のセキュリティ層を提供できる。使用する場合は、[秘密の質問チートシート](https://cheatsheetseries.owasp.org/cheatsheets/Choosing_and_Using_Security_Questions_Cheat_Sheet.html) で説明されているように、安全な質問が選ばれていることを確認する。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Account Lockout

Accounts should not be locked out in response to a forgotten password attack, as this can be used to deny access to users with known usernames. For more details on account lockouts, see the [Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## アカウントロックアウト

パスワード忘れ攻撃に応答してアカウントをロックアウトすべきではない。これは、既知のユーザー名を持つ利用者へのアクセスを拒否するために悪用される可能性があるためである。アカウントロックアウトの詳細については、[認証チートシート](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html) を参照する。

</div>
</div>

</section>
</div>



## Attribution

<div className="attributionFooter">

- Original: Forgot Password Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: English original retained for comparison. Japanese translation added. Bilingual display generated from official source and local Japanese translation.
- Retrieved: 2026-05-20

</div>
