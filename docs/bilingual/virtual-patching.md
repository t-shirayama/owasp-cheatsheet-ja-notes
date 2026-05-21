---
title: Virtual Patching Cheat Sheet
hide_title: true
---

<div className="docHero" data-category="asvs-v15">
  <h1>仮想パッチチートシート</h1>
  <div className="docMeta">
    <span className="docPill">最終更新: 2026-05-20</span>
    <span className="docPill">読了時間: 準備中</span>
    <span className="docPill">カテゴリ: セキュアコーディングとアーキテクチャ</span>
  </div>
</div>

<p className="docLead">仮想パッチチートシートを、原文・翻訳・対比表示で確認できます。ASVS Index 対応の文脈で、公式原文と日本語訳を確認しやすく整理しています。</p>

<div className="tabbedContent">
  <input className="tabInput" type="radio" name="virtual-patching-view" id="virtual-patching-original" />
  <input className="tabInput" type="radio" name="virtual-patching-view" id="virtual-patching-translation" defaultChecked />
  <input className="tabInput" type="radio" name="virtual-patching-view" id="virtual-patching-bilingual" />

  <div className="contentTabs">
    <label htmlFor="virtual-patching-original" title="OWASP 原文">原文</label>
    <label htmlFor="virtual-patching-translation" title="日本語訳">翻訳</label>
    <label htmlFor="virtual-patching-bilingual" title="原文と翻訳を並べて確認">対比表示</label>
  </div>

<section id="virtual-patching-original-panel" className="tabPanel originalPanel contentPanel">

## Introduction

The goal with this cheat Sheet is to present a concise virtual patching framework that organizations can follow to maximize the timely implementation of mitigation protections.

## Definition: Virtual Patching

**A security policy enforcement layer which prevents and reports the exploitation attempt of a known vulnerability.**

The virtual patch works when the security enforcement layer analyzes transactions and intercepts attacks in transit, so malicious traffic never reaches the web application. The resulting impact of virtual patching is that, while the actual source code of the application itself has not been modified, the exploitation attempt does not succeed.

## Why Not Just Fix the Code

From a purely technical perspective, the number one remediation strategy would be for an organization to correct the identified vulnerability within the source code of the web application. This concept is universally agreed upon by both web application security experts and system owners. Unfortunately, in real world business situations, there arise many scenarios where updating the source code of a web application is not easy such as:

- **Lack of resources** - Devs are already allocated to other projects.
- **Third-party Software** - Code can not be modified by the user.
- **Outsourced App Dev** - Changes would require a new project.

The important point is this - **Code level fixes and Virtual Patching are NOT mutually exclusive**. They are processes that are executed by different team (OWASP Builders/Devs vs. OWASP Defenders/OpSec) and can be run in tandem.

## Value of Virtual Patching

The two main goals of Virtual Patching are:

- **Minimize Time-to-Fix** - Fixing application source code takes time. The main purpose of a virtual patch is to implement a mitigation for the identified vulnerability as soon as possible. The urgency of this response may be different: for example if the vulnerability was identified in-house through code reviews or penetration testing vs. finding a vulnerability as part of live incident response.
- **Attack Surface Reduction** - Focus on minimizing the attack vector. In some cases, such as missing positive security input validation, it is possible to achieve 100% attack surface reduction. In other cases, such with missing output encoding for XSS flaws, you may only be able to limit the exposures. Keep in mind - 50% reduction in 10 minutes is better than 100% reduction in 48 hrs.

## Virtual Patching Tools

Notice that the definition above did not list any specific tool as there are a number of different options that may be used for virtual patching efforts such as:

- Intermediary devices such as a WAF or IPS appliance
- Web server plugin such as ModSecurity
- Application layer filter such as ESAPI WAF

