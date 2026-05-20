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

- 日本語訳: [../translations/dom-based-xss-prevention.md](../translations/dom-based-xss-prevention.md)
- 要約: [../summaries/dom-based-xss-prevention.md](../summaries/dom-based-xss-prevention.md)

## 開発チェックリスト

- [ ] URL、fragment、query、`postMessage`、Web Storage、Cookie、リファラ、外部 API を入力源として棚卸しする。
- [ ] `innerHTML`、`outerHTML`、`document.write`、危険な URL 属性、CSS 書き込みを棚卸しする。
- [ ] `eval`、文字列引数の `setTimeout`/`setInterval`、JSON の `eval` 変換を禁止する。
- [ ] 信頼できない値を `textContent` または安全な DOM API で挿入する。
- [ ] `postMessage` 受信時に `origin`、送信元、メッセージ構造を検証する。
- [ ] HTML、属性、URL、CSS、JavaScript 文字列の各コンテキストでエンコード処理を確認する。
- [ ] 信頼できない HTML が必要な場合は、安全なサニタイザと許可リストを使う。
- [ ] 動的 URL 生成で `javascript:`、data URL、プロトコル相対 URL を制限する。
- [ ] オブジェクトプロパティアクセスで攻撃者がキーを制御できる箇所をレビューする。
- [ ] variant analysis で、同じシンクに到達する複数入力源をテストする。
- [ ] CSP を設定し、DOM XSS の影響低減を確認する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V1.2 | クライアント側入力源、危険シンク、コンテキスト別エンコーディング |
| V3.2 | ブラウザ側実行コンテキスト、DOM 更新、CSP と組み合わせた XSS 防御 |

