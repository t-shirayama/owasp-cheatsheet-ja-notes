# 認可チートシート 要約

## Attribution

- Original: Authorization Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese summary added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../translations/authorization.md](../translations/authorization.md)
- 開発チェックリスト: [../checklists/authorization.md](../checklists/authorization.md)

## 概要

認可は、要求された操作が特定の主体に許可されているかを検証する仕組みです。認証済みであることは、すべてのリソースや操作が許可されることを意味しません。

認可の欠陥は、水平権限昇格、垂直権限昇格、IDOR、機密情報の漏えい、不正な更新や削除につながります。認可はクライアント側の表示制御ではなく、サーバー側でリクエストごとに検証します。

## 要点

- 最小権限を垂直方向と水平方向の両方に適用する。
- 明示的に許可されない操作は拒否する。
- すべてのリクエストでサーバー側認可を実施する。
- 権限設計を文書化し、運用後も privilege creep を定期的にレビューする。
- URL や API パラメータの ID は推測・改ざんされる前提で扱う。
- RBAC だけで表現できない条件には ABAC や ReBAC を検討する。
- 静的リソースや生成済みファイルにも必要に応じて認可を適用する。
- フレームワーク、API ゲートウェイ、ライブラリの認可機能は、デフォルト設定を信頼せず業務要件に合わせて検証する。
- 認可チェック失敗時は中央集約された処理で安全に終了し、対象リソースへ副作用を残さない。
- 認可失敗、権限変更、管理者操作、高リスク操作をログに記録する。
- 認可ロジックには許可ケースと拒否ケースの両方のテストを作成する。

## 実装時の注意点

- ID のランダム化は認可チェックの代替ではありません。
- API ゲートウェイやフレームワークの認可機能を使う場合も、業務ルールに合っているかをレビューします。
- 認可失敗時のレスポンスは、対象リソースの存在や内部権限構造を漏らさないようにします。
- 権限情報をキャッシュする場合は、権限変更や失効が反映される設計にします。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V8.1 Authorization Documentation | 信頼境界、主体、リソース、操作、権限モデル、テスト観点 |
| V8.2 General Authorization Design | 最小権限、デフォルト拒否、全リクエスト検証、ABAC/ReBAC、IDOR 対策 |
| V8.4 Other Authorization Considerations | サードパーティ設定、チェック場所、失敗処理、privilege creep |
| V16.3 Security Events | 認可失敗、権限変更、管理者操作、高リスク操作のログ記録 |
