# HTTP Strict Transport Security チートシート 日本語訳

## Attribution

- Original: HTTP Strict Transport Security Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Strict_Transport_Security_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-21

## 日本語訳

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

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V3.4 | ブラウザ向け HTTPS 強制、Cookie 平文送信防止、混在コンテンツ対策 |
| V12.1 | TLS 設定、HSTS ヘッダー、includeSubDomains、preload の導入と運用 |
