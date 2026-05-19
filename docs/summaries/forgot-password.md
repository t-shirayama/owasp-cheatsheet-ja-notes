# パスワードリセットチートシート 要約

## Attribution

- Original: Forgot Password Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese summary added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../translations/forgot-password.md](../translations/forgot-password.md)
- 開発チェックリスト: [../checklists/forgot-password.md](../checklists/forgot-password.md)

## 概要

パスワードリセットはアカウント乗っ取りに直結する高リスク機能です。トークンの一意性、有効期限、通知、アカウント列挙防止、再認証を設計します。

## 要点

- アカウント存在有無を応答から推測させない。
- リセットトークンは十分にランダムで短寿命にする。
- パスワード変更後に既存セッションの扱いを決める。

## 実装時の注意点

- この要約はASVS Indexでの利用を前提にした実装者向け整理です。詳細確認時は原文を参照してください。
- 関連する認証、認可、ログ、入力検証、暗号、通信保護の管理策と組み合わせて適用します。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V6.3, V6.4, V6.6 | パスワードリセットチートシート の主要な管理策 |

