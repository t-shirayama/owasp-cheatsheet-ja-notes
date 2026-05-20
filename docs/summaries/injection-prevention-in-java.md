# Javaにおけるインジェクション防止チートシート 要約

## Attribution

- Original: Injection Prevention in Java Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Injection_Prevention_in_Java_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese summary added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../translations/injection-prevention-in-java.md](../translations/injection-prevention-in-java.md)
- 開発チェックリスト: [../checklists/injection-prevention-in-java.md](../checklists/injection-prevention-in-java.md)

## 概要

Javaアプリケーションでは、SQL、LDAP、XML、式言語、OSコマンドなど複数のインジェクション経路があります。安全なAPI選択とパラメータ化が基本です。

## 要点

- PreparedStatementや安全なORM利用を徹底する。
- LDAPやXPathも文字列連結を避ける。
- OSコマンド実行を原則避ける。

## 実装時の注意点

- この要約はASVS Indexでの利用を前提にした実装者向け整理です。詳細確認時は原文を参照してください。
- 関連する認証、認可、ログ、入力検証、暗号、通信保護の管理策と組み合わせて適用します。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V1.3 | Javaにおけるインジェクション防止チートシート の主要な管理策 |

