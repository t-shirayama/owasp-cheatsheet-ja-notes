---
hide_table_of_contents: true
---

# Authorization Cheat Sheet

<div className="docHero" data-category="authorization">
  <h1>Authorization Cheat Sheet</h1>
  <p className="docSubtitle">認可チートシート</p>
  <div className="docMeta">
    <span className="docPill">最終更新: 2026-05-20</span>
    <span className="docPill">読了時間: 約 12 分</span>
    <span className="docPill">カテゴリ: Authorization</span>
  </div>
</div>

<div className="tabbedContent">
  <input className="tabInput" type="radio" name="authorization-view" id="authorization-translation" defaultChecked />
  <input className="tabInput" type="radio" name="authorization-view" id="authorization-summary" />
  <input className="tabInput" type="radio" name="authorization-view" id="authorization-checklist" />
  <input className="tabInput" type="radio" name="authorization-view" id="authorization-bilingual" />

  <div className="contentTabs">
    <label htmlFor="authorization-translation">翻訳</label>
    <label htmlFor="authorization-summary">要点</label>
    <label htmlFor="authorization-checklist">チェックリスト</label>
    <label htmlFor="authorization-bilingual">対比表示</label>
  </div>

<section id="authorization-translation-panel" className="tabPanel translationPanel contentPanel">

## 概要

認可は、要求された操作やサービスが特定の主体に対して承認されているかを検証するプロセスです。認証は主体の身元を確認するプロセスであり、認可とは別の概念です。認証済みユーザーであっても、システム上で実行可能なすべての操作や、すべてのリソースへのアクセスが許可されるわけではありません。

認可の欠陥は、保護されるべきリソースの読み取り、作成、変更、削除、または本来許可されない高コストな操作を可能にします。水平権限昇格、つまり他ユーザーのリソースへアクセスできる欠陥は特に一般的です。認可違反に関するログが不十分な場合、侵害が検知されず、誰が実行したかも追跡できなくなります。

### 最小権限を適用する

ユーザーには、業務を完了するために必要な最小限の権限だけを付与します。最小権限は、管理者権限のような垂直方向だけでなく、同じ階層にいるユーザー同士の水平方向にも適用します。

設計段階では、信頼境界、ユーザー種別、リソース、許可される操作を列挙します。ユーザー種別とリソースの組み合わせごとに、読み取り、作成、更新、削除などの操作可否を定義します。ABAC を使う場合は、ユーザー属性、リソース属性、環境属性、操作属性を考慮します。

設計で定義した権限は、実装後も定期的にレビューします。ユーザーが異動や運用上の例外で一時的に得た権限を持ち続ける privilege creep を避け、正式に承認された変更以外で権限が広がっていないことを確認します。権限を後から取り上げるより、SDLC の早い段階で慎重に計画し、必要に応じて追加するほうが安全です。

### デフォルト拒否にする

明示的に許可されていない操作は拒否します。認可判断で例外や未定義状態が発生した場合も、安全側に倒して拒否します。新機能や新リソースを追加したときに、認可ルールが未設定のままアクセス可能になる設計を避けます。

### すべてのリクエストで権限を検証する

認可は、アプリケーション起動時やログイン時だけでなく、各リクエストで確認します。攻撃者は URL、HTTP メソッド、ID、リクエスト本文、API 呼び出し順序を改変できます。したがって、クライアント側の表示制御やルーティングだけに頼らず、サーバー側で操作ごとの認可を実施します。

キャッシュ、セッション、トークンに権限情報を保持する場合も、権限変更や失効が反映されるようにします。古い権限情報によってアクセスが残り続ける設計を避けます。

### ツールやフレームワークの認可ロジックを確認する

フレームワーク、API ゲートウェイ、ミドルウェア、ライブラリの認可機能を使う場合でも、そのロジックがアプリケーションの業務要件に合っているかをレビューします。組み込み機能が十分でない場合は、必要な認可ロジックを追加します。

認可チェックの場所も重要です。UI、クライアント、API ゲートウェイだけでなく、最終的に保護対象リソースを操作するサーバー側で検証される必要があります。

サードパーティコンポーネントは、誤設定、未設定、脆弱性により認可バイパスを生む可能性があります。脆弱なコンポーネントを検出し対応するプロセスを作り、Dependency Check などのツールや NVD、ベンダー情報を SDLC に組み込みます。単一のフレームワーク、ライブラリ、ゲートウェイだけを認可の最後の砦にせず、多層防御を実装します。

### RBAC より属性・関係ベースの制御を優先する

単純なロールベースアクセス制御だけでは、複雑な業務条件やリソース所有関係を表現しきれない場合があります。属性ベースアクセス制御や関係ベースアクセス制御を使うと、ユーザー属性、リソース属性、組織、所有者、時間、場所、リスク状態などを使って、より精密な認可判断ができます。

ただし、複雑な認可モデルは実装やレビューも難しくなります。ポリシー、属性の信頼性、評価順序、失敗時の挙動を明確にし、テスト可能な形にします。

RBAC は導入初期には単純ですが、実運用でロールが増えると role explosion が発生し、テストや監査が難しくなります。ロール情報を HTTP ヘッダーなどに詰め込む構成ではサイズ制限やレイテンシの問題も起きます。マルチテナントや組織横断アクセスでは、顧客や組織ごとのルールセットを個別に作るより、属性や関係を一貫して定義し、ポリシー管理と強制を分離できる設計が適しています。

### 推測可能な ID への対策

リソース ID が推測可能でも、それだけでアクセスできてはいけません。URL や API パラメータに含まれる ID、ファイル名、注文番号、ユーザー ID などは、すべてユーザー入力として扱います。対象オブジェクトへのアクセス権をサーバー側で検証し、IDOR や水平権限昇格を防ぎます。

