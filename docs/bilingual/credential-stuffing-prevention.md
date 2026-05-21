---
title: Credential Stuffing Prevention Cheat Sheet
hide_title: true
---

<div className="docHero" data-category="authentication">
  <h1>クレデンシャルスタッフィング防止チートシート</h1>
  <div className="docMeta">
    <span className="docPill">最終更新: 2026-05-21</span>
    <span className="docPill">読了時間: 約 16 分</span>
    <span className="docPill">カテゴリ: 認証</span>
  </div>
</div>

<div className="tabbedContent">
  <input className="tabInput" type="radio" name="credential-stuffing-prevention-view" id="credential-stuffing-prevention-original" />
  <input className="tabInput" type="radio" name="credential-stuffing-prevention-view" id="credential-stuffing-prevention-translation" defaultChecked />
  <input className="tabInput" type="radio" name="credential-stuffing-prevention-view" id="credential-stuffing-prevention-bilingual" />

  <div className="contentTabs">
    <label htmlFor="credential-stuffing-prevention-original" title="OWASP 原文">原文</label>
    <label htmlFor="credential-stuffing-prevention-translation" title="日本語訳">翻訳</label>
    <label htmlFor="credential-stuffing-prevention-bilingual" title="原文と翻訳を並べて確認">対比表示</label>
  </div>

<section id="credential-stuffing-prevention-original-panel" className="tabPanel originalPanel contentPanel">

## Introduction

This cheatsheet covers defences against two common types of authentication-related attacks: credential stuffing and password spraying. Although these are separate, distinct attacks, in many cases the defences that would be implemented to protect against them are the same, and they would also be effective at protecting against brute-force attacks. A summary of these different attacks is listed below:

| Attack Type | Description |
|-------------|-------------|
| Brute Force | Testing multiple passwords from dictionary or other source against a single account. |
| Credential Stuffing | Testing username/password pairs obtained from the breach of another site. |
| Password Spraying | Testing a single weak password against a large number of different accounts. |

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

While not a specific technique, it is important to implement defenses that consider the impact of individual defenses being defeated or otherwise failing. As an example, client-side defenses, such as device fingerprinting or JavaScript challenges, may be spoofed or bypassed and other layers of defense should be implemented to account for this.

Additionally, each defense should generate volume metrics for use as a detective mechanism. Ideally the metrics will include both detected and mitigated attack volume and allow for filtering on fields such as IP address. Monitoring and reporting on these metrics may identify defense failures or the presence of unidentified attacks, as well as the impact of new or improved defenses.

Finally, when administration of different defenses is performed by multiple teams, care should be taken to ensure there is communication and coordination when separate teams are performing maintenance, deployment or otherwise modifying individual defenses.

### Secondary Passwords, PINs and Security Questions

As well as requiring a user to enter their password when authenticating, users can also be prompted to provide additional security information such as:

