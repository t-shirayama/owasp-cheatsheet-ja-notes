# セキュアコードレビューチートシート 要約

## Attribution

- Original: Secure Code Review Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Secure_Code_Review_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese summary added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../translations/secure-code-review.md](../translations/secure-code-review.md)
- 開発チェックリスト: [../checklists/secure-code-review.md](../checklists/secure-code-review.md)

## 概要

セキュアコードレビューは、自動ツールの結果に加えて人間が設計意図と業務文脈を確認し、脆弱性やセキュリティ回帰を検出する活動です。

## 要点

- ベースラインレビューと差分レビューを使い分ける。
- 入力、処理、保存、出力、外部連携までデータフローを追跡する。
- 認証、認可、入力検証、暗号、ログ、設定を高リスク領域として確認する。
- ビジネスロジック、競合状態、権限昇格は手動レビューの価値が高い。
- 指摘は再現条件、影響、修正方針、テスト観点と一緒に記録する。

## 実装時の注意点

- レビュー対象の変更が既存のセキュリティ制御を弱めていないか確認する。
- ツールの警告をそのまま採否せず、実際の攻撃可能性と影響で評価する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V15.4 | セキュアコードレビューとセキュリティ検証プロセス |

