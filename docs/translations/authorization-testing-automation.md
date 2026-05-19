# 認可テスト自動化チートシート 日本語訳

## Attribution

- Original: Authorization Testing Automation Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Testing_Automation_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-20

## 関連ファイル

- 要約: [../summaries/authorization-testing-automation.md](../summaries/authorization-testing-automation.md)
- 開発チェックリスト: [../checklists/authorization-testing-automation.md](../checklists/authorization-testing-automation.md)

## 日本語訳

認可テスト自動化は、ユーザー、ロール、属性、対象リソース、操作の組み合わせを機械的に検証し、水平・垂直権限昇格を継続的に検出するための考え方です。

## 主要な観点

- 許可される組み合わせと拒否される組み合わせを明示する。
- 他ユーザーのリソースや権限不足操作を自動テストする。
- CIで認可回帰を検出する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V8.1 | 認可テスト自動化チートシート の主要な管理策 |

