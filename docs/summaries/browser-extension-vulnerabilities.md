# ブラウザ拡張機能脆弱性チートシート 要約

## Attribution

- Original: Browser Extension Vulnerabilities Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Browser_Extension_Vulnerabilities_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese summary added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../translations/browser-extension-vulnerabilities.md](../translations/browser-extension-vulnerabilities.md)
- 開発チェックリスト: [../checklists/browser-extension-vulnerabilities.md](../checklists/browser-extension-vulnerabilities.md)

## 概要

ブラウザ拡張機能は通常のWebページより強い権限やブラウザAPIを扱うため、権限過多、メッセージ処理、コンテンツスクリプト、外部通信が主要なリスクになります。

## 要点

- 最小権限でmanifestを設計する。
- メッセージ送信元と内容を検証する。
- 外部ページやコンテンツスクリプトを信頼しない。

## 実装時の注意点

- この要約はASVS Indexでの利用を前提にした実装者向け整理です。詳細確認時は原文を参照してください。
- 関連する認証、認可、ログ、入力検証、暗号、通信保護の管理策と組み合わせて適用します。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V10.7 | ブラウザ拡張機能脆弱性チートシート の主要な管理策 |

