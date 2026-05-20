---
title: Cross Site Scripting Prevention Cheat Sheet
hide_title: true
---

<div className="docHero" data-category="encoding-and-sanitization">
  <h1>XSS 防止チートシート</h1>
  <div className="docMeta">
    <span className="docPill">最終更新: 2026-05-20</span>
    <span className="docPill">読了時間: 約 15 分</span>
    <span className="docPill">カテゴリ: 入力検証とサニタイズ</span>
  </div>
</div>

<p className="docLead">XSS 防止チートシートを、原文・翻訳・要点・チェックリスト・対比表示で確認できます。ASVS Index 対応の文脈で、理解と実装確認を進めやすく整理しています。</p>

<div className="tabbedContent">
  <input className="tabInput" type="radio" name="xss-prevention-view" id="xss-prevention-original" />
  <input className="tabInput" type="radio" name="xss-prevention-view" id="xss-prevention-translation" defaultChecked />
  <input className="tabInput" type="radio" name="xss-prevention-view" id="xss-prevention-summary" />
  <input className="tabInput" type="radio" name="xss-prevention-view" id="xss-prevention-checklist" />
  <input className="tabInput" type="radio" name="xss-prevention-view" id="xss-prevention-bilingual" />

  <div className="contentTabs">
    <label htmlFor="xss-prevention-original" title="OWASP 原文">原本</label>
    <label htmlFor="xss-prevention-translation" title="日本語訳">翻訳</label>
    <label htmlFor="xss-prevention-summary" title="短くまとめた内容">要点</label>
    <label htmlFor="xss-prevention-checklist" title="実装確認用">チェックリスト</label>
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

