# SSRF防止チートシート 日本語訳

## Attribution

- Original: Server Side Request Forgery Prevention Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-21

## 日本語訳

## はじめに

このチートシートの目的は、[Server Side Request Forgery](https://www.acunetix.com/blog/articles/server-side-request-forgery-vulnerability/) (SSRF) 攻撃に対する防御について助言を提供することです。

このチートシートは防御側の観点に焦点を当て、この攻撃の実行方法は説明しません。セキュリティ研究者 [Orange Tsai](https://twitter.com/orange_8361) によるこの[講演](https://cheatsheetseries.owasp.org/assets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet_Orange_Tsai_Talk.pdf)と、この[ドキュメント](https://cheatsheetseries.owasp.org/assets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet_SSRF_Bible.pdf)では、この種の攻撃を実行するための技法が説明されています。

## コンテキスト

SSRF は、アプリケーションを悪用して内部または外部ネットワーク、あるいはマシン自身と通信させる攻撃ベクトルです。このベクトルを可能にする要因の一つは URL の不適切な取り扱いであり、次の例に示されています。

- 外部サーバー上の画像。たとえば、ユーザーがアバター画像の URL を入力し、アプリケーションがそれをダウンロードして使用する場合。
- カスタム [WebHook](https://en.wikipedia.org/wiki/Webhook)。ユーザーが Webhook ハンドラーやコールバック URL を指定する必要がある場合。
- 特定の機能を提供するために別のサービスと通信する内部リクエスト。多くの場合、処理のためにユーザーデータも一緒に送信され、不適切に処理されると特定のインジェクション攻撃を実行できることがあります。

## SSRF の一般的なフローの概要

![SSRF Common Flow](https://cheatsheetseries.owasp.org/assets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet_SSRF_Common_Flow.png)

*注記:*

- SSRF は HTTP プロトコルに限定されません。一般に最初のリクエストは HTTP ですが、アプリケーション自身が二つ目のリクエストを実行する場合、別のプロトコル (*例:* FTP, SMB, SMTP など) やスキーム (*例:* `file://`, `phar://`, `gopher://`, `data://`, `dict://` など) が使われることがあります。
- アプリケーションが [XML eXternal Entity (XXE) インジェクション](https://portswigger.net/web-security/xxe)に脆弱な場合、それを悪用して [SSRF 攻撃](https://portswigger.net/web-security/xxe#exploiting-xxe-to-perform-ssrf-attacks)を実行できます。XXE への露出を防ぐ方法については、[XXE チートシート](https://cheatsheetseries.owasp.org/cheatsheets/XML_External_Entity_Prevention_Cheat_Sheet.html)を参照してください。

## ケース

アプリケーションの機能と要件によって、SSRF が発生し得る基本的なケースは二つあります。

- アプリケーションが**識別済みで信頼されたアプリケーション**にのみリクエストを送信できる場合: [許可リスト](https://en.wikipedia.org/wiki/Whitelisting)方式を利用できるケース。
- アプリケーションが**任意の外部 IP アドレスまたはドメイン名**にリクエストを送信できる場合: [許可リスト](https://en.wikipedia.org/wiki/Whitelisting)方式を利用できないケース。

この二つのケースは大きく異なるため、このチートシートではそれぞれに対する防御を分けて説明します。

### ケース 1 - アプリケーションが識別済みで信頼されたアプリケーションにのみリクエストを送信できる

アプリケーションは、特定のタスクを実行するために、多くの場合別のネットワーク上にある別のアプリケーションへリクエストを実行する必要があります。業務上のケースによっては、その機能を動作させるためにユーザー入力が必要です。

#### 例

> たとえば、ユーザーの名、姓、生年月日などの個人情報を受け取り、それを使用して内部 HR システムにプロフィールを作成する Web アプリケーションを考えます。設計上、その Web アプリケーションは HR システムが理解できるプロトコルを使って通信し、そのデータを処理させる必要があります。
> 基本的に、ユーザーは HR システムへ直接到達できません。しかし、ユーザー情報を受け取る Web アプリケーションが SSRF に脆弱であれば、ユーザーはそのアプリケーションを利用して HR システムへアクセスできます。
> ユーザーは、その Web アプリケーションを HR システムへのプロキシとして利用します。

*VulnerableApplication* から呼び出される内部アプリケーションは技術的または業務上のフローで明確に識別されているため、許可リスト方式は有効な選択肢です。必要な呼び出しは、それら識別済みで信頼されたアプリケーション間のみを対象とすると言えます。

#### 利用可能な防御策

**アプリケーション**層と**ネットワーク**層で複数の防御策を適用できます。**多層防御**の原則を適用するため、両方の層をこの種の攻撃に対して強化します。

##### アプリケーション層

最初に思い浮かぶ防御レベルは[入力検証](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)です。

この点から、次の疑問が生じます。*この入力検証をどのように実行するか?*

[Orange Tsai](https://twitter.com/orange_8361) が自身の[講演](https://cheatsheetseries.owasp.org/assets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet_Orange_Tsai_Talk.pdf)で示しているように、使用するプログラミング言語によってはパーサーが悪用される可能性があります。一つの対策は、入力検証で[許可リスト方式](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html#allow-list-vs-block-list)を適用することです。多くの場合、ユーザーから期待される情報の形式は全体として既知だからです。

内部アプリケーションへ送信されるリクエストは、次の情報に基づきます。

- 業務データを含む文字列。
- IP アドレス (V4 または V6)。
- ドメイン名。
- URL。

**注記:** この[ドキュメント](https://cheatsheetseries.owasp.org/assets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet_SSRF_Bible.pdf)の `Exploitation tricks > Bypassing restrictions > Input validation > Unsafe redirect` セクションで説明されている入力検証のバイパスを防ぐため、使用する Web クライアントで[リダイレクト](https://developer.mozilla.org/en-US/docs/Web/HTTP/Redirections)追従のサポートを無効化してください。

###### 文字列

SSRF の文脈では、入力文字列が期待される業務的または技術的な形式に従っていることを確認する検証を追加できます。

入力データが単純な形式 (*例:* トークン、郵便番号など) の場合、セキュリティの観点で受信データが有効であることを保証するために[正規表現](https://www.regular-expressions.info/)を使用できます。それ以外の場合、複雑な形式に対する正規表現は保守が難しく、非常にエラーを起こしやすいため、`string` オブジェクトで利用できるライブラリを使って検証すべきです。

ユーザー入力はネットワークに関連しないものと想定され、ユーザーの個人情報で構成されます。

例:

```java
//Regex validation for a data having a simple format
if(Pattern.matches("[a-zA-Z0-9\\s\\-]{1,50}", userInput)){
    //Continue the processing because the input data is valid
}else{
    //Stop the processing and reject the request
}
```bash

###### IP アドレス

SSRF の文脈では、実行すべき検証が二つあります。

1. 提供されたデータが有効な IPv4 または IPv6 アドレスであることを確認する。
2. 提供された IP アドレスが、識別済みで信頼されたアプリケーションの IP アドレスのいずれかに属することを確認する。

最初の検証層は、使用する技術に基づき、IP アドレス形式の安全性を保証するライブラリを使って適用できます。ここではライブラリという選択肢を提案しています。IP アドレス形式の取り扱いを委譲し、実戦で鍛えられた検証関数を活用するためです。

> 提案するライブラリについては、この[記事](https://medium.com/@vickieli/bypassing-ssrf-protection-e111ae70727b)で説明されているバイパス (Hex, Octal, Dword, URL, Mixed encoding) への露出に関して検証されています。

- **JAVA:** [Apache Commons Validator](http://commons.apache.org/proper/commons-validator/) ライブラリの [InetAddressValidator.isValid](http://commons.apache.org/proper/commons-validator/apidocs/org/apache/commons/validator/routines/InetAddressValidator.html#isValid(java.lang.String)) メソッド。
    - Hex, Octal, Dword, URL, Mixed encoding を使ったバイパスには**露出していません**。
- **.NET**: SDK の [IPAddress.TryParse](https://docs.microsoft.com/en-us/dotnet/api/system.net.ipaddress.tryparse?view=netframework-4.8) メソッド。
    - Hex, Octal, Dword, Mixed encoding を使ったバイパスには**露出しています**が、URL encoding には**露出していません**。
    - ここでは許可リストを使用するため、いかなるバイパス試行も、許可された IP アドレスリストとの比較時にブロックされます。
- **JavaScript**: [ip-address](https://www.npmjs.com/package/ip-address) ライブラリ。
    - Hex, Octal, Dword, URL, Mixed encoding を使ったバイパスには**露出していません**。
- **Ruby**: SDK の [IPAddr](https://ruby-doc.org/stdlib-2.0.0/libdoc/ipaddr/rdoc/IPAddr.html) クラス。
    - Hex, Octal, Dword, URL, Mixed encoding を使ったバイパスには**露出していません**。

> **許可リストと比較する IP アドレスとして、メソッドまたはライブラリの出力値を使用してください。**

受信 IP アドレスの有効性を確認した後、二つ目の検証層を適用します。識別済みで信頼されたアプリケーションのすべての IP アドレス (バイパスを避けるため v4 と v6 の両方) を特定したうえで許可リストを作成します。有効な IP は、そのリストと照合され、内部アプリケーションとの通信が許可されることを確認します (大文字小文字を区別する文字列の厳密比較)。

###### ドメイン名

ドメイン名を検証しようとすると、その存在を確認するために DNS 解決を行いたくなります。一般には悪い考えではありませんが、ドメイン名解決に使用する DNS サーバーの設定によっては、アプリケーションを攻撃にさらすことになります。

- 外部 DNS リゾルバーに情報を開示する可能性があります。
- 攻撃者が正当なドメイン名を内部 IP アドレスに紐付けるために使用できます。この[ドキュメント](https://cheatsheetseries.owasp.org/assets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet_SSRF_Bible.pdf)の `Exploitation tricks > Bypassing restrictions > Input validation > DNS pinning` セクションを参照してください。
- 攻撃者は、内部 DNS リゾルバーや、アプリケーションが DNS 通信を扱うために使用する API (SDK またはサードパーティ) に悪意あるペイロードを送り込み、これらコンポーネントのいずれかの脆弱性を引き起こす可能性があります。

SSRF の文脈では、実行すべき検証が二つあります。

1. 提供されたデータが有効なドメイン名であることを確認する。
2. 提供されたドメイン名が、識別済みで信頼されたアプリケーションのドメイン名のいずれかに属することを確認する (ここで許可リストが機能します)。

IP アドレス検証と同様に、最初の検証層は、使用する技術に基づき、ドメイン名形式の安全性を保証するライブラリを使って適用できます。ここではライブラリという選択肢を提案しています。ドメイン名形式の取り扱いを委譲し、実戦で鍛えられた検証関数を活用するためです。

> 提案するライブラリについては、提案する関数が DNS 解決クエリを実行しないことを確認するために検証されています。

- **JAVA:** [Apache Commons Validator](http://commons.apache.org/proper/commons-validator/) ライブラリの [DomainValidator.isValid](https://commons.apache.org/proper/commons-validator/apidocs/org/apache/commons/validator/routines/DomainValidator.html#isValid(java.lang.String)) メソッド。
- **.NET**: SDK の [Uri.CheckHostName](https://docs.microsoft.com/en-us/dotnet/api/system.uri.checkhostname?view=netframework-4.8) メソッド。
- **JavaScript**: [is-valid-domain](https://www.npmjs.com/package/is-valid-domain) ライブラリ。
- **Python**: [validators.domain](https://validators.readthedocs.io/en/latest/#module-validators.domain) モジュール。
- **Ruby**: 有効な専用 gem は見つかっていません。
    - [domainator](https://github.com/mhuggins/domainator)、[public_suffix](https://github.com/weppos/publicsuffix-ruby)、[addressable](https://github.com/sporkmonger/addressable) はテストされていますが、残念ながらいずれも `<script>alert(1)</script>.owasp.org` を有効なドメイン名と見なします。
    - [こちら](https://stackoverflow.com/a/26987741)から取得した次の正規表現を使用できます: `^(((?!-))(xn--|_{1,1})?[a-z0-9-]{0,61}[a-z0-9]{1,1}\.)*(xn--)?([a-z0-9][a-z0-9\-]{0,60}|[a-z0-9-]{1,30}\.[a-z]{2,})$`

Ruby で提案された正規表現を実行する例:

```ruby
domain_names = ["owasp.org","owasp-test.org","doc-test.owasp.org","doc.owasp.org",
                "<script>alert(1)</script>","<script>alert(1)</script>.owasp.org"]
domain_names.each { |domain_name|
    if ( domain_name =~ /^(((?!-))(xn--|_{1,1})?[a-z0-9-]{0,61}[a-z0-9]{1,1}\.)*(xn--)?([a-z0-9][a-z0-9\-]{0,60}|[a-z0-9-]{1,30}\.[a-z]{2,})$/ )
        puts "[i] #{domain_name} is VALID"
    else
        puts "[!] #{domain_name} is INVALID"
    end
}
```bash

```bash
$ ruby test.rb
[i] owasp.org is VALID
[i] owasp-test.org is VALID
[i] doc-test.owasp.org is VALID
[i] doc.owasp.org is VALID
[!] <script>alert(1)</script> is INVALID
[!] <script>alert(1)</script>.owasp.org is INVALID
```text

受信ドメイン名の有効性を確認した後、二つ目の検証層を適用します。

1. 識別済みで信頼されたすべてのアプリケーションのすべてのドメイン名で許可リストを構築する。
2. 受信したドメイン名がこの許可リストの一部であることを確認する (大文字小文字を区別する文字列の厳密比較)。

残念ながら、この時点でもアプリケーションは、この[ドキュメント](https://cheatsheetseries.owasp.org/assets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet_SSRF_Bible.pdf)で言及されている `DNS pinning` バイパスに対して脆弱です。実際、業務コードが実行されるときに DNS 解決が行われます。この問題に対処するため、ドメイン名の検証に加えて、次の対応を実施する必要があります。

1. 組織に属するドメインが、DNS リゾルバーのチェーンで最初に内部 DNS サーバーによって解決されることを確認する。
2. ドメイン許可リストを監視し、そのいずれかが次のものに解決される場合を検出する。
   - ローカル IP アドレス (V4 + V6)。
   - 組織に属さないドメインについて、組織の内部 IP (プライベート IP 範囲内であることが期待されるもの)。

上記の監視の出発点として、次の Python3 スクリプトを使用できます。

```python
# Dependencies: pip install ipaddress dnspython
import ipaddress
import dns.resolver

# Configure the allowlist to check
DOMAINS_ALLOWLIST = ["owasp.org", "labslinux"]

# Configure the DNS resolver to use for all DNS queries
DNS_RESOLVER = dns.resolver.Resolver()
DNS_RESOLVER.nameservers = ["1.1.1.1"]

def verify_dns_records(domain, records, type):
    """
    Verify if one of the DNS records resolve to a non public IP address.
    Return a boolean indicating if any error has been detected.
    """
    error_detected = False
    if records is not None:
        for record in records:
            value = record.to_text().strip()
            try:
                ip = ipaddress.ip_address(value)
                # See https://docs.python.org/3/library/ipaddress.html#ipaddress.IPv4Address.is_global
                if not ip.is_global:
                    print("[!] DNS record type '%s' for domain name '%s' resolve to
                    a non public IP address '%s'!" % (type, domain, value))
                    error_detected = True
            except ValueError:
                error_detected = True
                print("[!] '%s' is not valid IP address!" % value)
    return error_detected

def check():
    """
    Perform the check of the allowlist of domains.
    Return a boolean indicating if any error has been detected.
    """
    error_detected = False
    for domain in DOMAINS_ALLOWLIST:
        # Get the IPs of the current domain
        # See https://en.wikipedia.org/wiki/List_of_DNS_record_types
        try:
            # A = IPv4 address record
            ip_v4_records = DNS_RESOLVER.query(domain, "A")
        except Exception as e:
            ip_v4_records = None
            print("[i] Cannot get A record for domain '%s': %s\n" % (domain,e))
        try:
            # AAAA = IPv6 address record
            ip_v6_records = DNS_RESOLVER.query(domain, "AAAA")
        except Exception as e:
            ip_v6_records = None
            print("[i] Cannot get AAAA record for domain '%s': %s\n" % (domain,e))
        # Verify the IPs obtained
        if verify_dns_records(domain, ip_v4_records, "A")
        or verify_dns_records(domain, ip_v6_records, "AAAA"):
            error_detected = True
    return error_detected

if __name__== "__main__":
    if check():
        exit(1)
    else:
        exit(0)
```bash

###### URL

完全な URL は検証が難しく、使用する技術によっては、[Orange Tsai](https://twitter.com/orange_8361) のこの[講演](https://cheatsheetseries.owasp.org/assets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet_Orange_Tsai_Talk.pdf)で示されているようにパーサーが悪用される可能性があるため、ユーザーから完全な URL を受け入れないでください。

ネットワーク関連情報が本当に必要な場合は、有効な IP アドレスまたはドメイン名のみを受け入れてください。

##### ネットワーク層

ネットワーク層セキュリティの目的は、*VulnerableApplication* が任意のアプリケーションへ呼び出しを実行することを防ぐことです。このアプリケーションが通信すべき相手のみにネットワークアクセスを制限するため、許可された*ルート*だけを利用可能にします。

ここでは、専用デバイスとしての Firewall コンポーネント、またはオペレーティングシステムが提供する Firewall コンポーネントを使用して、正当なフローを定義します。

下の図では、Firewall コンポーネントを活用してアプリケーションのアクセスを制限し、その結果として SSRF に脆弱なアプリケーションの影響を制限しています。

![Case 1 for Network layer protection about flows that we want to prevent](https://cheatsheetseries.owasp.org/assets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet_Case1_NetworkLayer_PreventFlow.png)

[ネットワーク分離](https://www.mwrinfosecurity.com/our-thinking/making-the-case-for-network-segregation)も活用できます。この一連の[実装上の助言](https://www.cyber.gov.au/acsc/view-all-content/publications/implementing-network-segmentation-and-segregation)を参照してください。また、**不正な呼び出しをネットワークレベル自体で直接ブロックするために強く推奨されます**。

### ケース 2 - アプリケーションが任意の外部 IP アドレスまたはドメイン名にリクエストを送信できる

このケースは、ユーザーが**外部**リソースへの URL を制御でき、アプリケーションがその URL へリクエストを実行する場合に発生します (*例:* [WebHooks](https://en.wikipedia.org/wiki/Webhook) の場合)。IP やドメインのリストは事前に不明であり、動的に変化することが多いため、ここでは許可リストを使用できません。

このシナリオでは、*外部*とは内部ネットワークに属さず、パブリックインターネット経由で到達されるべき IP を指します。

したがって、*Vulnerable Application* からの呼び出しは次の条件を満たします。

- 会社のグローバルネットワーク*内部にある* IP またはドメインを対象に**していません**。
- 呼び出しが正当に開始されたことを*証明*するため、*VulnerableApplication* と想定される IP またはドメインとの間で定義された規約を使用します。

#### アプリケーション層で URL をブロックする際の課題

上記のアプリケーションの業務要件に基づくと、許可リスト方式は有効な解決策ではありません。ブロックリスト方式が突破不能な壁ではないことは承知しつつも、このシナリオでは最善の解決策です。これは、アプリケーションに「何をすべきでないか」を知らせるものです。

アプリケーション層で URL をフィルタリングすることが難しい理由は次のとおりです。

- アプリケーションはコードレベルで、提供された IP (V4 + V6) が、*localhost* や *IPv4/v6 Link-Local* アドレスも含む公式の[プライベートネットワーク範囲](https://en.wikipedia.org/wiki/Private_network)の一部ではないことを検出できなければなりません。すべての SDK がこの種の検証に対する組み込み機能を提供しているわけではなく、その落とし穴と可能な値を開発者が理解して扱う必要があるため、負担の大きい作業になります。
- ドメイン名についても同じです。企業はすべての内部ドメイン名のリストを維持し、提供されたドメイン名が内部ドメインであるかをアプリケーションが検証できる中央サービスを提供しなければなりません。この検証では、アプリケーションから内部 DNS リゾルバーへ問い合わせることができますが、この内部 DNS リゾルバーは外部ドメイン名を解決してはいけません。

#### 利用可能な防御策

以降のセクションでは、次の[例](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html#example)と同じ前提を考慮します。

##### アプリケーション層

[ケース 1](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html#case-1-application-can-send-request-only-to-identified-and-trusted-applications)と同様に、*TargetApplication* へ送信されるリクエストを作成するために `IP Address` または `domain name` が必要であると想定します。

[ケース 1](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html#application-layer)で提示した 3 種類の入力データに対する最初の検証は、このケースでも同じですが、**二つ目の検証は異なります**。ここではブロックリスト方式を使用しなければなりません。

> **リクエストの正当性の証明について**: リクエストを受け取る *TargetedApplication* は、呼び出し元から渡されることが期待されるランダムトークン (例: 英数字 20 文字) を生成しなければなりません。このトークンは、有効なリクエストを実行するために body 内のパラメーターとして渡されます。パラメーター名もアプリケーション自身が定義し、文字セット `[a-z]{1,10}` のみを許可します。受信側エンドポイントは HTTP POST リクエストのみを受け入れなければなりません。

**検証フロー (検証手順のいずれかが失敗した場合、リクエストは拒否されます):**

1. アプリケーションは *TargetedApplication* の IP アドレスまたはドメイン名を受け取り、この[セクション](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html#application-layer)で言及したライブラリまたは正規表現を使用して入力データに最初の検証を適用します。
2. 二つ目の検証は、次のブロックリスト方式を使って *TargetedApplication* の IP アドレスまたはドメイン名に対して適用されます。
   - IP アドレスの場合:
     - アプリケーションは、それがパブリックなものであることを確認します (次の段落の Python コードサンプルで示すヒントを参照してください)。
   - ドメイン名の場合:
        1. アプリケーションは、内部ドメイン名のみを解決する DNS リゾルバーに対してドメイン名の解決を試みることで、それがパブリックなものであることを確認します。ここでは、期待される値がパブリックドメインであるため、提供されたドメインを知らないことを示す応答を返さなければなりません。
        2. この[ドキュメント](https://cheatsheetseries.owasp.org/assets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet_SSRF_Bible.pdf)で説明されている `DNS pinning` 攻撃を防ぐため、アプリケーションは提供されたドメイン名の背後にあるすべての IP アドレス (IPv4 + IPv6 のために *A* + *AAAA* レコードを取得) を取得し、前のポイントで説明した IP アドレスに関する同じ検証を適用します。
3. アプリケーションは、リクエストに使用するプロトコルを専用の入力パラメーターで受け取り、その値を許可されたプロトコルのリスト (`HTTP` または `HTTPS`) と照合して検証します。
4. アプリケーションは、*TargetedApplication* に渡すトークンのパラメーター名を専用の入力パラメーターで受け取り、文字セット `[a-z]{1,10}` のみを許可します。
5. アプリケーションは、トークン自体を専用の入力パラメーターで受け取り、文字セット `[a-zA-Z0-9]{20}` のみを許可します。
6. アプリケーションは、有効な呼び出しを実行するために必要な任意の業務データを受け取り、セキュリティの観点から検証します。
7. アプリケーションは、**検証済みの情報のみを使用して** HTTP POST リクエストを構築し、送信します (*使用する Web クライアントで[リダイレクト](https://developer.mozilla.org/en-US/docs/Web/HTTP/Redirections)追従のサポートを無効化することを忘れないでください*)。

##### ネットワーク層

次の[セクション](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html#network-layer)と同様です。

## AWS の IMDSv2

クラウド環境では、SSRF はメタデータサービス (*例:* AWS Instance Metadata Service、Azure Instance Metadata Service、GCP metadata server) から認証情報やアクセストークンを取得して盗むためによく使用されます。

[IMDSv2](https://aws.amazon.com/blogs/security/defense-in-depth-open-firewalls-reverse-proxies-ssrf-vulnerabilities-ec2-instance-metadata-service/) は、SSRF の一部の事例を緩和する AWS 向けの追加の多層防御メカニズムです。

この保護を活用するには IMDSv2 へ移行し、古い IMDSv1 を無効化してください。詳細は [AWS ドキュメント](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instancedata-data-retrieval.html)を確認してください。

## 拒否リスト (最後の手段)

**拒否リストはバイパスされやすいものです。許可リストを優先してください。**

**避けられない場合は、最低限、次の範囲をブロックしてください。**

| Service | Block IPs/Domains |
|---------|-------------------|
| **AWS IMDS** | `169.254.169.254`, `metadata.amazonaws.com` |
| **GCP Metadata** | `metadata.google.internal`, `169.254.169.254` |
| **Azure IMDS** | `169.254.169.254` |
| **Localhost** | `127.0.0.0/8`, `0.0.0.0/8`, `::1/128` |
| **RFC1918 Private** | `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16` |
| **Multicast** | `224.0.0.0/4`, `ff00::/8` |

**完全な本番環境の例:** [ComputerCraft SSRF deny-list](https://github.com/cc-tweaked/CC-Tweaked/blob/b9ed66983d714bcb5c6bf15b428e01a035106dbf/projects/core/src/main/java/dan200/computercraft/core/apis/http/options/AddressPredicate.java#L112-L157)

**出典:**

- [IANA IPv4 Special Registry](https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry.xhtml)
- [IANA IPv6 Special Registry](https://www.iana.org/assignments/iana-ipv6-special-registry/iana-ipv6-special-registry.xhtml)

## Semgrep ルール

[Semgrep](https://semgrep.dev/) は、オフライン静的解析のためのコマンドラインツールです。既製またはカスタムのルールを使用して、コードベース内のコード標準とセキュリティ標準を強制できます。
SSRF の潜在的な脆弱性を効果的に識別し調査するために、SSRF 用の [Semgrep ルール](https://semgrep.dev/r?q=ssrf)を確認してください。

## スキーマに使用したツールとコード

- [Mermaid Online Editor](https://mermaidjs.github.io/mermaid-live-editor) と [Mermaid documentation](https://mermaidjs.github.io/)。
- [Draw.io Online Editor](https://www.draw.io/)。

SSRF の一般的なフローの Mermaid コード (このチートシートに挿入された PNG 画像をキャプチャするために printscreen が使用されています):

```text
sequenceDiagram
    participant Attacker
    participant VulnerableApplication
    participant TargetedApplication
    Attacker->>VulnerableApplication: Crafted HTTP request
    VulnerableApplication->>TargetedApplication: Request (HTTP, FTP...)
    Note left of TargetedApplication: Use payload included<br>into the request to<br>VulnerableApplication
    TargetedApplication->>VulnerableApplication: Response
    VulnerableApplication->>Attacker: Response
    Note left of VulnerableApplication: Include response<br>from the<br>TargetedApplication
```

"[防止したいフローに関するネットワーク層保護のケース 1](https://cheatsheetseries.owasp.org/assets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet_Case1_NetworkLayer_PreventFlow.xml)" スキーマの Draw.io XML コード (このチートシートに挿入された PNG 画像をキャプチャするために printscreen が使用されています)。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V1.3, V5.3, V13 | SSRF防止チートシート の主要な管理策 |

