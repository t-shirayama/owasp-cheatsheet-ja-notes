# Javaセキュリティチートシート 日本語訳

## Attribution

- Original: Java Security Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Java_Security_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-20

## 関連ファイル

- 要約: [../../summaries/v1/java-security.md](../../summaries/v1/java-security.md)
- 開発チェックリスト: [../../checklists/v1/java-security.md](../../checklists/v1/java-security.md)

## 日本語訳

Javaアプリケーションでは、入力処理、シリアライズ、暗号、XML、ファイル、ログ、例外、依存関係など広い領域で安全なAPI利用が必要です。

## 主要な観点

- 危険なAPIと安全な代替APIを把握する。
- XML、シリアライズ、リフレクションを慎重に扱う。
- 依存関係とランタイム設定を管理する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V1.2 | Javaセキュリティチートシート の主要な管理策 |

