---
title: User Privacy Protection Cheat Sheet
hide_title: true
---

<div className="docHero" data-category="asvs-v14">
  <h1>ユーザープライバシー保護チートシート</h1>
  <div className="docMeta">
    <span className="docPill">最終更新: 2026-05-21</span>
    <span className="docPill">読了時間: 約 12 分</span>
    <span className="docPill">カテゴリ: データ保護</span>
  </div>
</div>

<div className="tabbedContent">
  <input className="tabInput" type="radio" name="user-privacy-protection-view" id="user-privacy-protection-original" />
  <input className="tabInput" type="radio" name="user-privacy-protection-view" id="user-privacy-protection-translation" defaultChecked />
  <input className="tabInput" type="radio" name="user-privacy-protection-view" id="user-privacy-protection-bilingual" />

  <div className="contentTabs">
    <label htmlFor="user-privacy-protection-original" title="OWASP 原文">原文</label>
    <label htmlFor="user-privacy-protection-translation" title="日本語訳">翻訳</label>
    <label htmlFor="user-privacy-protection-bilingual" title="原文と翻訳を並べて確認">対比表示</label>
  </div>

<section id="user-privacy-protection-original-panel" className="tabPanel originalPanel contentPanel">

## Introduction

This OWASP Cheat Sheet introduces mitigation methods that web developers may utilize in order to protect their users from a vast array of potential threats and aggressions that might try to undermine their privacy and anonymity. This cheat sheet focuses on privacy and anonymity threats that users might face by using online services, especially in contexts such as social networking and communication platforms.

## Guidelines

### Strong Cryptography

Any online platform that handles user identities, private information or communications must be secured with the use of strong cryptography. User communications must be encrypted in transit and storage. User secrets such as passwords must also be protected using strong, collision-resistant hashing algorithms with increasing work factors, in order to greatly mitigate the risks of exposed credentials as well as proper integrity control.

To protect data in transit, developers must use and adhere to TLS/SSL best practices such as verified certificates, adequately protected private keys, usage of strong ciphers only, informative and clear warnings to users, as well as sufficient key lengths. Private data must be encrypted in storage using keys with sufficient lengths and under strict access conditions, both technical and procedural. User credentials must be hashed regardless of whether or not they are encrypted in storage.

For detailed guides about strong cryptography and best practices, read the following OWASP references:

