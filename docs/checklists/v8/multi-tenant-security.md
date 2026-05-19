# マルチテナントセキュリティチートシート 開発チェックリスト

## Attribution

- Original: Multi Tenant Security Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Multi_Tenant_Security_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Development checklist added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../../translations/v8/multi-tenant-security.md](../../translations/v8/multi-tenant-security.md)
- 要約: [../../summaries/v8/multi-tenant-security.md](../../summaries/v8/multi-tenant-security.md)

## 開発チェックリスト

- [ ] テナントコンテキストをリクエストの早い段階で確立する。
- [ ] テナントコンテキストを認証済みセッションまたは検証済みトークンから導出する。
- [ ] クライアント提供の `X-Tenant-ID`、クエリパラメータ、フォーム値を検証なしに信頼しない。
- [ ] すべてのテーブル、ストア、検索インデックス、キュー、キャッシュでテナント分離方式を定義する。
- [ ] データアクセス層で `tenant_id` 条件、複合キー、RLS、リポジトリ制約を強制する。
- [ ] 挿入時に現在テナントの `tenant_id` をサーバ側で設定し、別テナント ID の指定を拒否する。
- [ ] リソース取得、一覧、更新、削除で `tenant_id + resource_id` を使う。
- [ ] 他テナントのリソースは存在しないものとして扱い、存在有無を漏らさない。
- [ ] キャッシュキーにテナント識別子を含め、機微なテナントは別名前空間または別インスタンスに分離する。
- [ ] セッション、Cookie、CSRF トークン、リメンバートークンのテナント境界を確認する。
- [ ] ファイル、Blob、添付ファイルのパス、バケット、ACL、メタデータにテナント境界を適用する。
- [ ] テナント単位と利用者単位のレート制限を実装する。
- [ ] オンボーディング時に既定権限、鍵、ストレージ、ログ設定を安全に初期化する。
- [ ] オフボーディング時にアクセス失効、データ削除または保持、バックアップ、監査要件を処理する。
- [ ] テナント管理者とグローバル管理者の権限範囲を分離する。
- [ ] テナント ID、利用者、操作、対象リソース、認可失敗、境界違反を監査ログに記録する。
- [ ] テナント ID をログ出力する前に検証し、ログ注入や過剰な情報漏えいを防ぐ。
- [ ] テストで、他テナント ID 差し替え、キャッシュキー衝突、ファイルパス推測、管理者権限越境、レート制限迂回を検証する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V8.1 | テナントコンテキストを認証済みセッションから導出し、サーバ側で認可を強制する設計 |
| V8.2 | クロステナント IDOR、複合キー、データアクセス層でのテナントスコープ |
| V8.4 | テナント分離、共有リソース分離、管理者権限のテナント範囲制御 |
| V16.3 | テナント別の監査ログ、認可失敗、境界違反の検知 |

