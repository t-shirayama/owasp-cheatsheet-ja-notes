---
title: Input Validation Cheat Sheet
hide_title: true
---

<div className="docHero" data-category="encoding-and-sanitization">
  <h1>入力検証チートシート</h1>
  <div className="docMeta">
    <span className="docPill">最終更新: 2026-05-21</span>
    <span className="docPill">読了時間: 約 15 分</span>
    <span className="docPill">カテゴリ: 入力検証とサニタイズ</span>
  </div>
</div>

<p className="docLead">入力検証チートシートを、原文・翻訳・対比表示で確認できます。ASVS Index 対応の文脈で、公式原文と日本語訳を確認しやすく整理しています。</p>

<div className="tabbedContent">
  <input className="tabInput" type="radio" name="input-validation-view" id="input-validation-original" />
  <input className="tabInput" type="radio" name="input-validation-view" id="input-validation-translation" defaultChecked />
  <input className="tabInput" type="radio" name="input-validation-view" id="input-validation-bilingual" />

  <div className="contentTabs">
    <label htmlFor="input-validation-original" title="OWASP 原文">原文</label>
    <label htmlFor="input-validation-translation" title="日本語訳">翻訳</label>
    <label htmlFor="input-validation-bilingual" title="原文と翻訳を並べて確認">対比表示</label>
  </div>

<section id="input-validation-original-panel" className="tabPanel originalPanel contentPanel">

## Introduction

This article is focused on providing clear, simple, actionable guidance for providing Input Validation security functionality in your applications.

## Goals of Input Validation

Input validation is performed to ensure only properly formed data is entering the workflow in an information system, preventing malformed data from persisting in the database and triggering malfunction of various downstream components. Input validation should happen as early as possible in the data flow, preferably as soon as the data is received from the external party.

