---
title: Laravel Cheat Sheet
hide_title: true
---

<div className="docHero" data-category="asvs-v13">
  <h1>Laravel チートシート</h1>
  <div className="docMeta">
    <span className="docPill">最終更新: 2026-05-20</span>
    <span className="docPill">読了時間: 準備中</span>
    <span className="docPill">カテゴリ: 設定</span>
  </div>
</div>

<p className="docLead">Laravel チートシートを、原文・翻訳・対比表示で確認できます。ASVS Index 対応の文脈で、公式原文と日本語訳を確認しやすく整理しています。</p>

<div className="tabbedContent">
  <input className="tabInput" type="radio" name="laravel-security-view" id="laravel-security-original" />
  <input className="tabInput" type="radio" name="laravel-security-view" id="laravel-security-translation" defaultChecked />
  <input className="tabInput" type="radio" name="laravel-security-view" id="laravel-security-bilingual" />

  <div className="contentTabs">
    <label htmlFor="laravel-security-original" title="OWASP 原文">原文</label>
    <label htmlFor="laravel-security-translation" title="日本語訳">翻訳</label>
    <label htmlFor="laravel-security-bilingual" title="原文と翻訳を並べて確認">対比表示</label>
  </div>

<section id="laravel-security-original-panel" className="tabPanel originalPanel contentPanel">

## Introduction

This *Cheatsheet* intends to provide security tips to developers building Laravel applications. It aims to cover all common vulnerabilities and how to ensure that your Laravel applications are secure.

The Laravel Framework provides in-built security features and is meant to be secure by default. However, it also provides additional flexibility for complex use cases. This means that developers unfamiliar with the inner workings of Laravel may fall into the trap of using complex features in a way that is not secure. This guide is meant to educate developers to avoid common pitfalls and develop Laravel applications in a secure manner.

## The Basics

- Make sure your app is not in debug mode while in production. To turn off debug mode, set your `APP_DEBUG` environment variable to `false`:

```ini
APP_DEBUG=false
```

- Make sure your application key has been generated. Laravel applications use the app key for symmetric encryption and SHA256 hashes such as cookie encryption, signed URLs, password reset tokens and session data encryption. To generate the app key, you may run the `key:generate` Artisan command:

```bash
php artisan key:generate
```

- Make sure your PHP configuration is secure. You may refer the [PHP Configuration Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/PHP_Configuration_Cheat_Sheet.html) for more information on secure PHP configuration settings.

- Set safe file and directory permissions on your Laravel application. In general, all Laravel directories should be setup with a max permission level of `775` and non-executable files with a max permission level of `664`. Executable files such as Artisan or deployment scripts should be provided with a max permission level of `775`.

- Make sure your application does not have vulnerable dependencies.

## Cookie Security and Session Management

By default, Laravel is configured in a secure manner. However, if you change your cookie or session configurations, make sure of the following:

- Enable the cookie encryption middleware if you use the `cookie` session store or if you store any kind of data that should not be readable or tampered with by clients. In general, this should be enabled unless your application has a very specific use case that requires disabling this. To enable this middleware, simply add the `EncryptCookies` middleware to the `web` middleware group in your `App\\Http\\Kernel` class:

```php
/**
 * The application's route middleware groups.
 *
 * @var array
 */
protected $middlewareGroups = [
    'web' => [
        \App\Http\Middleware\EncryptCookies::class,
        ...
    ],
    ...
];
```

- Enable the `HttpOnly` attribute on your session cookies via your `config/session.php` file, so that your session cookies are inaccessible from JavaScript:

```php
'http_only' => true,
```

- Unless you are using sub-domain route registrations in your Laravel application, it is recommended to set the cookie `domain` attribute to null so that only the same origin (excluding subdomains) can set the cookie. This can be configured in your `config/session.php` file:

```php
'domain' => null,
```

- Set your `SameSite` cookie attribute to `lax` or `strict` in your `config/session.php` file to restrict your cookies to a first-party or same-site context:

```php
'same_site' => 'lax',
```

- If your application is HTTPS only, it is recommended to set the `secure` configuration option in your `config/session.php` file to `true` to protect against man-in-the-middle attacks. If your application has a combination of HTTP and HTTPS, then it is recommended to set this value to `null` so that the secure attribute is set automatically when serving HTTPS requests:

```php
'secure' => null,
```

- Ensure that you have a low session idle timeout value. [OWASP recommends](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html) a 2-5 minutes idle timeout for high value applications and 15-30 minutes for low risk applications. This can be configured in your `config/session.php` file:

```php
'lifetime' => 15,
```

