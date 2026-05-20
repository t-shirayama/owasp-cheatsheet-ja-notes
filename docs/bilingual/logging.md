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

<div className="tabbedContent">
  <input className="tabInput" type="radio" name="logging-view" id="logging-translation" defaultChecked />
  <input className="tabInput" type="radio" name="logging-view" id="logging-summary" />
  <input className="tabInput" type="radio" name="logging-view" id="logging-checklist" />
  <input className="tabInput" type="radio" name="logging-view" id="logging-bilingual" />

  <div className="contentTabs">
    <label htmlFor="logging-translation">翻訳</label>
    <label htmlFor="logging-summary">要点</label>
    <label htmlFor="logging-checklist">チェックリスト</label>
    <label htmlFor="logging-bilingual">対比表示</label>
  </div>

<section id="logging-translation-panel" className="tabPanel translationPanel contentPanel">

## 目的

アプリケーションは、セキュリティイベントを必ずログ記録の対象に含めるべきです。ログは運用上のデバッグや性能監視だけでなく、攻撃の兆候、ポリシー違反、監査証跡、不正操作、脆弱性悪用の試行、インシデント調査に必要なアプリケーション固有の文脈を提供します。

監査ログ、業務プロセスログ、トランザクションログ、セキュリティイベントログは目的が異なるため、同じログ基盤に送る場合でも用途や分類を分けて扱います。何をどの程度記録するかは、利用目的と情報セキュリティリスクに応じて決めます。

### イベントデータの発生源

最も重要な発生源はアプリケーションコードです。アプリケーションは、ユーザーの識別子、ロール、権限、対象オブジェクト、実行アクション、処理結果など、周辺インフラでは得られない文脈を持っています。

クライアント、組み込み計測コード、WAF、IDS/IPS、データベース監査、OS、関連アプリケーションなどからの情報も補助的に利用できます。ただし、別の信頼境界から来たイベントデータは、欠落、改ざん、偽造、再送、悪意ある値を含む可能性があるため、常に未信頼データとして扱います。

### ログの保存先

ログはファイルシステム、データベース、標準出力、集中ログ基盤、SIEM などに記録できます。実行環境がログを回収する設計であれば、アプリケーションが標準出力へイベントを流す構成も選択肢になります。

ファイルに保存する場合は、OS、アプリケーション本体、ユーザー生成コンテンツとは分離した領域を使い、ディレクトリとファイルの権限を厳しく制限します。Web から直接参照できる場所にログを置いてはいけません。データベースに保存する場合は、ログ書き込み専用で権限を絞ったアカウントを使います。外部へ送信する場合は、標準形式と安全なプロトコルを使い、集中ログ基盤と連携しやすくします。

### 記録すべきイベント

ログ対象は、要件定義と設計段階で決めます。画一的なチェックリストだけに頼ると、ノイズが増えて本当に重要な問題を見落とす可能性があります。

可能な限り常に記録するイベントは次のとおりです。

- 入力検証の失敗。プロトコル違反、許容されないエンコーディング、不正なパラメータ名や値を含みます。
- 出力検証の失敗。想定外のレコード集合、不正なデータエンコーディングなどを含みます。
- 認証の成功と失敗。ブルートフォース、クレデンシャルスタッフィング、パスワードスプレーなどの早期検知に使います。
- 認可の失敗。アクセス制御の拒否、権限不足、対象オブジェクトへの不正アクセス試行を含みます。
- セッション管理の失敗。セッション ID の改変、疑わしい JWT 検証失敗などを含みます。
- アプリケーションエラーとシステムイベント。実行時エラー、接続問題、性能問題、外部サービスエラー、ファイルシステムエラー、ウイルス検知、構成変更などを含みます。
- アプリケーションや関連システムの起動、停止、ログ機能の初期化、停止、一時停止を含みます。
- 高リスク機能の利用。ユーザー管理、権限変更、管理者操作、共通アカウントや緊急用アカウントの利用、機密データアクセス、暗号鍵の利用やローテーション、データのインポートやエクスポート、ファイルアップロード、デシリアライゼーション失敗、バックエンド TLS 失敗などを含みます。
- 利用規約、個人データ利用、モバイル機能権限、マーケティング同意など、法的同意やオプトインの変更を含みます。
- 業務フローを外れた操作、順序を無視した操作、制限超過など、疑わしいビジネスロジック活動を含みます。

