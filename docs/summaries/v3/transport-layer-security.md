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

- 日本語訳: [../../translations/v3/transport-layer-security.md](../../translations/v3/transport-layer-security.md)
- 開発チェックリスト: [../../checklists/v3/transport-layer-security.md](../../checklists/v3/transport-layer-security.md)

## 概要

TLS は、通信の機密性、完全性、サーバ認証を提供する基盤である。TLS 1.2 以上、強い暗号スイート、正しい証明書検証、HSTS、秘密鍵管理、内部通信の保護を組み合わせて運用する。

## 要点

- TLS 1.2 以上を有効にし、TLS 1.3 を優先する。
- SSLv2、SSLv3、TLS 1.0、TLS 1.1 を無効化する。
- 前方秘匿性を持つ鍵交換と強い暗号スイートを使う。
- 証明書チェーン、SAN、ホスト名、有効期限、鍵用途を検証する。
- クライアント側で証明書検証エラーを無視しない。
- 内部サービス間通信にも TLS または mTLS を適用する。
- 秘密鍵の保護、証明書期限監視、再発行、失効を手順化する。

## 実装時の注意点

- 自己署名証明書やピンニングには、更新、バックアップ鍵、障害時解除の設計が必要である。
- HSTS、HTTP から HTTPS へのリダイレクト、Cookie `Secure` 属性、混在コンテンツ対策も同時に確認する。
- TLS 設定は外部診断と自動監視で継続的に確認する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V3.4 | ブラウザ向け HTTPS、混在コンテンツ、Cookie Secure 属性、HSTS |
| V4.1 | API とバックエンド通信の TLS、証明書検証、mTLS |
| V10.1 | OAuth/OIDC リダイレクト、トークン送受信、認可サーバ通信の TLS |
| V11.3 | 秘密鍵、証明書、鍵保管、鍵漏えい時の再発行 |
| V12.1 | TLS バージョン、暗号スイート、証明書チェーン、ホスト名検証 |
| V17.1 | 通信経路、外部接続、インフラ設定の継続的検証 |

