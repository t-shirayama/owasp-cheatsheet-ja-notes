---
title: Server Side Request Forgery Prevention Cheat Sheet
hide_title: true
---

<div className="docHero" data-category="encoding-and-sanitization">
  <h1>SSRF 防止チートシート</h1>
  <div className="docMeta">
    <span className="docPill">最終更新: 2026-05-21</span>
    <span className="docPill">読了時間: 約 15 分</span>
    <span className="docPill">カテゴリ: 入力検証とサニタイズ</span>
  </div>
</div>

<p className="docLead">SSRF 防止チートシートを、原文・翻訳・対比表示で確認できます。ASVS Index 対応の文脈で、公式原文と日本語訳を確認しやすく整理しています。</p>

<div className="tabbedContent">
  <input className="tabInput" type="radio" name="ssrf-prevention-view" id="ssrf-prevention-original" />
  <input className="tabInput" type="radio" name="ssrf-prevention-view" id="ssrf-prevention-translation" defaultChecked />
  <input className="tabInput" type="radio" name="ssrf-prevention-view" id="ssrf-prevention-bilingual" />

  <div className="contentTabs">
    <label htmlFor="ssrf-prevention-original" title="OWASP 原文">原文</label>
    <label htmlFor="ssrf-prevention-translation" title="日本語訳">翻訳</label>
    <label htmlFor="ssrf-prevention-bilingual" title="原文と翻訳を並べて確認">対比表示</label>
  </div>

<section id="ssrf-prevention-original-panel" className="tabPanel originalPanel contentPanel">

## Introduction

