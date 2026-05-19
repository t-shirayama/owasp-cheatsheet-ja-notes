# Javaにおけるインジェクション防止チートシート 日本語訳

## Attribution

- Original: Injection Prevention in Java Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Injection_Prevention_in_Java_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-20

## 関連ファイル

- 要約: [../../summaries/v1/injection-prevention-in-java.md](../../summaries/v1/injection-prevention-in-java.md)
- 開発チェックリスト: [../../checklists/v1/injection-prevention-in-java.md](../../checklists/v1/injection-prevention-in-java.md)

## 日本語訳

Javaアプリケーションでは、SQL、LDAP、XML、式言語、OSコマンドなど複数のインジェクション経路があります。安全なAPI選択とパラメータ化が基本です。

## 主要な観点

- PreparedStatementや安全なORM利用を徹底する。
- LDAPやXPathも文字列連結を避ける。
- OSコマンド実行を原則避ける。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V1.3 | Javaにおけるインジェクション防止チートシート の主要な管理策 |

