# 秘密の質問チートシート 要約

## Attribution

- Original: Choosing and Using Security Questions Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Choosing_and_Using_Security_Questions_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese summary added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../../translations/v6/security-questions.md](../../translations/v6/security-questions.md)
- 開発チェックリスト: [../../checklists/v6/security-questions.md](../../checklists/v6/security-questions.md)

## 概要

秘密の質問は推測、調査、漏えい、再利用に弱く、受け入れ可能な認証要素として扱うべきではない。安全な設計では、MFA や強い回復手段を優先する。レガシー用途で使う場合も、質問選定、回答保存、列挙防止、更新時再認証、試行制限を実装する。

## 要点

- 秘密の質問は「知っているもの」であり、パスワードと組み合わせても MFA ではない。
- 秘密の質問を単独の認証手段や単独のアカウント回復手段にしない。
- 質問は記憶可能、一貫、適用可能、秘密性が高い、具体的である必要がある。
- 生年月日、住所、ニックネーム、好きなものなど、公開情報や変化しやすい情報を避ける。
- 利用者に自由記述で質問を作らせると、弱い質問やパスワードヒントを設定されるリスクがある。
- 回答はパスワード同様に安全なハッシュで保存する。
- パスワードリセットでは、メール所有確認後に秘密の質問を表示し、アカウント列挙を防ぐ。
- 質問や回答の更新は機微な操作として扱い、再認証または MFA を要求する。
- 複数質問を使う場合は、攻撃者が質問を順番に試せないようにする。

## 実装時の注意点

- 秘密の質問を残す場合は、レガシー制約として明記し、MFA や復旧コードなどの代替への移行計画を持つ。
- 大文字小文字の正規化や入力形式の案内は利用者体験を改善するが、保存時と比較時で一貫させる。
- 質問の文脈依存性を確認する。同じ質問でも学校、職場、金融、ゲームなどの文脈で推測難易度が変わる。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V6.4 | 秘密の質問の非推奨、回答保存、更新時再認証、回復フローの列挙防止 |

