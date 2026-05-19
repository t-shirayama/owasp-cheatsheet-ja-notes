# XXE防止チートシート 日本語訳

## Attribution

- Original: XML External Entity Prevention Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/XML_External_Entity_Prevention_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-20

## 関連ファイル

- 要約: [../../summaries/v1/xxe-prevention.md](../../summaries/v1/xxe-prevention.md)
- 開発チェックリスト: [../../checklists/v1/xxe-prevention.md](../../checklists/v1/xxe-prevention.md)

## 日本語訳

XXEは、XML外部エンティティによりローカルファイル読取、SSRF、DoSが発生する攻撃です。DTDと外部エンティティを無効化し、安全なパーサ設定を適用します。

## 主要な観点

- 外部エンティティを無効化する。
- DTD処理を無効化または制限する。
- XML入力のサイズと取得先を制限する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V1 | XXE防止チートシート の主要な管理策 |

