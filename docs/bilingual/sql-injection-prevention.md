---
title: SQL Injection Prevention Cheat Sheet
hide_title: true
---

<div className="docHero" data-category="encoding-and-sanitization">
  <h1>SQL インジェクション防止チートシート</h1>
  <div className="docMeta">
    <span className="docPill">最終更新: 2026-05-21</span>
    <span className="docPill">読了時間: 約 15 分</span>
    <span className="docPill">カテゴリ: 入力検証とサニタイズ</span>
  </div>
</div>

<p className="docLead">SQL インジェクション防止チートシートを、原文・翻訳・対比表示で確認できます。ASVS Index 対応の文脈で、公式原文と日本語訳を確認しやすく整理しています。</p>

<div className="tabbedContent">
  <input className="tabInput" type="radio" name="sql-injection-prevention-view" id="sql-injection-prevention-original" />
  <input className="tabInput" type="radio" name="sql-injection-prevention-view" id="sql-injection-prevention-translation" defaultChecked />
  <input className="tabInput" type="radio" name="sql-injection-prevention-view" id="sql-injection-prevention-bilingual" />

  <div className="contentTabs">
    <label htmlFor="sql-injection-prevention-original" title="OWASP 原文">原文</label>
    <label htmlFor="sql-injection-prevention-translation" title="日本語訳">翻訳</label>
    <label htmlFor="sql-injection-prevention-bilingual" title="原文と翻訳を並べて確認">対比表示</label>
  </div>

<section id="sql-injection-prevention-original-panel" className="tabPanel originalPanel contentPanel">

# SQL Injection Prevention Cheat Sheet

## Introduction

