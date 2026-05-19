# RESTセキュリティチートシート 要約

## Attribution

- Original: REST Security Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese summary added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../../translations/v4/rest-security.md](../../translations/v4/rest-security.md)
- 開発チェックリスト: [../../checklists/v4/rest-security.md](../../checklists/v4/rest-security.md)

## 概要

REST API は Web アプリケーションと同じく、通信保護、認証、認可、入力検証、トークン管理、CORS、HTTP メソッド制御、エラー処理、監査ログが主要な防御領域です。ステートレスな API でも、各リクエストで呼び出し元、対象リソース、許可された操作、トークンの有効性を検証する必要があります。

## 要点

- HTTPS を強制し、API キー、Bearer トークン、Cookie、機密データを平文 HTTP で送信しない。
- 操作ごと、リソースごと、テナントごとに認可を検証し、クライアントから渡された ID や scope を信頼しない。
- JWT は署名、issuer、audience、有効期限、用途を検証し、受け入れるアルゴリズムをサーバー側で固定する。
- API キーは識別用途として扱い、ユーザー認証や細粒度認可の代替にしない。キーはヘッダーで送信し、ローテーションできるようにする。
- OAuth 2.0 のアクセストークンは API 認可用として検証し、ID Token と混同しない。
- 入力検証はパス、クエリ、ヘッダー、Cookie、本文、ファイルアップロードのすべてに対してサーバー側で実施し、リクエストサイズ制限を設ける。
- 不要な HTTP メソッドを拒否し、状態変更操作には認証、認可、監査ログを適用する。
- 業務フローを構成する API では、ワークフロー状態をサーバー側で検証し、順序外の直接呼び出しを拒否する。
- Content-Type と Accept を許可リストで検証し、想定外または欠落した型を `406` または `415` で拒否する。
- 管理エンドポイントはインターネットへ公開せず、必要な場合は強い認証、分離されたポートまたはホスト、ネットワーク制限を適用する。
- CORS は許可 origin、メソッド、ヘッダーを必要最小限にし、origin 反射や credentials 付きワイルドカードを避ける。
- エラー応答から内部情報やシークレットを漏らさず、監査ログには機密値をそのまま記録しない。
- HTTP ステータスコードは意味に応じて使い分け、`401`、`403`、`405`、`406`、`413`、`415`、`429` などを適切に返す。

## 実装時の注意点

- CORS はブラウザの同一オリジン制約を緩和する設定であり、API 認可の代替ではありません。
- JWT の Claim は署名検証後にしか信頼できません。`alg` や `kid` を攻撃者が制御できる入力として扱い、鍵選択とアルゴリズム選択を制限します。
- REST API の IDOR は、URL の ID、本文の ID、テナント ID、親子リソース関係のどこでも起こり得ます。リソース所有者と操作権限をサーバー側で確認します。
- ログの不足はインシデント調査を困難にしますが、過剰なログはトークン、API キー、個人情報の漏えい源になります。ログ項目を設計時に決めます。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V4.1 General API and Web Service Security | HTTPS、入力検証、Content-Type、メソッド制御、順序外 API 実行防止、エラー処理、ログ |
| V4.2 RESTful Web Service | REST API の認証、認可、JWT、OAuth、API キー、CORS |
| V4.3 GraphQL | ASVS Index 上の関連。GraphQL 固有制御は別ページで確認する |
| V4.4 WebSocket | ASVS Index 上の関連。WebSocket 固有制御は別ページで確認する |
| V9.2 Token and Session-Based Authentication | JWT、Bearer トークン、API キー、トークン有効期限と失効 |
