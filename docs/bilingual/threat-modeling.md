---
title: Threat Modeling Cheat Sheet
hide_title: true
---

<div className="docHero" data-category="asvs-v15">
  <h1>脅威モデリングチートシート</h1>
  <div className="docMeta">
    <span className="docPill">最終更新: 2026-05-20</span>
    <span className="docPill">読了時間: 準備中</span>
    <span className="docPill">カテゴリ: セキュアコーディングとアーキテクチャ</span>
  </div>
</div>

<p className="docLead">脅威モデリングチートシートを、原文・翻訳・対比表示で確認できます。ASVS Index 対応の文脈で、公式原文と日本語訳を確認しやすく整理しています。</p>

<div className="tabbedContent">
  <input className="tabInput" type="radio" name="threat-modeling-view" id="threat-modeling-original" />
  <input className="tabInput" type="radio" name="threat-modeling-view" id="threat-modeling-translation" defaultChecked />
  <input className="tabInput" type="radio" name="threat-modeling-view" id="threat-modeling-bilingual" />

  <div className="contentTabs">
    <label htmlFor="threat-modeling-original" title="OWASP 原文">原文</label>
    <label htmlFor="threat-modeling-translation" title="日本語訳">翻訳</label>
    <label htmlFor="threat-modeling-bilingual" title="原文と翻訳を並べて確認">対比表示</label>
  </div>

<section id="threat-modeling-original-panel" className="tabPanel originalPanel contentPanel">

## Introduction

