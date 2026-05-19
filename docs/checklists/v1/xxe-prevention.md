# XXE防止チートシート 開発チェックリスト

## Attribution

- Original: XML External Entity Prevention Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/XML_External_Entity_Prevention_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Development checklist added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../../translations/v1/xxe-prevention.md](../../translations/v1/xxe-prevention.md)
- 要約: [../../summaries/v1/xxe-prevention.md](../../summaries/v1/xxe-prevention.md)

## 開発チェックリスト

- [ ] 利用XMLパーサを棚卸しする。
- [ ] パーサごとのXXE防止設定を有効化する。
- [ ] 外部DTD取得を禁止する。
- [ ] XMLアップロードやAPI入力でXXEテストを行う。
- [ ] パーサ設定を回帰テストで固定する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V1 | XXE防止チートシート の主要な管理策 |

