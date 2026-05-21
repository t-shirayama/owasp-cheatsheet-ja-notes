---
title: Django Security Cheat Sheet
hide_title: true
---

<div className="docHero" data-category="asvs-v13">
  <h1>Django セキュリティチートシート</h1>
  <div className="docMeta">
    <span className="docPill">最終更新: 2026-05-21</span>
    <span className="docPill">読了時間: 約 9 分</span>
    <span className="docPill">カテゴリ: 設定</span>
  </div>
</div>

<div className="tabbedContent">
  <input className="tabInput" type="radio" name="django-security-view" id="django-security-original" />
  <input className="tabInput" type="radio" name="django-security-view" id="django-security-translation" defaultChecked />
  <input className="tabInput" type="radio" name="django-security-view" id="django-security-bilingual" />

  <div className="contentTabs">
    <label htmlFor="django-security-original" title="OWASP 原文">原文</label>
    <label htmlFor="django-security-translation" title="日本語訳">翻訳</label>
    <label htmlFor="django-security-bilingual" title="原文と翻訳を並べて確認">対比表示</label>
  </div>

<section id="django-security-original-panel" className="tabPanel originalPanel contentPanel">

## Introduction

The Django framework is a powerful Python web framework, and it comes with built-in security features that can be used out-of-the-box to prevent common web vulnerabilities. This cheat sheet lists actions and security tips developers can take to develop secure Django applications. It aims to cover common vulnerabilities to increase the security posture of your Django application. Each item has a brief explanation and relevant code samples that are specific to the Django environment.

The Django framework provides some built-in security features that aim to be secure-by-default. These features are also flexible to empower a developer to re-use components for complex use-cases. This opens up scenarios where developers unfamiliar with the inner workings of the components can configure them in an insecure way. This cheat sheet aims to enumerate some such use cases.

## General Recommendations

