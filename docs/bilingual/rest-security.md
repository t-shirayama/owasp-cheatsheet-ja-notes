---
hide_table_of_contents: true
---

# REST Security Cheat Sheet

<div className="docHero" data-category="api-and-web-service">
  <h1>REST Security Cheat Sheet</h1>
  <p className="docSubtitle">REST セキュリティチートシート</p>
  <div className="docMeta">
    <span className="docPill">最終更新: 2026-05-20</span>
    <span className="docPill">読了時間: 約 16 分</span>
    <span className="docPill">カテゴリ: API and Web Service</span>
  </div>
</div>

<div className="tabbedContent">
  <input className="tabInput" type="radio" name="rest-security-view" id="rest-security-translation" defaultChecked />
  <input className="tabInput" type="radio" name="rest-security-view" id="rest-security-summary" />
  <input className="tabInput" type="radio" name="rest-security-view" id="rest-security-checklist" />
  <input className="tabInput" type="radio" name="rest-security-view" id="rest-security-bilingual" />

  <div className="contentTabs">
    <label htmlFor="rest-security-translation">翻訳</label>
    <label htmlFor="rest-security-summary">要点</label>
    <label htmlFor="rest-security-checklist">チェックリスト</label>
    <label htmlFor="rest-security-bilingual">対比表示</label>
  </div>

<section id="rest-security-translation-panel" className="tabPanel translationPanel contentPanel">

RESTful Web サービスは、認証、認可、セッション管理、入力検証、出力エンコーディングなど、Web アプリケーションと同じセキュリティ課題を持ちます。REST API はステートレスであることが一般的ですが、各リクエストで認証情報と認可判断を検証する必要があります。API の境界では、トランスポート保護、トークン検証、HTTP メソッド制御、CORS、監査ログ、エラー応答を一貫して扱います。

## HTTPS

安全な REST API は HTTPS のみで公開します。API キー、アクセストークン、セッション Cookie、リクエスト本文には機密情報が含まれる可能性があるため、平文 HTTP では送信しません。管理用 API、内部 API、バックエンド間 API であっても、ネットワーク境界を信頼せず TLS を使います。ブラウザから利用される API では HSTS を組み合わせ、Cookie を使う場合は `Secure` 属性を付けます。

## アクセス制御

REST API は、操作ごと、リソースごとに認可を検証します。URL、HTTP メソッド、リクエスト本文、クエリパラメータから対象リソースや操作を推測する場合でも、クライアントから渡された識別子を信頼してはいけません。オブジェクト ID の差し替え、過大な scope、テナント ID の改ざん、管理者用エンドポイントの直接呼び出しなどにより、権限昇格や IDOR が発生します。

## JWT

JSON Web Token (JWT) を使う場合は、署名、発行者、対象者、有効期限、利用目的を検証します。`alg` ヘッダーを信頼して検証方式を動的に弱めてはいけません。受け入れるアルゴリズムをサーバー側で固定し、`none` や想定外の対称・非対称アルゴリズム混同を拒否します。JWT は秘匿されているとは限らないため、機密情報を平文 Claim として入れません。長寿命の JWT は漏えい時の影響が大きいため、短い有効期限、更新トークン保護、失効戦略を設計します。

## API キー

API キーはクライアントや呼び出し元システムの識別に使えますが、ユーザー認証や細粒度認可の代替にしてはいけません。キーは推測困難に生成し、ログや URL に残りやすいクエリパラメータではなく、ヘッダーで送信します。キーには用途、環境、呼び出し元、権限、期限を関連付け、ローテーションと失効を運用できるようにします。

## OAuth

OAuth 2.0 を使う API では、アクセストークンを API 認可の根拠として扱い、ID Token と混同しません。リソースサーバーは issuer、audience、有効期限、scope などを検証し、そのトークンが対象 API、対象リソース、対象操作に使えることを確認します。Bearer トークンは保持者が利用できるため、HTTPS、短い有効期限、最小 scope、必要に応じて送信者制約付きトークンを組み合わせます。

## 入力検証

REST API の入力は、パス、クエリ、ヘッダー、Cookie、本文、ファイルアップロードなど、すべて信頼できないものとして検証します。スキーマ、型、長さ、列挙値、文字種、数値範囲、必須項目、追加プロパティの扱いを明確にします。JSON や XML の解析では、過大なペイロード、深すぎるネスト、外部エンティティ、曖昧な文字エンコーディングを考慮します。バリデーションはクライアント側だけでなく、サーバー側で必ず実施します。

## HTTP メソッド

許可する HTTP メソッドを明示し、不要なメソッドを拒否します。`GET` は状態変更に使わず、`POST`、`PUT`、`PATCH`、`DELETE` は認証、認可、CSRF 要件、監査ログ要件を満たしてから処理します。`OPTIONS`、`TRACE`、`DEBUG` など、不要または危険なメソッドは無効化します。メソッド不一致時は安全なステータスコードを返し、内部実装情報を含めません。

## 順序外 API 実行の防止

現代的な REST API は、作成、検証、承認、確定などの一連のエンドポイントで業務フローを実装することがあります。バックエンドがワークフロー状態の遷移を明示的に検証しない場合、攻撃者は後続ステージのエンドポイントを直接呼び出して、意図された制御を迂回できます。各エンドポイントが個別に認証・認可されていても、現在の状態を検証しなければ、支払い前の注文確定、承認前の公開、本人確認前の権限付与などが発生します。

サーバー側では、各リクエストでワークフロー状態を検証します。ワークフローは有限状態または状態機械として明示的にモデル化し、トークンや識別子を特定のワークフローステージへ結び付けます。正しい順序の強制をフロントエンドだけに任せず、不正または順序外の遷移は明確に拒否します。テストでは、エンドポイントを順序外に呼び出せるか、各エンドポイントが現在状態を検証するか、トークンがステップ間で再利用できるか、不正な状態遷移が一貫して拒否されるかを確認します。

