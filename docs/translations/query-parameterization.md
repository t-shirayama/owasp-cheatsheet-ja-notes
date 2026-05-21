# クエリパラメータ化チートシート 日本語訳

## Attribution

- Original: Query Parameterization Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Query_Parameterization_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-21

## 日本語訳

# クエリパラメータ化チートシート

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

## References

- [The Bobby Tables site (inspired by the XKCD webcomic) has numerous examples in different languages of parameterized Prepared Statements and Stored Procedures](http://bobby-tables.com/)
- OWASP [SQL Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V1.2 | クエリパラメータ化チートシートの主要な管理策 |
