# HSTSチートシート 開発チェックリスト

## Attribution

- Original: HTTP Strict Transport Security Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Strict_Transport_Security_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Development checklist added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../../translations/v3/http-strict-transport-security.md](../../translations/v3/http-strict-transport-security.md)
- 要約: [../../summaries/v3/http-strict-transport-security.md](../../summaries/v3/http-strict-transport-security.md)

## 開発チェックリスト

- [ ] HTTPS 応答で `Strict-Transport-Security` ヘッダーを設定する。
- [ ] HTTP 応答の HSTS ヘッダーに依存しない。
- [ ] 短い `max-age` で開始し、問題がないことを確認して段階的に伸ばす。
- [ ] HTTPS 証明書、チェーン、期限、ホスト名を監視する。
- [ ] HTTP から HTTPS へのリダイレクトを整備する。
- [ ] 混在コンテンツと Cookie `Secure` 属性を確認する。
- [ ] すべてのサブドメインで HTTPS が有効であることを確認してから `includeSubDomains` を設定する。
- [ ] preload 申請前に、長い `max-age`、`includeSubDomains`、ルートドメインでのヘッダー配信を確認する。
- [ ] preload の解除に時間がかかることを運用リスクとして記録する。
- [ ] CDN、ロードバランサ、リバースプロキシが HSTS ヘッダーを正しく返すことを確認する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V3.4 | ブラウザ向け HTTPS 強制、Cookie 平文送信防止、混在コンテンツ対策 |
| V12.1 | TLS 設定、HSTS ヘッダー、includeSubDomains、preload の導入と運用 |

