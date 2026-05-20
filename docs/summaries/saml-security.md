# SAMLセキュリティチートシート 要約

## Attribution

- Original: SAML Security Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/SAML_Security_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese summary added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../translations/saml-security.md](../translations/saml-security.md)
- 開発チェックリスト: [../checklists/saml-security.md](../checklists/saml-security.md)

## 概要

SAMLはXMLベースの認証・連携プロトコルであり、署名検証、受信者、Audience、時刻、リプレイ防止、XML処理の安全性が重要です。

## 要点

- SAMLレスポンスとAssertionの署名を正しく検証する。
- Audience、Recipient、Destinationを検証する。
- リプレイと期限切れを防ぐ。

## 実装時の注意点

- この要約はASVS Indexでの利用を前提にした実装者向け整理です。詳細確認時は原文を参照してください。
- 関連する認証、認可、ログ、入力検証、暗号、通信保護の管理策と組み合わせて適用します。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V9.1 | SAMLセキュリティチートシート の主要な管理策 |

