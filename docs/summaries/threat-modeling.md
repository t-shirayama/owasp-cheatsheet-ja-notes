# 脅威モデリングチートシート 要約

## Attribution

- Original: Threat Modeling Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese summary added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../translations/threat-modeling.md](../translations/threat-modeling.md)
- 開発チェックリスト: [../checklists/threat-modeling.md](../checklists/threat-modeling.md)

## 概要

脅威モデリングは、「何を作っているか」「何が悪用され得るか」「それに対して何をするか」「対策が十分か」を体系的に考える活動である。設計初期だけでなく、重要な変更、外部連携追加、認証・認可変更、データフロー変更、サプライチェーン変更のたびに実施する。

## 要点

- 資産、主体、データフロー、信頼境界、外部依存、保存データを可視化する。
- STRIDE、攻撃ツリー、悪用ケース、データフロー図などで脅威を列挙する。
- 脅威を対策、受け入れ理由、担当者、期限、テスト、残余リスクへ落とす。
- 成果を要件、設計、実装タスク、セキュリティテスト、監査ログ、運用手順へ反映する。
- 重要データ、権限変更、管理機能、決済、外部依存、サプライチェーンに集中して継続更新する。

## 実装時の注意点

- 文書化だけで終わらせず、未対応リスクをチケット化する。
- 対策しないリスクは明示的に受容し、後から追跡できるようにする。
- 変更時にモデルを更新しないと、設計時点の安全性がすぐに古くなる。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V15.1 | 脅威モデリング、データフロー、信頼境界、外部依存、対策と残余リスクの追跡 |
| V2.1 | 悪用ケース、業務フロー、脅威に基づくセキュリティ要件 |

