---
hide_table_of_contents: true
---

# OAuth 2.0 Protocol Cheat Sheet

<div className="docHero" data-category="api-and-web-service">
  <h1>OAuth 2.0 Protocol Cheat Sheet</h1>
  <p className="docSubtitle">OAuth 2.0 プロトコルチートシート</p>
  <div className="docMeta">
    <span className="docPill">最終更新: 2026-05-20</span>
    <span className="docPill">読了時間: 約 18 分</span>
    <span className="docPill">カテゴリ: API and Web Service</span>
  </div>
</div>

<div className="tabbedContent">
  <input className="tabInput" type="radio" name="oauth2-view" id="oauth2-translation" defaultChecked />
  <input className="tabInput" type="radio" name="oauth2-view" id="oauth2-summary" />
  <input className="tabInput" type="radio" name="oauth2-view" id="oauth2-checklist" />
  <input className="tabInput" type="radio" name="oauth2-view" id="oauth2-bilingual" />

  <div className="contentTabs">
    <label htmlFor="oauth2-translation">翻訳</label>
    <label htmlFor="oauth2-summary">要点</label>
    <label htmlFor="oauth2-checklist">チェックリスト</label>
    <label htmlFor="oauth2-bilingual">対比表示</label>
  </div>

<section id="oauth2-translation-panel" className="tabPanel translationPanel contentPanel">

このチートシートは、OAuth 2.0 の RFC から導かれる現在の推奨セキュリティプラクティスを説明します。OAuth は API 保護の標準になり、OpenID Connect によるフェデレーションログインの基盤にもなっています。OpenID Connect 1.0 は OAuth 2.0 プロトコルの上に構築された単純なアイデンティティ層です。クライアントは、認可サーバーが実施した認証に基づいてエンドユーザーの本人性を検証し、相互運用可能で REST 風の方法により基本的なプロファイル情報を取得できます。

OAuth 2.0 は、セキュリティ要件と実装要件に応じて複数のトークン種別を扱います。Bearer トークンは単純で広く採用されています。一方、Proof of Possession (PoP) トークンは、トークンとクライアントを暗号学的に結び付けることで高度な保護を提供します。適切なトークン種別は、アプリケーションのセキュリティ要件、脅威モデル、実装上の制約に基づいて選択します。

## 用語

- Client: リソース所有者の認可に基づき、保護されたリソースへのリクエストを行うアプリケーションです。「クライアント」という語は、サーバー、デスクトップ、その他のデバイスなど、特定の実装形態を意味しません。
- Authorization Server (AS): リソース所有者を認証し、同意を得た後、クライアントへアクセストークンを発行するサーバーです。
- Resource Owner (RO): 保護されたリソースへのアクセスを許可できる主体です。人である場合はエンドユーザーと呼ばれます。組織やシステムの場合もあります。
- Resource Server (RS): 保護されたリソースをホストし、アクセストークンを使うリクエストを受け入れて応答できるサーバーです。
- Access Token: ユーザー名とパスワード、アサーションなど複数の認可構成を、リソースサーバーが理解できる単一のトークンへ抽象化するものです。この抽象化により、短期間だけ有効なアクセストークンを発行でき、リソースサーバーが多数の認証方式を理解する必要も減ります。最も一般的なのは Bearer トークンで、API アクセスにはトークン値のみが必要です。Bearer トークンは保持者が誰でも利用できるため、漏えい時の影響を抑えるために単一の audience、つまり対象のリソースサーバーに制限する必要があります。
- Refresh Token: アクセストークンを取得するための認証情報です。認可サーバーからクライアントへ発行され、現在のアクセストークンが無効または期限切れになった場合や、同一またはより狭いスコープの追加アクセストークンを取得する場合に使われます。リフレッシュトークンは DPoP、mTLS などの送信者制約メカニズム、またはリフレッシュトークンローテーションで保護することが推奨されます。
- Proof of Possession (PoP) Token: DPoP や mTLS バインドアクセストークンなどの仕組みにより、クライアントへ暗号学的に結び付けられたアクセストークンまたはリフレッシュトークンです。トークンはクライアントが所有する秘密鍵に結び付けられ、クライアントはトークンを使う際にその秘密鍵の保有を証明する必要があります。これはトークン傍受が懸念される場面で追加保護になりますが、鍵管理と証明生成の実装要件も増えます。

## OAuth 2.0 の基本

1. クライアントと認可サーバーは、クエリパラメータから得た任意の URI へユーザーのブラウザを転送する URL、つまり open redirector を公開してはなりません。open redirector は、認可コードやアクセストークンの外部流出を可能にします。
2. クライアントは、認可サーバーが PKCE をサポートしていることを確認できる場合、PKCE が提供する CSRF 保護に依存できます。OpenID Connect フローでは `nonce` パラメータが CSRF 保護を提供します。それ以外の場合は、ユーザーエージェントに安全に結び付けられ、`state` パラメータで運ばれるワンタイムのユーザー CSRF トークンを使用します。
3. OAuth クライアントが複数の認可サーバーと連携できる場合、クライアントは issuer を表す `iss` パラメータ、または OpenID の ID Token 内の `iss` Claim など認可レスポンスの `iss` 値を対策として使うことが推奨されます。
4. 複数の認可サーバーと連携する OAuth クライアントで他の対策が使えない場合、クライアントは認可エンドポイントとトークンエンドポイントを識別するために別々のリダイレクト URI を使うこともできます。
5. 認可サーバーは、ユーザー認証情報を含む可能性があるリクエストを誤って転送またはリダイレクトしないようにします。

## PKCE

Authorization Code Grant を利用する OAuth 2.0 のパブリッククライアントは、認可コード傍受攻撃の影響を受けます。Proof Key for Code Exchange (PKCE) は、この認可コード傍受攻撃を緩和する技術です。

PKCE は当初ネイティブアプリの保護を目的としていましたが、その後 OAuth の一般的な機能として広く展開されました。PKCE は認可コードインジェクション攻撃を防ぐだけではありません。`code_verifier` を知らない攻撃者は、盗んだ認可コードを認可サーバーのトークンエンドポイントで引き換えられないため、パブリッククライアント向けに作成された認可コードも保護できます。

