---
title: Injection Prevention Cheat Sheet
hide_title: true
---

<div className="docHero" data-category="encoding-and-sanitization">
  <h1>インジェクション防止チートシート</h1>
  <div className="docMeta">
    <span className="docPill">最終更新: 2026-05-21</span>
    <span className="docPill">読了時間: 約 15 分</span>
    <span className="docPill">カテゴリ: 入力検証とサニタイズ</span>
  </div>
</div>

<p className="docLead">インジェクション防止チートシートを、原文・翻訳・対比表示で確認できます。ASVS Index 対応の文脈で、公式原文と日本語訳を確認しやすく整理しています。</p>

<div className="tabbedContent">
  <input className="tabInput" type="radio" name="injection-prevention-view" id="injection-prevention-original" />
  <input className="tabInput" type="radio" name="injection-prevention-view" id="injection-prevention-translation" defaultChecked />
  <input className="tabInput" type="radio" name="injection-prevention-view" id="injection-prevention-bilingual" />

  <div className="contentTabs">
    <label htmlFor="injection-prevention-original" title="OWASP 原文">原文</label>
    <label htmlFor="injection-prevention-translation" title="日本語訳">翻訳</label>
    <label htmlFor="injection-prevention-bilingual" title="原文と翻訳を並べて確認">対比表示</label>
  </div>

<section id="injection-prevention-original-panel" className="tabPanel originalPanel contentPanel">

# Injection Prevention Cheat Sheet

## Introduction

