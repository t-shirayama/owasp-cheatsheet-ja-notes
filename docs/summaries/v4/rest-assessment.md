# REST評価チートシート 要約

## Attribution

- Original: REST Assessment Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/REST_Assessment_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese summary added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../../translations/v4/rest-assessment.md](../../translations/v4/rest-assessment.md)
- 開発チェックリスト: [../../checklists/v4/rest-assessment.md](../../checklists/v4/rest-assessment.md)

## 概要

REST評価は、REST APIの認証、認可、入力検証、HTTPメソッド、ステータス、エラー、ログ、TLS、レート制限を体系的に確認する観点集です。

## 要点

- エンドポイント、メソッド、リソースを棚卸しする。
- 認証・認可・入力検証を操作単位で確認する。
- HTTP仕様とセキュリティヘッダーを確認する。

## 実装時の注意点

- この要約はASVS Indexでの利用を前提にした実装者向け整理です。詳細確認時は原文を参照してください。
- 関連する認証、認可、ログ、入力検証、暗号、通信保護の管理策と組み合わせて適用します。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V4.1 | REST評価チートシート の主要な管理策 |

