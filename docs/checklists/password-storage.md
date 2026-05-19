# パスワード保存チートシート 開発チェックリスト

## Attribution

- Original: Password Storage Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Development checklist added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../translations/password-storage.md](../translations/password-storage.md)
- 要約: [../summaries/password-storage.md](../summaries/password-storage.md)

## 開発チェックリスト

- [ ] 平文パスワードを保存しない。
- [ ] 一般ハッシュ関数単体を使わない。
- [ ] Argon2idなど推奨方式を使う。
- [ ] ソルトを一意に生成する。
- [ ] ハッシュ方式の移行計画を用意する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V6.5, V11.4 | パスワード保存チートシート の主要な管理策 |