6. クライアントは PKCE フローを使い、認可レスポンスへの認可コードのインジェクション、つまりリプレイを防止します。代替または補助として、OpenID Connect の `nonce` パラメータと ID Token 内の対応する Claim を使うこともできます。PKCE challenge または OpenID Connect の `nonce` は、トランザクション固有であり、そのトランザクションが開始されたクライアントとユーザーエージェントへ安全に結び付けられている必要があります。PKCE が保護するのは認可コードです。アクセストークンとリフレッシュトークンの保護には送信者制約付きトークンを使います。
7. PKCE を使う場合、クライアントは認可リクエスト内で PKCE verifier を露出しない code challenge method を使うことが推奨されます。そうしないと、認可リクエストを読める攻撃者が PKCE の保護を破れる可能性があります。認可サーバーは PKCE をサポートする必要があります。
8. クライアントが認可リクエストで有効な `code_challenge` パラメータを送信した場合、認可サーバーはトークンエンドポイントで `code_verifier` の正しい利用を強制します。
9. 認可サーバーは、`code_verifier` パラメータを含むトークンリクエストを、認可リクエストに `code_challenge` パラメータが存在する場合にのみ受け入れることで、PKCE ダウングレード攻撃を緩和します。

## Implicit Grant は廃止済みで使用禁止

Implicit Grant (`response_type=token`) は RFC 9700 Section 2.1.2 により廃止され、OAuth 2.1 から削除されています。この方式はアクセストークンを URL フラグメントに露出させるため、ブラウザ履歴、Referer ヘッダー、プロキシやサーバーログから漏えいする可能性があります。また、送信者制約も適用できません。主要なアイデンティティプロバイダーでは、すでに無効化済みか、削除予定とされています。

10. クライアントは、SPA やネイティブアプリケーションを含むすべてのクライアント種別で、PKCE を伴う Authorization Code Grant (`response_type=code`) を使用する必要があります。既存の Implicit Grant 利用アプリケーションは移行が必須です。ハイブリッドの `code id_token` レスポンスタイプは、OpenID Connect の ID Token が認可エンドポイントで必要な場合に限って使用できます。アクセストークンは必ずトークンエンドポイントで取得し、フロントチャネルで取得してはなりません。

## トークンリプレイ防止

トークンセキュリティは OAuth 2.0 実装の重要な要素です。送信者制約付きトークンは、トークンとクライアントの間に結び付きを作ります。PoP トークンは、クライアントが所有する秘密鍵によって暗号学的な結び付きを行う送信者制約付きトークンの一種です。トークンを使う際にクライアントが秘密鍵の保有を証明する必要があるため、トークン利用レベルでのクライアント認証により追加の防御層を提供します。

### PoP メカニズムの比較

DPoP (Demonstration of Proof of Possession - RFC 9449):

- クライアントは公開鍵と秘密鍵のペアを生成します。認可サーバーは、例えば JWK thumbprint (`jkt`) を含む `cnf` (confirmation) Claim を使って、アクセストークンをクライアントの公開鍵に送信者制約できます。ただし、これは任意であり実装依存です。各 API リクエストでは、クライアントが秘密鍵で署名した JWT として PoP 証明を含めます。この JWT にはアクセストークンのハッシュが含まれます。リソースサーバーは、アクセストークンと DPoP 証明の両方を検証し、リクエストが正当なトークン保持者から発信されたことを確認します。
- 相互 TLS 認証は不要です。証明は DPoP HTTP ヘッダーで提供されます。ブラウザやモバイルアプリケーションを含むさまざまなクライアント種別に適していますが、リクエストごとに追加の暗号処理が必要です。

Mutual TLS Certificate-Bound Access Tokens (RFC 8705):

- クライアントは TLS ハンドシェイク中に TLS クライアント証明書を使って認証します。これは相互 TLS 認証、つまり mTLS です。認可サーバーは `cnf` Claim を通じてアクセストークンをクライアント証明書の thumbprint へ結び付けます。リソースサーバーは、TLS ハンドシェイク中に提示された証明書が、アクセストークンに結び付けられた証明書と一致することを検証します。
- トランスポート層で動作します。既存の TLS インフラストラクチャを活用できます。証明書管理には PKI または自己署名証明書を利用できます。認証は接続確立時に行われるため、リクエストごとの証明生成は不要です。

### PoP トークンを使う場面

PoP トークンは、より強いトークンセキュリティ特性が必要な場面で特に有用です。次のような場合は PoP トークンを検討します。

- 複数の audience、つまり複数のリソースサーバーで使う必要があるアクセストークン。Bearer トークンは単一 audience に制限する必要がありますが、PoP トークンは複数 audience でも比較的安全に扱えます。
- 金融、医療、個人情報などの機密データを扱う API。
- 支払い、重要操作など、暗号学的なクライアントバインディングによる保証が有効な高価値トランザクション。
- 有効期間が長く、追加保護メカニズムが必要なトークン。
- 複数のセキュリティドメインをまたぐ B2B 連携などの組織間アクセス。
- クライアント環境に追加のセキュリティ考慮が必要なモバイルアプリケーションやネイティブアプリケーション。
- トークンが複数のネットワーク境界を通過する分散アーキテクチャ。

トークン保護方式の選択では、アプリケーションのセキュリティ要件、既存インフラストラクチャ、クライアントの能力、運用リソースを考慮します。

11. トークンリプレイに対する高度な保護として、認可サーバーとリソースサーバーは、OAuth 2.0 の Mutual TLS (mTLS - RFC 8705) または Demonstration of Proof of Possession (DPoP - RFC 9449) など、アクセストークンを送信者制約するメカニズムを実装できます。これらのメカニズムは、秘密鍵の保有証明によりトークンを特定のクライアントへ暗号学的に結び付けます。
12. リフレッシュトークンには、DPoP または mTLS による送信者制約を適用するか、リフレッシュトークンローテーションを使用します。ローテーションでは新しいリフレッシュトークンを発行し、古いトークンを直ちに無効化してリプレイ試行を検出します。PoP 制約付きリフレッシュトークンとローテーションの併用は、多層防御として有効です。

## アクセストークンの権限制限

