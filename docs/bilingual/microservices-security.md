---
title: Microservices Security Cheat Sheet
hide_title: true
---

<div className="docHero" data-category="asvs-v11">
  <h1>マイクロサービスセキュリティチートシート</h1>
  <div className="docMeta">
    <span className="docPill">最終更新: 2026-05-21</span>
    <span className="docPill">読了時間: 約 22 分</span>
    <span className="docPill">カテゴリ: 検証とビジネスロジック</span>
  </div>
</div>

<div className="tabbedContent">
  <input className="tabInput" type="radio" name="microservices-security-view" id="microservices-security-original" />
  <input className="tabInput" type="radio" name="microservices-security-view" id="microservices-security-translation" defaultChecked />
  <input className="tabInput" type="radio" name="microservices-security-view" id="microservices-security-bilingual" />

  <div className="contentTabs">
    <label htmlFor="microservices-security-original" title="OWASP 原文">原文</label>
    <label htmlFor="microservices-security-translation" title="日本語訳">翻訳</label>
    <label htmlFor="microservices-security-bilingual" title="原文と翻訳を並べて確認">対比表示</label>
  </div>

<section id="microservices-security-original-panel" className="tabPanel originalPanel contentPanel">

# Microservices Security Cheat Sheet

## Introduction

The microservice architecture is being increasingly used for designing and implementing application systems in both cloud-based and on-premise infrastructures, high-scale applications and services. There are many security challenges that need to be addressed in the application design and implementation phases. The fundamental security requirements that have to be addressed during design phase are authentication and authorization. Therefore, it is vital for applications security architects to understand and properly use existing architecture patterns to implement authentication and authorization in microservices-based systems. The goal of this cheat sheet is to identify such patterns and to do recommendations for applications security architects on possible ways to use them.

## Edge-level authorization

