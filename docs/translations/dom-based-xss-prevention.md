# DOM Based XSS防止チートシート 日本語訳

## Attribution

- Original: DOM based XSS Prevention Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-21

## 日本語訳

# DOM based XSS Prevention Cheat Sheet

## Introduction

XSS (Cross-Site Scripting) を見るとき、一般に認識されている XSS には三つの形態があります。

- [Reflected or Stored](https://owasp.org/www-community/attacks/xss/#stored-and-reflected-xss-attacks)
- [DOM Based XSS](https://owasp.org/www-community/attacks/DOM_Based_XSS)。

[XSS Prevention Cheatsheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html) は、Reflected XSS と Stored XSS への対処を非常によく説明しています。このチートシートは DOM (Document Object Model) based XSS を扱い、[XSS Prevention Cheatsheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html) の拡張であり、その内容を理解していることを前提としています。

DOM based XSS を理解するには、Reflected XSS および Stored XSS と DOM based XSS の根本的な違いを見る必要があります。主な違いは、攻撃がアプリケーションのどこへ注入されるかです。

Reflected XSS と Stored XSS はサーバ側のインジェクション問題ですが、DOM based XSS はクライアント、つまりブラウザ側のインジェクション問題です。

このコードはすべてサーバから発生するため、XSS 欠陥の種類にかかわらず、それを XSS から安全にする責任はアプリケーション所有者にあります。また、XSS 攻撃は常にブラウザ内で**実行**されます。

Reflected/Stored XSS との違いは、攻撃がアプリケーションのどこへ追加または注入されるかです。Reflected/Stored では、信頼できない入力が HTML に動的に追加されるリクエストのサーバ側処理中に、攻撃がアプリケーションへ注入されます。DOM XSS では、クライアント内の実行時に攻撃が直接アプリケーションへ注入されます。

ブラウザが HTML や、CSS、JavaScript などの関連コンテンツをレンダリングするとき、さまざまな種類の入力に対して各種のレンダリングコンテキストを識別し、それぞれ異なる規則に従います。レンダリングコンテキストは、HTML タグとその属性の解析に関連します。

- レンダリングコンテキストの HTML パーサは、データがページ上でどのように表示され、配置されるかを決定し、HTML、HTML 属性、URL、CSS という標準コンテキストへさらに分解できます。
- 実行コンテキストの JavaScript または VBScript パーサは、スクリプトコードの解析と実行に関連します。各パーサはスクリプトコードを実行し得る方法について別個のセマンティクスを持つため、さまざまなコンテキストにおける脆弱性を緩和する一貫した規則を作ることは困難です。この複雑さは、実行コンテキスト内の各サブコンテキスト (HTML、HTML 属性、URL、CSS) において、エンコードされた値の意味や扱いが異なることでさらに増します。

この記事では、HTML、HTML 属性、URL、CSS の各コンテキストをサブコンテキストと呼びます。これらの各コンテキストは JavaScript 実行コンテキスト内から到達し、設定できるためです。

JavaScript コードでは主コンテキストは JavaScript ですが、適切なタグとコンテキストを閉じる文字があれば、攻撃者は等価な JavaScript DOM メソッドを使って他の 4 つのコンテキストを攻撃しようとする可能性があります。

以下は、JavaScript コンテキストと HTML サブコンテキストで発生する脆弱性の例です。

```html
 <script>
 var x = '<%= taintedVar %>';
 var d = document.createElement('div');
 d.innerHTML = x;
 document.body.appendChild(d);
 </script>
```

実行コンテキストの個々のサブコンテキストを順番に見ていきます。

## RULE \#1 - 実行コンテキスト内の HTML サブコンテキストへ信頼できないデータを挿入する前に、HTML エスケープしてから JavaScript エスケープする

JavaScript 内で HTML コンテンツを直接レンダリングするために使用できるメソッドや属性がいくつかあります。これらのメソッドは、実行コンテキスト内の HTML サブコンテキストを構成します。これらのメソッドに信頼できない入力が与えられると、XSS 脆弱性が生じる可能性があります。例を示します。

### 危険な HTML メソッドの例

#### 属性

```javascript
 element.innerHTML = "<HTML> Tags and markup";
 element.outerHTML = "<HTML> Tags and markup";
```

#### メソッド

```javascript
 document.write("<HTML> Tags and markup");
 document.writeln("<HTML> Tags and markup");
```

### ガイドライン

DOM 内で HTML を動的に更新する処理を安全にするには、次の対応を推奨します。

 1. HTML エンコードを行い、その後
 2. 以下の例のように、すべての信頼できない入力を JavaScript エンコードします。

```javascript
 var ESAPI = require('node-esapi');
 element.innerHTML = "<%=ESAPI.encoder().encodeForJavascript(ESAPI.encoder().encodeForHTML(untrustedData))%>";
 element.outerHTML = "<%=ESAPI.encoder().encodeForJavascript(ESAPI.encoder().encodeForHTML(untrustedData))%>";
```

```javascript
 var ESAPI = require('node-esapi');
 document.write("<%=ESAPI.encoder().encodeForJavascript(ESAPI.encoder().encodeForHTML(untrustedData))%>");
 document.writeln("<%=ESAPI.encoder().encodeForJavascript(ESAPI.encoder().encodeForHTML(untrustedData))%>");
```

## RULE \#2 - 実行コンテキスト内の HTML 属性サブコンテキストへ信頼できないデータを挿入する前に JavaScript エスケープする

実行コンテキスト内の HTML 属性*サブコンテキスト*は、標準的なエンコード規則とは異なります。これは、HTML 属性レンダリングコンテキストでは、HTML 属性から抜け出したり、XSS につながり得る追加属性を加えたりする攻撃を緩和するために、HTML 属性エンコード規則が必要になるためです。

DOM 実行コンテキスト内にいる場合、コードを実行しない HTML 属性、つまりイベントハンドラ、CSS、URL 属性以外の属性については、JavaScript エンコードだけが必要です。

たとえば一般的な規則では、HTML 属性に置かれる信頼できないデータ、つまりデータベース、HTTP リクエスト、ユーザー、バックエンドシステムなどから来るデータは HTML 属性エンコードします。これはレンダリングコンテキストへデータを出力するときには適切な手順ですが、実行コンテキストで HTML 属性エンコードを使うと、アプリケーションでのデータ表示が壊れます。

### 安全だが壊れている例

```javascript
 var ESAPI = require('node-esapi');
 var x = document.createElement("input");
 x.setAttribute("name", "company_name");
 // In the following line of code, companyName represents untrusted user input
 // The ESAPI.encoder().encodeForHTMLAttribute() is unnecessary and causes double-encoding
 x.setAttribute("value", '<%=ESAPI.encoder().encodeForJavascript(ESAPI.encoder().encodeForHTMLAttribute(companyName))%>');
 var form1 = document.forms[0];
 form1.appendChild(x);
```

問題は、companyName の値が "Johnson & Johnson" だった場合です。入力テキストフィールドには "Johnson &#x26;amp; Johnson" と表示されます。上記のケースで使用する適切なエンコードは JavaScript エンコードのみです。これにより、攻撃者が単一引用符を閉じてコードをインライン化したり、HTML に抜けて新しい script タグを開いたりすることを防ぎます。

### 安全で機能的にも正しい例

```javascript
 var ESAPI = require('node-esapi');
 var x = document.createElement("input");
 x.setAttribute("name", "company_name");
 x.setAttribute("value", '<%=ESAPI.encoder().encodeForJavascript(companyName)%>');
 var form1 = document.forms[0];
 form1.appendChild(x);
```

コードを実行しない HTML 属性を設定する場合、その値は HTML 要素のオブジェクト属性内に直接設定されるため、上位のコンテキストへ注入される懸念はない、という点に注意することが重要です。

## RULE \#3 - 実行コンテキスト内のイベントハンドラおよび JavaScript コードサブコンテキストへ信頼できないデータを挿入するときは注意する

JavaScript コード内に動的データを置くことは特に危険です。JavaScript エンコード済みデータに対する JavaScript エンコードのセマンティクスは、他のエンコードと異なるためです。多くの場合、JavaScript エンコードは実行コンテキスト内の攻撃を止めません。たとえば、JavaScript エンコードされた文字列は、JavaScript エンコードされていても実行されます。

したがって、主な推奨事項は**このコンテキストに信頼できないデータを含めないこと**です。どうしても必要な場合、以下の例は機能する方法と機能しない方法を示します。

```javascript
var x = document.createElement("a");
x.href="#";
// In the line of code below, the encoded data on the right (the second argument to setAttribute)
// is an example of untrusted data that was properly JavaScript encoded but still executes.
x.setAttribute("onclick", "\u0061\u006c\u0065\u0072\u0074\u0028\u0032\u0032\u0029");
var y = document.createTextNode("Click To Test");
x.appendChild(y);
document.body.appendChild(x);
```

`setAttribute(name_string,value_string)` メソッドは危険です。これは *value_string* を *name_string* の DOM 属性データ型へ暗黙的に強制変換するためです。

上のケースでは、属性名は JavaScript イベントハンドラであるため、属性値は暗黙的に JavaScript コードへ変換され、評価されます。上のケースでは、JavaScript エンコードは DOM based XSS を緩和しません。

コードを文字列型として受け取る他の JavaScript メソッドも、上で説明したものと同様の問題を持ちます (`setTimeout`、`setInterval`、new Function など)。これは、HTML タグのイベントハンドラ属性 (HTML パーサ) における JavaScript エンコードが XSS を緩和することとは大きく対照的です。

```html
<!-- Does NOT work  -->
<a id="bb" href="#" onclick="\u0061\u006c\u0065\u0072\u0074\u0028\u0031\u0029"> Test Me</a>
```

DOM 属性を設定するために `Element.setAttribute(...)` を使う代替として、属性を直接設定する方法があります。イベントハンドラ属性を直接設定すれば、JavaScript エンコードによって DOM based XSS を緩和できます。ただし、信頼できないデータをコマンド実行コンテキストへ直接置く設計は常に危険である点に注意してください。

``` html
<a id="bb" href="#"> Test Me</a>
```

``` javascript
//The following does NOT work because the event handler is being set to a string.
//"alert(7)" is JavaScript encoded.
document.getElementById("bb").onclick = "\u0061\u006c\u0065\u0072\u0074\u0028\u0037\u0029";

//The following does NOT work because the event handler is being set to a string.
document.getElementById("bb").onmouseover = "testIt";

//The following does NOT work because of the encoded "(" and ")".
//"alert(77)" is JavaScript encoded.
document.getElementById("bb").onmouseover = \u0061\u006c\u0065\u0072\u0074\u0028\u0037\u0037\u0029;

//The following example is tricky
// first testIt will be assigned as an onmousehover event handler, The second testIt will fire while parsing.
// becasue second testIt is a separate js statement
// this happen because of ; separator
//"testIt;testIt" is JavaScript encoded.
document.getElementById("bb").onmouseover = \u0074\u0065\u0073\u0074\u0049\u0074\u003b\u0074\u0065\u0073
                                            \u0074\u0049\u0074;

//The following DOES WORK because the encoded value is a valid variable name or function reference.
//"testIt" is JavaScript encoded
document.getElementById("bb").onmouseover = \u0074\u0065\u0073\u0074\u0049\u0074;

function testIt() {
   alert("I was called.");
}
```

JavaScript の他の場所にも、JavaScript エンコードが有効な実行可能コードとして受け入れられる箇所があります。

```javascript
 for(var \u0062=0; \u0062 < 10; \u0062++){
     \u0064\u006f\u0063\u0075\u006d\u0065\u006e\u0074
     .\u0077\u0072\u0069\u0074\u0065\u006c\u006e
     ("\u0048\u0065\u006c\u006c\u006f\u0020\u0057\u006f\u0072\u006c\u0064");
 }
 \u0077\u0069\u006e\u0064\u006f\u0077
 .\u0065\u0076\u0061\u006c
 \u0064\u006f\u0063\u0075\u006d\u0065\u006e\u0074
 .\u0077\u0072\u0069\u0074\u0065(111111111);
```

または次のような例です。

```javascript
 var s = "\u0065\u0076\u0061\u006c";
 var t = "\u0061\u006c\u0065\u0072\u0074\u0028\u0031\u0031\u0029";
 window[s](t);
```

JavaScript は国際標準 (ECMAScript) に基づいているため、JavaScript エンコードは代替の文字列表現 (文字列エスケープ) に加えて、プログラミング構造や変数内の国際文字のサポートを可能にします。

しかし HTML エンコードでは逆です。HTML タグ要素は明確に定義されており、同じタグの代替表現をサポートしません。そのため、たとえば開発者が `<a>` タグの代替表現を使えるようにする目的で HTML エンコードを使用することはできません。

### HTML エンコードの無力化特性

一般に、HTML エンコードは HTML および HTML 属性コンテキストに置かれた HTML タグを無力化します。動作する例 (HTML エンコードなし) は次のとおりです。

```html
<a href="..." >
```

通常どおりエンコードした例 (動作しない、DNW):

```html
&#x3c;a href=... &#x3e;
```

JavaScript エンコード済み値との根本的な違いを強調する HTML エンコード済みの例 (DNW):

```html
<&#x61; href=...>
```

HTML エンコードが JavaScript エンコードと同じセマンティクスに従うなら、上の行はリンクをレンダリングするために機能した可能性があります。この違いにより、JavaScript エンコードは XSS との戦いにおいて有効性の低い武器になります。

## RULE \#4 - 実行コンテキスト内の CSS 属性サブコンテキストへ信頼できないデータを挿入する前に JavaScript エスケープする

通常、CSS コンテキストから JavaScript を実行するには、CSS の `url()` メソッドへ `javascript:attackCode()` を渡すか、CSS の `expression()` メソッドを呼び出して JavaScript コードを直接実行させる必要がありました。

私の経験では、実行コンテキスト (JavaScript) から `expression()` 関数を呼び出すことは無効化されています。CSS の `url()` メソッドに対する攻撃を緩和するには、CSS の `url()` メソッドへ渡すデータを URL エンコードしていることを確認してください。

```javascript
var ESAPI = require('node-esapi');
document.body.style.backgroundImage = "url(<%=ESAPI.encoder().encodeForJavascript(ESAPI.encoder().encodeForURL(companyName))%>)";
```

## RULE \#5 - 実行コンテキスト内の URL 属性サブコンテキストへ信頼できないデータを挿入する前に URL エスケープしてから JavaScript エスケープする

実行コンテキストとレンダリングコンテキストの両方で、URL を解析するロジックは同じように見えます。したがって、実行 (DOM) コンテキストにおける URL 属性のエンコード規則にはほとんど変更がありません。

```javascript
var ESAPI = require('node-esapi');
var x = document.createElement("a");
x.setAttribute("href", '<%=ESAPI.encoder().encodeForJavascript(ESAPI.encoder().encodeForURL(userRelativePath))%>');
var y = document.createTextElement("Click Me To Test");
x.appendChild(y);
document.body.appendChild(x);
```

完全修飾 URL を使用すると、プロトコル識別子 (`http:` または `javascript:`) のコロンが URL エンコードされ、`http` および `javascript` プロトコルを呼び出せなくなるため、リンクが壊れます。

## RULE \#6 - 安全な JavaScript 関数またはプロパティを使って DOM にデータを入れる

信頼できないデータで DOM を埋める最も基本的で安全な方法は、安全な代入プロパティである `textContent` を使うことです。

安全な使用例を示します。

```html
<script>
element.textContent = untrustedData;  //does not execute code
</script>
```

## RULE \#7 - DOM Cross-site Scripting 脆弱性を修正する

DOM based cross-site scripting を修正する最良の方法は、正しい出力メソッド (sink) を使うことです。たとえば、ユーザー入力を `div tag` 要素へ書き込みたい場合、`innerHtml` を使わず、代わりに `innerText` または `textContent` を使います。これで問題は解決し、DOM based XSS 脆弱性を修正する正しい方法になります。

**eval のような危険なソースでユーザー制御入力を使うことは常に悪い考えです。99% の場合、それは悪い、または安易なプログラミング慣行を示しているため、入力をサニタイズしようとするのではなく、単純にそれを行わないでください。**

最後に、最初のコードの問題を修正するには、手間がかかり簡単に間違え得る正しい出力エンコードを試みる代わりに、次のように `element.textContent` を使ってコンテンツへ書き込みます。

```html
<b>Current URL:</b> <span id="contentholder"></span>
...
<script>
document.getElementById("contentholder").textContent = document.baseURI;
</script>
```

同じことを行いますが、今回は DOM based cross-site scripting 脆弱性に対して脆弱ではありません。

## JavaScript を利用するセキュアなアプリケーションを開発するためのガイドライン

DOM based XSS は、攻撃面が大きく、ブラウザ間で標準化が不足しているため、緩和が非常に困難です。

以下のガイドラインは、Web ベースの JavaScript アプリケーション (Web 2.0) を開発する開発者が XSS を回避できるようにするための指針を提供する試みです。

### GUIDELINE \#1 - 信頼できないデータは表示可能なテキストとしてのみ扱う

JavaScript コード内で、信頼できないデータをコードまたはマークアップとして扱うことを避けます。

### GUIDELINE \#2 - テンプレート化された JavaScript を構築するとき、アプリケーションへ入る信頼できないデータは常に JavaScript エンコードし、引用符付き文字列として区切る

次の例に示すように、アプリケーションへ入る信頼できないデータは常に JavaScript エンコードし、引用符付き文字列として区切ります。

```javascript
var x = "<%= Encode.forJavaScript(untrustedData) %>";
```

### GUIDELINE \#3 - 動的インターフェースを構築するには document.createElement("...")、element.setAttribute("...","value")、element.appendChild(...) などを使う

`document.createElement("...")`、`element.setAttribute("...","value")`、`element.appendChild(...)` などは、動的インターフェースを構築する安全な方法です。

ただし、`element.setAttribute` が安全なのは限られた数の属性だけである点に注意してください。

危険な属性には、`onclick` や `onblur` など、コマンド実行コンテキストである任意の属性が含まれます。

安全な属性の例には、`align`、`alink`、`alt`、`bgcolor`、`border`、`cellpadding`、`cellspacing`、`class`、`color`、`cols`、`colspan`、`coords`、`dir`、`face`、`height`、`hspace`、`ismap`、`lang`、`marginheight`、`marginwidth`、`multiple`、`nohref`、`noresize`、`noshade`、`nowrap`、`ref`、`rel`、`rev`、`rows`、`rowspan`、`scrolling`、`shape`、`span`、`summary`、`tabindex`、`title`、`usemap`、`valign`、`value`、`vlink`、`vspace`、`width` があります。

### GUIDELINE \#4 - 信頼できないデータを HTML レンダリングメソッドへ送らない

以下のメソッドへ信頼できないデータを入れることは避けます。

1. `element.innerHTML = "...";`
2. `element.outerHTML = "...";`
3. `document.write(...);`
4. `document.writeln(...);`

### GUIDELINE \#5 - 渡されたデータを暗黙的に eval() する多数のメソッドを避ける

渡されたデータを暗黙的に `eval()` するメソッドは多数あり、それらは避けなければなりません。

これらのメソッドへ渡される信頼できないデータについては、必ず次を行ってください。

1. 文字列区切り文字で区切る
2. クロージャ内に閉じ込める、または用途に基づいて N レベルまで JavaScript エンコードする
3. カスタム関数でラップする

上記の手順 3 に従い、信頼できないデータがカスタム関数内の危険なメソッドへ送られないようにしてください。または、エンコードの追加レイヤーを加えることで対処してください。

#### エンクロージャの利用 (Gaz の提案)

以下の例は、二重 JavaScript エンコードを避けるためにクロージャを使う方法を示しています。

```javascript
 var ESAPI = require('node-esapi');
 setTimeout((function(param) { return function() {
          customFunction(param);
        }
 })("<%=ESAPI.encoder().encodeForJavascript(untrustedData)%>"), y);
```

もう一つの代替は、N レベルのエンコードを使うことです。

#### N レベルのエンコード

コードが次のような場合、入力データを二重 JavaScript エンコードするだけで済みます。

```javascript
setTimeout("customFunction('<%=doubleJavaScriptEncodedData%>', y)");
function customFunction (firstName, lastName)
     alert("Hello" + firstName + " " + lastNam);
}
```

`doubleJavaScriptEncodedData` は、単一引用符内で JavaScript エンコードの最初のレイヤーが (実行時に) 解除されます。

その後、`setTimeout` の暗黙的な `eval` が JavaScript エンコードの別レイヤーを解除し、正しい値を `customFunction` へ渡します。

二重 JavaScript エンコードだけで済む理由は、`customFunction` 関数自体が、暗黙的または明示的に `eval` を呼び出す別のメソッドへ入力を渡していないためです。*firstName* が暗黙的または明示的に `eval()` を呼び出す別の JavaScript メソッドへ渡される場合、上記の `<%=doubleJavaScriptEncodedData%>` は `<%=tripleJavaScriptEncodedData%>` に変更する必要があります。

重要な実装上の注意として、JavaScript コードが二重または三重にエンコードされたデータを文字列比較で利用しようとすると、そのデータが if 比較へ渡される前に通過した `evals()` の数と、値が JavaScript エンコードされた回数に基づいて、値が異なるものとして解釈される場合があります。

**A** が二重 JavaScript エンコードされている場合、次の **if** チェックは false を返します。

``` javascript
 var x = "doubleJavaScriptEncodedA";  //\u005c\u0075\u0030\u0030\u0034\u0031
 if (x == "A") {
    alert("x is A");
 } else if (x == "\u0041") {
    alert("This is what pops");
 }
```

これは興味深い設計上の論点を提起します。理想的には、エンコードを適用して上記の問題を避ける正しい方法は、データがアプリケーションへ導入される出力コンテキストに対してサーバ側でエンコードすることです。

次に、信頼できないデータが渡される個々のサブコンテキスト (DOM メソッド) に対して、[node-esapi](https://github.com/ESAPI/node-esapi/) などの JavaScript エンコードライブラリを使ってクライアント側でエンコードします。

使用例をいくつか示します。

```javascript
//server-side encoding
var ESAPI = require('node-esapi');
var input = "<%=ESAPI.encoder().encodeForJavascript(untrustedData)%>";
```

```javascript
//HTML encoding is happening in JavaScript
var ESAPI = require('node-esapi');
document.writeln(ESAPI.encoder().encodeForHTML(input));
```

一つの選択肢は、JavaScript ライブラリ内で ECMAScript 5 の immutable properties を利用することです。
Gaz (Gareth) が提示したもう一つの選択肢は、匿名クロージャを使って可変性を制限する特定のコード構造を使うことでした。

例を示します。

```javascript
function escapeHTML(str) {
     str = str + "''";
     var out = "''";
     for(var i=0; i<str.length; i++) {
         if(str[i] === '<') {
             out += '&lt;';
         } else if(str[i] === '>') {
             out += '&gt;';
         } else if(str[i] === "'") {
             out += '&#39;';
         } else if(str[i] === '"') {
             out += '&quot;';
         } else {
             out += str[i];
         }
     }
     return out;
}
```

### GUIDELINE \#6 - 信頼できないデータは式の右辺でのみ使用する

信頼できないデータは式の右辺でのみ使用します。特に、コードのように見え、アプリケーションへ渡される可能性があるデータ (`location` や `eval()` など) ではそうしてください。

```javascript
window[userDataOnLeftSide] = "userDataOnRightSide";
```

式の左辺で信頼できないユーザーデータを使うと、攻撃者は window オブジェクトの内部属性および外部属性を破壊できます。一方、式の右辺でユーザー入力を使っても、直接操作は許されません。

### GUIDELINE \#7 - DOM で URL エンコードするときは文字セットの問題に注意する

DOM で URL エンコードするときは、JavaScript DOM の文字セットが明確に定義されていないため、文字セットの問題に注意してください (Mike Samuel)。

### GUIDELINE \#8 - object\[x\] アクセサを使うときはオブジェクトプロパティへのアクセスを制限する

`object[x]` アクセサを使うときは、オブジェクトプロパティへのアクセスを制限します (Mike Samuel)。言い換えると、信頼できない入力と指定されたオブジェクトプロパティの間に間接参照のレベルを追加します。

map 型を使った問題の例を示します。

```javascript
var myMapType = {};
myMapType[<%=untrustedData%>] = "moreUntrustedData";
```

上記のコードを書いた開発者は、`myMapType` オブジェクトへキー付き要素を追加しようとしていました。しかし、攻撃者はこれを使って `myMapType` オブジェクトの内部属性および外部属性を破壊できます。

よりよいアプローチは次のようにすることです。

```javascript
if (untrustedData === 'location') {
  myMapType.location = "moreUntrustedData";
}
```

### GUIDELINE \#9 - JavaScript を ECMAScript 5 canopy または sandbox 内で実行する

JavaScript API が侵害されにくくなるよう、JavaScript を ECMAScript 5 の [canopy](https://github.com/jcoglan/canopy) または sandbox 内で実行します (Gareth Heyes と John Stevens)。

JavaScript sandbox / sanitizer の例をいくつか示します。

- [js-xss](https://github.com/leizongmin/js-xss)
- [sanitize-html](https://github.com/apostrophecms/sanitize-html)
- [DOMPurify](https://github.com/cure53/DOMPurify)
- [MDN - HTML Sanitizer API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Sanitizer_API)
- [OWASP Summit 2011 - DOM Sandboxing](https://owasp.org/www-pdf-archive/OWASPSummit2011DOMSandboxingBrowserSecurityTrack.pdf)

### GUIDELINE \#10 - JSON をネイティブ JavaScript オブジェクトへ変換するために eval() しない

JSON をネイティブ JavaScript オブジェクトへ変換するために `eval()` しないでください。代わりに `JSON.toJSON()` と `JSON.parse()` を使います (Chris Schmidt)。

## DOM Based XSS の緩和に関連するよくある問題

### 複雑なコンテキスト

多くの場合、コンテキストは必ずしも簡単に識別できるわけではありません。

```html
<a href="javascript:myFunction('<%=untrustedData%>', 'test');">Click Me</a>
 ...
<script>
Function myFunction (url,name) {
    window.location = url;
}
</script>
```

上の例では、信頼できないデータは最初にレンダリング URL コンテキスト (`a` タグの `href` 属性) に入り、その後 JavaScript 実行コンテキスト (`javascript:` プロトコルハンドラ) へ変化し、信頼できないデータを実行 URL サブコンテキスト (`myFunction` の `window.location`) へ渡しています。

データは JavaScript コード内に導入され、URL サブコンテキストへ渡されるため、適切なサーバ側エンコードは次のようになります。

```html
<a href="javascript:myFunction('<%=ESAPI.encoder().encodeForJavascript(ESAPI.encoder().encodeForURL(untrustedData)) %>', 'test');">
Click Me</a>
 ...
```

または、immutable な JavaScript クライアント側エンコードライブラリを使う ECMAScript 5 を使用している場合は、次のようにできます。

```html
<!-- server side URL encoding has been removed.  Now only JavaScript encoding on server side. -->
<a href="javascript:myFunction('<%=ESAPI.encoder().encodeForJavascript(untrustedData)%>', 'test');">Click Me</a>
 ...
<script>
Function myFunction (url,name) {
    var encodedURL = ESAPI.encoder().encodeForURL(url);  //URL encoding using client-side scripts
    window.location = encodedURL;
}
</script>
```

### エンコードライブラリの不整合

オープンソースのエンコードライブラリは数多くあります。

1. OWASP [ESAPI](https://owasp.org/www-project-enterprise-security-api/)
2. OWASP [Java Encoder](https://owasp.org/www-project-java-encoder/)
3. Apache Commons Text [StringEscapeUtils](https://commons.apache.org/proper/commons-text/javadocs/api-release/org/apache/commons/text/StringEscapeUtils.html)、[Apache Commons Lang3](https://commons.apache.org/proper/commons-lang/apidocs/org/apache/commons/lang3/StringEscapeUtils.html) のものを置き換えるもの
4. [Jtidy](http://jtidy.sourceforge.net/)
5. 自社のカスタム実装

denylist で動くものもあれば、"&lt;" や "&gt;" のような重要な文字を無視するものもあります。

Java Encoder は、HTML、CSS、JavaScript エンコードをサポートするアクティブなプロジェクトです。

ESAPI は allowlist で動作し、すべての非英数字をエンコードする数少ないライブラリの一つです。それぞれのコンテキストで脆弱性の悪用に使える文字を理解しているエンコードライブラリを使うことが重要です。必要な適切なエンコードに関しては誤解が多くあります。

### エンコードに関する誤解

多くのセキュリティトレーニングカリキュラムや論文は、XSS を解決するために HTML エンコードを盲目的に使用することを推奨しています。

JavaScript パーサは HTML エンコードを理解しないため、これは論理的には慎重な助言のように見えます。

しかし、Web アプリケーションから返されるページが `text/xhtml` のコンテンツタイプを使用している場合、またはファイル拡張子が `*.xhtml` の場合、HTML エンコードは XSS の緩和に機能しない可能性があります。

例を示します。

```html
<script>
&#x61;lert(1);
</script>
```

上記の HTML エンコードされた値は依然として実行可能です。さらに覚えておくべきこととして、DOM 要素の value 属性を使って値を取得すると、エンコードは失われます。

サンプルページとスクリプトを見てみます。

```html
<form name="myForm" ...>
  <input type="text" name="lName" value="<%=ESAPI.encoder().encodeForHTML(last_name)%>">
 ...
</form>
<script>
  var x = document.myForm.lName.value;  //when the value is retrieved the encoding is reversed
  document.writeln(x);  //any code passed into lName is now executable.
</script>
```

最後に、通常は安全な JavaScript の特定のメソッドが、一部のコンテキストでは安全でなくなるという問題があります。

### 通常は安全なメソッド

安全だと考えられている属性の一例は `innerText` です。

一部の論文やガイドは、`innerHTML` における XSS を緩和するために、`innerHTML` の代替として `innerText` の使用を推奨しています。しかし、`innerText` が適用されるタグによっては、コードが実行される可能性があります。

```html
<script>
 var tag = document.createElement("script");
 tag.innerText = "<%=untrustedData%>";  //executes code
</script>
```

`innerText` 機能はもともと Internet Explorer によって導入され、主要ブラウザベンダーすべてに採用された後、2016 年に HTML 標準で正式に仕様化されました。

### variant analysis を使って DOM XSS を検出する

**脆弱なコード:**

```
<script>
var x = location.hash.split("#")[1];
document.write(x);
</script>
```

上記の DOM XSS を識別する Semgrep ルールは、この [link](https://semgrep.dev/s/we30) です。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V1.2 | コンテキスト別の出力エンコーディング、HTML/属性/URL/CSS サブコンテキスト、信頼できない入力の安全な DOM 反映 |
| V1.3 | クライアント側入力源、危険シンク、DOM API の安全利用、JavaScript 実行コンテキストでの XSS 防御 |