Data from all potentially untrusted sources should be subject to input validation, including not only Internet-facing web clients but also backend feeds over extranets, from [suppliers, partners, vendors or regulators](https://badcyber.com/several-polish-banks-hacked-information-stolen-by-unknown-attackers/), each of which may be compromised on their own and start sending malformed data.

Input Validation should not be used as the *primary* method of preventing [XSS](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html), [SQL Injection](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html) and other attacks which are covered in respective [cheat sheets](https://cheatsheetseries.owasp.org/) but can significantly contribute to reducing their impact if implemented properly.

## Input Validation Strategies

Input validation should be applied at both syntactic and semantic levels:

- **Syntactic** validation should enforce correct syntax of structured fields (e.g. SSN, date, currency symbol).
- **Semantic** validation should enforce correctness of their *values* in the specific business context (e.g. start date is before end date, price is within expected range).

It is always recommended to prevent attacks as early as possible in the processing of the user's (attacker's) request. Input validation can be used to detect unauthorized input before it is processed by the application.

## Implementing Input Validation

Input validation can be implemented using any programming technique that allows effective enforcement of syntactic and semantic correctness, for example:

- Data type validators available natively in web application frameworks (such as [Django Validators](https://docs.djangoproject.com/en/1.11/ref/validators/), [Apache Commons Validators](https://commons.apache.org/proper/commons-validator/apidocs/org/apache/commons/validator/package-summary.html#doc.Usage.validator) etc).
- Validation against [JSON Schema](http://json-schema.org/) and [XML Schema (XSD)](https://www.w3schools.com/xml/schema_intro.asp) for input in these formats.
- Type conversion (e.g. `Integer.parseInt()` in Java, `int()` in Python) with strict exception handling
- Minimum and maximum value range check for numerical parameters and dates, minimum and maximum length check for strings.
- Array of allowed values for small sets of string parameters (e.g. days of week).
- Regular expressions for any other structured data covering the whole input string `(^...$)` and **not** using "any character" wildcard (such as `.` or `\S`)
- Denylisting known dangerous patterns can be used as an additional layer of defense, but it should supplement - not replace - allowlisting, to help catch some commonly observed attacks or patterns without relying on it as the main validation method.

### Allowlist vs Denylist

It is a common mistake to use denylist validation in order to try to detect possibly dangerous characters and patterns like the apostrophe `'` character, the string `1=1`, or the `<script>` tag, but this is a massively flawed approach as it is trivial for an attacker to bypass such filters.

Plus, such filters frequently prevent authorized input, like `O'Brian`, where the `'` character is fully legitimate. For more information on XSS filter evasion please see [this wiki page](https://owasp.org/www-community/xss-filter-evasion-cheatsheet).

While denylisting can be useful as an additional layer of defense to catch some common malicious patterns, it should not be relied upon as the primary method. Allowlisting remains the more robust and secure approach for preventing potentially harmful input.

Allowlist validation is appropriate for all input fields provided by the user. Allowlist validation involves defining exactly what IS authorized, and by definition, everything else is not authorized.

If it's well structured data, like dates, social security numbers, zip codes, email addresses, etc. then the developer should be able to define a very strong validation pattern, usually based on regular expressions, for validating such input.

If the input field comes from a fixed set of options, like a drop down list or radio buttons, then the input needs to match exactly one of the values offered to the user in the first place. Any failure to validate a value against this discrete list of options on the server side is a high security event and should be logged as a high severity event as it indicates that an attacker is tampering with the client-side code.

### Validating Free-form Unicode Text

Free-form text, especially with Unicode characters, is perceived as difficult to validate due to a relatively large space of characters that need to be allowed.

It's also free-form text input that highlights the importance of proper context-aware output encoding and quite clearly demonstrates that input validation is **not** the primary safeguards against Cross-Site Scripting. If your users want to type apostrophe `'` or less-than sign `<` in their comment field, they might have perfectly legitimate reason for that and the application's job is to properly handle it throughout the whole life cycle of the data.

The primary means of input validation for free-form text input should be:

- **Normalization:** Ensure canonical encoding is used across all the text and no invalid characters are present.
- **Character category allowlisting:** Unicode allows listing categories such as "decimal digits" or "letters" which not only covers the Latin alphabet but also various other scripts used globally (e.g. Arabic, Cyrillic, CJK ideographs etc).
- **Individual character allowlisting:** If you allow letters and ideographs in names and also want to allow apostrophe `'` for Irish names, but don't want to allow the whole punctuation category.

References:

- [Input validation of free-form Unicode text in Python](https://web.archive.org/web/20170717174432/https://ipsec.pl/python/2017/input-validation-free-form-unicode-text-python.html/)
- [UAX 31: Unicode Identifier and Pattern Syntax](https://unicode.org/reports/tr31/)
- [UAX 15: Unicode Normalization Forms](https://www.unicode.org/reports/tr15/)
- [UAX 24: Unicode Script Property](https://unicode.org/reports/tr24/)

### Regular Expressions (Regex)

Developing regular expressions can be complicated, and is well beyond the scope of this cheat sheet.

There are lots of resources on the internet about how to write regular expressions, including this [site](https://www.regular-expressions.info/) and the [OWASP Validation Regex Repository](https://owasp.org/www-community/OWASP_Validation_Regex_Repository).

When designing regular expression, be aware of [RegEx Denial of Service (ReDoS) attacks](https://owasp.org/www-community/attacks/Regular_expression_Denial_of_Service_-_ReDoS). These attacks cause a program using a poorly designed Regular Expression to operate very slowly and utilize CPU resources for a very long time.

In summary, input validation should:

- Be applied to all input data, at minimum.
- Define the allowed set of characters to be accepted.
- Define a minimum and maximum length for the data (e.g. `&#123;1,25&#125;`).

## Allow List Regular Expression Examples

Validating a U.S. Zip Code (5 digits plus optional -4)

```text
^\d{5}(-\d{4})?$
```

Validating U.S. State Selection From a Drop-Down Menu

```text
^(AA|AE|AP|AL|AK|AS|AZ|AR|CA|CO|CT|DE|DC|FM|FL|GA|GU|
HI|ID|IL|IN|IA|KS|KY|LA|ME|MH|MD|MA|MI|MN|MS|MO|MT|NE|
NV|NH|NJ|NM|NY|NC|ND|MP|OH|OK|OR|PW|PA|PR|RI|SC|SD|TN|
TX|UT|VT|VI|VA|WA|WV|WI|WY)$
```

**Java Regex Usage Example:**

Example validating the parameter "zip" using a regular expression.

```java
private static final Pattern zipPattern = Pattern.compile("^\d{5}(-\d{4})?$");

public void doPost( HttpServletRequest request, HttpServletResponse response) {
  try {
      String zipCode = request.getParameter( "zip" );
      if ( !zipPattern.matcher( zipCode ).matches() ) {
          throw new YourValidationException( "Improper zipcode format." );
      }
      // do what you want here, after its been validated ..
  } catch(YourValidationException e ) {
      response.sendError( response.SC_BAD_REQUEST, e.getMessage() );
  }
}
```

Some Allowlist validators have also been predefined in various open source packages that you can leverage. For example:

- [Apache Commons Validator](http://commons.apache.org/proper/commons-validator/)

## Client-side vs Server-side Validation

Input validation **must** be implemented on the server-side before any data is processed by an application’s functions, as any JavaScript-based input validation performed on the client-side can be circumvented by an attacker who disables JavaScript or uses a web proxy. Implementing both client-side JavaScript-based validation for UX and server-side validation for security is the recommended approach, leveraging each for their respective strengths.

## Validating Rich User Content

It is very difficult to validate rich content submitted by a user. For more information, please see the XSS cheat sheet on [Sanitizing HTML Markup with a Library Designed for the Job](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html).

## Preventing XSS and Content Security Policy

All user data controlled must be encoded when returned in the HTML page to prevent the execution of malicious data (e.g. XSS). For example `<script>` would be returned as `&lt;script&gt;`

The type of encoding is specific to the context of the page where the user controlled data is inserted. For example, HTML entity encoding is appropriate for data placed into the HTML body. However, user data placed into a script would need JavaScript specific output encoding.

Detailed information on XSS prevention here: [OWASP XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)

## File Upload Validation

Many websites allow users to upload files, such as a profile picture or more. This section helps provide that feature securely.

Check the [File Upload Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html).

### Upload Verification

- Use input validation to ensure the uploaded filename uses an expected extension type.
- Ensure the uploaded file is not larger than a defined maximum file size.
- If the website supports ZIP file upload, do a validation check before unzipping the file. The check includes the target path, level of compression, estimated unzip size.

### Upload Storage

- Use a new filename to store the file on the OS. Do not use any user controlled text for this filename or for the temporary filename.
- When the file is uploaded to web, it's suggested to rename the file on storage. For example, the uploaded filename is *test.JPG*, rename it to *JAI1287uaisdjhf.JPG* with a random filename. The purpose of doing it to prevent the risks of direct file access and ambiguous filename to evade the filter, such as `test.jpg;.asp or /../../../../../test.jpg`.
- Uploaded files should be analyzed for malicious content (anti-malware, static analysis, etc).
- The client should not be able to specify the file path; it should be defined by the server.

### Public Serving of Uploaded Content

- Ensure uploaded images are served with the correct content-type (e.g. `image/jpeg`, `application/x-xpinstall`)

### Beware of Specific File Types

The upload feature should be using an allowlist approach to only allow specific file types and extensions. However, it is important to be aware of the following file types that, if allowed, could result in security vulnerabilities:

- **crossdomain.xml** / **clientaccesspolicy.xml:** allows cross-domain data loading in Flash, Java and Silverlight. If permitted on sites with authentication this can permit cross-domain data theft and CSRF attacks. Note this can get pretty complicated depending on the specific plugin version in question, so its best to just prohibit files named "crossdomain.xml" or "clientaccesspolicy.xml".
- **.htaccess** and **.htpasswd:** Provides server configuration options on a per-directory basis, and should not be permitted. See [HTACCESS documentation](http://en.wikipedia.org/wiki/Htaccess).
- Web executable script files are suggested not to be allowed such as `aspx, asp, css, swf, xhtml, rhtml, shtml, jsp, js, pl, php, cgi`.

### Image Upload Verification

- Use image rewriting libraries to verify the image is valid and to strip away extraneous content.
- Set the extension of the stored image to be a valid image extension based on the detected content type of the image from image processing (e.g. do not just trust the header from the upload).
- Ensure the detected content type of the image is within a list of defined image types (jpg, PNG, etc)

## Email Address Validation

### Syntactic Validation

The format of email addresses is defined by [RFC 5321](https://tools.ietf.org/html/rfc5321#section-4.1.2), and is far more complicated than most people realise. As an example, the following are all considered to be valid email addresses:

- `"><script>alert(1);</script>"@example.org`
- `user+subaddress@example.org`
- `user@[IPv6:2001:db8::1]`
- `" "@example.org`

Properly parsing email addresses for validity with regular expressions is very complicated, although there are a number of [publicly available documents on regex](https://datatracker.ietf.org/doc/html/draft-seantek-mail-regexen-03#rfc.section.3).

The biggest caveat on this is that although the RFC defines a very flexible format for email addresses, most real world implementations (such as mail servers) use a far more restricted address format, meaning that they will reject addresses that are *technically* valid.  Although they may be technically correct, these addresses are of little use if your application will not be able to actually send emails to them.

As such, the best way to validate email addresses is to perform some basic initial validation, and then pass the address to the mail server and catch the exception if it rejects it. This means that the application can be confident that its mail server can send emails to any addresses it accepts. The initial validation could be as simple as:

- The email address contains two parts, separated with an `@` symbol.
- The email address does not contain dangerous characters (such as backticks, single or double quotes, or null bytes).
    - Exactly which characters are dangerous will depend on how the address is going to be used (echoed in page, inserted into database, etc).
- The domain part contains only letters, numbers, hyphens (`-`) and periods (`.`).
- The email address is a reasonable length:
    - The local part (before the `@`) should be no more than 63 characters.
    - The total length should be no more than 254 characters.

### Semantic Validation

Semantic validation is about determining whether the email address is correct and legitimate. The most common way to do this is to send an email to the user, and require that they click a link in the email, or enter a code that has been sent to them. This provides a basic level of assurance that:

- The email address is correct.
- The application can successfully send emails to it.
- The user has access to the mailbox.

The links that are sent to users to prove ownership should contain a token that is:

- At least 32 characters long.
- Generated using a [secure source of randomness](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html#secure-random-number-generation).
- Single use.
- Time limited (e.g, expiring after eight hours).

After validating the ownership of the email address, the user should then be required to authenticate on the application through the usual mechanism.

#### Disposable Email Addresses

In some cases, users may not want to give their real email address when registering on the application, and will instead provide a disposable email address. These are publicly available addresses that do not require the user to authenticate, and are typically used to reduce the amount of spam received by users' primary email addresses.

Blocking disposable email addresses is almost impossible, as there are a large number of websites offering these services, with new domains being created every day. There are a number of publicly available lists and commercial lists of known disposable domains, but these will always be incomplete.

If these lists are used to block the use of disposable email addresses then the user should be presented with a message explaining why they are blocked (although they are likely to simply search for another disposable provider rather than giving their legitimate address).

If it is essential that disposable email addresses are blocked, then registrations should only be allowed from specifically-allowed email providers. However, if this includes public providers such as Google or Yahoo, users can simply register their own disposable address with them.

#### Sub-Addressing

Sub-addressing allows a user to specify a *tag* in the local part of the email address (before the `@` sign), which will be ignored by the mail server. For example, if that `example.org` domain supports sub-addressing, then the following email addresses are equivalent:

- `user@example.org`
- `user+site1@example.org`
- `user+site2@example.org`

Many mail providers (such as Microsoft Exchange) do not support sub-addressing. The most notable provider who does is Gmail, although there are many others that also do.

Some users will use a different *tag* for each website they register on, so that if they start receiving spam to one of the sub-addresses they can identify which website leaked or sold their email address.

Because it could allow users to register multiple accounts with a single email address, some sites may wish to block sub-addressing by stripping out everything between the `+` and `@` signs. This is not generally recommended, as it suggests that the website owner is either unaware of sub-addressing or wishes to prevent users from identifying them when they leak or sell email addresses. Additionally, it can be trivially bypassed by using [disposable email addresses](#disposable-email-addresses), or simply registering multiple email accounts with a trusted provider.

</section>

<section id="input-validation-translation-panel" className="tabPanel translationPanel contentPanel">

## はじめに

この記事は、アプリケーションに入力検証のセキュリティ機能を提供するための、明確でシンプルかつ実行可能なガイダンスを示すことに焦点を当てています。

## 入力検証の目的

入力検証は、情報システム内のワークフローに正しく形成されたデータだけが入るようにするために実施します。これにより、不正な形式のデータがデータベースに残ったり、後続のさまざまなコンポーネントの誤動作を引き起こしたりすることを防ぎます。入力検証は、データフローのできるだけ早い段階、できれば外部の相手からデータを受け取った直後に行うべきです。

潜在的に信頼できないすべてのソースからのデータは入力検証の対象にするべきです。これにはインターネットに面した Web クライアントだけでなく、エクストラネット経由のバックエンドフィードや、[サプライヤー、パートナー、ベンダー、規制当局](https://badcyber.com/several-polish-banks-hacked-information-stolen-by-unknown-attackers/)からのデータも含まれます。それぞれが単独で侵害され、不正な形式のデータを送信し始める可能性があります。

入力検証は、[XSS](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)、[SQL インジェクション](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)、その他それぞれの[チートシート](https://cheatsheetseries.owasp.org/)で扱われている攻撃を防ぐための*主要な*方法として使うべきではありません。ただし、適切に実装されていれば、それらの影響を軽減するうえで大きく貢献できます。

## 入力検証戦略

入力検証は、構文レベルと意味レベルの両方で適用するべきです。

- **構文的**検証では、構造化フィールドの正しい構文を強制するべきです (例: SSN、日付、通貨記号)。
- **意味的**検証では、特定のビジネスコンテキストにおける*値*の正しさを強制するべきです (例: 開始日が終了日より前である、価格が想定範囲内である)。

ユーザー (攻撃者) のリクエスト処理では、できるだけ早い段階で攻撃を防ぐことが常に推奨されます。入力検証は、アプリケーションで処理される前に認可されていない入力を検出するために使用できます。

## 入力検証の実装

入力検証は、構文的および意味的な正しさを効果的に強制できる任意のプログラミング技法で実装できます。たとえば次のようなものがあります。

- Web アプリケーションフレームワークに標準で用意されているデータ型バリデータ (例: [Django Validators](https://docs.djangoproject.com/en/1.11/ref/validators/)、[Apache Commons Validators](https://commons.apache.org/proper/commons-validator/apidocs/org/apache/commons/validator/package-summary.html#doc.Usage.validator) など)。
- これらの形式の入力に対する [JSON Schema](http://json-schema.org/) や [XML Schema (XSD)](https://www.w3schools.com/xml/schema_intro.asp) による検証。
- 厳格な例外処理を伴う型変換 (例: Java の `Integer.parseInt()`、Python の `int()`)。
- 数値パラメータや日付に対する最小値および最大値の範囲チェック、文字列に対する最小長および最大長のチェック。
- 小さな集合の文字列パラメータに対する許可値の配列 (例: 曜日)。
- 入力文字列全体を対象とする正規表現 `(^...$)`。また、「任意の文字」ワイルドカード (`.` や `\S` など) は使用しません。
- 既知の危険なパターンの拒否リスト化は、追加の防御層として使用できます。ただし、一般的に観測される攻撃やパターンの一部を捕捉するために、許可リスト化を補完するものであり、置き換えるものではありません。主要な検証方法として依存してはいけません。

### 許可リストと拒否リスト

アポストロフィ `'`、文字列 `1=1`、`<script>` タグのような、危険かもしれない文字やパターンを検出しようとして拒否リスト検証を使うのはよくある誤りです。しかし、この方法は攻撃者が簡単に回避できるため、根本的に欠陥があります。

さらに、このようなフィルタは、`O'Brian` のように `'` 文字が完全に正当な入力である場合にも、認可された入力を妨げることがよくあります。XSS フィルタ回避の詳細については、[この wiki ページ](https://owasp.org/www-community/xss-filter-evasion-cheatsheet)を参照してください。

拒否リスト化は、一般的な悪意あるパターンの一部を捕捉する追加の防御層としては有用な場合がありますが、主要な方法として依存するべきではありません。潜在的に有害な入力を防ぐには、許可リスト化のほうがより堅牢で安全なアプローチです。

許可リスト検証は、ユーザーが提供するすべての入力フィールドに適しています。許可リスト検証では、何が認可されるかを正確に定義します。定義上、それ以外のものは認可されません。

日付、社会保障番号、郵便番号、メールアドレスなどのように十分に構造化されたデータであれば、開発者は通常、正規表現に基づいて、その入力を検証するための非常に強い検証パターンを定義できるはずです。

入力フィールドがドロップダウンリストやラジオボタンのような固定された選択肢の集合から来る場合、その入力は、そもそもユーザーに提示された値のいずれか一つと正確に一致する必要があります。サーバー側でこの離散的な選択肢リストに対する値の検証に失敗した場合、それは攻撃者がクライアント側コードを改ざんしていることを示すため、重大度の高いセキュリティイベントとして扱い、高重大度イベントとしてログに記録するべきです。

### 自由形式 Unicode テキストの検証

自由形式テキスト、とくに Unicode 文字を含むテキストは、許可する必要がある文字の範囲が比較的大きいため、検証が難しいと見なされます。

また、自由形式テキスト入力は、適切なコンテキスト依存の出力エンコーディングの重要性を示し、入力検証が Cross-Site Scripting に対する主要な保護策では**ない**ことを明確に示します。ユーザーがコメント欄にアポストロフィ `'` や小なり記号 `<` を入力したい場合、完全に正当な理由があるかもしれません。アプリケーションの役割は、データのライフサイクル全体を通じてそれを適切に扱うことです。

自由形式テキスト入力に対する入力検証の主な手段は次のとおりです。

- **正規化:** テキスト全体で正準エンコーディングが使用され、無効な文字が存在しないことを確認します。
- **文字カテゴリの許可リスト化:** Unicode では、「10 進数字」や「文字」などのカテゴリを列挙できます。これにより、ラテンアルファベットだけでなく、世界中で使用されるさまざまな文字体系 (例: アラビア文字、キリル文字、CJK 表意文字など) も対象にできます。
- **個別文字の許可リスト化:** 名前で文字や表意文字を許可し、アイルランド系の名前のためにアポストロフィ `'` も許可したいが、句読点カテゴリ全体は許可したくない場合などに使います。

参考資料:

- [Input validation of free-form Unicode text in Python](https://web.archive.org/web/20170717174432/https://ipsec.pl/python/2017/input-validation-free-form-unicode-text-python.html/)
- [UAX 31: Unicode Identifier and Pattern Syntax](https://unicode.org/reports/tr31/)
- [UAX 15: Unicode Normalization Forms](https://www.unicode.org/reports/tr15/)
- [UAX 24: Unicode Script Property](https://unicode.org/reports/tr24/)

### 正規表現 (Regex)

正規表現の作成は複雑になり得るため、このチートシートの範囲を大きく超えます。

インターネット上には正規表現の書き方に関する多くのリソースがあります。この[サイト](https://www.regular-expressions.info/)や [OWASP Validation Regex Repository](https://owasp.org/www-community/OWASP_Validation_Regex_Repository) などがあります。

正規表現を設計するときは、[正規表現サービス拒否 (ReDoS) 攻撃](https://owasp.org/www-community/attacks/Regular_expression_Denial_of_Service_-_ReDoS)に注意してください。この攻撃は、設計の悪い正規表現を使用するプログラムを非常に遅く動作させ、長時間 CPU リソースを消費させます。

まとめると、入力検証は次のようにするべきです。

- 少なくとも、すべての入力データに適用する。
- 受け入れる文字の許可集合を定義する。
- データの最小長と最大長を定義する (例: `&#123;1,25&#125;`)。

## 許可リスト正規表現の例

米国 ZIP コード (5 桁と任意の -4) の検証

```text
^\d{5}(-\d{4})?$
```

ドロップダウンメニューからの米国州選択の検証

```text
^(AA|AE|AP|AL|AK|AS|AZ|AR|CA|CO|CT|DE|DC|FM|FL|GA|GU|
HI|ID|IL|IN|IA|KS|KY|LA|ME|MH|MD|MA|MI|MN|MS|MO|MT|NE|
NV|NH|NJ|NM|NY|NC|ND|MP|OH|OK|OR|PW|PA|PR|RI|SC|SD|TN|
TX|UT|VT|VI|VA|WA|WV|WI|WY)$
```

**Java 正規表現の使用例:**

正規表現を使用してパラメータ "zip" を検証する例です。

```java
private static final Pattern zipPattern = Pattern.compile("^\d{5}(-\d{4})?$");

public void doPost( HttpServletRequest request, HttpServletResponse response) {
  try {
      String zipCode = request.getParameter( "zip" );
      if ( !zipPattern.matcher( zipCode ).matches() ) {
          throw new YourValidationException( "Improper zipcode format." );
      }
      // do what you want here, after its been validated ..
  } catch(YourValidationException e ) {
      response.sendError( response.SC_BAD_REQUEST, e.getMessage() );
  }
}
```

利用できるように、さまざまなオープンソースパッケージでは、いくつかの許可リストバリデータもあらかじめ定義されています。例:

- [Apache Commons Validator](http://commons.apache.org/proper/commons-validator/)

## クライアント側検証とサーバー側検証

入力検証は、アプリケーション機能によってデータが処理される前に、サーバー側で実装することが**必須**です。クライアント側で実行される JavaScript ベースの入力検証は、攻撃者が JavaScript を無効にしたり Web プロキシを使用したりすることで回避できるためです。UX のためのクライアント側 JavaScript ベース検証と、セキュリティのためのサーバー側検証の両方を実装し、それぞれの強みを活用することが推奨されるアプローチです。

## リッチなユーザーコンテンツの検証

ユーザーが送信するリッチコンテンツを検証することは非常に困難です。詳細については、XSS チートシートの [Sanitizing HTML Markup with a Library Designed for the Job](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html) を参照してください。

## XSS と Content Security Policy の防止

悪意あるデータの実行 (例: XSS) を防ぐため、ユーザーが制御するすべてのデータは HTML ページに返す際にエンコードする必要があります。たとえば `<script>` は `&lt;script&gt;` として返されます。

エンコーディングの種類は、ユーザー制御データが挿入されるページ上のコンテキストに固有です。たとえば、HTML 本文に配置されるデータには HTML エンティティエンコーディングが適しています。一方、スクリプト内に配置されるユーザーデータには、JavaScript 固有の出力エンコーディングが必要です。

XSS 防止の詳細情報はこちら: [OWASP XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)

## ファイルアップロード検証

多くの Web サイトでは、プロフィール画像などのファイルをユーザーがアップロードできます。このセクションでは、その機能を安全に提供するための支援をします。

[File Upload Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html) を確認してください。

### アップロードの検証

- 入力検証を使用して、アップロードされたファイル名が想定される拡張子タイプを使用していることを確認します。
- アップロードされたファイルが、定義された最大ファイルサイズを超えていないことを確認します。
- Web サイトが ZIP ファイルアップロードに対応している場合は、ファイルを展開する前に検証チェックを行います。このチェックには、対象パス、圧縮レベル、推定展開サイズが含まれます。

### アップロードの保存

- OS 上でファイルを保存するには新しいファイル名を使用します。このファイル名や一時ファイル名に、ユーザーが制御するテキストを使用してはいけません。
- ファイルが Web にアップロードされる場合、保存時にファイル名を変更することが推奨されます。たとえば、アップロードされたファイル名が *test.JPG* であれば、ランダムなファイル名で *JAI1287uaisdjhf.JPG* に変更します。これを行う目的は、直接ファイルアクセスのリスクや、`test.jpg;.asp or /../../../../../test.jpg` のようなフィルタ回避のための曖昧なファイル名のリスクを防ぐことです。
- アップロードされたファイルは、悪意あるコンテンツ (アンチマルウェア、静的解析など) の分析対象にするべきです。
- クライアントがファイルパスを指定できてはいけません。ファイルパスはサーバーによって定義されるべきです。

### アップロードコンテンツの公開配信

- アップロードされた画像が、正しい content-type (例: `image/jpeg`、`application/x-xpinstall`) で配信されることを確認します。

### 特定のファイルタイプに注意

アップロード機能では、特定のファイルタイプと拡張子だけを許可する許可リストアプローチを使用するべきです。ただし、許可するとセキュリティ脆弱性につながる可能性がある次のファイルタイプに注意することが重要です。

- **crossdomain.xml** / **clientaccesspolicy.xml:** Flash、Java、Silverlight でのクロスドメインデータ読み込みを許可します。認証があるサイトで許可されると、クロスドメインのデータ窃取や CSRF 攻撃を許す可能性があります。対象プラグインの具体的なバージョンによってかなり複雑になる可能性があるため、"crossdomain.xml" または "clientaccesspolicy.xml" という名前のファイルは禁止するのが最善です。
- **.htaccess** と **.htpasswd:** ディレクトリ単位でサーバー設定オプションを提供するため、許可するべきではありません。[HTACCESS documentation](http://en.wikipedia.org/wiki/Htaccess) を参照してください。
- `aspx, asp, css, swf, xhtml, rhtml, shtml, jsp, js, pl, php, cgi` のような Web 実行可能スクリプトファイルは、許可しないことが推奨されます。

### 画像アップロード検証

- 画像書き換えライブラリを使用して、画像が有効であることを確認し、余分なコンテンツを取り除きます。
- 保存する画像の拡張子は、画像処理で検出された画像の content type に基づく有効な画像拡張子にします (例: アップロード時のヘッダーだけを信頼しない)。
- 検出された画像の content type が、定義済みの画像タイプ (jpg、PNG など) のリスト内にあることを確認します。

## メールアドレス検証

### 構文検証

メールアドレスの形式は [RFC 5321](https://tools.ietf.org/html/rfc5321#section-4.1.2) で定義されており、多くの人が認識しているよりもはるかに複雑です。例として、次のものはすべて有効なメールアドレスと見なされます。

- `"><script>alert(1);</script>"@example.org`
- `user+subaddress@example.org`
- `user@[IPv6:2001:db8::1]`
- `" "@example.org`

正規表現でメールアドレスの妥当性を正しく解析することは非常に複雑ですが、[公開されている正規表現に関する文書](https://datatracker.ietf.org/doc/html/draft-seantek-mail-regexen-03#rfc.section.3)はいくつかあります。

ここで最も大きな注意点は、RFC がメールアドレスに非常に柔軟な形式を定義している一方で、実世界の多くの実装 (メールサーバーなど) ははるかに制限されたアドレス形式を使用しているため、*技術的には*有効なアドレスを拒否することです。技術的には正しくても、アプリケーションが実際にメールを送信できなければ、それらのアドレスはほとんど役に立ちません。

したがって、メールアドレスを検証する最善の方法は、まず基本的な初期検証を行い、その後アドレスをメールサーバーに渡し、メールサーバーが拒否した場合は例外を捕捉することです。これにより、アプリケーションは、受け入れるすべてのアドレスにメールサーバーがメールを送信できると確信できます。初期検証は、次のような単純なものにできます。

- メールアドレスが `@` 記号で区切られた二つの部分を含む。
- メールアドレスが危険な文字 (バッククォート、シングルクォートまたはダブルクォート、null バイトなど) を含まない。
    - どの文字が危険かは、そのアドレスがどのように使用されるか (ページに表示される、データベースに挿入されるなど) によって異なります。
- ドメイン部分が、英字、数字、ハイフン (`-`)、ピリオド (`.`) だけを含む。
- メールアドレスが妥当な長さである。
    - ローカル部 (`@` の前) は 63 文字以下であるべきです。
    - 全体の長さは 254 文字以下であるべきです。

### 意味検証

意味検証は、メールアドレスが正しく正当なものかを判断することです。これを行う最も一般的な方法は、ユーザーにメールを送信し、そのメール内のリンクをクリックさせるか、送信されたコードを入力させることです。これにより、次のことについて基本的な保証が得られます。

- メールアドレスが正しい。
- アプリケーションがそのアドレスに正常にメールを送信できる。
- ユーザーがそのメールボックスにアクセスできる。

所有権を証明するためにユーザーへ送信されるリンクには、次のようなトークンを含めるべきです。

- 32 文字以上である。
- [安全な乱数源](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html#secure-random-number-generation)を使用して生成される。
- 1 回限り使用できる。
- 時間制限がある (例: 8 時間後に期限切れになる)。

メールアドレスの所有権を検証した後、ユーザーには通常の仕組みでアプリケーションに認証することを求めるべきです。

#### 使い捨てメールアドレス

場合によっては、ユーザーはアプリケーション登録時に実際のメールアドレスを提供したくないため、代わりに使い捨てメールアドレスを提供します。これらはユーザー認証を必要としない公開アドレスであり、通常、ユーザーの主要メールアドレスに届くスパム量を減らすために使用されます。

使い捨てメールアドレスをブロックすることはほぼ不可能です。これらのサービスを提供する Web サイトは大量にあり、新しいドメインが毎日作成されているためです。既知の使い捨てドメインの公開リストや商用リストはいくつかありますが、常に不完全です。

これらのリストを使用して使い捨てメールアドレスの利用をブロックする場合は、なぜブロックされたのかを説明するメッセージをユーザーに提示するべきです。ただし、ユーザーは正当なアドレスを提供するのではなく、別の使い捨てプロバイダを探す可能性が高いでしょう。

使い捨てメールアドレスをブロックすることが不可欠な場合は、明示的に許可されたメールプロバイダからの登録だけを許可するべきです。ただし、Google や Yahoo のような公開プロバイダを含める場合、ユーザーはそこで自分用の使い捨てアドレスを登録できてしまいます。

#### サブアドレッシング

サブアドレッシングでは、ユーザーがメールアドレスのローカル部 (`@` 記号の前) に*タグ*を指定できます。このタグはメールサーバーによって無視されます。たとえば、その `example.org` ドメインがサブアドレッシングに対応している場合、次のメールアドレスは同等です。

- `user@example.org`
- `user+site1@example.org`
- `user+site2@example.org`

多くのメールプロバイダ (Microsoft Exchange など) はサブアドレッシングに対応していません。対応している最も有名なプロバイダは Gmail ですが、ほかにも対応しているものは多数あります。

一部のユーザーは、登録する Web サイトごとに異なる*タグ*を使用します。これにより、あるサブアドレス宛てにスパムを受け取り始めた場合、どの Web サイトがメールアドレスを漏えいまたは販売したかを特定できます。

サブアドレッシングにより、ユーザーが一つのメールアドレスで複数アカウントを登録できる可能性があるため、一部のサイトでは `+` 記号と `@` 記号の間のすべてを取り除いてサブアドレッシングをブロックしたいと考える場合があります。これは一般には推奨されません。Web サイト所有者がサブアドレッシングを知らないか、メールアドレスを漏えいまたは販売したときにユーザーがそれを特定することを妨げたいと考えていることを示唆するためです。さらに、[使い捨てメールアドレス](#使い捨てメールアドレス)を使用するか、信頼できるプロバイダで複数のメールアカウントを登録するだけで簡単に回避できます。

</section>

<section id="input-validation-bilingual-panel" className="tabPanel bilingualPanel">

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

This article is focused on providing clear, simple, actionable guidance for providing Input Validation security functionality in your applications.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

この記事は、アプリケーションに入力検証のセキュリティ機能を提供するための、明確でシンプルかつ実行可能なガイダンスを示すことに焦点を当てています。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Goals of Input Validation

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 入力検証の目的

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Input validation is performed to ensure only properly formed data is entering the workflow in an information system, preventing malformed data from persisting in the database and triggering malfunction of various downstream components. Input validation should happen as early as possible in the data flow, preferably as soon as the data is received from the external party.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

入力検証は、情報システム内のワークフローに正しく形成されたデータだけが入るようにするために実施します。これにより、不正な形式のデータがデータベースに残ったり、後続のさまざまなコンポーネントの誤動作を引き起こしたりすることを防ぎます。入力検証は、データフローのできるだけ早い段階、できれば外部の相手からデータを受け取った直後に行うべきです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Data from all potentially untrusted sources should be subject to input validation, including not only Internet-facing web clients but also backend feeds over extranets, from [suppliers, partners, vendors or regulators](https://badcyber.com/several-polish-banks-hacked-information-stolen-by-unknown-attackers/), each of which may be compromised on their own and start sending malformed data.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

潜在的に信頼できないすべてのソースからのデータは入力検証の対象にするべきです。これにはインターネットに面した Web クライアントだけでなく、エクストラネット経由のバックエンドフィードや、[サプライヤー、パートナー、ベンダー、規制当局](https://badcyber.com/several-polish-banks-hacked-information-stolen-by-unknown-attackers/)からのデータも含まれます。それぞれが単独で侵害され、不正な形式のデータを送信し始める可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Input Validation should not be used as the *primary* method of preventing [XSS](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html), [SQL Injection](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html) and other attacks which are covered in respective [cheat sheets](https://cheatsheetseries.owasp.org/) but can significantly contribute to reducing their impact if implemented properly.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

入力検証は、[XSS](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)、[SQL インジェクション](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)、その他それぞれの[チートシート](https://cheatsheetseries.owasp.org/)で扱われている攻撃を防ぐための*主要な*方法として使うべきではありません。ただし、適切に実装されていれば、それらの影響を軽減するうえで大きく貢献できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Input Validation Strategies

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 入力検証戦略

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Input validation should be applied at both syntactic and semantic levels:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

入力検証は、構文レベルと意味レベルの両方で適用するべきです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- **Syntactic** validation should enforce correct syntax of structured fields (e.g. SSN, date, currency symbol).
- **Semantic** validation should enforce correctness of their *values* in the specific business context (e.g. start date is before end date, price is within expected range).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- **構文的**検証では、構造化フィールドの正しい構文を強制するべきです (例: SSN、日付、通貨記号)。
- **意味的**検証では、特定のビジネスコンテキストにおける*値*の正しさを強制するべきです (例: 開始日が終了日より前である、価格が想定範囲内である)。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

It is always recommended to prevent attacks as early as possible in the processing of the user's (attacker's) request. Input validation can be used to detect unauthorized input before it is processed by the application.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

ユーザー (攻撃者) のリクエスト処理では、できるだけ早い段階で攻撃を防ぐことが常に推奨されます。入力検証は、アプリケーションで処理される前に認可されていない入力を検出するために使用できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Implementing Input Validation

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 入力検証の実装

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Input validation can be implemented using any programming technique that allows effective enforcement of syntactic and semantic correctness, for example:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

入力検証は、構文的および意味的な正しさを効果的に強制できる任意のプログラミング技法で実装できます。たとえば次のようなものがあります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Data type validators available natively in web application frameworks (such as [Django Validators](https://docs.djangoproject.com/en/1.11/ref/validators/), [Apache Commons Validators](https://commons.apache.org/proper/commons-validator/apidocs/org/apache/commons/validator/package-summary.html#doc.Usage.validator) etc).
- Validation against [JSON Schema](http://json-schema.org/) and [XML Schema (XSD)](https://www.w3schools.com/xml/schema_intro.asp) for input in these formats.
- Type conversion (e.g. `Integer.parseInt()` in Java, `int()` in Python) with strict exception handling
- Minimum and maximum value range check for numerical parameters and dates, minimum and maximum length check for strings.
- Array of allowed values for small sets of string parameters (e.g. days of week).
- Regular expressions for any other structured data covering the whole input string `(^...$)` and **not** using "any character" wildcard (such as `.` or `\S`)
- Denylisting known dangerous patterns can be used as an additional layer of defense, but it should supplement - not replace - allowlisting, to help catch some commonly observed attacks or patterns without relying on it as the main validation method.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- Web アプリケーションフレームワークに標準で用意されているデータ型バリデータ (例: [Django Validators](https://docs.djangoproject.com/en/1.11/ref/validators/)、[Apache Commons Validators](https://commons.apache.org/proper/commons-validator/apidocs/org/apache/commons/validator/package-summary.html#doc.Usage.validator) など)。
- これらの形式の入力に対する [JSON Schema](http://json-schema.org/) や [XML Schema (XSD)](https://www.w3schools.com/xml/schema_intro.asp) による検証。
- 厳格な例外処理を伴う型変換 (例: Java の `Integer.parseInt()`、Python の `int()`)。
- 数値パラメータや日付に対する最小値および最大値の範囲チェック、文字列に対する最小長および最大長のチェック。
- 小さな集合の文字列パラメータに対する許可値の配列 (例: 曜日)。
- 入力文字列全体を対象とする正規表現 `(^...$)`。また、「任意の文字」ワイルドカード (`.` や `\S` など) は使用しません。
- 既知の危険なパターンの拒否リスト化は、追加の防御層として使用できます。ただし、一般的に観測される攻撃やパターンの一部を捕捉するために、許可リスト化を補完するものであり、置き換えるものではありません。主要な検証方法として依存してはいけません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Allowlist vs Denylist

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 許可リストと拒否リスト

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

It is a common mistake to use denylist validation in order to try to detect possibly dangerous characters and patterns like the apostrophe `'` character, the string `1=1`, or the `<script>` tag, but this is a massively flawed approach as it is trivial for an attacker to bypass such filters.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

アポストロフィ `'`、文字列 `1=1`、`<script>` タグのような、危険かもしれない文字やパターンを検出しようとして拒否リスト検証を使うのはよくある誤りです。しかし、この方法は攻撃者が簡単に回避できるため、根本的に欠陥があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Plus, such filters frequently prevent authorized input, like `O'Brian`, where the `'` character is fully legitimate. For more information on XSS filter evasion please see [this wiki page](https://owasp.org/www-community/xss-filter-evasion-cheatsheet).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

さらに、このようなフィルタは、`O'Brian` のように `'` 文字が完全に正当な入力である場合にも、認可された入力を妨げることがよくあります。XSS フィルタ回避の詳細については、[この wiki ページ](https://owasp.org/www-community/xss-filter-evasion-cheatsheet)を参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

While denylisting can be useful as an additional layer of defense to catch some common malicious patterns, it should not be relied upon as the primary method. Allowlisting remains the more robust and secure approach for preventing potentially harmful input.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

拒否リスト化は、一般的な悪意あるパターンの一部を捕捉する追加の防御層としては有用な場合がありますが、主要な方法として依存するべきではありません。潜在的に有害な入力を防ぐには、許可リスト化のほうがより堅牢で安全なアプローチです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Allowlist validation is appropriate for all input fields provided by the user. Allowlist validation involves defining exactly what IS authorized, and by definition, everything else is not authorized.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

許可リスト検証は、ユーザーが提供するすべての入力フィールドに適しています。許可リスト検証では、何が認可されるかを正確に定義します。定義上、それ以外のものは認可されません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

If it's well structured data, like dates, social security numbers, zip codes, email addresses, etc. then the developer should be able to define a very strong validation pattern, usually based on regular expressions, for validating such input.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

日付、社会保障番号、郵便番号、メールアドレスなどのように十分に構造化されたデータであれば、開発者は通常、正規表現に基づいて、その入力を検証するための非常に強い検証パターンを定義できるはずです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

If the input field comes from a fixed set of options, like a drop down list or radio buttons, then the input needs to match exactly one of the values offered to the user in the first place. Any failure to validate a value against this discrete list of options on the server side is a high security event and should be logged as a high severity event as it indicates that an attacker is tampering with the client-side code.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

入力フィールドがドロップダウンリストやラジオボタンのような固定された選択肢の集合から来る場合、その入力は、そもそもユーザーに提示された値のいずれか一つと正確に一致する必要があります。サーバー側でこの離散的な選択肢リストに対する値の検証に失敗した場合、それは攻撃者がクライアント側コードを改ざんしていることを示すため、重大度の高いセキュリティイベントとして扱い、高重大度イベントとしてログに記録するべきです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Validating Free-form Unicode Text

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 自由形式 Unicode テキストの検証

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Free-form text, especially with Unicode characters, is perceived as difficult to validate due to a relatively large space of characters that need to be allowed.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

自由形式テキスト、とくに Unicode 文字を含むテキストは、許可する必要がある文字の範囲が比較的大きいため、検証が難しいと見なされます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

It's also free-form text input that highlights the importance of proper context-aware output encoding and quite clearly demonstrates that input validation is **not** the primary safeguards against Cross-Site Scripting. If your users want to type apostrophe `'` or less-than sign `<` in their comment field, they might have perfectly legitimate reason for that and the application's job is to properly handle it throughout the whole life cycle of the data.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

また、自由形式テキスト入力は、適切なコンテキスト依存の出力エンコーディングの重要性を示し、入力検証が Cross-Site Scripting に対する主要な保護策では**ない**ことを明確に示します。ユーザーがコメント欄にアポストロフィ `'` や小なり記号 `<` を入力したい場合、完全に正当な理由があるかもしれません。アプリケーションの役割は、データのライフサイクル全体を通じてそれを適切に扱うことです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The primary means of input validation for free-form text input should be:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

自由形式テキスト入力に対する入力検証の主な手段は次のとおりです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- **Normalization:** Ensure canonical encoding is used across all the text and no invalid characters are present.
- **Character category allowlisting:** Unicode allows listing categories such as "decimal digits" or "letters" which not only covers the Latin alphabet but also various other scripts used globally (e.g. Arabic, Cyrillic, CJK ideographs etc).
- **Individual character allowlisting:** If you allow letters and ideographs in names and also want to allow apostrophe `'` for Irish names, but don't want to allow the whole punctuation category.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- **正規化:** テキスト全体で正準エンコーディングが使用され、無効な文字が存在しないことを確認します。
- **文字カテゴリの許可リスト化:** Unicode では、「10 進数字」や「文字」などのカテゴリを列挙できます。これにより、ラテンアルファベットだけでなく、世界中で使用されるさまざまな文字体系 (例: アラビア文字、キリル文字、CJK 表意文字など) も対象にできます。
- **個別文字の許可リスト化:** 名前で文字や表意文字を許可し、アイルランド系の名前のためにアポストロフィ `'` も許可したいが、句読点カテゴリ全体は許可したくない場合などに使います。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

References:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

参考資料:

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- [Input validation of free-form Unicode text in Python](https://web.archive.org/web/20170717174432/https://ipsec.pl/python/2017/input-validation-free-form-unicode-text-python.html/)
- [UAX 31: Unicode Identifier and Pattern Syntax](https://unicode.org/reports/tr31/)
- [UAX 15: Unicode Normalization Forms](https://www.unicode.org/reports/tr15/)
- [UAX 24: Unicode Script Property](https://unicode.org/reports/tr24/)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- [Input validation of free-form Unicode text in Python](https://web.archive.org/web/20170717174432/https://ipsec.pl/python/2017/input-validation-free-form-unicode-text-python.html/)
- [UAX 31: Unicode Identifier and Pattern Syntax](https://unicode.org/reports/tr31/)
- [UAX 15: Unicode Normalization Forms](https://www.unicode.org/reports/tr15/)
- [UAX 24: Unicode Script Property](https://unicode.org/reports/tr24/)

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Regular Expressions (Regex)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 正規表現 (Regex)

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Developing regular expressions can be complicated, and is well beyond the scope of this cheat sheet.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

正規表現の作成は複雑になり得るため、このチートシートの範囲を大きく超えます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

There are lots of resources on the internet about how to write regular expressions, including this [site](https://www.regular-expressions.info/) and the [OWASP Validation Regex Repository](https://owasp.org/www-community/OWASP_Validation_Regex_Repository).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

インターネット上には正規表現の書き方に関する多くのリソースがあります。この[サイト](https://www.regular-expressions.info/)や [OWASP Validation Regex Repository](https://owasp.org/www-community/OWASP_Validation_Regex_Repository) などがあります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

When designing regular expression, be aware of [RegEx Denial of Service (ReDoS) attacks](https://owasp.org/www-community/attacks/Regular_expression_Denial_of_Service_-_ReDoS). These attacks cause a program using a poorly designed Regular Expression to operate very slowly and utilize CPU resources for a very long time.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

正規表現を設計するときは、[正規表現サービス拒否 (ReDoS) 攻撃](https://owasp.org/www-community/attacks/Regular_expression_Denial_of_Service_-_ReDoS)に注意してください。この攻撃は、設計の悪い正規表現を使用するプログラムを非常に遅く動作させ、長時間 CPU リソースを消費させます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

In summary, input validation should:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

まとめると、入力検証は次のようにするべきです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Be applied to all input data, at minimum.
- Define the allowed set of characters to be accepted.
- Define a minimum and maximum length for the data (e.g. `&#123;1,25&#125;`).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- 少なくとも、すべての入力データに適用する。
- 受け入れる文字の許可集合を定義する。
- データの最小長と最大長を定義する (例: `&#123;1,25&#125;`)。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Allow List Regular Expression Examples

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 許可リスト正規表現の例

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Validating a U.S. Zip Code (5 digits plus optional -4)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

米国 ZIP コード (5 桁と任意の -4) の検証

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>


```text
^\d{5}(-\d{4})?$
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Validating U.S. State Selection From a Drop-Down Menu

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

ドロップダウンメニューからの米国州選択の検証

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>


```text
^(AA|AE|AP|AL|AK|AS|AZ|AR|CA|CO|CT|DE|DC|FM|FL|GA|GU|
HI|ID|IL|IN|IA|KS|KY|LA|ME|MH|MD|MA|MI|MN|MS|MO|MT|NE|
NV|NH|NJ|NM|NY|NC|ND|MP|OH|OK|OR|PW|PA|PR|RI|SC|SD|TN|
TX|UT|VT|VI|VA|WA|WV|WI|WY)$
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Java Regex Usage Example:**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**Java 正規表現の使用例:**

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Example validating the parameter "zip" using a regular expression.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

正規表現を使用してパラメータ "zip" を検証する例です。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>


```java
private static final Pattern zipPattern = Pattern.compile("^\d{5}(-\d{4})?$");

public void doPost( HttpServletRequest request, HttpServletResponse response) {
  try {
      String zipCode = request.getParameter( "zip" );
      if ( !zipPattern.matcher( zipCode ).matches() ) {
          throw new YourValidationException( "Improper zipcode format." );
      }
      // do what you want here, after its been validated ..
  } catch(YourValidationException e ) {
      response.sendError( response.SC_BAD_REQUEST, e.getMessage() );
  }
}
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Some Allowlist validators have also been predefined in various open source packages that you can leverage. For example:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

利用できるように、さまざまなオープンソースパッケージでは、いくつかの許可リストバリデータもあらかじめ定義されています。例:

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- [Apache Commons Validator](http://commons.apache.org/proper/commons-validator/)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- [Apache Commons Validator](http://commons.apache.org/proper/commons-validator/)

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Client-side vs Server-side Validation

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## クライアント側検証とサーバー側検証

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Input validation **must** be implemented on the server-side before any data is processed by an application’s functions, as any JavaScript-based input validation performed on the client-side can be circumvented by an attacker who disables JavaScript or uses a web proxy. Implementing both client-side JavaScript-based validation for UX and server-side validation for security is the recommended approach, leveraging each for their respective strengths.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

入力検証は、アプリケーション機能によってデータが処理される前に、サーバー側で実装することが**必須**です。クライアント側で実行される JavaScript ベースの入力検証は、攻撃者が JavaScript を無効にしたり Web プロキシを使用したりすることで回避できるためです。UX のためのクライアント側 JavaScript ベース検証と、セキュリティのためのサーバー側検証の両方を実装し、それぞれの強みを活用することが推奨されるアプローチです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Validating Rich User Content

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## リッチなユーザーコンテンツの検証

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

It is very difficult to validate rich content submitted by a user. For more information, please see the XSS cheat sheet on [Sanitizing HTML Markup with a Library Designed for the Job](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

ユーザーが送信するリッチコンテンツを検証することは非常に困難です。詳細については、XSS チートシートの [Sanitizing HTML Markup with a Library Designed for the Job](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html) を参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Preventing XSS and Content Security Policy

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## XSS と Content Security Policy の防止

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

All user data controlled must be encoded when returned in the HTML page to prevent the execution of malicious data (e.g. XSS). For example `<script>` would be returned as `&lt;script&gt;`

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

悪意あるデータの実行 (例: XSS) を防ぐため、ユーザーが制御するすべてのデータは HTML ページに返す際にエンコードする必要があります。たとえば `<script>` は `&lt;script&gt;` として返されます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The type of encoding is specific to the context of the page where the user controlled data is inserted. For example, HTML entity encoding is appropriate for data placed into the HTML body. However, user data placed into a script would need JavaScript specific output encoding.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

エンコーディングの種類は、ユーザー制御データが挿入されるページ上のコンテキストに固有です。たとえば、HTML 本文に配置されるデータには HTML エンティティエンコーディングが適しています。一方、スクリプト内に配置されるユーザーデータには、JavaScript 固有の出力エンコーディングが必要です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Detailed information on XSS prevention here: [OWASP XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

XSS 防止の詳細情報はこちら: [OWASP XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## File Upload Validation

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## ファイルアップロード検証

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Many websites allow users to upload files, such as a profile picture or more. This section helps provide that feature securely.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

多くの Web サイトでは、プロフィール画像などのファイルをユーザーがアップロードできます。このセクションでは、その機能を安全に提供するための支援をします。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Check the [File Upload Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

[File Upload Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html) を確認してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Upload Verification

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### アップロードの検証

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Use input validation to ensure the uploaded filename uses an expected extension type.
- Ensure the uploaded file is not larger than a defined maximum file size.
- If the website supports ZIP file upload, do a validation check before unzipping the file. The check includes the target path, level of compression, estimated unzip size.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- 入力検証を使用して、アップロードされたファイル名が想定される拡張子タイプを使用していることを確認します。
- アップロードされたファイルが、定義された最大ファイルサイズを超えていないことを確認します。
- Web サイトが ZIP ファイルアップロードに対応している場合は、ファイルを展開する前に検証チェックを行います。このチェックには、対象パス、圧縮レベル、推定展開サイズが含まれます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Upload Storage

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### アップロードの保存

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Use a new filename to store the file on the OS. Do not use any user controlled text for this filename or for the temporary filename.
- When the file is uploaded to web, it's suggested to rename the file on storage. For example, the uploaded filename is *test.JPG*, rename it to *JAI1287uaisdjhf.JPG* with a random filename. The purpose of doing it to prevent the risks of direct file access and ambiguous filename to evade the filter, such as `test.jpg;.asp or /../../../../../test.jpg`.
- Uploaded files should be analyzed for malicious content (anti-malware, static analysis, etc).
- The client should not be able to specify the file path; it should be defined by the server.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- OS 上でファイルを保存するには新しいファイル名を使用します。このファイル名や一時ファイル名に、ユーザーが制御するテキストを使用してはいけません。
- ファイルが Web にアップロードされる場合、保存時にファイル名を変更することが推奨されます。たとえば、アップロードされたファイル名が *test.JPG* であれば、ランダムなファイル名で *JAI1287uaisdjhf.JPG* に変更します。これを行う目的は、直接ファイルアクセスのリスクや、`test.jpg;.asp or /../../../../../test.jpg` のようなフィルタ回避のための曖昧なファイル名のリスクを防ぐことです。
- アップロードされたファイルは、悪意あるコンテンツ (アンチマルウェア、静的解析など) の分析対象にするべきです。
- クライアントがファイルパスを指定できてはいけません。ファイルパスはサーバーによって定義されるべきです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Public Serving of Uploaded Content

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### アップロードコンテンツの公開配信

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Ensure uploaded images are served with the correct content-type (e.g. `image/jpeg`, `application/x-xpinstall`)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- アップロードされた画像が、正しい content-type (例: `image/jpeg`、`application/x-xpinstall`) で配信されることを確認します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Beware of Specific File Types

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 特定のファイルタイプに注意

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The upload feature should be using an allowlist approach to only allow specific file types and extensions. However, it is important to be aware of the following file types that, if allowed, could result in security vulnerabilities:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

アップロード機能では、特定のファイルタイプと拡張子だけを許可する許可リストアプローチを使用するべきです。ただし、許可するとセキュリティ脆弱性につながる可能性がある次のファイルタイプに注意することが重要です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- **crossdomain.xml** / **clientaccesspolicy.xml:** allows cross-domain data loading in Flash, Java and Silverlight. If permitted on sites with authentication this can permit cross-domain data theft and CSRF attacks. Note this can get pretty complicated depending on the specific plugin version in question, so its best to just prohibit files named "crossdomain.xml" or "clientaccesspolicy.xml".
- **.htaccess** and **.htpasswd:** Provides server configuration options on a per-directory basis, and should not be permitted. See [HTACCESS documentation](http://en.wikipedia.org/wiki/Htaccess).
- Web executable script files are suggested not to be allowed such as `aspx, asp, css, swf, xhtml, rhtml, shtml, jsp, js, pl, php, cgi`.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- **crossdomain.xml** / **clientaccesspolicy.xml:** Flash、Java、Silverlight でのクロスドメインデータ読み込みを許可します。認証があるサイトで許可されると、クロスドメインのデータ窃取や CSRF 攻撃を許す可能性があります。対象プラグインの具体的なバージョンによってかなり複雑になる可能性があるため、"crossdomain.xml" または "clientaccesspolicy.xml" という名前のファイルは禁止するのが最善です。
- **.htaccess** と **.htpasswd:** ディレクトリ単位でサーバー設定オプションを提供するため、許可するべきではありません。[HTACCESS documentation](http://en.wikipedia.org/wiki/Htaccess) を参照してください。
- `aspx, asp, css, swf, xhtml, rhtml, shtml, jsp, js, pl, php, cgi` のような Web 実行可能スクリプトファイルは、許可しないことが推奨されます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Image Upload Verification

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 画像アップロード検証

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Use image rewriting libraries to verify the image is valid and to strip away extraneous content.
- Set the extension of the stored image to be a valid image extension based on the detected content type of the image from image processing (e.g. do not just trust the header from the upload).
- Ensure the detected content type of the image is within a list of defined image types (jpg, PNG, etc)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- 画像書き換えライブラリを使用して、画像が有効であることを確認し、余分なコンテンツを取り除きます。
- 保存する画像の拡張子は、画像処理で検出された画像の content type に基づく有効な画像拡張子にします (例: アップロード時のヘッダーだけを信頼しない)。
- 検出された画像の content type が、定義済みの画像タイプ (jpg、PNG など) のリスト内にあることを確認します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Email Address Validation

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## メールアドレス検証

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Syntactic Validation

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 構文検証

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The format of email addresses is defined by [RFC 5321](https://tools.ietf.org/html/rfc5321#section-4.1.2), and is far more complicated than most people realise. As an example, the following are all considered to be valid email addresses:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

メールアドレスの形式は [RFC 5321](https://tools.ietf.org/html/rfc5321#section-4.1.2) で定義されており、多くの人が認識しているよりもはるかに複雑です。例として、次のものはすべて有効なメールアドレスと見なされます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- `"><script>alert(1);</script>"@example.org`
- `user+subaddress@example.org`
- `user@[IPv6:2001:db8::1]`
- `" "@example.org`

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- `"><script>alert(1);</script>"@example.org`
- `user+subaddress@example.org`
- `user@[IPv6:2001:db8::1]`
- `" "@example.org`

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Properly parsing email addresses for validity with regular expressions is very complicated, although there are a number of [publicly available documents on regex](https://datatracker.ietf.org/doc/html/draft-seantek-mail-regexen-03#rfc.section.3).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

正規表現でメールアドレスの妥当性を正しく解析することは非常に複雑ですが、[公開されている正規表現に関する文書](https://datatracker.ietf.org/doc/html/draft-seantek-mail-regexen-03#rfc.section.3)はいくつかあります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The biggest caveat on this is that although the RFC defines a very flexible format for email addresses, most real world implementations (such as mail servers) use a far more restricted address format, meaning that they will reject addresses that are *technically* valid.  Although they may be technically correct, these addresses are of little use if your application will not be able to actually send emails to them.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

ここで最も大きな注意点は、RFC がメールアドレスに非常に柔軟な形式を定義している一方で、実世界の多くの実装 (メールサーバーなど) ははるかに制限されたアドレス形式を使用しているため、*技術的には*有効なアドレスを拒否することです。技術的には正しくても、アプリケーションが実際にメールを送信できなければ、それらのアドレスはほとんど役に立ちません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

As such, the best way to validate email addresses is to perform some basic initial validation, and then pass the address to the mail server and catch the exception if it rejects it. This means that the application can be confident that its mail server can send emails to any addresses it accepts. The initial validation could be as simple as:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

したがって、メールアドレスを検証する最善の方法は、まず基本的な初期検証を行い、その後アドレスをメールサーバーに渡し、メールサーバーが拒否した場合は例外を捕捉することです。これにより、アプリケーションは、受け入れるすべてのアドレスにメールサーバーがメールを送信できると確信できます。初期検証は、次のような単純なものにできます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- The email address contains two parts, separated with an `@` symbol.
- The email address does not contain dangerous characters (such as backticks, single or double quotes, or null bytes).
    - Exactly which characters are dangerous will depend on how the address is going to be used (echoed in page, inserted into database, etc).
- The domain part contains only letters, numbers, hyphens (`-`) and periods (`.`).
- The email address is a reasonable length:
    - The local part (before the `@`) should be no more than 63 characters.
    - The total length should be no more than 254 characters.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- メールアドレスが `@` 記号で区切られた二つの部分を含む。
- メールアドレスが危険な文字 (バッククォート、シングルクォートまたはダブルクォート、null バイトなど) を含まない。
    - どの文字が危険かは、そのアドレスがどのように使用されるか (ページに表示される、データベースに挿入されるなど) によって異なります。
- ドメイン部分が、英字、数字、ハイフン (`-`)、ピリオド (`.`) だけを含む。
- メールアドレスが妥当な長さである。
    - ローカル部 (`@` の前) は 63 文字以下であるべきです。
    - 全体の長さは 254 文字以下であるべきです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Semantic Validation

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 意味検証

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Semantic validation is about determining whether the email address is correct and legitimate. The most common way to do this is to send an email to the user, and require that they click a link in the email, or enter a code that has been sent to them. This provides a basic level of assurance that:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

意味検証は、メールアドレスが正しく正当なものかを判断することです。これを行う最も一般的な方法は、ユーザーにメールを送信し、そのメール内のリンクをクリックさせるか、送信されたコードを入力させることです。これにより、次のことについて基本的な保証が得られます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- The email address is correct.
- The application can successfully send emails to it.
- The user has access to the mailbox.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- メールアドレスが正しい。
- アプリケーションがそのアドレスに正常にメールを送信できる。
- ユーザーがそのメールボックスにアクセスできる。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The links that are sent to users to prove ownership should contain a token that is:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

所有権を証明するためにユーザーへ送信されるリンクには、次のようなトークンを含めるべきです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- At least 32 characters long.
- Generated using a [secure source of randomness](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html#secure-random-number-generation).
- Single use.
- Time limited (e.g, expiring after eight hours).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- 32 文字以上である。
- [安全な乱数源](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html#secure-random-number-generation)を使用して生成される。
- 1 回限り使用できる。
- 時間制限がある (例: 8 時間後に期限切れになる)。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

After validating the ownership of the email address, the user should then be required to authenticate on the application through the usual mechanism.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

メールアドレスの所有権を検証した後、ユーザーには通常の仕組みでアプリケーションに認証することを求めるべきです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Disposable Email Addresses

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 使い捨てメールアドレス

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

In some cases, users may not want to give their real email address when registering on the application, and will instead provide a disposable email address. These are publicly available addresses that do not require the user to authenticate, and are typically used to reduce the amount of spam received by users' primary email addresses.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

場合によっては、ユーザーはアプリケーション登録時に実際のメールアドレスを提供したくないため、代わりに使い捨てメールアドレスを提供します。これらはユーザー認証を必要としない公開アドレスであり、通常、ユーザーの主要メールアドレスに届くスパム量を減らすために使用されます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Blocking disposable email addresses is almost impossible, as there are a large number of websites offering these services, with new domains being created every day. There are a number of publicly available lists and commercial lists of known disposable domains, but these will always be incomplete.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

使い捨てメールアドレスをブロックすることはほぼ不可能です。これらのサービスを提供する Web サイトは大量にあり、新しいドメインが毎日作成されているためです。既知の使い捨てドメインの公開リストや商用リストはいくつかありますが、常に不完全です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

If these lists are used to block the use of disposable email addresses then the user should be presented with a message explaining why they are blocked (although they are likely to simply search for another disposable provider rather than giving their legitimate address).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

これらのリストを使用して使い捨てメールアドレスの利用をブロックする場合は、なぜブロックされたのかを説明するメッセージをユーザーに提示するべきです。ただし、ユーザーは正当なアドレスを提供するのではなく、別の使い捨てプロバイダを探す可能性が高いでしょう。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

If it is essential that disposable email addresses are blocked, then registrations should only be allowed from specifically-allowed email providers. However, if this includes public providers such as Google or Yahoo, users can simply register their own disposable address with them.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

使い捨てメールアドレスをブロックすることが不可欠な場合は、明示的に許可されたメールプロバイダからの登録だけを許可するべきです。ただし、Google や Yahoo のような公開プロバイダを含める場合、ユーザーはそこで自分用の使い捨てアドレスを登録できてしまいます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Sub-Addressing

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### サブアドレッシング

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Sub-addressing allows a user to specify a *tag* in the local part of the email address (before the `@` sign), which will be ignored by the mail server. For example, if that `example.org` domain supports sub-addressing, then the following email addresses are equivalent:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

サブアドレッシングでは、ユーザーがメールアドレスのローカル部 (`@` 記号の前) に*タグ*を指定できます。このタグはメールサーバーによって無視されます。たとえば、その `example.org` ドメインがサブアドレッシングに対応している場合、次のメールアドレスは同等です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- `user@example.org`
- `user+site1@example.org`
- `user+site2@example.org`

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- `user@example.org`
- `user+site1@example.org`
- `user+site2@example.org`

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Many mail providers (such as Microsoft Exchange) do not support sub-addressing. The most notable provider who does is Gmail, although there are many others that also do.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

多くのメールプロバイダ (Microsoft Exchange など) はサブアドレッシングに対応していません。対応している最も有名なプロバイダは Gmail ですが、ほかにも対応しているものは多数あります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Some users will use a different *tag* for each website they register on, so that if they start receiving spam to one of the sub-addresses they can identify which website leaked or sold their email address.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

一部のユーザーは、登録する Web サイトごとに異なる*タグ*を使用します。これにより、あるサブアドレス宛てにスパムを受け取り始めた場合、どの Web サイトがメールアドレスを漏えいまたは販売したかを特定できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Because it could allow users to register multiple accounts with a single email address, some sites may wish to block sub-addressing by stripping out everything between the `+` and `@` signs. This is not generally recommended, as it suggests that the website owner is either unaware of sub-addressing or wishes to prevent users from identifying them when they leak or sell email addresses. Additionally, it can be trivially bypassed by using [disposable email addresses](#disposable-email-addresses), or simply registering multiple email accounts with a trusted provider.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

サブアドレッシングにより、ユーザーが一つのメールアドレスで複数アカウントを登録できる可能性があるため、一部のサイトでは `+` 記号と `@` 記号の間のすべてを取り除いてサブアドレッシングをブロックしたいと考える場合があります。これは一般には推奨されません。Web サイト所有者がサブアドレッシングを知らないか、メールアドレスを漏えいまたは販売したときにユーザーがそれを特定することを妨げたいと考えていることを示唆するためです。さらに、[使い捨てメールアドレス](#使い捨てメールアドレス)を使用するか、信頼できるプロバイダで複数のメールアカウントを登録するだけで簡単に回避できます。

</div>
</div>

</section>
</div>

## References

<div className="referenceFooter">

- [OWASP Top 10 Proactive Controls 2024: C3: Validate all Input & Handle Exceptions](https://top10proactive.owasp.org/the-top-10/c3-validate-input-and-handle-exceptions)
- [CWE-20 Improper Input Validation](https://cwe.mitre.org/data/definitions/20.html)
- [OWASP Top 10 2021: A03:2021-Injection](https://owasp.org/Top10/A03_2021-Injection/)
- [Snyk: Improper Input Validation](https://learn.snyk.io/lesson/improper-input-validation/)

</div>


## Attribution

<div className="attributionFooter">

- Original: Input Validation Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: English original retained for comparison. Japanese translation added. Bilingual display generated from official source and local Japanese translation.
- Retrieved: 2026-05-21

</div>
