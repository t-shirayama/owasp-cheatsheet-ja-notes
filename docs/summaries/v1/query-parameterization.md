# クエリパラメータ化チートシート 要約

## Attribution

- Original: Query Parameterization Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Query_Parameterization_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese summary added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../../translations/v1/query-parameterization.md](../../translations/v1/query-parameterization.md)
- 開発チェックリスト: [../../checklists/v1/query-parameterization.md](../../checklists/v1/query-parameterization.md)

## 概要

クエリパラメータ化は、SQLなどのクエリ構造とデータ値を分離し、入力が命令として解釈されることを防ぐ基本対策です。

## 要点

- プレースホルダとバインド変数を使う。
- 識別子やORDER BYなどパラメータ化できない箇所は許可リスト化する。
- ORM利用時も動的クエリ生成をレビューする。

## 実装時の注意点

- この要約はASVS Indexでの利用を前提にした実装者向け整理です。詳細確認時は原文を参照してください。
- 関連する認証、認可、ログ、入力検証、暗号、通信保護の管理策と組み合わせて適用します。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V1.2 | クエリパラメータ化チートシート の主要な管理策 |

