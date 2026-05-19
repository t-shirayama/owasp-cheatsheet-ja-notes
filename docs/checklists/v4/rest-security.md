# RESTセキュリティチートシート 開発チェックリスト

## Attribution

- Original: REST Security Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Development checklist added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../../translations/v4/rest-security.md](../../translations/v4/rest-security.md)
- 要約: [../../summaries/v4/rest-security.md](../../summaries/v4/rest-security.md)

## 開発チェックリスト

### V4.1 General API and Web Service Security

- [ ] 強制する: すべての API エンドポイントで HTTPS を使用し、平文 HTTP からの API キー、トークン、Cookie、機密データ送信を拒否する。
- [ ] 実装する: API 入力として受け取るパス、クエリ、ヘッダー、Cookie、本文、ファイルをサーバー側で検証する。
- [ ] 制限する: リクエストサイズ上限を定義し、上限超過時は `413 Payload Too Large` を返す。
- [ ] 実装する: Content-Type と Accept を許可リストで検証し、想定外または欠落した型を `406 Not Acceptable` または `415 Unsupported Media Type` で拒否する。
- [ ] 禁止する: `Accept` ヘッダーを検証せずにレスポンスの `Content-Type` へコピーすること。
- [ ] 制限する: HTTP メソッドを必要なものだけにし、`TRACE`、`DEBUG`、不要な `OPTIONS` などを拒否する。
- [ ] 実装する: 業務フローを持つ API で、作成、検証、承認、確定などの状態遷移をサーバー側で検証する。
- [ ] 禁止する: フロントエンドだけに API 実行順序の強制を任せること。
- [ ] 分離する: 管理エンドポイントを通常 API から分離し、インターネット公開を避ける。
- [ ] 強制する: 管理エンドポイントを公開する必要がある場合は、多要素認証などの強い認証とネットワークアクセス制限を適用する。
- [ ] 実装する: エラー応答を一貫した形式にし、スタックトレース、内部パス、SQL、設定値、トークン、シークレットを含めない。
- [ ] 返却する: 認証失敗、認可失敗、メソッド不一致、Content-Type 不一致、レート制限などに意味的に適切な HTTP ステータスコードを返す。
- [ ] 記録する: 認証、認可、重要操作、管理操作、入力検証失敗、レート制限、異常アクセスを監査ログに残す。
- [ ] 禁止する: パスワード、アクセストークン、リフレッシュトークン、API キー、個人情報をログに平文で記録すること。
- [ ] テストする: 平文 HTTP、過大ペイロード、想定外 Content-Type、想定外メソッド、順序外 API 実行、内部例外、ログマスキング漏れを回帰テストに含める。

### V4.2 RESTful Web Service

- [ ] 実装する: 操作ごと、リソースごと、テナントごとに認可を検証し、クライアントから渡された ID を信頼しない。
- [ ] 確認する: `GET` が状態変更に使われていない。
- [ ] 実装する: `POST`、`PUT`、`PATCH`、`DELETE` などの状態変更操作に、認証、認可、監査ログを適用する。
- [ ] 検証する: JWT の署名、issuer、audience、有効期限、用途、必要な Claim を確認する。
- [ ] 固定する: JWT の受け入れ可能なアルゴリズムをサーバー側設定で制限し、`none` と想定外アルゴリズムを拒否する。
- [ ] 禁止する: JWT の平文 Claim にシークレットや不要な個人情報を含めること。
- [ ] 管理する: API キーに用途、環境、呼び出し元、権限、期限を関連付け、失効とローテーションを可能にする。
- [ ] 禁止する: API キーを URL クエリパラメータで送信すること。ヘッダー送信を標準にする。
- [ ] 禁止する: パスワード、セキュリティトークン、API キーを URL に含めること。
- [ ] 実装する: CORS の許可 origin、メソッド、ヘッダーを許可リストで管理する。
- [ ] 禁止する: credentials 付き CORS でワイルドカード origin または未検証の origin 反射を許可すること。
- [ ] テストする: IDOR、過大 scope、テナント ID 改ざん、JWT 改ざん、期限切れ JWT、CORS origin 反射が失敗する。

### V4.3 GraphQL

- [ ] 確認する: GraphQL エンドポイントがある場合、REST 用チェックリストだけで完了扱いにせず、GraphQL 固有の認可、クエリ制限、イントロスペクション、エラー処理を別途レビューする。

### V4.4 WebSocket

- [ ] 確認する: WebSocket エンドポイントがある場合、接続確立時だけでなくメッセージ単位の認証、認可、入力検証、レート制限、ログを別途レビューする。

### V9.2 Token and Session-Based Authentication

- [ ] 検証する: OAuth 2.0 アクセストークンを API 認可に使う場合、issuer、audience、有効期限、scope を各リクエストで確認する。
- [ ] 禁止する: ID Token を API 認可用アクセストークンとして使用すること。
- [ ] 設計する: Bearer トークンの有効期限を短くし、漏えい時の影響を audience、scope、失効、必要に応じた送信者制約で低減する。
- [ ] テストする: 期限切れ、audience 不一致、scope 不足、改ざん、失効済みトークン、ID Token 誤用が拒否される。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V4.1 General API and Web Service Security | HTTPS、入力検証、Content-Type、HTTP メソッド制御、順序外 API 実行防止、エラー処理、監査ログ |
| V4.2 RESTful Web Service | REST API の認証、認可、JWT、OAuth、API キー、CORS |
| V4.3 GraphQL | ASVS Index 上の関連。GraphQL 固有制御は別ページで確認する |
| V4.4 WebSocket | ASVS Index 上の関連。WebSocket 固有制御は別ページで確認する |
| V9.2 Token and Session-Based Authentication | JWT、Bearer トークン、API キー、トークン有効期限、失効、漏えい時影響の低減 |
