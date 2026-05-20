# 脅威モデリングチートシート 開発チェックリスト

## Attribution

- Original: Threat Modeling Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Development checklist added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../translations/threat-modeling.md](../translations/threat-modeling.md)
- 要約: [../summaries/threat-modeling.md](../summaries/threat-modeling.md)

## 開発チェックリスト

- [ ] 対象システム、変更範囲、守るべき資産を定義する。
- [ ] 主体、外部依存、データストア、管理機能、サプライチェーン要素を棚卸しする。
- [ ] データフロー図を作成し、信頼境界と権限境界を明示する。
- [ ] STRIDE、攻撃ツリー、悪用ケースなどの観点で脅威を洗い出す。
- [ ] なりすまし、改ざん、否認、情報漏えい、サービス拒否、権限昇格を検討する。
- [ ] 各脅威に対策、担当者、期限、テスト観点、残余リスクを割り当てる。
- [ ] 対策しないリスクは明示的に受容し、承認者と理由を記録する。
- [ ] 認証・認可変更、外部連携追加、データフロー変更、依存関係変更時にモデルを更新する。
- [ ] 脅威モデリング結果を要件、設計、Issue、テスト、監査ログへ反映する。
- [ ] 未対応脅威をリリース判定で確認する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V15.1 | 脅威モデリング、データフロー、信頼境界、外部依存、対策と残余リスクの追跡 |
| V2.1 | 悪用ケース、業務フロー、脅威に基づくセキュリティ要件 |

