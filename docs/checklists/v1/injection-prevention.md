# インジェクション防止チートシート 開発チェックリスト

## Attribution

- Original: Injection Prevention Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Injection_Prevention_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Development checklist added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../../translations/v1/injection-prevention.md](../../translations/v1/injection-prevention.md)
- 要約: [../../summaries/v1/injection-prevention.md](../../summaries/v1/injection-prevention.md)

## 開発チェックリスト

- [ ] SQLやコマンドを文字列連結で作らない。
- [ ] パラメータ化クエリを使う。
- [ ] 許可リストで入力を検証する。
- [ ] 動的式評価を避ける。
- [ ] インジェクションテストをCIに含める。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V1 | インジェクション防止チートシート の主要な管理策 |

