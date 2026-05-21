# エラーハンドリングチートシート 日本語訳

## Attribution

- Original: Error Handling Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Error_Handling_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-21

## 日本語訳

# エラーハンドリングチートシート

## はじめに

エラーハンドリングは、アプリケーション全体のセキュリティの一部です。映画の中は別として、攻撃は常に**偵察 (Reconnaissance)** フェーズから始まります。このフェーズで攻撃者は、アプリケーションサーバー、フレームワーク、ライブラリなど、ターゲットに関する技術情報、しばしば*名前*や*バージョン*のプロパティを、できるだけ多く収集しようとします。

未処理エラーは、この初期フェーズで攻撃者を助ける可能性があります。このフェーズは、その後の攻撃全体にとって非常に重要です。

次の[リンク](https://web.archive.org/web/20230929111320/https://cipher.com/blog/a-complete-guide-to-the-phases-of-penetration-testing/)では、攻撃の各フェーズについて説明しています。

## コンテキスト

エラーハンドリングレベルの問題は、ターゲットについて多くの情報を明らかにする可能性があり、ターゲット機能内のインジェクションポイントを特定するためにも使われる可能性があります。

以下は、ユーザーに表示された例外を通じて、ここでは Struts2 と Tomcat のバージョンという技術スタックが開示される例です。

```text
HTTP Status 500 - For input string: "null"

type Exception report

message For input string: "null"

description The server encountered an internal error that prevented it from fulfilling this request.

exception

java.lang.NumberFormatException: For input string: "null"
    java.lang.NumberFormatException.forInputString(NumberFormatException.java:65)
    java.lang.Integer.parseInt(Integer.java:492)
    java.lang.Integer.parseInt(Integer.java:527)
    sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
    sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:57)
    sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
    java.lang.reflect.Method.invoke(Method.java:606)
    com.opensymphony.xwork2.DefaultActionInvocation.invokeAction(DefaultActionInvocation.java:450)
    com.opensymphony.xwork2.DefaultActionInvocation.invokeActionOnly(DefaultActionInvocation.java:289)
    com.opensymphony.xwork2.DefaultActionInvocation.invoke(DefaultActionInvocation.java:252)
    org.apache.struts2.interceptor.debugging.DebuggingInterceptor.intercept(DebuggingInterceptor.java:256)
    com.opensymphony.xwork2.DefaultActionInvocation.invoke(DefaultActionInvocation.java:246)
    ...

note: The full stack trace of the root cause is available in the Apache Tomcat/7.0.56 logs.
```

以下は、サイトのインストールパスとともに SQL クエリエラーが開示される例です。これはインジェクションポイントの特定に使われる可能性があります。

```text
Warning: odbc_fetch_array() expects parameter /1 to be resource, boolean given
in D:\app\index_new.php on line 188
```

[OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/stable/4-Web_Application_Security_Testing/01-Information_Gathering/) では、アプリケーションから技術情報を取得するためのさまざまな手法を説明しています。

## 目的

この記事では、アプリケーションのランタイム設定の一部としてグローバルエラーハンドラを構成する方法を示します。場合によっては、このエラーハンドラをコードの一部として定義する方が効率的なこともあります。目指す結果は、予期しないエラーが発生したときに、アプリケーションが汎用的なレスポンスを返し、調査のためのエラー詳細はサーバー側にログ記録し、ユーザーには返さないようにすることです。

次の図は、目標とするアプローチを示しています。

![Overview](https://cheatsheetseries.owasp.org/assets/Error_Handling_Cheat_Sheet_Overview.png)

最近のアプリケーショントポロジーの多くは*API ベース*であるため、この記事では、バックエンドは REST API のみを公開し、ユーザーインターフェイスコンテンツを含まないものと仮定します。アプリケーションは、考えられるすべての失敗モードをできる限り網羅しようとするべきです。また 5xx エラーは、処理できないリクエストへのレスポンスを示す場合にのみ使用し、実装詳細を明らかにする内容をレスポンスに含めないようにするべきです。そのために、[RFC 7807 - Problem Details for HTTP APIs](https://www.rfc-editor.org/rfc/rfc7807) はドキュメント形式を定義しています。

エラーログ記録処理そのものについては、[ロギングチートシート](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html) を使用するべきです。この記事では、エラーハンドリング部分に焦点を当てます。

## 提案

各技術スタックについて、次の構成オプションを提案します。

### 標準 Java Web アプリケーション

この種のアプリケーションでは、**web.xml** デプロイメント記述子レベルでグローバルエラーハンドラを構成できます。

ここでは、Servlet 仕様の*バージョン 2.5* 以降で使用できる構成を提案します。

この構成では、予期しないエラーが発生すると **error.jsp** ページへリダイレクトされます。このページでエラーがトレースされ、汎用的なレスポンスが返されます。

**web.xml** ファイル内でのリダイレクト構成:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ns="http://java.sun.com/xml/ns/javaee"
xsi:schemaLocation="http://java.sun.com/xml/ns/javaee http://java.sun.com/xml/ns/javaee/web-app_3_0.xsd"
version="3.0">
...
    <error-page>
        <exception-type>java.lang.Exception</exception-type>
        <location>/error.jsp</location>
    </error-page>
...
</web-app>
```

**error.jsp** ファイルの内容:

```java
<%@ page language="java" isErrorPage="true" contentType="application/json; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%
String errorMessage = exception.getMessage();
//Log the exception via the content of the implicit variable named "exception"
//...
//We build a generic response with a JSON format because we are in a REST API app context
//We also add an HTTP response header to indicate to the client app that the response is an error
response.setHeader("X-ERROR", "true");
//Note that we're using an internal server error response
//In some cases it may be prudent to return 4xx error codes, when we have misbehaving clients
response.setStatus(500);
%>
{"message":"An error occur, please retry"}
```

### Java SpringMVC/SpringBoot Web アプリケーション

[SpringMVC](https://docs.spring.io/spring/docs/current/spring-framework-reference/web.html) または [SpringBoot](https://spring.io/projects/spring-boot) では、プロジェクト内に次のクラスを実装することで、グローバルエラーハンドラを定義できます。Spring Framework 6 では、[RFC 7807 に基づく problem details](https://github.com/spring-projects/spring-framework/issues/27052) が導入されました。

アプリケーションによって *java.lang.Exception* クラスを継承する任意の例外がスローされたときに動作するよう、[@ExceptionHandler](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/bind/annotation/ExceptionHandler.html) アノテーションを通じてハンドラに指示します。また、レスポンスオブジェクトを作成するために [ProblemDetail クラス](https://docs.spring.io/spring-framework/docs/6.0.0/javadoc-api/org/springframework/http/ProblemDetail.html) も使用します。

```java
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

/**
 * Global error handler in charge of returning a generic response in case of unexpected error situation.
 */
@RestControllerAdvice
public class RestResponseEntityExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(value = {Exception.class})
    public ProblemDetail handleGlobalError(RuntimeException exception, WebRequest request) {
        //Log the exception via the content of the parameter named "exception"
        //...
        //Note that we're using an internal server error response
        //In some cases it may be prudent to return 4xx error codes, if we have misbehaving clients
        //By specification, the content-type can be "application/problem+json" or "application/problem+xml"
        return ProblemDetail.forStatusAndDetail(HttpStatus.INTERNAL_SERVER_ERROR, "An error occur, please retry");
    }
}
```

References:

- [Exception handling with Spring](https://www.baeldung.com/exception-handling-for-rest-with-spring)
- [Exception handling with SpringBoot](https://www.toptal.com/java/spring-boot-rest-api-error-handling)

### ASP NET Core Web アプリケーション

[ASP.NET Core](https://docs.microsoft.com/en-us/aspnet/core/?view=aspnetcore-2.2) では、例外ハンドラが専用 API Controller であることを示すことで、グローバルエラーハンドラを定義できます。

エラーハンドリング専用 API Controller の内容:

```csharp
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Net;

namespace MyProject.Controllers
{
    /// <summary>
    /// API Controller used to intercept and handle all unexpected exception
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class ErrorController : ControllerBase
    {
        /// <summary>
        /// Action that will be invoked for any call to this Controller in order to handle the current error
        /// </summary>
        /// <returns>A generic error formatted as JSON because we are in a REST API app context</returns>
        [HttpGet]
        [HttpPost]
        [HttpHead]
        [HttpDelete]
        [HttpPut]
        [HttpOptions]
        [HttpPatch]
        public JsonResult Handle()
        {
            //Get the exception that has implied the call to this controller
            Exception exception = HttpContext.Features.Get<IExceptionHandlerFeature>()?.Error;
            //Log the exception via the content of the variable named "exception" if it is not NULL
            //...
            //We build a generic response with a JSON format because we are in a REST API app context
            //We also add an HTTP response header to indicate to the client app that the response
            //is an error
            var responseBody = new Dictionary<String, String>{ {
                "message", "An error occur, please retry"
            } };
            JsonResult response = new JsonResult(responseBody);
            //Note that we're using an internal server error response
            //In some cases it may be prudent to return 4xx error codes, if we have misbehaving clients
            response.StatusCode = (int)HttpStatusCode.InternalServerError;
            Request.HttpContext.Response.Headers.Remove("X-ERROR");
            Request.HttpContext.Response.Headers.Add("X-ERROR", "true");
            return response;
        }
    }
}
```

専用エラーハンドリング API Controller へ例外ハンドラをマッピングする、アプリケーションの **Startup.cs** ファイル内の定義:

```csharp
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace MyProject
{
    public class Startup
    {
...
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            //First we configure the error handler middleware!
            //We enable the global error handler in others environments than DEV
            //because debug page are useful during implementation
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                //Our global handler is defined on "/api/error" URL so we indicate to the
                //exception handler to call this API controller
                //on any unexpected exception raised by the application
                app.UseExceptionHandler("/api/error");

                //To customize the response content type and text, use the overload of
                //UseStatusCodePages that takes a content type and format string.
                app.UseStatusCodePages("text/plain", "Status code page, status code: {0}");
            }

            //We configure others middlewares, remember that the declaration order is important...
            app.UseMvc();
            //...
        }
    }
}
```

References:

- [Exception handling with ASP.Net Core](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/error-handling?view=aspnetcore-2.1)

### ASP NET Web API Web アプリケーション

[ASP.NET Web API](https://www.asp.net/web-api) では、標準 .NET Framework 由来であり .NET Core Framework 由来ではないものとして、アプリケーションで発生するあらゆるエラーをトレースし処理するために、ハンドラを定義して登録できます。

エラー詳細をトレースするためのハンドラ定義:

```csharp
using System;
using System.Web.Http.ExceptionHandling;

