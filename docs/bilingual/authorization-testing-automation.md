---
title: Authorization Testing Automation Cheat Sheet
hide_title: true
---

<div className="docHero" data-category="asvs-v8">
  <h1>認可テスト自動化チートシート</h1>
  <div className="docMeta">
    <span className="docPill">最終更新: 2026-05-21</span>
    <span className="docPill">読了時間: 約 8 分</span>
    <span className="docPill">カテゴリ: 認可</span>
  </div>
</div>

<p className="docLead">Authorization Testing Automation Cheat Sheet を、原文・翻訳・対比表示で確認できます。認可マトリクスを入力にしたロール別の自動テスト、監査用レンダリング、テスト失敗時の特定方法を整理しています。</p>

<div className="tabbedContent">
  <input className="tabInput" type="radio" name="authorization-testing-automation-view" id="authorization-testing-automation-original" />
  <input className="tabInput" type="radio" name="authorization-testing-automation-view" id="authorization-testing-automation-translation" defaultChecked />
  <input className="tabInput" type="radio" name="authorization-testing-automation-view" id="authorization-testing-automation-bilingual" />

  <div className="contentTabs">
    <label htmlFor="authorization-testing-automation-original" title="OWASP 原文">原文</label>
    <label htmlFor="authorization-testing-automation-translation" title="日本語訳">翻訳</label>
    <label htmlFor="authorization-testing-automation-bilingual" title="原文と翻訳を並べて確認">対比表示</label>
  </div>

<section id="authorization-testing-automation-original-panel" className="tabPanel originalPanel contentPanel">

## Introduction

**When you are implementing protection measures for an application, one of the most important parts of the process is defining and implementing the application's authorizations.** Despite all of the checks and security audits conducted during the creation phase, most of the problems with authorizations occur because features are added/modified in updated releases without determining their effect on the application's authorizations (usually because of cost or time issue reasons).

To deal with this problem, we recommend that developers automate the evaluation of the authorizations and perform a test when a new release is created. This ensures that the team knows if changes to the application will conflict with an authorization's definition and/or implementation.

## Context

An authorization usually contains two elements (also named dimensions): The **Feature** and the **Logical Role** that accesses it. Sometimes a third dimension named **Data** is added in order to define access that includes a filtering at business data level.

Generally, the two dimensions of each authorization should be listed in a spreadsheet that is called an **authorization matrix**. When authorizations are tested, the logical roles are sometimes called a **Point Of View**.

## Objective

This cheat sheet is designed to help you generate your own approaches to automating authorization tests in an authorization matrix. Since developers will need to design their own approach to automating authorization tests, **this cheat sheet will show a possible approach to automating authorization tests for one possible implementation of an application that exposes REST Services.**

## Proposition

### Preparing to automate the authorization matrix

Before we start to automate a test of the authorization matrix, we will need to do the following:

1. **Formalize the authorization matrix in a pivot format file, which will allow you to:**
    1. Easily process the matrix by a program.
    2. Allow a human to read and update when you need to follow up on the authorization combinations.
    3. Set up a hierarchy of the authorizations, which will allow you to easily create different combinations.
    4. Create the maximum possible of independence from the technology and design used to implement the applications.

2. **Create a set of integration tests that fully use the authorization matrix pivot file as an input source, which will allow you to evaluate the different combinations with the following advantages:**
    1. The minimum possible of maintenance when the authorization matrix pivot file is updated.
    2. A clear indication, in case of failed test, of the source authorization combination that does not respect the authorization matrix.

### Create the authorization matrix pivot file

**In this example, we use an XML format to formalize the authorization matrix.**

This XML structure has three main sections (or nodes):

- Node **roles**: Describes the possible logical roles used in the system, provides a list of the roles, and explains the different roles (authorization level).
- Node **services**: Provides a list of the available services exposed by the system, provides a description of those services, and defines the associated logical role(s) that can call them.
- Node **services-testing**: Provides a test payload for each service if the service uses input data other than the one coming from URL or path.

**This sample demonstrates how an authorization could be defined with XML**:

> Placeholders (values between {}) are used to mark location where test value must be placed by the integration tests if needed

```xml
  <?xml version="1.0" encoding="UTF-8"?>
  <!--
      This file materializes the authorization matrix for the different
      services exposed by the system:

      The tests will use this as a input source for the different test cases by:
      1) Defining legitimate access and the correct implementation
      2) Identifying illegitimate access (authorization definition issue
      on service implementation)

      The "name" attribute is used to uniquely identify a SERVICE or a ROLE.
  -->
  <authorization-matrix>

      <!-- Describe the possible logical roles used in the system, is used here to
      provide a list+explanation
      of the different roles (authorization level) -->
      <roles>
          <role name="ANONYMOUS"
          description="Indicate that no authorization is needed"/>
          <role name="BASIC"
          description="Role affecting a standard user (lowest access right just above anonymous)"/>
          <role name="ADMIN"
          description="Role affecting an administrator user (highest access right)"/>
      </roles>

      <!-- List and describe the available services exposed by the system and the associated
      logical role(s) that can call them -->
      <services>
          <service name="ReadSingleMessage" uri="/{messageId}" http-method="GET"
          http-response-code-for-access-allowed="200" http-response-code-for-access-denied="403">
              <role name="ANONYMOUS"/>
              <role name="BASIC"/>
              <role name="ADMIN"/>
          </service>
          <service name="ReadAllMessages" uri="/" http-method="GET"
          http-response-code-for-access-allowed="200" http-response-code-for-access-denied="403">
              <role name="ANONYMOUS"/>
              <role name="BASIC"/>
              <role name="ADMIN"/>
          </service>
          <service name="CreateMessage" uri="/" http-method="PUT"
          http-response-code-for-access-allowed="200" http-response-code-for-access-denied="403">
              <role name="BASIC"/>
              <role name="ADMIN"/>
          </service>
          <service name="DeleteMessage" uri="/{messageId}" http-method="DELETE"
          http-response-code-for-access-allowed="200" http-response-code-for-access-denied="403">
              <role name="ADMIN"/>
          </service>
      </services>

      <!-- Provide a test payload for each service if needed -->
      <services-testing>
          <service name="ReadSingleMessage">
              <payload/>
          </service>
          <service name="ReadAllMessages">
              <payload/>
          </service>
          <service name="CreateMessage">
              <payload content-type="application/json">
                  {"content":"test"}
              </payload>
          </service>
          <service name="DeleteMessage">
              <payload/>
          </service>
      </services-testing>

  </authorization-matrix>
```

### Implementing an integration test

**To create an integration test, you should use a maximum of factorized code and one test case by Point Of View (POV) so the verifications can be profiled by access level (logical role). This will facilitate the rendering/identification of the errors.**

In this integration test, we have implemented parsing, object mapping and access to the authorization matrix by marshalling XML into a Java object and unmarshalling the object back into XML These features are used to implement the tests (JAXB here) and limit the code to the developer in charge of performing the tests.

**Here is a sample implementation of an integration test case class:**

