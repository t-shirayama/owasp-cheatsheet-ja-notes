# パスワード保存チートシート 日本語訳

## Attribution

- Original: Password Storage Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-20

## 関連ファイル

- 要約: [../summaries/password-storage.md](../summaries/password-storage.md)
- 開発チェックリスト: [../checklists/password-storage.md](../checklists/password-storage.md)

## 日本語訳

パスワードは平文や高速ハッシュで保存せず、Argon2id、bcrypt、PBKDF2などのパスワードハッシュ関数とソルト、適切なコストで保護します。

## 主要な観点

- パスワード専用ハッシュ関数を使う。
- ユーザーごとの一意なソルトを使う。
- コストパラメータを運用環境に合わせる。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V6.5, V11.4 | パスワード保存チートシート の主要な管理策 |

