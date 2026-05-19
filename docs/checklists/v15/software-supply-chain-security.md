# ソフトウェアサプライチェーンセキュリティチートシート 開発チェックリスト

## Attribution

- Original: Software Supply Chain Security Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Software_Supply_Chain_Security_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Development checklist added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../../translations/v15/software-supply-chain-security.md](../../translations/v15/software-supply-chain-security.md)
- 要約: [../../summaries/v15/software-supply-chain-security.md](../../summaries/v15/software-supply-chain-security.md)

## 開発チェックリスト

### V15.1 Secure Coding and Architecture Documentation

- [ ] 文書化する: IDE、内部コード、依存関係、VCS、ビルドツール、CI/CD、構成管理、パッケージマネージャー、成果物リポジトリを一覧化する。
- [ ] 分類する: ソースコード脅威、ビルド環境脅威、依存関係脅威、デプロイ・ランタイム脅威を脅威モデルに含める。
- [ ] 生成する: SBOM を CI/CD で自動生成し、利用側でも消費できるようにする。
- [ ] 文書化する: ビルドツール、バージョン、プラグイン、パイプライン設定、成果物、provenance メタデータを記録する。
- [ ] 記録する: コードレビュー結果、供給者評価、例外承認、脆弱性対応判断を後から確認できるようにする。

### V15.2 Security Architecture and Dependencies

- [ ] 適用する: VCS、CI/CD、ビルド、成果物リポジトリに最小権限、職務分離、MFA を適用する。
- [ ] ローテーションする: CI/CD とビルド環境の認証情報をローテーションし、平文保存とソース管理へのコミットを禁止する。
- [ ] 監視する: VCS、ビルドツール、配布機構、成果物リポジトリ、実行環境の認証試行と構成変更をログ記録し監視する。
- [ ] 実施する: マージ前に、技術とセキュアコーディングに経験のあるピアによるコードレビューを行う。
- [ ] 強制する: VCS で保護ブランチ、マージポリシー、レビュー必須、シークレットコミット防止を設定する。
- [ ] 管理する: IDE、開発プラグイン、拡張機能を信頼済みのものに限定し、資産インベントリへ含める。
- [ ] 評価する: 供給者と OSS コンポーネントの保守状況、成熟度、脆弱性対応、テスト、ドキュメント、ライセンスを確認する。
- [ ] 監視する: NVD、OSV、CISA KEV、Dependency Check、retire.js などで既知脆弱性を継続監視する。
- [ ] 固定する: lockfile または version pinning により、検証済みの依存関係バージョンを使用する。
- [ ] 硬化する: ビルド環境を分離ネットワークへ置き、未使用サービスを無効化し、DLP などで持ち出しを検知・防止する。
- [ ] 管理する: CI/CD パイプライン設定とビルドスクリプトを VCS 管理し、レビューとマージルールを適用する。
- [ ] 署名する: ビルド成果物にコード署名を適用し、利用側で署名検証を行う。
- [ ] 保護する: コード署名鍵と署名基盤を強く保護する。
- [ ] 使用する: 承認済み成果物だけを取り込むプライベート成果物リポジトリを使い、迂回を防ぐ。
- [ ] 生成する: provenance をビルドプラットフォームで生成し、builder、時刻、入力、成果物を検証可能にする。
- [ ] 実行する: ビルドは隔離された一時環境で行い、完了後に破棄する。
- [ ] 制限する: ユーザー制御可能なビルドパラメータを最小化または排除する。
- [ ] スキャンする: 最終バイナリやコンテナイメージでシークレット、未承認コンポーネント、脆弱性、完全性を確認する。
- [ ] 監視する: デプロイ済みソフトウェア、依存関係、コンテナ、Web サーバー、OS、構成変更を継続監視する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V15.1 Secure Coding and Architecture Documentation | SSC インベントリ、脅威分類、SBOM、provenance、ビルドツール文書化 |
| V15.2 Security Architecture and Dependencies | VCS、依存関係、CI/CD、署名、成果物、ランタイム監視 |
