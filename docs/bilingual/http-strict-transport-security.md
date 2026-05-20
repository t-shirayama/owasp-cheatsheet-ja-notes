---
title: HTTP Strict Transport Security Cheat Sheet
hide_title: true
---

<div className="docHero" data-category="asvs-v3">
  <h1>HTTP Strict Transport Security チートシート</h1>
  <div className="docMeta">
    <span className="docPill">最終更新: 2026-05-21</span>
    <span className="docPill">読了時間: 約 5 分</span>
    <span className="docPill">カテゴリ: Web フロントエンドセキュリティ</span>
  </div>
</div>

<div className="tabbedContent">
  <input className="tabInput" type="radio" name="http-strict-transport-security-view" id="http-strict-transport-security-original" />
  <input className="tabInput" type="radio" name="http-strict-transport-security-view" id="http-strict-transport-security-translation" defaultChecked />
  <input className="tabInput" type="radio" name="http-strict-transport-security-view" id="http-strict-transport-security-bilingual" />

  <div className="contentTabs">
    <label htmlFor="http-strict-transport-security-original" title="OWASP 原文">原文</label>
    <label htmlFor="http-strict-transport-security-translation" title="日本語訳">翻訳</label>
    <label htmlFor="http-strict-transport-security-bilingual" title="原文と翻訳を並べて確認">対比表示</label>
  </div>

<section id="http-strict-transport-security-original-panel" className="tabPanel originalPanel contentPanel">

## Introduction

HTTP [Strict Transport Security](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security) (also named **HSTS**) is an opt-in security enhancement that is specified by a web application through the use of a special response header. Once a supported browser receives this header that browser will prevent any communications from being sent over HTTP to the specified domain and will instead send all communications over HTTPS. It also prevents HTTPS click through prompts on browsers.

