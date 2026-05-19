# DOM Clobbering防止チートシート 開発チェックリスト

## Attribution

- Original: DOM Clobbering Prevention Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/DOM_Clobbering_Prevention_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Development checklist added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../../translations/v3/dom-clobbering-prevention.md](../../translations/v3/dom-clobbering-prevention.md)
- 要約: [../../summaries/v3/dom-clobbering-prevention.md](../../summaries/v3/dom-clobbering-prevention.md)

## 開発チェックリスト

- [ ] 信頼できない HTML を DOM へ挿入する箇所を棚卸しする。
- [ ] サニタイザで危険な要素、属性、`id`、`name` の扱いを確認する。
- [ ] DOMPurify または Sanitizer API の設定をレビューする。
- [ ] CSP で script 実行、外部 script、危険な URL を制限する。
- [ ] `window` や `document` を設定値やグローバル状態の保管場所として使わない。
- [ ] `window.foo`、`document.foo`、未宣言変数の暗黙参照を禁止する。
- [ ] `getElementById` など明示的 API の戻り値を型検証してから使う。
- [ ] リダイレクト先、script src、設定 URL が DOM 要素で上書きされないことを確認する。
- [ ] strict mode、明示的変数宣言、ローカルスコープ、カプセル化を適用する。
- [ ] 機微な設定オブジェクトを freeze する必要があるか評価する。
- [ ] 同名 `id`/`name` を注入するテストで、XSS、オープンリダイレクト、外部 script 読み込みを検証する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V3.2 | DOM Clobbering、HTML サニタイズ、CSP、グローバル名前衝突、DOM API 利用の安全化 |