```java
  import org.owasp.pocauthztesting.enumeration.SecurityRole;
  import org.owasp.pocauthztesting.service.AuthService;
  import org.owasp.pocauthztesting.vo.AuthorizationMatrix;
  import org.apache.http.client.methods.CloseableHttpResponse;
  import org.apache.http.client.methods.HttpDelete;
  import org.apache.http.client.methods.HttpGet;
  import org.apache.http.client.methods.HttpPut;
  import org.apache.http.client.methods.HttpRequestBase;
  import org.apache.http.entity.StringEntity;
  import org.apache.http.impl.client.CloseableHttpClient;
  import org.apache.http.impl.client.HttpClients;
  import org.junit.Assert;
  import org.junit.BeforeClass;
  import org.junit.Test;
  import org.xml.sax.InputSource;
  import javax.xml.bind.JAXBContext;
  import javax.xml.parsers.SAXParserFactory;
  import javax.xml.transform.Source;
  import javax.xml.transform.sax.SAXSource;
  import java.io.File;
  import java.io.FileInputStream;
  import java.util.ArrayList;
  import java.util.List;
  import java.util.Optional;

  /**
   * Integration test cases validate the correct implementation of the authorization matrix.
   * They create a test case by logical role that will test access on all services exposed by the system.
   * This implementation focuses on readability
   */
  public class AuthorizationMatrixIT {

      /**
       * Object representation of the authorization matrix
       */
      private static AuthorizationMatrix AUTHZ_MATRIX;

      private static final String BASE_URL = "http://localhost:8080";


      /**
       * Load the authorization matrix in objects tree
       *
       * @throws Exception If any error occurs
       */
      @BeforeClass
      public static void globalInit() throws Exception {
          try (FileInputStream fis = new FileInputStream(new File("authorization-matrix.xml"))) {
              SAXParserFactory spf = SAXParserFactory.newInstance();
              spf.setFeature("http://xml.org/sax/features/external-general-entities", false);
              spf.setFeature("http://xml.org/sax/features/external-parameter-entities", false);
              spf.setFeature("http://apache.org/xml/features/nonvalidating/load-external-dtd", false);
              Source xmlSource = new SAXSource(spf.newSAXParser().getXMLReader(), new InputSource(fis));
              JAXBContext jc = JAXBContext.newInstance(AuthorizationMatrix.class);
              AUTHZ_MATRIX = (AuthorizationMatrix) jc.createUnmarshaller().unmarshal(xmlSource);
          }
      }

      /**
       * Test access to the services from a anonymous user.
       *
       * @throws Exception
       */
      @Test
      public void testAccessUsingAnonymousUserPointOfView() throws Exception {
          //Run the tests - No access token here
          List<String> errors = executeTestWithPointOfView(SecurityRole.ANONYMOUS, null);
          //Verify the test results
          Assert.assertEquals("Access issues detected using the ANONYMOUS USER point of view:\n" + formatErrorsList(errors), 0, errors.size());
      }

      /**
       * Test access to the services from a basic user.
       *
       * @throws Exception
       */
      @Test
      public void testAccessUsingBasicUserPointOfView() throws Exception {
          //Get access token representing the authorization for the associated point of view
          String accessToken = generateTestCaseAccessToken("basic", SecurityRole.BASIC);
          //Run the tests
          List<String> errors = executeTestWithPointOfView(SecurityRole.BASIC, accessToken);
          //Verify the test results
          Assert.assertEquals("Access issues detected using the BASIC USER point of view:\n " + formatErrorsList(errors), 0, errors.size());
      }

      /**
       * Test access to the services from a user with administrator access.
       *
       * @throws Exception
       */
      @Test
      public void testAccessUsingAdministratorUserPointOfView() throws Exception {
          //Get access token representing the authorization for the associated point of view
          String accessToken = generateTestCaseAccessToken("admin", SecurityRole.ADMIN);
          //Run the tests
          List<String> errors = executeTestWithPointOfView(SecurityRole.ADMIN, accessToken);
          //Verify the test results
          Assert.assertEquals("Access issues detected using the ADMIN USER point of view:\n" + formatErrorsList(errors), 0, errors.size());
      }

      /**
       * Evaluate the access to all service using the specified point of view (POV).
       *
       * @param pointOfView Point of view to use
       * @param accessToken Access token that is linked to the point of view in terms of authorization.
       * @return List of errors detected
       * @throws Exception If any error occurs
       */
      private List<String> executeTestWithPointOfView(SecurityRole pointOfView, String accessToken) throws Exception {
          List<String> errors = new ArrayList<>();
          String errorMessageTplForUnexpectedReturnCode = "The service '%s' when called with POV '%s' return a response code %s that is not the expected one in allowed or denied case.";
          String errorMessageTplForIncorrectReturnCode = "The service '%s' when called with POV '%s' return a response code %s that is not the expected one (%s expected).";
          String fatalErrorMessageTpl = "The service '%s' when called with POV %s meet the error: %s";

          //Get the list of services to call
          List<AuthorizationMatrix.Services.Service> services = AUTHZ_MATRIX.getServices().getService();

          //Get the list of services test payload to use
          List<AuthorizationMatrix.ServicesTesting.Service> servicesTestPayload = AUTHZ_MATRIX.getServicesTesting().getService();

          //Call all services sequentially (no special focus on performance here)
          services.forEach(service -> {
              //Get the service test payload for the current service
              String payload = null;
              String payloadContentType = null;
              Optional<AuthorizationMatrix.ServicesTesting.Service> serviceTesting = servicesTestPayload.stream().filter(srvPld -> srvPld.getName().equals(service.getName())).findFirst();
              if (serviceTesting.isPresent()) {
                  payload = serviceTesting.get().getPayload().getValue();
                  payloadContentType = serviceTesting.get().getPayload().getContentType();
              }
              //Call the service and verify if the response is consistent
              try {
                  //Call the service
                  int serviceResponseCode = callService(service.getUri(), payload, payloadContentType, service.getHttpMethod(), accessToken);
                  //Check if the role represented by the specified point of view is defined for the current service
                  Optional<AuthorizationMatrix.Services.Service.Role> role = service.getRole().stream().filter(r -> r.getName().equals(pointOfView.name())).findFirst();
                  boolean accessIsGrantedInAuthorizationMatrix = role.isPresent();
                  //Verify behavior consistency according to the response code returned and the authorization configured in the matrix
                  if (serviceResponseCode == service.getHttpResponseCodeForAccessAllowed()) {
                      //Roles is not in the list of role allowed to access to the service so it's an error
                      if (!accessIsGrantedInAuthorizationMatrix) {
                          errors.add(String.format(errorMessageTplForIncorrectReturnCode, service.getName(), pointOfView.name(), serviceResponseCode,
                           service.getHttpResponseCodeForAccessDenied()));
                      }
                  } else if (serviceResponseCode == service.getHttpResponseCodeForAccessDenied()) {
                      //Roles is in the list of role allowed to access to the service so it's an error
                      if (accessIsGrantedInAuthorizationMatrix) {
                          errors.add(String.format(errorMessageTplForIncorrectReturnCode, service.getName(), pointOfView.name(), serviceResponseCode,
                           service.getHttpResponseCodeForAccessAllowed()));
                      }
                  } else {
                      errors.add(String.format(errorMessageTplForUnexpectedReturnCode, service.getName(), pointOfView.name(), serviceResponseCode));
                  }
              } catch (Exception e) {
                  errors.add(String.format(fatalErrorMessageTpl, service.getName(), pointOfView.name(), e.getMessage()));
              }


          });

          return errors;
      }

      /**
       * Call a service with a specific payload and return the HTTP response code that was received.
       * This step was delegated in order to made the test cases more easy to maintain.
       *
       * @param uri                URI of the target service
       * @param payloadContentType Content type of the payload to send
       * @param payload            Payload to send
       * @param httpMethod         HTTP method to use
       * @param accessToken        Access token to specify to represent the identity of the caller
       * @return The HTTP response code received
       * @throws Exception If any error occurs
       */
      private int callService(String uri, String payload, String payloadContentType, String httpMethod, String accessToken) throws Exception {
          int rc;

          //Build the request - Use Apache HTTP Client in order to be more flexible in the combination.
          HttpRequestBase request;
          String url = (BASE_URL + uri).replaceAll("\\{messageId\\}", "1");
          switch (httpMethod) {
              case "GET":
                  request = new HttpGet(url);
                  break;
              case "DELETE":
                  request = new HttpDelete(url);
                  break;
              case "PUT":
                  request = new HttpPut(url);
                  if (payload != null) {
                      request.setHeader("Content-Type", payloadContentType);
                      ((HttpPut) request).setEntity(new StringEntity(payload.trim()));
                  }
                  break;
              default:
                  throw new UnsupportedOperationException(httpMethod + " not supported !");
          }
          request.setHeader("Authorization", (accessToken != null) ? accessToken : "");


          //Send the request and get the HTTP response code.
          try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
              try (CloseableHttpResponse httpResponse = httpClient.execute(request)) {
                  //Don't care here about the response content...
                  rc = httpResponse.getStatusLine().getStatusCode();
              }
          }

          return rc;
      }

      /**
       * Generate a JWT token for the specified user and role.
       *
       * @param login User login
       * @param role  Authorization logical role
       * @return The JWT token
       * @throws Exception If any error occurs during the creation
       */
      private String generateTestCaseAccessToken(String login, SecurityRole role) throws Exception {
          return new AuthService().issueAccessToken(login, role);
      }


      /**
       * Format a list of errors to a printable string.
       *
       * @param errors Error list
       * @return Printable string
       */
      private String formatErrorsList(List<String> errors) {
          StringBuilder buffer = new StringBuilder();
          errors.forEach(e -> buffer.append(e).append("\n"));
          return buffer.toString();
      }
  }
```

