---
title: Third Party Javascript Management Cheat Sheet
hide_title: true
---

<div className="docHero" data-category="asvs-v15">
  <h1>サードパーティ JavaScript 管理チートシート</h1>
  <div className="docMeta">
    <span className="docPill">最終更新: 2026-05-20</span>
    <span className="docPill">読了時間: 準備中</span>
    <span className="docPill">カテゴリ: Web フロントエンドセキュリティ</span>
  </div>
</div>

<p className="docLead">サードパーティ JavaScript 管理チートシートを、原文・翻訳・対比表示で確認できます。ASVS Index 対応の文脈で、公式原文と日本語訳を確認しやすく整理しています。</p>

<div className="tabbedContent">
  <input className="tabInput" type="radio" name="third-party-javascript-management-view" id="third-party-javascript-management-original" />
  <input className="tabInput" type="radio" name="third-party-javascript-management-view" id="third-party-javascript-management-translation" defaultChecked />
  <input className="tabInput" type="radio" name="third-party-javascript-management-view" id="third-party-javascript-management-bilingual" />

  <div className="contentTabs">
    <label htmlFor="third-party-javascript-management-original" title="OWASP 原文">原文</label>
    <label htmlFor="third-party-javascript-management-translation" title="日本語訳">翻訳</label>
    <label htmlFor="third-party-javascript-management-bilingual" title="原文と翻訳を並べて確認">対比表示</label>
  </div>

<section id="third-party-javascript-management-original-panel" className="tabPanel originalPanel contentPanel">

## Introduction

Tags, aka marketing tags, analytics tags etc. are small bits of JavaScript on a web page. They can also be HTML image elements when JavaScript is disabled. The reason for them is to collect data on the web user actions and browsing context for use by the web page owner in marketing.

Third party vendor JavaScript tags (hereinafter, **tags**) can be divided into two types:

- User interface tags.
- Analytic tags.

User interface tags have to execute on the client because they change the DOM; displaying a dialog or image or changing text etc.

Analytics tags send information back to a marketing information database; information like what user action was just taken, browser metadata, location information, page metadata etc. The rationale for analytics tags is to provide data from the user's browser DOM to the vendor for some form of marketing analysis. This data can be anything available in the DOM. The data is used for user navigation and clickstream analysis, identification of the user to determine further content to display etc., and various marketing analysis functions.

The term **host** refers to the original site the user goes to, such as a shopping or news site, that contains or retrieves and executes third party JavaScript tag for marketing analysis of the user actions.

## Major risks

The single greatest risk is a compromise of the third party JavaScript server, and the injection of malicious JavaScript into the original tag JavaScript. This has happened in 2018 and likely earlier.

The invocation of third-party JS code in a web application requires consideration for 3 risks in particular:

1. The loss of control over changes to the client application,
2. The execution of arbitrary code on client systems,
3. The disclosure or leakage of sensitive information to 3rd parties.

### Risk 1: Loss of control over changes to the client application

This risk arises from the fact that there is usually no guarantee that the code hosted at the third-party will remain the same as seen from the developers and testers: new features may be pushed in the third-party code at any time, thus potentially breaking the interface or data-flows and exposing the availability of your application to its users/customers.

Typical defenses include, but are not restricted to: in-house script mirroring (to prevent alterations by 3rd parties), sub-resource integrity (to enable browser-level interception) and secure transmission of the third-party code (to prevent modifications while in-transit). See below for more details.

### Risk 2: Execution of arbitrary code on client systems

