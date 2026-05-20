# 攻撃対象領域分析チートシート 開発チェックリスト

## Attribution

- Original: Attack Surface Analysis Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Attack_Surface_Analysis_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Development checklist added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../translations/attack-surface-analysis.md](../translations/attack-surface-analysis.md)
- 要約: [../summaries/attack-surface-analysis.md](../summaries/attack-surface-analysis.md)

## 開発チェックリスト

- [ ] 公開エンドポイント、内部エンドポイント、管理画面、API、バックエンドサービスを一覧化する。
- [ ] ファイルアップロード、WebHook、メッセージキュー、バッチ、外部連携を入口として記録する。
- [ ] 信頼境界、権限境界、ネットワーク境界を図示する。
- [ ] 保存データ、機微操作、高権限機能、管理機能を特定する。
- [ ] 新規依存関係、サードパーティ連携、クラウド設定変更を攻撃対象に含める。
- [ ] 不要なエンドポイント、機能、ポート、管理面を削除または分離する。
- [ ] 各入口に認証、認可、入力検証、レート制限、監査ログ、監視を紐付ける。
- [ ] リリースごとに攻撃対象領域の増加、削減、残余リスクをレビュー記録に残す。
- [ ] 分析結果を脅威モデリング、セキュリティテスト、監視ルールへ反映する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V15.1 | 攻撃対象領域、入口、信頼境界、外部依存、変更差分、削減策の継続管理 |
| V2.1 | 悪用ケースと脅威モデリングへ接続する入口・データフロー分析 |

