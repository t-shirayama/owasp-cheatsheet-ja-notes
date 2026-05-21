---
title: Abuse Case Cheat Sheet
hide_title: true
---

<div className="docHero" data-category="asvs-v15">
  <h1>Abuse Case チートシート</h1>
  <div className="docMeta">
    <span className="docPill">最終更新: 2026-05-20</span>
    <span className="docPill">読了時間: 準備中</span>
    <span className="docPill">カテゴリ: 検証とビジネスロジック</span>
  </div>
</div>

<p className="docLead">Abuse Case チートシートを、原文・翻訳・対比表示で確認できます。ASVS Index 対応の文脈で、公式原文と日本語訳を確認しやすく整理しています。</p>

<div className="tabbedContent">
  <input className="tabInput" type="radio" name="abuse-case-view" id="abuse-case-original" />
  <input className="tabInput" type="radio" name="abuse-case-view" id="abuse-case-translation" defaultChecked />
  <input className="tabInput" type="radio" name="abuse-case-view" id="abuse-case-bilingual" />

  <div className="contentTabs">
    <label htmlFor="abuse-case-original" title="OWASP 原文">原文</label>
    <label htmlFor="abuse-case-translation" title="日本語訳">翻訳</label>
    <label htmlFor="abuse-case-bilingual" title="原文と翻訳を並べて確認">対比表示</label>
  </div>

<section id="abuse-case-original-panel" className="tabPanel originalPanel contentPanel">

## Archive Statement

Reviewers have identified that abuse cases are rarely used in practice. Additionally, the material is presented as a "getting started tutorial" which isn't appropriate for the cheat sheet series.

## Introduction

Often when the security level of an application is mentioned in requirements, the following _expressions_ are met:

- _The application must be secure_.
- _The application must defend against all attacks targeting this category of application_.
- _The application must defend against attacks from the OWASP TOP 10_
- ...

These security requirements are too generic, and thus useless for a development team...

In order to build a secure application, from a pragmatic point of view, it is important to identify the attacks which the application must defend against, according to its business and technical context. Abuse cases were a frequently recommended _threat modeling_ technique, and reviewing the [threat modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html) cheat sheet may be helpful. In practice, the abuse case framework seems heavyweight and there are few published examples or success stories.

### Objective

The objective of this cheat sheet is to provide an explanation of what an **Abuse Case** is, how abuse cases can be important when considering the security of an application, and finally to provide a proposal for a pragmatic approach to building a list of abuse cases and tracking them for every feature planned for implementation as part of an application. The cheat sheet may be used for this purpose regardless of the project methodology used (waterfall or agile).

**Important note about this Cheat Sheet:**

```text
The main objective is to provide a pragmatic approach in order to allow a company or a project team
to start building and handling the list of abuse cases and then customize the elements
proposed to its context/culture in order to, finally, build its own method.

This cheat sheet can be seen as a getting-started tutorial.
```

### Context & approach

#### Why clearly identify the attacks

Clearly identifying the attacks against which the application must defend is essential in order to enable the following steps in a project or sprint:

- Evaluate the business risk for each of the identified attacks in order to perform a selection according to the business risk and the project/sprint budget.
- Derive security requirements and add them into the project specification or sprint's user stories and acceptance criteria.
- Estimate the overhead of provision in the initial project/sprint charge that will be necessary to implement the countermeasures.
- About countermeasures: Allow the project team to define them, and to determine in which location (network, infrastructure, code...) they should be located.

#### Notion of Abuse Cases

You can think of **Abuse cases** in two ways. The first is to discover attacks (answer the question "what can go wrong"), and the second is to help record those attacks (informally, this includes threats, issues, risks) in a form that may be less intimidating to developers.

An **Abuse Case** can be defined as:

```text
A way to use a feature that was not expected by the implementer,
allowing an attacker to influence the feature or outcome of use of
the feature based on the attacker action (or input).
```

Synopsis defines an **Abuse Case** like this:

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

#### How to define the list of Abuse Cases

There are many different ways to define the list of abuse cases for a feature (that can be mapped to a user story in agile projects).

[Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html) is a set of techniques for anticipating what can go wrong, and ensuring we do something about each identified possible scenario. Taking each item on the list of "what are we going to do about it" and writing an abuse case may help your engineering teams process the output.