必要に応じて、シーケンス失敗、過剰利用、データ変更、不正行為、構成変更、アプリケーションコードやメモリの変更も記録対象として検討します。

### イベント属性

各ログエントリには、後続の監視と分析に十分な情報を含めます。基本は「いつ、どこで、誰が、何を」を記録することです。

- いつ: ログ記録日時、イベント発生日時、ユーザー操作単位を追跡する相互作用 ID。
- どこで: アプリケーション名とバージョン、ホスト、IP アドレス、ポート、サービス名、URL、HTTP メソッド、コード位置。
- 誰が: 送信元アドレス、端末識別子、ユーザー ID、ユーザー名など。未認証でも識別可能な情報があれば記録します。
- 何を: イベント種別、重大度、セキュリティ関連フラグ、説明、アクション、対象オブジェクト、成功・失敗・保留などの結果、理由、HTTP ステータス、分析信頼度、アプリケーションが取った応答。

組織全体でイベント種別、重大度、信頼度、説明文の構文、フィールド名、型、長さ、日時形式を統一し、文書化します。

### 記録してはいけないデータ

法的に許可されていないデータをログに記録してはいけません。従業員監視、通信傍受、同意のないデータ収集などは、管轄や状況によって違法になる可能性があります。

次の情報は、通常ログへ直接記録せず、削除、マスク、サニタイズ、ハッシュ化、暗号化などを行います。

- アプリケーションソースコード
- セッション識別子
- アクセストークン
- 機微な個人データや一部の PII
- 認証パスワード
- データベース接続文字列
- 暗号鍵や主要なシークレット
- 銀行口座や決済カード情報
- ログ基盤が保存を許可されていない高分類データ
- 商業上の機密情報
- 収集が違法な情報
- ユーザーが収集を拒否した情報、または同意期限が切れた情報

ファイルパス、内部ネットワーク名、内部アドレス、氏名、電話番号、メールアドレスなどは調査に役立つ場合がありますが、記録前に特別な取り扱いが必要になることがあります。個人の識別が不要な場合やリスクが高い場合は、削除、スクランブル、仮名化などの非識別化を検討します。

### ログレベルの変更

ログの詳細度や対象イベントは、脅威レベルや重大度に応じて変更できる場合があります。ただし、デフォルトレベルは業務上必要な詳細を十分に含め、アプリケーションログやコンプライアンス上必要なイベントを完全に無効化できないようにします。変更は承認済みアルゴリズムや変更管理プロセスに基づけ、定期的に有効性を検証します。

### イベント収集と実装

フレームワークに適切なログ機能があれば、それを利用または拡張します。そうでなければ、アプリケーション全体で共通して呼び出せるログハンドラを実装します。ログハンドラのインターフェースは、組織固有の分類、重大度、説明文の構文を参照して文書化します。

ログイベントには入力検証を行い、CR、LF、区切り文字などによるログインジェクションを防ぐためにサニタイズします。出力形式に合わせて適切にエンコードし、データベースへ書き込む場合は SQL インジェクション対策も適用します。ログ処理やログ基盤の障害が、アプリケーション全体の停止や情報漏えいにつながらないようにします。

### 検証

ログ機能はコードレビュー、アプリケーションテスト、セキュリティ検証の対象に含めます。ログが仕様どおりに動作すること、分類やフィールド定義が一貫していること、ログインジェクションに弱くないこと、ログ記録時に不要な副作用がないこと、ネットワーク断やストレージ不足などの障害時にも安全に振る舞うことを確認します。

ログデータへのアクセス制御も検証します。ログを使ってユーザーのアクセス制限やアカウントロックなどを行う場合は、その仕組みが別ユーザーへの DoS に悪用されないことも確認します。

### デプロイと運用

リリース時には、ログ機能の設定情報をリリース文書に含め、アプリケーションまたはプロセスオーナーへ説明します。ログ監視の出力はインシデント対応プロセスと連携させます。

運用では、ログ停止、改ざん、不正アクセス、不正削除を検知できるプロセスを用意します。ログは転送中、保存中、閲覧時、アーカイブやバックアップ内でも保護対象です。保存時は改ざん検知、読み取り専用媒体への早期コピー、アクセス記録、アクセス権の定期レビューを検討します。信頼できないネットワークで送信する場合は、安全な転送プロトコルを使い、必要に応じて発生元の検証も行います。

