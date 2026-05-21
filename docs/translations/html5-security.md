# HTML5セキュリティチートシート 日本語訳

## Attribution

- Original: HTML5 Security Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-21

## 日本語訳

# HTML5 セキュリティチートシート

## はじめに

このチートシートは、HTML 5 を安全に実装するためのガイドです。

## 通信 API

### Web Messaging

Web Messaging (Cross Domain Messaging とも呼ばれます) は、異なるオリジンのドキュメント間でメッセージをやり取りする手段を提供します。これは、過去にこの目的のために使われていた複数の回避的な手法より一般に安全です。ただし、次の推奨事項を意識する必要があります。

- メッセージを投稿する際は、リダイレクトその他の方法で対象ウィンドウのオリジンが変わった後に未知のオリジンへメッセージを送らないよう、`postMessage` の第二引数に `*` ではなく期待するオリジンを明示してください。
- 受信ページは常に次を行うべきです。
    - 送信者の `origin` 属性を確認し、データが期待する場所から来ていることを検証します。
    - イベントの `data` 属性に対して入力検証を行い、望ましい形式であることを確認します。
- `data` 属性を制御できると仮定しないでください。送信ページに [Cross Site Scripting](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html) の欠陥が一つあるだけで、攻撃者は任意の形式のメッセージを送信できます。
- 両方のページは、交換されるメッセージを **データ** としてのみ解釈するべきです。渡されたメッセージをコードとして評価したり (`eval()` など)、ページ DOM に挿入したり (`innerHTML` など) してはいけません。そうすると DOM ベース XSS 脆弱性が発生します。詳細は [DOM based XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html) を参照してください。
- データ値を要素に代入する場合、`element.innerHTML=data;` のような安全でない方法ではなく、より安全な選択肢である `element.textContent=data;` を使用してください。
- オリジンは、期待する FQDN と完全に一致するよう適切に確認してください。次のコード `if(message.origin.indexOf(".owasp.org")!=-1) { /* ... */ }` は非常に安全でなく、`owasp.org.attacker.com` が一致してしまうため、期待した動作にならないことに注意してください。
- 外部コンテンツや信頼できないガジェットを埋め込み、ユーザー制御のスクリプトを許可する必要がある場合 (これは強く非推奨です)、[sandboxed frames](https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html#sandboxed-frames) の情報を確認してください。

### Cross Origin Resource Sharing

- `XMLHttpRequest.open` に渡される URL を検証してください。現在のブラウザでは、これらの URL がクロスドメインであることを許可しています。この挙動は、リモート攻撃者によるコードインジェクションにつながる可能性があります。絶対 URL には特に注意してください。
- `Access-Control-Allow-Origin: *` で応答する URL に、攻撃者のさらなる攻撃を助ける可能性のある機密コンテンツや情報が含まれないようにしてください。`Access-Control-Allow-Origin` ヘッダーは、クロスドメインでアクセスされる必要がある選択済み URL だけで使用してください。ドメイン全体にこのヘッダーを使わないでください。
- `Access-Control-Allow-Origin` ヘッダーでは、選択した信頼済みドメインだけを許可してください。任意のドメインをブロックまたは許可するより、特定のドメインを許可することを優先します (`*` ワイルドカードを使ったり、確認なしに `Origin` ヘッダーの内容をそのまま返したりしてはいけません)。
- CORS は、要求されたデータが認可されていない場所へ送られることを防ぐものではない点に注意してください。サーバー側で通常の [CSRF](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html) 防止を行うことは依然として重要です。
- [Fetch Standard](https://fetch.spec.whatwg.org/#http-cors-protocol) は `OPTIONS` メソッドによるプリフライトリクエストを推奨していますが、現在の実装ではこのリクエストが行われない場合があります。そのため、「通常の」リクエスト (`GET` と `POST`) でも必要なアクセス制御を実施することが重要です。
- 混合コンテンツのバグを防ぐため、HTTPS オリジンを持つプレーン HTTP 経由のリクエストは破棄してください。
- アクセス制御の確認を Origin ヘッダーだけに依存しないでください。ブラウザは CORS リクエストで常にこのヘッダーを送信しますが、ブラウザ外では偽装される可能性があります。機密データを保護するには、アプリケーションレベルのプロトコルを使用すべきです。

### WebSockets

- WebSocket 固有の保護策については、[WebSocket Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/WebSocket_Security_Cheat_Sheet.html) を参照してください。

### Server-Sent Events

- 同一オリジン URL のみが許可される場合でも、`EventSource` コンストラクタに渡される URL を検証してください。
- 前述のとおり、メッセージ (`event.data`) はデータとして処理し、内容を HTML やスクリプトコードとして評価してはいけません。
- メッセージの origin 属性 (`event.origin`) を常に確認し、信頼されたドメインから来ていることを確認してください。許可リスト方式を使用してください。

## ストレージ API

### Local Storage

- Offline Storage、Web Storage とも呼ばれます。基盤となるストレージ機構はユーザーエージェントごとに異なる場合があります。言い換えると、データが保存されているマシンへのローカル権限を持つユーザーは、アプリケーションが必要とする認証を回避できます。そのため、認証が前提となるような機密情報を local storage に保存することは避けることが推奨されます。
- ブラウザのセキュリティ保証により、そのデータへのアクセスが認証や認可を前提としない場合には local storage を使うことが適切です。
- 永続ストレージが不要な場合は、localStorage ではなく sessionStorage オブジェクトを使用してください。sessionStorage オブジェクトは、そのウィンドウまたはタブが閉じられるまで、そのウィンドウまたはタブでのみ利用できます。
- 一つの [Cross Site Scripting](https://owasp.org/www-community/attacks/xss/) によって、これらのオブジェクト内のすべてのデータが盗まれる可能性があります。そのため、繰り返しになりますが、機密情報を local storage に保存しないことが推奨されます。
- 一つの [Cross Site Scripting](https://owasp.org/www-community/attacks/xss/) によって、これらのオブジェクトへ悪意あるデータが読み込まれる可能性もあります。そのため、これらの中のオブジェクトを信頼できるものと考えないでください。
- HTML5 ページで実装されている `localStorage.getItem` と `setItem` 呼び出しには特に注意してください。これは、開発者が local storage に機密情報を置くソリューションを構築している場合の検出に役立ちます。そのデータへの認証や認可が誤って前提とされていると、重大なリスクになり得ます。
- データは常に JavaScript からアクセス可能なため、セッション識別子を local storage に保存してはいけません。Cookie は `httpOnly` フラグを使用することで、このリスクを軽減できます。
- HTTP Cookie の path 属性のように、オブジェクトの可視性を特定のパスに制限する方法はありません。すべてのオブジェクトは同一オリジン内で共有され、Same Origin Policy によって保護されます。同じオリジンで複数のアプリケーションをホストすることは避けてください。それらはすべて同じ localStorage オブジェクトを共有します。代わりに異なるサブドメインを使用してください。

### クライアント側データベース

- 2010 年 11 月、W3C は Web SQL Database (リレーショナル SQL データベース) を非推奨仕様として発表しました。新しい標準である Indexed Database API、または IndexedDB (以前の WebSimpleDB) が活発に開発されており、キー値データベースストレージと高度なクエリを実行するためのメソッドを提供します。
- 基盤となるストレージ機構はユーザーエージェントごとに異なる場合があります。言い換えると、データが保存されているマシンへのローカル権限を持つユーザーは、アプリケーションが必要とする認証を回避できます。そのため、機密情報を local storage に保存しないことが推奨されます。
- 使用する場合、クライアント側の WebDatabase コンテンツは SQL インジェクションに対して脆弱になり得るため、適切な検証とパラメータ化が必要です。
- Local Storage と同様に、一つの [Cross Site Scripting](https://owasp.org/www-community/attacks/xss/) によって Web データベースへ悪意あるデータが読み込まれる可能性もあります。これらの中のデータを信頼できるものと考えないでください。

## Geolocation

- [Geolocation API](https://www.w3.org/TR/2021/WD-geolocation-20211124/#security) は、ユーザーエージェントが位置を計算する前にユーザーの許可を求めることを要求します。この判断が記憶されるかどうか、またどのように記憶されるかはブラウザによって異なります。一部のユーザーエージェントでは、ユーザーの位置を確認なしに取得できる機能を無効にするため、ユーザーが再度ページを訪問する必要があります。そのため、プライバシー上の理由から、`getCurrentPosition` または `watchPosition` を呼び出す前にユーザー入力を要求することが推奨されます。

## Web Workers

- Web Workers は、`XMLHttpRequest` オブジェクトを使用してドメイン内リクエストと Cross Origin Resource Sharing リクエストを実行できます。CORS セキュリティを確保するには、このチートシートの関連セクションを参照してください。
- Web Workers は呼び出し元ページの DOM へアクセスできませんが、悪意ある Web Workers は計算のために過剰な CPU を使用してサービス拒否状態を引き起こしたり、Cross Origin Resource Sharing を悪用してさらなる攻撃につなげたりできます。すべての Web Workers スクリプト内のコードが悪意あるものではないことを確認してください。ユーザーが提供した入力から Web Worker スクリプトを作成できるようにしてはいけません。
- Web Worker と交換されるメッセージを検証してください。`eval()` などで評価するための JavaScript 断片を交換しようとしてはいけません。そうすると [DOM Based XSS](https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html) 脆弱性が導入される可能性があります。

## Tabnabbing

攻撃の詳細は、この [article](https://owasp.org/www-community/attacks/Reverse_Tabnabbing) で説明されています。

要約すると、新しく開かれたページから、opener JavaScript オブジェクトインスタンスによって公開される戻りリンクを介して、親ページのコンテンツや場所に作用できる能力です。

これは、現在の場所を置き換えず、現在のウィンドウまたはタブを利用可能にする [target loading location](https://www.w3schools.com/tags/att_a_target.asp) を指定するために、`target` 属性または命令を使用する HTML リンクまたは JavaScript の `window.open` 関数に適用されます。

この問題を防ぐため、次の対策を利用できます。

親ページと子ページの間の戻りリンクを切断します。

- HTML リンクの場合:
    - この戻りリンクを切断するには、親ページから子ページへのリンクを作成するタグに `rel="noopener"` 属性を追加します。この属性値はリンクを切断しますが、ブラウザによっては子ページへのリクエストにリファラー情報が存在することを許します。
    - リファラー情報も削除するには、属性値 `rel="noopener noreferrer"` を使用します。
- JavaScript の `window.open` 関数の場合、`window.open` 関数の [windowFeatures](https://developer.mozilla.org/en-US/docs/Web/API/Window/open) パラメータに `noopener,noreferrer` の値を追加します。

上記の要素を使用した挙動はブラウザ間で異なるため、HTML リンクまたは JavaScript のどちらかでウィンドウ (またはタブ) を開き、クロスサポートを最大化するために次の設定を使用します。

- [HTML links](https://www.scaler.com/topics/html/html-links/) の場合、すべてのリンクに `rel="noopener noreferrer"` 属性を追加します。
- JavaScript の場合、ウィンドウ (またはタブ) を開くために次の関数を使用します。

```javascript
function openPopup(url, name, windowFeatures){
  //Open the popup and set the opener and referrer policy instruction
  var newWindow = window.open(url, name, 'noopener,noreferrer,' + windowFeatures);
  //Reset the opener link
  newWindow.opener = null;
}
```

- アプリケーションが送信するすべての HTTP レスポンスに、HTTP レスポンスヘッダー `Referrer-Policy: no-referrer` を追加します ([Header Referrer-Policy information](https://owasp.org/www-project-secure-headers/)。この設定により、ページからのリクエストでリファラー情報が送信されないことが保証されます。

互換性マトリクス:

- [noopener](https://caniuse.com/#search=noopener)
- [noreferrer](https://caniuse.com/#search=noreferrer)
- [referrer-policy](https://caniuse.com/#feat=referrer-policy)

## Sandboxed frames

- 信頼できないコンテンツには、`iframe` の `sandbox` 属性を使用してください。
- `iframe` の `sandbox` 属性は、`iframe` 内のコンテンツに制限を有効化します。`sandbox` 属性が設定されている場合、次の制限が有効です。
    1. すべてのマークアップは一意のオリジンからのものとして扱われます。
    2. すべてのフォームとスクリプトが無効化されます。
    3. すべてのリンクは他の browsing context を対象にできなくなります。
    4. 自動的に発動するすべての機能がブロックされます。
    5. すべてのプラグインが無効化されます。

`sandbox` 属性の値を使用すると、`iframe` の機能を [fine-grained control](https://html.spec.whatwg.org/multipage/iframe-embed-object.html#attr-iframe-sandbox) できます。

- この機能がサポートされていない古いユーザーエージェントでは、この属性は無視されます。この機能を追加の保護層として使用するか、ブラウザが sandboxed frames をサポートしているか確認し、サポートされている場合にのみ信頼できないコンテンツを表示してください。
- この属性とは別に、クリックジャッキング攻撃と意図しないフレーミングを防ぐため、`deny` と `same-origin` の値をサポートする `X-Frame-Options` ヘッダーの使用が推奨されます。framebusting `if(window!==window.top) { window.top.location=location;}` のような他の解決策は推奨されません。

## 認証情報および個人識別情報 (PII) 入力ヒント

- 入力値がブラウザにキャッシュされないよう保護してください。

> 公共のコンピューターから金融アカウントにアクセスする場合を考えます。ログオフしていても、ブラウザのオートコンプリート機能により、次にそのマシンを使う人がログインできてしまう可能性があります。これを軽減するため、入力フィールドに一切支援しないよう指示します。

```html
<input type="text" spellcheck="false" autocomplete="off" autocorrect="off" autocapitalize="off"></input>
```

PII (名前、メール、住所、電話番号) とログイン認証情報 (ユーザー名、パスワード) のテキストエリアおよび入力フィールドは、ブラウザに保存されないようにするべきです。フォームから PII をブラウザに保存させないため、次の HTML5 属性を使用してください。

- `spellcheck="false"`
- `autocomplete="off"`
- `autocorrect="off"`
- `autocapitalize="off"`

## Offline Applications

- ユーザーエージェントがオフライン閲覧用にデータを保存する許可をユーザーに求めるかどうか、またこのキャッシュがいつ削除されるかは、ブラウザごとに異なります。ユーザーが安全でないネットワーク経由で接続する場合、キャッシュポイズニングが問題になります。そのため、プライバシー上の理由から、`manifest` ファイルを送信する前にユーザー入力を要求することが推奨されます。
- ユーザーは信頼できる Web サイトだけをキャッシュし、オープンなネットワークや安全でないネットワークで閲覧した後はキャッシュを消去するべきです。

## Progressive Enhancements and Graceful Degradation Risks

- 現在のベストプラクティスは、ブラウザがサポートする機能を判定し、直接サポートされていない機能には何らかの代替を追加することです。これは onion-like な要素を意味する場合があります。たとえば、`<video>` タグがサポートされていない場合に Flash Player へフォールスルーすることや、コードレビューが必要なさまざまなソースからの追加スクリプトコードを意味する場合があります。

## セキュリティを強化する HTTP ヘッダー

アプリケーションがブラウザレベルの防御を有効にするために使用すべき HTTP セキュリティヘッダーの一覧を得るには、[OWASP Secure Headers](https://owasp.org/www-project-secure-headers/) プロジェクトを参照してください。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V3.2, V3.4, V3.5 | セッション識別子の保存、local storage、認証情報入力ヒント |
| V14.2, V14.3 | CORS、Web Messaging、sandboxed frames、HTTP セキュリティヘッダー |
