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

- [ ] 全テーブルまたはストアでテナント分離を確認する。
- [ ] クエリにテナント条件が必ず入る設計にする。
- [ ] クロステナントアクセスをテストする。
- [ ] テナントIDをログに記録する。
- [ ] テナント削除とデータ保持方針を定義する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V8.4 | マルチテナントセキュリティチートシート の主要な管理策 |

