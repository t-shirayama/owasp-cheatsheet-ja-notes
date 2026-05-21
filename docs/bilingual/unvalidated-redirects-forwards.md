---
title: Unvalidated Redirects and Forwards Cheat Sheet
hide_title: true
---

<div className="docHero" data-category="asvs-v15">
  <h1>未検証リダイレクトとフォワードチートシート</h1>
  <div className="docMeta">
    <span className="docPill">最終更新: 2026-05-20</span>
    <span className="docPill">読了時間: 準備中</span>
    <span className="docPill">カテゴリ: Web フロントエンドセキュリティ</span>
  </div>
</div>

<p className="docLead">未検証リダイレクトとフォワードチートシートを、原文・翻訳・対比表示で確認できます。ASVS Index 対応の文脈で、公式原文と日本語訳を確認しやすく整理しています。</p>

<div className="tabbedContent">
  <input className="tabInput" type="radio" name="unvalidated-redirects-forwards-view" id="unvalidated-redirects-forwards-original" />
  <input className="tabInput" type="radio" name="unvalidated-redirects-forwards-view" id="unvalidated-redirects-forwards-translation" defaultChecked />
  <input className="tabInput" type="radio" name="unvalidated-redirects-forwards-view" id="unvalidated-redirects-forwards-bilingual" />

  <div className="contentTabs">
    <label htmlFor="unvalidated-redirects-forwards-original" title="OWASP 原文">原文</label>
    <label htmlFor="unvalidated-redirects-forwards-translation" title="日本語訳">翻訳</label>
    <label htmlFor="unvalidated-redirects-forwards-bilingual" title="原文と翻訳を並べて確認">対比表示</label>
  </div>

<section id="unvalidated-redirects-forwards-original-panel" className="tabPanel originalPanel contentPanel">

## Introduction

Unvalidated redirects and forwards are possible when a web application accepts untrusted input that could cause the web application to redirect the request to a URL contained within untrusted input. By modifying untrusted URL input to a malicious site, an attacker may successfully launch a phishing scam and steal user credentials.

Because the server name in the modified link is identical to the original site, phishing attempts may have a more trustworthy appearance. Unvalidated redirect and forward attacks can also be used to maliciously craft a URL that would pass the application's access control check and then forward the attacker to privileged functions that they would normally not be able to access.

## Safe URL Redirects

When we want to redirect a user automatically to another page (without an action of the visitor such as clicking on a hyperlink) you might implement a code such as the following:

Java

```java
response.sendRedirect("http://www.mysite.com");
```

PHP

```php
<?php
/* Redirect browser */
header("Location: http://www.mysite.com");
/* Exit to prevent the rest of the code from executing */
exit;
?>
```

ASP .NET

```csharp
Response.Redirect("~/folder/Login.aspx")
```

Rails

```ruby
redirect_to login_path
```

Rust actix web

```rust
  Ok(HttpResponse::Found()
        .insert_header((header::LOCATION, "https://mysite.com/"))
        .finish())
```

In the examples above, the URL is being explicitly declared in the code and cannot be manipulated by an attacker.

## Dangerous URL Redirects

The following examples demonstrate unsafe redirect and forward code.

### Dangerous URL Redirect Example 1

