---
title: Bean Validation Cheat Sheet
hide_title: true
---

<div className="docHero" data-category="encoding-and-sanitization">
  <h1>Bean Validation チートシート</h1>
  <div className="docMeta">
    <span className="docPill">最終更新: 2026-05-20</span>
    <span className="docPill">読了時間: 約 12 分</span>
    <span className="docPill">カテゴリ: 入力検証とサニタイズ</span>
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

Bean Validation は、Java アプリケーションでオブジェクトや入力値に対する制約を宣言的に定義するための仕組みです。型、範囲、形式、必須条件をモデルに近い場所で表現できます。

## 要点

- 入力値の制約をアノテーションとして明示する。
- 境界値、null、文字列長、形式を検証する。
- Bean Validationだけで認可や出力エンコードを代替しない。

## 実装時の注意点

- この要約はASVS Indexでの利用を前提にした実装者向け整理です。詳細確認時は原文を参照してください。
- 関連する認証、認可、ログ、入力検証、暗号、通信保護の管理策と組み合わせて適用します。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V1.2 | Bean Validation チートシート の主要な管理策 |

</section>

<section id="bean-validation-checklist-panel" className="tabPanel checklistPanel contentPanel">

- [ ] DTOやフォームモデルに制約を定義する。
- [ ] サーバー側で必ず検証を実行する。
- [ ] カスタムバリデータをテストする。
- [ ] エラーメッセージに内部情報を含めない。
- [ ] 検証後の値も出力先に応じてエンコードする。

</section>

<section id="bean-validation-bilingual-panel" className="tabPanel bilingualPanel">

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Introduction

This article is focused on providing clear, simple, actionable guidance for providing Java Bean Validation security functionality in your applications.