## Content-Type 検証

REST のリクエスト本文とレスポンス本文は、ヘッダーで宣言された意図した Content-Type と一致している必要があります。一致しない場合、利用側または生成側で解釈がずれ、コードインジェクションやコード実行につながる可能性があります。API がサポートする Content-Type は文書化します。

リクエストでは、想定外または欠落した Content-Type を含むリクエストを `406 Unacceptable` または `415 Unsupported Media Type` で拒否します。ただし `Content-Length: 0` の場合、Content-Type ヘッダーは任意です。XML を受け入れる場合は、XXE などに脆弱でないようパーサーを堅牢化します。フレームワークの `consumes` や `produces` などを使い、意図しない Content-Type を誤って公開しないようにします。

レスポンスでは、`Accept` ヘッダーをそのまま `Content-Type` にコピーしてはいけません。`Accept` ヘッダーが許可された型を具体的に含まない場合は、可能であれば `406 Not Acceptable` で拒否します。レスポンス本文に一致する意図した Content-Type、例えば JSON なら `application/json` を送信し、`application/javascript` など誤解を招く型を返さないようにします。

## 管理エンドポイント

管理エンドポイントはインターネットへ公開しないことが推奨されます。公開が必要な場合でも、多要素認証などの強い認証を必須にします。管理エンドポイントは、通常の公開 API と異なる HTTP ポートまたはホスト、可能であれば異なる NIC と制限されたサブネットで公開します。ファイアウォールルールやアクセス制御リストによりアクセス元を制限します。

## CORS

Cross-Origin Resource Sharing (CORS) は、必要な origin、メソッド、ヘッダーに限定します。ワイルドカード origin と credentials の組み合わせは許可しません。動的に origin を反射する実装は、許可リスト検証がない場合にクロスオリジンのデータ漏えいにつながります。プリフライト応答では必要最小限のメソッドとヘッダーを返し、CORS 設定を認可の代替にしてはいけません。

## セキュリティヘッダー

API 応答にも適切なセキュリティヘッダーを設定します。ブラウザで解釈される可能性がある応答では、クリックジャッキング、MIME sniffing、混在コンテンツ、過度なキャッシュを防ぎます。機密データを返す API では、キャッシュ制御を明確にし、クライアントや中間プロキシが機密応答を保持しないようにします。

## エラー処理

エラー応答は、呼び出し元が問題を理解できる範囲で一貫した形式にし、スタックトレース、内部パス、SQL、設定値、トークン、シークレット、詳細な依存サービス情報を含めません。認証失敗、認可失敗、存在しないリソース、入力エラーは適切なステータスコードで区別しますが、アカウント列挙やリソース存在確認につながる情報は抑制します。

## HTTP リターンコード

REST API では、成功に常に `200`、エラーに常に `404` を使うのではなく、意味的に適切な HTTP ステータスコードを返します。認証情報が欠落または不正な場合は `401 Unauthorized`、認可されていない操作は `403 Forbidden`、存在しないリソースは `404 Not Found`、許可されていないメソッドは `405 Method Not Allowed`、受け入れられないレスポンス型は `406 Not Acceptable`、過大なリクエストは `413 Payload Too Large`、未対応の Content-Type は `415 Unsupported Media Type`、レート制限や DoS 検知では `429 Too Many Requests` を使います。`500 Internal Server Error` などのサーバーエラーでは、攻撃者に役立つ詳細なエラーやスタックトレースを返さないようにします。

## 監査ログ

API では認証、認可、重要操作、管理操作、トークン失敗、入力検証失敗、レート制限、異常なアクセスパターンを記録します。ログには相関 ID、呼び出し元、対象リソース、操作、結果、時刻を含めます。一方で、パスワード、トークン、API キー、個人情報などをそのまま記録しないようにします。ログは改ざん、削除、過度な閲覧から保護します。

## HTTP リクエスト内の機密情報

RESTful Web サービスは、認証情報の漏えいを防ぐ必要があります。パスワード、セキュリティトークン、API キーを URL に含めると、Web サーバーログ、ブラウザ履歴、プロキシログなどに記録される可能性があります。`POST` や `PUT` では機密データをリクエスト本文またはヘッダーで送信し、`GET` では HTTP ヘッダーで送信します。URL クエリに API キーやトークンを含める設計は避けます。

</section>

<section id="rest-security-summary-panel" className="tabPanel summaryPanel contentPanel">

REST API は Web アプリケーションと同じく、通信保護、認証、認可、入力検証、トークン管理、CORS、HTTP メソッド制御、エラー処理、監査ログが主要な防御領域です。ステートレスな API でも、各リクエストで呼び出し元、対象リソース、許可された操作、トークンの有効性を検証する必要があります。

## 要点

- HTTPS を強制し、API キー、Bearer トークン、Cookie、機密データを平文 HTTP で送信しない。
- 操作ごと、リソースごと、テナントごとに認可を検証し、クライアントから渡された ID や scope を信頼しない。
- JWT は署名、issuer、audience、有効期限、用途を検証し、受け入れるアルゴリズムをサーバー側で固定する。
- API キーは識別用途として扱い、ユーザー認証や細粒度認可の代替にしない。キーはヘッダーで送信し、ローテーションできるようにする。
- OAuth 2.0 のアクセストークンは API 認可用として検証し、ID Token と混同しない。
- 入力検証はパス、クエリ、ヘッダー、Cookie、本文、ファイルアップロードのすべてに対してサーバー側で実施し、リクエストサイズ制限を設ける。
- 不要な HTTP メソッドを拒否し、状態変更操作には認証、認可、監査ログを適用する。
- 業務フローを構成する API では、ワークフロー状態をサーバー側で検証し、順序外の直接呼び出しを拒否する。
- Content-Type と Accept を許可リストで検証し、想定外または欠落した型を `406` または `415` で拒否する。
- 管理エンドポイントはインターネットへ公開せず、必要な場合は強い認証、分離されたポートまたはホスト、ネットワーク制限を適用する。
- CORS は許可 origin、メソッド、ヘッダーを必要最小限にし、origin 反射や credentials 付きワイルドカードを避ける。
- エラー応答から内部情報やシークレットを漏らさず、監査ログには機密値をそのまま記録しない。
- HTTP ステータスコードは意味に応じて使い分け、`401`、`403`、`405`、`406`、`413`、`415`、`429` などを適切に返す。

