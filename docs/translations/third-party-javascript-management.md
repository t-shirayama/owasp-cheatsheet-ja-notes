# サードパーティ JavaScript 管理チートシート 日本語訳

## Attribution

- Original: Third Party Javascript Management Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Third_Party_Javascript_Management_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-21

## 日本語訳

# サードパーティ JavaScript 管理チートシート

## はじめに

タグ、つまりマーケティングタグや分析タグなどは、Web ページ上の小さな JavaScript 片です。JavaScript が無効な場合には HTML の画像要素であることもあります。これらは、Web ページ所有者がマーケティングに利用するために、Web 利用者の操作や閲覧コンテキストに関するデータを収集する目的で使われます。

サードパーティベンダの JavaScript タグ (以下、**タグ**) は、二つの種類に分けられます。

- ユーザーインターフェースタグ。
- 分析タグ。

ユーザーインターフェースタグは、ダイアログや画像の表示、テキストの変更など、DOM を変更するため、クライアント上で実行する必要があります。

分析タグは、直前に実行された利用者操作、ブラウザメタデータ、位置情報、ページメタデータなどの情報をマーケティング情報データベースへ送信します。分析タグの根拠は、何らかのマーケティング分析のために、利用者のブラウザ DOM からベンダへデータを提供することです。このデータは DOM で利用できるものであれば何でも含み得ます。データは、利用者のナビゲーションやクリックストリーム分析、表示する追加コンテンツを決めるための利用者識別、その他さまざまなマーケティング分析機能に使われます。

**ホスト**という用語は、利用者が訪問するショッピングサイトやニュースサイトなどの元のサイトを指します。このサイトは、利用者操作のマーケティング分析のためにサードパーティ JavaScript タグを含める、または取得して実行します。

## 主なリスク

最大の単一リスクは、サードパーティ JavaScript サーバが侵害され、元のタグ JavaScript に悪意のある JavaScript が注入されることです。これは 2018 年に発生しており、おそらくそれ以前にも発生しています。

Web アプリケーションでサードパーティ JS コードを呼び出す場合、特に次の三つのリスクを考慮する必要があります。

1. クライアントアプリケーションへの変更に対する制御の喪失。
2. クライアントシステム上での任意コード実行。
3. 機密情報のサードパーティへの開示または漏えい。

### リスク 1: クライアントアプリケーションへの変更に対する制御の喪失

このリスクは、開発者やテスターが見たときと同じコードがサードパーティ側でホストされ続ける保証が通常ないことから生じます。サードパーティコードにはいつでも新機能が投入される可能性があり、その結果インターフェースやデータフローが壊れ、アプリケーションの可用性が利用者や顧客に対して影響を受ける可能性があります。

典型的な防御策には、サードパーティによる変更を防ぐための社内スクリプトミラーリング、ブラウザレベルでの遮断を可能にする Subresource Integrity、転送中の変更を防ぐためのサードパーティコードの安全な送信などがありますが、これらに限定されません。詳細は後述します。

### リスク 2: クライアントシステム上での任意コード実行

