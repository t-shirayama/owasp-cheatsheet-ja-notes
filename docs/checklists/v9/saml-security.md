# SAMLセキュリティチートシート 開発チェックリスト

## Attribution

- Original: SAML Security Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/SAML_Security_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Development checklist added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../../translations/v9/saml-security.md](../../translations/v9/saml-security.md)
- 要約: [../../summaries/v9/saml-security.md](../../summaries/v9/saml-security.md)

## 開発チェックリスト

- [ ] 署名検証を必須にする。
- [ ] 信頼するIdP証明書を固定する。
- [ ] AudienceとRecipientを検証する。
- [ ] NotBefore/NotOnOrAfterを検証する。
- [ ] SAML IDの再利用を検知する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V9.1 | SAMLセキュリティチートシート の主要な管理策 |

