# 依存関係グラフとSBOMチートシート 日本語訳

## Attribution

- Original: Dependency Graph and SBOM Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Dependency_Graph_SBOM_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-20

## 関連ファイル

- 要約: [../summaries/dependency-graph-sbom.md](../summaries/dependency-graph-sbom.md)
- 開発チェックリスト: [../checklists/dependency-graph-sbom.md](../checklists/dependency-graph-sbom.md)

## 日本語訳

依存関係グラフと SBOM (Software Bill of Materials) は、製品に含まれるコンポーネント、バージョン、チェックサム、ライセンス、直接依存、推移的依存、生成元を機械処理可能な形で把握するための基盤である。これにより、脆弱性管理、コンプライアンス、インシデント対応、影響範囲調査を素早く行える。

SBOM は ad hoc に作るのではなく、ビルド時に生成する。依存解決後、パッケージング前、または成果物生成と同じ CI ジョブで作成し、実際にリリースされる成果物と一致させる。形式は CycloneDX または SPDX を使い、少なくともコンポーネント名、バージョン、purl、パッケージ種別、SHA-256 などのチェックサム、供給元、ライセンス、生成時刻、CI ビルド ID、直接/推移関係、生成ツール情報を含める。

SBOM と成果物は同じビルドで生成し、ダイジェストで結び付け、署名または attest する。cosign、Sigstore、in-toto、SLSA provenance などを使い、SBOM が対象成果物から生成されたことを示す。SBOM は信頼できるアーティファクトストア、レジストリ、SBOM 管理システムに保管し、リリース単位でバージョン管理する。

SBOM は保管するだけでは不十分である。脆弱性フィード、SCA、OSS Index、Grype、Snyk、Dependabot などと連携し、CVE とコンポーネントを照合し、VEX などで実際の影響有無を記録し、チケット、例外承認、修正期限、インシデント対応へつなげる。推移的依存やコンテナイメージ層、OS パッケージ、ランタイムで追加されるコンポーネントも対象に含める。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V15.1 | SBOM 生成、依存関係グラフ、推移的依存、署名、provenance、脆弱性トリアージ |
| V15.2 | 脆弱な依存関係の検出、例外管理、修正期限、リリース単位の影響範囲追跡 |

