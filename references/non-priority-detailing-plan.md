# Non-Priority Detailing Plan

この計画は、高優先度レビュー対象外として残っている ASVS Index coverage の短い翻訳、要約、チェックリストを、段階的に詳細化するための優先順位表です。

## 完了条件

- 対象 Cheat Sheet の公式原文を確認する。
- 翻訳、要約、チェックリストの3ファイルを、原文の主要セクションに沿って更新する。
- チェックリストを Issue 化できる粒度へ分割する。
- ASVS 対応を可能な範囲で `Vx.y` 単位へ細分化する。
- [source-map.md](source-map.md) の状態と備考を更新する。
- Markdown lint と link checker を実行する。

## Wave 1: 入力、API、構成の実装リスクが高いページ

| 対象 | 理由 | ローカルファイル |
| --- | --- | --- |
| Input Validation Cheat Sheet | すべての入力処理の基礎であり、他ページの前提になる。 | [../docs/translations/v1/input-validation.md](../docs/translations/v1/input-validation.md) |
| Injection Prevention Cheat Sheet | SQL/LDAP/OS コマンドなど複数の注入対策の入口になる。 | [../docs/translations/v1/injection-prevention.md](../docs/translations/v1/injection-prevention.md) |
| SQL Injection Prevention Cheat Sheet | 実装頻度と事故影響が大きい。 | [../docs/translations/v1/sql-injection-prevention.md](../docs/translations/v1/sql-injection-prevention.md) |
| File Upload Cheat Sheet | アップロード、保存、配信、マルウェア検査の失敗影響が大きい。 | [../docs/translations/v1/file-upload.md](../docs/translations/v1/file-upload.md) |
| GraphQL Cheat Sheet | API の過剰取得、認可、複雑度制御に直結する。 | [../docs/translations/v4/graphql.md](../docs/translations/v4/graphql.md) |
| Web Service Security Cheat Sheet | API とサービス間通信の補助ページとして重要。 | [../docs/translations/v2/web-service-security.md](../docs/translations/v2/web-service-security.md) |
| Microservices Security Cheat Sheet | サービス間認証、認可、シークレット、通信の横断リスクがある。 | [../docs/translations/v2/microservices-security.md](../docs/translations/v2/microservices-security.md) |
| Docker Security Cheat Sheet | コンテナ設定とサプライチェーンの運用リスクが高い。 | [../docs/translations/v13/docker-security.md](../docs/translations/v13/docker-security.md) |

## Wave 2: フロントエンド、トークン、XML、Java の実装リスク

| 対象 | 理由 | ローカルファイル |
| --- | --- | --- |
| CSRF Prevention Cheat Sheet | ブラウザ認証状態と状態変更操作に直結する。 | [../docs/translations/v1/csrf-prevention.md](../docs/translations/v1/csrf-prevention.md) |
| HTML5 Security Cheat Sheet | Web Storage、postMessage、CORS など実装差が大きい。 | [../docs/translations/v3/html5-security.md](../docs/translations/v3/html5-security.md) |
| Third Party JavaScript Management Cheat Sheet | 外部スクリプトとサプライチェーンの交差領域。 | [../docs/translations/v3/third-party-javascript-management.md](../docs/translations/v3/third-party-javascript-management.md) |
| JSON Web Token for Java Cheat Sheet | トークン検証、署名、期限、Java 実装に直結する。 | [../docs/translations/v9/json-web-token-for-java.md](../docs/translations/v9/json-web-token-for-java.md) |
| SAML Security Cheat Sheet | フェデレーション認証の署名検証、受信者検証、リプレイ対策に重要。 | [../docs/translations/v9/saml-security.md](../docs/translations/v9/saml-security.md) |
| XML Security Cheat Sheet | XXE、署名、XPath、パーサ設定の前提になる。 | [../docs/translations/v1/xml-security.md](../docs/translations/v1/xml-security.md) |
| XXE Prevention Cheat Sheet | XML パーサ設定の具体化が必要。 | [../docs/translations/v1/xxe-prevention.md](../docs/translations/v1/xxe-prevention.md) |
| Java Security Cheat Sheet | Java 固有の安全 API と設定に関係する。 | [../docs/translations/v1/java-security.md](../docs/translations/v1/java-security.md) |

## Wave 3: 業務ロジック、プライバシー、フレームワーク、運用補助

| 対象 | 理由 | ローカルファイル |
| --- | --- | --- |
| Abuse Case Cheat Sheet | 脅威モデリングと業務要件の橋渡しになる。 | [../docs/translations/v2/abuse-case.md](../docs/translations/v2/abuse-case.md) |
| Denial of Service Cheat Sheet | レート制限、資源枯渇、業務停止の横断観点になる。 | [../docs/translations/v2/denial-of-service.md](../docs/translations/v2/denial-of-service.md) |
| SSRF Prevention Cheat Sheet | クラウドメタデータ、内部ネットワーク到達性に直結する。 | [../docs/translations/v1/ssrf-prevention.md](../docs/translations/v1/ssrf-prevention.md) |
| Deserialization Cheat Sheet | RCE、型混同、信頼境界に関わる。 | [../docs/translations/v1/deserialization.md](../docs/translations/v1/deserialization.md) |
| Query Parameterization Cheat Sheet | SQL Injection の補完として実装タスク化しやすい。 | [../docs/translations/v1/query-parameterization.md](../docs/translations/v1/query-parameterization.md) |
| LDAP Injection Prevention Cheat Sheet | 認証/ディレクトリ連携の補助ページ。 | [../docs/translations/v1/ldap-injection-prevention.md](../docs/translations/v1/ldap-injection-prevention.md) |
| OS Command Injection Defense Cheat Sheet | コマンド実行境界と許可リスト設計に関わる。 | [../docs/translations/v1/os-command-injection-defense.md](../docs/translations/v1/os-command-injection-defense.md) |
| User Privacy Protection Cheat Sheet | データ最小化、保持、削除、目的外利用に関わる。 | [../docs/translations/v14/user-privacy-protection.md](../docs/translations/v14/user-privacy-protection.md) |
| Django Security Cheat Sheet | フレームワーク設定と既定防御の確認に使う。 | [../docs/translations/v13/django-security.md](../docs/translations/v13/django-security.md) |
| Browser Extension Vulnerabilities Cheat Sheet | ブラウザ拡張の権限、メッセージング、データ露出に関わる。 | [../docs/translations/v10/browser-extension-vulnerabilities.md](../docs/translations/v10/browser-extension-vulnerabilities.md) |

## 更新時の記録

- 詳細化したページは [source-map.md](source-map.md) の `状態` を `詳細化済み` にする。
- `備考` には `Non-priority detailing Wave N` を入れる。
- [todo.md](todo.md) には、Wave 単位またはページ単位の進行メモを追加する。
