# シークレット管理チートシート 要約

## Attribution

- Original: Secrets Management Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese summary added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../translations/secrets-management.md](../translations/secrets-management.md)
- 開発チェックリスト: [../checklists/secrets-management.md](../checklists/secrets-management.md)

## 概要

シークレット管理は、API キー、パスワード、トークン、証明書、秘密鍵、接続文字列などを安全に作成、保存、配布、利用、ローテーション、失効、監査する実践である。漏えいしたシークレットは認証、認可、データ保護、サプライチェーン侵害へ直結する。

## 要点

- シークレットをコード、リポジトリ、イメージ、ログ、チケット、チャットへ埋め込まない。
- 専用のシークレット管理システムで保存時暗号化、アクセス制御、監査、ローテーションを行う。
- 環境、サービス、用途ごとにシークレットを分離し、最小権限でアクセスさせる。
- ローテーションを自動化し、アプリケーションが短期間だけ複数バージョンを扱えるようにする。
- CI/CD ログ、成果物、Kubernetes Secret、環境変数、メタデータサービスの露出を評価する。
- 漏えい検出時は値の削除だけでなく、即時失効と再発行を行う。

## 実装時の注意点

- シークレット値をログに出さず、マスキングと保持期間を設計する。
- シークレットスキャンはリポジトリだけでなく、成果物、イメージ、CI ログにも適用する。
- アクセス監査では、誰が、いつ、どのシークレットへアクセスしたかを追跡する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V11.7 | シークレットの生成、保存、配布、利用、ローテーション、失効、監査 |
| V13.3 | CI/CD、クラウド、コンテナ、Kubernetes、証明書、秘密鍵の安全な取り扱い |

