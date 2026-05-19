# XSSフィルタ回避チートシート 開発チェックリスト

## Attribution

- Original: XSS Filter Evasion Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/XSS_Filter_Evasion_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Development checklist added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../../translations/v1/xss-filter-evasion.md](../../translations/v1/xss-filter-evasion.md)
- 要約: [../../summaries/v1/xss-filter-evasion.md](../../summaries/v1/xss-filter-evasion.md)

## 開発チェックリスト

- [ ] 独自XSSフィルタを使っていないか確認する。
- [ ] テンプレート自動エスケープを有効化する。
- [ ] 危険なHTMLをサニタイザで処理する。
- [ ] イベント属性やjavascript: URLを禁止する。
- [ ] 代表的な回避ペイロードでテストする。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V1.2 | XSSフィルタ回避チートシート の主要な管理策 |

