# Cross-Site Request Forgery Prevention Cheat Sheet

<div className="docHero docHero--encoding">
  <h1>Cross-Site Request Forgery Prevention Cheat Sheet</h1>
  <p className="docSubtitle">CSRF防止チートシート</p>
  <div className="docMeta">
    <span className="docPill">最終更新: 2026-05-20</span>
    <span className="docPill">読了時間: 約 10 分</span>
    <span className="docPill">カテゴリ: Encoding and Sanitization</span>
  </div>
</div>

<div className="tabbedContent">
  <input className="tabInput" type="radio" name="csrf-prevention-view" id="csrf-prevention-translation" defaultChecked />
  <input className="tabInput" type="radio" name="csrf-prevention-view" id="csrf-prevention-summary" />
  <input className="tabInput" type="radio" name="csrf-prevention-view" id="csrf-prevention-checklist" />
  <input className="tabInput" type="radio" name="csrf-prevention-view" id="csrf-prevention-bilingual" />

  <div className="contentTabs">
    <label htmlFor="csrf-prevention-translation">翻訳</label>
    <label htmlFor="csrf-prevention-summary">要点</label>
    <label htmlFor="csrf-prevention-checklist">チェックリスト</label>
    <label htmlFor="csrf-prevention-bilingual">対比表示</label>
  </div>

  <aside className="viewToc" aria-label="表示中の目次">
    <strong>目次</strong>
    <nav className="viewTocPanel translationToc">
      <a href="#introduction">Introduction</a>
      <a href="#token-based-mitigation">Token-Based Mitigation</a>
      <a href="#fetch-metadata-headers">Fetch Metadata headers</a>
      <a href="#disallowing-simple-requests">Disallowing simple requests</a>
      <a href="#dealing-with-client-side-csrf-attacks-important">Client-Side CSRF</a>
      <a href="#defense-in-depth-techniques">Defense In Depth</a>
      <a href="#possible-csrf-vulnerabilities-in-login-forms">Login Forms</a>
      <a href="#references-in-related-cheat-sheets">Related Cheat Sheets</a>
    </nav>
    <nav className="viewTocPanel summaryToc">
      <a href="#csrf-prevention-summary-panel">要点</a>
    </nav>
    <nav className="viewTocPanel checklistToc">
      <a href="#csrf-prevention-checklist-panel">チェックリスト</a>
    </nav>
    <nav className="viewTocPanel bilingualToc">
      <a href="#csrf-prevention-bilingual-panel">対比表示</a>
      <a href="#introduction-1">Introduction</a>
      <a href="#token-based-mitigation-1">Token-Based Mitigation</a>
      <a href="#fetch-metadata-and-defense-in-depth">Fetch Metadata and Defense in Depth</a>
    </nav>
  </aside>

  <section id="csrf-prevention-translation-panel" className="tabPanel translationPanel contentPanel">

## Introduction

