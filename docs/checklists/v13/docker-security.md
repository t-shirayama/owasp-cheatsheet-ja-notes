# Dockerセキュリティチートシート 開発チェックリスト

## Attribution

- Original: Docker Security Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Development checklist added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../../translations/v13/docker-security.md](../../translations/v13/docker-security.md)
- 要約: [../../summaries/v13/docker-security.md](../../summaries/v13/docker-security.md)

## 開発チェックリスト

- [ ] 信頼できるベースイメージを使う。
- [ ] イメージの脆弱性をスキャンする。
- [ ] 非rootユーザーで実行する。
- [ ] privilegedモードを避ける。
- [ ] シークレットをイメージに埋め込まない。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V13.2 | Dockerセキュリティチートシート の主要な管理策 |

