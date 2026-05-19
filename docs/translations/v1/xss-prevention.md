# XSS防止チートシート 日本語訳

## Attribution

- Original: Cross Site Scripting Prevention Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-20

## 関連ファイル

- 要約: [../../summaries/v1/xss-prevention.md](../../summaries/v1/xss-prevention.md)
- 開発チェックリスト: [../../checklists/v1/xss-prevention.md](../../checklists/v1/xss-prevention.md)

## 日本語訳

XSSは、信頼できないデータがブラウザでスクリプトとして解釈されることで発生します。出力コンテキストに応じたエンコード、HTMLサニタイズ、CSP、危険なDOM APIの回避が重要です。

## 主要な観点

- 入力検証だけでなく出力エンコードを行う。
- HTML、属性、JavaScript、CSS、URLでエンコード方法を分ける。
- 信頼できないHTMLは安全なサニタイザで処理する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V1, V3 | XSS防止チートシート の主要な管理策 |

