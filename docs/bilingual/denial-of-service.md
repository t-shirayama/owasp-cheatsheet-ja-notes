---
title: Denial of Service Cheat Sheet
hide_title: true
---

<div className="docHero" data-category="asvs-v2">
  <h1>サービス拒否チートシート</h1>
  <div className="docMeta">
    <span className="docPill">最終更新: 2026-05-21</span>
    <span className="docPill">読了時間: 約 10 分</span>
    <span className="docPill">カテゴリ: 検証とビジネスロジック</span>
  </div>
</div>

<p className="docLead">Denial of Service Cheat Sheet を、原文・翻訳・対比表示で確認できます。ASVS Index 対応の文脈で、公式原文と日本語訳を確認しやすく整理しています。</p>

<div className="tabbedContent">
  <input className="tabInput" type="radio" name="denial-of-service-view" id="denial-of-service-original" />
  <input className="tabInput" type="radio" name="denial-of-service-view" id="denial-of-service-translation" defaultChecked />
  <input className="tabInput" type="radio" name="denial-of-service-view" id="denial-of-service-bilingual" />

  <div className="contentTabs">
    <label htmlFor="denial-of-service-original" title="OWASP 原文">原文</label>
    <label htmlFor="denial-of-service-translation" title="日本語訳">翻訳</label>
    <label htmlFor="denial-of-service-bilingual" title="原文と翻訳を並べて確認">対比表示</label>
  </div>

<section id="denial-of-service-original-panel" className="tabPanel originalPanel contentPanel">

## Introduction

This cheat sheet describes a methodology for handling denial of service (DoS) attacks on different layers. It also serves as a platform for further discussion and analysis, since there are many different ways to perform DoS attacks.

### Fundamentals

