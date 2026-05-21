---
title: DOM based XSS Prevention Cheat Sheet
hide_title: true
---

<div className="docHero" data-category="encoding-and-sanitization">
  <h1>DOM based XSS 防止チートシート</h1>
  <div className="docMeta">
    <span className="docPill">最終更新: 2026-05-20</span>
    <span className="docPill">読了時間: 約 15 分</span>
    <span className="docPill">カテゴリ: 入力検証とサニタイズ</span>
  </div>
</div>

<p className="docLead">DOM based XSS 防止チートシートを、原文・翻訳・対比表示で確認できます。ASVS Index 対応の文脈で、公式原文と日本語訳を確認しやすく整理しています。</p>

<div className="tabbedContent">
  <input className="tabInput" type="radio" name="dom-based-xss-prevention-view" id="dom-based-xss-prevention-original" />
  <input className="tabInput" type="radio" name="dom-based-xss-prevention-view" id="dom-based-xss-prevention-translation" defaultChecked />
  <input className="tabInput" type="radio" name="dom-based-xss-prevention-view" id="dom-based-xss-prevention-bilingual" />

  <div className="contentTabs">
    <label htmlFor="dom-based-xss-prevention-original" title="OWASP 原文">原文</label>
    <label htmlFor="dom-based-xss-prevention-translation" title="日本語訳">翻訳</label>
    <label htmlFor="dom-based-xss-prevention-bilingual" title="原文と翻訳を並べて確認">対比表示</label>
  </div>

<section id="dom-based-xss-prevention-original-panel" className="tabPanel originalPanel contentPanel">

## Introduction

