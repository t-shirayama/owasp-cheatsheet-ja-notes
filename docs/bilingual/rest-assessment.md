---
title: REST Assessment Cheat Sheet
hide_title: true
---

<div className="docHero" data-category="asvs-v4">
  <h1>REST 評価チートシート</h1>
  <div className="docMeta">
    <span className="docPill">最終更新: 2026-05-20</span>
    <span className="docPill">読了時間: 準備中</span>
    <span className="docPill">カテゴリ: API と Web サービス</span>
  </div>
</div>

<p className="docLead">REST 評価チートシートを、原文・翻訳・対比表示で確認できます。ASVS Index 対応の文脈で、公式原文と日本語訳を確認しやすく整理しています。</p>

<div className="tabbedContent">
  <input className="tabInput" type="radio" name="rest-assessment-view" id="rest-assessment-original" />
  <input className="tabInput" type="radio" name="rest-assessment-view" id="rest-assessment-translation" defaultChecked />
  <input className="tabInput" type="radio" name="rest-assessment-view" id="rest-assessment-bilingual" />

  <div className="contentTabs">
    <label htmlFor="rest-assessment-original" title="OWASP 原文">原文</label>
    <label htmlFor="rest-assessment-translation" title="日本語訳">翻訳</label>
    <label htmlFor="rest-assessment-bilingual" title="原文と翻訳を並べて確認">対比表示</label>
  </div>

<section id="rest-assessment-original-panel" className="tabPanel originalPanel contentPanel">

## About RESTful Web Services

Web Services are an implementation of web technology used for machine to machine communication. As such they are used for Inter application communication, Web 2.0 and Mashups and by desktop and mobile applications to call a server.

RESTful web services (often called simply REST) are a light weight variant of Web Services based on the RESTful design pattern. In practice RESTful web services utilizes HTTP requests that are similar to regular HTTP calls in contrast with other Web Services technologies such as SOAP which utilizes a complex protocol.

## Key relevant properties of RESTful web services

- Use of HTTP methods (`GET`, `POST`, `PUT` and `DELETE`) as the primary verb for the requested operation.
- Non-standard parameters specifications:
    - As part of the URL.
    - In headers.