ログの保持期間は、法令、規制、契約、業務要件に従います。必要な保持期間が終わる前に破棄してはいけませんが、保持期間を超えて不要に保存し続けてもいけません。

### ログへの攻撃

ログは防御に役立つため、攻撃対象にもなります。主な観点は次の4つです。

- 機密性: 権限のない者がログ内の PII、技術的シークレット、業務情報を読める状態を防ぎます。
- 完全性: ログの改ざん、削除、偽造、ログ基盤への攻撃ペイロード混入を防ぎます。
- 可用性: ログ肥大化によるディスク枯渇、ログ処理の性能劣化、ログ記録不能を防ぎます。
- 説明責任: 攻撃者が証跡を消す、壊す、別人の ID を記録させることで責任主体を隠すことを防ぎます。

</section>

<section id="logging-summary-panel" className="tabPanel summaryPanel contentPanel">

アプリケーションログは、インフラログだけでは見えない「誰が、どこで、何を、どの結果で行ったか」を把握するための重要なセキュリティ機能です。認証、認可、セッション、入力検証、高リスク操作、システムエラーなどのイベントは、攻撃検知、調査、監査、インシデント対応に直結します。

ログは多ければよいわけではありません。過剰なログは重要な兆候を埋もれさせ、機密情報の漏えい面を増やします。不足したログは、攻撃の検知、原因調査、説明責任を困難にします。設計段階で目的、対象イベント、属性、保護、保持期間、監視方法を決めておく必要があります。

## 要点

- アプリケーションログは、ユーザー、ロール、対象オブジェクト、実行アクション、処理結果など、アプリケーション固有の文脈を含める。
- ログ対象イベントは要件定義と設計段階で決め、入力検証失敗、認証、認可、セッション、高リスク操作、システムイベントを含める。
- 各ログエントリには「いつ、どこで、誰が、何を」を分析可能な形で含める。
- 同意、オプトイン、個人データ利用許可は、取得、撤回、期限切れ、対象データ、処理目的まで追跡できるようにする。
- パスワード、アクセストークン、暗号鍵、セッション ID、機微な個人情報などはログに直接記録しない。
- ログイベントには入力検証、サニタイズ、出力エンコーディングを適用し、ログインジェクションを防ぐ。
- ログ基盤の障害がアプリケーション停止や情報漏えいにつながらないようにする。
- ログは攻撃対象でもあるため、機密性、完全性、可用性、説明責任を保護する。

## 実装時の注意点

- 認証失敗だけでなく、認証成功も記録します。成功イベントは、攻撃後の調査や異常なログインパターンの検知に必要です。
- 「内部システム」「信頼済み第三者」「監視サービス」「ペンテスター」などの既知ユーザーをログ対象から除外してはいけません。必要に応じて分類フラグを付けます。
- ログの詳細度を変更できる設計にする場合でも、セキュリティやコンプライアンスに必要なイベントは無効化できないようにします。
- ログだけで強い否認防止を達成するのは難しいため、署名、時刻同期、改ざん検知、アクセス監査などを組み合わせて信頼性を高めます。
- ログ本文を UI で表示する場合も、表示前のサニタイズと出力エンコーディングを行います。
- ログ停止、改ざん、不正削除を検知できなければ、インシデント発生時に証跡が失われます。監視とアラートをログ基盤自体にも適用します。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V10.7 Consent Management | 同意、オプトイン、個人データ利用許可の記録 |
| V16.1 Security Logging Documentation | ログ方針、対象イベント、分類、保持、監視の文書化 |
| V16.2 General Logging | 一般的なログ実装、属性、ログレベル、収集方法 |
| V16.3 Security Events | セキュリティイベントの選定と記録 |
| V16.4 Log Protection | ログの機密性、完全性、可用性、説明責任の保護 |

</section>

<section id="logging-checklist-panel" className="tabPanel checklistPanel contentPanel">

## V16.1 Security Logging Documentation

