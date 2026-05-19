# DOM Based XSS防止チートシート 開発チェックリスト

## Attribution

- Original: DOM based XSS Prevention Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Development checklist added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../../translations/v1/dom-based-xss-prevention.md](../../translations/v1/dom-based-xss-prevention.md)
- 要約: [../../summaries/v1/dom-based-xss-prevention.md](../../summaries/v1/dom-based-xss-prevention.md)

## 開発チェックリスト

- [ ] クライアント側入力源を棚卸しする。
- [ ] 危険なDOMシンクの利用を検索する。
- [ ] textContentなど安全なAPIを使う。
- [ ] postMessageのoriginとスキーマを検証する。
- [ ] DOM XSSテストを追加する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V1, V3 | DOM Based XSS防止チートシート の主要な管理策 |

