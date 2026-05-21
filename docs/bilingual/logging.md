---
title: Logging Cheat Sheet
hide_title: true
---

<div className="docHero" data-category="logging-monitoring">
  <h1>ロギングチートシート</h1>
  <div className="docMeta">
    <span className="docPill">最終更新: 2026-05-20</span>
    <span className="docPill">読了時間: 約 18 分</span>
    <span className="docPill">カテゴリ: OAuth と OIDC</span>
  </div>
</div>

<p className="docLead">ロギングチートシートを、原文・翻訳・対比表示で確認できます。ASVS Index 対応の文脈で、公式原文と日本語訳を確認しやすく整理しています。</p>

<div className="tabbedContent">
  <input className="tabInput" type="radio" name="logging-view" id="logging-original" />
  <input className="tabInput" type="radio" name="logging-view" id="logging-translation" defaultChecked />
  <input className="tabInput" type="radio" name="logging-view" id="logging-bilingual" />

  <div className="contentTabs">
    <label htmlFor="logging-original" title="OWASP 原文">原文</label>
    <label htmlFor="logging-translation" title="日本語訳">翻訳</label>
    <label htmlFor="logging-bilingual" title="原文と翻訳を並べて確認">対比表示</label>
  </div>

<section id="logging-original-panel" className="tabPanel originalPanel contentPanel">

## Introduction

This cheat sheet is focused on providing developers with concentrated guidance on building application logging mechanisms, especially related to security logging.

Many systems enable network device, operating system, web server, mail server and database server logging, but often custom application event logging is missing, disabled or poorly configured. It provides much greater insight than infrastructure logging alone. Web application (e.g. web site or web service) logging is much more than having web server logs enabled (e.g. using Extended Log File Format).

Application logging should be consistent within the application, consistent across an organization's application portfolio and use industry standards where relevant, so the logged event data can be consumed, correlated, analyzed and managed by a wide variety of systems.

## Purpose

Application logging should always be included for security events. Application logs are invaluable data for both security and operational use cases.

### Operational use cases

- General debugging
- Establishing baselines
- Business process monitoring e.g. sales process abandonment, transactions, connections
- Providing information about problems and unusual conditions
- Performance monitoring e.g. data load time, page timeouts
- Other business-specific requirements

### Security use cases

Application logging might also be used to record other types of events too such as:

- Anti-automation monitoring
- Identifying security incidents
- Monitoring policy violations
- Assisting non-repudiation controls (note that the trait non-repudiation is hard to achieve for logs because their trustworthiness is often just based on the logging party being audited properly while mechanisms like digital signatures are hard to utilize here)
- Audit trails e.g. data addition, modification and deletion, data exports
- Compliance monitoring
- Data for subsequent requests for information e.g. data subject access, freedom of information, litigation, police and other regulatory investigations
- Legally sanctioned interception of data e.g. application-layer wire-tapping
- Contributing additional application-specific data for incident investigation which is lacking in other log sources
- Helping defend against vulnerability identification and exploitation through attack detection

Process monitoring, audit, and transaction logs/trails etc. are usually collected for different purposes than security event logging, and this often means they should be kept separate.

The types of events and details collected will tend to be different.

