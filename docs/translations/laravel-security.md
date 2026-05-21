# Laravel チートシート 日本語訳

## Attribution

- Original: Laravel Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Laravel_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-21

## 日本語訳

# Laravel チートシート

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

- `cookie` セッションストアを使用する場合、またはクライアントから読み取られたり改ざんされたりしてはならないデータを保存する場合は、Cookie 暗号化ミドルウェアを有効にしてください。一般に、この機能を無効にする必要がある非常に特殊なユースケースがない限り、有効にしておくべきです。このミドルウェアを有効にするには、`App\Http\Kernel` クラスの `web` ミドルウェアグループに `EncryptCookies` ミドルウェアを追加します。

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

Laravel の [Blade テンプレートエンジン](https://laravel.com/docs/blade) には、PHP の `htmlspecialchars` 関数を使って変数を自動的にエスケープし、XSS 攻撃から保護する echo 文 `{{ }}` があります。

Laravel は、エスケープされていないデータを表示するための非エスケープ構文 `{!! !!}` も提供しています。これは信頼できないデータに対して使用してはいけません。使用すると、アプリケーションが XSS 攻撃を受ける可能性があります。

たとえば、Blade テンプレートのいずれかに次のような記述がある場合、脆弱性につながります。

```php
{!! request()->input('somedata') !!}
```

一方、次の記述は安全です。

```php
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

Laravel は、`VerifyCSRFToken` ミドルウェアによって CSRF 保護を標準で提供します。一般に、`App\Http\Kernel` クラスの `web` ミドルウェアグループにこのミドルウェアが含まれていれば、十分に保護されます。

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

## References

- [Laravel Documentation on Authentication](https://laravel.com/docs/authentication)
- [Laravel Documentation on Authorization](https://laravel.com/docs/authorization)
- [Laravel Documentation on CSRF](https://laravel.com/docs/csrf)
- [Laravel Documentation on Validation](https://laravel.com/docs/validation)

## ASVS との対応

Laravel アプリケーションにおける認証、セッション管理、入力検証、インジェクション対策、ファイルアップロード、CSRF、レート制限、セキュリティヘッダーに関する実装上の注意点として、ASVS の関連要件を満たすための補助資料として参照できます。
