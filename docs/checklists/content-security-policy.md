# Content Security Policy チートシート 開発チェックリスト

## Attribution

- Original: Content Security Policy Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Development checklist added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../translations/content-security-policy.md](../translations/content-security-policy.md)
- 要約: [../summaries/content-security-policy.md](../summaries/content-security-policy.md)

## 開発チェックリスト

- [ ] CSPヘッダーを全HTML応答に設定する。
- [ ] script-srcの許可元を最小化する。
- [ ] nonceまたはhashを使ってインラインスクリプトを制御する。
- [ ] frame-ancestorsでクリックジャッキングを抑止する。
- [ ] CSP違反レポートを監視する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V3.1 | Content Security Policy チートシート の主要な管理策 |

