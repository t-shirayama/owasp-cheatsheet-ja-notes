# Bean Validation チートシート 日本語訳

## Attribution

- Original: Bean Validation Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Bean_Validation_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-21

## 日本語訳

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


## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V1.2 | Bean Validation による入力検証制約、フィールド・プロパティ・クラス・パラメータ・戻り値・コンストラクタの検証 |
