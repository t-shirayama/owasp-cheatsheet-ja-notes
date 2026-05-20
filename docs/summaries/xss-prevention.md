# XSS防止チートシート 要約

## Attribution

- Original: Cross Site Scripting Prevention Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese summary added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../translations/xss-prevention.md](../translations/xss-prevention.md)
- 開発チェックリスト: [../checklists/xss-prevention.md](../checklists/xss-prevention.md)

## 概要

XSS は、信頼できないデータがブラウザでコードとして実行されることで発生します。防御は入力検証だけでは不十分で、変数が使われるコンテキストごとに出力エンコーディング、HTML サニタイズ、安全な sink、CSP などを組み合わせます。

## 要点

- フレームワークの自動エスケープを使い、escape hatch や危険な DOM 操作を重点レビューする。
- HTML、HTML 属性、JavaScript、CSS、URL でエンコード方法を分ける。
- JavaScript 内で変数を置ける安全な場所は引用されたデータ値だけに限定する。
- `script`、HTML コメント、`style`、動的なタグ名や属性名、イベントハンドラ、`eval()` などの危険なコンテキストへ変数を入れない。
- ユーザー生成 HTML は DOMPurify などでサニタイズし、サニタイズ後に再加工して安全性を壊さない。
- `innerHTML` を避け、`textContent`、`insertAdjacentText`、安全な `setAttribute` などの safe sink を使う。
- CSP は多層防御として使い、CSP だけに依存しない。
- HTTP インターセプタの一律エンコードは、コンテキスト不一致、二重エンコード、DOM based XSS の見落としを起こしやすい。

## 実装時の注意点

- URL を HTML 属性に入れる場合は、URL エンコード後に HTML 属性エンコーディングを行います。
- JSON 応答は `application/json` を返し、`text/html` として解釈されないようにします。
- サニタイズライブラリはブラウザ挙動や回避手法の変化に追従するため、定期的に更新します。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V1.2 Injection Prevention | コンテキスト別出力エンコーディング、危険なコンテキスト回避 |
| V1.3 Sanitization | HTML サニタイズ、サニタイズ後の変異防止 |
| V3.2 Unintended Content Interpretation | Content-Type、HTML/CSS/JS/URL の誤解釈防止 |
| V3.4 Browser Security Mechanism Headers | CSP を補助防御として利用 |
