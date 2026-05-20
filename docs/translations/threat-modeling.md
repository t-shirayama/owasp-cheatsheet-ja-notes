# 脅威モデリングチートシート 日本語訳

## Attribution

- Original: Threat Modeling Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-20

## 日本語訳

脅威モデリングは、アプリケーションや変更について「何を作っているか」「何が悪用され得るか」「それに対して何をするか」「対策が十分か」を体系的に考える活動である。設計初期だけでなく、重要な変更、外部連携追加、認証・認可変更、データフロー変更、サプライチェーン変更のたびに軽量に実施する。

脅威モデリングでは、資産、主体、データフロー、信頼境界、外部依存、認証・認可、保存データ、ログ、管理機能、エラー処理を可視化する。STRIDE、攻撃ツリー、悪用ケース、データフロー図などを使い、なりすまし、改ざん、否認、情報漏えい、サービス拒否、権限昇格などを列挙する。

見つけた脅威は、対策、受け入れ理由、担当者、期限、テスト、残余リスクへ落とす。脅威モデリングの成果は文書で終わらせず、要件、設計、実装タスク、セキュリティテスト、監査ログ、運用手順へ反映する。対策できないリスクは明示的に受容し、後から追跡できるようにする。

軽量な実施でも価値がある。すべての画面やエンドポイントを網羅するより、重要なデータ、信頼境界、権限変更、外部依存、決済、管理機能、サプライチェーンに集中し、継続的に更新する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V15.1 | 脅威モデリング、データフロー、信頼境界、外部依存、対策と残余リスクの追跡 |
| V2.1 | 悪用ケース、業務フロー、脅威に基づくセキュリティ要件 |

