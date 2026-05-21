# Symfony チートシート 日本語訳

## Attribution

- Original: Symfony Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Symfony_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-21

## 日本語訳

# Symfony チートシート

## はじめに

このチートシートは、Symfony フレームワークを使用してアプリケーションを構築する開発者に、セキュリティ上のヒントを提供することを目的としています。
Symfony アプリケーションを安全に保つため、一般的な脆弱性とベストプラクティスを扱います。

Symfony には組み込みのセキュリティ機構がありますが、開発者は構築するアプリケーションを安全にするために、潜在的な脆弱性とベストプラクティスを理解しておく必要があります。
このガイドは、Symfony のセキュリティ機能を理解し、それらを効果的に活用する重要性を強調しながら、一般的なセキュリティ課題を扱うことを目的としています。
Symfony を初めて使う開発者にも、セキュリティ実践を強化したい経験豊富な開発者にも、この文書は有用なリソースになります。
ここで示すガイドラインに従うことで、Symfony アプリケーションのセキュリティを強化し、利用者とデータにとってより安全なデジタル環境を作れます。

## 主要セクション

### クロスサイトスクリプティング (XSS)

クロスサイトスクリプティング (XSS) は、表示される変数に悪意のある JavaScript コードが注入される攻撃です。
たとえば、変数 name の値が `<script>alert('hello')</script>` であり、それを `Hello {{name}}` のように HTML に表示すると、HTML がレンダリングされたときに注入されたスクリプトが実行されます。

Symfony はデフォルトで Twig テンプレートを備えており、`{{ }}` 文で変数を囲むことで、特殊文字を含む変数を変換する **出力エスケープ** により、アプリケーションを XSS 攻撃から自動的に保護します。

```twig
<p>Hello {{name}}</p>
{# if 'name' is '<script>alert('hello!')</script>', Twig will output this:
'<p>Hello &lt;script&gt;alert(&#39;hello!&#39;)&lt;/script&gt;</p>' #}
```

信頼できる HTML コンテンツを含む変数をレンダリングする場合は、*Twig raw filter* を使用して出力エスケープを無効化できます。

```twig
<p>{{ product.title|raw }}</p>
{# if 'product.title' is 'Lorem <strong>Ipsum</strong>', Twig will output
exactly that instead of 'Lorem &lt;strong&gt;Ipsum&lt;/strong&gt;' #}
```

