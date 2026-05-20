# SSRF防止チートシート 日本語訳

## Attribution

- Original: Server Side Request Forgery Prevention Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-20

## 日本語訳

SSRFは、サーバーに攻撃者指定のURLや内部アドレスへリクエストさせる攻撃です。送信先検証、ネットワーク制御、リダイレクト制御、DNS対策が必要です。

## 主要な観点

- 外部URL入力を厳格に検証する。
- 許可リストで送信先を制限する。
- 内部ネットワークやメタデータサービスへの到達を遮断する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V1.3, V5.3, V13 | SSRF防止チートシート の主要な管理策 |

