# サービス拒否対策チートシート 要約

## Attribution

- Original: Denial of Service Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Denial_of_Service_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese summary added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../../translations/v2/denial-of-service.md](../../translations/v2/denial-of-service.md)
- 開発チェックリスト: [../../checklists/v2/denial-of-service.md](../../checklists/v2/denial-of-service.md)

## 概要

サービス拒否攻撃は、計算資源、メモリ、ストレージ、ネットワーク、外部依存を枯渇させます。レート制限、入力サイズ制限、タイムアウト、キュー制御、容量計画が必要です。

## 要点

- 高コスト処理を特定する。
- リクエスト量、サイズ、頻度を制限する。
- 外部依存とバックグラウンド処理の枯渇を防ぐ。

## 実装時の注意点

- この要約はASVS Indexでの利用を前提にした実装者向け整理です。詳細確認時は原文を参照してください。
- 関連する認証、認可、ログ、入力検証、暗号、通信保護の管理策と組み合わせて適用します。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V2.4 | サービス拒否対策チートシート の主要な管理策 |

