---
hide_table_of_contents: true
---

# Bean Validation Cheat Sheet

<div className="docHero docHero--encoding">
  <h1>Bean Validation Cheat Sheet</h1>
  <p className="docSubtitle">Bean Validation チートシート</p>
  <div className="docMeta">
    <span className="docPill">最終更新: 2026-05-20</span>
    <span className="docPill">読了時間: 約 12 分</span>
    <span className="docPill">カテゴリ: Encoding and Sanitization</span>
  </div>
</div>

<div className="tabbedContent">
  <input className="tabInput" type="radio" name="bean-validation-view" id="bean-validation-translation" defaultChecked />
  <input className="tabInput" type="radio" name="bean-validation-view" id="bean-validation-summary" />
  <input className="tabInput" type="radio" name="bean-validation-view" id="bean-validation-checklist" />
  <input className="tabInput" type="radio" name="bean-validation-view" id="bean-validation-bilingual" />

  <div className="contentTabs">
    <label htmlFor="bean-validation-translation">翻訳</label>
    <label htmlFor="bean-validation-summary">要点</label>
    <label htmlFor="bean-validation-checklist">チェックリスト</label>
    <label htmlFor="bean-validation-bilingual">対比表示</label>
  </div>

  <aside className="viewToc" aria-label="表示中の目次">
    <strong>目次</strong>
    <nav className="viewTocPanel translationToc">
      <a href="#introduction">Introduction</a>
      <a href="#setup">Setup</a>
      <a href="#basics">Basics</a>
      <a href="#predefined-constraints">Predefined Constraints</a>
      <a href="#custom-constraints">Custom Constraints</a>
      <a href="#error-messages">Error Messages</a>
    </nav>
    <nav className="viewTocPanel summaryToc">
      <a href="#bean-validation-summary-panel">要点</a>
    </nav>
    <nav className="viewTocPanel checklistToc">
      <a href="#bean-validation-checklist-panel">チェックリスト</a>
    </nav>
    <nav className="viewTocPanel bilingualToc">
      <a href="#bean-validation-bilingual-panel">対比表示</a>
      <a href="#introduction-1">Introduction</a>
      <a href="#setup-1">Setup</a>
      <a href="#basics-1">Basics</a>
      <a href="#predefined-constraints-1">Predefined Constraints</a>
      <a href="#custom-constraints-1">Custom Constraints</a>
      <a href="#error-messages-1">Error Messages</a>
    </nav>
  </aside>

  <section id="bean-validation-translation-panel" className="tabPanel translationPanel contentPanel">

## Introduction

この記事は、アプリケーションで Java Bean Validation のセキュリティ機能を提供するための、明確で単純かつ実行可能なガイダンスを示します。