ID をランダム化することは補助策になり得ますが、認可チェックの代替にはなりません。

### 静的リソースにも認可を適用する

画像、PDF、ダウンロードファイル、生成済みレポートなどの静的リソースも、機密情報を含む場合は認可対象です。アプリケーション経由では保護されていても、直接 URL でアクセスできる配置にしてはいけません。公開してよいリソースと認可が必要なリソースを分離します。

### 認可失敗時の安全な終了

認可チェックに失敗した場合、処理を中断し、保護対象リソースへ副作用を与えないようにします。失敗時の例外処理、エラー応答、ログ記録も設計します。エラー応答は、対象リソースが存在するかどうか、権限の詳細、内部実装を不要に漏らさないようにします。

失敗処理は中央集約し、例外や認可失敗がどれほど起こりにくく見える場合でも処理されるようにします。認可失敗後にソフトウェアが不安定な状態へ残ると、後続処理で認可バイパスにつながる可能性があります。

### 適切なログを実装する

認可失敗、権限変更、管理者操作、高リスク操作、異常なアクセス試行はログに記録します。ログには、誰が、どのリソースに、どの操作を試み、どの結果になったかを含めます。ただし、機密情報や過度な内部情報は記録しません。

ログは、攻撃検知、調査、監査、説明責任に使えるよう、イベント名と属性を統一します。

ログ量は環境と要件に合わせて決めます。少なすぎるログは攻撃検知と事後分析を難しくし、多すぎるログはリソース消費、過剰な誤検知、機密データの不要な記録につながります。複数システムにまたがる攻撃手順を再構成できるよう、時計とタイムゾーンを同期し、必要に応じて集中ログサーバーや SIEM に取り込みます。

### 認可ロジックのテスト

認可ロジックには、単体テストと統合テストを作成します。許可されるケースだけでなく、拒否されるべきケース、他ユーザーのリソース、ロール不足、権限失効後、HTTP メソッド変更、ID 改ざん、API の順序変更などをテストします。

権限モデルが変わったときは、既存の認可テストが失効していないかを確認します。

</section>

<section id="authorization-summary-panel" className="tabPanel summaryPanel contentPanel">

認可は、要求された操作が特定の主体に許可されているかを検証する仕組みです。認証済みであることは、すべてのリソースや操作が許可されることを意味しません。

認可の欠陥は、水平権限昇格、垂直権限昇格、IDOR、機密情報の漏えい、不正な更新や削除につながります。認可はクライアント側の表示制御ではなく、サーバー側でリクエストごとに検証します。

## 要点

- 最小権限を垂直方向と水平方向の両方に適用する。
- 明示的に許可されない操作は拒否する。
- すべてのリクエストでサーバー側認可を実施する。
- 権限設計を文書化し、運用後も privilege creep を定期的にレビューする。
- URL や API パラメータの ID は推測・改ざんされる前提で扱う。
- RBAC だけで表現できない条件には ABAC や ReBAC を検討する。
- 静的リソースや生成済みファイルにも必要に応じて認可を適用する。
- フレームワーク、API ゲートウェイ、ライブラリの認可機能は、デフォルト設定を信頼せず業務要件に合わせて検証する。
- 認可チェック失敗時は中央集約された処理で安全に終了し、対象リソースへ副作用を残さない。
- 認可失敗、権限変更、管理者操作、高リスク操作をログに記録する。
- 認可ロジックには許可ケースと拒否ケースの両方のテストを作成する。

## 実装時の注意点

- ID のランダム化は認可チェックの代替ではありません。
- API ゲートウェイやフレームワークの認可機能を使う場合も、業務ルールに合っているかをレビューします。
- 認可失敗時のレスポンスは、対象リソースの存在や内部権限構造を漏らさないようにします。
- 権限情報をキャッシュする場合は、権限変更や失効が反映される設計にします。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V8.1 Authorization Documentation | 信頼境界、主体、リソース、操作、権限モデル、テスト観点 |
| V8.2 General Authorization Design | 最小権限、デフォルト拒否、全リクエスト検証、ABAC/ReBAC、IDOR 対策 |
| V8.4 Other Authorization Considerations | サードパーティ設定、チェック場所、失敗処理、privilege creep |
| V16.3 Security Events | 認可失敗、権限変更、管理者操作、高リスク操作のログ記録 |

</section>

<section id="authorization-checklist-panel" className="tabPanel checklistPanel contentPanel">

## V8.1 Authorization Documentation

- [ ] 文書化する: 信頼境界、ユーザー種別、ロール、属性、リソース、操作を列挙する。
- [ ] 定義する: ユーザー種別とリソースの組み合わせごとに許可操作を定義する。
- [ ] 文書化する: RBAC、ABAC、ReBAC など採用する認可モデルと、属性または関係の信頼元を明確にする。
- [ ] 作成する: 設計段階で定義した権限マトリクスを検証する単体テストと統合テストの方針を作る。
- [ ] レビューする: 本番運用後に privilege creep が発生していないか、定期的に権限を棚卸しする。

### V8.2 General Authorization Design

- [ ] 適用する: 最小権限を垂直方向と水平方向の両方に適用する。
- [ ] 拒否する: 明示的に許可されていない操作、権限未設定、例外、ポリシー評価不能時は拒否する。
- [ ] 実装する: すべてのリクエストでサーバー側認可を実施する。
- [ ] 禁止する: クライアント側の表示制御を認可チェックの代替にすること。
- [ ] 検証する: HTTP メソッド、URL、ID、リクエスト本文を改ざんされる前提で検証する。
- [ ] 検証する: 対象オブジェクトへのアクセス権をサーバー側で確認する。
- [ ] 防止する: 推測可能な ID でもアクセスできないよう、IDOR と水平権限昇格を防ぐ。
- [ ] 検討する: RBAC だけで不足する場合は ABAC または ReBAC を採用する。
- [ ] 保護する: 静的リソースや生成済みファイルにも必要な認可を適用する。
- [ ] 反映する: 権限キャッシュやトークン内権限が失効・変更に追従するようにする。

