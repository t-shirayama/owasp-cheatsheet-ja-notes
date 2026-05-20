# SAMLセキュリティチートシート 日本語訳

## Attribution

- Original: SAML Security Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/SAML_Security_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-20

## 日本語訳

SAMLはXMLベースの認証・連携プロトコルであり、署名検証、受信者、Audience、時刻、リプレイ防止、XML処理の安全性が重要です。

## 主要な観点

- SAMLレスポンスとAssertionの署名を正しく検証する。
- Audience、Recipient、Destinationを検証する。
- リプレイと期限切れを防ぐ。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V9.1 | SAMLセキュリティチートシート の主要な管理策 |

