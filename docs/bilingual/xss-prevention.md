---
title: Cross Site Scripting Prevention Cheat Sheet
hide_title: true
---

<div className="docHero" data-category="encoding-and-sanitization">
  <h1>XSS 防止チートシート</h1>
  <div className="docMeta">
    <span className="docPill">最終更新: 2026-05-21</span>
    <span className="docPill">読了時間: 約 24 分</span>
    <span className="docPill">カテゴリ: 入力検証とサニタイズ</span>
  </div>
</div>

<p className="docLead">XSS 防止チートシートを、原文・翻訳・対比表示で確認できます。ASVS Index 対応の文脈で、公式原文と日本語訳を確認しやすく整理しています。</p>

<div className="tabbedContent">
  <input className="tabInput" type="radio" name="xss-prevention-view" id="xss-prevention-original" />
  <input className="tabInput" type="radio" name="xss-prevention-view" id="xss-prevention-translation" defaultChecked />
  <input className="tabInput" type="radio" name="xss-prevention-view" id="xss-prevention-bilingual" />

  <div className="contentTabs">
    <label htmlFor="xss-prevention-original" title="OWASP 原文">原文</label>
    <label htmlFor="xss-prevention-translation" title="日本語訳">翻訳</label>
    <label htmlFor="xss-prevention-bilingual" title="原文と翻訳を並べて確認">対比表示</label>
  </div>

<section id="xss-prevention-original-panel" className="tabPanel originalPanel contentPanel">
## Introduction

This cheat sheet helps developers prevent XSS vulnerabilities.

Cross-Site Scripting (XSS) is a misnomer. Originally this term was derived from early versions of the attack that were primarily focused on stealing data cross-site. Since then, the term has widened to include injection of basically any content. XSS attacks are serious and can lead to account impersonation, observing user behaviour, loading external content, stealing sensitive data, and more.

**This cheatsheet contains techniques to prevent or limit the impact of XSS. Since no single technique will solve XSS, using the right combination of defensive techniques will be necessary to prevent XSS.**

## Framework Security

Fortunately, applications built with modern web frameworks have fewer XSS bugs, because these frameworks steer developers towards good security practices and help mitigate XSS by using templating, auto-escaping, and more. However, developers need to know that problems can occur if frameworks are used insecurely, such as:

- _escape hatches_ that frameworks use to directly manipulate the DOM
- React’s `dangerouslySetInnerHTML` without sanitising the HTML
- React cannot handle `javascript:` or `data:` URLs without specialized validation
- Angular’s `bypassSecurityTrustAs*` functions
- Lit's `unsafeHTML` function
- Polymer's `inner-h-t-m-l` attribute and `htmlLiteral` function
- Template injection
- Out of date framework plugins or components
- and more

When you use a modern web framework, you need to know how your framework prevents XSS and where it has gaps. There will be times where you need to do something outside the protection provided by your framework, which means that Output Encoding and HTML Sanitization can be critical. OWASP will be producing framework specific cheatsheets for React, Vue, and Angular.

## XSS Defense Philosophy

In order for an XSS attack to be successful, an attacker must be able to insert and execute malicious content in a webpage. Thus, all variables in a web application needs to be protected. Ensuring that **all variables** go through validation and are then escaped or sanitized is known as **perfect injection resistance**. Any variable that does not go through this process is a potential weakness. Frameworks make it easy to ensure variables are correctly validated and escaped or sanitised.

However, no framework is perfect and security gaps still exist in popular frameworks like React and Angular. Output encoding and HTML sanitization help address those gaps.

## Output Encoding

When you need to safely display data exactly as a user types it in, output encoding is recommended. Variables should not be interpreted as code instead of text. This section covers each form of output encoding, where to use it, and when you should not use dynamic variables at all.

First, when you wish to display data as the user typed it in, start with your framework’s default output encoding protection. Automatic encoding and escaping functions are built into most frameworks.

If you’re not using a framework or need to cover gaps in the framework then you should use an output encoding library. Each variable used in the user interface should be passed through an output encoding function. A list of output encoding libraries is included in the appendix.

There are many different output encoding methods because browsers parse HTML, JS, URLs, and CSS differently. Using the wrong encoding method may introduce weaknesses or harm the functionality of your application.

### Output Encoding for “HTML Contexts”

“HTML Context” refers to inserting a variable between two basic HTML tags like a `<div>` or `<b>`. For example:

```HTML
<div> $varUnsafe </div>
```

An attacker could modify data that is rendered as `$varUnsafe`. This could lead to an attack being added to a webpage. For example:

```HTML
<div> <script>alert`1`</script> </div> // Example Attack
```

In order to add a variable to a HTML context safely to a web template, use HTML entity encoding for that variable.

Here are some examples of encoded values for specific characters:

If you're using JavaScript for writing to HTML, look at the `.textContent` attribute. It is a **Safe Sink** and will automatically HTML Entity Encode.

```HTML
&    &amp;
<    &lt;
>    &gt;
"    &quot;
'    &#x27;
```

### Output Encoding for “HTML Attribute Contexts”

“HTML Attribute Contexts” occur when a variable is placed in an HTML attribute value. You may want to do this to change a hyperlink, hide an element, add alt-text for an image, or change inline CSS styles. You should apply HTML attribute encoding to variables being placed in most HTML attributes. A list of safe HTML attributes is provided in the **Safe Sinks** section.

```HTML
<div attr="$varUnsafe">
<div attr=”*x” onblur=”alert(1)*”> // Example Attack
```

**It’s critical to use quotation marks like `"` or `'` to surround your variables.** Quoting makes it difficult to change the context a variable operates in, which helps prevent XSS. Quoting also significantly reduces the characterset that you need to encode, making your application more reliable and the encoding easier to implement.

If you're writing to a HTML Attribute with JavaScript, look at the `.setAttribute` and `[attribute]` methods because they will automatically HTML Attribute Encode. Those are **Safe Sinks** as long as the attribute name is hardcoded and innocuous, like `id` or `class`. Generally, attributes that accept JavaScript, such as `onClick`, are **NOT safe** to use with untrusted attribute values.

### Output Encoding for “JavaScript Contexts”

“JavaScript Contexts” refers to the situation where variables are placed into inline JavaScript and then embedded in an HTML document. This situation commonly occurs in programs that heavily use custom JavaScript that is embedded in their web pages.

However, the only ‘safe’ location for placing variables in JavaScript is inside a “quoted data value”. All other contexts are unsafe and you should not place variable data in them.

Examples of “Quoted Data Values”

```HTML
<script>alert('$varUnsafe’)</script>
<script>x=’$varUnsafe’</script>
<div onmouseover="'$varUnsafe'"</div>
```

Encode all characters using the `\xHH` format. Encoding libraries often have a `EncodeForJavaScript` or similar to support this function.

