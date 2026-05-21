---
title: Transaction Authorization Cheat Sheet
hide_title: true
---

<div className="docHero" data-category="asvs-v15">
  <h1>トランザクション認可チートシート</h1>
  <div className="docMeta">
    <span className="docPill">最終更新: 2026-05-21</span>
    <span className="docPill">読了時間: 約 10 分</span>
    <span className="docPill">カテゴリ: 認可</span>
  </div>
</div>

<div className="tabbedContent">
  <input className="tabInput" type="radio" name="transaction-authorization-view" id="transaction-authorization-original" />
  <input className="tabInput" type="radio" name="transaction-authorization-view" id="transaction-authorization-translation" defaultChecked />
  <input className="tabInput" type="radio" name="transaction-authorization-view" id="transaction-authorization-bilingual" />

  <div className="contentTabs">
    <label htmlFor="transaction-authorization-original" title="OWASP 原文">原文</label>
    <label htmlFor="transaction-authorization-translation" title="日本語訳">翻訳</label>
    <label htmlFor="transaction-authorization-bilingual" title="原文と翻訳を並べて確認">対比表示</label>
  </div>

<section id="transaction-authorization-original-panel" className="tabPanel originalPanel contentPanel">

## Purpose and audience

This cheat sheet discusses how developers can secure transaction authorizations and prevent them from being bypassed. These guidelines are for:

- **Banks** - who must create functional and non-functional requirements for transaction authorization.
- **Developers** – who need to eliminate vulnerabilities in transaction authorizations.
- **Pentesters** – who must determine if transaction authorizations are secure.

## Introduction

Generally, mobile and online applications will require users to submit a second factor so the system can check whether they are authorized to perform a sensitive operation (such as wire transfer authorization). In this document, we say that these actions are *transaction authorizations*.

Transaction authorizations are often used in financial systems, but the need for secure transactions has driven the adoption of authorizations across the internet. For example, an email that allows users to unlock a user account by providing them with a secret code or a link that has a token contains a transaction authorization. A transaction authorization can be implemented with methods such as:

