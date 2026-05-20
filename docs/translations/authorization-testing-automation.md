# 認可テスト自動化チートシート 日本語訳

## Attribution

- Original: Authorization Testing Automation Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Testing_Automation_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-20

## 関連ファイル

- 要約: [../summaries/authorization-testing-automation.md](../summaries/authorization-testing-automation.md)
- 開発チェックリスト: [../checklists/authorization-testing-automation.md](../checklists/authorization-testing-automation.md)

## 日本語訳

認可テスト自動化は、認可要件をマトリクスとして明文化し、ロール、利用者、リソース、操作、HTTP メソッド、期待される結果の組み合わせを継続的に検証する手法である。手動のスポットチェックでは、水平権限昇格、垂直権限昇格、メソッド差し替え、ID 改ざん、匿名アクセスの漏れを見落としやすい。

認可マトリクスは、匿名利用者、基本利用者、管理者などの観点ごとに、どのサービス、URL、メソッド、入力にアクセスできるかを表す。自動テストでは、各観点を表すテスト用トークンやセッションを生成し、公開されているエンドポイント全体に対して許可と拒否を検証する。期待される拒否もテストデータとして明示し、単に「成功するケース」だけを確認しない。

認可テストは、CI で継続実行できる形にし、アプリケーションのルート追加、ロール追加、権限変更、API バージョン変更に追従する。マトリクスはコードや設定として管理し、レビュー対象にする。XML、JSON、YAML などで表現する場合は、テスト側のパーサでも XXE などの安全な読み込み設定を使う。

テスト観点には、匿名アクセス、権限不足ロール、他利用者所有リソース、他テナントリソース、読み取り専用利用者による変更操作、HTTP メソッド変更、ID 差し替え、URL パス変更、非公開 API、管理 API を含める。認可失敗時の応答、ログ、監査イベントも検証対象にする。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V8.1 | 認可マトリクス、ロール別テスト、匿名・権限不足アクセスの自動検証 |
| V8.2 | 他利用者、他テナント、ID 差し替えによる水平権限昇格テスト |
| V16.3 | 認可失敗、境界違反、テストで検出したアクセス問題のログ確認 |

