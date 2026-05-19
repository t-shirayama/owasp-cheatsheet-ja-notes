# RESTセキュリティチートシート 日本語訳

## Attribution

- Original: REST Security Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-20

## 関連ファイル

- 要約: [../../summaries/v4/rest-security.md](../../summaries/v4/rest-security.md)
- 開発チェックリスト: [../../checklists/v4/rest-security.md](../../checklists/v4/rest-security.md)

## 日本語訳

REST APIでは、TLS、認証、認可、入力検証、JWT、CORS、HTTPメソッド制御、エラー処理、ログが主要な防御領域です。

## 主要な観点

- API境界ですべての入力と権限を検証する。
- JWTやトークンの署名・期限・発行者を検証する。
- CORSとHTTPメソッドを必要最小限にする。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V4, V9 | RESTセキュリティチートシート の主要な管理策 |

