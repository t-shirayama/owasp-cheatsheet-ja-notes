# OAuth 2.0プロトコルチートシート 要約

## Attribution

- Original: OAuth 2.0 Protocol Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/OAuth2_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese summary added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../../translations/v10/oauth2.md](../../translations/v10/oauth2.md)
- 開発チェックリスト: [../../checklists/v10/oauth2.md](../../checklists/v10/oauth2.md)

## 概要

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
