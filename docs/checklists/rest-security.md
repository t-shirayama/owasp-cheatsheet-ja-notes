# RESTセキュリティチートシート 開発チェックリスト

## Attribution

- Original: REST Security Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Development checklist added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../translations/rest-security.md](../translations/rest-security.md)
- 要約: [../summaries/rest-security.md](../summaries/rest-security.md)

## 開発チェックリスト

- [ ] すべてのAPIでHTTPSを強制する。
- [ ] 操作ごとに認可を実装する。
- [ ] JWTの署名、exp、iss、audを検証する。
- [ ] CORS許可元を制限する。
- [ ] APIエラーに内部情報を含めない。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V4, V9 | RESTセキュリティチートシート の主要な管理策 |