Bean validation (aka [Jakarta Validation](https://beanvalidation.org/)) is one of the most common ways to perform [input validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html) in Java. It is an application layer agnostic validation spec which provides the developer with the means to define a set of validation constraints on a domain model and then perform validation of those constraints through out the various application tiers.

One advantage of this approach is that the validation constraints and the corresponding validators are only written once, thus reducing duplication of effort and ensuring uniformity:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## Introduction

この記事は、アプリケーションで Java Bean Validation のセキュリティ機能を提供するための、明確で単純かつ実行可能なガイダンスを示します。

Bean Validation、別名 [Jakarta Validation](https://beanvalidation.org/) は、Java で [入力検証](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html) を行う最も一般的な方法の一つです。これはアプリケーション層に依存しない検証仕様であり、開発者がドメインモデル上に検証制約を定義し、その制約をさまざまなアプリケーション層で検証できるようにします。

この方式の利点の一つは、検証制約と対応するバリデータを一度だけ記述すればよいことです。これにより作業の重複が減り、一貫性を保てます。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>
### Typical Validation


![Typical](/img/owasp-cheatsheets/bean-validation/typical.png)

</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>
### Bean Validation


![JSR](/img/owasp-cheatsheets/bean-validation/jsr.png)

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Setup

The examples in this guide use Hibernate Validator.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## Setup

このガイドの例では Hibernate Validator を使用します。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>
### Add Hibernate Validator to your **pom.xml**


```xml
<dependency>
   <groupId>org.hibernate</groupId>
   <artifactId>hibernate-validator</artifactId>
   <version>USE_LATEST_VERSION</version>
</dependency>
```

</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>
#### Enable bean validation support in Spring's **context.xml**


```xml
<beans:beans ...
   ...
   <mvc:annotation-driven />
   ...
</beans:beans>
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

For more info, please see the [setup guide](https://hibernate.org/validator/documentation/getting-started/)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

詳細は [セットアップガイド](https://hibernate.org/validator/documentation/getting-started/) を参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Basics

In order to get started using Bean Validation, you must add validation constraints (`@Pattern`, `@Digits`, `@Min`, `@Max`, `@Size`, `@Past`, `@Future`, `@CreditCardNumber`, `@Email`, `@URL`, etc.) to your model and then utilize the `@Valid` annotation when passing your model around in various application layers.

Constraints can be applied in several places:

- Fields
- Properties
- Classes

For Bean Validation 1.1 also on:

- Parameters
- Return values
- Constructors

For the sake of simplicity all the examples below feature field constraints and all validation is triggered by the controller. Refer to the Bean Validation documentation for a full list of examples.

When it comes to error handling, the Hibernate Validator returns a `BindingResult` object which contains a `List&lt;ObjectError>`. The examples below feature simplistic error handling, while a production ready application would have a more elaborate design that takes care of logging and error page redirection.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

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

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Predefined Constraints

### @Pattern

**Annotation**:

`@Pattern(regex=,flag=)`

**Data Type**:

`CharSequence`

**Use**:

Checks if the annotated string matches the regular expression regex considering the given flag match. Please visit [OWASP Validation Regex Repository](https://owasp.org/www-community/OWASP_Validation_Regex_Repository) for other useful regex's.

**Reference**:

[Documentation](https://docs.jboss.org/hibernate/validator/5.2/reference/en-US/html/ch02.html#section-builtin-constraints)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

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

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>
#### Model


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

</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>
#### Controller


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

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### @Digits

**Annotation**:

`@Digits(integer=,fraction=)`

**Data Type**:

`BigDecimal`, `BigInteger`, `CharSequence`, `byte`, `short`, `int`, `long` and the respective wrappers of the primitive types; Additionally supported by HV: any sub-type of Number

**Use**:

Checks whether the annotated value is a number having up to integer digits and fraction fractional digits

**Reference**:

[Documentation](https://docs.jboss.org/hibernate/validator/5.2/reference/en-US/html/ch02.html#section-builtin-constraints)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### @Digits

**Annotation**:

`@Digits(integer=,fraction=)`

**Data Type**:

`BigDecimal`、`BigInteger`、`CharSequence`、`byte`、`short`、`int`、`long` と、それぞれのプリミティブ型のラッパー。Hibernate Validator ではさらに `Number` の任意のサブタイプもサポートされます。

**Use**:

アノテーションが付いた値が、最大 `integer` 桁の整数部と `fraction` 桁の小数部を持つ数値かどうかを確認します。

**Reference**:

[Documentation](https://docs.jboss.org/hibernate/validator/5.2/reference/en-US/html/ch02.html#section-builtin-constraints)

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>
#### Model


```java
import org.hibernate.validator.constraints.Digits;

public class Customer {
  //Constraint: Age can only be 3 digits long or less
  @Digits(integer = 3, fraction = 0)
  private int age;

  public String getAge()  {
    return age;
  }

  public void setAge(String age)  {
      this.age = age;
    }

    ...
}
```

</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>
#### Controller


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

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### @Size

**Annotation**:

`@Size(min=,` `max=)`

**Data Type**:

`CharSequence`, `Collection`, `Map` and `Arrays`

**Use**:

Checks if the annotated element's size is between min and max (inclusive)

**Reference**:

[Documentation](https://docs.jboss.org/hibernate/validator/5.2/reference/en-US/html/ch02.html#section-builtin-constraints)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### @Size

**Annotation**:

`@Size(min=, max=)`

**Data Type**:

`CharSequence`、`Collection`、`Map`、配列

**Use**:

アノテーションが付いた要素のサイズが `min` 以上 `max` 以下であるかを確認します。

**Reference**:

[Documentation](https://docs.jboss.org/hibernate/validator/5.2/reference/en-US/html/ch02.html#section-builtin-constraints)

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>
#### Model


```java
import org.hibernate.validator.constraints.Size;

public class Message {

   //Constraint: Message must be at least 10 characters long, but less than 500
   @Size(min = 10, max = 500)
   private String message;

   public String getMessage() {
      return message;
   }

   public void setMessage(String message) {
      this.message = message;
   }

...
}
```

</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>
#### Controller


```java
import javax.validation.Valid;
import com.company.app.model.Message;

@Controller
public class MessageController {

...

@RequestMapping(value="/sendMessage", method=RequestMethod.POST)
public @ResponseBody String sendMessage(@Valid Message message, BindingResult result,
HttpServletResponse response){

   if(result.hasErrors()){
      String errorMessage = "";
      response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
      List<ObjectError> errors = result.getAllErrors();
      for( ObjectError e : errors){
         errorMessage+= "ERROR: " + e.getDefaultMessage();
      }
      return errorMessage;
   }
   else{
      return "Validation Successful";
   }
}
}
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### @Past / @Future

**Annotation**:

`@Past,` `@Future`

**Data Type**:

`java.util.Date`, `java.util.Calendar`, `java.time.chrono.ChronoZonedDateTime`, `java.time.Instant`, `java.time.OffsetDateTime`

**Use**:

Checks whether the annotated date is in the past / future

**Reference**:

[Documentation](https://docs.jboss.org/hibernate/validator/5.2/reference/en-US/html/ch02.html#section-builtin-constraints)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### @Past / @Future

**Annotation**:

`@Past`, `@Future`

**Data Type**:

`java.util.Date`、`java.util.Calendar`、`java.time.chrono.ChronoZonedDateTime`、`java.time.Instant`、`java.time.OffsetDateTime`

**Use**:

アノテーションが付いた日付が過去または未来であるかを確認します。

**Reference**:

[Documentation](https://docs.jboss.org/hibernate/validator/5.2/reference/en-US/html/ch02.html#section-builtin-constraints)

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>
#### Model


```java
import org.hibernate.validator.constraints.Past;
import org.hibernate.validator.constraints.Future;

public class DoctorVisit {

   //Constraint: Birthdate must be in the past
   @Past
   private Date birthDate;

   public Date getBirthDate() {
      return birthDate;
   }

   public void setBirthDate(Date birthDate) {
      this.birthDate = birthDate;
   }

   //Constraint: Schedule visit date must be in the future
   @Future
   private String scheduledVisitDate;

   public String getScheduledVisitDate() {
      return scheduledVisitDate;
   }

   public void setScheduledVisitDate(String scheduledVisitDate) {
      this.scheduledVisitDate = scheduledVisitDate;
   }

...
}
```

</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>
#### Controller


```java
import javax.validation.Valid;
import com.company.app.model.DoctorVisit;

@Controller
public class DoctorVisitController {

   ...

   @RequestMapping(value="/scheduleVisit", method=RequestMethod.POST)
   public @ResponseBody String scheduleVisit(@Valid DoctorVisit doctorvisit, BindingResult result,
   HttpServletResponse response){

      if(result.hasErrors()){
         String errorMessage = "";
         response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
         List<ObjectError> errors = result.getAllErrors();
         for( ObjectError e : errors){
            errorMessage+= "ERROR: " + e.getDefaultMessage();
         }
         return errorMessage;
      }
      else{
         return "Validation Successful";
      }
   }
}
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Combining Constraints

Validation annotations can be combined in any suitable way. For instance, to specify a valid reviewRating value between 1 and 5, specify the validation like this :

**Annotation**:

`@Min(value=),` `@Max(value=)`

**Data Type**:

`BigDecimal`, `BigInteger`, `byte`, `short`, `int`, `long` and the respective wrappers of the primitive types; Additionally supported by HV: any sub-type of `CharSequence` (the numeric value represented by the character sequence is evaluated), any sub-type of Number

**Use**:

Checks whether the annotated value is higher/lower than or equal to the specified minimum

**Reference:**

[Documentation](https://docs.jboss.org/hibernate/validator/9.0/reference/en-US/html_single/#section-builtin-constraints)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

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

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>
#### Model


```java
import org.hibernate.validator.constraints.Min;
import org.hibernate.validator.constraints.Max;

public class Review {

 //Constraint: Review rating must be between 1 and 5
 @Min(1)
 @Max(5)
 private int reviewRating;

 public int getReviewRating() {
   return reviewRating;
 }

 public void setReviewRating(int reviewRating) {
   this.reviewRating = reviewRating;
}
 ...
}
```

</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>
#### Controller


```java
import javax.validation.Valid;
import com.company.app.model.ReviewRating;

@Controller
public class ReviewController {

   ...

   @RequestMapping(value="/postReview", method=RequestMethod.POST)
   public @ResponseBody String postReview(@Valid Review review, BindingResult result,
   HttpServletResponse response){

      if(result.hasErrors()){
         String errorMessage = "";
         response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
         List<ObjectError> errors = result.getAllErrors();
         for( ObjectError e : errors){
            errorMessage+= "ERROR: " + e.getDefaultMessage();
         }
         return errorMessage;
      }
       else{
         return "Validation Successful";
      }
   }
}
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Cascading Constraints

Validating one bean is a good start, but often, beans are nested or in a complete graph of beans. To validate that graph in one go, apply cascading validation with [@Valid](https://docs.jboss.org/hibernate/validator/9.0/reference/en-US/html_single/#_cascaded_validation)

### Additional Constraints

In addition to providing the complete set of JSR303 constraints, Hibernate Validator also defines some additional constraints for convenience:

- `@CreditCardNumber`
- `@EAN`
- `@Email`
- `@Length`
- `@Range`
- `@ScriptAssert`
- `@URL`

Take a look at this [list](https://docs.jboss.org/hibernate/validator/9.0/reference/en-US/html_single/#validator-defineconstraints-hv-constraints) for the complete list.

Note that `@SafeHtml`, a previously valid constraint, has been deprecated according to the [Hibernate Validator 6.1.0.Final and 6.0.18.Final release blogpost](https://in.relation.to/2019/11/20/hibernate-validator-610-6018-released/). Please refrain from using the `@SafeHtml` constraint.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

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

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Custom Constraints

One of the most powerful features of bean validation is the ability to define your own constraints that go beyond the simple validation offered by built-in constraints.

Creating custom constraints is beyond the scope of this guide. Please see this [documentation](https://docs.jboss.org/hibernate/validator/).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## Custom Constraints

Bean Validation の最も強力な機能の一つは、組み込み制約が提供する単純な検証を超えた、独自の制約を定義できることです。

カスタム制約の作成はこのガイドの範囲外です。この [ドキュメント](https://docs.jboss.org/hibernate/validator/) を参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Error Messages

It is possible to specify a message ID with the validation annotation, so that error messages are customized :

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## Error Messages

検証アノテーションでメッセージ ID を指定し、エラーメッセージをカスタマイズできます。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>


```java
@Pattern(regexp = "[a-zA-Z0-9 ]", message="article.title.error")
private String articleTitle;
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Spring MVC will then look up a message with ID *article.title.error* in a defined MessageSource. More on this [documentation](https://www.silverbaytech.com/2013/04/16/custom-messages-in-spring-validation/).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Spring MVC は、定義済みの `MessageSource` から ID `article.title.error` のメッセージを検索します。詳しくはこの [ドキュメント](https://www.silverbaytech.com/2013/04/16/custom-messages-in-spring-validation/) を参照してください。

</div>
</div>

</section>
</div>

## Attribution

<div className="attributionFooter">

- Original: Bean Validation Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Bean_Validation_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: English original retained for comparison. Japanese translation added. Bilingual display generated from official source and local Japanese notes.
- Retrieved: 2026-05-20

</div>
