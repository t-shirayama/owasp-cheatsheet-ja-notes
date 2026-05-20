# LDAPインジェクション防止チートシート 日本語訳

## Attribution

- Original: LDAP Injection Prevention Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/LDAP_Injection_Prevention_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-20

## 関連ファイル

- 要約: [../summaries/ldap-injection-prevention.md](../summaries/ldap-injection-prevention.md)
- 開発チェックリスト: [../checklists/ldap-injection-prevention.md](../checklists/ldap-injection-prevention.md)

## 日本語訳

LDAPインジェクションは、ユーザー入力がLDAPフィルタやDNとして解釈されることで発生します。入力検証、エスケープ、最小権限のLDAPアカウントが重要です。

## 主要な観点

- LDAPフィルタ値を適切にエスケープする。
- DNとして使う値も別途エスケープする。
- LDAP接続アカウントを最小権限にする。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V1 | LDAPインジェクション防止チートシート の主要な管理策 |

