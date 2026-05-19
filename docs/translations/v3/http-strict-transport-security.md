# HSTSチートシート 日本語訳

## Attribution

- Original: HTTP Strict Transport Security Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Strict_Transport_Security_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-20

## 関連ファイル

- 要約: [../../summaries/v3/http-strict-transport-security.md](../../summaries/v3/http-strict-transport-security.md)
- 開発チェックリスト: [../../checklists/v3/http-strict-transport-security.md](../../checklists/v3/http-strict-transport-security.md)

## 日本語訳

HTTP Strict Transport Security (HSTS) は、ブラウザに対して対象ホストへの接続を HTTPS のみに強制させる HTTP ヘッダーである。HSTS により、HTTP へのダウングレード、初回以降の平文アクセス、Cookie の平文送信、利用者が証明書警告をクリックして進むリスクを下げられる。

HSTS は `Strict-Transport-Security` ヘッダーで配信する。基本形は `max-age=<秒数>` であり、必要に応じて `includeSubDomains` と `preload` を追加する。HSTS は HTTPS 応答でのみ有効であり、HTTP 応答のヘッダーはブラウザに無視される。

導入前に、対象ドメインとすべてのサブドメインで HTTPS が正しく動作し、証明書、リダイレクト、混在コンテンツ、Cookie `Secure` 属性、CDN/ロードバランサ設定が整っていることを確認する。短い `max-age` で開始し、問題がないことを確認しながら値を長くする。`includeSubDomains` は強力だが、未対応のサブドメインを停止させる可能性があるため棚卸し後に使う。

preload はブラウザに事前登録される強い設定であり、解除には時間がかかる。登録前に、HTTPS、長い `max-age`、`includeSubDomains`、ルートドメインでのヘッダー配信、全サブドメイン対応を確認する。HSTS は初回接続を完全には保護しないため、preload を使うか、初回接続時のリスクを理解する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V3.4 | ブラウザ向け HTTPS 強制、Cookie 平文送信防止、混在コンテンツ対策 |
| V12.1 | TLS 設定、HSTS ヘッダー、includeSubDomains、preload の導入と運用 |

