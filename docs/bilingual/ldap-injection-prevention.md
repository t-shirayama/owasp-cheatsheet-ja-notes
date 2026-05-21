---
title: LDAP Injection Prevention Cheat Sheet
hide_title: true
---

<div className="docHero" data-category="encoding-and-sanitization">
  <h1>LDAP インジェクション防止チートシート</h1>
  <div className="docMeta">
    <span className="docPill">最終更新: 2026-05-20</span>
    <span className="docPill">読了時間: 約 15 分</span>
    <span className="docPill">カテゴリ: 入力検証とサニタイズ</span>
  </div>
</div>

<p className="docLead">LDAP インジェクション防止チートシートを、原文・翻訳・対比表示で確認できます。ASVS Index 対応の文脈で、公式原文と日本語訳を確認しやすく整理しています。</p>

<div className="tabbedContent">
  <input className="tabInput" type="radio" name="ldap-injection-prevention-view" id="ldap-injection-prevention-original" />
  <input className="tabInput" type="radio" name="ldap-injection-prevention-view" id="ldap-injection-prevention-translation" defaultChecked />
  <input className="tabInput" type="radio" name="ldap-injection-prevention-view" id="ldap-injection-prevention-bilingual" />

  <div className="contentTabs">
    <label htmlFor="ldap-injection-prevention-original" title="OWASP 原文">原文</label>
    <label htmlFor="ldap-injection-prevention-translation" title="日本語訳">翻訳</label>
    <label htmlFor="ldap-injection-prevention-bilingual" title="原文と翻訳を並べて確認">対比表示</label>
  </div>

<section id="ldap-injection-prevention-original-panel" className="tabPanel originalPanel contentPanel">

## Introduction

