# クレデンシャルスタッフィング防止チートシート 日本語訳

## Attribution

- Original: Credential Stuffing Prevention Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Credential_Stuffing_Prevention_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-20

## 関連ファイル

- 要約: [../summaries/credential-stuffing-prevention.md](../summaries/credential-stuffing-prevention.md)
- 開発チェックリスト: [../checklists/credential-stuffing-prevention.md](../checklists/credential-stuffing-prevention.md)

## 日本語訳

クレデンシャルスタッフィングは、他サービスから漏えいしたIDとパスワードの組み合わせを用いてログインを試みる攻撃です。検知、レート制限、多要素認証、漏えいパスワード対策を組み合わせます。

## 主要な観点

- ログイン試行の速度と分布を監視する。
- 漏えい済みパスワードや弱いパスワードを拒否する。
- リスクに応じてMFAや追加確認を要求する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V6.1, V6.3 | クレデンシャルスタッフィング防止チートシート の主要な管理策 |

