# HSTSチートシート 要約

## Attribution

- Original: HTTP Strict Transport Security Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Strict_Transport_Security_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese summary added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../translations/http-strict-transport-security.md](../translations/http-strict-transport-security.md)
- 開発チェックリスト: [../checklists/http-strict-transport-security.md](../checklists/http-strict-transport-security.md)

## 概要

HTTP Strict Transport Security (HSTS) は、ブラウザに対象ホストへの接続を HTTPS のみに強制させるヘッダーである。HTTP へのダウングレード、初回以降の平文アクセス、Cookie の平文送信、証明書警告のクリック通過リスクを下げる。

## 要点

- HSTS は HTTPS 応答の `Strict-Transport-Security` ヘッダーでのみ有効になる。
- 短い `max-age` で開始し、問題がないことを確認して段階的に伸ばす。
- `includeSubDomains` は全サブドメインの HTTPS 対応を確認してから使う。
- preload は解除に時間がかかるため、要件と影響を確認してから申請する。
- HSTS 導入前に証明書、HTTPS リダイレクト、混在コンテンツ、Cookie `Secure`、CDN/ロードバランサを確認する。

## 実装時の注意点

- HTTP 応答の HSTS ヘッダーはブラウザに無視される。
- HSTS は初回接続を完全には保護しない。必要に応じて preload を検討する。
- `includeSubDomains` は未対応サブドメインの障害につながるため、棚卸しを先に行う。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V3.4 | ブラウザ向け HTTPS 強制、Cookie 平文送信防止、混在コンテンツ対策 |
| V12.1 | TLS 設定、HSTS ヘッダー、includeSubDomains、preload の導入と運用 |

