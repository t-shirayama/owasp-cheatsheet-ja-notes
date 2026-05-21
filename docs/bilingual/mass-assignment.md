---
title: Mass Assignment Cheat Sheet
hide_title: true
---

<div className="docHero" data-category="asvs-v15">
  <h1>Mass Assignment チートシート</h1>
  <div className="docMeta">
    <span className="docPill">最終更新: 2026-05-20</span>
    <span className="docPill">読了時間: 準備中</span>
    <span className="docPill">カテゴリ: セキュアコーディングとアーキテクチャ</span>
  </div>
</div>

<p className="docLead">Mass Assignment チートシートを、原文・翻訳・対比表示で確認できます。ASVS Index 対応の文脈で、公式原文と日本語訳を確認しやすく整理しています。</p>

<div className="tabbedContent">
  <input className="tabInput" type="radio" name="mass-assignment-view" id="mass-assignment-original" />
  <input className="tabInput" type="radio" name="mass-assignment-view" id="mass-assignment-translation" defaultChecked />
  <input className="tabInput" type="radio" name="mass-assignment-view" id="mass-assignment-bilingual" />

  <div className="contentTabs">
    <label htmlFor="mass-assignment-original" title="OWASP 原文">原文</label>
    <label htmlFor="mass-assignment-translation" title="日本語訳">翻訳</label>
    <label htmlFor="mass-assignment-bilingual" title="原文と翻訳を並べて確認">対比表示</label>
  </div>

<section id="mass-assignment-original-panel" className="tabPanel originalPanel contentPanel">

## Introduction

### Definition

Software frameworks sometimes allow developers to automatically bind HTTP request parameters into program code variables or objects to make using that framework easier on developers. This can sometimes cause harm.

Attackers can sometimes use this methodology to create new parameters that the developer never intended which in turn creates or overwrites new variable or objects in program code that was not intended.

This is called a **Mass Assignment** vulnerability.

### Alternative Names

