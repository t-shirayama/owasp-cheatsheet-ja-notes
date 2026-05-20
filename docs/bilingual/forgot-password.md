---
hide_table_of_contents: true
---

# Forgot Password Cheat Sheet

<div className="docHero" data-category="authentication">
  <h1>Forgot Password Cheat Sheet</h1>
  <p className="docSubtitle">パスワード忘れ対応チートシート</p>
  <div className="docMeta">
    <span className="docPill">最終更新: 2026-05-20</span>
    <span className="docPill">読了時間: 約 10 分</span>
    <span className="docPill">カテゴリ: Authentication</span>
  </div>
</div>

<div className="tabbedContent">
  <input className="tabInput" type="radio" name="forgot-password-view" id="forgot-password-translation" defaultChecked />
  <input className="tabInput" type="radio" name="forgot-password-view" id="forgot-password-summary" />
  <input className="tabInput" type="radio" name="forgot-password-view" id="forgot-password-checklist" />
  <input className="tabInput" type="radio" name="forgot-password-view" id="forgot-password-bilingual" />

  <div className="contentTabs">
    <label htmlFor="forgot-password-translation">翻訳</label>
    <label htmlFor="forgot-password-summary">要点</label>
    <label htmlFor="forgot-password-checklist">チェックリスト</label>
    <label htmlFor="forgot-password-bilingual">対比表示</label>
  </div>

<section id="forgot-password-translation-panel" className="tabPanel translationPanel contentPanel">

パスワードリセット機能は、利用者がパスワードを忘れたときにアカウントへ再びアクセスできるようにするための機能である。一見単純に見えるが、アカウント列挙、リセットトークンの推測、リセット通知の大量送信、Host ヘッダー注入、リファラ経由のトークン漏えい、既存セッションの取り扱い不備など、アカウント乗っ取りに直結する脆弱性が入りやすい。

リセット要求では、存在するアカウントと存在しないアカウントの両方に同じメッセージを返す。応答時間もできるだけ一定にし、早期リターンや分岐差からアカウント存在有無を推測させない。特定アカウントに対する大量のリセット要求で利用者のメールや SMS を埋める攻撃を防ぐため、アカウント単位のレート制限、CAPTCHA、その他の自動送信対策を導入する。入力値には通常の入力検証と SQL インジェクション対策を適用する。

パスワードを変更する前に、利用者がメール、SMS、その他のサイドチャネルで受け取ったトークンまたはコードを提示して本人性を示す必要がある。トークン、コード、PIN は暗号学的に安全な乱数生成器で作成し、総当たりに耐える十分な長さにし、個別利用者に紐付け、単回使用にし、適切な期間で失効させる。保存する場合は平文を避け、安全に保存する。

URL トークンを使う場合は、トークンをクエリ文字列に含めてメールで送る。リセット URL の生成時に Host ヘッダーへ依存してはならない。URL は固定値にするか、信頼済みドメインの許可リストで検証し、HTTPS を使う。リセットページには `noreferrer` の Referrer Policy を設定し、外部サイトへの遷移や外部リソース読み込みでトークンが漏えいしないようにする。URL トークンに対してもレート制限などの総当たり対策を実装する。

PIN を使う場合は、6から12桁程度のコードを SMS などのサイドチャネルで送付し、利用者名と PIN を入力させる。PIN 検証後に作成するセッションは、パスワード再設定だけを許可する制限付きセッションにする。オフライン方式を使う場合でも、バックエンド側で正当性を確認し、識別子は安全に保管されるよう設計する。

秘密の質問は回答が推測されやすく、ソーシャルメディアなどから取得されやすいため、パスワードリセットの唯一の手段として使ってはならない。他の方式と組み合わせる追加確認として使う場合も、質問の選定と回答の取り扱いを厳格にする。

利用者が新しいパスワードを設定するときは、2回入力で確認し、アプリケーション全体と同じ安全なパスワードポリシーを適用し、安全な保存方式で更新する。パスワードをメールで送ってはならない。変更後は利用者へ通知し、通常のログインフローで再ログインさせる。自動ログインは認証とセッション管理を複雑にし、脆弱性を生みやすいため避ける。既存セッションは自動的に失効するか、利用者に失効を選択させる。

