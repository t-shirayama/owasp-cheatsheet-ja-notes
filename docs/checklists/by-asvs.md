# ASVS 章順チェックリスト

## 概要

ASVS 章順に実装・レビュー観点を集約するチェックリストです。詳細な本文訳は [../translations/](../translations/) を、要約は [../summaries/](../summaries/) を参照します。

## チェックリスト

| ASVS 章 | 確認観点 | 関連ドキュメント | 状態 |
| --- | --- | --- | --- |
| V1 | Encoding and Sanitization | [v1-encoding-and-sanitization.md](../asvs/v1-encoding-and-sanitization.md) | 作成済み |
| V2 | Validation and Business Logic | [v2-validation-and-business-logic.md](../asvs/v2-validation-and-business-logic.md) | 作成済み |
| V3 | Web Frontend Security | [v3-web-frontend-security.md](../asvs/v3-web-frontend-security.md) | 作成済み |
| V4 | API and Web Service | [v4-api-and-web-service.md](../asvs/v4-api-and-web-service.md) | 作成済み |
| V5 | File Handling | [v5-file-handling.md](../asvs/v5-file-handling.md) | 作成済み |
| V6 | Authentication | [v6-authentication.md](../asvs/v6-authentication.md) | 作成済み |
| V7 | Session Management | [v7-session-management.md](../asvs/v7-session-management.md) | 作成済み |
| V8 | Authorization | [v8-authorization.md](../asvs/v8-authorization.md) | 作成済み |
| V9 | Self-contained Tokens | [v9-self-contained-tokens.md](../asvs/v9-self-contained-tokens.md) | 作成済み |
| V10 | OAuth and OIDC | [v10-oauth-and-oidc.md](../asvs/v10-oauth-and-oidc.md) | 作成済み |
| V11 | Cryptography | [v11-cryptography.md](../asvs/v11-cryptography.md) | 作成済み |
| V12 | Secure Communication | [v12-secure-communication.md](../asvs/v12-secure-communication.md) | 作成済み |
| V13 | Configuration | [v13-configuration.md](../asvs/v13-configuration.md) | 作成済み |
| V14 | Data Protection | [v14-data-protection.md](../asvs/v14-data-protection.md) | 作成済み |
| V15 | Secure Coding and Architecture | [v15-secure-coding-and-architecture.md](../asvs/v15-secure-coding-and-architecture.md) | 作成済み |
| V16 | Security Logging and Error Handling | [v16-security-logging-and-error-handling.md](../asvs/v16-security-logging-and-error-handling.md) | 作成済み |
| V17 | WebRTC | [v17-webrtc.md](../asvs/v17-webrtc.md) | 作成済み |

## 章別実装チェック観点

| ASVS 章 | Issue 化しやすい確認観点 | レビューで見る失敗モード |
| --- | --- | --- |
| V1 | 入力の信頼境界、出力コンテキスト、HTML サニタイズ、SQL/LDAP/OS コマンド/XML 処理を確認する。 | インジェクション、XSS、XXE、パース差異、サニタイズ漏れ |
| V2 | 業務ルール、状態遷移、回数制限、悪用ケース、DoS 耐性を確認する。 | 処理順序の迂回、過剰利用、業務制約の欠落 |
| V3 | CSP、DOM API、CSRF、HTML5 API、サードパーティ JavaScript を確認する。 | DOM XSS、CSRF、クリックジャッキング、外部スクリプト改ざん |
| V4 | REST、GraphQL、Web Service、マイクロサービスの認証、認可、入力、レート制限を確認する。 | API 認可漏れ、過剰取得、スキーマ迂回、サービス間信頼の誤用 |
| V5 | ファイル名、拡張子、MIME、サイズ、保存場所、マルウェア検査、取得認可を確認する。 | 任意ファイルアップロード、パストラバーサル、保管データ漏えい |
| V6 | パスワード、MFA、リカバリ、クレデンシャルスタッフィング、認証イベントを確認する。 | アカウント列挙、MFA 迂回、弱い回復経路、認証自動化攻撃 |
| V7 | セッション ID、Cookie 属性、タイムアウト、終了、固定化対策、失効を確認する。 | セッション固定化、盗難、期限切れ後利用、ログアウト不備 |
| V8 | 操作レベル、オブジェクトレベル、テナント境界、認可テストを確認する。 | IDOR、水平/垂直権限昇格、クロステナントアクセス |
| V9 | JWT、SAML、自己完結トークンの署名、期限、発行者、受信者、失効を確認する。 | 署名検証不備、トークン再利用、audience/issuer 混同 |
| V10 | OAuth/OIDC のリダイレクト、PKCE、state、nonce、スコープ、トークン保存を確認する。 | 認可コード横取り、CSRF、token substitution、過剰スコープ |
| V11 | 暗号方式、鍵管理、乱数、保存時暗号化、シークレット管理を確認する。 | 弱い暗号、鍵漏えい、ローテーション不能、保存データ復号 |
| V12 | TLS、HSTS、証明書検証、内部通信、秘密鍵保護を確認する。 | ダウングレード、証明書検証無効化、混在コンテンツ |
| V13 | Docker、Django、クラウド/ミドルウェア設定、セキュリティヘッダーを確認する。 | デフォルト設定、過剰権限、デバッグ露出、設定ドリフト |
| V14 | 個人情報、プライバシー、データ保持、削除、最小化、目的外利用を確認する。 | 個人情報漏えい、過剰収集、削除不能、保持期間超過 |
| V15 | 脅威モデリング、攻撃対象領域、SBOM、依存関係、コードレビューを確認する。 | サプライチェーン侵害、未把握依存、設計上の残余リスク |
| V16 | セキュリティログ、エラー応答、監査イベント、ログ保護、相関 ID を確認する。 | 監査不能、秘密情報ログ出力、詳細エラー漏えい、改ざん |
| V17 | WebRTC のシグナリング、TURN、メディア通信、権限、TLS を確認する。 | 通信傍受、ICE 情報漏えい、TURN 悪用、権限過大 |
