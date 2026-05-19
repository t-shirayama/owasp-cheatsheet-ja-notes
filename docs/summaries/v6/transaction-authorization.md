# トランザクション認可チートシート 要約

## Attribution

- Original: Transaction Authorization Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Transaction_Authorization_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese summary added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../../translations/v6/transaction-authorization.md](../../translations/v6/transaction-authorization.md)
- 開発チェックリスト: [../../checklists/v6/transaction-authorization.md](../../checklists/v6/transaction-authorization.md)

## 概要

トランザクション認可は、送金、購入、権限変更など高リスク操作を操作内容に紐づけて明示的に承認する仕組みです。

## 要点

- 高リスク操作の内容をユーザーへ明示する。
- 操作内容に紐づいた承認を取得する。
- 承認イベントを監査可能にする。

## 実装時の注意点

- この要約はASVS Indexでの利用を前提にした実装者向け整理です。詳細確認時は原文を参照してください。
- 関連する認証、認可、ログ、入力検証、暗号、通信保護の管理策と組み合わせて適用します。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V6.5, V8.3, V15.4 | トランザクション認可チートシート の主要な管理策 |