This cheat sheet will help you prevent SQL injection flaws in your applications. It will define what SQL injection is, explain where those flaws occur, and provide four options for defending against SQL injection attacks. [SQL Injection](https://owasp.org/www-community/attacks/SQL_Injection) attacks are common because:

1. SQL Injection vulnerabilities are very common.
2. The application's database is a frequent target for attackers because it typically contains sensitive or critical data.

## What Is a SQL Injection Attack?

Attackers can use SQL injection on an application if it has dynamic database queries that use string concatenation and user-supplied input. To avoid SQL injection flaws, developers need to:

1. Stop writing dynamic queries with string concatenation.
2. Prevent malicious SQL input from being included in executed queries.

There are simple techniques for preventing SQL injection vulnerabilities, and they can be used with practically any kind of programming language and any type of database. While XML databases can have similar problems (e.g., XPath and XQuery injection), these techniques can be used to protect them as well.

## Anatomy of a Typical SQL Injection Vulnerability

A common SQL injection flaw in Java is shown below. Because its unvalidated "customerName" parameter is simply appended to the query, an attacker can enter SQL code into that query and the application would take the attacker's code and execute it on the database.

```java
String query = "SELECT account_balance FROM user_data WHERE user_name = "
             + request.getParameter("customerName");
try {
    Statement statement = connection.createStatement( ... );
    ResultSet results = statement.executeQuery( query );
}

...
```

## Primary Defenses

- **Option 1: Use of Prepared Statements (with Parameterized Queries)**
- **Option 2: Use of Properly Constructed Stored Procedures**
- **Option 3: Allow-list Input Validation**
- **Option 4: STRONGLY DISCOURAGED: Escaping All User Supplied Input**

### Defense Option 1: Prepared Statements (with Parameterized Queries)

When developers are taught how to write database queries, they should be told to use prepared statements with variable binding (aka parameterized queries). Prepared statements are simple to write and easier to understand than dynamic queries, and parameterized queries force the developer to define all SQL code first and pass in each parameter to the query later.

If database queries use this coding style, the database will always distinguish between code and data, regardless of what user input is supplied. Also, prepared statements ensure that an attacker cannot change the intent of a query, even if SQL commands are inserted by an attacker.

#### Safe Java Prepared Statement Example

In the safe Java example below, if an attacker were to enter the userID as `tom' or '1'='1`, the parameterized query would look for a username that literally matches the entire string `tom' or '1'='1`. Thus, the database would be protected against injections of malicious SQL code.

The following code example uses a `PreparedStatement`, Java's implementation of a parameterized query, to execute the same database query.

```java
// This should REALLY be validated too
String custname = request.getParameter("customerName");
// Perform input validation to detect attacks
String query = "SELECT account_balance FROM user_data WHERE user_name = ? ";
PreparedStatement pstmt = connection.prepareStatement( query );
pstmt.setString( 1, custname);
ResultSet results = pstmt.executeQuery( );
```

#### Safe C\# .NET Prepared Statement Example

In .NET, the creation and execution of the query doesn't change. Just pass the parameters to the query using the `Parameters.Add()` call as shown below.

```csharp
String query = "SELECT account_balance FROM user_data WHERE user_name = ?";
try {
  OleDbCommand command = new OleDbCommand(query, connection);
  command.Parameters.Add(new OleDbParameter("customerName", CustomerName Name.Text));
  OleDbDataReader reader = command.ExecuteReader();
  // …
} catch (OleDbException se) {
  // error handling
}
```

While we have shown examples in Java and .NET, practically all other languages (including Cold Fusion and Classic ASP) support parameterized query interfaces. Even SQL abstraction layers, like the [Hibernate Query Language](http://hibernate.org/) (HQL) with the same type of injection problems (called [HQL Injection](http://cwe.mitre.org/data/definitions/564.html))  support parameterized queries as well:

#### Hibernate Query Language (HQL) Prepared Statement (Named Parameters) Example

```java
// This is an unsafe HQL statement
Query unsafeHQLQuery = session.createQuery("from Inventory where productID='"+userSuppliedParameter+"'");
// Here is a safe version of the same query using named parameters
Query safeHQLQuery = session.createQuery("from Inventory where productID=:productid");
safeHQLQuery.setParameter("productid", userSuppliedParameter);
```

#### Other Examples of Safe Prepared Statements

If you need examples of prepared queries/parameterized languages, including Ruby, PHP, Cold Fusion, Perl, and Rust, see the [Query Parameterization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Query_Parameterization_Cheat_Sheet.html) or this [site](http://bobby-tables.com/).

Generally, developers like prepared statements because all the SQL code stays within the application, which makes applications relatively database independent.

### Defense Option 2: Stored Procedures

Though stored procedures are not always safe from SQL injection, developers can use certain standard stored procedure programming constructs. This approach has the same effect as using parameterized queries, as long as the stored procedures are implemented safely (which is the norm for most stored procedure languages).

#### Safe Approach to Stored Procedures

If stored procedures are needed, the safest approach to using them requires the developer to build SQL statements with parameters that are automatically parameterized, unless the developer does something largely out of the norm. The difference between prepared statements and stored procedures is that the SQL code for a stored procedure is defined and stored in the database itself, then called from the application. Since prepared statements and safe stored procedures are equally effective in preventing SQL injection, your organization should choose the approach that makes the most sense for you.

#### When Stored Procedures Can Increase Risk

Occasionally, stored procedures can increase risk when a system is attacked. For example, on MS SQL Server, you have three main default roles: `db_datareader`, `db_datawriter` and `db_owner`. Before stored procedures came into use, DBAs would give `db_datareader` or `db_datawriter` rights to the webservice's user, depending on the requirements.

However, stored procedures require execute rights, a role not available by default. In some setups where user management has been centralized, but is limited to those 3 roles, web apps would have to run as `db_owner` so stored procedures could work. Naturally, that means that if a server is breached, the attacker has full rights to the database, where previously, they might only have had read-access.

#### Safe Java Stored Procedure Example

The following code example uses Java's implementation of the stored procedure interface (`CallableStatement`) to execute the same database query. The `sp_getAccountBalance` stored procedure has to be predefined in the database and use the same functionality as the query above.

```java
// This should REALLY be validated
String custname = request.getParameter("customerName");
try {
  CallableStatement cs = connection.prepareCall("{call sp_getAccountBalance(?)}");
  cs.setString(1, custname);
  ResultSet results = cs.executeQuery();
  // … result set handling
} catch (SQLException se) {
  // … logging and error handling
}
```

#### Safe VB .NET Stored Procedure Example

The following code example uses a `SqlCommand`, .NET's implementation of the stored procedure interface, to execute the same database query. The `sp_getAccountBalance` stored procedure must be predefined in the database and use the same functionality as the query defined above.

```vbnet
 Try
   Dim command As SqlCommand = new SqlCommand("sp_getAccountBalance", connection)
   command.CommandType = CommandType.StoredProcedure
   command.Parameters.Add(new SqlParameter("@CustomerName", CustomerName.Text))
   Dim reader As SqlDataReader = command.ExecuteReader()
   '...
 Catch se As SqlException
   'error handling
 End Try
```

### Defense Option 3: Allow-list Input Validation

If you are faced with parts of SQL queries that can't use bind variables, such as table names, column names, or sort order indicators (ASC or DESC), input validation or query redesign is the most appropriate defense. When table or column names are needed, ideally those values come from the code and not from user parameters.

#### Sample Of Safe Table Name Validation

WARNING: Using user parameter values to target table or column names is a symptom of poor design and a full rewrite should be considered if time allows. If that is not possible, developers should map the parameter values to the legal/expected table or column names to make sure unvalidated user input doesn't end up in the query.

In the example below, since `tableName` is identified as one of the legal and expected values for a table name in this query, it can be directly appended to the SQL query. Keep in mind that generic table validation functions can lead to data loss if table names are used in queries where they are not expected.

```text
String tableName;
switch(PARAM):
  case "Value1": tableName = "fooTable";
                 break;
  case "Value2": tableName = "barTable";
                 break;
  ...
  default      : throw new InputValidationException("unexpected value provided"
                                                  + " for table name");
```

#### Safest Use Of Dynamic SQL Generation (DISCOURAGED)

When we say a stored procedure is "implemented safely," that means it does not include any unsafe dynamic SQL generation. Developers do not usually generate dynamic SQL inside stored procedures. However, it can be done, but should be avoided.

If it can't be avoided, the stored procedure must use input validation or proper escaping, as described in this article, to make sure that all user supplied input to the stored procedure can't be used to inject SQL code into the dynamically generated query. Auditors should always look for uses of `sp_execute`, `execute` or `exec` within SQL Server stored procedures. Similar audit guidelines are necessary for similar functions for other vendors.

#### Sample of Safer Dynamic Query Generation (DISCOURAGED)

For something simple like a sort order, it is best if the user supplied input is converted to a boolean, and then that boolean is used to select the safe value to append to the query. This is a very standard need in dynamic query creation.

For example:

```java
public String someMethod(boolean sortOrder) {
 String SQLquery = "some SQL ... order by Salary " + (sortOrder ? "ASC" : "DESC");
 ...
```

Any time user input can be converted to a non-String, like a date, numeric, boolean, enumerated type, etc. before it is appended to a query, or used to select a value to append to the query, this ensures it is safe to do so.

Input validation is also recommended as a secondary defense in ALL cases, even when using bind variables as discussed earlier in this article. More techniques on how to implement strong input validation techniquies are described in the [Input Validation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html).

### Defense Option 4: STRONGLY DISCOURAGED: Escaping All User-Supplied Input

In this approach, the developer will escape all user input before putting it in a query. It is very database specific in its implementation.  This methodology is fragile compared to other defenses, and we CANNOT guarantee that this option will prevent all SQL injections in all situations.

If an application is built from scratch or requires low risk tolerance, it should be built or re-written using parameterized queries, stored procedures, or some kind of Object Relational Mapper (ORM) that builds your queries for you.

## Additional Defenses

Beyond adopting one of the four primary defenses, we also recommend adopting all of these additional defenses to provide defense in depth. These additional defenses are:

- **Least Privilege**
- **Allow-list Input Validation**

### Least Privilege

To minimize the potential damage of a successful SQL injection attack, you should minimize the privileges assigned to every database account in your environment. Start from the ground up to determine what access rights your application accounts require, rather than trying to figure out what access rights you need to take away.

Make sure that accounts that only need read access are only granted read access to the tables they need access to. DO NOT ASSIGN DBA OR ADMIN TYPE ACCESS TO YOUR APPLICATION ACCOUNTS. We understand that this is easy, and everything just "works" when you do it this way, but it is very dangerous.

#### Minimizing Application and OS Privileges

SQL injection is not the only threat to your database data. Attackers can simply change the parameter values from one of the legal values they are presented with, to a value that is unauthorized for them, but the application itself might be authorized to access. As such, minimizing the privileges granted to your application will reduce the likelihood of such unauthorized access attempts, even when an attacker is not trying to use SQL injection as part of their exploit.

While you are at it, you should minimize the privileges of the operating system account that the DBMS runs under. Don't run your DBMS as root or system! Most DBMSs run out of the box with a very powerful system account. For example, MySQL runs as system on Windows by default! Change the DBMS's OS account to something more appropriate, with restricted privileges.

#### Details Of Least Privilege When Developing

If an account only needs access to portions of a table, consider creating a view that limits access to that portion of the data and assigning the account access to the view instead of the underlying table. Rarely, if ever, grant create or delete access to database accounts.

If you adopt a policy where you use stored procedures everywhere, and don't allow application accounts to directly execute their own queries, then restrict those accounts to only be able to execute the stored procedures they need. Don't grant them any rights directly to the tables in the database.

#### Least Admin Privileges For Multiple DBs

The designers of web applications should avoid using the same owner/admin account in the web applications to connect to the database. Different DB users should be used for different web applications.

In general, each separate web application that requires access to the database should have a designated database user account that the application will use to connect to the DB. That way, the designer of the application can have good granularity in the access control, thus reducing the privileges as much as possible. Each DB user will then have select access to only what it needs, and write-access as needed.

As an example, a login page requires read access to the username and password fields of a table, but no write access of any form (no insert, update, or delete). However, the sign-up page certainly requires insert privilege to that table; this restriction can only be enforced if these web apps use different DB users to connect to the database.

#### Enhancing Least Privilege with SQL Views

You can use SQL views to further increase the granularity of access by limiting the read access to specific fields of a table or joins of tables. It could have additional benefits.

For example, if the system is required (perhaps due to some specific legal requirements) to store the passwords of the users, instead of salted-hashed passwords, the designer could use views to compensate for this limitation. They could revoke all access to the table (from all DB users except the owner/admin) and create a view that outputs the hash of the password field and not the field itself.

Any SQL injection attack that succeeds in stealing DB information will be restricted to stealing the hash of the passwords (could even be a keyed hash), since no DB user for any of the web applications has access to the table itself.

### Allow-list Input Validation

In addition to being a primary defense when nothing else is possible (e.g., when a bind variable isn't legal), input validation can also be a secondary defense used to detect unauthorized input before it is passed to the SQL query. For more information please see the [Input Validation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html). Proceed with caution here. Validated data is not necessarily safe to insert into SQL queries via string building.

## Related Articles

**SQL Injection Attack Cheat Sheets**:

The following articles describe how to exploit different kinds of SQL injection vulnerabilities on various platforms (that this article was created to help you avoid):

- [SQL Injection Cheat Sheet](https://www.netsparker.com/blog/web-security/sql-injection-cheat-sheet/)
- Bypassing WAF's with SQLi - [SQL Injection Bypassing WAF](https://owasp.org/www-community/attacks/SQL_Injection_Bypassing_WAF)

**Description of SQL Injection Vulnerabilities**:

- OWASP article on [SQL Injection](https://owasp.org/www-community/attacks/SQL_Injection) Vulnerabilities
- OWASP article on [Blind_SQL_Injection](https://owasp.org/www-community/attacks/Blind_SQL_Injection) Vulnerabilities

**How to Avoid SQL Injection Vulnerabilities**:

- [OWASP Developers Guide](https://github.com/OWASP/DevGuide) article on how to avoid SQL injection vulnerabilities
- OWASP Cheat Sheet that provides [numerous language specific examples of parameterized queries using both Prepared Statements and Stored Procedures](https://cheatsheetseries.owasp.org/cheatsheets/Query_Parameterization_Cheat_Sheet.html)
- [The Bobby Tables site (inspired by the XKCD webcomic) has numerous examples in different languages of parameterized Prepared Statements and Stored Procedures](http://bobby-tables.com/)

**How to Review Code for SQL Injection Vulnerabilities**:

- [OWASP Code Review Guide](https://wiki.owasp.org/index.php/Category:OWASP_Code_Review_Project) article on how to [Review Code for SQL Injection](https://wiki.owasp.org/index.php/Reviewing_Code_for_SQL_Injection) Vulnerabilities

**How to Test for SQL Injection Vulnerabilities**:

- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide) article on how to [Test for SQL Injection](https://owasp.org/www-project-web-security-testing-guide/stable/4-Web_Application_Security_Testing/07-Input_Validation_Testing/05-Testing_for_SQL_Injection.html) Vulnerabilities

</section>

<section id="sql-injection-prevention-translation-panel" className="tabPanel translationPanel contentPanel">

# SQLインジェクション防止チートシート

## はじめに

このチートシートは、アプリケーションにおけるSQLインジェクションの欠陥を防ぐために役立ちます。SQLインジェクションとは何か、その欠陥がどこで発生するか、そしてSQLインジェクション攻撃から防御するための4つの選択肢を説明します。[SQL Injection](https://owasp.org/www-community/attacks/SQL_Injection)攻撃が一般的である理由は次のとおりです。

1. SQLインジェクションの脆弱性は非常に一般的です。
2. アプリケーションのデータベースは通常、機密データや重要データを含むため、攻撃者の標的になりやすいです。

## SQLインジェクション攻撃とは

アプリケーションに、文字列連結とユーザー入力を使用する動的なデータベースクエリがある場合、攻撃者はSQLインジェクションを使用できます。SQLインジェクションの欠陥を避けるために、開発者は次のことを行う必要があります。

1. 文字列連結による動的クエリの記述をやめる。
2. 悪意のあるSQL入力が実行されるクエリに含まれないようにする。

SQLインジェクション脆弱性を防ぐための単純な手法があり、ほぼすべてのプログラミング言語とあらゆる種類のデータベースで使用できます。XMLデータベースにも類似の問題があり得ますが、たとえばXPathインジェクションやXQueryインジェクションに対しても、これらの手法を使って保護できます。

## 典型的なSQLインジェクション脆弱性の構造

Javaにおける一般的なSQLインジェクションの欠陥を以下に示します。検証されていない`customerName`パラメータが単純にクエリへ追加されるため、攻撃者はSQLコードをそのクエリに入力できます。アプリケーションは攻撃者のコードを受け取り、データベースで実行してしまいます。

```java
String query = "SELECT account_balance FROM user_data WHERE user_name = "
             + request.getParameter("customerName");
try {
    Statement statement = connection.createStatement( ... );
    ResultSet results = statement.executeQuery( query );
}

...
```

## 主な防御策

- **選択肢1: プリペアドステートメントの使用 (パラメータ化クエリ)**
- **選択肢2: 適切に構築されたストアドプロシージャの使用**
- **選択肢3: 許可リストによる入力検証**
- **選択肢4: 強く非推奨: すべてのユーザー入力のエスケープ**

### 防御策の選択肢1: プリペアドステートメント (パラメータ化クエリ)

開発者にデータベースクエリの書き方を教えるときは、変数バインディングを伴うプリペアドステートメント、別名パラメータ化クエリを使用するよう伝えるべきです。プリペアドステートメントは動的クエリより書きやすく理解しやすいものです。また、パラメータ化クエリでは、開発者がまずすべてのSQLコードを定義し、各パラメータを後からクエリに渡すことを強制します。

データベースクエリがこのコーディングスタイルを使用する場合、どのようなユーザー入力が渡されても、データベースは常にコードとデータを区別します。また、攻撃者がSQLコマンドを挿入したとしても、プリペアドステートメントにより攻撃者はクエリの意図を変更できません。

#### 安全なJavaプリペアドステートメントの例

以下の安全なJavaの例では、攻撃者がuserIDとして`tom' or '1'='1`を入力しても、パラメータ化クエリは文字列全体`tom' or '1'='1`と文字どおり一致するユーザー名を探します。そのため、データベースは悪意のあるSQLコードの注入から保護されます。

次のコード例では、Javaにおけるパラメータ化クエリの実装である`PreparedStatement`を使用して、同じデータベースクエリを実行します。

```java
// This should REALLY be validated too
String custname = request.getParameter("customerName");
// Perform input validation to detect attacks
String query = "SELECT account_balance FROM user_data WHERE user_name = ? ";
PreparedStatement pstmt = connection.prepareStatement( query );
pstmt.setString( 1, custname);
ResultSet results = pstmt.executeQuery( );
```

#### 安全なC\# .NETプリペアドステートメントの例

.NETでは、クエリの作成と実行は変わりません。以下に示すように、`Parameters.Add()`呼び出しを使ってパラメータをクエリに渡すだけです。

```csharp
String query = "SELECT account_balance FROM user_data WHERE user_name = ?";
try {
  OleDbCommand command = new OleDbCommand(query, connection);
  command.Parameters.Add(new OleDbParameter("customerName", CustomerName Name.Text));
  OleDbDataReader reader = command.ExecuteReader();
  // …
} catch (OleDbException se) {
  // error handling
}
```

ここではJavaと.NETの例を示しましたが、Cold FusionやClassic ASPを含むほぼすべての他の言語も、パラメータ化クエリのインターフェースをサポートしています。[Hibernate Query Language](http://hibernate.org/) (HQL) のようなSQL抽象化レイヤーにも同種のインジェクション問題、すなわち[HQL Injection](http://cwe.mitre.org/data/definitions/564.html)がありますが、同様にパラメータ化クエリをサポートしています。

#### Hibernate Query Language (HQL) プリペアドステートメント (名前付きパラメータ) の例

```java
// This is an unsafe HQL statement
Query unsafeHQLQuery = session.createQuery("from Inventory where productID='"+userSuppliedParameter+"'");
// Here is a safe version of the same query using named parameters
Query safeHQLQuery = session.createQuery("from Inventory where productID=:productid");
safeHQLQuery.setParameter("productid", userSuppliedParameter);
```

#### 安全なプリペアドステートメントのその他の例

Ruby、PHP、Cold Fusion、Perl、Rustなど、プリペアドクエリやパラメータ化言語の例が必要な場合は、[Query Parameterization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Query_Parameterization_Cheat_Sheet.html)またはこの[サイト](http://bobby-tables.com/)を参照してください。

一般に、開発者はプリペアドステートメントを好みます。すべてのSQLコードがアプリケーション内に残るため、アプリケーションを比較的データベース非依存にできるからです。

### 防御策の選択肢2: ストアドプロシージャ

ストアドプロシージャが常にSQLインジェクションに対して安全であるとは限りませんが、開発者は標準的なストアドプロシージャのプログラミング構成を使用できます。ストアドプロシージャが安全に実装されている限り、このアプローチはパラメータ化クエリを使用する場合と同じ効果があります。これは、ほとんどのストアドプロシージャ言語では通常の実装です。

#### ストアドプロシージャへの安全なアプローチ

ストアドプロシージャが必要な場合、それを最も安全に使用するには、開発者が通常から大きく外れたことをしない限り、自動的にパラメータ化されるパラメータを使ってSQL文を構築する必要があります。プリペアドステートメントとストアドプロシージャの違いは、ストアドプロシージャのSQLコードはデータベース自体で定義および保存され、アプリケーションから呼び出される点です。プリペアドステートメントと安全なストアドプロシージャはSQLインジェクション防止において同等に有効であるため、組織にとって最も合理的なアプローチを選択してください。

#### ストアドプロシージャがリスクを高める場合

システムが攻撃されたとき、ストアドプロシージャがリスクを高めることがあります。たとえばMS SQL Serverには、主なデフォルトロールとして`db_datareader`、`db_datawriter`、`db_owner`があります。ストアドプロシージャが使われる前は、DBAは要件に応じてWebサービスのユーザーに`db_datareader`または`db_datawriter`権限を付与していました。

しかし、ストアドプロシージャには実行権限が必要であり、このロールはデフォルトでは利用できません。ユーザー管理が集中化されているものの、上記3つのロールに制限されている構成では、ストアドプロシージャを動作させるためにWebアプリを`db_owner`として実行しなければならない場合があります。これは当然、サーバーが侵害された場合、攻撃者がデータベースに対する完全な権限を持つことを意味します。以前であれば、攻撃者は読み取りアクセスしか持てなかったかもしれません。

#### 安全なJavaストアドプロシージャの例

次のコード例では、Javaにおけるストアドプロシージャインターフェースの実装である`CallableStatement`を使用して、同じデータベースクエリを実行します。`sp_getAccountBalance`ストアドプロシージャはデータベース内で事前に定義され、上記のクエリと同じ機能を使用する必要があります。

```java
// This should REALLY be validated
String custname = request.getParameter("customerName");
try {
  CallableStatement cs = connection.prepareCall("{call sp_getAccountBalance(?)}");
  cs.setString(1, custname);
  ResultSet results = cs.executeQuery();
  // … result set handling
} catch (SQLException se) {
  // … logging and error handling
}
```

#### 安全なVB .NETストアドプロシージャの例

次のコード例では、.NETにおけるストアドプロシージャインターフェースの実装である`SqlCommand`を使用して、同じデータベースクエリを実行します。`sp_getAccountBalance`ストアドプロシージャはデータベース内で事前に定義され、上で定義したクエリと同じ機能を使用する必要があります。

```vbnet
 Try
   Dim command As SqlCommand = new SqlCommand("sp_getAccountBalance", connection)
   command.CommandType = CommandType.StoredProcedure
   command.Parameters.Add(new SqlParameter("@CustomerName", CustomerName.Text))
   Dim reader As SqlDataReader = command.ExecuteReader()
   '...
 Catch se As SqlException
   'error handling
 End Try
```

### 防御策の選択肢3: 許可リストによる入力検証

テーブル名、列名、ソート順の指示子 (ASCまたはDESC) など、バインド変数を使用できないSQLクエリの部分に直面している場合、入力検証またはクエリの再設計が最も適切な防御策です。テーブル名や列名が必要な場合、理想的にはそれらの値はユーザーパラメータではなくコードから取得します。

#### 安全なテーブル名検証の例

警告: ユーザーパラメータ値を使用してテーブル名や列名を対象にすることは、設計が不十分である兆候です。時間が許すなら全面的な書き換えを検討すべきです。それが不可能な場合、検証されていないユーザー入力がクエリに入らないよう、開発者はパラメータ値を正当かつ期待されるテーブル名または列名にマッピングする必要があります。

以下の例では、`tableName`がこのクエリにおける正当かつ期待されるテーブル名の一つとして識別されるため、SQLクエリに直接追加できます。汎用的なテーブル検証関数は、テーブル名が期待されないクエリで使われるとデータ損失につながる可能性があることに注意してください。

```text
String tableName;
switch(PARAM):
  case "Value1": tableName = "fooTable";
                 break;
  case "Value2": tableName = "barTable";
                 break;
  ...
  default      : throw new InputValidationException("unexpected value provided"
                                                  + " for table name");
```

#### 動的SQL生成の最も安全な使用 (非推奨)

ストアドプロシージャが「安全に実装されている」と言う場合、それは安全でない動的SQL生成を含まないことを意味します。開発者は通常、ストアドプロシージャ内で動的SQLを生成しません。実行することは可能ですが、避けるべきです。

避けられない場合、ストアドプロシージャは、この記事で説明している入力検証または適切なエスケープを使用し、ストアドプロシージャへのすべてのユーザー入力が動的に生成されるクエリへSQLコードを注入するために使われないようにしなければなりません。監査担当者は、SQL Serverのストアドプロシージャ内で`sp_execute`、`execute`、`exec`が使用されていないか常に確認すべきです。他ベンダーの類似関数についても、同様の監査ガイドラインが必要です。

#### より安全な動的クエリ生成の例 (非推奨)

ソート順のような単純なものでは、ユーザー入力をbooleanに変換し、そのbooleanを使ってクエリに追加する安全な値を選択するのが最善です。これは動的クエリ作成で非常に標準的に必要になることです。

例:

```java
public String someMethod(boolean sortOrder) {
 String SQLquery = "some SQL ... order by Salary " + (sortOrder ? "ASC" : "DESC");
 ...
```

ユーザー入力を、クエリに追加する前、またはクエリに追加する値を選択するために使用する前に、日付、数値、boolean、列挙型などのString以外に変換できる場合は、それが安全に行えることを保証します。

入力検証は、この記事の前半で説明したバインド変数を使用する場合でも、すべての場合に二次的な防御策として推奨されます。強力な入力検証手法を実装する方法については、[Input Validation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)でさらに説明されています。

### 防御策の選択肢4: 強く非推奨: すべてのユーザー入力のエスケープ

このアプローチでは、開発者はクエリに入れる前にすべてのユーザー入力をエスケープします。実装はデータベースに非常に依存します。この方法論は他の防御策と比べて脆弱であり、この選択肢がすべての状況ですべてのSQLインジェクションを防ぐとは保証できません。

アプリケーションを一から構築する場合、または低いリスク許容度が求められる場合は、パラメータ化クエリ、ストアドプロシージャ、またはクエリを構築してくれる何らかのObject Relational Mapper (ORM) を使用して構築または書き直すべきです。

## 追加の防御策

4つの主要な防御策のいずれかを採用することに加えて、多層防御を提供するために、次の追加防御策もすべて採用することを推奨します。

- **最小権限**
- **許可リストによる入力検証**

### 最小権限

SQLインジェクション攻撃が成功した場合の潜在的な被害を最小化するため、環境内のすべてのデータベースアカウントに割り当てる権限を最小化すべきです。取り除く必要があるアクセス権を探すのではなく、アプリケーションアカウントに必要なアクセス権をゼロから判断してください。

読み取りアクセスだけが必要なアカウントには、アクセスが必要なテーブルへの読み取りアクセスだけを付与してください。アプリケーションアカウントにDBAまたは管理者種別のアクセスを割り当ててはいけません。その方が簡単で、すべてがただ「動く」ことは理解していますが、非常に危険です。

#### アプリケーション権限とOS権限の最小化

データベースデータに対する脅威はSQLインジェクションだけではありません。攻撃者は、提示された正当な値の一つからパラメータ値を、攻撃者には許可されていないがアプリケーション自体にはアクセスが許可されている値へ単純に変更できます。そのため、アプリケーションに付与する権限を最小化することで、攻撃者がエクスプロイトの一部としてSQLインジェクションを使おうとしていない場合でも、このような不正アクセス試行の可能性を低減できます。

同時に、DBMSが実行されるオペレーティングシステムアカウントの権限も最小化すべきです。DBMSをrootやsystemとして実行してはいけません。多くのDBMSは、初期状態では非常に強力なシステムアカウントで実行されます。たとえばMySQLはWindowsではデフォルトでsystemとして実行されます。DBMSのOSアカウントを、権限が制限された、より適切なものに変更してください。

#### 開発時の最小権限の詳細

アカウントがテーブルの一部にのみアクセスする必要がある場合は、そのデータ部分へのアクセスを制限するビューを作成し、基礎となるテーブルではなく、そのビューへのアクセスをアカウントに割り当てることを検討してください。データベースアカウントに作成権限や削除権限を付与することは、まれであるべきで、ほとんど行うべきではありません。

ストアドプロシージャを全面的に使用し、アプリケーションアカウントが独自のクエリを直接実行することを許可しない方針を採用する場合は、それらのアカウントが必要なストアドプロシージャだけを実行できるよう制限してください。データベース内のテーブルに対して直接の権限を付与してはいけません。

#### 複数DBに対する最小の管理者権限

Webアプリケーションの設計者は、Webアプリケーションでデータベースに接続するために同じ所有者または管理者アカウントを使用することを避けるべきです。Webアプリケーションごとに異なるDBユーザーを使用すべきです。

一般に、データベースへのアクセスを必要とする個別のWebアプリケーションごとに、そのアプリケーションがDBへ接続するために使用する専用のデータベースユーザーアカウントを用意すべきです。そうすることで、アプリケーション設計者はアクセス制御を細かく行い、権限を可能な限り削減できます。各DBユーザーは、必要なものに対するselectアクセスと、必要に応じた書き込みアクセスだけを持つことになります。

例として、ログインページにはテーブルのユーザー名とパスワードフィールドへの読み取りアクセスが必要ですが、いかなる形式の書き込みアクセスも不要です。つまりinsert、update、deleteは不要です。しかし、サインアップページにはそのテーブルへのinsert権限が確実に必要です。この制限は、これらのWebアプリが異なるDBユーザーを使用してデータベースへ接続する場合にのみ強制できます。

#### SQLビューによる最小権限の強化

SQLビューを使用すると、テーブルの特定フィールドまたはテーブル結合への読み取りアクセスを制限し、アクセスの粒度をさらに高められます。追加の利点もあり得ます。

たとえば、システムが、特定の法的要件などにより、ユーザーのパスワードをソルト付きハッシュではなく保存する必要がある場合、設計者はこの制約を補うためにビューを使用できます。所有者または管理者以外のすべてのDBユーザーからテーブルへのすべてのアクセスを取り消し、パスワードフィールド自体ではなく、そのハッシュを出力するビューを作成できます。

DB情報の窃取に成功したSQLインジェクション攻撃は、パスワードのハッシュ、おそらくキー付きハッシュの窃取に制限されます。どのWebアプリケーションのDBユーザーもテーブル自体にアクセスできないためです。

### 許可リストによる入力検証

入力検証は、他に方法がない場合、たとえばバインド変数が適用できない場合の主要な防御策であることに加えて、SQLクエリに渡す前に未許可の入力を検出するための二次的な防御策としても使用できます。詳細については[Input Validation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)を参照してください。ここでは注意して進めてください。検証済みデータであっても、文字列構築によってSQLクエリへ挿入して安全であるとは限りません。

## Related Articles

**SQL Injection Attack Cheat Sheets**:

The following articles describe how to exploit different kinds of SQL injection vulnerabilities on various platforms (that this article was created to help you avoid):

- [SQL Injection Cheat Sheet](https://www.netsparker.com/blog/web-security/sql-injection-cheat-sheet/)
- Bypassing WAF's with SQLi - [SQL Injection Bypassing WAF](https://owasp.org/www-community/attacks/SQL_Injection_Bypassing_WAF)

**Description of SQL Injection Vulnerabilities**:

- OWASP article on [SQL Injection](https://owasp.org/www-community/attacks/SQL_Injection) Vulnerabilities
- OWASP article on [Blind_SQL_Injection](https://owasp.org/www-community/attacks/Blind_SQL_Injection) Vulnerabilities

**How to Avoid SQL Injection Vulnerabilities**:

- [OWASP Developers Guide](https://github.com/OWASP/DevGuide) article on how to avoid SQL injection vulnerabilities
- OWASP Cheat Sheet that provides [numerous language specific examples of parameterized queries using both Prepared Statements and Stored Procedures](https://cheatsheetseries.owasp.org/cheatsheets/Query_Parameterization_Cheat_Sheet.html)
- [The Bobby Tables site (inspired by the XKCD webcomic) has numerous examples in different languages of parameterized Prepared Statements and Stored Procedures](http://bobby-tables.com/)

**How to Review Code for SQL Injection Vulnerabilities**:

- [OWASP Code Review Guide](https://wiki.owasp.org/index.php/Category:OWASP_Code_Review_Project) article on how to [Review Code for SQL Injection](https://wiki.owasp.org/index.php/Reviewing_Code_for_SQL_Injection) Vulnerabilities

**How to Test for SQL Injection Vulnerabilities**:

- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide) article on how to [Test for SQL Injection](https://owasp.org/www-project-web-security-testing-guide/stable/4-Web_Application_Security_Testing/07-Input_Validation_Testing/05-Testing_for_SQL_Injection.html) Vulnerabilities

</section>

<section id="sql-injection-prevention-bilingual-panel" className="tabPanel bilingualPanel">

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

# SQL Injection Prevention Cheat Sheet

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

# SQLインジェクション防止チートシート

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Introduction

This cheat sheet will help you prevent SQL injection flaws in your applications. It will define what SQL injection is, explain where those flaws occur, and provide four options for defending against SQL injection attacks. [SQL Injection](https://owasp.org/www-community/attacks/SQL_Injection) attacks are common because:

1. SQL Injection vulnerabilities are very common.
2. The application's database is a frequent target for attackers because it typically contains sensitive or critical data.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## はじめに

このチートシートは、アプリケーションにおけるSQLインジェクションの欠陥を防ぐために役立ちます。SQLインジェクションとは何か、その欠陥がどこで発生するか、そしてSQLインジェクション攻撃から防御するための4つの選択肢を説明します。[SQL Injection](https://owasp.org/www-community/attacks/SQL_Injection)攻撃が一般的である理由は次のとおりです。

1. SQLインジェクションの脆弱性は非常に一般的です。
2. アプリケーションのデータベースは通常、機密データや重要データを含むため、攻撃者の標的になりやすいです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## What Is a SQL Injection Attack?

Attackers can use SQL injection on an application if it has dynamic database queries that use string concatenation and user-supplied input. To avoid SQL injection flaws, developers need to:

1. Stop writing dynamic queries with string concatenation.
2. Prevent malicious SQL input from being included in executed queries.

There are simple techniques for preventing SQL injection vulnerabilities, and they can be used with practically any kind of programming language and any type of database. While XML databases can have similar problems (e.g., XPath and XQuery injection), these techniques can be used to protect them as well.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## SQLインジェクション攻撃とは

アプリケーションに、文字列連結とユーザー入力を使用する動的なデータベースクエリがある場合、攻撃者はSQLインジェクションを使用できます。SQLインジェクションの欠陥を避けるために、開発者は次のことを行う必要があります。

1. 文字列連結による動的クエリの記述をやめる。
2. 悪意のあるSQL入力が実行されるクエリに含まれないようにする。

SQLインジェクション脆弱性を防ぐための単純な手法があり、ほぼすべてのプログラミング言語とあらゆる種類のデータベースで使用できます。XMLデータベースにも類似の問題があり得ますが、たとえばXPathインジェクションやXQueryインジェクションに対しても、これらの手法を使って保護できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Anatomy of a Typical SQL Injection Vulnerability

A common SQL injection flaw in Java is shown below. Because its unvalidated "customerName" parameter is simply appended to the query, an attacker can enter SQL code into that query and the application would take the attacker's code and execute it on the database.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 典型的なSQLインジェクション脆弱性の構造

Javaにおける一般的なSQLインジェクションの欠陥を以下に示します。検証されていない`customerName`パラメータが単純にクエリへ追加されるため、攻撃者はSQLコードをそのクエリに入力できます。アプリケーションは攻撃者のコードを受け取り、データベースで実行してしまいます。

</div>
</div>

<div className="bilingualPair shared">
<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```java
String query = "SELECT account_balance FROM user_data WHERE user_name = "
             + request.getParameter("customerName");
try {
    Statement statement = connection.createStatement( ... );
    ResultSet results = statement.executeQuery( query );
}

...
```

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Primary Defenses

- **Option 1: Use of Prepared Statements (with Parameterized Queries)**
- **Option 2: Use of Properly Constructed Stored Procedures**
- **Option 3: Allow-list Input Validation**
- **Option 4: STRONGLY DISCOURAGED: Escaping All User Supplied Input**

### Defense Option 1: Prepared Statements (with Parameterized Queries)

When developers are taught how to write database queries, they should be told to use prepared statements with variable binding (aka parameterized queries). Prepared statements are simple to write and easier to understand than dynamic queries, and parameterized queries force the developer to define all SQL code first and pass in each parameter to the query later.

If database queries use this coding style, the database will always distinguish between code and data, regardless of what user input is supplied. Also, prepared statements ensure that an attacker cannot change the intent of a query, even if SQL commands are inserted by an attacker.

#### Safe Java Prepared Statement Example

In the safe Java example below, if an attacker were to enter the userID as `tom' or '1'='1`, the parameterized query would look for a username that literally matches the entire string `tom' or '1'='1`. Thus, the database would be protected against injections of malicious SQL code.

The following code example uses a `PreparedStatement`, Java's implementation of a parameterized query, to execute the same database query.

#### Safe C\# .NET Prepared Statement Example

In .NET, the creation and execution of the query doesn't change. Just pass the parameters to the query using the `Parameters.Add()` call as shown below.

While we have shown examples in Java and .NET, practically all other languages (including Cold Fusion and Classic ASP) support parameterized query interfaces. Even SQL abstraction layers, like the [Hibernate Query Language](http://hibernate.org/) (HQL) with the same type of injection problems (called [HQL Injection](http://cwe.mitre.org/data/definitions/564.html))  support parameterized queries as well:

#### Hibernate Query Language (HQL) Prepared Statement (Named Parameters) Example

#### Other Examples of Safe Prepared Statements

If you need examples of prepared queries/parameterized languages, including Ruby, PHP, Cold Fusion, Perl, and Rust, see the [Query Parameterization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Query_Parameterization_Cheat_Sheet.html) or this [site](http://bobby-tables.com/).

Generally, developers like prepared statements because all the SQL code stays within the application, which makes applications relatively database independent.

### Defense Option 2: Stored Procedures

Though stored procedures are not always safe from SQL injection, developers can use certain standard stored procedure programming constructs. This approach has the same effect as using parameterized queries, as long as the stored procedures are implemented safely (which is the norm for most stored procedure languages).

#### Safe Approach to Stored Procedures

If stored procedures are needed, the safest approach to using them requires the developer to build SQL statements with parameters that are automatically parameterized, unless the developer does something largely out of the norm. The difference between prepared statements and stored procedures is that the SQL code for a stored procedure is defined and stored in the database itself, then called from the application. Since prepared statements and safe stored procedures are equally effective in preventing SQL injection, your organization should choose the approach that makes the most sense for you.

#### When Stored Procedures Can Increase Risk

Occasionally, stored procedures can increase risk when a system is attacked. For example, on MS SQL Server, you have three main default roles: `db_datareader`, `db_datawriter` and `db_owner`. Before stored procedures came into use, DBAs would give `db_datareader` or `db_datawriter` rights to the webservice's user, depending on the requirements.

However, stored procedures require execute rights, a role not available by default. In some setups where user management has been centralized, but is limited to those 3 roles, web apps would have to run as `db_owner` so stored procedures could work. Naturally, that means that if a server is breached, the attacker has full rights to the database, where previously, they might only have had read-access.

#### Safe Java Stored Procedure Example

The following code example uses Java's implementation of the stored procedure interface (`CallableStatement`) to execute the same database query. The `sp_getAccountBalance` stored procedure has to be predefined in the database and use the same functionality as the query above.

#### Safe VB .NET Stored Procedure Example

The following code example uses a `SqlCommand`, .NET's implementation of the stored procedure interface, to execute the same database query. The `sp_getAccountBalance` stored procedure must be predefined in the database and use the same functionality as the query defined above.

### Defense Option 3: Allow-list Input Validation

If you are faced with parts of SQL queries that can't use bind variables, such as table names, column names, or sort order indicators (ASC or DESC), input validation or query redesign is the most appropriate defense. When table or column names are needed, ideally those values come from the code and not from user parameters.

#### Sample Of Safe Table Name Validation

WARNING: Using user parameter values to target table or column names is a symptom of poor design and a full rewrite should be considered if time allows. If that is not possible, developers should map the parameter values to the legal/expected table or column names to make sure unvalidated user input doesn't end up in the query.

In the example below, since `tableName` is identified as one of the legal and expected values for a table name in this query, it can be directly appended to the SQL query. Keep in mind that generic table validation functions can lead to data loss if table names are used in queries where they are not expected.

#### Safest Use Of Dynamic SQL Generation (DISCOURAGED)

When we say a stored procedure is "implemented safely," that means it does not include any unsafe dynamic SQL generation. Developers do not usually generate dynamic SQL inside stored procedures. However, it can be done, but should be avoided.

If it can't be avoided, the stored procedure must use input validation or proper escaping, as described in this article, to make sure that all user supplied input to the stored procedure can't be used to inject SQL code into the dynamically generated query. Auditors should always look for uses of `sp_execute`, `execute` or `exec` within SQL Server stored procedures. Similar audit guidelines are necessary for similar functions for other vendors.

#### Sample of Safer Dynamic Query Generation (DISCOURAGED)

For something simple like a sort order, it is best if the user supplied input is converted to a boolean, and then that boolean is used to select the safe value to append to the query. This is a very standard need in dynamic query creation.

For example:

Any time user input can be converted to a non-String, like a date, numeric, boolean, enumerated type, etc. before it is appended to a query, or used to select a value to append to the query, this ensures it is safe to do so.

Input validation is also recommended as a secondary defense in ALL cases, even when using bind variables as discussed earlier in this article. More techniques on how to implement strong input validation techniquies are described in the [Input Validation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html).

### Defense Option 4: STRONGLY DISCOURAGED: Escaping All User-Supplied Input

In this approach, the developer will escape all user input before putting it in a query. It is very database specific in its implementation.  This methodology is fragile compared to other defenses, and we CANNOT guarantee that this option will prevent all SQL injections in all situations.

If an application is built from scratch or requires low risk tolerance, it should be built or re-written using parameterized queries, stored procedures, or some kind of Object Relational Mapper (ORM) that builds your queries for you.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 主な防御策

- **選択肢1: プリペアドステートメントの使用 (パラメータ化クエリ)**
- **選択肢2: 適切に構築されたストアドプロシージャの使用**
- **選択肢3: 許可リストによる入力検証**
- **選択肢4: 強く非推奨: すべてのユーザー入力のエスケープ**

### 防御策の選択肢1: プリペアドステートメント (パラメータ化クエリ)

開発者にデータベースクエリの書き方を教えるときは、変数バインディングを伴うプリペアドステートメント、別名パラメータ化クエリを使用するよう伝えるべきです。プリペアドステートメントは動的クエリより書きやすく理解しやすいものです。また、パラメータ化クエリでは、開発者がまずすべてのSQLコードを定義し、各パラメータを後からクエリに渡すことを強制します。

データベースクエリがこのコーディングスタイルを使用する場合、どのようなユーザー入力が渡されても、データベースは常にコードとデータを区別します。また、攻撃者がSQLコマンドを挿入したとしても、プリペアドステートメントにより攻撃者はクエリの意図を変更できません。

#### 安全なJavaプリペアドステートメントの例

以下の安全なJavaの例では、攻撃者がuserIDとして`tom' or '1'='1`を入力しても、パラメータ化クエリは文字列全体`tom' or '1'='1`と文字どおり一致するユーザー名を探します。そのため、データベースは悪意のあるSQLコードの注入から保護されます。

次のコード例では、Javaにおけるパラメータ化クエリの実装である`PreparedStatement`を使用して、同じデータベースクエリを実行します。

#### 安全なC\# .NETプリペアドステートメントの例

.NETでは、クエリの作成と実行は変わりません。以下に示すように、`Parameters.Add()`呼び出しを使ってパラメータをクエリに渡すだけです。

ここではJavaと.NETの例を示しましたが、Cold FusionやClassic ASPを含むほぼすべての他の言語も、パラメータ化クエリのインターフェースをサポートしています。[Hibernate Query Language](http://hibernate.org/) (HQL) のようなSQL抽象化レイヤーにも同種のインジェクション問題、すなわち[HQL Injection](http://cwe.mitre.org/data/definitions/564.html)がありますが、同様にパラメータ化クエリをサポートしています。

#### Hibernate Query Language (HQL) プリペアドステートメント (名前付きパラメータ) の例

#### 安全なプリペアドステートメントのその他の例

Ruby、PHP、Cold Fusion、Perl、Rustなど、プリペアドクエリやパラメータ化言語の例が必要な場合は、[Query Parameterization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Query_Parameterization_Cheat_Sheet.html)またはこの[サイト](http://bobby-tables.com/)を参照してください。

一般に、開発者はプリペアドステートメントを好みます。すべてのSQLコードがアプリケーション内に残るため、アプリケーションを比較的データベース非依存にできるからです。

### 防御策の選択肢2: ストアドプロシージャ

ストアドプロシージャが常にSQLインジェクションに対して安全であるとは限りませんが、開発者は標準的なストアドプロシージャのプログラミング構成を使用できます。ストアドプロシージャが安全に実装されている限り、このアプローチはパラメータ化クエリを使用する場合と同じ効果があります。これは、ほとんどのストアドプロシージャ言語では通常の実装です。

#### ストアドプロシージャへの安全なアプローチ

ストアドプロシージャが必要な場合、それを最も安全に使用するには、開発者が通常から大きく外れたことをしない限り、自動的にパラメータ化されるパラメータを使ってSQL文を構築する必要があります。プリペアドステートメントとストアドプロシージャの違いは、ストアドプロシージャのSQLコードはデータベース自体で定義および保存され、アプリケーションから呼び出される点です。プリペアドステートメントと安全なストアドプロシージャはSQLインジェクション防止において同等に有効であるため、組織にとって最も合理的なアプローチを選択してください。

#### ストアドプロシージャがリスクを高める場合

システムが攻撃されたとき、ストアドプロシージャがリスクを高めることがあります。たとえばMS SQL Serverには、主なデフォルトロールとして`db_datareader`、`db_datawriter`、`db_owner`があります。ストアドプロシージャが使われる前は、DBAは要件に応じてWebサービスのユーザーに`db_datareader`または`db_datawriter`権限を付与していました。

しかし、ストアドプロシージャには実行権限が必要であり、このロールはデフォルトでは利用できません。ユーザー管理が集中化されているものの、上記3つのロールに制限されている構成では、ストアドプロシージャを動作させるためにWebアプリを`db_owner`として実行しなければならない場合があります。これは当然、サーバーが侵害された場合、攻撃者がデータベースに対する完全な権限を持つことを意味します。以前であれば、攻撃者は読み取りアクセスしか持てなかったかもしれません。

#### 安全なJavaストアドプロシージャの例

次のコード例では、Javaにおけるストアドプロシージャインターフェースの実装である`CallableStatement`を使用して、同じデータベースクエリを実行します。`sp_getAccountBalance`ストアドプロシージャはデータベース内で事前に定義され、上記のクエリと同じ機能を使用する必要があります。

#### 安全なVB .NETストアドプロシージャの例

次のコード例では、.NETにおけるストアドプロシージャインターフェースの実装である`SqlCommand`を使用して、同じデータベースクエリを実行します。`sp_getAccountBalance`ストアドプロシージャはデータベース内で事前に定義され、上で定義したクエリと同じ機能を使用する必要があります。

### 防御策の選択肢3: 許可リストによる入力検証

テーブル名、列名、ソート順の指示子 (ASCまたはDESC) など、バインド変数を使用できないSQLクエリの部分に直面している場合、入力検証またはクエリの再設計が最も適切な防御策です。テーブル名や列名が必要な場合、理想的にはそれらの値はユーザーパラメータではなくコードから取得します。

#### 安全なテーブル名検証の例

警告: ユーザーパラメータ値を使用してテーブル名や列名を対象にすることは、設計が不十分である兆候です。時間が許すなら全面的な書き換えを検討すべきです。それが不可能な場合、検証されていないユーザー入力がクエリに入らないよう、開発者はパラメータ値を正当かつ期待されるテーブル名または列名にマッピングする必要があります。

以下の例では、`tableName`がこのクエリにおける正当かつ期待されるテーブル名の一つとして識別されるため、SQLクエリに直接追加できます。汎用的なテーブル検証関数は、テーブル名が期待されないクエリで使われるとデータ損失につながる可能性があることに注意してください。

#### 動的SQL生成の最も安全な使用 (非推奨)

ストアドプロシージャが「安全に実装されている」と言う場合、それは安全でない動的SQL生成を含まないことを意味します。開発者は通常、ストアドプロシージャ内で動的SQLを生成しません。実行することは可能ですが、避けるべきです。

避けられない場合、ストアドプロシージャは、この記事で説明している入力検証または適切なエスケープを使用し、ストアドプロシージャへのすべてのユーザー入力が動的に生成されるクエリへSQLコードを注入するために使われないようにしなければなりません。監査担当者は、SQL Serverのストアドプロシージャ内で`sp_execute`、`execute`、`exec`が使用されていないか常に確認すべきです。他ベンダーの類似関数についても、同様の監査ガイドラインが必要です。

#### より安全な動的クエリ生成の例 (非推奨)

ソート順のような単純なものでは、ユーザー入力をbooleanに変換し、そのbooleanを使ってクエリに追加する安全な値を選択するのが最善です。これは動的クエリ作成で非常に標準的に必要になることです。

例:

ユーザー入力を、クエリに追加する前、またはクエリに追加する値を選択するために使用する前に、日付、数値、boolean、列挙型などのString以外に変換できる場合は、それが安全に行えることを保証します。

入力検証は、この記事の前半で説明したバインド変数を使用する場合でも、すべての場合に二次的な防御策として推奨されます。強力な入力検証手法を実装する方法については、[Input Validation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)でさらに説明されています。

### 防御策の選択肢4: 強く非推奨: すべてのユーザー入力のエスケープ

このアプローチでは、開発者はクエリに入れる前にすべてのユーザー入力をエスケープします。実装はデータベースに非常に依存します。この方法論は他の防御策と比べて脆弱であり、この選択肢がすべての状況ですべてのSQLインジェクションを防ぐとは保証できません。

アプリケーションを一から構築する場合、または低いリスク許容度が求められる場合は、パラメータ化クエリ、ストアドプロシージャ、またはクエリを構築してくれる何らかのObject Relational Mapper (ORM) を使用して構築または書き直すべきです。

</div>
</div>

<div className="bilingualPair shared">
<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```java
// This should REALLY be validated too
String custname = request.getParameter("customerName");
// Perform input validation to detect attacks
String query = "SELECT account_balance FROM user_data WHERE user_name = ? ";
PreparedStatement pstmt = connection.prepareStatement( query );
pstmt.setString( 1, custname);
ResultSet results = pstmt.executeQuery( );
```

```csharp
String query = "SELECT account_balance FROM user_data WHERE user_name = ?";
try {
  OleDbCommand command = new OleDbCommand(query, connection);
  command.Parameters.Add(new OleDbParameter("customerName", CustomerName Name.Text));
  OleDbDataReader reader = command.ExecuteReader();
  // …
} catch (OleDbException se) {
  // error handling
}
```

```java
// This is an unsafe HQL statement
Query unsafeHQLQuery = session.createQuery("from Inventory where productID='"+userSuppliedParameter+"'");
// Here is a safe version of the same query using named parameters
Query safeHQLQuery = session.createQuery("from Inventory where productID=:productid");
safeHQLQuery.setParameter("productid", userSuppliedParameter);
```

```java
// This should REALLY be validated
String custname = request.getParameter("customerName");
try {
  CallableStatement cs = connection.prepareCall("{call sp_getAccountBalance(?)}");
  cs.setString(1, custname);
  ResultSet results = cs.executeQuery();
  // … result set handling
} catch (SQLException se) {
  // … logging and error handling
}
```

```vbnet
 Try
   Dim command As SqlCommand = new SqlCommand("sp_getAccountBalance", connection)
   command.CommandType = CommandType.StoredProcedure
   command.Parameters.Add(new SqlParameter("@CustomerName", CustomerName.Text))
   Dim reader As SqlDataReader = command.ExecuteReader()
   '...
 Catch se As SqlException
   'error handling
 End Try
```

```text
String tableName;
switch(PARAM):
  case "Value1": tableName = "fooTable";
                 break;
  case "Value2": tableName = "barTable";
                 break;
  ...
  default      : throw new InputValidationException("unexpected value provided"
                                                  + " for table name");
```

```java
public String someMethod(boolean sortOrder) {
 String SQLquery = "some SQL ... order by Salary " + (sortOrder ? "ASC" : "DESC");
 ...
```

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Additional Defenses

Beyond adopting one of the four primary defenses, we also recommend adopting all of these additional defenses to provide defense in depth. These additional defenses are:

- **Least Privilege**
- **Allow-list Input Validation**

### Least Privilege

To minimize the potential damage of a successful SQL injection attack, you should minimize the privileges assigned to every database account in your environment. Start from the ground up to determine what access rights your application accounts require, rather than trying to figure out what access rights you need to take away.

Make sure that accounts that only need read access are only granted read access to the tables they need access to. DO NOT ASSIGN DBA OR ADMIN TYPE ACCESS TO YOUR APPLICATION ACCOUNTS. We understand that this is easy, and everything just "works" when you do it this way, but it is very dangerous.

#### Minimizing Application and OS Privileges

SQL injection is not the only threat to your database data. Attackers can simply change the parameter values from one of the legal values they are presented with, to a value that is unauthorized for them, but the application itself might be authorized to access. As such, minimizing the privileges granted to your application will reduce the likelihood of such unauthorized access attempts, even when an attacker is not trying to use SQL injection as part of their exploit.

While you are at it, you should minimize the privileges of the operating system account that the DBMS runs under. Don't run your DBMS as root or system! Most DBMSs run out of the box with a very powerful system account. For example, MySQL runs as system on Windows by default! Change the DBMS's OS account to something more appropriate, with restricted privileges.

#### Details Of Least Privilege When Developing

If an account only needs access to portions of a table, consider creating a view that limits access to that portion of the data and assigning the account access to the view instead of the underlying table. Rarely, if ever, grant create or delete access to database accounts.

If you adopt a policy where you use stored procedures everywhere, and don't allow application accounts to directly execute their own queries, then restrict those accounts to only be able to execute the stored procedures they need. Don't grant them any rights directly to the tables in the database.

#### Least Admin Privileges For Multiple DBs

The designers of web applications should avoid using the same owner/admin account in the web applications to connect to the database. Different DB users should be used for different web applications.

In general, each separate web application that requires access to the database should have a designated database user account that the application will use to connect to the DB. That way, the designer of the application can have good granularity in the access control, thus reducing the privileges as much as possible. Each DB user will then have select access to only what it needs, and write-access as needed.

As an example, a login page requires read access to the username and password fields of a table, but no write access of any form (no insert, update, or delete). However, the sign-up page certainly requires insert privilege to that table; this restriction can only be enforced if these web apps use different DB users to connect to the database.

#### Enhancing Least Privilege with SQL Views

You can use SQL views to further increase the granularity of access by limiting the read access to specific fields of a table or joins of tables. It could have additional benefits.

For example, if the system is required (perhaps due to some specific legal requirements) to store the passwords of the users, instead of salted-hashed passwords, the designer could use views to compensate for this limitation. They could revoke all access to the table (from all DB users except the owner/admin) and create a view that outputs the hash of the password field and not the field itself.

Any SQL injection attack that succeeds in stealing DB information will be restricted to stealing the hash of the passwords (could even be a keyed hash), since no DB user for any of the web applications has access to the table itself.

### Allow-list Input Validation

In addition to being a primary defense when nothing else is possible (e.g., when a bind variable isn't legal), input validation can also be a secondary defense used to detect unauthorized input before it is passed to the SQL query. For more information please see the [Input Validation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html). Proceed with caution here. Validated data is not necessarily safe to insert into SQL queries via string building.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 追加の防御策

4つの主要な防御策のいずれかを採用することに加えて、多層防御を提供するために、次の追加防御策もすべて採用することを推奨します。

- **最小権限**
- **許可リストによる入力検証**

### 最小権限

SQLインジェクション攻撃が成功した場合の潜在的な被害を最小化するため、環境内のすべてのデータベースアカウントに割り当てる権限を最小化すべきです。取り除く必要があるアクセス権を探すのではなく、アプリケーションアカウントに必要なアクセス権をゼロから判断してください。

読み取りアクセスだけが必要なアカウントには、アクセスが必要なテーブルへの読み取りアクセスだけを付与してください。アプリケーションアカウントにDBAまたは管理者種別のアクセスを割り当ててはいけません。その方が簡単で、すべてがただ「動く」ことは理解していますが、非常に危険です。

#### アプリケーション権限とOS権限の最小化

データベースデータに対する脅威はSQLインジェクションだけではありません。攻撃者は、提示された正当な値の一つからパラメータ値を、攻撃者には許可されていないがアプリケーション自体にはアクセスが許可されている値へ単純に変更できます。そのため、アプリケーションに付与する権限を最小化することで、攻撃者がエクスプロイトの一部としてSQLインジェクションを使おうとしていない場合でも、このような不正アクセス試行の可能性を低減できます。

同時に、DBMSが実行されるオペレーティングシステムアカウントの権限も最小化すべきです。DBMSをrootやsystemとして実行してはいけません。多くのDBMSは、初期状態では非常に強力なシステムアカウントで実行されます。たとえばMySQLはWindowsではデフォルトでsystemとして実行されます。DBMSのOSアカウントを、権限が制限された、より適切なものに変更してください。

#### 開発時の最小権限の詳細

アカウントがテーブルの一部にのみアクセスする必要がある場合は、そのデータ部分へのアクセスを制限するビューを作成し、基礎となるテーブルではなく、そのビューへのアクセスをアカウントに割り当てることを検討してください。データベースアカウントに作成権限や削除権限を付与することは、まれであるべきで、ほとんど行うべきではありません。

ストアドプロシージャを全面的に使用し、アプリケーションアカウントが独自のクエリを直接実行することを許可しない方針を採用する場合は、それらのアカウントが必要なストアドプロシージャだけを実行できるよう制限してください。データベース内のテーブルに対して直接の権限を付与してはいけません。

#### 複数DBに対する最小の管理者権限

Webアプリケーションの設計者は、Webアプリケーションでデータベースに接続するために同じ所有者または管理者アカウントを使用することを避けるべきです。Webアプリケーションごとに異なるDBユーザーを使用すべきです。

一般に、データベースへのアクセスを必要とする個別のWebアプリケーションごとに、そのアプリケーションがDBへ接続するために使用する専用のデータベースユーザーアカウントを用意すべきです。そうすることで、アプリケーション設計者はアクセス制御を細かく行い、権限を可能な限り削減できます。各DBユーザーは、必要なものに対するselectアクセスと、必要に応じた書き込みアクセスだけを持つことになります。

例として、ログインページにはテーブルのユーザー名とパスワードフィールドへの読み取りアクセスが必要ですが、いかなる形式の書き込みアクセスも不要です。つまりinsert、update、deleteは不要です。しかし、サインアップページにはそのテーブルへのinsert権限が確実に必要です。この制限は、これらのWebアプリが異なるDBユーザーを使用してデータベースへ接続する場合にのみ強制できます。

#### SQLビューによる最小権限の強化

SQLビューを使用すると、テーブルの特定フィールドまたはテーブル結合への読み取りアクセスを制限し、アクセスの粒度をさらに高められます。追加の利点もあり得ます。

たとえば、システムが、特定の法的要件などにより、ユーザーのパスワードをソルト付きハッシュではなく保存する必要がある場合、設計者はこの制約を補うためにビューを使用できます。所有者または管理者以外のすべてのDBユーザーからテーブルへのすべてのアクセスを取り消し、パスワードフィールド自体ではなく、そのハッシュを出力するビューを作成できます。

DB情報の窃取に成功したSQLインジェクション攻撃は、パスワードのハッシュ、おそらくキー付きハッシュの窃取に制限されます。どのWebアプリケーションのDBユーザーもテーブル自体にアクセスできないためです。

### 許可リストによる入力検証

入力検証は、他に方法がない場合、たとえばバインド変数が適用できない場合の主要な防御策であることに加えて、SQLクエリに渡す前に未許可の入力を検出するための二次的な防御策としても使用できます。詳細については[Input Validation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)を参照してください。ここでは注意して進めてください。検証済みデータであっても、文字列構築によってSQLクエリへ挿入して安全であるとは限りません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Related Articles

**SQL Injection Attack Cheat Sheets**:

The following articles describe how to exploit different kinds of SQL injection vulnerabilities on various platforms (that this article was created to help you avoid):

- [SQL Injection Cheat Sheet](https://www.netsparker.com/blog/web-security/sql-injection-cheat-sheet/)
- Bypassing WAF's with SQLi - [SQL Injection Bypassing WAF](https://owasp.org/www-community/attacks/SQL_Injection_Bypassing_WAF)

**Description of SQL Injection Vulnerabilities**:

- OWASP article on [SQL Injection](https://owasp.org/www-community/attacks/SQL_Injection) Vulnerabilities
- OWASP article on [Blind_SQL_Injection](https://owasp.org/www-community/attacks/Blind_SQL_Injection) Vulnerabilities

**How to Avoid SQL Injection Vulnerabilities**:

- [OWASP Developers Guide](https://github.com/OWASP/DevGuide) article on how to avoid SQL injection vulnerabilities
- OWASP Cheat Sheet that provides [numerous language specific examples of parameterized queries using both Prepared Statements and Stored Procedures](https://cheatsheetseries.owasp.org/cheatsheets/Query_Parameterization_Cheat_Sheet.html)
- [The Bobby Tables site (inspired by the XKCD webcomic) has numerous examples in different languages of parameterized Prepared Statements and Stored Procedures](http://bobby-tables.com/)

**How to Review Code for SQL Injection Vulnerabilities**:

- [OWASP Code Review Guide](https://wiki.owasp.org/index.php/Category:OWASP_Code_Review_Project) article on how to [Review Code for SQL Injection](https://wiki.owasp.org/index.php/Reviewing_Code_for_SQL_Injection) Vulnerabilities

**How to Test for SQL Injection Vulnerabilities**:

- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide) article on how to [Test for SQL Injection](https://owasp.org/www-project-web-security-testing-guide/stable/4-Web_Application_Security_Testing/07-Input_Validation_Testing/05-Testing_for_SQL_Injection.html) Vulnerabilities

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## Related Articles

**SQL Injection Attack Cheat Sheets**:

The following articles describe how to exploit different kinds of SQL injection vulnerabilities on various platforms (that this article was created to help you avoid):

- [SQL Injection Cheat Sheet](https://www.netsparker.com/blog/web-security/sql-injection-cheat-sheet/)
- Bypassing WAF's with SQLi - [SQL Injection Bypassing WAF](https://owasp.org/www-community/attacks/SQL_Injection_Bypassing_WAF)

**Description of SQL Injection Vulnerabilities**:

- OWASP article on [SQL Injection](https://owasp.org/www-community/attacks/SQL_Injection) Vulnerabilities
- OWASP article on [Blind_SQL_Injection](https://owasp.org/www-community/attacks/Blind_SQL_Injection) Vulnerabilities

**How to Avoid SQL Injection Vulnerabilities**:

- [OWASP Developers Guide](https://github.com/OWASP/DevGuide) article on how to avoid SQL injection vulnerabilities
- OWASP Cheat Sheet that provides [numerous language specific examples of parameterized queries using both Prepared Statements and Stored Procedures](https://cheatsheetseries.owasp.org/cheatsheets/Query_Parameterization_Cheat_Sheet.html)
- [The Bobby Tables site (inspired by the XKCD webcomic) has numerous examples in different languages of parameterized Prepared Statements and Stored Procedures](http://bobby-tables.com/)

**How to Review Code for SQL Injection Vulnerabilities**:

- [OWASP Code Review Guide](https://wiki.owasp.org/index.php/Category:OWASP_Code_Review_Project) article on how to [Review Code for SQL Injection](https://wiki.owasp.org/index.php/Reviewing_Code_for_SQL_Injection) Vulnerabilities

**How to Test for SQL Injection Vulnerabilities**:

- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide) article on how to [Test for SQL Injection](https://owasp.org/www-project-web-security-testing-guide/stable/4-Web_Application_Security_Testing/07-Input_Validation_Testing/05-Testing_for_SQL_Injection.html) Vulnerabilities

</div>
</div>

</section>
</div>

## Attribution

<div className="attributionFooter">

- Original: SQL Injection Prevention Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: English original retained for comparison. Japanese translation added. Bilingual display generated from official source and local Japanese translation.
- Retrieved: 2026-05-21

</div>
