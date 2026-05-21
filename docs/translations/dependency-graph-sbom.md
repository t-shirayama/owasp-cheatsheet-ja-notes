# 依存関係グラフと SBOM チートシート 日本語訳

## Attribution

- Original: Dependency Graph and SBOM Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Dependency_Graph_SBOM_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-21

## 日本語訳

# 依存関係グラフと SBOM のベストプラクティスチートシート

## はじめに

現代のソフトウェアは、数百ものサードパーティコンポーネントに依存している。Software Bill of Materials (SBOM) は、それらのコンポーネントの機械処理可能なインベントリを提供し、依存関係グラフはそれらがどのように関連しているかを示す。この二つを組み合わせることで、正確な脆弱性管理、コンプライアンスチェック、迅速なインシデント対応が可能になる。

### TL;DR — クイックチェックリスト

- 正確に解決された依存関係とメタデータを取得するために、SBOM は ad-hoc ではなく **ビルド中** に生成する。
- 標準形式 (SPDX または CycloneDX) を使用し、リリースごとに少なくとも一つの機械処理可能な SBOM を公開する。
- SBOM とアーティファクトを署名し (cosign / sigstore / in-toto)、SBOM をビルド済みアーティファクトに結び付ける。
- SBOM をバージョン管理し、信頼できるアーティファクトストアまたは SBOM 管理システム (Dependency-Track など) に保存する。
- 脆弱性のエンリッチメントとトリアージ (Grype、OSS Index、Snyk、商用フィード) を自動化し、チケット管理やインシデント対応フローと統合する。
- 必須の SBOM 要素、保持期間、共有ルールを定義するポリシーを維持する。

## 定義 (短縮版)

- **SBOM** — Software Bill of Materials。コンポーネント、バージョン、チェックサム、メタデータの機械処理可能な一覧。
- **コンポーネント** — 製品に含まれるパッケージ、ライブラリ、コンテナイメージレイヤー、バイナリ、またはモジュール。
- **依存関係グラフ** — 依存関係を示す、コンポーネントの有向グラフ。
- **プロベナンス / アテステーション** — SBOM が主張されたビルドプロセスによって生成され、アーティファクトに結び付いていることを示す証拠。
- **VEX (Vulnerability Exploitability eXchange)** — 既知の脆弱性が特定の製品やコンポーネントに実際に影響するかどうか、またどの条件で影響するかを示す機械処理可能な文書。

## 取得すべき最小限の SBOM 要素 (実践)

少なくとも以下を取得する。

1. コンポーネント名とバージョン (正規化済み)
2. 利用可能な場合は一意のパッケージ識別子 (purl / package URL)
3. パッケージ種別またはエコシステム (npm、maven、pypi、deb、rpm、apk、OS イメージ)
4. パッケージまたはアーティファクトのチェックサム (SHA256 を推奨)
5. 判明している場合はコンポーネントの供給者または出所 (URL または VCS)
6. 利用可能な場合はライセンス情報
7. タイムスタンプ (生成時刻) とビルド識別子 (CI 実行 ID)
8. 関係エッジ: 直接依存か推移的依存か
9. SBOM 生成ツールのメタデータ (ツール、バージョン、コマンド)

## SBOM の形式と生成

- 正確なバージョンとメタデータを取得するために、SBOM はビルド中 (依存関係の解決後、パッケージング前) に生成する。
- 標準形式を使用する。
    1. CycloneDX — 軽量で、SCA や Dependency-Track で広くサポートされている。
    2. SPDX — 情報量が多く、コンプライアンスや法務のワークフローでよく使われる。
- その他の有用な生成ポイント:
    1. ローカル / 開発環境: 早期検証用 (ベストエフォート)。
    2. コンテナイメージ: 注入された内容を検出するため、ビルド時とイメージスキャンで生成する。
    3. ランタイム / デプロイ済み環境: 本番環境で実行されているものを検証するため、テレメトリを使用する。

## ツールと自動化 — 実践的な推奨事項

**生成**: Syft、CycloneDX CLI、SPDX ツール、またはエコシステムごとのエクスポータ。ビルドコンテナまたはビルドエージェントで実行する。

**署名 / アテスト**: Cosign、Sigstore、in-toto — 改ざんを防ぐために SBOM とアーティファクトを結び付ける。

**スキャン / エンリッチ**: Grype、OSS Index、Snyk、Dependabot — CVE を SBOM コンポーネントに対応付ける。

**保存と分析**: Dependency-Track、SBOM 管理ツール、または SBOM をサポートするレジストリ。

**コマンド例 (生成):**

- Syft で CycloneDX JSON を生成:

```bash
syft packages dir:. -o cyclonedx-json > sbom-cyclonedx.json
```text

- Syft で SPDX JSON を生成:

```bash
syft packages dir:. -o spdx-json > sbom-spdx.json
```text

- CycloneDX CLI (ビルド済みアーティファクトから):

```bash
cyclonedx-bom -o bom.xml --input-pkg target/my-app.jar
```text

生成コマンドはビルドスクリプトまたは CI ジョブに配置し、SBOM 生成に失敗した場合はビルドを失敗させる。

## SBOM をアーティファクトに結び付ける (署名とプロベナンス)

**理由:** 署名されていない SBOM は偽造される可能性がある。署名とアテステーションにより、それらが同じ信頼されたビルドから来ていることを証明できる。

**方法:**

- アーティファクトと SBOM を同じ CI ジョブで生成する。
- Cosign / Sigstore を使用して両方に署名する。必要に応じて in-toto / SLSA provenance を追加する。
- アーティファクト、SBOM、署名 / アテステーションをレジストリにプッシュする。

**実践的なフロー:**

ビルド → SBOM 生成 → ダイジェスト計算 → 署名 / アテスト → 公開。

