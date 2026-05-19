# Webサービスセキュリティチートシート 開発チェックリスト

## Attribution

- Original: Web Service Security Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Web_Service_Security_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Development checklist added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../translations/web-service-security.md](../translations/web-service-security.md)
- 要約: [../summaries/web-service-security.md](../summaries/web-service-security.md)

## 開発チェックリスト

- [ ] 公開APIと内部APIを棚卸しする。
- [ ] API認証を必須にする。
- [ ] 操作ごとに認可を実装する。
- [ ] リクエスト構造とサイズを検証する。
- [ ] 詳細な内部エラーを返さない。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V2.2, V4 | Webサービスセキュリティチートシート の主要な管理策 |

