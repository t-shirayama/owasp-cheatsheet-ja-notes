# 認可テスト自動化チートシート 要約

## Attribution

- Original: Authorization Testing Automation Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Testing_Automation_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese summary added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../translations/authorization-testing-automation.md](../translations/authorization-testing-automation.md)
- 開発チェックリスト: [../checklists/authorization-testing-automation.md](../checklists/authorization-testing-automation.md)

## 概要

認可テスト自動化は、認可要件をマトリクスとして管理し、ロール、利用者、リソース、操作、HTTP メソッド、期待結果の組み合わせを継続的に検証する。水平・垂直権限昇格、匿名アクセス、ID 改ざん、メソッド差し替えを CI で検出することを目的とする。

## 要点

- 認可マトリクスに、許可ケースと拒否ケースの両方を明示する。
- 匿名、一般利用者、管理者、権限不足ロールなど、複数の観点で同じエンドポイントを検証する。
- 他利用者所有リソース、他テナントリソース、メソッド変更、ID 差し替えをテストする。
- ルート追加、ロール変更、権限変更時にマトリクス更新をレビュー対象にする。
- 認可失敗時の応答だけでなく、監査ログや境界違反ログも確認する。
- テストデータを XML、JSON、YAML で読む場合は、テストコード側でも安全なパーサ設定を使う。

## 実装時の注意点

- 認可テストは正常系のE2Eテストとは別に、拒否されるべきアクセスを主役にする。
- テスト用トークンやセッションは、実ロールと同じクレーム構造で生成する。
- すべての API バージョンと管理 API を対象に含める。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V8.1 | 認可マトリクス、ロール別テスト、匿名・権限不足アクセスの自動検証 |
| V8.2 | 他利用者、他テナント、ID 差し替えによる水平権限昇格テスト |
| V16.3 | 認可失敗、境界違反、テストで検出したアクセス問題のログ確認 |