13. アクセストークンに関連付ける権限は、対象アプリケーションまたはユースケースに必要な最小限へ制限することが推奨されます。これにより、クライアントがリソース所有者に認可された範囲を超えることを防ぎ、ユーザーがセキュリティポリシーで認可された権限を超えることも防ぎます。権限制限は、アクセストークン漏えい時の影響も低減します。多層防御として、送信者制約付きトークンと組み合わせます。
14. アクセストークンは特定のリソースサーバーに制限します。望ましいのは単一のリソースサーバーへの制限です。認可サーバーはアクセストークンを特定のリソースサーバーへ関連付けることが推奨されます。各リソースサーバーは、すべてのリクエストについて、そのリクエストで送信されたアクセストークンが当該リソースサーバーで使われることを意図したものか検証する義務があります。意図されていない場合、リソースサーバーはそのリクエストへのサービス提供を拒否する必要があります。クライアントと認可サーバーは、アクセス先リソースサーバーの決定に `scope` と `resource` パラメータを利用できます。
15. アクセストークンは、リソースサーバー上の特定のリソースとアクションに制限します。認可サーバーはアクセストークンを対象リソースおよびアクションへ関連付けることが推奨されます。各リソースサーバーは、すべてのリクエストについて、そのアクセストークンが対象リソース上の対象アクションに使われることを意図したものか検証する義務があります。意図されていない場合、リソースサーバーはそのリクエストへのサービス提供を拒否する必要があります。クライアントと認可サーバーは、対象リソースやアクションの決定に `scope` と `authorization_details` パラメータを利用できます。

## Resource Owner Password Credentials Grant

16. Resource Owner Password Credentials Grant は使用しません。この Grant 種別は、リソース所有者の認証情報をクライアントへ安全でない形で露出させ、アプリケーションの攻撃対象領域を広げます。

## クライアント認証

17. 認可サーバーは、可能な場合はクライアント認証を使用します。クライアント認証には、mTLS や OpenID Connect の `private_key_jwt` など、非対称鍵、つまり公開鍵ベースの方式を使うことが推奨されます。非対称方式を使う場合、認可サーバーは機密性の高い対称鍵を保存する必要がないため、複数の攻撃に対してより堅牢になります。

## その他の推奨事項

18. 認可サーバーは、クライアントが自身の `client_id`、`sub` 値、または本物のリソース所有者と混同され得るその他の Claim に影響を与えることを許可しません。エンドツーエンド TLS の利用が推奨されます。
19. 認可レスポンスは、暗号化されていないネットワーク接続で送信しません。認可サーバーは、Loopback Interface Redirection を使うネイティブクライアントを除き、`http` スキームのリダイレクト URI を許可してはなりません。

</section>

<section id="oauth2-summary-panel" className="tabPanel summaryPanel contentPanel">

OAuth 2.0 は API 保護と OpenID Connect によるフェデレーションログインの基盤です。安全な実装では、認可コードフローと PKCE を中心にし、リダイレクト、CSRF、トークン replay、権限制限、クライアント認証、TLS を個別に検証します。Bearer トークンは単純ですが、漏えい時に保持者が利用できるため、audience やスコープで厳しく制限します。高リスクな API や長寿命トークンでは、DPoP や mTLS による送信者制約付きトークンを検討します。

## 要点

- open redirector を公開しない。認可コードやアクセストークンの外部流出につながるため、リダイレクト URI は登録済みの値へ厳密に制限する。
- CSRF 対策には PKCE、OpenID Connect の `nonce`、またはユーザーエージェントへ安全に結び付けたワンタイム `state` を使う。
- 複数の認可サーバーを扱うクライアントでは、`iss` により認可サーバーを識別し、mix-up 攻撃を避ける。
- Authorization Code Grant と PKCE を使用する。SPA やネイティブアプリも含め、Implicit Grant (`response_type=token`) は使用しない。
- PKCE では verifier を認可リクエストに露出しない challenge method を使い、認可サーバー側で `code_challenge` と `code_verifier` の対応を強制する。
- トークン replay が重大なリスクになる場合は、DPoP または mTLS による送信者制約付きアクセストークンを検討する。
- リフレッシュトークンは、送信者制約またはローテーションにより保護する。古いリフレッシュトークンは直ちに無効化して replay を検出する。
- アクセストークンは最小権限にし、audience、resource、action、scope、`authorization_details` により用途を制限する。
- Resource Owner Password Credentials Grant は使用しない。リソース所有者の認証情報がクライアントに露出し、攻撃対象領域が広がる。
- 認可サーバーは可能な限りクライアント認証を行い、mTLS や `private_key_jwt` など公開鍵ベースの方式を優先する。
- 認可レスポンスは暗号化されていない接続で送信しない。Loopback Interface Redirection を使うネイティブクライアントを除き、`http` のリダイレクト URI は許可しない。

## 実装時の注意点

- Bearer トークンと PoP トークンを同じ前提で扱わない。Bearer トークンは単一 audience に制限し、PoP トークンは鍵管理、証明生成、リソースサーバー側検証まで設計する。
- PKCE は認可コードを守る仕組みであり、アクセストークンやリフレッシュトークンの replay 防止には送信者制約やローテーションが必要です。
- ID Token とアクセストークンを混同しない。ID Token はクライアントがエンドユーザーの本人性を検証するためのものであり、API 認可の代替にしない。
- リソースサーバーは、認可サーバーを信頼するだけでなく、各リクエストで issuer、audience、有効期限、scope、resource、action を検証する。
- OAuth/OIDC の設定は実装者だけでなく運用者も変更できることが多いため、リダイレクト URI、クライアント認証方式、Grant 種別、トークン有効期間をレビュー対象に含める。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V10.1 Generic OAuth and OIDC Security | OAuth/OIDC 共通のリダイレクト、CSRF、issuer 識別、TLS |
| V10.2 OAuth Client | PKCE、Authorization Code Grant、Implicit Grant 廃止、`state`/`nonce` |
| V10.3 OAuth Resource Server | audience、resource、action、scope、PoP 証明の検証 |
| V10.4 OAuth Authorization Server | PKCE 強制、トークン発行制限、refresh token 保護、クライアント認証 |
| V10.5 OIDC Client | `nonce`、ID Token の issuer、ID Token とアクセストークンの分離 |
| V10.6 OpenID Provider | Claim 保護、`client_id`/`sub` 混同防止、TLS |

</section>

<section id="oauth2-checklist-panel" className="tabPanel checklistPanel contentPanel">

## V10.1 Generic OAuth and OIDC Security