- [ ] セキュリティイベントログの目的を、検知、調査、監査、インシデント対応の観点で定義する。
- [ ] 監査ログ、業務ログ、トランザクションログ、セキュリティイベントログの用途と保存先を分けて設計する。
- [ ] ログ対象イベントをリスクに応じて定義し、ノイズだけが増える網羅主義にしない。
- [ ] ログの保存先、転送経路、集中ログ基盤、SIEM 連携の有無を決める。
- [ ] ログの保持期間と削除方針を、法令、規制、契約、業務要件に基づいて定義する。
- [ ] 文書化する: イベント種別、重大度、信頼度、日時形式、フィールド名、型、長さを組織内で統一する。

### V16.3 Security Events

- [ ] 入力検証失敗を記録する。
- [ ] 出力検証失敗を記録する。
- [ ] 認証成功と認証失敗を記録する。
- [ ] 認可失敗を記録する。
- [ ] セッション管理失敗を記録する。
- [ ] アプリケーションエラー、外部サービスエラー、構成変更を記録する。
- [ ] アプリケーション、関連システム、ログ機能の起動、停止、初期化を記録する。
- [ ] ユーザー管理、権限変更、管理者操作、緊急用アカウント利用を記録する。
- [ ] 機密データアクセス、データのインポート、エクスポート、ファイルアップロードを記録する。
- [ ] 暗号鍵の利用、更新、ローテーションなどの高リスク暗号操作を記録する。
- [ ] 業務フロー逸脱、順序違反、制限超過などの疑わしいビジネスロジック操作を記録する。

### V10.7 Consent Management

- [ ] 記録する: 利用規約、個人データ利用、モバイル機能権限、マーケティング同意などの同意とオプトイン変更を記録する。
- [ ] 記録する: 同意の取得、撤回、期限切れ、対象データ、処理目的、ユーザーまたは主体、時刻を追跡できるようにする。

### V16.2 General Logging

- [ ] 各イベントに発生日時、記録日時、相互作用 ID を含める。
- [ ] アプリケーション名、バージョン、ホスト、サービス、URL、HTTP メソッド、コード位置を記録する。
- [ ] ユーザー ID、送信元、端末識別子など、責任主体の調査に必要な情報を記録する。
- [ ] イベント種別、重大度、結果、理由、対象オブジェクト、アプリケーションの応答を記録する。
- [ ] 実装する: フレームワーク標準のログ機能、または共通ログハンドラを使う。
- [ ] 検証する: 別の信頼境界から受け取ったイベントデータを未信頼として検証する。
- [ ] エンコードする: ログ出力形式に合わせてエンコードする。
- [ ] 制限する: DB へログを書く場合は、書き込み専用で権限を絞ったアカウントを使う。

### V16.4 Log Protection

- [ ] パスワード、アクセストークン、暗号鍵、主要シークレットをログに直接記録しない。
- [ ] セッション ID は必要な場合でもハッシュ化などで直接値を避ける。
- [ ] PII、機微データ、決済情報、商業機密を削除、マスク、ハッシュ化、暗号化する。
- [ ] ログ出力前に CR、LF、区切り文字などをサニタイズしてログインジェクションを防ぐ。
- [ ] ログを Web 公開ディレクトリに保存しない。
- [ ] ログ保存先の読み取り、書き込み、削除権限を最小化する。
- [ ] ログへのアクセスを記録し、監視する。
- [ ] 保存中のログに改ざん検知または読み取り専用化の仕組みを設ける。
- [ ] 信頼できないネットワークでログを転送する場合は安全なプロトコルを使う。

### 検証

- [ ] ログ基盤やログ処理の障害がアプリケーション停止や情報漏えいにつながらないことをテストする。
- [ ] ディスク枯渇、DB 接続断、権限不足、ネットワーク断、ログモジュール例外をテストする。
- [ ] ログインジェクションに対するテストを行う。
- [ ] ログを利用したアカウントロックや遮断が、第三者への DoS に悪用されないことを確認する。
- [ ] ログ停止、改ざん、不正削除を検知できる監視を用意する。

</section>

<section id="logging-bilingual-panel" className="tabPanel bilingualPanel">

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

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

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 目的

アプリケーションは、セキュリティイベントを必ずログ記録の対象に含めるべきです。ログは運用上のデバッグや性能監視だけでなく、攻撃の兆候、ポリシー違反、監査証跡、不正操作、脆弱性悪用の試行、インシデント調査に必要なアプリケーション固有の文脈を提供します。

