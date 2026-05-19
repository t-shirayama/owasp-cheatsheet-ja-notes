# トランザクション認可チートシート 日本語訳

## Attribution

- Original: Transaction Authorization Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Transaction_Authorization_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-20

## 関連ファイル

- 要約: [../summaries/transaction-authorization.md](../summaries/transaction-authorization.md)
- 開発チェックリスト: [../checklists/transaction-authorization.md](../checklists/transaction-authorization.md)

## 日本語訳

トランザクション認可は、送金、購入、権限変更など高リスク操作を操作内容に紐づけて明示的に承認する仕組みです。

## 主要な観点

- 高リスク操作の内容をユーザーへ明示する。
- 操作内容に紐づいた承認を取得する。
- 承認イベントを監査可能にする。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V6.5, V8.3, V15.4 | トランザクション認可チートシート の主要な管理策 |