When looking at XSS (Cross-Site Scripting), there are three generally recognized forms of [XSS](https://owasp.org/www-community/attacks/xss/):

- [Reflected or Stored](https://owasp.org/www-community/attacks/xss/#stored-and-reflected-xss-attacks)
- [DOM Based XSS](https://owasp.org/www-community/attacks/DOM_Based_XSS).

The [XSS Prevention Cheatsheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html) does an excellent job of addressing Reflected and Stored XSS. This cheatsheet addresses DOM (Document Object Model) based XSS and is an extension (and assumes comprehension) of the [XSS Prevention Cheatsheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html).

In order to understand DOM based XSS, one needs to see the fundamental difference between Reflected and Stored XSS when compared to DOM based XSS. The primary difference is where the attack is injected into the application.

Reflected and Stored XSS are server side injection issues while DOM based XSS is a client (browser) side injection issue.

All of this code originates on the server, which means it is the application owner's responsibility to make it safe from XSS, regardless of the type of XSS flaw it is. Also, XSS attacks always **execute** in the browser.

The difference between Reflected/Stored XSS is where the attack is added or injected into the application. With Reflected/Stored the attack is injected into the application during server-side processing of requests where untrusted input is dynamically added to HTML. For DOM XSS, the attack is injected into the application during runtime in the client directly.

When a browser is rendering HTML and any other associated content like CSS or JavaScript, it identifies various rendering contexts for the different kinds of input and follows different rules for each context. A rendering context is associated with the parsing of HTML tags and their attributes.

- The HTML parser of the rendering context dictates how data is presented and laid out on the page and can be further broken down into the standard contexts of HTML, HTML attribute, URL, and CSS.
- The JavaScript or VBScript parser of an execution context is associated with the parsing and execution of script code. Each parser has distinct and separate semantics in the way they can possibly execute script code which make creating consistent rules for mitigating vulnerabilities in various contexts difficult. The complication is compounded by the differing meanings and treatment of encoded values within each subcontext (HTML, HTML attribute, URL, and CSS) within the execution context.

For the purposes of this article, we refer to the HTML, HTML attribute, URL, and CSS contexts as subcontexts because each of these contexts can be reached and set within a JavaScript execution context.

In JavaScript code, the main context is JavaScript but with the right tags and context closing characters, an attacker can try to attack the other 4 contexts using equivalent JavaScript DOM methods.

The following is an example vulnerability which occurs in the JavaScript context and HTML subcontext:

```html
 <script>
 var x = '<%= taintedVar %>';
 var d = document.createElement('div');
 d.innerHTML = x;
 document.body.appendChild(d);
 </script>
```text

Let's look at the individual subcontexts of the execution context in turn.

## RULE \\#1 - HTML Escape then JavaScript Escape Before Inserting Untrusted Data into HTML Subcontext within the Execution Context

There are several methods and attributes which can be used to directly render HTML content within JavaScript. These methods constitute the HTML Subcontext within the Execution Context. If these methods are provided with untrusted input, then an XSS vulnerability could result. For example:

### Example Dangerous HTML Methods

#### Attributes

```javascript
 element.innerHTML = "<HTML> Tags and markup";
 element.outerHTML = "<HTML> Tags and markup";
```text

#### Methods

```javascript
 document.write("<HTML> Tags and markup");
 document.writeln("<HTML> Tags and markup");
```text

### Guideline

To make dynamic updates to HTML in the DOM safe, we recommend:

 1. HTML encoding, and then
 2. JavaScript encoding all untrusted input, as shown in these examples:

```javascript
 var ESAPI = require('node-esapi');
 element.innerHTML = "<%=ESAPI.encoder().encodeForJavascript(ESAPI.encoder().encodeForHTML(untrustedData))%>";
 element.outerHTML = "<%=ESAPI.encoder().encodeForJavascript(ESAPI.encoder().encodeForHTML(untrustedData))%>";
```text

```javascript
 var ESAPI = require('node-esapi');
 document.write("<%=ESAPI.encoder().encodeForJavascript(ESAPI.encoder().encodeForHTML(untrustedData))%>");
 document.writeln("<%=ESAPI.encoder().encodeForJavascript(ESAPI.encoder().encodeForHTML(untrustedData))%>");
```text

## RULE \\#2 - JavaScript Escape Before Inserting Untrusted Data into HTML Attribute Subcontext within the Execution Context

The HTML attribute *subcontext* within the *execution* context is divergent from the standard encoding rules. This is because the rule to HTML attribute encode in an HTML attribute rendering context is necessary in order to mitigate attacks which try to exit out of an HTML attributes or try to add additional attributes which could lead to XSS.

When you are in a DOM execution context you only need to JavaScript encode HTML attributes which do not execute code (attributes other than event handler, CSS, and URL attributes).

For example, the general rule is to HTML Attribute encode untrusted data (data from the database, HTTP request, user, back-end system, etc.) placed in an HTML Attribute. This is the appropriate step to take when outputting data in a rendering context, however using HTML Attribute encoding in an execution context will break the application display of data.

### SAFE but BROKEN example

```javascript
 var ESAPI = require('node-esapi');
 var x = document.createElement("input");
 x.setAttribute("name", "company_name");
 // In the following line of code, companyName represents untrusted user input
 // The ESAPI.encoder().encodeForHTMLAttribute() is unnecessary and causes double-encoding
 x.setAttribute("value", '<%=ESAPI.encoder().encodeForJavascript(ESAPI.encoder().encodeForHTMLAttribute(companyName))%>');
 var form1 = document.forms[0];
 form1.appendChild(x);
```text

The problem is that if companyName had the value "Johnson & Johnson". What would be displayed in the input text field would be "Johnson &#x26;amp; Johnson". The appropriate encoding to use in the above case would be only JavaScript encoding to disallow an attacker from closing out the single quotes and in-lining code, or escaping to HTML and opening a new script tag.

### SAFE and FUNCTIONALLY CORRECT example

```javascript
 var ESAPI = require('node-esapi');
 var x = document.createElement("input");
 x.setAttribute("name", "company_name");
 x.setAttribute("value", '<%=ESAPI.encoder().encodeForJavascript(companyName)%>');
 var form1 = document.forms[0];
 form1.appendChild(x);
```text

It is important to note that when setting an HTML attribute which does not execute code, the value is set directly within the object attribute of the HTML element so there is no concerns with injecting up.

## RULE \\#3 - Be Careful when Inserting Untrusted Data into the Event Handler and JavaScript code Subcontexts within an Execution Context

Putting dynamic data within JavaScript code is especially dangerous because JavaScript encoding has different semantics for JavaScript encoded data when compared to other encodings. In many cases, JavaScript encoding does not stop attacks within an execution context. For example, a JavaScript encoded string will execute even though it is JavaScript encoded.

Therefore, the primary recommendation is to **avoid including untrusted data in this context**. If you must, the following examples describe some approaches that do and do not work.

```javascript
var x = document.createElement("a");
x.href="#";
// In the line of code below, the encoded data on the right (the second argument to setAttribute)
// is an example of untrusted data that was properly JavaScript encoded but still executes.
x.setAttribute("onclick", "\u0061\u006c\u0065\u0072\u0074\u0028\u0032\u0032\u0029");
var y = document.createTextNode("Click To Test");
x.appendChild(y);
document.body.appendChild(x);
```text

The `setAttribute(name_string,value_string)` method is dangerous because it implicitly coerces the *value_string* into the DOM attribute datatype of *name_string*.

In the case above, the attribute name is an JavaScript event handler, so the attribute value is implicitly converted to JavaScript code and evaluated. In the case above, JavaScript encoding does not mitigate against DOM based XSS.

Other JavaScript methods which take code as a string types will have a similar problem as outline above (`setTimeout`, `setInterval`, new Function, etc.). This is in stark contrast to JavaScript encoding in the event handler attribute of a HTML tag (HTML parser) where JavaScript encoding mitigates against XSS.

```html
<!-- Does NOT work  -->
<a id="bb" href="#" onclick="\u0061\u006c\u0065\u0072\u0074\u0028\u0031\u0029"> Test Me</a>
```text

An alternative to using `Element.setAttribute(...)` to set DOM attributes is to set the attribute directly. Directly setting event handler attributes will allow JavaScript encoding to mitigate against DOM based XSS. Please note, it is always dangerous design to put untrusted data directly into a command execution context.

```html
<a id="bb" href="#"> Test Me</a>
```text

```javascript
//The following does NOT work because the event handler is being set to a string.
//"alert(7)" is JavaScript encoded.
document.getElementById("bb").onclick = "\u0061\u006c\u0065\u0072\u0074\u0028\u0037\u0029";

//The following does NOT work because the event handler is being set to a string.
document.getElementById("bb").onmouseover = "testIt";

//The following does NOT work because of the encoded "(" and ")".
//"alert(77)" is JavaScript encoded.
document.getElementById("bb").onmouseover = \u0061\u006c\u0065\u0072\u0074\u0028\u0037\u0037\u0029;

//The following example is tricky
// first testIt will be assigned as an onmousehover event handler, The second testIt will fire while parsing.
// becasue second testIt is a separate js statement
// this happen because of ; separator
//"testIt;testIt" is JavaScript encoded.
document.getElementById("bb").onmouseover = \u0074\u0065\u0073\u0074\u0049\u0074\u003b\u0074\u0065\u0073
                                            \u0074\u0049\u0074;

//The following DOES WORK because the encoded value is a valid variable name or function reference.
//"testIt" is JavaScript encoded
document.getElementById("bb").onmouseover = \u0074\u0065\u0073\u0074\u0049\u0074;

function testIt() {
   alert("I was called.");
}
```text

There are other places in JavaScript where JavaScript encoding is accepted as valid executable code.

```javascript
 for(var \u0062=0; \u0062 < 10; \u0062++){
     \u0064\u006f\u0063\u0075\u006d\u0065\u006e\u0074
     .\u0077\u0072\u0069\u0074\u0065\u006c\u006e
     ("\u0048\u0065\u006c\u006c\u006f\u0020\u0057\u006f\u0072\u006c\u0064");
 }
 \u0077\u0069\u006e\u0064\u006f\u0077
 .\u0065\u0076\u0061\u006c
 \u0064\u006f\u0063\u0075\u006d\u0065\u006e\u0074
 .\u0077\u0072\u0069\u0074\u0065(111111111);
```text

or

```javascript
 var s = "\u0065\u0076\u0061\u006c";
 var t = "\u0061\u006c\u0065\u0072\u0074\u0028\u0031\u0031\u0029";
 window[s](t);
```text

Because JavaScript is based on an international standard (ECMAScript), JavaScript encoding enables the support of international characters in programming constructs and variables in addition to alternate string representations (string escapes).

However the opposite is the case with HTML encoding. HTML tag elements are well defined and do not support alternate representations of the same tag. So HTML encoding cannot be used to allow the developer to have alternate representations of the `<a>` tag for example.

### HTML Encoding's Disarming Nature

In general, HTML encoding serves to castrate HTML tags which are placed in HTML and HTML attribute contexts. Working example (no HTML encoding):

```html
<a href="..." >
```text

Normally encoded example (Does Not Work – DNW):

```html
&#x3c;a href=... &#x3e;
```text

HTML encoded example to highlight a fundamental difference with JavaScript encoded values (DNW):

```html
<&#x61; href=...>
```text

If HTML encoding followed the same semantics as JavaScript encoding, the line above could have possibly worked to render a link. This difference makes JavaScript encoding a less viable weapon in our fight against XSS.

## RULE \\#4 - JavaScript Escape Before Inserting Untrusted Data into the CSS Attribute Subcontext within the Execution Context

Normally executing JavaScript from a CSS context required either passing `javascript:attackCode()` to the CSS `url()` method or invoking the CSS `expression()` method passing JavaScript code to be directly executed.

From my experience, calling the `expression()` function from an execution context (JavaScript) has been disabled. In order to mitigate against the CSS `url()` method, ensure that you are URL encoding the data passed to the CSS `url()` method.

```javascript
var ESAPI = require('node-esapi');
document.body.style.backgroundImage = "url(<%=ESAPI.encoder().encodeForJavascript(ESAPI.encoder().encodeForURL(companyName))%>)";
```text

## RULE \\#5 - URL Escape then JavaScript Escape Before Inserting Untrusted Data into URL Attribute Subcontext within the Execution Context

The logic which parses URLs in both execution and rendering contexts looks to be the same. Therefore there is little change in the encoding rules for URL attributes in an execution (DOM) context.

```javascript
var ESAPI = require('node-esapi');
var x = document.createElement("a");
x.setAttribute("href", '<%=ESAPI.encoder().encodeForJavascript(ESAPI.encoder().encodeForURL(userRelativePath))%>');
var y = document.createTextElement("Click Me To Test");
x.appendChild(y);
document.body.appendChild(x);
```text

If you utilize fully qualified URLs then this will break the links as the colon in the protocol identifier (`http:` or `javascript:`) will be URL encoded preventing the `http` and `javascript` protocols from being invoked.

## RULE \\#6 - Populate the DOM using safe JavaScript functions or properties

The most fundamental safe way to populate the DOM with untrusted data is to use the safe assignment property `textContent`.

Here is an example of safe usage.

```html
<script>
element.textContent = untrustedData;  //does not execute code
</script>
```text

## RULE \\#7 - Fixing DOM Cross-site Scripting Vulnerabilities

The best way to fix DOM based cross-site scripting is to use the right output method (sink). For example if you want to use user input to write in a `div tag` element don't use `innerHtml`, instead use `innerText` or `textContent`. This will solve the problem, and it is the right way to re-mediate DOM based XSS vulnerabilities.

**It is always a bad idea to use a user-controlled input in dangerous sources such as eval. 99% of the time it is an indication of bad or lazy programming practice, so simply don't do it instead of trying to sanitize the input.**

Finally, to fix the problem in our initial code, instead of trying to encode the output correctly which is a hassle and can easily go wrong we would simply use `element.textContent` to write it in a content like this:

```html
<b>Current URL:</b> <span id="contentholder"></span>
...
<script>
document.getElementById("contentholder").textContent = document.baseURI;
</script>
```text

It does the same thing but this time it is not vulnerable to DOM based cross-site scripting vulnerabilities.

## Guidelines for Developing Secure Applications Utilizing JavaScript

DOM based XSS is extremely difficult to mitigate against because of its large attack surface and lack of standardization across browsers.

The guidelines below are an attempt to provide guidelines for developers when developing Web based JavaScript applications (Web 2.0) such that they can avoid XSS.

### GUIDELINE \\#1 - Untrusted data should only be treated as displayable text

Avoid treating untrusted data as code or markup within JavaScript code.

### GUIDELINE \\#2 - Always JavaScript encode and delimit untrusted data as quoted strings when entering the application when building templated JavaScript

Always JavaScript encode and delimit untrusted data as quoted strings when entering the application as illustrated in the following example.

```javascript
var x = "<%= Encode.forJavaScript(untrustedData) %>";
```text

### GUIDELINE \\#3 - Use document.createElement("..."), element.setAttribute("...","value"), element.appendChild(...) and similar to build dynamic interfaces

`document.createElement("...")`, `element.setAttribute("...","value")`, `element.appendChild(...)` and similar are safe ways to build dynamic interfaces.

Please note, `element.setAttribute` is only safe for a limited number of attributes.

Dangerous attributes include any attribute that is a command execution context, such as `onclick` or `onblur`.

Examples of safe attributes includes: `align`, `alink`, `alt`, `bgcolor`, `border`, `cellpadding`, `cellspacing`, `class`, `color`, `cols`, `colspan`, `coords`, `dir`, `face`, `height`, `hspace`, `ismap`, `lang`, `marginheight`, `marginwidth`, `multiple`, `nohref`, `noresize`, `noshade`, `nowrap`, `ref`, `rel`, `rev`, `rows`, `rowspan`, `scrolling`, `shape`, `span`, `summary`, `tabindex`, `title`, `usemap`, `valign`, `value`, `vlink`, `vspace`, `width`.

### GUIDELINE \\#4 - Avoid sending untrusted data into HTML rendering methods

Avoid populating the following methods with untrusted data.

1. `element.innerHTML = "...";`
2. `element.outerHTML = "...";`
3. `document.write(...);`
4. `document.writeln(...);`

### GUIDELINE \\#5 - Avoid the numerous methods which implicitly eval() data passed to it

There are numerous methods which implicitly `eval()` data passed to it that must be avoided.

Make sure that any untrusted data passed to these methods is:

1. Delimited with string delimiters
2. Enclosed within a closure or JavaScript encoded to N-levels based on usage
3. Wrapped in a custom function.

Ensure to follow step 3 above to make sure that the untrusted data is not sent to dangerous methods within the custom function or handle it by adding an extra layer of encoding.

#### Utilizing an Enclosure (as suggested by Gaz)

The example that follows illustrates using closures to avoid double JavaScript encoding.

```javascript
 var ESAPI = require('node-esapi');
 setTimeout((function(param) { return function() {
          customFunction(param);
        }
 })("<%=ESAPI.encoder().encodeForJavascript(untrustedData)%>"), y);
```text

The other alternative is using N-levels of encoding.

#### N-Levels of Encoding

If your code looked like the following, you would need to only double JavaScript encode input data.

```javascript
setTimeout("customFunction('<%=doubleJavaScriptEncodedData%>', y)");
function customFunction (firstName, lastName)
     alert("Hello" + firstName + " " + lastNam);
}
```text

The `doubleJavaScriptEncodedData` has its first layer of JavaScript encoding reversed (upon execution) in the single quotes.

Then the implicit `eval` of `setTimeout` reverses another layer of JavaScript encoding to pass the correct value to `customFunction`

The reason why you only need to double JavaScript encode is that the `customFunction` function did not itself pass the input to another method which implicitly or explicitly called `eval` If *firstName* was passed to another JavaScript method which implicitly or explicitly called `eval()` then `<%=doubleJavaScriptEncodedData%>` above would need to be changed to `<%=tripleJavaScriptEncodedData%>`.

An important implementation note is that if the JavaScript code tries to utilize the double or triple encoded data in string comparisons, the value may be interpreted as different values based on the number of `evals()` the data has passed through before being passed to the if comparison and the number of times the value was JavaScript encoded.

If **A** is double JavaScript encoded then the following **if** check will return false.

```javascript
 var x = "doubleJavaScriptEncodedA";  //\u005c\u0075\u0030\u0030\u0034\u0031
 if (x == "A") {
    alert("x is A");
 } else if (x == "\u0041") {
    alert("This is what pops");
 }
```text

This brings up an interesting design point. Ideally, the correct way to apply encoding and avoid the problem stated above is to server-side encode for the output context where data is introduced into the application.

Then client-side encode (using a JavaScript encoding library such as [node-esapi](https://github.com/ESAPI/node-esapi/)) for the individual subcontext (DOM methods) which untrusted data is passed to.

Here are some examples of how they are used:

```javascript
//server-side encoding
var ESAPI = require('node-esapi');
var input = "<%=ESAPI.encoder().encodeForJavascript(untrustedData)%>";
```text

```javascript
//HTML encoding is happening in JavaScript
var ESAPI = require('node-esapi');
document.writeln(ESAPI.encoder().encodeForHTML(input));
```text

One option is utilize ECMAScript 5 immutable properties in the JavaScript library.
Another option provided by Gaz (Gareth) was to use a specific code construct to limit mutability with anonymous closures.

An example follows:

```javascript
function escapeHTML(str) {
     str = str + "''";
     var out = "''";
     for(var i=0; i<str.length; i++) {
         if(str[i] === '<') {
             out += '&lt;';
         } else if(str[i] === '>') {
             out += '&gt;';
         } else if(str[i] === "'") {
             out += '&#39;';
         } else if(str[i] === '"') {
             out += '&quot;';
         } else {
             out += str[i];
         }
     }
     return out;
}
```text

### GUIDELINE \\#6 - Use untrusted data on only the right side of an expression

Use untrusted data on only the right side of an expression, especially data that looks like code and may be passed to the application (e.g., `location` and `eval()`).

```javascript
window[userDataOnLeftSide] = "userDataOnRightSide";
```text

Using untrusted user data on the left side of the expression allows an attacker to subvert internal and external attributes of the window object, whereas using user input on the right side of the expression doesn't allow direct manipulation.

### GUIDELINE \\#7 - When URL encoding in DOM be aware of character set issues

When URL encoding in DOM be aware of character set issues as the character set in JavaScript DOM is not clearly defined (Mike Samuel).

### GUIDELINE \\#8 - Limit access to object properties when using object\\[x\\] accessors

Limit access to object properties when using `object[x]` accessors (Mike Samuel). In other words, add a level of indirection between untrusted input and specified object properties.

Here is an example of the problem using map types:

```javascript
var myMapType = {};
myMapType[<%=untrustedData%>] = "moreUntrustedData";
```text

The developer writing the code above was trying to add additional keyed elements to the `myMapType` object. However, this could be used by an attacker to subvert internal and external attributes of the `myMapType` object.

A better approach would be to use the following:

```javascript
if (untrustedData === 'location') {
  myMapType.location = "moreUntrustedData";
}
```text

### GUIDELINE \\#9 - Run your JavaScript in a ECMAScript 5 canopy or sandbox

Run your JavaScript in a ECMAScript 5 [canopy](https://github.com/jcoglan/canopy) or sandbox to make it harder for your JavaScript API to be compromised (Gareth Heyes and John Stevens).

Examples of some JavaScript sandbox / sanitizers:

- [js-xss](https://github.com/leizongmin/js-xss)
- [sanitize-html](https://github.com/apostrophecms/sanitize-html)
- [DOMPurify](https://github.com/cure53/DOMPurify)
- [MDN - HTML Sanitizer API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Sanitizer_API)
- [OWASP Summit 2011 - DOM Sandboxing](https://owasp.org/www-pdf-archive/OWASPSummit2011DOMSandboxingBrowserSecurityTrack.pdf)

### GUIDELINE \\#10 - Don't eval() JSON to convert it to native JavaScript objects

Don't `eval()` JSON to convert it to native JavaScript objects. Instead use `JSON.toJSON()` and `JSON.parse()` (Chris Schmidt).

## Common Problems Associated with Mitigating DOM Based XSS

### Complex Contexts

In many cases the context isn't always straightforward to discern.

```html
<a href="javascript:myFunction('<%=untrustedData%>', 'test');">Click Me</a>
 ...
<script>
Function myFunction (url,name) {
    window.location = url;
}
</script>
```text

In the above example, untrusted data started in the rendering URL context (`href` attribute of an `a` tag) then changed to a JavaScript execution context (`javascript:` protocol handler) which passed the untrusted data to an execution URL subcontext (`window.location` of `myFunction`).

Because the data was introduced in JavaScript code and passed to a URL subcontext the appropriate server-side encoding would be the following:

```html
<a href="javascript:myFunction('<%=ESAPI.encoder().encodeForJavascript(ESAPI.encoder().encodeForURL(untrustedData)) %>', 'test');">
Click Me</a>
 ...
```text

Or if you were using ECMAScript 5 with an immutable JavaScript client-side encoding libraries you could do the following:

```html
<!-- server side URL encoding has been removed.  Now only JavaScript encoding on server side. -->
<a href="javascript:myFunction('<%=ESAPI.encoder().encodeForJavascript(untrustedData)%>', 'test');">Click Me</a>
 ...
<script>
Function myFunction (url,name) {
    var encodedURL = ESAPI.encoder().encodeForURL(url);  //URL encoding using client-side scripts
    window.location = encodedURL;
}
</script>
```text

### Inconsistencies of Encoding Libraries

There are a number of open source encoding libraries out there:

1. OWASP [ESAPI](https://owasp.org/www-project-enterprise-security-api/)
2. OWASP [Java Encoder](https://owasp.org/www-project-java-encoder/)
3. Apache Commons Text [StringEscapeUtils](https://commons.apache.org/proper/commons-text/javadocs/api-release/org/apache/commons/text/StringEscapeUtils.html), replace one from [Apache Commons Lang3](https://commons.apache.org/proper/commons-lang/apidocs/org/apache/commons/lang3/StringEscapeUtils.html)
4. [Jtidy](http://jtidy.sourceforge.net/)
5. Your company's custom implementation.

Some work on a denylist while others ignore important characters like "&lt;" and "&gt;".

Java Encoder is an active project providing supports for HTML, CSS and JavaScript encoding.

ESAPI is one of the few which works on an allowlist and encodes all non-alphanumeric characters. It is important to use an encoding library that understands which characters can be used to exploit vulnerabilities in their respective contexts. Misconceptions abound related to the proper encoding that is required.

### Encoding Misconceptions

Many security training curriculums and papers advocate the blind usage of HTML encoding to resolve XSS.

This logically seems to be prudent advice as the JavaScript parser does not understand HTML encoding.

However, if the pages returned from your web application utilize a content type of `text/xhtml` or the file type extension of `*.xhtml` then HTML encoding may not work to mitigate against XSS.

For example:

```html
<script>
&#x61;lert(1);
</script>
```text

The HTML encoded value above is still executable. If that isn't enough to keep in mind, you have to remember that encodings are lost when you retrieve them using the value attribute of a DOM element.

Let's look at the sample page and script:

```html
<form name="myForm" ...>
  <input type="text" name="lName" value="<%=ESAPI.encoder().encodeForHTML(last_name)%>">
 ...
</form>
<script>
  var x = document.myForm.lName.value;  //when the value is retrieved the encoding is reversed
  document.writeln(x);  //any code passed into lName is now executable.
</script>
```text

Finally there is the problem that certain methods in JavaScript which are usually safe can be unsafe in certain contexts.

### Usually Safe Methods

One example of an attribute which is thought to be safe is `innerText`.

Some papers or guides advocate its use as an alternative to `innerHTML` to mitigate against XSS in `innerHTML`. However, depending on the tag which `innerText` is applied, code can be executed.

```html
<script>
 var tag = document.createElement("script");
 tag.innerText = "<%=untrustedData%>";  //executes code
</script>
```text

The `innerText` feature was originally introduced by Internet Explorer, and was formally specified in the HTML standard in 2016 after being adopted by all major browser vendors.

### Detect DOM XSS using variant analysis

**Vulnerable code:**

```html
<script>
var x = location.hash.split("#")[1];
document.write(x);
</script>
```text

Semgrep rule to identify above dom xss [link](https://semgrep.dev/s/we30).

</section>

<section id="dom-based-xss-prevention-translation-panel" className="tabPanel translationPanel contentPanel">

## Introduction

XSS (Cross-Site Scripting) を見るとき、一般に認識されている XSS には三つの形態があります。

- [Reflected or Stored](https://owasp.org/www-community/attacks/xss/#stored-and-reflected-xss-attacks)
- [DOM Based XSS](https://owasp.org/www-community/attacks/DOM_Based_XSS)。

[XSS Prevention Cheatsheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html) は、Reflected XSS と Stored XSS への対処を非常によく説明しています。このチートシートは DOM (Document Object Model) based XSS を扱い、[XSS Prevention Cheatsheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html) の拡張であり、その内容を理解していることを前提としています。

DOM based XSS を理解するには、Reflected XSS および Stored XSS と DOM based XSS の根本的な違いを見る必要があります。主な違いは、攻撃がアプリケーションのどこへ注入されるかです。

Reflected XSS と Stored XSS はサーバ側のインジェクション問題ですが、DOM based XSS はクライアント、つまりブラウザ側のインジェクション問題です。

このコードはすべてサーバから発生するため、XSS 欠陥の種類にかかわらず、それを XSS から安全にする責任はアプリケーション所有者にあります。また、XSS 攻撃は常にブラウザ内で**実行**されます。

Reflected/Stored XSS との違いは、攻撃がアプリケーションのどこへ追加または注入されるかです。Reflected/Stored では、信頼できない入力が HTML に動的に追加されるリクエストのサーバ側処理中に、攻撃がアプリケーションへ注入されます。DOM XSS では、クライアント内の実行時に攻撃が直接アプリケーションへ注入されます。

ブラウザが HTML や、CSS、JavaScript などの関連コンテンツをレンダリングするとき、さまざまな種類の入力に対して各種のレンダリングコンテキストを識別し、それぞれ異なる規則に従います。レンダリングコンテキストは、HTML タグとその属性の解析に関連します。

- レンダリングコンテキストの HTML パーサは、データがページ上でどのように表示され、配置されるかを決定し、HTML、HTML 属性、URL、CSS という標準コンテキストへさらに分解できます。
- 実行コンテキストの JavaScript または VBScript パーサは、スクリプトコードの解析と実行に関連します。各パーサはスクリプトコードを実行し得る方法について別個のセマンティクスを持つため、さまざまなコンテキストにおける脆弱性を緩和する一貫した規則を作ることは困難です。この複雑さは、実行コンテキスト内の各サブコンテキスト (HTML、HTML 属性、URL、CSS) において、エンコードされた値の意味や扱いが異なることでさらに増します。

この記事では、HTML、HTML 属性、URL、CSS の各コンテキストをサブコンテキストと呼びます。これらの各コンテキストは JavaScript 実行コンテキスト内から到達し、設定できるためです。

JavaScript コードでは主コンテキストは JavaScript ですが、適切なタグとコンテキストを閉じる文字があれば、攻撃者は等価な JavaScript DOM メソッドを使って他の 4 つのコンテキストを攻撃しようとする可能性があります。

以下は、JavaScript コンテキストと HTML サブコンテキストで発生する脆弱性の例です。

```html
 <script>
 var x = '<%= taintedVar %>';
 var d = document.createElement('div');
 d.innerHTML = x;
 document.body.appendChild(d);
 </script>
```text

実行コンテキストの個々のサブコンテキストを順番に見ていきます。

## RULE \\#1 - 実行コンテキスト内の HTML サブコンテキストへ信頼できないデータを挿入する前に、HTML エスケープしてから JavaScript エスケープする

JavaScript 内で HTML コンテンツを直接レンダリングするために使用できるメソッドや属性がいくつかあります。これらのメソッドは、実行コンテキスト内の HTML サブコンテキストを構成します。これらのメソッドに信頼できない入力が与えられると、XSS 脆弱性が生じる可能性があります。例を示します。

### 危険な HTML メソッドの例

#### 属性

```javascript
 element.innerHTML = "<HTML> Tags and markup";
 element.outerHTML = "<HTML> Tags and markup";
```text

#### メソッド

```javascript
 document.write("<HTML> Tags and markup");
 document.writeln("<HTML> Tags and markup");
```text

### ガイドライン

DOM 内で HTML を動的に更新する処理を安全にするには、次の対応を推奨します。

 1. HTML エンコードを行い、その後
 2. 以下の例のように、すべての信頼できない入力を JavaScript エンコードします。

```javascript
 var ESAPI = require('node-esapi');
 element.innerHTML = "<%=ESAPI.encoder().encodeForJavascript(ESAPI.encoder().encodeForHTML(untrustedData))%>";
 element.outerHTML = "<%=ESAPI.encoder().encodeForJavascript(ESAPI.encoder().encodeForHTML(untrustedData))%>";
```text

```javascript
 var ESAPI = require('node-esapi');
 document.write("<%=ESAPI.encoder().encodeForJavascript(ESAPI.encoder().encodeForHTML(untrustedData))%>");
 document.writeln("<%=ESAPI.encoder().encodeForJavascript(ESAPI.encoder().encodeForHTML(untrustedData))%>");
```text

## RULE \\#2 - 実行コンテキスト内の HTML 属性サブコンテキストへ信頼できないデータを挿入する前に JavaScript エスケープする

実行コンテキスト内の HTML 属性*サブコンテキスト*は、標準的なエンコード規則とは異なります。これは、HTML 属性レンダリングコンテキストでは、HTML 属性から抜け出したり、XSS につながり得る追加属性を加えたりする攻撃を緩和するために、HTML 属性エンコード規則が必要になるためです。

DOM 実行コンテキスト内にいる場合、コードを実行しない HTML 属性、つまりイベントハンドラ、CSS、URL 属性以外の属性については、JavaScript エンコードだけが必要です。

たとえば一般的な規則では、HTML 属性に置かれる信頼できないデータ、つまりデータベース、HTTP リクエスト、ユーザー、バックエンドシステムなどから来るデータは HTML 属性エンコードします。これはレンダリングコンテキストへデータを出力するときには適切な手順ですが、実行コンテキストで HTML 属性エンコードを使うと、アプリケーションでのデータ表示が壊れます。

### 安全だが壊れている例

```javascript
 var ESAPI = require('node-esapi');
 var x = document.createElement("input");
 x.setAttribute("name", "company_name");
 // In the following line of code, companyName represents untrusted user input
 // The ESAPI.encoder().encodeForHTMLAttribute() is unnecessary and causes double-encoding
 x.setAttribute("value", '<%=ESAPI.encoder().encodeForJavascript(ESAPI.encoder().encodeForHTMLAttribute(companyName))%>');
 var form1 = document.forms[0];
 form1.appendChild(x);
```text

問題は、companyName の値が "Johnson & Johnson" だった場合です。入力テキストフィールドには "Johnson &#x26;amp; Johnson" と表示されます。上記のケースで使用する適切なエンコードは JavaScript エンコードのみです。これにより、攻撃者が単一引用符を閉じてコードをインライン化したり、HTML に抜けて新しい script タグを開いたりすることを防ぎます。

### 安全で機能的にも正しい例

```javascript
 var ESAPI = require('node-esapi');
 var x = document.createElement("input");
 x.setAttribute("name", "company_name");
 x.setAttribute("value", '<%=ESAPI.encoder().encodeForJavascript(companyName)%>');
 var form1 = document.forms[0];
 form1.appendChild(x);
```text

コードを実行しない HTML 属性を設定する場合、その値は HTML 要素のオブジェクト属性内に直接設定されるため、上位のコンテキストへ注入される懸念はない、という点に注意することが重要です。

## RULE \\#3 - 実行コンテキスト内のイベントハンドラおよび JavaScript コードサブコンテキストへ信頼できないデータを挿入するときは注意する

JavaScript コード内に動的データを置くことは特に危険です。JavaScript エンコード済みデータに対する JavaScript エンコードのセマンティクスは、他のエンコードと異なるためです。多くの場合、JavaScript エンコードは実行コンテキスト内の攻撃を止めません。たとえば、JavaScript エンコードされた文字列は、JavaScript エンコードされていても実行されます。

したがって、主な推奨事項は**このコンテキストに信頼できないデータを含めないこと**です。どうしても必要な場合、以下の例は機能する方法と機能しない方法を示します。

```javascript
var x = document.createElement("a");
x.href="#";
// In the line of code below, the encoded data on the right (the second argument to setAttribute)
// is an example of untrusted data that was properly JavaScript encoded but still executes.
x.setAttribute("onclick", "\u0061\u006c\u0065\u0072\u0074\u0028\u0032\u0032\u0029");
var y = document.createTextNode("Click To Test");
x.appendChild(y);
document.body.appendChild(x);
```text

`setAttribute(name_string,value_string)` メソッドは危険です。これは *value_string* を *name_string* の DOM 属性データ型へ暗黙的に強制変換するためです。

上のケースでは、属性名は JavaScript イベントハンドラであるため、属性値は暗黙的に JavaScript コードへ変換され、評価されます。上のケースでは、JavaScript エンコードは DOM based XSS を緩和しません。

コードを文字列型として受け取る他の JavaScript メソッドも、上で説明したものと同様の問題を持ちます (`setTimeout`、`setInterval`、new Function など)。これは、HTML タグのイベントハンドラ属性 (HTML パーサ) における JavaScript エンコードが XSS を緩和することとは大きく対照的です。

```html
<!-- Does NOT work  -->
<a id="bb" href="#" onclick="\u0061\u006c\u0065\u0072\u0074\u0028\u0031\u0029"> Test Me</a>
```text

DOM 属性を設定するために `Element.setAttribute(...)` を使う代替として、属性を直接設定する方法があります。イベントハンドラ属性を直接設定すれば、JavaScript エンコードによって DOM based XSS を緩和できます。ただし、信頼できないデータをコマンド実行コンテキストへ直接置く設計は常に危険である点に注意してください。

```html
<a id="bb" href="#"> Test Me</a>
```text

```javascript
//The following does NOT work because the event handler is being set to a string.
//"alert(7)" is JavaScript encoded.
document.getElementById("bb").onclick = "\u0061\u006c\u0065\u0072\u0074\u0028\u0037\u0029";

//The following does NOT work because the event handler is being set to a string.
document.getElementById("bb").onmouseover = "testIt";

//The following does NOT work because of the encoded "(" and ")".
//"alert(77)" is JavaScript encoded.
document.getElementById("bb").onmouseover = \u0061\u006c\u0065\u0072\u0074\u0028\u0037\u0037\u0029;

//The following example is tricky
// first testIt will be assigned as an onmousehover event handler, The second testIt will fire while parsing.
// becasue second testIt is a separate js statement
// this happen because of ; separator
//"testIt;testIt" is JavaScript encoded.
document.getElementById("bb").onmouseover = \u0074\u0065\u0073\u0074\u0049\u0074\u003b\u0074\u0065\u0073
                                            \u0074\u0049\u0074;

//The following DOES WORK because the encoded value is a valid variable name or function reference.
//"testIt" is JavaScript encoded
document.getElementById("bb").onmouseover = \u0074\u0065\u0073\u0074\u0049\u0074;

function testIt() {
   alert("I was called.");
}
```text

JavaScript の他の場所にも、JavaScript エンコードが有効な実行可能コードとして受け入れられる箇所があります。

```javascript
 for(var \u0062=0; \u0062 < 10; \u0062++){
     \u0064\u006f\u0063\u0075\u006d\u0065\u006e\u0074
     .\u0077\u0072\u0069\u0074\u0065\u006c\u006e
     ("\u0048\u0065\u006c\u006c\u006f\u0020\u0057\u006f\u0072\u006c\u0064");
 }
 \u0077\u0069\u006e\u0064\u006f\u0077
 .\u0065\u0076\u0061\u006c
 \u0064\u006f\u0063\u0075\u006d\u0065\u006e\u0074
 .\u0077\u0072\u0069\u0074\u0065(111111111);
```text

または次のような例です。

```javascript
 var s = "\u0065\u0076\u0061\u006c";
 var t = "\u0061\u006c\u0065\u0072\u0074\u0028\u0031\u0031\u0029";
 window[s](t);
```text

JavaScript は国際標準 (ECMAScript) に基づいているため、JavaScript エンコードは代替の文字列表現 (文字列エスケープ) に加えて、プログラミング構造や変数内の国際文字のサポートを可能にします。

しかし HTML エンコードでは逆です。HTML タグ要素は明確に定義されており、同じタグの代替表現をサポートしません。そのため、たとえば開発者が `<a>` タグの代替表現を使えるようにする目的で HTML エンコードを使用することはできません。

### HTML エンコードの無力化特性

一般に、HTML エンコードは HTML および HTML 属性コンテキストに置かれた HTML タグを無力化します。動作する例 (HTML エンコードなし) は次のとおりです。

```html
<a href="..." >
```text

通常どおりエンコードした例 (動作しない、DNW):

```html
&#x3c;a href=... &#x3e;
```text

JavaScript エンコード済み値との根本的な違いを強調する HTML エンコード済みの例 (DNW):

```html
<&#x61; href=...>
```text

HTML エンコードが JavaScript エンコードと同じセマンティクスに従うなら、上の行はリンクをレンダリングするために機能した可能性があります。この違いにより、JavaScript エンコードは XSS との戦いにおいて有効性の低い武器になります。

## RULE \\#4 - 実行コンテキスト内の CSS 属性サブコンテキストへ信頼できないデータを挿入する前に JavaScript エスケープする

通常、CSS コンテキストから JavaScript を実行するには、CSS の `url()` メソッドへ `javascript:attackCode()` を渡すか、CSS の `expression()` メソッドを呼び出して JavaScript コードを直接実行させる必要がありました。

私の経験では、実行コンテキスト (JavaScript) から `expression()` 関数を呼び出すことは無効化されています。CSS の `url()` メソッドに対する攻撃を緩和するには、CSS の `url()` メソッドへ渡すデータを URL エンコードしていることを確認してください。

```javascript
var ESAPI = require('node-esapi');
document.body.style.backgroundImage = "url(<%=ESAPI.encoder().encodeForJavascript(ESAPI.encoder().encodeForURL(companyName))%>)";
```text

## RULE \\#5 - 実行コンテキスト内の URL 属性サブコンテキストへ信頼できないデータを挿入する前に URL エスケープしてから JavaScript エスケープする

実行コンテキストとレンダリングコンテキストの両方で、URL を解析するロジックは同じように見えます。したがって、実行 (DOM) コンテキストにおける URL 属性のエンコード規則にはほとんど変更がありません。

```javascript
var ESAPI = require('node-esapi');
var x = document.createElement("a");
x.setAttribute("href", '<%=ESAPI.encoder().encodeForJavascript(ESAPI.encoder().encodeForURL(userRelativePath))%>');
var y = document.createTextElement("Click Me To Test");
x.appendChild(y);
document.body.appendChild(x);
```text

完全修飾 URL を使用すると、プロトコル識別子 (`http:` または `javascript:`) のコロンが URL エンコードされ、`http` および `javascript` プロトコルを呼び出せなくなるため、リンクが壊れます。

## RULE \\#6 - 安全な JavaScript 関数またはプロパティを使って DOM にデータを入れる

信頼できないデータで DOM を埋める最も基本的で安全な方法は、安全な代入プロパティである `textContent` を使うことです。

安全な使用例を示します。

```html
<script>
element.textContent = untrustedData;  //does not execute code
</script>
```text

## RULE \\#7 - DOM Cross-site Scripting 脆弱性を修正する

DOM based cross-site scripting を修正する最良の方法は、正しい出力メソッド (sink) を使うことです。たとえば、ユーザー入力を `div tag` 要素へ書き込みたい場合、`innerHtml` を使わず、代わりに `innerText` または `textContent` を使います。これで問題は解決し、DOM based XSS 脆弱性を修正する正しい方法になります。

**eval のような危険なソースでユーザー制御入力を使うことは常に悪い考えです。99% の場合、それは悪い、または安易なプログラミング慣行を示しているため、入力をサニタイズしようとするのではなく、単純にそれを行わないでください。**

最後に、最初のコードの問題を修正するには、手間がかかり簡単に間違え得る正しい出力エンコードを試みる代わりに、次のように `element.textContent` を使ってコンテンツへ書き込みます。

```html
<b>Current URL:</b> <span id="contentholder"></span>
...
<script>
document.getElementById("contentholder").textContent = document.baseURI;
</script>
```text

同じことを行いますが、今回は DOM based cross-site scripting 脆弱性に対して脆弱ではありません。

## JavaScript を利用するセキュアなアプリケーションを開発するためのガイドライン

DOM based XSS は、攻撃面が大きく、ブラウザ間で標準化が不足しているため、緩和が非常に困難です。

以下のガイドラインは、Web ベースの JavaScript アプリケーション (Web 2.0) を開発する開発者が XSS を回避できるようにするための指針を提供する試みです。

### GUIDELINE \\#1 - 信頼できないデータは表示可能なテキストとしてのみ扱う

JavaScript コード内で、信頼できないデータをコードまたはマークアップとして扱うことを避けます。

### GUIDELINE \\#2 - テンプレート化された JavaScript を構築するとき、アプリケーションへ入る信頼できないデータは常に JavaScript エンコードし、引用符付き文字列として区切る

次の例に示すように、アプリケーションへ入る信頼できないデータは常に JavaScript エンコードし、引用符付き文字列として区切ります。

```javascript
var x = "<%= Encode.forJavaScript(untrustedData) %>";
```text

### GUIDELINE \\#3 - 動的インターフェースを構築するには document.createElement("...")、element.setAttribute("...","value")、element.appendChild(...) などを使う

`document.createElement("...")`、`element.setAttribute("...","value")`、`element.appendChild(...)` などは、動的インターフェースを構築する安全な方法です。

ただし、`element.setAttribute` が安全なのは限られた数の属性だけである点に注意してください。

危険な属性には、`onclick` や `onblur` など、コマンド実行コンテキストである任意の属性が含まれます。

安全な属性の例には、`align`、`alink`、`alt`、`bgcolor`、`border`、`cellpadding`、`cellspacing`、`class`、`color`、`cols`、`colspan`、`coords`、`dir`、`face`、`height`、`hspace`、`ismap`、`lang`、`marginheight`、`marginwidth`、`multiple`、`nohref`、`noresize`、`noshade`、`nowrap`、`ref`、`rel`、`rev`、`rows`、`rowspan`、`scrolling`、`shape`、`span`、`summary`、`tabindex`、`title`、`usemap`、`valign`、`value`、`vlink`、`vspace`、`width` があります。

### GUIDELINE \\#4 - 信頼できないデータを HTML レンダリングメソッドへ送らない

以下のメソッドへ信頼できないデータを入れることは避けます。

1. `element.innerHTML = "...";`
2. `element.outerHTML = "...";`
3. `document.write(...);`
4. `document.writeln(...);`

### GUIDELINE \\#5 - 渡されたデータを暗黙的に eval() する多数のメソッドを避ける

渡されたデータを暗黙的に `eval()` するメソッドは多数あり、それらは避けなければなりません。

これらのメソッドへ渡される信頼できないデータについては、必ず次を行ってください。

1. 文字列区切り文字で区切る
2. クロージャ内に閉じ込める、または用途に基づいて N レベルまで JavaScript エンコードする
3. カスタム関数でラップする

上記の手順 3 に従い、信頼できないデータがカスタム関数内の危険なメソッドへ送られないようにしてください。または、エンコードの追加レイヤーを加えることで対処してください。

#### エンクロージャの利用 (Gaz の提案)

以下の例は、二重 JavaScript エンコードを避けるためにクロージャを使う方法を示しています。

```javascript
 var ESAPI = require('node-esapi');
 setTimeout((function(param) { return function() {
          customFunction(param);
        }
 })("<%=ESAPI.encoder().encodeForJavascript(untrustedData)%>"), y);
```text

もう一つの代替は、N レベルのエンコードを使うことです。

#### N レベルのエンコード

コードが次のような場合、入力データを二重 JavaScript エンコードするだけで済みます。

```javascript
setTimeout("customFunction('<%=doubleJavaScriptEncodedData%>', y)");
function customFunction (firstName, lastName)
     alert("Hello" + firstName + " " + lastNam);
}
```text

`doubleJavaScriptEncodedData` は、単一引用符内で JavaScript エンコードの最初のレイヤーが (実行時に) 解除されます。

その後、`setTimeout` の暗黙的な `eval` が JavaScript エンコードの別レイヤーを解除し、正しい値を `customFunction` へ渡します。

二重 JavaScript エンコードだけで済む理由は、`customFunction` 関数自体が、暗黙的または明示的に `eval` を呼び出す別のメソッドへ入力を渡していないためです。*firstName* が暗黙的または明示的に `eval()` を呼び出す別の JavaScript メソッドへ渡される場合、上記の `<%=doubleJavaScriptEncodedData%>` は `<%=tripleJavaScriptEncodedData%>` に変更する必要があります。

重要な実装上の注意として、JavaScript コードが二重または三重にエンコードされたデータを文字列比較で利用しようとすると、そのデータが if 比較へ渡される前に通過した `evals()` の数と、値が JavaScript エンコードされた回数に基づいて、値が異なるものとして解釈される場合があります。

**A** が二重 JavaScript エンコードされている場合、次の **if** チェックは false を返します。

```javascript
 var x = "doubleJavaScriptEncodedA";  //\u005c\u0075\u0030\u0030\u0034\u0031
 if (x == "A") {
    alert("x is A");
 } else if (x == "\u0041") {
    alert("This is what pops");
 }
```text

これは興味深い設計上の論点を提起します。理想的には、エンコードを適用して上記の問題を避ける正しい方法は、データがアプリケーションへ導入される出力コンテキストに対してサーバ側でエンコードすることです。

次に、信頼できないデータが渡される個々のサブコンテキスト (DOM メソッド) に対して、[node-esapi](https://github.com/ESAPI/node-esapi/) などの JavaScript エンコードライブラリを使ってクライアント側でエンコードします。

使用例をいくつか示します。

```javascript
//server-side encoding
var ESAPI = require('node-esapi');
var input = "<%=ESAPI.encoder().encodeForJavascript(untrustedData)%>";
```text

```javascript
//HTML encoding is happening in JavaScript
var ESAPI = require('node-esapi');
document.writeln(ESAPI.encoder().encodeForHTML(input));
```text

一つの選択肢は、JavaScript ライブラリ内で ECMAScript 5 の immutable properties を利用することです。
Gaz (Gareth) が提示したもう一つの選択肢は、匿名クロージャを使って可変性を制限する特定のコード構造を使うことでした。

例を示します。

```javascript
function escapeHTML(str) {
     str = str + "''";
     var out = "''";
     for(var i=0; i<str.length; i++) {
         if(str[i] === '<') {
             out += '&lt;';
         } else if(str[i] === '>') {
             out += '&gt;';
         } else if(str[i] === "'") {
             out += '&#39;';
         } else if(str[i] === '"') {
             out += '&quot;';
         } else {
             out += str[i];
         }
     }
     return out;
}
```text

### GUIDELINE \\#6 - 信頼できないデータは式の右辺でのみ使用する

信頼できないデータは式の右辺でのみ使用します。特に、コードのように見え、アプリケーションへ渡される可能性があるデータ (`location` や `eval()` など) ではそうしてください。

```javascript
window[userDataOnLeftSide] = "userDataOnRightSide";
```text

式の左辺で信頼できないユーザーデータを使うと、攻撃者は window オブジェクトの内部属性および外部属性を破壊できます。一方、式の右辺でユーザー入力を使っても、直接操作は許されません。

### GUIDELINE \\#7 - DOM で URL エンコードするときは文字セットの問題に注意する

DOM で URL エンコードするときは、JavaScript DOM の文字セットが明確に定義されていないため、文字セットの問題に注意してください (Mike Samuel)。

### GUIDELINE \\#8 - object\\[x\\] アクセサを使うときはオブジェクトプロパティへのアクセスを制限する

`object[x]` アクセサを使うときは、オブジェクトプロパティへのアクセスを制限します (Mike Samuel)。言い換えると、信頼できない入力と指定されたオブジェクトプロパティの間に間接参照のレベルを追加します。

map 型を使った問題の例を示します。

```javascript
var myMapType = {};
myMapType[<%=untrustedData%>] = "moreUntrustedData";
```text

上記のコードを書いた開発者は、`myMapType` オブジェクトへキー付き要素を追加しようとしていました。しかし、攻撃者はこれを使って `myMapType` オブジェクトの内部属性および外部属性を破壊できます。

よりよいアプローチは次のようにすることです。

```javascript
if (untrustedData === 'location') {
  myMapType.location = "moreUntrustedData";
}
```text

### GUIDELINE \\#9 - JavaScript を ECMAScript 5 canopy または sandbox 内で実行する

JavaScript API が侵害されにくくなるよう、JavaScript を ECMAScript 5 の [canopy](https://github.com/jcoglan/canopy) または sandbox 内で実行します (Gareth Heyes と John Stevens)。

JavaScript sandbox / sanitizer の例をいくつか示します。

- [js-xss](https://github.com/leizongmin/js-xss)
- [sanitize-html](https://github.com/apostrophecms/sanitize-html)
- [DOMPurify](https://github.com/cure53/DOMPurify)
- [MDN - HTML Sanitizer API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Sanitizer_API)
- [OWASP Summit 2011 - DOM Sandboxing](https://owasp.org/www-pdf-archive/OWASPSummit2011DOMSandboxingBrowserSecurityTrack.pdf)

### GUIDELINE \\#10 - JSON をネイティブ JavaScript オブジェクトへ変換するために eval() しない

JSON をネイティブ JavaScript オブジェクトへ変換するために `eval()` しないでください。代わりに `JSON.toJSON()` と `JSON.parse()` を使います (Chris Schmidt)。

## DOM Based XSS の緩和に関連するよくある問題

### 複雑なコンテキスト

多くの場合、コンテキストは必ずしも簡単に識別できるわけではありません。

```html
<a href="javascript:myFunction('<%=untrustedData%>', 'test');">Click Me</a>
 ...
<script>
Function myFunction (url,name) {
    window.location = url;
}
</script>
```text

上の例では、信頼できないデータは最初にレンダリング URL コンテキスト (`a` タグの `href` 属性) に入り、その後 JavaScript 実行コンテキスト (`javascript:` プロトコルハンドラ) へ変化し、信頼できないデータを実行 URL サブコンテキスト (`myFunction` の `window.location`) へ渡しています。

データは JavaScript コード内に導入され、URL サブコンテキストへ渡されるため、適切なサーバ側エンコードは次のようになります。

```html
<a href="javascript:myFunction('<%=ESAPI.encoder().encodeForJavascript(ESAPI.encoder().encodeForURL(untrustedData)) %>', 'test');">
Click Me</a>
 ...
```text

または、immutable な JavaScript クライアント側エンコードライブラリを使う ECMAScript 5 を使用している場合は、次のようにできます。

```html
<!-- server side URL encoding has been removed.  Now only JavaScript encoding on server side. -->
<a href="javascript:myFunction('<%=ESAPI.encoder().encodeForJavascript(untrustedData)%>', 'test');">Click Me</a>
 ...
<script>
Function myFunction (url,name) {
    var encodedURL = ESAPI.encoder().encodeForURL(url);  //URL encoding using client-side scripts
    window.location = encodedURL;
}
</script>
```text

### エンコードライブラリの不整合

オープンソースのエンコードライブラリは数多くあります。

1. OWASP [ESAPI](https://owasp.org/www-project-enterprise-security-api/)
2. OWASP [Java Encoder](https://owasp.org/www-project-java-encoder/)
3. Apache Commons Text [StringEscapeUtils](https://commons.apache.org/proper/commons-text/javadocs/api-release/org/apache/commons/text/StringEscapeUtils.html)、[Apache Commons Lang3](https://commons.apache.org/proper/commons-lang/apidocs/org/apache/commons/lang3/StringEscapeUtils.html) のものを置き換えるもの
4. [Jtidy](http://jtidy.sourceforge.net/)
5. 自社のカスタム実装

denylist で動くものもあれば、"&lt;" や "&gt;" のような重要な文字を無視するものもあります。

Java Encoder は、HTML、CSS、JavaScript エンコードをサポートするアクティブなプロジェクトです。

ESAPI は allowlist で動作し、すべての非英数字をエンコードする数少ないライブラリの一つです。それぞれのコンテキストで脆弱性の悪用に使える文字を理解しているエンコードライブラリを使うことが重要です。必要な適切なエンコードに関しては誤解が多くあります。

### エンコードに関する誤解

多くのセキュリティトレーニングカリキュラムや論文は、XSS を解決するために HTML エンコードを盲目的に使用することを推奨しています。

JavaScript パーサは HTML エンコードを理解しないため、これは論理的には慎重な助言のように見えます。

しかし、Web アプリケーションから返されるページが `text/xhtml` のコンテンツタイプを使用している場合、またはファイル拡張子が `*.xhtml` の場合、HTML エンコードは XSS の緩和に機能しない可能性があります。

例を示します。

```html
<script>
&#x61;lert(1);
</script>
```text

上記の HTML エンコードされた値は依然として実行可能です。さらに覚えておくべきこととして、DOM 要素の value 属性を使って値を取得すると、エンコードは失われます。

サンプルページとスクリプトを見てみます。

```html
<form name="myForm" ...>
  <input type="text" name="lName" value="<%=ESAPI.encoder().encodeForHTML(last_name)%>">
 ...
</form>
<script>
  var x = document.myForm.lName.value;  //when the value is retrieved the encoding is reversed
  document.writeln(x);  //any code passed into lName is now executable.
</script>
```text

最後に、通常は安全な JavaScript の特定のメソッドが、一部のコンテキストでは安全でなくなるという問題があります。

### 通常は安全なメソッド

安全だと考えられている属性の一例は `innerText` です。

一部の論文やガイドは、`innerHTML` における XSS を緩和するために、`innerHTML` の代替として `innerText` の使用を推奨しています。しかし、`innerText` が適用されるタグによっては、コードが実行される可能性があります。

```html
<script>
 var tag = document.createElement("script");
 tag.innerText = "<%=untrustedData%>";  //executes code
</script>
```text

`innerText` 機能はもともと Internet Explorer によって導入され、主要ブラウザベンダーすべてに採用された後、2016 年に HTML 標準で正式に仕様化されました。

### variant analysis を使って DOM XSS を検出する

**脆弱なコード:**

```html
<script>
var x = location.hash.split("#")[1];
document.write(x);
</script>
```text

上記の DOM XSS を識別する Semgrep ルールは、この [link](https://semgrep.dev/s/we30) です。

</section>

<section id="dom-based-xss-prevention-bilingual-panel" className="tabPanel bilingualPanel">

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Introduction

When looking at XSS (Cross-Site Scripting), there are three generally recognized forms of [XSS](https://owasp.org/www-community/attacks/xss/):

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## Introduction

XSS (Cross-Site Scripting) を見るとき、一般に認識されている XSS には三つの形態があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- [Reflected or Stored](https://owasp.org/www-community/attacks/xss/#stored-and-reflected-xss-attacks)
- [DOM Based XSS](https://owasp.org/www-community/attacks/DOM_Based_XSS).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- [Reflected or Stored](https://owasp.org/www-community/attacks/xss/#stored-and-reflected-xss-attacks)
- [DOM Based XSS](https://owasp.org/www-community/attacks/DOM_Based_XSS)。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The [XSS Prevention Cheatsheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html) does an excellent job of addressing Reflected and Stored XSS. This cheatsheet addresses DOM (Document Object Model) based XSS and is an extension (and assumes comprehension) of the [XSS Prevention Cheatsheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

[XSS Prevention Cheatsheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html) は、Reflected XSS と Stored XSS への対処を非常によく説明しています。このチートシートは DOM (Document Object Model) based XSS を扱い、[XSS Prevention Cheatsheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html) の拡張であり、その内容を理解していることを前提としています。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

In order to understand DOM based XSS, one needs to see the fundamental difference between Reflected and Stored XSS when compared to DOM based XSS. The primary difference is where the attack is injected into the application.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

DOM based XSS を理解するには、Reflected XSS および Stored XSS と DOM based XSS の根本的な違いを見る必要があります。主な違いは、攻撃がアプリケーションのどこへ注入されるかです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Reflected and Stored XSS are server side injection issues while DOM based XSS is a client (browser) side injection issue.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Reflected XSS と Stored XSS はサーバ側のインジェクション問題ですが、DOM based XSS はクライアント、つまりブラウザ側のインジェクション問題です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

All of this code originates on the server, which means it is the application owner's responsibility to make it safe from XSS, regardless of the type of XSS flaw it is. Also, XSS attacks always **execute** in the browser.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

このコードはすべてサーバから発生するため、XSS 欠陥の種類にかかわらず、それを XSS から安全にする責任はアプリケーション所有者にあります。また、XSS 攻撃は常にブラウザ内で**実行**されます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The difference between Reflected/Stored XSS is where the attack is added or injected into the application. With Reflected/Stored the attack is injected into the application during server-side processing of requests where untrusted input is dynamically added to HTML. For DOM XSS, the attack is injected into the application during runtime in the client directly.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Reflected/Stored XSS との違いは、攻撃がアプリケーションのどこへ追加または注入されるかです。Reflected/Stored では、信頼できない入力が HTML に動的に追加されるリクエストのサーバ側処理中に、攻撃がアプリケーションへ注入されます。DOM XSS では、クライアント内の実行時に攻撃が直接アプリケーションへ注入されます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

When a browser is rendering HTML and any other associated content like CSS or JavaScript, it identifies various rendering contexts for the different kinds of input and follows different rules for each context. A rendering context is associated with the parsing of HTML tags and their attributes.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

ブラウザが HTML や、CSS、JavaScript などの関連コンテンツをレンダリングするとき、さまざまな種類の入力に対して各種のレンダリングコンテキストを識別し、それぞれ異なる規則に従います。レンダリングコンテキストは、HTML タグとその属性の解析に関連します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- The HTML parser of the rendering context dictates how data is presented and laid out on the page and can be further broken down into the standard contexts of HTML, HTML attribute, URL, and CSS.
- The JavaScript or VBScript parser of an execution context is associated with the parsing and execution of script code. Each parser has distinct and separate semantics in the way they can possibly execute script code which make creating consistent rules for mitigating vulnerabilities in various contexts difficult. The complication is compounded by the differing meanings and treatment of encoded values within each subcontext (HTML, HTML attribute, URL, and CSS) within the execution context.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- レンダリングコンテキストの HTML パーサは、データがページ上でどのように表示され、配置されるかを決定し、HTML、HTML 属性、URL、CSS という標準コンテキストへさらに分解できます。
- 実行コンテキストの JavaScript または VBScript パーサは、スクリプトコードの解析と実行に関連します。各パーサはスクリプトコードを実行し得る方法について別個のセマンティクスを持つため、さまざまなコンテキストにおける脆弱性を緩和する一貫した規則を作ることは困難です。この複雑さは、実行コンテキスト内の各サブコンテキスト (HTML、HTML 属性、URL、CSS) において、エンコードされた値の意味や扱いが異なることでさらに増します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

For the purposes of this article, we refer to the HTML, HTML attribute, URL, and CSS contexts as subcontexts because each of these contexts can be reached and set within a JavaScript execution context.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

この記事では、HTML、HTML 属性、URL、CSS の各コンテキストをサブコンテキストと呼びます。これらの各コンテキストは JavaScript 実行コンテキスト内から到達し、設定できるためです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

In JavaScript code, the main context is JavaScript but with the right tags and context closing characters, an attacker can try to attack the other 4 contexts using equivalent JavaScript DOM methods.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

JavaScript コードでは主コンテキストは JavaScript ですが、適切なタグとコンテキストを閉じる文字があれば、攻撃者は等価な JavaScript DOM メソッドを使って他の 4 つのコンテキストを攻撃しようとする可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The following is an example vulnerability which occurs in the JavaScript context and HTML subcontext:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

以下は、JavaScript コンテキストと HTML サブコンテキストで発生する脆弱性の例です。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
 <script>
 var x = '<%= taintedVar %>';
 var d = document.createElement('div');
 d.innerHTML = x;
 document.body.appendChild(d);
 </script>
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Let's look at the individual subcontexts of the execution context in turn.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

実行コンテキストの個々のサブコンテキストを順番に見ていきます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## RULE \\#1 - HTML Escape then JavaScript Escape Before Inserting Untrusted Data into HTML Subcontext within the Execution Context

There are several methods and attributes which can be used to directly render HTML content within JavaScript. These methods constitute the HTML Subcontext within the Execution Context. If these methods are provided with untrusted input, then an XSS vulnerability could result. For example:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## RULE \\#1 - 実行コンテキスト内の HTML サブコンテキストへ信頼できないデータを挿入する前に、HTML エスケープしてから JavaScript エスケープする

JavaScript 内で HTML コンテンツを直接レンダリングするために使用できるメソッドや属性がいくつかあります。これらのメソッドは、実行コンテキスト内の HTML サブコンテキストを構成します。これらのメソッドに信頼できない入力が与えられると、XSS 脆弱性が生じる可能性があります。例を示します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Example Dangerous HTML Methods

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 危険な HTML メソッドの例

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Attributes

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 属性

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```javascript
 element.innerHTML = "<HTML> Tags and markup";
 element.outerHTML = "<HTML> Tags and markup";
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Methods

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### メソッド

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```javascript
 document.write("<HTML> Tags and markup");
 document.writeln("<HTML> Tags and markup");
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Guideline

To make dynamic updates to HTML in the DOM safe, we recommend:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### ガイドライン

DOM 内で HTML を動的に更新する処理を安全にするには、次の対応を推奨します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

1. HTML encoding, and then
 2. JavaScript encoding all untrusted input, as shown in these examples:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

1. HTML エンコードを行い、その後
 2. 以下の例のように、すべての信頼できない入力を JavaScript エンコードします。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```javascript
 var ESAPI = require('node-esapi');
 element.innerHTML = "<%=ESAPI.encoder().encodeForJavascript(ESAPI.encoder().encodeForHTML(untrustedData))%>";
 element.outerHTML = "<%=ESAPI.encoder().encodeForJavascript(ESAPI.encoder().encodeForHTML(untrustedData))%>";
```html

</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```javascript
 var ESAPI = require('node-esapi');
 document.write("<%=ESAPI.encoder().encodeForJavascript(ESAPI.encoder().encodeForHTML(untrustedData))%>");
 document.writeln("<%=ESAPI.encoder().encodeForJavascript(ESAPI.encoder().encodeForHTML(untrustedData))%>");
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## RULE \\#2 - JavaScript Escape Before Inserting Untrusted Data into HTML Attribute Subcontext within the Execution Context

The HTML attribute *subcontext* within the *execution* context is divergent from the standard encoding rules. This is because the rule to HTML attribute encode in an HTML attribute rendering context is necessary in order to mitigate attacks which try to exit out of an HTML attributes or try to add additional attributes which could lead to XSS.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## RULE \\#2 - 実行コンテキスト内の HTML 属性サブコンテキストへ信頼できないデータを挿入する前に JavaScript エスケープする

実行コンテキスト内の HTML 属性*サブコンテキスト*は、標準的なエンコード規則とは異なります。これは、HTML 属性レンダリングコンテキストでは、HTML 属性から抜け出したり、XSS につながり得る追加属性を加えたりする攻撃を緩和するために、HTML 属性エンコード規則が必要になるためです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

When you are in a DOM execution context you only need to JavaScript encode HTML attributes which do not execute code (attributes other than event handler, CSS, and URL attributes).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

DOM 実行コンテキスト内にいる場合、コードを実行しない HTML 属性、つまりイベントハンドラ、CSS、URL 属性以外の属性については、JavaScript エンコードだけが必要です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

For example, the general rule is to HTML Attribute encode untrusted data (data from the database, HTTP request, user, back-end system, etc.) placed in an HTML Attribute. This is the appropriate step to take when outputting data in a rendering context, however using HTML Attribute encoding in an execution context will break the application display of data.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

たとえば一般的な規則では、HTML 属性に置かれる信頼できないデータ、つまりデータベース、HTTP リクエスト、ユーザー、バックエンドシステムなどから来るデータは HTML 属性エンコードします。これはレンダリングコンテキストへデータを出力するときには適切な手順ですが、実行コンテキストで HTML 属性エンコードを使うと、アプリケーションでのデータ表示が壊れます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### SAFE but BROKEN example

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 安全だが壊れている例

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```javascript
 var ESAPI = require('node-esapi');
 var x = document.createElement("input");
 x.setAttribute("name", "company_name");
 // In the following line of code, companyName represents untrusted user input
 // The ESAPI.encoder().encodeForHTMLAttribute() is unnecessary and causes double-encoding
 x.setAttribute("value", '<%=ESAPI.encoder().encodeForJavascript(ESAPI.encoder().encodeForHTMLAttribute(companyName))%>');
 var form1 = document.forms[0];
 form1.appendChild(x);
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The problem is that if companyName had the value "Johnson & Johnson". What would be displayed in the input text field would be "Johnson &#x26;amp; Johnson". The appropriate encoding to use in the above case would be only JavaScript encoding to disallow an attacker from closing out the single quotes and in-lining code, or escaping to HTML and opening a new script tag.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

問題は、companyName の値が "Johnson & Johnson" だった場合です。入力テキストフィールドには "Johnson &#x26;amp; Johnson" と表示されます。上記のケースで使用する適切なエンコードは JavaScript エンコードのみです。これにより、攻撃者が単一引用符を閉じてコードをインライン化したり、HTML に抜けて新しい script タグを開いたりすることを防ぎます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### SAFE and FUNCTIONALLY CORRECT example

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 安全で機能的にも正しい例

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```javascript
 var ESAPI = require('node-esapi');
 var x = document.createElement("input");
 x.setAttribute("name", "company_name");
 x.setAttribute("value", '<%=ESAPI.encoder().encodeForJavascript(companyName)%>');
 var form1 = document.forms[0];
 form1.appendChild(x);
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

It is important to note that when setting an HTML attribute which does not execute code, the value is set directly within the object attribute of the HTML element so there is no concerns with injecting up.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

コードを実行しない HTML 属性を設定する場合、その値は HTML 要素のオブジェクト属性内に直接設定されるため、上位のコンテキストへ注入される懸念はない、という点に注意することが重要です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## RULE \\#3 - Be Careful when Inserting Untrusted Data into the Event Handler and JavaScript code Subcontexts within an Execution Context

Putting dynamic data within JavaScript code is especially dangerous because JavaScript encoding has different semantics for JavaScript encoded data when compared to other encodings. In many cases, JavaScript encoding does not stop attacks within an execution context. For example, a JavaScript encoded string will execute even though it is JavaScript encoded.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## RULE \\#3 - 実行コンテキスト内のイベントハンドラおよび JavaScript コードサブコンテキストへ信頼できないデータを挿入するときは注意する

JavaScript コード内に動的データを置くことは特に危険です。JavaScript エンコード済みデータに対する JavaScript エンコードのセマンティクスは、他のエンコードと異なるためです。多くの場合、JavaScript エンコードは実行コンテキスト内の攻撃を止めません。たとえば、JavaScript エンコードされた文字列は、JavaScript エンコードされていても実行されます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Therefore, the primary recommendation is to **avoid including untrusted data in this context**. If you must, the following examples describe some approaches that do and do not work.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

したがって、主な推奨事項は**このコンテキストに信頼できないデータを含めないこと**です。どうしても必要な場合、以下の例は機能する方法と機能しない方法を示します。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```javascript
var x = document.createElement("a");
x.href="#";
// In the line of code below, the encoded data on the right (the second argument to setAttribute)
// is an example of untrusted data that was properly JavaScript encoded but still executes.
x.setAttribute("onclick", "\u0061\u006c\u0065\u0072\u0074\u0028\u0032\u0032\u0029");
var y = document.createTextNode("Click To Test");
x.appendChild(y);
document.body.appendChild(x);
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The `setAttribute(name_string,value_string)` method is dangerous because it implicitly coerces the *value_string* into the DOM attribute datatype of *name_string*.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

`setAttribute(name_string,value_string)` メソッドは危険です。これは *value_string* を *name_string* の DOM 属性データ型へ暗黙的に強制変換するためです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

In the case above, the attribute name is an JavaScript event handler, so the attribute value is implicitly converted to JavaScript code and evaluated. In the case above, JavaScript encoding does not mitigate against DOM based XSS.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

上のケースでは、属性名は JavaScript イベントハンドラであるため、属性値は暗黙的に JavaScript コードへ変換され、評価されます。上のケースでは、JavaScript エンコードは DOM based XSS を緩和しません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Other JavaScript methods which take code as a string types will have a similar problem as outline above (`setTimeout`, `setInterval`, new Function, etc.). This is in stark contrast to JavaScript encoding in the event handler attribute of a HTML tag (HTML parser) where JavaScript encoding mitigates against XSS.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

コードを文字列型として受け取る他の JavaScript メソッドも、上で説明したものと同様の問題を持ちます (`setTimeout`、`setInterval`、new Function など)。これは、HTML タグのイベントハンドラ属性 (HTML パーサ) における JavaScript エンコードが XSS を緩和することとは大きく対照的です。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<!-- Does NOT work  -->
<a id="bb" href="#" onclick="\u0061\u006c\u0065\u0072\u0074\u0028\u0031\u0029"> Test Me</a>
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

An alternative to using `Element.setAttribute(...)` to set DOM attributes is to set the attribute directly. Directly setting event handler attributes will allow JavaScript encoding to mitigate against DOM based XSS. Please note, it is always dangerous design to put untrusted data directly into a command execution context.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

DOM 属性を設定するために `Element.setAttribute(...)` を使う代替として、属性を直接設定する方法があります。イベントハンドラ属性を直接設定すれば、JavaScript エンコードによって DOM based XSS を緩和できます。ただし、信頼できないデータをコマンド実行コンテキストへ直接置く設計は常に危険である点に注意してください。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<a id="bb" href="#"> Test Me</a>
```html

</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```javascript
//The following does NOT work because the event handler is being set to a string.
//"alert(7)" is JavaScript encoded.
document.getElementById("bb").onclick = "\u0061\u006c\u0065\u0072\u0074\u0028\u0037\u0029";

//The following does NOT work because the event handler is being set to a string.
document.getElementById("bb").onmouseover = "testIt";

//The following does NOT work because of the encoded "(" and ")".
//"alert(77)" is JavaScript encoded.
document.getElementById("bb").onmouseover = \u0061\u006c\u0065\u0072\u0074\u0028\u0037\u0037\u0029;

//The following example is tricky
// first testIt will be assigned as an onmousehover event handler, The second testIt will fire while parsing.
// becasue second testIt is a separate js statement
// this happen because of ; separator
//"testIt;testIt" is JavaScript encoded.
document.getElementById("bb").onmouseover = \u0074\u0065\u0073\u0074\u0049\u0074\u003b\u0074\u0065\u0073
                                            \u0074\u0049\u0074;

//The following DOES WORK because the encoded value is a valid variable name or function reference.
//"testIt" is JavaScript encoded
document.getElementById("bb").onmouseover = \u0074\u0065\u0073\u0074\u0049\u0074;

function testIt() {
   alert("I was called.");
}
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

There are other places in JavaScript where JavaScript encoding is accepted as valid executable code.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

JavaScript の他の場所にも、JavaScript エンコードが有効な実行可能コードとして受け入れられる箇所があります。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```javascript
 for(var \u0062=0; \u0062 < 10; \u0062++){
     \u0064\u006f\u0063\u0075\u006d\u0065\u006e\u0074
     .\u0077\u0072\u0069\u0074\u0065\u006c\u006e
     ("\u0048\u0065\u006c\u006c\u006f\u0020\u0057\u006f\u0072\u006c\u0064");
 }
 \u0077\u0069\u006e\u0064\u006f\u0077
 .\u0065\u0076\u0061\u006c
 \u0064\u006f\u0063\u0075\u006d\u0065\u006e\u0074
 .\u0077\u0072\u0069\u0074\u0065(111111111);
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

or

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

または次のような例です。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```javascript
 var s = "\u0065\u0076\u0061\u006c";
 var t = "\u0061\u006c\u0065\u0072\u0074\u0028\u0031\u0031\u0029";
 window[s](t);
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Because JavaScript is based on an international standard (ECMAScript), JavaScript encoding enables the support of international characters in programming constructs and variables in addition to alternate string representations (string escapes).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

JavaScript は国際標準 (ECMAScript) に基づいているため、JavaScript エンコードは代替の文字列表現 (文字列エスケープ) に加えて、プログラミング構造や変数内の国際文字のサポートを可能にします。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

However the opposite is the case with HTML encoding. HTML tag elements are well defined and do not support alternate representations of the same tag. So HTML encoding cannot be used to allow the developer to have alternate representations of the `<a>` tag for example.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

しかし HTML エンコードでは逆です。HTML タグ要素は明確に定義されており、同じタグの代替表現をサポートしません。そのため、たとえば開発者が `<a>` タグの代替表現を使えるようにする目的で HTML エンコードを使用することはできません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### HTML Encoding's Disarming Nature

In general, HTML encoding serves to castrate HTML tags which are placed in HTML and HTML attribute contexts. Working example (no HTML encoding):

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### HTML エンコードの無力化特性

一般に、HTML エンコードは HTML および HTML 属性コンテキストに置かれた HTML タグを無力化します。動作する例 (HTML エンコードなし) は次のとおりです。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<a href="..." >
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Normally encoded example (Does Not Work – DNW):

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

通常どおりエンコードした例 (動作しない、DNW):

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
&#x3c;a href=... &#x3e;
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

HTML encoded example to highlight a fundamental difference with JavaScript encoded values (DNW):

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

JavaScript エンコード済み値との根本的な違いを強調する HTML エンコード済みの例 (DNW):

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<&#x61; href=...>
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

If HTML encoding followed the same semantics as JavaScript encoding, the line above could have possibly worked to render a link. This difference makes JavaScript encoding a less viable weapon in our fight against XSS.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

HTML エンコードが JavaScript エンコードと同じセマンティクスに従うなら、上の行はリンクをレンダリングするために機能した可能性があります。この違いにより、JavaScript エンコードは XSS との戦いにおいて有効性の低い武器になります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## RULE \\#4 - JavaScript Escape Before Inserting Untrusted Data into the CSS Attribute Subcontext within the Execution Context

Normally executing JavaScript from a CSS context required either passing `javascript:attackCode()` to the CSS `url()` method or invoking the CSS `expression()` method passing JavaScript code to be directly executed.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## RULE \\#4 - 実行コンテキスト内の CSS 属性サブコンテキストへ信頼できないデータを挿入する前に JavaScript エスケープする

通常、CSS コンテキストから JavaScript を実行するには、CSS の `url()` メソッドへ `javascript:attackCode()` を渡すか、CSS の `expression()` メソッドを呼び出して JavaScript コードを直接実行させる必要がありました。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

From my experience, calling the `expression()` function from an execution context (JavaScript) has been disabled. In order to mitigate against the CSS `url()` method, ensure that you are URL encoding the data passed to the CSS `url()` method.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

私の経験では、実行コンテキスト (JavaScript) から `expression()` 関数を呼び出すことは無効化されています。CSS の `url()` メソッドに対する攻撃を緩和するには、CSS の `url()` メソッドへ渡すデータを URL エンコードしていることを確認してください。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```javascript
var ESAPI = require('node-esapi');
document.body.style.backgroundImage = "url(<%=ESAPI.encoder().encodeForJavascript(ESAPI.encoder().encodeForURL(companyName))%>)";
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## RULE \\#5 - URL Escape then JavaScript Escape Before Inserting Untrusted Data into URL Attribute Subcontext within the Execution Context

The logic which parses URLs in both execution and rendering contexts looks to be the same. Therefore there is little change in the encoding rules for URL attributes in an execution (DOM) context.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## RULE \\#5 - 実行コンテキスト内の URL 属性サブコンテキストへ信頼できないデータを挿入する前に URL エスケープしてから JavaScript エスケープする

実行コンテキストとレンダリングコンテキストの両方で、URL を解析するロジックは同じように見えます。したがって、実行 (DOM) コンテキストにおける URL 属性のエンコード規則にはほとんど変更がありません。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```javascript
var ESAPI = require('node-esapi');
var x = document.createElement("a");
x.setAttribute("href", '<%=ESAPI.encoder().encodeForJavascript(ESAPI.encoder().encodeForURL(userRelativePath))%>');
var y = document.createTextElement("Click Me To Test");
x.appendChild(y);
document.body.appendChild(x);
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

If you utilize fully qualified URLs then this will break the links as the colon in the protocol identifier (`http:` or `javascript:`) will be URL encoded preventing the `http` and `javascript` protocols from being invoked.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

完全修飾 URL を使用すると、プロトコル識別子 (`http:` または `javascript:`) のコロンが URL エンコードされ、`http` および `javascript` プロトコルを呼び出せなくなるため、リンクが壊れます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## RULE \\#6 - Populate the DOM using safe JavaScript functions or properties

The most fundamental safe way to populate the DOM with untrusted data is to use the safe assignment property `textContent`.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## RULE \\#6 - 安全な JavaScript 関数またはプロパティを使って DOM にデータを入れる

信頼できないデータで DOM を埋める最も基本的で安全な方法は、安全な代入プロパティである `textContent` を使うことです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Here is an example of safe usage.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

安全な使用例を示します。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<script>
element.textContent = untrustedData;  //does not execute code
</script>
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## RULE \\#7 - Fixing DOM Cross-site Scripting Vulnerabilities

The best way to fix DOM based cross-site scripting is to use the right output method (sink). For example if you want to use user input to write in a `div tag` element don't use `innerHtml`, instead use `innerText` or `textContent`. This will solve the problem, and it is the right way to re-mediate DOM based XSS vulnerabilities.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## RULE \\#7 - DOM Cross-site Scripting 脆弱性を修正する

DOM based cross-site scripting を修正する最良の方法は、正しい出力メソッド (sink) を使うことです。たとえば、ユーザー入力を `div tag` 要素へ書き込みたい場合、`innerHtml` を使わず、代わりに `innerText` または `textContent` を使います。これで問題は解決し、DOM based XSS 脆弱性を修正する正しい方法になります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**It is always a bad idea to use a user-controlled input in dangerous sources such as eval. 99% of the time it is an indication of bad or lazy programming practice, so simply don't do it instead of trying to sanitize the input.**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**eval のような危険なソースでユーザー制御入力を使うことは常に悪い考えです。99% の場合、それは悪い、または安易なプログラミング慣行を示しているため、入力をサニタイズしようとするのではなく、単純にそれを行わないでください。**

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Finally, to fix the problem in our initial code, instead of trying to encode the output correctly which is a hassle and can easily go wrong we would simply use `element.textContent` to write it in a content like this:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

最後に、最初のコードの問題を修正するには、手間がかかり簡単に間違え得る正しい出力エンコードを試みる代わりに、次のように `element.textContent` を使ってコンテンツへ書き込みます。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<b>Current URL:</b> <span id="contentholder"></span>
...
<script>
document.getElementById("contentholder").textContent = document.baseURI;
</script>
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

It does the same thing but this time it is not vulnerable to DOM based cross-site scripting vulnerabilities.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

同じことを行いますが、今回は DOM based cross-site scripting 脆弱性に対して脆弱ではありません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Guidelines for Developing Secure Applications Utilizing JavaScript

DOM based XSS is extremely difficult to mitigate against because of its large attack surface and lack of standardization across browsers.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## JavaScript を利用するセキュアなアプリケーションを開発するためのガイドライン

DOM based XSS は、攻撃面が大きく、ブラウザ間で標準化が不足しているため、緩和が非常に困難です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The guidelines below are an attempt to provide guidelines for developers when developing Web based JavaScript applications (Web 2.0) such that they can avoid XSS.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

以下のガイドラインは、Web ベースの JavaScript アプリケーション (Web 2.0) を開発する開発者が XSS を回避できるようにするための指針を提供する試みです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### GUIDELINE \\#1 - Untrusted data should only be treated as displayable text

Avoid treating untrusted data as code or markup within JavaScript code.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### GUIDELINE \\#1 - 信頼できないデータは表示可能なテキストとしてのみ扱う

JavaScript コード内で、信頼できないデータをコードまたはマークアップとして扱うことを避けます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### GUIDELINE \\#2 - Always JavaScript encode and delimit untrusted data as quoted strings when entering the application when building templated JavaScript

Always JavaScript encode and delimit untrusted data as quoted strings when entering the application as illustrated in the following example.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### GUIDELINE \\#2 - テンプレート化された JavaScript を構築するとき、アプリケーションへ入る信頼できないデータは常に JavaScript エンコードし、引用符付き文字列として区切る

次の例に示すように、アプリケーションへ入る信頼できないデータは常に JavaScript エンコードし、引用符付き文字列として区切ります。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```javascript
var x = "<%= Encode.forJavaScript(untrustedData) %>";
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### GUIDELINE \\#3 - Use document.createElement("..."), element.setAttribute("...","value"), element.appendChild(...) and similar to build dynamic interfaces

`document.createElement("...")`, `element.setAttribute("...","value")`, `element.appendChild(...)` and similar are safe ways to build dynamic interfaces.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### GUIDELINE \\#3 - 動的インターフェースを構築するには document.createElement("...")、element.setAttribute("...","value")、element.appendChild(...) などを使う

`document.createElement("...")`、`element.setAttribute("...","value")`、`element.appendChild(...)` などは、動的インターフェースを構築する安全な方法です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Please note, `element.setAttribute` is only safe for a limited number of attributes.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

ただし、`element.setAttribute` が安全なのは限られた数の属性だけである点に注意してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Dangerous attributes include any attribute that is a command execution context, such as `onclick` or `onblur`.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

危険な属性には、`onclick` や `onblur` など、コマンド実行コンテキストである任意の属性が含まれます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Examples of safe attributes includes: `align`, `alink`, `alt`, `bgcolor`, `border`, `cellpadding`, `cellspacing`, `class`, `color`, `cols`, `colspan`, `coords`, `dir`, `face`, `height`, `hspace`, `ismap`, `lang`, `marginheight`, `marginwidth`, `multiple`, `nohref`, `noresize`, `noshade`, `nowrap`, `ref`, `rel`, `rev`, `rows`, `rowspan`, `scrolling`, `shape`, `span`, `summary`, `tabindex`, `title`, `usemap`, `valign`, `value`, `vlink`, `vspace`, `width`.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

安全な属性の例には、`align`、`alink`、`alt`、`bgcolor`、`border`、`cellpadding`、`cellspacing`、`class`、`color`、`cols`、`colspan`、`coords`、`dir`、`face`、`height`、`hspace`、`ismap`、`lang`、`marginheight`、`marginwidth`、`multiple`、`nohref`、`noresize`、`noshade`、`nowrap`、`ref`、`rel`、`rev`、`rows`、`rowspan`、`scrolling`、`shape`、`span`、`summary`、`tabindex`、`title`、`usemap`、`valign`、`value`、`vlink`、`vspace`、`width` があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### GUIDELINE \\#4 - Avoid sending untrusted data into HTML rendering methods

Avoid populating the following methods with untrusted data.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### GUIDELINE \\#4 - 信頼できないデータを HTML レンダリングメソッドへ送らない

以下のメソッドへ信頼できないデータを入れることは避けます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

1. `element.innerHTML = "...";`
2. `element.outerHTML = "...";`
3. `document.write(...);`
4. `document.writeln(...);`

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

1. `element.innerHTML = "...";`
2. `element.outerHTML = "...";`
3. `document.write(...);`
4. `document.writeln(...);`

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### GUIDELINE \\#5 - Avoid the numerous methods which implicitly eval() data passed to it

There are numerous methods which implicitly `eval()` data passed to it that must be avoided.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### GUIDELINE \\#5 - 渡されたデータを暗黙的に eval() する多数のメソッドを避ける

渡されたデータを暗黙的に `eval()` するメソッドは多数あり、それらは避けなければなりません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Make sure that any untrusted data passed to these methods is:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

これらのメソッドへ渡される信頼できないデータについては、必ず次を行ってください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

1. Delimited with string delimiters
2. Enclosed within a closure or JavaScript encoded to N-levels based on usage
3. Wrapped in a custom function.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

1. 文字列区切り文字で区切る
2. クロージャ内に閉じ込める、または用途に基づいて N レベルまで JavaScript エンコードする
3. カスタム関数でラップする

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Ensure to follow step 3 above to make sure that the untrusted data is not sent to dangerous methods within the custom function or handle it by adding an extra layer of encoding.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

上記の手順 3 に従い、信頼できないデータがカスタム関数内の危険なメソッドへ送られないようにしてください。または、エンコードの追加レイヤーを加えることで対処してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Utilizing an Enclosure (as suggested by Gaz)

The example that follows illustrates using closures to avoid double JavaScript encoding.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### エンクロージャの利用 (Gaz の提案)

以下の例は、二重 JavaScript エンコードを避けるためにクロージャを使う方法を示しています。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```javascript
 var ESAPI = require('node-esapi');
 setTimeout((function(param) { return function() {
          customFunction(param);
        }
 })("<%=ESAPI.encoder().encodeForJavascript(untrustedData)%>"), y);
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The other alternative is using N-levels of encoding.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

もう一つの代替は、N レベルのエンコードを使うことです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### N-Levels of Encoding

If your code looked like the following, you would need to only double JavaScript encode input data.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### N レベルのエンコード

コードが次のような場合、入力データを二重 JavaScript エンコードするだけで済みます。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```javascript
setTimeout("customFunction('<%=doubleJavaScriptEncodedData%>', y)");
function customFunction (firstName, lastName)
     alert("Hello" + firstName + " " + lastNam);
}
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The `doubleJavaScriptEncodedData` has its first layer of JavaScript encoding reversed (upon execution) in the single quotes.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

`doubleJavaScriptEncodedData` は、単一引用符内で JavaScript エンコードの最初のレイヤーが (実行時に) 解除されます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Then the implicit `eval` of `setTimeout` reverses another layer of JavaScript encoding to pass the correct value to `customFunction`

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

その後、`setTimeout` の暗黙的な `eval` が JavaScript エンコードの別レイヤーを解除し、正しい値を `customFunction` へ渡します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The reason why you only need to double JavaScript encode is that the `customFunction` function did not itself pass the input to another method which implicitly or explicitly called `eval` If *firstName* was passed to another JavaScript method which implicitly or explicitly called `eval()` then `<%=doubleJavaScriptEncodedData%>` above would need to be changed to `<%=tripleJavaScriptEncodedData%>`.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

二重 JavaScript エンコードだけで済む理由は、`customFunction` 関数自体が、暗黙的または明示的に `eval` を呼び出す別のメソッドへ入力を渡していないためです。*firstName* が暗黙的または明示的に `eval()` を呼び出す別の JavaScript メソッドへ渡される場合、上記の `<%=doubleJavaScriptEncodedData%>` は `<%=tripleJavaScriptEncodedData%>` に変更する必要があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

An important implementation note is that if the JavaScript code tries to utilize the double or triple encoded data in string comparisons, the value may be interpreted as different values based on the number of `evals()` the data has passed through before being passed to the if comparison and the number of times the value was JavaScript encoded.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

重要な実装上の注意として、JavaScript コードが二重または三重にエンコードされたデータを文字列比較で利用しようとすると、そのデータが if 比較へ渡される前に通過した `evals()` の数と、値が JavaScript エンコードされた回数に基づいて、値が異なるものとして解釈される場合があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

If **A** is double JavaScript encoded then the following **if** check will return false.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**A** が二重 JavaScript エンコードされている場合、次の **if** チェックは false を返します。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```javascript
 var x = "doubleJavaScriptEncodedA";  //\u005c\u0075\u0030\u0030\u0034\u0031
 if (x == "A") {
    alert("x is A");
 } else if (x == "\u0041") {
    alert("This is what pops");
 }
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

This brings up an interesting design point. Ideally, the correct way to apply encoding and avoid the problem stated above is to server-side encode for the output context where data is introduced into the application.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

これは興味深い設計上の論点を提起します。理想的には、エンコードを適用して上記の問題を避ける正しい方法は、データがアプリケーションへ導入される出力コンテキストに対してサーバ側でエンコードすることです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Then client-side encode (using a JavaScript encoding library such as [node-esapi](https://github.com/ESAPI/node-esapi/)) for the individual subcontext (DOM methods) which untrusted data is passed to.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

次に、信頼できないデータが渡される個々のサブコンテキスト (DOM メソッド) に対して、[node-esapi](https://github.com/ESAPI/node-esapi/) などの JavaScript エンコードライブラリを使ってクライアント側でエンコードします。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Here are some examples of how they are used:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

使用例をいくつか示します。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```javascript
//server-side encoding
var ESAPI = require('node-esapi');
var input = "<%=ESAPI.encoder().encodeForJavascript(untrustedData)%>";
```html

</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```javascript
//HTML encoding is happening in JavaScript
var ESAPI = require('node-esapi');
document.writeln(ESAPI.encoder().encodeForHTML(input));
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

One option is utilize ECMAScript 5 immutable properties in the JavaScript library.
Another option provided by Gaz (Gareth) was to use a specific code construct to limit mutability with anonymous closures.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

一つの選択肢は、JavaScript ライブラリ内で ECMAScript 5 の immutable properties を利用することです。
Gaz (Gareth) が提示したもう一つの選択肢は、匿名クロージャを使って可変性を制限する特定のコード構造を使うことでした。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

An example follows:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

例を示します。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```javascript
function escapeHTML(str) {
     str = str + "''";
     var out = "''";
     for(var i=0; i<str.length; i++) {
         if(str[i] === '<') {
             out += '&lt;';
         } else if(str[i] === '>') {
             out += '&gt;';
         } else if(str[i] === "'") {
             out += '&#39;';
         } else if(str[i] === '"') {
             out += '&quot;';
         } else {
             out += str[i];
         }
     }
     return out;
}
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### GUIDELINE \\#6 - Use untrusted data on only the right side of an expression

Use untrusted data on only the right side of an expression, especially data that looks like code and may be passed to the application (e.g., `location` and `eval()`).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### GUIDELINE \\#6 - 信頼できないデータは式の右辺でのみ使用する

信頼できないデータは式の右辺でのみ使用します。特に、コードのように見え、アプリケーションへ渡される可能性があるデータ (`location` や `eval()` など) ではそうしてください。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```javascript
window[userDataOnLeftSide] = "userDataOnRightSide";
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Using untrusted user data on the left side of the expression allows an attacker to subvert internal and external attributes of the window object, whereas using user input on the right side of the expression doesn't allow direct manipulation.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

式の左辺で信頼できないユーザーデータを使うと、攻撃者は window オブジェクトの内部属性および外部属性を破壊できます。一方、式の右辺でユーザー入力を使っても、直接操作は許されません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### GUIDELINE \\#7 - When URL encoding in DOM be aware of character set issues

When URL encoding in DOM be aware of character set issues as the character set in JavaScript DOM is not clearly defined (Mike Samuel).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### GUIDELINE \\#7 - DOM で URL エンコードするときは文字セットの問題に注意する

DOM で URL エンコードするときは、JavaScript DOM の文字セットが明確に定義されていないため、文字セットの問題に注意してください (Mike Samuel)。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### GUIDELINE \\#8 - Limit access to object properties when using object\\[x\\] accessors

Limit access to object properties when using `object[x]` accessors (Mike Samuel). In other words, add a level of indirection between untrusted input and specified object properties.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### GUIDELINE \\#8 - object\\[x\\] アクセサを使うときはオブジェクトプロパティへのアクセスを制限する

`object[x]` アクセサを使うときは、オブジェクトプロパティへのアクセスを制限します (Mike Samuel)。言い換えると、信頼できない入力と指定されたオブジェクトプロパティの間に間接参照のレベルを追加します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Here is an example of the problem using map types:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

map 型を使った問題の例を示します。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```javascript
var myMapType = {};
myMapType[<%=untrustedData%>] = "moreUntrustedData";
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The developer writing the code above was trying to add additional keyed elements to the `myMapType` object. However, this could be used by an attacker to subvert internal and external attributes of the `myMapType` object.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

上記のコードを書いた開発者は、`myMapType` オブジェクトへキー付き要素を追加しようとしていました。しかし、攻撃者はこれを使って `myMapType` オブジェクトの内部属性および外部属性を破壊できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

A better approach would be to use the following:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

よりよいアプローチは次のようにすることです。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```javascript
if (untrustedData === 'location') {
  myMapType.location = "moreUntrustedData";
}
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### GUIDELINE \\#9 - Run your JavaScript in a ECMAScript 5 canopy or sandbox

Run your JavaScript in a ECMAScript 5 [canopy](https://github.com/jcoglan/canopy) or sandbox to make it harder for your JavaScript API to be compromised (Gareth Heyes and John Stevens).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### GUIDELINE \\#9 - JavaScript を ECMAScript 5 canopy または sandbox 内で実行する

JavaScript API が侵害されにくくなるよう、JavaScript を ECMAScript 5 の [canopy](https://github.com/jcoglan/canopy) または sandbox 内で実行します (Gareth Heyes と John Stevens)。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Examples of some JavaScript sandbox / sanitizers:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

JavaScript sandbox / sanitizer の例をいくつか示します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- [js-xss](https://github.com/leizongmin/js-xss)
- [sanitize-html](https://github.com/apostrophecms/sanitize-html)
- [DOMPurify](https://github.com/cure53/DOMPurify)
- [MDN - HTML Sanitizer API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Sanitizer_API)
- [OWASP Summit 2011 - DOM Sandboxing](https://owasp.org/www-pdf-archive/OWASPSummit2011DOMSandboxingBrowserSecurityTrack.pdf)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- [js-xss](https://github.com/leizongmin/js-xss)
- [sanitize-html](https://github.com/apostrophecms/sanitize-html)
- [DOMPurify](https://github.com/cure53/DOMPurify)
- [MDN - HTML Sanitizer API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Sanitizer_API)
- [OWASP Summit 2011 - DOM Sandboxing](https://owasp.org/www-pdf-archive/OWASPSummit2011DOMSandboxingBrowserSecurityTrack.pdf)

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### GUIDELINE \\#10 - Don't eval() JSON to convert it to native JavaScript objects

Don't `eval()` JSON to convert it to native JavaScript objects. Instead use `JSON.toJSON()` and `JSON.parse()` (Chris Schmidt).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### GUIDELINE \\#10 - JSON をネイティブ JavaScript オブジェクトへ変換するために eval() しない

JSON をネイティブ JavaScript オブジェクトへ変換するために `eval()` しないでください。代わりに `JSON.toJSON()` と `JSON.parse()` を使います (Chris Schmidt)。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Common Problems Associated with Mitigating DOM Based XSS

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## DOM Based XSS の緩和に関連するよくある問題

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Complex Contexts

In many cases the context isn't always straightforward to discern.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 複雑なコンテキスト

多くの場合、コンテキストは必ずしも簡単に識別できるわけではありません。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<a href="javascript:myFunction('<%=untrustedData%>', 'test');">Click Me</a>
 ...
<script>
Function myFunction (url,name) {
    window.location = url;
}
</script>
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

In the above example, untrusted data started in the rendering URL context (`href` attribute of an `a` tag) then changed to a JavaScript execution context (`javascript:` protocol handler) which passed the untrusted data to an execution URL subcontext (`window.location` of `myFunction`).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

上の例では、信頼できないデータは最初にレンダリング URL コンテキスト (`a` タグの `href` 属性) に入り、その後 JavaScript 実行コンテキスト (`javascript:` プロトコルハンドラ) へ変化し、信頼できないデータを実行 URL サブコンテキスト (`myFunction` の `window.location`) へ渡しています。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Because the data was introduced in JavaScript code and passed to a URL subcontext the appropriate server-side encoding would be the following:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

データは JavaScript コード内に導入され、URL サブコンテキストへ渡されるため、適切なサーバ側エンコードは次のようになります。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<a href="javascript:myFunction('<%=ESAPI.encoder().encodeForJavascript(ESAPI.encoder().encodeForURL(untrustedData)) %>', 'test');">
Click Me</a>
 ...
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Or if you were using ECMAScript 5 with an immutable JavaScript client-side encoding libraries you could do the following:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

または、immutable な JavaScript クライアント側エンコードライブラリを使う ECMAScript 5 を使用している場合は、次のようにできます。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<!-- server side URL encoding has been removed.  Now only JavaScript encoding on server side. -->
<a href="javascript:myFunction('<%=ESAPI.encoder().encodeForJavascript(untrustedData)%>', 'test');">Click Me</a>
 ...
<script>
Function myFunction (url,name) {
    var encodedURL = ESAPI.encoder().encodeForURL(url);  //URL encoding using client-side scripts
    window.location = encodedURL;
}
</script>
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Inconsistencies of Encoding Libraries

There are a number of open source encoding libraries out there:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### エンコードライブラリの不整合

オープンソースのエンコードライブラリは数多くあります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

1. OWASP [ESAPI](https://owasp.org/www-project-enterprise-security-api/)
2. OWASP [Java Encoder](https://owasp.org/www-project-java-encoder/)
3. Apache Commons Text [StringEscapeUtils](https://commons.apache.org/proper/commons-text/javadocs/api-release/org/apache/commons/text/StringEscapeUtils.html), replace one from [Apache Commons Lang3](https://commons.apache.org/proper/commons-lang/apidocs/org/apache/commons/lang3/StringEscapeUtils.html)
4. [Jtidy](http://jtidy.sourceforge.net/)
5. Your company's custom implementation.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

1. OWASP [ESAPI](https://owasp.org/www-project-enterprise-security-api/)
2. OWASP [Java Encoder](https://owasp.org/www-project-java-encoder/)
3. Apache Commons Text [StringEscapeUtils](https://commons.apache.org/proper/commons-text/javadocs/api-release/org/apache/commons/text/StringEscapeUtils.html)、[Apache Commons Lang3](https://commons.apache.org/proper/commons-lang/apidocs/org/apache/commons/lang3/StringEscapeUtils.html) のものを置き換えるもの
4. [Jtidy](http://jtidy.sourceforge.net/)
5. 自社のカスタム実装

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Some work on a denylist while others ignore important characters like "&lt;" and "&gt;".

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

denylist で動くものもあれば、"&lt;" や "&gt;" のような重要な文字を無視するものもあります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Java Encoder is an active project providing supports for HTML, CSS and JavaScript encoding.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Java Encoder は、HTML、CSS、JavaScript エンコードをサポートするアクティブなプロジェクトです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

ESAPI is one of the few which works on an allowlist and encodes all non-alphanumeric characters. It is important to use an encoding library that understands which characters can be used to exploit vulnerabilities in their respective contexts. Misconceptions abound related to the proper encoding that is required.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

ESAPI は allowlist で動作し、すべての非英数字をエンコードする数少ないライブラリの一つです。それぞれのコンテキストで脆弱性の悪用に使える文字を理解しているエンコードライブラリを使うことが重要です。必要な適切なエンコードに関しては誤解が多くあります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Encoding Misconceptions

Many security training curriculums and papers advocate the blind usage of HTML encoding to resolve XSS.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### エンコードに関する誤解

多くのセキュリティトレーニングカリキュラムや論文は、XSS を解決するために HTML エンコードを盲目的に使用することを推奨しています。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

This logically seems to be prudent advice as the JavaScript parser does not understand HTML encoding.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

JavaScript パーサは HTML エンコードを理解しないため、これは論理的には慎重な助言のように見えます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

However, if the pages returned from your web application utilize a content type of `text/xhtml` or the file type extension of `*.xhtml` then HTML encoding may not work to mitigate against XSS.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

しかし、Web アプリケーションから返されるページが `text/xhtml` のコンテンツタイプを使用している場合、またはファイル拡張子が `*.xhtml` の場合、HTML エンコードは XSS の緩和に機能しない可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

For example:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

例を示します。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<script>
&#x61;lert(1);
</script>
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The HTML encoded value above is still executable. If that isn't enough to keep in mind, you have to remember that encodings are lost when you retrieve them using the value attribute of a DOM element.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

上記の HTML エンコードされた値は依然として実行可能です。さらに覚えておくべきこととして、DOM 要素の value 属性を使って値を取得すると、エンコードは失われます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Let's look at the sample page and script:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

サンプルページとスクリプトを見てみます。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<form name="myForm" ...>
  <input type="text" name="lName" value="<%=ESAPI.encoder().encodeForHTML(last_name)%>">
 ...
</form>
<script>
  var x = document.myForm.lName.value;  //when the value is retrieved the encoding is reversed
  document.writeln(x);  //any code passed into lName is now executable.
</script>
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Finally there is the problem that certain methods in JavaScript which are usually safe can be unsafe in certain contexts.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

最後に、通常は安全な JavaScript の特定のメソッドが、一部のコンテキストでは安全でなくなるという問題があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Usually Safe Methods

One example of an attribute which is thought to be safe is `innerText`.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 通常は安全なメソッド

安全だと考えられている属性の一例は `innerText` です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Some papers or guides advocate its use as an alternative to `innerHTML` to mitigate against XSS in `innerHTML`. However, depending on the tag which `innerText` is applied, code can be executed.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

一部の論文やガイドは、`innerHTML` における XSS を緩和するために、`innerHTML` の代替として `innerText` の使用を推奨しています。しかし、`innerText` が適用されるタグによっては、コードが実行される可能性があります。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<script>
 var tag = document.createElement("script");
 tag.innerText = "<%=untrustedData%>";  //executes code
</script>
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The `innerText` feature was originally introduced by Internet Explorer, and was formally specified in the HTML standard in 2016 after being adopted by all major browser vendors.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

`innerText` 機能はもともと Internet Explorer によって導入され、主要ブラウザベンダーすべてに採用された後、2016 年に HTML 標準で正式に仕様化されました。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Detect DOM XSS using variant analysis

**Vulnerable code:**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### variant analysis を使って DOM XSS を検出する

**脆弱なコード:**

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<script>
var x = location.hash.split("#")[1];
document.write(x);
</script>
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Semgrep rule to identify above dom xss [link](https://semgrep.dev/s/we30).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

上記の DOM XSS を識別する Semgrep ルールは、この [link](https://semgrep.dev/s/we30) です。

</div>
</div>

</section>
</div>



## Attribution

<div className="attributionFooter">

- Original: DOM based XSS Prevention Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: English original retained for comparison. Japanese translation added. Bilingual display generated from official source and local Japanese translation.
- Retrieved: 2026-05-20

</div>
