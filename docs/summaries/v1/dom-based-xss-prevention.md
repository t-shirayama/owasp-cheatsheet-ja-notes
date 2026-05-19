# DOM Based XSS防止チートシート 要約

## Attribution

- Original: DOM based XSS Prevention Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese summary added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../../translations/v1/dom-based-xss-prevention.md](../../translations/v1/dom-based-xss-prevention.md)
- 開発チェックリスト: [../../checklists/v1/dom-based-xss-prevention.md](../../checklists/v1/dom-based-xss-prevention.md)

## 概要

DOM Based XSSは、URL、fragment、postMessage、storageなどのクライアント側入力が危険なDOM APIへ渡されることで発生します。ソースとシンクの管理が中心です。

## 要点

- locationやpostMessageなどの入力源を未信頼として扱う。
- innerHTMLなどの危険なシンクを避ける。
- 必要な場合はコンテキスト別にエンコードまたはサニタイズする。

## 実装時の注意点

- この要約はASVS Indexでの利用を前提にした実装者向け整理です。詳細確認時は原文を参照してください。
- 関連する認証、認可、ログ、入力検証、暗号、通信保護の管理策と組み合わせて適用します。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V1, V3 | DOM Based XSS防止チートシート の主要な管理策 |

