# デシリアライゼーションチートシート 要約

## Attribution

- Original: Deserialization Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Deserialization_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese summary added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../translations/deserialization.md](../translations/deserialization.md)
- 開発チェックリスト: [../checklists/deserialization.md](../checklists/deserialization.md)

## 概要

安全でないデシリアライゼーションは、任意コード実行、認可迂回、データ改ざんにつながります。信頼できないデータをオブジェクトとして復元しない設計が基本です。

## 要点

- 信頼できない入力をデシリアライズしない。
- 許可リストで型を制限する。
- 署名や完全性検証で改ざんを検知する。

## 実装時の注意点

- この要約はASVS Indexでの利用を前提にした実装者向け整理です。詳細確認時は原文を参照してください。
- 関連する認証、認可、ログ、入力検証、暗号、通信保護の管理策と組み合わせて適用します。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V1.5 | デシリアライゼーションチートシート の主要な管理策 |

