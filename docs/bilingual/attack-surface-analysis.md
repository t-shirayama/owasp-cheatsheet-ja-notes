---
title: Attack Surface Analysis Cheat Sheet
hide_title: true
---

<div className="docHero" data-category="asvs-v15">
  <h1>攻撃対象領域分析チートシート</h1>
  <div className="docMeta">
    <span className="docPill">最終更新: 2026-05-20</span>
    <span className="docPill">読了時間: 準備中</span>
    <span className="docPill">カテゴリ: セキュアコーディングとアーキテクチャ</span>
  </div>
</div>

<p className="docLead">攻撃対象領域分析チートシートを、原文・翻訳・対比表示で確認できます。ASVS Index 対応の文脈で、公式原文と日本語訳を確認しやすく整理しています。</p>

<div className="tabbedContent">
  <input className="tabInput" type="radio" name="attack-surface-analysis-view" id="attack-surface-analysis-original" />
  <input className="tabInput" type="radio" name="attack-surface-analysis-view" id="attack-surface-analysis-translation" defaultChecked />
  <input className="tabInput" type="radio" name="attack-surface-analysis-view" id="attack-surface-analysis-bilingual" />

  <div className="contentTabs">
    <label htmlFor="attack-surface-analysis-original" title="OWASP 原文">原文</label>
    <label htmlFor="attack-surface-analysis-translation" title="日本語訳">翻訳</label>
    <label htmlFor="attack-surface-analysis-bilingual" title="原文と翻訳を並べて確認">対比表示</label>
  </div>

<section id="attack-surface-analysis-original-panel" className="tabPanel originalPanel contentPanel">

## What is Attack Surface Analysis and Why is it Important

This article describes a simple and pragmatic way of doing Attack Surface Analysis and managing an application's Attack Surface. It is targeted to be used by developers to understand and manage application security risks as they design and change an application, as well as by application security specialists doing a security risk assessment. The focus here is on protecting an application from external attack - it does not take into account attacks on the users or operators of the system (e.g. malware injection, social engineering attacks), and there is less focus on insider threats, although the principles remain the same. The internal attack surface is likely to be different from the external attack surface and some users may have a lot of access.

Attack Surface Analysis is about mapping out what parts of a system need to be reviewed and tested for security vulnerabilities. The point of Attack Surface Analysis is to understand the risk areas in an application, to make developers and security specialists aware of what parts of the application are open to attack, to find ways of minimizing this, and to notice when and how the Attack Surface changes and what this means from a risk perspective.

While Attack Surface Analysis is usually done by security architects and pen testers, developers should understand and monitor the Attack Surface as they design and build and change a system.

Attack Surface Analysis helps you to:

1. identify what functions and what parts of the system you need to review/test for security vulnerabilities
2. identify high risk areas of code that require defense-in-depth protection - what parts of the system that you need to defend
3. identify when you have changed the attack surface and need to do some kind of threat assessment

## Defining the Attack Surface of an Application

The Attack Surface describes all of the different points where an attacker could get into a system, and where they could get data out.

The Attack Surface of an application is:

1. the sum of all paths for data/commands into and out of the application, and
2. the code that protects these paths (including resource connection and authentication, authorization, activity logging, data validation and encoding)
3. all valuable data used in the application, including secrets and keys, intellectual property, critical business data, personal data and PII, and
4. the code that protects these data (including encryption and checksums, access auditing, and data integrity and operational security controls).

You overlay this model with the different types of users - roles, privilege levels - that can access the system (whether authorized or not). Complexity increases with the number of different types of users. It is important to focus on the two extremes: unauthenticated, anonymous users and highly privileged admin users (e.g. database administrators, system administrators).

Group each type of attack point into buckets based on risk (external-facing or internal-facing), purpose, implementation, design and technology. Then, count the number of attack points of each type. Next, choose some cases for each type. Finally, focus your review/assessment on those cases.

With this approach, you don't need to understand every endpoint in order to understand the Attack Surface and the potential risk profile of a system. Instead, you can count the different general type of endpoints and the number of points of each type. This enables you to budget what it will take to assess risk at scale, and you can tell when the risk profile of an application has significantly changed.

### Microservice and Cloud Native Applications

Microservice and Cloud Native applications are comprised of multiple smaller components, loosely coupled using APIs and independently scalable. When assessing the attack surface for applications of this architectural style, you should prioritize the components that are reachable from an attack source (e.g. external traffic from the Internet). Such components may be located behind tiers of proxies, load balancers and ingress controllers, and may auto-scale without warning.

