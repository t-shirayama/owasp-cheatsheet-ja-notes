# IDOR防止チートシート 日本語訳

## Attribution

- Original: Insecure Direct Object Reference Prevention Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-20

## 関連ファイル

- 要約: [../summaries/idor-prevention.md](../summaries/idor-prevention.md)
- 開発チェックリスト: [../checklists/idor-prevention.md](../checklists/idor-prevention.md)

## 日本語訳

IDORは、推測または改ざんしたIDで他者のオブジェクトへアクセスできる欠陥です。オブジェクト単位の認可を必ずサーバー側で実施します。

## 主要な観点

- IDはすべて未信頼入力として扱う。
- 対象オブジェクトの所有者や権限を確認する。
- ランダムIDだけに依存しない。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V8.2 | IDOR防止チートシート の主要な管理策 |

