# 攻撃対象領域分析チートシート 日本語訳

## Attribution

- Original: Attack Surface Analysis Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Attack_Surface_Analysis_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-20

## 日本語訳

攻撃対象領域分析は、攻撃者がアプリケーションへ入力、接続、操作、影響を与えられる場所を把握し、変更によって増減したリスクを管理する活動である。対象には、Web/API エンドポイント、管理画面、認証・認可境界、ファイルアップロード、外部連携、メッセージキュー、バッチ、バックエンドサービス、クラウド設定、サードパーティ依存が含まれる。

分析では、入口、出口、データフロー、信頼境界、権限境界、保存データ、機微な操作、公開面、内部面を棚卸しする。新機能、設定変更、インフラ変更、依存関係追加、サードパーティ連携、管理機能追加では、攻撃対象領域がどのように変わったかをレビューする。

攻撃対象領域を減らすには、不要なエンドポイントや機能を削除し、管理面を分離し、ネットワーク到達性を制限し、認証・認可を強制し、入力検証、レート制限、監査ログ、監視を適用する。分析結果は、脅威モデリング、セキュリティテスト、レビュー項目、運用監視へ接続する。

攻撃対象領域は一度作って終わりではない。リリース、インシデント、脆弱性公開、依存関係更新、クラウド構成変更のたびに見直し、増加した面と削減した面を記録する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V15.1 | 攻撃対象領域、入口、信頼境界、外部依存、変更差分、削減策の継続管理 |
| V2.1 | 悪用ケースと脅威モデリングへ接続する入口・データフロー分析 |

