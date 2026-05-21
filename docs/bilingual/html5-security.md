---
title: HTML5 Security Cheat Sheet
hide_title: true
---

<div className="docHero" data-category="asvs-v14">
  <h1>HTML5 セキュリティチートシート</h1>
  <div className="docMeta">
    <span className="docPill">最終更新: 2026-05-20</span>
    <span className="docPill">読了時間: 準備中</span>
    <span className="docPill">カテゴリ: Web フロントエンドセキュリティ</span>
  </div>
</div>

<p className="docLead">HTML5 セキュリティチートシートを、原文・翻訳・対比表示で確認できます。ASVS Index 対応の文脈で、公式原文と日本語訳を確認しやすく整理しています。</p>

<div className="tabbedContent">
  <input className="tabInput" type="radio" name="html5-security-view" id="html5-security-original" />
  <input className="tabInput" type="radio" name="html5-security-view" id="html5-security-translation" defaultChecked />
  <input className="tabInput" type="radio" name="html5-security-view" id="html5-security-bilingual" />

  <div className="contentTabs">
    <label htmlFor="html5-security-original" title="OWASP 原文">原文</label>
    <label htmlFor="html5-security-translation" title="日本語訳">翻訳</label>
    <label htmlFor="html5-security-bilingual" title="原文と翻訳を並べて確認">対比表示</label>
  </div>

<section id="html5-security-original-panel" className="tabPanel originalPanel contentPanel">

## Introduction

The following cheat sheet serves as a guide for implementing HTML 5 in a secure fashion.

## Communication APIs

### Web Messaging

Web Messaging (also known as Cross Domain Messaging) provides a means of messaging between documents from different origins in a way that is generally safer than the multiple hacks used in the past to accomplish this task. However, there are still some recommendations to keep in mind:

- When posting a message, explicitly state the expected origin as the second argument to `postMessage` rather than `*` in order to prevent sending the message to an unknown origin after a redirect or some other means of the target window's origin changing.
- The receiving page should **always**:
    - Check the `origin` attribute of the sender to verify the data is originating from the expected location.
    - Perform input validation on the `data` attribute of the event to ensure that it's in the desired format.
