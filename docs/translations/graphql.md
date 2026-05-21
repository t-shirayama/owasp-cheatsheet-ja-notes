# GraphQLチートシート 日本語訳

## Attribution

- Original: GraphQL Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/GraphQL_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-21

## 日本語訳

# GraphQL チートシート

## はじめに

[GraphQL](https://graphql.org) は、もともと Facebook によって開発されたオープンソースのクエリ言語であり、REST や SOAP の代替として API を構築するために使用できます。API を構築する側と呼び出す側に本来備わった柔軟性を提供するため、2012 年の登場以来、人気を集めてきました。さまざまな言語で実装された GraphQL サーバーとクライアントがあります。GitHub、Credit Karma、Intuit、PayPal など、[多くの企業](https://foundation.graphql.org/)が GraphQL を使用しています。

このチートシートでは、GraphQL を扱う際に考慮すべきさまざまな領域についてガイダンスを提供します。

- すべての受信データに適切な[入力検証](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)チェックを適用します。
- 高コストなクエリは[サービス拒否 (DoS)](https://cheatsheetseries.owasp.org/cheatsheets/Denial_of_Service_Cheat_Sheet.html) につながるため、高コストすぎるクエリを制限または防止するチェックを追加します。
- API に適切な[アクセス制御](https://cheatsheetseries.owasp.org/cheatsheets/Access_Control_Cheat_Sheet.html)チェックがあることを確認します。
- 安全でないデフォルト設定 (過剰なエラー、イントロスペクション、GraphiQL など) を無効にします。

## 一般的な攻撃

- [インジェクション](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa8-injection.md) - 通常、以下を含みますが、これらに限定されません。
    - [SQL](https://owasp.org/www-community/attacks/SQL_Injection) および [NoSQL](https://www.netsparker.com/blog/web-security/what-is-nosql-injection/) インジェクション
    - [OS コマンドインジェクション](https://owasp.org/www-community/attacks/Command_Injection)
    - [SSRF](https://portswigger.net/web-security/ssrf) および [CRLF](https://owasp.org/www-community/vulnerabilities/CRLF_Injection) [インジェクション](https://www.acunetix.com/websitesecurity/crlf-injection/)/[リクエスト](https://portswigger.net/web-security/request-smuggling)[スマグリング](https://www.pentestpartners.com/security-blog/http-request-smuggling-a-how-to/)
- [DoS](https://owasp.org/www-community/attacks/Denial_of_Service) ([サービス拒否](https://www.cloudflare.com/learning/ddos/glossary/denial-of-service/))
- 壊れた認可の悪用: [不適切な](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa1-broken-object-level-authorization.md)アクセスまたは[過剰な](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa3-excessive-data-exposure.md)アクセス。これには [IDOR](https://portswigger.net/web-security/access-control/idor) が含まれます。
- バッチング攻撃。GraphQL 固有のブルートフォース攻撃手法です。
- 安全でないデフォルト設定の悪用

## ベストプラクティスと推奨事項

### 入力検証

厳格な入力検証を追加すると、インジェクションと DoS の防止に役立ちます。GraphQL の主な設計では、ユーザーが一つ以上の識別子を提供し、バックエンドには指定された識別子を使って HTTP、DB、その他の呼び出しを行う多数のデータフェッチャがあります。つまり、ユーザー入力は HTTP リクエスト、DB クエリ、その他のリクエストや呼び出しに含まれます。そのため、さまざまなインジェクション攻撃や DoS につながる可能性のあるインジェクションの機会が生まれます。

入力検証を適切に実施し、インジェクションを防止するための詳細については、OWASP チートシートの[入力検証](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)と一般的な[インジェクション防止](https://cheatsheetseries.owasp.org/cheatsheets/Injection_Prevention_Cheat_Sheet.html)を参照してください。

#### 一般的なプラクティス

すべての受信データを検証し、有効な値のみを許可します (つまり許可リスト)。

- [スカラー](https://graphql.org/learn/schema/#scalar-types)や[列挙型](https://graphql.org/learn/schema/#enumeration-types)など、具体的な GraphQL [データ型](https://graphql.org/learn/schema/#type-language)を使用します。より複雑な検証には、カスタム GraphQL [バリデータ](https://graphql.org/learn/validation/)を記述します。[カスタムスカラー](https://itnext.io/custom-scalars-in-graphql-9c26f43133f3)も役立つ場合があります。
- [ミューテーション入力のスキーマ](https://graphql.org/learn/schema/#input-types)を定義します。
- [許可する文字を列挙](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html#allow-list-vs-block-list)します。拒否リストは使用しません。
    - 許可文字のリストは厳格であるほどよいです。多くの場合、英数字かつ非 Unicode 文字のみを許可することがよい出発点になります。これは多くの攻撃を拒否できるためです。
- Unicode 入力を適切に処理するには、[単一の内部文字エンコーディング](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html#validating-free-form-unicode-text)を使用します。
- API とその検証の仕組みに関する過剰な情報を明かさないよう注意しながら、無効な入力を適切に[拒否](https://cheatsheetseries.owasp.org/cheatsheets/Error_Handling_Cheat_Sheet.html)します。

#### インジェクション防止

別のインタープリタ (SQL/NoSQL/ORM、OS、LDAP、XML など) に渡すことを意図した入力を扱う場合:

- パラメータ化ステートメントなど、安全な API を提供するライブラリ、モジュール、パッケージを常に選択します。
    - ツールを適切に使用できるよう、ドキュメントに従っていることを確認します。
    - ORM や ODM の使用はよい選択肢ですが、[ORM インジェクション](https://owasp.org/www-project-web-security-testing-guide/stable/4-Web_Application_Security_Testing/07-Input_Validation_Testing/05.7-Testing_for_ORM_Injection)などの欠陥を避けるには適切に使用しなければなりません。
- そのようなツールが利用できない場合は、対象インタープリタのベストプラクティスに従って、常に入力データをエスケープまたはエンコードします。
    - 十分に文書化され、積極的に保守されているエスケープ/エンコードライブラリを選択します。多くの言語やフレームワークでは、この機能が組み込まれています。

詳細については、以下のページを参照してください。

- [SQL Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)
- [NoSQL Injection Prevention](https://www.netsparker.com/blog/web-security/what-is-nosql-injection/)
- [LDAP Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/LDAP_Injection_Prevention_Cheat_Sheet.html)
- [OS Command Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/OS_Command_Injection_Defense_Cheat_Sheet.html)
- [XML Security](https://cheatsheetseries.owasp.org/cheatsheets/XML_Security_Cheat_Sheet.html) および [XXE Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/XML_External_Entity_Prevention_Cheat_Sheet.html)

#### プロセス検証

ユーザー入力を使用する場合、サニタイズまたは検証済みであっても、ユーザーがデータフローを制御できるようになる特定の目的には使用すべきではありません。たとえば、ユーザーが指定したホストに HTTP/リソースリクエストを行ってはいけません (絶対的なビジネス上の必要性がある場合を除きます)。

### DoS 防止

DoS は API の可用性と安定性に対する攻撃であり、API を低速化、無応答化、または完全に利用不能にする可能性があります。このチートシートでは、アプリケーションレベルおよび技術スタックの他の層で DoS 攻撃の可能性を制限するいくつかの方法を詳述します。DoS というトピック専用の[チートシート](https://cheatsheetseries.owasp.org/cheatsheets/Denial_of_Service_Cheat_Sheet.html)もあります。

GraphQL に固有の、DoS の可能性を制限するための推奨事項は次のとおりです。

- 受信クエリに深さ制限を追加します。
- 受信クエリに件数制限を追加します。
- 単一レスポンスで返せるデータ量を制限するために[ページネーション](https://graphql.org/learn/pagination/)を追加します。
- アプリケーション層、インフラストラクチャ層、またはその両方に合理的なタイムアウトを追加します。
- クエリコスト分析を実施し、クエリごとの最大許容コストを強制することを検討します。
- 基本的な DoS 攻撃を防止するために、IP またはユーザー (またはその両方) ごとに受信リクエストのレート制限を強制します。
- サーバー側で[バッチングとキャッシュ技法](https://graphql.org/learn/thinking-in-graphs/#batching-and-caching)を実装します (Facebook の [DataLoader](https://github.com/graphql/dataloader) を使用できます)。

#### クエリ制限 (深さと件数)

GraphQL では各クエリに深さ (ネストされたオブジェクトなど) があり、クエリで要求される各オブジェクトには件数 (あるオブジェクトを 99999999 件など) を指定できます。デフォルトでは、これらはいずれも無制限になり得るため、DoS につながる可能性があります。DoS を防止するには深さと件数に制限を設定すべきですが、GraphQL ではネイティブにサポートされていないため、通常は小さなカスタム実装が必要です。

これらの攻撃と深さおよび件数制限の追加方法の詳細については、[こちら](https://www.apollographql.com/blog/securing-your-graphql-api-from-malicious-queries/)と[こちら](https://www.howtographql.com/advanced/4-security/)のページを参照してください。[ページネーション](https://graphql.org/learn/pagination/)を追加することもパフォーマンスに役立ちます。

graphql-java を使用する API は、組み込みの [MaxQueryDepthInstrumentation](https://github.com/graphql-java/graphql-java/blob/master/src/main/java/graphql/analysis/MaxQueryDepthInstrumentation.java) を深さ制限に利用できます。JavaScript を使用する API は、深さ制限の実装に [graphql-depth-limit](https://www.npmjs.com/package/graphql-depth-limit)、件数制限の実装に [graphql-input-number](https://github.com/4Catalyzer/graphql-input-number) を使用できます。

深さ N の GraphQL クエリの例を次に示します。

```graphql
query evil {            # Depth: 0
  album(id: 42) {       # Depth: 1
    songs {             # Depth: 2
      album {           # Depth: 3
        ...             # Depth: ...
        album {id: N}   # Depth: N
      }
    }
  }
}
```

オブジェクトを 99999999 件要求する GraphQL クエリの例を次に示します。

```graphql
query {
  author(id: "abc") {
    posts(first: 99999999) {
      title
    }
  }
}
```

#### タイムアウト

タイムアウトを追加することは、単一リクエストが消費できるリソース量を制限する簡単な方法になり得ます。ただし、悪意のあるクエリがすでに過剰なリソースを消費した後でないとタイムアウトが発動しない場合があるため、常に有効とは限りません。タイムアウト要件は API とデータ取得メカニズムによって異なり、全体に適用できる単一のタイムアウト値はありません。

アプリケーションレベルでは、クエリとリゾルバ関数にタイムアウトを追加できます。この選択肢は、タイムアウトに達した時点でクエリ/解決処理を停止できるため、通常はより効果的です。GraphQL はクエリタイムアウトをネイティブにサポートしていないため、カスタムコードが必要です。GraphQL でタイムアウトを使用する方法の詳細については、[このブログ記事](https://medium.com/@leeb/graphql-query-timeout-5f059ac29b67)または以下の二つの例を参照してください。

JavaScript タイムアウト例

[この Stack Overflow の回答](https://stackoverflow.com/questions/36241655/graphql-js-limit-query-execution-time/36251150)からのコードスニペット:

```javascript
request.incrementResolverCount =  function () {
    var runTime = Date.now() - startTime;
    if (runTime > 10000) {  // a timeout of 10 seconds
      if (request.logTimeoutError) {
        logger('ERROR', `Request ${request.uuid} query execution timeout`);
      }
      request.logTimeoutError = false;
      throw 'Query execution has timeout. Field resolution aborted';
    }
    this.resolverCount++;
  };
```

[Instrumentation](https://www.graphql-java.com/documentation/instrumentation/) を使用した Java タイムアウト例

```java
public class TimeoutInstrumentation extends SimpleInstrumentation {
    @Override
    public DataFetcher<?> instrumentDataFetcher(
            DataFetcher<?> dataFetcher, InstrumentationFieldFetchParameters parameters
    ) {
        return environment ->
            Observable.fromCallable(() -> dataFetcher.get(environment))
                .subscribeOn(Schedulers.computation())
                .timeout(10, TimeUnit.SECONDS)  // timeout of 10 seconds
                .blockingFirst();
    }
}
```

インフラストラクチャタイムアウト

通常より簡単な、タイムアウトを追加する別の選択肢は、HTTP サーバー ([Apache/httpd](https://httpd.apache.org/)、[nginx](https://nginx.org/))、リバースプロキシ、またはロードバランサーにタイムアウトを追加することです。ただし、インフラストラクチャのタイムアウトは不正確であることが多く、アプリケーションレベルのものより容易にバイパスされる可能性があります。

#### クエリコスト分析

クエリコスト分析では、受信クエリ内のフィールドや型の解決にコストを割り当てます。これにより、実行コストが高すぎる、またはリソースを過剰に消費するクエリをサーバーが拒否できます。実装は容易ではなく、常に必要とは限りませんが、DoS を防止するための最も徹底したアプローチです。この制御の実装の詳細については、[このブログ記事](https://www.apollographql.com/blog/securing-your-graphql-api-from-malicious-queries/)の「Query Cost Analysis」を参照してください。

Apollo は次のように推奨しています。

> クエリコスト分析の実装に多大な時間を費やす前に、それが本当に必要であることを確認してください。悪質なクエリでステージング API をクラッシュさせたり遅くしたりできるか試して、どこまでできるか確認してください。もしかすると、その API にはこうしたネスト関係がないかもしれませんし、一度に数千件のレコードを問題なく取得でき、クエリコスト分析を必要としないかもしれません。

graphql-java を使用する API は、最大クエリ複雑度を強制するために組み込みの [MaxQueryComplexityInstrumentation](https://github.com/graphql-java/graphql-java/blob/master/src/main/java/graphql/analysis/MaxQueryComplexityInstrumentation.java) を利用できます。JavaScript を使用する API は、最大クエリコストを強制するために [graphql-cost-analysis](https://github.com/pa-bru/graphql-cost-analysis) または [graphql-validation-complexity](https://github.com/4Catalyzer/graphql-validation-complexity) を利用できます。

#### レート制限

IP またはユーザー単位 (匿名アクセスおよび未認可アクセスの場合) でレート制限を強制すると、単一ユーザーがサービスにリクエストを大量送信してパフォーマンスに影響を与える能力を制限できます。理想的には、WAF、API ゲートウェイ、または Web サーバー ([Nginx](https://www.nginx.com/)、[Apache](https://httpd.apache.org/)/[HTTPD](https://github.com/apache/httpd)) で実施し、レート制限追加の手間を減らします。

または、多少複雑になりますが、スロットリングをコード内に実装することもできます (容易ではありません)。GraphQL 固有のレート制限の詳細については、[こちら](https://www.howtographql.com/advanced/4-security/)の「Throttling」を参照してください。

#### サーバー側バッチングとキャッシュ

GraphQL API の効率を高め、リソース消費を削減するため、[バッチングとキャッシュ技法](https://graphql.org/learn/thinking-in-graphs/#batching-and-caching)を使用して、短い時間枠内で同じデータ片に対する重複リクエストを防止できます。Facebook の [DataLoader](https://github.com/graphql/dataloader) は、これを実装する方法の一つです。

#### システムリソース管理

API が使用できるリソース量 (CPU やメモリなど) を適切に制限しないと、API の応答性と可用性が損なわれ、DoS 攻撃に対して脆弱になります。一部の制限はオペレーティングシステムレベルで実施できます。

Linux では、[Control Groups (cgroups)](https://en.wikipedia.org/wiki/Cgroups)、[User Limits (ulimits)](https://linuxhint.com/linux_ulimit_command/)、[Linux Containers (LXC)](https://linuxcontainers.org/) の組み合わせを使用できます。

ただし、コンテナ化プラットフォームはこの作業をはるかに容易にする傾向があります。コンテナ使用時に DoS を防止する方法については、[Docker Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html) のリソース制限セクションを参照してください。

### アクセス制御

GraphQL API に適切なアクセス制御があることを確認するには、次を実施します。

- リクエスト元が、要求しているデータを閲覧またはミューテーション/変更する権限を持つことを常に検証します。これは [RBAC](https://en.wikipedia.org/wiki/Role-based_access_control) または他のアクセス制御メカニズムで実施できます。
    - これにより、[BOLA](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa1-broken-object-level-authorization.md) と [BFLA](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa5-broken-function-level-authorization.md) の両方を含む [IDOR](https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html) の問題を防止できます。
- エッジとノードの両方で認可チェックを強制します (ノードには認可チェックがなかったがエッジにはあった[バグ報告の例](https://hackerone.com/reports/489146)を参照)。
- [Interfaces](https://graphql.org/learn/schema/#interfaces) と [Unions](https://graphql.org/learn/schema/#union-types) を使用して、リクエスト元の権限に応じてオブジェクトプロパティを多くまたは少なく返せる、構造化された階層的なデータ型を作成します。
- Query と Mutation の [Resolvers](https://graphql.org/learn/execution/#root-fields-resolvers) を使用して、場合によっては RBAC ミドルウェアを用いながらアクセス制御検証を実施できます。
- 本番環境または公開アクセス可能な環境では、システム全体で[イントロスペクションクエリを無効化](https://lab.wallarm.com/why-and-how-to-disable-introspection-query-for-graphql-apis/)します。
- 本番環境または公開アクセス可能な環境では、[GraphiQL](https://github.com/graphql/graphiql) や同様のスキーマ探索ツールを無効化します。

#### 一般的なデータアクセス

GraphQL リクエストでは、オブジェクトを取得または変更するために、オブジェクトの直接 ID が一つ以上含まれることが一般的です。たとえば、特定の写真に対するリクエストには、その写真のデータベース上の主キーである ID が含まれる場合があります。他のリクエストと同様に、サーバーは呼び出し元が要求しているオブジェクトにアクセスできることを検証しなければなりません。しかし、開発者がオブジェクトの ID を持っていることは呼び出し元にアクセス権があることを意味すると誤って仮定する場合があります。

この場合にリクエスト元のアクセス権を検証しないことは、[Broken Object Level Authorization](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa1-broken-object-level-authorization.md)、別名 [IDOR](https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html) と呼ばれます。

GraphQL API が、意図していなくても ID を使ったオブジェクトへのアクセスをサポートしている可能性があります。Query オブジェクトに `node` または `nodes`、あるいはその両方のフィールドが存在することがあり、これらを使って `ID` によりオブジェクトへ直接アクセスできます。スキーマにこれらのフィールドがあるかどうかは、コマンドラインで次を実行して確認できます (`schema.json` に GraphQL スキーマが含まれていると仮定します): `cat schema.json | jq ".data.__schema.types[] | select(.name==\"Query\") | .fields[] | .name" | grep node`。

これらのフィールドをスキーマから削除すると機能は無効化されるはずですが、呼び出し元が要求しているオブジェクトにアクセスできることを検証するため、常に適切な認可チェックを適用すべきです。

#### クエリアクセス (データ取得)

GraphQL API の一部として、返却可能なさまざまなデータフィールドがあります。考慮すべきことの一つは、これらのフィールドに異なるアクセスレベルを設けるかどうかです。たとえば、すべての利用者がすべての利用可能フィールドを取得できるようにするのではなく、特定の利用者だけが特定のデータフィールドを取得できるようにしたい場合があります。これは、リクエスト元が取得しようとしているフィールドを読み取れるべきかどうかを確認するチェックをコードに追加することで実現できます。

#### ミューテーションアクセス (データ操作)

GraphQL は、最も一般的なユースケースであるデータ取得に加え、ミューテーション、つまりデータ操作をサポートしています。API がミューテーションを実装または許可する場合、どの利用者が API を通じてデータを変更できるかを制限するアクセス制御が必要になる場合があります。ミューテーションアクセス制御が必要な構成には、リクエスト元に読み取りアクセスのみを意図している API や、特定の当事者だけが特定フィールドを変更できるべき API が含まれます。

### バッチング攻撃

GraphQL は、[クエリバッチング](https://www.apollographql.com/blog/batching-client-graphql-queries-a685f5bcd41b/)とも呼ばれるリクエストのバッチ処理をサポートしています。これにより、呼び出し元は単一のネットワーク呼び出しで複数のクエリまたは複数のオブジェクトインスタンスに対するリクエストをバッチ処理できます。この仕組みは、[バッチング攻撃](https://lab.wallarm.com/graphql-batching-attack/)と呼ばれる攻撃を可能にします。これは GraphQL 固有のブルートフォース攻撃の一形態であり、通常、より高速で検知されにくい悪用を可能にします。クエリバッチングの最も一般的な方法は次のとおりです。

```javascript
[
  {
    query: < query 0 >,
    variables: < variables for query 0 >,
  },
  {
    query: < query 1 >,
    variables: < variables for query 1 >,
  },
  {
    query: < query n >
    variables: < variables for query n >,
  }
]
```

単一のバッチ化された GraphQL 呼び出しで、`droid` オブジェクトの複数の異なるインスタンスを要求するクエリ例を次に示します。

```javascript
query {
  droid(id: "2000") {
    name
  }
  second:droid(id: "2001") {
    name
  }
  third:droid(id: "2002") {
    name
  }
}
```

この場合、サーバーに保存されている可能性のあるすべての `droid` オブジェクトを、ごく少数のネットワークリクエストで列挙するために使用できます。標準的な REST API では、リクエスト元は要求したい異なる `droid` ID ごとに別々のネットワークリクエストを送信する必要があります。この種類の攻撃は、次の問題につながる可能性があります。

- アプリケーションレベルの DoS 攻撃 - 単一のネットワーク呼び出しに含まれる多数のクエリやオブジェクトリクエストにより、データベースがハングしたり、他の利用可能なリソース (メモリ、CPU、下流サービスなど) が枯渇したりする可能性があります。
- ユーザー、メールアドレス、ユーザー ID など、サーバー上のオブジェクトの列挙。
- パスワード、2 要素認証コード (OTP)、セッショントークン、その他の機密値のブルートフォース。
- WAF、RASP、IDS/IPS、SIEM、その他のセキュリティツールは、これらの攻撃が大量のネットワークトラフィックではなく単一のリクエストにしか見えないため、検知できない可能性が高いです。
- この攻撃は、Nginx やその他のプロキシ/ゲートウェイなどのツールにある既存のレート制限をバイパスする可能性が高いです。これらは生のリクエスト数を見ることに依存しているためです。

#### バッチング攻撃の緩和

この種類の攻撃を緩和するには、リクエストごとに適用できるよう、受信リクエストに対する制限をコードレベルに置くべきです。主な選択肢は三つあります。

- コード内でオブジェクトリクエストのレート制限を追加します。
- 機密オブジェクトに対するバッチングを防止します。
- 同時に実行できるクエリ数を制限します。

一つの選択肢は、呼び出し元が要求できるオブジェクト数に対してコードレベルのレート制限を作成することです。これは、バックエンドが呼び出し元が要求した異なるオブジェクトインスタンス数を追跡し、単一のネットワーク呼び出し内でオブジェクトリクエストをバッチ化していても、要求数が多すぎる場合にブロックすることを意味します。これは WAF などのツールが行うネットワークレベルのレート制限を再現するものです。

別の選択肢は、ユーザー名、メールアドレス、パスワード、OTP、セッショントークンなど、ブルートフォースされたくない機密オブジェクトに対するバッチングを防止することです。これにより、攻撃者は REST API のように、オブジェクトインスタンスごとに別々のネットワーク呼び出しを行わざるを得なくなります。これはネイティブにはサポートされていないため、カスタムソリューションが必要です。ただし、この制御が導入されると、他の標準的な制御が通常どおり機能し、ブルートフォースの防止に役立ちます。

バッチ化して同時に実行できる操作数を制限することも、DoS につながる GraphQL バッチング攻撃を緩和する別の選択肢です。ただし、これは万能策ではないため、他の方法と組み合わせて使用すべきです。

### セキュアな設定

デフォルトでは、ほとんどの GraphQL 実装には変更すべき安全でないデフォルト設定があります。

- 過剰なエラーメッセージを返さないようにします (スタックトレースとデバッグモードを無効にするなど)。
- 必要に応じて、イントロスペクションと GraphiQL を無効化または制限します。
- イントロスペクションが無効な場合の、入力ミスしたフィールドに対する候補提示

#### イントロスペクション + GraphiQL

GraphQL では多くの場合、イントロスペクションや GraphiQL がデフォルトで有効であり、認証を要求しません。これにより、API の利用者は API、スキーマ、ミューテーション、非推奨フィールド、場合によっては望ましくない「プライベートフィールド」についてすべて知ることができます。

API が外部クライアントに利用されるよう設計されている場合、これは意図した設定である可能性がありますが、API が内部専用に設計されている場合には問題にもなり得ます。隠ぺいによるセキュリティは推奨されませんが、漏えいを避けるためにイントロスペクションの削除を検討することはよい考えかもしれません。
API が公開利用される場合、認証されていない、または認可されていないユーザーに対して無効化することを検討してもよいでしょう。

内部 API では、最も簡単なアプローチはシステム全体でイントロスペクションを無効化することです。イントロスペクションを完全に無効化する方法については、[このページ](https://lab.wallarm.com/why-and-how-to-disable-introspection-query-for-graphql-apis/)を参照するか、GraphQL 実装のドキュメントを確認してください。実装がイントロスペクションの無効化をネイティブにサポートしていない場合、または一部の利用者/ロールにはこのアクセスを許可したい場合、承認済みの利用者だけがイントロスペクションシステムにアクセスできるよう、サービス内にフィルタを構築できます。

イントロスペクションが無効化されていても、攻撃者はブルートフォースによってフィールドを推測できることに注意してください。さらに GraphQL には、リクエスト元が指定したフィールド名が既存フィールドに似ている (ただし誤っている) 場合にヒントを返す組み込み機能があります (たとえば、リクエストに `usr` が含まれると、レスポンスで `Did you mean "user?"` と尋ねます)。イントロスペクションを無効化している場合、露出を減らすためにこの機能の無効化を検討すべきですが、すべての GraphQL 実装がそれをサポートしているわけではありません。[Shapeshifter](https://github.com/szski/shapeshifter) は、[これを実行できるはず](https://www.youtube.com/watch?v=NPDp7GHmMa0&t=2580)のツールの一つです。

_**イントロスペクションの無効化 - Java**_

```java
GraphQLSchema schema = GraphQLSchema.newSchema()
    .query(StarWarsSchema.queryType)
    .fieldVisibility( NoIntrospectionGraphqlFieldVisibility.NO_INTROSPECTION_FIELD_VISIBILITY )
    .build();
```

_**イントロスペクションと GraphiQL の無効化 - JavaScript**_

```javascript
app.use('/graphql', graphqlHTTP({
  schema: MySessionAwareGraphQLSchema,
+ validationRules: [NoIntrospection]
  graphiql: process.env.NODE_ENV === 'development',
}));
```

#### 過剰なエラーを返さない

本番環境の GraphQL API は、スタックトレースを返したりデバッグモードになっていたりすべきではありません。これを行う方法は実装固有ですが、サーバーが返すエラーをより適切に制御する一般的な方法の一つはミドルウェアを使用することです。Apollo Server で[過剰なエラーを無効化](https://www.apollographql.com/docs/apollo-server/data/errors/)するには、Apollo Server コンストラクタに `debug: false` を渡すか、`NODE_ENV` 環境変数を 'production' または 'test' に設定します。ただし、スタックトレースをユーザーには返さず内部的にログに記録したい場合は、エラーをマスクしてログに記録し、API の呼び出し元ではなく開発者が利用できるようにする方法について[こちら](https://www.apollographql.com/docs/apollo-server/data/errors/#masking-and-logging-errors)を参照してください。

## その他のリソース

### ツール

- [InQL Scanner](https://github.com/doyensec/inql) - GraphQL 用セキュリティスキャナ。指定されたスキーマからクエリとミューテーションを自動生成し、それをスキャナに渡す用途に特に有用です。
- [GraphiQL](https://github.com/graphql/graphiql) - スキーマ/オブジェクト探索
- [GraphQL Voyager](https://github.com/APIs-guru/graphql-voyager) - スキーマ/オブジェクト探索

### GraphQL セキュリティベストプラクティス + ドキュメント

- [Protecting GraphQL APIs from security threats - blog post](https://medium.com/swlh/protecting-your-graphql-api-from-security-vulnerabilities-e8afdfa6fbe4)
- [https://nordicapis.com/security-points-to-consider-before-implementing-graphql/](https://nordicapis.com/security-points-to-consider-before-implementing-graphql/)
- [Limiting resource usage to prevent DoS (timeouts, throttling, complexity management, depth limiting, etc.)](https://developer.github.com/v4/guides/resource-limitations/)
- [GraphQL Security Perspectives](https://www.abhaybhargav.com/from-the-trenches-diy-security-perspectives-of-graphql/)
- [A developer's security perspective of GraphQL](https://planes.studio/blog/how-to-survive-a-penetration-test-as-a-graph-ql-developer)

### GraphQL 攻撃に関する詳細

- [Some common GraphQL attacks + attacker mindset](https://blog.doyensec.com/2018/05/17/graphql-security-overview.html)
- [Bypassing permissions by smuggling parameters](https://labs.detectify.com/2018/03/14/graphql-abuse/)
- [Bug bounty writeup about GraphQL](https://medium.com/bugbountywriteup/graphql-voyager-as-a-tool-for-security-testing-86d3c634bcd9)
- [Security talk about Abusing GraphQL](https://www.youtube.com/watch?v=NPDp7GHmMa0)
- [Real](https://vulners.com/myhack58/MYHACK58:62201994269) [world](https://www.pentestpartners.com/security-blog/pwning-wordpress-graphql/) [attacks](https://hackerone.com/reports/419883) [against](https://vulners.com/hackerone/H1:435066) [GraphQL](https://www.jonbottarini.com/2018/01/02/abusing-internal-api-to-achieve-idor-in-new-relic/) [in the](https://about.gitlab.com/blog/2019/07/03/security-release-gitlab-12-dot-0-dot-3-released/#authorization-issues-in-graphql) past
- [Attack examples against GraphQL](https://raz0r.name/articles/looting-graphql-endpoints-for-fun-and-profit/)

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V4.3, V13.4 | GraphQL API の入力検証、DoS 防止、アクセス制御、バッチング攻撃対策、セキュアな設定 |
