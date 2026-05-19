# Content Security Policy チートシート 日本語訳

## Attribution

- Original: Content Security Policy Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-20

## 関連ファイル

- 要約: [../../summaries/v3/content-security-policy.md](../../summaries/v3/content-security-policy.md)
- 開発チェックリスト: [../../checklists/v3/content-security-policy.md](../../checklists/v3/content-security-policy.md)

## 日本語訳

Content Security Policy は、ブラウザが読み込めるスクリプト、スタイル、画像、フレームなどの出所を制限し、XSSやコンテンツ注入の影響を下げる防御層です。

## 主要な観点

- default-srcを基準に許可元を絞る。
- script-srcでunsafe-inlineや過剰なワイルドカードを避ける。
- report-onlyで検証してから強制モードへ移行する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V3.1 | Content Security Policy チートシート の主要な管理策 |

