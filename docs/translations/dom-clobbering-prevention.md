# DOM Clobbering 防止チートシート 日本語訳

## Attribution

- Original: DOM Clobbering Prevention Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/DOM_Clobbering_Prevention_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-21

## 日本語訳

# DOM Clobbering 防止チートシート

## はじめに

[DOM Clobbering](https://domclob.xyz/domc_wiki/#overview) は、コード再利用型の HTML のみを使うインジェクション攻撃の一種です。攻撃者は、リモートコンテンツの取得に使われる変数 (script src など) のようなセキュリティ上重要な変数やブラウザ API と同じ名前を `id` または `name` 属性に持つ HTML 要素を注入し、その値を覆い隠すことで Web アプリケーションを混乱させます。

これは、たとえば HTML サニタイザでフィルタリングされている場合や、スクリプト実行を禁止または制御することで緩和されている場合など、スクリプトインジェクションが不可能な状況で特に関係します。このようなシナリオでも、攻撃者は非スクリプト HTML マークアップを Web ページに注入し、当初は安全だったマークアップを実行可能コードに変換して、[クロスサイトスクリプティング (XSS)](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html) を成立させることがあります。

**このチートシートは、Web アプリケーションにおける DOM Clobbering の影響を防止または制限するためのガイドライン、安全なコーディングパターン、プラクティスの一覧です。**

## 背景

DOM Clobbering に入る前に、基本的な Web の背景知識を確認します。

Web ページが読み込まれると、ブラウザはページの構造と内容を表す [DOM ツリー](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction)を作成し、JavaScript コードはこのツリーを読み書きできます。

DOM ツリーを作成するとき、ブラウザは `window` オブジェクトと `document` オブジェクト上に、(一部の) 名前付き HTML 要素の属性も作成します。名前付き HTML 要素とは、`id` または `name` 属性を持つ要素です。たとえば、次のマークアップがあります。

```html
<form id=x></a>
```

この場合、ブラウザはその form 要素への参照を `window` と `document` の属性 `x` として作成します。

```javascript
var obj1 = document.getElementById('x');
var obj2 = document.x;
var obj3 = document.x;
var obj4 = window.x;
var obj5 = x; // by default, objects belong to the global Window, so x is same as window.x
console.log(
 obj1 === obj2 && obj2 === obj3 &&
 obj3 === obj4 && obj4 === obj5
); // true
```

`window` オブジェクトや `document` オブジェクトの属性にアクセスするとき、名前付き HTML 要素への参照は、組み込み API や開発者が `window` と `document` に定義したその他の属性の検索よりも先に扱われます。これは[名前付きプロパティアクセス](https://html.spec.whatwg.org/multipage/nav-history-apis.html#named-access-on-the-window-object)としても知られています。この挙動を知らない開発者は、リモートコンテンツを取得する URL など、機微な操作に window/document 属性の内容を使用することがあり、攻撃者は名前が衝突するマークアップを注入してこれを悪用できます。カスタム属性や変数と同様に、組み込みブラウザ API も DOM Clobbering によって覆い隠されることがあります。

攻撃者が DOM ツリーに (非スクリプトの) HTML マークアップを注入できる場合、名前付きプロパティアクセスにより、Web アプリケーションが依存する変数の値を変更できます。その結果、アプリケーションの誤動作、機微データの露出、攻撃者が制御するスクリプトの実行につながる可能性があります。DOM Clobbering は、この (レガシーな) 挙動を利用し、実行環境 (`window` オブジェクトおよび `document` オブジェクト) と JavaScript コードの間に名前空間の衝突を発生させます。

### 攻撃例 1

```javascript
let redirectTo = window.redirectTo || '/profile/';
location.assign(redirectTo);
```

攻撃者は次のことができます。

- マークアップ `<a id=redirectTo href='javascript:alert(1)'` を注入し、XSS を成立させる。
- マークアップ `<a id=redirectTo href='phishing.com'` を注入し、オープンリダイレクトを成立させる。

### 攻撃例 2

```javascript
var script = document.createElement('script');
let src = window.config.url || 'script.js';
s.src = src;
document.body.appendChild(s);
```

攻撃者はマークアップ `<a id=config><a id=config name=url href='malicious.js'>` を注入して追加の JavaScript コードを読み込ませ、任意のクライアントサイドコード実行を成立させることができます。

## ガイドラインの要約

すぐ参照できるように、以下にこの後で説明するガイドラインの要約を示します。

|    | **ガイドライン** | 説明 |
|----|------------------|------|
| \# 1 | HTML サニタイザを使用する | [link](#1-html-sanitization) |
| \# 2 | Content-Security Policy を使用する | [link](#2-content-security-policy) |
| \# 3 | 機微な DOM オブジェクトを freeze する | [link](#3-freezing-sensitive-dom-objects) |
| \# 4 | DOM ツリーへのすべての入力を検証する | [link](#4-validate-all-inputs-to-dom-tree) |
| \# 5 | 明示的な変数宣言を使用する | [link](#5-use-explicit-variable-declarations) |
| \# 6 | グローバル変数に Document と Window を使用しない | [link](#6-do-not-use-document-and-window-for-global-variables) |
| \# 7 | 検証前に Document の組み込み API を信頼しない | [link](#7-do-not-trust-document-built-in-apis-before-validation) |
| \# 8 | 型チェックを強制する | [link](#8-enforce-type-checking) |
| \# 9 | strict mode を使用する | [link](#9-use-strict-mode) |
| \# 10 | ブラウザの機能検出を適用する | [link](#10-apply-browser-feature-detection) |
| \# 11 | 変数をローカルスコープに制限する | [link](#11-limit-variables-to-local-scope) |
| \# 12 | 本番環境では一意の変数名を使用する | [link](#12-use-unique-variable-names-in-production) |
| \# 13 | カプセル化などのオブジェクト指向プログラミング技法を使用する | [link](#13-use-object-oriented-programming-techniques-like-encapsulation) |

## 緩和手法

### \#1: HTML サニタイズ

堅牢な HTML サニタイザは、DOM Clobbering のリスクを防止または制限できます。これには複数の方法があります。たとえば、次のような方法です。

- `id` や `name` などの名前付きプロパティを完全に削除する。これは有効ですが、正当な機能で名前付きプロパティが必要な場合にはユーザビリティを損なう可能性があります。
- 名前空間の分離。たとえば、名前衝突のリスクを制限するために、名前付きプロパティの値に固定文字列のプレフィックスを付けます。
- 入力マークアップの名前付きプロパティが既存の DOM ツリーと衝突するかを動的にチェックし、衝突する場合は入力マークアップの名前付きプロパティを削除する。

OWASP は、HTML サニタイズに [DOMPurify](https://github.com/cure53/DOMPurify) または [Sanitizer API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Sanitizer_API) を推奨しています。

#### DOMPurify サニタイザ

デフォルトでは、DOMPurify は**組み込み** API とプロパティとの clobbering 衝突をすべて削除します (デフォルトで有効な `SANITIZE_DOM` 設定オプションを使用します)。

カスタム変数やカスタムプロパティの clobbering にも対応するには、`SANITIZE_NAMED_PROPS` 設定を有効にする必要があります。

```javascript
var clean = DOMPurify.sanitize(dirty, {SANITIZE_NAMED_PROPS: true});
```

これにより、名前付きプロパティと JavaScript 変数の名前空間が、`user-content-` 文字列をプレフィックスとして付与することで分離されます。

#### Sanitizer API

新しいブラウザ組み込みの [Sanitizer API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Sanitizer_API) は、[デフォルト設定](https://wicg.github.io/sanitizer-api/#dom-clobbering)では DOM Clobbering を防止しませんが、名前付きプロパティを削除するように設定できます。

```javascript
const sanitizerInstance = new Sanitizer({
  blockAttributes: [
    {'name': 'id', elements: '*'},
    {'name': 'name', elements: '*'}
  ]
});
containerDOMElement.setHTML(input, {sanitizer: sanitizerInstance});
```

### \#2: Content-Security Policy

[Content-Security Policy (CSP)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy) は、Web ページ上で読み込みを許可するリソースをブラウザに伝えるルールセットです。JavaScript ファイルの取得元を制限することで (たとえば [script-src](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src) ディレクティブを使用します)、CSP は悪意のあるコードがページに注入されることを防止できます。

**注:** CSP が緩和できるのは DOM Clobbering 攻撃の**一部のバリアント**だけです。たとえば、攻撃者がスクリプトソースを clobbering して新しいスクリプトを読み込ませようとする場合です。一方で、すでに存在するコードがコード実行に悪用できる場合、たとえば `eval()` のようなコード評価構文のパラメータを clobbering する場合には緩和できません。

### \#3: 機微な DOM オブジェクトの freeze

個別のオブジェクトに対する DOM Clobbering を緩和する簡単な方法として、[Object.freeze()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze) メソッドなどにより、機微な DOM オブジェクトとそのプロパティを freeze する方法があります。

**注:** オブジェクトプロパティを freeze すると、名前付き DOM 要素による上書きを防止できます。ただし、freeze が必要なすべてのオブジェクトとオブジェクトプロパティを特定することは容易ではない場合があり、このアプローチの有用性は限定されます。

## セキュアコーディングガイドライン

DOM Clobbering は、防御的プログラミングといくつかのコーディングパターンおよびガイドラインの遵守によって回避できます。

### \#4: DOM ツリーへのすべての入力を検証する

Web ページの DOM ツリーにマークアップを挿入する前に、`id` 属性と `name` 属性をサニタイズします ([HTML サニタイズ](#1-html-sanitization)を参照してください)。

### \#5: 明示的な変数宣言を使用する

変数を初期化するときは、常に `var`、`let`、`const` などの変数宣言子を使用します。これにより、その変数の clobbering を防止できます。

**注:** `let` で変数を宣言しても、`var` とは異なり `window` 上にプロパティは作成されません。そのため、`window.VARNAME` は引き続き clobbering される可能性があります (`VARNAME` が変数名であると仮定します)。

### \#6: グローバル変数に Document と Window を使用しない

`document` や `window` のようなオブジェクトをグローバル変数の保存に使用することは避けます。これらは容易に操作される可能性があります (例として[こちら](https://domclob.xyz/domc_wiki/indicators/patterns.html#do-not-use-document-for-global-variables)を参照してください)。

### \#7: 検証前に Document の組み込み API を信頼しない

組み込みのものを含む Document プロパティは、値を代入した直後であっても、常に DOM Clobbering によって覆い隠されます。

**ヒント:** これは、いわゆる[名前付きプロパティ可視性アルゴリズム](https://webidl.spec.whatwg.org/#legacy-platform-object-abstract-ops)によるものです。このアルゴリズムでは、名前付き HTML 要素への参照が、`document` 上の組み込み API やその他の属性の検索よりも先に扱われます。

### \#8: 型チェックを強制する

機微な操作で使用する前に、必ず `document` と `window` のプロパティの型をチェックします。たとえば、[`instanceof`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/instanceof) 演算子を使用します。

**ヒント:** オブジェクトが clobbering されると、その参照先は [`Element`](https://developer.mozilla.org/en-US/docs/Web/API/Element) インスタンスになり、期待する型ではない可能性があります。

### \#9: strict mode を使用する

`strict` mode を使用して、意図しないグローバル変数の作成を防止し、読み取り専用プロパティが上書きされようとした場合に[エラーを発生](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Read-only)させます。

### \#10: ブラウザの機能検出を適用する

ブラウザ固有の機能やプロパティに依存するのではなく、使用前にその機能がサポートされているかを判断するために機能検出を使用します。これにより、サポートされていないブラウザでそれらの機能を使用したときに生じる可能性があるエラーや DOM Clobbering を防止しやすくなります。

**ヒント:** サポートされていない機能 API は、サポートされていないブラウザでは未定義の変数またはプロパティとして振る舞うことがあり、clobbering 可能になります。

### \#11: 変数をローカルスコープに制限する

グローバル変数は、DOM Clobbering によって上書きされやすくなります。可能な限り、ローカル変数とオブジェクトプロパティを使用します。

### \#12: 本番環境では一意の変数名を使用する

一意の変数名を使用すると、意図しない上書きにつながり得る名前衝突を防止しやすくなります。

### \#13: カプセル化などのオブジェクト指向プログラミング技法を使用する

変数や関数をオブジェクトまたはクラス内にカプセル化すると、それらが上書きされることを防止しやすくなります。private にすることで、オブジェクトの外部からアクセスできなくなり、DOM Clobbering の影響を受けにくくなります。

## References

- [domclob.xyz](https://domclob.xyz)
- [PortSwigger: DOM Clobbering Strikes Back](https://portswigger.net/research/dom-clobbering-strikes-back)
- [Blogpost: XSS in GMail’s AMP4Email](https://research.securitum.com/xss-in-amp4email-dom-clobbering/)
- [HackTricks: DOM Clobbering](https://book.hacktricks.xyz/pentesting-web/xss-cross-site-scripting/dom-clobbering)
- [HTMLHell: DOM Clobbering](https://www.htmhell.dev/adventcalendar/2022/12/)

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V3.2 | DOM Clobbering、HTML サニタイズ、CSP、グローバル名前衝突、DOM API 利用の安全化 |
