# IDOR防止チートシート 開発チェックリスト

## Attribution

- Original: Insecure Direct Object Reference Prevention Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Development checklist added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../translations/idor-prevention.md](../translations/idor-prevention.md)
- 要約: [../summaries/idor-prevention.md](../summaries/idor-prevention.md)

## 開発チェックリスト

- [ ] 全IDパラメータを棚卸しする。
- [ ] オブジェクト取得前後で認可を確認する。
- [ ] 他ユーザーIDでアクセステストを行う。
- [ ] 一覧取得と詳細取得の認可を揃える。
- [ ] IDOR検知ログを記録する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V8.2 | IDOR防止チートシート の主要な管理策 |

