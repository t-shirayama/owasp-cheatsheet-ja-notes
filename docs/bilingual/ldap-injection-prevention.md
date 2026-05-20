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

<div className="tabbedContent">
  <input className="tabInput" type="radio" name="ldap-injection-prevention-view" id="ldap-injection-prevention-original" />
  <input className="tabInput" type="radio" name="ldap-injection-prevention-view" id="ldap-injection-prevention-translation" defaultChecked />
  <input className="tabInput" type="radio" name="ldap-injection-prevention-view" id="ldap-injection-prevention-summary" />
  <input className="tabInput" type="radio" name="ldap-injection-prevention-view" id="ldap-injection-prevention-checklist" />
  <input className="tabInput" type="radio" name="ldap-injection-prevention-view" id="ldap-injection-prevention-bilingual" />

  <div className="contentTabs">
    <label htmlFor="ldap-injection-prevention-original">原本</label>
    <label htmlFor="ldap-injection-prevention-translation">翻訳</label>
    <label htmlFor="ldap-injection-prevention-summary">要点</label>
    <label htmlFor="ldap-injection-prevention-checklist">チェックリスト</label>
    <label htmlFor="ldap-injection-prevention-bilingual">対比表示</label>
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
```

#### Search Filter Escaping

Each DN points to exactly 1 entry, which can be thought of sort of like a row in a RDBMS. For each entry, there will be 1 or more attributes which are analogous to RDBMS columns. If you are interested in searching through LDAP for users with certain attributes, you may do so with search filters.

In a search filter, you can use standard boolean logic to get a list of users matching an arbitrary constraint. Search filters are written in Polish notation AKA prefix notation.

Example:

```text
(&(ou=Physics)(|
(manager=cn=Freeman Dyson,ou=Physics,dc=Caltech,dc=edu)
(manager=cn=Albert Einstein,ou=Physics,dc=Princeton,dc=edu)
))
```

When building LDAP queries in application code, you MUST escape any untrusted data that is added to any LDAP query. There are two forms of LDAP escaping. Encoding for LDAP Search and Encoding for LDAP DN (distinguished name). The proper escaping depends on whether you are sanitizing input for a search filter, or you are using a DN as a username-like credential for accessing some resource.

Some "special" characters that are allowed in search filters and must be escaped include:

```text
* ( ) \ NUL
```

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
```

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
```

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

LDAPインジェクションは、ユーザー入力がLDAPフィルタやDNとして解釈されることで発生します。入力検証、エスケープ、最小権限のLDAPアカウントが重要です。

## 主要な観点

- LDAPフィルタ値を適切にエスケープする。
- DNとして使う値も別途エスケープする。
- LDAP接続アカウントを最小権限にする。

</section>

<section id="ldap-injection-prevention-summary-panel" className="tabPanel summaryPanel contentPanel">

LDAPインジェクションは、ユーザー入力がLDAPフィルタやDNとして解釈されることで発生します。入力検証、エスケープ、最小権限のLDAPアカウントが重要です。

## 要点

- LDAPフィルタ値を適切にエスケープする。
- DNとして使う値も別途エスケープする。
- LDAP接続アカウントを最小権限にする。

## 実装時の注意点

- この要約はASVS Indexでの利用を前提にした実装者向け整理です。詳細確認時は原文を参照してください。
- 関連する認証、認可、ログ、入力検証、暗号、通信保護の管理策と組み合わせて適用します。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V1 | LDAPインジェクション防止チートシート の主要な管理策 |

</section>

<section id="ldap-injection-prevention-checklist-panel" className="tabPanel checklistPanel contentPanel">

- [ ] LDAP検索フィルタを文字列連結で作らない。
- [ ] フィルタ特殊文字をエスケープする。
- [ ] DN特殊文字をエスケープする。
- [ ] 検索範囲と返却属性を制限する。
- [ ] LDAPエラー詳細をユーザーへ返さない。

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

LDAPインジェクションは、ユーザー入力がLDAPフィルタやDNとして解釈されることで発生します。入力検証、エスケープ、最小権限のLDAPアカウントが重要です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

LDAP Injection is an attack used to exploit web based applications that construct LDAP statements based on user input. When an application fails to properly sanitize user input, it's possible to modify LDAP statements through techniques similar to [SQL Injection](https://owasp.org/www-community/attacks/SQL_Injection).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 主要な観点

- LDAPフィルタ値を適切にエスケープする。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

This cheatsheet is focused on providing clear, simple, actionable guidance for preventing LDAP Injection flaws in your applications. [LDAP injection](https://owasp.org/www-community/attacks/LDAP_Injection) attacks are common due to two factors:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- DNとして使う値も別途エスケープする。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

1. The lack of safer, parameterized LDAP query interfaces

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- LDAP接続アカウントを最小権限にする。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

2. The widespread use of LDAP to authenticate users to systems.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

LDAP injection attacks could result in the granting of permissions to unauthorized queries, and content modification inside the LDAP tree.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Primary Defenses:

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Escape all variables using the right LDAP encoding function

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Use a framework that escapes automatically.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Additional Defenses:

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Least Privilege

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Allow-List Input Validation

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Primary Defenses

### Defense Option 1: Escape all variables using the right LDAP encoding function

#### Distinguished Name Escaping

The main way LDAP stores names is based on DN (distinguished name). You can think of this like a unique identifier. These are sometimes used to access resources, like a username.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

A DN might look like this

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

`cn=Richard Feynman, ou=Physics Department, dc=Caltech, dc=edu`

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

or

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

`uid=inewton, ou=Mathematics Department, dc=Cambridge, dc=com`

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

An allowlist can be used to restrict input to a list of valid characters. Characters and character sequences that must be excluded from allowlists — including
Java Naming and Directory Interface (JNDI) metacharacters and LDAP special characters — are listed in the following list.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The [exhaustive list](https://ldapwiki.com/wiki/Wiki.jsp?page=DN%20Escape%20Values) is the following: `\\ # + < > , ; " =` and leading or trailing spaces.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Some "special" characters that are allowed in Distinguished Names and do not need to be escaped include:

