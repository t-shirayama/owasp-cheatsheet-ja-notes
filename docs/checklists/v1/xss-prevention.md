# XSS防止チートシート 開発チェックリスト

## Attribution

- Original: Cross Site Scripting Prevention Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Development checklist added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../../translations/v1/xss-prevention.md](../../translations/v1/xss-prevention.md)
- 要約: [../../summaries/v1/xss-prevention.md](../../summaries/v1/xss-prevention.md)

## 開発チェックリスト

### V1.2 Injection Prevention

- [ ] 有効化する: テンプレートエンジンとフレームワークの自動エスケープを有効にする。
- [ ] レビューする: React の `dangerouslySetInnerHTML`、Angular の `bypassSecurityTrustAs*`、Lit の `unsafeHTML` などの escape hatch を洗い出す。
- [ ] 検証する: `javascript:`、`data:` URL、テンプレートインジェクション、古いプラグインやコンポーネントを拒否または制限する。
- [ ] 実装する: HTML コンテキストでは HTML エンティティエンコーディングを行う。
- [ ] 実装する: HTML 属性コンテキストでは属性エンコーディングを行い、属性値を引用符で囲む。
- [ ] 禁止する: `onclick` など JavaScript を受け付ける属性へ信頼できない値を入れること。
- [ ] 実装する: JavaScript コンテキストでは、引用されたデータ値だけに変数を置き、必要に応じて `\xHH` 形式でエンコードする。
- [ ] 実装する: CSS コンテキストでは、変数を CSS プロパティ値に限定し、セレクタや CSS 構文へ直接入れない。
- [ ] 実装する: URL コンテキストでは URL エンコードを行い、HTML 属性へ入れる場合は属性エンコーディングも行う。
- [ ] 禁止する: `<script>`、HTML コメント、`<style>`、動的タグ名、動的属性名、イベントハンドラ、`eval()`、`setInterval()`、`setTimeout()` へ信頼できない変数を入れること。

### V1.3 Sanitization

- [ ] 実装する: ユーザー生成 HTML が必要な場合、DOMPurify などの安全な HTML サニタイザを使う。
- [ ] 禁止する: サニタイズ後の HTML 文字列を再加工して安全性を壊すこと。
- [ ] 確認する: サニタイズ済み HTML を渡すライブラリが文字列を危険な形に変異させない。
- [ ] 更新する: DOMPurify などのサニタイズライブラリを定期的に更新する。

### V3.2 Unintended Content Interpretation

- [ ] 返却する: JSON 応答は `Content-Type: application/json` とし、`text/html` として返さない。
- [ ] 使用する: DOM 書き込みには `textContent`、`insertAdjacentText`、フォーム `value`、`createTextNode` などの safe sink を優先する。
- [ ] 禁止する: `innerHTML` に未サニタイズ値を代入すること。
- [ ] テストする: HTML、属性、JavaScript、CSS、URL の各コンテキストで代表的な XSS ペイロードが実行されないことを確認する。

### V3.4 Browser Security Mechanism Headers

- [ ] 設定する: CSP を多層防御として設定する。
- [ ] 禁止する: CSP または HTTP インターセプタの一律エンコードだけに XSS 防御を依存させること。
- [ ] テストする: CSP バイパス、二重エンコード、DOM based XSS、アプリケーション外由来データの表示を確認する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V1.2 Injection Prevention | コンテキスト別出力エンコーディング、危険なコンテキスト回避 |
| V1.3 Sanitization | HTML サニタイズ、サニタイズ後の変異防止 |
| V3.2 Unintended Content Interpretation | Content-Type、safe sink、DOM 書き込み |
| V3.4 Browser Security Mechanism Headers | CSP とアンチパターン回避 |