- [ ] 確認する: クライアントと認可サーバーが、クエリパラメータで指定された任意 URL へ転送する open redirector を公開していない。
- [ ] 実装する: 認可フローの CSRF 対策として、PKCE、OpenID Connect の `nonce`、またはユーザーエージェントへ安全に結び付いたワンタイム `state` を使用する。
- [ ] 確認する: 複数の認可サーバーと連携するクライアントで、`iss` による issuer 識別、または認可サーバーごとのリダイレクト URI 分離を実装している。
- [ ] 禁止する: ユーザー認証情報を含む可能性があるリクエストを、認可サーバーが外部へ転送またはリダイレクトする設計。
- [ ] テストする: 認可エンドポイント、リダイレクトエンドポイント、エラー処理に対して、open redirect、mix-up、CSRF の回帰テストを追加する。

### V10.2 OAuth Client

- [ ] 実装する: すべてのクライアント種別で Authorization Code Grant と PKCE (`response_type=code`) を使用する。
- [ ] 禁止する: Implicit Grant (`response_type=token`) を新規実装または継続利用する。
- [ ] 移行する: 既存の Implicit Grant 利用アプリケーションを Authorization Code Grant with PKCE へ移行する。
- [ ] 確認する: PKCE の `code_challenge` がトランザクション固有で、クライアントおよびユーザーエージェントに安全に結び付いている。
- [ ] 確認する: PKCE verifier を認可リクエストに露出しない challenge method を使用している。
- [ ] 禁止する: アクセストークンをフロントチャネルで取得する設計。OpenID Connect のハイブリッド `code id_token` を使う場合も、アクセストークンはトークンエンドポイントから取得する。
- [ ] テストする: 盗まれた認可コード、別セッションの `code_verifier`、欠落した `state` または `nonce` でトークン取得が失敗する。

### V10.3 OAuth Resource Server

- [ ] 検証する: 各 API リクエストでアクセストークンの issuer、audience、有効期限、署名または introspection 結果を検証する。
- [ ] 検証する: アクセストークンが対象リソースサーバー向けであることを audience または `resource` で確認し、不一致時は拒否する。
- [ ] 検証する: アクセストークンが対象リソースと対象アクションに使えることを `scope` または `authorization_details` で確認し、不一致時は拒否する。
- [ ] 実装する: DPoP を使用する場合、アクセストークンと DPoP 証明を検証し、トークンハッシュ、署名、リクエストとの対応を確認する。
- [ ] 実装する: mTLS バインドアクセストークンを使用する場合、TLS ハンドシェイクで提示された証明書がトークンに結び付いた証明書と一致することを確認する。
- [ ] テストする: audience 不一致、scope 不足、期限切れ、改ざん、PoP 証明欠落、別クライアント証明書利用で API が拒否される。

### V10.4 OAuth Authorization Server

- [ ] 実装する: 認可サーバーで PKCE をサポートし、認可リクエストの `code_challenge` とトークンリクエストの `code_verifier` の対応を強制する。
- [ ] 禁止する: `code_verifier` を含むトークンリクエストを、元の認可リクエストに `code_challenge` がない場合に受け入れること。
- [ ] 実装する: アクセストークンの権限を、必要最小限の audience、resource、action、scope、`authorization_details` に制限する。
- [ ] 実装する: リフレッシュトークンに DPoP/mTLS による送信者制約、またはリフレッシュトークンローテーションを適用する。
- [ ] 実装する: リフレッシュトークンローテーション時に古いトークンを直ちに無効化し、再利用を replay として検出する。
- [ ] 禁止する: Resource Owner Password Credentials Grant を有効化する。
- [ ] 実装する: 可能な場合はクライアント認証を必須化し、mTLS または `private_key_jwt` など公開鍵ベースの方式を優先する。
- [ ] 禁止する: Loopback Interface Redirection を使うネイティブクライアント以外に、`http` スキームのリダイレクト URI を許可すること。
- [ ] テストする: PKCE ダウングレード、refresh token replay、過大 scope 要求、無効なリダイレクト URI、無効なクライアント認証が失敗する。

### V10.5 OIDC Client

- [ ] 実装する: OpenID Connect フローでは `nonce` を発行し、ID Token 内の対応する Claim を検証する。
- [ ] 検証する: ID Token の issuer が期待する認可サーバーと一致する。
- [ ] 禁止する: ID Token を API 認可用のアクセストークンとして使用すること。
- [ ] 確認する: `code id_token` を使う場合でも、アクセストークンをフロントチャネルで受け取らない。
- [ ] テストする: `nonce` 不一致、issuer 不一致、別クライアント向け ID Token、期限切れ ID Token が拒否される。

### V10.6 OpenID Provider

- [ ] 禁止する: クライアントが `client_id`、`sub`、または本物のリソース所有者と混同され得る Claim に影響を与えられる設計。
- [ ] 実装する: 認可レスポンスを暗号化されていないネットワーク接続で送信しない。
- [ ] 実装する: end-to-end TLS を利用し、認可レスポンス、トークンエンドポイント、ユーザー情報取得経路を保護する。
- [ ] テストする: Claim 注入、`sub` 混同、`client_id` 混同、TLS なしの認可レスポンスが拒否される。

</section>

<section id="oauth2-bilingual-panel" className="tabPanel bilingualPanel">

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

This cheatsheet describes the best current security practices for OAuth 2.0 as derived from its RFC. OAuth became the standard for API protection and the basis for federated login using OpenID Connect. OpenID Connect 1.0 is a simple identity layer on top of the OAuth 2.0 protocol. It enables clients to verify the identity of the end user based on the authentication performed by an authorization server, as well as to obtain basic profile information about the end user in an interoperable and REST-like manner.

**Note:** OAuth 2.0 supports different token types to address various security and implementation requirements. **Bearer tokens** (RFC 6750) provide simplicity and broad adoption. **Proof of Possession (PoP) tokens** offer advanced security through cryptographic binding between tokens and clients. The appropriate token type depends on your application's security requirements, threat model, and implementation constraints.

</div>

<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

このチートシートは、OAuth 2.0 の RFC から導かれる現在の推奨セキュリティプラクティスを説明します。OAuth は API 保護の標準になり、OpenID Connect によるフェデレーションログインの基盤にもなっています。OpenID Connect 1.0 は OAuth 2.0 プロトコルの上に構築された単純なアイデンティティ層です。クライアントは、認可サーバーが実施した認証に基づいてエンドユーザーの本人性を検証し、相互運用可能で REST 風の方法により基本的なプロファイル情報を取得できます。

