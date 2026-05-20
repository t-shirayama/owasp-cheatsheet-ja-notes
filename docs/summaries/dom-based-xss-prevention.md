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

- 日本語訳: [../translations/dom-based-xss-prevention.md](../translations/dom-based-xss-prevention.md)
- 開発チェックリスト: [../checklists/dom-based-xss-prevention.md](../checklists/dom-based-xss-prevention.md)

## 概要

DOM Based XSS は、攻撃入力がブラウザ実行時に DOM へ注入される XSS である。URL、fragment、`postMessage`、Web Storage などのソースから入った値が、`innerHTML`、`document.write`、URL 属性、CSS、文字列評価などの危険なシンクへ到達すると発生する。

## 要点

- クライアント側入力源をすべて未信頼として扱う。
- `innerHTML`、`outerHTML`、`document.write`、`eval`、文字列引数の `setTimeout`/`setInterval` を避ける。
- `textContent`、`createElement`、安全な `setAttribute`、`appendChild` を優先する。
- HTML、属性、URL、CSS、JavaScript 文字列のサブコンテキストごとに適切なエンコードを使う。
- 信頼できないデータは表示可能なテキストとして扱い、HTML として解釈させない。
- ソースとシンクを棚卸しし、variant analysis で回帰テストする。

## 実装時の注意点

- DOM XSS はサーバ側テンプレートだけのレビューでは見落とされる。フロントエンドのルーティング、状態管理、メッセージ受信も確認する。
- ライブラリごとのエンコード差異や安全 API の例外を確認する。
- CSP は影響低減として使い、危険シンクの除去を優先する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V1.2 | クライアント側入力源、危険シンク、コンテキスト別エンコーディング |
| V3.2 | ブラウザ側実行コンテキスト、DOM 更新、CSP と組み合わせた XSS 防御 |

