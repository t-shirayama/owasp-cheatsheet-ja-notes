# IDOR防止チートシート 要約

## Attribution

- Original: Insecure Direct Object Reference Prevention Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese summary added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../translations/idor-prevention.md](../translations/idor-prevention.md)
- 開発チェックリスト: [../checklists/idor-prevention.md](../checklists/idor-prevention.md)

## 概要

IDORは、推測または改ざんしたIDで他者のオブジェクトへアクセスできる欠陥です。オブジェクト単位の認可を必ずサーバー側で実施します。

## 要点

- IDはすべて未信頼入力として扱う。
- 対象オブジェクトの所有者や権限を確認する。
- ランダムIDだけに依存しない。

## 実装時の注意点

- この要約はASVS Indexでの利用を前提にした実装者向け整理です。詳細確認時は原文を参照してください。
- 関連する認証、認可、ログ、入力検証、暗号、通信保護の管理策と組み合わせて適用します。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V8.2 | IDOR防止チートシート の主要な管理策 |

