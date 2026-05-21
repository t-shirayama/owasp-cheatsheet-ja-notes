---
title: Authorization Cheat Sheet
hide_title: true
---

<div className="docHero" data-category="authorization">
  <h1>認可チートシート</h1>
  <div className="docMeta">
    <span className="docPill">最終更新: 2026-05-20</span>
    <span className="docPill">読了時間: 約 12 分</span>
    <span className="docPill">カテゴリ: 認可</span>
  </div>
</div>

<p className="docLead">認可チートシートを、原文・翻訳・対比表示で確認できます。ASVS Index 対応の文脈で、公式原文と日本語訳を確認しやすく整理しています。</p>

<div className="tabbedContent">
  <input className="tabInput" type="radio" name="authorization-view" id="authorization-original" />
  <input className="tabInput" type="radio" name="authorization-view" id="authorization-translation" defaultChecked />
  <input className="tabInput" type="radio" name="authorization-view" id="authorization-bilingual" />

  <div className="contentTabs">
    <label htmlFor="authorization-original" title="OWASP 原文">原文</label>
    <label htmlFor="authorization-translation" title="日本語訳">翻訳</label>
    <label htmlFor="authorization-bilingual" title="原文と翻訳を並べて確認">対比表示</label>
  </div>

<section id="authorization-original-panel" className="tabPanel originalPanel contentPanel">

## Introduction