Because anti-DoS methods cannot be one-step solutions, your developers and application/infrastructure architects must develop DoS solutions carefully. They must keep in mind that "availability" is a basic part of the [CIA triad](https://whatis.techtarget.com/definition/Confidentiality-integrity-and-availability-CIA).

Remember that if every part of the computing system within the interoperability flow does not function correctly, your infrastructure suffers. A successful DoS attack hinders the availability of instances or objects to a system and can eventually render the entire system inaccessible.

**To ensure systems can be resilient and resist a DoS attack, we strongly suggest a thorough analysis on components within your inventory based on functionality, architecture and performance (i.e. application-wise, infrastructure and network related).**

![DDOSFlow](https://cheatsheetseries.owasp.org/assets/Denial_of_Service_Cheat_Sheet_FlowDDOS.png)

This DoS system inventory should look for potential places where DoS attacks can cause problems and highlight any single points of system failures, which can range from programming related errors to resource exhaustion. It should give you a clear picture of what issues are at stake (e.g. bottlenecks, etc.). **To resolve problems, a solid understanding of your environment is essential to develop suitable defence mechanisms**. These could be aligned with:

1. Scaling options (**up** = inner hardware components, **out** = the number of complete components).
2. Existing conceptual / logical techniques (such as applying redundancy measurements, bulk-heading, etc. - which expands your in-house capabilities).
3. A cost analysis applied to your situation.

This document adopts a specific guidance structure from CERT-EU to analyze this subject, which you may need to change depending on your situation. It is not a complete approach but it will help you create fundamental blocks which should be utilized to assist you in constructing anti-DoS concepts fitting your needs.

### Analyzing DoS attack surfaces

In this cheat sheet, we will use the DDOS classification as documented by CERT-EU to examine DoS system vulnerabilities. It uses the seven OSI model and focuses three main attack surfaces, namely Application, Session and Network.

#### 1) Overview of potential DoS weaknesses

It is important to understand that each of these three attack categories needs to be considered when designing a DoS-resilient solution:

**Application attacks** focus on rendering applications unavailable by exhausting resources or by making it unusable in a functional way.

**Session (or protocol) attacks** focus on consuming server resources, or resources of intermediary equipment like firewalls and load-balancers.

**Network (or volumetric) attacks** focus on saturating the bandwidth of the network resource.

Note that OSI model layers 1 and 2 are not included in this categorization, so we will now discuss these layers and how DoS applies to them.

The **physical layer** consists of the networking hardware transmission technologies of a network. It is a fundamental layer underlying the logical data structures of the higher-level functions in a network. Typical DoS scenarios that involve the physical layer involve system destruction, obstruction, and malfunction. For example, a Georgian elderly woman sliced through an underground cable, resulting in the loss of internet for the whole of Armenia.

The **data layer** is the protocol layer that transfers data between adjacent network nodes in a wide area network (WAN) or between nodes on the same local area network (LAN) segment. Typical DoS scenarios are MAC flooding (targeting switch MAC tables) and ARP poisoning.

In **MAC flooding attacks**, a switch is flooded with packets that all have different source MAC addresses. The goal of this attack is to consume the limited memory used by a switch to store the MAC and physical port translation table (MAC table), which causes valid MAC addresses to be purged and forces the switch to enter a fail-over mode where it becomes a network hub. If this occurs, all data is forwarded to all ports, resulting in a data leakage.

[Future additions to sheet: The impact in relation to DoS and document compact remediation]

In **ARP poisoning attacks**, a malicious actor sends spoofed ARP (Address Resolution Protocol) messages over the wire. If the attacker's MAC address becomes linked to the IP address of a legitimate device on the network, the attacker can intercept, modify or stop data that was intended for the victim IP address. The ARP protocol is specific to the local area network and could cause a DoS on the wire communication.

Packet filtering technology can be used to inspect packets in transit to identify and block offending ARP packets. Another approach is to use static ARP tables but they prove difficult to be maintained.

## Application attacks

**Application layer attacks usually make applications unavailable by exhausting system resources or by making it unusable in a functional way.** These attacks do not have to consume the network bandwidth to be effective. Rather they place an operational strain on the application server in such a way that the server becomes unavailable, unusable or non-functional. All attacks exploiting weaknesses on OSI layer 7 protocol stack are generally categorised as application attacks. They are the most challenging to identify/mitigate.

[Future additions to sheet: List all attacks per category. Because we cannot map remediations one on one with an attack vector, we will first need to list them before discussing the action points.]

**Slow HTTP attacks deliver HTTP requests very slow and fragmented, one at a time. Until the HTTP request was fully delivered, the server will keep resources stalled while waiting for the missing incoming data.** At one moment, the server will reach the maximum concurrent connection pool, resulting in a DoS. From an attacker's perspective, slow HTTP attacks are cheap to perform because they require minimal resources.

### Software Design Concepts

- **Using validation that is cheap in resources first**: We want to reduce impact on these resources as soon as possible. More (CPU, memory and bandwidth) expensive validation should be performed afterward.
- **Employing graceful degradation**: This is a core concept to follow during application design phase, in order to limit impact of DoS. You need to continue some level of functionality when portions of a system or application break. One of the main problems with DoS is that it causes sudden and abrupt application terminations throughout the system. A fault tolerant design enables a system or application to continue its intended operation, possibly at a reduced level, rather than failing completely if parts of the system fails.
- **Prevent single point of failure**: Detecting and preventing single points of failure (SPOF) is key to resisting DoS attacks. Most DoS attacks assume that a system has SPOFs that will fail due to overwhelmed systems. We suggest that you employ stateless components, use redundant systems, create bulkheads to stop failures from spreading across the infrastructure, and make sure that systems can survive when external services fail. [Prevention](https://www.baeldung.com/cs/distributed-systems-prevent-single-point-failure)
- **Avoid highly CPU consuming operations**: When a DoS attack occurs, operations that tend to use a lot of CPU resources can become serious drags on system performance and can become a point of failure. We strongly suggest that you review performance issues with your code, including problems that are inherent in the languages that you are using. See [Java](https://www.theserverside.com/answer/How-to-fix-high-Java-CPU-usage-problems) [JVM-IBM](https://www.ibm.com/docs/en/baw/23.x?topic=issues-best-practices-high-jvm-cpu-utilization) and [Microsoft-IIS](https://learn.microsoft.com/en-us/troubleshoot/developer/webapps/iis/health-diagnostic-performance/troubleshoot-high-cpu-in-iis-app-pool)
- **Handle exceptions**: When a DoS attack occurs, it is likely that applications will throw exceptions and it is vital that your systems can handle them gracefully. Again, a DoS attack assumes that an overwhelmed system will not be able to throw exceptions in a way that the system can continue operating. We suggest that you go through your code and make sure that exceptions are handled properly. See [Large-Scale-Systems](https://raygun.com/blog/errors-and-exceptions/) [Java](https://www.theserverside.com/blog/Coffee-Talk-Java-News-Stories-and-Opinions/Java-Exception-handling-best-practices) and [Java](https://www.digitalocean.com/community/tutorials/exception-handling-in-java)
- **Protect overflow and underflow** Since buffer overflow and underflow often lead to vulnerabilities, learning how to prevent them is key. [OWASP](https://owasp.org/www-community/vulnerabilities/Buffer_Overflow) [Overflow-Underflow-C](https://developer.apple.com/library/archive/documentation/Security/Conceptual/SecureCodingGuide/Articles/BufferOverflows.html) [Overflow](https://www.freecodecamp.org/news/buffer-overflow-attacks/)
- **Threading**: Avoid operations which must wait for completion of large tasks to proceed. Asynchronous operations are useful in these situations.
- Identify resource intensive pages and plan ahead.

### Session

- **Limit server side session time based on inactivity and a final timeout**: (resource exhaustion) While sessions timeout is most of the time discussed in relation to session security and preventing session hijacking, it is also an important measure to prevent resource exhaustion.
- **Limit session bound information storage**: The less data is linked to a session, the less burden a user session has on the webserver's performance.

### Input validation

- **Limit file upload size and extensions**: This tactic prevents DoS on file space storage or other web application functions which will use the upload as input (e.g. image resizing, PDF creation, etc. (resource exhaustion) - [Checklist](https://owasp.org/www-community/vulnerabilities/Unrestricted_File_Upload).
- **Limit total request size**: To make it harder for resource-consuming DoS attacks to succeed. (resource exhaustion)
- **Prevent input based resource allocation**: Again, to make it harder for resource-consuming DoS attacks to succeed. (resource exhaustion)
- **Prevent input based function and threading interaction**: User input can influence how many times a function needs to be executed, or how intensive the CPU consumption becomes. Depending on (unfiltered) user input for resource allocation could allow a DoS scenario through resource exhaustion. (resource exhaustion)
- **Input based puzzles** like captchas or simple math problems are often used to 'protect' a web form. The classic example is a webform that will send out an email after posting the request. A captcha could then prevent the mailbox from getting flooded by a malicious attacker or spambot. **Puzzles serve a purpose against functionality abuse but this kind of technology will not help defend against DoS attacks.**

### Access control

- **Authentication as a means to expose functionality**: The principle of least privilege can play a key role in preventing DoS attacks by denying attackers the ability to access potentially damaging functions with DoS techniques.
- **User lockout** is a scenario where an attacker can take advantage of the application security mechanisms to cause DoS by abusing the login failure.

## Network attacks

For more information on network attacks, see:

[Juniper](https://www.juniper.net/documentation/us/en/software/junos/denial-of-service/topics/topic-map/security-network-dos-attack.html)
[eSecurityPlanet](https://www.esecurityplanet.com/networks/types-of-ddos-attacks/)

[Future additions to cheat sheet: Discuss attacks where network bandwidth gets saturation. Volumetric in nature. Amplification techniques make these attacks effective. List attacks: NTP amplification, DNS amplification, UDP flooding, TCP flooding]

### Network Design Concepts

- **Preventing single point of failure**: See above.
- **Caching**: The concept that data is stored so future requests for that data can be served faster. The more data is served via caching, to more resilient the application becomes to bandwidth exhaustion.
- **Static resources hosting on a different domain** will reduce the number of http requests on the web application. Images and JavaScript are typical files that are loaded from a different domain.

### Rate limiting

Rate limiting is the process of controlling traffic rate from and to a server or component. It can be implemented on infrastructure as well as on an application level. Rate limiting can be based on (offending) IPs, on IP block lists, on geolocation, etc.

- **Define a minimum ingress data rate limit** and drop all connections below that rate. Note that if the rate limit is set too low, this could impact clients. Inspect the logs to establish a baseline of genuine traffic rate. (Protection against slow HTTP attacks)
- **Define an absolute connection timeout**
- **Define a maximum ingress data rate limit** then drop all connections above that rate.
- **Define a total bandwidth size limit** to prevent bandwidth exhaustion
- **Define a load limit**, which specifies the number of users allowed to access any given resource at any given time.

### ISP-Level remediations

- **Filter invalid sender addresses using edge routers**, in accordance with RFC 2267, to filter out IP-spoofing attacks done with the goal of bypassing block lists.
- **Check your ISP services in terms of DDOS beforehand** (support for multiple internet access points, enough bandwidth (xx-xxx Gbit/s) and special hardware for traffic analysis and defence on application level

### Global-Level remediations: Commercial cloud filter services

- Consider using a filter service in order to resist larger attacks (up to 500GBit/s)
- **Filter services** support different mechanics to filter out malicious or non compliant traffic
- **Comply with relevant data protection/privacy laws** - a lot of providers route traffic through USA/UK

## Related Articles

- [CERT-EU Publication](http://cert.europa.eu/static/WhitePapers/CERT-EU-SWP_14_09_DDoS_final.pdf)

</section>

<section id="denial-of-service-translation-panel" className="tabPanel translationPanel contentPanel">

## はじめに

このチートシートでは、さまざまな層におけるサービス拒否 (DoS) 攻撃への対処方法を説明します。また、DoS 攻撃を実行する方法は数多く存在するため、さらなる議論と分析の土台としても機能します。

### 基本事項

DoS 対策は一段階で完了する解決策にはなり得ないため、開発者とアプリケーション/インフラストラクチャアーキテクトは DoS 対策を慎重に設計する必要があります。「可用性」は [CIA triad](https://whatis.techtarget.com/definition/Confidentiality-integrity-and-availability-CIA) の基本要素であることを念頭に置く必要があります。

相互運用の流れに含まれるコンピューティングシステムの各部分が正しく機能しなければ、インフラストラクチャに影響が及ぶことを忘れないでください。DoS 攻撃が成功すると、システムに対するインスタンスやオブジェクトの可用性が妨げられ、最終的にシステム全体がアクセス不能になる可能性があります。

**システムが DoS 攻撃に対して回復力を持ち、抵抗できるようにするため、機能、アーキテクチャ、性能に基づいて、インベントリ内のコンポーネントを徹底的に分析することを強く推奨します (アプリケーション、インフラストラクチャ、ネットワークに関する観点)。**

![DDOSFlow](https://cheatsheetseries.owasp.org/assets/Denial_of_Service_Cheat_Sheet_FlowDDOS.png)

この DoS システムインベントリでは、DoS 攻撃が問題を引き起こす可能性のある箇所を探し、プログラミング関連のエラーからリソース枯渇まで、システム障害の単一障害点を明らかにする必要があります。これにより、どのような問題が重要であるか (ボトルネックなど) を明確に把握できます。**問題を解決するには、適切な防御メカニズムを開発するために、自身の環境を確実に理解することが不可欠です**。これらは次のものと整合させることができます。

1. スケーリングの選択肢 (**up** = 内部ハードウェアコンポーネント、**out** = 完全なコンポーネントの数)。
2. 既存の概念的/論理的技法 (冗長化手段、バルクヘッドなどの適用。これは組織内の能力を拡張します)。
3. 自身の状況に適用したコスト分析。

この文書では、この主題を分析するために CERT-EU の特定のガイダンス構造を採用していますが、状況に応じて変更が必要になる場合があります。これは完全なアプローチではありませんが、ニーズに合った DoS 対策の概念を構築する際に活用すべき基本ブロックを作る助けになります。

### DoS 攻撃面の分析

このチートシートでは、CERT-EU が文書化した DDoS 分類を使用して DoS システムの脆弱性を検討します。この分類は 7 層の OSI モデルを使用し、Application、Session、Network という三つの主要な攻撃面に焦点を当てます。

#### 1) 潜在的な DoS 弱点の概要

DoS に強いソリューションを設計する際には、これら三つの攻撃カテゴリそれぞれを考慮する必要があることを理解することが重要です。

**Application attacks** は、リソースを枯渇させる、または機能面で使用不能にすることにより、アプリケーションを利用不能にすることを目的とします。

**Session (or protocol) attacks** は、サーバーリソース、またはファイアウォールやロードバランサなどの中間機器のリソースを消費することを目的とします。

**Network (or volumetric) attacks** は、ネットワークリソースの帯域幅を飽和させることを目的とします。

OSI モデルの第 1 層と第 2 層はこの分類に含まれていないため、ここではこれらの層と DoS との関係について説明します。

**物理層** は、ネットワークのハードウェア伝送技術で構成されます。これは、ネットワークにおける上位機能の論理データ構造を支える基本的な層です。物理層に関係する典型的な DoS シナリオには、システム破壊、妨害、誤動作があります。たとえば、ジョージアの高齢女性が地下ケーブルを切断し、アルメニア全土でインターネットが失われた事例があります。

**データ層** は、広域ネットワーク (WAN) 内の隣接ネットワークノード間、または同じローカルエリアネットワーク (LAN) セグメント上のノード間でデータを転送するプロトコル層です。典型的な DoS シナリオには、MAC フラッディング (スイッチの MAC テーブルを標的とする) と ARP ポイズニングがあります。

**MAC フラッディング攻撃** では、すべて異なる送信元 MAC アドレスを持つパケットでスイッチをあふれさせます。この攻撃の目的は、MAC と物理ポートの変換テーブル (MAC テーブル) を保存するためにスイッチが使用する限られたメモリを消費することです。これにより有効な MAC アドレスが削除され、スイッチはネットワークハブのように動作するフェイルオーバーモードに移行します。これが発生すると、すべてのデータがすべてのポートへ転送され、データ漏えいにつながります。

[今後のシート追加予定: DoS との関係における影響と、簡潔な対策文書]

**ARP ポイズニング攻撃** では、悪意のある行為者が偽装した ARP (Address Resolution Protocol) メッセージをネットワーク上に送信します。攻撃者の MAC アドレスがネットワーク上の正当なデバイスの IP アドレスと関連付けられると、攻撃者は被害者 IP アドレス宛てのデータを傍受、変更、または停止できます。ARP プロトコルはローカルエリアネットワーク固有であり、有線通信に DoS を引き起こす可能性があります。

パケットフィルタリング技術を使用すると、通過中のパケットを検査し、不正な ARP パケットを識別してブロックできます。別の方法として静的 ARP テーブルの使用がありますが、維持が困難であることが分かっています。

## アプリケーション攻撃

**アプリケーション層攻撃は通常、システムリソースを枯渇させる、または機能面で使用不能にすることにより、アプリケーションを利用不能にします。** これらの攻撃は、有効であるためにネットワーク帯域幅を消費する必要はありません。むしろ、アプリケーションサーバーに運用上の負荷をかけ、サーバーを利用不能、使用不能、または機能不能にします。OSI 第 7 層プロトコルスタックの弱点を悪用するすべての攻撃は、一般にアプリケーション攻撃に分類されます。これらは識別と緩和が最も困難です。

[今後のシート追加予定: カテゴリごとのすべての攻撃を一覧化する。攻撃ベクトルと対策を一対一で対応付けられないため、アクションポイントを議論する前にまず一覧化が必要です。]

**Slow HTTP 攻撃は、HTTP リクエストを非常に遅く、断片化して、一つずつ送信します。HTTP リクエストが完全に届くまで、サーバーは不足している受信データを待つ間、リソースを停滞させ続けます。** ある時点でサーバーは最大同時接続プールに達し、DoS が発生します。攻撃者の観点では、Slow HTTP 攻撃は最小限のリソースで実行できるため低コストです。

### ソフトウェア設計の概念

- **リソース消費の少ない検証を先に行う**: これらのリソースへの影響をできるだけ早く減らすことが目的です。より高コストな (CPU、メモリ、帯域幅を多く使う) 検証は、その後に実行するべきです。
- **グレースフルデグラデーションを採用する**: これは DoS の影響を制限するため、アプリケーション設計段階で従うべき中核概念です。システムやアプリケーションの一部が故障した場合でも、一定水準の機能を継続する必要があります。DoS の主な問題の一つは、システム全体で突然かつ急激なアプリケーション終了を引き起こすことです。フォールトトレラントな設計により、システムやアプリケーションは、システムの一部が故障しても完全に失敗するのではなく、場合によっては低下した水準で意図した動作を継続できます。
- **単一障害点を防ぐ**: 単一障害点 (SPOF) の検出と防止は、DoS 攻撃に抵抗するうえで重要です。ほとんどの DoS 攻撃は、過負荷になったシステムによって失敗する SPOF がシステムに存在することを前提としています。ステートレスなコンポーネントを採用し、冗長システムを使用し、障害がインフラストラクチャ全体へ広がるのを止めるバルクヘッドを作成し、外部サービスが失敗してもシステムが生き残れるようにすることを推奨します。[Prevention](https://www.baeldung.com/cs/distributed-systems-prevent-single-point-failure)
- **CPU 消費の大きい操作を避ける**: DoS 攻撃が発生すると、多くの CPU リソースを使用しがちな操作はシステム性能への深刻な足かせとなり、障害点になる可能性があります。使用している言語に固有の問題を含め、コードの性能問題を確認することを強く推奨します。[Java](https://www.theserverside.com/answer/How-to-fix-high-Java-CPU-usage-problems)、[JVM-IBM](https://www.ibm.com/docs/en/baw/23.x?topic=issues-best-practices-high-jvm-cpu-utilization)、[Microsoft-IIS](https://learn.microsoft.com/en-us/troubleshoot/developer/webapps/iis/health-diagnostic-performance/troubleshoot-high-cpu-in-iis-app-pool) を参照してください。
- **例外を処理する**: DoS 攻撃が発生すると、アプリケーションが例外をスローする可能性が高く、システムがそれらを優雅に処理できることが不可欠です。ここでも DoS 攻撃は、過負荷になったシステムが動作を継続できる形で例外をスローできないことを前提としています。コードを確認し、例外が適切に処理されていることを確認することを推奨します。[Large-Scale-Systems](https://raygun.com/blog/errors-and-exceptions/)、[Java](https://www.theserverside.com/blog/Coffee-Talk-Java-News-Stories-and-Opinions/Java-Exception-handling-best-practices)、[Java](https://www.digitalocean.com/community/tutorials/exception-handling-in-java) を参照してください。
- **オーバーフローとアンダーフローを防ぐ** バッファオーバーフローとアンダーフローは脆弱性につながることが多いため、それらを防ぐ方法を学ぶことが重要です。[OWASP](https://owasp.org/www-community/vulnerabilities/Buffer_Overflow)、[Overflow-Underflow-C](https://developer.apple.com/library/archive/documentation/Security/Conceptual/SecureCodingGuide/Articles/BufferOverflows.html)、[Overflow](https://www.freecodecamp.org/news/buffer-overflow-attacks/)
- **スレッド処理**: 大きなタスクの完了を待たなければ先に進めない操作は避けてください。このような状況では非同期操作が有用です。
- リソースを大量に消費するページを特定し、事前に計画してください。

### セッション

- **非アクティブ状態と最終タイムアウトに基づき、サーバー側セッション時間を制限する**: (リソース枯渇) セッションタイムアウトはほとんどの場合、セッションセキュリティやセッションハイジャック防止との関係で議論されますが、リソース枯渇を防ぐためにも重要な手段です。
- **セッションに紐付く情報の保存量を制限する**: セッションに関連付けられるデータが少ないほど、ユーザーセッションが Web サーバー性能に与える負担は小さくなります。

### 入力検証

- **ファイルアップロードサイズと拡張子を制限する**: この方策は、ファイル空き容量ストレージ、またはアップロードを入力として使用するその他の Web アプリケーション機能 (画像リサイズ、PDF 作成など) に対する DoS を防ぎます。(リソース枯渇) - [Checklist](https://owasp.org/www-community/vulnerabilities/Unrestricted_File_Upload)
- **リクエスト全体のサイズを制限する**: リソースを消費する DoS 攻撃を成功しにくくするためです。(リソース枯渇)
- **入力に基づくリソース割り当てを防ぐ**: これも、リソースを消費する DoS 攻撃を成功しにくくするためです。(リソース枯渇)
- **入力に基づく関数とスレッド処理の相互作用を防ぐ**: ユーザー入力は、関数を何回実行する必要があるか、または CPU 消費がどれほど高くなるかに影響する可能性があります。リソース割り当てを (フィルタリングされていない) ユーザー入力に依存すると、リソース枯渇による DoS シナリオを許す可能性があります。(リソース枯渇)
- **入力ベースのパズル**、たとえば captcha や簡単な数学問題は、Web フォームを「保護」するためによく使用されます。典型例は、リクエスト投稿後にメールを送信する Web フォームです。この場合、captcha は悪意ある攻撃者やスパムボットによってメールボックスがあふれることを防げます。**パズルは機能の悪用に対して目的を果たしますが、この種の技術は DoS 攻撃に対する防御には役立ちません。**

### アクセス制御

- **機能を公開する手段としての認証**: 最小権限の原則は、攻撃者が DoS 技術で潜在的に有害な機能へアクセスする能力を拒否することにより、DoS 攻撃を防ぐうえで重要な役割を果たせます。
- **ユーザーロックアウト** は、攻撃者がログイン失敗を悪用することにより、アプリケーションのセキュリティメカニズムを利用して DoS を引き起こせるシナリオです。

## ネットワーク攻撃

ネットワーク攻撃の詳細については、以下を参照してください。

[Juniper](https://www.juniper.net/documentation/us/en/software/junos/denial-of-service/topics/topic-map/security-network-dos-attack.html)
[eSecurityPlanet](https://www.esecurityplanet.com/networks/types-of-ddos-attacks/)

[今後のチートシート追加予定: ネットワーク帯域幅が飽和する攻撃について議論する。性質としてはボリューム型です。増幅技術により、これらの攻撃は効果的になります。攻撃一覧: NTP amplification、DNS amplification、UDP flooding、TCP flooding]

### ネットワーク設計の概念

- **単一障害点を防ぐ**: 上記を参照してください。
- **キャッシュ**: データを保存し、そのデータへの将来のリクエストをより速く提供できるようにするという概念です。キャッシュによって提供されるデータが多いほど、アプリケーションは帯域幅枯渇に対してより回復力を持ちます。
- **静的リソースを別ドメインでホストする** と、Web アプリケーションへの http リクエスト数を減らせます。画像と JavaScript は、別ドメインから読み込まれる典型的なファイルです。

### レート制限

レート制限は、サーバーまたはコンポーネントとの間のトラフィック速度を制御するプロセスです。インフラストラクチャレベルでもアプリケーションレベルでも実装できます。レート制限は、(問題のある) IP、IP ブロックリスト、地理的位置などに基づいて行うことができます。

- **最小受信データレート制限を定義し**、そのレートを下回るすべての接続を切断します。レート制限を低く設定しすぎると、クライアントに影響する可能性があることに注意してください。ログを調査し、正当なトラフィックレートのベースラインを確立してください。(Slow HTTP 攻撃に対する保護)
- **絶対接続タイムアウトを定義する**
- **最大受信データレート制限を定義し**、そのレートを上回るすべての接続を切断します。
- **総帯域幅サイズ制限を定義し**、帯域幅枯渇を防ぎます。
- **負荷制限を定義する**。これは、任意の時点で任意のリソースにアクセスを許可されるユーザー数を指定します。

### ISP レベルの対策

- **エッジルーターを使用して無効な送信元アドレスをフィルタリングする**。RFC 2267 に従い、ブロックリストを迂回する目的で行われる IP スプーフィング攻撃をフィルタリングします。
- **事前に DDoS の観点で ISP サービスを確認する** (複数のインターネットアクセスポイントのサポート、十分な帯域幅 (xx-xxx Gbit/s)、アプリケーションレベルでのトラフィック分析と防御のための専用ハードウェア)。

### グローバルレベルの対策: 商用クラウドフィルタサービス

- より大規模な攻撃 (最大 500GBit/s) に耐えるため、フィルタサービスの利用を検討してください。
- **フィルタサービス** は、悪意ある、または準拠していないトラフィックを除外するためのさまざまな仕組みをサポートします。
- **関連するデータ保護/プライバシー法を遵守する** - 多くのプロバイダーは USA/UK 経由でトラフィックをルーティングします。

## 関連記事

- [CERT-EU Publication](http://cert.europa.eu/static/WhitePapers/CERT-EU-SWP_14_09_DDoS_final.pdf)

</section>

<section id="denial-of-service-bilingual-panel" className="tabPanel bilingualPanel">

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Introduction

This cheat sheet describes a methodology for handling denial of service (DoS) attacks on different layers. It also serves as a platform for further discussion and analysis, since there are many different ways to perform DoS attacks.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## はじめに

このチートシートでは、さまざまな層におけるサービス拒否 (DoS) 攻撃への対処方法を説明します。また、DoS 攻撃を実行する方法は数多く存在するため、さらなる議論と分析の土台としても機能します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Fundamentals

Because anti-DoS methods cannot be one-step solutions, your developers and application/infrastructure architects must develop DoS solutions carefully. They must keep in mind that "availability" is a basic part of the [CIA triad](https://whatis.techtarget.com/definition/Confidentiality-integrity-and-availability-CIA).

Remember that if every part of the computing system within the interoperability flow does not function correctly, your infrastructure suffers. A successful DoS attack hinders the availability of instances or objects to a system and can eventually render the entire system inaccessible.

**To ensure systems can be resilient and resist a DoS attack, we strongly suggest a thorough analysis on components within your inventory based on functionality, architecture and performance (i.e. application-wise, infrastructure and network related).**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 基本事項

DoS 対策は一段階で完了する解決策にはなり得ないため、開発者とアプリケーション/インフラストラクチャアーキテクトは DoS 対策を慎重に設計する必要があります。「可用性」は [CIA triad](https://whatis.techtarget.com/definition/Confidentiality-integrity-and-availability-CIA) の基本要素であることを念頭に置く必要があります。

相互運用の流れに含まれるコンピューティングシステムの各部分が正しく機能しなければ、インフラストラクチャに影響が及ぶことを忘れないでください。DoS 攻撃が成功すると、システムに対するインスタンスやオブジェクトの可用性が妨げられ、最終的にシステム全体がアクセス不能になる可能性があります。

**システムが DoS 攻撃に対して回復力を持ち、抵抗できるようにするため、機能、アーキテクチャ、性能に基づいて、インベントリ内のコンポーネントを徹底的に分析することを強く推奨します (アプリケーション、インフラストラクチャ、ネットワークに関する観点)。**

</div>
</div>

<div className="bilingualPair shared">
<div className="bilingualBlock shared">
<span className="bilingualLabel shared">コード・画像 (共通)</span>

![DDOSFlow](https://cheatsheetseries.owasp.org/assets/Denial_of_Service_Cheat_Sheet_FlowDDOS.png)

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

This DoS system inventory should look for potential places where DoS attacks can cause problems and highlight any single points of system failures, which can range from programming related errors to resource exhaustion. It should give you a clear picture of what issues are at stake (e.g. bottlenecks, etc.). **To resolve problems, a solid understanding of your environment is essential to develop suitable defence mechanisms**. These could be aligned with:

1. Scaling options (**up** = inner hardware components, **out** = the number of complete components).
2. Existing conceptual / logical techniques (such as applying redundancy measurements, bulk-heading, etc. - which expands your in-house capabilities).
3. A cost analysis applied to your situation.

This document adopts a specific guidance structure from CERT-EU to analyze this subject, which you may need to change depending on your situation. It is not a complete approach but it will help you create fundamental blocks which should be utilized to assist you in constructing anti-DoS concepts fitting your needs.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

この DoS システムインベントリでは、DoS 攻撃が問題を引き起こす可能性のある箇所を探し、プログラミング関連のエラーからリソース枯渇まで、システム障害の単一障害点を明らかにする必要があります。これにより、どのような問題が重要であるか (ボトルネックなど) を明確に把握できます。**問題を解決するには、適切な防御メカニズムを開発するために、自身の環境を確実に理解することが不可欠です**。これらは次のものと整合させることができます。

1. スケーリングの選択肢 (**up** = 内部ハードウェアコンポーネント、**out** = 完全なコンポーネントの数)。
2. 既存の概念的/論理的技法 (冗長化手段、バルクヘッドなどの適用。これは組織内の能力を拡張します)。
3. 自身の状況に適用したコスト分析。

この文書では、この主題を分析するために CERT-EU の特定のガイダンス構造を採用していますが、状況に応じて変更が必要になる場合があります。これは完全なアプローチではありませんが、ニーズに合った DoS 対策の概念を構築する際に活用すべき基本ブロックを作る助けになります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Analyzing DoS attack surfaces

In this cheat sheet, we will use the DDOS classification as documented by CERT-EU to examine DoS system vulnerabilities. It uses the seven OSI model and focuses three main attack surfaces, namely Application, Session and Network.

#### 1) Overview of potential DoS weaknesses

It is important to understand that each of these three attack categories needs to be considered when designing a DoS-resilient solution:

**Application attacks** focus on rendering applications unavailable by exhausting resources or by making it unusable in a functional way.

**Session (or protocol) attacks** focus on consuming server resources, or resources of intermediary equipment like firewalls and load-balancers.

**Network (or volumetric) attacks** focus on saturating the bandwidth of the network resource.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### DoS 攻撃面の分析

このチートシートでは、CERT-EU が文書化した DDoS 分類を使用して DoS システムの脆弱性を検討します。この分類は 7 層の OSI モデルを使用し、Application、Session、Network という三つの主要な攻撃面に焦点を当てます。

#### 1) 潜在的な DoS 弱点の概要

DoS に強いソリューションを設計する際には、これら三つの攻撃カテゴリそれぞれを考慮する必要があることを理解することが重要です。

**Application attacks** は、リソースを枯渇させる、または機能面で使用不能にすることにより、アプリケーションを利用不能にすることを目的とします。

**Session (or protocol) attacks** は、サーバーリソース、またはファイアウォールやロードバランサなどの中間機器のリソースを消費することを目的とします。

**Network (or volumetric) attacks** は、ネットワークリソースの帯域幅を飽和させることを目的とします。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Note that OSI model layers 1 and 2 are not included in this categorization, so we will now discuss these layers and how DoS applies to them.

The **physical layer** consists of the networking hardware transmission technologies of a network. It is a fundamental layer underlying the logical data structures of the higher-level functions in a network. Typical DoS scenarios that involve the physical layer involve system destruction, obstruction, and malfunction. For example, a Georgian elderly woman sliced through an underground cable, resulting in the loss of internet for the whole of Armenia.

The **data layer** is the protocol layer that transfers data between adjacent network nodes in a wide area network (WAN) or between nodes on the same local area network (LAN) segment. Typical DoS scenarios are MAC flooding (targeting switch MAC tables) and ARP poisoning.

In **MAC flooding attacks**, a switch is flooded with packets that all have different source MAC addresses. The goal of this attack is to consume the limited memory used by a switch to store the MAC and physical port translation table (MAC table), which causes valid MAC addresses to be purged and forces the switch to enter a fail-over mode where it becomes a network hub. If this occurs, all data is forwarded to all ports, resulting in a data leakage.

[Future additions to sheet: The impact in relation to DoS and document compact remediation]

In **ARP poisoning attacks**, a malicious actor sends spoofed ARP (Address Resolution Protocol) messages over the wire. If the attacker's MAC address becomes linked to the IP address of a legitimate device on the network, the attacker can intercept, modify or stop data that was intended for the victim IP address. The ARP protocol is specific to the local area network and could cause a DoS on the wire communication.

Packet filtering technology can be used to inspect packets in transit to identify and block offending ARP packets. Another approach is to use static ARP tables but they prove difficult to be maintained.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

OSI モデルの第 1 層と第 2 層はこの分類に含まれていないため、ここではこれらの層と DoS との関係について説明します。

**物理層** は、ネットワークのハードウェア伝送技術で構成されます。これは、ネットワークにおける上位機能の論理データ構造を支える基本的な層です。物理層に関係する典型的な DoS シナリオには、システム破壊、妨害、誤動作があります。たとえば、ジョージアの高齢女性が地下ケーブルを切断し、アルメニア全土でインターネットが失われた事例があります。

**データ層** は、広域ネットワーク (WAN) 内の隣接ネットワークノード間、または同じローカルエリアネットワーク (LAN) セグメント上のノード間でデータを転送するプロトコル層です。典型的な DoS シナリオには、MAC フラッディング (スイッチの MAC テーブルを標的とする) と ARP ポイズニングがあります。

**MAC フラッディング攻撃** では、すべて異なる送信元 MAC アドレスを持つパケットでスイッチをあふれさせます。この攻撃の目的は、MAC と物理ポートの変換テーブル (MAC テーブル) を保存するためにスイッチが使用する限られたメモリを消費することです。これにより有効な MAC アドレスが削除され、スイッチはネットワークハブのように動作するフェイルオーバーモードに移行します。これが発生すると、すべてのデータがすべてのポートへ転送され、データ漏えいにつながります。

[今後のシート追加予定: DoS との関係における影響と、簡潔な対策文書]

**ARP ポイズニング攻撃** では、悪意のある行為者が偽装した ARP (Address Resolution Protocol) メッセージをネットワーク上に送信します。攻撃者の MAC アドレスがネットワーク上の正当なデバイスの IP アドレスと関連付けられると、攻撃者は被害者 IP アドレス宛てのデータを傍受、変更、または停止できます。ARP プロトコルはローカルエリアネットワーク固有であり、有線通信に DoS を引き起こす可能性があります。

パケットフィルタリング技術を使用すると、通過中のパケットを検査し、不正な ARP パケットを識別してブロックできます。別の方法として静的 ARP テーブルの使用がありますが、維持が困難であることが分かっています。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Application attacks

**Application layer attacks usually make applications unavailable by exhausting system resources or by making it unusable in a functional way.** These attacks do not have to consume the network bandwidth to be effective. Rather they place an operational strain on the application server in such a way that the server becomes unavailable, unusable or non-functional. All attacks exploiting weaknesses on OSI layer 7 protocol stack are generally categorised as application attacks. They are the most challenging to identify/mitigate.

[Future additions to sheet: List all attacks per category. Because we cannot map remediations one on one with an attack vector, we will first need to list them before discussing the action points.]

**Slow HTTP attacks deliver HTTP requests very slow and fragmented, one at a time. Until the HTTP request was fully delivered, the server will keep resources stalled while waiting for the missing incoming data.** At one moment, the server will reach the maximum concurrent connection pool, resulting in a DoS. From an attacker's perspective, slow HTTP attacks are cheap to perform because they require minimal resources.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## アプリケーション攻撃

**アプリケーション層攻撃は通常、システムリソースを枯渇させる、または機能面で使用不能にすることにより、アプリケーションを利用不能にします。** これらの攻撃は、有効であるためにネットワーク帯域幅を消費する必要はありません。むしろ、アプリケーションサーバーに運用上の負荷をかけ、サーバーを利用不能、使用不能、または機能不能にします。OSI 第 7 層プロトコルスタックの弱点を悪用するすべての攻撃は、一般にアプリケーション攻撃に分類されます。これらは識別と緩和が最も困難です。

[今後のシート追加予定: カテゴリごとのすべての攻撃を一覧化する。攻撃ベクトルと対策を一対一で対応付けられないため、アクションポイントを議論する前にまず一覧化が必要です。]

**Slow HTTP 攻撃は、HTTP リクエストを非常に遅く、断片化して、一つずつ送信します。HTTP リクエストが完全に届くまで、サーバーは不足している受信データを待つ間、リソースを停滞させ続けます。** ある時点でサーバーは最大同時接続プールに達し、DoS が発生します。攻撃者の観点では、Slow HTTP 攻撃は最小限のリソースで実行できるため低コストです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Software Design Concepts

- **Using validation that is cheap in resources first**: We want to reduce impact on these resources as soon as possible. More (CPU, memory and bandwidth) expensive validation should be performed afterward.
- **Employing graceful degradation**: This is a core concept to follow during application design phase, in order to limit impact of DoS. You need to continue some level of functionality when portions of a system or application break. One of the main problems with DoS is that it causes sudden and abrupt application terminations throughout the system. A fault tolerant design enables a system or application to continue its intended operation, possibly at a reduced level, rather than failing completely if parts of the system fails.
- **Prevent single point of failure**: Detecting and preventing single points of failure (SPOF) is key to resisting DoS attacks. Most DoS attacks assume that a system has SPOFs that will fail due to overwhelmed systems. We suggest that you employ stateless components, use redundant systems, create bulkheads to stop failures from spreading across the infrastructure, and make sure that systems can survive when external services fail. [Prevention](https://www.baeldung.com/cs/distributed-systems-prevent-single-point-failure)
- **Avoid highly CPU consuming operations**: When a DoS attack occurs, operations that tend to use a lot of CPU resources can become serious drags on system performance and can become a point of failure. We strongly suggest that you review performance issues with your code, including problems that are inherent in the languages that you are using. See [Java](https://www.theserverside.com/answer/How-to-fix-high-Java-CPU-usage-problems) [JVM-IBM](https://www.ibm.com/docs/en/baw/23.x?topic=issues-best-practices-high-jvm-cpu-utilization) and [Microsoft-IIS](https://learn.microsoft.com/en-us/troubleshoot/developer/webapps/iis/health-diagnostic-performance/troubleshoot-high-cpu-in-iis-app-pool)
- **Handle exceptions**: When a DoS attack occurs, it is likely that applications will throw exceptions and it is vital that your systems can handle them gracefully. Again, a DoS attack assumes that an overwhelmed system will not be able to throw exceptions in a way that the system can continue operating. We suggest that you go through your code and make sure that exceptions are handled properly. See [Large-Scale-Systems](https://raygun.com/blog/errors-and-exceptions/) [Java](https://www.theserverside.com/blog/Coffee-Talk-Java-News-Stories-and-Opinions/Java-Exception-handling-best-practices) and [Java](https://www.digitalocean.com/community/tutorials/exception-handling-in-java)
- **Protect overflow and underflow** Since buffer overflow and underflow often lead to vulnerabilities, learning how to prevent them is key. [OWASP](https://owasp.org/www-community/vulnerabilities/Buffer_Overflow) [Overflow-Underflow-C](https://developer.apple.com/library/archive/documentation/Security/Conceptual/SecureCodingGuide/Articles/BufferOverflows.html) [Overflow](https://www.freecodecamp.org/news/buffer-overflow-attacks/)
- **Threading**: Avoid operations which must wait for completion of large tasks to proceed. Asynchronous operations are useful in these situations.
- Identify resource intensive pages and plan ahead.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### ソフトウェア設計の概念

- **リソース消費の少ない検証を先に行う**: これらのリソースへの影響をできるだけ早く減らすことが目的です。より高コストな (CPU、メモリ、帯域幅を多く使う) 検証は、その後に実行するべきです。
- **グレースフルデグラデーションを採用する**: これは DoS の影響を制限するため、アプリケーション設計段階で従うべき中核概念です。システムやアプリケーションの一部が故障した場合でも、一定水準の機能を継続する必要があります。DoS の主な問題の一つは、システム全体で突然かつ急激なアプリケーション終了を引き起こすことです。フォールトトレラントな設計により、システムやアプリケーションは、システムの一部が故障しても完全に失敗するのではなく、場合によっては低下した水準で意図した動作を継続できます。
- **単一障害点を防ぐ**: 単一障害点 (SPOF) の検出と防止は、DoS 攻撃に抵抗するうえで重要です。ほとんどの DoS 攻撃は、過負荷になったシステムによって失敗する SPOF がシステムに存在することを前提としています。ステートレスなコンポーネントを採用し、冗長システムを使用し、障害がインフラストラクチャ全体へ広がるのを止めるバルクヘッドを作成し、外部サービスが失敗してもシステムが生き残れるようにすることを推奨します。[Prevention](https://www.baeldung.com/cs/distributed-systems-prevent-single-point-failure)
- **CPU 消費の大きい操作を避ける**: DoS 攻撃が発生すると、多くの CPU リソースを使用しがちな操作はシステム性能への深刻な足かせとなり、障害点になる可能性があります。使用している言語に固有の問題を含め、コードの性能問題を確認することを強く推奨します。[Java](https://www.theserverside.com/answer/How-to-fix-high-Java-CPU-usage-problems)、[JVM-IBM](https://www.ibm.com/docs/en/baw/23.x?topic=issues-best-practices-high-jvm-cpu-utilization)、[Microsoft-IIS](https://learn.microsoft.com/en-us/troubleshoot/developer/webapps/iis/health-diagnostic-performance/troubleshoot-high-cpu-in-iis-app-pool) を参照してください。
- **例外を処理する**: DoS 攻撃が発生すると、アプリケーションが例外をスローする可能性が高く、システムがそれらを優雅に処理できることが不可欠です。ここでも DoS 攻撃は、過負荷になったシステムが動作を継続できる形で例外をスローできないことを前提としています。コードを確認し、例外が適切に処理されていることを確認することを推奨します。[Large-Scale-Systems](https://raygun.com/blog/errors-and-exceptions/)、[Java](https://www.theserverside.com/blog/Coffee-Talk-Java-News-Stories-and-Opinions/Java-Exception-handling-best-practices)、[Java](https://www.digitalocean.com/community/tutorials/exception-handling-in-java) を参照してください。
- **オーバーフローとアンダーフローを防ぐ** バッファオーバーフローとアンダーフローは脆弱性につながることが多いため、それらを防ぐ方法を学ぶことが重要です。[OWASP](https://owasp.org/www-community/vulnerabilities/Buffer_Overflow)、[Overflow-Underflow-C](https://developer.apple.com/library/archive/documentation/Security/Conceptual/SecureCodingGuide/Articles/BufferOverflows.html)、[Overflow](https://www.freecodecamp.org/news/buffer-overflow-attacks/)
- **スレッド処理**: 大きなタスクの完了を待たなければ先に進めない操作は避けてください。このような状況では非同期操作が有用です。
- リソースを大量に消費するページを特定し、事前に計画してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Session

- **Limit server side session time based on inactivity and a final timeout**: (resource exhaustion) While sessions timeout is most of the time discussed in relation to session security and preventing session hijacking, it is also an important measure to prevent resource exhaustion.
- **Limit session bound information storage**: The less data is linked to a session, the less burden a user session has on the webserver's performance.

### Input validation

- **Limit file upload size and extensions**: This tactic prevents DoS on file space storage or other web application functions which will use the upload as input (e.g. image resizing, PDF creation, etc. (resource exhaustion) - [Checklist](https://owasp.org/www-community/vulnerabilities/Unrestricted_File_Upload).
- **Limit total request size**: To make it harder for resource-consuming DoS attacks to succeed. (resource exhaustion)
- **Prevent input based resource allocation**: Again, to make it harder for resource-consuming DoS attacks to succeed. (resource exhaustion)
- **Prevent input based function and threading interaction**: User input can influence how many times a function needs to be executed, or how intensive the CPU consumption becomes. Depending on (unfiltered) user input for resource allocation could allow a DoS scenario through resource exhaustion. (resource exhaustion)
- **Input based puzzles** like captchas or simple math problems are often used to 'protect' a web form. The classic example is a webform that will send out an email after posting the request. A captcha could then prevent the mailbox from getting flooded by a malicious attacker or spambot. **Puzzles serve a purpose against functionality abuse but this kind of technology will not help defend against DoS attacks.**

### Access control

- **Authentication as a means to expose functionality**: The principle of least privilege can play a key role in preventing DoS attacks by denying attackers the ability to access potentially damaging functions with DoS techniques.
- **User lockout** is a scenario where an attacker can take advantage of the application security mechanisms to cause DoS by abusing the login failure.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### セッション

- **非アクティブ状態と最終タイムアウトに基づき、サーバー側セッション時間を制限する**: (リソース枯渇) セッションタイムアウトはほとんどの場合、セッションセキュリティやセッションハイジャック防止との関係で議論されますが、リソース枯渇を防ぐためにも重要な手段です。
- **セッションに紐付く情報の保存量を制限する**: セッションに関連付けられるデータが少ないほど、ユーザーセッションが Web サーバー性能に与える負担は小さくなります。

### 入力検証

- **ファイルアップロードサイズと拡張子を制限する**: この方策は、ファイル空き容量ストレージ、またはアップロードを入力として使用するその他の Web アプリケーション機能 (画像リサイズ、PDF 作成など) に対する DoS を防ぎます。(リソース枯渇) - [Checklist](https://owasp.org/www-community/vulnerabilities/Unrestricted_File_Upload)
- **リクエスト全体のサイズを制限する**: リソースを消費する DoS 攻撃を成功しにくくするためです。(リソース枯渇)
- **入力に基づくリソース割り当てを防ぐ**: これも、リソースを消費する DoS 攻撃を成功しにくくするためです。(リソース枯渇)
- **入力に基づく関数とスレッド処理の相互作用を防ぐ**: ユーザー入力は、関数を何回実行する必要があるか、または CPU 消費がどれほど高くなるかに影響する可能性があります。リソース割り当てを (フィルタリングされていない) ユーザー入力に依存すると、リソース枯渇による DoS シナリオを許す可能性があります。(リソース枯渇)
- **入力ベースのパズル**、たとえば captcha や簡単な数学問題は、Web フォームを「保護」するためによく使用されます。典型例は、リクエスト投稿後にメールを送信する Web フォームです。この場合、captcha は悪意ある攻撃者やスパムボットによってメールボックスがあふれることを防げます。**パズルは機能の悪用に対して目的を果たしますが、この種の技術は DoS 攻撃に対する防御には役立ちません。**

### アクセス制御

- **機能を公開する手段としての認証**: 最小権限の原則は、攻撃者が DoS 技術で潜在的に有害な機能へアクセスする能力を拒否することにより、DoS 攻撃を防ぐうえで重要な役割を果たせます。
- **ユーザーロックアウト** は、攻撃者がログイン失敗を悪用することにより、アプリケーションのセキュリティメカニズムを利用して DoS を引き起こせるシナリオです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Network attacks

For more information on network attacks, see:

[Juniper](https://www.juniper.net/documentation/us/en/software/junos/denial-of-service/topics/topic-map/security-network-dos-attack.html)
[eSecurityPlanet](https://www.esecurityplanet.com/networks/types-of-ddos-attacks/)

[Future additions to cheat sheet: Discuss attacks where network bandwidth gets saturation. Volumetric in nature. Amplification techniques make these attacks effective. List attacks: NTP amplification, DNS amplification, UDP flooding, TCP flooding]

### Network Design Concepts

- **Preventing single point of failure**: See above.
- **Caching**: The concept that data is stored so future requests for that data can be served faster. The more data is served via caching, to more resilient the application becomes to bandwidth exhaustion.
- **Static resources hosting on a different domain** will reduce the number of http requests on the web application. Images and JavaScript are typical files that are loaded from a different domain.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## ネットワーク攻撃

ネットワーク攻撃の詳細については、以下を参照してください。

[Juniper](https://www.juniper.net/documentation/us/en/software/junos/denial-of-service/topics/topic-map/security-network-dos-attack.html)
[eSecurityPlanet](https://www.esecurityplanet.com/networks/types-of-ddos-attacks/)

[今後のチートシート追加予定: ネットワーク帯域幅が飽和する攻撃について議論する。性質としてはボリューム型です。増幅技術により、これらの攻撃は効果的になります。攻撃一覧: NTP amplification、DNS amplification、UDP flooding、TCP flooding]

### ネットワーク設計の概念

- **単一障害点を防ぐ**: 上記を参照してください。
- **キャッシュ**: データを保存し、そのデータへの将来のリクエストをより速く提供できるようにするという概念です。キャッシュによって提供されるデータが多いほど、アプリケーションは帯域幅枯渇に対してより回復力を持ちます。
- **静的リソースを別ドメインでホストする** と、Web アプリケーションへの http リクエスト数を減らせます。画像と JavaScript は、別ドメインから読み込まれる典型的なファイルです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Rate limiting

Rate limiting is the process of controlling traffic rate from and to a server or component. It can be implemented on infrastructure as well as on an application level. Rate limiting can be based on (offending) IPs, on IP block lists, on geolocation, etc.

- **Define a minimum ingress data rate limit** and drop all connections below that rate. Note that if the rate limit is set too low, this could impact clients. Inspect the logs to establish a baseline of genuine traffic rate. (Protection against slow HTTP attacks)
- **Define an absolute connection timeout**
- **Define a maximum ingress data rate limit** then drop all connections above that rate.
- **Define a total bandwidth size limit** to prevent bandwidth exhaustion
- **Define a load limit**, which specifies the number of users allowed to access any given resource at any given time.

### ISP-Level remediations

- **Filter invalid sender addresses using edge routers**, in accordance with RFC 2267, to filter out IP-spoofing attacks done with the goal of bypassing block lists.
- **Check your ISP services in terms of DDOS beforehand** (support for multiple internet access points, enough bandwidth (xx-xxx Gbit/s) and special hardware for traffic analysis and defence on application level

### Global-Level remediations: Commercial cloud filter services

- Consider using a filter service in order to resist larger attacks (up to 500GBit/s)
- **Filter services** support different mechanics to filter out malicious or non compliant traffic
- **Comply with relevant data protection/privacy laws** - a lot of providers route traffic through USA/UK

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### レート制限

レート制限は、サーバーまたはコンポーネントとの間のトラフィック速度を制御するプロセスです。インフラストラクチャレベルでもアプリケーションレベルでも実装できます。レート制限は、(問題のある) IP、IP ブロックリスト、地理的位置などに基づいて行うことができます。

- **最小受信データレート制限を定義し**、そのレートを下回るすべての接続を切断します。レート制限を低く設定しすぎると、クライアントに影響する可能性があることに注意してください。ログを調査し、正当なトラフィックレートのベースラインを確立してください。(Slow HTTP 攻撃に対する保護)
- **絶対接続タイムアウトを定義する**
- **最大受信データレート制限を定義し**、そのレートを上回るすべての接続を切断します。
- **総帯域幅サイズ制限を定義し**、帯域幅枯渇を防ぎます。
- **負荷制限を定義する**。これは、任意の時点で任意のリソースにアクセスを許可されるユーザー数を指定します。

### ISP レベルの対策

- **エッジルーターを使用して無効な送信元アドレスをフィルタリングする**。RFC 2267 に従い、ブロックリストを迂回する目的で行われる IP スプーフィング攻撃をフィルタリングします。
- **事前に DDoS の観点で ISP サービスを確認する** (複数のインターネットアクセスポイントのサポート、十分な帯域幅 (xx-xxx Gbit/s)、アプリケーションレベルでのトラフィック分析と防御のための専用ハードウェア)。

### グローバルレベルの対策: 商用クラウドフィルタサービス

- より大規模な攻撃 (最大 500GBit/s) に耐えるため、フィルタサービスの利用を検討してください。
- **フィルタサービス** は、悪意ある、または準拠していないトラフィックを除外するためのさまざまな仕組みをサポートします。
- **関連するデータ保護/プライバシー法を遵守する** - 多くのプロバイダーは USA/UK 経由でトラフィックをルーティングします。

</div>
</div>

</section>

</div>

## Related Articles

<div className="contentPanel">

- [CERT-EU Publication](http://cert.europa.eu/static/WhitePapers/CERT-EU-SWP_14_09_DDoS_final.pdf)

</div>

## Attribution

<div className="attributionFooter">

- Original: Denial of Service Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Denial_of_Service_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: English original retained for comparison. Japanese translation added.
- Retrieved: 2026-05-21

</div>
