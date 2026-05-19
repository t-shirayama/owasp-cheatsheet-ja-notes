# インジェクション防止チートシート 要約

## Attribution

- Original: Injection Prevention Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Injection_Prevention_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese summary added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../../translations/v1/injection-prevention.md](../../translations/v1/injection-prevention.md)
- 開発チェックリスト: [../../checklists/v1/injection-prevention.md](../../checklists/v1/injection-prevention.md)

## 概要

インジェクションは、信頼できない入力が命令や構文として解釈されることで発生します。構造化API、パラメータ化、エンコード、入力検証を組み合わせます。

## 要点

- 文字列連結で命令を組み立てない。
- 構造化された安全なAPIを使う。
- 入力検証と出力先別エンコードを分けて実施する。

## 実装時の注意点

- この要約はASVS Indexでの利用を前提にした実装者向け整理です。詳細確認時は原文を参照してください。
- 関連する認証、認可、ログ、入力検証、暗号、通信保護の管理策と組み合わせて適用します。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V1 | インジェクション防止チートシート の主要な管理策 |

