# Bean Validation チートシート 開発チェックリスト

## Attribution

- Original: Bean Validation Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Bean_Validation_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Development checklist added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../translations/bean-validation.md](../translations/bean-validation.md)
- 要約: [../summaries/bean-validation.md](../summaries/bean-validation.md)

## 開発チェックリスト

- [ ] DTOやフォームモデルに制約を定義する。
- [ ] サーバー側で必ず検証を実行する。
- [ ] カスタムバリデータをテストする。
- [ ] エラーメッセージに内部情報を含めない。
- [ ] 検証後の値も出力先に応じてエンコードする。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V1.2 | Bean Validation チートシート の主要な管理策 |

