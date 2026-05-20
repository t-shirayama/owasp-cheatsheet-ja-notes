# ログ語彙チートシート 開発チェックリスト

## Attribution

- Original: Logging Vocabulary Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Logging_Vocabulary_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Development checklist added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../translations/logging-vocabulary.md](../translations/logging-vocabulary.md)
- 要約: [../summaries/logging-vocabulary.md](../summaries/logging-vocabulary.md)

## チェックリスト

- [ ] セキュリティイベント名のカテゴリ接頭辞をチームで統一する。
- [ ] 認証イベントに `authn` 系の語彙を使う。
- [ ] 認可イベントに `authz` 系の語彙を使う。
- [ ] セッション作成、更新、期限切れ、期限切れ後利用を `session` 系イベントとして記録する。
- [ ] 入力検証失敗を `input` 系イベントとして記録する。
- [ ] 攻撃シグナルを `malicious` 系イベントとして分類する。
- [ ] 機密データ操作を `sensitive` 系イベントとして記録する。
- [ ] ユーザー管理操作を `user` 系イベントとして記録する。
- [ ] システム起動、停止、クラッシュ、監視設定変更を `sys` 系イベントとして記録する。
- [ ] 日時を UTC オフセット付き ISO 8601 形式で記録する。
- [ ] アプリケーション ID、イベント名、レベル、説明、送信元、対象リソースを構造化フィールドとして記録する。
- [ ] 監視基盤や SIEM がイベント名をパースできる形式にする。
- [ ] イベント語彙をログ設計書、実装規約、レビュー観点に含める。
- [ ] ログイベントの単体テストまたは統合テストで、イベント名と主要属性を検証する。
- [ ] パスワード、秘密鍵、アクセストークン、直接のセッション ID をイベント名や属性に含めない。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V16.1 Security Logging Documentation | ログイベント名、分類、属性、レベルの標準化 |
| V16.3 Security Events | 認証、認可、セッション、機密データ、システムイベントの語彙化 |