You may also refer the [Cookie Security Guide](https://owasp.org/www-chapter-london/assets/slides/OWASPLondon20171130_Cookie_Security_Myths_Misconceptions_David_Johansson.pdf) to learn more about cookie security and the cookie attributes mentioned above.

## Authentication

### Guards and Providers

At its core, Laravel's authentication facilities are made up of "guards" and "providers". Guards define how users are authenticated for each request. Providers define how users are retrieved from your persistent storage.

Laravel ships with a `session` guard which maintains state using session storage and cookies, and a `token` guard for API tokens.

For providers, Laravel ships with a `eloquent` provider for retrieving users using the Eloquent ORM and the `database` provider for retrieving users using the database query builder.

Guards and providers can be configured in the `config/auth.php` file. Laravel offers the ability to build custom guards and providers as well.

### Starter Kits

Laravel offers a wide variety of first party application starter kits that include in-built authentication features:

1. [Laravel Breeze](https://laravel.com/docs/8.x/starter-kits#laravel-breeze): A simple, minimal implementation of all Laravel's authentication features including login, registration, password reset, email verification and password confirmation.
2. [Laravel Fortify](https://laravel.com/docs/fortify): A headless authentication backend that includes the above authentication features along with two-factor authentication.
3. [Laravel Jetstream](https://jetstream.laravel.com/): An application starter kit that provides a UI on top of Laravel Fortify's authentication features.

It is recommended to use one of these starter kits to ensure robust and secure authentication for your Laravel applications.

### API Authentication Packages

Laravel also offers the following API authentication packages:

1. [Passport](https://laravel.com/docs/passport): An OAuth2 authentication provider.
2. [Sanctum](https://laravel.com/docs/sanctum): An API token authentication provider.

Starter kits such as Fortify and Jetstream have in-built support for Sanctum.

## Mass Assignment

[Mass assignment](https://cheatsheetseries.owasp.org/cheatsheets/Mass_Assignment_Cheat_Sheet.html) is a common vulnerability in modern web applications that use an ORM like Laravel's Eloquent ORM.

A mass assignment is a vulnerability where an ORM pattern is abused to modify data items that the user should not be normally allowed to modify.

Consider the following code:

```php
Route::any('/profile', function (Request $request) {
    $request->user()->forceFill($request->all())->save();

    $user = $request->user()->fresh();

    return response()->json(compact('user'));
})->middleware('auth');
```

The above profile route allows the logged in user to change their profile information.

However, let's say there is an `is_admin` column in the users table. You probably do not want the user to be allowed to change the value of this column. However, the above code allows users to change any column values for their row in the users table. This is a mass assignment vulnerability.

Laravel has in-built features by default to protect against this vulnerability. Make sure of the following to stay secure:

- Qualify the allowed parameters that you wish to update using `$request->only` or `$request->validated` rather than `$request->all`.
- Do not unguard models or set the `$guarded` variable to an empty array. By doing this, you are actually disabling Laravel's in-built mass assignment protection.
- Avoid using methods such as `forceFill` or `forceCreate` that bypass the protection mechanism. You may however use these methods if you are passing in a validated array of values.

## SQL Injection

SQL Injection attacks are unfortunately quite common in modern web applications and entail attackers providing malicious request input data to interfere with SQL queries. This guide covers SQL injection and how it can be prevented specifically for Laravel applications. You may also refer the [SQL Injection Prevention Cheatsheet](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html) for more information that is not specific to Laravel.

### Eloquent ORM SQL Injection Protection

By default, Laravel's Eloquent ORM protects against SQL injection by parameterizing queries and using SQL bindings. For instance, consider the following query:

```php
use App\Models\User;

User::where('email', $email)->get();
```

The code above fires the query below:

```sql
select * from `users` where `email` = ?
```

So, even if `$email` is untrusted user input data, you are protected from SQL injection attacks.

### Raw Query SQL Injection

Laravel also offers raw query expressions and raw queries to construct complex queries or database specific queries that aren't supported out of the box.

While this is great for flexibility, you must be careful to always use SQL data bindings for such queries. Consider the following query:

```php
use Illuminate\Support\Facades\DB;
use App\Models\User;

User::whereRaw('email = "'.$request->input('email').'"')->get();
DB::table('users')->whereRaw('email = "'.$request->input('email').'"')->get();
```

Both lines of code actually execute the same query, which is vulnerable to SQL injection as the query does not use SQL bindings for untrusted user input data.

The code above fires the following query:

```sql
select * from `users` where `email` = "value of email query parameter"
```

Always remember to use SQL bindings for request data. We can fix the above code by making the following modification:

```php
use App\Models\User;

User::whereRaw('email = ?', [$request->input('email')])->get();
```

We can even use named SQL bindings like so:

```php
use App\Models\User;

User::whereRaw('email = :email', ['email' => $request->input('email')])->get();
```

### Column Name SQL Injection

You must never allow user input data to dictate column names referenced by your queries.

The following queries may be vulnerable to SQL injection:

```php
use App\Models\User;

User::where($request->input('colname'), 'somedata')->get();
User::query()->orderBy($request->input('sortBy'))->get();
```

It is important to note that even though Laravel has some in-built features such as wrapping column names to protect against the above SQL injection vulnerabilities, some database engines (depending on versions and configurations) may still be vulnerable because binding column names is not supported by databases.

At the very least, this may result in a mass assignment vulnerability instead of a SQL injection because you may have expected a certain set of column values, but since they are not validated here, the user is free to use other columns as well.

Always validate user input for such situations like so:

```php
use App\Models\User;

$request->validate(['sortBy' => 'in:price,updated_at']);
User::query()->orderBy($request->validated()['sortBy'])->get();
```

### Validation Rule SQL Injection

Certain validation rules have the option of providing database column names. Such rules are vulnerable to SQL injection in the same manner as column name SQL injection because they construct queries in a similar manner.

For example, the following code may be vulnerable:

```php
use Illuminate\Validation\Rule;

$request->validate([
    'id' => Rule::unique('users')->ignore($id, $request->input('colname'))
]);
```

Behind the scenes, the above code triggers the following query:

```php
use App\Models\User;

$colname = $request->input('colname');
User::where($colname, $request->input('id'))->where($colname, '<>', $id)->count();
```

Since the column name is dictated by user input, it is similar to column name SQL injection.

## Cross Site Scripting (XSS)

[XSS attacks](https://owasp.org/www-community/attacks/xss/) are injection attacks where malicious scripts (such as JavaScript code snippets) are injected into trusted websites.

Laravel's [Blade templating engine](https://laravel.com/docs/blade) has echo statements `&#123;&#123; &#125;&#125;` that automatically escape variables using the `htmlspecialchars` PHP function to protect against XSS attacks.

Laravel also offers displaying unescaped data using the unescaped syntax `&#123;!! !!&#125;`. This must not be used on any untrusted data, otherwise your application will be subject to an XSS attack.

For instance, if you have something like this in any of your Blade templates, it would result in a vulnerability:

```blade
{!! request()->input('somedata') !!}
```

This, however, is safe to do:

```blade
{{ request()->input('somedata') }}
```

For other information on XSS prevention that is not specific to Laravel, you may refer the [Cross Site Scripting Prevention Cheatsheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html).

## Unrestricted File Uploads

Unrestricted file upload attacks entail attackers uploading malicious files to compromise web applications. This section describes how to protect against such attacks while building Laravel applications. You may also refer the [File Upload Cheatsheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html) to learn more.

### Always Validate File Type and Size

Always validate the file type (extension or MIME type) and file size to avoid storage DOS attacks and remote code execution:

```php
$request->validate([
    'photo' => 'file|size:100|mimes:jpg,bmp,png'
]);
```

Storage DOS attacks exploit missing file size validations and upload massive files to cause a denial of service (DOS) by exhausting the disk space.

Remote code execution attacks entail first, uploading malicious executable files (such as PHP files) and then, triggering their malicious code by visiting the file URL (if public).

Both these attacks can be avoided by simple file validations as mentioned above.

### Do Not Rely On User Input To Dictate Filenames or Path

If your application allows user controlled data to construct the path of a file upload, this may result in overwriting a critical file or storing the file in a bad location.

Consider the following code:

```php
Route::post('/upload', function (Request $request) {
    $request->file('file')->storeAs(auth()->id(), $request->input('filename'));

    return back();
});
```

This route saves a file to a directory specific to a user ID. Here, we rely on the `filename` user input data and this may result in a vulnerability as the filename could be something like `../2/filename.pdf`. This will upload the file in user ID 2's directory instead of the directory pertaining to the current logged in user.

To fix this, we should use the `basename` PHP function to strip out any directory information from the `filename` input data:

```php
Route::post('/upload', function (Request $request) {
    $request->file('file')->storeAs(auth()->id(), basename($request->input('filename')));

    return back();
});
```

### Avoid Processing ZIP or XML Files If Possible

XML files can expose your application to a wide variety of attacks such as XXE attacks, the billion laughs attack and others. If you process ZIP files, you may be exposed to zip bomb DOS attacks.

Refer the [XML Security Cheatsheet](https://cheatsheetseries.owasp.org/cheatsheets/XML_Security_Cheat_Sheet.html) and the [File Upload Cheatsheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html) to learn more.

## Path Traversal

A path traversal attack aims to access files by manipulating request input data with `../` sequences and variations or by using absolute file paths.

If you allow users to download files by filename, you may be exposed to this vulnerability if input data is not stripped of directory information.

Consider the following code:

```php
Route::get('/download', function(Request $request) {
    return response()->download(storage_path('content/').$request->input('filename'));
});
```

Here, the filename is not stripped of directory information, so a malformed filename such as `../../.env` could expose your application credentials to potential attackers.

Similar to unrestricted file uploads, you should use the `basename` PHP function to strip out directory information like so:

```php
Route::get('/download', function(Request $request) {
    return response()->download(storage_path('content/').basename($request->input('filename')));
});
```

## Open Redirection

Open Redirection attacks in themselves are not that dangerous but they enable phishing attacks.

Consider the following code:

```php
Route::get('/redirect', function (Request $request) {
   return redirect($request->input('url'));
});
```

This code redirects the user to any external URL provided by user input. This could enable attackers to create seemingly safe URLs like `https://example.com/redirect?url=http://evil.com`. For instance, attackers may use a URL of this type to spoof password reset emails and lead victims to expose their credentials on the attacker's website.

## Cross Site Request Forgery (CSRF)

[Cross-Site Request Forgery (CSRF)](https://owasp.org/www-community/attacks/csrf) is a type of attack that occurs when a malicious web site, email, blog, instant message, or program causes a user's web browser to perform an unwanted action on a trusted site when the user is authenticated.

Laravel provides CSRF protection out-of-the-box with the `VerifyCSRFToken` middleware. Generally, if you have this middleware in the `web` middleware group of your `App\\Http\\Kernel` class, you should be well protected:

```php
/**
 * The application's route middleware groups.
 *
 * @var array
 */
protected $middlewareGroups = [
    'web' => [
        ...
         \App\Http\Middleware\VerifyCsrfToken::class,
         ...
    ],
];
```

Next, for all your `POST` request forms, you may use the `@csrf` blade directive to generate the hidden CSRF input token fields:

```html
<form method="POST" action="/profile">
    @csrf

    <!-- Equivalent to... -->
    <input type="hidden" name="_token" value="{{ csrf_token() }}" />
</form>
```

For AJAX requests, you can setup the [X-CSRF-Token header](https://laravel.com/docs/csrf#csrf-x-csrf-token).

Laravel also provides the ability to exclude certain routes from CSRF protection using the `$except` variable in your CSRF middleware class. Typically, you would want to exclude only stateless routes (e.g. APIs or webhooks) from CSRF protection. If any other routes are excluded, these may result in CSRF vulnerabilities.

## Command Injection

Command Injection vulnerabilities involve executing shell commands constructed with unescaped user input data.

For example, the following code performs a `whois` on a user provided domain name:

```php
public function verifyDomain(Request $request)
{
    exec('whois '.$request->input('domain'));
}
```

The above code is vulnerable as the user data is not escaped properly. To do so, you may use the `escapeshellcmd` and/or `escapeshellarg` PHP functions.

## Other Injections

Object injection, eval code injection and extract variable hijacking attacks involve unserializing, evaluating or using the `extract` function on untrusted user input data.

Some examples are:

```php
unserialize($request->input('data'));
eval($request->input('data'));
extract($request->all());
```

In general, avoid passing any untrusted input data to these dangerous functions.

## Rate Limiting

Laravel provides built-in mechanisms to protect your routes from excessive requests and potential abuse.

The two main ways to implement rate limiting are:

1. **`throttle` middleware** – A built-in middleware that you can apply directly to routes or route groups.
2. **`RateLimiter::for()`** – Allows you to define custom rate limiting rules with more flexibility.

Below are the main ways to apply rate limiting effectively:

### 1. Per Route

Apply a limit directly to a single route using the `throttle` middleware:

```php
Route::get('/profile', function () {
    return 'User profile';
})->middleware('throttle:10,1'); // 10 requests per minute
```

### 2. Per Route Group

Apply a limit to a group of routes:

```php
Route::middleware('throttle:20,1')->group(function () {
    Route::get('/posts', fn () => 'Posts');
    Route::get('/comments', fn () => 'Comments');
});
```

### 3. Custom Rate Limiter

Define a custom rate limiter in `RouteServiceProvider` using `RateLimiter::for()`:

```php
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;

RateLimiter::for('custom-limit', function ($request) {
    return Limit::perMinute(5)->by($request->user()?->id ?: $request->ip());
});
```

Apply the custom limiter to your routes:

```php
Route::middleware('throttle:custom-limit')->get('/dashboard', fn () => 'Dashboard');
```

### 4. Global API / Web Rate Limiting

Laravel allows you to apply global rate limiting to entire route groups like `api` or `web` by including the `throttle` middleware in `Kernel.php` (note that the `api` group is rate-limited by default).

```php
protected $middlewareGroups = [
    'api' => [
        'throttle:60,1', // 60 requests per minute globally for API
        // ...
    ],

    'web' => [
        'throttle:30,1', // 30 requests per minute globally for web
        // ...
    ],
];
```

For more details, see the official Laravel documentation on [rate limiting](https://laravel.com/docs/12.x/routing#rate-limiting).

## Security Headers

You should consider adding the following security headers to your web server or Laravel application middleware:

- X-Frame-Options
- X-Content-Type-Options
- Strict-Transport-Security (for HTTPS only applications)
- Content-Security-Policy

For more information, refer the [OWASP secure headers project](https://owasp.org/www-project-secure-headers/).

</section>

<section id="laravel-security-translation-panel" className="tabPanel translationPanel contentPanel">

## はじめに

この *チートシート* は、Laravel アプリケーションを構築する開発者にセキュリティ上のヒントを提供することを目的としています。一般的な脆弱性と、Laravel アプリケーションを安全に保つ方法を網羅することを目指しています。

Laravel Framework は組み込みのセキュリティ機能を提供しており、デフォルトで安全になるよう意図されています。一方で、複雑なユースケースに対応するための追加の柔軟性も提供しています。つまり、Laravel の内部動作に詳しくない開発者は、複雑な機能を安全でない方法で使ってしまう可能性があります。このガイドは、開発者がよくある落とし穴を避け、Laravel アプリケーションを安全に開発できるようにするためのものです。

## 基本事項

- 本番環境では、アプリケーションがデバッグモードになっていないことを確認してください。デバッグモードを無効にするには、`APP_DEBUG` 環境変数を `false` に設定します。

```ini
APP_DEBUG=false
```

- アプリケーションキーが生成済みであることを確認してください。Laravel アプリケーションは、Cookie 暗号化、署名付き URL、パスワードリセットトークン、セッションデータ暗号化などの対称暗号化や SHA256 ハッシュにアプリケーションキーを使用します。アプリケーションキーを生成するには、`key:generate` Artisan コマンドを実行できます。

```bash
php artisan key:generate
```

- PHP 設定が安全であることを確認してください。安全な PHP 設定の詳細については、[PHP Configuration Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/PHP_Configuration_Cheat_Sheet.html) を参照できます。

- Laravel アプリケーションのファイルとディレクトリに安全なパーミッションを設定してください。一般に、すべての Laravel ディレクトリは最大パーミッションレベル `775`、実行不可ファイルは最大パーミッションレベル `664` に設定するべきです。Artisan やデプロイスクリプトなどの実行可能ファイルには、最大パーミッションレベル `775` を設定するべきです。

- アプリケーションに脆弱な依存関係が含まれていないことを確認してください。

## Cookie セキュリティとセッション管理

デフォルトでは、Laravel は安全な方法で設定されています。ただし、Cookie やセッションの設定を変更する場合は、次の点を確認してください。

- `cookie` セッションストアを使用する場合、またはクライアントから読み取られたり改ざんされたりしてはならないデータを保存する場合は、Cookie 暗号化ミドルウェアを有効にしてください。一般に、この機能を無効にする必要がある非常に特殊なユースケースがない限り、有効にしておくべきです。このミドルウェアを有効にするには、`App\\Http\\Kernel` クラスの `web` ミドルウェアグループに `EncryptCookies` ミドルウェアを追加します。

```php
/**
 * The application's route middleware groups.
 *
 * @var array
 */
protected $middlewareGroups = [
    'web' => [
        \App\Http\Middleware\EncryptCookies::class,
        ...
    ],
    ...
];
```

- `config/session.php` ファイルでセッション Cookie の `HttpOnly` 属性を有効にし、JavaScript からセッション Cookie にアクセスできないようにしてください。

```php
'http_only' => true,
```

- Laravel アプリケーションでサブドメインルート登録を使用していない場合は、同一オリジンのみが Cookie を設定できるように、Cookie の `domain` 属性を null に設定することを推奨します。これは `config/session.php` ファイルで設定できます。

```php
'domain' => null,
```

- `config/session.php` ファイルで `SameSite` Cookie 属性を `lax` または `strict` に設定し、Cookie をファーストパーティまたは same-site コンテキストに制限してください。

```php
'same_site' => 'lax',
```

- アプリケーションが HTTPS 専用である場合は、中間者攻撃から保護するため、`config/session.php` ファイルの `secure` 設定オプションを `true` にすることを推奨します。アプリケーションが HTTP と HTTPS の両方を含む場合は、HTTPS リクエストを処理するときに secure 属性が自動的に設定されるよう、この値を `null` にすることを推奨します。

```php
'secure' => null,
```

- セッションのアイドルタイムアウト値を短くしてください。[OWASP は](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)、高価値アプリケーションでは 2-5 分、低リスクアプリケーションでは 15-30 分のアイドルタイムアウトを推奨しています。これは `config/session.php` ファイルで設定できます。

```php
'lifetime' => 15,
```

Cookie セキュリティと上記の Cookie 属性について詳しく学ぶには、[Cookie Security Guide](https://owasp.org/www-chapter-london/assets/slides/OWASPLondon20171130_Cookie_Security_Myths_Misconceptions_David_Johansson.pdf) も参照できます。

## 認証

### ガードとプロバイダ

Laravel の認証機能は、中核として「guards」と「providers」で構成されています。Guards は各リクエストでユーザーをどのように認証するかを定義します。Providers は永続ストレージからユーザーをどのように取得するかを定義します。

Laravel には、セッションストレージと Cookie を使って状態を維持する `session` guard と、API トークン用の `token` guard が同梱されています。

Providers については、Eloquent ORM を使ってユーザーを取得する `eloquent` provider と、データベースクエリビルダを使ってユーザーを取得する `database` provider が Laravel に同梱されています。

Guards と providers は `config/auth.php` ファイルで設定できます。Laravel はカスタム guards と providers を構築する機能も提供しています。

### スターターキット

Laravel は、組み込みの認証機能を含む多様な公式アプリケーションスターターキットを提供しています。

1. [Laravel Breeze](https://laravel.com/docs/8.x/starter-kits#laravel-breeze): ログイン、登録、パスワードリセット、メール認証、パスワード確認を含む、Laravel のすべての認証機能のシンプルで最小限の実装です。
2. [Laravel Fortify](https://laravel.com/docs/fortify): 上記の認証機能に加えて二要素認証を含む、ヘッドレス認証バックエンドです。
3. [Laravel Jetstream](https://jetstream.laravel.com/): Laravel Fortify の認証機能の上に UI を提供するアプリケーションスターターキットです。

Laravel アプリケーションで堅牢かつ安全な認証を確保するため、これらのスターターキットのいずれかを使用することを推奨します。

### API 認証パッケージ

Laravel は次の API 認証パッケージも提供しています。

1. [Passport](https://laravel.com/docs/passport): OAuth2 認証プロバイダです。
2. [Sanctum](https://laravel.com/docs/sanctum): API トークン認証プロバイダです。

Fortify や Jetstream などのスターターキットには、Sanctum の組み込みサポートがあります。

## Mass Assignment

[Mass assignment](https://cheatsheetseries.owasp.org/cheatsheets/Mass_Assignment_Cheat_Sheet.html) は、Laravel の Eloquent ORM のような ORM を使用する現代的な Web アプリケーションでよく見られる脆弱性です。

Mass assignment とは、ユーザーが通常変更を許可されるべきではないデータ項目を変更するために、ORM パターンが悪用される脆弱性です。

次のコードを考えてみます。

```php
Route::any('/profile', function (Request $request) {
    $request->user()->forceFill($request->all())->save();

    $user = $request->user()->fresh();

    return response()->json(compact('user'));
})->middleware('auth');
```

上記のプロフィールルートは、ログインユーザーが自分のプロフィール情報を変更できるようにします。

しかし、users テーブルに `is_admin` カラムがあるとします。おそらく、このカラムの値をユーザーに変更させたくはないでしょう。しかし、上記のコードは、ユーザーが users テーブル内の自分の行について任意のカラム値を変更できるようにしています。これは mass assignment 脆弱性です。

Laravel には、この脆弱性から保護するための組み込み機能がデフォルトで用意されています。安全を保つために、次の点を確認してください。

- `$request->all` ではなく `$request->only` または `$request->validated` を使用して、更新したい許可済みパラメータを明示してください。
- モデルを unguard したり、`$guarded` 変数を空配列に設定したりしないでください。そうすると、実際には Laravel の組み込み mass assignment 保護を無効化することになります。
- 保護機構を迂回する `forceFill` や `forceCreate` などのメソッドの使用を避けてください。ただし、検証済みの値の配列を渡している場合は、これらのメソッドを使用してもかまいません。

## SQL インジェクション

SQL インジェクション攻撃は、現代的な Web アプリケーションで残念ながら非常によく見られます。攻撃者が悪意のあるリクエスト入力データを提供し、SQL クエリに干渉する攻撃です。このガイドでは、Laravel アプリケーションに特化して SQL インジェクションとその防止方法を扱います。Laravel 固有ではない詳細については、[SQL Injection Prevention Cheatsheet](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html) も参照できます。

### Eloquent ORM による SQL インジェクション保護

デフォルトでは、Laravel の Eloquent ORM はクエリをパラメータ化し、SQL バインディングを使用することで SQL インジェクションから保護します。たとえば、次のクエリを考えてみます。

```php
use App\Models\User;

User::where('email', $email)->get();
```

上記のコードは、次のクエリを実行します。

```sql
select * from `users` where `email` = ?
```

したがって、`$email` が信頼できないユーザー入力データであっても、SQL インジェクション攻撃から保護されます。

### Raw Query SQL インジェクション

Laravel は、標準ではサポートされない複雑なクエリやデータベース固有のクエリを構築するために、raw query expressions と raw queries も提供しています。

これは柔軟性の面では優れていますが、そのようなクエリでは常に SQL データバインディングを使うよう注意する必要があります。次のクエリを考えてみます。

```php
use Illuminate\Support\Facades\DB;
use App\Models\User;

User::whereRaw('email = "'.$request->input('email').'"')->get();
DB::table('users')->whereRaw('email = "'.$request->input('email').'"')->get();
```

どちらの行も実際には同じクエリを実行しますが、信頼できないユーザー入力データに SQL バインディングを使用していないため、SQL インジェクションに対して脆弱です。

上記のコードは、次のクエリを実行します。

```sql
select * from `users` where `email` = "value of email query parameter"
```

リクエストデータには常に SQL バインディングを使用することを忘れないでください。上記のコードは次のように修正できます。

```php
use App\Models\User;

User::whereRaw('email = ?', [$request->input('email')])->get();
```

次のように名前付き SQL バインディングを使用することもできます。

```php
use App\Models\User;

User::whereRaw('email = :email', ['email' => $request->input('email')])->get();
```

### カラム名 SQL インジェクション

クエリが参照するカラム名を、ユーザー入力データで決定させてはいけません。

次のクエリは SQL インジェクションに対して脆弱である可能性があります。

```php
use App\Models\User;

User::where($request->input('colname'), 'somedata')->get();
User::query()->orderBy($request->input('sortBy'))->get();
```

Laravel にはカラム名をラップするなど、上記の SQL インジェクション脆弱性から保護するための組み込み機能がいくつかあります。しかし、データベースではカラム名のバインディングがサポートされていないため、一部のデータベースエンジンはバージョンや設定によっては依然として脆弱な可能性がある点に注意が必要です。

少なくとも、これは SQL インジェクションではなく mass assignment 脆弱性につながる可能性があります。特定のカラム値の集合を想定していたとしても、ここで検証されていないため、ユーザーは他のカラムも自由に使用できるからです。

このような状況では、必ず次のようにユーザー入力を検証してください。

```php
use App\Models\User;

$request->validate(['sortBy' => 'in:price,updated_at']);
User::query()->orderBy($request->validated()['sortBy'])->get();
```

### バリデーションルール SQL インジェクション

一部のバリデーションルールには、データベースカラム名を指定するオプションがあります。このようなルールは、同様の方法でクエリを構築するため、カラム名 SQL インジェクションと同じように SQL インジェクションに対して脆弱です。

たとえば、次のコードは脆弱である可能性があります。

```php
use Illuminate\Validation\Rule;

$request->validate([
    'id' => Rule::unique('users')->ignore($id, $request->input('colname'))
]);
```

内部では、上記のコードは次のクエリを発行します。

```php
use App\Models\User;

$colname = $request->input('colname');
User::where($colname, $request->input('id'))->where($colname, '<>', $id)->count();
```

カラム名がユーザー入力によって決定されるため、カラム名 SQL インジェクションと同様です。

## クロスサイトスクリプティング (XSS)

[XSS 攻撃](https://owasp.org/www-community/attacks/xss/)は、悪意のあるスクリプト、たとえば JavaScript コードスニペットを信頼された Web サイトに注入するインジェクション攻撃です。

Laravel の [Blade テンプレートエンジン](https://laravel.com/docs/blade) には、PHP の `htmlspecialchars` 関数を使って変数を自動的にエスケープし、XSS 攻撃から保護する echo 文 `&#123;&#123; &#125;&#125;` があります。

Laravel は、エスケープされていないデータを表示するための非エスケープ構文 `&#123;!! !!&#125;` も提供しています。これは信頼できないデータに対して使用してはいけません。使用すると、アプリケーションが XSS 攻撃を受ける可能性があります。

たとえば、Blade テンプレートのいずれかに次のような記述がある場合、脆弱性につながります。

```blade
{!! request()->input('somedata') !!}
```

一方、次の記述は安全です。

```blade
{{ request()->input('somedata') }}
```

Laravel 固有ではない XSS 防止のその他の情報については、[Cross Site Scripting Prevention Cheatsheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html) を参照できます。

## 無制限のファイルアップロード

無制限のファイルアップロード攻撃では、攻撃者が悪意のあるファイルをアップロードして Web アプリケーションを侵害します。このセクションでは、Laravel アプリケーションを構築する際に、そのような攻撃から保護する方法を説明します。詳細については、[File Upload Cheatsheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html) も参照できます。

### ファイルタイプとサイズを常に検証する

ストレージ DoS 攻撃やリモートコード実行を避けるため、ファイルタイプ、つまり拡張子または MIME タイプと、ファイルサイズを常に検証してください。

```php
$request->validate([
    'photo' => 'file|size:100|mimes:jpg,bmp,png'
]);
```

ストレージ DoS 攻撃は、ファイルサイズ検証の欠落を悪用し、巨大なファイルをアップロードしてディスク容量を枯渇させることでサービス拒否 (DoS) を引き起こします。

リモートコード実行攻撃では、まず PHP ファイルなどの悪意のある実行可能ファイルをアップロードし、その後、ファイル URL にアクセスして悪意のあるコードを実行させます。ただし、これはファイルが公開されている場合です。

上記のような単純なファイル検証により、これらの攻撃はどちらも回避できます。

### ファイル名やパスをユーザー入力に依存して決定しない

アプリケーションがユーザー制御データを使ってファイルアップロードのパスを構築する場合、重要なファイルの上書きや不適切な場所へのファイル保存につながる可能性があります。

次のコードを考えてみます。

```php
Route::post('/upload', function (Request $request) {
    $request->file('file')->storeAs(auth()->id(), $request->input('filename'));

    return back();
});
```

このルートは、ユーザー ID 固有のディレクトリにファイルを保存します。ここでは `filename` のユーザー入力データに依存していますが、ファイル名が `../2/filename.pdf` のような値である可能性があり、脆弱性につながります。この場合、現在ログインしているユーザーに対応するディレクトリではなく、ユーザー ID 2 のディレクトリにファイルがアップロードされます。

これを修正するには、PHP の `basename` 関数を使用して、`filename` 入力データからディレクトリ情報を取り除くべきです。

```php
Route::post('/upload', function (Request $request) {
    $request->file('file')->storeAs(auth()->id(), basename($request->input('filename')));

    return back();
});
```

### 可能であれば ZIP または XML ファイルの処理を避ける

XML ファイルは、XXE 攻撃、billion laughs 攻撃など、さまざまな攻撃にアプリケーションをさらす可能性があります。ZIP ファイルを処理する場合は、zip bomb DoS 攻撃にさらされる可能性があります。

詳細については、[XML Security Cheatsheet](https://cheatsheetseries.owasp.org/cheatsheets/XML_Security_Cheat_Sheet.html) と [File Upload Cheatsheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html) を参照してください。

## パストラバーサル

パストラバーサル攻撃は、`../` シーケンスとその変形、または絶対ファイルパスを使ってリクエスト入力データを操作し、ファイルへアクセスすることを目的とします。

ファイル名によるファイルダウンロードをユーザーに許可している場合、入力データからディレクトリ情報が取り除かれていなければ、この脆弱性にさらされる可能性があります。

次のコードを考えてみます。

```php
Route::get('/download', function(Request $request) {
    return response()->download(storage_path('content/').$request->input('filename'));
});
```

ここでは、ファイル名からディレクトリ情報が取り除かれていないため、`../../.env` のような不正なファイル名によって、アプリケーションの認証情報が潜在的な攻撃者に露出する可能性があります。

無制限のファイルアップロードと同様に、次のように PHP の `basename` 関数を使用してディレクトリ情報を取り除くべきです。

```php
Route::get('/download', function(Request $request) {
    return response()->download(storage_path('content/').basename($request->input('filename')));
});
```

## オープンリダイレクト

オープンリダイレクト攻撃自体はそれほど危険ではありませんが、フィッシング攻撃を可能にします。

次のコードを考えてみます。

```php
Route::get('/redirect', function (Request $request) {
   return redirect($request->input('url'));
});
```

このコードは、ユーザー入力で指定された任意の外部 URL にユーザーをリダイレクトします。これにより、攻撃者は `https://example.com/redirect?url=http://evil.com` のような、一見安全に見える URL を作成できるようになります。たとえば、攻撃者はこの種の URL を使ってパスワードリセットメールを偽装し、被害者を攻撃者の Web サイトに誘導して認証情報を露出させる可能性があります。

## クロスサイトリクエストフォージェリ (CSRF)

[Cross-Site Request Forgery (CSRF)](https://owasp.org/www-community/attacks/csrf) は、悪意のある Web サイト、メール、ブログ、インスタントメッセージ、またはプログラムが、ユーザーが認証済みである信頼されたサイト上で、ユーザーの Web ブラウザに意図しない操作を実行させる攻撃の一種です。

Laravel は、`VerifyCSRFToken` ミドルウェアによって CSRF 保護を標準で提供します。一般に、`App\\Http\\Kernel` クラスの `web` ミドルウェアグループにこのミドルウェアが含まれていれば、十分に保護されます。

```php
/**
 * The application's route middleware groups.
 *
 * @var array
 */
protected $middlewareGroups = [
    'web' => [
        ...
         \App\Http\Middleware\VerifyCsrfToken::class,
         ...
    ],
];
```

次に、すべての `POST` リクエストフォームでは、`@csrf` Blade ディレクティブを使用して、hidden CSRF 入力トークンフィールドを生成できます。

```html
<form method="POST" action="/profile">
    @csrf

    <!-- Equivalent to... -->
    <input type="hidden" name="_token" value="{{ csrf_token() }}" />
</form>
```

AJAX リクエストでは、[X-CSRF-Token header](https://laravel.com/docs/csrf#csrf-x-csrf-token) を設定できます。

Laravel は、CSRF ミドルウェアクラスの `$except` 変数を使用して、特定のルートを CSRF 保護から除外する機能も提供します。通常、CSRF 保護から除外したいのは、API や webhook などのステートレスなルートのみです。その他のルートを除外すると、CSRF 脆弱性につながる可能性があります。

## コマンドインジェクション

コマンドインジェクション脆弱性は、エスケープされていないユーザー入力データを使って構築されたシェルコマンドを実行することに関係します。

たとえば、次のコードはユーザーが指定したドメイン名に対して `whois` を実行します。

```php
public function verifyDomain(Request $request)
{
    exec('whois '.$request->input('domain'));
}
```

上記のコードは、ユーザーデータが適切にエスケープされていないため脆弱です。エスケープするには、PHP の `escapeshellcmd` 関数や `escapeshellarg` 関数を使用できます。

## その他のインジェクション

オブジェクトインジェクション、eval コードインジェクション、extract 変数ハイジャック攻撃は、信頼できないユーザー入力データに対して unserialize、評価、または `extract` 関数の使用を行うことに関係します。

例をいくつか示します。

```php
unserialize($request->input('data'));
eval($request->input('data'));
extract($request->all());
```

一般に、信頼できない入力データをこれらの危険な関数に渡すことは避けてください。

## レート制限

Laravel は、過剰なリクエストや潜在的な悪用からルートを保護するための組み込み機構を提供しています。

レート制限を実装する主な方法は 2 つあります。

1. **`throttle` middleware** - ルートまたはルートグループに直接適用できる組み込みミドルウェアです。
2. **`RateLimiter::for()`** - より柔軟にカスタムレート制限ルールを定義できます。

以下は、レート制限を効果的に適用する主な方法です。

### 1. ルート単位

`throttle` ミドルウェアを使用して、単一のルートに直接制限を適用します。

```php
Route::get('/profile', function () {
    return 'User profile';
})->middleware('throttle:10,1'); // 10 requests per minute
```

### 2. ルートグループ単位

ルートグループに制限を適用します。

```php
Route::middleware('throttle:20,1')->group(function () {
    Route::get('/posts', fn () => 'Posts');
    Route::get('/comments', fn () => 'Comments');
});
```

### 3. カスタムレートリミッタ

`RateLimiter::for()` を使用して、`RouteServiceProvider` にカスタムレートリミッタを定義します。

```php
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;

RateLimiter::for('custom-limit', function ($request) {
    return Limit::perMinute(5)->by($request->user()?->id ?: $request->ip());
});
```

カスタムリミッタをルートに適用します。

```php
Route::middleware('throttle:custom-limit')->get('/dashboard', fn () => 'Dashboard');
```

### 4. グローバル API / Web レート制限

Laravel では、`Kernel.php` に `throttle` ミドルウェアを含めることで、`api` や `web` のようなルートグループ全体にグローバルなレート制限を適用できます。なお、`api` グループはデフォルトでレート制限されています。

```php
protected $middlewareGroups = [
    'api' => [
        'throttle:60,1', // 60 requests per minute globally for API
        // ...
    ],

    'web' => [
        'throttle:30,1', // 30 requests per minute globally for web
        // ...
    ],
];
```

詳細については、[rate limiting](https://laravel.com/docs/12.x/routing#rate-limiting) に関する Laravel 公式ドキュメントを参照してください。

## セキュリティヘッダー

Web サーバーまたは Laravel アプリケーションのミドルウェアに、次のセキュリティヘッダーを追加することを検討してください。

- X-Frame-Options
- X-Content-Type-Options
- Strict-Transport-Security (HTTPS 専用アプリケーション向け)
- Content-Security-Policy

詳細については、[OWASP secure headers project](https://owasp.org/www-project-secure-headers/) を参照してください。

</section>

<section id="laravel-security-bilingual-panel" className="tabPanel bilingualPanel">

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Introduction

This *Cheatsheet* intends to provide security tips to developers building Laravel applications. It aims to cover all common vulnerabilities and how to ensure that your Laravel applications are secure.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## はじめに

この *チートシート* は、Laravel アプリケーションを構築する開発者にセキュリティ上のヒントを提供することを目的としています。一般的な脆弱性と、Laravel アプリケーションを安全に保つ方法を網羅することを目指しています。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The Laravel Framework provides in-built security features and is meant to be secure by default. However, it also provides additional flexibility for complex use cases. This means that developers unfamiliar with the inner workings of Laravel may fall into the trap of using complex features in a way that is not secure. This guide is meant to educate developers to avoid common pitfalls and develop Laravel applications in a secure manner.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Laravel Framework は組み込みのセキュリティ機能を提供しており、デフォルトで安全になるよう意図されています。一方で、複雑なユースケースに対応するための追加の柔軟性も提供しています。つまり、Laravel の内部動作に詳しくない開発者は、複雑な機能を安全でない方法で使ってしまう可能性があります。このガイドは、開発者がよくある落とし穴を避け、Laravel アプリケーションを安全に開発できるようにするためのものです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## The Basics

- Make sure your app is not in debug mode while in production. To turn off debug mode, set your `APP_DEBUG` environment variable to `false`:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 基本事項

- 本番環境では、アプリケーションがデバッグモードになっていないことを確認してください。デバッグモードを無効にするには、`APP_DEBUG` 環境変数を `false` に設定します。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```ini
APP_DEBUG=false
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Make sure your application key has been generated. Laravel applications use the app key for symmetric encryption and SHA256 hashes such as cookie encryption, signed URLs, password reset tokens and session data encryption. To generate the app key, you may run the `key:generate` Artisan command:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- アプリケーションキーが生成済みであることを確認してください。Laravel アプリケーションは、Cookie 暗号化、署名付き URL、パスワードリセットトークン、セッションデータ暗号化などの対称暗号化や SHA256 ハッシュにアプリケーションキーを使用します。アプリケーションキーを生成するには、`key:generate` Artisan コマンドを実行できます。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```bash
php artisan key:generate
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Make sure your PHP configuration is secure. You may refer the [PHP Configuration Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/PHP_Configuration_Cheat_Sheet.html) for more information on secure PHP configuration settings.

- Set safe file and directory permissions on your Laravel application. In general, all Laravel directories should be setup with a max permission level of `775` and non-executable files with a max permission level of `664`. Executable files such as Artisan or deployment scripts should be provided with a max permission level of `775`.

- Make sure your application does not have vulnerable dependencies.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- PHP 設定が安全であることを確認してください。安全な PHP 設定の詳細については、[PHP Configuration Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/PHP_Configuration_Cheat_Sheet.html) を参照できます。

- Laravel アプリケーションのファイルとディレクトリに安全なパーミッションを設定してください。一般に、すべての Laravel ディレクトリは最大パーミッションレベル `775`、実行不可ファイルは最大パーミッションレベル `664` に設定するべきです。Artisan やデプロイスクリプトなどの実行可能ファイルには、最大パーミッションレベル `775` を設定するべきです。

- アプリケーションに脆弱な依存関係が含まれていないことを確認してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Cookie Security and Session Management

By default, Laravel is configured in a secure manner. However, if you change your cookie or session configurations, make sure of the following:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## Cookie セキュリティとセッション管理

デフォルトでは、Laravel は安全な方法で設定されています。ただし、Cookie やセッションの設定を変更する場合は、次の点を確認してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Enable the cookie encryption middleware if you use the `cookie` session store or if you store any kind of data that should not be readable or tampered with by clients. In general, this should be enabled unless your application has a very specific use case that requires disabling this. To enable this middleware, simply add the `EncryptCookies` middleware to the `web` middleware group in your `App\\Http\\Kernel` class:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- `cookie` セッションストアを使用する場合、またはクライアントから読み取られたり改ざんされたりしてはならないデータを保存する場合は、Cookie 暗号化ミドルウェアを有効にしてください。一般に、この機能を無効にする必要がある非常に特殊なユースケースがない限り、有効にしておくべきです。このミドルウェアを有効にするには、`App\\Http\\Kernel` クラスの `web` ミドルウェアグループに `EncryptCookies` ミドルウェアを追加します。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```php
/**
 * The application's route middleware groups.
 *
 * @var array
 */
protected $middlewareGroups = [
    'web' => [
        \App\Http\Middleware\EncryptCookies::class,
        ...
    ],
    ...
];
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Enable the `HttpOnly` attribute on your session cookies via your `config/session.php` file, so that your session cookies are inaccessible from JavaScript:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- `config/session.php` ファイルでセッション Cookie の `HttpOnly` 属性を有効にし、JavaScript からセッション Cookie にアクセスできないようにしてください。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```php
'http_only' => true,
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Unless you are using sub-domain route registrations in your Laravel application, it is recommended to set the cookie `domain` attribute to null so that only the same origin (excluding subdomains) can set the cookie. This can be configured in your `config/session.php` file:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- Laravel アプリケーションでサブドメインルート登録を使用していない場合は、同一オリジンのみが Cookie を設定できるように、Cookie の `domain` 属性を null に設定することを推奨します。これは `config/session.php` ファイルで設定できます。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```php
'domain' => null,
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Set your `SameSite` cookie attribute to `lax` or `strict` in your `config/session.php` file to restrict your cookies to a first-party or same-site context:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- `config/session.php` ファイルで `SameSite` Cookie 属性を `lax` または `strict` に設定し、Cookie をファーストパーティまたは same-site コンテキストに制限してください。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```php
'same_site' => 'lax',
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- If your application is HTTPS only, it is recommended to set the `secure` configuration option in your `config/session.php` file to `true` to protect against man-in-the-middle attacks. If your application has a combination of HTTP and HTTPS, then it is recommended to set this value to `null` so that the secure attribute is set automatically when serving HTTPS requests:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- アプリケーションが HTTPS 専用である場合は、中間者攻撃から保護するため、`config/session.php` ファイルの `secure` 設定オプションを `true` にすることを推奨します。アプリケーションが HTTP と HTTPS の両方を含む場合は、HTTPS リクエストを処理するときに secure 属性が自動的に設定されるよう、この値を `null` にすることを推奨します。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```php
'secure' => null,
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Ensure that you have a low session idle timeout value. [OWASP recommends](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html) a 2-5 minutes idle timeout for high value applications and 15-30 minutes for low risk applications. This can be configured in your `config/session.php` file:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- セッションのアイドルタイムアウト値を短くしてください。[OWASP は](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)、高価値アプリケーションでは 2-5 分、低リスクアプリケーションでは 15-30 分のアイドルタイムアウトを推奨しています。これは `config/session.php` ファイルで設定できます。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```php
'lifetime' => 15,
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

You may also refer the [Cookie Security Guide](https://owasp.org/www-chapter-london/assets/slides/OWASPLondon20171130_Cookie_Security_Myths_Misconceptions_David_Johansson.pdf) to learn more about cookie security and the cookie attributes mentioned above.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Cookie セキュリティと上記の Cookie 属性について詳しく学ぶには、[Cookie Security Guide](https://owasp.org/www-chapter-london/assets/slides/OWASPLondon20171130_Cookie_Security_Myths_Misconceptions_David_Johansson.pdf) も参照できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Authentication

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 認証

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Guards and Providers

At its core, Laravel's authentication facilities are made up of "guards" and "providers". Guards define how users are authenticated for each request. Providers define how users are retrieved from your persistent storage.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### ガードとプロバイダ

Laravel の認証機能は、中核として「guards」と「providers」で構成されています。Guards は各リクエストでユーザーをどのように認証するかを定義します。Providers は永続ストレージからユーザーをどのように取得するかを定義します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Laravel ships with a `session` guard which maintains state using session storage and cookies, and a `token` guard for API tokens.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Laravel には、セッションストレージと Cookie を使って状態を維持する `session` guard と、API トークン用の `token` guard が同梱されています。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

For providers, Laravel ships with a `eloquent` provider for retrieving users using the Eloquent ORM and the `database` provider for retrieving users using the database query builder.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Providers については、Eloquent ORM を使ってユーザーを取得する `eloquent` provider と、データベースクエリビルダを使ってユーザーを取得する `database` provider が Laravel に同梱されています。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Guards and providers can be configured in the `config/auth.php` file. Laravel offers the ability to build custom guards and providers as well.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Guards と providers は `config/auth.php` ファイルで設定できます。Laravel はカスタム guards と providers を構築する機能も提供しています。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Starter Kits

Laravel offers a wide variety of first party application starter kits that include in-built authentication features:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### スターターキット

Laravel は、組み込みの認証機能を含む多様な公式アプリケーションスターターキットを提供しています。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

1. [Laravel Breeze](https://laravel.com/docs/8.x/starter-kits#laravel-breeze): A simple, minimal implementation of all Laravel's authentication features including login, registration, password reset, email verification and password confirmation.
2. [Laravel Fortify](https://laravel.com/docs/fortify): A headless authentication backend that includes the above authentication features along with two-factor authentication.
3. [Laravel Jetstream](https://jetstream.laravel.com/): An application starter kit that provides a UI on top of Laravel Fortify's authentication features.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

1. [Laravel Breeze](https://laravel.com/docs/8.x/starter-kits#laravel-breeze): ログイン、登録、パスワードリセット、メール認証、パスワード確認を含む、Laravel のすべての認証機能のシンプルで最小限の実装です。
2. [Laravel Fortify](https://laravel.com/docs/fortify): 上記の認証機能に加えて二要素認証を含む、ヘッドレス認証バックエンドです。
3. [Laravel Jetstream](https://jetstream.laravel.com/): Laravel Fortify の認証機能の上に UI を提供するアプリケーションスターターキットです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

It is recommended to use one of these starter kits to ensure robust and secure authentication for your Laravel applications.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Laravel アプリケーションで堅牢かつ安全な認証を確保するため、これらのスターターキットのいずれかを使用することを推奨します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### API Authentication Packages

Laravel also offers the following API authentication packages:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### API 認証パッケージ

Laravel は次の API 認証パッケージも提供しています。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

1. [Passport](https://laravel.com/docs/passport): An OAuth2 authentication provider.
2. [Sanctum](https://laravel.com/docs/sanctum): An API token authentication provider.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

1. [Passport](https://laravel.com/docs/passport): OAuth2 認証プロバイダです。
2. [Sanctum](https://laravel.com/docs/sanctum): API トークン認証プロバイダです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Starter kits such as Fortify and Jetstream have in-built support for Sanctum.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Fortify や Jetstream などのスターターキットには、Sanctum の組み込みサポートがあります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Mass Assignment

[Mass assignment](https://cheatsheetseries.owasp.org/cheatsheets/Mass_Assignment_Cheat_Sheet.html) is a common vulnerability in modern web applications that use an ORM like Laravel's Eloquent ORM.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## Mass Assignment

[Mass assignment](https://cheatsheetseries.owasp.org/cheatsheets/Mass_Assignment_Cheat_Sheet.html) は、Laravel の Eloquent ORM のような ORM を使用する現代的な Web アプリケーションでよく見られる脆弱性です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

A mass assignment is a vulnerability where an ORM pattern is abused to modify data items that the user should not be normally allowed to modify.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Mass assignment とは、ユーザーが通常変更を許可されるべきではないデータ項目を変更するために、ORM パターンが悪用される脆弱性です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Consider the following code:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

次のコードを考えてみます。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```php
Route::any('/profile', function (Request $request) {
    $request->user()->forceFill($request->all())->save();

    $user = $request->user()->fresh();

    return response()->json(compact('user'));
})->middleware('auth');
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The above profile route allows the logged in user to change their profile information.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

上記のプロフィールルートは、ログインユーザーが自分のプロフィール情報を変更できるようにします。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

However, let's say there is an `is_admin` column in the users table. You probably do not want the user to be allowed to change the value of this column. However, the above code allows users to change any column values for their row in the users table. This is a mass assignment vulnerability.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

しかし、users テーブルに `is_admin` カラムがあるとします。おそらく、このカラムの値をユーザーに変更させたくはないでしょう。しかし、上記のコードは、ユーザーが users テーブル内の自分の行について任意のカラム値を変更できるようにしています。これは mass assignment 脆弱性です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Laravel has in-built features by default to protect against this vulnerability. Make sure of the following to stay secure:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Laravel には、この脆弱性から保護するための組み込み機能がデフォルトで用意されています。安全を保つために、次の点を確認してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Qualify the allowed parameters that you wish to update using `$request->only` or `$request->validated` rather than `$request->all`.
- Do not unguard models or set the `$guarded` variable to an empty array. By doing this, you are actually disabling Laravel's in-built mass assignment protection.
- Avoid using methods such as `forceFill` or `forceCreate` that bypass the protection mechanism. You may however use these methods if you are passing in a validated array of values.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- `$request->all` ではなく `$request->only` または `$request->validated` を使用して、更新したい許可済みパラメータを明示してください。
- モデルを unguard したり、`$guarded` 変数を空配列に設定したりしないでください。そうすると、実際には Laravel の組み込み mass assignment 保護を無効化することになります。
- 保護機構を迂回する `forceFill` や `forceCreate` などのメソッドの使用を避けてください。ただし、検証済みの値の配列を渡している場合は、これらのメソッドを使用してもかまいません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## SQL Injection

SQL Injection attacks are unfortunately quite common in modern web applications and entail attackers providing malicious request input data to interfere with SQL queries. This guide covers SQL injection and how it can be prevented specifically for Laravel applications. You may also refer the [SQL Injection Prevention Cheatsheet](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html) for more information that is not specific to Laravel.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## SQL インジェクション

SQL インジェクション攻撃は、現代的な Web アプリケーションで残念ながら非常によく見られます。攻撃者が悪意のあるリクエスト入力データを提供し、SQL クエリに干渉する攻撃です。このガイドでは、Laravel アプリケーションに特化して SQL インジェクションとその防止方法を扱います。Laravel 固有ではない詳細については、[SQL Injection Prevention Cheatsheet](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html) も参照できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Eloquent ORM SQL Injection Protection

By default, Laravel's Eloquent ORM protects against SQL injection by parameterizing queries and using SQL bindings. For instance, consider the following query:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Eloquent ORM による SQL インジェクション保護

デフォルトでは、Laravel の Eloquent ORM はクエリをパラメータ化し、SQL バインディングを使用することで SQL インジェクションから保護します。たとえば、次のクエリを考えてみます。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```php
use App\Models\User;

User::where('email', $email)->get();
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The code above fires the query below:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

上記のコードは、次のクエリを実行します。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```sql
select * from `users` where `email` = ?
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

So, even if `$email` is untrusted user input data, you are protected from SQL injection attacks.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

したがって、`$email` が信頼できないユーザー入力データであっても、SQL インジェクション攻撃から保護されます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Raw Query SQL Injection

Laravel also offers raw query expressions and raw queries to construct complex queries or database specific queries that aren't supported out of the box.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Raw Query SQL インジェクション

Laravel は、標準ではサポートされない複雑なクエリやデータベース固有のクエリを構築するために、raw query expressions と raw queries も提供しています。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

While this is great for flexibility, you must be careful to always use SQL data bindings for such queries. Consider the following query:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

これは柔軟性の面では優れていますが、そのようなクエリでは常に SQL データバインディングを使うよう注意する必要があります。次のクエリを考えてみます。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```php
use Illuminate\Support\Facades\DB;
use App\Models\User;

User::whereRaw('email = "'.$request->input('email').'"')->get();
DB::table('users')->whereRaw('email = "'.$request->input('email').'"')->get();
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Both lines of code actually execute the same query, which is vulnerable to SQL injection as the query does not use SQL bindings for untrusted user input data.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

どちらの行も実際には同じクエリを実行しますが、信頼できないユーザー入力データに SQL バインディングを使用していないため、SQL インジェクションに対して脆弱です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The code above fires the following query:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

上記のコードは、次のクエリを実行します。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```sql
select * from `users` where `email` = "value of email query parameter"
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Always remember to use SQL bindings for request data. We can fix the above code by making the following modification:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

リクエストデータには常に SQL バインディングを使用することを忘れないでください。上記のコードは次のように修正できます。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```php
use App\Models\User;

User::whereRaw('email = ?', [$request->input('email')])->get();
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

We can even use named SQL bindings like so:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

次のように名前付き SQL バインディングを使用することもできます。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```php
use App\Models\User;

User::whereRaw('email = :email', ['email' => $request->input('email')])->get();
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Column Name SQL Injection

You must never allow user input data to dictate column names referenced by your queries.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### カラム名 SQL インジェクション

クエリが参照するカラム名を、ユーザー入力データで決定させてはいけません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The following queries may be vulnerable to SQL injection:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

次のクエリは SQL インジェクションに対して脆弱である可能性があります。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```php
use App\Models\User;

User::where($request->input('colname'), 'somedata')->get();
User::query()->orderBy($request->input('sortBy'))->get();
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

It is important to note that even though Laravel has some in-built features such as wrapping column names to protect against the above SQL injection vulnerabilities, some database engines (depending on versions and configurations) may still be vulnerable because binding column names is not supported by databases.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Laravel にはカラム名をラップするなど、上記の SQL インジェクション脆弱性から保護するための組み込み機能がいくつかあります。しかし、データベースではカラム名のバインディングがサポートされていないため、一部のデータベースエンジンはバージョンや設定によっては依然として脆弱な可能性がある点に注意が必要です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

At the very least, this may result in a mass assignment vulnerability instead of a SQL injection because you may have expected a certain set of column values, but since they are not validated here, the user is free to use other columns as well.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

少なくとも、これは SQL インジェクションではなく mass assignment 脆弱性につながる可能性があります。特定のカラム値の集合を想定していたとしても、ここで検証されていないため、ユーザーは他のカラムも自由に使用できるからです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Always validate user input for such situations like so:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

このような状況では、必ず次のようにユーザー入力を検証してください。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```php
use App\Models\User;

$request->validate(['sortBy' => 'in:price,updated_at']);
User::query()->orderBy($request->validated()['sortBy'])->get();
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Validation Rule SQL Injection

Certain validation rules have the option of providing database column names. Such rules are vulnerable to SQL injection in the same manner as column name SQL injection because they construct queries in a similar manner.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### バリデーションルール SQL インジェクション

一部のバリデーションルールには、データベースカラム名を指定するオプションがあります。このようなルールは、同様の方法でクエリを構築するため、カラム名 SQL インジェクションと同じように SQL インジェクションに対して脆弱です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

For example, the following code may be vulnerable:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

たとえば、次のコードは脆弱である可能性があります。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```php
use Illuminate\Validation\Rule;

$request->validate([
    'id' => Rule::unique('users')->ignore($id, $request->input('colname'))
]);
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Behind the scenes, the above code triggers the following query:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

内部では、上記のコードは次のクエリを発行します。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```php
use App\Models\User;

$colname = $request->input('colname');
User::where($colname, $request->input('id'))->where($colname, '<>', $id)->count();
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Since the column name is dictated by user input, it is similar to column name SQL injection.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

カラム名がユーザー入力によって決定されるため、カラム名 SQL インジェクションと同様です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Cross Site Scripting (XSS)

[XSS attacks](https://owasp.org/www-community/attacks/xss/) are injection attacks where malicious scripts (such as JavaScript code snippets) are injected into trusted websites.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## クロスサイトスクリプティング (XSS)

[XSS 攻撃](https://owasp.org/www-community/attacks/xss/)は、悪意のあるスクリプト、たとえば JavaScript コードスニペットを信頼された Web サイトに注入するインジェクション攻撃です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Laravel's [Blade templating engine](https://laravel.com/docs/blade) has echo statements `&#123;&#123; &#125;&#125;` that automatically escape variables using the `htmlspecialchars` PHP function to protect against XSS attacks.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Laravel の [Blade テンプレートエンジン](https://laravel.com/docs/blade) には、PHP の `htmlspecialchars` 関数を使って変数を自動的にエスケープし、XSS 攻撃から保護する echo 文 `&#123;&#123; &#125;&#125;` があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Laravel also offers displaying unescaped data using the unescaped syntax `&#123;!! !!&#125;`. This must not be used on any untrusted data, otherwise your application will be subject to an XSS attack.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Laravel は、エスケープされていないデータを表示するための非エスケープ構文 `&#123;!! !!&#125;` も提供しています。これは信頼できないデータに対して使用してはいけません。使用すると、アプリケーションが XSS 攻撃を受ける可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

For instance, if you have something like this in any of your Blade templates, it would result in a vulnerability:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

たとえば、Blade テンプレートのいずれかに次のような記述がある場合、脆弱性につながります。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```blade
{!! request()->input('somedata') !!}
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

This, however, is safe to do:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

一方、次の記述は安全です。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```blade
{{ request()->input('somedata') }}
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

For other information on XSS prevention that is not specific to Laravel, you may refer the [Cross Site Scripting Prevention Cheatsheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Laravel 固有ではない XSS 防止のその他の情報については、[Cross Site Scripting Prevention Cheatsheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html) を参照できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Unrestricted File Uploads

Unrestricted file upload attacks entail attackers uploading malicious files to compromise web applications. This section describes how to protect against such attacks while building Laravel applications. You may also refer the [File Upload Cheatsheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html) to learn more.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 無制限のファイルアップロード

無制限のファイルアップロード攻撃では、攻撃者が悪意のあるファイルをアップロードして Web アプリケーションを侵害します。このセクションでは、Laravel アプリケーションを構築する際に、そのような攻撃から保護する方法を説明します。詳細については、[File Upload Cheatsheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html) も参照できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Always Validate File Type and Size

Always validate the file type (extension or MIME type) and file size to avoid storage DOS attacks and remote code execution:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### ファイルタイプとサイズを常に検証する

ストレージ DoS 攻撃やリモートコード実行を避けるため、ファイルタイプ、つまり拡張子または MIME タイプと、ファイルサイズを常に検証してください。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```php
$request->validate([
    'photo' => 'file|size:100|mimes:jpg,bmp,png'
]);
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Storage DOS attacks exploit missing file size validations and upload massive files to cause a denial of service (DOS) by exhausting the disk space.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

ストレージ DoS 攻撃は、ファイルサイズ検証の欠落を悪用し、巨大なファイルをアップロードしてディスク容量を枯渇させることでサービス拒否 (DoS) を引き起こします。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Remote code execution attacks entail first, uploading malicious executable files (such as PHP files) and then, triggering their malicious code by visiting the file URL (if public).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

リモートコード実行攻撃では、まず PHP ファイルなどの悪意のある実行可能ファイルをアップロードし、その後、ファイル URL にアクセスして悪意のあるコードを実行させます。ただし、これはファイルが公開されている場合です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Both these attacks can be avoided by simple file validations as mentioned above.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

上記のような単純なファイル検証により、これらの攻撃はどちらも回避できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Do Not Rely On User Input To Dictate Filenames or Path

If your application allows user controlled data to construct the path of a file upload, this may result in overwriting a critical file or storing the file in a bad location.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### ファイル名やパスをユーザー入力に依存して決定しない

アプリケーションがユーザー制御データを使ってファイルアップロードのパスを構築する場合、重要なファイルの上書きや不適切な場所へのファイル保存につながる可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Consider the following code:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

次のコードを考えてみます。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```php
Route::post('/upload', function (Request $request) {
    $request->file('file')->storeAs(auth()->id(), $request->input('filename'));

    return back();
});
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

This route saves a file to a directory specific to a user ID. Here, we rely on the `filename` user input data and this may result in a vulnerability as the filename could be something like `../2/filename.pdf`. This will upload the file in user ID 2's directory instead of the directory pertaining to the current logged in user.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

このルートは、ユーザー ID 固有のディレクトリにファイルを保存します。ここでは `filename` のユーザー入力データに依存していますが、ファイル名が `../2/filename.pdf` のような値である可能性があり、脆弱性につながります。この場合、現在ログインしているユーザーに対応するディレクトリではなく、ユーザー ID 2 のディレクトリにファイルがアップロードされます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

To fix this, we should use the `basename` PHP function to strip out any directory information from the `filename` input data:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

これを修正するには、PHP の `basename` 関数を使用して、`filename` 入力データからディレクトリ情報を取り除くべきです。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```php
Route::post('/upload', function (Request $request) {
    $request->file('file')->storeAs(auth()->id(), basename($request->input('filename')));

    return back();
});
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Avoid Processing ZIP or XML Files If Possible

XML files can expose your application to a wide variety of attacks such as XXE attacks, the billion laughs attack and others. If you process ZIP files, you may be exposed to zip bomb DOS attacks.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 可能であれば ZIP または XML ファイルの処理を避ける

XML ファイルは、XXE 攻撃、billion laughs 攻撃など、さまざまな攻撃にアプリケーションをさらす可能性があります。ZIP ファイルを処理する場合は、zip bomb DoS 攻撃にさらされる可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Refer the [XML Security Cheatsheet](https://cheatsheetseries.owasp.org/cheatsheets/XML_Security_Cheat_Sheet.html) and the [File Upload Cheatsheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html) to learn more.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

詳細については、[XML Security Cheatsheet](https://cheatsheetseries.owasp.org/cheatsheets/XML_Security_Cheat_Sheet.html) と [File Upload Cheatsheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html) を参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Path Traversal

A path traversal attack aims to access files by manipulating request input data with `../` sequences and variations or by using absolute file paths.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## パストラバーサル

パストラバーサル攻撃は、`../` シーケンスとその変形、または絶対ファイルパスを使ってリクエスト入力データを操作し、ファイルへアクセスすることを目的とします。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

If you allow users to download files by filename, you may be exposed to this vulnerability if input data is not stripped of directory information.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

ファイル名によるファイルダウンロードをユーザーに許可している場合、入力データからディレクトリ情報が取り除かれていなければ、この脆弱性にさらされる可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Consider the following code:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

次のコードを考えてみます。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```php
Route::get('/download', function(Request $request) {
    return response()->download(storage_path('content/').$request->input('filename'));
});
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Here, the filename is not stripped of directory information, so a malformed filename such as `../../.env` could expose your application credentials to potential attackers.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

ここでは、ファイル名からディレクトリ情報が取り除かれていないため、`../../.env` のような不正なファイル名によって、アプリケーションの認証情報が潜在的な攻撃者に露出する可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Similar to unrestricted file uploads, you should use the `basename` PHP function to strip out directory information like so:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

無制限のファイルアップロードと同様に、次のように PHP の `basename` 関数を使用してディレクトリ情報を取り除くべきです。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```php
Route::get('/download', function(Request $request) {
    return response()->download(storage_path('content/').basename($request->input('filename')));
});
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Open Redirection

Open Redirection attacks in themselves are not that dangerous but they enable phishing attacks.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## オープンリダイレクト

オープンリダイレクト攻撃自体はそれほど危険ではありませんが、フィッシング攻撃を可能にします。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Consider the following code:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

次のコードを考えてみます。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```php
Route::get('/redirect', function (Request $request) {
   return redirect($request->input('url'));
});
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

This code redirects the user to any external URL provided by user input. This could enable attackers to create seemingly safe URLs like `https://example.com/redirect?url=http://evil.com`. For instance, attackers may use a URL of this type to spoof password reset emails and lead victims to expose their credentials on the attacker's website.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

このコードは、ユーザー入力で指定された任意の外部 URL にユーザーをリダイレクトします。これにより、攻撃者は `https://example.com/redirect?url=http://evil.com` のような、一見安全に見える URL を作成できるようになります。たとえば、攻撃者はこの種の URL を使ってパスワードリセットメールを偽装し、被害者を攻撃者の Web サイトに誘導して認証情報を露出させる可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Cross Site Request Forgery (CSRF)

[Cross-Site Request Forgery (CSRF)](https://owasp.org/www-community/attacks/csrf) is a type of attack that occurs when a malicious web site, email, blog, instant message, or program causes a user's web browser to perform an unwanted action on a trusted site when the user is authenticated.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## クロスサイトリクエストフォージェリ (CSRF)

[Cross-Site Request Forgery (CSRF)](https://owasp.org/www-community/attacks/csrf) は、悪意のある Web サイト、メール、ブログ、インスタントメッセージ、またはプログラムが、ユーザーが認証済みである信頼されたサイト上で、ユーザーの Web ブラウザに意図しない操作を実行させる攻撃の一種です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Laravel provides CSRF protection out-of-the-box with the `VerifyCSRFToken` middleware. Generally, if you have this middleware in the `web` middleware group of your `App\\Http\\Kernel` class, you should be well protected:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Laravel は、`VerifyCSRFToken` ミドルウェアによって CSRF 保護を標準で提供します。一般に、`App\\Http\\Kernel` クラスの `web` ミドルウェアグループにこのミドルウェアが含まれていれば、十分に保護されます。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```php
/**
 * The application's route middleware groups.
 *
 * @var array
 */
protected $middlewareGroups = [
    'web' => [
        ...
         \App\Http\Middleware\VerifyCsrfToken::class,
         ...
    ],
];
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Next, for all your `POST` request forms, you may use the `@csrf` blade directive to generate the hidden CSRF input token fields:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

次に、すべての `POST` リクエストフォームでは、`@csrf` Blade ディレクティブを使用して、hidden CSRF 入力トークンフィールドを生成できます。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<form method="POST" action="/profile">
    @csrf

    <!-- Equivalent to... -->
    <input type="hidden" name="_token" value="{{ csrf_token() }}" />
</form>
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

For AJAX requests, you can setup the [X-CSRF-Token header](https://laravel.com/docs/csrf#csrf-x-csrf-token).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

AJAX リクエストでは、[X-CSRF-Token header](https://laravel.com/docs/csrf#csrf-x-csrf-token) を設定できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Laravel also provides the ability to exclude certain routes from CSRF protection using the `$except` variable in your CSRF middleware class. Typically, you would want to exclude only stateless routes (e.g. APIs or webhooks) from CSRF protection. If any other routes are excluded, these may result in CSRF vulnerabilities.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Laravel は、CSRF ミドルウェアクラスの `$except` 変数を使用して、特定のルートを CSRF 保護から除外する機能も提供します。通常、CSRF 保護から除外したいのは、API や webhook などのステートレスなルートのみです。その他のルートを除外すると、CSRF 脆弱性につながる可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Command Injection

Command Injection vulnerabilities involve executing shell commands constructed with unescaped user input data.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## コマンドインジェクション

コマンドインジェクション脆弱性は、エスケープされていないユーザー入力データを使って構築されたシェルコマンドを実行することに関係します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

For example, the following code performs a `whois` on a user provided domain name:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

たとえば、次のコードはユーザーが指定したドメイン名に対して `whois` を実行します。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```php
public function verifyDomain(Request $request)
{
    exec('whois '.$request->input('domain'));
}
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The above code is vulnerable as the user data is not escaped properly. To do so, you may use the `escapeshellcmd` and/or `escapeshellarg` PHP functions.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

上記のコードは、ユーザーデータが適切にエスケープされていないため脆弱です。エスケープするには、PHP の `escapeshellcmd` 関数や `escapeshellarg` 関数を使用できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Other Injections

Object injection, eval code injection and extract variable hijacking attacks involve unserializing, evaluating or using the `extract` function on untrusted user input data.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## その他のインジェクション

オブジェクトインジェクション、eval コードインジェクション、extract 変数ハイジャック攻撃は、信頼できないユーザー入力データに対して unserialize、評価、または `extract` 関数の使用を行うことに関係します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Some examples are:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

例をいくつか示します。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```php
unserialize($request->input('data'));
eval($request->input('data'));
extract($request->all());
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

In general, avoid passing any untrusted input data to these dangerous functions.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

一般に、信頼できない入力データをこれらの危険な関数に渡すことは避けてください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Rate Limiting

Laravel provides built-in mechanisms to protect your routes from excessive requests and potential abuse.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## レート制限

Laravel は、過剰なリクエストや潜在的な悪用からルートを保護するための組み込み機構を提供しています。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The two main ways to implement rate limiting are:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

レート制限を実装する主な方法は 2 つあります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

1. **`throttle` middleware** – A built-in middleware that you can apply directly to routes or route groups.
2. **`RateLimiter::for()`** – Allows you to define custom rate limiting rules with more flexibility.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

1. **`throttle` middleware** - ルートまたはルートグループに直接適用できる組み込みミドルウェアです。
2. **`RateLimiter::for()`** - より柔軟にカスタムレート制限ルールを定義できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Below are the main ways to apply rate limiting effectively:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

以下は、レート制限を効果的に適用する主な方法です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### 1. Per Route

Apply a limit directly to a single route using the `throttle` middleware:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 1. ルート単位

`throttle` ミドルウェアを使用して、単一のルートに直接制限を適用します。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```php
Route::get('/profile', function () {
    return 'User profile';
})->middleware('throttle:10,1'); // 10 requests per minute
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### 2. Per Route Group

Apply a limit to a group of routes:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 2. ルートグループ単位

ルートグループに制限を適用します。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```php
Route::middleware('throttle:20,1')->group(function () {
    Route::get('/posts', fn () => 'Posts');
    Route::get('/comments', fn () => 'Comments');
});
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### 3. Custom Rate Limiter

Define a custom rate limiter in `RouteServiceProvider` using `RateLimiter::for()`:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 3. カスタムレートリミッタ

`RateLimiter::for()` を使用して、`RouteServiceProvider` にカスタムレートリミッタを定義します。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```php
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;

RateLimiter::for('custom-limit', function ($request) {
    return Limit::perMinute(5)->by($request->user()?->id ?: $request->ip());
});
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Apply the custom limiter to your routes:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

カスタムリミッタをルートに適用します。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```php
Route::middleware('throttle:custom-limit')->get('/dashboard', fn () => 'Dashboard');
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### 4. Global API / Web Rate Limiting

Laravel allows you to apply global rate limiting to entire route groups like `api` or `web` by including the `throttle` middleware in `Kernel.php` (note that the `api` group is rate-limited by default).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 4. グローバル API / Web レート制限

Laravel では、`Kernel.php` に `throttle` ミドルウェアを含めることで、`api` や `web` のようなルートグループ全体にグローバルなレート制限を適用できます。なお、`api` グループはデフォルトでレート制限されています。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```php
protected $middlewareGroups = [
    'api' => [
        'throttle:60,1', // 60 requests per minute globally for API
        // ...
    ],

    'web' => [
        'throttle:30,1', // 30 requests per minute globally for web
        // ...
    ],
];
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

For more details, see the official Laravel documentation on [rate limiting](https://laravel.com/docs/12.x/routing#rate-limiting).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

詳細については、[rate limiting](https://laravel.com/docs/12.x/routing#rate-limiting) に関する Laravel 公式ドキュメントを参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Security Headers

You should consider adding the following security headers to your web server or Laravel application middleware:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## セキュリティヘッダー

Web サーバーまたは Laravel アプリケーションのミドルウェアに、次のセキュリティヘッダーを追加することを検討してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- X-Frame-Options
- X-Content-Type-Options
- Strict-Transport-Security (for HTTPS only applications)
- Content-Security-Policy

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- X-Frame-Options
- X-Content-Type-Options
- Strict-Transport-Security (HTTPS 専用アプリケーション向け)
- Content-Security-Policy

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

For more information, refer the [OWASP secure headers project](https://owasp.org/www-project-secure-headers/).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

詳細については、[OWASP secure headers project](https://owasp.org/www-project-secure-headers/) を参照してください。

</div>
</div>

</section>
</div>

## References

<div className="referenceFooter">

- [Laravel Documentation on Authentication](https://laravel.com/docs/authentication)
- [Laravel Documentation on Authorization](https://laravel.com/docs/authorization)
- [Laravel Documentation on CSRF](https://laravel.com/docs/csrf)
- [Laravel Documentation on Validation](https://laravel.com/docs/validation)

</div>


## Attribution

<div className="attributionFooter">

- Original: Laravel Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Laravel_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: English original retained for comparison. Japanese translation added. Bilingual display generated from official source and local Japanese translation.
- Retrieved: 2026-05-20

</div>
