# ブラウザ拡張機能脆弱性チートシート 開発チェックリスト

## Attribution

- Original: Browser Extension Vulnerabilities Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Browser_Extension_Vulnerabilities_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Development checklist added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../translations/browser-extension-vulnerabilities.md](../translations/browser-extension-vulnerabilities.md)
- 要約: [../summaries/browser-extension-vulnerabilities.md](../summaries/browser-extension-vulnerabilities.md)

## 開発チェックリスト

- [ ] manifestの権限を必要最小限にする。
- [ ] 外部メッセージの送信元を検証する。
- [ ] コンテンツスクリプトからの入力を検証する。
- [ ] 秘密情報を拡張機能ストレージへ不要に保存しない。
- [ ] 更新時に権限追加をレビューする。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V10.7 | ブラウザ拡張機能脆弱性チートシート の主要な管理策 |

