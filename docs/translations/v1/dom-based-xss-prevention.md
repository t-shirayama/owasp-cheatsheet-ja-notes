# DOM Based XSS防止チートシート 日本語訳

## Attribution

- Original: DOM based XSS Prevention Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-20

## 関連ファイル

- 要約: [../../summaries/v1/dom-based-xss-prevention.md](../../summaries/v1/dom-based-xss-prevention.md)
- 開発チェックリスト: [../../checklists/v1/dom-based-xss-prevention.md](../../checklists/v1/dom-based-xss-prevention.md)

## 日本語訳

DOM Based XSSは、URL、fragment、postMessage、storageなどのクライアント側入力が危険なDOM APIへ渡されることで発生します。ソースとシンクの管理が中心です。

## 主要な観点

- locationやpostMessageなどの入力源を未信頼として扱う。
- innerHTMLなどの危険なシンクを避ける。
- 必要な場合はコンテキスト別にエンコードまたはサニタイズする。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V1, V3 | DOM Based XSS防止チートシート の主要な管理策 |

