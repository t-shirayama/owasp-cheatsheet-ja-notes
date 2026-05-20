# マルチテナントセキュリティチートシート 要約

## Attribution

- Original: Multi Tenant Security Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Multi_Tenant_Security_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese summary added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../translations/multi-tenant-security.md](../translations/multi-tenant-security.md)
- 開発チェックリスト: [../checklists/multi-tenant-security.md](../checklists/multi-tenant-security.md)

## 概要

マルチテナント環境では、テナント境界が主要なセキュリティ境界である。認証済みセッションからテナントコンテキストを確立し、データベース、キャッシュ、セッション、ファイル、API、管理操作、監査ログのすべてでテナント分離を強制する。

## 要点

- クライアント提供のテナント ID をそのまま信頼しない。
- テナントコンテキストをリクエストの早い段階で確立し、全レイヤへ安全に伝播する。
- データアクセス層で `tenant_id` 条件、複合キー、RLS などを強制する。
- リソース取得では `tenant_id + resource_id` を使い、他テナントの存在を漏らさない。
- キャッシュキー、セッション、ファイル、Blob、キュー、検索インデックスにもテナント分離を適用する。
- テナント単位と利用者単位のレート制限でノイジーネイバーを抑える。
- オンボーディングとオフボーディングで、権限、鍵、データ保持、削除、バックアップ、監査要件を管理する。
- テナント ID、利用者、対象リソース、認可失敗、境界違反を監査ログに記録する。

## 実装時の注意点

- API 層だけのテナントチェックは漏れやすい。リポジトリ層、ORM フック、DB RLS などで構造的に強制する。
- 共有キャッシュや共有キューは、データベースより見落とされやすいクロステナント漏えい経路である。
- 管理者権限にもテナント範囲を持たせ、グローバル管理者機能は分離して監査する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V8.1 | テナントコンテキストを認証済みセッションから導出し、サーバ側で認可を強制する設計 |
| V8.2 | クロステナント IDOR、複合キー、データアクセス層でのテナントスコープ |
| V8.4 | テナント分離、共有リソース分離、管理者権限のテナント範囲制御 |
| V16.3 | テナント別の監査ログ、認可失敗、境界違反の検知 |

