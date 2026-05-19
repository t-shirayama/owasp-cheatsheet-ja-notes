# RESTセキュリティチートシート 要約

## Attribution

- Original: REST Security Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese summary added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../translations/rest-security.md](../translations/rest-security.md)
- 開発チェックリスト: [../checklists/rest-security.md](../checklists/rest-security.md)

## 概要

REST APIでは、TLS、認証、認可、入力検証、JWT、CORS、HTTPメソッド制御、エラー処理、ログが主要な防御領域です。

## 要点

- API境界ですべての入力と権限を検証する。
- JWTやトークンの署名・期限・発行者を検証する。
- CORSとHTTPメソッドを必要最小限にする。

## 実装時の注意点

- この要約はASVS Indexでの利用を前提にした実装者向け整理です。詳細確認時は原文を参照してください。
- 関連する認証、認可、ログ、入力検証、暗号、通信保護の管理策と組み合わせて適用します。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V4, V9 | RESTセキュリティチートシート の主要な管理策 |

