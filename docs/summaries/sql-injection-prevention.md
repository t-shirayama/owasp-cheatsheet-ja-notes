# SQLインジェクション防止チートシート 要約

## Attribution

- Original: SQL Injection Prevention Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese summary added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../translations/sql-injection-prevention.md](../translations/sql-injection-prevention.md)
- 開発チェックリスト: [../checklists/sql-injection-prevention.md](../checklists/sql-injection-prevention.md)

## 概要

SQLインジェクションは、入力がSQL構文として解釈されることで発生します。パラメータ化クエリ、許可リスト、最小権限、エラー情報制御を組み合わせます。

## 要点

- プリペアドステートメントを使う。
- 動的SQLを最小化する。
- DBアカウントを最小権限にする。

## 実装時の注意点

- この要約はASVS Indexでの利用を前提にした実装者向け整理です。詳細確認時は原文を参照してください。
- 関連する認証、認可、ログ、入力検証、暗号、通信保護の管理策と組み合わせて適用します。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V1.2 | SQLインジェクション防止チートシート の主要な管理策 |

