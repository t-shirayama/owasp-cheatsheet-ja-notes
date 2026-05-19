# SQLインジェクション防止チートシート 開発チェックリスト

## Attribution

- Original: SQL Injection Prevention Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Development checklist added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../../translations/v1/sql-injection-prevention.md](../../translations/v1/sql-injection-prevention.md)
- 要約: [../../summaries/v1/sql-injection-prevention.md](../../summaries/v1/sql-injection-prevention.md)

## 開発チェックリスト

- [ ] ユーザー入力をSQL文字列へ連結しない。
- [ ] 全クエリでバインド変数を使う。
- [ ] 動的識別子を許可リスト化する。
- [ ] DBエラー詳細をユーザーへ返さない。
- [ ] DBユーザー権限を最小化する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V1.2 | SQLインジェクション防止チートシート の主要な管理策 |

