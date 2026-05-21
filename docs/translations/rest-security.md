# REST セキュリティチートシート 日本語訳

## Attribution

- Original: REST Security Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-21

## 日本語訳

# REST セキュリティチートシート

## はじめに

[REST](https://en.wikipedia.org/wiki/REST) (または **RE**presentational **S**tate **T**ransfer) は、[Roy Fielding](https://en.wikipedia.org/wiki/Roy_Fielding) の博士論文 [Architectural Styles and the Design of Network-based Software Architectures](https://www.ics.uci.edu/~fielding/pubs/dissertation/top.htm) で初めて説明されたアーキテクチャスタイルです。

これは Fielding が HTTP/1.1 と URI の仕様を執筆する中で発展し、分散ハイパーメディアアプリケーションの開発に非常に適していることが実証されてきました。REST はより広く適用できますが、もっとも一般的には HTTP 経由でサービスと通信する文脈で使用されます。

REST における情報の主要な抽象化はリソースです。REST API のリソースは URI、通常は HTTP URL によって識別されます。REST コンポーネントは、現在または意図したリソースの状態を表現で捕捉し、その表現を転送することで、コネクタを使ってリソースに対する操作を実行します。

主要なコネクタタイプはクライアントとサーバーであり、副次的なコネクタにはキャッシュ、リゾルバ、トンネルがあります。

REST API はステートレスです。ステートフル API は REST アーキテクチャスタイルに従っていません。REST という頭字語に含まれる State は、API がアクセスするリソースの状態を指し、API が呼び出されるセッションの状態を指すものではありません。ステートフル API を構築する十分な理由がある場合もありますが、セッション管理は複雑であり、安全に実装することが難しい点を理解することが重要です。

ステートフルサービスはこのチートシートの対象外です。*クライアントからバックエンドへ状態を渡してサービスを技術的にステートレスに見せることも、リプレイ攻撃やなりすまし攻撃を受けやすいため、避けるべきアンチパターンです。*

REST API でフローを実装するために、通常はリソースを作成、読み取り、更新、削除します。たとえば EC サイトでは、空のショッピングカートを作成する、カートに商品を追加する、カートをチェックアウトするといったメソッドを提供できます。これらの REST 呼び出しはいずれもステートレスであり、エンドポイントは呼び出し元が要求された操作を実行する権限を持つかを確認する必要があります。

REST アプリケーションのもう一つの重要な特徴は、異なるサービス間の不要なばらつきを取り除くために、標準の HTTP 動詞とエラーコードを使用することです。

REST アプリケーションのもう一つの重要な特徴は、[HATEOAS または Hypermedia As The Engine of Application State](https://en.wikipedia.org/wiki/HATEOAS) の使用です。これにより REST アプリケーションは自己文書化の性質を持ち、開発者は事前知識がなくても REST サービスとやり取りしやすくなります。

## HTTPS

安全な REST サービスは HTTPS エンドポイントのみを提供しなければなりません。これにより、パスワード、API キー、JSON Web Token などの認証資格情報が転送中に保護されます。また、クライアントはサービスを認証でき、転送されるデータの完全性も保証されます。

追加情報については、[Transport Layer Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html) を参照してください。

高い権限を持つ Web サービスに追加の保護を提供するため、相互認証されたクライアント側証明書の使用を検討してください。

## アクセス制御

非公開の REST サービスは、各 API エンドポイントでアクセス制御を実施しなければなりません。モノリシックアプリケーションの Web サービスでは、ユーザー認証、認可ロジック、セッション管理によってこれを実装します。RESTful スタイルに従う複数のマイクロサービスを組み合わせる現代的なアーキテクチャでは、これにはいくつかの欠点があります。

- レイテンシを最小化し、サービス間の結合を減らすため、アクセス制御の判断は REST エンドポイントでローカルに行うべきです。
- ユーザー認証は、アクセストークンを発行する Identity Provider (IdP) に集約すべきです。

## JWT

セキュリティトークンの形式として [JSON Web Tokens](https://tools.ietf.org/html/rfc7519) (JWT) を使用する方向に収束しているようです。JWT は、アクセス制御判断に使用できる一連のクレームを含む JSON データ構造です。JWT の完全性を保護するために、暗号署名またはメッセージ認証コード (MAC) を使用できます。

- JWT が署名または MAC のいずれかで完全性保護されていることを確認してください。保護されていない JWT `{"alg":"none"}` を許可してはいけません。
  - [こちら](https://tools.ietf.org/html/rfc7519#section-6.1)を参照してください。
- 一般に、JWT の完全性保護には MAC より署名を優先すべきです。

完全性保護に MAC を使用する場合、JWT を検証できるすべてのサービスは、同じキーを使って新しい JWT も作成できます。つまり、同じキーを使用するすべてのサービスは相互に信頼しなければなりません。さらに、いずれかのサービスが侵害されると、同じキーを共有する他のすべてのサービスも侵害されることになります。追加情報については、[こちら](https://tools.ietf.org/html/rfc7515#section-10.5)を参照してください。

依拠当事者またはトークン利用者は、JWT の完全性と含まれるクレームを検証することで JWT を検証します。

- 依拠当事者は、自身の設定またはハードコードされたロジックに基づいて JWT の完全性を検証しなければなりません。検証アルゴリズムを選択するために JWT ヘッダーの情報に依存してはいけません。[こちら](https://www.chosenplaintext.ca/2015/03/31/jwt-algorithm-confusion.html)と[こちら](https://www.youtube.com/watch?v=bW5pS4e_MX8>)を参照してください。

一部のクレームは標準化されており、アクセス制御に使用される JWT には存在すべきです。少なくとも次の標準クレームを検証すべきです。

- `iss` または issuer - 信頼できる発行者か。署名キーの期待される所有者か。
- `aud` または audience - 依拠当事者はこの JWT の対象オーディエンスに含まれているか。
- `exp` または expiration time - 現在時刻はこのトークンの有効期間終了前か。
- `nbf` または not before time - 現在時刻はこのトークンの有効期間開始後か。

JWT には認証済みエンティティ (ユーザーなど) の詳細が含まれるため、JWT とユーザーセッションの現在状態との間に不一致が生じることがあります。たとえば、明示的なログアウトやアイドルタイムアウトにより、有効期限より前にセッションが終了する場合があります。明示的なセッション終了イベントが発生した場合、関連する JWT のダイジェストまたはハッシュを API の拒否リストに登録し、そのトークンの有効期限まで任意のリクエストでその JWT を無効化すべきです。詳細については、[JSON_Web_Token_for_Java_Cheat_Sheet](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html#token-explicit-revocation-by-the-user) を参照してください。

## API キー

アクセス制御のない公開 REST サービスは、収集・大量利用され、帯域幅や計算サイクルに対する過大な請求につながるリスクがあります。API キーはこのリスクを緩和するために使用できます。また、組織が API を収益化するためにもよく使用されます。高頻度の呼び出しをブロックする代わりに、クライアントには購入したアクセスプランに応じたアクセスが与えられます。

API キーはサービス拒否攻撃の影響を軽減できます。しかし、サードパーティクライアントに発行される場合、比較的容易に侵害されます。

- 保護されたエンドポイントへのすべてのリクエストに API キーを要求します。
- リクエストが速すぎる頻度で送られている場合は、HTTP レスポンスコード `429 Too Many Requests` を返します。
- クライアントが利用契約に違反した場合は API キーを失効させます。
- 機密性が高い、重要である、または高価値のリソースを保護するために API キーだけに依存してはいけません。

## HTTP メソッドの制限

- 許可された HTTP メソッド、たとえば `GET`、`POST`、`PUT` の許可リストを適用します。
- 許可リストに一致しないすべてのリクエストを、HTTP レスポンスコード `405 Method not allowed` で拒否します。
- 呼び出し元が、リソースコレクション、アクション、レコードに対して、受信した HTTP メソッドを使用する権限を持つことを確認します。

特に Java EE では、これを適切に実装することが難しい場合があります。この一般的な設定ミスの説明については、[Bypassing Web Authentication and Authorization with HTTP Verb Tampering](https://cheatsheetseries.owasp.org/assets/REST_Security_Cheat_Sheet_Bypassing_VBAAC_with_HTTP_Verb_Tampering.pdf) を参照してください。

## 順序外 API 実行の防止

現代的な REST API は、多くの場合、一連のエンドポイント (たとえば create → validate → approve → finalize) によってビジネスワークフローを実装します。バックエンドがワークフロー状態遷移を明示的に検証しない場合、攻撃者はエンドポイントを順序外に呼び出して、意図された制御を迂回する可能性があります。

### 問題

順序外 API 実行は、攻撃者が次のことを行う場合に発生します。

- 後段階のエンドポイントを直接呼び出して、必要なワークフローステップをスキップする。
- ワークフロー境界を越えてトークンをリプレイまたは再利用する。
- フロントエンドが正しい順序を強制するという前提を悪用する。

各エンドポイントが個別に認証・認可されている場合でも、従来のアクセス制御チェックではこれらの問題を検出できないことがよくあります。

### 例

チェックアウトワークフローでは、次の順序が期待されます。

```http
POST /checkout/create
POST /checkout/pay
POST /checkout/confirm
```

バックエンドがワークフロー状態遷移を検証しない場合、攻撃者は支払いを完了せずに次を直接呼び出す可能性があります。

```http
POST /checkout/confirm
```

### 防止ガイダンス

- すべてのリクエストでサーバー側のワークフロー状態検証を強制します。
- 有限状態または状態機械を使ってワークフローを明示的にモデル化します。
- トークンまたは識別子を特定のワークフローステージに結び付けます。
- 順序の強制をフロントエンドロジックに依存しないようにします。
- 無効または順序外の遷移を明確なエラーレスポンスで拒否します。

### テストチェックリスト

- エンドポイントを順序外に呼び出せるか。
- 各エンドポイントは現在のワークフロー状態を検証しているか。
- トークンはワークフローステップをまたいで再利用できるか。
- 無効な状態遷移は一貫して拒否されるか。

## 入力検証

- 入力パラメータやオブジェクトを信頼してはいけません。
- 入力を検証します。長さ、範囲、形式、型を検証してください。
- API パラメータで数値、真偽値、日付、時刻、固定データ範囲などの強い型を使用することで、暗黙的な入力検証を実現します。
- 正規表現で文字列入力を制約します。
- 予期しない、または不正なコンテンツを拒否します。
- 使用している言語固有の検証・サニタイズライブラリまたはフレームワークを活用します。
- 適切なリクエストサイズ制限を定義し、制限を超えるリクエストを HTTP レスポンスステータス 413 Request Entity Too Large で拒否します。
- 入力検証の失敗をログに記録することを検討します。1 秒あたり数百件の入力検証失敗を発生させている人物は、悪意を持っていると想定してください。
- 包括的な説明については、入力検証チートシートを参照してください。
- 受信メッセージの解析には安全なパーサーを使用します。XML を使用している場合は、[XXE](https://owasp.org/www-community/vulnerabilities/XML_External_Entity_%28XXE%29_Processing) や類似攻撃に脆弱でないパーサーを使用してください。

## Content-Type の検証

REST のリクエスト本文またはレスポンス本文は、ヘッダー内の意図した Content-Type と一致すべきです。一致しない場合、コンシューマー側またはプロデューサー側で誤解釈が発生し、コードインジェクションやコード実行につながる可能性があります。

- API でサポートするすべての Content-Type を文書化します。

### リクエスト Content-Type の検証

- 予期しない、または欠落した Content-Type ヘッダーを含むリクエストは、HTTP レスポンスステータス `406 Unacceptable` または `415 Unsupported Media Type` で拒否します。ただし、`Content-Length: 0` のリクエストでは `Content-type` ヘッダーは任意です。
- XML Content-Type については、適切な XML パーサー堅牢化を確認してください。[XXE cheat sheet](https://cheatsheetseries.owasp.org/cheatsheets/XML_External_Entity_Prevention_Cheat_Sheet.html) を参照してください。
- たとえば [Jersey](https://jersey.github.io/) (Java) の `@consumes("application/json"); @produces("application/json")` のように Content-Type を明示的に定義し、意図しない Content-Type を誤って公開しないようにします。これにより、たとえば [XXE 攻撃](https://owasp.org/www-community/vulnerabilities/XML_External_Entity_%28XXE%29_Processing)ベクトルを避けられます。

### 安全なレスポンス Content-Type の送信

REST サービスでは複数のレスポンスタイプ (たとえば `application/xml` や `application/json`) を許可し、クライアントがリクエストの Accept ヘッダーで希望するレスポンスタイプの順序を指定することが一般的です。

- `Accept` ヘッダーをレスポンスの `Content-type` ヘッダーへ単純にコピーしてはいけません。
- `Accept` ヘッダーに許可された型の一つが具体的に含まれていない場合は、理想的には `406 Not Acceptable` レスポンスでリクエストを拒否します。

レスポンスにスクリプトコード (たとえば JavaScript) を含むサービスは、ヘッダーインジェクション攻撃を防ぐために特に注意しなければなりません。

- レスポンス本文の内容に一致する意図した Content-Type ヘッダー、たとえば `application/javascript` ではなく `application/json` を送信していることを確認します。

## 管理エンドポイント

- 管理エンドポイントをインターネットに公開しないようにします。
- 管理エンドポイントをインターネットからアクセス可能にする必要がある場合は、多要素認証などの強力な認証メカニズムの使用をユーザーに必須としてください。
- 管理エンドポイントは異なる HTTP ポートまたはホストで公開し、可能であれば異なる NIC と制限されたサブネットで公開します。
- ファイアウォールルールまたはアクセス制御リストを使用して、これらのエンドポイントへのアクセスを制限します。

## エラー処理

- 一般的なエラーメッセージで応答し、失敗の詳細を不必要に明かさないようにします。
- 技術的な詳細 (たとえばコールスタックやその他の内部的な手がかり) をクライアントに渡してはいけません。

## 監査ログ

- セキュリティ関連イベントの前後に監査ログを書き込みます。
- 攻撃を検出するために、トークン検証エラーをログに記録することを検討します。
- 事前にログデータをサニタイズし、ログインジェクション攻撃に注意します。

## セキュリティヘッダー

ブラウザに特定の動作を指示するため、HTTP レスポンスで返せる[セキュリティ関連ヘッダー](https://owasp.org/www-project-secure-headers/)はいくつかあります。ただし、これらのヘッダーの一部は HTML レスポンスで使用することを意図しているため、HTML を返さない API ではセキュリティ上の利点がほとんど、またはまったくない場合があります。API がブラウザ以外のクライアント (たとえばモバイルアプリ、サーバー間呼び出し、コマンドラインツール) のみによって利用される場合、これらのヘッダーの多くはブラウザ向けの指示であるため効果がない点に注意してください。

ブラウザクライアントによって利用される可能性のあるすべての API レスポンスには、次のヘッダーを含めるべきです。

| ヘッダー | 理由 |
|--------|-----------|
| `Cache-Control: no-store` | ブラウザによるキャッシュを制御するために使用されるヘッダーです。`no-store` を指定すると、そのヘッダーを含むレスポンスを、どの種類のキャッシュ (プライベートまたは共有) も保存すべきではないことを示します。ブラウザは API が呼び出されるたびに最新のレスポンスを取得するため、新しいリクエストを行わなければなりません。`no-store` 値を持つこのヘッダーは、機密情報がキャッシュまたは保存されることを防ぎます。 |
| `Content-Security-Policy: frame-ancestors 'none'` | レスポンスを `<frame>`、`<iframe>`、`<embed>`、`<object>` 要素内にフレーム化できるかを指定するために使用されるヘッダーです。API レスポンスでは、これらの要素内にフレーム化される要件はありません。`frame-ancestors 'none'` を指定すると、API 呼び出しによって返されたレスポンスをどのドメインもフレーム化できなくなります。このヘッダーは、[ドラッグアンドドロップ](https://www.w3.org/Security/wiki/Clickjacking_Threats#Drag_and_drop_attacks)型のクリックジャッキング攻撃から保護します。 |
| `Content-Type` | レスポンスの Content-Type を指定するヘッダーです。API 呼び出しが返すコンテンツの種類に従って指定しなければなりません。指定されていない場合、または誤って指定されている場合、ブラウザはレスポンスの Content-Type を推測しようとする可能性があります。これは MIME sniffing 攻撃につながる可能性があります。API レスポンスが JSON の場合、一般的な Content-Type 値は `application/json` です。 |
| `Strict-Transport-Security` | ドメインには HTTPS のみでアクセスすべきであり、将来 HTTP でアクセスしようとした場合は自動的に HTTPS に変換すべきであることをブラウザに指示するヘッダーです。このヘッダーは API 呼び出しが HTTPS 経由で行われることを保証し、偽装証明書から保護します。 |
| `X-Content-Type-Options: nosniff` | ファイルの内容に基づいて MIME タイプを判断しようとするのではなく、`Content-Type` ヘッダーで宣言された MIME タイプを常に使用するようブラウザに指示するヘッダーです。`nosniff` 値を持つこのヘッダーは、ブラウザが MIME sniffing を行い、レスポンスを不適切に HTML として解釈することを防ぎます。 |
| `X-Frame-Options: DENY` | `Content-Security-Policy: frame-ancestors 'none'` (上記参照) に置き換えられたレガシーヘッダーです。CSP Level 2 をサポートしていない古いブラウザとの互換性のため、依然として推奨されます。`DENY` を指定すると、どのドメインもレスポンスをフレーム化できなくなります。 |

以下のヘッダーは、レスポンスが HTML としてレンダリングされる場合に追加のセキュリティを提供することだけを意図しています。そのため、API がレスポンスで HTML を決して返さない場合、これらのヘッダーは不要かもしれません。しかし、ヘッダーの機能や API が返す (または将来返す可能性がある) 情報の種類に不確実性がある場合は、多層防御の一部として含めることが推奨されます。

| ヘッダー | 例 | 理由 |
|--------|-----------|-----------|
| Content-Security-Policy | `Content-Security-Policy: default-src 'none'` | CSP の機能の大部分は、HTML としてレンダリングされるページにのみ影響します。 |
| Permissions-Policy | `Permissions-Policy: accelerometer=(), ambient-light-sensor=(), autoplay=(), battery=(), camera=(), cross-origin-isolated=(), display-capture=(), document-domain=(), encrypted-media=(), execution-while-not-rendered=(), execution-while-out-of-viewport=(), fullscreen=(), geolocation=(), gyroscope=(), keyboard-map=(), magnetometer=(), microphone=(), midi=(), navigation-override=(), payment=(), picture-in-picture=(), publickey-credentials-get=(), screen-wake-lock=(), sync-xhr=(), usb=(), web-share=(), xr-spatial-tracking=()` | このヘッダーは以前 Feature-Policy と呼ばれていました。ブラウザがこのヘッダーに従う場合、ディレクティブを通じてブラウザ機能を制御するために使用されます。この例では、許可された多数の[ディレクティブ名](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Permissions-Policy#directives)に対して空の許可リストを指定し、機能を無効化します。このヘッダーを適用する場合は、ディレクティブが最新であり、ニーズに合っていることを確認してください。ブラウザ機能を制御する方法の詳細な説明については、この[記事](https://developer.chrome.com/en/docs/privacy-sandbox/permissions-policy)を参照してください。 |
| Referrer-Policy | `Referrer-Policy: no-referrer` | HTML ではないレスポンスは追加リクエストを発生させるべきではありません。 |

## CORS

Cross-Origin Resource Sharing (CORS) は、許可されるクロスドメインリクエストを柔軟に指定するための W3C 標準です。適切な CORS ヘッダーを配信することで、REST API はブラウザに対して、どのドメイン、すなわち origin が REST サービスへ JavaScript 呼び出しを行えるかを通知します。

- クロスドメイン呼び出しがサポートされていない、または想定されていない場合は、CORS ヘッダーを無効化します。
- クロスドメイン呼び出しの origin を設定する際は、可能な限り具体的にし、必要な範囲でのみ一般化します。

## HTTP リクエスト内の機密情報

RESTful Web サービスは、認証資格情報の漏えいを防ぐよう注意すべきです。パスワード、セキュリティトークン、API キーは URL に含めるべきではありません。URL は Web サーバーログに記録される可能性があり、その結果として本質的に価値の高い情報になります。

- `POST`/`PUT` リクエストでは、機密データをリクエスト本文またはリクエストヘッダーで転送すべきです。
- `GET` リクエストでは、機密データを HTTP ヘッダーで転送すべきです。

**OK:**

`https://example.com/resourceCollection/[ID]/action`

`https://twitter.com/vanderaj/lists`

**NOT OK:**

`https://example.com/controller/123/action?apiKey=a53f435643de32` は、apiKey が URL に含まれているため不適切です。

## HTTP リターンコード

HTTP は[ステータスコード](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes)を定義しています。REST API を設計する際は、成功に `200`、エラーに `404` だけを使用するのではなく、常にレスポンスに意味的に適切なステータスコードを使用してください。

以下は、セキュリティに関連する REST API の**ステータスコード**の非網羅的な抜粋です。正しいコードを返すために活用してください。

| コード | メッセージ | 説明 |
|-------------|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 200 | OK | REST API アクションが成功した場合のレスポンスです。HTTP メソッドは GET、POST、PUT、PATCH、DELETE のいずれかです。 |
| 201 | Created | リクエストが完了し、リソースが作成されました。作成されたリソースの URI は Location ヘッダーで返されます。 |
| 202 | Accepted | リクエストは処理のために受け付けられましたが、処理はまだ完了していません。 |
| 301 | Moved Permanently | 永続的なリダイレクトです。 |
| 304 | Not Modified | クライアントがサーバーと同じリソースのコピーを持っている場合に返される、キャッシュ関連のレスポンスです。 |
| 307 | Temporary Redirect | リソースの一時的なリダイレクトです。 |
| 400 | Bad Request | メッセージ本文の形式エラーなど、リクエストが不正です。 |
| 401 | Unauthorized | 認証 ID/パスワードが誤っている、または提供されていません。 |
| 403 | Forbidden | 認証は成功したものの、認証済みユーザーが要求されたリソースへの権限を持たない場合に使用されます。 |
| 404 | Not Found | 存在しないリソースが要求された場合です。 |
| 405 | Method Not Acceptable | 予期しない HTTP メソッドに対するエラーです。たとえば REST API が HTTP GET を期待しているのに HTTP PUT が使用された場合です。 |
| 406 | Unacceptable | クライアントが Accept ヘッダーで提示した Content-Type がサーバー API でサポートされていません。 |
| 413 | Payload too large | ファイルアップロードなどに関して、リクエストサイズが指定された制限を超えたことを示すために使用します。 |
| 415 | Unsupported Media Type | 要求された Content-Type は REST サービスでサポートされていません。 |
| 429 | Too Many Requests | DoS 攻撃が検出された可能性がある場合、またはレート制限によりリクエストが拒否された場合に使用されるエラーです。 |
| 500 | Internal Server Error | 予期しない状態により、サーバーはリクエストを満たせませんでした。レスポンスは、詳細なエラーメッセージやスタックトレースなど、攻撃者に役立つ内部情報を明かすべきではない点に注意してください。 |
| 501 | Not Implemented | REST サービスは要求された操作をまだ実装していません。 |
| 503 | Service Unavailable | REST サービスは一時的にリクエストを処理できません。後で再試行すべきであることをクライアントへ通知するために使用します。 |

REST API における HTTP リターンコードの使用に関する追加情報は、[こちら](https://www.restapitutorial.com/httpstatuscodes.html)と[こちら](https://restfulapi.net/http-status-codes)にあります。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V4.1 General API and Web Service Security | HTTPS、入力検証、Content-Type、HTTP メソッド制御、順序外 API 実行防止、エラー処理、監査ログ、セキュリティヘッダー |
| V4.2 RESTful Web Service | REST API の認証、認可、JWT、API キー、CORS、ステートレスなリクエスト検証 |
| V9.2 Token and Session-Based Authentication | JWT、トークン有効期限、拒否リストによる失効、漏えい時影響の低減 |
