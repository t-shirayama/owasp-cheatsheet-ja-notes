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

- 要約: [../summaries/http-strict-transport-security.md](../summaries/http-strict-transport-security.md)
- 開発チェックリスト: [../checklists/http-strict-transport-security.md](../checklists/http-strict-transport-security.md)

## 日本語訳

HSTSは、ブラウザにHTTPS接続を強制させ、ダウングレード攻撃やCookieの平文送信リスクを下げるHTTPヘッダーです。

## 主要な観点

- HTTPSを全サイトで正しく有効化してからHSTSを導入する。
- max-age、includeSubDomains、preloadを段階的に検討する。
- HTTPからHTTPSへのリダイレクトを整備する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V3, V12 | HSTSチートシート の主要な管理策 |

