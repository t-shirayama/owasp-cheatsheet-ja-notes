# 入力検証チートシート 開発チェックリスト

## Attribution

- Original: Input Validation Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Development checklist added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../../translations/v1/input-validation.md](../../translations/v1/input-validation.md)
- 要約: [../../summaries/v1/input-validation.md](../../summaries/v1/input-validation.md)

## 開発チェックリスト

- [ ] 全入力点を棚卸しする。
- [ ] 型、長さ、範囲、形式を定義する。
- [ ] 許可リストで検証する。
- [ ] ファイルやJSONなど構造化入力も検証する。
- [ ] 検証失敗を安全にログ記録する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V1, V2, V5 | 入力検証チートシート の主要な管理策 |

