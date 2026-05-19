# パスワード保存チートシート 要約

## Attribution

- Original: Password Storage Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese summary added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../translations/password-storage.md](../translations/password-storage.md)
- 開発チェックリスト: [../checklists/password-storage.md](../checklists/password-storage.md)

## 概要

パスワードは平文や高速ハッシュで保存せず、Argon2id、bcrypt、PBKDF2などのパスワードハッシュ関数とソルト、適切なコストで保護します。

## 要点

- パスワード専用ハッシュ関数を使う。
- ユーザーごとの一意なソルトを使う。
- コストパラメータを運用環境に合わせる。

## 実装時の注意点

- この要約はASVS Indexでの利用を前提にした実装者向け整理です。詳細確認時は原文を参照してください。
- 関連する認証、認可、ログ、入力検証、暗号、通信保護の管理策と組み合わせて適用します。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V6.5, V11.4 | パスワード保存チートシート の主要な管理策 |

