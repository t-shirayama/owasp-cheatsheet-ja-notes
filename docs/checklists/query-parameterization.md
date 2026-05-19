# クエリパラメータ化チートシート 開発チェックリスト

## Attribution

- Original: Query Parameterization Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Query_Parameterization_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Development checklist added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../translations/query-parameterization.md](../translations/query-parameterization.md)
- 要約: [../summaries/query-parameterization.md](../summaries/query-parameterization.md)

## 開発チェックリスト

- [ ] 全SQLでパラメータ化を使用する。
- [ ] 文字列連結SQLを禁止する。
- [ ] 動的な列名やソート条件を許可リスト化する。
- [ ] ストアドプロシージャの動的SQLをレビューする。
- [ ] SQLインジェクションテストを実施する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V1.2 | クエリパラメータ化チートシート の主要な管理策 |

