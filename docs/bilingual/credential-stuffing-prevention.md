---
title: Credential Stuffing Prevention Cheat Sheet
hide_title: true
---

<div className="docHero" data-category="authentication">
  <h1>クレデンシャルスタッフィング防止チートシート</h1>
  <div className="docMeta">
    <span className="docPill">最終更新: 2026-05-20</span>
    <span className="docPill">読了時間: 約 10 分</span>
    <span className="docPill">カテゴリ: 認証</span>
  </div>
</div>

<div className="tabbedContent">
  <input className="tabInput" type="radio" name="credential-stuffing-prevention-view" id="credential-stuffing-prevention-original" />
  <input className="tabInput" type="radio" name="credential-stuffing-prevention-view" id="credential-stuffing-prevention-translation" defaultChecked />
  <input className="tabInput" type="radio" name="credential-stuffing-prevention-view" id="credential-stuffing-prevention-summary" />
  <input className="tabInput" type="radio" name="credential-stuffing-prevention-view" id="credential-stuffing-prevention-checklist" />
  <input className="tabInput" type="radio" name="credential-stuffing-prevention-view" id="credential-stuffing-prevention-bilingual" />

  <div className="contentTabs">
    <label htmlFor="credential-stuffing-prevention-original">原本</label>
    <label htmlFor="credential-stuffing-prevention-translation">翻訳</label>
    <label htmlFor="credential-stuffing-prevention-summary">要点</label>
    <label htmlFor="credential-stuffing-prevention-checklist">チェックリスト</label>
    <label htmlFor="credential-stuffing-prevention-bilingual">対比表示</label>
  </div>

<section id="credential-stuffing-prevention-original-panel" className="tabPanel originalPanel contentPanel">

## Introduction

This cheatsheet covers defences against two common types of authentication-related attacks: credential stuffing and password spraying. Although these are separate, distinct attacks, in many cases the defences that would be implemented to protect against them are the same, and they would also be effective at protecting against brute-force attacks.  A summary of these different attacks is listed below:

| Attack Type | Description |
|-------------|-------------|
| Brute Force | Testing multiple passwords from dictionary or other source against a single account. |
| Credential Stuffing | Testing username/password pairs obtained from the breach of another site. |
| Password Spraying | Testing a single weak password against a large number of different accounts.|

## Multi-Factor Authentication

