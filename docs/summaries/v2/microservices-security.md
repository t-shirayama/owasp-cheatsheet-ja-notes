# マイクロサービスセキュリティチートシート 要約

## Attribution

- Original: Microservices Security Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Microservices_Security_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese summary added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../../translations/v2/microservices-security.md](../../translations/v2/microservices-security.md)
- 開発チェックリスト: [../../checklists/v2/microservices-security.md](../../checklists/v2/microservices-security.md)

## 概要

マイクロサービスでは、サービス間通信、認証、認可、設定、シークレット、可観測性、障害分離を分散環境で一貫して管理する必要があります。

## 要点

- サービス間通信を認証・暗号化する。
- 境界ごとに認可を実施する。
- 集中設定とシークレット管理を安全に行う。

## 実装時の注意点

- この要約はASVS Indexでの利用を前提にした実装者向け整理です。詳細確認時は原文を参照してください。
- 関連する認証、認可、ログ、入力検証、暗号、通信保護の管理策と組み合わせて適用します。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V2.2, V11.7 | マイクロサービスセキュリティチートシート の主要な管理策 |