Depending on the language/framework in question, this vulnerability can have several [alternative names](https://cwe.mitre.org/data/definitions/915.html):

- **Mass Assignment:** Ruby on Rails, NodeJS.
- **Autobinding:** Spring MVC, ASP NET MVC.
- **Object injection:** PHP.

### Example

Suppose there is a form for editing a user's account information:

```html
<form>
     <input name="userid" type="text">
     <input name="password" type="text">
     <input name="email" text="text">
     <input type="submit">
</form>  
```text

Here is the object that the form is binding to:

```java
public class User {
   private String userid;
   private String password;
   private String email;
   private boolean isAdmin;

   //Getters & Setters
}
```text

Here is the controller handling the request:

```java
@RequestMapping(value = "/addUser", method = RequestMethod.POST)
public String submit(User user) {
   userService.add(user);
   return "successPage";
}
```text

Here is the typical request:

```text
POST /addUser
...
userid=bobbytables&password=hashedpass&email=bobby@tables.com
```text

And here is the exploit in which we set the value of the attribute `isAdmin` of the instance of the class `User`:

```text
POST /addUser
...
userid=bobbytables&password=hashedpass&email=bobby@tables.com&isAdmin=true
```text

### Exploitability

This functionality becomes exploitable when:

- Attacker can guess common sensitive fields.
- Attacker has access to source code and can review the models for sensitive fields.
- AND the object with sensitive fields has an empty constructor.

### GitHub case study

In 2012, GitHub was hacked using mass assignment. A user was able to upload his public key to any organization and thus make any subsequent changes in their repositories. [GitHub's Blog Post](https://blog.github.com/2012-03-04-public-key-security-vulnerability-and-mitigation/).

### Solutions

- Allow-list the bindable, non-sensitive fields.
- Block-list the non-bindable, sensitive fields.
- Use [Data Transfer Objects](https://martinfowler.com/eaaCatalog/dataTransferObject.html) (DTOs).

## General Solutions

An architectural approach is to create Data Transfer Objects and avoid binding input directly to domain objects. Only the fields that are meant to be editable by the user are included in the DTO.

```java
public class UserRegistrationFormDTO {
 private String userid;
 private String password;
 private String email;

 //NOTE: isAdmin field is not present

 //Getters & Setters
}
```text

## Language & Framework specific solutions

### Spring MVC

#### Allow-listing

```java
@Controller
public class UserController
{
    @InitBinder
    public void initBinder(WebDataBinder binder, WebRequest request)
    {
        binder.setAllowedFields(["userid","password","email"]);
    }
...
}
```text

Take a look [here](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/validation/DataBinder.html#setAllowedFields-java.lang.String...-) for the documentation.

#### Block-listing

```java
@Controller
public class UserController
{
   @InitBinder
   public void initBinder(WebDataBinder binder, WebRequest request)
   {
      binder.setDisallowedFields(["isAdmin"]);
   }
...
}
```text

Take a look [here](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/validation/DataBinder.html#setDisallowedFields-java.lang.String...-) for the documentation.

### NodeJS + Mongoose

#### Allow-listing

```javascript
var UserSchema = new mongoose.Schema({
    userid: String,
    password: String,
    email : String,
    isAdmin : Boolean,
});

UserSchema.statics = {
    User.userCreateSafeFields: ['userid', 'password', 'email']
};

var User = mongoose.model('User', UserSchema);

_ = require('underscore');
var user = new User(_.pick(req.body, User.userCreateSafeFields));
```text

Take a look [here](http://underscorejs.org/#pick) for the documentation.

#### Block-listing

```javascript
var massAssign = require('mongoose-mass-assign');

var UserSchema = new mongoose.Schema({
    userid: String,
    password: String,
    email : String,
    isAdmin : { type: Boolean, protect: true, default: false }
});

UserSchema.plugin(massAssign);

var User = mongoose.model('User', UserSchema);

/** Static method, useful for creation **/
var user = User.massAssign(req.body);

/** Instance method, useful for updating**/
var user = new User;
user.massAssign(req.body);

/** Static massUpdate method **/
var input = { userid: 'bhelx', isAdmin: 'true' };
User.update({ '_id': someId }, { $set: User.massUpdate(input) }, console.log);
```text

Take a look [here](https://www.npmjs.com/package/mongoose-mass-assign) for the documentation.

### Ruby On Rails

Take a look [here](https://guides.rubyonrails.org/v3.2.9/security.html#mass-assignment) for the documentation.

### Django

Take a look [here](https://coffeeonthekeyboard.com/mass-assignment-security-part-10-855/) for the documentation.

### ASP NET

Take a look [here](https://odetocode.com/Blogs/scott/archive/2012/03/11/complete-guide-to-mass-assignment-in-asp-net-mvc.aspx) for the documentation.

### PHP Laravel + Eloquent

#### Allow-listing

```php
<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    private $userid;
    private $password;
    private $email;
    private $isAdmin;

    protected $fillable = array('userid','password','email');
}
```text

Take a look [here](https://laravel.com/docs/5.2/eloquent#mass-assignment) for the documentation.

#### Block-listing

```php
<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    private $userid;
    private $password;
    private $email;
    private $isAdmin;

    protected $guarded = array('isAdmin');
}
```text

Take a look [here](https://laravel.com/docs/5.2/eloquent#mass-assignment) for the documentation.

### Grails

Take a look [here](http://spring.io/blog/2012/03/28/secure-data-binding-with-grails/) for the documentation.

### Play

Take a look [here](https://www.playframework.com/documentation/1.4.x/controllers#nobinding) for the documentation.

### Jackson (JSON Object Mapper)

Take a look [here](https://www.baeldung.com/jackson-field-serializable-deserializable-or-not) and [here](http://lifelongprogrammer.blogspot.com/2015/09/using-jackson-view-to-protect-mass-assignment.html) for the documentation.

### GSON (JSON Object Mapper)

Take a look [here](https://sites.google.com/site/gson/gson-user-guide#TOC-Excluding-Fields-From-Serialization-and-Deserialization) and [here](https://stackoverflow.com/a/27986860) for the document.

### JSON-Lib (JSON Object Mapper)

Take a look [here](http://json-lib.sourceforge.net/advanced.html) for the documentation.

### Flexjson (JSON Object Mapper)

Take a look [here](http://flexjson.sourceforge.net/#Serialization) for the documentation.

</section>

<section id="mass-assignment-translation-panel" className="tabPanel translationPanel contentPanel">

## はじめに

### 定義

ソフトウェアフレームワークは、開発者がそのフレームワークを使いやすくするため、HTTP リクエストパラメータをプログラムコード内の変数やオブジェクトへ自動的にバインドできることがあります。これは、ときに害をもたらす可能性があります。

攻撃者はこの仕組みを使い、開発者が意図していない新しいパラメータを作成することがあります。その結果、プログラムコード内で意図されていない変数やオブジェクトが新規作成されたり、上書きされたりします。

これは **Mass Assignment** 脆弱性と呼ばれます。

### 別名

対象の言語やフレームワークによって、この脆弱性には複数の[別名](https://cwe.mitre.org/data/definitions/915.html)があります。

- **Mass Assignment:** Ruby on Rails、NodeJS。
- **Autobinding:** Spring MVC、ASP NET MVC。
- **Object injection:** PHP。

### 例

ユーザーのアカウント情報を編集するフォームがあるとします。

```html
<form>
     <input name="userid" type="text">
     <input name="password" type="text">
     <input name="email" text="text">
     <input type="submit">
</form>  
```text

このフォームがバインドされるオブジェクトは次のとおりです。

```java
public class User {
   private String userid;
   private String password;
   private String email;
   private boolean isAdmin;

   //Getters & Setters
}
```text

リクエストを処理するコントローラーは次のとおりです。

```java
@RequestMapping(value = "/addUser", method = RequestMethod.POST)
public String submit(User user) {
   userService.add(user);
   return "successPage";
}
```text

通常のリクエストは次のとおりです。

```text
POST /addUser
...
userid=bobbytables&password=hashedpass&email=bobby@tables.com
```text

そして、クラス `User` のインスタンスの属性 `isAdmin` の値を設定する悪用例は次のとおりです。

```text
POST /addUser
...
userid=bobbytables&password=hashedpass&email=bobby@tables.com&isAdmin=true
```text

### 悪用可能性

この機能は、次の場合に悪用可能になります。

- 攻撃者が一般的な機密フィールドを推測できる。
- 攻撃者がソースコードへアクセスでき、モデル内の機密フィールドを確認できる。
- かつ、機密フィールドを持つオブジェクトに空のコンストラクタがある。

### GitHub のケーススタディ

2012 年、GitHub はマスアサインメントを使って攻撃されました。あるユーザーは任意の organization に自分の公開鍵をアップロードでき、それにより、その organization のリポジトリへ以後の変更を行えるようになりました。[GitHub のブログ記事](https://blog.github.com/2012-03-04-public-key-security-vulnerability-and-mitigation/)を参照してください。

### 解決策

- バインド可能な非機密フィールドを許可リスト化する。
- バインド不可の機密フィールドを禁止リスト化する。
- [Data Transfer Objects](https://martinfowler.com/eaaCatalog/dataTransferObject.html) (DTO) を使用する。

## 一般的な解決策

アーキテクチャ上のアプローチとして、Data Transfer Object を作成し、入力をドメインオブジェクトへ直接バインドしないようにします。DTO には、ユーザーが編集することを意図したフィールドだけを含めます。

```java
public class UserRegistrationFormDTO {
 private String userid;
 private String password;
 private String email;

 //NOTE: isAdmin field is not present

 //Getters & Setters
}
```text

## 言語およびフレームワーク固有の解決策

### Spring MVC

#### 許可リスト化

```java
@Controller
public class UserController
{
    @InitBinder
    public void initBinder(WebDataBinder binder, WebRequest request)
    {
        binder.setAllowedFields(["userid","password","email"]);
    }
...
}
```text

ドキュメントは[こちら](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/validation/DataBinder.html#setAllowedFields-java.lang.String...-)を参照してください。

#### 禁止リスト化

```java
@Controller
public class UserController
{
   @InitBinder
   public void initBinder(WebDataBinder binder, WebRequest request)
   {
      binder.setDisallowedFields(["isAdmin"]);
   }
...
}
```text

ドキュメントは[こちら](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/validation/DataBinder.html#setDisallowedFields-java.lang.String...-)を参照してください。

### NodeJS + Mongoose

#### 許可リスト化

```javascript
var UserSchema = new mongoose.Schema({
    userid: String,
    password: String,
    email : String,
    isAdmin : Boolean,
});

UserSchema.statics = {
    User.userCreateSafeFields: ['userid', 'password', 'email']
};

var User = mongoose.model('User', UserSchema);

_ = require('underscore');
var user = new User(_.pick(req.body, User.userCreateSafeFields));
```text

ドキュメントは[こちら](http://underscorejs.org/#pick)を参照してください。

#### 禁止リスト化

```javascript
var massAssign = require('mongoose-mass-assign');

var UserSchema = new mongoose.Schema({
    userid: String,
    password: String,
    email : String,
    isAdmin : { type: Boolean, protect: true, default: false }
});

UserSchema.plugin(massAssign);

var User = mongoose.model('User', UserSchema);

/** Static method, useful for creation **/
var user = User.massAssign(req.body);

/** Instance method, useful for updating**/
var user = new User;
user.massAssign(req.body);

/** Static massUpdate method **/
var input = { userid: 'bhelx', isAdmin: 'true' };
User.update({ '_id': someId }, { $set: User.massUpdate(input) }, console.log);
```text

ドキュメントは[こちら](https://www.npmjs.com/package/mongoose-mass-assign)を参照してください。

### Ruby On Rails

ドキュメントは[こちら](https://guides.rubyonrails.org/v3.2.9/security.html#mass-assignment)を参照してください。

### Django

ドキュメントは[こちら](https://coffeeonthekeyboard.com/mass-assignment-security-part-10-855/)を参照してください。

### ASP NET

ドキュメントは[こちら](https://odetocode.com/Blogs/scott/archive/2012/03/11/complete-guide-to-mass-assignment-in-asp-net-mvc.aspx)を参照してください。

### PHP Laravel + Eloquent

#### 許可リスト化

```php
<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    private $userid;
    private $password;
    private $email;
    private $isAdmin;

    protected $fillable = array('userid','password','email');
}
```text

ドキュメントは[こちら](https://laravel.com/docs/5.2/eloquent#mass-assignment)を参照してください。

#### 禁止リスト化

```php
<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    private $userid;
    private $password;
    private $email;
    private $isAdmin;

    protected $guarded = array('isAdmin');
}
```text

ドキュメントは[こちら](https://laravel.com/docs/5.2/eloquent#mass-assignment)を参照してください。

### Grails

ドキュメントは[こちら](http://spring.io/blog/2012/03/28/secure-data-binding-with-grails/)を参照してください。

### Play

ドキュメントは[こちら](https://www.playframework.com/documentation/1.4.x/controllers#nobinding)を参照してください。

### Jackson (JSON Object Mapper)

ドキュメントは[こちら](https://www.baeldung.com/jackson-field-serializable-deserializable-or-not)と[こちら](http://lifelongprogrammer.blogspot.com/2015/09/using-jackson-view-to-protect-mass-assignment.html)を参照してください。

### GSON (JSON Object Mapper)

ドキュメントは[こちら](https://sites.google.com/site/gson/gson-user-guide#TOC-Excluding-Fields-From-Serialization-and-Deserialization)と[こちら](https://stackoverflow.com/a/27986860)を参照してください。

### JSON-Lib (JSON Object Mapper)

ドキュメントは[こちら](http://json-lib.sourceforge.net/advanced.html)を参照してください。

### Flexjson (JSON Object Mapper)

ドキュメントは[こちら](http://flexjson.sourceforge.net/#Serialization)を参照してください。

## 参考文献と今後の読み物

- [Mass Assignment, Rails and You](https://code.tutsplus.com/tutorials/mass-assignment-rails-and-you--net-31695)

</section>

<section id="mass-assignment-bilingual-panel" className="tabPanel bilingualPanel">

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Introduction

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## はじめに

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Definition

Software frameworks sometimes allow developers to automatically bind HTTP request parameters into program code variables or objects to make using that framework easier on developers. This can sometimes cause harm.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 定義

ソフトウェアフレームワークは、開発者がそのフレームワークを使いやすくするため、HTTP リクエストパラメータをプログラムコード内の変数やオブジェクトへ自動的にバインドできることがあります。これは、ときに害をもたらす可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Attackers can sometimes use this methodology to create new parameters that the developer never intended which in turn creates or overwrites new variable or objects in program code that was not intended.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

攻撃者はこの仕組みを使い、開発者が意図していない新しいパラメータを作成することがあります。その結果、プログラムコード内で意図されていない変数やオブジェクトが新規作成されたり、上書きされたりします。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

This is called a **Mass Assignment** vulnerability.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

これは **Mass Assignment** 脆弱性と呼ばれます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Alternative Names

Depending on the language/framework in question, this vulnerability can have several [alternative names](https://cwe.mitre.org/data/definitions/915.html):

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 別名

対象の言語やフレームワークによって、この脆弱性には複数の[別名](https://cwe.mitre.org/data/definitions/915.html)があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- **Mass Assignment:** Ruby on Rails, NodeJS.
- **Autobinding:** Spring MVC, ASP NET MVC.
- **Object injection:** PHP.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- **Mass Assignment:** Ruby on Rails、NodeJS。
- **Autobinding:** Spring MVC、ASP NET MVC。
- **Object injection:** PHP。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Example

Suppose there is a form for editing a user's account information:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 例

ユーザーのアカウント情報を編集するフォームがあるとします。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<form>
     <input name="userid" type="text">
     <input name="password" type="text">
     <input name="email" text="text">
     <input type="submit">
</form>  
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Here is the object that the form is binding to:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

このフォームがバインドされるオブジェクトは次のとおりです。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```java
public class User {
   private String userid;
   private String password;
   private String email;
   private boolean isAdmin;

   //Getters & Setters
}
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Here is the controller handling the request:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

リクエストを処理するコントローラーは次のとおりです。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```java
@RequestMapping(value = "/addUser", method = RequestMethod.POST)
public String submit(User user) {
   userService.add(user);
   return "successPage";
}
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Here is the typical request:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

通常のリクエストは次のとおりです。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```text
POST /addUser
...
userid=bobbytables&password=hashedpass&email=bobby@tables.com
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

And here is the exploit in which we set the value of the attribute `isAdmin` of the instance of the class `User`:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

そして、クラス `User` のインスタンスの属性 `isAdmin` の値を設定する悪用例は次のとおりです。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```text
POST /addUser
...
userid=bobbytables&password=hashedpass&email=bobby@tables.com&isAdmin=true
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Exploitability

This functionality becomes exploitable when:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 悪用可能性

この機能は、次の場合に悪用可能になります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Attacker can guess common sensitive fields.
- Attacker has access to source code and can review the models for sensitive fields.
- AND the object with sensitive fields has an empty constructor.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- 攻撃者が一般的な機密フィールドを推測できる。
- 攻撃者がソースコードへアクセスでき、モデル内の機密フィールドを確認できる。
- かつ、機密フィールドを持つオブジェクトに空のコンストラクタがある。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### GitHub case study

In 2012, GitHub was hacked using mass assignment. A user was able to upload his public key to any organization and thus make any subsequent changes in their repositories. [GitHub's Blog Post](https://blog.github.com/2012-03-04-public-key-security-vulnerability-and-mitigation/).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### GitHub のケーススタディ

2012 年、GitHub はマスアサインメントを使って攻撃されました。あるユーザーは任意の organization に自分の公開鍵をアップロードでき、それにより、その organization のリポジトリへ以後の変更を行えるようになりました。[GitHub のブログ記事](https://blog.github.com/2012-03-04-public-key-security-vulnerability-and-mitigation/)を参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Solutions

- Allow-list the bindable, non-sensitive fields.
- Block-list the non-bindable, sensitive fields.
- Use [Data Transfer Objects](https://martinfowler.com/eaaCatalog/dataTransferObject.html) (DTOs).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 解決策

- バインド可能な非機密フィールドを許可リスト化する。
- バインド不可の機密フィールドを禁止リスト化する。
- [Data Transfer Objects](https://martinfowler.com/eaaCatalog/dataTransferObject.html) (DTO) を使用する。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## General Solutions

An architectural approach is to create Data Transfer Objects and avoid binding input directly to domain objects. Only the fields that are meant to be editable by the user are included in the DTO.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 一般的な解決策

アーキテクチャ上のアプローチとして、Data Transfer Object を作成し、入力をドメインオブジェクトへ直接バインドしないようにします。DTO には、ユーザーが編集することを意図したフィールドだけを含めます。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```java
public class UserRegistrationFormDTO {
 private String userid;
 private String password;
 private String email;

 //NOTE: isAdmin field is not present

 //Getters & Setters
}
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Language & Framework specific solutions

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 言語およびフレームワーク固有の解決策

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Spring MVC

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Spring MVC

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Allow-listing

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 許可リスト化

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```java
@Controller
public class UserController
{
    @InitBinder
    public void initBinder(WebDataBinder binder, WebRequest request)
    {
        binder.setAllowedFields(["userid","password","email"]);
    }
...
}
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Take a look [here](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/validation/DataBinder.html#setAllowedFields-java.lang.String...-) for the documentation.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

ドキュメントは[こちら](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/validation/DataBinder.html#setAllowedFields-java.lang.String...-)を参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Block-listing

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 禁止リスト化

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```java
@Controller
public class UserController
{
   @InitBinder
   public void initBinder(WebDataBinder binder, WebRequest request)
   {
      binder.setDisallowedFields(["isAdmin"]);
   }
...
}
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Take a look [here](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/validation/DataBinder.html#setDisallowedFields-java.lang.String...-) for the documentation.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

ドキュメントは[こちら](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/validation/DataBinder.html#setDisallowedFields-java.lang.String...-)を参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### NodeJS + Mongoose

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### NodeJS + Mongoose

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Allow-listing

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 許可リスト化

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```javascript
var UserSchema = new mongoose.Schema({
    userid: String,
    password: String,
    email : String,
    isAdmin : Boolean,
});

UserSchema.statics = {
    User.userCreateSafeFields: ['userid', 'password', 'email']
};

var User = mongoose.model('User', UserSchema);

_ = require('underscore');
var user = new User(_.pick(req.body, User.userCreateSafeFields));
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Take a look [here](http://underscorejs.org/#pick) for the documentation.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

ドキュメントは[こちら](http://underscorejs.org/#pick)を参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Block-listing

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 禁止リスト化

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```javascript
var massAssign = require('mongoose-mass-assign');

var UserSchema = new mongoose.Schema({
    userid: String,
    password: String,
    email : String,
    isAdmin : { type: Boolean, protect: true, default: false }
});

UserSchema.plugin(massAssign);

var User = mongoose.model('User', UserSchema);

/** Static method, useful for creation **/
var user = User.massAssign(req.body);

/** Instance method, useful for updating**/
var user = new User;
user.massAssign(req.body);

/** Static massUpdate method **/
var input = { userid: 'bhelx', isAdmin: 'true' };
User.update({ '_id': someId }, { $set: User.massUpdate(input) }, console.log);
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Take a look [here](https://www.npmjs.com/package/mongoose-mass-assign) for the documentation.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

ドキュメントは[こちら](https://www.npmjs.com/package/mongoose-mass-assign)を参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Ruby On Rails

Take a look [here](https://guides.rubyonrails.org/v3.2.9/security.html#mass-assignment) for the documentation.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Ruby On Rails

ドキュメントは[こちら](https://guides.rubyonrails.org/v3.2.9/security.html#mass-assignment)を参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Django

Take a look [here](https://coffeeonthekeyboard.com/mass-assignment-security-part-10-855/) for the documentation.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Django

ドキュメントは[こちら](https://coffeeonthekeyboard.com/mass-assignment-security-part-10-855/)を参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### ASP NET

Take a look [here](https://odetocode.com/Blogs/scott/archive/2012/03/11/complete-guide-to-mass-assignment-in-asp-net-mvc.aspx) for the documentation.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### ASP NET

ドキュメントは[こちら](https://odetocode.com/Blogs/scott/archive/2012/03/11/complete-guide-to-mass-assignment-in-asp-net-mvc.aspx)を参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### PHP Laravel + Eloquent

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### PHP Laravel + Eloquent

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Allow-listing

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 許可リスト化

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```php
<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    private $userid;
    private $password;
    private $email;
    private $isAdmin;

    protected $fillable = array('userid','password','email');
}
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Take a look [here](https://laravel.com/docs/5.2/eloquent#mass-assignment) for the documentation.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

ドキュメントは[こちら](https://laravel.com/docs/5.2/eloquent#mass-assignment)を参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Block-listing

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 禁止リスト化

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```php
<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    private $userid;
    private $password;
    private $email;
    private $isAdmin;

    protected $guarded = array('isAdmin');
}
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Take a look [here](https://laravel.com/docs/5.2/eloquent#mass-assignment) for the documentation.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

ドキュメントは[こちら](https://laravel.com/docs/5.2/eloquent#mass-assignment)を参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Grails

Take a look [here](http://spring.io/blog/2012/03/28/secure-data-binding-with-grails/) for the documentation.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Grails

ドキュメントは[こちら](http://spring.io/blog/2012/03/28/secure-data-binding-with-grails/)を参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Play

Take a look [here](https://www.playframework.com/documentation/1.4.x/controllers#nobinding) for the documentation.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Play

ドキュメントは[こちら](https://www.playframework.com/documentation/1.4.x/controllers#nobinding)を参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Jackson (JSON Object Mapper)

Take a look [here](https://www.baeldung.com/jackson-field-serializable-deserializable-or-not) and [here](http://lifelongprogrammer.blogspot.com/2015/09/using-jackson-view-to-protect-mass-assignment.html) for the documentation.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Jackson (JSON Object Mapper)

ドキュメントは[こちら](https://www.baeldung.com/jackson-field-serializable-deserializable-or-not)と[こちら](http://lifelongprogrammer.blogspot.com/2015/09/using-jackson-view-to-protect-mass-assignment.html)を参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### GSON (JSON Object Mapper)

Take a look [here](https://sites.google.com/site/gson/gson-user-guide#TOC-Excluding-Fields-From-Serialization-and-Deserialization) and [here](https://stackoverflow.com/a/27986860) for the document.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### GSON (JSON Object Mapper)

ドキュメントは[こちら](https://sites.google.com/site/gson/gson-user-guide#TOC-Excluding-Fields-From-Serialization-and-Deserialization)と[こちら](https://stackoverflow.com/a/27986860)を参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### JSON-Lib (JSON Object Mapper)

Take a look [here](http://json-lib.sourceforge.net/advanced.html) for the documentation.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### JSON-Lib (JSON Object Mapper)

ドキュメントは[こちら](http://json-lib.sourceforge.net/advanced.html)を参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Flexjson (JSON Object Mapper)

Take a look [here](http://flexjson.sourceforge.net/#Serialization) for the documentation.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Flexjson (JSON Object Mapper)

ドキュメントは[こちら](http://flexjson.sourceforge.net/#Serialization)を参照してください。

</div>
</div>

<div className="bilingualPair">

<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 参考文献と今後の読み物

- [Mass Assignment, Rails and You](https://code.tutsplus.com/tutorials/mass-assignment-rails-and-you--net-31695)

</div>
</div>

</section>
</div>

## References

<div className="referenceFooter">

- [Mass Assignment, Rails and You](https://code.tutsplus.com/tutorials/mass-assignment-rails-and-you--net-31695)

</div>


## Attribution

<div className="attributionFooter">

- Original: Mass Assignment Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Mass_Assignment_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: English original retained for comparison. Japanese translation added. Bilingual display generated from official source and local Japanese translation.
- Retrieved: 2026-05-20

</div>
