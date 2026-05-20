# クエリパラメータ化チートシート 日本語訳

## Attribution

- Original: Query Parameterization Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Query_Parameterization_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-20

## 関連ファイル

- 要約: [../summaries/query-parameterization.md](../summaries/query-parameterization.md)
- 開発チェックリスト: [../checklists/query-parameterization.md](../checklists/query-parameterization.md)

## 日本語訳

クエリパラメータ化は、SQLなどのクエリ構造とデータ値を分離し、入力が命令として解釈されることを防ぐ基本対策です。

## 主要な観点

- プレースホルダとバインド変数を使う。
- 識別子やORDER BYなどパラメータ化できない箇所は許可リスト化する。
- ORM利用時も動的クエリ生成をレビューする。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V1.2 | クエリパラメータ化チートシート の主要な管理策 |