監査ログ、業務プロセスログ、トランザクションログ、セキュリティイベントログは目的が異なるため、同じログ基盤に送る場合でも用途や分類を分けて扱います。何をどの程度記録するかは、利用目的と情報セキュリティリスクに応じて決めます。

### イベントデータの発生源

最も重要な発生源はアプリケーションコードです。アプリケーションは、ユーザーの識別子、ロール、権限、対象オブジェクト、実行アクション、処理結果など、周辺インフラでは得られない文脈を持っています。

クライアント、組み込み計測コード、WAF、IDS/IPS、データベース監査、OS、関連アプリケーションなどからの情報も補助的に利用できます。ただし、別の信頼境界から来たイベントデータは、欠落、改ざん、偽造、再送、悪意ある値を含む可能性があるため、常に未信頼データとして扱います。

### ログの保存先

ログはファイルシステム、データベース、標準出力、集中ログ基盤、SIEM などに記録できます。実行環境がログを回収する設計であれば、アプリケーションが標準出力へイベントを流す構成も選択肢になります。

ファイルに保存する場合は、OS、アプリケーション本体、ユーザー生成コンテンツとは分離した領域を使い、ディレクトリとファイルの権限を厳しく制限します。Web から直接参照できる場所にログを置いてはいけません。データベースに保存する場合は、ログ書き込み専用で権限を絞ったアカウントを使います。外部へ送信する場合は、標準形式と安全なプロトコルを使い、集中ログ基盤と連携しやすくします。

### 記録すべきイベント

ログ対象は、要件定義と設計段階で決めます。画一的なチェックリストだけに頼ると、ノイズが増えて本当に重要な問題を見落とす可能性があります。

可能な限り常に記録するイベントは次のとおりです。

- 入力検証の失敗。プロトコル違反、許容されないエンコーディング、不正なパラメータ名や値を含みます。
- 出力検証の失敗。想定外のレコード集合、不正なデータエンコーディングなどを含みます。
- 認証の成功と失敗。ブルートフォース、クレデンシャルスタッフィング、パスワードスプレーなどの早期検知に使います。
- 認可の失敗。アクセス制御の拒否、権限不足、対象オブジェクトへの不正アクセス試行を含みます。
- セッション管理の失敗。セッション ID の改変、疑わしい JWT 検証失敗などを含みます。
- アプリケーションエラーとシステムイベント。実行時エラー、接続問題、性能問題、外部サービスエラー、ファイルシステムエラー、ウイルス検知、構成変更などを含みます。
- アプリケーションや関連システムの起動、停止、ログ機能の初期化、停止、一時停止を含みます。
- 高リスク機能の利用。ユーザー管理、権限変更、管理者操作、共通アカウントや緊急用アカウントの利用、機密データアクセス、暗号鍵の利用やローテーション、データのインポートやエクスポート、ファイルアップロード、デシリアライゼーション失敗、バックエンド TLS 失敗などを含みます。
- 利用規約、個人データ利用、モバイル機能権限、マーケティング同意など、法的同意やオプトインの変更を含みます。
- 業務フローを外れた操作、順序を無視した操作、制限超過など、疑わしいビジネスロジック活動を含みます。

必要に応じて、シーケンス失敗、過剰利用、データ変更、不正行為、構成変更、アプリケーションコードやメモリの変更も記録対象として検討します。

### イベント属性

各ログエントリには、後続の監視と分析に十分な情報を含めます。基本は「いつ、どこで、誰が、何を」を記録することです。

- いつ: ログ記録日時、イベント発生日時、ユーザー操作単位を追跡する相互作用 ID。
- どこで: アプリケーション名とバージョン、ホスト、IP アドレス、ポート、サービス名、URL、HTTP メソッド、コード位置。
- 誰が: 送信元アドレス、端末識別子、ユーザー ID、ユーザー名など。未認証でも識別可能な情報があれば記録します。
- 何を: イベント種別、重大度、セキュリティ関連フラグ、説明、アクション、対象オブジェクト、成功・失敗・保留などの結果、理由、HTTP ステータス、分析信頼度、アプリケーションが取った応答。

組織全体でイベント種別、重大度、信頼度、説明文の構文、フィールド名、型、長さ、日時形式を統一し、文書化します。

### 記録してはいけないデータ

