# ソフトウェアサプライチェーンセキュリティチートシート 要約

## Attribution

- Original: Software Supply Chain Security Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Software_Supply_Chain_Security_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese summary added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../translations/software-supply-chain-security.md](../translations/software-supply-chain-security.md)
- 開発チェックリスト: [../checklists/software-supply-chain-security.md](../checklists/software-supply-chain-security.md)

## 概要

ソフトウェアサプライチェーンは、IDE、内部コード、依存関係、VCS、ビルドツール、CI/CD、構成管理、パッケージマネージャー、成果物リポジトリ、デプロイ経路、ランタイム環境を含みます。1つの構成要素の侵害が下流へ連鎖するため、ソース、依存関係、ビルド、配布、ランタイムを継続的に管理します。

## 要点

- 開発、ビルド、VCS、CI/CD、成果物リポジトリに最小権限、職務分離、MFA、認証情報ローテーションを適用する。
- VCS、ビルドツール、配布機構、成果物リポジトリ、実行環境の認証試行と構成変更をログ記録し監視する。
- コードレビューをマージ前に実施し、意図しない脆弱性と悪意あるコードの両方を確認する。
- VCS では保護ブランチ、マージポリシー、レビュー必須、シークレットコミット禁止を適用する。
- 供給者と OSS コンポーネントの保守状況、成熟度、脆弱性対応、ライセンス、ドキュメントを評価する。
- SBOM を CI/CD で生成・消費し、NVD、OSV、CISA KEV などから依存関係脆弱性を監視する。
- lockfile や version pinning で検証済みバージョンに固定する。
- ビルドツールとプラグインのインベントリを持ち、ビルド環境を分離・強化する。
- コード署名、プライベート成果物リポジトリ、provenance、隔離された一時ビルド環境を使う。
- 最終成果物とデプロイ済みソフトウェアを継続的にスキャンし、構成変更も監視する。

## 実装時の注意点

- セキュリティ自動化は必要ですが、SAST/SCA などの結果には誤検知と見逃しがあるため、手動確認と例外管理が必要です。
- セキュリティツール自体もサプライチェーンの一部です。保守、権限、設定、ログ監視を怠るとリスクが増えます。
- コード署名は署名鍵と署名プロセスが守られている場合に意味があります。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V15.1 Secure Coding and Architecture Documentation | SSC インベントリ、脅威分類、SBOM、provenance、ビルドツール文書化 |
| V15.2 Security Architecture and Dependencies | VCS、依存関係、CI/CD、署名、成果物、ランタイム監視 |
