# XSS防止チートシート 開発チェックリスト

## Attribution

- Original: Cross Site Scripting Prevention Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Development checklist added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../../translations/v1/xss-prevention.md](../../translations/v1/xss-prevention.md)
- 要約: [../../summaries/v1/xss-prevention.md](../../summaries/v1/xss-prevention.md)

## 開発チェックリスト

- [ ] テンプレートの自動エスケープを有効にする。
- [ ] 危険なDOM APIの利用をレビューする。
- [ ] HTML挿入が必要な場合はサニタイズする。
- [ ] CSPを防御層として設定する。
- [ ] XSSペイロードを含むテストを追加する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V1, V3 | XSS防止チートシート の主要な管理策 |

