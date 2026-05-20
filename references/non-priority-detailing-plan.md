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
| Input Validation Cheat Sheet | すべての入力処理の基礎であり、他ページの前提になる。 | [../docs/translations/input-validation.md](../docs/translations/input-validation.md) |
| Injection Prevention Cheat Sheet | SQL/LDAP/OS コマンドなど複数の注入対策の入口になる。 | [../docs/translations/injection-prevention.md](../docs/translations/injection-prevention.md) |
| SQL Injection Prevention Cheat Sheet | 実装頻度と事故影響が大きい。 | [../docs/translations/sql-injection-prevention.md](../docs/translations/sql-injection-prevention.md) |
| File Upload Cheat Sheet | アップロード、保存、配信、マルウェア検査の失敗影響が大きい。 | [../docs/translations/file-upload.md](../docs/translations/file-upload.md) |
| GraphQL Cheat Sheet | API の過剰取得、認可、複雑度制御に直結する。 | [../docs/translations/graphql.md](../docs/translations/graphql.md) |
| Web Service Security Cheat Sheet | API とサービス間通信の補助ページとして重要。 | [../docs/translations/web-service-security.md](../docs/translations/web-service-security.md) |
| Microservices Security Cheat Sheet | サービス間認証、認可、シークレット、通信の横断リスクがある。 | [../docs/translations/microservices-security.md](../docs/translations/microservices-security.md) |
| Docker Security Cheat Sheet | コンテナ設定とサプライチェーンの運用リスクが高い。 | [../docs/translations/docker-security.md](../docs/translations/docker-security.md) |

## Wave 2: フロントエンド、トークン、XML、Java の実装リスク

| 対象 | 理由 | ローカルファイル |
| --- | --- | --- |
| CSRF Prevention Cheat Sheet | ブラウザ認証状態と状態変更操作に直結する。 | [../docs/translations/csrf-prevention.md](../docs/translations/csrf-prevention.md) |
| HTML5 Security Cheat Sheet | Web Storage、postMessage、CORS など実装差が大きい。 | [../docs/translations/html5-security.md](../docs/translations/html5-security.md) |
| Third Party JavaScript Management Cheat Sheet | 外部スクリプトとサプライチェーンの交差領域。 | [../docs/translations/third-party-javascript-management.md](../docs/translations/third-party-javascript-management.md) |
| JSON Web Token for Java Cheat Sheet | トークン検証、署名、期限、Java 実装に直結する。 | [../docs/translations/json-web-token-for-java.md](../docs/translations/json-web-token-for-java.md) |
| SAML Security Cheat Sheet | フェデレーション認証の署名検証、受信者検証、リプレイ対策に重要。 | [../docs/translations/saml-security.md](../docs/translations/saml-security.md) |
| XML Security Cheat Sheet | XXE、署名、XPath、パーサ設定の前提になる。 | [../docs/translations/xml-security.md](../docs/translations/xml-security.md) |
| XXE Prevention Cheat Sheet | XML パーサ設定の具体化が必要。 | [../docs/translations/xxe-prevention.md](../docs/translations/xxe-prevention.md) |
| Java Security Cheat Sheet | Java 固有の安全 API と設定に関係する。 | [../docs/translations/java-security.md](../docs/translations/java-security.md) |

## Wave 3: 業務ロジック、プライバシー、フレームワーク、運用補助

| 対象 | 理由 | ローカルファイル |
| --- | --- | --- |
| Abuse Case Cheat Sheet | 脅威モデリングと業務要件の橋渡しになる。 | [../docs/translations/abuse-case.md](../docs/translations/abuse-case.md) |
| Denial of Service Cheat Sheet | レート制限、資源枯渇、業務停止の横断観点になる。 | [../docs/translations/denial-of-service.md](../docs/translations/denial-of-service.md) |
| SSRF Prevention Cheat Sheet | クラウドメタデータ、内部ネットワーク到達性に直結する。 | [../docs/translations/ssrf-prevention.md](../docs/translations/ssrf-prevention.md) |
| Deserialization Cheat Sheet | RCE、型混同、信頼境界に関わる。 | [../docs/translations/deserialization.md](../docs/translations/deserialization.md) |
| Query Parameterization Cheat Sheet | SQL Injection の補完として実装タスク化しやすい。 | [../docs/translations/query-parameterization.md](../docs/translations/query-parameterization.md) |
| LDAP Injection Prevention Cheat Sheet | 認証/ディレクトリ連携の補助ページ。 | [../docs/translations/ldap-injection-prevention.md](../docs/translations/ldap-injection-prevention.md) |
| OS Command Injection Defense Cheat Sheet | コマンド実行境界と許可リスト設計に関わる。 | [../docs/translations/os-command-injection-defense.md](../docs/translations/os-command-injection-defense.md) |
| User Privacy Protection Cheat Sheet | データ最小化、保持、削除、目的外利用に関わる。 | [../docs/translations/user-privacy-protection.md](../docs/translations/user-privacy-protection.md) |
| Django Security Cheat Sheet | フレームワーク設定と既定防御の確認に使う。 | [../docs/translations/django-security.md](../docs/translations/django-security.md) |
| Browser Extension Vulnerabilities Cheat Sheet | ブラウザ拡張の権限、メッセージング、データ露出に関わる。 | [../docs/translations/browser-extension-vulnerabilities.md](../docs/translations/browser-extension-vulnerabilities.md) |

## 更新時の記録

- 詳細化したページは [source-map.md](source-map.md) の `状態` を `詳細化済み` にする。
- `備考` には `Non-priority detailing Wave N` を入れる。
- [todo.md](todo.md) には、Wave 単位またはページ単位の進行メモを追加する。
