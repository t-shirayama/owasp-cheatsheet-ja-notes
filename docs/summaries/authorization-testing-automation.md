# 認可テスト自動化チートシート 要約

## Attribution

- Original: Authorization Testing Automation Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Testing_Automation_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese summary added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../translations/authorization-testing-automation.md](../translations/authorization-testing-automation.md)
- 開発チェックリスト: [../checklists/authorization-testing-automation.md](../checklists/authorization-testing-automation.md)

## 概要

認可テスト自動化は、ユーザー、ロール、属性、対象リソース、操作の組み合わせを機械的に検証し、水平・垂直権限昇格を継続的に検出するための考え方です。

## 要点

- 許可される組み合わせと拒否される組み合わせを明示する。
- 他ユーザーのリソースや権限不足操作を自動テストする。
- CIで認可回帰を検出する。

## 実装時の注意点

- この要約はASVS Indexでの利用を前提にした実装者向け整理です。詳細確認時は原文を参照してください。
- 関連する認証、認可、ログ、入力検証、暗号、通信保護の管理策と組み合わせて適用します。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V8.1 | 認可テスト自動化チートシート の主要な管理策 |

