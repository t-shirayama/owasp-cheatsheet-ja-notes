# 悪用ケースチートシート 日本語訳

## Attribution

- Original: Abuse Case Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Abuse_Case_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-21

## 日本語訳

# 悪用ケースチートシート (Historical) 日本語訳

## アーカイブ声明

レビュアーは、悪用ケースが実務ではほとんど使われていないことを確認しました。加えて、この資料は「入門チュートリアル」として提示されており、チートシートシリーズには適していません。

## はじめに

要件でアプリケーションのセキュリティレベルに言及する際、次のような_表現_によく出会います。

- _アプリケーションはセキュアでなければならない_。
- _アプリケーションは、このカテゴリのアプリケーションを標的とするすべての攻撃から防御しなければならない_。
- _アプリケーションは OWASP TOP 10 の攻撃から防御しなければならない_。
- ...

これらのセキュリティ要件は一般的すぎるため、開発チームにとって役に立ちません...

安全なアプリケーションを構築するには、実践的な観点から、アプリケーションが防御しなければならない攻撃を、そのビジネスおよび技術的文脈に従って特定することが重要です。悪用ケースは、以前はよく推奨される_脅威モデリング_手法であり、[脅威モデリング](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html)チートシートを確認すると役立つかもしれません。実務上、悪用ケースのフレームワークは重厚に見え、公開された例や成功事例はほとんどありません。

### 目的

このチートシートの目的は、**悪用ケース**とは何か、アプリケーションのセキュリティを考える際に悪用ケースがどのように重要になり得るかを説明し、最後に、アプリケーションの一部として実装予定の各機能について悪用ケースのリストを作成し追跡するための実践的アプローチ案を提供することです。このチートシートは、使用されるプロジェクト方法論 (ウォーターフォールまたはアジャイル) に関係なく、この目的に使用できます。

**このチートシートに関する重要な注意:**

```text
The main objective is to provide a pragmatic approach in order to allow a company or a project team
to start building and handling the list of abuse cases and then customize the elements
proposed to its context/culture in order to, finally, build its own method.

This cheat sheet can be seen as a getting-started tutorial.
```

### 文脈とアプローチ

#### 攻撃を明確に特定する理由

アプリケーションがどの攻撃に対して防御しなければならないかを明確に特定することは、プロジェクトまたはスプリントで次の手順を可能にするために不可欠です。

- 特定された各攻撃についてビジネスリスクを評価し、ビジネスリスクとプロジェクトまたはスプリントの予算に従って選択できるようにします。
- セキュリティ要件を導出し、プロジェクト仕様、またはスプリントのユーザーストーリーと受け入れ基準に追加します。
- 対策を実装するために必要となる初期プロジェクトまたはスプリント工数上の追加負荷を見積もります。
- 対策について、プロジェクトチームがそれらを定義し、どこ (ネットワーク、インフラストラクチャ、コードなど) に配置すべきかを判断できるようにします。

#### 悪用ケースの概念

**悪用ケース**は二つの方法で考えられます。一つ目は攻撃を発見すること (「何がうまくいかない可能性があるか」という問いに答えること) で、二つ目はそれらの攻撃 (非公式には、脅威、問題、リスクを含む) を、開発者にとって威圧感が少ないかもしれない形式で記録する助けにすることです。

**悪用ケース**は次のように定義できます。

```text
A way to use a feature that was not expected by the implementer,
allowing an attacker to influence the feature or outcome of use of
the feature based on the attacker action (or input).
```

Synopsis は**悪用ケース**を次のように定義しています。

```text
Misuse and abuse cases describe how users misuse or exploit the weaknesses
of controls in software features to attack an application.

This can lead to tangible business impact when a direct attack against
business functionalities, which may bring in revenue or provide
positive user experience, are attacked.

Abuse cases can also be an effective way to drive security requirements
that lead to proper protection of these critical business use cases.
```

