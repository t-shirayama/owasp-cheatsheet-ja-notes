# インジェクション防止チートシート 日本語訳

## Attribution

- Original: Injection Prevention Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Injection_Prevention_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-20

## 日本語訳

インジェクションは、信頼できない入力が命令や構文として解釈されることで発生します。構造化API、パラメータ化、エンコード、入力検証を組み合わせます。

## 主要な観点

- 文字列連結で命令を組み立てない。
- 構造化された安全なAPIを使う。
- 入力検証と出力先別エンコードを分けて実施する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V1 | インジェクション防止チートシート の主要な管理策 |

