# HSTSチートシート 開発チェックリスト

## Attribution

- Original: HTTP Strict Transport Security Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Strict_Transport_Security_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Development checklist added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../translations/http-strict-transport-security.md](../translations/http-strict-transport-security.md)
- 要約: [../summaries/http-strict-transport-security.md](../summaries/http-strict-transport-security.md)

## 開発チェックリスト

- [ ] Strict-Transport-Securityヘッダーを設定する。
- [ ] max-ageを段階的に伸ばす。
- [ ] サブドメイン影響を確認してincludeSubDomainsを設定する。
- [ ] preload申請前に全要件を確認する。
- [ ] HTTPS証明書とリダイレクトを監視する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V3, V12 | HSTSチートシート の主要な管理策 |

