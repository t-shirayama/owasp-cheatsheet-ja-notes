# DOM Clobbering防止チートシート 日本語訳

## Attribution

- Original: DOM Clobbering Prevention Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/DOM_Clobbering_Prevention_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-20

## 日本語訳

DOM Clobbering は、攻撃者が `id` や `name` 属性を持つ HTML 要素を注入し、`window` や `document` の名前付きプロパティ解決を悪用して、セキュリティ上重要な変数やブラウザ API を上書きまたは覆い隠す攻撃である。スクリプトタグの注入がサニタイズや CSP で防がれている場合でも、非スクリプト HTML の注入だけで安全だったマークアップを実行可能コードへ変えられることがある。

ブラウザは、`id` や `name` を持つ一部の HTML 要素を `window` や `document` のプロパティとして参照できるようにする。開発者が `window.config.url` や `window.redirectTo` のようなグローバル値を信頼すると、攻撃者は同名要素を注入して URL、リダイレクト先、スクリプト読み込み元を差し替えられる。

対策として、信頼できない HTML をサニタイズし、DOMPurify や Sanitizer API などを使う。CSP を追加し、スクリプト実行、外部スクリプト読み込み、危険なリダイレクトの影響を抑える。機微な DOM オブジェクトや設定オブジェクトは必要に応じて freeze し、上書きを防ぐ。

安全なコーディングでは、DOM ツリーへ入るすべての入力を検証し、明示的な変数宣言を使い、`document` や `window` をグローバル変数の保管場所にしない。`window.foo` や `document.foo` の暗黙参照を信頼せず、`getElementById` や明示的なモジュールスコープの参照を使う。型チェック、strict mode、機能検出、ローカルスコープ、ユニークな変数名、カプセル化を使い、名前衝突の影響を下げる。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V3.2 | DOM Clobbering、HTML サニタイズ、CSP、グローバル名前衝突、DOM API 利用の安全化 |

