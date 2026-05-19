# OAuth 2.0プロトコルチートシート 開発チェックリスト

## Attribution

- Original: OAuth 2.0 Protocol Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/OAuth2_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Development checklist added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../../translations/v10/oauth2.md](../../translations/v10/oauth2.md)
- 要約: [../../summaries/v10/oauth2.md](../../summaries/v10/oauth2.md)

## 開発チェックリスト

- [ ] PKCEを有効化する。
- [ ] リダイレクトURIを完全一致で検証する。
- [ ] stateでCSRFを防ぐ。
- [ ] スコープを最小化する。
- [ ] トークンの発行者、対象者、期限を検証する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V10 | OAuth 2.0プロトコルチートシート の主要な管理策 |

