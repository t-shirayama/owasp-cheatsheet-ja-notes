# TLSチートシート 要約

## Attribution

- Original: Transport Layer Security Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese summary added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../translations/transport-layer-security.md](../translations/transport-layer-security.md)
- 開発チェックリスト: [../checklists/transport-layer-security.md](../checklists/transport-layer-security.md)

## 概要

TLSは通信の機密性と完全性を守る基盤です。プロトコルバージョン、暗号スイート、証明書、HSTS、相互TLS、証明書検証を適切に設定します。

## 要点

- 古いTLS/SSLバージョンを無効化する。
- 信頼できる証明書と正しいホスト名検証を行う。
- 強い暗号スイートと安全な設定を使う。

## 実装時の注意点

- この要約はASVS Indexでの利用を前提にした実装者向け整理です。詳細確認時は原文を参照してください。
- 関連する認証、認可、ログ、入力検証、暗号、通信保護の管理策と組み合わせて適用します。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V3, V4, V10, V11, V12, V17 | TLSチートシート の主要な管理策 |