OAuth 2.0 は、セキュリティ要件と実装要件に応じて複数のトークン種別を扱います。Bearer トークンは単純で広く採用されています。一方、Proof of Possession (PoP) トークンは、トークンとクライアントを暗号学的に結び付けることで高度な保護を提供します。適切なトークン種別は、アプリケーションのセキュリティ要件、脅威モデル、実装上の制約に基づいて選択します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Terminology

- **Client**: Generally refers to an application making protected resource requests on behalf of the resource owner and with its authorization. The term "client" does not imply any particular implementation characteristics (e.g., whether the application executes on a server, a desktop, or other devices).
- **Authorization Server (AS)**: Refers to the server issuing access tokens to the client after successfully authenticating the resource owner and obtaining consent from the resource owner.
- **Resource Owner (RO)**: Refers to an entity capable of granting access to a protected resource. When the resource owner is a person, it is referred to as an end user. It can also be an organization or system.
- **Resource Server (RS)**: Refers to the server hosting the protected resources, capable of accepting and responding to protected resource requests using access tokens.

- **Access Tokens**: Provide an abstraction, replacing different authorization constructs (e.g., username and password, assertion) by a single token understood by the resource server. This abstraction enables issuing access tokens valid for a short period, as well as removing the resource server's need to understand a wide range of authentication schemes. The most common type is the **bearer token** (RFC 6750), which is straightforward to implement and integrate, requiring only the token value for API access. Since anyone possessing a bearer token can use it, bearer tokens must be restricted to a single audience (Resource Server) to limit the impact of token leakage.
- **Refresh Tokens** are credentials used to obtain access tokens. These are issued to the client by the authorization server and are used to obtain a new access token when the current access token becomes invalid or expires or to obtain additional access tokens with identical or narrower scope (access tokens may have a shorter lifetime and fewer permissions than authorized by the resource owner). Refresh tokens should be protected using sender-constraining mechanisms (DPoP or mTLS) or refresh token rotation.

- **Proof of Possession (PoP) tokens**: Access tokens or refresh tokens that are cryptographically bound to clients through mechanisms like DPoP (RFC 9449) or mTLS-bound access tokens (RFC 8705). These tokens are bound to a private key owned by the client and the client must demonstrate possession of this private key in order to use the token. This approach provides additional protection in scenarios where token interception is a concern, with additional implementation requirements for key management and proof generation.

</div>

<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 用語

- Client: リソース所有者の認可に基づき、保護されたリソースへのリクエストを行うアプリケーションです。「クライアント」という語は、サーバー、デスクトップ、その他のデバイスなど、特定の実装形態を意味しません。
- Authorization Server (AS): リソース所有者を認証し、同意を得た後、クライアントへアクセストークンを発行するサーバーです。
- Resource Owner (RO): 保護されたリソースへのアクセスを許可できる主体です。人である場合はエンドユーザーと呼ばれます。組織やシステムの場合もあります。
- Resource Server (RS): 保護されたリソースをホストし、アクセストークンを使うリクエストを受け入れて応答できるサーバーです。
- Access Token: ユーザー名とパスワード、アサーションなど複数の認可構成を、リソースサーバーが理解できる単一のトークンへ抽象化するものです。この抽象化により、短期間だけ有効なアクセストークンを発行でき、リソースサーバーが多数の認証方式を理解する必要も減ります。最も一般的なのは Bearer トークンで、API アクセスにはトークン値のみが必要です。Bearer トークンは保持者が誰でも利用できるため、漏えい時の影響を抑えるために単一の audience、つまり対象のリソースサーバーに制限する必要があります。
- Refresh Token: アクセストークンを取得するための認証情報です。認可サーバーからクライアントへ発行され、現在のアクセストークンが無効または期限切れになった場合や、同一またはより狭いスコープの追加アクセストークンを取得する場合に使われます。リフレッシュトークンは DPoP、mTLS などの送信者制約メカニズム、またはリフレッシュトークンローテーションで保護することが推奨されます。
- Proof of Possession (PoP) Token: DPoP や mTLS バインドアクセストークンなどの仕組みにより、クライアントへ暗号学的に結び付けられたアクセストークンまたはリフレッシュトークンです。トークンはクライアントが所有する秘密鍵に結び付けられ、クライアントはトークンを使う際にその秘密鍵の保有を証明する必要があります。これはトークン傍受が懸念される場面で追加保護になりますが、鍵管理と証明生成の実装要件も増えます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## OAuth 2.0 Essential Basics

1. Clients and Authorization Server must not expose URLs that forward the user's browser to arbitrary URIs obtained from a query parameter ("open redirectors") which can enable exfiltration of authorization codes and access tokens.
2. Clients have ensured that the Authorization Server supports PKCE may rely on the CSRF protection provided by PKCE. In OpenID Connect flows, the "nonce" parameter provides CSRF protection. Otherwise, one-time user CSRF tokens carried in the "state" parameter that are securely bound to the user agent must be used for CSRF protection.
3. When an OAuth Client can interact with more than one Authorization Server, Clients should use the issuer "iss" parameter as a countermeasure, or based on an "iss" value in the authorization response (such as the "iss" Claim in the ID Token in OpenID)
4. When the other countermeasure options for OAuth clients interacting with more than one Authorization Servers are absent, Clients may instead use distinct redirect URIs to identify authorization endpoints and token endpoints.
5. An Authorization Server avoids forwarding or redirecting a request potentially containing user credentials accidentally.

</div>

<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## OAuth 2.0 の基本

1. クライアントと認可サーバーは、クエリパラメータから得た任意の URI へユーザーのブラウザを転送する URL、つまり open redirector を公開してはなりません。open redirector は、認可コードやアクセストークンの外部流出を可能にします。
2. クライアントは、認可サーバーが PKCE をサポートしていることを確認できる場合、PKCE が提供する CSRF 保護に依存できます。OpenID Connect フローでは `nonce` パラメータが CSRF 保護を提供します。それ以外の場合は、ユーザーエージェントに安全に結び付けられ、`state` パラメータで運ばれるワンタイムのユーザー CSRF トークンを使用します。
3. OAuth クライアントが複数の認可サーバーと連携できる場合、クライアントは issuer を表す `iss` パラメータ、または OpenID の ID Token 内の `iss` Claim など認可レスポンスの `iss` 値を対策として使うことが推奨されます。
4. 複数の認可サーバーと連携する OAuth クライアントで他の対策が使えない場合、クライアントは認可エンドポイントとトークンエンドポイントを識別するために別々のリダイレクト URI を使うこともできます。
5. 認可サーバーは、ユーザー認証情報を含む可能性があるリクエストを誤って転送またはリダイレクトしないようにします。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## PKCE - Proof Key for Code Exchange Mechanism

