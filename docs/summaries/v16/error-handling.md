# エラーハンドリングチートシート 要約

## Attribution

- Original: Error Handling Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Error_Handling_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese summary added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../../translations/v16/error-handling.md](../../translations/v16/error-handling.md)
- 開発チェックリスト: [../../checklists/v16/error-handling.md](../../checklists/v16/error-handling.md)

## 概要

エラーハンドリングは、攻撃者へ技術情報を与えないための重要な防御です。未処理例外や詳細すぎるエラー応答は、フレームワーク、ライブラリ、バージョン、内部パス、SQL エラー、注入点の手がかりを漏らします。

アプリケーションは、ユーザーへ安全で一貫した汎用エラー応答を返し、調査に必要な詳細はサーバー側ログに記録します。

## 要点

- 本番環境でスタックトレース、内部パス、SQL エラー、ライブラリ名、バージョンを返さない。
- 予期しない例外を捕捉するグローバルエラーハンドラを実装する。
- 詳細情報はユーザーへ返さず、サーバー側ログへ安全に記録する。
- 4xx と 5xx を意味に沿って使い、処理不能な要求にだけ 5xx を使う。
- API のエラー応答形式を統一し、内部例外メッセージをそのまま返さない。
- 相関 ID を使ってユーザー問い合わせとサーバー側ログを結び付ける。
- デバッグモードや開発者向けエラーページを本番環境で無効化する。

## 実装時の注意点

- エラー応答とログの責務を分離します。ユーザーには安全な情報だけを返し、調査情報はログへ残します。
- 認証・認可エラーでは、アカウント存在確認やリソース存在確認に使える情報を返さないようにします。
- ログにも秘密情報、アクセストークン、セッション ID、決済情報を記録してはいけません。
- エラー応答がキャッシュされないよう、必要に応じてキャッシュ制御を設定します。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V16.5 Error Handling | 汎用エラー応答、詳細情報のサーバー側ログ記録、技術情報漏えい防止 |
| V16.2 General Logging | エラー詳細、相関 ID、調査情報の安全なログ記録 |