This risk arises from the fact that third-party JavaScript code is rarely reviewed by the invoking party prior to its integration into a website/application. As the client reaches the hosting website/application, this third-party code gets executed, thus granting the third-party the exact same privileges that were granted to the user (similar to [XSS attacks](https://owasp.org/www-community/attacks/xss/)).

Any testing performed prior to entering production loses some of its validity, including `AST testing` ([IAST](https://www.veracode.com/security/interactive-application-security-testing-iast), [RAST](https://www.veracode.com/sites/default/files/pdf/resources/whitepapers/what-is-rasp.pdf), [SAST](https://www.sqreen.com/web-application-security/what-is-sast), [DAST](https://www.sqreen.com/web-application-security/what-is-dast), etc.).

While it is widely accepted that the probability of having rogue code intentionally injected by the third-party is low, there are still cases of malicious injections in third-party code after the organization's servers were compromised (ex: Yahoo, January 2014).

This risk should therefore still be evaluated, in particular when the third-party does not show any documentation that it is enforcing better security measures than the invoking organization itself, or at least equivalent. Another example is that the domain hosting the third-party JavaScript code expires because the company maintaining it is bankrupt or the developers have abandoned the project. A malicious actor can then re-register the domain and publish malicious code.

Typical defenses include, but are not restricted to:

- In-house script mirroring (to prevent alterations by 3rd parties),
- [Sub-resource integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity) (to enable browser-level interception),
- Secure transmission of the third-party code (to prevent modifications while in-transit) and various types of sandboxing. See below for more details.
- ...

### Risk 3: Disclosure of sensitive information to 3rd parties

When a third-party script is invoked in a website/application, the browser directly contacts the third-party servers. By default, the request includes all regular HTTP headers. In addition to the originating IP address of the browser, the third-party also obtains other data such as the referrer (in non-https requests) and any cookies previously set by the third-party, for example when visiting another organization's website that also invokes the third-party script.

In many cases, this grants the third-party primary access to information on the organization's users / customers / clients. Additionally, if the third-party is sharing the script with other entities, it also collects secondary data from all the other entities, thus knowing who the organization's visitors are but also what other organizations they interact with.

A typical case is the current situation with major news/press sites that invoke third-party code (typically for ad engines, statistics and JavaScript APIs): any user visiting any of these websites also informs the 3rd parties of the visit. In many cases, the third-party also gets to know what news articles each individual user is clicking specifically (leakage occurs through the HTTP referrer field) and thus can establish deeper personality profiles.

Typical defenses include, but are not restricted to: in-house script mirroring (to prevent leakage of HTTP requests to 3rd parties). Users can reduce their profiling by random clicking links on leaking websites/applications (such as press/news websites) to reduce profiling. See below for more details.

## Third-party JavaScript Deployment Architectures

There are three basic deployment mechanisms for **tags**. These mechanisms can be combined with each other.

### Vendor JavaScript on page

This is where the vendor provides the host with the JavaScript and the host puts it on the host page. To be secure the host company must review the code for any vulnerabilities like [XSS attacks](https://owasp.org/www-community/attacks/xss/) or malicious actions such as sending sensitive data from the DOM to a malicious site. This is often difficult because the JavaScript is commonly obfuscated.

```html
<!-- Some host, e.g. foobar.com, HTML code here -->
<html>
<head></head>
    <body>
        ...
        <script type="text/javascript">/* 3rd party vendor javascript here */</script>
    </body>
</html>
```

### JavaScript Request to Vendor

This is where one or a few lines of code on the host page each request a JavaScript file or URL directly from the vendor site. When the host page is being created, the developer includes the lines of code provided by the vendor that will request the vendor JavaScript. Each time the page is accessed the requests are made to the vendor site for the JavaScript, which then executes on the user browser.

```html
<!-- Some host, e.g. foobar.com, HTML code here -->`
<html>
    <head></head>
    <body>
        ...
        <!-- 3rd party vendor javascript -->
        <script src="https://analytics.vendor.com/v1.1/script.js"></script>
        <!-- /3rd party vendor javascript -->
    </body>
</html>
```

### Indirect request to Vendor through Tag Manager

This is where one or a few lines of code on the host page each request a JavaScript file or URL from a tag aggregator or **tag manager** site; not from the JavaScript vendor site. The tag aggregator or tag manager site returns whatever third party JavaScript files that the host company has configured to be returned. Each file or URL request to the tag manager site can return lots of other JavaScript files from multiple vendors.

The actual content that is returned from the aggregator or manager (i.e. the specific JavaScript files as well as exactly what they do) can be dynamically changed by host site employees using a graphical user interface for development, hosted on the tag manager site that non-technical users can work with, such as the marketing part of the business.

The changes can be either:

1. Get a different JavaScript file from the third-party vendor for the same request.
2. Change what DOM object data is read, and when, to send to the vendor.

The tag manager developer user interface will generate code that does what the marketing functionality requires, basically determining what data to get from the browser DOM and when to get it. The tag manager always returns a **container** JavaScript file to the browser which is basically a set of JavaScript functions that are used by the code generated by the user interface to implement the required functionality.

Similar to java frameworks that provide functions and global data to the developer, the container JavaScript executes on the browser and lets the business user use the tag manager developer user interface to specify high level functionality without needing to know JavaScript.

```html
<!-- Some host, e.g. foobar.com, HTML code here -->
 <html>
   <head></head>
     <body>
       ...
       <!-- Tag Manager -->
       <script>(function(w, d, s, l, i){
         w[l] = w[l] || [];
         w[l].push({'tm.start':new Date().getTime(), event:'tm.js'});
         var f = d.getElementsByTagName(s)[0],
         j = d.createElement(s),
         dl = l != 'dataLayer' ? '&l=' + l : '';
         j.async=true;
         j.src='https://tagmanager.com/tm.js?id=' + i + dl;
         f.parentNode.insertBefore(j, f);
       })(window, document, 'script', 'dataLayer', 'TM-FOOBARID');</script>
       <!-- /Tag Manager -->
   </body>
</html>`
```

#### Security Problems with requesting Tags

The previously described mechanisms are difficult to make secure because you can only see the code if you proxy the requests or if you get access to the GUI and see what is configured. The JavaScript is generally obfuscated so even seeing it is usually not useful. It is also instantly deployable because each new page request from a browser executes the requests to the aggregator which gets the JavaScript from the third party vendor. So as soon as any JavaScript files are changed on the vendor, or modified on the aggregator, the next call for them from any browser will get the changed JavaScript. One way to manage this risk is with the *Subresource Integrity* standard described below.

### Server Direct Data Layer

The tag manager developer user interface can be used to create JavaScript that can get data from anywhere in the browser DOM and store it anywhere on the page. This can allow vulnerabilities because the interface can be used to generate code to get unvalidated data from the DOM (e.g. URL parameters) and store it in some page location that would execute JavaScript.

The best way to make the generated code secure is to confine it to getting DOM data from a host defined data layer.

The data layer is either:

1. a DIV object with attribute values that have the marketing or user behavior data that the third-party wants
2. a set of JSON objects with the same data. Each variable or attribute contains the value of some DOM element or the description of a user action. The data layer is the complete set of values that all vendors need for that page. The data layer is created by the host developers.

When specific events happen that the business has defined, a JavaScript handler for that event sends values from the data layer directly to the tag manager server. The tag manager server then sends the data to whatever third party or parties is supposed to get it. The event handler code is created by the host developers using the tag manager developer user interface. The event handler code is loaded from the tag manager servers on every page load.

**This is a secure technique** because only your JavaScript executes on your users browser, and only the data you decide on is sent to the vendor.

This requires cooperation between the host, the aggregator or tag manager and the vendors.

The host developers have to work with the vendor in order to know what type of data the vendor needs to do their analysis. Then the host programmer determines what DOM element will have that data.

The host developers have to work with the tag manager or aggregator to agree on the protocol to send the data to the aggregator: what URL, parameters, format etc.

The tag manager or aggregator has to work with the vendor to agree on the protocol to send the data to the vendor: what URL, parameters, format etc. Does the vendor have an API?

## Security Defense Considerations

### Server Direct Data Layer

The server direct mechanism is a good security standard for third party JavaScript management, deployment and execution. A good practice for the host page is to create a data layer of DOM objects.

The data layer can perform any validation of the values, especially values from DOM objects exposed to the user like URL parameters and input fields, if these are required for the marketing analysis.

An example statement for a corporate standard document is 'The tag JavaScript can only access values in the host data layer. The tag JavaScript can never access a URL parameter.

You the host page developer have to agree with the third-party vendors or the tag manager what attribute in the data layer will have what value so they can create the JavaScript to read that value.

User interface tags cannot be made secure using the data layer architecture because their function (or one of their functions) is to change the user interface on the client, not to send data about the user actions.

Analytics tags can be made secure using the data layer architecture because the only action needed is to send data from the data layer to the third party. Only first party code is executed; first to populate the data layer (generally on page load); then event handler JavaScript sends whatever data is needed from that page to the third party database or tag manager.

This is also a very scalable solution. Large ecommerce sites can easily have hundreds of thousands of URL and parameter combinations, with different sets of URLs and parameters being included in different marketing analysis campaigns. The marketing logic could have 30 or 40 different vendor tags on a single page.

For example user actions in pages about specified cities, from specified locations on specified days should send data layer elements 1, 2 and 3. User actions in pages about other cities should send data layer elements 2 and 3 only. Since the event handler code to send data layer data on each page is controlled by the host developers or marketing technologists using the tag manager developer interface, the business logic about when and what data layer elements are sent to the tag manager server, can be changed and deployed in minutes. No interaction is needed with the third parties; they continue getting the data they expect but now it comes from different contexts that the host marketing technologists have chosen.

Changing third party vendors just means changing the data dissemination rules at the tag manager server, no changes are needed in the host code. The data also goes directly only to the tag manager so the execution is fast. The event handler JavaScript does not have to connect to multiple third party sites.

### Indirect Requests

For indirect requests to tag manager/aggregator sites that offer the GUI to configure the JavaScript, they may also implement:

- Technical controls such as only allowing the JavaScript to access the data layer values, no other DOM element
- Restricting the tag types deployed on a host site, e.g. disabling of custom HTML tags and JavaScript code

The host company should also verify the security practices of the tag manager site such as access controls to the tag configuration for the host company. It also can be two-factor authentication.

Letting the marketing folks decide where to get the data they want can result in XSS because they may get it from a URL parameter and put it into a variable that is in a scriptable location on the page.

### Sandboxing Content

Both of these tools be used by sites to sandbox/clean DOM data.

- [DOMPurify](https://github.com/cure53/DOMPurify) is a fast, tolerant XSS sanitizer for HTML, MathML and SVG. DOMPurify works with a secure default, but offers a lot of configurability and hooks.
- [MentalJS](https://github.com/hackvertor/MentalJS) is a JavaScript parser and sandbox. It allow-lists JavaScript code by adding a "$" suffix to variables and accessors.

### Subresource Integrity

[Subresource Integrity](https://www.w3.org/TR/SRI/) will ensure that only the code that has been reviewed is executed. The developer generates integrity metadata for the vendor JavaScript, and adds it to the script element like this:

```javascript
<script src="https://analytics.vendor.com/v1.1/script.js"
   integrity="sha384-MBO5IDfYaE6c6Aao94oZrIOiC7CGiSNE64QUbHNPhzk8Xhm0djE6QqTpL0HzTUxk"
   crossorigin="anonymous">
</script>
```

It is important to know that in order for SRI to work, the vendor host needs [CORS](https://www.w3.org/TR/cors/) enabled. Also it is good idea to monitor vendor JavaScript for changes in regular way. Because sometimes you can get **secure** but **not working** third-party code when the vendor decides to update it.

### Keeping JavaScript libraries updated

[OWASP Top 10 2013 A9](https://wiki.owasp.org/index.php/Top_10_2013-A9-Using_Components_with_Known_Vulnerabilities) describes the problem of using components with known vulnerabilities. This includes JavaScript libraries. JavaScript libraries must be kept up to date, as previous version can have known vulnerabilities which can lead to the site typically being vulnerable to [Cross Site Scripting](https://owasp.org/www-community/attacks/xss/). There are several tools out there that can help identify such libraries. One such tool is the free open source tool [RetireJS](https://retirejs.github.io)

### Sandboxing with iframe

You can also put vendor JavaScript into an iframe from different domain (e.g. static data host). It will work as a "jail" and vendor JavaScript will not have direct access to the host page DOM and cookies.

The host main page and sandbox iframe can communicate between each other via the [postMessage mechanism](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage).

Also, iframes can be secured with the iframe [sandbox attribute](http://www.html5rocks.com/en/tutorials/security/sandboxed-iframes/).

For high risk applications, consider the use of [Content Security Policy (CSP)](https://www.w3.org/TR/CSP2/) in addition to iframe sandboxing. CSP makes hardening against XSS even stronger.

```html
<!-- Some host, e.g. somehost.com, HTML code here -->
 <html>
   <head></head>
     <body>
       ...
       <!-- Include iframe with 3rd party vendor javascript -->
       <iframe
       src="https://somehost-static.net/analytics.html"
       sandbox="allow-same-origin allow-scripts">
       </iframe>
   </body>
 </html>

<!-- somehost-static.net/analytics.html -->
 <html>
   <head></head>
     <body>
       ...
       <script>
       window.addEventListener("message", receiveMessage, false);
       function receiveMessage(event) {
         if (event.origin !== "https://somehost.com:443") {
           return;
         } else {
         // Make some DOM here and initialize other
        //data required for 3rd party code
         }
       }
       </script>
       <!-- 3rd party vendor javascript -->
       <script src="https://analytics.vendor.com/v1.1/script.js"></script>
       <!-- /3rd party vendor javascript -->
   </body>
 </html>
```

### Virtual iframe Containment

This technique creates iFrames that run asynchronously in relation to the main page. It also provides its own containment JavaScript that automates the dynamic implementation of the protected iFrames based on the marketing tag requirements.

### Vendor Agreements

You can have the agreement or request for proposal with the 3rd parties require evidence that they have implemented secure coding and general corporate server access security. But in particular you need to determine the monitoring and control of their source code in order to prevent and detect malicious changes to that JavaScript.

## MarTechSec

Marketing Technology Security

This refers to all aspects of reducing the risk from marketing JavaScript. Controls include

1. Contractual controls for risk reduction; the contracts with any MarTech company should include a requirement to show evidence of code security and code integrity monitoring.
2. Contractual controls for risk transference: the contracts with any MarTech company could include a penalty for serving malicious JavaScript
3. Technical controls for malicious JavaScript execution prevention; Virtual Iframes,
4. Technical controls for malicious JavaScript identification; [Subresource Integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity).
5. Technical controls including client side JavaScript malicious behavior in penetration testing requirements.

## MarSecOps

Marketing Security Operations

This refers to the operational requirements to maintain some of the technical controls. This involves possible cooperation and information exchange between the marketing team, the martech provider and the run or operations team to update the information in the page controls (SRI hash change, changes in pages with SRI), the policies in the Virtual iFrames, tag manager configuration, data layer changes etc.

The most complete and preventive controls for any site containing non-trivial marketing tags are -

1. A data layer that calls the marketing server or tag manager APIs , so that only your code executes on your page (inversion of control).

2. [Subresource Integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity).

3. Virtual frame Containment.

The MarSecOps requirements to implement technical controls at the speed of change that marketing wants or without a significant number of dedicated resources, can make data layer and Subresource Integrity controls impractical.

</section>

<section id="third-party-javascript-management-translation-panel" className="tabPanel translationPanel contentPanel">

## はじめに

タグ、つまりマーケティングタグや分析タグなどは、Web ページ上の小さな JavaScript 片です。JavaScript が無効な場合には HTML の画像要素であることもあります。これらは、Web ページ所有者がマーケティングに利用するために、Web 利用者の操作や閲覧コンテキストに関するデータを収集する目的で使われます。

サードパーティベンダの JavaScript タグ (以下、**タグ**) は、二つの種類に分けられます。

- ユーザーインターフェースタグ。
- 分析タグ。

ユーザーインターフェースタグは、ダイアログや画像の表示、テキストの変更など、DOM を変更するため、クライアント上で実行する必要があります。

分析タグは、直前に実行された利用者操作、ブラウザメタデータ、位置情報、ページメタデータなどの情報をマーケティング情報データベースへ送信します。分析タグの根拠は、何らかのマーケティング分析のために、利用者のブラウザ DOM からベンダへデータを提供することです。このデータは DOM で利用できるものであれば何でも含み得ます。データは、利用者のナビゲーションやクリックストリーム分析、表示する追加コンテンツを決めるための利用者識別、その他さまざまなマーケティング分析機能に使われます。

**ホスト**という用語は、利用者が訪問するショッピングサイトやニュースサイトなどの元のサイトを指します。このサイトは、利用者操作のマーケティング分析のためにサードパーティ JavaScript タグを含める、または取得して実行します。

## 主なリスク

最大の単一リスクは、サードパーティ JavaScript サーバが侵害され、元のタグ JavaScript に悪意のある JavaScript が注入されることです。これは 2018 年に発生しており、おそらくそれ以前にも発生しています。

Web アプリケーションでサードパーティ JS コードを呼び出す場合、特に次の三つのリスクを考慮する必要があります。

1. クライアントアプリケーションへの変更に対する制御の喪失。
2. クライアントシステム上での任意コード実行。
3. 機密情報のサードパーティへの開示または漏えい。

### リスク 1: クライアントアプリケーションへの変更に対する制御の喪失

このリスクは、開発者やテスターが見たときと同じコードがサードパーティ側でホストされ続ける保証が通常ないことから生じます。サードパーティコードにはいつでも新機能が投入される可能性があり、その結果インターフェースやデータフローが壊れ、アプリケーションの可用性が利用者や顧客に対して影響を受ける可能性があります。

典型的な防御策には、サードパーティによる変更を防ぐための社内スクリプトミラーリング、ブラウザレベルでの遮断を可能にする Subresource Integrity、転送中の変更を防ぐためのサードパーティコードの安全な送信などがありますが、これらに限定されません。詳細は後述します。

### リスク 2: クライアントシステム上での任意コード実行

このリスクは、サードパーティ JavaScript コードが Web サイトやアプリケーションに組み込まれる前に、呼び出し側によってレビューされることがほとんどないという事実から生じます。クライアントがホスティング Web サイトやアプリケーションに到達すると、このサードパーティコードが実行され、サードパーティには利用者に付与されたものとまったく同じ権限が与えられます ([XSS attacks](https://owasp.org/www-community/attacks/xss/) と同様です)。

本番投入前に実施されたテストは、`AST testing` ([IAST](https://www.veracode.com/security/interactive-application-security-testing-iast)、[RAST](https://www.veracode.com/sites/default/files/pdf/resources/whitepapers/what-is-rasp.pdf)、[SAST](https://www.sqreen.com/web-application-security/what-is-sast)、[DAST](https://www.sqreen.com/web-application-security/what-is-dast) など) を含め、その有効性の一部を失います。

サードパーティが意図的に不正コードを注入する確率は低いと広く受け止められていますが、組織のサーバが侵害された後にサードパーティコードへ悪意のある注入が行われた事例は存在します (例: Yahoo、2014 年 1 月)。

したがって、特にサードパーティが、呼び出し側組織自身よりも優れた、または少なくとも同等のセキュリティ対策を実施していることを示す文書を提示していない場合、このリスクは評価するべきです。別の例として、サードパーティ JavaScript コードをホストするドメインが、その会社の破産や開発者によるプロジェクト放棄によって期限切れになることがあります。その場合、悪意のある行為者がそのドメインを再登録し、悪意のあるコードを公開できます。

典型的な防御策には次のものがありますが、これらに限定されません。

- サードパーティによる変更を防ぐための社内スクリプトミラーリング。
- ブラウザレベルでの遮断を可能にする [Sub-resource integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity)。
- 転送中の変更を防ぐためのサードパーティコードの安全な送信、および各種サンドボックス化。詳細は後述します。
- ...

### リスク 3: 機密情報のサードパーティへの開示

Web サイトやアプリケーションでサードパーティスクリプトが呼び出されると、ブラウザはサードパーティサーバへ直接接続します。デフォルトでは、このリクエストには通常の HTTP ヘッダーがすべて含まれます。ブラウザの送信元 IP アドレスに加えて、サードパーティはリファラー (非 HTTPS リクエストの場合) や、たとえば同じサードパーティスクリプトを呼び出す別組織の Web サイトを訪問した際にサードパーティが以前設定した Cookie など、他のデータも取得します。

多くの場合、これによりサードパーティは組織の利用者、顧客、クライアントに関する情報へ一次的にアクセスできるようになります。さらに、サードパーティがそのスクリプトを他のエンティティと共有している場合、他のすべてのエンティティから二次データも収集します。そのため、組織の訪問者が誰であるかだけでなく、彼らがどの他組織とやり取りしているかも把握できます。

典型例は、広告エンジン、統計、JavaScript API のためにサードパーティコードを呼び出す大手ニュースサイトや報道サイトの現状です。これらの Web サイトを訪問する利用者は、その訪問をサードパーティにも通知しています。多くの場合、サードパーティは個々の利用者が具体的にどの記事をクリックしているかも知ることができ (HTTP リファラーフィールドを通じて漏えいします)、より深い人格プロファイルを構築できます。

典型的な防御策には、サードパーティへの HTTP リクエスト漏えいを防ぐための社内スクリプトミラーリングなどがありますが、これに限定されません。利用者は、報道・ニュースサイトなど漏えいのある Web サイトやアプリケーションでリンクをランダムにクリックすることで、プロファイリングを低減できます。詳細は後述します。

## サードパーティ JavaScript のデプロイアーキテクチャ

**タグ**には三つの基本的なデプロイ方式があります。これらの方式は互いに組み合わせることもできます。

### ページ上のベンダ JavaScript

これは、ベンダがホストに JavaScript を提供し、ホストがそれをホストページに配置する方式です。安全にするには、ホスト企業が [XSS attacks](https://owasp.org/www-community/attacks/xss/) のような脆弱性や、DOM から機密データを悪意のあるサイトへ送信するなどの悪意ある動作がないか、コードをレビューしなければなりません。JavaScript は一般に難読化されているため、これは多くの場合困難です。

```html
<!-- Some host, e.g. foobar.com, HTML code here -->
<html>
<head></head>
    <body>
        ...
        <script type="text/javascript">/* 3rd party vendor javascript here */</script>
    </body>
</html>
```

### ベンダへの JavaScript リクエスト

これは、ホストページ上の一行または数行のコードが、ベンダサイトから JavaScript ファイルまたは URL を直接リクエストする方式です。ホストページを作成するとき、開発者はベンダが提供した、ベンダ JavaScript をリクエストするコード行を含めます。ページにアクセスされるたびに、JavaScript を取得するためのリクエストがベンダサイトへ送信され、その JavaScript が利用者のブラウザ上で実行されます。

```html
<!-- Some host, e.g. foobar.com, HTML code here -->`
<html>
    <head></head>
    <body>
        ...
        <!-- 3rd party vendor javascript -->
        <script src="https://analytics.vendor.com/v1.1/script.js"></script>
        <!-- /3rd party vendor javascript -->
    </body>
</html>
```

### タグマネージャ経由でのベンダへの間接リクエスト

これは、ホストページ上の一行または数行のコードが、JavaScript ベンダサイトではなく、タグ集約サイトまたは**タグマネージャ**サイトから JavaScript ファイルまたは URL をリクエストする方式です。タグ集約サイトまたはタグマネージャサイトは、ホスト企業が返すよう構成した任意のサードパーティ JavaScript ファイルを返します。タグマネージャサイトへの各ファイルまたは URL リクエストは、複数ベンダの多数の JavaScript ファイルを返す可能性があります。

集約サイトまたはマネージャから実際に返される内容、つまり具体的な JavaScript ファイルとそれらが正確に何をするかは、タグマネージャサイト上でホストされる開発用のグラフィカルユーザーインターフェースを使って、ホストサイトの従業員が動的に変更できます。この GUI は、事業部門のマーケティング担当者など、非技術者でも扱えます。

変更には次のものがあります。

1. 同じリクエストに対して、サードパーティベンダから別の JavaScript ファイルを取得する。
2. ベンダへ送信するために、どの DOM オブジェクトデータをいつ読み取るかを変更する。

タグマネージャの開発者ユーザーインターフェースは、マーケティング機能に必要な動作を行うコードを生成します。基本的には、ブラウザ DOM からどのデータをいつ取得するかを決定します。タグマネージャは常に**コンテナ** JavaScript ファイルをブラウザへ返します。これは基本的に、ユーザーインターフェースで生成されたコードが必要な機能を実装するために使う JavaScript 関数群です。

開発者へ関数やグローバルデータを提供する Java フレームワークと同様に、コンテナ JavaScript はブラウザ上で実行され、ビジネスユーザーが JavaScript を知らなくてもタグマネージャの開発者ユーザーインターフェースで高レベルの機能を指定できるようにします。

```html
<!-- Some host, e.g. foobar.com, HTML code here -->
 <html>
   <head></head>
     <body>
       ...
       <!-- Tag Manager -->
       <script>(function(w, d, s, l, i){
         w[l] = w[l] || [];
         w[l].push({'tm.start':new Date().getTime(), event:'tm.js'});
         var f = d.getElementsByTagName(s)[0],
         j = d.createElement(s),
         dl = l != 'dataLayer' ? '&l=' + l : '';
         j.async=true;
         j.src='https://tagmanager.com/tm.js?id=' + i + dl;
         f.parentNode.insertBefore(j, f);
       })(window, document, 'script', 'dataLayer', 'TM-FOOBARID');</script>
       <!-- /Tag Manager -->
   </body>
</html>`
```

#### タグをリクエストする際のセキュリティ問題

前述の方式は安全にすることが困難です。コードを見るにはリクエストをプロキシするか、GUI へアクセスして設定内容を見る必要があるためです。JavaScript は一般に難読化されているため、見えたとしても通常は有用ではありません。また、ブラウザからの新しいページリクエストごとに集約サイトへのリクエストが実行され、集約サイトがサードパーティベンダから JavaScript を取得するため、即時にデプロイされます。したがって、ベンダ上で JavaScript ファイルが変更される、または集約サイト上で変更されると、どのブラウザからの次の呼び出しでも変更後の JavaScript が取得されます。このリスクを管理する一つの方法は、後述する *Subresource Integrity* 標準です。

### サーバ直接データレイヤ

タグマネージャの開発者ユーザーインターフェースは、ブラウザ DOM の任意の場所からデータを取得し、ページ上の任意の場所に保存できる JavaScript を作成するために使えます。これにより、DOM から未検証データ (URL パラメータなど) を取得し、JavaScript が実行される可能性があるページ位置に保存するコードをインターフェースで生成できるため、脆弱性が生じる可能性があります。

生成されたコードを安全にする最善の方法は、ホストが定義したデータレイヤから DOM データを取得することに限定することです。

データレイヤは次のいずれかです。

1. サードパーティが必要とするマーケティングデータまたは利用者行動データを属性値として持つ DIV オブジェクト。
2. 同じデータを持つ JSON オブジェクト群。各変数または属性は、何らかの DOM 要素の値、または利用者操作の説明を含みます。データレイヤは、そのページですべてのベンダが必要とする値の完全な集合です。データレイヤはホスト開発者が作成します。

ビジネス側が定義した特定のイベントが発生すると、そのイベントの JavaScript ハンドラがデータレイヤの値をタグマネージャサーバへ直接送信します。タグマネージャサーバは、そのデータを受け取るべきサードパーティまたは複数のサードパーティへ送信します。イベントハンドラコードは、ホスト開発者がタグマネージャの開発者ユーザーインターフェースを使って作成します。イベントハンドラコードは、ページ読み込みごとにタグマネージャサーバから読み込まれます。

**これは安全な手法です**。利用者のブラウザ上で実行されるのは自分たちの JavaScript だけであり、ベンダへ送信されるのも自分たちが決めたデータだけだからです。

これには、ホスト、集約サイトまたはタグマネージャ、ベンダの協力が必要です。

ホスト開発者は、ベンダが分析を行うためにどの種類のデータを必要とするかを知るため、ベンダと協力しなければなりません。そのうえで、ホストのプログラマはどの DOM 要素がそのデータを持つかを決定します。

ホスト開発者は、データを集約サイトへ送信するプロトコル、つまり URL、パラメータ、形式などについて合意するために、タグマネージャまたは集約サイトと協力しなければなりません。

タグマネージャまたは集約サイトは、データをベンダへ送信するプロトコル、つまり URL、パラメータ、形式などについて合意するために、ベンダと協力しなければなりません。ベンダには API があるでしょうか。

## セキュリティ防御上の考慮事項

### サーバ直接データレイヤ

サーバ直接方式は、サードパーティ JavaScript の管理、デプロイ、実行における優れたセキュリティ標準です。ホストページの優れたプラクティスは、DOM オブジェクトのデータレイヤを作成することです。

データレイヤは、値に対する任意の検証を実行できます。特に、マーケティング分析に必要な場合は、URL パラメータや入力フィールドなど、利用者に公開される DOM オブジェクトからの値を検証できます。

企業標準文書の記述例は、「タグ JavaScript はホストデータレイヤ内の値にのみアクセスできる。タグ JavaScript は URL パラメータにアクセスしてはならない」です。

ホストページ開発者は、データレイヤ内のどの属性がどの値を持つかについて、サードパーティベンダまたはタグマネージャと合意する必要があります。そうすることで、彼らはその値を読み取る JavaScript を作成できます。

ユーザーインターフェースタグは、その機能 (または機能の一つ) が利用者操作に関するデータを送信することではなく、クライアント上のユーザーインターフェースを変更することであるため、データレイヤアーキテクチャを使って安全にすることはできません。

分析タグは、必要な動作がデータレイヤからサードパーティへデータを送信することだけであるため、データレイヤアーキテクチャを使って安全にできます。実行されるのはファーストパーティコードだけです。まず、一般にはページ読み込み時にデータレイヤを設定し、その後イベントハンドラ JavaScript が、そのページから必要な任意のデータをサードパーティデータベースまたはタグマネージャへ送信します。

これは非常にスケーラブルな解決策でもあります。大規模な e コマースサイトでは、URL とパラメータの組み合わせが何十万も存在し、マーケティング分析キャンペーンごとに異なる URL とパラメータの集合が含まれることがあります。マーケティングロジックでは、一つのページに 30 または 40 の異なるベンダタグが存在することもあります。

たとえば、指定された都市に関するページで、指定された場所から、指定された日に行われた利用者操作は、データレイヤ要素 1、2、3 を送信するべきです。他の都市に関するページの利用者操作は、データレイヤ要素 2 と 3 だけを送信するべきです。各ページでデータレイヤデータを送信するイベントハンドラコードは、ホスト開発者またはマーケティング技術者がタグマネージャ開発者インターフェースを使って制御するため、どのタイミングでどのデータレイヤ要素をタグマネージャサーバへ送信するかというビジネスロジックは、数分で変更およびデプロイできます。サードパーティとのやり取りは不要です。サードパーティは期待するデータを受け取り続けますが、そのデータはホストのマーケティング技術者が選んだ異なるコンテキストから届くようになります。

サードパーティベンダの変更は、タグマネージャサーバでデータ配信ルールを変更するだけで済み、ホストコードの変更は不要です。また、データはタグマネージャへだけ直接送信されるため、実行は高速です。イベントハンドラ JavaScript は複数のサードパーティサイトへ接続する必要がありません。

### 間接リクエスト

JavaScript を構成するための GUI を提供するタグマネージャまたは集約サイトへの間接リクエストについては、次のような制御も実装される場合があります。

- JavaScript がデータレイヤの値だけにアクセスでき、他の DOM 要素にはアクセスできないようにする技術的制御。
- ホストサイトにデプロイされるタグの種類を制限すること。たとえば、カスタム HTML タグや JavaScript コードを無効化すること。

ホスト企業は、ホスト企業向けタグ設定へのアクセス制御など、タグマネージャサイトのセキュリティプラクティスも検証するべきです。二要素認証にすることもできます。

マーケティング担当者に、必要なデータをどこから取得するかを決めさせると、URL パラメータから取得したデータをページ上のスクリプト実行可能な場所にある変数へ入れる可能性があるため、XSS につながることがあります。

### コンテンツのサンドボックス化

これら二つのツールは、サイトが DOM データをサンドボックス化またはクリーン化するために使用できます。

- [DOMPurify](https://github.com/cure53/DOMPurify) は、HTML、MathML、SVG 向けの高速で許容性の高い XSS サニタイザです。DOMPurify は安全なデフォルトで動作しますが、多くの設定機能とフックを提供します。
- [MentalJS](https://github.com/hackvertor/MentalJS) は JavaScript パーサおよびサンドボックスです。変数とアクセサに "$" サフィックスを追加することで JavaScript コードを許可リスト化します。

### Subresource Integrity

[Subresource Integrity](https://www.w3.org/TR/SRI/) は、レビュー済みのコードだけが実行されることを保証します。開発者はベンダ JavaScript の integrity メタデータを生成し、次のように script 要素へ追加します。

```javascript
<script src="https://analytics.vendor.com/v1.1/script.js"
   integrity="sha384-MBO5IDfYaE6c6Aao94oZrIOiC7CGiSNE64QUbHNPhzk8Xhm0djE6QqTpL0HzTUxk"
   crossorigin="anonymous">
</script>
```

SRI が機能するには、ベンダホストで [CORS](https://www.w3.org/TR/cors/) が有効になっている必要があることを知っておくことが重要です。また、ベンダ JavaScript の変更を定期的な方法で監視することも良い考えです。ベンダが更新を決めたときに、**安全**ではあるが**動作しない**サードパーティコードを受け取ることがあるためです。

### JavaScript ライブラリを最新に保つ

[OWASP Top 10 2013 A9](https://wiki.owasp.org/index.php/Top_10_2013-A9-Using_Components_with_Known_Vulnerabilities) は、既知の脆弱性を持つコンポーネントを使用する問題を説明しています。これには JavaScript ライブラリも含まれます。JavaScript ライブラリは最新に保たなければなりません。古いバージョンには既知の脆弱性がある可能性があり、それによりサイトが典型的には [Cross Site Scripting](https://owasp.org/www-community/attacks/xss/) に脆弱になることがあります。そのようなライブラリを特定するために役立つツールはいくつかあります。その一つが無料のオープンソースツール [RetireJS](https://retirejs.github.io) です。

### iframe によるサンドボックス化

ベンダ JavaScript を別ドメイン (たとえば静的データホスト) の iframe に入れることもできます。これは「隔離領域」として機能し、ベンダ JavaScript はホストページの DOM や Cookie に直接アクセスできません。

ホストのメインページとサンドボックス iframe は、[postMessage mechanism](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) を介して相互に通信できます。

また、iframe は iframe の [sandbox attribute](http://www.html5rocks.com/en/tutorials/security/sandboxed-iframes/) で保護できます。

高リスクアプリケーションでは、iframe サンドボックス化に加えて [Content Security Policy (CSP)](https://www.w3.org/TR/CSP2/) の使用を検討してください。CSP は XSS に対する堅牢化をさらに強化します。

```html
<!-- Some host, e.g. somehost.com, HTML code here -->
 <html>
   <head></head>
     <body>
       ...
       <!-- Include iframe with 3rd party vendor javascript -->
       <iframe
       src="https://somehost-static.net/analytics.html"
       sandbox="allow-same-origin allow-scripts">
       </iframe>
   </body>
 </html>

<!-- somehost-static.net/analytics.html -->
 <html>
   <head></head>
     <body>
       ...
       <script>
       window.addEventListener("message", receiveMessage, false);
       function receiveMessage(event) {
         if (event.origin !== "https://somehost.com:443") {
           return;
         } else {
         // Make some DOM here and initialize other
        //data required for 3rd party code
         }
       }
       </script>
       <!-- 3rd party vendor javascript -->
       <script src="https://analytics.vendor.com/v1.1/script.js"></script>
       <!-- /3rd party vendor javascript -->
   </body>
 </html>
```

### 仮想 iframe コンテインメント

この技術は、メインページとは非同期に実行される iframe を作成します。また、マーケティングタグの要件に基づいて保護された iframe を動的に実装することを自動化する、独自のコンテインメント JavaScript も提供します。

### ベンダ契約

サードパーティとの契約または提案依頼書で、セキュアコーディングと一般的な企業サーバアクセスセキュリティを実装している証拠を要求できます。ただし特に、その JavaScript への悪意ある変更を防止および検知するため、ソースコードの監視と制御を判断する必要があります。

## MarTechSec

Marketing Technology Security

これは、マーケティング JavaScript からのリスクを低減するすべての側面を指します。制御には次のものがあります。

1. リスク低減のための契約上の制御。MarTech 企業との契約には、コードセキュリティとコード完全性監視の証拠を示す要求を含めるべきです。
2. リスク移転のための契約上の制御。MarTech 企業との契約には、悪意のある JavaScript を提供した場合の違約金を含めることができます。
3. 悪意のある JavaScript 実行を防止するための技術的制御。Virtual Iframes。
4. 悪意のある JavaScript を特定するための技術的制御。[Subresource Integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity)。
5. クライアント側 JavaScript の悪意ある動作をペネトレーションテスト要件に含める技術的制御。

## MarSecOps

Marketing Security Operations

これは、一部の技術的制御を維持するための運用要件を指します。ページ制御内の情報 (SRI ハッシュ変更、SRI を持つページの変更)、Virtual iFrames のポリシー、タグマネージャ設定、データレイヤ変更などを更新するため、マーケティングチーム、martech プロバイダ、実行または運用チームの間で協力や情報交換が必要になる可能性があります。

非自明なマーケティングタグを含む任意のサイトに対する、最も完全で予防的な制御は次のとおりです。

1. マーケティングサーバまたはタグマネージャ API を呼び出すデータレイヤ。これにより、自分たちのコードだけが自分たちのページで実行されます (制御の反転)。

2. [Subresource Integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity)。

3. Virtual frame Containment。

マーケティングが求める変更速度で、または多数の専任リソースなしで技術的制御を実装するための MarSecOps 要件により、データレイヤと Subresource Integrity の制御は実用的でなくなることがあります。

</section>

<section id="third-party-javascript-management-bilingual-panel" className="tabPanel bilingualPanel">

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Introduction

Tags, aka marketing tags, analytics tags etc. are small bits of JavaScript on a web page. They can also be HTML image elements when JavaScript is disabled. The reason for them is to collect data on the web user actions and browsing context for use by the web page owner in marketing.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## はじめに

タグ、つまりマーケティングタグや分析タグなどは、Web ページ上の小さな JavaScript 片です。JavaScript が無効な場合には HTML の画像要素であることもあります。これらは、Web ページ所有者がマーケティングに利用するために、Web 利用者の操作や閲覧コンテキストに関するデータを収集する目的で使われます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Third party vendor JavaScript tags (hereinafter, **tags**) can be divided into two types:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

サードパーティベンダの JavaScript タグ (以下、**タグ**) は、二つの種類に分けられます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- User interface tags.
- Analytic tags.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- ユーザーインターフェースタグ。
- 分析タグ。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

User interface tags have to execute on the client because they change the DOM; displaying a dialog or image or changing text etc.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

ユーザーインターフェースタグは、ダイアログや画像の表示、テキストの変更など、DOM を変更するため、クライアント上で実行する必要があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Analytics tags send information back to a marketing information database; information like what user action was just taken, browser metadata, location information, page metadata etc. The rationale for analytics tags is to provide data from the user's browser DOM to the vendor for some form of marketing analysis. This data can be anything available in the DOM. The data is used for user navigation and clickstream analysis, identification of the user to determine further content to display etc., and various marketing analysis functions.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

分析タグは、直前に実行された利用者操作、ブラウザメタデータ、位置情報、ページメタデータなどの情報をマーケティング情報データベースへ送信します。分析タグの根拠は、何らかのマーケティング分析のために、利用者のブラウザ DOM からベンダへデータを提供することです。このデータは DOM で利用できるものであれば何でも含み得ます。データは、利用者のナビゲーションやクリックストリーム分析、表示する追加コンテンツを決めるための利用者識別、その他さまざまなマーケティング分析機能に使われます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The term **host** refers to the original site the user goes to, such as a shopping or news site, that contains or retrieves and executes third party JavaScript tag for marketing analysis of the user actions.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**ホスト**という用語は、利用者が訪問するショッピングサイトやニュースサイトなどの元のサイトを指します。このサイトは、利用者操作のマーケティング分析のためにサードパーティ JavaScript タグを含める、または取得して実行します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Major risks

The single greatest risk is a compromise of the third party JavaScript server, and the injection of malicious JavaScript into the original tag JavaScript. This has happened in 2018 and likely earlier.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 主なリスク

最大の単一リスクは、サードパーティ JavaScript サーバが侵害され、元のタグ JavaScript に悪意のある JavaScript が注入されることです。これは 2018 年に発生しており、おそらくそれ以前にも発生しています。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The invocation of third-party JS code in a web application requires consideration for 3 risks in particular:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Web アプリケーションでサードパーティ JS コードを呼び出す場合、特に次の三つのリスクを考慮する必要があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

1. The loss of control over changes to the client application,
2. The execution of arbitrary code on client systems,
3. The disclosure or leakage of sensitive information to 3rd parties.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

1. クライアントアプリケーションへの変更に対する制御の喪失。
2. クライアントシステム上での任意コード実行。
3. 機密情報のサードパーティへの開示または漏えい。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Risk 1: Loss of control over changes to the client application

This risk arises from the fact that there is usually no guarantee that the code hosted at the third-party will remain the same as seen from the developers and testers: new features may be pushed in the third-party code at any time, thus potentially breaking the interface or data-flows and exposing the availability of your application to its users/customers.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### リスク 1: クライアントアプリケーションへの変更に対する制御の喪失

このリスクは、開発者やテスターが見たときと同じコードがサードパーティ側でホストされ続ける保証が通常ないことから生じます。サードパーティコードにはいつでも新機能が投入される可能性があり、その結果インターフェースやデータフローが壊れ、アプリケーションの可用性が利用者や顧客に対して影響を受ける可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Typical defenses include, but are not restricted to: in-house script mirroring (to prevent alterations by 3rd parties), sub-resource integrity (to enable browser-level interception) and secure transmission of the third-party code (to prevent modifications while in-transit). See below for more details.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

典型的な防御策には、サードパーティによる変更を防ぐための社内スクリプトミラーリング、ブラウザレベルでの遮断を可能にする Subresource Integrity、転送中の変更を防ぐためのサードパーティコードの安全な送信などがありますが、これらに限定されません。詳細は後述します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Risk 2: Execution of arbitrary code on client systems

This risk arises from the fact that third-party JavaScript code is rarely reviewed by the invoking party prior to its integration into a website/application. As the client reaches the hosting website/application, this third-party code gets executed, thus granting the third-party the exact same privileges that were granted to the user (similar to [XSS attacks](https://owasp.org/www-community/attacks/xss/)).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### リスク 2: クライアントシステム上での任意コード実行

このリスクは、サードパーティ JavaScript コードが Web サイトやアプリケーションに組み込まれる前に、呼び出し側によってレビューされることがほとんどないという事実から生じます。クライアントがホスティング Web サイトやアプリケーションに到達すると、このサードパーティコードが実行され、サードパーティには利用者に付与されたものとまったく同じ権限が与えられます ([XSS attacks](https://owasp.org/www-community/attacks/xss/) と同様です)。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Any testing performed prior to entering production loses some of its validity, including `AST testing` ([IAST](https://www.veracode.com/security/interactive-application-security-testing-iast), [RAST](https://www.veracode.com/sites/default/files/pdf/resources/whitepapers/what-is-rasp.pdf), [SAST](https://www.sqreen.com/web-application-security/what-is-sast), [DAST](https://www.sqreen.com/web-application-security/what-is-dast), etc.).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

本番投入前に実施されたテストは、`AST testing` ([IAST](https://www.veracode.com/security/interactive-application-security-testing-iast)、[RAST](https://www.veracode.com/sites/default/files/pdf/resources/whitepapers/what-is-rasp.pdf)、[SAST](https://www.sqreen.com/web-application-security/what-is-sast)、[DAST](https://www.sqreen.com/web-application-security/what-is-dast) など) を含め、その有効性の一部を失います。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

While it is widely accepted that the probability of having rogue code intentionally injected by the third-party is low, there are still cases of malicious injections in third-party code after the organization's servers were compromised (ex: Yahoo, January 2014).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

サードパーティが意図的に不正コードを注入する確率は低いと広く受け止められていますが、組織のサーバが侵害された後にサードパーティコードへ悪意のある注入が行われた事例は存在します (例: Yahoo、2014 年 1 月)。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

This risk should therefore still be evaluated, in particular when the third-party does not show any documentation that it is enforcing better security measures than the invoking organization itself, or at least equivalent. Another example is that the domain hosting the third-party JavaScript code expires because the company maintaining it is bankrupt or the developers have abandoned the project. A malicious actor can then re-register the domain and publish malicious code.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

したがって、特にサードパーティが、呼び出し側組織自身よりも優れた、または少なくとも同等のセキュリティ対策を実施していることを示す文書を提示していない場合、このリスクは評価するべきです。別の例として、サードパーティ JavaScript コードをホストするドメインが、その会社の破産や開発者によるプロジェクト放棄によって期限切れになることがあります。その場合、悪意のある行為者がそのドメインを再登録し、悪意のあるコードを公開できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Typical defenses include, but are not restricted to:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

典型的な防御策には次のものがありますが、これらに限定されません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- In-house script mirroring (to prevent alterations by 3rd parties),
- [Sub-resource integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity) (to enable browser-level interception),
- Secure transmission of the third-party code (to prevent modifications while in-transit) and various types of sandboxing. See below for more details.
- ...

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- サードパーティによる変更を防ぐための社内スクリプトミラーリング。
- ブラウザレベルでの遮断を可能にする [Sub-resource integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity)。
- 転送中の変更を防ぐためのサードパーティコードの安全な送信、および各種サンドボックス化。詳細は後述します。
- ...

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Risk 3: Disclosure of sensitive information to 3rd parties

When a third-party script is invoked in a website/application, the browser directly contacts the third-party servers. By default, the request includes all regular HTTP headers. In addition to the originating IP address of the browser, the third-party also obtains other data such as the referrer (in non-https requests) and any cookies previously set by the third-party, for example when visiting another organization's website that also invokes the third-party script.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### リスク 3: 機密情報のサードパーティへの開示

Web サイトやアプリケーションでサードパーティスクリプトが呼び出されると、ブラウザはサードパーティサーバへ直接接続します。デフォルトでは、このリクエストには通常の HTTP ヘッダーがすべて含まれます。ブラウザの送信元 IP アドレスに加えて、サードパーティはリファラー (非 HTTPS リクエストの場合) や、たとえば同じサードパーティスクリプトを呼び出す別組織の Web サイトを訪問した際にサードパーティが以前設定した Cookie など、他のデータも取得します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

In many cases, this grants the third-party primary access to information on the organization's users / customers / clients. Additionally, if the third-party is sharing the script with other entities, it also collects secondary data from all the other entities, thus knowing who the organization's visitors are but also what other organizations they interact with.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

多くの場合、これによりサードパーティは組織の利用者、顧客、クライアントに関する情報へ一次的にアクセスできるようになります。さらに、サードパーティがそのスクリプトを他のエンティティと共有している場合、他のすべてのエンティティから二次データも収集します。そのため、組織の訪問者が誰であるかだけでなく、彼らがどの他組織とやり取りしているかも把握できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

A typical case is the current situation with major news/press sites that invoke third-party code (typically for ad engines, statistics and JavaScript APIs): any user visiting any of these websites also informs the 3rd parties of the visit. In many cases, the third-party also gets to know what news articles each individual user is clicking specifically (leakage occurs through the HTTP referrer field) and thus can establish deeper personality profiles.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

典型例は、広告エンジン、統計、JavaScript API のためにサードパーティコードを呼び出す大手ニュースサイトや報道サイトの現状です。これらの Web サイトを訪問する利用者は、その訪問をサードパーティにも通知しています。多くの場合、サードパーティは個々の利用者が具体的にどの記事をクリックしているかも知ることができ (HTTP リファラーフィールドを通じて漏えいします)、より深い人格プロファイルを構築できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Typical defenses include, but are not restricted to: in-house script mirroring (to prevent leakage of HTTP requests to 3rd parties). Users can reduce their profiling by random clicking links on leaking websites/applications (such as press/news websites) to reduce profiling. See below for more details.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

典型的な防御策には、サードパーティへの HTTP リクエスト漏えいを防ぐための社内スクリプトミラーリングなどがありますが、これに限定されません。利用者は、報道・ニュースサイトなど漏えいのある Web サイトやアプリケーションでリンクをランダムにクリックすることで、プロファイリングを低減できます。詳細は後述します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Third-party JavaScript Deployment Architectures

There are three basic deployment mechanisms for **tags**. These mechanisms can be combined with each other.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## サードパーティ JavaScript のデプロイアーキテクチャ

**タグ**には三つの基本的なデプロイ方式があります。これらの方式は互いに組み合わせることもできます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Vendor JavaScript on page

This is where the vendor provides the host with the JavaScript and the host puts it on the host page. To be secure the host company must review the code for any vulnerabilities like [XSS attacks](https://owasp.org/www-community/attacks/xss/) or malicious actions such as sending sensitive data from the DOM to a malicious site. This is often difficult because the JavaScript is commonly obfuscated.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### ページ上のベンダ JavaScript

これは、ベンダがホストに JavaScript を提供し、ホストがそれをホストページに配置する方式です。安全にするには、ホスト企業が [XSS attacks](https://owasp.org/www-community/attacks/xss/) のような脆弱性や、DOM から機密データを悪意のあるサイトへ送信するなどの悪意ある動作がないか、コードをレビューしなければなりません。JavaScript は一般に難読化されているため、これは多くの場合困難です。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<!-- Some host, e.g. foobar.com, HTML code here -->
<html>
<head></head>
    <body>
        ...
        <script type="text/javascript">/* 3rd party vendor javascript here */</script>
    </body>
</html>
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### JavaScript Request to Vendor

This is where one or a few lines of code on the host page each request a JavaScript file or URL directly from the vendor site. When the host page is being created, the developer includes the lines of code provided by the vendor that will request the vendor JavaScript. Each time the page is accessed the requests are made to the vendor site for the JavaScript, which then executes on the user browser.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### ベンダへの JavaScript リクエスト

これは、ホストページ上の一行または数行のコードが、ベンダサイトから JavaScript ファイルまたは URL を直接リクエストする方式です。ホストページを作成するとき、開発者はベンダが提供した、ベンダ JavaScript をリクエストするコード行を含めます。ページにアクセスされるたびに、JavaScript を取得するためのリクエストがベンダサイトへ送信され、その JavaScript が利用者のブラウザ上で実行されます。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<!-- Some host, e.g. foobar.com, HTML code here -->`
<html>
    <head></head>
    <body>
        ...
        <!-- 3rd party vendor javascript -->
        <script src="https://analytics.vendor.com/v1.1/script.js"></script>
        <!-- /3rd party vendor javascript -->
    </body>
</html>
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Indirect request to Vendor through Tag Manager

This is where one or a few lines of code on the host page each request a JavaScript file or URL from a tag aggregator or **tag manager** site; not from the JavaScript vendor site. The tag aggregator or tag manager site returns whatever third party JavaScript files that the host company has configured to be returned. Each file or URL request to the tag manager site can return lots of other JavaScript files from multiple vendors.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### タグマネージャ経由でのベンダへの間接リクエスト

これは、ホストページ上の一行または数行のコードが、JavaScript ベンダサイトではなく、タグ集約サイトまたは**タグマネージャ**サイトから JavaScript ファイルまたは URL をリクエストする方式です。タグ集約サイトまたはタグマネージャサイトは、ホスト企業が返すよう構成した任意のサードパーティ JavaScript ファイルを返します。タグマネージャサイトへの各ファイルまたは URL リクエストは、複数ベンダの多数の JavaScript ファイルを返す可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The actual content that is returned from the aggregator or manager (i.e. the specific JavaScript files as well as exactly what they do) can be dynamically changed by host site employees using a graphical user interface for development, hosted on the tag manager site that non-technical users can work with, such as the marketing part of the business.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

集約サイトまたはマネージャから実際に返される内容、つまり具体的な JavaScript ファイルとそれらが正確に何をするかは、タグマネージャサイト上でホストされる開発用のグラフィカルユーザーインターフェースを使って、ホストサイトの従業員が動的に変更できます。この GUI は、事業部門のマーケティング担当者など、非技術者でも扱えます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The changes can be either:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

変更には次のものがあります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

1. Get a different JavaScript file from the third-party vendor for the same request.
2. Change what DOM object data is read, and when, to send to the vendor.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

1. 同じリクエストに対して、サードパーティベンダから別の JavaScript ファイルを取得する。
2. ベンダへ送信するために、どの DOM オブジェクトデータをいつ読み取るかを変更する。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The tag manager developer user interface will generate code that does what the marketing functionality requires, basically determining what data to get from the browser DOM and when to get it. The tag manager always returns a **container** JavaScript file to the browser which is basically a set of JavaScript functions that are used by the code generated by the user interface to implement the required functionality.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

タグマネージャの開発者ユーザーインターフェースは、マーケティング機能に必要な動作を行うコードを生成します。基本的には、ブラウザ DOM からどのデータをいつ取得するかを決定します。タグマネージャは常に**コンテナ** JavaScript ファイルをブラウザへ返します。これは基本的に、ユーザーインターフェースで生成されたコードが必要な機能を実装するために使う JavaScript 関数群です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Similar to java frameworks that provide functions and global data to the developer, the container JavaScript executes on the browser and lets the business user use the tag manager developer user interface to specify high level functionality without needing to know JavaScript.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

開発者へ関数やグローバルデータを提供する Java フレームワークと同様に、コンテナ JavaScript はブラウザ上で実行され、ビジネスユーザーが JavaScript を知らなくてもタグマネージャの開発者ユーザーインターフェースで高レベルの機能を指定できるようにします。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<!-- Some host, e.g. foobar.com, HTML code here -->
 <html>
   <head></head>
     <body>
       ...
       <!-- Tag Manager -->
       <script>(function(w, d, s, l, i){
         w[l] = w[l] || [];
         w[l].push({'tm.start':new Date().getTime(), event:'tm.js'});
         var f = d.getElementsByTagName(s)[0],
         j = d.createElement(s),
         dl = l != 'dataLayer' ? '&l=' + l : '';
         j.async=true;
         j.src='https://tagmanager.com/tm.js?id=' + i + dl;
         f.parentNode.insertBefore(j, f);
       })(window, document, 'script', 'dataLayer', 'TM-FOOBARID');</script>
       <!-- /Tag Manager -->
   </body>
</html>`
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Security Problems with requesting Tags

The previously described mechanisms are difficult to make secure because you can only see the code if you proxy the requests or if you get access to the GUI and see what is configured. The JavaScript is generally obfuscated so even seeing it is usually not useful. It is also instantly deployable because each new page request from a browser executes the requests to the aggregator which gets the JavaScript from the third party vendor. So as soon as any JavaScript files are changed on the vendor, or modified on the aggregator, the next call for them from any browser will get the changed JavaScript. One way to manage this risk is with the *Subresource Integrity* standard described below.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### タグをリクエストする際のセキュリティ問題

前述の方式は安全にすることが困難です。コードを見るにはリクエストをプロキシするか、GUI へアクセスして設定内容を見る必要があるためです。JavaScript は一般に難読化されているため、見えたとしても通常は有用ではありません。また、ブラウザからの新しいページリクエストごとに集約サイトへのリクエストが実行され、集約サイトがサードパーティベンダから JavaScript を取得するため、即時にデプロイされます。したがって、ベンダ上で JavaScript ファイルが変更される、または集約サイト上で変更されると、どのブラウザからの次の呼び出しでも変更後の JavaScript が取得されます。このリスクを管理する一つの方法は、後述する *Subresource Integrity* 標準です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Server Direct Data Layer

The tag manager developer user interface can be used to create JavaScript that can get data from anywhere in the browser DOM and store it anywhere on the page. This can allow vulnerabilities because the interface can be used to generate code to get unvalidated data from the DOM (e.g. URL parameters) and store it in some page location that would execute JavaScript.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### サーバ直接データレイヤ

タグマネージャの開発者ユーザーインターフェースは、ブラウザ DOM の任意の場所からデータを取得し、ページ上の任意の場所に保存できる JavaScript を作成するために使えます。これにより、DOM から未検証データ (URL パラメータなど) を取得し、JavaScript が実行される可能性があるページ位置に保存するコードをインターフェースで生成できるため、脆弱性が生じる可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The best way to make the generated code secure is to confine it to getting DOM data from a host defined data layer.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

生成されたコードを安全にする最善の方法は、ホストが定義したデータレイヤから DOM データを取得することに限定することです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The data layer is either:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

データレイヤは次のいずれかです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

1. a DIV object with attribute values that have the marketing or user behavior data that the third-party wants
2. a set of JSON objects with the same data. Each variable or attribute contains the value of some DOM element or the description of a user action. The data layer is the complete set of values that all vendors need for that page. The data layer is created by the host developers.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

1. サードパーティが必要とするマーケティングデータまたは利用者行動データを属性値として持つ DIV オブジェクト。
2. 同じデータを持つ JSON オブジェクト群。各変数または属性は、何らかの DOM 要素の値、または利用者操作の説明を含みます。データレイヤは、そのページですべてのベンダが必要とする値の完全な集合です。データレイヤはホスト開発者が作成します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

When specific events happen that the business has defined, a JavaScript handler for that event sends values from the data layer directly to the tag manager server. The tag manager server then sends the data to whatever third party or parties is supposed to get it. The event handler code is created by the host developers using the tag manager developer user interface. The event handler code is loaded from the tag manager servers on every page load.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

ビジネス側が定義した特定のイベントが発生すると、そのイベントの JavaScript ハンドラがデータレイヤの値をタグマネージャサーバへ直接送信します。タグマネージャサーバは、そのデータを受け取るべきサードパーティまたは複数のサードパーティへ送信します。イベントハンドラコードは、ホスト開発者がタグマネージャの開発者ユーザーインターフェースを使って作成します。イベントハンドラコードは、ページ読み込みごとにタグマネージャサーバから読み込まれます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**This is a secure technique** because only your JavaScript executes on your users browser, and only the data you decide on is sent to the vendor.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**これは安全な手法です**。利用者のブラウザ上で実行されるのは自分たちの JavaScript だけであり、ベンダへ送信されるのも自分たちが決めたデータだけだからです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

This requires cooperation between the host, the aggregator or tag manager and the vendors.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

これには、ホスト、集約サイトまたはタグマネージャ、ベンダの協力が必要です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The host developers have to work with the vendor in order to know what type of data the vendor needs to do their analysis. Then the host programmer determines what DOM element will have that data.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

ホスト開発者は、ベンダが分析を行うためにどの種類のデータを必要とするかを知るため、ベンダと協力しなければなりません。そのうえで、ホストのプログラマはどの DOM 要素がそのデータを持つかを決定します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The host developers have to work with the tag manager or aggregator to agree on the protocol to send the data to the aggregator: what URL, parameters, format etc.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

ホスト開発者は、データを集約サイトへ送信するプロトコル、つまり URL、パラメータ、形式などについて合意するために、タグマネージャまたは集約サイトと協力しなければなりません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The tag manager or aggregator has to work with the vendor to agree on the protocol to send the data to the vendor: what URL, parameters, format etc. Does the vendor have an API?

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

タグマネージャまたは集約サイトは、データをベンダへ送信するプロトコル、つまり URL、パラメータ、形式などについて合意するために、ベンダと協力しなければなりません。ベンダには API があるでしょうか。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Security Defense Considerations

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## セキュリティ防御上の考慮事項

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Server Direct Data Layer

The server direct mechanism is a good security standard for third party JavaScript management, deployment and execution. A good practice for the host page is to create a data layer of DOM objects.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### サーバ直接データレイヤ

サーバ直接方式は、サードパーティ JavaScript の管理、デプロイ、実行における優れたセキュリティ標準です。ホストページの優れたプラクティスは、DOM オブジェクトのデータレイヤを作成することです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The data layer can perform any validation of the values, especially values from DOM objects exposed to the user like URL parameters and input fields, if these are required for the marketing analysis.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

データレイヤは、値に対する任意の検証を実行できます。特に、マーケティング分析に必要な場合は、URL パラメータや入力フィールドなど、利用者に公開される DOM オブジェクトからの値を検証できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

An example statement for a corporate standard document is 'The tag JavaScript can only access values in the host data layer. The tag JavaScript can never access a URL parameter.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

企業標準文書の記述例は、「タグ JavaScript はホストデータレイヤ内の値にのみアクセスできる。タグ JavaScript は URL パラメータにアクセスしてはならない」です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

You the host page developer have to agree with the third-party vendors or the tag manager what attribute in the data layer will have what value so they can create the JavaScript to read that value.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

ホストページ開発者は、データレイヤ内のどの属性がどの値を持つかについて、サードパーティベンダまたはタグマネージャと合意する必要があります。そうすることで、彼らはその値を読み取る JavaScript を作成できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

User interface tags cannot be made secure using the data layer architecture because their function (or one of their functions) is to change the user interface on the client, not to send data about the user actions.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

ユーザーインターフェースタグは、その機能 (または機能の一つ) が利用者操作に関するデータを送信することではなく、クライアント上のユーザーインターフェースを変更することであるため、データレイヤアーキテクチャを使って安全にすることはできません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Analytics tags can be made secure using the data layer architecture because the only action needed is to send data from the data layer to the third party. Only first party code is executed; first to populate the data layer (generally on page load); then event handler JavaScript sends whatever data is needed from that page to the third party database or tag manager.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

分析タグは、必要な動作がデータレイヤからサードパーティへデータを送信することだけであるため、データレイヤアーキテクチャを使って安全にできます。実行されるのはファーストパーティコードだけです。まず、一般にはページ読み込み時にデータレイヤを設定し、その後イベントハンドラ JavaScript が、そのページから必要な任意のデータをサードパーティデータベースまたはタグマネージャへ送信します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

This is also a very scalable solution. Large ecommerce sites can easily have hundreds of thousands of URL and parameter combinations, with different sets of URLs and parameters being included in different marketing analysis campaigns. The marketing logic could have 30 or 40 different vendor tags on a single page.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

これは非常にスケーラブルな解決策でもあります。大規模な e コマースサイトでは、URL とパラメータの組み合わせが何十万も存在し、マーケティング分析キャンペーンごとに異なる URL とパラメータの集合が含まれることがあります。マーケティングロジックでは、一つのページに 30 または 40 の異なるベンダタグが存在することもあります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

For example user actions in pages about specified cities, from specified locations on specified days should send data layer elements 1, 2 and 3. User actions in pages about other cities should send data layer elements 2 and 3 only. Since the event handler code to send data layer data on each page is controlled by the host developers or marketing technologists using the tag manager developer interface, the business logic about when and what data layer elements are sent to the tag manager server, can be changed and deployed in minutes. No interaction is needed with the third parties; they continue getting the data they expect but now it comes from different contexts that the host marketing technologists have chosen.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

たとえば、指定された都市に関するページで、指定された場所から、指定された日に行われた利用者操作は、データレイヤ要素 1、2、3 を送信するべきです。他の都市に関するページの利用者操作は、データレイヤ要素 2 と 3 だけを送信するべきです。各ページでデータレイヤデータを送信するイベントハンドラコードは、ホスト開発者またはマーケティング技術者がタグマネージャ開発者インターフェースを使って制御するため、どのタイミングでどのデータレイヤ要素をタグマネージャサーバへ送信するかというビジネスロジックは、数分で変更およびデプロイできます。サードパーティとのやり取りは不要です。サードパーティは期待するデータを受け取り続けますが、そのデータはホストのマーケティング技術者が選んだ異なるコンテキストから届くようになります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Changing third party vendors just means changing the data dissemination rules at the tag manager server, no changes are needed in the host code. The data also goes directly only to the tag manager so the execution is fast. The event handler JavaScript does not have to connect to multiple third party sites.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

サードパーティベンダの変更は、タグマネージャサーバでデータ配信ルールを変更するだけで済み、ホストコードの変更は不要です。また、データはタグマネージャへだけ直接送信されるため、実行は高速です。イベントハンドラ JavaScript は複数のサードパーティサイトへ接続する必要がありません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Indirect Requests

For indirect requests to tag manager/aggregator sites that offer the GUI to configure the JavaScript, they may also implement:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 間接リクエスト

JavaScript を構成するための GUI を提供するタグマネージャまたは集約サイトへの間接リクエストについては、次のような制御も実装される場合があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Technical controls such as only allowing the JavaScript to access the data layer values, no other DOM element
- Restricting the tag types deployed on a host site, e.g. disabling of custom HTML tags and JavaScript code

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- JavaScript がデータレイヤの値だけにアクセスでき、他の DOM 要素にはアクセスできないようにする技術的制御。
- ホストサイトにデプロイされるタグの種類を制限すること。たとえば、カスタム HTML タグや JavaScript コードを無効化すること。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The host company should also verify the security practices of the tag manager site such as access controls to the tag configuration for the host company. It also can be two-factor authentication.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

ホスト企業は、ホスト企業向けタグ設定へのアクセス制御など、タグマネージャサイトのセキュリティプラクティスも検証するべきです。二要素認証にすることもできます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Letting the marketing folks decide where to get the data they want can result in XSS because they may get it from a URL parameter and put it into a variable that is in a scriptable location on the page.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

マーケティング担当者に、必要なデータをどこから取得するかを決めさせると、URL パラメータから取得したデータをページ上のスクリプト実行可能な場所にある変数へ入れる可能性があるため、XSS につながることがあります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Sandboxing Content

Both of these tools be used by sites to sandbox/clean DOM data.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### コンテンツのサンドボックス化

これら二つのツールは、サイトが DOM データをサンドボックス化またはクリーン化するために使用できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- [DOMPurify](https://github.com/cure53/DOMPurify) is a fast, tolerant XSS sanitizer for HTML, MathML and SVG. DOMPurify works with a secure default, but offers a lot of configurability and hooks.
- [MentalJS](https://github.com/hackvertor/MentalJS) is a JavaScript parser and sandbox. It allow-lists JavaScript code by adding a "$" suffix to variables and accessors.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- [DOMPurify](https://github.com/cure53/DOMPurify) は、HTML、MathML、SVG 向けの高速で許容性の高い XSS サニタイザです。DOMPurify は安全なデフォルトで動作しますが、多くの設定機能とフックを提供します。
- [MentalJS](https://github.com/hackvertor/MentalJS) は JavaScript パーサおよびサンドボックスです。変数とアクセサに "$" サフィックスを追加することで JavaScript コードを許可リスト化します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Subresource Integrity

[Subresource Integrity](https://www.w3.org/TR/SRI/) will ensure that only the code that has been reviewed is executed. The developer generates integrity metadata for the vendor JavaScript, and adds it to the script element like this:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Subresource Integrity

[Subresource Integrity](https://www.w3.org/TR/SRI/) は、レビュー済みのコードだけが実行されることを保証します。開発者はベンダ JavaScript の integrity メタデータを生成し、次のように script 要素へ追加します。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```javascript
<script src="https://analytics.vendor.com/v1.1/script.js"
   integrity="sha384-MBO5IDfYaE6c6Aao94oZrIOiC7CGiSNE64QUbHNPhzk8Xhm0djE6QqTpL0HzTUxk"
   crossorigin="anonymous">
</script>
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

It is important to know that in order for SRI to work, the vendor host needs [CORS](https://www.w3.org/TR/cors/) enabled. Also it is good idea to monitor vendor JavaScript for changes in regular way. Because sometimes you can get **secure** but **not working** third-party code when the vendor decides to update it.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

SRI が機能するには、ベンダホストで [CORS](https://www.w3.org/TR/cors/) が有効になっている必要があることを知っておくことが重要です。また、ベンダ JavaScript の変更を定期的な方法で監視することも良い考えです。ベンダが更新を決めたときに、**安全**ではあるが**動作しない**サードパーティコードを受け取ることがあるためです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Keeping JavaScript libraries updated

[OWASP Top 10 2013 A9](https://wiki.owasp.org/index.php/Top_10_2013-A9-Using_Components_with_Known_Vulnerabilities) describes the problem of using components with known vulnerabilities. This includes JavaScript libraries. JavaScript libraries must be kept up to date, as previous version can have known vulnerabilities which can lead to the site typically being vulnerable to [Cross Site Scripting](https://owasp.org/www-community/attacks/xss/). There are several tools out there that can help identify such libraries. One such tool is the free open source tool [RetireJS](https://retirejs.github.io)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### JavaScript ライブラリを最新に保つ

[OWASP Top 10 2013 A9](https://wiki.owasp.org/index.php/Top_10_2013-A9-Using_Components_with_Known_Vulnerabilities) は、既知の脆弱性を持つコンポーネントを使用する問題を説明しています。これには JavaScript ライブラリも含まれます。JavaScript ライブラリは最新に保たなければなりません。古いバージョンには既知の脆弱性がある可能性があり、それによりサイトが典型的には [Cross Site Scripting](https://owasp.org/www-community/attacks/xss/) に脆弱になることがあります。そのようなライブラリを特定するために役立つツールはいくつかあります。その一つが無料のオープンソースツール [RetireJS](https://retirejs.github.io) です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Sandboxing with iframe

You can also put vendor JavaScript into an iframe from different domain (e.g. static data host). It will work as a "jail" and vendor JavaScript will not have direct access to the host page DOM and cookies.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### iframe によるサンドボックス化

ベンダ JavaScript を別ドメイン (たとえば静的データホスト) の iframe に入れることもできます。これは「隔離領域」として機能し、ベンダ JavaScript はホストページの DOM や Cookie に直接アクセスできません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The host main page and sandbox iframe can communicate between each other via the [postMessage mechanism](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

ホストのメインページとサンドボックス iframe は、[postMessage mechanism](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) を介して相互に通信できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Also, iframes can be secured with the iframe [sandbox attribute](http://www.html5rocks.com/en/tutorials/security/sandboxed-iframes/).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

また、iframe は iframe の [sandbox attribute](http://www.html5rocks.com/en/tutorials/security/sandboxed-iframes/) で保護できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

For high risk applications, consider the use of [Content Security Policy (CSP)](https://www.w3.org/TR/CSP2/) in addition to iframe sandboxing. CSP makes hardening against XSS even stronger.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

高リスクアプリケーションでは、iframe サンドボックス化に加えて [Content Security Policy (CSP)](https://www.w3.org/TR/CSP2/) の使用を検討してください。CSP は XSS に対する堅牢化をさらに強化します。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<!-- Some host, e.g. somehost.com, HTML code here -->
 <html>
   <head></head>
     <body>
       ...
       <!-- Include iframe with 3rd party vendor javascript -->
       <iframe
       src="https://somehost-static.net/analytics.html"
       sandbox="allow-same-origin allow-scripts">
       </iframe>
   </body>
 </html>

<!-- somehost-static.net/analytics.html -->
 <html>
   <head></head>
     <body>
       ...
       <script>
       window.addEventListener("message", receiveMessage, false);
       function receiveMessage(event) {
         if (event.origin !== "https://somehost.com:443") {
           return;
         } else {
         // Make some DOM here and initialize other
        //data required for 3rd party code
         }
       }
       </script>
       <!-- 3rd party vendor javascript -->
       <script src="https://analytics.vendor.com/v1.1/script.js"></script>
       <!-- /3rd party vendor javascript -->
   </body>
 </html>
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Virtual iframe Containment

This technique creates iFrames that run asynchronously in relation to the main page. It also provides its own containment JavaScript that automates the dynamic implementation of the protected iFrames based on the marketing tag requirements.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 仮想 iframe コンテインメント

この技術は、メインページとは非同期に実行される iframe を作成します。また、マーケティングタグの要件に基づいて保護された iframe を動的に実装することを自動化する、独自のコンテインメント JavaScript も提供します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Vendor Agreements

You can have the agreement or request for proposal with the 3rd parties require evidence that they have implemented secure coding and general corporate server access security. But in particular you need to determine the monitoring and control of their source code in order to prevent and detect malicious changes to that JavaScript.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### ベンダ契約

サードパーティとの契約または提案依頼書で、セキュアコーディングと一般的な企業サーバアクセスセキュリティを実装している証拠を要求できます。ただし特に、その JavaScript への悪意ある変更を防止および検知するため、ソースコードの監視と制御を判断する必要があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## MarTechSec

Marketing Technology Security

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## MarTechSec

Marketing Technology Security

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

This refers to all aspects of reducing the risk from marketing JavaScript. Controls include

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

これは、マーケティング JavaScript からのリスクを低減するすべての側面を指します。制御には次のものがあります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

1. Contractual controls for risk reduction; the contracts with any MarTech company should include a requirement to show evidence of code security and code integrity monitoring.
2. Contractual controls for risk transference: the contracts with any MarTech company could include a penalty for serving malicious JavaScript
3. Technical controls for malicious JavaScript execution prevention; Virtual Iframes,
4. Technical controls for malicious JavaScript identification; [Subresource Integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity).
5. Technical controls including client side JavaScript malicious behavior in penetration testing requirements.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

1. リスク低減のための契約上の制御。MarTech 企業との契約には、コードセキュリティとコード完全性監視の証拠を示す要求を含めるべきです。
2. リスク移転のための契約上の制御。MarTech 企業との契約には、悪意のある JavaScript を提供した場合の違約金を含めることができます。
3. 悪意のある JavaScript 実行を防止するための技術的制御。Virtual Iframes。
4. 悪意のある JavaScript を特定するための技術的制御。[Subresource Integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity)。
5. クライアント側 JavaScript の悪意ある動作をペネトレーションテスト要件に含める技術的制御。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## MarSecOps

Marketing Security Operations

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## MarSecOps

Marketing Security Operations

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

This refers to the operational requirements to maintain some of the technical controls. This involves possible cooperation and information exchange between the marketing team, the martech provider and the run or operations team to update the information in the page controls (SRI hash change, changes in pages with SRI), the policies in the Virtual iFrames, tag manager configuration, data layer changes etc.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

これは、一部の技術的制御を維持するための運用要件を指します。ページ制御内の情報 (SRI ハッシュ変更、SRI を持つページの変更)、Virtual iFrames のポリシー、タグマネージャ設定、データレイヤ変更などを更新するため、マーケティングチーム、martech プロバイダ、実行または運用チームの間で協力や情報交換が必要になる可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The most complete and preventive controls for any site containing non-trivial marketing tags are -

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

非自明なマーケティングタグを含む任意のサイトに対する、最も完全で予防的な制御は次のとおりです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

1. A data layer that calls the marketing server or tag manager APIs , so that only your code executes on your page (inversion of control).

2. [Subresource Integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity).

3. Virtual frame Containment.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

1. マーケティングサーバまたはタグマネージャ API を呼び出すデータレイヤ。これにより、自分たちのコードだけが自分たちのページで実行されます (制御の反転)。

2. [Subresource Integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity)。

3. Virtual frame Containment。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The MarSecOps requirements to implement technical controls at the speed of change that marketing wants or without a significant number of dedicated resources, can make data layer and Subresource Integrity controls impractical.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

マーケティングが求める変更速度で、または多数の専任リソースなしで技術的制御を実装するための MarSecOps 要件により、データレイヤと Subresource Integrity の制御は実用的でなくなることがあります。

</div>
</div>

</section>
</div>

## References

<div className="referenceFooter">

- [Widespread XSS Vulnerabilities in Ad Network Code Affecting Top Tier Publishers, Retailers](https://randywestergren.com/widespread-xss-vulnerabilities-ad-network-code-affecting-top-tier-publishers-retailers/).
- [Inside and Beyond Ticketmaster: The Many Breaches of Magecart](https://www.riskiq.com/blog/labs/magecart-ticketmaster-breach/).
- [Magecart – a malicious infrastructure for stealing payment details from online shops](https://www.clearskysec.com/magecart/).
- [Compromised E-commerce Sites Lead to "Magecart"](https://www.riskiq.com/blog/labs/magecart-keylogger-injection/)
- [Inbenta, blamed for Ticketmaster breach, admits it was hacked](https://www.zdnet.com/article/inbenta-blamed-for-ticketmaster-breach-says-other-sites-not-affected/).

</div>


## Attribution

<div className="attributionFooter">

- Original: Third Party Javascript Management Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Third_Party_Javascript_Management_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: English original retained for comparison. Japanese translation added. Bilingual display generated from official source and local Japanese translation.
- Retrieved: 2026-05-20

</div>
