# GraphQLチートシート 日本語訳

## Attribution

- Original: GraphQL Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/GraphQL_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-20

## 関連ファイル

- 要約: [../summaries/graphql.md](../summaries/graphql.md)
- 開発チェックリスト: [../checklists/graphql.md](../checklists/graphql.md)

## 日本語訳

GraphQLでは、単一エンドポイントに複雑なクエリが集中するため、認可、クエリ複雑度、深さ制限、イントロスペクション、エラー応答、バッチ処理を制御します。

## 主要な観点

- フィールドとオブジェクト単位で認可する。
- クエリ深さと複雑度を制限する。
- 詳細なエラーやスキーマ情報の露出を制御する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V4.3, V13.4 | GraphQLチートシート の主要な管理策 |

