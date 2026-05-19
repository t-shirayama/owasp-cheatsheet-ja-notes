# 鍵管理チートシート 開発チェックリスト

## Attribution

- Original: Key Management Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Key_Management_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Development checklist added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../translations/key-management.md](../translations/key-management.md)
- 要約: [../summaries/key-management.md](../summaries/key-management.md)

## 開発チェックリスト

- [ ] 鍵生成にCSPRNGを使う。
- [ ] 鍵をソースコードに埋め込まない。
- [ ] KMSやHSMの利用を検討する。
- [ ] 鍵アクセス権を最小化する。
- [ ] 鍵ローテーションをテストする。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V11, V13 | 鍵管理チートシート の主要な管理策 |

