# 依存関係グラフとSBOMチートシート 要約

## Attribution

- Original: Dependency Graph and SBOM Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Dependency_Graph_SBOM_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese summary added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../../translations/v15/dependency-graph-sbom.md](../../translations/v15/dependency-graph-sbom.md)
- 開発チェックリスト: [../../checklists/v15/dependency-graph-sbom.md](../../checklists/v15/dependency-graph-sbom.md)

## 概要

依存関係グラフと SBOM は、製品に含まれるコンポーネント、バージョン、チェックサム、ライセンス、直接/推移依存、生成元を機械処理可能に管理する基盤である。ビルド時生成、標準形式、署名、保管、脆弱性トリアージまで含めて運用する。

## 要点

- SBOM は依存解決後、成果物と同じ CI ジョブで生成する。
- CycloneDX または SPDX を使い、リリースごとに機械可読 SBOM を保管する。
- コンポーネント名、バージョン、purl、種別、チェックサム、供給元、ライセンス、生成時刻、依存関係、生成ツール情報を含める。
- SBOM と成果物をダイジェスト、署名、attestation、provenance で結び付ける。
- 脆弱性フィードと照合し、VEX、チケット、例外、修正期限へつなげる。
- 推移的依存、コンテナイメージ層、OS パッケージ、ランタイム追加コンポーネントを対象に含める。

## 実装時の注意点

- SBOM は保管するだけでは価値が薄い。影響範囲調査、脆弱性対応、インシデント対応へ接続する。
- 生成失敗を許容するとリリース単位の追跡が崩れるため、CI の失敗条件にする。
- SBOM 共有方針、保持期間、必須項目をポリシー化する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V15.1 | SBOM 生成、依存関係グラフ、推移的依存、署名、provenance、脆弱性トリアージ |
| V15.2 | 脆弱な依存関係の検出、例外管理、修正期限、リリース単位の影響範囲追跡 |

