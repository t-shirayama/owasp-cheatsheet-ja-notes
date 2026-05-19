# OAuth 2.0プロトコルチートシート 日本語訳

## Attribution

- Original: OAuth 2.0 Protocol Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/OAuth2_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-20

## 関連ファイル

- 要約: [../summaries/oauth2.md](../summaries/oauth2.md)
- 開発チェックリスト: [../checklists/oauth2.md](../checklists/oauth2.md)

## 日本語訳

OAuth 2.0では、クライアント、認可サーバー、リソースサーバーの責務を分け、リダイレクトURI、PKCE、スコープ、トークン検証、TLSを正しく実装します。

## 主要な観点

- 認可コードフローとPKCEを優先する。
- リダイレクトURIを厳密に検証する。
- アクセストークンとIDトークンを混同しない。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V10 | OAuth 2.0プロトコルチートシート の主要な管理策 |