- A card that has a transaction authorization number
- A time-based one-time password (OTP) token, such as an [OATH TOTP (Time-based One-Time Password)](https://en.wikipedia.org/wiki/Time-based_One-time_Password_Algorithm)
- A OTP sent by SMS or provided by phone
- A digital signature provided by a smart card or a smartphone
- A challenge-response token, including unconnected card readers or solutions which scan transaction data from the user's computer screen

Some of these forms of transaction authorizations can be implemented with a physical device or in a mobile application.

## 1. Functional Guidelines

### 1.1 Transaction authorization method has to allow a user to identify and acknowledge significant transaction data

Since developers cannot assume that a user's computer is secure, an external authorization component would be have to check data for a typical transaction.

When the developer builds components for transaction authorizations, they should use the *What You See Is What You Sign* principle. An authorization method must permit a user to identify and acknowledge the data that is significant to a given transaction. For example, in the case of a wire transfer, the user should be able to identify the target account and amount.

As developers determine what transaction data is significant, their decisions should be based on:

- The real risk
- The technical capabilities and constraints of the chosen authorization method
- The users having a positive experience

For example, if an SMS message confirms significant transaction data, the developer could respond by returning the target account, amount and type of transfer to the user. However, it is inconvenient for an unconnected [CAP reader](https://en.wikipedia.org/wiki/Chip_Authentication_Program) to require users to enter that data. In such cases, the developer should probably return the minimum amount of significant transaction data (e.g. partial target account number and amount) for confirmation.

In general, the user must verify all significant transaction data as a part of the transaction authorization process. If a transaction process requires a user to enter transaction data into an external device, the user should be prompted to confirm a specific value in the transaction (e.g. a target account number). The absence of a meaningful prompt could be easily abused by social engineering techniques and malware as described below in Section 1.4. Also, for more detailed discussion of input overloading problems, see [here](http://www.cl.cam.ac.uk/~sjm217/papers/fc09optimised.pdf).

### 1.2 Change of authorization token should be authorized using the current authorization token

If a user can use the application interface to change the authorization token, they should be able to authorize the operation with their current authorization credentials (as is the case with [password change procedure](https://owasp.org/www-project-web-security-testing-guide/stable/4-Web_Application_Security_Testing/04-Authentication_Testing/09-Testing_for_Weak_Password_Change_or_Reset_Functionalities.html)). For example: when a user changes a phone number for SMS codes an authorization SMS code should be sent to the current phone number.

### 1.3 Change of authorization method should be authorized using the current authorization method

Some applications allow a user to chose how their transactions will be authorized. In such cases, the developer should make sure that the application can confirm the user's method of authorization to prevent any malware from changing the user's authorization method to the most vulnerable method. Additionally, the application should inform the user about any potential dangers associated with their authorization method.

### 1.4 Users should be able to easily distinguish the authentication process from the transaction authorization process

Since developers need to prevent users from authorizing fraudulent operations, their applications should not require a user to perform the same actions for authentication and transaction authorization. Consider the following example:

1. An application is using the same method for user authentication and for transaction authorization (i.e. with an OTP token).
2. Malware could use a man-in-the-middle attack to present a user with a false error message when they submit credentials to the application, which could trick the user into repeating the authentication procedure. The first credential will be used by the malware for authentication and the second credential would be used to authorize a fraudulent transaction. Even challenge-response schemes could be abused using this scenario, since malware can present a challenge taken from a fraudulent transaction and trick the user to provide a response. Such an attack scenario is used widely in [malware attacks against electronic banking](http://securityintelligence.com/back-basics-malware-authors-downgrade-tactics-stay-radar/#.VX_qI_krLDc).

To stop such attacks, developers can make sure that authentication actions are different than transaction authorizations by:

- Using different methods to authenticate and to authorize
- Employing different actions in an external security component (i.e using a different mode of operation in a CAP reader)
- Presenting the user with a clear message about what they are "signing" (What You See Is What You Sign Principle)

Social engineering methods [can be used despite authentication and operation authorization methods](http://securityintelligence.com/tatanga-attack-exposes-chiptan-weaknesses/#.VZAy9PkrLDc) but the application shouldn't make it easier for such attack scenarios.

### 1.5 Each transaction should be authorized using unique authorization credentials

If applications only ask for transaction authorization credentials once (such as a static password, code sent through SMS, or a token response), the user could authorize any transaction during the entire session or reuse the same credentials when they need to authorize a transaction. In this scenario, attackers can employ malware to sniff credentials and use them to authorize any transaction without the user's knowledge.

## 2. Non-functional guidelines

### 2.1 Authorization should be performed and enforced server-side

Like [all other security controls](https://cwe.mitre.org/data/definitions/602.html), transaction authorizations should be enforced on the server side. It should **never** be possible to influence an authorization's result by altering the data that flows from a client to a server by:

- Tampering with parameters that contain transaction data
- Adding/removing parameters which will disable authorization check
- Causing an error

To ensure that data is only managed on the server side, security programming best practices should be applied, such as:

- [Default deny](https://wiki.owasp.org/index.php/Positive_security_model)
- Avoiding debugging functionality in production code

Other safeguards should be considered to prevent tampering, such as encrypting the data for confidentiality and integrity, then decrypting and verifying the data on the server side.

### 2.2 Authorization method should be enforced server-side

If multiple transaction authorization methods are made available to the user, the server side must make sure that the transaction occurs with the user's chosen authorization method or the authorization method enforced by application policies. Otherwise, malware could downgrade an authorization method to even the least secure authorization method. Developers must make it impossible for attackers to change a chosen authorization method by manipulating the parameters provided from the client.

Developers should be especially careful if they are asked to add a new authorization method that enhances security. Unfortunately, developers often decide to build a new authorization method on top of an old codebase. This case is insecure and an attacker could manipulate a client to successfully authorize a transaction by sending parameters using the old method, despite the fact that the application has already switched to a new method.

### 2.3 Transaction verification data should be generated server-side

If developers decide to transmit significant transaction data programmatically to an authorization component, they should take extra care to prevent any client modifications to the transaction data at authorization. **All significant transaction data must be verified by the user, generated and stored on a server, then passed to an authorization component without any possibility of tampering by the client.**

And when developers collect significant transaction data on the client side and pass it on to the server, malware could manipulate the data and show faked transaction data in an authorization component.

### 2.4 Application should prevent authorization credentials brute-forcing

**Developers must make sure that their application can't allow attackers to brute-force a transaction at the point where transaction authorization credentials are submitted to the server for verification. After a set number of failed authorization attempts, the entire transaction authorization process should be restarted.** Also, there are other methods to prevent brute-forcing and stop other automation-related techniques, see [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#prevent-brute-force-attacks).

### 2.5 Application should control which transaction state transitions are allowed

Transaction authorization is usually performed in multiple steps, e.g.:

1. The user enters the transaction data.
2. The user requests authorization from the application.
3. The application initializes an authorization mechanism.
4. The user verifies/confirms the transaction data.
5. The user responds with the authorization credentials.
6. The application validates authorization and executes a transaction.

The developers must ensure that the business logic flow for a transaction authorization occurs in in sequential order so users (or attackers) cannot perform the steps out of order or even skip any of the steps. This should protect against attack techniques such as:

- Overwriting transaction data before user will enter the authorization credentials
- Skipping transaction authorization

See [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/) requirement **15.1**).

### 2.6 Transaction data should be protected against modification

Developers must not allow attackers to modify transaction data when the user enters the data for the first time. Poor implementations may allow malware to:

1. Replay the first step in Section 2.5 (sending transaction data) in the background before the user enters authorization credentials and then overwrite transaction details with a fraudulent transaction.
2. Create and add new transaction data parameters to a HTTP request that is authorizing the transaction. In such a case, a transaction authorization process that is poorly implemented might authorize the initial transaction and then execute a fraudulent transaction (specific example of [Time of Check to Time of Use vulnerability](https://cwe.mitre.org/data/definitions/367.html)).

There are multiple methods that can prevent transaction data from being modified during authorization:

1. If transaction data is modified, the code could invalidate any previously entered authorization data (e.g. Generated OTP) and the challenge.
2. Modifications to transaction data could trigger a reset of the authorization process.
3. Any attempt to modify transaction data after user entry is an attack on the system and it should be logged, monitored, and carefully investigated.

### 2.7 Confidentiality of transaction data should be protected during all client-server communications

The transaction authorization process should protect the privacy of transaction data that the user will be authorizing (i.e. at Section 2.5, steps 2 and 4).

### 2.8 System should check each transaction execution and make sure it has been properly authorized

The final result of the transaction entry and authorization process (as described in Section 2.5) is also called the *transaction execution*. There should be a final control gate before transaction execution which verifies whether the transaction was properly authorized by the user. This control should be tied to execution and prevent attacks such as:

- Time of Check to Time of Use (TOCTOU) - example in Section 2.6
- Skipping authorization check in the transaction entry process (see. Section 2.5)

### 2.9 Authorization credentials should only be valid during a limited time period

In some attacks, a user's authorization credentials are passed by malware to a command-and-control server and then are used from an attacker-controlled machine. Often, this process is often performed manually by an attacker. To make sure that these are attacks are difficult, the server should only allow transaction authorization to occur in a limited time window which should occur between the generation of a challenge (or OTP) and the completion of an authorization. Additionally, such safeguards will also help stop resource exhaustion attacks. This time period should be carefully selected so it will not disrupt normal user behavior.

### 2.10 Authorization credentials should be unique for every operation

To prevent multiple replay attacks, each set of authorization credentials should be unique for every operation. These credentials can be generated with different methods depending on the mechanism. For example: developers can use a timestamp, a sequence number, or a random value in signed transaction data or as a part of a challenge.

## Remarks

Here are some other issues that should be considered while implementing transaction authorizations, but are beyond the scope of this cheat sheet:

- Which transactions should be authorized? All transactions or only some of them? Each application is different and an application owner should decide if all transactions should be authorized or only some of them. The developers should consider risk analysis, risk exposition of given application, and other safeguards implemented in an application.
- **We recommend the use of cryptographic operations to protect transactions and to ensure integrity, confidentiality and non-repudiation.**
- **It is critically important to provision & protect the device signing keys during device "pairing" is as is the actual signing protocol itself. Malware may attempt to inject/replace or steal the signing keys.**
- User awareness: For example in transaction authorization methods, when a user types in significant transaction data to an authorization component (e.g. an external dedicated device or a mobile application), users should be trained to rewrite transaction data from a trusted source and not from a computer screen.
- **There are some anti-malware solutions that protect against such threats but these solutions [cannot be 100% effective](http://www.securing.pl/en/script-based-malware-detection-in-online-banking-security-overview/index.html) and should be used only as an additional layer of protection.**
- Protecting your signing keys with a second factor such as passwords, biometrics, etc. or leveraging secure elements (TEE, TPM, Smart card).

</section>

<section id="transaction-authorization-translation-panel" className="tabPanel translationPanel contentPanel">

## 目的と対象読者

このチートシートでは、開発者がトランザクション認可を保護し、迂回されないようにする方法について説明します。このガイドラインの対象は以下です。

- **銀行** - トランザクション認可に関する機能要件および非機能要件を作成しなければならない組織。
- **開発者** - トランザクション認可の脆弱性を排除する必要がある人。
- **ペネトレーションテスター** - トランザクション認可が安全であるかを判断しなければならない人。

## はじめに

一般に、モバイルアプリケーションやオンラインアプリケーションでは、システムが利用者に機微な操作 (送金の承認など) を実行する権限があるかを確認できるよう、利用者に第二要素の提示を求めます。この文書では、このような行為を *トランザクション認可* と呼びます。

トランザクション認可は金融システムでよく使われますが、安全なトランザクションの必要性により、インターネット全体で認可の採用が進んでいます。たとえば、秘密コードやトークン付きリンクを提供してユーザーアカウントを解除できるようにするメールには、トランザクション認可が含まれます。トランザクション認可は、次のような方式で実装できます。

- トランザクション認可番号を持つカード
- [OATH TOTP (Time-based One-Time Password)](https://en.wikipedia.org/wiki/Time-based_One-time_Password_Algorithm) などの時間ベースのワンタイムパスワード (OTP) トークン
- SMS で送信される、または電話で提供される OTP
- スマートカードやスマートフォンによって提供されるデジタル署名
- 非接続型カードリーダーや、利用者のコンピューター画面からトランザクションデータをスキャンするソリューションを含むチャレンジレスポンストークン

これらのトランザクション認可の一部は、物理デバイスまたはモバイルアプリケーションで実装できます。

## 1. 機能ガイドライン

### 1.1 トランザクション認可方式は、利用者が重要なトランザクションデータを識別し、承認できるようにしなければならない

開発者は利用者のコンピューターが安全であると仮定できないため、一般的なトランザクションでは外部の認可コンポーネントがデータを確認する必要があります。

開発者がトランザクション認可のコンポーネントを構築する際には、*What You See Is What You Sign* の原則を使用すべきです。認可方式は、利用者が対象トランザクションにとって重要なデータを識別し、承認できるようにしなければなりません。たとえば送金の場合、利用者は送金先口座と金額を識別できるべきです。

開発者がどのトランザクションデータを重要とするかを決める際には、その判断を以下に基づけるべきです。

- 実際のリスク
- 選択した認可方式の技術的能力と制約
- 利用者にとって良好な体験

たとえば、SMS メッセージで重要なトランザクションデータを確認する場合、開発者は送金先口座、金額、送金種別を利用者に返すことができます。しかし、非接続型の [CAP reader](https://en.wikipedia.org/wiki/Chip_Authentication_Program) で利用者にそのデータを入力させるのは不便です。このような場合、開発者は確認のために最小限の重要なトランザクションデータ (例: 送金先口座番号の一部と金額) を返すのがよいでしょう。

一般に、利用者はトランザクション認可プロセスの一部として、すべての重要なトランザクションデータを検証しなければなりません。トランザクションプロセスで利用者が外部デバイスにトランザクションデータを入力する必要がある場合、利用者にはトランザクション内の特定の値 (例: 送金先口座番号) を確認するよう促すべきです。意味のあるプロンプトがない場合、セクション 1.4 で後述するように、ソーシャルエンジニアリング手法やマルウェアによって容易に悪用される可能性があります。入力オーバーロード問題のより詳しい議論については、[こちら](http://www.cl.cam.ac.uk/~sjm217/papers/fc09optimised.pdf) も参照してください。

### 1.2 認可トークンの変更は、現在の認可トークンを使って承認すべきである

利用者がアプリケーションインターフェースを使用して認可トークンを変更できる場合、その操作は現在の認可資格情報で承認できるようにすべきです ([password change procedure](https://owasp.org/www-project-web-security-testing-guide/stable/4-Web_Application_Security_Testing/04-Authentication_Testing/09-Testing_for_Weak_Password_Change_or_Reset_Functionalities.html) の場合と同様です)。例: 利用者が SMS コード用の電話番号を変更する場合、認可用 SMS コードは現在の電話番号に送信すべきです。

### 1.3 認可方式の変更は、現在の認可方式を使って承認すべきである

一部のアプリケーションでは、利用者がトランザクションの認可方式を選択できます。このような場合、開発者は、マルウェアが利用者の認可方式を最も脆弱な方式に変更することを防ぐため、アプリケーションが利用者の認可方式を確認できるようにすべきです。さらに、アプリケーションは利用者の認可方式に関連する潜在的な危険について利用者に通知すべきです。

### 1.4 利用者は認証プロセスとトランザクション認可プロセスを容易に区別できるべきである

開発者は利用者が不正な操作を承認することを防ぐ必要があるため、アプリケーションは認証とトランザクション認可で同じ操作を利用者に要求すべきではありません。次の例を考えてください。

1. アプリケーションが、ユーザー認証とトランザクション認可に同じ方式を使用している (つまり OTP トークンを使用している)。
2. マルウェアは中間者攻撃を使用し、利用者がアプリケーションに資格情報を送信したときに偽のエラーメッセージを表示できます。これにより、利用者に認証手順を繰り返させることができます。最初の資格情報はマルウェアによる認証に使用され、二つ目の資格情報は不正なトランザクションの承認に使用されます。チャレンジレスポンス方式であっても、このシナリオで悪用される可能性があります。マルウェアは不正なトランザクションから取得したチャレンジを提示し、利用者をだましてレスポンスを提供させることができるためです。このような攻撃シナリオは、[電子バンキングに対するマルウェア攻撃](http://securityintelligence.com/back-basics-malware-authors-downgrade-tactics-stay-radar/#.VX_qI_krLDc) で広く使用されています。

このような攻撃を止めるため、開発者は次の方法で認証操作とトランザクション認可を異なるものにできます。

- 認証と認可に異なる方式を使用する
- 外部セキュリティコンポーネントで異なる操作を使用する (つまり CAP reader で異なる動作モードを使用する)
- 利用者が何に「署名」しているのかについて明確なメッセージを提示する (What You See Is What You Sign 原則)

ソーシャルエンジニアリング手法は、[認証方式や操作認可方式があっても使用される可能性があります](http://securityintelligence.com/tatanga-attack-exposes-chiptan-weaknesses/#.VZAy9PkrLDc)。しかし、アプリケーションがそのような攻撃シナリオを容易にすべきではありません。

### 1.5 各トランザクションは一意の認可資格情報を使って承認すべきである

アプリケーションがトランザクション認可資格情報 (静的パスワード、SMS で送信されるコード、トークンレスポンスなど) を一度しか求めない場合、利用者はセッション全体で任意のトランザクションを承認できたり、トランザクションを承認する必要があるたびに同じ資格情報を再利用できたりします。このシナリオでは、攻撃者はマルウェアを用いて資格情報を盗聴し、利用者に知られずに任意のトランザクションを承認するために使用できます。

## 2. 非機能ガイドライン

### 2.1 認可はサーバー側で実施し、強制すべきである

[他のすべてのセキュリティコントロール](https://cwe.mitre.org/data/definitions/602.html) と同様に、トランザクション認可はサーバー側で強制すべきです。クライアントからサーバーへ流れるデータを次のように変更することで、認可結果に影響を与えられては **絶対に** なりません。

- トランザクションデータを含むパラメータを改ざんする
- 認可チェックを無効化するパラメータを追加または削除する
- エラーを発生させる

データがサーバー側でのみ管理されることを確実にするため、次のようなセキュアプログラミングのベストプラクティスを適用すべきです。

- [Default deny](https://wiki.owasp.org/index.php/Positive_security_model)
- 本番コードでデバッグ機能を避ける

改ざんを防ぐため、機密性と完全性のためにデータを暗号化し、サーバー側で復号および検証するなど、その他の保護策も検討すべきです。

### 2.2 認可方式はサーバー側で強制すべきである

複数のトランザクション認可方式を利用者に提供する場合、サーバー側は、利用者が選択した認可方式、またはアプリケーションポリシーによって強制される認可方式でトランザクションが行われることを必須で確認しなければなりません。そうしなければ、マルウェアが認可方式を最も安全性の低い方式にまでダウングレードする可能性があります。開発者は、クライアントから提供されるパラメータを操作して選択済みの認可方式を攻撃者が変更することを不可能にしなければなりません。

開発者は、セキュリティを強化する新しい認可方式を追加するよう依頼された場合、特に注意すべきです。残念ながら、開発者は古いコードベースの上に新しい認可方式を構築することを選びがちです。このケースは安全ではありません。アプリケーションがすでに新しい方式に切り替わっているにもかかわらず、攻撃者がクライアントを操作し、古い方式のパラメータを送信することでトランザクションの認可に成功できる可能性があります。

### 2.3 トランザクション検証データはサーバー側で生成すべきである

開発者が重要なトランザクションデータをプログラム的に認可コンポーネントへ送信することを決めた場合、認可時にクライアントがトランザクションデータを変更できないよう、特別な注意を払うべきです。**すべての重要なトランザクションデータは、利用者によって検証され、サーバー上で生成および保存され、その後クライアントによる改ざんの可能性がない状態で認可コンポーネントへ渡されなければなりません。**

また、開発者がクライアント側で重要なトランザクションデータを収集してサーバーへ渡す場合、マルウェアがそのデータを操作し、認可コンポーネント内に偽のトランザクションデータを表示する可能性があります。

### 2.4 アプリケーションは認可資格情報のブルートフォースを防ぐべきである

**開発者は、トランザクション認可資格情報が検証のためにサーバーへ送信される箇所で、攻撃者がトランザクションをブルートフォースできないようにアプリケーションを作る必要があります。一定回数の認可失敗後には、トランザクション認可プロセス全体を再開始すべきです。** ブルートフォースを防ぎ、その他の自動化関連技術を止める方法はほかにもあります。[OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#prevent-brute-force-attacks) を参照してください。

### 2.5 アプリケーションは許可されるトランザクション状態遷移を制御すべきである

トランザクション認可は通常、たとえば次のように複数のステップで実行されます。

1. 利用者がトランザクションデータを入力する。
2. 利用者がアプリケーションに認可を要求する。
3. アプリケーションが認可メカニズムを初期化する。
4. 利用者がトランザクションデータを検証または確認する。
5. 利用者が認可資格情報で応答する。
6. アプリケーションが認可を検証し、トランザクションを実行する。

**開発者は、利用者 (または攻撃者) がステップを順不同で実行したり、いずれかのステップをスキップしたりできないよう、トランザクション認可のビジネスロジックフローが順序どおりに行われることを必須で保証しなければなりません。これは次のような攻撃手法から保護するはずです。**

- 利用者が認可資格情報を入力する前にトランザクションデータを上書きする
- トランザクション認可をスキップする

[OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/) 要件 **15.1** を参照してください。

### 2.6 トランザクションデータは変更から保護すべきである

開発者は、利用者が最初にデータを入力した時点で、攻撃者がトランザクションデータを変更できるようにしてはなりません。実装が不十分な場合、マルウェアは次のことを行える可能性があります。

1. セクション 2.5 の最初のステップ (トランザクションデータの送信) を、利用者が認可資格情報を入力する前にバックグラウンドで再実行し、トランザクション詳細を不正なトランザクションで上書きする。
2. トランザクションを認可する HTTP リクエストに、新しいトランザクションデータパラメータを作成して追加する。このような場合、実装が不十分なトランザクション認可プロセスは、最初のトランザクションを認可し、その後不正なトランザクションを実行する可能性があります ([Time of Check to Time of Use vulnerability](https://cwe.mitre.org/data/definitions/367.html) の具体例)。

認可中にトランザクションデータが変更されることを防ぐ方法は複数あります。

1. トランザクションデータが変更された場合、コードは以前に入力された認可データ (例: 生成済み OTP) とチャレンジを無効化できます。
2. トランザクションデータの変更により、認可プロセスをリセットできます。
3. 利用者による入力後にトランザクションデータを変更しようとする試みはすべてシステムへの攻撃であり、ログに記録し、監視し、慎重に調査すべきです。

### 2.7 トランザクションデータの機密性は、すべてのクライアントサーバー通信で保護すべきである

トランザクション認可プロセスは、利用者が承認しようとしているトランザクションデータのプライバシーを保護すべきです (つまりセクション 2.5 のステップ 2 および 4)。

### 2.8 システムは各トランザクション実行をチェックし、適切に承認されていることを確認すべきである

トランザクション入力および認可プロセス (セクション 2.5 で説明) の最終結果は、*トランザクション実行* とも呼ばれます。トランザクション実行前には、トランザクションが利用者によって適切に承認されたかを検証する最終制御ゲートがあるべきです。この制御は実行に結び付けられ、次のような攻撃を防ぐべきです。

- Time of Check to Time of Use (TOCTOU) - セクション 2.6 の例
- トランザクション入力プロセスにおける認可チェックのスキップ (セクション 2.5 を参照)

### 2.9 認可資格情報は限られた期間だけ有効にすべきである

一部の攻撃では、利用者の認可資格情報がマルウェアによってコマンドアンドコントロールサーバーへ渡され、その後、攻撃者が制御するマシンから使用されます。多くの場合、このプロセスは攻撃者によって手作業で実行されます。このような攻撃を困難にするため、サーバーは、チャレンジ (または OTP) の生成から認可の完了までの間に発生する限定された時間窓内でのみ、トランザクション認可を許可すべきです。さらに、このような保護策はリソース枯渇攻撃の阻止にも役立ちます。この期間は、通常の利用者行動を妨げないよう慎重に選択すべきです。

### 2.10 認可資格情報は操作ごとに一意であるべきである

複数のリプレイ攻撃を防ぐため、認可資格情報の各セットは操作ごとに一意であるべきです。これらの資格情報は、メカニズムに応じて異なる方法で生成できます。例: 開発者は、署名済みトランザクションデータ内、またはチャレンジの一部として、タイムスタンプ、シーケンス番号、ランダム値を使用できます。

## 備考

以下は、トランザクション認可を実装する際に検討すべきその他の事項ですが、このチートシートの範囲外です。

- どのトランザクションを承認すべきか。すべてのトランザクションか、それとも一部のみか。アプリケーションはそれぞれ異なり、すべてのトランザクションを承認すべきか、一部のみ承認すべきかはアプリケーション所有者が決定すべきです。開発者は、リスク分析、対象アプリケーションのリスク露出、アプリケーションに実装されているその他の保護策を考慮すべきです。
- **トランザクションを保護し、完全性、機密性、否認防止を確保するため、暗号操作の使用を推奨します。**
- **デバイスの「ペアリング」中にデバイス署名鍵をプロビジョニングし保護することは、実際の署名プロトコル自体と同じくらい極めて重要です。マルウェアは署名鍵の注入、置換、または窃取を試みる可能性があります。**
- 利用者の意識向上: たとえばトランザクション認可方式で、利用者が重要なトランザクションデータを認可コンポーネント (例: 外部の専用デバイスやモバイルアプリケーション) に入力する場合、利用者にはコンピューター画面ではなく信頼できるソースからトランザクションデータを書き写すよう教育すべきです。
- **このような脅威から保護するマルウェア対策ソリューションもありますが、それらのソリューションは [100% 有効にはなり得ない](http://www.securing.pl/en/script-based-malware-detection-in-online-banking-security-overview/index.html) ため、追加の防御層としてのみ使用すべきです。**
- パスワード、生体認証などの第二要素で署名鍵を保護する、またはセキュアエレメント (TEE、TPM、スマートカード) を活用する。

</section>

<section id="transaction-authorization-bilingual-panel" className="tabPanel bilingualPanel contentPanel">

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Purpose and audience

This cheat sheet discusses how developers can secure transaction authorizations and prevent them from being bypassed. These guidelines are for:

- **Banks** - who must create functional and non-functional requirements for transaction authorization.
- **Developers** – who need to eliminate vulnerabilities in transaction authorizations.
- **Pentesters** – who must determine if transaction authorizations are secure.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語訳</span>

## 目的と対象読者

このチートシートでは、開発者がトランザクション認可を保護し、迂回されないようにする方法について説明します。このガイドラインの対象は以下です。

- **銀行** - トランザクション認可に関する機能要件および非機能要件を作成しなければならない組織。
- **開発者** - トランザクション認可の脆弱性を排除する必要がある人。
- **ペネトレーションテスター** - トランザクション認可が安全であるかを判断しなければならない人。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Introduction

Generally, mobile and online applications will require users to submit a second factor so the system can check whether they are authorized to perform a sensitive operation (such as wire transfer authorization). In this document, we say that these actions are *transaction authorizations*.

Transaction authorizations are often used in financial systems, but the need for secure transactions has driven the adoption of authorizations across the internet. For example, an email that allows users to unlock a user account by providing them with a secret code or a link that has a token contains a transaction authorization. A transaction authorization can be implemented with methods such as:

- A card that has a transaction authorization number
- A time-based one-time password (OTP) token, such as an [OATH TOTP (Time-based One-Time Password)](https://en.wikipedia.org/wiki/Time-based_One-time_Password_Algorithm)
- A OTP sent by SMS or provided by phone
- A digital signature provided by a smart card or a smartphone
- A challenge-response token, including unconnected card readers or solutions which scan transaction data from the user's computer screen

Some of these forms of transaction authorizations can be implemented with a physical device or in a mobile application.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語訳</span>

## はじめに

一般に、モバイルアプリケーションやオンラインアプリケーションでは、システムが利用者に機微な操作 (送金の承認など) を実行する権限があるかを確認できるよう、利用者に第二要素の提示を求めます。この文書では、このような行為を *トランザクション認可* と呼びます。

トランザクション認可は金融システムでよく使われますが、安全なトランザクションの必要性により、インターネット全体で認可の採用が進んでいます。たとえば、秘密コードやトークン付きリンクを提供してユーザーアカウントを解除できるようにするメールには、トランザクション認可が含まれます。トランザクション認可は、次のような方式で実装できます。

- トランザクション認可番号を持つカード
- [OATH TOTP (Time-based One-Time Password)](https://en.wikipedia.org/wiki/Time-based_One-time_Password_Algorithm) などの時間ベースのワンタイムパスワード (OTP) トークン
- SMS で送信される、または電話で提供される OTP
- スマートカードやスマートフォンによって提供されるデジタル署名
- 非接続型カードリーダーや、利用者のコンピューター画面からトランザクションデータをスキャンするソリューションを含むチャレンジレスポンストークン

これらのトランザクション認可の一部は、物理デバイスまたはモバイルアプリケーションで実装できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## 1. Functional Guidelines

### 1.1 Transaction authorization method has to allow a user to identify and acknowledge significant transaction data

Since developers cannot assume that a user's computer is secure, an external authorization component would be have to check data for a typical transaction.

When the developer builds components for transaction authorizations, they should use the *What You See Is What You Sign* principle. An authorization method must permit a user to identify and acknowledge the data that is significant to a given transaction. For example, in the case of a wire transfer, the user should be able to identify the target account and amount.

As developers determine what transaction data is significant, their decisions should be based on:

- The real risk
- The technical capabilities and constraints of the chosen authorization method
- The users having a positive experience

For example, if an SMS message confirms significant transaction data, the developer could respond by returning the target account, amount and type of transfer to the user. However, it is inconvenient for an unconnected [CAP reader](https://en.wikipedia.org/wiki/Chip_Authentication_Program) to require users to enter that data. In such cases, the developer should probably return the minimum amount of significant transaction data (e.g. partial target account number and amount) for confirmation.

In general, the user must verify all significant transaction data as a part of the transaction authorization process. If a transaction process requires a user to enter transaction data into an external device, the user should be prompted to confirm a specific value in the transaction (e.g. a target account number). The absence of a meaningful prompt could be easily abused by social engineering techniques and malware as described below in Section 1.4. Also, for more detailed discussion of input overloading problems, see [here](http://www.cl.cam.ac.uk/~sjm217/papers/fc09optimised.pdf).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語訳</span>

## 1. 機能ガイドライン

### 1.1 トランザクション認可方式は、利用者が重要なトランザクションデータを識別し、承認できるようにしなければならない

開発者は利用者のコンピューターが安全であると仮定できないため、一般的なトランザクションでは外部の認可コンポーネントがデータを確認する必要があります。

開発者がトランザクション認可のコンポーネントを構築する際には、*What You See Is What You Sign* の原則を使用すべきです。認可方式は、利用者が対象トランザクションにとって重要なデータを識別し、承認できるようにしなければなりません。たとえば送金の場合、利用者は送金先口座と金額を識別できるべきです。

開発者がどのトランザクションデータを重要とするかを決める際には、その判断を以下に基づけるべきです。

- 実際のリスク
- 選択した認可方式の技術的能力と制約
- 利用者にとって良好な体験

たとえば、SMS メッセージで重要なトランザクションデータを確認する場合、開発者は送金先口座、金額、送金種別を利用者に返すことができます。しかし、非接続型の [CAP reader](https://en.wikipedia.org/wiki/Chip_Authentication_Program) で利用者にそのデータを入力させるのは不便です。このような場合、開発者は確認のために最小限の重要なトランザクションデータ (例: 送金先口座番号の一部と金額) を返すのがよいでしょう。

一般に、利用者はトランザクション認可プロセスの一部として、すべての重要なトランザクションデータを検証しなければなりません。トランザクションプロセスで利用者が外部デバイスにトランザクションデータを入力する必要がある場合、利用者にはトランザクション内の特定の値 (例: 送金先口座番号) を確認するよう促すべきです。意味のあるプロンプトがない場合、セクション 1.4 で後述するように、ソーシャルエンジニアリング手法やマルウェアによって容易に悪用される可能性があります。入力オーバーロード問題のより詳しい議論については、[こちら](http://www.cl.cam.ac.uk/~sjm217/papers/fc09optimised.pdf) も参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### 1.2 Change of authorization token should be authorized using the current authorization token

If a user can use the application interface to change the authorization token, they should be able to authorize the operation with their current authorization credentials (as is the case with [password change procedure](https://owasp.org/www-project-web-security-testing-guide/stable/4-Web_Application_Security_Testing/04-Authentication_Testing/09-Testing_for_Weak_Password_Change_or_Reset_Functionalities.html)). For example: when a user changes a phone number for SMS codes an authorization SMS code should be sent to the current phone number.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語訳</span>

### 1.2 認可トークンの変更は、現在の認可トークンを使って承認すべきである

利用者がアプリケーションインターフェースを使用して認可トークンを変更できる場合、その操作は現在の認可資格情報で承認できるようにすべきです ([password change procedure](https://owasp.org/www-project-web-security-testing-guide/stable/4-Web_Application_Security_Testing/04-Authentication_Testing/09-Testing_for_Weak_Password_Change_or_Reset_Functionalities.html) の場合と同様です)。例: 利用者が SMS コード用の電話番号を変更する場合、認可用 SMS コードは現在の電話番号に送信すべきです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### 1.3 Change of authorization method should be authorized using the current authorization method

Some applications allow a user to chose how their transactions will be authorized. In such cases, the developer should make sure that the application can confirm the user's method of authorization to prevent any malware from changing the user's authorization method to the most vulnerable method. Additionally, the application should inform the user about any potential dangers associated with their authorization method.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語訳</span>

### 1.3 認可方式の変更は、現在の認可方式を使って承認すべきである

一部のアプリケーションでは、利用者がトランザクションの認可方式を選択できます。このような場合、開発者は、マルウェアが利用者の認可方式を最も脆弱な方式に変更することを防ぐため、アプリケーションが利用者の認可方式を確認できるようにすべきです。さらに、アプリケーションは利用者の認可方式に関連する潜在的な危険について利用者に通知すべきです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### 1.4 Users should be able to easily distinguish the authentication process from the transaction authorization process

Since developers need to prevent users from authorizing fraudulent operations, their applications should not require a user to perform the same actions for authentication and transaction authorization. Consider the following example:

1. An application is using the same method for user authentication and for transaction authorization (i.e. with an OTP token).
2. Malware could use a man-in-the-middle attack to present a user with a false error message when they submit credentials to the application, which could trick the user into repeating the authentication procedure. The first credential will be used by the malware for authentication and the second credential would be used to authorize a fraudulent transaction. Even challenge-response schemes could be abused using this scenario, since malware can present a challenge taken from a fraudulent transaction and trick the user to provide a response. Such an attack scenario is used widely in [malware attacks against electronic banking](http://securityintelligence.com/back-basics-malware-authors-downgrade-tactics-stay-radar/#.VX_qI_krLDc).

To stop such attacks, developers can make sure that authentication actions are different than transaction authorizations by:

- Using different methods to authenticate and to authorize
- Employing different actions in an external security component (i.e using a different mode of operation in a CAP reader)
- Presenting the user with a clear message about what they are "signing" (What You See Is What You Sign Principle)

Social engineering methods [can be used despite authentication and operation authorization methods](http://securityintelligence.com/tatanga-attack-exposes-chiptan-weaknesses/#.VZAy9PkrLDc) but the application shouldn't make it easier for such attack scenarios.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語訳</span>

### 1.4 利用者は認証プロセスとトランザクション認可プロセスを容易に区別できるべきである

開発者は利用者が不正な操作を承認することを防ぐ必要があるため、アプリケーションは認証とトランザクション認可で同じ操作を利用者に要求すべきではありません。次の例を考えてください。

1. アプリケーションが、ユーザー認証とトランザクション認可に同じ方式を使用している (つまり OTP トークンを使用している)。
2. マルウェアは中間者攻撃を使用し、利用者がアプリケーションに資格情報を送信したときに偽のエラーメッセージを表示できます。これにより、利用者に認証手順を繰り返させることができます。最初の資格情報はマルウェアによる認証に使用され、二つ目の資格情報は不正なトランザクションの承認に使用されます。チャレンジレスポンス方式であっても、このシナリオで悪用される可能性があります。マルウェアは不正なトランザクションから取得したチャレンジを提示し、利用者をだましてレスポンスを提供させることができるためです。このような攻撃シナリオは、[電子バンキングに対するマルウェア攻撃](http://securityintelligence.com/back-basics-malware-authors-downgrade-tactics-stay-radar/#.VX_qI_krLDc) で広く使用されています。

このような攻撃を止めるため、開発者は次の方法で認証操作とトランザクション認可を異なるものにできます。

- 認証と認可に異なる方式を使用する
- 外部セキュリティコンポーネントで異なる操作を使用する (つまり CAP reader で異なる動作モードを使用する)
- 利用者が何に「署名」しているのかについて明確なメッセージを提示する (What You See Is What You Sign 原則)

ソーシャルエンジニアリング手法は、[認証方式や操作認可方式があっても使用される可能性があります](http://securityintelligence.com/tatanga-attack-exposes-chiptan-weaknesses/#.VZAy9PkrLDc)。しかし、アプリケーションがそのような攻撃シナリオを容易にすべきではありません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### 1.5 Each transaction should be authorized using unique authorization credentials

If applications only ask for transaction authorization credentials once (such as a static password, code sent through SMS, or a token response), the user could authorize any transaction during the entire session or reuse the same credentials when they need to authorize a transaction. In this scenario, attackers can employ malware to sniff credentials and use them to authorize any transaction without the user's knowledge.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語訳</span>

### 1.5 各トランザクションは一意の認可資格情報を使って承認すべきである

アプリケーションがトランザクション認可資格情報 (静的パスワード、SMS で送信されるコード、トークンレスポンスなど) を一度しか求めない場合、利用者はセッション全体で任意のトランザクションを承認できたり、トランザクションを承認する必要があるたびに同じ資格情報を再利用できたりします。このシナリオでは、攻撃者はマルウェアを用いて資格情報を盗聴し、利用者に知られずに任意のトランザクションを承認するために使用できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## 2. Non-functional guidelines

### 2.1 Authorization should be performed and enforced server-side

Like [all other security controls](https://cwe.mitre.org/data/definitions/602.html), transaction authorizations should be enforced on the server side. It should **never** be possible to influence an authorization's result by altering the data that flows from a client to a server by:

- Tampering with parameters that contain transaction data
- Adding/removing parameters which will disable authorization check
- Causing an error

To ensure that data is only managed on the server side, security programming best practices should be applied, such as:

- [Default deny](https://wiki.owasp.org/index.php/Positive_security_model)
- Avoiding debugging functionality in production code

Other safeguards should be considered to prevent tampering, such as encrypting the data for confidentiality and integrity, then decrypting and verifying the data on the server side.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語訳</span>

## 2. 非機能ガイドライン

### 2.1 認可はサーバー側で実施し、強制すべきである

[他のすべてのセキュリティコントロール](https://cwe.mitre.org/data/definitions/602.html) と同様に、トランザクション認可はサーバー側で強制すべきです。クライアントからサーバーへ流れるデータを次のように変更することで、認可結果に影響を与えられては **絶対に** なりません。

- トランザクションデータを含むパラメータを改ざんする
- 認可チェックを無効化するパラメータを追加または削除する
- エラーを発生させる

データがサーバー側でのみ管理されることを確実にするため、次のようなセキュアプログラミングのベストプラクティスを適用すべきです。

- [Default deny](https://wiki.owasp.org/index.php/Positive_security_model)
- 本番コードでデバッグ機能を避ける

改ざんを防ぐため、機密性と完全性のためにデータを暗号化し、サーバー側で復号および検証するなど、その他の保護策も検討すべきです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### 2.2 Authorization method should be enforced server-side

If multiple transaction authorization methods are made available to the user, the server side must make sure that the transaction occurs with the user's chosen authorization method or the authorization method enforced by application policies. Otherwise, malware could downgrade an authorization method to even the least secure authorization method. Developers must make it impossible for attackers to change a chosen authorization method by manipulating the parameters provided from the client.

Developers should be especially careful if they are asked to add a new authorization method that enhances security. Unfortunately, developers often decide to build a new authorization method on top of an old codebase. This case is insecure and an attacker could manipulate a client to successfully authorize a transaction by sending parameters using the old method, despite the fact that the application has already switched to a new method.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語訳</span>

### 2.2 認可方式はサーバー側で強制すべきである

複数のトランザクション認可方式を利用者に提供する場合、サーバー側は、利用者が選択した認可方式、またはアプリケーションポリシーによって強制される認可方式でトランザクションが行われることを必須で確認しなければなりません。そうしなければ、マルウェアが認可方式を最も安全性の低い方式にまでダウングレードする可能性があります。開発者は、クライアントから提供されるパラメータを操作して選択済みの認可方式を攻撃者が変更することを不可能にしなければなりません。

開発者は、セキュリティを強化する新しい認可方式を追加するよう依頼された場合、特に注意すべきです。残念ながら、開発者は古いコードベースの上に新しい認可方式を構築することを選びがちです。このケースは安全ではありません。アプリケーションがすでに新しい方式に切り替わっているにもかかわらず、攻撃者がクライアントを操作し、古い方式のパラメータを送信することでトランザクションの認可に成功できる可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### 2.3 Transaction verification data should be generated server-side

If developers decide to transmit significant transaction data programmatically to an authorization component, they should take extra care to prevent any client modifications to the transaction data at authorization. **All significant transaction data must be verified by the user, generated and stored on a server, then passed to an authorization component without any possibility of tampering by the client.**

And when developers collect significant transaction data on the client side and pass it on to the server, malware could manipulate the data and show faked transaction data in an authorization component.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語訳</span>

### 2.3 トランザクション検証データはサーバー側で生成すべきである

開発者が重要なトランザクションデータをプログラム的に認可コンポーネントへ送信することを決めた場合、認可時にクライアントがトランザクションデータを変更できないよう、特別な注意を払うべきです。**すべての重要なトランザクションデータは、利用者によって検証され、サーバー上で生成および保存され、その後クライアントによる改ざんの可能性がない状態で認可コンポーネントへ渡されなければなりません。**

また、開発者がクライアント側で重要なトランザクションデータを収集してサーバーへ渡す場合、マルウェアがそのデータを操作し、認可コンポーネント内に偽のトランザクションデータを表示する可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### 2.4 Application should prevent authorization credentials brute-forcing

**Developers must make sure that their application can't allow attackers to brute-force a transaction at the point where transaction authorization credentials are submitted to the server for verification. After a set number of failed authorization attempts, the entire transaction authorization process should be restarted.** Also, there are other methods to prevent brute-forcing and stop other automation-related techniques, see [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#prevent-brute-force-attacks).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語訳</span>

### 2.4 アプリケーションは認可資格情報のブルートフォースを防ぐべきである

**開発者は、トランザクション認可資格情報が検証のためにサーバーへ送信される箇所で、攻撃者がトランザクションをブルートフォースできないようにアプリケーションを作る必要があります。一定回数の認可失敗後には、トランザクション認可プロセス全体を再開始すべきです。** ブルートフォースを防ぎ、その他の自動化関連技術を止める方法はほかにもあります。[OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#prevent-brute-force-attacks) を参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### 2.5 Application should control which transaction state transitions are allowed

Transaction authorization is usually performed in multiple steps, e.g.:

1. The user enters the transaction data.
2. The user requests authorization from the application.
3. The application initializes an authorization mechanism.
4. The user verifies/confirms the transaction data.
5. The user responds with the authorization credentials.
6. The application validates authorization and executes a transaction.

The developers must ensure that the business logic flow for a transaction authorization occurs in in sequential order so users (or attackers) cannot perform the steps out of order or even skip any of the steps. This should protect against attack techniques such as:

- Overwriting transaction data before user will enter the authorization credentials
- Skipping transaction authorization

See [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/) requirement **15.1**).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語訳</span>

### 2.5 アプリケーションは許可されるトランザクション状態遷移を制御すべきである

トランザクション認可は通常、たとえば次のように複数のステップで実行されます。

1. 利用者がトランザクションデータを入力する。
2. 利用者がアプリケーションに認可を要求する。
3. アプリケーションが認可メカニズムを初期化する。
4. 利用者がトランザクションデータを検証または確認する。
5. 利用者が認可資格情報で応答する。
6. アプリケーションが認可を検証し、トランザクションを実行する。

**開発者は、利用者 (または攻撃者) がステップを順不同で実行したり、いずれかのステップをスキップしたりできないよう、トランザクション認可のビジネスロジックフローが順序どおりに行われることを必須で保証しなければなりません。これは次のような攻撃手法から保護するはずです。**

- 利用者が認可資格情報を入力する前にトランザクションデータを上書きする
- トランザクション認可をスキップする

[OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/) 要件 **15.1** を参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### 2.6 Transaction data should be protected against modification

Developers must not allow attackers to modify transaction data when the user enters the data for the first time. Poor implementations may allow malware to:

1. Replay the first step in Section 2.5 (sending transaction data) in the background before the user enters authorization credentials and then overwrite transaction details with a fraudulent transaction.
2. Create and add new transaction data parameters to a HTTP request that is authorizing the transaction. In such a case, a transaction authorization process that is poorly implemented might authorize the initial transaction and then execute a fraudulent transaction (specific example of [Time of Check to Time of Use vulnerability](https://cwe.mitre.org/data/definitions/367.html)).

There are multiple methods that can prevent transaction data from being modified during authorization:

1. If transaction data is modified, the code could invalidate any previously entered authorization data (e.g. Generated OTP) and the challenge.
2. Modifications to transaction data could trigger a reset of the authorization process.
3. Any attempt to modify transaction data after user entry is an attack on the system and it should be logged, monitored, and carefully investigated.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語訳</span>

### 2.6 トランザクションデータは変更から保護すべきである

開発者は、利用者が最初にデータを入力した時点で、攻撃者がトランザクションデータを変更できるようにしてはなりません。実装が不十分な場合、マルウェアは次のことを行える可能性があります。

1. セクション 2.5 の最初のステップ (トランザクションデータの送信) を、利用者が認可資格情報を入力する前にバックグラウンドで再実行し、トランザクション詳細を不正なトランザクションで上書きする。
2. トランザクションを認可する HTTP リクエストに、新しいトランザクションデータパラメータを作成して追加する。このような場合、実装が不十分なトランザクション認可プロセスは、最初のトランザクションを認可し、その後不正なトランザクションを実行する可能性があります ([Time of Check to Time of Use vulnerability](https://cwe.mitre.org/data/definitions/367.html) の具体例)。

認可中にトランザクションデータが変更されることを防ぐ方法は複数あります。

1. トランザクションデータが変更された場合、コードは以前に入力された認可データ (例: 生成済み OTP) とチャレンジを無効化できます。
2. トランザクションデータの変更により、認可プロセスをリセットできます。
3. 利用者による入力後にトランザクションデータを変更しようとする試みはすべてシステムへの攻撃であり、ログに記録し、監視し、慎重に調査すべきです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### 2.7 Confidentiality of transaction data should be protected during all client-server communications

The transaction authorization process should protect the privacy of transaction data that the user will be authorizing (i.e. at Section 2.5, steps 2 and 4).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語訳</span>

### 2.7 トランザクションデータの機密性は、すべてのクライアントサーバー通信で保護すべきである

トランザクション認可プロセスは、利用者が承認しようとしているトランザクションデータのプライバシーを保護すべきです (つまりセクション 2.5 のステップ 2 および 4)。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### 2.8 System should check each transaction execution and make sure it has been properly authorized

The final result of the transaction entry and authorization process (as described in Section 2.5) is also called the *transaction execution*. There should be a final control gate before transaction execution which verifies whether the transaction was properly authorized by the user. This control should be tied to execution and prevent attacks such as:

- Time of Check to Time of Use (TOCTOU) - example in Section 2.6
- Skipping authorization check in the transaction entry process (see. Section 2.5)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語訳</span>

### 2.8 システムは各トランザクション実行をチェックし、適切に承認されていることを確認すべきである

トランザクション入力および認可プロセス (セクション 2.5 で説明) の最終結果は、*トランザクション実行* とも呼ばれます。トランザクション実行前には、トランザクションが利用者によって適切に承認されたかを検証する最終制御ゲートがあるべきです。この制御は実行に結び付けられ、次のような攻撃を防ぐべきです。

- Time of Check to Time of Use (TOCTOU) - セクション 2.6 の例
- トランザクション入力プロセスにおける認可チェックのスキップ (セクション 2.5 を参照)

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### 2.9 Authorization credentials should only be valid during a limited time period

In some attacks, a user's authorization credentials are passed by malware to a command-and-control server and then are used from an attacker-controlled machine. Often, this process is often performed manually by an attacker. To make sure that these are attacks are difficult, the server should only allow transaction authorization to occur in a limited time window which should occur between the generation of a challenge (or OTP) and the completion of an authorization. Additionally, such safeguards will also help stop resource exhaustion attacks. This time period should be carefully selected so it will not disrupt normal user behavior.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語訳</span>

### 2.9 認可資格情報は限られた期間だけ有効にすべきである

一部の攻撃では、利用者の認可資格情報がマルウェアによってコマンドアンドコントロールサーバーへ渡され、その後、攻撃者が制御するマシンから使用されます。多くの場合、このプロセスは攻撃者によって手作業で実行されます。このような攻撃を困難にするため、サーバーは、チャレンジ (または OTP) の生成から認可の完了までの間に発生する限定された時間窓内でのみ、トランザクション認可を許可すべきです。さらに、このような保護策はリソース枯渇攻撃の阻止にも役立ちます。この期間は、通常の利用者行動を妨げないよう慎重に選択すべきです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### 2.10 Authorization credentials should be unique for every operation

To prevent multiple replay attacks, each set of authorization credentials should be unique for every operation. These credentials can be generated with different methods depending on the mechanism. For example: developers can use a timestamp, a sequence number, or a random value in signed transaction data or as a part of a challenge.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語訳</span>

### 2.10 認可資格情報は操作ごとに一意であるべきである

複数のリプレイ攻撃を防ぐため、認可資格情報の各セットは操作ごとに一意であるべきです。これらの資格情報は、メカニズムに応じて異なる方法で生成できます。例: 開発者は、署名済みトランザクションデータ内、またはチャレンジの一部として、タイムスタンプ、シーケンス番号、ランダム値を使用できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Remarks

Here are some other issues that should be considered while implementing transaction authorizations, but are beyond the scope of this cheat sheet:

- Which transactions should be authorized? All transactions or only some of them? Each application is different and an application owner should decide if all transactions should be authorized or only some of them. The developers should consider risk analysis, risk exposition of given application, and other safeguards implemented in an application.
- **We recommend the use of cryptographic operations to protect transactions and to ensure integrity, confidentiality and non-repudiation.**
- **It is critically important to provision & protect the device signing keys during device "pairing" is as is the actual signing protocol itself. Malware may attempt to inject/replace or steal the signing keys.**
- User awareness: For example in transaction authorization methods, when a user types in significant transaction data to an authorization component (e.g. an external dedicated device or a mobile application), users should be trained to rewrite transaction data from a trusted source and not from a computer screen.
- **There are some anti-malware solutions that protect against such threats but these solutions [cannot be 100% effective](http://www.securing.pl/en/script-based-malware-detection-in-online-banking-security-overview/index.html) and should be used only as an additional layer of protection.**
- Protecting your signing keys with a second factor such as passwords, biometrics, etc. or leveraging secure elements (TEE, TPM, Smart card).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語訳</span>

## 備考

以下は、トランザクション認可を実装する際に検討すべきその他の事項ですが、このチートシートの範囲外です。

- どのトランザクションを承認すべきか。すべてのトランザクションか、それとも一部のみか。アプリケーションはそれぞれ異なり、すべてのトランザクションを承認すべきか、一部のみ承認すべきかはアプリケーション所有者が決定すべきです。開発者は、リスク分析、対象アプリケーションのリスク露出、アプリケーションに実装されているその他の保護策を考慮すべきです。
- **トランザクションを保護し、完全性、機密性、否認防止を確保するため、暗号操作の使用を推奨します。**
- **デバイスの「ペアリング」中にデバイス署名鍵をプロビジョニングし保護することは、実際の署名プロトコル自体と同じくらい極めて重要です。マルウェアは署名鍵の注入、置換、または窃取を試みる可能性があります。**
- 利用者の意識向上: たとえばトランザクション認可方式で、利用者が重要なトランザクションデータを認可コンポーネント (例: 外部の専用デバイスやモバイルアプリケーション) に入力する場合、利用者にはコンピューター画面ではなく信頼できるソースからトランザクションデータを書き写すよう教育すべきです。
- **このような脅威から保護するマルウェア対策ソリューションもありますが、それらのソリューションは [100% 有効にはなり得ない](http://www.securing.pl/en/script-based-malware-detection-in-online-banking-security-overview/index.html) ため、追加の防御層としてのみ使用すべきです。**
- パスワード、生体認証などの第二要素で署名鍵を保護する、またはセキュアエレメント (TEE、TPM、スマートカード) を活用する。

</div>
</div>

</section>
</div>

## References and future reading

<div className="referenceFooter">

- Wojciech Dworakowski: [E-banking transaction authorization - possible vulnerabilities, security verification and best practices for implementation. Presentation from AppSec EU 2015](http://www.slideshare.net/wojdwo/ebanking-transaction-authorization-appsec-eu-2015-amsterdam).
- Saar Drimer, Steven J. Murdoch, and Ross Anderson: [Optimised to Fail - Card Readers for Online Banking](http://www.cl.cam.ac.uk/~sjm217/papers/fc09optimised.pdf).
- Jakub Kałużny, Mateusz Olejarka: [Script-based Malware Detection in Online Banking Security Overview](http://www.securing.pl/en/script-based-malware-detection-in-online-banking-security-overview/index.html).
- [List of websites and whether or not they support 2FA](https://twofactorauth.org/).
- Laerte Peotta, Marcelo D. Holtz, Bernardo M. David, Flavio G. Deus, Rafael Timóteo de Sousa Jr: [A Formal Classification Of Internet Banking Attacks and Vulnerabilities](http://airccse.org/journal/jcsit/0211ijcsit13.pdf).
- Marco Morana, Tony Ucedavelez: [Threat Modeling of Banking Malware-Based Attacks](https://owasp.org/www-pdf-archive/Marco_Morana_and_Tony_UV_-_Threat_Modeling_of_Banking_Malware.pdf).
- OWASP [Anti-Malware - Knowledge Base](https://wiki.owasp.org/index.php/OWASP_Anti-Malware_-_Knowledge_Base).
- OWASP [Anti-Malware Project - Awareness Program](https://wiki.owasp.org/index.php/OWASP_Anti-Malware_Project_-_Awareness_Program).
- Arjan Blom , Gerhard de Koning Gans , Erik Poll , Joeri de Ruiter , and Roel Verdult: [Designed to Fail - A USB-Connected Reader for Online Banking](http://www.cs.ru.nl/~rverdult/Designed_to_Fail_A_USB-Connected_Reader_for_Online_Banking-NORDSEC_2012.pdf)

</div>

## Attribution

<div className="attributionFooter">

- Original: Transaction Authorization Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Transaction_Authorization_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: English original retained for comparison. Japanese translation added. Bilingual display generated from official source and local Japanese translation.
- Retrieved: 2026-05-21

</div>
