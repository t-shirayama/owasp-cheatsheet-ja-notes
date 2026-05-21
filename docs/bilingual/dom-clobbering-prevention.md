---
title: DOM Clobbering Prevention Cheat Sheet
hide_title: true
---

<div className="docHero" data-category="asvs-v3">
  <h1>DOM Clobbering 防止チートシート</h1>
  <div className="docMeta">
    <span className="docPill">最終更新: 2026-05-20</span>
    <span className="docPill">読了時間: 準備中</span>
    <span className="docPill">カテゴリ: Web フロントエンドセキュリティ</span>
  </div>
</div>

<p className="docLead">DOM Clobbering 防止チートシートを、原文・翻訳・対比表示で確認できます。ASVS Index 対応の文脈で、公式原文と日本語訳を確認しやすく整理しています。</p>

<div className="tabbedContent">
  <input className="tabInput" type="radio" name="dom-clobbering-prevention-view" id="dom-clobbering-prevention-original" />
  <input className="tabInput" type="radio" name="dom-clobbering-prevention-view" id="dom-clobbering-prevention-translation" defaultChecked />
  <input className="tabInput" type="radio" name="dom-clobbering-prevention-view" id="dom-clobbering-prevention-bilingual" />

  <div className="contentTabs">
    <label htmlFor="dom-clobbering-prevention-original" title="OWASP 原文">原文</label>
    <label htmlFor="dom-clobbering-prevention-translation" title="日本語訳">翻訳</label>
    <label htmlFor="dom-clobbering-prevention-bilingual" title="原文と翻訳を並べて確認">対比表示</label>
  </div>

<section id="dom-clobbering-prevention-original-panel" className="tabPanel originalPanel contentPanel">

## Introduction