For example purposes, we will show virtual patching examples using the open source [ModSecurity WAF tool](http://www.modsecurity.org).

## A Virtual Patching Methodology

Virtual Patching, like most other security processes, is not something that should be approached haphazardly. Instead, a consistent, repeatable process should be followed that will provide the best chances of success. The following virtual patching workflow mimics the industry accepted practice for conducting IT Incident Response and consists of the following phases:

1. Preparation.
2. Identification.
3. Analysis.
4. Virtual Patch Creation.
5. Implementation/Testing.
6. Recovery/Follow Up.

## Example Public Vulnerability

Let's take the following [SQL Injection vulnerability](https://packetstormsecurity.com/files/119217/WordPress-Shopping-Cart-8.1.14-Shell-Upload-SQL-Injection.html) as our example for the remainder of this article:

```text
WordPress Shopping Cart Plugin for WordPress
/wp-content/plugins/levelfourstorefront/scripts/administration/exportsubscribers.php
reqID Parameter prone to SQL Injection.
```

**Description**:

WordPress Shopping Cart Plugin for WordPress contains a flaw that may allow an attacker to carry out an SQL injection attack.

The issue is due to the `/wp-content/plugins/levelfourstorefront/scripts/administration/exportsubscribers.php` script not properly sanitizing user-supplied input to the `reqID` parameter.

This may allow an attacker to inject or manipulate SQL queries in the back-end database, allowing for the manipulation or disclosure of arbitrary data.

## Preparation Phase

The importance of properly utilizing the preparation phase with regards to virtual patching cannot be overstated. You need to do a number of things to setup the virtual patching processes and framework **prior** to actually having to deal with an identified vulnerability, or worse yet, react to a live web application intrusion. The point is that during a live compromise is not the ideal time to be proposing installation of a web application firewall and the concept of a virtual patch. Tension is high during real incidents and time is of the essence, so lay the foundation of virtual patching when the waters are calm and get everything in place and ready to go when an incident does occur.

Here are a few critical items that should be addressed during the preparation phase:

- **Public/Vendor Vulnerability Monitoring** - Ensure that you are signed up for all vendor alert mail-lists for commercial software that you are using. This will ensure that you will be notified in the event that the vendor releases vulnerability information and patching data.
<!-- textlint-disable -->
- **Virtual Patching Pre-Authorization** – Virtual Patches need to be implemented quickly so the normal governance processes and authorizations steps for standard software patches need to be expedited. Since virtual patches are not actually modifying source code, they do not require the same amount of regression testing as normal software patches. Categorizing virtual patches in the same group as Anti-Virus updates or Network IDS signatures helps to speed up the authorization process and minimize extended testing phases.
<!-- textlint-enable -->
- **Deploy Virtual Patching Tool In Advance** - As time is critical during incident response, it would be a poor time to have to get approvals to install new software. For instance, you can install ModSecurity WAF in embedded mode on your Apache servers, or an Apache reverse proxy server. The advantage with this deployment is that you can create fixes for non-Apache back-end servers. Even if you do not use ModSecurity under normal circumstances, it is best to have it "on deck" ready to be enabled if need be.
- **Increase HTTP Audit Logging** – The standard Common Log Format (CLF) utilized by most web servers does not provide adequate data for conducting proper incident response. You need to have access to the following HTTP data:
    - Request URI (including QUERY_STRING)
    - Full Request Headers (including Cookies)
    - Full Request Body (POST payload)
    - Full Response Headers
    - Full Response Body

## Identification Phase

The Identification Phase occurs when an organization becomes aware of a vulnerability within their web application. There are generally two different methods of identifying vulnerabilities: `Proactive` and `Reactive`.

### Proactive Identification

This occurs when an organization takes it upon themselves to assess their web security posture and conducts the following tasks:

- **Dynamic Application Assessments** - Ethical attackers conduct penetration tests or automated web assessment tools are run against the live web application to identify flaws.
- **Source code reviews** - Ethical attackers use manual/automated means to analyze the source code of the web application to identify flaws.

Due to the fact that custom coded web applications are unique, these proactive identification tasks are extremely important as you are not able to rely upon third-party vulnerability notifications.

### Reactive Identification

There are three main reactive methods for identifying vulnerabilities:

- **Vendor contact (e.g. pre-warning)** - Occurs when a vendor discloses a vulnerability for commercial web application software that you are using. Example is Microsoft's [Active Protections Program (MAPP)](https://www.microsoft.com/en-us/msrc/mapp)
- **Public disclosure** - Public vulnerability disclosure for commercial/open source web application software that you are using. The threat level for public disclosure is increased as more people know about the vulnerability.
- **Security incident** – This is the most urgent situation as the attack is active. In these situations, remediation must be immediate.

## Analysis Phase

Here are the recommended steps to start the analysis phase:

1. **Determine Virtual Patching Applicability** - Virtual patching is ideally suited for injection-type flaws but may not provide an adequate level of attack surface reduction for other attack types or categories. Thorough analysis of the underlying flaw should be conducted to determine if the virtual patching tool has adequate detection logic capabilities.
2. **Utilize Bug Tracking/Ticketing System** - Enter the vulnerability information into a bug tracking system for tracking purposes and metrics. Recommend you use ticketing systems you already use such as Jira or you may use a specialized tool such as [ThreadFix](https://threadfix.it/).
3. **Verify the name of the vulnerability** - This means that you need to have the proper public vulnerability identifier (such as CVE name/number) specified by the vulnerability announcement, vulnerability scan, etc. If the vulnerability is identified proactively rather than through public announcements, then you should assign your own unique identifier to each vulnerability.
4. **Designate the impact level** - It is always important to understand the level of criticality involved with a web vulnerability. Information leakages may not be treated in the same manner as an SQL Injection issue.
5. **Specify which versions of software are impacted** - You need to identify what versions of software are listed so that you can determine if the version(s) you have installed are affected.
6. **List what configuration is required to trigger the problem** - Some vulnerabilities may only manifest themselves under certain configuration settings.
7. **List Proof of Concept (PoC) exploit code or payloads used during attacks/testing** - Many vulnerability announcements have accompanying exploit code that shows how to demonstrate the vulnerability. If this data is available, make sure to download it for analysis. This will be useful later on when both developing and testing the virtual patch.

## Virtual Patch Creation Phase

The process of creating an accurate virtual patch is bound by two main tenants:

1. **No false positives** - Do not ever block legitimate traffic under any circumstances.
2. **No false negatives** - Do not ever miss attacks, even when the attacker intentionally tries to evade detection.

Care should be taken to attempt to minimize either of these two rules. It may not be possible to adhere 100% to each of these goals but remember that virtual patching is about **Risk Reduction**. It should be understood by business owners that while you are gaining the advantage of shortening the Time-to-Fix metric, you may not be implementing a complete fix for the flaw.

### Manual Virtual Patch Creation

#### Positive Security (Allow List) Virtual Patches (**Recommended Solution**)

Positive security model (allowlist) is a comprehensive security mechanism that provides an independent input validation envelope to an application. The model specifies the characteristics of valid input (character set, length, etc…) and denies anything that does not conform. By defining rules for every parameter in every page in the application the application is protected by an additional security envelop independent from its code.

##### Example Allow List ModSecurity Virtual Patch

In order to create an allow-list virtual patch, you must be able to verify what the normal, expected input values are. If you have implemented proper audit logging as part of the Preparation Phase, then you should be able to review audit logs to identify the format of expected input types. In this case, the `reqID` parameter is supposed to only hold integer characters so we can use this virtual patch:

```text
##
## Verify we only receive 1 parameter called "reqID"
##
SecRule REQUEST_URI "@contains /wp-content/plugins/levelfourstorefront/scripts/administration/exportsubscribers.php" "chain,id:1,phase:2,t:none,t:Utf8toUnicode,t:urlDecodeUni,t:normalizePathWin,t:lowercase,block,msg:'Input Validation Error for \'reqID\' parameter - Duplicate Parameters Names Seen.',logdata:'%{matched_var}'"
  SecRule &ARGS:/reqID/ "!@eq 1"

##
## Verify reqID's payload only contains integers
##
SecRule REQUEST_URI "@contains /wp-content/plugins/levelfourstorefront/scripts/administration/exportsubscribers.php" "chain,id:2,phase:2,t:none,t:Utf8toUnicode,t:urlDecodeUni,t:normalizePathWin,t:lowercase,block,msg:'Input Validation Error for \'reqID\' parameter.',logdata:'%{args.reqid}'"
  SecRule ARGS:/reqID/ "!@rx ^[0-9]+$"
```

This virtual patch will inspect the `reqID` parameter value on the specified page and prevent any characters other than integers as input.

- **Note** - You should make sure to assign rule IDs properly and track them in the bug tracking system.
- **Caution**: There are numerous evasion vectors when creating virtual patches. Please consult the [OWASP Best Practices: Virtual Patching document](https://owasp.org/www-community/Virtual_Patching_Best_Practices) for a more thorough discussion on countering evasion methods.

#### Negative Security (Block List) Virtual Patches

A negative security model (denylist) is based on a set of rules that detect specific known attacks rather than allow only valid traffic.

##### Example Block List ModSecurity Virtual Patch

Here is the example [PoC code](https://packetstormsecurity.com/files/119217/WordPress-Shopping-Cart-8.1.14-Shell-Upload-SQL-Injection.html) that was supplied by the public advisory:

```text
http://localhost/wordpress/wp-content/plugins/levelfourstorefront/scripts/administration/exportsubscribers.php?reqID=1' or 1='1
```

Looking at the payload, we can see that the attacker is inserting a single quote character and then adding additional SQL query logic to the end. Based on this data, we could disallow the single quote character like this:

```text
SecRule REQUEST_URI "@contains /wp-content/plugins/levelfourstorefront/scripts/administration/exportsubscribers.php" "chain,id:1,phase:2,t:none,t:Utf8toUnicode,t:urlDecodeUni,t:normalizePathWin,t:lowercase,block,msg:'Input Validation Error for \'reqID\' parameter.',logdata:'%{args.reqid}'"
  SecRule ARGS:/reqID/ "@pm '"
```

#### Which Method is Better for Virtual Patching – Positive or Negative Security

A virtual patch may employ either a positive or negative security model. Which one you decide to use depends on the situation and a few different considerations. For example, negative security rules can usually be implemented more quickly, however the possible evasions are more likely.

Positive security rules, only the other hand, provides better protection however it is often a manual process and thus is not scalable and difficult to maintain for large/dynamic sites. While manual positive security rules for an entire site may not be feasible, a positive security model can be selectively employed when a vulnerability alert identifies a specific location with a problem.

#### Beware of Exploit-Specific Virtual Patches

You want to resist the urge to take the easy road and quickly create an **exploit-specific virtual patch**.

For instance, if an authorized penetration test identified an XSS vulnerability on a page and used the following attack payload in the report:

```html
<script>
  alert('XSS Test')
</script>
```

It would not be wise to implement a virtual patch that simply blocks that exact payload. While it may provide some immediate protection, its long term value is significantly decreased.

### Automated Virtual Patch Creation

Manual patch creation may become unfeasible as the number of vulnerabilities grow and automated means may become necessary. If the vulnerabilities were identified using automated tools and an XML report is available, it is possible to leverage automated processes to auto-convert this vulnerability data into virtual patches for protection systems.

Three examples include:

- **OWASP ModSecurity Core Rule Set (CRS) Scripts** - The OWASP CRS includes scripts to auto-convert XML output from tools such as [ZAP into ModSecurity Virtual Patches]. Reference [here](https://www.trustwave.com/en-us/resources/blogs/spiderlabs-blog/modsecurity-advanced-topic-of-the-week-automated-virtual-patching-using-owasp-zed-attack-proxy).
- **ThreadFix Virtual Patching** - ThreadFix also includes automated processes of converting imported vulnerability XML data into virtual patches for security tools such as ModSecurity. Reference [here](https://github.com/denimgroup/threadfix/wiki/Waf-Types#mod_security).
- **Direct Importing to WAF Device** - Many commercial WAF products have the capability to import DAST tool XML report data and automatically adjust their protection profiles.

## Implementation/Testing Phase

In order to accurately test out the newly created virtual patches, it may be necessary to use an application other than a web browser. Some useful tools are:

- Web browser.
- Command-line web clients such as Curl and Wget.
- Local Proxy Servers such as [ZAP](https://www.zaproxy.org/).
- [ModSecurity AuditViewer](https://web.archive.org/web/20181011065823/http://www.jwall.org/web/audit/viewer.jsp) – which allows you to load a ModSecurity audit log file, manipulate it and then re-inject the data back into any web server.

### Testing Steps

- Implement virtual patches initially in a "Log Only" configuration to ensure that you do not block any normal user traffic (false positives).
- If the vulnerability was identified by a specific tool or assessment team - request a retest.
- If retesting fails due to evasions, then you must go back to the Analysis phase to identify how to better fix the issue.

## Recovery/Follow-Up Phase

- **Update Data in Ticket System** - Although you may need to expedite the implementation of virtual patches, you should still track them in your normal Patch Management processes. This means that you should create proper change request tickets, etc… so that their existence and functionality is documented. Updating the ticket system also helps to identify "time-to-fix" metrics for different vulnerability types. Make sure to properly log the virtual patch rule ID values.
- **Periodic Re-assessments** - You should also have periodic re-assessments to verify if/when you can remove previous virtual patches if the web application code has been updated with the real source code fix. I have found that many people opt to keep virtual patches in place due to better identification/logging vs. application or db capabilities.
- **Running Virtual Patch Alert Reports** - Run reports to identify if/when any of your virtual patches have triggered. This will show value for virtual patching in relation to windows of exposure for source code time-to-fix.

</section>

<section id="virtual-patching-translation-panel" className="tabPanel translationPanel contentPanel">

## はじめに

このチートシートの目的は、組織が緩和保護策を迅速に実装する可能性を最大化するために従うことができる、簡潔な仮想パッチ適用フレームワークを提示することです。

## 定義: 仮想パッチ適用

**既知の脆弱性に対する悪用試行を防止し、報告するセキュリティポリシー強制層。**

仮想パッチは、セキュリティ強制層がトランザクションを分析し、転送中の攻撃を遮断することで機能します。そのため、悪意のあるトラフィックは Web アプリケーションに到達しません。仮想パッチ適用の結果として、アプリケーション自体の実際のソースコードは変更されていなくても、悪用試行は成功しません。

## なぜコードを修正するだけではないのか

純粋に技術的な観点では、最優先の修復戦略は、組織が Web アプリケーションのソースコード内で識別された脆弱性を修正することです。この考え方は、Web アプリケーションセキュリティ専門家とシステム所有者の双方に普遍的に同意されています。残念ながら、現実のビジネス状況では、Web アプリケーションのソースコード更新が容易ではないシナリオが多く発生します。たとえば次のようなものです。

- **リソース不足** - 開発者がすでに他のプロジェクトに割り当てられている。
- **サードパーティソフトウェア** - ユーザーがコードを変更できない。
- **外部委託されたアプリケーション開発** - 変更には新しいプロジェクトが必要になる。

重要な点は次のとおりです。**コードレベルの修正と仮想パッチ適用は相互に排他的ではありません**。これらは異なるチーム、つまり OWASP Builders/Devs と OWASP Defenders/OpSec によって実行されるプロセスであり、並行して進めることができます。

## 仮想パッチ適用の価値

仮想パッチ適用には、主に二つの目標があります。

- **修正までの時間の最小化** - アプリケーションソースコードの修正には時間がかかります。仮想パッチの主な目的は、識別された脆弱性に対する緩和策をできるだけ早く実装することです。この対応の緊急度は、脆弱性がコードレビューや侵入テストによって社内で識別された場合と、ライブのインシデント対応の一部として脆弱性が見つかった場合などで異なる可能性があります。
- **攻撃対象領域の削減** - 攻撃ベクトルを最小化することに重点を置きます。正のセキュリティ入力検証が欠落している場合など、一部のケースでは 100% の攻撃対象領域削減を達成できます。XSS 欠陥に対する出力エンコーディングの欠落など、他のケースでは露出を制限することしかできない場合があります。覚えておくべきことは、48 時間後に 100% 削減するよりも、10 分で 50% 削減する方がよいということです。

## 仮想パッチ適用ツール

上記の定義では特定のツールを挙げていないことに注意してください。仮想パッチ適用の取り組みに使用できる選択肢は複数あります。

- WAF や IPS アプライアンスなどの中間デバイス。
- ModSecurity などの Web サーバプラグイン。
- ESAPI WAF などのアプリケーション層フィルタ。

例示の目的で、ここではオープンソースの [ModSecurity WAF tool](http://www.modsecurity.org) を使用した仮想パッチ適用の例を示します。

## 仮想パッチ適用の方法論

仮想パッチ適用は、ほとんどの他のセキュリティプロセスと同様に、場当たり的に取り組むべきものではありません。成功の可能性を最大化するために、一貫した反復可能なプロセスに従うべきです。次の仮想パッチ適用ワークフローは、IT インシデント対応を実施するための業界で受け入れられている実務を模倣しており、次のフェーズで構成されます。

1. 準備。
2. 識別。
3. 分析。
4. 仮想パッチ作成。
5. 実装/テスト。
6. 復旧/フォローアップ。

## 公開脆弱性の例

この記事の残りの部分では、次の [SQL Injection vulnerability](https://packetstormsecurity.com/files/119217/WordPress-Shopping-Cart-8.1.14-Shell-Upload-SQL-Injection.html) を例として扱います。

```text
WordPress Shopping Cart Plugin for WordPress
/wp-content/plugins/levelfourstorefront/scripts/administration/exportsubscribers.php
reqID Parameter prone to SQL Injection.
```

**説明**:

WordPress Shopping Cart Plugin for WordPress には、攻撃者が SQL インジェクション攻撃を実行できる可能性のある欠陥が含まれています。

この問題は、`/wp-content/plugins/levelfourstorefront/scripts/administration/exportsubscribers.php` スクリプトが、`reqID` パラメータに対するユーザー提供入力を適切にサニタイズしていないことに起因します。

これにより、攻撃者がバックエンドデータベースで SQL クエリを注入または操作し、任意のデータを操作または開示できる可能性があります。

## 準備フェーズ

仮想パッチ適用に関して、準備フェーズを適切に活用する重要性はいくら強調してもしすぎることはありません。識別された脆弱性に実際に対処しなければならなくなる前、あるいはさらに悪いことに、進行中の Web アプリケーション侵害に対応する前に、仮想パッチ適用のプロセスとフレームワークを整備するために、多くのことを行う必要があります。要点は、実際の侵害の最中は、Web アプリケーションファイアウォールの導入や仮想パッチという概念を提案する理想的なタイミングではないということです。実際のインシデント中は緊張が高く、時間が重要です。そのため、平常時に仮想パッチ適用の基盤を築き、インシデント発生時にすぐ使える状態にしておきます。

準備フェーズで対処すべき重要な項目をいくつか示します。

- **公開/ベンダー脆弱性の監視** - 使用している商用ソフトウェアについて、すべてのベンダーアラートメーリングリストに登録していることを確認します。これにより、ベンダーが脆弱性情報やパッチ情報を公開した場合に通知を受けられます。
- **仮想パッチ適用の事前承認** - 仮想パッチは迅速に実装する必要があるため、標準的なソフトウェアパッチに対する通常のガバナンスプロセスと承認手順は迅速化する必要があります。仮想パッチは実際にはソースコードを変更しないため、通常のソフトウェアパッチと同じ量の回帰テストを必要としません。仮想パッチをアンチウイルス更新やネットワーク IDS シグネチャと同じグループに分類すると、承認プロセスを速め、長期化するテストフェーズを最小化するのに役立ちます。
- **仮想パッチ適用ツールの事前配備** - インシデント対応中は時間が重要であるため、新しいソフトウェアをインストールする承認を得なければならない状況は望ましくありません。たとえば、Apache サーバ上の組み込みモード、または Apache リバースプロキシサーバに ModSecurity WAF をインストールできます。この配備の利点は、Apache 以外のバックエンドサーバに対する修正も作成できることです。通常時に ModSecurity を使用していない場合でも、必要に応じて有効化できるよう「控え」として準備しておくことが最善です。
- **HTTP 監査ログの増強** - ほとんどの Web サーバで使用される標準の Common Log Format (CLF) は、適切なインシデント対応を実施するための十分なデータを提供しません。次の HTTP データにアクセスできる必要があります。
    - リクエスト URI (QUERY_STRING を含む)
    - 完全なリクエストヘッダー (Cookie を含む)
    - 完全なリクエストボディ (POST ペイロード)
    - 完全なレスポンスヘッダー
    - 完全なレスポンスボディ

## 識別フェーズ

識別フェーズは、組織が Web アプリケーション内の脆弱性を認識したときに発生します。脆弱性を識別する方法は一般に二つあり、`Proactive` と `Reactive` です。

### プロアクティブな識別

これは、組織が自ら Web セキュリティ態勢を評価し、次のタスクを実施するときに発生します。

- **動的アプリケーション評価** - 倫理的な攻撃者が侵入テストを実施する、または自動 Web 評価ツールを稼働中の Web アプリケーションに対して実行し、欠陥を識別します。
- **ソースコードレビュー** - 倫理的な攻撃者が手動または自動の手段を用いて Web アプリケーションのソースコードを分析し、欠陥を識別します。

カスタムコードの Web アプリケーションは固有であるため、これらのプロアクティブな識別タスクは非常に重要です。サードパーティの脆弱性通知に依存できないためです。

### リアクティブな識別

脆弱性を識別する主なリアクティブ手法は三つあります。

- **ベンダー連絡 (例: 事前警告)** - 使用している商用 Web アプリケーションソフトウェアについて、ベンダーが脆弱性を開示する場合に発生します。例として Microsoft の [Active Protections Program (MAPP)](https://www.microsoft.com/en-us/msrc/mapp) があります。
- **公開開示** - 使用している商用またはオープンソースの Web アプリケーションソフトウェアに関する公開脆弱性開示です。公開開示では、その脆弱性を知る人が増えるため脅威レベルが高まります。
- **セキュリティインシデント** - 攻撃が進行中であるため、これは最も緊急度の高い状況です。このような状況では、修復は即時でなければなりません。

## 分析フェーズ

分析フェーズを開始するための推奨手順は次のとおりです。

1. **仮想パッチ適用可能性を判断する** - 仮想パッチ適用はインジェクション型の欠陥に理想的に適していますが、他の攻撃タイプやカテゴリでは十分な攻撃対象領域削減を提供できない可能性があります。仮想パッチ適用ツールが十分な検出ロジック能力を持つかどうかを判断するために、根本的な欠陥を徹底的に分析すべきです。
2. **バグ追跡/チケットシステムを利用する** - 追跡とメトリクスの目的で、脆弱性情報をバグ追跡システムに入力します。Jira など、すでに使用しているチケットシステムの利用を推奨します。または [ThreadFix](https://threadfix.it/) などの専用ツールを使用できます。
3. **脆弱性名を検証する** - これは、脆弱性告知や脆弱性スキャンなどで指定された、適切な公開脆弱性識別子、たとえば CVE 名/番号を持つ必要があるという意味です。脆弱性が公開告知ではなくプロアクティブに識別された場合は、各脆弱性に独自の一意な識別子を割り当てるべきです。
4. **影響レベルを指定する** - Web 脆弱性に関わる重大度のレベルを理解することは常に重要です。情報漏えいは、SQL インジェクション問題と同じ方法で扱われない場合があります。
5. **影響を受けるソフトウェアバージョンを指定する** - インストール済みのバージョンが影響を受けるかどうかを判断できるよう、どのソフトウェアバージョンが記載されているかを識別する必要があります。
6. **問題を引き起こすために必要な設定を列挙する** - 一部の脆弱性は、特定の設定条件下でのみ顕在化する場合があります。
7. **攻撃/テスト中に使用された概念実証 (PoC) エクスプロイトコードまたはペイロードを列挙する** - 多くの脆弱性告知には、脆弱性を実証する方法を示すエクスプロイトコードが付属しています。このデータが利用可能な場合は、分析のために必ずダウンロードしてください。これは後で仮想パッチを開発およびテストする際に役立ちます。

## 仮想パッチ作成フェーズ

正確な仮想パッチを作成するプロセスは、主に二つの基本原則に制約されます。

1. **誤検知なし** - いかなる状況でも正当なトラフィックをブロックしてはなりません。
2. **検知漏れなし** - 攻撃者が意図的に検出回避を試みる場合でも、攻撃を見逃してはなりません。

これら二つのルールのいずれかを最小化しようとする際には注意が必要です。これらの目標のそれぞれに 100% 従うことは不可能かもしれませんが、仮想パッチ適用は**リスク低減**に関するものであることを覚えておいてください。ビジネス所有者は、修正までの時間というメトリクスを短縮する利点を得る一方で、その欠陥に対する完全な修正を実装しているわけではない可能性があることを理解すべきです。

### 手動による仮想パッチ作成

#### 正のセキュリティ (許可リスト) 仮想パッチ (**推奨ソリューション**)

正のセキュリティモデル (allowlist) は、アプリケーションに独立した入力検証の包囲を提供する包括的なセキュリティメカニズムです。このモデルは、有効な入力の特性、たとえば文字セットや長さなどを指定し、それに適合しないものを拒否します。アプリケーション内のすべてのページのすべてのパラメータに対してルールを定義することで、アプリケーションはそのコードから独立した追加のセキュリティ包囲によって保護されます。

##### 許可リスト ModSecurity 仮想パッチの例

許可リスト仮想パッチを作成するには、正常で期待される入力値が何であるかを検証できなければなりません。準備フェーズの一部として適切な監査ログを実装している場合は、監査ログをレビューして期待される入力型の形式を識別できるはずです。このケースでは、`reqID` パラメータは整数文字のみを保持する想定であるため、次の仮想パッチを使用できます。

```text
##
## Verify we only receive 1 parameter called "reqID"
##
SecRule REQUEST_URI "@contains /wp-content/plugins/levelfourstorefront/scripts/administration/exportsubscribers.php" "chain,id:1,phase:2,t:none,t:Utf8toUnicode,t:urlDecodeUni,t:normalizePathWin,t:lowercase,block,msg:'Input Validation Error for \'reqID\' parameter - Duplicate Parameters Names Seen.',logdata:'%{matched_var}'"
  SecRule &ARGS:/reqID/ "!@eq 1"

##
## Verify reqID's payload only contains integers
##
SecRule REQUEST_URI "@contains /wp-content/plugins/levelfourstorefront/scripts/administration/exportsubscribers.php" "chain,id:2,phase:2,t:none,t:Utf8toUnicode,t:urlDecodeUni,t:normalizePathWin,t:lowercase,block,msg:'Input Validation Error for \'reqID\' parameter.',logdata:'%{args.reqid}'"
  SecRule ARGS:/reqID/ "!@rx ^[0-9]+$"
```

この仮想パッチは、指定されたページの `reqID` パラメータ値を検査し、整数以外の文字が入力されることを防ぎます。

- **注記** - ルール ID を適切に割り当て、バグ追跡システムで追跡するようにしてください。
- **注意**: 仮想パッチを作成する際には、多数の検出回避ベクトルがあります。検出回避手法への対抗策に関するより詳細な議論については、[OWASP Best Practices: Virtual Patching document](https://owasp.org/www-community/Virtual_Patching_Best_Practices) を参照してください。

#### 負のセキュリティ (ブロックリスト) 仮想パッチ

負のセキュリティモデル (denylist) は、有効なトラフィックのみを許可するのではなく、特定の既知の攻撃を検出するルールセットに基づいています。

##### ブロックリスト ModSecurity 仮想パッチの例

公開アドバイザリで提供された [PoC code](https://packetstormsecurity.com/files/119217/WordPress-Shopping-Cart-8.1.14-Shell-Upload-SQL-Injection.html) の例を次に示します。

```text
http://localhost/wordpress/wp-content/plugins/levelfourstorefront/scripts/administration/exportsubscribers.php?reqID=1' or 1='1
```

ペイロードを見ると、攻撃者が単一引用符文字を挿入し、その末尾に追加の SQL クエリロジックを加えていることが分かります。このデータに基づき、次のように単一引用符文字を許可しないようにできます。

```text
SecRule REQUEST_URI "@contains /wp-content/plugins/levelfourstorefront/scripts/administration/exportsubscribers.php" "chain,id:1,phase:2,t:none,t:Utf8toUnicode,t:urlDecodeUni,t:normalizePathWin,t:lowercase,block,msg:'Input Validation Error for \'reqID\' parameter.',logdata:'%{args.reqid}'"
  SecRule ARGS:/reqID/ "@pm '"
```

#### 仮想パッチにはどちらの方法がよいか - 正のセキュリティか負のセキュリティか

仮想パッチは、正のセキュリティモデルまたは負のセキュリティモデルのいずれかを採用できます。どちらを使用するかは、状況といくつかの考慮事項によって異なります。たとえば、負のセキュリティルールは通常、より迅速に実装できますが、回避される可能性が高くなります。

一方、正のセキュリティルールはよりよい保護を提供しますが、多くの場合は手動プロセスであるため、大規模または動的なサイトでは拡張性がなく、保守が困難です。サイト全体に手動の正のセキュリティルールを適用することは現実的でない場合がありますが、脆弱性アラートが問題のある特定の場所を識別した場合には、正のセキュリティモデルを選択的に採用できます。

#### エクスプロイト固有の仮想パッチに注意する

安易な道を選び、すばやく**エクスプロイト固有の仮想パッチ**を作成したくなる衝動には抵抗すべきです。

たとえば、承認済みの侵入テストでページ上の XSS 脆弱性が識別され、レポートで次の攻撃ペイロードが使用されたとします。

```html
<script>
  alert('XSS Test')
</script>
```

その正確なペイロードだけをブロックする仮想パッチを実装することは賢明ではありません。即時の保護をある程度提供する可能性はありますが、長期的な価値は大きく低下します。

### 自動化された仮想パッチ作成

脆弱性の数が増えるにつれて、手動でのパッチ作成は実行不可能になる場合があり、自動化された手段が必要になることがあります。脆弱性が自動ツールを使用して識別され、XML レポートが利用可能な場合、この脆弱性データを保護システム用の仮想パッチに自動変換する自動プロセスを活用できます。

三つの例を示します。

- **OWASP ModSecurity Core Rule Set (CRS) Scripts** - OWASP CRS には、[ZAP into ModSecurity Virtual Patches] などのツールからの XML 出力を自動変換するスクリプトが含まれています。参考は [here](https://www.trustwave.com/en-us/resources/blogs/spiderlabs-blog/modsecurity-advanced-topic-of-the-week-automated-virtual-patching-using-owasp-zed-attack-proxy) です。
- **ThreadFix Virtual Patching** - ThreadFix にも、インポートされた脆弱性 XML データを ModSecurity などのセキュリティツール用の仮想パッチに変換する自動プロセスが含まれています。参考は [here](https://github.com/denimgroup/threadfix/wiki/Waf-Types#mod_security) です。
- **WAF デバイスへの直接インポート** - 多くの商用 WAF 製品には、DAST ツールの XML レポートデータをインポートし、その保護プロファイルを自動的に調整する機能があります。

## 実装/テストフェーズ

新しく作成した仮想パッチを正確にテストするには、Web ブラウザ以外のアプリケーションを使用する必要がある場合があります。有用なツールには次のものがあります。

- Web ブラウザ。
- Curl や Wget などのコマンドライン Web クライアント。
- [ZAP](https://www.zaproxy.org/) などのローカルプロキシサーバ。
- [ModSecurity AuditViewer](https://web.archive.org/web/20181011065823/http://www.jwall.org/web/audit/viewer.jsp) - ModSecurity 監査ログファイルを読み込み、操作し、そのデータを任意の Web サーバに再注入できるツール。

### テスト手順

- 正常なユーザートラフィックをブロックしないこと、つまり誤検知がないことを確認するため、最初は仮想パッチを "Log Only" 設定で実装します。
- 脆弱性が特定のツールまたは評価チームによって識別された場合は、再テストを依頼します。
- 検出回避により再テストが失敗した場合は、問題をより適切に修正する方法を識別するため、分析フェーズに戻らなければなりません。

## 復旧/フォローアップフェーズ

- **チケットシステム内のデータ更新** - 仮想パッチの実装を迅速化する必要がある場合でも、通常のパッチ管理プロセス内でそれらを追跡すべきです。つまり、その存在と機能が文書化されるように、適切な変更要求チケットなどを作成すべきです。チケットシステムの更新は、さまざまな脆弱性タイプに対する「修正までの時間」メトリクスを識別するのにも役立ちます。仮想パッチのルール ID 値を適切に記録するようにしてください。
- **定期的な再評価** - Web アプリケーションコードが実際のソースコード修正で更新された場合に、以前の仮想パッチを削除できるかどうか、またはいつ削除できるかを確認するため、定期的な再評価も行うべきです。多くの人が、アプリケーションやデータベースの機能よりも識別/ログ記録が優れているという理由で、仮想パッチを維持することを選ぶことがあります。
- **仮想パッチアラートレポートの実行** - 仮想パッチがトリガーされたかどうか、またはいつトリガーされたかを識別するためにレポートを実行します。これにより、ソースコード修正までの露出期間との関係で、仮想パッチ適用の価値を示せます。

</section>

<section id="virtual-patching-bilingual-panel" className="tabPanel bilingualPanel">

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Introduction

The goal with this cheat Sheet is to present a concise virtual patching framework that organizations can follow to maximize the timely implementation of mitigation protections.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## はじめに

このチートシートの目的は、組織が緩和保護策を迅速に実装する可能性を最大化するために従うことができる、簡潔な仮想パッチ適用フレームワークを提示することです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Definition: Virtual Patching

**A security policy enforcement layer which prevents and reports the exploitation attempt of a known vulnerability.**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 定義: 仮想パッチ適用

**既知の脆弱性に対する悪用試行を防止し、報告するセキュリティポリシー強制層。**

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The virtual patch works when the security enforcement layer analyzes transactions and intercepts attacks in transit, so malicious traffic never reaches the web application. The resulting impact of virtual patching is that, while the actual source code of the application itself has not been modified, the exploitation attempt does not succeed.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

仮想パッチは、セキュリティ強制層がトランザクションを分析し、転送中の攻撃を遮断することで機能します。そのため、悪意のあるトラフィックは Web アプリケーションに到達しません。仮想パッチ適用の結果として、アプリケーション自体の実際のソースコードは変更されていなくても、悪用試行は成功しません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Why Not Just Fix the Code

From a purely technical perspective, the number one remediation strategy would be for an organization to correct the identified vulnerability within the source code of the web application. This concept is universally agreed upon by both web application security experts and system owners. Unfortunately, in real world business situations, there arise many scenarios where updating the source code of a web application is not easy such as:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## なぜコードを修正するだけではないのか

純粋に技術的な観点では、最優先の修復戦略は、組織が Web アプリケーションのソースコード内で識別された脆弱性を修正することです。この考え方は、Web アプリケーションセキュリティ専門家とシステム所有者の双方に普遍的に同意されています。残念ながら、現実のビジネス状況では、Web アプリケーションのソースコード更新が容易ではないシナリオが多く発生します。たとえば次のようなものです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- **Lack of resources** - Devs are already allocated to other projects.
- **Third-party Software** - Code can not be modified by the user.
- **Outsourced App Dev** - Changes would require a new project.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- **リソース不足** - 開発者がすでに他のプロジェクトに割り当てられている。
- **サードパーティソフトウェア** - ユーザーがコードを変更できない。
- **外部委託されたアプリケーション開発** - 変更には新しいプロジェクトが必要になる。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The important point is this - **Code level fixes and Virtual Patching are NOT mutually exclusive**. They are processes that are executed by different team (OWASP Builders/Devs vs. OWASP Defenders/OpSec) and can be run in tandem.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

重要な点は次のとおりです。**コードレベルの修正と仮想パッチ適用は相互に排他的ではありません**。これらは異なるチーム、つまり OWASP Builders/Devs と OWASP Defenders/OpSec によって実行されるプロセスであり、並行して進めることができます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Value of Virtual Patching

The two main goals of Virtual Patching are:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 仮想パッチ適用の価値

仮想パッチ適用には、主に二つの目標があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- **Minimize Time-to-Fix** - Fixing application source code takes time. The main purpose of a virtual patch is to implement a mitigation for the identified vulnerability as soon as possible. The urgency of this response may be different: for example if the vulnerability was identified in-house through code reviews or penetration testing vs. finding a vulnerability as part of live incident response.
- **Attack Surface Reduction** - Focus on minimizing the attack vector. In some cases, such as missing positive security input validation, it is possible to achieve 100% attack surface reduction. In other cases, such with missing output encoding for XSS flaws, you may only be able to limit the exposures. Keep in mind - 50% reduction in 10 minutes is better than 100% reduction in 48 hrs.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- **修正までの時間の最小化** - アプリケーションソースコードの修正には時間がかかります。仮想パッチの主な目的は、識別された脆弱性に対する緩和策をできるだけ早く実装することです。この対応の緊急度は、脆弱性がコードレビューや侵入テストによって社内で識別された場合と、ライブのインシデント対応の一部として脆弱性が見つかった場合などで異なる可能性があります。
- **攻撃対象領域の削減** - 攻撃ベクトルを最小化することに重点を置きます。正のセキュリティ入力検証が欠落している場合など、一部のケースでは 100% の攻撃対象領域削減を達成できます。XSS 欠陥に対する出力エンコーディングの欠落など、他のケースでは露出を制限することしかできない場合があります。覚えておくべきことは、48 時間後に 100% 削減するよりも、10 分で 50% 削減する方がよいということです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Virtual Patching Tools

Notice that the definition above did not list any specific tool as there are a number of different options that may be used for virtual patching efforts such as:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 仮想パッチ適用ツール

上記の定義では特定のツールを挙げていないことに注意してください。仮想パッチ適用の取り組みに使用できる選択肢は複数あります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Intermediary devices such as a WAF or IPS appliance
- Web server plugin such as ModSecurity
- Application layer filter such as ESAPI WAF

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- WAF や IPS アプライアンスなどの中間デバイス。
- ModSecurity などの Web サーバプラグイン。
- ESAPI WAF などのアプリケーション層フィルタ。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

For example purposes, we will show virtual patching examples using the open source [ModSecurity WAF tool](http://www.modsecurity.org).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

例示の目的で、ここではオープンソースの [ModSecurity WAF tool](http://www.modsecurity.org) を使用した仮想パッチ適用の例を示します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## A Virtual Patching Methodology

Virtual Patching, like most other security processes, is not something that should be approached haphazardly. Instead, a consistent, repeatable process should be followed that will provide the best chances of success. The following virtual patching workflow mimics the industry accepted practice for conducting IT Incident Response and consists of the following phases:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 仮想パッチ適用の方法論

仮想パッチ適用は、ほとんどの他のセキュリティプロセスと同様に、場当たり的に取り組むべきものではありません。成功の可能性を最大化するために、一貫した反復可能なプロセスに従うべきです。次の仮想パッチ適用ワークフローは、IT インシデント対応を実施するための業界で受け入れられている実務を模倣しており、次のフェーズで構成されます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

1. Preparation.
2. Identification.
3. Analysis.
4. Virtual Patch Creation.
5. Implementation/Testing.
6. Recovery/Follow Up.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

1. 準備。
2. 識別。
3. 分析。
4. 仮想パッチ作成。
5. 実装/テスト。
6. 復旧/フォローアップ。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Example Public Vulnerability

Let's take the following [SQL Injection vulnerability](https://packetstormsecurity.com/files/119217/WordPress-Shopping-Cart-8.1.14-Shell-Upload-SQL-Injection.html) as our example for the remainder of this article:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 公開脆弱性の例

この記事の残りの部分では、次の [SQL Injection vulnerability](https://packetstormsecurity.com/files/119217/WordPress-Shopping-Cart-8.1.14-Shell-Upload-SQL-Injection.html) を例として扱います。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```text
WordPress Shopping Cart Plugin for WordPress
/wp-content/plugins/levelfourstorefront/scripts/administration/exportsubscribers.php
reqID Parameter prone to SQL Injection.
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Description**:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**説明**:

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

WordPress Shopping Cart Plugin for WordPress contains a flaw that may allow an attacker to carry out an SQL injection attack.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

WordPress Shopping Cart Plugin for WordPress には、攻撃者が SQL インジェクション攻撃を実行できる可能性のある欠陥が含まれています。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The issue is due to the `/wp-content/plugins/levelfourstorefront/scripts/administration/exportsubscribers.php` script not properly sanitizing user-supplied input to the `reqID` parameter.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

この問題は、`/wp-content/plugins/levelfourstorefront/scripts/administration/exportsubscribers.php` スクリプトが、`reqID` パラメータに対するユーザー提供入力を適切にサニタイズしていないことに起因します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

This may allow an attacker to inject or manipulate SQL queries in the back-end database, allowing for the manipulation or disclosure of arbitrary data.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

これにより、攻撃者がバックエンドデータベースで SQL クエリを注入または操作し、任意のデータを操作または開示できる可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Preparation Phase

The importance of properly utilizing the preparation phase with regards to virtual patching cannot be overstated. You need to do a number of things to setup the virtual patching processes and framework **prior** to actually having to deal with an identified vulnerability, or worse yet, react to a live web application intrusion. The point is that during a live compromise is not the ideal time to be proposing installation of a web application firewall and the concept of a virtual patch. Tension is high during real incidents and time is of the essence, so lay the foundation of virtual patching when the waters are calm and get everything in place and ready to go when an incident does occur.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 準備フェーズ

仮想パッチ適用に関して、準備フェーズを適切に活用する重要性はいくら強調してもしすぎることはありません。識別された脆弱性に実際に対処しなければならなくなる前、あるいはさらに悪いことに、進行中の Web アプリケーション侵害に対応する前に、仮想パッチ適用のプロセスとフレームワークを整備するために、多くのことを行う必要があります。要点は、実際の侵害の最中は、Web アプリケーションファイアウォールの導入や仮想パッチという概念を提案する理想的なタイミングではないということです。実際のインシデント中は緊張が高く、時間が重要です。そのため、平常時に仮想パッチ適用の基盤を築き、インシデント発生時にすぐ使える状態にしておきます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Here are a few critical items that should be addressed during the preparation phase:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

準備フェーズで対処すべき重要な項目をいくつか示します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- **Public/Vendor Vulnerability Monitoring** - Ensure that you are signed up for all vendor alert mail-lists for commercial software that you are using. This will ensure that you will be notified in the event that the vendor releases vulnerability information and patching data.
<!-- textlint-disable -->
- **Virtual Patching Pre-Authorization** – Virtual Patches need to be implemented quickly so the normal governance processes and authorizations steps for standard software patches need to be expedited. Since virtual patches are not actually modifying source code, they do not require the same amount of regression testing as normal software patches. Categorizing virtual patches in the same group as Anti-Virus updates or Network IDS signatures helps to speed up the authorization process and minimize extended testing phases.
<!-- textlint-enable -->
- **Deploy Virtual Patching Tool In Advance** - As time is critical during incident response, it would be a poor time to have to get approvals to install new software. For instance, you can install ModSecurity WAF in embedded mode on your Apache servers, or an Apache reverse proxy server. The advantage with this deployment is that you can create fixes for non-Apache back-end servers. Even if you do not use ModSecurity under normal circumstances, it is best to have it "on deck" ready to be enabled if need be.
- **Increase HTTP Audit Logging** – The standard Common Log Format (CLF) utilized by most web servers does not provide adequate data for conducting proper incident response. You need to have access to the following HTTP data:
    - Request URI (including QUERY_STRING)
    - Full Request Headers (including Cookies)
    - Full Request Body (POST payload)
    - Full Response Headers
    - Full Response Body

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- **公開/ベンダー脆弱性の監視** - 使用している商用ソフトウェアについて、すべてのベンダーアラートメーリングリストに登録していることを確認します。これにより、ベンダーが脆弱性情報やパッチ情報を公開した場合に通知を受けられます。
- **仮想パッチ適用の事前承認** - 仮想パッチは迅速に実装する必要があるため、標準的なソフトウェアパッチに対する通常のガバナンスプロセスと承認手順は迅速化する必要があります。仮想パッチは実際にはソースコードを変更しないため、通常のソフトウェアパッチと同じ量の回帰テストを必要としません。仮想パッチをアンチウイルス更新やネットワーク IDS シグネチャと同じグループに分類すると、承認プロセスを速め、長期化するテストフェーズを最小化するのに役立ちます。
- **仮想パッチ適用ツールの事前配備** - インシデント対応中は時間が重要であるため、新しいソフトウェアをインストールする承認を得なければならない状況は望ましくありません。たとえば、Apache サーバ上の組み込みモード、または Apache リバースプロキシサーバに ModSecurity WAF をインストールできます。この配備の利点は、Apache 以外のバックエンドサーバに対する修正も作成できることです。通常時に ModSecurity を使用していない場合でも、必要に応じて有効化できるよう「控え」として準備しておくことが最善です。
- **HTTP 監査ログの増強** - ほとんどの Web サーバで使用される標準の Common Log Format (CLF) は、適切なインシデント対応を実施するための十分なデータを提供しません。次の HTTP データにアクセスできる必要があります。
    - リクエスト URI (QUERY_STRING を含む)
    - 完全なリクエストヘッダー (Cookie を含む)
    - 完全なリクエストボディ (POST ペイロード)
    - 完全なレスポンスヘッダー
    - 完全なレスポンスボディ

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Identification Phase

The Identification Phase occurs when an organization becomes aware of a vulnerability within their web application. There are generally two different methods of identifying vulnerabilities: `Proactive` and `Reactive`.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 識別フェーズ

識別フェーズは、組織が Web アプリケーション内の脆弱性を認識したときに発生します。脆弱性を識別する方法は一般に二つあり、`Proactive` と `Reactive` です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Proactive Identification

This occurs when an organization takes it upon themselves to assess their web security posture and conducts the following tasks:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### プロアクティブな識別

これは、組織が自ら Web セキュリティ態勢を評価し、次のタスクを実施するときに発生します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- **Dynamic Application Assessments** - Ethical attackers conduct penetration tests or automated web assessment tools are run against the live web application to identify flaws.
- **Source code reviews** - Ethical attackers use manual/automated means to analyze the source code of the web application to identify flaws.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- **動的アプリケーション評価** - 倫理的な攻撃者が侵入テストを実施する、または自動 Web 評価ツールを稼働中の Web アプリケーションに対して実行し、欠陥を識別します。
- **ソースコードレビュー** - 倫理的な攻撃者が手動または自動の手段を用いて Web アプリケーションのソースコードを分析し、欠陥を識別します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Due to the fact that custom coded web applications are unique, these proactive identification tasks are extremely important as you are not able to rely upon third-party vulnerability notifications.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

カスタムコードの Web アプリケーションは固有であるため、これらのプロアクティブな識別タスクは非常に重要です。サードパーティの脆弱性通知に依存できないためです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Reactive Identification

There are three main reactive methods for identifying vulnerabilities:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### リアクティブな識別

脆弱性を識別する主なリアクティブ手法は三つあります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- **Vendor contact (e.g. pre-warning)** - Occurs when a vendor discloses a vulnerability for commercial web application software that you are using. Example is Microsoft's [Active Protections Program (MAPP)](https://www.microsoft.com/en-us/msrc/mapp)
- **Public disclosure** - Public vulnerability disclosure for commercial/open source web application software that you are using. The threat level for public disclosure is increased as more people know about the vulnerability.
- **Security incident** – This is the most urgent situation as the attack is active. In these situations, remediation must be immediate.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- **ベンダー連絡 (例: 事前警告)** - 使用している商用 Web アプリケーションソフトウェアについて、ベンダーが脆弱性を開示する場合に発生します。例として Microsoft の [Active Protections Program (MAPP)](https://www.microsoft.com/en-us/msrc/mapp) があります。
- **公開開示** - 使用している商用またはオープンソースの Web アプリケーションソフトウェアに関する公開脆弱性開示です。公開開示では、その脆弱性を知る人が増えるため脅威レベルが高まります。
- **セキュリティインシデント** - 攻撃が進行中であるため、これは最も緊急度の高い状況です。このような状況では、修復は即時でなければなりません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Analysis Phase

Here are the recommended steps to start the analysis phase:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 分析フェーズ

分析フェーズを開始するための推奨手順は次のとおりです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

1. **Determine Virtual Patching Applicability** - Virtual patching is ideally suited for injection-type flaws but may not provide an adequate level of attack surface reduction for other attack types or categories. Thorough analysis of the underlying flaw should be conducted to determine if the virtual patching tool has adequate detection logic capabilities.
2. **Utilize Bug Tracking/Ticketing System** - Enter the vulnerability information into a bug tracking system for tracking purposes and metrics. Recommend you use ticketing systems you already use such as Jira or you may use a specialized tool such as [ThreadFix](https://threadfix.it/).
3. **Verify the name of the vulnerability** - This means that you need to have the proper public vulnerability identifier (such as CVE name/number) specified by the vulnerability announcement, vulnerability scan, etc. If the vulnerability is identified proactively rather than through public announcements, then you should assign your own unique identifier to each vulnerability.
4. **Designate the impact level** - It is always important to understand the level of criticality involved with a web vulnerability. Information leakages may not be treated in the same manner as an SQL Injection issue.
5. **Specify which versions of software are impacted** - You need to identify what versions of software are listed so that you can determine if the version(s) you have installed are affected.
6. **List what configuration is required to trigger the problem** - Some vulnerabilities may only manifest themselves under certain configuration settings.
7. **List Proof of Concept (PoC) exploit code or payloads used during attacks/testing** - Many vulnerability announcements have accompanying exploit code that shows how to demonstrate the vulnerability. If this data is available, make sure to download it for analysis. This will be useful later on when both developing and testing the virtual patch.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

1. **仮想パッチ適用可能性を判断する** - 仮想パッチ適用はインジェクション型の欠陥に理想的に適していますが、他の攻撃タイプやカテゴリでは十分な攻撃対象領域削減を提供できない可能性があります。仮想パッチ適用ツールが十分な検出ロジック能力を持つかどうかを判断するために、根本的な欠陥を徹底的に分析すべきです。
2. **バグ追跡/チケットシステムを利用する** - 追跡とメトリクスの目的で、脆弱性情報をバグ追跡システムに入力します。Jira など、すでに使用しているチケットシステムの利用を推奨します。または [ThreadFix](https://threadfix.it/) などの専用ツールを使用できます。
3. **脆弱性名を検証する** - これは、脆弱性告知や脆弱性スキャンなどで指定された、適切な公開脆弱性識別子、たとえば CVE 名/番号を持つ必要があるという意味です。脆弱性が公開告知ではなくプロアクティブに識別された場合は、各脆弱性に独自の一意な識別子を割り当てるべきです。
4. **影響レベルを指定する** - Web 脆弱性に関わる重大度のレベルを理解することは常に重要です。情報漏えいは、SQL インジェクション問題と同じ方法で扱われない場合があります。
5. **影響を受けるソフトウェアバージョンを指定する** - インストール済みのバージョンが影響を受けるかどうかを判断できるよう、どのソフトウェアバージョンが記載されているかを識別する必要があります。
6. **問題を引き起こすために必要な設定を列挙する** - 一部の脆弱性は、特定の設定条件下でのみ顕在化する場合があります。
7. **攻撃/テスト中に使用された概念実証 (PoC) エクスプロイトコードまたはペイロードを列挙する** - 多くの脆弱性告知には、脆弱性を実証する方法を示すエクスプロイトコードが付属しています。このデータが利用可能な場合は、分析のために必ずダウンロードしてください。これは後で仮想パッチを開発およびテストする際に役立ちます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Virtual Patch Creation Phase

The process of creating an accurate virtual patch is bound by two main tenants:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 仮想パッチ作成フェーズ

正確な仮想パッチを作成するプロセスは、主に二つの基本原則に制約されます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

1. **No false positives** - Do not ever block legitimate traffic under any circumstances.
2. **No false negatives** - Do not ever miss attacks, even when the attacker intentionally tries to evade detection.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

1. **誤検知なし** - いかなる状況でも正当なトラフィックをブロックしてはなりません。
2. **検知漏れなし** - 攻撃者が意図的に検出回避を試みる場合でも、攻撃を見逃してはなりません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Care should be taken to attempt to minimize either of these two rules. It may not be possible to adhere 100% to each of these goals but remember that virtual patching is about **Risk Reduction**. It should be understood by business owners that while you are gaining the advantage of shortening the Time-to-Fix metric, you may not be implementing a complete fix for the flaw.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

これら二つのルールのいずれかを最小化しようとする際には注意が必要です。これらの目標のそれぞれに 100% 従うことは不可能かもしれませんが、仮想パッチ適用は**リスク低減**に関するものであることを覚えておいてください。ビジネス所有者は、修正までの時間というメトリクスを短縮する利点を得る一方で、その欠陥に対する完全な修正を実装しているわけではない可能性があることを理解すべきです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Manual Virtual Patch Creation

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 手動による仮想パッチ作成

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Positive Security (Allow List) Virtual Patches (**Recommended Solution**)

Positive security model (allowlist) is a comprehensive security mechanism that provides an independent input validation envelope to an application. The model specifies the characteristics of valid input (character set, length, etc…) and denies anything that does not conform. By defining rules for every parameter in every page in the application the application is protected by an additional security envelop independent from its code.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 正のセキュリティ (許可リスト) 仮想パッチ (**推奨ソリューション**)

正のセキュリティモデル (allowlist) は、アプリケーションに独立した入力検証の包囲を提供する包括的なセキュリティメカニズムです。このモデルは、有効な入力の特性、たとえば文字セットや長さなどを指定し、それに適合しないものを拒否します。アプリケーション内のすべてのページのすべてのパラメータに対してルールを定義することで、アプリケーションはそのコードから独立した追加のセキュリティ包囲によって保護されます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

##### Example Allow List ModSecurity Virtual Patch

In order to create an allow-list virtual patch, you must be able to verify what the normal, expected input values are. If you have implemented proper audit logging as part of the Preparation Phase, then you should be able to review audit logs to identify the format of expected input types. In this case, the `reqID` parameter is supposed to only hold integer characters so we can use this virtual patch:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

##### 許可リスト ModSecurity 仮想パッチの例

許可リスト仮想パッチを作成するには、正常で期待される入力値が何であるかを検証できなければなりません。準備フェーズの一部として適切な監査ログを実装している場合は、監査ログをレビューして期待される入力型の形式を識別できるはずです。このケースでは、`reqID` パラメータは整数文字のみを保持する想定であるため、次の仮想パッチを使用できます。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```text
##
## Verify we only receive 1 parameter called "reqID"
##
SecRule REQUEST_URI "@contains /wp-content/plugins/levelfourstorefront/scripts/administration/exportsubscribers.php" "chain,id:1,phase:2,t:none,t:Utf8toUnicode,t:urlDecodeUni,t:normalizePathWin,t:lowercase,block,msg:'Input Validation Error for \'reqID\' parameter - Duplicate Parameters Names Seen.',logdata:'%{matched_var}'"
  SecRule &ARGS:/reqID/ "!@eq 1"

##
## Verify reqID's payload only contains integers
##
SecRule REQUEST_URI "@contains /wp-content/plugins/levelfourstorefront/scripts/administration/exportsubscribers.php" "chain,id:2,phase:2,t:none,t:Utf8toUnicode,t:urlDecodeUni,t:normalizePathWin,t:lowercase,block,msg:'Input Validation Error for \'reqID\' parameter.',logdata:'%{args.reqid}'"
  SecRule ARGS:/reqID/ "!@rx ^[0-9]+$"
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

This virtual patch will inspect the `reqID` parameter value on the specified page and prevent any characters other than integers as input.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

この仮想パッチは、指定されたページの `reqID` パラメータ値を検査し、整数以外の文字が入力されることを防ぎます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- **Note** - You should make sure to assign rule IDs properly and track them in the bug tracking system.
- **Caution**: There are numerous evasion vectors when creating virtual patches. Please consult the [OWASP Best Practices: Virtual Patching document](https://owasp.org/www-community/Virtual_Patching_Best_Practices) for a more thorough discussion on countering evasion methods.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- **注記** - ルール ID を適切に割り当て、バグ追跡システムで追跡するようにしてください。
- **注意**: 仮想パッチを作成する際には、多数の検出回避ベクトルがあります。検出回避手法への対抗策に関するより詳細な議論については、[OWASP Best Practices: Virtual Patching document](https://owasp.org/www-community/Virtual_Patching_Best_Practices) を参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Negative Security (Block List) Virtual Patches

A negative security model (denylist) is based on a set of rules that detect specific known attacks rather than allow only valid traffic.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 負のセキュリティ (ブロックリスト) 仮想パッチ

負のセキュリティモデル (denylist) は、有効なトラフィックのみを許可するのではなく、特定の既知の攻撃を検出するルールセットに基づいています。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

##### Example Block List ModSecurity Virtual Patch

Here is the example [PoC code](https://packetstormsecurity.com/files/119217/WordPress-Shopping-Cart-8.1.14-Shell-Upload-SQL-Injection.html) that was supplied by the public advisory:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

##### ブロックリスト ModSecurity 仮想パッチの例

公開アドバイザリで提供された [PoC code](https://packetstormsecurity.com/files/119217/WordPress-Shopping-Cart-8.1.14-Shell-Upload-SQL-Injection.html) の例を次に示します。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```text
http://localhost/wordpress/wp-content/plugins/levelfourstorefront/scripts/administration/exportsubscribers.php?reqID=1' or 1='1
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Looking at the payload, we can see that the attacker is inserting a single quote character and then adding additional SQL query logic to the end. Based on this data, we could disallow the single quote character like this:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

ペイロードを見ると、攻撃者が単一引用符文字を挿入し、その末尾に追加の SQL クエリロジックを加えていることが分かります。このデータに基づき、次のように単一引用符文字を許可しないようにできます。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```text
SecRule REQUEST_URI "@contains /wp-content/plugins/levelfourstorefront/scripts/administration/exportsubscribers.php" "chain,id:1,phase:2,t:none,t:Utf8toUnicode,t:urlDecodeUni,t:normalizePathWin,t:lowercase,block,msg:'Input Validation Error for \'reqID\' parameter.',logdata:'%{args.reqid}'"
  SecRule ARGS:/reqID/ "@pm '"
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Which Method is Better for Virtual Patching – Positive or Negative Security

A virtual patch may employ either a positive or negative security model. Which one you decide to use depends on the situation and a few different considerations. For example, negative security rules can usually be implemented more quickly, however the possible evasions are more likely.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 仮想パッチにはどちらの方法がよいか - 正のセキュリティか負のセキュリティか

仮想パッチは、正のセキュリティモデルまたは負のセキュリティモデルのいずれかを採用できます。どちらを使用するかは、状況といくつかの考慮事項によって異なります。たとえば、負のセキュリティルールは通常、より迅速に実装できますが、回避される可能性が高くなります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Positive security rules, only the other hand, provides better protection however it is often a manual process and thus is not scalable and difficult to maintain for large/dynamic sites. While manual positive security rules for an entire site may not be feasible, a positive security model can be selectively employed when a vulnerability alert identifies a specific location with a problem.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

一方、正のセキュリティルールはよりよい保護を提供しますが、多くの場合は手動プロセスであるため、大規模または動的なサイトでは拡張性がなく、保守が困難です。サイト全体に手動の正のセキュリティルールを適用することは現実的でない場合がありますが、脆弱性アラートが問題のある特定の場所を識別した場合には、正のセキュリティモデルを選択的に採用できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Beware of Exploit-Specific Virtual Patches

You want to resist the urge to take the easy road and quickly create an **exploit-specific virtual patch**.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### エクスプロイト固有の仮想パッチに注意する

安易な道を選び、すばやく**エクスプロイト固有の仮想パッチ**を作成したくなる衝動には抵抗すべきです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

For instance, if an authorized penetration test identified an XSS vulnerability on a page and used the following attack payload in the report:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

たとえば、承認済みの侵入テストでページ上の XSS 脆弱性が識別され、レポートで次の攻撃ペイロードが使用されたとします。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<script>
  alert('XSS Test')
</script>
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

It would not be wise to implement a virtual patch that simply blocks that exact payload. While it may provide some immediate protection, its long term value is significantly decreased.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

その正確なペイロードだけをブロックする仮想パッチを実装することは賢明ではありません。即時の保護をある程度提供する可能性はありますが、長期的な価値は大きく低下します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Automated Virtual Patch Creation

Manual patch creation may become unfeasible as the number of vulnerabilities grow and automated means may become necessary. If the vulnerabilities were identified using automated tools and an XML report is available, it is possible to leverage automated processes to auto-convert this vulnerability data into virtual patches for protection systems.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 自動化された仮想パッチ作成

脆弱性の数が増えるにつれて、手動でのパッチ作成は実行不可能になる場合があり、自動化された手段が必要になることがあります。脆弱性が自動ツールを使用して識別され、XML レポートが利用可能な場合、この脆弱性データを保護システム用の仮想パッチに自動変換する自動プロセスを活用できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Three examples include:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

三つの例を示します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- **OWASP ModSecurity Core Rule Set (CRS) Scripts** - The OWASP CRS includes scripts to auto-convert XML output from tools such as [ZAP into ModSecurity Virtual Patches]. Reference [here](https://www.trustwave.com/en-us/resources/blogs/spiderlabs-blog/modsecurity-advanced-topic-of-the-week-automated-virtual-patching-using-owasp-zed-attack-proxy).
- **ThreadFix Virtual Patching** - ThreadFix also includes automated processes of converting imported vulnerability XML data into virtual patches for security tools such as ModSecurity. Reference [here](https://github.com/denimgroup/threadfix/wiki/Waf-Types#mod_security).
- **Direct Importing to WAF Device** - Many commercial WAF products have the capability to import DAST tool XML report data and automatically adjust their protection profiles.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- **OWASP ModSecurity Core Rule Set (CRS) Scripts** - OWASP CRS には、[ZAP into ModSecurity Virtual Patches] などのツールからの XML 出力を自動変換するスクリプトが含まれています。参考は [here](https://www.trustwave.com/en-us/resources/blogs/spiderlabs-blog/modsecurity-advanced-topic-of-the-week-automated-virtual-patching-using-owasp-zed-attack-proxy) です。
- **ThreadFix Virtual Patching** - ThreadFix にも、インポートされた脆弱性 XML データを ModSecurity などのセキュリティツール用の仮想パッチに変換する自動プロセスが含まれています。参考は [here](https://github.com/denimgroup/threadfix/wiki/Waf-Types#mod_security) です。
- **WAF デバイスへの直接インポート** - 多くの商用 WAF 製品には、DAST ツールの XML レポートデータをインポートし、その保護プロファイルを自動的に調整する機能があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Implementation/Testing Phase

In order to accurately test out the newly created virtual patches, it may be necessary to use an application other than a web browser. Some useful tools are:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 実装/テストフェーズ

新しく作成した仮想パッチを正確にテストするには、Web ブラウザ以外のアプリケーションを使用する必要がある場合があります。有用なツールには次のものがあります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Web browser.
- Command-line web clients such as Curl and Wget.
- Local Proxy Servers such as [ZAP](https://www.zaproxy.org/).
- [ModSecurity AuditViewer](https://web.archive.org/web/20181011065823/http://www.jwall.org/web/audit/viewer.jsp) – which allows you to load a ModSecurity audit log file, manipulate it and then re-inject the data back into any web server.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- Web ブラウザ。
- Curl や Wget などのコマンドライン Web クライアント。
- [ZAP](https://www.zaproxy.org/) などのローカルプロキシサーバ。
- [ModSecurity AuditViewer](https://web.archive.org/web/20181011065823/http://www.jwall.org/web/audit/viewer.jsp) - ModSecurity 監査ログファイルを読み込み、操作し、そのデータを任意の Web サーバに再注入できるツール。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Testing Steps

- Implement virtual patches initially in a "Log Only" configuration to ensure that you do not block any normal user traffic (false positives).
- If the vulnerability was identified by a specific tool or assessment team - request a retest.
- If retesting fails due to evasions, then you must go back to the Analysis phase to identify how to better fix the issue.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### テスト手順

- 正常なユーザートラフィックをブロックしないこと、つまり誤検知がないことを確認するため、最初は仮想パッチを "Log Only" 設定で実装します。
- 脆弱性が特定のツールまたは評価チームによって識別された場合は、再テストを依頼します。
- 検出回避により再テストが失敗した場合は、問題をより適切に修正する方法を識別するため、分析フェーズに戻らなければなりません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Recovery/Follow-Up Phase

- **Update Data in Ticket System** - Although you may need to expedite the implementation of virtual patches, you should still track them in your normal Patch Management processes. This means that you should create proper change request tickets, etc… so that their existence and functionality is documented. Updating the ticket system also helps to identify "time-to-fix" metrics for different vulnerability types. Make sure to properly log the virtual patch rule ID values.
- **Periodic Re-assessments** - You should also have periodic re-assessments to verify if/when you can remove previous virtual patches if the web application code has been updated with the real source code fix. I have found that many people opt to keep virtual patches in place due to better identification/logging vs. application or db capabilities.
- **Running Virtual Patch Alert Reports** - Run reports to identify if/when any of your virtual patches have triggered. This will show value for virtual patching in relation to windows of exposure for source code time-to-fix.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 復旧/フォローアップフェーズ

- **チケットシステム内のデータ更新** - 仮想パッチの実装を迅速化する必要がある場合でも、通常のパッチ管理プロセス内でそれらを追跡すべきです。つまり、その存在と機能が文書化されるように、適切な変更要求チケットなどを作成すべきです。チケットシステムの更新は、さまざまな脆弱性タイプに対する「修正までの時間」メトリクスを識別するのにも役立ちます。仮想パッチのルール ID 値を適切に記録するようにしてください。
- **定期的な再評価** - Web アプリケーションコードが実際のソースコード修正で更新された場合に、以前の仮想パッチを削除できるかどうか、またはいつ削除できるかを確認するため、定期的な再評価も行うべきです。多くの人が、アプリケーションやデータベースの機能よりも識別/ログ記録が優れているという理由で、仮想パッチを維持することを選ぶことがあります。
- **仮想パッチアラートレポートの実行** - 仮想パッチがトリガーされたかどうか、またはいつトリガーされたかを識別するためにレポートを実行します。これにより、ソースコード修正までの露出期間との関係で、仮想パッチ適用の価値を示せます。

</div>
</div>

</section>
</div>

## References

<div className="referenceFooter">

- [OWASP Virtual Patching Best Practices](https://owasp.org/www-community/Virtual_Patching_Best_Practices).
- [OWASP Securing WebGoat with ModSecurity](https://wiki.owasp.org/index.php/Category:OWASP_Securing_WebGoat_using_ModSecurity_Project).

</div>


## Attribution

<div className="attributionFooter">

- Original: Virtual Patching Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Virtual_Patching_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: English original retained for comparison. Japanese translation added. Bilingual display generated from official source and local Japanese translation.
- Retrieved: 2026-05-20

</div>