The Lightweight Directory Access Protocol (LDAP) allows an application to remotely perform operations such as searching and modifying records in
directories. LDAP injection results from inadequate input sanitization and validation and allows malicious users to glean restricted information using the
directory service. For general information about LDAP please visit [lightweight directory access protocol (LDAP)](https://www.redhat.com/en/topics/security/what-is-ldap-authentication).

LDAP Injection is an attack used to exploit web based applications that construct LDAP statements based on user input. When an application fails to properly sanitize user input, it's possible to modify LDAP statements through techniques similar to [SQL Injection](https://owasp.org/www-community/attacks/SQL_Injection).

This cheatsheet is focused on providing clear, simple, actionable guidance for preventing LDAP Injection flaws in your applications. [LDAP injection](https://owasp.org/www-community/attacks/LDAP_Injection) attacks are common due to two factors:

1. The lack of safer, parameterized LDAP query interfaces
2. The widespread use of LDAP to authenticate users to systems.

LDAP injection attacks could result in the granting of permissions to unauthorized queries, and content modification inside the LDAP tree.

Primary Defenses:

- Escape all variables using the right LDAP encoding function
- Use a framework that escapes automatically.

Additional Defenses:

- Least Privilege
- Allow-List Input Validation

## Primary Defenses

### Defense Option 1: Escape all variables using the right LDAP encoding function

#### Distinguished Name Escaping

The main way LDAP stores names is based on DN (distinguished name). You can think of this like a unique identifier. These are sometimes used to access resources, like a username.

A DN might look like this

`cn=Richard Feynman, ou=Physics Department, dc=Caltech, dc=edu`

or

`uid=inewton, ou=Mathematics Department, dc=Cambridge, dc=com`

An allowlist can be used to restrict input to a list of valid characters. Characters and character sequences that must be excluded from allowlists — including
Java Naming and Directory Interface (JNDI) metacharacters and LDAP special characters — are listed in the following list.

The [exhaustive list](https://ldapwiki.com/wiki/Wiki.jsp?page=DN%20Escape%20Values) is the following: `\\ # + < > , ; " =` and leading or trailing spaces.

Some "special" characters that are allowed in Distinguished Names and do not need to be escaped include:

```text
* ( ) . & - _ [ ] ` ~ | @ $ % ^ ? : { } ! '
```text

#### Search Filter Escaping

Each DN points to exactly 1 entry, which can be thought of sort of like a row in a RDBMS. For each entry, there will be 1 or more attributes which are analogous to RDBMS columns. If you are interested in searching through LDAP for users with certain attributes, you may do so with search filters.

In a search filter, you can use standard boolean logic to get a list of users matching an arbitrary constraint. Search filters are written in Polish notation AKA prefix notation.

Example:

```text
(&(ou=Physics)(|
(manager=cn=Freeman Dyson,ou=Physics,dc=Caltech,dc=edu)
(manager=cn=Albert Einstein,ou=Physics,dc=Princeton,dc=edu)
))
```text

When building LDAP queries in application code, you MUST escape any untrusted data that is added to any LDAP query. There are two forms of LDAP escaping. Encoding for LDAP Search and Encoding for LDAP DN (distinguished name). The proper escaping depends on whether you are sanitizing input for a search filter, or you are using a DN as a username-like credential for accessing some resource.

Some "special" characters that are allowed in search filters and must be escaped include:

```text
* ( ) \ NUL
```text

For more information on search filter escaping visit [RFC4515](https://datatracker.ietf.org/doc/html/rfc4515#section-3).

#### Safe Java Escaping Example

The following solution uses an allowlist to sanitize user input so that the filter string contains only valid characters. In this code, userSN may contain
only letters and spaces.

```java
// String userSN = "Sherlock Holmes"; // Valid
// ... beginning of LDAPInjection.searchRecord()...
sc.setSearchScope(SearchControls.SUBTREE_SCOPE);
String base = "dc=example,dc=com";

if (!userSN.matches("[\\w\\s]*")) {
 throw new IllegalArgumentException("Invalid input");
}

String filter = "(sn = " + userSN + ")";
// ... remainder of LDAPInjection.searchRecord()...
```text

When a database field must include special characters, it is critical to ensure that the authentic data is stored in sanitized form in the
database and also that any user input is normalized before the validation or comparison takes place. Using characters that have special meanings in JNDI
and LDAP in the absence of a comprehensive normalization and allowlisting-based routine is discouraged. Special characters must be transformed to
sanitized, safe values before they are added to the allowlist expression against which input will be validated. Likewise, normalization of user input should
occur before the validation step (source: [Prevent LDAP injection](https://wiki.sei.cmu.edu/confluence/spaces/flyingpdf/pdfpageexport.action?pageId=88487534)).

For further information visit [OWASP ESAPI Java Encoder Project which includes encodeForLDAP(String) and encodeForDN(String)](https://owasp.org/www-project-java-encoder/).

#### Insecure vs Secure Java LDAP Query Construction

❌ **Insecure Example (vulnerable to LDAP Injection)**

```java
// User input directly concatenated into the filter
String filter = "(&(uid=" + userInput + ")(objectClass=person))";
NamingEnumeration<SearchResult> results =
    ctx.search("ou=users,dc=example,dc=com", filter, controls);

✅ Secure Example (using parameterized filter)

// User input safely passed as a parameter
String filter = "(&(uid={0})(objectClass=person))";
NamingEnumeration<SearchResult> results =
    ctx.search("ou=users,dc=example,dc=com", filter, new Object[]{ userInput }, controls);
```text

#### Safe C Sharp .NET TBA Example

[.NET AntiXSS](https://blogs.msdn.microsoft.com/securitytools/2010/09/30/antixss-4-0-released/) (now the Encoder class) has LDAP encoding functions including `Encoder.LdapFilterEncode(string)`, `Encoder.LdapDistinguishedNameEncode(string)` and `Encoder.LdapDistinguishedNameEncode(string, bool, bool)`.

`Encoder.LdapFilterEncode` encodes input according to [RFC4515](https://datatracker.ietf.org/doc/html/rfc4515) where unsafe values are converted to `\\XX` where `XX` is the representation of the unsafe character.

`Encoder.LdapDistinguishedNameEncode` encodes input according to [RFC2253](https://tools.ietf.org/html/rfc2253) where unsafe characters are converted to `#XX` where `XX` is the representation of the unsafe character and the comma, plus, quote, slash, less than and great than signs are escaped using slash notation (`\\X`). In addition to this a space or octothorpe (`#`) at the beginning of the input string is `\\` escaped as is a space at the end of a string.

`LdapDistinguishedNameEncode(string, bool, bool)` is also provided so you may turn off the initial or final character escaping rules, for example if you are concatenating the escaped distinguished name fragment into the midst of a complete distinguished name.

### Defense Option 2: Use Frameworks that Automatically Protect from LDAP Injection

#### Safe .NET Example

We recommend using [LINQ to LDAP](https://www.nuget.org/packages/LinqToLdap/) (for .NET Framework 4.5 or lower [until it has been updated](https://github.com/madhatter22/LinqToLdap/issues/31)) in DotNet. It provides automatic LDAP encoding when building LDAP queries.
Contact the [Readme file](https://github.com/madhatter22/LinqToLdap/blob/master/README.md) in the project repository.

## Additional Defenses

Beyond adopting one of the two primary defenses, we also recommend adopting all of these additional defenses in order to provide defense in depth. These additional defenses are:

- **Least Privilege**
- **Allow-List Input Validation**

### Least Privilege

To minimize the potential damage of a successful LDAP injection attack, you should minimize the privileges assigned to the LDAP binding account in your environment.

### Enabling Bind Authentication

If LDAP protocol is configured with bind Authentication, attackers would not be able to perform LDAP injection attacks because of verification
and authorization checks that are performed against valid credentials passed by the user.
An attacker can still bypass bind authentication through an anonymous connection or by exploiting the use of unauthenticated bind: Anonymous Bind (LDAP) and Unauthenticated Bind (LDAP).

### Allow-List Input Validation

Input validation can be used to detect unauthorized input before it is passed to the LDAP query. For more information please see the [Input Validation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html).

## Related Articles

- OWASP article on [LDAP Injection](https://owasp.org/www-community/attacks/LDAP_Injection) Vulnerabilities.
- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/) article on how to [Test for LDAP Injection](https://owasp.org/www-project-web-security-testing-guide/stable/4-Web_Application_Security_Testing/07-Input_Validation_Testing/06-Testing_for_LDAP_Injection.html) Vulnerabilities.

</section>

<section id="ldap-injection-prevention-translation-panel" className="tabPanel translationPanel contentPanel">

## はじめに

Lightweight Directory Access Protocol (LDAP) を使用すると、アプリケーションはディレクトリ内のレコード検索や変更などの操作をリモートで実行できます。LDAPインジェクションは、不十分な入力サニタイズと入力検証によって発生し、悪意のあるユーザーがディレクトリサービスを使って制限された情報を取得できるようにします。LDAPに関する一般的な情報については、[lightweight directory access protocol (LDAP)](https://www.redhat.com/en/topics/security/what-is-ldap-authentication) を参照してください。

LDAPインジェクションは、ユーザー入力に基づいてLDAP文を構築するWebベースのアプリケーションを悪用する攻撃です。アプリケーションがユーザー入力を適切にサニタイズできない場合、[SQL Injection](https://owasp.org/www-community/attacks/SQL_Injection) と同様の手法によってLDAP文を変更できる可能性があります。

このチートシートは、アプリケーションにおけるLDAPインジェクションの欠陥を防ぐために、明確でシンプルかつ実践可能なガイダンスを提供することに焦点を当てています。[LDAP injection](https://owasp.org/www-community/attacks/LDAP_Injection) 攻撃は、主に次の二つの要因により一般的です。

1. より安全なパラメータ化LDAPクエリインターフェースが不足していること
2. システムに対するユーザー認証にLDAPが広く使われていること

LDAPインジェクション攻撃により、認可されていないクエリへの権限付与や、LDAPツリー内のコンテンツ変更が発生する可能性があります。

主要な防御策:

- すべての変数を適切なLDAPエンコーディング関数でエスケープする
- 自動的にエスケープするフレームワークを使用する

追加の防御策:

- 最小権限
- 許可リストによる入力検証

## 主要な防御策

### 防御オプション1: すべての変数を適切なLDAPエンコーディング関数でエスケープする

#### 識別名のエスケープ

LDAPが名前を保存する主な方法は、DN (distinguished name、識別名) に基づくものです。これは一意の識別子のようなものと考えることができます。ユーザー名のように、リソースへアクセスするために使われることもあります。

DNは次のような形式になります。

`cn=Richard Feynman, ou=Physics Department, dc=Caltech, dc=edu`

または

`uid=inewton, ou=Mathematics Department, dc=Cambridge, dc=com`

許可リストを使って、入力を有効な文字の一覧に制限できます。許可リストから除外する必要がある文字および文字シーケンスには、Java Naming and Directory Interface (JNDI) のメタ文字やLDAP特殊文字が含まれます。これらは以下のリストに示されています。

[完全なリスト](https://ldapwiki.com/wiki/Wiki.jsp?page=DN%20Escape%20Values) は、`\\ # + < > , ; " =` と、先頭または末尾のスペースです。

識別名で許可され、エスケープする必要がない「特殊」文字には、次のものがあります。

```text
* ( ) . & - _ [ ] ` ~ | @ $ % ^ ? : { } ! '
```text

#### 検索フィルタのエスケープ

各DNは正確に一つのエントリを指し、これはRDBMSの行のようなものと考えることができます。各エントリには、RDBMSの列に相当する一つ以上の属性があります。特定の属性を持つユーザーをLDAPで検索したい場合は、検索フィルタを使用できます。

検索フィルタでは、標準的なブール論理を使用して、任意の制約に一致するユーザーの一覧を取得できます。検索フィルタはポーランド記法、つまり前置記法で記述されます。

例:

```text
(&(ou=Physics)(|
(manager=cn=Freeman Dyson,ou=Physics,dc=Caltech,dc=edu)
(manager=cn=Albert Einstein,ou=Physics,dc=Princeton,dc=edu)
))
```text

アプリケーションコードでLDAPクエリを構築する場合、LDAPクエリに追加される信頼できないデータは必ずエスケープする必要があります。LDAPエスケープには二つの形式があります。LDAP検索用のエンコーディングと、LDAP DN (distinguished name、識別名) 用のエンコーディングです。適切なエスケープ方法は、検索フィルタ向けに入力をサニタイズしているのか、あるいはリソースへアクセスするためのユーザー名のような資格情報としてDNを使用しているのかによって異なります。

検索フィルタで許可される「特殊」文字のうち、エスケープが必須のものには次が含まれます。

```text
* ( ) \ NUL
```text

検索フィルタのエスケープに関する詳細は、[RFC4515](https://datatracker.ietf.org/doc/html/rfc4515#section-3) を参照してください。

#### 安全なJavaエスケープの例

次のソリューションでは、許可リストを使ってユーザー入力をサニタイズし、フィルタ文字列に有効な文字のみが含まれるようにしています。このコードでは、userSNには文字とスペースのみを含めることができます。

```java
// String userSN = "Sherlock Holmes"; // Valid
// ... beginning of LDAPInjection.searchRecord()...
sc.setSearchScope(SearchControls.SUBTREE_SCOPE);
String base = "dc=example,dc=com";

if (!userSN.matches("[\\w\\s]*")) {
 throw new IllegalArgumentException("Invalid input");
}

String filter = "(sn = " + userSN + ")";
// ... remainder of LDAPInjection.searchRecord()...
```text

データベースフィールドに特殊文字を含める必要がある場合、本物のデータがサニタイズ済みの形式でデータベースに保存されていること、さらに検証や比較を行う前にユーザー入力が正規化されることを確実にすることが重要です。包括的な正規化と許可リストベースのルーチンがない状態で、JNDIおよびLDAPで特別な意味を持つ文字を使用することは推奨されません。特殊文字は、入力を検証する許可リスト式に追加される前に、サニタイズ済みで安全な値へ変換する必要があります。同様に、ユーザー入力の正規化は検証ステップの前に行うべきです (source: [Prevent LDAP injection](https://wiki.sei.cmu.edu/confluence/spaces/flyingpdf/pdfpageexport.action?pageId=88487534))。

詳細については、[OWASP ESAPI Java Encoder Project which includes encodeForLDAP(String) and encodeForDN(String)](https://owasp.org/www-project-java-encoder/) を参照してください。

#### 安全でないJava LDAPクエリ構築と安全なJava LDAPクエリ構築

❌ **安全でない例 (LDAPインジェクションに脆弱)**

```java
// User input directly concatenated into the filter
String filter = "(&(uid=" + userInput + ")(objectClass=person))";
NamingEnumeration<SearchResult> results =
    ctx.search("ou=users,dc=example,dc=com", filter, controls);

✅ Secure Example (using parameterized filter)

// User input safely passed as a parameter
String filter = "(&(uid={0})(objectClass=person))";
NamingEnumeration<SearchResult> results =
    ctx.search("ou=users,dc=example,dc=com", filter, new Object[]{ userInput }, controls);
```text

#### 安全なC Sharp .NET TBAの例

[.NET AntiXSS](https://blogs.msdn.microsoft.com/securitytools/2010/09/30/antixss-4-0-released/) (現在はEncoderクラス) には、`Encoder.LdapFilterEncode(string)`、`Encoder.LdapDistinguishedNameEncode(string)`、`Encoder.LdapDistinguishedNameEncode(string, bool, bool)` などのLDAPエンコーディング関数があります。

`Encoder.LdapFilterEncode` は [RFC4515](https://datatracker.ietf.org/doc/html/rfc4515) に従って入力をエンコードします。安全でない値は `\\XX` に変換され、`XX` は安全でない文字の表現です。

`Encoder.LdapDistinguishedNameEncode` は [RFC2253](https://tools.ietf.org/html/rfc2253) に従って入力をエンコードします。安全でない文字は `#XX` に変換され、`XX` は安全でない文字の表現です。また、カンマ、プラス、引用符、スラッシュ、小なり記号、大なり記号はスラッシュ記法 (`\\X`) を使ってエスケープされます。これに加えて、入力文字列の先頭にあるスペースまたはオクトソープ (`#`) は `\\` でエスケープされ、文字列末尾のスペースも同様にエスケープされます。

`LdapDistinguishedNameEncode(string, bool, bool)` も提供されており、たとえばエスケープ済みの識別名フラグメントを完全な識別名の途中に連結する場合などに、先頭文字または末尾文字のエスケープルールを無効にできます。

### 防御オプション2: LDAPインジェクションから自動的に保護するフレームワークを使用する

#### 安全な.NETの例

DotNetでは、[LINQ to LDAP](https://www.nuget.org/packages/LinqToLdap/) (.NET Framework 4.5以下については、[更新されるまで](https://github.com/madhatter22/LinqToLdap/issues/31)) の使用を推奨します。これはLDAPクエリを構築するときに自動的なLDAPエンコーディングを提供します。プロジェクトリポジトリの [Readme file](https://github.com/madhatter22/LinqToLdap/blob/master/README.md) を参照してください。

## 追加の防御策

二つの主要な防御策のいずれかを採用することに加え、多層防御を提供するために、以下の追加防御策をすべて採用することも推奨します。これらの追加防御策は次のとおりです。

- **最小権限**
- **許可リストによる入力検証**

### 最小権限

LDAPインジェクション攻撃が成功した場合の潜在的な損害を最小化するため、環境内のLDAPバインドアカウントに割り当てる権限は最小限にするべきです。

### バインド認証の有効化

LDAPプロトコルがバインド認証で構成されている場合、ユーザーから渡された有効な資格情報に対して実行される検証および認可チェックにより、攻撃者はLDAPインジェクション攻撃を実行できなくなります。攻撃者は、それでも匿名接続を通じて、または認証なしバインドの使用を悪用することで、バインド認証をバイパスできる可能性があります: Anonymous Bind (LDAP) and Unauthenticated Bind (LDAP)。

### 許可リストによる入力検証

入力検証を使用すると、LDAPクエリへ渡される前に認可されていない入力を検出できます。詳細については、[Input Validation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html) を参照してください。

## 関連記事

- [LDAP Injection](https://owasp.org/www-community/attacks/LDAP_Injection) の脆弱性に関するOWASPの記事。
- [LDAP Injection](https://owasp.org/www-project-web-security-testing-guide/stable/4-Web_Application_Security_Testing/07-Input_Validation_Testing/06-Testing_for_LDAP_Injection.html) の脆弱性をテストする方法に関する [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/) の記事。

</section>

<section id="ldap-injection-prevention-bilingual-panel" className="tabPanel bilingualPanel">

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Introduction

The Lightweight Directory Access Protocol (LDAP) allows an application to remotely perform operations such as searching and modifying records in
directories. LDAP injection results from inadequate input sanitization and validation and allows malicious users to glean restricted information using the
directory service. For general information about LDAP please visit [lightweight directory access protocol (LDAP)](https://www.redhat.com/en/topics/security/what-is-ldap-authentication).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## はじめに

Lightweight Directory Access Protocol (LDAP) を使用すると、アプリケーションはディレクトリ内のレコード検索や変更などの操作をリモートで実行できます。LDAPインジェクションは、不十分な入力サニタイズと入力検証によって発生し、悪意のあるユーザーがディレクトリサービスを使って制限された情報を取得できるようにします。LDAPに関する一般的な情報については、[lightweight directory access protocol (LDAP)](https://www.redhat.com/en/topics/security/what-is-ldap-authentication) を参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

LDAP Injection is an attack used to exploit web based applications that construct LDAP statements based on user input. When an application fails to properly sanitize user input, it's possible to modify LDAP statements through techniques similar to [SQL Injection](https://owasp.org/www-community/attacks/SQL_Injection).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

LDAPインジェクションは、ユーザー入力に基づいてLDAP文を構築するWebベースのアプリケーションを悪用する攻撃です。アプリケーションがユーザー入力を適切にサニタイズできない場合、[SQL Injection](https://owasp.org/www-community/attacks/SQL_Injection) と同様の手法によってLDAP文を変更できる可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

This cheatsheet is focused on providing clear, simple, actionable guidance for preventing LDAP Injection flaws in your applications. [LDAP injection](https://owasp.org/www-community/attacks/LDAP_Injection) attacks are common due to two factors:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

このチートシートは、アプリケーションにおけるLDAPインジェクションの欠陥を防ぐために、明確でシンプルかつ実践可能なガイダンスを提供することに焦点を当てています。[LDAP injection](https://owasp.org/www-community/attacks/LDAP_Injection) 攻撃は、主に次の二つの要因により一般的です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

1. The lack of safer, parameterized LDAP query interfaces
2. The widespread use of LDAP to authenticate users to systems.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

1. より安全なパラメータ化LDAPクエリインターフェースが不足していること
2. システムに対するユーザー認証にLDAPが広く使われていること

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

LDAP injection attacks could result in the granting of permissions to unauthorized queries, and content modification inside the LDAP tree.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

LDAPインジェクション攻撃により、認可されていないクエリへの権限付与や、LDAPツリー内のコンテンツ変更が発生する可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Primary Defenses:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

主要な防御策:

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Escape all variables using the right LDAP encoding function
- Use a framework that escapes automatically.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- すべての変数を適切なLDAPエンコーディング関数でエスケープする
- 自動的にエスケープするフレームワークを使用する

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Additional Defenses:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

追加の防御策:

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Least Privilege
- Allow-List Input Validation

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- 最小権限
- 許可リストによる入力検証

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Primary Defenses

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 主要な防御策

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Defense Option 1: Escape all variables using the right LDAP encoding function

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 防御オプション1: すべての変数を適切なLDAPエンコーディング関数でエスケープする

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Distinguished Name Escaping

The main way LDAP stores names is based on DN (distinguished name). You can think of this like a unique identifier. These are sometimes used to access resources, like a username.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 識別名のエスケープ

LDAPが名前を保存する主な方法は、DN (distinguished name、識別名) に基づくものです。これは一意の識別子のようなものと考えることができます。ユーザー名のように、リソースへアクセスするために使われることもあります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

A DN might look like this

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

DNは次のような形式になります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

`cn=Richard Feynman, ou=Physics Department, dc=Caltech, dc=edu`

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

`cn=Richard Feynman, ou=Physics Department, dc=Caltech, dc=edu`

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

or

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

または

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

`uid=inewton, ou=Mathematics Department, dc=Cambridge, dc=com`

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

`uid=inewton, ou=Mathematics Department, dc=Cambridge, dc=com`

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

An allowlist can be used to restrict input to a list of valid characters. Characters and character sequences that must be excluded from allowlists — including
Java Naming and Directory Interface (JNDI) metacharacters and LDAP special characters — are listed in the following list.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

許可リストを使って、入力を有効な文字の一覧に制限できます。許可リストから除外する必要がある文字および文字シーケンスには、Java Naming and Directory Interface (JNDI) のメタ文字やLDAP特殊文字が含まれます。これらは以下のリストに示されています。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The [exhaustive list](https://ldapwiki.com/wiki/Wiki.jsp?page=DN%20Escape%20Values) is the following: `\\ # + < > , ; " =` and leading or trailing spaces.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

[完全なリスト](https://ldapwiki.com/wiki/Wiki.jsp?page=DN%20Escape%20Values) は、`\\ # + < > , ; " =` と、先頭または末尾のスペースです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Some "special" characters that are allowed in Distinguished Names and do not need to be escaped include:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

識別名で許可され、エスケープする必要がない「特殊」文字には、次のものがあります。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```text
* ( ) . & - _ [ ] ` ~ | @ $ % ^ ? : { } ! '
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Search Filter Escaping

Each DN points to exactly 1 entry, which can be thought of sort of like a row in a RDBMS. For each entry, there will be 1 or more attributes which are analogous to RDBMS columns. If you are interested in searching through LDAP for users with certain attributes, you may do so with search filters.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 検索フィルタのエスケープ

各DNは正確に一つのエントリを指し、これはRDBMSの行のようなものと考えることができます。各エントリには、RDBMSの列に相当する一つ以上の属性があります。特定の属性を持つユーザーをLDAPで検索したい場合は、検索フィルタを使用できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

In a search filter, you can use standard boolean logic to get a list of users matching an arbitrary constraint. Search filters are written in Polish notation AKA prefix notation.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

検索フィルタでは、標準的なブール論理を使用して、任意の制約に一致するユーザーの一覧を取得できます。検索フィルタはポーランド記法、つまり前置記法で記述されます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Example:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

例:

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```text
(&(ou=Physics)(|
(manager=cn=Freeman Dyson,ou=Physics,dc=Caltech,dc=edu)
(manager=cn=Albert Einstein,ou=Physics,dc=Princeton,dc=edu)
))
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

When building LDAP queries in application code, you MUST escape any untrusted data that is added to any LDAP query. There are two forms of LDAP escaping. Encoding for LDAP Search and Encoding for LDAP DN (distinguished name). The proper escaping depends on whether you are sanitizing input for a search filter, or you are using a DN as a username-like credential for accessing some resource.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

アプリケーションコードでLDAPクエリを構築する場合、LDAPクエリに追加される信頼できないデータは必ずエスケープする必要があります。LDAPエスケープには二つの形式があります。LDAP検索用のエンコーディングと、LDAP DN (distinguished name、識別名) 用のエンコーディングです。適切なエスケープ方法は、検索フィルタ向けに入力をサニタイズしているのか、あるいはリソースへアクセスするためのユーザー名のような資格情報としてDNを使用しているのかによって異なります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Some "special" characters that are allowed in search filters and must be escaped include:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

検索フィルタで許可される「特殊」文字のうち、エスケープが必須のものには次が含まれます。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```text
* ( ) \ NUL
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

For more information on search filter escaping visit [RFC4515](https://datatracker.ietf.org/doc/html/rfc4515#section-3).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

検索フィルタのエスケープに関する詳細は、[RFC4515](https://datatracker.ietf.org/doc/html/rfc4515#section-3) を参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Safe Java Escaping Example

The following solution uses an allowlist to sanitize user input so that the filter string contains only valid characters. In this code, userSN may contain
only letters and spaces.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 安全なJavaエスケープの例

次のソリューションでは、許可リストを使ってユーザー入力をサニタイズし、フィルタ文字列に有効な文字のみが含まれるようにしています。このコードでは、userSNには文字とスペースのみを含めることができます。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```java
// String userSN = "Sherlock Holmes"; // Valid
// ... beginning of LDAPInjection.searchRecord()...
sc.setSearchScope(SearchControls.SUBTREE_SCOPE);
String base = "dc=example,dc=com";

if (!userSN.matches("[\\w\\s]*")) {
 throw new IllegalArgumentException("Invalid input");
}

String filter = "(sn = " + userSN + ")";
// ... remainder of LDAPInjection.searchRecord()...
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

When a database field must include special characters, it is critical to ensure that the authentic data is stored in sanitized form in the
database and also that any user input is normalized before the validation or comparison takes place. Using characters that have special meanings in JNDI
and LDAP in the absence of a comprehensive normalization and allowlisting-based routine is discouraged. Special characters must be transformed to
sanitized, safe values before they are added to the allowlist expression against which input will be validated. Likewise, normalization of user input should
occur before the validation step (source: [Prevent LDAP injection](https://wiki.sei.cmu.edu/confluence/spaces/flyingpdf/pdfpageexport.action?pageId=88487534)).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

データベースフィールドに特殊文字を含める必要がある場合、本物のデータがサニタイズ済みの形式でデータベースに保存されていること、さらに検証や比較を行う前にユーザー入力が正規化されることを確実にすることが重要です。包括的な正規化と許可リストベースのルーチンがない状態で、JNDIおよびLDAPで特別な意味を持つ文字を使用することは推奨されません。特殊文字は、入力を検証する許可リスト式に追加される前に、サニタイズ済みで安全な値へ変換する必要があります。同様に、ユーザー入力の正規化は検証ステップの前に行うべきです (source: [Prevent LDAP injection](https://wiki.sei.cmu.edu/confluence/spaces/flyingpdf/pdfpageexport.action?pageId=88487534))。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

For further information visit [OWASP ESAPI Java Encoder Project which includes encodeForLDAP(String) and encodeForDN(String)](https://owasp.org/www-project-java-encoder/).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

詳細については、[OWASP ESAPI Java Encoder Project which includes encodeForLDAP(String) and encodeForDN(String)](https://owasp.org/www-project-java-encoder/) を参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Insecure vs Secure Java LDAP Query Construction

❌ **Insecure Example (vulnerable to LDAP Injection)**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 安全でないJava LDAPクエリ構築と安全なJava LDAPクエリ構築

❌ **安全でない例 (LDAPインジェクションに脆弱)**

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```java
// User input directly concatenated into the filter
String filter = "(&(uid=" + userInput + ")(objectClass=person))";
NamingEnumeration<SearchResult> results =
    ctx.search("ou=users,dc=example,dc=com", filter, controls);

✅ Secure Example (using parameterized filter)

// User input safely passed as a parameter
String filter = "(&(uid={0})(objectClass=person))";
NamingEnumeration<SearchResult> results =
    ctx.search("ou=users,dc=example,dc=com", filter, new Object[]{ userInput }, controls);
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Safe C Sharp .NET TBA Example

[.NET AntiXSS](https://blogs.msdn.microsoft.com/securitytools/2010/09/30/antixss-4-0-released/) (now the Encoder class) has LDAP encoding functions including `Encoder.LdapFilterEncode(string)`, `Encoder.LdapDistinguishedNameEncode(string)` and `Encoder.LdapDistinguishedNameEncode(string, bool, bool)`.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 安全なC Sharp .NET TBAの例

[.NET AntiXSS](https://blogs.msdn.microsoft.com/securitytools/2010/09/30/antixss-4-0-released/) (現在はEncoderクラス) には、`Encoder.LdapFilterEncode(string)`、`Encoder.LdapDistinguishedNameEncode(string)`、`Encoder.LdapDistinguishedNameEncode(string, bool, bool)` などのLDAPエンコーディング関数があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

`Encoder.LdapFilterEncode` encodes input according to [RFC4515](https://datatracker.ietf.org/doc/html/rfc4515) where unsafe values are converted to `\\XX` where `XX` is the representation of the unsafe character.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

`Encoder.LdapFilterEncode` は [RFC4515](https://datatracker.ietf.org/doc/html/rfc4515) に従って入力をエンコードします。安全でない値は `\\XX` に変換され、`XX` は安全でない文字の表現です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

`Encoder.LdapDistinguishedNameEncode` encodes input according to [RFC2253](https://tools.ietf.org/html/rfc2253) where unsafe characters are converted to `#XX` where `XX` is the representation of the unsafe character and the comma, plus, quote, slash, less than and great than signs are escaped using slash notation (`\\X`). In addition to this a space or octothorpe (`#`) at the beginning of the input string is `\\` escaped as is a space at the end of a string.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

`Encoder.LdapDistinguishedNameEncode` は [RFC2253](https://tools.ietf.org/html/rfc2253) に従って入力をエンコードします。安全でない文字は `#XX` に変換され、`XX` は安全でない文字の表現です。また、カンマ、プラス、引用符、スラッシュ、小なり記号、大なり記号はスラッシュ記法 (`\\X`) を使ってエスケープされます。これに加えて、入力文字列の先頭にあるスペースまたはオクトソープ (`#`) は `\\` でエスケープされ、文字列末尾のスペースも同様にエスケープされます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

`LdapDistinguishedNameEncode(string, bool, bool)` is also provided so you may turn off the initial or final character escaping rules, for example if you are concatenating the escaped distinguished name fragment into the midst of a complete distinguished name.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

`LdapDistinguishedNameEncode(string, bool, bool)` も提供されており、たとえばエスケープ済みの識別名フラグメントを完全な識別名の途中に連結する場合などに、先頭文字または末尾文字のエスケープルールを無効にできます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Defense Option 2: Use Frameworks that Automatically Protect from LDAP Injection

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 防御オプション2: LDAPインジェクションから自動的に保護するフレームワークを使用する

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Safe .NET Example

We recommend using [LINQ to LDAP](https://www.nuget.org/packages/LinqToLdap/) (for .NET Framework 4.5 or lower [until it has been updated](https://github.com/madhatter22/LinqToLdap/issues/31)) in DotNet. It provides automatic LDAP encoding when building LDAP queries.
Contact the [Readme file](https://github.com/madhatter22/LinqToLdap/blob/master/README.md) in the project repository.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 安全な.NETの例

DotNetでは、[LINQ to LDAP](https://www.nuget.org/packages/LinqToLdap/) (.NET Framework 4.5以下については、[更新されるまで](https://github.com/madhatter22/LinqToLdap/issues/31)) の使用を推奨します。これはLDAPクエリを構築するときに自動的なLDAPエンコーディングを提供します。プロジェクトリポジトリの [Readme file](https://github.com/madhatter22/LinqToLdap/blob/master/README.md) を参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Additional Defenses

Beyond adopting one of the two primary defenses, we also recommend adopting all of these additional defenses in order to provide defense in depth. These additional defenses are:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 追加の防御策

二つの主要な防御策のいずれかを採用することに加え、多層防御を提供するために、以下の追加防御策をすべて採用することも推奨します。これらの追加防御策は次のとおりです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- **Least Privilege**
- **Allow-List Input Validation**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- **最小権限**
- **許可リストによる入力検証**

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Least Privilege

To minimize the potential damage of a successful LDAP injection attack, you should minimize the privileges assigned to the LDAP binding account in your environment.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 最小権限

LDAPインジェクション攻撃が成功した場合の潜在的な損害を最小化するため、環境内のLDAPバインドアカウントに割り当てる権限は最小限にするべきです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Enabling Bind Authentication

If LDAP protocol is configured with bind Authentication, attackers would not be able to perform LDAP injection attacks because of verification
and authorization checks that are performed against valid credentials passed by the user.
An attacker can still bypass bind authentication through an anonymous connection or by exploiting the use of unauthenticated bind: Anonymous Bind (LDAP) and Unauthenticated Bind (LDAP).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### バインド認証の有効化

LDAPプロトコルがバインド認証で構成されている場合、ユーザーから渡された有効な資格情報に対して実行される検証および認可チェックにより、攻撃者はLDAPインジェクション攻撃を実行できなくなります。攻撃者は、それでも匿名接続を通じて、または認証なしバインドの使用を悪用することで、バインド認証をバイパスできる可能性があります: Anonymous Bind (LDAP) and Unauthenticated Bind (LDAP)。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Allow-List Input Validation

Input validation can be used to detect unauthorized input before it is passed to the LDAP query. For more information please see the [Input Validation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 許可リストによる入力検証

入力検証を使用すると、LDAPクエリへ渡される前に認可されていない入力を検出できます。詳細については、[Input Validation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html) を参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Related Articles

- OWASP article on [LDAP Injection](https://owasp.org/www-community/attacks/LDAP_Injection) Vulnerabilities.
- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/) article on how to [Test for LDAP Injection](https://owasp.org/www-project-web-security-testing-guide/stable/4-Web_Application_Security_Testing/07-Input_Validation_Testing/06-Testing_for_LDAP_Injection.html) Vulnerabilities.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 関連記事

- [LDAP Injection](https://owasp.org/www-community/attacks/LDAP_Injection) の脆弱性に関するOWASPの記事。
- [LDAP Injection](https://owasp.org/www-project-web-security-testing-guide/stable/4-Web_Application_Security_Testing/07-Input_Validation_Testing/06-Testing_for_LDAP_Injection.html) の脆弱性をテストする方法に関する [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/) の記事。

</div>
</div>

</section>
</div>



## Attribution

<div className="attributionFooter">

- Original: LDAP Injection Prevention Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/LDAP_Injection_Prevention_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: English original retained for comparison. Japanese translation added. Bilingual display generated from official source and local Japanese translation.
- Retrieved: 2026-05-20

</div>
