# XMLセキュリティチートシート 要約

## Attribution

- Original: XML Security Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/XML_Security_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese summary added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../translations/xml-security.md](../translations/xml-security.md)
- 開発チェックリスト: [../checklists/xml-security.md](../checklists/xml-security.md)

## 概要

XML処理では、外部エンティティ、DTD、巨大入力、XPath、署名検証、スキーマ検証などのリスクがあります。パーサ設定と入力制限が重要です。

## 要点

- DTDと外部エンティティを無効化する。
- XMLサイズと展開量を制限する。
- 署名やスキーマを正しく検証する。

## 実装時の注意点

- この要約はASVS Indexでの利用を前提にした実装者向け整理です。詳細確認時は原文を参照してください。
- 関連する認証、認可、ログ、入力検証、暗号、通信保護の管理策と組み合わせて適用します。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V1, V9 | XMLセキュリティチートシート の主要な管理策 |

