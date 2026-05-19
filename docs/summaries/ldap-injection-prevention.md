# LDAPインジェクション防止チートシート 要約

## Attribution

- Original: LDAP Injection Prevention Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/LDAP_Injection_Prevention_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese summary added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../translations/ldap-injection-prevention.md](../translations/ldap-injection-prevention.md)
- 開発チェックリスト: [../checklists/ldap-injection-prevention.md](../checklists/ldap-injection-prevention.md)

## 概要

LDAPインジェクションは、ユーザー入力がLDAPフィルタやDNとして解釈されることで発生します。入力検証、エスケープ、最小権限のLDAPアカウントが重要です。

## 要点

- LDAPフィルタ値を適切にエスケープする。
- DNとして使う値も別途エスケープする。
- LDAP接続アカウントを最小権限にする。

## 実装時の注意点

- この要約はASVS Indexでの利用を前提にした実装者向け整理です。詳細確認時は原文を参照してください。
- 関連する認証、認可、ログ、入力検証、暗号、通信保護の管理策と組み合わせて適用します。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V1 | LDAPインジェクション防止チートシート の主要な管理策 |