パスワードリセット要求を理由にアカウントをロックしてはならない。攻撃者が既知の利用者名に対してリセット要求を繰り返し、正規利用者をサービス拒否状態にできるためである。MFA のリカバリはこのチートシートの対象外であり、MFA 固有の復旧手順として設計する必要がある。

</section>

<section id="forgot-password-summary-panel" className="tabPanel summaryPanel contentPanel">

パスワードリセットは、正規利用者の復旧経路であると同時に、攻撃者にとって認証を迂回する経路にもなる。安全な実装では、アカウント列挙を防ぎ、トークンや PIN を短寿命かつ単回使用にし、URL 生成とリファラ漏えいを制御し、変更後の通知と既存セッション処理まで設計する。

## 要点

- 存在するアカウントと存在しないアカウントで、メッセージと応答時間を揃える。
- アカウント単位のレート制限や CAPTCHA で大量リセット要求と通知洪水を抑える。
- トークン、コード、PIN は暗号学的に安全な乱数生成器で作り、十分な長さ、利用者への紐付け、単回使用、有効期限、安全な保存を満たす。
- リセット URL は Host ヘッダーに依存せず、固定値または信頼済みドメインの許可リストで生成し、HTTPS を使う。
- リセットページでは `noreferrer` の Referrer Policy を使い、URL トークンの外部漏えいを抑える。
- PIN 検証後のセッションはパスワード再設定だけを許可する制限付きセッションにする。
- 秘密の質問をパスワードリセットの唯一の手段として使わない。
- パスワード変更後は通知し、自動ログインではなく通常のログインフローへ戻す。
- 既存セッションは失効するか、利用者に失効を選択させる。
- リセット要求を理由にアカウントをロックしない。

## 実装時の注意点

- パスワードリセットは通常のログインより弱くなってはならない。本人確認、通知、レート制限、監査ログを一体で設計する。
- リセットトークンを JWT で実装する場合は、署名検証、失効、期限、アルゴリズム混同など JWT 固有のリスクもレビューする。
- MFA リカバリは別の問題として扱い、MFA チートシートのリセット手順と整合させる。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V6.3 | リセットトークン、PIN、制限付きセッション、既存セッション失効 |
| V6.4 | 秘密の質問を単独の回復手段にしない設計 |
| V6.6 | アカウント列挙、通知洪水、ロックアウト悪用、変更通知への対策 |

</section>

<section id="forgot-password-checklist-panel" className="tabPanel checklistPanel contentPanel">

- [ ] 存在するアカウントと存在しないアカウントで同じ応答メッセージを返す。
- [ ] リセット要求の応答時間を揃え、早期リターンによるアカウント列挙を防ぐ。
- [ ] アカウント単位、IP 単位、送信先単位のレート制限で大量リセット要求を抑止する。
- [ ] 必要に応じて CAPTCHA や追加の自動送信対策を導入し、メールや SMS の通知洪水を防ぐ。
- [ ] リセット要求入力に入力検証と SQL インジェクション対策を適用する。
- [ ] リセットトークン、コード、PIN を暗号学的に安全な乱数生成器で生成する。
- [ ] リセットトークン、コード、PIN を総当たりに耐える長さに設定する。
- [ ] リセットトークン、コード、PIN を個別利用者に紐付ける。
- [ ] リセットトークン、コード、PIN を単回使用にし、使用後に失効させる。
- [ ] リセットトークン、コード、PIN に適切な有効期限を設定する。
- [ ] 保存が必要なリセットトークン、コード、PIN は平文保存せず、安全に保存する。
- [ ] URL トークン方式では、リセット URL の生成に Host ヘッダーを信頼しない。
- [ ] リセット URL のドメインを固定値または信頼済みドメイン許可リストで決定する。
- [ ] リセット URL で HTTPS を必須にする。
- [ ] リセットページに `noreferrer` の Referrer Policy を設定し、URL トークン漏えいを防ぐ。
- [ ] URL トークン検証エンドポイントにレート制限を適用し、トークン総当たりを検知する。
- [ ] PIN 方式では、PIN 検証後にパスワード再設定だけを許可する制限付きセッションを作成する。
- [ ] 秘密の質問をパスワードリセットの唯一の本人確認手段として使わない。
- [ ] 新しいパスワードを2回入力させ、一致を確認する。
- [ ] 通常のパスワード変更と同じパスワードポリシーと保存方式を適用する。
- [ ] パスワードをメール、SMS、ログ、サポートチケットに含めない。
- [ ] パスワード変更後に利用者へ通知し、通知にはパスワード値を含めない。
- [ ] パスワード変更後に自動ログインさせず、通常のログインフローへ戻す。
- [ ] パスワード変更後に既存セッションを自動失効するか、利用者に失効を選択させる。
- [ ] パスワードリセット要求を理由にアカウントをロックしない。
- [ ] 監査ログにリセット要求、トークン発行、検証失敗、パスワード変更、セッション失効を記録し、トークンやパスワード値は記録しない。
- [ ] テストで、アカウント列挙、トークン再利用、期限切れトークン、Host ヘッダー注入、リファラ漏えい、既存セッション残存を検証する。

