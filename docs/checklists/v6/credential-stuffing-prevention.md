# クレデンシャルスタッフィング防止チートシート 開発チェックリスト

## Attribution

- Original: Credential Stuffing Prevention Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Credential_Stuffing_Prevention_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Development checklist added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../../translations/v6/credential-stuffing-prevention.md](../../translations/v6/credential-stuffing-prevention.md)
- 要約: [../../summaries/v6/credential-stuffing-prevention.md](../../summaries/v6/credential-stuffing-prevention.md)

## 開発チェックリスト

- [ ] ログイン失敗率と成功率を監視する。
- [ ] IP、アカウント、デバイス単位でレート制限する。
- [ ] 漏えいパスワードチェックを導入する。
- [ ] 異常ログイン時に追加認証を要求する。
- [ ] 攻撃検知時の通知と対応手順を用意する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V6.1, V6.3 | クレデンシャルスタッフィング防止チートシート の主要な管理策 |