OAuth 2.0 public clients utilizing the Authorization Code Grant are susceptible to the authorization code interception attack. Proof Key for Code Exchange (PKCE, pronounced "pixy") is the technique used to mitigate against the threat of authorization code interception attack.

Originally, PKCE is intended to be used solely focused on securing native apps, but then it became a deployed OAuth feature. It does not only protect against authorization code injection attacks but also protects authorization codes created for public clients as PKCE ensures that the attacker cannot redeem a stolen authorization code at the token endpoint of the authorization server without knowledge of the code_verifier.

6. Clients are preventing injection (replay) of authorization codes into the authorization response by using PKCE flow. Additionally, clients may use the OpenID Connect "nonce" parameter and the respective Claim in the ID Token instead. The PKCE challenge or OpenID Connect "nonce" must be transaction-specific and securely bound to the client and the user agent in which the transaction was started. **Note:** PKCE protects authorization codes; use sender-constrained tokens to protect access and refresh tokens.
7. When using PKCE, Clients should use PKCE code challenge methods that do not expose the PKCE verifier in the authorization request. Otherwise, attackers who can read the authorization request can break the security provided by the PKCE. Authorization servers must support PKCE.
8. If a Client sends a valid PKCE "code_challenge" parameter in the authorization request, the authorization server enforces the correct usage of "code_verifier" at the token endpoint.
9. Authorization Servers are mitigating PKCE Downgrade Attacks by ensuring a token request containing a "code_verifier" parameter is accepted only if a "code_challenge" parameter is present in the authorization request.

</div>

<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## PKCE

Authorization Code Grant を利用する OAuth 2.0 のパブリッククライアントは、認可コード傍受攻撃の影響を受けます。Proof Key for Code Exchange (PKCE) は、この認可コード傍受攻撃を緩和する技術です。

PKCE は当初ネイティブアプリの保護を目的としていましたが、その後 OAuth の一般的な機能として広く展開されました。PKCE は認可コードインジェクション攻撃を防ぐだけではありません。`code_verifier` を知らない攻撃者は、盗んだ認可コードを認可サーバーのトークンエンドポイントで引き換えられないため、パブリッククライアント向けに作成された認可コードも保護できます。

6. クライアントは PKCE フローを使い、認可レスポンスへの認可コードのインジェクション、つまりリプレイを防止します。代替または補助として、OpenID Connect の `nonce` パラメータと ID Token 内の対応する Claim を使うこともできます。PKCE challenge または OpenID Connect の `nonce` は、トランザクション固有であり、そのトランザクションが開始されたクライアントとユーザーエージェントへ安全に結び付けられている必要があります。PKCE が保護するのは認可コードです。アクセストークンとリフレッシュトークンの保護には送信者制約付きトークンを使います。
7. PKCE を使う場合、クライアントは認可リクエスト内で PKCE verifier を露出しない code challenge method を使うことが推奨されます。そうしないと、認可リクエストを読める攻撃者が PKCE の保護を破れる可能性があります。認可サーバーは PKCE をサポートする必要があります。
8. クライアントが認可リクエストで有効な `code_challenge` パラメータを送信した場合、認可サーバーはトークンエンドポイントで `code_verifier` の正しい利用を強制します。
9. 認可サーバーは、`code_verifier` パラメータを含むトークンリクエストを、認可リクエストに `code_challenge` パラメータが存在する場合にのみ受け入れることで、PKCE ダウングレード攻撃を緩和します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Implicit Grant (DEPRECATED — DO NOT USE)

