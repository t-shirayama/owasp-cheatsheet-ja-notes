# Translations

OWASP Cheat Sheet Series の日本語訳を置くディレクトリです。

## 方針

- 1つの原文 Cheat Sheet につき、原則として1つの日本語訳ファイルを作成します。
- ファイルは主所属の ASVS 章ごとに `v1/ から `v17/ のサブディレクトリへ置きます。
- 複数章に関連する Cheat Sheet も複製せず、主所属フォルダに1ファイルだけ置きます。
- 要約や開発チェックリストはこのディレクトリに混ぜず、[../summaries/](../summaries/) と [../checklists/](../checklists/) に分けます。
- 各ファイルには必ず Attribution セクションを置きます。
- ファイル名は原文タイトルに対応する ASCII kebab-case にします。

## 作成済み

### ASVS v1

- [Bean Validation チートシート 日本語訳](v1/bean-validation.md)
- [CSRF防止チートシート 日本語訳](v1/csrf-prevention.md)
- [デシリアライゼーションチートシート 日本語訳](v1/deserialization.md)
- [DOM Based XSS防止チートシート 日本語訳](v1/dom-based-xss-prevention.md)
- [ファイルアップロードチートシート 日本語訳](v1/file-upload.md)
- [Javaにおけるインジェクション防止チートシート 日本語訳](v1/injection-prevention-in-java.md)
- [インジェクション防止チートシート 日本語訳](v1/injection-prevention.md)
- [入力検証チートシート 日本語訳](v1/input-validation.md)
- [Javaセキュリティチートシート 日本語訳](v1/java-security.md)
- [LDAPインジェクション防止チートシート 日本語訳](v1/ldap-injection-prevention.md)
- [OSコマンドインジェクション防御チートシート 日本語訳](v1/os-command-injection-defense.md)
- [クエリパラメータ化チートシート 日本語訳](v1/query-parameterization.md)
- [セキュリティ用語チートシート 日本語訳](v1/security-terminology.md)
- [SQLインジェクション防止チートシート 日本語訳](v1/sql-injection-prevention.md)
- [SSRF防止チートシート 日本語訳](v1/ssrf-prevention.md)
- [XMLセキュリティチートシート 日本語訳](v1/xml-security.md)
- [XSSフィルタ回避チートシート 日本語訳](v1/xss-filter-evasion.md)
- [XSS防止チートシート 日本語訳](v1/xss-prevention.md)
- [XXE防止チートシート 日本語訳](v1/xxe-prevention.md)

### ASVS v2

- [悪用ケースチートシート 日本語訳](v2/abuse-case.md)
- [サービス拒否対策チートシート 日本語訳](v2/denial-of-service.md)
- [マイクロサービスセキュリティチートシート 日本語訳](v2/microservices-security.md)
- [Webサービスセキュリティチートシート 日本語訳](v2/web-service-security.md)

### ASVS v3

- [Content Security Policy チートシート 日本語訳](v3/content-security-policy.md)
- [DOM Clobbering防止チートシート 日本語訳](v3/dom-clobbering-prevention.md)
- [HTML5セキュリティチートシート 日本語訳](v3/html5-security.md)
- [HSTSチートシート 日本語訳](v3/http-strict-transport-security.md)
- [サードパーティJavaScript管理チートシート 日本語訳](v3/third-party-javascript-management.md)
- [TLSチートシート 日本語訳](v3/transport-layer-security.md)

### ASVS v4

- [GraphQLチートシート 日本語訳](v4/graphql.md)
- [REST評価チートシート 日本語訳](v4/rest-assessment.md)
- [RESTセキュリティチートシート 日本語訳](v4/rest-security.md)

### ASVS v5

- この章を主所属とするファイルはありません。関連ファイルは他章の主所属フォルダに置き、ASVS 章ページからリンクします。

### ASVS v6

- [認証チートシート 日本語訳](v6/authentication.md)
- [クレデンシャルスタッフィング防止チートシート 日本語訳](v6/credential-stuffing-prevention.md)
- [パスワードリセットチートシート 日本語訳](v6/forgot-password.md)
- [多要素認証チートシート 日本語訳](v6/multifactor-authentication.md)
- [パスワード保存チートシート 日本語訳](v6/password-storage.md)
- [秘密の質問チートシート 日本語訳](v6/security-questions.md)
- [トランザクション認可チートシート 日本語訳](v6/transaction-authorization.md)

### ASVS v7

- [セッション管理チートシート 日本語訳](v7/session-management.md)

### ASVS v8

- [認可テスト自動化チートシート 日本語訳](v8/authorization-testing-automation.md)
- [認可チートシート 日本語訳](v8/authorization.md)
- [IDOR防止チートシート 日本語訳](v8/idor-prevention.md)
- [マルチテナントセキュリティチートシート 日本語訳](v8/multi-tenant-security.md)

### ASVS v9

- [Java向けJWTチートシート 日本語訳](v9/json-web-token-for-java.md)
- [SAMLセキュリティチートシート 日本語訳](v9/saml-security.md)

### ASVS v10

- [ブラウザ拡張機能脆弱性チートシート 日本語訳](v10/browser-extension-vulnerabilities.md)
- [ログ記録チートシート 日本語訳](v10/logging.md)
- [OAuth 2.0プロトコルチートシート 日本語訳](v10/oauth2.md)

### ASVS v11

- [暗号化ストレージチートシート 日本語訳](v11/cryptographic-storage.md)
- [鍵管理チートシート 日本語訳](v11/key-management.md)
- [シークレット管理チートシート 日本語訳](v11/secrets-management.md)

### ASVS v12

- この章を主所属とするファイルはありません。関連ファイルは他章の主所属フォルダに置き、ASVS 章ページからリンクします。

### ASVS v13

- [Djangoセキュリティチートシート 日本語訳](v13/django-security.md)
- [Dockerセキュリティチートシート 日本語訳](v13/docker-security.md)

### ASVS v14

- [ユーザープライバシー保護チートシート 日本語訳](v14/user-privacy-protection.md)

### ASVS v15

- [攻撃対象領域分析チートシート 日本語訳](v15/attack-surface-analysis.md)
- [依存関係グラフとSBOMチートシート 日本語訳](v15/dependency-graph-sbom.md)
- [マスアサインメントチートシート 日本語訳](v15/mass-assignment.md)
- [NPMセキュリティチートシート 日本語訳](v15/npm-security.md)
- [プロトタイプ汚染防止チートシート 日本語訳](v15/prototype-pollution-prevention.md)
- [セキュアコードレビューチートシート 日本語訳](v15/secure-code-review.md)
- [ソフトウェアサプライチェーンセキュリティチートシート 日本語訳](v15/software-supply-chain-security.md)
- [脅威モデリングチートシート 日本語訳](v15/threat-modeling.md)
- [仮想パッチ適用チートシート 日本語訳](v15/virtual-patching.md)
- [脆弱な依存関係管理チートシート 日本語訳](v15/vulnerable-dependency-management.md)

### ASVS v16

- [エラーハンドリングチートシート 日本語訳](v16/error-handling.md)
- [ログ語彙チートシート 日本語訳](v16/logging-vocabulary.md)

### ASVS v17

- この章を主所属とするファイルはありません。関連ファイルは他章の主所属フォルダに置き、ASVS 章ページからリンクします。