</section>

<section id="forgot-password-bilingual-panel" className="tabPanel bilingualPanel">

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

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

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

パスワードリセット機能は、利用者がパスワードを忘れたときにアカウントへ再びアクセスできるようにするための機能である。一見単純に見えるが、アカウント列挙、リセットトークンの推測、リセット通知の大量送信、Host ヘッダー注入、リファラ経由のトークン漏えい、既存セッションの取り扱い不備など、アカウント乗っ取りに直結する脆弱性が入りやすい。

リセット要求では、存在するアカウントと存在しないアカウントの両方に同じメッセージを返す。応答時間もできるだけ一定にし、早期リターンや分岐差からアカウント存在有無を推測させない。特定アカウントに対する大量のリセット要求で利用者のメールや SMS を埋める攻撃を防ぐため、アカウント単位のレート制限、CAPTCHA、その他の自動送信対策を導入する。入力値には通常の入力検証と SQL インジェクション対策を適用する。

パスワードを変更する前に、利用者がメール、SMS、その他のサイドチャネルで受け取ったトークンまたはコードを提示して本人性を示す必要がある。トークン、コード、PIN は暗号学的に安全な乱数生成器で作成し、総当たりに耐える十分な長さにし、個別利用者に紐付け、単回使用にし、適切な期間で失効させる。保存する場合は平文を避け、安全に保存する。

URL トークンを使う場合は、トークンをクエリ文字列に含めてメールで送る。リセット URL の生成時に Host ヘッダーへ依存してはならない。URL は固定値にするか、信頼済みドメインの許可リストで検証し、HTTPS を使う。リセットページには `noreferrer` の Referrer Policy を設定し、外部サイトへの遷移や外部リソース読み込みでトークンが漏えいしないようにする。URL トークンに対してもレート制限などの総当たり対策を実装する。

PIN を使う場合は、6から12桁程度のコードを SMS などのサイドチャネルで送付し、利用者名と PIN を入力させる。PIN 検証後に作成するセッションは、パスワード再設定だけを許可する制限付きセッションにする。オフライン方式を使う場合でも、バックエンド側で正当性を確認し、識別子は安全に保管されるよう設計する。

秘密の質問は回答が推測されやすく、ソーシャルメディアなどから取得されやすいため、パスワードリセットの唯一の手段として使ってはならない。他の方式と組み合わせる追加確認として使う場合も、質問の選定と回答の取り扱いを厳格にする。

利用者が新しいパスワードを設定するときは、2回入力で確認し、アプリケーション全体と同じ安全なパスワードポリシーを適用し、安全な保存方式で更新する。パスワードをメールで送ってはならない。変更後は利用者へ通知し、通常のログインフローで再ログインさせる。自動ログインは認証とセッション管理を複雑にし、脆弱性を生みやすいため避ける。既存セッションは自動的に失効するか、利用者に失効を選択させる。

パスワードリセット要求を理由にアカウントをロックしてはならない。攻撃者が既知の利用者名に対してリセット要求を繰り返し、正規利用者をサービス拒否状態にできるためである。MFA のリカバリはこのチートシートの対象外であり、MFA 固有の復旧手順として設計する必要がある。

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
- Changes: English original retained for comparison. Japanese translation added. Bilingual display generated from official source and local Japanese notes.
- Retrieved: 2026-05-20

</div>