For example a [PCIDSS](https://www.pcisecuritystandards.org/pci_security/) audit log will contain a chronological record of activities to provide an independently verifiable trail that permits reconstruction, review and examination to determine the original sequence of attributable transactions. It is important not to log too much, or too little.

Use knowledge of the intended purposes to guide what, when and how much. The remainder of this cheat sheet primarily discusses security event logging.

## Design, implementation, and testing

### Event data sources

The application itself has access to a wide range of information events that should be used to generate log entries. Thus, the primary event data source is the application code itself.

The application has the most information about the user (e.g. identity, roles, permissions) and the context of the event (target, action, outcomes), and often this data is not available to either infrastructure devices, or even closely-related applications.

Other sources of information about application usage that could also be considered are:

- Client software e.g. actions on desktop software and mobile devices in local logs or using messaging technologies, JavaScript exception handler via AJAX, web browser such as using Content Security Policy (CSP) reporting mechanism
- Embedded instrumentation code
- Network firewalls
- Network and host intrusion detection systems (NIDS and HIDS)
- Closely-related applications e.g. filters built into web server software, web server URL redirects/rewrites to scripted custom error pages and handlers
- Application firewalls e.g. filters, guards, XML gateways, database firewalls, web application firewalls (WAFs)
- Database applications e.g. automatic audit trails, trigger-based actions
- Reputation monitoring services e.g. uptime or malware monitoring
- Other applications e.g. fraud monitoring, CRM
- Operating system e.g. mobile platform

The degree of confidence in the event information has to be considered when including event data from systems in a different trust zone. Data may be missing, modified, forged, replayed and could be malicious – it must always be treated as untrusted data.

Consider how the source can be verified, and how integrity and non-repudiation can be enforced.

### Where to record event data

Applications commonly write event log data to the file system or a database (SQL or NoSQL). Applications installed on desktops and on mobile devices may use local storage and local databases, as well as sending data to remote storage.

Your selected framework may limit the available choices. All types of applications may send event data to remote systems (instead of or as well as more local storage).

This could be a centralized log collection and management system (e.g. SIEM or SEM) or another application elsewhere. Consider whether the application can simply send its event stream, unbuffered, to stdout, for management by the execution environment.

- When using the file system, it is preferable to use a separate partition than those used by the operating system, other application files and user generated content
    - For file-based logs, apply strict permissions concerning which users can access the directories, and the permissions of files within the directories
    - In web applications, the logs should not be exposed in web-accessible locations, and if done so, should have restricted access and be configured with a plain text MIME type (not HTML)
- When using a database, it is preferable to utilize a separate database account that is only used for writing log data and which has very restrictive database, table, function and command permissions
- Use standard formats over secure protocols to record and send event data, or log files, to other systems e.g. Common Log File System (CLFS) or Common Event Format (CEF) over syslog; standard formats facilitate integration with centralised logging services

Consider separate files/tables for extended event information such as error stack traces or a record of HTTP request and response headers and bodies.

### Which events to log

The level and content of security monitoring, alerting, and reporting needs to be set during the requirements and design stage of projects, and should be proportionate to the information security risks. This can then be used to define what should be logged.

There is no one size fits all solution, and a blind checklist approach can lead to unnecessary "alarm fog" that means real problems go undetected.

Where possible, always log:

- Input validation failures e.g. protocol violations, unacceptable encodings, invalid parameter names and values
    - A specific event for failures to validate a value against a discrete and finite list of valid values (e.g. a country from a dropdown). This is a high security event as it can only be attack activity. For example `input_validation_fail[:field,userid]`.
- Output validation failures e.g. database record set mismatch, invalid data encoding
- Authentication successes and failures
   Failed authentication attempts provide critical early indicators of credential‑based attacks such as brute‑force, credential‑stuffing, and password‑spraying. Monitoring repeated failures for the same account, failures from multiple IP addresses, or rapid bursts of login attempts helps detect account takeover attempts before they succeed. This aligns with the cheat sheet’s guidance that “Authentication successes and failures” must always be logged, as these events are essential for identifying security incidents and supporting incident investigation. Refer to OWASP ASVS 7.1.1 for authentication failure logging requirements.
- Authorization (access control) failures
- Session management failures e.g. cookie session identification value modification or suspicious JWT validation failures
- Application errors and system events e.g. syntax and runtime errors, connectivity problems, performance issues, third party service error messages, file system errors, file upload virus detection, configuration changes
- Application and related systems start-ups and shut-downs, and logging initialization (starting, stopping or pausing)
- Use of higher-risk functionality including:
    - User administration actions such as addition or deletion of users, changes to privileges, assigning users to tokens, adding or deleting tokens
    - Use of systems administrative privileges or access by application administrators including all actions by those users
    - Use of default or shared accounts or a "break-glass" account.
    - Access to sensitive data such as payment cardholder data,
    - Encryption activities such as use or rotation of cryptographic keys
    - Creation and deletion of system-level objects
    - Data import and export including screen-based reports
    - Submission and processing of user-generated content - especially file uploads
    - Deserialization failures
    - Network connections and associated failures such as backend TLS failures (including certificate validation failures), or requests with an unexpected HTTP verb
- Legal and other opt-ins e.g. permissions for mobile phone capabilities, terms of use, terms & conditions, personal data usage consent, permission to receive marketing communications
- Suspicious business logic activities such as:
    - Attempts to perform a set actions out of order/bypass flow control
    - Actions which don't make sense in the business context
    - Attempts to exceed limitations for particular actions

Optionally consider if the following events can be logged and whether it is desirable information:

- Sequencing failure
- Excessive use
- Data changes
- Fraud and other criminal activities
- Suspicious, unacceptable, or unexpected behavior
- Modifications to configuration
- Application code file and/or memory changes

### Event attributes

Each log entry needs to include sufficient information for the intended subsequent monitoring and analysis. It could be full content data, but is more likely to be an extract or just summary properties.

The application logs must record "when, where, who and what" for each event.

The properties for these will be different depending on the architecture, class of application and host system/device, but often include the following:

- When
    - Log date and time (international format)
    - Event date and time - the event timestamp may be different to the time of logging e.g. server logging where the client application is hosted on remote device that is only periodically or intermittently online
    - Interaction identifier `Note A`
- Where
    - Application identifier e.g. name and version
    - Application address e.g. cluster/hostname or server IPv4 or IPv6 address and port number, workstation identity, local device identifier
    - Service e.g. name and protocol
    - Geolocation
    - Window/form/page e.g. entry point URL and HTTP method for a web application, dialogue box name
    - Code location e.g. script name, module name
- Who (human or machine user)
    - Source address e.g. user's device/machine identifier, user's IP address, cell/RF tower ID, mobile telephone number
    - User identity (if authenticated or otherwise known) e.g. user database table primary key-value, username, license number
- What
    - Type of event `Note B`
    - Severity of event `Note B` e.g. `&#123;0=emergency, 1=alert, ..., 7=debug&#125;, &#123;fatal, error, warning, info, debug, trace&#125;`
    - Security relevant event flag (if the logs contain non-security event data too)
    - Description

Additionally consider recording:

- Secondary time source (e.g. GPS) event date and time
- Action - original intended purpose of the request e.g. Log in, Refresh session ID, Log out, Update profile
- Object e.g. the affected component or other object (user account, data resource, file) e.g. URL, Session ID, User account, File
- Result status - whether the ACTION aimed at the OBJECT was successful e.g. Success, Fail, Defer
- Reason - why the status above occurred e.g. User not authenticated in database check ..., Incorrect credentials
- HTTP Status Code (web applications only) - the status code returned to the user (often 200 or 301)
- Request HTTP headers or HTTP User Agent (web applications only)
- User type classification e.g. public, authenticated user, CMS user, search engine, authorized penetration tester, uptime monitor (see "Data to exclude" below)
- Analytical confidence in the event detection `Note B` e.g. low, medium, high or a numeric value
- Responses seen by the user and/or taken by the application e.g. status code, custom text messages, session termination, administrator alerts
- Extended details e.g. stack trace, system error messages, debug information, HTTP request body, HTTP response headers and body
- Internal classifications e.g. responsibility, compliance references
- External classifications e.g. NIST Security Content Automation Protocol (SCAP), Mitre Common Attack Pattern Enumeration and Classification (CAPEC)

For more information on these, see the "other" related articles listed at the end, especially the comprehensive article by Anton Chuvakin and Gunnar Peterson.

**Note A:** The "Interaction identifier" is a method of linking all (relevant) events for a single user interaction (e.g. desktop application form submission, web page request, mobile app button click, web service call). The application knows all these events relate to the same interaction, and this should be recorded instead of losing the information and forcing subsequent correlation techniques to re-construct the separate events. For example, a single SOAP request may have multiple input validation failures and they may span a small range of times. As another example, an output validation failure may occur much later than the input submission for a long-running "saga request" submitted by the application to a database server.

**Note B:** Each organisation should ensure it has a consistent, and documented, approach to classification of events (type, confidence, severity), the syntax of descriptions, and field lengths and data types including the format used for dates/times.

### Data to exclude

Never log data unless it is legally sanctioned. For example, intercepting some communications, monitoring employees, and collecting some data without consent may all be illegal.

Never exclude any events from "known" users such as other internal systems, "trusted" third parties, search engine robots, uptime/process and other remote monitoring systems, pen testers, auditors. However, you may want to include a classification flag for each of these in the recorded data.

The following should usually not be recorded directly in the logs, but instead should be removed, masked, sanitized, hashed, or encrypted:

- Application source code
- Session identification values (consider replacing with a hashed value if needed to track session specific events)
- Access tokens
- Sensitive personal data and some forms of personally identifiable information (PII) e.g. health, government identifiers, vulnerable people
- Authentication passwords
- Database connection strings
- Encryption keys and other primary secrets
- Bank account or payment card holder data
- Data of a higher security classification than the logging system is allowed to store
- Commercially-sensitive information
- Information it is illegal to collect in the relevant jurisdictions
- Information a user has opted out of collection, or not consented to e.g. use of do not track, or where consent to collect has expired

Sometimes the following data can also exist, and whilst useful for subsequent investigation, it may also need to be treated in some special manner before the event is recorded:

- File paths
- Database connection strings
- Internal network names and addresses
- Non sensitive personal data (e.g. personal names, telephone numbers, email addresses)

Consider using personal data de-identification techniques such as deletion, scrambling or pseudonymization of direct and indirect identifiers where the individual's identity is not required, or the risk is considered too great.

In some systems, sanitization can be undertaken post log collection, and prior to log display.

### Customizable logging

It may be desirable to be able to alter the level of logging (type of events based on severity or threat level, amount of detail recorded). If this is implemented, ensure that:

- The default level must provide sufficient detail for business needs
- It should not be possible to completely deactivate application logging or logging of events that are necessary for compliance requirements
- Alterations to the level/extent of logging must be intrinsic to the application (e.g. undertaken automatically by the application based on an approved algorithm) or follow change management processes (e.g. changes to configuration data, modification of source code)
- The logging level must be verified periodically

### Event collection

If your development framework supports suitable logging mechanisms, use or build upon that. Otherwise, implement an application-wide log handler which can be called from other modules/components.

Document the interface referencing the organisation-specific event classification and description syntax requirements.

If possible create this log handler as a standard module that can be thoroughly tested, deployed in multiple applications, and added to a list of approved and recommended modules.

- Perform input validation on event data from other trust zones to ensure it is in the correct format (and consider alerting and not logging if there is an input validation failure)
- Perform sanitization on all event data to prevent log injection attacks e.g. carriage return (CR), line feed (LF) and delimiter characters (and optionally to remove sensitive data)
- Encode data correctly for the output (logged) format
- If writing to databases, read, understand, and apply the SQL injection cheat sheet
- Ensure failures in the logging processes/systems do not prevent the application from otherwise running or allow information leakage
- Synchronize time across all servers and devices `Note C`

**Note C:** This is not always possible where the application is running on a device under some other party's control (e.g. on an individual's mobile phone, on a remote customer's workstation which is on another corporate network). In these cases, attempt to measure the time offset, or record a confidence level in the event timestamp.

Where possible, record data in a standard format, or at least ensure it can be exported/broadcast using an industry-standard format.

In some cases, events may be relayed or collected together in intermediate points. In the latter some data may be aggregated or summarized before forwarding on to a central repository and analysis system.

### Verification

Logging functionality and systems must be included in code review, application testing and security verification processes:

- Ensure the logging is working correctly and as specified
- Check that events are being classified consistently and the field names, types and lengths are correctly defined to an agreed standard
- Ensure logging is implemented and enabled during application security, fuzz, penetration, and performance testing
- Test the mechanisms are not susceptible to injection attacks
- Ensure there are no unwanted side-effects when logging occurs
- Check the effect on the logging mechanisms when external network connectivity is lost (if this is usually required)
- Ensure logging cannot be used to deplete system resources, for example by filling up disk space or exceeding database transaction log space, leading to denial of service
- Test the effect on the application of logging failures such as simulated database connectivity loss, lack of file system space, missing write permissions to the file system, and runtime errors in the logging module itself
- Verify access controls on the event log data
- If log data is utilized in any action against users (e.g. blocking access, account lock-out), ensure this cannot be used to cause denial of service (DoS) of other users

### Network architecture

As an example, the diagram below shows a service that provides business functionality to customers. We recommend creating a centralized system for collecting logs. There may be many such services, but all of them must securely collect logs in a centralized system.

Applications of this business service are located in network segments:

- FRONTEND 1 aka DMZ (UI)
- MIDDLEWARE 1 (business application - service core)
- BACKEND 1 (service database)

The service responsible for collecting IT events, including security events, is located in the following segments:

- BACKEND 2 (log storage)
- MIDDLEWARE 3 - 2 applications:
    - log loader application that download log from storage, pre-processes, and transfer to UI
    - log collector that accepts logs from business applications, other infrastructure, cloud applications and saves in log storage
- FRONTEND 2 (UI for viewing business service event logs)
- FRONTEND 3 (applications that receive logs from cloud applications and transfer logs to log collector)
    - It is allowed to combine the functionality of two applications in one

For example, all external requests from users go through the API management service, see application in MIDDLEWARE 2 segment.

![MIDDLEWARE](https://raw.githubusercontent.com/OWASP/CheatSheetSeries/master/assets/Logging_Cheat_Sheet.drawio.png)

As you can see in the image above, at the network level, the processes of saving and downloading logs require opening different network accesses (ports), arrows are highlighted in different colors. Also, saving and downloading are performed by different applications.

Full network segmentation cheat sheet by [sergiomarotco](https://github.com/sergiomarotco): [link](https://github.com/sergiomarotco/Network-segmentation-cheat-sheet)

## Deployment and operation

### Release

- Provide security configuration information by adding details about the logging mechanisms to release documentation
- Brief the application/process owner about the application logging mechanisms
- Ensure the outputs of the monitoring (see below) are integrated with incident response processes

### Operation

Enable processes to detect whether logging has stopped, and to identify tampering or unauthorized access and deletion (see protection below).

### Protection

The logging mechanisms and collected event data must be protected from mis-use such as tampering in transit, and unauthorized access, modification and deletion once stored. Logs may contain personal and other sensitive information, or the data may contain information regarding the application's code and logic.

In addition, the collected information in the logs may itself have business value (to competitors, gossip-mongers, journalists and activists) such as allowing the estimate of revenues, or providing performance information about employees.

This data may be held on end devices, at intermediate points, in centralized repositories and in archives and backups.

Consider whether parts of the data may need to be excluded, masked, sanitized, hashed, or encrypted during examination or extraction.

At rest:

- Build in tamper detection so you know if a record has been modified or deleted
- Store or copy log data to read-only media as soon as possible
- All access to the logs must be recorded and monitored (and may need prior approval)
- The privileges to read log data should be restricted and reviewed periodically

In transit:

- If log data is sent over untrusted networks (e.g. for collection, for dispatch elsewhere, for analysis, for reporting), use a secure transmission protocol
- Consider whether the origin of the event data needs to be verified
- Perform due diligence checks (regulatory and security) before sending event data to third parties

See `NIST SP 800-92` Guide to Computer Security Log Management for more guidance.

### Monitoring of events

The logged event data needs to be available to review and there are processes in place for appropriate monitoring, alerting, and reporting:

- Incorporate the application logging into any existing log management systems/infrastructure e.g. centralized logging and analysis systems
- Ensure event information is available to appropriate teams
- Enable alerting and signal the responsible teams about more serious events immediately
- Share relevant event information with other detection systems, to related organizations and centralized intelligence gathering/sharing systems

### Disposal of logs

Log data, temporary debug logs, and backups/copies/extractions, must not be destroyed before the duration of the required data retention period, and must not be kept beyond this time.

Legal, regulatory and contractual obligations may impact on these periods.

## Attacks on Logs

Because of their usefulness as a defense, logs may be a target of attacks. See also OWASP [Log Injection](https://owasp.org/www-community/attacks/Log_Injection) and [CWE-117](https://cwe.mitre.org/data/definitions/117.html).

### Confidentiality

Who should be able to read what? A confidentiality attack enables an unauthorized party to access sensitive information stored in logs.

- Logs contain PII of users. Attackers gather PII, then either release it or use it as a stepping stone for further attacks on those users.
- Logs contain technical secrets such as passwords. Attackers use it as a stepping stone for deeper attacks.

### Integrity

Which information should be modifiable by whom?

- An attacker with read access to a log uses it to exfiltrate secrets.
- An attack leverages logs to connect with exploitable facets of logging platforms, such as sending in a payload over syslog in order to cause an out-of-bounds write.

### Availability

What downtime is acceptable?

- An attacker floods log files in order to exhaust disk space available for non-logging facets of system functioning. For example, the same disk used for log files might be used for SQL storage of application data.
- An attacker floods log files in order to exhaust disk space available for further logging.
- An attacker uses one log entry to destroy other log entries.
- An attacker leverages poor performance of logging code to reduce application performance

### Accountability

Who is responsible for harm?

- An attacker prevent writes in order to cover their tracks.
- An attacker prevent damages the log in order to cover their tracks.
- An attacker causes the wrong identity to be logged in order to conceal the responsible party.

## Related articles

- OWASP [ESAPI Documentation](https://owasp.org/www-project-enterprise-security-api/).
- OWASP [Logging Project](https://owasp.org/www-project-security-logging/).
- IETF [syslog protocol](https://tools.ietf.org/rfc/rfc5424.txt).
- Mitre [Common Event Expression (CEE)](https://cee.mitre.org/) (as of 2014 no longer actively developed).
- NIST [SP 800-92 Guide to Computer Security Log Management](https://csrc.nist.gov/publications/nistpubs/800-92/SP800-92.pdf).
- PCISSC [PCI DSS v2.0 Requirement 10 and PA-DSS v2.0 Requirement 4](https://www.pcisecuritystandards.org/security_standards/documents.php).
- W3C [Extended Log File Format](https://www.w3.org/TR/WD-logfile.html).
- Other [Build Visibility In, Richard Bejtlich, TaoSecurity blog](https://taosecurity.blogspot.co.uk/2009/08/build-visibility-in.html).
- Other [Common Event Format (CEF), Arcsight](https://community.microfocus.com/t5/ArcSight-Connectors/ArcSight-Common-Event-Format-CEF-Implementation-Standard/ta-p/1645557).
- Other [Log Event Extended Format (**LEEF**), IBM](https://www.ibm.com/developerworks/community/wikis/form/anonymous/api/wiki/9989d3d7-02c1-444e-92be-576b33d2f2be/page/3dc63f46-4a33-4e0b-98bf-4e55b74e556b/attachment/a19b9122-5940-4c89-ba3e-4b4fc25e2328/media/QRadar_LEEF_Format_Guide.pdf).
- Other [Common Log File System (CLFS), Microsoft](https://msdn.microsoft.com/en-us/library/windows/desktop/bb986747%28v=vs.85).aspx).
- Other [Building Secure Applications: Consistent Logging, Rohit Sethi & Nish Bhalla, Symantec Connect](https://www.symantec.com/connect/articles/building-secure-applications-consistent-logging).

</section>

<section id="logging-translation-panel" className="tabPanel translationPanel contentPanel">

## はじめに

このチートシートは、開発者がアプリケーションのログ記録メカニズム、特にセキュリティログを構築するための集中的なガイダンスを提供することに焦点を当てています。

多くのシステムでは、ネットワーク機器、オペレーティングシステム、Web サーバー、メールサーバー、データベースサーバーのログ記録が有効化されていますが、カスタムアプリケーションイベントのログ記録は欠落している、無効化されている、または不適切に設定されていることがよくあります。アプリケーションログは、インフラストラクチャログだけよりもはるかに深い洞察を提供します。Web アプリケーション (Web サイトや Web サービスなど) のログ記録は、Web サーバーログ (Extended Log File Format など) を有効化することだけではありません。

アプリケーションログは、アプリケーション内で一貫し、組織のアプリケーションポートフォリオ全体でも一貫し、関連する場合は業界標準を使用するべきです。そうすることで、記録されたイベントデータを多様なシステムで取り込み、相関、分析、管理できます。

## 目的

アプリケーションログには、セキュリティイベントを常に含めるべきです。アプリケーションログは、セキュリティと運用の両方のユースケースにとって非常に価値のあるデータです。

### 運用上のユースケース

- 一般的なデバッグ
- ベースラインの確立
- 業務プロセスの監視。販売プロセスの離脱、トランザクション、接続など
- 問題や異常状態に関する情報の提供
- パフォーマンス監視。データ読み込み時間、ページタイムアウトなど
- その他の業務固有の要件

### セキュリティ上のユースケース

アプリケーションログは、次のような他の種類のイベントを記録するためにも使用できます。

- 自動化対策の監視
- セキュリティインシデントの識別
- ポリシー違反の監視
- 否認防止コントロールの補助。ただし、ログにおける否認防止という性質は達成が難しい点に注意してください。ログの信頼性は、ログ記録主体が適切に監査されていることに基づく場合が多く、デジタル署名のようなメカニズムはここでは利用しにくいためです。
- 監査証跡。データの追加、変更、削除、データエクスポートなど
- コンプライアンス監視
- 後続の情報提供要求のためのデータ。データ主体アクセス、情報公開、訴訟、警察やその他規制当局の調査など
- 法的に認可されたデータ傍受。アプリケーション層の盗聴など
- 他のログソースに不足している、インシデント調査のためのアプリケーション固有データの追加提供
- 攻撃検知を通じて、脆弱性の特定や悪用に対する防御を支援すること

プロセス監視、監査、トランザクションログまたは証跡などは、通常、セキュリティイベントログとは異なる目的で収集されます。そのため、多くの場合は分離して保持するべきです。

収集されるイベントの種類や詳細も異なる傾向があります。

たとえば [PCIDSS](https://www.pcisecuritystandards.org/pci_security/) の監査ログには、帰属可能なトランザクションの元の順序を再構築、レビュー、検査できるようにする、独立して検証可能な時系列の活動記録が含まれます。ログを取り過ぎないこと、また少な過ぎないことが重要です。

意図した目的に関する知識を使って、何を、いつ、どれだけ記録するかを決めてください。このチートシートの残りの部分では、主にセキュリティイベントログについて説明します。

## 設計、実装、テスト

### イベントデータの発生源

アプリケーション自体は、ログエントリの生成に使用すべき幅広い情報イベントにアクセスできます。したがって、主要なイベントデータソースはアプリケーションコード自体です。

アプリケーションは、ユーザーに関する情報 (識別子、ロール、権限など) とイベントの文脈 (対象、アクション、結果など) を最も多く持っています。また、このデータはインフラストラクチャ機器や密接に関連するアプリケーションでさえ利用できないことがよくあります。

アプリケーション利用に関するその他の情報源として、次のものも検討できます。

- クライアントソフトウェア。デスクトップソフトウェアやモバイルデバイス上の操作をローカルログやメッセージング技術で記録すること、AJAX 経由の JavaScript 例外ハンドラ、Content Security Policy (CSP) レポートメカニズムを使用する Web ブラウザなど
- 組み込みの計測コード
- ネットワークファイアウォール
- ネットワークおよびホスト侵入検知システム (NIDS と HIDS)
- 密接に関連するアプリケーション。Web サーバーソフトウェアに組み込まれたフィルタ、Web サーバー URL リダイレクトまたはリライトによるスクリプト化されたカスタムエラーページとハンドラなど
- アプリケーションファイアウォール。フィルタ、ガード、XML ゲートウェイ、データベースファイアウォール、Web アプリケーションファイアウォール (WAF) など
- データベースアプリケーション。自動監査証跡、トリガーベースのアクションなど
- レピュテーション監視サービス。稼働監視やマルウェア監視など
- その他のアプリケーション。不正監視、CRM など
- オペレーティングシステム。モバイルプラットフォームなど

異なる信頼ゾーンのシステムからイベントデータを含める場合は、そのイベント情報の信頼度を考慮する必要があります。データは欠落、改変、偽造、再送される可能性があり、悪意を持つ可能性もあります。必ず未信頼データとして扱う必要があります。

発生源をどのように検証できるか、また完全性と否認防止をどのように強制できるかを検討してください。

### イベントデータを記録する場所

アプリケーションは一般的に、イベントログデータをファイルシステムまたはデータベース (SQL または NoSQL) に書き込みます。デスクトップやモバイルデバイスにインストールされるアプリケーションでは、ローカルストレージやローカルデータベースを使用するだけでなく、リモートストレージへデータを送信することもあります。

選択したフレームワークによって、利用可能な選択肢が制限される場合があります。あらゆる種類のアプリケーションは、よりローカルなストレージの代わりに、またはそれと併用して、イベントデータをリモートシステムへ送信できます。

これは、集中ログ収集および管理システム (SIEM や SEM など) である場合も、別の場所にある他のアプリケーションである場合もあります。実行環境によって管理できるように、アプリケーションがイベントストリームをバッファリングせずに stdout へ単純に送信できるかどうかを検討してください。

- ファイルシステムを使用する場合は、オペレーティングシステム、その他のアプリケーションファイル、ユーザー生成コンテンツで使用される領域とは別のパーティションを使用することが望ましいです。
    - ファイルベースのログでは、どのユーザーがディレクトリへアクセスできるか、およびディレクトリ内のファイル権限について厳格な権限を適用します。
    - Web アプリケーションでは、ログを Web からアクセス可能な場所に公開するべきではありません。公開する場合は、アクセスを制限し、HTML ではなくプレーンテキストの MIME タイプとして設定するべきです。
- データベースを使用する場合は、ログデータの書き込み専用で、データベース、テーブル、関数、コマンドの権限が非常に制限された別個のデータベースアカウントを利用することが望ましいです。
- イベントデータやログファイルを他のシステムへ記録または送信するには、安全なプロトコル上で標準形式を使用します。例として、syslog 上の Common Log File System (CLFS) や Common Event Format (CEF) などがあります。標準形式は、集中ログサービスとの統合を容易にします。

エラースタックトレースや、HTTP リクエストおよびレスポンスのヘッダーと本文の記録など、拡張イベント情報については、別ファイルまたは別テーブルを検討してください。

### ログに記録するイベント

セキュリティ監視、アラート、レポートのレベルと内容は、プロジェクトの要件定義および設計段階で設定する必要があり、情報セキュリティリスクに比例したものにするべきです。これを使って、何をログに記録するべきかを定義できます。

万能の解決策はありません。また、チェックリストだけに盲目的に従うと、不要な「アラームの霧」が生じ、本当の問題が検知されなくなる可能性があります。

可能な場合は、常に次をログに記録してください。

- 入力検証の失敗。プロトコル違反、許容されないエンコーディング、無効なパラメータ名や値など
    - 有効値の離散的かつ有限なリスト (ドロップダウンの国名など) に対して値の検証に失敗した場合の専用イベント。これは攻撃活動でしか起こり得ないため、高セキュリティイベントです。例: `input_validation_fail[:field,userid]`。
- 出力検証の失敗。データベースレコードセットの不一致、無効なデータエンコーディングなど
- 認証の成功と失敗。認証失敗の試行は、ブルートフォース、クレデンシャルスタッフィング、パスワードスプレーなど、認証情報に基づく攻撃の重要な早期指標を提供します。同じアカウントに対する失敗の反復、複数 IP アドレスからの失敗、ログイン試行の急増を監視すると、アカウント乗っ取りの試行が成功する前に検知できます。

これは、「認証の成功と失敗」を常にログに記録しなければならないというこのチートシートのガイダンスと一致します。これらのイベントは、セキュリティインシデントを識別し、インシデント調査を支援するために不可欠です。認証失敗ログ要件については OWASP ASVS 7.1.1 を参照してください。
- 認可 (アクセス制御) の失敗
- セッション管理の失敗。Cookie セッション識別値の変更や疑わしい JWT 検証失敗など
- アプリケーションエラーとシステムイベント。構文エラーとランタイムエラー、接続問題、パフォーマンス問題、サードパーティサービスのエラーメッセージ、ファイルシステムエラー、ファイルアップロード時のウイルス検知、構成変更など
- アプリケーションおよび関連システムの起動と停止、ログ記録の初期化 (開始、停止、一時停止)
- 高リスク機能の使用。次を含みます。
    - ユーザーの追加または削除、権限変更、ユーザーへのトークン割り当て、トークンの追加または削除などのユーザー管理操作
    - システム管理権限の使用、またはアプリケーション管理者によるアクセス。これらのユーザーによるすべてのアクションを含みます。
    - デフォルトアカウント、共有アカウント、または「緊急時用 (break-glass)」アカウントの使用
    - 決済カード会員データなどの機密データへのアクセス
    - 暗号鍵の使用やローテーションなどの暗号化活動
    - システムレベルオブジェクトの作成と削除
    - 画面ベースのレポートを含むデータのインポートとエクスポート
    - ユーザー生成コンテンツの送信と処理。特にファイルアップロード
    - デシリアライゼーションの失敗
    - バックエンド TLS 失敗 (証明書検証失敗を含む)、または想定外の HTTP 動詞を伴うリクエストなど、ネットワーク接続と関連する失敗
- 法的事項およびその他のオプトイン。携帯電話機能の権限、利用規約、取引条件、個人データ利用への同意、マーケティング通信を受け取る許可など
- 疑わしいビジネスロジック活動。次を含みます。
    - 一連のアクションを順序外で実行しようとする、またはフロー制御をバイパスしようとする試行
    - 業務文脈で意味をなさないアクション
    - 特定のアクションの制限を超えようとする試行

任意で、次のイベントをログに記録できるか、また望ましい情報かどうかを検討してください。

- シーケンス失敗
- 過剰利用
- データ変更
- 詐欺やその他の犯罪活動
- 疑わしい、許容できない、または予期しない動作
- 構成の変更
- アプリケーションコードファイルやメモリの変更

### イベント属性

各ログエントリには、後続の監視と分析という意図した用途に十分な情報を含める必要があります。完全なコンテンツデータである場合もありますが、抽出または要約プロパティだけである可能性のほうが高いです。

アプリケーションログは、各イベントについて「いつ、どこで、誰が、何を」を記録する必要があります。

これらのプロパティは、アーキテクチャ、アプリケーションの種類、ホストシステムまたはデバイスによって異なりますが、多くの場合は次を含みます。

- いつ
    - ログ日時 (国際形式)
    - イベント日時。イベントタイムスタンプはログ記録時刻と異なる場合があります。例として、クライアントアプリケーションが周期的または断続的にしかオンラインにならないリモートデバイス上にある場合のサーバーログ記録があります。
    - インタラクション識別子 `Note A`
- どこで
    - アプリケーション識別子。名前とバージョンなど
    - アプリケーションアドレス。クラスタまたはホスト名、サーバー IPv4 または IPv6 アドレスとポート番号、ワークステーション ID、ローカルデバイス識別子など
    - サービス。名前とプロトコルなど
    - 地理位置情報
    - ウィンドウ、フォーム、ページ。Web アプリケーションのエントリポイント URL と HTTP メソッド、ダイアログボックス名など
    - コード位置。スクリプト名、モジュール名など
- 誰が (人間または機械ユーザー)
    - 送信元アドレス。ユーザーのデバイスまたはマシン識別子、ユーザーの IP アドレス、セルまたは RF タワー ID、携帯電話番号など
    - ユーザー ID (認証済みまたはその他の方法で既知の場合)。ユーザーデータベーステーブルの主キー値、ユーザー名、ライセンス番号など
- 何を
    - イベント種別 `Note B`
    - イベント重大度 `Note B`。例: `{0=emergency, 1=alert, ..., 7=debug}, {fatal, error, warning, info, debug, trace}`
    - セキュリティ関連イベントフラグ (ログに非セキュリティイベントデータも含まれる場合)
    - 説明

加えて、次の記録も検討してください。

- 二次時刻ソース (GPS など) によるイベント日時
- アクション。リクエストの本来意図された目的。例: Log in、Refresh session ID、Log out、Update profile
- オブジェクト。影響を受けたコンポーネントやその他のオブジェクト (ユーザーアカウント、データリソース、ファイル)。例: URL、Session ID、User account、File
- 結果ステータス。OBJECT を対象とする ACTION が成功したかどうか。例: Success、Fail、Defer
- 理由。上記のステータスが発生した理由。例: User not authenticated in database check ...、Incorrect credentials
- HTTP ステータスコード (Web アプリケーションのみ)。ユーザーに返されたステータスコード (多くの場合 200 または 301)
- リクエスト HTTP ヘッダーまたは HTTP User Agent (Web アプリケーションのみ)
- ユーザー種別分類。public、authenticated user、CMS user、search engine、authorized penetration tester、uptime monitor など (下記「記録から除外するデータ」を参照)
- イベント検知の分析的信頼度 `Note B`。low、medium、high、または数値など
- ユーザーが見た応答やアプリケーションが取った応答。ステータスコード、カスタムテキストメッセージ、セッション終了、管理者アラートなど
- 拡張詳細。スタックトレース、システムエラーメッセージ、デバッグ情報、HTTP リクエスト本文、HTTP レスポンスヘッダーと本文など
- 内部分類。責任範囲、コンプライアンス参照など
- 外部分類。NIST Security Content Automation Protocol (SCAP)、Mitre Common Attack Pattern Enumeration and Classification (CAPEC) など

これらの詳細については、末尾に掲載されている「Other」関連記事、特に Anton Chuvakin と Gunnar Peterson による包括的な記事を参照してください。

**Note A:** 「インタラクション識別子」は、単一のユーザーインタラクション (デスクトップアプリケーションのフォーム送信、Web ページリクエスト、モバイルアプリのボタンクリック、Web サービス呼び出しなど) に関するすべての関連イベントを関連付ける方法です。アプリケーションは、これらすべてのイベントが同じインタラクションに関連することを知っており、この情報を失って後続の相関技術で別々のイベントを再構築させるのではなく、記録するべきです。たとえば、単一の SOAP リクエストに複数の入力検証失敗があり、それらが短い時間範囲にまたがる場合があります。別の例として、アプリケーションからデータベースサーバーへ送信された長時間実行の「saga request」では、入力送信よりずっと後に出力検証失敗が発生する場合があります。

**Note B:** 各組織は、イベント分類 (種別、信頼度、重大度)、説明文の構文、フィールド長とデータ型、日時に使用する形式について、一貫し文書化されたアプローチを確保するべきです。

### 記録から除外するデータ

法的に認められていないデータは決してログに記録しないでください。たとえば、一部の通信の傍受、従業員の監視、同意なしの一部データ収集は、いずれも違法となる可能性があります。

他の内部システム、「信頼された」第三者、検索エンジンロボット、稼働監視やプロセス監視などのリモート監視システム、ペネトレーションテスター、監査人など、「既知の」ユーザーからのイベントを除外してはいけません。ただし、記録データの中で、これらそれぞれに分類フラグを含めたい場合があります。

次の情報は通常、ログに直接記録せず、代わりに削除、マスク、サニタイズ、ハッシュ化、または暗号化するべきです。

- アプリケーションソースコード
- セッション識別値 (セッション固有イベントを追跡する必要がある場合は、ハッシュ値への置き換えを検討してください)
- アクセストークン
- 機微な個人データおよび一部の個人識別情報 (PII)。健康情報、政府識別子、脆弱な立場の人々に関する情報など
- 認証パスワード
- データベース接続文字列
- 暗号鍵およびその他の主要なシークレット
- 銀行口座または決済カード会員データ
- ログ記録システムで保存が許可されているよりも高いセキュリティ分類のデータ
- 商業上の機密情報
- 関連する管轄区域で収集が違法な情報
- ユーザーが収集をオプトアウトした情報、または同意していない情報。Do Not Track の使用、または収集への同意期限が切れた場合など

次のデータも存在する場合があり、後続の調査には有用である一方、イベントとして記録する前に何らかの特別な扱いが必要になることがあります。

- ファイルパス
- データベース接続文字列
- 内部ネットワーク名とアドレス
- 機微ではない個人データ (個人名、電話番号、メールアドレスなど)

個人の識別が不要な場合、またはリスクが大きすぎると考えられる場合は、直接識別子と間接識別子の削除、スクランブル、仮名化など、個人データの非識別化技術の使用を検討してください。

一部のシステムでは、ログ収集後かつログ表示前にサニタイズを実施できます。

### カスタマイズ可能なログ記録

ログ記録のレベル (重大度または脅威レベルに基づくイベント種別、記録する詳細量) を変更できることが望ましい場合があります。これを実装する場合は、次を確保してください。

- デフォルトレベルは、業務ニーズに十分な詳細を提供する必要があります。
- アプリケーションログ、またはコンプライアンス要件に必要なイベントのログ記録を完全に無効化できるべきではありません。
- ログ記録レベルまたは範囲の変更は、アプリケーションに内在するもの (承認済みアルゴリズムに基づいてアプリケーションが自動的に実施するなど) であるか、変更管理プロセス (構成データの変更、ソースコードの修正など) に従う必要があります。
- ログ記録レベルは定期的に検証する必要があります。

### イベント収集

開発フレームワークが適切なログ記録メカニズムをサポートしている場合は、それを使用するか、その上に構築してください。そうでない場合は、他のモジュールやコンポーネントから呼び出せる、アプリケーション全体のログハンドラを実装してください。

組織固有のイベント分類と説明構文の要件を参照して、そのインターフェースを文書化してください。

可能であれば、このログハンドラを、徹底的にテストでき、複数のアプリケーションにデプロイでき、承認済みかつ推奨されるモジュールの一覧に追加できる標準モジュールとして作成してください。

- 他の信頼ゾーンからのイベントデータに対して入力検証を実施し、正しい形式であることを確認します (入力検証失敗がある場合は、アラートを出し、ログに記録しないことも検討します)。
- すべてのイベントデータに対してサニタイズを実施し、キャリッジリターン (CR)、ラインフィード (LF)、区切り文字などによるログインジェクション攻撃を防ぎます (任意で機微データも削除します)。
- 出力される (ログ記録される) 形式に合わせてデータを正しくエンコードします。
- データベースへ書き込む場合は、SQL インジェクションチートシートを読み、理解し、適用してください。
- ログ記録プロセスまたはシステムの失敗が、アプリケーションの通常動作を妨げたり、情報漏えいを許したりしないようにします。
- すべてのサーバーとデバイスで時刻を同期します `Note C`。

**Note C:** アプリケーションが他者の管理下にあるデバイス (個人の携帯電話、別の企業ネットワーク上にあるリモート顧客のワークステーションなど) で実行される場合、これは常に可能とは限りません。このような場合は、時刻のずれを測定するか、イベントタイムスタンプの信頼度レベルを記録するよう試みてください。

可能な場合は、標準形式でデータを記録するか、少なくとも業界標準形式でエクスポートまたはブロードキャストできるようにしてください。

場合によっては、イベントが中間地点でリレーされたり、まとめて収集されたりすることがあります。後者では、中央リポジトリおよび分析システムへ転送する前に、一部のデータが集約または要約される場合があります。

### 検証

ログ記録機能とログ記録システムは、コードレビュー、アプリケーションテスト、セキュリティ検証プロセスに含める必要があります。

- ログ記録が正しく、仕様どおりに動作していることを確認します。
- イベントが一貫して分類され、フィールド名、型、長さが合意済み標準に従って正しく定義されていることを確認します。
- アプリケーションセキュリティテスト、ファズテスト、ペネトレーションテスト、パフォーマンステスト中に、ログ記録が実装され有効化されていることを確認します。
- メカニズムがインジェクション攻撃を受けやすくないことをテストします。
- ログ記録時に望ましくない副作用がないことを確認します。
- 外部ネットワーク接続が失われた場合 (通常それが必要な場合) に、ログ記録メカニズムへ与える影響を確認します。
- ログ記録がシステムリソースを枯渇させるために使用されないことを確認します。たとえば、ディスク領域を埋め尽くしたり、データベーストランザクションログ領域を超過したりしてサービス拒否につながることがないようにします。
- データベース接続の喪失、ファイルシステム領域不足、ファイルシステムへの書き込み権限不足、ログ記録モジュール自体のランタイムエラーなど、ログ記録失敗がアプリケーションへ与える影響をテストします。
- イベントログデータへのアクセス制御を検証します。
- ログデータがユーザーに対する何らかのアクション (アクセス遮断、アカウントロックアウトなど) に利用される場合は、それが他のユーザーへのサービス拒否 (DoS) を引き起こすために使用できないことを確認します。

### ネットワークアーキテクチャ

例として、下の図は顧客に業務機能を提供するサービスを示しています。ログを収集するための集中システムを作成することを推奨します。このようなサービスは多数存在し得ますが、それらすべてが集中システムへ安全にログを収集する必要があります。

この業務サービスのアプリケーションは、次のネットワークセグメントに配置されています。

- FRONTEND 1 aka DMZ (UI)
- MIDDLEWARE 1 (business application - service core)
- BACKEND 1 (service database)

セキュリティイベントを含む IT イベントの収集を担当するサービスは、次のセグメントに配置されています。

- BACKEND 2 (log storage)
- MIDDLEWARE 3 - 2 applications:
    - log loader application that download log from storage, pre-processes, and transfer to UI
    - log collector that accepts logs from business applications, other infrastructure, cloud applications and saves in log storage
- FRONTEND 2 (UI for viewing business service event logs)
- FRONTEND 3 (applications that receive logs from cloud applications and transfer logs to log collector)
    - 2 つのアプリケーションの機能を 1 つにまとめることは許容されます。

たとえば、ユーザーからのすべての外部リクエストは API 管理サービスを通過します。MIDDLEWARE 2 セグメントのアプリケーションを参照してください。

![MIDDLEWARE](https://raw.githubusercontent.com/OWASP/CheatSheetSeries/master/assets/Logging_Cheat_Sheet.drawio.png)

上の画像でわかるように、ネットワークレベルでは、ログの保存とダウンロードのプロセスで異なるネットワークアクセス (ポート) を開く必要があり、矢印は異なる色で強調されています。また、保存とダウンロードは別々のアプリケーションによって実行されます。

[sergiomarotco](https://github.com/sergiomarotco) による完全なネットワークセグメンテーションチートシート: [link](https://github.com/sergiomarotco/Network-segmentation-cheat-sheet)

## デプロイと運用

### リリース

- ログ記録メカニズムに関する詳細をリリース文書に追加し、セキュリティ構成情報を提供します。
- アプリケーションまたはプロセスのオーナーに、アプリケーションログ記録メカニズムについて説明します。
- 監視 (下記参照) の出力がインシデント対応プロセスと統合されていることを確認します。

### 運用

ログ記録が停止したかどうかを検知し、改ざんまたは不正アクセスと削除を識別するプロセスを有効化します (下記の保護を参照)。

### 保護

ログ記録メカニズムと収集されたイベントデータは、転送中の改ざん、保存後の不正アクセス、変更、削除などの悪用から保護する必要があります。ログには個人情報やその他の機微情報が含まれる可能性があり、またデータにはアプリケーションのコードやロジックに関する情報が含まれる可能性があります。

さらに、ログ内の収集情報自体が、競合他社、噂話をする者、ジャーナリスト、活動家にとって業務上の価値を持つ場合があります。たとえば、収益を推定できたり、従業員のパフォーマンス情報を提供したりする可能性があります。

このデータは、エンドデバイス、中間地点、集中リポジトリ、アーカイブ、バックアップに保持される可能性があります。

調査または抽出時に、データの一部を除外、マスク、サニタイズ、ハッシュ化、または暗号化する必要があるかどうかを検討してください。

保存時:

- レコードが変更または削除されたかどうかを把握できるように、改ざん検知を組み込みます。
- できるだけ早くログデータを読み取り専用媒体に保存またはコピーします。
- ログへのすべてのアクセスは記録し監視する必要があります (事前承認が必要になる場合もあります)。
- ログデータを読み取る権限は制限し、定期的にレビューするべきです。

転送中:

- ログデータが信頼できないネットワーク経由で送信される場合 (収集、他所への送出、分析、レポート作成など)、安全な転送プロトコルを使用します。
- イベントデータの発生元を検証する必要があるかどうかを検討します。
- イベントデータを第三者へ送信する前に、規制面およびセキュリティ面のデューデリジェンスチェックを実施します。

詳細なガイダンスについては、`NIST SP 800-92` Guide to Computer Security Log Management を参照してください。

### イベントの監視

記録されたイベントデータはレビュー可能である必要があり、適切な監視、アラート、レポートのためのプロセスが整備されている必要があります。

- アプリケーションログを、既存のログ管理システムまたはインフラストラクチャ (集中ログおよび分析システムなど) に組み込みます。
- イベント情報が適切なチームに利用可能であることを確認します。
- より重大なイベントについてはアラートを有効化し、責任を持つチームへ直ちに通知します。
- 関連するイベント情報を、他の検知システム、関連組織、集中型のインテリジェンス収集または共有システムと共有します。

### ログの廃棄

ログデータ、一時的なデバッグログ、バックアップ、コピー、抽出物は、必要なデータ保持期間が経過する前に破棄してはならず、その期間を超えて保持してもなりません。

法的、規制上、契約上の義務が、これらの期間に影響する場合があります。

## ログへの攻撃

ログは防御として有用であるため、攻撃対象になることがあります。OWASP [Log Injection](https://owasp.org/www-community/attacks/Log_Injection) と [CWE-117](https://cwe.mitre.org/data/definitions/117.html) も参照してください。

### 機密性

誰が何を読めるべきでしょうか。機密性攻撃は、権限のない者がログに保存された機微情報へアクセスできるようにします。

- ログにはユーザーの PII が含まれます。攻撃者は PII を収集し、それを公開するか、そのユーザーへのさらなる攻撃の足がかりとして使用します。
- ログにはパスワードなどの技術的シークレットが含まれます。攻撃者はそれを、より深い攻撃への足がかりとして使用します。

### 完全性

どの情報を、誰が変更できるべきでしょうか。

- ログへの読み取りアクセスを持つ攻撃者は、それを使ってシークレットを外部へ持ち出します。
- 攻撃は、syslog 経由でペイロードを送信して境界外書き込みを引き起こすなど、ログ記録プラットフォームの悪用可能な側面にログを接続するよう利用します。

### 可用性

どの程度のダウンタイムが許容されるでしょうか。

- 攻撃者はログファイルを大量に書き込み、システム機能のうちログ以外の側面で利用可能なディスク領域を枯渇させます。たとえば、ログファイルに使用される同じディスクが、アプリケーションデータの SQL ストレージにも使用されている場合があります。
- 攻撃者はログファイルを大量に書き込み、さらなるログ記録に利用可能なディスク領域を枯渇させます。
- 攻撃者は 1 つのログエントリを使って他のログエントリを破壊します。
- 攻撃者はログ記録コードの低いパフォーマンスを利用して、アプリケーションのパフォーマンスを低下させます。

### 説明責任

誰が損害に責任を負うのでしょうか。

- 攻撃者は痕跡を隠すために書き込みを妨げます。
- 攻撃者は痕跡を隠すためにログを破損させます。
- 攻撃者は責任主体を隠すために、誤った ID が記録されるようにします。

</section>

<section id="logging-bilingual-panel" className="tabPanel bilingualPanel">

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Introduction

This cheat sheet is focused on providing developers with concentrated guidance on building application logging mechanisms, especially related to security logging.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## はじめに

このチートシートは、開発者がアプリケーションのログ記録メカニズム、特にセキュリティログを構築するための集中的なガイダンスを提供することに焦点を当てています。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Many systems enable network device, operating system, web server, mail server and database server logging, but often custom application event logging is missing, disabled or poorly configured. It provides much greater insight than infrastructure logging alone. Web application (e.g. web site or web service) logging is much more than having web server logs enabled (e.g. using Extended Log File Format).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

多くのシステムでは、ネットワーク機器、オペレーティングシステム、Web サーバー、メールサーバー、データベースサーバーのログ記録が有効化されていますが、カスタムアプリケーションイベントのログ記録は欠落している、無効化されている、または不適切に設定されていることがよくあります。アプリケーションログは、インフラストラクチャログだけよりもはるかに深い洞察を提供します。Web アプリケーション (Web サイトや Web サービスなど) のログ記録は、Web サーバーログ (Extended Log File Format など) を有効化することだけではありません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Application logging should be consistent within the application, consistent across an organization's application portfolio and use industry standards where relevant, so the logged event data can be consumed, correlated, analyzed and managed by a wide variety of systems.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

アプリケーションログは、アプリケーション内で一貫し、組織のアプリケーションポートフォリオ全体でも一貫し、関連する場合は業界標準を使用するべきです。そうすることで、記録されたイベントデータを多様なシステムで取り込み、相関、分析、管理できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Purpose

Application logging should always be included for security events. Application logs are invaluable data for both security and operational use cases.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 目的

アプリケーションログには、セキュリティイベントを常に含めるべきです。アプリケーションログは、セキュリティと運用の両方のユースケースにとって非常に価値のあるデータです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Operational use cases

- General debugging
- Establishing baselines
- Business process monitoring e.g. sales process abandonment, transactions, connections
- Providing information about problems and unusual conditions
- Performance monitoring e.g. data load time, page timeouts
- Other business-specific requirements

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 運用上のユースケース

- 一般的なデバッグ
- ベースラインの確立
- 業務プロセスの監視。販売プロセスの離脱、トランザクション、接続など
- 問題や異常状態に関する情報の提供
- パフォーマンス監視。データ読み込み時間、ページタイムアウトなど
- その他の業務固有の要件

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Security use cases

Application logging might also be used to record other types of events too such as:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### セキュリティ上のユースケース

アプリケーションログは、次のような他の種類のイベントを記録するためにも使用できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Anti-automation monitoring
- Identifying security incidents
- Monitoring policy violations
- Assisting non-repudiation controls (note that the trait non-repudiation is hard to achieve for logs because their trustworthiness is often just based on the logging party being audited properly while mechanisms like digital signatures are hard to utilize here)
- Audit trails e.g. data addition, modification and deletion, data exports
- Compliance monitoring
- Data for subsequent requests for information e.g. data subject access, freedom of information, litigation, police and other regulatory investigations
- Legally sanctioned interception of data e.g. application-layer wire-tapping
- Contributing additional application-specific data for incident investigation which is lacking in other log sources
- Helping defend against vulnerability identification and exploitation through attack detection

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- 自動化対策の監視
- セキュリティインシデントの識別
- ポリシー違反の監視
- 否認防止コントロールの補助。ただし、ログにおける否認防止という性質は達成が難しい点に注意してください。ログの信頼性は、ログ記録主体が適切に監査されていることに基づく場合が多く、デジタル署名のようなメカニズムはここでは利用しにくいためです。
- 監査証跡。データの追加、変更、削除、データエクスポートなど
- コンプライアンス監視
- 後続の情報提供要求のためのデータ。データ主体アクセス、情報公開、訴訟、警察やその他規制当局の調査など
- 法的に認可されたデータ傍受。アプリケーション層の盗聴など
- 他のログソースに不足している、インシデント調査のためのアプリケーション固有データの追加提供
- 攻撃検知を通じて、脆弱性の特定や悪用に対する防御を支援すること

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Process monitoring, audit, and transaction logs/trails etc. are usually collected for different purposes than security event logging, and this often means they should be kept separate.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

プロセス監視、監査、トランザクションログまたは証跡などは、通常、セキュリティイベントログとは異なる目的で収集されます。そのため、多くの場合は分離して保持するべきです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The types of events and details collected will tend to be different.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

収集されるイベントの種類や詳細も異なる傾向があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

For example a [PCIDSS](https://www.pcisecuritystandards.org/pci_security/) audit log will contain a chronological record of activities to provide an independently verifiable trail that permits reconstruction, review and examination to determine the original sequence of attributable transactions. It is important not to log too much, or too little.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

たとえば [PCIDSS](https://www.pcisecuritystandards.org/pci_security/) の監査ログには、帰属可能なトランザクションの元の順序を再構築、レビュー、検査できるようにする、独立して検証可能な時系列の活動記録が含まれます。ログを取り過ぎないこと、また少な過ぎないことが重要です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Use knowledge of the intended purposes to guide what, when and how much. The remainder of this cheat sheet primarily discusses security event logging.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

意図した目的に関する知識を使って、何を、いつ、どれだけ記録するかを決めてください。このチートシートの残りの部分では、主にセキュリティイベントログについて説明します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Design, implementation, and testing

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 設計、実装、テスト

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Event data sources

The application itself has access to a wide range of information events that should be used to generate log entries. Thus, the primary event data source is the application code itself.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### イベントデータの発生源

アプリケーション自体は、ログエントリの生成に使用すべき幅広い情報イベントにアクセスできます。したがって、主要なイベントデータソースはアプリケーションコード自体です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The application has the most information about the user (e.g. identity, roles, permissions) and the context of the event (target, action, outcomes), and often this data is not available to either infrastructure devices, or even closely-related applications.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

アプリケーションは、ユーザーに関する情報 (識別子、ロール、権限など) とイベントの文脈 (対象、アクション、結果など) を最も多く持っています。また、このデータはインフラストラクチャ機器や密接に関連するアプリケーションでさえ利用できないことがよくあります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Other sources of information about application usage that could also be considered are:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

アプリケーション利用に関するその他の情報源として、次のものも検討できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Client software e.g. actions on desktop software and mobile devices in local logs or using messaging technologies, JavaScript exception handler via AJAX, web browser such as using Content Security Policy (CSP) reporting mechanism
- Embedded instrumentation code
- Network firewalls
- Network and host intrusion detection systems (NIDS and HIDS)
- Closely-related applications e.g. filters built into web server software, web server URL redirects/rewrites to scripted custom error pages and handlers
- Application firewalls e.g. filters, guards, XML gateways, database firewalls, web application firewalls (WAFs)
- Database applications e.g. automatic audit trails, trigger-based actions
- Reputation monitoring services e.g. uptime or malware monitoring
- Other applications e.g. fraud monitoring, CRM
- Operating system e.g. mobile platform

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- クライアントソフトウェア。デスクトップソフトウェアやモバイルデバイス上の操作をローカルログやメッセージング技術で記録すること、AJAX 経由の JavaScript 例外ハンドラ、Content Security Policy (CSP) レポートメカニズムを使用する Web ブラウザなど
- 組み込みの計測コード
- ネットワークファイアウォール
- ネットワークおよびホスト侵入検知システム (NIDS と HIDS)
- 密接に関連するアプリケーション。Web サーバーソフトウェアに組み込まれたフィルタ、Web サーバー URL リダイレクトまたはリライトによるスクリプト化されたカスタムエラーページとハンドラなど
- アプリケーションファイアウォール。フィルタ、ガード、XML ゲートウェイ、データベースファイアウォール、Web アプリケーションファイアウォール (WAF) など
- データベースアプリケーション。自動監査証跡、トリガーベースのアクションなど
- レピュテーション監視サービス。稼働監視やマルウェア監視など
- その他のアプリケーション。不正監視、CRM など
- オペレーティングシステム。モバイルプラットフォームなど

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The degree of confidence in the event information has to be considered when including event data from systems in a different trust zone. Data may be missing, modified, forged, replayed and could be malicious – it must always be treated as untrusted data.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

異なる信頼ゾーンのシステムからイベントデータを含める場合は、そのイベント情報の信頼度を考慮する必要があります。データは欠落、改変、偽造、再送される可能性があり、悪意を持つ可能性もあります。必ず未信頼データとして扱う必要があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Consider how the source can be verified, and how integrity and non-repudiation can be enforced.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

発生源をどのように検証できるか、また完全性と否認防止をどのように強制できるかを検討してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Where to record event data

Applications commonly write event log data to the file system or a database (SQL or NoSQL). Applications installed on desktops and on mobile devices may use local storage and local databases, as well as sending data to remote storage.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### イベントデータを記録する場所

アプリケーションは一般的に、イベントログデータをファイルシステムまたはデータベース (SQL または NoSQL) に書き込みます。デスクトップやモバイルデバイスにインストールされるアプリケーションでは、ローカルストレージやローカルデータベースを使用するだけでなく、リモートストレージへデータを送信することもあります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Your selected framework may limit the available choices. All types of applications may send event data to remote systems (instead of or as well as more local storage).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

選択したフレームワークによって、利用可能な選択肢が制限される場合があります。あらゆる種類のアプリケーションは、よりローカルなストレージの代わりに、またはそれと併用して、イベントデータをリモートシステムへ送信できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

This could be a centralized log collection and management system (e.g. SIEM or SEM) or another application elsewhere. Consider whether the application can simply send its event stream, unbuffered, to stdout, for management by the execution environment.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

これは、集中ログ収集および管理システム (SIEM や SEM など) である場合も、別の場所にある他のアプリケーションである場合もあります。実行環境によって管理できるように、アプリケーションがイベントストリームをバッファリングせずに stdout へ単純に送信できるかどうかを検討してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- When using the file system, it is preferable to use a separate partition than those used by the operating system, other application files and user generated content
    - For file-based logs, apply strict permissions concerning which users can access the directories, and the permissions of files within the directories
    - In web applications, the logs should not be exposed in web-accessible locations, and if done so, should have restricted access and be configured with a plain text MIME type (not HTML)
- When using a database, it is preferable to utilize a separate database account that is only used for writing log data and which has very restrictive database, table, function and command permissions
- Use standard formats over secure protocols to record and send event data, or log files, to other systems e.g. Common Log File System (CLFS) or Common Event Format (CEF) over syslog; standard formats facilitate integration with centralised logging services

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- ファイルシステムを使用する場合は、オペレーティングシステム、その他のアプリケーションファイル、ユーザー生成コンテンツで使用される領域とは別のパーティションを使用することが望ましいです。
    - ファイルベースのログでは、どのユーザーがディレクトリへアクセスできるか、およびディレクトリ内のファイル権限について厳格な権限を適用します。
    - Web アプリケーションでは、ログを Web からアクセス可能な場所に公開するべきではありません。公開する場合は、アクセスを制限し、HTML ではなくプレーンテキストの MIME タイプとして設定するべきです。
- データベースを使用する場合は、ログデータの書き込み専用で、データベース、テーブル、関数、コマンドの権限が非常に制限された別個のデータベースアカウントを利用することが望ましいです。
- イベントデータやログファイルを他のシステムへ記録または送信するには、安全なプロトコル上で標準形式を使用します。例として、syslog 上の Common Log File System (CLFS) や Common Event Format (CEF) などがあります。標準形式は、集中ログサービスとの統合を容易にします。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Consider separate files/tables for extended event information such as error stack traces or a record of HTTP request and response headers and bodies.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

エラースタックトレースや、HTTP リクエストおよびレスポンスのヘッダーと本文の記録など、拡張イベント情報については、別ファイルまたは別テーブルを検討してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Which events to log

The level and content of security monitoring, alerting, and reporting needs to be set during the requirements and design stage of projects, and should be proportionate to the information security risks. This can then be used to define what should be logged.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### ログに記録するイベント

セキュリティ監視、アラート、レポートのレベルと内容は、プロジェクトの要件定義および設計段階で設定する必要があり、情報セキュリティリスクに比例したものにするべきです。これを使って、何をログに記録するべきかを定義できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

There is no one size fits all solution, and a blind checklist approach can lead to unnecessary "alarm fog" that means real problems go undetected.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

万能の解決策はありません。また、チェックリストだけに盲目的に従うと、不要な「アラームの霧」が生じ、本当の問題が検知されなくなる可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Where possible, always log:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

可能な場合は、常に次をログに記録してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Input validation failures e.g. protocol violations, unacceptable encodings, invalid parameter names and values
    - A specific event for failures to validate a value against a discrete and finite list of valid values (e.g. a country from a dropdown). This is a high security event as it can only be attack activity. For example `input_validation_fail[:field,userid]`.
- Output validation failures e.g. database record set mismatch, invalid data encoding
- Authentication successes and failures
   Failed authentication attempts provide critical early indicators of credential‑based attacks such as brute‑force, credential‑stuffing, and password‑spraying. Monitoring repeated failures for the same account, failures from multiple IP addresses, or rapid bursts of login attempts helps detect account takeover attempts before they succeed. This aligns with the cheat sheet’s guidance that “Authentication successes and failures” must always be logged, as these events are essential for identifying security incidents and supporting incident investigation. Refer to OWASP ASVS 7.1.1 for authentication failure logging requirements.
- Authorization (access control) failures
- Session management failures e.g. cookie session identification value modification or suspicious JWT validation failures
- Application errors and system events e.g. syntax and runtime errors, connectivity problems, performance issues, third party service error messages, file system errors, file upload virus detection, configuration changes
- Application and related systems start-ups and shut-downs, and logging initialization (starting, stopping or pausing)
- Use of higher-risk functionality including:
    - User administration actions such as addition or deletion of users, changes to privileges, assigning users to tokens, adding or deleting tokens
    - Use of systems administrative privileges or access by application administrators including all actions by those users
    - Use of default or shared accounts or a "break-glass" account.
    - Access to sensitive data such as payment cardholder data,
    - Encryption activities such as use or rotation of cryptographic keys
    - Creation and deletion of system-level objects
    - Data import and export including screen-based reports
    - Submission and processing of user-generated content - especially file uploads
    - Deserialization failures
    - Network connections and associated failures such as backend TLS failures (including certificate validation failures), or requests with an unexpected HTTP verb
- Legal and other opt-ins e.g. permissions for mobile phone capabilities, terms of use, terms & conditions, personal data usage consent, permission to receive marketing communications
- Suspicious business logic activities such as:
    - Attempts to perform a set actions out of order/bypass flow control
    - Actions which don't make sense in the business context
    - Attempts to exceed limitations for particular actions

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- 入力検証の失敗。プロトコル違反、許容されないエンコーディング、無効なパラメータ名や値など
    - 有効値の離散的かつ有限なリスト (ドロップダウンの国名など) に対して値の検証に失敗した場合の専用イベント。これは攻撃活動でしか起こり得ないため、高セキュリティイベントです。例: `input_validation_fail[:field,userid]`。
- 出力検証の失敗。データベースレコードセットの不一致、無効なデータエンコーディングなど
- 認証の成功と失敗。認証失敗の試行は、ブルートフォース、クレデンシャルスタッフィング、パスワードスプレーなど、認証情報に基づく攻撃の重要な早期指標を提供します。同じアカウントに対する失敗の反復、複数 IP アドレスからの失敗、ログイン試行の急増を監視すると、アカウント乗っ取りの試行が成功する前に検知できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Optionally consider if the following events can be logged and whether it is desirable information:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

これは、「認証の成功と失敗」を常にログに記録しなければならないというこのチートシートのガイダンスと一致します。これらのイベントは、セキュリティインシデントを識別し、インシデント調査を支援するために不可欠です。認証失敗ログ要件については OWASP ASVS 7.1.1 を参照してください。
- 認可 (アクセス制御) の失敗
- セッション管理の失敗。Cookie セッション識別値の変更や疑わしい JWT 検証失敗など
- アプリケーションエラーとシステムイベント。構文エラーとランタイムエラー、接続問題、パフォーマンス問題、サードパーティサービスのエラーメッセージ、ファイルシステムエラー、ファイルアップロード時のウイルス検知、構成変更など
- アプリケーションおよび関連システムの起動と停止、ログ記録の初期化 (開始、停止、一時停止)
- 高リスク機能の使用。次を含みます。
    - ユーザーの追加または削除、権限変更、ユーザーへのトークン割り当て、トークンの追加または削除などのユーザー管理操作
    - システム管理権限の使用、またはアプリケーション管理者によるアクセス。これらのユーザーによるすべてのアクションを含みます。
    - デフォルトアカウント、共有アカウント、または「緊急時用 (break-glass)」アカウントの使用
    - 決済カード会員データなどの機密データへのアクセス
    - 暗号鍵の使用やローテーションなどの暗号化活動
    - システムレベルオブジェクトの作成と削除
    - 画面ベースのレポートを含むデータのインポートとエクスポート
    - ユーザー生成コンテンツの送信と処理。特にファイルアップロード
    - デシリアライゼーションの失敗
    - バックエンド TLS 失敗 (証明書検証失敗を含む)、または想定外の HTTP 動詞を伴うリクエストなど、ネットワーク接続と関連する失敗
- 法的事項およびその他のオプトイン。携帯電話機能の権限、利用規約、取引条件、個人データ利用への同意、マーケティング通信を受け取る許可など
- 疑わしいビジネスロジック活動。次を含みます。
    - 一連のアクションを順序外で実行しようとする、またはフロー制御をバイパスしようとする試行
    - 業務文脈で意味をなさないアクション
    - 特定のアクションの制限を超えようとする試行

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Sequencing failure
- Excessive use
- Data changes
- Fraud and other criminal activities
- Suspicious, unacceptable, or unexpected behavior
- Modifications to configuration
- Application code file and/or memory changes

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

任意で、次のイベントをログに記録できるか、また望ましい情報かどうかを検討してください。

- シーケンス失敗
- 過剰利用
- データ変更
- 詐欺やその他の犯罪活動
- 疑わしい、許容できない、または予期しない動作
- 構成の変更
- アプリケーションコードファイルやメモリの変更

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Event attributes

Each log entry needs to include sufficient information for the intended subsequent monitoring and analysis. It could be full content data, but is more likely to be an extract or just summary properties.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### イベント属性

各ログエントリには、後続の監視と分析という意図した用途に十分な情報を含める必要があります。完全なコンテンツデータである場合もありますが、抽出または要約プロパティだけである可能性のほうが高いです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The application logs must record "when, where, who and what" for each event.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

アプリケーションログは、各イベントについて「いつ、どこで、誰が、何を」を記録する必要があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The properties for these will be different depending on the architecture, class of application and host system/device, but often include the following:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

これらのプロパティは、アーキテクチャ、アプリケーションの種類、ホストシステムまたはデバイスによって異なりますが、多くの場合は次を含みます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- When
    - Log date and time (international format)
    - Event date and time - the event timestamp may be different to the time of logging e.g. server logging where the client application is hosted on remote device that is only periodically or intermittently online
    - Interaction identifier `Note A`
- Where
    - Application identifier e.g. name and version
    - Application address e.g. cluster/hostname or server IPv4 or IPv6 address and port number, workstation identity, local device identifier
    - Service e.g. name and protocol
    - Geolocation
    - Window/form/page e.g. entry point URL and HTTP method for a web application, dialogue box name
    - Code location e.g. script name, module name
- Who (human or machine user)
    - Source address e.g. user's device/machine identifier, user's IP address, cell/RF tower ID, mobile telephone number
    - User identity (if authenticated or otherwise known) e.g. user database table primary key-value, username, license number
- What
    - Type of event `Note B`
    - Severity of event `Note B` e.g. `&#123;0=emergency, 1=alert, ..., 7=debug&#125;, &#123;fatal, error, warning, info, debug, trace&#125;`
    - Security relevant event flag (if the logs contain non-security event data too)
    - Description

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- いつ
    - ログ日時 (国際形式)
    - イベント日時。イベントタイムスタンプはログ記録時刻と異なる場合があります。例として、クライアントアプリケーションが周期的または断続的にしかオンラインにならないリモートデバイス上にある場合のサーバーログ記録があります。
    - インタラクション識別子 `Note A`
- どこで
    - アプリケーション識別子。名前とバージョンなど
    - アプリケーションアドレス。クラスタまたはホスト名、サーバー IPv4 または IPv6 アドレスとポート番号、ワークステーション ID、ローカルデバイス識別子など
    - サービス。名前とプロトコルなど
    - 地理位置情報
    - ウィンドウ、フォーム、ページ。Web アプリケーションのエントリポイント URL と HTTP メソッド、ダイアログボックス名など
    - コード位置。スクリプト名、モジュール名など
- 誰が (人間または機械ユーザー)
    - 送信元アドレス。ユーザーのデバイスまたはマシン識別子、ユーザーの IP アドレス、セルまたは RF タワー ID、携帯電話番号など
    - ユーザー ID (認証済みまたはその他の方法で既知の場合)。ユーザーデータベーステーブルの主キー値、ユーザー名、ライセンス番号など
- 何を
    - イベント種別 `Note B`
    - イベント重大度 `Note B`。例: `{0=emergency, 1=alert, ..., 7=debug}, {fatal, error, warning, info, debug, trace}`
    - セキュリティ関連イベントフラグ (ログに非セキュリティイベントデータも含まれる場合)
    - 説明

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Additionally consider recording:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

加えて、次の記録も検討してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Secondary time source (e.g. GPS) event date and time
- Action - original intended purpose of the request e.g. Log in, Refresh session ID, Log out, Update profile
- Object e.g. the affected component or other object (user account, data resource, file) e.g. URL, Session ID, User account, File
- Result status - whether the ACTION aimed at the OBJECT was successful e.g. Success, Fail, Defer
- Reason - why the status above occurred e.g. User not authenticated in database check ..., Incorrect credentials
- HTTP Status Code (web applications only) - the status code returned to the user (often 200 or 301)
- Request HTTP headers or HTTP User Agent (web applications only)
- User type classification e.g. public, authenticated user, CMS user, search engine, authorized penetration tester, uptime monitor (see "Data to exclude" below)
- Analytical confidence in the event detection `Note B` e.g. low, medium, high or a numeric value
- Responses seen by the user and/or taken by the application e.g. status code, custom text messages, session termination, administrator alerts
- Extended details e.g. stack trace, system error messages, debug information, HTTP request body, HTTP response headers and body
- Internal classifications e.g. responsibility, compliance references
- External classifications e.g. NIST Security Content Automation Protocol (SCAP), Mitre Common Attack Pattern Enumeration and Classification (CAPEC)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- 二次時刻ソース (GPS など) によるイベント日時
- アクション。リクエストの本来意図された目的。例: Log in、Refresh session ID、Log out、Update profile
- オブジェクト。影響を受けたコンポーネントやその他のオブジェクト (ユーザーアカウント、データリソース、ファイル)。例: URL、Session ID、User account、File
- 結果ステータス。OBJECT を対象とする ACTION が成功したかどうか。例: Success、Fail、Defer
- 理由。上記のステータスが発生した理由。例: User not authenticated in database check ...、Incorrect credentials
- HTTP ステータスコード (Web アプリケーションのみ)。ユーザーに返されたステータスコード (多くの場合 200 または 301)
- リクエスト HTTP ヘッダーまたは HTTP User Agent (Web アプリケーションのみ)
- ユーザー種別分類。public、authenticated user、CMS user、search engine、authorized penetration tester、uptime monitor など (下記「記録から除外するデータ」を参照)
- イベント検知の分析的信頼度 `Note B`。low、medium、high、または数値など
- ユーザーが見た応答やアプリケーションが取った応答。ステータスコード、カスタムテキストメッセージ、セッション終了、管理者アラートなど
- 拡張詳細。スタックトレース、システムエラーメッセージ、デバッグ情報、HTTP リクエスト本文、HTTP レスポンスヘッダーと本文など
- 内部分類。責任範囲、コンプライアンス参照など
- 外部分類。NIST Security Content Automation Protocol (SCAP)、Mitre Common Attack Pattern Enumeration and Classification (CAPEC) など

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

For more information on these, see the "other" related articles listed at the end, especially the comprehensive article by Anton Chuvakin and Gunnar Peterson.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

これらの詳細については、末尾に掲載されている「Other」関連記事、特に Anton Chuvakin と Gunnar Peterson による包括的な記事を参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Note A:** The "Interaction identifier" is a method of linking all (relevant) events for a single user interaction (e.g. desktop application form submission, web page request, mobile app button click, web service call). The application knows all these events relate to the same interaction, and this should be recorded instead of losing the information and forcing subsequent correlation techniques to re-construct the separate events. For example, a single SOAP request may have multiple input validation failures and they may span a small range of times. As another example, an output validation failure may occur much later than the input submission for a long-running "saga request" submitted by the application to a database server.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**Note A:** 「インタラクション識別子」は、単一のユーザーインタラクション (デスクトップアプリケーションのフォーム送信、Web ページリクエスト、モバイルアプリのボタンクリック、Web サービス呼び出しなど) に関するすべての関連イベントを関連付ける方法です。アプリケーションは、これらすべてのイベントが同じインタラクションに関連することを知っており、この情報を失って後続の相関技術で別々のイベントを再構築させるのではなく、記録するべきです。たとえば、単一の SOAP リクエストに複数の入力検証失敗があり、それらが短い時間範囲にまたがる場合があります。別の例として、アプリケーションからデータベースサーバーへ送信された長時間実行の「saga request」では、入力送信よりずっと後に出力検証失敗が発生する場合があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Note B:** Each organisation should ensure it has a consistent, and documented, approach to classification of events (type, confidence, severity), the syntax of descriptions, and field lengths and data types including the format used for dates/times.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**Note B:** 各組織は、イベント分類 (種別、信頼度、重大度)、説明文の構文、フィールド長とデータ型、日時に使用する形式について、一貫し文書化されたアプローチを確保するべきです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Data to exclude

Never log data unless it is legally sanctioned. For example, intercepting some communications, monitoring employees, and collecting some data without consent may all be illegal.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 記録から除外するデータ

法的に認められていないデータは決してログに記録しないでください。たとえば、一部の通信の傍受、従業員の監視、同意なしの一部データ収集は、いずれも違法となる可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Never exclude any events from "known" users such as other internal systems, "trusted" third parties, search engine robots, uptime/process and other remote monitoring systems, pen testers, auditors. However, you may want to include a classification flag for each of these in the recorded data.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

他の内部システム、「信頼された」第三者、検索エンジンロボット、稼働監視やプロセス監視などのリモート監視システム、ペネトレーションテスター、監査人など、「既知の」ユーザーからのイベントを除外してはいけません。ただし、記録データの中で、これらそれぞれに分類フラグを含めたい場合があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The following should usually not be recorded directly in the logs, but instead should be removed, masked, sanitized, hashed, or encrypted:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

次の情報は通常、ログに直接記録せず、代わりに削除、マスク、サニタイズ、ハッシュ化、または暗号化するべきです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Application source code
- Session identification values (consider replacing with a hashed value if needed to track session specific events)
- Access tokens
- Sensitive personal data and some forms of personally identifiable information (PII) e.g. health, government identifiers, vulnerable people
- Authentication passwords
- Database connection strings
- Encryption keys and other primary secrets
- Bank account or payment card holder data
- Data of a higher security classification than the logging system is allowed to store
- Commercially-sensitive information
- Information it is illegal to collect in the relevant jurisdictions
- Information a user has opted out of collection, or not consented to e.g. use of do not track, or where consent to collect has expired

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- アプリケーションソースコード
- セッション識別値 (セッション固有イベントを追跡する必要がある場合は、ハッシュ値への置き換えを検討してください)
- アクセストークン
- 機微な個人データおよび一部の個人識別情報 (PII)。健康情報、政府識別子、脆弱な立場の人々に関する情報など
- 認証パスワード
- データベース接続文字列
- 暗号鍵およびその他の主要なシークレット
- 銀行口座または決済カード会員データ
- ログ記録システムで保存が許可されているよりも高いセキュリティ分類のデータ
- 商業上の機密情報
- 関連する管轄区域で収集が違法な情報
- ユーザーが収集をオプトアウトした情報、または同意していない情報。Do Not Track の使用、または収集への同意期限が切れた場合など

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Sometimes the following data can also exist, and whilst useful for subsequent investigation, it may also need to be treated in some special manner before the event is recorded:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

次のデータも存在する場合があり、後続の調査には有用である一方、イベントとして記録する前に何らかの特別な扱いが必要になることがあります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- File paths
- Database connection strings
- Internal network names and addresses
- Non sensitive personal data (e.g. personal names, telephone numbers, email addresses)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- ファイルパス
- データベース接続文字列
- 内部ネットワーク名とアドレス
- 機微ではない個人データ (個人名、電話番号、メールアドレスなど)

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Consider using personal data de-identification techniques such as deletion, scrambling or pseudonymization of direct and indirect identifiers where the individual's identity is not required, or the risk is considered too great.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

個人の識別が不要な場合、またはリスクが大きすぎると考えられる場合は、直接識別子と間接識別子の削除、スクランブル、仮名化など、個人データの非識別化技術の使用を検討してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

In some systems, sanitization can be undertaken post log collection, and prior to log display.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

一部のシステムでは、ログ収集後かつログ表示前にサニタイズを実施できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Customizable logging

It may be desirable to be able to alter the level of logging (type of events based on severity or threat level, amount of detail recorded). If this is implemented, ensure that:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### カスタマイズ可能なログ記録

ログ記録のレベル (重大度または脅威レベルに基づくイベント種別、記録する詳細量) を変更できることが望ましい場合があります。これを実装する場合は、次を確保してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- The default level must provide sufficient detail for business needs
- It should not be possible to completely deactivate application logging or logging of events that are necessary for compliance requirements
- Alterations to the level/extent of logging must be intrinsic to the application (e.g. undertaken automatically by the application based on an approved algorithm) or follow change management processes (e.g. changes to configuration data, modification of source code)
- The logging level must be verified periodically

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- デフォルトレベルは、業務ニーズに十分な詳細を提供する必要があります。
- アプリケーションログ、またはコンプライアンス要件に必要なイベントのログ記録を完全に無効化できるべきではありません。
- ログ記録レベルまたは範囲の変更は、アプリケーションに内在するもの (承認済みアルゴリズムに基づいてアプリケーションが自動的に実施するなど) であるか、変更管理プロセス (構成データの変更、ソースコードの修正など) に従う必要があります。
- ログ記録レベルは定期的に検証する必要があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Event collection

If your development framework supports suitable logging mechanisms, use or build upon that. Otherwise, implement an application-wide log handler which can be called from other modules/components.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### イベント収集

開発フレームワークが適切なログ記録メカニズムをサポートしている場合は、それを使用するか、その上に構築してください。そうでない場合は、他のモジュールやコンポーネントから呼び出せる、アプリケーション全体のログハンドラを実装してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Document the interface referencing the organisation-specific event classification and description syntax requirements.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

組織固有のイベント分類と説明構文の要件を参照して、そのインターフェースを文書化してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

If possible create this log handler as a standard module that can be thoroughly tested, deployed in multiple applications, and added to a list of approved and recommended modules.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

可能であれば、このログハンドラを、徹底的にテストでき、複数のアプリケーションにデプロイでき、承認済みかつ推奨されるモジュールの一覧に追加できる標準モジュールとして作成してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Perform input validation on event data from other trust zones to ensure it is in the correct format (and consider alerting and not logging if there is an input validation failure)
- Perform sanitization on all event data to prevent log injection attacks e.g. carriage return (CR), line feed (LF) and delimiter characters (and optionally to remove sensitive data)
- Encode data correctly for the output (logged) format
- If writing to databases, read, understand, and apply the SQL injection cheat sheet
- Ensure failures in the logging processes/systems do not prevent the application from otherwise running or allow information leakage
- Synchronize time across all servers and devices `Note C`

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- 他の信頼ゾーンからのイベントデータに対して入力検証を実施し、正しい形式であることを確認します (入力検証失敗がある場合は、アラートを出し、ログに記録しないことも検討します)。
- すべてのイベントデータに対してサニタイズを実施し、キャリッジリターン (CR)、ラインフィード (LF)、区切り文字などによるログインジェクション攻撃を防ぎます (任意で機微データも削除します)。
- 出力される (ログ記録される) 形式に合わせてデータを正しくエンコードします。
- データベースへ書き込む場合は、SQL インジェクションチートシートを読み、理解し、適用してください。
- ログ記録プロセスまたはシステムの失敗が、アプリケーションの通常動作を妨げたり、情報漏えいを許したりしないようにします。
- すべてのサーバーとデバイスで時刻を同期します `Note C`。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Note C:** This is not always possible where the application is running on a device under some other party's control (e.g. on an individual's mobile phone, on a remote customer's workstation which is on another corporate network). In these cases, attempt to measure the time offset, or record a confidence level in the event timestamp.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**Note C:** アプリケーションが他者の管理下にあるデバイス (個人の携帯電話、別の企業ネットワーク上にあるリモート顧客のワークステーションなど) で実行される場合、これは常に可能とは限りません。このような場合は、時刻のずれを測定するか、イベントタイムスタンプの信頼度レベルを記録するよう試みてください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Where possible, record data in a standard format, or at least ensure it can be exported/broadcast using an industry-standard format.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

可能な場合は、標準形式でデータを記録するか、少なくとも業界標準形式でエクスポートまたはブロードキャストできるようにしてください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

In some cases, events may be relayed or collected together in intermediate points. In the latter some data may be aggregated or summarized before forwarding on to a central repository and analysis system.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

場合によっては、イベントが中間地点でリレーされたり、まとめて収集されたりすることがあります。後者では、中央リポジトリおよび分析システムへ転送する前に、一部のデータが集約または要約される場合があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Verification

Logging functionality and systems must be included in code review, application testing and security verification processes:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 検証

ログ記録機能とログ記録システムは、コードレビュー、アプリケーションテスト、セキュリティ検証プロセスに含める必要があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Ensure the logging is working correctly and as specified
- Check that events are being classified consistently and the field names, types and lengths are correctly defined to an agreed standard
- Ensure logging is implemented and enabled during application security, fuzz, penetration, and performance testing
- Test the mechanisms are not susceptible to injection attacks
- Ensure there are no unwanted side-effects when logging occurs
- Check the effect on the logging mechanisms when external network connectivity is lost (if this is usually required)
- Ensure logging cannot be used to deplete system resources, for example by filling up disk space or exceeding database transaction log space, leading to denial of service
- Test the effect on the application of logging failures such as simulated database connectivity loss, lack of file system space, missing write permissions to the file system, and runtime errors in the logging module itself
- Verify access controls on the event log data
- If log data is utilized in any action against users (e.g. blocking access, account lock-out), ensure this cannot be used to cause denial of service (DoS) of other users

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- ログ記録が正しく、仕様どおりに動作していることを確認します。
- イベントが一貫して分類され、フィールド名、型、長さが合意済み標準に従って正しく定義されていることを確認します。
- アプリケーションセキュリティテスト、ファズテスト、ペネトレーションテスト、パフォーマンステスト中に、ログ記録が実装され有効化されていることを確認します。
- メカニズムがインジェクション攻撃を受けやすくないことをテストします。
- ログ記録時に望ましくない副作用がないことを確認します。
- 外部ネットワーク接続が失われた場合 (通常それが必要な場合) に、ログ記録メカニズムへ与える影響を確認します。
- ログ記録がシステムリソースを枯渇させるために使用されないことを確認します。たとえば、ディスク領域を埋め尽くしたり、データベーストランザクションログ領域を超過したりしてサービス拒否につながることがないようにします。
- データベース接続の喪失、ファイルシステム領域不足、ファイルシステムへの書き込み権限不足、ログ記録モジュール自体のランタイムエラーなど、ログ記録失敗がアプリケーションへ与える影響をテストします。
- イベントログデータへのアクセス制御を検証します。
- ログデータがユーザーに対する何らかのアクション (アクセス遮断、アカウントロックアウトなど) に利用される場合は、それが他のユーザーへのサービス拒否 (DoS) を引き起こすために使用できないことを確認します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Network architecture

As an example, the diagram below shows a service that provides business functionality to customers. We recommend creating a centralized system for collecting logs. There may be many such services, but all of them must securely collect logs in a centralized system.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### ネットワークアーキテクチャ

例として、下の図は顧客に業務機能を提供するサービスを示しています。ログを収集するための集中システムを作成することを推奨します。このようなサービスは多数存在し得ますが、それらすべてが集中システムへ安全にログを収集する必要があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Applications of this business service are located in network segments:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

この業務サービスのアプリケーションは、次のネットワークセグメントに配置されています。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- FRONTEND 1 aka DMZ (UI)
- MIDDLEWARE 1 (business application - service core)
- BACKEND 1 (service database)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- FRONTEND 1 aka DMZ (UI)
- MIDDLEWARE 1 (business application - service core)
- BACKEND 1 (service database)

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The service responsible for collecting IT events, including security events, is located in the following segments:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

セキュリティイベントを含む IT イベントの収集を担当するサービスは、次のセグメントに配置されています。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- BACKEND 2 (log storage)
- MIDDLEWARE 3 - 2 applications:
    - log loader application that download log from storage, pre-processes, and transfer to UI
    - log collector that accepts logs from business applications, other infrastructure, cloud applications and saves in log storage
- FRONTEND 2 (UI for viewing business service event logs)
- FRONTEND 3 (applications that receive logs from cloud applications and transfer logs to log collector)
    - It is allowed to combine the functionality of two applications in one

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- BACKEND 2 (log storage)
- MIDDLEWARE 3 - 2 applications:
    - log loader application that download log from storage, pre-processes, and transfer to UI
    - log collector that accepts logs from business applications, other infrastructure, cloud applications and saves in log storage
- FRONTEND 2 (UI for viewing business service event logs)
- FRONTEND 3 (applications that receive logs from cloud applications and transfer logs to log collector)
    - 2 つのアプリケーションの機能を 1 つにまとめることは許容されます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

For example, all external requests from users go through the API management service, see application in MIDDLEWARE 2 segment.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

たとえば、ユーザーからのすべての外部リクエストは API 管理サービスを通過します。MIDDLEWARE 2 セグメントのアプリケーションを参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

As you can see in the image above, at the network level, the processes of saving and downloading logs require opening different network accesses (ports), arrows are highlighted in different colors. Also, saving and downloading are performed by different applications.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

上の画像でわかるように、ネットワークレベルでは、ログの保存とダウンロードのプロセスで異なるネットワークアクセス (ポート) を開く必要があり、矢印は異なる色で強調されています。また、保存とダウンロードは別々のアプリケーションによって実行されます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Full network segmentation cheat sheet by [sergiomarotco](https://github.com/sergiomarotco): [link](https://github.com/sergiomarotco/Network-segmentation-cheat-sheet)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

[sergiomarotco](https://github.com/sergiomarotco) による完全なネットワークセグメンテーションチートシート: [link](https://github.com/sergiomarotco/Network-segmentation-cheat-sheet)

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

![MIDDLEWARE](https://raw.githubusercontent.com/OWASP/CheatSheetSeries/master/assets/Logging_Cheat_Sheet.drawio.png)

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Deployment and operation

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## デプロイと運用

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Release

- Provide security configuration information by adding details about the logging mechanisms to release documentation
- Brief the application/process owner about the application logging mechanisms
- Ensure the outputs of the monitoring (see below) are integrated with incident response processes

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### リリース

- ログ記録メカニズムに関する詳細をリリース文書に追加し、セキュリティ構成情報を提供します。
- アプリケーションまたはプロセスのオーナーに、アプリケーションログ記録メカニズムについて説明します。
- 監視 (下記参照) の出力がインシデント対応プロセスと統合されていることを確認します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Operation

Enable processes to detect whether logging has stopped, and to identify tampering or unauthorized access and deletion (see protection below).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 運用

ログ記録が停止したかどうかを検知し、改ざんまたは不正アクセスと削除を識別するプロセスを有効化します (下記の保護を参照)。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Protection

The logging mechanisms and collected event data must be protected from mis-use such as tampering in transit, and unauthorized access, modification and deletion once stored. Logs may contain personal and other sensitive information, or the data may contain information regarding the application's code and logic.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 保護

ログ記録メカニズムと収集されたイベントデータは、転送中の改ざん、保存後の不正アクセス、変更、削除などの悪用から保護する必要があります。ログには個人情報やその他の機微情報が含まれる可能性があり、またデータにはアプリケーションのコードやロジックに関する情報が含まれる可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

In addition, the collected information in the logs may itself have business value (to competitors, gossip-mongers, journalists and activists) such as allowing the estimate of revenues, or providing performance information about employees.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

さらに、ログ内の収集情報自体が、競合他社、噂話をする者、ジャーナリスト、活動家にとって業務上の価値を持つ場合があります。たとえば、収益を推定できたり、従業員のパフォーマンス情報を提供したりする可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

This data may be held on end devices, at intermediate points, in centralized repositories and in archives and backups.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

このデータは、エンドデバイス、中間地点、集中リポジトリ、アーカイブ、バックアップに保持される可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Consider whether parts of the data may need to be excluded, masked, sanitized, hashed, or encrypted during examination or extraction.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

調査または抽出時に、データの一部を除外、マスク、サニタイズ、ハッシュ化、または暗号化する必要があるかどうかを検討してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

At rest:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

保存時:

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Build in tamper detection so you know if a record has been modified or deleted
- Store or copy log data to read-only media as soon as possible
- All access to the logs must be recorded and monitored (and may need prior approval)
- The privileges to read log data should be restricted and reviewed periodically

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- レコードが変更または削除されたかどうかを把握できるように、改ざん検知を組み込みます。
- できるだけ早くログデータを読み取り専用媒体に保存またはコピーします。
- ログへのすべてのアクセスは記録し監視する必要があります (事前承認が必要になる場合もあります)。
- ログデータを読み取る権限は制限し、定期的にレビューするべきです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

In transit:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

転送中:

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- If log data is sent over untrusted networks (e.g. for collection, for dispatch elsewhere, for analysis, for reporting), use a secure transmission protocol
- Consider whether the origin of the event data needs to be verified
- Perform due diligence checks (regulatory and security) before sending event data to third parties

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- ログデータが信頼できないネットワーク経由で送信される場合 (収集、他所への送出、分析、レポート作成など)、安全な転送プロトコルを使用します。
- イベントデータの発生元を検証する必要があるかどうかを検討します。
- イベントデータを第三者へ送信する前に、規制面およびセキュリティ面のデューデリジェンスチェックを実施します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

See `NIST SP 800-92` Guide to Computer Security Log Management for more guidance.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

詳細なガイダンスについては、`NIST SP 800-92` Guide to Computer Security Log Management を参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Monitoring of events

The logged event data needs to be available to review and there are processes in place for appropriate monitoring, alerting, and reporting:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### イベントの監視

記録されたイベントデータはレビュー可能である必要があり、適切な監視、アラート、レポートのためのプロセスが整備されている必要があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Incorporate the application logging into any existing log management systems/infrastructure e.g. centralized logging and analysis systems
- Ensure event information is available to appropriate teams
- Enable alerting and signal the responsible teams about more serious events immediately
- Share relevant event information with other detection systems, to related organizations and centralized intelligence gathering/sharing systems

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- アプリケーションログを、既存のログ管理システムまたはインフラストラクチャ (集中ログおよび分析システムなど) に組み込みます。
- イベント情報が適切なチームに利用可能であることを確認します。
- より重大なイベントについてはアラートを有効化し、責任を持つチームへ直ちに通知します。
- 関連するイベント情報を、他の検知システム、関連組織、集中型のインテリジェンス収集または共有システムと共有します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Disposal of logs

Log data, temporary debug logs, and backups/copies/extractions, must not be destroyed before the duration of the required data retention period, and must not be kept beyond this time.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### ログの廃棄

ログデータ、一時的なデバッグログ、バックアップ、コピー、抽出物は、必要なデータ保持期間が経過する前に破棄してはならず、その期間を超えて保持してもなりません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Legal, regulatory and contractual obligations may impact on these periods.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

法的、規制上、契約上の義務が、これらの期間に影響する場合があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Attacks on Logs

Because of their usefulness as a defense, logs may be a target of attacks. See also OWASP [Log Injection](https://owasp.org/www-community/attacks/Log_Injection) and [CWE-117](https://cwe.mitre.org/data/definitions/117.html).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## ログへの攻撃

ログは防御として有用であるため、攻撃対象になることがあります。OWASP [Log Injection](https://owasp.org/www-community/attacks/Log_Injection) と [CWE-117](https://cwe.mitre.org/data/definitions/117.html) も参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Confidentiality

Who should be able to read what? A confidentiality attack enables an unauthorized party to access sensitive information stored in logs.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 機密性

誰が何を読めるべきでしょうか。機密性攻撃は、権限のない者がログに保存された機微情報へアクセスできるようにします。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Logs contain PII of users. Attackers gather PII, then either release it or use it as a stepping stone for further attacks on those users.
- Logs contain technical secrets such as passwords. Attackers use it as a stepping stone for deeper attacks.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- ログにはユーザーの PII が含まれます。攻撃者は PII を収集し、それを公開するか、そのユーザーへのさらなる攻撃の足がかりとして使用します。
- ログにはパスワードなどの技術的シークレットが含まれます。攻撃者はそれを、より深い攻撃への足がかりとして使用します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Integrity

Which information should be modifiable by whom?

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 完全性

どの情報を、誰が変更できるべきでしょうか。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- An attacker with read access to a log uses it to exfiltrate secrets.
- An attack leverages logs to connect with exploitable facets of logging platforms, such as sending in a payload over syslog in order to cause an out-of-bounds write.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- ログへの読み取りアクセスを持つ攻撃者は、それを使ってシークレットを外部へ持ち出します。
- 攻撃は、syslog 経由でペイロードを送信して境界外書き込みを引き起こすなど、ログ記録プラットフォームの悪用可能な側面にログを接続するよう利用します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Availability

What downtime is acceptable?

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 可用性

どの程度のダウンタイムが許容されるでしょうか。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- An attacker floods log files in order to exhaust disk space available for non-logging facets of system functioning. For example, the same disk used for log files might be used for SQL storage of application data.
- An attacker floods log files in order to exhaust disk space available for further logging.
- An attacker uses one log entry to destroy other log entries.
- An attacker leverages poor performance of logging code to reduce application performance

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- 攻撃者はログファイルを大量に書き込み、システム機能のうちログ以外の側面で利用可能なディスク領域を枯渇させます。たとえば、ログファイルに使用される同じディスクが、アプリケーションデータの SQL ストレージにも使用されている場合があります。
- 攻撃者はログファイルを大量に書き込み、さらなるログ記録に利用可能なディスク領域を枯渇させます。
- 攻撃者は 1 つのログエントリを使って他のログエントリを破壊します。
- 攻撃者はログ記録コードの低いパフォーマンスを利用して、アプリケーションのパフォーマンスを低下させます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Accountability

Who is responsible for harm?

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 説明責任

誰が損害に責任を負うのでしょうか。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- An attacker prevent writes in order to cover their tracks.
- An attacker prevent damages the log in order to cover their tracks.
- An attacker causes the wrong identity to be logged in order to conceal the responsible party.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- 攻撃者は痕跡を隠すために書き込みを妨げます。
- 攻撃者は痕跡を隠すためにログを破損させます。
- 攻撃者は責任主体を隠すために、誤った ID が記録されるようにします。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Related articles

- OWASP [ESAPI Documentation](https://owasp.org/www-project-enterprise-security-api/).
- OWASP [Logging Project](https://owasp.org/www-project-security-logging/).
- IETF [syslog protocol](https://tools.ietf.org/rfc/rfc5424.txt).
- Mitre [Common Event Expression (CEE)](https://cee.mitre.org/) (as of 2014 no longer actively developed).
- NIST [SP 800-92 Guide to Computer Security Log Management](https://csrc.nist.gov/publications/nistpubs/800-92/SP800-92.pdf).
- PCISSC [PCI DSS v2.0 Requirement 10 and PA-DSS v2.0 Requirement 4](https://www.pcisecuritystandards.org/security_standards/documents.php).
- W3C [Extended Log File Format](https://www.w3.org/TR/WD-logfile.html).
- Other [Build Visibility In, Richard Bejtlich, TaoSecurity blog](https://taosecurity.blogspot.co.uk/2009/08/build-visibility-in.html).
- Other [Common Event Format (CEF), Arcsight](https://community.microfocus.com/t5/ArcSight-Connectors/ArcSight-Common-Event-Format-CEF-Implementation-Standard/ta-p/1645557).
- Other [Log Event Extended Format (**LEEF**), IBM](https://www.ibm.com/developerworks/community/wikis/form/anonymous/api/wiki/9989d3d7-02c1-444e-92be-576b33d2f2be/page/3dc63f46-4a33-4e0b-98bf-4e55b74e556b/attachment/a19b9122-5940-4c89-ba3e-4b4fc25e2328/media/QRadar_LEEF_Format_Guide.pdf).
- Other [Common Log File System (CLFS), Microsoft](https://msdn.microsoft.com/en-us/library/windows/desktop/bb986747%28v=vs.85).aspx).
- Other [Building Secure Applications: Consistent Logging, Rohit Sethi & Nish Bhalla, Symantec Connect](https://www.symantec.com/connect/articles/building-secure-applications-consistent-logging).

</div>

</div>

</section>
</div>



## Attribution

<div className="attributionFooter">

- Original: Logging Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: English original retained for comparison. Japanese translation added. Bilingual display generated from official source and local Japanese translation.
- Retrieved: 2026-05-20

</div>