If an authorization issue is detected (or issues are detected), the output is the following:

```java
testAccessUsingAnonymousUserPointOfView(org.owasp.pocauthztesting.AuthorizationMatrixIT)
Time elapsed: 1.009 s  ### FAILURE
java.lang.AssertionError:
Access issues detected using the ANONYMOUS USER point of view:
    The service 'DeleteMessage' when called with POV 'ANONYMOUS' return
    a response code 200 that is not the expected one (403 expected).

    The service 'CreateMessage' when called with POV 'ANONYMOUS' return
    a response code 200 that is not the expected one (403 expected).

testAccessUsingBasicUserPointOfView(org.owasp.pocauthztesting.AuthorizationMatrixIT)
Time elapsed: 0.05 s  ### FAILURE!
java.lang.AssertionError:
Access issues detected using the BASIC USER point of view:
    The service 'DeleteMessage' when called with POV 'BASIC' return
    a response code 200 that is not the expected one (403 expected).
```

## Rendering the authorization matrix for an audit / review

Even if the authorization matrix is stored in a human-readable format (XML), you might want to show an on-the-fly rendered representation of the XML file to spot potential inconsistencies and facilitate the review, audit and discussion about the authorization matrix.

To achieve this task, you could use the following XSL stylesheet:

```xslt
<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
  <xsl:template match="/">
    <html>
      <head>
        <title>Authorization Matrix</title>
        <link rel="stylesheet"
        href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css"
        integrity="sha384-rwoIResjU2yc3z8GV/NPeZWAv56rSmLldC3R/AZzGRnGxQQKnKkoFVhFQhNUwEyJ"
        crossorigin="anonymous" />
      </head>
      <body>
        <h3>Roles</h3>
        <ul>
          <xsl:for-each select="authorization-matrix/roles/role">
            <xsl:choose>
              <xsl:when test="@name = 'ADMIN'">
                <div class="alert alert-warning" role="alert">
                  <strong>
                    <xsl:value-of select="@name" />
                  </strong>
                  :
                  <xsl:value-of select="@description" />
                </div>
              </xsl:when>
              <xsl:when test="@name = 'BASIC'">
                <div class="alert alert-info" role="alert">
                  <strong>
                    <xsl:value-of select="@name" />
                  </strong>
                  :
                  <xsl:value-of select="@description" />
                </div>
              </xsl:when>
              <xsl:otherwise>
                <div class="alert alert-danger" role="alert">
                  <strong>
                    <xsl:value-of select="@name" />
                  </strong>
                  :
                  <xsl:value-of select="@description" />
                </div>
              </xsl:otherwise>
            </xsl:choose>
          </xsl:for-each>
        </ul>
        <h3>Authorizations</h3>
        <table class="table table-hover table-sm">
          <thead class="thead-inverse">
            <tr>
              <th>Service</th>
              <th>URI</th>
              <th>Method</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            <xsl:for-each select="authorization-matrix/services/service">
              <xsl:variable name="service-name" select="@name" />
              <xsl:variable name="service-uri" select="@uri" />
              <xsl:variable name="service-method" select="@http-method" />
              <xsl:for-each select="role">
                <tr>
                  <td scope="row">
                    <xsl:value-of select="$service-name" />
                  </td>
                  <td>
                    <xsl:value-of select="$service-uri" />
                  </td>
                  <td>
                    <xsl:value-of select="$service-method" />
                  </td>
                  <td>
                    <xsl:variable name="service-role-name" select="@name" />
                    <xsl:choose>
                      <xsl:when test="@name = 'ADMIN'">
                        <div class="alert alert-warning" role="alert">
                          <xsl:value-of select="@name" />
                        </div>
                      </xsl:when>
                      <xsl:when test="@name = 'BASIC'">
                        <div class="alert alert-info" role="alert">
                          <xsl:value-of select="@name" />
                        </div>
                      </xsl:when>
                      <xsl:otherwise>
                        <div class="alert alert-danger" role="alert">
                          <xsl:value-of select="@name" />
                        </div>
                      </xsl:otherwise>
                    </xsl:choose>
                  </td>
                </tr>
              </xsl:for-each>
            </xsl:for-each>
          </tbody>
        </table>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
```

Example of the rendering:

![RenderingExample](https://cheatsheetseries.owasp.org/assets/Authorization_Testing_Automation_AutomationRendering.png)

## Sources of the prototype

[GitHub repository](https://github.com/righettod/poc-authz-testing)

</section>

<section id="authorization-testing-automation-translation-panel" className="tabPanel translationPanel contentPanel">

## はじめに

**アプリケーションの保護策を実装する際、プロセスの中で最も重要な部分の一つは、アプリケーションの認可を定義し実装することです。** 作成フェーズであらゆるチェックやセキュリティ監査を実施していても、認可に関する問題の多くは、更新リリースで機能が追加または変更される際に、その変更がアプリケーションの認可へ与える影響を判断しないことによって発生します。通常、その理由はコストや時間の問題です。

この問題に対処するため、開発者が認可の評価を自動化し、新しいリリースが作成されるたびにテストを実行することを推奨します。これにより、アプリケーションへの変更が認可の定義や実装と競合するかどうかを、チームが把握できるようになります。

## コンテキスト

認可は通常、二つの要素、つまり次元を含みます。アクセス対象である **Feature** と、それにアクセスする **Logical Role** です。ビジネスデータレベルでのフィルタリングを含むアクセスを定義するために、**Data** という第三の次元が追加される場合もあります。

一般に、各認可の二つの次元は、**authorization matrix** と呼ばれるスプレッドシートに一覧化するべきです。認可をテストするとき、論理ロールは **Point Of View** と呼ばれることがあります。

## 目的

このチートシートは、認可マトリクスにおける認可テストを自動化するための独自のアプローチを作成する助けとなるよう設計されています。開発者は認可テスト自動化のアプローチを自分たちで設計する必要があるため、**このチートシートでは、REST サービスを公開するアプリケーションの一つの実装例に対して、認可テストを自動化する一つの可能なアプローチを示します。**

## 提案

### 認可マトリクス自動化の準備

認可マトリクスのテスト自動化を始める前に、以下を行う必要があります。

1. **認可マトリクスをピボット形式のファイルとして形式化します。これにより、以下が可能になります。**
    1. プログラムでマトリクスを容易に処理できます。
    2. 認可の組み合わせを追跡する必要があるとき、人間が読み取り、更新できます。
    3. 認可の階層を設定でき、さまざまな組み合わせを容易に作成できます。
    4. アプリケーションの実装に使用される技術や設計から、可能な限り独立させることができます。

2. **認可マトリクスのピボットファイルを入力ソースとして完全に使用する統合テスト群を作成します。これにより、以下の利点を持ってさまざまな組み合わせを評価できます。**
    1. 認可マトリクスのピボットファイルが更新されたときの保守を可能な限り最小化できます。
    2. テストが失敗した場合に、認可マトリクスを満たしていない元の認可組み合わせを明確に示せます。

### 認可マトリクスのピボットファイルを作成する

**この例では、認可マトリクスを形式化するために XML 形式を使用します。**

この XML 構造には、三つの主要なセクション、つまりノードがあります。

- **roles** ノード: システムで使用される可能性のある論理ロールを記述し、ロールの一覧を提供し、異なるロール、つまり認可レベルを説明します。
- **services** ノード: システムが公開する利用可能なサービスの一覧を提供し、それらのサービスの説明を提供し、それらを呼び出せる関連論理ロールを定義します。
- **services-testing** ノード: サービスが URL やパスから来るもの以外の入力データを使用する場合に、各サービスのテストペイロードを提供します。

**このサンプルは、認可を XML でどのように定義できるかを示しています。**

> プレースホルダー ({ } で囲まれた値) は、必要な場合に統合テストがテスト値を配置しなければならない場所を示すために使用されます。

```xml
  <?xml version="1.0" encoding="UTF-8"?>
  <!--
      This file materializes the authorization matrix for the different
      services exposed by the system:

      The tests will use this as a input source for the different test cases by:
      1) Defining legitimate access and the correct implementation
      2) Identifying illegitimate access (authorization definition issue
      on service implementation)

      The "name" attribute is used to uniquely identify a SERVICE or a ROLE.
  -->
  <authorization-matrix>

      <!-- Describe the possible logical roles used in the system, is used here to
      provide a list+explanation
      of the different roles (authorization level) -->
      <roles>
          <role name="ANONYMOUS"
          description="Indicate that no authorization is needed"/>
          <role name="BASIC"
          description="Role affecting a standard user (lowest access right just above anonymous)"/>
          <role name="ADMIN"
          description="Role affecting an administrator user (highest access right)"/>
      </roles>

      <!-- List and describe the available services exposed by the system and the associated
      logical role(s) that can call them -->
      <services>
          <service name="ReadSingleMessage" uri="/{messageId}" http-method="GET"
          http-response-code-for-access-allowed="200" http-response-code-for-access-denied="403">
              <role name="ANONYMOUS"/>
              <role name="BASIC"/>
              <role name="ADMIN"/>
          </service>
          <service name="ReadAllMessages" uri="/" http-method="GET"
          http-response-code-for-access-allowed="200" http-response-code-for-access-denied="403">
              <role name="ANONYMOUS"/>
              <role name="BASIC"/>
              <role name="ADMIN"/>
          </service>
          <service name="CreateMessage" uri="/" http-method="PUT"
          http-response-code-for-access-allowed="200" http-response-code-for-access-denied="403">
              <role name="BASIC"/>
              <role name="ADMIN"/>
          </service>
          <service name="DeleteMessage" uri="/{messageId}" http-method="DELETE"
          http-response-code-for-access-allowed="200" http-response-code-for-access-denied="403">
              <role name="ADMIN"/>
          </service>
      </services>

      <!-- Provide a test payload for each service if needed -->
      <services-testing>
          <service name="ReadSingleMessage">
              <payload/>
          </service>
          <service name="ReadAllMessages">
              <payload/>
          </service>
          <service name="CreateMessage">
              <payload content-type="application/json">
                  {"content":"test"}
              </payload>
          </service>
          <service name="DeleteMessage">
              <payload/>
          </service>
      </services-testing>

  </authorization-matrix>
```

### 統合テストを実装する

**統合テストを作成するには、可能な限り共通化されたコードを使用し、Point Of View (POV) ごとに一つのテストケースを用意するべきです。これにより、検証をアクセスレベル、つまり論理ロールごとに分類できます。これは、エラーの表示や特定を容易にします。**

この統合テストでは、XML を Java オブジェクトにマーシャリングし、オブジェクトを XML にアンマーシャリングすることで、認可マトリクスの解析、オブジェクトマッピング、アクセスを実装しています。これらの機能はテストを実装するために使用され、ここでは JAXB を用いて、テスト実施を担当する開発者が扱うコード量を抑えています。

**以下は、統合テストケースクラスの実装例です。**

```java
  import org.owasp.pocauthztesting.enumeration.SecurityRole;
  import org.owasp.pocauthztesting.service.AuthService;
  import org.owasp.pocauthztesting.vo.AuthorizationMatrix;
  import org.apache.http.client.methods.CloseableHttpResponse;
  import org.apache.http.client.methods.HttpDelete;
  import org.apache.http.client.methods.HttpGet;
  import org.apache.http.client.methods.HttpPut;
  import org.apache.http.client.methods.HttpRequestBase;
  import org.apache.http.entity.StringEntity;
  import org.apache.http.impl.client.CloseableHttpClient;
  import org.apache.http.impl.client.HttpClients;
  import org.junit.Assert;
  import org.junit.BeforeClass;
  import org.junit.Test;
  import org.xml.sax.InputSource;
  import javax.xml.bind.JAXBContext;
  import javax.xml.parsers.SAXParserFactory;
  import javax.xml.transform.Source;
  import javax.xml.transform.sax.SAXSource;
  import java.io.File;
  import java.io.FileInputStream;
  import java.util.ArrayList;
  import java.util.List;
  import java.util.Optional;

  /**
   * Integration test cases validate the correct implementation of the authorization matrix.
   * They create a test case by logical role that will test access on all services exposed by the system.
   * This implementation focuses on readability
   */
  public class AuthorizationMatrixIT {

      /**
       * Object representation of the authorization matrix
       */
      private static AuthorizationMatrix AUTHZ_MATRIX;

      private static final String BASE_URL = "http://localhost:8080";


      /**
       * Load the authorization matrix in objects tree
       *
       * @throws Exception If any error occurs
       */
      @BeforeClass
      public static void globalInit() throws Exception {
          try (FileInputStream fis = new FileInputStream(new File("authorization-matrix.xml"))) {
              SAXParserFactory spf = SAXParserFactory.newInstance();
              spf.setFeature("http://xml.org/sax/features/external-general-entities", false);
              spf.setFeature("http://xml.org/sax/features/external-parameter-entities", false);
              spf.setFeature("http://apache.org/xml/features/nonvalidating/load-external-dtd", false);
              Source xmlSource = new SAXSource(spf.newSAXParser().getXMLReader(), new InputSource(fis));
              JAXBContext jc = JAXBContext.newInstance(AuthorizationMatrix.class);
              AUTHZ_MATRIX = (AuthorizationMatrix) jc.createUnmarshaller().unmarshal(xmlSource);
          }
      }

      /**
       * Test access to the services from a anonymous user.
       *
       * @throws Exception
       */
      @Test
      public void testAccessUsingAnonymousUserPointOfView() throws Exception {
          //Run the tests - No access token here
          List<String> errors = executeTestWithPointOfView(SecurityRole.ANONYMOUS, null);
          //Verify the test results
          Assert.assertEquals("Access issues detected using the ANONYMOUS USER point of view:\n" + formatErrorsList(errors), 0, errors.size());
      }

      /**
       * Test access to the services from a basic user.
       *
       * @throws Exception
       */
      @Test
      public void testAccessUsingBasicUserPointOfView() throws Exception {
          //Get access token representing the authorization for the associated point of view
          String accessToken = generateTestCaseAccessToken("basic", SecurityRole.BASIC);
          //Run the tests
          List<String> errors = executeTestWithPointOfView(SecurityRole.BASIC, accessToken);
          //Verify the test results
          Assert.assertEquals("Access issues detected using the BASIC USER point of view:\n " + formatErrorsList(errors), 0, errors.size());
      }

      /**
       * Test access to the services from a user with administrator access.
       *
       * @throws Exception
       */
      @Test
      public void testAccessUsingAdministratorUserPointOfView() throws Exception {
          //Get access token representing the authorization for the associated point of view
          String accessToken = generateTestCaseAccessToken("admin", SecurityRole.ADMIN);
          //Run the tests
          List<String> errors = executeTestWithPointOfView(SecurityRole.ADMIN, accessToken);
          //Verify the test results
          Assert.assertEquals("Access issues detected using the ADMIN USER point of view:\n" + formatErrorsList(errors), 0, errors.size());
      }

      /**
       * Evaluate the access to all service using the specified point of view (POV).
       *
       * @param pointOfView Point of view to use
       * @param accessToken Access token that is linked to the point of view in terms of authorization.
       * @return List of errors detected
       * @throws Exception If any error occurs
       */
      private List<String> executeTestWithPointOfView(SecurityRole pointOfView, String accessToken) throws Exception {
          List<String> errors = new ArrayList<>();
          String errorMessageTplForUnexpectedReturnCode = "The service '%s' when called with POV '%s' return a response code %s that is not the expected one in allowed or denied case.";
          String errorMessageTplForIncorrectReturnCode = "The service '%s' when called with POV '%s' return a response code %s that is not the expected one (%s expected).";
          String fatalErrorMessageTpl = "The service '%s' when called with POV %s meet the error: %s";

          //Get the list of services to call
          List<AuthorizationMatrix.Services.Service> services = AUTHZ_MATRIX.getServices().getService();

          //Get the list of services test payload to use
          List<AuthorizationMatrix.ServicesTesting.Service> servicesTestPayload = AUTHZ_MATRIX.getServicesTesting().getService();

          //Call all services sequentially (no special focus on performance here)
          services.forEach(service -> {
              //Get the service test payload for the current service
              String payload = null;
              String payloadContentType = null;
              Optional<AuthorizationMatrix.ServicesTesting.Service> serviceTesting = servicesTestPayload.stream().filter(srvPld -> srvPld.getName().equals(service.getName())).findFirst();
              if (serviceTesting.isPresent()) {
                  payload = serviceTesting.get().getPayload().getValue();
                  payloadContentType = serviceTesting.get().getPayload().getContentType();
              }
              //Call the service and verify if the response is consistent
              try {
                  //Call the service
                  int serviceResponseCode = callService(service.getUri(), payload, payloadContentType, service.getHttpMethod(), accessToken);
                  //Check if the role represented by the specified point of view is defined for the current service
                  Optional<AuthorizationMatrix.Services.Service.Role> role = service.getRole().stream().filter(r -> r.getName().equals(pointOfView.name())).findFirst();
                  boolean accessIsGrantedInAuthorizationMatrix = role.isPresent();
                  //Verify behavior consistency according to the response code returned and the authorization configured in the matrix
                  if (serviceResponseCode == service.getHttpResponseCodeForAccessAllowed()) {
                      //Roles is not in the list of role allowed to access to the service so it's an error
                      if (!accessIsGrantedInAuthorizationMatrix) {
                          errors.add(String.format(errorMessageTplForIncorrectReturnCode, service.getName(), pointOfView.name(), serviceResponseCode,
                           service.getHttpResponseCodeForAccessDenied()));
                      }
                  } else if (serviceResponseCode == service.getHttpResponseCodeForAccessDenied()) {
                      //Roles is in the list of role allowed to access to the service so it's an error
                      if (accessIsGrantedInAuthorizationMatrix) {
                          errors.add(String.format(errorMessageTplForIncorrectReturnCode, service.getName(), pointOfView.name(), serviceResponseCode,
                           service.getHttpResponseCodeForAccessAllowed()));
                      }
                  } else {
                      errors.add(String.format(errorMessageTplForUnexpectedReturnCode, service.getName(), pointOfView.name(), serviceResponseCode));
                  }
              } catch (Exception e) {
                  errors.add(String.format(fatalErrorMessageTpl, service.getName(), pointOfView.name(), e.getMessage()));
              }


          });

          return errors;
      }

      /**
       * Call a service with a specific payload and return the HTTP response code that was received.
       * This step was delegated in order to made the test cases more easy to maintain.
       *
       * @param uri                URI of the target service
       * @param payloadContentType Content type of the payload to send
       * @param payload            Payload to send
       * @param httpMethod         HTTP method to use
       * @param accessToken        Access token to specify to represent the identity of the caller
       * @return The HTTP response code received
       * @throws Exception If any error occurs
       */
      private int callService(String uri, String payload, String payloadContentType, String httpMethod, String accessToken) throws Exception {
          int rc;

          //Build the request - Use Apache HTTP Client in order to be more flexible in the combination.
          HttpRequestBase request;
          String url = (BASE_URL + uri).replaceAll("\\{messageId\\}", "1");
          switch (httpMethod) {
              case "GET":
                  request = new HttpGet(url);
                  break;
              case "DELETE":
                  request = new HttpDelete(url);
                  break;
              case "PUT":
                  request = new HttpPut(url);
                  if (payload != null) {
                      request.setHeader("Content-Type", payloadContentType);
                      ((HttpPut) request).setEntity(new StringEntity(payload.trim()));
                  }
                  break;
              default:
                  throw new UnsupportedOperationException(httpMethod + " not supported !");
          }
          request.setHeader("Authorization", (accessToken != null) ? accessToken : "");


          //Send the request and get the HTTP response code.
          try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
              try (CloseableHttpResponse httpResponse = httpClient.execute(request)) {
                  //Don't care here about the response content...
                  rc = httpResponse.getStatusLine().getStatusCode();
              }
          }

          return rc;
      }

      /**
       * Generate a JWT token for the specified user and role.
       *
       * @param login User login
       * @param role  Authorization logical role
       * @return The JWT token
       * @throws Exception If any error occurs during the creation
       */
      private String generateTestCaseAccessToken(String login, SecurityRole role) throws Exception {
          return new AuthService().issueAccessToken(login, role);
      }


      /**
       * Format a list of errors to a printable string.
       *
       * @param errors Error list
       * @return Printable string
       */
      private String formatErrorsList(List<String> errors) {
          StringBuilder buffer = new StringBuilder();
          errors.forEach(e -> buffer.append(e).append("\n"));
          return buffer.toString();
      }
  }
```

認可の問題が検出された場合、または複数の問題が検出された場合、出力は以下のようになります。

```java
testAccessUsingAnonymousUserPointOfView(org.owasp.pocauthztesting.AuthorizationMatrixIT)
Time elapsed: 1.009 s  ### FAILURE
java.lang.AssertionError:
Access issues detected using the ANONYMOUS USER point of view:
    The service 'DeleteMessage' when called with POV 'ANONYMOUS' return
    a response code 200 that is not the expected one (403 expected).

    The service 'CreateMessage' when called with POV 'ANONYMOUS' return
    a response code 200 that is not the expected one (403 expected).

testAccessUsingBasicUserPointOfView(org.owasp.pocauthztesting.AuthorizationMatrixIT)
Time elapsed: 0.05 s  ### FAILURE!
java.lang.AssertionError:
Access issues detected using the BASIC USER point of view:
    The service 'DeleteMessage' when called with POV 'BASIC' return
    a response code 200 that is not the expected one (403 expected).
```

## 監査 / レビューのために認可マトリクスをレンダリングする

認可マトリクスが人間にとって読み取り可能な形式 (XML) で保存されている場合でも、潜在的な不整合を見つけ、認可マトリクスのレビュー、監査、議論を促進するために、XML ファイルをその場でレンダリングした表現を表示したい場合があります。

このタスクを実現するには、以下の XSL スタイルシートを使用できます。

```xslt
<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
  <xsl:template match="/">
    <html>
      <head>
        <title>Authorization Matrix</title>
        <link rel="stylesheet"
        href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css"
        integrity="sha384-rwoIResjU2yc3z8GV/NPeZWAv56rSmLldC3R/AZzGRnGxQQKnKkoFVhFQhNUwEyJ"
        crossorigin="anonymous" />
      </head>
      <body>
        <h3>Roles</h3>
        <ul>
          <xsl:for-each select="authorization-matrix/roles/role">
            <xsl:choose>
              <xsl:when test="@name = 'ADMIN'">
                <div class="alert alert-warning" role="alert">
                  <strong>
                    <xsl:value-of select="@name" />
                  </strong>
                  :
                  <xsl:value-of select="@description" />
                </div>
              </xsl:when>
              <xsl:when test="@name = 'BASIC'">
                <div class="alert alert-info" role="alert">
                  <strong>
                    <xsl:value-of select="@name" />
                  </strong>
                  :
                  <xsl:value-of select="@description" />
                </div>
              </xsl:when>
              <xsl:otherwise>
                <div class="alert alert-danger" role="alert">
                  <strong>
                    <xsl:value-of select="@name" />
                  </strong>
                  :
                  <xsl:value-of select="@description" />
                </div>
              </xsl:otherwise>
            </xsl:choose>
          </xsl:for-each>
        </ul>
        <h3>Authorizations</h3>
        <table class="table table-hover table-sm">
          <thead class="thead-inverse">
            <tr>
              <th>Service</th>
              <th>URI</th>
              <th>Method</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            <xsl:for-each select="authorization-matrix/services/service">
              <xsl:variable name="service-name" select="@name" />
              <xsl:variable name="service-uri" select="@uri" />
              <xsl:variable name="service-method" select="@http-method" />
              <xsl:for-each select="role">
                <tr>
                  <td scope="row">
                    <xsl:value-of select="$service-name" />
                  </td>
                  <td>
                    <xsl:value-of select="$service-uri" />
                  </td>
                  <td>
                    <xsl:value-of select="$service-method" />
                  </td>
                  <td>
                    <xsl:variable name="service-role-name" select="@name" />
                    <xsl:choose>
                      <xsl:when test="@name = 'ADMIN'">
                        <div class="alert alert-warning" role="alert">
                          <xsl:value-of select="@name" />
                        </div>
                      </xsl:when>
                      <xsl:when test="@name = 'BASIC'">
                        <div class="alert alert-info" role="alert">
                          <xsl:value-of select="@name" />
                        </div>
                      </xsl:when>
                      <xsl:otherwise>
                        <div class="alert alert-danger" role="alert">
                          <xsl:value-of select="@name" />
                        </div>
                      </xsl:otherwise>
                    </xsl:choose>
                  </td>
                </tr>
              </xsl:for-each>
            </xsl:for-each>
          </tbody>
        </table>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
```

レンダリング例:

![RenderingExample](https://cheatsheetseries.owasp.org/assets/Authorization_Testing_Automation_AutomationRendering.png)

## プロトタイプのソース

[GitHub repository](https://github.com/righettod/poc-authz-testing)

</section>

<section id="authorization-testing-automation-bilingual-panel" className="tabPanel bilingualPanel">

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Introduction

**When you are implementing protection measures for an application, one of the most important parts of the process is defining and implementing the application's authorizations.** Despite all of the checks and security audits conducted during the creation phase, most of the problems with authorizations occur because features are added/modified in updated releases without determining their effect on the application's authorizations (usually because of cost or time issue reasons).

To deal with this problem, we recommend that developers automate the evaluation of the authorizations and perform a test when a new release is created. This ensures that the team knows if changes to the application will conflict with an authorization's definition and/or implementation.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## はじめに

**アプリケーションの保護策を実装する際、プロセスの中で最も重要な部分の一つは、アプリケーションの認可を定義し実装することです。** 作成フェーズであらゆるチェックやセキュリティ監査を実施していても、認可に関する問題の多くは、更新リリースで機能が追加または変更される際に、その変更がアプリケーションの認可へ与える影響を判断しないことによって発生します。通常、その理由はコストや時間の問題です。

この問題に対処するため、開発者が認可の評価を自動化し、新しいリリースが作成されるたびにテストを実行することを推奨します。これにより、アプリケーションへの変更が認可の定義や実装と競合するかどうかを、チームが把握できるようになります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Context

An authorization usually contains two elements (also named dimensions): The **Feature** and the **Logical Role** that accesses it. Sometimes a third dimension named **Data** is added in order to define access that includes a filtering at business data level.

Generally, the two dimensions of each authorization should be listed in a spreadsheet that is called an **authorization matrix**. When authorizations are tested, the logical roles are sometimes called a **Point Of View**.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## コンテキスト

認可は通常、二つの要素、つまり次元を含みます。アクセス対象である **Feature** と、それにアクセスする **Logical Role** です。ビジネスデータレベルでのフィルタリングを含むアクセスを定義するために、**Data** という第三の次元が追加される場合もあります。

一般に、各認可の二つの次元は、**authorization matrix** と呼ばれるスプレッドシートに一覧化するべきです。認可をテストするとき、論理ロールは **Point Of View** と呼ばれることがあります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Objective

This cheat sheet is designed to help you generate your own approaches to automating authorization tests in an authorization matrix. Since developers will need to design their own approach to automating authorization tests, **this cheat sheet will show a possible approach to automating authorization tests for one possible implementation of an application that exposes REST Services.**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 目的

このチートシートは、認可マトリクスにおける認可テストを自動化するための独自のアプローチを作成する助けとなるよう設計されています。開発者は認可テスト自動化のアプローチを自分たちで設計する必要があるため、**このチートシートでは、REST サービスを公開するアプリケーションの一つの実装例に対して、認可テストを自動化する一つの可能なアプローチを示します。**

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Proposition

### Preparing to automate the authorization matrix

Before we start to automate a test of the authorization matrix, we will need to do the following:

1. **Formalize the authorization matrix in a pivot format file, which will allow you to:**
    1. Easily process the matrix by a program.
    2. Allow a human to read and update when you need to follow up on the authorization combinations.
    3. Set up a hierarchy of the authorizations, which will allow you to easily create different combinations.
    4. Create the maximum possible of independence from the technology and design used to implement the applications.

2. **Create a set of integration tests that fully use the authorization matrix pivot file as an input source, which will allow you to evaluate the different combinations with the following advantages:**
    1. The minimum possible of maintenance when the authorization matrix pivot file is updated.
    2. A clear indication, in case of failed test, of the source authorization combination that does not respect the authorization matrix.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 提案

### 認可マトリクス自動化の準備

認可マトリクスのテスト自動化を始める前に、以下を行う必要があります。

1. **認可マトリクスをピボット形式のファイルとして形式化します。これにより、以下が可能になります。**
    1. プログラムでマトリクスを容易に処理できます。
    2. 認可の組み合わせを追跡する必要があるとき、人間が読み取り、更新できます。
    3. 認可の階層を設定でき、さまざまな組み合わせを容易に作成できます。
    4. アプリケーションの実装に使用される技術や設計から、可能な限り独立させることができます。

2. **認可マトリクスのピボットファイルを入力ソースとして完全に使用する統合テスト群を作成します。これにより、以下の利点を持ってさまざまな組み合わせを評価できます。**
    1. 認可マトリクスのピボットファイルが更新されたときの保守を可能な限り最小化できます。
    2. テストが失敗した場合に、認可マトリクスを満たしていない元の認可組み合わせを明確に示せます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Create the authorization matrix pivot file

**In this example, we use an XML format to formalize the authorization matrix.**

This XML structure has three main sections (or nodes):

- Node **roles**: Describes the possible logical roles used in the system, provides a list of the roles, and explains the different roles (authorization level).
- Node **services**: Provides a list of the available services exposed by the system, provides a description of those services, and defines the associated logical role(s) that can call them.
- Node **services-testing**: Provides a test payload for each service if the service uses input data other than the one coming from URL or path.

**This sample demonstrates how an authorization could be defined with XML**:

> Placeholders (values between {}) are used to mark location where test value must be placed by the integration tests if needed

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 認可マトリクスのピボットファイルを作成する

**この例では、認可マトリクスを形式化するために XML 形式を使用します。**

この XML 構造には、三つの主要なセクション、つまりノードがあります。

- **roles** ノード: システムで使用される可能性のある論理ロールを記述し、ロールの一覧を提供し、異なるロール、つまり認可レベルを説明します。
- **services** ノード: システムが公開する利用可能なサービスの一覧を提供し、それらのサービスの説明を提供し、それらを呼び出せる関連論理ロールを定義します。
- **services-testing** ノード: サービスが URL やパスから来るもの以外の入力データを使用する場合に、各サービスのテストペイロードを提供します。

**このサンプルは、認可を XML でどのように定義できるかを示しています。**

> プレースホルダー ({ } で囲まれた値) は、必要な場合に統合テストがテスト値を配置しなければならない場所を示すために使用されます。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```xml
  <?xml version="1.0" encoding="UTF-8"?>
  <!--
      This file materializes the authorization matrix for the different
      services exposed by the system:

      The tests will use this as a input source for the different test cases by:
      1) Defining legitimate access and the correct implementation
      2) Identifying illegitimate access (authorization definition issue
      on service implementation)

      The "name" attribute is used to uniquely identify a SERVICE or a ROLE.
  -->
  <authorization-matrix>

      <!-- Describe the possible logical roles used in the system, is used here to
      provide a list+explanation
      of the different roles (authorization level) -->
      <roles>
          <role name="ANONYMOUS"
          description="Indicate that no authorization is needed"/>
          <role name="BASIC"
          description="Role affecting a standard user (lowest access right just above anonymous)"/>
          <role name="ADMIN"
          description="Role affecting an administrator user (highest access right)"/>
      </roles>

      <!-- List and describe the available services exposed by the system and the associated
      logical role(s) that can call them -->
      <services>
          <service name="ReadSingleMessage" uri="/{messageId}" http-method="GET"
          http-response-code-for-access-allowed="200" http-response-code-for-access-denied="403">
              <role name="ANONYMOUS"/>
              <role name="BASIC"/>
              <role name="ADMIN"/>
          </service>
          <service name="ReadAllMessages" uri="/" http-method="GET"
          http-response-code-for-access-allowed="200" http-response-code-for-access-denied="403">
              <role name="ANONYMOUS"/>
              <role name="BASIC"/>
              <role name="ADMIN"/>
          </service>
          <service name="CreateMessage" uri="/" http-method="PUT"
          http-response-code-for-access-allowed="200" http-response-code-for-access-denied="403">
              <role name="BASIC"/>
              <role name="ADMIN"/>
          </service>
          <service name="DeleteMessage" uri="/{messageId}" http-method="DELETE"
          http-response-code-for-access-allowed="200" http-response-code-for-access-denied="403">
              <role name="ADMIN"/>
          </service>
      </services>

      <!-- Provide a test payload for each service if needed -->
      <services-testing>
          <service name="ReadSingleMessage">
              <payload/>
          </service>
          <service name="ReadAllMessages">
              <payload/>
          </service>
          <service name="CreateMessage">
              <payload content-type="application/json">
                  {"content":"test"}
              </payload>
          </service>
          <service name="DeleteMessage">
              <payload/>
          </service>
      </services-testing>

  </authorization-matrix>
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Implementing an integration test

**To create an integration test, you should use a maximum of factorized code and one test case by Point Of View (POV) so the verifications can be profiled by access level (logical role). This will facilitate the rendering/identification of the errors.**

In this integration test, we have implemented parsing, object mapping and access to the authorization matrix by marshalling XML into a Java object and unmarshalling the object back into XML These features are used to implement the tests (JAXB here) and limit the code to the developer in charge of performing the tests.

**Here is a sample implementation of an integration test case class:**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 統合テストを実装する

**統合テストを作成するには、可能な限り共通化されたコードを使用し、Point Of View (POV) ごとに一つのテストケースを用意するべきです。これにより、検証をアクセスレベル、つまり論理ロールごとに分類できます。これは、エラーの表示や特定を容易にします。**

この統合テストでは、XML を Java オブジェクトにマーシャリングし、オブジェクトを XML にアンマーシャリングすることで、認可マトリクスの解析、オブジェクトマッピング、アクセスを実装しています。これらの機能はテストを実装するために使用され、ここでは JAXB を用いて、テスト実施を担当する開発者が扱うコード量を抑えています。

**以下は、統合テストケースクラスの実装例です。**

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```java
  import org.owasp.pocauthztesting.enumeration.SecurityRole;
  import org.owasp.pocauthztesting.service.AuthService;
  import org.owasp.pocauthztesting.vo.AuthorizationMatrix;
  import org.apache.http.client.methods.CloseableHttpResponse;
  import org.apache.http.client.methods.HttpDelete;
  import org.apache.http.client.methods.HttpGet;
  import org.apache.http.client.methods.HttpPut;
  import org.apache.http.client.methods.HttpRequestBase;
  import org.apache.http.entity.StringEntity;
  import org.apache.http.impl.client.CloseableHttpClient;
  import org.apache.http.impl.client.HttpClients;
  import org.junit.Assert;
  import org.junit.BeforeClass;
  import org.junit.Test;
  import org.xml.sax.InputSource;
  import javax.xml.bind.JAXBContext;
  import javax.xml.parsers.SAXParserFactory;
  import javax.xml.transform.Source;
  import javax.xml.transform.sax.SAXSource;
  import java.io.File;
  import java.io.FileInputStream;
  import java.util.ArrayList;
  import java.util.List;
  import java.util.Optional;

  /**
   * Integration test cases validate the correct implementation of the authorization matrix.
   * They create a test case by logical role that will test access on all services exposed by the system.
   * This implementation focuses on readability
   */
  public class AuthorizationMatrixIT {
      private static AuthorizationMatrix AUTHZ_MATRIX;
      private static final String BASE_URL = "http://localhost:8080";

      @BeforeClass
      public static void globalInit() throws Exception {
          try (FileInputStream fis = new FileInputStream(new File("authorization-matrix.xml"))) {
              SAXParserFactory spf = SAXParserFactory.newInstance();
              spf.setFeature("http://xml.org/sax/features/external-general-entities", false);
              spf.setFeature("http://xml.org/sax/features/external-parameter-entities", false);
              spf.setFeature("http://apache.org/xml/features/nonvalidating/load-external-dtd", false);
              Source xmlSource = new SAXSource(spf.newSAXParser().getXMLReader(), new InputSource(fis));
              JAXBContext jc = JAXBContext.newInstance(AuthorizationMatrix.class);
              AUTHZ_MATRIX = (AuthorizationMatrix) jc.createUnmarshaller().unmarshal(xmlSource);
          }
      }

      @Test
      public void testAccessUsingAnonymousUserPointOfView() throws Exception {
          List<String> errors = executeTestWithPointOfView(SecurityRole.ANONYMOUS, null);
          Assert.assertEquals("Access issues detected using the ANONYMOUS USER point of view:\n" + formatErrorsList(errors), 0, errors.size());
      }

      @Test
      public void testAccessUsingBasicUserPointOfView() throws Exception {
          String accessToken = generateTestCaseAccessToken("basic", SecurityRole.BASIC);
          List<String> errors = executeTestWithPointOfView(SecurityRole.BASIC, accessToken);
          Assert.assertEquals("Access issues detected using the BASIC USER point of view:\n " + formatErrorsList(errors), 0, errors.size());
      }

      @Test
      public void testAccessUsingAdministratorUserPointOfView() throws Exception {
          String accessToken = generateTestCaseAccessToken("admin", SecurityRole.ADMIN);
          List<String> errors = executeTestWithPointOfView(SecurityRole.ADMIN, accessToken);
          Assert.assertEquals("Access issues detected using the ADMIN USER point of view:\n" + formatErrorsList(errors), 0, errors.size());
      }

      private List<String> executeTestWithPointOfView(SecurityRole pointOfView, String accessToken) throws Exception {
          List<String> errors = new ArrayList<>();
          String errorMessageTplForUnexpectedReturnCode = "The service '%s' when called with POV '%s' return a response code %s that is not the expected one in allowed or denied case.";
          String errorMessageTplForIncorrectReturnCode = "The service '%s' when called with POV '%s' return a response code %s that is not the expected one (%s expected).";
          String fatalErrorMessageTpl = "The service '%s' when called with POV %s meet the error: %s";
          List<AuthorizationMatrix.Services.Service> services = AUTHZ_MATRIX.getServices().getService();
          List<AuthorizationMatrix.ServicesTesting.Service> servicesTestPayload = AUTHZ_MATRIX.getServicesTesting().getService();

          services.forEach(service -> {
              String payload = null;
              String payloadContentType = null;
              Optional<AuthorizationMatrix.ServicesTesting.Service> serviceTesting = servicesTestPayload.stream().filter(srvPld -> srvPld.getName().equals(service.getName())).findFirst();
              if (serviceTesting.isPresent()) {
                  payload = serviceTesting.get().getPayload().getValue();
                  payloadContentType = serviceTesting.get().getPayload().getContentType();
              }
              try {
                  int serviceResponseCode = callService(service.getUri(), payload, payloadContentType, service.getHttpMethod(), accessToken);
                  Optional<AuthorizationMatrix.Services.Service.Role> role = service.getRole().stream().filter(r -> r.getName().equals(pointOfView.name())).findFirst();
                  boolean accessIsGrantedInAuthorizationMatrix = role.isPresent();
                  if (serviceResponseCode == service.getHttpResponseCodeForAccessAllowed()) {
                      if (!accessIsGrantedInAuthorizationMatrix) {
                          errors.add(String.format(errorMessageTplForIncorrectReturnCode, service.getName(), pointOfView.name(), serviceResponseCode,
                           service.getHttpResponseCodeForAccessDenied()));
                      }
                  } else if (serviceResponseCode == service.getHttpResponseCodeForAccessDenied()) {
                      if (accessIsGrantedInAuthorizationMatrix) {
                          errors.add(String.format(errorMessageTplForIncorrectReturnCode, service.getName(), pointOfView.name(), serviceResponseCode,
                           service.getHttpResponseCodeForAccessAllowed()));
                      }
                  } else {
                      errors.add(String.format(errorMessageTplForUnexpectedReturnCode, service.getName(), pointOfView.name(), serviceResponseCode));
                  }
              } catch (Exception e) {
                  errors.add(String.format(fatalErrorMessageTpl, service.getName(), pointOfView.name(), e.getMessage()));
              }
          });

          return errors;
      }

      private int callService(String uri, String payload, String payloadContentType, String httpMethod, String accessToken) throws Exception {
          int rc;
          HttpRequestBase request;
          String url = (BASE_URL + uri).replaceAll("\\{messageId\\}", "1");
          switch (httpMethod) {
              case "GET":
                  request = new HttpGet(url);
                  break;
              case "DELETE":
                  request = new HttpDelete(url);
                  break;
              case "PUT":
                  request = new HttpPut(url);
                  if (payload != null) {
                      request.setHeader("Content-Type", payloadContentType);
                      ((HttpPut) request).setEntity(new StringEntity(payload.trim()));
                  }
                  break;
              default:
                  throw new UnsupportedOperationException(httpMethod + " not supported !");
          }
          request.setHeader("Authorization", (accessToken != null) ? accessToken : "");

          try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
              try (CloseableHttpResponse httpResponse = httpClient.execute(request)) {
                  rc = httpResponse.getStatusLine().getStatusCode();
              }
          }

          return rc;
      }

      private String generateTestCaseAccessToken(String login, SecurityRole role) throws Exception {
          return new AuthService().issueAccessToken(login, role);
      }

      private String formatErrorsList(List<String> errors) {
          StringBuilder buffer = new StringBuilder();
          errors.forEach(e -> buffer.append(e).append("\n"));
          return buffer.toString();
      }
  }
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

If an authorization issue is detected (or issues are detected), the output is the following:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

認可の問題が検出された場合、または複数の問題が検出された場合、出力は以下のようになります。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```java
testAccessUsingAnonymousUserPointOfView(org.owasp.pocauthztesting.AuthorizationMatrixIT)
Time elapsed: 1.009 s  ### FAILURE
java.lang.AssertionError:
Access issues detected using the ANONYMOUS USER point of view:
    The service 'DeleteMessage' when called with POV 'ANONYMOUS' return
    a response code 200 that is not the expected one (403 expected).

    The service 'CreateMessage' when called with POV 'ANONYMOUS' return
    a response code 200 that is not the expected one (403 expected).

testAccessUsingBasicUserPointOfView(org.owasp.pocauthztesting.AuthorizationMatrixIT)
Time elapsed: 0.05 s  ### FAILURE!
java.lang.AssertionError:
Access issues detected using the BASIC USER point of view:
    The service 'DeleteMessage' when called with POV 'BASIC' return
    a response code 200 that is not the expected one (403 expected).
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Rendering the authorization matrix for an audit / review

Even if the authorization matrix is stored in a human-readable format (XML), you might want to show an on-the-fly rendered representation of the XML file to spot potential inconsistencies and facilitate the review, audit and discussion about the authorization matrix.

To achieve this task, you could use the following XSL stylesheet:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 監査 / レビューのために認可マトリクスをレンダリングする

認可マトリクスが人間にとって読み取り可能な形式 (XML) で保存されている場合でも、潜在的な不整合を見つけ、認可マトリクスのレビュー、監査、議論を促進するために、XML ファイルをその場でレンダリングした表現を表示したい場合があります。

このタスクを実現するには、以下の XSL スタイルシートを使用できます。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```xslt
<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
  <xsl:template match="/">
    <html>
      <head>
        <title>Authorization Matrix</title>
        <link rel="stylesheet"
        href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css"
        integrity="sha384-rwoIResjU2yc3z8GV/NPeZWAv56rSmLldC3R/AZzGRnGxQQKnKkoFVhFQhNUwEyJ"
        crossorigin="anonymous" />
      </head>
      <body>
        <h3>Roles</h3>
        <ul>
          <xsl:for-each select="authorization-matrix/roles/role">
            <xsl:choose>
              <xsl:when test="@name = 'ADMIN'">
                <div class="alert alert-warning" role="alert">
                  <strong>
                    <xsl:value-of select="@name" />
                  </strong>
                  :
                  <xsl:value-of select="@description" />
                </div>
              </xsl:when>
              <xsl:when test="@name = 'BASIC'">
                <div class="alert alert-info" role="alert">
                  <strong>
                    <xsl:value-of select="@name" />
                  </strong>
                  :
                  <xsl:value-of select="@description" />
                </div>
              </xsl:when>
              <xsl:otherwise>
                <div class="alert alert-danger" role="alert">
                  <strong>
                    <xsl:value-of select="@name" />
                  </strong>
                  :
                  <xsl:value-of select="@description" />
                </div>
              </xsl:otherwise>
            </xsl:choose>
          </xsl:for-each>
        </ul>
        <h3>Authorizations</h3>
        <table class="table table-hover table-sm">
          <thead class="thead-inverse">
            <tr>
              <th>Service</th>
              <th>URI</th>
              <th>Method</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            <xsl:for-each select="authorization-matrix/services/service">
              <xsl:variable name="service-name" select="@name" />
              <xsl:variable name="service-uri" select="@uri" />
              <xsl:variable name="service-method" select="@http-method" />
              <xsl:for-each select="role">
                <tr>
                  <td scope="row">
                    <xsl:value-of select="$service-name" />
                  </td>
                  <td>
                    <xsl:value-of select="$service-uri" />
                  </td>
                  <td>
                    <xsl:value-of select="$service-method" />
                  </td>
                  <td>
                    <xsl:variable name="service-role-name" select="@name" />
                    <xsl:choose>
                      <xsl:when test="@name = 'ADMIN'">
                        <div class="alert alert-warning" role="alert">
                          <xsl:value-of select="@name" />
                        </div>
                      </xsl:when>
                      <xsl:when test="@name = 'BASIC'">
                        <div class="alert alert-info" role="alert">
                          <xsl:value-of select="@name" />
                        </div>
                      </xsl:when>
                      <xsl:otherwise>
                        <div class="alert alert-danger" role="alert">
                          <xsl:value-of select="@name" />
                        </div>
                      </xsl:otherwise>
                    </xsl:choose>
                  </td>
                </tr>
              </xsl:for-each>
            </xsl:for-each>
          </tbody>
        </table>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Example of the rendering:

![RenderingExample](https://cheatsheetseries.owasp.org/assets/Authorization_Testing_Automation_AutomationRendering.png)

## Sources of the prototype

[GitHub repository](https://github.com/righettod/poc-authz-testing)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

レンダリング例:

![RenderingExample](https://cheatsheetseries.owasp.org/assets/Authorization_Testing_Automation_AutomationRendering.png)

## プロトタイプのソース

[GitHub repository](https://github.com/righettod/poc-authz-testing)

</div>
</div>

</section>

</div>

## Attribution

<div className="attributionFooter">

- Original: Authorization Testing Automation Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Testing_Automation_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: English original retained for comparison. Japanese translation added.
- Retrieved: 2026-05-21

</div>