This article is focused on providing clear, simple, actionable guidance for preventing the entire category of Injection flaws in your applications. Injection attacks, especially [SQL Injection](https://owasp.org/www-community/attacks/SQL_Injection), are unfortunately very common.

Application accessibility is a very important factor in protection and prevention of injection flaws. Only the minority of all applications within a company/enterprise are developed in house, where as most applications are from external sources. Open source applications give at least the opportunity to fix problems, but closed source applications need a different approach to injection flaws.

Injection flaws occur when an application sends untrusted data to an interpreter. Injection flaws are very prevalent, particularly in legacy code, often found in SQL queries, LDAP queries, XPath queries, OS commands, program arguments, etc. Injection flaws are easy to discover when examining code, but more difficult via testing. Scanners and fuzzers can help attackers find them.

Depending on the accessibility different actions must be taken in order to fix them. It is always the best way to fix the problem in source code itself, or even redesign some parts of the applications. But if the source code is not available or it is simply uneconomical to fix legacy software only virtual patching makes sense.

## Application Types

Three classes of applications can usually be seen within a company. Those 3 types are needed to identify the actions which need to take place in order to prevent/fix injection flaws.

### A1: New Application

A new web application in the design phase, or in early stage development.

### A2: Productive Open Source Application

An already productive application, which can be easily adapted. A Model-View-Controller (MVC) type application is just one example of having a easily accessible application architecture.

### A3: Productive Closed Source Application

A productive application which cannot or only with difficulty be modified.

## Forms of Injection

There are several forms of injection targeting different technologies including SQL queries, LDAP queries, XPath queries and OS commands.

### Query languages

The most famous form of injection is SQL Injection where an attacker can modify existing database queries. For more information see the [SQL Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html).

But also LDAP, SOAP, XPath and REST based queries can be susceptible to injection attacks allowing for data retrieval or control bypass.

#### SQL Injection

An SQL injection attack consists of insertion or "injection" of either a partial or complete SQL query via the data input or transmitted from the client (browser) to the web application.

A successful SQL injection attack can read sensitive data from the database, modify database data (insert/update/delete), execute administration operations on the database (such as shutdown the DBMS), recover the content of a given file existing on the DBMS file system or write files into the file system, and, in some cases, issue commands to the operating system. SQL injection attacks are a type of injection attack, in which SQL commands are injected into data-plane input in order to affect the execution of predefined SQL commands.

SQL Injection attacks can be divided into the following three classes:

- **Inband:** data is extracted using the same channel that is used to inject the SQL code. This is the most straightforward kind of attack, in which the retrieved data is presented directly in the application web page.
- **Out-of-band:** data is retrieved using a different channel (e.g., an email with the results of the query is generated and sent to the tester).
- **Inferential or Blind:** there is no actual transfer of data, but the tester is able to reconstruct the information by sending particular requests and observing the resulting behavior of the DB Server.

##### How to test for the issue

###### During code review

please check for any queries to the database are not done via prepared statements.

If dynamic statements are being made please check if the data is sanitized before used as part of the statement.

Auditors should always look for uses of sp_execute, execute or exec within SQL Server stored procedures. Similar audit guidelines are necessary for similar functions for other vendors.

###### Automated Exploitation

Most of the situation and techniques below here can be performed in a automated way using some tools. In this article the tester can find information how to perform an automated auditing using [SQLMap](https://wiki.owasp.org/index.php/Automated_Audit_using_SQLMap)

Equally Static Code Analysis Data flow rules can detect of unsanitized user controlled input can change the SQL query.

###### Stored Procedure Injection

When using dynamic SQL within a stored procedure, the application must properly sanitize the user input to eliminate the risk of code injection. If not sanitized, the user could enter malicious SQL that will be executed within the stored procedure.

###### Time delay Exploitation technique

The time delay exploitation technique is very useful when the tester find a Blind SQL Injection situation, in which nothing is known on the outcome of an operation. This technique consists in sending an injected query and in case the conditional is true, the tester can monitor the time taken to for the server to respond. If there is a delay, the tester can assume the result of the conditional query is true. This exploitation technique can be different from DBMS to DBMS (check DBMS specific section).

```text
http://www.example.com/product.php?id=10 AND IF(version() like '5%', sleep(10), 'false'))--
```

In this example the tester is checking whether the MySql version is 5.x or not, making the server delay the answer by 10 seconds. The tester can increase the delay time and monitor the responses. The tester also doesn't need to wait for the response. Sometimes they can set a very high value (e.g. 100) and cancel the request after some seconds.

###### Out of band Exploitation technique

This technique is very useful when the tester find a Blind SQL Injection situation, in which nothing is known on the outcome of an operation. The technique consists of the use of DBMS functions to perform an out of band connection and deliver the results of the injected query as part of the request to the tester's server. Like the error based techniques, each DBMS has its own functions. Check for specific DBMS section.

##### Remediation

###### Defense Option 1: Prepared Statements (with Parameterized Queries)

Prepared statements ensure that an attacker is not able to change the intent of a query, even if SQL commands are inserted by an attacker. In the safe example below, if an attacker were to enter the userID of `tom' or '1'='1`, the parameterized query would not be vulnerable and would instead look for a username which literally matched the entire string `tom' or '1'='1`.

###### Defense Option 2: Stored Procedures

The difference between prepared statements and stored procedures is that the SQL code for a stored procedure is defined and stored in the database itself, and then called from the application.

Both of these techniques have the same effectiveness in preventing SQL injection so your organization should choose which approach makes the most sense for you. Stored procedures are not always safe from SQL injection. However, certain standard stored procedure programming constructs have the same effect as the use of parameterized queries when implemented safely* which is the norm for most stored procedure languages.

*Note:* 'Implemented safely' means the stored procedure does not include any unsafe dynamic SQL generation.

###### Defense Option 3: Allow-List Input Validation

Various parts of SQL queries aren't legal locations for the use of bind variables, such as the names of tables or columns, and the sort order indicator (ASC or DESC). In such situations, input validation or query redesign is the most appropriate defense. For the names of tables or columns, ideally those values come from the code, and not from user parameters.

But if user parameter values are used to make different for table names and column names, then the parameter values should be mapped to the legal/expected table or column names to make sure unvalidated user input doesn't end up in the query. Please note, this is a symptom of poor design and a full rewrite should be considered if time allows.

###### Defense Option 4: Escaping All User-Supplied Input

This technique should only be used as a last resort, when none of the above are feasible. Input validation is probably a better choice as this methodology is frail compared to other defenses and we cannot guarantee it will prevent all SQL Injection in all situations.

This technique is to escape user input before putting it in a query. It's usually only recommended to retrofit legacy code when implementing input validation isn't cost effective.

##### Example code - Java

###### Safe Java Prepared Statement Example

The following code example uses a `PreparedStatement`, Java's implementation of a parameterized query, to execute the same database query.

```java
// This should REALLY be validated too
String custname = request.getParameter("customerName");
// Perform input validation to detect attacks
String query = "SELECT account_balance FROM user_data WHERE user_name = ?";
PreparedStatement pstmt = connection.prepareStatement(query);
pstmt.setString(1, custname);
ResultSet results = pstmt.executeQuery();
```

We have shown examples in Java, but practically all other languages, including Cold Fusion, and Classic ASP, support parameterized query interfaces.

###### Safe Java Stored Procedure Example

The following code example uses a `CallableStatement`, Java's implementation of the stored procedure interface, to execute the same database query. The `sp_getAccountBalance` stored procedure would have to be predefined in the database and implement the same functionality as the query defined above.

```java
// This should REALLY be validated
String custname = request.getParameter("customerName");
try {
 CallableStatement cs = connection.prepareCall("{call sp_getAccountBalance(?)}");
 cs.setString(1, custname);
 ResultSet results = cs.executeQuery();
 // Result set handling...
} catch (SQLException se) {
 // Logging and error handling...
}
```

#### LDAP Injection

LDAP Injection is an attack used to exploit web based applications that construct LDAP statements based on user input. When an application fails to properly sanitize user input, it's possible to modify LDAP statements through techniques similar to [SQL Injection](https://owasp.org/www-community/attacks/SQL_Injection). LDAP injection attacks could result in the granting of permissions to unauthorized queries, and content modification inside the LDAP tree. For more information on LDAP Injection attacks, visit [LDAP injection](https://owasp.org/www-community/attacks/LDAP_Injection).

[LDAP injection](https://owasp.org/www-community/attacks/LDAP_Injection) attacks are common due to two factors:

1. The lack of safer, parameterized LDAP query interfaces
2. The widespread use of LDAP to authenticate users to systems.

##### How to test for the issue

###### During code review

Please check for any queries to the LDAP escape special characters, see [here](https://cheatsheetseries.owasp.org/cheatsheets/LDAP_Injection_Prevention_Cheat_Sheet.html#defense-option-1-escape-all-variables-using-the-right-ldap-encoding-function).

###### Automated Exploitation

Scanner module of tool like OWASP [ZAP](https://www.zaproxy.org/) have module to detect LDAP injection issue.

##### Remediation

###### Escape all variables using the right LDAP encoding function

The main way LDAP stores names is based on DN ([distinguished name](https://ldapwiki.com/wiki/Distinguished%20Names)). You can think of this like a unique identifier. These are sometimes used to access resources, like a username.

A DN might look like this

```text
cn=Richard Feynman, ou=Physics Department, dc=Caltech, dc=edu
```

or

```text
uid=inewton, ou=Mathematics Department, dc=Cambridge, dc=com
```

There are certain characters that are considered special characters in a DN. The exhaustive list is the following: `\ # + < > , ; " =` and leading or trailing spaces

Each DN points to exactly 1 entry, which can be thought of sort of like a row in a RDBMS. For each entry, there will be 1 or more attributes which are analogous to RDBMS columns. If you are interested in searching through LDAP for users will certain attributes, you may do so with search filters. In a search filter, you can use standard boolean logic to get a list of users matching an arbitrary constraint. Search filters are written in Polish notation AKA prefix notation.

Example:

```text
(&(ou=Physics)(| (manager=cn=Freeman Dyson,ou=Physics,dc=Caltech,dc=edu)
(manager=cn=Albert Einstein,ou=Physics,dc=Princeton,dc=edu) ))
```

When building LDAP queries in application code, you MUST escape any untrusted data that is added to any LDAP query. There are two forms of LDAP escaping. Encoding for LDAP Search and Encoding for LDAP DN (distinguished name). The proper escaping depends on whether you are sanitizing input for a search filter, or you are using a DN as a username-like credential for accessing some resource.

##### Example code - Java

###### Safe Java for LDAP escaping Example

```java
public String escapeDN (String name) {
 //From RFC 2253 and the / character for JNDI
 final char[] META_CHARS = {'+', '"', '<', '>', ';', '/'};
 String escapedStr = new String(name);
 //Backslash is both a Java and an LDAP escape character,
 //so escape it first
 escapedStr = escapedStr.replaceAll("\\\\\\\\","\\\\\\\\");
 //Positional characters - see RFC 2253
 escapedStr = escapedStr.replaceAll("\^#","\\\\\\\\#");
 escapedStr = escapedStr.replaceAll("\^ | $","\\\\\\\\ ");
 for (int i=0 ; i < META_CHARS.length ; i++) {
        escapedStr = escapedStr.replaceAll("\\\\" +
                     META_CHARS[i],"\\\\\\\\" + META_CHARS[i]);
 }
 return escapedStr;
}
```

Note, that the backslash character is a Java String literal and a regular expression escape character.

```java
public String escapeSearchFilter (String filter) {
 //From RFC 2254
 String escapedStr = new String(filter);
 escapedStr = escapedStr.replaceAll("\\\\\\\\","\\\\\\\\5c");
 escapedStr = escapedStr.replaceAll("\\\\\*","\\\\\\\\2a");
 escapedStr = escapedStr.replaceAll("\\\\(","\\\\\\\\28");
 escapedStr = escapedStr.replaceAll("\\\\)","\\\\\\\\29");
 escapedStr = escapedStr.replaceAll("\\\\" +
               Character.toString('\\u0000'), "\\\\\\\\00");
 return escapedStr;
}
```

#### XPath Injection

TODO

### Scripting languages

All scripting languages used in web applications have a form of an `eval` call which receives code at runtime and executes it. If code is crafted using unvalidated and unescaped user input code injection can occur which allows an attacker to subvert application logic and eventually to gain local access.

Every time a scripting language is used, the actual implementation of the 'higher' scripting language is done using a 'lower' language like C. If the scripting language has a flaw in the data handling code '[Null Byte Injection](http://projects.webappsec.org/w/page/13246949/Null%20Byte%20Injection)' attack vectors can be deployed to gain access to other areas in memory, which results in a successful attack.

### Operating System Commands

OS command injection is a technique used via a web interface in order to execute OS commands on a web server. The user supplies operating system commands through a web interface in order to execute OS commands.

Any web interface that is not properly sanitized is subject to this exploit. With the ability to execute OS commands, the user can upload malicious programs or even obtain passwords. OS command injection is preventable when security is emphasized during the design and development of applications.

#### How to test for the issue

##### During code review

Check if any command execute methods are called and in unvalidated user input are taken as data for that command.

Out side of that, appending a semicolon to the end of a URL query parameter followed by an operating system command, will execute the command. `%3B` is URL encoded and decodes to semicolon. This is because the `;` is interpreted as a command separator.

Example: `http://sensitive/something.php?dir=%3Bcat%20/etc/passwd`

If the application responds with the output of the `/etc/passwd` file then you know the attack has been successful. Many web application scanners can be used to test for this attack as they inject variations of command injections and test the response.

Equally Static Code Analysis tools check the data flow of untrusted user input into a web application and check if the data is then entered into a dangerous method which executes the user input as a command.

#### Remediation

If it is considered unavoidable the call to a system command incorporated with user-supplied, the following two layers of defense should be used within software in order to prevent attacks

1. **Parameterization** - If available, use structured mechanisms that automatically enforce the separation between data and command. These mechanisms can help to provide the relevant quoting, encoding.
2. **Input validation** - the values for commands and the relevant arguments should be both validated. There are different degrees of validation for the actual command and its arguments:
    - When it comes to the **commands** used, these must be validated against a list of allowed commands.
    - In regards to the **arguments** used for these commands, they should be validated using the following options:
        - Positive or allowlist input validation - where are the arguments allowed explicitly defined
        - Allow-list Regular Expression - where is explicitly defined a list of good characters allowed and the maximum length of the string. Ensure that metacharacters like `& | ; $ > < \` \ !` and whitespaces are not part of the Regular Expression. For example, the following regular expression only allows lowercase letters and numbers, and does not contain metacharacters. The length is also being limited to 3-10 characters:

`^[a-z0-9]&#123;3,10&#125;$`

#### Example code - Java

##### Incorrect Usage

```java
ProcessBuilder b = new ProcessBuilder("C:\DoStuff.exe -arg1 -arg2");
```

In this example, the command together with the arguments are passed as a one string, making easy to manipulate that expression and inject malicious strings.

##### Correct Usage

Here is an example that starts a process with a modified working directory. The command and each of the arguments are passed separately. This make it easy to validated each term and reduces the risk to insert malicious strings.

```java
ProcessBuilder pb = new ProcessBuilder("TrustedCmd", "TrustedArg1", "TrustedArg2");
Map<String, String> env = pb.environment();
pb.directory(new File("TrustedDir"));
Process p = pb.start();
```

### Network Protocols

Web applications often communicate with network daemons (like SMTP, IMAP, FTP) where user input becomes part of the communication stream. Here it is possible to inject command sequences to abuse an established session.

## Injection Prevention Rules

### Rule \#1 (Perform proper input validation)

Perform proper input validation. Positive or allowlist input validation with appropriate canonicalization is also recommended, but **is not a complete defense** as many applications require special characters in their input.

### Rule \#2 (Use a safe API)

The preferred option is to use a safe API which avoids the use of the interpreter entirely or provides a parameterized interface. Be careful of APIs, such as stored procedures, that are parameterized, but can still introduce injection under the hood.

### Rule \#3 (Contextually escape user data)

If a parameterized API is not available, you should carefully escape special characters using the specific escape syntax for that interpreter.

## Other Injection Cheatsheets

[SQL Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)

[OS Command Injection Defense Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/OS_Command_Injection_Defense_Cheat_Sheet.html)

[LDAP Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/LDAP_Injection_Prevention_Cheat_Sheet.html)

[Injection Prevention Cheat Sheet in Java](https://cheatsheetseries.owasp.org/cheatsheets/Injection_Prevention_in_Java_Cheat_Sheet.html)

</section>

<section id="injection-prevention-translation-panel" className="tabPanel translationPanel contentPanel">

# インジェクション防止チートシート

## はじめに

この記事は、アプリケーションにおけるインジェクション欠陥というカテゴリ全体を防止するための、明確で簡潔かつ実行可能なガイダンスを提供することに重点を置いています。インジェクション攻撃、特に [SQL Injection](https://owasp.org/www-community/attacks/SQL_Injection) は、残念ながら非常に一般的です。

アプリケーションへどの程度アクセスできるかは、インジェクション欠陥の保護と防止において非常に重要な要素です。企業内のすべてのアプリケーションのうち、社内で開発されるものは少数であり、多くは外部由来です。オープンソースアプリケーションであれば少なくとも問題を修正する機会がありますが、クローズドソースアプリケーションではインジェクション欠陥に対して別のアプローチが必要です。

インジェクション欠陥は、アプリケーションが信頼できないデータをインタプリタへ送信するときに発生します。インジェクション欠陥は非常に広く存在し、特にレガシーコードで多く見られ、SQL クエリ、LDAP クエリ、XPath クエリ、OS コマンド、プログラム引数などでよく発生します。インジェクション欠陥は、コードを調べると発見しやすい一方、テストではより発見が困難です。スキャナやファザーは、攻撃者がそれらを見つける助けになります。

アクセス可能性に応じて、修正のために取るべき対応は異なります。問題をソースコード自体で修正すること、あるいはアプリケーションの一部を再設計することが、常に最善の方法です。しかし、ソースコードを利用できない場合や、レガシーソフトウェアを修正することが単純に経済的ではない場合には、仮想パッチのみが現実的です。

## アプリケーションの種類

企業内では通常、三つのクラスのアプリケーションが見られます。これら三つの種類は、インジェクション欠陥を防止または修正するために必要な対応を特定するために必要です。

### A1: 新規アプリケーション

設計段階、または開発初期段階にある新しい Web アプリケーションです。

### A2: 稼働中のオープンソースアプリケーション

すでに稼働しており、容易に適応できるアプリケーションです。Model-View-Controller (MVC) 型アプリケーションは、アクセスしやすいアプリケーションアーキテクチャの一例です。

### A3: 稼働中のクローズドソースアプリケーション

変更できない、または変更が困難な、稼働中のアプリケーションです。

## インジェクションの形態

SQL クエリ、LDAP クエリ、XPath クエリ、OS コマンドなど、さまざまな技術を対象とするインジェクションの形態があります。

### クエリ言語

最も有名なインジェクションの形態は SQL Injection であり、攻撃者は既存のデータベースクエリを変更できます。詳細については、[SQL Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html) を参照してください。

LDAP、SOAP、XPath、REST ベースのクエリもインジェクション攻撃の影響を受ける可能性があり、データ取得や制御回避を許すことがあります。

#### SQL インジェクション

SQL インジェクション攻撃は、データ入力またはクライアント (ブラウザ) から Web アプリケーションへ送信されるデータを通じて、SQL クエリの一部または完全な SQL クエリを挿入、すなわち「インジェクション」することで成立します。

SQL インジェクション攻撃が成功すると、データベースから機密データを読み取る、データベースデータを変更する (insert/update/delete)、データベース上で管理操作を実行する (DBMS の shutdown など)、DBMS ファイルシステム上に存在する特定ファイルの内容を復元する、ファイルシステムへファイルを書き込む、場合によってはオペレーティングシステムへコマンドを発行する、といったことが可能になります。SQL インジェクション攻撃はインジェクション攻撃の一種であり、あらかじめ定義された SQL コマンドの実行に影響を与えるため、データプレーン入力に SQL コマンドを注入します。

SQL Injection 攻撃は、次の三つのクラスに分けられます。

- **Inband:** SQL コードの注入に使われるものと同じチャネルを使ってデータを抽出します。これは最も単純な種類の攻撃であり、取得されたデータはアプリケーションの Web ページに直接表示されます。
- **Out-of-band:** 別のチャネルを使ってデータを取得します。たとえば、クエリ結果を含むメールが生成され、テスターへ送信されます。
- **Inferential or Blind:** 実際のデータ転送はありませんが、テスターは特定のリクエストを送信し、DB Server の結果の挙動を観察することで情報を再構成できます。

##### 問題のテスト方法

###### コードレビュー時

データベースへのクエリが prepared statement を使わずに実行されていないか確認してください。

動的ステートメントが作成されている場合は、そのステートメントの一部として使用される前にデータがサニタイズされているか確認してください。

監査者は、SQL Server のストアドプロシージャ内で `sp_execute`、`execute`、`exec` が使われていないか常に確認すべきです。他のベンダーにおける同様の関数についても、同様の監査ガイドラインが必要です。

###### 自動化された悪用

以下の状況や技術の多くは、いくつかのツールを使って自動化された方法で実行できます。この記事では、テスターは [SQLMap](https://wiki.owasp.org/index.php/Automated_Audit_using_SQLMap) を使った自動監査の実施方法に関する情報を見つけることができます。

同様に、静的コード解析のデータフロールールは、サニタイズされていないユーザー制御入力が SQL クエリを変更できることを検出できます。

###### ストアドプロシージャインジェクション

ストアドプロシージャ内で動的 SQL を使用する場合、アプリケーションはコードインジェクションのリスクを排除するため、ユーザー入力を適切にサニタイズしなければなりません。サニタイズされていない場合、ユーザーは悪意のある SQL を入力でき、それがストアドプロシージャ内で実行されます。

###### 時間遅延を用いた悪用技術

時間遅延を用いた悪用技術は、操作結果について何も分からない Blind SQL Injection の状況をテスターが見つけた場合に非常に有用です。この技術は、注入したクエリを送信し、条件が真の場合に、サーバーが応答するまでにかかった時間をテスターが監視するというものです。遅延がある場合、テスターは条件付きクエリの結果が真であると推測できます。この悪用技術は DBMS によって異なる場合があります (DBMS 固有のセクションを確認してください)。

```text
http://www.example.com/product.php?id=10 AND IF(version() like '5%', sleep(10), 'false'))--
```

この例では、テスターは MySql のバージョンが 5.x であるかどうかを確認し、サーバーの応答を 10 秒遅らせています。テスターは遅延時間を増やし、応答を監視できます。また、テスターは応答を待つ必要もありません。非常に大きな値 (例: 100) を設定し、数秒後にリクエストをキャンセルできる場合もあります。

###### Out of band を用いた悪用技術

この技術は、操作結果について何も分からない Blind SQL Injection の状況をテスターが見つけた場合に非常に有用です。この技術は、DBMS 関数を使って out of band 接続を実行し、注入されたクエリの結果をテスターのサーバーへのリクエストの一部として配送するものです。エラーベースの技術と同様に、各 DBMS には独自の関数があります。特定の DBMS セクションを確認してください。

##### 修復

###### 防御策 1: Prepared Statement (パラメータ化クエリ)

Prepared statement は、攻撃者が SQL コマンドを挿入した場合でも、クエリの意図を変更できないことを保証します。下の安全な例では、攻撃者が userID として `tom' or '1'='1` を入力したとしても、パラメータ化クエリは脆弱にならず、代わりに文字列全体 `tom' or '1'='1` と文字どおり一致するユーザー名を探します。

###### 防御策 2: ストアドプロシージャ

Prepared statement とストアドプロシージャの違いは、ストアドプロシージャの SQL コードがデータベース自体で定義および保存され、アプリケーションから呼び出される点です。

これら二つの技術は SQL インジェクション防止において同等の効果を持つため、組織はどちらのアプローチが最も合理的かを選択すべきです。ストアドプロシージャは、SQL インジェクションに対して常に安全とは限りません。ただし、標準的なストアドプロシージャのプログラミング構造の中には、安全に実装された場合にパラメータ化クエリの使用と同じ効果を持つものがあります。これは多くのストアドプロシージャ言語では通常の形です。

*注:* 「安全に実装」とは、ストアドプロシージャに安全ではない動的 SQL 生成が含まれていないことを意味します。

###### 防御策 3: 許可リストによる入力検証

テーブル名やカラム名、並び替え順を示す指示子 (ASC または DESC) など、SQL クエリのさまざまな部分ではバインド変数を使用できない場所があります。このような状況では、入力検証またはクエリの再設計が最も適切な防御です。テーブル名やカラム名については、理想的にはそれらの値はユーザーパラメータではなくコードから来るべきです。

しかし、ユーザーパラメータ値を使ってテーブル名やカラム名を切り替える場合は、未検証のユーザー入力がクエリに入らないようにするため、そのパラメータ値を正当かつ期待されるテーブル名またはカラム名にマッピングすべきです。これは設計不良の兆候であり、時間が許す場合は全面的な書き換えを検討すべきである点に注意してください。

###### 防御策 4: すべてのユーザー指定入力のエスケープ

この技術は、上記のいずれも実現できない場合の最後の手段としてのみ使用すべきです。この方法は他の防御策に比べて脆弱であり、あらゆる状況ですべての SQL Injection を防げるとは保証できないため、入力検証の方がより良い選択である可能性があります。

この技術は、ユーザー入力をクエリに入れる前にエスケープするものです。通常、入力検証の実装が費用対効果に合わない場合に、レガシーコードへ後付けする目的でのみ推奨されます。

##### コード例 - Java

###### 安全な Java Prepared Statement の例

次のコード例では、パラメータ化クエリの Java 実装である `PreparedStatement` を使って、同じデータベースクエリを実行します。

```java
// This should REALLY be validated too
String custname = request.getParameter("customerName");
// Perform input validation to detect attacks
String query = "SELECT account_balance FROM user_data WHERE user_name = ?";
PreparedStatement pstmt = connection.prepareStatement(query);
pstmt.setString(1, custname);
ResultSet results = pstmt.executeQuery();
```

ここでは Java の例を示しましたが、Cold Fusion や Classic ASP を含む、実質的に他のすべての言語でも、パラメータ化クエリインターフェースがサポートされています。

###### 安全な Java ストアドプロシージャの例

次のコード例では、ストアドプロシージャインターフェースの Java 実装である `CallableStatement` を使って、同じデータベースクエリを実行します。`sp_getAccountBalance` ストアドプロシージャはデータベース内で事前定義されており、上で定義したクエリと同じ機能を実装している必要があります。

```java
// This should REALLY be validated
String custname = request.getParameter("customerName");
try {
 CallableStatement cs = connection.prepareCall("{call sp_getAccountBalance(?)}");
 cs.setString(1, custname);
 ResultSet results = cs.executeQuery();
 // Result set handling...
} catch (SQLException se) {
 // Logging and error handling...
}
```

#### LDAP インジェクション

LDAP Injection は、ユーザー入力に基づいて LDAP ステートメントを構築する Web ベースアプリケーションを悪用する攻撃です。アプリケーションがユーザー入力を適切にサニタイズしない場合、[SQL Injection](https://owasp.org/www-community/attacks/SQL_Injection) と似た技術によって LDAP ステートメントを変更できる可能性があります。LDAP インジェクション攻撃は、認可されていないクエリへの権限付与や、LDAP ツリー内の内容変更につながる可能性があります。LDAP Injection 攻撃の詳細については、[LDAP injection](https://owasp.org/www-community/attacks/LDAP_Injection) を参照してください。

[LDAP injection](https://owasp.org/www-community/attacks/LDAP_Injection) 攻撃は、次の二つの要因により一般的です。

1. より安全な、パラメータ化された LDAP クエリインターフェースが不足していること。
2. システムへのユーザー認証に LDAP が広く使用されていること。

##### 問題のテスト方法

###### コードレビュー時

LDAP へのクエリで特殊文字がエスケープされているか確認してください。[こちら](https://cheatsheetseries.owasp.org/cheatsheets/LDAP_Injection_Prevention_Cheat_Sheet.html#defense-option-1-escape-all-variables-using-the-right-ldap-encoding-function) を参照してください。

###### 自動化された悪用

OWASP [ZAP](https://www.zaproxy.org/) のようなツールのスキャナモジュールには、LDAP インジェクション問題を検出するモジュールがあります。

##### 修復

###### 適切な LDAP エンコーディング関数を使用してすべての変数をエスケープする

LDAP が名前を保存する主な方法は、DN ([distinguished name](https://ldapwiki.com/wiki/Distinguished%20Names)) に基づいています。これは一意識別子のようなものだと考えることができます。これらは、ユーザー名のように、リソースへアクセスするために使われることがあります。

DN は次のような形式になります。

```text
cn=Richard Feynman, ou=Physics Department, dc=Caltech, dc=edu
```

または次のような形式です。

```text
uid=inewton, ou=Mathematics Department, dc=Cambridge, dc=com
```

DN では特殊文字と見なされる文字があります。網羅的な一覧は、`\ # + < > , ; " =` と、先頭または末尾の空白です。

各 DN は厳密に 1 つのエントリを指し、RDBMS における行のようなものと考えられます。各エントリには、RDBMS のカラムに相当する 1 つ以上の属性があります。LDAP 内で特定の属性を持つユーザーを検索したい場合は、検索フィルタを使用できます。検索フィルタでは、標準的なブール論理を使って任意の制約に一致するユーザー一覧を取得できます。検索フィルタはポーランド記法、すなわち前置記法で書かれます。

例:

```text
(&(ou=Physics)(| (manager=cn=Freeman Dyson,ou=Physics,dc=Caltech,dc=edu)
(manager=cn=Albert Einstein,ou=Physics,dc=Princeton,dc=edu) ))
```

アプリケーションコードで LDAP クエリを構築する場合、LDAP クエリに追加される信頼できないデータはすべてエスケープすることが必須です。LDAP エスケープには二つの形式があります。LDAP Search 用のエンコーディングと、LDAP DN (distinguished name) 用のエンコーディングです。適切なエスケープは、検索フィルタ用に入力をサニタイズしているのか、何らかのリソースへアクセスするためのユーザー名に似た資格情報として DN を使っているのかによって異なります。

##### コード例 - Java

###### LDAP エスケープのための安全な Java の例

```java
public String escapeDN (String name) {
 //From RFC 2253 and the / character for JNDI
 final char[] META_CHARS = {'+', '"', '<', '>', ';', '/'};
 String escapedStr = new String(name);
 //Backslash is both a Java and an LDAP escape character,
 //so escape it first
 escapedStr = escapedStr.replaceAll("\\\\\\\\","\\\\\\\\");
 //Positional characters - see RFC 2253
 escapedStr = escapedStr.replaceAll("\^#","\\\\\\\\#");
 escapedStr = escapedStr.replaceAll("\^ | $","\\\\\\\\ ");
 for (int i=0 ; i < META_CHARS.length ; i++) {
        escapedStr = escapedStr.replaceAll("\\\\" +
                     META_CHARS[i],"\\\\\\\\" + META_CHARS[i]);
 }
 return escapedStr;
}
```

バックスラッシュ文字は Java 文字列リテラルであり、正規表現のエスケープ文字でもある点に注意してください。

```java
public String escapeSearchFilter (String filter) {
 //From RFC 2254
 String escapedStr = new String(filter);
 escapedStr = escapedStr.replaceAll("\\\\\\\\","\\\\\\\\5c");
 escapedStr = escapedStr.replaceAll("\\\\\*","\\\\\\\\2a");
 escapedStr = escapedStr.replaceAll("\\\\(","\\\\\\\\28");
 escapedStr = escapedStr.replaceAll("\\\\)","\\\\\\\\29");
 escapedStr = escapedStr.replaceAll("\\\\" +
               Character.toString('\\u0000'), "\\\\\\\\00");
 return escapedStr;
}
```

#### XPath インジェクション

TODO

### スクリプト言語

Web アプリケーションで使われるすべてのスクリプト言語には、実行時にコードを受け取り、それを実行する `eval` 呼び出しの形態があります。未検証かつ未エスケープのユーザー入力を使ってコードが組み立てられる場合、コードインジェクションが発生し、攻撃者がアプリケーションロジックを破壊し、最終的にはローカルアクセスを得ることを可能にします。

スクリプト言語が使われるたびに、その「高水準」スクリプト言語の実際の実装は C のような「低水準」言語を使って行われます。スクリプト言語のデータ処理コードに欠陥がある場合、'[Null Byte Injection](http://projects.webappsec.org/w/page/13246949/Null%20Byte%20Injection)' 攻撃ベクターを展開してメモリ内の他領域へアクセスでき、攻撃が成功する結果になります。

### オペレーティングシステムコマンド

OS コマンドインジェクションは、Web サーバー上で OS コマンドを実行するために Web インターフェースを介して使用される技術です。ユーザーは、OS コマンドを実行するために Web インターフェースを通じてオペレーティングシステムコマンドを提供します。

適切にサニタイズされていない Web インターフェースは、すべてこの悪用の対象になります。OS コマンドを実行できる能力により、ユーザーは悪意のあるプログラムをアップロードしたり、パスワードを取得したりできます。OS コマンドインジェクションは、アプリケーションの設計と開発においてセキュリティを重視すれば防止できます。

#### 問題のテスト方法

##### コードレビュー時

コマンド実行メソッドが呼び出されていないか、また、未検証のユーザー入力がそのコマンドのデータとして使用されていないか確認してください。

それ以外にも、URL クエリパラメータの末尾にセミコロンを追加し、その後にオペレーティングシステムコマンドを続けると、コマンドが実行されます。`%3B` は URL エンコードされており、デコードするとセミコロンになります。これは、`;` がコマンド区切りとして解釈されるためです。

例: `http://sensitive/something.php?dir=%3Bcat%20/etc/passwd`

アプリケーションが `/etc/passwd` ファイルの出力で応答した場合、攻撃が成功したことが分かります。多くの Web アプリケーションスキャナは、この攻撃のテストに使用できます。それらはコマンドインジェクションのバリエーションを注入し、応答をテストします。

同様に、静的コード解析ツールは、信頼できないユーザー入力が Web アプリケーション内を流れるデータフローを確認し、そのデータがユーザー入力をコマンドとして実行する危険なメソッドへ入力されていないか確認します。

#### 修復

ユーザー指定値を組み込んだシステムコマンド呼び出しが避けられないと考えられる場合、攻撃を防ぐために、ソフトウェア内で次の二層の防御を使用すべきです。

1. **パラメータ化** - 利用可能な場合は、データとコマンドの分離を自動的に強制する構造化された仕組みを使用します。これらの仕組みは、適切なクォートやエンコーディングの提供に役立ちます。
2. **入力検証** - コマンドと関連する引数の値は、どちらも検証する必要があります。実際のコマンドとその引数には、検証の程度に違いがあります。
    - 使用される **コマンド** については、許可されたコマンドのリストと照合して検証しなければなりません。
    - これらのコマンドに使用される **引数** については、次の選択肢を使って検証すべきです。
        - ポジティブ入力検証または許可リスト入力検証 - 許可される引数を明示的に定義します。
        - 許可リスト正規表現 - 良好な文字として許可されるリストと、文字列の最大長を明示的に定義します。`& | ; $ > < \` \ !` のようなメタ文字や空白文字が正規表現に含まれないようにしてください。たとえば、次の正規表現は小文字と数字のみを許可し、メタ文字を含みません。また、長さも 3 から 10 文字に制限されています。

`^[a-z0-9]&#123;3,10&#125;$`

#### コード例 - Java

##### 誤った使用例

```java
ProcessBuilder b = new ProcessBuilder("C:\DoStuff.exe -arg1 -arg2");
```

この例では、コマンドと引数が 1 つの文字列として渡されています。そのため、この式を操作して悪意のある文字列を注入しやすくなります。

##### 正しい使用例

次の例は、変更された作業ディレクトリでプロセスを開始します。コマンドと各引数は個別に渡されます。これにより、各要素を検証しやすくなり、悪意のある文字列が挿入されるリスクを低減できます。

```java
ProcessBuilder pb = new ProcessBuilder("TrustedCmd", "TrustedArg1", "TrustedArg2");
Map<String, String> env = pb.environment();
pb.directory(new File("TrustedDir"));
Process p = pb.start();
```

### ネットワークプロトコル

Web アプリケーションは、ユーザー入力が通信ストリームの一部になるネットワークデーモン (SMTP、IMAP、FTP など) と通信することがよくあります。ここでは、確立済みセッションを悪用するためにコマンドシーケンスを注入できる可能性があります。

## インジェクション防止ルール

### ルール #1 (適切な入力検証を実施する)

適切な入力検証を実施します。適切な正規化を伴うポジティブ入力検証または許可リスト入力検証も推奨されますが、多くのアプリケーションでは入力に特殊文字が必要になるため、これは **完全な防御ではありません**。

### ルール #2 (安全な API を使用する)

推奨される選択肢は、インタプリタの使用を完全に避ける、またはパラメータ化インターフェースを提供する安全な API を使用することです。ストアドプロシージャのように、パラメータ化されていても内部でインジェクションを引き起こし得る API には注意してください。

### ルール #3 (ユーザーデータをコンテキストに応じてエスケープする)

パラメータ化 API を利用できない場合は、そのインタプリタ固有のエスケープ構文を使って特殊文字を慎重にエスケープすべきです。

## その他のインジェクションチートシート

[SQL Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)

[OS Command Injection Defense Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/OS_Command_Injection_Defense_Cheat_Sheet.html)

[LDAP Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/LDAP_Injection_Prevention_Cheat_Sheet.html)

[Injection Prevention Cheat Sheet in Java](https://cheatsheetseries.owasp.org/cheatsheets/Injection_Prevention_in_Java_Cheat_Sheet.html)

</section>

<section id="injection-prevention-bilingual-panel" className="tabPanel bilingualPanel">

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

# Injection Prevention Cheat Sheet

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

# インジェクション防止チートシート

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Introduction

This article is focused on providing clear, simple, actionable guidance for preventing the entire category of Injection flaws in your applications. Injection attacks, especially [SQL Injection](https://owasp.org/www-community/attacks/SQL_Injection), are unfortunately very common.

Application accessibility is a very important factor in protection and prevention of injection flaws. Only the minority of all applications within a company/enterprise are developed in house, where as most applications are from external sources. Open source applications give at least the opportunity to fix problems, but closed source applications need a different approach to injection flaws.

Injection flaws occur when an application sends untrusted data to an interpreter. Injection flaws are very prevalent, particularly in legacy code, often found in SQL queries, LDAP queries, XPath queries, OS commands, program arguments, etc. Injection flaws are easy to discover when examining code, but more difficult via testing. Scanners and fuzzers can help attackers find them.

Depending on the accessibility different actions must be taken in order to fix them. It is always the best way to fix the problem in source code itself, or even redesign some parts of the applications. But if the source code is not available or it is simply uneconomical to fix legacy software only virtual patching makes sense.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## はじめに

この記事は、アプリケーションにおけるインジェクション欠陥というカテゴリ全体を防止するための、明確で簡潔かつ実行可能なガイダンスを提供することに重点を置いています。インジェクション攻撃、特に [SQL Injection](https://owasp.org/www-community/attacks/SQL_Injection) は、残念ながら非常に一般的です。

アプリケーションへどの程度アクセスできるかは、インジェクション欠陥の保護と防止において非常に重要な要素です。企業内のすべてのアプリケーションのうち、社内で開発されるものは少数であり、多くは外部由来です。オープンソースアプリケーションであれば少なくとも問題を修正する機会がありますが、クローズドソースアプリケーションではインジェクション欠陥に対して別のアプローチが必要です。

インジェクション欠陥は、アプリケーションが信頼できないデータをインタプリタへ送信するときに発生します。インジェクション欠陥は非常に広く存在し、特にレガシーコードで多く見られ、SQL クエリ、LDAP クエリ、XPath クエリ、OS コマンド、プログラム引数などでよく発生します。インジェクション欠陥は、コードを調べると発見しやすい一方、テストではより発見が困難です。スキャナやファザーは、攻撃者がそれらを見つける助けになります。

アクセス可能性に応じて、修正のために取るべき対応は異なります。問題をソースコード自体で修正すること、あるいはアプリケーションの一部を再設計することが、常に最善の方法です。しかし、ソースコードを利用できない場合や、レガシーソフトウェアを修正することが単純に経済的ではない場合には、仮想パッチのみが現実的です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Application Types

Three classes of applications can usually be seen within a company. Those 3 types are needed to identify the actions which need to take place in order to prevent/fix injection flaws.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## アプリケーションの種類

企業内では通常、三つのクラスのアプリケーションが見られます。これら三つの種類は、インジェクション欠陥を防止または修正するために必要な対応を特定するために必要です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### A1: New Application

A new web application in the design phase, or in early stage development.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### A1: 新規アプリケーション

設計段階、または開発初期段階にある新しい Web アプリケーションです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### A2: Productive Open Source Application

An already productive application, which can be easily adapted. A Model-View-Controller (MVC) type application is just one example of having a easily accessible application architecture.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### A2: 稼働中のオープンソースアプリケーション

すでに稼働しており、容易に適応できるアプリケーションです。Model-View-Controller (MVC) 型アプリケーションは、アクセスしやすいアプリケーションアーキテクチャの一例です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### A3: Productive Closed Source Application

A productive application which cannot or only with difficulty be modified.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### A3: 稼働中のクローズドソースアプリケーション

変更できない、または変更が困難な、稼働中のアプリケーションです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Forms of Injection

There are several forms of injection targeting different technologies including SQL queries, LDAP queries, XPath queries and OS commands.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## インジェクションの形態

SQL クエリ、LDAP クエリ、XPath クエリ、OS コマンドなど、さまざまな技術を対象とするインジェクションの形態があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Query languages

The most famous form of injection is SQL Injection where an attacker can modify existing database queries. For more information see the [SQL Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html).

But also LDAP, SOAP, XPath and REST based queries can be susceptible to injection attacks allowing for data retrieval or control bypass.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### クエリ言語

最も有名なインジェクションの形態は SQL Injection であり、攻撃者は既存のデータベースクエリを変更できます。詳細については、[SQL Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html) を参照してください。

LDAP、SOAP、XPath、REST ベースのクエリもインジェクション攻撃の影響を受ける可能性があり、データ取得や制御回避を許すことがあります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### SQL Injection

An SQL injection attack consists of insertion or "injection" of either a partial or complete SQL query via the data input or transmitted from the client (browser) to the web application.

A successful SQL injection attack can read sensitive data from the database, modify database data (insert/update/delete), execute administration operations on the database (such as shutdown the DBMS), recover the content of a given file existing on the DBMS file system or write files into the file system, and, in some cases, issue commands to the operating system. SQL injection attacks are a type of injection attack, in which SQL commands are injected into data-plane input in order to affect the execution of predefined SQL commands.

SQL Injection attacks can be divided into the following three classes:

- **Inband:** data is extracted using the same channel that is used to inject the SQL code. This is the most straightforward kind of attack, in which the retrieved data is presented directly in the application web page.
- **Out-of-band:** data is retrieved using a different channel (e.g., an email with the results of the query is generated and sent to the tester).
- **Inferential or Blind:** there is no actual transfer of data, but the tester is able to reconstruct the information by sending particular requests and observing the resulting behavior of the DB Server.

##### How to test for the issue

###### During code review

please check for any queries to the database are not done via prepared statements.

If dynamic statements are being made please check if the data is sanitized before used as part of the statement.

Auditors should always look for uses of sp_execute, execute or exec within SQL Server stored procedures. Similar audit guidelines are necessary for similar functions for other vendors.

###### Automated Exploitation

Most of the situation and techniques below here can be performed in a automated way using some tools. In this article the tester can find information how to perform an automated auditing using [SQLMap](https://wiki.owasp.org/index.php/Automated_Audit_using_SQLMap)

Equally Static Code Analysis Data flow rules can detect of unsanitized user controlled input can change the SQL query.

###### Stored Procedure Injection

When using dynamic SQL within a stored procedure, the application must properly sanitize the user input to eliminate the risk of code injection. If not sanitized, the user could enter malicious SQL that will be executed within the stored procedure.

###### Time delay Exploitation technique

The time delay exploitation technique is very useful when the tester find a Blind SQL Injection situation, in which nothing is known on the outcome of an operation. This technique consists in sending an injected query and in case the conditional is true, the tester can monitor the time taken to for the server to respond. If there is a delay, the tester can assume the result of the conditional query is true. This exploitation technique can be different from DBMS to DBMS (check DBMS specific section).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### SQL インジェクション

SQL インジェクション攻撃は、データ入力またはクライアント (ブラウザ) から Web アプリケーションへ送信されるデータを通じて、SQL クエリの一部または完全な SQL クエリを挿入、すなわち「インジェクション」することで成立します。

SQL インジェクション攻撃が成功すると、データベースから機密データを読み取る、データベースデータを変更する (insert/update/delete)、データベース上で管理操作を実行する (DBMS の shutdown など)、DBMS ファイルシステム上に存在する特定ファイルの内容を復元する、ファイルシステムへファイルを書き込む、場合によってはオペレーティングシステムへコマンドを発行する、といったことが可能になります。SQL インジェクション攻撃はインジェクション攻撃の一種であり、あらかじめ定義された SQL コマンドの実行に影響を与えるため、データプレーン入力に SQL コマンドを注入します。

SQL Injection 攻撃は、次の三つのクラスに分けられます。

- **Inband:** SQL コードの注入に使われるものと同じチャネルを使ってデータを抽出します。これは最も単純な種類の攻撃であり、取得されたデータはアプリケーションの Web ページに直接表示されます。
- **Out-of-band:** 別のチャネルを使ってデータを取得します。たとえば、クエリ結果を含むメールが生成され、テスターへ送信されます。
- **Inferential or Blind:** 実際のデータ転送はありませんが、テスターは特定のリクエストを送信し、DB Server の結果の挙動を観察することで情報を再構成できます。

##### 問題のテスト方法

###### コードレビュー時

データベースへのクエリが prepared statement を使わずに実行されていないか確認してください。

動的ステートメントが作成されている場合は、そのステートメントの一部として使用される前にデータがサニタイズされているか確認してください。

監査者は、SQL Server のストアドプロシージャ内で `sp_execute`、`execute`、`exec` が使われていないか常に確認すべきです。他のベンダーにおける同様の関数についても、同様の監査ガイドラインが必要です。

###### 自動化された悪用

以下の状況や技術の多くは、いくつかのツールを使って自動化された方法で実行できます。この記事では、テスターは [SQLMap](https://wiki.owasp.org/index.php/Automated_Audit_using_SQLMap) を使った自動監査の実施方法に関する情報を見つけることができます。

同様に、静的コード解析のデータフロールールは、サニタイズされていないユーザー制御入力が SQL クエリを変更できることを検出できます。

###### ストアドプロシージャインジェクション

ストアドプロシージャ内で動的 SQL を使用する場合、アプリケーションはコードインジェクションのリスクを排除するため、ユーザー入力を適切にサニタイズしなければなりません。サニタイズされていない場合、ユーザーは悪意のある SQL を入力でき、それがストアドプロシージャ内で実行されます。

###### 時間遅延を用いた悪用技術

時間遅延を用いた悪用技術は、操作結果について何も分からない Blind SQL Injection の状況をテスターが見つけた場合に非常に有用です。この技術は、注入したクエリを送信し、条件が真の場合に、サーバーが応答するまでにかかった時間をテスターが監視するというものです。遅延がある場合、テスターは条件付きクエリの結果が真であると推測できます。この悪用技術は DBMS によって異なる場合があります (DBMS 固有のセクションを確認してください)。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```text
http://www.example.com/product.php?id=10 AND IF(version() like '5%', sleep(10), 'false'))--
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

In this example the tester is checking whether the MySql version is 5.x or not, making the server delay the answer by 10 seconds. The tester can increase the delay time and monitor the responses. The tester also doesn't need to wait for the response. Sometimes they can set a very high value (e.g. 100) and cancel the request after some seconds.

###### Out of band Exploitation technique

This technique is very useful when the tester find a Blind SQL Injection situation, in which nothing is known on the outcome of an operation. The technique consists of the use of DBMS functions to perform an out of band connection and deliver the results of the injected query as part of the request to the tester's server. Like the error based techniques, each DBMS has its own functions. Check for specific DBMS section.

##### Remediation

###### Defense Option 1: Prepared Statements (with Parameterized Queries)

Prepared statements ensure that an attacker is not able to change the intent of a query, even if SQL commands are inserted by an attacker. In the safe example below, if an attacker were to enter the userID of `tom' or '1'='1`, the parameterized query would not be vulnerable and would instead look for a username which literally matched the entire string `tom' or '1'='1`.

###### Defense Option 2: Stored Procedures

The difference between prepared statements and stored procedures is that the SQL code for a stored procedure is defined and stored in the database itself, and then called from the application.

Both of these techniques have the same effectiveness in preventing SQL injection so your organization should choose which approach makes the most sense for you. Stored procedures are not always safe from SQL injection. However, certain standard stored procedure programming constructs have the same effect as the use of parameterized queries when implemented safely* which is the norm for most stored procedure languages.

*Note:* 'Implemented safely' means the stored procedure does not include any unsafe dynamic SQL generation.

###### Defense Option 3: Allow-List Input Validation

Various parts of SQL queries aren't legal locations for the use of bind variables, such as the names of tables or columns, and the sort order indicator (ASC or DESC). In such situations, input validation or query redesign is the most appropriate defense. For the names of tables or columns, ideally those values come from the code, and not from user parameters.

But if user parameter values are used to make different for table names and column names, then the parameter values should be mapped to the legal/expected table or column names to make sure unvalidated user input doesn't end up in the query. Please note, this is a symptom of poor design and a full rewrite should be considered if time allows.

###### Defense Option 4: Escaping All User-Supplied Input

This technique should only be used as a last resort, when none of the above are feasible. Input validation is probably a better choice as this methodology is frail compared to other defenses and we cannot guarantee it will prevent all SQL Injection in all situations.

This technique is to escape user input before putting it in a query. It's usually only recommended to retrofit legacy code when implementing input validation isn't cost effective.

##### Example code - Java

###### Safe Java Prepared Statement Example

The following code example uses a `PreparedStatement`, Java's implementation of a parameterized query, to execute the same database query.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

この例では、テスターは MySql のバージョンが 5.x であるかどうかを確認し、サーバーの応答を 10 秒遅らせています。テスターは遅延時間を増やし、応答を監視できます。また、テスターは応答を待つ必要もありません。非常に大きな値 (例: 100) を設定し、数秒後にリクエストをキャンセルできる場合もあります。

###### Out of band を用いた悪用技術

この技術は、操作結果について何も分からない Blind SQL Injection の状況をテスターが見つけた場合に非常に有用です。この技術は、DBMS 関数を使って out of band 接続を実行し、注入されたクエリの結果をテスターのサーバーへのリクエストの一部として配送するものです。エラーベースの技術と同様に、各 DBMS には独自の関数があります。特定の DBMS セクションを確認してください。

##### 修復

###### 防御策 1: Prepared Statement (パラメータ化クエリ)

Prepared statement は、攻撃者が SQL コマンドを挿入した場合でも、クエリの意図を変更できないことを保証します。下の安全な例では、攻撃者が userID として `tom' or '1'='1` を入力したとしても、パラメータ化クエリは脆弱にならず、代わりに文字列全体 `tom' or '1'='1` と文字どおり一致するユーザー名を探します。

###### 防御策 2: ストアドプロシージャ

Prepared statement とストアドプロシージャの違いは、ストアドプロシージャの SQL コードがデータベース自体で定義および保存され、アプリケーションから呼び出される点です。

これら二つの技術は SQL インジェクション防止において同等の効果を持つため、組織はどちらのアプローチが最も合理的かを選択すべきです。ストアドプロシージャは、SQL インジェクションに対して常に安全とは限りません。ただし、標準的なストアドプロシージャのプログラミング構造の中には、安全に実装された場合にパラメータ化クエリの使用と同じ効果を持つものがあります。これは多くのストアドプロシージャ言語では通常の形です。

*注:* 「安全に実装」とは、ストアドプロシージャに安全ではない動的 SQL 生成が含まれていないことを意味します。

###### 防御策 3: 許可リストによる入力検証

テーブル名やカラム名、並び替え順を示す指示子 (ASC または DESC) など、SQL クエリのさまざまな部分ではバインド変数を使用できない場所があります。このような状況では、入力検証またはクエリの再設計が最も適切な防御です。テーブル名やカラム名については、理想的にはそれらの値はユーザーパラメータではなくコードから来るべきです。

しかし、ユーザーパラメータ値を使ってテーブル名やカラム名を切り替える場合は、未検証のユーザー入力がクエリに入らないようにするため、そのパラメータ値を正当かつ期待されるテーブル名またはカラム名にマッピングすべきです。これは設計不良の兆候であり、時間が許す場合は全面的な書き換えを検討すべきである点に注意してください。

###### 防御策 4: すべてのユーザー指定入力のエスケープ

この技術は、上記のいずれも実現できない場合の最後の手段としてのみ使用すべきです。この方法は他の防御策に比べて脆弱であり、あらゆる状況ですべての SQL Injection を防げるとは保証できないため、入力検証の方がより良い選択である可能性があります。

この技術は、ユーザー入力をクエリに入れる前にエスケープするものです。通常、入力検証の実装が費用対効果に合わない場合に、レガシーコードへ後付けする目的でのみ推奨されます。

##### コード例 - Java

###### 安全な Java Prepared Statement の例

次のコード例では、パラメータ化クエリの Java 実装である `PreparedStatement` を使って、同じデータベースクエリを実行します。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```java
// This should REALLY be validated too
String custname = request.getParameter("customerName");
// Perform input validation to detect attacks
String query = "SELECT account_balance FROM user_data WHERE user_name = ?";
PreparedStatement pstmt = connection.prepareStatement(query);
pstmt.setString(1, custname);
ResultSet results = pstmt.executeQuery();
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

We have shown examples in Java, but practically all other languages, including Cold Fusion, and Classic ASP, support parameterized query interfaces.

###### Safe Java Stored Procedure Example

The following code example uses a `CallableStatement`, Java's implementation of the stored procedure interface, to execute the same database query. The `sp_getAccountBalance` stored procedure would have to be predefined in the database and implement the same functionality as the query defined above.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

ここでは Java の例を示しましたが、Cold Fusion や Classic ASP を含む、実質的に他のすべての言語でも、パラメータ化クエリインターフェースがサポートされています。

###### 安全な Java ストアドプロシージャの例

次のコード例では、ストアドプロシージャインターフェースの Java 実装である `CallableStatement` を使って、同じデータベースクエリを実行します。`sp_getAccountBalance` ストアドプロシージャはデータベース内で事前定義されており、上で定義したクエリと同じ機能を実装している必要があります。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```java
// This should REALLY be validated
String custname = request.getParameter("customerName");
try {
 CallableStatement cs = connection.prepareCall("{call sp_getAccountBalance(?)}");
 cs.setString(1, custname);
 ResultSet results = cs.executeQuery();
 // Result set handling...
} catch (SQLException se) {
 // Logging and error handling...
}
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### LDAP Injection

LDAP Injection is an attack used to exploit web based applications that construct LDAP statements based on user input. When an application fails to properly sanitize user input, it's possible to modify LDAP statements through techniques similar to [SQL Injection](https://owasp.org/www-community/attacks/SQL_Injection). LDAP injection attacks could result in the granting of permissions to unauthorized queries, and content modification inside the LDAP tree. For more information on LDAP Injection attacks, visit [LDAP injection](https://owasp.org/www-community/attacks/LDAP_Injection).

[LDAP injection](https://owasp.org/www-community/attacks/LDAP_Injection) attacks are common due to two factors:

1. The lack of safer, parameterized LDAP query interfaces
2. The widespread use of LDAP to authenticate users to systems.

##### How to test for the issue

###### During code review

Please check for any queries to the LDAP escape special characters, see [here](https://cheatsheetseries.owasp.org/cheatsheets/LDAP_Injection_Prevention_Cheat_Sheet.html#defense-option-1-escape-all-variables-using-the-right-ldap-encoding-function).

###### Automated Exploitation

Scanner module of tool like OWASP [ZAP](https://www.zaproxy.org/) have module to detect LDAP injection issue.

##### Remediation

###### Escape all variables using the right LDAP encoding function

The main way LDAP stores names is based on DN ([distinguished name](https://ldapwiki.com/wiki/Distinguished%20Names)). You can think of this like a unique identifier. These are sometimes used to access resources, like a username.

A DN might look like this

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### LDAP インジェクション

LDAP Injection は、ユーザー入力に基づいて LDAP ステートメントを構築する Web ベースアプリケーションを悪用する攻撃です。アプリケーションがユーザー入力を適切にサニタイズしない場合、[SQL Injection](https://owasp.org/www-community/attacks/SQL_Injection) と似た技術によって LDAP ステートメントを変更できる可能性があります。LDAP インジェクション攻撃は、認可されていないクエリへの権限付与や、LDAP ツリー内の内容変更につながる可能性があります。LDAP Injection 攻撃の詳細については、[LDAP injection](https://owasp.org/www-community/attacks/LDAP_Injection) を参照してください。

[LDAP injection](https://owasp.org/www-community/attacks/LDAP_Injection) 攻撃は、次の二つの要因により一般的です。

1. より安全な、パラメータ化された LDAP クエリインターフェースが不足していること。
2. システムへのユーザー認証に LDAP が広く使用されていること。

##### 問題のテスト方法

###### コードレビュー時

LDAP へのクエリで特殊文字がエスケープされているか確認してください。[こちら](https://cheatsheetseries.owasp.org/cheatsheets/LDAP_Injection_Prevention_Cheat_Sheet.html#defense-option-1-escape-all-variables-using-the-right-ldap-encoding-function) を参照してください。

###### 自動化された悪用

OWASP [ZAP](https://www.zaproxy.org/) のようなツールのスキャナモジュールには、LDAP インジェクション問題を検出するモジュールがあります。

##### 修復

###### 適切な LDAP エンコーディング関数を使用してすべての変数をエスケープする

LDAP が名前を保存する主な方法は、DN ([distinguished name](https://ldapwiki.com/wiki/Distinguished%20Names)) に基づいています。これは一意識別子のようなものだと考えることができます。これらは、ユーザー名のように、リソースへアクセスするために使われることがあります。

DN は次のような形式になります。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```text
cn=Richard Feynman, ou=Physics Department, dc=Caltech, dc=edu
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

or

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

または次のような形式です。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```text
uid=inewton, ou=Mathematics Department, dc=Cambridge, dc=com
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

There are certain characters that are considered special characters in a DN. The exhaustive list is the following: `\ # + < > , ; " =` and leading or trailing spaces

Each DN points to exactly 1 entry, which can be thought of sort of like a row in a RDBMS. For each entry, there will be 1 or more attributes which are analogous to RDBMS columns. If you are interested in searching through LDAP for users will certain attributes, you may do so with search filters. In a search filter, you can use standard boolean logic to get a list of users matching an arbitrary constraint. Search filters are written in Polish notation AKA prefix notation.

Example:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

DN では特殊文字と見なされる文字があります。網羅的な一覧は、`\ # + < > , ; " =` と、先頭または末尾の空白です。

各 DN は厳密に 1 つのエントリを指し、RDBMS における行のようなものと考えられます。各エントリには、RDBMS のカラムに相当する 1 つ以上の属性があります。LDAP 内で特定の属性を持つユーザーを検索したい場合は、検索フィルタを使用できます。検索フィルタでは、標準的なブール論理を使って任意の制約に一致するユーザー一覧を取得できます。検索フィルタはポーランド記法、すなわち前置記法で書かれます。

例:

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```text
(&(ou=Physics)(| (manager=cn=Freeman Dyson,ou=Physics,dc=Caltech,dc=edu)
(manager=cn=Albert Einstein,ou=Physics,dc=Princeton,dc=edu) ))
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

When building LDAP queries in application code, you MUST escape any untrusted data that is added to any LDAP query. There are two forms of LDAP escaping. Encoding for LDAP Search and Encoding for LDAP DN (distinguished name). The proper escaping depends on whether you are sanitizing input for a search filter, or you are using a DN as a username-like credential for accessing some resource.

##### Example code - Java

###### Safe Java for LDAP escaping Example

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

アプリケーションコードで LDAP クエリを構築する場合、LDAP クエリに追加される信頼できないデータはすべてエスケープすることが必須です。LDAP エスケープには二つの形式があります。LDAP Search 用のエンコーディングと、LDAP DN (distinguished name) 用のエンコーディングです。適切なエスケープは、検索フィルタ用に入力をサニタイズしているのか、何らかのリソースへアクセスするためのユーザー名に似た資格情報として DN を使っているのかによって異なります。

##### コード例 - Java

###### LDAP エスケープのための安全な Java の例

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```java
public String escapeDN (String name) {
 //From RFC 2253 and the / character for JNDI
 final char[] META_CHARS = {'+', '"', '<', '>', ';', '/'};
 String escapedStr = new String(name);
 //Backslash is both a Java and an LDAP escape character,
 //so escape it first
 escapedStr = escapedStr.replaceAll("\\\\\\\\","\\\\\\\\");
 //Positional characters - see RFC 2253
 escapedStr = escapedStr.replaceAll("\^#","\\\\\\\\#");
 escapedStr = escapedStr.replaceAll("\^ | $","\\\\\\\\ ");
 for (int i=0 ; i < META_CHARS.length ; i++) {
        escapedStr = escapedStr.replaceAll("\\\\" +
                     META_CHARS[i],"\\\\\\\\" + META_CHARS[i]);
 }
 return escapedStr;
}
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Note, that the backslash character is a Java String literal and a regular expression escape character.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

バックスラッシュ文字は Java 文字列リテラルであり、正規表現のエスケープ文字でもある点に注意してください。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```java
public String escapeSearchFilter (String filter) {
 //From RFC 2254
 String escapedStr = new String(filter);
 escapedStr = escapedStr.replaceAll("\\\\\\\\","\\\\\\\\5c");
 escapedStr = escapedStr.replaceAll("\\\\\*","\\\\\\\\2a");
 escapedStr = escapedStr.replaceAll("\\\\(","\\\\\\\\28");
 escapedStr = escapedStr.replaceAll("\\\\)","\\\\\\\\29");
 escapedStr = escapedStr.replaceAll("\\\\" +
               Character.toString('\\u0000'), "\\\\\\\\00");
 return escapedStr;
}
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### XPath Injection

TODO

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### XPath インジェクション

TODO

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Scripting languages

All scripting languages used in web applications have a form of an `eval` call which receives code at runtime and executes it. If code is crafted using unvalidated and unescaped user input code injection can occur which allows an attacker to subvert application logic and eventually to gain local access.

Every time a scripting language is used, the actual implementation of the 'higher' scripting language is done using a 'lower' language like C. If the scripting language has a flaw in the data handling code '[Null Byte Injection](http://projects.webappsec.org/w/page/13246949/Null%20Byte%20Injection)' attack vectors can be deployed to gain access to other areas in memory, which results in a successful attack.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### スクリプト言語

Web アプリケーションで使われるすべてのスクリプト言語には、実行時にコードを受け取り、それを実行する `eval` 呼び出しの形態があります。未検証かつ未エスケープのユーザー入力を使ってコードが組み立てられる場合、コードインジェクションが発生し、攻撃者がアプリケーションロジックを破壊し、最終的にはローカルアクセスを得ることを可能にします。

スクリプト言語が使われるたびに、その「高水準」スクリプト言語の実際の実装は C のような「低水準」言語を使って行われます。スクリプト言語のデータ処理コードに欠陥がある場合、'[Null Byte Injection](http://projects.webappsec.org/w/page/13246949/Null%20Byte%20Injection)' 攻撃ベクターを展開してメモリ内の他領域へアクセスでき、攻撃が成功する結果になります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Operating System Commands

OS command injection is a technique used via a web interface in order to execute OS commands on a web server. The user supplies operating system commands through a web interface in order to execute OS commands.

Any web interface that is not properly sanitized is subject to this exploit. With the ability to execute OS commands, the user can upload malicious programs or even obtain passwords. OS command injection is preventable when security is emphasized during the design and development of applications.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### オペレーティングシステムコマンド

OS コマンドインジェクションは、Web サーバー上で OS コマンドを実行するために Web インターフェースを介して使用される技術です。ユーザーは、OS コマンドを実行するために Web インターフェースを通じてオペレーティングシステムコマンドを提供します。

適切にサニタイズされていない Web インターフェースは、すべてこの悪用の対象になります。OS コマンドを実行できる能力により、ユーザーは悪意のあるプログラムをアップロードしたり、パスワードを取得したりできます。OS コマンドインジェクションは、アプリケーションの設計と開発においてセキュリティを重視すれば防止できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### How to test for the issue

##### During code review

Check if any command execute methods are called and in unvalidated user input are taken as data for that command.

Out side of that, appending a semicolon to the end of a URL query parameter followed by an operating system command, will execute the command. `%3B` is URL encoded and decodes to semicolon. This is because the `;` is interpreted as a command separator.

Example: `http://sensitive/something.php?dir=%3Bcat%20/etc/passwd`

If the application responds with the output of the `/etc/passwd` file then you know the attack has been successful. Many web application scanners can be used to test for this attack as they inject variations of command injections and test the response.

Equally Static Code Analysis tools check the data flow of untrusted user input into a web application and check if the data is then entered into a dangerous method which executes the user input as a command.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 問題のテスト方法

##### コードレビュー時

コマンド実行メソッドが呼び出されていないか、また、未検証のユーザー入力がそのコマンドのデータとして使用されていないか確認してください。

それ以外にも、URL クエリパラメータの末尾にセミコロンを追加し、その後にオペレーティングシステムコマンドを続けると、コマンドが実行されます。`%3B` は URL エンコードされており、デコードするとセミコロンになります。これは、`;` がコマンド区切りとして解釈されるためです。

例: `http://sensitive/something.php?dir=%3Bcat%20/etc/passwd`

アプリケーションが `/etc/passwd` ファイルの出力で応答した場合、攻撃が成功したことが分かります。多くの Web アプリケーションスキャナは、この攻撃のテストに使用できます。それらはコマンドインジェクションのバリエーションを注入し、応答をテストします。

同様に、静的コード解析ツールは、信頼できないユーザー入力が Web アプリケーション内を流れるデータフローを確認し、そのデータがユーザー入力をコマンドとして実行する危険なメソッドへ入力されていないか確認します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Remediation

If it is considered unavoidable the call to a system command incorporated with user-supplied, the following two layers of defense should be used within software in order to prevent attacks

1. **Parameterization** - If available, use structured mechanisms that automatically enforce the separation between data and command. These mechanisms can help to provide the relevant quoting, encoding.
2. **Input validation** - the values for commands and the relevant arguments should be both validated. There are different degrees of validation for the actual command and its arguments:
    - When it comes to the **commands** used, these must be validated against a list of allowed commands.
    - In regards to the **arguments** used for these commands, they should be validated using the following options:
        - Positive or allowlist input validation - where are the arguments allowed explicitly defined
        - Allow-list Regular Expression - where is explicitly defined a list of good characters allowed and the maximum length of the string. Ensure that metacharacters like `& | ; $ > < \` \ !` and whitespaces are not part of the Regular Expression. For example, the following regular expression only allows lowercase letters and numbers, and does not contain metacharacters. The length is also being limited to 3-10 characters:

`^[a-z0-9]&#123;3,10&#125;$`

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 修復

ユーザー指定値を組み込んだシステムコマンド呼び出しが避けられないと考えられる場合、攻撃を防ぐために、ソフトウェア内で次の二層の防御を使用すべきです。

1. **パラメータ化** - 利用可能な場合は、データとコマンドの分離を自動的に強制する構造化された仕組みを使用します。これらの仕組みは、適切なクォートやエンコーディングの提供に役立ちます。
2. **入力検証** - コマンドと関連する引数の値は、どちらも検証する必要があります。実際のコマンドとその引数には、検証の程度に違いがあります。
    - 使用される **コマンド** については、許可されたコマンドのリストと照合して検証しなければなりません。
    - これらのコマンドに使用される **引数** については、次の選択肢を使って検証すべきです。
        - ポジティブ入力検証または許可リスト入力検証 - 許可される引数を明示的に定義します。
        - 許可リスト正規表現 - 良好な文字として許可されるリストと、文字列の最大長を明示的に定義します。`& | ; $ > < \` \ !` のようなメタ文字や空白文字が正規表現に含まれないようにしてください。たとえば、次の正規表現は小文字と数字のみを許可し、メタ文字を含みません。また、長さも 3 から 10 文字に制限されています。

`^[a-z0-9]&#123;3,10&#125;$`

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Example code - Java

##### Incorrect Usage

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### コード例 - Java

##### 誤った使用例

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```java
ProcessBuilder b = new ProcessBuilder("C:\DoStuff.exe -arg1 -arg2");
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

In this example, the command together with the arguments are passed as a one string, making easy to manipulate that expression and inject malicious strings.

##### Correct Usage

Here is an example that starts a process with a modified working directory. The command and each of the arguments are passed separately. This make it easy to validated each term and reduces the risk to insert malicious strings.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

この例では、コマンドと引数が 1 つの文字列として渡されています。そのため、この式を操作して悪意のある文字列を注入しやすくなります。

##### 正しい使用例

次の例は、変更された作業ディレクトリでプロセスを開始します。コマンドと各引数は個別に渡されます。これにより、各要素を検証しやすくなり、悪意のある文字列が挿入されるリスクを低減できます。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```java
ProcessBuilder pb = new ProcessBuilder("TrustedCmd", "TrustedArg1", "TrustedArg2");
Map<String, String> env = pb.environment();
pb.directory(new File("TrustedDir"));
Process p = pb.start();
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Network Protocols

Web applications often communicate with network daemons (like SMTP, IMAP, FTP) where user input becomes part of the communication stream. Here it is possible to inject command sequences to abuse an established session.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### ネットワークプロトコル

Web アプリケーションは、ユーザー入力が通信ストリームの一部になるネットワークデーモン (SMTP、IMAP、FTP など) と通信することがよくあります。ここでは、確立済みセッションを悪用するためにコマンドシーケンスを注入できる可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Injection Prevention Rules

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## インジェクション防止ルール

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Rule \#1 (Perform proper input validation)

Perform proper input validation. Positive or allowlist input validation with appropriate canonicalization is also recommended, but **is not a complete defense** as many applications require special characters in their input.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### ルール #1 (適切な入力検証を実施する)

適切な入力検証を実施します。適切な正規化を伴うポジティブ入力検証または許可リスト入力検証も推奨されますが、多くのアプリケーションでは入力に特殊文字が必要になるため、これは **完全な防御ではありません**。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Rule \#2 (Use a safe API)

The preferred option is to use a safe API which avoids the use of the interpreter entirely or provides a parameterized interface. Be careful of APIs, such as stored procedures, that are parameterized, but can still introduce injection under the hood.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### ルール #2 (安全な API を使用する)

推奨される選択肢は、インタプリタの使用を完全に避ける、またはパラメータ化インターフェースを提供する安全な API を使用することです。ストアドプロシージャのように、パラメータ化されていても内部でインジェクションを引き起こし得る API には注意してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Rule \#3 (Contextually escape user data)

If a parameterized API is not available, you should carefully escape special characters using the specific escape syntax for that interpreter.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### ルール #3 (ユーザーデータをコンテキストに応じてエスケープする)

パラメータ化 API を利用できない場合は、そのインタプリタ固有のエスケープ構文を使って特殊文字を慎重にエスケープすべきです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Other Injection Cheatsheets

[SQL Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)

[OS Command Injection Defense Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/OS_Command_Injection_Defense_Cheat_Sheet.html)

[LDAP Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/LDAP_Injection_Prevention_Cheat_Sheet.html)

[Injection Prevention Cheat Sheet in Java](https://cheatsheetseries.owasp.org/cheatsheets/Injection_Prevention_in_Java_Cheat_Sheet.html)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## その他のインジェクションチートシート

[SQL Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)

[OS Command Injection Defense Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/OS_Command_Injection_Defense_Cheat_Sheet.html)

[LDAP Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/LDAP_Injection_Prevention_Cheat_Sheet.html)

[Injection Prevention Cheat Sheet in Java](https://cheatsheetseries.owasp.org/cheatsheets/Injection_Prevention_in_Java_Cheat_Sheet.html)

</div>
</div>

</section>
</div>

## Attribution

<div className="attributionFooter">

- Original: Injection Prevention Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Injection_Prevention_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: English original retained for comparison. Japanese translation added. Bilingual display generated from official source and local Japanese translation.
- Retrieved: 2026-05-21

</div>