Authorization may be defined as "the process of verifying that a requested action or service is approved for a specific entity" ([NIST](https://csrc.nist.gov/glossary/term/authorization)). Authorization is distinct from authentication which is the process of verifying an entity's identity. When designing and developing a software solution, it is important to keep these distinctions in mind. A user who has been authenticated (perhaps by providing a username and password) is often not authorized to access every resource and perform every action that is technically possible through a system. For example, a web app may have both regular users and admins, with the admins being able to perform actions the average user is not privileged to perform, even though they have been authenticated. Additionally, authentication is not always required for accessing resources; an unauthenticated user may be authorized to access certain public resources, such as an image or login page, or even an entire web app.

The objective of this cheat sheet is to assist developers in implementing authorization logic that is robust, appropriate to the app's business context, maintainable, and scalable. The guidance provided in this cheat sheet should be applicable to all phases of the development lifecycle and flexible enough to meet the needs of diverse development environments.

Flaws related to authorization logic are a notable concern for web apps. Broken Access Control was ranked as the most concerning web security vulnerability in [OWASP's 2021 Top 10](https://owasp.org/Top10/A01_2021-Broken_Access_Control/) and asserted to have a "High" likelihood of exploit by [MITRE's CWE program](https://cwe.mitre.org/data/definitions/285.html). Furthermore, according to [Veracode's State of Software Vol. 10](https://www.veracode.com/sites/default/files/pdf/resources/sossreports/state-of-software-security-volume-10-veracode-report.pdf), Access Control was among the more common of OWASP's Top 10 risks to be involved in exploits and security incidents despite being among the least prevalent of those examined.

The potential impact resulting from exploitation of authorization flaws is highly variable, both in form and severity. Attackers may be able to read, create, modify, or delete resources that were meant to be protected (thus jeopardizing their confidentiality, integrity, and/or availability); however, the actual impact of such actions is necessarily linked to the criticality and sensitivity of the compromised resources. Thus, the business cost of a successfully exploited authorization flaw can range from very low to extremely high.

Both entirely unauthenticated outsiders and authenticated (but not necessarily authorized) users can take advantage of authorization weaknesses.  Although honest mistakes or carelessness on the part of non-malicious entities may enable authorization bypasses, malicious intent is typically required for access control threats to be fully realized.  Horizontal privilege elevation (i.e. being able to access another user's resources) is an especially common weakness that an authenticated user may be able to take advantage of. Faults related to authorization control can allow malicious insiders and outsiders alike to view, modify, or delete sensitive resources of all forms (databases records, static files, personally identifiable information (PII), etc.) or perform actions, such as creating a new account or initiating a costly order, that they should not be privileged to do. Furthermore, if logging related to access control is not properly set-up, such authorization violations may go undetected or at least remain unattributable to a particular individual or group.

## Recommendations

### Enforce Least Privileges

As a security concept, Least Privileges refers to the principle of assigning users only the minimum privileges necessary to complete their job. Although perhaps most commonly applied in system administration, this principle has relevance to the software developer as well. Least Privileges must be applied both horizontally and vertically. For example, even though both an accountant and sales representative may occupy the same level in an organization's hierarchy, both require access to different resources to perform their jobs. The accountant should likely not be granted access to a customer database and the sales representative should not be able to access payroll data. Similarly, the head of the sales department is likely to need more privileged access than their subordinates.

Failure to enforce least privileges in an application can jeopardize the confidentiality of sensitive resources. Mitigation strategies are applied primarily during the Architecture and Design phase (see [CWE-272](https://cwe.mitre.org/data/definitions/272.html)); however, the principle must be addressed throughout the SDLC.

Consider the following points and best practices:

- During the design phase, ensure trust boundaries are defined. Enumerate the types of users that will be accessing the system, the resources exposed and the operations (such as read, write, update, etc) that might be performed on those resources. For every combination of user type and resource, determine what operations, if any, the user (based on role and/or other attributes) must be able to perform on that resource. For an ABAC system ensure all categories of attributes are considered. For example, a Sales Representative may need to access a customer database from the internal network during working hours, but not from home at midnight.
- Create tests that validate that the permissions mapped out in the design phase are being correctly enforced.
- After the app has been deployed, periodically review permissions in the system for "privilege creep"; that is, ensure the privileges of users in the current environment do not exceed those defined during the design phase (plus or minus any formally approved changes).
- Remember, it is easier to grant users additional permissions rather than to take away some they previously enjoyed. Careful planning and implementation of Least Privileges early in the SDLC can help reduce the risk of needing to revoke permissions that are later deemed overly broad.

### Deny by Default

Even when no access control rules are explicitly matched, the application cannot remain neutral when an entity is requesting access to a particular resource. The application must always make a decision, whether implicitly or explicitly, to either deny or permit the requested access. Logic errors and other mistakes relating to access control may happen, especially when access requirements are complex; consequently, one should not rely entirely on explicitly defined rules for matching all possible requests. For security purposes an application should be configured to deny access by default.

Consider the following points and best practices:

- Adopt a "deny-by-default" mentality both during initial development and whenever new functionality or resources are exposed by the app. One should be able to explicitly justify why a specific permission was granted to a particular user or group rather than assuming access to be the default position.
- Although some frameworks or libraries may themselves adopt a deny-by-default strategy, explicit configuration should be preferred over relying on framework or library defaults. The logic and defaults of third-party code may evolve over time, without the developer's full knowledge or understanding of the change's implications for a particular project.

### Validate the Permissions on Every Request

Permission should be validated correctly on every request, regardless of whether the request was initiated by an AJAX script, server-side, or any other source. The technology used to perform such checks should allow for global, application-wide configuration rather than needing to be applied individually to every method or class. Remember an attacker only needs to find one way in. Even if just a single access control check is "missed", the confidentiality and/or integrity of a resource can be jeopardized. Validating permissions correctly on just the majority of requests is insufficient. Specific technologies that can help developers in performing such consistent permission checks include the following:

- [Java/Jakarta EE Filters](https://jakarta.ee/specifications/platform/8/apidocs/javax/servlet/Filter.html) including implementations in [Spring Security](https://docs.spring.io/spring-security/site/docs/5.4.0/reference/html5/#servlet-security-filters)
- [Middleware in the Django Framework](https://docs.djangoproject.com/en/4.0/ref/middleware/)
- [.NET Core Filters](https://docs.microsoft.com/en-us/aspnet/core/mvc/controllers/filters?view=aspnetcore-3.1#authorization-filters)
- [Middleware in the Laravel PHP Framework](https://laravel.com/docs/8.x/middleware)

### Thoroughly Review the Authorization Logic of Chosen Tools and Technologies, Implementing Custom Logic if Necessary

Today's developers have access to vast amounts of libraries, platforms, and frameworks that allow them to incorporate robust, complex logic into their apps with minimal effort. However, these frameworks and libraries must not be viewed as a quick panacea for all development problems; developers have a duty to use such frameworks responsibly and wisely. Two general concerns relevant to framework/library selection as relevant to proper access control are misconfiguration/lack of configuration on the part of the developer and vulnerabilities within the components themselves (see [A6](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A6-Security_Misconfiguration) and [A9](https://owasp.org/www-project-top-ten/2017/A9_2017-Using_Components_with_Known_Vulnerabilities.html) for general guidance on these topics).

Even in an otherwise securely developed application, vulnerabilities in third-party components can allow an attacker to bypass normal authorization controls. Such concerns need not be restricted to unproven or poorly maintained projects, but affect even the most robust and popular libraries and frameworks. Writing complex, secure software is hard. Even the most competent developers, working on high-quality libraries and frameworks, will make mistakes. Assume any third-party component you incorporate into an application *could* be or become subject to an authorization vulnerability. Important considerations include:

- Create, maintain, and follow processes for detecting and responding to vulnerable components.
- Incorporate tools such as [Dependency Check](https://owasp.org/www-project-dependency-check/) into the SDLC and consider subscribing to data feeds from vendors, [the NVD](https://nvd.nist.gov/vuln/data-feeds), or other relevant sources.
- Implement defense in depth. Do not depend on any single framework, library, technology, or control to be the sole thing enforcing proper access control.

Misconfiguration (or complete lack of configuration) is another major area in which the components developers build upon can lead to broken authorization.  These components are typically intended to be relatively general purpose tools made to appeal to a wide audience. For all but the simplest use cases, these frameworks and libraries must be customized or supplemented with additional logic in order to meet the unique requirements of a particular app or environment. This consideration is especially important when security requirements, including authorization, are concerned. Notable configuration considerations for authorization include the following:

- Take time to thoroughly understand any technology you build authorization logic upon. Analyze the technology's capabilities with an understanding that *the authorization logic provided by the component may be insufficient for your application's specific security requirements*. Relying on prebuilt logic may be convenient, but this does not mean it is sufficient. Understand that custom authorization logic may well be necessary to meet an app's security requirements.
- Do not let the capabilities of any library, platform, or framework guide your authorization requirements. Rather, authorization requirements should be decided first and then the third-party components may be analyzed in light of these requirements.
- Do not rely on default configurations.
- Test configuration. Do not just assume any configuration performed on a third-party component will work exactly as intended in your particular environment. Documentation can be misunderstood, vague, outdated, or simply inaccurate.

### Prefer Attribute and Relationship Based Access Control over RBAC

In software engineering, two basic forms of access control are widely utilized: Role-Based Access Control (RBAC) and Attribute-Based Access Control (ABAC). There is a third, more recent, model which has gained popularity: Relationship-Based Access Control (ReBAC). The decision between the models has significant implications for the entire SDLC and should be made as early as possible.

- RBAC is a model of access control in which access is granted or denied based upon the roles assigned to a user. Permissions are not directly assigned to an entity; rather, permissions are associated with a role and the entity inherits the permissions of any roles assigned to it. Generally, the relationship between roles and users can be many-to-many, and roles may be hierarchical in nature.

- ABAC may be defined as an access control model where "subject requests to perform operations on objects are granted or denied based on assigned attributes of the subject, assigned attributes of the object, environment conditions, and a set of policies that are specified in terms of those attributes and conditions" ([NIST SP 800-162](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-162.pdf), pg. 7). As defined in NIST SP 800-162, attributes are simply characteristics that can be represented as name-value pairs and assigned to a subject, object, or the environment. Job role, time of day, project name, MAC address, and creation date are but a very small sampling of possible attributes that highlight the flexibility of ABAC implementations.

- ReBAC is an access control model that grants access based on the relationships between resources. For instance, allowing only the user who created a post to edit it. This is especially necessary in social network applications, like Twitter or Facebook, where users want to limit access to their data (tweets or posts) to people they choose (friends, family, followers).

Although RBAC has a long history and remains popular among software developers today, ABAC and ReBAC should typically be preferred for application development. Their advantages over RBAC include:

- **Support fine-grained, complex Boolean logic**. In RBAC, access decisions are made on the presence or absence of roles; that is, the main characteristic of a requesting entity considered is the role(s) assigned to it. Such simplistic logic does a poor job of supporting object-level or horizontal access control decisions and those that require multiple factors.

    - ABAC greatly expands both the number and type of characteristics that can be considered. In ABAC, a "role" or job function can certainly be one attribute assigned to a subject, but it need not be considered in isolation (or at all if this characteristic is not relevant to the particular access requested). Furthermore, ABAC can incorporate environmental and other dynamic attributes, such as time of day, type of device used, and geographic location. Denying access to a sensitive resource outside of normal business hours or if a user has not recently completed mandatory training are just a couple of examples where ABAC could meet access control requirements that RBAC would struggle to fulfill. Thus, ABAC is more effective than RBAC in addressing the principle of least privileges.
    - ReBAC, since it supports assigning relationships between direct objects and direct users (and not just a role), allows for fine-grained permissions. Some systems also support algebraic operators like AND and NOT to express policies like "if this user has relationship X but not relationship Y with the object, then grant access".

- **Robustness**. In large projects or when numerous roles are present, it is easy to miss or improperly perform role checks ([OWASP C7: Enforce Access Controls](https://owasp.org/www-project-proactive-controls/v3/en/c7-enforce-access-controls)). This can result in both too much and too little access. This is especially true in RBAC implementations where a role hierarchy is not present and multiple role checks must be chained to have the desired impact (i.e., `if(user.hasAnyRole("SUPERUSER", "ADMIN", "ACCT_MANAGER"))` ).
- **Speed**. In RBAC, "role explosion" can occur when a system defines too many roles. If users send their credential and roles through means like HTTP headers, which have size limits, there may not be enough space to include all of the user's roles. A viable workaround to this problem is to only send the user ID, and then the application retrieves the user's roles, but this will increase the latency of every request.
- **Supports Multi-Tenancy and Cross-Organizational Requests**. RBAC is poorly suited for use cases where distinct organizations or customers will need access to the same set of protected resources. Meeting such requirements with RBAC would require highly cumbersome methods such as configuring rule sets for each customer in a multi-tenant environment or requiring pre-provisioning of identities for cross-organizational requests ([OWASP C7](https://owasp.org/www-project-proactive-controls/v3/en/c7-enforce-access-controls); [NIST SP 800-162](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-162.pdf)). By contrast, as long as attributes are consistently defined, ABAC implementations allow access control decisions to be "executed and administered in the same or separate infrastructures, while maintaining appropriate levels of security" ([NIST SP 800-162](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-162.pdf), pg. 6).
- **Ease of Management**. Although the initial setup for RBAC is often simpler than ABAC, this short-term benefit quickly vanishes as the scale and complexity of a system grows. In the beginning, a couple of simple roles, such as User and Admin, may suffice for some apps, but this is very unlikely to hold true for any length of time in production applications. As roles become more numerous, both testing and auditing, critical processes for establishing trust in one's codebase and logic, become more difficult ([OWASP C7](https://owasp.org/www-project-proactive-controls/v3/en/c7-enforce-access-controls)). By contrast, ABAC and ReBAC are far more expressive, incorporate attributes and Boolean logic that better reflects real-world concerns, are easier to update when access-control needs change, and encourages the separation of policy management from  enforcement and provisioning of identities ([NIST SP 800-162](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-162.pdf); see also [XACML-V3.0](https://docs.oasis-open.org/xacml/3.0/xacml-3.0-core-spec-os-en.html) for a standard that highlights these benefits)

### Ensure Lookup IDs are Not Accessible Even When Guessed or Cannot Be Tampered With

Applications often expose the internal object identifiers (such as an account number or Primary Key in a database) that are used to locate and reference an object. This ID may be exposed as a query parameter, path variable, "hidden" form field or elsewhere. For example:

```https://mybank.com/accountTransactions?acct_id=901```

Based on this URL, one could reasonably assume that the application will return a listing of transactions and that the transactions returned will be restricted to a particular account - the account indicated in the `acct_id` param. But what would happen if the user changed the value of the `acct_id` param to another value such as `523`. Will the user be able to view transactions associated with another account even if it does not belong to him? If not, will the failure simply be the result of the account "523" not existing/not being found or will it be due to a failed access control check? Although this example may be an oversimplification, it illustrates a very common security flaw in application development - [CWE 639: Authorization Bypass Through User-Controlled Key](https://cwe.mitre.org/data/definitions/639.html).  When exploited, this weakness can result in authorization bypasses, horizontal privilege escalation and, less commonly, vertical privilege escalation (see [CWE-639](https://cwe.mitre.org/data/definitions/639.html)). This type of vulnerability also represents a form of Insecure Direct Object Reference (IDOR). The following paragraphs will describe the weakness and possible mitigations.

 In the example above, the lookup ID was not only exposed to the user and readily tampered with, but also appears to have been a fairly predictable, perhaps sequential, value.  While one can use various techniques to mask or randomize these IDs and make them hard to guess, such an approach is generally not sufficient by itself. A user should not be able to access a resource they do not have permissions simply because they are able to guess and manipulate that object's identifier in a query param or elsewhere. Rather than relying on some form of security through obscurity, the focus should be on controlling access to the underlying objects and/or the identifiers themselves. Recommended mitigations for this weakness include the following:

- Avoid exposing identifiers to the user when possible. For example it should be possible to retrieve some objects, such as account details,  based solely on currently authenticated user's identity and attributes (e.g. through information contained in a securely implemented JSON Web Token (JWT) or server-side session).
- Implement user/session specific indirect references using a tool such as [OWASP ESAPI](https://owasp.org/www-project-enterprise-security-api/) (see [OWASP 2013 Top 10 - A4 Insecure Direct Object References](https://wiki.owasp.org/index.php/Top_10_2013-A4-Insecure_Direct_Object_References))
- Perform access control checks on *every* request for the *specific* object or functionality being accessed. Just because a user has access to an object of a particular type does not mean they should have access to every object of that particular type.

### Enforce Authorization Checks on Static Resources

The importance of securing static resources is often overlooked or at least overshadowed by other security concerns. Although securing databases and similar data stores often justly receive significant attention from security conscious teams, static resources must also be appropriately secured. Although unprotected static resources are certainly a problem for websites and web applications of all forms, in recent years, poorly secured resources in cloud storage offerings (such as Amazon S3 Buckets) have risen to prominence. When securing static resources, consider the following:

- Ensure that static resources are incorporated into access control policies. The type of protection required for static resources will necessarily be highly contextual. It may be perfectly acceptable for some static resources to be publicly accessible, while others should only be accessible when a highly restrictive set of user and environmental attributes are present. Understanding the type of data exposed in the specific resources under consideration is thus critical. Consider whether a formal Data Classification scheme should be established and incorporated into the application's access control logic (see [here](https://resources.infosecinstitute.com/information-and-asset-classification/) for an overview of data classification).
- Ensure any cloud based services used to store static resources are secured using the configuration options and tools provided by the vendor. Review the cloud provider's documentation (see guidance from [AWS](https://aws.amazon.com/premiumsupport/knowledge-center/secure-s3-resources/), [Google Cloud](https://cloud.google.com/storage/docs/best-practices#security) and [Azure](https://docs.microsoft.com/en-us/azure/storage/blobs/security-recommendations) for specific implementations details).
- When possible, protect static resources using the same access control logic and mechanisms that are used to secure other application resources and functionality.

### Verify that Authorization Checks are Performed in the Right Location

Developers must never rely on client-side access control checks. While such checks may be permissible for improving the user experience, they should never be the decisive factor in granting or denying access to a resource; client-side logic is often easy to bypass. Access control checks must be performed server-side, at the gateway, or using serverless function (see [OWASP ASVS 4.0.3, V1.4.1 and V4.1.1](https://raw.githubusercontent.com/OWASP/ASVS/v4.0.3/4.0/OWASP%20Application%20Security%20Verification%20Standard%204.0.3-en.pdf))

### Exit Safely when Authorization Checks Fail

Failed access control checks are a normal occurrence in a secured application; consequently, developers must plan for such failures and handle them securely. Improper handling of such failures can lead to the application being left in an unpredictable state ([CWE-280: Improper Handling of Insufficient Permissions or Privileges](https://cwe.mitre.org/data/definitions/280.html)). Specific recommendations include the following:

- Ensure all exception and failed access control checks are handled no matter how unlikely they seem ([OWASP Top Ten Proactive Controls C10: Handle all errors and exceptions](https://owasp.org/www-project-proactive-controls/v3/en/c10-errors-exceptions.html)). This does not mean that an application should always try to "correct" for a failed check; oftentimes a simple message or HTTP status code is all that is required.
- Centralize the logic for handling failed access control checks.
- Verify the handling of exception and authorization failures. Ensure that such failures, no matter how unlikely, do not put the software into an unstable state that could lead to authorization bypass.
- Ensure sensitive information, such as system logs or debugging output, is not exposed in error messages. Misconfigured error messages can increase the attack surface of your application. ([CWE-209: Generation of Error Message Containing Sensitive Information](https://cwe.mitre.org/data/definitions/209.html))

### Implement Appropriate Logging

Logging is one of the most important detective controls in application security; insufficient logging and monitoring is recognized as among  the most critical security risks in [OWASP's Top Ten 2021](https://owasp.org/Top10/A09_2021-Security_Logging_and_Monitoring_Failures/). Appropriate logs can not only detect malicious activity, but are also invaluable resources in post-incident investigations, can be used to troubleshoot access control and other security related problems, and are useful in security auditing. Though easy to overlook during the initial design and requirements phase, logging is an important component of holistic application security and must be incorporated into all phases of the SDLC. Recommendations for logging include the following:

- Log using consistent, well-defined formats that can be readily parsed for analysis. According to [OWASP Top Ten Proactive Controls C9](https://owasp.org/www-project-proactive-controls/v3/en/c9-security-logging.html), [Apache Logging Services](https://logging.apache.org/) is one example of a project that provides support for numerous languages and platforms
- Carefully determine the amount of information to log. This should be determined according to the specific application environment and requirements. Both too much and too little logging may be considered security weaknesses (see [CWE-778](https://cwe.mitre.org/data/definitions/778.html) and [CWE-779](https://cwe.mitre.org/data/definitions/779.html)). Too little logging can result in malicious activity going undetected and greatly reduce the effectiveness of post-incident analysis. Too much logging not only can strain resources and lead to excessive false positives, but may also result in sensitive data being needlessly logged.
- Ensure clocks and timezones are synchronized across systems. Accuracy is crucial in piecing together the sequence of an attack during and after incident response.
- Consider incorporating application logs into a centralized log server or SIEM.

### Create Unit and Integration Test Cases for Authorization Logic

Unit and integration testing are essential for verifying that an application performs as expected and consistently across changes. Flaws in access control logic can be subtle, particularly when requirements are complex; however, even a small logical or configuration error in access control can result in severe consequences. Although not a substitution for a dedicated security test or penetration test (see [OWASP WSTG 4.5](https://owasp.org/www-project-web-security-testing-guide/v42/4-Web_Application_Security_Testing/05-Authorization_Testing/README) for an excellent guide on this topic as it relates to access control), automated unit and integration testing of access control logic can help reduce the number of security flaws that make it into production. These tests are good at catching the "low-hanging fruit" of security issues but not more sophisticated attack vectors ([OWASP SAMM: Security Testing](https://owaspsamm.org/model/verification/security-testing/)).

Unit and integration testing should aim to incorporate many of the concepts explored in this document. For example, is access being denied by default? Does the application terminate safely when an access control check fails, even under abnormal conditions? Are ABAC policies being properly enforced? While simple unit and integration tests can never replace manual testing performed by a skilled hacker, they are an important tool for detecting and correcting security issues quickly and with far less resources than manual testing.

</section>

<section id="authorization-translation-panel" className="tabPanel translationPanel contentPanel">

## Introduction

認可は、「要求された操作またはサービスが特定のエンティティに対して承認されていることを検証するプロセス」と定義できます ([NIST](https://csrc.nist.gov/glossary/term/authorization))。認可は、エンティティの身元を検証するプロセスである認証とは異なります。ソフトウェアソリューションを設計、開発するときは、この違いを念頭に置くことが重要です。認証済みのユーザー、たとえばユーザー名とパスワードを提供したユーザーであっても、多くの場合、システムを通じて技術的に可能なすべてのリソースへのアクセスやすべての操作の実行を認可されているわけではありません。たとえば、Web アプリには一般ユーザーと管理者の両方が存在し、どちらも認証済みであっても、管理者は一般ユーザーに権限がない操作を実行できる場合があります。さらに、リソースへのアクセスに認証が常に必要とは限りません。未認証ユーザーが、画像、ログインページ、あるいは Web アプリ全体など、特定の公開リソースへのアクセスを認可される場合もあります。

このチートシートの目的は、アプリケーションのビジネスコンテキストに適合し、堅牢で、保守しやすく、スケール可能な認可ロジックを開発者が実装できるよう支援することです。このチートシートで提供するガイダンスは、開発ライフサイクルのすべてのフェーズに適用でき、多様な開発環境のニーズに対応できるだけの柔軟性を備えているべきです。

認可ロジックに関する欠陥は、Web アプリにとって注目すべき懸念事項です。Broken Access Control は [OWASP Top 10 2021](https://owasp.org/Top10/A01_2021-Broken_Access_Control/) で最も懸念される Web セキュリティ脆弱性としてランク付けされ、[MITRE の CWE プログラム](https://cwe.mitre.org/data/definitions/285.html) でも悪用される可能性が「High」とされています。さらに、[Veracode's State of Software Vol. 10](https://www.veracode.com/sites/default/files/pdf/resources/sossreports/state-of-software-security-volume-10-veracode-report.pdf) によると、Access Control は調査対象の OWASP Top 10 リスクの中では発生頻度が比較的低いにもかかわらず、悪用やセキュリティインシデントに関与することが比較的多いリスクの一つでした。

認可欠陥の悪用から生じる潜在的な影響は、形態と深刻度の両面で大きく変動します。攻撃者は、保護されるべきリソースを読み取り、作成、変更、削除できる可能性があり、その結果として機密性、完全性、可用性が損なわれます。ただし、そのような操作の実際の影響は、侵害されたリソースの重要性と機微性に必然的に結び付きます。したがって、認可欠陥の悪用に成功した場合のビジネス上のコストは、非常に低いものから極めて高いものまで幅があります。

完全に未認証の外部者も、認証済みだが必ずしも認可されていないユーザーも、認可の弱点を利用できます。悪意のないエンティティによる単純なミスや不注意が認可バイパスを可能にすることはありますが、アクセス制御の脅威が完全に現実化するには、通常は悪意が必要です。水平権限昇格、つまり別ユーザーのリソースにアクセスできる状態は、認証済みユーザーが悪用できる特に一般的な弱点です。認可制御に関する欠陥により、悪意のある内部者と外部者のどちらも、データベースレコード、静的ファイル、個人識別情報 (PII) など、あらゆる形態の機微なリソースを閲覧、変更、削除したり、新規アカウントの作成や高額な注文の開始など、本来権限がない操作を実行したりできます。さらに、アクセス制御に関するログが適切に設定されていない場合、そのような認可違反は検知されないか、少なくとも特定の個人またはグループに帰属できないままになる可能性があります。

## Recommendations

### Enforce Least Privileges

セキュリティ概念としての Least Privileges は、ユーザーに職務を完了するために必要な最小限の権限だけを割り当てる原則を指します。この原則はシステム管理で最もよく適用されるかもしれませんが、ソフトウェア開発者にも関係します。Least Privileges は水平方向と垂直方向の両方に適用しなければなりません。たとえば、会計担当者と営業担当者が組織階層上は同じレベルにいるとしても、それぞれが職務を実行するために必要なリソースは異なります。会計担当者には顧客データベースへのアクセスを付与すべきではない可能性が高く、営業担当者は給与データへアクセスできるべきではありません。同様に、営業部門の責任者は部下よりも高い権限のアクセスを必要とする可能性があります。

アプリケーションで最小権限を適用しないと、機微なリソースの機密性が危険にさらされる可能性があります。緩和策は主にアーキテクチャと設計フェーズで適用されますが ([CWE-272](https://cwe.mitre.org/data/definitions/272.html) を参照)、この原則は SDLC 全体を通じて扱わなければなりません。

次の点とベストプラクティスを検討してください。

- 設計フェーズでは、信頼境界が定義されていることを確認します。システムにアクセスするユーザー種別、公開されるリソース、それらのリソースに対して実行される可能性がある操作、たとえば読み取り、書き込み、更新などを列挙します。ユーザー種別とリソースのすべての組み合わせについて、ユーザーがロールやその他の属性に基づいてそのリソースに対してどの操作を実行できなければならないか、実行できる操作があるかを判断します。ABAC システムでは、すべての属性カテゴリが考慮されていることを確認します。たとえば、営業担当者は勤務時間中に内部ネットワークから顧客データベースへアクセスする必要があるかもしれませんが、深夜に自宅からアクセスする必要はありません。
- 設計フェーズで対応付けた権限が正しく適用されていることを検証するテストを作成します。
- アプリケーションをデプロイした後、システム内の権限を定期的にレビューし、「privilege creep」を確認します。つまり、現在の環境におけるユーザー権限が、設計フェーズで定義されたものを、正式に承認された変更を加味した範囲を超えていないことを確認します。
- ユーザーに追加権限を付与することは、以前享受していた権限を取り上げることより容易であることを覚えておきます。SDLC の早い段階で Least Privileges を慎重に計画、実装することで、後から過度に広いと判断された権限を取り消す必要が生じるリスクを低減できます。

### Deny by Default

アクセス制御ルールが明示的に一致しない場合でも、特定のリソースへのアクセスをエンティティが要求しているとき、アプリケーションは中立のままでいることはできません。アプリケーションは、暗黙的であれ明示的であれ、要求されたアクセスを拒否するか許可するかを常に決定しなければなりません。アクセス要件が複雑な場合は特に、アクセス制御に関するロジックエラーやその他のミスが発生する可能性があります。そのため、すべての可能なリクエストを照合するために、明示的に定義されたルールだけに完全に依存すべきではありません。セキュリティのため、アプリケーションはデフォルトでアクセスを拒否するよう構成すべきです。

次の点とベストプラクティスを検討してください。

- 初期開発中だけでなく、アプリケーションが新しい機能やリソースを公開するたびに、「deny-by-default」の考え方を採用します。アクセスをデフォルトの立場と仮定するのではなく、特定のユーザーまたはグループに特定の権限を付与した理由を明示的に説明できるべきです。
- 一部のフレームワークやライブラリ自体が deny-by-default 戦略を採用している場合でも、フレームワークやライブラリのデフォルトに依存するより、明示的な構成を優先すべきです。サードパーティコードのロジックやデフォルトは、開発者が特定プロジェクトへの影響を十分に把握しないまま、時間とともに変化する可能性があります。

### Validate the Permissions on Every Request

リクエストが AJAX スクリプト、サーバー側、またはその他のどの送信元から開始されたかに関係なく、すべてのリクエストで権限を正しく検証すべきです。このようなチェックを実行するために使用する技術は、各メソッドやクラスへ個別に適用する必要があるものではなく、アプリケーション全体にわたるグローバルな構成を可能にすべきです。攻撃者は侵入口を一つ見つけるだけでよいことを忘れないでください。たった一つのアクセス制御チェックが「抜けている」だけでも、リソースの機密性や完全性が危険にさらされる可能性があります。大半のリクエストで権限を正しく検証するだけでは不十分です。このような一貫した権限チェックの実施に役立つ具体的な技術には、次のものがあります。

- [Java/Jakarta EE Filters](https://jakarta.ee/specifications/platform/8/apidocs/javax/servlet/Filter.html)、および [Spring Security](https://docs.spring.io/spring-security/site/docs/5.4.0/reference/html5/#servlet-security-filters) の実装
- [Django Framework の Middleware](https://docs.djangoproject.com/en/4.0/ref/middleware/)
- [.NET Core Filters](https://docs.microsoft.com/en-us/aspnet/core/mvc/controllers/filters?view=aspnetcore-3.1#authorization-filters)
- [Laravel PHP Framework の Middleware](https://laravel.com/docs/8.x/middleware)

### Thoroughly Review the Authorization Logic of Chosen Tools and Technologies, Implementing Custom Logic if Necessary

今日の開発者は、最小限の労力で堅牢かつ複雑なロジックをアプリケーションに組み込める膨大な数のライブラリ、プラットフォーム、フレームワークを利用できます。しかし、これらのフレームワークやライブラリを、すべての開発上の問題に対する手軽な万能薬とみなしてはいけません。開発者には、そのようなフレームワークを責任を持って賢明に使用する義務があります。適切なアクセス制御に関連するフレームワークやライブラリ選定上の一般的な懸念は、開発者側の誤設定または設定不足と、コンポーネント自体の脆弱性の二つです。これらのトピックに関する一般的なガイダンスについては、[A6](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A6-Security_Misconfiguration) と [A9](https://owasp.org/www-project-top-ten/2017/A9_2017-Using_Components_with_Known_Vulnerabilities.html) を参照してください。

それ以外は安全に開発されたアプリケーションであっても、サードパーティコンポーネントの脆弱性により、攻撃者が通常の認可制御をバイパスできる可能性があります。このような懸念は、実績がない、または保守が不十分なプロジェクトに限定されず、最も堅牢で人気のあるライブラリやフレームワークにも影響します。複雑で安全なソフトウェアを書くことは困難です。高品質なライブラリやフレームワークに取り組む、非常に有能な開発者であってもミスをします。アプリケーションに組み込むサードパーティコンポーネントは、認可脆弱性の対象になり得る、または将来対象になり得ると想定してください。重要な考慮事項は次のとおりです。

- 脆弱なコンポーネントを検出し対応するためのプロセスを作成、維持し、それに従います。
- [Dependency Check](https://owasp.org/www-project-dependency-check/) などのツールを SDLC に組み込み、ベンダー、[NVD](https://nvd.nist.gov/vuln/data-feeds)、またはその他の関連情報源からのデータフィード購読を検討します。
- 多層防御を実装します。適切なアクセス制御を適用する唯一のものとして、単一のフレームワーク、ライブラリ、技術、または制御に依存してはいけません。

誤設定、または完全な設定不足は、開発者が基盤として使用するコンポーネントが認可の破綻につながるもう一つの主要領域です。これらのコンポーネントは通常、幅広い利用者に訴求する、比較的汎用的なツールとして意図されています。最も単純なユースケースを除き、特定のアプリケーションまたは環境に固有の要件を満たすには、これらのフレームワークやライブラリをカスタマイズするか、追加ロジックで補完しなければなりません。この考慮事項は、認可を含むセキュリティ要件に関して特に重要です。認可に関する注目すべき構成上の考慮事項は次のとおりです。

- 認可ロジックを構築する基盤となる技術を十分に理解する時間を取ります。その技術の機能を分析するときは、コンポーネントが提供する認可ロジックが、アプリケーション固有のセキュリティ要件には不十分である可能性があることを理解しておきます。事前構築されたロジックに依存することは便利かもしれませんが、それが十分であることを意味しません。アプリケーションのセキュリティ要件を満たすには、カスタム認可ロジックが必要になる可能性が十分にあることを理解してください。
- ライブラリ、プラットフォーム、フレームワークの機能に認可要件を導かせてはいけません。むしろ、認可要件を先に決定し、その要件に照らしてサードパーティコンポーネントを分析すべきです。
- デフォルト構成に依存してはいけません。
- 構成をテストします。サードパーティコンポーネントに対して行った構成が、特定の環境で意図どおりに正確に動作すると仮定するだけではいけません。ドキュメントは誤解される可能性があり、曖昧、古い、または単純に不正確な場合があります。

### Prefer Attribute and Relationship Based Access Control over RBAC

ソフトウェアエンジニアリングでは、Role-Based Access Control (RBAC) と Attribute-Based Access Control (ABAC) という二つの基本的なアクセス制御形式が広く利用されています。さらに、近年人気を得ている第三のモデルとして Relationship-Based Access Control (ReBAC) があります。これらのモデルのどれを選ぶかは SDLC 全体に大きな影響を与えるため、できるだけ早い段階で決定すべきです。

- RBAC は、ユーザーに割り当てられたロールに基づいてアクセスを許可または拒否するアクセス制御モデルです。権限はエンティティに直接割り当てられるのではなく、ロールに関連付けられ、エンティティは割り当てられたロールの権限を継承します。一般に、ロールとユーザーの関係は多対多になり得て、ロールは階層構造を持つ場合があります。
- ABAC は、「サブジェクトがオブジェクトに対して操作を実行するリクエストが、サブジェクトに割り当てられた属性、オブジェクトに割り当てられた属性、環境条件、およびそれらの属性と条件の観点で指定されたポリシーセットに基づいて許可または拒否される」アクセス制御モデルと定義できます ([NIST SP 800-162](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-162.pdf), pg. 7)。NIST SP 800-162 で定義されているように、属性とは、名前と値のペアとして表現でき、サブジェクト、オブジェクト、または環境に割り当てられる単なる特性です。職務ロール、時刻、プロジェクト名、MAC アドレス、作成日は、ABAC 実装の柔軟性を示す可能な属性のごく一部にすぎません。
- ReBAC は、リソース間の関係に基づいてアクセスを許可するアクセス制御モデルです。たとえば、投稿を作成したユーザーだけがその投稿を編集できるようにする場合です。これは、Twitter や Facebook のようなソーシャルネットワークアプリケーションで特に必要です。ユーザーは、自分のデータ、たとえばツイートや投稿へのアクセスを、自分が選んだ人々、友人、家族、フォロワーに制限したいからです。

RBAC は長い歴史を持ち、現在でもソフトウェア開発者の間で人気がありますが、アプリケーション開発では通常 ABAC と ReBAC を優先すべきです。RBAC に対する利点には次のものがあります。

- **きめ細かく複雑なブールロジックをサポートする**。RBAC では、アクセス判断はロールの有無に基づいて行われます。つまり、リクエスト元エンティティについて考慮される主な特性は、割り当てられたロールです。このような単純なロジックは、オブジェクトレベルまたは水平アクセス制御の判断や、複数の要素を必要とする判断を支えるには不十分です。
  - ABAC は、考慮できる特性の数と種類の両方を大幅に拡張します。ABAC では、「ロール」または職務機能はサブジェクトに割り当てられる一つの属性になり得ますが、それを単独で考慮する必要はありません。特定の要求アクセスにその特性が関係しない場合は、まったく考慮しないこともできます。さらに、ABAC は時刻、使用されたデバイス種別、地理的位置などの環境属性やその他の動的属性を組み込めます。通常業務時間外に機微なリソースへのアクセスを拒否することや、ユーザーが必須トレーニングを最近完了していない場合にアクセスを拒否することは、RBAC では満たすのが難しいアクセス制御要件を ABAC が満たせる例の一部にすぎません。したがって、ABAC は最小権限の原則に対処するうえで RBAC より効果的です。
  - ReBAC は、単なるロールではなく、直接のオブジェクトと直接のユーザーの間に関係を割り当てることをサポートするため、きめ細かな権限を可能にします。一部のシステムでは AND や NOT のような代数演算子もサポートし、「このユーザーがオブジェクトに対して関係 X を持つが関係 Y は持たない場合、アクセスを許可する」といったポリシーを表現できます。
- **堅牢性**。大規模プロジェクトや多数のロールが存在する場合、ロールチェックを見落としたり不適切に実行したりしやすくなります ([OWASP C7: Enforce Access Controls](https://owasp.org/www-project-proactive-controls/v3/en/c7-enforce-access-controls))。その結果、アクセスが多すぎる場合も少なすぎる場合もあります。これは、ロール階層が存在せず、望む効果を得るために複数のロールチェックを連結しなければならない RBAC 実装で特に当てはまります。例: `if(user.hasAnyRole("SUPERUSER", "ADMIN", "ACCT_MANAGER"))`。
- **速度**。RBAC では、システムが過剰に多くのロールを定義すると「role explosion」が発生する可能性があります。ユーザーが資格情報やロールを HTTP ヘッダーのようなサイズ制限のある手段で送信する場合、ユーザーのすべてのロールを含める十分な領域がない可能性があります。この問題に対する実行可能な回避策は、ユーザー ID だけを送信し、アプリケーションがユーザーのロールを取得することですが、これによりすべてのリクエストのレイテンシが増加します。
- **マルチテナンシーと組織横断リクエストをサポートする**。RBAC は、異なる組織や顧客が同じ保護リソース集合へアクセスする必要があるユースケースには適していません。そのような要件を RBAC で満たすには、マルチテナント環境で顧客ごとにルールセットを構成する、または組織横断リクエストのために ID を事前プロビジョニングするなど、非常に扱いにくい方法が必要になります ([OWASP C7](https://owasp.org/www-project-proactive-controls/v3/en/c7-enforce-access-controls); [NIST SP 800-162](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-162.pdf))。対照的に、属性が一貫して定義されている限り、ABAC 実装は「適切なセキュリティレベルを維持しながら、同一または別個のインフラストラクチャで実行および管理される」アクセス制御判断を可能にします ([NIST SP 800-162](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-162.pdf), pg. 6)。
- **管理の容易さ**。RBAC の初期セットアップは ABAC より単純であることが多いものの、この短期的な利点はシステムの規模と複雑さが増すにつれてすぐに消えます。初期段階では User や Admin のようないくつかの単純なロールで十分なアプリもありますが、本番アプリケーションでこれが長期間成り立つ可能性は非常に低いです。ロールが増えるにつれて、コードベースとロジックへの信頼を確立するために重要なプロセスであるテストと監査の両方が難しくなります ([OWASP C7](https://owasp.org/www-project-proactive-controls/v3/en/c7-enforce-access-controls))。対照的に、ABAC と ReBAC ははるかに表現力が高く、現実世界の懸念をよりよく反映する属性とブールロジックを組み込み、アクセス制御ニーズが変化したときに更新しやすく、ポリシー管理を強制と ID プロビジョニングから分離することを促します ([NIST SP 800-162](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-162.pdf)。これらの利点を示す標準として [XACML-V3.0](https://docs.oasis-open.org/xacml/3.0/xacml-3.0-core-spec-os-en.html) も参照)。

### Ensure Lookup IDs are Not Accessible Even When Guessed or Cannot Be Tampered With

アプリケーションは、オブジェクトの検索や参照に使用される内部オブジェクト識別子、たとえば口座番号やデータベースの主キーを公開することがよくあります。この ID は、クエリパラメータ、パス変数、「hidden」フォームフィールド、またはその他の場所で公開される可能性があります。例:

```text
https://mybank.com/accountTransactions?acct_id=901
```

この URL に基づくと、アプリケーションが取引一覧を返し、返される取引が特定の口座、つまり `acct_id` パラメータで示された口座に限定されると合理的に想定できます。しかし、ユーザーが `acct_id` パラメータの値を `523` のような別の値に変更した場合はどうなるでしょうか。その口座が自分のものでなくても、ユーザーは別口座に関連する取引を表示できるでしょうか。表示できない場合、その失敗は単に口座 `523` が存在しない、または見つからない結果でしょうか。それともアクセス制御チェックの失敗によるものでしょうか。この例は単純化しすぎているかもしれませんが、アプリケーション開発で非常に一般的なセキュリティ欠陥である [CWE 639: Authorization Bypass Through User-Controlled Key](https://cwe.mitre.org/data/definitions/639.html) を示しています。この弱点が悪用されると、認可バイパス、水平権限昇格、よりまれには垂直権限昇格が生じる可能性があります ([CWE-639](https://cwe.mitre.org/data/definitions/639.html) を参照)。この種の脆弱性は、Insecure Direct Object Reference (IDOR) の一形態でもあります。以下の段落では、この弱点と可能な緩和策を説明します。

上記の例では、検索 ID がユーザーに公開され、容易に改ざんできるだけでなく、かなり予測可能、場合によっては連番の値であったようにも見えます。これらの ID を隠したりランダム化したりして推測しにくくするためにさまざまな技法を使用できますが、そのようなアプローチだけでは一般に十分ではありません。ユーザーがクエリパラメータやその他の場所でオブジェクト識別子を推測して操作できるという理由だけで、権限のないリソースにアクセスできるべきではありません。何らかの security through obscurity に依存するのではなく、基盤となるオブジェクトや識別子そのものへのアクセスを制御することに焦点を置くべきです。この弱点に対する推奨緩和策は次のとおりです。

- 可能な場合は、識別子をユーザーに公開しないようにします。たとえば、口座詳細などの一部のオブジェクトは、現在認証済みユーザーの ID と属性だけに基づいて取得できるべきです。たとえば、安全に実装された JSON Web Token (JWT) またはサーバー側セッションに含まれる情報を通じて取得します。
- [OWASP ESAPI](https://owasp.org/www-project-enterprise-security-api/) などのツールを使用して、ユーザーまたはセッション固有の間接参照を実装します ([OWASP 2013 Top 10 - A4 Insecure Direct Object References](https://wiki.owasp.org/index.php/Top_10_2013-A4-Insecure_Direct_Object_References) を参照)。
- アクセスされる特定のオブジェクトまたは機能について、すべてのリクエストでアクセス制御チェックを実行します。ユーザーが特定の種類のオブジェクトへアクセスできるからといって、その種類のすべてのオブジェクトへアクセスできるべきだという意味ではありません。

### Enforce Authorization Checks on Static Resources

静的リソースの保護の重要性は、しばしば見落とされるか、少なくとも他のセキュリティ上の懸念に隠れがちです。データベースや同様のデータストアの保護が、セキュリティ意識の高いチームから相応の大きな注目を受けることは多いですが、静的リソースも適切に保護しなければなりません。保護されていない静的リソースは、あらゆる形態の Web サイトや Web アプリケーションにとって確かに問題ですが、近年では、Amazon S3 Buckets などのクラウドストレージサービスで不十分に保護されたリソースが目立つようになっています。静的リソースを保護するときは、次の点を検討してください。

- 静的リソースがアクセス制御ポリシーに組み込まれていることを確認します。静的リソースに必要な保護の種類は、必然的にコンテキストに大きく依存します。一部の静的リソースは公開アクセス可能でまったく問題ない場合がありますが、他のリソースは、非常に制限されたユーザー属性と環境属性の集合が存在する場合にのみアクセス可能であるべきです。したがって、検討対象の特定リソースで公開されるデータの種類を理解することが重要です。正式な Data Classification スキームを確立し、アプリケーションのアクセス制御ロジックに組み込むべきかを検討してください。データ分類の概要については [こちら](https://resources.infosecinstitute.com/information-and-asset-classification/) を参照してください。
- 静的リソースの保存に使用するクラウドベースサービスが、ベンダーが提供する構成オプションとツールを使用して保護されていることを確認します。具体的な実装詳細について、クラウドプロバイダーのドキュメントをレビューしてください。[AWS](https://aws.amazon.com/premiumsupport/knowledge-center/secure-s3-resources/)、[Google Cloud](https://cloud.google.com/storage/docs/best-practices#security)、[Azure](https://docs.microsoft.com/en-us/azure/storage/blobs/security-recommendations) のガイダンスを参照してください。
- 可能な場合は、他のアプリケーションリソースや機能を保護するために使用しているものと同じアクセス制御ロジックとメカニズムで、静的リソースを保護します。

### Verify that Authorization Checks are Performed in the Right Location

開発者は、クライアント側のアクセス制御チェックに決して依存してはいけません。このようなチェックはユーザー体験を改善するためには許容される場合がありますが、リソースへのアクセスを許可または拒否する決定的要因にしてはいけません。クライアント側ロジックは多くの場合、容易にバイパスできます。アクセス制御チェックは、サーバー側、ゲートウェイ、またはサーバーレス関数で実行しなければなりません ([OWASP ASVS 4.0.3, V1.4.1 and V4.1.1](https://raw.githubusercontent.com/OWASP/ASVS/v4.0.3/4.0/OWASP%20Application%20Security%20Verification%20Standard%204.0.3-en.pdf) を参照)。

### Exit Safely when Authorization Checks Fail

アクセス制御チェックの失敗は、保護されたアプリケーションでは通常発生するものです。したがって、開発者はそのような失敗を想定し、安全に処理する必要があります。そのような失敗の不適切な処理は、アプリケーションを予測不能な状態に残す可能性があります ([CWE-280: Improper Handling of Insufficient Permissions or Privileges](https://cwe.mitre.org/data/definitions/280.html))。具体的な推奨事項は次のとおりです。

- どれほど起こりにくく見えても、すべての例外と失敗したアクセス制御チェックが処理されることを確認します ([OWASP Top Ten Proactive Controls C10: Handle all errors and exceptions](https://owasp.org/www-project-proactive-controls/v3/en/c10-errors-exceptions.html))。これは、アプリケーションが失敗したチェックを常に「修正」しようとすべきという意味ではありません。多くの場合、単純なメッセージまたは HTTP ステータスコードだけで十分です。
- 失敗したアクセス制御チェックを処理するロジックを中央集約します。
- 例外と認可失敗の処理を検証します。そのような失敗がどれほど起こりにくくても、認可バイパスにつながり得る不安定な状態にソフトウェアを置かないことを確認します。
- システムログやデバッグ出力などの機微情報がエラーメッセージで公開されないことを確認します。誤設定されたエラーメッセージは、アプリケーションの攻撃対象領域を増やす可能性があります ([CWE-209: Generation of Error Message Containing Sensitive Information](https://cwe.mitre.org/data/definitions/209.html))。

### Implement Appropriate Logging

ログ記録は、アプリケーションセキュリティにおける最も重要な検知的制御の一つです。不十分なログ記録と監視は、[OWASP Top Ten 2021](https://owasp.org/Top10/A09_2021-Security_Logging_and_Monitoring_Failures/) で最も重大なセキュリティリスクの一つとして認識されています。適切なログは悪意ある活動を検知できるだけでなく、インシデント後の調査において非常に価値のあるリソースであり、アクセス制御やその他のセキュリティ関連問題のトラブルシューティングにも使用でき、セキュリティ監査にも役立ちます。初期の設計および要件フェーズでは見落とされやすいものの、ログ記録は包括的なアプリケーションセキュリティの重要な構成要素であり、SDLC のすべてのフェーズに組み込まなければなりません。ログ記録に関する推奨事項は次のとおりです。

- 分析のために容易にパースできる、一貫した明確な形式でログを記録します。[OWASP Top Ten Proactive Controls C9](https://owasp.org/www-project-proactive-controls/v3/en/c9-security-logging.html) によると、[Apache Logging Services](https://logging.apache.org/) は多数の言語とプラットフォームをサポートするプロジェクトの一例です。
- ログに記録する情報量を慎重に決定します。これは、特定のアプリケーション環境と要件に従って決定すべきです。ログが多すぎることも少なすぎることも、セキュリティ上の弱点と見なされる場合があります ([CWE-778](https://cwe.mitre.org/data/definitions/778.html) と [CWE-779](https://cwe.mitre.org/data/definitions/779.html) を参照)。ログが少なすぎると、悪意ある活動が検知されず、インシデント後分析の有効性が大きく低下する可能性があります。ログが多すぎると、リソースに負荷をかけ、過剰な誤検知を招くだけでなく、機微データが不必要にログ記録される可能性もあります。
- システム間で時計とタイムゾーンが同期されていることを確認します。インシデント対応中および対応後に攻撃の順序をつなぎ合わせるには、正確性が極めて重要です。
- アプリケーションログを集中ログサーバーまたは SIEM に取り込むことを検討します。

### Create Unit and Integration Test Cases for Authorization Logic

単体テストと統合テストは、アプリケーションが期待どおりに動作し、変更を通じて一貫していることを検証するために不可欠です。アクセス制御ロジックの欠陥は、要件が複雑な場合は特に微妙なものになり得ます。しかし、アクセス制御における小さなロジックエラーや構成エラーであっても、深刻な結果をもたらす可能性があります。専用のセキュリティテストやペネトレーションテストの代替ではありませんが、アクセス制御に関連するこのトピックの優れたガイドとして [OWASP WSTG 4.5](https://owasp.org/www-project-web-security-testing-guide/v42/4-Web_Application_Security_Testing/05-Authorization_Testing/README) を参照してください。アクセス制御ロジックの自動単体テストと統合テストは、本番環境に入り込むセキュリティ欠陥の数を減らすのに役立ちます。これらのテストは、セキュリティ問題の「low-hanging fruit」を見つけることには有効ですが、より高度な攻撃ベクトルには十分ではありません ([OWASP SAMM: Security Testing](https://owaspsamm.org/model/verification/security-testing/))。

単体テストと統合テストは、この文書で検討した多くの概念を組み込むことを目指すべきです。たとえば、アクセスはデフォルトで拒否されていますか。異常な条件下でも、アクセス制御チェックが失敗したときにアプリケーションは安全に終了しますか。ABAC ポリシーは適切に強制されていますか。単純な単体テストと統合テストが熟練したハッカーによる手動テストに取って代わることは決してできませんが、手動テストよりはるかに少ないリソースでセキュリティ問題を迅速に検出し修正するための重要なツールです。

</section>

<section id="authorization-bilingual-panel" className="tabPanel bilingualPanel">

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Introduction

Authorization may be defined as "the process of verifying that a requested action or service is approved for a specific entity" ([NIST](https://csrc.nist.gov/glossary/term/authorization)). Authorization is distinct from authentication which is the process of verifying an entity's identity. When designing and developing a software solution, it is important to keep these distinctions in mind. A user who has been authenticated (perhaps by providing a username and password) is often not authorized to access every resource and perform every action that is technically possible through a system. For example, a web app may have both regular users and admins, with the admins being able to perform actions the average user is not privileged to perform, even though they have been authenticated. Additionally, authentication is not always required for accessing resources; an unauthenticated user may be authorized to access certain public resources, such as an image or login page, or even an entire web app.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## Introduction

認可は、「要求された操作またはサービスが特定のエンティティに対して承認されていることを検証するプロセス」と定義できます ([NIST](https://csrc.nist.gov/glossary/term/authorization))。認可は、エンティティの身元を検証するプロセスである認証とは異なります。ソフトウェアソリューションを設計、開発するときは、この違いを念頭に置くことが重要です。認証済みのユーザー、たとえばユーザー名とパスワードを提供したユーザーであっても、多くの場合、システムを通じて技術的に可能なすべてのリソースへのアクセスやすべての操作の実行を認可されているわけではありません。たとえば、Web アプリには一般ユーザーと管理者の両方が存在し、どちらも認証済みであっても、管理者は一般ユーザーに権限がない操作を実行できる場合があります。さらに、リソースへのアクセスに認証が常に必要とは限りません。未認証ユーザーが、画像、ログインページ、あるいは Web アプリ全体など、特定の公開リソースへのアクセスを認可される場合もあります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The objective of this cheat sheet is to assist developers in implementing authorization logic that is robust, appropriate to the app's business context, maintainable, and scalable. The guidance provided in this cheat sheet should be applicable to all phases of the development lifecycle and flexible enough to meet the needs of diverse development environments.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

このチートシートの目的は、アプリケーションのビジネスコンテキストに適合し、堅牢で、保守しやすく、スケール可能な認可ロジックを開発者が実装できるよう支援することです。このチートシートで提供するガイダンスは、開発ライフサイクルのすべてのフェーズに適用でき、多様な開発環境のニーズに対応できるだけの柔軟性を備えているべきです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Flaws related to authorization logic are a notable concern for web apps. Broken Access Control was ranked as the most concerning web security vulnerability in [OWASP's 2021 Top 10](https://owasp.org/Top10/A01_2021-Broken_Access_Control/) and asserted to have a "High" likelihood of exploit by [MITRE's CWE program](https://cwe.mitre.org/data/definitions/285.html). Furthermore, according to [Veracode's State of Software Vol. 10](https://www.veracode.com/sites/default/files/pdf/resources/sossreports/state-of-software-security-volume-10-veracode-report.pdf), Access Control was among the more common of OWASP's Top 10 risks to be involved in exploits and security incidents despite being among the least prevalent of those examined.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

認可ロジックに関する欠陥は、Web アプリにとって注目すべき懸念事項です。Broken Access Control は [OWASP Top 10 2021](https://owasp.org/Top10/A01_2021-Broken_Access_Control/) で最も懸念される Web セキュリティ脆弱性としてランク付けされ、[MITRE の CWE プログラム](https://cwe.mitre.org/data/definitions/285.html) でも悪用される可能性が「High」とされています。さらに、[Veracode's State of Software Vol. 10](https://www.veracode.com/sites/default/files/pdf/resources/sossreports/state-of-software-security-volume-10-veracode-report.pdf) によると、Access Control は調査対象の OWASP Top 10 リスクの中では発生頻度が比較的低いにもかかわらず、悪用やセキュリティインシデントに関与することが比較的多いリスクの一つでした。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The potential impact resulting from exploitation of authorization flaws is highly variable, both in form and severity. Attackers may be able to read, create, modify, or delete resources that were meant to be protected (thus jeopardizing their confidentiality, integrity, and/or availability); however, the actual impact of such actions is necessarily linked to the criticality and sensitivity of the compromised resources. Thus, the business cost of a successfully exploited authorization flaw can range from very low to extremely high.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

認可欠陥の悪用から生じる潜在的な影響は、形態と深刻度の両面で大きく変動します。攻撃者は、保護されるべきリソースを読み取り、作成、変更、削除できる可能性があり、その結果として機密性、完全性、可用性が損なわれます。ただし、そのような操作の実際の影響は、侵害されたリソースの重要性と機微性に必然的に結び付きます。したがって、認可欠陥の悪用に成功した場合のビジネス上のコストは、非常に低いものから極めて高いものまで幅があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Both entirely unauthenticated outsiders and authenticated (but not necessarily authorized) users can take advantage of authorization weaknesses.  Although honest mistakes or carelessness on the part of non-malicious entities may enable authorization bypasses, malicious intent is typically required for access control threats to be fully realized.  Horizontal privilege elevation (i.e. being able to access another user's resources) is an especially common weakness that an authenticated user may be able to take advantage of. Faults related to authorization control can allow malicious insiders and outsiders alike to view, modify, or delete sensitive resources of all forms (databases records, static files, personally identifiable information (PII), etc.) or perform actions, such as creating a new account or initiating a costly order, that they should not be privileged to do. Furthermore, if logging related to access control is not properly set-up, such authorization violations may go undetected or at least remain unattributable to a particular individual or group.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

完全に未認証の外部者も、認証済みだが必ずしも認可されていないユーザーも、認可の弱点を利用できます。悪意のないエンティティによる単純なミスや不注意が認可バイパスを可能にすることはありますが、アクセス制御の脅威が完全に現実化するには、通常は悪意が必要です。水平権限昇格、つまり別ユーザーのリソースにアクセスできる状態は、認証済みユーザーが悪用できる特に一般的な弱点です。認可制御に関する欠陥により、悪意のある内部者と外部者のどちらも、データベースレコード、静的ファイル、個人識別情報 (PII) など、あらゆる形態の機微なリソースを閲覧、変更、削除したり、新規アカウントの作成や高額な注文の開始など、本来権限がない操作を実行したりできます。さらに、アクセス制御に関するログが適切に設定されていない場合、そのような認可違反は検知されないか、少なくとも特定の個人またはグループに帰属できないままになる可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Recommendations

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## Recommendations

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Enforce Least Privileges

As a security concept, Least Privileges refers to the principle of assigning users only the minimum privileges necessary to complete their job. Although perhaps most commonly applied in system administration, this principle has relevance to the software developer as well. Least Privileges must be applied both horizontally and vertically. For example, even though both an accountant and sales representative may occupy the same level in an organization's hierarchy, both require access to different resources to perform their jobs. The accountant should likely not be granted access to a customer database and the sales representative should not be able to access payroll data. Similarly, the head of the sales department is likely to need more privileged access than their subordinates.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Enforce Least Privileges

セキュリティ概念としての Least Privileges は、ユーザーに職務を完了するために必要な最小限の権限だけを割り当てる原則を指します。この原則はシステム管理で最もよく適用されるかもしれませんが、ソフトウェア開発者にも関係します。Least Privileges は水平方向と垂直方向の両方に適用しなければなりません。たとえば、会計担当者と営業担当者が組織階層上は同じレベルにいるとしても、それぞれが職務を実行するために必要なリソースは異なります。会計担当者には顧客データベースへのアクセスを付与すべきではない可能性が高く、営業担当者は給与データへアクセスできるべきではありません。同様に、営業部門の責任者は部下よりも高い権限のアクセスを必要とする可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Failure to enforce least privileges in an application can jeopardize the confidentiality of sensitive resources. Mitigation strategies are applied primarily during the Architecture and Design phase (see [CWE-272](https://cwe.mitre.org/data/definitions/272.html)); however, the principle must be addressed throughout the SDLC.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

アプリケーションで最小権限を適用しないと、機微なリソースの機密性が危険にさらされる可能性があります。緩和策は主にアーキテクチャと設計フェーズで適用されますが ([CWE-272](https://cwe.mitre.org/data/definitions/272.html) を参照)、この原則は SDLC 全体を通じて扱わなければなりません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Consider the following points and best practices:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

次の点とベストプラクティスを検討してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- During the design phase, ensure trust boundaries are defined. Enumerate the types of users that will be accessing the system, the resources exposed and the operations (such as read, write, update, etc) that might be performed on those resources. For every combination of user type and resource, determine what operations, if any, the user (based on role and/or other attributes) must be able to perform on that resource. For an ABAC system ensure all categories of attributes are considered. For example, a Sales Representative may need to access a customer database from the internal network during working hours, but not from home at midnight.
- Create tests that validate that the permissions mapped out in the design phase are being correctly enforced.
- After the app has been deployed, periodically review permissions in the system for "privilege creep"; that is, ensure the privileges of users in the current environment do not exceed those defined during the design phase (plus or minus any formally approved changes).
- Remember, it is easier to grant users additional permissions rather than to take away some they previously enjoyed. Careful planning and implementation of Least Privileges early in the SDLC can help reduce the risk of needing to revoke permissions that are later deemed overly broad.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- 設計フェーズでは、信頼境界が定義されていることを確認します。システムにアクセスするユーザー種別、公開されるリソース、それらのリソースに対して実行される可能性がある操作、たとえば読み取り、書き込み、更新などを列挙します。ユーザー種別とリソースのすべての組み合わせについて、ユーザーがロールやその他の属性に基づいてそのリソースに対してどの操作を実行できなければならないか、実行できる操作があるかを判断します。ABAC システムでは、すべての属性カテゴリが考慮されていることを確認します。たとえば、営業担当者は勤務時間中に内部ネットワークから顧客データベースへアクセスする必要があるかもしれませんが、深夜に自宅からアクセスする必要はありません。
- 設計フェーズで対応付けた権限が正しく適用されていることを検証するテストを作成します。
- アプリケーションをデプロイした後、システム内の権限を定期的にレビューし、「privilege creep」を確認します。つまり、現在の環境におけるユーザー権限が、設計フェーズで定義されたものを、正式に承認された変更を加味した範囲を超えていないことを確認します。
- ユーザーに追加権限を付与することは、以前享受していた権限を取り上げることより容易であることを覚えておきます。SDLC の早い段階で Least Privileges を慎重に計画、実装することで、後から過度に広いと判断された権限を取り消す必要が生じるリスクを低減できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Deny by Default

Even when no access control rules are explicitly matched, the application cannot remain neutral when an entity is requesting access to a particular resource. The application must always make a decision, whether implicitly or explicitly, to either deny or permit the requested access. Logic errors and other mistakes relating to access control may happen, especially when access requirements are complex; consequently, one should not rely entirely on explicitly defined rules for matching all possible requests. For security purposes an application should be configured to deny access by default.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Deny by Default

アクセス制御ルールが明示的に一致しない場合でも、特定のリソースへのアクセスをエンティティが要求しているとき、アプリケーションは中立のままでいることはできません。アプリケーションは、暗黙的であれ明示的であれ、要求されたアクセスを拒否するか許可するかを常に決定しなければなりません。アクセス要件が複雑な場合は特に、アクセス制御に関するロジックエラーやその他のミスが発生する可能性があります。そのため、すべての可能なリクエストを照合するために、明示的に定義されたルールだけに完全に依存すべきではありません。セキュリティのため、アプリケーションはデフォルトでアクセスを拒否するよう構成すべきです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Consider the following points and best practices:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

次の点とベストプラクティスを検討してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Adopt a "deny-by-default" mentality both during initial development and whenever new functionality or resources are exposed by the app. One should be able to explicitly justify why a specific permission was granted to a particular user or group rather than assuming access to be the default position.
- Although some frameworks or libraries may themselves adopt a deny-by-default strategy, explicit configuration should be preferred over relying on framework or library defaults. The logic and defaults of third-party code may evolve over time, without the developer's full knowledge or understanding of the change's implications for a particular project.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- 初期開発中だけでなく、アプリケーションが新しい機能やリソースを公開するたびに、「deny-by-default」の考え方を採用します。アクセスをデフォルトの立場と仮定するのではなく、特定のユーザーまたはグループに特定の権限を付与した理由を明示的に説明できるべきです。
- 一部のフレームワークやライブラリ自体が deny-by-default 戦略を採用している場合でも、フレームワークやライブラリのデフォルトに依存するより、明示的な構成を優先すべきです。サードパーティコードのロジックやデフォルトは、開発者が特定プロジェクトへの影響を十分に把握しないまま、時間とともに変化する可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Validate the Permissions on Every Request

Permission should be validated correctly on every request, regardless of whether the request was initiated by an AJAX script, server-side, or any other source. The technology used to perform such checks should allow for global, application-wide configuration rather than needing to be applied individually to every method or class. Remember an attacker only needs to find one way in. Even if just a single access control check is "missed", the confidentiality and/or integrity of a resource can be jeopardized. Validating permissions correctly on just the majority of requests is insufficient. Specific technologies that can help developers in performing such consistent permission checks include the following:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Validate the Permissions on Every Request

リクエストが AJAX スクリプト、サーバー側、またはその他のどの送信元から開始されたかに関係なく、すべてのリクエストで権限を正しく検証すべきです。このようなチェックを実行するために使用する技術は、各メソッドやクラスへ個別に適用する必要があるものではなく、アプリケーション全体にわたるグローバルな構成を可能にすべきです。攻撃者は侵入口を一つ見つけるだけでよいことを忘れないでください。たった一つのアクセス制御チェックが「抜けている」だけでも、リソースの機密性や完全性が危険にさらされる可能性があります。大半のリクエストで権限を正しく検証するだけでは不十分です。このような一貫した権限チェックの実施に役立つ具体的な技術には、次のものがあります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- [Java/Jakarta EE Filters](https://jakarta.ee/specifications/platform/8/apidocs/javax/servlet/Filter.html) including implementations in [Spring Security](https://docs.spring.io/spring-security/site/docs/5.4.0/reference/html5/#servlet-security-filters)
- [Middleware in the Django Framework](https://docs.djangoproject.com/en/4.0/ref/middleware/)
- [.NET Core Filters](https://docs.microsoft.com/en-us/aspnet/core/mvc/controllers/filters?view=aspnetcore-3.1#authorization-filters)
- [Middleware in the Laravel PHP Framework](https://laravel.com/docs/8.x/middleware)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- [Java/Jakarta EE Filters](https://jakarta.ee/specifications/platform/8/apidocs/javax/servlet/Filter.html)、および [Spring Security](https://docs.spring.io/spring-security/site/docs/5.4.0/reference/html5/#servlet-security-filters) の実装
- [Django Framework の Middleware](https://docs.djangoproject.com/en/4.0/ref/middleware/)
- [.NET Core Filters](https://docs.microsoft.com/en-us/aspnet/core/mvc/controllers/filters?view=aspnetcore-3.1#authorization-filters)
- [Laravel PHP Framework の Middleware](https://laravel.com/docs/8.x/middleware)

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Thoroughly Review the Authorization Logic of Chosen Tools and Technologies, Implementing Custom Logic if Necessary

Today's developers have access to vast amounts of libraries, platforms, and frameworks that allow them to incorporate robust, complex logic into their apps with minimal effort. However, these frameworks and libraries must not be viewed as a quick panacea for all development problems; developers have a duty to use such frameworks responsibly and wisely. Two general concerns relevant to framework/library selection as relevant to proper access control are misconfiguration/lack of configuration on the part of the developer and vulnerabilities within the components themselves (see [A6](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A6-Security_Misconfiguration) and [A9](https://owasp.org/www-project-top-ten/2017/A9_2017-Using_Components_with_Known_Vulnerabilities.html) for general guidance on these topics).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Thoroughly Review the Authorization Logic of Chosen Tools and Technologies, Implementing Custom Logic if Necessary

今日の開発者は、最小限の労力で堅牢かつ複雑なロジックをアプリケーションに組み込める膨大な数のライブラリ、プラットフォーム、フレームワークを利用できます。しかし、これらのフレームワークやライブラリを、すべての開発上の問題に対する手軽な万能薬とみなしてはいけません。開発者には、そのようなフレームワークを責任を持って賢明に使用する義務があります。適切なアクセス制御に関連するフレームワークやライブラリ選定上の一般的な懸念は、開発者側の誤設定または設定不足と、コンポーネント自体の脆弱性の二つです。これらのトピックに関する一般的なガイダンスについては、[A6](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A6-Security_Misconfiguration) と [A9](https://owasp.org/www-project-top-ten/2017/A9_2017-Using_Components_with_Known_Vulnerabilities.html) を参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Even in an otherwise securely developed application, vulnerabilities in third-party components can allow an attacker to bypass normal authorization controls. Such concerns need not be restricted to unproven or poorly maintained projects, but affect even the most robust and popular libraries and frameworks. Writing complex, secure software is hard. Even the most competent developers, working on high-quality libraries and frameworks, will make mistakes. Assume any third-party component you incorporate into an application *could* be or become subject to an authorization vulnerability. Important considerations include:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

それ以外は安全に開発されたアプリケーションであっても、サードパーティコンポーネントの脆弱性により、攻撃者が通常の認可制御をバイパスできる可能性があります。このような懸念は、実績がない、または保守が不十分なプロジェクトに限定されず、最も堅牢で人気のあるライブラリやフレームワークにも影響します。複雑で安全なソフトウェアを書くことは困難です。高品質なライブラリやフレームワークに取り組む、非常に有能な開発者であってもミスをします。アプリケーションに組み込むサードパーティコンポーネントは、認可脆弱性の対象になり得る、または将来対象になり得ると想定してください。重要な考慮事項は次のとおりです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Create, maintain, and follow processes for detecting and responding to vulnerable components.
- Incorporate tools such as [Dependency Check](https://owasp.org/www-project-dependency-check/) into the SDLC and consider subscribing to data feeds from vendors, [the NVD](https://nvd.nist.gov/vuln/data-feeds), or other relevant sources.
- Implement defense in depth. Do not depend on any single framework, library, technology, or control to be the sole thing enforcing proper access control.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- 脆弱なコンポーネントを検出し対応するためのプロセスを作成、維持し、それに従います。
- [Dependency Check](https://owasp.org/www-project-dependency-check/) などのツールを SDLC に組み込み、ベンダー、[NVD](https://nvd.nist.gov/vuln/data-feeds)、またはその他の関連情報源からのデータフィード購読を検討します。
- 多層防御を実装します。適切なアクセス制御を適用する唯一のものとして、単一のフレームワーク、ライブラリ、技術、または制御に依存してはいけません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Misconfiguration (or complete lack of configuration) is another major area in which the components developers build upon can lead to broken authorization.  These components are typically intended to be relatively general purpose tools made to appeal to a wide audience. For all but the simplest use cases, these frameworks and libraries must be customized or supplemented with additional logic in order to meet the unique requirements of a particular app or environment. This consideration is especially important when security requirements, including authorization, are concerned. Notable configuration considerations for authorization include the following:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

誤設定、または完全な設定不足は、開発者が基盤として使用するコンポーネントが認可の破綻につながるもう一つの主要領域です。これらのコンポーネントは通常、幅広い利用者に訴求する、比較的汎用的なツールとして意図されています。最も単純なユースケースを除き、特定のアプリケーションまたは環境に固有の要件を満たすには、これらのフレームワークやライブラリをカスタマイズするか、追加ロジックで補完しなければなりません。この考慮事項は、認可を含むセキュリティ要件に関して特に重要です。認可に関する注目すべき構成上の考慮事項は次のとおりです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Take time to thoroughly understand any technology you build authorization logic upon. Analyze the technology's capabilities with an understanding that *the authorization logic provided by the component may be insufficient for your application's specific security requirements*. Relying on prebuilt logic may be convenient, but this does not mean it is sufficient. Understand that custom authorization logic may well be necessary to meet an app's security requirements.
- Do not let the capabilities of any library, platform, or framework guide your authorization requirements. Rather, authorization requirements should be decided first and then the third-party components may be analyzed in light of these requirements.
- Do not rely on default configurations.
- Test configuration. Do not just assume any configuration performed on a third-party component will work exactly as intended in your particular environment. Documentation can be misunderstood, vague, outdated, or simply inaccurate.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- 認可ロジックを構築する基盤となる技術を十分に理解する時間を取ります。その技術の機能を分析するときは、コンポーネントが提供する認可ロジックが、アプリケーション固有のセキュリティ要件には不十分である可能性があることを理解しておきます。事前構築されたロジックに依存することは便利かもしれませんが、それが十分であることを意味しません。アプリケーションのセキュリティ要件を満たすには、カスタム認可ロジックが必要になる可能性が十分にあることを理解してください。
- ライブラリ、プラットフォーム、フレームワークの機能に認可要件を導かせてはいけません。むしろ、認可要件を先に決定し、その要件に照らしてサードパーティコンポーネントを分析すべきです。
- デフォルト構成に依存してはいけません。
- 構成をテストします。サードパーティコンポーネントに対して行った構成が、特定の環境で意図どおりに正確に動作すると仮定するだけではいけません。ドキュメントは誤解される可能性があり、曖昧、古い、または単純に不正確な場合があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Prefer Attribute and Relationship Based Access Control over RBAC

In software engineering, two basic forms of access control are widely utilized: Role-Based Access Control (RBAC) and Attribute-Based Access Control (ABAC). There is a third, more recent, model which has gained popularity: Relationship-Based Access Control (ReBAC). The decision between the models has significant implications for the entire SDLC and should be made as early as possible.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Prefer Attribute and Relationship Based Access Control over RBAC

ソフトウェアエンジニアリングでは、Role-Based Access Control (RBAC) と Attribute-Based Access Control (ABAC) という二つの基本的なアクセス制御形式が広く利用されています。さらに、近年人気を得ている第三のモデルとして Relationship-Based Access Control (ReBAC) があります。これらのモデルのどれを選ぶかは SDLC 全体に大きな影響を与えるため、できるだけ早い段階で決定すべきです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- RBAC is a model of access control in which access is granted or denied based upon the roles assigned to a user. Permissions are not directly assigned to an entity; rather, permissions are associated with a role and the entity inherits the permissions of any roles assigned to it. Generally, the relationship between roles and users can be many-to-many, and roles may be hierarchical in nature.

- ABAC may be defined as an access control model where "subject requests to perform operations on objects are granted or denied based on assigned attributes of the subject, assigned attributes of the object, environment conditions, and a set of policies that are specified in terms of those attributes and conditions" ([NIST SP 800-162](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-162.pdf), pg. 7). As defined in NIST SP 800-162, attributes are simply characteristics that can be represented as name-value pairs and assigned to a subject, object, or the environment. Job role, time of day, project name, MAC address, and creation date are but a very small sampling of possible attributes that highlight the flexibility of ABAC implementations.

- ReBAC is an access control model that grants access based on the relationships between resources. For instance, allowing only the user who created a post to edit it. This is especially necessary in social network applications, like Twitter or Facebook, where users want to limit access to their data (tweets or posts) to people they choose (friends, family, followers).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- RBAC は、ユーザーに割り当てられたロールに基づいてアクセスを許可または拒否するアクセス制御モデルです。権限はエンティティに直接割り当てられるのではなく、ロールに関連付けられ、エンティティは割り当てられたロールの権限を継承します。一般に、ロールとユーザーの関係は多対多になり得て、ロールは階層構造を持つ場合があります。
- ABAC は、「サブジェクトがオブジェクトに対して操作を実行するリクエストが、サブジェクトに割り当てられた属性、オブジェクトに割り当てられた属性、環境条件、およびそれらの属性と条件の観点で指定されたポリシーセットに基づいて許可または拒否される」アクセス制御モデルと定義できます ([NIST SP 800-162](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-162.pdf), pg. 7)。NIST SP 800-162 で定義されているように、属性とは、名前と値のペアとして表現でき、サブジェクト、オブジェクト、または環境に割り当てられる単なる特性です。職務ロール、時刻、プロジェクト名、MAC アドレス、作成日は、ABAC 実装の柔軟性を示す可能な属性のごく一部にすぎません。
- ReBAC は、リソース間の関係に基づいてアクセスを許可するアクセス制御モデルです。たとえば、投稿を作成したユーザーだけがその投稿を編集できるようにする場合です。これは、Twitter や Facebook のようなソーシャルネットワークアプリケーションで特に必要です。ユーザーは、自分のデータ、たとえばツイートや投稿へのアクセスを、自分が選んだ人々、友人、家族、フォロワーに制限したいからです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Although RBAC has a long history and remains popular among software developers today, ABAC and ReBAC should typically be preferred for application development. Their advantages over RBAC include:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

RBAC は長い歴史を持ち、現在でもソフトウェア開発者の間で人気がありますが、アプリケーション開発では通常 ABAC と ReBAC を優先すべきです。RBAC に対する利点には次のものがあります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- **Support fine-grained, complex Boolean logic**. In RBAC, access decisions are made on the presence or absence of roles; that is, the main characteristic of a requesting entity considered is the role(s) assigned to it. Such simplistic logic does a poor job of supporting object-level or horizontal access control decisions and those that require multiple factors.

- ABAC greatly expands both the number and type of characteristics that can be considered. In ABAC, a "role" or job function can certainly be one attribute assigned to a subject, but it need not be considered in isolation (or at all if this characteristic is not relevant to the particular access requested). Furthermore, ABAC can incorporate environmental and other dynamic attributes, such as time of day, type of device used, and geographic location. Denying access to a sensitive resource outside of normal business hours or if a user has not recently completed mandatory training are just a couple of examples where ABAC could meet access control requirements that RBAC would struggle to fulfill. Thus, ABAC is more effective than RBAC in addressing the principle of least privileges.
    - ReBAC, since it supports assigning relationships between direct objects and direct users (and not just a role), allows for fine-grained permissions. Some systems also support algebraic operators like AND and NOT to express policies like "if this user has relationship X but not relationship Y with the object, then grant access".

- **Robustness**. In large projects or when numerous roles are present, it is easy to miss or improperly perform role checks ([OWASP C7: Enforce Access Controls](https://owasp.org/www-project-proactive-controls/v3/en/c7-enforce-access-controls)). This can result in both too much and too little access. This is especially true in RBAC implementations where a role hierarchy is not present and multiple role checks must be chained to have the desired impact (i.e., `if(user.hasAnyRole("SUPERUSER", "ADMIN", "ACCT_MANAGER"))` ).
- **Speed**. In RBAC, "role explosion" can occur when a system defines too many roles. If users send their credential and roles through means like HTTP headers, which have size limits, there may not be enough space to include all of the user's roles. A viable workaround to this problem is to only send the user ID, and then the application retrieves the user's roles, but this will increase the latency of every request.
- **Supports Multi-Tenancy and Cross-Organizational Requests**. RBAC is poorly suited for use cases where distinct organizations or customers will need access to the same set of protected resources. Meeting such requirements with RBAC would require highly cumbersome methods such as configuring rule sets for each customer in a multi-tenant environment or requiring pre-provisioning of identities for cross-organizational requests ([OWASP C7](https://owasp.org/www-project-proactive-controls/v3/en/c7-enforce-access-controls); [NIST SP 800-162](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-162.pdf)). By contrast, as long as attributes are consistently defined, ABAC implementations allow access control decisions to be "executed and administered in the same or separate infrastructures, while maintaining appropriate levels of security" ([NIST SP 800-162](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-162.pdf), pg. 6).
- **Ease of Management**. Although the initial setup for RBAC is often simpler than ABAC, this short-term benefit quickly vanishes as the scale and complexity of a system grows. In the beginning, a couple of simple roles, such as User and Admin, may suffice for some apps, but this is very unlikely to hold true for any length of time in production applications. As roles become more numerous, both testing and auditing, critical processes for establishing trust in one's codebase and logic, become more difficult ([OWASP C7](https://owasp.org/www-project-proactive-controls/v3/en/c7-enforce-access-controls)). By contrast, ABAC and ReBAC are far more expressive, incorporate attributes and Boolean logic that better reflects real-world concerns, are easier to update when access-control needs change, and encourages the separation of policy management from  enforcement and provisioning of identities ([NIST SP 800-162](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-162.pdf); see also [XACML-V3.0](https://docs.oasis-open.org/xacml/3.0/xacml-3.0-core-spec-os-en.html) for a standard that highlights these benefits)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- **きめ細かく複雑なブールロジックをサポートする**。RBAC では、アクセス判断はロールの有無に基づいて行われます。つまり、リクエスト元エンティティについて考慮される主な特性は、割り当てられたロールです。このような単純なロジックは、オブジェクトレベルまたは水平アクセス制御の判断や、複数の要素を必要とする判断を支えるには不十分です。
  - ABAC は、考慮できる特性の数と種類の両方を大幅に拡張します。ABAC では、「ロール」または職務機能はサブジェクトに割り当てられる一つの属性になり得ますが、それを単独で考慮する必要はありません。特定の要求アクセスにその特性が関係しない場合は、まったく考慮しないこともできます。さらに、ABAC は時刻、使用されたデバイス種別、地理的位置などの環境属性やその他の動的属性を組み込めます。通常業務時間外に機微なリソースへのアクセスを拒否することや、ユーザーが必須トレーニングを最近完了していない場合にアクセスを拒否することは、RBAC では満たすのが難しいアクセス制御要件を ABAC が満たせる例の一部にすぎません。したがって、ABAC は最小権限の原則に対処するうえで RBAC より効果的です。
  - ReBAC は、単なるロールではなく、直接のオブジェクトと直接のユーザーの間に関係を割り当てることをサポートするため、きめ細かな権限を可能にします。一部のシステムでは AND や NOT のような代数演算子もサポートし、「このユーザーがオブジェクトに対して関係 X を持つが関係 Y は持たない場合、アクセスを許可する」といったポリシーを表現できます。
- **堅牢性**。大規模プロジェクトや多数のロールが存在する場合、ロールチェックを見落としたり不適切に実行したりしやすくなります ([OWASP C7: Enforce Access Controls](https://owasp.org/www-project-proactive-controls/v3/en/c7-enforce-access-controls))。その結果、アクセスが多すぎる場合も少なすぎる場合もあります。これは、ロール階層が存在せず、望む効果を得るために複数のロールチェックを連結しなければならない RBAC 実装で特に当てはまります。例: `if(user.hasAnyRole("SUPERUSER", "ADMIN", "ACCT_MANAGER"))`。
- **速度**。RBAC では、システムが過剰に多くのロールを定義すると「role explosion」が発生する可能性があります。ユーザーが資格情報やロールを HTTP ヘッダーのようなサイズ制限のある手段で送信する場合、ユーザーのすべてのロールを含める十分な領域がない可能性があります。この問題に対する実行可能な回避策は、ユーザー ID だけを送信し、アプリケーションがユーザーのロールを取得することですが、これによりすべてのリクエストのレイテンシが増加します。
- **マルチテナンシーと組織横断リクエストをサポートする**。RBAC は、異なる組織や顧客が同じ保護リソース集合へアクセスする必要があるユースケースには適していません。そのような要件を RBAC で満たすには、マルチテナント環境で顧客ごとにルールセットを構成する、または組織横断リクエストのために ID を事前プロビジョニングするなど、非常に扱いにくい方法が必要になります ([OWASP C7](https://owasp.org/www-project-proactive-controls/v3/en/c7-enforce-access-controls); [NIST SP 800-162](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-162.pdf))。対照的に、属性が一貫して定義されている限り、ABAC 実装は「適切なセキュリティレベルを維持しながら、同一または別個のインフラストラクチャで実行および管理される」アクセス制御判断を可能にします ([NIST SP 800-162](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-162.pdf), pg. 6)。
- **管理の容易さ**。RBAC の初期セットアップは ABAC より単純であることが多いものの、この短期的な利点はシステムの規模と複雑さが増すにつれてすぐに消えます。初期段階では User や Admin のようないくつかの単純なロールで十分なアプリもありますが、本番アプリケーションでこれが長期間成り立つ可能性は非常に低いです。ロールが増えるにつれて、コードベースとロジックへの信頼を確立するために重要なプロセスであるテストと監査の両方が難しくなります ([OWASP C7](https://owasp.org/www-project-proactive-controls/v3/en/c7-enforce-access-controls))。対照的に、ABAC と ReBAC ははるかに表現力が高く、現実世界の懸念をよりよく反映する属性とブールロジックを組み込み、アクセス制御ニーズが変化したときに更新しやすく、ポリシー管理を強制と ID プロビジョニングから分離することを促します ([NIST SP 800-162](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-162.pdf)。これらの利点を示す標準として [XACML-V3.0](https://docs.oasis-open.org/xacml/3.0/xacml-3.0-core-spec-os-en.html) も参照)。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Ensure Lookup IDs are Not Accessible Even When Guessed or Cannot Be Tampered With

Applications often expose the internal object identifiers (such as an account number or Primary Key in a database) that are used to locate and reference an object. This ID may be exposed as a query parameter, path variable, "hidden" form field or elsewhere. For example:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Ensure Lookup IDs are Not Accessible Even When Guessed or Cannot Be Tampered With

アプリケーションは、オブジェクトの検索や参照に使用される内部オブジェクト識別子、たとえば口座番号やデータベースの主キーを公開することがよくあります。この ID は、クエリパラメータ、パス変数、「hidden」フォームフィールド、またはその他の場所で公開される可能性があります。例:

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```text
https://mybank.com/accountTransactions?acct_id=901
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Based on this URL, one could reasonably assume that the application will return a listing of transactions and that the transactions returned will be restricted to a particular account - the account indicated in the `acct_id` param. But what would happen if the user changed the value of the `acct_id` param to another value such as `523`. Will the user be able to view transactions associated with another account even if it does not belong to him? If not, will the failure simply be the result of the account "523" not existing/not being found or will it be due to a failed access control check? Although this example may be an oversimplification, it illustrates a very common security flaw in application development - [CWE 639: Authorization Bypass Through User-Controlled Key](https://cwe.mitre.org/data/definitions/639.html).  When exploited, this weakness can result in authorization bypasses, horizontal privilege escalation and, less commonly, vertical privilege escalation (see [CWE-639](https://cwe.mitre.org/data/definitions/639.html)). This type of vulnerability also represents a form of Insecure Direct Object Reference (IDOR). The following paragraphs will describe the weakness and possible mitigations.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

この URL に基づくと、アプリケーションが取引一覧を返し、返される取引が特定の口座、つまり `acct_id` パラメータで示された口座に限定されると合理的に想定できます。しかし、ユーザーが `acct_id` パラメータの値を `523` のような別の値に変更した場合はどうなるでしょうか。その口座が自分のものでなくても、ユーザーは別口座に関連する取引を表示できるでしょうか。表示できない場合、その失敗は単に口座 `523` が存在しない、または見つからない結果でしょうか。それともアクセス制御チェックの失敗によるものでしょうか。この例は単純化しすぎているかもしれませんが、アプリケーション開発で非常に一般的なセキュリティ欠陥である [CWE 639: Authorization Bypass Through User-Controlled Key](https://cwe.mitre.org/data/definitions/639.html) を示しています。この弱点が悪用されると、認可バイパス、水平権限昇格、よりまれには垂直権限昇格が生じる可能性があります ([CWE-639](https://cwe.mitre.org/data/definitions/639.html) を参照)。この種の脆弱性は、Insecure Direct Object Reference (IDOR) の一形態でもあります。以下の段落では、この弱点と可能な緩和策を説明します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

In the example above, the lookup ID was not only exposed to the user and readily tampered with, but also appears to have been a fairly predictable, perhaps sequential, value.  While one can use various techniques to mask or randomize these IDs and make them hard to guess, such an approach is generally not sufficient by itself. A user should not be able to access a resource they do not have permissions simply because they are able to guess and manipulate that object's identifier in a query param or elsewhere. Rather than relying on some form of security through obscurity, the focus should be on controlling access to the underlying objects and/or the identifiers themselves. Recommended mitigations for this weakness include the following:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

上記の例では、検索 ID がユーザーに公開され、容易に改ざんできるだけでなく、かなり予測可能、場合によっては連番の値であったようにも見えます。これらの ID を隠したりランダム化したりして推測しにくくするためにさまざまな技法を使用できますが、そのようなアプローチだけでは一般に十分ではありません。ユーザーがクエリパラメータやその他の場所でオブジェクト識別子を推測して操作できるという理由だけで、権限のないリソースにアクセスできるべきではありません。何らかの security through obscurity に依存するのではなく、基盤となるオブジェクトや識別子そのものへのアクセスを制御することに焦点を置くべきです。この弱点に対する推奨緩和策は次のとおりです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Avoid exposing identifiers to the user when possible. For example it should be possible to retrieve some objects, such as account details,  based solely on currently authenticated user's identity and attributes (e.g. through information contained in a securely implemented JSON Web Token (JWT) or server-side session).
- Implement user/session specific indirect references using a tool such as [OWASP ESAPI](https://owasp.org/www-project-enterprise-security-api/) (see [OWASP 2013 Top 10 - A4 Insecure Direct Object References](https://wiki.owasp.org/index.php/Top_10_2013-A4-Insecure_Direct_Object_References))
- Perform access control checks on *every* request for the *specific* object or functionality being accessed. Just because a user has access to an object of a particular type does not mean they should have access to every object of that particular type.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- 可能な場合は、識別子をユーザーに公開しないようにします。たとえば、口座詳細などの一部のオブジェクトは、現在認証済みユーザーの ID と属性だけに基づいて取得できるべきです。たとえば、安全に実装された JSON Web Token (JWT) またはサーバー側セッションに含まれる情報を通じて取得します。
- [OWASP ESAPI](https://owasp.org/www-project-enterprise-security-api/) などのツールを使用して、ユーザーまたはセッション固有の間接参照を実装します ([OWASP 2013 Top 10 - A4 Insecure Direct Object References](https://wiki.owasp.org/index.php/Top_10_2013-A4-Insecure_Direct_Object_References) を参照)。
- アクセスされる特定のオブジェクトまたは機能について、すべてのリクエストでアクセス制御チェックを実行します。ユーザーが特定の種類のオブジェクトへアクセスできるからといって、その種類のすべてのオブジェクトへアクセスできるべきだという意味ではありません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Enforce Authorization Checks on Static Resources

The importance of securing static resources is often overlooked or at least overshadowed by other security concerns. Although securing databases and similar data stores often justly receive significant attention from security conscious teams, static resources must also be appropriately secured. Although unprotected static resources are certainly a problem for websites and web applications of all forms, in recent years, poorly secured resources in cloud storage offerings (such as Amazon S3 Buckets) have risen to prominence. When securing static resources, consider the following:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Enforce Authorization Checks on Static Resources

静的リソースの保護の重要性は、しばしば見落とされるか、少なくとも他のセキュリティ上の懸念に隠れがちです。データベースや同様のデータストアの保護が、セキュリティ意識の高いチームから相応の大きな注目を受けることは多いですが、静的リソースも適切に保護しなければなりません。保護されていない静的リソースは、あらゆる形態の Web サイトや Web アプリケーションにとって確かに問題ですが、近年では、Amazon S3 Buckets などのクラウドストレージサービスで不十分に保護されたリソースが目立つようになっています。静的リソースを保護するときは、次の点を検討してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Ensure that static resources are incorporated into access control policies. The type of protection required for static resources will necessarily be highly contextual. It may be perfectly acceptable for some static resources to be publicly accessible, while others should only be accessible when a highly restrictive set of user and environmental attributes are present. Understanding the type of data exposed in the specific resources under consideration is thus critical. Consider whether a formal Data Classification scheme should be established and incorporated into the application's access control logic (see [here](https://resources.infosecinstitute.com/information-and-asset-classification/) for an overview of data classification).
- Ensure any cloud based services used to store static resources are secured using the configuration options and tools provided by the vendor. Review the cloud provider's documentation (see guidance from [AWS](https://aws.amazon.com/premiumsupport/knowledge-center/secure-s3-resources/), [Google Cloud](https://cloud.google.com/storage/docs/best-practices#security) and [Azure](https://docs.microsoft.com/en-us/azure/storage/blobs/security-recommendations) for specific implementations details).
- When possible, protect static resources using the same access control logic and mechanisms that are used to secure other application resources and functionality.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- 静的リソースがアクセス制御ポリシーに組み込まれていることを確認します。静的リソースに必要な保護の種類は、必然的にコンテキストに大きく依存します。一部の静的リソースは公開アクセス可能でまったく問題ない場合がありますが、他のリソースは、非常に制限されたユーザー属性と環境属性の集合が存在する場合にのみアクセス可能であるべきです。したがって、検討対象の特定リソースで公開されるデータの種類を理解することが重要です。正式な Data Classification スキームを確立し、アプリケーションのアクセス制御ロジックに組み込むべきかを検討してください。データ分類の概要については [こちら](https://resources.infosecinstitute.com/information-and-asset-classification/) を参照してください。
- 静的リソースの保存に使用するクラウドベースサービスが、ベンダーが提供する構成オプションとツールを使用して保護されていることを確認します。具体的な実装詳細について、クラウドプロバイダーのドキュメントをレビューしてください。[AWS](https://aws.amazon.com/premiumsupport/knowledge-center/secure-s3-resources/)、[Google Cloud](https://cloud.google.com/storage/docs/best-practices#security)、[Azure](https://docs.microsoft.com/en-us/azure/storage/blobs/security-recommendations) のガイダンスを参照してください。
- 可能な場合は、他のアプリケーションリソースや機能を保護するために使用しているものと同じアクセス制御ロジックとメカニズムで、静的リソースを保護します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Verify that Authorization Checks are Performed in the Right Location

Developers must never rely on client-side access control checks. While such checks may be permissible for improving the user experience, they should never be the decisive factor in granting or denying access to a resource; client-side logic is often easy to bypass. Access control checks must be performed server-side, at the gateway, or using serverless function (see [OWASP ASVS 4.0.3, V1.4.1 and V4.1.1](https://raw.githubusercontent.com/OWASP/ASVS/v4.0.3/4.0/OWASP%20Application%20Security%20Verification%20Standard%204.0.3-en.pdf))

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Verify that Authorization Checks are Performed in the Right Location

開発者は、クライアント側のアクセス制御チェックに決して依存してはいけません。このようなチェックはユーザー体験を改善するためには許容される場合がありますが、リソースへのアクセスを許可または拒否する決定的要因にしてはいけません。クライアント側ロジックは多くの場合、容易にバイパスできます。アクセス制御チェックは、サーバー側、ゲートウェイ、またはサーバーレス関数で実行しなければなりません ([OWASP ASVS 4.0.3, V1.4.1 and V4.1.1](https://raw.githubusercontent.com/OWASP/ASVS/v4.0.3/4.0/OWASP%20Application%20Security%20Verification%20Standard%204.0.3-en.pdf) を参照)。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Exit Safely when Authorization Checks Fail

Failed access control checks are a normal occurrence in a secured application; consequently, developers must plan for such failures and handle them securely. Improper handling of such failures can lead to the application being left in an unpredictable state ([CWE-280: Improper Handling of Insufficient Permissions or Privileges](https://cwe.mitre.org/data/definitions/280.html)). Specific recommendations include the following:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Exit Safely when Authorization Checks Fail

アクセス制御チェックの失敗は、保護されたアプリケーションでは通常発生するものです。したがって、開発者はそのような失敗を想定し、安全に処理する必要があります。そのような失敗の不適切な処理は、アプリケーションを予測不能な状態に残す可能性があります ([CWE-280: Improper Handling of Insufficient Permissions or Privileges](https://cwe.mitre.org/data/definitions/280.html))。具体的な推奨事項は次のとおりです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Ensure all exception and failed access control checks are handled no matter how unlikely they seem ([OWASP Top Ten Proactive Controls C10: Handle all errors and exceptions](https://owasp.org/www-project-proactive-controls/v3/en/c10-errors-exceptions.html)). This does not mean that an application should always try to "correct" for a failed check; oftentimes a simple message or HTTP status code is all that is required.
- Centralize the logic for handling failed access control checks.
- Verify the handling of exception and authorization failures. Ensure that such failures, no matter how unlikely, do not put the software into an unstable state that could lead to authorization bypass.
- Ensure sensitive information, such as system logs or debugging output, is not exposed in error messages. Misconfigured error messages can increase the attack surface of your application. ([CWE-209: Generation of Error Message Containing Sensitive Information](https://cwe.mitre.org/data/definitions/209.html))

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- どれほど起こりにくく見えても、すべての例外と失敗したアクセス制御チェックが処理されることを確認します ([OWASP Top Ten Proactive Controls C10: Handle all errors and exceptions](https://owasp.org/www-project-proactive-controls/v3/en/c10-errors-exceptions.html))。これは、アプリケーションが失敗したチェックを常に「修正」しようとすべきという意味ではありません。多くの場合、単純なメッセージまたは HTTP ステータスコードだけで十分です。
- 失敗したアクセス制御チェックを処理するロジックを中央集約します。
- 例外と認可失敗の処理を検証します。そのような失敗がどれほど起こりにくくても、認可バイパスにつながり得る不安定な状態にソフトウェアを置かないことを確認します。
- システムログやデバッグ出力などの機微情報がエラーメッセージで公開されないことを確認します。誤設定されたエラーメッセージは、アプリケーションの攻撃対象領域を増やす可能性があります ([CWE-209: Generation of Error Message Containing Sensitive Information](https://cwe.mitre.org/data/definitions/209.html))。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Implement Appropriate Logging

Logging is one of the most important detective controls in application security; insufficient logging and monitoring is recognized as among  the most critical security risks in [OWASP's Top Ten 2021](https://owasp.org/Top10/A09_2021-Security_Logging_and_Monitoring_Failures/). Appropriate logs can not only detect malicious activity, but are also invaluable resources in post-incident investigations, can be used to troubleshoot access control and other security related problems, and are useful in security auditing. Though easy to overlook during the initial design and requirements phase, logging is an important component of holistic application security and must be incorporated into all phases of the SDLC. Recommendations for logging include the following:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Implement Appropriate Logging

ログ記録は、アプリケーションセキュリティにおける最も重要な検知的制御の一つです。不十分なログ記録と監視は、[OWASP Top Ten 2021](https://owasp.org/Top10/A09_2021-Security_Logging_and_Monitoring_Failures/) で最も重大なセキュリティリスクの一つとして認識されています。適切なログは悪意ある活動を検知できるだけでなく、インシデント後の調査において非常に価値のあるリソースであり、アクセス制御やその他のセキュリティ関連問題のトラブルシューティングにも使用でき、セキュリティ監査にも役立ちます。初期の設計および要件フェーズでは見落とされやすいものの、ログ記録は包括的なアプリケーションセキュリティの重要な構成要素であり、SDLC のすべてのフェーズに組み込まなければなりません。ログ記録に関する推奨事項は次のとおりです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Log using consistent, well-defined formats that can be readily parsed for analysis. According to [OWASP Top Ten Proactive Controls C9](https://owasp.org/www-project-proactive-controls/v3/en/c9-security-logging.html), [Apache Logging Services](https://logging.apache.org/) is one example of a project that provides support for numerous languages and platforms
- Carefully determine the amount of information to log. This should be determined according to the specific application environment and requirements. Both too much and too little logging may be considered security weaknesses (see [CWE-778](https://cwe.mitre.org/data/definitions/778.html) and [CWE-779](https://cwe.mitre.org/data/definitions/779.html)). Too little logging can result in malicious activity going undetected and greatly reduce the effectiveness of post-incident analysis. Too much logging not only can strain resources and lead to excessive false positives, but may also result in sensitive data being needlessly logged.
- Ensure clocks and timezones are synchronized across systems. Accuracy is crucial in piecing together the sequence of an attack during and after incident response.
- Consider incorporating application logs into a centralized log server or SIEM.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- 分析のために容易にパースできる、一貫した明確な形式でログを記録します。[OWASP Top Ten Proactive Controls C9](https://owasp.org/www-project-proactive-controls/v3/en/c9-security-logging.html) によると、[Apache Logging Services](https://logging.apache.org/) は多数の言語とプラットフォームをサポートするプロジェクトの一例です。
- ログに記録する情報量を慎重に決定します。これは、特定のアプリケーション環境と要件に従って決定すべきです。ログが多すぎることも少なすぎることも、セキュリティ上の弱点と見なされる場合があります ([CWE-778](https://cwe.mitre.org/data/definitions/778.html) と [CWE-779](https://cwe.mitre.org/data/definitions/779.html) を参照)。ログが少なすぎると、悪意ある活動が検知されず、インシデント後分析の有効性が大きく低下する可能性があります。ログが多すぎると、リソースに負荷をかけ、過剰な誤検知を招くだけでなく、機微データが不必要にログ記録される可能性もあります。
- システム間で時計とタイムゾーンが同期されていることを確認します。インシデント対応中および対応後に攻撃の順序をつなぎ合わせるには、正確性が極めて重要です。
- アプリケーションログを集中ログサーバーまたは SIEM に取り込むことを検討します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Create Unit and Integration Test Cases for Authorization Logic

Unit and integration testing are essential for verifying that an application performs as expected and consistently across changes. Flaws in access control logic can be subtle, particularly when requirements are complex; however, even a small logical or configuration error in access control can result in severe consequences. Although not a substitution for a dedicated security test or penetration test (see [OWASP WSTG 4.5](https://owasp.org/www-project-web-security-testing-guide/v42/4-Web_Application_Security_Testing/05-Authorization_Testing/README) for an excellent guide on this topic as it relates to access control), automated unit and integration testing of access control logic can help reduce the number of security flaws that make it into production. These tests are good at catching the "low-hanging fruit" of security issues but not more sophisticated attack vectors ([OWASP SAMM: Security Testing](https://owaspsamm.org/model/verification/security-testing/)).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Create Unit and Integration Test Cases for Authorization Logic

単体テストと統合テストは、アプリケーションが期待どおりに動作し、変更を通じて一貫していることを検証するために不可欠です。アクセス制御ロジックの欠陥は、要件が複雑な場合は特に微妙なものになり得ます。しかし、アクセス制御における小さなロジックエラーや構成エラーであっても、深刻な結果をもたらす可能性があります。専用のセキュリティテストやペネトレーションテストの代替ではありませんが、アクセス制御に関連するこのトピックの優れたガイドとして [OWASP WSTG 4.5](https://owasp.org/www-project-web-security-testing-guide/v42/4-Web_Application_Security_Testing/05-Authorization_Testing/README) を参照してください。アクセス制御ロジックの自動単体テストと統合テストは、本番環境に入り込むセキュリティ欠陥の数を減らすのに役立ちます。これらのテストは、セキュリティ問題の「low-hanging fruit」を見つけることには有効ですが、より高度な攻撃ベクトルには十分ではありません ([OWASP SAMM: Security Testing](https://owaspsamm.org/model/verification/security-testing/))。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Unit and integration testing should aim to incorporate many of the concepts explored in this document. For example, is access being denied by default? Does the application terminate safely when an access control check fails, even under abnormal conditions? Are ABAC policies being properly enforced? While simple unit and integration tests can never replace manual testing performed by a skilled hacker, they are an important tool for detecting and correcting security issues quickly and with far less resources than manual testing.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

単体テストと統合テストは、この文書で検討した多くの概念を組み込むことを目指すべきです。たとえば、アクセスはデフォルトで拒否されていますか。異常な条件下でも、アクセス制御チェックが失敗したときにアプリケーションは安全に終了しますか。ABAC ポリシーは適切に強制されていますか。単純な単体テストと統合テストが熟練したハッカーによる手動テストに取って代わることは決してできませんが、手動テストよりはるかに少ないリソースでセキュリティ問題を迅速に検出し修正するための重要なツールです。

</div>
</div>

</section>
</div>

## References

<div className="referenceFooter">

### ABAC

- [ABAC with Spring Security](https://dzone.com/articles/simple-attribute-based-access-control-with-spring)

- [What is ABAC? Implementation patterns and examples](https://www.osohq.com/learn/what-is-attribute-based-access-control-abac)

- [NIST Special Publication 800-162 Guide to Attribute Based Access Control (ABAC) Definition and Considerations](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-162.pdf)

- [NIST SP 800-178 A Comparison of Attribute Based Access Control (ABAC) Standards for Data Service Applications](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-178.pdf)

- [NIST SP 800-205 Attribute Considerations for Access Control Systems](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-205.pdf)

- [XACML-V3.0](https://docs.oasis-open.org/xacml/3.0/xacml-3.0-core-spec-os-en.html) for standard that highlights these benefits

### General

- [OWASP Application Security Verification Standard 4.0 (especially see V4: Access Control Verification Requirements)](https://raw.githubusercontent.com/OWASP/ASVS/v4.0.3/4.0/OWASP%20Application%20Security%20Verification%20Standard%204.0.3-en.pdf)

- [OWASP Web Security Testing Guide - 4.5 Authorization Testing](https://owasp.org/www-project-web-security-testing-guide/v42)

### Least Privilege

- [Least Privilege](https://us-cert.cisa.gov/bsi/articles/knowledge/principles/least-privilege)

### RBAC

- [Role-Based Access Controls](https://csrc.nist.gov/CSRC/media/Publications/conference-paper/1992/10/13/role-based-access-controls/documents/ferraiolo-kuhn-92.pdf)

### ReBAC

- [Relationship-Based Access Control (ReBAC)](https://www.osohq.com/academy/relationship-based-access-control-rebac)
- [Google Zanzibar](https://zanzibar.academy/)

</div>


## Attribution

<div className="attributionFooter">

- Original: Authorization Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: English original retained for comparison. Japanese translation added. Bilingual display generated from official source and local Japanese translation.
- Retrieved: 2026-05-20

</div>
