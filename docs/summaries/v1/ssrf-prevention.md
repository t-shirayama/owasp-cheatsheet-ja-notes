# SSRF防止チートシート 要約

## Attribution

- Original: Server Side Request Forgery Prevention Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese summary added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../../translations/v1/ssrf-prevention.md](../../translations/v1/ssrf-prevention.md)
- 開発チェックリスト: [../../checklists/v1/ssrf-prevention.md](../../checklists/v1/ssrf-prevention.md)

## 概要

SSRFは、サーバーに攻撃者指定のURLや内部アドレスへリクエストさせる攻撃です。送信先検証、ネットワーク制御、リダイレクト制御、DNS対策が必要です。

## 要点

- 外部URL入力を厳格に検証する。
- 許可リストで送信先を制限する。
- 内部ネットワークやメタデータサービスへの到達を遮断する。

## 実装時の注意点

- この要約はASVS Indexでの利用を前提にした実装者向け整理です。詳細確認時は原文を参照してください。
- 関連する認証、認可、ログ、入力検証、暗号、通信保護の管理策と組み合わせて適用します。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V1.3, V5.3, V13 | SSRF防止チートシート の主要な管理策 |

