# XXE防止チートシート 要約

## Attribution

- Original: XML External Entity Prevention Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/XML_External_Entity_Prevention_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese summary added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../translations/xxe-prevention.md](../translations/xxe-prevention.md)
- 開発チェックリスト: [../checklists/xxe-prevention.md](../checklists/xxe-prevention.md)

## 概要

XXEは、XML外部エンティティによりローカルファイル読取、SSRF、DoSが発生する攻撃です。DTDと外部エンティティを無効化し、安全なパーサ設定を適用します。

## 要点

- 外部エンティティを無効化する。
- DTD処理を無効化または制限する。
- XML入力のサイズと取得先を制限する。

## 実装時の注意点

- この要約はASVS Indexでの利用を前提にした実装者向け整理です。詳細確認時は原文を参照してください。
- 関連する認証、認可、ログ、入力検証、暗号、通信保護の管理策と組み合わせて適用します。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V1 | XXE防止チートシート の主要な管理策 |