Threat modeling is an important concept for modern application developers to understand. The goal of this cheatsheet is to provide a concise, but actionable, reference for both those new to threat modeling and those seeking a refresher.
The OWASP [Threat Modeling project](https://owasp.org/www-project-threat-modeling/) provides further information on various aspects of threat modeling.

## Overview

In the context of application security, threat modeling is a structured, repeatable process used to gain actionable insights into the security characteristics of a particular system. It involves modeling a system from a security perspective, identifying applicable threats based on this model, and determining responses to these threats. Threat modeling analyzes a system from an adversarial perspective, focusing on ways in which an attacker can exploit a system.

Threat modeling is ideally performed early in the SDLC, such as during the design phase. Moreover, it is not something that is performed once and never again. A threat model is something that should be maintained, updated and refined alongside the system. Ideally, threat modeling should be integrated seamlessly into a team's normal SDLC process; it should be treated as standard and necessary step in the process, not an add-on.

According to the [Threat Modeling Manifesto](https://www.threatmodelingmanifesto.org/), the threat modeling process should answer the following four questions:

1. What are we working on?
2. What can go wrong?
3. What are we going to do about it?
4. Did we do a good enough job?

These four questions will act as the foundation for the four major phases described below.

## Advantages

Before turning to an overview of the process, it may be worth addressing the question: why threat model? Why bother adding more work to the development process? What are the benefits? The following section will briefly outline some answers to these questions.

### Identify Risks Early On

Threat modeling seeks to identify potential security issues during the design phase. This allows security to be "built-into" a system rather than "bolted-on". This is far more efficient than having to identify and resolve security flaws after a system is in production.

### Increased Security Awareness

Proper threat modeling requires participants to think creatively and critically about the security and threat landscape of a specific application. It challenges individuals to "think like an attacker" and apply general security knowledge to a specific context. Threat modeling is also typically a team effort with members being encouraged to share ideas and provide feedback on others. Overall, threat modeling can prove to be a highly educational activity that benefits participants.

### Improved Visibility of Target of Evaluation (TOE)

Threat modeling requires a deep understanding of the system being evaluated. To properly threat model, one must understand data flows, trust boundaries, and other characteristics of the system. Thus improved visibility into a system and its interactions is one advantage of threat modeling.

## Addressing Each Question

There is no universally accepted industry standard for the threat modeling process, no "right" answer for every use case. However, despite this diversity, most approaches do include the processes of system modeling, threat identification, and risk response in some form. Inspired by these commonalities and guided by the four key questions of threat modeling discussed above, this cheatsheet will break the threat modeling down into four basic steps: application decomposition, threat identification and ranking, mitigations, and review and validation. There are processes that are less aligned to this, including PASTA and OCTAVE, each of which has passionate advocates.

### System Modeling

The step of system modeling seeks to answer the question "what are we building"? Without understanding a system, one cannot truly understand what threats are most applicable to it; thus, this step provides a critical foundation for subsequent activities. Although different techniques may be used in this first step of threat modeling, data flow diagrams (DFDs) are arguably the most common approach.

DFDs allow one to visually model a system and its interactions with data and other entities; they are created using a [small number of simple symbols](https://github.com/adamshostack/DFD3). DFDs may be created within dedicated threat modeling tools such as [OWASP's Threat Dragon](https://github.com/OWASP/threat-dragon) or [Microsoft's Threat Modeling Tool](https://learn.microsoft.com/en-us/azure/security/develop/threat-modeling-tool) or using general purpose diagraming solutions such as [draw.io](https://draw.io). If you prefer an -as-code approach, [OWASP's pytm](https://owasp.org/www-project-pytm/) can help there. Depending on the scale and complexity of the system being modeled, multiple DFDs may be required. For example, one could create a DFD representing a high-level overview of the entire system along with a number of more focused DFDs which detail sub-systems. Technical tools are not strictly necessary; whiteboarding may be sufficient in some instances, though it is preferable to have the DFDs in a form that can be easily stored, referenced, and updated as needed.

Regardless of how a DFD or comparable model is generated, it is important that the solution provides a clear view of trust boundaries, data flows, data stores, processes, and the external entities which may interact with the system. These often represent possible attack points and provide crucial input for the subsequent steps.

Another approach to Data Flow Diagrams (DFD) could be the brainstorming technique, which is an effective method for generating ideas and discovering the project's domain. Applying brainstorming in this context can bring numerous benefits, such as increased team engagement, unification of knowledge and terminology, a shared understanding of the domain, and quick identification of key processes and dependencies. One of the main arguments for using brainstorming is its flexibility and adaptability to almost any scenario, including business logic. Additionally, this technique is particularly useful when less technical individuals participate in the session, as it eliminates barriers related to understanding and applying the components of DFD models and their correctness.

Brainstorming engages all participants, fostering better communication and mutual understanding of issues. Every team member has the opportunity to contribute, which increases the sense of responsibility and involvement. During a brainstorming session, participants can collaboratively define and agree on key terms and concepts, leading to a unified language used in the project. This is especially important in complex projects where different teams might have different approaches to terminology. Due to the dynamic nature of brainstorming, the team can quickly identify key business processes and their interrelations.

Integrating the results of brainstorming with formal modeling techniques can lead to a better understanding of the domain and more effective system design.

### Cloud Threat Modeling

Most modern systems are cloud-native or hybrid. Traditional threat modeling techniques (like STRIDE or DFDs) often need adaptation for cloud architectures, which introduce:

- Shared responsibility models
- Managed services and APIs
- Multi-tenant and identity federation considerations
- Dynamic infrastructure (IaC, serverless, containers)

Cloud-native systems introduce unique considerations for threat modeling due to their distributed, service-oriented nature and shared responsibility model. In this context, the threat modeling process should account for:

- **Cloud architecture components:** virtual networks, IAM roles, managed services, and storage buckets.
- **Shared responsibility:** understanding which security controls are managed by the provider vs. the customer.
- **Dynamic environments:** container orchestration, serverless functions, and ephemeral infrastructure.
- **Compliance and data residency:** ensuring that workloads meet jurisdictional and privacy requirements.

Cloud threat modeling frameworks such as AWS’s [Well-Architected Framework – Security Pillar](https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/welcome.html) can serve as references.

### Threat Identification

After the system has been modeled, it is now time to address the question of "what can go wrong?". This question must be explored with the inputs from the first step in mind; that is, it should focus on identifying and ranking threats within the context of the specific system being evaluated. In attempting to answer this question, threat modelers have a wealth of data sources and techniques at their disposal. For illustration purposes, this cheatsheet will leverage STRIDE; however, in practice, other approaches may be used alongside or instead of STRIDE.

STRIDE is a mature and popular threat modeling technique and mnemonic originally developed by Microsoft employees. To facilitate threat identification, STRIDE groups threats into one of six general prompts and engineers are encouraged to systematically consider how these general threats may materialize within the context of the specific system being evaluated. Each STRIDE threat may be considered a violation of a desirable security attribute; the categories and associated desirable attributes are as follows:

| Threat Category             | Violates          | Examples                                                                                                    |
| --------------------------- | ----------------- | ----------------------------------------------------------------------------------------------------------- |
| **S**poofing                | Authentication    | An attacker steals the authentication token of a legitimate user and uses it to impersonate the user.       |
| **T**ampering               | Integrity         | An attacker abuses the application to perform unintended updates to a database.                             |
| **R**epudiation             | Accounting        | An attacker manipulates logs to cover their actions.                                                        |
| **I**nformation Disclosure  | Confidentiality   | An attacker extracts data from a database containing user account info.                                     |
| **D**enial of Service       | Availability      | An attacker locks a legitimate user out of their account by performing many failed authentication attempts. |
| **E**levation of Privileges | Authorization     | An attacker tampers with a JWT to change their role.                                                        |

STRIDE provides valuable structure for responding to the question of "what can go wrong". It is also a highly flexible approach and getting started need not be complex. Simple techniques such as brainstorming and whiteboarding or even [games](https://github.com/adamshostack/eop/) may be used initially. STRIDE is also incorporated into popular threat modeling tools such as [OWASP's Threat Dragon](https://github.com/OWASP/threat-dragon) and [Microsoft's Threat Modeling Tool](https://learn.microsoft.com/en-us/azure/security/develop/threat-modeling-tool). Additionally, as a relatively high-level process, STRIDE pairs well with more tactical approaches such as kill chains or [MITRE's ATT&CK](https://attack.mitre.org/) (please refer to [this article](https://web.isc2ncrchapter.org/under-attck-how-mitres-methodology-to-find-threats-and-embed-counter-measures-might-work-in-your-organization/) for an overview of how STRIDE and ATT&CK can work together).

After possible threats have been identified, people will frequently rank them. In theory, ranking should be based on the mathematical product of an identified threat's likelihood and its impact. A threat that is likely to occur and result in serious damage would be prioritized much higher than one that is unlikely to occur and would only have a moderate impact. However, these both can be challenging to calculate, and they ignore the work to fix a problem. Some advocate for including that in a single prioritization.

### Response and Mitigations

Equipped with an understanding of both the system and applicable threats, it is now time to answer "what are we going to do about it"?. Each threat identified earlier must have a response. Threat responses are similar, but not identical, to risk responses. [Adam Shostack](https://shostack.org/resources/threat-modeling) lists the following responses:

- **Mitigate:** Take action to reduce the likelihood that the threat will materialize.
- **Eliminate:** Simply remove the feature or component that is causing the threat.
- **Transfer:** Shift responsibility to another entity such as the customer.
- **Accept:** Do not mitigate, eliminate, or transfer the risk because none of the above options are acceptable given business requirements or constraints.

If one decides to mitigate a threat, mitigation strategies must be formulated and documented as requirements. Depending on the complexity of the system, nature of threats identified, and the process used for identifying threats (STRIDE or another method), mitigation responses may be applied at either the category or individual threat level. In the former case, the mitigation would apply to all threats within that category. Mitigation strategies must be actionable not hypothetical; they must be something that can actually be built into to the system being developed. Although mitigation strategies must be tailored to the particular application, resources such as as [OWASP's ASVS](https://owasp.org/www-project-application-security-verification-standard/) and [MITRE's CWE list](https://cwe.mitre.org/index.html) can prove valuable when formulating these responses.

### Review and Validation

Finally, it is time to answer the question "did we do a good enough job"? The threat model must be reviewed by all stakeholders, not just the development or security teams. Areas to focus on include:

- Does the DFD (or comparable) accurately reflect the system?
- Have all threats been identified?
- For each identified threat, has a response strategy been agreed upon?
- For identified threats for which mitigation is the desired response, have mitigation strategies been developed which reduce risk to an acceptable level?
- Has the threat model been formally documented? Are artifacts from the threat model process stored in such a way that it can be accessed by those with "need to know"?
- Can the agreed upon mitigations be tested? Can success or failure of the requirements and recommendations from the threat model be measured?

## Threat Modeling and the Development Team

### Challenges

Threat modeling can be challenging for development teams for several key reasons. Firstly, many developers lack sufficient knowledge and experience in the field of security, which hinders their ability to effectively use methodologies and frameworks, identify, and model threats. Without proper training and understanding of basic security principles, developers may overlook potential threats or incorrectly assess their risks.

Additionally, the threat modeling process can be complex and time-consuming. It requires a systematic approach and in-depth analysis, which is often difficult to reconcile with tight schedules and the pressure to deliver new functionalities. Development teams may feel a lack of tools and resources to support them in this task, leading to frustration and discouragement.

Another challenge is the communication and collaboration between different departments within the organization. Without effective communication between development teams, security teams, and other stakeholders, threat modeling can be incomplete or misdirected.

### Addressing the Challenges

In many cases, the solution lies in inviting members of the security teams to threat modeling sessions, which can significantly improve the process. Security specialists bring essential knowledge about potential threats that is crucial for effective identification, risk analysis, and mitigation. Their experience and understanding of the latest trends and techniques used by cybercriminals can provide key insights for learning and developing the competencies of development teams. Such joint sessions not only enhance developers' knowledge but also build a culture of collaboration and mutual support within the organization, leading to a more comprehensive approach to security.

To change the current situation, organizations should invest in regular IT security training for their development teams. These training sessions should be conducted by experts and tailored to the specific needs of the team. Additionally, it is beneficial to implement processes and tools that simplify and automate threat modeling. These tools can help in identifying and assessing threats, making the process more accessible and less time-consuming.

It is also important to promote a culture of security throughout the organization, where threat modeling is seen as an integral part of the Software Development Life Cycle (SDLC), rather than an additional burden. Regular review sessions and cross-team workshops can improve collaboration and communication, leading to a more effective and comprehensive approach to security. Through these actions, organizations can make threat modeling a less burdensome and more efficient process, bringing real benefits to the security of their systems.

</section>

<section id="threat-modeling-translation-panel" className="tabPanel translationPanel contentPanel">

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

</section>

<section id="threat-modeling-bilingual-panel" className="tabPanel bilingualPanel">

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Introduction

Threat modeling is an important concept for modern application developers to understand. The goal of this cheatsheet is to provide a concise, but actionable, reference for both those new to threat modeling and those seeking a refresher.
The OWASP [Threat Modeling project](https://owasp.org/www-project-threat-modeling/) provides further information on various aspects of threat modeling.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## Introduction

脅威モデリングは、現代のアプリケーション開発者が理解すべき重要な概念です。このチートシートの目的は、脅威モデリングを初めて学ぶ人にも、復習したい人にも役立つ、簡潔で実践可能なリファレンスを提供することです。OWASP の [Threat Modeling project](https://owasp.org/www-project-threat-modeling/) では、脅威モデリングのさまざまな側面についてさらに詳しい情報を提供しています。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Overview

In the context of application security, threat modeling is a structured, repeatable process used to gain actionable insights into the security characteristics of a particular system. It involves modeling a system from a security perspective, identifying applicable threats based on this model, and determining responses to these threats. Threat modeling analyzes a system from an adversarial perspective, focusing on ways in which an attacker can exploit a system.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## Overview

アプリケーションセキュリティの文脈では、脅威モデリングは、特定のシステムのセキュリティ特性について実行可能な洞察を得るために使われる、構造化され反復可能なプロセスです。これには、セキュリティの観点からシステムをモデル化し、そのモデルに基づいて適用可能な脅威を特定し、それらの脅威への対応を決定することが含まれます。脅威モデリングは、攻撃者がシステムを悪用できる方法に焦点を当て、敵対者の観点からシステムを分析します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Threat modeling is ideally performed early in the SDLC, such as during the design phase. Moreover, it is not something that is performed once and never again. A threat model is something that should be maintained, updated and refined alongside the system. Ideally, threat modeling should be integrated seamlessly into a team's normal SDLC process; it should be treated as standard and necessary step in the process, not an add-on.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

脅威モデリングは、設計フェーズなど SDLC の早い段階で実施することが理想的です。さらに、一度実施して終わりにするものではありません。脅威モデルは、システムと並行して保守、更新、改善されるべきものです。理想的には、脅威モデリングはチームの通常の SDLC プロセスに自然に統合されるべきです。プロセスへの追加作業ではなく、標準的で必要なステップとして扱うべきです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

According to the [Threat Modeling Manifesto](https://www.threatmodelingmanifesto.org/), the threat modeling process should answer the following four questions:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

[Threat Modeling Manifesto](https://www.threatmodelingmanifesto.org/) によると、脅威モデリングプロセスは次の四つの問いに答えるべきです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

1. What are we working on?
2. What can go wrong?
3. What are we going to do about it?
4. Did we do a good enough job?

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

1. 何に取り組んでいるのか。
2. 何がうまくいかない可能性があるのか。
3. それに対して何をするのか。
4. 十分に良い仕事をしたのか。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

These four questions will act as the foundation for the four major phases described below.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

これら四つの問いは、以下で説明する四つの主要フェーズの基礎になります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Advantages

Before turning to an overview of the process, it may be worth addressing the question: why threat model? Why bother adding more work to the development process? What are the benefits? The following section will briefly outline some answers to these questions.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## Advantages

プロセスの概要に入る前に、「なぜ脅威モデリングをするのか」という問いに触れておく価値があるかもしれません。なぜ開発プロセスにさらに作業を追加するのでしょうか。どのような利点があるのでしょうか。以下のセクションでは、これらの問いへの答えを簡単に説明します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Identify Risks Early On

Threat modeling seeks to identify potential security issues during the design phase. This allows security to be "built-into" a system rather than "bolted-on". This is far more efficient than having to identify and resolve security flaws after a system is in production.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Identify Risks Early On

脅威モデリングは、設計フェーズ中に潜在的なセキュリティ問題を特定しようとするものです。これにより、セキュリティをシステムに「後付け」するのではなく「組み込む」ことができます。これは、システムが本番稼働した後にセキュリティ欠陥を特定して解決するよりも、はるかに効率的です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Increased Security Awareness

Proper threat modeling requires participants to think creatively and critically about the security and threat landscape of a specific application. It challenges individuals to "think like an attacker" and apply general security knowledge to a specific context. Threat modeling is also typically a team effort with members being encouraged to share ideas and provide feedback on others. Overall, threat modeling can prove to be a highly educational activity that benefits participants.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Increased Security Awareness

適切な脅威モデリングでは、参加者が特定のアプリケーションのセキュリティと脅威の状況について、創造的かつ批判的に考える必要があります。参加者に「攻撃者のように考える」ことを促し、一般的なセキュリティ知識を特定の文脈に適用させます。脅威モデリングは通常チームで行う作業でもあり、メンバーはアイデアを共有し、他者の意見にフィードバックすることを奨励されます。全体として、脅威モデリングは参加者に利益をもたらす、非常に教育的な活動になり得ます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Improved Visibility of Target of Evaluation (TOE)

Threat modeling requires a deep understanding of the system being evaluated. To properly threat model, one must understand data flows, trust boundaries, and other characteristics of the system. Thus improved visibility into a system and its interactions is one advantage of threat modeling.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Improved Visibility of Target of Evaluation (TOE)

脅威モデリングには、評価対象システムについての深い理解が必要です。適切に脅威モデリングを行うには、データフロー、信頼境界、その他のシステム特性を理解しなければなりません。したがって、システムとその相互作用への可視性が向上することは、脅威モデリングの利点の一つです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Addressing Each Question

There is no universally accepted industry standard for the threat modeling process, no "right" answer for every use case. However, despite this diversity, most approaches do include the processes of system modeling, threat identification, and risk response in some form. Inspired by these commonalities and guided by the four key questions of threat modeling discussed above, this cheatsheet will break the threat modeling down into four basic steps: application decomposition, threat identification and ranking, mitigations, and review and validation. There are processes that are less aligned to this, including PASTA and OCTAVE, each of which has passionate advocates.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## Addressing Each Question

脅威モデリングプロセスについて、業界で普遍的に受け入れられた標準はなく、すべてのユースケースに対する「正しい」答えもありません。しかし、この多様性にもかかわらず、多くのアプローチは何らかの形でシステムモデリング、脅威の特定、リスク対応のプロセスを含んでいます。これらの共通点に着想を得て、前述した脅威モデリングの四つの主要な問いを手引きとして、このチートシートでは脅威モデリングを、アプリケーション分解、脅威の特定とランク付け、緩和策、レビューと検証という四つの基本ステップに分けます。PASTA や OCTAVE など、この流れとはあまり一致しないプロセスもあり、それぞれに熱心な支持者がいます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### System Modeling

The step of system modeling seeks to answer the question "what are we building"? Without understanding a system, one cannot truly understand what threats are most applicable to it; thus, this step provides a critical foundation for subsequent activities. Although different techniques may be used in this first step of threat modeling, data flow diagrams (DFDs) are arguably the most common approach.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### System Modeling

システムモデリングのステップは、「何を構築しているのか」という問いに答えることを目的とします。システムを理解しなければ、そのシステムに最も適用される脅威を本当に理解することはできません。そのため、このステップは後続の活動に不可欠な土台を提供します。脅威モデリングのこの最初のステップではさまざまな技法を使えますが、データフロー図 (DFD) はおそらく最も一般的なアプローチです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

DFDs allow one to visually model a system and its interactions with data and other entities; they are created using a [small number of simple symbols](https://github.com/adamshostack/DFD3). DFDs may be created within dedicated threat modeling tools such as [OWASP's Threat Dragon](https://github.com/OWASP/threat-dragon) or [Microsoft's Threat Modeling Tool](https://learn.microsoft.com/en-us/azure/security/develop/threat-modeling-tool) or using general purpose diagraming solutions such as [draw.io](https://draw.io). If you prefer an -as-code approach, [OWASP's pytm](https://owasp.org/www-project-pytm/) can help there. Depending on the scale and complexity of the system being modeled, multiple DFDs may be required. For example, one could create a DFD representing a high-level overview of the entire system along with a number of more focused DFDs which detail sub-systems. Technical tools are not strictly necessary; whiteboarding may be sufficient in some instances, though it is preferable to have the DFDs in a form that can be easily stored, referenced, and updated as needed.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

DFD により、システムと、データや他のエンティティとの相互作用を視覚的にモデル化できます。DFD は、[少数の単純な記号](https://github.com/adamshostack/DFD3)を使って作成します。DFD は [OWASP's Threat Dragon](https://github.com/OWASP/threat-dragon) や [Microsoft's Threat Modeling Tool](https://learn.microsoft.com/en-us/azure/security/develop/threat-modeling-tool) などの専用の脅威モデリングツールで作成することも、[draw.io](https://draw.io) などの汎用作図ソリューションで作成することもできます。as-code のアプローチを好む場合は、[OWASP's pytm](https://owasp.org/www-project-pytm/) が役立ちます。モデル化するシステムの規模と複雑さによっては、複数の DFD が必要になる場合があります。たとえば、システム全体の高レベル概要を表す DFD と、サブシステムを詳述する複数のより焦点を絞った DFD を作成できます。技術的なツールは厳密には必須ではありません。場合によってはホワイトボードで十分かもしれませんが、必要に応じて簡単に保存、参照、更新できる形式で DFD を持つことが望ましいです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Regardless of how a DFD or comparable model is generated, it is important that the solution provides a clear view of trust boundaries, data flows, data stores, processes, and the external entities which may interact with the system. These often represent possible attack points and provide crucial input for the subsequent steps.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

DFD または同等のモデルをどのように生成するかにかかわらず、そのソリューションが、信頼境界、データフロー、データストア、プロセス、そしてシステムとやり取りする可能性のある外部エンティティを明確に示すことが重要です。これらは多くの場合、攻撃可能なポイントを表し、後続のステップに不可欠な入力を提供します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Another approach to Data Flow Diagrams (DFD) could be the brainstorming technique, which is an effective method for generating ideas and discovering the project's domain. Applying brainstorming in this context can bring numerous benefits, such as increased team engagement, unification of knowledge and terminology, a shared understanding of the domain, and quick identification of key processes and dependencies. One of the main arguments for using brainstorming is its flexibility and adaptability to almost any scenario, including business logic. Additionally, this technique is particularly useful when less technical individuals participate in the session, as it eliminates barriers related to understanding and applying the components of DFD models and their correctness.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

データフロー図 (DFD) に対する別のアプローチとして、ブレインストーミング技法があります。これは、アイデアを生み出し、プロジェクトのドメインを発見するための効果的な方法です。この文脈でブレインストーミングを適用すると、チームの関与の向上、知識と用語の統一、ドメインに対する共通理解、主要なプロセスと依存関係の迅速な特定など、多くの利点が得られます。ブレインストーミングを使う主な理由の一つは、ビジネスロジックを含むほぼあらゆるシナリオに対する柔軟性と適応性です。さらに、この技法は、技術的でない人がセッションに参加する場合に特に有用です。DFD モデルの構成要素やその正しさを理解し適用することに関連する障壁を取り除けるためです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Brainstorming engages all participants, fostering better communication and mutual understanding of issues. Every team member has the opportunity to contribute, which increases the sense of responsibility and involvement. During a brainstorming session, participants can collaboratively define and agree on key terms and concepts, leading to a unified language used in the project. This is especially important in complex projects where different teams might have different approaches to terminology. Due to the dynamic nature of brainstorming, the team can quickly identify key business processes and their interrelations.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

ブレインストーミングはすべての参加者を巻き込み、より良いコミュニケーションと問題に対する相互理解を促進します。すべてのチームメンバーに貢献の機会があり、責任感と関与が高まります。ブレインストーミングセッションでは、参加者が共同で主要な用語や概念を定義し合意でき、プロジェクトで使われる言語の統一につながります。これは、異なるチームが用語に対して異なるアプローチを持つ可能性のある複雑なプロジェクトでは特に重要です。ブレインストーミングの動的な性質により、チームは主要なビジネスプロセスとそれらの相互関係を素早く特定できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Integrating the results of brainstorming with formal modeling techniques can lead to a better understanding of the domain and more effective system design.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

ブレインストーミングの結果を正式なモデリング技法と統合することで、ドメインの理解と、より効果的なシステム設計につながります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Cloud Threat Modeling

Most modern systems are cloud-native or hybrid. Traditional threat modeling techniques (like STRIDE or DFDs) often need adaptation for cloud architectures, which introduce:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Cloud Threat Modeling

現代のシステムの多くは、クラウドネイティブまたはハイブリッドです。STRIDE や DFD のような従来の脅威モデリング技法は、次のような要素を導入するクラウドアーキテクチャに合わせて調整が必要になることがよくあります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Shared responsibility models
- Managed services and APIs
- Multi-tenant and identity federation considerations
- Dynamic infrastructure (IaC, serverless, containers)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- 共有責任モデル
- マネージドサービスと API
- マルチテナントと ID フェデレーションに関する考慮事項
- 動的インフラストラクチャ (IaC、サーバーレス、コンテナ)

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Cloud-native systems introduce unique considerations for threat modeling due to their distributed, service-oriented nature and shared responsibility model. In this context, the threat modeling process should account for:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

クラウドネイティブシステムは、分散型でサービス指向の性質と共有責任モデルにより、脅威モデリングに固有の考慮事項をもたらします。この文脈では、脅威モデリングプロセスは次の点を考慮すべきです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- **Cloud architecture components:** virtual networks, IAM roles, managed services, and storage buckets.
- **Shared responsibility:** understanding which security controls are managed by the provider vs. the customer.
- **Dynamic environments:** container orchestration, serverless functions, and ephemeral infrastructure.
- **Compliance and data residency:** ensuring that workloads meet jurisdictional and privacy requirements.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- **クラウドアーキテクチャコンポーネント:** 仮想ネットワーク、IAM ロール、マネージドサービス、ストレージバケット。
- **共有責任:** どのセキュリティコントロールがプロバイダーによって管理され、どれが顧客によって管理されるかを理解すること。
- **動的環境:** コンテナオーケストレーション、サーバーレス関数、一時的なインフラストラクチャ。
- **コンプライアンスとデータレジデンシー:** ワークロードが管轄区域とプライバシーの要件を満たしていることを確認すること。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Cloud threat modeling frameworks such as AWS’s [Well-Architected Framework – Security Pillar](https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/welcome.html) can serve as references.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

AWS の [Well-Architected Framework – Security Pillar](https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/welcome.html) などのクラウド脅威モデリングフレームワークは、参考資料として役立ちます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Threat Identification

After the system has been modeled, it is now time to address the question of "what can go wrong?". This question must be explored with the inputs from the first step in mind; that is, it should focus on identifying and ranking threats within the context of the specific system being evaluated. In attempting to answer this question, threat modelers have a wealth of data sources and techniques at their disposal. For illustration purposes, this cheatsheet will leverage STRIDE; however, in practice, other approaches may be used alongside or instead of STRIDE.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Threat Identification

システムをモデル化した後は、「何がうまくいかない可能性があるのか」という問いに取り組む段階です。この問いは、最初のステップから得た入力を念頭に置いて検討しなければなりません。つまり、評価対象の特定システムの文脈で、脅威を特定しランク付けすることに焦点を当てるべきです。この問いに答えるにあたり、脅威モデリングの実施者は豊富なデータソースと技法を利用できます。説明のため、このチートシートでは STRIDE を利用しますが、実際には STRIDE と併用して、または STRIDE の代わりに、他のアプローチを使うこともあります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

STRIDE is a mature and popular threat modeling technique and mnemonic originally developed by Microsoft employees. To facilitate threat identification, STRIDE groups threats into one of six general prompts and engineers are encouraged to systematically consider how these general threats may materialize within the context of the specific system being evaluated. Each STRIDE threat may be considered a violation of a desirable security attribute; the categories and associated desirable attributes are as follows:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

STRIDE は、Microsoft の従業員によって最初に開発された、成熟した一般的な脅威モデリング技法であり記憶法です。脅威の特定を容易にするため、STRIDE は脅威を六つの一般的なプロンプトの一つに分類し、エンジニアに対して、これらの一般的な脅威が評価対象の特定システムの文脈でどのように具体化し得るかを体系的に検討するよう促します。それぞれの STRIDE 脅威は、望ましいセキュリティ属性への違反と考えることができます。カテゴリと関連する望ましい属性は次のとおりです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

| Threat Category             | Violates          | Examples                                                                                                    |
| --------------------------- | ----------------- | ----------------------------------------------------------------------------------------------------------- |
| **S**poofing                | Authentication    | An attacker steals the authentication token of a legitimate user and uses it to impersonate the user.       |
| **T**ampering               | Integrity         | An attacker abuses the application to perform unintended updates to a database.                             |
| **R**epudiation             | Accounting        | An attacker manipulates logs to cover their actions.                                                        |
| **I**nformation Disclosure  | Confidentiality   | An attacker extracts data from a database containing user account info.                                     |
| **D**enial of Service       | Availability      | An attacker locks a legitimate user out of their account by performing many failed authentication attempts. |
| **E**levation of Privileges | Authorization     | An attacker tampers with a JWT to change their role.                                                        |

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

| Threat Category | Violates | Examples |
| --- | --- | --- |
| **S**poofing | Authentication | 攻撃者が正規ユーザーの認証トークンを盗み、そのユーザーになりすますために使用する。 |
| **T**ampering | Integrity | 攻撃者がアプリケーションを悪用して、データベースに意図しない更新を実行する。 |
| **R**epudiation | Accounting | 攻撃者が自分の行為を隠すためにログを操作する。 |
| **I**nformation Disclosure | Confidentiality | 攻撃者がユーザーアカウント情報を含むデータベースからデータを抽出する。 |
| **D**enial of Service | Availability | 攻撃者が多数の認証失敗を発生させ、正規ユーザーをアカウントから締め出す。 |
| **E**levation of Privileges | Authorization | 攻撃者が JWT を改ざんしてロールを変更する。 |

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

STRIDE provides valuable structure for responding to the question of "what can go wrong". It is also a highly flexible approach and getting started need not be complex. Simple techniques such as brainstorming and whiteboarding or even [games](https://github.com/adamshostack/eop/) may be used initially. STRIDE is also incorporated into popular threat modeling tools such as [OWASP's Threat Dragon](https://github.com/OWASP/threat-dragon) and [Microsoft's Threat Modeling Tool](https://learn.microsoft.com/en-us/azure/security/develop/threat-modeling-tool). Additionally, as a relatively high-level process, STRIDE pairs well with more tactical approaches such as kill chains or [MITRE's ATT&CK](https://attack.mitre.org/) (please refer to [this article](https://web.isc2ncrchapter.org/under-attck-how-mitres-methodology-to-find-threats-and-embed-counter-measures-might-work-in-your-organization/) for an overview of how STRIDE and ATT&CK can work together).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

STRIDE は、「何がうまくいかない可能性があるのか」という問いに答えるための有用な構造を提供します。また、非常に柔軟なアプローチであり、始めるにあたって複雑である必要はありません。ブレインストーミングやホワイトボード、さらには[ゲーム](https://github.com/adamshostack/eop/)のような単純な技法を最初に使うこともできます。STRIDE は、[OWASP's Threat Dragon](https://github.com/OWASP/threat-dragon) や [Microsoft's Threat Modeling Tool](https://learn.microsoft.com/en-us/azure/security/develop/threat-modeling-tool) などの一般的な脅威モデリングツールにも組み込まれています。さらに、STRIDE は比較的高レベルのプロセスであるため、キルチェーンや [MITRE's ATT&CK](https://attack.mitre.org/) などのより戦術的なアプローチともよく組み合わせられます。STRIDE と ATT&CK がどのように連携できるかの概要については、[この記事](https://web.isc2ncrchapter.org/under-attck-how-mitres-methodology-to-find-threats-and-embed-counter-measures-might-work-in-your-organization/)を参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

After possible threats have been identified, people will frequently rank them. In theory, ranking should be based on the mathematical product of an identified threat's likelihood and its impact. A threat that is likely to occur and result in serious damage would be prioritized much higher than one that is unlikely to occur and would only have a moderate impact. However, these both can be challenging to calculate, and they ignore the work to fix a problem. Some advocate for including that in a single prioritization.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

考えられる脅威を特定した後、多くの場合、人々はそれらをランク付けします。理論上、ランク付けは特定された脅威の発生可能性と影響度の数学的な積に基づくべきです。発生する可能性が高く、深刻な損害をもたらす脅威は、発生可能性が低く中程度の影響しかない脅威よりもはるかに高く優先されます。しかし、これらはどちらも算出が難しい場合があり、問題を修正するための作業量を無視しています。それを単一の優先順位付けに含めることを提唱する人もいます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Response and Mitigations

Equipped with an understanding of both the system and applicable threats, it is now time to answer "what are we going to do about it"?. Each threat identified earlier must have a response. Threat responses are similar, but not identical, to risk responses. [Adam Shostack](https://shostack.org/resources/threat-modeling) lists the following responses:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Response and Mitigations

システムと適用可能な脅威の両方を理解したら、次は「それに対して何をするのか」に答える段階です。先に特定した各脅威には対応が必要です。脅威対応はリスク対応に似ていますが、同一ではありません。[Adam Shostack](https://shostack.org/resources/threat-modeling) は次の対応を挙げています。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- **Mitigate:** Take action to reduce the likelihood that the threat will materialize.
- **Eliminate:** Simply remove the feature or component that is causing the threat.
- **Transfer:** Shift responsibility to another entity such as the customer.
- **Accept:** Do not mitigate, eliminate, or transfer the risk because none of the above options are acceptable given business requirements or constraints.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- **Mitigate:** 脅威が現実化する可能性を下げるための行動を取る。
- **Eliminate:** 脅威の原因となっている機能またはコンポーネントを単純に取り除く。
- **Transfer:** 顧客など別の主体へ責任を移転する。
- **Accept:** ビジネス要件や制約を考えると上記の選択肢が受け入れられないため、リスクを緩和、排除、移転しない。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

If one decides to mitigate a threat, mitigation strategies must be formulated and documented as requirements. Depending on the complexity of the system, nature of threats identified, and the process used for identifying threats (STRIDE or another method), mitigation responses may be applied at either the category or individual threat level. In the former case, the mitigation would apply to all threats within that category. Mitigation strategies must be actionable not hypothetical; they must be something that can actually be built into to the system being developed. Although mitigation strategies must be tailored to the particular application, resources such as as [OWASP's ASVS](https://owasp.org/www-project-application-security-verification-standard/) and [MITRE's CWE list](https://cwe.mitre.org/index.html) can prove valuable when formulating these responses.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

脅威を緩和すると決めた場合、緩和戦略を要件として策定し文書化しなければなりません。システムの複雑さ、特定された脅威の性質、脅威の特定に使ったプロセス (STRIDE または別の方法) によっては、緩和対応をカテゴリ単位または個別の脅威単位で適用できます。前者の場合、緩和策はそのカテゴリ内のすべての脅威に適用されます。緩和戦略は仮説的なものではなく実行可能でなければなりません。開発中のシステムに実際に組み込めるものでなければなりません。緩和戦略は特定のアプリケーションに合わせて調整する必要がありますが、[OWASP's ASVS](https://owasp.org/www-project-application-security-verification-standard/) や [MITRE's CWE list](https://cwe.mitre.org/index.html) などのリソースは、これらの対応を策定する際に有用です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Review and Validation

Finally, it is time to answer the question "did we do a good enough job"? The threat model must be reviewed by all stakeholders, not just the development or security teams. Areas to focus on include:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Review and Validation

最後に、「十分に良い仕事をしたのか」という問いに答える段階です。脅威モデルは、開発チームやセキュリティチームだけでなく、すべてのステークホルダーによってレビューされなければなりません。注目すべき領域は次のとおりです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Does the DFD (or comparable) accurately reflect the system?
- Have all threats been identified?
- For each identified threat, has a response strategy been agreed upon?
- For identified threats for which mitigation is the desired response, have mitigation strategies been developed which reduce risk to an acceptable level?
- Has the threat model been formally documented? Are artifacts from the threat model process stored in such a way that it can be accessed by those with "need to know"?
- Can the agreed upon mitigations be tested? Can success or failure of the requirements and recommendations from the threat model be measured?

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- DFD または同等のものはシステムを正確に反映しているか。
- すべての脅威が特定されているか。
- 特定された各脅威について、対応戦略に合意しているか。
- 緩和が望ましい対応であるとされた脅威について、リスクを許容可能なレベルまで下げる緩和戦略が策定されているか。
- 脅威モデルは正式に文書化されているか。脅威モデリングプロセスの成果物は、「知る必要がある」人がアクセスできる形で保存されているか。
- 合意された緩和策はテスト可能か。脅威モデルから得られた要件と推奨事項の成功または失敗を測定できるか。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Threat Modeling and the Development Team

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## Threat Modeling and the Development Team

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Challenges

Threat modeling can be challenging for development teams for several key reasons. Firstly, many developers lack sufficient knowledge and experience in the field of security, which hinders their ability to effectively use methodologies and frameworks, identify, and model threats. Without proper training and understanding of basic security principles, developers may overlook potential threats or incorrectly assess their risks.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Challenges

脅威モデリングは、いくつかの主要な理由により、開発チームにとって困難になることがあります。第一に、多くの開発者はセキュリティ分野で十分な知識と経験を持っておらず、そのため方法論やフレームワークを効果的に使い、脅威を特定しモデル化する能力が妨げられます。基本的なセキュリティ原則について適切なトレーニングと理解がなければ、開発者は潜在的な脅威を見落としたり、そのリスクを誤って評価したりする可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Additionally, the threat modeling process can be complex and time-consuming. It requires a systematic approach and in-depth analysis, which is often difficult to reconcile with tight schedules and the pressure to deliver new functionalities. Development teams may feel a lack of tools and resources to support them in this task, leading to frustration and discouragement.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

さらに、脅威モデリングプロセスは複雑で時間がかかる場合があります。体系的なアプローチと詳細な分析が必要であり、厳しいスケジュールや新機能提供へのプレッシャーと両立させることが難しいことがよくあります。開発チームは、この作業を支援するツールやリソースの不足を感じ、それが不満や意欲低下につながることがあります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Another challenge is the communication and collaboration between different departments within the organization. Without effective communication between development teams, security teams, and other stakeholders, threat modeling can be incomplete or misdirected.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

もう一つの課題は、組織内の異なる部門間のコミュニケーションと協働です。開発チーム、セキュリティチーム、その他のステークホルダーの間に効果的なコミュニケーションがなければ、脅威モデリングは不完全になったり、誤った方向に進んだりする可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Addressing the Challenges

In many cases, the solution lies in inviting members of the security teams to threat modeling sessions, which can significantly improve the process. Security specialists bring essential knowledge about potential threats that is crucial for effective identification, risk analysis, and mitigation. Their experience and understanding of the latest trends and techniques used by cybercriminals can provide key insights for learning and developing the competencies of development teams. Such joint sessions not only enhance developers' knowledge but also build a culture of collaboration and mutual support within the organization, leading to a more comprehensive approach to security.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Addressing the Challenges

多くの場合、解決策はセキュリティチームのメンバーを脅威モデリングセッションに招くことにあり、それによりプロセスを大きく改善できます。セキュリティ専門家は、効果的な特定、リスク分析、緩和に不可欠な潜在的脅威に関する重要な知識を持ち込みます。サイバー犯罪者が使う最新の傾向と技法に関する経験と理解は、開発チームの学習と能力開発に重要な洞察を提供できます。このような共同セッションは、開発者の知識を高めるだけでなく、組織内に協働と相互支援の文化を築き、より包括的なセキュリティアプローチにつながります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

To change the current situation, organizations should invest in regular IT security training for their development teams. These training sessions should be conducted by experts and tailored to the specific needs of the team. Additionally, it is beneficial to implement processes and tools that simplify and automate threat modeling. These tools can help in identifying and assessing threats, making the process more accessible and less time-consuming.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

現在の状況を変えるため、組織は開発チーム向けの定期的な IT セキュリティトレーニングに投資すべきです。これらのトレーニングセッションは専門家が実施し、チーム固有のニーズに合わせて調整すべきです。さらに、脅威モデリングを簡素化し自動化するプロセスとツールを導入することも有益です。これらのツールは脅威の特定と評価を支援し、プロセスをより利用しやすく、時間のかからないものにできます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

It is also important to promote a culture of security throughout the organization, where threat modeling is seen as an integral part of the Software Development Life Cycle (SDLC), rather than an additional burden. Regular review sessions and cross-team workshops can improve collaboration and communication, leading to a more effective and comprehensive approach to security. Through these actions, organizations can make threat modeling a less burdensome and more efficient process, bringing real benefits to the security of their systems.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

また、脅威モデリングが追加の負担ではなく、ソフトウェア開発ライフサイクル (SDLC) の不可欠な一部と見なされるように、組織全体でセキュリティ文化を促進することも重要です。定期的なレビューセッションとチーム横断ワークショップは、協働とコミュニケーションを改善し、より効果的で包括的なセキュリティアプローチにつながります。これらの取り組みにより、組織は脅威モデリングを負担の少ない、より効率的なプロセスにでき、システムのセキュリティに実質的な利益をもたらせます。

</div>
</div>

</section>
</div>

## References

<div className="referenceFooter">

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

- [Awesome Threat Modeling](https://github.com/hysnsec/awesome-threat-modelling) - resource list
- [Tactical Threat Modeling](https://safecode.org/wp-content/uploads/2017/05/SAFECode_TM_Whitepaper.pdf)
- [Threat Modeling: A Summary of Available Methods](https://insights.sei.cmu.edu/library/threat-modeling-a-summary-of-available-methods/)
- Threat modeling for builders, free online training available on [AWS SkillBuilder](https://explore.skillbuilder.aws/learn/course/external/view/elearning/13274/threat-modeling-for-builders-workshop), and [AWS Workshop Studio](https://catalog.workshops.aws/threatmodel/en-US)
- [Threat Modeling Handbook](https://security.cms.gov/policy-guidance/threat-modeling-handbook)
- [Threat Modeling Process](https://owasp.org/www-community/Threat_Modeling_Process)
- [The Ultimate Beginner's Guide to Threat Modeling](https://shostack.org/resources/threat-modeling)

</div>


## Attribution

<div className="attributionFooter">

- Original: Threat Modeling Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: English original retained for comparison. Japanese translation added. Bilingual display generated from official source and local Japanese translation.
- Retrieved: 2026-05-20

</div>