Please look at the [OWASP Java Encoder JavaScript encoding examples](https://owasp.org/www-project-java-encoder/) for examples of proper JavaScript use that requires minimal encoding.

For JSON, verify that the `Content-Type` header is `application/json` and not `text/html` to prevent XSS.

### Output Encoding for “CSS Contexts”

“CSS Contexts” refer to variables placed into inline CSS, which is common when developers want their users to customize the look and feel of their webpages. Since CSS is surprisingly powerful, it has been used for many types of attacks. **Variables should only be placed in a CSS property value. Other “CSS Contexts” are unsafe and you should not place variable data in them.**

```HTML
<style> selector { property : $varUnsafe; } </style>
<style> selector { property : "$varUnsafe"; } </style>
<span style="property : $varUnsafe">Oh no</span>
```

If you're using JavaScript to change a CSS property, look into using
`style.property = x`.
This is a **Safe Sink** and will automatically CSS encode data in it.

When inserting variables into CSS properties, ensure the data is properly encoded and sanitized to prevent injection attacks. Avoid placing variables directly into selectors or other CSS contexts.

### Output Encoding for “URL Contexts”

“URL Contexts” refer to variables placed into a URL. Most commonly, a developer will add a parameter or URL fragment to a URL base that is then displayed or used in some operation. Use URL Encoding for these scenarios.

```HTML
<a href="http://www.owasp.org?test=$varUnsafe">link</a >
```

Encode all characters with the `%HH` encoding format. Make sure any attributes are fully quoted, same as JS and CSS.

#### Common Mistake

There will be situations where you use a URL in different contexts. The most common one would be adding it to an `href` or `src` attribute of an `<a>` tag. In these scenarios, you should do URL encoding, followed by HTML attribute encoding.

```HTML
url = "https://site.com?data=" + urlencode(parameter)
<a href='attributeEncode(url)'>link</a>
```

If you're using JavaScript to construct a URL Query Value, look into using `window.encodeURIComponent(x)`. This is a **Safe Sink** and will automatically URL encode data in it.

### Dangerous Contexts

Output encoding is not perfect. It will not always prevent XSS. These locations are known as **dangerous contexts**. Dangerous contexts include:

```HTML
<script>Directly in a script</script>
<!-- Inside an HTML comment -->
<style>Directly in CSS</style>
<div ToDefineAnAttribute=test />
<ToDefineATag href="/test" />
```

Other areas to be careful with include:

- Callback functions
- Where URLs are handled in code such as this CSS &#123; background-url : “javascript:alert(xss)”; &#125;
- All JavaScript event handlers (`onclick()`, `onerror()`, `onmouseover()`).
- Unsafe JS functions like `eval()`, `setInterval()`, `setTimeout()`

Don't place variables into dangerous contexts as even with output encoding, it will not prevent an XSS attack fully.

## HTML Sanitization

When users need to author HTML, developers may let users change the styling or structure of content inside a WYSIWYG editor. Output encoding in this case will prevent XSS, but it will break the intended functionality of the application. The styling will not be rendered. In these cases, HTML Sanitization should be used.

HTML Sanitization will strip dangerous HTML from a variable and return a safe string of HTML. OWASP recommends [DOMPurify](https://github.com/cure53/DOMPurify) for HTML Sanitization.

```js
let clean = DOMPurify.sanitize(dirty);
```

There are some further things to consider:

- If you sanitize content and then modify it afterwards, you can easily void your security efforts.
- If you sanitize content and then send it to a library for use, check that it doesn’t mutate that string somehow. Otherwise, again, your security efforts are void.
- You must regularly patch DOMPurify or other HTML Sanitization libraries that you use. Browsers change functionality and bypasses are being discovered regularly.

## Safe Sinks

Security professionals often talk in terms of sources and sinks. If you pollute a river, it'll flow downstream somewhere. It’s the same with computer security. XSS sinks are places where variables are placed into your webpage.

Thankfully, many sinks where variables can be placed are safe. This is because these sinks treat the variable as text and will never execute it. Try to refactor your code to remove references to unsafe sinks like innerHTML, and instead use textContent or value.

```js
elem.textContent = dangerVariable;
elem.insertAdjacentText(dangerVariable);
elem.className = dangerVariable;
elem.setAttribute(safeName, dangerVariable);
formfield.value = dangerVariable;
document.createTextNode(dangerVariable);
document.createElement(dangerVariable);
elem.innerHTML = DOMPurify.sanitize(dangerVar);
```

**Safe HTML Attributes include:** `align`, `alink`, `alt`, `bgcolor`, `border`, `cellpadding`, `cellspacing`, `class`, `color`, `cols`, `colspan`, `coords`, `dir`, `face`, `height`, `hspace`, `ismap`, `lang`, `marginheight`, `marginwidth`, `multiple`, `nohref`, `noresize`, `noshade`, `nowrap`, `ref`, `rel`, `rev`, `rows`, `rowspan`, `scrolling`, `shape`, `span`, `summary`, `tabindex`, `title`, `usemap`, `valign`, `value`, `vlink`, `vspace`, `width`.

For attributes not reported above, ensure that if JavaScript code is provided as a value, it cannot be executed.

## Other Controls

Framework Security Protections, Output Encoding, and HTML Sanitization will provide the best protection for your application. OWASP recommends these in all circumstances.

Consider adopting the following controls in addition to the above.

- Cookie Attributes - These change how JavaScript and browsers can interact with cookies. Cookie attributes try to limit the impact of an XSS attack but don’t prevent the execution of malicious content or address the root cause of the vulnerability.
- Content Security Policy - An allowlist that prevents content being loaded. It’s easy to make mistakes with the implementation so it should not be your primary defense mechanism. Use a CSP as an additional layer of defense and have a look at the [cheatsheet here](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html).
- Trusted Types - On Chromium-based browsers, enable [Trusted Types](https://web.dev/articles/trusted-types) by adding `Content-Security-Policy: require-trusted-types-for 'script'`. This causes DOM XSS sinks (`innerHTML`, `outerHTML`, `document.write`, `script.src`, etc.) to reject plain strings, forcing all assignments to go through a vetted policy. It is one of the few controls that eliminates entire classes of DOM XSS rather than mitigating them. Combine with a default policy that delegates to a sanitizer (e.g. DOMPurify) for legacy code paths.
- Web Application Firewalls - These look for known attack strings and block them. WAF’s are unreliable and new bypass techniques are being discovered regularly. WAFs also don’t address the root cause of an XSS vulnerability. In addition, WAFs also miss a class of XSS vulnerabilities that operate exclusively client-side. WAFs are not recommended for preventing XSS, especially DOM-Based XSS.

### XSS Prevention Rules Summary

These snippets of HTML demonstrate how to render untrusted data safely in a variety of different contexts.

Data Type: String
Context: HTML Body
Code: `<span>UNTRUSTED DATA </span>`
Sample Defense: HTML Entity Encoding (rule \#1)

Data Type: String
Context: Safe HTML Attributes
Code: `<input type="text" name="fname" value="UNTRUSTED DATA ">`
Sample Defense: Aggressive HTML Entity Encoding (rule \#2), Only place untrusted data into a list of safe attributes (listed below), Strictly validate unsafe attributes such as background, ID and name.

Data Type: String
Context: GET Parameter
Code: `<a href="/site/search?value=UNTRUSTED DATA ">clickme</a>`
Sample Defense: URL Encoding (rule \#5).

Data Type: String
Context: Untrusted URL in a SRC or HREF attribute
Code: `<a href="UNTRUSTED URL ">clickme</a> <iframe src="UNTRUSTED URL " />`
Sample Defense: Canonicalize input, URL Validation, Safe URL verification, Allow-list http and HTTPS URLs only (Avoid the JavaScript Protocol to Open a new Window), Attribute encoder.

Data Type: String
Context: CSS Value
Code: `HTML <div style="width: UNTRUSTED DATA ;">Selection</div>`
Sample Defense: Strict structural validation (rule \#4), CSS hex encoding, Good design of CSS features.

Data Type: String
Context: JavaScript Variable
Code: `<script>var currentValue='UNTRUSTED DATA ';</script> <script>someFunction('UNTRUSTED DATA ');</script>`
Sample Defense: Ensure JavaScript variables are quoted, JavaScript hex encoding, JavaScript Unicode encoding, avoid backslash encoding (`\"` or `\'` or `\\`).

Data Type: HTML
Context: HTML Body
Code: `<div>UNTRUSTED HTML</div>`
Sample Defense: HTML validation (JSoup, AntiSamy, HTML Sanitizer...).

Data Type: String
Context: DOM XSS
Code: `<script>document.write("UNTRUSTED INPUT: " + document.location.hash );<script/>`
Sample Defense: [DOM based XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html) |

### Output Encoding Rules Summary

The purpose of output encoding (as it relates to Cross Site Scripting) is to convert untrusted input into a safe form where the input is displayed as **data** to the user without executing as **code** in the browser. The following charts provides a list of critical output encoding methods needed to stop Cross Site Scripting.

Encoding Type: HTML Entity
Encoding Mechanism: Convert `&` to `&amp;`, Convert `<` to `&lt;`, Convert `>` to `&gt;`, Convert `"` to `&quot;`, Convert `'` to `&#x27`

Encoding Type: HTML Attribute Encoding
Encoding Mechanism: Encode all characters with the HTML Entity `&#xHH;` format, including spaces, where **HH** represents the hexadecimal value of the character in Unicode. For example, `A` becomes `&#x41`. All alphanumeric characters (letters A to Z, a to z, and digits 0 to 9) remain unencoded.

Encoding Type: URL Encoding
Encoding Mechanism: Use standard percent encoding, as specified in the [W3C specification](http://www.w3.org/TR/html401/interact/forms.html#h-17.13.4.1), to encode parameter values. Be cautious and only encode parameter values, not the entire URL or path fragments of a URL.

Encoding Type: JavaScript Encoding
Encoding Mechanism: Encode all characters using the Unicode `\uXXXX` encoding format, where **XXXX** represents the hexadecimal Unicode code point. For example, `A` becomes `\u0041`. All alphanumeric characters (letters A to Z, a to z, and digits 0 to 9) remain unencoded.

Encoding Type: CSS Hex Encoding
Encoding Mechanism: CSS encoding supports both `\XX` and `\XXXXXX` formats. To ensure proper encoding, consider these options: (a) Add a space after the CSS encode (which will be ignored by the CSS parser), or (b) use the full six-character CSS encoding format by zero-padding the value. For example, `A` becomes `\41` (short format) or `\000041` (full format). Alphanumeric characters (letters A to Z, a to z, and digits 0 to 9) remain unencoded.

## Common Anti-patterns: Ineffective Approaches to Avoid

Defending against XSS is hard. For that reason, some have sought shortcuts to preventing XSS.

We're going to examine two common [anti-patterns](https://en.wikipedia.org/wiki/Anti-pattern) that frequently show up in ancient posts, but are still commonly cited as solutions in modern posts about XSS defense on programmer forums such as Stack Overflow and other developer hangouts.

### Sole Reliance on Content-Security-Policy (CSP) Headers

First, let us be clear, we are a strong proponent of CSP when it is used properly. In the context of XSS defense, CSP works best when it it is:

- Used as a defense-in-depth technique.
- Customized for each individual application rather than being deployed as a one-size-fits-all enterprise solution.

What we are against is a blanket CSP policy for the entire enterprise. Problems with that approach are:

#### Problem 1 - Assumption Browser Versions Support CSP Equally

There usually is an implicit assumption that all the customer browsers support all the CSP constructs that your blanket CSP policy is using. Furthermore, this assumption often is done without testing the explicitly the `User-Agent` request header to see if it indeed is a supported browser type and rejecting the use of the site if it is not. Why? Because most businesses don't want to turn away customers if they are using an outdated browser that doesn't support some CSP Level 2 or Level 3 construct that they are relying on for XSS prevention.  (Statistically, almost all browsers support CSP Level 1 directives, so unless you are worried about Grandpa pulling out his old Windows 98 laptop and using some ancient version of Internet Explorer to access your site, CSP Level 1 support can probably be assumed.)

#### Problem 2 - Issues Supporting Legacy Applications

Mandatory universal enterprise-wide CSP response headers are inevitably going to break some web applications, especially legacy ones. This causes the business to push-back against AppSec guidelines and inevitably results in AppSec issuing waivers and/or security exceptions until the application code can be patched up. But these security exceptions allow cracks in your XSS armor, and even if the cracks are temporary they still can impact your business, at least on a reputational basis.

### Reliance on HTTP Interceptors

The other common anti-pattern that we have observed is the attempt to deal with validation and/or output encoding in some sort of interceptor such as a Spring Interceptor that generally implements `org.springframework.web.servlet.HandlerInterceptor` or as a JavaEE servlet filter that implements `javax.servlet.Filter`. While this can be successful for very specific applications (for instance, if you validate that all the input requests that are ever rendered are only alphanumeric data), it violates the major tenet of XSS defense where perform output encoding as close to where the data is rendered is possible. Generally, the HTTP request is examined for query and POST parameters but other things HTTP request headers that might be rendered such as cookie data, are not examined. The common approach that we've seen is someone will call either `ESAPI.validator().getValidSafeHTML()` or `ESAPI.encoder.canonicalize()` and depending on the results will redirect to an error page or call something like `ESAPI.encoder().encodeForHTML()`. Aside from the fact that this approach often misses tainted input such as request headers or "extra path information" in a URI, the approach completely ignores the fact that the output encoding is completely non-contextual. For example, how does a servlet filter know that an input query parameter is going to be rendered in an HTML context (i.e., between HTML tags) rather than in a JavaScript context such as within a `<script>` tag or used with a JavaScript event handler attribute? It doesn't. And because JavaScript and HTML encoding are not interchangeable, you leave yourself still open to XSS attacks.

Unless your filter or interceptor has full knowledge of your application and specifically an awareness of how your application uses each parameter for a given request, it can't succeed for all the possible edge cases. And we would contend that it never will be able to using this approach because providing that additional required context is way too complex of a design and accidentally introducing some other vulnerability (possibly one whose impact is far worse than XSS) is almost inevitable if you attempt it.

This naive approach usually has at least one of these four problems.

#### Problem 1 - Encoding for specific context not satisfactory for all URI paths

One problem is the improper encoding that can still allow exploitable XSS in some URI paths of your application. An example might be a 'lastname' form parameter from a POST that normally is displayed between HTML tags so that HTML encoding is sufficient, but there may be an edge case or two where lastname is actually rendered as part of a JavaScript block where the HTML encoding is not sufficient and thus it is vulnerable to XSS attacks.

#### Problem 2 - Interceptor approach can lead to broken rendering caused by improper or double encoding

A second problem with this approach can be the application can result in incorrect or double encoding. E.g., suppose in the previous example, a developer has done proper output encoding for the JavaScript rendering of lastname. But if it is already been HTML output encoded too, when it is rendered, a legitimate last name like "O'Hara" might come out rendered like "O\&#39;Hara".

While this second case is not strictly a security problem, if it happens often enough, it can result in business push-back against the use of the filter and thus the business may decide on disabling the filter or a way to specify exceptions for certain pages or parameters being filtered, which in turn will weaken any XSS defense that it was providing.

#### Problem 3 - Interceptors not effective against DOM-based XSS

The third problem with this is that it is not effective against DOM-based XSS. To do that, one would have to have an interceptor or filter scan all the JavaScript content going as part of an HTTP response, try to figure out the tainted output and see if it it is susceptible to DOM-based XSS. That simply is not practical.

#### Problem 4 - Interceptors not effective where data from responses originates outside your application

The last problem with interceptors is that they generally are oblivious to data in your application's responses that originate from other internal sources such as an internal REST-based web service or even an internal database. The problem is that unless your application is strictly validating that data _at the point that it is retrieved_ (which generally is the only point your application has enough context to do a strict data validation using an allow-list approach), that data should always be considered tainted. But if you are attempting to do output encoding or strict data validation all of tainted data on the HTTP response side of an interceptor (such as a Java servlet filter), at that point, your application's interceptor will have no idea of there is tainted data present from those REST web services or other databases that you used. The approach that generally is used on response-side interceptors attempting to provide XSS defense has been to only consider the matching "input parameters" as tainted and do output encoding or HTML sanitization on them and everything else is considered safe. But sometimes it's not? While it frequently is assumed that all internal web services and all internal databases can be "trusted" and used as it, this is a very bad assumption to make unless you have included that in some deep threat modeling for your application.

For example, suppose you are working on an application to show a customer their detailed monthly bill. Let's assume that your application is either querying a foreign (as in not part of your specific application) internal database or REST web service that your application uses to obtain the user's full name, address, etc. But that data originates from another application which you are assuming is "trusted" but actually has an unreported persistent XSS vulnerability on the various customer address-related fields. Furthermore, let's assume that you company's customer support staff can examine a customer's detailed bill to assist them when customers have questions about their bills. So nefarious customer decides to plant an XSS bomb in the address field and then calls customer service for assistance with the bill. Should a scenario like that ever play out, an interceptor attempting to prevent XSS is going to miss that completely and the result is going to be something much worse than just popping an alert box to display "1" or "XSS" or "pwn'd".

### Summary

One final note: If deploying interceptors / filters as an XSS defense was a useful approach against XSS attacks, don't you think that it would be incorporated into all commercial Web Application Firewalls (WAFs) and be an approach that OWASP recommends in this cheat sheet?

## Related Articles

**XSS Attack Cheat Sheet:**

The following article describes how attackers can exploit different kinds of XSS vulnerabilities (and this article was created to help you avoid them):

- OWASP: [XSS Filter Evasion Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/XSS_Filter_Evasion_Cheat_Sheet.html).

**Description of XSS Vulnerabilities:**

- OWASP article on [XSS](https://owasp.org/www-community/attacks/xss/) Vulnerabilities.

**Discussion about the Types of XSS Vulnerabilities:**

- [Types of Cross-Site Scripting](https://owasp.org/www-community/Types_of_Cross-Site_Scripting).

**How to Review Code for Cross-Site Scripting Vulnerabilities:**

- [OWASP Code Review Guide](https://owasp.org/www-project-code-review-guide/) article on [Reviewing Code for Cross-site scripting](https://wiki.owasp.org/index.php/Reviewing_Code_for_Cross-site_scripting) Vulnerabilities.

**How to Test for Cross-Site Scripting Vulnerabilities:**

- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/) article on testing for Cross-Site Scripting vulnerabilities.
- [XSS Experimental Minimal Encoding Rules](https://wiki.owasp.org/index.php/XSS_Experimental_Minimal_Encoding_Rules) Provides examples and guidelines for experimental minimal encoding strategies to prevent Cross-Site Scripting (XSS) attacks.
</section>

<section id="xss-prevention-translation-panel" className="tabPanel translationPanel contentPanel">
# クロスサイトスクリプティング防止チートシート

## はじめに

このチートシートは、開発者が XSS 脆弱性を防止するためのものです。

Cross-Site Scripting (XSS) という名称は誤解を招くことがあります。もともとこの用語は、主にサイトをまたいだデータ窃取に焦点を当てた初期の攻撃に由来していました。その後、この用語は、基本的にあらゆるコンテンツのインジェクションを含むように広がりました。XSS 攻撃は深刻であり、アカウントのなりすまし、ユーザー行動の観察、外部コンテンツの読み込み、機密データの窃取などにつながる可能性があります。

**このチートシートには、XSS を防止する、または XSS の影響を限定するための技術が含まれています。単一の技術だけで XSS を解決することはできないため、XSS を防止するには適切な防御技術を組み合わせて使用する必要があります。**

## フレームワークセキュリティ

幸いなことに、現代的な Web フレームワークで構築されたアプリケーションでは、XSS バグは少なくなっています。これは、これらのフレームワークが開発者を適切なセキュリティプラクティスへ導き、テンプレート、自動エスケープなどによって XSS の緩和を支援するためです。ただし、次のようにフレームワークを安全でない形で使用すると問題が発生する可能性があることを、開発者は理解しておく必要があります。

- フレームワークが DOM を直接操作するために用意している _escape hatches_
- HTML をサニタイズせずに React の `dangerouslySetInnerHTML` を使用すること
- React は、専門的な検証なしに `javascript:` URL や `data:` URL を扱えないこと
- Angular の `bypassSecurityTrustAs*` 関数
- Lit の `unsafeHTML` 関数
- Polymer の `inner-h-t-m-l` 属性と `htmlLiteral` 関数
- テンプレートインジェクション
- 古くなったフレームワークプラグインやコンポーネント
- その他

現代的な Web フレームワークを使用するときは、そのフレームワークが XSS をどのように防止し、どこにギャップがあるのかを理解する必要があります。フレームワークが提供する保護の外側で何かを行う必要がある場面もあります。そのため、出力エンコーディングと HTML サニタイズが重要になることがあります。OWASP は、React、Vue、Angular 向けのフレームワーク固有のチートシートを作成予定です。

## XSS 防御の考え方

XSS 攻撃が成功するには、攻撃者が悪意のあるコンテンツを Web ページに挿入し、実行できる必要があります。したがって、Web アプリケーション内のすべての変数を保護する必要があります。**すべての変数**が検証され、その後にエスケープまたはサニタイズされることを保証する状態は、**perfect injection resistance** と呼ばれます。この処理を通らない変数は、潜在的な弱点です。フレームワークは、変数が正しく検証され、エスケープまたはサニタイズされるようにすることを容易にします。

しかし、完全なフレームワークは存在せず、React や Angular のような一般的なフレームワークにもセキュリティ上のギャップは残ります。出力エンコーディングと HTML サニタイズは、こうしたギャップに対処する助けになります。

## 出力エンコーディング

ユーザーが入力したデータを、そのまま安全に表示する必要がある場合は、出力エンコーディングが推奨されます。変数は、テキストではなくコードとして解釈されてはいけません。このセクションでは、出力エンコーディングの各形式、使用場所、動的変数をまったく使用すべきでない場合について説明します。

まず、ユーザーが入力したとおりにデータを表示したい場合は、フレームワークのデフォルトの出力エンコーディング保護から始めます。ほとんどのフレームワークには、自動エンコーディングおよびエスケープ関数が組み込まれています。

フレームワークを使用していない場合、またはフレームワークのギャップを補う必要がある場合は、出力エンコーディングライブラリを使用するべきです。ユーザーインターフェイスで使用される各変数は、出力エンコーディング関数を通す必要があります。出力エンコーディングライブラリの一覧は付録に含まれています。

ブラウザは HTML、JS、URL、CSS をそれぞれ異なる方法で解析するため、出力エンコーディングには多くの異なる方法があります。誤ったエンコーディング方法を使用すると、脆弱性が導入されたり、アプリケーションの機能が損なわれたりする可能性があります。

### “HTML コンテキスト” の出力エンコーディング

“HTML Context” とは、`<div>` や `<b>` のような基本的な HTML タグの間に変数を挿入することを指します。例:

```HTML
<div> $varUnsafe </div>
```

攻撃者は、`$varUnsafe` としてレンダリングされるデータを変更できる可能性があります。これにより、攻撃が Web ページに追加される可能性があります。例:

```HTML
<div> <script>alert`1`</script> </div> // Example Attack
```

Web テンプレートの HTML コンテキストへ変数を安全に追加するには、その変数に HTML エンティティエンコーディングを使用します。

特定の文字に対するエンコード値の例を以下に示します。

JavaScript を使用して HTML に書き込む場合は、`.textContent` 属性を検討してください。これは **Safe Sink** であり、自動的に HTML エンティティエンコードを行います。

```HTML
&    &amp;
<    &lt;
>    &gt;
"    &quot;
'    &#x27;
```

### “HTML 属性コンテキスト” の出力エンコーディング

“HTML Attribute Contexts” は、変数が HTML 属性値に置かれる場合に発生します。ハイパーリンクの変更、要素の非表示、画像の alt テキストの追加、インライン CSS スタイルの変更などで、このような処理を行うことがあります。ほとんどの HTML 属性に置かれる変数には、HTML 属性エンコーディングを適用するべきです。安全な HTML 属性の一覧は **Safe Sinks** セクションにあります。

```HTML
<div attr="$varUnsafe">
<div attr=”*x” onblur=”alert(1)*”> // Example Attack
```

**変数を囲むために `"` や `'` のような引用符を使用することは極めて重要です。** 引用符で囲むと、変数が動作するコンテキストを変更しにくくなり、XSS の防止に役立ちます。また、引用符で囲むことでエンコードが必要な文字セットが大幅に減り、アプリケーションの信頼性が高まり、エンコーディングの実装も容易になります。

JavaScript で HTML 属性へ書き込む場合は、`.setAttribute` メソッドと `[attribute]` メソッドを検討してください。これらは自動的に HTML 属性エンコードを行うためです。属性名がハードコードされており、`id` や `class` のように無害である限り、これらは **Safe Sinks** です。一般に、`onClick` など JavaScript を受け付ける属性は、信頼できない属性値と組み合わせて使用するには **安全ではありません**。

### “JavaScript コンテキスト” の出力エンコーディング

“JavaScript Contexts” とは、変数がインライン JavaScript に置かれ、その JavaScript が HTML 文書に埋め込まれる状況を指します。この状況は、Web ページに埋め込まれたカスタム JavaScript を多用するプログラムでよく発生します。

ただし、JavaScript 内で変数を置くための唯一の “安全な” 場所は、“引用符で囲まれたデータ値” の内部です。その他のコンテキストはすべて安全ではなく、そこに変数データを置くべきではありません。

“引用符で囲まれたデータ値” の例:

```HTML
<script>alert('$varUnsafe’)</script>
<script>x=’$varUnsafe’</script>
<div onmouseover="'$varUnsafe'"</div>
```

すべての文字を `\xHH` 形式でエンコードします。エンコーディングライブラリには、この機能をサポートする `EncodeForJavaScript` または類似の関数が用意されていることがよくあります。

最小限のエンコーディングで適切に JavaScript を使用する例については、[OWASP Java Encoder JavaScript encoding examples](https://owasp.org/www-project-java-encoder/) を参照してください。

JSON については、XSS を防止するために、`Content-Type` ヘッダーが `text/html` ではなく `application/json` であることを確認してください。

### “CSS コンテキスト” の出力エンコーディング

“CSS Contexts” とは、変数がインライン CSS に置かれることを指します。これは、開発者がユーザーに Web ページの見た目をカスタマイズさせたい場合によく発生します。CSS は意外なほど強力であるため、多くの種類の攻撃に使用されてきました。**変数は CSS プロパティ値のみに置くべきです。その他の “CSS Contexts” は安全ではなく、そこに変数データを置くべきではありません。**

```HTML
<style> selector { property : $varUnsafe; } </style>
<style> selector { property : "$varUnsafe"; } </style>
<span style="property : $varUnsafe">Oh no</span>
```

JavaScript を使用して CSS プロパティを変更する場合は、`style.property = x` の使用を検討してください。これは **Safe Sink** であり、その中のデータを自動的に CSS エンコードします。

CSS プロパティに変数を挿入する場合は、インジェクション攻撃を防止するために、データが適切にエンコードおよびサニタイズされていることを確認してください。セレクタやその他の CSS コンテキストに変数を直接置くことは避けてください。

### “URL コンテキスト” の出力エンコーディング

“URL Contexts” とは、変数が URL に置かれることを指します。最も一般的には、開発者が URL ベースにパラメータや URL フラグメントを追加し、それを表示したり何らかの操作に使用したりします。こうしたシナリオでは URL エンコーディングを使用します。

```HTML
<a href="http://www.owasp.org?test=$varUnsafe">link</a >
```

すべての文字を `%HH` エンコーディング形式でエンコードします。JS や CSS と同様に、属性が完全に引用符で囲まれていることを確認してください。

#### よくある間違い

URL を異なるコンテキストで使用する状況があります。最も一般的なのは、URL を `<a>` タグの `href` 属性や `src` 属性に追加する場合です。こうしたシナリオでは、URL エンコーディングを行い、その後に HTML 属性エンコーディングを行うべきです。

```HTML
url = "https://site.com?data=" + urlencode(parameter)
<a href='attributeEncode(url)'>link</a>
```

JavaScript を使用して URL クエリ値を構築する場合は、`window.encodeURIComponent(x)` の使用を検討してください。これは **Safe Sink** であり、その中のデータを自動的に URL エンコードします。

### 危険なコンテキスト

出力エンコーディングは完全ではありません。常に XSS を防止できるわけではありません。こうした場所は **危険なコンテキスト** と呼ばれます。危険なコンテキストには次のものがあります。

```HTML
<script>Directly in a script</script>
<!-- Inside an HTML comment -->
<style>Directly in CSS</style>
<div ToDefineAnAttribute=test />
<ToDefineATag href="/test" />
```

ほかにも注意すべき領域があります。

- コールバック関数
- この CSS のように URL がコード内で扱われる場所: `{ background-url : “javascript:alert(xss)”; }`
- すべての JavaScript イベントハンドラ (`onclick()`, `onerror()`, `onmouseover()`)
- `eval()`, `setInterval()`, `setTimeout()` のような安全でない JS 関数

出力エンコーディングを行っていても XSS 攻撃を完全には防止できないため、危険なコンテキストに変数を置いてはいけません。

## HTML サニタイズ

ユーザーが HTML を作成する必要がある場合、開発者は WYSIWYG エディタ内でコンテンツのスタイルや構造を変更できるようにすることがあります。この場合、出力エンコーディングは XSS を防止しますが、アプリケーションの意図した機能を壊します。スタイルがレンダリングされなくなるためです。こうした場合は、HTML サニタイズを使用するべきです。

HTML サニタイズは、変数から危険な HTML を取り除き、安全な HTML 文字列を返します。OWASP は HTML サニタイズに [DOMPurify](https://github.com/cure53/DOMPurify) を推奨しています。

```js
let clean = DOMPurify.sanitize(dirty);
```

さらに考慮すべき点があります。

- コンテンツをサニタイズした後で変更すると、セキュリティ上の取り組みを簡単に無効化してしまう可能性があります。
- コンテンツをサニタイズした後でライブラリに渡して使用する場合は、そのライブラリが何らかの形で文字列を変異させないことを確認してください。そうでなければ、この場合もセキュリティ上の取り組みは無効になります。
- DOMPurify または使用しているその他の HTML サニタイズライブラリには、定期的にパッチを適用する必要があります。ブラウザの機能は変化し、バイパス手法も継続的に発見されています。

## Safe Sinks

セキュリティ専門家は、source と sink という用語で話すことがよくあります。川を汚染すると、その汚染はどこか下流へ流れていきます。コンピュータセキュリティでも同じです。XSS sink は、変数が Web ページに置かれる場所です。

ありがたいことに、変数を置ける多くの sink は安全です。これは、これらの sink が変数をテキストとして扱い、決して実行しないためです。`innerHTML` のような安全でない sink への参照を取り除くようコードをリファクタリングし、代わりに `textContent` や `value` を使用するようにしてください。

```js
elem.textContent = dangerVariable;
elem.insertAdjacentText(dangerVariable);
elem.className = dangerVariable;
elem.setAttribute(safeName, dangerVariable);
formfield.value = dangerVariable;
document.createTextNode(dangerVariable);
document.createElement(dangerVariable);
elem.innerHTML = DOMPurify.sanitize(dangerVar);
```

**安全な HTML 属性には次のものが含まれます:** `align`, `alink`, `alt`, `bgcolor`, `border`, `cellpadding`, `cellspacing`, `class`, `color`, `cols`, `colspan`, `coords`, `dir`, `face`, `height`, `hspace`, `ismap`, `lang`, `marginheight`, `marginwidth`, `multiple`, `nohref`, `noresize`, `noshade`, `nowrap`, `ref`, `rel`, `rev`, `rows`, `rowspan`, `scrolling`, `shape`, `span`, `summary`, `tabindex`, `title`, `usemap`, `valign`, `value`, `vlink`, `vspace`, `width`。

上記に記載されていない属性については、JavaScript コードが値として提供された場合に、それが実行されないことを確認してください。

## その他の制御

フレームワークのセキュリティ保護、出力エンコーディング、HTML サニタイズは、アプリケーションに最良の保護を提供します。OWASP はあらゆる状況でこれらを推奨しています。

上記に加えて、次の制御の採用を検討してください。

- Cookie Attributes - JavaScript とブラウザが Cookie とどのように相互作用できるかを変更します。Cookie 属性は XSS 攻撃の影響を限定しようとしますが、悪意のあるコンテンツの実行を防止したり、脆弱性の根本原因に対処したりするものではありません。
- Content Security Policy - 読み込まれるコンテンツを防止する許可リストです。実装時にミスをしやすいため、主要な防御機構にするべきではありません。CSP は追加の多層防御として使用し、[こちらのチートシート](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html)を参照してください。
- Trusted Types - Chromium ベースのブラウザでは、`Content-Security-Policy: require-trusted-types-for 'script'` を追加して [Trusted Types](https://web.dev/articles/trusted-types) を有効化します。これにより、DOM XSS sink (`innerHTML`, `outerHTML`, `document.write`, `script.src` など) はプレーン文字列を拒否し、すべての代入が検証済みポリシーを通ることを強制されます。これは、DOM XSS のクラス全体を緩和ではなく排除できる数少ない制御の一つです。レガシーコードパスでは、サニタイザ (例: DOMPurify) に委譲するデフォルトポリシーと組み合わせてください。
- Web Application Firewalls - 既知の攻撃文字列を探してブロックします。WAF は信頼性が低く、新しいバイパス手法が定期的に発見されています。また、WAF は XSS 脆弱性の根本原因に対処しません。さらに WAF は、クライアント側でのみ動作する種類の XSS 脆弱性を見逃します。WAF は、特に DOM-Based XSS の防止には推奨されません。

### XSS 防止ルールのまとめ

これらの HTML スニペットは、さまざまな異なるコンテキストで信頼できないデータを安全にレンダリングする方法を示しています。

Data Type: String
Context: HTML Body
Code: `<span>UNTRUSTED DATA </span>`
Sample Defense: HTML Entity Encoding (rule \#1)

Data Type: String
Context: Safe HTML Attributes
Code: `<input type="text" name="fname" value="UNTRUSTED DATA ">`
Sample Defense: Aggressive HTML Entity Encoding (rule \#2), Only place untrusted data into a list of safe attributes (listed below), Strictly validate unsafe attributes such as background, ID and name.

Data Type: String
Context: GET Parameter
Code: `<a href="/site/search?value=UNTRUSTED DATA ">clickme</a>`
Sample Defense: URL Encoding (rule \#5).

Data Type: String
Context: Untrusted URL in a SRC or HREF attribute
Code: `<a href="UNTRUSTED URL ">clickme</a> <iframe src="UNTRUSTED URL " />`
Sample Defense: Canonicalize input, URL Validation, Safe URL verification, Allow-list http and HTTPS URLs only (Avoid the JavaScript Protocol to Open a new Window), Attribute encoder.

Data Type: String
Context: CSS Value
Code: `HTML <div style="width: UNTRUSTED DATA ;">Selection</div>`
Sample Defense: Strict structural validation (rule \#4), CSS hex encoding, Good design of CSS features.

Data Type: String
Context: JavaScript Variable
Code: `<script>var currentValue='UNTRUSTED DATA ';</script> <script>someFunction('UNTRUSTED DATA ');</script>`
Sample Defense: Ensure JavaScript variables are quoted, JavaScript hex encoding, JavaScript Unicode encoding, avoid backslash encoding (`\"` or `\'` or `\\`).

Data Type: HTML
Context: HTML Body
Code: `<div>UNTRUSTED HTML</div>`
Sample Defense: HTML validation (JSoup, AntiSamy, HTML Sanitizer...).

Data Type: String
Context: DOM XSS
Code: `<script>document.write("UNTRUSTED INPUT: " + document.location.hash );<script/>`
Sample Defense: [DOM based XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html) |

### 出力エンコーディングルールのまとめ

Cross Site Scripting に関連する出力エンコーディングの目的は、信頼できない入力を安全な形式に変換し、ブラウザで **code** として実行されることなく、ユーザーに **data** として表示されるようにすることです。次の表は、Cross Site Scripting を止めるために必要な重要な出力エンコーディング方法の一覧を示しています。

Encoding Type: HTML Entity
Encoding Mechanism: `&` を `&amp;` に変換し、`<` を `&lt;` に変換し、`>` を `&gt;` に変換し、`"` を `&quot;` に変換し、`'` を `&#x27` に変換します。

Encoding Type: HTML Attribute Encoding
Encoding Mechanism: スペースを含むすべての文字を HTML Entity `&#xHH;` 形式でエンコードします。ここで **HH** は Unicode における文字の 16 進値を表します。たとえば、`A` は `&#x41` になります。すべての英数字 (A から Z、a から z、0 から 9) はエンコードされないまま残ります。

Encoding Type: URL Encoding
Encoding Mechanism: [W3C specification](http://www.w3.org/TR/html401/interact/forms.html#h-17.13.4.1) で規定されている標準のパーセントエンコーディングを使用して、パラメータ値をエンコードします。注意して、URL 全体や URL のパスフラグメントではなく、パラメータ値のみをエンコードしてください。

Encoding Type: JavaScript Encoding
Encoding Mechanism: すべての文字を Unicode `\uXXXX` エンコーディング形式でエンコードします。ここで **XXXX** は 16 進 Unicode コードポイントを表します。たとえば、`A` は `\u0041` になります。すべての英数字 (A から Z、a から z、0 から 9) はエンコードされないまま残ります。

Encoding Type: CSS Hex Encoding
Encoding Mechanism: CSS エンコーディングは `\XX` と `\XXXXXX` の両方の形式をサポートします。適切なエンコーディングを確保するには、次の選択肢を検討してください: (a) CSS エンコードの後にスペースを追加する (CSS パーサにより無視されます)、または (b) 値をゼロパディングして完全な 6 文字の CSS エンコーディング形式を使用する。たとえば、`A` は `\41` (短縮形式) または `\000041` (完全形式) になります。英数字 (A から Z、a から z、0 から 9) はエンコードされないまま残ります。

## 一般的なアンチパターン: 避けるべき効果の低いアプローチ

XSS から防御することは困難です。そのため、XSS 防止の近道を探す人もいます。

ここでは、古い投稿で頻繁に見られる一方で、Stack Overflow やその他の開発者コミュニティのようなプログラマ向けフォーラムにおける現代の XSS 防御の投稿でも、解決策としていまだによく引用される 2 つの一般的な [anti-patterns](https://en.wikipedia.org/wiki/Anti-pattern) を確認します。

### Content-Security-Policy (CSP) ヘッダーだけに依存すること

まず明確にしておくと、CSP が適切に使用される場合、私たちは CSP を強く支持しています。XSS 防御の文脈では、CSP は次の場合に最も効果的に機能します。

- 多層防御技術として使用される。
- 万能のエンタープライズ向け一律ソリューションとして展開されるのではなく、個々のアプリケーションごとにカスタマイズされる。

私たちが反対しているのは、企業全体に対する一律の CSP ポリシーです。そのアプローチには次の問題があります。

#### 問題 1 - ブラウザバージョンが CSP を同じようにサポートしているという前提

通常、すべての顧客ブラウザが、その一律 CSP ポリシーで使用しているすべての CSP 構文をサポートしているという暗黙の前提があります。さらに、この前提は多くの場合、`User-Agent` リクエストヘッダーを明示的にテストし、それが本当にサポートされているブラウザ種別であるかを確認して、そうでなければサイトの利用を拒否する、ということなしに置かれます。なぜでしょうか。多くの企業は、XSS 防止のために依存している CSP Level 2 や Level 3 の構文をサポートしない古いブラウザを顧客が使っているという理由で、その顧客を拒みたくないからです。(統計的には、ほぼすべてのブラウザが CSP Level 1 ディレクティブをサポートしているため、誰かが古い Windows 98 ノート PC を取り出し、非常に古い Internet Explorer でサイトにアクセスすることを心配しているのでない限り、CSP Level 1 のサポートはおそらく前提としてよいでしょう。)

#### 問題 2 - レガシーアプリケーションをサポートする際の問題

企業全体で必須となる普遍的な CSP レスポンスヘッダーは、特にレガシーアプリケーションなど、一部の Web アプリケーションを必然的に壊します。これにより、ビジネス側は AppSec ガイドラインに反発し、最終的に AppSec がアプリケーションコードを修正できるまで waiver やセキュリティ例外を発行することになります。しかし、これらのセキュリティ例外は XSS 防御に亀裂を生じさせます。その亀裂が一時的なものであっても、少なくとも評判の面でビジネスに影響を与える可能性があります。

### HTTP インターセプタへの依存

私たちが観察してきたもう一つの一般的なアンチパターンは、通常 `org.springframework.web.servlet.HandlerInterceptor` を実装する Spring Interceptor や、`javax.servlet.Filter` を実装する JavaEE サーブレットフィルタのようなインターセプタで、検証や出力エンコーディングに対処しようとする試みです。これは非常に特定のアプリケーションでは成功する可能性があります (たとえば、レンダリングされるすべての入力リクエストが英数字データだけであることを検証する場合)。しかし、データがレンダリングされる場所のできるだけ近くで出力エンコーディングを行うという XSS 防御の主要原則に違反します。一般に、HTTP リクエストではクエリパラメータや POST パラメータが検査されますが、Cookie データなど、レンダリングされる可能性があるその他の HTTP リクエストヘッダーは検査されません。よく見られるアプローチでは、誰かが `ESAPI.validator().getValidSafeHTML()` または `ESAPI.encoder.canonicalize()` を呼び出し、その結果に応じてエラーページへリダイレクトしたり、`ESAPI.encoder().encodeForHTML()` のようなものを呼び出したりします。このアプローチは、リクエストヘッダーや URI の “extra path information” のような汚染された入力をしばしば見逃すだけでなく、出力エンコーディングが完全に非コンテキスト的であるという事実を完全に無視します。たとえば、サーブレットフィルタは、入力クエリパラメータが HTML コンテキスト (つまり HTML タグの間) でレンダリングされるのか、`<script>` タグ内のような JavaScript コンテキストでレンダリングされるのか、あるいは JavaScript イベントハンドラ属性で使用されるのかを、どうやって知るのでしょうか。知ることはできません。そして JavaScript エンコーディングと HTML エンコーディングは相互に置き換えられないため、XSS 攻撃に対して依然として脆弱なままになります。

フィルタやインターセプタがアプリケーションを完全に理解し、特に特定のリクエストに対してアプリケーションが各パラメータをどのように使用するかを認識していない限り、考えられるすべてのエッジケースで成功することはできません。さらに、その追加のコンテキストを提供する設計はあまりにも複雑であり、試みれば別の脆弱性 (場合によっては XSS よりはるかに影響の大きい脆弱性) を偶発的に導入することがほぼ避けられないため、このアプローチで成功することは決してないと私たちは考えています。

この素朴なアプローチには、通常、少なくとも次の 4 つの問題のいずれかがあります。

#### 問題 1 - 特定コンテキスト向けのエンコーディングがすべての URI パスに適しているわけではない

一つ目の問題は、不適切なエンコーディングにより、アプリケーション内の一部の URI パスで悪用可能な XSS が依然として許容される可能性があることです。例として、POST された `lastname` フォームパラメータが通常は HTML タグの間に表示されるため HTML エンコーディングで十分である一方で、1 つか 2 つのエッジケースでは lastname が JavaScript ブロックの一部としてレンダリングされるため HTML エンコーディングでは不十分となり、XSS 攻撃に対して脆弱になる場合があります。

#### 問題 2 - インターセプタ方式は不適切なエンコーディングや二重エンコーディングによって表示を壊す可能性がある

このアプローチの二つ目の問題は、アプリケーションが不正確なエンコーディングや二重エンコーディングを引き起こす可能性があることです。たとえば前の例で、開発者が lastname を JavaScript としてレンダリングするために適切な出力エンコーディングを行っていたとします。しかし、それがすでに HTML 出力エンコードもされていた場合、レンダリング時に "O'Hara" のような正当な姓が "O\&#39;Hara" のように表示される可能性があります。

この二つ目のケースは厳密にはセキュリティ問題ではありませんが、頻繁に発生すると、フィルタの使用に対するビジネス側の反発につながる可能性があります。その結果、ビジネス側がフィルタを無効化する、または特定のページやパラメータをフィルタ対象外にする方法を決定する可能性があり、ひいてはそのフィルタが提供していた XSS 防御を弱めることになります。

#### 問題 3 - インターセプタは DOM-based XSS に効果がない

三つ目の問題は、この方法が DOM-based XSS に対して効果がないことです。それを行うには、インターセプタやフィルタが HTTP レスポンスの一部として送られるすべての JavaScript コンテンツをスキャンし、汚染された出力を特定し、それが DOM-based XSS の影響を受けるかどうかを判断する必要があります。それは現実的ではありません。

#### 問題 4 - インターセプタはレスポンス内のデータがアプリケーション外から来る場合に効果がない

インターセプタに関する最後の問題は、内部 REST ベースの Web サービスや内部データベースなど、他の内部ソースに由来するアプリケーションレスポンス内のデータに対して、一般に無頓着であることです。問題は、アプリケーションがそのデータを _取得した時点で_ 厳格に検証していない限り (通常、その時点だけが、許可リスト方式による厳格なデータ検証を行うための十分なコンテキストをアプリケーションが持つ唯一の時点です)、そのデータは常に汚染されているとみなすべきだということです。しかし、インターセプタの HTTP レスポンス側 (Java サーブレットフィルタなど) ですべての汚染データに対して出力エンコーディングや厳格なデータ検証を試みる場合、その時点でアプリケーションのインターセプタは、使用した REST Web サービスやその他のデータベースから汚染データが存在しているかどうかを知ることができません。XSS 防御を提供しようとするレスポンス側インターセプタで一般に使われるアプローチは、一致する “入力パラメータ” だけを汚染されているとみなし、それらに出力エンコーディングまたは HTML サニタイズを行い、それ以外はすべて安全とみなすことです。しかし、安全でない場合もあります。すべての内部 Web サービスと内部データベースは “信頼できる” と頻繁に仮定され、そのまま使用されますが、アプリケーションの深い脅威モデリングにそれを含めていない限り、これは非常に悪い仮定です。

たとえば、顧客に詳細な月次請求書を表示するアプリケーションで作業しているとします。アプリケーションが、ユーザーの氏名、住所などを取得するために、外部の (つまり特定のアプリケーションの一部ではない) 内部データベースまたは REST Web サービスに問い合わせていると仮定します。しかし、そのデータは、あなたが “信頼できる” と仮定している別のアプリケーションに由来しており、実際には顧客住所関連フィールドに未報告の永続型 XSS 脆弱性を抱えているとします。さらに、あなたの会社のカスタマーサポート担当者は、顧客が請求書について質問したときに支援するため、その顧客の詳細な請求書を確認できるとします。そこで悪意のある顧客が住所フィールドに XSS 爆弾を仕込み、請求書について支援を求めてカスタマーサービスに電話します。そのようなシナリオが実際に起きた場合、XSS を防止しようとするインターセプタはそれを完全に見逃し、その結果は "1"、"XSS"、"pwn'd" を表示する alert ボックスを出すだけよりも、はるかに悪いものになります。

### まとめ

最後に一つ注意します。XSS 防御としてインターセプタやフィルタを配備することが XSS 攻撃に対して有用なアプローチであるなら、それはすべての商用 Web Application Firewall (WAF) に組み込まれ、OWASP がこのチートシートで推奨するアプローチになっているはずだと思いませんか。

## 関連記事

**XSS 攻撃チートシート:**

次の記事では、攻撃者がさまざまな種類の XSS 脆弱性をどのように悪用できるかを説明しています (この記事は、それらを回避する助けになるよう作成されています)。

- OWASP: [XSS Filter Evasion Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/XSS_Filter_Evasion_Cheat_Sheet.html)。

**XSS 脆弱性の説明:**

- [XSS](https://owasp.org/www-community/attacks/xss/) 脆弱性に関する OWASP 記事。

**XSS 脆弱性の種類に関する議論:**

- [Types of Cross-Site Scripting](https://owasp.org/www-community/Types_of_Cross-Site_Scripting)。

**Cross-Site Scripting 脆弱性についてコードをレビューする方法:**

- [Reviewing Code for Cross-site scripting](https://wiki.owasp.org/index.php/Reviewing_Code_for_Cross-site_scripting) 脆弱性に関する [OWASP Code Review Guide](https://owasp.org/www-project-code-review-guide/) の記事。

**Cross-Site Scripting 脆弱性をテストする方法:**

- Cross-Site Scripting 脆弱性のテストに関する [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/) の記事。
- [XSS Experimental Minimal Encoding Rules](https://wiki.owasp.org/index.php/XSS_Experimental_Minimal_Encoding_Rules) は、Cross-Site Scripting (XSS) 攻撃を防止するための実験的な最小エンコーディング戦略について、例とガイドラインを提供します。

</section>

<section id="xss-prevention-bilingual-panel" className="tabPanel bilingualPanel contentPanel">

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>
## Introduction

This cheat sheet helps developers prevent XSS vulnerabilities.

Cross-Site Scripting (XSS) is a misnomer. Originally this term was derived from early versions of the attack that were primarily focused on stealing data cross-site. Since then, the term has widened to include injection of basically any content. XSS attacks are serious and can lead to account impersonation, observing user behaviour, loading external content, stealing sensitive data, and more.

**This cheatsheet contains techniques to prevent or limit the impact of XSS. Since no single technique will solve XSS, using the right combination of defensive techniques will be necessary to prevent XSS.**

## Framework Security

Fortunately, applications built with modern web frameworks have fewer XSS bugs, because these frameworks steer developers towards good security practices and help mitigate XSS by using templating, auto-escaping, and more. However, developers need to know that problems can occur if frameworks are used insecurely, such as:

- _escape hatches_ that frameworks use to directly manipulate the DOM
- React’s `dangerouslySetInnerHTML` without sanitising the HTML
- React cannot handle `javascript:` or `data:` URLs without specialized validation
- Angular’s `bypassSecurityTrustAs*` functions
- Lit's `unsafeHTML` function
- Polymer's `inner-h-t-m-l` attribute and `htmlLiteral` function
- Template injection
- Out of date framework plugins or components
- and more

When you use a modern web framework, you need to know how your framework prevents XSS and where it has gaps. There will be times where you need to do something outside the protection provided by your framework, which means that Output Encoding and HTML Sanitization can be critical. OWASP will be producing framework specific cheatsheets for React, Vue, and Angular.

## XSS Defense Philosophy

In order for an XSS attack to be successful, an attacker must be able to insert and execute malicious content in a webpage. Thus, all variables in a web application needs to be protected. Ensuring that **all variables** go through validation and are then escaped or sanitized is known as **perfect injection resistance**. Any variable that does not go through this process is a potential weakness. Frameworks make it easy to ensure variables are correctly validated and escaped or sanitised.

However, no framework is perfect and security gaps still exist in popular frameworks like React and Angular. Output encoding and HTML sanitization help address those gaps.

## Output Encoding

When you need to safely display data exactly as a user types it in, output encoding is recommended. Variables should not be interpreted as code instead of text. This section covers each form of output encoding, where to use it, and when you should not use dynamic variables at all.

First, when you wish to display data as the user typed it in, start with your framework’s default output encoding protection. Automatic encoding and escaping functions are built into most frameworks.

If you’re not using a framework or need to cover gaps in the framework then you should use an output encoding library. Each variable used in the user interface should be passed through an output encoding function. A list of output encoding libraries is included in the appendix.

There are many different output encoding methods because browsers parse HTML, JS, URLs, and CSS differently. Using the wrong encoding method may introduce weaknesses or harm the functionality of your application.

### Output Encoding for “HTML Contexts”

“HTML Context” refers to inserting a variable between two basic HTML tags like a `<div>` or `<b>`. For example:

```HTML
<div> $varUnsafe </div>
```

An attacker could modify data that is rendered as `$varUnsafe`. This could lead to an attack being added to a webpage. For example:

```HTML
<div> <script>alert`1`</script> </div> // Example Attack
```

In order to add a variable to a HTML context safely to a web template, use HTML entity encoding for that variable.

Here are some examples of encoded values for specific characters:

If you're using JavaScript for writing to HTML, look at the `.textContent` attribute. It is a **Safe Sink** and will automatically HTML Entity Encode.

```HTML
&    &amp;
<    &lt;
>    &gt;
"    &quot;
'    &#x27;
```

### Output Encoding for “HTML Attribute Contexts”

“HTML Attribute Contexts” occur when a variable is placed in an HTML attribute value. You may want to do this to change a hyperlink, hide an element, add alt-text for an image, or change inline CSS styles. You should apply HTML attribute encoding to variables being placed in most HTML attributes. A list of safe HTML attributes is provided in the **Safe Sinks** section.

```HTML
<div attr="$varUnsafe">
<div attr=”*x” onblur=”alert(1)*”> // Example Attack
```

**It’s critical to use quotation marks like `"` or `'` to surround your variables.** Quoting makes it difficult to change the context a variable operates in, which helps prevent XSS. Quoting also significantly reduces the characterset that you need to encode, making your application more reliable and the encoding easier to implement.

If you're writing to a HTML Attribute with JavaScript, look at the `.setAttribute` and `[attribute]` methods because they will automatically HTML Attribute Encode. Those are **Safe Sinks** as long as the attribute name is hardcoded and innocuous, like `id` or `class`. Generally, attributes that accept JavaScript, such as `onClick`, are **NOT safe** to use with untrusted attribute values.

### Output Encoding for “JavaScript Contexts”

“JavaScript Contexts” refers to the situation where variables are placed into inline JavaScript and then embedded in an HTML document. This situation commonly occurs in programs that heavily use custom JavaScript that is embedded in their web pages.

However, the only ‘safe’ location for placing variables in JavaScript is inside a “quoted data value”. All other contexts are unsafe and you should not place variable data in them.

Examples of “Quoted Data Values”

```HTML
<script>alert('$varUnsafe’)</script>
<script>x=’$varUnsafe’</script>
<div onmouseover="'$varUnsafe'"</div>
```

Encode all characters using the `\xHH` format. Encoding libraries often have a `EncodeForJavaScript` or similar to support this function.

Please look at the [OWASP Java Encoder JavaScript encoding examples](https://owasp.org/www-project-java-encoder/) for examples of proper JavaScript use that requires minimal encoding.

For JSON, verify that the `Content-Type` header is `application/json` and not `text/html` to prevent XSS.

### Output Encoding for “CSS Contexts”

“CSS Contexts” refer to variables placed into inline CSS, which is common when developers want their users to customize the look and feel of their webpages. Since CSS is surprisingly powerful, it has been used for many types of attacks. **Variables should only be placed in a CSS property value. Other “CSS Contexts” are unsafe and you should not place variable data in them.**

```HTML
<style> selector { property : $varUnsafe; } </style>
<style> selector { property : "$varUnsafe"; } </style>
<span style="property : $varUnsafe">Oh no</span>
```

If you're using JavaScript to change a CSS property, look into using
`style.property = x`.
This is a **Safe Sink** and will automatically CSS encode data in it.

When inserting variables into CSS properties, ensure the data is properly encoded and sanitized to prevent injection attacks. Avoid placing variables directly into selectors or other CSS contexts.

### Output Encoding for “URL Contexts”

“URL Contexts” refer to variables placed into a URL. Most commonly, a developer will add a parameter or URL fragment to a URL base that is then displayed or used in some operation. Use URL Encoding for these scenarios.

```HTML
<a href="http://www.owasp.org?test=$varUnsafe">link</a >
```

Encode all characters with the `%HH` encoding format. Make sure any attributes are fully quoted, same as JS and CSS.

#### Common Mistake

There will be situations where you use a URL in different contexts. The most common one would be adding it to an `href` or `src` attribute of an `<a>` tag. In these scenarios, you should do URL encoding, followed by HTML attribute encoding.

```HTML
url = "https://site.com?data=" + urlencode(parameter)
<a href='attributeEncode(url)'>link</a>
```

If you're using JavaScript to construct a URL Query Value, look into using `window.encodeURIComponent(x)`. This is a **Safe Sink** and will automatically URL encode data in it.

### Dangerous Contexts

Output encoding is not perfect. It will not always prevent XSS. These locations are known as **dangerous contexts**. Dangerous contexts include:

```HTML
<script>Directly in a script</script>
<!-- Inside an HTML comment -->
<style>Directly in CSS</style>
<div ToDefineAnAttribute=test />
<ToDefineATag href="/test" />
```

Other areas to be careful with include:

- Callback functions
- Where URLs are handled in code such as this CSS &#123; background-url : “javascript:alert(xss)”; &#125;
- All JavaScript event handlers (`onclick()`, `onerror()`, `onmouseover()`).
- Unsafe JS functions like `eval()`, `setInterval()`, `setTimeout()`

Don't place variables into dangerous contexts as even with output encoding, it will not prevent an XSS attack fully.

## HTML Sanitization

When users need to author HTML, developers may let users change the styling or structure of content inside a WYSIWYG editor. Output encoding in this case will prevent XSS, but it will break the intended functionality of the application. The styling will not be rendered. In these cases, HTML Sanitization should be used.

HTML Sanitization will strip dangerous HTML from a variable and return a safe string of HTML. OWASP recommends [DOMPurify](https://github.com/cure53/DOMPurify) for HTML Sanitization.

```js
let clean = DOMPurify.sanitize(dirty);
```

There are some further things to consider:

- If you sanitize content and then modify it afterwards, you can easily void your security efforts.
- If you sanitize content and then send it to a library for use, check that it doesn’t mutate that string somehow. Otherwise, again, your security efforts are void.
- You must regularly patch DOMPurify or other HTML Sanitization libraries that you use. Browsers change functionality and bypasses are being discovered regularly.

## Safe Sinks

Security professionals often talk in terms of sources and sinks. If you pollute a river, it'll flow downstream somewhere. It’s the same with computer security. XSS sinks are places where variables are placed into your webpage.

Thankfully, many sinks where variables can be placed are safe. This is because these sinks treat the variable as text and will never execute it. Try to refactor your code to remove references to unsafe sinks like innerHTML, and instead use textContent or value.

```js
elem.textContent = dangerVariable;
elem.insertAdjacentText(dangerVariable);
elem.className = dangerVariable;
elem.setAttribute(safeName, dangerVariable);
formfield.value = dangerVariable;
document.createTextNode(dangerVariable);
document.createElement(dangerVariable);
elem.innerHTML = DOMPurify.sanitize(dangerVar);
```

**Safe HTML Attributes include:** `align`, `alink`, `alt`, `bgcolor`, `border`, `cellpadding`, `cellspacing`, `class`, `color`, `cols`, `colspan`, `coords`, `dir`, `face`, `height`, `hspace`, `ismap`, `lang`, `marginheight`, `marginwidth`, `multiple`, `nohref`, `noresize`, `noshade`, `nowrap`, `ref`, `rel`, `rev`, `rows`, `rowspan`, `scrolling`, `shape`, `span`, `summary`, `tabindex`, `title`, `usemap`, `valign`, `value`, `vlink`, `vspace`, `width`.

For attributes not reported above, ensure that if JavaScript code is provided as a value, it cannot be executed.

## Other Controls

Framework Security Protections, Output Encoding, and HTML Sanitization will provide the best protection for your application. OWASP recommends these in all circumstances.

Consider adopting the following controls in addition to the above.

- Cookie Attributes - These change how JavaScript and browsers can interact with cookies. Cookie attributes try to limit the impact of an XSS attack but don’t prevent the execution of malicious content or address the root cause of the vulnerability.
- Content Security Policy - An allowlist that prevents content being loaded. It’s easy to make mistakes with the implementation so it should not be your primary defense mechanism. Use a CSP as an additional layer of defense and have a look at the [cheatsheet here](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html).
- Trusted Types - On Chromium-based browsers, enable [Trusted Types](https://web.dev/articles/trusted-types) by adding `Content-Security-Policy: require-trusted-types-for 'script'`. This causes DOM XSS sinks (`innerHTML`, `outerHTML`, `document.write`, `script.src`, etc.) to reject plain strings, forcing all assignments to go through a vetted policy. It is one of the few controls that eliminates entire classes of DOM XSS rather than mitigating them. Combine with a default policy that delegates to a sanitizer (e.g. DOMPurify) for legacy code paths.
- Web Application Firewalls - These look for known attack strings and block them. WAF’s are unreliable and new bypass techniques are being discovered regularly. WAFs also don’t address the root cause of an XSS vulnerability. In addition, WAFs also miss a class of XSS vulnerabilities that operate exclusively client-side. WAFs are not recommended for preventing XSS, especially DOM-Based XSS.

### XSS Prevention Rules Summary

These snippets of HTML demonstrate how to render untrusted data safely in a variety of different contexts.

Data Type: String
Context: HTML Body
Code: `<span>UNTRUSTED DATA </span>`
Sample Defense: HTML Entity Encoding (rule \#1)

Data Type: String
Context: Safe HTML Attributes
Code: `<input type="text" name="fname" value="UNTRUSTED DATA ">`
Sample Defense: Aggressive HTML Entity Encoding (rule \#2), Only place untrusted data into a list of safe attributes (listed below), Strictly validate unsafe attributes such as background, ID and name.

Data Type: String
Context: GET Parameter
Code: `<a href="/site/search?value=UNTRUSTED DATA ">clickme</a>`
Sample Defense: URL Encoding (rule \#5).

Data Type: String
Context: Untrusted URL in a SRC or HREF attribute
Code: `<a href="UNTRUSTED URL ">clickme</a> <iframe src="UNTRUSTED URL " />`
Sample Defense: Canonicalize input, URL Validation, Safe URL verification, Allow-list http and HTTPS URLs only (Avoid the JavaScript Protocol to Open a new Window), Attribute encoder.

Data Type: String
Context: CSS Value
Code: `HTML <div style="width: UNTRUSTED DATA ;">Selection</div>`
Sample Defense: Strict structural validation (rule \#4), CSS hex encoding, Good design of CSS features.

Data Type: String
Context: JavaScript Variable
Code: `<script>var currentValue='UNTRUSTED DATA ';</script> <script>someFunction('UNTRUSTED DATA ');</script>`
Sample Defense: Ensure JavaScript variables are quoted, JavaScript hex encoding, JavaScript Unicode encoding, avoid backslash encoding (`\"` or `\'` or `\\`).

Data Type: HTML
Context: HTML Body
Code: `<div>UNTRUSTED HTML</div>`
Sample Defense: HTML validation (JSoup, AntiSamy, HTML Sanitizer...).

Data Type: String
Context: DOM XSS
Code: `<script>document.write("UNTRUSTED INPUT: " + document.location.hash );<script/>`
Sample Defense: [DOM based XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html) |

### Output Encoding Rules Summary

The purpose of output encoding (as it relates to Cross Site Scripting) is to convert untrusted input into a safe form where the input is displayed as **data** to the user without executing as **code** in the browser. The following charts provides a list of critical output encoding methods needed to stop Cross Site Scripting.

Encoding Type: HTML Entity
Encoding Mechanism: Convert `&` to `&amp;`, Convert `<` to `&lt;`, Convert `>` to `&gt;`, Convert `"` to `&quot;`, Convert `'` to `&#x27`

Encoding Type: HTML Attribute Encoding
Encoding Mechanism: Encode all characters with the HTML Entity `&#xHH;` format, including spaces, where **HH** represents the hexadecimal value of the character in Unicode. For example, `A` becomes `&#x41`. All alphanumeric characters (letters A to Z, a to z, and digits 0 to 9) remain unencoded.

Encoding Type: URL Encoding
Encoding Mechanism: Use standard percent encoding, as specified in the [W3C specification](http://www.w3.org/TR/html401/interact/forms.html#h-17.13.4.1), to encode parameter values. Be cautious and only encode parameter values, not the entire URL or path fragments of a URL.

Encoding Type: JavaScript Encoding
Encoding Mechanism: Encode all characters using the Unicode `\uXXXX` encoding format, where **XXXX** represents the hexadecimal Unicode code point. For example, `A` becomes `\u0041`. All alphanumeric characters (letters A to Z, a to z, and digits 0 to 9) remain unencoded.

Encoding Type: CSS Hex Encoding
Encoding Mechanism: CSS encoding supports both `\XX` and `\XXXXXX` formats. To ensure proper encoding, consider these options: (a) Add a space after the CSS encode (which will be ignored by the CSS parser), or (b) use the full six-character CSS encoding format by zero-padding the value. For example, `A` becomes `\41` (short format) or `\000041` (full format). Alphanumeric characters (letters A to Z, a to z, and digits 0 to 9) remain unencoded.

## Common Anti-patterns: Ineffective Approaches to Avoid

Defending against XSS is hard. For that reason, some have sought shortcuts to preventing XSS.

We're going to examine two common [anti-patterns](https://en.wikipedia.org/wiki/Anti-pattern) that frequently show up in ancient posts, but are still commonly cited as solutions in modern posts about XSS defense on programmer forums such as Stack Overflow and other developer hangouts.

### Sole Reliance on Content-Security-Policy (CSP) Headers

First, let us be clear, we are a strong proponent of CSP when it is used properly. In the context of XSS defense, CSP works best when it it is:

- Used as a defense-in-depth technique.
- Customized for each individual application rather than being deployed as a one-size-fits-all enterprise solution.

What we are against is a blanket CSP policy for the entire enterprise. Problems with that approach are:

#### Problem 1 - Assumption Browser Versions Support CSP Equally

There usually is an implicit assumption that all the customer browsers support all the CSP constructs that your blanket CSP policy is using. Furthermore, this assumption often is done without testing the explicitly the `User-Agent` request header to see if it indeed is a supported browser type and rejecting the use of the site if it is not. Why? Because most businesses don't want to turn away customers if they are using an outdated browser that doesn't support some CSP Level 2 or Level 3 construct that they are relying on for XSS prevention.  (Statistically, almost all browsers support CSP Level 1 directives, so unless you are worried about Grandpa pulling out his old Windows 98 laptop and using some ancient version of Internet Explorer to access your site, CSP Level 1 support can probably be assumed.)

#### Problem 2 - Issues Supporting Legacy Applications

Mandatory universal enterprise-wide CSP response headers are inevitably going to break some web applications, especially legacy ones. This causes the business to push-back against AppSec guidelines and inevitably results in AppSec issuing waivers and/or security exceptions until the application code can be patched up. But these security exceptions allow cracks in your XSS armor, and even if the cracks are temporary they still can impact your business, at least on a reputational basis.

### Reliance on HTTP Interceptors

The other common anti-pattern that we have observed is the attempt to deal with validation and/or output encoding in some sort of interceptor such as a Spring Interceptor that generally implements `org.springframework.web.servlet.HandlerInterceptor` or as a JavaEE servlet filter that implements `javax.servlet.Filter`. While this can be successful for very specific applications (for instance, if you validate that all the input requests that are ever rendered are only alphanumeric data), it violates the major tenet of XSS defense where perform output encoding as close to where the data is rendered is possible. Generally, the HTTP request is examined for query and POST parameters but other things HTTP request headers that might be rendered such as cookie data, are not examined. The common approach that we've seen is someone will call either `ESAPI.validator().getValidSafeHTML()` or `ESAPI.encoder.canonicalize()` and depending on the results will redirect to an error page or call something like `ESAPI.encoder().encodeForHTML()`. Aside from the fact that this approach often misses tainted input such as request headers or "extra path information" in a URI, the approach completely ignores the fact that the output encoding is completely non-contextual. For example, how does a servlet filter know that an input query parameter is going to be rendered in an HTML context (i.e., between HTML tags) rather than in a JavaScript context such as within a `<script>` tag or used with a JavaScript event handler attribute? It doesn't. And because JavaScript and HTML encoding are not interchangeable, you leave yourself still open to XSS attacks.

Unless your filter or interceptor has full knowledge of your application and specifically an awareness of how your application uses each parameter for a given request, it can't succeed for all the possible edge cases. And we would contend that it never will be able to using this approach because providing that additional required context is way too complex of a design and accidentally introducing some other vulnerability (possibly one whose impact is far worse than XSS) is almost inevitable if you attempt it.

This naive approach usually has at least one of these four problems.

#### Problem 1 - Encoding for specific context not satisfactory for all URI paths

One problem is the improper encoding that can still allow exploitable XSS in some URI paths of your application. An example might be a 'lastname' form parameter from a POST that normally is displayed between HTML tags so that HTML encoding is sufficient, but there may be an edge case or two where lastname is actually rendered as part of a JavaScript block where the HTML encoding is not sufficient and thus it is vulnerable to XSS attacks.

#### Problem 2 - Interceptor approach can lead to broken rendering caused by improper or double encoding

A second problem with this approach can be the application can result in incorrect or double encoding. E.g., suppose in the previous example, a developer has done proper output encoding for the JavaScript rendering of lastname. But if it is already been HTML output encoded too, when it is rendered, a legitimate last name like "O'Hara" might come out rendered like "O\&#39;Hara".

While this second case is not strictly a security problem, if it happens often enough, it can result in business push-back against the use of the filter and thus the business may decide on disabling the filter or a way to specify exceptions for certain pages or parameters being filtered, which in turn will weaken any XSS defense that it was providing.

#### Problem 3 - Interceptors not effective against DOM-based XSS

The third problem with this is that it is not effective against DOM-based XSS. To do that, one would have to have an interceptor or filter scan all the JavaScript content going as part of an HTTP response, try to figure out the tainted output and see if it it is susceptible to DOM-based XSS. That simply is not practical.

#### Problem 4 - Interceptors not effective where data from responses originates outside your application

The last problem with interceptors is that they generally are oblivious to data in your application's responses that originate from other internal sources such as an internal REST-based web service or even an internal database. The problem is that unless your application is strictly validating that data _at the point that it is retrieved_ (which generally is the only point your application has enough context to do a strict data validation using an allow-list approach), that data should always be considered tainted. But if you are attempting to do output encoding or strict data validation all of tainted data on the HTTP response side of an interceptor (such as a Java servlet filter), at that point, your application's interceptor will have no idea of there is tainted data present from those REST web services or other databases that you used. The approach that generally is used on response-side interceptors attempting to provide XSS defense has been to only consider the matching "input parameters" as tainted and do output encoding or HTML sanitization on them and everything else is considered safe. But sometimes it's not? While it frequently is assumed that all internal web services and all internal databases can be "trusted" and used as it, this is a very bad assumption to make unless you have included that in some deep threat modeling for your application.

For example, suppose you are working on an application to show a customer their detailed monthly bill. Let's assume that your application is either querying a foreign (as in not part of your specific application) internal database or REST web service that your application uses to obtain the user's full name, address, etc. But that data originates from another application which you are assuming is "trusted" but actually has an unreported persistent XSS vulnerability on the various customer address-related fields. Furthermore, let's assume that you company's customer support staff can examine a customer's detailed bill to assist them when customers have questions about their bills. So nefarious customer decides to plant an XSS bomb in the address field and then calls customer service for assistance with the bill. Should a scenario like that ever play out, an interceptor attempting to prevent XSS is going to miss that completely and the result is going to be something much worse than just popping an alert box to display "1" or "XSS" or "pwn'd".

### Summary

One final note: If deploying interceptors / filters as an XSS defense was a useful approach against XSS attacks, don't you think that it would be incorporated into all commercial Web Application Firewalls (WAFs) and be an approach that OWASP recommends in this cheat sheet?

## Related Articles

**XSS Attack Cheat Sheet:**

The following article describes how attackers can exploit different kinds of XSS vulnerabilities (and this article was created to help you avoid them):

- OWASP: [XSS Filter Evasion Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/XSS_Filter_Evasion_Cheat_Sheet.html).

**Description of XSS Vulnerabilities:**

- OWASP article on [XSS](https://owasp.org/www-community/attacks/xss/) Vulnerabilities.

**Discussion about the Types of XSS Vulnerabilities:**

- [Types of Cross-Site Scripting](https://owasp.org/www-community/Types_of_Cross-Site_Scripting).

**How to Review Code for Cross-Site Scripting Vulnerabilities:**

- [OWASP Code Review Guide](https://owasp.org/www-project-code-review-guide/) article on [Reviewing Code for Cross-site scripting](https://wiki.owasp.org/index.php/Reviewing_Code_for_Cross-site_scripting) Vulnerabilities.

**How to Test for Cross-Site Scripting Vulnerabilities:**

- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/) article on testing for Cross-Site Scripting vulnerabilities.
- [XSS Experimental Minimal Encoding Rules](https://wiki.owasp.org/index.php/XSS_Experimental_Minimal_Encoding_Rules) Provides examples and guidelines for experimental minimal encoding strategies to prevent Cross-Site Scripting (XSS) attacks.
</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語訳</span>
# クロスサイトスクリプティング防止チートシート

## はじめに

このチートシートは、開発者が XSS 脆弱性を防止するためのものです。

Cross-Site Scripting (XSS) という名称は誤解を招くことがあります。もともとこの用語は、主にサイトをまたいだデータ窃取に焦点を当てた初期の攻撃に由来していました。その後、この用語は、基本的にあらゆるコンテンツのインジェクションを含むように広がりました。XSS 攻撃は深刻であり、アカウントのなりすまし、ユーザー行動の観察、外部コンテンツの読み込み、機密データの窃取などにつながる可能性があります。

**このチートシートには、XSS を防止する、または XSS の影響を限定するための技術が含まれています。単一の技術だけで XSS を解決することはできないため、XSS を防止するには適切な防御技術を組み合わせて使用する必要があります。**

## フレームワークセキュリティ

幸いなことに、現代的な Web フレームワークで構築されたアプリケーションでは、XSS バグは少なくなっています。これは、これらのフレームワークが開発者を適切なセキュリティプラクティスへ導き、テンプレート、自動エスケープなどによって XSS の緩和を支援するためです。ただし、次のようにフレームワークを安全でない形で使用すると問題が発生する可能性があることを、開発者は理解しておく必要があります。

- フレームワークが DOM を直接操作するために用意している _escape hatches_
- HTML をサニタイズせずに React の `dangerouslySetInnerHTML` を使用すること
- React は、専門的な検証なしに `javascript:` URL や `data:` URL を扱えないこと
- Angular の `bypassSecurityTrustAs*` 関数
- Lit の `unsafeHTML` 関数
- Polymer の `inner-h-t-m-l` 属性と `htmlLiteral` 関数
- テンプレートインジェクション
- 古くなったフレームワークプラグインやコンポーネント
- その他

現代的な Web フレームワークを使用するときは、そのフレームワークが XSS をどのように防止し、どこにギャップがあるのかを理解する必要があります。フレームワークが提供する保護の外側で何かを行う必要がある場面もあります。そのため、出力エンコーディングと HTML サニタイズが重要になることがあります。OWASP は、React、Vue、Angular 向けのフレームワーク固有のチートシートを作成予定です。

## XSS 防御の考え方

XSS 攻撃が成功するには、攻撃者が悪意のあるコンテンツを Web ページに挿入し、実行できる必要があります。したがって、Web アプリケーション内のすべての変数を保護する必要があります。**すべての変数**が検証され、その後にエスケープまたはサニタイズされることを保証する状態は、**perfect injection resistance** と呼ばれます。この処理を通らない変数は、潜在的な弱点です。フレームワークは、変数が正しく検証され、エスケープまたはサニタイズされるようにすることを容易にします。

しかし、完全なフレームワークは存在せず、React や Angular のような一般的なフレームワークにもセキュリティ上のギャップは残ります。出力エンコーディングと HTML サニタイズは、こうしたギャップに対処する助けになります。

## 出力エンコーディング

ユーザーが入力したデータを、そのまま安全に表示する必要がある場合は、出力エンコーディングが推奨されます。変数は、テキストではなくコードとして解釈されてはいけません。このセクションでは、出力エンコーディングの各形式、使用場所、動的変数をまったく使用すべきでない場合について説明します。

まず、ユーザーが入力したとおりにデータを表示したい場合は、フレームワークのデフォルトの出力エンコーディング保護から始めます。ほとんどのフレームワークには、自動エンコーディングおよびエスケープ関数が組み込まれています。

フレームワークを使用していない場合、またはフレームワークのギャップを補う必要がある場合は、出力エンコーディングライブラリを使用するべきです。ユーザーインターフェイスで使用される各変数は、出力エンコーディング関数を通す必要があります。出力エンコーディングライブラリの一覧は付録に含まれています。

ブラウザは HTML、JS、URL、CSS をそれぞれ異なる方法で解析するため、出力エンコーディングには多くの異なる方法があります。誤ったエンコーディング方法を使用すると、脆弱性が導入されたり、アプリケーションの機能が損なわれたりする可能性があります。

### “HTML コンテキスト” の出力エンコーディング

“HTML Context” とは、`<div>` や `<b>` のような基本的な HTML タグの間に変数を挿入することを指します。例:

```HTML
<div> $varUnsafe </div>
```

攻撃者は、`$varUnsafe` としてレンダリングされるデータを変更できる可能性があります。これにより、攻撃が Web ページに追加される可能性があります。例:

```HTML
<div> <script>alert`1`</script> </div> // Example Attack
```

Web テンプレートの HTML コンテキストへ変数を安全に追加するには、その変数に HTML エンティティエンコーディングを使用します。

特定の文字に対するエンコード値の例を以下に示します。

JavaScript を使用して HTML に書き込む場合は、`.textContent` 属性を検討してください。これは **Safe Sink** であり、自動的に HTML エンティティエンコードを行います。

```HTML
&    &amp;
<    &lt;
>    &gt;
"    &quot;
'    &#x27;
```

### “HTML 属性コンテキスト” の出力エンコーディング

“HTML Attribute Contexts” は、変数が HTML 属性値に置かれる場合に発生します。ハイパーリンクの変更、要素の非表示、画像の alt テキストの追加、インライン CSS スタイルの変更などで、このような処理を行うことがあります。ほとんどの HTML 属性に置かれる変数には、HTML 属性エンコーディングを適用するべきです。安全な HTML 属性の一覧は **Safe Sinks** セクションにあります。

```HTML
<div attr="$varUnsafe">
<div attr=”*x” onblur=”alert(1)*”> // Example Attack
```

**変数を囲むために `"` や `'` のような引用符を使用することは極めて重要です。** 引用符で囲むと、変数が動作するコンテキストを変更しにくくなり、XSS の防止に役立ちます。また、引用符で囲むことでエンコードが必要な文字セットが大幅に減り、アプリケーションの信頼性が高まり、エンコーディングの実装も容易になります。

JavaScript で HTML 属性へ書き込む場合は、`.setAttribute` メソッドと `[attribute]` メソッドを検討してください。これらは自動的に HTML 属性エンコードを行うためです。属性名がハードコードされており、`id` や `class` のように無害である限り、これらは **Safe Sinks** です。一般に、`onClick` など JavaScript を受け付ける属性は、信頼できない属性値と組み合わせて使用するには **安全ではありません**。

### “JavaScript コンテキスト” の出力エンコーディング

“JavaScript Contexts” とは、変数がインライン JavaScript に置かれ、その JavaScript が HTML 文書に埋め込まれる状況を指します。この状況は、Web ページに埋め込まれたカスタム JavaScript を多用するプログラムでよく発生します。

ただし、JavaScript 内で変数を置くための唯一の “安全な” 場所は、“引用符で囲まれたデータ値” の内部です。その他のコンテキストはすべて安全ではなく、そこに変数データを置くべきではありません。

“引用符で囲まれたデータ値” の例:

```HTML
<script>alert('$varUnsafe’)</script>
<script>x=’$varUnsafe’</script>
<div onmouseover="'$varUnsafe'"</div>
```

すべての文字を `\xHH` 形式でエンコードします。エンコーディングライブラリには、この機能をサポートする `EncodeForJavaScript` または類似の関数が用意されていることがよくあります。

最小限のエンコーディングで適切に JavaScript を使用する例については、[OWASP Java Encoder JavaScript encoding examples](https://owasp.org/www-project-java-encoder/) を参照してください。

JSON については、XSS を防止するために、`Content-Type` ヘッダーが `text/html` ではなく `application/json` であることを確認してください。

### “CSS コンテキスト” の出力エンコーディング

“CSS Contexts” とは、変数がインライン CSS に置かれることを指します。これは、開発者がユーザーに Web ページの見た目をカスタマイズさせたい場合によく発生します。CSS は意外なほど強力であるため、多くの種類の攻撃に使用されてきました。**変数は CSS プロパティ値のみに置くべきです。その他の “CSS Contexts” は安全ではなく、そこに変数データを置くべきではありません。**

```HTML
<style> selector { property : $varUnsafe; } </style>
<style> selector { property : "$varUnsafe"; } </style>
<span style="property : $varUnsafe">Oh no</span>
```

JavaScript を使用して CSS プロパティを変更する場合は、`style.property = x` の使用を検討してください。これは **Safe Sink** であり、その中のデータを自動的に CSS エンコードします。

CSS プロパティに変数を挿入する場合は、インジェクション攻撃を防止するために、データが適切にエンコードおよびサニタイズされていることを確認してください。セレクタやその他の CSS コンテキストに変数を直接置くことは避けてください。

### “URL コンテキスト” の出力エンコーディング

“URL Contexts” とは、変数が URL に置かれることを指します。最も一般的には、開発者が URL ベースにパラメータや URL フラグメントを追加し、それを表示したり何らかの操作に使用したりします。こうしたシナリオでは URL エンコーディングを使用します。

```HTML
<a href="http://www.owasp.org?test=$varUnsafe">link</a >
```

すべての文字を `%HH` エンコーディング形式でエンコードします。JS や CSS と同様に、属性が完全に引用符で囲まれていることを確認してください。

#### よくある間違い

URL を異なるコンテキストで使用する状況があります。最も一般的なのは、URL を `<a>` タグの `href` 属性や `src` 属性に追加する場合です。こうしたシナリオでは、URL エンコーディングを行い、その後に HTML 属性エンコーディングを行うべきです。

```HTML
url = "https://site.com?data=" + urlencode(parameter)
<a href='attributeEncode(url)'>link</a>
```

JavaScript を使用して URL クエリ値を構築する場合は、`window.encodeURIComponent(x)` の使用を検討してください。これは **Safe Sink** であり、その中のデータを自動的に URL エンコードします。

### 危険なコンテキスト

出力エンコーディングは完全ではありません。常に XSS を防止できるわけではありません。こうした場所は **危険なコンテキスト** と呼ばれます。危険なコンテキストには次のものがあります。

```HTML
<script>Directly in a script</script>
<!-- Inside an HTML comment -->
<style>Directly in CSS</style>
<div ToDefineAnAttribute=test />
<ToDefineATag href="/test" />
```

ほかにも注意すべき領域があります。

- コールバック関数
- この CSS のように URL がコード内で扱われる場所: `{ background-url : “javascript:alert(xss)”; }`
- すべての JavaScript イベントハンドラ (`onclick()`, `onerror()`, `onmouseover()`)
- `eval()`, `setInterval()`, `setTimeout()` のような安全でない JS 関数

出力エンコーディングを行っていても XSS 攻撃を完全には防止できないため、危険なコンテキストに変数を置いてはいけません。

## HTML サニタイズ

ユーザーが HTML を作成する必要がある場合、開発者は WYSIWYG エディタ内でコンテンツのスタイルや構造を変更できるようにすることがあります。この場合、出力エンコーディングは XSS を防止しますが、アプリケーションの意図した機能を壊します。スタイルがレンダリングされなくなるためです。こうした場合は、HTML サニタイズを使用するべきです。

HTML サニタイズは、変数から危険な HTML を取り除き、安全な HTML 文字列を返します。OWASP は HTML サニタイズに [DOMPurify](https://github.com/cure53/DOMPurify) を推奨しています。

```js
let clean = DOMPurify.sanitize(dirty);
```

さらに考慮すべき点があります。

- コンテンツをサニタイズした後で変更すると、セキュリティ上の取り組みを簡単に無効化してしまう可能性があります。
- コンテンツをサニタイズした後でライブラリに渡して使用する場合は、そのライブラリが何らかの形で文字列を変異させないことを確認してください。そうでなければ、この場合もセキュリティ上の取り組みは無効になります。
- DOMPurify または使用しているその他の HTML サニタイズライブラリには、定期的にパッチを適用する必要があります。ブラウザの機能は変化し、バイパス手法も継続的に発見されています。

## Safe Sinks

セキュリティ専門家は、source と sink という用語で話すことがよくあります。川を汚染すると、その汚染はどこか下流へ流れていきます。コンピュータセキュリティでも同じです。XSS sink は、変数が Web ページに置かれる場所です。

ありがたいことに、変数を置ける多くの sink は安全です。これは、これらの sink が変数をテキストとして扱い、決して実行しないためです。`innerHTML` のような安全でない sink への参照を取り除くようコードをリファクタリングし、代わりに `textContent` や `value` を使用するようにしてください。

```js
elem.textContent = dangerVariable;
elem.insertAdjacentText(dangerVariable);
elem.className = dangerVariable;
elem.setAttribute(safeName, dangerVariable);
formfield.value = dangerVariable;
document.createTextNode(dangerVariable);
document.createElement(dangerVariable);
elem.innerHTML = DOMPurify.sanitize(dangerVar);
```

**安全な HTML 属性には次のものが含まれます:** `align`, `alink`, `alt`, `bgcolor`, `border`, `cellpadding`, `cellspacing`, `class`, `color`, `cols`, `colspan`, `coords`, `dir`, `face`, `height`, `hspace`, `ismap`, `lang`, `marginheight`, `marginwidth`, `multiple`, `nohref`, `noresize`, `noshade`, `nowrap`, `ref`, `rel`, `rev`, `rows`, `rowspan`, `scrolling`, `shape`, `span`, `summary`, `tabindex`, `title`, `usemap`, `valign`, `value`, `vlink`, `vspace`, `width`。

上記に記載されていない属性については、JavaScript コードが値として提供された場合に、それが実行されないことを確認してください。

## その他の制御

フレームワークのセキュリティ保護、出力エンコーディング、HTML サニタイズは、アプリケーションに最良の保護を提供します。OWASP はあらゆる状況でこれらを推奨しています。

上記に加えて、次の制御の採用を検討してください。

- Cookie Attributes - JavaScript とブラウザが Cookie とどのように相互作用できるかを変更します。Cookie 属性は XSS 攻撃の影響を限定しようとしますが、悪意のあるコンテンツの実行を防止したり、脆弱性の根本原因に対処したりするものではありません。
- Content Security Policy - 読み込まれるコンテンツを防止する許可リストです。実装時にミスをしやすいため、主要な防御機構にするべきではありません。CSP は追加の多層防御として使用し、[こちらのチートシート](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html)を参照してください。
- Trusted Types - Chromium ベースのブラウザでは、`Content-Security-Policy: require-trusted-types-for 'script'` を追加して [Trusted Types](https://web.dev/articles/trusted-types) を有効化します。これにより、DOM XSS sink (`innerHTML`, `outerHTML`, `document.write`, `script.src` など) はプレーン文字列を拒否し、すべての代入が検証済みポリシーを通ることを強制されます。これは、DOM XSS のクラス全体を緩和ではなく排除できる数少ない制御の一つです。レガシーコードパスでは、サニタイザ (例: DOMPurify) に委譲するデフォルトポリシーと組み合わせてください。
- Web Application Firewalls - 既知の攻撃文字列を探してブロックします。WAF は信頼性が低く、新しいバイパス手法が定期的に発見されています。また、WAF は XSS 脆弱性の根本原因に対処しません。さらに WAF は、クライアント側でのみ動作する種類の XSS 脆弱性を見逃します。WAF は、特に DOM-Based XSS の防止には推奨されません。

### XSS 防止ルールのまとめ

これらの HTML スニペットは、さまざまな異なるコンテキストで信頼できないデータを安全にレンダリングする方法を示しています。

Data Type: String
Context: HTML Body
Code: `<span>UNTRUSTED DATA </span>`
Sample Defense: HTML Entity Encoding (rule \#1)

Data Type: String
Context: Safe HTML Attributes
Code: `<input type="text" name="fname" value="UNTRUSTED DATA ">`
Sample Defense: Aggressive HTML Entity Encoding (rule \#2), Only place untrusted data into a list of safe attributes (listed below), Strictly validate unsafe attributes such as background, ID and name.

Data Type: String
Context: GET Parameter
Code: `<a href="/site/search?value=UNTRUSTED DATA ">clickme</a>`
Sample Defense: URL Encoding (rule \#5).

Data Type: String
Context: Untrusted URL in a SRC or HREF attribute
Code: `<a href="UNTRUSTED URL ">clickme</a> <iframe src="UNTRUSTED URL " />`
Sample Defense: Canonicalize input, URL Validation, Safe URL verification, Allow-list http and HTTPS URLs only (Avoid the JavaScript Protocol to Open a new Window), Attribute encoder.

Data Type: String
Context: CSS Value
Code: `HTML <div style="width: UNTRUSTED DATA ;">Selection</div>`
Sample Defense: Strict structural validation (rule \#4), CSS hex encoding, Good design of CSS features.

Data Type: String
Context: JavaScript Variable
Code: `<script>var currentValue='UNTRUSTED DATA ';</script> <script>someFunction('UNTRUSTED DATA ');</script>`
Sample Defense: Ensure JavaScript variables are quoted, JavaScript hex encoding, JavaScript Unicode encoding, avoid backslash encoding (`\"` or `\'` or `\\`).

Data Type: HTML
Context: HTML Body
Code: `<div>UNTRUSTED HTML</div>`
Sample Defense: HTML validation (JSoup, AntiSamy, HTML Sanitizer...).

Data Type: String
Context: DOM XSS
Code: `<script>document.write("UNTRUSTED INPUT: " + document.location.hash );<script/>`
Sample Defense: [DOM based XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html) |

### 出力エンコーディングルールのまとめ

Cross Site Scripting に関連する出力エンコーディングの目的は、信頼できない入力を安全な形式に変換し、ブラウザで **code** として実行されることなく、ユーザーに **data** として表示されるようにすることです。次の表は、Cross Site Scripting を止めるために必要な重要な出力エンコーディング方法の一覧を示しています。

Encoding Type: HTML Entity
Encoding Mechanism: `&` を `&amp;` に変換し、`<` を `&lt;` に変換し、`>` を `&gt;` に変換し、`"` を `&quot;` に変換し、`'` を `&#x27` に変換します。

Encoding Type: HTML Attribute Encoding
Encoding Mechanism: スペースを含むすべての文字を HTML Entity `&#xHH;` 形式でエンコードします。ここで **HH** は Unicode における文字の 16 進値を表します。たとえば、`A` は `&#x41` になります。すべての英数字 (A から Z、a から z、0 から 9) はエンコードされないまま残ります。

Encoding Type: URL Encoding
Encoding Mechanism: [W3C specification](http://www.w3.org/TR/html401/interact/forms.html#h-17.13.4.1) で規定されている標準のパーセントエンコーディングを使用して、パラメータ値をエンコードします。注意して、URL 全体や URL のパスフラグメントではなく、パラメータ値のみをエンコードしてください。

Encoding Type: JavaScript Encoding
Encoding Mechanism: すべての文字を Unicode `\uXXXX` エンコーディング形式でエンコードします。ここで **XXXX** は 16 進 Unicode コードポイントを表します。たとえば、`A` は `\u0041` になります。すべての英数字 (A から Z、a から z、0 から 9) はエンコードされないまま残ります。

Encoding Type: CSS Hex Encoding
Encoding Mechanism: CSS エンコーディングは `\XX` と `\XXXXXX` の両方の形式をサポートします。適切なエンコーディングを確保するには、次の選択肢を検討してください: (a) CSS エンコードの後にスペースを追加する (CSS パーサにより無視されます)、または (b) 値をゼロパディングして完全な 6 文字の CSS エンコーディング形式を使用する。たとえば、`A` は `\41` (短縮形式) または `\000041` (完全形式) になります。英数字 (A から Z、a から z、0 から 9) はエンコードされないまま残ります。

## 一般的なアンチパターン: 避けるべき効果の低いアプローチ

XSS から防御することは困難です。そのため、XSS 防止の近道を探す人もいます。

ここでは、古い投稿で頻繁に見られる一方で、Stack Overflow やその他の開発者コミュニティのようなプログラマ向けフォーラムにおける現代の XSS 防御の投稿でも、解決策としていまだによく引用される 2 つの一般的な [anti-patterns](https://en.wikipedia.org/wiki/Anti-pattern) を確認します。

### Content-Security-Policy (CSP) ヘッダーだけに依存すること

まず明確にしておくと、CSP が適切に使用される場合、私たちは CSP を強く支持しています。XSS 防御の文脈では、CSP は次の場合に最も効果的に機能します。

- 多層防御技術として使用される。
- 万能のエンタープライズ向け一律ソリューションとして展開されるのではなく、個々のアプリケーションごとにカスタマイズされる。

私たちが反対しているのは、企業全体に対する一律の CSP ポリシーです。そのアプローチには次の問題があります。

#### 問題 1 - ブラウザバージョンが CSP を同じようにサポートしているという前提

通常、すべての顧客ブラウザが、その一律 CSP ポリシーで使用しているすべての CSP 構文をサポートしているという暗黙の前提があります。さらに、この前提は多くの場合、`User-Agent` リクエストヘッダーを明示的にテストし、それが本当にサポートされているブラウザ種別であるかを確認して、そうでなければサイトの利用を拒否する、ということなしに置かれます。なぜでしょうか。多くの企業は、XSS 防止のために依存している CSP Level 2 や Level 3 の構文をサポートしない古いブラウザを顧客が使っているという理由で、その顧客を拒みたくないからです。(統計的には、ほぼすべてのブラウザが CSP Level 1 ディレクティブをサポートしているため、誰かが古い Windows 98 ノート PC を取り出し、非常に古い Internet Explorer でサイトにアクセスすることを心配しているのでない限り、CSP Level 1 のサポートはおそらく前提としてよいでしょう。)

#### 問題 2 - レガシーアプリケーションをサポートする際の問題

企業全体で必須となる普遍的な CSP レスポンスヘッダーは、特にレガシーアプリケーションなど、一部の Web アプリケーションを必然的に壊します。これにより、ビジネス側は AppSec ガイドラインに反発し、最終的に AppSec がアプリケーションコードを修正できるまで waiver やセキュリティ例外を発行することになります。しかし、これらのセキュリティ例外は XSS 防御に亀裂を生じさせます。その亀裂が一時的なものであっても、少なくとも評判の面でビジネスに影響を与える可能性があります。

### HTTP インターセプタへの依存

私たちが観察してきたもう一つの一般的なアンチパターンは、通常 `org.springframework.web.servlet.HandlerInterceptor` を実装する Spring Interceptor や、`javax.servlet.Filter` を実装する JavaEE サーブレットフィルタのようなインターセプタで、検証や出力エンコーディングに対処しようとする試みです。これは非常に特定のアプリケーションでは成功する可能性があります (たとえば、レンダリングされるすべての入力リクエストが英数字データだけであることを検証する場合)。しかし、データがレンダリングされる場所のできるだけ近くで出力エンコーディングを行うという XSS 防御の主要原則に違反します。一般に、HTTP リクエストではクエリパラメータや POST パラメータが検査されますが、Cookie データなど、レンダリングされる可能性があるその他の HTTP リクエストヘッダーは検査されません。よく見られるアプローチでは、誰かが `ESAPI.validator().getValidSafeHTML()` または `ESAPI.encoder.canonicalize()` を呼び出し、その結果に応じてエラーページへリダイレクトしたり、`ESAPI.encoder().encodeForHTML()` のようなものを呼び出したりします。このアプローチは、リクエストヘッダーや URI の “extra path information” のような汚染された入力をしばしば見逃すだけでなく、出力エンコーディングが完全に非コンテキスト的であるという事実を完全に無視します。たとえば、サーブレットフィルタは、入力クエリパラメータが HTML コンテキスト (つまり HTML タグの間) でレンダリングされるのか、`<script>` タグ内のような JavaScript コンテキストでレンダリングされるのか、あるいは JavaScript イベントハンドラ属性で使用されるのかを、どうやって知るのでしょうか。知ることはできません。そして JavaScript エンコーディングと HTML エンコーディングは相互に置き換えられないため、XSS 攻撃に対して依然として脆弱なままになります。

フィルタやインターセプタがアプリケーションを完全に理解し、特に特定のリクエストに対してアプリケーションが各パラメータをどのように使用するかを認識していない限り、考えられるすべてのエッジケースで成功することはできません。さらに、その追加のコンテキストを提供する設計はあまりにも複雑であり、試みれば別の脆弱性 (場合によっては XSS よりはるかに影響の大きい脆弱性) を偶発的に導入することがほぼ避けられないため、このアプローチで成功することは決してないと私たちは考えています。

この素朴なアプローチには、通常、少なくとも次の 4 つの問題のいずれかがあります。

#### 問題 1 - 特定コンテキスト向けのエンコーディングがすべての URI パスに適しているわけではない

一つ目の問題は、不適切なエンコーディングにより、アプリケーション内の一部の URI パスで悪用可能な XSS が依然として許容される可能性があることです。例として、POST された `lastname` フォームパラメータが通常は HTML タグの間に表示されるため HTML エンコーディングで十分である一方で、1 つか 2 つのエッジケースでは lastname が JavaScript ブロックの一部としてレンダリングされるため HTML エンコーディングでは不十分となり、XSS 攻撃に対して脆弱になる場合があります。

#### 問題 2 - インターセプタ方式は不適切なエンコーディングや二重エンコーディングによって表示を壊す可能性がある

このアプローチの二つ目の問題は、アプリケーションが不正確なエンコーディングや二重エンコーディングを引き起こす可能性があることです。たとえば前の例で、開発者が lastname を JavaScript としてレンダリングするために適切な出力エンコーディングを行っていたとします。しかし、それがすでに HTML 出力エンコードもされていた場合、レンダリング時に "O'Hara" のような正当な姓が "O\&#39;Hara" のように表示される可能性があります。

この二つ目のケースは厳密にはセキュリティ問題ではありませんが、頻繁に発生すると、フィルタの使用に対するビジネス側の反発につながる可能性があります。その結果、ビジネス側がフィルタを無効化する、または特定のページやパラメータをフィルタ対象外にする方法を決定する可能性があり、ひいてはそのフィルタが提供していた XSS 防御を弱めることになります。

#### 問題 3 - インターセプタは DOM-based XSS に効果がない

三つ目の問題は、この方法が DOM-based XSS に対して効果がないことです。それを行うには、インターセプタやフィルタが HTTP レスポンスの一部として送られるすべての JavaScript コンテンツをスキャンし、汚染された出力を特定し、それが DOM-based XSS の影響を受けるかどうかを判断する必要があります。それは現実的ではありません。

#### 問題 4 - インターセプタはレスポンス内のデータがアプリケーション外から来る場合に効果がない

インターセプタに関する最後の問題は、内部 REST ベースの Web サービスや内部データベースなど、他の内部ソースに由来するアプリケーションレスポンス内のデータに対して、一般に無頓着であることです。問題は、アプリケーションがそのデータを _取得した時点で_ 厳格に検証していない限り (通常、その時点だけが、許可リスト方式による厳格なデータ検証を行うための十分なコンテキストをアプリケーションが持つ唯一の時点です)、そのデータは常に汚染されているとみなすべきだということです。しかし、インターセプタの HTTP レスポンス側 (Java サーブレットフィルタなど) ですべての汚染データに対して出力エンコーディングや厳格なデータ検証を試みる場合、その時点でアプリケーションのインターセプタは、使用した REST Web サービスやその他のデータベースから汚染データが存在しているかどうかを知ることができません。XSS 防御を提供しようとするレスポンス側インターセプタで一般に使われるアプローチは、一致する “入力パラメータ” だけを汚染されているとみなし、それらに出力エンコーディングまたは HTML サニタイズを行い、それ以外はすべて安全とみなすことです。しかし、安全でない場合もあります。すべての内部 Web サービスと内部データベースは “信頼できる” と頻繁に仮定され、そのまま使用されますが、アプリケーションの深い脅威モデリングにそれを含めていない限り、これは非常に悪い仮定です。

たとえば、顧客に詳細な月次請求書を表示するアプリケーションで作業しているとします。アプリケーションが、ユーザーの氏名、住所などを取得するために、外部の (つまり特定のアプリケーションの一部ではない) 内部データベースまたは REST Web サービスに問い合わせていると仮定します。しかし、そのデータは、あなたが “信頼できる” と仮定している別のアプリケーションに由来しており、実際には顧客住所関連フィールドに未報告の永続型 XSS 脆弱性を抱えているとします。さらに、あなたの会社のカスタマーサポート担当者は、顧客が請求書について質問したときに支援するため、その顧客の詳細な請求書を確認できるとします。そこで悪意のある顧客が住所フィールドに XSS 爆弾を仕込み、請求書について支援を求めてカスタマーサービスに電話します。そのようなシナリオが実際に起きた場合、XSS を防止しようとするインターセプタはそれを完全に見逃し、その結果は "1"、"XSS"、"pwn'd" を表示する alert ボックスを出すだけよりも、はるかに悪いものになります。

### まとめ

最後に一つ注意します。XSS 防御としてインターセプタやフィルタを配備することが XSS 攻撃に対して有用なアプローチであるなら、それはすべての商用 Web Application Firewall (WAF) に組み込まれ、OWASP がこのチートシートで推奨するアプローチになっているはずだと思いませんか。

## 関連記事

**XSS 攻撃チートシート:**

次の記事では、攻撃者がさまざまな種類の XSS 脆弱性をどのように悪用できるかを説明しています (この記事は、それらを回避する助けになるよう作成されています)。

- OWASP: [XSS Filter Evasion Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/XSS_Filter_Evasion_Cheat_Sheet.html)。

**XSS 脆弱性の説明:**

- [XSS](https://owasp.org/www-community/attacks/xss/) 脆弱性に関する OWASP 記事。

**XSS 脆弱性の種類に関する議論:**

- [Types of Cross-Site Scripting](https://owasp.org/www-community/Types_of_Cross-Site_Scripting)。

**Cross-Site Scripting 脆弱性についてコードをレビューする方法:**

- [Reviewing Code for Cross-site scripting](https://wiki.owasp.org/index.php/Reviewing_Code_for_Cross-site_scripting) 脆弱性に関する [OWASP Code Review Guide](https://owasp.org/www-project-code-review-guide/) の記事。

**Cross-Site Scripting 脆弱性をテストする方法:**

- Cross-Site Scripting 脆弱性のテストに関する [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/) の記事。
- [XSS Experimental Minimal Encoding Rules](https://wiki.owasp.org/index.php/XSS_Experimental_Minimal_Encoding_Rules) は、Cross-Site Scripting (XSS) 攻撃を防止するための実験的な最小エンコーディング戦略について、例とガイドラインを提供します。

</div>
</div>

</section>
</div>

## Attribution

<div className="attributionFooter">

- Original: Cross Site Scripting Prevention Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: English original retained for comparison. Japanese translation added. Bilingual display generated from official source and local Japanese translation.
- Retrieved: 2026-05-21

</div>
