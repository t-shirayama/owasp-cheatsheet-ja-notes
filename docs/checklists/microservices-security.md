# マイクロサービスセキュリティチートシート 開発チェックリスト

## Attribution

- Original: Microservices Security Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Microservices_Security_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Development checklist added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../translations/microservices-security.md](../translations/microservices-security.md)
- 要約: [../summaries/microservices-security.md](../summaries/microservices-security.md)

## 開発チェックリスト

- [ ] サービス間通信にTLSを使う。
- [ ] サービスIDを認証する。
- [ ] APIごとに認可を実施する。
- [ ] シークレットを安全なストアで管理する。
- [ ] 分散ログとトレースで監査可能にする。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V2.2, V11.7 | マイクロサービスセキュリティチートシート の主要な管理策 |

