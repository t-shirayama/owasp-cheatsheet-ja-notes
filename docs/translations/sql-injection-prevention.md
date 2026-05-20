# SQLインジェクション防止チートシート 日本語訳

## Attribution

- Original: SQL Injection Prevention Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-20

## 関連ファイル

- 要約: [../summaries/sql-injection-prevention.md](../summaries/sql-injection-prevention.md)
- 開発チェックリスト: [../checklists/sql-injection-prevention.md](../checklists/sql-injection-prevention.md)

## 日本語訳

SQLインジェクションは、入力がSQL構文として解釈されることで発生します。パラメータ化クエリ、許可リスト、最小権限、エラー情報制御を組み合わせます。

## 主要な観点

- プリペアドステートメントを使う。
- 動的SQLを最小化する。
- DBアカウントを最小権限にする。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V1.2 | SQLインジェクション防止チートシート の主要な管理策 |