[Multi-factor authentication (MFA)](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html) is by far the best defense against the majority of password-related attacks, including credential stuffing and password spraying, with analysis by Microsoft suggesting that it would have stopped [99.9% of account compromises](https://techcommunity.microsoft.com/t5/Azure-Active-Directory-Identity/Your-Pa-word-doesn-t-matter/ba-p/731984). As such, it should be implemented wherever possible. Historically, depending on the audience of the application, it may not have been practical or feasible to enforce the use of MFA, however with modern browsers and mobile devices now supporting FIDO2 Passkeys and other forms of MFA, it is attainable for most use cases.

In order to balance security and usability, multi-factor authentication can be combined with other techniques to require the 2nd factor only in specific circumstances where there is reason to suspect that the login attempt may not be legitimate, such as a login from:

- A new browser/device or IP address.
- An unusual country or location.
- Specific countries that are considered untrusted or typically do not contain users of a service.
- An IP address that appears on known denylists or is associated with anonymization services, such as proxy or VPN services.
- An IP address that has tried to login to multiple accounts.
- A login attempt that appears to be scripted or from a bot rather than a human (i.e. large login volume sourced from a single IP or subnet).

Or an organization may choose to require MFA in the form of a "step-up" authentication for the above scenarios during a session combined with a request for a high risk activity such as:

- Large currency transactions
- Privileged or Administrative configuration changes

Additionally, for enterprise applications, known trusted IP ranges could be added to an allowlist so that MFA is not required when users connect from these ranges.

## Alternative Defenses

Where it is not possible to implement MFA, there are many alternative defenses that can be used to protect against credential stuffing and password spraying. In isolation none of these are as effective as MFA, however multiple, layered defenses can provide a reasonable degree of protection. In many cases, these mechanisms will also protect against brute-force or password spraying attacks.

Where an application has multiple user roles, it may be appropriate to implement different defenses for different roles. For example, it may not be feasible to enforce MFA for all users, but it should be possible to require that all administrators use it.

## Defense in Depth & Metrics

While not a specific technique, it is important to implement defenses that consider the impact of individual defenses being defeated or otherwise failing.  As an example, client-side defenses, such as device fingerprinting or JavaScript challenges, may be spoofed or bypassed and other layers of defense should be implemented to account for this.

Additionally, each defense should generate volume metrics for use as a detective mechanism. Ideally the metrics will include both detected and mitigated attack volume and allow for filtering on fields such as IP address. Monitoring and reporting on these metrics may identify defense failures or the presence of unidentified attacks, as well as the impact of new or improved defenses.

Finally, when administration of different defenses is performed by multiple teams, care should be taken to ensure there is communication and coordination when separate teams are performing maintenance, deployment or otherwise modifying individual defenses.

### Secondary Passwords, PINs and Security Questions

As well as requiring a user to enter their password when authenticating, users can also be prompted to provide additional security information such as:

- A PIN
- Specific characters from a secondary passwords or memorable word
- Answers to [security questions](https://cheatsheetseries.owasp.org/cheatsheets/Choosing_and_Using_Security_Questions_Cheat_Sheet.html)

It must be emphasised that this **does not** constitute multi-factor authentication (as both factors are the same - something you know). However, it can still provide a useful layer of protection against both credential stuffing and password spraying where proper MFA can't be implemented.

### CAPTCHA

Requiring a user to solve a "Completely Automated Public Turing test to tell Computers and Humans Apart" (CAPTCHA) or similar puzzle for each login attempt can help to identify automated/bot attacks and help prevent automated login attempts, and may slow down credential stuffing or password spraying attacks.  However, CAPTCHAs are not perfect, and in many cases tools or services exist that can be used to break them with a reasonably high success rate.  Monitoring CAPTCHA solve rates may help identify impact to good users, as well as automated CAPTCHA breaking technology, possibly indicated by abnormally high solve rates.

To improve usability, it may be desirable to only require the user solve a CAPTCHA when the login request is considered suspicious or high risk, using the same criteria discussed in the MFA section.

### IP Mitigation and Intelligence

Blocking IP addresses may be sufficient to stop less sophisticated attacks, but should not be used as the sole or primary defense due to the ease in circumvention.  It is more effective to have a graduated response to abuse that leverages multiple defensive measures depending on different factors of the attack.

Any process or decision to mitigate (including blocking and CAPTCHA) credential stuffing traffic from an IP address should consider a multitude of abuse scenarios, and not rely on a single predictable volume limit.  Short (i.e. burst) and long time periods should be considered, as well as high request volume and instances where one IP address, likely in concert with _many_ other IP addresses, generates low but consistent volumes of traffic.  Additionally, mitigation decisions should consider factors such as IP address classification (ex: residential vs hosting) and geolocation.  These factors may be leveraged to raise or lower mitigation thresholds in order to reduce potential impact on legitimate users or more aggressively mitigate abuse originating from abnormal sources.  Mitigations, especially blocking an IP address, should be temporary and processes should be in place to remove an IP address from a mitigated state as abuse declines or stops.

Many credential stuffing toolkits, such as [Sentry MBA](https://federalnewsnetwork.com/wp-content/uploads/2020/06/Shape-Threat-Research-Automating-Cybercrime-with-SentryMBA.pdf), offer built-in use of proxy networks to distribute requests across a large volume of unique IP addresses.  This may defeat both IP block-lists and rate limiting, as per IP request volume may remain relatively low, even on high volume attacks.  Correlating authentication traffic with proxy and similar IP address intelligence, as well as hosting provider IP address ranges can help identify highly distributed credential stuffing attacks, as well as serve as a mitigation trigger.  For example, every request originating from a hosting provider could be required to solve CAPTCHA.

There are both public and commercial sources of IP address intelligence and classification that may be leveraged as data sources for this purpose.  Additionally, some hosting providers publish their own IP address space, such as [AWS](https://docs.aws.amazon.com/vpc/latest/userguide/aws-ip-ranges.html).

Separate from blocking network connections, consider storing an account's IP address authentication history.  In case a recent IP address is added to a block or mitigation list, it may be appropriate to lock the account and notify the user.

### Device Fingerprinting

Aside from the IP address, there are a number of different factors that can be used to attempt to fingerprint a device. Some of these can be obtained passively by the server from the HTTP headers (particularly the "User-Agent" header), including:

- Operating system & version
- Browser & version
- Language

Using JavaScript it is possible to access far more information, such as:

- Screen resolution
- Installed fonts
- Installed browser plugins

Using these various attributes, it is possible to create a fingerprint of the device. This fingerprint can then be matched against any browser attempting to login to the account, and if it doesn't match then the user can be prompted for additional authentication. Many users will have multiple devices or browsers that they use, so it is not practical to simply block attempts that do not match the existing fingerprints, however it is common to define a process for users or customers to view their device history and manage their remembered devices.  Also these attributes can be used to detect anomalous activity such as a device appearing to be running an older version of OS or Browser.

The [fingerprintjs2](https://github.com/Valve/fingerprintjs2) JavaScript library can be used to carry out client-side fingerprinting.

It should be noted that as all this information is provided by the client, it can potentially be spoofed by an attacker. In some cases spoofing these attributes is trivial (such as the "User-Agent") header, but in other cases it may be more difficult to modify these attributes.

### Connection Fingerprinting

Similar to device fingerprinting, there are numerous fingerprinting techniques available for network connections.  Some examples include [JA3](https://github.com/salesforce/ja3), HTTP/2 fingerprinting and HTTP header order.  As these techniques typically focus on how a connection is made, connection fingerprinting may provide more accurate results than other defenses that rely on an indicator, such as an IP address, or request data, such as user agent string.

Connection fingerprinting may also be used in conjunction with other defenses to ascertain the truthfulness of an authentication request.  For example, if the user agent header and device fingerprint indicates a mobile device, but the connection fingerprint indicates a Python script, the request is likely suspect.

### Require Unpredictable Usernames

Credential stuffing attacks rely on not just the re-use of passwords between multiple sites, but also the re-use of usernames. A significant number of websites use the email address as the username, and as most users will have a single email address they use for all their accounts, this makes the combination of an email address and password very effective for credential stuffing attacks.

Requiring users to create their own username when registering on the website makes it harder for an attacker to obtain valid username and password pairs for credential stuffing, as many of the available credential lists only include email addresses. Providing the user with a generated username can provide a higher degree of protection (as users are likely to choose the same username on most websites), but is user unfriendly. Additionally, care needs to be taken to ensure that the generated username is not predictable (such as being based on the user's full name, or sequential numeric IDs), as this could make enumerating valid usernames for a password spraying attack easier.

### Multi-Step Login Processes

The majority of off-the-shelf tools are designed for a single step login process, where the credentials are POSTed to the server, and the response indicates whether or not the login attempt was successful. By adding additional steps to this process, such as requiring the username and password to be entered sequentially, or requiring that the user first obtains a random [CSRF Token](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html) before they can login, this makes the attack slightly more difficult to perform, and doubles the number of requests that the attacker must make.

Multi-step login processes, however, should be mindful that they do not faciliate [user enumeration](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html).  Enumerating users prior to a credential stuffing attack may result in a harder to identify, lower request volume attack.

### Require JavaScript and Block Headless Browsers

Most tools used for these types of attacks will make direct POST requests to the server and read the responses, but will not download or execute JavaScript that was contained in them. By requiring the attacker to evaluate JavaScript in the response (for example to generate a valid token that must be submitted with the request), this forces the attacker to either use a real browser with an automation framework like Selenium or Headless Chrome, or to implement JavaScript parsing with another tool such as PhantomJS. Additionally, there are a number of techniques that can be used to identify [Headless Chrome](https://antoinevastel.com/bot%20detection/2018/01/17/detect-chrome-headless-v2.html) or [PhantomJS](https://blog.shapesecurity.com/2015/01/22/detecting-phantomjs-based-visitors/).

Please note that blocking visitors who have JavaScript disabled will reduce the accessibility of the website, especially to visitors who use screen readers. In certain jurisdictions this may be in breach of equalities legislation.

### Degradation

A more aggressive defense against credential stuffing is to implement measures that increase the amount of time the attack takes to complete. This may include incrementally increasing the complexity of the JavaScript that must be evaluated, requiring users to solve a cryptographic or Proof-of-Work computational puzzle, introducing long wait periods before responding to requests, returning overly large HTML assets or returning randomized error messages.

These techniques provide some level of security without resorting to user tracking or profiling. They typically do not require a human in the loop, but rather constrain the minimum latency and/or the maximum request rate of a particular client implementation and the attacker's budget and sophistication, and requires a context-dependent risk assessment to gauge their efficacy, resistance to countermeasures and user experience impact.

### Identifying Leaked Passwords

[ASVS v4.0 Password Security Requirements](https://github.com/OWASP/ASVS/blob/master/4.0/en/0x11-V2-Authentication.md#v21-password-security-requirements) provision (2.1.7) on verifying new passwords presence in breached password datasets should be implemented.

There are both commercial and free services that may be of use for validating passwords presence in prior breaches.  A well known free service for this is [Pwned Passwords](https://haveibeenpwned.com/Passwords). You can host a copy of the application yourself, or use the [API](https://haveibeenpwned.com/API/v2#PwnedPasswords).

### Notify users about unusual security events

When suspicious or unusual activity is detected, it may be appropriate to notify or warn the user. However, care should be taken that the user does not get overwhelmed with a large number of notifications that are not important to them, or they will just start to ignore or delete them.  Additionally, due to frequent reuse of passwords across multiple sites, the possibility that the users email account has also been compromised should be considered.

For example, it would generally not be appropriate to notify a user that there had been an attempt to login to their account with an incorrect password. However, if there had been a login with the correct password, but which had then failed the subsequent MFA check, the user should be notified so that they can change their password.  Subsequently, should the user request multiple password resets from different devices or IP addresses, it may be appropriate to prevent further access to the account pending further user verification processes.

Details related to current or recent logins should also be made visible to the user. For example, when they login to the application, the date, time and location of their previous login attempt could be displayed to them. Additionally, if the application supports concurrent sessions, the user should be able to view a list of all active sessions, and to terminate any other sessions that are not legitimate.

</section>

<section id="credential-stuffing-prevention-translation-panel" className="tabPanel translationPanel contentPanel">

このチートシートは、クレデンシャルスタッフィング、パスワードスプレー、総当たり攻撃に対する防御を扱う。総当たり攻撃は辞書などから複数のパスワードを単一アカウントへ試す攻撃である。クレデンシャルスタッフィングは、別サイトの侵害で得られた利用者名とパスワードの組み合わせを試す攻撃である。パスワードスプレーは、単一の弱いパスワードを多数のアカウントへ試す攻撃である。攻撃の形は異なるが、多くの防御策は共通して有効である。

MFA は、クレデンシャルスタッフィングやパスワードスプレーを含む多くのパスワード関連攻撃に対する最も強い防御であり、可能な限り導入する。現代のブラウザとモバイル端末は FIDO2 パスキーなどをサポートしているため、多くのユースケースで MFA は現実的な選択肢になっている。

セキュリティと使いやすさのバランスを取るため、MFA はリスクに応じて要求できる。新しいブラウザ、端末、IP アドレス、通常と異なる国や場所、信頼できない国、匿名化サービスや VPN、複数アカウントへログインを試した IP、単一 IP やサブネットからの大量ログインなどは、追加認証のきっかけにできる。セッション中でも、大きな金額の取引や管理設定変更などの高リスク操作ではステップアップ認証を求める。

MFA を実装できない場合でも、単独の防御に頼ってはならない。CAPTCHA、IP インテリジェンス、デバイスフィンガープリント、接続フィンガープリント、予測困難な利用者名、多段階ログイン、JavaScript 実行要求、ヘッドレスブラウザ検知、応答遅延や計算パズルによる攻撃コスト増加、漏えいパスワード検査、利用者通知を多層で組み合わせる。

防御策は失敗や迂回を前提に設計する。クライアント側のフィンガープリントや JavaScript チャレンジは偽装される可能性がある。IP ブロックや単純なレート制限も、プロキシネットワークを使う攻撃には回避されやすい。短期バースト、長期の低頻度攻撃、高リクエスト量、分散された低量トラフィックを区別できるメトリクスを収集し、検知量と緩和量の両方を観測する。

二次パスワード、PIN、秘密の質問は、どれも「知っているもの」であり MFA ではない。ただし、MFA が使えない場合の追加レイヤーとしては一定の価値がある。CAPTCHA は自動化を遅らせるが、突破サービスや自動化技術で破られることがあるため、解決率を監視し、疑わしいログインだけに適用するなど利用者影響を抑える。

IP 対策では、単純なブロックを主防御にしない。住宅回線、ホスティング事業者、国、地理情報、匿名化サービス、既知の拒否リスト、過去の認証履歴などを組み合わせ、段階的に CAPTCHA、MFA、制限、通知へつなげる。ブロックは一時的にし、攻撃が収まったら解除できる手順を用意する。

デバイスフィンガープリントでは、User-Agent、OS、ブラウザ、言語、画面解像度、フォント、プラグインなどを使って既知端末との違いを検出できる。ただし、これらの情報はクライアントから提供されるため偽装可能である。接続フィンガープリントでは、JA3、HTTP/2 の特徴、HTTP ヘッダー順序などを使い、User-Agent と接続特性の矛盾を検出できる。

漏えいパスワード検査は、新しいパスワード設定時に導入する。Pwned Passwords などのサービスや自前ホストした漏えいデータセットを使い、過去に漏えいしたパスワードを拒否する。異常なセキュリティイベントを検知した場合は利用者へ通知するが、通知が多すぎると無視されるため、正しいパスワードでログインできたが MFA に失敗した場合など、意味のあるイベントに絞る。利用者には直近ログインの日時、場所、アクティブセッションを確認し、不正なセッションを終了できるようにする。

</section>

<section id="credential-stuffing-prevention-summary-panel" className="tabPanel summaryPanel contentPanel">

クレデンシャルスタッフィングは、他サービスから漏えいした利用者名とパスワードの組み合わせを試す攻撃である。パスワードスプレーや総当たり攻撃と同様、単独の対策では不十分であり、MFA、リスクベース認証、レート制限、IP/端末/接続インテリジェンス、漏えいパスワード検査、利用者通知を多層で組み合わせる。

## 要点

- MFA、パスキー、FIDO2/WebAuthn を可能な限り導入し、高リスクログインや高リスク操作ではステップアップ認証を求める。
- 新しい端末、異常な場所、匿名化サービス、複数アカウントへの試行、大量ログインなどをリスクシグナルとして扱う。
- CAPTCHA、IP 対策、デバイスフィンガープリント、接続フィンガープリント、多段階ログイン、JavaScript チャレンジは迂回され得るため、多層で使う。
- 検知量と緩和量、IP、アカウント、端末、接続特徴、成功率、失敗率などのメトリクスを監視する。
- IP ブロックや CAPTCHA は一時的・段階的に適用し、正規利用者への影響を測る。
- 利用者名をメールアドレスだけに依存しない設計は、攻撃者が漏えいリストをそのまま使う難易度を上げる。
- 新しいパスワード設定時に漏えいパスワードデータセットを照合し、既知漏えいパスワードを拒否する。
- 正しいパスワード後の MFA 失敗や、複数地点からのリセット要求など、意味のある異常イベントを利用者へ通知する。

## 実装時の注意点

- クライアント側の指紋、User-Agent、JavaScript 実行結果は偽装可能である。重要な判断では接続特徴や履歴、MFA など複数のシグナルを組み合わせる。
- 正規利用者を過剰にブロックしないよう、緩和ルールは解除条件、監視指標、サポート対応を含めて運用する。
- 通知を乱発すると利用者が無視するため、通知対象イベントと文面を設計する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V6.1 | 漏えいパスワード、弱いパスワード、利用者名再利用への対策 |
| V6.2 | MFA、パスキー、リスクベース認証、ステップアップ認証 |
| V6.3 | 異常ログイン通知、認証履歴、アクティブセッション表示と終了 |
| V6.6 | 自動化攻撃の検知、レート制限、CAPTCHA、IP/端末/接続メトリクス |

</section>

<section id="credential-stuffing-prevention-checklist-panel" className="tabPanel checklistPanel contentPanel">

- [ ] 総当たり、クレデンシャルスタッフィング、パスワードスプレーを区別して検知できるログ項目を定義する。
- [ ] MFA、パスキー、FIDO2/WebAuthn を導入し、管理者と高権限利用者では必須にする。
- [ ] 新しいブラウザ、端末、IP、通常と異なる国や場所、匿名化サービス、複数アカウントへの試行をリスクシグナルとして評価する。
- [ ] 大きな金額の取引や管理設定変更でステップアップ認証を要求する。
- [ ] IP 単位、アカウント単位、サブネット単位、送信元分類単位でレート制限や緩和を設定する。
- [ ] 短時間のバースト攻撃と長時間の低頻度分散攻撃の両方を検知するメトリクスを収集する。
- [ ] 検知した攻撃量と実際に緩和した攻撃量を別々に測定する。
- [ ] CAPTCHA をログイン全体ではなく疑わしいリクエストへ段階的に適用し、解決率と正規利用者影響を監視する。
- [ ] IP ブロックを主防御にせず、一時的な緩和として扱い、解除条件を定義する。
- [ ] 住宅回線、ホスティング事業者、VPN、プロキシ、国、地理情報などの IP インテリジェンスを緩和判断に使う。
- [ ] アカウントの過去の IP 認証履歴を保存し、直近利用 IP が緩和対象に入った場合は追加確認や通知につなげる。
- [ ] User-Agent、OS、ブラウザ、言語、画面解像度などの端末特徴を、偽装可能な補助シグナルとして扱う。
- [ ] JA3、HTTP/2 特徴、HTTP ヘッダー順序などの接続フィンガープリントを、User-Agent との矛盾検出に使う。
- [ ] 予測困難な利用者名や生成された利用者名を使う場合は、連番や氏名由来など列挙しやすい形式を避ける。
- [ ] 多段階ログインを導入する場合は、途中ステップでアカウント列挙を発生させない。
- [ ] JavaScript チャレンジやヘッドレスブラウザ検知を使う場合は、アクセシビリティへの影響と迂回可能性を評価する。
- [ ] 応答遅延、計算パズル、Proof-of-Work などの劣化策を導入する場合は、利用者体験、攻撃者の回避策、コストを評価する。
- [ ] 新しいパスワード設定時に漏えいパスワードデータセットを照合し、既知漏えいパスワードを拒否する。
- [ ] 正しいパスワード後の MFA 失敗など、アカウント侵害の可能性が高いイベントを利用者へ通知する。
- [ ] 通知を乱発しないよう、通知対象イベント、頻度、文面、サポート導線を定義する。
- [ ] 利用者が直近ログインの日時、場所、端末、アクティブセッションを確認できる画面を用意する。
- [ ] 利用者が不正なアクティブセッションを終了できるようにする。
- [ ] 攻撃検知、緩和ルール変更、ブロック解除、利用者通知、サポート対応の運用手順を記録する。
- [ ] テストで、プロキシ分散、低頻度スプレー、単一 IP バースト、CAPTCHA 迂回、多段階ログインでの列挙、通知過多を検証する。

</section>

<section id="credential-stuffing-prevention-bilingual-panel" className="tabPanel bilingualPanel">

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Introduction

This cheatsheet covers defences against two common types of authentication-related attacks: credential stuffing and password spraying. Although these are separate, distinct attacks, in many cases the defences that would be implemented to protect against them are the same, and they would also be effective at protecting against brute-force attacks.  A summary of these different attacks is listed below:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

このチートシートは、クレデンシャルスタッフィング、パスワードスプレー、総当たり攻撃に対する防御を扱う。総当たり攻撃は辞書などから複数のパスワードを単一アカウントへ試す攻撃である。クレデンシャルスタッフィングは、別サイトの侵害で得られた利用者名とパスワードの組み合わせを試す攻撃である。パスワードスプレーは、単一の弱いパスワードを多数のアカウントへ試す攻撃である。攻撃の形は異なるが、多くの防御策は共通して有効である。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

| Attack Type | Description |
|-------------|-------------|
| Brute Force | Testing multiple passwords from dictionary or other source against a single account. |
| Credential Stuffing | Testing username/password pairs obtained from the breach of another site. |
| Password Spraying | Testing a single weak password against a large number of different accounts.|

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

MFA は、クレデンシャルスタッフィングやパスワードスプレーを含む多くのパスワード関連攻撃に対する最も強い防御であり、可能な限り導入する。現代のブラウザとモバイル端末は FIDO2 パスキーなどをサポートしているため、多くのユースケースで MFA は現実的な選択肢になっている。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Multi-Factor Authentication

[Multi-factor authentication (MFA)](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html) is by far the best defense against the majority of password-related attacks, including credential stuffing and password spraying, with analysis by Microsoft suggesting that it would have stopped [99.9% of account compromises](https://techcommunity.microsoft.com/t5/Azure-Active-Directory-Identity/Your-Pa-word-doesn-t-matter/ba-p/731984). As such, it should be implemented wherever possible. Historically, depending on the audience of the application, it may not have been practical or feasible to enforce the use of MFA, however with modern browsers and mobile devices now supporting FIDO2 Passkeys and other forms of MFA, it is attainable for most use cases.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

セキュリティと使いやすさのバランスを取るため、MFA はリスクに応じて要求できる。新しいブラウザ、端末、IP アドレス、通常と異なる国や場所、信頼できない国、匿名化サービスや VPN、複数アカウントへログインを試した IP、単一 IP やサブネットからの大量ログインなどは、追加認証のきっかけにできる。セッション中でも、大きな金額の取引や管理設定変更などの高リスク操作ではステップアップ認証を求める。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

In order to balance security and usability, multi-factor authentication can be combined with other techniques to require the 2nd factor only in specific circumstances where there is reason to suspect that the login attempt may not be legitimate, such as a login from:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

MFA を実装できない場合でも、単独の防御に頼ってはならない。CAPTCHA、IP インテリジェンス、デバイスフィンガープリント、接続フィンガープリント、予測困難な利用者名、多段階ログイン、JavaScript 実行要求、ヘッドレスブラウザ検知、応答遅延や計算パズルによる攻撃コスト増加、漏えいパスワード検査、利用者通知を多層で組み合わせる。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- A new browser/device or IP address.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

防御策は失敗や迂回を前提に設計する。クライアント側のフィンガープリントや JavaScript チャレンジは偽装される可能性がある。IP ブロックや単純なレート制限も、プロキシネットワークを使う攻撃には回避されやすい。短期バースト、長期の低頻度攻撃、高リクエスト量、分散された低量トラフィックを区別できるメトリクスを収集し、検知量と緩和量の両方を観測する。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- An unusual country or location.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

二次パスワード、PIN、秘密の質問は、どれも「知っているもの」であり MFA ではない。ただし、MFA が使えない場合の追加レイヤーとしては一定の価値がある。CAPTCHA は自動化を遅らせるが、突破サービスや自動化技術で破られることがあるため、解決率を監視し、疑わしいログインだけに適用するなど利用者影響を抑える。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Specific countries that are considered untrusted or typically do not contain users of a service.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

IP 対策では、単純なブロックを主防御にしない。住宅回線、ホスティング事業者、国、地理情報、匿名化サービス、既知の拒否リスト、過去の認証履歴などを組み合わせ、段階的に CAPTCHA、MFA、制限、通知へつなげる。ブロックは一時的にし、攻撃が収まったら解除できる手順を用意する。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- An IP address that appears on known denylists or is associated with anonymization services, such as proxy or VPN services.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

デバイスフィンガープリントでは、User-Agent、OS、ブラウザ、言語、画面解像度、フォント、プラグインなどを使って既知端末との違いを検出できる。ただし、これらの情報はクライアントから提供されるため偽装可能である。接続フィンガープリントでは、JA3、HTTP/2 の特徴、HTTP ヘッダー順序などを使い、User-Agent と接続特性の矛盾を検出できる。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- An IP address that has tried to login to multiple accounts.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

漏えいパスワード検査は、新しいパスワード設定時に導入する。Pwned Passwords などのサービスや自前ホストした漏えいデータセットを使い、過去に漏えいしたパスワードを拒否する。異常なセキュリティイベントを検知した場合は利用者へ通知するが、通知が多すぎると無視されるため、正しいパスワードでログインできたが MFA に失敗した場合など、意味のあるイベントに絞る。利用者には直近ログインの日時、場所、アクティブセッションを確認し、不正なセッションを終了できるようにする。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- A login attempt that appears to be scripted or from a bot rather than a human (i.e. large login volume sourced from a single IP or subnet).

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Or an organization may choose to require MFA in the form of a "step-up" authentication for the above scenarios during a session combined with a request for a high risk activity such as:

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Large currency transactions

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Privileged or Administrative configuration changes

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Additionally, for enterprise applications, known trusted IP ranges could be added to an allowlist so that MFA is not required when users connect from these ranges.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Alternative Defenses

Where it is not possible to implement MFA, there are many alternative defenses that can be used to protect against credential stuffing and password spraying. In isolation none of these are as effective as MFA, however multiple, layered defenses can provide a reasonable degree of protection. In many cases, these mechanisms will also protect against brute-force or password spraying attacks.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Where an application has multiple user roles, it may be appropriate to implement different defenses for different roles. For example, it may not be feasible to enforce MFA for all users, but it should be possible to require that all administrators use it.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Defense in Depth & Metrics

While not a specific technique, it is important to implement defenses that consider the impact of individual defenses being defeated or otherwise failing.  As an example, client-side defenses, such as device fingerprinting or JavaScript challenges, may be spoofed or bypassed and other layers of defense should be implemented to account for this.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Additionally, each defense should generate volume metrics for use as a detective mechanism. Ideally the metrics will include both detected and mitigated attack volume and allow for filtering on fields such as IP address. Monitoring and reporting on these metrics may identify defense failures or the presence of unidentified attacks, as well as the impact of new or improved defenses.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Finally, when administration of different defenses is performed by multiple teams, care should be taken to ensure there is communication and coordination when separate teams are performing maintenance, deployment or otherwise modifying individual defenses.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Secondary Passwords, PINs and Security Questions

As well as requiring a user to enter their password when authenticating, users can also be prompted to provide additional security information such as:

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- A PIN

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Specific characters from a secondary passwords or memorable word

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Answers to [security questions](https://cheatsheetseries.owasp.org/cheatsheets/Choosing_and_Using_Security_Questions_Cheat_Sheet.html)

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

It must be emphasised that this **does not** constitute multi-factor authentication (as both factors are the same - something you know). However, it can still provide a useful layer of protection against both credential stuffing and password spraying where proper MFA can't be implemented.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### CAPTCHA

Requiring a user to solve a "Completely Automated Public Turing test to tell Computers and Humans Apart" (CAPTCHA) or similar puzzle for each login attempt can help to identify automated/bot attacks and help prevent automated login attempts, and may slow down credential stuffing or password spraying attacks.  However, CAPTCHAs are not perfect, and in many cases tools or services exist that can be used to break them with a reasonably high success rate.  Monitoring CAPTCHA solve rates may help identify impact to good users, as well as automated CAPTCHA breaking technology, possibly indicated by abnormally high solve rates.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

To improve usability, it may be desirable to only require the user solve a CAPTCHA when the login request is considered suspicious or high risk, using the same criteria discussed in the MFA section.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### IP Mitigation and Intelligence

Blocking IP addresses may be sufficient to stop less sophisticated attacks, but should not be used as the sole or primary defense due to the ease in circumvention.  It is more effective to have a graduated response to abuse that leverages multiple defensive measures depending on different factors of the attack.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Any process or decision to mitigate (including blocking and CAPTCHA) credential stuffing traffic from an IP address should consider a multitude of abuse scenarios, and not rely on a single predictable volume limit.  Short (i.e. burst) and long time periods should be considered, as well as high request volume and instances where one IP address, likely in concert with _many_ other IP addresses, generates low but consistent volumes of traffic.  Additionally, mitigation decisions should consider factors such as IP address classification (ex: residential vs hosting) and geolocation.  These factors may be leveraged to raise or lower mitigation thresholds in order to reduce potential impact on legitimate users or more aggressively mitigate abuse originating from abnormal sources.  Mitigations, especially blocking an IP address, should be temporary and processes should be in place to remove an IP address from a mitigated state as abuse declines or stops.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Many credential stuffing toolkits, such as [Sentry MBA](https://federalnewsnetwork.com/wp-content/uploads/2020/06/Shape-Threat-Research-Automating-Cybercrime-with-SentryMBA.pdf), offer built-in use of proxy networks to distribute requests across a large volume of unique IP addresses.  This may defeat both IP block-lists and rate limiting, as per IP request volume may remain relatively low, even on high volume attacks.  Correlating authentication traffic with proxy and similar IP address intelligence, as well as hosting provider IP address ranges can help identify highly distributed credential stuffing attacks, as well as serve as a mitigation trigger.  For example, every request originating from a hosting provider could be required to solve CAPTCHA.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

There are both public and commercial sources of IP address intelligence and classification that may be leveraged as data sources for this purpose.  Additionally, some hosting providers publish their own IP address space, such as [AWS](https://docs.aws.amazon.com/vpc/latest/userguide/aws-ip-ranges.html).

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Separate from blocking network connections, consider storing an account's IP address authentication history.  In case a recent IP address is added to a block or mitigation list, it may be appropriate to lock the account and notify the user.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Device Fingerprinting

Aside from the IP address, there are a number of different factors that can be used to attempt to fingerprint a device. Some of these can be obtained passively by the server from the HTTP headers (particularly the "User-Agent" header), including:

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Operating system & version

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Browser & version

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Language

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Using JavaScript it is possible to access far more information, such as:

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Screen resolution

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Installed fonts

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Installed browser plugins

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Using these various attributes, it is possible to create a fingerprint of the device. This fingerprint can then be matched against any browser attempting to login to the account, and if it doesn't match then the user can be prompted for additional authentication. Many users will have multiple devices or browsers that they use, so it is not practical to simply block attempts that do not match the existing fingerprints, however it is common to define a process for users or customers to view their device history and manage their remembered devices.  Also these attributes can be used to detect anomalous activity such as a device appearing to be running an older version of OS or Browser.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The [fingerprintjs2](https://github.com/Valve/fingerprintjs2) JavaScript library can be used to carry out client-side fingerprinting.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

It should be noted that as all this information is provided by the client, it can potentially be spoofed by an attacker. In some cases spoofing these attributes is trivial (such as the "User-Agent") header, but in other cases it may be more difficult to modify these attributes.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Connection Fingerprinting

Similar to device fingerprinting, there are numerous fingerprinting techniques available for network connections.  Some examples include [JA3](https://github.com/salesforce/ja3), HTTP/2 fingerprinting and HTTP header order.  As these techniques typically focus on how a connection is made, connection fingerprinting may provide more accurate results than other defenses that rely on an indicator, such as an IP address, or request data, such as user agent string.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Connection fingerprinting may also be used in conjunction with other defenses to ascertain the truthfulness of an authentication request.  For example, if the user agent header and device fingerprint indicates a mobile device, but the connection fingerprint indicates a Python script, the request is likely suspect.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Require Unpredictable Usernames

Credential stuffing attacks rely on not just the re-use of passwords between multiple sites, but also the re-use of usernames. A significant number of websites use the email address as the username, and as most users will have a single email address they use for all their accounts, this makes the combination of an email address and password very effective for credential stuffing attacks.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Requiring users to create their own username when registering on the website makes it harder for an attacker to obtain valid username and password pairs for credential stuffing, as many of the available credential lists only include email addresses. Providing the user with a generated username can provide a higher degree of protection (as users are likely to choose the same username on most websites), but is user unfriendly. Additionally, care needs to be taken to ensure that the generated username is not predictable (such as being based on the user's full name, or sequential numeric IDs), as this could make enumerating valid usernames for a password spraying attack easier.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Multi-Step Login Processes

The majority of off-the-shelf tools are designed for a single step login process, where the credentials are POSTed to the server, and the response indicates whether or not the login attempt was successful. By adding additional steps to this process, such as requiring the username and password to be entered sequentially, or requiring that the user first obtains a random [CSRF Token](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html) before they can login, this makes the attack slightly more difficult to perform, and doubles the number of requests that the attacker must make.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Multi-step login processes, however, should be mindful that they do not faciliate [user enumeration](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html).  Enumerating users prior to a credential stuffing attack may result in a harder to identify, lower request volume attack.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Require JavaScript and Block Headless Browsers

Most tools used for these types of attacks will make direct POST requests to the server and read the responses, but will not download or execute JavaScript that was contained in them. By requiring the attacker to evaluate JavaScript in the response (for example to generate a valid token that must be submitted with the request), this forces the attacker to either use a real browser with an automation framework like Selenium or Headless Chrome, or to implement JavaScript parsing with another tool such as PhantomJS. Additionally, there are a number of techniques that can be used to identify [Headless Chrome](https://antoinevastel.com/bot%20detection/2018/01/17/detect-chrome-headless-v2.html) or [PhantomJS](https://blog.shapesecurity.com/2015/01/22/detecting-phantomjs-based-visitors/).

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Please note that blocking visitors who have JavaScript disabled will reduce the accessibility of the website, especially to visitors who use screen readers. In certain jurisdictions this may be in breach of equalities legislation.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Degradation

A more aggressive defense against credential stuffing is to implement measures that increase the amount of time the attack takes to complete. This may include incrementally increasing the complexity of the JavaScript that must be evaluated, requiring users to solve a cryptographic or Proof-of-Work computational puzzle, introducing long wait periods before responding to requests, returning overly large HTML assets or returning randomized error messages.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

These techniques provide some level of security without resorting to user tracking or profiling. They typically do not require a human in the loop, but rather constrain the minimum latency and/or the maximum request rate of a particular client implementation and the attacker's budget and sophistication, and requires a context-dependent risk assessment to gauge their efficacy, resistance to countermeasures and user experience impact.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Identifying Leaked Passwords

[ASVS v4.0 Password Security Requirements](https://github.com/OWASP/ASVS/blob/master/4.0/en/0x11-V2-Authentication.md#v21-password-security-requirements) provision (2.1.7) on verifying new passwords presence in breached password datasets should be implemented.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

There are both commercial and free services that may be of use for validating passwords presence in prior breaches.  A well known free service for this is [Pwned Passwords](https://haveibeenpwned.com/Passwords). You can host a copy of the application yourself, or use the [API](https://haveibeenpwned.com/API/v2#PwnedPasswords).

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Notify users about unusual security events

When suspicious or unusual activity is detected, it may be appropriate to notify or warn the user. However, care should be taken that the user does not get overwhelmed with a large number of notifications that are not important to them, or they will just start to ignore or delete them.  Additionally, due to frequent reuse of passwords across multiple sites, the possibility that the users email account has also been compromised should be considered.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

For example, it would generally not be appropriate to notify a user that there had been an attempt to login to their account with an incorrect password. However, if there had been a login with the correct password, but which had then failed the subsequent MFA check, the user should be notified so that they can change their password.  Subsequently, should the user request multiple password resets from different devices or IP addresses, it may be appropriate to prevent further access to the account pending further user verification processes.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Details related to current or recent logins should also be made visible to the user. For example, when they login to the application, the date, time and location of their previous login attempt could be displayed to them. Additionally, if the application supports concurrent sessions, the user should be able to view a list of all active sessions, and to terminate any other sessions that are not legitimate.

</div>

</div>

</section>
</div>

## References

<div className="referenceFooter">

- [OWASP Credential Stuffing Article](https://owasp.org/www-community/attacks/Credential_stuffing)
- [OWASP Automated Threats to Web Applications](https://owasp.org/www-project-automated-threats-to-web-applications/)
- Project: [OAT-008 Credential Stuffing](https://owasp.org/www-community/attacks/Credential_stuffing), which is one of 20 defined threats in the [OWASP Automated Threat Handbook](https://owasp.org/www-pdf-archive/Automated-threat-handbook.pdf) this project produced.

</div>


## Attribution

<div className="attributionFooter">

- Original: Credential Stuffing Prevention Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Credential_Stuffing_Prevention_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: English original retained for comparison. Japanese translation added. Bilingual display generated from official source and local Japanese notes.
- Retrieved: 2026-05-20

</div>