[Synopsis source](https://www.synopsys.com/blogs/software-security/abuse-cases-can-drive-security-requirements.html)

#### 悪用ケースのリストを定義する方法

機能 (アジャイルプロジェクトではユーザーストーリーに対応付けられるもの) に対する悪用ケースのリストを定義する方法は数多くあります。

[脅威モデリング](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html)は、何がうまくいかない可能性があるかを予測し、特定された各シナリオに対して何らかの対応を確実に行うための技法群です。「それに対して何をするのか」のリストにある各項目を取り、悪用ケースとして書くことは、エンジニアリングチームがその出力を処理する助けになるかもしれません。

[OWASP Open SAMM](https://owasp.org/www-project-samm/) プロジェクトは、成熟度レベル 2 のセキュリティプラクティス _Requirements Driven Testing_ の _Stream B_ で、次のアプローチを提案しています。

```text
Misuse and abuse cases describe unintended and malicious use scenarios of the application, describing how an attacker could do this. Create misuse and abuse cases to misuse or exploit the weaknesses of controls in software features to attack an application. Use abuse-case models for an application to serve as fuel for identification of concrete security tests that directly or indirectly exploit the abuse scenarios.

Abuse of functionality, sometimes referred to as a “business logic attack”, depends on the design and implementation of application functions and features. An example is using a password reset flow to enumerate accounts. As part of business logic testing, identify the business rules that are important for the application and turn them into experiments to verify whether the application properly enforces the business rule. For example, on a stock trading application, is the attacker allowed to start a trade at the beginning of the day and lock in a price, hold the transaction open until the end of the day, then complete the sale if the stock price has risen or cancel if the price dropped?
```

Open SAMM source: [Verification Requirement Driven Testing Stream B](https://owaspsamm.org/model/verification/requirements-driven-testing/stream-b/)

リスト作成を実現する別の方法として、次のようなものがあります (よりボトムアップで協調指向です)。

次のプロファイルの人々を含むワークショップを開催します。

- **ビジネスアナリスト**: 各機能をビジネスの観点から説明する主要なビジネス担当者です。
- **リスクアナリスト**: 提案された攻撃からビジネスリスクを評価する企業のリスク担当者です (会社によっては**ビジネスアナリスト**が担当することもあります)。
- **ペネトレーションテスター**: 対象のビジネス機能に対して実行できる攻撃を提案する_攻撃者_です。会社にこのプロファイルの人物がいない場合は、外部専門家のサービスを依頼できます。可能であれば、特定および検討される攻撃数を増やすため、異なる背景を持つ 2 名のペネトレーションテスターを含めます。
- **プロジェクトの技術リーダー**: プロジェクトの技術担当者であり、ワークショップ中に特定された攻撃と対策について技術的なやり取りを可能にします。
- **品質保証アナリストまたは機能テスター**: アプリケーションや機能がどのように動作することを意図しているか (ポジティブテスト)、どのように動作してはならないか (ネガティブテスト)、何が失敗を引き起こすか (失敗ケース) について、よい感覚を持っている可能性のある担当者です。

このワークショップ中 (所要時間は機能リストのサイズによりますが、4 時間はよい出発点です)、プロジェクトまたはスプリントに含まれるすべてのビジネス機能を処理します。ワークショップの出力は、すべてのビジネス機能に対する攻撃 (悪用ケース) のリストになります。すべての悪用ケースには、フィルタリングと優先順位付けを可能にするリスク評価を付けます。

**技術的**な悪用ケースと**ビジネス**上の悪用ケースを考慮し、それに応じて印を付けることが重要です。

_例:_

- 技術的フラグ付き悪用ケース: コメント入力フィールドに Cross Site Scripting インジェクションを追加する。
- ビジネスフラグ付き悪用ケース: オンラインショップで注文を通す前に商品の価格を任意に変更でき、ユーザーが欲しい商品に対して低い金額を支払うことになる。

#### 悪用ケースのリストを定義するタイミング

アジャイルプロジェクトでは、ユーザーストーリーがスプリントに含められる会議の後に定義ワークショップを実施しなければなりません。

ウォーターフォールプロジェクトでは、実装するビジネス機能が特定され、ビジネス側に知られた時点で定義ワークショップを実施しなければなりません。

使用されるプロジェクト形態 (アジャイルまたはウォーターフォール) にかかわらず、対応対象として選択された悪用ケースは、追加のコストや工数の評価、対策の特定と実装を可能にするため、各機能仕様セクション (ウォーターフォール) またはユーザーストーリーの受け入れ基準 (アジャイル) におけるセキュリティ要件にならなければなりません。

各悪用ケースには、プロジェクトまたはスプリント全体を通じて追跡できるように、一意の識別子を持たせなければなりません (この点の詳細は提案セクションで説明します)。

一意 ID 形式の例は **ABUSE_CASE_001** です。

次の図は、関係する各ステップの連鎖の概要 (左から右) を示します。

![Overview Schema](https://cheatsheetseries.owasp.org/assets/Abuse_Case_Cheat_Sheet_Overview.png)

### 提案

この提案は、前のセクションで説明したワークショップの出力に焦点を当てます。

#### ステップ 1: ワークショップの準備

まず、当然に思えるとしても、主要なビジネス担当者は、ワークショップで処理されるビジネス機能を知り、理解し、説明できるようにしておく必要があります。

次に、次のシート (またはタブ) を持つ新しい Microsoft Excel ファイル (Google Sheets やその他の同様のソフトウェアも使用できます) を作成します。

- **FEATURES**
    - ワークショップで予定されているビジネス機能のリストを含むテーブルを保持します。
- **ABUSE CASES**
    - ワークショップ中に特定されたすべての悪用ケースを含むテーブルを保持します。
- **COUNTERMEASURES**
    - 特定された悪用ケースに対して想定される可能な対策のリスト (簡単な説明) を含むテーブルを保持します。
    - このシートは必須ではありませんが、修正が実装しやすいかどうかを悪用ケースごとに知り、それがリスク評価に影響する可能性があるため、有用な場合があります。
    - 対策はワークショップ中に AppSec プロファイルによって特定できます。AppSec 担当者は攻撃を実行できるだけでなく、防御を構築または特定できなければならないためです (ペネトレーションテスターのプロファイルでは常にそうとは限りません。この人物の焦点は一般に攻撃側だけにあるため、Pentester + AppSec の組み合わせは 360 度の視点を持つうえで非常に効果的です)。

これは、各シートの表現と、ワークショップ中に入力される内容の例です。

_FEATURES_ シート:

| Feature unique ID |     Feature name      |           Feature short description           |
| :---------------: | :-------------------: | :-------------------------------------------: |
|    FEATURE_001    | DocumentUploadFeature | Allow user to upload document along a message |

_COUNTERMEASURES_ シート:

| Countermeasure unique ID | Countermeasure short description                       | Countermeasure help/hint                                |
| ------------------------ | ------------------------------------------------------ | ------------------------------------------------------- |
| DEFENSE_001              | Validate the uploaded file by loading it into a parser | Use advice from the OWASP Cheat Sheet about file upload |

_ABUSE CASES_ シート:

| Abuse case unique ID | Feature ID impacted |                     Abuse case's attack description                     | Attack referential ID (if applicable) | CVSS V3 risk rating (score) |                CVSS V3 string                | Kind of abuse case | Countermeasure ID applicable | Handling decision (To Address or Risk Accepted) |
| :------------------: | :-----------------: | :---------------------------------------------------------------------: | :-----------------------------------: | :-------------------------: | :------------------------------------------: | :----------------: | :--------------------------: | :---------------------------------------------: |
|    ABUSE_CASE_001    |     FEATURE_001     | Upload Office file with malicious macro in charge of dropping a malware |               CAPEC-17                |         HIGH (7.7)          | CVSS:3.0/AV:N/AC:H/PR:L/UI:R/S:C/C:N/I:H/A:H |     Technical      |         DEFENSE_001          |                   To Address                    |

#### ステップ 2: ワークショップ中

スプレッドシートを使用して、すべての機能をレビューします。

各機能について、次の流れに従います。

1. 主要なビジネス担当者が、現在の機能をビジネスの観点から説明します。
2. ペネトレーションテスターが、その機能に対して実行できる一連の攻撃を提案し説明します。
3. 提案された各攻撃について:
   1. AppSec が対策と望ましい設置場所 (インフラストラクチャ、ネットワーク、コード、設計など) を提案します。
   2. 技術担当者が、提案された対策の実現可能性についてフィードバックします。
   3. ペネトレーションテスターが CVSS v3 (または他の標準) 計算機を使用してリスク評価を決定します。(例: [CVSS V3 calculator](https://www.first.org/cvss/calculator/3.0))
   4. リスクリーダーは、会社にとっての実際のビジネス影響を正確に反映する最終リスクスコアを決定するため、リスク評価を受け入れるか修正すべきです。

4. ビジネス、リスク、技術の各リーダーは合意を形成し、現在の機能に対する悪用のリストをフィルタリングして、対応しなければならないものを残し、それに応じて _ABUSE CASES_ シートでフラグを付けるべきです (**リスクを受け入れる場合は、その理由を説明するコメントを追加します**)。
5. 次の機能に進みます...

ペネトレーションテスターの参加が不可能な場合は、機能に適用できる攻撃を特定するために次の参考資料を使用できます。

- [OWASP Automated Threats to Web Applications](https://owasp.org/www-project-automated-threats-to-web-applications/)
- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/stable/)
- [OWASP Mobile Testing Guide](https://github.com/OWASP/owasp-mstg)
- [Common Attack Pattern Enumeration and Classification (CAPEC)](https://capec.mitre.org/)

攻撃と対策のナレッジベースに関する重要な注意:

```text
With time and experience across projects, you will obtain your own dictionary of attacks and countermeasures
that are applicable to the kind of application in your business domain.

This dictionary will speed up the future workshops in a significant way.

To promote the creation of this dictionary, you can, at the end of the project/sprint, gather the list
of attacks and countermeasures identified in a central location (wiki, database, file...) that will be
used during the next workshop in combination with input from penetration testers.
```

#### ステップ 3: ワークショップ後

この段階で、スプレッドシートには、処理しなければならないすべての悪用ケースのリストと、場合によっては (キャパシティに応じて) 対応する対策が含まれています。

ここで、残るタスクは二つあります。

1. 主要なビジネス担当者は、関連する悪用ケースをセキュリティ要件 (ウォーターフォール) または受け入れ基準 (アジャイル) として含めるため、各機能の仕様 (ウォーターフォール) または各機能のユーザーストーリー (アジャイル) を更新しなければなりません。
2. 主要な技術担当者は、対策を考慮に入れるための費用や工数の面での追加負荷を評価しなければなりません。

#### ステップ 4: 実装中 - 悪用ケース対応の追跡

すべての悪用ケースの対応を追跡するために、次のアプローチを使用できます。

一つまたは複数の悪用ケースが次の場所で処理される場合:

- **設計、インフラストラクチャ、またはネットワークレベル**
    - ドキュメントまたは図に、_この設計/ネットワーク/インフラストラクチャは悪用ケース ABUSE_CASE_001, ABUSE_CASE_002, ABUSE_CASE_xxx を考慮している_ことを示す注記を作成します。
- **コードレベル**
    - クラス、スクリプト、モジュールに、_このクラス/モジュール/スクリプトは悪用ケース ABUSE_CASE_001, ABUSE_CASE_002, ABUSE_CASE_xxx を考慮している_ことを示す特別なコメントを配置します。
    - `@AbuseCase(ids={"ABUSE_CASE_001","ABUSE_CASE_002"})` のような専用アノテーションを使用して、追跡を容易にし、統合開発環境内で識別できるようにできます。

この方法を使用すると、(多少のスクリプトによって) 悪用ケースがどこで対処されているかを特定できるようになります。

#### ステップ 5: 実装中 - 悪用ケース対応の検証

悪用ケースが定義されているため、次のことを確実にするための自動または手動の検証を配置できます。

- 選択されたすべての悪用ケースが処理されている。
- 悪用ケースが正しく、完全に処理されている。

検証には次の種類があります。

- 自動 (プロジェクトの継続的インテグレーションジョブで、コミット時、毎日、または毎週、定期的に実行):
    - Static Application Security Testing (SAST) または Dynamic Application Security Testing (DAST) ツールのカスタム監査ルール。
    - 専用の単体、結合、または機能のセキュリティ指向テスト。
    - ...
- 手動:
    - 設計または実装中におけるプロジェクトの同僚間のセキュリティコードレビュー。
    - 対応済みのすべての悪用ケースのリストをペネトレーションテスターに提供し、アプリケーションに対する侵入テスト中に、各悪用ケースについて保護の有効性を検証できるようにします (ペネトレーションテスターは、特定された攻撃がもはや有効でないことを検証し、他の可能な攻撃も探します)。
    - ...

自動テストを追加すると、チームは悪用ケースに対する対策の有効性を追跡し、プロジェクトの保守またはバグ修正フェーズ中に対策がまだ配置されているかどうかを判断できます (偶発的な削除や無効化を防ぐため)。また、[Continuous Delivery](https://continuousdelivery.com/) アプローチを使用する場合、アプリケーションへのアクセスを開放する前に、すべての悪用ケース保護が配置されていることを確実にするためにも有用です。

### 悪用ケースをユーザーストーリーとして導出する例

次のセクションでは、入力ソースとして [OWASP TOP 10](https://owasp.org/www-project-top-ten/) を使用した、悪用ケースをユーザーストーリーとして導出する例を示します。

脅威指向ペルソナ:

- 悪意あるユーザー
- 乱用するユーザー
- 知識のないユーザー

#### A1:2017-Injection

_エピック:_

ほとんどすべてのデータソースはインジェクションベクターになり得ます。環境変数、パラメータ、外部および内部 Web サービス、そしてあらゆる種類のユーザーが含まれます。[Injection](https://owasp.org/www-community/Injection_Flaws) の欠陥は、攻撃者がインタプリタに敵対的なデータを送信できる場合に発生します。

_悪用ケース:_

攻撃者として、私はユーザーまたは API インターフェースの入力フィールドに対して、インジェクション攻撃 (SQL、LDAP、XPath、NoSQL クエリ、OS コマンド、XML パーサー、SMTP ヘッダー、式言語、ORM クエリ) を実行します。

#### A2:2017-Broken Authentication

_エピック:_

攻撃者は、クレデンシャルスタッフィング、デフォルト管理者アカウントリスト、自動ブルートフォース、辞書攻撃ツールのために、何億もの有効なユーザー名とパスワードの組み合わせにアクセスできます。セッション管理攻撃は、特に期限切れにならないセッショントークンとの関係でよく理解されています。

_悪用ケース:_

攻撃者として、私はクレデンシャルスタッフィングのために、何億もの有効なユーザー名とパスワードの組み合わせにアクセスできます。

_悪用ケース:_

攻撃者として、私はアプリケーションと支援システムのログイン領域に対して使用する、デフォルト管理者アカウントリスト、自動ブルートフォース、辞書攻撃ツールを持っています。

_悪用ケース:_

攻撃者として、私は期限切れトークンや偽トークンを使用してセッショントークンを操作し、アクセスを取得します。

#### A3:2017-Sensitive Data Exposure

_エピック:_

攻撃者は暗号を直接攻撃するのではなく、鍵を盗む、中間者攻撃を実行する、サーバー上、転送中、またはユーザーのクライアント (例: ブラウザ) から平文データを盗むことがあります。一般に手動攻撃が必要です。以前に取得されたパスワードデータベースは、Graphics Processing Units (GPUs) によってブルートフォースされる可能性があります。

_悪用ケース:_

攻撃者として、私はアプリケーションまたはシステムへの不正アクセスを得るために、アプリケーション内で露出した鍵を盗みます。

_悪用ケース:_

攻撃者として、私はトラフィックへアクセスし、それを利用して機微データを取得し、場合によってはアプリケーションへの不正アクセスを得るために、中間者攻撃を実行します。

_悪用ケース:_

攻撃者として、私はアプリケーションまたはシステムへの不正アクセスを得るために、サーバー上、転送中、またはユーザーのクライアント (例: ブラウザ) から平文データを盗みます。

_悪用ケース:_

攻撃者として、私はトラフィックを取得して暗号を破ることにより、古い、または弱い暗号アルゴリズムを見つけて標的にします。

#### A4:2017-XML External Entities (XXE)

_エピック:_

攻撃者は、XML をアップロードできる場合、または XML 文書に敵対的なコンテンツを含められる場合、脆弱な XML プロセッサを悪用し、脆弱なコード、依存関係、またはインテグレーションを悪用できます。

_悪用ケース:_

攻撃者として、私はユーザーまたはシステムが XML をアップロードできるアプリケーションの脆弱な領域を悪用し、データの抽出、サーバーからのリモートリクエストの実行、内部システムのスキャン、サービス拒否攻撃の実行、およびその他の攻撃を行います。

_悪用ケース:_

攻撃者として、私はアプリケーションまたはシステムにアップロードされる XML 文書に敵対的なコンテンツを含め、データの抽出、サーバーからのリモートリクエストの実行、内部システムのスキャン、サービス拒否攻撃の実行、およびその他の攻撃を行います。

_悪用ケース:_

攻撃者として、私は悪意のある XML コードを含め、脆弱なコード、依存関係、またはインテグレーションを悪用し、データの抽出、サーバーからのリモートリクエストの実行、内部システムのスキャン、サービス拒否攻撃 (例: Billion Laughs 攻撃) の実行、およびその他の攻撃を行います。

#### A5:2017-Broken Access Control

_エピック:_

アクセス制御の悪用は、攻撃者の中核的スキルです。アクセス制御は手動手段で検出でき、特定のフレームワークにおけるアクセス制御の欠如については、自動化によって検出できる可能性もあります。

_悪用ケース:_

攻撃者として、私は URL、内部アプリケーション状態、HTML ページを変更するか、単にカスタム API 攻撃ツールを使用して、アクセス制御チェックをバイパスします。

_悪用ケース:_

攻撃者として、私は主キーを操作して別のユーザーのレコードにアクセスするよう変更し、他人のアカウントを閲覧または編集できるようにします。

_悪用ケース:_

攻撃者として、私はアプリケーション内のセッション、アクセストークン、またはその他のアクセス制御を操作し、ログインせずにユーザーとして振る舞ったり、ユーザーとしてログインしているときに管理者または特権ユーザーとして振る舞ったりします。

_悪用ケース:_

攻撃者として、私は JSON Web Token (JWT) アクセス制御トークン、Cookie、隠しフィールドの再生や改ざんによって権限昇格したり、JWT の無効化を悪用したりするなど、メタデータ操作を利用します。

_悪用ケース:_

攻撃者として、私は Cross-Origin Resource Sharing (CORS) の設定ミスを悪用し、認可されていない API アクセスを可能にします。

_悪用ケース:_

攻撃者として、私は未認証ユーザーとして認証済みページを強制閲覧したり、標準ユーザーとして特権ページを強制閲覧したりします。

_悪用ケース:_

攻撃者として、私は POST、PUT、DELETE に対するアクセス制御が欠落している API にアクセスします。

_悪用ケース:_

攻撃者として、私は使用中のデフォルト暗号鍵、生成または再利用された弱い暗号鍵、またはローテーションが欠落している鍵を標的にします。

_悪用ケース:_

攻撃者として、私はユーザーエージェント (例: アプリ、メールクライアント) が受信したサーバー証明書の有効性を検証しない領域を見つけ、データへの不正アクセスを得る攻撃を実行します。

#### A6:2017-Security Misconfiguration

_エピック:_

攻撃者は、不正アクセスやシステムに関する知識を得るため、未修正の欠陥、デフォルトアカウント、未使用ページ、保護されていないファイルやディレクトリなどを悪用しようとすることがよくあります。

_悪用ケース:_

攻撃者として、私はアプリケーションスタックの任意の部分における適切なセキュリティ強化設定の欠落、またはクラウドサービス上の不適切に構成された権限を見つけて悪用します。

_悪用ケース:_

攻撃者として、私は有効化またはインストールされている不要な機能 (例: 不要なポート、サービス、ページ、アカウント、権限) を見つけ、その弱点を攻撃または悪用します。

_悪用ケース:_

攻撃者として、私はアクセスできるべきではないシステムやインターフェースへアクセスしたり、コンポーネント上で実行できるべきではない操作を行うため、デフォルトアカウントとそのパスワードを使用します。

_悪用ケース:_

攻撃者として、私はエラー処理がスタックトレースやその他の過度に情報量の多いエラーメッセージを明らかにするアプリケーション領域を見つけ、それをさらなる悪用に使用します。

_悪用ケース:_

攻撃者として、私はアップグレードされたシステムや最新のセキュリティ機能が無効化されている、または安全に設定されていない領域を見つけます。

_悪用ケース:_

攻撃者として、私はアプリケーションサーバー、アプリケーションフレームワーク (例: Struts、Spring、ASP.NET)、ライブラリ、データベースなどのセキュリティ設定が安全な値に設定されていないことを見つけます。

_悪用ケース:_

攻撃者として、私はサーバーがセキュリティヘッダーやディレクティブを送信しない、または安全でない値に設定されていることを見つけます。

#### A7:2017-Cross-Site Scripting (XSS)

_エピック:_

XSS は OWASP Top 10 で二番目に多い問題であり、全アプリケーションのおよそ三分の二で見つかります。

_悪用ケース:_

攻撃者として、私はアプリケーションまたは API が未検証かつエスケープされていないユーザー入力を HTML 出力の一部として含める場所で、反射型 XSS を実行します。攻撃が成功すると、攻撃者は被害者のブラウザで任意の HTML と JavaScript を実行できます。通常、被害者は、悪意のある watering hole Web サイト、広告、または類似のものなど、攻撃者が制御するページを指す悪意あるリンクとやり取りする必要があります。

_悪用ケース:_

攻撃者として、私はアプリケーションまたは API がサニタイズされていないユーザー入力を保存し、それが後で別のユーザーまたは管理者によって閲覧される場所で、保存型 XSS を実行します。

_悪用ケース:_

攻撃者として、私は JavaScript フレームワーク、シングルページアプリケーション、API が攻撃者に制御可能なデータをページへ動的に含め、DOM XSS に対して脆弱な場所で、DOM XSS を実行します。

#### A8:2017-Insecure Deserialization

_エピック:_

デシリアライゼーションの悪用はやや困難です。既製のエクスプロイトは、基盤となるエクスプロイトコードへの変更や調整なしにはほとんど機能しないためです。

_悪用ケース:_

攻撃者として、私は敵対的または改ざんされたオブジェクトのデシリアライゼーションを供給できるアプリケーションや API の領域を見つけます。その結果、攻撃者がアプリケーションロジックを変更したり、デシリアライゼーション中または後に振る舞いを変えられるクラスがアプリケーションで利用可能な場合に任意のリモートコード実行を達成したりする、オブジェクトおよびデータ構造関連の攻撃に注力できます。または、既存のデータ構造は使用されるが内容が変更される、アクセス制御関連攻撃などのデータ改ざん攻撃に注力します。

#### A9:2017-Using Components with Known Vulnerabilities

_エピック:_

多くの既知の脆弱性について既に書かれたエクスプロイトを見つけることは容易ですが、その他の脆弱性ではカスタムエクスプロイトを開発するために集中的な努力が必要です。

_悪用ケース:_

攻撃者として、私は弱点を持つ一般的なオープンソースまたはクローズドソースのパッケージを見つけ、公開されている脆弱性とエクスプロイトに対して攻撃を実行します。

#### A10:2017-Insufficient Logging & Monitoring

_エピック:_

ログ記録と監視の不足の悪用は、ほぼすべての重大インシデントの基盤です。攻撃者は、検知されずに目的を達成するため、監視と適時対応の欠如に依存します。2016 年には、侵害の特定に[平均 191 日](https://www-01.ibm.com/common/ssi/cgi-bin/ssialias?htmlfid=SEL03130WWEN)かかり、被害が発生する大きな機会を与えていました。

_悪用ケース:_

攻撃者として、私は組織を攻撃し、ログ、監視システム、チームが私の攻撃を見たり対応したりしない状況を利用します。

## 図のソース

すべての図は <https://www.draw.io/> サイトを使用して作成され、この記事に統合するために (PNG 画像として) エクスポートされました。

各図のすべての XML 記述子ファイルは以下で入手できます (XML 記述を使用し、DRAW.IO サイトで図を変更できます)。

[Schemas descriptors archive](https://cheatsheetseries.owasp.org/assets/Abuse_Case_Cheat_Sheet_SchemaBundle.zip)

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V2.1, V2.3, V14.1, V15.1 | 悪用ケースの定義、リスク評価、ビジネスロジック攻撃、受け入れ基準、実装時の追跡と検証 |
