# Checklists

実装・レビュー時に使うチェックリストを置くディレクトリです。

## 非公式性について

このディレクトリの文書は OWASP 公式翻訳ではなく、非公式の開発チェックリストです。正確な判断、監査、実装基準への適用では、必ず各ページの Attribution にある公式原文を確認してください。

## ファイル

- [by-asvs.md](by-asvs.md): ASVS 章順のチェックリスト
- [by-topic.md](by-topic.md): トピック順のチェックリスト

## 方針

- Cheat Sheet 別チェックリストは、主所属の ASVS 章ごとに `v1/` から `v17/` のサブディレクトリへ置きます。
- 詳細な本文訳は [../translations/](../translations/) へ、短い要約は [../summaries/](../summaries/) へリンクします。
- このディレクトリでは、実装者が確認しやすい粒度に絞って整理します。
- 各項目は可能な限り、設計レビュー、コードレビュー、テストで確認できる表現にします。

## Cheat Sheet 別チェックリスト

### ASVS v1

- [Bean Validation チートシート 開発チェックリスト](v1/bean-validation.md)
- [CSRF防止チートシート 開発チェックリスト](v1/csrf-prevention.md)
- [デシリアライゼーションチートシート 開発チェックリスト](v1/deserialization.md)
- [DOM Based XSS防止チートシート 開発チェックリスト](v1/dom-based-xss-prevention.md)
- [ファイルアップロードチートシート 開発チェックリスト](v1/file-upload.md)
- [Javaにおけるインジェクション防止チートシート 開発チェックリスト](v1/injection-prevention-in-java.md)
- [インジェクション防止チートシート 開発チェックリスト](v1/injection-prevention.md)
- [入力検証チートシート 開発チェックリスト](v1/input-validation.md)
- [Javaセキュリティチートシート 開発チェックリスト](v1/java-security.md)
- [LDAPインジェクション防止チートシート 開発チェックリスト](v1/ldap-injection-prevention.md)
- [OSコマンドインジェクション防御チートシート 開発チェックリスト](v1/os-command-injection-defense.md)
- [クエリパラメータ化チートシート 開発チェックリスト](v1/query-parameterization.md)
- [セキュリティ用語チートシート 開発チェックリスト](v1/security-terminology.md)
- [SQLインジェクション防止チートシート 開発チェックリスト](v1/sql-injection-prevention.md)
- [SSRF防止チートシート 開発チェックリスト](v1/ssrf-prevention.md)
- [XMLセキュリティチートシート 開発チェックリスト](v1/xml-security.md)
- [XSSフィルタ回避チートシート 開発チェックリスト](v1/xss-filter-evasion.md)
- [XSS防止チートシート 開発チェックリスト](v1/xss-prevention.md)
- [XXE防止チートシート 開発チェックリスト](v1/xxe-prevention.md)

### ASVS v2

- [悪用ケースチートシート 開発チェックリスト](v2/abuse-case.md)
- [サービス拒否対策チートシート 開発チェックリスト](v2/denial-of-service.md)
- [マイクロサービスセキュリティチートシート 開発チェックリスト](v2/microservices-security.md)
- [Webサービスセキュリティチートシート 開発チェックリスト](v2/web-service-security.md)

### ASVS v3

- [Content Security Policy チートシート 開発チェックリスト](v3/content-security-policy.md)
- [DOM Clobbering防止チートシート 開発チェックリスト](v3/dom-clobbering-prevention.md)
- [HTML5セキュリティチートシート 開発チェックリスト](v3/html5-security.md)
- [HSTSチートシート 開発チェックリスト](v3/http-strict-transport-security.md)
- [サードパーティJavaScript管理チートシート 開発チェックリスト](v3/third-party-javascript-management.md)
- [TLSチートシート 開発チェックリスト](v3/transport-layer-security.md)

### ASVS v4

- [GraphQLチートシート 開発チェックリスト](v4/graphql.md)
- [REST評価チートシート 開発チェックリスト](v4/rest-assessment.md)
- [RESTセキュリティチートシート 開発チェックリスト](v4/rest-security.md)

