# DOM Clobbering防止チートシート 要約

## Attribution

- Original: DOM Clobbering Prevention Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/DOM_Clobbering_Prevention_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese summary added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../translations/dom-clobbering-prevention.md](../translations/dom-clobbering-prevention.md)
- 開発チェックリスト: [../checklists/dom-clobbering-prevention.md](../checklists/dom-clobbering-prevention.md)

## 概要

DOM Clobbering は、攻撃者が `id` や `name` 属性を持つ HTML を注入し、`window` や `document` の名前付きプロパティ解決を悪用して、設定値、URL、ブラウザ API、グローバル変数を覆い隠す攻撃である。スクリプト注入が防がれていても、非スクリプト HTML から XSS やオープンリダイレクトへつながることがある。

## 要点

- 信頼できない HTML をサニタイズし、DOMPurify や Sanitizer API などを使う。
- CSP で外部スクリプト読み込みや危険な実行を制限する。
- `window` や `document` をグローバル変数の保管場所にしない。
- `window.foo` や `document.foo` の暗黙参照を信頼しない。
- 明示的な変数宣言、strict mode、型チェック、ローカルスコープ、カプセル化を使う。
- 機微な設定オブジェクトは必要に応じて freeze し、上書きを防ぐ。

## 実装時の注意点

- DOM Clobbering は「script タグが消えているから安全」という前提を崩す。
- サニタイズ後に残る `id` と `name` の衝突を確認する。
- リダイレクト先、script src、設定 URL など、DOM 由来の値を使う箇所を重点的に見る。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V3.2 | DOM Clobbering、HTML サニタイズ、CSP、グローバル名前衝突、DOM API 利用の安全化 |

