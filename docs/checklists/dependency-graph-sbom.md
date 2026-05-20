# 依存関係グラフとSBOMチートシート 開発チェックリスト

## Attribution

- Original: Dependency Graph and SBOM Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Dependency_Graph_SBOM_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Development checklist added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../translations/dependency-graph-sbom.md](../translations/dependency-graph-sbom.md)
- 要約: [../summaries/dependency-graph-sbom.md](../summaries/dependency-graph-sbom.md)

## 開発チェックリスト

- [ ] SBOM を依存解決後かつ成果物生成と同じ CI ジョブで生成する。
- [ ] CycloneDX または SPDX の機械可読形式を採用する。
- [ ] コンポーネント名、バージョン、purl、種別、チェックサム、供給元、ライセンス、生成時刻、CI ビルド ID を含める。
- [ ] 直接依存と推移的依存の関係を依存関係グラフとして記録する。
- [ ] コンテナイメージ層、OS パッケージ、ランタイム追加コンポーネントも SBOM 対象にする。
- [ ] SBOM、成果物、署名、attestation、provenance を同じリリース単位で保管する。
- [ ] SBOM を信頼できるアーティファクトストア、レジストリ、SBOM 管理システムに保存する。
- [ ] 脆弱性フィードと SBOM を自動照合し、チケットやインシデントフローに連携する。
- [ ] VEX または同等の記録で、脆弱性が実際に影響するかを管理する。
- [ ] 重大脆弱性の修正期限、例外承認、再評価条件を定義する。
- [ ] SBOM 生成失敗時に CI を失敗させる。
- [ ] SBOM 必須項目、保持期間、外部共有ルールをポリシー化する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V15.1 | SBOM 生成、依存関係グラフ、推移的依存、署名、provenance、脆弱性トリアージ |
| V15.2 | 脆弱な依存関係の検出、例外管理、修正期限、リリース単位の影響範囲追跡 |

