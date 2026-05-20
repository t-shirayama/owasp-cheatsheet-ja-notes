# Translations

OWASP Cheat Sheet Series の日本語訳を置くディレクトリです。

## 非公式性について

このディレクトリの文書は OWASP 公式翻訳ではなく、非公式の日本語訳です。正確な判断、監査、実装基準への適用では、必ず各ページの Attribution にある公式原文を確認してください。

## 方針

- 1つの原文 Cheat Sheet につき、原則として1つの日本語訳ファイルを作成します。
- ファイルは主所属の ASVS 章ごとに `v1/` から `v17/` のサブディレクトリへ置きます。
- 複数章に関連する Cheat Sheet も複製せず、主所属フォルダに1ファイルだけ置きます。
- 要約や開発チェックリストはこのディレクトリに混ぜず、[../summaries/](../summaries/) と [../checklists/](../checklists/) に分けます。
- 各ファイルには必ず Attribution セクションを置きます。
- ファイル名は原文タイトルに対応する ASCII kebab-case にします。

## 作成済み

### ASVS v1

- [Bean Validation チートシート 日本語訳](bean-validation.md)
- [CSRF防止チートシート 日本語訳](csrf-prevention.md)
- [デシリアライゼーションチートシート 日本語訳](deserialization.md)
- [DOM Based XSS防止チートシート 日本語訳](dom-based-xss-prevention.md)
- [ファイルアップロードチートシート 日本語訳](file-upload.md)
- [Javaにおけるインジェクション防止チートシート 日本語訳](injection-prevention-in-java.md)
- [インジェクション防止チートシート 日本語訳](injection-prevention.md)
- [入力検証チートシート 日本語訳](input-validation.md)
- [Javaセキュリティチートシート 日本語訳](java-security.md)
- [LDAPインジェクション防止チートシート 日本語訳](ldap-injection-prevention.md)
- [OSコマンドインジェクション防御チートシート 日本語訳](os-command-injection-defense.md)
- [クエリパラメータ化チートシート 日本語訳](query-parameterization.md)
- [セキュリティ用語チートシート 日本語訳](security-terminology.md)
- [SQLインジェクション防止チートシート 日本語訳](sql-injection-prevention.md)
- [SSRF防止チートシート 日本語訳](ssrf-prevention.md)
- [XMLセキュリティチートシート 日本語訳](xml-security.md)
- [XSSフィルタ回避チートシート 日本語訳](xss-filter-evasion.md)
- [XSS防止チートシート 日本語訳](xss-prevention.md)
- [XXE防止チートシート 日本語訳](xxe-prevention.md)

### ASVS v2

- [悪用ケースチートシート 日本語訳](abuse-case.md)
- [サービス拒否対策チートシート 日本語訳](denial-of-service.md)
- [マイクロサービスセキュリティチートシート 日本語訳](microservices-security.md)
- [Webサービスセキュリティチートシート 日本語訳](web-service-security.md)

### ASVS v3

- [Content Security Policy チートシート 日本語訳](content-security-policy.md)
- [DOM Clobbering防止チートシート 日本語訳](dom-clobbering-prevention.md)
- [HTML5セキュリティチートシート 日本語訳](html5-security.md)
- [HSTSチートシート 日本語訳](http-strict-transport-security.md)
- [サードパーティJavaScript管理チートシート 日本語訳](third-party-javascript-management.md)
- [TLSチートシート 日本語訳](transport-layer-security.md)

### ASVS v4

- [GraphQLチートシート 日本語訳](graphql.md)
- [REST評価チートシート 日本語訳](rest-assessment.md)
- [RESTセキュリティチートシート 日本語訳](rest-security.md)

### ASVS v5

- この章を主所属とするファイルはありません。関連ファイルは他章の主所属フォルダに置き、ASVS 章ページからリンクします。

### ASVS v6

- [認証チートシート 日本語訳](authentication.md)
- [クレデンシャルスタッフィング防止チートシート 日本語訳](credential-stuffing-prevention.md)
- [パスワードリセットチートシート 日本語訳](forgot-password.md)
- [多要素認証チートシート 日本語訳](multifactor-authentication.md)
- [パスワード保存チートシート 日本語訳](password-storage.md)
- [秘密の質問チートシート 日本語訳](security-questions.md)
- [トランザクション認可チートシート 日本語訳](transaction-authorization.md)

### ASVS v7

- [セッション管理チートシート 日本語訳](session-management.md)

### ASVS v8

- [認可テスト自動化チートシート 日本語訳](authorization-testing-automation.md)
- [認可チートシート 日本語訳](authorization.md)
- [IDOR防止チートシート 日本語訳](idor-prevention.md)
- [マルチテナントセキュリティチートシート 日本語訳](multi-tenant-security.md)

### ASVS v9

- [Java向けJWTチートシート 日本語訳](json-web-token-for-java.md)
- [SAMLセキュリティチートシート 日本語訳](saml-security.md)

### ASVS v10

- [ブラウザ拡張機能脆弱性チートシート 日本語訳](browser-extension-vulnerabilities.md)
- [ログ記録チートシート 日本語訳](logging.md)
- [OAuth 2.0プロトコルチートシート 日本語訳](oauth2.md)

### ASVS v11

- [暗号化ストレージチートシート 日本語訳](cryptographic-storage.md)
- [鍵管理チートシート 日本語訳](key-management.md)
- [シークレット管理チートシート 日本語訳](secrets-management.md)

### ASVS v12

- この章を主所属とするファイルはありません。関連ファイルは他章の主所属フォルダに置き、ASVS 章ページからリンクします。

### ASVS v13

- [Djangoセキュリティチートシート 日本語訳](django-security.md)
- [Dockerセキュリティチートシート 日本語訳](docker-security.md)

### ASVS v14

- [ユーザープライバシー保護チートシート 日本語訳](user-privacy-protection.md)

### ASVS v15

- [攻撃対象領域分析チートシート 日本語訳](attack-surface-analysis.md)
- [依存関係グラフとSBOMチートシート 日本語訳](dependency-graph-sbom.md)
- [マスアサインメントチートシート 日本語訳](mass-assignment.md)
- [NPMセキュリティチートシート 日本語訳](npm-security.md)
- [プロトタイプ汚染防止チートシート 日本語訳](prototype-pollution-prevention.md)
- [セキュアコードレビューチートシート 日本語訳](secure-code-review.md)
- [ソフトウェアサプライチェーンセキュリティチートシート 日本語訳](software-supply-chain-security.md)
- [脅威モデリングチートシート 日本語訳](threat-modeling.md)
- [仮想パッチ適用チートシート 日本語訳](virtual-patching.md)
- [脆弱な依存関係管理チートシート 日本語訳](vulnerable-dependency-management.md)

### ASVS v16

- [エラーハンドリングチートシート 日本語訳](error-handling.md)
- [ログ語彙チートシート 日本語訳](logging-vocabulary.md)

### ASVS v17

- この章を主所属とするファイルはありません。関連ファイルは他章の主所属フォルダに置き、ASVS 章ページからリンクします。
