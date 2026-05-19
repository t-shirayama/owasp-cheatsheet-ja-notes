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

- 日本語訳: [../../translations/v3/http-strict-transport-security.md](../../translations/v3/http-strict-transport-security.md)
- 開発チェックリスト: [../../checklists/v3/http-strict-transport-security.md](../../checklists/v3/http-strict-transport-security.md)

## 概要

HSTSは、ブラウザにHTTPS接続を強制させ、ダウングレード攻撃やCookieの平文送信リスクを下げるHTTPヘッダーです。

## 要点

- HTTPSを全サイトで正しく有効化してからHSTSを導入する。
- max-age、includeSubDomains、preloadを段階的に検討する。
- HTTPからHTTPSへのリダイレクトを整備する。

## 実装時の注意点

- この要約はASVS Indexでの利用を前提にした実装者向け整理です。詳細確認時は原文を参照してください。
- 関連する認証、認可、ログ、入力検証、暗号、通信保護の管理策と組み合わせて適用します。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V3, V12 | HSTSチートシート の主要な管理策 |

