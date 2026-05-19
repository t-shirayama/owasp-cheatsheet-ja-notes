# XSS防止チートシート 要約

## Attribution

- Original: Cross Site Scripting Prevention Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese summary added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../../translations/v1/xss-prevention.md](../../translations/v1/xss-prevention.md)
- 開発チェックリスト: [../../checklists/v1/xss-prevention.md](../../checklists/v1/xss-prevention.md)

## 概要

XSSは、信頼できないデータがブラウザでスクリプトとして解釈されることで発生します。出力コンテキストに応じたエンコード、HTMLサニタイズ、CSP、危険なDOM APIの回避が重要です。

## 要点

- 入力検証だけでなく出力エンコードを行う。
- HTML、属性、JavaScript、CSS、URLでエンコード方法を分ける。
- 信頼できないHTMLは安全なサニタイザで処理する。

## 実装時の注意点

- この要約はASVS Indexでの利用を前提にした実装者向け整理です。詳細確認時は原文を参照してください。
- 関連する認証、認可、ログ、入力検証、暗号、通信保護の管理策と組み合わせて適用します。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V1, V3 | XSS防止チートシート の主要な管理策 |