### ASVS v5

- この章を主所属とするファイルはありません。関連ファイルは他章の主所属フォルダに置き、ASVS 章ページからリンクします。

### ASVS v6

- [認証チートシート 開発チェックリスト](v6/authentication.md)
- [クレデンシャルスタッフィング防止チートシート 開発チェックリスト](v6/credential-stuffing-prevention.md)
- [パスワードリセットチートシート 開発チェックリスト](v6/forgot-password.md)
- [多要素認証チートシート 開発チェックリスト](v6/multifactor-authentication.md)
- [パスワード保存チートシート 開発チェックリスト](v6/password-storage.md)
- [秘密の質問チートシート 開発チェックリスト](v6/security-questions.md)
- [トランザクション認可チートシート 開発チェックリスト](v6/transaction-authorization.md)

### ASVS v7

- [セッション管理チートシート 開発チェックリスト](v7/session-management.md)

### ASVS v8

- [認可テスト自動化チートシート 開発チェックリスト](v8/authorization-testing-automation.md)
- [認可チートシート 開発チェックリスト](v8/authorization.md)
- [IDOR防止チートシート 開発チェックリスト](v8/idor-prevention.md)
- [マルチテナントセキュリティチートシート 開発チェックリスト](v8/multi-tenant-security.md)

### ASVS v9

- [Java向けJWTチートシート 開発チェックリスト](v9/json-web-token-for-java.md)
- [SAMLセキュリティチートシート 開発チェックリスト](v9/saml-security.md)

### ASVS v10

- [ブラウザ拡張機能脆弱性チートシート 開発チェックリスト](v10/browser-extension-vulnerabilities.md)
- [ログ記録チートシート 開発チェックリスト](v10/logging.md)
- [OAuth 2.0プロトコルチートシート 開発チェックリスト](v10/oauth2.md)

### ASVS v11

- [暗号化ストレージチートシート 開発チェックリスト](v11/cryptographic-storage.md)
- [鍵管理チートシート 開発チェックリスト](v11/key-management.md)
- [シークレット管理チートシート 開発チェックリスト](v11/secrets-management.md)

### ASVS v12

- この章を主所属とするファイルはありません。関連ファイルは他章の主所属フォルダに置き、ASVS 章ページからリンクします。

### ASVS v13

- [Djangoセキュリティチートシート 開発チェックリスト](v13/django-security.md)
- [Dockerセキュリティチートシート 開発チェックリスト](v13/docker-security.md)

### ASVS v14

- [ユーザープライバシー保護チートシート 開発チェックリスト](v14/user-privacy-protection.md)

### ASVS v15

- [攻撃対象領域分析チートシート 開発チェックリスト](v15/attack-surface-analysis.md)
- [依存関係グラフとSBOMチートシート 開発チェックリスト](v15/dependency-graph-sbom.md)
- [マスアサインメントチートシート 開発チェックリスト](v15/mass-assignment.md)
- [NPMセキュリティチートシート 開発チェックリスト](v15/npm-security.md)
- [プロトタイプ汚染防止チートシート 開発チェックリスト](v15/prototype-pollution-prevention.md)
- [セキュアコードレビューチートシート 開発チェックリスト](v15/secure-code-review.md)
- [ソフトウェアサプライチェーンセキュリティチートシート 開発チェックリスト](v15/software-supply-chain-security.md)
- [脅威モデリングチートシート 開発チェックリスト](v15/threat-modeling.md)
- [仮想パッチ適用チートシート 開発チェックリスト](v15/virtual-patching.md)
- [脆弱な依存関係管理チートシート 開発チェックリスト](v15/vulnerable-dependency-management.md)

### ASVS v16

- [エラーハンドリングチートシート 開発チェックリスト](v16/error-handling.md)
- [ログ語彙チートシート 開発チェックリスト](v16/logging-vocabulary.md)

### ASVS v17

- この章を主所属とするファイルはありません。関連ファイルは他章の主所属フォルダに置き、ASVS 章ページからリンクします。