[Cross-Site Request Forgery (CSRF)](https://owasp.org/www-community/attacks/csrf) 攻撃は、悪意ある Web サイト、メール、ブログ、インスタントメッセージ、またはプログラムが、認証済みユーザーの Web ブラウザをだまして、信頼されたサイト上で望まない操作を実行させるときに発生します。対象ユーザーがそのサイトに認証済みである場合、保護されていないサイトは、正当な認可済みリクエストと偽造された認証済みリクエストを区別できません。

ブラウザのリクエストにはセッション Cookie を含むすべての Cookie が自動的に含まれるため、適切な認可が使用されていなければこの攻撃は成立します。つまり、対象サイトのチャレンジレスポンス機構が、リクエスト送信者の本人性と権限を検証していない状態です。実質的に、CSRF 攻撃は、被害者が気付かないまま、被害者のブラウザを通じて攻撃者が指定した機能を対象システムに実行させます。

ただし、成功した CSRF 攻撃が悪用できるのは、脆弱なアプリケーションが公開している機能とユーザーの権限に限られます。ユーザーの認証情報によっては、攻撃者は送金、パスワード変更、不正購入、対象アカウントの権限昇格、またはユーザーに許可されている任意の操作を実行できる可能性があります。

CSRF から防御するには、次の原則に従います。

**重要: Cross-Site Scripting (XSS) は、すべての CSRF 緩和策を破れる可能性があります。** XSS 脆弱性は CSRF 保護を迂回できますが、Cookie 認証に依存する Web アプリケーションでは CSRF トークンが依然として不可欠です。アプリケーションのクライアントと認証方式を考慮し、最適な CSRF 保護方式を決めてください。

- XSS 欠陥を防ぐ詳細なガイダンスについては、OWASP [XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html) を参照します。
- まず、フレームワークに [組み込みの CSRF 保護](#built-in-or-existing-csrf-implementations) があるかを確認し、それを使用します。
- フレームワークに組み込みの CSRF 保護がない場合は、すべての状態変更リクエストに [CSRF トークン](#token-based-mitigation) を追加し、バックエンドで検証します。
- モダンブラウザのみを対象にするソフトウェアでは、後述のフォールバックと組み合わせて [Fetch Metadata headers](#fetch-metadata-headers) を使用し、クロスサイトの状態変更リクエストをブロックできます。
- ステートフルなソフトウェアでは [Synchronizer Token Pattern](#synchronizer-token-pattern) を使用します。
- ステートレスなソフトウェアでは [Double Submit Cookie](#alternative-using-a-double-submit-cookie-pattern) を使用します。
- API 駆動のサイトで `<form>` タグを使用できない場合は、[カスタムリクエストヘッダー](#employing-custom-request-headers-for-ajaxapi) の利用を検討します。
- [Defense in Depth Mitigations](#defense-in-depth-techniques) の少なくとも1つの緩和策を実装します。
- セッション Cookie には [SameSite Cookie Attribute](#samesite-cookie-attribute) を使用できます。ただし、ドメイン全体に対して Cookie を設定しないよう注意してください。すべてのサブドメインが Cookie を共有するため、サブドメインが制御外のドメインへ CNAME されている場合に特に問題になります。
- 高機密操作では [ユーザー操作ベースの保護](#user-interaction-based-csrf-defense) の実装を検討します。
- [標準ヘッダーで Origin を検証](#using-standard-headers-to-verify-origin) することを検討します。
- 状態変更操作に GET リクエストを使用してはいけません。
- 何らかの理由で使用する場合は、そのリソースにも CSRF 対策を適用します。

### Built-In Or Existing CSRF Implementations

カスタムトークンや Fetch Metadata 実装を作る前に、フレームワークやプラットフォームが既に利用可能な CSRF 保護を提供していないか確認します。組み込み防御はフレームワーク作者によって保守され、微妙な実装ミスのリスクを減らすため、一般に望ましい選択です。

たとえば、.NET は組み込み保護を使って CSRF に脆弱なリソースへトークンを追加できます。ただし、鍵管理やトークン管理などの適切な設定は利用者の責任です。Go 1.25 以降では標準ライブラリの `CrossOriginProtection` 型を利用でき、`Sec-Fetch-Site` と関連ヘッダーの検証を含む Fetch Metadata ベースの CSRF 防御を実装できます。

## Token-Based Mitigation

[Synchronizer Token Pattern](#synchronizer-token-pattern) は、CSRF を緩和する最も一般的で推奨される方法の一つです。

### Synchronizer Token Pattern

CSRF トークンはサーバー側で生成し、ユーザーセッションごと、またはリクエストごとに生成します。リクエストごとのトークンは、盗まれたトークンを攻撃者が悪用できる時間が短いため、セッションごとのトークンより安全です。ただし、ユーザビリティ上の懸念を生むことがあります。

たとえば、ブラウザの「戻る」ボタンはリクエストごとのトークンによって妨げられることがあります。前のページには既に無効になったトークンが含まれている可能性があり、そのページで操作するとサーバー側で CSRF の誤検知イベントになります。セッションごとのトークン実装では、初回生成後に値をセッションへ保存し、セッションが期限切れになるまで後続リクエストで使用します。

クライアントがリクエストを発行するとき、サーバー側コンポーネントはそのリクエスト内のトークンの存在と妥当性を確認し、ユーザーセッション内のトークンと比較しなければなりません。トークンがない場合、または値が一致しない場合はリクエストを拒否します。潜在的な CSRF 攻撃としてログ記録するなどの追加アクションも検討します。

CSRF トークンは次の性質を持つべきです。

- ユーザーセッションごとに一意である。
- 秘密である。
- [安全な方法](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html#rule---use-cryptographically-secure-pseudo-random-number-generators-csprng) で生成された大きな乱数値であり、予測困難である。

CSRF トークンがなければ攻撃者はバックエンドサーバーに対して有効なリクエストを作成できないため、CSRF トークンは CSRF を防ぎます。

#### Transmitting CSRF Tokens in Synchronized Patterns

CSRF トークンは、HTML または JSON レスポンスなどのレスポンスペイロードの一部としてクライアントへ送信できます。その後、フォーム送信時の hidden フィールド、AJAX リクエストのカスタムヘッダー、または JSON ペイロードの一部としてサーバーへ返送できます。Synchronizer Pattern では CSRF トークンを Cookie で送信すべきではありません。CSRF トークンはサーバーログや URL に漏えいさせてはいけません。

```html
<form action="/transfer.do" method="post">
<input type="hidden" name="CSRFToken" value="OWY4NmQwODE4ODRjN2Q2NTlhMmZlYWEwYzU1YWQwMTVhM2JmNGYxYjJiMGI4MjJjZDE1ZDZMGYwMGEwOA==">
[...]
</form>
```

カスタムヘッダー付きリクエストは自動的に同一オリジンポリシーの対象になるため、hidden フォームパラメータに CSRF トークンを追加するより、JavaScript でカスタム HTTP リクエストヘッダーに挿入する方が安全です。

### ALTERNATIVE: Using A Double-Submit Cookie Pattern

サーバー側で CSRF トークンの状態を保持することが難しい場合、Double Submit Cookie Pattern という代替手法を使用できます。この手法は実装が容易でステートレスです。実装方法はいくつかあり、もっとも一般的なバリエーションは naive pattern です。

#### Signed Double-Submit Cookie (RECOMMENDED)

Double Submit Cookie Pattern の最も安全な実装は Signed Double-Submit Cookie です。これはトークンをユーザーの認証済みセッション、たとえばセッション ID に明示的に結び付けます。単にトークンへ署名するだけでセッションに紐付けない実装は、保護が限定的で Cookie injection 攻撃に脆弱なままです。CSRF トークンは必ずセッション固有データへ明示的に紐付けます。

トークンにセッション ID や claims などの機密情報が含まれる場合は、サーバー側の秘密鍵を使った HMAC を使用します。これにより完全性を確保しながらトークン偽造を防げます。HMAC は単純なハッシュより望ましく、さまざまな暗号攻撃に耐性があります。トークン内容の機密性が必要な場合は、認証付き暗号を使用します。

##### Employing HMAC CSRF Tokens

HMAC CSRF トークンを生成するには、システムには次が必要です。

- ログインセッションごとに変わるセッション依存値。ユーザーのメールアドレスや ID のような静的値は使用しないでください。サーバー側セッション ID や、JWT 作成ごとに変わるランダム値などを選択できます。
- HMAC ハッシュを生成するための秘密暗号鍵。これは naive 実装のランダム値とは別物です。[Cryptographic Storage](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html#key-storage) で説明されるように保存します。
- 衝突防止のためのランダム値。連続呼び出しが同じハッシュを生成しないよう、できれば暗号学的に安全な乱数を生成します。

CSRF トークンに有効期限としてタイムスタンプを含めるのは一般的な誤解です。CSRF トークンはアクセストークンではありません。セッション情報を使って、セッション全体を通じてリクエストの真正性を検証するために使用されます。新しいセッションでは新しいトークンを生成します。

##### Pseudo-Code For Implementing HMAC CSRF Tokens

生成と検証の擬似コードでは、秘密鍵、現在のセッション ID、暗号学的乱数を集め、`sessionID.length + "!" + sessionID + "!" + randomValue.length + "!" + randomValue` のようなメッセージに HMAC を計算します。最終 CSRF トークンには HMAC と `randomValue` を含めますが、セッション ID を平文で含めるべきではありません。

検証時には、リクエストから CSRF トークンを取得し、HMAC と `randomValue` を分離します。現在のセッションと `randomValue` から期待される HMAC を再生成し、リクエストの HMAC と定数時間比較します。一致しない場合は 403 で拒否し、エラーを記録します。タイミング攻撃を防ぐため、比較には `constantTimeEquals` のような定数時間比較関数を使用します。

### Naive Double-Submit Cookie Pattern (DISCOURAGED)

> [!WARNING]
> Naive Double-Submit Cookie Pattern は、対象ドメインに Cookie を書き込める攻撃者によって迂回可能です。たとえば、脆弱な兄弟サブドメイン、DNS takeover、非 `__Host-` Cookie に対する平文 HTTP Cookie injection などが該当します。新規コードでは、上記の Signed Double-Submit Cookie Pattern を使用してください。naive pattern は参照用としてのみ記載されています。

Naive Double-Submit Cookie は、暗号学的に強いランダム値を Cookie とリクエストパラメータの両方として使用し、サーバーが Cookie 値とリクエスト値の一致を確認する手法です。サイトは、すべてのトランザクションリクエストにこのランダム値を **カスタムリクエストヘッダーまたはフォームパラメータとしてのみ** 含めることを要求する必要があります。Cookie 検証は安全ではありません。

ブラウザはクロスサイトリクエストに Cookie を自動送信するため、攻撃者はこれを自動的に誘発できます。セキュリティには、ユーザー意図を示す明示的なクライアント送信、つまりヘッダーまたはパラメータが必要です。

## Fetch Metadata headers

Fetch Metadata request headers は、HTTP リクエストがどの文脈から行われたかに関する追加情報を提供します。サーバーは、特に `Sec-Fetch-Site` を使用して、明らかなクロスサイトリクエストを軽量かつ信頼性高くブロックできます。

一部の古いブラウザは `Sec-Fetch-*` ヘッダーを送信しないため、Fetch Metadata 実装では [標準 Origin 検証](#using-standard-headers-to-verify-origin) へのフォールバックが必須です。`Sec-Fetch-*` は 2023 年 3 月以降、主要ブラウザでサポートされています。

Fetch Metadata request headers には、`Sec-Fetch-Site`、`Sec-Fetch-Mode`、`Sec-Fetch-Dest`、`Sec-Fetch-User` があります。仕様に列挙されていない値が含まれる場合、将来互換性のため、サーバーはそのヘッダーを無視すべきです。

### Ease of use

Synchronizer Token や Double-Submit Pattern は追加のクライアント/サーバー連携を必要とし、正しく実装するのが難しい場合があります。一方、Fetch Metadata チェックは通常、サーバー側で `Sec-Fetch-Site` を確認し、必要に応じて `Sec-Fetch-Mode` や `Sec-Fetch-Dest` で調整するだけでよく、クライアント変更を必要としません。

### Browser compatibility

Fetch Metadata request headers は、デスクトップとモバイルのモダンブラウザでサポートされています。`Sec-Fetch-*` をサポートしない古いブラウザや埋め込みブラウザでは、標準 Origin 検証へのフォールバックで必要なカバレッジを提供すべきです。

### How to treat Fetch Metadata headers on the server-side

`Sec-Fetch-Site` は、CSRF に似たクロスオリジンリクエストをブロックするために最も有用な Fetch Metadata ヘッダーであり、Fetch-Metadata ベースのポリシーでは主要なシグナルにすべきです。`Sec-Fetch-Mode`、`Sec-Fetch-Dest`、`Sec-Fetch-User` は、トップレベルナビゲーションの許可や特定のリソースエンドポイントの許可など、ポリシー調整に使用します。

高レベルポリシーでは、`Sec-Fetch-Site` が存在する場合、`cross-site` を状態変更アクションでは信頼しないものとして扱い、POST/PUT/PATCH/DELETE のような非 safe method を既定で拒否します。GET、HEAD、OPTIONS のような safe method が状態変更に使われるアプリケーションでは、そのエンドポイントを明示的に例外扱いし、Fetch Metadata ヘッダーのレビューまたは追加防御を要求します。

### Requirements

Fetch Metadata を CSRF 防御として使う場合、ログ記録、監視、フォールバック、信頼できる Origin の管理、safe method の整理、状態変更エンドポイントの洗い出しが必要です。既存システムでは、まずレポートまたは監視モードで導入し、誤検知を確認してからブロックへ移行します。

### Concerns

Fetch Metadata はすべてのブラウザやすべてのクライアントで利用できるわけではありません。また、同一サイト内のサブドメインが侵害されている場合や、ビジネス要件としてクロスサイト呼び出しを許可する必要がある場合には、追加のトークン、Origin 検証、認可チェックと組み合わせる必要があります。

### Rollout & testing recommendations

段階的に導入し、まずログで `Sec-Fetch-*` ヘッダーの有無と値を観測します。状態変更エンドポイントを対象にポリシーを適用し、誤検知がないことを確認したうえでブロックを有効化します。CI と統合テストでは、クロスサイト、same-site、same-origin、ヘッダーなしのケースを検証します。

## Disallowing simple requests

ブラウザの単純リクエストはプリフライトなしで送信されるため、CSRF 攻撃に使われやすい場合があります。API では単純リクエストを許可しない設計にし、カスタムヘッダーや非単純コンテンツタイプを要求することで、CORS プリフライトと同一オリジン制約を活用できます。

### Disallowing simple content types

`application/x-www-form-urlencoded`、`multipart/form-data`、`text/plain` などの単純コンテンツタイプを状態変更 API で受け付けないようにします。代わりに `application/json` などを要求し、必要に応じて CSRF トークンまたはカスタムヘッダーを必須にします。

### Employing Custom Request Headers for AJAX/API

AJAX/API では、状態変更リクエストにカスタムヘッダーを要求できます。カスタムヘッダー付きリクエストはブラウザの同一オリジンポリシーと CORS の対象になるため、攻撃者が別オリジンから単純なフォーム投稿で再現しにくくなります。ヘッダー名は `X-CSRF-Token` や `X-XSRF-TOKEN` など、フレームワークに合わせて選びます。

#### Custom Headers and CORS

CORS 設定で任意の Origin や任意のヘッダーを安易に許可すると、カスタムヘッダーによる防御を弱めます。`Access-Control-Allow-Origin` は信頼できる Origin に限定し、資格情報付きリクエストを許可する場合は特に厳格に管理します。

## Dealing with Client-Side CSRF Attacks (IMPORTANT)

Client-side CSRF は、クライアント側 JavaScript が攻撃者制御の入力に基づいて、認証済み状態で意図しないリクエストを生成する問題です。従来の CSRF トークンは、JavaScript 自身が正しいトークンを付けてしまう場合には防御にならないことがあります。

### Client-side CSRF Example

典型例では、URL フラグメント、クエリパラメータ、postMessage、または外部入力から API パスや HTTP メソッドを読み取り、JavaScript がその値に従って状態変更リクエストを送信します。攻撃者がその入力を操作できると、ユーザーのブラウザは正規の CSRF トークンや Cookie を付けたまま、攻撃者が意図した API を呼び出します。

### Client-side CSRF Mitigation Techniques

クライアント側でリクエスト先、HTTP メソッド、パラメータを許可リスト化し、外部入力から直接組み立てないようにします。重要な操作ではサーバー側でも認可、Origin/Fetch Metadata、トークン、ユーザー確認を組み合わせます。URL や postMessage から来る値は信頼せず、スキーマ検証と固定ルーティングを行います。

## Defense In Depth Techniques

CSRF 対策は単一の仕組みに依存せず、多層防御として組み合わせます。SameSite Cookie、Origin/Referer 検証、Host Prefix Cookie、ユーザー操作ベースの確認などは、トークン方式や Fetch Metadata と併用できます。

### SameSite (Cookie Attribute)

SameSite Cookie 属性は、クロスサイトリクエストで Cookie を送信するかを制御します。`Strict` は最も厳しく、`Lax` はトップレベルナビゲーションなど一部を許可します。`None` を使用する場合は `Secure` が必要であり、クロスサイト利用が本当に必要な Cookie に限定します。

#### Limitations of SameSite

SameSite は強力な追加防御ですが、すべての CSRF リスクを排除するものではありません。古いブラウザ、同一サイトのサブドメイン侵害、ログイン CSRF、意図しない safe method の状態変更などには注意が必要です。

### Using Standard Headers to Verify Origin

`Origin` と `Referer` ヘッダーを使って、リクエストの送信元 Origin が期待したものかを検証できます。これらはトークンの代替というより補助防御として使います。

#### Identifying Source Origin (via Origin/Referer Header)

まず `Origin` ヘッダーを確認し、存在しない場合は `Referer` を確認します。どちらも存在しない、または期待した Origin と一致しない場合は、リクエストを拒否するか、より厳格な追加確認を要求します。

#### Identifying the Target Origin

ターゲット Origin は、設定値、`Host` ヘッダー、`X-Forwarded-Host` などから決まります。リバースプロキシやロードバランサ配下では、外部から見える正しい Origin を信頼できる設定として管理することが重要です。

#### Using Cookies with Host Prefixes to Identify Origins

`__Host-` Prefix を持つ Cookie は、`Secure`、`Path=/`、`Domain` 属性なしという制約を持ちます。これによりサブドメインからの Cookie injection を防ぎやすくなり、Origin 境界を強める補助になります。

### User Interaction-Based CSRF Defense

高機密操作では、CSRF トークンだけでなく、再認証、確認画面、ワンタイムコード、ユーザー操作の明示的な確認などを要求できます。送金、メールアドレス変更、パスワード変更、権限変更のような操作では特に有効です。

## Possible CSRF Vulnerabilities in Login Forms

CSRF はユーザーが認証済みであることを前提に語られることが多いですが、ログインフォームにも CSRF 脆弱性は発生し得ます。たとえば、攻撃者が自分のアカウントで被害者をログインさせ、その後に被害者がカード情報などを入力すると、攻撃者のアカウントに紐付く形で情報や操作が発生する可能性があります。

ログイン CSRF は、認証前セッションを作成し、ログインフォームにトークンを含めることで緩和できます。認証前セッションは、認証後の実セッションへそのまま移行してはいけません。セッション固定攻撃を避けるため、認証後は破棄して新しいセッションを作成します。AJAX リクエストでは、前述のカスタムリクエストヘッダーも緩和策になります。

## REFERENCE: Sample JEE Filter Demonstrating CSRF Protection

公式ページでは、CSRF 保護の概念を示す JEE web filter の参照実装が紹介されています。このサンプルは、標準ヘッダーによる same origin 検証、double submit cookie、SameSite Cookie 属性などのステートレス緩和策を実装します。

ただし、これは参照サンプルであり完全な実装ではありません。たとえば、Origin/Referer ヘッダーの検証が成功した場合の制御フローや、Referer ヘッダーのポート、ホスト、プロトコルレベルの検証が不足しています。開発者はこのサンプルの上に完全な緩和策を構築し、CSRF チェックを有効とみなす前に認証と認可を実装すべきです。

## JavaScript: Automatically Including CSRF Tokens as an AJAX Request Header

JavaScript のガイダンスでは、既定で **GET**、**HEAD**、**OPTIONS** を安全な操作とみなします。そのため、これらの AJAX 呼び出しには通常 CSRF トークンヘッダーを追加する必要はありません。ただし、これらのメソッドで状態変更操作を行う場合は、悪い設計であり避けるべきですが、CSRF トークンヘッダーが必要です。

**POST**、**PUT**、**PATCH**、**DELETE** は状態変更メソッドであり、リクエストに CSRF トークンを付与すべきです。公式ページでは、JavaScript ライブラリの既定動作を上書きし、状態変更メソッドの AJAX リクエストへ自動的に CSRF トークンを含める方法を示しています。

### Storing the CSRF Token Value in the DOM

CSRF トークンは次のように `<meta>` タグへ含めることができます。以後のページ内呼び出しは、この `<meta>` タグから CSRF トークンを抽出できます。JavaScript 変数や DOM 上の任意の場所に保存することもできますが、Cookie やブラウザ local storage に保存することは推奨されません。

```html
<meta name="csrf-token" content="{{ csrf_token() }}">
```

### Overriding Defaults to Set Custom Header

複数の JavaScript ライブラリでは、既定設定を上書きしてすべての AJAX リクエストへヘッダーを自動追加できます。

#### XMLHttpRequest (Native JavaScript)

`XMLHttpRequest` の `open()` メソッドを上書きし、次に `open()` が呼び出されるたびに `X-CSRF-Token` ヘッダーを設定できます。`csrfSafeMethod()` は safe HTTP method を除外し、unsafe method のみにヘッダーを追加します。

#### CSRF Prevention in modern Frameworks

Angular、React、Vue などのモダン SPA フレームワークでは、Cookie-to-header pattern によって CSRF を緩和するのが一般的です。サーバーは CSRF トークンを JavaScript から読める Cookie に設定し、クライアントはそれを読み取って状態変更リクエストのカスタムヘッダーに付与します。サーバーはヘッダー値と Cookie 値を比較し、一致すれば受け入れ、一致しなければ偽造の可能性があるとして拒否します。

#### Angular

Angular の HttpClient は、XSRF 攻撃を防ぐための Cookie-to-Header Pattern をサポートします。インターセプターが既定で `XSRF-TOKEN` Cookie からトークンを読み取り、`X-XSRF-TOKEN` HTTP ヘッダーとして設定します。公式ページのコード例は Angular 19.2.11 でテストされています。

#### React

React アプリケーションでは、axios interceptors を使用して Cookie-to-header pattern を実装できます。Cookie から `XSRF-TOKEN` を読み取り、状態変更メソッドのリクエストに `X-CSRF-Token` ヘッダーとして追加します。

#### Axios

Axios では、POST、PUT、DELETE、PATCH アクションの既定ヘッダーを設定できます。さらに interceptors を使うと、状態変更メソッドに対して一括で CSRF トークンヘッダーを追加できます。公式ページのコード例は Axios 1.9.0 でテストされています。

#### jQuery

jQuery は `$.ajaxSetup()` API を公開しており、AJAX リクエストに `X-CSRF-Token` ヘッダーを追加するために使用できます。safe method を除外し、unsafe method かつ crossDomain ではない場合にヘッダーを設定します。公式ページのコード例は jQuery 3.7.1 でテストされています。

### TypeScript Utilities for CSRF Protection

TypeScript では、CSRF 保護のための型付きユーティリティを作成できます。公式ページでは、Cookie 名、ヘッダー名、保護対象 HTTP メソッドを設定として持つ `CSRFProtection` クラスを示し、Cookie からトークンを抽出し、必要な場合にヘッダーへ追加する構造を紹介しています。

#### Angular with TypeScript

Angular は TypeScript で構築されているため、型付き CSRF 保護と自然に組み合わせられます。公式ページでは、`provideHttpClient(withXsrfConfiguration(...))` による設定と、safe method をスキップしてその他のリクエストへ `X-CSRF-Token` を追加するカスタム `HttpInterceptor` の例を示しています。

#### React with TypeScript

React では、axios 用の `createCSRFProtectedAxios` や fetch API をラップする `CSRFProtectedFetch` クラスのように、Cookie から CSRF トークンを読み取り、非 GET/HEAD/OPTIONS リクエストにヘッダーとして追加する型付きユーティリティを作れます。

## References in Related Cheat Sheets

関連資料として、OWASP Cross-Site Request Forgery、PortSwigger Web Security Academy、Mozilla Web Security Cheat Sheet、Common CSRF Prevention Misconceptions、Robust Defenses for Cross-Site Request Forgery、OWASP CSRFGuard、Spring Security、CSRFProtector、Angular の XSRF/CSRF security ドキュメントなどが挙げられています。

  </section>

  <section id="csrf-prevention-summary-panel" className="tabPanel summaryPanel contentPanel">

<ul>
  <li>XSS はすべての CSRF 緩和策を破れる可能性があるため、XSS 対策と CSRF 対策を同時に行います。</li>
  <li>まずフレームワークの組み込み CSRF 保護を使い、ない場合は状態変更リクエストへトークンを追加します。</li>
  <li>ステートフルなアプリケーションでは Synchronizer Token Pattern、ステートレスなアプリケーションでは Signed Double-Submit Cookie を優先します。</li>
  <li>Naive Double-Submit Cookie は Cookie injection で迂回され得るため、新規コードでは避けます。</li>
  <li>Fetch Metadata、SameSite、Origin/Referer 検証、Host Prefix Cookie、ユーザー確認を多層防御として組み合わせます。</li>
  <li>API や SPA では、カスタムヘッダーと Cookie-to-header pattern を使います。</li>
  <li>GET で状態変更しない設計にします。</li>
</ul>

  </section>

  <section id="csrf-prevention-checklist-panel" className="tabPanel checklistPanel contentPanel">

<ul className="checklistView">
  <li><input type="checkbox" disabled />利用フレームワークの組み込み CSRF 保護を確認し、有効化する。</li>
  <li><input type="checkbox" disabled />POST/PUT/PATCH/DELETE などの状態変更リクエストに CSRF 対策を適用する。</li>
  <li><input type="checkbox" disabled />状態変更操作を GET で実装しない。</li>
  <li><input type="checkbox" disabled />Synchronizer Token または Signed Double-Submit Cookie を選択し、トークンをセッションに紐付ける。</li>
  <li><input type="checkbox" disabled />CSRF トークンをログ、URL、Referer に漏らさない。</li>
  <li><input type="checkbox" disabled />トークン比較に定数時間比較を使用する。</li>
  <li><input type="checkbox" disabled />SameSite Cookie 属性を用途に応じて設定する。</li>
  <li><input type="checkbox" disabled />Origin/Referer または Fetch Metadata による補助検証を実装する。</li>
  <li><input type="checkbox" disabled />CORS で任意 Origin や任意ヘッダーを不用意に許可しない。</li>
  <li><input type="checkbox" disabled />SPA/API ではカスタムヘッダーまたは Cookie-to-header pattern をテストする。</li>
  <li><input type="checkbox" disabled />重要操作では再認証や追加確認を要求する。</li>
  <li><input type="checkbox" disabled />ログイン CSRF と認証前セッションの扱いをレビューする。</li>
</ul>

  </section>

  <section id="csrf-prevention-bilingual-panel" className="tabPanel bilingualPanel">

<div className="noticeBox">
  翻訳タブでは公式ページの全見出し順で本文を再構成しています。対比表示では、主要な判断ポイントを原文と翻訳で確認できるカードとして掲載しています。
</div>

## Introduction

<div className="bilingualPair">
  <div className="bilingualBlock english">
    <span className="bilingualLabel english">English (原文)</span>
    <p>A Cross-Site Request Forgery (CSRF) attack occurs when a malicious web site, email, blog, instant message, or program tricks an authenticated user's web browser into performing an unwanted action on a trusted site.</p>
  </div>
  <div className="bilingualBlock japanese">
    <span className="bilingualLabel japanese">日本語 (翻訳)</span>
    <p>Cross-Site Request Forgery (CSRF) 攻撃は、悪意ある Web サイト、メール、ブログ、インスタントメッセージ、またはプログラムが、認証済みユーザーの Web ブラウザをだまして、信頼されたサイト上で望まない操作を実行させるときに発生します。</p>
  </div>
</div>

<div className="bilingualPair">
  <div className="bilingualBlock english">
    <span className="bilingualLabel english">English (原文)</span>
    <p>Remember that Cross-Site Scripting (XSS) can defeat all CSRF mitigation techniques.</p>
  </div>
  <div className="bilingualBlock japanese">
    <span className="bilingualLabel japanese">日本語 (翻訳)</span>
    <p>Cross-Site Scripting (XSS) は、すべての CSRF 緩和策を破れる可能性があることを忘れてはいけません。</p>
  </div>
</div>

## Token-Based Mitigation

<div className="bilingualPair">
  <div className="bilingualBlock english">
    <span className="bilingualLabel english">English (原文)</span>
    <p>The synchronizer token pattern is one of the most popular and recommended methods to mitigate CSRF.</p>
  </div>
  <div className="bilingualBlock japanese">
    <span className="bilingualLabel japanese">日本語 (翻訳)</span>
    <p>Synchronizer Token Pattern は、CSRF を緩和する最も一般的で推奨される方法の一つです。</p>
  </div>
</div>

<div className="bilingualPair">
  <div className="bilingualBlock english">
    <span className="bilingualLabel english">English (原文)</span>
    <p>The most secure implementation of the Double Submit Cookie pattern is the Signed Double-Submit Cookie, which explicitly ties tokens to the user's authenticated session.</p>
  </div>
  <div className="bilingualBlock japanese">
    <span className="bilingualLabel japanese">日本語 (翻訳)</span>
    <p>Double Submit Cookie Pattern の最も安全な実装は Signed Double-Submit Cookie であり、トークンをユーザーの認証済みセッションへ明示的に結び付けます。</p>
  </div>
</div>

## Fetch Metadata and Defense in Depth

<div className="bilingualPair">
  <div className="bilingualBlock english">
    <span className="bilingualLabel english">English (原文)</span>
    <p>Fetch Metadata request headers provide extra information about the context from which an HTTP request was made. Servers can use these headers, most importantly Sec-Fetch-Site, to block obvious cross-site requests.</p>
  </div>
  <div className="bilingualBlock japanese">
    <span className="bilingualLabel japanese">日本語 (翻訳)</span>
    <p>Fetch Metadata request headers は、HTTP リクエストがどの文脈から行われたかに関する追加情報を提供します。サーバーは、特に Sec-Fetch-Site を使って、明らかなクロスサイトリクエストをブロックできます。</p>
  </div>
</div>

<div className="bilingualPair">
  <div className="bilingualBlock english">
    <span className="bilingualLabel english">English (原文)</span>
    <p>SameSite, standard Origin headers, host-prefixed cookies, and user interaction based defenses can be used as defense in depth techniques.</p>
  </div>
  <div className="bilingualBlock japanese">
    <span className="bilingualLabel japanese">日本語 (翻訳)</span>
    <p>SameSite、標準 Origin ヘッダー、Host Prefix Cookie、ユーザー操作ベースの防御は、多層防御として使用できます。</p>
  </div>
</div>

  </section>
</div>

## Attribution

<div className="attributionFooter">

- Original: Cross-Site Request Forgery Prevention Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: English original retained for comparison. Japanese translation added.
- Retrieved: 2026-05-20

</div>