特定のブロックまたはテンプレート全体で出力エスケープを無効化する方法を理解するには、[Twig output escaping documentation](https://twig.symfony.com/doc/3.x/api.html#escaper-extension) を参照してください。

Symfony 固有ではない XSS 防止の詳細については、[Cross Site Scripting Prevention Cheatsheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html) を参照できます。

### クロスサイトリクエストフォージェリ (CSRF)

Symfony Form コンポーネントはフォームに CSRF トークンを自動的に含め、CSRF 攻撃に対する組み込みの保護を提供します。
Symfony はこれらのトークンを自動的に検証するため、アプリケーションを保護するための手動対応は不要です。

デフォルトでは、CSRF トークンは `_token` という hidden フィールドとして追加されますが、フォームごとに別の設定へカスタマイズできます。

```php
use Symfony\Component\Form\AbstractType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class PostForm extends AbstractType
{

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            // ...
            'csrf_protection' => true,  // enable/disable csrf protection for this form
            'csrf_field_name' => '_csrf_token',
            'csrf_token_id'   => 'post_item', // change arbitrary string used to generate
        ]);
    }

}
```

Symfony Forms を使用しない場合は、CSRF トークンを自分で生成し、検証できます。そのためには `symfony/security-csrf` コンポーネントをインストールする必要があります。

```bash
composer install symfony/security-csrf
```

`config/packages/framework.yaml` ファイルで CSRF 保護を有効化または無効化します。

```yaml
framework:
    csrf_protection: ~
```

次に、`csrf_token()` Twig 関数で CSRF トークンを生成する次の HTML Twig テンプレートを考えます。

```twig
<form action="{{ url('delete_post', { id: post.id }) }}" method="post">
    <input type="hidden" name="token" value="{{ csrf_token('delete-post') }}">
    <button type="submit">Delete post</button>
</form>
```

その後、コントローラで `isCsrfTokenValid()` 関数を使用して CSRF トークンの値を取得できます。

```php
use App\Entity\Post;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ExampleController extends AbstractController
{

    #[Route('/posts/{id}', methods: ['DELETE'], name: 'delete_post')]
    public function delete(Post $post, Request $request): Response
    {
        $token = $request->request->get('token')
        if($this->isCsrfTokenValid($token)) {
            // ...
        }

        // ...
    }
}
```

Symfony に限定されない CSRF の詳細については、[Cross-Site Request Forgery (CSRF) Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html) を参照できます。

### SQL インジェクション

SQL インジェクションは、攻撃者が SQL クエリを操作し、任意の SQL コードを実行できるようにするセキュリティ脆弱性です。
これにより、攻撃者がデータベース内のデータを閲覧、変更、削除できるようになり、不正アクセスやデータ損失につながる可能性があります。

Symfony は、特に Doctrine ORM (Object-Relational Mapping) と組み合わせて使用する場合、プリペアドステートメントのパラメータを通じて SQL インジェクションから保護します。
これにより、保護されていないクエリを誤って書くことは難しくなりますが、それでも不可能ではありません。
次の例は **安全でない DQL の使用** を示しています。

```php
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class ExampleController extends AbstractController {

    public function getPost(Request $request, EntityManagerInterface $em): Response
    {
        $id = $request->query->get('id');

        $dql = "SELECT p FROM App\Entity\Post p WHERE p.id = " . $id . ";";
        $query = $em->createQuery($dql);
        $post = $query->getSingleResult();

        // ...
    }
}

```

以下の例は、SQL インジェクションから保護するための **正しい方法** を示しています。

- エンティティリポジトリの組み込みメソッドを使用する

```php
$id = $request->query->get('id');
$post = $em->getRepository(Post::class)->findOneBy(['id' => $id]);
```

- Doctrine DQL Language を使用する

```php
$query = $em->createQuery("SELECT p FROM App\Entity\Post p WHERE p.id = :id");
$query->setParameter('id', $id);
$post = $query->getSingleResult();
```

- DBAL Query Builder を使用する

```php
$qb = $em->createQueryBuilder();
$post = $qb->select('p')
            ->from('posts','p')
            ->where('id = :id')
            ->setParameter('id', $id)
            ->getQuery()
            ->getSingleResult();
```

Doctrine の詳細については、[their documentation](https://www.doctrine-project.org/index.html) を参照できます。
Symfony または Doctrine に限定されない詳細については、[SQL Injection Prevention Cheatsheet](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html) も参照できます。

### コマンドインジェクション

コマンドインジェクションは、悪意のあるコードがアプリケーションシステムに注入され、実行される場合に発生します。
詳細については、[Command Injection Defense Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/OS_Command_Injection_Defense_Cheat_Sheet.html) を参照してください。

次の例では、入力をエスケープせずに exec() 関数を使用してファイルを削除しています。

```php
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\Routing\Annotation\Route;

#[AsController]
class ExampleController
{

    #[Route('/remove_file', methods: ['POST'])]
    public function removeFile(Request $request): Response
    {
        $filename =  $request->request->get('filename');
        exec(sprintf('rm %s', $filename));

        // ...
    }
}
```

上記のコードでは、ユーザー入力の検証がありません。ユーザーが `test.txt && rm -rf .` のような悪意のある値を指定した場合に何が起こり得るかを考えてください。このリスクを軽減するには、`exec()` の代わりに、この場合であれば `unlink()` のような PHP ネイティブ関数、または Symfony Filesystem Component の `remove()` メソッドを使用することが推奨されます。

ユースケースに関連する具体的な PHP ファイルシステム関数については、[PHP documentation](https://www.php.net/manual/en/refs.fileprocess.file.php) または [Symfony Filesystem Component documentation](https://symfony.com/doc/current/components/filesystem.html) を参照できます。

### オープンリダイレクト

オープンリダイレクトは、Web アプリケーションが検証されていないパラメータで指定された URL にユーザーをリダイレクトするときに発生するセキュリティ欠陥です。攻撃者はこの脆弱性を悪用して、ユーザーを悪意のあるサイトにリダイレクトします。

次の PHP コードスニペットでは、以下のようになっています。

```php
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapQueryParameter;
use Symfony\Component\Routing\Annotation\Route;

class ExampleController extends AbstractController
{

    #[Route('/dynamic_redirect', methods: ['GET'])]
    public function dynamicRedirect(#[MapQueryParameter] string $url): Response
    {
        return $this->redirect($url);
    }
}
```

このコントローラ関数は、適切な検証なしに `url` クエリパラメータに基づいてユーザーをリダイレクトします。攻撃者は悪意のある URL を作成し、疑っていないユーザーを悪意のあるサイトへ誘導できます。オープンリダイレクトを防ぐには、リダイレクト前に必ずユーザー入力を検証しサニタイズし、信頼できない入力をリダイレクト関数で直接使用しないでください。

### ファイルアップロードの脆弱性

ファイルアップロードの脆弱性は、アプリケーションがファイルアップロードを適切に検証および処理しない場合に発生するセキュリティ問題です。さまざまな攻撃を防ぐため、ファイルアップロードを安全に処理することが重要です。Symfony でこの問題を軽減するための一般的なガイドラインを以下に示します。

#### ファイル種別とサイズを検証する

許可されたファイル種別のみを受け入れるため、サーバー側でファイル種別を必ず検証してください。
また、サービス拒否攻撃を防ぎ、サーバーがアップロードを処理するために十分なリソースを持てるよう、アップロードファイルのサイズ制限も検討してください。

PHP Attributes を使用した例:

```php
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Validator\Constraints\File;

class UploadDto
{
    public function __construct(
        #[File(
            maxSize: '1024k',
            mimeTypes: [
                'application/pdf',
                'application/x-pdf',
            ],
        )]
        public readonly UploadedFile $file,
    ){}
}
```

Symfony Form を使用した例:

```php
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Validator\Constraints\File;

class FileForm extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('file', FileType::class, [
                'constraints' => [
                    new File([
                        'maxSize' => '1024k',
                        'mimeTypes' => [
                            'application/pdf',
                            'application/x-pdf',
                        ],
                    ]),
                ],
            ]);
    }
}
```

#### 一意なファイル名を使用する

既存ファイルの上書きを防ぐため、アップロードされた各ファイルに一意な名前を付けてください。一意な識別子と元のファイル名を組み合わせて、一意な名前を生成できます。

#### アップロードファイルを安全に保存する

直接アクセスを防ぐため、アップロードファイルは public ディレクトリの外に保存してください。保存に public ディレクトリを使用する場合は、アップロードディレクトリへのアクセスを拒否するよう Web サーバーを設定してください。

詳細については、[File Upload Cheatsheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html) を参照してください。

### ディレクトリトラバーサル

ディレクトリトラバーサルまたはパストラバーサル攻撃は、"../" の *dot-dot-slash* シーケンスとその変種、または絶対ファイルパスを使用して、ファイルを参照する入力データを操作し、サーバー上に保存されたファイルやディレクトリへアクセスすることを目的とします。
詳細については、[OWASP Path Traversal](https://owasp.org/www-community/attacks/Path_Traversal) を参照してください。

要求されたファイル位置の絶対パスが正しいかを検証するか、ファイル名入力からディレクトリ情報を取り除くことで、アプリケーションをディレクトリトラバーサル攻撃から保護できます。

- PHP の *realpath* 関数を使用してパスが存在するか確認し、そのパスがストレージディレクトリにつながることを確認する

```php
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapQueryParameter;
use Symfony\Component\Routing\Annotation\Route;

class ExampleController extends AbstractController
{

    #[Route('/download', methods: ['GET'])]
    public function download(#[MapQueryParameter] string $filename): Response
    {
        $storagePath = $this->getParameter('kernel.project_dir') . '/storage';
        $filePath = $storagePath . '/' . $filename;

        $realBase = realpath($storagePath);
        $realPath = realpath($filePath);

        if ($realPath === false || !str_starts_with($realPath, $realBase))
        {
            //Directory Traversal!
        }

        // ...

    }
}
```

- PHP の *basename* 関数でディレクトリ情報を取り除く

```php
// ...

$storagePath = $this->getParameter('kernel.project_dir') . '/storage';
$filePath = $storagePath . '/' . basename($filename);

// ...
```

### 依存関係の脆弱性

依存関係の脆弱性は、アプリケーションをさまざまなリスクにさらす可能性があるため、ベストプラクティスの採用が重要です。
すべての Symfony コンポーネントとサードパーティライブラリを最新の状態に保ってください。

PHP の依存関係マネージャである Composer を使用すると、PHP パッケージを簡単に更新できます。

```bash
composer update
```

複数の依存関係を使用している場合、その一部にセキュリティ脆弱性が含まれていることがあります。
この懸念に対処するため、Symfony には [Symfony Security Checker](https://symfony.com/doc/current/setup.html#checking-security-vulnerabilities) があります。このツールは、プロジェクト内の *composer.lock* ファイルを具体的に調べ、インストール済み依存関係に含まれる既知のセキュリティ脆弱性を特定し、Symfony プロジェクト内の潜在的なセキュリティ問題への対処を支援します。

Security Checker を使用するには、[Symfony CLI](https://github.com/symfony-cli/symfony-cli) で次のコマンドを実行します。

```bash
symfony check:security
```

### Cross-Origin Resource Sharing (CORS)

CORS は、あるドメインの Web アプリケーションが、別のドメインでホストされているリソースをどのように要求し、操作できるかを制御するために Web ブラウザに実装されているセキュリティ機能です。

Symfony では、`nelmio/cors-bundle` を使用して CORS ポリシーを管理できます。このバンドルにより、サーバー設定を変更せずに CORS ルールを正確に制御できます。

Composer でインストールするには、次を実行します。

```bash
composer require nelmio/cors-bundle
```

Symfony Flex 利用者の場合、インストールにより `config/packages` ディレクトリに基本設定ファイルが自動生成されます。*/API* プレフィックスで始まるルートの設定例を見てみましょう。

```yaml
# config/packages/nelmio_cors.yaml
nelmio_cors:
    defaults:
        origin_regex: true
        allow_origin: ['*']
        allow_methods: ['GET', 'OPTIONS', 'POST', 'PUT', 'PATCH', 'DELETE']
        allow_headers: ['*']
        expose_headers: ['Link']
        max_age: 3600
    paths:
        '^/api': ~  # ~ means that configurations for this path is inherited from defaults
```

### セキュリティ関連ヘッダー

Symfony アプリケーションのセキュリティを強化するため、レスポンスに次のような重要なセキュリティヘッダーを追加することが推奨されます。

- Strict-Transport-Security
- X-Frame-Options
- X-Content-Type-Options
- Content-Security-Policy
- X-Permitted-Cross-Domain-Policies
- Referrer-Policy
- Clear-Site-Data
- Cross-Origin-Embedder-Policy
- Cross-Origin-Opener-Policy
- Cross-Origin-Resource-Policy
- Cache-Control

個別のヘッダーの詳細については、[OWASP secure headers project](https://owasp.org/www-project-secure-headers/) を参照してください。

Symfony では、手動でこれらのヘッダーを追加することも、[ResponseEvent](https://symfony.com/doc/current/reference/events.html#kernel-response) をリッスンしてすべてのレスポンスに自動的に追加することも、Nginx や Apache などの Web サーバーを設定して追加することもできます。

```php
use Symfony\Component\HttpFoundation\Request;

$response = new Response();
$response->headers->set('X-Frame-Options', 'SAMEORIGIN');
```

### セッションと Cookie 管理

デフォルトでは、セッションは安全に設定され有効化されています。ただし、`config/packages/framework.yaml` の `framework.session` キー配下で手動制御できます。アプリケーションでより明確に安全性を意識できるよう、セッション設定で次を設定してください。

`cookie_secure` が明示的に `false` に設定されていないことを確認してください (デフォルトでは `true` に設定されています)。http only を `true` に設定すると、Cookie は JavaScript からアクセスできなくなります。

```yaml
cookie_httponly: true
```

短いセッション TTL 期間を設定してください。[OWASP's recommendations](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html) によると、高価値アプリケーションでは 2-5 分、低リスクアプリケーションでは 15-30 分のセッション TTL を目標にします。

```yaml
cookie_lifetime: 5
```

クロスオリジンリクエストから Cookie が送信されることを防ぐため、`cookie_samesite` は `lax` または `strict` に設定することが推奨されます。`lax` は、"safe" なトップレベルナビゲーションおよび同一サイトリクエストに Cookie を同送することを許可します。`strict` では、HTTP リクエストが同じドメインからのものでない場合、Cookie を送信できません。

```yaml
cookie_samesite: lax|strict
```

`cookie_secure` を `auto` に設定すると、Cookie は安全な接続でのみ送信されます。つまり、HTTPS では `true`、HTTP プロトコルでは `false` になります。

```yaml
cookie_secure: auto
```

OWASP は、セッションに関するより一般的な情報を [Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html) で提供しています。
[Cookie Security Guide](https://owasp.org/www-chapter-london/assets/slides/OWASPLondon20171130_Cookie_Security_Myths_Misconceptions_David_Johansson.pdf) も参照できます。

---
Symfony では、セッションはフレームワーク自体によって管理され、php.ini ファイルの `session.auto_start = 1` ディレクティブを通じた PHP のデフォルトセッション処理ではなく、Symfony のセッション処理機構に依存します。
PHP の `session.auto_start = 1` ディレクティブは、各リクエストでセッションを自動開始し、`session_start()` の明示的な呼び出しを迂回するために使用されます。ただし、Symfony でセッション管理を使用する場合は、競合や予期しない動作を防ぐため、`session.auto_start` を無効化することが推奨されます。

### 認証

[Symfony Security](https://symfony.com/doc/current/security.html) は、プロバイダ、ファイアウォール、アクセス制御を含む堅牢な認証システムを提供し、安全で制御されたアクセス環境を確保します。認証設定は `config/packages/security.yaml` で構成できます。

- **Providers**

    Symfony 認証は、データベース、LDAP、カスタムソースなど、さまざまなストレージ種別からユーザー情報を取得するためにプロバイダに依存します。プロバイダは、定義されたプロパティに基づいてユーザーを取得し、対応するユーザーオブジェクトを読み込みます。

    以下の例では、Doctrine を使用して一意識別子でユーザーを取得する [Entity User Provider](https://symfony.com/doc/current/security/user_providers.html#security-entity-user-provider) を示しています。

    ```yaml
    providers:
        app_user_provider:
            entity:
                class: App\Entity\User
                property: email
    ```

- **Firewalls**

    Symfony は、アプリケーションの異なる部分に対するセキュリティ設定を定義するためにファイアウォールを使用します。各ファイアウォールは、受信リクエストに対する特定のルールとアクションのセットを定義します。どのルートまたは URL を保護するか、使用する認証機構、未認可アクセスをどのように扱うかを指定することで、アプリケーションの異なる領域を保護します。ファイアウォールは、特定のパターン、リクエストメソッド、アクセス制御、認証プロバイダに関連付けることができます。

    ```yaml
    firewalls:
        dev: # disable security on routes used in development env
            pattern: ^/(_(profiler|wdt)|css|images|js)/
            security: false
        admin: # handle authentication in /admin pattern routes
            lazy: true
            provider: app_user_provider
            pattern: ^/admin
            custom_authenticator: App\Security\AdminAuthenticator
            logout:
                path: app_logout
                target: app_login
        main: # main firewall that include all remaining routes
            lazy: true
            provider: app_user_provider
    ```

- **Access Control**

    アクセス制御は、どのユーザーがアプリケーションの特定部分にアクセスできるかを決定します。これらのルールは、パスパターンと必要なロールまたは権限で構成されます。アクセス制御ルールは `access_control` キー配下で設定します。

    ```yaml
    access_control:
        - { path: ^/admin, roles: ROLE_ADMIN } # only user with ROLE_ADMIN role is allowed
        - { path: ^/login, roles: PUBLIC_ACCESS } # everyone can access this route
    ```

### エラーハンドリングによる情報開示

Symfony には堅牢なエラーハンドリングシステムがあります。デフォルトでは、Symfony アプリケーションはセキュリティ上の理由から、開発環境でのみ詳細なエラーメッセージを表示するよう設定されています。本番環境では、一般的なエラーページが表示されます。Symfony のエラーハンドリングシステムでは、異なる HTTP ステータスコードに基づいてエラーページをカスタマイズすることもでき、一貫したブランド体験を提供できます。さらに、Symfony は詳細なエラー情報をログに記録するため、開発者が問題を効率的に特定し解決する助けになります。

Symfony に限定されないエラーハンドリングの詳細については、[Error Handling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Error_Handling_Cheat_Sheet.html) を参照してください。

### 機密データ

Symfony では、API キーなどの設定を保存する最善の方法は、アプリケーションの配置場所に依存する環境変数を使用することです。
機密値のセキュリティを確保するため、Symfony は *secrets management system* を提供しており、値は暗号鍵を使用して追加でエンコードされ、**secrets** として保存されます。

API_KEY が secret として保存される例を考えます。

暗号鍵ペアを生成するには、次のコマンドを実行できます。秘密鍵ファイルは非常に機密性が高く、リポジトリにコミットすべきではありません。

```bash
bin/console secrets:generate-keys
```

このコマンドは、`config/secrets/env(dev|prod|etc.)` に API_KEY secret 用のファイルを生成します。

```bash
bin/console secret:set API_KEY
```

コード内では、環境変数と同じ方法で secret の値にアクセスできます。
同じ名前の環境変数と secret がある場合、**環境変数の値が常に secret を上書きする** ことに注意することが非常に重要です。

詳細については、[Symfony Secrets Documentation](https://symfony.com/doc/current/configuration/secrets.html) を参照してください。

### まとめ

- 本番環境ではアプリケーションがデバッグモードになっていないことを確認してください。デバッグモードを無効にするには、`APP_ENV` 環境変数を `prod` に設定します。

    ```ini
    APP_ENV=prod
    ```

- PHP 設定が安全であることを確認してください。安全な PHP 設定の詳細については、[PHP Configuration Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/PHP_Configuration_Cheat_Sheet.html) を参照できます。

- Web サーバーで SSL 証明書が適切に設定されていることを確認し、HTTP トラフィックを HTTPS にリダイレクトして HTTPS を強制するよう設定してください。

- アプリケーションのセキュリティ態勢を強化するため、セキュリティヘッダーを実装してください。

- セキュリティリスクを最小化するため、ファイルとディレクトリの権限が正しく設定されていることを確認してください。

- 本番データベースと重要ファイルの定期バックアップを実装してください。問題発生時にアプリケーションを迅速に復旧できるよう、復旧計画を用意してください。

- 既知の脆弱性を特定するため、セキュリティチェッカーを使用して依存関係をスキャンしてください。

- 本番環境の問題を迅速に特定し対処するため、監視ツールとエラーレポート機構の導入を検討してください。[Blackfire.io](https://www.blackfire.io) のようなツールを確認してください。

## 参考資料

- [Symfony CSRF Documentation](https://symfony.com/doc/current/security/csrf.html)
- [Symfony Twig Documentation](https://symfony.com/doc/current/templates.html)
- [Symfony Validation Documentation](https://symfony.com/doc/current/validation.html)
- [Symfony Blackfire Documentation](https://symfony.com/doc/current/the-fast-track/en/29-performance.html)
- [Doctrine Security Documentation](https://www.doctrine-project.org/projects/doctrine-dbal/en/3.7/reference/security.html)

## ASVS との対応

このチートシートは、XSS、CSRF、インジェクション、ファイルアップロード、セッション管理、認証、エラーハンドリング、機密情報管理など、Symfony アプリケーション実装時に ASVS の各セキュリティ要件を満たすための実践的な補助資料として利用できます。
