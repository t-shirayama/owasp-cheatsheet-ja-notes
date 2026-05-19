# デシリアライゼーションチートシート 日本語訳

## Attribution

- Original: Deserialization Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Deserialization_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-20

## 関連ファイル

- 要約: [../../summaries/v1/deserialization.md](../../summaries/v1/deserialization.md)
- 開発チェックリスト: [../../checklists/v1/deserialization.md](../../checklists/v1/deserialization.md)

## 日本語訳

安全でないデシリアライゼーションは、任意コード実行、認可迂回、データ改ざんにつながります。信頼できないデータをオブジェクトとして復元しない設計が基本です。

## 主要な観点

- 信頼できない入力をデシリアライズしない。
- 許可リストで型を制限する。
- 署名や完全性検証で改ざんを検知する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V1.5 | デシリアライゼーションチートシート の主要な管理策 |

