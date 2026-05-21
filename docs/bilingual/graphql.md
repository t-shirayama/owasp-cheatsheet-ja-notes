---
title: GraphQL Cheat Sheet
hide_title: true
---

<div className="docHero" data-category="asvs-v13">
  <h1>GraphQL チートシート</h1>
  <div className="docMeta">
    <span className="docPill">最終更新: 2026-05-20</span>
    <span className="docPill">読了時間: 準備中</span>
    <span className="docPill">カテゴリ: API と Web サービス</span>
  </div>
</div>

<p className="docLead">GraphQL チートシートを、原文・翻訳・対比表示で確認できます。ASVS Index 対応の文脈で、公式原文と日本語訳を確認しやすく整理しています。</p>

<div className="tabbedContent">
  <input className="tabInput" type="radio" name="graphql-view" id="graphql-original" />
  <input className="tabInput" type="radio" name="graphql-view" id="graphql-translation" defaultChecked />
  <input className="tabInput" type="radio" name="graphql-view" id="graphql-bilingual" />

  <div className="contentTabs">
    <label htmlFor="graphql-original" title="OWASP 原文">原文</label>
    <label htmlFor="graphql-translation" title="日本語訳">翻訳</label>
    <label htmlFor="graphql-bilingual" title="原文と翻訳を並べて確認">対比表示</label>
  </div>

<section id="graphql-original-panel" className="tabPanel originalPanel contentPanel">

## Introduction

