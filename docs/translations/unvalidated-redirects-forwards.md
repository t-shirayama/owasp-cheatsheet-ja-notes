# 未検証のリダイレクトとフォワードチートシート 日本語訳

## Attribution

- Original: Unvalidated Redirects and Forwards Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-21

## 日本語訳

# 未検証のリダイレクトとフォワードチートシート

## はじめに

未検証のリダイレクトとフォワードは、Web アプリケーションが信頼できない入力を受け取り、その入力に含まれる URL へリクエストをリダイレクトできる場合に発生します。信頼できない URL 入力を悪意のあるサイトに書き換えることで、攻撃者はフィッシング詐欺を成功させ、ユーザーの認証情報を盗み取る可能性があります。

改変されたリンク内のサーバー名は元のサイトと同一に見えるため、フィッシングの試みがより信頼できるものに見える場合があります。未検証のリダイレクトおよびフォワード攻撃は、アプリケーションのアクセス制御チェックを通過する URL を悪意を持って作成し、その後、通常はアクセスできない特権機能へ攻撃者をフォワードする目的にも使用される可能性があります。

## 安全な URL リダイレクト

ユーザーがハイパーリンクをクリックするなどの訪問者の操作なしに、別のページへ自動的にリダイレクトしたい場合、次のようなコードを実装することがあります。

Java

```java
response.sendRedirect("http://www.mysite.com");
```text

PHP

```php
<?php
/* Redirect browser */
header("Location: http://www.mysite.com");
/* Exit to prevent the rest of the code from executing */
exit;
?>
```text

ASP .NET

```csharp
Response.Redirect("~/folder/Login.aspx")
```text

Rails

```ruby
redirect_to login_path
```text

Rust actix web

```rust
  Ok(HttpResponse::Found()
        .insert_header((header::LOCATION, "https://mysite.com/"))
        .finish())
```text

上記の例では、URL はコード内で明示的に宣言されており、攻撃者が操作することはできません。

## 危険な URL リダイレクト

次の例は、安全でないリダイレクトおよびフォワードのコードを示しています。

### 危険な URL リダイレクトの例 1

次の Java コードは、`url` という名前のパラメーター ([GET or POST](https://docs.oracle.com/javaee/7/api/javax/servlet/ServletRequest.html#getParameter-java.lang.String-)) から URL を受け取り、その URL へリダイレクトします。

```java
response.sendRedirect(request.getParameter("url"));
```text

次の PHP コードは、クエリ文字列 (`url` という名前のパラメーター) から URL を取得し、その URL へユーザーをリダイレクトします。さらに、この `header()` 関数の後にある PHP コードは実行され続けるため、ユーザーがリダイレクトを無視するようにブラウザーを設定している場合、ページの残りの部分にアクセスできる可能性があります。

```php
$redirect_url = $_GET['url'];
header("Location: " . $redirect_url);
```text

類似する C\# .NET の脆弱なコード例です。

```csharp
string url = request.QueryString["url"];
Response.Redirect(url);
```text

Rails では次のようになります。

```ruby
redirect_to params[:url]
```text

Rust actix web

```rust
  Ok(HttpResponse::Found()
        .insert_header((header::LOCATION, query_string.path.as_str()))
        .finish())
```text

上記のコードは、URL の確実性を検証するための検証や追加のメソッド制御が適用されていない場合、攻撃に対して脆弱です。この脆弱性は、ユーザーを悪意のあるサイトへリダイレクトすることで、フィッシング詐欺の一部として悪用される可能性があります。

検証が適用されていない場合、悪意のあるユーザーは、ユーザーを未検証の悪意ある Web サイトへリダイレクトするハイパーリンクを作成できます。例を示します。

```text
 http://example.com/example.php?url=http://malicious.example.com
```text

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
```text

### 危険なフォワードの例

アプリケーションがユーザー入力によってサイト内の別の部分へリクエストをフォワードできるようにしている場合、アプリケーションは、そのユーザーが URL へアクセスする権限を持っていること、その URL が提供する機能を実行する権限を持っていること、そしてその URL リクエストが適切であることを確認しなければなりません。

アプリケーションがこれらのチェックを実施しない場合、攻撃者が作成した URL がアプリケーションのアクセス制御チェックを通過し、その後、通常は許可されない管理機能へ攻撃者をフォワードする可能性があります。

例:

```text
http://www.example.com/function.jsp?fwd=admin.jsp
```text

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

## References

- [CWE Entry 601 on Open Redirects](http://cwe.mitre.org/data/definitions/601.html).
- [WASC Article on URL Redirector Abuse](http://projects.webappsec.org/w/page/13246981/URL%20Redirector%20Abuse)
- [Google blog article on the dangers of open redirects](http://googlewebmastercentral.blogspot.com/2009/01/open-redirect-urls-is-your-site-being.html).
- [Preventing Open Redirection Attacks (C\#)](http://www.asp.net/mvc/tutorials/security/preventing-open-redirection-attacks).

## ASVS との対応

未検証のリダイレクトとフォワードは、主に URL 入力の検証、認可済み遷移先の制御、アクセス制御の迂回防止に関係します。ASVS では、入力検証、アクセス制御、認証後の遷移処理、サーバー側リクエスト処理に関連する要件を確認してください。
