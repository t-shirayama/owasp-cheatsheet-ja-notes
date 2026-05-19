# マスアサインメントチートシート 開発チェックリスト

## Attribution

- Original: Mass Assignment Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Mass_Assignment_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Development checklist added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../translations/mass-assignment.md](../translations/mass-assignment.md)
- 要約: [../summaries/mass-assignment.md](../summaries/mass-assignment.md)

## 開発チェックリスト

- [ ] リクエスト入力をエンティティやドメインモデルへ直接バインドしていないことを確認する。
- [ ] DTOやフォーム専用クラスに、利用者が編集可能なフィールドだけを定義する。
- [ ] フレームワークのバインダーに許可リストを設定する。
- [ ] `isAdmin`、`role`、`ownerId`、`status`、`balance`などのサーバ管理属性を入力から除外する。
- [ ] 禁止リストを使う場合でも、追加属性の見落としがないかレビューする。
- [ ] 許可されない属性を含むリクエストで権限昇格や改ざんが起きないことをテストする。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V15.3 | 安全なフレームワーク設定と自動バインディング制御 |

