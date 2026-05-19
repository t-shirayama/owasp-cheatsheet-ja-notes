# マルチテナントセキュリティチートシート 要約

## Attribution

- Original: Multi Tenant Security Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Multi_Tenant_Security_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese summary added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../translations/multi-tenant-security.md](../translations/multi-tenant-security.md)
- 開発チェックリスト: [../checklists/multi-tenant-security.md](../checklists/multi-tenant-security.md)

## 概要

マルチテナント環境では、テナント境界が主要なセキュリティ境界になります。データ分離、認可、設定、ログ、管理操作をテナント単位で制御します。

## 要点

- すべてのデータアクセスにテナント境界を適用する。
- 管理者権限もテナント範囲を明確にする。
- ログと監査でテナントIDを扱う。

## 実装時の注意点

- この要約はASVS Indexでの利用を前提にした実装者向け整理です。詳細確認時は原文を参照してください。
- 関連する認証、認可、ログ、入力検証、暗号、通信保護の管理策と組み合わせて適用します。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V8.4 | マルチテナントセキュリティチートシート の主要な管理策 |

