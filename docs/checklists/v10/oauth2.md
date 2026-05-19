# OAuth 2.0プロトコルチートシート 開発チェックリスト

## Attribution

- Original: OAuth 2.0 Protocol Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/OAuth2_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Development checklist added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../../translations/v10/oauth2.md](../../translations/v10/oauth2.md)
- 要約: [../../summaries/v10/oauth2.md](../../summaries/v10/oauth2.md)

## 開発チェックリスト

### V10.1 Generic OAuth and OIDC Security

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

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V10.1 Generic OAuth and OIDC Security | open redirector 防止、CSRF、issuer 識別、認証情報転送防止 |
| V10.2 OAuth Client | Authorization Code Grant with PKCE、Implicit Grant 廃止、認可コード保護 |
| V10.3 OAuth Resource Server | トークン検証、audience/resource/action 制限、PoP 証明検証 |
| V10.4 OAuth Authorization Server | PKCE 強制、権限制限、refresh token 保護、クライアント認証 |
| V10.5 OIDC Client | `nonce`、ID Token 検証、ID Token とアクセストークンの分離 |
| V10.6 OpenID Provider | Claim 保護、TLS、`http` リダイレクト URI 制限 |