Bean Validation、別名 [Jakarta Validation](https://beanvalidation.org/) は、Java で [入力検証](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html) を行う最も一般的な方法の一つです。これはアプリケーション層に依存しない検証仕様であり、開発者がドメインモデル上に検証制約を定義し、その制約をさまざまなアプリケーション層で検証できるようにします。

この方式の利点の一つは、検証制約と対応するバリデータを一度だけ記述すればよいことです。これにより作業の重複が減り、一貫性を保てます。

### Typical Validation

![Typical validation flow](/img/owasp-cheatsheets/bean-validation/typical.png)

### Bean Validation

![Bean Validation flow](/img/owasp-cheatsheets/bean-validation/jsr.png)

## Setup

このガイドの例では Hibernate Validator を使用します。

Hibernate Validator を **pom.xml** に追加します。

```xml
<dependency>
   <groupId>org.hibernate</groupId>
   <artifactId>hibernate-validator</artifactId>
   <version>USE_LATEST_VERSION</version>
</dependency>
```

Spring の **context.xml** で Bean Validation サポートを有効にします。

```xml
<beans:beans ...
   ...
   <mvc:annotation-driven />
   ...
</beans:beans>
```

詳細は [セットアップガイド](https://hibernate.org/validator/documentation/getting-started/) を参照してください。

## Basics

Bean Validation を使い始めるには、`@Pattern`、`@Digits`、`@Min`、`@Max`、`@Size`、`@Past`、`@Future`、`@CreditCardNumber`、`@Email`、`@URL` などの検証制約をモデルに追加し、各アプリケーション層でモデルを渡すときに `@Valid` アノテーションを使用します。

制約は次の場所に適用できます。

- フィールド
- プロパティ
- クラス

Bean Validation 1.1 では、さらに次の場所にも適用できます。

- パラメータ
- 戻り値
- コンストラクタ

簡潔にするため、以下のすべての例ではフィールド制約を使用し、すべての検証はコントローラによってトリガーされます。例の完全な一覧については Bean Validation のドキュメントを参照してください。

エラーハンドリングについては、Hibernate Validator は `List<ObjectError>` を含む `BindingResult` オブジェクトを返します。以下の例では単純化したエラーハンドリングを示しますが、本番対応のアプリケーションでは、ログ記録とエラーページへのリダイレクトを考慮した、より丁寧な設計が必要です。

## Predefined Constraints

### @Pattern

**Annotation**:

`@Pattern(regex=,flag=)`

**Data Type**:

`CharSequence`

**Use**:

指定されたフラグによる一致条件を考慮し、アノテーションが付いた文字列が正規表現 `regex` に一致するかを確認します。他の有用な正規表現については [OWASP Validation Regex Repository](https://owasp.org/www-community/OWASP_Validation_Regex_Repository) を参照してください。

**Reference**:

[Documentation](https://docs.jboss.org/hibernate/validator/5.2/reference/en-US/html/ch02.html#section-builtin-constraints)

**Model**:

```java
import org.hibernate.validator.constraints.Pattern;

public class Article  {
 //Constraint: Alpha Numeric article titles only using a regular expression
 @Pattern(regexp = "[a-zA-Z0-9 ]")
 private String articleTitle;
 public String getArticleTitle()  {
  return  articleTitle;
 }
 public void setArticleTitle(String  articleTitle)  {
   this.articleTitle  =  articleTitle;
  }

  ...

}
```

**Controller**:

```java
import javax.validation.Valid;
import com.company.app.model.Article;

@Controller
public class ArticleController  {

 ...

 @RequestMapping(value = "/postArticle",  method = RequestMethod.POST)
 public @ResponseBody String postArticle(@Valid  Article  article,  BindingResult  result,
 HttpServletResponse  response) {
  if (result.hasErrors()) {
   String errorMessage  =  "";
   response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
   List<ObjectError> errors = result.getAllErrors();
   for(ObjectError  e :  errors) {
    errorMessage += "ERROR: " +  e.getDefaultMessage();
   }
   return  errorMessage;
  } else {
   return  "Validation Successful";
  }
 }
}
```

### @Digits

**Annotation**:

`@Digits(integer=,fraction=)`

**Data Type**:

`BigDecimal`、`BigInteger`、`CharSequence`、`byte`、`short`、`int`、`long` と、それぞれのプリミティブ型のラッパー。Hibernate Validator ではさらに `Number` の任意のサブタイプもサポートされます。

**Use**:

アノテーションが付いた値が、最大 `integer` 桁の整数部と `fraction` 桁の小数部を持つ数値かどうかを確認します。

**Reference**:

[Documentation](https://docs.jboss.org/hibernate/validator/5.2/reference/en-US/html/ch02.html#section-builtin-constraints)

**Model**:

```java
import org.hibernate.validator.constraints.Digits;

public class Customer {
  //Constraint: Age can only be 3 digits long or less
  @Digits(integer = 3, fraction = 0)
  private int age;

  public String getAge()  {
    return age;
  }

  public void setAge(String age)  {
      this.age = age;
    }

    ...
}
```

**Controller**:

```java
import javax.validation.Valid;
import com.company.app.model.Customer;

@Controller
public class CustomerController  {

 ...

 @RequestMapping(value = "/registerCustomer",  method = RequestMethod.POST)
 public @ResponseBody String registerCustomer(@Valid Customer customer, BindingResult result,
 HttpServletResponse  response) {

  if (result.hasErrors()) {
   String errorMessage = "";
   response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
   List<ObjectError> errors = result.getAllErrors();

   for( ObjectError  e :  errors) {
    errorMessage += "ERROR: "  +  e.getDefaultMessage();
   }
   return  errorMessage;
  } else {
   return  "Validation Successful";
  }
 }
}
```

### @Size

**Annotation**:

`@Size(min=, max=)`

**Data Type**:

`CharSequence`、`Collection`、`Map`、配列

**Use**:

アノテーションが付いた要素のサイズが `min` 以上 `max` 以下であるかを確認します。

**Reference**:

[Documentation](https://docs.jboss.org/hibernate/validator/5.2/reference/en-US/html/ch02.html#section-builtin-constraints)

**Model**:

```java
import org.hibernate.validator.constraints.Size;

public class Message {

   //Constraint: Message must be at least 10 characters long, but less than 500
   @Size(min = 10, max = 500)
   private String message;

   public String getMessage() {
      return message;
   }

   public void setMessage(String message) {
      this.message = message;
   }

...
}
```

**Controller**:

```java
import javax.validation.Valid;
import com.company.app.model.Message;

@Controller
public class MessageController {

...

@RequestMapping(value="/sendMessage", method=RequestMethod.POST)
public @ResponseBody String sendMessage(@Valid Message message, BindingResult result,
HttpServletResponse response){

   if(result.hasErrors()){
      String errorMessage = "";
      response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
      List<ObjectError> errors = result.getAllErrors();
      for( ObjectError e : errors){
         errorMessage+= "ERROR: " + e.getDefaultMessage();
      }
      return errorMessage;
   }
   else{
      return "Validation Successful";
   }
}
}
```

### @Past / @Future

**Annotation**:

`@Past`, `@Future`

**Data Type**:

`java.util.Date`、`java.util.Calendar`、`java.time.chrono.ChronoZonedDateTime`、`java.time.Instant`、`java.time.OffsetDateTime`

**Use**:

アノテーションが付いた日付が過去または未来であるかを確認します。

**Reference**:

[Documentation](https://docs.jboss.org/hibernate/validator/5.2/reference/en-US/html/ch02.html#section-builtin-constraints)

**Model**:

```java
import org.hibernate.validator.constraints.Past;
import org.hibernate.validator.constraints.Future;

public class DoctorVisit {

   //Constraint: Birthdate must be in the past
   @Past
   private Date birthDate;

   public Date getBirthDate() {
      return birthDate;
   }

   public void setBirthDate(Date birthDate) {
      this.birthDate = birthDate;
   }

   //Constraint: Schedule visit date must be in the future
   @Future
   private String scheduledVisitDate;

   public String getScheduledVisitDate() {
      return scheduledVisitDate;
   }

   public void setScheduledVisitDate(String scheduledVisitDate) {
      this.scheduledVisitDate = scheduledVisitDate;
   }

...
}
```

**Controller**:

```java
import javax.validation.Valid;
import com.company.app.model.DoctorVisit;

@Controller
public class DoctorVisitController {

   ...

   @RequestMapping(value="/scheduleVisit", method=RequestMethod.POST)
   public @ResponseBody String scheduleVisit(@Valid DoctorVisit doctorvisit, BindingResult result,
   HttpServletResponse response){

      if(result.hasErrors()){
         String errorMessage = "";
         response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
         List<ObjectError> errors = result.getAllErrors();
         for( ObjectError e : errors){
            errorMessage+= "ERROR: " + e.getDefaultMessage();
         }
         return errorMessage;
      }
      else{
         return "Validation Successful";
      }
   }
}
```

### Combining Constraints

検証アノテーションは、適切な方法で組み合わせることができます。たとえば、`reviewRating` の値を 1 から 5 の範囲に制限するには、次のように検証を指定します。

**Annotation**:

`@Min(value=)`, `@Max(value=)`

**Data Type**:

`BigDecimal`、`BigInteger`、`byte`、`short`、`int`、`long` と、それぞれのプリミティブ型のラッパー。Hibernate Validator ではさらに `CharSequence` の任意のサブタイプ（文字列で表された数値が評価されます）と、`Number` の任意のサブタイプもサポートされます。

**Use**:

アノテーションが付いた値が、指定された最小値以上または最大値以下であるかを確認します。

**Reference:**

[Documentation](https://docs.jboss.org/hibernate/validator/9.0/reference/en-US/html_single/#section-builtin-constraints)

**Model**:

```java
import org.hibernate.validator.constraints.Min;
import org.hibernate.validator.constraints.Max;

public class Review {

 //Constraint: Review rating must be between 1 and 5
 @Min(1)
 @Max(5)
 private int reviewRating;

 public int getReviewRating() {
   return reviewRating;
 }

 public void setReviewRating(int reviewRating) {
   this.reviewRating = reviewRating;
}
 ...
}
```

**Controller**:

```java
import javax.validation.Valid;
import com.company.app.model.ReviewRating;

@Controller
public class ReviewController {

   ...

   @RequestMapping(value="/postReview", method=RequestMethod.POST)
   public @ResponseBody String postReview(@Valid Review review, BindingResult result,
   HttpServletResponse response){

      if(result.hasErrors()){
         String errorMessage = "";
         response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
         List<ObjectError> errors = result.getAllErrors();
         for( ObjectError e : errors){
            errorMessage+= "ERROR: " + e.getDefaultMessage();
         }
         return errorMessage;
      }
      else{
         return "Validation Successful";
      }
   }
}
```

### Cascading Constraints

1つの Bean を検証することは良い出発点ですが、多くの場合、Bean はネストされているか、Bean の完全なグラフを構成しています。そのグラフ全体を一度に検証するには、[@Valid](https://docs.jboss.org/hibernate/validator/9.0/reference/en-US/html_single/#_cascaded_validation) によるカスケード検証を適用します。

### Additional Constraints

Hibernate Validator は JSR303 制約一式に加えて、利便性のために追加の制約も定義しています。

- `@CreditCardNumber`
- `@EAN`
- `@Email`
- `@Length`
- `@Range`
- `@ScriptAssert`
- `@URL`

完全な一覧はこの [リスト](https://docs.jboss.org/hibernate/validator/9.0/reference/en-US/html_single/#validator-defineconstraints-hv-constraints) を参照してください。

以前は有効な制約だった `@SafeHtml` は、[Hibernate Validator 6.1.0.Final and 6.0.18.Final release blogpost](https://in.relation.to/2019/11/20/hibernate-validator-610-6018-released/) によると非推奨になっています。`@SafeHtml` 制約の使用は控えてください。

## Custom Constraints

Bean Validation の最も強力な機能の一つは、組み込み制約が提供する単純な検証を超えた、独自の制約を定義できることです。

カスタム制約の作成はこのガイドの範囲外です。この [ドキュメント](https://docs.jboss.org/hibernate/validator/) を参照してください。

## Error Messages

検証アノテーションでメッセージ ID を指定し、エラーメッセージをカスタマイズできます。

```java
@Pattern(regexp = "[a-zA-Z0-9 ]", message="article.title.error")
private String articleTitle;
```

Spring MVC は、定義済みの `MessageSource` から ID `article.title.error` のメッセージを検索します。詳しくはこの [ドキュメント](https://www.silverbaytech.com/2013/04/16/custom-messages-in-spring-validation/) を参照してください。

  </section>

  <section id="bean-validation-summary-panel" className="tabPanel summaryPanel contentPanel">

<ul>
  <li>Bean Validation は、Java の入力検証をドメインモデルに近い場所で宣言的に定義するための仕組みです。</li>
  <li><code>@Valid</code> と各種制約アノテーションを組み合わせ、アプリケーション層をまたいで一貫した検証を行います。</li>
  <li>例ではフィールド制約とコントローラ起点の検証を示しますが、本番環境ではログ記録、エラー表示、例外処理、認可との分離を含めて設計します。</li>
  <li><code>@Pattern</code>、<code>@Digits</code>、<code>@Size</code>、<code>@Past</code>、<code>@Future</code>、<code>@Min</code>、<code>@Max</code> などを用途に合わせて選択します。</li>
  <li>ネストした Bean には <code>@Valid</code> によるカスケード検証を使います。</li>
  <li><code>@SafeHtml</code> は非推奨のため使用しません。</li>
</ul>

  </section>

  <section id="bean-validation-checklist-panel" className="tabPanel checklistPanel contentPanel">

<ul className="checklistView">
  <li><input type="checkbox" disabled />DTO、フォームモデル、ドメインモデルのどこで検証するかを明確にする。</li>
  <li><input type="checkbox" disabled /><code>@Pattern</code>、<code>@Digits</code>、<code>@Size</code>、<code>@Min</code>、<code>@Max</code> などの制約を入力仕様に合わせて定義する。</li>
  <li><input type="checkbox" disabled />サーバー側で <code>@Valid</code> を通じて必ず検証を実行する。</li>
  <li><input type="checkbox" disabled />検証エラー時に `BindingResult` を確認し、HTTP ステータスとエラーメッセージを適切に返す。</li>
  <li><input type="checkbox" disabled />エラーメッセージに内部構造、スタックトレース、機密値を含めない。</li>
  <li><input type="checkbox" disabled />ネストした Bean にはカスケード検証を適用する。</li>
  <li><input type="checkbox" disabled />カスタム制約を追加した場合は、正常系、境界値、異常系をテストする。</li>
  <li><input type="checkbox" disabled /><code>@SafeHtml</code> を新規コードで使用しない。</li>
</ul>

  </section>

  <section id="bean-validation-bilingual-panel" className="tabPanel bilingualPanel">

## Introduction

<div className="bilingualPair">
  <div className="bilingualBlock english">
    <span className="bilingualLabel english">English (原文)</span>
    <p>This article is focused on providing clear, simple, actionable guidance for providing Java Bean Validation security functionality in your applications.</p>
  </div>
  <div className="bilingualBlock japanese">
    <span className="bilingualLabel japanese">日本語 (翻訳)</span>
    <p>この記事は、アプリケーションで Java Bean Validation のセキュリティ機能を提供するための、明確で単純かつ実行可能なガイダンスを示します。</p>
  </div>
</div>

<div className="bilingualPair">
  <div className="bilingualBlock english">
    <span className="bilingualLabel english">English (原文)</span>
    <p>Bean validation (aka <a href="https://beanvalidation.org/">Jakarta Validation</a>) is one of the most common ways to perform <a href="https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html">input validation</a> in Java. It is an application layer agnostic validation spec which provides the developer with the means to define a set of validation constraints on a domain model and then perform validation of those constraints through out the various application tiers.</p>
  </div>
  <div className="bilingualBlock japanese">
    <span className="bilingualLabel japanese">日本語 (翻訳)</span>
    <p>Bean Validation、別名 <a href="https://beanvalidation.org/">Jakarta Validation</a> は、Java で <a href="https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html">入力検証</a> を行う最も一般的な方法の一つです。これはアプリケーション層に依存しない検証仕様であり、開発者がドメインモデル上に検証制約を定義し、その制約をさまざまなアプリケーション層で検証できるようにします。</p>
  </div>
</div>

<div className="bilingualPair">
  <div className="bilingualBlock english">
    <span className="bilingualLabel english">English (原文)</span>
    <p>One advantage of this approach is that the validation constraints and the corresponding validators are only written once, thus reducing duplication of effort and ensuring uniformity:</p>
  </div>
  <div className="bilingualBlock japanese">
    <span className="bilingualLabel japanese">日本語 (翻訳)</span>
    <p>この方式の利点の一つは、検証制約と対応するバリデータを一度だけ記述すればよいことです。これにより作業の重複が減り、一貫性を保てます。</p>
  </div>
</div>

### Typical Validation

![Typical validation flow](/img/owasp-cheatsheets/bean-validation/typical.png)

### Bean Validation

![Bean Validation flow](/img/owasp-cheatsheets/bean-validation/jsr.png)

## Setup

<div className="bilingualPair">
  <div className="bilingualBlock english">
    <span className="bilingualLabel english">English (原文)</span>
    <p>The examples in this guide use Hibernate Validator.</p>
  </div>
  <div className="bilingualBlock japanese">
    <span className="bilingualLabel japanese">日本語 (翻訳)</span>
    <p>このガイドの例では Hibernate Validator を使用します。</p>
  </div>
</div>

<div className="bilingualPair">
  <div className="bilingualBlock english">
    <span className="bilingualLabel english">English (原文)</span>
    <p>Add Hibernate Validator to your <strong>pom.xml</strong>:</p>
  </div>
  <div className="bilingualBlock japanese">
    <span className="bilingualLabel japanese">日本語 (翻訳)</span>
    <p>Hibernate Validator を <strong>pom.xml</strong> に追加します。</p>
  </div>
</div>

```xml
<dependency>
   <groupId>org.hibernate</groupId>
   <artifactId>hibernate-validator</artifactId>
   <version>USE_LATEST_VERSION</version>
</dependency>
```

<div className="bilingualPair">
  <div className="bilingualBlock english">
    <span className="bilingualLabel english">English (原文)</span>
    <p>Enable bean validation support in Spring's <strong>context.xml</strong>:</p>
  </div>
  <div className="bilingualBlock japanese">
    <span className="bilingualLabel japanese">日本語 (翻訳)</span>
    <p>Spring の <strong>context.xml</strong> で Bean Validation サポートを有効にします。</p>
  </div>
</div>

```xml
<beans:beans ...
   ...
   <mvc:annotation-driven />
   ...
</beans:beans>
```

<div className="bilingualPair">
  <div className="bilingualBlock english">
    <span className="bilingualLabel english">English (原文)</span>
    <p>For more info, please see the <a href="https://hibernate.org/validator/documentation/getting-started/">setup guide</a></p>
  </div>
  <div className="bilingualBlock japanese">
    <span className="bilingualLabel japanese">日本語 (翻訳)</span>
    <p>詳細は <a href="https://hibernate.org/validator/documentation/getting-started/">セットアップガイド</a> を参照してください。</p>
  </div>
</div>

## Basics

<div className="bilingualPair">
  <div className="bilingualBlock english">
    <span className="bilingualLabel english">English (原文)</span>
    <p>In order to get started using Bean Validation, you must add validation constraints (<code>@Pattern</code>, <code>@Digits</code>, <code>@Min</code>, <code>@Max</code>, <code>@Size</code>, <code>@Past</code>, <code>@Future</code>, <code>@CreditCardNumber</code>, <code>@Email</code>, <code>@URL</code>, etc.) to your model and then utilize the <code>@Valid</code> annotation when passing your model around in various application layers.</p>
  </div>
  <div className="bilingualBlock japanese">
    <span className="bilingualLabel japanese">日本語 (翻訳)</span>
    <p>Bean Validation を使い始めるには、<code>@Pattern</code>、<code>@Digits</code>、<code>@Min</code>、<code>@Max</code>、<code>@Size</code>、<code>@Past</code>、<code>@Future</code>、<code>@CreditCardNumber</code>、<code>@Email</code>、<code>@URL</code> などの検証制約をモデルに追加し、各アプリケーション層でモデルを渡すときに <code>@Valid</code> アノテーションを使用します。</p>
  </div>
</div>

<div className="bilingualPair">
  <div className="bilingualBlock english">
    <span className="bilingualLabel english">English (原文)</span>
    <p>Constraints can be applied in several places: fields, properties, and classes. For Bean Validation 1.1, they can also be applied to parameters, return values, and constructors.</p>
  </div>
  <div className="bilingualBlock japanese">
    <span className="bilingualLabel japanese">日本語 (翻訳)</span>
    <p>制約は、フィールド、プロパティ、クラスに適用できます。Bean Validation 1.1 では、パラメータ、戻り値、コンストラクタにも適用できます。</p>
  </div>
</div>

<div className="bilingualPair">
  <div className="bilingualBlock english">
    <span className="bilingualLabel english">English (原文)</span>
    <p>For the sake of simplicity all the examples below feature field constraints and all validation is triggered by the controller. Refer to the Bean Validation documentation for a full list of examples.</p>
  </div>
  <div className="bilingualBlock japanese">
    <span className="bilingualLabel japanese">日本語 (翻訳)</span>
    <p>簡潔にするため、以下のすべての例ではフィールド制約を使用し、すべての検証はコントローラによってトリガーされます。例の完全な一覧については Bean Validation のドキュメントを参照してください。</p>
  </div>
</div>

<div className="bilingualPair">
  <div className="bilingualBlock english">
    <span className="bilingualLabel english">English (原文)</span>
    <p>When it comes to error handling, the Hibernate Validator returns a <code>BindingResult</code> object which contains a <code>List&lt;ObjectError&gt;</code>. The examples below feature simplistic error handling, while a production ready application would have a more elaborate design that takes care of logging and error page redirection.</p>
  </div>
  <div className="bilingualBlock japanese">
    <span className="bilingualLabel japanese">日本語 (翻訳)</span>
    <p>エラーハンドリングについては、Hibernate Validator は <code>List&lt;ObjectError&gt;</code> を含む <code>BindingResult</code> オブジェクトを返します。以下の例では単純化したエラーハンドリングを示しますが、本番対応のアプリケーションでは、ログ記録とエラーページへのリダイレクトを考慮した、より丁寧な設計が必要です。</p>
  </div>
</div>

## Predefined Constraints

<div className="bilingualPair">
  <div className="bilingualBlock english">
    <span className="bilingualLabel english">English (原文)</span>
    <p>The predefined constraints below show common Bean Validation annotations, supported data types, intended use, references, and model/controller examples. Code examples are retained from the original page.</p>
  </div>
  <div className="bilingualBlock japanese">
    <span className="bilingualLabel japanese">日本語 (翻訳)</span>
    <p>以下の事前定義済み制約では、一般的な Bean Validation アノテーション、対応データ型、用途、参照先、モデルとコントローラの例を示します。コード例は原文のまま保持しています。</p>
  </div>
</div>

### @Pattern

<div className="bilingualPair">
  <div className="bilingualBlock english">
    <span className="bilingualLabel english">English (原文)</span>
    <p><strong>Annotation:</strong> <code>@Pattern(regex=,flag=)</code><br /><strong>Data Type:</strong> <code>CharSequence</code><br /><strong>Use:</strong> Checks if the annotated string matches the regular expression regex considering the given flag match. Please visit <a href="https://owasp.org/www-community/OWASP_Validation_Regex_Repository">OWASP Validation Regex Repository</a> for other useful regex's.</p>
  </div>
  <div className="bilingualBlock japanese">
    <span className="bilingualLabel japanese">日本語 (翻訳)</span>
    <p><strong>Annotation:</strong> <code>@Pattern(regex=,flag=)</code><br /><strong>Data Type:</strong> <code>CharSequence</code><br /><strong>Use:</strong> 指定されたフラグによる一致条件を考慮し、アノテーションが付いた文字列が正規表現 <code>regex</code> に一致するかを確認します。他の有用な正規表現については <a href="https://owasp.org/www-community/OWASP_Validation_Regex_Repository">OWASP Validation Regex Repository</a> を参照してください。</p>
  </div>
</div>

### @Digits

<div className="bilingualPair">
  <div className="bilingualBlock english">
    <span className="bilingualLabel english">English (原文)</span>
    <p><strong>Annotation:</strong> <code>@Digits(integer=,fraction=)</code><br /><strong>Data Type:</strong> <code>BigDecimal</code>, <code>BigInteger</code>, <code>CharSequence</code>, primitive numeric types and wrappers, plus any subtype of <code>Number</code> supported by Hibernate Validator.<br /><strong>Use:</strong> Checks whether the annotated value is a number having up to integer digits and fraction fractional digits.</p>
  </div>
  <div className="bilingualBlock japanese">
    <span className="bilingualLabel japanese">日本語 (翻訳)</span>
    <p><strong>Annotation:</strong> <code>@Digits(integer=,fraction=)</code><br /><strong>Data Type:</strong> <code>BigDecimal</code>、<code>BigInteger</code>、<code>CharSequence</code>、プリミティブ数値型とそのラッパー、Hibernate Validator がサポートする <code>Number</code> の任意のサブタイプ。<br /><strong>Use:</strong> アノテーションが付いた値が、最大 <code>integer</code> 桁の整数部と <code>fraction</code> 桁の小数部を持つ数値かどうかを確認します。</p>
  </div>
</div>

### @Size

<div className="bilingualPair">
  <div className="bilingualBlock english">
    <span className="bilingualLabel english">English (原文)</span>
    <p><strong>Annotation:</strong> <code>@Size(min=, max=)</code><br /><strong>Data Type:</strong> <code>CharSequence</code>, <code>Collection</code>, <code>Map</code> and arrays.<br /><strong>Use:</strong> Checks if the annotated element's size is between min and max, inclusive.</p>
  </div>
  <div className="bilingualBlock japanese">
    <span className="bilingualLabel japanese">日本語 (翻訳)</span>
    <p><strong>Annotation:</strong> <code>@Size(min=, max=)</code><br /><strong>Data Type:</strong> <code>CharSequence</code>、<code>Collection</code>、<code>Map</code>、配列。<br /><strong>Use:</strong> アノテーションが付いた要素のサイズが <code>min</code> 以上 <code>max</code> 以下であるかを確認します。</p>
  </div>
</div>

### @Past / @Future

<div className="bilingualPair">
  <div className="bilingualBlock english">
    <span className="bilingualLabel english">English (原文)</span>
    <p><strong>Annotation:</strong> <code>@Past</code>, <code>@Future</code><br /><strong>Data Type:</strong> date and time types such as <code>java.util.Date</code>, <code>java.util.Calendar</code>, <code>java.time.Instant</code>, and <code>java.time.OffsetDateTime</code>.<br /><strong>Use:</strong> Checks whether the annotated date is in the past or future.</p>
  </div>
  <div className="bilingualBlock japanese">
    <span className="bilingualLabel japanese">日本語 (翻訳)</span>
    <p><strong>Annotation:</strong> <code>@Past</code>, <code>@Future</code><br /><strong>Data Type:</strong> <code>java.util.Date</code>、<code>java.util.Calendar</code>、<code>java.time.Instant</code>、<code>java.time.OffsetDateTime</code> などの日付時刻型。<br /><strong>Use:</strong> アノテーションが付いた日付が過去または未来であるかを確認します。</p>
  </div>
</div>

### Combining Constraints

<div className="bilingualPair">
  <div className="bilingualBlock english">
    <span className="bilingualLabel english">English (原文)</span>
    <p>Validation annotations can be combined in any suitable way. For instance, to specify a valid <code>reviewRating</code> value between 1 and 5, use <code>@Min(1)</code> and <code>@Max(5)</code>. These constraints check whether the annotated value is higher/lower than or equal to the specified minimum or maximum.</p>
  </div>
  <div className="bilingualBlock japanese">
    <span className="bilingualLabel japanese">日本語 (翻訳)</span>
    <p>検証アノテーションは、適切な方法で組み合わせることができます。たとえば、<code>reviewRating</code> の値を 1 から 5 の範囲に制限するには、<code>@Min(1)</code> と <code>@Max(5)</code> を使用します。これらの制約は、アノテーションが付いた値が指定された最小値以上または最大値以下であるかを確認します。</p>
  </div>
</div>

### Cascading Constraints

<div className="bilingualPair">
  <div className="bilingualBlock english">
    <span className="bilingualLabel english">English (原文)</span>
    <p>Validating one bean is a good start, but often, beans are nested or in a complete graph of beans. To validate that graph in one go, apply cascading validation with <a href="https://docs.jboss.org/hibernate/validator/9.0/reference/en-US/html_single/#_cascaded_validation">@Valid</a>.</p>
  </div>
  <div className="bilingualBlock japanese">
    <span className="bilingualLabel japanese">日本語 (翻訳)</span>
    <p>1つの Bean を検証することは良い出発点ですが、多くの場合、Bean はネストされているか、Bean の完全なグラフを構成しています。そのグラフ全体を一度に検証するには、<a href="https://docs.jboss.org/hibernate/validator/9.0/reference/en-US/html_single/#_cascaded_validation">@Valid</a> によるカスケード検証を適用します。</p>
  </div>
</div>

### Additional Constraints

<div className="bilingualPair">
  <div className="bilingualBlock english">
    <span className="bilingualLabel english">English (原文)</span>
    <p>In addition to providing the complete set of JSR303 constraints, Hibernate Validator also defines additional constraints such as <code>@CreditCardNumber</code>, <code>@EAN</code>, <code>@Email</code>, <code>@Length</code>, <code>@Range</code>, <code>@ScriptAssert</code>, and <code>@URL</code>. Note that <code>@SafeHtml</code>, a previously valid constraint, has been deprecated. Please refrain from using the <code>@SafeHtml</code> constraint.</p>
  </div>
  <div className="bilingualBlock japanese">
    <span className="bilingualLabel japanese">日本語 (翻訳)</span>
    <p>Hibernate Validator は JSR303 制約一式に加えて、<code>@CreditCardNumber</code>、<code>@EAN</code>、<code>@Email</code>、<code>@Length</code>、<code>@Range</code>、<code>@ScriptAssert</code>、<code>@URL</code> などの追加制約も定義しています。以前は有効な制約だった <code>@SafeHtml</code> は非推奨になっています。<code>@SafeHtml</code> 制約の使用は控えてください。</p>
  </div>
</div>

## Custom Constraints

<div className="bilingualPair">
  <div className="bilingualBlock english">
    <span className="bilingualLabel english">English (原文)</span>
    <p>One of the most powerful features of bean validation is the ability to define your own constraints that go beyond the simple validation offered by built-in constraints. Creating custom constraints is beyond the scope of this guide. Please see this <a href="https://docs.jboss.org/hibernate/validator/">documentation</a>.</p>
  </div>
  <div className="bilingualBlock japanese">
    <span className="bilingualLabel japanese">日本語 (翻訳)</span>
    <p>Bean Validation の最も強力な機能の一つは、組み込み制約が提供する単純な検証を超えた、独自の制約を定義できることです。カスタム制約の作成はこのガイドの範囲外です。この <a href="https://docs.jboss.org/hibernate/validator/">ドキュメント</a> を参照してください。</p>
  </div>
</div>

## Error Messages

<div className="bilingualPair">
  <div className="bilingualBlock english">
    <span className="bilingualLabel english">English (原文)</span>
    <p>It is possible to specify a message ID with the validation annotation, so that error messages are customized. Spring MVC will then look up a message with that ID in a defined MessageSource.</p>
  </div>
  <div className="bilingualBlock japanese">
    <span className="bilingualLabel japanese">日本語 (翻訳)</span>
    <p>検証アノテーションでメッセージ ID を指定し、エラーメッセージをカスタマイズできます。Spring MVC は、定義済みの <code>MessageSource</code> からその ID のメッセージを検索します。</p>
  </div>
</div>

```java
@Pattern(regexp = "[a-zA-Z0-9 ]", message="article.title.error")
private String articleTitle;
```

  </section>
</div>

## Attribution

<div className="attributionFooter">

- Original: Bean Validation Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Bean_Validation_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: English original retained for comparison. Japanese translation added. Source images stored locally.
- Images:
  - `static/img/owasp-cheatsheets/bean-validation/typical.png` from https://github.com/OWASP/CheatSheetSeries/blob/master/assets/Bean_Validation_Cheat_Sheet_Typical.png
  - `static/img/owasp-cheatsheets/bean-validation/jsr.png` from https://github.com/OWASP/CheatSheetSeries/blob/master/assets/Bean_Validation_Cheat_Sheet_JSR.png
- Retrieved: 2026-05-20

</div>
