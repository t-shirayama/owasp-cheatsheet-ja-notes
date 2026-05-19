# TLSチートシート 日本語訳

## Attribution

- Original: Transport Layer Security Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-20

## 関連ファイル

- 要約: [../../summaries/v3/transport-layer-security.md](../../summaries/v3/transport-layer-security.md)
- 開発チェックリスト: [../../checklists/v3/transport-layer-security.md](../../checklists/v3/transport-layer-security.md)

## 日本語訳

TLS は、通信の機密性、完全性、サーバ認証を提供する基盤である。TLS は万能ではなく、脆弱なプロトコルバージョン、弱い暗号スイート、誤った証明書検証、秘密鍵漏えい、HSTS 未設定、混在コンテンツ、バックエンド通信の平文化があると保護は崩れる。

サーバでは TLS 1.2 以上を有効にし、TLS 1.3 を優先する。SSLv2、SSLv3、TLS 1.0、TLS 1.1 は無効化する。強い暗号スイートを選び、前方秘匿性を持つ鍵交換を使い、弱いハッシュ、輸出グレード、匿名、NULL、RC4、3DES などを避ける。証明書は信頼された CA から発行し、正しいホスト名、SAN、有効期限、鍵用途、チェーンを確認する。

クライアントでは、証明書チェーン、ホスト名、有効期限、失効状態を検証し、検証エラーを無視しない。自己署名証明書や証明書ピンニングを使う場合は、更新、ローテーション、バックアップ鍵、障害時の解除手順を設計する。内部サービス間通信も、インターネット向け通信と同じく TLS、mTLS、証明書管理、鍵保護を検討する。

秘密鍵は安全に生成、保管し、不要なエクスポートを避ける。鍵漏えい時の証明書失効、再発行、再設定、監査を手順化する。TLS 設定は定期的にスキャンし、外部評価、証明書期限監視、HSTS、HTTP から HTTPS へのリダイレクト、Cookie の `Secure` 属性と組み合わせて運用する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V3.4 | ブラウザ向け HTTPS、混在コンテンツ、Cookie Secure 属性、HSTS |
| V4.1 | API とバックエンド通信の TLS、証明書検証、mTLS |
| V10.1 | OAuth/OIDC リダイレクト、トークン送受信、認可サーバ通信の TLS |
| V11.3 | 秘密鍵、証明書、鍵保管、鍵漏えい時の再発行 |
| V12.1 | TLS バージョン、暗号スイート、証明書チェーン、ホスト名検証 |
| V17.1 | 通信経路、外部接続、インフラ設定の継続的検証 |

