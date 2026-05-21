# SQLインジェクション防止チートシート 日本語訳

## Attribution

- Original: SQL Injection Prevention Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-21

## 日本語訳

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
```text

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
```text

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
```text

ここではJavaと.NETの例を示しましたが、Cold FusionやClassic ASPを含むほぼすべての他の言語も、パラメータ化クエリのインターフェースをサポートしています。[Hibernate Query Language](http://hibernate.org/) (HQL) のようなSQL抽象化レイヤーにも同種のインジェクション問題、すなわち[HQL Injection](http://cwe.mitre.org/data/definitions/564.html)がありますが、同様にパラメータ化クエリをサポートしています。

#### Hibernate Query Language (HQL) プリペアドステートメント (名前付きパラメータ) の例

```java
// This is an unsafe HQL statement
Query unsafeHQLQuery = session.createQuery("from Inventory where productID='"+userSuppliedParameter+"'");
// Here is a safe version of the same query using named parameters
Query safeHQLQuery = session.createQuery("from Inventory where productID=:productid");
safeHQLQuery.setParameter("productid", userSuppliedParameter);
```text

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
```text

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
```text

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
```text

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

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V1.2 | SQLインジェクション防止チートシートの主要な管理策 |
