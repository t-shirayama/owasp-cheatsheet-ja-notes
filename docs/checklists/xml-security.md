# XMLセキュリティチートシート 開発チェックリスト

## Attribution

- Original: XML Security Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/XML_Security_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Development checklist added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../translations/xml-security.md](../translations/xml-security.md)
- 要約: [../summaries/xml-security.md](../summaries/xml-security.md)

## 開発チェックリスト

- [ ] XMLパーサの安全設定を確認する。
- [ ] 外部エンティティを無効化する。
- [ ] DTD処理を無効化または制限する。
- [ ] XPathに入力を連結しない。
- [ ] 巨大XMLやエンティティ展開攻撃をテストする。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V1, V9 | XMLセキュリティチートシート の主要な管理策 |

