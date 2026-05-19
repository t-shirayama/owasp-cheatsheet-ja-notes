# 多要素認証チートシート 要約

## Attribution

- Original: Multifactor Authentication Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese summary added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../translations/multifactor-authentication.md](../translations/multifactor-authentication.md)
- 開発チェックリスト: [../checklists/multifactor-authentication.md](../checklists/multifactor-authentication.md)

## 概要

多要素認証は、パスワード漏えい時のアカウント侵害リスクを下げます。方式選択、登録、リカバリ、無効化、リスクベース適用が重要です。

## 要点

- フィッシング耐性の高い方式を優先する。
- MFA登録とリカバリを安全に設計する。
- 高リスク操作で追加認証を要求する。

## 実装時の注意点

- この要約はASVS Indexでの利用を前提にした実装者向け整理です。詳細確認時は原文を参照してください。
- 関連する認証、認可、ログ、入力検証、暗号、通信保護の管理策と組み合わせて適用します。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V6 | 多要素認証チートシート の主要な管理策 |