[GraphQL](https://graphql.org) is an open source query language originally developed by Facebook that can be used to build APIs as an alternative to REST and SOAP. It has gained popularity since its inception in 2012 because of the native flexibility it offers to those building and calling the API. There are GraphQL servers and clients implemented in various languages. [Many companies](https://foundation.graphql.org/) use GraphQL including GitHub, Credit Karma, Intuit, and PayPal.

This Cheat Sheet provides guidance on the various areas that need to be considered when working with GraphQL:

- Apply proper [input validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html) checks on all incoming data.
- Expensive queries will lead to [Denial of Service (DoS)](https://cheatsheetseries.owasp.org/cheatsheets/Denial_of_Service_Cheat_Sheet.html), so add checks to limit or prevent queries that are too expensive.
- Ensure that the API has proper [access control](https://cheatsheetseries.owasp.org/cheatsheets/Access_Control_Cheat_Sheet.html) checks.
- Disable insecure default configurations (_e.g._ excessive errors, introspection, GraphiQL, etc.).

## Common Attacks

- [Injection](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa8-injection.md) - this usually includes but is not limited to:
    - [SQL](https://owasp.org/www-community/attacks/SQL_Injection) and [NoSQL](https://www.netsparker.com/blog/web-security/what-is-nosql-injection/) injection
    - [OS Command injection](https://owasp.org/www-community/attacks/Command_Injection)
    - [SSRF](https://portswigger.net/web-security/ssrf) and [CRLF](https://owasp.org/www-community/vulnerabilities/CRLF_Injection) [injection](https://www.acunetix.com/websitesecurity/crlf-injection/)/[Request](https://portswigger.net/web-security/request-smuggling) [Smuggling](https://www.pentestpartners.com/security-blog/http-request-smuggling-a-how-to/)
- [DoS](https://owasp.org/www-community/attacks/Denial_of_Service) ([Denial of Service](https://www.cloudflare.com/learning/ddos/glossary/denial-of-service/))
- Abuse of broken authorization: either [improper](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa1-broken-object-level-authorization.md) or [excessive](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa3-excessive-data-exposure.md) access, including [IDOR](https://portswigger.net/web-security/access-control/idor)
- Batching Attacks, a GraphQL-specific method of brute force attack
- Abuse of insecure default configurations

## Best Practices and Recommendations

### Input Validation

Adding strict input validation can help prevent against injection and DoS. The main design for GraphQL is that the user supplies one or more identifiers and the backend has a number of data fetchers making HTTP, DB, or other calls using the given identifiers. This means that user input will be included in HTTP requests, DB queries, or other requests/calls which provides opportunity for injection that could lead to various injection attacks or DoS.

See the OWASP Cheat Sheets on [Input Validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html) and general [injection prevention](https://cheatsheetseries.owasp.org/cheatsheets/Injection_Prevention_Cheat_Sheet.html) for full details to best perform input validation and prevent injection.

#### General Practices

Validate all incoming data to only allow valid values (i.e. allowlist).

- Use specific GraphQL [data types](https://graphql.org/learn/schema/#type-language) such as [scalars](https://graphql.org/learn/schema/#scalar-types) or [enums](https://graphql.org/learn/schema/#enumeration-types). Write custom GraphQL [validators](https://graphql.org/learn/validation/) for more complex validations. [Custom scalars](https://itnext.io/custom-scalars-in-graphql-9c26f43133f3) may also come in handy.
- Define [schemas for mutations input](https://graphql.org/learn/schema/#input-types).
- [List allowed characters](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html#allow-list-vs-block-list) - don't use a denylist
    - The stricter the list of allowed characters the better. A lot of times a good starting point is only allowing alphanumeric, non-unicode characters because it will disallow many attacks.
- To properly handle unicode input, use a [single internal character encoding](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html#validating-free-form-unicode-text)
- Gracefully [reject invalid input](https://cheatsheetseries.owasp.org/cheatsheets/Error_Handling_Cheat_Sheet.html), being careful not to reveal excessive information about how the API and its validation works.

#### Injection Prevention

When handling input meant to be passed to another interpreter (_e.g._ SQL/NoSQL/ORM, OS, LDAP, XML):

- Always choose libraries/modules/packages offering safe APIs, such as parameterized statements.
    - Ensure that you follow the documentation so you are properly using the tool
    - Using ORMs and ODMs are a good option but they must be used properly to avoid flaws such as [ORM injection](https://owasp.org/www-project-web-security-testing-guide/stable/4-Web_Application_Security_Testing/07-Input_Validation_Testing/05.7-Testing_for_ORM_Injection).
- If such tools are not available, always escape/encode input data according to best practices of the target interpreter
    - Choose a well-documented and actively maintained escaping/encoding library. Many languages and frameworks have this functionality built-in.

For more information see the below pages:

- [SQL Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)
- [NoSQL Injection Prevention](https://www.netsparker.com/blog/web-security/what-is-nosql-injection/)
- [LDAP Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/LDAP_Injection_Prevention_Cheat_Sheet.html)
- [OS Command Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/OS_Command_Injection_Defense_Cheat_Sheet.html)
- [XML Security](https://cheatsheetseries.owasp.org/cheatsheets/XML_Security_Cheat_Sheet.html) and [XXE Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/XML_External_Entity_Prevention_Cheat_Sheet.html)

#### Process Validation

When using user input, even if sanitized and/or validated, it should not be used for certain purposes that would give a user control over data flow. For example, do not make an HTTP/resource request to a host that the user supplies (unless there is an absolute business need).

### DoS Prevention

DoS is an attack against the availability and stability of the API that can make it slow, unresponsive, or completely unavailable. This CS details several methods to limit the possibility of a DoS attack at the application level and other layers of the tech stack. There is also a CS dedicated to the topic of [DoS](https://cheatsheetseries.owasp.org/cheatsheets/Denial_of_Service_Cheat_Sheet.html).

Here are recommendations specific to GraphQL to limit the potential for DoS:

- Add depth limiting to incoming queries
- Add amount limiting to incoming queries
- Add [pagination](https://graphql.org/learn/pagination/) to limit the amount of data that can be returned in a single response
- Add reasonable timeouts at the application layer, infrastructure layer, or both
- Consider performing query cost analysis and enforcing a maximum allowed cost per query
- Enforce rate limiting on incoming requests per IP or user (or both) to prevent basic DoS attacks
- Implement the [batching and caching technique](https://graphql.org/learn/best-practices/#server-side-batching-caching) on the server-side (Facebook's [DataLoader](https://github.com/facebook/dataloader) can be used for this)

#### Query Limiting (Depth & Amount)

In GraphQL each query has a depth (_e.g._ nested objects) and each object requested in a query can have an amount specified (_e.g._ 99999999 of an object). By default these can both be unlimited which may lead to a DoS. You should set limits on depth and amount to prevent DoS, but this usually requires a small custom implementation as it is not natively supported by GraphQL. See [this](https://www.apollographql.com/blog/securing-your-graphql-api-from-malicious-queries-16130a324a6b) and [this](https://www.howtographql.com/advanced/4-security/) page for more information about these attacks and how to add depth and amount limiting. Adding [pagination](https://graphql.org/learn/pagination/) can also help performance.

APIs using graphql-java can utilize the built-in [MaxQueryDepthInstrumentation](https://github.com/graphql-java/graphql-java/blob/master/src/main/java/graphql/analysis/MaxQueryDepthInstrumentation.java) for depth limiting. APIs using JavaScript can use [graphql-depth-limit](https://www.npmjs.com/package/graphql-depth-limit) to implement depth limiting and [graphql-input-number](https://github.com/joonhocho/graphql-input-number) to implement amount limiting.

Here is an example of a GraphQL query with depth N:

```javascript
query evil {            # Depth: 0
  album(id: 42) {       # Depth: 1
    songs {             # Depth: 2
      album {           # Depth: 3
        ...             # Depth: ...
        album {id: N}   # Depth: N
      }
    }
  }
}
```text

Here is an example of a GraphQL query requesting 99999999 of an object:

```javascript
query {
  author(id: "abc") {
    posts(first: 99999999) {
      title
    }
  }
}
```text

#### Timeouts

Adding timeouts can be a simple way to limit how many resources any single request can consume. But timeouts are not always effective since they may not activate until a malicious query has already consumed excessive resources. Timeout requirements will differ by API and data fetching mechanism; there isn't one timeout value that will work across the board.

At the application level, timeouts can be added for queries and resolver functions. This option is usually more effective since the query/resolution can be stopped once the timeout is reached. GraphQL does not natively support query timeouts so custom code is required. See [this blog post](https://medium.com/workflowgen/graphql-query-timeout-and-complexity-management-fab4d7315d8d) for more about using timeouts with GraphQL or the two examples below.

_**JavaScript Timeout Example**_

Code snippet from [this SO answer](https://stackoverflow.com/a/53277955/1200388):

```javascript
request.incrementResolverCount =  function () {
    var runTime = Date.now() - startTime;
    if (runTime > 10000) {  // a timeout of 10 seconds
      if (request.logTimeoutError) {
        logger('ERROR', `Request ${request.uuid} query execution timeout`);
      }
      request.logTimeoutError = false;
      throw 'Query execution has timeout. Field resolution aborted';
    }
    this.resolverCount++;
  };
```text

_**Java Timeout Example using [Instrumentation](https://www.graphql-java.com/documentation/instrumentation)**_

```java
public class TimeoutInstrumentation extends SimpleInstrumentation {
    @Override
    public DataFetcher<?> instrumentDataFetcher(
            DataFetcher<?> dataFetcher, InstrumentationFieldFetchParameters parameters
    ) {
        return environment ->
            Observable.fromCallable(() -> dataFetcher.get(environment))
                .subscribeOn(Schedulers.computation())
                .timeout(10, TimeUnit.SECONDS)  // timeout of 10 seconds
                .blockingFirst();
    }
}
```bash

_**Infrastructure Timeout**_

Another option to add a timeout that is usually easier is adding a timeout on an HTTP server ([Apache/httpd](https://httpd.apache.org/docs/2.4/mod/core.html#timeout), [nginx](http://nginx.org/en/docs/http/ngx_http_core_module.html#send_timeout)), reverse proxy, or load balancer. However, infrastructure timeouts are often inaccurate and can be bypassed more easily than application-level ones.

#### Query Cost Analysis

Query cost analysis involves assigning costs to the resolution of fields or types in incoming queries so that the server can reject queries that cost too much to run or will consume too many resources. This is not easy to implement and may not always be necessary but it is the most thorough approach to preventing DoS. See "Query Cost Analysis" in [this blog post](https://www.apollographql.com/blog/securing-your-graphql-api-from-malicious-queries-16130a324a6b) for more details on implementing this control.

Apollo recommends:

> **Before you go ahead and spend a ton of time implementing query cost analysis be certain you need it.** Try to crash or slow down your staging API with a nasty query and see how far you get — maybe your API doesn’t have these kinds of nested relationships, or maybe it can handle fetching thousands of records at a time perfectly fine and doesn’t need query cost analysis!

APIs using graphql-java can utilize the built-in [MaxQueryComplexityInstrumentationto](https://github.com/graphql-java/graphql-java/blob/master/src/main/java/graphql/analysis/MaxQueryComplexityInstrumentation.java) to enforce max query complexity. APIs using JavaScript can utilize [graphql-cost-analysis](https://github.com/pa-bru/graphql-cost-analysis) or [graphql-validation-complexity](https://github.com/4Catalyzer/graphql-validation-complexity) to enforce max query cost.

#### Rate Limiting

Enforcing rate limiting on a per IP or user (for anonymous and unauthorized access) basis can help limit a single user's ability to spam requests to the service and impact performance. Ideally this can be done with a WAF, API gateway, or web server ([Nginx](https://www.nginx.com/blog/rate-limiting-nginx/), [Apache](https://httpd.apache.org/docs/2.4/mod/mod_ratelimit.html)/[HTTPD](https://github.com/jzdziarski/mod_evasive)) to reduce the effort of adding rate limiting.

Or you could get somewhat complex with throttling and implement it in your code (non-trivial). See "Throttling" [here](https://www.howtographql.com/advanced/4-security/) for more about GraphQL-specific rate limiting.

#### Server-side Batching and Caching

To increase efficiency of a GraphQL API and reduce its resource consumption, [the batching and caching technique](https://graphql.org/learn/best-practices/#server-side-batching-caching) can be used to prevent making duplicate requests for pieces of data within a small time frame. Facebook's [DataLoader](https://github.com/facebook/dataloader) tool is one way to implement this.

#### System Resource Management

Not properly limiting the amount of resources your API can use (_e.g._ CPU or memory), may compromise your API responsiveness and availability, leaving it vulnerable to DoS attacks. Some limiting can be done at the operating system level.

On Linux, a combination of [Control Groups(cgroups)](https://en.wikipedia.org/wiki/Cgroups), [User Limits (ulimits)](https://linuxhint.com/linux_ulimit_command/), and [Linux Containers (LXC)](https://linuxcontainers.org/lxc/security/) can be used.

However, containerization platforms tend to make this task much easier. See the resource limiting section in the [Docker Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html#rule-7-limit-resources-memory-cpu-file-descriptors-processes-restarts) for how to prevent DoS when using containers.

### Access Control

To ensure that a GraphQL API has proper access control, do the following:

- Always validate that the requester is authorized to view or mutate/modify the data they are requesting. This can be done with [RBAC](https://cheatsheetseries.owasp.org/cheatsheets/Access_Control_Cheat_Sheet.html#role-based-access-control-rbac) or other access control mechanisms.
    - This will prevent [IDOR](https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html) issues, including both [BOLA](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa1-broken-object-level-authorization.md) and [BFLA](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa5-broken-function-level-authorization.md).
- Enforce authorization checks on both edges and nodes (see example [bug report](https://hackerone.com/reports/489146) where nodes did not have authorization checks but edges did).
- Use [Interfaces](https://graphql.org/learn/schema/#interfaces) and [Unions](https://graphql.org/learn/schema/#union-types) to create structured, hierarchical data types which can be used to return more or fewer object properties, according to requester permissions.
- Query and Mutation [Resolvers](https://graphql.org/learn/execution/#root-fields-resolvers) can be used to perform access control validation, possibly using some RBAC middleware.
- [Disable introspection queries](https://lab.wallarm.com/why-and-how-to-disable-introspection-query-for-graphql-apis/) system-wide in any production or publicly accessible environments.
- Disable [GraphiQL](https://github.com/graphql/graphiql) and other similar schema exploration tools in production or publicly accessible environments.

#### General Data Access

It's commonplace for GraphQL requests to include one or more direct IDs of objects in order to fetch or modify them. For example, a request for a certain picture may include the ID that is actually the primary key in the database for that picture. As with any request, the server must verify that the caller has access to the object they are requesting. But sometimes developers make the mistake of assuming that possession of the object's ID means the caller should have access. Failure to verify the requester's access in this case is called [Broken Object Level Authentication](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa1-broken-object-level-authorization.md), also known as [IDOR](https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html).

It's possible for a GraphQL API to support access to objects using their ID even if that is not intended. Sometimes there are `node` or `nodes` or both fields in a query object, and these can be used to access objects directly by `ID`. You can check whether your schema has these fields by running this on the command-line (assuming that `schema.json` contains your GraphQL schema): `cat schema.json | jq ".data.__schema.types[] | select(.name==\\"Query\\") | .fields[] | .name" | grep node`. Removing these fields from the schema should disable the functionality, but you should always apply proper authorization checks to verify the caller has access to the object they are requesting.

#### Query Access (Data Fetching)

As part of a GraphQL API there will be various data fields that can be returned. One thing to consider is if you want different levels of access around these fields. For example, you may only want certain consumers to be able to fetch certain data fields rather than allowing all consumers to be able to retrieve all available fields. This can be done by adding a check in the code to ensure that the requester should be able to read a field they are trying to fetch.

#### Mutation Access (Data Manipulation)

GraphQL supports mutation, or manipulation of data, in addition to its most common use case of data fetching. If an API implements/allows mutation then there may need to be access controls put in place to restrict which consumers, if any, can modify data through the API. Setups that require mutation access control would include APIs where only read access is intended for requesters or where only certain parties should be able to modify certain fields.

### Batching Attacks

GraphQL supports batching requests, also known as [query batching](https://www.apollographql.com/blog/query-batching-in-apollo-63acfd859862/). This lets callers to either batch multiple queries or batch requests for multiple object instances in a single network call, which allows for what is called a [batching attack](https://lab.wallarm.com/graphql-batching-attack/). This is a form of brute force attack, specific to GraphQL, that usually allows for faster and less detectable exploits. Here is the most common way to do query batching:

```javascript
[
  {
    query: < query 0 >,
    variables: < variables for query 0 >,
  },
  {
    query: < query 1 >,
    variables: < variables for query 1 >,
  },
  {
    query: < query n >
    variables: < variables for query n >,
  }
]
```text

And here is an example query of a single batched GraphQL call requesting multiple different instances of the `droid` object:

```javascript
query {
  droid(id: "2000") {
    name
  }
  second:droid(id: "2001") {
    name
  }
  third:droid(id: "2002") {
    name
  }
}
```text

In this case it could be used to enumerate every possible `droid` object that is stored on the server in very few network requests as opposed to a standard REST API where the requester would need to submit a different network request for every different `droid` ID they want to request. This type of attack can lead to the following issues:

- Application-level DoS attacks - A high number of queries or object requests in a single network call could cause a database to hang or exhaust other available resources (_e.g._ memory, CPU, downstream services).
- Enumeration of objects on the server, such as users, emails, and user IDs.
- Brute forcing passwords, 2 factor authentication codes (OTPs), session tokens, or other sensitive values.
- WAFs, RASPs, IDS/IPS, SIEMs, or other security tooling will likely not detect these attacks since they only appear to be one single request rather than an a massive amount of network traffic.
- This attack will likely bypass existing rate limits in tools like Nginx or other proxies/gateways since they rely on looking at the raw number of requests.

#### Mitigating Batching Attacks

In order to mitigate this type of attack you should put limits on incoming requests at the code level so that they can be applied per request. There are 3 main options:

- Add object request rate limiting in code
- Prevent batching for sensitive objects
- Limit the number of queries that can run at one time

One option is to create a code-level rate limit on how many objects that callers can request. This means the backend would track how many different object instances the caller has requested, so that they will be blocked after requesting too many objects even if they batch the object requests in a single network call. This replicates a network-level rate limit that a WAF or other tool would do.

Another option is to prevent batching for sensitive objects that you don't want to be brute forced, such as usernames, emails, passwords, OTPs, session tokens, etc. This way an attacker is forced to attack the API like a REST API and make a different network call per object instance. This is not supported natively so it will require a custom solution. However once this control is put in place other standard controls will function normally to help prevent any brute forcing.

Limiting the number of operations that can be batched and run at once is another option to mitigate GraphQL batching attacks leading to DoS. This is not a silver bullet though and should be used in conjunction with other methods.

### Secure Configurations

By default, most GraphQL implementations have some insecure default configurations which should be changed:

- Don't return excessive error messages (_e.g._ disable stack traces and debug mode).
- Disable or restrict Introspection and GraphiQL based on your needs.
- Suggestion of mis-typed fields if the introspection is disabled

#### Introspection + GraphiQL

GraphQL Often comes by default with introspection and/or GraphiQL enabled and not requiring authentication. This allows the consumer of your API to learn everything about your API, schemas, mutations, deprecated fields and sometimes unwanted "private fields".

This might be an intended configuration if your API is designed to be consumed by external clients, but can also be an issue if the API was designed to be used internally only. Although security by obscurity is not recommended, it might be a good idea to consider removing the Introspection to avoid any leak.
If your API is publicly consumed, you might want to consider disabling it for not authenticated or unauthorized users.

For internal API, the easiest approach is to just disable introspection system-wide. See [this page](https://lab.wallarm.com/why-and-how-to-disable-introspection-query-for-graphql-apis/) or consult your GraphQL implementation's documentation to learn how to disable introspection altogether. If your implementation does not natively support disabling introspection or if you would like to allow some consumers/roles to have this access, you can build a filter in your service to only allow approved consumers to access the introspection system.

Keep in mind that even if introspection is disabled, attackers can still guess fields by brute forcing them. Furthermore, GraphQL has a built-in feature to return a hint when a field name that the requester provides is similar (but incorrect) to an existing field (_e.g._ request has `usr` and the response will ask `Did you mean "user?"`). You should consider disabling this feature if you have disabled the introspection, to decrease the exposure, but not all implementations of GraphQL support doing so. [Shapeshifter](https://github.com/szski/shapeshifter) is one tool that [should be able to do this](https://www.youtube.com/watch?v=NPDp7GHmMa0&t=2580).

_**Disable Introspection - Java**_

```java
GraphQLSchema schema = GraphQLSchema.newSchema()
    .query(StarWarsSchema.queryType)
    .fieldVisibility( NoIntrospectionGraphqlFieldVisibility.NO_INTROSPECTION_FIELD_VISIBILITY )
    .build();
```text

_**Disable Introspection & GraphiQL - JavaScript**_

```javascript
app.use('/graphql', graphqlHTTP({
  schema: MySessionAwareGraphQLSchema,
+ validationRules: [NoIntrospection]
  graphiql: process.env.NODE_ENV === 'development',
}));
```text

#### Don't Return Excessive Errors

GraphQL APIs in production shouldn't return stack traces or be in debug mode. Doing this is implementation specific, but using middleware is one popular way to have better control over errors the server returns. To [disable excessive errors](https://www.apollographql.com/docs/apollo-server/data/errors/) with Apollo Server, either pass `debug: false` to the Apollo Server constructor or set the `NODE_ENV` environment variable to 'production' or 'test'. However, if you would like to log the stack trace internally without returning it to the user see [here](https://www.apollographql.com/docs/apollo-server/data/errors/#masking-and-logging-errors) for how to mask and log errors so they are available to the developers but not callers of the API.

## Other Resources

### Tools

- [InQL Scanner](https://github.com/doyensec/inql) - Security scanner for GraphQL. Particularly useful for generating queries and mutations automatically from given schema and then feeding them to scanner.
- [GraphiQL](https://github.com/graphql/graphiql) - Schema/object exploration
- [GraphQL Voyager](https://github.com/APIs-guru/graphql-voyager) - Schema/object exploration

### GraphQL Security Best Practices + Documentation

- [Protecting GraphQL APIs from security threats - blog post](https://medium.com/swlh/protecting-your-graphql-api-from-security-vulnerabilities-e8afdfa6fbe4)
- [https://nordicapis.com/security-points-to-consider-before-implementing-graphql/]%28https://nordicapis.com/security-points-to-consider-before-implementing-graphql/)
- [Limiting resource usage to prevent DoS (timeouts, throttling, complexity management, depth limiting, etc.)](https://developer.github.com/v4/guides/resource-limitations/)
- [GraphQL Security Perspectives](https://www.abhaybhargav.com/from-the-trenches-diy-security-perspectives-of-graphql/)
- [A developer's security perspective of GraphQL](https://planes.studio/blog/how-to-survive-a-penetration-test-as-a-graph-ql-developer)

### More on GraphQL Attacks

- [Some common GraphQL attacks + attacker mindset](https://blog.doyensec.com/2018/05/17/graphql-security-overview.html)
- [Bypassing permissions by smuggling parameters](https://labs.detectify.com/2018/03/14/graphql-abuse/)
- [Bug bounty writeup about GraphQL](https://medium.com/bugbountywriteup/graphql-voyager-as-a-tool-for-security-testing-86d3c634bcd9)
- [Security talk about Abusing GraphQL](https://www.youtube.com/watch?v=NPDp7GHmMa0)
- [Real](https://vulners.com/myhack58/MYHACK58:62201994269) [world](https://www.pentestpartners.com/security-blog/pwning-wordpress-graphql/) [attacks](https://hackerone.com/reports/419883) [against](https://vulners.com/hackerone/H1:435066) [GraphQL](https://www.jonbottarini.com/2018/01/02/abusing-internal-api-to-achieve-idor-in-new-relic/) [in the](https://about.gitlab.com/blog/2019/07/03/security-release-gitlab-12-dot-0-dot-3-released/#authorization-issues-in-graphql) past
- [Attack examples against GraphQL](https://raz0r.name/articles/looting-graphql-endpoints-for-fun-and-profit/)

</section>

<section id="graphql-translation-panel" className="tabPanel translationPanel contentPanel">

## はじめに

[GraphQL](https://graphql.org) は、もともと Facebook によって開発されたオープンソースのクエリ言語であり、REST や SOAP の代替として API を構築するために使用できます。API を構築する側と呼び出す側に本来備わった柔軟性を提供するため、2012 年の登場以来、人気を集めてきました。さまざまな言語で実装された GraphQL サーバーとクライアントがあります。GitHub、Credit Karma、Intuit、PayPal など、[多くの企業](https://foundation.graphql.org/)が GraphQL を使用しています。

このチートシートでは、GraphQL を扱う際に考慮すべきさまざまな領域についてガイダンスを提供します。

- すべての受信データに適切な[入力検証](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)チェックを適用します。
- 高コストなクエリは[サービス拒否 (DoS)](https://cheatsheetseries.owasp.org/cheatsheets/Denial_of_Service_Cheat_Sheet.html) につながるため、高コストすぎるクエリを制限または防止するチェックを追加します。
- API に適切な[アクセス制御](https://cheatsheetseries.owasp.org/cheatsheets/Access_Control_Cheat_Sheet.html)チェックがあることを確認します。
- 安全でないデフォルト設定 (過剰なエラー、イントロスペクション、GraphiQL など) を無効にします。

## 一般的な攻撃

- [インジェクション](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa8-injection.md) - 通常、以下を含みますが、これらに限定されません。
    - [SQL](https://owasp.org/www-community/attacks/SQL_Injection) および [NoSQL](https://www.netsparker.com/blog/web-security/what-is-nosql-injection/) インジェクション
    - [OS コマンドインジェクション](https://owasp.org/www-community/attacks/Command_Injection)
    - [SSRF](https://portswigger.net/web-security/ssrf) および [CRLF](https://owasp.org/www-community/vulnerabilities/CRLF_Injection) [インジェクション](https://www.acunetix.com/websitesecurity/crlf-injection/)/[リクエスト](https://portswigger.net/web-security/request-smuggling)[スマグリング](https://www.pentestpartners.com/security-blog/http-request-smuggling-a-how-to/)
- [DoS](https://owasp.org/www-community/attacks/Denial_of_Service) ([サービス拒否](https://www.cloudflare.com/learning/ddos/glossary/denial-of-service/))
- 壊れた認可の悪用: [不適切な](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa1-broken-object-level-authorization.md)アクセスまたは[過剰な](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa3-excessive-data-exposure.md)アクセス。これには [IDOR](https://portswigger.net/web-security/access-control/idor) が含まれます。
- バッチング攻撃。GraphQL 固有のブルートフォース攻撃手法です。
- 安全でないデフォルト設定の悪用

## ベストプラクティスと推奨事項

### 入力検証

厳格な入力検証を追加すると、インジェクションと DoS の防止に役立ちます。GraphQL の主な設計では、ユーザーが一つ以上の識別子を提供し、バックエンドには指定された識別子を使って HTTP、DB、その他の呼び出しを行う多数のデータフェッチャがあります。つまり、ユーザー入力は HTTP リクエスト、DB クエリ、その他のリクエストや呼び出しに含まれます。そのため、さまざまなインジェクション攻撃や DoS につながる可能性のあるインジェクションの機会が生まれます。

入力検証を適切に実施し、インジェクションを防止するための詳細については、OWASP チートシートの[入力検証](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)と一般的な[インジェクション防止](https://cheatsheetseries.owasp.org/cheatsheets/Injection_Prevention_Cheat_Sheet.html)を参照してください。

#### 一般的なプラクティス

すべての受信データを検証し、有効な値のみを許可します (つまり許可リスト)。

- [スカラー](https://graphql.org/learn/schema/#scalar-types)や[列挙型](https://graphql.org/learn/schema/#enumeration-types)など、具体的な GraphQL [データ型](https://graphql.org/learn/schema/#type-language)を使用します。より複雑な検証には、カスタム GraphQL [バリデータ](https://graphql.org/learn/validation/)を記述します。[カスタムスカラー](https://itnext.io/custom-scalars-in-graphql-9c26f43133f3)も役立つ場合があります。
- [ミューテーション入力のスキーマ](https://graphql.org/learn/schema/#input-types)を定義します。
- [許可する文字を列挙](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html#allow-list-vs-block-list)します。拒否リストは使用しません。
    - 許可文字のリストは厳格であるほどよいです。多くの場合、英数字かつ非 Unicode 文字のみを許可することがよい出発点になります。これは多くの攻撃を拒否できるためです。
- Unicode 入力を適切に処理するには、[単一の内部文字エンコーディング](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html#validating-free-form-unicode-text)を使用します。
- API とその検証の仕組みに関する過剰な情報を明かさないよう注意しながら、無効な入力を適切に[拒否](https://cheatsheetseries.owasp.org/cheatsheets/Error_Handling_Cheat_Sheet.html)します。

#### インジェクション防止

別のインタープリタ (SQL/NoSQL/ORM、OS、LDAP、XML など) に渡すことを意図した入力を扱う場合:

- パラメータ化ステートメントなど、安全な API を提供するライブラリ、モジュール、パッケージを常に選択します。
    - ツールを適切に使用できるよう、ドキュメントに従っていることを確認します。
    - ORM や ODM の使用はよい選択肢ですが、[ORM インジェクション](https://owasp.org/www-project-web-security-testing-guide/stable/4-Web_Application_Security_Testing/07-Input_Validation_Testing/05.7-Testing_for_ORM_Injection)などの欠陥を避けるには適切に使用しなければなりません。
- そのようなツールが利用できない場合は、対象インタープリタのベストプラクティスに従って、常に入力データをエスケープまたはエンコードします。
    - 十分に文書化され、積極的に保守されているエスケープ/エンコードライブラリを選択します。多くの言語やフレームワークでは、この機能が組み込まれています。

詳細については、以下のページを参照してください。

- [SQL Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)
- [NoSQL Injection Prevention](https://www.netsparker.com/blog/web-security/what-is-nosql-injection/)
- [LDAP Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/LDAP_Injection_Prevention_Cheat_Sheet.html)
- [OS Command Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/OS_Command_Injection_Defense_Cheat_Sheet.html)
- [XML Security](https://cheatsheetseries.owasp.org/cheatsheets/XML_Security_Cheat_Sheet.html) および [XXE Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/XML_External_Entity_Prevention_Cheat_Sheet.html)

#### プロセス検証

ユーザー入力を使用する場合、サニタイズまたは検証済みであっても、ユーザーがデータフローを制御できるようになる特定の目的には使用すべきではありません。たとえば、ユーザーが指定したホストに HTTP/リソースリクエストを行ってはいけません (絶対的なビジネス上の必要性がある場合を除きます)。

### DoS 防止

DoS は API の可用性と安定性に対する攻撃であり、API を低速化、無応答化、または完全に利用不能にする可能性があります。このチートシートでは、アプリケーションレベルおよび技術スタックの他の層で DoS 攻撃の可能性を制限するいくつかの方法を詳述します。DoS というトピック専用の[チートシート](https://cheatsheetseries.owasp.org/cheatsheets/Denial_of_Service_Cheat_Sheet.html)もあります。

GraphQL に固有の、DoS の可能性を制限するための推奨事項は次のとおりです。

- 受信クエリに深さ制限を追加します。
- 受信クエリに件数制限を追加します。
- 単一レスポンスで返せるデータ量を制限するために[ページネーション](https://graphql.org/learn/pagination/)を追加します。
- アプリケーション層、インフラストラクチャ層、またはその両方に合理的なタイムアウトを追加します。
- クエリコスト分析を実施し、クエリごとの最大許容コストを強制することを検討します。
- 基本的な DoS 攻撃を防止するために、IP またはユーザー (またはその両方) ごとに受信リクエストのレート制限を強制します。
- サーバー側で[バッチングとキャッシュ技法](https://graphql.org/learn/thinking-in-graphs/#batching-and-caching)を実装します (Facebook の [DataLoader](https://github.com/graphql/dataloader) を使用できます)。

#### クエリ制限 (深さと件数)

GraphQL では各クエリに深さ (ネストされたオブジェクトなど) があり、クエリで要求される各オブジェクトには件数 (あるオブジェクトを 99999999 件など) を指定できます。デフォルトでは、これらはいずれも無制限になり得るため、DoS につながる可能性があります。DoS を防止するには深さと件数に制限を設定すべきですが、GraphQL ではネイティブにサポートされていないため、通常は小さなカスタム実装が必要です。

これらの攻撃と深さおよび件数制限の追加方法の詳細については、[こちら](https://www.apollographql.com/blog/securing-your-graphql-api-from-malicious-queries/)と[こちら](https://www.howtographql.com/advanced/4-security/)のページを参照してください。[ページネーション](https://graphql.org/learn/pagination/)を追加することもパフォーマンスに役立ちます。

graphql-java を使用する API は、組み込みの [MaxQueryDepthInstrumentation](https://github.com/graphql-java/graphql-java/blob/master/src/main/java/graphql/analysis/MaxQueryDepthInstrumentation.java) を深さ制限に利用できます。JavaScript を使用する API は、深さ制限の実装に [graphql-depth-limit](https://www.npmjs.com/package/graphql-depth-limit)、件数制限の実装に [graphql-input-number](https://github.com/4Catalyzer/graphql-input-number) を使用できます。

深さ N の GraphQL クエリの例を次に示します。

```graphql
query evil {            # Depth: 0
  album(id: 42) {       # Depth: 1
    songs {             # Depth: 2
      album {           # Depth: 3
        ...             # Depth: ...
        album {id: N}   # Depth: N
      }
    }
  }
}
```text

オブジェクトを 99999999 件要求する GraphQL クエリの例を次に示します。

```graphql
query {
  author(id: "abc") {
    posts(first: 99999999) {
      title
    }
  }
}
```text

#### タイムアウト

タイムアウトを追加することは、単一リクエストが消費できるリソース量を制限する簡単な方法になり得ます。ただし、悪意のあるクエリがすでに過剰なリソースを消費した後でないとタイムアウトが発動しない場合があるため、常に有効とは限りません。タイムアウト要件は API とデータ取得メカニズムによって異なり、全体に適用できる単一のタイムアウト値はありません。

アプリケーションレベルでは、クエリとリゾルバ関数にタイムアウトを追加できます。この選択肢は、タイムアウトに達した時点でクエリ/解決処理を停止できるため、通常はより効果的です。GraphQL はクエリタイムアウトをネイティブにサポートしていないため、カスタムコードが必要です。GraphQL でタイムアウトを使用する方法の詳細については、[このブログ記事](https://medium.com/@leeb/graphql-query-timeout-5f059ac29b67)または以下の二つの例を参照してください。

JavaScript タイムアウト例

[この Stack Overflow の回答](https://stackoverflow.com/questions/36241655/graphql-js-limit-query-execution-time/36251150)からのコードスニペット:

```javascript
request.incrementResolverCount =  function () {
    var runTime = Date.now() - startTime;
    if (runTime > 10000) {  // a timeout of 10 seconds
      if (request.logTimeoutError) {
        logger('ERROR', `Request ${request.uuid} query execution timeout`);
      }
      request.logTimeoutError = false;
      throw 'Query execution has timeout. Field resolution aborted';
    }
    this.resolverCount++;
  };
```text

[Instrumentation](https://www.graphql-java.com/documentation/instrumentation/) を使用した Java タイムアウト例

```java
public class TimeoutInstrumentation extends SimpleInstrumentation {
    @Override
    public DataFetcher<?> instrumentDataFetcher(
            DataFetcher<?> dataFetcher, InstrumentationFieldFetchParameters parameters
    ) {
        return environment ->
            Observable.fromCallable(() -> dataFetcher.get(environment))
                .subscribeOn(Schedulers.computation())
                .timeout(10, TimeUnit.SECONDS)  // timeout of 10 seconds
                .blockingFirst();
    }
}
```bash

インフラストラクチャタイムアウト

通常より簡単な、タイムアウトを追加する別の選択肢は、HTTP サーバー ([Apache/httpd](https://httpd.apache.org/)、[nginx](https://nginx.org/))、リバースプロキシ、またはロードバランサーにタイムアウトを追加することです。ただし、インフラストラクチャのタイムアウトは不正確であることが多く、アプリケーションレベルのものより容易にバイパスされる可能性があります。

#### クエリコスト分析

クエリコスト分析では、受信クエリ内のフィールドや型の解決にコストを割り当てます。これにより、実行コストが高すぎる、またはリソースを過剰に消費するクエリをサーバーが拒否できます。実装は容易ではなく、常に必要とは限りませんが、DoS を防止するための最も徹底したアプローチです。この制御の実装の詳細については、[このブログ記事](https://www.apollographql.com/blog/securing-your-graphql-api-from-malicious-queries/)の「Query Cost Analysis」を参照してください。

Apollo は次のように推奨しています。

> クエリコスト分析の実装に多大な時間を費やす前に、それが本当に必要であることを確認してください。悪質なクエリでステージング API をクラッシュさせたり遅くしたりできるか試して、どこまでできるか確認してください。もしかすると、その API にはこうしたネスト関係がないかもしれませんし、一度に数千件のレコードを問題なく取得でき、クエリコスト分析を必要としないかもしれません。

graphql-java を使用する API は、最大クエリ複雑度を強制するために組み込みの [MaxQueryComplexityInstrumentation](https://github.com/graphql-java/graphql-java/blob/master/src/main/java/graphql/analysis/MaxQueryComplexityInstrumentation.java) を利用できます。JavaScript を使用する API は、最大クエリコストを強制するために [graphql-cost-analysis](https://github.com/pa-bru/graphql-cost-analysis) または [graphql-validation-complexity](https://github.com/4Catalyzer/graphql-validation-complexity) を利用できます。

#### レート制限

IP またはユーザー単位 (匿名アクセスおよび未認可アクセスの場合) でレート制限を強制すると、単一ユーザーがサービスにリクエストを大量送信してパフォーマンスに影響を与える能力を制限できます。理想的には、WAF、API ゲートウェイ、または Web サーバー ([Nginx](https://www.nginx.com/)、[Apache](https://httpd.apache.org/)/[HTTPD](https://github.com/apache/httpd)) で実施し、レート制限追加の手間を減らします。

または、多少複雑になりますが、スロットリングをコード内に実装することもできます (容易ではありません)。GraphQL 固有のレート制限の詳細については、[こちら](https://www.howtographql.com/advanced/4-security/)の「Throttling」を参照してください。

#### サーバー側バッチングとキャッシュ

GraphQL API の効率を高め、リソース消費を削減するため、[バッチングとキャッシュ技法](https://graphql.org/learn/thinking-in-graphs/#batching-and-caching)を使用して、短い時間枠内で同じデータ片に対する重複リクエストを防止できます。Facebook の [DataLoader](https://github.com/graphql/dataloader) は、これを実装する方法の一つです。

#### システムリソース管理

API が使用できるリソース量 (CPU やメモリなど) を適切に制限しないと、API の応答性と可用性が損なわれ、DoS 攻撃に対して脆弱になります。一部の制限はオペレーティングシステムレベルで実施できます。

Linux では、[Control Groups (cgroups)](https://en.wikipedia.org/wiki/Cgroups)、[User Limits (ulimits)](https://linuxhint.com/linux_ulimit_command/)、[Linux Containers (LXC)](https://linuxcontainers.org/) の組み合わせを使用できます。

ただし、コンテナ化プラットフォームはこの作業をはるかに容易にする傾向があります。コンテナ使用時に DoS を防止する方法については、[Docker Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html) のリソース制限セクションを参照してください。

### アクセス制御

GraphQL API に適切なアクセス制御があることを確認するには、次を実施します。

- リクエスト元が、要求しているデータを閲覧またはミューテーション/変更する権限を持つことを常に検証します。これは [RBAC](https://en.wikipedia.org/wiki/Role-based_access_control) または他のアクセス制御メカニズムで実施できます。
    - これにより、[BOLA](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa1-broken-object-level-authorization.md) と [BFLA](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa5-broken-function-level-authorization.md) の両方を含む [IDOR](https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html) の問題を防止できます。
- エッジとノードの両方で認可チェックを強制します (ノードには認可チェックがなかったがエッジにはあった[バグ報告の例](https://hackerone.com/reports/489146)を参照)。
- [Interfaces](https://graphql.org/learn/schema/#interfaces) と [Unions](https://graphql.org/learn/schema/#union-types) を使用して、リクエスト元の権限に応じてオブジェクトプロパティを多くまたは少なく返せる、構造化された階層的なデータ型を作成します。
- Query と Mutation の [Resolvers](https://graphql.org/learn/execution/#root-fields-resolvers) を使用して、場合によっては RBAC ミドルウェアを用いながらアクセス制御検証を実施できます。
- 本番環境または公開アクセス可能な環境では、システム全体で[イントロスペクションクエリを無効化](https://lab.wallarm.com/why-and-how-to-disable-introspection-query-for-graphql-apis/)します。
- 本番環境または公開アクセス可能な環境では、[GraphiQL](https://github.com/graphql/graphiql) や同様のスキーマ探索ツールを無効化します。

#### 一般的なデータアクセス

GraphQL リクエストでは、オブジェクトを取得または変更するために、オブジェクトの直接 ID が一つ以上含まれることが一般的です。たとえば、特定の写真に対するリクエストには、その写真のデータベース上の主キーである ID が含まれる場合があります。他のリクエストと同様に、サーバーは呼び出し元が要求しているオブジェクトにアクセスできることを検証しなければなりません。しかし、開発者がオブジェクトの ID を持っていることは呼び出し元にアクセス権があることを意味すると誤って仮定する場合があります。

この場合にリクエスト元のアクセス権を検証しないことは、[Broken Object Level Authorization](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa1-broken-object-level-authorization.md)、別名 [IDOR](https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html) と呼ばれます。

GraphQL API が、意図していなくても ID を使ったオブジェクトへのアクセスをサポートしている可能性があります。Query オブジェクトに `node` または `nodes`、あるいはその両方のフィールドが存在することがあり、これらを使って `ID` によりオブジェクトへ直接アクセスできます。スキーマにこれらのフィールドがあるかどうかは、コマンドラインで次を実行して確認できます (`schema.json` に GraphQL スキーマが含まれていると仮定します): `cat schema.json | jq ".data.__schema.types[] | select(.name==\\"Query\\") | .fields[] | .name" | grep node`。

これらのフィールドをスキーマから削除すると機能は無効化されるはずですが、呼び出し元が要求しているオブジェクトにアクセスできることを検証するため、常に適切な認可チェックを適用すべきです。

#### クエリアクセス (データ取得)

GraphQL API の一部として、返却可能なさまざまなデータフィールドがあります。考慮すべきことの一つは、これらのフィールドに異なるアクセスレベルを設けるかどうかです。たとえば、すべての利用者がすべての利用可能フィールドを取得できるようにするのではなく、特定の利用者だけが特定のデータフィールドを取得できるようにしたい場合があります。これは、リクエスト元が取得しようとしているフィールドを読み取れるべきかどうかを確認するチェックをコードに追加することで実現できます。

#### ミューテーションアクセス (データ操作)

GraphQL は、最も一般的なユースケースであるデータ取得に加え、ミューテーション、つまりデータ操作をサポートしています。API がミューテーションを実装または許可する場合、どの利用者が API を通じてデータを変更できるかを制限するアクセス制御が必要になる場合があります。ミューテーションアクセス制御が必要な構成には、リクエスト元に読み取りアクセスのみを意図している API や、特定の当事者だけが特定フィールドを変更できるべき API が含まれます。

### バッチング攻撃

GraphQL は、[クエリバッチング](https://www.apollographql.com/blog/batching-client-graphql-queries-a685f5bcd41b/)とも呼ばれるリクエストのバッチ処理をサポートしています。これにより、呼び出し元は単一のネットワーク呼び出しで複数のクエリまたは複数のオブジェクトインスタンスに対するリクエストをバッチ処理できます。この仕組みは、[バッチング攻撃](https://lab.wallarm.com/graphql-batching-attack/)と呼ばれる攻撃を可能にします。これは GraphQL 固有のブルートフォース攻撃の一形態であり、通常、より高速で検知されにくい悪用を可能にします。クエリバッチングの最も一般的な方法は次のとおりです。

```javascript
[
  {
    query: < query 0 >,
    variables: < variables for query 0 >,
  },
  {
    query: < query 1 >,
    variables: < variables for query 1 >,
  },
  {
    query: < query n >
    variables: < variables for query n >,
  }
]
```text

単一のバッチ化された GraphQL 呼び出しで、`droid` オブジェクトの複数の異なるインスタンスを要求するクエリ例を次に示します。

```javascript
query {
  droid(id: "2000") {
    name
  }
  second:droid(id: "2001") {
    name
  }
  third:droid(id: "2002") {
    name
  }
}
```text

この場合、サーバーに保存されている可能性のあるすべての `droid` オブジェクトを、ごく少数のネットワークリクエストで列挙するために使用できます。標準的な REST API では、リクエスト元は要求したい異なる `droid` ID ごとに別々のネットワークリクエストを送信する必要があります。この種類の攻撃は、次の問題につながる可能性があります。

- アプリケーションレベルの DoS 攻撃 - 単一のネットワーク呼び出しに含まれる多数のクエリやオブジェクトリクエストにより、データベースがハングしたり、他の利用可能なリソース (メモリ、CPU、下流サービスなど) が枯渇したりする可能性があります。
- ユーザー、メールアドレス、ユーザー ID など、サーバー上のオブジェクトの列挙。
- パスワード、2 要素認証コード (OTP)、セッショントークン、その他の機密値のブルートフォース。
- WAF、RASP、IDS/IPS、SIEM、その他のセキュリティツールは、これらの攻撃が大量のネットワークトラフィックではなく単一のリクエストにしか見えないため、検知できない可能性が高いです。
- この攻撃は、Nginx やその他のプロキシ/ゲートウェイなどのツールにある既存のレート制限をバイパスする可能性が高いです。これらは生のリクエスト数を見ることに依存しているためです。

#### バッチング攻撃の緩和

この種類の攻撃を緩和するには、リクエストごとに適用できるよう、受信リクエストに対する制限をコードレベルに置くべきです。主な選択肢は三つあります。

- コード内でオブジェクトリクエストのレート制限を追加します。
- 機密オブジェクトに対するバッチングを防止します。
- 同時に実行できるクエリ数を制限します。

一つの選択肢は、呼び出し元が要求できるオブジェクト数に対してコードレベルのレート制限を作成することです。これは、バックエンドが呼び出し元が要求した異なるオブジェクトインスタンス数を追跡し、単一のネットワーク呼び出し内でオブジェクトリクエストをバッチ化していても、要求数が多すぎる場合にブロックすることを意味します。これは WAF などのツールが行うネットワークレベルのレート制限を再現するものです。

別の選択肢は、ユーザー名、メールアドレス、パスワード、OTP、セッショントークンなど、ブルートフォースされたくない機密オブジェクトに対するバッチングを防止することです。これにより、攻撃者は REST API のように、オブジェクトインスタンスごとに別々のネットワーク呼び出しを行わざるを得なくなります。これはネイティブにはサポートされていないため、カスタムソリューションが必要です。ただし、この制御が導入されると、他の標準的な制御が通常どおり機能し、ブルートフォースの防止に役立ちます。

バッチ化して同時に実行できる操作数を制限することも、DoS につながる GraphQL バッチング攻撃を緩和する別の選択肢です。ただし、これは万能策ではないため、他の方法と組み合わせて使用すべきです。

### セキュアな設定

デフォルトでは、ほとんどの GraphQL 実装には変更すべき安全でないデフォルト設定があります。

- 過剰なエラーメッセージを返さないようにします (スタックトレースとデバッグモードを無効にするなど)。
- 必要に応じて、イントロスペクションと GraphiQL を無効化または制限します。
- イントロスペクションが無効な場合の、入力ミスしたフィールドに対する候補提示

#### イントロスペクション + GraphiQL

GraphQL では多くの場合、イントロスペクションや GraphiQL がデフォルトで有効であり、認証を要求しません。これにより、API の利用者は API、スキーマ、ミューテーション、非推奨フィールド、場合によっては望ましくない「プライベートフィールド」についてすべて知ることができます。

API が外部クライアントに利用されるよう設計されている場合、これは意図した設定である可能性がありますが、API が内部専用に設計されている場合には問題にもなり得ます。隠ぺいによるセキュリティは推奨されませんが、漏えいを避けるためにイントロスペクションの削除を検討することはよい考えかもしれません。
API が公開利用される場合、認証されていない、または認可されていないユーザーに対して無効化することを検討してもよいでしょう。

内部 API では、最も簡単なアプローチはシステム全体でイントロスペクションを無効化することです。イントロスペクションを完全に無効化する方法については、[このページ](https://lab.wallarm.com/why-and-how-to-disable-introspection-query-for-graphql-apis/)を参照するか、GraphQL 実装のドキュメントを確認してください。実装がイントロスペクションの無効化をネイティブにサポートしていない場合、または一部の利用者/ロールにはこのアクセスを許可したい場合、承認済みの利用者だけがイントロスペクションシステムにアクセスできるよう、サービス内にフィルタを構築できます。

イントロスペクションが無効化されていても、攻撃者はブルートフォースによってフィールドを推測できることに注意してください。さらに GraphQL には、リクエスト元が指定したフィールド名が既存フィールドに似ている (ただし誤っている) 場合にヒントを返す組み込み機能があります (たとえば、リクエストに `usr` が含まれると、レスポンスで `Did you mean "user?"` と尋ねます)。イントロスペクションを無効化している場合、露出を減らすためにこの機能の無効化を検討すべきですが、すべての GraphQL 実装がそれをサポートしているわけではありません。[Shapeshifter](https://github.com/szski/shapeshifter) は、[これを実行できるはず](https://www.youtube.com/watch?v=NPDp7GHmMa0&t=2580)のツールの一つです。

_**イントロスペクションの無効化 - Java**_

```java
GraphQLSchema schema = GraphQLSchema.newSchema()
    .query(StarWarsSchema.queryType)
    .fieldVisibility( NoIntrospectionGraphqlFieldVisibility.NO_INTROSPECTION_FIELD_VISIBILITY )
    .build();
```text

_**イントロスペクションと GraphiQL の無効化 - JavaScript**_

```javascript
app.use('/graphql', graphqlHTTP({
  schema: MySessionAwareGraphQLSchema,
+ validationRules: [NoIntrospection]
  graphiql: process.env.NODE_ENV === 'development',
}));
```text

#### 過剰なエラーを返さない

本番環境の GraphQL API は、スタックトレースを返したりデバッグモードになっていたりすべきではありません。これを行う方法は実装固有ですが、サーバーが返すエラーをより適切に制御する一般的な方法の一つはミドルウェアを使用することです。Apollo Server で[過剰なエラーを無効化](https://www.apollographql.com/docs/apollo-server/data/errors/)するには、Apollo Server コンストラクタに `debug: false` を渡すか、`NODE_ENV` 環境変数を 'production' または 'test' に設定します。ただし、スタックトレースをユーザーには返さず内部的にログに記録したい場合は、エラーをマスクしてログに記録し、API の呼び出し元ではなく開発者が利用できるようにする方法について[こちら](https://www.apollographql.com/docs/apollo-server/data/errors/#masking-and-logging-errors)を参照してください。

## その他のリソース

### ツール

- [InQL Scanner](https://github.com/doyensec/inql) - GraphQL 用セキュリティスキャナ。指定されたスキーマからクエリとミューテーションを自動生成し、それをスキャナに渡す用途に特に有用です。
- [GraphiQL](https://github.com/graphql/graphiql) - スキーマ/オブジェクト探索
- [GraphQL Voyager](https://github.com/APIs-guru/graphql-voyager) - スキーマ/オブジェクト探索

### GraphQL セキュリティベストプラクティス + ドキュメント

- [Protecting GraphQL APIs from security threats - blog post](https://medium.com/swlh/protecting-your-graphql-api-from-security-vulnerabilities-e8afdfa6fbe4)
- [https://nordicapis.com/security-points-to-consider-before-implementing-graphql/]%28https://nordicapis.com/security-points-to-consider-before-implementing-graphql/)
- [Limiting resource usage to prevent DoS (timeouts, throttling, complexity management, depth limiting, etc.)](https://developer.github.com/v4/guides/resource-limitations/)
- [GraphQL Security Perspectives](https://www.abhaybhargav.com/from-the-trenches-diy-security-perspectives-of-graphql/)
- [A developer's security perspective of GraphQL](https://planes.studio/blog/how-to-survive-a-penetration-test-as-a-graph-ql-developer)

### GraphQL 攻撃に関する詳細

- [Some common GraphQL attacks + attacker mindset](https://blog.doyensec.com/2018/05/17/graphql-security-overview.html)
- [Bypassing permissions by smuggling parameters](https://labs.detectify.com/2018/03/14/graphql-abuse/)
- [Bug bounty writeup about GraphQL](https://medium.com/bugbountywriteup/graphql-voyager-as-a-tool-for-security-testing-86d3c634bcd9)
- [Security talk about Abusing GraphQL](https://www.youtube.com/watch?v=NPDp7GHmMa0)
- [Real](https://vulners.com/myhack58/MYHACK58:62201994269) [world](https://www.pentestpartners.com/security-blog/pwning-wordpress-graphql/) [attacks](https://hackerone.com/reports/419883) [against](https://vulners.com/hackerone/H1:435066) [GraphQL](https://www.jonbottarini.com/2018/01/02/abusing-internal-api-to-achieve-idor-in-new-relic/) [in the](https://about.gitlab.com/blog/2019/07/03/security-release-gitlab-12-dot-0-dot-3-released/#authorization-issues-in-graphql) past
- [Attack examples against GraphQL](https://raz0r.name/articles/looting-graphql-endpoints-for-fun-and-profit/)

</section>

<section id="graphql-bilingual-panel" className="tabPanel bilingualPanel">

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Introduction

[GraphQL](https://graphql.org) is an open source query language originally developed by Facebook that can be used to build APIs as an alternative to REST and SOAP. It has gained popularity since its inception in 2012 because of the native flexibility it offers to those building and calling the API. There are GraphQL servers and clients implemented in various languages. [Many companies](https://foundation.graphql.org/) use GraphQL including GitHub, Credit Karma, Intuit, and PayPal.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## はじめに

[GraphQL](https://graphql.org) は、もともと Facebook によって開発されたオープンソースのクエリ言語であり、REST や SOAP の代替として API を構築するために使用できます。API を構築する側と呼び出す側に本来備わった柔軟性を提供するため、2012 年の登場以来、人気を集めてきました。さまざまな言語で実装された GraphQL サーバーとクライアントがあります。GitHub、Credit Karma、Intuit、PayPal など、[多くの企業](https://foundation.graphql.org/)が GraphQL を使用しています。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

This Cheat Sheet provides guidance on the various areas that need to be considered when working with GraphQL:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

このチートシートでは、GraphQL を扱う際に考慮すべきさまざまな領域についてガイダンスを提供します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Apply proper [input validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html) checks on all incoming data.
- Expensive queries will lead to [Denial of Service (DoS)](https://cheatsheetseries.owasp.org/cheatsheets/Denial_of_Service_Cheat_Sheet.html), so add checks to limit or prevent queries that are too expensive.
- Ensure that the API has proper [access control](https://cheatsheetseries.owasp.org/cheatsheets/Access_Control_Cheat_Sheet.html) checks.
- Disable insecure default configurations (_e.g._ excessive errors, introspection, GraphiQL, etc.).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- すべての受信データに適切な[入力検証](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)チェックを適用します。
- 高コストなクエリは[サービス拒否 (DoS)](https://cheatsheetseries.owasp.org/cheatsheets/Denial_of_Service_Cheat_Sheet.html) につながるため、高コストすぎるクエリを制限または防止するチェックを追加します。
- API に適切な[アクセス制御](https://cheatsheetseries.owasp.org/cheatsheets/Access_Control_Cheat_Sheet.html)チェックがあることを確認します。
- 安全でないデフォルト設定 (過剰なエラー、イントロスペクション、GraphiQL など) を無効にします。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Common Attacks

- [Injection](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa8-injection.md) - this usually includes but is not limited to:
    - [SQL](https://owasp.org/www-community/attacks/SQL_Injection) and [NoSQL](https://www.netsparker.com/blog/web-security/what-is-nosql-injection/) injection
    - [OS Command injection](https://owasp.org/www-community/attacks/Command_Injection)
    - [SSRF](https://portswigger.net/web-security/ssrf) and [CRLF](https://owasp.org/www-community/vulnerabilities/CRLF_Injection) [injection](https://www.acunetix.com/websitesecurity/crlf-injection/)/[Request](https://portswigger.net/web-security/request-smuggling) [Smuggling](https://www.pentestpartners.com/security-blog/http-request-smuggling-a-how-to/)
- [DoS](https://owasp.org/www-community/attacks/Denial_of_Service) ([Denial of Service](https://www.cloudflare.com/learning/ddos/glossary/denial-of-service/))
- Abuse of broken authorization: either [improper](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa1-broken-object-level-authorization.md) or [excessive](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa3-excessive-data-exposure.md) access, including [IDOR](https://portswigger.net/web-security/access-control/idor)
- Batching Attacks, a GraphQL-specific method of brute force attack
- Abuse of insecure default configurations

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 一般的な攻撃

- [インジェクション](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa8-injection.md) - 通常、以下を含みますが、これらに限定されません。
    - [SQL](https://owasp.org/www-community/attacks/SQL_Injection) および [NoSQL](https://www.netsparker.com/blog/web-security/what-is-nosql-injection/) インジェクション
    - [OS コマンドインジェクション](https://owasp.org/www-community/attacks/Command_Injection)
    - [SSRF](https://portswigger.net/web-security/ssrf) および [CRLF](https://owasp.org/www-community/vulnerabilities/CRLF_Injection) [インジェクション](https://www.acunetix.com/websitesecurity/crlf-injection/)/[リクエスト](https://portswigger.net/web-security/request-smuggling)[スマグリング](https://www.pentestpartners.com/security-blog/http-request-smuggling-a-how-to/)
- [DoS](https://owasp.org/www-community/attacks/Denial_of_Service) ([サービス拒否](https://www.cloudflare.com/learning/ddos/glossary/denial-of-service/))
- 壊れた認可の悪用: [不適切な](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa1-broken-object-level-authorization.md)アクセスまたは[過剰な](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa3-excessive-data-exposure.md)アクセス。これには [IDOR](https://portswigger.net/web-security/access-control/idor) が含まれます。
- バッチング攻撃。GraphQL 固有のブルートフォース攻撃手法です。
- 安全でないデフォルト設定の悪用

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Best Practices and Recommendations

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## ベストプラクティスと推奨事項

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Input Validation

Adding strict input validation can help prevent against injection and DoS. The main design for GraphQL is that the user supplies one or more identifiers and the backend has a number of data fetchers making HTTP, DB, or other calls using the given identifiers. This means that user input will be included in HTTP requests, DB queries, or other requests/calls which provides opportunity for injection that could lead to various injection attacks or DoS.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 入力検証

厳格な入力検証を追加すると、インジェクションと DoS の防止に役立ちます。GraphQL の主な設計では、ユーザーが一つ以上の識別子を提供し、バックエンドには指定された識別子を使って HTTP、DB、その他の呼び出しを行う多数のデータフェッチャがあります。つまり、ユーザー入力は HTTP リクエスト、DB クエリ、その他のリクエストや呼び出しに含まれます。そのため、さまざまなインジェクション攻撃や DoS につながる可能性のあるインジェクションの機会が生まれます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

See the OWASP Cheat Sheets on [Input Validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html) and general [injection prevention](https://cheatsheetseries.owasp.org/cheatsheets/Injection_Prevention_Cheat_Sheet.html) for full details to best perform input validation and prevent injection.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

入力検証を適切に実施し、インジェクションを防止するための詳細については、OWASP チートシートの[入力検証](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)と一般的な[インジェクション防止](https://cheatsheetseries.owasp.org/cheatsheets/Injection_Prevention_Cheat_Sheet.html)を参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### General Practices

Validate all incoming data to only allow valid values (i.e. allowlist).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 一般的なプラクティス

すべての受信データを検証し、有効な値のみを許可します (つまり許可リスト)。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Use specific GraphQL [data types](https://graphql.org/learn/schema/#type-language) such as [scalars](https://graphql.org/learn/schema/#scalar-types) or [enums](https://graphql.org/learn/schema/#enumeration-types). Write custom GraphQL [validators](https://graphql.org/learn/validation/) for more complex validations. [Custom scalars](https://itnext.io/custom-scalars-in-graphql-9c26f43133f3) may also come in handy.
- Define [schemas for mutations input](https://graphql.org/learn/schema/#input-types).
- [List allowed characters](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html#allow-list-vs-block-list) - don't use a denylist
    - The stricter the list of allowed characters the better. A lot of times a good starting point is only allowing alphanumeric, non-unicode characters because it will disallow many attacks.
- To properly handle unicode input, use a [single internal character encoding](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html#validating-free-form-unicode-text)
- Gracefully [reject invalid input](https://cheatsheetseries.owasp.org/cheatsheets/Error_Handling_Cheat_Sheet.html), being careful not to reveal excessive information about how the API and its validation works.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- [スカラー](https://graphql.org/learn/schema/#scalar-types)や[列挙型](https://graphql.org/learn/schema/#enumeration-types)など、具体的な GraphQL [データ型](https://graphql.org/learn/schema/#type-language)を使用します。より複雑な検証には、カスタム GraphQL [バリデータ](https://graphql.org/learn/validation/)を記述します。[カスタムスカラー](https://itnext.io/custom-scalars-in-graphql-9c26f43133f3)も役立つ場合があります。
- [ミューテーション入力のスキーマ](https://graphql.org/learn/schema/#input-types)を定義します。
- [許可する文字を列挙](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html#allow-list-vs-block-list)します。拒否リストは使用しません。
    - 許可文字のリストは厳格であるほどよいです。多くの場合、英数字かつ非 Unicode 文字のみを許可することがよい出発点になります。これは多くの攻撃を拒否できるためです。
- Unicode 入力を適切に処理するには、[単一の内部文字エンコーディング](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html#validating-free-form-unicode-text)を使用します。
- API とその検証の仕組みに関する過剰な情報を明かさないよう注意しながら、無効な入力を適切に[拒否](https://cheatsheetseries.owasp.org/cheatsheets/Error_Handling_Cheat_Sheet.html)します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Injection Prevention

When handling input meant to be passed to another interpreter (_e.g._ SQL/NoSQL/ORM, OS, LDAP, XML):

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### インジェクション防止

別のインタープリタ (SQL/NoSQL/ORM、OS、LDAP、XML など) に渡すことを意図した入力を扱う場合:

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Always choose libraries/modules/packages offering safe APIs, such as parameterized statements.
    - Ensure that you follow the documentation so you are properly using the tool
    - Using ORMs and ODMs are a good option but they must be used properly to avoid flaws such as [ORM injection](https://owasp.org/www-project-web-security-testing-guide/stable/4-Web_Application_Security_Testing/07-Input_Validation_Testing/05.7-Testing_for_ORM_Injection).
- If such tools are not available, always escape/encode input data according to best practices of the target interpreter
    - Choose a well-documented and actively maintained escaping/encoding library. Many languages and frameworks have this functionality built-in.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- パラメータ化ステートメントなど、安全な API を提供するライブラリ、モジュール、パッケージを常に選択します。
    - ツールを適切に使用できるよう、ドキュメントに従っていることを確認します。
    - ORM や ODM の使用はよい選択肢ですが、[ORM インジェクション](https://owasp.org/www-project-web-security-testing-guide/stable/4-Web_Application_Security_Testing/07-Input_Validation_Testing/05.7-Testing_for_ORM_Injection)などの欠陥を避けるには適切に使用しなければなりません。
- そのようなツールが利用できない場合は、対象インタープリタのベストプラクティスに従って、常に入力データをエスケープまたはエンコードします。
    - 十分に文書化され、積極的に保守されているエスケープ/エンコードライブラリを選択します。多くの言語やフレームワークでは、この機能が組み込まれています。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

For more information see the below pages:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

詳細については、以下のページを参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- [SQL Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)
- [NoSQL Injection Prevention](https://www.netsparker.com/blog/web-security/what-is-nosql-injection/)
- [LDAP Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/LDAP_Injection_Prevention_Cheat_Sheet.html)
- [OS Command Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/OS_Command_Injection_Defense_Cheat_Sheet.html)
- [XML Security](https://cheatsheetseries.owasp.org/cheatsheets/XML_Security_Cheat_Sheet.html) and [XXE Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/XML_External_Entity_Prevention_Cheat_Sheet.html)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- [SQL Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)
- [NoSQL Injection Prevention](https://www.netsparker.com/blog/web-security/what-is-nosql-injection/)
- [LDAP Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/LDAP_Injection_Prevention_Cheat_Sheet.html)
- [OS Command Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/OS_Command_Injection_Defense_Cheat_Sheet.html)
- [XML Security](https://cheatsheetseries.owasp.org/cheatsheets/XML_Security_Cheat_Sheet.html) および [XXE Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/XML_External_Entity_Prevention_Cheat_Sheet.html)

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Process Validation

When using user input, even if sanitized and/or validated, it should not be used for certain purposes that would give a user control over data flow. For example, do not make an HTTP/resource request to a host that the user supplies (unless there is an absolute business need).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### プロセス検証

ユーザー入力を使用する場合、サニタイズまたは検証済みであっても、ユーザーがデータフローを制御できるようになる特定の目的には使用すべきではありません。たとえば、ユーザーが指定したホストに HTTP/リソースリクエストを行ってはいけません (絶対的なビジネス上の必要性がある場合を除きます)。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### DoS Prevention

DoS is an attack against the availability and stability of the API that can make it slow, unresponsive, or completely unavailable. This CS details several methods to limit the possibility of a DoS attack at the application level and other layers of the tech stack. There is also a CS dedicated to the topic of [DoS](https://cheatsheetseries.owasp.org/cheatsheets/Denial_of_Service_Cheat_Sheet.html).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### DoS 防止

DoS は API の可用性と安定性に対する攻撃であり、API を低速化、無応答化、または完全に利用不能にする可能性があります。このチートシートでは、アプリケーションレベルおよび技術スタックの他の層で DoS 攻撃の可能性を制限するいくつかの方法を詳述します。DoS というトピック専用の[チートシート](https://cheatsheetseries.owasp.org/cheatsheets/Denial_of_Service_Cheat_Sheet.html)もあります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Here are recommendations specific to GraphQL to limit the potential for DoS:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

GraphQL に固有の、DoS の可能性を制限するための推奨事項は次のとおりです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Add depth limiting to incoming queries
- Add amount limiting to incoming queries
- Add [pagination](https://graphql.org/learn/pagination/) to limit the amount of data that can be returned in a single response
- Add reasonable timeouts at the application layer, infrastructure layer, or both
- Consider performing query cost analysis and enforcing a maximum allowed cost per query
- Enforce rate limiting on incoming requests per IP or user (or both) to prevent basic DoS attacks
- Implement the [batching and caching technique](https://graphql.org/learn/best-practices/#server-side-batching-caching) on the server-side (Facebook's [DataLoader](https://github.com/facebook/dataloader) can be used for this)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- 受信クエリに深さ制限を追加します。
- 受信クエリに件数制限を追加します。
- 単一レスポンスで返せるデータ量を制限するために[ページネーション](https://graphql.org/learn/pagination/)を追加します。
- アプリケーション層、インフラストラクチャ層、またはその両方に合理的なタイムアウトを追加します。
- クエリコスト分析を実施し、クエリごとの最大許容コストを強制することを検討します。
- 基本的な DoS 攻撃を防止するために、IP またはユーザー (またはその両方) ごとに受信リクエストのレート制限を強制します。
- サーバー側で[バッチングとキャッシュ技法](https://graphql.org/learn/thinking-in-graphs/#batching-and-caching)を実装します (Facebook の [DataLoader](https://github.com/graphql/dataloader) を使用できます)。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Query Limiting (Depth & Amount)

In GraphQL each query has a depth (_e.g._ nested objects) and each object requested in a query can have an amount specified (_e.g._ 99999999 of an object). By default these can both be unlimited which may lead to a DoS. You should set limits on depth and amount to prevent DoS, but this usually requires a small custom implementation as it is not natively supported by GraphQL. See [this](https://www.apollographql.com/blog/securing-your-graphql-api-from-malicious-queries-16130a324a6b) and [this](https://www.howtographql.com/advanced/4-security/) page for more information about these attacks and how to add depth and amount limiting. Adding [pagination](https://graphql.org/learn/pagination/) can also help performance.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### クエリ制限 (深さと件数)

GraphQL では各クエリに深さ (ネストされたオブジェクトなど) があり、クエリで要求される各オブジェクトには件数 (あるオブジェクトを 99999999 件など) を指定できます。デフォルトでは、これらはいずれも無制限になり得るため、DoS につながる可能性があります。DoS を防止するには深さと件数に制限を設定すべきですが、GraphQL ではネイティブにサポートされていないため、通常は小さなカスタム実装が必要です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

APIs using graphql-java can utilize the built-in [MaxQueryDepthInstrumentation](https://github.com/graphql-java/graphql-java/blob/master/src/main/java/graphql/analysis/MaxQueryDepthInstrumentation.java) for depth limiting. APIs using JavaScript can use [graphql-depth-limit](https://www.npmjs.com/package/graphql-depth-limit) to implement depth limiting and [graphql-input-number](https://github.com/joonhocho/graphql-input-number) to implement amount limiting.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

これらの攻撃と深さおよび件数制限の追加方法の詳細については、[こちら](https://www.apollographql.com/blog/securing-your-graphql-api-from-malicious-queries/)と[こちら](https://www.howtographql.com/advanced/4-security/)のページを参照してください。[ページネーション](https://graphql.org/learn/pagination/)を追加することもパフォーマンスに役立ちます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Here is an example of a GraphQL query with depth N:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

graphql-java を使用する API は、組み込みの [MaxQueryDepthInstrumentation](https://github.com/graphql-java/graphql-java/blob/master/src/main/java/graphql/analysis/MaxQueryDepthInstrumentation.java) を深さ制限に利用できます。JavaScript を使用する API は、深さ制限の実装に [graphql-depth-limit](https://www.npmjs.com/package/graphql-depth-limit)、件数制限の実装に [graphql-input-number](https://github.com/4Catalyzer/graphql-input-number) を使用できます。

深さ N の GraphQL クエリの例を次に示します。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```javascript
query evil {            # Depth: 0
  album(id: 42) {       # Depth: 1
    songs {             # Depth: 2
      album {           # Depth: 3
        ...             # Depth: ...
        album {id: N}   # Depth: N
      }
    }
  }
}
```text

```graphql
query evil {            # Depth: 0
  album(id: 42) {       # Depth: 1
    songs {             # Depth: 2
      album {           # Depth: 3
        ...             # Depth: ...
        album {id: N}   # Depth: N
      }
    }
  }
}
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Here is an example of a GraphQL query requesting 99999999 of an object:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

オブジェクトを 99999999 件要求する GraphQL クエリの例を次に示します。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```javascript
query {
  author(id: "abc") {
    posts(first: 99999999) {
      title
    }
  }
}
```text

```graphql
query {
  author(id: "abc") {
    posts(first: 99999999) {
      title
    }
  }
}
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Timeouts

Adding timeouts can be a simple way to limit how many resources any single request can consume. But timeouts are not always effective since they may not activate until a malicious query has already consumed excessive resources. Timeout requirements will differ by API and data fetching mechanism; there isn't one timeout value that will work across the board.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### タイムアウト

タイムアウトを追加することは、単一リクエストが消費できるリソース量を制限する簡単な方法になり得ます。ただし、悪意のあるクエリがすでに過剰なリソースを消費した後でないとタイムアウトが発動しない場合があるため、常に有効とは限りません。タイムアウト要件は API とデータ取得メカニズムによって異なり、全体に適用できる単一のタイムアウト値はありません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

At the application level, timeouts can be added for queries and resolver functions. This option is usually more effective since the query/resolution can be stopped once the timeout is reached. GraphQL does not natively support query timeouts so custom code is required. See [this blog post](https://medium.com/workflowgen/graphql-query-timeout-and-complexity-management-fab4d7315d8d) for more about using timeouts with GraphQL or the two examples below.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

アプリケーションレベルでは、クエリとリゾルバ関数にタイムアウトを追加できます。この選択肢は、タイムアウトに達した時点でクエリ/解決処理を停止できるため、通常はより効果的です。GraphQL はクエリタイムアウトをネイティブにサポートしていないため、カスタムコードが必要です。GraphQL でタイムアウトを使用する方法の詳細については、[このブログ記事](https://medium.com/@leeb/graphql-query-timeout-5f059ac29b67)または以下の二つの例を参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

_**JavaScript Timeout Example**_

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

JavaScript タイムアウト例

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Code snippet from [this SO answer](https://stackoverflow.com/a/53277955/1200388):

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

[この Stack Overflow の回答](https://stackoverflow.com/questions/36241655/graphql-js-limit-query-execution-time/36251150)からのコードスニペット:

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```javascript
request.incrementResolverCount =  function () {
    var runTime = Date.now() - startTime;
    if (runTime > 10000) {  // a timeout of 10 seconds
      if (request.logTimeoutError) {
        logger('ERROR', `Request ${request.uuid} query execution timeout`);
      }
      request.logTimeoutError = false;
      throw 'Query execution has timeout. Field resolution aborted';
    }
    this.resolverCount++;
  };
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

_**Java Timeout Example using [Instrumentation](https://www.graphql-java.com/documentation/instrumentation)**_

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

[Instrumentation](https://www.graphql-java.com/documentation/instrumentation/) を使用した Java タイムアウト例

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```java
public class TimeoutInstrumentation extends SimpleInstrumentation {
    @Override
    public DataFetcher<?> instrumentDataFetcher(
            DataFetcher<?> dataFetcher, InstrumentationFieldFetchParameters parameters
    ) {
        return environment ->
            Observable.fromCallable(() -> dataFetcher.get(environment))
                .subscribeOn(Schedulers.computation())
                .timeout(10, TimeUnit.SECONDS)  // timeout of 10 seconds
                .blockingFirst();
    }
}
```text

```java
public class TimeoutInstrumentation extends SimpleInstrumentation {
    @Override
    public DataFetcher<?> instrumentDataFetcher(
            DataFetcher<?> dataFetcher, InstrumentationFieldFetchParameters parameters
    ) {
        return environment ->
            Observable.fromCallable(() -> dataFetcher.get(environment))
                .subscribeOn(Schedulers.computation())
                .timeout(10, TimeUnit.SECONDS)  // timeout of 10 seconds
                .blockingFirst();
    }
}
```bash

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

_**Infrastructure Timeout**_

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

インフラストラクチャタイムアウト

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Another option to add a timeout that is usually easier is adding a timeout on an HTTP server ([Apache/httpd](https://httpd.apache.org/docs/2.4/mod/core.html#timeout), [nginx](http://nginx.org/en/docs/http/ngx_http_core_module.html#send_timeout)), reverse proxy, or load balancer. However, infrastructure timeouts are often inaccurate and can be bypassed more easily than application-level ones.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

通常より簡単な、タイムアウトを追加する別の選択肢は、HTTP サーバー ([Apache/httpd](https://httpd.apache.org/)、[nginx](https://nginx.org/))、リバースプロキシ、またはロードバランサーにタイムアウトを追加することです。ただし、インフラストラクチャのタイムアウトは不正確であることが多く、アプリケーションレベルのものより容易にバイパスされる可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Query Cost Analysis

Query cost analysis involves assigning costs to the resolution of fields or types in incoming queries so that the server can reject queries that cost too much to run or will consume too many resources. This is not easy to implement and may not always be necessary but it is the most thorough approach to preventing DoS. See "Query Cost Analysis" in [this blog post](https://www.apollographql.com/blog/securing-your-graphql-api-from-malicious-queries-16130a324a6b) for more details on implementing this control.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### クエリコスト分析

クエリコスト分析では、受信クエリ内のフィールドや型の解決にコストを割り当てます。これにより、実行コストが高すぎる、またはリソースを過剰に消費するクエリをサーバーが拒否できます。実装は容易ではなく、常に必要とは限りませんが、DoS を防止するための最も徹底したアプローチです。この制御の実装の詳細については、[このブログ記事](https://www.apollographql.com/blog/securing-your-graphql-api-from-malicious-queries/)の「Query Cost Analysis」を参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Apollo recommends:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Apollo は次のように推奨しています。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

> **Before you go ahead and spend a ton of time implementing query cost analysis be certain you need it.** Try to crash or slow down your staging API with a nasty query and see how far you get — maybe your API doesn’t have these kinds of nested relationships, or maybe it can handle fetching thousands of records at a time perfectly fine and doesn’t need query cost analysis!

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

> クエリコスト分析の実装に多大な時間を費やす前に、それが本当に必要であることを確認してください。悪質なクエリでステージング API をクラッシュさせたり遅くしたりできるか試して、どこまでできるか確認してください。もしかすると、その API にはこうしたネスト関係がないかもしれませんし、一度に数千件のレコードを問題なく取得でき、クエリコスト分析を必要としないかもしれません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

APIs using graphql-java can utilize the built-in [MaxQueryComplexityInstrumentationto](https://github.com/graphql-java/graphql-java/blob/master/src/main/java/graphql/analysis/MaxQueryComplexityInstrumentation.java) to enforce max query complexity. APIs using JavaScript can utilize [graphql-cost-analysis](https://github.com/pa-bru/graphql-cost-analysis) or [graphql-validation-complexity](https://github.com/4Catalyzer/graphql-validation-complexity) to enforce max query cost.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

graphql-java を使用する API は、最大クエリ複雑度を強制するために組み込みの [MaxQueryComplexityInstrumentation](https://github.com/graphql-java/graphql-java/blob/master/src/main/java/graphql/analysis/MaxQueryComplexityInstrumentation.java) を利用できます。JavaScript を使用する API は、最大クエリコストを強制するために [graphql-cost-analysis](https://github.com/pa-bru/graphql-cost-analysis) または [graphql-validation-complexity](https://github.com/4Catalyzer/graphql-validation-complexity) を利用できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Rate Limiting

Enforcing rate limiting on a per IP or user (for anonymous and unauthorized access) basis can help limit a single user's ability to spam requests to the service and impact performance. Ideally this can be done with a WAF, API gateway, or web server ([Nginx](https://www.nginx.com/blog/rate-limiting-nginx/), [Apache](https://httpd.apache.org/docs/2.4/mod/mod_ratelimit.html)/[HTTPD](https://github.com/jzdziarski/mod_evasive)) to reduce the effort of adding rate limiting.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### レート制限

IP またはユーザー単位 (匿名アクセスおよび未認可アクセスの場合) でレート制限を強制すると、単一ユーザーがサービスにリクエストを大量送信してパフォーマンスに影響を与える能力を制限できます。理想的には、WAF、API ゲートウェイ、または Web サーバー ([Nginx](https://www.nginx.com/)、[Apache](https://httpd.apache.org/)/[HTTPD](https://github.com/apache/httpd)) で実施し、レート制限追加の手間を減らします。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Or you could get somewhat complex with throttling and implement it in your code (non-trivial). See "Throttling" [here](https://www.howtographql.com/advanced/4-security/) for more about GraphQL-specific rate limiting.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

または、多少複雑になりますが、スロットリングをコード内に実装することもできます (容易ではありません)。GraphQL 固有のレート制限の詳細については、[こちら](https://www.howtographql.com/advanced/4-security/)の「Throttling」を参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Server-side Batching and Caching

To increase efficiency of a GraphQL API and reduce its resource consumption, [the batching and caching technique](https://graphql.org/learn/best-practices/#server-side-batching-caching) can be used to prevent making duplicate requests for pieces of data within a small time frame. Facebook's [DataLoader](https://github.com/facebook/dataloader) tool is one way to implement this.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### サーバー側バッチングとキャッシュ

GraphQL API の効率を高め、リソース消費を削減するため、[バッチングとキャッシュ技法](https://graphql.org/learn/thinking-in-graphs/#batching-and-caching)を使用して、短い時間枠内で同じデータ片に対する重複リクエストを防止できます。Facebook の [DataLoader](https://github.com/graphql/dataloader) は、これを実装する方法の一つです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### System Resource Management

Not properly limiting the amount of resources your API can use (_e.g._ CPU or memory), may compromise your API responsiveness and availability, leaving it vulnerable to DoS attacks. Some limiting can be done at the operating system level.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### システムリソース管理

API が使用できるリソース量 (CPU やメモリなど) を適切に制限しないと、API の応答性と可用性が損なわれ、DoS 攻撃に対して脆弱になります。一部の制限はオペレーティングシステムレベルで実施できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

On Linux, a combination of [Control Groups(cgroups)](https://en.wikipedia.org/wiki/Cgroups), [User Limits (ulimits)](https://linuxhint.com/linux_ulimit_command/), and [Linux Containers (LXC)](https://linuxcontainers.org/lxc/security/) can be used.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Linux では、[Control Groups (cgroups)](https://en.wikipedia.org/wiki/Cgroups)、[User Limits (ulimits)](https://linuxhint.com/linux_ulimit_command/)、[Linux Containers (LXC)](https://linuxcontainers.org/) の組み合わせを使用できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

However, containerization platforms tend to make this task much easier. See the resource limiting section in the [Docker Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html#rule-7-limit-resources-memory-cpu-file-descriptors-processes-restarts) for how to prevent DoS when using containers.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

ただし、コンテナ化プラットフォームはこの作業をはるかに容易にする傾向があります。コンテナ使用時に DoS を防止する方法については、[Docker Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html) のリソース制限セクションを参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Access Control

To ensure that a GraphQL API has proper access control, do the following:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### アクセス制御

GraphQL API に適切なアクセス制御があることを確認するには、次を実施します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Always validate that the requester is authorized to view or mutate/modify the data they are requesting. This can be done with [RBAC](https://cheatsheetseries.owasp.org/cheatsheets/Access_Control_Cheat_Sheet.html#role-based-access-control-rbac) or other access control mechanisms.
    - This will prevent [IDOR](https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html) issues, including both [BOLA](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa1-broken-object-level-authorization.md) and [BFLA](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa5-broken-function-level-authorization.md).
- Enforce authorization checks on both edges and nodes (see example [bug report](https://hackerone.com/reports/489146) where nodes did not have authorization checks but edges did).
- Use [Interfaces](https://graphql.org/learn/schema/#interfaces) and [Unions](https://graphql.org/learn/schema/#union-types) to create structured, hierarchical data types which can be used to return more or fewer object properties, according to requester permissions.
- Query and Mutation [Resolvers](https://graphql.org/learn/execution/#root-fields-resolvers) can be used to perform access control validation, possibly using some RBAC middleware.
- [Disable introspection queries](https://lab.wallarm.com/why-and-how-to-disable-introspection-query-for-graphql-apis/) system-wide in any production or publicly accessible environments.
- Disable [GraphiQL](https://github.com/graphql/graphiql) and other similar schema exploration tools in production or publicly accessible environments.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- リクエスト元が、要求しているデータを閲覧またはミューテーション/変更する権限を持つことを常に検証します。これは [RBAC](https://en.wikipedia.org/wiki/Role-based_access_control) または他のアクセス制御メカニズムで実施できます。
    - これにより、[BOLA](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa1-broken-object-level-authorization.md) と [BFLA](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa5-broken-function-level-authorization.md) の両方を含む [IDOR](https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html) の問題を防止できます。
- エッジとノードの両方で認可チェックを強制します (ノードには認可チェックがなかったがエッジにはあった[バグ報告の例](https://hackerone.com/reports/489146)を参照)。
- [Interfaces](https://graphql.org/learn/schema/#interfaces) と [Unions](https://graphql.org/learn/schema/#union-types) を使用して、リクエスト元の権限に応じてオブジェクトプロパティを多くまたは少なく返せる、構造化された階層的なデータ型を作成します。
- Query と Mutation の [Resolvers](https://graphql.org/learn/execution/#root-fields-resolvers) を使用して、場合によっては RBAC ミドルウェアを用いながらアクセス制御検証を実施できます。
- 本番環境または公開アクセス可能な環境では、システム全体で[イントロスペクションクエリを無効化](https://lab.wallarm.com/why-and-how-to-disable-introspection-query-for-graphql-apis/)します。
- 本番環境または公開アクセス可能な環境では、[GraphiQL](https://github.com/graphql/graphiql) や同様のスキーマ探索ツールを無効化します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### General Data Access

It's commonplace for GraphQL requests to include one or more direct IDs of objects in order to fetch or modify them. For example, a request for a certain picture may include the ID that is actually the primary key in the database for that picture. As with any request, the server must verify that the caller has access to the object they are requesting. But sometimes developers make the mistake of assuming that possession of the object's ID means the caller should have access. Failure to verify the requester's access in this case is called [Broken Object Level Authentication](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa1-broken-object-level-authorization.md), also known as [IDOR](https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 一般的なデータアクセス

GraphQL リクエストでは、オブジェクトを取得または変更するために、オブジェクトの直接 ID が一つ以上含まれることが一般的です。たとえば、特定の写真に対するリクエストには、その写真のデータベース上の主キーである ID が含まれる場合があります。他のリクエストと同様に、サーバーは呼び出し元が要求しているオブジェクトにアクセスできることを検証しなければなりません。しかし、開発者がオブジェクトの ID を持っていることは呼び出し元にアクセス権があることを意味すると誤って仮定する場合があります。

この場合にリクエスト元のアクセス権を検証しないことは、[Broken Object Level Authorization](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa1-broken-object-level-authorization.md)、別名 [IDOR](https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html) と呼ばれます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

It's possible for a GraphQL API to support access to objects using their ID even if that is not intended. Sometimes there are `node` or `nodes` or both fields in a query object, and these can be used to access objects directly by `ID`. You can check whether your schema has these fields by running this on the command-line (assuming that `schema.json` contains your GraphQL schema): `cat schema.json | jq ".data.__schema.types[] | select(.name==\\"Query\\") | .fields[] | .name" | grep node`. Removing these fields from the schema should disable the functionality, but you should always apply proper authorization checks to verify the caller has access to the object they are requesting.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

GraphQL API が、意図していなくても ID を使ったオブジェクトへのアクセスをサポートしている可能性があります。Query オブジェクトに `node` または `nodes`、あるいはその両方のフィールドが存在することがあり、これらを使って `ID` によりオブジェクトへ直接アクセスできます。スキーマにこれらのフィールドがあるかどうかは、コマンドラインで次を実行して確認できます (`schema.json` に GraphQL スキーマが含まれていると仮定します): `cat schema.json | jq ".data.__schema.types[] | select(.name==\\"Query\\") | .fields[] | .name" | grep node`。

これらのフィールドをスキーマから削除すると機能は無効化されるはずですが、呼び出し元が要求しているオブジェクトにアクセスできることを検証するため、常に適切な認可チェックを適用すべきです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Query Access (Data Fetching)

As part of a GraphQL API there will be various data fields that can be returned. One thing to consider is if you want different levels of access around these fields. For example, you may only want certain consumers to be able to fetch certain data fields rather than allowing all consumers to be able to retrieve all available fields. This can be done by adding a check in the code to ensure that the requester should be able to read a field they are trying to fetch.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### クエリアクセス (データ取得)

GraphQL API の一部として、返却可能なさまざまなデータフィールドがあります。考慮すべきことの一つは、これらのフィールドに異なるアクセスレベルを設けるかどうかです。たとえば、すべての利用者がすべての利用可能フィールドを取得できるようにするのではなく、特定の利用者だけが特定のデータフィールドを取得できるようにしたい場合があります。これは、リクエスト元が取得しようとしているフィールドを読み取れるべきかどうかを確認するチェックをコードに追加することで実現できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Mutation Access (Data Manipulation)

GraphQL supports mutation, or manipulation of data, in addition to its most common use case of data fetching. If an API implements/allows mutation then there may need to be access controls put in place to restrict which consumers, if any, can modify data through the API. Setups that require mutation access control would include APIs where only read access is intended for requesters or where only certain parties should be able to modify certain fields.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### ミューテーションアクセス (データ操作)

GraphQL は、最も一般的なユースケースであるデータ取得に加え、ミューテーション、つまりデータ操作をサポートしています。API がミューテーションを実装または許可する場合、どの利用者が API を通じてデータを変更できるかを制限するアクセス制御が必要になる場合があります。ミューテーションアクセス制御が必要な構成には、リクエスト元に読み取りアクセスのみを意図している API や、特定の当事者だけが特定フィールドを変更できるべき API が含まれます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Batching Attacks

GraphQL supports batching requests, also known as [query batching](https://www.apollographql.com/blog/query-batching-in-apollo-63acfd859862/). This lets callers to either batch multiple queries or batch requests for multiple object instances in a single network call, which allows for what is called a [batching attack](https://lab.wallarm.com/graphql-batching-attack/). This is a form of brute force attack, specific to GraphQL, that usually allows for faster and less detectable exploits. Here is the most common way to do query batching:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### バッチング攻撃

GraphQL は、[クエリバッチング](https://www.apollographql.com/blog/batching-client-graphql-queries-a685f5bcd41b/)とも呼ばれるリクエストのバッチ処理をサポートしています。これにより、呼び出し元は単一のネットワーク呼び出しで複数のクエリまたは複数のオブジェクトインスタンスに対するリクエストをバッチ処理できます。この仕組みは、[バッチング攻撃](https://lab.wallarm.com/graphql-batching-attack/)と呼ばれる攻撃を可能にします。これは GraphQL 固有のブルートフォース攻撃の一形態であり、通常、より高速で検知されにくい悪用を可能にします。クエリバッチングの最も一般的な方法は次のとおりです。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```javascript
[
  {
    query: < query 0 >,
    variables: < variables for query 0 >,
  },
  {
    query: < query 1 >,
    variables: < variables for query 1 >,
  },
  {
    query: < query n >
    variables: < variables for query n >,
  }
]
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

And here is an example query of a single batched GraphQL call requesting multiple different instances of the `droid` object:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

単一のバッチ化された GraphQL 呼び出しで、`droid` オブジェクトの複数の異なるインスタンスを要求するクエリ例を次に示します。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```javascript
query {
  droid(id: "2000") {
    name
  }
  second:droid(id: "2001") {
    name
  }
  third:droid(id: "2002") {
    name
  }
}
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

In this case it could be used to enumerate every possible `droid` object that is stored on the server in very few network requests as opposed to a standard REST API where the requester would need to submit a different network request for every different `droid` ID they want to request. This type of attack can lead to the following issues:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

この場合、サーバーに保存されている可能性のあるすべての `droid` オブジェクトを、ごく少数のネットワークリクエストで列挙するために使用できます。標準的な REST API では、リクエスト元は要求したい異なる `droid` ID ごとに別々のネットワークリクエストを送信する必要があります。この種類の攻撃は、次の問題につながる可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Application-level DoS attacks - A high number of queries or object requests in a single network call could cause a database to hang or exhaust other available resources (_e.g._ memory, CPU, downstream services).
- Enumeration of objects on the server, such as users, emails, and user IDs.
- Brute forcing passwords, 2 factor authentication codes (OTPs), session tokens, or other sensitive values.
- WAFs, RASPs, IDS/IPS, SIEMs, or other security tooling will likely not detect these attacks since they only appear to be one single request rather than an a massive amount of network traffic.
- This attack will likely bypass existing rate limits in tools like Nginx or other proxies/gateways since they rely on looking at the raw number of requests.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- アプリケーションレベルの DoS 攻撃 - 単一のネットワーク呼び出しに含まれる多数のクエリやオブジェクトリクエストにより、データベースがハングしたり、他の利用可能なリソース (メモリ、CPU、下流サービスなど) が枯渇したりする可能性があります。
- ユーザー、メールアドレス、ユーザー ID など、サーバー上のオブジェクトの列挙。
- パスワード、2 要素認証コード (OTP)、セッショントークン、その他の機密値のブルートフォース。
- WAF、RASP、IDS/IPS、SIEM、その他のセキュリティツールは、これらの攻撃が大量のネットワークトラフィックではなく単一のリクエストにしか見えないため、検知できない可能性が高いです。
- この攻撃は、Nginx やその他のプロキシ/ゲートウェイなどのツールにある既存のレート制限をバイパスする可能性が高いです。これらは生のリクエスト数を見ることに依存しているためです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Mitigating Batching Attacks

In order to mitigate this type of attack you should put limits on incoming requests at the code level so that they can be applied per request. There are 3 main options:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### バッチング攻撃の緩和

この種類の攻撃を緩和するには、リクエストごとに適用できるよう、受信リクエストに対する制限をコードレベルに置くべきです。主な選択肢は三つあります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Add object request rate limiting in code
- Prevent batching for sensitive objects
- Limit the number of queries that can run at one time

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- コード内でオブジェクトリクエストのレート制限を追加します。
- 機密オブジェクトに対するバッチングを防止します。
- 同時に実行できるクエリ数を制限します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

One option is to create a code-level rate limit on how many objects that callers can request. This means the backend would track how many different object instances the caller has requested, so that they will be blocked after requesting too many objects even if they batch the object requests in a single network call. This replicates a network-level rate limit that a WAF or other tool would do.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

一つの選択肢は、呼び出し元が要求できるオブジェクト数に対してコードレベルのレート制限を作成することです。これは、バックエンドが呼び出し元が要求した異なるオブジェクトインスタンス数を追跡し、単一のネットワーク呼び出し内でオブジェクトリクエストをバッチ化していても、要求数が多すぎる場合にブロックすることを意味します。これは WAF などのツールが行うネットワークレベルのレート制限を再現するものです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Another option is to prevent batching for sensitive objects that you don't want to be brute forced, such as usernames, emails, passwords, OTPs, session tokens, etc. This way an attacker is forced to attack the API like a REST API and make a different network call per object instance. This is not supported natively so it will require a custom solution. However once this control is put in place other standard controls will function normally to help prevent any brute forcing.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

別の選択肢は、ユーザー名、メールアドレス、パスワード、OTP、セッショントークンなど、ブルートフォースされたくない機密オブジェクトに対するバッチングを防止することです。これにより、攻撃者は REST API のように、オブジェクトインスタンスごとに別々のネットワーク呼び出しを行わざるを得なくなります。これはネイティブにはサポートされていないため、カスタムソリューションが必要です。ただし、この制御が導入されると、他の標準的な制御が通常どおり機能し、ブルートフォースの防止に役立ちます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Limiting the number of operations that can be batched and run at once is another option to mitigate GraphQL batching attacks leading to DoS. This is not a silver bullet though and should be used in conjunction with other methods.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

バッチ化して同時に実行できる操作数を制限することも、DoS につながる GraphQL バッチング攻撃を緩和する別の選択肢です。ただし、これは万能策ではないため、他の方法と組み合わせて使用すべきです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Secure Configurations

By default, most GraphQL implementations have some insecure default configurations which should be changed:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### セキュアな設定

デフォルトでは、ほとんどの GraphQL 実装には変更すべき安全でないデフォルト設定があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Don't return excessive error messages (_e.g._ disable stack traces and debug mode).
- Disable or restrict Introspection and GraphiQL based on your needs.
- Suggestion of mis-typed fields if the introspection is disabled

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- 過剰なエラーメッセージを返さないようにします (スタックトレースとデバッグモードを無効にするなど)。
- 必要に応じて、イントロスペクションと GraphiQL を無効化または制限します。
- イントロスペクションが無効な場合の、入力ミスしたフィールドに対する候補提示

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Introspection + GraphiQL

GraphQL Often comes by default with introspection and/or GraphiQL enabled and not requiring authentication. This allows the consumer of your API to learn everything about your API, schemas, mutations, deprecated fields and sometimes unwanted "private fields".

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### イントロスペクション + GraphiQL

GraphQL では多くの場合、イントロスペクションや GraphiQL がデフォルトで有効であり、認証を要求しません。これにより、API の利用者は API、スキーマ、ミューテーション、非推奨フィールド、場合によっては望ましくない「プライベートフィールド」についてすべて知ることができます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

This might be an intended configuration if your API is designed to be consumed by external clients, but can also be an issue if the API was designed to be used internally only. Although security by obscurity is not recommended, it might be a good idea to consider removing the Introspection to avoid any leak.
If your API is publicly consumed, you might want to consider disabling it for not authenticated or unauthorized users.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

API が外部クライアントに利用されるよう設計されている場合、これは意図した設定である可能性がありますが、API が内部専用に設計されている場合には問題にもなり得ます。隠ぺいによるセキュリティは推奨されませんが、漏えいを避けるためにイントロスペクションの削除を検討することはよい考えかもしれません。
API が公開利用される場合、認証されていない、または認可されていないユーザーに対して無効化することを検討してもよいでしょう。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

For internal API, the easiest approach is to just disable introspection system-wide. See [this page](https://lab.wallarm.com/why-and-how-to-disable-introspection-query-for-graphql-apis/) or consult your GraphQL implementation's documentation to learn how to disable introspection altogether. If your implementation does not natively support disabling introspection or if you would like to allow some consumers/roles to have this access, you can build a filter in your service to only allow approved consumers to access the introspection system.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

内部 API では、最も簡単なアプローチはシステム全体でイントロスペクションを無効化することです。イントロスペクションを完全に無効化する方法については、[このページ](https://lab.wallarm.com/why-and-how-to-disable-introspection-query-for-graphql-apis/)を参照するか、GraphQL 実装のドキュメントを確認してください。実装がイントロスペクションの無効化をネイティブにサポートしていない場合、または一部の利用者/ロールにはこのアクセスを許可したい場合、承認済みの利用者だけがイントロスペクションシステムにアクセスできるよう、サービス内にフィルタを構築できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Keep in mind that even if introspection is disabled, attackers can still guess fields by brute forcing them. Furthermore, GraphQL has a built-in feature to return a hint when a field name that the requester provides is similar (but incorrect) to an existing field (_e.g._ request has `usr` and the response will ask `Did you mean "user?"`). You should consider disabling this feature if you have disabled the introspection, to decrease the exposure, but not all implementations of GraphQL support doing so. [Shapeshifter](https://github.com/szski/shapeshifter) is one tool that [should be able to do this](https://www.youtube.com/watch?v=NPDp7GHmMa0&t=2580).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

イントロスペクションが無効化されていても、攻撃者はブルートフォースによってフィールドを推測できることに注意してください。さらに GraphQL には、リクエスト元が指定したフィールド名が既存フィールドに似ている (ただし誤っている) 場合にヒントを返す組み込み機能があります (たとえば、リクエストに `usr` が含まれると、レスポンスで `Did you mean "user?"` と尋ねます)。イントロスペクションを無効化している場合、露出を減らすためにこの機能の無効化を検討すべきですが、すべての GraphQL 実装がそれをサポートしているわけではありません。[Shapeshifter](https://github.com/szski/shapeshifter) は、[これを実行できるはず](https://www.youtube.com/watch?v=NPDp7GHmMa0&t=2580)のツールの一つです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

_**Disable Introspection - Java**_

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

_**イントロスペクションの無効化 - Java**_

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```java
GraphQLSchema schema = GraphQLSchema.newSchema()
    .query(StarWarsSchema.queryType)
    .fieldVisibility( NoIntrospectionGraphqlFieldVisibility.NO_INTROSPECTION_FIELD_VISIBILITY )
    .build();
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

_**Disable Introspection & GraphiQL - JavaScript**_

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

_**イントロスペクションと GraphiQL の無効化 - JavaScript**_

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```javascript
app.use('/graphql', graphqlHTTP({
  schema: MySessionAwareGraphQLSchema,
+ validationRules: [NoIntrospection]
  graphiql: process.env.NODE_ENV === 'development',
}));
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Don't Return Excessive Errors

GraphQL APIs in production shouldn't return stack traces or be in debug mode. Doing this is implementation specific, but using middleware is one popular way to have better control over errors the server returns. To [disable excessive errors](https://www.apollographql.com/docs/apollo-server/data/errors/) with Apollo Server, either pass `debug: false` to the Apollo Server constructor or set the `NODE_ENV` environment variable to 'production' or 'test'. However, if you would like to log the stack trace internally without returning it to the user see [here](https://www.apollographql.com/docs/apollo-server/data/errors/#masking-and-logging-errors) for how to mask and log errors so they are available to the developers but not callers of the API.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 過剰なエラーを返さない

本番環境の GraphQL API は、スタックトレースを返したりデバッグモードになっていたりすべきではありません。これを行う方法は実装固有ですが、サーバーが返すエラーをより適切に制御する一般的な方法の一つはミドルウェアを使用することです。Apollo Server で[過剰なエラーを無効化](https://www.apollographql.com/docs/apollo-server/data/errors/)するには、Apollo Server コンストラクタに `debug: false` を渡すか、`NODE_ENV` 環境変数を 'production' または 'test' に設定します。ただし、スタックトレースをユーザーには返さず内部的にログに記録したい場合は、エラーをマスクしてログに記録し、API の呼び出し元ではなく開発者が利用できるようにする方法について[こちら](https://www.apollographql.com/docs/apollo-server/data/errors/#masking-and-logging-errors)を参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Other Resources

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## その他のリソース

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Tools

- [InQL Scanner](https://github.com/doyensec/inql) - Security scanner for GraphQL. Particularly useful for generating queries and mutations automatically from given schema and then feeding them to scanner.
- [GraphiQL](https://github.com/graphql/graphiql) - Schema/object exploration
- [GraphQL Voyager](https://github.com/APIs-guru/graphql-voyager) - Schema/object exploration

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### ツール

- [InQL Scanner](https://github.com/doyensec/inql) - GraphQL 用セキュリティスキャナ。指定されたスキーマからクエリとミューテーションを自動生成し、それをスキャナに渡す用途に特に有用です。
- [GraphiQL](https://github.com/graphql/graphiql) - スキーマ/オブジェクト探索
- [GraphQL Voyager](https://github.com/APIs-guru/graphql-voyager) - スキーマ/オブジェクト探索

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### GraphQL Security Best Practices + Documentation

- [Protecting GraphQL APIs from security threats - blog post](https://medium.com/swlh/protecting-your-graphql-api-from-security-vulnerabilities-e8afdfa6fbe4)
- [https://nordicapis.com/security-points-to-consider-before-implementing-graphql/]%28https://nordicapis.com/security-points-to-consider-before-implementing-graphql/)
- [Limiting resource usage to prevent DoS (timeouts, throttling, complexity management, depth limiting, etc.)](https://developer.github.com/v4/guides/resource-limitations/)
- [GraphQL Security Perspectives](https://www.abhaybhargav.com/from-the-trenches-diy-security-perspectives-of-graphql/)
- [A developer's security perspective of GraphQL](https://planes.studio/blog/how-to-survive-a-penetration-test-as-a-graph-ql-developer)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### GraphQL セキュリティベストプラクティス + ドキュメント

- [Protecting GraphQL APIs from security threats - blog post](https://medium.com/swlh/protecting-your-graphql-api-from-security-vulnerabilities-e8afdfa6fbe4)
- [https://nordicapis.com/security-points-to-consider-before-implementing-graphql/]%28https://nordicapis.com/security-points-to-consider-before-implementing-graphql/)
- [Limiting resource usage to prevent DoS (timeouts, throttling, complexity management, depth limiting, etc.)](https://developer.github.com/v4/guides/resource-limitations/)
- [GraphQL Security Perspectives](https://www.abhaybhargav.com/from-the-trenches-diy-security-perspectives-of-graphql/)
- [A developer's security perspective of GraphQL](https://planes.studio/blog/how-to-survive-a-penetration-test-as-a-graph-ql-developer)

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### More on GraphQL Attacks

- [Some common GraphQL attacks + attacker mindset](https://blog.doyensec.com/2018/05/17/graphql-security-overview.html)
- [Bypassing permissions by smuggling parameters](https://labs.detectify.com/2018/03/14/graphql-abuse/)
- [Bug bounty writeup about GraphQL](https://medium.com/bugbountywriteup/graphql-voyager-as-a-tool-for-security-testing-86d3c634bcd9)
- [Security talk about Abusing GraphQL](https://www.youtube.com/watch?v=NPDp7GHmMa0)
- [Real](https://vulners.com/myhack58/MYHACK58:62201994269) [world](https://www.pentestpartners.com/security-blog/pwning-wordpress-graphql/) [attacks](https://hackerone.com/reports/419883) [against](https://vulners.com/hackerone/H1:435066) [GraphQL](https://www.jonbottarini.com/2018/01/02/abusing-internal-api-to-achieve-idor-in-new-relic/) [in the](https://about.gitlab.com/blog/2019/07/03/security-release-gitlab-12-dot-0-dot-3-released/#authorization-issues-in-graphql) past
- [Attack examples against GraphQL](https://raz0r.name/articles/looting-graphql-endpoints-for-fun-and-profit/)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### GraphQL 攻撃に関する詳細

- [Some common GraphQL attacks + attacker mindset](https://blog.doyensec.com/2018/05/17/graphql-security-overview.html)
- [Bypassing permissions by smuggling parameters](https://labs.detectify.com/2018/03/14/graphql-abuse/)
- [Bug bounty writeup about GraphQL](https://medium.com/bugbountywriteup/graphql-voyager-as-a-tool-for-security-testing-86d3c634bcd9)
- [Security talk about Abusing GraphQL](https://www.youtube.com/watch?v=NPDp7GHmMa0)
- [Real](https://vulners.com/myhack58/MYHACK58:62201994269) [world](https://www.pentestpartners.com/security-blog/pwning-wordpress-graphql/) [attacks](https://hackerone.com/reports/419883) [against](https://vulners.com/hackerone/H1:435066) [GraphQL](https://www.jonbottarini.com/2018/01/02/abusing-internal-api-to-achieve-idor-in-new-relic/) [in the](https://about.gitlab.com/blog/2019/07/03/security-release-gitlab-12-dot-0-dot-3-released/#authorization-issues-in-graphql) past
- [Attack examples against GraphQL](https://raz0r.name/articles/looting-graphql-endpoints-for-fun-and-profit/)

</div>
</div>

</section>
</div>



## Attribution

<div className="attributionFooter">

- Original: GraphQL Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/GraphQL_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: English original retained for comparison. Japanese translation added. Bilingual display generated from official source and local Japanese translation.
- Retrieved: 2026-05-20

</div>