法的に許可されていないデータをログに記録してはいけません。従業員監視、通信傍受、同意のないデータ収集などは、管轄や状況によって違法になる可能性があります。

次の情報は、通常ログへ直接記録せず、削除、マスク、サニタイズ、ハッシュ化、暗号化などを行います。

- アプリケーションソースコード
- セッション識別子
- アクセストークン
- 機微な個人データや一部の PII
- 認証パスワード
- データベース接続文字列
- 暗号鍵や主要なシークレット
- 銀行口座や決済カード情報
- ログ基盤が保存を許可されていない高分類データ
- 商業上の機密情報
- 収集が違法な情報
- ユーザーが収集を拒否した情報、または同意期限が切れた情報

ファイルパス、内部ネットワーク名、内部アドレス、氏名、電話番号、メールアドレスなどは調査に役立つ場合がありますが、記録前に特別な取り扱いが必要になることがあります。個人の識別が不要な場合やリスクが高い場合は、削除、スクランブル、仮名化などの非識別化を検討します。

### ログレベルの変更

ログの詳細度や対象イベントは、脅威レベルや重大度に応じて変更できる場合があります。ただし、デフォルトレベルは業務上必要な詳細を十分に含め、アプリケーションログやコンプライアンス上必要なイベントを完全に無効化できないようにします。変更は承認済みアルゴリズムや変更管理プロセスに基づけ、定期的に有効性を検証します。

### イベント収集と実装

フレームワークに適切なログ機能があれば、それを利用または拡張します。そうでなければ、アプリケーション全体で共通して呼び出せるログハンドラを実装します。ログハンドラのインターフェースは、組織固有の分類、重大度、説明文の構文を参照して文書化します。

ログイベントには入力検証を行い、CR、LF、区切り文字などによるログインジェクションを防ぐためにサニタイズします。出力形式に合わせて適切にエンコードし、データベースへ書き込む場合は SQL インジェクション対策も適用します。ログ処理やログ基盤の障害が、アプリケーション全体の停止や情報漏えいにつながらないようにします。

### 検証

ログ機能はコードレビュー、アプリケーションテスト、セキュリティ検証の対象に含めます。ログが仕様どおりに動作すること、分類やフィールド定義が一貫していること、ログインジェクションに弱くないこと、ログ記録時に不要な副作用がないこと、ネットワーク断やストレージ不足などの障害時にも安全に振る舞うことを確認します。

ログデータへのアクセス制御も検証します。ログを使ってユーザーのアクセス制限やアカウントロックなどを行う場合は、その仕組みが別ユーザーへの DoS に悪用されないことも確認します。

### デプロイと運用

リリース時には、ログ機能の設定情報をリリース文書に含め、アプリケーションまたはプロセスオーナーへ説明します。ログ監視の出力はインシデント対応プロセスと連携させます。

運用では、ログ停止、改ざん、不正アクセス、不正削除を検知できるプロセスを用意します。ログは転送中、保存中、閲覧時、アーカイブやバックアップ内でも保護対象です。保存時は改ざん検知、読み取り専用媒体への早期コピー、アクセス記録、アクセス権の定期レビューを検討します。信頼できないネットワークで送信する場合は、安全な転送プロトコルを使い、必要に応じて発生元の検証も行います。

ログの保持期間は、法令、規制、契約、業務要件に従います。必要な保持期間が終わる前に破棄してはいけませんが、保持期間を超えて不要に保存し続けてもいけません。

### ログへの攻撃

ログは防御に役立つため、攻撃対象にもなります。主な観点は次の4つです。

- 機密性: 権限のない者がログ内の PII、技術的シークレット、業務情報を読める状態を防ぎます。
- 完全性: ログの改ざん、削除、偽造、ログ基盤への攻撃ペイロード混入を防ぎます。
- 可用性: ログ肥大化によるディスク枯渇、ログ処理の性能劣化、ログ記録不能を防ぎます。
- 説明責任: 攻撃者が証跡を消す、壊す、別人の ID を記録させることで責任主体を隠すことを防ぎます。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>


![MIDDLEWARE](https://raw.githubusercontent.com/OWASP/CheatSheetSeries/master/assets/Logging_Cheat_Sheet.drawio.png)

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

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
- Changes: English original retained for comparison. Japanese translation added. Bilingual display generated from official source and local Japanese notes.
- Retrieved: 2026-05-20

</div>
