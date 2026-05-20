# GraphQLチートシート 要約

## Attribution

- Original: GraphQL Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/GraphQL_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese summary added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../translations/graphql.md](../translations/graphql.md)
- 開発チェックリスト: [../checklists/graphql.md](../checklists/graphql.md)

## 概要

GraphQLでは、単一エンドポイントに複雑なクエリが集中するため、認可、クエリ複雑度、深さ制限、イントロスペクション、エラー応答、バッチ処理を制御します。

## 要点

- フィールドとオブジェクト単位で認可する。
- クエリ深さと複雑度を制限する。
- 詳細なエラーやスキーマ情報の露出を制御する。

## 実装時の注意点

- この要約はASVS Indexでの利用を前提にした実装者向け整理です。詳細確認時は原文を参照してください。
- 関連する認証、認可、ログ、入力検証、暗号、通信保護の管理策と組み合わせて適用します。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V4.3, V13.4 | GraphQLチートシート の主要な管理策 |