### V8.4 Other Authorization Considerations

- [ ] 確認する: API ゲートウェイ、フレームワーク、ライブラリの認可処理が業務要件を満たす。
- [ ] 禁止する: フレームワークやライブラリのデフォルト設定だけに依存すること。
- [ ] 実装する: 脆弱なコンポーネントを検出し対応するプロセスを SDLC に組み込む。
- [ ] 実装する: 認可チェックを UI やクライアントだけでなく、保護対象リソースを操作するサーバー側で行う。
- [ ] 中断する: 認可失敗時は処理を中断し、副作用を残さない。
- [ ] 集約する: 認可失敗と例外の処理を中央集約し、不安定な状態を残さない。
- [ ] 抑制する: 認可失敗レスポンスで対象リソースの存在、権限の詳細、内部実装を不要に漏らさない。

### V16.3 Security Events

- [ ] 記録する: 認可失敗、権限変更、管理者操作、高リスク操作を記録する。
- [ ] 含める: ログに主体、対象リソース、操作、結果、時刻、相関 ID を含める。
- [ ] 禁止する: ログに機密情報や過度な内部情報を含めること。
- [ ] 同期する: 複数システムにまたがる調査のため、時計とタイムゾーンを同期する。
- [ ] 検討する: 認可関連ログを集中ログサーバーまたは SIEM に取り込む。

### テスト

- [ ] テストする: 許可される操作と拒否される操作の両方を作成する。
- [ ] テストする: 他ユーザーのリソースへアクセスできないことを確認する。
- [ ] テストする: 権限不足のユーザーが管理操作を実行できないことを確認する。
- [ ] テストする: HTTP メソッド変更や ID 改ざんで認可を迂回できないことを確認する。
- [ ] テストする: 権限失効後にアクセスできないことを確認する。
- [ ] テストする: ABAC/ReBAC ポリシー、例外時の安全な終了、静的リソースへの直接アクセス拒否を確認する。

</section>

<section id="authorization-bilingual-panel" className="tabPanel bilingualPanel">

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Introduction

