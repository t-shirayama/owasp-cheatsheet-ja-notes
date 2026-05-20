# セキュアコードレビューチートシート 日本語訳

## Attribution

- Original: Secure Code Review Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Secure_Code_Review_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-20

## 日本語訳

セキュアコードレビューは、ソースコードを手動で確認し、自動ツールだけでは見逃しやすい脆弱性を特定する活動です。ビジネスロジック、データフロー、認証、認可、入力検証、暗号実装、エラー処理など、文脈理解が必要な領域を重点的に扱います。

レビューには、コードベース全体を確認するベースラインレビューと、プルリクエストやコミット差分を確認する差分レビューがあります。準備では、アーキテクチャ、脅威モデル、重要資産、過去の指摘、依存関係、変更目的を把握します。レビューでは、入力から出力や保存先までのデータフローを追跡し、信頼境界をまたぐ箇所で適切な制御があるかを確認します。

自動SAST/DASTは補助として利用し、最終判断では攻撃経路、権限モデル、業務ルール、競合状態、設定不備、監査ログ不足などを人間が評価します。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V15.4 | セキュア開発ライフサイクルにおけるコードレビュー |