namespace MyProject.Security
{
    /// <summary>
    /// Global logger used to trace any error that occurs at application wide level
    /// </summary>
    public class GlobalErrorLogger : ExceptionLogger
    {
        /// <summary>
        /// Method in charge of the management of the error from a tracing point of view
        /// </summary>
        /// <param name="context">Context containing the error details</param>
        public override void Log(ExceptionLoggerContext context)
        {
            //Get the exception
            Exception exception = context.Exception;
            //Log the exception via the content of the variable named "exception" if it is not NULL
            //...
        }
    }
}
```

汎用レスポンスを返すためにエラーを管理するハンドラ定義:

```csharp
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.ExceptionHandling;

namespace MyProject.Security
{
    /// <summary>
    /// Global handler used to handle any error that occurs at application wide level
    /// </summary>
    public class GlobalErrorHandler : ExceptionHandler
    {
        /// <summary>
        /// Method in charge of handle the generic response send in case of error
        /// </summary>
        /// <param name="context">Error context</param>
        public override void Handle(ExceptionHandlerContext context)
        {
            context.Result = new GenericResult();
        }

        /// <summary>
        /// Class used to represent the generic response send
        /// </summary>
        private class GenericResult : IHttpActionResult
        {
            /// <summary>
            /// Method in charge of creating the generic response
            /// </summary>
            /// <param name="cancellationToken">Object to cancel the task</param>
            /// <returns>A task in charge of sending the generic response</returns>
            public Task<HttpResponseMessage> ExecuteAsync(CancellationToken cancellationToken)
            {
                //We build a generic response with a JSON format because we are in a REST API app context
                //We also add an HTTP response header to indicate to the client app that the response
                //is an error
                var responseBody = new Dictionary<String, String>{ {
                    "message", "An error occur, please retry"
                } };
                // Note that we're using an internal server error response
                // In some cases it may be prudent to return 4xx error codes, if we have misbehaving clients
                HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.InternalServerError);
                response.Headers.Add("X-ERROR", "true");
                response.Content = new StringContent(JsonConvert.SerializeObject(responseBody),
                                                     Encoding.UTF8, "application/json");
                return Task.FromResult(response);
            }
        }
    }
}
```

アプリケーションの **WebApiConfig.cs** ファイル内での両方のハンドラ登録:

```csharp
using MyProject.Security;
using System.Web.Http;
using System.Web.Http.ExceptionHandling;

