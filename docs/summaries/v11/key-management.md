# 鍵管理チートシート 要約

## Attribution

- Original: Key Management Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Key_Management_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese summary added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../../translations/v11/key-management.md](../../translations/v11/key-management.md)
- 開発チェックリスト: [../../checklists/v11/key-management.md](../../checklists/v11/key-management.md)

## 概要

鍵管理は、生成、保管、利用、ローテーション、失効、廃棄を含む暗号の中心的な運用です。暗号方式が強くても鍵管理が弱いと保護は破綻します。

## 要点

- 鍵を安全な乱数で生成する。
- 鍵をデータやコードから分離して保管する。
- ローテーションと失効手順を定義する。

## 実装時の注意点

- この要約はASVS Indexでの利用を前提にした実装者向け整理です。詳細確認時は原文を参照してください。
- 関連する認証、認可、ログ、入力検証、暗号、通信保護の管理策と組み合わせて適用します。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V11, V13 | 鍵管理チートシート の主要な管理策 |