- A PIN
- Specific characters from a secondary passwords or memorable word
- Answers to [security questions](https://cheatsheetseries.owasp.org/cheatsheets/Choosing_and_Using_Security_Questions_Cheat_Sheet.html)

It must be emphasised that this **does not** constitute multi-factor authentication (as both factors are the same - something you know). However, it can still provide a useful layer of protection against both credential stuffing and password spraying where proper MFA can't be implemented.

### CAPTCHA

Requiring a user to solve a "Completely Automated Public Turing test to tell Computers and Humans Apart" (CAPTCHA) or similar puzzle for each login attempt can help to identify automated/bot attacks and help prevent automated login attempts, and may slow down credential stuffing or password spraying attacks. However, CAPTCHAs are not perfect, and in many cases tools or services exist that can be used to break them with a reasonably high success rate. Monitoring CAPTCHA solve rates may help identify impact to good users, as well as automated CAPTCHA breaking technology, possibly indicated by abnormally high solve rates.

To improve usability, it may be desirable to only require the user solve a CAPTCHA when the login request is considered suspicious or high risk, using the same criteria discussed in the MFA section.

### IP Mitigation and Intelligence

Blocking IP addresses may be sufficient to stop less sophisticated attacks, but should not be used as the sole or primary defense due to the ease in circumvention. It is more effective to have a graduated response to abuse that leverages multiple defensive measures depending on different factors of the attack.

Any process or decision to mitigate (including blocking and CAPTCHA) credential stuffing traffic from an IP address should consider a multitude of abuse scenarios, and not rely on a single predictable volume limit. Short (i.e. burst) and long time periods should be considered, as well as high request volume and instances where one IP address, likely in concert with _many_ other IP addresses, generates low but consistent volumes of traffic. Additionally, mitigation decisions should consider factors such as IP address classification (ex: residential vs hosting) and geolocation. These factors may be leveraged to raise or lower mitigation thresholds in order to reduce potential impact on legitimate users or more aggressively mitigate abuse originating from abnormal sources. Mitigations, especially blocking an IP address, should be temporary and processes should be in place to remove an IP address from a mitigated state as abuse declines or stops.

Many credential stuffing toolkits, such as [Sentry MBA](https://federalnewsnetwork.com/wp-content/uploads/2020/06/Shape-Threat-Research-Automating-Cybercrime-with-SentryMBA.pdf), offer built-in use of proxy networks to distribute requests across a large volume of unique IP addresses. This may defeat both IP block-lists and rate limiting, as per IP request volume may remain relatively low, even on high volume attacks. Correlating authentication traffic with proxy and similar IP address intelligence, as well as hosting provider IP address ranges can help identify highly distributed credential stuffing attacks, as well as serve as a mitigation trigger. For example, every request originating from a hosting provider could be required to solve CAPTCHA.

There are both public and commercial sources of IP address intelligence and classification that may be leveraged as data sources for this purpose. Additionally, some hosting providers publish their own IP address space, such as [AWS](https://docs.aws.amazon.com/vpc/latest/userguide/aws-ip-ranges.html).

Separate from blocking network connections, consider storing an account's IP address authentication history. In case a recent IP address is added to a block or mitigation list, it may be appropriate to lock the account and notify the user.

### Device Fingerprinting

Aside from the IP address, there are a number of different factors that can be used to attempt to fingerprint a device. Some of these can be obtained passively by the server from the HTTP headers (particularly the "User-Agent" header), including:

- Operating system & version
- Browser & version
- Language

Using JavaScript it is possible to access far more information, such as:

- Screen resolution
- Installed fonts
- Installed browser plugins

Using these various attributes, it is possible to create a fingerprint of the device. This fingerprint can then be matched against any browser attempting to login to the account, and if it doesn't match then the user can be prompted for additional authentication. Many users will have multiple devices or browsers that they use, so it is not practical to simply block attempts that do not match the existing fingerprints, however it is common to define a process for users or customers to view their device history and manage their remembered devices. Also these attributes can be used to detect anomalous activity such as a device appearing to be running an older version of OS or Browser.

The [fingerprintjs2](https://github.com/Valve/fingerprintjs2) JavaScript library can be used to carry out client-side fingerprinting.

It should be noted that as all this information is provided by the client, it can potentially be spoofed by an attacker. In some cases spoofing these attributes is trivial (such as the "User-Agent") header, but in other cases it may be more difficult to modify these attributes.

### Connection Fingerprinting

Similar to device fingerprinting, there are numerous fingerprinting techniques available for network connections. Some examples include [JA3](https://github.com/salesforce/ja3), HTTP/2 fingerprinting and HTTP header order. As these techniques typically focus on how a connection is made, connection fingerprinting may provide more accurate results than other defenses that rely on an indicator, such as an IP address, or request data, such as user agent string.

Connection fingerprinting may also be used in conjunction with other defenses to ascertain the truthfulness of an authentication request. For example, if the user agent header and device fingerprint indicates a mobile device, but the connection fingerprint indicates a Python script, the request is likely suspect.

### Require Unpredictable Usernames

Credential stuffing attacks rely on not just the re-use of passwords between multiple sites, but also the re-use of usernames. A significant number of websites use the email address as the username, and as most users will have a single email address they use for all their accounts, this makes the combination of an email address and password very effective for credential stuffing attacks.

Requiring users to create their own username when registering on the website makes it harder for an attacker to obtain valid username and password pairs for credential stuffing, as many of the available credential lists only include email addresses. Providing the user with a generated username can provide a higher degree of protection (as users are likely to choose the same username on most websites), but is user unfriendly. Additionally, care needs to be taken to ensure that the generated username is not predictable (such as being based on the user's full name, or sequential numeric IDs), as this could make enumerating valid usernames for a password spraying attack easier.

### Multi-Step Login Processes

The majority of off-the-shelf tools are designed for a single step login process, where the credentials are POSTed to the server, and the response indicates whether or not the login attempt was successful. By adding additional steps to this process, such as requiring the username and password to be entered sequentially, or requiring that the user first obtains a random [CSRF Token](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html) before they can login, this makes the attack slightly more difficult to perform, and doubles the number of requests that the attacker must make.

Multi-step login processes, however, should be mindful that they do not faciliate [user enumeration](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html). Enumerating users prior to a credential stuffing attack may result in a harder to identify, lower request volume attack.

### Require JavaScript and Block Headless Browsers

Most tools used for these types of attacks will make direct POST requests to the server and read the responses, but will not download or execute JavaScript that was contained in them. By requiring the attacker to evaluate JavaScript in the response (for example to generate a valid token that must be submitted with the request), this forces the attacker to either use a real browser with an automation framework like Selenium or Headless Chrome, or to implement JavaScript parsing with another tool such as PhantomJS. Additionally, there are a number of techniques that can be used to identify [Headless Chrome](https://antoinevastel.com/bot%20detection/2018/01/17/detect-chrome-headless-v2.html) or [PhantomJS](https://blog.shapesecurity.com/2015/01/22/detecting-phantomjs-based-visitors/).

Please note that blocking visitors who have JavaScript disabled will reduce the accessibility of the website, especially to visitors who use screen readers. In certain jurisdictions this may be in breach of equalities legislation.

### Degradation

A more aggressive defense against credential stuffing is to implement measures that increase the amount of time the attack takes to complete. This may include incrementally increasing the complexity of the JavaScript that must be evaluated, requiring users to solve a cryptographic or Proof-of-Work computational puzzle, introducing long wait periods before responding to requests, returning overly large HTML assets or returning randomized error messages.

These techniques provide some level of security without resorting to user tracking or profiling. They typically do not require a human in the loop, but rather constrain the minimum latency and/or the maximum request rate of a particular client implementation and the attacker's budget and sophistication, and requires a context-dependent risk assessment to gauge their efficacy, resistance to countermeasures and user experience impact.

### Identifying Leaked Passwords

[ASVS v4.0 Password Security Requirements](https://github.com/OWASP/ASVS/blob/master/4.0/en/0x11-V2-Authentication.md#v21-password-security-requirements) provision (2.1.7) on verifying new passwords presence in breached password datasets should be implemented.

There are both commercial and free services that may be of use for validating passwords presence in prior breaches. A well known free service for this is [Pwned Passwords](https://haveibeenpwned.com/Passwords). You can host a copy of the application yourself, or use the [API](https://haveibeenpwned.com/API/v2#PwnedPasswords).

### Notify users about unusual security events

When suspicious or unusual activity is detected, it may be appropriate to notify or warn the user. However, care should be taken that the user does not get overwhelmed with a large number of notifications that are not important to them, or they will just start to ignore or delete them. Additionally, due to frequent reuse of passwords across multiple sites, the possibility that the users email account has also been compromised should be considered.

For example, it would generally not be appropriate to notify a user that there had been an attempt to login to their account with an incorrect password. However, if there had been a login with the correct password, but which had then failed the subsequent MFA check, the user should be notified so that they can change their password. Subsequently, should the user request multiple password resets from different devices or IP addresses, it may be appropriate to prevent further access to the account pending further user verification processes.

Details related to current or recent logins should also be made visible to the user. For example, when they login to the application, the date, time and location of their previous login attempt could be displayed to them. Additionally, if the application supports concurrent sessions, the user should be able to view a list of all active sessions, and to terminate any other sessions that are not legitimate.

</section>

<section id="credential-stuffing-prevention-translation-panel" className="tabPanel translationPanel contentPanel">

## はじめに

このチートシートは、認証に関連する一般的な二種類の攻撃、クレデンシャルスタッフィングとパスワードスプレーに対する防御を扱う。これらは別個の異なる攻撃であるが、多くの場合、それらを防ぐために実装される防御策は同じであり、総当たり攻撃に対しても有効である。これらの攻撃の概要を以下に示す。

| 攻撃種別 | 説明 |
|-------------|-------------|
| 総当たり攻撃 | 辞書などのソースから複数のパスワードを単一アカウントに対して試す。 |
| クレデンシャルスタッフィング | 別サイトの侵害から得られたユーザー名とパスワードの組み合わせを試す。 |
| パスワードスプレー | 単一の弱いパスワードを多数の異なるアカウントに対して試す。 |

## 多要素認証

[多要素認証 (MFA)](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html) は、クレデンシャルスタッフィングやパスワードスプレーを含む大多数のパスワード関連攻撃に対して、群を抜いて最善の防御である。Microsoft の分析では、MFA により[アカウント侵害の 99.9%](https://techcommunity.microsoft.com/t5/Azure-Active-Directory-Identity/Your-Pa-word-doesn-t-matter/ba-p/731984)を阻止できた可能性があると示されている。そのため、可能な限り実装すべきである。従来は、アプリケーションの利用者層によっては MFA の利用を強制することが実用的または現実的でない場合があった。しかし現在では、最新のブラウザやモバイル端末が FIDO2 パスキーやその他の MFA 形式をサポートしており、ほとんどのユースケースで実現可能になっている。

セキュリティとユーザビリティのバランスを取るために、多要素認証は他の技術と組み合わせ、ログイン試行が正当でない疑いがある特定の状況でのみ第二要素を要求できる。たとえば、以下からのログインである。

- 新しいブラウザ、デバイス、または IP アドレス。
- 通常とは異なる国または場所。
- 信頼できないと見なされる、または通常そのサービスのユーザーが存在しない特定の国。
- 既知の拒否リストに掲載されている IP アドレス、またはプロキシや VPN サービスなどの匿名化サービスに関連付けられている IP アドレス。
- 複数のアカウントへのログインを試行した IP アドレス。
- 人間ではなくスクリプトまたはボットからのものと思われるログイン試行 (つまり、単一の IP またはサブネットから大量のログインが発生している場合)。

または、上記のシナリオがセッション中に発生し、さらに以下のような高リスクの操作要求と組み合わさった場合に、組織は「ステップアップ」認証として MFA を要求することを選択できる。

- 高額の通貨取引
- 特権または管理用の構成変更

加えて、エンタープライズアプリケーションでは、既知の信頼済み IP 範囲を許可リストに追加し、ユーザーがその範囲から接続する場合には MFA を不要にできる。

## 代替防御策

MFA を実装できない場合、クレデンシャルスタッフィングやパスワードスプレーを防ぐために使用できる代替防御策は多数ある。単独では MFA ほど有効なものはないが、複数の防御策を層状に組み合わせることで、妥当な程度の保護を提供できる。多くの場合、これらのメカニズムは総当たり攻撃やパスワードスプレー攻撃に対しても保護を提供する。

アプリケーションに複数のユーザーロールがある場合は、ロールごとに異なる防御策を実装することが適切な場合がある。たとえば、すべてのユーザーに MFA を強制することは現実的でなくても、すべての管理者に MFA の利用を必須にすることは可能であるべきである。

## 多層防御とメトリクス

特定の技術ではないが、個々の防御策が破られたり、その他の理由で失敗したりした場合の影響を考慮した防御を実装することが重要である。例として、デバイスフィンガープリンティングや JavaScript チャレンジなどのクライアント側防御は偽装または迂回される可能性があるため、それを考慮した他の防御層を実装すべきである。

さらに、各防御策は検知メカニズムとして使用するための量的メトリクスを生成すべきである。理想的には、そのメトリクスには検知された攻撃量と緩和された攻撃量の両方が含まれ、IP アドレスなどのフィールドでフィルタリングできるようにする。これらのメトリクスを監視およびレポートすることで、防御策の失敗や未特定の攻撃の存在、新しい防御策または改善された防御策の影響を特定できる可能性がある。

最後に、複数のチームが異なる防御策を管理している場合、各チームが個々の防御策のメンテナンス、デプロイ、またはその他の変更を行う際には、連絡と調整が行われるよう注意すべきである。

### 二次パスワード、PIN、セキュリティ質問

認証時にユーザーへパスワードの入力を求めるだけでなく、以下のような追加のセキュリティ情報の提供を求めることもできる。

- PIN
- 二次パスワードまたは記憶語の特定の文字
- [セキュリティ質問](https://cheatsheetseries.owasp.org/cheatsheets/Choosing_and_Using_Security_Questions_Cheat_Sheet.html)への回答

これは多要素認証を構成するものでは**ない**ことを強調しなければならない (どちらの要素も同じ「知っているもの」であるため)。しかし、適切な MFA を実装できない場合には、クレデンシャルスタッフィングとパスワードスプレーの両方に対する有用な保護層を提供できる。

### CAPTCHA

各ログイン試行でユーザーに「Completely Automated Public Turing test to tell Computers and Humans Apart」(CAPTCHA) または類似のパズルを解かせることは、自動化された攻撃やボット攻撃の特定に役立ち、自動ログイン試行の防止にも役立つ。また、クレデンシャルスタッフィングやパスワードスプレー攻撃を遅らせる可能性がある。しかし CAPTCHA は完全ではなく、多くの場合、かなり高い成功率で突破するためのツールやサービスが存在する。CAPTCHA の解決率を監視すると、正当なユーザーへの影響だけでなく、自動 CAPTCHA 破り技術の存在を特定する助けになる場合がある。異常に高い解決率はその兆候になり得る。

ユーザビリティを向上させるために、MFA セクションで説明したものと同じ基準を使用し、ログイン要求が疑わしい、または高リスクと見なされる場合にのみ CAPTCHA の解決を求めることが望ましい場合がある。

### IP 緩和策とインテリジェンス

IP アドレスのブロックは、あまり高度でない攻撃を止めるには十分な場合があるが、回避が容易であるため、唯一または主要な防御として使用すべきではない。攻撃のさまざまな要因に応じて複数の防御策を活用する、段階的な不正利用対応の方が効果的である。

IP アドレスからのクレデンシャルスタッフィングトラフィックを緩和する (ブロックや CAPTCHA を含む) ためのあらゆるプロセスや判断では、多数の不正利用シナリオを考慮し、単一の予測可能な量的しきい値に依存すべきではない。短い期間 (つまりバースト) と長い期間の両方、高いリクエスト量、さらに一つの IP アドレスが、おそらく_多数_の他の IP アドレスと連携して、低量だが継続的なトラフィックを生成する事例も考慮すべきである。さらに、緩和の判断では、IP アドレスの分類 (例: 住宅回線かホスティングか) や地理的位置などの要因を考慮すべきである。これらの要因は、正当なユーザーへの潜在的影響を減らすため、または異常な送信元から発生する不正利用をより積極的に緩和するために、緩和しきい値を上下させる目的で活用できる。緩和策、特に IP アドレスのブロックは一時的であるべきであり、不正利用が減少または停止した際に IP アドレスを緩和状態から解除するプロセスを用意すべきである。

[Sentry MBA](https://federalnewsnetwork.com/wp-content/uploads/2020/06/Shape-Threat-Research-Automating-Cybercrime-with-SentryMBA.pdf) など、多くのクレデンシャルスタッフィングツールキットは、大量の一意な IP アドレスにリクエストを分散するために、プロキシネットワークの組み込み利用を提供している。これにより、IP ブロックリストとレート制限の両方が無効化される可能性がある。大規模攻撃であっても、IP ごとのリクエスト量は比較的低いままになることがあるためである。認証トラフィックをプロキシや類似の IP アドレスインテリジェンス、およびホスティング事業者の IP アドレス範囲と相関させることで、高度に分散したクレデンシャルスタッフィング攻撃を特定し、緩和のトリガーとしても利用できる。たとえば、ホスティング事業者から発信されたすべてのリクエストに CAPTCHA の解決を要求できる。

この目的のデータソースとして活用できる IP アドレスインテリジェンスおよび分類の情報源には、公開のものと商用のものの両方がある。さらに、一部のホスティング事業者は、[AWS](https://docs.aws.amazon.com/vpc/latest/userguide/aws-ip-ranges.html) などのように、自社の IP アドレス空間を公開している。

ネットワーク接続のブロックとは別に、アカウントの IP アドレス認証履歴を保存することを検討する。最近使用された IP アドレスがブロックリストまたは緩和リストに追加された場合、アカウントをロックしてユーザーに通知することが適切な場合がある。

### デバイスフィンガープリンティング

IP アドレス以外にも、デバイスのフィンガープリントを試みるために使用できるさまざまな要素がある。その一部は、サーバーが HTTP ヘッダー (特に `User-Agent` ヘッダー) から受動的に取得できる。たとえば以下である。

- オペレーティングシステムとバージョン
- ブラウザとバージョン
- 言語

JavaScript を使用すると、以下のようなさらに多くの情報にアクセスできる。

- 画面解像度
- インストール済みフォント
- インストール済みブラウザプラグイン

これらのさまざまな属性を使用して、デバイスのフィンガープリントを作成できる。このフィンガープリントを、そのアカウントへのログインを試みる任意のブラウザと照合し、一致しない場合にはユーザーに追加認証を求めることができる。多くのユーザーは複数のデバイスやブラウザを使用するため、既存のフィンガープリントと一致しない試行を単純にブロックすることは現実的ではない。しかし、ユーザーまたは顧客がデバイス履歴を確認し、記憶済みデバイスを管理できるプロセスを定義することは一般的である。また、これらの属性は、デバイスが古いバージョンの OS やブラウザを実行しているように見えるなどの異常な活動を検知するためにも使用できる。

[fingerprintjs2](https://github.com/Valve/fingerprintjs2) JavaScript ライブラリは、クライアント側フィンガープリンティングを実行するために使用できる。

この情報はすべてクライアントから提供されるため、攻撃者によって偽装される可能性があることに注意すべきである。場合によっては、`User-Agent` ヘッダーのように、これらの属性の偽装は容易であるが、他の場合には、これらの属性を変更することがより困難な場合がある。

### 接続フィンガープリンティング

デバイスフィンガープリンティングと同様に、ネットワーク接続には多数のフィンガープリンティング技術が利用できる。例として、[JA3](https://github.com/salesforce/ja3)、HTTP/2 フィンガープリンティング、HTTP ヘッダー順序がある。これらの技術は通常、接続がどのように行われるかに注目するため、IP アドレスのような指標や User-Agent 文字列のようなリクエストデータに依存する他の防御策よりも、接続フィンガープリンティングの方が正確な結果を提供する場合がある。

接続フィンガープリンティングは、認証要求の真正性を確認するために、他の防御策と組み合わせて使用することもできる。たとえば、User-Agent ヘッダーとデバイスフィンガープリントがモバイルデバイスを示している一方で、接続フィンガープリントが Python スクリプトを示している場合、そのリクエストは疑わしい可能性が高い。

### 予測困難なユーザー名を要求する

クレデンシャルスタッフィング攻撃は、複数のサイト間でパスワードが再利用されることだけでなく、ユーザー名が再利用されることにも依存している。多数のウェブサイトではメールアドレスをユーザー名として使用しており、ほとんどのユーザーはすべてのアカウントで一つのメールアドレスを使用するため、メールアドレスとパスワードの組み合わせはクレデンシャルスタッフィング攻撃に対して非常に効果的になる。

ウェブサイトへの登録時にユーザー自身でユーザー名を作成するよう要求すると、攻撃者がクレデンシャルスタッフィングに有効なユーザー名とパスワードのペアを取得しにくくなる。利用可能な認証情報リストの多くにはメールアドレスしか含まれていないためである。生成されたユーザー名をユーザーに提供すると、より高い保護を提供できる (ユーザーはほとんどのウェブサイトで同じユーザー名を選びがちであるため) が、ユーザーには使いにくい。さらに、生成されたユーザー名が予測可能でないことを確保するよう注意する必要がある。たとえば、ユーザーのフルネームに基づいていたり、連番の数値 ID であったりすると、パスワードスプレー攻撃のために有効なユーザー名を列挙しやすくなる可能性がある。

### 多段階ログインプロセス

既製のツールの大半は、認証情報をサーバーに POST し、レスポンスがログイン試行の成功または失敗を示す単一段階のログインプロセス向けに設計されている。このプロセスに追加の段階を加える、たとえばユーザー名とパスワードを順に入力させる、またはログイン前にランダムな [CSRF トークン](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)を取得させることで、攻撃の実行をわずかに難しくし、攻撃者が行う必要のあるリクエスト数を倍増させる。

ただし、多段階ログインプロセスでは、[ユーザー列挙](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)を助長しないよう注意すべきである。クレデンシャルスタッフィング攻撃の前にユーザーを列挙すると、識別がより困難でリクエスト量の少ない攻撃につながる可能性がある。

### JavaScript を要求し、ヘッドレスブラウザをブロックする

これらの種類の攻撃に使用されるほとんどのツールは、サーバーに直接 POST リクエストを行い、レスポンスを読み取るが、その中に含まれる JavaScript をダウンロードまたは実行しない。レスポンス内の JavaScript を評価することを攻撃者に要求する (たとえば、リクエストとともに送信しなければならない有効なトークンを生成するため) と、攻撃者は Selenium や Headless Chrome のような自動化フレームワークを備えた実ブラウザを使用するか、PhantomJS などの別のツールで JavaScript 解析を実装せざるを得なくなる。さらに、[Headless Chrome](https://antoinevastel.com/bot%20detection/2018/01/17/detect-chrome-headless-v2.html) や [PhantomJS](https://blog.shapesecurity.com/2015/01/22/detecting-phantomjs-based-visitors/) を識別するために使用できる技術も多数ある。

JavaScript を無効化している訪問者をブロックすると、ウェブサイトのアクセシビリティが低下することに注意する。特にスクリーンリーダーを使用する訪問者に影響する。一部の法域では、これが平等法制に違反する可能性がある。

### 劣化

クレデンシャルスタッフィングに対するより積極的な防御として、攻撃の完了にかかる時間を増やす措置を実装する方法がある。これには、評価しなければならない JavaScript の複雑さを段階的に高めること、ユーザーに暗号学的または Proof-of-Work の計算パズルを解かせること、リクエストへの応答前に長い待機時間を導入すること、過度に大きな HTML アセットを返すこと、ランダム化されたエラーメッセージを返すことが含まれる。

これらの技術は、ユーザー追跡やプロファイリングに頼らずに、一定レベルのセキュリティを提供する。通常、人間の介入を必要とせず、特定のクライアント実装の最小レイテンシまたは最大リクエストレート、および攻撃者の予算と高度さを制約する。ただし、その有効性、対抗策への耐性、ユーザー体験への影響を測るには、文脈に応じたリスク評価が必要である。

### 漏えいパスワードの特定

[ASVS v4.0 Password Security Requirements](https://github.com/OWASP/ASVS/blob/master/4.0/en/0x11-V2-Authentication.md#v21-password-security-requirements) の規定 (2.1.7)、すなわち新しいパスワードが侵害されたパスワードデータセットに存在するかを検証する要件を実装すべきである。

過去の侵害にパスワードが存在するかを検証するために役立つ商用サービスと無料サービスの両方がある。この目的でよく知られた無料サービスは [Pwned Passwords](https://haveibeenpwned.com/Passwords) である。アプリケーションのコピーを自分でホストすることも、[API](https://haveibeenpwned.com/API/v2#PwnedPasswords) を使用することもできる。

### 異常なセキュリティイベントについてユーザーに通知する

疑わしい活動や通常と異なる活動が検知された場合、ユーザーに通知または警告することが適切な場合がある。ただし、ユーザーにとって重要でない通知が大量に届いて圧倒されないよう注意すべきである。そうなると、ユーザーは通知を無視したり削除したりし始める。また、複数のサイトでパスワードが頻繁に再利用されるため、ユーザーのメールアカウントも侵害されている可能性を考慮すべきである。

たとえば、誤ったパスワードでアカウントへのログイン試行があったことをユーザーに通知することは、一般的には適切ではない。しかし、正しいパスワードでログインされたが、その後の MFA チェックに失敗した場合には、ユーザーがパスワードを変更できるよう通知すべきである。その後、ユーザーが異なるデバイスや IP アドレスから複数回パスワードリセットを要求した場合には、追加のユーザー検証プロセスが完了するまで、そのアカウントへのさらなるアクセスを防止することが適切な場合がある。

現在または最近のログインに関する詳細も、ユーザーが確認できるようにすべきである。たとえば、ユーザーがアプリケーションにログインしたときに、前回のログイン試行の日時と場所を表示できる。さらに、アプリケーションが同時セッションをサポートしている場合、ユーザーはすべてのアクティブセッションのリストを表示し、正当でない他のセッションを終了できるべきである。

</section>

<section id="credential-stuffing-prevention-bilingual-panel" className="tabPanel bilingualPanel contentPanel">

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Introduction

This cheatsheet covers defences against two common types of authentication-related attacks: credential stuffing and password spraying. Although these are separate, distinct attacks, in many cases the defences that would be implemented to protect against them are the same, and they would also be effective at protecting against brute-force attacks. A summary of these different attacks is listed below:

| Attack Type | Description |
|-------------|-------------|
| Brute Force | Testing multiple passwords from dictionary or other source against a single account. |
| Credential Stuffing | Testing username/password pairs obtained from the breach of another site. |
| Password Spraying | Testing a single weak password against a large number of different accounts. |

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語訳</span>

## はじめに

このチートシートは、認証に関連する一般的な二種類の攻撃、クレデンシャルスタッフィングとパスワードスプレーに対する防御を扱う。これらは別個の異なる攻撃であるが、多くの場合、それらを防ぐために実装される防御策は同じであり、総当たり攻撃に対しても有効である。これらの攻撃の概要を以下に示す。

| 攻撃種別 | 説明 |
|-------------|-------------|
| 総当たり攻撃 | 辞書などのソースから複数のパスワードを単一アカウントに対して試す。 |
| クレデンシャルスタッフィング | 別サイトの侵害から得られたユーザー名とパスワードの組み合わせを試す。 |
| パスワードスプレー | 単一の弱いパスワードを多数の異なるアカウントに対して試す。 |

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Multi-Factor Authentication

[Multi-factor authentication (MFA)](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html) is by far the best defense against the majority of password-related attacks, including credential stuffing and password spraying, with analysis by Microsoft suggesting that it would have stopped [99.9% of account compromises](https://techcommunity.microsoft.com/t5/Azure-Active-Directory-Identity/Your-Pa-word-doesn-t-matter/ba-p/731984). As such, it should be implemented wherever possible. Historically, depending on the audience of the application, it may not have been practical or feasible to enforce the use of MFA, however with modern browsers and mobile devices now supporting FIDO2 Passkeys and other forms of MFA, it is attainable for most use cases.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語訳</span>

## 多要素認証

[多要素認証 (MFA)](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html) は、クレデンシャルスタッフィングやパスワードスプレーを含む大多数のパスワード関連攻撃に対して、群を抜いて最善の防御である。Microsoft の分析では、MFA により[アカウント侵害の 99.9%](https://techcommunity.microsoft.com/t5/Azure-Active-Directory-Identity/Your-Pa-word-doesn-t-matter/ba-p/731984)を阻止できた可能性があると示されている。そのため、可能な限り実装すべきである。従来は、アプリケーションの利用者層によっては MFA の利用を強制することが実用的または現実的でない場合があった。しかし現在では、最新のブラウザやモバイル端末が FIDO2 パスキーやその他の MFA 形式をサポートしており、ほとんどのユースケースで実現可能になっている。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

In order to balance security and usability, multi-factor authentication can be combined with other techniques to require the 2nd factor only in specific circumstances where there is reason to suspect that the login attempt may not be legitimate, such as a login from:

- A new browser/device or IP address.
- An unusual country or location.
- Specific countries that are considered untrusted or typically do not contain users of a service.
- An IP address that appears on known denylists or is associated with anonymization services, such as proxy or VPN services.
- An IP address that has tried to login to multiple accounts.
- A login attempt that appears to be scripted or from a bot rather than a human (i.e. large login volume sourced from a single IP or subnet).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語訳</span>

セキュリティとユーザビリティのバランスを取るために、多要素認証は他の技術と組み合わせ、ログイン試行が正当でない疑いがある特定の状況でのみ第二要素を要求できる。たとえば、以下からのログインである。

- 新しいブラウザ、デバイス、または IP アドレス。
- 通常とは異なる国または場所。
- 信頼できないと見なされる、または通常そのサービスのユーザーが存在しない特定の国。
- 既知の拒否リストに掲載されている IP アドレス、またはプロキシや VPN サービスなどの匿名化サービスに関連付けられている IP アドレス。
- 複数のアカウントへのログインを試行した IP アドレス。
- 人間ではなくスクリプトまたはボットからのものと思われるログイン試行 (つまり、単一の IP またはサブネットから大量のログインが発生している場合)。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Or an organization may choose to require MFA in the form of a "step-up" authentication for the above scenarios during a session combined with a request for a high risk activity such as:

- Large currency transactions
- Privileged or Administrative configuration changes

Additionally, for enterprise applications, known trusted IP ranges could be added to an allowlist so that MFA is not required when users connect from these ranges.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語訳</span>

または、上記のシナリオがセッション中に発生し、さらに以下のような高リスクの操作要求と組み合わさった場合に、組織は「ステップアップ」認証として MFA を要求することを選択できる。

- 高額の通貨取引
- 特権または管理用の構成変更

加えて、エンタープライズアプリケーションでは、既知の信頼済み IP 範囲を許可リストに追加し、ユーザーがその範囲から接続する場合には MFA を不要にできる。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Alternative Defenses

Where it is not possible to implement MFA, there are many alternative defenses that can be used to protect against credential stuffing and password spraying. In isolation none of these are as effective as MFA, however multiple, layered defenses can provide a reasonable degree of protection. In many cases, these mechanisms will also protect against brute-force or password spraying attacks.

Where an application has multiple user roles, it may be appropriate to implement different defenses for different roles. For example, it may not be feasible to enforce MFA for all users, but it should be possible to require that all administrators use it.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語訳</span>

## 代替防御策

MFA を実装できない場合、クレデンシャルスタッフィングやパスワードスプレーを防ぐために使用できる代替防御策は多数ある。単独では MFA ほど有効なものはないが、複数の防御策を層状に組み合わせることで、妥当な程度の保護を提供できる。多くの場合、これらのメカニズムは総当たり攻撃やパスワードスプレー攻撃に対しても保護を提供する。

アプリケーションに複数のユーザーロールがある場合は、ロールごとに異なる防御策を実装することが適切な場合がある。たとえば、すべてのユーザーに MFA を強制することは現実的でなくても、すべての管理者に MFA の利用を必須にすることは可能であるべきである。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Defense in Depth & Metrics

While not a specific technique, it is important to implement defenses that consider the impact of individual defenses being defeated or otherwise failing. As an example, client-side defenses, such as device fingerprinting or JavaScript challenges, may be spoofed or bypassed and other layers of defense should be implemented to account for this.

Additionally, each defense should generate volume metrics for use as a detective mechanism. Ideally the metrics will include both detected and mitigated attack volume and allow for filtering on fields such as IP address. Monitoring and reporting on these metrics may identify defense failures or the presence of unidentified attacks, as well as the impact of new or improved defenses.

Finally, when administration of different defenses is performed by multiple teams, care should be taken to ensure there is communication and coordination when separate teams are performing maintenance, deployment or otherwise modifying individual defenses.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語訳</span>

## 多層防御とメトリクス

特定の技術ではないが、個々の防御策が破られたり、その他の理由で失敗したりした場合の影響を考慮した防御を実装することが重要である。例として、デバイスフィンガープリンティングや JavaScript チャレンジなどのクライアント側防御は偽装または迂回される可能性があるため、それを考慮した他の防御層を実装すべきである。

さらに、各防御策は検知メカニズムとして使用するための量的メトリクスを生成すべきである。理想的には、そのメトリクスには検知された攻撃量と緩和された攻撃量の両方が含まれ、IP アドレスなどのフィールドでフィルタリングできるようにする。これらのメトリクスを監視およびレポートすることで、防御策の失敗や未特定の攻撃の存在、新しい防御策または改善された防御策の影響を特定できる可能性がある。

最後に、複数のチームが異なる防御策を管理している場合、各チームが個々の防御策のメンテナンス、デプロイ、またはその他の変更を行う際には、連絡と調整が行われるよう注意すべきである。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Secondary Passwords, PINs and Security Questions

As well as requiring a user to enter their password when authenticating, users can also be prompted to provide additional security information such as:

- A PIN
- Specific characters from a secondary passwords or memorable word
- Answers to [security questions](https://cheatsheetseries.owasp.org/cheatsheets/Choosing_and_Using_Security_Questions_Cheat_Sheet.html)

It must be emphasised that this **does not** constitute multi-factor authentication (as both factors are the same - something you know). However, it can still provide a useful layer of protection against both credential stuffing and password spraying where proper MFA can't be implemented.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語訳</span>

### 二次パスワード、PIN、セキュリティ質問

認証時にユーザーへパスワードの入力を求めるだけでなく、以下のような追加のセキュリティ情報の提供を求めることもできる。

- PIN
- 二次パスワードまたは記憶語の特定の文字
- [セキュリティ質問](https://cheatsheetseries.owasp.org/cheatsheets/Choosing_and_Using_Security_Questions_Cheat_Sheet.html)への回答

これは多要素認証を構成するものでは**ない**ことを強調しなければならない (どちらの要素も同じ「知っているもの」であるため)。しかし、適切な MFA を実装できない場合には、クレデンシャルスタッフィングとパスワードスプレーの両方に対する有用な保護層を提供できる。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### CAPTCHA

Requiring a user to solve a "Completely Automated Public Turing test to tell Computers and Humans Apart" (CAPTCHA) or similar puzzle for each login attempt can help to identify automated/bot attacks and help prevent automated login attempts, and may slow down credential stuffing or password spraying attacks. However, CAPTCHAs are not perfect, and in many cases tools or services exist that can be used to break them with a reasonably high success rate. Monitoring CAPTCHA solve rates may help identify impact to good users, as well as automated CAPTCHA breaking technology, possibly indicated by abnormally high solve rates.

To improve usability, it may be desirable to only require the user solve a CAPTCHA when the login request is considered suspicious or high risk, using the same criteria discussed in the MFA section.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語訳</span>

### CAPTCHA

各ログイン試行でユーザーに「Completely Automated Public Turing test to tell Computers and Humans Apart」(CAPTCHA) または類似のパズルを解かせることは、自動化された攻撃やボット攻撃の特定に役立ち、自動ログイン試行の防止にも役立つ。また、クレデンシャルスタッフィングやパスワードスプレー攻撃を遅らせる可能性がある。しかし CAPTCHA は完全ではなく、多くの場合、かなり高い成功率で突破するためのツールやサービスが存在する。CAPTCHA の解決率を監視すると、正当なユーザーへの影響だけでなく、自動 CAPTCHA 破り技術の存在を特定する助けになる場合がある。異常に高い解決率はその兆候になり得る。

ユーザビリティを向上させるために、MFA セクションで説明したものと同じ基準を使用し、ログイン要求が疑わしい、または高リスクと見なされる場合にのみ CAPTCHA の解決を求めることが望ましい場合がある。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### IP Mitigation and Intelligence

Blocking IP addresses may be sufficient to stop less sophisticated attacks, but should not be used as the sole or primary defense due to the ease in circumvention. It is more effective to have a graduated response to abuse that leverages multiple defensive measures depending on different factors of the attack.

Any process or decision to mitigate (including blocking and CAPTCHA) credential stuffing traffic from an IP address should consider a multitude of abuse scenarios, and not rely on a single predictable volume limit. Short (i.e. burst) and long time periods should be considered, as well as high request volume and instances where one IP address, likely in concert with _many_ other IP addresses, generates low but consistent volumes of traffic. Additionally, mitigation decisions should consider factors such as IP address classification (ex: residential vs hosting) and geolocation. These factors may be leveraged to raise or lower mitigation thresholds in order to reduce potential impact on legitimate users or more aggressively mitigate abuse originating from abnormal sources. Mitigations, especially blocking an IP address, should be temporary and processes should be in place to remove an IP address from a mitigated state as abuse declines or stops.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語訳</span>

### IP 緩和策とインテリジェンス

IP アドレスのブロックは、あまり高度でない攻撃を止めるには十分な場合があるが、回避が容易であるため、唯一または主要な防御として使用すべきではない。攻撃のさまざまな要因に応じて複数の防御策を活用する、段階的な不正利用対応の方が効果的である。

IP アドレスからのクレデンシャルスタッフィングトラフィックを緩和する (ブロックや CAPTCHA を含む) ためのあらゆるプロセスや判断では、多数の不正利用シナリオを考慮し、単一の予測可能な量的しきい値に依存すべきではない。短い期間 (つまりバースト) と長い期間の両方、高いリクエスト量、さらに一つの IP アドレスが、おそらく_多数_の他の IP アドレスと連携して、低量だが継続的なトラフィックを生成する事例も考慮すべきである。さらに、緩和の判断では、IP アドレスの分類 (例: 住宅回線かホスティングか) や地理的位置などの要因を考慮すべきである。これらの要因は、正当なユーザーへの潜在的影響を減らすため、または異常な送信元から発生する不正利用をより積極的に緩和するために、緩和しきい値を上下させる目的で活用できる。緩和策、特に IP アドレスのブロックは一時的であるべきであり、不正利用が減少または停止した際に IP アドレスを緩和状態から解除するプロセスを用意すべきである。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Many credential stuffing toolkits, such as [Sentry MBA](https://federalnewsnetwork.com/wp-content/uploads/2020/06/Shape-Threat-Research-Automating-Cybercrime-with-SentryMBA.pdf), offer built-in use of proxy networks to distribute requests across a large volume of unique IP addresses. This may defeat both IP block-lists and rate limiting, as per IP request volume may remain relatively low, even on high volume attacks. Correlating authentication traffic with proxy and similar IP address intelligence, as well as hosting provider IP address ranges can help identify highly distributed credential stuffing attacks, as well as serve as a mitigation trigger. For example, every request originating from a hosting provider could be required to solve CAPTCHA.

There are both public and commercial sources of IP address intelligence and classification that may be leveraged as data sources for this purpose. Additionally, some hosting providers publish their own IP address space, such as [AWS](https://docs.aws.amazon.com/vpc/latest/userguide/aws-ip-ranges.html).

Separate from blocking network connections, consider storing an account's IP address authentication history. In case a recent IP address is added to a block or mitigation list, it may be appropriate to lock the account and notify the user.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語訳</span>

[Sentry MBA](https://federalnewsnetwork.com/wp-content/uploads/2020/06/Shape-Threat-Research-Automating-Cybercrime-with-SentryMBA.pdf) など、多くのクレデンシャルスタッフィングツールキットは、大量の一意な IP アドレスにリクエストを分散するために、プロキシネットワークの組み込み利用を提供している。これにより、IP ブロックリストとレート制限の両方が無効化される可能性がある。大規模攻撃であっても、IP ごとのリクエスト量は比較的低いままになることがあるためである。認証トラフィックをプロキシや類似の IP アドレスインテリジェンス、およびホスティング事業者の IP アドレス範囲と相関させることで、高度に分散したクレデンシャルスタッフィング攻撃を特定し、緩和のトリガーとしても利用できる。たとえば、ホスティング事業者から発信されたすべてのリクエストに CAPTCHA の解決を要求できる。

この目的のデータソースとして活用できる IP アドレスインテリジェンスおよび分類の情報源には、公開のものと商用のものの両方がある。さらに、一部のホスティング事業者は、[AWS](https://docs.aws.amazon.com/vpc/latest/userguide/aws-ip-ranges.html) などのように、自社の IP アドレス空間を公開している。

ネットワーク接続のブロックとは別に、アカウントの IP アドレス認証履歴を保存することを検討する。最近使用された IP アドレスがブロックリストまたは緩和リストに追加された場合、アカウントをロックしてユーザーに通知することが適切な場合がある。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Device Fingerprinting

Aside from the IP address, there are a number of different factors that can be used to attempt to fingerprint a device. Some of these can be obtained passively by the server from the HTTP headers (particularly the "User-Agent" header), including:

- Operating system & version
- Browser & version
- Language

Using JavaScript it is possible to access far more information, such as:

- Screen resolution
- Installed fonts
- Installed browser plugins

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語訳</span>

### デバイスフィンガープリンティング

IP アドレス以外にも、デバイスのフィンガープリントを試みるために使用できるさまざまな要素がある。その一部は、サーバーが HTTP ヘッダー (特に `User-Agent` ヘッダー) から受動的に取得できる。たとえば以下である。

- オペレーティングシステムとバージョン
- ブラウザとバージョン
- 言語

JavaScript を使用すると、以下のようなさらに多くの情報にアクセスできる。

- 画面解像度
- インストール済みフォント
- インストール済みブラウザプラグイン

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Using these various attributes, it is possible to create a fingerprint of the device. This fingerprint can then be matched against any browser attempting to login to the account, and if it doesn't match then the user can be prompted for additional authentication. Many users will have multiple devices or browsers that they use, so it is not practical to simply block attempts that do not match the existing fingerprints, however it is common to define a process for users or customers to view their device history and manage their remembered devices. Also these attributes can be used to detect anomalous activity such as a device appearing to be running an older version of OS or Browser.

The [fingerprintjs2](https://github.com/Valve/fingerprintjs2) JavaScript library can be used to carry out client-side fingerprinting.

It should be noted that as all this information is provided by the client, it can potentially be spoofed by an attacker. In some cases spoofing these attributes is trivial (such as the "User-Agent") header, but in other cases it may be more difficult to modify these attributes.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語訳</span>

これらのさまざまな属性を使用して、デバイスのフィンガープリントを作成できる。このフィンガープリントを、そのアカウントへのログインを試みる任意のブラウザと照合し、一致しない場合にはユーザーに追加認証を求めることができる。多くのユーザーは複数のデバイスやブラウザを使用するため、既存のフィンガープリントと一致しない試行を単純にブロックすることは現実的ではない。しかし、ユーザーまたは顧客がデバイス履歴を確認し、記憶済みデバイスを管理できるプロセスを定義することは一般的である。また、これらの属性は、デバイスが古いバージョンの OS やブラウザを実行しているように見えるなどの異常な活動を検知するためにも使用できる。

[fingerprintjs2](https://github.com/Valve/fingerprintjs2) JavaScript ライブラリは、クライアント側フィンガープリンティングを実行するために使用できる。

この情報はすべてクライアントから提供されるため、攻撃者によって偽装される可能性があることに注意すべきである。場合によっては、`User-Agent` ヘッダーのように、これらの属性の偽装は容易であるが、他の場合には、これらの属性を変更することがより困難な場合がある。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Connection Fingerprinting

Similar to device fingerprinting, there are numerous fingerprinting techniques available for network connections. Some examples include [JA3](https://github.com/salesforce/ja3), HTTP/2 fingerprinting and HTTP header order. As these techniques typically focus on how a connection is made, connection fingerprinting may provide more accurate results than other defenses that rely on an indicator, such as an IP address, or request data, such as user agent string.

Connection fingerprinting may also be used in conjunction with other defenses to ascertain the truthfulness of an authentication request. For example, if the user agent header and device fingerprint indicates a mobile device, but the connection fingerprint indicates a Python script, the request is likely suspect.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語訳</span>

### 接続フィンガープリンティング

デバイスフィンガープリンティングと同様に、ネットワーク接続には多数のフィンガープリンティング技術が利用できる。例として、[JA3](https://github.com/salesforce/ja3)、HTTP/2 フィンガープリンティング、HTTP ヘッダー順序がある。これらの技術は通常、接続がどのように行われるかに注目するため、IP アドレスのような指標や User-Agent 文字列のようなリクエストデータに依存する他の防御策よりも、接続フィンガープリンティングの方が正確な結果を提供する場合がある。

接続フィンガープリンティングは、認証要求の真正性を確認するために、他の防御策と組み合わせて使用することもできる。たとえば、User-Agent ヘッダーとデバイスフィンガープリントがモバイルデバイスを示している一方で、接続フィンガープリントが Python スクリプトを示している場合、そのリクエストは疑わしい可能性が高い。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Require Unpredictable Usernames

Credential stuffing attacks rely on not just the re-use of passwords between multiple sites, but also the re-use of usernames. A significant number of websites use the email address as the username, and as most users will have a single email address they use for all their accounts, this makes the combination of an email address and password very effective for credential stuffing attacks.

Requiring users to create their own username when registering on the website makes it harder for an attacker to obtain valid username and password pairs for credential stuffing, as many of the available credential lists only include email addresses. Providing the user with a generated username can provide a higher degree of protection (as users are likely to choose the same username on most websites), but is user unfriendly. Additionally, care needs to be taken to ensure that the generated username is not predictable (such as being based on the user's full name, or sequential numeric IDs), as this could make enumerating valid usernames for a password spraying attack easier.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語訳</span>

### 予測困難なユーザー名を要求する

クレデンシャルスタッフィング攻撃は、複数のサイト間でパスワードが再利用されることだけでなく、ユーザー名が再利用されることにも依存している。多数のウェブサイトではメールアドレスをユーザー名として使用しており、ほとんどのユーザーはすべてのアカウントで一つのメールアドレスを使用するため、メールアドレスとパスワードの組み合わせはクレデンシャルスタッフィング攻撃に対して非常に効果的になる。

ウェブサイトへの登録時にユーザー自身でユーザー名を作成するよう要求すると、攻撃者がクレデンシャルスタッフィングに有効なユーザー名とパスワードのペアを取得しにくくなる。利用可能な認証情報リストの多くにはメールアドレスしか含まれていないためである。生成されたユーザー名をユーザーに提供すると、より高い保護を提供できる (ユーザーはほとんどのウェブサイトで同じユーザー名を選びがちであるため) が、ユーザーには使いにくい。さらに、生成されたユーザー名が予測可能でないことを確保するよう注意する必要がある。たとえば、ユーザーのフルネームに基づいていたり、連番の数値 ID であったりすると、パスワードスプレー攻撃のために有効なユーザー名を列挙しやすくなる可能性がある。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Multi-Step Login Processes

The majority of off-the-shelf tools are designed for a single step login process, where the credentials are POSTed to the server, and the response indicates whether or not the login attempt was successful. By adding additional steps to this process, such as requiring the username and password to be entered sequentially, or requiring that the user first obtains a random [CSRF Token](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html) before they can login, this makes the attack slightly more difficult to perform, and doubles the number of requests that the attacker must make.

Multi-step login processes, however, should be mindful that they do not faciliate [user enumeration](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html). Enumerating users prior to a credential stuffing attack may result in a harder to identify, lower request volume attack.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語訳</span>

### 多段階ログインプロセス

既製のツールの大半は、認証情報をサーバーに POST し、レスポンスがログイン試行の成功または失敗を示す単一段階のログインプロセス向けに設計されている。このプロセスに追加の段階を加える、たとえばユーザー名とパスワードを順に入力させる、またはログイン前にランダムな [CSRF トークン](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)を取得させることで、攻撃の実行をわずかに難しくし、攻撃者が行う必要のあるリクエスト数を倍増させる。

ただし、多段階ログインプロセスでは、[ユーザー列挙](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)を助長しないよう注意すべきである。クレデンシャルスタッフィング攻撃の前にユーザーを列挙すると、識別がより困難でリクエスト量の少ない攻撃につながる可能性がある。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Require JavaScript and Block Headless Browsers

Most tools used for these types of attacks will make direct POST requests to the server and read the responses, but will not download or execute JavaScript that was contained in them. By requiring the attacker to evaluate JavaScript in the response (for example to generate a valid token that must be submitted with the request), this forces the attacker to either use a real browser with an automation framework like Selenium or Headless Chrome, or to implement JavaScript parsing with another tool such as PhantomJS. Additionally, there are a number of techniques that can be used to identify [Headless Chrome](https://antoinevastel.com/bot%20detection/2018/01/17/detect-chrome-headless-v2.html) or [PhantomJS](https://blog.shapesecurity.com/2015/01/22/detecting-phantomjs-based-visitors/).

Please note that blocking visitors who have JavaScript disabled will reduce the accessibility of the website, especially to visitors who use screen readers. In certain jurisdictions this may be in breach of equalities legislation.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語訳</span>

### JavaScript を要求し、ヘッドレスブラウザをブロックする

これらの種類の攻撃に使用されるほとんどのツールは、サーバーに直接 POST リクエストを行い、レスポンスを読み取るが、その中に含まれる JavaScript をダウンロードまたは実行しない。レスポンス内の JavaScript を評価することを攻撃者に要求する (たとえば、リクエストとともに送信しなければならない有効なトークンを生成するため) と、攻撃者は Selenium や Headless Chrome のような自動化フレームワークを備えた実ブラウザを使用するか、PhantomJS などの別のツールで JavaScript 解析を実装せざるを得なくなる。さらに、[Headless Chrome](https://antoinevastel.com/bot%20detection/2018/01/17/detect-chrome-headless-v2.html) や [PhantomJS](https://blog.shapesecurity.com/2015/01/22/detecting-phantomjs-based-visitors/) を識別するために使用できる技術も多数ある。

JavaScript を無効化している訪問者をブロックすると、ウェブサイトのアクセシビリティが低下することに注意する。特にスクリーンリーダーを使用する訪問者に影響する。一部の法域では、これが平等法制に違反する可能性がある。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Degradation

A more aggressive defense against credential stuffing is to implement measures that increase the amount of time the attack takes to complete. This may include incrementally increasing the complexity of the JavaScript that must be evaluated, requiring users to solve a cryptographic or Proof-of-Work computational puzzle, introducing long wait periods before responding to requests, returning overly large HTML assets or returning randomized error messages.

These techniques provide some level of security without resorting to user tracking or profiling. They typically do not require a human in the loop, but rather constrain the minimum latency and/or the maximum request rate of a particular client implementation and the attacker's budget and sophistication, and requires a context-dependent risk assessment to gauge their efficacy, resistance to countermeasures and user experience impact.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語訳</span>

### 劣化

クレデンシャルスタッフィングに対するより積極的な防御として、攻撃の完了にかかる時間を増やす措置を実装する方法がある。これには、評価しなければならない JavaScript の複雑さを段階的に高めること、ユーザーに暗号学的または Proof-of-Work の計算パズルを解かせること、リクエストへの応答前に長い待機時間を導入すること、過度に大きな HTML アセットを返すこと、ランダム化されたエラーメッセージを返すことが含まれる。

これらの技術は、ユーザー追跡やプロファイリングに頼らずに、一定レベルのセキュリティを提供する。通常、人間の介入を必要とせず、特定のクライアント実装の最小レイテンシまたは最大リクエストレート、および攻撃者の予算と高度さを制約する。ただし、その有効性、対抗策への耐性、ユーザー体験への影響を測るには、文脈に応じたリスク評価が必要である。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Identifying Leaked Passwords

[ASVS v4.0 Password Security Requirements](https://github.com/OWASP/ASVS/blob/master/4.0/en/0x11-V2-Authentication.md#v21-password-security-requirements) provision (2.1.7) on verifying new passwords presence in breached password datasets should be implemented.

There are both commercial and free services that may be of use for validating passwords presence in prior breaches. A well known free service for this is [Pwned Passwords](https://haveibeenpwned.com/Passwords). You can host a copy of the application yourself, or use the [API](https://haveibeenpwned.com/API/v2#PwnedPasswords).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語訳</span>

### 漏えいパスワードの特定

[ASVS v4.0 Password Security Requirements](https://github.com/OWASP/ASVS/blob/master/4.0/en/0x11-V2-Authentication.md#v21-password-security-requirements) の規定 (2.1.7)、すなわち新しいパスワードが侵害されたパスワードデータセットに存在するかを検証する要件を実装すべきである。

過去の侵害にパスワードが存在するかを検証するために役立つ商用サービスと無料サービスの両方がある。この目的でよく知られた無料サービスは [Pwned Passwords](https://haveibeenpwned.com/Passwords) である。アプリケーションのコピーを自分でホストすることも、[API](https://haveibeenpwned.com/API/v2#PwnedPasswords) を使用することもできる。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Notify users about unusual security events

When suspicious or unusual activity is detected, it may be appropriate to notify or warn the user. However, care should be taken that the user does not get overwhelmed with a large number of notifications that are not important to them, or they will just start to ignore or delete them. Additionally, due to frequent reuse of passwords across multiple sites, the possibility that the users email account has also been compromised should be considered.

For example, it would generally not be appropriate to notify a user that there had been an attempt to login to their account with an incorrect password. However, if there had been a login with the correct password, but which had then failed the subsequent MFA check, the user should be notified so that they can change their password. Subsequently, should the user request multiple password resets from different devices or IP addresses, it may be appropriate to prevent further access to the account pending further user verification processes.

Details related to current or recent logins should also be made visible to the user. For example, when they login to the application, the date, time and location of their previous login attempt could be displayed to them. Additionally, if the application supports concurrent sessions, the user should be able to view a list of all active sessions, and to terminate any other sessions that are not legitimate.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語訳</span>

### 異常なセキュリティイベントについてユーザーに通知する

疑わしい活動や通常と異なる活動が検知された場合、ユーザーに通知または警告することが適切な場合がある。ただし、ユーザーにとって重要でない通知が大量に届いて圧倒されないよう注意すべきである。そうなると、ユーザーは通知を無視したり削除したりし始める。また、複数のサイトでパスワードが頻繁に再利用されるため、ユーザーのメールアカウントも侵害されている可能性を考慮すべきである。

たとえば、誤ったパスワードでアカウントへのログイン試行があったことをユーザーに通知することは、一般的には適切ではない。しかし、正しいパスワードでログインされたが、その後の MFA チェックに失敗した場合には、ユーザーがパスワードを変更できるよう通知すべきである。その後、ユーザーが異なるデバイスや IP アドレスから複数回パスワードリセットを要求した場合には、追加のユーザー検証プロセスが完了するまで、そのアカウントへのさらなるアクセスを防止することが適切な場合がある。

現在または最近のログインに関する詳細も、ユーザーが確認できるようにすべきである。たとえば、ユーザーがアプリケーションにログインしたときに、前回のログイン試行の日時と場所を表示できる。さらに、アプリケーションが同時セッションをサポートしている場合、ユーザーはすべてのアクティブセッションのリストを表示し、正当でない他のセッションを終了できるべきである。

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
- Changes: English original retained for comparison. Japanese translation added. Bilingual display generated from official source and local Japanese translation.
- Retrieved: 2026-05-21

</div>