## 大規模な SBOM の取り込みと管理

SBOM 管理ツール (Dependency-Track など) または SBOM をサポートするレジストリに集中管理する。

監査やインシデント対応のために、SBOM はコードと同じようにバージョン管理し、保持する。

サプライヤー間でパッケージ ID (purl) を正規化し、重複排除する。

自動トリアージのために、脆弱性、ライセンス、ポリシーデータでエンリッチする。

## 脆弱性トリアージと修復ワークフロー

- **CVE → SBOM コンポーネント** を対応付け、直接依存と推移的依存のどちらで露出しているかを確認する。
- 利用可能な場合は **VEX** を使用して悪用可能性を理解する。サプライヤーやツールが、CVE が関連するか、悪用不能か、利用可能な緩和策があるかを示す VEX 文書を提供する場合がある。
- 直接依存と高深刻度のランタイムライブラリを優先する。
- **パッチまたは緩和**: 可能であればパッチを適用する。それ以外の場合はアップグレード、分離、またはランタイム制御を適用する。
- SBOM と VEX の証拠 (コンポーネント、バージョン、ダイジェスト、悪用可能性ステータス) とともに、システム内で課題を追跡する。
- SBOM を再生成し、脆弱なコンポーネントがなくなったことを確認する。

## 推移的依存関係とサプライチェーンの深さの扱い

- 脆弱な推移的パッケージがなぜ含まれているかを示すために、依存関係グラフで**可視化**する。
- 可能な場合は、明示的な直接依存のアップグレードを優先する (修正版の推移的リリースを取り込むバージョンへ直接依存を上げる)。
- 緩和パターンを検討する: 依存関係の置換、パッチ適用 (法的に可能で実行可能な場合)、またはランタイム制限。
- 長期間使われるサードパーティバイナリ: 更新されなくなった古い依存関係を監視し、再評価するポリシーを含める。

## SBOM の品質 — よくある落とし穴と回避方法

不完全な生成 → 依存関係の解決後、ビルド内で SBOM を生成する。

メタデータ不足 → タイムスタンプ、チェックサム、ツール情報を常に含める。

形式の不統一 → SPDX / CycloneDX に統一し、拡張は控えめに使用する。

署名されていない SBOM / プロベナンスなし → アーティファクトに署名し、アテストする。

バージョン管理またはアーカイブなし → 監査やインシデント対応のために過去の SBOM を保持する。

## ポリシーとガバナンス (SBOM ポリシーに書くべきこと)

最小限のポリシー項目:

- **必須形式** (CycloneDX vX または SPDX vY) と許容される代替形式
- **必須フィールド** (セクション 3 を参照)
- **保存場所** (アーティファクトレジストリ、SBOM 管理ツール) と保持ポリシー
- **署名とアテステーションの要件** (例: すべての公開リリースは署名必須)
- 深刻度と影響に基づく脆弱性対応の **SLA**
- **サプライヤー SBOM の受け入れルール** (例: サードパーティベンダーはサポートされている仕様の SBOM を提供しなければならない)
- 機密メタデータを含む SBOM の **アクセス制御** (不要であれば内部リポジトリ URL の漏えいを避ける)

## 実践的な CI/CD スニペットとパターン

**GitHub Actions (例)** — CycloneDX を生成してアーティファクトとしてアップロードし、その後 cosign で署名する。

```yaml
name: Build and SBOM
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build
        run: ./gradlew assemble
      - name: Generate SBOM
        run: |
          syft packages dir:./build/libs -o cyclonedx-json > sbom.json
      - name: Upload SBOM
        uses: actions/upload-artifact@v4
        with:
          name: sbom
          path: sbom.json
      - name: Sign Artifact & SBOM
        run: |
          cosign sign --key ${{ secrets.COSIGN_KEY }} my-registry/my-app:${{ github.sha }}
          cosign sign-blob --key ${{ secrets.COSIGN_KEY }} --output-signature sbom.json.sig sbom.json
      - name: Push image
        run: ./push-image.sh
```

**Fail-fast vs Warn**: CI では、SBOM 生成に失敗した場合はパイプラインを失敗させる。一方、対応不能な低深刻度の検出結果でビルドを失敗させることは避け、代わりにトリアージダッシュボードへ結果を表示する。

## ワークフロー例 (短縮版)

**サプライヤー受け入れ**: ベンダーが署名済み SBOM を提供 → DT に取り込み → 自動エンリッチ → 重大な CVE が見つかった場合はチケットを作成し、調達部門とセキュリティ部門に通知する。

**内部リリース**: CI がアーティファクトと SBOM をビルド → 署名してプッシュ → SBOM を DT に取り込み → スケジュールされたスキャンでエンリッチ → ポリシーエンジンが高深刻度 / 禁止ライセンスをフラグ付け → 修復用 PR を作成する。

## References

- [CycloneDX specification and Authoritative Guide](https://cyclonedx.org/guides/OWASP_CycloneDX-Authoritative-Guide-to-SBOM-en.pdf)
- [SPDX and NTIA Minimum Elements for SBOM HOWTO](https://spdx.github.io/spdx-ntia-sbom-howto/)
- [CISA SBOM guidance](https://www.cisa.gov/sbom)
- [OWASP SBOM Forum](https://owasp.org/www-project-sbom-forum/)
- [Software Supply Chain Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Software_Supply_Chain_Security_Cheat_Sheet.html)
- [Vulnerable Dependency Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Vulnerable_Dependency_Management_Cheat_Sheet.html)

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V15.1 | SBOM 生成、依存関係グラフ、推移的依存、署名、provenance、脆弱性トリアージ |
| V15.2 | 脆弱な依存関係の検出、例外管理、修正期限、リリース単位の影響範囲追跡 |
