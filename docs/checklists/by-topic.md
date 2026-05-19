# トピック順チェックリスト

## 概要

開発者が機能や実装トピックから確認しやすいように整理するチェックリストです。詳細な本文訳は [../translations/](../translations/) を、要約は [../summaries/](../summaries/) を参照します。

## チェックリスト

| トピック | 確認観点 | 関連 ASVS | 関連ドキュメント | 状態 |
| --- | --- | --- | --- | --- |
| 入力検証・インジェクション | 入力検証、XSS、SQL/LDAP/OSコマンド、XML、デシリアライゼーション | V1, V2, V5 | [../asvs/v1-encoding-and-sanitization.md](../asvs/v1-encoding-and-sanitization.md), [input-validation.md](./v1/input-validation.md), [xss-prevention.md](./v1/xss-prevention.md), [sql-injection-prevention.md](./v1/sql-injection-prevention.md) | 作成済み |
| フロントエンド | CSP、CSRF、HTML5、DOM XSS、サードパーティJavaScript | V3 | [../asvs/v3-web-frontend-security.md](../asvs/v3-web-frontend-security.md), [content-security-policy.md](./v3/content-security-policy.md), [csrf-prevention.md](./v1/csrf-prevention.md), [html5-security.md](./v3/html5-security.md) | 作成済み |
| API | REST、GraphQL、Web Service、マイクロサービス | V4 | [../asvs/v4-api-and-web-service.md](../asvs/v4-api-and-web-service.md), [rest-security.md](./v4/rest-security.md), [graphql.md](./v4/graphql.md), [web-service-security.md](./v2/web-service-security.md) | 作成済み |
| 認証 | パスワード、多要素認証、リカバリ、クレデンシャルスタッフィング | V6 | [../asvs/v6-authentication.md](../asvs/v6-authentication.md), [authentication.md](./v6/authentication.md), [multifactor-authentication.md](./v6/multifactor-authentication.md), [forgot-password.md](./v6/forgot-password.md) | 作成済み |
| セッション管理 | セッション ID、タイムアウト、終了、悪用対策 | V7 | [../asvs/v7-session-management.md](../asvs/v7-session-management.md), [session-management.md](./v7/session-management.md) | 作成済み |
| 認可 | 操作レベル認可、オブジェクトレベル認可、権限昇格対策 | V8 | [../asvs/v8-authorization.md](../asvs/v8-authorization.md), [authorization.md](./v8/authorization.md), [idor-prevention.md](./v8/idor-prevention.md), [multi-tenant-security.md](./v8/multi-tenant-security.md) | 作成済み |
| トークン・フェデレーション | JWT、SAML、OAuth/OIDC | V9, V10 | [../asvs/v9-self-contained-tokens.md](../asvs/v9-self-contained-tokens.md), [../asvs/v10-oauth-and-oidc.md](../asvs/v10-oauth-and-oidc.md), [json-web-token-for-java.md](./v9/json-web-token-for-java.md), [oauth2.md](./v10/oauth2.md), [saml-security.md](./v9/saml-security.md) | 作成済み |
| 暗号・通信 | 暗号化ストレージ、鍵管理、TLS、HSTS | V11, V12 | [../asvs/v11-cryptography.md](../asvs/v11-cryptography.md), [../asvs/v12-secure-communication.md](../asvs/v12-secure-communication.md), [cryptographic-storage.md](./v11/cryptographic-storage.md), [key-management.md](./v11/key-management.md), [transport-layer-security.md](./v3/transport-layer-security.md) | 作成済み |
| 構成・データ保護 | Docker、Django、シークレット、プライバシー、SSRF | V13, V14 | [../asvs/v13-configuration.md](../asvs/v13-configuration.md), [../asvs/v14-data-protection.md](../asvs/v14-data-protection.md), [docker-security.md](./v13/docker-security.md), [secrets-management.md](./v11/secrets-management.md), [user-privacy-protection.md](./v14/user-privacy-protection.md) | 作成済み |
| セキュア開発 | 脅威モデリング、サプライチェーン、依存関係、コードレビュー | V15 | [../asvs/v15-secure-coding-and-architecture.md](../asvs/v15-secure-coding-and-architecture.md), [threat-modeling.md](./v15/threat-modeling.md), [software-supply-chain-security.md](./v15/software-supply-chain-security.md), [secure-code-review.md](./v15/secure-code-review.md) | 作成済み |
| ログとエラー | セキュリティイベント、ログ保護、エラー応答 | V16 | [../asvs/v16-security-logging-and-error-handling.md](../asvs/v16-security-logging-and-error-handling.md), [logging.md](./v10/logging.md), [logging-vocabulary.md](./v16/logging-vocabulary.md), [error-handling.md](./v16/error-handling.md) | 作成済み |
| WebRTC | TURN、メディア、シグナリング、TLS | V17 | [../asvs/v17-webrtc.md](../asvs/v17-webrtc.md), [transport-layer-security.md](./v3/transport-layer-security.md) | 作成済み |
