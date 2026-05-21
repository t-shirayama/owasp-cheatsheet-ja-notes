# LDAPインジェクション防止チートシート 日本語訳

## Attribution

- Original: LDAP Injection Prevention Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/LDAP_Injection_Prevention_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-21

## 日本語訳

# LDAPインジェクション防止チートシート

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

[完全なリスト](https://ldapwiki.com/wiki/Wiki.jsp?page=DN%20Escape%20Values) は、`\ # + < > , ; " =` と、先頭または末尾のスペースです。

識別名で許可され、エスケープする必要がない「特殊」文字には、次のものがあります。

```text
* ( ) . & - _ [ ] ` ~ | @ $ % ^ ? : { } ! '
```

#### 検索フィルタのエスケープ

各DNは正確に一つのエントリを指し、これはRDBMSの行のようなものと考えることができます。各エントリには、RDBMSの列に相当する一つ以上の属性があります。特定の属性を持つユーザーをLDAPで検索したい場合は、検索フィルタを使用できます。

検索フィルタでは、標準的なブール論理を使用して、任意の制約に一致するユーザーの一覧を取得できます。検索フィルタはポーランド記法、つまり前置記法で記述されます。

例:

```text
(&(ou=Physics)(|
(manager=cn=Freeman Dyson,ou=Physics,dc=Caltech,dc=edu)
(manager=cn=Albert Einstein,ou=Physics,dc=Princeton,dc=edu)
))
```

アプリケーションコードでLDAPクエリを構築する場合、LDAPクエリに追加される信頼できないデータは必ずエスケープする必要があります。LDAPエスケープには二つの形式があります。LDAP検索用のエンコーディングと、LDAP DN (distinguished name、識別名) 用のエンコーディングです。適切なエスケープ方法は、検索フィルタ向けに入力をサニタイズしているのか、あるいはリソースへアクセスするためのユーザー名のような資格情報としてDNを使用しているのかによって異なります。

検索フィルタで許可される「特殊」文字のうち、エスケープが必須のものには次が含まれます。

```text
* ( ) \ NUL
```

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
```

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
```

#### 安全なC Sharp .NET TBAの例

[.NET AntiXSS](https://blogs.msdn.microsoft.com/securitytools/2010/09/30/antixss-4-0-released/) (現在はEncoderクラス) には、`Encoder.LdapFilterEncode(string)`、`Encoder.LdapDistinguishedNameEncode(string)`、`Encoder.LdapDistinguishedNameEncode(string, bool, bool)` などのLDAPエンコーディング関数があります。

`Encoder.LdapFilterEncode` は [RFC4515](https://datatracker.ietf.org/doc/html/rfc4515) に従って入力をエンコードします。安全でない値は `\XX` に変換され、`XX` は安全でない文字の表現です。

`Encoder.LdapDistinguishedNameEncode` は [RFC2253](https://tools.ietf.org/html/rfc2253) に従って入力をエンコードします。安全でない文字は `#XX` に変換され、`XX` は安全でない文字の表現です。また、カンマ、プラス、引用符、スラッシュ、小なり記号、大なり記号はスラッシュ記法 (`\X`) を使ってエスケープされます。これに加えて、入力文字列の先頭にあるスペースまたはオクトソープ (`#`) は `\` でエスケープされ、文字列末尾のスペースも同様にエスケープされます。

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

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V5 入力検証、サニタイズ、エンコーディング | LDAP検索フィルタと識別名に追加される信頼できないデータのエスケープ、許可リストによる入力検証 |
| V14 設定 | LDAPバインドアカウントの最小権限、バインド認証の有効化 |

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V1 | LDAPインジェクション防止チートシート の主要な管理策 |