The objective of the cheat sheet is to provide advices regarding the protection against [Server Side Request Forgery](https://www.acunetix.com/blog/articles/server-side-request-forgery-vulnerability/) (SSRF) attack.

This cheat sheet will focus on the defensive point of view and will not explain how to perform this attack. This [talk](https://cheatsheetseries.owasp.org/assets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet_Orange_Tsai_Talk.pdf) from the security researcher [Orange Tsai](https://twitter.com/orange_8361) as well as this [document](https://cheatsheetseries.owasp.org/assets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet_SSRF_Bible.pdf) provide techniques on how to perform this kind of attack.

## Context

SSRF is an attack vector that abuses an application to interact with the internal/external network or the machine itself. One of the enablers for this vector is the mishandling of URLs, as showcased in the following examples:

- Image on an external server (*e.g.* user enters image URL of their avatar for the application to download and use).
- Custom [WebHook](https://en.wikipedia.org/wiki/Webhook) (users have to specify Webhook handlers or Callback URLs).
- Internal requests to interact with another service to serve a specific functionality. Most of the times, user data is sent along to be processed, and if poorly handled, can perform specific injection attacks.

## Overview of a SSRF common flow

![SSRF Common Flow](https://cheatsheetseries.owasp.org/assets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet_SSRF_Common_Flow.png)

*Notes:*

- SSRF is not limited to the HTTP protocol. Generally, the first request is HTTP, but in cases where the application itself performs the second request, it could use different protocols (*e.g.* FTP, SMB, SMTP, etc.) and schemes (*e.g.* `file://`, `phar://`, `gopher://`, `data://`, `dict://`, etc.).
- If the application is vulnerable to [XML eXternal Entity (XXE) injection](https://portswigger.net/web-security/xxe) then it can be exploited to perform a [SSRF attack](https://portswigger.net/web-security/xxe#exploiting-xxe-to-perform-ssrf-attacks), take a look at the [XXE cheat sheet](https://cheatsheetseries.owasp.org/cheatsheets/XML_External_Entity_Prevention_Cheat_Sheet.html) to learn how to prevent the exposure to XXE.

## Cases

Depending on the application's functionality and requirements, there are two basic cases in which SSRF can happen:

- Application can send request only to **identified and trusted applications**: Case when [allowlist](https://en.wikipedia.org/wiki/Whitelisting) approach is available.
- Application can send requests to **ANY external IP address or domain name**: Case when [allowlist](https://en.wikipedia.org/wiki/Whitelisting) approach is unavailable.

Because these two cases are very different, this cheat sheet will describe defences against them separately.

### Case 1 - Application can send request only to identified and trusted applications

Sometimes, an application needs to perform a request to another application, often located on another network, to perform a specific task. Depending on the business case, user input is required for the functionality to work.

#### Example

 > Take the example of a web application that receives and uses personal information from a user, such as their first name, last name, birth date etc. to create a profile in an internal HR system. By design, that web application will have to communicate using a protocol that the HR system understands to process that data.
 > Basically, the user cannot reach the HR system directly, but, if the web application in charge of receiving user information is vulnerable to SSRF, the user can leverage it to access the HR system.
 > The user leverages the web application as a proxy to the HR system.

The allowlist approach is a viable option since the internal application called by the *VulnerableApplication* is clearly identified in the technical/business flow. It can be stated that the required calls will only be targeted between those identified and trusted applications.

#### Available protections

Several protective measures are possible at the **Application** and **Network** layers. To apply the **defense in depth** principle, both layers will be hardened against such attacks.

##### Application layer

The first level of protection that comes to mind is [Input validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html).

Based on that point, the following question comes to mind: *How to perform this input validation?*

As [Orange Tsai](https://twitter.com/orange_8361) shows in his [talk](https://cheatsheetseries.owasp.org/assets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet_Orange_Tsai_Talk.pdf), depending on the programming language used, parsers can be abused. One possible countermeasure is to apply the [allowlist approach](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html#allow-list-vs-block-list) when input validation is used because, most of the time, the format of the information expected from the user is globally known.

The request sent to the internal application will be based on the following information:

- String containing business data.
- IP address (V4 or V6).
- Domain name.
- URL.

**Note:** Disable the support for the following of the [redirection](https://developer.mozilla.org/en-US/docs/Web/HTTP/Redirections) in your web client in order to prevent the bypass of the input validation described in the section `Exploitation tricks > Bypassing restrictions > Input validation > Unsafe redirect` of this [document](https://cheatsheetseries.owasp.org/assets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet_SSRF_Bible.pdf).

###### String

In the context of SSRF, validations can be added to ensure that the input string respects the business/technical format expected.

A [regex](https://www.regular-expressions.info/) can be used to ensure that data received is valid from a security point of view if the input data have a simple format (*e.g.* token, zip code, etc.). Otherwise, validation should be conducted using the libraries available from the `string` object because regex for complex formats are difficult to maintain and are highly error-prone.

User input is assumed to be non-network related and consists of the user's personal information.

Example:

```java
//Regex validation for a data having a simple format
if(Pattern.matches("[a-zA-Z0-9\\s\\-]{1,50}", userInput)){
    //Continue the processing because the input data is valid
}else{
    //Stop the processing and reject the request
}
```

###### IP address

In the context of SSRF, there are 2 possible validations to perform:

1. Ensure that the data provided is a valid IP V4 or V6 address.
2. Ensure that the IP address provided belongs to one of the IP addresses of the identified and trusted applications.

The first layer of validation can be applied using libraries that ensure the security of the IP address format, based on the technology used (library option is proposed here to delegate the managing of the IP address format and leverage battle-tested validation function):

> Verification of the proposed libraries has been performed regarding the exposure to bypasses (Hex, Octal, Dword, URL and Mixed encoding) described in this [article](https://medium.com/@vickieli/bypassing-ssrf-protection-e111ae70727b).

- **JAVA:** Method [InetAddressValidator.isValid](http://commons.apache.org/proper/commons-validator/apidocs/org/apache/commons/validator/routines/InetAddressValidator.html#isValid%28java.lang.String)) from the [Apache Commons Validator](http://commons.apache.org/proper/commons-validator/) library.
    - **It is NOT exposed** to bypass using Hex, Octal, Dword, URL and Mixed encoding.
- **.NET**: Method [IPAddress.TryParse](https://docs.microsoft.com/en-us/dotnet/api/system.net.ipaddress.tryparse?view=netframework-4.8) from the SDK.
    - **It is exposed** to bypass using Hex, Octal, Dword and Mixed encoding but **NOT** the URL encoding.
    - As allowlisting is used here, any bypass tentative will be blocked during the comparison against the allowed list of IP addresses.
- **JavaScript**: Library [ip-address](https://www.npmjs.com/package/ip-address).
    - **It is NOT exposed** to bypass using Hex, Octal, Dword, URL and Mixed encoding.
- **Ruby**: Class [IPAddr](https://ruby-doc.org/stdlib-2.0.0/libdoc/ipaddr/rdoc/IPAddr.html) from the SDK.
    - **It is NOT exposed** to bypass using Hex, Octal, Dword, URL and Mixed encoding.

> **Use the output value of the method/library as the IP address to compare against the allowlist.**

After ensuring the validity of the incoming IP address, the second layer of validation is applied. An allowlist is created after determining all the IP addresses (v4 and v6 to avoid bypasses) of the identified and trusted applications. The valid IP is cross-checked with that list to ensure its communication with the internal application (string strict comparison with case sensitive).

###### Domain name

In the attempt of validate domain names, it is apparent to do a DNS resolution to verify the existence of the domain. In general, it is not a bad idea, yet it opens up the application to attacks depending on the configuration used regarding the DNS servers used for the domain name resolution:

- It can disclose information to external DNS resolvers.
- It can be used by an attacker to bind a legit domain name to an internal IP address. See the section `Exploitation tricks > Bypassing restrictions > Input validation > DNS pinning` of this [document](https://cheatsheetseries.owasp.org/assets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet_SSRF_Bible.pdf).
- An attacker can use it to deliver a malicious payload to the internal DNS resolvers and the API (SDK or third-party) used by the application to handle the DNS communication and then, potentially, trigger a vulnerability in one of these components.

In the context of SSRF, there are two validations to perform:

1. Ensure that the data provided is a valid domain name.
2. Ensure that the domain name provided belongs to one of the domain names of the identified and trusted applications (the allowlisting comes to action here).

Similar to the IP address validation, the first layer of validation can be applied using libraries that ensure the security of the domain name format, based on the technology used (library option is proposed here in order to delegate the managing of the domain name format and leverage battle tested validation function):

> Verification of the proposed libraries has been performed to ensure that the proposed functions do not perform any DNS resolution query.

- **JAVA:** Method [DomainValidator.isValid](https://commons.apache.org/proper/commons-validator/apidocs/org/apache/commons/validator/routines/DomainValidator.html#isValid%28java.lang.String)) from the [Apache Commons Validator](http://commons.apache.org/proper/commons-validator/) library.
- **.NET**: Method [Uri.CheckHostName](https://docs.microsoft.com/en-us/dotnet/api/system.uri.checkhostname?view=netframework-4.8) from the SDK.
- **JavaScript**: Library [is-valid-domain](https://www.npmjs.com/package/is-valid-domain).
- **Python**: Module [validators.domain](https://validators.readthedocs.io/en/latest/#module-validators.domain).
- **Ruby**: No valid dedicated gem has been found.
    - [domainator](https://github.com/mhuggins/domainator), [public_suffix](https://github.com/weppos/publicsuffix-ruby) and [addressable](https://github.com/sporkmonger/addressable) has been tested but unfortunately they all consider `<script>alert(1)</script>.owasp.org` as a valid domain name.
    - This regex, taken from [here](https://stackoverflow.com/a/26987741), can be used: `^(((?!-))(xn--|_&#123;1,1&#125;)?[a-z0-9-]&#123;0,61&#125;[a-z0-9]&#123;1,1&#125;\\.)*(xn--)?([a-z0-9][a-z0-9\\-]&#123;0,60&#125;|[a-z0-9-]&#123;1,30&#125;\\.[a-z]&#123;2,&#125;)$`

Example of execution of the proposed regex for Ruby:

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
```

```bash
$ ruby test.rb
[i] owasp.org is VALID
[i] owasp-test.org is VALID
[i] doc-test.owasp.org is VALID
[i] doc.owasp.org is VALID
[!] <script>alert(1)</script> is INVALID
[!] <script>alert(1)</script>.owasp.org is INVALID
```

After ensuring the validity of the incoming domain name, the second layer of validation is applied:

1. Build an allowlist with all the domain names of every identified and trusted applications.
2. Verify that the domain name received is part of this allowlist (string strict comparison with case sensitive).

Unfortunately here, the application is still vulnerable to the `DNS pinning` bypass mentioned in this [document](https://cheatsheetseries.owasp.org/assets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet_SSRF_Bible.pdf). Indeed, a DNS resolution will be made when the business code will be executed. To address that issue, the following action must be taken in addition of the validation on the domain name:

1. Ensure that the domains that are part of your organization are resolved by your internal DNS server first in the chains of DNS resolvers.
2. Monitor the domains allowlist in order to detect when any of them resolves to a/an:
   - Local IP address (V4 + V6).
   - Internal IP of your organization (expected to be in private IP ranges) for the domain that are not part of your organization.

The following Python3 script can be used, as a starting point, for the monitoring mentioned above:

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
```

###### URL

Do not accept complete URLs from the user because URL are difficult to validate and the parser can be abused depending on the technology used as showcased by the following [talk](https://cheatsheetseries.owasp.org/assets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet_Orange_Tsai_Talk.pdf) of [Orange Tsai](https://twitter.com/orange_8361).

If network related information is really needed then only accept a valid IP address or domain name.

##### Network layer

The objective of the Network layer security is to prevent the *VulnerableApplication* from performing calls to arbitrary applications. Only allowed *routes* will be available for this application in order to limit its network access to only those that it should communicate with.

The Firewall component, as a specific device or using the one provided within the operating system, will be used here to define the legitimate flows.

In the schema below, a Firewall component is leveraged to limit the application's access, and in turn, limit the impact of an application vulnerable to SSRF:

![Case 1 for Network layer protection about flows that we want to prevent](https://cheatsheetseries.owasp.org/assets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet_Case1_NetworkLayer_PreventFlow.png)

[Network segregation](https://www.mwrinfosecurity.com/our-thinking/making-the-case-for-network-segregation) (see this set of [implementation advice](https://www.cyber.gov.au/acsc/view-all-content/publications/implementing-network-segmentation-and-segregation) can also be leveraged and **is highly recommended in order to block illegitimate calls directly at network level itself**.

### Case 2 - Application can send requests to ANY external IP address or domain name

This case happens when a user can control a URL to an **External** resource and the application makes a request to this URL (e.g. in case of [WebHooks](https://en.wikipedia.org/wiki/Webhook)). Allow lists cannot be used here because the list of IPs/domains is often unknown upfront and is dynamically changing.

In this scenario, *External* refers to any IP that doesn't belong to the internal network, and should be reached by going over the public internet.

Thus, the call from the *Vulnerable Application*:

- **Is NOT** targeting one of the IP/domain *located inside* the company's global network.
- Uses a convention defined between the *VulnerableApplication* and the expected IP/domain in order to *prove* that the call has been legitimately initiated.

#### Challenges in blocking URLs at application layer

Based on the business requirements of the above mentioned applications, the allowlist approach is not a valid solution. Despite knowing that the block-list approach is not an impenetrable wall, it is the best solution in this scenario. It is informing the application what it should **not** do.

Here is why filtering URLs is hard at the Application layer:

- It implies that the application must be able to detect, at the code level, that the provided IP (V4 + V6) is not part of the official [private networks ranges](https://en.wikipedia.org/wiki/Private_network) including also *localhost* and *IPv4/v6 Link-Local* addresses. Not every SDK provides a built-in feature for this kind of verification, and leaves the handling up to the developer to understand all of its pitfalls and possible values, which makes it a demanding task.
- Same remark for domain name: The company must maintain a list of all internal domain names and provide a centralized service to allow an application to verify if a provided domain name is an internal one. For this verification, an internal DNS resolver can be queried by the application but this internal DNS resolver must not resolve external domain names.

#### Available protections

Taking into consideration the same assumption in the following [example](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html#example) for the following sections.

##### Application layer

Like for the case [n°1](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html#case-1-application-can-send-request-only-to-identified-and-trusted-applications), it is assumed that the `IP Address` or `domain name` is required to create the request that will be sent to the *TargetApplication*.

The first validation on the input data presented in the case [n°1](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html#application-layer) on the 3 types of data will be the same for this case **BUT the second validation will differ**. Indeed, here we must use the block-list approach.

> **Regarding the proof of legitimacy of the request**: The *TargetedApplication* that will receive the request must generate a random token (ex: alphanumeric of 20 characters) that is expected to be passed by the caller (in body via a parameter for which the name is also defined by the application itself and only allow characters set `[a-z]&#123;1,10&#125;`) to perform a valid request. The receiving endpoint must only accept HTTP POST requests.

**Validation flow (if one the validation steps fail then the request is rejected):**

1. The application will receive the IP address or domain name of the *TargetedApplication* and it will apply the first validation on the input data using the libraries/regex mentioned in this [section](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html#application-layer).
2. The second validation will be applied against the IP address or domain name of the *TargetedApplication* using the following block-list approach:
   - For IP address:
     - The application will verify that it is a public one (see the hint provided in the next paragraph with the python code sample).
   - For domain name:
        1. The application will verify that it is a public one by trying to resolve the domain name against the DNS resolver that will only resolve internal domain name. Here, it must return a response indicating that it do not know the provided domain because the expected value received must be a public domain.
        2. To prevent the `DNS pinning` attack described in this [document](https://cheatsheetseries.owasp.org/assets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet_SSRF_Bible.pdf), the application will retrieve all the IP addresses behind the domain name provided (taking records *A* + *AAAA* for IPv4 + IPv6) and it will apply the same verification described in the previous point about IP addresses.
3. The application will receive the protocol to use for the request via a dedicated input parameter for which it will verify the value against an allowed list of protocols (`HTTP` or `HTTPS`).
4. The application will receive the parameter name for the token to pass to the *TargetedApplication* via a dedicated input parameter for which it will only allow the characters set `[a-z]&#123;1,10&#125;`.
5. The application will receive the token itself via a dedicated input parameter for which it will only allow the characters set `[a-zA-Z0-9]&#123;20&#125;`.
6. The application will receive and validate (from a security point of view) any business data needed to perform a valid call.
7. The application will build the HTTP POST request **using only validated information** and will send it (*don't forget to disable the support for [redirection](https://developer.mozilla.org/en-US/docs/Web/HTTP/Redirections) in the web client used*).

##### Network layer

Similar to the following [section](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html#network-layer).

## IMDSv2 in AWS

In cloud environments SSRF is often used to access and steal credentials and access tokens from metadata services (e.g. AWS Instance Metadata Service, Azure Instance Metadata Service, GCP metadata server).

[IMDSv2](https://aws.amazon.com/blogs/security/defense-in-depth-open-firewalls-reverse-proxies-ssrf-vulnerabilities-ec2-instance-metadata-service/) is an additional defence-in-depth mechanism for AWS that mitigates some of the instances of SSRF.

To leverage this protection migrate to IMDSv2 and disable old IMDSv1. Check out [AWS documentation](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instancedata-data-retrieval.html) for more details.

## Deny-list (Last Resort)

**Deny-lists are bypass-prone. Prefer allow-lists.**

**When unavoidable, block these minimum ranges:**

| Service | Block IPs/Domains |
|---------|-------------------|
| **AWS IMDS** | `169.254.169.254`, `metadata.amazonaws.com` |
| **GCP Metadata** | `metadata.google.internal`, `169.254.169.254` |
| **Azure IMDS** | `169.254.169.254` |
| **Localhost** | `127.0.0.0/8`, `0.0.0.0/8`, `::1/128` |
| **RFC1918 Private** | `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16` |
| **Multicast** | `224.0.0.0/4`, `ff00::/8` |

**Full production example:** [ComputerCraft SSRF deny-list](https://github.com/cc-tweaked/CC-Tweaked/blob/b9ed66983d714bcb5c6bf15b428e01a035106dbf/projects/core/src/main/java/dan200/computercraft/core/apis/http/options/AddressPredicate.java#L112-L157)

**Sources:**

- [IANA IPv4 Special Registry](https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry.xhtml)
- [IANA IPv6 Special Registry](https://www.iana.org/assignments/iana-ipv6-special-registry/iana-ipv6-special-registry.xhtml)

## Semgrep Rules

[Semgrep](https://semgrep.dev/) is a command-line tool for offline static analysis. Use pre-built or custom rules to enforce code and security standards in your codebase.
Explore the [Semgrep rules](https://semgrep.dev/r?q=ssrf) for SSRF to effectively identify and investigate potential SSRF vulnerabilities.

## Tools and code used for schemas

- [Mermaid Online Editor](https://mermaidjs.github.io/mermaid-live-editor) and [Mermaid documentation](https://mermaidjs.github.io/).
- [Draw.io Online Editor](https://www.draw.io/).

Mermaid code for SSRF common flow (printscreen are used to capture PNG image inserted into this cheat sheet):

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

Draw.io schema XML code for the "[case 1 for network layer protection about flows that we want to prevent](https://cheatsheetseries.owasp.org/assets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet_Case1_NetworkLayer_PreventFlow.xml)" schema (printscreen are used to capture PNG image inserted into this cheat sheet).

</section>

<section id="ssrf-prevention-translation-panel" className="tabPanel translationPanel contentPanel">

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
```

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
```

```bash
$ ruby test.rb
[i] owasp.org is VALID
[i] owasp-test.org is VALID
[i] doc-test.owasp.org is VALID
[i] doc.owasp.org is VALID
[!] <script>alert(1)</script> is INVALID
[!] <script>alert(1)</script>.owasp.org is INVALID
```

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
```

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

</section>



<section id="ssrf-prevention-bilingual-panel" className="tabPanel bilingualPanel">

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Introduction

The objective of the cheat sheet is to provide advices regarding the protection against [Server Side Request Forgery](https://www.acunetix.com/blog/articles/server-side-request-forgery-vulnerability/) (SSRF) attack.

This cheat sheet will focus on the defensive point of view and will not explain how to perform this attack. This [talk](https://cheatsheetseries.owasp.org/assets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet_Orange_Tsai_Talk.pdf) from the security researcher [Orange Tsai](https://twitter.com/orange_8361) as well as this [document](https://cheatsheetseries.owasp.org/assets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet_SSRF_Bible.pdf) provide techniques on how to perform this kind of attack.

## Context

SSRF is an attack vector that abuses an application to interact with the internal/external network or the machine itself. One of the enablers for this vector is the mishandling of URLs, as showcased in the following examples:

- Image on an external server (*e.g.* user enters image URL of their avatar for the application to download and use).
- Custom [WebHook](https://en.wikipedia.org/wiki/Webhook) (users have to specify Webhook handlers or Callback URLs).
- Internal requests to interact with another service to serve a specific functionality. Most of the times, user data is sent along to be processed, and if poorly handled, can perform specific injection attacks.

## Overview of a SSRF common flow

![SSRF Common Flow](https://cheatsheetseries.owasp.org/assets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet_SSRF_Common_Flow.png)

*Notes:*

- SSRF is not limited to the HTTP protocol. Generally, the first request is HTTP, but in cases where the application itself performs the second request, it could use different protocols (*e.g.* FTP, SMB, SMTP, etc.) and schemes (*e.g.* `file://`, `phar://`, `gopher://`, `data://`, `dict://`, etc.).
- If the application is vulnerable to [XML eXternal Entity (XXE) injection](https://portswigger.net/web-security/xxe) then it can be exploited to perform a [SSRF attack](https://portswigger.net/web-security/xxe#exploiting-xxe-to-perform-ssrf-attacks), take a look at the [XXE cheat sheet](https://cheatsheetseries.owasp.org/cheatsheets/XML_External_Entity_Prevention_Cheat_Sheet.html) to learn how to prevent the exposure to XXE.

## Cases

Depending on the application's functionality and requirements, there are two basic cases in which SSRF can happen:

- Application can send request only to **identified and trusted applications**: Case when [allowlist](https://en.wikipedia.org/wiki/Whitelisting) approach is available.
- Application can send requests to **ANY external IP address or domain name**: Case when [allowlist](https://en.wikipedia.org/wiki/Whitelisting) approach is unavailable.

Because these two cases are very different, this cheat sheet will describe defences against them separately.

### Case 1 - Application can send request only to identified and trusted applications

Sometimes, an application needs to perform a request to another application, often located on another network, to perform a specific task. Depending on the business case, user input is required for the functionality to work.

#### Example

 > Take the example of a web application that receives and uses personal information from a user, such as their first name, last name, birth date etc. to create a profile in an internal HR system. By design, that web application will have to communicate using a protocol that the HR system understands to process that data.
 > Basically, the user cannot reach the HR system directly, but, if the web application in charge of receiving user information is vulnerable to SSRF, the user can leverage it to access the HR system.
 > The user leverages the web application as a proxy to the HR system.

The allowlist approach is a viable option since the internal application called by the *VulnerableApplication* is clearly identified in the technical/business flow. It can be stated that the required calls will only be targeted between those identified and trusted applications.

#### Available protections

Several protective measures are possible at the **Application** and **Network** layers. To apply the **defense in depth** principle, both layers will be hardened against such attacks.

##### Application layer

The first level of protection that comes to mind is [Input validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html).

Based on that point, the following question comes to mind: *How to perform this input validation?*

As [Orange Tsai](https://twitter.com/orange_8361) shows in his [talk](https://cheatsheetseries.owasp.org/assets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet_Orange_Tsai_Talk.pdf), depending on the programming language used, parsers can be abused. One possible countermeasure is to apply the [allowlist approach](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html#allow-list-vs-block-list) when input validation is used because, most of the time, the format of the information expected from the user is globally known.

The request sent to the internal application will be based on the following information:

- String containing business data.
- IP address (V4 or V6).
- Domain name.
- URL.

**Note:** Disable the support for the following of the [redirection](https://developer.mozilla.org/en-US/docs/Web/HTTP/Redirections) in your web client in order to prevent the bypass of the input validation described in the section `Exploitation tricks > Bypassing restrictions > Input validation > Unsafe redirect` of this [document](https://cheatsheetseries.owasp.org/assets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet_SSRF_Bible.pdf).

###### String

In the context of SSRF, validations can be added to ensure that the input string respects the business/technical format expected.

A [regex](https://www.regular-expressions.info/) can be used to ensure that data received is valid from a security point of view if the input data have a simple format (*e.g.* token, zip code, etc.). Otherwise, validation should be conducted using the libraries available from the `string` object because regex for complex formats are difficult to maintain and are highly error-prone.

User input is assumed to be non-network related and consists of the user's personal information.

Example:

```java
//Regex validation for a data having a simple format
if(Pattern.matches("[a-zA-Z0-9\\s\\-]{1,50}", userInput)){
    //Continue the processing because the input data is valid
}else{
    //Stop the processing and reject the request
}
```

###### IP address

In the context of SSRF, there are 2 possible validations to perform:

1. Ensure that the data provided is a valid IP V4 or V6 address.
2. Ensure that the IP address provided belongs to one of the IP addresses of the identified and trusted applications.

The first layer of validation can be applied using libraries that ensure the security of the IP address format, based on the technology used (library option is proposed here to delegate the managing of the IP address format and leverage battle-tested validation function):

> Verification of the proposed libraries has been performed regarding the exposure to bypasses (Hex, Octal, Dword, URL and Mixed encoding) described in this [article](https://medium.com/@vickieli/bypassing-ssrf-protection-e111ae70727b).

- **JAVA:** Method [InetAddressValidator.isValid](http://commons.apache.org/proper/commons-validator/apidocs/org/apache/commons/validator/routines/InetAddressValidator.html#isValid%28java.lang.String)) from the [Apache Commons Validator](http://commons.apache.org/proper/commons-validator/) library.
    - **It is NOT exposed** to bypass using Hex, Octal, Dword, URL and Mixed encoding.
- **.NET**: Method [IPAddress.TryParse](https://docs.microsoft.com/en-us/dotnet/api/system.net.ipaddress.tryparse?view=netframework-4.8) from the SDK.
    - **It is exposed** to bypass using Hex, Octal, Dword and Mixed encoding but **NOT** the URL encoding.
    - As allowlisting is used here, any bypass tentative will be blocked during the comparison against the allowed list of IP addresses.
- **JavaScript**: Library [ip-address](https://www.npmjs.com/package/ip-address).
    - **It is NOT exposed** to bypass using Hex, Octal, Dword, URL and Mixed encoding.
- **Ruby**: Class [IPAddr](https://ruby-doc.org/stdlib-2.0.0/libdoc/ipaddr/rdoc/IPAddr.html) from the SDK.
    - **It is NOT exposed** to bypass using Hex, Octal, Dword, URL and Mixed encoding.

> **Use the output value of the method/library as the IP address to compare against the allowlist.**

After ensuring the validity of the incoming IP address, the second layer of validation is applied. An allowlist is created after determining all the IP addresses (v4 and v6 to avoid bypasses) of the identified and trusted applications. The valid IP is cross-checked with that list to ensure its communication with the internal application (string strict comparison with case sensitive).

###### Domain name

In the attempt of validate domain names, it is apparent to do a DNS resolution to verify the existence of the domain. In general, it is not a bad idea, yet it opens up the application to attacks depending on the configuration used regarding the DNS servers used for the domain name resolution:

- It can disclose information to external DNS resolvers.
- It can be used by an attacker to bind a legit domain name to an internal IP address. See the section `Exploitation tricks > Bypassing restrictions > Input validation > DNS pinning` of this [document](https://cheatsheetseries.owasp.org/assets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet_SSRF_Bible.pdf).
- An attacker can use it to deliver a malicious payload to the internal DNS resolvers and the API (SDK or third-party) used by the application to handle the DNS communication and then, potentially, trigger a vulnerability in one of these components.

In the context of SSRF, there are two validations to perform:

1. Ensure that the data provided is a valid domain name.
2. Ensure that the domain name provided belongs to one of the domain names of the identified and trusted applications (the allowlisting comes to action here).

Similar to the IP address validation, the first layer of validation can be applied using libraries that ensure the security of the domain name format, based on the technology used (library option is proposed here in order to delegate the managing of the domain name format and leverage battle tested validation function):

> Verification of the proposed libraries has been performed to ensure that the proposed functions do not perform any DNS resolution query.

- **JAVA:** Method [DomainValidator.isValid](https://commons.apache.org/proper/commons-validator/apidocs/org/apache/commons/validator/routines/DomainValidator.html#isValid%28java.lang.String)) from the [Apache Commons Validator](http://commons.apache.org/proper/commons-validator/) library.
- **.NET**: Method [Uri.CheckHostName](https://docs.microsoft.com/en-us/dotnet/api/system.uri.checkhostname?view=netframework-4.8) from the SDK.
- **JavaScript**: Library [is-valid-domain](https://www.npmjs.com/package/is-valid-domain).
- **Python**: Module [validators.domain](https://validators.readthedocs.io/en/latest/#module-validators.domain).
- **Ruby**: No valid dedicated gem has been found.
    - [domainator](https://github.com/mhuggins/domainator), [public_suffix](https://github.com/weppos/publicsuffix-ruby) and [addressable](https://github.com/sporkmonger/addressable) has been tested but unfortunately they all consider `<script>alert(1)</script>.owasp.org` as a valid domain name.
    - This regex, taken from [here](https://stackoverflow.com/a/26987741), can be used: `^(((?!-))(xn--|_&#123;1,1&#125;)?[a-z0-9-]&#123;0,61&#125;[a-z0-9]&#123;1,1&#125;\\.)*(xn--)?([a-z0-9][a-z0-9\\-]&#123;0,60&#125;|[a-z0-9-]&#123;1,30&#125;\\.[a-z]&#123;2,&#125;)$`

Example of execution of the proposed regex for Ruby:

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
```

```bash
$ ruby test.rb
[i] owasp.org is VALID
[i] owasp-test.org is VALID
[i] doc-test.owasp.org is VALID
[i] doc.owasp.org is VALID
[!] <script>alert(1)</script> is INVALID
[!] <script>alert(1)</script>.owasp.org is INVALID
```

After ensuring the validity of the incoming domain name, the second layer of validation is applied:

1. Build an allowlist with all the domain names of every identified and trusted applications.
2. Verify that the domain name received is part of this allowlist (string strict comparison with case sensitive).

Unfortunately here, the application is still vulnerable to the `DNS pinning` bypass mentioned in this [document](https://cheatsheetseries.owasp.org/assets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet_SSRF_Bible.pdf). Indeed, a DNS resolution will be made when the business code will be executed. To address that issue, the following action must be taken in addition of the validation on the domain name:

1. Ensure that the domains that are part of your organization are resolved by your internal DNS server first in the chains of DNS resolvers.
2. Monitor the domains allowlist in order to detect when any of them resolves to a/an:
   - Local IP address (V4 + V6).
   - Internal IP of your organization (expected to be in private IP ranges) for the domain that are not part of your organization.

The following Python3 script can be used, as a starting point, for the monitoring mentioned above:

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
```

###### URL

Do not accept complete URLs from the user because URL are difficult to validate and the parser can be abused depending on the technology used as showcased by the following [talk](https://cheatsheetseries.owasp.org/assets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet_Orange_Tsai_Talk.pdf) of [Orange Tsai](https://twitter.com/orange_8361).

If network related information is really needed then only accept a valid IP address or domain name.

##### Network layer

The objective of the Network layer security is to prevent the *VulnerableApplication* from performing calls to arbitrary applications. Only allowed *routes* will be available for this application in order to limit its network access to only those that it should communicate with.

The Firewall component, as a specific device or using the one provided within the operating system, will be used here to define the legitimate flows.

In the schema below, a Firewall component is leveraged to limit the application's access, and in turn, limit the impact of an application vulnerable to SSRF:

![Case 1 for Network layer protection about flows that we want to prevent](https://cheatsheetseries.owasp.org/assets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet_Case1_NetworkLayer_PreventFlow.png)

[Network segregation](https://www.mwrinfosecurity.com/our-thinking/making-the-case-for-network-segregation) (see this set of [implementation advice](https://www.cyber.gov.au/acsc/view-all-content/publications/implementing-network-segmentation-and-segregation) can also be leveraged and **is highly recommended in order to block illegitimate calls directly at network level itself**.

### Case 2 - Application can send requests to ANY external IP address or domain name

This case happens when a user can control a URL to an **External** resource and the application makes a request to this URL (e.g. in case of [WebHooks](https://en.wikipedia.org/wiki/Webhook)). Allow lists cannot be used here because the list of IPs/domains is often unknown upfront and is dynamically changing.

In this scenario, *External* refers to any IP that doesn't belong to the internal network, and should be reached by going over the public internet.

Thus, the call from the *Vulnerable Application*:

- **Is NOT** targeting one of the IP/domain *located inside* the company's global network.
- Uses a convention defined between the *VulnerableApplication* and the expected IP/domain in order to *prove* that the call has been legitimately initiated.

#### Challenges in blocking URLs at application layer

Based on the business requirements of the above mentioned applications, the allowlist approach is not a valid solution. Despite knowing that the block-list approach is not an impenetrable wall, it is the best solution in this scenario. It is informing the application what it should **not** do.

Here is why filtering URLs is hard at the Application layer:

- It implies that the application must be able to detect, at the code level, that the provided IP (V4 + V6) is not part of the official [private networks ranges](https://en.wikipedia.org/wiki/Private_network) including also *localhost* and *IPv4/v6 Link-Local* addresses. Not every SDK provides a built-in feature for this kind of verification, and leaves the handling up to the developer to understand all of its pitfalls and possible values, which makes it a demanding task.
- Same remark for domain name: The company must maintain a list of all internal domain names and provide a centralized service to allow an application to verify if a provided domain name is an internal one. For this verification, an internal DNS resolver can be queried by the application but this internal DNS resolver must not resolve external domain names.

#### Available protections

Taking into consideration the same assumption in the following [example](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html#example) for the following sections.

##### Application layer

Like for the case [n°1](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html#case-1-application-can-send-request-only-to-identified-and-trusted-applications), it is assumed that the `IP Address` or `domain name` is required to create the request that will be sent to the *TargetApplication*.

The first validation on the input data presented in the case [n°1](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html#application-layer) on the 3 types of data will be the same for this case **BUT the second validation will differ**. Indeed, here we must use the block-list approach.

> **Regarding the proof of legitimacy of the request**: The *TargetedApplication* that will receive the request must generate a random token (ex: alphanumeric of 20 characters) that is expected to be passed by the caller (in body via a parameter for which the name is also defined by the application itself and only allow characters set `[a-z]&#123;1,10&#125;`) to perform a valid request. The receiving endpoint must only accept HTTP POST requests.

**Validation flow (if one the validation steps fail then the request is rejected):**

1. The application will receive the IP address or domain name of the *TargetedApplication* and it will apply the first validation on the input data using the libraries/regex mentioned in this [section](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html#application-layer).
2. The second validation will be applied against the IP address or domain name of the *TargetedApplication* using the following block-list approach:
   - For IP address:
     - The application will verify that it is a public one (see the hint provided in the next paragraph with the python code sample).
   - For domain name:
        1. The application will verify that it is a public one by trying to resolve the domain name against the DNS resolver that will only resolve internal domain name. Here, it must return a response indicating that it do not know the provided domain because the expected value received must be a public domain.
        2. To prevent the `DNS pinning` attack described in this [document](https://cheatsheetseries.owasp.org/assets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet_SSRF_Bible.pdf), the application will retrieve all the IP addresses behind the domain name provided (taking records *A* + *AAAA* for IPv4 + IPv6) and it will apply the same verification described in the previous point about IP addresses.
3. The application will receive the protocol to use for the request via a dedicated input parameter for which it will verify the value against an allowed list of protocols (`HTTP` or `HTTPS`).
4. The application will receive the parameter name for the token to pass to the *TargetedApplication* via a dedicated input parameter for which it will only allow the characters set `[a-z]&#123;1,10&#125;`.
5. The application will receive the token itself via a dedicated input parameter for which it will only allow the characters set `[a-zA-Z0-9]&#123;20&#125;`.
6. The application will receive and validate (from a security point of view) any business data needed to perform a valid call.
7. The application will build the HTTP POST request **using only validated information** and will send it (*don't forget to disable the support for [redirection](https://developer.mozilla.org/en-US/docs/Web/HTTP/Redirections) in the web client used*).

##### Network layer

Similar to the following [section](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html#network-layer).

## IMDSv2 in AWS

In cloud environments SSRF is often used to access and steal credentials and access tokens from metadata services (e.g. AWS Instance Metadata Service, Azure Instance Metadata Service, GCP metadata server).

[IMDSv2](https://aws.amazon.com/blogs/security/defense-in-depth-open-firewalls-reverse-proxies-ssrf-vulnerabilities-ec2-instance-metadata-service/) is an additional defence-in-depth mechanism for AWS that mitigates some of the instances of SSRF.

To leverage this protection migrate to IMDSv2 and disable old IMDSv1. Check out [AWS documentation](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instancedata-data-retrieval.html) for more details.

## Deny-list (Last Resort)

**Deny-lists are bypass-prone. Prefer allow-lists.**

**When unavoidable, block these minimum ranges:**

| Service | Block IPs/Domains |
|---------|-------------------|
| **AWS IMDS** | `169.254.169.254`, `metadata.amazonaws.com` |
| **GCP Metadata** | `metadata.google.internal`, `169.254.169.254` |
| **Azure IMDS** | `169.254.169.254` |
| **Localhost** | `127.0.0.0/8`, `0.0.0.0/8`, `::1/128` |
| **RFC1918 Private** | `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16` |
| **Multicast** | `224.0.0.0/4`, `ff00::/8` |

**Full production example:** [ComputerCraft SSRF deny-list](https://github.com/cc-tweaked/CC-Tweaked/blob/b9ed66983d714bcb5c6bf15b428e01a035106dbf/projects/core/src/main/java/dan200/computercraft/core/apis/http/options/AddressPredicate.java#L112-L157)

**Sources:**

- [IANA IPv4 Special Registry](https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry.xhtml)
- [IANA IPv6 Special Registry](https://www.iana.org/assignments/iana-ipv6-special-registry/iana-ipv6-special-registry.xhtml)

## Semgrep Rules

[Semgrep](https://semgrep.dev/) is a command-line tool for offline static analysis. Use pre-built or custom rules to enforce code and security standards in your codebase.
Explore the [Semgrep rules](https://semgrep.dev/r?q=ssrf) for SSRF to effectively identify and investigate potential SSRF vulnerabilities.

## Tools and code used for schemas

- [Mermaid Online Editor](https://mermaidjs.github.io/mermaid-live-editor) and [Mermaid documentation](https://mermaidjs.github.io/).
- [Draw.io Online Editor](https://www.draw.io/).

Mermaid code for SSRF common flow (printscreen are used to capture PNG image inserted into this cheat sheet):

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

Draw.io schema XML code for the "[case 1 for network layer protection about flows that we want to prevent](https://cheatsheetseries.owasp.org/assets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet_Case1_NetworkLayer_PreventFlow.xml)" schema (printscreen are used to capture PNG image inserted into this cheat sheet).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

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
```

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
```

```bash
$ ruby test.rb
[i] owasp.org is VALID
[i] owasp-test.org is VALID
[i] doc-test.owasp.org is VALID
[i] doc.owasp.org is VALID
[!] <script>alert(1)</script> is INVALID
[!] <script>alert(1)</script>.owasp.org is INVALID
```

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
```

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

</div>
</div>

</section>
</div>

## References

<div className="referenceFooter">

Online version of the [SSRF bible](https://docs.google.com/document/d/1v1TkWZtrhzRLy0bYXBcdLUedXGb9njTNIJXa3u9akHM) (PDF version is used in this cheat sheet).

Article about [Bypassing SSRF Protection](https://medium.com/@vickieli/bypassing-ssrf-protection-e111ae70727b).

Articles about SSRF attacks: [Part 1](https://medium.com/poka-techblog/server-side-request-forgery-ssrf-attacks-part-1-the-basics-a42ba5cc244a), [part 2](https://medium.com/poka-techblog/server-side-request-forgery-ssrf-attacks-part-2-fun-with-ipv4-addresses-eb51971e476d) and  [part 3](https://medium.com/poka-techblog/server-side-request-forgery-ssrf-part-3-other-advanced-techniques-3f48cbcad27e).

Article about [IMDSv2](https://aws.amazon.com/blogs/security/defense-in-depth-open-firewalls-reverse-proxies-ssrf-vulnerabilities-ec2-instance-metadata-service/)

</div>


## Attribution

<div className="attributionFooter">

- Original: Server Side Request Forgery Prevention Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: English original retained for comparison. Japanese translation added. Bilingual display generated from official source and local Japanese translation.
- Retrieved: 2026-05-21

</div>
