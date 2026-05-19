# 認可テスト自動化チートシート 開発チェックリスト

## Attribution

- Original: Authorization Testing Automation Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Testing_Automation_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Development checklist added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../../translations/v8/authorization-testing-automation.md](../../translations/v8/authorization-testing-automation.md)
- 要約: [../../summaries/v8/authorization-testing-automation.md](../../summaries/v8/authorization-testing-automation.md)

## 開発チェックリスト

- [ ] 認可マトリクスに、ロール、利用者属性、リソース、操作、HTTP メソッド、期待結果を定義する。
- [ ] 許可されるケースだけでなく、拒否されるべきケースをマトリクスに明示する。
- [ ] 匿名利用者、一般利用者、管理者、権限不足ロールのテスト用トークンまたはセッションを用意する。
- [ ] 各ロールで全公開エンドポイントと管理エンドポイントをテストする。
- [ ] 他利用者所有リソースへの参照、更新、削除をテストする。
- [ ] 他テナントリソースへの参照、更新、削除をテストする。
- [ ] HTTP メソッド変更、URL パス変更、ID 差し替え、クエリ追加で認可を迂回できないことを確認する。
- [ ] 読み取り権限のみの利用者で作成、更新、削除を試験する。
- [ ] 認可失敗時のステータスコード、レスポンス本文、情報漏えいの有無を確認する。
- [ ] 認可失敗、境界違反、ID 差し替えが監査ログに記録されることを確認する。
- [ ] ルート追加、ロール変更、権限変更時に認可マトリクスの更新を必須にする。
- [ ] 認可テストを CI で実行し、回帰をブロックする。
- [ ] テストデータを XML で読む場合は、外部エンティティと外部 DTD を無効化する。
- [ ] テスト用トークンのクレーム構造を本番トークンと揃え、テスト専用の弱い処理で認可を通さない。
- [ ] 失敗した認可テストを、該当するロール、リソース、操作、期待結果つきで報告する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V8.1 | 認可マトリクス、ロール別テスト、匿名・権限不足アクセスの自動検証 |
| V8.2 | 他利用者、他テナント、ID 差し替えによる水平権限昇格テスト |
| V16.3 | 認可失敗、境界違反、テストで検出したアクセス問題のログ確認 |

