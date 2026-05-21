# Transport Layer Security チートシート 日本語訳

## Attribution

- Original: Transport Layer Security Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-21

## 日本語訳

# Transport Layer Security チートシート

## Introduction

このチートシートは、Transport Layer Security (TLS) を使用するアプリケーションでトランスポート層保護を実装するためのガイダンスを提供します。主に、HTTPS 経由で Web アプリケーションに接続するクライアントを保護するために TLS を使用する方法に焦点を当てていますが、このガイダンスの多くは TLS のその他の用途にも適用できます。正しく実装された場合、TLS は複数のセキュリティ上の利点を提供できます。

- **機密性**: 攻撃者がトラフィックの内容を読み取ることを防ぎます。
- **完全性**: 攻撃者がサーバに対してリクエストを再送するなど、トラフィックを改ざんすることを防ぎます。
- **[認証](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)**: クライアントが正当なサーバに接続していることを確認できるようにします。なお、[クライアント証明書](#client-certificates-and-mutual-tls)を使用しない限り、クライアントの身元は検証されません。

### SSL vs TLS

Secure Socket Layer (SSL) は、HTTPS という形で HTTP トラフィックを暗号化するために使用された元のプロトコルです。SSL には公開されたバージョンとして 2 と 3 がありました。どちらにも深刻な暗号学的弱点があり、もはや使用すべきではありません。

[さまざまな理由](https://tim.dierks.org/2014/05/security-standards-and-name-changes-in.html)により、次のバージョンのプロトコル (実質的には SSL 3.1) は Transport Layer Security (TLS) バージョン 1.0 と名付けられました。その後、TLS バージョン 1.1、1.2、1.3 がリリースされています。

「SSL」「SSL/TLS」「TLS」という用語は頻繁に同じ意味で使われ、多くの場合、より新しい TLS プロトコルを指して「SSL」が使われます。このチートシートでは、レガシープロトコルを指す場合を除き、「TLS」という用語を使用します。

## Server Configuration

### Only Support Strong Protocols

Web アプリケーションはデフォルトで **TLS 1.3** を使用しなければならず、互換性のために TLS 1.2 をサポートしてもかまいません。**TLS 1.0 と TLS 1.1 は [RFC 8996](https://datatracker.ietf.org/doc/html/rfc8996) (2021 年 3 月) によって正式に非推奨となっており、無効化しなければなりません。** これらは [PCI DSS](https://www.pcisecuritystandards.org/documents/Migrating-from-SSL-Early-TLS-Info-Supp-v1_1.pdf) でも禁止され、NIST SP 800-52 Rev. 2 でも許可されず、すべての主要ブラウザから削除されています。SSLv2 と SSLv3 は常に無効化しなければなりません。

サポート終了済みクライアントとの相互運用性が厳格なビジネス要件である場合は、機微データへアクセスできない専用エンドポイントに分離し、主要エンドポイントを弱体化させないでください。プロトコルダウングレード攻撃を防ぐため、["TLS_FALLBACK_SCSV" 拡張](https://tools.ietf.org/html/rfc7507)を有効にするべきです。

### Only Support Strong Ciphers

TLS では、多様なセキュリティレベルを提供する多数の暗号 (または暗号スイート) がサポートされています。可能な場合は、GCM 暗号のみを有効にするべきです。ただし、レガシークライアントをサポートする必要がある場合は、その他の暗号が必要になることがあります。少なくとも、次の種類の暗号は常に無効化するべきです。

- Null ciphers
- Anonymous ciphers
- EXPORT ciphers

Mozilla Foundation は、Web、データベース、メールサーバ向けの[使いやすいセキュア設定ジェネレータ](https://ssl-config.mozilla.org/)を提供しています。このツールにより、サイト管理者は使用しているソフトウェアを選択し、多様なブラウザバージョンとサーバソフトウェアに対してセキュリティと互換性のバランスを取るよう最適化された設定ファイルを入手できます。

### Set the appropriate Diffie-Hellman groups

TLS 1.3 より前のプロトコルバージョンでは、エフェメラル Diffie-Hellman 鍵交換 (暗号スイート名の "DHE" または "EDH" 文字列で示されます) で使用する Diffie-Hellman パラメータ生成の慣行に実用上の問題がありました。たとえば、クライアントはサーバパラメータの選択に関与できず、無条件に受け入れるか切断するしかありませんでした。また、ランダムなパラメータ生成はしばしばサービス拒否攻撃につながりました (CVE-2022-40735、CVE-2002-20001)。

TLS 1.3 では、`supported_groups` 拡張により Diffie-Hellman グループパラメータが既知のグループに制限されます。利用可能な Diffie-Hellman グループは、[RFC7919](https://www.rfc-editor.org/rfc/rfc7919) で規定されている `ffdhe2048`、`ffdhe3072`、`ffdhe4096`、`ffdhe6144`、`ffdhe8192` です。

デフォルトでは、openssl 3.0 は上記すべてのグループを有効にします。変更するには、適切な Diffie-Hellman グループパラメータが `openssl.cnf` に存在することを確認してください。例:

```text
openssl_conf = openssl_init
[openssl_init]
ssl_conf = ssl_module
[ssl_module]
system_default = tls_system_default
[tls_system_default]
Groups = x25519:prime256v1:x448:ffdhe2048:ffdhe3072
```text

apache 設定は次のようになります。

```text
SSLOpenSSLConfCmd Groups x25519:secp256r1:ffdhe3072
```text

NGINX で同じグループを設定すると、次のようになります。

```text
ssl_ecdh_curve x25519:secp256r1:ffdhe3072;
```text

TLS 1.2 以前のバージョンでは、Diffie-Hellman パラメータを設定しないことが推奨されます。

### Disable Compression

セッション Cookie などの機微情報を攻撃者が復元できる可能性がある脆弱性 ([CRIME](https://threatpost.com/crime-attack-uses-compression-ratio-tls-requests-side-channel-hijack-secure-sessions-091312/77006/) と呼ばれます) から保護するため、TLS 圧縮は無効化するべきです。

### Patch Cryptographic Libraries

SSL および TLS プロトコルの脆弱性に加えて、SSL/TLS ライブラリにも歴史的に多数の脆弱性があり、最もよく知られているものが [Heartbleed](https://heartbleed.com) です。そのため、これらのライブラリを最新のセキュリティパッチで最新状態に保つことが重要です。

### Test the Server Configuration

サーバを堅牢化したら、その設定をテストするべきです。[OWASP Testing Guide の SSL/TLS Testing 章](https://owasp.org/www-project-web-security-testing-guide/stable/4-Web_Application_Security_Testing/09-Testing_for_Weak_Cryptography/01-Testing_for_Weak_Transport_Layer_Security)には、テストに関する追加情報があります。

サーバ設定をすばやく検証するために使用できるオンラインツールには、次のものがあります。

- [SSL Labs Server Test](https://www.ssllabs.com/ssltest)
- [CryptCheck](https://cryptcheck.fr/)
- [Hardenize](https://www.hardenize.com/)
- [ImmuniWeb](https://www.immuniweb.com/ssl/)
- [Observatory by Mozilla](https://observatory.mozilla.org)
- [Scanigma](https://scanigma.com)
- [Stellastra](https://stellastra.com/tls-cipher-suite-check)
- [OWASP PurpleTeam](https://purpleteam-labs.com/) `cloud`

さらに、使用できるオフラインツールも多数あります。

- [O-Saft - OWASP SSL advanced forensic tool](https://wiki.owasp.org/index.php/O-Saft)
- [CipherScan](https://github.com/mozilla/cipherscan)
- [CryptoLyzer](https://gitlab.com/coroner/cryptolyzer)
- [SSLScan - Fast SSL Scanner](https://github.com/rbsec/sslscan)
- [SSLyze](https://github.com/nabla-c0d3/sslyze)
- [testssl.sh - Testing any TLS/SSL encryption](https://testssl.sh)
- [tls-scan](https://github.com/prbinu/tls-scan)
- [OWASP PurpleTeam](https://purpleteam-labs.com/) `local`

## Certificates

### Use Strong Keys and Protect Them

暗号鍵を生成するために使用される秘密鍵は、その秘密鍵と対応する証明書の想定寿命に対して十分に強固でなければなりません。現在のベストプラクティスは、少なくとも 2048 ビットの鍵サイズを選択することです。鍵の寿命と同等の鍵強度に関する追加情報は、[こちら](http://www.keylength.com/en/compare/)および [NIST SP 800-57](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-57pt1r5.pdf) にあります。

秘密鍵は、ファイルシステム権限その他の技術的および管理的制御を使用して、不正アクセスから保護するべきです。

### Use Strong Cryptographic Hashing Algorithms

証明書では、古い MD5 や SHA-1 アルゴリズムではなく、ハッシュアルゴリズムとして SHA-256 を使用するべきです。MD5 や SHA-1 には多数の暗号学的弱点があり、モダンブラウザでは信頼されていません。

### Use Correct Domain Names

証明書のドメイン名 (またはサブジェクト) は、その証明書を提示するサーバの完全修飾名と一致しなければなりません。歴史的には、これは証明書の `commonName` (CN) 属性に格納されていました。しかし、近年の Chrome は CN 属性を無視し、FQDN が `subjectAlternativeName` (SAN) 属性に含まれていることを要求します。互換性のため、証明書には主 FQDN を CN に、FQDN の完全なリストを SAN に含めるべきです。

また、証明書を作成する際は、次の点を考慮するべきです。

- "www" サブドメインも含めるべきかを検討する。
- 非修飾ホスト名を含めない。
- IP アドレスを含めない。
- 外部公開証明書に内部ドメイン名を含めない。
    - サーバが内部 FQDN と外部 FQDN の両方でアクセス可能な場合は、複数の証明書を設定する。

### Carefully Consider the use of Wildcard Certificates

ワイルドカード証明書は便利ですが、単一の証明書がドメインのすべてのサブドメイン (`*.example.org` など) に対して有効になるため、[最小権限の原則](https://wiki.owasp.org/index.php/Least_privilege)に反します。複数のシステムがワイルドカード証明書を共有している場合、その鍵が複数システムに存在する可能性があるため、証明書の秘密鍵が侵害される可能性は高まります。さらに、この鍵の価値が大幅に増すため、攻撃者にとってより魅力的な標的になります。

ワイルドカード証明書の使用をめぐる問題は複雑であり、オンラインには[さまざまな](https://blog.sean-wright.com/wildcard-certs-not-quite-the-star/)その他の[議論](https://gist.github.com/joepie91/7e5cad8c0726fd6a5e90360a754fc568)があります。

ワイルドカード証明書の使用をリスク評価する際は、次の領域を考慮するべきです。

- 利便性のためではなく、真に必要な場合にのみワイルドカード証明書を使用する。
    - 代わりに、システムが自動的に証明書を要求および更新できるようにする [ACME](https://en.wikipedia.org/wiki/Automated_Certificate_Management_Environment) の使用を検討する。
- 異なる信頼レベルのシステムにワイルドカード証明書を決して使用しない。
    - 2 つの VPN ゲートウェイは共有ワイルドカード証明書を使用してもよい場合がある。
    - Web アプリケーションの複数インスタンスは証明書を共有してもよい場合がある。
    - VPN ゲートウェイと公開 Web サーバはワイルドカード証明書を共有するべきではない。
    - 公開 Web サーバと内部サーバはワイルドカード証明書を共有するべきではない。
- ワイルドカード秘密鍵が 1 つのシステムにのみ存在するよう、TLS 終端を行うリバースプロキシサーバの使用を検討する。
- 証明書が期限切れまたは侵害された場合にすべてを更新できるよう、証明書を共有しているすべてのシステムの一覧を維持するべきである。
- `*.foo.example.org` などのサブドメイン、または別ドメインに対して発行することで、ワイルドカード証明書の範囲を制限する。

### Use an Appropriate Certification Authority for the Application's User Base

ユーザーから信頼されるためには、証明書は信頼された認証局 (CA) によって署名されていなければなりません。インターネット公開アプリケーションでは、これはオペレーティングシステムやブラウザによってよく知られ、自動的に信頼される CA のいずれかであるべきです。

[LetsEncrypt](https://letsencrypt.org) CA は、すべての主要ブラウザで信頼される無料のドメイン検証 SSL 証明書を提供しています。そのため、CA から証明書を購入する利点があるかどうかを検討してください。

内部アプリケーションでは、内部 CA を使用できます。これにより、証明書の FQDN は外部 CA や証明書透明性ログで公開されません。ただし、その証明書は、署名に使用された内部 CA 証明書をインポートして信頼したユーザーにのみ信頼されます。

### Use CAA Records to Restrict Which CAs can Issue Certificates

Certification Authority Authorization (CAA) DNS レコードを使用すると、ドメインに対して証明書を発行できる CA を定義できます。このレコードには CA の一覧が含まれ、その一覧に含まれていない CA は、そのドメインに対する証明書発行を拒否するべきです。これにより、攻撃者が評判の低い CA を通じてドメインの不正な証明書を取得することを防ぎやすくなります。すべてのサブドメインに適用する場合、管理者や開発者が使用できる CA を制限し、不正なワイルドカード証明書の取得を防ぐため、管理面でも有用です。

### Consider the Certificate's Validation Type

証明書には異なる検証タイプがあります。検証とは、証明書を取得する権限があることを認証局 (CA) が確認するプロセスです。これは認可です。[CA/Browser Forum](https://cabforum.org/working-groups/server/baseline-requirements/documents/) は、CA とブラウザベンダ、および Web セキュリティに関心を持つその他の関係者で構成される組織です。検証タイプに基づき、CA が従わなければならない規則を定めています。基本的な検証は Domain Validated (DV) と呼ばれます。公開発行されるすべての証明書はドメイン検証されなければなりません。このプロセスでは、証明書で要求された名前またはエンドポイントを制御していることを実務的に証明します。通常これは、DNS、公式メールアドレス、または証明書を受け取るエンドポイントへのチャレンジレスポンスを伴います。

Organization Validated (OV) 証明書には、証明書のサブジェクトに申請者の組織情報が含まれます。例: C = GB, ST = Manchester, **O = Sectigo Limited**, CN = sectigo.com。OV 証明書を取得するプロセスでは、CA が正しい会社と実際に話していることを証明する方法で、申請会社との公式な連絡が必要です。

Extended validation (EV) 証明書は、DV と OV のすべての検証に加えて、さらに高いレベルの検証を提供します。これは実質的に、「このサイトは本当に Example Company Inc. によって運営されている」と「このドメインは本当に example.org である」の違いと見ることができます。[Latest Extended Validation Guidelines](https://cabforum.org/working-groups/server/extended-validation/guidelines/)

歴史的には、これらはブラウザで異なる表示をされ、多くの場合、アドレスバーに会社名や緑色のアイコンまたは背景が表示されていました。しかし、2019 年時点で、主要ブラウザは EV 証明書が追加の保護を提供するとは考えていないため、このような EV ステータス表示を行っていません。([Chromium](https://groups.google.com/a/chromium.org/forum/m/#!msg/security-dev/h1bTcoTpfeI/jUTk1z7VAAAJ) Chrome、Edge、Brave、Opera を含む。[Firefox](https://groups.google.com/forum/m/?fromgroups&hl=en#!topic/firefox-dev/6wAg_PpnlY4) [Safari](https://cabforum.org/2018/06/06/minutes-of-the-f2f-44-meeting-in-london-england-6-7-june-2018/#apple-root-program-update))

すべてのブラウザと TLS スタックは DV、OV、EV 証明書の違いを認識しないため、セキュリティ面では実質的に同じです。攻撃者が不正な証明書を取得するために必要なのは、ドメインの実務的な制御レベルに到達することだけです。OV または EV 証明書を取得するために攻撃者が追加で行う作業は、インシデントの範囲をまったく広げません。実際には、そのような行動は検知につながる可能性が高くなります。OV および EV 証明書の取得に伴う追加の負担は可用性リスクを生む可能性があり、その使用はこの観点からレビューするべきです。

## Application

### Use TLS For All Pages

TLS は、ログインページなど機微と見なされるページだけでなく、すべてのページで使用するべきです。TLS の使用を強制しないページがある場合、攻撃者はセッショントークンなどの機微情報を盗聴したり、レスポンスに悪意のある JavaScript を注入してユーザーに対する他の攻撃を実行したりする機会を得る可能性があります。

公開アプリケーションでは、ユーザーがドメイン名を手入力した場合の体験を改善するため、Web サーバがポート 80 で暗号化されていない HTTP 接続を待ち受け、その後ただちに恒久的リダイレクト (HTTP 301) でリダイレクトすることが適切な場合があります。その後、将来 HTTP 経由でサイトにアクセスすることを防ぐため、[HTTP Strict Transport Security (HSTS)](#use-http-strict-transport-security) ヘッダーで補強するべきです。

API 専用エンドポイントでは、HTTP を完全に無効化し、暗号化された接続のみをサポートするべきです。それが不可能な場合、API エンドポイントは暗号化されていない HTTP 接続で行われたリクエストをリダイレクトするのではなく失敗させるべきです。

### Do Not Mix TLS and Non-TLS Content

TLS で利用可能なページは、暗号化されていない HTTP 経由で読み込まれるリソース (JavaScript や CSS ファイルなど) を含むべきではありません。これらの暗号化されていないリソースにより、攻撃者がセッション Cookie を盗聴したり、ページに悪意のあるコードを注入したりできる可能性があります。モダンブラウザは、セキュアなページに暗号化されていない HTTP 経由でアクティブコンテンツを読み込もうとする試みもブロックします。

### Use the "Secure" Cookie Flag

すべての Cookie には "[Secure](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#Secure_and_HttpOnly_cookies)" 属性を付けるべきです。これにより、ブラウザは暗号化された HTTPS 接続でのみ Cookie を送信するよう指示され、暗号化されていない HTTP 接続から Cookie が盗聴されることを防ぎます。これは Web サイトが HTTP (ポート 80) を待ち受けていない場合でも重要です。能動的な中間者攻撃者は、ユーザーに対してポート 80 上の偽装 Web サーバを提示し、Cookie を盗む可能性があるためです。

### Prevent Caching of Sensitive Data

TLS は転送中のデータを保護しますが、データがリクエスト元システムに到達した後は保護しません。そのため、この情報はユーザーのブラウザのキャッシュや、TLS 復号を実行するよう設定された中間プロキシに保存される可能性があります。

レスポンスで機微データが返される場合、HTTP ヘッダーを使用して、ブラウザやプロキシサーバにその情報をキャッシュしないよう指示し、保存されたり他のユーザーに返されたりしないようにするべきです。これは、レスポンスに次の HTTP ヘッダーを設定することで実現できます。

```text
Cache-Control: no-cache, no-store, must-revalidate
Pragma: no-cache
Expires: 0
```

### Use HTTP Strict Transport Security

HTTP Strict Transport Security (HSTS) は、ユーザーのブラウザに常に HTTPS 経由でサイトを要求するよう指示し、ユーザーが証明書警告を回避することも防ぎます。HSTS の実装に関する追加情報は、[HTTP Strict Transport Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Strict_Transport_Security_Cheat_Sheet.html) を参照してください。

### Client Certificates and Mutual TLS

一般的な TLS 設定では、サーバ上の証明書によりクライアントはサーバの身元を検証でき、その間の接続は暗号化されます。しかし、このアプローチには主に 2 つの弱点があります。

- サーバにはクライアントの身元を検証する仕組みがありません。
- 攻撃者がそのドメインの有効な証明書を取得すると、接続を傍受できます。この傍受は、クライアントシステムに信頼された CA 証明書をインストールすることで TLS トラフィックを検査する企業でよく使用されます。

mutual TLS (mTLS) の中心となるクライアント証明書は、これらの問題に対処します。mTLS では、クライアントとサーバの双方が TLS を使用して相互に認証します。クライアントは自身の証明書でサーバに身元を証明します。これにより、クライアントの強力な認証が可能になるだけでなく、中間者がクライアントシステム上の信頼された CA 証明書を持っていても、TLS トラフィックを復号できなくなります。

Challenges and Considerations

クライアント証明書は、いくつかの課題により公開システムではほとんど使用されません。

- クライアント証明書の発行と管理には大きな管理負荷が伴います。
- 技術に詳しくないユーザーは、クライアント証明書のインストールを難しいと感じる可能性があります。
- 組織の TLS 復号の慣行により、mTLS の主要コンポーネントであるクライアント証明書認証が失敗する可能性があります。

これらの課題はあるものの、クライアント証明書と mTLS は、特にユーザーが技術的に高度である場合や同じ組織に属している場合、高価値アプリケーションや API で検討するべきです。

### Public Key Pinning

公開鍵ピンニングを使用すると、サーバの証明書が有効かつ信頼済みであるだけでなく、そのサーバに期待される証明書と一致することを保証できます。これは、検証プロセスの弱点を悪用する、信頼された認証局を侵害する、またはクライアントへの管理アクセスを持つことにより、有効な証明書を取得できる攻撃者に対する保護を提供します。

公開鍵ピンニングは、HTTP Public Key Pinning (HPKP) 標準でブラウザに追加されました。しかし、多数の問題により、その後非推奨となり、現在は推奨されておらず、[モダンブラウザでもサポートされていません](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Public-Key-Pins)。

ただし、公開鍵ピンニングは、モバイルアプリケーション、シッククライアント、サーバ間通信では依然としてセキュリティ上の利点を提供できます。詳細は [Pinning Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Pinning_Cheat_Sheet.html) で説明されています。

## Related Articles

- OWASP - [Testing for Weak TLS](https://owasp.org/www-project-web-security-testing-guide/stable/4-Web_Application_Security_Testing/09-Testing_for_Weak_Cryptography/01-Testing_for_Weak_Transport_Layer_Security)
- OWASP - [Application Security Verification Standard (ASVS) - Communication Security Verification Requirements (V9)](https://github.com/OWASP/ASVS/blob/v4.0.1/4.0/en/0x17-V9-Communications.md)
- Mozilla - [Mozilla Recommended Configurations](https://wiki.mozilla.org/Security/Server_Side_TLS#Recommended_configurations)
- NIST - [SP 800-52 Rev. 2 Guidelines for the Selection, Configuration, and Use of Transport Layer Security (TLS) Implementations](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-52r2.pdf)
- NIST - [NIST SP 800-57 Recommendation for Key Management, Revision 5](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-57pt1r5.pdf)
- NIST - [SP 800-95 Guide to Secure Web Services](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-95.pdf)
- IETF - [RFC 5280 Internet X.509 Public Key Infrastructure Certificate and Certificate Revocation List (CRL) Profile](https://tools.ietf.org/html/rfc5280)
- IETF - [RFC 2246 The Transport Layer Security (TLS) Protocol Version 1.0 (JAN 1999)](https://tools.ietf.org/html/rfc2246)
- IETF - [RFC 4346 The Transport Layer Security (TLS) Protocol Version 1.1 (APR 2006)](https://tools.ietf.org/html/rfc4346)
- IETF - [RFC 5246 The Transport Layer Security (TLS) Protocol Version 1.2 (AUG 2008)](https://tools.ietf.org/html/rfc5246)

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V3.3 | Cookie の `Secure` 属性、セッション Cookie の盗聴防止 |
| V4.1 | API とサーバ間通信での TLS、mTLS、クライアント証明書 |
| V4.4 | サービス間接続と信頼境界における証明書管理 |
| V10.3 | 認可・トークン送受信での HTTPS 強制 |
| V10.4 | OAuth/OIDC 関連エンドポイントの TLS 保護 |
| V11.6 | 秘密鍵、証明書、暗号ライブラリの保護と更新 |
| V12.1 | TLS バージョン、暗号スイート、プロトコル強度 |
| V12.2 | 証明書のドメイン名、CA、CAA、検証タイプ |
| V12.3 | HSTS、HTTP から HTTPS へのリダイレクト、混在コンテンツ防止 |
| V17.2 | 通信セキュリティ設定のテストと継続的検証 |
