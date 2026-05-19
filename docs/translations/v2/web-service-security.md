# Webサービスセキュリティチートシート 日本語訳

## Attribution

- Original: Web Service Security Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Web_Service_Security_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-20

## 関連ファイル

- 要約: [../../summaries/v2/web-service-security.md](../../summaries/v2/web-service-security.md)
- 開発チェックリスト: [../../checklists/v2/web-service-security.md](../../checklists/v2/web-service-security.md)

## 日本語訳

Webサービスでは、認証、認可、入力検証、メッセージ整合性、TLS、エラー応答、ログをAPI境界で一貫して実装します。

## 主要な観点

- すべてのサービス入口を認証・認可する。
- メッセージ構造とサイズを検証する。
- 安全な通信と監査ログを確保する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V2.2, V4 | Webサービスセキュリティチートシート の主要な管理策 |