## 実装時の注意点

- CORS はブラウザの同一オリジン制約を緩和する設定であり、API 認可の代替ではありません。
- JWT の Claim は署名検証後にしか信頼できません。`alg` や `kid` を攻撃者が制御できる入力として扱い、鍵選択とアルゴリズム選択を制限します。
- REST API の IDOR は、URL の ID、本文の ID、テナント ID、親子リソース関係のどこでも起こり得ます。リソース所有者と操作権限をサーバー側で確認します。
- ログの不足はインシデント調査を困難にしますが、過剰なログはトークン、API キー、個人情報の漏えい源になります。ログ項目を設計時に決めます。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V4.1 General API and Web Service Security | HTTPS、入力検証、Content-Type、メソッド制御、順序外 API 実行防止、エラー処理、ログ |
| V4.2 RESTful Web Service | REST API の認証、認可、JWT、OAuth、API キー、CORS |
| V4.3 GraphQL | ASVS Index 上の関連。GraphQL 固有制御は別ページで確認する |
| V4.4 WebSocket | ASVS Index 上の関連。WebSocket 固有制御は別ページで確認する |
| V9.2 Token and Session-Based Authentication | JWT、Bearer トークン、API キー、トークン有効期限と失効 |

</section>

<section id="rest-security-checklist-panel" className="tabPanel checklistPanel contentPanel">

## V4.1 General API and Web Service Security

- [ ] 強制する: すべての API エンドポイントで HTTPS を使用し、平文 HTTP からの API キー、トークン、Cookie、機密データ送信を拒否する。
- [ ] 実装する: API 入力として受け取るパス、クエリ、ヘッダー、Cookie、本文、ファイルをサーバー側で検証する。
- [ ] 制限する: リクエストサイズ上限を定義し、上限超過時は `413 Payload Too Large` を返す。
- [ ] 実装する: Content-Type と Accept を許可リストで検証し、想定外または欠落した型を `406 Not Acceptable` または `415 Unsupported Media Type` で拒否する。
- [ ] 禁止する: `Accept` ヘッダーを検証せずにレスポンスの `Content-Type` へコピーすること。
- [ ] 制限する: HTTP メソッドを必要なものだけにし、`TRACE`、`DEBUG`、不要な `OPTIONS` などを拒否する。
- [ ] 実装する: 業務フローを持つ API で、作成、検証、承認、確定などの状態遷移をサーバー側で検証する。
- [ ] 禁止する: フロントエンドだけに API 実行順序の強制を任せること。
- [ ] 分離する: 管理エンドポイントを通常 API から分離し、インターネット公開を避ける。
- [ ] 強制する: 管理エンドポイントを公開する必要がある場合は、多要素認証などの強い認証とネットワークアクセス制限を適用する。
- [ ] 実装する: エラー応答を一貫した形式にし、スタックトレース、内部パス、SQL、設定値、トークン、シークレットを含めない。
- [ ] 返却する: 認証失敗、認可失敗、メソッド不一致、Content-Type 不一致、レート制限などに意味的に適切な HTTP ステータスコードを返す。
- [ ] 記録する: 認証、認可、重要操作、管理操作、入力検証失敗、レート制限、異常アクセスを監査ログに残す。
- [ ] 禁止する: パスワード、アクセストークン、リフレッシュトークン、API キー、個人情報をログに平文で記録すること。
- [ ] テストする: 平文 HTTP、過大ペイロード、想定外 Content-Type、想定外メソッド、順序外 API 実行、内部例外、ログマスキング漏れを回帰テストに含める。

### V4.2 RESTful Web Service

- [ ] 実装する: 操作ごと、リソースごと、テナントごとに認可を検証し、クライアントから渡された ID を信頼しない。
- [ ] 確認する: `GET` が状態変更に使われていない。
- [ ] 実装する: `POST`、`PUT`、`PATCH`、`DELETE` などの状態変更操作に、認証、認可、監査ログを適用する。
- [ ] 検証する: JWT の署名、issuer、audience、有効期限、用途、必要な Claim を確認する。
- [ ] 固定する: JWT の受け入れ可能なアルゴリズムをサーバー側設定で制限し、`none` と想定外アルゴリズムを拒否する。
- [ ] 禁止する: JWT の平文 Claim にシークレットや不要な個人情報を含めること。
- [ ] 管理する: API キーに用途、環境、呼び出し元、権限、期限を関連付け、失効とローテーションを可能にする。
- [ ] 禁止する: API キーを URL クエリパラメータで送信すること。ヘッダー送信を標準にする。
- [ ] 禁止する: パスワード、セキュリティトークン、API キーを URL に含めること。
- [ ] 実装する: CORS の許可 origin、メソッド、ヘッダーを許可リストで管理する。
- [ ] 禁止する: credentials 付き CORS でワイルドカード origin または未検証の origin 反射を許可すること。
- [ ] テストする: IDOR、過大 scope、テナント ID 改ざん、JWT 改ざん、期限切れ JWT、CORS origin 反射が失敗する。

