---
title: Query Parameterization Cheat Sheet
hide_title: true
---

<div className="docHero" data-category="encoding-and-sanitization">
  <h1>クエリパラメータ化チートシート</h1>
  <div className="docMeta">
    <span className="docPill">最終更新: 2026-05-20</span>
    <span className="docPill">読了時間: 約 15 分</span>
    <span className="docPill">カテゴリ: 入力検証とサニタイズ</span>
  </div>
</div>

<p className="docLead">クエリパラメータ化チートシートを、原文・翻訳・対比表示で確認できます。ASVS Index 対応の文脈で、公式原文と日本語訳を確認しやすく整理しています。</p>

<div className="tabbedContent">
  <input className="tabInput" type="radio" name="query-parameterization-view" id="query-parameterization-original" />
  <input className="tabInput" type="radio" name="query-parameterization-view" id="query-parameterization-translation" defaultChecked />
  <input className="tabInput" type="radio" name="query-parameterization-view" id="query-parameterization-bilingual" />

  <div className="contentTabs">
    <label htmlFor="query-parameterization-original" title="OWASP 原文">原文</label>
    <label htmlFor="query-parameterization-translation" title="日本語訳">翻訳</label>
    <label htmlFor="query-parameterization-bilingual" title="原文と翻訳を並べて確認">対比表示</label>
  </div>

<section id="query-parameterization-original-panel" className="tabPanel originalPanel contentPanel">

## Introduction

