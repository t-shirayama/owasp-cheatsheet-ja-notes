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

### V8.1 Authorization Documentation

- [ ] 文書化する: 信頼境界、ユーザー種別、ロール、属性、リソース、操作を列挙する。
- [ ] 定義する: ユーザー種別とリソースの組み合わせごとに許可操作を定義する。
- [ ] 文書化する: RBAC、ABAC、ReBAC など採用する認可モデルと、属性または関係の信頼元を明確にする。
- [ ] 作成する: 設計段階で定義した権限マトリクスを検証する単体テストと統合テストの方針を作る。
- [ ] レビューする: 本番運用後に privilege creep が発生していないか、定期的に権限を棚卸しする。

### V8.2 General Authorization Design

- [ ] 適用する: 最小権限を垂直方向と水平方向の両方に適用する。
- [ ] 拒否する: 明示的に許可されていない操作、権限未設定、例外、ポリシー評価不能時は拒否する。
- [ ] 実装する: すべてのリクエストでサーバー側認可を実施する。
- [ ] 禁止する: クライアント側の表示制御を認可チェックの代替にすること。
- [ ] 検証する: HTTP メソッド、URL、ID、リクエスト本文を改ざんされる前提で検証する。
- [ ] 検証する: 対象オブジェクトへのアクセス権をサーバー側で確認する。
- [ ] 防止する: 推測可能な ID でもアクセスできないよう、IDOR と水平権限昇格を防ぐ。
- [ ] 検討する: RBAC だけで不足する場合は ABAC または ReBAC を採用する。
- [ ] 保護する: 静的リソースや生成済みファイルにも必要な認可を適用する。
- [ ] 反映する: 権限キャッシュやトークン内権限が失効・変更に追従するようにする。

### V8.4 Other Authorization Considerations

- [ ] 確認する: API ゲートウェイ、フレームワーク、ライブラリの認可処理が業務要件を満たす。
- [ ] 禁止する: フレームワークやライブラリのデフォルト設定だけに依存すること。
- [ ] 実装する: 脆弱なコンポーネントを検出し対応するプロセスを SDLC に組み込む。
- [ ] 実装する: 認可チェックを UI やクライアントだけでなく、保護対象リソースを操作するサーバー側で行う。
- [ ] 中断する: 認可失敗時は処理を中断し、副作用を残さない。
- [ ] 集約する: 認可失敗と例外の処理を中央集約し、不安定な状態を残さない。
- [ ] 抑制する: 認可失敗レスポンスで対象リソースの存在、権限の詳細、内部実装を不要に漏らさない。

### V16.3 Security Events

- [ ] 記録する: 認可失敗、権限変更、管理者操作、高リスク操作を記録する。
- [ ] 含める: ログに主体、対象リソース、操作、結果、時刻、相関 ID を含める。
- [ ] 禁止する: ログに機密情報や過度な内部情報を含めること。
- [ ] 同期する: 複数システムにまたがる調査のため、時計とタイムゾーンを同期する。
- [ ] 検討する: 認可関連ログを集中ログサーバーまたは SIEM に取り込む。

### テスト

- [ ] テストする: 許可される操作と拒否される操作の両方を作成する。
- [ ] テストする: 他ユーザーのリソースへアクセスできないことを確認する。
- [ ] テストする: 権限不足のユーザーが管理操作を実行できないことを確認する。
- [ ] テストする: HTTP メソッド変更や ID 改ざんで認可を迂回できないことを確認する。
- [ ] テストする: 権限失効後にアクセスできないことを確認する。
- [ ] テストする: ABAC/ReBAC ポリシー、例外時の安全な終了、静的リソースへの直接アクセス拒否を確認する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V8.1 Authorization Documentation | 信頼境界、主体、リソース、操作、権限モデル、テスト観点 |
| V8.2 General Authorization Design | 最小権限、デフォルト拒否、全リクエスト検証、ABAC/ReBAC、IDOR 対策 |
| V8.4 Other Authorization Considerations | サードパーティ設定、チェック場所、失敗処理、privilege creep |
| V16.3 Security Events | 認可失敗、権限変更、管理者操作、高リスク操作のログ記録 |
