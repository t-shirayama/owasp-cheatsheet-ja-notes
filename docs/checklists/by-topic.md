# トピック順チェックリスト

## 概要

開発者が機能や実装トピックから確認しやすいように整理するチェックリストです。詳細な本文訳は [../translations/](../translations/) を、要約は [../summaries/](../summaries/) を参照します。

## チェックリスト

| トピック | 確認観点 | 関連 ASVS | 関連ドキュメント | 状態 |
| --- | --- | --- | --- | --- |
| 入力検証・インジェクション | 入力検証、XSS、SQL/LDAP/OSコマンド、XML、デシリアライゼーション | V1, V2, V5 | [../asvs/v1-encoding-and-sanitization.md](../asvs/v1-encoding-and-sanitization.md), [input-validation.md](input-validation.md), [xss-prevention.md](xss-prevention.md), [sql-injection-prevention.md](sql-injection-prevention.md) | 作成済み |
| フロントエンド | CSP、CSRF、HTML5、DOM XSS、サードパーティJavaScript | V3 | [../asvs/v3-web-frontend-security.md](../asvs/v3-web-frontend-security.md), [content-security-policy.md](content-security-policy.md), [csrf-prevention.md](csrf-prevention.md), [html5-security.md](html5-security.md) | 作成済み |
| API | REST、GraphQL、Web Service、マイクロサービス | V4 | [../asvs/v4-api-and-web-service.md](../asvs/v4-api-and-web-service.md), [rest-security.md](rest-security.md), [graphql.md](graphql.md), [web-service-security.md](web-service-security.md) | 作成済み |
| 認証 | パスワード、多要素認証、リカバリ、クレデンシャルスタッフィング | V6 | [../asvs/v6-authentication.md](../asvs/v6-authentication.md), [authentication.md](authentication.md), [multifactor-authentication.md](multifactor-authentication.md), [forgot-password.md](forgot-password.md) | 作成済み |
| セッション管理 | セッション ID、タイムアウト、終了、悪用対策 | V7 | [../asvs/v7-session-management.md](../asvs/v7-session-management.md), [session-management.md](session-management.md) | 作成済み |
| 認可 | 操作レベル認可、オブジェクトレベル認可、権限昇格対策 | V8 | [../asvs/v8-authorization.md](../asvs/v8-authorization.md), [authorization.md](authorization.md), [idor-prevention.md](idor-prevention.md), [multi-tenant-security.md](multi-tenant-security.md) | 作成済み |
| トークン・フェデレーション | JWT、SAML、OAuth/OIDC | V9, V10 | [../asvs/v9-self-contained-tokens.md](../asvs/v9-self-contained-tokens.md), [../asvs/v10-oauth-and-oidc.md](../asvs/v10-oauth-and-oidc.md), [json-web-token-for-java.md](json-web-token-for-java.md), [oauth2.md](oauth2.md), [saml-security.md](saml-security.md) | 作成済み |
| 暗号・通信 | 暗号化ストレージ、鍵管理、TLS、HSTS | V11, V12 | [../asvs/v11-cryptography.md](../asvs/v11-cryptography.md), [../asvs/v12-secure-communication.md](../asvs/v12-secure-communication.md), [cryptographic-storage.md](cryptographic-storage.md), [key-management.md](key-management.md), [transport-layer-security.md](transport-layer-security.md) | 作成済み |
| 構成・データ保護 | Docker、Django、シークレット、プライバシー、SSRF | V13, V14 | [../asvs/v13-configuration.md](../asvs/v13-configuration.md), [../asvs/v14-data-protection.md](../asvs/v14-data-protection.md), [docker-security.md](docker-security.md), [secrets-management.md](secrets-management.md), [user-privacy-protection.md](user-privacy-protection.md) | 作成済み |
| セキュア開発 | 脅威モデリング、サプライチェーン、依存関係、コードレビュー | V15 | [../asvs/v15-secure-coding-and-architecture.md](../asvs/v15-secure-coding-and-architecture.md), [threat-modeling.md](threat-modeling.md), [software-supply-chain-security.md](software-supply-chain-security.md), [secure-code-review.md](secure-code-review.md) | 作成済み |
| ログとエラー | セキュリティイベント、ログ保護、エラー応答 | V16 | [../asvs/v16-security-logging-and-error-handling.md](../asvs/v16-security-logging-and-error-handling.md), [logging.md](logging.md), [logging-vocabulary.md](logging-vocabulary.md), [error-handling.md](error-handling.md) | 作成済み |
| WebRTC | TURN、メディア、シグナリング、TLS | V17 | [../asvs/v17-webrtc.md](../asvs/v17-webrtc.md), [transport-layer-security.md](transport-layer-security.md) | 作成済み |

## Issue 化テンプレート

各トピックを実装タスクへ落とすときは、次の情報を含めます。

- 対象機能、エンドポイント、画面、ジョブ、または設定。
- 関連 ASVS 章と参照する翻訳、要約、チェックリスト。
- 実装する制御、禁止する挙動、許容する例外。
- テスト観点。正常系だけでなく、迂回、改ざん、権限不足、過剰入力、再利用、期限切れを含める。
- ログまたは監査観点。イベント名、主体、対象リソース、相関 ID、秘密情報を記録しない条件を明示する。
- 完了条件。コード、設定、ドキュメント、テスト、レビュー結果のどれで確認するかを明示する。