[SQL Injection](https://owasp.org/www-community/attacks/SQL_Injection) is one of the most dangerous web vulnerabilities. So much so that it was the #1 item in both the OWASP Top 10 [2013 version](https://wiki.owasp.org/index.php/Top_10_2013-A1-Injection), and [2017 version](https://owasp.org/www-project-top-ten/2017/A1_2017-Injection.html). As of 2021, it sits at #3 on the [OWASP Top 10](https://owasp.org/Top10/A03_2021-Injection/).

It represents a serious threat because SQL Injection allows evil attacker code to change the structure of a web application's SQL statement in a way that can steal data, modify data, or potentially facilitate command injection to the underlying OS.

This cheat sheet is a derivative work of the [SQL Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html).

## Parameterized Query Examples

SQL Injection is best prevented through the use of [*parameterized queries*](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html). The following chart demonstrates, with real-world code samples, how to build parameterized queries in most of the common web languages. The purpose of these code samples is to demonstrate to the web developer how to avoid SQL Injection when building database queries within a web application.

Please note, many client side frameworks and libraries offer client side query parameterization. These libraries often just build queries with string concatenation before sending raw queries to a server. Please ensure that query parameterization is done server-side!

### Prepared Statement Examples

#### Using Java built-in feature

```java
String custname = request.getParameter("customerName");
String query = "SELECT account_balance FROM user_data WHERE user_name = ? ";
PreparedStatement pstmt = connection.prepareStatement( query );
pstmt.setString( 1, custname);
ResultSet results = pstmt.executeQuery( );
```

#### Using Java with Hibernate

```java
// HQL
@Entity // declare as entity;
@NamedQuery(
 name="findByDescription",
 query="FROM Inventory i WHERE i.productDescription = :productDescription"
)
public class Inventory implements Serializable {
 @Id
 private long id;
 private String productDescription;
}

// Use case
// This should REALLY be validated too
String userSuppliedParameter = request.getParameter("Product-Description");
// Perform input validation to detect attacks
List<Inventory> list =
 session.getNamedQuery("findByDescription")
 .setParameter("productDescription", userSuppliedParameter).list();

// Criteria API
// This should REALLY be validated too
String userSuppliedParameter = request.getParameter("Product-Description");
// Perform input validation to detect attacks
Inventory inv = (Inventory) session.createCriteria(Inventory.class).add
(Restrictions.eq("productDescription", userSuppliedParameter)).uniqueResult();
```

#### Using .NET built-in feature

```csharp
String query = "SELECT account_balance FROM user_data WHERE user_name = ?";
try {
   OleDbCommand command = new OleDbCommand(query, connection);
   command.Parameters.Add(new OleDbParameter("customerName", CustomerName Name.Text));
   OleDbDataReader reader = command.ExecuteReader();
   // …
} catch (OleDbException se) {
   // error handling
}
```

#### Using ASP .NET built-in feature

```csharp
string sql = "SELECT * FROM Customers WHERE CustomerId = @CustomerId";
SqlCommand command = new SqlCommand(sql);
command.Parameters.Add(new SqlParameter("@CustomerId", System.Data.SqlDbType.Int));
command.Parameters["@CustomerId"].Value = 1;
```

#### Using Ruby with ActiveRecord

```ruby
## Create
Project.create!(:name => 'owasp')
## Read
Project.all(:conditions => "name = ?", name)
Project.all(:conditions => { :name => name })
Project.where("name = :name", :name => name)
## Update
project.update_attributes(:name => 'owasp')
## Delete
Project.delete(:name => 'name')
```

#### Using Ruby built-in feature

```ruby
insert_new_user = db.prepare "INSERT INTO users (name, age, gender) VALUES (?, ? ,?)"
insert_new_user.execute 'aizatto', '20', 'male'
```

#### Using PHP with PHP Data Objects

```php
$stmt = $dbh->prepare("INSERT INTO REGISTRY (name, value) VALUES (:name, :value)");
$stmt->bindParam(':name', $name);
$stmt->bindParam(':value', $value);
```

#### Using Cold Fusion built-in feature

```cfscript
<cfquery name = "getFirst" dataSource = "cfsnippets">
    SELECT * FROM #strDatabasePrefix#_courses WHERE intCourseID =
    <cfqueryparam value = #intCourseID# CFSQLType = "CF_SQL_INTEGER">
</cfquery>
```

#### Using PERL with Database Independent Interface

```perl
my $sql = "INSERT INTO foo (bar, baz) VALUES ( ?, ? )";
my $sth = $dbh->prepare( $sql );
$sth->execute( $bar, $baz );
```

#### Using Rust with SQLx
<!-- contributed by GeekMasher -->

```rust
// Input from CLI args but could be anything
let username = std::env::args().last().unwrap();

// Using build-in macros (compile time checks)
let users = sqlx::query_as!(
        User,
        "SELECT * FROM users WHERE name = ?",
        username
    )
    .fetch_all(&pool)
    .await
    .unwrap();

// Using built-in functions
let users: Vec<User> = sqlx::query_as::<_, User>(
        "SELECT * FROM users WHERE name = ?"
    )
    .bind(&username)
    .fetch_all(&pool)
    .await
    .unwrap();
```

### Stored Procedure Examples

The SQL you write in your web application isn't the only place that SQL injection vulnerabilities can be introduced. If you are using Stored Procedures, and you are dynamically constructing SQL inside them, you can also introduce SQL injection vulnerabilities.

Dynamic SQL can be parameterized using bind variables, to ensure the dynamically constructed SQL is secure.

Here are some examples of using bind variables in stored procedures in different databases.

#### Oracle using PL/SQL

##### Normal Stored Procedure

No dynamic SQL being created. Parameters passed in to stored procedures are naturally bound to their location within the query without anything special being required:

```sql
PROCEDURE SafeGetBalanceQuery(UserID varchar, Dept varchar) AS BEGIN
   SELECT balance FROM accounts_table WHERE user_ID = UserID AND department = Dept;
END;
```

##### Stored Procedure Using Bind Variables in SQL Run with EXECUTE

Bind variables are used to tell the database that the inputs to this dynamic SQL are 'data' and not possibly code:

```sql
PROCEDURE AnotherSafeGetBalanceQuery(UserID varchar, Dept varchar)
          AS stmt VARCHAR(400); result NUMBER;
BEGIN
   stmt := 'SELECT balance FROM accounts_table WHERE user_ID = :1
            AND department = :2';
   EXECUTE IMMEDIATE stmt INTO result USING UserID, Dept;
   RETURN result;
END;
```

#### SQL Server using Transact-SQL

##### Normal Stored Procedure

No dynamic SQL being created. Parameters passed in to stored procedures are naturally bound to their location within the query without anything special being required:

```sql
PROCEDURE SafeGetBalanceQuery(@UserID varchar(20), @Dept varchar(10)) AS BEGIN
   SELECT balance FROM accounts_table WHERE user_ID = @UserID AND department = @Dept
END
```

##### Stored Procedure Using Bind Variables in SQL Run with EXEC

Bind variables are used to tell the database that the inputs to this dynamic SQL are 'data' and not possibly code:

```sql
PROCEDURE SafeGetBalanceQuery(@UserID varchar(20), @Dept varchar(10)) AS BEGIN
   DECLARE @sql VARCHAR(200)
   SELECT @sql = 'SELECT balance FROM accounts_table WHERE '
                 + 'user_ID = @UID AND department = @DPT'
   EXEC sp_executesql @sql,
                      '@UID VARCHAR(20), @DPT VARCHAR(10)',
                      @UID=@UserID, @DPT=@Dept
END
```

</section>

<section id="query-parameterization-translation-panel" className="tabPanel translationPanel contentPanel">

## はじめに

[SQL インジェクション](https://owasp.org/www-community/attacks/SQL_Injection)は、最も危険な Web 脆弱性の一つです。実際、OWASP Top 10 の [2013 年版](https://wiki.owasp.org/index.php/Top_10_2013-A1-Injection)と [2017 年版](https://owasp.org/www-project-top-ten/2017/A1_2017-Injection.html)の両方で第 1 位でした。2021 年時点では、[OWASP Top 10](https://owasp.org/Top10/A03_2021-Injection/) の第 3 位に位置しています。

SQL インジェクションは深刻な脅威です。攻撃者の悪意あるコードによって Web アプリケーションの SQL 文の構造が変更され、データの窃取、データの改ざん、または基盤 OS に対するコマンドインジェクションの助長につながる可能性があるためです。

このチートシートは、[SQL Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html) の派生著作物です。

## パラメータ化クエリの例

SQL インジェクションは、[*パラメータ化クエリ*](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)を使用することで最も効果的に防止できます。以下の表は、一般的な Web 言語の多くでパラメータ化クエリを構築する方法を、実際のコードサンプルで示しています。これらのコードサンプルの目的は、Web 開発者が Web アプリケーション内でデータベースクエリを構築する際に、SQL インジェクションを回避する方法を示すことです。

多くのクライアントサイドフレームワークやライブラリが、クライアントサイドのクエリパラメータ化を提供している点に注意してください。これらのライブラリは、多くの場合、サーバーに生のクエリを送信する前に文字列連結でクエリを組み立てているだけです。クエリパラメータ化は必ずサーバーサイドで行ってください。

### プリペアドステートメントの例

#### Java 組み込み機能の使用

```java
String custname = request.getParameter("customerName");
String query = "SELECT account_balance FROM user_data WHERE user_name = ? ";
PreparedStatement pstmt = connection.prepareStatement( query );
pstmt.setString( 1, custname);
ResultSet results = pstmt.executeQuery( );
```

#### Hibernate を使用する Java

```java
// HQL
@Entity // declare as entity;
@NamedQuery(
 name="findByDescription",
 query="FROM Inventory i WHERE i.productDescription = :productDescription"
)
public class Inventory implements Serializable {
 @Id
 private long id;
 private String productDescription;
}

// Use case
// This should REALLY be validated too
String userSuppliedParameter = request.getParameter("Product-Description");
// Perform input validation to detect attacks
List<Inventory> list =
 session.getNamedQuery("findByDescription")
 .setParameter("productDescription", userSuppliedParameter).list();

// Criteria API
// This should REALLY be validated too
String userSuppliedParameter = request.getParameter("Product-Description");
// Perform input validation to detect attacks
Inventory inv = (Inventory) session.createCriteria(Inventory.class).add
(Restrictions.eq("productDescription", userSuppliedParameter)).uniqueResult();
```

#### .NET 組み込み機能の使用

```csharp
String query = "SELECT account_balance FROM user_data WHERE user_name = ?";
try {
   OleDbCommand command = new OleDbCommand(query, connection);
   command.Parameters.Add(new OleDbParameter("customerName", CustomerName Name.Text));
   OleDbDataReader reader = command.ExecuteReader();
   // …
} catch (OleDbException se) {
   // error handling
}
```

#### ASP .NET 組み込み機能の使用

```csharp
string sql = "SELECT * FROM Customers WHERE CustomerId = @CustomerId";
SqlCommand command = new SqlCommand(sql);
command.Parameters.Add(new SqlParameter("@CustomerId", System.Data.SqlDbType.Int));
command.Parameters["@CustomerId"].Value = 1;
```

#### ActiveRecord を使用する Ruby

```ruby
## Create
Project.create!(:name => 'owasp')
## Read
Project.all(:conditions => "name = ?", name)
Project.all(:conditions => { :name => name })
Project.where("name = :name", :name => name)
## Update
project.update_attributes(:name => 'owasp')
## Delete
Project.delete(:name => 'name')
```

#### Ruby 組み込み機能の使用

```ruby
insert_new_user = db.prepare "INSERT INTO users (name, age, gender) VALUES (?, ? ,?)"
insert_new_user.execute 'aizatto', '20', 'male'
```

#### PHP Data Objects を使用する PHP

```php
$stmt = $dbh->prepare("INSERT INTO REGISTRY (name, value) VALUES (:name, :value)");
$stmt->bindParam(':name', $name);
$stmt->bindParam(':value', $value);
```

#### Cold Fusion 組み込み機能の使用

```cfscript
<cfquery name = "getFirst" dataSource = "cfsnippets">
    SELECT * FROM #strDatabasePrefix#_courses WHERE intCourseID =
    <cfqueryparam value = #intCourseID# CFSQLType = "CF_SQL_INTEGER">
</cfquery>
```

#### Database Independent Interface を使用する PERL

```perl
my $sql = "INSERT INTO foo (bar, baz) VALUES ( ?, ? )";
my $sth = $dbh->prepare( $sql );
$sth->execute( $bar, $baz );
```

#### SQLx を使用する Rust

```rust
// Input from CLI args but could be anything
let username = std::env::args().last().unwrap();

// Using build-in macros (compile time checks)
let users = sqlx::query_as!(
        User,
        "SELECT * FROM users WHERE name = ?",
        username
    )
    .fetch_all(&pool)
    .await
    .unwrap();

// Using built-in functions
let users: Vec<User> = sqlx::query_as::<_, User>(
        "SELECT * FROM users WHERE name = ?"
    )
    .bind(&username)
    .fetch_all(&pool)
    .await
    .unwrap();
```

### ストアドプロシージャの例

SQL インジェクション脆弱性が混入する場所は、Web アプリケーション内で記述する SQL だけではありません。ストアドプロシージャを使用していて、その内部で SQL を動的に構築している場合にも、SQL インジェクション脆弱性を混入させる可能性があります。

動的 SQL はバインド変数を使ってパラメータ化でき、動的に構築される SQL の安全性を確保できます。

以下は、異なるデータベースのストアドプロシージャでバインド変数を使用する例です。

#### PL/SQL を使用する Oracle

##### 通常のストアドプロシージャ

動的 SQL は作成されていません。ストアドプロシージャに渡されるパラメータは、特別な処理を必要とせず、クエリ内の対応する位置に自然にバインドされます。

```sql
PROCEDURE SafeGetBalanceQuery(UserID varchar, Dept varchar) AS BEGIN
   SELECT balance FROM accounts_table WHERE user_ID = UserID AND department = Dept;
END;
```

##### EXECUTE で実行される SQL にバインド変数を使用するストアドプロシージャ

バインド変数は、この動的 SQL への入力が、コードである可能性のあるものではなく「データ」であることをデータベースに伝えるために使用されます。

```sql
PROCEDURE AnotherSafeGetBalanceQuery(UserID varchar, Dept varchar)
          AS stmt VARCHAR(400); result NUMBER;
BEGIN
   stmt := 'SELECT balance FROM accounts_table WHERE user_ID = :1
            AND department = :2';
   EXECUTE IMMEDIATE stmt INTO result USING UserID, Dept;
   RETURN result;
END;
```

#### Transact-SQL を使用する SQL Server

##### 通常のストアドプロシージャ

動的 SQL は作成されていません。ストアドプロシージャに渡されるパラメータは、特別な処理を必要とせず、クエリ内の対応する位置に自然にバインドされます。

```sql
PROCEDURE SafeGetBalanceQuery(@UserID varchar(20), @Dept varchar(10)) AS BEGIN
   SELECT balance FROM accounts_table WHERE user_ID = @UserID AND department = @Dept
END
```

##### EXEC で実行される SQL にバインド変数を使用するストアドプロシージャ

バインド変数は、この動的 SQL への入力が、コードである可能性のあるものではなく「データ」であることをデータベースに伝えるために使用されます。

```sql
PROCEDURE SafeGetBalanceQuery(@UserID varchar(20), @Dept varchar(10)) AS BEGIN
   DECLARE @sql VARCHAR(200)
   SELECT @sql = 'SELECT balance FROM accounts_table WHERE '
                 + 'user_ID = @UID AND department = @DPT'
   EXEC sp_executesql @sql,
                      '@UID VARCHAR(20), @DPT VARCHAR(10)',
                      @UID=@UserID, @DPT=@Dept
END
```

</section>

<section id="query-parameterization-bilingual-panel" className="tabPanel bilingualPanel">

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Introduction

[SQL Injection](https://owasp.org/www-community/attacks/SQL_Injection) is one of the most dangerous web vulnerabilities. So much so that it was the #1 item in both the OWASP Top 10 [2013 version](https://wiki.owasp.org/index.php/Top_10_2013-A1-Injection), and [2017 version](https://owasp.org/www-project-top-ten/2017/A1_2017-Injection.html). As of 2021, it sits at #3 on the [OWASP Top 10](https://owasp.org/Top10/A03_2021-Injection/).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## はじめに

[SQL インジェクション](https://owasp.org/www-community/attacks/SQL_Injection)は、最も危険な Web 脆弱性の一つです。実際、OWASP Top 10 の [2013 年版](https://wiki.owasp.org/index.php/Top_10_2013-A1-Injection)と [2017 年版](https://owasp.org/www-project-top-ten/2017/A1_2017-Injection.html)の両方で第 1 位でした。2021 年時点では、[OWASP Top 10](https://owasp.org/Top10/A03_2021-Injection/) の第 3 位に位置しています。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

It represents a serious threat because SQL Injection allows evil attacker code to change the structure of a web application's SQL statement in a way that can steal data, modify data, or potentially facilitate command injection to the underlying OS.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

SQL インジェクションは深刻な脅威です。攻撃者の悪意あるコードによって Web アプリケーションの SQL 文の構造が変更され、データの窃取、データの改ざん、または基盤 OS に対するコマンドインジェクションの助長につながる可能性があるためです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

This cheat sheet is a derivative work of the [SQL Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

このチートシートは、[SQL Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html) の派生著作物です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Parameterized Query Examples

SQL Injection is best prevented through the use of [*parameterized queries*](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html). The following chart demonstrates, with real-world code samples, how to build parameterized queries in most of the common web languages. The purpose of these code samples is to demonstrate to the web developer how to avoid SQL Injection when building database queries within a web application.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## パラメータ化クエリの例

SQL インジェクションは、[*パラメータ化クエリ*](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)を使用することで最も効果的に防止できます。以下の表は、一般的な Web 言語の多くでパラメータ化クエリを構築する方法を、実際のコードサンプルで示しています。これらのコードサンプルの目的は、Web 開発者が Web アプリケーション内でデータベースクエリを構築する際に、SQL インジェクションを回避する方法を示すことです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Please note, many client side frameworks and libraries offer client side query parameterization. These libraries often just build queries with string concatenation before sending raw queries to a server. Please ensure that query parameterization is done server-side!

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

多くのクライアントサイドフレームワークやライブラリが、クライアントサイドのクエリパラメータ化を提供している点に注意してください。これらのライブラリは、多くの場合、サーバーに生のクエリを送信する前に文字列連結でクエリを組み立てているだけです。クエリパラメータ化は必ずサーバーサイドで行ってください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Prepared Statement Examples

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### プリペアドステートメントの例

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Using Java built-in feature

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### Java 組み込み機能の使用

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```java
String custname = request.getParameter("customerName");
String query = "SELECT account_balance FROM user_data WHERE user_name = ? ";
PreparedStatement pstmt = connection.prepareStatement( query );
pstmt.setString( 1, custname);
ResultSet results = pstmt.executeQuery( );
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Using Java with Hibernate

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### Hibernate を使用する Java

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```java
// HQL
@Entity // declare as entity;
@NamedQuery(
 name="findByDescription",
 query="FROM Inventory i WHERE i.productDescription = :productDescription"
)
public class Inventory implements Serializable {
 @Id
 private long id;
 private String productDescription;
}

// Use case
// This should REALLY be validated too
String userSuppliedParameter = request.getParameter("Product-Description");
// Perform input validation to detect attacks
List<Inventory> list =
 session.getNamedQuery("findByDescription")
 .setParameter("productDescription", userSuppliedParameter).list();

// Criteria API
// This should REALLY be validated too
String userSuppliedParameter = request.getParameter("Product-Description");
// Perform input validation to detect attacks
Inventory inv = (Inventory) session.createCriteria(Inventory.class).add
(Restrictions.eq("productDescription", userSuppliedParameter)).uniqueResult();
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Using .NET built-in feature

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### .NET 組み込み機能の使用

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```csharp
String query = "SELECT account_balance FROM user_data WHERE user_name = ?";
try {
   OleDbCommand command = new OleDbCommand(query, connection);
   command.Parameters.Add(new OleDbParameter("customerName", CustomerName Name.Text));
   OleDbDataReader reader = command.ExecuteReader();
   // …
} catch (OleDbException se) {
   // error handling
}
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Using ASP .NET built-in feature

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### ASP .NET 組み込み機能の使用

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```csharp
string sql = "SELECT * FROM Customers WHERE CustomerId = @CustomerId";
SqlCommand command = new SqlCommand(sql);
command.Parameters.Add(new SqlParameter("@CustomerId", System.Data.SqlDbType.Int));
command.Parameters["@CustomerId"].Value = 1;
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Using Ruby with ActiveRecord

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### ActiveRecord を使用する Ruby

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```ruby
## Create
Project.create!(:name => 'owasp')
## Read
Project.all(:conditions => "name = ?", name)
Project.all(:conditions => { :name => name })
Project.where("name = :name", :name => name)
## Update
project.update_attributes(:name => 'owasp')
## Delete
Project.delete(:name => 'name')
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Using Ruby built-in feature

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### Ruby 組み込み機能の使用

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```ruby
insert_new_user = db.prepare "INSERT INTO users (name, age, gender) VALUES (?, ? ,?)"
insert_new_user.execute 'aizatto', '20', 'male'
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Using PHP with PHP Data Objects

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### PHP Data Objects を使用する PHP

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```php
$stmt = $dbh->prepare("INSERT INTO REGISTRY (name, value) VALUES (:name, :value)");
$stmt->bindParam(':name', $name);
$stmt->bindParam(':value', $value);
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Using Cold Fusion built-in feature

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### Cold Fusion 組み込み機能の使用

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```cfscript
<cfquery name = "getFirst" dataSource = "cfsnippets">
    SELECT * FROM #strDatabasePrefix#_courses WHERE intCourseID =
    <cfqueryparam value = #intCourseID# CFSQLType = "CF_SQL_INTEGER">
</cfquery>
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Using PERL with Database Independent Interface

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### Database Independent Interface を使用する PERL

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```perl
my $sql = "INSERT INTO foo (bar, baz) VALUES ( ?, ? )";
my $sth = $dbh->prepare( $sql );
$sth->execute( $bar, $baz );
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Using Rust with SQLx
<!-- contributed by GeekMasher -->

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### SQLx を使用する Rust

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```rust
// Input from CLI args but could be anything
let username = std::env::args().last().unwrap();

// Using build-in macros (compile time checks)
let users = sqlx::query_as!(
        User,
        "SELECT * FROM users WHERE name = ?",
        username
    )
    .fetch_all(&pool)
    .await
    .unwrap();

// Using built-in functions
let users: Vec<User> = sqlx::query_as::<_, User>(
        "SELECT * FROM users WHERE name = ?"
    )
    .bind(&username)
    .fetch_all(&pool)
    .await
    .unwrap();
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Stored Procedure Examples

The SQL you write in your web application isn't the only place that SQL injection vulnerabilities can be introduced. If you are using Stored Procedures, and you are dynamically constructing SQL inside them, you can also introduce SQL injection vulnerabilities.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### ストアドプロシージャの例

SQL インジェクション脆弱性が混入する場所は、Web アプリケーション内で記述する SQL だけではありません。ストアドプロシージャを使用していて、その内部で SQL を動的に構築している場合にも、SQL インジェクション脆弱性を混入させる可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Dynamic SQL can be parameterized using bind variables, to ensure the dynamically constructed SQL is secure.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

動的 SQL はバインド変数を使ってパラメータ化でき、動的に構築される SQL の安全性を確保できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Here are some examples of using bind variables in stored procedures in different databases.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

以下は、異なるデータベースのストアドプロシージャでバインド変数を使用する例です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Oracle using PL/SQL

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### PL/SQL を使用する Oracle

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

##### Normal Stored Procedure

No dynamic SQL being created. Parameters passed in to stored procedures are naturally bound to their location within the query without anything special being required:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

##### 通常のストアドプロシージャ

動的 SQL は作成されていません。ストアドプロシージャに渡されるパラメータは、特別な処理を必要とせず、クエリ内の対応する位置に自然にバインドされます。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```sql
PROCEDURE SafeGetBalanceQuery(UserID varchar, Dept varchar) AS BEGIN
   SELECT balance FROM accounts_table WHERE user_ID = UserID AND department = Dept;
END;
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

##### Stored Procedure Using Bind Variables in SQL Run with EXECUTE

Bind variables are used to tell the database that the inputs to this dynamic SQL are 'data' and not possibly code:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

##### EXECUTE で実行される SQL にバインド変数を使用するストアドプロシージャ

バインド変数は、この動的 SQL への入力が、コードである可能性のあるものではなく「データ」であることをデータベースに伝えるために使用されます。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```sql
PROCEDURE AnotherSafeGetBalanceQuery(UserID varchar, Dept varchar)
          AS stmt VARCHAR(400); result NUMBER;
BEGIN
   stmt := 'SELECT balance FROM accounts_table WHERE user_ID = :1
            AND department = :2';
   EXECUTE IMMEDIATE stmt INTO result USING UserID, Dept;
   RETURN result;
END;
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### SQL Server using Transact-SQL

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### Transact-SQL を使用する SQL Server

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

##### Normal Stored Procedure

No dynamic SQL being created. Parameters passed in to stored procedures are naturally bound to their location within the query without anything special being required:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

##### 通常のストアドプロシージャ

動的 SQL は作成されていません。ストアドプロシージャに渡されるパラメータは、特別な処理を必要とせず、クエリ内の対応する位置に自然にバインドされます。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```sql
PROCEDURE SafeGetBalanceQuery(@UserID varchar(20), @Dept varchar(10)) AS BEGIN
   SELECT balance FROM accounts_table WHERE user_ID = @UserID AND department = @Dept
END
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

##### Stored Procedure Using Bind Variables in SQL Run with EXEC

Bind variables are used to tell the database that the inputs to this dynamic SQL are 'data' and not possibly code:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

##### EXEC で実行される SQL にバインド変数を使用するストアドプロシージャ

バインド変数は、この動的 SQL への入力が、コードである可能性のあるものではなく「データ」であることをデータベースに伝えるために使用されます。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```sql
PROCEDURE SafeGetBalanceQuery(@UserID varchar(20), @Dept varchar(10)) AS BEGIN
   DECLARE @sql VARCHAR(200)
   SELECT @sql = 'SELECT balance FROM accounts_table WHERE '
                 + 'user_ID = @UID AND department = @DPT'
   EXEC sp_executesql @sql,
                      '@UID VARCHAR(20), @DPT VARCHAR(10)',
                      @UID=@UserID, @DPT=@Dept
END
```

</div>

</section>
</div>

## References

<div className="referenceFooter">

- [The Bobby Tables site (inspired by the XKCD webcomic) has numerous examples in different languages of parameterized Prepared Statements and Stored Procedures](http://bobby-tables.com/)
- OWASP [SQL Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)

</div>


## Attribution

<div className="attributionFooter">

- Original: Query Parameterization Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Query_Parameterization_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: English original retained for comparison. Japanese translation added. Bilingual display generated from official source and local Japanese translation.
- Retrieved: 2026-05-20

</div>
