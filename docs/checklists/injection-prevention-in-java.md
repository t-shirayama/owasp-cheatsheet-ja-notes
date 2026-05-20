# Javaにおけるインジェクション防止チートシート 開発チェックリスト

## Attribution

- Original: Injection Prevention in Java Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Injection_Prevention_in_Java_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Development checklist added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../translations/injection-prevention-in-java.md](../translations/injection-prevention-in-java.md)
- 要約: [../summaries/injection-prevention-in-java.md](../summaries/injection-prevention-in-java.md)

## 開発チェックリスト

- [ ] JDBCでPreparedStatementを使う。
- [ ] JPQL/Criteria APIの安全な使い方を確認する。
- [ ] LDAPフィルタ値をエスケープする。
- [ ] XMLパーサ設定を安全化する。
- [ ] Runtime.exec等の利用をレビューする。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V1.3 | Javaにおけるインジェクション防止チートシート の主要な管理策 |

