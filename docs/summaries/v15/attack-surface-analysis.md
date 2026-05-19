# 攻撃対象領域分析チートシート 要約

## Attribution

- Original: Attack Surface Analysis Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Attack_Surface_Analysis_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese summary added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../../translations/v15/attack-surface-analysis.md](../../translations/v15/attack-surface-analysis.md)
- 開発チェックリスト: [../../checklists/v15/attack-surface-analysis.md](../../checklists/v15/attack-surface-analysis.md)

## 概要

攻撃対象領域分析は、外部から到達可能な入口、信頼境界、データフロー、権限境界を把握し、防御すべき場所を明確にする活動です。

## 要点

- 入口、API、管理画面、ファイル処理、外部連携を列挙する。
- 信頼境界と権限境界を明確にする。
- 変更によって増減した攻撃対象領域を追跡する。

## 実装時の注意点

- この要約はASVS Indexでの利用を前提にした実装者向け整理です。詳細確認時は原文を参照してください。
- 関連する認証、認可、ログ、入力検証、暗号、通信保護の管理策と組み合わせて適用します。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V15.1 | 攻撃対象領域分析チートシート の主要な管理策 |

