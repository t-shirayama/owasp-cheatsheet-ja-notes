# 暗号化ストレージチートシート 要約

## Attribution

- Original: Cryptographic Storage Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese summary added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../translations/cryptographic-storage.md](../translations/cryptographic-storage.md)
- 開発チェックリスト: [../checklists/cryptographic-storage.md](../checklists/cryptographic-storage.md)

## 概要

暗号化ストレージは、保存データの機密性を守るために、何を暗号化するか、どこで暗号化するか、鍵をどう管理するかを設計する領域です。

## 要点

- 保護対象データを分類する。
- 標準的で推奨される暗号方式を使う。
- 鍵管理を暗号化実装と同じくらい重視する。

## 実装時の注意点

- この要約はASVS Indexでの利用を前提にした実装者向け整理です。詳細確認時は原文を参照してください。
- 関連する認証、認可、ログ、入力検証、暗号、通信保護の管理策と組み合わせて適用します。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V11, V13, V14 | 暗号化ストレージチートシート の主要な管理策 |

