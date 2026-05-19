# マルチテナントセキュリティチートシート 日本語訳

## Attribution

- Original: Multi Tenant Security Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Multi_Tenant_Security_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-20

## 関連ファイル

- 要約: [../summaries/multi-tenant-security.md](../summaries/multi-tenant-security.md)
- 開発チェックリスト: [../checklists/multi-tenant-security.md](../checklists/multi-tenant-security.md)

## 日本語訳

マルチテナント環境では、テナント境界が主要なセキュリティ境界になります。データ分離、認可、設定、ログ、管理操作をテナント単位で制御します。

## 主要な観点

- すべてのデータアクセスにテナント境界を適用する。
- 管理者権限もテナント範囲を明確にする。
- ログと監査でテナントIDを扱う。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V8.4 | マルチテナントセキュリティチートシート の主要な管理策 |

