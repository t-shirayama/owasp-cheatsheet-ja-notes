# ブラウザ拡張機能脆弱性チートシート 日本語訳

## Attribution

- Original: Browser Extension Vulnerabilities Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Browser_Extension_Vulnerabilities_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-20

## 関連ファイル

- 要約: [../../summaries/v10/browser-extension-vulnerabilities.md](../../summaries/v10/browser-extension-vulnerabilities.md)
- 開発チェックリスト: [../../checklists/v10/browser-extension-vulnerabilities.md](../../checklists/v10/browser-extension-vulnerabilities.md)

## 日本語訳

ブラウザ拡張機能は通常のWebページより強い権限やブラウザAPIを扱うため、権限過多、メッセージ処理、コンテンツスクリプト、外部通信が主要なリスクになります。

## 主要な観点

- 最小権限でmanifestを設計する。
- メッセージ送信元と内容を検証する。
- 外部ページやコンテンツスクリプトを信頼しない。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V10.7 | ブラウザ拡張機能脆弱性チートシート の主要な管理策 |

