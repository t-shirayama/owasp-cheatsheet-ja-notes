# セキュアコードレビューチートシート 開発チェックリスト

## Attribution

- Original: Secure Code Review Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Secure_Code_Review_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Development checklist added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../translations/secure-code-review.md](../translations/secure-code-review.md)
- 要約: [../summaries/secure-code-review.md](../summaries/secure-code-review.md)

## 開発チェックリスト

- [ ] 変更が触れる資産、信頼境界、権限、外部連携を確認する。
- [ ] 入力検証と出力エンコーディングが適切な場所で実装されていることを確認する。
- [ ] SQL、OSコマンド、テンプレート、NoSQLなどのインジェクション経路を確認する。
- [ ] 認証後にサーバ側認可が実行され、IDORや権限昇格が起きないことを確認する。
- [ ] 秘密情報、鍵、トークン、個人情報がログやエラーに漏えいしないことを確認する。
- [ ] 暗号アルゴリズム、鍵管理、乱数、署名検証が安全な方式で実装されていることを確認する。
- [ ] 差分レビューでは既存制御の削除、設定緩和、テスト削除を重点的に確認する。
- [ ] 指摘ごとに再現手順、影響、修正方針、回帰テストを記録する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V15.4 | セキュアコードレビューとレビュー証跡 |