Open source tooling such as [Cilium Hubble](https://github.com/cilium/hubble) and [kubeshark](https://github.com/kubeshark/kubeshark) assist in visualizing the attack surface for Kubernetes and service-mesh deployments.

## Identifying and Mapping the Attack Surface

You can start building a baseline description of the Attack Surface in a picture and notes. Spend a few hours reviewing design and architecture documents from an attacker's perspective. Read through the source code and identify different points of entry/exit:

- User interface (UI) forms and fields
- HTTP headers and cookies
- APIs
- Files
- Databases
- Other local storage
- Email or other kinds of messages
- Runtime arguments
- ...Your points of entry/exit

The total number of different attack points can easily add up into the thousands or more. To make this manageable, break the model into different types based on function, design and technology:

- Login/authentication entry points
- Admin interfaces
- Inquiries and search functions
- Data entry (CRUD) forms
- Business workflows
- Transactional interfaces/APIs
- Operational command and monitoring interfaces/APIs
- Interfaces with other applications/systems
- ...Your types

You also need to identify the valuable data (e.g. confidential, sensitive, regulated) in the application, by interviewing developers and users of the system, and again by reviewing the source code.

You can also build up a picture of the Attack Surface by scanning the application. For web apps you can use a tool like [ZAP](https://www.zaproxy.org/), [Arachni](http://arachni-scanner.com/), [Skipfish](http://code.google.com/p/skipfish/), [w3af](https://docs.w3af.org), or one of the many commercial dynamic testing and vulnerability scanning tools or services to crawl your app and map the parts of the application that are accessible over the web. Some web application firewalls (WAFs) may also be able to export a model of the application's entry points.

Validate and fill in your understanding of the Attack Surface by walking through some of the main use cases in the system: signing up and creating a user profile, logging in, searching for an item, placing an order, changing an order, and so on. Follow the flow of control and data through the system, see how information is validated and where it is stored, what resources are touched and what other systems are involved. There is a recursive relationship between Attack Surface Analysis and [Application Threat Modeling](https://owasp.org/www-community/Application_Threat_Modeling): changes to the Attack Surface should trigger threat modeling, and threat modeling helps you to understand the Attack Surface of the application.

The Attack Surface model may be rough and incomplete to start, especially if you haven't done any security work on the application before. Fill in the holes as you dig deeper in a security analysis, or as you work more with the application and realize that your understanding of the Attack Surface has improved.

## Measuring and Assessing the Attack Surface

Once you have a map of the Attack Surface, identify the high risk areas. Focus on remote entry points – interfaces with outside systems and to the Internet – and especially where the system allows anonymous, public access.

- Network-facing, especially internet-facing code
- Web forms
- Files from outside of the network
- Backward compatible interfaces with other systems – old protocols, sometimes old code and libraries, hard to maintain and test multiple versions
- Custom APIs – protocols etc – likely to have mistakes in design and implementation
- Security code: anything to do with cryptography, authentication, authorization (access control) and session management

These are often where you are most exposed to attack. Then understand what compensating controls you have in place, operational controls like network firewalls and application firewalls, and intrusion detection or prevention systems to help protect your application.

Michael Howard at Microsoft and other researchers have developed a method for measuring the Attack Surface of an application, and to track changes to the Attack Surface over time, called the [Relative Attack Surface Quotient (RSQ)](https://www.cs.cmu.edu/~wing/publications/Howard-Wing03.pdf). Using this method you calculate an overall attack surface score for the system, and measure this score as changes are made to the system and to how it is deployed. Researchers at Carnegie Mellon built on this work to develop a formal way to calculate an [Attack Surface Metric](https://mlsec.info/pdf/tse11.pdf) for large systems like SAP. They calculate the Attack Surface as the sum of all entry and exit points, channels (the different ways that clients or external systems connect to the system, including TCP/UDP ports, RPC endpoints, named pipes...) and untrusted data elements. Then they apply a damage potential/effort ratio to these Attack Surface elements to identify high-risk areas.

Note that deploying multiple versions of an application, leaving features in that are no longer used just in case they may be needed in the future, or leaving old backup copies and unused code increases the Attack Surface. Source code control and robust change management/configurations practices should be used to ensure the actual deployed Attack Surface matches the theoretical one as closely as possible.

Backups of code and data - online, and on offline media - are an important but often ignored part of a system's Attack Surface. Protecting your data and IP by writing secure software and hardening the infrastructure will all be wasted if you hand everything over to bad actors by not protecting your backups.

## Managing the Attack Surface

Once you have a baseline understanding of the Attack Surface, you can use it to incrementally identify and manage risks going forward as you make changes to the application. Ask yourself:

- What has changed?
- What are you doing different? (technology, new approach, ….)
- What holes could you have opened?

The first web page that you create opens up the system's Attack Surface significantly and introduces all kinds of new risks. If you add another field to that page, or another web page like it, while technically you have made the Attack Surface bigger, you haven't increased the risk profile of the application in a meaningful way. Each of these incremental changes is more of the same, unless you follow a new design or use a new framework.

If you add another web page that follows the same design and using the same technology as existing web pages, it's easy to understand how much security testing and review it needs. If you add a new web services API or file that can be uploaded from the Internet, each of these changes have a different risk profile again - see if the change fits in an existing bucket, see if the existing controls and protections apply. If you're adding something that doesn't fall into an existing bucket, this means that you have to go through a more thorough risk assessment to understand what kind of security holes you may open and what protections you need to put in place.

Changes to session management, authentication and password management directly affect the Attack Surface and need to be reviewed. So do changes to authorization and access control logic, especially adding or changing role definitions, adding admin users or admin functions with high privileges. Similarly for changes to the code that handles encryption and secrets. Fundamental changes to how data validation is done. And major architectural changes to layering and trust relationships, or fundamental changes in technical architecture – swapping out your web server or database platform, or changing the runtime operating system.

As you add new user types or roles or privilege levels, you do the same kind of analysis and risk assessment. Overlay the type of access across the data and functions and look for problems and inconsistencies. It's important to understand the access model for the application, whether it is positive (access is deny by default) or negative (access is allow by default). In a positive access model, any mistakes in defining what data or functions are permitted to a new user type or role are easy to see. In a negative access model, you have to be much more careful to ensure that a user does not get access to data/functions that they should not be permitted to.

This kind of threat or risk assessment can be done periodically, or as a part of design work in serial / phased / spiral / waterfall development projects, or continuously and incrementally in Agile / iterative development.

Normally, an application's Attack Surface will increase over time as you add more interfaces and user types and integrate with other systems. You also want to look for ways to reduce the size of the Attack Surface when you can by simplifying the model (reducing the number of user levels for example or not storing confidential data that you don't absolutely have to), turning off features and interfaces that aren't being used, by introducing operational controls such as a Web Application Firewall (WAF) and real-time application-specific attack detection.

</section>

<section id="attack-surface-analysis-translation-panel" className="tabPanel translationPanel contentPanel">

## What is Attack Surface Analysis and Why is it Important

この記事は、攻撃対象領域分析を行い、アプリケーションの攻撃対象領域を管理するための、単純で実践的な方法を説明します。開発者がアプリケーションを設計・変更する際にアプリケーションセキュリティリスクを理解し管理するため、またセキュリティリスク評価を行うアプリケーションセキュリティ専門家が使用することを想定しています。ここでの焦点は、外部攻撃からアプリケーションを保護することです。システムのユーザーや運用者に対する攻撃、たとえばマルウェア注入やソーシャルエンジニアリング攻撃は考慮しておらず、内部者脅威への焦点も弱めです。ただし、原則は同じです。内部の攻撃対象領域は外部の攻撃対象領域とは異なる可能性が高く、一部のユーザーは多くのアクセス権を持つ場合があります。

攻撃対象領域分析とは、システムのどの部分をセキュリティ脆弱性についてレビューおよびテストする必要があるかを洗い出すことです。攻撃対象領域分析の目的は、アプリケーションのリスク領域を理解し、開発者とセキュリティ専門家にアプリケーションのどの部分が攻撃にさらされているかを認識させ、それを最小化する方法を見つけ、攻撃対象領域がいつどのように変化したか、そしてそれがリスクの観点で何を意味するかに気付けるようにすることです。

攻撃対象領域分析は通常、セキュリティアーキテクトやペネトレーションテスターが行いますが、開発者もシステムを設計、構築、変更する中で攻撃対象領域を理解し、監視すべきです。

攻撃対象領域分析は、次のことに役立ちます。

1. セキュリティ脆弱性についてレビューまたはテストする必要がある機能とシステム部分を特定する。
2. 多層防御による保護が必要な高リスクコード領域、つまり防御すべきシステム部分を特定する。
3. 攻撃対象領域を変更したタイミングと、何らかの脅威評価が必要なタイミングを特定する。

## Defining the Attack Surface of an Application

攻撃対象領域は、攻撃者がシステムに侵入できる、またはデータを持ち出せるすべての異なる地点を表します。

アプリケーションの攻撃対象領域は次のものです。

1. アプリケーションへ出入りするデータやコマンドのすべての経路の合計。
2. それらの経路を保護するコード。これにはリソース接続、認証、認可、アクティビティログ、データ検証、エンコーディングが含まれます。
3. アプリケーションで使われるすべての価値あるデータ。これにはシークレットと鍵、知的財産、重要なビジネスデータ、個人データ、PII が含まれます。
4. それらのデータを保護するコード。これには暗号化とチェックサム、アクセス監査、データ完全性、運用セキュリティ管理策が含まれます。

このモデルに、システムへアクセスできる（認可されているかどうかにかかわらず）さまざまなユーザー種別、つまりロールや権限レベルを重ね合わせます。ユーザー種別が増えるほど複雑さは増します。認証されていない匿名ユーザーと、データベース管理者やシステム管理者のような高権限管理ユーザーという、両極端に注目することが重要です。

各種類の攻撃点を、リスク（外部向けまたは内部向け）、目的、実装、設計、技術に基づいてバケットに分類します。次に、各種類の攻撃点の数を数えます。その後、各種類からいくつかのケースを選びます。最後に、そのケースにレビューまたは評価を集中します。

このアプローチでは、攻撃対象領域とシステムの潜在的なリスクプロファイルを理解するために、すべてのエンドポイントを理解する必要はありません。代わりに、一般的なエンドポイント種別と、各種別の地点数を数えられます。これにより、規模に応じたリスク評価に必要な作業量を見積もることができ、アプリケーションのリスクプロファイルが大きく変化したタイミングを把握できます。

### Microservice and Cloud Native Applications

マイクロサービスおよびクラウドネイティブアプリケーションは、API によって疎結合され、独立してスケールできる複数の小さなコンポーネントで構成されます。このアーキテクチャスタイルのアプリケーションで攻撃対象領域を評価する場合、攻撃元から到達可能なコンポーネント、たとえばインターネットからの外部トラフィックで到達できるコンポーネントを優先すべきです。そのようなコンポーネントは、プロキシ、ロードバランサ、Ingress コントローラの階層の背後にあり、予告なく自動スケールする場合があります。

[Cilium Hubble](https://github.com/cilium/hubble) や [kubeshark](https://github.com/kubeshark/kubeshark) などのオープンソースツールは、Kubernetes やサービスメッシュのデプロイにおける攻撃対象領域の可視化を支援します。

## Identifying and Mapping the Attack Surface

攻撃対象領域のベースライン記述は、図とメモから作り始められます。数時間を使い、攻撃者の視点から設計文書とアーキテクチャ文書をレビューします。ソースコードを読み、出入口となるさまざまな地点を特定します。

- ユーザーインターフェース (UI) のフォームとフィールド
- HTTP ヘッダーと Cookie
- API
- ファイル
- データベース
- その他のローカルストレージ
- メールまたはその他の種類のメッセージ
- ランタイム引数
- ...あなたの出入口

異なる攻撃点の総数は、容易に数千以上に達することがあります。扱いやすくするため、機能、設計、技術に基づいてモデルを異なる種類に分けます。

- ログインおよび認証の入口
- 管理インターフェース
- 問い合わせおよび検索機能
- データ入力 (CRUD) フォーム
- ビジネスワークフロー
- トランザクション用インターフェースまたは API
- 運用コマンドおよび監視インターフェースまたは API
- 他アプリケーションまたは他システムとのインターフェース
- ...あなたの種類

また、開発者やシステム利用者への聞き取りと、ソースコードレビューによって、アプリケーション内の価値あるデータ、たとえば機密、センシティブ、規制対象のデータを特定する必要があります。

アプリケーションをスキャンして攻撃対象領域の全体像を作ることもできます。Web アプリでは、[ZAP](https://www.zaproxy.org/)、[Arachni](http://arachni-scanner.com/)、[Skipfish](http://code.google.com/p/skipfish/)、[w3af](https://docs.w3af.org)、または多数の商用動的テストツールや脆弱性スキャンツール、サービスのいずれかを使ってアプリをクロールし、Web 経由でアクセス可能なアプリケーション部分をマッピングできます。一部の Web アプリケーションファイアウォール (WAF) も、アプリケーションの入口のモデルをエクスポートできる場合があります。

システム内の主要なユースケースをたどることで、攻撃対象領域への理解を検証し、補完します。ユーザー登録とプロフィール作成、ログイン、アイテム検索、注文、注文変更などを実際に追跡します。制御とデータがシステム内をどう流れるか、情報がどのように検証され、どこに保存されるか、どのリソースに触れるか、どの他システムが関与するかを確認します。攻撃対象領域分析と [Application Threat Modeling](https://owasp.org/www-community/Application_Threat_Modeling) には再帰的な関係があります。攻撃対象領域の変更は脅威モデリングを引き起こすべきであり、脅威モデリングはアプリケーションの攻撃対象領域を理解する助けになります。

攻撃対象領域モデルは、特にそのアプリケーションでセキュリティ作業をまだ行っていない場合、最初は粗く不完全かもしれません。セキュリティ分析を深める中で、またはアプリケーションにさらに取り組み、攻撃対象領域への理解が向上したと気付いたときに、穴を埋めていきます。

## Measuring and Assessing the Attack Surface

攻撃対象領域のマップができたら、高リスク領域を特定します。リモート入口、つまり外部システムやインターネットとのインターフェースに注目し、特に匿名の公開アクセスをシステムが許可する場所に注目します。

- ネットワークに面したコード、特にインターネットに面したコード
- Web フォーム
- ネットワーク外部から来るファイル
- 他システムとの後方互換インターフェース。古いプロトコル、時には古いコードやライブラリであり、複数バージョンの保守とテストが難しいもの
- カスタム API、プロトコルなど。設計や実装に誤りが入りやすいもの
- セキュリティコード。暗号、認証、認可（アクセス制御）、セッション管理に関するすべて

これらは多くの場合、最も攻撃にさらされる場所です。次に、アプリケーションを保護するために、ネットワークファイアウォール、アプリケーションファイアウォール、侵入検知または侵入防止システムなど、どのような補完的管理策や運用管理策があるかを理解します。

Microsoft の Michael Howard と他の研究者は、アプリケーションの攻撃対象領域を測定し、時間とともにその変化を追跡する方法として、[Relative Attack Surface Quotient (RSQ)](https://www.cs.cmu.edu/~wing/publications/Howard-Wing03.pdf) を開発しました。この方法では、システム全体の攻撃対象領域スコアを計算し、システムやデプロイ方法が変更されるたびにそのスコアを測定します。Carnegie Mellon の研究者はこの成果を基に、SAP のような大規模システム向けに [Attack Surface Metric](https://mlsec.info/pdf/tse11.pdf) を計算する正式な方法を開発しました。彼らは、すべての入口と出口、チャネル（クライアントや外部システムがシステムへ接続するさまざまな方法。TCP/UDP ポート、RPC エンドポイント、名前付きパイプなどを含む）、信頼できないデータ要素の合計として攻撃対象領域を計算します。その後、これらの攻撃対象領域要素に損害可能性/労力比を適用し、高リスク領域を特定します。

アプリケーションの複数バージョンをデプロイすること、将来必要になるかもしれないという理由で使われていない機能を残すこと、古いバックアップコピーや未使用コードを残すことは、攻撃対象領域を増やす点に注意してください。実際にデプロイされた攻撃対象領域が理論上のものとできるだけ一致するように、ソースコード管理と堅牢な変更管理および構成管理の実践を使用すべきです。

コードとデータのバックアップ、オンラインおよびオフラインメディア上のバックアップは、システムの攻撃対象領域の重要でありながら無視されがちな部分です。安全なソフトウェアを書き、インフラを堅牢化してデータと知的財産を保護しても、バックアップを保護しなければ、すべてを悪意ある者に渡してしまうことになります。

## Managing the Attack Surface

攻撃対象領域へのベースライン理解ができたら、アプリケーションを変更していく中で、それを使ってリスクを段階的に特定し、管理できます。次の問いを自分に投げかけます。

- 何が変わったか。
- 何を違う方法で行っているか（技術、新しいアプローチなど）。
- どのような穴を開けた可能性があるか。

最初に作成する Web ページは、システムの攻撃対象領域を大きく開き、あらゆる種類の新しいリスクを導入します。そのページに別のフィールドを追加したり、それに似た別の Web ページを追加したりすると、技術的には攻撃対象領域を大きくしたことになりますが、アプリケーションのリスクプロファイルを意味のある形で増やしたとは限りません。新しい設計に従ったり、新しいフレームワークを使ったりしない限り、これらの増分変更は同種の追加にすぎません。

既存の Web ページと同じ設計・同じ技術に従う別の Web ページを追加する場合、どの程度のセキュリティテストとレビューが必要かは理解しやすくなります。新しい Web サービス API や、インターネットからアップロード可能なファイルを追加する場合、それぞれの変更はまた異なるリスクプロファイルを持ちます。その変更が既存のバケットに収まるか、既存の管理策と保護が適用できるかを確認します。既存のバケットに収まらないものを追加する場合、どのようなセキュリティ上の穴を開ける可能性があり、どのような保護を配置する必要があるかを理解するため、より徹底したリスク評価を行う必要があります。

セッション管理、認証、パスワード管理への変更は攻撃対象領域に直接影響し、レビューが必要です。認可とアクセス制御ロジックの変更も同様であり、特にロール定義の追加や変更、高権限の管理ユーザーまたは管理機能の追加は重要です。暗号とシークレットを扱うコードへの変更も同様です。データ検証の方法に対する根本的な変更、階層化と信頼関係に関する大きなアーキテクチャ変更、Web サーバーやデータベースプラットフォームの入れ替え、実行時 OS の変更などの技術アーキテクチャの根本的変更も対象です。

新しいユーザー種別、ロール、権限レベルを追加する際にも、同じ種類の分析とリスク評価を行います。アクセス種別をデータと機能に重ね合わせ、問題や不整合を探します。アプリケーションのアクセスモデルがポジティブ、つまりデフォルト拒否なのか、ネガティブ、つまりデフォルト許可なのかを理解することが重要です。ポジティブアクセスモデルでは、新しいユーザー種別やロールに許可されるデータや機能の定義ミスを見つけやすくなります。ネガティブアクセスモデルでは、ユーザーが許可されるべきでないデータや機能へアクセスできないよう、はるかに慎重になる必要があります。

この種の脅威評価またはリスク評価は、定期的に行うことも、直列、段階型、スパイラル、ウォーターフォールの開発プロジェクトにおける設計作業の一部として行うことも、アジャイルや反復開発の中で継続的かつ段階的に行うこともできます。

通常、アプリケーションの攻撃対象領域は、インターフェースやユーザー種別を増やし、他システムと統合するにつれて時間とともに増加します。一方で、できる場合には攻撃対象領域のサイズを縮小する方法も探すべきです。たとえば、モデルを単純化する（ユーザーレベル数を減らすなど）、絶対に保存する必要のない機密データを保存しない、使われていない機能やインターフェースを無効にする、Web Application Firewall (WAF) やリアルタイムのアプリケーション固有攻撃検知などの運用管理策を導入する、といった方法があります。

</section>

<section id="attack-surface-analysis-bilingual-panel" className="tabPanel bilingualPanel">

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## What is Attack Surface Analysis and Why is it Important

This article describes a simple and pragmatic way of doing Attack Surface Analysis and managing an application's Attack Surface. It is targeted to be used by developers to understand and manage application security risks as they design and change an application, as well as by application security specialists doing a security risk assessment. The focus here is on protecting an application from external attack - it does not take into account attacks on the users or operators of the system (e.g. malware injection, social engineering attacks), and there is less focus on insider threats, although the principles remain the same. The internal attack surface is likely to be different from the external attack surface and some users may have a lot of access.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## What is Attack Surface Analysis and Why is it Important

この記事は、攻撃対象領域分析を行い、アプリケーションの攻撃対象領域を管理するための、単純で実践的な方法を説明します。開発者がアプリケーションを設計・変更する際にアプリケーションセキュリティリスクを理解し管理するため、またセキュリティリスク評価を行うアプリケーションセキュリティ専門家が使用することを想定しています。ここでの焦点は、外部攻撃からアプリケーションを保護することです。システムのユーザーや運用者に対する攻撃、たとえばマルウェア注入やソーシャルエンジニアリング攻撃は考慮しておらず、内部者脅威への焦点も弱めです。ただし、原則は同じです。内部の攻撃対象領域は外部の攻撃対象領域とは異なる可能性が高く、一部のユーザーは多くのアクセス権を持つ場合があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Attack Surface Analysis is about mapping out what parts of a system need to be reviewed and tested for security vulnerabilities. The point of Attack Surface Analysis is to understand the risk areas in an application, to make developers and security specialists aware of what parts of the application are open to attack, to find ways of minimizing this, and to notice when and how the Attack Surface changes and what this means from a risk perspective.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

攻撃対象領域分析とは、システムのどの部分をセキュリティ脆弱性についてレビューおよびテストする必要があるかを洗い出すことです。攻撃対象領域分析の目的は、アプリケーションのリスク領域を理解し、開発者とセキュリティ専門家にアプリケーションのどの部分が攻撃にさらされているかを認識させ、それを最小化する方法を見つけ、攻撃対象領域がいつどのように変化したか、そしてそれがリスクの観点で何を意味するかに気付けるようにすることです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

While Attack Surface Analysis is usually done by security architects and pen testers, developers should understand and monitor the Attack Surface as they design and build and change a system.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

攻撃対象領域分析は通常、セキュリティアーキテクトやペネトレーションテスターが行いますが、開発者もシステムを設計、構築、変更する中で攻撃対象領域を理解し、監視すべきです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Attack Surface Analysis helps you to:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

攻撃対象領域分析は、次のことに役立ちます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

1. identify what functions and what parts of the system you need to review/test for security vulnerabilities
2. identify high risk areas of code that require defense-in-depth protection - what parts of the system that you need to defend
3. identify when you have changed the attack surface and need to do some kind of threat assessment

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

1. セキュリティ脆弱性についてレビューまたはテストする必要がある機能とシステム部分を特定する。
2. 多層防御による保護が必要な高リスクコード領域、つまり防御すべきシステム部分を特定する。
3. 攻撃対象領域を変更したタイミングと、何らかの脅威評価が必要なタイミングを特定する。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Defining the Attack Surface of an Application

The Attack Surface describes all of the different points where an attacker could get into a system, and where they could get data out.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## Defining the Attack Surface of an Application

攻撃対象領域は、攻撃者がシステムに侵入できる、またはデータを持ち出せるすべての異なる地点を表します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The Attack Surface of an application is:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

アプリケーションの攻撃対象領域は次のものです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

1. the sum of all paths for data/commands into and out of the application, and
2. the code that protects these paths (including resource connection and authentication, authorization, activity logging, data validation and encoding)
3. all valuable data used in the application, including secrets and keys, intellectual property, critical business data, personal data and PII, and
4. the code that protects these data (including encryption and checksums, access auditing, and data integrity and operational security controls).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

1. アプリケーションへ出入りするデータやコマンドのすべての経路の合計。
2. それらの経路を保護するコード。これにはリソース接続、認証、認可、アクティビティログ、データ検証、エンコーディングが含まれます。
3. アプリケーションで使われるすべての価値あるデータ。これにはシークレットと鍵、知的財産、重要なビジネスデータ、個人データ、PII が含まれます。
4. それらのデータを保護するコード。これには暗号化とチェックサム、アクセス監査、データ完全性、運用セキュリティ管理策が含まれます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

You overlay this model with the different types of users - roles, privilege levels - that can access the system (whether authorized or not). Complexity increases with the number of different types of users. It is important to focus on the two extremes: unauthenticated, anonymous users and highly privileged admin users (e.g. database administrators, system administrators).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

このモデルに、システムへアクセスできる（認可されているかどうかにかかわらず）さまざまなユーザー種別、つまりロールや権限レベルを重ね合わせます。ユーザー種別が増えるほど複雑さは増します。認証されていない匿名ユーザーと、データベース管理者やシステム管理者のような高権限管理ユーザーという、両極端に注目することが重要です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Group each type of attack point into buckets based on risk (external-facing or internal-facing), purpose, implementation, design and technology. Then, count the number of attack points of each type. Next, choose some cases for each type. Finally, focus your review/assessment on those cases.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

各種類の攻撃点を、リスク（外部向けまたは内部向け）、目的、実装、設計、技術に基づいてバケットに分類します。次に、各種類の攻撃点の数を数えます。その後、各種類からいくつかのケースを選びます。最後に、そのケースにレビューまたは評価を集中します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

With this approach, you don't need to understand every endpoint in order to understand the Attack Surface and the potential risk profile of a system. Instead, you can count the different general type of endpoints and the number of points of each type. This enables you to budget what it will take to assess risk at scale, and you can tell when the risk profile of an application has significantly changed.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

このアプローチでは、攻撃対象領域とシステムの潜在的なリスクプロファイルを理解するために、すべてのエンドポイントを理解する必要はありません。代わりに、一般的なエンドポイント種別と、各種別の地点数を数えられます。これにより、規模に応じたリスク評価に必要な作業量を見積もることができ、アプリケーションのリスクプロファイルが大きく変化したタイミングを把握できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Microservice and Cloud Native Applications

Microservice and Cloud Native applications are comprised of multiple smaller components, loosely coupled using APIs and independently scalable. When assessing the attack surface for applications of this architectural style, you should prioritize the components that are reachable from an attack source (e.g. external traffic from the Internet). Such components may be located behind tiers of proxies, load balancers and ingress controllers, and may auto-scale without warning.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Microservice and Cloud Native Applications

マイクロサービスおよびクラウドネイティブアプリケーションは、API によって疎結合され、独立してスケールできる複数の小さなコンポーネントで構成されます。このアーキテクチャスタイルのアプリケーションで攻撃対象領域を評価する場合、攻撃元から到達可能なコンポーネント、たとえばインターネットからの外部トラフィックで到達できるコンポーネントを優先すべきです。そのようなコンポーネントは、プロキシ、ロードバランサ、Ingress コントローラの階層の背後にあり、予告なく自動スケールする場合があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Open source tooling such as [Cilium Hubble](https://github.com/cilium/hubble) and [kubeshark](https://github.com/kubeshark/kubeshark) assist in visualizing the attack surface for Kubernetes and service-mesh deployments.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

[Cilium Hubble](https://github.com/cilium/hubble) や [kubeshark](https://github.com/kubeshark/kubeshark) などのオープンソースツールは、Kubernetes やサービスメッシュのデプロイにおける攻撃対象領域の可視化を支援します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Identifying and Mapping the Attack Surface

You can start building a baseline description of the Attack Surface in a picture and notes. Spend a few hours reviewing design and architecture documents from an attacker's perspective. Read through the source code and identify different points of entry/exit:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## Identifying and Mapping the Attack Surface

攻撃対象領域のベースライン記述は、図とメモから作り始められます。数時間を使い、攻撃者の視点から設計文書とアーキテクチャ文書をレビューします。ソースコードを読み、出入口となるさまざまな地点を特定します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- User interface (UI) forms and fields
- HTTP headers and cookies
- APIs
- Files
- Databases
- Other local storage
- Email or other kinds of messages
- Runtime arguments
- ...Your points of entry/exit

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- ユーザーインターフェース (UI) のフォームとフィールド
- HTTP ヘッダーと Cookie
- API
- ファイル
- データベース
- その他のローカルストレージ
- メールまたはその他の種類のメッセージ
- ランタイム引数
- ...あなたの出入口

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The total number of different attack points can easily add up into the thousands or more. To make this manageable, break the model into different types based on function, design and technology:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

異なる攻撃点の総数は、容易に数千以上に達することがあります。扱いやすくするため、機能、設計、技術に基づいてモデルを異なる種類に分けます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Login/authentication entry points
- Admin interfaces
- Inquiries and search functions
- Data entry (CRUD) forms
- Business workflows
- Transactional interfaces/APIs
- Operational command and monitoring interfaces/APIs
- Interfaces with other applications/systems
- ...Your types

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- ログインおよび認証の入口
- 管理インターフェース
- 問い合わせおよび検索機能
- データ入力 (CRUD) フォーム
- ビジネスワークフロー
- トランザクション用インターフェースまたは API
- 運用コマンドおよび監視インターフェースまたは API
- 他アプリケーションまたは他システムとのインターフェース
- ...あなたの種類

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

You also need to identify the valuable data (e.g. confidential, sensitive, regulated) in the application, by interviewing developers and users of the system, and again by reviewing the source code.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

また、開発者やシステム利用者への聞き取りと、ソースコードレビューによって、アプリケーション内の価値あるデータ、たとえば機密、センシティブ、規制対象のデータを特定する必要があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

You can also build up a picture of the Attack Surface by scanning the application. For web apps you can use a tool like [ZAP](https://www.zaproxy.org/), [Arachni](http://arachni-scanner.com/), [Skipfish](http://code.google.com/p/skipfish/), [w3af](https://docs.w3af.org), or one of the many commercial dynamic testing and vulnerability scanning tools or services to crawl your app and map the parts of the application that are accessible over the web. Some web application firewalls (WAFs) may also be able to export a model of the application's entry points.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

アプリケーションをスキャンして攻撃対象領域の全体像を作ることもできます。Web アプリでは、[ZAP](https://www.zaproxy.org/)、[Arachni](http://arachni-scanner.com/)、[Skipfish](http://code.google.com/p/skipfish/)、[w3af](https://docs.w3af.org)、または多数の商用動的テストツールや脆弱性スキャンツール、サービスのいずれかを使ってアプリをクロールし、Web 経由でアクセス可能なアプリケーション部分をマッピングできます。一部の Web アプリケーションファイアウォール (WAF) も、アプリケーションの入口のモデルをエクスポートできる場合があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Validate and fill in your understanding of the Attack Surface by walking through some of the main use cases in the system: signing up and creating a user profile, logging in, searching for an item, placing an order, changing an order, and so on. Follow the flow of control and data through the system, see how information is validated and where it is stored, what resources are touched and what other systems are involved. There is a recursive relationship between Attack Surface Analysis and [Application Threat Modeling](https://owasp.org/www-community/Application_Threat_Modeling): changes to the Attack Surface should trigger threat modeling, and threat modeling helps you to understand the Attack Surface of the application.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

システム内の主要なユースケースをたどることで、攻撃対象領域への理解を検証し、補完します。ユーザー登録とプロフィール作成、ログイン、アイテム検索、注文、注文変更などを実際に追跡します。制御とデータがシステム内をどう流れるか、情報がどのように検証され、どこに保存されるか、どのリソースに触れるか、どの他システムが関与するかを確認します。攻撃対象領域分析と [Application Threat Modeling](https://owasp.org/www-community/Application_Threat_Modeling) には再帰的な関係があります。攻撃対象領域の変更は脅威モデリングを引き起こすべきであり、脅威モデリングはアプリケーションの攻撃対象領域を理解する助けになります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The Attack Surface model may be rough and incomplete to start, especially if you haven't done any security work on the application before. Fill in the holes as you dig deeper in a security analysis, or as you work more with the application and realize that your understanding of the Attack Surface has improved.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

攻撃対象領域モデルは、特にそのアプリケーションでセキュリティ作業をまだ行っていない場合、最初は粗く不完全かもしれません。セキュリティ分析を深める中で、またはアプリケーションにさらに取り組み、攻撃対象領域への理解が向上したと気付いたときに、穴を埋めていきます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Measuring and Assessing the Attack Surface

Once you have a map of the Attack Surface, identify the high risk areas. Focus on remote entry points – interfaces with outside systems and to the Internet – and especially where the system allows anonymous, public access.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## Measuring and Assessing the Attack Surface

攻撃対象領域のマップができたら、高リスク領域を特定します。リモート入口、つまり外部システムやインターネットとのインターフェースに注目し、特に匿名の公開アクセスをシステムが許可する場所に注目します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Network-facing, especially internet-facing code
- Web forms
- Files from outside of the network
- Backward compatible interfaces with other systems – old protocols, sometimes old code and libraries, hard to maintain and test multiple versions
- Custom APIs – protocols etc – likely to have mistakes in design and implementation
- Security code: anything to do with cryptography, authentication, authorization (access control) and session management

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- ネットワークに面したコード、特にインターネットに面したコード
- Web フォーム
- ネットワーク外部から来るファイル
- 他システムとの後方互換インターフェース。古いプロトコル、時には古いコードやライブラリであり、複数バージョンの保守とテストが難しいもの
- カスタム API、プロトコルなど。設計や実装に誤りが入りやすいもの
- セキュリティコード。暗号、認証、認可（アクセス制御）、セッション管理に関するすべて

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

These are often where you are most exposed to attack. Then understand what compensating controls you have in place, operational controls like network firewalls and application firewalls, and intrusion detection or prevention systems to help protect your application.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

これらは多くの場合、最も攻撃にさらされる場所です。次に、アプリケーションを保護するために、ネットワークファイアウォール、アプリケーションファイアウォール、侵入検知または侵入防止システムなど、どのような補完的管理策や運用管理策があるかを理解します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Michael Howard at Microsoft and other researchers have developed a method for measuring the Attack Surface of an application, and to track changes to the Attack Surface over time, called the [Relative Attack Surface Quotient (RSQ)](https://www.cs.cmu.edu/~wing/publications/Howard-Wing03.pdf). Using this method you calculate an overall attack surface score for the system, and measure this score as changes are made to the system and to how it is deployed. Researchers at Carnegie Mellon built on this work to develop a formal way to calculate an [Attack Surface Metric](https://mlsec.info/pdf/tse11.pdf) for large systems like SAP. They calculate the Attack Surface as the sum of all entry and exit points, channels (the different ways that clients or external systems connect to the system, including TCP/UDP ports, RPC endpoints, named pipes...) and untrusted data elements. Then they apply a damage potential/effort ratio to these Attack Surface elements to identify high-risk areas.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Microsoft の Michael Howard と他の研究者は、アプリケーションの攻撃対象領域を測定し、時間とともにその変化を追跡する方法として、[Relative Attack Surface Quotient (RSQ)](https://www.cs.cmu.edu/~wing/publications/Howard-Wing03.pdf) を開発しました。この方法では、システム全体の攻撃対象領域スコアを計算し、システムやデプロイ方法が変更されるたびにそのスコアを測定します。Carnegie Mellon の研究者はこの成果を基に、SAP のような大規模システム向けに [Attack Surface Metric](https://mlsec.info/pdf/tse11.pdf) を計算する正式な方法を開発しました。彼らは、すべての入口と出口、チャネル（クライアントや外部システムがシステムへ接続するさまざまな方法。TCP/UDP ポート、RPC エンドポイント、名前付きパイプなどを含む）、信頼できないデータ要素の合計として攻撃対象領域を計算します。その後、これらの攻撃対象領域要素に損害可能性/労力比を適用し、高リスク領域を特定します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Note that deploying multiple versions of an application, leaving features in that are no longer used just in case they may be needed in the future, or leaving old backup copies and unused code increases the Attack Surface. Source code control and robust change management/configurations practices should be used to ensure the actual deployed Attack Surface matches the theoretical one as closely as possible.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

アプリケーションの複数バージョンをデプロイすること、将来必要になるかもしれないという理由で使われていない機能を残すこと、古いバックアップコピーや未使用コードを残すことは、攻撃対象領域を増やす点に注意してください。実際にデプロイされた攻撃対象領域が理論上のものとできるだけ一致するように、ソースコード管理と堅牢な変更管理および構成管理の実践を使用すべきです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Backups of code and data - online, and on offline media - are an important but often ignored part of a system's Attack Surface. Protecting your data and IP by writing secure software and hardening the infrastructure will all be wasted if you hand everything over to bad actors by not protecting your backups.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

コードとデータのバックアップ、オンラインおよびオフラインメディア上のバックアップは、システムの攻撃対象領域の重要でありながら無視されがちな部分です。安全なソフトウェアを書き、インフラを堅牢化してデータと知的財産を保護しても、バックアップを保護しなければ、すべてを悪意ある者に渡してしまうことになります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Managing the Attack Surface

Once you have a baseline understanding of the Attack Surface, you can use it to incrementally identify and manage risks going forward as you make changes to the application. Ask yourself:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## Managing the Attack Surface

攻撃対象領域へのベースライン理解ができたら、アプリケーションを変更していく中で、それを使ってリスクを段階的に特定し、管理できます。次の問いを自分に投げかけます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- What has changed?
- What are you doing different? (technology, new approach, ….)
- What holes could you have opened?

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- 何が変わったか。
- 何を違う方法で行っているか（技術、新しいアプローチなど）。
- どのような穴を開けた可能性があるか。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The first web page that you create opens up the system's Attack Surface significantly and introduces all kinds of new risks. If you add another field to that page, or another web page like it, while technically you have made the Attack Surface bigger, you haven't increased the risk profile of the application in a meaningful way. Each of these incremental changes is more of the same, unless you follow a new design or use a new framework.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

最初に作成する Web ページは、システムの攻撃対象領域を大きく開き、あらゆる種類の新しいリスクを導入します。そのページに別のフィールドを追加したり、それに似た別の Web ページを追加したりすると、技術的には攻撃対象領域を大きくしたことになりますが、アプリケーションのリスクプロファイルを意味のある形で増やしたとは限りません。新しい設計に従ったり、新しいフレームワークを使ったりしない限り、これらの増分変更は同種の追加にすぎません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

If you add another web page that follows the same design and using the same technology as existing web pages, it's easy to understand how much security testing and review it needs. If you add a new web services API or file that can be uploaded from the Internet, each of these changes have a different risk profile again - see if the change fits in an existing bucket, see if the existing controls and protections apply. If you're adding something that doesn't fall into an existing bucket, this means that you have to go through a more thorough risk assessment to understand what kind of security holes you may open and what protections you need to put in place.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

既存の Web ページと同じ設計・同じ技術に従う別の Web ページを追加する場合、どの程度のセキュリティテストとレビューが必要かは理解しやすくなります。新しい Web サービス API や、インターネットからアップロード可能なファイルを追加する場合、それぞれの変更はまた異なるリスクプロファイルを持ちます。その変更が既存のバケットに収まるか、既存の管理策と保護が適用できるかを確認します。既存のバケットに収まらないものを追加する場合、どのようなセキュリティ上の穴を開ける可能性があり、どのような保護を配置する必要があるかを理解するため、より徹底したリスク評価を行う必要があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Changes to session management, authentication and password management directly affect the Attack Surface and need to be reviewed. So do changes to authorization and access control logic, especially adding or changing role definitions, adding admin users or admin functions with high privileges. Similarly for changes to the code that handles encryption and secrets. Fundamental changes to how data validation is done. And major architectural changes to layering and trust relationships, or fundamental changes in technical architecture – swapping out your web server or database platform, or changing the runtime operating system.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

セッション管理、認証、パスワード管理への変更は攻撃対象領域に直接影響し、レビューが必要です。認可とアクセス制御ロジックの変更も同様であり、特にロール定義の追加や変更、高権限の管理ユーザーまたは管理機能の追加は重要です。暗号とシークレットを扱うコードへの変更も同様です。データ検証の方法に対する根本的な変更、階層化と信頼関係に関する大きなアーキテクチャ変更、Web サーバーやデータベースプラットフォームの入れ替え、実行時 OS の変更などの技術アーキテクチャの根本的変更も対象です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

As you add new user types or roles or privilege levels, you do the same kind of analysis and risk assessment. Overlay the type of access across the data and functions and look for problems and inconsistencies. It's important to understand the access model for the application, whether it is positive (access is deny by default) or negative (access is allow by default). In a positive access model, any mistakes in defining what data or functions are permitted to a new user type or role are easy to see. In a negative access model, you have to be much more careful to ensure that a user does not get access to data/functions that they should not be permitted to.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

新しいユーザー種別、ロール、権限レベルを追加する際にも、同じ種類の分析とリスク評価を行います。アクセス種別をデータと機能に重ね合わせ、問題や不整合を探します。アプリケーションのアクセスモデルがポジティブ、つまりデフォルト拒否なのか、ネガティブ、つまりデフォルト許可なのかを理解することが重要です。ポジティブアクセスモデルでは、新しいユーザー種別やロールに許可されるデータや機能の定義ミスを見つけやすくなります。ネガティブアクセスモデルでは、ユーザーが許可されるべきでないデータや機能へアクセスできないよう、はるかに慎重になる必要があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

This kind of threat or risk assessment can be done periodically, or as a part of design work in serial / phased / spiral / waterfall development projects, or continuously and incrementally in Agile / iterative development.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

この種の脅威評価またはリスク評価は、定期的に行うことも、直列、段階型、スパイラル、ウォーターフォールの開発プロジェクトにおける設計作業の一部として行うことも、アジャイルや反復開発の中で継続的かつ段階的に行うこともできます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Normally, an application's Attack Surface will increase over time as you add more interfaces and user types and integrate with other systems. You also want to look for ways to reduce the size of the Attack Surface when you can by simplifying the model (reducing the number of user levels for example or not storing confidential data that you don't absolutely have to), turning off features and interfaces that aren't being used, by introducing operational controls such as a Web Application Firewall (WAF) and real-time application-specific attack detection.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

通常、アプリケーションの攻撃対象領域は、インターフェースやユーザー種別を増やし、他システムと統合するにつれて時間とともに増加します。一方で、できる場合には攻撃対象領域のサイズを縮小する方法も探すべきです。たとえば、モデルを単純化する（ユーザーレベル数を減らすなど）、絶対に保存する必要のない機密データを保存しない、使われていない機能やインターフェースを無効にする、Web Application Firewall (WAF) やリアルタイムのアプリケーション固有攻撃検知などの運用管理策を導入する、といった方法があります。

</div>
</div>

</section>
</div>



## Attribution

<div className="attributionFooter">

- Original: Attack Surface Analysis Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Attack_Surface_Analysis_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: English original retained for comparison. Japanese translation added. Bilingual display generated from official source and local Japanese translation.
- Retrieved: 2026-05-20

</div>