- Don't assume you have control over the `data` attribute. A single [Cross Site Scripting](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html) flaw in the sending page allows an attacker to send messages of any given format.
- Both pages should only interpret the exchanged messages as **data**. Never evaluate passed messages as code (e.g. via `eval()`) or insert it to a page DOM (e.g. via `innerHTML`), as that would create a DOM-based XSS vulnerability. For more information see [DOM based XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html).
- To assign the data value to an element, instead of using a insecure method like `element.innerHTML=data;`, use the safer option: `element.textContent=data;`
- Check the origin properly exactly to match the FQDN(s) you expect. Note that the following code: `if(message.origin.indexOf(".owasp.org")!=-1) &#123; /* ... */ &#125;` is very insecure and will not have the desired behavior as `owasp.org.attacker.com` will match.
- If you need to embed external content/untrusted gadgets and allow user-controlled scripts (which is highly discouraged), please check the information on [sandboxed frames](https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html#sandboxed-frames).

### Cross Origin Resource Sharing

- Validate URLs passed to `XMLHttpRequest.open`. Current browsers allow these URLs to be cross domain; this behavior can lead to code injection by a remote attacker. Pay extra attention to absolute URLs.
- Ensure that URLs responding with `Access-Control-Allow-Origin: *` do not include any sensitive content or information that might aid attacker in further attacks. Use the `Access-Control-Allow-Origin` header only on chosen URLs that need to be accessed cross-domain. Don't use the header for the whole domain.
- Allow only selected, trusted domains in the `Access-Control-Allow-Origin` header. Prefer allowing specific domains over blocking or allowing any domain (do not use `*` wildcard nor blindly return the `Origin` header content without any checks).
- Keep in mind that CORS does not prevent the requested data from going to an unauthorized location. It's still important for the server to perform usual [CSRF](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html) prevention.
- While the [Fetch Standard](https://fetch.spec.whatwg.org/#http-cors-protocol) recommends a pre-flight request with the `OPTIONS` verb, current implementations might not perform this request, so it's important that "ordinary" (`GET` and `POST`) requests perform any access control necessary.
- Discard requests received over plain HTTP with HTTPS origins to prevent mixed content bugs.
- Don't rely only on the Origin header for Access Control checks. Browser always sends this header in CORS requests, but may be spoofed outside the browser. Application-level protocols should be used to protect sensitive data.

### WebSockets

- Check out [WebSocket Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/WebSocket_Security_Cheat_Sheet.html) to learn about WebSocket specific protections.

### Server-Sent Events

- Validate URLs passed to the `EventSource` constructor, even though only same-origin URLs are allowed.
- As mentioned before, process the messages (`event.data`) as data and never evaluate the content as HTML or script code.
- Always check the origin attribute of the message (`event.origin`) to ensure the message is coming from a trusted domain. Use an allow-list approach.

## Storage APIs

### Local Storage

- Also known as Offline Storage, Web Storage. Underlying storage mechanism may vary from one user agent to the next. In other words, any authentication your application requires can be bypassed by a user with local privileges to the machine on which the data is stored. Therefore, it's recommended to avoid storing any sensitive information in local storage where authentication would be assumed.
- Due to the browser's security guarantees it is appropriate to use local storage where access to the data is not assuming authentication or authorization.
- Use the object sessionStorage instead of localStorage if persistent storage is not needed. sessionStorage object is available only to that window/tab until the window is closed.
- A single [Cross Site Scripting](https://owasp.org/www-community/attacks/xss/) can be used to steal all the data in these objects, so again it's recommended not to store sensitive information in local storage.
- A single [Cross Site Scripting](https://owasp.org/www-community/attacks/xss/) can be used to load malicious data into these objects too, so don't consider objects in these to be trusted.
- Pay extra attention to "localStorage.getItem" and "setItem" calls implemented in HTML5 page. It helps in detecting when developers build solutions that put sensitive information in local storage, which can be a severe risk if authentication or authorization to that data is incorrectly assumed.
- Do not store session identifiers in local storage as the data is always accessible by JavaScript. Cookies can mitigate this risk using the `httpOnly` flag.
- There is no way to restrict the visibility of an object to a specific path like with the attribute path of HTTP Cookies, every object is shared within an origin and protected with the Same Origin Policy. Avoid hosting multiple applications on the same origin, all of them would share the same localStorage object, use different subdomains instead.

### Client-side databases

- On November 2010, the W3C announced Web SQL Database (relational SQL database) as a deprecated specification. A new standard Indexed Database API or IndexedDB (formerly WebSimpleDB) is actively developed, which provides key-value database storage and methods for performing advanced queries.
- Underlying storage mechanisms may vary from one user agent to the next. In other words, any authentication your application requires can be bypassed by a user with local privileges to the machine on which the data is stored. Therefore, it's recommended not to store any sensitive information in local storage.
- If utilized, WebDatabase content on the client side can be vulnerable to SQL injection and needs to have proper validation and parameterization.
- Like Local Storage, a single [Cross Site Scripting](https://owasp.org/www-community/attacks/xss/) can be used to load malicious data into a web database as well. Don't consider data in these to be trusted.

## Geolocation

- The [Geolocation API](https://www.w3.org/TR/2021/WD-geolocation-20211124/#security) requires that user agents ask for the user's permission before calculating location. Whether or how this decision is remembered varies from browser to browser. Some user agents require the user to visit the page again in order to turn off the ability to get the user's location without asking, so for privacy reasons, it's recommended to require user input before calling `getCurrentPosition` or `watchPosition`.

## Web Workers

- Web Workers are allowed to use `XMLHttpRequest` object to perform in-domain and Cross Origin Resource Sharing requests. See relevant section of this Cheat Sheet to ensure CORS security.
- While Web Workers don't have access to DOM of the calling page, malicious Web Workers can use excessive CPU for computation, leading to Denial of Service condition or abuse Cross Origin Resource Sharing for further exploitation. Ensure code in all Web Workers scripts is not malevolent. Don't allow creating Web Worker scripts from user supplied input.
- Validate messages exchanged with a Web Worker. Do not try to exchange snippets of JavaScript for evaluation e.g. via `eval()` as that could introduce a [DOM Based XSS](https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html) vulnerability.

## Tabnabbing

Attack is described in detail in this [article](https://owasp.org/www-community/attacks/Reverse_Tabnabbing).

To summarize, it's the capacity to act on parent page's content or location from a newly opened page via the back link exposed by the **opener** JavaScript object instance.

It applies to an HTML link or a JavaScript `window.open` function using the attribute/instruction `target` to specify a [target loading location](https://www.w3schools.com/tags/att_a_target.asp) that does not replace the current location and then makes the current window/tab available.

To prevent this issue, the following actions are available:

Cut the back link between the parent and the child pages:

- For HTML links:
    - To cut this back link, add the attribute `rel="noopener"` on the tag used to create the link from the parent page to the child page. This attribute value cuts the link, but depending on the browser, lets referrer information be present in the request to the child page.
    - To also remove the referrer information use this attribute value: `rel="noopener noreferrer"`.
- For the JavaScript `window.open` function, add the values `noopener,noreferrer` in the [windowFeatures](https://developer.mozilla.org/en-US/docs/Web/API/Window/open) parameter of the `window.open` function.

As the behavior using the elements above is different between the browsers, either use an HTML link or JavaScript to open a window (or tab), then use this configuration to maximize the cross supports:

- For [HTML links](https://www.scaler.com/topics/html/html-links/), add the attribute `rel="noopener noreferrer"` to every link.
- For JavaScript, use this function to open a window (or tab):

``` javascript
function openPopup(url, name, windowFeatures){
  //Open the popup and set the opener and referrer policy instruction
  var newWindow = window.open(url, name, 'noopener,noreferrer,' + windowFeatures);
  //Reset the opener link
  newWindow.opener = null;
}
```

- Add the HTTP response header `Referrer-Policy: no-referrer` to every HTTP response sent by the application ([Header Referrer-Policy information](https://owasp.org/www-project-secure-headers/). This configuration will ensure that no referrer information is sent along with requests from the page.

Compatibility matrix:

- [noopener](https://caniuse.com/#search=noopener)
- [noreferrer](https://caniuse.com/#search=noreferrer)
- [referrer-policy](https://caniuse.com/#feat=referrer-policy)

## Sandboxed frames

- Use the `sandbox` attribute of an `iframe` for untrusted content.
- The `sandbox` attribute of an `iframe` enables restrictions on content within an `iframe`. The following restrictions are active when the `sandbox` attribute is set:
    1. All markup is treated as being from a unique origin.
    2. All forms and scripts are disabled.
    3. All links are prevented from targeting other browsing contexts.
    4. All features that trigger automatically are blocked.
    5. All plugins are disabled.

It is possible to have a [fine-grained control](https://html.spec.whatwg.org/multipage/iframe-embed-object.html#attr-iframe-sandbox) over `iframe` capabilities using the value of the `sandbox` attribute.

- In old versions of user agents where this feature is not supported, this attribute will be ignored. Use this feature as an additional layer of protection or check if the browser supports sandboxed frames and only show the untrusted content if supported.
- Apart from this attribute, to prevent Clickjacking attacks and unsolicited framing it is encouraged to use the header `X-Frame-Options` which supports the `deny` and `same-origin` values. Other solutions like framebusting `if(window!==window.top) &#123; window.top.location=location;&#125;` are not recommended.

## Credential and Personally Identifiable Information (PII) Input hints

- Protect the input values from being cached by the browser.

> Access a financial account from a public computer. Even though one is logged-off, the next person who uses the machine can log-in because the browser autocomplete functionality. To mitigate this, we tell the input fields not to assist in any way.

```html
<input type="text" spellcheck="false" autocomplete="off" autocorrect="off" autocapitalize="off"></input>
```

Text areas and input fields for PII (name, email, address, phone number) and login credentials (username, password) should be prevented from being stored in the browser. Use these HTML5 attributes to prevent the browser from storing PII from your form:

- `spellcheck="false"`
- `autocomplete="off"`
- `autocorrect="off"`
- `autocapitalize="off"`

## Offline Applications

- Whether the user agent requests permission from the user to store data for offline browsing and when this cache is deleted, varies from one browser to the next. Cache poisoning is an issue if a user connects through insecure networks, so for privacy reasons it is encouraged to require user input before sending any `manifest` file.
- Users should only cache trusted websites and clean the cache after browsing through open or insecure networks.

## Progressive Enhancements and Graceful Degradation Risks

- The best practice now is to determine the capabilities that a browser supports and augment with some type of substitute for capabilities that are not directly supported. This may mean an onion-like element, e.g. falling through to a Flash Player if the `<video>` tag is unsupported, or it may mean additional scripting code from various sources that should be code reviewed.

## HTTP Headers to enhance security

Consult the project [OWASP Secure Headers](https://owasp.org/www-project-secure-headers/) in order to obtains the list of HTTP security headers that an application should use to enable defenses at browser level.

</section>

<section id="html5-security-translation-panel" className="tabPanel translationPanel contentPanel">

## はじめに

このチートシートは、HTML 5 を安全に実装するためのガイドです。

## 通信 API

### Web Messaging

Web Messaging (Cross Domain Messaging とも呼ばれます) は、異なるオリジンのドキュメント間でメッセージをやり取りする手段を提供します。これは、過去にこの目的のために使われていた複数の回避的な手法より一般に安全です。ただし、次の推奨事項を意識する必要があります。

- メッセージを投稿する際は、リダイレクトその他の方法で対象ウィンドウのオリジンが変わった後に未知のオリジンへメッセージを送らないよう、`postMessage` の第二引数に `*` ではなく期待するオリジンを明示してください。
- 受信ページは常に次を行うべきです。
    - 送信者の `origin` 属性を確認し、データが期待する場所から来ていることを検証します。
    - イベントの `data` 属性に対して入力検証を行い、望ましい形式であることを確認します。
- `data` 属性を制御できると仮定しないでください。送信ページに [Cross Site Scripting](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html) の欠陥が一つあるだけで、攻撃者は任意の形式のメッセージを送信できます。
- 両方のページは、交換されるメッセージを **データ** としてのみ解釈するべきです。渡されたメッセージをコードとして評価したり (`eval()` など)、ページ DOM に挿入したり (`innerHTML` など) してはいけません。そうすると DOM ベース XSS 脆弱性が発生します。詳細は [DOM based XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html) を参照してください。
- データ値を要素に代入する場合、`element.innerHTML=data;` のような安全でない方法ではなく、より安全な選択肢である `element.textContent=data;` を使用してください。
- オリジンは、期待する FQDN と完全に一致するよう適切に確認してください。次のコード `if(message.origin.indexOf(".owasp.org")!=-1) &#123; /* ... */ &#125;` は非常に安全でなく、`owasp.org.attacker.com` が一致してしまうため、期待した動作にならないことに注意してください。
- 外部コンテンツや信頼できないガジェットを埋め込み、ユーザー制御のスクリプトを許可する必要がある場合 (これは強く非推奨です)、[sandboxed frames](https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html#sandboxed-frames) の情報を確認してください。

### Cross Origin Resource Sharing

- `XMLHttpRequest.open` に渡される URL を検証してください。現在のブラウザでは、これらの URL がクロスドメインであることを許可しています。この挙動は、リモート攻撃者によるコードインジェクションにつながる可能性があります。絶対 URL には特に注意してください。
- `Access-Control-Allow-Origin: *` で応答する URL に、攻撃者のさらなる攻撃を助ける可能性のある機密コンテンツや情報が含まれないようにしてください。`Access-Control-Allow-Origin` ヘッダーは、クロスドメインでアクセスされる必要がある選択済み URL だけで使用してください。ドメイン全体にこのヘッダーを使わないでください。
- `Access-Control-Allow-Origin` ヘッダーでは、選択した信頼済みドメインだけを許可してください。任意のドメインをブロックまたは許可するより、特定のドメインを許可することを優先します (`*` ワイルドカードを使ったり、確認なしに `Origin` ヘッダーの内容をそのまま返したりしてはいけません)。
- CORS は、要求されたデータが認可されていない場所へ送られることを防ぐものではない点に注意してください。サーバー側で通常の [CSRF](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html) 防止を行うことは依然として重要です。
- [Fetch Standard](https://fetch.spec.whatwg.org/#http-cors-protocol) は `OPTIONS` メソッドによるプリフライトリクエストを推奨していますが、現在の実装ではこのリクエストが行われない場合があります。そのため、「通常の」リクエスト (`GET` と `POST`) でも必要なアクセス制御を実施することが重要です。
- 混合コンテンツのバグを防ぐため、HTTPS オリジンを持つプレーン HTTP 経由のリクエストは破棄してください。
- アクセス制御の確認を Origin ヘッダーだけに依存しないでください。ブラウザは CORS リクエストで常にこのヘッダーを送信しますが、ブラウザ外では偽装される可能性があります。機密データを保護するには、アプリケーションレベルのプロトコルを使用すべきです。

### WebSockets

- WebSocket 固有の保護策については、[WebSocket Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/WebSocket_Security_Cheat_Sheet.html) を参照してください。

### Server-Sent Events

- 同一オリジン URL のみが許可される場合でも、`EventSource` コンストラクタに渡される URL を検証してください。
- 前述のとおり、メッセージ (`event.data`) はデータとして処理し、内容を HTML やスクリプトコードとして評価してはいけません。
- メッセージの origin 属性 (`event.origin`) を常に確認し、信頼されたドメインから来ていることを確認してください。許可リスト方式を使用してください。

## ストレージ API

### Local Storage

- Offline Storage、Web Storage とも呼ばれます。基盤となるストレージ機構はユーザーエージェントごとに異なる場合があります。言い換えると、データが保存されているマシンへのローカル権限を持つユーザーは、アプリケーションが必要とする認証を回避できます。そのため、認証が前提となるような機密情報を local storage に保存することは避けることが推奨されます。
- ブラウザのセキュリティ保証により、そのデータへのアクセスが認証や認可を前提としない場合には local storage を使うことが適切です。
- 永続ストレージが不要な場合は、localStorage ではなく sessionStorage オブジェクトを使用してください。sessionStorage オブジェクトは、そのウィンドウまたはタブが閉じられるまで、そのウィンドウまたはタブでのみ利用できます。
- 一つの [Cross Site Scripting](https://owasp.org/www-community/attacks/xss/) によって、これらのオブジェクト内のすべてのデータが盗まれる可能性があります。そのため、繰り返しになりますが、機密情報を local storage に保存しないことが推奨されます。
- 一つの [Cross Site Scripting](https://owasp.org/www-community/attacks/xss/) によって、これらのオブジェクトへ悪意あるデータが読み込まれる可能性もあります。そのため、これらの中のオブジェクトを信頼できるものと考えないでください。
- HTML5 ページで実装されている `localStorage.getItem` と `setItem` 呼び出しには特に注意してください。これは、開発者が local storage に機密情報を置くソリューションを構築している場合の検出に役立ちます。そのデータへの認証や認可が誤って前提とされていると、重大なリスクになり得ます。
- データは常に JavaScript からアクセス可能なため、セッション識別子を local storage に保存してはいけません。Cookie は `httpOnly` フラグを使用することで、このリスクを軽減できます。
- HTTP Cookie の path 属性のように、オブジェクトの可視性を特定のパスに制限する方法はありません。すべてのオブジェクトは同一オリジン内で共有され、Same Origin Policy によって保護されます。同じオリジンで複数のアプリケーションをホストすることは避けてください。それらはすべて同じ localStorage オブジェクトを共有します。代わりに異なるサブドメインを使用してください。

### クライアント側データベース

- 2010 年 11 月、W3C は Web SQL Database (リレーショナル SQL データベース) を非推奨仕様として発表しました。新しい標準である Indexed Database API、または IndexedDB (以前の WebSimpleDB) が活発に開発されており、キー値データベースストレージと高度なクエリを実行するためのメソッドを提供します。
- 基盤となるストレージ機構はユーザーエージェントごとに異なる場合があります。言い換えると、データが保存されているマシンへのローカル権限を持つユーザーは、アプリケーションが必要とする認証を回避できます。そのため、機密情報を local storage に保存しないことが推奨されます。
- 使用する場合、クライアント側の WebDatabase コンテンツは SQL インジェクションに対して脆弱になり得るため、適切な検証とパラメータ化が必要です。
- Local Storage と同様に、一つの [Cross Site Scripting](https://owasp.org/www-community/attacks/xss/) によって Web データベースへ悪意あるデータが読み込まれる可能性もあります。これらの中のデータを信頼できるものと考えないでください。

## Geolocation

- [Geolocation API](https://www.w3.org/TR/2021/WD-geolocation-20211124/#security) は、ユーザーエージェントが位置を計算する前にユーザーの許可を求めることを要求します。この判断が記憶されるかどうか、またどのように記憶されるかはブラウザによって異なります。一部のユーザーエージェントでは、ユーザーの位置を確認なしに取得できる機能を無効にするため、ユーザーが再度ページを訪問する必要があります。そのため、プライバシー上の理由から、`getCurrentPosition` または `watchPosition` を呼び出す前にユーザー入力を要求することが推奨されます。

## Web Workers

- Web Workers は、`XMLHttpRequest` オブジェクトを使用してドメイン内リクエストと Cross Origin Resource Sharing リクエストを実行できます。CORS セキュリティを確保するには、このチートシートの関連セクションを参照してください。
- Web Workers は呼び出し元ページの DOM へアクセスできませんが、悪意ある Web Workers は計算のために過剰な CPU を使用してサービス拒否状態を引き起こしたり、Cross Origin Resource Sharing を悪用してさらなる攻撃につなげたりできます。すべての Web Workers スクリプト内のコードが悪意あるものではないことを確認してください。ユーザーが提供した入力から Web Worker スクリプトを作成できるようにしてはいけません。
- Web Worker と交換されるメッセージを検証してください。`eval()` などで評価するための JavaScript 断片を交換しようとしてはいけません。そうすると [DOM Based XSS](https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html) 脆弱性が導入される可能性があります。

## Tabnabbing

攻撃の詳細は、この [article](https://owasp.org/www-community/attacks/Reverse_Tabnabbing) で説明されています。

要約すると、新しく開かれたページから、opener JavaScript オブジェクトインスタンスによって公開される戻りリンクを介して、親ページのコンテンツや場所に作用できる能力です。

これは、現在の場所を置き換えず、現在のウィンドウまたはタブを利用可能にする [target loading location](https://www.w3schools.com/tags/att_a_target.asp) を指定するために、`target` 属性または命令を使用する HTML リンクまたは JavaScript の `window.open` 関数に適用されます。

この問題を防ぐため、次の対策を利用できます。

親ページと子ページの間の戻りリンクを切断します。

- HTML リンクの場合:
    - この戻りリンクを切断するには、親ページから子ページへのリンクを作成するタグに `rel="noopener"` 属性を追加します。この属性値はリンクを切断しますが、ブラウザによっては子ページへのリクエストにリファラー情報が存在することを許します。
    - リファラー情報も削除するには、属性値 `rel="noopener noreferrer"` を使用します。
- JavaScript の `window.open` 関数の場合、`window.open` 関数の [windowFeatures](https://developer.mozilla.org/en-US/docs/Web/API/Window/open) パラメータに `noopener,noreferrer` の値を追加します。

上記の要素を使用した挙動はブラウザ間で異なるため、HTML リンクまたは JavaScript のどちらかでウィンドウ (またはタブ) を開き、クロスサポートを最大化するために次の設定を使用します。

- [HTML links](https://www.scaler.com/topics/html/html-links/) の場合、すべてのリンクに `rel="noopener noreferrer"` 属性を追加します。
- JavaScript の場合、ウィンドウ (またはタブ) を開くために次の関数を使用します。

```javascript
function openPopup(url, name, windowFeatures){
  //Open the popup and set the opener and referrer policy instruction
  var newWindow = window.open(url, name, 'noopener,noreferrer,' + windowFeatures);
  //Reset the opener link
  newWindow.opener = null;
}
```

- アプリケーションが送信するすべての HTTP レスポンスに、HTTP レスポンスヘッダー `Referrer-Policy: no-referrer` を追加します ([Header Referrer-Policy information](https://owasp.org/www-project-secure-headers/)。この設定により、ページからのリクエストでリファラー情報が送信されないことが保証されます。

互換性マトリクス:

- [noopener](https://caniuse.com/#search=noopener)
- [noreferrer](https://caniuse.com/#search=noreferrer)
- [referrer-policy](https://caniuse.com/#feat=referrer-policy)

## Sandboxed frames

- 信頼できないコンテンツには、`iframe` の `sandbox` 属性を使用してください。
- `iframe` の `sandbox` 属性は、`iframe` 内のコンテンツに制限を有効化します。`sandbox` 属性が設定されている場合、次の制限が有効です。
    1. すべてのマークアップは一意のオリジンからのものとして扱われます。
    2. すべてのフォームとスクリプトが無効化されます。
    3. すべてのリンクは他の browsing context を対象にできなくなります。
    4. 自動的に発動するすべての機能がブロックされます。
    5. すべてのプラグインが無効化されます。

`sandbox` 属性の値を使用すると、`iframe` の機能を [fine-grained control](https://html.spec.whatwg.org/multipage/iframe-embed-object.html#attr-iframe-sandbox) できます。

- この機能がサポートされていない古いユーザーエージェントでは、この属性は無視されます。この機能を追加の保護層として使用するか、ブラウザが sandboxed frames をサポートしているか確認し、サポートされている場合にのみ信頼できないコンテンツを表示してください。
- この属性とは別に、クリックジャッキング攻撃と意図しないフレーミングを防ぐため、`deny` と `same-origin` の値をサポートする `X-Frame-Options` ヘッダーの使用が推奨されます。framebusting `if(window!==window.top) &#123; window.top.location=location;&#125;` のような他の解決策は推奨されません。

## 認証情報および個人識別情報 (PII) 入力ヒント

- 入力値がブラウザにキャッシュされないよう保護してください。

> 公共のコンピューターから金融アカウントにアクセスする場合を考えます。ログオフしていても、ブラウザのオートコンプリート機能により、次にそのマシンを使う人がログインできてしまう可能性があります。これを軽減するため、入力フィールドに一切支援しないよう指示します。

```html
<input type="text" spellcheck="false" autocomplete="off" autocorrect="off" autocapitalize="off"></input>
```

PII (名前、メール、住所、電話番号) とログイン認証情報 (ユーザー名、パスワード) のテキストエリアおよび入力フィールドは、ブラウザに保存されないようにするべきです。フォームから PII をブラウザに保存させないため、次の HTML5 属性を使用してください。

- `spellcheck="false"`
- `autocomplete="off"`
- `autocorrect="off"`
- `autocapitalize="off"`

## Offline Applications

- ユーザーエージェントがオフライン閲覧用にデータを保存する許可をユーザーに求めるかどうか、またこのキャッシュがいつ削除されるかは、ブラウザごとに異なります。ユーザーが安全でないネットワーク経由で接続する場合、キャッシュポイズニングが問題になります。そのため、プライバシー上の理由から、`manifest` ファイルを送信する前にユーザー入力を要求することが推奨されます。
- ユーザーは信頼できる Web サイトだけをキャッシュし、オープンなネットワークや安全でないネットワークで閲覧した後はキャッシュを消去するべきです。

## Progressive Enhancements and Graceful Degradation Risks

- 現在のベストプラクティスは、ブラウザがサポートする機能を判定し、直接サポートされていない機能には何らかの代替を追加することです。これは onion-like な要素を意味する場合があります。たとえば、`<video>` タグがサポートされていない場合に Flash Player へフォールスルーすることや、コードレビューが必要なさまざまなソースからの追加スクリプトコードを意味する場合があります。

## セキュリティを強化する HTTP ヘッダー

アプリケーションがブラウザレベルの防御を有効にするために使用すべき HTTP セキュリティヘッダーの一覧を得るには、[OWASP Secure Headers](https://owasp.org/www-project-secure-headers/) プロジェクトを参照してください。

</section>

<section id="html5-security-bilingual-panel" className="tabPanel bilingualPanel">

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Introduction

The following cheat sheet serves as a guide for implementing HTML 5 in a secure fashion.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## はじめに

このチートシートは、HTML 5 を安全に実装するためのガイドです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Communication APIs

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 通信 API

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Web Messaging

Web Messaging (also known as Cross Domain Messaging) provides a means of messaging between documents from different origins in a way that is generally safer than the multiple hacks used in the past to accomplish this task. However, there are still some recommendations to keep in mind:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Web Messaging

Web Messaging (Cross Domain Messaging とも呼ばれます) は、異なるオリジンのドキュメント間でメッセージをやり取りする手段を提供します。これは、過去にこの目的のために使われていた複数の回避的な手法より一般に安全です。ただし、次の推奨事項を意識する必要があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- When posting a message, explicitly state the expected origin as the second argument to `postMessage` rather than `*` in order to prevent sending the message to an unknown origin after a redirect or some other means of the target window's origin changing.
- The receiving page should **always**:
    - Check the `origin` attribute of the sender to verify the data is originating from the expected location.
    - Perform input validation on the `data` attribute of the event to ensure that it's in the desired format.
- Don't assume you have control over the `data` attribute. A single [Cross Site Scripting](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html) flaw in the sending page allows an attacker to send messages of any given format.
- Both pages should only interpret the exchanged messages as **data**. Never evaluate passed messages as code (e.g. via `eval()`) or insert it to a page DOM (e.g. via `innerHTML`), as that would create a DOM-based XSS vulnerability. For more information see [DOM based XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html).
- To assign the data value to an element, instead of using a insecure method like `element.innerHTML=data;`, use the safer option: `element.textContent=data;`
- Check the origin properly exactly to match the FQDN(s) you expect. Note that the following code: `if(message.origin.indexOf(".owasp.org")!=-1) &#123; /* ... */ &#125;` is very insecure and will not have the desired behavior as `owasp.org.attacker.com` will match.
- If you need to embed external content/untrusted gadgets and allow user-controlled scripts (which is highly discouraged), please check the information on [sandboxed frames](https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html#sandboxed-frames).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- メッセージを投稿する際は、リダイレクトその他の方法で対象ウィンドウのオリジンが変わった後に未知のオリジンへメッセージを送らないよう、`postMessage` の第二引数に `*` ではなく期待するオリジンを明示してください。
- 受信ページは常に次を行うべきです。
    - 送信者の `origin` 属性を確認し、データが期待する場所から来ていることを検証します。
    - イベントの `data` 属性に対して入力検証を行い、望ましい形式であることを確認します。
- `data` 属性を制御できると仮定しないでください。送信ページに [Cross Site Scripting](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html) の欠陥が一つあるだけで、攻撃者は任意の形式のメッセージを送信できます。
- 両方のページは、交換されるメッセージを **データ** としてのみ解釈するべきです。渡されたメッセージをコードとして評価したり (`eval()` など)、ページ DOM に挿入したり (`innerHTML` など) してはいけません。そうすると DOM ベース XSS 脆弱性が発生します。詳細は [DOM based XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html) を参照してください。
- データ値を要素に代入する場合、`element.innerHTML=data;` のような安全でない方法ではなく、より安全な選択肢である `element.textContent=data;` を使用してください。
- オリジンは、期待する FQDN と完全に一致するよう適切に確認してください。次のコード `if(message.origin.indexOf(".owasp.org")!=-1) &#123; /* ... */ &#125;` は非常に安全でなく、`owasp.org.attacker.com` が一致してしまうため、期待した動作にならないことに注意してください。
- 外部コンテンツや信頼できないガジェットを埋め込み、ユーザー制御のスクリプトを許可する必要がある場合 (これは強く非推奨です)、[sandboxed frames](https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html#sandboxed-frames) の情報を確認してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Cross Origin Resource Sharing

- Validate URLs passed to `XMLHttpRequest.open`. Current browsers allow these URLs to be cross domain; this behavior can lead to code injection by a remote attacker. Pay extra attention to absolute URLs.
- Ensure that URLs responding with `Access-Control-Allow-Origin: *` do not include any sensitive content or information that might aid attacker in further attacks. Use the `Access-Control-Allow-Origin` header only on chosen URLs that need to be accessed cross-domain. Don't use the header for the whole domain.
- Allow only selected, trusted domains in the `Access-Control-Allow-Origin` header. Prefer allowing specific domains over blocking or allowing any domain (do not use `*` wildcard nor blindly return the `Origin` header content without any checks).
- Keep in mind that CORS does not prevent the requested data from going to an unauthorized location. It's still important for the server to perform usual [CSRF](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html) prevention.
- While the [Fetch Standard](https://fetch.spec.whatwg.org/#http-cors-protocol) recommends a pre-flight request with the `OPTIONS` verb, current implementations might not perform this request, so it's important that "ordinary" (`GET` and `POST`) requests perform any access control necessary.
- Discard requests received over plain HTTP with HTTPS origins to prevent mixed content bugs.
- Don't rely only on the Origin header for Access Control checks. Browser always sends this header in CORS requests, but may be spoofed outside the browser. Application-level protocols should be used to protect sensitive data.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Cross Origin Resource Sharing

- `XMLHttpRequest.open` に渡される URL を検証してください。現在のブラウザでは、これらの URL がクロスドメインであることを許可しています。この挙動は、リモート攻撃者によるコードインジェクションにつながる可能性があります。絶対 URL には特に注意してください。
- `Access-Control-Allow-Origin: *` で応答する URL に、攻撃者のさらなる攻撃を助ける可能性のある機密コンテンツや情報が含まれないようにしてください。`Access-Control-Allow-Origin` ヘッダーは、クロスドメインでアクセスされる必要がある選択済み URL だけで使用してください。ドメイン全体にこのヘッダーを使わないでください。
- `Access-Control-Allow-Origin` ヘッダーでは、選択した信頼済みドメインだけを許可してください。任意のドメインをブロックまたは許可するより、特定のドメインを許可することを優先します (`*` ワイルドカードを使ったり、確認なしに `Origin` ヘッダーの内容をそのまま返したりしてはいけません)。
- CORS は、要求されたデータが認可されていない場所へ送られることを防ぐものではない点に注意してください。サーバー側で通常の [CSRF](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html) 防止を行うことは依然として重要です。
- [Fetch Standard](https://fetch.spec.whatwg.org/#http-cors-protocol) は `OPTIONS` メソッドによるプリフライトリクエストを推奨していますが、現在の実装ではこのリクエストが行われない場合があります。そのため、「通常の」リクエスト (`GET` と `POST`) でも必要なアクセス制御を実施することが重要です。
- 混合コンテンツのバグを防ぐため、HTTPS オリジンを持つプレーン HTTP 経由のリクエストは破棄してください。
- アクセス制御の確認を Origin ヘッダーだけに依存しないでください。ブラウザは CORS リクエストで常にこのヘッダーを送信しますが、ブラウザ外では偽装される可能性があります。機密データを保護するには、アプリケーションレベルのプロトコルを使用すべきです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### WebSockets

- Check out [WebSocket Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/WebSocket_Security_Cheat_Sheet.html) to learn about WebSocket specific protections.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### WebSockets

- WebSocket 固有の保護策については、[WebSocket Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/WebSocket_Security_Cheat_Sheet.html) を参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Server-Sent Events

- Validate URLs passed to the `EventSource` constructor, even though only same-origin URLs are allowed.
- As mentioned before, process the messages (`event.data`) as data and never evaluate the content as HTML or script code.
- Always check the origin attribute of the message (`event.origin`) to ensure the message is coming from a trusted domain. Use an allow-list approach.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Server-Sent Events

- 同一オリジン URL のみが許可される場合でも、`EventSource` コンストラクタに渡される URL を検証してください。
- 前述のとおり、メッセージ (`event.data`) はデータとして処理し、内容を HTML やスクリプトコードとして評価してはいけません。
- メッセージの origin 属性 (`event.origin`) を常に確認し、信頼されたドメインから来ていることを確認してください。許可リスト方式を使用してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Storage APIs

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## ストレージ API

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Local Storage

- Also known as Offline Storage, Web Storage. Underlying storage mechanism may vary from one user agent to the next. In other words, any authentication your application requires can be bypassed by a user with local privileges to the machine on which the data is stored. Therefore, it's recommended to avoid storing any sensitive information in local storage where authentication would be assumed.
- Due to the browser's security guarantees it is appropriate to use local storage where access to the data is not assuming authentication or authorization.
- Use the object sessionStorage instead of localStorage if persistent storage is not needed. sessionStorage object is available only to that window/tab until the window is closed.
- A single [Cross Site Scripting](https://owasp.org/www-community/attacks/xss/) can be used to steal all the data in these objects, so again it's recommended not to store sensitive information in local storage.
- A single [Cross Site Scripting](https://owasp.org/www-community/attacks/xss/) can be used to load malicious data into these objects too, so don't consider objects in these to be trusted.
- Pay extra attention to "localStorage.getItem" and "setItem" calls implemented in HTML5 page. It helps in detecting when developers build solutions that put sensitive information in local storage, which can be a severe risk if authentication or authorization to that data is incorrectly assumed.
- Do not store session identifiers in local storage as the data is always accessible by JavaScript. Cookies can mitigate this risk using the `httpOnly` flag.
- There is no way to restrict the visibility of an object to a specific path like with the attribute path of HTTP Cookies, every object is shared within an origin and protected with the Same Origin Policy. Avoid hosting multiple applications on the same origin, all of them would share the same localStorage object, use different subdomains instead.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Local Storage

- Offline Storage、Web Storage とも呼ばれます。基盤となるストレージ機構はユーザーエージェントごとに異なる場合があります。言い換えると、データが保存されているマシンへのローカル権限を持つユーザーは、アプリケーションが必要とする認証を回避できます。そのため、認証が前提となるような機密情報を local storage に保存することは避けることが推奨されます。
- ブラウザのセキュリティ保証により、そのデータへのアクセスが認証や認可を前提としない場合には local storage を使うことが適切です。
- 永続ストレージが不要な場合は、localStorage ではなく sessionStorage オブジェクトを使用してください。sessionStorage オブジェクトは、そのウィンドウまたはタブが閉じられるまで、そのウィンドウまたはタブでのみ利用できます。
- 一つの [Cross Site Scripting](https://owasp.org/www-community/attacks/xss/) によって、これらのオブジェクト内のすべてのデータが盗まれる可能性があります。そのため、繰り返しになりますが、機密情報を local storage に保存しないことが推奨されます。
- 一つの [Cross Site Scripting](https://owasp.org/www-community/attacks/xss/) によって、これらのオブジェクトへ悪意あるデータが読み込まれる可能性もあります。そのため、これらの中のオブジェクトを信頼できるものと考えないでください。
- HTML5 ページで実装されている `localStorage.getItem` と `setItem` 呼び出しには特に注意してください。これは、開発者が local storage に機密情報を置くソリューションを構築している場合の検出に役立ちます。そのデータへの認証や認可が誤って前提とされていると、重大なリスクになり得ます。
- データは常に JavaScript からアクセス可能なため、セッション識別子を local storage に保存してはいけません。Cookie は `httpOnly` フラグを使用することで、このリスクを軽減できます。
- HTTP Cookie の path 属性のように、オブジェクトの可視性を特定のパスに制限する方法はありません。すべてのオブジェクトは同一オリジン内で共有され、Same Origin Policy によって保護されます。同じオリジンで複数のアプリケーションをホストすることは避けてください。それらはすべて同じ localStorage オブジェクトを共有します。代わりに異なるサブドメインを使用してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Client-side databases

- On November 2010, the W3C announced Web SQL Database (relational SQL database) as a deprecated specification. A new standard Indexed Database API or IndexedDB (formerly WebSimpleDB) is actively developed, which provides key-value database storage and methods for performing advanced queries.
- Underlying storage mechanisms may vary from one user agent to the next. In other words, any authentication your application requires can be bypassed by a user with local privileges to the machine on which the data is stored. Therefore, it's recommended not to store any sensitive information in local storage.
- If utilized, WebDatabase content on the client side can be vulnerable to SQL injection and needs to have proper validation and parameterization.
- Like Local Storage, a single [Cross Site Scripting](https://owasp.org/www-community/attacks/xss/) can be used to load malicious data into a web database as well. Don't consider data in these to be trusted.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### クライアント側データベース

- 2010 年 11 月、W3C は Web SQL Database (リレーショナル SQL データベース) を非推奨仕様として発表しました。新しい標準である Indexed Database API、または IndexedDB (以前の WebSimpleDB) が活発に開発されており、キー値データベースストレージと高度なクエリを実行するためのメソッドを提供します。
- 基盤となるストレージ機構はユーザーエージェントごとに異なる場合があります。言い換えると、データが保存されているマシンへのローカル権限を持つユーザーは、アプリケーションが必要とする認証を回避できます。そのため、機密情報を local storage に保存しないことが推奨されます。
- 使用する場合、クライアント側の WebDatabase コンテンツは SQL インジェクションに対して脆弱になり得るため、適切な検証とパラメータ化が必要です。
- Local Storage と同様に、一つの [Cross Site Scripting](https://owasp.org/www-community/attacks/xss/) によって Web データベースへ悪意あるデータが読み込まれる可能性もあります。これらの中のデータを信頼できるものと考えないでください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Geolocation

- The [Geolocation API](https://www.w3.org/TR/2021/WD-geolocation-20211124/#security) requires that user agents ask for the user's permission before calculating location. Whether or how this decision is remembered varies from browser to browser. Some user agents require the user to visit the page again in order to turn off the ability to get the user's location without asking, so for privacy reasons, it's recommended to require user input before calling `getCurrentPosition` or `watchPosition`.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## Geolocation

- [Geolocation API](https://www.w3.org/TR/2021/WD-geolocation-20211124/#security) は、ユーザーエージェントが位置を計算する前にユーザーの許可を求めることを要求します。この判断が記憶されるかどうか、またどのように記憶されるかはブラウザによって異なります。一部のユーザーエージェントでは、ユーザーの位置を確認なしに取得できる機能を無効にするため、ユーザーが再度ページを訪問する必要があります。そのため、プライバシー上の理由から、`getCurrentPosition` または `watchPosition` を呼び出す前にユーザー入力を要求することが推奨されます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Web Workers

- Web Workers are allowed to use `XMLHttpRequest` object to perform in-domain and Cross Origin Resource Sharing requests. See relevant section of this Cheat Sheet to ensure CORS security.
- While Web Workers don't have access to DOM of the calling page, malicious Web Workers can use excessive CPU for computation, leading to Denial of Service condition or abuse Cross Origin Resource Sharing for further exploitation. Ensure code in all Web Workers scripts is not malevolent. Don't allow creating Web Worker scripts from user supplied input.
- Validate messages exchanged with a Web Worker. Do not try to exchange snippets of JavaScript for evaluation e.g. via `eval()` as that could introduce a [DOM Based XSS](https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html) vulnerability.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## Web Workers

- Web Workers は、`XMLHttpRequest` オブジェクトを使用してドメイン内リクエストと Cross Origin Resource Sharing リクエストを実行できます。CORS セキュリティを確保するには、このチートシートの関連セクションを参照してください。
- Web Workers は呼び出し元ページの DOM へアクセスできませんが、悪意ある Web Workers は計算のために過剰な CPU を使用してサービス拒否状態を引き起こしたり、Cross Origin Resource Sharing を悪用してさらなる攻撃につなげたりできます。すべての Web Workers スクリプト内のコードが悪意あるものではないことを確認してください。ユーザーが提供した入力から Web Worker スクリプトを作成できるようにしてはいけません。
- Web Worker と交換されるメッセージを検証してください。`eval()` などで評価するための JavaScript 断片を交換しようとしてはいけません。そうすると [DOM Based XSS](https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html) 脆弱性が導入される可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Tabnabbing

Attack is described in detail in this [article](https://owasp.org/www-community/attacks/Reverse_Tabnabbing).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## Tabnabbing

攻撃の詳細は、この [article](https://owasp.org/www-community/attacks/Reverse_Tabnabbing) で説明されています。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

To summarize, it's the capacity to act on parent page's content or location from a newly opened page via the back link exposed by the **opener** JavaScript object instance.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

要約すると、新しく開かれたページから、opener JavaScript オブジェクトインスタンスによって公開される戻りリンクを介して、親ページのコンテンツや場所に作用できる能力です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

It applies to an HTML link or a JavaScript `window.open` function using the attribute/instruction `target` to specify a [target loading location](https://www.w3schools.com/tags/att_a_target.asp) that does not replace the current location and then makes the current window/tab available.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

これは、現在の場所を置き換えず、現在のウィンドウまたはタブを利用可能にする [target loading location](https://www.w3schools.com/tags/att_a_target.asp) を指定するために、`target` 属性または命令を使用する HTML リンクまたは JavaScript の `window.open` 関数に適用されます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

To prevent this issue, the following actions are available:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

この問題を防ぐため、次の対策を利用できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Cut the back link between the parent and the child pages:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

親ページと子ページの間の戻りリンクを切断します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- For HTML links:
    - To cut this back link, add the attribute `rel="noopener"` on the tag used to create the link from the parent page to the child page. This attribute value cuts the link, but depending on the browser, lets referrer information be present in the request to the child page.
    - To also remove the referrer information use this attribute value: `rel="noopener noreferrer"`.
- For the JavaScript `window.open` function, add the values `noopener,noreferrer` in the [windowFeatures](https://developer.mozilla.org/en-US/docs/Web/API/Window/open) parameter of the `window.open` function.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- HTML リンクの場合:
    - この戻りリンクを切断するには、親ページから子ページへのリンクを作成するタグに `rel="noopener"` 属性を追加します。この属性値はリンクを切断しますが、ブラウザによっては子ページへのリクエストにリファラー情報が存在することを許します。
    - リファラー情報も削除するには、属性値 `rel="noopener noreferrer"` を使用します。
- JavaScript の `window.open` 関数の場合、`window.open` 関数の [windowFeatures](https://developer.mozilla.org/en-US/docs/Web/API/Window/open) パラメータに `noopener,noreferrer` の値を追加します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

As the behavior using the elements above is different between the browsers, either use an HTML link or JavaScript to open a window (or tab), then use this configuration to maximize the cross supports:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

上記の要素を使用した挙動はブラウザ間で異なるため、HTML リンクまたは JavaScript のどちらかでウィンドウ (またはタブ) を開き、クロスサポートを最大化するために次の設定を使用します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- For [HTML links](https://www.scaler.com/topics/html/html-links/), add the attribute `rel="noopener noreferrer"` to every link.
- For JavaScript, use this function to open a window (or tab):

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- [HTML links](https://www.scaler.com/topics/html/html-links/) の場合、すべてのリンクに `rel="noopener noreferrer"` 属性を追加します。
- JavaScript の場合、ウィンドウ (またはタブ) を開くために次の関数を使用します。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

``` javascript
function openPopup(url, name, windowFeatures){
  //Open the popup and set the opener and referrer policy instruction
  var newWindow = window.open(url, name, 'noopener,noreferrer,' + windowFeatures);
  //Reset the opener link
  newWindow.opener = null;
}
```

```javascript
function openPopup(url, name, windowFeatures){
  //Open the popup and set the opener and referrer policy instruction
  var newWindow = window.open(url, name, 'noopener,noreferrer,' + windowFeatures);
  //Reset the opener link
  newWindow.opener = null;
}
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Add the HTTP response header `Referrer-Policy: no-referrer` to every HTTP response sent by the application ([Header Referrer-Policy information](https://owasp.org/www-project-secure-headers/). This configuration will ensure that no referrer information is sent along with requests from the page.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- アプリケーションが送信するすべての HTTP レスポンスに、HTTP レスポンスヘッダー `Referrer-Policy: no-referrer` を追加します ([Header Referrer-Policy information](https://owasp.org/www-project-secure-headers/)。この設定により、ページからのリクエストでリファラー情報が送信されないことが保証されます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Compatibility matrix:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

互換性マトリクス:

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- [noopener](https://caniuse.com/#search=noopener)
- [noreferrer](https://caniuse.com/#search=noreferrer)
- [referrer-policy](https://caniuse.com/#feat=referrer-policy)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- [noopener](https://caniuse.com/#search=noopener)
- [noreferrer](https://caniuse.com/#search=noreferrer)
- [referrer-policy](https://caniuse.com/#feat=referrer-policy)

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Sandboxed frames

- Use the `sandbox` attribute of an `iframe` for untrusted content.
- The `sandbox` attribute of an `iframe` enables restrictions on content within an `iframe`. The following restrictions are active when the `sandbox` attribute is set:
    1. All markup is treated as being from a unique origin.
    2. All forms and scripts are disabled.
    3. All links are prevented from targeting other browsing contexts.
    4. All features that trigger automatically are blocked.
    5. All plugins are disabled.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## Sandboxed frames

- 信頼できないコンテンツには、`iframe` の `sandbox` 属性を使用してください。
- `iframe` の `sandbox` 属性は、`iframe` 内のコンテンツに制限を有効化します。`sandbox` 属性が設定されている場合、次の制限が有効です。
    1. すべてのマークアップは一意のオリジンからのものとして扱われます。
    2. すべてのフォームとスクリプトが無効化されます。
    3. すべてのリンクは他の browsing context を対象にできなくなります。
    4. 自動的に発動するすべての機能がブロックされます。
    5. すべてのプラグインが無効化されます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

It is possible to have a [fine-grained control](https://html.spec.whatwg.org/multipage/iframe-embed-object.html#attr-iframe-sandbox) over `iframe` capabilities using the value of the `sandbox` attribute.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

`sandbox` 属性の値を使用すると、`iframe` の機能を [fine-grained control](https://html.spec.whatwg.org/multipage/iframe-embed-object.html#attr-iframe-sandbox) できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- In old versions of user agents where this feature is not supported, this attribute will be ignored. Use this feature as an additional layer of protection or check if the browser supports sandboxed frames and only show the untrusted content if supported.
- Apart from this attribute, to prevent Clickjacking attacks and unsolicited framing it is encouraged to use the header `X-Frame-Options` which supports the `deny` and `same-origin` values. Other solutions like framebusting `if(window!==window.top) &#123; window.top.location=location;&#125;` are not recommended.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- この機能がサポートされていない古いユーザーエージェントでは、この属性は無視されます。この機能を追加の保護層として使用するか、ブラウザが sandboxed frames をサポートしているか確認し、サポートされている場合にのみ信頼できないコンテンツを表示してください。
- この属性とは別に、クリックジャッキング攻撃と意図しないフレーミングを防ぐため、`deny` と `same-origin` の値をサポートする `X-Frame-Options` ヘッダーの使用が推奨されます。framebusting `if(window!==window.top) &#123; window.top.location=location;&#125;` のような他の解決策は推奨されません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Credential and Personally Identifiable Information (PII) Input hints

- Protect the input values from being cached by the browser.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 認証情報および個人識別情報 (PII) 入力ヒント

- 入力値がブラウザにキャッシュされないよう保護してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

> Access a financial account from a public computer. Even though one is logged-off, the next person who uses the machine can log-in because the browser autocomplete functionality. To mitigate this, we tell the input fields not to assist in any way.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

> 公共のコンピューターから金融アカウントにアクセスする場合を考えます。ログオフしていても、ブラウザのオートコンプリート機能により、次にそのマシンを使う人がログインできてしまう可能性があります。これを軽減するため、入力フィールドに一切支援しないよう指示します。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<input type="text" spellcheck="false" autocomplete="off" autocorrect="off" autocapitalize="off"></input>
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Text areas and input fields for PII (name, email, address, phone number) and login credentials (username, password) should be prevented from being stored in the browser. Use these HTML5 attributes to prevent the browser from storing PII from your form:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

PII (名前、メール、住所、電話番号) とログイン認証情報 (ユーザー名、パスワード) のテキストエリアおよび入力フィールドは、ブラウザに保存されないようにするべきです。フォームから PII をブラウザに保存させないため、次の HTML5 属性を使用してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- `spellcheck="false"`
- `autocomplete="off"`
- `autocorrect="off"`
- `autocapitalize="off"`

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- `spellcheck="false"`
- `autocomplete="off"`
- `autocorrect="off"`
- `autocapitalize="off"`

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Offline Applications

- Whether the user agent requests permission from the user to store data for offline browsing and when this cache is deleted, varies from one browser to the next. Cache poisoning is an issue if a user connects through insecure networks, so for privacy reasons it is encouraged to require user input before sending any `manifest` file.
- Users should only cache trusted websites and clean the cache after browsing through open or insecure networks.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## Offline Applications

- ユーザーエージェントがオフライン閲覧用にデータを保存する許可をユーザーに求めるかどうか、またこのキャッシュがいつ削除されるかは、ブラウザごとに異なります。ユーザーが安全でないネットワーク経由で接続する場合、キャッシュポイズニングが問題になります。そのため、プライバシー上の理由から、`manifest` ファイルを送信する前にユーザー入力を要求することが推奨されます。
- ユーザーは信頼できる Web サイトだけをキャッシュし、オープンなネットワークや安全でないネットワークで閲覧した後はキャッシュを消去するべきです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Progressive Enhancements and Graceful Degradation Risks

- The best practice now is to determine the capabilities that a browser supports and augment with some type of substitute for capabilities that are not directly supported. This may mean an onion-like element, e.g. falling through to a Flash Player if the `<video>` tag is unsupported, or it may mean additional scripting code from various sources that should be code reviewed.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## Progressive Enhancements and Graceful Degradation Risks

- 現在のベストプラクティスは、ブラウザがサポートする機能を判定し、直接サポートされていない機能には何らかの代替を追加することです。これは onion-like な要素を意味する場合があります。たとえば、`<video>` タグがサポートされていない場合に Flash Player へフォールスルーすることや、コードレビューが必要なさまざまなソースからの追加スクリプトコードを意味する場合があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## HTTP Headers to enhance security

Consult the project [OWASP Secure Headers](https://owasp.org/www-project-secure-headers/) in order to obtains the list of HTTP security headers that an application should use to enable defenses at browser level.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## セキュリティを強化する HTTP ヘッダー

アプリケーションがブラウザレベルの防御を有効にするために使用すべき HTTP セキュリティヘッダーの一覧を得るには、[OWASP Secure Headers](https://owasp.org/www-project-secure-headers/) プロジェクトを参照してください。

</div>
</div>

</section>
</div>



## Attribution

<div className="attributionFooter">

- Original: HTML5 Security Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: English original retained for comparison. Japanese translation added. Bilingual display generated from official source and local Japanese translation.
- Retrieved: 2026-05-20

</div>
