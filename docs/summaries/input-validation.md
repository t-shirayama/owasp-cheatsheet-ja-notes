# 入力検証チートシート 要約

## Attribution

- Original: Input Validation Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese summary added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../translations/input-validation.md](../translations/input-validation.md)
- 開発チェックリスト: [../checklists/input-validation.md](../checklists/input-validation.md)

## 概要

入力検証は、アプリケーションが受け入れるデータの型、形式、範囲、長さ、業務ルールを明確にし、不正または想定外のデータを拒否する防御です。

## 要点

- 許可リスト方式で検証する。
- クライアント側ではなくサーバー側で検証する。
- 構文検証と業務ルール検証を分ける。

## 実装時の注意点

- この要約はASVS Indexでの利用を前提にした実装者向け整理です。詳細確認時は原文を参照してください。
- 関連する認証、認可、ログ、入力検証、暗号、通信保護の管理策と組み合わせて適用します。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V1, V2, V5 | 入力検証チートシート の主要な管理策 |

