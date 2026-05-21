# Django セキュリティチートシート 日本語訳

## Attribution

- Original: Django Security Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Django_Security_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-21

## 日本語訳

# Django セキュリティチートシート

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

## References

Additional documentation -

- [Clickjacking Protection](https://docs.djangoproject.com/en/5.2/topics/security/#clickjacking-protection)
- [Security Middleware](https://docs.djangoproject.com/en/5.2/ref/middleware/#module-django.middleware.security)

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V13.4 | Django の本番設定、認証、鍵管理、セキュリティヘッダー、Cookie、CSRF、XSS、HTTPS、デプロイ前チェック |
