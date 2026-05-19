# XSSフィルタ回避チートシート 日本語訳

## Attribution

- Original: XSS Filter Evasion Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/XSS_Filter_Evasion_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-20

## 関連ファイル

- 要約: [../../summaries/v1/xss-filter-evasion.md](../../summaries/v1/xss-filter-evasion.md)
- 開発チェックリスト: [../../checklists/v1/xss-filter-evasion.md](../../checklists/v1/xss-filter-evasion.md)

## 日本語訳

XSSフィルタ回避は、単純なブラックリストや文字列置換が容易に迂回されることを示します。防御はフィルタではなくコンテキスト別エンコードと安全なサニタイズに置きます。

## 主要な観点

- ブラックリスト型フィルタに依存しない。
- ブラウザのパース差異を前提に防御する。
- 出力コンテキストに合わせてエンコードする。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V1.2 | XSSフィルタ回避チートシート の主要な管理策 |