In simple scenarios, authorization can happen only at the edge level (API gateway). The API gateway can be leveraged to centralize enforcement of authorization for all downstream microservices, eliminating the need to provide authentication and access control for each of the individual services. In such cases, NIST recommends implementing mitigating controls such as mutual authentication to prevent direct, anonymous connections to the internal services (API gateway bypass). It should be noted that authorization at the edge layer has the [following limitations](https://www.youtube.com/watch?v=UnXjwCWgBKU):

- Pushing all authorization decisions to the API gateway can quickly become hard to manage in complex ecosystems with many roles and access control rules.
- The API gateway may become a single point of decision that may violate the “defense in depth” principle.
- Operation teams typically own the API gateway, so development teams cannot directly make authorization changes, slowing down velocity due to additional communication and process overhead.

In most cases, development teams implement authorization in both places – at the edge level at a coarse level of granularity, and at service level. To authenticate an external entity, the edge can use access tokens (referenced token or self-contained token) transmitted via HTTP headers (e.g., “Cookie” or “Authorization”) or use mTLS.

## Service-level authorization

Service-level authorization gives each microservice more control to enforce access control policies.
For further discussion, we will use terms and definitions according with [NIST SP 800-162](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-162.pdf). The functional components of an access control system can be classified as follows:

- Policy Administration Point (PAP): Provides a user interface for creating, managing, testing, and debugging access control rules.
- Policy Decision Point (PDP): Computes access decisions by evaluating the applicable access control policy.
- Policy Enforcement Point (PEP): Enforces policy decisions in response to a request from a subject requesting access to a protected object.
- Policy Information Point (PIP): Serves as the retrieval source of attributes or the data required for policy evaluation to provide the information needed by the PDP to make decisions.

![NIST ABAC framework](https://cheatsheetseries.owasp.org/assets/NIST_ABAC.png)

### Service-level authorization: existing patterns

#### Decentralized pattern

The development team implements PDP and PEP directly at the microservice code level. All the access control rules and attributes that need to implement that rule are defined and stored on each microservice (step 1). When a microservice receives a request along with some authorization metadata (e.g., end user context or requested resource ID), the microservice analyzes it (step 3) to generate an access control policy decision and then enforces authorization (step 4).

![Decentralized pattern HLD](https://cheatsheetseries.owasp.org/assets/Dec_pattern_HLD.png)

Existing programming language frameworks allow development teams to implement authorization at the microservice layer. For example, [Spring Security allows](https://www.youtube.com/watch?v=v2J32nd0g24) developers to enable scopes checking (e.g., using scopes extracted from incoming JWT) in the resource server and use it to enforce authorization.

Implementing authorization at the source code level means that the code must be updated whenever the development team wants to modify authorization logic.

#### Centralized pattern with single policy decision point

In this pattern, access control rules are defined, stored, and evaluated centrally. Access control rules are defined using PAP (step 1) and delivered to a centralized PDP, along with attributes required to evaluate those rules (step 2). When a subject invokes a microservice endpoint (step 3), the microservice code invokes the centralized PDP via a network call, and the PDP generates an access control policy decision by evaluating the query input against access control rules and attributes (step 4). Based on the PDP decision, the microservice enforces authorization (step 5).

![Centralized pattern with single policy decision point HLD](https://cheatsheetseries.owasp.org/assets/Single_PDP_HLD.png)

To define access control rules, development/operation teams have to use some language or notation. An example is Extensible Access Control Markup Language (XACML) and Next Generation Access Control (NGAC), which is a standard to describe policy rules.

This pattern can cause latency issues due to additional network calls to the remote PDP endpoint, but it can be mitigated by caching authorization policy decisions at the microservice level. It should be mentioned that the PDP must be operated in high-availability mode to prevent resilience and availability issues. Application security architects should combine it with other patterns (e.g., authorization on API gateway level) to enforce the "defense in depth" principle.

#### Centralized pattern with embedded policy decision point

In this pattern, access control rules are defined centrally but stored and evaluated at the microservice level. Access control rules are defined using PAP (step 1) and delivered to an embedded PDP, along with attributes required to evaluate those rules (step 2). When a subject invokes a microservice endpoint (step 3), the microservice code invokes the PDP, and the PDP generates an access control policy decision by evaluating the query input against access control rules and attributes (step 4). Based on the PDP decision, the microservice enforces authorization (step 5).

![Centralized pattern with embedded policy decision point HLD](https://cheatsheetseries.owasp.org/assets/Embed_PDP_HLD.png)

The PDP code in this case, can be implemented as a microservice built-in library or sidecar in a service mesh architecture. Due to possible network/host failures and network latency, it is advisable to implement embedded PDP as a microservice library or sidecar on the same host as the microservice. Embedded PDP usually stores authorization policy and policy-related data in-memory to minimize external dependencies during authorization enforcement and get low latency. The main difference from the “Centralized pattern with single policy decision point” approach, is that authorization *decisions* do not store on the microservice side, up-to-date authorization *policy* is stored on the microservice side instead. It should be mentioned that caching authorization decisions may lead to applying outdated authorization rules and access control violations.

Netflix presented ([link](https://www.youtube.com/watch?v=R6tUNpRpdnY), [link](https://conferences.oreilly.com/velocity/vl-ca-2018/public/schedule/detail/66606.html)) a real case of using “Centralized pattern with embedded PDP” pattern to implement authorization on the microservices level.

![Centralized pattern with embedded policy decision point HLD](https://cheatsheetseries.owasp.org/assets/Netflix_AC.png)

- The Policy portal and Policy repository are UI-based systems for creating, managing, and versioning access control rules.
- The Aggregator fetches data used in access control rules from all external sources and keeps it up to date.
- The Distributor pulls access control rules (from the Policy repository) and data used in access control rules (from Aggregators) to distribute them among PDPs.
- The PDP (library) asynchronously pulls access control rules and data and keeps them up to date to enforce authorization by the PEP component.

### Recommendations on how to implement authorization

1. To achieve scalability, it is not advisable to hardcode authorization policy in source code (decentralized pattern) but use a special language to express policy instead. The goal is to externalize/decouple authorization from code, and not just with a gateway/proxy acting as a checkpoint. The recommended pattern for service-level authorization is "Centralized pattern with embedded PDP" due to its resilience and wide adoption.
2. The authorization solution should be a platform-level solution; a dedicated team (e.g., Platform security team) must be accountable for the development and operation of the authorization solution as well as sharing microservice blueprint/library/components that implement authorization among development teams.
3. The authorization solution should be based on widely-used solutions because implementing a custom solution has the following cons:
    - Security or engineering teams have to build and maintain a custom solution.
    - It is necessary to build and maintain client library SDKs for every language used in the system architecture.
    - There is a necessity to train every developer on custom authorization service API and integration, and there’s no open-source community to source information from.
4. There is a probability that not all access control policies can be enforced by gateways/proxies and shared authorization library/components, so some specific access control rules still have to be implemented on microservice business code level. In order to do that, it is advisable to have microservice development teams use simple questionnaires/check-lists to uncover such security requirements and handle them properly during microservice development.
5. It is advisable to implement the “defense in depth” principle and enforce authorization on:
    - Gateway and proxy level, at a coarse level of granularity.
    - Microservice level, using shared authorization library/components to enforce fine-granted decisions.
    - Microservice business code level, to implement business-specific access control rules.
6. Formal procedures on access control policy must be implemented on development, approval and rolling-out.

## External Entity Identity Propagation

To make fine-grained authorization decisions at the microservice level, a microservice has to understand the caller’s context (e.g., user ID, user roles/groups). In order to allow the internal service layer to enforce authorization, the edge layer has to propagate an authenticated external entity identity (e.g., end user context) along with a request to downstream microservices. One of the simplest ways to propagate external entity identity is to reuse the access token received by the edge and pass it to internal microservices. However, it should be mentioned that this approach is highly insecure due to possible external access token leakage and may increase an attack surface because the communication relies on a proprietary token-based system implementation. If an internal service is unintentionally exposed to the external network, then it can be directly accessed using the leaked access token. This attack is not possible if the internal service only accepts a token format known only to internal services. This pattern is also not external access token agnostic, i.e., internal services have to understand external access tokens and support a wide range of authentication techniques to extract identity from different types of external tokens (e.g., JWT, cookie, OpenID Connect token).

### Identity propagation: existing patterns

#### Sending the external entity identity as clear or self-signed data structures

In this approach, the microservice extracts the external entity identity from the incoming request (e.g., by parsing the incoming access token), creates a data structure (e.g., JSON or self-signed JWT) with that context, and passes it on to an internal microservice.
In this scenario, the recipient microservice has to trust the calling microservice. If the calling microservice wants to violate access control rules, it can do so by setting any user/client ID or user roles it wants in the HTTP header. This approach is suitable only in highly trusted environments where every microservice is developed by a trusted development team that applies secure software development practices.

#### Using a data structure signed by a trusted issuer

In this pattern, after the external request is authenticated by the authentication service at the edge layer, a data structure representing the external entity identity (e.g., containing user ID, user roles/groups, or permissions) is generated, signed, or encrypted by the trusted issuer and propagated to internal microservices.

![Signed ID propagation](https://cheatsheetseries.owasp.org/assets/Signed_ID_propogation.png)

[Netflix presented](https://www.infoq.com/presentations/netflix-user-identity/) a real-world case of using that pattern: a structure called “Passport” that contains the user ID and its attributes and which is HMAC protected at the edge level for each incoming request. This structure is propagated to internal microservices and never exposed outside.

1. The Edge Authentication Service (EAS) obtains a secret key from the Key Management System.
2. EAS receives an access token (e.g., in a cookie, JWT, OAuth2 token) from the incoming request.
3. EAS decrypts the access token, resolves the external entity identity, and sends it to the internal services in the signed “Passport” structure.
4. Internal services can extract user identity to enforce authorization (e.g., to implement identity-based authorization) using wrappers.
5. If necessary, internal service can propagate the “Passport” structure to downstream services in the call chain.

![Netflix ID propagation approach](https://cheatsheetseries.owasp.org/assets/Netflix_ID_prop.png)

It should be mentioned that the pattern is external access token agnostic and allows for decoupling of external entities from their internal representations.

### Recommendation on how to implement identity propagation

1. In order to implement an external access token agnostic and extendable system, decouple the access tokens issued for an external entity from its internal representation. Use a single data structure to represent and propagate the external entity identity among microservices. The edge-level service has to verify the incoming external access token, issue an internal entity representation structure, and propagate it to downstream services.
2. Using an internal entity representation structure signed (symmetric or asymmetric encryption) by a trusted issuer is a recommended pattern adopted by the community.
3. The internal entity representation structure should be extensible to enable adding more claims that may lead to low latency.
4. The internal entity representation structure must not be exposed outside (e.g., to a browser or external device)

## Service-to-service authentication

### Existing patterns

#### Mutual transport layer security

With an mTLS approach, each microservice can legitimately identify who it talks to, in addition to achieving confidentiality and integrity of the transmitted data. Each microservice in the deployment has to carry a public/private key pair and use that key pair to authenticate to the recipient microservices via mTLS. mTLS is usually implemented with a self-hosted Public Key Infrastructure. The main challenges of using mTLS are key provisioning and trust bootstrap, certificate revocation, and key rotation.

#### Token-based

The token-based approach works at the application layer. A token is a container that may contain the caller ID (microservice ID) and its permissions (scopes). The caller microservice can obtain a signed token by invoking a special security token service using its own service ID and password and then attaches it to every outgoing request, e.g., via HTTP headers. The called microservice can extract the token and validate it online or offline.

![Signed ID propagation](https://cheatsheetseries.owasp.org/assets/Token_validation.png)

1. Online scenario:
    - To validate incoming tokens, the microservice invokes a centralized service token service via network call.
    - Revoked (compromised) tokens can be detected.
    - High latency.
    - Should be applied to critical requests.
2. Offline scenario:
    - To validate incoming tokens, the microservice uses the downloaded service token service public key.
    - Revoked (compromised) tokens may not be detected.
    - Low latency.
    - Should be applied to non-critical requests.

In most cases, token-based authentication works over TLS, which provides confidentiality and integrity of data in transit.

## Logging

Logging services in microservice-based systems aim to meet the principles of accountability and traceability and help detect security anomalies in operations via log analysis. Therefore, it is vital for application security architects to understand and adequately use existing architecture patterns to implement audit logging in microservices-based systems for security operations. A high-level architecture design is shown in the picture below and is based on the following principles:

- Each microservice writes a log message to a local file using standard output (via stdout, stderr).
- The logging agent periodically pulls log messages and sends (publishes) them to the message broker (e.g., NATS, Apache Kafka).
- The central logging service subscribes to messages in the message broker, receives them, and processes them.

![Logging pattern](https://cheatsheetseries.owasp.org/assets/ms_logging_pattern.png)

High-level recommendations to logging subsystem architecture with its rationales are listed below.

1. Microservice shall not send log messages directly to the central logging subsystem using network communication. Microservice shall write its log message to a local log file:
    - this allows to mitigate the threat of data loss due to logging service failure due to attack or in case of its flooding by legitimate microservice
    - in case of logging service outage, microservice will still write log messages to the local file (without data loss), and after logging service recovery, logs will be available to shipping;
2. There shall be a dedicated component (logging agent) decoupled from the microservice. The logging agent shall collect log data on the microservice  (read local log file) and send it to the central logging subsystem. Due to possible network latency issues, the logging agent shall be deployed on the same host (virtual or physical machine) with the microservice:
    - this allows mitigating the threat of data loss due to logging service failure due to attack or in case of its flooding by legitimate microservice
    - in case of logging agent failure, microservice still writes information to the log file, logging agent after recovery will read the file and send information to message broker;
3. A possible DoS attack on the central logging subsystem logging agent shall not use an asynchronous request/response pattern to send log messages. There shall be a message broker to implement the asynchronous connection between the logging agent and central logging service:
    - this allows to mitigate the threat of data loss due to logging service failure in case of its flooding by legitimate microservice
    - in case of logging service outage, microservice will still write log messages to the local file (without data loss), and after logging service recovery, logs will be available to shipping;
4. Logging agent and message broker shall use mutual authentication (e.g., based on TLS) to encrypt all transmitted data (log messages) and authenticate themselves:
    - this allows mitigating threats such as: microservice spoofing, logging/transport system spoofing, network traffic injection, sniffing network traffic
5. Message broker shall enforce access control policy to mitigate unauthorized access and implement the principle of least privileges:
    - this allows mitigating the threat of microservice elevation of privileges
6. Logging agent shall filter/sanitize output log messages to make sure that sensitive data (e.g., PII, passwords, API keys) is never sent to the central logging subsystem (data minimization principle). For a comprehensive overview of items that should be excluded from logging, please see the [OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html#data-to-exclude).
7. Microservices shall generate a correlation ID that uniquely identifies every call chain and helps group log messages to investigate them. The logging agent shall include a correlation ID in every log message.
8. The logging agent shall periodically provide health and status data to indicate its availability or non-availability.
9. The logging agent shall publish log messages in a structured logs format (e.g., JSON, CSV).
10. The logging agent shall append log messages with context data, e.g., platform context (hostname, container name), runtime context (class name, filename).

For a comprehensive overview of events that should be logged and possible data format, please see the [OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html#which-events-to-log) and [Application Logging Vocabulary Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Vocabulary_Cheat_Sheet.html)

## References

- [NIST Special Publication 800-204](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-204.pdf) “Security Strategies for Microservices-based Application Systems”
- [NIST Special Publication 800-204A](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-204A.pdf) “Building Secure Microservices-based Applications Using Service-Mesh Architecture”
- [Microservices Security in Action](https://www.manning.com/books/microservices-security-in-action), Prabath Siriwardena and Nuwan Dias, 2020, Manning

</section>

<section id="microservices-security-translation-panel" className="tabPanel translationPanel contentPanel">

# マイクロサービスセキュリティチートシート

## はじめに

マイクロサービスアーキテクチャは、クラウドベースおよびオンプレミスのインフラストラクチャ、高スケールのアプリケーションやサービスの両方で、アプリケーションシステムの設計と実装にますます使われるようになっています。アプリケーションの設計フェーズと実装フェーズでは、対処すべき多くのセキュリティ課題があります。設計フェーズで対処しなければならない基本的なセキュリティ要件は、認証と認可です。そのため、アプリケーションセキュリティアーキテクトが、マイクロサービスベースのシステムで認証と認可を実装する既存のアーキテクチャパターンを理解し、適切に使用することは重要です。このチートシートの目的は、そのようなパターンを特定し、アプリケーションセキュリティアーキテクトに対して、それらを利用する可能な方法を推奨することです。

## エッジレベル認可

単純なシナリオでは、認可はエッジレベル、つまり API ゲートウェイだけで行うことができます。API ゲートウェイを活用すると、すべての下流マイクロサービスに対する認可の強制を集中化でき、個々のサービスごとに認証とアクセス制御を用意する必要をなくせます。このような場合、NIST は、内部サービスへの直接かつ匿名の接続、つまり API ゲートウェイのバイパスを防ぐために、相互認証などの緩和策を実装することを推奨しています。エッジ層での認可には、[次の制限](https://www.youtube.com/watch?v=UnXjwCWgBKU)がある点に注意してください。

- すべての認可判断を API ゲートウェイに押し込むと、多数のロールやアクセス制御ルールを持つ複雑なエコシステムでは、すぐに管理が難しくなる可能性があります。
- API ゲートウェイが単一の判断点となり、「多層防御」の原則に反する可能性があります。
- 通常、API ゲートウェイは運用チームが所有しているため、開発チームは認可の変更を直接行えません。その結果、追加のコミュニケーションやプロセスのオーバーヘッドにより、開発速度が低下します。

ほとんどの場合、開発チームは認可を二つの場所で実装します。粗い粒度ではエッジレベルで、さらにサービスレベルでも実装します。外部エンティティを認証するために、エッジは HTTP ヘッダー、たとえば `Cookie` や `Authorization` で送信されるアクセストークン、つまり参照トークンまたは自己完結型トークンを使用するか、mTLS を使用できます。

## サービスレベル認可

サービスレベル認可により、各マイクロサービスはアクセス制御ポリシーを強制するためのより多くの制御を持てます。以降の説明では、[NIST SP 800-162](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-162.pdf) に従った用語と定義を使用します。アクセス制御システムの機能コンポーネントは、次のように分類できます。

- Policy Administration Point (PAP): アクセス制御ルールの作成、管理、テスト、デバッグのためのユーザーインターフェイスを提供します。
- Policy Decision Point (PDP): 適用されるアクセス制御ポリシーを評価して、アクセス判断を計算します。
- Policy Enforcement Point (PEP): 保護対象オブジェクトへのアクセスを要求する主体からのリクエストに応じて、ポリシー判断を強制します。
- Policy Information Point (PIP): PDP が判断を行うために必要な情報を提供するため、ポリシー評価に必要な属性またはデータの取得元として機能します。

![NIST ABAC framework](https://cheatsheetseries.owasp.org/assets/NIST_ABAC.png)

### サービスレベル認可: 既存のパターン

#### 分散型パターン

開発チームは、マイクロサービスのコードレベルで PDP と PEP を直接実装します。アクセス制御ルールと、そのルールの実装に必要なすべての属性は、各マイクロサービス上で定義され保存されます (ステップ 1)。マイクロサービスが、何らかの認可メタデータ、たとえばエンドユーザーコンテキストや要求されたリソース ID とともにリクエストを受け取ると、マイクロサービスはそれを分析し (ステップ 3)、アクセス制御ポリシー判断を生成して認可を強制します (ステップ 4)。

![Decentralized pattern HLD](https://cheatsheetseries.owasp.org/assets/Dec_pattern_HLD.png)

既存のプログラミング言語フレームワークにより、開発チームはマイクロサービス層で認可を実装できます。たとえば、[Spring Security](https://www.youtube.com/watch?v=v2J32nd0g24) では、開発者がリソースサーバー内でスコープチェック、たとえば受信 JWT から抽出したスコープを使用したチェックを有効化し、それを認可の強制に利用できます。

ソースコードレベルで認可を実装するということは、開発チームが認可ロジックを変更したい場合には、常にコードを更新しなければならないことを意味します。

#### 単一のポリシー判断点を持つ集中型パターン

このパターンでは、アクセス制御ルールは中央で定義、保存、評価されます。アクセス制御ルールは PAP を使用して定義され (ステップ 1)、それらのルールの評価に必要な属性とともに、集中型 PDP に配信されます (ステップ 2)。主体がマイクロサービスのエンドポイントを呼び出すと (ステップ 3)、マイクロサービスコードはネットワーク呼び出しを通じて集中型 PDP を呼び出します。PDP は、クエリ入力をアクセス制御ルールおよび属性と照合して評価し、アクセス制御ポリシー判断を生成します (ステップ 4)。PDP の判断に基づいて、マイクロサービスは認可を強制します (ステップ 5)。

![Centralized pattern with single policy decision point HLD](https://cheatsheetseries.owasp.org/assets/Single_PDP_HLD.png)

アクセス制御ルールを定義するには、開発チームや運用チームは何らかの言語または記法を使用しなければなりません。例として、ポリシールールを記述する標準である Extensible Access Control Markup Language (XACML) や Next Generation Access Control (NGAC) があります。

このパターンは、リモート PDP エンドポイントへの追加のネットワーク呼び出しによってレイテンシの問題を引き起こす可能性があります。ただし、マイクロサービスレベルで認可ポリシー判断をキャッシュすることで緩和できます。PDP は、レジリエンスと可用性の問題を防ぐため、高可用性モードで運用しなければならない点に注意してください。アプリケーションセキュリティアーキテクトは、「多層防御」の原則を強制するために、このパターンを他のパターン、たとえば API ゲートウェイレベルでの認可と組み合わせるべきです。

#### 埋め込みポリシー判断点を持つ集中型パターン

このパターンでは、アクセス制御ルールは中央で定義されますが、マイクロサービスレベルで保存および評価されます。アクセス制御ルールは PAP を使用して定義され (ステップ 1)、それらのルールの評価に必要な属性とともに、埋め込み PDP に配信されます (ステップ 2)。主体がマイクロサービスのエンドポイントを呼び出すと (ステップ 3)、マイクロサービスコードは PDP を呼び出します。PDP は、クエリ入力をアクセス制御ルールおよび属性と照合して評価し、アクセス制御ポリシー判断を生成します (ステップ 4)。PDP の判断に基づいて、マイクロサービスは認可を強制します (ステップ 5)。

![Centralized pattern with embedded policy decision point HLD](https://cheatsheetseries.owasp.org/assets/Embed_PDP_HLD.png)

この場合の PDP コードは、マイクロサービス組み込みライブラリとして、またはサービスメッシュアーキテクチャにおけるサイドカーとして実装できます。ネットワークやホストの障害、およびネットワークレイテンシが発生する可能性があるため、埋め込み PDP はマイクロサービスと同じホスト上のマイクロサービスライブラリまたはサイドカーとして実装することが望ましいです。埋め込み PDP は通常、認可の強制中の外部依存を最小化し、低レイテンシを実現するために、認可ポリシーとポリシー関連データをメモリ内に保存します。「単一のポリシー判断点を持つ集中型パターン」アプローチとの主な違いは、認可の*判断*をマイクロサービス側に保存するのではなく、最新の認可*ポリシー*をマイクロサービス側に保存することです。認可判断のキャッシュは、古い認可ルールの適用やアクセス制御違反につながる可能性がある点に注意してください。

Netflix は、マイクロサービスレベルで認可を実装するために「埋め込み PDP を持つ集中型パターン」を使用した実例を発表しています ([link](https://www.youtube.com/watch?v=R6tUNpRpdnY), [link](https://conferences.oreilly.com/velocity/vl-ca-2018/public/schedule/detail/66606.html))。

![Centralized pattern with embedded policy decision point HLD](https://cheatsheetseries.owasp.org/assets/Netflix_AC.png)

- Policy portal と Policy repository は、アクセス制御ルールを作成、管理、バージョン管理する UI ベースのシステムです。
- Aggregator は、アクセス制御ルールで使用されるデータをすべての外部ソースから取得し、最新状態に保ちます。
- Distributor は、アクセス制御ルールを Policy repository から、アクセス制御ルールで使用されるデータを Aggregator から取得し、それらを PDP 間に配布します。
- PDP (library) は、アクセス制御ルールとデータを非同期に取得し、最新状態に保ち、PEP コンポーネントによる認可の強制を可能にします。

### 認可の実装に関する推奨事項

1. スケーラビリティを実現するため、認可ポリシーをソースコードにハードコードすること (分散型パターン) は望ましくありません。代わりに、ポリシーを表現する専用言語を使用してください。目的は、ゲートウェイやプロキシをチェックポイントとして機能させるだけではなく、認可をコードから外部化し、分離することです。サービスレベル認可の推奨パターンは、レジリエンスと広い採用実績のため、「埋め込み PDP を持つ集中型パターン」です。
2. 認可ソリューションはプラットフォームレベルのソリューションであるべきです。専任チーム、たとえば Platform security team が、認可ソリューションの開発と運用、および認可を実装するマイクロサービスのブループリント、ライブラリ、コンポーネントを開発チーム間で共有することに責任を持たなければなりません。
3. 認可ソリューションは、広く使われているソリューションに基づくべきです。カスタムソリューションの実装には、次の欠点があるためです。
    - セキュリティチームまたはエンジニアリングチームが、カスタムソリューションを構築し保守しなければなりません。
    - システムアーキテクチャで使用されるすべての言語向けに、クライアントライブラリ SDK を構築し保守する必要があります。
    - すべての開発者に、カスタム認可サービス API と統合方法を教育する必要があり、情報源として利用できるオープンソースコミュニティもありません。
4. すべてのアクセス制御ポリシーをゲートウェイ、プロキシ、共有認可ライブラリやコンポーネントで強制できるとは限りません。そのため、一部の特定のアクセス制御ルールは、依然としてマイクロサービスのビジネスコードレベルで実装する必要があります。そのためには、マイクロサービス開発チームが簡単な質問票やチェックリストを使用して、そのようなセキュリティ要件を明らかにし、マイクロサービス開発中に適切に扱うことが望ましいです。
5. 「多層防御」の原則を実装し、次の場所で認可を強制することが望ましいです。
    - ゲートウェイおよびプロキシレベル。粗い粒度で実施します。
    - マイクロサービスレベル。共有認可ライブラリやコンポーネントを使用して、きめ細かい判断を強制します。
    - マイクロサービスのビジネスコードレベル。ビジネス固有のアクセス制御ルールを実装します。
6. アクセス制御ポリシーに関する正式な手順を、開発、承認、ロールアウトにおいて実装しなければなりません。

## 外部エンティティのアイデンティティ伝播

マイクロサービスレベルできめ細かい認可判断を行うためには、マイクロサービスが呼び出し元のコンテキスト、たとえばユーザー ID やユーザーロール、グループを理解しなければなりません。内部サービス層で認可を強制できるようにするには、エッジ層が、認証済みの外部エンティティアイデンティティ、たとえばエンドユーザーコンテキストを、下流マイクロサービスへのリクエストとともに伝播しなければなりません。外部エンティティアイデンティティを伝播する最も単純な方法の一つは、エッジが受け取ったアクセストークンを再利用し、内部マイクロサービスに渡すことです。ただし、このアプローチは、外部アクセストークンの漏えいの可能性があり、通信が独自のトークンベースシステム実装に依存するため攻撃対象領域を増やす可能性があることから、非常に安全ではない点に注意してください。内部サービスが意図せず外部ネットワークに公開された場合、漏えいしたアクセストークンを使って直接アクセスされる可能性があります。内部サービスが、内部サービスだけが知っているトークン形式のみを受け入れる場合、この攻撃は不可能です。このパターンは外部アクセストークン非依存でもありません。つまり、内部サービスは外部アクセストークンを理解し、さまざまな種類の外部トークン、たとえば JWT、cookie、OpenID Connect token からアイデンティティを抽出するために、幅広い認証技術をサポートしなければなりません。

### アイデンティティ伝播: 既存のパターン

#### 外部エンティティアイデンティティを平文または自己署名データ構造として送信する

このアプローチでは、マイクロサービスが受信リクエストから外部エンティティアイデンティティを抽出し、たとえば受信アクセストークンを解析し、そのコンテキストを含むデータ構造、たとえば JSON または自己署名 JWT を作成して、内部マイクロサービスに渡します。

このシナリオでは、受信側マイクロサービスは呼び出し元マイクロサービスを信頼しなければなりません。呼び出し元マイクロサービスがアクセス制御ルールに違反したい場合、HTTP ヘッダー内に任意のユーザー ID、クライアント ID、ユーザーロールを設定することで、それを実行できます。このアプローチは、すべてのマイクロサービスが、安全なソフトウェア開発プラクティスを適用する信頼済み開発チームによって開発されている、高度に信頼された環境でのみ適しています。

#### 信頼済み発行者によって署名されたデータ構造を使用する

このパターンでは、外部リクエストがエッジ層の認証サービスによって認証された後、外部エンティティアイデンティティを表すデータ構造、たとえばユーザー ID、ユーザーロールやグループ、権限を含むものが、信頼済み発行者によって生成、署名、または暗号化され、内部マイクロサービスに伝播されます。

![Signed ID propagation](https://cheatsheetseries.owasp.org/assets/Signed_ID_propogation.png)

[Netflix は](https://www.infoq.com/presentations/netflix-user-identity/)、このパターンを使用した実例を発表しています。`Passport` と呼ばれる構造体で、ユーザー ID とその属性を含み、各受信リクエストについてエッジレベルで HMAC により保護されます。この構造体は内部マイクロサービスに伝播され、外部には決して公開されません。

1. Edge Authentication Service (EAS) は、Key Management System からシークレットキーを取得します。
2. EAS は、受信リクエストからアクセストークン、たとえば cookie、JWT、OAuth2 token 内のトークンを受け取ります。
3. EAS はアクセストークンを復号し、外部エンティティアイデンティティを解決し、署名済みの `Passport` 構造体で内部サービスに送信します。
4. 内部サービスは、ラッパーを使用してユーザーアイデンティティを抽出し、たとえばアイデンティティベース認可を実装するなど、認可を強制できます。
5. 必要に応じて、内部サービスは呼び出しチェーン内の下流サービスに `Passport` 構造体を伝播できます。

![Netflix ID propagation approach](https://cheatsheetseries.owasp.org/assets/Netflix_ID_prop.png)

このパターンは外部アクセストークン非依存であり、外部エンティティと内部表現を分離できる点に注意してください。

### アイデンティティ伝播の実装に関する推奨事項

1. 外部アクセストークン非依存で拡張可能なシステムを実装するため、外部エンティティに発行されたアクセストークンを、その内部表現から分離してください。マイクロサービス間で外部エンティティアイデンティティを表し伝播するため、単一のデータ構造を使用します。エッジレベルサービスは、受信した外部アクセストークンを検証し、内部エンティティ表現構造を発行し、下流サービスに伝播しなければなりません。
2. 信頼済み発行者によって署名された、対称暗号または非対称暗号の内部エンティティ表現構造を使用することは、コミュニティで採用されている推奨パターンです。
3. 内部エンティティ表現構造は、低レイテンシにつながる可能性のある追加の claim を加えられるよう、拡張可能であるべきです。
4. 内部エンティティ表現構造を外部、たとえばブラウザや外部デバイスに公開してはなりません。

## サービス間認証

### 既存のパターン

#### 相互トランスポート層セキュリティ

mTLS アプローチでは、各マイクロサービスは、送信データの機密性と完全性を実現することに加えて、通信相手を正当に識別できます。デプロイ内の各マイクロサービスは、公開鍵と秘密鍵のペアを保持し、その鍵ペアを使用して mTLS により受信側マイクロサービスに対して認証しなければなりません。mTLS は通常、自己ホスト型の Public Key Infrastructure で実装されます。mTLS を使用する際の主な課題は、鍵プロビジョニングと信頼のブートストラップ、証明書失効、鍵ローテーションです。

#### トークンベース

トークンベースアプローチは、アプリケーション層で機能します。トークンは、呼び出し元 ID、つまりマイクロサービス ID と、その権限、つまりスコープを含むことができるコンテナです。呼び出し元マイクロサービスは、自身のサービス ID とパスワードを使用して特別なセキュリティトークンサービスを呼び出すことで署名済みトークンを取得し、それをすべての送信リクエスト、たとえば HTTP ヘッダーに添付できます。呼び出されるマイクロサービスは、トークンを抽出し、オンラインまたはオフラインで検証できます。

![Signed ID propagation](https://cheatsheetseries.owasp.org/assets/Token_validation.png)

1. オンラインシナリオ:
    - 受信トークンを検証するため、マイクロサービスはネットワーク呼び出しを通じて集中型サービスのトークンサービスを呼び出します。
    - 失効した、つまり侵害されたトークンを検出できます。
    - レイテンシが高くなります。
    - 重要なリクエストに適用すべきです。
2. オフラインシナリオ:
    - 受信トークンを検証するため、マイクロサービスはダウンロード済みのサービス トークンサービス公開鍵を使用します。
    - 失効した、つまり侵害されたトークンを検出できない可能性があります。
    - レイテンシが低くなります。
    - 重要度の低いリクエストに適用すべきです。

ほとんどの場合、トークンベース認証は TLS 上で機能し、TLS は転送中データの機密性と完全性を提供します。

## ロギング

マイクロサービスベースシステムにおけるロギングサービスは、説明責任と追跡可能性の原則を満たし、ログ分析を通じて運用上のセキュリティ異常を検出することを目的としています。そのため、アプリケーションセキュリティアーキテクトが、セキュリティ運用のためにマイクロサービスベースシステムで監査ログを実装する既存のアーキテクチャパターンを理解し、適切に使用することは重要です。下図は高レベルのアーキテクチャ設計を示しており、次の原則に基づいています。

- 各マイクロサービスは、標準出力、つまり stdout や stderr を通じて、ローカルファイルにログメッセージを書き込みます。
- ロギングエージェントは、定期的にログメッセージを取得し、メッセージブローカー、たとえば NATS や Apache Kafka に送信、つまり publish します。
- 中央ロギングサービスは、メッセージブローカー内のメッセージを subscribe し、それらを受信して処理します。

![Logging pattern](https://cheatsheetseries.owasp.org/assets/ms_logging_pattern.png)

ロギングサブシステムアーキテクチャに対する高レベルの推奨事項と、その根拠を以下に示します。

1. マイクロサービスは、ネットワーク通信を使用して中央ロギングサブシステムにログメッセージを直接送信してはなりません。マイクロサービスは、ログメッセージをローカルログファイルに書き込まなければなりません。
    - これにより、攻撃によるロギングサービス障害、または正当なマイクロサービスによるフラッディングの場合に、データ損失の脅威を緩和できます。
    - ロギングサービス停止時でも、マイクロサービスはローカルファイルにログメッセージを書き込み続けるためデータ損失は発生せず、ロギングサービス復旧後にログを配送できるようになります。
2. マイクロサービスから分離された専用コンポーネント、つまりロギングエージェントが存在しなければなりません。ロギングエージェントは、マイクロサービス上のログデータを収集し、ローカルログファイルを読み取り、中央ロギングサブシステムに送信しなければなりません。ネットワークレイテンシの問題が発生する可能性があるため、ロギングエージェントはマイクロサービスと同じホスト、つまり仮想または物理マシン上にデプロイしなければなりません。
    - これにより、攻撃によるロギングサービス障害、または正当なマイクロサービスによるフラッディングの場合に、データ損失の脅威を緩和できます。
    - ロギングエージェント障害時でも、マイクロサービスはログファイルに情報を書き込み続け、ロギングエージェントは復旧後にファイルを読み取り、情報をメッセージブローカーに送信します。
3. 中央ロギングサブシステムに対する DoS 攻撃の可能性があるため、ロギングエージェントはログメッセージを送信するために非同期リクエスト/レスポンスパターンを使用してはなりません。ロギングエージェントと中央ロギングサービス間の非同期接続を実装するために、メッセージブローカーが存在しなければなりません。
    - これにより、正当なマイクロサービスによるフラッディングの場合に、ロギングサービス障害によるデータ損失の脅威を緩和できます。
    - ロギングサービス停止時でも、マイクロサービスはローカルファイルにログメッセージを書き込み続けるためデータ損失は発生せず、ロギングサービス復旧後にログを配送できるようになります。
4. ロギングエージェントとメッセージブローカーは、すべての送信データ、つまりログメッセージを暗号化し、相互に認証するために、たとえば TLS に基づく相互認証を使用しなければなりません。
    - これにより、マイクロサービスのなりすまし、ロギング/転送システムのなりすまし、ネットワークトラフィック注入、ネットワークトラフィックの盗聴などの脅威を緩和できます。
5. メッセージブローカーは、不正アクセスを緩和し、最小権限の原則を実装するために、アクセス制御ポリシーを強制しなければなりません。
    - これにより、マイクロサービスの権限昇格の脅威を緩和できます。
6. ロギングエージェントは、機密データ、たとえば PII、パスワード、API キーが中央ロギングサブシステムに送信されないようにするため、出力ログメッセージをフィルタリングまたはサニタイズしなければなりません。これはデータ最小化の原則です。ログから除外すべき項目の包括的な概要については、[OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html#data-to-exclude) を参照してください。
7. マイクロサービスは、すべての呼び出しチェーンを一意に識別し、調査のためにログメッセージをグループ化するのに役立つ correlation ID を生成しなければなりません。ロギングエージェントは、すべてのログメッセージに correlation ID を含めなければなりません。
8. ロギングエージェントは、その可用性または非可用性を示すため、ヘルスデータおよびステータスデータを定期的に提供しなければなりません。
9. ロギングエージェントは、構造化ログ形式、たとえば JSON や CSV でログメッセージを publish しなければなりません。
10. ロギングエージェントは、ログメッセージにコンテキストデータ、たとえばプラットフォームコンテキスト (hostname, container name) やランタイムコンテキスト (class name, filename) を追加しなければなりません。

ログに記録すべきイベントと、可能なデータ形式の包括的な概要については、[OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html#which-events-to-log) および [Application Logging Vocabulary Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Vocabulary_Cheat_Sheet.html) を参照してください。

## References

- [NIST Special Publication 800-204](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-204.pdf) “Security Strategies for Microservices-based Application Systems”
- [NIST Special Publication 800-204A](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-204A.pdf) “Building Secure Microservices-based Applications Using Service-Mesh Architecture”
- [Microservices Security in Action](https://www.manning.com/books/microservices-security-in-action), Prabath Siriwardena and Nuwan Dias, 2020, Manning

</section>

<section id="microservices-security-bilingual-panel" className="tabPanel bilingualPanel contentPanel">

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

# Microservices Security Cheat Sheet

## Introduction

The microservice architecture is being increasingly used for designing and implementing application systems in both cloud-based and on-premise infrastructures, high-scale applications and services. There are many security challenges that need to be addressed in the application design and implementation phases. The fundamental security requirements that have to be addressed during design phase are authentication and authorization. Therefore, it is vital for applications security architects to understand and properly use existing architecture patterns to implement authentication and authorization in microservices-based systems. The goal of this cheat sheet is to identify such patterns and to do recommendations for applications security architects on possible ways to use them.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

# マイクロサービスセキュリティチートシート

## はじめに

マイクロサービスアーキテクチャは、クラウドベースおよびオンプレミスのインフラストラクチャ、高スケールのアプリケーションやサービスの両方で、アプリケーションシステムの設計と実装にますます使われるようになっています。アプリケーションの設計フェーズと実装フェーズでは、対処すべき多くのセキュリティ課題があります。設計フェーズで対処しなければならない基本的なセキュリティ要件は、認証と認可です。そのため、アプリケーションセキュリティアーキテクトが、マイクロサービスベースのシステムで認証と認可を実装する既存のアーキテクチャパターンを理解し、適切に使用することは重要です。このチートシートの目的は、そのようなパターンを特定し、アプリケーションセキュリティアーキテクトに対して、それらを利用する可能な方法を推奨することです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Edge-level authorization

In simple scenarios, authorization can happen only at the edge level (API gateway). The API gateway can be leveraged to centralize enforcement of authorization for all downstream microservices, eliminating the need to provide authentication and access control for each of the individual services. In such cases, NIST recommends implementing mitigating controls such as mutual authentication to prevent direct, anonymous connections to the internal services (API gateway bypass). It should be noted that authorization at the edge layer has the [following limitations](https://www.youtube.com/watch?v=UnXjwCWgBKU):

- Pushing all authorization decisions to the API gateway can quickly become hard to manage in complex ecosystems with many roles and access control rules.
- The API gateway may become a single point of decision that may violate the “defense in depth” principle.
- Operation teams typically own the API gateway, so development teams cannot directly make authorization changes, slowing down velocity due to additional communication and process overhead.

In most cases, development teams implement authorization in both places – at the edge level at a coarse level of granularity, and at service level. To authenticate an external entity, the edge can use access tokens (referenced token or self-contained token) transmitted via HTTP headers (e.g., “Cookie” or “Authorization”) or use mTLS.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## エッジレベル認可

単純なシナリオでは、認可はエッジレベル、つまり API ゲートウェイだけで行うことができます。API ゲートウェイを活用すると、すべての下流マイクロサービスに対する認可の強制を集中化でき、個々のサービスごとに認証とアクセス制御を用意する必要をなくせます。このような場合、NIST は、内部サービスへの直接かつ匿名の接続、つまり API ゲートウェイのバイパスを防ぐために、相互認証などの緩和策を実装することを推奨しています。エッジ層での認可には、[次の制限](https://www.youtube.com/watch?v=UnXjwCWgBKU)がある点に注意してください。

- すべての認可判断を API ゲートウェイに押し込むと、多数のロールやアクセス制御ルールを持つ複雑なエコシステムでは、すぐに管理が難しくなる可能性があります。
- API ゲートウェイが単一の判断点となり、「多層防御」の原則に反する可能性があります。
- 通常、API ゲートウェイは運用チームが所有しているため、開発チームは認可の変更を直接行えません。その結果、追加のコミュニケーションやプロセスのオーバーヘッドにより、開発速度が低下します。

ほとんどの場合、開発チームは認可を二つの場所で実装します。粗い粒度ではエッジレベルで、さらにサービスレベルでも実装します。外部エンティティを認証するために、エッジは HTTP ヘッダー、たとえば `Cookie` や `Authorization` で送信されるアクセストークン、つまり参照トークンまたは自己完結型トークンを使用するか、mTLS を使用できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Service-level authorization

Service-level authorization gives each microservice more control to enforce access control policies.
For further discussion, we will use terms and definitions according with [NIST SP 800-162](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-162.pdf). The functional components of an access control system can be classified as follows:

- Policy Administration Point (PAP): Provides a user interface for creating, managing, testing, and debugging access control rules.
- Policy Decision Point (PDP): Computes access decisions by evaluating the applicable access control policy.
- Policy Enforcement Point (PEP): Enforces policy decisions in response to a request from a subject requesting access to a protected object.
- Policy Information Point (PIP): Serves as the retrieval source of attributes or the data required for policy evaluation to provide the information needed by the PDP to make decisions.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## サービスレベル認可

サービスレベル認可により、各マイクロサービスはアクセス制御ポリシーを強制するためのより多くの制御を持てます。以降の説明では、[NIST SP 800-162](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-162.pdf) に従った用語と定義を使用します。アクセス制御システムの機能コンポーネントは、次のように分類できます。

- Policy Administration Point (PAP): アクセス制御ルールの作成、管理、テスト、デバッグのためのユーザーインターフェイスを提供します。
- Policy Decision Point (PDP): 適用されるアクセス制御ポリシーを評価して、アクセス判断を計算します。
- Policy Enforcement Point (PEP): 保護対象オブジェクトへのアクセスを要求する主体からのリクエストに応じて、ポリシー判断を強制します。
- Policy Information Point (PIP): PDP が判断を行うために必要な情報を提供するため、ポリシー評価に必要な属性またはデータの取得元として機能します。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

![NIST ABAC framework](https://cheatsheetseries.owasp.org/assets/NIST_ABAC.png)

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Service-level authorization: existing patterns

#### Decentralized pattern

The development team implements PDP and PEP directly at the microservice code level. All the access control rules and attributes that need to implement that rule are defined and stored on each microservice (step 1). When a microservice receives a request along with some authorization metadata (e.g., end user context or requested resource ID), the microservice analyzes it (step 3) to generate an access control policy decision and then enforces authorization (step 4).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### サービスレベル認可: 既存のパターン

#### 分散型パターン

開発チームは、マイクロサービスのコードレベルで PDP と PEP を直接実装します。アクセス制御ルールと、そのルールの実装に必要なすべての属性は、各マイクロサービス上で定義され保存されます (ステップ 1)。マイクロサービスが、何らかの認可メタデータ、たとえばエンドユーザーコンテキストや要求されたリソース ID とともにリクエストを受け取ると、マイクロサービスはそれを分析し (ステップ 3)、アクセス制御ポリシー判断を生成して認可を強制します (ステップ 4)。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

![Decentralized pattern HLD](https://cheatsheetseries.owasp.org/assets/Dec_pattern_HLD.png)

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Existing programming language frameworks allow development teams to implement authorization at the microservice layer. For example, [Spring Security allows](https://www.youtube.com/watch?v=v2J32nd0g24) developers to enable scopes checking (e.g., using scopes extracted from incoming JWT) in the resource server and use it to enforce authorization.

Implementing authorization at the source code level means that the code must be updated whenever the development team wants to modify authorization logic.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

既存のプログラミング言語フレームワークにより、開発チームはマイクロサービス層で認可を実装できます。たとえば、[Spring Security](https://www.youtube.com/watch?v=v2J32nd0g24) では、開発者がリソースサーバー内でスコープチェック、たとえば受信 JWT から抽出したスコープを使用したチェックを有効化し、それを認可の強制に利用できます。

ソースコードレベルで認可を実装するということは、開発チームが認可ロジックを変更したい場合には、常にコードを更新しなければならないことを意味します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Centralized pattern with single policy decision point

In this pattern, access control rules are defined, stored, and evaluated centrally. Access control rules are defined using PAP (step 1) and delivered to a centralized PDP, along with attributes required to evaluate those rules (step 2). When a subject invokes a microservice endpoint (step 3), the microservice code invokes the centralized PDP via a network call, and the PDP generates an access control policy decision by evaluating the query input against access control rules and attributes (step 4). Based on the PDP decision, the microservice enforces authorization (step 5).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 単一のポリシー判断点を持つ集中型パターン

このパターンでは、アクセス制御ルールは中央で定義、保存、評価されます。アクセス制御ルールは PAP を使用して定義され (ステップ 1)、それらのルールの評価に必要な属性とともに、集中型 PDP に配信されます (ステップ 2)。主体がマイクロサービスのエンドポイントを呼び出すと (ステップ 3)、マイクロサービスコードはネットワーク呼び出しを通じて集中型 PDP を呼び出します。PDP は、クエリ入力をアクセス制御ルールおよび属性と照合して評価し、アクセス制御ポリシー判断を生成します (ステップ 4)。PDP の判断に基づいて、マイクロサービスは認可を強制します (ステップ 5)。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

![Centralized pattern with single policy decision point HLD](https://cheatsheetseries.owasp.org/assets/Single_PDP_HLD.png)

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

To define access control rules, development/operation teams have to use some language or notation. An example is Extensible Access Control Markup Language (XACML) and Next Generation Access Control (NGAC), which is a standard to describe policy rules.

This pattern can cause latency issues due to additional network calls to the remote PDP endpoint, but it can be mitigated by caching authorization policy decisions at the microservice level. It should be mentioned that the PDP must be operated in high-availability mode to prevent resilience and availability issues. Application security architects should combine it with other patterns (e.g., authorization on API gateway level) to enforce the "defense in depth" principle.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

アクセス制御ルールを定義するには、開発チームや運用チームは何らかの言語または記法を使用しなければなりません。例として、ポリシールールを記述する標準である Extensible Access Control Markup Language (XACML) や Next Generation Access Control (NGAC) があります。

このパターンは、リモート PDP エンドポイントへの追加のネットワーク呼び出しによってレイテンシの問題を引き起こす可能性があります。ただし、マイクロサービスレベルで認可ポリシー判断をキャッシュすることで緩和できます。PDP は、レジリエンスと可用性の問題を防ぐため、高可用性モードで運用しなければならない点に注意してください。アプリケーションセキュリティアーキテクトは、「多層防御」の原則を強制するために、このパターンを他のパターン、たとえば API ゲートウェイレベルでの認可と組み合わせるべきです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Centralized pattern with embedded policy decision point

In this pattern, access control rules are defined centrally but stored and evaluated at the microservice level. Access control rules are defined using PAP (step 1) and delivered to an embedded PDP, along with attributes required to evaluate those rules (step 2). When a subject invokes a microservice endpoint (step 3), the microservice code invokes the PDP, and the PDP generates an access control policy decision by evaluating the query input against access control rules and attributes (step 4). Based on the PDP decision, the microservice enforces authorization (step 5).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 埋め込みポリシー判断点を持つ集中型パターン

このパターンでは、アクセス制御ルールは中央で定義されますが、マイクロサービスレベルで保存および評価されます。アクセス制御ルールは PAP を使用して定義され (ステップ 1)、それらのルールの評価に必要な属性とともに、埋め込み PDP に配信されます (ステップ 2)。主体がマイクロサービスのエンドポイントを呼び出すと (ステップ 3)、マイクロサービスコードは PDP を呼び出します。PDP は、クエリ入力をアクセス制御ルールおよび属性と照合して評価し、アクセス制御ポリシー判断を生成します (ステップ 4)。PDP の判断に基づいて、マイクロサービスは認可を強制します (ステップ 5)。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

![Centralized pattern with embedded policy decision point HLD](https://cheatsheetseries.owasp.org/assets/Embed_PDP_HLD.png)

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The PDP code in this case, can be implemented as a microservice built-in library or sidecar in a service mesh architecture. Due to possible network/host failures and network latency, it is advisable to implement embedded PDP as a microservice library or sidecar on the same host as the microservice. Embedded PDP usually stores authorization policy and policy-related data in-memory to minimize external dependencies during authorization enforcement and get low latency. The main difference from the “Centralized pattern with single policy decision point” approach, is that authorization *decisions* do not store on the microservice side, up-to-date authorization *policy* is stored on the microservice side instead. It should be mentioned that caching authorization decisions may lead to applying outdated authorization rules and access control violations.

Netflix presented ([link](https://www.youtube.com/watch?v=R6tUNpRpdnY), [link](https://conferences.oreilly.com/velocity/vl-ca-2018/public/schedule/detail/66606.html)) a real case of using “Centralized pattern with embedded PDP” pattern to implement authorization on the microservices level.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

この場合の PDP コードは、マイクロサービス組み込みライブラリとして、またはサービスメッシュアーキテクチャにおけるサイドカーとして実装できます。ネットワークやホストの障害、およびネットワークレイテンシが発生する可能性があるため、埋め込み PDP はマイクロサービスと同じホスト上のマイクロサービスライブラリまたはサイドカーとして実装することが望ましいです。埋め込み PDP は通常、認可の強制中の外部依存を最小化し、低レイテンシを実現するために、認可ポリシーとポリシー関連データをメモリ内に保存します。「単一のポリシー判断点を持つ集中型パターン」アプローチとの主な違いは、認可の*判断*をマイクロサービス側に保存するのではなく、最新の認可*ポリシー*をマイクロサービス側に保存することです。認可判断のキャッシュは、古い認可ルールの適用やアクセス制御違反につながる可能性がある点に注意してください。

Netflix は、マイクロサービスレベルで認可を実装するために「埋め込み PDP を持つ集中型パターン」を使用した実例を発表しています ([link](https://www.youtube.com/watch?v=R6tUNpRpdnY), [link](https://conferences.oreilly.com/velocity/vl-ca-2018/public/schedule/detail/66606.html))。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

![Centralized pattern with embedded policy decision point HLD](https://cheatsheetseries.owasp.org/assets/Netflix_AC.png)

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- The Policy portal and Policy repository are UI-based systems for creating, managing, and versioning access control rules.
- The Aggregator fetches data used in access control rules from all external sources and keeps it up to date.
- The Distributor pulls access control rules (from the Policy repository) and data used in access control rules (from Aggregators) to distribute them among PDPs.
- The PDP (library) asynchronously pulls access control rules and data and keeps them up to date to enforce authorization by the PEP component.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- Policy portal と Policy repository は、アクセス制御ルールを作成、管理、バージョン管理する UI ベースのシステムです。
- Aggregator は、アクセス制御ルールで使用されるデータをすべての外部ソースから取得し、最新状態に保ちます。
- Distributor は、アクセス制御ルールを Policy repository から、アクセス制御ルールで使用されるデータを Aggregator から取得し、それらを PDP 間に配布します。
- PDP (library) は、アクセス制御ルールとデータを非同期に取得し、最新状態に保ち、PEP コンポーネントによる認可の強制を可能にします。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Recommendations on how to implement authorization

1. To achieve scalability, it is not advisable to hardcode authorization policy in source code (decentralized pattern) but use a special language to express policy instead. The goal is to externalize/decouple authorization from code, and not just with a gateway/proxy acting as a checkpoint. The recommended pattern for service-level authorization is "Centralized pattern with embedded PDP" due to its resilience and wide adoption.
2. The authorization solution should be a platform-level solution; a dedicated team (e.g., Platform security team) must be accountable for the development and operation of the authorization solution as well as sharing microservice blueprint/library/components that implement authorization among development teams.
3. The authorization solution should be based on widely-used solutions because implementing a custom solution has the following cons:
    - Security or engineering teams have to build and maintain a custom solution.
    - It is necessary to build and maintain client library SDKs for every language used in the system architecture.
    - There is a necessity to train every developer on custom authorization service API and integration, and there’s no open-source community to source information from.
4. There is a probability that not all access control policies can be enforced by gateways/proxies and shared authorization library/components, so some specific access control rules still have to be implemented on microservice business code level. In order to do that, it is advisable to have microservice development teams use simple questionnaires/check-lists to uncover such security requirements and handle them properly during microservice development.
5. It is advisable to implement the “defense in depth” principle and enforce authorization on:
    - Gateway and proxy level, at a coarse level of granularity.
    - Microservice level, using shared authorization library/components to enforce fine-granted decisions.
    - Microservice business code level, to implement business-specific access control rules.
6. Formal procedures on access control policy must be implemented on development, approval and rolling-out.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 認可の実装に関する推奨事項

1. スケーラビリティを実現するため、認可ポリシーをソースコードにハードコードすること (分散型パターン) は望ましくありません。代わりに、ポリシーを表現する専用言語を使用してください。目的は、ゲートウェイやプロキシをチェックポイントとして機能させるだけではなく、認可をコードから外部化し、分離することです。サービスレベル認可の推奨パターンは、レジリエンスと広い採用実績のため、「埋め込み PDP を持つ集中型パターン」です。
2. 認可ソリューションはプラットフォームレベルのソリューションであるべきです。専任チーム、たとえば Platform security team が、認可ソリューションの開発と運用、および認可を実装するマイクロサービスのブループリント、ライブラリ、コンポーネントを開発チーム間で共有することに責任を持たなければなりません。
3. 認可ソリューションは、広く使われているソリューションに基づくべきです。カスタムソリューションの実装には、次の欠点があるためです。
    - セキュリティチームまたはエンジニアリングチームが、カスタムソリューションを構築し保守しなければなりません。
    - システムアーキテクチャで使用されるすべての言語向けに、クライアントライブラリ SDK を構築し保守する必要があります。
    - すべての開発者に、カスタム認可サービス API と統合方法を教育する必要があり、情報源として利用できるオープンソースコミュニティもありません。
4. すべてのアクセス制御ポリシーをゲートウェイ、プロキシ、共有認可ライブラリやコンポーネントで強制できるとは限りません。そのため、一部の特定のアクセス制御ルールは、依然としてマイクロサービスのビジネスコードレベルで実装する必要があります。そのためには、マイクロサービス開発チームが簡単な質問票やチェックリストを使用して、そのようなセキュリティ要件を明らかにし、マイクロサービス開発中に適切に扱うことが望ましいです。
5. 「多層防御」の原則を実装し、次の場所で認可を強制することが望ましいです。
    - ゲートウェイおよびプロキシレベル。粗い粒度で実施します。
    - マイクロサービスレベル。共有認可ライブラリやコンポーネントを使用して、きめ細かい判断を強制します。
    - マイクロサービスのビジネスコードレベル。ビジネス固有のアクセス制御ルールを実装します。
6. アクセス制御ポリシーに関する正式な手順を、開発、承認、ロールアウトにおいて実装しなければなりません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## External Entity Identity Propagation

To make fine-grained authorization decisions at the microservice level, a microservice has to understand the caller’s context (e.g., user ID, user roles/groups). In order to allow the internal service layer to enforce authorization, the edge layer has to propagate an authenticated external entity identity (e.g., end user context) along with a request to downstream microservices. One of the simplest ways to propagate external entity identity is to reuse the access token received by the edge and pass it to internal microservices. However, it should be mentioned that this approach is highly insecure due to possible external access token leakage and may increase an attack surface because the communication relies on a proprietary token-based system implementation. If an internal service is unintentionally exposed to the external network, then it can be directly accessed using the leaked access token. This attack is not possible if the internal service only accepts a token format known only to internal services. This pattern is also not external access token agnostic, i.e., internal services have to understand external access tokens and support a wide range of authentication techniques to extract identity from different types of external tokens (e.g., JWT, cookie, OpenID Connect token).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 外部エンティティのアイデンティティ伝播

マイクロサービスレベルできめ細かい認可判断を行うためには、マイクロサービスが呼び出し元のコンテキスト、たとえばユーザー ID やユーザーロール、グループを理解しなければなりません。内部サービス層で認可を強制できるようにするには、エッジ層が、認証済みの外部エンティティアイデンティティ、たとえばエンドユーザーコンテキストを、下流マイクロサービスへのリクエストとともに伝播しなければなりません。外部エンティティアイデンティティを伝播する最も単純な方法の一つは、エッジが受け取ったアクセストークンを再利用し、内部マイクロサービスに渡すことです。ただし、このアプローチは、外部アクセストークンの漏えいの可能性があり、通信が独自のトークンベースシステム実装に依存するため攻撃対象領域を増やす可能性があることから、非常に安全ではない点に注意してください。内部サービスが意図せず外部ネットワークに公開された場合、漏えいしたアクセストークンを使って直接アクセスされる可能性があります。内部サービスが、内部サービスだけが知っているトークン形式のみを受け入れる場合、この攻撃は不可能です。このパターンは外部アクセストークン非依存でもありません。つまり、内部サービスは外部アクセストークンを理解し、さまざまな種類の外部トークン、たとえば JWT、cookie、OpenID Connect token からアイデンティティを抽出するために、幅広い認証技術をサポートしなければなりません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Identity propagation: existing patterns

#### Sending the external entity identity as clear or self-signed data structures

In this approach, the microservice extracts the external entity identity from the incoming request (e.g., by parsing the incoming access token), creates a data structure (e.g., JSON or self-signed JWT) with that context, and passes it on to an internal microservice.
In this scenario, the recipient microservice has to trust the calling microservice. If the calling microservice wants to violate access control rules, it can do so by setting any user/client ID or user roles it wants in the HTTP header. This approach is suitable only in highly trusted environments where every microservice is developed by a trusted development team that applies secure software development practices.

#### Using a data structure signed by a trusted issuer

In this pattern, after the external request is authenticated by the authentication service at the edge layer, a data structure representing the external entity identity (e.g., containing user ID, user roles/groups, or permissions) is generated, signed, or encrypted by the trusted issuer and propagated to internal microservices.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### アイデンティティ伝播: 既存のパターン

#### 外部エンティティアイデンティティを平文または自己署名データ構造として送信する

このアプローチでは、マイクロサービスが受信リクエストから外部エンティティアイデンティティを抽出し、たとえば受信アクセストークンを解析し、そのコンテキストを含むデータ構造、たとえば JSON または自己署名 JWT を作成して、内部マイクロサービスに渡します。

このシナリオでは、受信側マイクロサービスは呼び出し元マイクロサービスを信頼しなければなりません。呼び出し元マイクロサービスがアクセス制御ルールに違反したい場合、HTTP ヘッダー内に任意のユーザー ID、クライアント ID、ユーザーロールを設定することで、それを実行できます。このアプローチは、すべてのマイクロサービスが、安全なソフトウェア開発プラクティスを適用する信頼済み開発チームによって開発されている、高度に信頼された環境でのみ適しています。

#### 信頼済み発行者によって署名されたデータ構造を使用する

このパターンでは、外部リクエストがエッジ層の認証サービスによって認証された後、外部エンティティアイデンティティを表すデータ構造、たとえばユーザー ID、ユーザーロールやグループ、権限を含むものが、信頼済み発行者によって生成、署名、または暗号化され、内部マイクロサービスに伝播されます。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

![Signed ID propagation](https://cheatsheetseries.owasp.org/assets/Signed_ID_propogation.png)

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

[Netflix presented](https://www.infoq.com/presentations/netflix-user-identity/) a real-world case of using that pattern: a structure called “Passport” that contains the user ID and its attributes and which is HMAC protected at the edge level for each incoming request. This structure is propagated to internal microservices and never exposed outside.

1. The Edge Authentication Service (EAS) obtains a secret key from the Key Management System.
2. EAS receives an access token (e.g., in a cookie, JWT, OAuth2 token) from the incoming request.
3. EAS decrypts the access token, resolves the external entity identity, and sends it to the internal services in the signed “Passport” structure.
4. Internal services can extract user identity to enforce authorization (e.g., to implement identity-based authorization) using wrappers.
5. If necessary, internal service can propagate the “Passport” structure to downstream services in the call chain.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

[Netflix は](https://www.infoq.com/presentations/netflix-user-identity/)、このパターンを使用した実例を発表しています。`Passport` と呼ばれる構造体で、ユーザー ID とその属性を含み、各受信リクエストについてエッジレベルで HMAC により保護されます。この構造体は内部マイクロサービスに伝播され、外部には決して公開されません。

1. Edge Authentication Service (EAS) は、Key Management System からシークレットキーを取得します。
2. EAS は、受信リクエストからアクセストークン、たとえば cookie、JWT、OAuth2 token 内のトークンを受け取ります。
3. EAS はアクセストークンを復号し、外部エンティティアイデンティティを解決し、署名済みの `Passport` 構造体で内部サービスに送信します。
4. 内部サービスは、ラッパーを使用してユーザーアイデンティティを抽出し、たとえばアイデンティティベース認可を実装するなど、認可を強制できます。
5. 必要に応じて、内部サービスは呼び出しチェーン内の下流サービスに `Passport` 構造体を伝播できます。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

![Netflix ID propagation approach](https://cheatsheetseries.owasp.org/assets/Netflix_ID_prop.png)

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

It should be mentioned that the pattern is external access token agnostic and allows for decoupling of external entities from their internal representations.

### Recommendation on how to implement identity propagation

1. In order to implement an external access token agnostic and extendable system, decouple the access tokens issued for an external entity from its internal representation. Use a single data structure to represent and propagate the external entity identity among microservices. The edge-level service has to verify the incoming external access token, issue an internal entity representation structure, and propagate it to downstream services.
2. Using an internal entity representation structure signed (symmetric or asymmetric encryption) by a trusted issuer is a recommended pattern adopted by the community.
3. The internal entity representation structure should be extensible to enable adding more claims that may lead to low latency.
4. The internal entity representation structure must not be exposed outside (e.g., to a browser or external device)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

このパターンは外部アクセストークン非依存であり、外部エンティティと内部表現を分離できる点に注意してください。

### アイデンティティ伝播の実装に関する推奨事項

1. 外部アクセストークン非依存で拡張可能なシステムを実装するため、外部エンティティに発行されたアクセストークンを、その内部表現から分離してください。マイクロサービス間で外部エンティティアイデンティティを表し伝播するため、単一のデータ構造を使用します。エッジレベルサービスは、受信した外部アクセストークンを検証し、内部エンティティ表現構造を発行し、下流サービスに伝播しなければなりません。
2. 信頼済み発行者によって署名された、対称暗号または非対称暗号の内部エンティティ表現構造を使用することは、コミュニティで採用されている推奨パターンです。
3. 内部エンティティ表現構造は、低レイテンシにつながる可能性のある追加の claim を加えられるよう、拡張可能であるべきです。
4. 内部エンティティ表現構造を外部、たとえばブラウザや外部デバイスに公開してはなりません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Service-to-service authentication

### Existing patterns

#### Mutual transport layer security

With an mTLS approach, each microservice can legitimately identify who it talks to, in addition to achieving confidentiality and integrity of the transmitted data. Each microservice in the deployment has to carry a public/private key pair and use that key pair to authenticate to the recipient microservices via mTLS. mTLS is usually implemented with a self-hosted Public Key Infrastructure. The main challenges of using mTLS are key provisioning and trust bootstrap, certificate revocation, and key rotation.

#### Token-based

The token-based approach works at the application layer. A token is a container that may contain the caller ID (microservice ID) and its permissions (scopes). The caller microservice can obtain a signed token by invoking a special security token service using its own service ID and password and then attaches it to every outgoing request, e.g., via HTTP headers. The called microservice can extract the token and validate it online or offline.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## サービス間認証

### 既存のパターン

#### 相互トランスポート層セキュリティ

mTLS アプローチでは、各マイクロサービスは、送信データの機密性と完全性を実現することに加えて、通信相手を正当に識別できます。デプロイ内の各マイクロサービスは、公開鍵と秘密鍵のペアを保持し、その鍵ペアを使用して mTLS により受信側マイクロサービスに対して認証しなければなりません。mTLS は通常、自己ホスト型の Public Key Infrastructure で実装されます。mTLS を使用する際の主な課題は、鍵プロビジョニングと信頼のブートストラップ、証明書失効、鍵ローテーションです。

#### トークンベース

トークンベースアプローチは、アプリケーション層で機能します。トークンは、呼び出し元 ID、つまりマイクロサービス ID と、その権限、つまりスコープを含むことができるコンテナです。呼び出し元マイクロサービスは、自身のサービス ID とパスワードを使用して特別なセキュリティトークンサービスを呼び出すことで署名済みトークンを取得し、それをすべての送信リクエスト、たとえば HTTP ヘッダーに添付できます。呼び出されるマイクロサービスは、トークンを抽出し、オンラインまたはオフラインで検証できます。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

![Signed ID propagation](https://cheatsheetseries.owasp.org/assets/Token_validation.png)

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

1. Online scenario:
    - To validate incoming tokens, the microservice invokes a centralized service token service via network call.
    - Revoked (compromised) tokens can be detected.
    - High latency.
    - Should be applied to critical requests.
2. Offline scenario:
    - To validate incoming tokens, the microservice uses the downloaded service token service public key.
    - Revoked (compromised) tokens may not be detected.
    - Low latency.
    - Should be applied to non-critical requests.

In most cases, token-based authentication works over TLS, which provides confidentiality and integrity of data in transit.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

1. オンラインシナリオ:
    - 受信トークンを検証するため、マイクロサービスはネットワーク呼び出しを通じて集中型サービスのトークンサービスを呼び出します。
    - 失効した、つまり侵害されたトークンを検出できます。
    - レイテンシが高くなります。
    - 重要なリクエストに適用すべきです。
2. オフラインシナリオ:
    - 受信トークンを検証するため、マイクロサービスはダウンロード済みのサービス トークンサービス公開鍵を使用します。
    - 失効した、つまり侵害されたトークンを検出できない可能性があります。
    - レイテンシが低くなります。
    - 重要度の低いリクエストに適用すべきです。

ほとんどの場合、トークンベース認証は TLS 上で機能し、TLS は転送中データの機密性と完全性を提供します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Logging

Logging services in microservice-based systems aim to meet the principles of accountability and traceability and help detect security anomalies in operations via log analysis. Therefore, it is vital for application security architects to understand and adequately use existing architecture patterns to implement audit logging in microservices-based systems for security operations. A high-level architecture design is shown in the picture below and is based on the following principles:

- Each microservice writes a log message to a local file using standard output (via stdout, stderr).
- The logging agent periodically pulls log messages and sends (publishes) them to the message broker (e.g., NATS, Apache Kafka).
- The central logging service subscribes to messages in the message broker, receives them, and processes them.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## ロギング

マイクロサービスベースシステムにおけるロギングサービスは、説明責任と追跡可能性の原則を満たし、ログ分析を通じて運用上のセキュリティ異常を検出することを目的としています。そのため、アプリケーションセキュリティアーキテクトが、セキュリティ運用のためにマイクロサービスベースシステムで監査ログを実装する既存のアーキテクチャパターンを理解し、適切に使用することは重要です。下図は高レベルのアーキテクチャ設計を示しており、次の原則に基づいています。

- 各マイクロサービスは、標準出力、つまり stdout や stderr を通じて、ローカルファイルにログメッセージを書き込みます。
- ロギングエージェントは、定期的にログメッセージを取得し、メッセージブローカー、たとえば NATS や Apache Kafka に送信、つまり publish します。
- 中央ロギングサービスは、メッセージブローカー内のメッセージを subscribe し、それらを受信して処理します。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

![Logging pattern](https://cheatsheetseries.owasp.org/assets/ms_logging_pattern.png)

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

High-level recommendations to logging subsystem architecture with its rationales are listed below.

1. Microservice shall not send log messages directly to the central logging subsystem using network communication. Microservice shall write its log message to a local log file:
    - this allows to mitigate the threat of data loss due to logging service failure due to attack or in case of its flooding by legitimate microservice
    - in case of logging service outage, microservice will still write log messages to the local file (without data loss), and after logging service recovery, logs will be available to shipping;
2. There shall be a dedicated component (logging agent) decoupled from the microservice. The logging agent shall collect log data on the microservice  (read local log file) and send it to the central logging subsystem. Due to possible network latency issues, the logging agent shall be deployed on the same host (virtual or physical machine) with the microservice:
    - this allows mitigating the threat of data loss due to logging service failure due to attack or in case of its flooding by legitimate microservice
    - in case of logging agent failure, microservice still writes information to the log file, logging agent after recovery will read the file and send information to message broker;
3. A possible DoS attack on the central logging subsystem logging agent shall not use an asynchronous request/response pattern to send log messages. There shall be a message broker to implement the asynchronous connection between the logging agent and central logging service:
    - this allows to mitigate the threat of data loss due to logging service failure in case of its flooding by legitimate microservice
    - in case of logging service outage, microservice will still write log messages to the local file (without data loss), and after logging service recovery, logs will be available to shipping;
4. Logging agent and message broker shall use mutual authentication (e.g., based on TLS) to encrypt all transmitted data (log messages) and authenticate themselves:
    - this allows mitigating threats such as: microservice spoofing, logging/transport system spoofing, network traffic injection, sniffing network traffic
5. Message broker shall enforce access control policy to mitigate unauthorized access and implement the principle of least privileges:
    - this allows mitigating the threat of microservice elevation of privileges
6. Logging agent shall filter/sanitize output log messages to make sure that sensitive data (e.g., PII, passwords, API keys) is never sent to the central logging subsystem (data minimization principle). For a comprehensive overview of items that should be excluded from logging, please see the [OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html#data-to-exclude).
7. Microservices shall generate a correlation ID that uniquely identifies every call chain and helps group log messages to investigate them. The logging agent shall include a correlation ID in every log message.
8. The logging agent shall periodically provide health and status data to indicate its availability or non-availability.
9. The logging agent shall publish log messages in a structured logs format (e.g., JSON, CSV).
10. The logging agent shall append log messages with context data, e.g., platform context (hostname, container name), runtime context (class name, filename).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

ロギングサブシステムアーキテクチャに対する高レベルの推奨事項と、その根拠を以下に示します。

1. マイクロサービスは、ネットワーク通信を使用して中央ロギングサブシステムにログメッセージを直接送信してはなりません。マイクロサービスは、ログメッセージをローカルログファイルに書き込まなければなりません。
    - これにより、攻撃によるロギングサービス障害、または正当なマイクロサービスによるフラッディングの場合に、データ損失の脅威を緩和できます。
    - ロギングサービス停止時でも、マイクロサービスはローカルファイルにログメッセージを書き込み続けるためデータ損失は発生せず、ロギングサービス復旧後にログを配送できるようになります。
2. マイクロサービスから分離された専用コンポーネント、つまりロギングエージェントが存在しなければなりません。ロギングエージェントは、マイクロサービス上のログデータを収集し、ローカルログファイルを読み取り、中央ロギングサブシステムに送信しなければなりません。ネットワークレイテンシの問題が発生する可能性があるため、ロギングエージェントはマイクロサービスと同じホスト、つまり仮想または物理マシン上にデプロイしなければなりません。
    - これにより、攻撃によるロギングサービス障害、または正当なマイクロサービスによるフラッディングの場合に、データ損失の脅威を緩和できます。
    - ロギングエージェント障害時でも、マイクロサービスはログファイルに情報を書き込み続け、ロギングエージェントは復旧後にファイルを読み取り、情報をメッセージブローカーに送信します。
3. 中央ロギングサブシステムに対する DoS 攻撃の可能性があるため、ロギングエージェントはログメッセージを送信するために非同期リクエスト/レスポンスパターンを使用してはなりません。ロギングエージェントと中央ロギングサービス間の非同期接続を実装するために、メッセージブローカーが存在しなければなりません。
    - これにより、正当なマイクロサービスによるフラッディングの場合に、ロギングサービス障害によるデータ損失の脅威を緩和できます。
    - ロギングサービス停止時でも、マイクロサービスはローカルファイルにログメッセージを書き込み続けるためデータ損失は発生せず、ロギングサービス復旧後にログを配送できるようになります。
4. ロギングエージェントとメッセージブローカーは、すべての送信データ、つまりログメッセージを暗号化し、相互に認証するために、たとえば TLS に基づく相互認証を使用しなければなりません。
    - これにより、マイクロサービスのなりすまし、ロギング/転送システムのなりすまし、ネットワークトラフィック注入、ネットワークトラフィックの盗聴などの脅威を緩和できます。
5. メッセージブローカーは、不正アクセスを緩和し、最小権限の原則を実装するために、アクセス制御ポリシーを強制しなければなりません。
    - これにより、マイクロサービスの権限昇格の脅威を緩和できます。
6. ロギングエージェントは、機密データ、たとえば PII、パスワード、API キーが中央ロギングサブシステムに送信されないようにするため、出力ログメッセージをフィルタリングまたはサニタイズしなければなりません。これはデータ最小化の原則です。ログから除外すべき項目の包括的な概要については、[OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html#data-to-exclude) を参照してください。
7. マイクロサービスは、すべての呼び出しチェーンを一意に識別し、調査のためにログメッセージをグループ化するのに役立つ correlation ID を生成しなければなりません。ロギングエージェントは、すべてのログメッセージに correlation ID を含めなければなりません。
8. ロギングエージェントは、その可用性または非可用性を示すため、ヘルスデータおよびステータスデータを定期的に提供しなければなりません。
9. ロギングエージェントは、構造化ログ形式、たとえば JSON や CSV でログメッセージを publish しなければなりません。
10. ロギングエージェントは、ログメッセージにコンテキストデータ、たとえばプラットフォームコンテキスト (hostname, container name) やランタイムコンテキスト (class name, filename) を追加しなければなりません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

For a comprehensive overview of events that should be logged and possible data format, please see the [OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html#which-events-to-log) and [Application Logging Vocabulary Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Vocabulary_Cheat_Sheet.html)

## References

- [NIST Special Publication 800-204](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-204.pdf) “Security Strategies for Microservices-based Application Systems”
- [NIST Special Publication 800-204A](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-204A.pdf) “Building Secure Microservices-based Applications Using Service-Mesh Architecture”
- [Microservices Security in Action](https://www.manning.com/books/microservices-security-in-action), Prabath Siriwardena and Nuwan Dias, 2020, Manning

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

ログに記録すべきイベントと、可能なデータ形式の包括的な概要については、[OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html#which-events-to-log) および [Application Logging Vocabulary Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Vocabulary_Cheat_Sheet.html) を参照してください。

## References

- [NIST Special Publication 800-204](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-204.pdf) “Security Strategies for Microservices-based Application Systems”
- [NIST Special Publication 800-204A](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-204A.pdf) “Building Secure Microservices-based Applications Using Service-Mesh Architecture”
- [Microservices Security in Action](https://www.manning.com/books/microservices-security-in-action), Prabath Siriwardena and Nuwan Dias, 2020, Manning

</div>
</div>

</section>
</div>

## Attribution

<div className="attributionFooter">

- Original: Microservices Security Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Microservices_Security_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: English original retained for comparison. Japanese translation added. Bilingual display generated from official source and local Japanese translation.
- Retrieved: 2026-05-21

</div>