The project [OWASP Open SAMM](https://owasp.org/www-project-samm/) proposes the following approach in the _Stream B_ of the Security Practice _Requirements Driven Testing_ for the Maturity level 2:

```text
Misuse and abuse cases describe unintended and malicious use scenarios of the application, describing how an attacker could do this. Create misuse and abuse cases to misuse or exploit the weaknesses of controls in software features to attack an application. Use abuse-case models for an application to serve as fuel for identification of concrete security tests that directly or indirectly exploit the abuse scenarios.

Abuse of functionality, sometimes referred to as a “business logic attack”, depends on the design and implementation of application functions and features. An example is using a password reset flow to enumerate accounts. As part of business logic testing, identify the business rules that are important for the application and turn them into experiments to verify whether the application properly enforces the business rule. For example, on a stock trading application, is the attacker allowed to start a trade at the beginning of the day and lock in a price, hold the transaction open until the end of the day, then complete the sale if the stock price has risen or cancel if the price dropped?
```

Open SAMM source: [Verification Requirement Driven Testing Stream B](https://owaspsamm.org/model/verification/requirements-driven-testing/stream-b/)

Another way to achieve the building of the list can be the following (more bottom-up and collaboratively oriented):

Make a workshop that includes people with the following profiles:

- **Business analyst**: Will be the business key people that will describe each feature from a business point of view.
- **Risk analyst**: Will be the company's risk personnel that will evaluate the business risk from a proposed attack (sometimes it is the **Business analyst** depending on the company).
- **Penetration tester**: Will be the _attacker_ that will propose attacks that they can perform on the business feature(s) in question. If the company does not have a person with this profile then it is possible to request the service of an external specialist. If possible, include 2 penetration testers with different backgrounds in order to increase the number of possible attacks that will be identified and considered.
- **Technical leaders of the projects**: Will be the project technical people and will allow technical exchange about attacks and countermeasures identified during the workshop.
- **Quality assurance analyst or functional tester**: Personnel that may have a good sense of how the application/functionality is intended to work (positive testing), not work (negative testing), and what things cause it to fail (failure cases).

During this workshop (duration will depend on the size of the feature list, but 4 hours is a good start) all business features that will be part of the project or the sprint will be processed. The output of the workshop will be a list of attacks (abuse cases) for all business features. All abuse cases will have a risk rating that allows for filtering and prioritization.

It is important to take into account **Technical** and **Business** kind of abuse cases and mark them accordingly.

_Example:_

- Technical flagged abuse case: Add Cross Site Scripting injection into a comment input field.
- Business flagged abuse case: Ability to arbitrarily modify the price of an article in an online shop prior to passing an order causing the user to pay a lower amount for the wanted article.

#### When to define the list of Abuse Cases

In agile projects, the definition workshop must be made after the meeting in which User Stories are included in a Sprint.

In waterfall projects, the definition workshop must be made when the business features to implement are identified and known by the business.

Whatever the mode of the project used (agile or waterfall), the abuse cases selected to be addressed must become security requirements in each feature specification section (waterfall) or User Story acceptance criteria (agile) in order to allow additional cost/effort evaluation, identification and implementation of the countermeasures.

Each abuse case must have a unique identifier in order to allow tracking throughout the whole project/sprint (details about this point will be given in the proposal section).

An example of unique ID format can be **ABUSE_CASE_001**.

The following figure provides an overview of the chaining of the different steps involved (from left to right):

![Overview Schema](https://cheatsheetseries.owasp.org/assets/Abuse_Case_Cheat_Sheet_Overview.png)

### Proposal

The proposal will focus on the output of the workshop explained in the previous section.

#### Step 1: Preparation of the workshop

First, even if it seems obvious, the key business people must be sure to know, understand and be able to explain the business features that will be processed during the workshop.

Secondly, create a new Microsoft Excel file (you can also use Google Sheets or any other similar software) with the following sheets (or tabs):

- **FEATURES**
    - Will contain a table with the list of business features planned for the workshop.
- **ABUSE CASES**
    - Will contain a table with all abuse cases identified during the workshop.
- **COUNTERMEASURES**
    - Will contain a table with the list of possible countermeasures (light description) imagined for the abuse cases identified.
    - This sheet is not mandatory, but it can be useful (for an abuse case to know), if a fix is easy to implement and then can impact the risk rating.
    - Countermeasures can be identified by the AppSec profile during the workshop, because an AppSec person must be able to perform attacks but also to build or identify defenses (it is not always the case for the Pentester profile because this person's focus is generally on the attack side only, so, the combination Pentester + AppSec is very efficient to have a 360 degree view).

This is the representation of each sheet along with an example of content that will be filled during the workshop:

_FEATURES_ sheet:

| Feature unique ID |     Feature name      |           Feature short description           |
| :---------------: | :-------------------: | :-------------------------------------------: |
|    FEATURE_001    | DocumentUploadFeature | Allow user to upload document along a message |

_COUNTERMEASURES_ sheet:

| Countermeasure unique ID | Countermeasure short description                       | Countermeasure help/hint                                |
| ------------------------ | ------------------------------------------------------ | ------------------------------------------------------- |
| DEFENSE_001              | Validate the uploaded file by loading it into a parser | Use advice from the OWASP Cheat Sheet about file upload |

_ABUSE CASES_ sheet:

| Abuse case unique ID | Feature ID impacted |                     Abuse case's attack description                     | Attack referential ID (if applicable) | CVSS V3 risk rating (score) |                CVSS V3 string                | Kind of abuse case | Countermeasure ID applicable | Handling decision (To Address or Risk Accepted) |
| :------------------: | :-----------------: | :---------------------------------------------------------------------: | :-----------------------------------: | :-------------------------: | :------------------------------------------: | :----------------: | :--------------------------: | :---------------------------------------------: |
|    ABUSE_CASE_001    |     FEATURE_001     | Upload Office file with malicious macro in charge of dropping a malware |               CAPEC-17                |         HIGH (7.7)          | CVSS:3.0/AV:N/AC:H/PR:L/UI:R/S:C/C:N/I:H/A:H |     Technical      |         DEFENSE_001          |                   To Address                    |

#### Step 2: During the workshop

Use the spreadsheet to review all the features.

For each feature, follow this flow:

1. Key business people explain the current feature from a business point of view.
2. Penetration testers propose and explain a set of attacks that they can perform against the feature.
3. For each attack proposed:
   1. Appsec proposes a countermeasure and a preferred set up location (infrastructure, network, code, design...).
   2. Technical people give feedback about the feasibility of the proposed countermeasure.
   3. Penetration testers use the CVSS v3 (or other standard) calculator to determine a risk rating. (ex: [CVSS V3 calculator](https://www.first.org/cvss/calculator/3.0))
   4. Risk leaders should accept or modify the risk rating to determine the final risk score which accurately reflects the real business impact for the company.

4. Business, Risk, and Technical leaders should find a consensus and filter the list of abuses for the current feature to keep the ones that must be addressed, and then flag them accordingly in the _ABUSE CASES_ sheet (**if risk is accepted then add a comment to explain why**).
5. Pass to next feature...

If the presence of penetration testers is not possible then you can use the following references to identify the applicable attacks on your features:

- [OWASP Automated Threats to Web Applications](https://owasp.org/www-project-automated-threats-to-web-applications/)
- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/stable/)
- [OWASP Mobile Testing Guide](https://github.com/OWASP/owasp-mstg)
- [Common Attack Pattern Enumeration and Classification (CAPEC)](https://capec.mitre.org/)

Important note on attacks and countermeasure knowledge base(s):

```text
With time and experience across projects, you will obtain your own dictionary of attacks and countermeasures
that are applicable to the kind of application in your business domain.

This dictionary will speed up the future workshops in a significant way.

To promote the creation of this dictionary, you can, at the end of the project/sprint, gather the list
of attacks and countermeasures identified in a central location (wiki, database, file...) that will be
used during the next workshop in combination with input from penetration testers.
```

#### Step 3: After the workshop

The spreadsheet contains (at this stage) the list of all abuse cases that must be handled and, potentially (depending on the capacity) corresponding countermeasures.

Now, there are two remaining task:

1. Key business people must update the specification of each feature (waterfall) or the User Story of each feature (agile) to include the associated abuse cases as Security Requirements (waterfall) or Acceptance Criteria (agile).
2. Key technical people must evaluate the overhead in terms of expense/effort to take into account the countermeasure.

#### Step 4: During implementation - Abuse cases handling tracking

In order to track the handling of all the abuse cases, the following approach can be used:

If one or several abuse cases are handled at:

- **Design, Infrastructure or Network level**
    - Make a note in the documentation or schema to indicate that _This design/network/infrastructure takes into account the abuse cases ABUSE_CASE_001, ABUSE_CASE_002, ABUSE_CASE_xxx_.
- **Code level**
    - Put a special comment in the classes/scripts/modules to indicate that _This class/module/script takes into account the abuse cases ABUSE_CASE_001, ABUSE_CASE_002, ABUSE_CASE_xxx_.
    - Dedicated annotation like `@AbuseCase(ids=&#123;"ABUSE_CASE_001","ABUSE_CASE_002"&#125;)` can be used to facilitate tracking and allow identification into integrated development environment.

Using this way, it becomes possible (via some minor scripting) to identify where abuse cases are addressed.

#### Step 5: During implementation - Abuse cases handling validation

As abuse cases are defined, it is possible to put in place automated or manual validations to ensure that:

- All the selected abuse cases are handled.
- An abuse case is correctly/completely handled.

Validations can be of the following varieties:

- Automated (run regularly at commit, daily or weekly in the Continuous Integration Jobs of the project):
    - Custom audit rules in Static Application Security Testing (SAST) or Dynamic Application Security Testing (DAST) tools.
    - Dedicated unit, integration or functional security oriented tests.
    - ...
- Manual:
    - Security code review between project's peers during the design or implementation.
    - Provide the list of all abuse cases addressed to pentesters so that they may validate the protection efficiency for each abuse case during an intrusion test against the application (the pentester will validate that the attacks identified are no longer effective and will also try to find other possible attacks).
    - ...

Adding automated tests also allow teams to track the effectiveness of countermeasures against abuse cases and determine if the countermeasures are still in place during a maintenance or bug fixing phase of a project (to prevent accidental removal/disabling). It is also useful when a [Continuous Delivery](https://continuousdelivery.com/) approach is used, to ensure that all abuse cases protections are in place before opening access to the application.

### Example of derivation of Abuse Cases as User Stories

The following section shows an example of derivation of Abuse Cases as User Stories, here using the [OWASP TOP 10](https://owasp.org/www-project-top-ten/) as input source.

Threat Oriented Personas:

- Malicious User
- Abusive User
- Unknowing User

#### A1:2017-Injection

_Epic:_

Almost any source of data can be an injection vector, environment variables, parameters, external and internal web services, and all types of users. [Injection](https://owasp.org/www-community/Injection_Flaws) flaws occur when an attacker can send hostile data to an interpreter.

_Abuse Case:_

As an attacker, I will perform an injection attack (SQL, LDAP, XPath, or NoSQL queries, OS commands, XML parsers, SMTP headers, expression languages, and ORM queries) against input fields of the User or API interfaces

#### A2:2017-Broken Authentication

_Epic:_

Attackers have access to hundreds of millions of valid username and password combinations for credential stuffing, default administrative account lists, automated brute force, and dictionary attack tools. Session management attacks are well understood, particularly in relation to unexpired session tokens.

_Abuse Case:_

As an attacker, I have access to hundreds of millions of valid username and password combinations for credential stuffing.

_Abuse Case:_

As an attacker, I have default administrative account lists, automated brute force, and dictionary attack tools I use against login areas of the application and support systems.

_Abuse Case:_

As an attacker, I manipulate session tokens using expired and fake tokens to gain access.

#### A3:2017-Sensitive Data Exposure

_Epic:_

Rather than directly attacking crypto, attackers steal keys, execute man-in-the-middle attacks, or steal clear text data off the server, while in transit, or from the user's client, e.g. browser. A manual attack is generally required. Previously retrieved password databases could be brute forced by Graphics Processing Units (GPUs).

_Abuse Case:_

As an attacker, I steal keys that were exposed in the application to get unauthorized access to the application or system.

_Abuse Case:_

As an attacker, I execute man-in-the-middle attacks to get access to traffic and leverage it to obtain sensitive data and possibly get unauthorized access to the application.

_Abuse Case:_

As an attacker, I steal clear text data off the server, while in transit, or from the user's client, e.g. browser to get unauthorized access to the application or system.

_Abuse Case:_

As an attacker, I find and target old or weak cryptographic algorithms by capturing traffic and breaking the encryption.

#### A4:2017-XML External Entities (XXE)

_Epic:_

Attackers can exploit vulnerable XML processors if they can upload XML or include hostile content in an XML document, exploiting vulnerable code, dependencies or integrations.

_Abuse Case:_

As an attacker, I exploit vulnerable areas of the application where the user or system can upload XML to extract data, execute a remote request from the server, scan internal systems, perform a denial-of-service attack, as well as execute other attacks.

_Abuse Case:_

As an attacker, I include hostile content in an XML document which is uploaded to the application or system to extract data, execute a remote request from the server, scan internal systems, perform a denial-of-service attack, as well as execute other attacks.

_Abuse Case:_

As an attacker, I include malicious XML code to exploit vulnerable code, dependencies or integrations to extract data, execute a remote request from the server, scan internal systems, perform a denial-of-service attack (e.g. Billion Laughs attack), as well as execute other attacks.

#### A5:2017-Broken Access Control

_Epic:_

Exploitation of access control is a core skill of attackers. Access control is detectable using manual means, or possibly through automation for the absence of access controls in certain frameworks.

_Abuse Case:_

As an attacker, I bypass access control checks by modifying the URL, internal application state, or the HTML page, or simply using a custom API attack tool.

_Abuse Case:_

As an attacker, I manipulate the primary key and change it to access another's users record, allowing viewing or editing someone else's account.

_Abuse Case:_

As an attacker, I manipulate sessions, access tokens, or other access controls in the application to act as a user without being logged in, or acting as an admin/privileged user when logged in as a user.

_Abuse Case:_

As an attacker, I leverage metadata manipulation, such as replaying or tampering with a JSON Web Token (JWT) access control token or a cookie or hidden field manipulated to elevate privileges or abusing JWT invalidation.

_Abuse Case:_

As an attacker, I exploit Cross-Origin Resource Sharing CORS misconfiguration allowing unauthorized API access.

_Abuse Case:_

As an attacker, I force browsing to authenticated pages as an unauthenticated user or to privileged pages as a standard user.

_Abuse Case:_

As an attacker, I access APIs with missing access controls for POST, PUT and DELETE.

_Abuse Case:_

As an attacker, I target default crypto keys in use, weak crypto keys generated or re-used, or keys where rotation is missing.

_Abuse Case:_

As an attacker, I find areas where the user agent (e.g. app, mail client) does not verify if the received server certificate is valid and perform attacks where I get unauthorized access to data.

#### A6:2017-Security Misconfiguration

_Epic:_

Attackers will often attempt to exploit unpatched flaws or access default accounts, unused pages, unprotected files and directories, etc to gain unauthorized access or knowledge of the system.

_Abuse Case:_

As an attacker, I find and exploit missing appropriate security hardening configurations on any part of the application stack, or improperly configured permissions on cloud services.

_Abuse Case:_

As an attacker, I find unnecessary features which are enabled or installed (e.g. unnecessary ports, services, pages, accounts, or privileges) and attack or exploit the weakness.

_Abuse Case:_

As an attacker, I use default accounts and their passwords to access systems, interfaces, or perform actions on components which I should not be able to.

_Abuse Case:_

As an attacker, I find areas of the application where error handling reveals stack traces or other overly informative error messages I can use for further exploitation.

_Abuse Case:_

As an attacker, I find areas where upgraded systems, latest security features are disabled or not configured securely.

_Abuse Case:_

As an attacker, I find security settings in the application servers, application frameworks (e.g. Struts, Spring, ASP.NET), libraries, databases, etc. not set to secure values.

_Abuse Case:_

As an attacker, I find the server does not send security headers or directives or are set to insecure values.

#### A7:2017-Cross-Site Scripting (XSS)

_Epic:_

XSS is the second most prevalent issue in the OWASP Top 10, and is found in around two-thirds of all applications.

_Abuse Case:_

As an attacker, I perform reflected XSS where the application or API includes unvalidated and unescaped user input as part of HTML output. My successful attack can allow the attacker to execute arbitrary HTML and JavaScript in my victim's browser. Typically the victim will need to interact with some malicious link that points to an attacker-controlled page, such as malicious watering hole websites, advertisements, or similar.

_Abuse Case:_

As an attacker, I perform stored XSS where the application or API stores unsanitized user input that is viewed at a later time by another user or an administrator.

_Abuse Case:_

As an attacker, I perform DOM XSS where JavaScript frameworks, single-page applications, and APIs that dynamically include attacker-controllable data to a page is vulnerable to DOM XSS.

#### A8:2017-Insecure Deserialization

_Epic:_

Exploitation of deserialization is somewhat difficult, as off-the-shelf exploits rarely work without changes or tweaks to the underlying exploit code.

_Abuse Case:_

As an attacker, I find areas of the application and APIs where deserialization of hostile or tampered objects can be supplied. As a result, I can focus on an object and data structure related attacks where the attacker modifies application logic or achieves arbitrary remote code execution if there are classes available to the application that can change behavior during or after deserialization. Or I focus on data tampering attacks such as access-control-related attacks where existing data structures are used but the content is changed.

#### A9:2017-Using Components with Known Vulnerabilities

_Epic:_

While it is easy to find already-written exploits for many known vulnerabilities, other vulnerabilities require concentrated effort to develop a custom exploit.

_Abuse Case:_

As an attacker, I find common open source or closed source packages with weaknesses and perform attacks against vulnerabilities and exploits which are disclosed

#### A10:2017-Insufficient Logging & Monitoring

_Epic:_

Exploitation of insufficient logging and monitoring is the bedrock of nearly every major incident. Attackers rely on the lack of monitoring and timely response to achieve their goals without being detected. In 2016, identifying a breach took an [average of 191 days](https://www-01.ibm.com/common/ssi/cgi-bin/ssialias?htmlfid=SEL03130WWEN) allowing substantial chance for damage to be inflicted.

_Abuse Case:_

As an attacker, I attack an organization and the logs, monitoring systems, and teams do not see or respond to my attacks.

## Sources of the schemas

All figures were created using [https://www.draw.io/](https://www.draw.io/) site and exported (as PNG image) for integration into this article.

All XML descriptor files for each schema are available below (using XML description, modification of the schema is possible using DRAW.IO site):

[Schemas descriptors archive](https://cheatsheetseries.owasp.org/assets/Abuse_Case_Cheat_Sheet_SchemaBundle.zip)

</section>

<section id="abuse-case-translation-panel" className="tabPanel translationPanel contentPanel">

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
    - `@AbuseCase(ids=&#123;"ABUSE_CASE_001","ABUSE_CASE_002"&#125;)` のような専用アノテーションを使用して、追跡を容易にし、統合開発環境内で識別できるようにできます。

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

すべての図は [https://www.draw.io/](https://www.draw.io/) サイトを使用して作成され、この記事に統合するために (PNG 画像として) エクスポートされました。

各図のすべての XML 記述子ファイルは以下で入手できます (XML 記述を使用し、DRAW.IO サイトで図を変更できます)。

[Schemas descriptors archive](https://cheatsheetseries.owasp.org/assets/Abuse_Case_Cheat_Sheet_SchemaBundle.zip)

</section>

<section id="abuse-case-bilingual-panel" className="tabPanel bilingualPanel">

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Archive Statement

Reviewers have identified that abuse cases are rarely used in practice. Additionally, the material is presented as a "getting started tutorial" which isn't appropriate for the cheat sheet series.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## アーカイブ声明

レビュアーは、悪用ケースが実務ではほとんど使われていないことを確認しました。加えて、この資料は「入門チュートリアル」として提示されており、チートシートシリーズには適していません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Introduction

Often when the security level of an application is mentioned in requirements, the following _expressions_ are met:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## はじめに

要件でアプリケーションのセキュリティレベルに言及する際、次のような_表現_によく出会います。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- _The application must be secure_.
- _The application must defend against all attacks targeting this category of application_.
- _The application must defend against attacks from the OWASP TOP 10_
- ...

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- _アプリケーションはセキュアでなければならない_。
- _アプリケーションは、このカテゴリのアプリケーションを標的とするすべての攻撃から防御しなければならない_。
- _アプリケーションは OWASP TOP 10 の攻撃から防御しなければならない_。
- ...

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

These security requirements are too generic, and thus useless for a development team...

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

これらのセキュリティ要件は一般的すぎるため、開発チームにとって役に立ちません...

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

In order to build a secure application, from a pragmatic point of view, it is important to identify the attacks which the application must defend against, according to its business and technical context. Abuse cases were a frequently recommended _threat modeling_ technique, and reviewing the [threat modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html) cheat sheet may be helpful. In practice, the abuse case framework seems heavyweight and there are few published examples or success stories.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

安全なアプリケーションを構築するには、実践的な観点から、アプリケーションが防御しなければならない攻撃を、そのビジネスおよび技術的文脈に従って特定することが重要です。悪用ケースは、以前はよく推奨される_脅威モデリング_手法であり、[脅威モデリング](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html)チートシートを確認すると役立つかもしれません。実務上、悪用ケースのフレームワークは重厚に見え、公開された例や成功事例はほとんどありません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Objective

The objective of this cheat sheet is to provide an explanation of what an **Abuse Case** is, how abuse cases can be important when considering the security of an application, and finally to provide a proposal for a pragmatic approach to building a list of abuse cases and tracking them for every feature planned for implementation as part of an application. The cheat sheet may be used for this purpose regardless of the project methodology used (waterfall or agile).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 目的

このチートシートの目的は、**悪用ケース**とは何か、アプリケーションのセキュリティを考える際に悪用ケースがどのように重要になり得るかを説明し、最後に、アプリケーションの一部として実装予定の各機能について悪用ケースのリストを作成し追跡するための実践的アプローチ案を提供することです。このチートシートは、使用されるプロジェクト方法論 (ウォーターフォールまたはアジャイル) に関係なく、この目的に使用できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Important note about this Cheat Sheet:**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**このチートシートに関する重要な注意:**

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```text
The main objective is to provide a pragmatic approach in order to allow a company or a project team
to start building and handling the list of abuse cases and then customize the elements
proposed to its context/culture in order to, finally, build its own method.

This cheat sheet can be seen as a getting-started tutorial.
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Context & approach

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 文脈とアプローチ

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Why clearly identify the attacks

Clearly identifying the attacks against which the application must defend is essential in order to enable the following steps in a project or sprint:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 攻撃を明確に特定する理由

アプリケーションがどの攻撃に対して防御しなければならないかを明確に特定することは、プロジェクトまたはスプリントで次の手順を可能にするために不可欠です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Evaluate the business risk for each of the identified attacks in order to perform a selection according to the business risk and the project/sprint budget.
- Derive security requirements and add them into the project specification or sprint's user stories and acceptance criteria.
- Estimate the overhead of provision in the initial project/sprint charge that will be necessary to implement the countermeasures.
- About countermeasures: Allow the project team to define them, and to determine in which location (network, infrastructure, code...) they should be located.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- 特定された各攻撃についてビジネスリスクを評価し、ビジネスリスクとプロジェクトまたはスプリントの予算に従って選択できるようにします。
- セキュリティ要件を導出し、プロジェクト仕様、またはスプリントのユーザーストーリーと受け入れ基準に追加します。
- 対策を実装するために必要となる初期プロジェクトまたはスプリント工数上の追加負荷を見積もります。
- 対策について、プロジェクトチームがそれらを定義し、どこ (ネットワーク、インフラストラクチャ、コードなど) に配置すべきかを判断できるようにします。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Notion of Abuse Cases

You can think of **Abuse cases** in two ways. The first is to discover attacks (answer the question "what can go wrong"), and the second is to help record those attacks (informally, this includes threats, issues, risks) in a form that may be less intimidating to developers.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 悪用ケースの概念

**悪用ケース**は二つの方法で考えられます。一つ目は攻撃を発見すること (「何がうまくいかない可能性があるか」という問いに答えること) で、二つ目はそれらの攻撃 (非公式には、脅威、問題、リスクを含む) を、開発者にとって威圧感が少ないかもしれない形式で記録する助けにすることです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

An **Abuse Case** can be defined as:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**悪用ケース**は次のように定義できます。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```text
A way to use a feature that was not expected by the implementer,
allowing an attacker to influence the feature or outcome of use of
the feature based on the attacker action (or input).
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Synopsis defines an **Abuse Case** like this:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Synopsis は**悪用ケース**を次のように定義しています。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```text
Misuse and abuse cases describe how users misuse or exploit the weaknesses
of controls in software features to attack an application.

This can lead to tangible business impact when a direct attack against
business functionalities, which may bring in revenue or provide
positive user experience, are attacked.

Abuse cases can also be an effective way to drive security requirements
that lead to proper protection of these critical business use cases.
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

[Synopsis source](https://www.synopsys.com/blogs/software-security/abuse-cases-can-drive-security-requirements.html)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

[Synopsis source](https://www.synopsys.com/blogs/software-security/abuse-cases-can-drive-security-requirements.html)

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### How to define the list of Abuse Cases

There are many different ways to define the list of abuse cases for a feature (that can be mapped to a user story in agile projects).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 悪用ケースのリストを定義する方法

機能 (アジャイルプロジェクトではユーザーストーリーに対応付けられるもの) に対する悪用ケースのリストを定義する方法は数多くあります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

[Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html) is a set of techniques for anticipating what can go wrong, and ensuring we do something about each identified possible scenario. Taking each item on the list of "what are we going to do about it" and writing an abuse case may help your engineering teams process the output.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

[脅威モデリング](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html)は、何がうまくいかない可能性があるかを予測し、特定された各シナリオに対して何らかの対応を確実に行うための技法群です。「それに対して何をするのか」のリストにある各項目を取り、悪用ケースとして書くことは、エンジニアリングチームがその出力を処理する助けになるかもしれません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The project [OWASP Open SAMM](https://owasp.org/www-project-samm/) proposes the following approach in the _Stream B_ of the Security Practice _Requirements Driven Testing_ for the Maturity level 2:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

[OWASP Open SAMM](https://owasp.org/www-project-samm/) プロジェクトは、成熟度レベル 2 のセキュリティプラクティス _Requirements Driven Testing_ の _Stream B_ で、次のアプローチを提案しています。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```text
Misuse and abuse cases describe unintended and malicious use scenarios of the application, describing how an attacker could do this. Create misuse and abuse cases to misuse or exploit the weaknesses of controls in software features to attack an application. Use abuse-case models for an application to serve as fuel for identification of concrete security tests that directly or indirectly exploit the abuse scenarios.

Abuse of functionality, sometimes referred to as a “business logic attack”, depends on the design and implementation of application functions and features. An example is using a password reset flow to enumerate accounts. As part of business logic testing, identify the business rules that are important for the application and turn them into experiments to verify whether the application properly enforces the business rule. For example, on a stock trading application, is the attacker allowed to start a trade at the beginning of the day and lock in a price, hold the transaction open until the end of the day, then complete the sale if the stock price has risen or cancel if the price dropped?
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Open SAMM source: [Verification Requirement Driven Testing Stream B](https://owaspsamm.org/model/verification/requirements-driven-testing/stream-b/)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Open SAMM source: [Verification Requirement Driven Testing Stream B](https://owaspsamm.org/model/verification/requirements-driven-testing/stream-b/)

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Another way to achieve the building of the list can be the following (more bottom-up and collaboratively oriented):

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

リスト作成を実現する別の方法として、次のようなものがあります (よりボトムアップで協調指向です)。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Make a workshop that includes people with the following profiles:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

次のプロファイルの人々を含むワークショップを開催します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- **Business analyst**: Will be the business key people that will describe each feature from a business point of view.
- **Risk analyst**: Will be the company's risk personnel that will evaluate the business risk from a proposed attack (sometimes it is the **Business analyst** depending on the company).
- **Penetration tester**: Will be the _attacker_ that will propose attacks that they can perform on the business feature(s) in question. If the company does not have a person with this profile then it is possible to request the service of an external specialist. If possible, include 2 penetration testers with different backgrounds in order to increase the number of possible attacks that will be identified and considered.
- **Technical leaders of the projects**: Will be the project technical people and will allow technical exchange about attacks and countermeasures identified during the workshop.
- **Quality assurance analyst or functional tester**: Personnel that may have a good sense of how the application/functionality is intended to work (positive testing), not work (negative testing), and what things cause it to fail (failure cases).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- **ビジネスアナリスト**: 各機能をビジネスの観点から説明する主要なビジネス担当者です。
- **リスクアナリスト**: 提案された攻撃からビジネスリスクを評価する企業のリスク担当者です (会社によっては**ビジネスアナリスト**が担当することもあります)。
- **ペネトレーションテスター**: 対象のビジネス機能に対して実行できる攻撃を提案する_攻撃者_です。会社にこのプロファイルの人物がいない場合は、外部専門家のサービスを依頼できます。可能であれば、特定および検討される攻撃数を増やすため、異なる背景を持つ 2 名のペネトレーションテスターを含めます。
- **プロジェクトの技術リーダー**: プロジェクトの技術担当者であり、ワークショップ中に特定された攻撃と対策について技術的なやり取りを可能にします。
- **品質保証アナリストまたは機能テスター**: アプリケーションや機能がどのように動作することを意図しているか (ポジティブテスト)、どのように動作してはならないか (ネガティブテスト)、何が失敗を引き起こすか (失敗ケース) について、よい感覚を持っている可能性のある担当者です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

During this workshop (duration will depend on the size of the feature list, but 4 hours is a good start) all business features that will be part of the project or the sprint will be processed. The output of the workshop will be a list of attacks (abuse cases) for all business features. All abuse cases will have a risk rating that allows for filtering and prioritization.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

このワークショップ中 (所要時間は機能リストのサイズによりますが、4 時間はよい出発点です)、プロジェクトまたはスプリントに含まれるすべてのビジネス機能を処理します。ワークショップの出力は、すべてのビジネス機能に対する攻撃 (悪用ケース) のリストになります。すべての悪用ケースには、フィルタリングと優先順位付けを可能にするリスク評価を付けます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

It is important to take into account **Technical** and **Business** kind of abuse cases and mark them accordingly.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**技術的**な悪用ケースと**ビジネス**上の悪用ケースを考慮し、それに応じて印を付けることが重要です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

_Example:_

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

_例:_

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Technical flagged abuse case: Add Cross Site Scripting injection into a comment input field.
- Business flagged abuse case: Ability to arbitrarily modify the price of an article in an online shop prior to passing an order causing the user to pay a lower amount for the wanted article.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- 技術的フラグ付き悪用ケース: コメント入力フィールドに Cross Site Scripting インジェクションを追加する。
- ビジネスフラグ付き悪用ケース: オンラインショップで注文を通す前に商品の価格を任意に変更でき、ユーザーが欲しい商品に対して低い金額を支払うことになる。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### When to define the list of Abuse Cases

In agile projects, the definition workshop must be made after the meeting in which User Stories are included in a Sprint.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 悪用ケースのリストを定義するタイミング

アジャイルプロジェクトでは、ユーザーストーリーがスプリントに含められる会議の後に定義ワークショップを実施しなければなりません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

In waterfall projects, the definition workshop must be made when the business features to implement are identified and known by the business.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

ウォーターフォールプロジェクトでは、実装するビジネス機能が特定され、ビジネス側に知られた時点で定義ワークショップを実施しなければなりません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Whatever the mode of the project used (agile or waterfall), the abuse cases selected to be addressed must become security requirements in each feature specification section (waterfall) or User Story acceptance criteria (agile) in order to allow additional cost/effort evaluation, identification and implementation of the countermeasures.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

使用されるプロジェクト形態 (アジャイルまたはウォーターフォール) にかかわらず、対応対象として選択された悪用ケースは、追加のコストや工数の評価、対策の特定と実装を可能にするため、各機能仕様セクション (ウォーターフォール) またはユーザーストーリーの受け入れ基準 (アジャイル) におけるセキュリティ要件にならなければなりません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Each abuse case must have a unique identifier in order to allow tracking throughout the whole project/sprint (details about this point will be given in the proposal section).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

各悪用ケースには、プロジェクトまたはスプリント全体を通じて追跡できるように、一意の識別子を持たせなければなりません (この点の詳細は提案セクションで説明します)。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

An example of unique ID format can be **ABUSE_CASE_001**.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

一意 ID 形式の例は **ABUSE_CASE_001** です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The following figure provides an overview of the chaining of the different steps involved (from left to right):

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

次の図は、関係する各ステップの連鎖の概要 (左から右) を示します。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

![Overview Schema](https://cheatsheetseries.owasp.org/assets/Abuse_Case_Cheat_Sheet_Overview.png)

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Proposal

The proposal will focus on the output of the workshop explained in the previous section.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 提案

この提案は、前のセクションで説明したワークショップの出力に焦点を当てます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Step 1: Preparation of the workshop

First, even if it seems obvious, the key business people must be sure to know, understand and be able to explain the business features that will be processed during the workshop.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### ステップ 1: ワークショップの準備

まず、当然に思えるとしても、主要なビジネス担当者は、ワークショップで処理されるビジネス機能を知り、理解し、説明できるようにしておく必要があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Secondly, create a new Microsoft Excel file (you can also use Google Sheets or any other similar software) with the following sheets (or tabs):

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

次に、次のシート (またはタブ) を持つ新しい Microsoft Excel ファイル (Google Sheets やその他の同様のソフトウェアも使用できます) を作成します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- **FEATURES**
    - Will contain a table with the list of business features planned for the workshop.
- **ABUSE CASES**
    - Will contain a table with all abuse cases identified during the workshop.
- **COUNTERMEASURES**
    - Will contain a table with the list of possible countermeasures (light description) imagined for the abuse cases identified.
    - This sheet is not mandatory, but it can be useful (for an abuse case to know), if a fix is easy to implement and then can impact the risk rating.
    - Countermeasures can be identified by the AppSec profile during the workshop, because an AppSec person must be able to perform attacks but also to build or identify defenses (it is not always the case for the Pentester profile because this person's focus is generally on the attack side only, so, the combination Pentester + AppSec is very efficient to have a 360 degree view).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- **FEATURES**
    - ワークショップで予定されているビジネス機能のリストを含むテーブルを保持します。
- **ABUSE CASES**
    - ワークショップ中に特定されたすべての悪用ケースを含むテーブルを保持します。
- **COUNTERMEASURES**
    - 特定された悪用ケースに対して想定される可能な対策のリスト (簡単な説明) を含むテーブルを保持します。
    - このシートは必須ではありませんが、修正が実装しやすいかどうかを悪用ケースごとに知り、それがリスク評価に影響する可能性があるため、有用な場合があります。
    - 対策はワークショップ中に AppSec プロファイルによって特定できます。AppSec 担当者は攻撃を実行できるだけでなく、防御を構築または特定できなければならないためです (ペネトレーションテスターのプロファイルでは常にそうとは限りません。この人物の焦点は一般に攻撃側だけにあるため、Pentester + AppSec の組み合わせは 360 度の視点を持つうえで非常に効果的です)。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

This is the representation of each sheet along with an example of content that will be filled during the workshop:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

これは、各シートの表現と、ワークショップ中に入力される内容の例です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

_FEATURES_ sheet:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

_FEATURES_ シート:

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

| Feature unique ID |     Feature name      |           Feature short description           |
| :---------------: | :-------------------: | :-------------------------------------------: |
|    FEATURE_001    | DocumentUploadFeature | Allow user to upload document along a message |

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

| Feature unique ID |     Feature name      |           Feature short description           |
| :---------------: | :-------------------: | :-------------------------------------------: |
|    FEATURE_001    | DocumentUploadFeature | Allow user to upload document along a message |

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

_COUNTERMEASURES_ sheet:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

_COUNTERMEASURES_ シート:

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

| Countermeasure unique ID | Countermeasure short description                       | Countermeasure help/hint                                |
| ------------------------ | ------------------------------------------------------ | ------------------------------------------------------- |
| DEFENSE_001              | Validate the uploaded file by loading it into a parser | Use advice from the OWASP Cheat Sheet about file upload |

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

| Countermeasure unique ID | Countermeasure short description                       | Countermeasure help/hint                                |
| ------------------------ | ------------------------------------------------------ | ------------------------------------------------------- |
| DEFENSE_001              | Validate the uploaded file by loading it into a parser | Use advice from the OWASP Cheat Sheet about file upload |

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

_ABUSE CASES_ sheet:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

_ABUSE CASES_ シート:

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

| Abuse case unique ID | Feature ID impacted |                     Abuse case's attack description                     | Attack referential ID (if applicable) | CVSS V3 risk rating (score) |                CVSS V3 string                | Kind of abuse case | Countermeasure ID applicable | Handling decision (To Address or Risk Accepted) |
| :------------------: | :-----------------: | :---------------------------------------------------------------------: | :-----------------------------------: | :-------------------------: | :------------------------------------------: | :----------------: | :--------------------------: | :---------------------------------------------: |
|    ABUSE_CASE_001    |     FEATURE_001     | Upload Office file with malicious macro in charge of dropping a malware |               CAPEC-17                |         HIGH (7.7)          | CVSS:3.0/AV:N/AC:H/PR:L/UI:R/S:C/C:N/I:H/A:H |     Technical      |         DEFENSE_001          |                   To Address                    |

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

| Abuse case unique ID | Feature ID impacted |                     Abuse case's attack description                     | Attack referential ID (if applicable) | CVSS V3 risk rating (score) |                CVSS V3 string                | Kind of abuse case | Countermeasure ID applicable | Handling decision (To Address or Risk Accepted) |
| :------------------: | :-----------------: | :---------------------------------------------------------------------: | :-----------------------------------: | :-------------------------: | :------------------------------------------: | :----------------: | :--------------------------: | :---------------------------------------------: |
|    ABUSE_CASE_001    |     FEATURE_001     | Upload Office file with malicious macro in charge of dropping a malware |               CAPEC-17                |         HIGH (7.7)          | CVSS:3.0/AV:N/AC:H/PR:L/UI:R/S:C/C:N/I:H/A:H |     Technical      |         DEFENSE_001          |                   To Address                    |

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Step 2: During the workshop

Use the spreadsheet to review all the features.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### ステップ 2: ワークショップ中

スプレッドシートを使用して、すべての機能をレビューします。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

For each feature, follow this flow:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

各機能について、次の流れに従います。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

1. Key business people explain the current feature from a business point of view.
2. Penetration testers propose and explain a set of attacks that they can perform against the feature.
3. For each attack proposed:
   1. Appsec proposes a countermeasure and a preferred set up location (infrastructure, network, code, design...).
   2. Technical people give feedback about the feasibility of the proposed countermeasure.
   3. Penetration testers use the CVSS v3 (or other standard) calculator to determine a risk rating. (ex: [CVSS V3 calculator](https://www.first.org/cvss/calculator/3.0))
   4. Risk leaders should accept or modify the risk rating to determine the final risk score which accurately reflects the real business impact for the company.

4. Business, Risk, and Technical leaders should find a consensus and filter the list of abuses for the current feature to keep the ones that must be addressed, and then flag them accordingly in the _ABUSE CASES_ sheet (**if risk is accepted then add a comment to explain why**).
5. Pass to next feature...

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

1. 主要なビジネス担当者が、現在の機能をビジネスの観点から説明します。
2. ペネトレーションテスターが、その機能に対して実行できる一連の攻撃を提案し説明します。
3. 提案された各攻撃について:
   1. AppSec が対策と望ましい設置場所 (インフラストラクチャ、ネットワーク、コード、設計など) を提案します。
   2. 技術担当者が、提案された対策の実現可能性についてフィードバックします。
   3. ペネトレーションテスターが CVSS v3 (または他の標準) 計算機を使用してリスク評価を決定します。(例: [CVSS V3 calculator](https://www.first.org/cvss/calculator/3.0))
   4. リスクリーダーは、会社にとっての実際のビジネス影響を正確に反映する最終リスクスコアを決定するため、リスク評価を受け入れるか修正すべきです。

4. ビジネス、リスク、技術の各リーダーは合意を形成し、現在の機能に対する悪用のリストをフィルタリングして、対応しなければならないものを残し、それに応じて _ABUSE CASES_ シートでフラグを付けるべきです (**リスクを受け入れる場合は、その理由を説明するコメントを追加します**)。
5. 次の機能に進みます...

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

If the presence of penetration testers is not possible then you can use the following references to identify the applicable attacks on your features:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

ペネトレーションテスターの参加が不可能な場合は、機能に適用できる攻撃を特定するために次の参考資料を使用できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- [OWASP Automated Threats to Web Applications](https://owasp.org/www-project-automated-threats-to-web-applications/)
- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/stable/)
- [OWASP Mobile Testing Guide](https://github.com/OWASP/owasp-mstg)
- [Common Attack Pattern Enumeration and Classification (CAPEC)](https://capec.mitre.org/)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- [OWASP Automated Threats to Web Applications](https://owasp.org/www-project-automated-threats-to-web-applications/)
- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/stable/)
- [OWASP Mobile Testing Guide](https://github.com/OWASP/owasp-mstg)
- [Common Attack Pattern Enumeration and Classification (CAPEC)](https://capec.mitre.org/)

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Important note on attacks and countermeasure knowledge base(s):

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

攻撃と対策のナレッジベースに関する重要な注意:

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```text
With time and experience across projects, you will obtain your own dictionary of attacks and countermeasures
that are applicable to the kind of application in your business domain.

This dictionary will speed up the future workshops in a significant way.

To promote the creation of this dictionary, you can, at the end of the project/sprint, gather the list
of attacks and countermeasures identified in a central location (wiki, database, file...) that will be
used during the next workshop in combination with input from penetration testers.
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Step 3: After the workshop

The spreadsheet contains (at this stage) the list of all abuse cases that must be handled and, potentially (depending on the capacity) corresponding countermeasures.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### ステップ 3: ワークショップ後

この段階で、スプレッドシートには、処理しなければならないすべての悪用ケースのリストと、場合によっては (キャパシティに応じて) 対応する対策が含まれています。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Now, there are two remaining task:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

ここで、残るタスクは二つあります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

1. Key business people must update the specification of each feature (waterfall) or the User Story of each feature (agile) to include the associated abuse cases as Security Requirements (waterfall) or Acceptance Criteria (agile).
2. Key technical people must evaluate the overhead in terms of expense/effort to take into account the countermeasure.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

1. 主要なビジネス担当者は、関連する悪用ケースをセキュリティ要件 (ウォーターフォール) または受け入れ基準 (アジャイル) として含めるため、各機能の仕様 (ウォーターフォール) または各機能のユーザーストーリー (アジャイル) を更新しなければなりません。
2. 主要な技術担当者は、対策を考慮に入れるための費用や工数の面での追加負荷を評価しなければなりません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Step 4: During implementation - Abuse cases handling tracking

In order to track the handling of all the abuse cases, the following approach can be used:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### ステップ 4: 実装中 - 悪用ケース対応の追跡

すべての悪用ケースの対応を追跡するために、次のアプローチを使用できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

If one or several abuse cases are handled at:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

一つまたは複数の悪用ケースが次の場所で処理される場合:

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- **Design, Infrastructure or Network level**
    - Make a note in the documentation or schema to indicate that _This design/network/infrastructure takes into account the abuse cases ABUSE_CASE_001, ABUSE_CASE_002, ABUSE_CASE_xxx_.
- **Code level**
    - Put a special comment in the classes/scripts/modules to indicate that _This class/module/script takes into account the abuse cases ABUSE_CASE_001, ABUSE_CASE_002, ABUSE_CASE_xxx_.
    - Dedicated annotation like `@AbuseCase(ids=&#123;"ABUSE_CASE_001","ABUSE_CASE_002"&#125;)` can be used to facilitate tracking and allow identification into integrated development environment.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- **設計、インフラストラクチャ、またはネットワークレベル**
    - ドキュメントまたは図に、_この設計/ネットワーク/インフラストラクチャは悪用ケース ABUSE_CASE_001, ABUSE_CASE_002, ABUSE_CASE_xxx を考慮している_ことを示す注記を作成します。
- **コードレベル**
    - クラス、スクリプト、モジュールに、_このクラス/モジュール/スクリプトは悪用ケース ABUSE_CASE_001, ABUSE_CASE_002, ABUSE_CASE_xxx を考慮している_ことを示す特別なコメントを配置します。
    - `@AbuseCase(ids=&#123;"ABUSE_CASE_001","ABUSE_CASE_002"&#125;)` のような専用アノテーションを使用して、追跡を容易にし、統合開発環境内で識別できるようにできます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Using this way, it becomes possible (via some minor scripting) to identify where abuse cases are addressed.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

この方法を使用すると、(多少のスクリプトによって) 悪用ケースがどこで対処されているかを特定できるようになります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Step 5: During implementation - Abuse cases handling validation

As abuse cases are defined, it is possible to put in place automated or manual validations to ensure that:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### ステップ 5: 実装中 - 悪用ケース対応の検証

悪用ケースが定義されているため、次のことを確実にするための自動または手動の検証を配置できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- All the selected abuse cases are handled.
- An abuse case is correctly/completely handled.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- 選択されたすべての悪用ケースが処理されている。
- 悪用ケースが正しく、完全に処理されている。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Validations can be of the following varieties:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

検証には次の種類があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Automated (run regularly at commit, daily or weekly in the Continuous Integration Jobs of the project):
    - Custom audit rules in Static Application Security Testing (SAST) or Dynamic Application Security Testing (DAST) tools.
    - Dedicated unit, integration or functional security oriented tests.
    - ...
- Manual:
    - Security code review between project's peers during the design or implementation.
    - Provide the list of all abuse cases addressed to pentesters so that they may validate the protection efficiency for each abuse case during an intrusion test against the application (the pentester will validate that the attacks identified are no longer effective and will also try to find other possible attacks).
    - ...

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- 自動 (プロジェクトの継続的インテグレーションジョブで、コミット時、毎日、または毎週、定期的に実行):
    - Static Application Security Testing (SAST) または Dynamic Application Security Testing (DAST) ツールのカスタム監査ルール。
    - 専用の単体、結合、または機能のセキュリティ指向テスト。
    - ...
- 手動:
    - 設計または実装中におけるプロジェクトの同僚間のセキュリティコードレビュー。
    - 対応済みのすべての悪用ケースのリストをペネトレーションテスターに提供し、アプリケーションに対する侵入テスト中に、各悪用ケースについて保護の有効性を検証できるようにします (ペネトレーションテスターは、特定された攻撃がもはや有効でないことを検証し、他の可能な攻撃も探します)。
    - ...

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Adding automated tests also allow teams to track the effectiveness of countermeasures against abuse cases and determine if the countermeasures are still in place during a maintenance or bug fixing phase of a project (to prevent accidental removal/disabling). It is also useful when a [Continuous Delivery](https://continuousdelivery.com/) approach is used, to ensure that all abuse cases protections are in place before opening access to the application.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

自動テストを追加すると、チームは悪用ケースに対する対策の有効性を追跡し、プロジェクトの保守またはバグ修正フェーズ中に対策がまだ配置されているかどうかを判断できます (偶発的な削除や無効化を防ぐため)。また、[Continuous Delivery](https://continuousdelivery.com/) アプローチを使用する場合、アプリケーションへのアクセスを開放する前に、すべての悪用ケース保護が配置されていることを確実にするためにも有用です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Example of derivation of Abuse Cases as User Stories

The following section shows an example of derivation of Abuse Cases as User Stories, here using the [OWASP TOP 10](https://owasp.org/www-project-top-ten/) as input source.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 悪用ケースをユーザーストーリーとして導出する例

次のセクションでは、入力ソースとして [OWASP TOP 10](https://owasp.org/www-project-top-ten/) を使用した、悪用ケースをユーザーストーリーとして導出する例を示します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Threat Oriented Personas:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

脅威指向ペルソナ:

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Malicious User
- Abusive User
- Unknowing User

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- 悪意あるユーザー
- 乱用するユーザー
- 知識のないユーザー

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### A1:2017-Injection

_Epic:_

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### A1:2017-Injection

_エピック:_

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Almost any source of data can be an injection vector, environment variables, parameters, external and internal web services, and all types of users. [Injection](https://owasp.org/www-community/Injection_Flaws) flaws occur when an attacker can send hostile data to an interpreter.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

ほとんどすべてのデータソースはインジェクションベクターになり得ます。環境変数、パラメータ、外部および内部 Web サービス、そしてあらゆる種類のユーザーが含まれます。[Injection](https://owasp.org/www-community/Injection_Flaws) の欠陥は、攻撃者がインタプリタに敵対的なデータを送信できる場合に発生します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

_Abuse Case:_

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

_悪用ケース:_

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

As an attacker, I will perform an injection attack (SQL, LDAP, XPath, or NoSQL queries, OS commands, XML parsers, SMTP headers, expression languages, and ORM queries) against input fields of the User or API interfaces

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

攻撃者として、私はユーザーまたは API インターフェースの入力フィールドに対して、インジェクション攻撃 (SQL、LDAP、XPath、NoSQL クエリ、OS コマンド、XML パーサー、SMTP ヘッダー、式言語、ORM クエリ) を実行します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### A2:2017-Broken Authentication

_Epic:_

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### A2:2017-Broken Authentication

_エピック:_

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Attackers have access to hundreds of millions of valid username and password combinations for credential stuffing, default administrative account lists, automated brute force, and dictionary attack tools. Session management attacks are well understood, particularly in relation to unexpired session tokens.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

攻撃者は、クレデンシャルスタッフィング、デフォルト管理者アカウントリスト、自動ブルートフォース、辞書攻撃ツールのために、何億もの有効なユーザー名とパスワードの組み合わせにアクセスできます。セッション管理攻撃は、特に期限切れにならないセッショントークンとの関係でよく理解されています。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

_Abuse Case:_

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

_悪用ケース:_

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

As an attacker, I have access to hundreds of millions of valid username and password combinations for credential stuffing.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

攻撃者として、私はクレデンシャルスタッフィングのために、何億もの有効なユーザー名とパスワードの組み合わせにアクセスできます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

_Abuse Case:_

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

_悪用ケース:_

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

As an attacker, I have default administrative account lists, automated brute force, and dictionary attack tools I use against login areas of the application and support systems.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

攻撃者として、私はアプリケーションと支援システムのログイン領域に対して使用する、デフォルト管理者アカウントリスト、自動ブルートフォース、辞書攻撃ツールを持っています。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

_Abuse Case:_

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

_悪用ケース:_

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

As an attacker, I manipulate session tokens using expired and fake tokens to gain access.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

攻撃者として、私は期限切れトークンや偽トークンを使用してセッショントークンを操作し、アクセスを取得します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### A3:2017-Sensitive Data Exposure

_Epic:_

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### A3:2017-Sensitive Data Exposure

_エピック:_

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Rather than directly attacking crypto, attackers steal keys, execute man-in-the-middle attacks, or steal clear text data off the server, while in transit, or from the user's client, e.g. browser. A manual attack is generally required. Previously retrieved password databases could be brute forced by Graphics Processing Units (GPUs).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

攻撃者は暗号を直接攻撃するのではなく、鍵を盗む、中間者攻撃を実行する、サーバー上、転送中、またはユーザーのクライアント (例: ブラウザ) から平文データを盗むことがあります。一般に手動攻撃が必要です。以前に取得されたパスワードデータベースは、Graphics Processing Units (GPUs) によってブルートフォースされる可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

_Abuse Case:_

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

_悪用ケース:_

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

As an attacker, I steal keys that were exposed in the application to get unauthorized access to the application or system.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

攻撃者として、私はアプリケーションまたはシステムへの不正アクセスを得るために、アプリケーション内で露出した鍵を盗みます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

_Abuse Case:_

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

_悪用ケース:_

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

As an attacker, I execute man-in-the-middle attacks to get access to traffic and leverage it to obtain sensitive data and possibly get unauthorized access to the application.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

攻撃者として、私はトラフィックへアクセスし、それを利用して機微データを取得し、場合によってはアプリケーションへの不正アクセスを得るために、中間者攻撃を実行します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

_Abuse Case:_

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

_悪用ケース:_

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

As an attacker, I steal clear text data off the server, while in transit, or from the user's client, e.g. browser to get unauthorized access to the application or system.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

攻撃者として、私はアプリケーションまたはシステムへの不正アクセスを得るために、サーバー上、転送中、またはユーザーのクライアント (例: ブラウザ) から平文データを盗みます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

_Abuse Case:_

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

_悪用ケース:_

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

As an attacker, I find and target old or weak cryptographic algorithms by capturing traffic and breaking the encryption.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

攻撃者として、私はトラフィックを取得して暗号を破ることにより、古い、または弱い暗号アルゴリズムを見つけて標的にします。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### A4:2017-XML External Entities (XXE)

_Epic:_

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### A4:2017-XML External Entities (XXE)

_エピック:_

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Attackers can exploit vulnerable XML processors if they can upload XML or include hostile content in an XML document, exploiting vulnerable code, dependencies or integrations.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

攻撃者は、XML をアップロードできる場合、または XML 文書に敵対的なコンテンツを含められる場合、脆弱な XML プロセッサを悪用し、脆弱なコード、依存関係、またはインテグレーションを悪用できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

_Abuse Case:_

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

_悪用ケース:_

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

As an attacker, I exploit vulnerable areas of the application where the user or system can upload XML to extract data, execute a remote request from the server, scan internal systems, perform a denial-of-service attack, as well as execute other attacks.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

攻撃者として、私はユーザーまたはシステムが XML をアップロードできるアプリケーションの脆弱な領域を悪用し、データの抽出、サーバーからのリモートリクエストの実行、内部システムのスキャン、サービス拒否攻撃の実行、およびその他の攻撃を行います。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

_Abuse Case:_

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

_悪用ケース:_

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

As an attacker, I include hostile content in an XML document which is uploaded to the application or system to extract data, execute a remote request from the server, scan internal systems, perform a denial-of-service attack, as well as execute other attacks.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

攻撃者として、私はアプリケーションまたはシステムにアップロードされる XML 文書に敵対的なコンテンツを含め、データの抽出、サーバーからのリモートリクエストの実行、内部システムのスキャン、サービス拒否攻撃の実行、およびその他の攻撃を行います。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

_Abuse Case:_

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

_悪用ケース:_

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

As an attacker, I include malicious XML code to exploit vulnerable code, dependencies or integrations to extract data, execute a remote request from the server, scan internal systems, perform a denial-of-service attack (e.g. Billion Laughs attack), as well as execute other attacks.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

攻撃者として、私は悪意のある XML コードを含め、脆弱なコード、依存関係、またはインテグレーションを悪用し、データの抽出、サーバーからのリモートリクエストの実行、内部システムのスキャン、サービス拒否攻撃 (例: Billion Laughs 攻撃) の実行、およびその他の攻撃を行います。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### A5:2017-Broken Access Control

_Epic:_

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### A5:2017-Broken Access Control

_エピック:_

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Exploitation of access control is a core skill of attackers. Access control is detectable using manual means, or possibly through automation for the absence of access controls in certain frameworks.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

アクセス制御の悪用は、攻撃者の中核的スキルです。アクセス制御は手動手段で検出でき、特定のフレームワークにおけるアクセス制御の欠如については、自動化によって検出できる可能性もあります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

_Abuse Case:_

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

_悪用ケース:_

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

As an attacker, I bypass access control checks by modifying the URL, internal application state, or the HTML page, or simply using a custom API attack tool.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

攻撃者として、私は URL、内部アプリケーション状態、HTML ページを変更するか、単にカスタム API 攻撃ツールを使用して、アクセス制御チェックをバイパスします。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

_Abuse Case:_

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

_悪用ケース:_

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

As an attacker, I manipulate the primary key and change it to access another's users record, allowing viewing or editing someone else's account.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

攻撃者として、私は主キーを操作して別のユーザーのレコードにアクセスするよう変更し、他人のアカウントを閲覧または編集できるようにします。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

_Abuse Case:_

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

_悪用ケース:_

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

As an attacker, I manipulate sessions, access tokens, or other access controls in the application to act as a user without being logged in, or acting as an admin/privileged user when logged in as a user.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

攻撃者として、私はアプリケーション内のセッション、アクセストークン、またはその他のアクセス制御を操作し、ログインせずにユーザーとして振る舞ったり、ユーザーとしてログインしているときに管理者または特権ユーザーとして振る舞ったりします。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

_Abuse Case:_

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

_悪用ケース:_

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

As an attacker, I leverage metadata manipulation, such as replaying or tampering with a JSON Web Token (JWT) access control token or a cookie or hidden field manipulated to elevate privileges or abusing JWT invalidation.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

攻撃者として、私は JSON Web Token (JWT) アクセス制御トークン、Cookie、隠しフィールドの再生や改ざんによって権限昇格したり、JWT の無効化を悪用したりするなど、メタデータ操作を利用します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

_Abuse Case:_

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

_悪用ケース:_

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

As an attacker, I exploit Cross-Origin Resource Sharing CORS misconfiguration allowing unauthorized API access.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

攻撃者として、私は Cross-Origin Resource Sharing (CORS) の設定ミスを悪用し、認可されていない API アクセスを可能にします。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

_Abuse Case:_

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

_悪用ケース:_

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

As an attacker, I force browsing to authenticated pages as an unauthenticated user or to privileged pages as a standard user.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

攻撃者として、私は未認証ユーザーとして認証済みページを強制閲覧したり、標準ユーザーとして特権ページを強制閲覧したりします。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

_Abuse Case:_

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

_悪用ケース:_

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

As an attacker, I access APIs with missing access controls for POST, PUT and DELETE.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

攻撃者として、私は POST、PUT、DELETE に対するアクセス制御が欠落している API にアクセスします。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

_Abuse Case:_

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

_悪用ケース:_

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

As an attacker, I target default crypto keys in use, weak crypto keys generated or re-used, or keys where rotation is missing.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

攻撃者として、私は使用中のデフォルト暗号鍵、生成または再利用された弱い暗号鍵、またはローテーションが欠落している鍵を標的にします。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

_Abuse Case:_

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

_悪用ケース:_

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

As an attacker, I find areas where the user agent (e.g. app, mail client) does not verify if the received server certificate is valid and perform attacks where I get unauthorized access to data.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

攻撃者として、私はユーザーエージェント (例: アプリ、メールクライアント) が受信したサーバー証明書の有効性を検証しない領域を見つけ、データへの不正アクセスを得る攻撃を実行します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### A6:2017-Security Misconfiguration

_Epic:_

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### A6:2017-Security Misconfiguration

_エピック:_

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Attackers will often attempt to exploit unpatched flaws or access default accounts, unused pages, unprotected files and directories, etc to gain unauthorized access or knowledge of the system.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

攻撃者は、不正アクセスやシステムに関する知識を得るため、未修正の欠陥、デフォルトアカウント、未使用ページ、保護されていないファイルやディレクトリなどを悪用しようとすることがよくあります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

_Abuse Case:_

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

_悪用ケース:_

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

As an attacker, I find and exploit missing appropriate security hardening configurations on any part of the application stack, or improperly configured permissions on cloud services.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

攻撃者として、私はアプリケーションスタックの任意の部分における適切なセキュリティ強化設定の欠落、またはクラウドサービス上の不適切に構成された権限を見つけて悪用します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

_Abuse Case:_

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

_悪用ケース:_

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

As an attacker, I find unnecessary features which are enabled or installed (e.g. unnecessary ports, services, pages, accounts, or privileges) and attack or exploit the weakness.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

攻撃者として、私は有効化またはインストールされている不要な機能 (例: 不要なポート、サービス、ページ、アカウント、権限) を見つけ、その弱点を攻撃または悪用します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

_Abuse Case:_

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

_悪用ケース:_

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

As an attacker, I use default accounts and their passwords to access systems, interfaces, or perform actions on components which I should not be able to.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

攻撃者として、私はアクセスできるべきではないシステムやインターフェースへアクセスしたり、コンポーネント上で実行できるべきではない操作を行うため、デフォルトアカウントとそのパスワードを使用します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

_Abuse Case:_

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

_悪用ケース:_

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

As an attacker, I find areas of the application where error handling reveals stack traces or other overly informative error messages I can use for further exploitation.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

攻撃者として、私はエラー処理がスタックトレースやその他の過度に情報量の多いエラーメッセージを明らかにするアプリケーション領域を見つけ、それをさらなる悪用に使用します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

_Abuse Case:_

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

_悪用ケース:_

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

As an attacker, I find areas where upgraded systems, latest security features are disabled or not configured securely.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

攻撃者として、私はアップグレードされたシステムや最新のセキュリティ機能が無効化されている、または安全に設定されていない領域を見つけます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

_Abuse Case:_

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

_悪用ケース:_

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

As an attacker, I find security settings in the application servers, application frameworks (e.g. Struts, Spring, ASP.NET), libraries, databases, etc. not set to secure values.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

攻撃者として、私はアプリケーションサーバー、アプリケーションフレームワーク (例: Struts、Spring、ASP.NET)、ライブラリ、データベースなどのセキュリティ設定が安全な値に設定されていないことを見つけます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

_Abuse Case:_

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

_悪用ケース:_

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

As an attacker, I find the server does not send security headers or directives or are set to insecure values.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

攻撃者として、私はサーバーがセキュリティヘッダーやディレクティブを送信しない、または安全でない値に設定されていることを見つけます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### A7:2017-Cross-Site Scripting (XSS)

_Epic:_

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### A7:2017-Cross-Site Scripting (XSS)

_エピック:_

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

XSS is the second most prevalent issue in the OWASP Top 10, and is found in around two-thirds of all applications.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

XSS は OWASP Top 10 で二番目に多い問題であり、全アプリケーションのおよそ三分の二で見つかります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

_Abuse Case:_

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

_悪用ケース:_

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

As an attacker, I perform reflected XSS where the application or API includes unvalidated and unescaped user input as part of HTML output. My successful attack can allow the attacker to execute arbitrary HTML and JavaScript in my victim's browser. Typically the victim will need to interact with some malicious link that points to an attacker-controlled page, such as malicious watering hole websites, advertisements, or similar.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

攻撃者として、私はアプリケーションまたは API が未検証かつエスケープされていないユーザー入力を HTML 出力の一部として含める場所で、反射型 XSS を実行します。攻撃が成功すると、攻撃者は被害者のブラウザで任意の HTML と JavaScript を実行できます。通常、被害者は、悪意のある watering hole Web サイト、広告、または類似のものなど、攻撃者が制御するページを指す悪意あるリンクとやり取りする必要があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

_Abuse Case:_

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

_悪用ケース:_

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

As an attacker, I perform stored XSS where the application or API stores unsanitized user input that is viewed at a later time by another user or an administrator.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

攻撃者として、私はアプリケーションまたは API がサニタイズされていないユーザー入力を保存し、それが後で別のユーザーまたは管理者によって閲覧される場所で、保存型 XSS を実行します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

_Abuse Case:_

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

_悪用ケース:_

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

As an attacker, I perform DOM XSS where JavaScript frameworks, single-page applications, and APIs that dynamically include attacker-controllable data to a page is vulnerable to DOM XSS.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

攻撃者として、私は JavaScript フレームワーク、シングルページアプリケーション、API が攻撃者に制御可能なデータをページへ動的に含め、DOM XSS に対して脆弱な場所で、DOM XSS を実行します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### A8:2017-Insecure Deserialization

_Epic:_

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### A8:2017-Insecure Deserialization

_エピック:_

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Exploitation of deserialization is somewhat difficult, as off-the-shelf exploits rarely work without changes or tweaks to the underlying exploit code.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

デシリアライゼーションの悪用はやや困難です。既製のエクスプロイトは、基盤となるエクスプロイトコードへの変更や調整なしにはほとんど機能しないためです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

_Abuse Case:_

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

_悪用ケース:_

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

As an attacker, I find areas of the application and APIs where deserialization of hostile or tampered objects can be supplied. As a result, I can focus on an object and data structure related attacks where the attacker modifies application logic or achieves arbitrary remote code execution if there are classes available to the application that can change behavior during or after deserialization. Or I focus on data tampering attacks such as access-control-related attacks where existing data structures are used but the content is changed.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

攻撃者として、私は敵対的または改ざんされたオブジェクトのデシリアライゼーションを供給できるアプリケーションや API の領域を見つけます。その結果、攻撃者がアプリケーションロジックを変更したり、デシリアライゼーション中または後に振る舞いを変えられるクラスがアプリケーションで利用可能な場合に任意のリモートコード実行を達成したりする、オブジェクトおよびデータ構造関連の攻撃に注力できます。または、既存のデータ構造は使用されるが内容が変更される、アクセス制御関連攻撃などのデータ改ざん攻撃に注力します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### A9:2017-Using Components with Known Vulnerabilities

_Epic:_

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### A9:2017-Using Components with Known Vulnerabilities

_エピック:_

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

While it is easy to find already-written exploits for many known vulnerabilities, other vulnerabilities require concentrated effort to develop a custom exploit.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

多くの既知の脆弱性について既に書かれたエクスプロイトを見つけることは容易ですが、その他の脆弱性ではカスタムエクスプロイトを開発するために集中的な努力が必要です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

_Abuse Case:_

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

_悪用ケース:_

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

As an attacker, I find common open source or closed source packages with weaknesses and perform attacks against vulnerabilities and exploits which are disclosed

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

攻撃者として、私は弱点を持つ一般的なオープンソースまたはクローズドソースのパッケージを見つけ、公開されている脆弱性とエクスプロイトに対して攻撃を実行します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### A10:2017-Insufficient Logging & Monitoring

_Epic:_

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### A10:2017-Insufficient Logging & Monitoring

_エピック:_

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Exploitation of insufficient logging and monitoring is the bedrock of nearly every major incident. Attackers rely on the lack of monitoring and timely response to achieve their goals without being detected. In 2016, identifying a breach took an [average of 191 days](https://www-01.ibm.com/common/ssi/cgi-bin/ssialias?htmlfid=SEL03130WWEN) allowing substantial chance for damage to be inflicted.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

ログ記録と監視の不足の悪用は、ほぼすべての重大インシデントの基盤です。攻撃者は、検知されずに目的を達成するため、監視と適時対応の欠如に依存します。2016 年には、侵害の特定に[平均 191 日](https://www-01.ibm.com/common/ssi/cgi-bin/ssialias?htmlfid=SEL03130WWEN)かかり、被害が発生する大きな機会を与えていました。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

_Abuse Case:_

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

_悪用ケース:_

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

As an attacker, I attack an organization and the logs, monitoring systems, and teams do not see or respond to my attacks.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

攻撃者として、私は組織を攻撃し、ログ、監視システム、チームが私の攻撃を見たり対応したりしない状況を利用します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Sources of the schemas

All figures were created using [https://www.draw.io/](https://www.draw.io/) site and exported (as PNG image) for integration into this article.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 図のソース

すべての図は [https://www.draw.io/](https://www.draw.io/) サイトを使用して作成され、この記事に統合するために (PNG 画像として) エクスポートされました。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

All XML descriptor files for each schema are available below (using XML description, modification of the schema is possible using DRAW.IO site):

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

各図のすべての XML 記述子ファイルは以下で入手できます (XML 記述を使用し、DRAW.IO サイトで図を変更できます)。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

[Schemas descriptors archive](https://cheatsheetseries.owasp.org/assets/Abuse_Case_Cheat_Sheet_SchemaBundle.zip)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

[Schemas descriptors archive](https://cheatsheetseries.owasp.org/assets/Abuse_Case_Cheat_Sheet_SchemaBundle.zip)

</div>
</div>

</section>
</div>



## Attribution

<div className="attributionFooter">

- Original: Abuse Case Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Abuse_Case_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: English original retained for comparison. Japanese translation added. Bilingual display generated from official source and local Japanese translation.
- Retrieved: 2026-05-20

</div>
