# パスワードリセットチートシート 日本語訳

## Attribution

- Original: Forgot Password Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-20

## 関連ファイル

- 要約: [../summaries/forgot-password.md](../summaries/forgot-password.md)
- 開発チェックリスト: [../checklists/forgot-password.md](../checklists/forgot-password.md)

## 日本語訳

パスワードリセットはアカウント乗っ取りに直結する高リスク機能です。トークンの一意性、有効期限、通知、アカウント列挙防止、再認証を設計します。

## 主要な観点

- アカウント存在有無を応答から推測させない。
- リセットトークンは十分にランダムで短寿命にする。
- パスワード変更後に既存セッションの扱いを決める。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V6.3, V6.4, V6.6 | パスワードリセットチートシート の主要な管理策 |

