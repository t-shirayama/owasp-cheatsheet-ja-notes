# 認可チートシート 開発チェックリスト

## Attribution

- Original: Authorization Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Development checklist added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../translations/authorization.md](../translations/authorization.md)
- 要約: [../summaries/authorization.md](../summaries/authorization.md)

## 開発チェックリスト

## 設計

- [ ] ユーザー種別、ロール、属性、リソース、操作を列挙する。
- [ ] ユーザー種別とリソースの組み合わせごとに許可操作を定義する。
- [ ] 最小権限を垂直方向と水平方向の両方に適用する。
- [ ] 明示的に許可されていない操作を拒否する。
- [ ] 権限未設定、例外、ポリシー評価不能時に拒否する。
- [ ] RBAC だけで不足する場合は ABAC または ReBAC を検討する。

## 実装

- [ ] すべてのリクエストでサーバー側認可を実施する。
- [ ] クライアント側の表示制御を認可チェックの代替にしない。
- [ ] HTTP メソッド、URL、ID、リクエスト本文を改ざんされる前提で検証する。
- [ ] 対象オブジェクトへのアクセス権をサーバー側で確認する。
- [ ] 推測可能な ID でもアクセスできないようにする。
- [ ] 静的リソースや生成済みファイルにも必要な認可を適用する。
- [ ] API ゲートウェイやフレームワークの認可処理が業務要件を満たすか確認する。
- [ ] 認可失敗時は処理を中断し、副作用を残さない。
- [ ] 権限キャッシュやトークン内権限が失効・変更に追従するようにする。

## ログと監視

- [ ] 認可失敗を記録する。
- [ ] 権限変更を記録する。
- [ ] 管理者操作を記録する。
- [ ] 高リスク操作を記録する。
- [ ] ログには主体、対象リソース、操作、結果を含める。
- [ ] ログに機密情報や過度な内部情報を含めない。

## テスト

- [ ] 許可される操作のテストを作成する。
- [ ] 拒否される操作のテストを作成する。
- [ ] 他ユーザーのリソースへアクセスできないことをテストする。
- [ ] 権限不足のユーザーが管理操作を実行できないことをテストする。
- [ ] HTTP メソッド変更や ID 改ざんで認可を迂回できないことをテストする。
- [ ] 権限失効後にアクセスできないことをテストする。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V8 Authorization | 操作レベル認可、オブジェクトレベル認可、最小権限、権限昇格対策 |
| V16.3 Security Events | 認可失敗、権限変更、管理者操作、高リスク操作のログ記録 |
