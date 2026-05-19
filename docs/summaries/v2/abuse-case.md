# 悪用ケースチートシート 要約

## Attribution

- Original: Abuse Case Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Abuse_Case_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese summary added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../../translations/v2/abuse-case.md](../../translations/v2/abuse-case.md)
- 開発チェックリスト: [../../checklists/v2/abuse-case.md](../../checklists/v2/abuse-case.md)

## 概要

悪用ケースは、攻撃者や不正利用者がシステムをどのように悪用するかを設計段階で明確にするための手法です。通常のユースケースだけでなく、業務ルールの迂回、権限濫用、データ不正利用を想定します。

## 要点

- 正常系ユースケースに対応する悪用ケースを作成する。
- 攻撃者、内部者、自動化された利用者など複数の主体を想定する。
- 悪用ケースをセキュリティ要件、テスト、ログ設計へ接続する。

## 実装時の注意点

- この要約はASVS Indexでの利用を前提にした実装者向け整理です。詳細確認時は原文を参照してください。
- 関連する認証、認可、ログ、入力検証、暗号、通信保護の管理策と組み合わせて適用します。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V2.1, V2.3, V14.1, V15.1 | 悪用ケースチートシート の主要な管理策 |

