# パスワードリセットチートシート 開発チェックリスト

## Attribution

- Original: Forgot Password Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Development checklist added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../../translations/v6/forgot-password.md](../../translations/v6/forgot-password.md)
- 要約: [../../summaries/v6/forgot-password.md](../../summaries/v6/forgot-password.md)

## 開発チェックリスト

- [ ] 同じ応答時間とメッセージでアカウント列挙を防ぐ。
- [ ] リセットトークンをハッシュ化して保存する。
- [ ] トークンに有効期限と一回限り利用を設定する。
- [ ] パスワード変更をユーザーへ通知する。
- [ ] 変更後に既存セッションを失効するか選択させる。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V6.3, V6.4, V6.6 | パスワードリセットチートシート の主要な管理策 |