</div>

</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>


```text
* ( ) . & - _ [ ] ` ~ | @ $ % ^ ? : { } ! '
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Search Filter Escaping

Each DN points to exactly 1 entry, which can be thought of sort of like a row in a RDBMS. For each entry, there will be 1 or more attributes which are analogous to RDBMS columns. If you are interested in searching through LDAP for users with certain attributes, you may do so with search filters.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

In a search filter, you can use standard boolean logic to get a list of users matching an arbitrary constraint. Search filters are written in Polish notation AKA prefix notation.

</div>

</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>
#### Example


```text
(&(ou=Physics)(|
(manager=cn=Freeman Dyson,ou=Physics,dc=Caltech,dc=edu)
(manager=cn=Albert Einstein,ou=Physics,dc=Princeton,dc=edu)
))
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

When building LDAP queries in application code, you MUST escape any untrusted data that is added to any LDAP query. There are two forms of LDAP escaping. Encoding for LDAP Search and Encoding for LDAP DN (distinguished name). The proper escaping depends on whether you are sanitizing input for a search filter, or you are using a DN as a username-like credential for accessing some resource.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Some "special" characters that are allowed in search filters and must be escaped include:

</div>

</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>


```text
* ( ) \ NUL
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

For more information on search filter escaping visit [RFC4515](https://datatracker.ietf.org/doc/html/rfc4515#section-3).

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Safe Java Escaping Example

The following solution uses an allowlist to sanitize user input so that the filter string contains only valid characters. In this code, userSN may contain
only letters and spaces.

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
```

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

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

For further information visit [OWASP ESAPI Java Encoder Project which includes encodeForLDAP(String) and encodeForDN(String)](https://owasp.org/www-project-java-encoder/).

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Insecure vs Secure Java LDAP Query Construction

❌ **Insecure Example (vulnerable to LDAP Injection)**

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

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

`Encoder.LdapFilterEncode` encodes input according to [RFC4515](https://datatracker.ietf.org/doc/html/rfc4515) where unsafe values are converted to `\\XX` where `XX` is the representation of the unsafe character.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

`Encoder.LdapDistinguishedNameEncode` encodes input according to [RFC2253](https://tools.ietf.org/html/rfc2253) where unsafe characters are converted to `#XX` where `XX` is the representation of the unsafe character and the comma, plus, quote, slash, less than and great than signs are escaped using slash notation (`\\X`). In addition to this a space or octothorpe (`#`) at the beginning of the input string is `\\` escaped as is a space at the end of a string.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

`LdapDistinguishedNameEncode(string, bool, bool)` is also provided so you may turn off the initial or final character escaping rules, for example if you are concatenating the escaped distinguished name fragment into the midst of a complete distinguished name.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Defense Option 2: Use Frameworks that Automatically Protect from LDAP Injection

#### Safe .NET Example

We recommend using [LINQ to LDAP](https://www.nuget.org/packages/LinqToLdap/) (for .NET Framework 4.5 or lower [until it has been updated](https://github.com/madhatter22/LinqToLdap/issues/31)) in DotNet. It provides automatic LDAP encoding when building LDAP queries.
Contact the [Readme file](https://github.com/madhatter22/LinqToLdap/blob/master/README.md) in the project repository.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Additional Defenses

Beyond adopting one of the two primary defenses, we also recommend adopting all of these additional defenses in order to provide defense in depth. These additional defenses are:

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- **Least Privilege**

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- **Allow-List Input Validation**

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Least Privilege

To minimize the potential damage of a successful LDAP injection attack, you should minimize the privileges assigned to the LDAP binding account in your environment.

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

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Allow-List Input Validation

Input validation can be used to detect unauthorized input before it is passed to the LDAP query. For more information please see the [Input Validation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html).

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Related Articles

- OWASP article on [LDAP Injection](https://owasp.org/www-community/attacks/LDAP_Injection) Vulnerabilities.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/) article on how to [Test for LDAP Injection](https://owasp.org/www-project-web-security-testing-guide/stable/4-Web_Application_Security_Testing/07-Input_Validation_Testing/06-Testing_for_LDAP_Injection.html) Vulnerabilities.

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
- Changes: English original retained for comparison. Japanese translation added. Bilingual display generated from official source and local Japanese notes.
- Retrieved: 2026-05-20

</div>