### V4.3 GraphQL

- [ ] 確認する: GraphQL エンドポイントがある場合、REST 用チェックリストだけで完了扱いにせず、GraphQL 固有の認可、クエリ制限、イントロスペクション、エラー処理を別途レビューする。

### V4.4 WebSocket

- [ ] 確認する: WebSocket エンドポイントがある場合、接続確立時だけでなくメッセージ単位の認証、認可、入力検証、レート制限、ログを別途レビューする。

### V9.2 Token and Session-Based Authentication

- [ ] 検証する: OAuth 2.0 アクセストークンを API 認可に使う場合、issuer、audience、有効期限、scope を各リクエストで確認する。
- [ ] 禁止する: ID Token を API 認可用アクセストークンとして使用すること。
- [ ] 設計する: Bearer トークンの有効期限を短くし、漏えい時の影響を audience、scope、失効、必要に応じた送信者制約で低減する。
- [ ] テストする: 期限切れ、audience 不一致、scope 不足、改ざん、失効済みトークン、ID Token 誤用が拒否される。

</section>

<section id="rest-security-bilingual-panel" className="tabPanel bilingualPanel">

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Introduction

[REST](https://en.wikipedia.org/wiki/REST) (or **RE**presentational **S**tate **T**ransfer) is an architectural style first described in [Roy Fielding](https://en.wikipedia.org/wiki/Roy_Fielding)'s Ph.D. dissertation on [Architectural Styles and the Design of Network-based Software Architectures](https://www.ics.uci.edu/~fielding/pubs/dissertation/top.htm).

It evolved as Fielding wrote the HTTP/1.1 and URI specs and has been proven to be well-suited for developing distributed hypermedia applications. While REST is more widely applicable, it is most commonly used within the context of communicating with services via HTTP.

The key abstraction of information in REST is a resource. A REST API resource is identified by a URI, usually a HTTP URL. REST components use connectors to perform actions on a resource by using a representation to capture the current or intended state of the resource and transferring that representation.

The primary connector types are client and server, secondary connectors include cache, resolver and tunnel.

REST APIs are stateless. Stateful APIs do not adhere to the REST architectural style. State in the REST acronym refers to the state of the resource which the API accesses, not the state of a session within which the API is called. While there may be good reasons for building a stateful API, it is important to realize that managing sessions is complex and difficult to do securely.

Stateful services are out of scope of this Cheat Sheet: *Passing state from client to backend, while making the service technically stateless, is an anti-pattern that should also be avoided as it is prone to replay and impersonation attacks.*

In order to implement flows with REST APIs, resources are typically created, read, updated and deleted. For example, an ecommerce site may offer methods to create an empty shopping cart, to add items to the cart and to check out the cart. Each of these REST calls is stateless and the endpoint should check whether the caller is authorized to perform the requested operation.

Another key feature of REST applications is the use of standard HTTP verbs and error codes in the pursuit or removing unnecessary variation among different services.

Another key feature of REST applications is the use of [HATEOAS or Hypermedia As The Engine of Application State](https://en.wikipedia.org/wiki/HATEOAS). This provides REST applications a self-documenting nature making it easier for developers to interact with a REST service without prior knowledge.

</div>

<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

RESTful Web サービスは、認証、認可、セッション管理、入力検証、出力エンコーディングなど、Web アプリケーションと同じセキュリティ課題を持ちます。REST API はステートレスであることが一般的ですが、各リクエストで認証情報と認可判断を検証する必要があります。API の境界では、トランスポート保護、トークン検証、HTTP メソッド制御、CORS、監査ログ、エラー応答を一貫して扱います。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## HTTPS

Secure REST services must only provide HTTPS endpoints. This protects authentication credentials in transit, for example passwords, API keys or JSON Web Tokens. It also allows clients to authenticate the service and guarantees integrity of the transmitted data.

See the [Transport Layer Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html) for additional information.

Consider the use of mutually authenticated client-side certificates to provide additional protection for highly privileged web services.

</div>

<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## HTTPS

安全な REST API は HTTPS のみで公開します。API キー、アクセストークン、セッション Cookie、リクエスト本文には機密情報が含まれる可能性があるため、平文 HTTP では送信しません。管理用 API、内部 API、バックエンド間 API であっても、ネットワーク境界を信頼せず TLS を使います。ブラウザから利用される API では HSTS を組み合わせ、Cookie を使う場合は `Secure` 属性を付けます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Access Control

Non-public REST services must perform access control at each API endpoint. Web services in monolithic applications implement this by means of user authentication, authorization logic and session management. This has several drawbacks for modern architectures which compose multiple microservices following the RESTful style.

- in order to minimize latency and reduce coupling between services, the access control decision should be taken locally by REST endpoints
- user authentication should be centralised in a Identity Provider (IdP), which issues access tokens

</div>

<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## アクセス制御

REST API は、操作ごと、リソースごとに認可を検証します。URL、HTTP メソッド、リクエスト本文、クエリパラメータから対象リソースや操作を推測する場合でも、クライアントから渡された識別子を信頼してはいけません。オブジェクト ID の差し替え、過大な scope、テナント ID の改ざん、管理者用エンドポイントの直接呼び出しなどにより、権限昇格や IDOR が発生します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## JWT

There seems to be a convergence towards using [JSON Web Tokens](https://tools.ietf.org/html/rfc7519) (JWT) as the format for security tokens. JWTs are JSON data structures containing a set of claims that can be used for access control decisions. A cryptographic signature or message authentication code (MAC) can be used to protect the integrity of the JWT.

- Ensure JWTs are integrity protected by either a signature or a MAC. Do not allow the unsecured JWTs: `&#123;"alg":"none"&#125;`.
    - See [here](https://tools.ietf.org/html/rfc7519#section-6.1)
- In general, signatures should be preferred over MACs for integrity protection of JWTs.

If MACs are used for integrity protection, every service that is able to validate JWTs can also create new JWTs using the same key. This means that all services using the same key have to mutually trust each other. Another consequence of this is that a compromise of any service also compromises all other services sharing the same key. See [here](https://tools.ietf.org/html/rfc7515#section-10.5) for additional information.

The relying party or token consumer validates a JWT by verifying its integrity and claims contained.

- A relying party must verify the integrity of the JWT based on its own configuration or hard-coded logic. It must not rely on the information of the JWT header to select the verification algorithm. See [here](https://www.chosenplaintext.ca/2015/03/31/jwt-algorithm-confusion.html) and [here](https://www.youtube.com/watch?v=bW5pS4e_MX8>)

Some claims have been standardized and should be present in JWT used for access controls. At least the following of the standard claims should be verified:

- `iss` or issuer - is this a trusted issuer? Is it the expected owner of the signing key?
- `aud` or audience - is the relying party in the target audience for this JWT?
- `exp` or expiration time - is the current time before the end of the validity period of this token?
- `nbf` or not before time - is the current time after the start of the validity period of this token?

As JWTs contain details of the authenticated entity (user etc.) a disconnect can occur between the JWT and the current state of the users session, for example, if the session is terminated earlier than the expiration time due to an explicit logout or an idle timeout. When an explicit session termination event occurs, a digest or hash of any associated JWTs should be submitted to a denylist on the API which will invalidate that JWT for any requests until the expiration of the token. See the [JSON_Web_Token_for_Java_Cheat_Sheet](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html#token-explicit-revocation-by-the-user) for further details.

</div>

<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## JWT

JSON Web Token (JWT) を使う場合は、署名、発行者、対象者、有効期限、利用目的を検証します。`alg` ヘッダーを信頼して検証方式を動的に弱めてはいけません。受け入れるアルゴリズムをサーバー側で固定し、`none` や想定外の対称・非対称アルゴリズム混同を拒否します。JWT は秘匿されているとは限らないため、機密情報を平文 Claim として入れません。長寿命の JWT は漏えい時の影響が大きいため、短い有効期限、更新トークン保護、失効戦略を設計します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## API Keys

Public REST services without access control run the risk of being farmed leading to excessive bills for bandwidth or compute cycles. API keys can be used to mitigate this risk. They are also often used by organisation to monetize APIs; instead of blocking high-frequency calls, clients are given access in accordance to a purchased access plan.

API keys can reduce the impact of denial-of-service attacks. However, when they are issued to third-party clients, they are relatively easy to compromise.

- Require API keys for every request to the protected endpoint.
- Return `429 Too Many Requests` HTTP response code if requests are coming in too quickly.
- Revoke the API key if the client violates the usage agreement.
- Do not rely exclusively on API keys to protect sensitive, critical or high-value resources.

</div>

<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## API キー

API キーはクライアントや呼び出し元システムの識別に使えますが、ユーザー認証や細粒度認可の代替にしてはいけません。キーは推測困難に生成し、ログや URL に残りやすいクエリパラメータではなく、ヘッダーで送信します。キーには用途、環境、呼び出し元、権限、期限を関連付け、ローテーションと失効を運用できるようにします。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Restrict HTTP methods

- Apply an allowlist of permitted HTTP Methods e.g. `GET`, `POST`, `PUT`.
- Reject all requests not matching the allowlist with HTTP response code `405 Method not allowed`.
- Make sure the caller is authorised to use the incoming HTTP method on the resource collection, action, and record

In Java EE in particular, this can be difficult to implement properly. See [Bypassing Web Authentication and Authorization with HTTP Verb Tampering](https://cheatsheetseries.owasp.org/assets/REST_Security_Cheat_Sheet_Bypassing_VBAAC_with_HTTP_Verb_Tampering.pdf) for an explanation of this common misconfiguration.

</div>

<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## OAuth

OAuth 2.0 を使う API では、アクセストークンを API 認可の根拠として扱い、ID Token と混同しません。リソースサーバーは issuer、audience、有効期限、scope などを検証し、そのトークンが対象 API、対象リソース、対象操作に使えることを確認します。Bearer トークンは保持者が利用できるため、HTTPS、短い有効期限、最小 scope、必要に応じて送信者制約付きトークンを組み合わせます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Preventing Out-of-Order API Execution

Modern REST APIs often implement business workflows through a sequence of endpoints (for example, create → validate → approve → finalize). If the backend does not explicitly validate workflow state transitions, attackers may invoke endpoints out of sequence to bypass intended controls.

### Problem

Out-of-order API execution occurs when an attacker:

- Skips required workflow steps by directly calling later-stage endpoints
- Replays or reuses tokens across workflow boundaries
- Exploits assumptions that the frontend enforces correct sequencing

Because each endpoint may be individually authenticated and authorized, traditional access control checks often fail to detect these issues.

### Example

A checkout workflow expects the following sequence:

</div>
<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```http
POST /checkout/create
POST /checkout/pay
POST /checkout/confirm
```

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 入力検証

REST API の入力は、パス、クエリ、ヘッダー、Cookie、本文、ファイルアップロードなど、すべて信頼できないものとして検証します。スキーマ、型、長さ、列挙値、文字種、数値範囲、必須項目、追加プロパティの扱いを明確にします。JSON や XML の解析では、過大なペイロード、深すぎるネスト、外部エンティティ、曖昧な文字エンコーディングを考慮します。バリデーションはクライアント側だけでなく、サーバー側で必ず実施します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

If the backend does not validate workflow state transitions, an attacker could directly invoke:

</div>
<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```http
POST /checkout/confirm
```

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## HTTP メソッド

許可する HTTP メソッドを明示し、不要なメソッドを拒否します。`GET` は状態変更に使わず、`POST`、`PUT`、`PATCH`、`DELETE` は認証、認可、CSRF 要件、監査ログ要件を満たしてから処理します。`OPTIONS`、`TRACE`、`DEBUG` など、不要または危険なメソッドは無効化します。メソッド不一致時は安全なステータスコードを返し、内部実装情報を含めません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

without completing payment.

## Prevention Guidance

- Enforce workflow state validation on the server side for every request
- Model workflows explicitly using finite states or state machines
- Bind tokens or identifiers to specific workflow stages
- Avoid relying on frontend logic to enforce sequencing
- Reject invalid or out-of-order transitions with clear error responses

### Testing Checklist

- Can endpoints be invoked out of sequence?
- Does each endpoint validate the current workflow state?
- Are tokens reusable across workflow steps?
- Are invalid state transitions consistently rejected?

</div>

<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 順序外 API 実行の防止

現代的な REST API は、作成、検証、承認、確定などの一連のエンドポイントで業務フローを実装することがあります。バックエンドがワークフロー状態の遷移を明示的に検証しない場合、攻撃者は後続ステージのエンドポイントを直接呼び出して、意図された制御を迂回できます。各エンドポイントが個別に認証・認可されていても、現在の状態を検証しなければ、支払い前の注文確定、承認前の公開、本人確認前の権限付与などが発生します。

サーバー側では、各リクエストでワークフロー状態を検証します。ワークフローは有限状態または状態機械として明示的にモデル化し、トークンや識別子を特定のワークフローステージへ結び付けます。正しい順序の強制をフロントエンドだけに任せず、不正または順序外の遷移は明確に拒否します。テストでは、エンドポイントを順序外に呼び出せるか、各エンドポイントが現在状態を検証するか、トークンがステップ間で再利用できるか、不正な状態遷移が一貫して拒否されるかを確認します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Input validation

- Do not trust input parameters/objects.
- Validate input: length / range / format and type.
- Achieve an implicit input validation by using strong types like numbers, booleans, dates, times or fixed data ranges in API parameters.
- Constrain string inputs with regexps.
- Reject unexpected/illegal content.
- Make use of validation/sanitation libraries or frameworks in your specific language.
- Define an appropriate request size limit and reject requests exceeding the limit with HTTP response status 413 Request Entity Too Large.
- Consider logging input validation failures. Assume that someone who is performing hundreds of failed input validations per second is up to no good.
- Have a look at input validation cheat sheet for comprehensive explanation.
- Use a secure parser for parsing the incoming messages. If you are using XML, make sure to use a parser that is not vulnerable to [XXE](https://owasp.org/www-community/vulnerabilities/XML_External_Entity_%28XXE%29_Processing) and similar attacks.

</div>

<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## Content-Type 検証

REST のリクエスト本文とレスポンス本文は、ヘッダーで宣言された意図した Content-Type と一致している必要があります。一致しない場合、利用側または生成側で解釈がずれ、コードインジェクションやコード実行につながる可能性があります。API がサポートする Content-Type は文書化します。

リクエストでは、想定外または欠落した Content-Type を含むリクエストを `406 Unacceptable` または `415 Unsupported Media Type` で拒否します。ただし `Content-Length: 0` の場合、Content-Type ヘッダーは任意です。XML を受け入れる場合は、XXE などに脆弱でないようパーサーを堅牢化します。フレームワークの `consumes` や `produces` などを使い、意図しない Content-Type を誤って公開しないようにします。

レスポンスでは、`Accept` ヘッダーをそのまま `Content-Type` にコピーしてはいけません。`Accept` ヘッダーが許可された型を具体的に含まない場合は、可能であれば `406 Not Acceptable` で拒否します。レスポンス本文に一致する意図した Content-Type、例えば JSON なら `application/json` を送信し、`application/javascript` など誤解を招く型を返さないようにします。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Validate content types

A REST request or response body should match the intended content type in the header. Otherwise this could cause misinterpretation at the consumer/producer side and lead to code injection/execution.

- Document all supported content types in your API.

### Validate request content types

- Reject requests containing unexpected or missing content type headers with HTTP response status `406 Unacceptable` or `415 Unsupported Media Type`. For requests with `Content-Length: 0` however, a `Content-type` header is optional.
- For XML content types ensure appropriate XML parser hardening, see the [XXE cheat sheet](https://cheatsheetseries.owasp.org/cheatsheets/XML_External_Entity_Prevention_Cheat_Sheet.html).
- Avoid accidentally exposing unintended content types by explicitly defining content types e.g. [Jersey](https://jersey.github.io/) (Java) `@consumes("application/json"); @produces("application/json")`. This avoids [XXE-attack](https://owasp.org/www-community/vulnerabilities/XML_External_Entity_%28XXE%29_Processing) vectors for example.

### Send safe response content types

It is common for REST services to allow multiple response types (e.g. `application/xml` or `application/json`, and the client specifies the preferred order of response types by the Accept header in the request.

- **Do NOT** simply copy the `Accept` header to the `Content-type` header of the response.
- Reject the request (ideally with a `406 Not Acceptable` response) if the `Accept` header does not specifically contain one of the allowable types.

Services including script code (e.g. JavaScript) in their responses must be especially careful to defend against header injection attack.

- Ensure sending intended content type headers in your response matching your body content e.g. `application/json` and not `application/javascript`.

</div>

<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 管理エンドポイント

管理エンドポイントはインターネットへ公開しないことが推奨されます。公開が必要な場合でも、多要素認証などの強い認証を必須にします。管理エンドポイントは、通常の公開 API と異なる HTTP ポートまたはホスト、可能であれば異なる NIC と制限されたサブネットで公開します。ファイアウォールルールやアクセス制御リストによりアクセス元を制限します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Management endpoints

- Avoid exposing management endpoints via Internet.
- If management endpoints must be accessible via the Internet, make sure that users must use a strong authentication mechanism, e.g. multi-factor.
- Expose management endpoints via different HTTP ports or hosts preferably on a different NIC and restricted subnet.
- Restrict access to these endpoints by firewall rules  or use of access control lists.

</div>

<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## CORS

Cross-Origin Resource Sharing (CORS) は、必要な origin、メソッド、ヘッダーに限定します。ワイルドカード origin と credentials の組み合わせは許可しません。動的に origin を反射する実装は、許可リスト検証がない場合にクロスオリジンのデータ漏えいにつながります。プリフライト応答では必要最小限のメソッドとヘッダーを返し、CORS 設定を認可の代替にしてはいけません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Error handling

- Respond with generic error messages - avoid revealing details of the failure unnecessarily.
- Do not pass technical details (e.g. call stacks or other internal hints) to the client.

</div>

<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## セキュリティヘッダー

API 応答にも適切なセキュリティヘッダーを設定します。ブラウザで解釈される可能性がある応答では、クリックジャッキング、MIME sniffing、混在コンテンツ、過度なキャッシュを防ぎます。機密データを返す API では、キャッシュ制御を明確にし、クライアントや中間プロキシが機密応答を保持しないようにします。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Audit logs

- Write audit logs before and after security related events.
- Consider logging token validation errors in order to detect attacks.
- Take care of log injection attacks by sanitizing log data beforehand.

</div>

<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## エラー処理

エラー応答は、呼び出し元が問題を理解できる範囲で一貫した形式にし、スタックトレース、内部パス、SQL、設定値、トークン、シークレット、詳細な依存サービス情報を含めません。認証失敗、認可失敗、存在しないリソース、入力エラーは適切なステータスコードで区別しますが、アカウント列挙やリソース存在確認につながる情報は抑制します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Security Headers

There are a number of [security related headers](https://owasp.org/www-project-secure-headers/) that can be returned in the HTTP responses to instruct browsers to act in specific ways. However, some of these headers are intended to be used with HTML responses, and as such may provide little or no security benefits on an API that does not return HTML. Note that if the API is only consumed by non-browser clients (e.g. mobile apps, server-to-server calls, command-line tools), most of these headers will have no effect since they are directives for browsers.

The following headers should be included in all API responses that may be consumed by browser clients:

| Header | Rationale |
|--------|-----------|
| `Cache-Control: no-store` | Header used to direct caching done by browsers. Providing `no-store` indicates that any caches of any kind (private or shared) should not store the response that contains the header. A browser must make a new request everytime the API is called to fetch the latest response. This header with a `no-store` value prevents sensitive information from being cached or stored. |
| `Content-Security-Policy: frame-ancestors 'none'` | Header used to specify whether a response can be framed in a `<frame>`, `<iframe>`, `<embed>` or `<object>` element. For an API response, there is no requirement to be framed in any of those elements. Providing `frame-ancestors 'none'` prevents any domain from framing the response returned by the API call. This header protects against [drag-and-drop](https://www.w3.org/Security/wiki/Clickjacking_Threats#Drag_and_drop_attacks) style clickjacking attacks. |
| `Content-Type` | Header to specify the content type of a response. This must be specified as per the type of content returned by an API call. If not specified or if specified incorrectly, a browser might attempt to guess the content type of the response. This can return in MIME sniffing attacks. One common content type value is `application/json` if the API response is JSON. |
| `Strict-Transport-Security` | Header to instruct a browser that the domain should only be accessed using HTTPS, and that any future attempts to access it using HTTP should automatically be converted to HTTPS. This header ensures that API calls are made over HTTPS and protects against spoofed certificates. |
| `X-Content-Type-Options: nosniff` | Header to instruct a browser to always use the MIME type that is declared in the `Content-Type` header rather than trying to determine the MIME type based on the file's content. This header with a `nosniff` value prevents browsers from performing MIME sniffing, and inappropriately interpreting responses as HTML. |
| `X-Frame-Options: DENY` | Legacy header superseded by `Content-Security-Policy: frame-ancestors 'none'` (see above). Still recommended for compatibility with older browsers that do not support CSP Level 2. Providing `DENY` prevents any domain from framing the response. |

The headers below are only intended to provide additional security when responses are rendered as HTML. As such, if the API will **never** return HTML in responses, then these headers may not be necessary. However, if there is any uncertainty about the function of the headers, or the types of information that the API returns (or may return in future), then it is recommended to include them as part of a defence-in-depth approach.

| Header | Example | Rationale |
|--------|-----------|-----------|
| Content-Security-Policy | `Content-Security-Policy: default-src 'none'` | The majority of CSP functionality only affects pages rendered as HTML. |
| Permissions-Policy | `Permissions-Policy: accelerometer=(), ambient-light-sensor=(), autoplay=(), battery=(), camera=(), cross-origin-isolated=(), display-capture=(), document-domain=(), encrypted-media=(), execution-while-not-rendered=(), execution-while-out-of-viewport=(), fullscreen=(), geolocation=(), gyroscope=(), keyboard-map=(), magnetometer=(), microphone=(), midi=(), navigation-override=(), payment=(), picture-in-picture=(), publickey-credentials-get=(), screen-wake-lock=(), sync-xhr=(), usb=(), web-share=(), xr-spatial-tracking=()` | This header used to be named Feature-Policy. When browsers heed this header, it is used to control browser features via directives. The example disables features with an empty allowlist for a number of permitted [directive names](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Permissions-Policy#directives). When you apply this header, verify that the directives are up-to-date and fit your needs. Please have a look at this [article](https://developer.chrome.com/en/docs/privacy-sandbox/permissions-policy) for a detailed explanation on how to control browser features. |
| Referrer-Policy | `Referrer-Policy: no-referrer` | Non-HTML responses should not trigger additional requests. |

</div>

<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## HTTP リターンコード

REST API では、成功に常に `200`、エラーに常に `404` を使うのではなく、意味的に適切な HTTP ステータスコードを返します。認証情報が欠落または不正な場合は `401 Unauthorized`、認可されていない操作は `403 Forbidden`、存在しないリソースは `404 Not Found`、許可されていないメソッドは `405 Method Not Allowed`、受け入れられないレスポンス型は `406 Not Acceptable`、過大なリクエストは `413 Payload Too Large`、未対応の Content-Type は `415 Unsupported Media Type`、レート制限や DoS 検知では `429 Too Many Requests` を使います。`500 Internal Server Error` などのサーバーエラーでは、攻撃者に役立つ詳細なエラーやスタックトレースを返さないようにします。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## CORS

Cross-Origin Resource Sharing (CORS) is a W3C standard to flexibly specify what cross-domain requests are permitted. By delivering appropriate CORS Headers your REST API signals to the browser which domains, AKA origins, are allowed to make JavaScript calls to the REST service.

- Disable CORS headers if cross-domain calls are not supported/expected.
- Be as specific as possible and as general as necessary when setting the origins of cross-domain calls.

</div>

<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 監査ログ

API では認証、認可、重要操作、管理操作、トークン失敗、入力検証失敗、レート制限、異常なアクセスパターンを記録します。ログには相関 ID、呼び出し元、対象リソース、操作、結果、時刻を含めます。一方で、パスワード、トークン、API キー、個人情報などをそのまま記録しないようにします。ログは改ざん、削除、過度な閲覧から保護します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Sensitive information in HTTP requests

RESTful web services should be careful to prevent leaking credentials. Passwords, security tokens, and API keys should not appear in the URL, as this can be captured in web server logs, which makes them intrinsically valuable.

- In `POST`/`PUT` requests sensitive data should be transferred in the request body or request headers.
- In `GET` requests sensitive data should be transferred in an HTTP Header.

**OK:**

`https://example.com/resourceCollection/[ID]/action`

`https://twitter.com/vanderaj/lists`

**NOT OK:**

`https://example.com/controller/123/action?apiKey=a53f435643de32` because the apiKey is in the URL.

</div>

<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## HTTP リクエスト内の機密情報

RESTful Web サービスは、認証情報の漏えいを防ぐ必要があります。パスワード、セキュリティトークン、API キーを URL に含めると、Web サーバーログ、ブラウザ履歴、プロキシログなどに記録される可能性があります。`POST` や `PUT` では機密データをリクエスト本文またはヘッダーで送信し、`GET` では HTTP ヘッダーで送信します。URL クエリに API キーやトークンを含める設計は避けます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## HTTP Return Code

HTTP defines [status code](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes). When designing REST API, don't just use `200` for success or `404` for error. Always use the semantically appropriate status code for the response.

Here is a non-exhaustive selection of security related REST API **status codes**. Use it to ensure you return the correct code.

| Code | Message                | Description                                                                                                                                                                                                          |
|-------------|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 200         | OK                     |  Response to a successful REST API action. The HTTP method can be GET, POST, PUT, PATCH or DELETE.                                                                                                                  |
| 201         | Created                |  The request has been fulfilled and resource created. A URI for the created resource is returned in the Location header.                                                                                            |
| 202         | Accepted               | The request has been accepted for processing, but processing is not yet complete.                                                                                                                                     |
| 301         | Moved Permanently       | Permanent redirection.                                                                                                                                                                                                |
| 304         | Not Modified           | Caching related response that returned when the client has the same copy of the resource as the server.                                                                                                                  |
| 307         | Temporary Redirect     | Temporary redirection of resource.                                                                                                                                                                                   |
| 400         | Bad Request            | The request is malformed, such as message body format error.                                                                                                                                                          |
| 401         | Unauthorized           | Wrong or no authentication ID/password provided.                                                                                                                                                                      |
| 403         | Forbidden              |  It's used when the authentication succeeded but authenticated user doesn't have permission to the request resource.                                                                                                |
| 404         | Not Found              | When a non-existent resource is requested.                                                                                                                                                                            |
| 405         | Method Not Acceptable  |  The error for an unexpected HTTP method. For example, the REST API is expecting HTTP GET, but HTTP PUT is used.                                                                                                    |
| 406         | Unacceptable           | The client presented a content type in the Accept header which is not supported by the server API.                                                                                                                    |
| 413         | Payload too large      | Use it to signal that the request size exceeded the given limit e.g. regarding file uploads.                                                                                                                          |
| 415         | Unsupported Media Type | The requested content type is not supported by the REST service.                                                                                                                                                      |
| 429         | Too Many Requests      |  The error is used when there may be DOS attack detected or the request is rejected due to rate limiting.                                                                                                           |
| 500         | Internal Server Error  | An unexpected condition prevented the server from fulfilling the request. Be aware that the response should not reveal internal  information that helps an attacker, e.g. detailed error messages or  stack traces. |
| 501         | Not Implemented        | The REST service does not implement the requested operation yet.                                                                                                                                                      |
| 503         | Service Unavailable    |  The REST service is temporarily unable to process the request. Used to inform the client it should retry at a later time.                                                                                         |

Additional information about HTTP return code usage in REST API can be found [here](https://www.restapitutorial.com/httpstatuscodes.html) and [here](https://restfulapi.net/http-status-codes).

</div>


</div>

</section>
</div>

## Attribution

<div className="attributionFooter">

- Original: REST Security Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: English original retained for comparison. Japanese translation added. Bilingual display generated from official source and local Japanese notes.
- Retrieved: 2026-05-20

</div>
