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

- [Bean Validation チートシート 開発チェックリスト](bean-validation.md)
- [CSRF防止チートシート 開発チェックリスト](csrf-prevention.md)
- [デシリアライゼーションチートシート 開発チェックリスト](deserialization.md)
- [DOM Based XSS防止チートシート 開発チェックリスト](dom-based-xss-prevention.md)
- [ファイルアップロードチートシート 開発チェックリスト](file-upload.md)
- [Javaにおけるインジェクション防止チートシート 開発チェックリスト](injection-prevention-in-java.md)
- [インジェクション防止チートシート 開発チェックリスト](injection-prevention.md)
- [入力検証チートシート 開発チェックリスト](input-validation.md)
- [Javaセキュリティチートシート 開発チェックリスト](java-security.md)
- [LDAPインジェクション防止チートシート 開発チェックリスト](ldap-injection-prevention.md)
- [OSコマンドインジェクション防御チートシート 開発チェックリスト](os-command-injection-defense.md)
- [クエリパラメータ化チートシート 開発チェックリスト](query-parameterization.md)
- [セキュリティ用語チートシート 開発チェックリスト](security-terminology.md)
- [SQLインジェクション防止チートシート 開発チェックリスト](sql-injection-prevention.md)
- [SSRF防止チートシート 開発チェックリスト](ssrf-prevention.md)
- [XMLセキュリティチートシート 開発チェックリスト](xml-security.md)
- [XSSフィルタ回避チートシート 開発チェックリスト](xss-filter-evasion.md)
- [XSS防止チートシート 開発チェックリスト](xss-prevention.md)
- [XXE防止チートシート 開発チェックリスト](xxe-prevention.md)

### ASVS v2

- [悪用ケースチートシート 開発チェックリスト](abuse-case.md)
- [サービス拒否対策チートシート 開発チェックリスト](denial-of-service.md)
- [マイクロサービスセキュリティチートシート 開発チェックリスト](microservices-security.md)
- [Webサービスセキュリティチートシート 開発チェックリスト](web-service-security.md)

### ASVS v3

- [Content Security Policy チートシート 開発チェックリスト](content-security-policy.md)
- [DOM Clobbering防止チートシート 開発チェックリスト](dom-clobbering-prevention.md)
- [HTML5セキュリティチートシート 開発チェックリスト](html5-security.md)
- [HSTSチートシート 開発チェックリスト](http-strict-transport-security.md)
- [サードパーティJavaScript管理チートシート 開発チェックリスト](third-party-javascript-management.md)
- [TLSチートシート 開発チェックリスト](transport-layer-security.md)

### ASVS v4

- [GraphQLチートシート 開発チェックリスト](graphql.md)
- [REST評価チートシート 開発チェックリスト](rest-assessment.md)
- [RESTセキュリティチートシート 開発チェックリスト](rest-security.md)

### ASVS v5

- この章を主所属とするファイルはありません。関連ファイルは他章の主所属フォルダに置き、ASVS 章ページからリンクします。

### ASVS v6

- [認証チートシート 開発チェックリスト](authentication.md)
- [クレデンシャルスタッフィング防止チートシート 開発チェックリスト](credential-stuffing-prevention.md)
- [パスワードリセットチートシート 開発チェックリスト](forgot-password.md)
- [多要素認証チートシート 開発チェックリスト](multifactor-authentication.md)
- [パスワード保存チートシート 開発チェックリスト](password-storage.md)
- [秘密の質問チートシート 開発チェックリスト](security-questions.md)
- [トランザクション認可チートシート 開発チェックリスト](transaction-authorization.md)

### ASVS v7

- [セッション管理チートシート 開発チェックリスト](session-management.md)

### ASVS v8

- [認可テスト自動化チートシート 開発チェックリスト](authorization-testing-automation.md)
- [認可チートシート 開発チェックリスト](authorization.md)
- [IDOR防止チートシート 開発チェックリスト](idor-prevention.md)
- [マルチテナントセキュリティチートシート 開発チェックリスト](multi-tenant-security.md)

### ASVS v9

- [Java向けJWTチートシート 開発チェックリスト](json-web-token-for-java.md)
- [SAMLセキュリティチートシート 開発チェックリスト](saml-security.md)

### ASVS v10

- [ブラウザ拡張機能脆弱性チートシート 開発チェックリスト](browser-extension-vulnerabilities.md)
- [ログ記録チートシート 開発チェックリスト](logging.md)
- [OAuth 2.0プロトコルチートシート 開発チェックリスト](oauth2.md)

### ASVS v11

- [暗号化ストレージチートシート 開発チェックリスト](cryptographic-storage.md)
- [鍵管理チートシート 開発チェックリスト](key-management.md)
- [シークレット管理チートシート 開発チェックリスト](secrets-management.md)

### ASVS v12

- この章を主所属とするファイルはありません。関連ファイルは他章の主所属フォルダに置き、ASVS 章ページからリンクします。

### ASVS v13

- [Djangoセキュリティチートシート 開発チェックリスト](django-security.md)
- [Dockerセキュリティチートシート 開発チェックリスト](docker-security.md)

### ASVS v14

- [ユーザープライバシー保護チートシート 開発チェックリスト](user-privacy-protection.md)

### ASVS v15

- [攻撃対象領域分析チートシート 開発チェックリスト](attack-surface-analysis.md)
- [依存関係グラフとSBOMチートシート 開発チェックリスト](dependency-graph-sbom.md)
- [マスアサインメントチートシート 開発チェックリスト](mass-assignment.md)
- [NPMセキュリティチートシート 開発チェックリスト](npm-security.md)
- [プロトタイプ汚染防止チートシート 開発チェックリスト](prototype-pollution-prevention.md)
- [セキュアコードレビューチートシート 開発チェックリスト](secure-code-review.md)
- [ソフトウェアサプライチェーンセキュリティチートシート 開発チェックリスト](software-supply-chain-security.md)
- [脅威モデリングチートシート 開発チェックリスト](threat-modeling.md)
- [仮想パッチ適用チートシート 開発チェックリスト](virtual-patching.md)
- [脆弱な依存関係管理チートシート 開発チェックリスト](vulnerable-dependency-management.md)

### ASVS v16

- [エラーハンドリングチートシート 開発チェックリスト](error-handling.md)
- [ログ語彙チートシート 開発チェックリスト](logging-vocabulary.md)

### ASVS v17

- この章を主所属とするファイルはありません。関連ファイルは他章の主所属フォルダに置き、ASVS 章ページからリンクします。