The specification has been released and published end of 2012 as [RFC 6797](http://tools.ietf.org/html/rfc6797) (HTTP Strict Transport Security (HSTS)) by the IETF.

## Threats

HSTS addresses the following threats:

- User bookmarks or manually types `http://example.com` and is subject to a man-in-the-middle attacker
    - HSTS automatically redirects HTTP requests to HTTPS for the target domain
- Web application that is intended to be purely HTTPS inadvertently contains HTTP links or serves content over HTTP
    - HSTS automatically redirects HTTP requests to HTTPS for the target domain
- A man-in-the-middle attacker attempts to intercept traffic from a victim user using an invalid certificate and hopes the user will accept the bad certificate
    - HSTS does not allow a user to override the invalid certificate message

## Examples

Simple example, using a long (2 years = 63072000 seconds) max-age. This example is dangerous since it lacks `includeSubDomains`:

`Strict-Transport-Security: max-age=63072000`

This example is useful if all present and future subdomains will be HTTPS. This is a more secure option but will block access to certain pages that can only be served over HTTP:

`Strict-Transport-Security: max-age=63072000; includeSubDomains`

This example is useful if all present and future subdomains will be HTTPS. In this example we set a very short max-age in case of mistakes during initial rollout:

`Strict-Transport-Security: max-age=86400; includeSubDomains`

**Recommended:**

- If the site owner would like their domain to be included in the [HSTS preload list](https://hstspreload.org) maintained by Chrome (and used by Firefox and Safari), then use the header below.
- Sending the `preload` directive from your site can have **PERMANENT CONSEQUENCES** and prevent users from accessing your site and any of its subdomains if you find you need to switch back to HTTP. Please read the details at [preload removal](https://hstspreload.org/#removal) before sending the header with `preload`.

`Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`

The `preload` flag indicates the site owner's consent to have their domain preloaded. The site owner still needs to then go and submit the domain to the list.

## Problems

Site owners can use HSTS to identify users without cookies. This can lead to a significant privacy leak. Take a look [here](http://www.leviathansecurity.com/blog/the-double-edged-sword-of-hsts-persistence-and-privacy) for more details.

Cookies can be manipulated from sub-domains, so omitting the `includeSubDomains` option permits a broad range of cookie-related attacks that HSTS would otherwise prevent by requiring a valid certificate for a subdomain. Ensuring the `secure` flag is set on all cookies will also prevent, some, but not all, of the same attacks.

## Browser Support

As of September 2019 HSTS is supported by [all modern browsers](https://caniuse.com/#feat=stricttransportsecurity), with the only notable exception being Opera Mini.

## References

- [Chromium Projects/HSTS](https://www.chromium.org/hsts/)
- [OWASP TLS Protection Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html)
- [sslstrip](https://github.com/moxie0/sslstrip)
- [AppSecTutorial Series - Episode 4](https://www.youtube.com/watch?v=zEV3HOuM_Vw)
- [Nmap NSE script to detect HSTS configuration](https://github.com/icarot/NSE_scripts/blob/master/http-hsts-verify.nse)

</section>

<section id="http-strict-transport-security-translation-panel" className="tabPanel translationPanel contentPanel">

## Introduction

HTTP [Strict Transport Security](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security)（**HSTS** とも呼ばれます）は、特別なレスポンスヘッダーを使って Web アプリケーションが指定する、オプトインのセキュリティ強化機能です。対応ブラウザがこのヘッダーを受信すると、そのブラウザは指定されたドメインに対して HTTP で通信を送信しないようにし、すべての通信を HTTPS で送信します。また、ブラウザで HTTPS 証明書警告をクリックして進むことも防ぎます。

この仕様は、2012 年末に IETF によって [RFC 6797](http://tools.ietf.org/html/rfc6797)（HTTP Strict Transport Security (HSTS)）としてリリースされ、公開されました。

## Threats

HSTS は次の脅威に対処します。

- ユーザーが `http://example.com` をブックマークしている、または手入力し、中間者攻撃者の影響を受ける。
    - HSTS は対象ドメインへの HTTP リクエストを HTTPS へ自動的にリダイレクトします。
- 純粋に HTTPS であることを意図した Web アプリケーションが、誤って HTTP リンクを含む、または HTTP でコンテンツを提供する。
    - HSTS は対象ドメインへの HTTP リクエストを HTTPS へ自動的にリダイレクトします。
- 中間者攻撃者が無効な証明書を使って被害ユーザーのトラフィックを傍受し、ユーザーが不正な証明書を受け入れることを期待する。
    - HSTS は、ユーザーが無効な証明書メッセージを上書きして進むことを許可しません。

## Examples

長い `max-age`（2 年 = 63072000 秒）を使う単純な例です。この例は `includeSubDomains` がないため危険です。

`Strict-Transport-Security: max-age=63072000`

現在および将来のすべてのサブドメインが HTTPS になる場合、この例は有用です。より安全な選択肢ですが、HTTP でしか提供できない特定のページへのアクセスをブロックします。

`Strict-Transport-Security: max-age=63072000; includeSubDomains`

現在および将来のすべてのサブドメインが HTTPS になる場合、この例は有用です。この例では、初期ロールアウト時のミスに備えて非常に短い `max-age` を設定しています。

`Strict-Transport-Security: max-age=86400; includeSubDomains`

**Recommended:**

- サイト所有者が、Chrome によって維持され（Firefox と Safari でも使用される）[HSTS preload list](https://hstspreload.org) にドメインを含めたい場合は、以下のヘッダーを使います。
- サイトから `preload` ディレクティブを送信すると、**永続的な影響** が生じる可能性があります。HTTP に戻す必要が発生した場合でも、ユーザーがサイトとそのサブドメインへアクセスできなくなる可能性があります。`preload` 付きヘッダーを送信する前に、[preload removal](https://hstspreload.org/#removal) の詳細を読んでください。

`Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`

`preload` フラグは、サイト所有者が自分のドメインをプリロードすることに同意していることを示します。その後も、サイト所有者はドメインをリストへ提出する必要があります。

## Problems

サイト所有者は HSTS を使って Cookie なしでユーザーを識別できます。これは重大なプライバシー漏えいにつながる可能性があります。詳細は [こちら](http://www.leviathansecurity.com/blog/the-double-edged-sword-of-hsts-persistence-and-privacy) を参照してください。

Cookie はサブドメインから操作できるため、`includeSubDomains` オプションを省略すると、HSTS がサブドメインに有効な証明書を要求することで本来防げる広範な Cookie 関連攻撃を許してしまいます。すべての Cookie に `secure` フラグを設定することでも、同じ攻撃の一部を防げますが、すべてを防げるわけではありません。

## Browser Support

2019 年 9 月時点で、HSTS は Opera Mini という注目すべき例外を除き、[すべてのモダンブラウザ](https://caniuse.com/#feat=stricttransportsecurity) でサポートされています。

## References

- [Chromium Projects/HSTS](https://www.chromium.org/hsts/)
- [OWASP TLS Protection Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html)
- [sslstrip](https://github.com/moxie0/sslstrip)
- [AppSecTutorial Series - Episode 4](https://www.youtube.com/watch?v=zEV3HOuM_Vw)
- [Nmap NSE script to detect HSTS configuration](https://github.com/icarot/NSE_scripts/blob/master/http-hsts-verify.nse)

</section>

<section id="http-strict-transport-security-bilingual-panel" className="tabPanel bilingualPanel">

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Introduction

HTTP [Strict Transport Security](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security) (also named **HSTS**) is an opt-in security enhancement that is specified by a web application through the use of a special response header. Once a supported browser receives this header that browser will prevent any communications from being sent over HTTP to the specified domain and will instead send all communications over HTTPS. It also prevents HTTPS click through prompts on browsers.

The specification has been released and published end of 2012 as [RFC 6797](http://tools.ietf.org/html/rfc6797) (HTTP Strict Transport Security (HSTS)) by the IETF.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## Introduction

HTTP [Strict Transport Security](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security)（**HSTS** とも呼ばれます）は、特別なレスポンスヘッダーを使って Web アプリケーションが指定する、オプトインのセキュリティ強化機能です。対応ブラウザがこのヘッダーを受信すると、そのブラウザは指定されたドメインに対して HTTP で通信を送信しないようにし、すべての通信を HTTPS で送信します。また、ブラウザで HTTPS 証明書警告をクリックして進むことも防ぎます。

この仕様は、2012 年末に IETF によって [RFC 6797](http://tools.ietf.org/html/rfc6797)（HTTP Strict Transport Security (HSTS)）としてリリースされ、公開されました。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Threats

HSTS addresses the following threats:

- User bookmarks or manually types `http://example.com` and is subject to a man-in-the-middle attacker
    - HSTS automatically redirects HTTP requests to HTTPS for the target domain
- Web application that is intended to be purely HTTPS inadvertently contains HTTP links or serves content over HTTP
    - HSTS automatically redirects HTTP requests to HTTPS for the target domain
- A man-in-the-middle attacker attempts to intercept traffic from a victim user using an invalid certificate and hopes the user will accept the bad certificate
    - HSTS does not allow a user to override the invalid certificate message

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## Threats

HSTS は次の脅威に対処します。

- ユーザーが `http://example.com` をブックマークしている、または手入力し、中間者攻撃者の影響を受ける。
    - HSTS は対象ドメインへの HTTP リクエストを HTTPS へ自動的にリダイレクトします。
- 純粋に HTTPS であることを意図した Web アプリケーションが、誤って HTTP リンクを含む、または HTTP でコンテンツを提供する。
    - HSTS は対象ドメインへの HTTP リクエストを HTTPS へ自動的にリダイレクトします。
- 中間者攻撃者が無効な証明書を使って被害ユーザーのトラフィックを傍受し、ユーザーが不正な証明書を受け入れることを期待する。
    - HSTS は、ユーザーが無効な証明書メッセージを上書きして進むことを許可しません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Examples

Simple example, using a long (2 years = 63072000 seconds) max-age. This example is dangerous since it lacks `includeSubDomains`:

`Strict-Transport-Security: max-age=63072000`

This example is useful if all present and future subdomains will be HTTPS. This is a more secure option but will block access to certain pages that can only be served over HTTP:

`Strict-Transport-Security: max-age=63072000; includeSubDomains`

This example is useful if all present and future subdomains will be HTTPS. In this example we set a very short max-age in case of mistakes during initial rollout:

`Strict-Transport-Security: max-age=86400; includeSubDomains`

**Recommended:**

- If the site owner would like their domain to be included in the [HSTS preload list](https://hstspreload.org) maintained by Chrome (and used by Firefox and Safari), then use the header below.
- Sending the `preload` directive from your site can have **PERMANENT CONSEQUENCES** and prevent users from accessing your site and any of its subdomains if you find you need to switch back to HTTP. Please read the details at [preload removal](https://hstspreload.org/#removal) before sending the header with `preload`.

`Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`

The `preload` flag indicates the site owner's consent to have their domain preloaded. The site owner still needs to then go and submit the domain to the list.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## Examples

長い `max-age`（2 年 = 63072000 秒）を使う単純な例です。この例は `includeSubDomains` がないため危険です。

`Strict-Transport-Security: max-age=63072000`

現在および将来のすべてのサブドメインが HTTPS になる場合、この例は有用です。より安全な選択肢ですが、HTTP でしか提供できない特定のページへのアクセスをブロックします。

`Strict-Transport-Security: max-age=63072000; includeSubDomains`

現在および将来のすべてのサブドメインが HTTPS になる場合、この例は有用です。この例では、初期ロールアウト時のミスに備えて非常に短い `max-age` を設定しています。

`Strict-Transport-Security: max-age=86400; includeSubDomains`

**Recommended:**

- サイト所有者が、Chrome によって維持され（Firefox と Safari でも使用される）[HSTS preload list](https://hstspreload.org) にドメインを含めたい場合は、以下のヘッダーを使います。
- サイトから `preload` ディレクティブを送信すると、**永続的な影響** が生じる可能性があります。HTTP に戻す必要が発生した場合でも、ユーザーがサイトとそのサブドメインへアクセスできなくなる可能性があります。`preload` 付きヘッダーを送信する前に、[preload removal](https://hstspreload.org/#removal) の詳細を読んでください。

`Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`

`preload` フラグは、サイト所有者が自分のドメインをプリロードすることに同意していることを示します。その後も、サイト所有者はドメインをリストへ提出する必要があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Problems

Site owners can use HSTS to identify users without cookies. This can lead to a significant privacy leak. Take a look [here](http://www.leviathansecurity.com/blog/the-double-edged-sword-of-hsts-persistence-and-privacy) for more details.

Cookies can be manipulated from sub-domains, so omitting the `includeSubDomains` option permits a broad range of cookie-related attacks that HSTS would otherwise prevent by requiring a valid certificate for a subdomain. Ensuring the `secure` flag is set on all cookies will also prevent, some, but not all, of the same attacks.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## Problems

サイト所有者は HSTS を使って Cookie なしでユーザーを識別できます。これは重大なプライバシー漏えいにつながる可能性があります。詳細は [こちら](http://www.leviathansecurity.com/blog/the-double-edged-sword-of-hsts-persistence-and-privacy) を参照してください。

Cookie はサブドメインから操作できるため、`includeSubDomains` オプションを省略すると、HSTS がサブドメインに有効な証明書を要求することで本来防げる広範な Cookie 関連攻撃を許してしまいます。すべての Cookie に `secure` フラグを設定することでも、同じ攻撃の一部を防げますが、すべてを防げるわけではありません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Browser Support

As of September 2019 HSTS is supported by [all modern browsers](https://caniuse.com/#feat=stricttransportsecurity), with the only notable exception being Opera Mini.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## Browser Support

2019 年 9 月時点で、HSTS は Opera Mini という注目すべき例外を除き、[すべてのモダンブラウザ](https://caniuse.com/#feat=stricttransportsecurity) でサポートされています。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## References

- [Chromium Projects/HSTS](https://www.chromium.org/hsts/)
- [OWASP TLS Protection Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html)
- [sslstrip](https://github.com/moxie0/sslstrip)
- [AppSecTutorial Series - Episode 4](https://www.youtube.com/watch?v=zEV3HOuM_Vw)
- [Nmap NSE script to detect HSTS configuration](https://github.com/icarot/NSE_scripts/blob/master/http-hsts-verify.nse)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## References

- [Chromium Projects/HSTS](https://www.chromium.org/hsts/)
- [OWASP TLS Protection Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html)
- [sslstrip](https://github.com/moxie0/sslstrip)
- [AppSecTutorial Series - Episode 4](https://www.youtube.com/watch?v=zEV3HOuM_Vw)
- [Nmap NSE script to detect HSTS configuration](https://github.com/icarot/NSE_scripts/blob/master/http-hsts-verify.nse)

</div>
</div>

</section>
</div>

## Attribution

<div className="attributionFooter">

- Original: HTTP Strict Transport Security Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Strict_Transport_Security_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: English original retained for comparison. Japanese translation added. Bilingual display generated from official source and local Japanese translation.
- Retrieved: 2026-05-21

</div>
