# マスアサインメントチートシート 日本語訳

## Attribution

- Original: Mass Assignment Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Mass_Assignment_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-20

## 関連ファイル

- 要約: [../../summaries/v15/mass-assignment.md](../../summaries/v15/mass-assignment.md)
- 開発チェックリスト: [../../checklists/v15/mass-assignment.md](../../checklists/v15/mass-assignment.md)

## 日本語訳

マスアサインメントは、リクエストのパラメータをモデルやドメインオブジェクトへ自動的にバインドする機能が、利用者に編集を許可していない属性まで更新してしまう問題です。攻撃者は`isAdmin`、`role`、`accountBalance`などの隠れたフィールドをリクエストに追加し、権限昇格やデータ改ざんを狙います。

基本対策は、入力をドメインオブジェクトへ直接バインドしないことです。Data Transfer Object (DTO)やフォーム専用オブジェクトを使い、利用者が変更できるフィールドだけを含めます。フレームワークのバインディング機能を使う場合は、許可リスト(allowlist)で編集可能フィールドを明示します。禁止リスト(blocklist)は見落としに弱いため、許可リストを優先します。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V15.3 | 安全な入力バインディング、フレームワーク機能の安全な利用 |

