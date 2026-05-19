# Javaセキュリティチートシート 要約

## Attribution

- Original: Java Security Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Java_Security_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese summary added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../translations/java-security.md](../translations/java-security.md)
- 開発チェックリスト: [../checklists/java-security.md](../checklists/java-security.md)

## 概要

Javaアプリケーションでは、入力処理、シリアライズ、暗号、XML、ファイル、ログ、例外、依存関係など広い領域で安全なAPI利用が必要です。

## 要点

- 危険なAPIと安全な代替APIを把握する。
- XML、シリアライズ、リフレクションを慎重に扱う。
- 依存関係とランタイム設定を管理する。

## 実装時の注意点

- この要約はASVS Indexでの利用を前提にした実装者向け整理です。詳細確認時は原文を参照してください。
- 関連する認証、認可、ログ、入力検証、暗号、通信保護の管理策と組み合わせて適用します。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V1.2 | Javaセキュリティチートシート の主要な管理策 |

