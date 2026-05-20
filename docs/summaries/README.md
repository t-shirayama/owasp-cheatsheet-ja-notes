# Summaries

OWASP Cheat Sheet Series の日本語要約を置くディレクトリです。

## 非公式性について

このディレクトリの文書は OWASP 公式翻訳ではなく、非公式の日本語要約です。正確な判断、監査、実装基準への適用では、必ず各ページの Attribution にある公式原文を確認してください。

## 方針

- 原文の意味と規範的な強さを保ちつつ、設計・実装時に短時間で把握できる形に整理します。
- ファイルは主所属の ASVS 章ごとに `v1/` から `v17/` のサブディレクトリへ置きます。
- 詳細な本文訳は [../translations/](../translations/) に置きます。
- 実装タスクとして使うチェックリストは [../checklists/](../checklists/) に置きます。
- 各ファイルには必ず Attribution セクションを置きます。

## 作成済み

### ASVS v1

- [Bean Validation チートシート 要約](bean-validation.md)
- [CSRF防止チートシート 要約](csrf-prevention.md)
- [デシリアライゼーションチートシート 要約](deserialization.md)
- [DOM Based XSS防止チートシート 要約](dom-based-xss-prevention.md)
- [ファイルアップロードチートシート 要約](file-upload.md)
- [Javaにおけるインジェクション防止チートシート 要約](injection-prevention-in-java.md)
- [インジェクション防止チートシート 要約](injection-prevention.md)
- [入力検証チートシート 要約](input-validation.md)
- [Javaセキュリティチートシート 要約](java-security.md)
- [LDAPインジェクション防止チートシート 要約](ldap-injection-prevention.md)
- [OSコマンドインジェクション防御チートシート 要約](os-command-injection-defense.md)
- [クエリパラメータ化チートシート 要約](query-parameterization.md)
- [セキュリティ用語チートシート 要約](security-terminology.md)
- [SQLインジェクション防止チートシート 要約](sql-injection-prevention.md)
- [SSRF防止チートシート 要約](ssrf-prevention.md)
- [XMLセキュリティチートシート 要約](xml-security.md)
- [XSSフィルタ回避チートシート 要約](xss-filter-evasion.md)
- [XSS防止チートシート 要約](xss-prevention.md)
- [XXE防止チートシート 要約](xxe-prevention.md)

### ASVS v2

- [悪用ケースチートシート 要約](abuse-case.md)
- [サービス拒否対策チートシート 要約](denial-of-service.md)
- [マイクロサービスセキュリティチートシート 要約](microservices-security.md)
- [Webサービスセキュリティチートシート 要約](web-service-security.md)

### ASVS v3

- [Content Security Policy チートシート 要約](content-security-policy.md)
- [DOM Clobbering防止チートシート 要約](dom-clobbering-prevention.md)
- [HTML5セキュリティチートシート 要約](html5-security.md)
- [HSTSチートシート 要約](http-strict-transport-security.md)
- [サードパーティJavaScript管理チートシート 要約](third-party-javascript-management.md)
- [TLSチートシート 要約](transport-layer-security.md)

### ASVS v4

- [GraphQLチートシート 要約](graphql.md)
- [REST評価チートシート 要約](rest-assessment.md)
- [RESTセキュリティチートシート 要約](rest-security.md)

### ASVS v5

- この章を主所属とするファイルはありません。関連ファイルは他章の主所属フォルダに置き、ASVS 章ページからリンクします。

### ASVS v6

- [認証チートシート 要約](authentication.md)
- [クレデンシャルスタッフィング防止チートシート 要約](credential-stuffing-prevention.md)
- [パスワードリセットチートシート 要約](forgot-password.md)
- [多要素認証チートシート 要約](multifactor-authentication.md)
- [パスワード保存チートシート 要約](password-storage.md)
- [秘密の質問チートシート 要約](security-questions.md)
- [トランザクション認可チートシート 要約](transaction-authorization.md)

### ASVS v7

- [セッション管理チートシート 要約](session-management.md)

### ASVS v8

- [認可テスト自動化チートシート 要約](authorization-testing-automation.md)
- [認可チートシート 要約](authorization.md)
- [IDOR防止チートシート 要約](idor-prevention.md)
- [マルチテナントセキュリティチートシート 要約](multi-tenant-security.md)

### ASVS v9

- [Java向けJWTチートシート 要約](json-web-token-for-java.md)
- [SAMLセキュリティチートシート 要約](saml-security.md)

### ASVS v10

- [ブラウザ拡張機能脆弱性チートシート 要約](browser-extension-vulnerabilities.md)
- [ログ記録チートシート 要約](logging.md)
- [OAuth 2.0プロトコルチートシート 要約](oauth2.md)

### ASVS v11

- [暗号化ストレージチートシート 要約](cryptographic-storage.md)
- [鍵管理チートシート 要約](key-management.md)
- [シークレット管理チートシート 要約](secrets-management.md)

### ASVS v12

- この章を主所属とするファイルはありません。関連ファイルは他章の主所属フォルダに置き、ASVS 章ページからリンクします。

### ASVS v13

- [Djangoセキュリティチートシート 要約](django-security.md)
- [Dockerセキュリティチートシート 要約](docker-security.md)

### ASVS v14

- [ユーザープライバシー保護チートシート 要約](user-privacy-protection.md)

### ASVS v15

- [攻撃対象領域分析チートシート 要約](attack-surface-analysis.md)
- [依存関係グラフとSBOMチートシート 要約](dependency-graph-sbom.md)
- [マスアサインメントチートシート 要約](mass-assignment.md)
- [NPMセキュリティチートシート 要約](npm-security.md)
- [プロトタイプ汚染防止チートシート 要約](prototype-pollution-prevention.md)
- [セキュアコードレビューチートシート 要約](secure-code-review.md)
- [ソフトウェアサプライチェーンセキュリティチートシート 要約](software-supply-chain-security.md)
- [脅威モデリングチートシート 要約](threat-modeling.md)
- [仮想パッチ適用チートシート 要約](virtual-patching.md)
- [脆弱な依存関係管理チートシート 要約](vulnerable-dependency-management.md)

### ASVS v16

- [エラーハンドリングチートシート 要約](error-handling.md)
- [ログ語彙チートシート 要約](logging-vocabulary.md)

### ASVS v17

- この章を主所属とするファイルはありません。関連ファイルは他章の主所属フォルダに置き、ASVS 章ページからリンクします。
