# XMLセキュリティチートシート 日本語訳

## Attribution

- Original: XML Security Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/XML_Security_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-20

## 関連ファイル

- 要約: [../summaries/xml-security.md](../summaries/xml-security.md)
- 開発チェックリスト: [../checklists/xml-security.md](../checklists/xml-security.md)

## 日本語訳

XML処理では、外部エンティティ、DTD、巨大入力、XPath、署名検証、スキーマ検証などのリスクがあります。パーサ設定と入力制限が重要です。

## 主要な観点

- DTDと外部エンティティを無効化する。
- XMLサイズと展開量を制限する。
- 署名やスキーマを正しく検証する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V1, V9 | XMLセキュリティチートシート の主要な管理策 |

