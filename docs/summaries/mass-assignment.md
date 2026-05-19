# マスアサインメントチートシート 要約

## Attribution

- Original: Mass Assignment Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Mass_Assignment_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese summary added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../translations/mass-assignment.md](../translations/mass-assignment.md)
- 開発チェックリスト: [../checklists/mass-assignment.md](../checklists/mass-assignment.md)

## 概要

マスアサインメント対策では、外部入力が内部モデルの予期しない属性を更新しないようにします。DTOや許可リストを使い、利用者が編集できるフィールドだけを明示します。

## 要点

- リクエストボディをドメインモデルへ直接バインドしない。
- DTO、フォームモデル、コマンドオブジェクトを使って編集可能フィールドを分離する。
- 許可リストを優先し、禁止リストだけに依存しない。
- 権限、所有者、状態、金額などのサーバ管理属性はクライアント入力から設定しない。

## 実装時の注意点

- ORMやMVCフレームワークの自動バインディング設定をレビューする。
- 管理者フラグやロールなどを追加したリクエストで権限昇格できないことをテストする。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V15.3 | フレームワークの安全な利用と入力バインディング制御 |

