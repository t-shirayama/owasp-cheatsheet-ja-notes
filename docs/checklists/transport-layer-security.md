# TLSチートシート 開発チェックリスト

## Attribution

- Original: Transport Layer Security Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Development checklist added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../translations/transport-layer-security.md](../translations/transport-layer-security.md)
- 要約: [../summaries/transport-layer-security.md](../summaries/transport-layer-security.md)

## 開発チェックリスト

- [ ] TLS 1.2 以上を有効化し、TLS 1.3 を優先する。
- [ ] SSLv2、SSLv3、TLS 1.0、TLS 1.1 を無効化する。
- [ ] RC4、3DES、NULL、匿名、輸出グレードなど弱い暗号スイートを禁止する。
- [ ] 前方秘匿性を持つ鍵交換を使う。
- [ ] 信頼された CA から発行された証明書を使う。
- [ ] 証明書チェーン、SAN、ホスト名、有効期限、鍵用途を検証する。
- [ ] クライアント側で証明書検証エラーを無視しない。
- [ ] 内部サービス間通信に TLS または mTLS を適用する。
- [ ] 秘密鍵の生成、保管、アクセス権、バックアップを管理する。
- [ ] 秘密鍵漏えい時の証明書失効、再発行、再設定手順を用意する。
- [ ] 証明書期限と失効状態を監視する。
- [ ] HSTS、HTTPS リダイレクト、Cookie `Secure`、混在コンテンツ対策を確認する。
- [ ] 外部診断と自動スキャンで TLS 設定を継続的に検証する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V3.4 | ブラウザ向け HTTPS、混在コンテンツ、Cookie Secure 属性、HSTS |
| V4.1 | API とバックエンド通信の TLS、証明書検証、mTLS |
| V10.1 | OAuth/OIDC リダイレクト、トークン送受信、認可サーバ通信の TLS |
| V11.3 | 秘密鍵、証明書、鍵保管、鍵漏えい時の再発行 |
| V12.1 | TLS バージョン、暗号スイート、証明書チェーン、ホスト名検証 |
| V17.1 | 通信経路、外部接続、インフラ設定の継続的検証 |