- Always keep Django and your application's dependencies up-to-date to keep up with security vulnerabilities.
- Ensure that the application is never in `DEBUG` mode in a production environment. Never run `DEBUG = True` in production.
- Use packages like [`django_ratelimit`](https://django-ratelimit.readthedocs.io/en/stable/) or [`django-axes`](https://django-axes.readthedocs.io/en/latest/index.html) to prevent brute-force attacks.

## Authentication

- Use `django.contrib.auth` app for views and forms for user authentication operations such as login, logout, password change, etc. Include the module and its dependencies `django.contrib.contenttypes` and `django.contrib.sessions` in the `INSTALLED_APPS` setting in the `settings.py` file.

  ```python
  INSTALLED_APPS = [
      # ...
      'django.contrib.auth',
      'django.contrib.contenttypes',
      'django.contrib.sessions',
      # ...
  ]
  ```

- Use the `@login_required` decorator to ensure that only authenticated users can access a view. The sample code below illustrates usage of `@login_required`.

  ```python
  from django.contrib.auth.decorators import login_required

  # User is redirected to default login page if not authenticated.
  @login_required
  def my_view(request):
    # Your view logic

  # User is redirected to custom '/login-page/' if not authenticated.
  @login_required(login_url='/login-page/')
  def my_view(request):
    # Your view logic
  ```

- Use password validators for enforcing password policies. Add or update the `AUTH_PASSWORD_VALIDATORS` setting in the `settings.py` file to include specific validators required by your application.

  ```python
  AUTH_PASSWORD_VALIDATORS = [
    {
      # Checks the similarity between the password and a set of attributes of the user.
      'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
      'OPTIONS': {
        'user_attributes': ('username', 'email', 'first_name', 'last_name'),
        'max_similarity': 0.7,
      }
    },
    {
      # Checks whether the password meets a minimum length.
      'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
      'OPTIONS': {
        'min_length': 8,
      }
    },
    {
      # Checks whether the password occurs in a list of common passwords
      'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
      # Checks whether the password isn’t entirely numeric
      'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    }
  ]
  ```

- Store passwords using `make-password` utility function to hash a plain-text password.

  ```python
  from django.contrib.auth.hashers import make_password
  #...
  hashed_pwd = make_password('plaintext_password')
  ```

- Check a plaintext password against a hashed password by using the  `check-password` utility function.

  ```python
  from django.contrib.auth.hashers import check_password
  #...
  plain_pwd = 'plaintext_password'
  hashed_pwd = 'hashed_password_from_database'

  if check_password(plain_pwd, hashed_pwd):
    print("The password is correct.")
  else:
    print("The password is incorrect.")
  ```

## Key Management

The `SECRET_KEY` parameter in settings.py is used for cryptographic signing and should be kept confidential. Consider the following recommendations:

- Generate a key at least 50 characters or more, containing a mix of letters, digits, and symbols.
- Ensure that the `SECRET_KEY` is generated using a strong random generator, such as `get_random_secret_key()` function in Django.
- Avoid hard coding the `SECRET_KEY` value in settings.py or any other location. Consider storing the key-value in environment variables or secrets managers.

  ```python
  import os
  SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY')
  ```

- Regularly rotate the key, keeping in mind that this action can invalidate sessions, password reset tokens, etc. Rotate the key immediately it if it ever gets exposed.

## Headers

Include the `django.middleware.security.SecurityMiddleware` module in the `MIDDLEWARE` setting in your project's `settings.py` to add security-related headers to your responses. This module is used to set the following parameters:

- `SECURE_CONTENT_TYPE_NOSNIFF`: Set this key to `True`. Protects against MIME type sniffing attacks by enabling the header `X-Content-Type-Options: nosniff`.
- `SECURE_HSTS_SECONDS`: Ensures the site is only accessible via HTTPS.

Include the `django.middleware.clickjacking.XFrameOptionsMiddleware` module in the `MIDDLEWARE` setting in your project's `settings.py` (This module should be listed after the `django.middleware.security.SecurityMiddleware` module as ordering is important). This module is used to set the following parameters:

- `X_FRAME_OPTIONS`: Set this key to 'DENY' or 'SAMEORIGIN'. This setting adds the `X-Frame-Options` header to all HTTP responses. This protects against clickjacking attacks.

## Content Security Policy

Django does not provide built-in Content Security Policy (CSP) support by default. CSP can be implemented using third-party libraries such as `django-csp` or by configuring HTTP response headers.

For more details:

- [OWASP Content Security Policy Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html)
- [Django Security Documentation](https://docs.djangoproject.com/en/stable/topics/security/)

## Cookies

- `SESSION_COOKIE_SECURE`: Set this key to `True` in the `settings.py` file. This will send the session cookie over secure (HTTPS) connections only.
- `CSRF_COOKIE_SECURE`: Set this key to `True` in the `settings.py` file. This will ensure that the CSRF cookie is sent over secure connections only.
- Whenever you set a custom cookie in a view using the `HttpResponse.set_cookie()` method, make sure to set its secure parameter to `True`.

  ```python
  response = HttpResponse("Some response")
  response.set_cookie('my_cookie', 'cookie_value', secure=True)
  ```

## Cross Site Request Forgery (CSRF)

- Include the `django.middleware.csrf.CsrfViewMiddleware` module in the `MIDDLEWARE` setting in your project's `settings.py` to add CSRF related headers to your responses.
- In forms use the `{% csrf_token %}` template tag to include the CSRF token. A sample is shown below.

  ```html
  <form method="post">
      {% csrf_token %}
      <!-- Your form fields here -->
  </form>
  ```

- For AJAX calls, the CSRF token for the request has to be extracted prior to being used in the AJAX call.
- Additional recommendations and controls can be found at Django's [Cross Site Request Forgery protection](https://docs.djangoproject.com/en/5.2/ref/csrf/) documentation.

## Cross Site Scripting (XSS)

The recommendations in this section are in addition to XSS recommendations already mentioned previously.

- Use the built-in template system to render templates in Django. Refer to Django's [Automatic HTML escaping](https://docs.djangoproject.com/en/5.2/ref/templates/language/#automatic-html-escaping) documentation to learn more.
- Try to avoid using the `safe` filter (or `mark_safe` function) to disable Django's automatic template escaping. If you do need to use it, make sure the input is from a trusted source. Extra caution is required when handling user-controlled inputs.
- Use the [`json_script`](https://docs.djangoproject.com/en/5.2/ref/templates/builtins/#json-script) template filter for passing data to JavaScript in Django templates.
- Refer to Django's [Cross Site Scripting (XSS) protection](https://docs.djangoproject.com/en/5.2/topics/security/#cross-site-scripting-xss-protection) documentation to learn more.

## HTTPS

- Include the `django.middleware.security.SecurityMiddleware` module in the `MIDDLEWARE` setting in your project's `settings.py` if not already added.
- Set the `SECURE_SSL_REDIRECT = True` in the `settings.py` file to ensure that all communication is over HTTPS. This will redirect any HTTP requests automatically to HTTPS. This is also a 301 (permanent) redirect, so your browser will remember the redirect for subsequent requests.
- If your Django application is behind a proxy or load balancer, set the `SECURE_PROXY_SSL_HEADER` setting so that Django can detect the original request's protocol. For further details refer to [SECURE_PROXY_SSL_HEADER documentation](https://docs.djangoproject.com/en/5.2/ref/settings/#secure-proxy-ssl-header).

## Admin panel URL

It is advisable to modify the default URL leading to the admin panel (example.com/admin/), in order to slightly increase the difficulty for automated attacks. Here’s how to do it:

In the default app folder within your project, locate the `urls.py` file managing the top-level URLs. Within the file, modify the `urlpatterns` variable, a list, so that the URL leading to `admin.site.urls` is different from "admin/". This approach adds an extra layer of security by obscuring the common endpoint used for administrative access.

## Django's built-in command `check --deploy`

Django has built-in command [`check --deploy`](https://docs.djangoproject.com/en/stable/ref/django-admin/#cmdoption-check-deploy) for security checks. Example:

```text
$ ./manage.py check --deploy
System check identified some issues:

WARNINGS:
?: (security.W004) You have not set a value for the SECURE_HSTS_SECONDS setting. If your entire site is served only over SSL, you may want to consider setting a value and enabling HTTP Strict Transport Security. Be sure to read the documentation first; enabling HSTS carelessly can cause serious, irreversible problems.
?: (security.W008) Your SECURE_SSL_REDIRECT setting is not set to True. Unless your site should be available over both SSL and non-SSL connections, you may want to either set this setting True or configure a load balancer or reverse-proxy server to redirect all connections to HTTPS.
?: (security.W009) Your SECRET_KEY has less than 50 characters, less than 5 unique characters, or it's prefixed with 'django-insecure-' indicating that it was generated automatically by Django. Please generate a long and random value, otherwise many of Django's security-critical features will be vulnerable to attack.
?: (security.W012) SESSION_COOKIE_SECURE is not set to True. Using a secure-only session cookie makes it more difficult for network traffic sniffers to hijack user sessions.
?: (security.W016) You have 'django.middleware.csrf.CsrfViewMiddleware' in your MIDDLEWARE, but you have not set CSRF_COOKIE_SECURE to True. Using a secure-only CSRF cookie makes it more difficult for network traffic sniffers to steal the CSRF token.
?: (security.W018) You should not have DEBUG set to True in deployment.
?: (security.W020) ALLOWED_HOSTS must not be empty in deployment.

System check identified 7 issues (0 silenced).
```

You can harden your Django project by addressing the warnings generated by this command.

## References

Additional documentation -

- [Clickjacking Protection](https://docs.djangoproject.com/en/5.2/topics/security/#clickjacking-protection)
- [Security Middleware](https://docs.djangoproject.com/en/5.2/ref/middleware/#module-django.middleware.security)

</section>

<section id="django-security-translation-panel" className="tabPanel translationPanel contentPanel">

## はじめに

Django フレームワークは強力な Python Web フレームワークであり、一般的な Web 脆弱性を防ぐためにそのまま利用できる組み込みセキュリティ機能を備えています。このチートシートは、開発者が安全な Django アプリケーションを開発するために実施できる対策とセキュリティ上のヒントを示します。Django アプリケーションのセキュリティ態勢を高めるため、一般的な脆弱性を対象にしています。各項目には、Django 環境に固有の簡潔な説明と関連するコードサンプルがあります。

Django フレームワークは、セキュアバイデフォルトを目指した組み込みセキュリティ機能を提供します。これらの機能は柔軟でもあり、開発者が複雑なユースケースでコンポーネントを再利用できるようにしています。一方で、そのコンポーネントの内部動作に詳しくない開発者が、安全でない方法で設定してしまう状況も生まれます。このチートシートは、そのようなユースケースの一部を列挙することを目的としています。

## 一般的な推奨事項

- セキュリティ脆弱性に追随するため、Django とアプリケーションの依存関係を常に最新に保ちます。
- 本番環境では、アプリケーションが決して `DEBUG` モードにならないようにします。本番で `DEBUG = True` を実行してはいけません。
- ブルートフォース攻撃を防ぐため、[`django_ratelimit`](https://django-ratelimit.readthedocs.io/en/stable/) や [`django-axes`](https://django-axes.readthedocs.io/en/latest/index.html) のようなパッケージを使用します。

## 認証

- ログイン、ログアウト、パスワード変更などのユーザー認証操作に関するビューとフォームには、`django.contrib.auth` アプリを使用します。`settings.py` ファイルの `INSTALLED_APPS` 設定に、このモジュールと依存関係である `django.contrib.contenttypes`、`django.contrib.sessions` を含めます。

  ```python
  INSTALLED_APPS = [
      # ...
      'django.contrib.auth',
      'django.contrib.contenttypes',
      'django.contrib.sessions',
      # ...
  ]
  ```

- 認証済みユーザーだけがビューにアクセスできるように、`@login_required` デコレータを使用します。以下のサンプルコードは `@login_required` の使用例です。

  ```python
  from django.contrib.auth.decorators import login_required

  # User is redirected to default login page if not authenticated.
  @login_required
  def my_view(request):
    # Your view logic

  # User is redirected to custom '/login-page/' if not authenticated.
  @login_required(login_url='/login-page/')
  def my_view(request):
    # Your view logic
  ```

- パスワードポリシーを適用するため、パスワードバリデータを使用します。アプリケーションで必要な特定のバリデータを含めるように、`settings.py` ファイルの `AUTH_PASSWORD_VALIDATORS` 設定を追加または更新します。

  ```python
  AUTH_PASSWORD_VALIDATORS = [
    {
      # Checks the similarity between the password and a set of attributes of the user.
      'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
      'OPTIONS': {
        'user_attributes': ('username', 'email', 'first_name', 'last_name'),
        'max_similarity': 0.7,
      }
    },
    {
      # Checks whether the password meets a minimum length.
      'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
      'OPTIONS': {
        'min_length': 8,
      }
    },
    {
      # Checks whether the password occurs in a list of common passwords
      'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
      # Checks whether the password isn’t entirely numeric
      'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    }
  ]
  ```

- 平文パスワードをハッシュ化して保存するため、`make-password` ユーティリティ関数を使用します。

  ```python
  from django.contrib.auth.hashers import make_password
  #...
  hashed_pwd = make_password('plaintext_password')
  ```

- ハッシュ化されたパスワードと平文パスワードを照合するには、`check-password` ユーティリティ関数を使用します。

  ```python
  from django.contrib.auth.hashers import check_password
  #...
  plain_pwd = 'plaintext_password'
  hashed_pwd = 'hashed_password_from_database'

  if check_password(plain_pwd, hashed_pwd):
    print("The password is correct.")
  else:
    print("The password is incorrect.")
  ```

## 鍵管理

`settings.py` の `SECRET_KEY` パラメータは暗号学的署名に使用されるため、秘密に保つ必要があります。次の推奨事項を検討してください。

- 文字、数字、記号を組み合わせた 50 文字以上の鍵を生成します。
- Django の `get_random_secret_key()` 関数など、強力な乱数生成器を使用して `SECRET_KEY` が生成されるようにします。
- `settings.py` やその他の場所に `SECRET_KEY` の値をハードコードしないでください。キーと値は環境変数またはシークレットマネージャーに保存することを検討します。

  ```python
  import os
  SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY')
  ```

- 鍵を定期的にローテーションします。ただし、この操作によりセッション、パスワードリセットトークンなどが無効化される可能性がある点に注意してください。鍵が露出した場合は、ただちにローテーションします。

## ヘッダー

応答にセキュリティ関連ヘッダーを追加するため、プロジェクトの `settings.py` の `MIDDLEWARE` 設定に `django.middleware.security.SecurityMiddleware` モジュールを含めます。このモジュールは次のパラメータの設定に使用されます。

- `SECURE_CONTENT_TYPE_NOSNIFF`: このキーを `True` に設定します。`X-Content-Type-Options: nosniff` ヘッダーを有効にして、MIME タイプスニッフィング攻撃から保護します。
- `SECURE_HSTS_SECONDS`: サイトが HTTPS 経由でのみアクセスされるようにします。

プロジェクトの `settings.py` の `MIDDLEWARE` 設定に `django.middleware.clickjacking.XFrameOptionsMiddleware` モジュールを含めます。このモジュールは、順序が重要であるため `django.middleware.security.SecurityMiddleware` モジュールの後に記載する必要があります。このモジュールは次のパラメータの設定に使用されます。

- `X_FRAME_OPTIONS`: このキーを `'DENY'` または `'SAMEORIGIN'` に設定します。この設定は、すべての HTTP 応答に `X-Frame-Options` ヘッダーを追加します。これによりクリックジャッキング攻撃から保護します。

## Content Security Policy

Django はデフォルトでは組み込みの Content Security Policy (CSP) サポートを提供していません。CSP は、`django-csp` のようなサードパーティライブラリを使用するか、HTTP 応答ヘッダーを設定することで実装できます。

詳細:

- [OWASP Content Security Policy Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html)
- [Django Security Documentation](https://docs.djangoproject.com/en/stable/topics/security/)

## Cookie

- `SESSION_COOKIE_SECURE`: `settings.py` ファイルでこのキーを `True` に設定します。これにより、セッション Cookie はセキュアな (HTTPS) 接続でのみ送信されます。
- `CSRF_COOKIE_SECURE`: `settings.py` ファイルでこのキーを `True` に設定します。これにより、CSRF Cookie はセキュアな接続でのみ送信されます。
- ビューで `HttpResponse.set_cookie()` メソッドを使用してカスタム Cookie を設定する場合は、必ず `secure` パラメータを `True` に設定します。

  ```python
  response = HttpResponse("Some response")
  response.set_cookie('my_cookie', 'cookie_value', secure=True)
  ```

## クロスサイトリクエストフォージェリ (CSRF)

- 応答に CSRF 関連ヘッダーを追加するため、プロジェクトの `settings.py` の `MIDDLEWARE` 設定に `django.middleware.csrf.CsrfViewMiddleware` モジュールを含めます。
- フォームでは、CSRF トークンを含めるために `{% csrf_token %}` テンプレートタグを使用します。以下にサンプルを示します。

  ```html
  <form method="post">
      {% csrf_token %}
      <!-- Your form fields here -->
  </form>
  ```

- AJAX 呼び出しでは、リクエストで使用する前に CSRF トークンを抽出する必要があります。
- 追加の推奨事項と制御策は、Django の [Cross Site Request Forgery protection](https://docs.djangoproject.com/en/5.2/ref/csrf/) ドキュメントで確認できます。

## クロスサイトスクリプティング (XSS)

このセクションの推奨事項は、前述の XSS 推奨事項に追加されるものです。

- Django でテンプレートをレンダリングするには、組み込みテンプレートシステムを使用します。詳細は Django の [Automatic HTML escaping](https://docs.djangoproject.com/en/5.2/ref/templates/language/#automatic-html-escaping) ドキュメントを参照してください。
- Django の自動テンプレートエスケープを無効にする `safe` フィルタ、または `mark_safe` 関数の使用は避けるようにします。使用する必要がある場合は、入力が信頼できるソースからのものであることを確認してください。ユーザー制御入力を扱う場合は、特に注意が必要です。
- Django テンプレートで JavaScript にデータを渡すには、[`json_script`](https://docs.djangoproject.com/en/5.2/ref/templates/builtins/#json-script) テンプレートフィルタを使用します。
- 詳細は Django の [Cross Site Scripting (XSS) protection](https://docs.djangoproject.com/en/5.2/topics/security/#cross-site-scripting-xss-protection) ドキュメントを参照してください。

## HTTPS

- まだ追加していない場合は、プロジェクトの `settings.py` の `MIDDLEWARE` 設定に `django.middleware.security.SecurityMiddleware` モジュールを含めます。
- すべての通信が HTTPS 経由になるように、`settings.py` ファイルで `SECURE_SSL_REDIRECT = True` を設定します。これにより、HTTP リクエストは自動的に HTTPS にリダイレクトされます。これは 301 (恒久的) リダイレクトでもあるため、ブラウザは後続のリクエストでもそのリダイレクトを記憶します。
- Django アプリケーションがプロキシまたはロードバランサーの背後にある場合は、Django が元のリクエストのプロトコルを検出できるように `SECURE_PROXY_SSL_HEADER` 設定を行います。詳細は [SECURE_PROXY_SSL_HEADER documentation](https://docs.djangoproject.com/en/5.2/ref/settings/#secure-proxy-ssl-header) を参照してください。

## 管理パネル URL

自動攻撃の難易度をわずかに上げるため、管理パネルにつながるデフォルト URL (`example.com/admin/`) を変更することが推奨されます。方法は次のとおりです。

プロジェクト内のデフォルトアプリフォルダで、トップレベル URL を管理する `urls.py` ファイルを探します。そのファイル内で、リストである `urlpatterns` 変数を変更し、`admin.site.urls` につながる URL が `"admin/"` とは異なるものになるようにします。この方法は、管理アクセスでよく使われるエンドポイントを隠すことで、追加のセキュリティ層を加えます。

## Django 組み込みコマンド `check --deploy`

Django には、セキュリティチェック用の組み込みコマンド [`check --deploy`](https://docs.djangoproject.com/en/stable/ref/django-admin/#cmdoption-check-deploy) があります。例:

```text
$ ./manage.py check --deploy
System check identified some issues:

WARNINGS:
?: (security.W004) You have not set a value for the SECURE_HSTS_SECONDS setting. If your entire site is served only over SSL, you may want to consider setting a value and enabling HTTP Strict Transport Security. Be sure to read the documentation first; enabling HSTS carelessly can cause serious, irreversible problems.
?: (security.W008) Your SECURE_SSL_REDIRECT setting is not set to True. Unless your site should be available over both SSL and non-SSL connections, you may want to either set this setting True or configure a load balancer or reverse-proxy server to redirect all connections to HTTPS.
?: (security.W009) Your SECRET_KEY has less than 50 characters, less than 5 unique characters, or it's prefixed with 'django-insecure-' indicating that it was generated automatically by Django. Please generate a long and random value, otherwise many of Django's security-critical features will be vulnerable to attack.
?: (security.W012) SESSION_COOKIE_SECURE is not set to True. Using a secure-only session cookie makes it more difficult for network traffic sniffers to hijack user sessions.
?: (security.W016) You have 'django.middleware.csrf.CsrfViewMiddleware' in your MIDDLEWARE, but you have not set CSRF_COOKIE_SECURE to True. Using a secure-only CSRF cookie makes it more difficult for network traffic sniffers to steal the CSRF token.
?: (security.W018) You should not have DEBUG set to True in deployment.
?: (security.W020) ALLOWED_HOSTS must not be empty in deployment.

System check identified 7 issues (0 silenced).
```

このコマンドが生成する警告に対処することで、Django プロジェクトを堅牢化できます。

</section>

<section id="django-security-bilingual-panel" className="tabPanel bilingualPanel">

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Introduction

The Django framework is a powerful Python web framework, and it comes with built-in security features that can be used out-of-the-box to prevent common web vulnerabilities. This cheat sheet lists actions and security tips developers can take to develop secure Django applications. It aims to cover common vulnerabilities to increase the security posture of your Django application. Each item has a brief explanation and relevant code samples that are specific to the Django environment.

The Django framework provides some built-in security features that aim to be secure-by-default. These features are also flexible to empower a developer to re-use components for complex use-cases. This opens up scenarios where developers unfamiliar with the inner workings of the components can configure them in an insecure way. This cheat sheet aims to enumerate some such use cases.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## はじめに

Django フレームワークは強力な Python Web フレームワークであり、一般的な Web 脆弱性を防ぐためにそのまま利用できる組み込みセキュリティ機能を備えています。このチートシートは、開発者が安全な Django アプリケーションを開発するために実施できる対策とセキュリティ上のヒントを示します。Django アプリケーションのセキュリティ態勢を高めるため、一般的な脆弱性を対象にしています。各項目には、Django 環境に固有の簡潔な説明と関連するコードサンプルがあります。

Django フレームワークは、セキュアバイデフォルトを目指した組み込みセキュリティ機能を提供します。これらの機能は柔軟でもあり、開発者が複雑なユースケースでコンポーネントを再利用できるようにしています。一方で、そのコンポーネントの内部動作に詳しくない開発者が、安全でない方法で設定してしまう状況も生まれます。このチートシートは、そのようなユースケースの一部を列挙することを目的としています。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## General Recommendations

- Always keep Django and your application's dependencies up-to-date to keep up with security vulnerabilities.
- Ensure that the application is never in `DEBUG` mode in a production environment. Never run `DEBUG = True` in production.
- Use packages like [`django_ratelimit`](https://django-ratelimit.readthedocs.io/en/stable/) or [`django-axes`](https://django-axes.readthedocs.io/en/latest/index.html) to prevent brute-force attacks.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 一般的な推奨事項

- セキュリティ脆弱性に追随するため、Django とアプリケーションの依存関係を常に最新に保ちます。
- 本番環境では、アプリケーションが決して `DEBUG` モードにならないようにします。本番で `DEBUG = True` を実行してはいけません。
- ブルートフォース攻撃を防ぐため、[`django_ratelimit`](https://django-ratelimit.readthedocs.io/en/stable/) や [`django-axes`](https://django-axes.readthedocs.io/en/latest/index.html) のようなパッケージを使用します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Authentication

- Use `django.contrib.auth` app for views and forms for user authentication operations such as login, logout, password change, etc. Include the module and its dependencies `django.contrib.contenttypes` and `django.contrib.sessions` in the `INSTALLED_APPS` setting in the `settings.py` file.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 認証

- ログイン、ログアウト、パスワード変更などのユーザー認証操作に関するビューとフォームには、`django.contrib.auth` アプリを使用します。`settings.py` ファイルの `INSTALLED_APPS` 設定に、このモジュールと依存関係である `django.contrib.contenttypes`、`django.contrib.sessions` を含めます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock shared">
<span className="bilingualLabel shared">コード・画像 (共通)</span>

```python
INSTALLED_APPS = [
    # ...
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    # ...
]
```

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Use the `@login_required` decorator to ensure that only authenticated users can access a view. The sample code below illustrates usage of `@login_required`.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- 認証済みユーザーだけがビューにアクセスできるように、`@login_required` デコレータを使用します。以下のサンプルコードは `@login_required` の使用例です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock shared">
<span className="bilingualLabel shared">コード・画像 (共通)</span>

```python
from django.contrib.auth.decorators import login_required

# User is redirected to default login page if not authenticated.
@login_required
def my_view(request):
  # Your view logic

# User is redirected to custom '/login-page/' if not authenticated.
@login_required(login_url='/login-page/')
def my_view(request):
  # Your view logic
```

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Use password validators for enforcing password policies. Add or update the `AUTH_PASSWORD_VALIDATORS` setting in the `settings.py` file to include specific validators required by your application.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- パスワードポリシーを適用するため、パスワードバリデータを使用します。アプリケーションで必要な特定のバリデータを含めるように、`settings.py` ファイルの `AUTH_PASSWORD_VALIDATORS` 設定を追加または更新します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock shared">
<span className="bilingualLabel shared">コード・画像 (共通)</span>

```python
AUTH_PASSWORD_VALIDATORS = [
  {
    # Checks the similarity between the password and a set of attributes of the user.
    'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    'OPTIONS': {
      'user_attributes': ('username', 'email', 'first_name', 'last_name'),
      'max_similarity': 0.7,
    }
  },
  {
    # Checks whether the password meets a minimum length.
    'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    'OPTIONS': {
      'min_length': 8,
    }
  },
  {
    # Checks whether the password occurs in a list of common passwords
    'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
  },
  {
    # Checks whether the password isn’t entirely numeric
    'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
  }
]
```

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Store passwords using `make-password` utility function to hash a plain-text password.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- 平文パスワードをハッシュ化して保存するため、`make-password` ユーティリティ関数を使用します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock shared">
<span className="bilingualLabel shared">コード・画像 (共通)</span>

```python
from django.contrib.auth.hashers import make_password
#...
hashed_pwd = make_password('plaintext_password')
```

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Check a plaintext password against a hashed password by using the  `check-password` utility function.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- ハッシュ化されたパスワードと平文パスワードを照合するには、`check-password` ユーティリティ関数を使用します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock shared">
<span className="bilingualLabel shared">コード・画像 (共通)</span>

```python
from django.contrib.auth.hashers import check_password
#...
plain_pwd = 'plaintext_password'
hashed_pwd = 'hashed_password_from_database'

if check_password(plain_pwd, hashed_pwd):
  print("The password is correct.")
else:
  print("The password is incorrect.")
```

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Key Management

The `SECRET_KEY` parameter in settings.py is used for cryptographic signing and should be kept confidential. Consider the following recommendations:

- Generate a key at least 50 characters or more, containing a mix of letters, digits, and symbols.
- Ensure that the `SECRET_KEY` is generated using a strong random generator, such as `get_random_secret_key()` function in Django.
- Avoid hard coding the `SECRET_KEY` value in settings.py or any other location. Consider storing the key-value in environment variables or secrets managers.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 鍵管理

`settings.py` の `SECRET_KEY` パラメータは暗号学的署名に使用されるため、秘密に保つ必要があります。次の推奨事項を検討してください。

- 文字、数字、記号を組み合わせた 50 文字以上の鍵を生成します。
- Django の `get_random_secret_key()` 関数など、強力な乱数生成器を使用して `SECRET_KEY` が生成されるようにします。
- `settings.py` やその他の場所に `SECRET_KEY` の値をハードコードしないでください。キーと値は環境変数またはシークレットマネージャーに保存することを検討します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock shared">
<span className="bilingualLabel shared">コード・画像 (共通)</span>

```python
import os
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY')
```

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Regularly rotate the key, keeping in mind that this action can invalidate sessions, password reset tokens, etc. Rotate the key immediately it if it ever gets exposed.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- 鍵を定期的にローテーションします。ただし、この操作によりセッション、パスワードリセットトークンなどが無効化される可能性がある点に注意してください。鍵が露出した場合は、ただちにローテーションします。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Headers

Include the `django.middleware.security.SecurityMiddleware` module in the `MIDDLEWARE` setting in your project's `settings.py` to add security-related headers to your responses. This module is used to set the following parameters:

- `SECURE_CONTENT_TYPE_NOSNIFF`: Set this key to `True`. Protects against MIME type sniffing attacks by enabling the header `X-Content-Type-Options: nosniff`.
- `SECURE_HSTS_SECONDS`: Ensures the site is only accessible via HTTPS.

Include the `django.middleware.clickjacking.XFrameOptionsMiddleware` module in the `MIDDLEWARE` setting in your project's `settings.py` (This module should be listed after the `django.middleware.security.SecurityMiddleware` module as ordering is important). This module is used to set the following parameters:

- `X_FRAME_OPTIONS`: Set this key to 'DENY' or 'SAMEORIGIN'. This setting adds the `X-Frame-Options` header to all HTTP responses. This protects against clickjacking attacks.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## ヘッダー

応答にセキュリティ関連ヘッダーを追加するため、プロジェクトの `settings.py` の `MIDDLEWARE` 設定に `django.middleware.security.SecurityMiddleware` モジュールを含めます。このモジュールは次のパラメータの設定に使用されます。

- `SECURE_CONTENT_TYPE_NOSNIFF`: このキーを `True` に設定します。`X-Content-Type-Options: nosniff` ヘッダーを有効にして、MIME タイプスニッフィング攻撃から保護します。
- `SECURE_HSTS_SECONDS`: サイトが HTTPS 経由でのみアクセスされるようにします。

プロジェクトの `settings.py` の `MIDDLEWARE` 設定に `django.middleware.clickjacking.XFrameOptionsMiddleware` モジュールを含めます。このモジュールは、順序が重要であるため `django.middleware.security.SecurityMiddleware` モジュールの後に記載する必要があります。このモジュールは次のパラメータの設定に使用されます。

- `X_FRAME_OPTIONS`: このキーを `'DENY'` または `'SAMEORIGIN'` に設定します。この設定は、すべての HTTP 応答に `X-Frame-Options` ヘッダーを追加します。これによりクリックジャッキング攻撃から保護します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Content Security Policy

Django does not provide built-in Content Security Policy (CSP) support by default. CSP can be implemented using third-party libraries such as `django-csp` or by configuring HTTP response headers.

For more details:

- [OWASP Content Security Policy Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html)
- [Django Security Documentation](https://docs.djangoproject.com/en/stable/topics/security/)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## Content Security Policy

Django はデフォルトでは組み込みの Content Security Policy (CSP) サポートを提供していません。CSP は、`django-csp` のようなサードパーティライブラリを使用するか、HTTP 応答ヘッダーを設定することで実装できます。

詳細:

- [OWASP Content Security Policy Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html)
- [Django Security Documentation](https://docs.djangoproject.com/en/stable/topics/security/)

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Cookies

- `SESSION_COOKIE_SECURE`: Set this key to `True` in the `settings.py` file. This will send the session cookie over secure (HTTPS) connections only.
- `CSRF_COOKIE_SECURE`: Set this key to `True` in the `settings.py` file. This will ensure that the CSRF cookie is sent over secure connections only.
- Whenever you set a custom cookie in a view using the `HttpResponse.set_cookie()` method, make sure to set its secure parameter to `True`.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## Cookie

- `SESSION_COOKIE_SECURE`: `settings.py` ファイルでこのキーを `True` に設定します。これにより、セッション Cookie はセキュアな (HTTPS) 接続でのみ送信されます。
- `CSRF_COOKIE_SECURE`: `settings.py` ファイルでこのキーを `True` に設定します。これにより、CSRF Cookie はセキュアな接続でのみ送信されます。
- ビューで `HttpResponse.set_cookie()` メソッドを使用してカスタム Cookie を設定する場合は、必ず `secure` パラメータを `True` に設定します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock shared">
<span className="bilingualLabel shared">コード・画像 (共通)</span>

```python
response = HttpResponse("Some response")
response.set_cookie('my_cookie', 'cookie_value', secure=True)
```

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Cross Site Request Forgery (CSRF)

- Include the `django.middleware.csrf.CsrfViewMiddleware` module in the `MIDDLEWARE` setting in your project's `settings.py` to add CSRF related headers to your responses.
- In forms use the `{% csrf_token %}` template tag to include the CSRF token. A sample is shown below.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## クロスサイトリクエストフォージェリ (CSRF)

- 応答に CSRF 関連ヘッダーを追加するため、プロジェクトの `settings.py` の `MIDDLEWARE` 設定に `django.middleware.csrf.CsrfViewMiddleware` モジュールを含めます。
- フォームでは、CSRF トークンを含めるために `{% csrf_token %}` テンプレートタグを使用します。以下にサンプルを示します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock shared">
<span className="bilingualLabel shared">コード・画像 (共通)</span>

```html
<form method="post">
    {% csrf_token %}
    <!-- Your form fields here -->
</form>
```

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- For AJAX calls, the CSRF token for the request has to be extracted prior to being used in the AJAX call.
- Additional recommendations and controls can be found at Django's [Cross Site Request Forgery protection](https://docs.djangoproject.com/en/5.2/ref/csrf/) documentation.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- AJAX 呼び出しでは、リクエストで使用する前に CSRF トークンを抽出する必要があります。
- 追加の推奨事項と制御策は、Django の [Cross Site Request Forgery protection](https://docs.djangoproject.com/en/5.2/ref/csrf/) ドキュメントで確認できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Cross Site Scripting (XSS)

The recommendations in this section are in addition to XSS recommendations already mentioned previously.

- Use the built-in template system to render templates in Django. Refer to Django's [Automatic HTML escaping](https://docs.djangoproject.com/en/5.2/ref/templates/language/#automatic-html-escaping) documentation to learn more.
- Try to avoid using the `safe` filter (or `mark_safe` function) to disable Django's automatic template escaping. If you do need to use it, make sure the input is from a trusted source. Extra caution is required when handling user-controlled inputs.
- Use the [`json_script`](https://docs.djangoproject.com/en/5.2/ref/templates/builtins/#json-script) template filter for passing data to JavaScript in Django templates.
- Refer to Django's [Cross Site Scripting (XSS) protection](https://docs.djangoproject.com/en/5.2/topics/security/#cross-site-scripting-xss-protection) documentation to learn more.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## クロスサイトスクリプティング (XSS)

このセクションの推奨事項は、前述の XSS 推奨事項に追加されるものです。

- Django でテンプレートをレンダリングするには、組み込みテンプレートシステムを使用します。詳細は Django の [Automatic HTML escaping](https://docs.djangoproject.com/en/5.2/ref/templates/language/#automatic-html-escaping) ドキュメントを参照してください。
- Django の自動テンプレートエスケープを無効にする `safe` フィルタ、または `mark_safe` 関数の使用は避けるようにします。使用する必要がある場合は、入力が信頼できるソースからのものであることを確認してください。ユーザー制御入力を扱う場合は、特に注意が必要です。
- Django テンプレートで JavaScript にデータを渡すには、[`json_script`](https://docs.djangoproject.com/en/5.2/ref/templates/builtins/#json-script) テンプレートフィルタを使用します。
- 詳細は Django の [Cross Site Scripting (XSS) protection](https://docs.djangoproject.com/en/5.2/topics/security/#cross-site-scripting-xss-protection) ドキュメントを参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## HTTPS

- Include the `django.middleware.security.SecurityMiddleware` module in the `MIDDLEWARE` setting in your project's `settings.py` if not already added.
- Set the `SECURE_SSL_REDIRECT = True` in the `settings.py` file to ensure that all communication is over HTTPS. This will redirect any HTTP requests automatically to HTTPS. This is also a 301 (permanent) redirect, so your browser will remember the redirect for subsequent requests.
- If your Django application is behind a proxy or load balancer, set the `SECURE_PROXY_SSL_HEADER` setting so that Django can detect the original request's protocol. For further details refer to [SECURE_PROXY_SSL_HEADER documentation](https://docs.djangoproject.com/en/5.2/ref/settings/#secure-proxy-ssl-header).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## HTTPS

- まだ追加していない場合は、プロジェクトの `settings.py` の `MIDDLEWARE` 設定に `django.middleware.security.SecurityMiddleware` モジュールを含めます。
- すべての通信が HTTPS 経由になるように、`settings.py` ファイルで `SECURE_SSL_REDIRECT = True` を設定します。これにより、HTTP リクエストは自動的に HTTPS にリダイレクトされます。これは 301 (恒久的) リダイレクトでもあるため、ブラウザは後続のリクエストでもそのリダイレクトを記憶します。
- Django アプリケーションがプロキシまたはロードバランサーの背後にある場合は、Django が元のリクエストのプロトコルを検出できるように `SECURE_PROXY_SSL_HEADER` 設定を行います。詳細は [SECURE_PROXY_SSL_HEADER documentation](https://docs.djangoproject.com/en/5.2/ref/settings/#secure-proxy-ssl-header) を参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Admin panel URL

It is advisable to modify the default URL leading to the admin panel (example.com/admin/), in order to slightly increase the difficulty for automated attacks. Here’s how to do it:

In the default app folder within your project, locate the `urls.py` file managing the top-level URLs. Within the file, modify the `urlpatterns` variable, a list, so that the URL leading to `admin.site.urls` is different from "admin/". This approach adds an extra layer of security by obscuring the common endpoint used for administrative access.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 管理パネル URL

自動攻撃の難易度をわずかに上げるため、管理パネルにつながるデフォルト URL (`example.com/admin/`) を変更することが推奨されます。方法は次のとおりです。

プロジェクト内のデフォルトアプリフォルダで、トップレベル URL を管理する `urls.py` ファイルを探します。そのファイル内で、リストである `urlpatterns` 変数を変更し、`admin.site.urls` につながる URL が `"admin/"` とは異なるものになるようにします。この方法は、管理アクセスでよく使われるエンドポイントを隠すことで、追加のセキュリティ層を加えます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Django's built-in command `check --deploy`

Django has built-in command [`check --deploy`](https://docs.djangoproject.com/en/stable/ref/django-admin/#cmdoption-check-deploy) for security checks. Example:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## Django 組み込みコマンド `check --deploy`

Django には、セキュリティチェック用の組み込みコマンド [`check --deploy`](https://docs.djangoproject.com/en/stable/ref/django-admin/#cmdoption-check-deploy) があります。例:

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock shared">
<span className="bilingualLabel shared">コード・画像 (共通)</span>

```text
$ ./manage.py check --deploy
System check identified some issues:

WARNINGS:
?: (security.W004) You have not set a value for the SECURE_HSTS_SECONDS setting. If your entire site is served only over SSL, you may want to consider setting a value and enabling HTTP Strict Transport Security. Be sure to read the documentation first; enabling HSTS carelessly can cause serious, irreversible problems.
?: (security.W008) Your SECURE_SSL_REDIRECT setting is not set to True. Unless your site should be available over both SSL and non-SSL connections, you may want to either set this setting True or configure a load balancer or reverse-proxy server to redirect all connections to HTTPS.
?: (security.W009) Your SECRET_KEY has less than 50 characters, less than 5 unique characters, or it's prefixed with 'django-insecure-' indicating that it was generated automatically by Django. Please generate a long and random value, otherwise many of Django's security-critical features will be vulnerable to attack.
?: (security.W012) SESSION_COOKIE_SECURE is not set to True. Using a secure-only session cookie makes it more difficult for network traffic sniffers to hijack user sessions.
?: (security.W016) You have 'django.middleware.csrf.CsrfViewMiddleware' in your MIDDLEWARE, but you have not set CSRF_COOKIE_SECURE to True. Using a secure-only CSRF cookie makes it more difficult for network traffic sniffers to steal the CSRF token.
?: (security.W018) You should not have DEBUG set to True in deployment.
?: (security.W020) ALLOWED_HOSTS must not be empty in deployment.

System check identified 7 issues (0 silenced).
```

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

You can harden your Django project by addressing the warnings generated by this command.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

このコマンドが生成する警告に対処することで、Django プロジェクトを堅牢化できます。

</div>
</div>

</section>
</div>

## References

<div className="contentPanel">

Additional documentation -

- [Clickjacking Protection](https://docs.djangoproject.com/en/5.2/topics/security/#clickjacking-protection)
- [Security Middleware](https://docs.djangoproject.com/en/5.2/ref/middleware/#module-django.middleware.security)

</div>

## Attribution

<div className="attributionFooter">

- Original: Django Security Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Django_Security_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: English original retained for comparison. Japanese translation added. Bilingual display generated from official source and local Japanese translation.
- Retrieved: 2026-05-21

</div>
