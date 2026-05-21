# マスアサインメントチートシート 日本語訳

## Attribution

- Original: Mass Assignment Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Mass_Assignment_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-21

## 日本語訳

# マスアサインメントチートシート

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
```

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

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V15.3 | 安全な入力バインディング、フレームワーク機能の安全な利用 |
