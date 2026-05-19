# 秘密の質問チートシート 開発チェックリスト

## Attribution

- Original: Choosing and Using Security Questions Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Choosing_and_Using_Security_Questions_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Development checklist added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../../translations/v6/security-questions.md](../../translations/v6/security-questions.md)
- 要約: [../../summaries/v6/security-questions.md](../../summaries/v6/security-questions.md)

## 開発チェックリスト

- [ ] 秘密の質問を使う必要性を記録し、MFA、復旧コード、サポート本人確認などの代替を優先する。
- [ ] 秘密の質問を単独の認証手段または単独のアカウント回復手段として使わない。
- [ ] パスワードと秘密の質問の組み合わせを MFA として扱わない。
- [ ] 質問が記憶可能、一貫、適用可能、秘密性が高い、具体的であることを確認する。
- [ ] 生年月日、住所、氏名、ニックネーム、好きなものなど公開情報や推測しやすい質問を禁止する。
- [ ] アプリケーションの文脈上、他利用者や同僚が知っている情報を質問にしない。
- [ ] 利用者が自由記述で質問を作れる機能を禁止するか、弱い質問とパスワードヒントを検出する。
- [ ] 回答の最小長を設定する場合は、正当な短い回答を不必要に拒否しないよう質問ごとに確認する。
- [ ] 回答に利用者名、メールアドレス、現在のパスワード、`123`、`password` などの禁止語を使わせない。
- [ ] 回答を平文保存せず、パスワードと同等の安全なハッシュで保存する。
- [ ] 回答の比較で大文字小文字を区別しない場合は、保存前と比較前の正規化を一貫させる。
- [ ] 日付など形式が曖昧な回答には、登録時と回答時に同じ入力形式を案内する。
- [ ] パスワードリセットでは、メール所有確認前に秘密の質問を表示しない。
- [ ] リセット開始時は一般的なメッセージを返し、アカウント列挙を防ぐ。
- [ ] 秘密の質問回答の失敗をログイン失敗として扱い、試行回数制限やロックアウトポリシーに反映する。
- [ ] 秘密の質問または回答の更新時に、パスワード再入力または MFA による再認証を要求する。
- [ ] 質問または回答の更新を利用者へ通知する。
- [ ] 複数質問を使う場合は、質問の種類を分散させ、攻撃者が1つの情報源で全回答を得られないようにする。
- [ ] 単一質問を質問群から選ぶ方式では、正解するまで質問を変更せず、攻撃者に全質問を試させない。
- [ ] 定期的に秘密の質問を見直す導線を用意し、回答を忘れた利用者が弱い復旧経路に流れないようにする。
- [ ] テストで、アカウント列挙、回答総当たり、質問ローテーション悪用、回答平文漏えい、更新時再認証バイパスを検証する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V6.4 | 秘密の質問の非推奨、回答保存、更新時再認証、回復フローの列挙防止 |

