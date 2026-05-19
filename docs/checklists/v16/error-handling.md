# エラーハンドリングチートシート 開発チェックリスト

## Attribution

- Original: Error Handling Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Error_Handling_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Development checklist added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../../translations/v16/error-handling.md](../../translations/v16/error-handling.md)
- 要約: [../../summaries/v16/error-handling.md](../../summaries/v16/error-handling.md)

## 開発チェックリスト

## エラー応答

- [ ] 本番環境でスタックトレースを返さない。
- [ ] 本番環境で内部ファイルパスを返さない。
- [ ] 本番環境で SQL エラーやクエリ詳細を返さない。
- [ ] 本番環境でフレームワーク、ライブラリ、サーバーのバージョンを返さない。
- [ ] 内部例外メッセージをそのまま API 応答へ含めない。
- [ ] ユーザー向けメッセージを汎用的かつ安全な内容にする。
- [ ] 4xx と 5xx を意味に沿って使う。
- [ ] エラー応答の形式を API 全体で統一する。
- [ ] 必要に応じて相関 ID をエラー応答に含める。

## 実装

- [ ] 予期しない例外を捕捉するグローバルエラーハンドラを実装する。
- [ ] フレームワーク標準のエラーハンドリング設定を本番向けに調整する。
- [ ] デバッグモードや詳細エラーページを本番環境で無効化する。
- [ ] 業務エラー、入力検証エラー、認証エラー、認可エラー、システム障害を区別して扱う。
- [ ] 認証・認可エラーでアカウントやリソースの存在を不要に漏らさない。
- [ ] エラー応答が不適切にキャッシュされないようにする。

## ログ

- [ ] 例外種別、発生箇所、相関 ID、リクエスト ID をサーバー側ログに記録する。
- [ ] 主体、対象リソース、HTTP メソッド、パス、ステータス、発生時刻を記録する。
- [ ] パスワード、アクセストークン、秘密鍵、セッション ID、決済情報をログに直接記録しない。
- [ ] エラー発生時のログがログインジェクションに弱くないことを確認する。
- [ ] エラーログが監視、アラート、インシデント対応へ連携されることを確認する。

## テスト

- [ ] 未処理例外を発生させても汎用応答になることをテストする。
- [ ] エラー詳細がレスポンス本文、ヘッダー、HTML コメントへ漏れないことをテストする。
- [ ] サーバー側ログに調査に必要な情報が残ることをテストする。
- [ ] 本番設定でデバッグページが表示されないことをテストする。
- [ ] 4xx と 5xx の使い分けが仕様どおりであることをテストする。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V16.5 Error Handling | 汎用エラー応答、詳細情報のサーバー側ログ記録、技術情報漏えい防止 |
| V16.2 General Logging | エラー詳細、相関 ID、調査情報の安全なログ記録 |
