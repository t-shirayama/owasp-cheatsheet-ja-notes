# トランザクション認可チートシート 開発チェックリスト

## Attribution

- Original: Transaction Authorization Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Transaction_Authorization_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Development checklist added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../../translations/v6/transaction-authorization.md](../../translations/v6/transaction-authorization.md)
- 要約: [../../summaries/v6/transaction-authorization.md](../../summaries/v6/transaction-authorization.md)

## 開発チェックリスト

- [ ] 高リスク操作を定義する。
- [ ] 操作内容を改ざんされない形で承認対象にする。
- [ ] 追加認証または署名を要求する。
- [ ] 承認結果をログに記録する。
- [ ] リプレイや二重実行を防ぐ。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V6.5, V8.3, V15.4 | トランザクション認可チートシート の主要な管理策 |