Authorization may be defined as "the process of verifying that a requested action or service is approved for a specific entity" ([NIST](https://csrc.nist.gov/glossary/term/authorization)). Authorization is distinct from authentication which is the process of verifying an entity's identity. When designing and developing a software solution, it is important to keep these distinctions in mind. A user who has been authenticated (perhaps by providing a username and password) is often not authorized to access every resource and perform every action that is technically possible through a system. For example, a web app may have both regular users and admins, with the admins being able to perform actions the average user is not privileged to perform, even though they have been authenticated. Additionally, authentication is not always required for accessing resources; an unauthenticated user may be authorized to access certain public resources, such as an image or login page, or even an entire web app.

The objective of this cheat sheet is to assist developers in implementing authorization logic that is robust, appropriate to the app's business context, maintainable, and scalable. The guidance provided in this cheat sheet should be applicable to all phases of the development lifecycle and flexible enough to meet the needs of diverse development environments.

Flaws related to authorization logic are a notable concern for web apps. Broken Access Control was ranked as the most concerning web security vulnerability in [OWASP's 2021 Top 10](https://owasp.org/Top10/A01_2021-Broken_Access_Control/) and asserted to have a "High" likelihood of exploit by [MITRE's CWE program](https://cwe.mitre.org/data/definitions/285.html). Furthermore, according to [Veracode's State of Software Vol. 10](https://www.veracode.com/sites/default/files/pdf/resources/sossreports/state-of-software-security-volume-10-veracode-report.pdf), Access Control was among the more common of OWASP's Top 10 risks to be involved in exploits and security incidents despite being among the least prevalent of those examined.

The potential impact resulting from exploitation of authorization flaws is highly variable, both in form and severity. Attackers may be able to read, create, modify, or delete resources that were meant to be protected (thus jeopardizing their confidentiality, integrity, and/or availability); however, the actual impact of such actions is necessarily linked to the criticality and sensitivity of the compromised resources. Thus, the business cost of a successfully exploited authorization flaw can range from very low to extremely high.

Both entirely unauthenticated outsiders and authenticated (but not necessarily authorized) users can take advantage of authorization weaknesses.  Although honest mistakes or carelessness on the part of non-malicious entities may enable authorization bypasses, malicious intent is typically required for access control threats to be fully realized.  Horizontal privilege elevation (i.e. being able to access another user's resources) is an especially common weakness that an authenticated user may be able to take advantage of. Faults related to authorization control can allow malicious insiders and outsiders alike to view, modify, or delete sensitive resources of all forms (databases records, static files, personally identifiable information (PII), etc.) or perform actions, such as creating a new account or initiating a costly order, that they should not be privileged to do. Furthermore, if logging related to access control is not properly set-up, such authorization violations may go undetected or at least remain unattributable to a particular individual or group.

## Recommendations

### Enforce Least Privileges

As a security concept, Least Privileges refers to the principle of assigning users only the minimum privileges necessary to complete their job. Although perhaps most commonly applied in system administration, this principle has relevance to the software developer as well. Least Privileges must be applied both horizontally and vertically. For example, even though both an accountant and sales representative may occupy the same level in an organization's hierarchy, both require access to different resources to perform their jobs. The accountant should likely not be granted access to a customer database and the sales representative should not be able to access payroll data. Similarly, the head of the sales department is likely to need more privileged access than their subordinates.

Failure to enforce least privileges in an application can jeopardize the confidentiality of sensitive resources. Mitigation strategies are applied primarily during the Architecture and Design phase (see [CWE-272](https://cwe.mitre.org/data/definitions/272.html)); however, the principle must be addressed throughout the SDLC.

Consider the following points and best practices:

- During the design phase, ensure trust boundaries are defined. Enumerate the types of users that will be accessing the system, the resources exposed and the operations (such as read, write, update, etc) that might be performed on those resources. For every combination of user type and resource, determine what operations, if any, the user (based on role and/or other attributes) must be able to perform on that resource. For an ABAC system ensure all categories of attributes are considered. For example, a Sales Representative may need to access a customer database from the internal network during working hours, but not from home at midnight.
- Create tests that validate that the permissions mapped out in the design phase are being correctly enforced.
- After the app has been deployed, periodically review permissions in the system for "privilege creep"; that is, ensure the privileges of users in the current environment do not exceed those defined during the design phase (plus or minus any formally approved changes).
- Remember, it is easier to grant users additional permissions rather than to take away some they previously enjoyed. Careful planning and implementation of Least Privileges early in the SDLC can help reduce the risk of needing to revoke permissions that are later deemed overly broad.

### Deny by Default

Even when no access control rules are explicitly matched, the application cannot remain neutral when an entity is requesting access to a particular resource. The application must always make a decision, whether implicitly or explicitly, to either deny or permit the requested access. Logic errors and other mistakes relating to access control may happen, especially when access requirements are complex; consequently, one should not rely entirely on explicitly defined rules for matching all possible requests. For security purposes an application should be configured to deny access by default.

Consider the following points and best practices:

- Adopt a "deny-by-default" mentality both during initial development and whenever new functionality or resources are exposed by the app. One should be able to explicitly justify why a specific permission was granted to a particular user or group rather than assuming access to be the default position.
- Although some frameworks or libraries may themselves adopt a deny-by-default strategy, explicit configuration should be preferred over relying on framework or library defaults. The logic and defaults of third-party code may evolve over time, without the developer's full knowledge or understanding of the change's implications for a particular project.

### Validate the Permissions on Every Request

Permission should be validated correctly on every request, regardless of whether the request was initiated by an AJAX script, server-side, or any other source. The technology used to perform such checks should allow for global, application-wide configuration rather than needing to be applied individually to every method or class. Remember an attacker only needs to find one way in. Even if just a single access control check is "missed", the confidentiality and/or integrity of a resource can be jeopardized. Validating permissions correctly on just the majority of requests is insufficient. Specific technologies that can help developers in performing such consistent permission checks include the following:

- [Java/Jakarta EE Filters](https://jakarta.ee/specifications/platform/8/apidocs/javax/servlet/Filter.html) including implementations in [Spring Security](https://docs.spring.io/spring-security/site/docs/5.4.0/reference/html5/#servlet-security-filters)
- [Middleware in the Django Framework](https://docs.djangoproject.com/en/4.0/ref/middleware/)
- [.NET Core Filters](https://docs.microsoft.com/en-us/aspnet/core/mvc/controllers/filters?view=aspnetcore-3.1#authorization-filters)
- [Middleware in the Laravel PHP Framework](https://laravel.com/docs/8.x/middleware)

### Thoroughly Review the Authorization Logic of Chosen Tools and Technologies, Implementing Custom Logic if Necessary

Today's developers have access to vast amounts of libraries, platforms, and frameworks that allow them to incorporate robust, complex logic into their apps with minimal effort. However, these frameworks and libraries must not be viewed as a quick panacea for all development problems; developers have a duty to use such frameworks responsibly and wisely. Two general concerns relevant to framework/library selection as relevant to proper access control are misconfiguration/lack of configuration on the part of the developer and vulnerabilities within the components themselves (see [A6](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A6-Security_Misconfiguration) and [A9](https://owasp.org/www-project-top-ten/2017/A9_2017-Using_Components_with_Known_Vulnerabilities.html) for general guidance on these topics).

Even in an otherwise securely developed application, vulnerabilities in third-party components can allow an attacker to bypass normal authorization controls. Such concerns need not be restricted to unproven or poorly maintained projects, but affect even the most robust and popular libraries and frameworks. Writing complex, secure software is hard. Even the most competent developers, working on high-quality libraries and frameworks, will make mistakes. Assume any third-party component you incorporate into an application *could* be or become subject to an authorization vulnerability. Important considerations include:

- Create, maintain, and follow processes for detecting and responding to vulnerable components.
- Incorporate tools such as [Dependency Check](https://owasp.org/www-project-dependency-check/) into the SDLC and consider subscribing to data feeds from vendors, [the NVD](https://nvd.nist.gov/vuln/data-feeds), or other relevant sources.
- Implement defense in depth. Do not depend on any single framework, library, technology, or control to be the sole thing enforcing proper access control.

Misconfiguration (or complete lack of configuration) is another major area in which the components developers build upon can lead to broken authorization.  These components are typically intended to be relatively general purpose tools made to appeal to a wide audience. For all but the simplest use cases, these frameworks and libraries must be customized or supplemented with additional logic in order to meet the unique requirements of a particular app or environment. This consideration is especially important when security requirements, including authorization, are concerned. Notable configuration considerations for authorization include the following:

- Take time to thoroughly understand any technology you build authorization logic upon. Analyze the technology's capabilities with an understanding that *the authorization logic provided by the component may be insufficient for your application's specific security requirements*. Relying on prebuilt logic may be convenient, but this does not mean it is sufficient. Understand that custom authorization logic may well be necessary to meet an app's security requirements.
- Do not let the capabilities of any library, platform, or framework guide your authorization requirements. Rather, authorization requirements should be decided first and then the third-party components may be analyzed in light of these requirements.
- Do not rely on default configurations.
- Test configuration. Do not just assume any configuration performed on a third-party component will work exactly as intended in your particular environment. Documentation can be misunderstood, vague, outdated, or simply inaccurate.

### Prefer Attribute and Relationship Based Access Control over RBAC

In software engineering, two basic forms of access control are widely utilized: Role-Based Access Control (RBAC) and Attribute-Based Access Control (ABAC). There is a third, more recent, model which has gained popularity: Relationship-Based Access Control (ReBAC). The decision between the models has significant implications for the entire SDLC and should be made as early as possible.

- RBAC is a model of access control in which access is granted or denied based upon the roles assigned to a user. Permissions are not directly assigned to an entity; rather, permissions are associated with a role and the entity inherits the permissions of any roles assigned to it. Generally, the relationship between roles and users can be many-to-many, and roles may be hierarchical in nature.

- ABAC may be defined as an access control model where "subject requests to perform operations on objects are granted or denied based on assigned attributes of the subject, assigned attributes of the object, environment conditions, and a set of policies that are specified in terms of those attributes and conditions" ([NIST SP 800-162](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-162.pdf), pg. 7). As defined in NIST SP 800-162, attributes are simply characteristics that can be represented as name-value pairs and assigned to a subject, object, or the environment. Job role, time of day, project name, MAC address, and creation date are but a very small sampling of possible attributes that highlight the flexibility of ABAC implementations.

- ReBAC is an access control model that grants access based on the relationships between resources. For instance, allowing only the user who created a post to edit it. This is especially necessary in social network applications, like Twitter or Facebook, where users want to limit access to their data (tweets or posts) to people they choose (friends, family, followers).

Although RBAC has a long history and remains popular among software developers today, ABAC and ReBAC should typically be preferred for application development. Their advantages over RBAC include:

- **Support fine-grained, complex Boolean logic**. In RBAC, access decisions are made on the presence or absence of roles; that is, the main characteristic of a requesting entity considered is the role(s) assigned to it. Such simplistic logic does a poor job of supporting object-level or horizontal access control decisions and those that require multiple factors.

    - ABAC greatly expands both the number and type of characteristics that can be considered. In ABAC, a "role" or job function can certainly be one attribute assigned to a subject, but it need not be considered in isolation (or at all if this characteristic is not relevant to the particular access requested). Furthermore, ABAC can incorporate environmental and other dynamic attributes, such as time of day, type of device used, and geographic location. Denying access to a sensitive resource outside of normal business hours or if a user has not recently completed mandatory training are just a couple of examples where ABAC could meet access control requirements that RBAC would struggle to fulfill. Thus, ABAC is more effective than RBAC in addressing the principle of least privileges.
    - ReBAC, since it supports assigning relationships between direct objects and direct users (and not just a role), allows for fine-grained permissions. Some systems also support algebraic operators like AND and NOT to express policies like "if this user has relationship X but not relationship Y with the object, then grant access".

- **Robustness**. In large projects or when numerous roles are present, it is easy to miss or improperly perform role checks ([OWASP C7: Enforce Access Controls](https://owasp.org/www-project-proactive-controls/v3/en/c7-enforce-access-controls)). This can result in both too much and too little access. This is especially true in RBAC implementations where a role hierarchy is not present and multiple role checks must be chained to have the desired impact (i.e., `if(user.hasAnyRole("SUPERUSER", "ADMIN", "ACCT_MANAGER"))` ).
- **Speed**. In RBAC, "role explosion" can occur when a system defines too many roles. If users send their credential and roles through means like HTTP headers, which have size limits, there may not be enough space to include all of the user's roles. A viable workaround to this problem is to only send the user ID, and then the application retrieves the user's roles, but this will increase the latency of every request.
- **Supports Multi-Tenancy and Cross-Organizational Requests**. RBAC is poorly suited for use cases where distinct organizations or customers will need access to the same set of protected resources. Meeting such requirements with RBAC would require highly cumbersome methods such as configuring rule sets for each customer in a multi-tenant environment or requiring pre-provisioning of identities for cross-organizational requests ([OWASP C7](https://owasp.org/www-project-proactive-controls/v3/en/c7-enforce-access-controls); [NIST SP 800-162](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-162.pdf)). By contrast, as long as attributes are consistently defined, ABAC implementations allow access control decisions to be "executed and administered in the same or separate infrastructures, while maintaining appropriate levels of security" ([NIST SP 800-162](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-162.pdf), pg. 6).
- **Ease of Management**. Although the initial setup for RBAC is often simpler than ABAC, this short-term benefit quickly vanishes as the scale and complexity of a system grows. In the beginning, a couple of simple roles, such as User and Admin, may suffice for some apps, but this is very unlikely to hold true for any length of time in production applications. As roles become more numerous, both testing and auditing, critical processes for establishing trust in one's codebase and logic, become more difficult ([OWASP C7](https://owasp.org/www-project-proactive-controls/v3/en/c7-enforce-access-controls)). By contrast, ABAC and ReBAC are far more expressive, incorporate attributes and Boolean logic that better reflects real-world concerns, are easier to update when access-control needs change, and encourages the separation of policy management from  enforcement and provisioning of identities ([NIST SP 800-162](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-162.pdf); see also [XACML-V3.0](https://docs.oasis-open.org/xacml/3.0/xacml-3.0-core-spec-os-en.html) for a standard that highlights these benefits)

### Ensure Lookup IDs are Not Accessible Even When Guessed or Cannot Be Tampered With

Applications often expose the internal object identifiers (such as an account number or Primary Key in a database) that are used to locate and reference an object. This ID may be exposed as a query parameter, path variable, "hidden" form field or elsewhere. For example:

```https://mybank.com/accountTransactions?acct_id=901```

Based on this URL, one could reasonably assume that the application will return a listing of transactions and that the transactions returned will be restricted to a particular account - the account indicated in the `acct_id` param. But what would happen if the user changed the value of the `acct_id` param to another value such as `523`. Will the user be able to view transactions associated with another account even if it does not belong to him? If not, will the failure simply be the result of the account "523" not existing/not being found or will it be due to a failed access control check? Although this example may be an oversimplification, it illustrates a very common security flaw in application development - [CWE 639: Authorization Bypass Through User-Controlled Key](https://cwe.mitre.org/data/definitions/639.html).  When exploited, this weakness can result in authorization bypasses, horizontal privilege escalation and, less commonly, vertical privilege escalation (see [CWE-639](https://cwe.mitre.org/data/definitions/639.html)). This type of vulnerability also represents a form of Insecure Direct Object Reference (IDOR). The following paragraphs will describe the weakness and possible mitigations.

 In the example above, the lookup ID was not only exposed to the user and readily tampered with, but also appears to have been a fairly predictable, perhaps sequential, value.  While one can use various techniques to mask or randomize these IDs and make them hard to guess, such an approach is generally not sufficient by itself. A user should not be able to access a resource they do not have permissions simply because they are able to guess and manipulate that object's identifier in a query param or elsewhere. Rather than relying on some form of security through obscurity, the focus should be on controlling access to the underlying objects and/or the identifiers themselves. Recommended mitigations for this weakness include the following:

- Avoid exposing identifiers to the user when possible. For example it should be possible to retrieve some objects, such as account details,  based solely on currently authenticated user's identity and attributes (e.g. through information contained in a securely implemented JSON Web Token (JWT) or server-side session).
- Implement user/session specific indirect references using a tool such as [OWASP ESAPI](https://owasp.org/www-project-enterprise-security-api/) (see [OWASP 2013 Top 10 - A4 Insecure Direct Object References](https://wiki.owasp.org/index.php/Top_10_2013-A4-Insecure_Direct_Object_References))
- Perform access control checks on *every* request for the *specific* object or functionality being accessed. Just because a user has access to an object of a particular type does not mean they should have access to every object of that particular type.

### Enforce Authorization Checks on Static Resources

The importance of securing static resources is often overlooked or at least overshadowed by other security concerns. Although securing databases and similar data stores often justly receive significant attention from security conscious teams, static resources must also be appropriately secured. Although unprotected static resources are certainly a problem for websites and web applications of all forms, in recent years, poorly secured resources in cloud storage offerings (such as Amazon S3 Buckets) have risen to prominence. When securing static resources, consider the following:

- Ensure that static resources are incorporated into access control policies. The type of protection required for static resources will necessarily be highly contextual. It may be perfectly acceptable for some static resources to be publicly accessible, while others should only be accessible when a highly restrictive set of user and environmental attributes are present. Understanding the type of data exposed in the specific resources under consideration is thus critical. Consider whether a formal Data Classification scheme should be established and incorporated into the application's access control logic (see [here](https://resources.infosecinstitute.com/information-and-asset-classification/) for an overview of data classification).
- Ensure any cloud based services used to store static resources are secured using the configuration options and tools provided by the vendor. Review the cloud provider's documentation (see guidance from [AWS](https://aws.amazon.com/premiumsupport/knowledge-center/secure-s3-resources/), [Google Cloud](https://cloud.google.com/storage/docs/best-practices#security) and [Azure](https://docs.microsoft.com/en-us/azure/storage/blobs/security-recommendations) for specific implementations details).
- When possible, protect static resources using the same access control logic and mechanisms that are used to secure other application resources and functionality.

### Verify that Authorization Checks are Performed in the Right Location

Developers must never rely on client-side access control checks. While such checks may be permissible for improving the user experience, they should never be the decisive factor in granting or denying access to a resource; client-side logic is often easy to bypass. Access control checks must be performed server-side, at the gateway, or using serverless function (see [OWASP ASVS 4.0.3, V1.4.1 and V4.1.1](https://raw.githubusercontent.com/OWASP/ASVS/v4.0.3/4.0/OWASP%20Application%20Security%20Verification%20Standard%204.0.3-en.pdf))

### Exit Safely when Authorization Checks Fail

Failed access control checks are a normal occurrence in a secured application; consequently, developers must plan for such failures and handle them securely. Improper handling of such failures can lead to the application being left in an unpredictable state ([CWE-280: Improper Handling of Insufficient Permissions or Privileges](https://cwe.mitre.org/data/definitions/280.html)). Specific recommendations include the following:

- Ensure all exception and failed access control checks are handled no matter how unlikely they seem ([OWASP Top Ten Proactive Controls C10: Handle all errors and exceptions](https://owasp.org/www-project-proactive-controls/v3/en/c10-errors-exceptions.html)). This does not mean that an application should always try to "correct" for a failed check; oftentimes a simple message or HTTP status code is all that is required.
- Centralize the logic for handling failed access control checks.
- Verify the handling of exception and authorization failures. Ensure that such failures, no matter how unlikely, do not put the software into an unstable state that could lead to authorization bypass.
- Ensure sensitive information, such as system logs or debugging output, is not exposed in error messages. Misconfigured error messages can increase the attack surface of your application. ([CWE-209: Generation of Error Message Containing Sensitive Information](https://cwe.mitre.org/data/definitions/209.html))

### Implement Appropriate Logging

Logging is one of the most important detective controls in application security; insufficient logging and monitoring is recognized as among  the most critical security risks in [OWASP's Top Ten 2021](https://owasp.org/Top10/A09_2021-Security_Logging_and_Monitoring_Failures/). Appropriate logs can not only detect malicious activity, but are also invaluable resources in post-incident investigations, can be used to troubleshoot access control and other security related problems, and are useful in security auditing. Though easy to overlook during the initial design and requirements phase, logging is an important component of holistic application security and must be incorporated into all phases of the SDLC. Recommendations for logging include the following:

- Log using consistent, well-defined formats that can be readily parsed for analysis. According to [OWASP Top Ten Proactive Controls C9](https://owasp.org/www-project-proactive-controls/v3/en/c9-security-logging.html), [Apache Logging Services](https://logging.apache.org/) is one example of a project that provides support for numerous languages and platforms
- Carefully determine the amount of information to log. This should be determined according to the specific application environment and requirements. Both too much and too little logging may be considered security weaknesses (see [CWE-778](https://cwe.mitre.org/data/definitions/778.html) and [CWE-779](https://cwe.mitre.org/data/definitions/779.html)). Too little logging can result in malicious activity going undetected and greatly reduce the effectiveness of post-incident analysis. Too much logging not only can strain resources and lead to excessive false positives, but may also result in sensitive data being needlessly logged.
- Ensure clocks and timezones are synchronized across systems. Accuracy is crucial in piecing together the sequence of an attack during and after incident response.
- Consider incorporating application logs into a centralized log server or SIEM.

### Create Unit and Integration Test Cases for Authorization Logic

Unit and integration testing are essential for verifying that an application performs as expected and consistently across changes. Flaws in access control logic can be subtle, particularly when requirements are complex; however, even a small logical or configuration error in access control can result in severe consequences. Although not a substitution for a dedicated security test or penetration test (see [OWASP WSTG 4.5](https://owasp.org/www-project-web-security-testing-guide/v42/4-Web_Application_Security_Testing/05-Authorization_Testing/README) for an excellent guide on this topic as it relates to access control), automated unit and integration testing of access control logic can help reduce the number of security flaws that make it into production. These tests are good at catching the "low-hanging fruit" of security issues but not more sophisticated attack vectors ([OWASP SAMM: Security Testing](https://owaspsamm.org/model/verification/security-testing/)).

Unit and integration testing should aim to incorporate many of the concepts explored in this document. For example, is access being denied by default? Does the application terminate safely when an access control check fails, even under abnormal conditions? Are ABAC policies being properly enforced? While simple unit and integration tests can never replace manual testing performed by a skilled hacker, they are an important tool for detecting and correcting security issues quickly and with far less resources than manual testing.

## References

### ABAC

- [ABAC with Spring Security](https://dzone.com/articles/simple-attribute-based-access-control-with-spring)

- [What is ABAC? Implementation patterns and examples](https://www.osohq.com/learn/what-is-attribute-based-access-control-abac)

- [NIST Special Publication 800-162 Guide to Attribute Based Access Control (ABAC) Definition and Considerations](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-162.pdf)

- [NIST SP 800-178 A Comparison of Attribute Based Access Control (ABAC) Standards for Data Service Applications](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-178.pdf)

- [NIST SP 800-205 Attribute Considerations for Access Control Systems](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-205.pdf)

- [XACML-V3.0](https://docs.oasis-open.org/xacml/3.0/xacml-3.0-core-spec-os-en.html) for standard that highlights these benefits

### General

- [OWASP Application Security Verification Standard 4.0 (especially see V4: Access Control Verification Requirements)](https://raw.githubusercontent.com/OWASP/ASVS/v4.0.3/4.0/OWASP%20Application%20Security%20Verification%20Standard%204.0.3-en.pdf)

- [OWASP Web Security Testing Guide - 4.5 Authorization Testing](https://owasp.org/www-project-web-security-testing-guide/v42)

### Least Privilege

- [Least Privilege](https://us-cert.cisa.gov/bsi/articles/knowledge/principles/least-privilege)

### RBAC

- [Role-Based Access Controls](https://csrc.nist.gov/CSRC/media/Publications/conference-paper/1992/10/13/role-based-access-controls/documents/ferraiolo-kuhn-92.pdf)

### ReBAC

- [Relationship-Based Access Control (ReBAC)](https://www.osohq.com/academy/relationship-based-access-control-rebac)
- [Google Zanzibar](https://zanzibar.academy/)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 概要

認可は、要求された操作やサービスが特定の主体に対して承認されているかを検証するプロセスです。認証は主体の身元を確認するプロセスであり、認可とは別の概念です。認証済みユーザーであっても、システム上で実行可能なすべての操作や、すべてのリソースへのアクセスが許可されるわけではありません。

認可の欠陥は、保護されるべきリソースの読み取り、作成、変更、削除、または本来許可されない高コストな操作を可能にします。水平権限昇格、つまり他ユーザーのリソースへアクセスできる欠陥は特に一般的です。認可違反に関するログが不十分な場合、侵害が検知されず、誰が実行したかも追跡できなくなります。

### 最小権限を適用する

ユーザーには、業務を完了するために必要な最小限の権限だけを付与します。最小権限は、管理者権限のような垂直方向だけでなく、同じ階層にいるユーザー同士の水平方向にも適用します。

設計段階では、信頼境界、ユーザー種別、リソース、許可される操作を列挙します。ユーザー種別とリソースの組み合わせごとに、読み取り、作成、更新、削除などの操作可否を定義します。ABAC を使う場合は、ユーザー属性、リソース属性、環境属性、操作属性を考慮します。

設計で定義した権限は、実装後も定期的にレビューします。ユーザーが異動や運用上の例外で一時的に得た権限を持ち続ける privilege creep を避け、正式に承認された変更以外で権限が広がっていないことを確認します。権限を後から取り上げるより、SDLC の早い段階で慎重に計画し、必要に応じて追加するほうが安全です。

### デフォルト拒否にする

明示的に許可されていない操作は拒否します。認可判断で例外や未定義状態が発生した場合も、安全側に倒して拒否します。新機能や新リソースを追加したときに、認可ルールが未設定のままアクセス可能になる設計を避けます。

### すべてのリクエストで権限を検証する

認可は、アプリケーション起動時やログイン時だけでなく、各リクエストで確認します。攻撃者は URL、HTTP メソッド、ID、リクエスト本文、API 呼び出し順序を改変できます。したがって、クライアント側の表示制御やルーティングだけに頼らず、サーバー側で操作ごとの認可を実施します。

キャッシュ、セッション、トークンに権限情報を保持する場合も、権限変更や失効が反映されるようにします。古い権限情報によってアクセスが残り続ける設計を避けます。

### ツールやフレームワークの認可ロジックを確認する

フレームワーク、API ゲートウェイ、ミドルウェア、ライブラリの認可機能を使う場合でも、そのロジックがアプリケーションの業務要件に合っているかをレビューします。組み込み機能が十分でない場合は、必要な認可ロジックを追加します。

認可チェックの場所も重要です。UI、クライアント、API ゲートウェイだけでなく、最終的に保護対象リソースを操作するサーバー側で検証される必要があります。

サードパーティコンポーネントは、誤設定、未設定、脆弱性により認可バイパスを生む可能性があります。脆弱なコンポーネントを検出し対応するプロセスを作り、Dependency Check などのツールや NVD、ベンダー情報を SDLC に組み込みます。単一のフレームワーク、ライブラリ、ゲートウェイだけを認可の最後の砦にせず、多層防御を実装します。

### RBAC より属性・関係ベースの制御を優先する

単純なロールベースアクセス制御だけでは、複雑な業務条件やリソース所有関係を表現しきれない場合があります。属性ベースアクセス制御や関係ベースアクセス制御を使うと、ユーザー属性、リソース属性、組織、所有者、時間、場所、リスク状態などを使って、より精密な認可判断ができます。

ただし、複雑な認可モデルは実装やレビューも難しくなります。ポリシー、属性の信頼性、評価順序、失敗時の挙動を明確にし、テスト可能な形にします。

RBAC は導入初期には単純ですが、実運用でロールが増えると role explosion が発生し、テストや監査が難しくなります。ロール情報を HTTP ヘッダーなどに詰め込む構成ではサイズ制限やレイテンシの問題も起きます。マルチテナントや組織横断アクセスでは、顧客や組織ごとのルールセットを個別に作るより、属性や関係を一貫して定義し、ポリシー管理と強制を分離できる設計が適しています。

### 推測可能な ID への対策

リソース ID が推測可能でも、それだけでアクセスできてはいけません。URL や API パラメータに含まれる ID、ファイル名、注文番号、ユーザー ID などは、すべてユーザー入力として扱います。対象オブジェクトへのアクセス権をサーバー側で検証し、IDOR や水平権限昇格を防ぎます。

ID をランダム化することは補助策になり得ますが、認可チェックの代替にはなりません。

### 静的リソースにも認可を適用する

画像、PDF、ダウンロードファイル、生成済みレポートなどの静的リソースも、機密情報を含む場合は認可対象です。アプリケーション経由では保護されていても、直接 URL でアクセスできる配置にしてはいけません。公開してよいリソースと認可が必要なリソースを分離します。

### 認可失敗時の安全な終了

認可チェックに失敗した場合、処理を中断し、保護対象リソースへ副作用を与えないようにします。失敗時の例外処理、エラー応答、ログ記録も設計します。エラー応答は、対象リソースが存在するかどうか、権限の詳細、内部実装を不要に漏らさないようにします。

失敗処理は中央集約し、例外や認可失敗がどれほど起こりにくく見える場合でも処理されるようにします。認可失敗後にソフトウェアが不安定な状態へ残ると、後続処理で認可バイパスにつながる可能性があります。

### 適切なログを実装する

認可失敗、権限変更、管理者操作、高リスク操作、異常なアクセス試行はログに記録します。ログには、誰が、どのリソースに、どの操作を試み、どの結果になったかを含めます。ただし、機密情報や過度な内部情報は記録しません。

ログは、攻撃検知、調査、監査、説明責任に使えるよう、イベント名と属性を統一します。

ログ量は環境と要件に合わせて決めます。少なすぎるログは攻撃検知と事後分析を難しくし、多すぎるログはリソース消費、過剰な誤検知、機密データの不要な記録につながります。複数システムにまたがる攻撃手順を再構成できるよう、時計とタイムゾーンを同期し、必要に応じて集中ログサーバーや SIEM に取り込みます。

### 認可ロジックのテスト

認可ロジックには、単体テストと統合テストを作成します。許可されるケースだけでなく、拒否されるべきケース、他ユーザーのリソース、ロール不足、権限失効後、HTTP メソッド変更、ID 改ざん、API の順序変更などをテストします。

権限モデルが変わったときは、既存の認可テストが失効していないかを確認します。

</div>
</div>

</section>
</div>

## Attribution

<div className="attributionFooter">

- Original: Authorization Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: English original retained for comparison. Japanese translation added. Bilingual display generated from official source and local Japanese notes.
- Retrieved: 2026-05-20

</div>