このリスクは、サードパーティ JavaScript コードが Web サイトやアプリケーションに組み込まれる前に、呼び出し側によってレビューされることがほとんどないという事実から生じます。クライアントがホスティング Web サイトやアプリケーションに到達すると、このサードパーティコードが実行され、サードパーティには利用者に付与されたものとまったく同じ権限が与えられます ([XSS attacks](https://owasp.org/www-community/attacks/xss/) と同様です)。

本番投入前に実施されたテストは、`AST testing` ([IAST](https://www.veracode.com/security/interactive-application-security-testing-iast)、[RAST](https://www.veracode.com/sites/default/files/pdf/resources/whitepapers/what-is-rasp.pdf)、[SAST](https://www.sqreen.com/web-application-security/what-is-sast)、[DAST](https://www.sqreen.com/web-application-security/what-is-dast) など) を含め、その有効性の一部を失います。

サードパーティが意図的に不正コードを注入する確率は低いと広く受け止められていますが、組織のサーバが侵害された後にサードパーティコードへ悪意のある注入が行われた事例は存在します (例: Yahoo、2014 年 1 月)。

したがって、特にサードパーティが、呼び出し側組織自身よりも優れた、または少なくとも同等のセキュリティ対策を実施していることを示す文書を提示していない場合、このリスクは評価するべきです。別の例として、サードパーティ JavaScript コードをホストするドメインが、その会社の破産や開発者によるプロジェクト放棄によって期限切れになることがあります。その場合、悪意のある行為者がそのドメインを再登録し、悪意のあるコードを公開できます。

典型的な防御策には次のものがありますが、これらに限定されません。

- サードパーティによる変更を防ぐための社内スクリプトミラーリング。
- ブラウザレベルでの遮断を可能にする [Sub-resource integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity)。
- 転送中の変更を防ぐためのサードパーティコードの安全な送信、および各種サンドボックス化。詳細は後述します。
- ...

### リスク 3: 機密情報のサードパーティへの開示

Web サイトやアプリケーションでサードパーティスクリプトが呼び出されると、ブラウザはサードパーティサーバへ直接接続します。デフォルトでは、このリクエストには通常の HTTP ヘッダーがすべて含まれます。ブラウザの送信元 IP アドレスに加えて、サードパーティはリファラー (非 HTTPS リクエストの場合) や、たとえば同じサードパーティスクリプトを呼び出す別組織の Web サイトを訪問した際にサードパーティが以前設定した Cookie など、他のデータも取得します。

多くの場合、これによりサードパーティは組織の利用者、顧客、クライアントに関する情報へ一次的にアクセスできるようになります。さらに、サードパーティがそのスクリプトを他のエンティティと共有している場合、他のすべてのエンティティから二次データも収集します。そのため、組織の訪問者が誰であるかだけでなく、彼らがどの他組織とやり取りしているかも把握できます。

典型例は、広告エンジン、統計、JavaScript API のためにサードパーティコードを呼び出す大手ニュースサイトや報道サイトの現状です。これらの Web サイトを訪問する利用者は、その訪問をサードパーティにも通知しています。多くの場合、サードパーティは個々の利用者が具体的にどの記事をクリックしているかも知ることができ (HTTP リファラーフィールドを通じて漏えいします)、より深い人格プロファイルを構築できます。

典型的な防御策には、サードパーティへの HTTP リクエスト漏えいを防ぐための社内スクリプトミラーリングなどがありますが、これに限定されません。利用者は、報道・ニュースサイトなど漏えいのある Web サイトやアプリケーションでリンクをランダムにクリックすることで、プロファイリングを低減できます。詳細は後述します。

## サードパーティ JavaScript のデプロイアーキテクチャ

**タグ**には三つの基本的なデプロイ方式があります。これらの方式は互いに組み合わせることもできます。

### ページ上のベンダ JavaScript

これは、ベンダがホストに JavaScript を提供し、ホストがそれをホストページに配置する方式です。安全にするには、ホスト企業が [XSS attacks](https://owasp.org/www-community/attacks/xss/) のような脆弱性や、DOM から機密データを悪意のあるサイトへ送信するなどの悪意ある動作がないか、コードをレビューしなければなりません。JavaScript は一般に難読化されているため、これは多くの場合困難です。

```html
<!-- Some host, e.g. foobar.com, HTML code here -->
<html>
<head></head>
    <body>
        ...
        <script type="text/javascript">/* 3rd party vendor javascript here */</script>
    </body>
</html>
```text

### ベンダへの JavaScript リクエスト

これは、ホストページ上の一行または数行のコードが、ベンダサイトから JavaScript ファイルまたは URL を直接リクエストする方式です。ホストページを作成するとき、開発者はベンダが提供した、ベンダ JavaScript をリクエストするコード行を含めます。ページにアクセスされるたびに、JavaScript を取得するためのリクエストがベンダサイトへ送信され、その JavaScript が利用者のブラウザ上で実行されます。

```html
<!-- Some host, e.g. foobar.com, HTML code here -->`
<html>
    <head></head>
    <body>
        ...
        <!-- 3rd party vendor javascript -->
        <script src="https://analytics.vendor.com/v1.1/script.js"></script>
        <!-- /3rd party vendor javascript -->
    </body>
</html>
```text

### タグマネージャ経由でのベンダへの間接リクエスト

これは、ホストページ上の一行または数行のコードが、JavaScript ベンダサイトではなく、タグ集約サイトまたは**タグマネージャ**サイトから JavaScript ファイルまたは URL をリクエストする方式です。タグ集約サイトまたはタグマネージャサイトは、ホスト企業が返すよう構成した任意のサードパーティ JavaScript ファイルを返します。タグマネージャサイトへの各ファイルまたは URL リクエストは、複数ベンダの多数の JavaScript ファイルを返す可能性があります。

集約サイトまたはマネージャから実際に返される内容、つまり具体的な JavaScript ファイルとそれらが正確に何をするかは、タグマネージャサイト上でホストされる開発用のグラフィカルユーザーインターフェースを使って、ホストサイトの従業員が動的に変更できます。この GUI は、事業部門のマーケティング担当者など、非技術者でも扱えます。

変更には次のものがあります。

1. 同じリクエストに対して、サードパーティベンダから別の JavaScript ファイルを取得する。
2. ベンダへ送信するために、どの DOM オブジェクトデータをいつ読み取るかを変更する。

タグマネージャの開発者ユーザーインターフェースは、マーケティング機能に必要な動作を行うコードを生成します。基本的には、ブラウザ DOM からどのデータをいつ取得するかを決定します。タグマネージャは常に**コンテナ** JavaScript ファイルをブラウザへ返します。これは基本的に、ユーザーインターフェースで生成されたコードが必要な機能を実装するために使う JavaScript 関数群です。

開発者へ関数やグローバルデータを提供する Java フレームワークと同様に、コンテナ JavaScript はブラウザ上で実行され、ビジネスユーザーが JavaScript を知らなくてもタグマネージャの開発者ユーザーインターフェースで高レベルの機能を指定できるようにします。

```html
<!-- Some host, e.g. foobar.com, HTML code here -->
 <html>
   <head></head>
     <body>
       ...
       <!-- Tag Manager -->
       <script>(function(w, d, s, l, i){
         w[l] = w[l] || [];
         w[l].push({'tm.start':new Date().getTime(), event:'tm.js'});
         var f = d.getElementsByTagName(s)[0],
         j = d.createElement(s),
         dl = l != 'dataLayer' ? '&l=' + l : '';
         j.async=true;
         j.src='https://tagmanager.com/tm.js?id=' + i + dl;
         f.parentNode.insertBefore(j, f);
       })(window, document, 'script', 'dataLayer', 'TM-FOOBARID');</script>
       <!-- /Tag Manager -->
   </body>
</html>`
```text

#### タグをリクエストする際のセキュリティ問題

前述の方式は安全にすることが困難です。コードを見るにはリクエストをプロキシするか、GUI へアクセスして設定内容を見る必要があるためです。JavaScript は一般に難読化されているため、見えたとしても通常は有用ではありません。また、ブラウザからの新しいページリクエストごとに集約サイトへのリクエストが実行され、集約サイトがサードパーティベンダから JavaScript を取得するため、即時にデプロイされます。したがって、ベンダ上で JavaScript ファイルが変更される、または集約サイト上で変更されると、どのブラウザからの次の呼び出しでも変更後の JavaScript が取得されます。このリスクを管理する一つの方法は、後述する *Subresource Integrity* 標準です。

### サーバ直接データレイヤ

タグマネージャの開発者ユーザーインターフェースは、ブラウザ DOM の任意の場所からデータを取得し、ページ上の任意の場所に保存できる JavaScript を作成するために使えます。これにより、DOM から未検証データ (URL パラメータなど) を取得し、JavaScript が実行される可能性があるページ位置に保存するコードをインターフェースで生成できるため、脆弱性が生じる可能性があります。

生成されたコードを安全にする最善の方法は、ホストが定義したデータレイヤから DOM データを取得することに限定することです。

データレイヤは次のいずれかです。

1. サードパーティが必要とするマーケティングデータまたは利用者行動データを属性値として持つ DIV オブジェクト。
2. 同じデータを持つ JSON オブジェクト群。各変数または属性は、何らかの DOM 要素の値、または利用者操作の説明を含みます。データレイヤは、そのページですべてのベンダが必要とする値の完全な集合です。データレイヤはホスト開発者が作成します。

ビジネス側が定義した特定のイベントが発生すると、そのイベントの JavaScript ハンドラがデータレイヤの値をタグマネージャサーバへ直接送信します。タグマネージャサーバは、そのデータを受け取るべきサードパーティまたは複数のサードパーティへ送信します。イベントハンドラコードは、ホスト開発者がタグマネージャの開発者ユーザーインターフェースを使って作成します。イベントハンドラコードは、ページ読み込みごとにタグマネージャサーバから読み込まれます。

**これは安全な手法です**。利用者のブラウザ上で実行されるのは自分たちの JavaScript だけであり、ベンダへ送信されるのも自分たちが決めたデータだけだからです。

これには、ホスト、集約サイトまたはタグマネージャ、ベンダの協力が必要です。

ホスト開発者は、ベンダが分析を行うためにどの種類のデータを必要とするかを知るため、ベンダと協力しなければなりません。そのうえで、ホストのプログラマはどの DOM 要素がそのデータを持つかを決定します。

ホスト開発者は、データを集約サイトへ送信するプロトコル、つまり URL、パラメータ、形式などについて合意するために、タグマネージャまたは集約サイトと協力しなければなりません。

タグマネージャまたは集約サイトは、データをベンダへ送信するプロトコル、つまり URL、パラメータ、形式などについて合意するために、ベンダと協力しなければなりません。ベンダには API があるでしょうか。

## セキュリティ防御上の考慮事項

### サーバ直接データレイヤ

サーバ直接方式は、サードパーティ JavaScript の管理、デプロイ、実行における優れたセキュリティ標準です。ホストページの優れたプラクティスは、DOM オブジェクトのデータレイヤを作成することです。

データレイヤは、値に対する任意の検証を実行できます。特に、マーケティング分析に必要な場合は、URL パラメータや入力フィールドなど、利用者に公開される DOM オブジェクトからの値を検証できます。

企業標準文書の記述例は、「タグ JavaScript はホストデータレイヤ内の値にのみアクセスできる。タグ JavaScript は URL パラメータにアクセスしてはならない」です。

ホストページ開発者は、データレイヤ内のどの属性がどの値を持つかについて、サードパーティベンダまたはタグマネージャと合意する必要があります。そうすることで、彼らはその値を読み取る JavaScript を作成できます。

ユーザーインターフェースタグは、その機能 (または機能の一つ) が利用者操作に関するデータを送信することではなく、クライアント上のユーザーインターフェースを変更することであるため、データレイヤアーキテクチャを使って安全にすることはできません。

分析タグは、必要な動作がデータレイヤからサードパーティへデータを送信することだけであるため、データレイヤアーキテクチャを使って安全にできます。実行されるのはファーストパーティコードだけです。まず、一般にはページ読み込み時にデータレイヤを設定し、その後イベントハンドラ JavaScript が、そのページから必要な任意のデータをサードパーティデータベースまたはタグマネージャへ送信します。

これは非常にスケーラブルな解決策でもあります。大規模な e コマースサイトでは、URL とパラメータの組み合わせが何十万も存在し、マーケティング分析キャンペーンごとに異なる URL とパラメータの集合が含まれることがあります。マーケティングロジックでは、一つのページに 30 または 40 の異なるベンダタグが存在することもあります。

たとえば、指定された都市に関するページで、指定された場所から、指定された日に行われた利用者操作は、データレイヤ要素 1、2、3 を送信するべきです。他の都市に関するページの利用者操作は、データレイヤ要素 2 と 3 だけを送信するべきです。各ページでデータレイヤデータを送信するイベントハンドラコードは、ホスト開発者またはマーケティング技術者がタグマネージャ開発者インターフェースを使って制御するため、どのタイミングでどのデータレイヤ要素をタグマネージャサーバへ送信するかというビジネスロジックは、数分で変更およびデプロイできます。サードパーティとのやり取りは不要です。サードパーティは期待するデータを受け取り続けますが、そのデータはホストのマーケティング技術者が選んだ異なるコンテキストから届くようになります。

サードパーティベンダの変更は、タグマネージャサーバでデータ配信ルールを変更するだけで済み、ホストコードの変更は不要です。また、データはタグマネージャへだけ直接送信されるため、実行は高速です。イベントハンドラ JavaScript は複数のサードパーティサイトへ接続する必要がありません。

### 間接リクエスト

JavaScript を構成するための GUI を提供するタグマネージャまたは集約サイトへの間接リクエストについては、次のような制御も実装される場合があります。

- JavaScript がデータレイヤの値だけにアクセスでき、他の DOM 要素にはアクセスできないようにする技術的制御。
- ホストサイトにデプロイされるタグの種類を制限すること。たとえば、カスタム HTML タグや JavaScript コードを無効化すること。

ホスト企業は、ホスト企業向けタグ設定へのアクセス制御など、タグマネージャサイトのセキュリティプラクティスも検証するべきです。二要素認証にすることもできます。

マーケティング担当者に、必要なデータをどこから取得するかを決めさせると、URL パラメータから取得したデータをページ上のスクリプト実行可能な場所にある変数へ入れる可能性があるため、XSS につながることがあります。

### コンテンツのサンドボックス化

これら二つのツールは、サイトが DOM データをサンドボックス化またはクリーン化するために使用できます。

- [DOMPurify](https://github.com/cure53/DOMPurify) は、HTML、MathML、SVG 向けの高速で許容性の高い XSS サニタイザです。DOMPurify は安全なデフォルトで動作しますが、多くの設定機能とフックを提供します。
- [MentalJS](https://github.com/hackvertor/MentalJS) は JavaScript パーサおよびサンドボックスです。変数とアクセサに "$" サフィックスを追加することで JavaScript コードを許可リスト化します。

### Subresource Integrity

[Subresource Integrity](https://www.w3.org/TR/SRI/) は、レビュー済みのコードだけが実行されることを保証します。開発者はベンダ JavaScript の integrity メタデータを生成し、次のように script 要素へ追加します。

```javascript
<script src="https://analytics.vendor.com/v1.1/script.js"
   integrity="sha384-MBO5IDfYaE6c6Aao94oZrIOiC7CGiSNE64QUbHNPhzk8Xhm0djE6QqTpL0HzTUxk"
   crossorigin="anonymous">
</script>
```text

SRI が機能するには、ベンダホストで [CORS](https://www.w3.org/TR/cors/) が有効になっている必要があることを知っておくことが重要です。また、ベンダ JavaScript の変更を定期的な方法で監視することも良い考えです。ベンダが更新を決めたときに、**安全**ではあるが**動作しない**サードパーティコードを受け取ることがあるためです。

### JavaScript ライブラリを最新に保つ

[OWASP Top 10 2013 A9](https://wiki.owasp.org/index.php/Top_10_2013-A9-Using_Components_with_Known_Vulnerabilities) は、既知の脆弱性を持つコンポーネントを使用する問題を説明しています。これには JavaScript ライブラリも含まれます。JavaScript ライブラリは最新に保たなければなりません。古いバージョンには既知の脆弱性がある可能性があり、それによりサイトが典型的には [Cross Site Scripting](https://owasp.org/www-community/attacks/xss/) に脆弱になることがあります。そのようなライブラリを特定するために役立つツールはいくつかあります。その一つが無料のオープンソースツール [RetireJS](https://retirejs.github.io) です。

### iframe によるサンドボックス化

ベンダ JavaScript を別ドメイン (たとえば静的データホスト) の iframe に入れることもできます。これは「隔離領域」として機能し、ベンダ JavaScript はホストページの DOM や Cookie に直接アクセスできません。

ホストのメインページとサンドボックス iframe は、[postMessage mechanism](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) を介して相互に通信できます。

また、iframe は iframe の [sandbox attribute](http://www.html5rocks.com/en/tutorials/security/sandboxed-iframes/) で保護できます。

高リスクアプリケーションでは、iframe サンドボックス化に加えて [Content Security Policy (CSP)](https://www.w3.org/TR/CSP2/) の使用を検討してください。CSP は XSS に対する堅牢化をさらに強化します。

```html
<!-- Some host, e.g. somehost.com, HTML code here -->
 <html>
   <head></head>
     <body>
       ...
       <!-- Include iframe with 3rd party vendor javascript -->
       <iframe
       src="https://somehost-static.net/analytics.html"
       sandbox="allow-same-origin allow-scripts">
       </iframe>
   </body>
 </html>

<!-- somehost-static.net/analytics.html -->
 <html>
   <head></head>
     <body>
       ...
       <script>
       window.addEventListener("message", receiveMessage, false);
       function receiveMessage(event) {
         if (event.origin !== "https://somehost.com:443") {
           return;
         } else {
         // Make some DOM here and initialize other
        //data required for 3rd party code
         }
       }
       </script>
       <!-- 3rd party vendor javascript -->
       <script src="https://analytics.vendor.com/v1.1/script.js"></script>
       <!-- /3rd party vendor javascript -->
   </body>
 </html>
```

### 仮想 iframe コンテインメント

この技術は、メインページとは非同期に実行される iframe を作成します。また、マーケティングタグの要件に基づいて保護された iframe を動的に実装することを自動化する、独自のコンテインメント JavaScript も提供します。

### ベンダ契約

サードパーティとの契約または提案依頼書で、セキュアコーディングと一般的な企業サーバアクセスセキュリティを実装している証拠を要求できます。ただし特に、その JavaScript への悪意ある変更を防止および検知するため、ソースコードの監視と制御を判断する必要があります。

## MarTechSec

Marketing Technology Security

これは、マーケティング JavaScript からのリスクを低減するすべての側面を指します。制御には次のものがあります。

1. リスク低減のための契約上の制御。MarTech 企業との契約には、コードセキュリティとコード完全性監視の証拠を示す要求を含めるべきです。
2. リスク移転のための契約上の制御。MarTech 企業との契約には、悪意のある JavaScript を提供した場合の違約金を含めることができます。
3. 悪意のある JavaScript 実行を防止するための技術的制御。Virtual Iframes。
4. 悪意のある JavaScript を特定するための技術的制御。[Subresource Integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity)。
5. クライアント側 JavaScript の悪意ある動作をペネトレーションテスト要件に含める技術的制御。

## MarSecOps

Marketing Security Operations

これは、一部の技術的制御を維持するための運用要件を指します。ページ制御内の情報 (SRI ハッシュ変更、SRI を持つページの変更)、Virtual iFrames のポリシー、タグマネージャ設定、データレイヤ変更などを更新するため、マーケティングチーム、martech プロバイダ、実行または運用チームの間で協力や情報交換が必要になる可能性があります。

非自明なマーケティングタグを含む任意のサイトに対する、最も完全で予防的な制御は次のとおりです。

1. マーケティングサーバまたはタグマネージャ API を呼び出すデータレイヤ。これにより、自分たちのコードだけが自分たちのページで実行されます (制御の反転)。

2. [Subresource Integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity)。

3. Virtual frame Containment。

マーケティングが求める変更速度で、または多数の専任リソースなしで技術的制御を実装するための MarSecOps 要件により、データレイヤと Subresource Integrity の制御は実用的でなくなることがあります。

## References

- [Widespread XSS Vulnerabilities in Ad Network Code Affecting Top Tier Publishers, Retailers](https://randywestergren.com/widespread-xss-vulnerabilities-ad-network-code-affecting-top-tier-publishers-retailers/).
- [Inside and Beyond Ticketmaster: The Many Breaches of Magecart](https://www.riskiq.com/blog/labs/magecart-ticketmaster-breach/).
- [Magecart – a malicious infrastructure for stealing payment details from online shops](https://www.clearskysec.com/magecart/).
- [Compromised E-commerce Sites Lead to "Magecart"](https://www.riskiq.com/blog/labs/magecart-keylogger-injection/)
- [Inbenta, blamed for Ticketmaster breach, admits it was hacked](https://www.zdnet.com/article/inbenta-blamed-for-ticketmaster-breach-says-other-sites-not-affected/).

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V3.2, V3.6, V3.7 | クライアント側実行、セッション関連情報、Cookie、DOM、CSP、iframe サンドボックス化に関するリスクと防御策 |
| V15.1, V15.2 | サードパーティ JavaScript、外部依存、既知脆弱性のあるコンポーネント、サプライチェーン管理 |