- Structured parameters and responses using JSON or XML in a parameter values, request body or response body. Those are required to communicate machine useful information.
- Custom authentication and session management, often utilizing custom security tokens: this is needed as machine to machine communication does not allow for login sequences.
- Lack of formal documentation. A [proposed standard for describing RESTful web services called WADL](http://www.w3.org/Submission/wadl/) was submitted by Sun Microsystems but was never officially adapted.

## The challenge of security testing RESTful web services

- Inspecting the application does not reveal the attack surface, I.e. the URLs and parameter structure used by the RESTful web service. The reasons are:
    - No application utilizes all the available functions and parameters exposed by the service
    - Those used are often activated dynamically by client side code and not as links in pages.
    - The client application is often not a web application and does not allow inspection of the activating link or even relevant code.
- The parameters are non-standard making it hard to determine what is just part of the URL or a constant header and what is a parameter worth [fuzzing](https://owasp.org/www-community/Fuzzing).
- As a machine interface the number of parameters used can be very large, for example a JSON structure may include dozens of parameters. [fuzzing](https://owasp.org/www-community/Fuzzing) each one significantly lengthen the time required for testing.
- Custom authentication mechanisms require reverse engineering and make popular tools not useful as they cannot track a login session.

## How to pentest a RESTful web service

Determine the attack surface through documentation - RESTful pen testing might be better off if some level of clear-box testing is allowed and you can get information about the service.

This information will ensure fuller coverage of the attack surface. Such information to look for:

- Formal service description - While for other types of web services such as SOAP a formal description, usually in WSDL is often available, this is seldom the case for REST. That said, either WSDL 2.0 or WADL can describe REST and are sometimes used.
- A developer guide for using the service may be less detailed but will commonly be found, and might even be considered *opaque-box* testing.
- Application source or configuration - in many frameworks, including dotNet ,the REST service definition might be easily obtained from configuration files rather than from code.

Collect full requests using a [proxy](https://www.zaproxy.org/) - while always an important pen testing step, this is more important for REST based applications as the application UI may not give clues on the actual attack surface.

Note that the proxy must be able to collect full requests and not just URLs as REST services utilize more than just GET parameters.

Analyze collected requests to determine the attack surface:

- Look for non-standard parameters:
    - Look for abnormal HTTP headers - those would many times be header based parameters.
    - Determine if a URL segment has a repeating pattern across URLs. Such patterns can include a date, a number or an ID like string and indicate that the URL segment is a URL embedded parameter.
        - For example: `http://server/srv/2013-10-21/use.php`
    - Look for structured parameter values - those may be JSON, XML or a non-standard structure.
    - If the last element of a URL does not have an extension, it may be a parameter. This is especially true if the application technology normally uses extensions or if a previous segment does have an extension.
        - For example: `http://server/svc/Grid.asmx/GetRelatedListItems`
    - Look for highly varying URL segments - a single URL segment that has many values may be parameter and not a physical directory.
        - For example if the URL `http://server/src/XXXX/page` repeats with hundreds of value for `XXXX`, chances `XXXX` is a parameter.

Verify non-standard parameters: in some cases (but not all), setting the value of a URL segment suspected of being a parameter to a value expected to be invalid can help determine if it is a path elements of a parameter. If a path element, the web server will return a *404* message, while for an invalid value to a parameter the answer would be an application level message as the value is legal at the web server level.

Analyzing collected requests to optimize [fuzzing](https://owasp.org/www-community/Fuzzing) - after identifying potential parameters to fuzz, analyze the collected values for each to determine:

- Valid vs. invalid values, so that [fuzzing](https://owasp.org/www-community/Fuzzing) can focus on marginal invalid values.
    - For example sending *0* for a value found to be always a positive integer.
- Sequences allowing to fuzz beyond the range presumably allocated to the current user.

Lastly, when [fuzzing](https://owasp.org/www-community/Fuzzing), don't forget to emulate the authentication mechanism used.

## Related Resources

- [REST Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html) - the other side of this cheat sheet
- [YouTube: RESTful services, web security blind spot](https://www.youtube.com/watch?v=pWq4qGLAZHI) - a video presentation elaborating on most of the topics on this cheat sheet.

</section>

<section id="rest-assessment-translation-panel" className="tabPanel translationPanel contentPanel">

## About RESTful Web Services

Web サービスは、マシン間通信に使われる Web 技術の実装です。そのため、アプリケーション間通信、Web 2.0、マッシュアップ、デスクトップアプリケーションやモバイルアプリケーションからサーバーを呼び出す用途に使われます。

RESTful Web サービス（しばしば単に REST と呼ばれます）は、RESTful 設計パターンに基づく軽量な Web サービスの一種です。実際には、RESTful Web サービスは通常の HTTP 呼び出しに似た HTTP リクエストを使用します。これは、複雑なプロトコルを使用する SOAP など他の Web サービス技術とは対照的です。

## Key relevant properties of RESTful web services

- 要求された操作の主な動詞として、HTTP メソッド（`GET`、`POST`、`PUT`、`DELETE`）を使用します。
- 標準的ではないパラメータ指定:
    - URL の一部として指定されます。
    - ヘッダー内で指定されます。
- パラメータ値、リクエストボディ、またはレスポンスボディで、JSON や XML を使った構造化パラメータとレスポンスを使用します。これは、機械が利用できる情報を伝達するために必要です。
- カスタム認証とセッション管理を使用し、多くの場合はカスタムセキュリティトークンを利用します。これは、マシン間通信ではログインシーケンスを許容しないため必要になります。
- 公式なドキュメントが不足しがちです。RESTful Web サービスを記述するための提案標準である [WADL](http://www.w3.org/Submission/wadl/) は Sun Microsystems によって提出されましたが、正式には採用されませんでした。

## The challenge of security testing RESTful web services

- アプリケーションを調査しても、RESTful Web サービスで使われる URL やパラメータ構造などの攻撃対象領域が明らかにならないことがあります。その理由は次のとおりです。
    - どのアプリケーションも、サービスが公開するすべての機能とパラメータを使用するわけではありません。
    - 使用される機能は、ページ内のリンクではなくクライアント側コードによって動的に有効化されることがよくあります。
    - クライアントアプリケーションが Web アプリケーションではないことが多く、起動リンクや関連コードを検査できない場合があります。
- パラメータが標準的ではないため、何が URL の一部または固定ヘッダーであり、何が [fuzzing](https://owasp.org/www-community/Fuzzing) すべきパラメータであるかを判断しにくくなります。
- マシンインターフェースとして、使用されるパラメータ数は非常に多くなることがあります。たとえば、JSON 構造に数十個のパラメータが含まれる場合があります。それぞれを [fuzzing](https://owasp.org/www-community/Fuzzing) すると、テストに必要な時間が大幅に長くなります。
- カスタム認証メカニズムはリバースエンジニアリングを必要とし、一般的なツールはログインセッションを追跡できないため有用でなくなることがあります。

## How to pentest a RESTful web service

ドキュメントを通じて攻撃対象領域を判断します。RESTful のペネトレーションテストでは、ある程度のクリアボックステストが許可され、サービスに関する情報を得られる方がうまく進む場合があります。

この情報により、攻撃対象領域をより完全にカバーできます。探すべき情報は次のとおりです。

- 公式なサービス記述。他の種類の Web サービス、たとえば SOAP では通常 WSDL による公式な記述が利用できることが多い一方で、REST ではまれです。ただし、WSDL 2.0 または WADL が REST を記述でき、使用される場合もあります。
- サービス利用のための開発者ガイド。詳細度は低いかもしれませんが、一般的に見つかることが多く、opaque-box テストと見なせる場合もあります。
- アプリケーションのソースまたは設定。dotNet を含む多くのフレームワークでは、REST サービス定義をコードではなく設定ファイルから容易に取得できる場合があります。

[プロキシ](https://www.zaproxy.org/) を使って完全なリクエストを収集します。これはペネトレーションテストで常に重要な手順ですが、REST ベースのアプリケーションでは、アプリケーション UI が実際の攻撃対象領域の手がかりを与えないことがあるため、より重要です。

REST サービスは GET パラメータ以外も利用するため、プロキシは URL だけでなく完全なリクエストを収集できなければならない点に注意してください。

収集したリクエストを分析し、攻撃対象領域を判断します。

- 標準的ではないパラメータを探します。
    - 異常な HTTP ヘッダーを探します。多くの場合、それらはヘッダーベースのパラメータです。
    - URL セグメントが URL 間で繰り返しパターンを持つかを判断します。そのようなパターンには、日付、数値、ID のような文字列が含まれることがあり、その URL セグメントが URL 埋め込みパラメータであることを示します。
        - 例: `http://server/srv/2013-10-21/use.php`
    - 構造化されたパラメータ値を探します。それらは JSON、XML、または標準的ではない構造である可能性があります。
    - URL の最後の要素に拡張子がない場合、それはパラメータである可能性があります。アプリケーション技術が通常は拡張子を使う場合、または前のセグメントに拡張子がある場合は特にそうです。
        - 例: `http://server/svc/Grid.asmx/GetRelatedListItems`
    - 大きく変化する URL セグメントを探します。多数の値を持つ単一の URL セグメントは、物理ディレクトリではなくパラメータである可能性があります。
        - たとえば URL `http://server/src/XXXX/page` が `XXXX` に数百の値を持って繰り返される場合、`XXXX` はパラメータである可能性が高いです。

標準的ではないパラメータを検証します。すべての場合ではありませんが、パラメータと疑われる URL セグメントの値を無効であることが期待される値に設定すると、それがパス要素なのかパラメータなのかを判断しやすくなることがあります。パス要素であれば Web サーバーは *404* メッセージを返します。一方、パラメータへの無効値であれば、その値は Web サーバーレベルでは妥当なため、アプリケーションレベルのメッセージが返されます。

[fuzzing](https://owasp.org/www-community/Fuzzing) を最適化するために収集リクエストを分析します。fuzzing 対象になり得るパラメータを特定した後、それぞれの収集値を分析して次を判断します。

- 有効値と無効値。[fuzzing](https://owasp.org/www-community/Fuzzing) が境界付近の無効値に集中できるようにします。
    - たとえば、常に正の整数であることが分かっている値に対して *0* を送信します。
- 現在のユーザーに割り当てられていると推定される範囲を超えて fuzzing できるシーケンス。

最後に、[fuzzing](https://owasp.org/www-community/Fuzzing) を行う際には、使用されている認証メカニズムをエミュレートすることを忘れないでください。

## Related Resources

- [REST Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html) - このチートシートのもう一方の側面
- [YouTube: RESTful services, web security blind spot](https://www.youtube.com/watch?v=pWq4qGLAZHI) - このチートシートのほとんどのトピックを詳しく説明する動画プレゼンテーション

</section>

<section id="rest-assessment-bilingual-panel" className="tabPanel bilingualPanel">

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## About RESTful Web Services

Web Services are an implementation of web technology used for machine to machine communication. As such they are used for Inter application communication, Web 2.0 and Mashups and by desktop and mobile applications to call a server.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## About RESTful Web Services

Web サービスは、マシン間通信に使われる Web 技術の実装です。そのため、アプリケーション間通信、Web 2.0、マッシュアップ、デスクトップアプリケーションやモバイルアプリケーションからサーバーを呼び出す用途に使われます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

RESTful web services (often called simply REST) are a light weight variant of Web Services based on the RESTful design pattern. In practice RESTful web services utilizes HTTP requests that are similar to regular HTTP calls in contrast with other Web Services technologies such as SOAP which utilizes a complex protocol.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

RESTful Web サービス（しばしば単に REST と呼ばれます）は、RESTful 設計パターンに基づく軽量な Web サービスの一種です。実際には、RESTful Web サービスは通常の HTTP 呼び出しに似た HTTP リクエストを使用します。これは、複雑なプロトコルを使用する SOAP など他の Web サービス技術とは対照的です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Key relevant properties of RESTful web services

- Use of HTTP methods (`GET`, `POST`, `PUT` and `DELETE`) as the primary verb for the requested operation.
- Non-standard parameters specifications:
    - As part of the URL.
    - In headers.
- Structured parameters and responses using JSON or XML in a parameter values, request body or response body. Those are required to communicate machine useful information.
- Custom authentication and session management, often utilizing custom security tokens: this is needed as machine to machine communication does not allow for login sequences.
- Lack of formal documentation. A [proposed standard for describing RESTful web services called WADL](http://www.w3.org/Submission/wadl/) was submitted by Sun Microsystems but was never officially adapted.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## Key relevant properties of RESTful web services

- 要求された操作の主な動詞として、HTTP メソッド（`GET`、`POST`、`PUT`、`DELETE`）を使用します。
- 標準的ではないパラメータ指定:
    - URL の一部として指定されます。
    - ヘッダー内で指定されます。
- パラメータ値、リクエストボディ、またはレスポンスボディで、JSON や XML を使った構造化パラメータとレスポンスを使用します。これは、機械が利用できる情報を伝達するために必要です。
- カスタム認証とセッション管理を使用し、多くの場合はカスタムセキュリティトークンを利用します。これは、マシン間通信ではログインシーケンスを許容しないため必要になります。
- 公式なドキュメントが不足しがちです。RESTful Web サービスを記述するための提案標準である [WADL](http://www.w3.org/Submission/wadl/) は Sun Microsystems によって提出されましたが、正式には採用されませんでした。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## The challenge of security testing RESTful web services

- Inspecting the application does not reveal the attack surface, I.e. the URLs and parameter structure used by the RESTful web service. The reasons are:
    - No application utilizes all the available functions and parameters exposed by the service
    - Those used are often activated dynamically by client side code and not as links in pages.
    - The client application is often not a web application and does not allow inspection of the activating link or even relevant code.
- The parameters are non-standard making it hard to determine what is just part of the URL or a constant header and what is a parameter worth [fuzzing](https://owasp.org/www-community/Fuzzing).
- As a machine interface the number of parameters used can be very large, for example a JSON structure may include dozens of parameters. [fuzzing](https://owasp.org/www-community/Fuzzing) each one significantly lengthen the time required for testing.
- Custom authentication mechanisms require reverse engineering and make popular tools not useful as they cannot track a login session.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## The challenge of security testing RESTful web services

- アプリケーションを調査しても、RESTful Web サービスで使われる URL やパラメータ構造などの攻撃対象領域が明らかにならないことがあります。その理由は次のとおりです。
    - どのアプリケーションも、サービスが公開するすべての機能とパラメータを使用するわけではありません。
    - 使用される機能は、ページ内のリンクではなくクライアント側コードによって動的に有効化されることがよくあります。
    - クライアントアプリケーションが Web アプリケーションではないことが多く、起動リンクや関連コードを検査できない場合があります。
- パラメータが標準的ではないため、何が URL の一部または固定ヘッダーであり、何が [fuzzing](https://owasp.org/www-community/Fuzzing) すべきパラメータであるかを判断しにくくなります。
- マシンインターフェースとして、使用されるパラメータ数は非常に多くなることがあります。たとえば、JSON 構造に数十個のパラメータが含まれる場合があります。それぞれを [fuzzing](https://owasp.org/www-community/Fuzzing) すると、テストに必要な時間が大幅に長くなります。
- カスタム認証メカニズムはリバースエンジニアリングを必要とし、一般的なツールはログインセッションを追跡できないため有用でなくなることがあります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## How to pentest a RESTful web service

Determine the attack surface through documentation - RESTful pen testing might be better off if some level of clear-box testing is allowed and you can get information about the service.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## How to pentest a RESTful web service

ドキュメントを通じて攻撃対象領域を判断します。RESTful のペネトレーションテストでは、ある程度のクリアボックステストが許可され、サービスに関する情報を得られる方がうまく進む場合があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

This information will ensure fuller coverage of the attack surface. Such information to look for:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

この情報により、攻撃対象領域をより完全にカバーできます。探すべき情報は次のとおりです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Formal service description - While for other types of web services such as SOAP a formal description, usually in WSDL is often available, this is seldom the case for REST. That said, either WSDL 2.0 or WADL can describe REST and are sometimes used.
- A developer guide for using the service may be less detailed but will commonly be found, and might even be considered *opaque-box* testing.
- Application source or configuration - in many frameworks, including dotNet ,the REST service definition might be easily obtained from configuration files rather than from code.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- 公式なサービス記述。他の種類の Web サービス、たとえば SOAP では通常 WSDL による公式な記述が利用できることが多い一方で、REST ではまれです。ただし、WSDL 2.0 または WADL が REST を記述でき、使用される場合もあります。
- サービス利用のための開発者ガイド。詳細度は低いかもしれませんが、一般的に見つかることが多く、opaque-box テストと見なせる場合もあります。
- アプリケーションのソースまたは設定。dotNet を含む多くのフレームワークでは、REST サービス定義をコードではなく設定ファイルから容易に取得できる場合があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Collect full requests using a [proxy](https://www.zaproxy.org/) - while always an important pen testing step, this is more important for REST based applications as the application UI may not give clues on the actual attack surface.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

[プロキシ](https://www.zaproxy.org/) を使って完全なリクエストを収集します。これはペネトレーションテストで常に重要な手順ですが、REST ベースのアプリケーションでは、アプリケーション UI が実際の攻撃対象領域の手がかりを与えないことがあるため、より重要です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Note that the proxy must be able to collect full requests and not just URLs as REST services utilize more than just GET parameters.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

REST サービスは GET パラメータ以外も利用するため、プロキシは URL だけでなく完全なリクエストを収集できなければならない点に注意してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Analyze collected requests to determine the attack surface:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

収集したリクエストを分析し、攻撃対象領域を判断します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Look for non-standard parameters:
    - Look for abnormal HTTP headers - those would many times be header based parameters.
    - Determine if a URL segment has a repeating pattern across URLs. Such patterns can include a date, a number or an ID like string and indicate that the URL segment is a URL embedded parameter.
        - For example: `http://server/srv/2013-10-21/use.php`
    - Look for structured parameter values - those may be JSON, XML or a non-standard structure.
    - If the last element of a URL does not have an extension, it may be a parameter. This is especially true if the application technology normally uses extensions or if a previous segment does have an extension.
        - For example: `http://server/svc/Grid.asmx/GetRelatedListItems`
    - Look for highly varying URL segments - a single URL segment that has many values may be parameter and not a physical directory.
        - For example if the URL `http://server/src/XXXX/page` repeats with hundreds of value for `XXXX`, chances `XXXX` is a parameter.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- 標準的ではないパラメータを探します。
    - 異常な HTTP ヘッダーを探します。多くの場合、それらはヘッダーベースのパラメータです。
    - URL セグメントが URL 間で繰り返しパターンを持つかを判断します。そのようなパターンには、日付、数値、ID のような文字列が含まれることがあり、その URL セグメントが URL 埋め込みパラメータであることを示します。
        - 例: `http://server/srv/2013-10-21/use.php`
    - 構造化されたパラメータ値を探します。それらは JSON、XML、または標準的ではない構造である可能性があります。
    - URL の最後の要素に拡張子がない場合、それはパラメータである可能性があります。アプリケーション技術が通常は拡張子を使う場合、または前のセグメントに拡張子がある場合は特にそうです。
        - 例: `http://server/svc/Grid.asmx/GetRelatedListItems`
    - 大きく変化する URL セグメントを探します。多数の値を持つ単一の URL セグメントは、物理ディレクトリではなくパラメータである可能性があります。
        - たとえば URL `http://server/src/XXXX/page` が `XXXX` に数百の値を持って繰り返される場合、`XXXX` はパラメータである可能性が高いです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Verify non-standard parameters: in some cases (but not all), setting the value of a URL segment suspected of being a parameter to a value expected to be invalid can help determine if it is a path elements of a parameter. If a path element, the web server will return a *404* message, while for an invalid value to a parameter the answer would be an application level message as the value is legal at the web server level.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

標準的ではないパラメータを検証します。すべての場合ではありませんが、パラメータと疑われる URL セグメントの値を無効であることが期待される値に設定すると、それがパス要素なのかパラメータなのかを判断しやすくなることがあります。パス要素であれば Web サーバーは *404* メッセージを返します。一方、パラメータへの無効値であれば、その値は Web サーバーレベルでは妥当なため、アプリケーションレベルのメッセージが返されます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Analyzing collected requests to optimize [fuzzing](https://owasp.org/www-community/Fuzzing) - after identifying potential parameters to fuzz, analyze the collected values for each to determine:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

[fuzzing](https://owasp.org/www-community/Fuzzing) を最適化するために収集リクエストを分析します。fuzzing 対象になり得るパラメータを特定した後、それぞれの収集値を分析して次を判断します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Valid vs. invalid values, so that [fuzzing](https://owasp.org/www-community/Fuzzing) can focus on marginal invalid values.
    - For example sending *0* for a value found to be always a positive integer.
- Sequences allowing to fuzz beyond the range presumably allocated to the current user.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- 有効値と無効値。[fuzzing](https://owasp.org/www-community/Fuzzing) が境界付近の無効値に集中できるようにします。
    - たとえば、常に正の整数であることが分かっている値に対して *0* を送信します。
- 現在のユーザーに割り当てられていると推定される範囲を超えて fuzzing できるシーケンス。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Lastly, when [fuzzing](https://owasp.org/www-community/Fuzzing), don't forget to emulate the authentication mechanism used.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

最後に、[fuzzing](https://owasp.org/www-community/Fuzzing) を行う際には、使用されている認証メカニズムをエミュレートすることを忘れないでください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Related Resources

- [REST Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html) - the other side of this cheat sheet
- [YouTube: RESTful services, web security blind spot](https://www.youtube.com/watch?v=pWq4qGLAZHI) - a video presentation elaborating on most of the topics on this cheat sheet.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## Related Resources

- [REST Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html) - このチートシートのもう一方の側面
- [YouTube: RESTful services, web security blind spot](https://www.youtube.com/watch?v=pWq4qGLAZHI) - このチートシートのほとんどのトピックを詳しく説明する動画プレゼンテーション

</div>
</div>

</section>
</div>



## Attribution

<div className="attributionFooter">

- Original: REST Assessment Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/REST_Assessment_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: English original retained for comparison. Japanese translation added. Bilingual display generated from official source and local Japanese translation.
- Retrieved: 2026-05-20

</div>
