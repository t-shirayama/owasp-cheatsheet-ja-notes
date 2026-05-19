# HTML5セキュリティチートシート 開発チェックリスト

## Attribution

- Original: HTML5 Security Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Development checklist added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../../translations/v3/html5-security.md](../../translations/v3/html5-security.md)
- 要約: [../../summaries/v3/html5-security.md](../../summaries/v3/html5-security.md)

## 開発チェックリスト

- [ ] localStorage/sessionStorageの利用を棚卸しする。
- [ ] postMessage受信時にoriginを確認する。
- [ ] CORSでワイルドカードを避ける。
- [ ] 機微APIの利用にユーザー同意と権限確認を行う。
- [ ] クライアント側データを期限付きで扱う。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V3, V14 | HTML5セキュリティチートシート の主要な管理策 |