The following Java code receives the URL from the parameter named `url` ([GET or POST](https://docs.oracle.com/javaee/7/api/javax/servlet/ServletRequest.html#getParameter-java.lang.String-)) and redirects to that URL:

```java
response.sendRedirect(request.getParameter("url"));
```

The following PHP code obtains a URL from the query string (via the parameter named `url`) and then redirects the user to that URL. Additionally, the PHP code after this `header()` function will continue to execute, so if the user configures their browser to ignore the redirect, they may be able to access the rest of the page.

```php
$redirect_url = $_GET['url'];
header("Location: " . $redirect_url);
```

A similar example of C\\# .NET Vulnerable Code:

```csharp
string url = request.QueryString["url"];
Response.Redirect(url);
```

And in Rails:

```ruby
redirect_to params[:url]
```

Rust actix web

```rust
  Ok(HttpResponse::Found()
        .insert_header((header::LOCATION, query_string.path.as_str()))
        .finish())
```

The above code is vulnerable to an attack if no validation or extra method controls are applied to verify the certainty of the URL. This vulnerability could be used as part of a phishing scam by redirecting users to a malicious site.

If no validation is applied, a malicious user could create a hyperlink to redirect your users to an unvalidated malicious website, for example:

```text
 http://example.com/example.php?url=http://malicious.example.com
```

The user sees the link directing to the original trusted site (`example.com`) and does not realize the redirection that could take place

### Dangerous URL Redirect Example 2

[ASP .NET MVC 1 & 2 websites](https://docs.microsoft.com/en-us/aspnet/mvc/overview/security/preventing-open-redirection-attacks) are particularly vulnerable to open redirection attacks. In order to avoid this vulnerability, you need to apply MVC 3.

The code for the LogOn action in an ASP.NET MVC 2 application is shown below. After a successful login, the controller returns a redirect to the returnUrl. You can see that no validation is being performed against the returnUrl parameter.

ASP.NET MVC 2 LogOn action in `AccountController.cs` (see Microsoft Docs link provided above for the context):

```csharp
[HttpPost]
 public ActionResult LogOn(LogOnModel model, string returnUrl)
 {
   if (ModelState.IsValid)
   {
     if (MembershipService.ValidateUser(model.UserName, model.Password))
     {
       FormsService.SignIn(model.UserName, model.RememberMe);
       if (!String.IsNullOrEmpty(returnUrl))
       {
         return Redirect(returnUrl);
       }
       else
       {
         return RedirectToAction("Index", "Home");
       }
     }
     else
     {
       ModelState.AddModelError("", "The user name or password provided is incorrect.");
     }
   }

   // If we got this far, something failed, redisplay form
   return View(model);
 }
```

### Dangerous Forward Example

When applications allow user input to forward requests between different parts of the site, the application must check that the user is authorized to access the URL, perform the functions it provides, and it is an appropriate URL request.

If the application fails to perform these checks, an attacker crafted URL may pass the application's access control check and then forward the attacker to an administrative function that is not normally permitted.

Example:

```text
http://www.example.com/function.jsp?fwd=admin.jsp
```

The following code is a Java servlet that will receive a `GET` request with a URL parameter named `fwd` in the request to forward to the address specified in the URL parameter. The servlet will retrieve the URL parameter value [from the request](https://docs.oracle.com/javaee/7/api/javax/servlet/ServletRequest.html#getParameter-java.lang.String-) and complete the server-side forward processing before responding to the browser.

```java
public class ForwardServlet extends HttpServlet
{
  protected void doGet(HttpServletRequest request, HttpServletResponse response)
                    throws ServletException, IOException {
    String query = request.getQueryString();
    if (query.contains("fwd"))
    {
      String fwd = request.getParameter("fwd");
      try
      {
        request.getRequestDispatcher(fwd).forward(request, response);
      }
      catch (ServletException e)
      {
        e.printStackTrace();
      }
    }
  }
}
```

## Preventing Unvalidated Redirects and Forwards

Safe use of redirects and forwards can be done in a number of ways:

- Simply avoid using redirects and forwards.
- If used, do not allow the URL as user input for the destination.
- Where possible, have the user provide short name, ID or token which is mapped server-side to a full target URL.
    - This provides the highest degree of protection against the attack tampering with the URL.
    - Be careful that this doesn't introduce an enumeration vulnerability where a user could cycle through IDs to find all possible redirect targets
- If user input can’t be avoided, ensure that the supplied **value** is valid, appropriate for the application, and is **authorized** for the user.
- Sanitize input by creating a list of trusted URLs (lists of hosts or a regex).
    - This should be based on an allow-list approach, rather than a denylist.
- Force all redirects to first go through a page notifying users that they are going off of your site, with the destination clearly displayed, and have them click a link to confirm.

### Validating URLs

Validating and sanitising user-input to determine whether the URL is safe is not a trivial task. Detailed instructions how to implement URL validation is described [in Server Side Request Forgery Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html#application-layer)

</section>

<section id="unvalidated-redirects-forwards-translation-panel" className="tabPanel translationPanel contentPanel">

## はじめに

未検証のリダイレクトとフォワードは、Web アプリケーションが信頼できない入力を受け取り、その入力に含まれる URL へリクエストをリダイレクトできる場合に発生します。信頼できない URL 入力を悪意のあるサイトに書き換えることで、攻撃者はフィッシング詐欺を成功させ、ユーザーの認証情報を盗み取る可能性があります。

改変されたリンク内のサーバー名は元のサイトと同一に見えるため、フィッシングの試みがより信頼できるものに見える場合があります。未検証のリダイレクトおよびフォワード攻撃は、アプリケーションのアクセス制御チェックを通過する URL を悪意を持って作成し、その後、通常はアクセスできない特権機能へ攻撃者をフォワードする目的にも使用される可能性があります。

## 安全な URL リダイレクト

ユーザーがハイパーリンクをクリックするなどの訪問者の操作なしに、別のページへ自動的にリダイレクトしたい場合、次のようなコードを実装することがあります。

Java

```java
response.sendRedirect("http://www.mysite.com");
```

PHP

```php
<?php
/* Redirect browser */
header("Location: http://www.mysite.com");
/* Exit to prevent the rest of the code from executing */
exit;
?>
```

ASP .NET

```csharp
Response.Redirect("~/folder/Login.aspx")
```

Rails

```ruby
redirect_to login_path
```

Rust actix web

```rust
  Ok(HttpResponse::Found()
        .insert_header((header::LOCATION, "https://mysite.com/"))
        .finish())
```

上記の例では、URL はコード内で明示的に宣言されており、攻撃者が操作することはできません。

## 危険な URL リダイレクト

次の例は、安全でないリダイレクトおよびフォワードのコードを示しています。

### 危険な URL リダイレクトの例 1

次の Java コードは、`url` という名前のパラメーター ([GET or POST](https://docs.oracle.com/javaee/7/api/javax/servlet/ServletRequest.html#getParameter-java.lang.String-)) から URL を受け取り、その URL へリダイレクトします。

```java
response.sendRedirect(request.getParameter("url"));
```

次の PHP コードは、クエリ文字列 (`url` という名前のパラメーター) から URL を取得し、その URL へユーザーをリダイレクトします。さらに、この `header()` 関数の後にある PHP コードは実行され続けるため、ユーザーがリダイレクトを無視するようにブラウザーを設定している場合、ページの残りの部分にアクセスできる可能性があります。

```php
$redirect_url = $_GET['url'];
header("Location: " . $redirect_url);
```

類似する C\\# .NET の脆弱なコード例です。

```csharp
string url = request.QueryString["url"];
Response.Redirect(url);
```

Rails では次のようになります。

```ruby
redirect_to params[:url]
```

Rust actix web

```rust
  Ok(HttpResponse::Found()
        .insert_header((header::LOCATION, query_string.path.as_str()))
        .finish())
```

上記のコードは、URL の確実性を検証するための検証や追加のメソッド制御が適用されていない場合、攻撃に対して脆弱です。この脆弱性は、ユーザーを悪意のあるサイトへリダイレクトすることで、フィッシング詐欺の一部として悪用される可能性があります。

検証が適用されていない場合、悪意のあるユーザーは、ユーザーを未検証の悪意ある Web サイトへリダイレクトするハイパーリンクを作成できます。例を示します。

```text
 http://example.com/example.php?url=http://malicious.example.com
```

ユーザーには元の信頼されたサイト (`example.com`) へ向かうリンクとして見えるため、実際にリダイレクトが行われる可能性に気づきません。

### 危険な URL リダイレクトの例 2

[ASP .NET MVC 1 & 2 websites](https://docs.microsoft.com/en-us/aspnet/mvc/overview/security/preventing-open-redirection-attacks) は、オープンリダイレクト攻撃に特に脆弱です。この脆弱性を避けるには、MVC 3 を適用する必要があります。

ASP.NET MVC 2 アプリケーションにおける LogOn アクションのコードを以下に示します。ログインに成功した後、コントローラーは returnUrl へのリダイレクトを返します。returnUrl パラメーターに対する検証が行われていないことが分かります。

`AccountController.cs` 内の ASP.NET MVC 2 LogOn アクション (文脈については上記の Microsoft Docs リンクを参照してください):

```csharp
[HttpPost]
 public ActionResult LogOn(LogOnModel model, string returnUrl)
 {
   if (ModelState.IsValid)
   {
     if (MembershipService.ValidateUser(model.UserName, model.Password))
     {
       FormsService.SignIn(model.UserName, model.RememberMe);
       if (!String.IsNullOrEmpty(returnUrl))
       {
         return Redirect(returnUrl);
       }
       else
       {
         return RedirectToAction("Index", "Home");
       }
     }
     else
     {
       ModelState.AddModelError("", "The user name or password provided is incorrect.");
     }
   }

   // If we got this far, something failed, redisplay form
   return View(model);
 }
```

### 危険なフォワードの例

アプリケーションがユーザー入力によってサイト内の別の部分へリクエストをフォワードできるようにしている場合、アプリケーションは、そのユーザーが URL へアクセスする権限を持っていること、その URL が提供する機能を実行する権限を持っていること、そしてその URL リクエストが適切であることを確認しなければなりません。

アプリケーションがこれらのチェックを実施しない場合、攻撃者が作成した URL がアプリケーションのアクセス制御チェックを通過し、その後、通常は許可されない管理機能へ攻撃者をフォワードする可能性があります。

例:

```text
http://www.example.com/function.jsp?fwd=admin.jsp
```

次のコードは、`fwd` という名前の URL パラメーターを含む `GET` リクエストを受け取り、その URL パラメーターで指定されたアドレスへフォワードする Java サーブレットです。このサーブレットは [request](https://docs.oracle.com/javaee/7/api/javax/servlet/ServletRequest.html#getParameter-java.lang.String-) から URL パラメーター値を取得し、ブラウザーに応答する前にサーバー側のフォワード処理を完了します。

```java
public class ForwardServlet extends HttpServlet
{
  protected void doGet(HttpServletRequest request, HttpServletResponse response)
                    throws ServletException, IOException {
    String query = request.getQueryString();
    if (query.contains("fwd"))
    {
      String fwd = request.getParameter("fwd");
      try
      {
        request.getRequestDispatcher(fwd).forward(request, response);
      }
      catch (ServletException e)
      {
        e.printStackTrace();
      }
    }
  }
}
```

## 未検証のリダイレクトとフォワードの防止

リダイレクトとフォワードを安全に使用するには、いくつかの方法があります。

- リダイレクトとフォワードの使用を単純に避けます。
- 使用する場合、宛先としてユーザー入力の URL を許可しません。
- 可能な場合は、ユーザーに短い名前、ID、またはトークンを提供させ、それをサーバー側で完全なターゲット URL にマッピングします。
    - これにより、攻撃者が URL を改ざんする攻撃に対して最も高い保護を提供できます。
    - ユーザーが ID を順番に試して、可能なリダイレクト先をすべて見つけられる列挙の脆弱性を導入しないよう注意してください。
- ユーザー入力を避けられない場合は、提供された **値** が有効であり、アプリケーションにとって適切であり、そのユーザーに **認可** されていることを確認します。
- 信頼できる URL のリスト (ホストのリストまたは正規表現) を作成して入力をサニタイズします。
    - これは拒否リストではなく、許可リストのアプローチに基づくべきです。
- すべてのリダイレクトを、まずユーザーに自サイト外へ移動することを通知するページに通し、宛先を明確に表示したうえで、確認のためにリンクをクリックさせます。

### URL の検証

URL が安全かどうかを判断するためにユーザー入力を検証し、サニタイズすることは簡単な作業ではありません。URL 検証の実装方法に関する詳細な手順は、[Server Side Request Forgery Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html#application-layer) に記載されています。

</section>

<section id="unvalidated-redirects-forwards-bilingual-panel" className="tabPanel bilingualPanel">

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Introduction

Unvalidated redirects and forwards are possible when a web application accepts untrusted input that could cause the web application to redirect the request to a URL contained within untrusted input. By modifying untrusted URL input to a malicious site, an attacker may successfully launch a phishing scam and steal user credentials.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## はじめに

未検証のリダイレクトとフォワードは、Web アプリケーションが信頼できない入力を受け取り、その入力に含まれる URL へリクエストをリダイレクトできる場合に発生します。信頼できない URL 入力を悪意のあるサイトに書き換えることで、攻撃者はフィッシング詐欺を成功させ、ユーザーの認証情報を盗み取る可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Because the server name in the modified link is identical to the original site, phishing attempts may have a more trustworthy appearance. Unvalidated redirect and forward attacks can also be used to maliciously craft a URL that would pass the application's access control check and then forward the attacker to privileged functions that they would normally not be able to access.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

改変されたリンク内のサーバー名は元のサイトと同一に見えるため、フィッシングの試みがより信頼できるものに見える場合があります。未検証のリダイレクトおよびフォワード攻撃は、アプリケーションのアクセス制御チェックを通過する URL を悪意を持って作成し、その後、通常はアクセスできない特権機能へ攻撃者をフォワードする目的にも使用される可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Safe URL Redirects

When we want to redirect a user automatically to another page (without an action of the visitor such as clicking on a hyperlink) you might implement a code such as the following:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 安全な URL リダイレクト

ユーザーがハイパーリンクをクリックするなどの訪問者の操作なしに、別のページへ自動的にリダイレクトしたい場合、次のようなコードを実装することがあります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Java

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Java

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```java
response.sendRedirect("http://www.mysite.com");
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

PHP

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

PHP

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```php
<?php
/* Redirect browser */
header("Location: http://www.mysite.com");
/* Exit to prevent the rest of the code from executing */
exit;
?>
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

ASP .NET

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

ASP .NET

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```csharp
Response.Redirect("~/folder/Login.aspx")
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Rails

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Rails

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```ruby
redirect_to login_path
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Rust actix web

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Rust actix web

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```rust
  Ok(HttpResponse::Found()
        .insert_header((header::LOCATION, "https://mysite.com/"))
        .finish())
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

In the examples above, the URL is being explicitly declared in the code and cannot be manipulated by an attacker.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

上記の例では、URL はコード内で明示的に宣言されており、攻撃者が操作することはできません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Dangerous URL Redirects

The following examples demonstrate unsafe redirect and forward code.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 危険な URL リダイレクト

次の例は、安全でないリダイレクトおよびフォワードのコードを示しています。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Dangerous URL Redirect Example 1

The following Java code receives the URL from the parameter named `url` ([GET or POST](https://docs.oracle.com/javaee/7/api/javax/servlet/ServletRequest.html#getParameter-java.lang.String-)) and redirects to that URL:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 危険な URL リダイレクトの例 1

次の Java コードは、`url` という名前のパラメーター ([GET or POST](https://docs.oracle.com/javaee/7/api/javax/servlet/ServletRequest.html#getParameter-java.lang.String-)) から URL を受け取り、その URL へリダイレクトします。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```java
response.sendRedirect(request.getParameter("url"));
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The following PHP code obtains a URL from the query string (via the parameter named `url`) and then redirects the user to that URL. Additionally, the PHP code after this `header()` function will continue to execute, so if the user configures their browser to ignore the redirect, they may be able to access the rest of the page.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

次の PHP コードは、クエリ文字列 (`url` という名前のパラメーター) から URL を取得し、その URL へユーザーをリダイレクトします。さらに、この `header()` 関数の後にある PHP コードは実行され続けるため、ユーザーがリダイレクトを無視するようにブラウザーを設定している場合、ページの残りの部分にアクセスできる可能性があります。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```php
$redirect_url = $_GET['url'];
header("Location: " . $redirect_url);
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

A similar example of C\\# .NET Vulnerable Code:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

類似する C\\# .NET の脆弱なコード例です。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```csharp
string url = request.QueryString["url"];
Response.Redirect(url);
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

And in Rails:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Rails では次のようになります。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```ruby
redirect_to params[:url]
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Rust actix web

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Rust actix web

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```rust
  Ok(HttpResponse::Found()
        .insert_header((header::LOCATION, query_string.path.as_str()))
        .finish())
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The above code is vulnerable to an attack if no validation or extra method controls are applied to verify the certainty of the URL. This vulnerability could be used as part of a phishing scam by redirecting users to a malicious site.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

上記のコードは、URL の確実性を検証するための検証や追加のメソッド制御が適用されていない場合、攻撃に対して脆弱です。この脆弱性は、ユーザーを悪意のあるサイトへリダイレクトすることで、フィッシング詐欺の一部として悪用される可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

If no validation is applied, a malicious user could create a hyperlink to redirect your users to an unvalidated malicious website, for example:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

検証が適用されていない場合、悪意のあるユーザーは、ユーザーを未検証の悪意ある Web サイトへリダイレクトするハイパーリンクを作成できます。例を示します。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```text
 http://example.com/example.php?url=http://malicious.example.com
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The user sees the link directing to the original trusted site (`example.com`) and does not realize the redirection that could take place

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

ユーザーには元の信頼されたサイト (`example.com`) へ向かうリンクとして見えるため、実際にリダイレクトが行われる可能性に気づきません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Dangerous URL Redirect Example 2

[ASP .NET MVC 1 & 2 websites](https://docs.microsoft.com/en-us/aspnet/mvc/overview/security/preventing-open-redirection-attacks) are particularly vulnerable to open redirection attacks. In order to avoid this vulnerability, you need to apply MVC 3.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 危険な URL リダイレクトの例 2

[ASP .NET MVC 1 & 2 websites](https://docs.microsoft.com/en-us/aspnet/mvc/overview/security/preventing-open-redirection-attacks) は、オープンリダイレクト攻撃に特に脆弱です。この脆弱性を避けるには、MVC 3 を適用する必要があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The code for the LogOn action in an ASP.NET MVC 2 application is shown below. After a successful login, the controller returns a redirect to the returnUrl. You can see that no validation is being performed against the returnUrl parameter.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

ASP.NET MVC 2 アプリケーションにおける LogOn アクションのコードを以下に示します。ログインに成功した後、コントローラーは returnUrl へのリダイレクトを返します。returnUrl パラメーターに対する検証が行われていないことが分かります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

ASP.NET MVC 2 LogOn action in `AccountController.cs` (see Microsoft Docs link provided above for the context):

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

`AccountController.cs` 内の ASP.NET MVC 2 LogOn アクション (文脈については上記の Microsoft Docs リンクを参照してください):

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```csharp
[HttpPost]
 public ActionResult LogOn(LogOnModel model, string returnUrl)
 {
   if (ModelState.IsValid)
   {
     if (MembershipService.ValidateUser(model.UserName, model.Password))
     {
       FormsService.SignIn(model.UserName, model.RememberMe);
       if (!String.IsNullOrEmpty(returnUrl))
       {
         return Redirect(returnUrl);
       }
       else
       {
         return RedirectToAction("Index", "Home");
       }
     }
     else
     {
       ModelState.AddModelError("", "The user name or password provided is incorrect.");
     }
   }

   // If we got this far, something failed, redisplay form
   return View(model);
 }
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Dangerous Forward Example

When applications allow user input to forward requests between different parts of the site, the application must check that the user is authorized to access the URL, perform the functions it provides, and it is an appropriate URL request.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 危険なフォワードの例

アプリケーションがユーザー入力によってサイト内の別の部分へリクエストをフォワードできるようにしている場合、アプリケーションは、そのユーザーが URL へアクセスする権限を持っていること、その URL が提供する機能を実行する権限を持っていること、そしてその URL リクエストが適切であることを確認しなければなりません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

If the application fails to perform these checks, an attacker crafted URL may pass the application's access control check and then forward the attacker to an administrative function that is not normally permitted.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

アプリケーションがこれらのチェックを実施しない場合、攻撃者が作成した URL がアプリケーションのアクセス制御チェックを通過し、その後、通常は許可されない管理機能へ攻撃者をフォワードする可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Example:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

例:

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```text
http://www.example.com/function.jsp?fwd=admin.jsp
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The following code is a Java servlet that will receive a `GET` request with a URL parameter named `fwd` in the request to forward to the address specified in the URL parameter. The servlet will retrieve the URL parameter value [from the request](https://docs.oracle.com/javaee/7/api/javax/servlet/ServletRequest.html#getParameter-java.lang.String-) and complete the server-side forward processing before responding to the browser.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

次のコードは、`fwd` という名前の URL パラメーターを含む `GET` リクエストを受け取り、その URL パラメーターで指定されたアドレスへフォワードする Java サーブレットです。このサーブレットは [request](https://docs.oracle.com/javaee/7/api/javax/servlet/ServletRequest.html#getParameter-java.lang.String-) から URL パラメーター値を取得し、ブラウザーに応答する前にサーバー側のフォワード処理を完了します。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```java
public class ForwardServlet extends HttpServlet
{
  protected void doGet(HttpServletRequest request, HttpServletResponse response)
                    throws ServletException, IOException {
    String query = request.getQueryString();
    if (query.contains("fwd"))
    {
      String fwd = request.getParameter("fwd");
      try
      {
        request.getRequestDispatcher(fwd).forward(request, response);
      }
      catch (ServletException e)
      {
        e.printStackTrace();
      }
    }
  }
}
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Preventing Unvalidated Redirects and Forwards

Safe use of redirects and forwards can be done in a number of ways:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 未検証のリダイレクトとフォワードの防止

リダイレクトとフォワードを安全に使用するには、いくつかの方法があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Simply avoid using redirects and forwards.
- If used, do not allow the URL as user input for the destination.
- Where possible, have the user provide short name, ID or token which is mapped server-side to a full target URL.
    - This provides the highest degree of protection against the attack tampering with the URL.
    - Be careful that this doesn't introduce an enumeration vulnerability where a user could cycle through IDs to find all possible redirect targets
- If user input can’t be avoided, ensure that the supplied **value** is valid, appropriate for the application, and is **authorized** for the user.
- Sanitize input by creating a list of trusted URLs (lists of hosts or a regex).
    - This should be based on an allow-list approach, rather than a denylist.
- Force all redirects to first go through a page notifying users that they are going off of your site, with the destination clearly displayed, and have them click a link to confirm.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- リダイレクトとフォワードの使用を単純に避けます。
- 使用する場合、宛先としてユーザー入力の URL を許可しません。
- 可能な場合は、ユーザーに短い名前、ID、またはトークンを提供させ、それをサーバー側で完全なターゲット URL にマッピングします。
    - これにより、攻撃者が URL を改ざんする攻撃に対して最も高い保護を提供できます。
    - ユーザーが ID を順番に試して、可能なリダイレクト先をすべて見つけられる列挙の脆弱性を導入しないよう注意してください。
- ユーザー入力を避けられない場合は、提供された **値** が有効であり、アプリケーションにとって適切であり、そのユーザーに **認可** されていることを確認します。
- 信頼できる URL のリスト (ホストのリストまたは正規表現) を作成して入力をサニタイズします。
    - これは拒否リストではなく、許可リストのアプローチに基づくべきです。
- すべてのリダイレクトを、まずユーザーに自サイト外へ移動することを通知するページに通し、宛先を明確に表示したうえで、確認のためにリンクをクリックさせます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Validating URLs

Validating and sanitising user-input to determine whether the URL is safe is not a trivial task. Detailed instructions how to implement URL validation is described [in Server Side Request Forgery Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html#application-layer)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### URL の検証

URL が安全かどうかを判断するためにユーザー入力を検証し、サニタイズすることは簡単な作業ではありません。URL 検証の実装方法に関する詳細な手順は、[Server Side Request Forgery Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html#application-layer) に記載されています。

</div>
</div>

</section>
</div>

## References

<div className="referenceFooter">

- [CWE Entry 601 on Open Redirects](http://cwe.mitre.org/data/definitions/601.html).
- [WASC Article on URL Redirector Abuse](http://projects.webappsec.org/w/page/13246981/URL%20Redirector%20Abuse)
- [Google blog article on the dangers of open redirects](http://googlewebmastercentral.blogspot.com/2009/01/open-redirect-urls-is-your-site-being.html).
- [Preventing Open Redirection Attacks (C\\#)](http://www.asp.net/mvc/tutorials/security/preventing-open-redirection-attacks).

</div>


## Attribution

<div className="attributionFooter">

- Original: Unvalidated Redirects and Forwards Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: English original retained for comparison. Japanese translation added. Bilingual display generated from official source and local Japanese translation.
- Retrieved: 2026-05-20

</div>