namespace MyProject
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            //Register global error logging and handling handlers in first
            config.Services.Replace(typeof(IExceptionLogger), new GlobalErrorLogger());
            config.Services.Replace(typeof(IExceptionHandler), new GlobalErrorHandler());
            //Rest of the configuration
            //...
        }
    }
}
```

**Web.config** ファイルの ```csharp <system.web>``` ノード内に、次のように customErrors セクションを設定します。

```csharp
<configuration>
    ...
    <system.web>
        <customErrors mode="RemoteOnly"
                      defaultRedirect="~/ErrorPages/Oops.aspx" />
        ...
    </system.web>
</configuration>
```

References:

- [Exception handling with ASP.Net Web API](https://exceptionnotfound.net/the-asp-net-web-api-exception-handling-pipeline-a-guided-tour/)

- [ASP.NET Error Handling](https://docs.microsoft.com/en-us/aspnet/web-forms/overview/getting-started/getting-started-with-aspnet-45-web-forms/aspnet-error-handling)

## プロトタイプのソース

使用する適切な設定を見つけるために作成されたすべてのサンドボックスプロジェクトのソースコードは、この [GitHub リポジトリ](https://github.com/righettod/poc-error-handling) に保存されています。

## 付録 HTTP エラー

HTTP エラーのリファレンスは、こちら [RFC 2616](https://www.ietf.org/rfc/rfc2616.txt) にあります。実装詳細を提供しないエラーメッセージを使用することは、情報漏えいを避けるために重要です。一般に、HTTP クライアント側のエラーに起因するリクエスト、たとえば未認可アクセスや大きすぎるリクエストボディには 4xx エラーコードを使用することを検討し、予期しないバグによってサーバー側で引き起こされたエラーを示すには 5xx を使用します。アプリケーションが 5xx エラーについて監視されていることを確認してください。5xx エラーは、特定の入力集合に対してアプリケーションが失敗していることを示す良い指標です。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V16.5 Error Handling | 汎用エラー応答、詳細情報のサーバー側ログ記録、技術情報漏えい防止 |
| V16.2 General Logging | エラー詳細の安全なログ記録、調査可能性の確保 |