The Implicit Grant (`response_type=token`) is **deprecated** by [RFC 9700 §2.1.2](https://datatracker.ietf.org/doc/html/rfc9700#section-2.1.2) and removed from OAuth 2.1. It exposes access tokens in the URL fragment, which leaks via browser history, referrer headers, and proxy/server logs, and cannot be sender-constrained. Major identity providers have either disabled it or marked it for removal.

10. Clients **must** use the Authorization Code Grant with PKCE (`response_type=code`) for all client types, including SPAs and native applications. Existing applications using the Implicit Grant must migrate. The hybrid `code id_token` response type may be used only when an OpenID Connect ID Token is required at the authorization endpoint; access tokens must still be obtained via the token endpoint and never via the front channel.

</div>

<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## Implicit Grant は廃止済みで使用禁止

Implicit Grant (`response_type=token`) は RFC 9700 Section 2.1.2 により廃止され、OAuth 2.1 から削除されています。この方式はアクセストークンを URL フラグメントに露出させるため、ブラウザ履歴、Referer ヘッダー、プロキシやサーバーログから漏えいする可能性があります。また、送信者制約も適用できません。主要なアイデンティティプロバイダーでは、すでに無効化済みか、削除予定とされています。

10. クライアントは、SPA やネイティブアプリケーションを含むすべてのクライアント種別で、PKCE を伴う Authorization Code Grant (`response_type=code`) を使用する必要があります。既存の Implicit Grant 利用アプリケーションは移行が必須です。ハイブリッドの `code id_token` レスポンスタイプは、OpenID Connect の ID Token が認可エンドポイントで必要な場合に限って使用できます。アクセストークンは必ずトークンエンドポイントで取得し、フロントチャネルで取得してはなりません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Token Replay Prevention

Token security is a critical aspect of OAuth 2.0 implementations. Sender-constrained tokens establish a binding between the token and the client. Proof of Possession (PoP) tokens are a specific type of sender-constrained token that use cryptographic binding through a private key owned by the client. This binding requires the client to demonstrate possession of the private key when using the token, adding a layer of security through client authentication at the token usage level.

### PoP Mechanisms Comparison

**DPoP (Demonstration of Proof of Possession - RFC 9449):**

- The client generates a public-private key pair. The Authorization Server can sender-constrain the access token to the client's public key, for example by including a `cnf` (confirmation) claim with a JWK thumbprint (`jkt`), although this is optional and implementation-dependent. For each API request, the client includes a proof-of-possession of its private key taking the form of a JWT signed with this private key that includes a hash of the access token. The Resource Server validates both the access token and the DPoP proof (including the token hash) to ensure the request originates from the legitimate token holder.
- It does not require mutual TLS authentication; proof is provided via the DPoP HTTP headers; suitable for various client types including browsers and mobile applications; requires additional cryptographic operations per request.

**Mutual TLS Certificate-Bound Access Tokens (RFC 8705):**

- The client authenticates using a TLS client certificate during the TLS handshake (mutual TLS authentication, mTLS). The Authorization Server binds the access token to the client certificate's thumbprint via the `cnf` claim. The Resource Server validates that the certificate presented during the TLS handshake matches the certificate bound to the access token.
- It operates at the transport layer; leverages existing TLS infrastructure; can use PKI or self-signed certificates for certificate management; authentication occurs during connection establishment; no per-request proof generation needed.

### When to Use PoP Tokens

Proof of Possession tokens are particularly valuable in scenarios requiring enhanced token security properties. Consider PoP tokens for:

- Access tokens that need to be used for more than one audience (Resource Server), as PoP tokens can be safely used across multiple audiences unlike bearer tokens which must be restricted to a single audience
- APIs handling sensitive data (financial, healthcare, personal information, etc.) where additional security layers are beneficial
- High-value transactions (payments, critical operations, etc.) where cryptographic client binding adds assurance
- Long-lived tokens where extended validity periods warrant additional protection mechanisms
- Cross-organizational access (B2B integrations) involving multiple security domains
- Mobile and native applications where the client environment may present additional security considerations
- Distributed architectures where tokens traverse multiple network boundaries

The selection of token security approach should consider the application's security requirements, existing infrastructure, client capabilities, and operational resources.

11. For advanced protection against token replay scenarios, Authorization and Resource Servers may implement mechanisms for sender-constraining access tokens, such as Mutual TLS for OAuth 2.0 (mTLS - RFC 8705) or Demonstration of Proof of Possession (DPoP - RFC 9449). These mechanisms cryptographically bind tokens to specific clients through proof-of-possession of the private key.
12. Refresh tokens are sender-constrained (using DPoP or mTLS) or use refresh token rotation (issuing new refresh tokens and invalidating old ones immediately to detect replay attempts). **Note:** Combining PoP-constrained refresh tokens with rotation provides defense-in-depth.

</div>

<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## トークンリプレイ防止

トークンセキュリティは OAuth 2.0 実装の重要な要素です。送信者制約付きトークンは、トークンとクライアントの間に結び付きを作ります。PoP トークンは、クライアントが所有する秘密鍵によって暗号学的な結び付きを行う送信者制約付きトークンの一種です。トークンを使う際にクライアントが秘密鍵の保有を証明する必要があるため、トークン利用レベルでのクライアント認証により追加の防御層を提供します。

### PoP メカニズムの比較

DPoP (Demonstration of Proof of Possession - RFC 9449):

- クライアントは公開鍵と秘密鍵のペアを生成します。認可サーバーは、例えば JWK thumbprint (`jkt`) を含む `cnf` (confirmation) Claim を使って、アクセストークンをクライアントの公開鍵に送信者制約できます。ただし、これは任意であり実装依存です。各 API リクエストでは、クライアントが秘密鍵で署名した JWT として PoP 証明を含めます。この JWT にはアクセストークンのハッシュが含まれます。リソースサーバーは、アクセストークンと DPoP 証明の両方を検証し、リクエストが正当なトークン保持者から発信されたことを確認します。
- 相互 TLS 認証は不要です。証明は DPoP HTTP ヘッダーで提供されます。ブラウザやモバイルアプリケーションを含むさまざまなクライアント種別に適していますが、リクエストごとに追加の暗号処理が必要です。

Mutual TLS Certificate-Bound Access Tokens (RFC 8705):

- クライアントは TLS ハンドシェイク中に TLS クライアント証明書を使って認証します。これは相互 TLS 認証、つまり mTLS です。認可サーバーは `cnf` Claim を通じてアクセストークンをクライアント証明書の thumbprint へ結び付けます。リソースサーバーは、TLS ハンドシェイク中に提示された証明書が、アクセストークンに結び付けられた証明書と一致することを検証します。
- トランスポート層で動作します。既存の TLS インフラストラクチャを活用できます。証明書管理には PKI または自己署名証明書を利用できます。認証は接続確立時に行われるため、リクエストごとの証明生成は不要です。

### PoP トークンを使う場面

PoP トークンは、より強いトークンセキュリティ特性が必要な場面で特に有用です。次のような場合は PoP トークンを検討します。

- 複数の audience、つまり複数のリソースサーバーで使う必要があるアクセストークン。Bearer トークンは単一 audience に制限する必要がありますが、PoP トークンは複数 audience でも比較的安全に扱えます。
- 金融、医療、個人情報などの機密データを扱う API。
- 支払い、重要操作など、暗号学的なクライアントバインディングによる保証が有効な高価値トランザクション。
- 有効期間が長く、追加保護メカニズムが必要なトークン。
- 複数のセキュリティドメインをまたぐ B2B 連携などの組織間アクセス。
- クライアント環境に追加のセキュリティ考慮が必要なモバイルアプリケーションやネイティブアプリケーション。
- トークンが複数のネットワーク境界を通過する分散アーキテクチャ。

トークン保護方式の選択では、アプリケーションのセキュリティ要件、既存インフラストラクチャ、クライアントの能力、運用リソースを考慮します。

11. トークンリプレイに対する高度な保護として、認可サーバーとリソースサーバーは、OAuth 2.0 の Mutual TLS (mTLS - RFC 8705) または Demonstration of Proof of Possession (DPoP - RFC 9449) など、アクセストークンを送信者制約するメカニズムを実装できます。これらのメカニズムは、秘密鍵の保有証明によりトークンを特定のクライアントへ暗号学的に結び付けます。
12. リフレッシュトークンには、DPoP または mTLS による送信者制約を適用するか、リフレッシュトークンローテーションを使用します。ローテーションでは新しいリフレッシュトークンを発行し、古いトークンを直ちに無効化してリプレイ試行を検出します。PoP 制約付きリフレッシュトークンとローテーションの併用は、多層防御として有効です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Access Token Privilege Restriction

13. The privileges associated with an access token should be restricted to the minimum required for the particular application or use case. This prevents clients from exceeding the privileges authorized by the Resource Owner. It also prevents users from exceeding their privileges authorized by the respective security policy. Privilege restrictions also help to reduce the impact of access token leakage. **Combine with sender-constrained tokens for defense-in-depth.**
14. Access tokens are restricted to certain Resource Servers (audience restriction), preferably to a single Resource Server. The Authorization Server should associate the access token with certain Resource Servers and every Resource Server is obliged to verify, for every request, whether the access token sent with that request was meant to be used for that particular Resource Server. If not, the Resource Server must refuse to serve the respective request. Clients and Authorization Servers may utilize the parameters "scope" and "resource", respectively to determine the Resource Server they want to access.
15. Access tokens are restricted to certain resources and actions on Resource Servers or resources. The Authorization Server should associate the access token with the respective resource and actions and every Resource Server is obliged to verify, for every request, whether the access token sent with that request was meant to be used for that particular action on the particular resource. If not, the Resource Server must refuse to serve the respective request. Clients and Authorization Servers may utilize the parameters "scope" and "authorization_details" to determine those resources and/or actions.

</div>

<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## アクセストークンの権限制限

13. アクセストークンに関連付ける権限は、対象アプリケーションまたはユースケースに必要な最小限へ制限することが推奨されます。これにより、クライアントがリソース所有者に認可された範囲を超えることを防ぎ、ユーザーがセキュリティポリシーで認可された権限を超えることも防ぎます。権限制限は、アクセストークン漏えい時の影響も低減します。多層防御として、送信者制約付きトークンと組み合わせます。
14. アクセストークンは特定のリソースサーバーに制限します。望ましいのは単一のリソースサーバーへの制限です。認可サーバーはアクセストークンを特定のリソースサーバーへ関連付けることが推奨されます。各リソースサーバーは、すべてのリクエストについて、そのリクエストで送信されたアクセストークンが当該リソースサーバーで使われることを意図したものか検証する義務があります。意図されていない場合、リソースサーバーはそのリクエストへのサービス提供を拒否する必要があります。クライアントと認可サーバーは、アクセス先リソースサーバーの決定に `scope` と `resource` パラメータを利用できます。
15. アクセストークンは、リソースサーバー上の特定のリソースとアクションに制限します。認可サーバーはアクセストークンを対象リソースおよびアクションへ関連付けることが推奨されます。各リソースサーバーは、すべてのリクエストについて、そのアクセストークンが対象リソース上の対象アクションに使われることを意図したものか検証する義務があります。意図されていない場合、リソースサーバーはそのリクエストへのサービス提供を拒否する必要があります。クライアントと認可サーバーは、対象リソースやアクションの決定に `scope` と `authorization_details` パラメータを利用できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Resource Owner Password Credentials Grant

16. The Resource Owner password credentials grant is not used. This grant type insecurely exposes the credentials of the Resource Owner to the client, increasing the attack surface of the application.

</div>

<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## Resource Owner Password Credentials Grant

16. Resource Owner Password Credentials Grant は使用しません。この Grant 種別は、リソース所有者の認証情報をクライアントへ安全でない形で露出させ、アプリケーションの攻撃対象領域を広げます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Client Authentication

17. Authorization Servers are using client authentication if possible. It is recommended to use asymmetric (public-key based) methods for client authentication such as mTLS or "private_key_jwt" (OpenID Connect). When asymmetric methods for client authentication are used, Authorization Servers do not need to store sensitive symmetric keys, making these methods more robust against several attacks.

</div>

<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## クライアント認証

17. 認可サーバーは、可能な場合はクライアント認証を使用します。クライアント認証には、mTLS や OpenID Connect の `private_key_jwt` など、非対称鍵、つまり公開鍵ベースの方式を使うことが推奨されます。非対称方式を使う場合、認可サーバーは機密性の高い対称鍵を保存する必要がないため、複数の攻撃に対してより堅牢になります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Other Recommendations

18. Authorization Servers do not allow clients to influence their "client_id" or "sub" value or any other Claim that can be confused with a genuine Resource Owner. It is recommended to use end-to-end TLS.
19. Authorization responses are not transmitted over unencrypted network connections. Authorization Servers must not allow redirect URIs that use the "http" scheme except for native clients that use Loopback Interface Redirection.

References:

- [RFC 6749: OAuth 2.0 Authorization Framework](https://www.rfc-editor.org/info/rfc6749)
- [RFC 6750: OAuth 2.0 Bearer Token Usage](https://www.rfc-editor.org/info/rfc6750)
- [RFC 8705: OAuth 2.0 Mutual-TLS Client Authentication and Certificate-Bound Access Tokens](https://www.rfc-editor.org/info/rfc8705)
- [RFC 9207: OAuth 2.0 Security Best Current Practice](https://www.rfc-editor.org/info/rfc9207)
- [RFC 9449: OAuth 2.0 Demonstrating Proof of Possession (DPoP)](https://www.rfc-editor.org/info/rfc9449)
- [Mix-Up Attacks (RFC 9207, Section 4.4)](https://www.rfc-editor.org/rfc/rfc9207.html#section-4.4)
- [Countermeasures for Mix-Up Attacks (RFC 9207, Section 4.4.2)](https://www.rfc-editor.org/rfc/rfc9207.html#section-4.4.2)

</div>

<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## その他の推奨事項

18. 認可サーバーは、クライアントが自身の `client_id`、`sub` 値、または本物のリソース所有者と混同され得るその他の Claim に影響を与えることを許可しません。エンドツーエンド TLS の利用が推奨されます。
19. 認可レスポンスは、暗号化されていないネットワーク接続で送信しません。認可サーバーは、Loopback Interface Redirection を使うネイティブクライアントを除き、`http` スキームのリダイレクト URI を許可してはなりません。

</div>
</div>

</section>
</div>

## Attribution

<div className="attributionFooter">

- Original: OAuth 2.0 Protocol Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/OAuth2_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: English original retained for comparison. Japanese translation added. Bilingual display generated from official source and local Japanese notes.
- Retrieved: 2026-05-20

</div>
