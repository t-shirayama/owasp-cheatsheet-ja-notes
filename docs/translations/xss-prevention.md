# XSS防止チートシート 日本語訳

## Attribution

- Original: Cross Site Scripting Prevention Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-20

## 関連ファイル

- 要約: [../summaries/xss-prevention.md](../summaries/xss-prevention.md)
- 開発チェックリスト: [../checklists/xss-prevention.md](../checklists/xss-prevention.md)

## 日本語訳

## Introduction

このチートシートは、開発者が XSS 脆弱性を防ぐためのものです。

Cross-Site Scripting (XSS) という名称は誤解を招きます。もともとは、主にクロスサイトでデータを盗むことに焦点を当てた初期の攻撃から生まれた用語でした。その後、この用語は基本的にあらゆるコンテンツのインジェクションを含むように広がりました。XSS 攻撃は深刻であり、アカウントのなりすまし、ユーザー行動の観察、外部コンテンツの読み込み、機密データの窃取などにつながる可能性があります。

**このチートシートには、XSS を防止する、または影響を限定するための技術が含まれています。単一の技術だけで XSS を解決することはできないため、XSS を防ぐには適切な防御技術を組み合わせる必要があります。**

## フレームワークセキュリティ

現代的な Web フレームワークは、テンプレート、自動エスケープ、DOM 操作の抽象化により XSS を減らします。ただし、escape hatch を使って DOM を直接操作する場合、フレームワークの保護を迂回できます。React の `dangerouslySetInnerHTML`、Angular の `bypassSecurityTrustAs*`、Lit の `unsafeHTML`、テンプレートインジェクション、古いプラグインやコンポーネントは重点的にレビューします。React は `javascript:` や `data:` URL を専門的な検証なしに安全化できません。

## XSS 防御の考え方

攻撃者が悪意あるコンテンツをページへ挿入し実行できると XSS が成立します。すべての変数を検証し、適切にエスケープまたはサニタイズする状態を perfect injection resistance と呼びます。この処理を通らない変数は弱点になります。フレームワークは多くの変数を自動的に保護しますが、保護の穴は残るため、出力エンコーディングと HTML サニタイズが必要です。

## 出力エンコーディング

ユーザーが入力した値をテキストとして安全に表示する場合は、出力エンコーディングを使います。変数をコードではなくテキストとして扱わせることが目的です。HTML、HTML 属性、JavaScript、CSS、URL はブラウザの解釈方法が異なるため、同じエンコーディングを使い回してはいけません。

HTML コンテキストでは、`<div>$var</div>` のようにタグの間へ値を入れる場合、HTML エンティティエンコーディングを行います。JavaScript で HTML テキストを書き込む場合は、`.textContent` などの安全な sink を使います。

HTML 属性コンテキストでは、属性値へ入れる変数に HTML 属性エンコーディングを行い、変数を必ず引用符で囲みます。`setAttribute` は属性名が `id` や `class` のように固定かつ無害な場合に安全な sink になります。`onclick` など JavaScript を受け付ける属性へ信頼できない値を入れてはいけません。

JavaScript コンテキストでは、変数を置ける安全な場所は引用されたデータ値だけです。それ以外の inline JavaScript へ変数を置くのは危険です。必要な場合は `\xHH` 形式で JavaScript エンコードします。JSON を返す場合は、`Content-Type` を `text/html` ではなく `application/json` にします。

CSS コンテキストでは、変数を CSS プロパティ値に限定します。セレクタやその他の CSS 文脈へ変数を直接入れてはいけません。JavaScript で CSS を変更する場合は、`style.property = value` のような安全な sink を使います。

URL コンテキストでは、URL パラメータやフラグメントに入る値を `%HH` 形式で URL エンコードします。URL を `href` や `src` の属性に入れる場合は、URL エンコード後に HTML 属性エンコーディングも行います。JavaScript で URL クエリ値を構築する場合は `encodeURIComponent` を使います。

## 危険なコンテキスト

出力エンコーディングは万能ではありません。`<script>` の中、HTML コメント内、`<style>` の中、タグ名や属性名を動的に定義する場所、JavaScript イベントハンドラ、`eval()`、`setInterval()`、`setTimeout()` などは危険なコンテキストです。これらの場所へ信頼できない変数を入れてはいけません。

## HTML サニタイズ

WYSIWYG エディタなど、ユーザーが HTML を作成する必要がある場合、出力エンコーディングだけでは HTML が表示されず機能を壊します。この場合は HTML サニタイズを使います。HTML サニタイズは危険な HTML を取り除き、安全な HTML 文字列を返します。OWASP は DOMPurify を推奨しています。サニタイズ後に文字列を変更したり、ライブラリが文字列を変異させたりすると、サニタイズの効果が失われる可能性があります。DOMPurify などのサニタイズライブラリは定期的に更新します。

## Safe Sinks

sink は変数がページへ挿入される場所です。多くの安全な sink は値をテキストとして扱い、実行しません。`innerHTML` のような危険な sink への参照を減らし、`textContent`、`insertAdjacentText`、`className`、安全な属性名に対する `setAttribute`、フォームフィールドの `value`、`createTextNode` などを使います。HTML 挿入が必要な場合は、`innerHTML = DOMPurify.sanitize(value)` のようにサニタイズ済みの値だけを渡します。

## その他の制御とアンチパターン

CSP は有効な防御層ですが、ブラウザ対応差、レガシーアプリケーション、設定ミスがあるため CSP だけに依存してはいけません。HTTP インターセプタで一律エンコードする方式も、コンテキストに合わないエンコード、二重エンコード、DOM based XSS への無力さ、アプリケーション外由来データへの不十分な対応により失敗しやすいです。XSS 防御は、データが使われる場所ごとに行います。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V1.2 Injection Prevention | コンテキスト別出力エンコーディング、危険なコンテキスト回避、テンプレートインジェクション対策 |
| V1.3 Sanitization | HTML サニタイズ、DOMPurify、サニタイズ後の変異防止 |
| V3.2 Unintended Content Interpretation | JSON Content-Type、HTML/CSS/JS/URL の誤解釈防止 |
| V3.4 Browser Security Mechanism Headers | CSP を多層防御として利用し、単独依存しない |
