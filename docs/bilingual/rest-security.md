---
title: REST Security Cheat Sheet
hide_title: true
---

<div className="docHero" data-category="api-and-web-service">
  <h1>REST セキュリティチートシート</h1>
  <div className="docMeta">
    <span className="docPill">最終更新: 2026-05-20</span>
    <span className="docPill">読了時間: 約 16 分</span>
    <span className="docPill">カテゴリ: API と Web サービス</span>
  </div>
</div>

<p className="docLead">REST セキュリティチートシートを、原文・翻訳・対比表示で確認できます。ASVS Index 対応の文脈で、公式原文と日本語訳を確認しやすく整理しています。</p>

<div className="tabbedContent">
  <input className="tabInput" type="radio" name="rest-security-view" id="rest-security-original" />
  <input className="tabInput" type="radio" name="rest-security-view" id="rest-security-translation" defaultChecked />
  <input className="tabInput" type="radio" name="rest-security-view" id="rest-security-bilingual" />

  <div className="contentTabs">
    <label htmlFor="rest-security-original" title="OWASP 原文">原文</label>
    <label htmlFor="rest-security-translation" title="日本語訳">翻訳</label>
    <label htmlFor="rest-security-bilingual" title="原文と翻訳を並べて確認">対比表示</label>
  </div>

<section id="rest-security-original-panel" className="tabPanel originalPanel contentPanel">

## Introduction

