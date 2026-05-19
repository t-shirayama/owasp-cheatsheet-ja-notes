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

DOM Based XSS は、攻撃入力がサーバ側処理ではなくブラウザ実行時に DOM へ注入される XSS である。URL、fragment、`postMessage`、Web Storage、Cookie、リファラ、DOM 属性、外部 API などのクライアント側入力が、`innerHTML`、`outerHTML`、`document.write`、URL 属性、CSS、JavaScript 実行コンテキストなどの危険なシンクへ渡されると発生する。

DOM XSS では、JavaScript 実行コンテキスト内に HTML、HTML 属性、URL、CSS のサブコンテキストが現れる。どのコンテキストへデータを入れるかに応じて、HTML エンコード、属性エンコード、URL エンコード、JavaScript エンコードを正しい順序で適用する必要がある。複雑な文脈ではエンコードの不足や過剰が起きやすいため、そもそも HTML として解釈される API を避ける。

安全な DOM 更新では、`document.createElement`、`textContent`、安全な `setAttribute`、`appendChild` などを使い、信頼できないデータを表示可能なテキストとして扱う。`innerHTML`、`outerHTML`、`document.write`、文字列から JavaScript を実行する `eval`、`setTimeout`/`setInterval` の文字列引数、JSON の `eval` 変換を避ける。テンプレート内で JavaScript 文字列へ値を埋め込む場合は、引用符で囲み、JavaScript エンコードを適用する。

DOM XSS の修正では、ソースとシンクを棚卸しし、信頼できないデータがどのサブコンテキストに入るかを追跡する。オブジェクトプロパティアクセス、動的 URL、動的 CSS、DOM API の暗黙評価、ライブラリのエンコード差異をレビューする。検出では、同じシンクに到達する入力源を変えて試す variant analysis が有効である。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V1.2 | クライアント側入力源、危険シンク、コンテキスト別エンコーディング、DOM API の安全利用 |
| V3.2 | ブラウザ側実行コンテキスト、DOM 更新、CSP と組み合わせた XSS 防御 |

