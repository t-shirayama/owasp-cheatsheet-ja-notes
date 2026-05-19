# CSRF防止チートシート 開発チェックリスト

## Attribution

- Original: Cross-Site Request Forgery Prevention Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Development checklist added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../translations/csrf-prevention.md](../translations/csrf-prevention.md)
- 要約: [../summaries/csrf-prevention.md](../summaries/csrf-prevention.md)

## 開発チェックリスト

- [ ] POST/PUT/PATCH/DELETEにCSRF対策を適用する。
- [ ] トークンをセッションまたはリクエストに安全に紐付ける。
- [ ] SameSite属性を用途に応じて設定する。
- [ ] 重要操作では再認証や追加確認を行う。
- [ ] CSRF対策を自動テストする。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V1.3, V3, V4 | CSRF防止チートシート の主要な管理策 |

