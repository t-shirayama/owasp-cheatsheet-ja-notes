# 認証チートシート 開発チェックリスト

## Attribution

- Original: Authentication Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Development checklist added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../../translations/v6/authentication.md](../../translations/v6/authentication.md)
- 要約: [../../summaries/v6/authentication.md](../../summaries/v6/authentication.md)

## 開発チェックリスト

- [ ] 認証失敗メッセージでアカウント存在を漏らさない。
- [ ] ログイン試行をレート制限する。
- [ ] MFAを高リスク操作に適用する。
- [ ] 認証成功と失敗を記録する。
- [ ] パスワードリセットを安全に実装する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V6 | 認証チートシート の主要な管理策 |

