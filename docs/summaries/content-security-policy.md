# Content Security Policy チートシート 要約

## Attribution

- Original: Content Security Policy Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese summary added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../translations/content-security-policy.md](../translations/content-security-policy.md)
- 開発チェックリスト: [../checklists/content-security-policy.md](../checklists/content-security-policy.md)

## 概要

Content Security Policy は、ブラウザが読み込めるスクリプト、スタイル、画像、フレームなどの出所を制限し、XSSやコンテンツ注入の影響を下げる防御層です。

## 要点

- default-srcを基準に許可元を絞る。
- script-srcでunsafe-inlineや過剰なワイルドカードを避ける。
- report-onlyで検証してから強制モードへ移行する。

## 実装時の注意点

- この要約はASVS Indexでの利用を前提にした実装者向け整理です。詳細確認時は原文を参照してください。
- 関連する認証、認可、ログ、入力検証、暗号、通信保護の管理策と組み合わせて適用します。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V3.1 | Content Security Policy チートシート の主要な管理策 |

