# XSSフィルタ回避チートシート 要約

## Attribution

- Original: XSS Filter Evasion Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/XSS_Filter_Evasion_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese summary added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../../translations/v1/xss-filter-evasion.md](../../translations/v1/xss-filter-evasion.md)
- 開発チェックリスト: [../../checklists/v1/xss-filter-evasion.md](../../checklists/v1/xss-filter-evasion.md)

## 概要

XSSフィルタ回避は、単純なブラックリストや文字列置換が容易に迂回されることを示します。防御はフィルタではなくコンテキスト別エンコードと安全なサニタイズに置きます。

## 要点

- ブラックリスト型フィルタに依存しない。
- ブラウザのパース差異を前提に防御する。
- 出力コンテキストに合わせてエンコードする。

## 実装時の注意点

- この要約はASVS Indexでの利用を前提にした実装者向け整理です。詳細確認時は原文を参照してください。
- 関連する認証、認可、ログ、入力検証、暗号、通信保護の管理策と組み合わせて適用します。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V1.2 | XSSフィルタ回避チートシート の主要な管理策 |