[REST](https://en.wikipedia.org/wiki/REST) (or **RE**presentational **S**tate **T**ransfer) is an architectural style first described in [Roy Fielding](https://en.wikipedia.org/wiki/Roy_Fielding)'s Ph.D. dissertation on [Architectural Styles and the Design of Network-based Software Architectures](https://www.ics.uci.edu/~fielding/pubs/dissertation/top.htm).

It evolved as Fielding wrote the HTTP/1.1 and URI specs and has been proven to be well-suited for developing distributed hypermedia applications. While REST is more widely applicable, it is most commonly used within the context of communicating with services via HTTP.

The key abstraction of information in REST is a resource. A REST API resource is identified by a URI, usually a HTTP URL. REST components use connectors to perform actions on a resource by using a representation to capture the current or intended state of the resource and transferring that representation.

The primary connector types are client and server, secondary connectors include cache, resolver and tunnel.

REST APIs are stateless. Stateful APIs do not adhere to the REST architectural style. State in the REST acronym refers to the state of the resource which the API accesses, not the state of a session within which the API is called. While there may be good reasons for building a stateful API, it is important to realize that managing sessions is complex and difficult to do securely.

Stateful services are out of scope of this Cheat Sheet: *Passing state from client to backend, while making the service technically stateless, is an anti-pattern that should also be avoided as it is prone to replay and impersonation attacks.*

In order to implement flows with REST APIs, resources are typically created, read, updated and deleted. For example, an ecommerce site may offer methods to create an empty shopping cart, to add items to the cart and to check out the cart. Each of these REST calls is stateless and the endpoint should check whether the caller is authorized to perform the requested operation.

Another key feature of REST applications is the use of standard HTTP verbs and error codes in the pursuit or removing unnecessary variation among different services.

Another key feature of REST applications is the use of [HATEOAS or Hypermedia As The Engine of Application State](https://en.wikipedia.org/wiki/HATEOAS). This provides REST applications a self-documenting nature making it easier for developers to interact with a REST service without prior knowledge.

## HTTPS

Secure REST services must only provide HTTPS endpoints. This protects authentication credentials in transit, for example passwords, API keys or JSON Web Tokens. It also allows clients to authenticate the service and guarantees integrity of the transmitted data.

See the [Transport Layer Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html) for additional information.

Consider the use of mutually authenticated client-side certificates to provide additional protection for highly privileged web services.

## Access Control

Non-public REST services must perform access control at each API endpoint. Web services in monolithic applications implement this by means of user authentication, authorization logic and session management. This has several drawbacks for modern architectures which compose multiple microservices following the RESTful style.

- in order to minimize latency and reduce coupling between services, the access control decision should be taken locally by REST endpoints
- user authentication should be centralised in a Identity Provider (IdP), which issues access tokens

## JWT

There seems to be a convergence towards using [JSON Web Tokens](https://tools.ietf.org/html/rfc7519) (JWT) as the format for security tokens. JWTs are JSON data structures containing a set of claims that can be used for access control decisions. A cryptographic signature or message authentication code (MAC) can be used to protect the integrity of the JWT.

- Ensure JWTs are integrity protected by either a signature or a MAC. Do not allow the unsecured JWTs: `&#123;"alg":"none"&#125;`.
    - See [here](https://tools.ietf.org/html/rfc7519#section-6.1)
- In general, signatures should be preferred over MACs for integrity protection of JWTs.

If MACs are used for integrity protection, every service that is able to validate JWTs can also create new JWTs using the same key. This means that all services using the same key have to mutually trust each other. Another consequence of this is that a compromise of any service also compromises all other services sharing the same key. See [here](https://tools.ietf.org/html/rfc7515#section-10.5) for additional information.

The relying party or token consumer validates a JWT by verifying its integrity and claims contained.

- A relying party must verify the integrity of the JWT based on its own configuration or hard-coded logic. It must not rely on the information of the JWT header to select the verification algorithm. See [here](https://www.chosenplaintext.ca/2015/03/31/jwt-algorithm-confusion.html) and [here](https://www.youtube.com/watch?v=bW5pS4e_MX8>)

Some claims have been standardized and should be present in JWT used for access controls. At least the following of the standard claims should be verified:

- `iss` or issuer - is this a trusted issuer? Is it the expected owner of the signing key?
- `aud` or audience - is the relying party in the target audience for this JWT?
- `exp` or expiration time - is the current time before the end of the validity period of this token?
- `nbf` or not before time - is the current time after the start of the validity period of this token?

As JWTs contain details of the authenticated entity (user etc.) a disconnect can occur between the JWT and the current state of the users session, for example, if the session is terminated earlier than the expiration time due to an explicit logout or an idle timeout. When an explicit session termination event occurs, a digest or hash of any associated JWTs should be submitted to a denylist on the API which will invalidate that JWT for any requests until the expiration of the token. See the [JSON_Web_Token_for_Java_Cheat_Sheet](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html#token-explicit-revocation-by-the-user) for further details.

## API Keys

Public REST services without access control run the risk of being farmed leading to excessive bills for bandwidth or compute cycles. API keys can be used to mitigate this risk. They are also often used by organisation to monetize APIs; instead of blocking high-frequency calls, clients are given access in accordance to a purchased access plan.

API keys can reduce the impact of denial-of-service attacks. However, when they are issued to third-party clients, they are relatively easy to compromise.

- Require API keys for every request to the protected endpoint.
- Return `429 Too Many Requests` HTTP response code if requests are coming in too quickly.
- Revoke the API key if the client violates the usage agreement.
- Do not rely exclusively on API keys to protect sensitive, critical or high-value resources.

## Restrict HTTP methods

- Apply an allowlist of permitted HTTP Methods e.g. `GET`, `POST`, `PUT`.
- Reject all requests not matching the allowlist with HTTP response code `405 Method not allowed`.
- Make sure the caller is authorised to use the incoming HTTP method on the resource collection, action, and record

In Java EE in particular, this can be difficult to implement properly. See [Bypassing Web Authentication and Authorization with HTTP Verb Tampering](https://cheatsheetseries.owasp.org/assets/REST_Security_Cheat_Sheet_Bypassing_VBAAC_with_HTTP_Verb_Tampering.pdf) for an explanation of this common misconfiguration.

## Preventing Out-of-Order API Execution

Modern REST APIs often implement business workflows through a sequence of endpoints (for example, create → validate → approve → finalize). If the backend does not explicitly validate workflow state transitions, attackers may invoke endpoints out of sequence to bypass intended controls.

### Problem

Out-of-order API execution occurs when an attacker:

- Skips required workflow steps by directly calling later-stage endpoints
- Replays or reuses tokens across workflow boundaries
- Exploits assumptions that the frontend enforces correct sequencing

Because each endpoint may be individually authenticated and authorized, traditional access control checks often fail to detect these issues.

### Example

A checkout workflow expects the following sequence:

```http
POST /checkout/create
POST /checkout/pay
POST /checkout/confirm
```

If the backend does not validate workflow state transitions, an attacker could directly invoke:

```http
POST /checkout/confirm
```

without completing payment.

### Prevention Guidance

- Enforce workflow state validation on the server side for every request
- Model workflows explicitly using finite states or state machines
- Bind tokens or identifiers to specific workflow stages
- Avoid relying on frontend logic to enforce sequencing
- Reject invalid or out-of-order transitions with clear error responses

### Testing Checklist

- Can endpoints be invoked out of sequence?
- Does each endpoint validate the current workflow state?
- Are tokens reusable across workflow steps?
- Are invalid state transitions consistently rejected?

## Input validation

- Do not trust input parameters/objects.
- Validate input: length / range / format and type.
- Achieve an implicit input validation by using strong types like numbers, booleans, dates, times or fixed data ranges in API parameters.
- Constrain string inputs with regexps.
- Reject unexpected/illegal content.
- Make use of validation/sanitation libraries or frameworks in your specific language.
- Define an appropriate request size limit and reject requests exceeding the limit with HTTP response status 413 Request Entity Too Large.
- Consider logging input validation failures. Assume that someone who is performing hundreds of failed input validations per second is up to no good.
- Have a look at input validation cheat sheet for comprehensive explanation.
- Use a secure parser for parsing the incoming messages. If you are using XML, make sure to use a parser that is not vulnerable to [XXE](https://owasp.org/www-community/vulnerabilities/XML_External_Entity_%28XXE%29_Processing) and similar attacks.

## Validate content types

A REST request or response body should match the intended content type in the header. Otherwise this could cause misinterpretation at the consumer/producer side and lead to code injection/execution.

- Document all supported content types in your API.

### Validate request content types

- Reject requests containing unexpected or missing content type headers with HTTP response status `406 Unacceptable` or `415 Unsupported Media Type`. For requests with `Content-Length: 0` however, a `Content-type` header is optional.
- For XML content types ensure appropriate XML parser hardening, see the [XXE cheat sheet](https://cheatsheetseries.owasp.org/cheatsheets/XML_External_Entity_Prevention_Cheat_Sheet.html).
- Avoid accidentally exposing unintended content types by explicitly defining content types e.g. [Jersey](https://jersey.github.io/) (Java) `@consumes("application/json"); @produces("application/json")`. This avoids [XXE-attack](https://owasp.org/www-community/vulnerabilities/XML_External_Entity_%28XXE%29_Processing) vectors for example.

### Send safe response content types

It is common for REST services to allow multiple response types (e.g. `application/xml` or `application/json`, and the client specifies the preferred order of response types by the Accept header in the request.

- **Do NOT** simply copy the `Accept` header to the `Content-type` header of the response.
- Reject the request (ideally with a `406 Not Acceptable` response) if the `Accept` header does not specifically contain one of the allowable types.

Services including script code (e.g. JavaScript) in their responses must be especially careful to defend against header injection attack.

- Ensure sending intended content type headers in your response matching your body content e.g. `application/json` and not `application/javascript`.

## Management endpoints

- Avoid exposing management endpoints via Internet.
- If management endpoints must be accessible via the Internet, make sure that users must use a strong authentication mechanism, e.g. multi-factor.
- Expose management endpoints via different HTTP ports or hosts preferably on a different NIC and restricted subnet.
- Restrict access to these endpoints by firewall rules  or use of access control lists.

## Error handling

- Respond with generic error messages - avoid revealing details of the failure unnecessarily.
- Do not pass technical details (e.g. call stacks or other internal hints) to the client.

## Audit logs

- Write audit logs before and after security related events.
- Consider logging token validation errors in order to detect attacks.
- Take care of log injection attacks by sanitizing log data beforehand.

## Security Headers

There are a number of [security related headers](https://owasp.org/www-project-secure-headers/) that can be returned in the HTTP responses to instruct browsers to act in specific ways. However, some of these headers are intended to be used with HTML responses, and as such may provide little or no security benefits on an API that does not return HTML. Note that if the API is only consumed by non-browser clients (e.g. mobile apps, server-to-server calls, command-line tools), most of these headers will have no effect since they are directives for browsers.

The following headers should be included in all API responses that may be consumed by browser clients:

| Header | Rationale |
|--------|-----------|
| `Cache-Control: no-store` | Header used to direct caching done by browsers. Providing `no-store` indicates that any caches of any kind (private or shared) should not store the response that contains the header. A browser must make a new request everytime the API is called to fetch the latest response. This header with a `no-store` value prevents sensitive information from being cached or stored. |
| `Content-Security-Policy: frame-ancestors 'none'` | Header used to specify whether a response can be framed in a `<frame>`, `<iframe>`, `<embed>` or `<object>` element. For an API response, there is no requirement to be framed in any of those elements. Providing `frame-ancestors 'none'` prevents any domain from framing the response returned by the API call. This header protects against [drag-and-drop](https://www.w3.org/Security/wiki/Clickjacking_Threats#Drag_and_drop_attacks) style clickjacking attacks. |
| `Content-Type` | Header to specify the content type of a response. This must be specified as per the type of content returned by an API call. If not specified or if specified incorrectly, a browser might attempt to guess the content type of the response. This can return in MIME sniffing attacks. One common content type value is `application/json` if the API response is JSON. |
| `Strict-Transport-Security` | Header to instruct a browser that the domain should only be accessed using HTTPS, and that any future attempts to access it using HTTP should automatically be converted to HTTPS. This header ensures that API calls are made over HTTPS and protects against spoofed certificates. |
| `X-Content-Type-Options: nosniff` | Header to instruct a browser to always use the MIME type that is declared in the `Content-Type` header rather than trying to determine the MIME type based on the file's content. This header with a `nosniff` value prevents browsers from performing MIME sniffing, and inappropriately interpreting responses as HTML. |
| `X-Frame-Options: DENY` | Legacy header superseded by `Content-Security-Policy: frame-ancestors 'none'` (see above). Still recommended for compatibility with older browsers that do not support CSP Level 2. Providing `DENY` prevents any domain from framing the response. |

The headers below are only intended to provide additional security when responses are rendered as HTML. As such, if the API will **never** return HTML in responses, then these headers may not be necessary. However, if there is any uncertainty about the function of the headers, or the types of information that the API returns (or may return in future), then it is recommended to include them as part of a defence-in-depth approach.

| Header | Example | Rationale |
|--------|-----------|-----------|
| Content-Security-Policy | `Content-Security-Policy: default-src 'none'` | The majority of CSP functionality only affects pages rendered as HTML. |
| Permissions-Policy | `Permissions-Policy: accelerometer=(), ambient-light-sensor=(), autoplay=(), battery=(), camera=(), cross-origin-isolated=(), display-capture=(), document-domain=(), encrypted-media=(), execution-while-not-rendered=(), execution-while-out-of-viewport=(), fullscreen=(), geolocation=(), gyroscope=(), keyboard-map=(), magnetometer=(), microphone=(), midi=(), navigation-override=(), payment=(), picture-in-picture=(), publickey-credentials-get=(), screen-wake-lock=(), sync-xhr=(), usb=(), web-share=(), xr-spatial-tracking=()` | This header used to be named Feature-Policy. When browsers heed this header, it is used to control browser features via directives. The example disables features with an empty allowlist for a number of permitted [directive names](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Permissions-Policy#directives). When you apply this header, verify that the directives are up-to-date and fit your needs. Please have a look at this [article](https://developer.chrome.com/en/docs/privacy-sandbox/permissions-policy) for a detailed explanation on how to control browser features. |
| Referrer-Policy | `Referrer-Policy: no-referrer` | Non-HTML responses should not trigger additional requests. |

## CORS

Cross-Origin Resource Sharing (CORS) is a W3C standard to flexibly specify what cross-domain requests are permitted. By delivering appropriate CORS Headers your REST API signals to the browser which domains, AKA origins, are allowed to make JavaScript calls to the REST service.

- Disable CORS headers if cross-domain calls are not supported/expected.
- Be as specific as possible and as general as necessary when setting the origins of cross-domain calls.

## Sensitive information in HTTP requests

RESTful web services should be careful to prevent leaking credentials. Passwords, security tokens, and API keys should not appear in the URL, as this can be captured in web server logs, which makes them intrinsically valuable.

- In `POST`/`PUT` requests sensitive data should be transferred in the request body or request headers.
- In `GET` requests sensitive data should be transferred in an HTTP Header.

**OK:**

`https://example.com/resourceCollection/[ID]/action`

`https://twitter.com/vanderaj/lists`

**NOT OK:**

`https://example.com/controller/123/action?apiKey=a53f435643de32` because the apiKey is in the URL.

## HTTP Return Code

HTTP defines [status code](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes). When designing REST API, don't just use `200` for success or `404` for error. Always use the semantically appropriate status code for the response.

Here is a non-exhaustive selection of security related REST API **status codes**. Use it to ensure you return the correct code.

| Code | Message                | Description                                                                                                                                                                                                          |
|-------------|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 200         | OK                     |  Response to a successful REST API action. The HTTP method can be GET, POST, PUT, PATCH or DELETE.                                                                                                                  |
| 201         | Created                |  The request has been fulfilled and resource created. A URI for the created resource is returned in the Location header.                                                                                            |
| 202         | Accepted               | The request has been accepted for processing, but processing is not yet complete.                                                                                                                                     |
| 301         | Moved Permanently       | Permanent redirection.                                                                                                                                                                                                |
| 304         | Not Modified           | Caching related response that returned when the client has the same copy of the resource as the server.                                                                                                                  |
| 307         | Temporary Redirect     | Temporary redirection of resource.                                                                                                                                                                                   |
| 400         | Bad Request            | The request is malformed, such as message body format error.                                                                                                                                                          |
| 401         | Unauthorized           | Wrong or no authentication ID/password provided.                                                                                                                                                                      |
| 403         | Forbidden              |  It's used when the authentication succeeded but authenticated user doesn't have permission to the request resource.                                                                                                |
| 404         | Not Found              | When a non-existent resource is requested.                                                                                                                                                                            |
| 405         | Method Not Acceptable  |  The error for an unexpected HTTP method. For example, the REST API is expecting HTTP GET, but HTTP PUT is used.                                                                                                    |
| 406         | Unacceptable           | The client presented a content type in the Accept header which is not supported by the server API.                                                                                                                    |
| 413         | Payload too large      | Use it to signal that the request size exceeded the given limit e.g. regarding file uploads.                                                                                                                          |
| 415         | Unsupported Media Type | The requested content type is not supported by the REST service.                                                                                                                                                      |
| 429         | Too Many Requests      |  The error is used when there may be DOS attack detected or the request is rejected due to rate limiting.                                                                                                           |
| 500         | Internal Server Error  | An unexpected condition prevented the server from fulfilling the request. Be aware that the response should not reveal internal  information that helps an attacker, e.g. detailed error messages or  stack traces. |
| 501         | Not Implemented        | The REST service does not implement the requested operation yet.                                                                                                                                                      |
| 503         | Service Unavailable    |  The REST service is temporarily unable to process the request. Used to inform the client it should retry at a later time.                                                                                         |

Additional information about HTTP return code usage in REST API can be found [here](https://www.restapitutorial.com/httpstatuscodes.html) and [here](https://restfulapi.net/http-status-codes).

</section>

<section id="rest-security-translation-panel" className="tabPanel translationPanel contentPanel">

## はじめに

[REST](https://en.wikipedia.org/wiki/REST) (または **RE**presentational **S**tate **T**ransfer) は、[Roy Fielding](https://en.wikipedia.org/wiki/Roy_Fielding) の博士論文 [Architectural Styles and the Design of Network-based Software Architectures](https://www.ics.uci.edu/~fielding/pubs/dissertation/top.htm) で初めて説明されたアーキテクチャスタイルです。

これは Fielding が HTTP/1.1 と URI の仕様を執筆する中で発展し、分散ハイパーメディアアプリケーションの開発に非常に適していることが実証されてきました。REST はより広く適用できますが、もっとも一般的には HTTP 経由でサービスと通信する文脈で使用されます。

REST における情報の主要な抽象化はリソースです。REST API のリソースは URI、通常は HTTP URL によって識別されます。REST コンポーネントは、現在または意図したリソースの状態を表現で捕捉し、その表現を転送することで、コネクタを使ってリソースに対する操作を実行します。

主要なコネクタタイプはクライアントとサーバーであり、副次的なコネクタにはキャッシュ、リゾルバ、トンネルがあります。

REST API はステートレスです。ステートフル API は REST アーキテクチャスタイルに従っていません。REST という頭字語に含まれる State は、API がアクセスするリソースの状態を指し、API が呼び出されるセッションの状態を指すものではありません。ステートフル API を構築する十分な理由がある場合もありますが、セッション管理は複雑であり、安全に実装することが難しい点を理解することが重要です。

ステートフルサービスはこのチートシートの対象外です。*クライアントからバックエンドへ状態を渡してサービスを技術的にステートレスに見せることも、リプレイ攻撃やなりすまし攻撃を受けやすいため、避けるべきアンチパターンです。*

REST API でフローを実装するために、通常はリソースを作成、読み取り、更新、削除します。たとえば EC サイトでは、空のショッピングカートを作成する、カートに商品を追加する、カートをチェックアウトするといったメソッドを提供できます。これらの REST 呼び出しはいずれもステートレスであり、エンドポイントは呼び出し元が要求された操作を実行する権限を持つかを確認する必要があります。

REST アプリケーションのもう一つの重要な特徴は、異なるサービス間の不要なばらつきを取り除くために、標準の HTTP 動詞とエラーコードを使用することです。

REST アプリケーションのもう一つの重要な特徴は、[HATEOAS または Hypermedia As The Engine of Application State](https://en.wikipedia.org/wiki/HATEOAS) の使用です。これにより REST アプリケーションは自己文書化の性質を持ち、開発者は事前知識がなくても REST サービスとやり取りしやすくなります。

## HTTPS

安全な REST サービスは HTTPS エンドポイントのみを提供しなければなりません。これにより、パスワード、API キー、JSON Web Token などの認証資格情報が転送中に保護されます。また、クライアントはサービスを認証でき、転送されるデータの完全性も保証されます。

追加情報については、[Transport Layer Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html) を参照してください。

高い権限を持つ Web サービスに追加の保護を提供するため、相互認証されたクライアント側証明書の使用を検討してください。

## アクセス制御

非公開の REST サービスは、各 API エンドポイントでアクセス制御を実施しなければなりません。モノリシックアプリケーションの Web サービスでは、ユーザー認証、認可ロジック、セッション管理によってこれを実装します。RESTful スタイルに従う複数のマイクロサービスを組み合わせる現代的なアーキテクチャでは、これにはいくつかの欠点があります。

- レイテンシを最小化し、サービス間の結合を減らすため、アクセス制御の判断は REST エンドポイントでローカルに行うべきです。
- ユーザー認証は、アクセストークンを発行する Identity Provider (IdP) に集約すべきです。

## JWT

セキュリティトークンの形式として [JSON Web Tokens](https://tools.ietf.org/html/rfc7519) (JWT) を使用する方向に収束しているようです。JWT は、アクセス制御判断に使用できる一連のクレームを含む JSON データ構造です。JWT の完全性を保護するために、暗号署名またはメッセージ認証コード (MAC) を使用できます。

- JWT が署名または MAC のいずれかで完全性保護されていることを確認してください。保護されていない JWT `{"alg":"none"}` を許可してはいけません。
  - [こちら](https://tools.ietf.org/html/rfc7519#section-6.1)を参照してください。
- 一般に、JWT の完全性保護には MAC より署名を優先すべきです。

完全性保護に MAC を使用する場合、JWT を検証できるすべてのサービスは、同じキーを使って新しい JWT も作成できます。つまり、同じキーを使用するすべてのサービスは相互に信頼しなければなりません。さらに、いずれかのサービスが侵害されると、同じキーを共有する他のすべてのサービスも侵害されることになります。追加情報については、[こちら](https://tools.ietf.org/html/rfc7515#section-10.5)を参照してください。

依拠当事者またはトークン利用者は、JWT の完全性と含まれるクレームを検証することで JWT を検証します。

- 依拠当事者は、自身の設定またはハードコードされたロジックに基づいて JWT の完全性を検証しなければなりません。検証アルゴリズムを選択するために JWT ヘッダーの情報に依存してはいけません。[こちら](https://www.chosenplaintext.ca/2015/03/31/jwt-algorithm-confusion.html)と[こちら](https://www.youtube.com/watch?v=bW5pS4e_MX8>)を参照してください。

一部のクレームは標準化されており、アクセス制御に使用される JWT には存在すべきです。少なくとも次の標準クレームを検証すべきです。

- `iss` または issuer - 信頼できる発行者か。署名キーの期待される所有者か。
- `aud` または audience - 依拠当事者はこの JWT の対象オーディエンスに含まれているか。
- `exp` または expiration time - 現在時刻はこのトークンの有効期間終了前か。
- `nbf` または not before time - 現在時刻はこのトークンの有効期間開始後か。

JWT には認証済みエンティティ (ユーザーなど) の詳細が含まれるため、JWT とユーザーセッションの現在状態との間に不一致が生じることがあります。たとえば、明示的なログアウトやアイドルタイムアウトにより、有効期限より前にセッションが終了する場合があります。明示的なセッション終了イベントが発生した場合、関連する JWT のダイジェストまたはハッシュを API の拒否リストに登録し、そのトークンの有効期限まで任意のリクエストでその JWT を無効化すべきです。詳細については、[JSON_Web_Token_for_Java_Cheat_Sheet](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html#token-explicit-revocation-by-the-user) を参照してください。

## API キー

アクセス制御のない公開 REST サービスは、収集・大量利用され、帯域幅や計算サイクルに対する過大な請求につながるリスクがあります。API キーはこのリスクを緩和するために使用できます。また、組織が API を収益化するためにもよく使用されます。高頻度の呼び出しをブロックする代わりに、クライアントには購入したアクセスプランに応じたアクセスが与えられます。

API キーはサービス拒否攻撃の影響を軽減できます。しかし、サードパーティクライアントに発行される場合、比較的容易に侵害されます。

- 保護されたエンドポイントへのすべてのリクエストに API キーを要求します。
- リクエストが速すぎる頻度で送られている場合は、HTTP レスポンスコード `429 Too Many Requests` を返します。
- クライアントが利用契約に違反した場合は API キーを失効させます。
- 機密性が高い、重要である、または高価値のリソースを保護するために API キーだけに依存してはいけません。

## HTTP メソッドの制限

- 許可された HTTP メソッド、たとえば `GET`、`POST`、`PUT` の許可リストを適用します。
- 許可リストに一致しないすべてのリクエストを、HTTP レスポンスコード `405 Method not allowed` で拒否します。
- 呼び出し元が、リソースコレクション、アクション、レコードに対して、受信した HTTP メソッドを使用する権限を持つことを確認します。

特に Java EE では、これを適切に実装することが難しい場合があります。この一般的な設定ミスの説明については、[Bypassing Web Authentication and Authorization with HTTP Verb Tampering](https://cheatsheetseries.owasp.org/assets/REST_Security_Cheat_Sheet_Bypassing_VBAAC_with_HTTP_Verb_Tampering.pdf) を参照してください。

## 順序外 API 実行の防止

現代的な REST API は、多くの場合、一連のエンドポイント (たとえば create → validate → approve → finalize) によってビジネスワークフローを実装します。バックエンドがワークフロー状態遷移を明示的に検証しない場合、攻撃者はエンドポイントを順序外に呼び出して、意図された制御を迂回する可能性があります。

### 問題

順序外 API 実行は、攻撃者が次のことを行う場合に発生します。

- 後段階のエンドポイントを直接呼び出して、必要なワークフローステップをスキップする。
- ワークフロー境界を越えてトークンをリプレイまたは再利用する。
- フロントエンドが正しい順序を強制するという前提を悪用する。

各エンドポイントが個別に認証・認可されている場合でも、従来のアクセス制御チェックではこれらの問題を検出できないことがよくあります。

### 例

チェックアウトワークフローでは、次の順序が期待されます。

```http
POST /checkout/create
POST /checkout/pay
POST /checkout/confirm
```

バックエンドがワークフロー状態遷移を検証しない場合、攻撃者は支払いを完了せずに次を直接呼び出す可能性があります。

```http
POST /checkout/confirm
```

### 防止ガイダンス

- すべてのリクエストでサーバー側のワークフロー状態検証を強制します。
- 有限状態または状態機械を使ってワークフローを明示的にモデル化します。
- トークンまたは識別子を特定のワークフローステージに結び付けます。
- 順序の強制をフロントエンドロジックに依存しないようにします。
- 無効または順序外の遷移を明確なエラーレスポンスで拒否します。

### テストチェックリスト

- エンドポイントを順序外に呼び出せるか。
- 各エンドポイントは現在のワークフロー状態を検証しているか。
- トークンはワークフローステップをまたいで再利用できるか。
- 無効な状態遷移は一貫して拒否されるか。

## 入力検証

- 入力パラメータやオブジェクトを信頼してはいけません。
- 入力を検証します。長さ、範囲、形式、型を検証してください。
- API パラメータで数値、真偽値、日付、時刻、固定データ範囲などの強い型を使用することで、暗黙的な入力検証を実現します。
- 正規表現で文字列入力を制約します。
- 予期しない、または不正なコンテンツを拒否します。
- 使用している言語固有の検証・サニタイズライブラリまたはフレームワークを活用します。
- 適切なリクエストサイズ制限を定義し、制限を超えるリクエストを HTTP レスポンスステータス 413 Request Entity Too Large で拒否します。
- 入力検証の失敗をログに記録することを検討します。1 秒あたり数百件の入力検証失敗を発生させている人物は、悪意を持っていると想定してください。
- 包括的な説明については、入力検証チートシートを参照してください。
- 受信メッセージの解析には安全なパーサーを使用します。XML を使用している場合は、[XXE](https://owasp.org/www-community/vulnerabilities/XML_External_Entity_%28XXE%29_Processing) や類似攻撃に脆弱でないパーサーを使用してください。

## Content-Type の検証

REST のリクエスト本文またはレスポンス本文は、ヘッダー内の意図した Content-Type と一致すべきです。一致しない場合、コンシューマー側またはプロデューサー側で誤解釈が発生し、コードインジェクションやコード実行につながる可能性があります。

- API でサポートするすべての Content-Type を文書化します。

### リクエスト Content-Type の検証

- 予期しない、または欠落した Content-Type ヘッダーを含むリクエストは、HTTP レスポンスステータス `406 Unacceptable` または `415 Unsupported Media Type` で拒否します。ただし、`Content-Length: 0` のリクエストでは `Content-type` ヘッダーは任意です。
- XML Content-Type については、適切な XML パーサー堅牢化を確認してください。[XXE cheat sheet](https://cheatsheetseries.owasp.org/cheatsheets/XML_External_Entity_Prevention_Cheat_Sheet.html) を参照してください。
- たとえば [Jersey](https://jersey.github.io/) (Java) の `@consumes("application/json"); @produces("application/json")` のように Content-Type を明示的に定義し、意図しない Content-Type を誤って公開しないようにします。これにより、たとえば [XXE 攻撃](https://owasp.org/www-community/vulnerabilities/XML_External_Entity_%28XXE%29_Processing)ベクトルを避けられます。

### 安全なレスポンス Content-Type の送信

REST サービスでは複数のレスポンスタイプ (たとえば `application/xml` や `application/json`) を許可し、クライアントがリクエストの Accept ヘッダーで希望するレスポンスタイプの順序を指定することが一般的です。

- `Accept` ヘッダーをレスポンスの `Content-type` ヘッダーへ単純にコピーしてはいけません。
- `Accept` ヘッダーに許可された型の一つが具体的に含まれていない場合は、理想的には `406 Not Acceptable` レスポンスでリクエストを拒否します。

レスポンスにスクリプトコード (たとえば JavaScript) を含むサービスは、ヘッダーインジェクション攻撃を防ぐために特に注意しなければなりません。

- レスポンス本文の内容に一致する意図した Content-Type ヘッダー、たとえば `application/javascript` ではなく `application/json` を送信していることを確認します。

## 管理エンドポイント

- 管理エンドポイントをインターネットに公開しないようにします。
- 管理エンドポイントをインターネットからアクセス可能にする必要がある場合は、多要素認証などの強力な認証メカニズムの使用をユーザーに必須としてください。
- 管理エンドポイントは異なる HTTP ポートまたはホストで公開し、可能であれば異なる NIC と制限されたサブネットで公開します。
- ファイアウォールルールまたはアクセス制御リストを使用して、これらのエンドポイントへのアクセスを制限します。

## エラー処理

- 一般的なエラーメッセージで応答し、失敗の詳細を不必要に明かさないようにします。
- 技術的な詳細 (たとえばコールスタックやその他の内部的な手がかり) をクライアントに渡してはいけません。

## 監査ログ

- セキュリティ関連イベントの前後に監査ログを書き込みます。
- 攻撃を検出するために、トークン検証エラーをログに記録することを検討します。
- 事前にログデータをサニタイズし、ログインジェクション攻撃に注意します。

## セキュリティヘッダー

ブラウザに特定の動作を指示するため、HTTP レスポンスで返せる[セキュリティ関連ヘッダー](https://owasp.org/www-project-secure-headers/)はいくつかあります。ただし、これらのヘッダーの一部は HTML レスポンスで使用することを意図しているため、HTML を返さない API ではセキュリティ上の利点がほとんど、またはまったくない場合があります。API がブラウザ以外のクライアント (たとえばモバイルアプリ、サーバー間呼び出し、コマンドラインツール) のみによって利用される場合、これらのヘッダーの多くはブラウザ向けの指示であるため効果がない点に注意してください。

ブラウザクライアントによって利用される可能性のあるすべての API レスポンスには、次のヘッダーを含めるべきです。

| ヘッダー | 理由 |
|--------|-----------|
| `Cache-Control: no-store` | ブラウザによるキャッシュを制御するために使用されるヘッダーです。`no-store` を指定すると、そのヘッダーを含むレスポンスを、どの種類のキャッシュ (プライベートまたは共有) も保存すべきではないことを示します。ブラウザは API が呼び出されるたびに最新のレスポンスを取得するため、新しいリクエストを行わなければなりません。`no-store` 値を持つこのヘッダーは、機密情報がキャッシュまたは保存されることを防ぎます。 |
| `Content-Security-Policy: frame-ancestors 'none'` | レスポンスを `<frame>`、`<iframe>`、`<embed>`、`<object>` 要素内にフレーム化できるかを指定するために使用されるヘッダーです。API レスポンスでは、これらの要素内にフレーム化される要件はありません。`frame-ancestors 'none'` を指定すると、API 呼び出しによって返されたレスポンスをどのドメインもフレーム化できなくなります。このヘッダーは、[ドラッグアンドドロップ](https://www.w3.org/Security/wiki/Clickjacking_Threats#Drag_and_drop_attacks)型のクリックジャッキング攻撃から保護します。 |
| `Content-Type` | レスポンスの Content-Type を指定するヘッダーです。API 呼び出しが返すコンテンツの種類に従って指定しなければなりません。指定されていない場合、または誤って指定されている場合、ブラウザはレスポンスの Content-Type を推測しようとする可能性があります。これは MIME sniffing 攻撃につながる可能性があります。API レスポンスが JSON の場合、一般的な Content-Type 値は `application/json` です。 |
| `Strict-Transport-Security` | ドメインには HTTPS のみでアクセスすべきであり、将来 HTTP でアクセスしようとした場合は自動的に HTTPS に変換すべきであることをブラウザに指示するヘッダーです。このヘッダーは API 呼び出しが HTTPS 経由で行われることを保証し、偽装証明書から保護します。 |
| `X-Content-Type-Options: nosniff` | ファイルの内容に基づいて MIME タイプを判断しようとするのではなく、`Content-Type` ヘッダーで宣言された MIME タイプを常に使用するようブラウザに指示するヘッダーです。`nosniff` 値を持つこのヘッダーは、ブラウザが MIME sniffing を行い、レスポンスを不適切に HTML として解釈することを防ぎます。 |
| `X-Frame-Options: DENY` | `Content-Security-Policy: frame-ancestors 'none'` (上記参照) に置き換えられたレガシーヘッダーです。CSP Level 2 をサポートしていない古いブラウザとの互換性のため、依然として推奨されます。`DENY` を指定すると、どのドメインもレスポンスをフレーム化できなくなります。 |

以下のヘッダーは、レスポンスが HTML としてレンダリングされる場合に追加のセキュリティを提供することだけを意図しています。そのため、API がレスポンスで HTML を決して返さない場合、これらのヘッダーは不要かもしれません。しかし、ヘッダーの機能や API が返す (または将来返す可能性がある) 情報の種類に不確実性がある場合は、多層防御の一部として含めることが推奨されます。

| ヘッダー | 例 | 理由 |
|--------|-----------|-----------|
| Content-Security-Policy | `Content-Security-Policy: default-src 'none'` | CSP の機能の大部分は、HTML としてレンダリングされるページにのみ影響します。 |
| Permissions-Policy | `Permissions-Policy: accelerometer=(), ambient-light-sensor=(), autoplay=(), battery=(), camera=(), cross-origin-isolated=(), display-capture=(), document-domain=(), encrypted-media=(), execution-while-not-rendered=(), execution-while-out-of-viewport=(), fullscreen=(), geolocation=(), gyroscope=(), keyboard-map=(), magnetometer=(), microphone=(), midi=(), navigation-override=(), payment=(), picture-in-picture=(), publickey-credentials-get=(), screen-wake-lock=(), sync-xhr=(), usb=(), web-share=(), xr-spatial-tracking=()` | このヘッダーは以前 Feature-Policy と呼ばれていました。ブラウザがこのヘッダーに従う場合、ディレクティブを通じてブラウザ機能を制御するために使用されます。この例では、許可された多数の[ディレクティブ名](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Permissions-Policy#directives)に対して空の許可リストを指定し、機能を無効化します。このヘッダーを適用する場合は、ディレクティブが最新であり、ニーズに合っていることを確認してください。ブラウザ機能を制御する方法の詳細な説明については、この[記事](https://developer.chrome.com/en/docs/privacy-sandbox/permissions-policy)を参照してください。 |
| Referrer-Policy | `Referrer-Policy: no-referrer` | HTML ではないレスポンスは追加リクエストを発生させるべきではありません。 |

## CORS

Cross-Origin Resource Sharing (CORS) は、許可されるクロスドメインリクエストを柔軟に指定するための W3C 標準です。適切な CORS ヘッダーを配信することで、REST API はブラウザに対して、どのドメイン、すなわち origin が REST サービスへ JavaScript 呼び出しを行えるかを通知します。

- クロスドメイン呼び出しがサポートされていない、または想定されていない場合は、CORS ヘッダーを無効化します。
- クロスドメイン呼び出しの origin を設定する際は、可能な限り具体的にし、必要な範囲でのみ一般化します。

## HTTP リクエスト内の機密情報

RESTful Web サービスは、認証資格情報の漏えいを防ぐよう注意すべきです。パスワード、セキュリティトークン、API キーは URL に含めるべきではありません。URL は Web サーバーログに記録される可能性があり、その結果として本質的に価値の高い情報になります。

- `POST`/`PUT` リクエストでは、機密データをリクエスト本文またはリクエストヘッダーで転送すべきです。
- `GET` リクエストでは、機密データを HTTP ヘッダーで転送すべきです。

**OK:**

`https://example.com/resourceCollection/[ID]/action`

`https://twitter.com/vanderaj/lists`

**NOT OK:**

`https://example.com/controller/123/action?apiKey=a53f435643de32` は、apiKey が URL に含まれているため不適切です。

## HTTP リターンコード

HTTP は[ステータスコード](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes)を定義しています。REST API を設計する際は、成功に `200`、エラーに `404` だけを使用するのではなく、常にレスポンスに意味的に適切なステータスコードを使用してください。

以下は、セキュリティに関連する REST API の**ステータスコード**の非網羅的な抜粋です。正しいコードを返すために活用してください。

| コード | メッセージ | 説明 |
|-------------|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 200 | OK | REST API アクションが成功した場合のレスポンスです。HTTP メソッドは GET、POST、PUT、PATCH、DELETE のいずれかです。 |
| 201 | Created | リクエストが完了し、リソースが作成されました。作成されたリソースの URI は Location ヘッダーで返されます。 |
| 202 | Accepted | リクエストは処理のために受け付けられましたが、処理はまだ完了していません。 |
| 301 | Moved Permanently | 永続的なリダイレクトです。 |
| 304 | Not Modified | クライアントがサーバーと同じリソースのコピーを持っている場合に返される、キャッシュ関連のレスポンスです。 |
| 307 | Temporary Redirect | リソースの一時的なリダイレクトです。 |
| 400 | Bad Request | メッセージ本文の形式エラーなど、リクエストが不正です。 |
| 401 | Unauthorized | 認証 ID/パスワードが誤っている、または提供されていません。 |
| 403 | Forbidden | 認証は成功したものの、認証済みユーザーが要求されたリソースへの権限を持たない場合に使用されます。 |
| 404 | Not Found | 存在しないリソースが要求された場合です。 |
| 405 | Method Not Acceptable | 予期しない HTTP メソッドに対するエラーです。たとえば REST API が HTTP GET を期待しているのに HTTP PUT が使用された場合です。 |
| 406 | Unacceptable | クライアントが Accept ヘッダーで提示した Content-Type がサーバー API でサポートされていません。 |
| 413 | Payload too large | ファイルアップロードなどに関して、リクエストサイズが指定された制限を超えたことを示すために使用します。 |
| 415 | Unsupported Media Type | 要求された Content-Type は REST サービスでサポートされていません。 |
| 429 | Too Many Requests | DoS 攻撃が検出された可能性がある場合、またはレート制限によりリクエストが拒否された場合に使用されるエラーです。 |
| 500 | Internal Server Error | 予期しない状態により、サーバーはリクエストを満たせませんでした。レスポンスは、詳細なエラーメッセージやスタックトレースなど、攻撃者に役立つ内部情報を明かすべきではない点に注意してください。 |
| 501 | Not Implemented | REST サービスは要求された操作をまだ実装していません。 |
| 503 | Service Unavailable | REST サービスは一時的にリクエストを処理できません。後で再試行すべきであることをクライアントへ通知するために使用します。 |

REST API における HTTP リターンコードの使用に関する追加情報は、[こちら](https://www.restapitutorial.com/httpstatuscodes.html)と[こちら](https://restfulapi.net/http-status-codes)にあります。

</section>

<section id="rest-security-bilingual-panel" className="tabPanel bilingualPanel">

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Introduction

[REST](https://en.wikipedia.org/wiki/REST) (or **RE**presentational **S**tate **T**ransfer) is an architectural style first described in [Roy Fielding](https://en.wikipedia.org/wiki/Roy_Fielding)'s Ph.D. dissertation on [Architectural Styles and the Design of Network-based Software Architectures](https://www.ics.uci.edu/~fielding/pubs/dissertation/top.htm).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## はじめに

[REST](https://en.wikipedia.org/wiki/REST) (または **RE**presentational **S**tate **T**ransfer) は、[Roy Fielding](https://en.wikipedia.org/wiki/Roy_Fielding) の博士論文 [Architectural Styles and the Design of Network-based Software Architectures](https://www.ics.uci.edu/~fielding/pubs/dissertation/top.htm) で初めて説明されたアーキテクチャスタイルです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

It evolved as Fielding wrote the HTTP/1.1 and URI specs and has been proven to be well-suited for developing distributed hypermedia applications. While REST is more widely applicable, it is most commonly used within the context of communicating with services via HTTP.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

これは Fielding が HTTP/1.1 と URI の仕様を執筆する中で発展し、分散ハイパーメディアアプリケーションの開発に非常に適していることが実証されてきました。REST はより広く適用できますが、もっとも一般的には HTTP 経由でサービスと通信する文脈で使用されます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The key abstraction of information in REST is a resource. A REST API resource is identified by a URI, usually a HTTP URL. REST components use connectors to perform actions on a resource by using a representation to capture the current or intended state of the resource and transferring that representation.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

REST における情報の主要な抽象化はリソースです。REST API のリソースは URI、通常は HTTP URL によって識別されます。REST コンポーネントは、現在または意図したリソースの状態を表現で捕捉し、その表現を転送することで、コネクタを使ってリソースに対する操作を実行します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The primary connector types are client and server, secondary connectors include cache, resolver and tunnel.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

主要なコネクタタイプはクライアントとサーバーであり、副次的なコネクタにはキャッシュ、リゾルバ、トンネルがあります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

REST APIs are stateless. Stateful APIs do not adhere to the REST architectural style. State in the REST acronym refers to the state of the resource which the API accesses, not the state of a session within which the API is called. While there may be good reasons for building a stateful API, it is important to realize that managing sessions is complex and difficult to do securely.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

REST API はステートレスです。ステートフル API は REST アーキテクチャスタイルに従っていません。REST という頭字語に含まれる State は、API がアクセスするリソースの状態を指し、API が呼び出されるセッションの状態を指すものではありません。ステートフル API を構築する十分な理由がある場合もありますが、セッション管理は複雑であり、安全に実装することが難しい点を理解することが重要です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Stateful services are out of scope of this Cheat Sheet: *Passing state from client to backend, while making the service technically stateless, is an anti-pattern that should also be avoided as it is prone to replay and impersonation attacks.*

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

ステートフルサービスはこのチートシートの対象外です。*クライアントからバックエンドへ状態を渡してサービスを技術的にステートレスに見せることも、リプレイ攻撃やなりすまし攻撃を受けやすいため、避けるべきアンチパターンです。*

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

In order to implement flows with REST APIs, resources are typically created, read, updated and deleted. For example, an ecommerce site may offer methods to create an empty shopping cart, to add items to the cart and to check out the cart. Each of these REST calls is stateless and the endpoint should check whether the caller is authorized to perform the requested operation.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

REST API でフローを実装するために、通常はリソースを作成、読み取り、更新、削除します。たとえば EC サイトでは、空のショッピングカートを作成する、カートに商品を追加する、カートをチェックアウトするといったメソッドを提供できます。これらの REST 呼び出しはいずれもステートレスであり、エンドポイントは呼び出し元が要求された操作を実行する権限を持つかを確認する必要があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Another key feature of REST applications is the use of standard HTTP verbs and error codes in the pursuit or removing unnecessary variation among different services.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

REST アプリケーションのもう一つの重要な特徴は、異なるサービス間の不要なばらつきを取り除くために、標準の HTTP 動詞とエラーコードを使用することです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Another key feature of REST applications is the use of [HATEOAS or Hypermedia As The Engine of Application State](https://en.wikipedia.org/wiki/HATEOAS). This provides REST applications a self-documenting nature making it easier for developers to interact with a REST service without prior knowledge.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

REST アプリケーションのもう一つの重要な特徴は、[HATEOAS または Hypermedia As The Engine of Application State](https://en.wikipedia.org/wiki/HATEOAS) の使用です。これにより REST アプリケーションは自己文書化の性質を持ち、開発者は事前知識がなくても REST サービスとやり取りしやすくなります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## HTTPS

Secure REST services must only provide HTTPS endpoints. This protects authentication credentials in transit, for example passwords, API keys or JSON Web Tokens. It also allows clients to authenticate the service and guarantees integrity of the transmitted data.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## HTTPS

安全な REST サービスは HTTPS エンドポイントのみを提供しなければなりません。これにより、パスワード、API キー、JSON Web Token などの認証資格情報が転送中に保護されます。また、クライアントはサービスを認証でき、転送されるデータの完全性も保証されます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

See the [Transport Layer Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html) for additional information.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

追加情報については、[Transport Layer Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html) を参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Consider the use of mutually authenticated client-side certificates to provide additional protection for highly privileged web services.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

高い権限を持つ Web サービスに追加の保護を提供するため、相互認証されたクライアント側証明書の使用を検討してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Access Control

Non-public REST services must perform access control at each API endpoint. Web services in monolithic applications implement this by means of user authentication, authorization logic and session management. This has several drawbacks for modern architectures which compose multiple microservices following the RESTful style.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## アクセス制御

非公開の REST サービスは、各 API エンドポイントでアクセス制御を実施しなければなりません。モノリシックアプリケーションの Web サービスでは、ユーザー認証、認可ロジック、セッション管理によってこれを実装します。RESTful スタイルに従う複数のマイクロサービスを組み合わせる現代的なアーキテクチャでは、これにはいくつかの欠点があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- in order to minimize latency and reduce coupling between services, the access control decision should be taken locally by REST endpoints
- user authentication should be centralised in a Identity Provider (IdP), which issues access tokens

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- レイテンシを最小化し、サービス間の結合を減らすため、アクセス制御の判断は REST エンドポイントでローカルに行うべきです。
- ユーザー認証は、アクセストークンを発行する Identity Provider (IdP) に集約すべきです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## JWT

There seems to be a convergence towards using [JSON Web Tokens](https://tools.ietf.org/html/rfc7519) (JWT) as the format for security tokens. JWTs are JSON data structures containing a set of claims that can be used for access control decisions. A cryptographic signature or message authentication code (MAC) can be used to protect the integrity of the JWT.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## JWT

セキュリティトークンの形式として [JSON Web Tokens](https://tools.ietf.org/html/rfc7519) (JWT) を使用する方向に収束しているようです。JWT は、アクセス制御判断に使用できる一連のクレームを含む JSON データ構造です。JWT の完全性を保護するために、暗号署名またはメッセージ認証コード (MAC) を使用できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Ensure JWTs are integrity protected by either a signature or a MAC. Do not allow the unsecured JWTs: `&#123;"alg":"none"&#125;`.
    - See [here](https://tools.ietf.org/html/rfc7519#section-6.1)
- In general, signatures should be preferred over MACs for integrity protection of JWTs.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- JWT が署名または MAC のいずれかで完全性保護されていることを確認してください。保護されていない JWT `{"alg":"none"}` を許可してはいけません。
  - [こちら](https://tools.ietf.org/html/rfc7519#section-6.1)を参照してください。
- 一般に、JWT の完全性保護には MAC より署名を優先すべきです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

If MACs are used for integrity protection, every service that is able to validate JWTs can also create new JWTs using the same key. This means that all services using the same key have to mutually trust each other. Another consequence of this is that a compromise of any service also compromises all other services sharing the same key. See [here](https://tools.ietf.org/html/rfc7515#section-10.5) for additional information.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

完全性保護に MAC を使用する場合、JWT を検証できるすべてのサービスは、同じキーを使って新しい JWT も作成できます。つまり、同じキーを使用するすべてのサービスは相互に信頼しなければなりません。さらに、いずれかのサービスが侵害されると、同じキーを共有する他のすべてのサービスも侵害されることになります。追加情報については、[こちら](https://tools.ietf.org/html/rfc7515#section-10.5)を参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The relying party or token consumer validates a JWT by verifying its integrity and claims contained.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

依拠当事者またはトークン利用者は、JWT の完全性と含まれるクレームを検証することで JWT を検証します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- A relying party must verify the integrity of the JWT based on its own configuration or hard-coded logic. It must not rely on the information of the JWT header to select the verification algorithm. See [here](https://www.chosenplaintext.ca/2015/03/31/jwt-algorithm-confusion.html) and [here](https://www.youtube.com/watch?v=bW5pS4e_MX8>)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- 依拠当事者は、自身の設定またはハードコードされたロジックに基づいて JWT の完全性を検証しなければなりません。検証アルゴリズムを選択するために JWT ヘッダーの情報に依存してはいけません。[こちら](https://www.chosenplaintext.ca/2015/03/31/jwt-algorithm-confusion.html)と[こちら](https://www.youtube.com/watch?v=bW5pS4e_MX8>)を参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Some claims have been standardized and should be present in JWT used for access controls. At least the following of the standard claims should be verified:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

一部のクレームは標準化されており、アクセス制御に使用される JWT には存在すべきです。少なくとも次の標準クレームを検証すべきです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- `iss` or issuer - is this a trusted issuer? Is it the expected owner of the signing key?
- `aud` or audience - is the relying party in the target audience for this JWT?
- `exp` or expiration time - is the current time before the end of the validity period of this token?
- `nbf` or not before time - is the current time after the start of the validity period of this token?

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- `iss` または issuer - 信頼できる発行者か。署名キーの期待される所有者か。
- `aud` または audience - 依拠当事者はこの JWT の対象オーディエンスに含まれているか。
- `exp` または expiration time - 現在時刻はこのトークンの有効期間終了前か。
- `nbf` または not before time - 現在時刻はこのトークンの有効期間開始後か。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

As JWTs contain details of the authenticated entity (user etc.) a disconnect can occur between the JWT and the current state of the users session, for example, if the session is terminated earlier than the expiration time due to an explicit logout or an idle timeout. When an explicit session termination event occurs, a digest or hash of any associated JWTs should be submitted to a denylist on the API which will invalidate that JWT for any requests until the expiration of the token. See the [JSON_Web_Token_for_Java_Cheat_Sheet](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html#token-explicit-revocation-by-the-user) for further details.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

JWT には認証済みエンティティ (ユーザーなど) の詳細が含まれるため、JWT とユーザーセッションの現在状態との間に不一致が生じることがあります。たとえば、明示的なログアウトやアイドルタイムアウトにより、有効期限より前にセッションが終了する場合があります。明示的なセッション終了イベントが発生した場合、関連する JWT のダイジェストまたはハッシュを API の拒否リストに登録し、そのトークンの有効期限まで任意のリクエストでその JWT を無効化すべきです。詳細については、[JSON_Web_Token_for_Java_Cheat_Sheet](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html#token-explicit-revocation-by-the-user) を参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## API Keys

Public REST services without access control run the risk of being farmed leading to excessive bills for bandwidth or compute cycles. API keys can be used to mitigate this risk. They are also often used by organisation to monetize APIs; instead of blocking high-frequency calls, clients are given access in accordance to a purchased access plan.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## API キー

アクセス制御のない公開 REST サービスは、収集・大量利用され、帯域幅や計算サイクルに対する過大な請求につながるリスクがあります。API キーはこのリスクを緩和するために使用できます。また、組織が API を収益化するためにもよく使用されます。高頻度の呼び出しをブロックする代わりに、クライアントには購入したアクセスプランに応じたアクセスが与えられます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

API keys can reduce the impact of denial-of-service attacks. However, when they are issued to third-party clients, they are relatively easy to compromise.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

API キーはサービス拒否攻撃の影響を軽減できます。しかし、サードパーティクライアントに発行される場合、比較的容易に侵害されます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Require API keys for every request to the protected endpoint.
- Return `429 Too Many Requests` HTTP response code if requests are coming in too quickly.
- Revoke the API key if the client violates the usage agreement.
- Do not rely exclusively on API keys to protect sensitive, critical or high-value resources.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- 保護されたエンドポイントへのすべてのリクエストに API キーを要求します。
- リクエストが速すぎる頻度で送られている場合は、HTTP レスポンスコード `429 Too Many Requests` を返します。
- クライアントが利用契約に違反した場合は API キーを失効させます。
- 機密性が高い、重要である、または高価値のリソースを保護するために API キーだけに依存してはいけません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Restrict HTTP methods

- Apply an allowlist of permitted HTTP Methods e.g. `GET`, `POST`, `PUT`.
- Reject all requests not matching the allowlist with HTTP response code `405 Method not allowed`.
- Make sure the caller is authorised to use the incoming HTTP method on the resource collection, action, and record

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## HTTP メソッドの制限

- 許可された HTTP メソッド、たとえば `GET`、`POST`、`PUT` の許可リストを適用します。
- 許可リストに一致しないすべてのリクエストを、HTTP レスポンスコード `405 Method not allowed` で拒否します。
- 呼び出し元が、リソースコレクション、アクション、レコードに対して、受信した HTTP メソッドを使用する権限を持つことを確認します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

In Java EE in particular, this can be difficult to implement properly. See [Bypassing Web Authentication and Authorization with HTTP Verb Tampering](https://cheatsheetseries.owasp.org/assets/REST_Security_Cheat_Sheet_Bypassing_VBAAC_with_HTTP_Verb_Tampering.pdf) for an explanation of this common misconfiguration.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

特に Java EE では、これを適切に実装することが難しい場合があります。この一般的な設定ミスの説明については、[Bypassing Web Authentication and Authorization with HTTP Verb Tampering](https://cheatsheetseries.owasp.org/assets/REST_Security_Cheat_Sheet_Bypassing_VBAAC_with_HTTP_Verb_Tampering.pdf) を参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Preventing Out-of-Order API Execution

Modern REST APIs often implement business workflows through a sequence of endpoints (for example, create → validate → approve → finalize). If the backend does not explicitly validate workflow state transitions, attackers may invoke endpoints out of sequence to bypass intended controls.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 順序外 API 実行の防止

現代的な REST API は、多くの場合、一連のエンドポイント (たとえば create → validate → approve → finalize) によってビジネスワークフローを実装します。バックエンドがワークフロー状態遷移を明示的に検証しない場合、攻撃者はエンドポイントを順序外に呼び出して、意図された制御を迂回する可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Problem

Out-of-order API execution occurs when an attacker:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 問題

順序外 API 実行は、攻撃者が次のことを行う場合に発生します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Skips required workflow steps by directly calling later-stage endpoints
- Replays or reuses tokens across workflow boundaries
- Exploits assumptions that the frontend enforces correct sequencing

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- 後段階のエンドポイントを直接呼び出して、必要なワークフローステップをスキップする。
- ワークフロー境界を越えてトークンをリプレイまたは再利用する。
- フロントエンドが正しい順序を強制するという前提を悪用する。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Because each endpoint may be individually authenticated and authorized, traditional access control checks often fail to detect these issues.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

各エンドポイントが個別に認証・認可されている場合でも、従来のアクセス制御チェックではこれらの問題を検出できないことがよくあります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Example

A checkout workflow expects the following sequence:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 例

チェックアウトワークフローでは、次の順序が期待されます。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```http
POST /checkout/create
POST /checkout/pay
POST /checkout/confirm
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

If the backend does not validate workflow state transitions, an attacker could directly invoke:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

バックエンドがワークフロー状態遷移を検証しない場合、攻撃者は支払いを完了せずに次を直接呼び出す可能性があります。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```http
POST /checkout/confirm
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

without completing payment.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 防止ガイダンス

- すべてのリクエストでサーバー側のワークフロー状態検証を強制します。
- 有限状態または状態機械を使ってワークフローを明示的にモデル化します。
- トークンまたは識別子を特定のワークフローステージに結び付けます。
- 順序の強制をフロントエンドロジックに依存しないようにします。
- 無効または順序外の遷移を明確なエラーレスポンスで拒否します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Prevention Guidance

- Enforce workflow state validation on the server side for every request
- Model workflows explicitly using finite states or state machines
- Bind tokens or identifiers to specific workflow stages
- Avoid relying on frontend logic to enforce sequencing
- Reject invalid or out-of-order transitions with clear error responses

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### テストチェックリスト

- エンドポイントを順序外に呼び出せるか。
- 各エンドポイントは現在のワークフロー状態を検証しているか。
- トークンはワークフローステップをまたいで再利用できるか。
- 無効な状態遷移は一貫して拒否されるか。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Testing Checklist

- Can endpoints be invoked out of sequence?
- Does each endpoint validate the current workflow state?
- Are tokens reusable across workflow steps?
- Are invalid state transitions consistently rejected?

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 入力検証

- 入力パラメータやオブジェクトを信頼してはいけません。
- 入力を検証します。長さ、範囲、形式、型を検証してください。
- API パラメータで数値、真偽値、日付、時刻、固定データ範囲などの強い型を使用することで、暗黙的な入力検証を実現します。
- 正規表現で文字列入力を制約します。
- 予期しない、または不正なコンテンツを拒否します。
- 使用している言語固有の検証・サニタイズライブラリまたはフレームワークを活用します。
- 適切なリクエストサイズ制限を定義し、制限を超えるリクエストを HTTP レスポンスステータス 413 Request Entity Too Large で拒否します。
- 入力検証の失敗をログに記録することを検討します。1 秒あたり数百件の入力検証失敗を発生させている人物は、悪意を持っていると想定してください。
- 包括的な説明については、入力検証チートシートを参照してください。
- 受信メッセージの解析には安全なパーサーを使用します。XML を使用している場合は、[XXE](https://owasp.org/www-community/vulnerabilities/XML_External_Entity_%28XXE%29_Processing) や類似攻撃に脆弱でないパーサーを使用してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Input validation

- Do not trust input parameters/objects.
- Validate input: length / range / format and type.
- Achieve an implicit input validation by using strong types like numbers, booleans, dates, times or fixed data ranges in API parameters.
- Constrain string inputs with regexps.
- Reject unexpected/illegal content.
- Make use of validation/sanitation libraries or frameworks in your specific language.
- Define an appropriate request size limit and reject requests exceeding the limit with HTTP response status 413 Request Entity Too Large.
- Consider logging input validation failures. Assume that someone who is performing hundreds of failed input validations per second is up to no good.
- Have a look at input validation cheat sheet for comprehensive explanation.
- Use a secure parser for parsing the incoming messages. If you are using XML, make sure to use a parser that is not vulnerable to [XXE](https://owasp.org/www-community/vulnerabilities/XML_External_Entity_%28XXE%29_Processing) and similar attacks.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## Content-Type の検証

REST のリクエスト本文またはレスポンス本文は、ヘッダー内の意図した Content-Type と一致すべきです。一致しない場合、コンシューマー側またはプロデューサー側で誤解釈が発生し、コードインジェクションやコード実行につながる可能性があります。

- API でサポートするすべての Content-Type を文書化します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Validate content types

A REST request or response body should match the intended content type in the header. Otherwise this could cause misinterpretation at the consumer/producer side and lead to code injection/execution.

- Document all supported content types in your API.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### リクエスト Content-Type の検証

- 予期しない、または欠落した Content-Type ヘッダーを含むリクエストは、HTTP レスポンスステータス `406 Unacceptable` または `415 Unsupported Media Type` で拒否します。ただし、`Content-Length: 0` のリクエストでは `Content-type` ヘッダーは任意です。
- XML Content-Type については、適切な XML パーサー堅牢化を確認してください。[XXE cheat sheet](https://cheatsheetseries.owasp.org/cheatsheets/XML_External_Entity_Prevention_Cheat_Sheet.html) を参照してください。
- たとえば [Jersey](https://jersey.github.io/) (Java) の `@consumes("application/json"); @produces("application/json")` のように Content-Type を明示的に定義し、意図しない Content-Type を誤って公開しないようにします。これにより、たとえば [XXE 攻撃](https://owasp.org/www-community/vulnerabilities/XML_External_Entity_%28XXE%29_Processing)ベクトルを避けられます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Validate request content types

- Reject requests containing unexpected or missing content type headers with HTTP response status `406 Unacceptable` or `415 Unsupported Media Type`. For requests with `Content-Length: 0` however, a `Content-type` header is optional.
- For XML content types ensure appropriate XML parser hardening, see the [XXE cheat sheet](https://cheatsheetseries.owasp.org/cheatsheets/XML_External_Entity_Prevention_Cheat_Sheet.html).
- Avoid accidentally exposing unintended content types by explicitly defining content types e.g. [Jersey](https://jersey.github.io/) (Java) `@consumes("application/json"); @produces("application/json")`. This avoids [XXE-attack](https://owasp.org/www-community/vulnerabilities/XML_External_Entity_%28XXE%29_Processing) vectors for example.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 安全なレスポンス Content-Type の送信

REST サービスでは複数のレスポンスタイプ (たとえば `application/xml` や `application/json`) を許可し、クライアントがリクエストの Accept ヘッダーで希望するレスポンスタイプの順序を指定することが一般的です。

- `Accept` ヘッダーをレスポンスの `Content-type` ヘッダーへ単純にコピーしてはいけません。
- `Accept` ヘッダーに許可された型の一つが具体的に含まれていない場合は、理想的には `406 Not Acceptable` レスポンスでリクエストを拒否します。

レスポンスにスクリプトコード (たとえば JavaScript) を含むサービスは、ヘッダーインジェクション攻撃を防ぐために特に注意しなければなりません。

- レスポンス本文の内容に一致する意図した Content-Type ヘッダー、たとえば `application/javascript` ではなく `application/json` を送信していることを確認します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Send safe response content types

It is common for REST services to allow multiple response types (e.g. `application/xml` or `application/json`, and the client specifies the preferred order of response types by the Accept header in the request.

- **Do NOT** simply copy the `Accept` header to the `Content-type` header of the response.
- Reject the request (ideally with a `406 Not Acceptable` response) if the `Accept` header does not specifically contain one of the allowable types.

Services including script code (e.g. JavaScript) in their responses must be especially careful to defend against header injection attack.

- Ensure sending intended content type headers in your response matching your body content e.g. `application/json` and not `application/javascript`.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 管理エンドポイント

- 管理エンドポイントをインターネットに公開しないようにします。
- 管理エンドポイントをインターネットからアクセス可能にする必要がある場合は、多要素認証などの強力な認証メカニズムの使用をユーザーに必須としてください。
- 管理エンドポイントは異なる HTTP ポートまたはホストで公開し、可能であれば異なる NIC と制限されたサブネットで公開します。
- ファイアウォールルールまたはアクセス制御リストを使用して、これらのエンドポイントへのアクセスを制限します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Management endpoints

- Avoid exposing management endpoints via Internet.
- If management endpoints must be accessible via the Internet, make sure that users must use a strong authentication mechanism, e.g. multi-factor.
- Expose management endpoints via different HTTP ports or hosts preferably on a different NIC and restricted subnet.
- Restrict access to these endpoints by firewall rules  or use of access control lists.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## エラー処理

- 一般的なエラーメッセージで応答し、失敗の詳細を不必要に明かさないようにします。
- 技術的な詳細 (たとえばコールスタックやその他の内部的な手がかり) をクライアントに渡してはいけません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Error handling

- Respond with generic error messages - avoid revealing details of the failure unnecessarily.
- Do not pass technical details (e.g. call stacks or other internal hints) to the client.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 監査ログ

- セキュリティ関連イベントの前後に監査ログを書き込みます。
- 攻撃を検出するために、トークン検証エラーをログに記録することを検討します。
- 事前にログデータをサニタイズし、ログインジェクション攻撃に注意します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Audit logs

- Write audit logs before and after security related events.
- Consider logging token validation errors in order to detect attacks.
- Take care of log injection attacks by sanitizing log data beforehand.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## セキュリティヘッダー

ブラウザに特定の動作を指示するため、HTTP レスポンスで返せる[セキュリティ関連ヘッダー](https://owasp.org/www-project-secure-headers/)はいくつかあります。ただし、これらのヘッダーの一部は HTML レスポンスで使用することを意図しているため、HTML を返さない API ではセキュリティ上の利点がほとんど、またはまったくない場合があります。API がブラウザ以外のクライアント (たとえばモバイルアプリ、サーバー間呼び出し、コマンドラインツール) のみによって利用される場合、これらのヘッダーの多くはブラウザ向けの指示であるため効果がない点に注意してください。

ブラウザクライアントによって利用される可能性のあるすべての API レスポンスには、次のヘッダーを含めるべきです。

| ヘッダー | 理由 |
|--------|-----------|
| `Cache-Control: no-store` | ブラウザによるキャッシュを制御するために使用されるヘッダーです。`no-store` を指定すると、そのヘッダーを含むレスポンスを、どの種類のキャッシュ (プライベートまたは共有) も保存すべきではないことを示します。ブラウザは API が呼び出されるたびに最新のレスポンスを取得するため、新しいリクエストを行わなければなりません。`no-store` 値を持つこのヘッダーは、機密情報がキャッシュまたは保存されることを防ぎます。 |
| `Content-Security-Policy: frame-ancestors 'none'` | レスポンスを `<frame>`、`<iframe>`、`<embed>`、`<object>` 要素内にフレーム化できるかを指定するために使用されるヘッダーです。API レスポンスでは、これらの要素内にフレーム化される要件はありません。`frame-ancestors 'none'` を指定すると、API 呼び出しによって返されたレスポンスをどのドメインもフレーム化できなくなります。このヘッダーは、[ドラッグアンドドロップ](https://www.w3.org/Security/wiki/Clickjacking_Threats#Drag_and_drop_attacks)型のクリックジャッキング攻撃から保護します。 |
| `Content-Type` | レスポンスの Content-Type を指定するヘッダーです。API 呼び出しが返すコンテンツの種類に従って指定しなければなりません。指定されていない場合、または誤って指定されている場合、ブラウザはレスポンスの Content-Type を推測しようとする可能性があります。これは MIME sniffing 攻撃につながる可能性があります。API レスポンスが JSON の場合、一般的な Content-Type 値は `application/json` です。 |
| `Strict-Transport-Security` | ドメインには HTTPS のみでアクセスすべきであり、将来 HTTP でアクセスしようとした場合は自動的に HTTPS に変換すべきであることをブラウザに指示するヘッダーです。このヘッダーは API 呼び出しが HTTPS 経由で行われることを保証し、偽装証明書から保護します。 |
| `X-Content-Type-Options: nosniff` | ファイルの内容に基づいて MIME タイプを判断しようとするのではなく、`Content-Type` ヘッダーで宣言された MIME タイプを常に使用するようブラウザに指示するヘッダーです。`nosniff` 値を持つこのヘッダーは、ブラウザが MIME sniffing を行い、レスポンスを不適切に HTML として解釈することを防ぎます。 |
| `X-Frame-Options: DENY` | `Content-Security-Policy: frame-ancestors 'none'` (上記参照) に置き換えられたレガシーヘッダーです。CSP Level 2 をサポートしていない古いブラウザとの互換性のため、依然として推奨されます。`DENY` を指定すると、どのドメインもレスポンスをフレーム化できなくなります。 |

以下のヘッダーは、レスポンスが HTML としてレンダリングされる場合に追加のセキュリティを提供することだけを意図しています。そのため、API がレスポンスで HTML を決して返さない場合、これらのヘッダーは不要かもしれません。しかし、ヘッダーの機能や API が返す (または将来返す可能性がある) 情報の種類に不確実性がある場合は、多層防御の一部として含めることが推奨されます。

| ヘッダー | 例 | 理由 |
|--------|-----------|-----------|
| Content-Security-Policy | `Content-Security-Policy: default-src 'none'` | CSP の機能の大部分は、HTML としてレンダリングされるページにのみ影響します。 |
| Permissions-Policy | `Permissions-Policy: accelerometer=(), ambient-light-sensor=(), autoplay=(), battery=(), camera=(), cross-origin-isolated=(), display-capture=(), document-domain=(), encrypted-media=(), execution-while-not-rendered=(), execution-while-out-of-viewport=(), fullscreen=(), geolocation=(), gyroscope=(), keyboard-map=(), magnetometer=(), microphone=(), midi=(), navigation-override=(), payment=(), picture-in-picture=(), publickey-credentials-get=(), screen-wake-lock=(), sync-xhr=(), usb=(), web-share=(), xr-spatial-tracking=()` | このヘッダーは以前 Feature-Policy と呼ばれていました。ブラウザがこのヘッダーに従う場合、ディレクティブを通じてブラウザ機能を制御するために使用されます。この例では、許可された多数の[ディレクティブ名](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Permissions-Policy#directives)に対して空の許可リストを指定し、機能を無効化します。このヘッダーを適用する場合は、ディレクティブが最新であり、ニーズに合っていることを確認してください。ブラウザ機能を制御する方法の詳細な説明については、この[記事](https://developer.chrome.com/en/docs/privacy-sandbox/permissions-policy)を参照してください。 |
| Referrer-Policy | `Referrer-Policy: no-referrer` | HTML ではないレスポンスは追加リクエストを発生させるべきではありません。 |

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Security Headers

There are a number of [security related headers](https://owasp.org/www-project-secure-headers/) that can be returned in the HTTP responses to instruct browsers to act in specific ways. However, some of these headers are intended to be used with HTML responses, and as such may provide little or no security benefits on an API that does not return HTML. Note that if the API is only consumed by non-browser clients (e.g. mobile apps, server-to-server calls, command-line tools), most of these headers will have no effect since they are directives for browsers.

The following headers should be included in all API responses that may be consumed by browser clients:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## CORS

Cross-Origin Resource Sharing (CORS) は、許可されるクロスドメインリクエストを柔軟に指定するための W3C 標準です。適切な CORS ヘッダーを配信することで、REST API はブラウザに対して、どのドメイン、すなわち origin が REST サービスへ JavaScript 呼び出しを行えるかを通知します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

| Header | Rationale |
|--------|-----------|
| `Cache-Control: no-store` | Header used to direct caching done by browsers. Providing `no-store` indicates that any caches of any kind (private or shared) should not store the response that contains the header. A browser must make a new request everytime the API is called to fetch the latest response. This header with a `no-store` value prevents sensitive information from being cached or stored. |
| `Content-Security-Policy: frame-ancestors 'none'` | Header used to specify whether a response can be framed in a `<frame>`, `<iframe>`, `<embed>` or `<object>` element. For an API response, there is no requirement to be framed in any of those elements. Providing `frame-ancestors 'none'` prevents any domain from framing the response returned by the API call. This header protects against [drag-and-drop](https://www.w3.org/Security/wiki/Clickjacking_Threats#Drag_and_drop_attacks) style clickjacking attacks. |
| `Content-Type` | Header to specify the content type of a response. This must be specified as per the type of content returned by an API call. If not specified or if specified incorrectly, a browser might attempt to guess the content type of the response. This can return in MIME sniffing attacks. One common content type value is `application/json` if the API response is JSON. |
| `Strict-Transport-Security` | Header to instruct a browser that the domain should only be accessed using HTTPS, and that any future attempts to access it using HTTP should automatically be converted to HTTPS. This header ensures that API calls are made over HTTPS and protects against spoofed certificates. |
| `X-Content-Type-Options: nosniff` | Header to instruct a browser to always use the MIME type that is declared in the `Content-Type` header rather than trying to determine the MIME type based on the file's content. This header with a `nosniff` value prevents browsers from performing MIME sniffing, and inappropriately interpreting responses as HTML. |
| `X-Frame-Options: DENY` | Legacy header superseded by `Content-Security-Policy: frame-ancestors 'none'` (see above). Still recommended for compatibility with older browsers that do not support CSP Level 2. Providing `DENY` prevents any domain from framing the response. |

The headers below are only intended to provide additional security when responses are rendered as HTML. As such, if the API will **never** return HTML in responses, then these headers may not be necessary. However, if there is any uncertainty about the function of the headers, or the types of information that the API returns (or may return in future), then it is recommended to include them as part of a defence-in-depth approach.

| Header | Example | Rationale |
|--------|-----------|-----------|
| Content-Security-Policy | `Content-Security-Policy: default-src 'none'` | The majority of CSP functionality only affects pages rendered as HTML. |
| Permissions-Policy | `Permissions-Policy: accelerometer=(), ambient-light-sensor=(), autoplay=(), battery=(), camera=(), cross-origin-isolated=(), display-capture=(), document-domain=(), encrypted-media=(), execution-while-not-rendered=(), execution-while-out-of-viewport=(), fullscreen=(), geolocation=(), gyroscope=(), keyboard-map=(), magnetometer=(), microphone=(), midi=(), navigation-override=(), payment=(), picture-in-picture=(), publickey-credentials-get=(), screen-wake-lock=(), sync-xhr=(), usb=(), web-share=(), xr-spatial-tracking=()` | This header used to be named Feature-Policy. When browsers heed this header, it is used to control browser features via directives. The example disables features with an empty allowlist for a number of permitted [directive names](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Permissions-Policy#directives). When you apply this header, verify that the directives are up-to-date and fit your needs. Please have a look at this [article](https://developer.chrome.com/en/docs/privacy-sandbox/permissions-policy) for a detailed explanation on how to control browser features. |
| Referrer-Policy | `Referrer-Policy: no-referrer` | Non-HTML responses should not trigger additional requests. |

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- クロスドメイン呼び出しがサポートされていない、または想定されていない場合は、CORS ヘッダーを無効化します。
- クロスドメイン呼び出しの origin を設定する際は、可能な限り具体的にし、必要な範囲でのみ一般化します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## CORS

Cross-Origin Resource Sharing (CORS) is a W3C standard to flexibly specify what cross-domain requests are permitted. By delivering appropriate CORS Headers your REST API signals to the browser which domains, AKA origins, are allowed to make JavaScript calls to the REST service.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## HTTP リクエスト内の機密情報

RESTful Web サービスは、認証資格情報の漏えいを防ぐよう注意すべきです。パスワード、セキュリティトークン、API キーは URL に含めるべきではありません。URL は Web サーバーログに記録される可能性があり、その結果として本質的に価値の高い情報になります。

- `POST`/`PUT` リクエストでは、機密データをリクエスト本文またはリクエストヘッダーで転送すべきです。
- `GET` リクエストでは、機密データを HTTP ヘッダーで転送すべきです。

**OK:**

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Disable CORS headers if cross-domain calls are not supported/expected.
- Be as specific as possible and as general as necessary when setting the origins of cross-domain calls.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

`https://example.com/resourceCollection/[ID]/action`

`https://twitter.com/vanderaj/lists`

**NOT OK:**

`https://example.com/controller/123/action?apiKey=a53f435643de32` は、apiKey が URL に含まれているため不適切です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Sensitive information in HTTP requests

RESTful web services should be careful to prevent leaking credentials. Passwords, security tokens, and API keys should not appear in the URL, as this can be captured in web server logs, which makes them intrinsically valuable.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## HTTP リターンコード

HTTP は[ステータスコード](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes)を定義しています。REST API を設計する際は、成功に `200`、エラーに `404` だけを使用するのではなく、常にレスポンスに意味的に適切なステータスコードを使用してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- In `POST`/`PUT` requests sensitive data should be transferred in the request body or request headers.
- In `GET` requests sensitive data should be transferred in an HTTP Header.

**OK:**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

以下は、セキュリティに関連する REST API の**ステータスコード**の非網羅的な抜粋です。正しいコードを返すために活用してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

`https://example.com/resourceCollection/[ID]/action`

`https://twitter.com/vanderaj/lists`

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

| コード | メッセージ | 説明 |
|-------------|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 200 | OK | REST API アクションが成功した場合のレスポンスです。HTTP メソッドは GET、POST、PUT、PATCH、DELETE のいずれかです。 |
| 201 | Created | リクエストが完了し、リソースが作成されました。作成されたリソースの URI は Location ヘッダーで返されます。 |
| 202 | Accepted | リクエストは処理のために受け付けられましたが、処理はまだ完了していません。 |
| 301 | Moved Permanently | 永続的なリダイレクトです。 |
| 304 | Not Modified | クライアントがサーバーと同じリソースのコピーを持っている場合に返される、キャッシュ関連のレスポンスです。 |
| 307 | Temporary Redirect | リソースの一時的なリダイレクトです。 |
| 400 | Bad Request | メッセージ本文の形式エラーなど、リクエストが不正です。 |
| 401 | Unauthorized | 認証 ID/パスワードが誤っている、または提供されていません。 |
| 403 | Forbidden | 認証は成功したものの、認証済みユーザーが要求されたリソースへの権限を持たない場合に使用されます。 |
| 404 | Not Found | 存在しないリソースが要求された場合です。 |
| 405 | Method Not Acceptable | 予期しない HTTP メソッドに対するエラーです。たとえば REST API が HTTP GET を期待しているのに HTTP PUT が使用された場合です。 |
| 406 | Unacceptable | クライアントが Accept ヘッダーで提示した Content-Type がサーバー API でサポートされていません。 |
| 413 | Payload too large | ファイルアップロードなどに関して、リクエストサイズが指定された制限を超えたことを示すために使用します。 |
| 415 | Unsupported Media Type | 要求された Content-Type は REST サービスでサポートされていません。 |
| 429 | Too Many Requests | DoS 攻撃が検出された可能性がある場合、またはレート制限によりリクエストが拒否された場合に使用されるエラーです。 |
| 500 | Internal Server Error | 予期しない状態により、サーバーはリクエストを満たせませんでした。レスポンスは、詳細なエラーメッセージやスタックトレースなど、攻撃者に役立つ内部情報を明かすべきではない点に注意してください。 |
| 501 | Not Implemented | REST サービスは要求された操作をまだ実装していません。 |
| 503 | Service Unavailable | REST サービスは一時的にリクエストを処理できません。後で再試行すべきであることをクライアントへ通知するために使用します。 |

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**NOT OK:**

`https://example.com/controller/123/action?apiKey=a53f435643de32` because the apiKey is in the URL.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

REST API における HTTP リターンコードの使用に関する追加情報は、[こちら](https://www.restapitutorial.com/httpstatuscodes.html)と[こちら](https://restfulapi.net/http-status-codes)にあります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## HTTP Return Code

HTTP defines [status code](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes). When designing REST API, don't just use `200` for success or `404` for error. Always use the semantically appropriate status code for the response.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Here is a non-exhaustive selection of security related REST API **status codes**. Use it to ensure you return the correct code.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

| Code | Message                | Description                                                                                                                                                                                                          |
|-------------|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 200         | OK                     |  Response to a successful REST API action. The HTTP method can be GET, POST, PUT, PATCH or DELETE.                                                                                                                  |
| 201         | Created                |  The request has been fulfilled and resource created. A URI for the created resource is returned in the Location header.                                                                                            |
| 202         | Accepted               | The request has been accepted for processing, but processing is not yet complete.                                                                                                                                     |
| 301         | Moved Permanently       | Permanent redirection.                                                                                                                                                                                                |
| 304         | Not Modified           | Caching related response that returned when the client has the same copy of the resource as the server.                                                                                                                  |
| 307         | Temporary Redirect     | Temporary redirection of resource.                                                                                                                                                                                   |
| 400         | Bad Request            | The request is malformed, such as message body format error.                                                                                                                                                          |
| 401         | Unauthorized           | Wrong or no authentication ID/password provided.                                                                                                                                                                      |
| 403         | Forbidden              |  It's used when the authentication succeeded but authenticated user doesn't have permission to the request resource.                                                                                                |
| 404         | Not Found              | When a non-existent resource is requested.                                                                                                                                                                            |
| 405         | Method Not Acceptable  |  The error for an unexpected HTTP method. For example, the REST API is expecting HTTP GET, but HTTP PUT is used.                                                                                                    |
| 406         | Unacceptable           | The client presented a content type in the Accept header which is not supported by the server API.                                                                                                                    |
| 413         | Payload too large      | Use it to signal that the request size exceeded the given limit e.g. regarding file uploads.                                                                                                                          |
| 415         | Unsupported Media Type | The requested content type is not supported by the REST service.                                                                                                                                                      |
| 429         | Too Many Requests      |  The error is used when there may be DOS attack detected or the request is rejected due to rate limiting.                                                                                                           |
| 500         | Internal Server Error  | An unexpected condition prevented the server from fulfilling the request. Be aware that the response should not reveal internal  information that helps an attacker, e.g. detailed error messages or  stack traces. |
| 501         | Not Implemented        | The REST service does not implement the requested operation yet.                                                                                                                                                      |
| 503         | Service Unavailable    |  The REST service is temporarily unable to process the request. Used to inform the client it should retry at a later time.                                                                                         |

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Additional information about HTTP return code usage in REST API can be found [here](https://www.restapitutorial.com/httpstatuscodes.html) and [here](https://restfulapi.net/http-status-codes).

</div>

</div>

</section>
</div>



## Attribution

<div className="attributionFooter">

- Original: REST Security Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: English original retained for comparison. Japanese translation added. Bilingual display generated from official source and local Japanese translation.
- Retrieved: 2026-05-20

</div>
