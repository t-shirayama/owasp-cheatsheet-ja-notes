# SSRF防止チートシート 開発チェックリスト

## Attribution

- Original: Server Side Request Forgery Prevention Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Development checklist added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../../translations/v1/ssrf-prevention.md](../../translations/v1/ssrf-prevention.md)
- 要約: [../../summaries/v1/ssrf-prevention.md](../../summaries/v1/ssrf-prevention.md)

## 開発チェックリスト

- [ ] URL入力を許可リストで検証する。
- [ ] プライベートIPやlocalhostを拒否する。
- [ ] リダイレクト後の送信先も検証する。
- [ ] DNS再解決やDNS rebindingを考慮する。
- [ ] アウトバウンド通信をネットワークで制限する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V1.3, V5.3, V13 | SSRF防止チートシート の主要な管理策 |

