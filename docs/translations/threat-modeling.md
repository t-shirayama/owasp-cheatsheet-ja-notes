# 脅威モデリングチートシート 日本語訳

## Attribution

- Original: Threat Modeling Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-21

## 日本語訳

## Introduction

脅威モデリングは、現代のアプリケーション開発者が理解すべき重要な概念です。このチートシートの目的は、脅威モデリングを初めて学ぶ人にも、復習したい人にも役立つ、簡潔で実践可能なリファレンスを提供することです。OWASP の [Threat Modeling project](https://owasp.org/www-project-threat-modeling/) では、脅威モデリングのさまざまな側面についてさらに詳しい情報を提供しています。

## Overview

アプリケーションセキュリティの文脈では、脅威モデリングは、特定のシステムのセキュリティ特性について実行可能な洞察を得るために使われる、構造化され反復可能なプロセスです。これには、セキュリティの観点からシステムをモデル化し、そのモデルに基づいて適用可能な脅威を特定し、それらの脅威への対応を決定することが含まれます。脅威モデリングは、攻撃者がシステムを悪用できる方法に焦点を当て、敵対者の観点からシステムを分析します。

脅威モデリングは、設計フェーズなど SDLC の早い段階で実施することが理想的です。さらに、一度実施して終わりにするものではありません。脅威モデルは、システムと並行して保守、更新、改善されるべきものです。理想的には、脅威モデリングはチームの通常の SDLC プロセスに自然に統合されるべきです。プロセスへの追加作業ではなく、標準的で必要なステップとして扱うべきです。

[Threat Modeling Manifesto](https://www.threatmodelingmanifesto.org/) によると、脅威モデリングプロセスは次の四つの問いに答えるべきです。

1. 何に取り組んでいるのか。
2. 何がうまくいかない可能性があるのか。
3. それに対して何をするのか。
4. 十分に良い仕事をしたのか。

これら四つの問いは、以下で説明する四つの主要フェーズの基礎になります。

## Advantages

プロセスの概要に入る前に、「なぜ脅威モデリングをするのか」という問いに触れておく価値があるかもしれません。なぜ開発プロセスにさらに作業を追加するのでしょうか。どのような利点があるのでしょうか。以下のセクションでは、これらの問いへの答えを簡単に説明します。

### Identify Risks Early On

脅威モデリングは、設計フェーズ中に潜在的なセキュリティ問題を特定しようとするものです。これにより、セキュリティをシステムに「後付け」するのではなく「組み込む」ことができます。これは、システムが本番稼働した後にセキュリティ欠陥を特定して解決するよりも、はるかに効率的です。

### Increased Security Awareness

適切な脅威モデリングでは、参加者が特定のアプリケーションのセキュリティと脅威の状況について、創造的かつ批判的に考える必要があります。参加者に「攻撃者のように考える」ことを促し、一般的なセキュリティ知識を特定の文脈に適用させます。脅威モデリングは通常チームで行う作業でもあり、メンバーはアイデアを共有し、他者の意見にフィードバックすることを奨励されます。全体として、脅威モデリングは参加者に利益をもたらす、非常に教育的な活動になり得ます。

### Improved Visibility of Target of Evaluation (TOE)

脅威モデリングには、評価対象システムについての深い理解が必要です。適切に脅威モデリングを行うには、データフロー、信頼境界、その他のシステム特性を理解しなければなりません。したがって、システムとその相互作用への可視性が向上することは、脅威モデリングの利点の一つです。

## Addressing Each Question

脅威モデリングプロセスについて、業界で普遍的に受け入れられた標準はなく、すべてのユースケースに対する「正しい」答えもありません。しかし、この多様性にもかかわらず、多くのアプローチは何らかの形でシステムモデリング、脅威の特定、リスク対応のプロセスを含んでいます。これらの共通点に着想を得て、前述した脅威モデリングの四つの主要な問いを手引きとして、このチートシートでは脅威モデリングを、アプリケーション分解、脅威の特定とランク付け、緩和策、レビューと検証という四つの基本ステップに分けます。PASTA や OCTAVE など、この流れとはあまり一致しないプロセスもあり、それぞれに熱心な支持者がいます。

### System Modeling

システムモデリングのステップは、「何を構築しているのか」という問いに答えることを目的とします。システムを理解しなければ、そのシステムに最も適用される脅威を本当に理解することはできません。そのため、このステップは後続の活動に不可欠な土台を提供します。脅威モデリングのこの最初のステップではさまざまな技法を使えますが、データフロー図 (DFD) はおそらく最も一般的なアプローチです。

DFD により、システムと、データや他のエンティティとの相互作用を視覚的にモデル化できます。DFD は、[少数の単純な記号](https://github.com/adamshostack/DFD3)を使って作成します。DFD は [OWASP's Threat Dragon](https://github.com/OWASP/threat-dragon) や [Microsoft's Threat Modeling Tool](https://learn.microsoft.com/en-us/azure/security/develop/threat-modeling-tool) などの専用の脅威モデリングツールで作成することも、[draw.io](https://draw.io) などの汎用作図ソリューションで作成することもできます。as-code のアプローチを好む場合は、[OWASP's pytm](https://owasp.org/www-project-pytm/) が役立ちます。モデル化するシステムの規模と複雑さによっては、複数の DFD が必要になる場合があります。たとえば、システム全体の高レベル概要を表す DFD と、サブシステムを詳述する複数のより焦点を絞った DFD を作成できます。技術的なツールは厳密には必須ではありません。場合によってはホワイトボードで十分かもしれませんが、必要に応じて簡単に保存、参照、更新できる形式で DFD を持つことが望ましいです。

DFD または同等のモデルをどのように生成するかにかかわらず、そのソリューションが、信頼境界、データフロー、データストア、プロセス、そしてシステムとやり取りする可能性のある外部エンティティを明確に示すことが重要です。これらは多くの場合、攻撃可能なポイントを表し、後続のステップに不可欠な入力を提供します。

データフロー図 (DFD) に対する別のアプローチとして、ブレインストーミング技法があります。これは、アイデアを生み出し、プロジェクトのドメインを発見するための効果的な方法です。この文脈でブレインストーミングを適用すると、チームの関与の向上、知識と用語の統一、ドメインに対する共通理解、主要なプロセスと依存関係の迅速な特定など、多くの利点が得られます。ブレインストーミングを使う主な理由の一つは、ビジネスロジックを含むほぼあらゆるシナリオに対する柔軟性と適応性です。さらに、この技法は、技術的でない人がセッションに参加する場合に特に有用です。DFD モデルの構成要素やその正しさを理解し適用することに関連する障壁を取り除けるためです。

ブレインストーミングはすべての参加者を巻き込み、より良いコミュニケーションと問題に対する相互理解を促進します。すべてのチームメンバーに貢献の機会があり、責任感と関与が高まります。ブレインストーミングセッションでは、参加者が共同で主要な用語や概念を定義し合意でき、プロジェクトで使われる言語の統一につながります。これは、異なるチームが用語に対して異なるアプローチを持つ可能性のある複雑なプロジェクトでは特に重要です。ブレインストーミングの動的な性質により、チームは主要なビジネスプロセスとそれらの相互関係を素早く特定できます。

ブレインストーミングの結果を正式なモデリング技法と統合することで、ドメインの理解と、より効果的なシステム設計につながります。

### Cloud Threat Modeling

現代のシステムの多くは、クラウドネイティブまたはハイブリッドです。STRIDE や DFD のような従来の脅威モデリング技法は、次のような要素を導入するクラウドアーキテクチャに合わせて調整が必要になることがよくあります。

- 共有責任モデル
- マネージドサービスと API
- マルチテナントと ID フェデレーションに関する考慮事項
- 動的インフラストラクチャ (IaC、サーバーレス、コンテナ)

クラウドネイティブシステムは、分散型でサービス指向の性質と共有責任モデルにより、脅威モデリングに固有の考慮事項をもたらします。この文脈では、脅威モデリングプロセスは次の点を考慮すべきです。

- **クラウドアーキテクチャコンポーネント:** 仮想ネットワーク、IAM ロール、マネージドサービス、ストレージバケット。
- **共有責任:** どのセキュリティコントロールがプロバイダーによって管理され、どれが顧客によって管理されるかを理解すること。
- **動的環境:** コンテナオーケストレーション、サーバーレス関数、一時的なインフラストラクチャ。
- **コンプライアンスとデータレジデンシー:** ワークロードが管轄区域とプライバシーの要件を満たしていることを確認すること。

AWS の [Well-Architected Framework – Security Pillar](https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/welcome.html) などのクラウド脅威モデリングフレームワークは、参考資料として役立ちます。

### Threat Identification

システムをモデル化した後は、「何がうまくいかない可能性があるのか」という問いに取り組む段階です。この問いは、最初のステップから得た入力を念頭に置いて検討しなければなりません。つまり、評価対象の特定システムの文脈で、脅威を特定しランク付けすることに焦点を当てるべきです。この問いに答えるにあたり、脅威モデリングの実施者は豊富なデータソースと技法を利用できます。説明のため、このチートシートでは STRIDE を利用しますが、実際には STRIDE と併用して、または STRIDE の代わりに、他のアプローチを使うこともあります。

STRIDE は、Microsoft の従業員によって最初に開発された、成熟した一般的な脅威モデリング技法であり記憶法です。脅威の特定を容易にするため、STRIDE は脅威を六つの一般的なプロンプトの一つに分類し、エンジニアに対して、これらの一般的な脅威が評価対象の特定システムの文脈でどのように具体化し得るかを体系的に検討するよう促します。それぞれの STRIDE 脅威は、望ましいセキュリティ属性への違反と考えることができます。カテゴリと関連する望ましい属性は次のとおりです。

| Threat Category | Violates | Examples |
| --- | --- | --- |
| **S**poofing | Authentication | 攻撃者が正規ユーザーの認証トークンを盗み、そのユーザーになりすますために使用する。 |
| **T**ampering | Integrity | 攻撃者がアプリケーションを悪用して、データベースに意図しない更新を実行する。 |
| **R**epudiation | Accounting | 攻撃者が自分の行為を隠すためにログを操作する。 |
| **I**nformation Disclosure | Confidentiality | 攻撃者がユーザーアカウント情報を含むデータベースからデータを抽出する。 |
| **D**enial of Service | Availability | 攻撃者が多数の認証失敗を発生させ、正規ユーザーをアカウントから締め出す。 |
| **E**levation of Privileges | Authorization | 攻撃者が JWT を改ざんしてロールを変更する。 |

STRIDE は、「何がうまくいかない可能性があるのか」という問いに答えるための有用な構造を提供します。また、非常に柔軟なアプローチであり、始めるにあたって複雑である必要はありません。ブレインストーミングやホワイトボード、さらには[ゲーム](https://github.com/adamshostack/eop/)のような単純な技法を最初に使うこともできます。STRIDE は、[OWASP's Threat Dragon](https://github.com/OWASP/threat-dragon) や [Microsoft's Threat Modeling Tool](https://learn.microsoft.com/en-us/azure/security/develop/threat-modeling-tool) などの一般的な脅威モデリングツールにも組み込まれています。さらに、STRIDE は比較的高レベルのプロセスであるため、キルチェーンや [MITRE's ATT&CK](https://attack.mitre.org/) などのより戦術的なアプローチともよく組み合わせられます。STRIDE と ATT&CK がどのように連携できるかの概要については、[この記事](https://web.isc2ncrchapter.org/under-attck-how-mitres-methodology-to-find-threats-and-embed-counter-measures-might-work-in-your-organization/)を参照してください。

考えられる脅威を特定した後、多くの場合、人々はそれらをランク付けします。理論上、ランク付けは特定された脅威の発生可能性と影響度の数学的な積に基づくべきです。発生する可能性が高く、深刻な損害をもたらす脅威は、発生可能性が低く中程度の影響しかない脅威よりもはるかに高く優先されます。しかし、これらはどちらも算出が難しい場合があり、問題を修正するための作業量を無視しています。それを単一の優先順位付けに含めることを提唱する人もいます。

### Response and Mitigations

システムと適用可能な脅威の両方を理解したら、次は「それに対して何をするのか」に答える段階です。先に特定した各脅威には対応が必要です。脅威対応はリスク対応に似ていますが、同一ではありません。[Adam Shostack](https://shostack.org/resources/threat-modeling) は次の対応を挙げています。

- **Mitigate:** 脅威が現実化する可能性を下げるための行動を取る。
- **Eliminate:** 脅威の原因となっている機能またはコンポーネントを単純に取り除く。
- **Transfer:** 顧客など別の主体へ責任を移転する。
- **Accept:** ビジネス要件や制約を考えると上記の選択肢が受け入れられないため、リスクを緩和、排除、移転しない。

脅威を緩和すると決めた場合、緩和戦略を要件として策定し文書化しなければなりません。システムの複雑さ、特定された脅威の性質、脅威の特定に使ったプロセス (STRIDE または別の方法) によっては、緩和対応をカテゴリ単位または個別の脅威単位で適用できます。前者の場合、緩和策はそのカテゴリ内のすべての脅威に適用されます。緩和戦略は仮説的なものではなく実行可能でなければなりません。開発中のシステムに実際に組み込めるものでなければなりません。緩和戦略は特定のアプリケーションに合わせて調整する必要がありますが、[OWASP's ASVS](https://owasp.org/www-project-application-security-verification-standard/) や [MITRE's CWE list](https://cwe.mitre.org/index.html) などのリソースは、これらの対応を策定する際に有用です。

### Review and Validation

最後に、「十分に良い仕事をしたのか」という問いに答える段階です。脅威モデルは、開発チームやセキュリティチームだけでなく、すべてのステークホルダーによってレビューされなければなりません。注目すべき領域は次のとおりです。

- DFD または同等のものはシステムを正確に反映しているか。
- すべての脅威が特定されているか。
- 特定された各脅威について、対応戦略に合意しているか。
- 緩和が望ましい対応であるとされた脅威について、リスクを許容可能なレベルまで下げる緩和戦略が策定されているか。
- 脅威モデルは正式に文書化されているか。脅威モデリングプロセスの成果物は、「知る必要がある」人がアクセスできる形で保存されているか。
- 合意された緩和策はテスト可能か。脅威モデルから得られた要件と推奨事項の成功または失敗を測定できるか。

## Threat Modeling and the Development Team

### Challenges

脅威モデリングは、いくつかの主要な理由により、開発チームにとって困難になることがあります。第一に、多くの開発者はセキュリティ分野で十分な知識と経験を持っておらず、そのため方法論やフレームワークを効果的に使い、脅威を特定しモデル化する能力が妨げられます。基本的なセキュリティ原則について適切なトレーニングと理解がなければ、開発者は潜在的な脅威を見落としたり、そのリスクを誤って評価したりする可能性があります。

さらに、脅威モデリングプロセスは複雑で時間がかかる場合があります。体系的なアプローチと詳細な分析が必要であり、厳しいスケジュールや新機能提供へのプレッシャーと両立させることが難しいことがよくあります。開発チームは、この作業を支援するツールやリソースの不足を感じ、それが不満や意欲低下につながることがあります。

もう一つの課題は、組織内の異なる部門間のコミュニケーションと協働です。開発チーム、セキュリティチーム、その他のステークホルダーの間に効果的なコミュニケーションがなければ、脅威モデリングは不完全になったり、誤った方向に進んだりする可能性があります。

### Addressing the Challenges

多くの場合、解決策はセキュリティチームのメンバーを脅威モデリングセッションに招くことにあり、それによりプロセスを大きく改善できます。セキュリティ専門家は、効果的な特定、リスク分析、緩和に不可欠な潜在的脅威に関する重要な知識を持ち込みます。サイバー犯罪者が使う最新の傾向と技法に関する経験と理解は、開発チームの学習と能力開発に重要な洞察を提供できます。このような共同セッションは、開発者の知識を高めるだけでなく、組織内に協働と相互支援の文化を築き、より包括的なセキュリティアプローチにつながります。

現在の状況を変えるため、組織は開発チーム向けの定期的な IT セキュリティトレーニングに投資すべきです。これらのトレーニングセッションは専門家が実施し、チーム固有のニーズに合わせて調整すべきです。さらに、脅威モデリングを簡素化し自動化するプロセスとツールを導入することも有益です。これらのツールは脅威の特定と評価を支援し、プロセスをより利用しやすく、時間のかからないものにできます。

また、脅威モデリングが追加の負担ではなく、ソフトウェア開発ライフサイクル (SDLC) の不可欠な一部と見なされるように、組織全体でセキュリティ文化を促進することも重要です。定期的なレビューセッションとチーム横断ワークショップは、協働とコミュニケーションを改善し、より効果的で包括的なセキュリティアプローチにつながります。これらの取り組みにより、組織は脅威モデリングを負担の少ない、より効率的なプロセスにでき、システムのセキュリティに実質的な利益をもたらせます。

## References

### Methods and Techniques

An alphabetical list of techniques:

- [LINDDUN](https://linddun.org/)
- [PASTA](https://cdn2.hubspot.net/hubfs/4598121/Content%20PDFs/VerSprite-PASTA-Threat-Modeling-Process-for-Attack-Simulation-Threat-Analysis.pdf)
- [STRIDE](<https://learn.microsoft.com/en-us/previous-versions/commerce-server/ee823878%28v=cs.20%29?redirectedfrom=MSDN>)
- [OCTAVE](https://insights.sei.cmu.edu/library/introduction-to-the-octave-approach/)
- [VAST](https://go.threatmodeler.com/vast-methodology-data-sheet)

### Tools

- [Cairis](https://github.com/cairis-platform/cairis)
- [draw.io](https://draw.io) - see also [threat modeling libraries](https://github.com/michenriksen/drawio-threatmodeling) for the tool
- [IriusRisk](https://www.iriusrisk.com/) - offers a free Community Edition
- [Microsoft Threat Modeling Tool](https://learn.microsoft.com/en-us/azure/security/develop/threat-modeling-tool)
- [OWASP's Threat Dragon](https://github.com/OWASP/threat-dragon)
- [OWASP's pytm](https://owasp.org/www-project-pytm/)
- [TaaC-AI](https://github.com/yevh/TaaC-AI) - AI-driven Threat modeling-as-a-Code (TaaC)
- Threat Composer - [Demo](https://awslabs.github.io/threat-composer), [Repository](https://github.com/awslabs/threat-composer/)

### General Reference

- [Awesome Threat Modeling](https://github.com/hysnsec/awesome-threat-modelling) - resource list
- [Tactical Threat Modeling](https://safecode.org/wp-content/uploads/2017/05/SAFECode_TM_Whitepaper.pdf)
- [Threat Modeling: A Summary of Available Methods](https://insights.sei.cmu.edu/library/threat-modeling-a-summary-of-available-methods/)
- Threat modeling for builders, free online training available on [AWS SkillBuilder](https://explore.skillbuilder.aws/learn/course/external/view/elearning/13274/threat-modeling-for-builders-workshop), and [AWS Workshop Studio](https://catalog.workshops.aws/threatmodel/en-US)
- [Threat Modeling Handbook](https://security.cms.gov/policy-guidance/threat-modeling-handbook)
- [Threat Modeling Process](https://owasp.org/www-community/Threat_Modeling_Process)
- [The Ultimate Beginner's Guide to Threat Modeling](https://shostack.org/resources/threat-modeling)

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V15.1 | 脅威モデリング、システムモデリング、データフロー、信頼境界、脅威の特定、緩和策、レビューと検証 |
| V1.1 | セキュアな設計、アーキテクチャレビュー、リスク対応、ステークホルダーによる検証 |
