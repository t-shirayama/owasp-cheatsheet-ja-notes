# NPMセキュリティチートシート 開発チェックリスト

## Attribution

- Original: NPM Security Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/NPM_Security_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Development checklist added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../../translations/v15/npm-security.md](../../translations/v15/npm-security.md)
- 要約: [../../summaries/v15/npm-security.md](../../summaries/v15/npm-security.md)

## 開発チェックリスト

- [ ] lockfileをコミットする。
- [ ] npm audit等で脆弱性を確認する。
- [ ] 不要なinstall scriptを警戒する。
- [ ] 公開トークンを最小権限にする。
- [ ] 依存関係追加時にメンテナンス状況を確認する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V15.2 | NPMセキュリティチートシート の主要な管理策 |

