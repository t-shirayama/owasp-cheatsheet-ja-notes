# OAuth 2.0プロトコルチートシート 要約

## Attribution

- Original: OAuth 2.0 Protocol Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/OAuth2_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese summary added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../../translations/v10/oauth2.md](../../translations/v10/oauth2.md)
- 開発チェックリスト: [../../checklists/v10/oauth2.md](../../checklists/v10/oauth2.md)

## 概要

OAuth 2.0では、クライアント、認可サーバー、リソースサーバーの責務を分け、リダイレクトURI、PKCE、スコープ、トークン検証、TLSを正しく実装します。

## 要点

- 認可コードフローとPKCEを優先する。
- リダイレクトURIを厳密に検証する。
- アクセストークンとIDトークンを混同しない。

## 実装時の注意点

- この要約はASVS Indexでの利用を前提にした実装者向け整理です。詳細確認時は原文を参照してください。
- 関連する認証、認可、ログ、入力検証、暗号、通信保護の管理策と組み合わせて適用します。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V10 | OAuth 2.0プロトコルチートシート の主要な管理策 |

