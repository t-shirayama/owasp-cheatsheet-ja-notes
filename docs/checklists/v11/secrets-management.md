# シークレット管理チートシート 開発チェックリスト

## Attribution

- Original: Secrets Management Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Development checklist added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../../translations/v11/secrets-management.md](../../translations/v11/secrets-management.md)
- 要約: [../../summaries/v11/secrets-management.md](../../summaries/v11/secrets-management.md)

## 開発チェックリスト

- [ ] API キー、パスワード、トークン、証明書、秘密鍵、接続文字列を棚卸しする。
- [ ] ソースコード、リポジトリ、コンテナイメージ、CI ログ、チケット、チャット内のシークレットを検出する。
- [ ] 専用シークレットストアで保存時暗号化、アクセス制御、監査を有効化する。
- [ ] 環境、サービス、用途ごとにシークレットを分離する。
- [ ] シークレットアクセスを最小権限にし、サービスアカウント単位で制御する。
- [ ] ローテーションを自動化し、アプリケーションが短期間だけ複数バージョンを扱えるようにする。
- [ ] 漏えい時に即時失効、再発行、影響範囲調査を行う手順を用意する。
- [ ] CI/CD ジョブ権限を最小化し、ログマスキングを設定する。
- [ ] シークレットがビルド成果物、イメージ、配布物に混入しないことを検査する。
- [ ] Kubernetes Secret、環境変数、ファイルマウント、メタデータサービスの露出を評価する。
- [ ] シークレット値をログ、メトリクス、エラー、デバッグ出力に含めない。
- [ ] 誰が、いつ、どのシークレットにアクセスしたかを監査ログに記録する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V11.7 | シークレットの生成、保存、配布、利用、ローテーション、失効、監査 |
| V13.3 | CI/CD、クラウド、コンテナ、Kubernetes、証明書、秘密鍵の安全な取り扱い |

