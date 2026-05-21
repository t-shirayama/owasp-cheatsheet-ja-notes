# 脆弱な依存関係管理チートシート 日本語訳

## Attribution

- Original: Vulnerable Dependency Management Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Vulnerable_Dependency_Management_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-21

## 日本語訳

# 脆弱な依存関係管理チートシート

## はじめに

このチートシートの目的は、脆弱なサードパーティ依存関係が検出された場合に、状況に応じてどのように扱うかについて、取り得るアプローチ案を示すことです。

このチートシートはツール中心ではありませんが、対象技術へのサポート状況に応じて、脆弱な依存関係を検出するために利用できる無料および商用ソリューションを読者に知らせる[ツール](#ツール)セクションを含んでいます。

**注:**

このチートシートで述べる提案は、あらゆる状況で機能する万能薬ではありませんが、自分たちのコンテキストに合わせて適応させるための土台として利用できます。

## コンテキスト

ほとんどのプロジェクトは、特定形式の文書生成、HTTP 通信、特定形式のデータ解析など、さまざまな種類の処理を委ねるためにサードパーティ依存関係を利用しています。

これは、開発チームが期待されるビジネス機能を支える実際のアプリケーションコードに集中できるため、よいアプローチです。一方で、その依存関係により、実際のアプリケーションのセキュリティ態勢が依存先にも左右されるという期待される欠点が生じます。

この側面は、以下のプロジェクトで参照されています。

- [OWASP TOP 10 2017](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/) の _[A9 - Using Components with Known Vulnerabilities](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A9-Using_Components_with_Known_Vulnerabilities.html)_。
- [OWASP Application Security Verification Standard Project](https://owasp.org/www-project-application-security-verification-standard/) の _V14.2 Dependency_ セクション。

このコンテキストに基づくと、プロジェクトでは、実装しているすべてのサードパーティ依存関係にセキュリティ上の問題がないことを確保することが重要です。また、セキュリティ上の問題を含む場合には、開発チームがそれを認識し、影響を受けるアプリケーションを保護するために必要な緩和策を適用する必要があります。

依存関係の自動分析は、プロジェクトの開始時から実施することが強く推奨されます。実際、この作業をプロジェクトの途中や終盤で追加すると、特定されたすべての問題を処理するために膨大な作業が必要になる可能性があります。その結果、開発チームに大きな負担がかかり、対象プロジェクトの進行を妨げることにもなり得ます。

**注:**

このチートシートの残りの部分で _開発チーム_ と言う場合、そのチームには必要なアプリケーションセキュリティスキルを持つメンバーがいるか、依存関係に影響する脆弱性を分析するために、社内のそのようなスキルを持つ人に相談できるものとします。

## 検出に関する注意

セキュリティ上の問題が発見された後に、それが扱われるさまざまな方法を念頭に置くことが重要です。

### 1. 責任ある開示

説明は[こちら](https://en.wikipedia.org/wiki/Responsible_disclosure)を参照してください。

研究者がコンポーネントの脆弱性を発見し、コンポーネント提供者との協力の後、その問題に関連する [CVE](https://en.wikipedia.org/wiki/Common_Vulnerabilities_and_Exposures) を発行します。提供者固有の脆弱性識別子が作成されることもありますが、一般的には CVE 識別子が好まれます。これにより、問題と利用可能な修正または緩和策を公開参照できるようになります。

提供者が研究者に適切に協力しない場合、以下の結果が想定されます。

- CVE はベンダーに受け入れられるものの、提供者が[問題の修正を拒否する](https://www.excellium-services.com/cert-xlm-advisory/cve-2019-7161/)。
- 多くの場合、研究者が 30 日以内に返信を受け取れない場合、その脆弱性を[完全開示](#2-完全開示)します。

この場合、脆弱性は常に [CVE グローバルデータベース](https://nvd.nist.gov/vuln/data-feeds)で参照されます。一般に、検出ツールはこのデータベースを複数の入力ソースの一つとして使用します。

### 2. 完全開示

説明は[こちら](https://en.wikipedia.org/wiki/Full_disclosure)の **Computer Security** に関する **Computers** セクションを参照してください。

研究者は、悪用コードや悪用方法を含むすべての情報を、[Full Disclosure mailing list](https://seclists.org/fulldisclosure/) や [Exploit-DB](https://www.exploit-db.com) などのサービスで公開することを決定します。

この場合、CVE が常に作成されるとは限りません。そのため、脆弱性が CVE グローバルデータベースに常に存在するとは限らず、検出ツールが他の入力ソースを利用していない限り、その脆弱性を見落とす可能性があります。

## セキュリティ上の問題の扱いに関する意思決定の注意

セキュリティ上の問題が検出された場合、その問題が表すリスクを受容する判断も可能です。ただし、この判断は、問題を分析した開発チームからの技術的フィードバック（_[ケース](#ケース)_ セクションを参照）および CVE の [CVSS](https://www.first.org/cvss/user-guide) スコア指標に基づき、企業の [Chief Risk Officer](https://en.wikipedia.org/wiki/Chief_risk_officer)（代替として [Chief Information Security Officer](https://en.wikipedia.org/wiki/Chief_information_security_officer) も可）が行わなければなりません。

## ケース

セキュリティ上の問題が検出された場合、開発チームは以下のサブセクションで示すいずれかの状況（このチートシートの残りの部分では _ケース_ と呼びます）に直面する可能性があります。

脆弱性が[推移的依存関係](https://en.wikipedia.org/wiki/Transitive_dependency)に影響する場合、アクションはプロジェクトの直接依存関係に対して行います。推移的依存関係に直接手を入れると、アプリケーションの安定性に影響することが多いためです。

推移的依存関係に対処するには、プロジェクトの第一階層の依存関係からセキュリティ脆弱性の影響を受ける依存関係までの完全な関係、通信、使用状況を開発チームが十分に理解する必要があり、この作業は非常に時間がかかります。

### ケース 1

#### コンテキスト

コンポーネントの修正済みバージョンが提供者からリリースされています。

#### このアプローチを適用する理想的な条件

影響を受ける依存関係を使用するアプリケーション機能について、自動化されたユニットテスト、統合テスト、機能テスト、またはセキュリティテストのセットが存在し、その機能が動作することを検証できる状態です。

#### アプローチ

**ステップ 1:**

テスト環境で、プロジェクト内の依存関係のバージョンを更新します。

**ステップ 2:**

テスト実行後には、2 つの結果の道筋が考えられます。

- すべてのテストが成功した場合、更新を本番環境へ反映できます。
- 1 つまたは複数のテストが失敗した場合、複数の結果の道筋が考えられます。
    - 失敗の原因が、一部の関数呼び出しの変更（例: シグネチャ、引数、パッケージなど）である場合。開発チームは新しいライブラリに合わせて自分たちのコードを更新しなければなりません。それが完了したら、テストを再実行します。
    - リリースされた依存関係に技術的な非互換性（例: より新しいランタイムバージョンが必要）がある場合、以下のアクションにつながります。
    1. 提供者に問題を報告します。
    2. 提供者からのフィードバックを待つ間、[ケース 2](#ケース-2)を適用します。

### ケース 2

#### コンテキスト

提供者から、問題の修正には時間がかかるため、修正済みバージョンは数か月利用できないと通知されています。

#### このアプローチを適用する理想的な条件

提供者が、以下のいずれかを開発チームに共有できます。

- 悪用コード。
- 脆弱性の影響を受ける関数の一覧。
- 問題の悪用を防ぐための回避策。

#### アプローチ

**ステップ 1:**

回避策が提供されている場合は、テスト環境で適用および検証し、その後本番環境にデプロイします。

提供者が影響を受ける関数の一覧をチームに提供している場合、入力データと出力データが安全であることを確保するため、それらの関数への呼び出しを保護コードで包む必要があります。

さらに、Web Application Firewall (WAF) などのセキュリティ機器は、パラメータ検証によって内部アプリケーションを保護し、特定ライブラリ向けの検出ルールを生成することで、このような問題に対処できます。ただし、このチートシートでは、できるだけ発生源に近い場所で脆弱性を修正するため、アプリケーションレベルに焦点を当てます。

_影響を受ける関数に [Remote Code Execution](https://www.netsparker.com/blog/web-security/remote-code-evaluation-execution/) の問題がある Java コードの例:_

```java
public void callFunctionWithRCEIssue(String externalInput){
    //Apply input validation on the external input using regex
    if(Pattern.matches("[a-zA-Z0-9]{1,50}", externalInput)){
        //Call the flawed function using safe input
        functionWithRCEIssue(externalInput);
    }else{
        //Log the detection of exploitation
        SecurityLogger.warn("Exploitation of the RCE issue XXXXX detected !");
        //Raise an exception leading to a generic error send to the client...
    }
}
```text

提供者が脆弱性について何も提供していない場合、このケースの _ステップ 2_ をスキップして[ケース 3](#ケース-3)を適用できます。ここでは、少なくとも [CVE](https://en.wikipedia.org/wiki/Common_Vulnerabilities_and_Exposures) は提供されているものとします。

**ステップ 2:**

提供者が悪用コードをチームに提供しており、チームが脆弱なライブラリまたはコードの周囲にセキュリティラッパーを作成した場合、その悪用コードを実行して、ライブラリが安全になっており、アプリケーションに影響しないことを確認します。

アプリケーションに対して自動化されたユニットテスト、統合テスト、機能テスト、またはセキュリティテストのセットが存在する場合は、それらを実行し、追加した保護コードがアプリケーションの安定性に影響しないことを検証します。

修正済みバージョンを待っている間、その問題（関連する [CVE](https://en.wikipedia.org/wiki/Common_Vulnerabilities_and_Exposures) を明記）が扱われていることをプロジェクトの _README_ にコメントとして追加します。検出ツールは、この依存関係について引き続きアラートを出すためです。

**注:** 依存関係を無視リストに追加することもできますが、この依存関係に対する無視範囲は、その脆弱性に関連する [CVE](https://en.wikipedia.org/wiki/Common_Vulnerabilities_and_Exposures) のみに限定しなければなりません。1 つの依存関係は複数の脆弱性の影響を受ける可能性があり、それぞれが独自の [CVE](https://en.wikipedia.org/wiki/Common_Vulnerabilities_and_Exposures) を持つためです。

### ケース 3

#### コンテキスト

提供者から、問題を修正できないため、修正済みバージョンは一切リリースされないと通知されています（提供者が問題を修正したくない場合や、まったく応答しない場合にも適用されます）。

このケースでは、開発チームに与えられる唯一の情報は [CVE](https://en.wikipedia.org/wiki/Common_Vulnerabilities_and_Exposures) です。

**注:**

- このケースは非常に複雑で時間がかかるため、一般的には最後の手段として使用されます。
- 影響を受ける依存関係がオープンソースライブラリである場合、私たち開発チームはパッチを作成し、[pull request](https://help.github.com/en/articles/about-pull-requests) を作成できます。これにより、自社や自社アプリケーションを発生源から保護できるだけでなく、他者のアプリケーション保護にも貢献できます。

#### このアプローチを適用する理想的な条件

ここでは自分たちでパッチを当てる状況であるため、特定の条件はありません。

#### アプローチ

**ステップ 1:**

以下のいずれかの条件によってこのケースに該当している場合、よりよく保守されている別コンポーネントを探すための並行調査を始めることはよい考えです。また、サポート付きの商用コンポーネントである場合は、[Chief Risk Officer](https://en.wikipedia.org/wiki/Chief_risk_officer)（代替として [Chief Information Security Officer](https://en.wikipedia.org/wiki/Chief_information_security_officer) も可）の助けを借りて、提供者に**圧力をかけます**。

- 提供者が問題を修正したくない。
- 提供者がまったく応答しない。

いずれの場合でも、ここでは今すぐ脆弱性に対処する必要があります。

**ステップ 2:**

脆弱な依存関係が分かっているため、アプリケーション内でそれがどこで使われているかも分かります。推移的依存関係である場合は、[IDE](https://en.wikipedia.org/wiki/Integrated_development_environment) の組み込み機能、または使用している依存関係管理システム（Maven、Gradle、NuGet、npm など）を使って、それを使用している第一階層の依存関係を特定できます。なお、IDE は依存関係への呼び出しを特定するためにも使用されます。

この依存関係への呼び出しを特定することは有用ですが、それは最初のステップにすぎません。チームには、どのような種類のパッチを適用する必要があるかという情報がまだ不足しています。

この情報を得るために、チームは CVE の内容を使い、その依存関係にどの種類の脆弱性が影響しているかを把握します。`description` プロパティが答えを提供します。たとえば、SQL injection、Remote Code Execution、Cross-Site Scripting、Cross-Site Request Forgery などです。

上記 2 点を特定した後、チームは必要なパッチの種類（保護コードを使う[ケース 2](#ケース-2)）と、それを追加する場所を把握できます。

_例:_

チームは、[CVE-2016-3720](https://nvd.nist.gov/vuln/detail/CVE-2016-3720) にさらされているバージョンの Jackson API を使用するアプリケーションを持っています。

CVE の説明は以下のとおりです。

```text
XML external entity (XXE) vulnerability in XmlMapper in the Data format extension for Jackson
(aka jackson-dataformat-xml) allows attackers to have unspecified impact via unknown vectors.
```

この情報に基づき、チームは必要なパッチが、Jackson API に渡されるあらゆる XML データに対して[事前検証](https://cheatsheetseries.owasp.org/cheatsheets/XML_External_Entity_Prevention_Cheat_Sheet.html)を追加し、[XML external entity (XXE)](https://www.acunetix.com/blog/articles/xml-external-entity-xxe-vulnerabilities/) 脆弱性を防ぐことであると判断します。

**ステップ 3:**

可能であれば、パッチが有効であることを確認し、プロジェクトの進化の中でパッチが存在し続けていることを継続的に確認する手段を持つために、その脆弱性を模倣するユニットテストを作成します。

アプリケーションに対して自動化されたユニットテスト、統合テスト、機能テスト、またはセキュリティテストのセットが存在する場合は、それらを実行し、パッチがアプリケーションの安定性に影響しないことを検証します。

### ケース 4

#### コンテキスト

提供者がその脆弱性を認識していない状況で、以下のいずれかによって脆弱な依存関係が見つかります。

- インターネット上の完全開示投稿の発見。
- ペネトレーションテスト中。

#### このアプローチを適用する理想的な条件

脆弱性を通知した後、提供者があなたと協力します。

#### アプローチ

**ステップ 1:**

その投稿を共有して、提供者に脆弱性を知らせます。

**ステップ 2:**

完全開示投稿またはペネトレーションテスターの悪用フィードバックから得た情報を使います。提供者が協力する場合は[ケース 2](#ケース-2)を適用し、協力しない場合は[ケース 3](#ケース-3)を適用します。また、CVE 情報を分析する代わりに、完全開示投稿またはペネトレーションテスターの悪用フィードバックから得た情報をチームが分析する必要があります。

## ツール

このセクションでは、脆弱性を検出するために、プロジェクトで使用している依存関係を分析できるいくつかのツールを示します。

脆弱な依存関係検出ツールを選定する際には、そのツールが以下を満たすことを確認することが重要です。

- 両方の脆弱性開示方法に対応するため、複数の信頼できる入力ソースを使用する。
- コンポーネントに対して提起された問題を[誤検知](https://www.whitehatsec.com/glossary/content/false-positive)としてフラグ付けできる。

- 無料
    - [OWASP Dependency Check](https://owasp.org/www-project-dependency-check/):
        - 完全サポート: Java、.Net。
        - 実験的サポート: Python、Ruby、PHP (composer)、NodeJS、C、C++。
    - [NPM Audit](https://docs.npmjs.com/cli/audit)
        - 完全サポート: NodeJS、JavaScript。
        - この[モジュール](https://www.npmjs.com/package/npm-audit-html)により HTML レポートを利用可能。
    - [OWASP Dependency Track](https://dependencytrack.org/) は、組織全体で脆弱な依存関係を管理するために利用できます。
    - [Trivy](https://github.com/aquasecurity/trivy)
        - 完全サポート: Base OS、Java、NodeJS、JavaScript、Ruby、Python、Go、.NET、Rust、PHP、Dart、Swift。
        - 対象: Kubernetes（ノードとコンテナ）、Docker（ノードとコンテナ）、ファイルシステム、Git リポジトリ、クラウドイメージ。
    - [Grype](https://github.com/anchore/grype)
        - SBOM 駆動のスキャンにより、主流の言語エコシステム全体を完全サポート。
        - 対象: コンテナイメージ、ファイルシステム、[Syft](https://github.com/anchore/syft) によって生成された SBOM。
- 商用
    - [Snyk](https://snyk.io/)（オープンソースおよび無料オプションあり）:
        - 多くの言語とパッケージマネージャに対する[完全サポート](https://snyk.io/docs/)。
    - [JFrog XRay](https://jfrog.com/xray/):
        - 多くの言語とパッケージマネージャに対する[完全サポート](https://jfrog.com/integration/)。
    - [Renovate](https://renovatebot.com)（古い依存関係を検出可能）:
        - 多くの言語とパッケージマネージャに対する[完全サポート](https://renovatebot.com/docs/)。
    - [Requires.io](https://requires.io/)（古い依存関係を検出可能。オープンソースおよび無料オプションあり）:
        - [完全サポート](https://requires.io/features/): Python のみ。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V15.2 | 依存関係の脆弱性検出、評価、更新、緩和 |