[DOM Clobbering](https://domclob.xyz/domc_wiki/#overview) is a type of code-reuse, HTML-only injection attack, where attackers confuse a web application by injecting HTML elements whose `id` or `name` attribute matches the name of security-sensitive variables or browser APIs, such as variables used for fetching remote content (e.g., script src), and overshadow their value.

It is particularly relevant when script injection is not possible, e.g., when filtered by HTML sanitizers, or mitigated by disallowing or controlling script execution. In these scenarios, attackers may still inject non-script HTML markups into webpages and transform the initially secure markup into executable code, achieving [Cross-Site Scripting (XSS)](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html).

**This cheat sheet is a list of guidelines, secure coding patterns, and practices to prevent or restrict the impact of DOM Clobbering in your web application.**

## Background

Before we dive into DOM Clobbering, let's refresh our knowledge with some basic Web background.

When a webpage is loaded, the browser creates a [DOM tree](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction) that represents the structure and content of the page, and JavaScript code has read and write access to this tree.

When creating the DOM tree, browsers also create an attribute for (some) named HTML elements on `window` and `document` objects. Named HTML elements are those having an `id` or `name` attribute. For example, the markup:

```html
<form id=x></a>
```

will lead to browsers creating references to that form element with the attribute `x` of `window` and `document`:

```js
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

When accessing an attribute of `window` and `document` objects, named HTML element references come before lookups of built-in APIs and other attributes on `window` and `document` that developers have defined, also known as [named property accesses](https://html.spec.whatwg.org/multipage/nav-history-apis.html#named-access-on-the-window-object). Developers unaware of such behavior may use the content of window/document attributes for sensitive operations, such as URLs for fetching remote content, and attackers can exploit it by injecting markups with colliding names. Similarly to custom attributes/variables, built-in browser APIs may be overshadowed by DOM Clobbering.

If attackers are able to inject (non-script) HTML markup in the DOM tree,
it can change the value of a variable that the web application relies on due to named property accesses, causing it to malfunction, expose sensitive data, or execute attacker-controlled scripts. DOM Clobbering works by taking advantage of this (legacy) behaviour, causing a namespace collision between the execution environment (i.e., `window` and `document` objects), and JavaScript code.

### Example Attack 1

```javascript
let redirectTo = window.redirectTo || '/profile/';
location.assign(redirectTo);
```

The attacker can:

- inject the markup `<a id=redirectTo href='javascript:alert(1)'` and obtain XSS.
- inject the markup `<a id=redirectTo href='phishing.com'` and obtain open redirect.

### Example Attack 2

```javascript
var script = document.createElement('script');
let src = window.config.url || 'script.js';
s.src = src;
document.body.appendChild(s);
```

The attacker can inject the markup `<a id=config><a id=config name=url href='malicious.js'>` to load additional JavaScript code, and obtain arbitrary client-side code execution.

## Summary of Guidelines

For quick reference, below is the summary of guidelines discussed next.

|    | **Guidelines**                                                | Description                                                               |
|----|---------------------------------------------------------------|---------------------------------------------------------------------------|
| \\# 1  | Use HTML Sanitizers                                           | [link](#1-html-sanitization)                                              |
| \\# 2  | Use Content-Security Policy                                   | [link](#2-content-security-policy)                                        |
| \\# 3  | Freeze Sensitive DOM Objects                                  | [link](#3-freezing-sensitive-dom-objects)                                 |
| \\# 4  | Validate All Inputs to DOM Tree                               | [link](#4-validate-all-inputs-to-dom-tree)                                |
| \\# 5  | Use Explicit Variable Declarations                            | [link](#5-use-explicit-variable-declarations)                             |
| \\# 6  | Do Not Use Document and Window for Global Variables           | [link](#6-do-not-use-document-and-window-for-global-variables)            |
| \\# 7  | Do Not Trust Document Built-in APIs Before Validation         | [link](#7-do-not-trust-document-built-in-apis-before-validation)          |
| \\# 8  | Enforce Type Checking                                         | [link](#8-enforce-type-checking)                                          |
| \\# 9  | Use Strict Mode                                               | [link](#9-use-strict-mode)                                                |
| \\# 10 | Apply Browser Feature Detection                               | [link](#10-apply-browser-feature-detection)                               |
| \\# 11 | Limit Variables to Local Scope                                | [link](#11-limit-variables-to-local-scope)                                |
| \\# 12 | Use Unique Variable Names In Production                       | [link](#12-use-unique-variable-names-in-production)                       |
| \\# 13 | Use Object-oriented Programming Techniques like Encapsulation | [link](#13-use-object-oriented-programming-techniques-like-encapsulation) |

## Mitigation Techniques

### \\#1: HTML Sanitization

Robust HTML sanitizers can prevent or restrict the risk of DOM Clobbering. They can do so in multiple ways. For example:

- completely remove named properties like `id` and `name`. While effective, this may hinder the usability when named properties are needed for legitimate functionalities.
- namespace isolation, which can be, for example, prefixing the value of named properties by a constant string to limit the risk of naming collisions.
- dynamically checking if named properties of the input mark has collisions with the existing DOM tree, and if that is the case, then remove named properties of the input markup.

OWASP recommends [DOMPurify](https://github.com/cure53/DOMPurify) or the [Sanitizer API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Sanitizer_API) for HTML sanitization.

#### DOMPurify Sanitizer

By default, DOMPurify removes all clobbering collisions with **built-in** APIs and properties (using the enabled-by-default `SANITIZE_DOM` configuration option).

To be protected against clobbering of custom variables and properties as well, you need to enable the `SANITIZE_NAMED_PROPS` config:

```js
var clean = DOMPurify.sanitize(dirty, {SANITIZE_NAMED_PROPS: true});
```

This would isolate the namespace of named properties and JavaScript variables by prefixing them with `user-content-` string.

#### Sanitizer API

The new browser-built-in [Sanitizer API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Sanitizer_API) does not prevent DOM Clobbering it its [default setting](https://wicg.github.io/sanitizer-api/#dom-clobbering), but can be configured to remove named properties:

```js
const sanitizerInstance = new Sanitizer({
  blockAttributes: [
    {'name': 'id', elements: '*'},
    {'name': 'name', elements: '*'}
  ]
});
containerDOMElement.setHTML(input, {sanitizer: sanitizerInstance});
```

### \\#2: Content-Security Policy

[Content-Security Policy (CSP)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy) is a set of rules that tell the browser which resources are allowed to be loaded on a web page. By restricting the sources of JavaScript files (e.g., with the [script-src](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src) directive), CSP can prevent malicious code from being injected into the page.

**Note:** CSP can only mitigate **some variants** of DOM clobbering attacks, such as when attackers attempt to load new scripts by clobbering script sources, but not when already-present code can be abused for code execution, e.g., clobbering the parameters of code evaluation constructs like `eval()`.

### \\#3: Freezing Sensitive DOM Objects

A simple way to mitigate DOM Clobbering against individual objects could be to freeze sensitive DOM objects and their properties, e.g., via [Object.freeze()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze) method.

**Note:** Freezing object properties prevents them from being overwritten by named DOM elements. But, determining all objects and object properties that need to be frozen may be not be easy, limiting the usefulness of this approach.

## Secure Coding Guidelines

DOM Clobbering can be avoided by defensive programming and adhering to a few coding patterns and guidelines.

### \\#4: Validate All Inputs to DOM Tree

Before inserting any markup into the webpage's DOM tree, sanitize `id` and `name` attributes (see [HTML sanitization](#1-html-sanitization)).

### \\#5: Use Explicit Variable Declarations

When initializing variables, always use a variable declarator like `var`, `let` or `const`, which prevents clobbering of the variable.

**Note:** Declaring a variable with `let` does not create a property on `window`, unlike `var`. Therefore, `window.VARNAME` can still be clobbered (assuming `VARNAME` is the name of the variable).

### \\#6: Do Not Use Document and Window for Global Variables

Avoid using objects like `document` and `window` for storing global variables, because they can be easily manipulated. (see, e.g., [here](https://domclob.xyz/domc_wiki/indicators/patterns.html#do-not-use-document-for-global-variables)).

### \\#7: Do Not Trust Document Built-in APIs Before Validation

Document properties, including built-in ones, are always overshadowed by DOM Clobbering, even right after they are assigned a value.

**Hint:** This is due to the so-called [named property visibility algorithm](https://webidl.spec.whatwg.org/#legacy-platform-object-abstract-ops), where named HTML element references come before lookups of built-in APIs and other attributes on `document`.

### \\#8: Enforce Type Checking

Always check the type of `document` and `window` properties before using them in sensitive operations, e.g., using the [`instanceof`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/instanceof) operator.

**Hint:** When an object is clobbered, it would refer to an [`Element`](https://developer.mozilla.org/en-US/docs/Web/API/Element) instance, which may not be the expected type.

### \\#9: Use Strict Mode

Use `strict` mode to prevent unintended global variable creation, and to [raise an error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Read-only) when read-only properties are attempted to be over-written.

### \\#10: Apply Browser Feature Detection

Instead of relying on browser-specific features or properties, use feature detection to determine whether a feature is supported before using it. This can help prevent errors and DOM Clobbering that might arise when using those features in unsupported browsers.

**Hint:** Unsupported feature APIs can act as an undefined variable/property in unsupported browsers, making them clobberable.

### \\#11: Limit Variables to Local Scope

Global variables are more prone to being overwritten by DOM Clobbering. Whenever possible, use local variables and object properties.

### \\#12: Use Unique Variable Names In Production

Using unique variable names may help prevent naming collisions that could lead to accidental overwrites.

### \\#13: Use Object-oriented Programming Techniques like Encapsulation

Encapsulating variables and functions within objects or classes can help prevent them from being overwritten. By making them private, they cannot be accessed from outside the object, making them less prone to DOM Clobbering.

</section>

<section id="dom-clobbering-prevention-translation-panel" className="tabPanel translationPanel contentPanel">

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

```js
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
| \\# 1 | HTML サニタイザを使用する | [link](#1-html-sanitization) |
| \\# 2 | Content-Security Policy を使用する | [link](#2-content-security-policy) |
| \\# 3 | 機微な DOM オブジェクトを freeze する | [link](#3-freezing-sensitive-dom-objects) |
| \\# 4 | DOM ツリーへのすべての入力を検証する | [link](#4-validate-all-inputs-to-dom-tree) |
| \\# 5 | 明示的な変数宣言を使用する | [link](#5-use-explicit-variable-declarations) |
| \\# 6 | グローバル変数に Document と Window を使用しない | [link](#6-do-not-use-document-and-window-for-global-variables) |
| \\# 7 | 検証前に Document の組み込み API を信頼しない | [link](#7-do-not-trust-document-built-in-apis-before-validation) |
| \\# 8 | 型チェックを強制する | [link](#8-enforce-type-checking) |
| \\# 9 | strict mode を使用する | [link](#9-use-strict-mode) |
| \\# 10 | ブラウザの機能検出を適用する | [link](#10-apply-browser-feature-detection) |
| \\# 11 | 変数をローカルスコープに制限する | [link](#11-limit-variables-to-local-scope) |
| \\# 12 | 本番環境では一意の変数名を使用する | [link](#12-use-unique-variable-names-in-production) |
| \\# 13 | カプセル化などのオブジェクト指向プログラミング技法を使用する | [link](#13-use-object-oriented-programming-techniques-like-encapsulation) |

## 緩和手法

### \\#1: HTML サニタイズ

堅牢な HTML サニタイザは、DOM Clobbering のリスクを防止または制限できます。これには複数の方法があります。たとえば、次のような方法です。

- `id` や `name` などの名前付きプロパティを完全に削除する。これは有効ですが、正当な機能で名前付きプロパティが必要な場合にはユーザビリティを損なう可能性があります。
- 名前空間の分離。たとえば、名前衝突のリスクを制限するために、名前付きプロパティの値に固定文字列のプレフィックスを付けます。
- 入力マークアップの名前付きプロパティが既存の DOM ツリーと衝突するかを動的にチェックし、衝突する場合は入力マークアップの名前付きプロパティを削除する。

OWASP は、HTML サニタイズに [DOMPurify](https://github.com/cure53/DOMPurify) または [Sanitizer API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Sanitizer_API) を推奨しています。

#### DOMPurify サニタイザ

デフォルトでは、DOMPurify は**組み込み** API とプロパティとの clobbering 衝突をすべて削除します (デフォルトで有効な `SANITIZE_DOM` 設定オプションを使用します)。

カスタム変数やカスタムプロパティの clobbering にも対応するには、`SANITIZE_NAMED_PROPS` 設定を有効にする必要があります。

```js
var clean = DOMPurify.sanitize(dirty, {SANITIZE_NAMED_PROPS: true});
```

これにより、名前付きプロパティと JavaScript 変数の名前空間が、`user-content-` 文字列をプレフィックスとして付与することで分離されます。

#### Sanitizer API

新しいブラウザ組み込みの [Sanitizer API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Sanitizer_API) は、[デフォルト設定](https://wicg.github.io/sanitizer-api/#dom-clobbering)では DOM Clobbering を防止しませんが、名前付きプロパティを削除するように設定できます。

```js
const sanitizerInstance = new Sanitizer({
  blockAttributes: [
    {'name': 'id', elements: '*'},
    {'name': 'name', elements: '*'}
  ]
});
containerDOMElement.setHTML(input, {sanitizer: sanitizerInstance});
```

### \\#2: Content-Security Policy

[Content-Security Policy (CSP)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy) は、Web ページ上で読み込みを許可するリソースをブラウザに伝えるルールセットです。JavaScript ファイルの取得元を制限することで (たとえば [script-src](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src) ディレクティブを使用します)、CSP は悪意のあるコードがページに注入されることを防止できます。

**注:** CSP が緩和できるのは DOM Clobbering 攻撃の**一部のバリアント**だけです。たとえば、攻撃者がスクリプトソースを clobbering して新しいスクリプトを読み込ませようとする場合です。一方で、すでに存在するコードがコード実行に悪用できる場合、たとえば `eval()` のようなコード評価構文のパラメータを clobbering する場合には緩和できません。

### \\#3: 機微な DOM オブジェクトの freeze

個別のオブジェクトに対する DOM Clobbering を緩和する簡単な方法として、[Object.freeze()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze) メソッドなどにより、機微な DOM オブジェクトとそのプロパティを freeze する方法があります。

**注:** オブジェクトプロパティを freeze すると、名前付き DOM 要素による上書きを防止できます。ただし、freeze が必要なすべてのオブジェクトとオブジェクトプロパティを特定することは容易ではない場合があり、このアプローチの有用性は限定されます。

## セキュアコーディングガイドライン

DOM Clobbering は、防御的プログラミングといくつかのコーディングパターンおよびガイドラインの遵守によって回避できます。

### \\#4: DOM ツリーへのすべての入力を検証する

Web ページの DOM ツリーにマークアップを挿入する前に、`id` 属性と `name` 属性をサニタイズします ([HTML サニタイズ](#1-html-sanitization)を参照してください)。

### \\#5: 明示的な変数宣言を使用する

変数を初期化するときは、常に `var`、`let`、`const` などの変数宣言子を使用します。これにより、その変数の clobbering を防止できます。

**注:** `let` で変数を宣言しても、`var` とは異なり `window` 上にプロパティは作成されません。そのため、`window.VARNAME` は引き続き clobbering される可能性があります (`VARNAME` が変数名であると仮定します)。

### \\#6: グローバル変数に Document と Window を使用しない

`document` や `window` のようなオブジェクトをグローバル変数の保存に使用することは避けます。これらは容易に操作される可能性があります (例として[こちら](https://domclob.xyz/domc_wiki/indicators/patterns.html#do-not-use-document-for-global-variables)を参照してください)。

### \\#7: 検証前に Document の組み込み API を信頼しない

組み込みのものを含む Document プロパティは、値を代入した直後であっても、常に DOM Clobbering によって覆い隠されます。

**ヒント:** これは、いわゆる[名前付きプロパティ可視性アルゴリズム](https://webidl.spec.whatwg.org/#legacy-platform-object-abstract-ops)によるものです。このアルゴリズムでは、名前付き HTML 要素への参照が、`document` 上の組み込み API やその他の属性の検索よりも先に扱われます。

### \\#8: 型チェックを強制する

機微な操作で使用する前に、必ず `document` と `window` のプロパティの型をチェックします。たとえば、[`instanceof`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/instanceof) 演算子を使用します。

**ヒント:** オブジェクトが clobbering されると、その参照先は [`Element`](https://developer.mozilla.org/en-US/docs/Web/API/Element) インスタンスになり、期待する型ではない可能性があります。

### \\#9: strict mode を使用する

`strict` mode を使用して、意図しないグローバル変数の作成を防止し、読み取り専用プロパティが上書きされようとした場合に[エラーを発生](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Read-only)させます。

### \\#10: ブラウザの機能検出を適用する

ブラウザ固有の機能やプロパティに依存するのではなく、使用前にその機能がサポートされているかを判断するために機能検出を使用します。これにより、サポートされていないブラウザでそれらの機能を使用したときに生じる可能性があるエラーや DOM Clobbering を防止しやすくなります。

**ヒント:** サポートされていない機能 API は、サポートされていないブラウザでは未定義の変数またはプロパティとして振る舞うことがあり、clobbering 可能になります。

### \\#11: 変数をローカルスコープに制限する

グローバル変数は、DOM Clobbering によって上書きされやすくなります。可能な限り、ローカル変数とオブジェクトプロパティを使用します。

### \\#12: 本番環境では一意の変数名を使用する

一意の変数名を使用すると、意図しない上書きにつながり得る名前衝突を防止しやすくなります。

### \\#13: カプセル化などのオブジェクト指向プログラミング技法を使用する

変数や関数をオブジェクトまたはクラス内にカプセル化すると、それらが上書きされることを防止しやすくなります。private にすることで、オブジェクトの外部からアクセスできなくなり、DOM Clobbering の影響を受けにくくなります。

</section>

<section id="dom-clobbering-prevention-bilingual-panel" className="tabPanel bilingualPanel">

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Introduction

[DOM Clobbering](https://domclob.xyz/domc_wiki/#overview) is a type of code-reuse, HTML-only injection attack, where attackers confuse a web application by injecting HTML elements whose `id` or `name` attribute matches the name of security-sensitive variables or browser APIs, such as variables used for fetching remote content (e.g., script src), and overshadow their value.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## はじめに

[DOM Clobbering](https://domclob.xyz/domc_wiki/#overview) は、コード再利用型の HTML のみを使うインジェクション攻撃の一種です。攻撃者は、リモートコンテンツの取得に使われる変数 (script src など) のようなセキュリティ上重要な変数やブラウザ API と同じ名前を `id` または `name` 属性に持つ HTML 要素を注入し、その値を覆い隠すことで Web アプリケーションを混乱させます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

It is particularly relevant when script injection is not possible, e.g., when filtered by HTML sanitizers, or mitigated by disallowing or controlling script execution. In these scenarios, attackers may still inject non-script HTML markups into webpages and transform the initially secure markup into executable code, achieving [Cross-Site Scripting (XSS)](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

これは、たとえば HTML サニタイザでフィルタリングされている場合や、スクリプト実行を禁止または制御することで緩和されている場合など、スクリプトインジェクションが不可能な状況で特に関係します。このようなシナリオでも、攻撃者は非スクリプト HTML マークアップを Web ページに注入し、当初は安全だったマークアップを実行可能コードに変換して、[クロスサイトスクリプティング (XSS)](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html) を成立させることがあります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**This cheat sheet is a list of guidelines, secure coding patterns, and practices to prevent or restrict the impact of DOM Clobbering in your web application.**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**このチートシートは、Web アプリケーションにおける DOM Clobbering の影響を防止または制限するためのガイドライン、安全なコーディングパターン、プラクティスの一覧です。**

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Background

Before we dive into DOM Clobbering, let's refresh our knowledge with some basic Web background.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 背景

DOM Clobbering に入る前に、基本的な Web の背景知識を確認します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

When a webpage is loaded, the browser creates a [DOM tree](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction) that represents the structure and content of the page, and JavaScript code has read and write access to this tree.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Web ページが読み込まれると、ブラウザはページの構造と内容を表す [DOM ツリー](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction)を作成し、JavaScript コードはこのツリーを読み書きできます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

When creating the DOM tree, browsers also create an attribute for (some) named HTML elements on `window` and `document` objects. Named HTML elements are those having an `id` or `name` attribute. For example, the markup:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

DOM ツリーを作成するとき、ブラウザは `window` オブジェクトと `document` オブジェクト上に、(一部の) 名前付き HTML 要素の属性も作成します。名前付き HTML 要素とは、`id` または `name` 属性を持つ要素です。たとえば、次のマークアップがあります。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<form id=x></a>
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

will lead to browsers creating references to that form element with the attribute `x` of `window` and `document`:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

この場合、ブラウザはその form 要素への参照を `window` と `document` の属性 `x` として作成します。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```js
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

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

When accessing an attribute of `window` and `document` objects, named HTML element references come before lookups of built-in APIs and other attributes on `window` and `document` that developers have defined, also known as [named property accesses](https://html.spec.whatwg.org/multipage/nav-history-apis.html#named-access-on-the-window-object). Developers unaware of such behavior may use the content of window/document attributes for sensitive operations, such as URLs for fetching remote content, and attackers can exploit it by injecting markups with colliding names. Similarly to custom attributes/variables, built-in browser APIs may be overshadowed by DOM Clobbering.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

`window` オブジェクトや `document` オブジェクトの属性にアクセスするとき、名前付き HTML 要素への参照は、組み込み API や開発者が `window` と `document` に定義したその他の属性の検索よりも先に扱われます。これは[名前付きプロパティアクセス](https://html.spec.whatwg.org/multipage/nav-history-apis.html#named-access-on-the-window-object)としても知られています。この挙動を知らない開発者は、リモートコンテンツを取得する URL など、機微な操作に window/document 属性の内容を使用することがあり、攻撃者は名前が衝突するマークアップを注入してこれを悪用できます。カスタム属性や変数と同様に、組み込みブラウザ API も DOM Clobbering によって覆い隠されることがあります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

If attackers are able to inject (non-script) HTML markup in the DOM tree,
it can change the value of a variable that the web application relies on due to named property accesses, causing it to malfunction, expose sensitive data, or execute attacker-controlled scripts. DOM Clobbering works by taking advantage of this (legacy) behaviour, causing a namespace collision between the execution environment (i.e., `window` and `document` objects), and JavaScript code.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

攻撃者が DOM ツリーに (非スクリプトの) HTML マークアップを注入できる場合、名前付きプロパティアクセスにより、Web アプリケーションが依存する変数の値を変更できます。その結果、アプリケーションの誤動作、機微データの露出、攻撃者が制御するスクリプトの実行につながる可能性があります。DOM Clobbering は、この (レガシーな) 挙動を利用し、実行環境 (`window` オブジェクトおよび `document` オブジェクト) と JavaScript コードの間に名前空間の衝突を発生させます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Example Attack 1

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 攻撃例 1

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```javascript
let redirectTo = window.redirectTo || '/profile/';
location.assign(redirectTo);
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The attacker can:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

攻撃者は次のことができます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- inject the markup `<a id=redirectTo href='javascript:alert(1)'` and obtain XSS.
- inject the markup `<a id=redirectTo href='phishing.com'` and obtain open redirect.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- マークアップ `<a id=redirectTo href='javascript:alert(1)'` を注入し、XSS を成立させる。
- マークアップ `<a id=redirectTo href='phishing.com'` を注入し、オープンリダイレクトを成立させる。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Example Attack 2

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 攻撃例 2

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```javascript
var script = document.createElement('script');
let src = window.config.url || 'script.js';
s.src = src;
document.body.appendChild(s);
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The attacker can inject the markup `<a id=config><a id=config name=url href='malicious.js'>` to load additional JavaScript code, and obtain arbitrary client-side code execution.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

攻撃者はマークアップ `<a id=config><a id=config name=url href='malicious.js'>` を注入して追加の JavaScript コードを読み込ませ、任意のクライアントサイドコード実行を成立させることができます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Summary of Guidelines

For quick reference, below is the summary of guidelines discussed next.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## ガイドラインの要約

すぐ参照できるように、以下にこの後で説明するガイドラインの要約を示します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

|    | **Guidelines**                                                | Description                                                               |
|----|---------------------------------------------------------------|---------------------------------------------------------------------------|
| \\# 1  | Use HTML Sanitizers                                           | [link](#1-html-sanitization)                                              |
| \\# 2  | Use Content-Security Policy                                   | [link](#2-content-security-policy)                                        |
| \\# 3  | Freeze Sensitive DOM Objects                                  | [link](#3-freezing-sensitive-dom-objects)                                 |
| \\# 4  | Validate All Inputs to DOM Tree                               | [link](#4-validate-all-inputs-to-dom-tree)                                |
| \\# 5  | Use Explicit Variable Declarations                            | [link](#5-use-explicit-variable-declarations)                             |
| \\# 6  | Do Not Use Document and Window for Global Variables           | [link](#6-do-not-use-document-and-window-for-global-variables)            |
| \\# 7  | Do Not Trust Document Built-in APIs Before Validation         | [link](#7-do-not-trust-document-built-in-apis-before-validation)          |
| \\# 8  | Enforce Type Checking                                         | [link](#8-enforce-type-checking)                                          |
| \\# 9  | Use Strict Mode                                               | [link](#9-use-strict-mode)                                                |
| \\# 10 | Apply Browser Feature Detection                               | [link](#10-apply-browser-feature-detection)                               |
| \\# 11 | Limit Variables to Local Scope                                | [link](#11-limit-variables-to-local-scope)                                |
| \\# 12 | Use Unique Variable Names In Production                       | [link](#12-use-unique-variable-names-in-production)                       |
| \\# 13 | Use Object-oriented Programming Techniques like Encapsulation | [link](#13-use-object-oriented-programming-techniques-like-encapsulation) |

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

|    | **ガイドライン** | 説明 |
|----|------------------|------|
| \\# 1 | HTML サニタイザを使用する | [link](#1-html-sanitization) |
| \\# 2 | Content-Security Policy を使用する | [link](#2-content-security-policy) |
| \\# 3 | 機微な DOM オブジェクトを freeze する | [link](#3-freezing-sensitive-dom-objects) |
| \\# 4 | DOM ツリーへのすべての入力を検証する | [link](#4-validate-all-inputs-to-dom-tree) |
| \\# 5 | 明示的な変数宣言を使用する | [link](#5-use-explicit-variable-declarations) |
| \\# 6 | グローバル変数に Document と Window を使用しない | [link](#6-do-not-use-document-and-window-for-global-variables) |
| \\# 7 | 検証前に Document の組み込み API を信頼しない | [link](#7-do-not-trust-document-built-in-apis-before-validation) |
| \\# 8 | 型チェックを強制する | [link](#8-enforce-type-checking) |
| \\# 9 | strict mode を使用する | [link](#9-use-strict-mode) |
| \\# 10 | ブラウザの機能検出を適用する | [link](#10-apply-browser-feature-detection) |
| \\# 11 | 変数をローカルスコープに制限する | [link](#11-limit-variables-to-local-scope) |
| \\# 12 | 本番環境では一意の変数名を使用する | [link](#12-use-unique-variable-names-in-production) |
| \\# 13 | カプセル化などのオブジェクト指向プログラミング技法を使用する | [link](#13-use-object-oriented-programming-techniques-like-encapsulation) |

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Mitigation Techniques

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 緩和手法

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### \\#1: HTML Sanitization

Robust HTML sanitizers can prevent or restrict the risk of DOM Clobbering. They can do so in multiple ways. For example:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### \\#1: HTML サニタイズ

堅牢な HTML サニタイザは、DOM Clobbering のリスクを防止または制限できます。これには複数の方法があります。たとえば、次のような方法です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- completely remove named properties like `id` and `name`. While effective, this may hinder the usability when named properties are needed for legitimate functionalities.
- namespace isolation, which can be, for example, prefixing the value of named properties by a constant string to limit the risk of naming collisions.
- dynamically checking if named properties of the input mark has collisions with the existing DOM tree, and if that is the case, then remove named properties of the input markup.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- `id` や `name` などの名前付きプロパティを完全に削除する。これは有効ですが、正当な機能で名前付きプロパティが必要な場合にはユーザビリティを損なう可能性があります。
- 名前空間の分離。たとえば、名前衝突のリスクを制限するために、名前付きプロパティの値に固定文字列のプレフィックスを付けます。
- 入力マークアップの名前付きプロパティが既存の DOM ツリーと衝突するかを動的にチェックし、衝突する場合は入力マークアップの名前付きプロパティを削除する。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

OWASP recommends [DOMPurify](https://github.com/cure53/DOMPurify) or the [Sanitizer API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Sanitizer_API) for HTML sanitization.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

OWASP は、HTML サニタイズに [DOMPurify](https://github.com/cure53/DOMPurify) または [Sanitizer API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Sanitizer_API) を推奨しています。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### DOMPurify Sanitizer

By default, DOMPurify removes all clobbering collisions with **built-in** APIs and properties (using the enabled-by-default `SANITIZE_DOM` configuration option).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### DOMPurify サニタイザ

デフォルトでは、DOMPurify は**組み込み** API とプロパティとの clobbering 衝突をすべて削除します (デフォルトで有効な `SANITIZE_DOM` 設定オプションを使用します)。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

To be protected against clobbering of custom variables and properties as well, you need to enable the `SANITIZE_NAMED_PROPS` config:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

カスタム変数やカスタムプロパティの clobbering にも対応するには、`SANITIZE_NAMED_PROPS` 設定を有効にする必要があります。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```js
var clean = DOMPurify.sanitize(dirty, {SANITIZE_NAMED_PROPS: true});
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

This would isolate the namespace of named properties and JavaScript variables by prefixing them with `user-content-` string.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

これにより、名前付きプロパティと JavaScript 変数の名前空間が、`user-content-` 文字列をプレフィックスとして付与することで分離されます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Sanitizer API

The new browser-built-in [Sanitizer API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Sanitizer_API) does not prevent DOM Clobbering it its [default setting](https://wicg.github.io/sanitizer-api/#dom-clobbering), but can be configured to remove named properties:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### Sanitizer API

新しいブラウザ組み込みの [Sanitizer API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Sanitizer_API) は、[デフォルト設定](https://wicg.github.io/sanitizer-api/#dom-clobbering)では DOM Clobbering を防止しませんが、名前付きプロパティを削除するように設定できます。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```js
const sanitizerInstance = new Sanitizer({
  blockAttributes: [
    {'name': 'id', elements: '*'},
    {'name': 'name', elements: '*'}
  ]
});
containerDOMElement.setHTML(input, {sanitizer: sanitizerInstance});
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### \\#2: Content-Security Policy

[Content-Security Policy (CSP)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy) is a set of rules that tell the browser which resources are allowed to be loaded on a web page. By restricting the sources of JavaScript files (e.g., with the [script-src](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src) directive), CSP can prevent malicious code from being injected into the page.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### \\#2: Content-Security Policy

[Content-Security Policy (CSP)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy) は、Web ページ上で読み込みを許可するリソースをブラウザに伝えるルールセットです。JavaScript ファイルの取得元を制限することで (たとえば [script-src](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src) ディレクティブを使用します)、CSP は悪意のあるコードがページに注入されることを防止できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Note:** CSP can only mitigate **some variants** of DOM clobbering attacks, such as when attackers attempt to load new scripts by clobbering script sources, but not when already-present code can be abused for code execution, e.g., clobbering the parameters of code evaluation constructs like `eval()`.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**注:** CSP が緩和できるのは DOM Clobbering 攻撃の**一部のバリアント**だけです。たとえば、攻撃者がスクリプトソースを clobbering して新しいスクリプトを読み込ませようとする場合です。一方で、すでに存在するコードがコード実行に悪用できる場合、たとえば `eval()` のようなコード評価構文のパラメータを clobbering する場合には緩和できません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### \\#3: Freezing Sensitive DOM Objects

A simple way to mitigate DOM Clobbering against individual objects could be to freeze sensitive DOM objects and their properties, e.g., via [Object.freeze()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze) method.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### \\#3: 機微な DOM オブジェクトの freeze

個別のオブジェクトに対する DOM Clobbering を緩和する簡単な方法として、[Object.freeze()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze) メソッドなどにより、機微な DOM オブジェクトとそのプロパティを freeze する方法があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Note:** Freezing object properties prevents them from being overwritten by named DOM elements. But, determining all objects and object properties that need to be frozen may be not be easy, limiting the usefulness of this approach.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**注:** オブジェクトプロパティを freeze すると、名前付き DOM 要素による上書きを防止できます。ただし、freeze が必要なすべてのオブジェクトとオブジェクトプロパティを特定することは容易ではない場合があり、このアプローチの有用性は限定されます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Secure Coding Guidelines

DOM Clobbering can be avoided by defensive programming and adhering to a few coding patterns and guidelines.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## セキュアコーディングガイドライン

DOM Clobbering は、防御的プログラミングといくつかのコーディングパターンおよびガイドラインの遵守によって回避できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### \\#4: Validate All Inputs to DOM Tree

Before inserting any markup into the webpage's DOM tree, sanitize `id` and `name` attributes (see [HTML sanitization](#1-html-sanitization)).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### \\#4: DOM ツリーへのすべての入力を検証する

Web ページの DOM ツリーにマークアップを挿入する前に、`id` 属性と `name` 属性をサニタイズします ([HTML サニタイズ](#1-html-sanitization)を参照してください)。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### \\#5: Use Explicit Variable Declarations

When initializing variables, always use a variable declarator like `var`, `let` or `const`, which prevents clobbering of the variable.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### \\#5: 明示的な変数宣言を使用する

変数を初期化するときは、常に `var`、`let`、`const` などの変数宣言子を使用します。これにより、その変数の clobbering を防止できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Note:** Declaring a variable with `let` does not create a property on `window`, unlike `var`. Therefore, `window.VARNAME` can still be clobbered (assuming `VARNAME` is the name of the variable).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**注:** `let` で変数を宣言しても、`var` とは異なり `window` 上にプロパティは作成されません。そのため、`window.VARNAME` は引き続き clobbering される可能性があります (`VARNAME` が変数名であると仮定します)。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### \\#6: Do Not Use Document and Window for Global Variables

Avoid using objects like `document` and `window` for storing global variables, because they can be easily manipulated. (see, e.g., [here](https://domclob.xyz/domc_wiki/indicators/patterns.html#do-not-use-document-for-global-variables)).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### \\#6: グローバル変数に Document と Window を使用しない

`document` や `window` のようなオブジェクトをグローバル変数の保存に使用することは避けます。これらは容易に操作される可能性があります (例として[こちら](https://domclob.xyz/domc_wiki/indicators/patterns.html#do-not-use-document-for-global-variables)を参照してください)。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### \\#7: Do Not Trust Document Built-in APIs Before Validation

Document properties, including built-in ones, are always overshadowed by DOM Clobbering, even right after they are assigned a value.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### \\#7: 検証前に Document の組み込み API を信頼しない

組み込みのものを含む Document プロパティは、値を代入した直後であっても、常に DOM Clobbering によって覆い隠されます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Hint:** This is due to the so-called [named property visibility algorithm](https://webidl.spec.whatwg.org/#legacy-platform-object-abstract-ops), where named HTML element references come before lookups of built-in APIs and other attributes on `document`.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**ヒント:** これは、いわゆる[名前付きプロパティ可視性アルゴリズム](https://webidl.spec.whatwg.org/#legacy-platform-object-abstract-ops)によるものです。このアルゴリズムでは、名前付き HTML 要素への参照が、`document` 上の組み込み API やその他の属性の検索よりも先に扱われます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### \\#8: Enforce Type Checking

Always check the type of `document` and `window` properties before using them in sensitive operations, e.g., using the [`instanceof`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/instanceof) operator.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### \\#8: 型チェックを強制する

機微な操作で使用する前に、必ず `document` と `window` のプロパティの型をチェックします。たとえば、[`instanceof`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/instanceof) 演算子を使用します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Hint:** When an object is clobbered, it would refer to an [`Element`](https://developer.mozilla.org/en-US/docs/Web/API/Element) instance, which may not be the expected type.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**ヒント:** オブジェクトが clobbering されると、その参照先は [`Element`](https://developer.mozilla.org/en-US/docs/Web/API/Element) インスタンスになり、期待する型ではない可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### \\#9: Use Strict Mode

Use `strict` mode to prevent unintended global variable creation, and to [raise an error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Read-only) when read-only properties are attempted to be over-written.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### \\#9: strict mode を使用する

`strict` mode を使用して、意図しないグローバル変数の作成を防止し、読み取り専用プロパティが上書きされようとした場合に[エラーを発生](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Read-only)させます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### \\#10: Apply Browser Feature Detection

Instead of relying on browser-specific features or properties, use feature detection to determine whether a feature is supported before using it. This can help prevent errors and DOM Clobbering that might arise when using those features in unsupported browsers.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### \\#10: ブラウザの機能検出を適用する

ブラウザ固有の機能やプロパティに依存するのではなく、使用前にその機能がサポートされているかを判断するために機能検出を使用します。これにより、サポートされていないブラウザでそれらの機能を使用したときに生じる可能性があるエラーや DOM Clobbering を防止しやすくなります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Hint:** Unsupported feature APIs can act as an undefined variable/property in unsupported browsers, making them clobberable.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**ヒント:** サポートされていない機能 API は、サポートされていないブラウザでは未定義の変数またはプロパティとして振る舞うことがあり、clobbering 可能になります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### \\#11: Limit Variables to Local Scope

Global variables are more prone to being overwritten by DOM Clobbering. Whenever possible, use local variables and object properties.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### \\#11: 変数をローカルスコープに制限する

グローバル変数は、DOM Clobbering によって上書きされやすくなります。可能な限り、ローカル変数とオブジェクトプロパティを使用します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### \\#12: Use Unique Variable Names In Production

Using unique variable names may help prevent naming collisions that could lead to accidental overwrites.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### \\#12: 本番環境では一意の変数名を使用する

一意の変数名を使用すると、意図しない上書きにつながり得る名前衝突を防止しやすくなります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### \\#13: Use Object-oriented Programming Techniques like Encapsulation

Encapsulating variables and functions within objects or classes can help prevent them from being overwritten. By making them private, they cannot be accessed from outside the object, making them less prone to DOM Clobbering.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### \\#13: カプセル化などのオブジェクト指向プログラミング技法を使用する

変数や関数をオブジェクトまたはクラス内にカプセル化すると、それらが上書きされることを防止しやすくなります。private にすることで、オブジェクトの外部からアクセスできなくなり、DOM Clobbering の影響を受けにくくなります。

</div>
</div>

</section>
</div>

## References

<div className="referenceFooter">

- [domclob.xyz](https://domclob.xyz)
- [PortSwigger: DOM Clobbering Strikes Back](https://portswigger.net/research/dom-clobbering-strikes-back)
- [Blogpost: XSS in GMail’s AMP4Email](https://research.securitum.com/xss-in-amp4email-dom-clobbering/)
- [HackTricks: DOM Clobbering](https://book.hacktricks.xyz/pentesting-web/xss-cross-site-scripting/dom-clobbering)
- [HTMLHell: DOM Clobbering](https://www.htmhell.dev/adventcalendar/2022/12/)

</div>


## Attribution

<div className="attributionFooter">

- Original: DOM Clobbering Prevention Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/DOM_Clobbering_Prevention_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: English original retained for comparison. Japanese translation added. Bilingual display generated from official source and local Japanese translation.
- Retrieved: 2026-05-20

</div>