1. [Cryptographic Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html).
2. [Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html).
3. [Transport Layer Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html).
4. [Guide to Cryptography](https://wiki.owasp.org/index.php/Guide_to_Cryptography).
5. [Testing for TLS/SSL](https://owasp.org/www-project-web-security-testing-guide/stable/4-Web_Application_Security_Testing/09-Testing_for_Weak_Cryptography/01-Testing_for_Weak_SSL_TLS_Ciphers_Insufficient_Transport_Layer_Protection.html).

### Support HTTP Strict Transport Security

HTTP Strict Transport Security (HSTS) is an HTTP header set by the server indicating to the user agent that only secure (HTTPS) connections are accepted, prompting the user agent to change all insecure HTTP links to HTTPS, and forcing the compliant user agent to fail-safe by refusing any TLS/SSL connection that is not trusted by the user.

HSTS has average support on popular user agents, such as Mozilla Firefox and Google Chrome. Nevertheless, it remains very useful for users who are in consistent fear of spying and Man in the Middle Attacks.

If it is impractical to force HSTS on all users, web developers should at least give users the choice to enable it if they wish to make use of it.

For more details regarding HSTS, please visit:

1. [HTTP Strict Transport Security in Wikipedia](https://en.wikipedia.org/wiki/HTTP_Strict_Transport_Security).
2. [IETF for HSTS RFC](https://tools.ietf.org/html/rfc6797).
3. [OWASP Appsec Tutorial Series - Episode 4: Strict Transport Security](http://www.youtube.com/watch?v=zEV3HOuM_Vw).

### Digital Certificate Pinning

Certificate Pinning is the practice of hardcoding or storing a predefined set of information (usually hashes) for digital certificates/public keys in the user agent (be it web browser, mobile app or browser plugin) such that only the predefined certificates/public keys are used for secure communication, and all others will fail, even if the user trusted (implicitly or explicitly) the other certificates/public keys.

Some advantages for pinning are:

- In the event of a CA compromise, in which a compromised CA trusted by a user can issue certificates for any domain, allowing evil perpetrators to eavesdrop on users.
- In environments where users are forced to accept a potentially-malicious root CA, such as corporate environments or national PKI schemes.
- In applications where the target demographic may not understand certificate warnings, and is likely to just allow any invalid certificate.

For details regarding certificate pinning, please refer to the following:

1. [OWASP Certificate Pinning Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Pinning_Cheat_Sheet.html).
2. [Public Key Pinning Extension for HTTP RFC](https://tools.ietf.org/html/rfc7469).
3. [Securing the SSL channel against man-in-the-middle attacks: Future technologies - HTTP Strict Transport Security and Pinning of Certs, by Tobias Gondrom](https://owasp.org/www-pdf-archive/OWASP_defending-MITMA_APAC2012.pdf).

### Panic Modes

A panic mode is a mode that threatened users can refer to when they fall under direct threat to disclose account credentials.

Giving users the ability to create a panic mode can help them survive these threats, especially in tumultuous regions around the world. Unfortunately many users around the world are subject to types of threats that most web developers do not know of or take into account.

Examples of panic modes are modes where distressed users can delete their data upon threat, log into fake inboxes/accounts/systems, or invoke triggers to backup/upload/hide sensitive data.

The appropriate panic mode to implement differs depending on the application type. A disk encryption software such as VeraCrypt might implement a panic mode that starts up a fake system partition if the user entered their distressed password.

Email providers might implement a panic mode that hides predefined sensitive emails or contacts, allowing reading innocent email messages only, usually as defined by the user, while preventing the panic mode from overtaking the actual account.

An important note about panic modes is that they must not be easily discoverable, if at all. An adversary inside a victim's panic mode must not have any way, or as few possibilities as possible, of finding out the truth. This means that once inside a panic mode, most non-sensitive normal operations must be allowed to continue (such as sending or receiving email), and that further panic modes must be possible to create from inside the original panic mode (If the adversary tried to create a panic mode on a victim's panic mode and failed, the adversary would know they were already inside a panic mode, and might attempt to hurt the victim).

Another solution would be to prevent panic modes from being generated from the user account, and instead making it a bit harder to spoof by adversaries. For example it could be only created Out Of Band, and adversaries must have no way to know a panic mode already exists for that particular account.

The implementation of a panic mode must always aim to confuse adversaries and prevent them from reaching the actual accounts/sensitive data of the victim, as well as prevent the discovery of any existing panic modes for a particular account.

For more details regarding VeraCrypt's hidden operating system mode, please refer to:

- [VeraCrypt Hidden Operating System](https://www.veracrypt.fr/en/Hidden%20Operating%20System.html).

### Remote Session Invalidation

In case user equipment is lost, stolen or confiscated, or under suspicion of cookie theft; it might be very beneficial for users to able to see view their current online sessions and disconnect/invalidate any suspicious lingering sessions, especially ones that belong to stolen or confiscated devices. Remote session invalidation can also helps if a user suspects that their session details were stolen in a Man-in-the-Middle attack.

For details regarding session management, please refer to:

- [OWASP Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html).

### Allow Connections from Anonymity Networks

Anonymity networks, such as the Tor Project, give users in tumultuous regions around the world a golden chance to escape surveillance, access information or break censorship barriers. More often than not, activists in troubled regions use such networks to report injustice or send uncensored information to the rest of the world, especially mediums such as social networks, media streaming websites and email providers.

Web developers and network administrators must pursue every avenue to enable users to access services from behind such networks, and any policy made against such anonymity networks need to be carefully re-evaluated with respect to impact on people around the world.

If possible, application developers should try to integrate or enable easy coupling of their applications with these anonymity networks, such as supporting SOCKS proxies or integration libraries (e.g. OnionKit for Android).

For more information about anonymity networks, and the user protections they provide, please refer to:

1. [The Tor Project](https://www.torproject.org).
2. [I2P Network](http://www.i2p2.de).
3. [OnionKit: Boost Network Security and Encryption in your Android Apps](https://github.com/guardianproject/OnionKit).

### Prevent IP Address Leakage

Preventing leakage of user IP addresses is of great significance when user protection is in scope. Any application that hosts external third-party content, such as avatars, signatures or photo attachments; must take into account the benefits of allowing users to block third-party content from being loaded in the application page.

If it was possible to embed third-party, external domain images, for example, in a user's feed or timeline; an adversary might use it to discover a victim's real IP address by hosting it on their domain and watch for HTTP requests for that image.

Many web applications need user content to operate, and this is completely acceptable as a business process; however web developers are advised to consider giving users the option of blocking external content as a precaution. This applies mainly to social networks and forums, but can also apply to web-based email, where images can be embedded in HTML-formatted emails.

A similar issue exists in HTML-formatted emails that contain third-party images, however most email clients and providers block loading of third-party content by default; giving users better privacy and anonymity protection.

### Honesty & Transparency

If the web application cannot provide enough legal or political protections to the user, or if the web application cannot prevent misuse or disclosure of sensitive information such as logs, the truth must be told to the users in a clear understandable form, so that users can make an educated choice about whether or not they should use that particular service.

If it doesn't violate the law, inform users if their information is being requested for removal or investigation by external entities.

Honesty goes a long way towards cultivating a culture of trust between a web application and its users, and it allows many users around the world to weigh their options carefully, preventing harm to users in various contrasting regions around the world.

More insight regarding secure logging can be found at:

- [OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)

</section>

<section id="user-privacy-protection-translation-panel" className="tabPanel translationPanel contentPanel">

## Introduction

この OWASP チートシートは、Web 開発者がユーザーのプライバシーと匿名性を損なおうとする多様な潜在的脅威や攻撃からユーザーを保護するために利用できる緩和策を紹介します。このチートシートは、オンラインサービスの利用時にユーザーが直面し得るプライバシーと匿名性への脅威、特にソーシャルネットワーキングやコミュニケーションプラットフォームの文脈に焦点を当てています。

## Guidelines

### Strong Cryptography

ユーザー ID、個人情報、通信を扱うオンラインプラットフォームは、強力な暗号を使用して保護しなければなりません。ユーザーの通信は転送中と保存時の両方で暗号化しなければなりません。パスワードなどのユーザーシークレットも、衝突耐性があり、作業係数を増やせる強力なハッシュアルゴリズムで保護し、認証情報漏えいのリスクを大幅に軽減するとともに、適切な完全性管理を行う必要があります。

転送中のデータを保護するため、開発者は TLS/SSL のベストプラクティスを使用し、遵守しなければなりません。これには、検証済み証明書、適切に保護された秘密鍵、強力な暗号スイートのみの使用、ユーザーへの分かりやすく有益な警告、十分な鍵長が含まれます。個人データは、十分な長さの鍵を使い、技術的および手続き的に厳格なアクセス条件の下で保存時に暗号化しなければなりません。ユーザー認証情報は、保存時に暗号化されているかどうかにかかわらず、ハッシュ化しなければなりません。

強力な暗号とベストプラクティスに関する詳細なガイドは、次の OWASP 参照を読んでください。

1. [Cryptographic Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html).
2. [Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html).
3. [Transport Layer Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html).
4. [Guide to Cryptography](https://wiki.owasp.org/index.php/Guide_to_Cryptography).
5. [Testing for TLS/SSL](https://owasp.org/www-project-web-security-testing-guide/stable/4-Web_Application_Security_Testing/09-Testing_for_Weak_Cryptography/01-Testing_for_Weak_SSL_TLS_Ciphers_Insufficient_Transport_Layer_Protection.html).

### Support HTTP Strict Transport Security

HTTP Strict Transport Security (HSTS) は、サーバーが設定する HTTP ヘッダーであり、安全な接続（HTTPS）のみを受け入れることをユーザーエージェントへ示します。これにより、ユーザーエージェントはすべての安全でない HTTP リンクを HTTPS に変更し、準拠するユーザーエージェントはユーザーが信頼していない TLS/SSL 接続を拒否してフェイルセーフになります。

HSTS は Mozilla Firefox や Google Chrome などの一般的なユーザーエージェントで平均的にサポートされています。それでも、盗聴や中間者攻撃を常に恐れるユーザーにとっては非常に有用です。

すべてのユーザーに HSTS を強制することが現実的でない場合、Web 開発者は少なくとも、利用したいユーザーが HSTS を有効化できる選択肢を提供すべきです。

HSTS の詳細については、次を参照してください。

1. [HTTP Strict Transport Security in Wikipedia](https://en.wikipedia.org/wiki/HTTP_Strict_Transport_Security).
2. [IETF for HSTS RFC](https://tools.ietf.org/html/rfc6797).
3. [OWASP Appsec Tutorial Series - Episode 4: Strict Transport Security](http://www.youtube.com/watch?v=zEV3HOuM_Vw).

### Digital Certificate Pinning

Certificate Pinning は、デジタル証明書または公開鍵に関する事前定義済み情報（通常はハッシュ）をユーザーエージェント（Web ブラウザ、モバイルアプリ、ブラウザプラグインなど）にハードコードまたは保存する実践です。これにより、事前定義済みの証明書または公開鍵だけが安全な通信に使用され、それ以外は、ユーザーが他の証明書または公開鍵を暗黙的または明示的に信頼していても失敗します。

Pinning の利点には次があります。

- CA 侵害時。ユーザーに信頼された侵害済み CA が任意のドメインの証明書を発行でき、悪意ある実行者がユーザーを盗聴できる場合。
- 企業環境や国家 PKI スキームなど、ユーザーが潜在的に悪意あるルート CA を受け入れざるを得ない環境。
- 対象ユーザー層が証明書警告を理解できず、無効な証明書をそのまま許可しがちなアプリケーション。

証明書 Pinning の詳細については、次を参照してください。

1. [OWASP Certificate Pinning Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Pinning_Cheat_Sheet.html).
2. [Public Key Pinning Extension for HTTP RFC](https://tools.ietf.org/html/rfc7469).
3. [Securing the SSL channel against man-in-the-middle attacks: Future technologies - HTTP Strict Transport Security and Pinning of Certs, by Tobias Gondrom](https://owasp.org/www-pdf-archive/OWASP_defending-MITMA_APAC2012.pdf).

### Panic Modes

Panic mode は、脅威下にあるユーザーがアカウント認証情報の開示を直接迫られた場合に利用できるモードです。

ユーザーが panic mode を作成できるようにすると、特に世界中の不安定な地域で、そのような脅威から生き延びる助けになります。残念ながら、世界中の多くのユーザーは、多くの Web 開発者が知らない、または考慮していない種類の脅威にさらされています。

Panic mode の例には、脅迫されたユーザーがデータを削除できるモード、偽の受信箱、アカウント、システムにログインできるモード、機密データをバックアップ、アップロード、非表示にするトリガーを呼び出せるモードなどがあります。

実装すべき適切な panic mode は、アプリケーションの種類によって異なります。VeraCrypt のようなディスク暗号化ソフトウェアでは、ユーザーが脅迫時用パスワードを入力した場合に偽のシステムパーティションを起動する panic mode を実装できます。

メールプロバイダでは、事前定義された機密メールや連絡先を隠し、通常はユーザーが定義した無害なメールメッセージだけを読めるようにしながら、panic mode が実際のアカウントを乗っ取らないようにする panic mode を実装できます。

Panic mode に関する重要な注意点は、可能であればまったく、少なくとも容易には発見できないようにしなければならないことです。被害者の panic mode 内にいる敵対者が真実を見つける手段を持たない、または可能な限り少ない状態にする必要があります。つまり、panic mode 内に入った後も、メールの送受信など、ほとんどの非機密の通常操作は継続できる必要があり、さらに元の panic mode の内部から追加の panic mode を作成できる必要があります。敵対者が被害者の panic mode 上で panic mode を作成しようとして失敗した場合、すでに panic mode 内にいることに気づき、被害者を傷つけようとする可能性があります。

別の解決策として、ユーザーアカウントから panic mode を生成できないようにし、敵対者が偽装しにくくする方法があります。たとえば、アウトオブバンドでのみ作成できるようにし、敵対者がその特定アカウントに panic mode が既に存在することを知る手段を持たないようにできます。

Panic mode の実装では、常に敵対者を混乱させ、被害者の実際のアカウントや機密データへ到達できないようにし、特定アカウントに存在する panic mode の発見も防ぐことを目指さなければなりません。

VeraCrypt の hidden operating system mode の詳細については、次を参照してください。

- [VeraCrypt Hidden Operating System](https://www.veracrypt.fr/en/Hidden%20Operating%20System.html).

### Remote Session Invalidation

ユーザーの機器が紛失、盗難、没収された場合、または Cookie 盗難が疑われる場合、ユーザーが現在のオンラインセッションを表示し、不審な残存セッション、特に盗難または没収されたデバイスに属するセッションを切断または無効化できることは非常に有益です。リモートセッション無効化は、ユーザーが中間者攻撃でセッション詳細を盗まれたと疑う場合にも役立ちます。

セッション管理の詳細については、次を参照してください。

- [OWASP Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html).

### Allow Connections from Anonymity Networks

Tor Project などの匿名化ネットワークは、世界中の不安定な地域のユーザーに、監視から逃れ、情報へアクセスし、検閲の壁を破る貴重な機会を与えます。多くの場合、問題を抱える地域の活動家は、このようなネットワークを使って不正義を報告したり、検閲されていない情報を世界へ送信したりします。これは特に、ソーシャルネットワーク、メディアストリーミング Web サイト、メールプロバイダなどの媒体で重要です。

Web 開発者とネットワーク管理者は、ユーザーがそのようなネットワークの背後からサービスへアクセスできるよう、あらゆる手段を追求しなければなりません。また、そのような匿名化ネットワークに反対するポリシーは、世界中の人々への影響を考慮して慎重に再評価する必要があります。

可能であれば、アプリケーション開発者は、SOCKS プロキシや統合ライブラリ（例: Android 向け OnionKit）をサポートするなど、アプリケーションをこれらの匿名化ネットワークと統合、または容易に連携できるようにすべきです。

匿名化ネットワークと、それらが提供するユーザー保護の詳細については、次を参照してください。

1. [The Tor Project](https://www.torproject.org).
2. [I2P Network](http://www.i2p2.de).
3. [OnionKit: Boost Network Security and Encryption in your Android Apps](https://github.com/guardianproject/OnionKit).

### Prevent IP Address Leakage

ユーザー保護が対象範囲に含まれる場合、ユーザーの IP アドレス漏えいを防ぐことは非常に重要です。アバター、署名、写真添付など、外部のサードパーティコンテンツをホストするアプリケーションは、ユーザーがアプリケーションページ内でサードパーティコンテンツの読み込みをブロックできるようにする利点を考慮しなければなりません。

たとえば、ユーザーのフィードやタイムラインにサードパーティの外部ドメイン画像を埋め込める場合、敵対者はその画像を自分のドメインでホストし、その画像への HTTP リクエストを監視することで、被害者の実 IP アドレスを発見できる可能性があります。

多くの Web アプリケーションは運用上ユーザーコンテンツを必要とし、これはビジネスプロセスとして完全に受け入れられます。しかし Web 開発者は、予防策として外部コンテンツをブロックする選択肢をユーザーに提供することを検討すべきです。これは主にソーシャルネットワークやフォーラムに当てはまりますが、HTML 形式のメールに画像を埋め込める Web メールにも当てはまります。

同様の問題は、サードパーティ画像を含む HTML 形式のメールにも存在します。ただし、ほとんどのメールクライアントとプロバイダは、サードパーティコンテンツの読み込みをデフォルトでブロックし、ユーザーにより良いプライバシーと匿名性の保護を提供しています。

### Honesty & Transparency

Web アプリケーションがユーザーへ十分な法的または政治的保護を提供できない場合、またはログなどの機密情報の悪用や開示を防げない場合は、ユーザーがその特定サービスを使用すべきかどうかについて十分な情報に基づいて選択できるよう、明確で理解しやすい形で真実を伝えなければなりません。

法律に違反しない場合、外部の主体からユーザー情報の削除または調査が要求されている場合は、ユーザーへ知らせます。

誠実さは、Web アプリケーションとユーザーの間に信頼の文化を育てるうえで大きな効果があります。また、世界中の多くのユーザーが自分の選択肢を慎重に評価できるようにし、対照的なさまざまな地域でユーザーへ害が及ぶことを防ぎます。

安全なログ記録に関する詳細な洞察は、次で確認できます。

- [OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)

</section>

<section id="user-privacy-protection-bilingual-panel" className="tabPanel bilingualPanel">

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Introduction

This OWASP Cheat Sheet introduces mitigation methods that web developers may utilize in order to protect their users from a vast array of potential threats and aggressions that might try to undermine their privacy and anonymity. This cheat sheet focuses on privacy and anonymity threats that users might face by using online services, especially in contexts such as social networking and communication platforms.

## Guidelines

### Strong Cryptography

Any online platform that handles user identities, private information or communications must be secured with the use of strong cryptography. User communications must be encrypted in transit and storage. User secrets such as passwords must also be protected using strong, collision-resistant hashing algorithms with increasing work factors, in order to greatly mitigate the risks of exposed credentials as well as proper integrity control.

To protect data in transit, developers must use and adhere to TLS/SSL best practices such as verified certificates, adequately protected private keys, usage of strong ciphers only, informative and clear warnings to users, as well as sufficient key lengths. Private data must be encrypted in storage using keys with sufficient lengths and under strict access conditions, both technical and procedural. User credentials must be hashed regardless of whether or not they are encrypted in storage.

For detailed guides about strong cryptography and best practices, read the following OWASP references:

1. [Cryptographic Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html).
2. [Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html).
3. [Transport Layer Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html).
4. [Guide to Cryptography](https://wiki.owasp.org/index.php/Guide_to_Cryptography).
5. [Testing for TLS/SSL](https://owasp.org/www-project-web-security-testing-guide/stable/4-Web_Application_Security_Testing/09-Testing_for_Weak_Cryptography/01-Testing_for_Weak_SSL_TLS_Ciphers_Insufficient_Transport_Layer_Protection.html).

### Support HTTP Strict Transport Security

HTTP Strict Transport Security (HSTS) is an HTTP header set by the server indicating to the user agent that only secure (HTTPS) connections are accepted, prompting the user agent to change all insecure HTTP links to HTTPS, and forcing the compliant user agent to fail-safe by refusing any TLS/SSL connection that is not trusted by the user.

HSTS has average support on popular user agents, such as Mozilla Firefox and Google Chrome. Nevertheless, it remains very useful for users who are in consistent fear of spying and Man in the Middle Attacks.

If it is impractical to force HSTS on all users, web developers should at least give users the choice to enable it if they wish to make use of it.

For more details regarding HSTS, please visit:

1. [HTTP Strict Transport Security in Wikipedia](https://en.wikipedia.org/wiki/HTTP_Strict_Transport_Security).
2. [IETF for HSTS RFC](https://tools.ietf.org/html/rfc6797).
3. [OWASP Appsec Tutorial Series - Episode 4: Strict Transport Security](http://www.youtube.com/watch?v=zEV3HOuM_Vw).

### Digital Certificate Pinning

Certificate Pinning is the practice of hardcoding or storing a predefined set of information (usually hashes) for digital certificates/public keys in the user agent (be it web browser, mobile app or browser plugin) such that only the predefined certificates/public keys are used for secure communication, and all others will fail, even if the user trusted (implicitly or explicitly) the other certificates/public keys.

Some advantages for pinning are:

- In the event of a CA compromise, in which a compromised CA trusted by a user can issue certificates for any domain, allowing evil perpetrators to eavesdrop on users.
- In environments where users are forced to accept a potentially-malicious root CA, such as corporate environments or national PKI schemes.
- In applications where the target demographic may not understand certificate warnings, and is likely to just allow any invalid certificate.

For details regarding certificate pinning, please refer to the following:

1. [OWASP Certificate Pinning Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Pinning_Cheat_Sheet.html).
2. [Public Key Pinning Extension for HTTP RFC](https://tools.ietf.org/html/rfc7469).
3. [Securing the SSL channel against man-in-the-middle attacks: Future technologies - HTTP Strict Transport Security and Pinning of Certs, by Tobias Gondrom](https://owasp.org/www-pdf-archive/OWASP_defending-MITMA_APAC2012.pdf).

### Panic Modes

A panic mode is a mode that threatened users can refer to when they fall under direct threat to disclose account credentials.

Giving users the ability to create a panic mode can help them survive these threats, especially in tumultuous regions around the world. Unfortunately many users around the world are subject to types of threats that most web developers do not know of or take into account.

Examples of panic modes are modes where distressed users can delete their data upon threat, log into fake inboxes/accounts/systems, or invoke triggers to backup/upload/hide sensitive data.

The appropriate panic mode to implement differs depending on the application type. A disk encryption software such as VeraCrypt might implement a panic mode that starts up a fake system partition if the user entered their distressed password.

Email providers might implement a panic mode that hides predefined sensitive emails or contacts, allowing reading innocent email messages only, usually as defined by the user, while preventing the panic mode from overtaking the actual account.

An important note about panic modes is that they must not be easily discoverable, if at all. An adversary inside a victim's panic mode must not have any way, or as few possibilities as possible, of finding out the truth. This means that once inside a panic mode, most non-sensitive normal operations must be allowed to continue (such as sending or receiving email), and that further panic modes must be possible to create from inside the original panic mode (If the adversary tried to create a panic mode on a victim's panic mode and failed, the adversary would know they were already inside a panic mode, and might attempt to hurt the victim).

Another solution would be to prevent panic modes from being generated from the user account, and instead making it a bit harder to spoof by adversaries. For example it could be only created Out Of Band, and adversaries must have no way to know a panic mode already exists for that particular account.

The implementation of a panic mode must always aim to confuse adversaries and prevent them from reaching the actual accounts/sensitive data of the victim, as well as prevent the discovery of any existing panic modes for a particular account.

For more details regarding VeraCrypt's hidden operating system mode, please refer to:

- [VeraCrypt Hidden Operating System](https://www.veracrypt.fr/en/Hidden%20Operating%20System.html).

### Remote Session Invalidation

In case user equipment is lost, stolen or confiscated, or under suspicion of cookie theft; it might be very beneficial for users to able to see view their current online sessions and disconnect/invalidate any suspicious lingering sessions, especially ones that belong to stolen or confiscated devices. Remote session invalidation can also helps if a user suspects that their session details were stolen in a Man-in-the-Middle attack.

For details regarding session management, please refer to:

- [OWASP Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html).

### Allow Connections from Anonymity Networks

Anonymity networks, such as the Tor Project, give users in tumultuous regions around the world a golden chance to escape surveillance, access information or break censorship barriers. More often than not, activists in troubled regions use such networks to report injustice or send uncensored information to the rest of the world, especially mediums such as social networks, media streaming websites and email providers.

Web developers and network administrators must pursue every avenue to enable users to access services from behind such networks, and any policy made against such anonymity networks need to be carefully re-evaluated with respect to impact on people around the world.

If possible, application developers should try to integrate or enable easy coupling of their applications with these anonymity networks, such as supporting SOCKS proxies or integration libraries (e.g. OnionKit for Android).

For more information about anonymity networks, and the user protections they provide, please refer to:

1. [The Tor Project](https://www.torproject.org).
2. [I2P Network](http://www.i2p2.de).
3. [OnionKit: Boost Network Security and Encryption in your Android Apps](https://github.com/guardianproject/OnionKit).

### Prevent IP Address Leakage

Preventing leakage of user IP addresses is of great significance when user protection is in scope. Any application that hosts external third-party content, such as avatars, signatures or photo attachments; must take into account the benefits of allowing users to block third-party content from being loaded in the application page.

If it was possible to embed third-party, external domain images, for example, in a user's feed or timeline; an adversary might use it to discover a victim's real IP address by hosting it on their domain and watch for HTTP requests for that image.

Many web applications need user content to operate, and this is completely acceptable as a business process; however web developers are advised to consider giving users the option of blocking external content as a precaution. This applies mainly to social networks and forums, but can also apply to web-based email, where images can be embedded in HTML-formatted emails.

A similar issue exists in HTML-formatted emails that contain third-party images, however most email clients and providers block loading of third-party content by default; giving users better privacy and anonymity protection.

### Honesty & Transparency

If the web application cannot provide enough legal or political protections to the user, or if the web application cannot prevent misuse or disclosure of sensitive information such as logs, the truth must be told to the users in a clear understandable form, so that users can make an educated choice about whether or not they should use that particular service.

If it doesn't violate the law, inform users if their information is being requested for removal or investigation by external entities.

Honesty goes a long way towards cultivating a culture of trust between a web application and its users, and it allows many users around the world to weigh their options carefully, preventing harm to users in various contrasting regions around the world.

More insight regarding secure logging can be found at:

- [OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## Introduction

この OWASP チートシートは、Web 開発者がユーザーのプライバシーと匿名性を損なおうとする多様な潜在的脅威や攻撃からユーザーを保護するために利用できる緩和策を紹介します。このチートシートは、オンラインサービスの利用時にユーザーが直面し得るプライバシーと匿名性への脅威、特にソーシャルネットワーキングやコミュニケーションプラットフォームの文脈に焦点を当てています。

## Guidelines

### Strong Cryptography

ユーザー ID、個人情報、通信を扱うオンラインプラットフォームは、強力な暗号を使用して保護しなければなりません。ユーザーの通信は転送中と保存時の両方で暗号化しなければなりません。パスワードなどのユーザーシークレットも、衝突耐性があり、作業係数を増やせる強力なハッシュアルゴリズムで保護し、認証情報漏えいのリスクを大幅に軽減するとともに、適切な完全性管理を行う必要があります。

転送中のデータを保護するため、開発者は TLS/SSL のベストプラクティスを使用し、遵守しなければなりません。これには、検証済み証明書、適切に保護された秘密鍵、強力な暗号スイートのみの使用、ユーザーへの分かりやすく有益な警告、十分な鍵長が含まれます。個人データは、十分な長さの鍵を使い、技術的および手続き的に厳格なアクセス条件の下で保存時に暗号化しなければなりません。ユーザー認証情報は、保存時に暗号化されているかどうかにかかわらず、ハッシュ化しなければなりません。

強力な暗号とベストプラクティスに関する詳細なガイドは、次の OWASP 参照を読んでください。

1. [Cryptographic Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html).
2. [Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html).
3. [Transport Layer Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html).
4. [Guide to Cryptography](https://wiki.owasp.org/index.php/Guide_to_Cryptography).
5. [Testing for TLS/SSL](https://owasp.org/www-project-web-security-testing-guide/stable/4-Web_Application_Security_Testing/09-Testing_for_Weak_Cryptography/01-Testing_for_Weak_SSL_TLS_Ciphers_Insufficient_Transport_Layer_Protection.html).

### Support HTTP Strict Transport Security

HTTP Strict Transport Security (HSTS) は、サーバーが設定する HTTP ヘッダーであり、安全な接続（HTTPS）のみを受け入れることをユーザーエージェントへ示します。これにより、ユーザーエージェントはすべての安全でない HTTP リンクを HTTPS に変更し、準拠するユーザーエージェントはユーザーが信頼していない TLS/SSL 接続を拒否してフェイルセーフになります。

HSTS は Mozilla Firefox や Google Chrome などの一般的なユーザーエージェントで平均的にサポートされています。それでも、盗聴や中間者攻撃を常に恐れるユーザーにとっては非常に有用です。

すべてのユーザーに HSTS を強制することが現実的でない場合、Web 開発者は少なくとも、利用したいユーザーが HSTS を有効化できる選択肢を提供すべきです。

HSTS の詳細については、次を参照してください。

1. [HTTP Strict Transport Security in Wikipedia](https://en.wikipedia.org/wiki/HTTP_Strict_Transport_Security).
2. [IETF for HSTS RFC](https://tools.ietf.org/html/rfc6797).
3. [OWASP Appsec Tutorial Series - Episode 4: Strict Transport Security](http://www.youtube.com/watch?v=zEV3HOuM_Vw).

### Digital Certificate Pinning

Certificate Pinning は、デジタル証明書または公開鍵に関する事前定義済み情報（通常はハッシュ）をユーザーエージェント（Web ブラウザ、モバイルアプリ、ブラウザプラグインなど）にハードコードまたは保存する実践です。これにより、事前定義済みの証明書または公開鍵だけが安全な通信に使用され、それ以外は、ユーザーが他の証明書または公開鍵を暗黙的または明示的に信頼していても失敗します。

Pinning の利点には次があります。

- CA 侵害時。ユーザーに信頼された侵害済み CA が任意のドメインの証明書を発行でき、悪意ある実行者がユーザーを盗聴できる場合。
- 企業環境や国家 PKI スキームなど、ユーザーが潜在的に悪意あるルート CA を受け入れざるを得ない環境。
- 対象ユーザー層が証明書警告を理解できず、無効な証明書をそのまま許可しがちなアプリケーション。

証明書 Pinning の詳細については、次を参照してください。

1. [OWASP Certificate Pinning Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Pinning_Cheat_Sheet.html).
2. [Public Key Pinning Extension for HTTP RFC](https://tools.ietf.org/html/rfc7469).
3. [Securing the SSL channel against man-in-the-middle attacks: Future technologies - HTTP Strict Transport Security and Pinning of Certs, by Tobias Gondrom](https://owasp.org/www-pdf-archive/OWASP_defending-MITMA_APAC2012.pdf).

### Panic Modes

Panic mode は、脅威下にあるユーザーがアカウント認証情報の開示を直接迫られた場合に利用できるモードです。

ユーザーが panic mode を作成できるようにすると、特に世界中の不安定な地域で、そのような脅威から生き延びる助けになります。残念ながら、世界中の多くのユーザーは、多くの Web 開発者が知らない、または考慮していない種類の脅威にさらされています。

Panic mode の例には、脅迫されたユーザーがデータを削除できるモード、偽の受信箱、アカウント、システムにログインできるモード、機密データをバックアップ、アップロード、非表示にするトリガーを呼び出せるモードなどがあります。

実装すべき適切な panic mode は、アプリケーションの種類によって異なります。VeraCrypt のようなディスク暗号化ソフトウェアでは、ユーザーが脅迫時用パスワードを入力した場合に偽のシステムパーティションを起動する panic mode を実装できます。

メールプロバイダでは、事前定義された機密メールや連絡先を隠し、通常はユーザーが定義した無害なメールメッセージだけを読めるようにしながら、panic mode が実際のアカウントを乗っ取らないようにする panic mode を実装できます。

Panic mode に関する重要な注意点は、可能であればまったく、少なくとも容易には発見できないようにしなければならないことです。被害者の panic mode 内にいる敵対者が真実を見つける手段を持たない、または可能な限り少ない状態にする必要があります。つまり、panic mode 内に入った後も、メールの送受信など、ほとんどの非機密の通常操作は継続できる必要があり、さらに元の panic mode の内部から追加の panic mode を作成できる必要があります。敵対者が被害者の panic mode 上で panic mode を作成しようとして失敗した場合、すでに panic mode 内にいることに気づき、被害者を傷つけようとする可能性があります。

別の解決策として、ユーザーアカウントから panic mode を生成できないようにし、敵対者が偽装しにくくする方法があります。たとえば、アウトオブバンドでのみ作成できるようにし、敵対者がその特定アカウントに panic mode が既に存在することを知る手段を持たないようにできます。

Panic mode の実装では、常に敵対者を混乱させ、被害者の実際のアカウントや機密データへ到達できないようにし、特定アカウントに存在する panic mode の発見も防ぐことを目指さなければなりません。

VeraCrypt の hidden operating system mode の詳細については、次を参照してください。

- [VeraCrypt Hidden Operating System](https://www.veracrypt.fr/en/Hidden%20Operating%20System.html).

### Remote Session Invalidation

ユーザーの機器が紛失、盗難、没収された場合、または Cookie 盗難が疑われる場合、ユーザーが現在のオンラインセッションを表示し、不審な残存セッション、特に盗難または没収されたデバイスに属するセッションを切断または無効化できることは非常に有益です。リモートセッション無効化は、ユーザーが中間者攻撃でセッション詳細を盗まれたと疑う場合にも役立ちます。

セッション管理の詳細については、次を参照してください。

- [OWASP Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html).

### Allow Connections from Anonymity Networks

Tor Project などの匿名化ネットワークは、世界中の不安定な地域のユーザーに、監視から逃れ、情報へアクセスし、検閲の壁を破る貴重な機会を与えます。多くの場合、問題を抱える地域の活動家は、このようなネットワークを使って不正義を報告したり、検閲されていない情報を世界へ送信したりします。これは特に、ソーシャルネットワーク、メディアストリーミング Web サイト、メールプロバイダなどの媒体で重要です。

Web 開発者とネットワーク管理者は、ユーザーがそのようなネットワークの背後からサービスへアクセスできるよう、あらゆる手段を追求しなければなりません。また、そのような匿名化ネットワークに反対するポリシーは、世界中の人々への影響を考慮して慎重に再評価する必要があります。

可能であれば、アプリケーション開発者は、SOCKS プロキシや統合ライブラリ（例: Android 向け OnionKit）をサポートするなど、アプリケーションをこれらの匿名化ネットワークと統合、または容易に連携できるようにすべきです。

匿名化ネットワークと、それらが提供するユーザー保護の詳細については、次を参照してください。

1. [The Tor Project](https://www.torproject.org).
2. [I2P Network](http://www.i2p2.de).
3. [OnionKit: Boost Network Security and Encryption in your Android Apps](https://github.com/guardianproject/OnionKit).

### Prevent IP Address Leakage

ユーザー保護が対象範囲に含まれる場合、ユーザーの IP アドレス漏えいを防ぐことは非常に重要です。アバター、署名、写真添付など、外部のサードパーティコンテンツをホストするアプリケーションは、ユーザーがアプリケーションページ内でサードパーティコンテンツの読み込みをブロックできるようにする利点を考慮しなければなりません。

たとえば、ユーザーのフィードやタイムラインにサードパーティの外部ドメイン画像を埋め込める場合、敵対者はその画像を自分のドメインでホストし、その画像への HTTP リクエストを監視することで、被害者の実 IP アドレスを発見できる可能性があります。

多くの Web アプリケーションは運用上ユーザーコンテンツを必要とし、これはビジネスプロセスとして完全に受け入れられます。しかし Web 開発者は、予防策として外部コンテンツをブロックする選択肢をユーザーに提供することを検討すべきです。これは主にソーシャルネットワークやフォーラムに当てはまりますが、HTML 形式のメールに画像を埋め込める Web メールにも当てはまります。

同様の問題は、サードパーティ画像を含む HTML 形式のメールにも存在します。ただし、ほとんどのメールクライアントとプロバイダは、サードパーティコンテンツの読み込みをデフォルトでブロックし、ユーザーにより良いプライバシーと匿名性の保護を提供しています。

### Honesty & Transparency

Web アプリケーションがユーザーへ十分な法的または政治的保護を提供できない場合、またはログなどの機密情報の悪用や開示を防げない場合は、ユーザーがその特定サービスを使用すべきかどうかについて十分な情報に基づいて選択できるよう、明確で理解しやすい形で真実を伝えなければなりません。

法律に違反しない場合、外部の主体からユーザー情報の削除または調査が要求されている場合は、ユーザーへ知らせます。

誠実さは、Web アプリケーションとユーザーの間に信頼の文化を育てるうえで大きな効果があります。また、世界中の多くのユーザーが自分の選択肢を慎重に評価できるようにし、対照的なさまざまな地域でユーザーへ害が及ぶことを防ぎます。

安全なログ記録に関する詳細な洞察は、次で確認できます。

- [OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)

</div>
</div>

</section>
</div>

## Attribution

<div className="attributionFooter">

- Original: User Privacy Protection Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/User_Privacy_Protection_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: English original retained for comparison. Japanese translation added. Bilingual display generated from official source and local Japanese translation.
- Retrieved: 2026-05-21

</div>