Encode all characters using the `\\xHH` format. Encoding libraries often have a `EncodeForJavaScript` or similar to support this function.

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
Sample Defense: HTML Entity Encoding (rule \\#1)

Data Type: String
Context: Safe HTML Attributes
Code: `<input type="text" name="fname" value="UNTRUSTED DATA ">`
Sample Defense: Aggressive HTML Entity Encoding (rule \\#2), Only place untrusted data into a list of safe attributes (listed below), Strictly validate unsafe attributes such as background, ID and name.

Data Type: String
Context: GET Parameter
Code: `<a href="/site/search?value=UNTRUSTED DATA ">clickme</a>`
Sample Defense: URL Encoding (rule \\#5).

Data Type: String
Context: Untrusted URL in a SRC or HREF attribute
Code: `<a href="UNTRUSTED URL ">clickme</a> <iframe src="UNTRUSTED URL " />`
Sample Defense: Canonicalize input, URL Validation, Safe URL verification, Allow-list http and HTTPS URLs only (Avoid the JavaScript Protocol to Open a new Window), Attribute encoder.

Data Type: String
Context: CSS Value
Code: `HTML <div style="width: UNTRUSTED DATA ;">Selection</div>`
Sample Defense: Strict structural validation (rule \\#4), CSS hex encoding, Good design of CSS features.

Data Type: String
Context: JavaScript Variable
Code: `<script>var currentValue='UNTRUSTED DATA ';</script> <script>someFunction('UNTRUSTED DATA ');</script>`
Sample Defense: Ensure JavaScript variables are quoted, JavaScript hex encoding, JavaScript Unicode encoding, avoid backslash encoding (`\\"` or `\\'` or `\\\\`).

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
Encoding Mechanism: Encode all characters using the Unicode `\\uXXXX` encoding format, where **XXXX** represents the hexadecimal Unicode code point. For example, `A` becomes `\\u0041`. All alphanumeric characters (letters A to Z, a to z, and digits 0 to 9) remain unencoded.

Encoding Type: CSS Hex Encoding
Encoding Mechanism: CSS encoding supports both `\\XX` and `\\XXXXXX` formats. To ensure proper encoding, consider these options: (a) Add a space after the CSS encode (which will be ignored by the CSS parser), or (b) use the full six-character CSS encoding format by zero-padding the value. For example, `A` becomes `\\41` (short format) or `\\000041` (full format). Alphanumeric characters (letters A to Z, a to z, and digits 0 to 9) remain unencoded.

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

A second problem with this approach can be the application can result in incorrect or double encoding. E.g., suppose in the previous example, a developer has done proper output encoding for the JavaScript rendering of lastname. But if it is already been HTML output encoded too, when it is rendered, a legitimate last name like "O'Hara" might come out rendered like "O\\&#39;Hara".

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

</section>

<section id="xss-prevention-summary-panel" className="tabPanel summaryPanel contentPanel">

- フレームワークの自動エスケープを使い、escape hatch や危険な DOM 操作を重点レビューする。
- HTML、HTML 属性、JavaScript、CSS、URL でエンコード方法を分ける。
- JavaScript 内で変数を置ける安全な場所は引用されたデータ値だけに限定する。
- `script`、HTML コメント、`style`、動的なタグ名や属性名、イベントハンドラ、`eval()` などの危険なコンテキストへ変数を入れない。
- ユーザー生成 HTML は DOMPurify などでサニタイズし、サニタイズ後に再加工して安全性を壊さない。
- `innerHTML` を避け、`textContent`、`insertAdjacentText`、安全な `setAttribute` などの safe sink を使う。
- CSP は多層防御として使い、CSP だけに依存しない。
- HTTP インターセプタの一律エンコードは、コンテキスト不一致、二重エンコード、DOM based XSS の見落としを起こしやすい。

</section>

<section id="xss-prevention-checklist-panel" className="tabPanel checklistPanel contentPanel">

## V1.2 Injection Prevention

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

</section>

<section id="xss-prevention-bilingual-panel" className="tabPanel bilingualPanel">

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Introduction

This cheat sheet helps developers prevent XSS vulnerabilities.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## Introduction

このチートシートは、開発者が XSS 脆弱性を防ぐためのものです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Cross-Site Scripting (XSS) is a misnomer. Originally this term was derived from early versions of the attack that were primarily focused on stealing data cross-site. Since then, the term has widened to include injection of basically any content. XSS attacks are serious and can lead to account impersonation, observing user behaviour, loading external content, stealing sensitive data, and more.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Cross-Site Scripting (XSS) という名称は誤解を招きます。もともとは、主にクロスサイトでデータを盗むことに焦点を当てた初期の攻撃から生まれた用語でした。その後、この用語は基本的にあらゆるコンテンツのインジェクションを含むように広がりました。XSS 攻撃は深刻であり、アカウントのなりすまし、ユーザー行動の観察、外部コンテンツの読み込み、機密データの窃取などにつながる可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**This cheatsheet contains techniques to prevent or limit the impact of XSS. Since no single technique will solve XSS, using the right combination of defensive techniques will be necessary to prevent XSS.**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**このチートシートには、XSS を防止する、または影響を限定するための技術が含まれています。単一の技術だけで XSS を解決することはできないため、XSS を防ぐには適切な防御技術を組み合わせる必要があります。**

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Framework Security

Fortunately, applications built with modern web frameworks have fewer XSS bugs, because these frameworks steer developers towards good security practices and help mitigate XSS by using templating, auto-escaping, and more. However, developers need to know that problems can occur if frameworks are used insecurely, such as:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## フレームワークセキュリティ

現代的な Web フレームワークは、テンプレート、自動エスケープ、DOM 操作の抽象化により XSS を減らします。ただし、escape hatch を使って DOM を直接操作する場合、フレームワークの保護を迂回できます。React の `dangerouslySetInnerHTML`、Angular の `bypassSecurityTrustAs*`、Lit の `unsafeHTML`、テンプレートインジェクション、古いプラグインやコンポーネントは重点的にレビューします。React は `javascript:` や `data:` URL を専門的な検証なしに安全化できません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- _escape hatches_ that frameworks use to directly manipulate the DOM
- React’s `dangerouslySetInnerHTML` without sanitising the HTML
- React cannot handle `javascript:` or `data:` URLs without specialized validation
- Angular’s `bypassSecurityTrustAs*` functions
- Lit's `unsafeHTML` function
- Polymer's `inner-h-t-m-l` attribute and `htmlLiteral` function
- Template injection
- Out of date framework plugins or components
- and more

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## XSS 防御の考え方

攻撃者が悪意あるコンテンツをページへ挿入し実行できると XSS が成立します。すべての変数を検証し、適切にエスケープまたはサニタイズする状態を perfect injection resistance と呼びます。この処理を通らない変数は弱点になります。フレームワークは多くの変数を自動的に保護しますが、保護の穴は残るため、出力エンコーディングと HTML サニタイズが必要です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

When you use a modern web framework, you need to know how your framework prevents XSS and where it has gaps. There will be times where you need to do something outside the protection provided by your framework, which means that Output Encoding and HTML Sanitization can be critical. OWASP will be producing framework specific cheatsheets for React, Vue, and Angular.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 出力エンコーディング

ユーザーが入力した値をテキストとして安全に表示する場合は、出力エンコーディングを使います。変数をコードではなくテキストとして扱わせることが目的です。HTML、HTML 属性、JavaScript、CSS、URL はブラウザの解釈方法が異なるため、同じエンコーディングを使い回してはいけません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## XSS Defense Philosophy

In order for an XSS attack to be successful, an attacker must be able to insert and execute malicious content in a webpage. Thus, all variables in a web application needs to be protected. Ensuring that **all variables** go through validation and are then escaped or sanitized is known as **perfect injection resistance**. Any variable that does not go through this process is a potential weakness. Frameworks make it easy to ensure variables are correctly validated and escaped or sanitised.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

HTML コンテキストでは、`<div>$var</div>` のようにタグの間へ値を入れる場合、HTML エンティティエンコーディングを行います。JavaScript で HTML テキストを書き込む場合は、`.textContent` などの安全な sink を使います。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

However, no framework is perfect and security gaps still exist in popular frameworks like React and Angular. Output encoding and HTML sanitization help address those gaps.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

HTML 属性コンテキストでは、属性値へ入れる変数に HTML 属性エンコーディングを行い、変数を必ず引用符で囲みます。`setAttribute` は属性名が `id` や `class` のように固定かつ無害な場合に安全な sink になります。`onclick` など JavaScript を受け付ける属性へ信頼できない値を入れてはいけません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Output Encoding

When you need to safely display data exactly as a user types it in, output encoding is recommended. Variables should not be interpreted as code instead of text. This section covers each form of output encoding, where to use it, and when you should not use dynamic variables at all.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

JavaScript コンテキストでは、変数を置ける安全な場所は引用されたデータ値だけです。それ以外の inline JavaScript へ変数を置くのは危険です。必要な場合は `\xHH` 形式で JavaScript エンコードします。JSON を返す場合は、`Content-Type` を `text/html` ではなく `application/json` にします。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

First, when you wish to display data as the user typed it in, start with your framework’s default output encoding protection. Automatic encoding and escaping functions are built into most frameworks.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

CSS コンテキストでは、変数を CSS プロパティ値に限定します。セレクタやその他の CSS 文脈へ変数を直接入れてはいけません。JavaScript で CSS を変更する場合は、`style.property = value` のような安全な sink を使います。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

If you’re not using a framework or need to cover gaps in the framework then you should use an output encoding library. Each variable used in the user interface should be passed through an output encoding function. A list of output encoding libraries is included in the appendix.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

URL コンテキストでは、URL パラメータやフラグメントに入る値を `%HH` 形式で URL エンコードします。URL を `href` や `src` の属性に入れる場合は、URL エンコード後に HTML 属性エンコーディングも行います。JavaScript で URL クエリ値を構築する場合は `encodeURIComponent` を使います。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

There are many different output encoding methods because browsers parse HTML, JS, URLs, and CSS differently. Using the wrong encoding method may introduce weaknesses or harm the functionality of your application.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 危険なコンテキスト

出力エンコーディングは万能ではありません。`<script>` の中、HTML コメント内、`<style>` の中、タグ名や属性名を動的に定義する場所、JavaScript イベントハンドラ、`eval()`、`setInterval()`、`setTimeout()` などは危険なコンテキストです。これらの場所へ信頼できない変数を入れてはいけません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Output Encoding for “HTML Contexts”

“HTML Context” refers to inserting a variable between two basic HTML tags like a `<div>` or `<b>`. For example:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## HTML サニタイズ

WYSIWYG エディタなど、ユーザーが HTML を作成する必要がある場合、出力エンコーディングだけでは HTML が表示されず機能を壊します。この場合は HTML サニタイズを使います。HTML サニタイズは危険な HTML を取り除き、安全な HTML 文字列を返します。OWASP は DOMPurify を推奨しています。サニタイズ後に文字列を変更したり、ライブラリが文字列を変異させたりすると、サニタイズの効果が失われる可能性があります。DOMPurify などのサニタイズライブラリは定期的に更新します。

</div>
</div>

<div className="bilingualPair">

<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## Safe Sinks

sink は変数がページへ挿入される場所です。多くの安全な sink は値をテキストとして扱い、実行しません。`innerHTML` のような危険な sink への参照を減らし、`textContent`、`insertAdjacentText`、`className`、安全な属性名に対する `setAttribute`、フォームフィールドの `value`、`createTextNode` などを使います。HTML 挿入が必要な場合は、`innerHTML = DOMPurify.sanitize(value)` のようにサニタイズ済みの値だけを渡します。

</div>
</div>

<div className="bilingualPair">

<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## その他の制御とアンチパターン

CSP は有効な防御層ですが、ブラウザ対応差、レガシーアプリケーション、設定ミスがあるため CSP だけに依存してはいけません。HTTP インターセプタで一律エンコードする方式も、コンテキストに合わないエンコード、二重エンコード、DOM based XSS への無力さ、アプリケーション外由来データへの不十分な対応により失敗しやすいです。XSS 防御は、データが使われる場所ごとに行います。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>


```HTML
<div> $varUnsafe </div>
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

An attacker could modify data that is rendered as `$varUnsafe`. This could lead to an attack being added to a webpage. For example:

</div>

</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>


```HTML
<div> <script>alert`1`</script> </div> // Example Attack
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

In order to add a variable to a HTML context safely to a web template, use HTML entity encoding for that variable.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Here are some examples of encoded values for specific characters:

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

If you're using JavaScript for writing to HTML, look at the `.textContent` attribute. It is a **Safe Sink** and will automatically HTML Entity Encode.

</div>

</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>


```HTML
&    &amp;
<    &lt;
>    &gt;
"    &quot;
'    &#x27;
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Output Encoding for “HTML Attribute Contexts”

“HTML Attribute Contexts” occur when a variable is placed in an HTML attribute value. You may want to do this to change a hyperlink, hide an element, add alt-text for an image, or change inline CSS styles. You should apply HTML attribute encoding to variables being placed in most HTML attributes. A list of safe HTML attributes is provided in the **Safe Sinks** section.

</div>

</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>


```HTML
<div attr="$varUnsafe">
<div attr=”*x” onblur=”alert(1)*”> // Example Attack
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**It’s critical to use quotation marks like `"` or `'` to surround your variables.** Quoting makes it difficult to change the context a variable operates in, which helps prevent XSS. Quoting also significantly reduces the characterset that you need to encode, making your application more reliable and the encoding easier to implement.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

If you're writing to a HTML Attribute with JavaScript, look at the `.setAttribute` and `[attribute]` methods because they will automatically HTML Attribute Encode. Those are **Safe Sinks** as long as the attribute name is hardcoded and innocuous, like `id` or `class`. Generally, attributes that accept JavaScript, such as `onClick`, are **NOT safe** to use with untrusted attribute values.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Output Encoding for “JavaScript Contexts”

“JavaScript Contexts” refers to the situation where variables are placed into inline JavaScript and then embedded in an HTML document. This situation commonly occurs in programs that heavily use custom JavaScript that is embedded in their web pages.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

However, the only ‘safe’ location for placing variables in JavaScript is inside a “quoted data value”. All other contexts are unsafe and you should not place variable data in them.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Examples of “Quoted Data Values”

</div>

</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>


```HTML
<script>alert('$varUnsafe’)</script>
<script>x=’$varUnsafe’</script>
<div onmouseover="'$varUnsafe'"</div>
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Encode all characters using the `\\xHH` format. Encoding libraries often have a `EncodeForJavaScript` or similar to support this function.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Please look at the [OWASP Java Encoder JavaScript encoding examples](https://owasp.org/www-project-java-encoder/) for examples of proper JavaScript use that requires minimal encoding.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

For JSON, verify that the `Content-Type` header is `application/json` and not `text/html` to prevent XSS.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Output Encoding for “CSS Contexts”

“CSS Contexts” refer to variables placed into inline CSS, which is common when developers want their users to customize the look and feel of their webpages. Since CSS is surprisingly powerful, it has been used for many types of attacks. **Variables should only be placed in a CSS property value. Other “CSS Contexts” are unsafe and you should not place variable data in them.**

</div>

</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>


```HTML
<style> selector { property : $varUnsafe; } </style>
<style> selector { property : "$varUnsafe"; } </style>
<span style="property : $varUnsafe">Oh no</span>
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

If you're using JavaScript to change a CSS property, look into using
`style.property = x`.
This is a **Safe Sink** and will automatically CSS encode data in it.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

When inserting variables into CSS properties, ensure the data is properly encoded and sanitized to prevent injection attacks. Avoid placing variables directly into selectors or other CSS contexts.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Output Encoding for “URL Contexts”

“URL Contexts” refer to variables placed into a URL. Most commonly, a developer will add a parameter or URL fragment to a URL base that is then displayed or used in some operation. Use URL Encoding for these scenarios.

</div>

</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>


```HTML
<a href="http://www.owasp.org?test=$varUnsafe">link</a >
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Encode all characters with the `%HH` encoding format. Make sure any attributes are fully quoted, same as JS and CSS.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Common Mistake

There will be situations where you use a URL in different contexts. The most common one would be adding it to an `href` or `src` attribute of an `<a>` tag. In these scenarios, you should do URL encoding, followed by HTML attribute encoding.

</div>

</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>


```HTML
url = "https://site.com?data=" + urlencode(parameter)
<a href='attributeEncode(url)'>link</a>
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

If you're using JavaScript to construct a URL Query Value, look into using `window.encodeURIComponent(x)`. This is a **Safe Sink** and will automatically URL encode data in it.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Dangerous Contexts

Output encoding is not perfect. It will not always prevent XSS. These locations are known as **dangerous contexts**. Dangerous contexts include:

</div>

</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>


```HTML
<script>Directly in a script</script>
<!-- Inside an HTML comment -->
<style>Directly in CSS</style>
<div ToDefineAnAttribute=test />
<ToDefineATag href="/test" />
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Other areas to be careful with include:

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Callback functions
- Where URLs are handled in code such as this CSS &#123; background-url : “javascript:alert(xss)”; &#125;
- All JavaScript event handlers (`onclick()`, `onerror()`, `onmouseover()`).
- Unsafe JS functions like `eval()`, `setInterval()`, `setTimeout()`

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Don't place variables into dangerous contexts as even with output encoding, it will not prevent an XSS attack fully.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## HTML Sanitization

When users need to author HTML, developers may let users change the styling or structure of content inside a WYSIWYG editor. Output encoding in this case will prevent XSS, but it will break the intended functionality of the application. The styling will not be rendered. In these cases, HTML Sanitization should be used.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

HTML Sanitization will strip dangerous HTML from a variable and return a safe string of HTML. OWASP recommends [DOMPurify](https://github.com/cure53/DOMPurify) for HTML Sanitization.

</div>

</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>


```js
let clean = DOMPurify.sanitize(dirty);
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

There are some further things to consider:

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- If you sanitize content and then modify it afterwards, you can easily void your security efforts.
- If you sanitize content and then send it to a library for use, check that it doesn’t mutate that string somehow. Otherwise, again, your security efforts are void.
- You must regularly patch DOMPurify or other HTML Sanitization libraries that you use. Browsers change functionality and bypasses are being discovered regularly.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Safe Sinks

Security professionals often talk in terms of sources and sinks. If you pollute a river, it'll flow downstream somewhere. It’s the same with computer security. XSS sinks are places where variables are placed into your webpage.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Thankfully, many sinks where variables can be placed are safe. This is because these sinks treat the variable as text and will never execute it. Try to refactor your code to remove references to unsafe sinks like innerHTML, and instead use textContent or value.

</div>

</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>


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

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Safe HTML Attributes include:** `align`, `alink`, `alt`, `bgcolor`, `border`, `cellpadding`, `cellspacing`, `class`, `color`, `cols`, `colspan`, `coords`, `dir`, `face`, `height`, `hspace`, `ismap`, `lang`, `marginheight`, `marginwidth`, `multiple`, `nohref`, `noresize`, `noshade`, `nowrap`, `ref`, `rel`, `rev`, `rows`, `rowspan`, `scrolling`, `shape`, `span`, `summary`, `tabindex`, `title`, `usemap`, `valign`, `value`, `vlink`, `vspace`, `width`.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

For attributes not reported above, ensure that if JavaScript code is provided as a value, it cannot be executed.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Other Controls

Framework Security Protections, Output Encoding, and HTML Sanitization will provide the best protection for your application. OWASP recommends these in all circumstances.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Consider adopting the following controls in addition to the above.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Cookie Attributes - These change how JavaScript and browsers can interact with cookies. Cookie attributes try to limit the impact of an XSS attack but don’t prevent the execution of malicious content or address the root cause of the vulnerability.
- Content Security Policy - An allowlist that prevents content being loaded. It’s easy to make mistakes with the implementation so it should not be your primary defense mechanism. Use a CSP as an additional layer of defense and have a look at the [cheatsheet here](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html).
- Trusted Types - On Chromium-based browsers, enable [Trusted Types](https://web.dev/articles/trusted-types) by adding `Content-Security-Policy: require-trusted-types-for 'script'`. This causes DOM XSS sinks (`innerHTML`, `outerHTML`, `document.write`, `script.src`, etc.) to reject plain strings, forcing all assignments to go through a vetted policy. It is one of the few controls that eliminates entire classes of DOM XSS rather than mitigating them. Combine with a default policy that delegates to a sanitizer (e.g. DOMPurify) for legacy code paths.
- Web Application Firewalls - These look for known attack strings and block them. WAF’s are unreliable and new bypass techniques are being discovered regularly. WAFs also don’t address the root cause of an XSS vulnerability. In addition, WAFs also miss a class of XSS vulnerabilities that operate exclusively client-side. WAFs are not recommended for preventing XSS, especially DOM-Based XSS.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### XSS Prevention Rules Summary

These snippets of HTML demonstrate how to render untrusted data safely in a variety of different contexts.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Data Type: String
Context: HTML Body
Code: `<span>UNTRUSTED DATA </span>`
Sample Defense: HTML Entity Encoding (rule \\#1)

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Data Type: String
Context: Safe HTML Attributes
Code: `<input type="text" name="fname" value="UNTRUSTED DATA ">`
Sample Defense: Aggressive HTML Entity Encoding (rule \\#2), Only place untrusted data into a list of safe attributes (listed below), Strictly validate unsafe attributes such as background, ID and name.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Data Type: String
Context: GET Parameter
Code: `<a href="/site/search?value=UNTRUSTED DATA ">clickme</a>`
Sample Defense: URL Encoding (rule \\#5).

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Data Type: String
Context: Untrusted URL in a SRC or HREF attribute
Code: `<a href="UNTRUSTED URL ">clickme</a> <iframe src="UNTRUSTED URL " />`
Sample Defense: Canonicalize input, URL Validation, Safe URL verification, Allow-list http and HTTPS URLs only (Avoid the JavaScript Protocol to Open a new Window), Attribute encoder.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Data Type: String
Context: CSS Value
Code: `HTML <div style="width: UNTRUSTED DATA ;">Selection</div>`
Sample Defense: Strict structural validation (rule \\#4), CSS hex encoding, Good design of CSS features.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Data Type: String
Context: JavaScript Variable
Code: `<script>var currentValue='UNTRUSTED DATA ';</script> <script>someFunction('UNTRUSTED DATA ');</script>`
Sample Defense: Ensure JavaScript variables are quoted, JavaScript hex encoding, JavaScript Unicode encoding, avoid backslash encoding (`\\"` or `\\'` or `\\\\`).

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Data Type: HTML
Context: HTML Body
Code: `<div>UNTRUSTED HTML</div>`
Sample Defense: HTML validation (JSoup, AntiSamy, HTML Sanitizer...).

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Data Type: String
Context: DOM XSS
Code: `<script>document.write("UNTRUSTED INPUT: " + document.location.hash );<script/>`
Sample Defense: [DOM based XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html) |

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Output Encoding Rules Summary

The purpose of output encoding (as it relates to Cross Site Scripting) is to convert untrusted input into a safe form where the input is displayed as **data** to the user without executing as **code** in the browser. The following charts provides a list of critical output encoding methods needed to stop Cross Site Scripting.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Encoding Type: HTML Entity
Encoding Mechanism: Convert `&` to `&amp;`, Convert `<` to `&lt;`, Convert `>` to `&gt;`, Convert `"` to `&quot;`, Convert `'` to `&#x27`

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Encoding Type: HTML Attribute Encoding
Encoding Mechanism: Encode all characters with the HTML Entity `&#xHH;` format, including spaces, where **HH** represents the hexadecimal value of the character in Unicode. For example, `A` becomes `&#x41`. All alphanumeric characters (letters A to Z, a to z, and digits 0 to 9) remain unencoded.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Encoding Type: URL Encoding
Encoding Mechanism: Use standard percent encoding, as specified in the [W3C specification](http://www.w3.org/TR/html401/interact/forms.html#h-17.13.4.1), to encode parameter values. Be cautious and only encode parameter values, not the entire URL or path fragments of a URL.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Encoding Type: JavaScript Encoding
Encoding Mechanism: Encode all characters using the Unicode `\\uXXXX` encoding format, where **XXXX** represents the hexadecimal Unicode code point. For example, `A` becomes `\\u0041`. All alphanumeric characters (letters A to Z, a to z, and digits 0 to 9) remain unencoded.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Encoding Type: CSS Hex Encoding
Encoding Mechanism: CSS encoding supports both `\\XX` and `\\XXXXXX` formats. To ensure proper encoding, consider these options: (a) Add a space after the CSS encode (which will be ignored by the CSS parser), or (b) use the full six-character CSS encoding format by zero-padding the value. For example, `A` becomes `\\41` (short format) or `\\000041` (full format). Alphanumeric characters (letters A to Z, a to z, and digits 0 to 9) remain unencoded.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Common Anti-patterns: Ineffective Approaches to Avoid

Defending against XSS is hard. For that reason, some have sought shortcuts to preventing XSS.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

We're going to examine two common [anti-patterns](https://en.wikipedia.org/wiki/Anti-pattern) that frequently show up in ancient posts, but are still commonly cited as solutions in modern posts about XSS defense on programmer forums such as Stack Overflow and other developer hangouts.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Sole Reliance on Content-Security-Policy (CSP) Headers

First, let us be clear, we are a strong proponent of CSP when it is used properly. In the context of XSS defense, CSP works best when it it is:

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Used as a defense-in-depth technique.
- Customized for each individual application rather than being deployed as a one-size-fits-all enterprise solution.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

What we are against is a blanket CSP policy for the entire enterprise. Problems with that approach are:

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Problem 1 - Assumption Browser Versions Support CSP Equally

There usually is an implicit assumption that all the customer browsers support all the CSP constructs that your blanket CSP policy is using. Furthermore, this assumption often is done without testing the explicitly the `User-Agent` request header to see if it indeed is a supported browser type and rejecting the use of the site if it is not. Why? Because most businesses don't want to turn away customers if they are using an outdated browser that doesn't support some CSP Level 2 or Level 3 construct that they are relying on for XSS prevention.  (Statistically, almost all browsers support CSP Level 1 directives, so unless you are worried about Grandpa pulling out his old Windows 98 laptop and using some ancient version of Internet Explorer to access your site, CSP Level 1 support can probably be assumed.)

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Problem 2 - Issues Supporting Legacy Applications

Mandatory universal enterprise-wide CSP response headers are inevitably going to break some web applications, especially legacy ones. This causes the business to push-back against AppSec guidelines and inevitably results in AppSec issuing waivers and/or security exceptions until the application code can be patched up. But these security exceptions allow cracks in your XSS armor, and even if the cracks are temporary they still can impact your business, at least on a reputational basis.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Reliance on HTTP Interceptors

The other common anti-pattern that we have observed is the attempt to deal with validation and/or output encoding in some sort of interceptor such as a Spring Interceptor that generally implements `org.springframework.web.servlet.HandlerInterceptor` or as a JavaEE servlet filter that implements `javax.servlet.Filter`. While this can be successful for very specific applications (for instance, if you validate that all the input requests that are ever rendered are only alphanumeric data), it violates the major tenet of XSS defense where perform output encoding as close to where the data is rendered is possible. Generally, the HTTP request is examined for query and POST parameters but other things HTTP request headers that might be rendered such as cookie data, are not examined. The common approach that we've seen is someone will call either `ESAPI.validator().getValidSafeHTML()` or `ESAPI.encoder.canonicalize()` and depending on the results will redirect to an error page or call something like `ESAPI.encoder().encodeForHTML()`. Aside from the fact that this approach often misses tainted input such as request headers or "extra path information" in a URI, the approach completely ignores the fact that the output encoding is completely non-contextual. For example, how does a servlet filter know that an input query parameter is going to be rendered in an HTML context (i.e., between HTML tags) rather than in a JavaScript context such as within a `<script>` tag or used with a JavaScript event handler attribute? It doesn't. And because JavaScript and HTML encoding are not interchangeable, you leave yourself still open to XSS attacks.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Unless your filter or interceptor has full knowledge of your application and specifically an awareness of how your application uses each parameter for a given request, it can't succeed for all the possible edge cases. And we would contend that it never will be able to using this approach because providing that additional required context is way too complex of a design and accidentally introducing some other vulnerability (possibly one whose impact is far worse than XSS) is almost inevitable if you attempt it.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

This naive approach usually has at least one of these four problems.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Problem 1 - Encoding for specific context not satisfactory for all URI paths

One problem is the improper encoding that can still allow exploitable XSS in some URI paths of your application. An example might be a 'lastname' form parameter from a POST that normally is displayed between HTML tags so that HTML encoding is sufficient, but there may be an edge case or two where lastname is actually rendered as part of a JavaScript block where the HTML encoding is not sufficient and thus it is vulnerable to XSS attacks.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Problem 2 - Interceptor approach can lead to broken rendering caused by improper or double encoding

A second problem with this approach can be the application can result in incorrect or double encoding. E.g., suppose in the previous example, a developer has done proper output encoding for the JavaScript rendering of lastname. But if it is already been HTML output encoded too, when it is rendered, a legitimate last name like "O'Hara" might come out rendered like "O\\&#39;Hara".

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

While this second case is not strictly a security problem, if it happens often enough, it can result in business push-back against the use of the filter and thus the business may decide on disabling the filter or a way to specify exceptions for certain pages or parameters being filtered, which in turn will weaken any XSS defense that it was providing.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Problem 3 - Interceptors not effective against DOM-based XSS

The third problem with this is that it is not effective against DOM-based XSS. To do that, one would have to have an interceptor or filter scan all the JavaScript content going as part of an HTTP response, try to figure out the tainted output and see if it it is susceptible to DOM-based XSS. That simply is not practical.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Problem 4 - Interceptors not effective where data from responses originates outside your application

The last problem with interceptors is that they generally are oblivious to data in your application's responses that originate from other internal sources such as an internal REST-based web service or even an internal database. The problem is that unless your application is strictly validating that data _at the point that it is retrieved_ (which generally is the only point your application has enough context to do a strict data validation using an allow-list approach), that data should always be considered tainted. But if you are attempting to do output encoding or strict data validation all of tainted data on the HTTP response side of an interceptor (such as a Java servlet filter), at that point, your application's interceptor will have no idea of there is tainted data present from those REST web services or other databases that you used. The approach that generally is used on response-side interceptors attempting to provide XSS defense has been to only consider the matching "input parameters" as tainted and do output encoding or HTML sanitization on them and everything else is considered safe. But sometimes it's not? While it frequently is assumed that all internal web services and all internal databases can be "trusted" and used as it, this is a very bad assumption to make unless you have included that in some deep threat modeling for your application.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

For example, suppose you are working on an application to show a customer their detailed monthly bill. Let's assume that your application is either querying a foreign (as in not part of your specific application) internal database or REST web service that your application uses to obtain the user's full name, address, etc. But that data originates from another application which you are assuming is "trusted" but actually has an unreported persistent XSS vulnerability on the various customer address-related fields. Furthermore, let's assume that you company's customer support staff can examine a customer's detailed bill to assist them when customers have questions about their bills. So nefarious customer decides to plant an XSS bomb in the address field and then calls customer service for assistance with the bill. Should a scenario like that ever play out, an interceptor attempting to prevent XSS is going to miss that completely and the result is going to be something much worse than just popping an alert box to display "1" or "XSS" or "pwn'd".

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Summary

One final note: If deploying interceptors / filters as an XSS defense was a useful approach against XSS attacks, don't you think that it would be incorporated into all commercial Web Application Firewalls (WAFs) and be an approach that OWASP recommends in this cheat sheet?

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Related Articles

**XSS Attack Cheat Sheet:**

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The following article describes how attackers can exploit different kinds of XSS vulnerabilities (and this article was created to help you avoid them):

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- OWASP: [XSS Filter Evasion Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/XSS_Filter_Evasion_Cheat_Sheet.html).

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Description of XSS Vulnerabilities:**

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- OWASP article on [XSS](https://owasp.org/www-community/attacks/xss/) Vulnerabilities.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Discussion about the Types of XSS Vulnerabilities:**

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- [Types of Cross-Site Scripting](https://owasp.org/www-community/Types_of_Cross-Site_Scripting).

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**How to Review Code for Cross-Site Scripting Vulnerabilities:**

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- [OWASP Code Review Guide](https://owasp.org/www-project-code-review-guide/) article on [Reviewing Code for Cross-site scripting](https://wiki.owasp.org/index.php/Reviewing_Code_for_Cross-site_scripting) Vulnerabilities.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**How to Test for Cross-Site Scripting Vulnerabilities:**

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/) article on testing for Cross-Site Scripting vulnerabilities.
- [XSS Experimental Minimal Encoding Rules](https://wiki.owasp.org/index.php/XSS_Experimental_Minimal_Encoding_Rules) Provides examples and guidelines for experimental minimal encoding strategies to prevent Cross-Site Scripting (XSS) attacks.

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
- Changes: English original retained for comparison. Japanese translation added. Bilingual display generated from official source and local Japanese notes.
- Retrieved: 2026-05-20

</div>
