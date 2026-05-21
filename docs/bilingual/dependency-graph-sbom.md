---
title: Dependency Graph and SBOM Cheat Sheet
hide_title: true
---

<div className="docHero" data-category="asvs-v15">
  <h1>Dependency Graph and SBOM チートシート</h1>
  <div className="docMeta">
    <span className="docPill">最終更新: 2026-05-20</span>
    <span className="docPill">読了時間: 準備中</span>
    <span className="docPill">カテゴリ: セキュアコーディングとアーキテクチャ</span>
  </div>
</div>

<p className="docLead">Dependency Graph and SBOM チートシートを、原文・翻訳・対比表示で確認できます。ASVS Index 対応の文脈で、公式原文と日本語訳を確認しやすく整理しています。</p>

<div className="tabbedContent">
  <input className="tabInput" type="radio" name="dependency-graph-sbom-view" id="dependency-graph-sbom-original" />
  <input className="tabInput" type="radio" name="dependency-graph-sbom-view" id="dependency-graph-sbom-translation" defaultChecked />
  <input className="tabInput" type="radio" name="dependency-graph-sbom-view" id="dependency-graph-sbom-bilingual" />

  <div className="contentTabs">
    <label htmlFor="dependency-graph-sbom-original" title="OWASP 原文">原文</label>
    <label htmlFor="dependency-graph-sbom-translation" title="日本語訳">翻訳</label>
    <label htmlFor="dependency-graph-sbom-bilingual" title="原文と翻訳を並べて確認">対比表示</label>
  </div>

<section id="dependency-graph-sbom-original-panel" className="tabPanel originalPanel contentPanel">

## Introduction

Modern software relies on hundreds of third-party components. A Software Bill of Materials (SBOM) provides a machine-readable inventory of those components, while a dependency graph shows how they relate. Together, they enable accurate vulnerability management, compliance checks, and faster incident response.

### TL;DR — Quick checklist

- Generate SBOMs **during build** (not ad-hoc) to capture exact resolved dependencies and metadata.
- Use standard formats (SPDX or CycloneDX) and publish at least one machine-readable SBOM per release.
- Sign SBOMs and artifacts (cosign / sigstore / in-toto) to bind SBOMs to the built artifact.
- Version and store SBOMs in a trusted artifact store or SBOM management system (e.g., Dependency-Track).
- Automate vulnerability enrichment & triage (Grype, OSS Index, Snyk, commercial feeds) and integrate with ticketing/incident flows.
- Maintain a policy that defines required SBOM elements, retention, and sharing rules.

## Definitions (short)

- **SBOM** — Software Bill of Materials; machine-readable list of components, versions, checksums, and metadata.
- **Component** — A package, library, container image layer, binary, or module included in the product.
- **Dependency graph** — Directed graph of components showing dependency relationships.
- **Provenance / Attestation** — Evidence that the SBOM was produced by the claimed build process and is bound to the artifact.
- **VEX (Vulnerability Exploitability eXchange)** — A machine-readable document that states whether a known vulnerability actually affects a given product/component, and under what conditions.

## Minimum SBOM elements you should capture (practical)

At a minimum capture:

1. Component name and version (canonicalized)
2. Unique package identifiers (purl / package URL) where available
3. Package type/ecosystem (npm, maven, pypi, deb, rpm, apk, OS image)
4. Checksum(s) (SHA256 preferred) of the package or artifact
5. Component supplier / origin (URL or VCS) where known
6. License information (if available)
7. Timestamps (generation time) and build identifiers (CI run ID)
8. Relationship edges: direct vs transitive dependency
9. SBOM generator metadata (tool, version, command)

## SBOM Formats & Generations

- Generate SBOMs during build (after dependency resolution, before packaging) to capture exact versions and metadata.
- Use standard formats:
    1. CycloneDX — lightweight, widely supported in SCA and Dependency-Track.
    2. SPDX — rich, common in compliance/legal workflows.
- Other useful points of generation:
    1. Local/dev for early validation (best-effort).
    2. Container images: build-time + image scan to catch injected content.
    3. Runtime/deployed: telemetry to validate what executes in production.

## Tooling & automation — pragmatic recommendations

**Generate**: Syft, CycloneDX CLI, SPDX tools, or ecosystem exporters. Run in build container/agent.

**Sign / Attest**: Cosign, Sigstore, in-toto — bind SBOM ↔ artifact to prevent tampering.

**Scan / Enrich**: Grype, OSS Index, Snyk, Dependabot — map CVEs to SBOM components.

**Store & Analyze**: Dependency-Track, SBOM managers, or registries with SBOM support.

**Example commands (generation):**

- Syft to CycloneDX JSON:

```bash
syft packages dir:. -o cyclonedx-json > sbom-cyclonedx.json
```text

- Syft to SPDX JSON:

```bash
syft packages dir:. -o spdx-json > sbom-spdx.json
```text

- CycloneDX CLI (from a built artifact):

```bash
cyclonedx-bom -o bom.xml --input-pkg target/my-app.jar
```text

(Place generator commands in your build scripts or CI job and fail the build if SBOM generation fails.)

## Bind SBOM to artifacts (signing & provenance)

**Why:** Unsigned SBOMs can be forged; signing/attestation proves they come from the same trusted build.

**How:**

- Generate artifact + SBOM in the same CI job.
- Use Cosign/Sigstore to sign both; optionally add in-toto/SLSA provenance.
- Push artifact, SBOM, and signatures/attestations to your registry.

**Practical flow:**

build → generate SBOM → compute digests → sign/attest → publish.

## Ingesting & managing SBOMs at scale

Centralize in an SBOM manager (e.g., Dependency-Track) or registry with SBOM support.

Version & retain SBOMs like code for audit/incident response.

Normalize/deduplicate package IDs (purl) across suppliers.

Enrich with vulnerability, license, and policy data for automated triage.

## Vulnerability triage & remediation workflow

- **Map CVE → SBOM component(s)** to see direct vs transitive exposure.
- **Use VEX** where available to understand exploitability — suppliers or tooling may provide VEX documents that indicate whether a CVE is relevant, non-exploitable, or has available mitigations.
- **Prioritize** direct dependencies and high-severity runtime libraries.
- **Patch or Mitigate**: patch if possible; otherwise upgrade, isolate, or apply runtime controls.
- **Track** issues in your system with SBOM + VEX evidence (component, version, digest, exploitability status)
- **Verify** by regenerating SBOM to confirm the vulnerable component is gone.

## Handling transitive dependencies and supply chain depth

- **Visualize** with dependency graphs to show why a vulnerable transitive package is included.
- **Prefer explicit direct upgrades** where possible (bump direct dependency to a version that pulls a fixed transitive release).
- **Consider mitigation patterns**: dependency replacement, patching (if legal and feasible), or runtime limitations.
- **Long-lived third-party binaries**: include policy to monitor and re-evaluate older dependencies that receive no updates.

## SBOM quality — common pitfalls & how to avoid them

Incomplete generation → generate SBOM in build after dependency resolution.

Missing metadata → always include timestamps, checksums, and tool info.

Inconsistent formats → stick to SPDX/CycloneDX; use extensions sparingly.

Unsigned SBOMs / no provenance → sign and attest artifacts.

No versioning or archival → retain historical SBOMs for audit/incident response.

## Policy & governance (what to write into your SBOM policy)

Minimum policy items:

- **Required formats** (CycloneDX vX or SPDX vY), and acceptable alternates
- **Required fields** (see section 3)
- **Where to store** (artifact registry, SBOM manager) and retention policy
- **Signing & attestation requirement** (e.g., all public releases must be signed)
- **SLA for vulnerability response** based on severity and impact
- **Supplier SBOM acceptance rules** (e.g., third-party vendors must supply SBOMs in a supported spec)
- **Access controls** for SBOMs containing sensitive metadata (avoid leaking internal repository URLs if not necessary)

## Practical CI/CD snippets & patterns

**GitHub Actions (example)** — generate CycloneDX and upload as artifact, then sign with cosign.

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
```text

**Fail-fast vs Warn**: In CI, fail the pipeline if SBOM generation fails, but avoid failing builds on non-actionable low-severity findings — instead surface results to triage dashboards.

## Example workflows (short)

**Supplier intake**: Vendor provides signed SBOM -> ingest into DT -> auto-enrich -> if critical CVE found, create ticket and notify procurement + security.

**Internal release**: CI builds artifact + sbom -> sign & push -> SBOM ingested to DT -> scheduled scan enrich -> policy engine flags high-sev/forbidden licenses -> create PR to remediate.

</section>

<section id="dependency-graph-sbom-translation-panel" className="tabPanel translationPanel contentPanel">

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
```text

**Fail-fast vs Warn**: CI では、SBOM 生成に失敗した場合はパイプラインを失敗させる。一方、対応不能な低深刻度の検出結果でビルドを失敗させることは避け、代わりにトリアージダッシュボードへ結果を表示する。

## ワークフロー例 (短縮版)

**サプライヤー受け入れ**: ベンダーが署名済み SBOM を提供 → DT に取り込み → 自動エンリッチ → 重大な CVE が見つかった場合はチケットを作成し、調達部門とセキュリティ部門に通知する。

**内部リリース**: CI がアーティファクトと SBOM をビルド → 署名してプッシュ → SBOM を DT に取り込み → スケジュールされたスキャンでエンリッチ → ポリシーエンジンが高深刻度 / 禁止ライセンスをフラグ付け → 修復用 PR を作成する。

</section>

<section id="dependency-graph-sbom-bilingual-panel" className="tabPanel bilingualPanel">

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Introduction

Modern software relies on hundreds of third-party components. A Software Bill of Materials (SBOM) provides a machine-readable inventory of those components, while a dependency graph shows how they relate. Together, they enable accurate vulnerability management, compliance checks, and faster incident response.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## はじめに

現代のソフトウェアは、数百ものサードパーティコンポーネントに依存している。Software Bill of Materials (SBOM) は、それらのコンポーネントの機械処理可能なインベントリを提供し、依存関係グラフはそれらがどのように関連しているかを示す。この二つを組み合わせることで、正確な脆弱性管理、コンプライアンスチェック、迅速なインシデント対応が可能になる。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### TL;DR — Quick checklist

- Generate SBOMs **during build** (not ad-hoc) to capture exact resolved dependencies and metadata.
- Use standard formats (SPDX or CycloneDX) and publish at least one machine-readable SBOM per release.
- Sign SBOMs and artifacts (cosign / sigstore / in-toto) to bind SBOMs to the built artifact.
- Version and store SBOMs in a trusted artifact store or SBOM management system (e.g., Dependency-Track).
- Automate vulnerability enrichment & triage (Grype, OSS Index, Snyk, commercial feeds) and integrate with ticketing/incident flows.
- Maintain a policy that defines required SBOM elements, retention, and sharing rules.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### TL;DR — クイックチェックリスト

- 正確に解決された依存関係とメタデータを取得するために、SBOM は ad-hoc ではなく **ビルド中** に生成する。
- 標準形式 (SPDX または CycloneDX) を使用し、リリースごとに少なくとも一つの機械処理可能な SBOM を公開する。
- SBOM とアーティファクトを署名し (cosign / sigstore / in-toto)、SBOM をビルド済みアーティファクトに結び付ける。
- SBOM をバージョン管理し、信頼できるアーティファクトストアまたは SBOM 管理システム (Dependency-Track など) に保存する。
- 脆弱性のエンリッチメントとトリアージ (Grype、OSS Index、Snyk、商用フィード) を自動化し、チケット管理やインシデント対応フローと統合する。
- 必須の SBOM 要素、保持期間、共有ルールを定義するポリシーを維持する。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Definitions (short)

- **SBOM** — Software Bill of Materials; machine-readable list of components, versions, checksums, and metadata.
- **Component** — A package, library, container image layer, binary, or module included in the product.
- **Dependency graph** — Directed graph of components showing dependency relationships.
- **Provenance / Attestation** — Evidence that the SBOM was produced by the claimed build process and is bound to the artifact.
- **VEX (Vulnerability Exploitability eXchange)** — A machine-readable document that states whether a known vulnerability actually affects a given product/component, and under what conditions.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 定義 (短縮版)

- **SBOM** — Software Bill of Materials。コンポーネント、バージョン、チェックサム、メタデータの機械処理可能な一覧。
- **コンポーネント** — 製品に含まれるパッケージ、ライブラリ、コンテナイメージレイヤー、バイナリ、またはモジュール。
- **依存関係グラフ** — 依存関係を示す、コンポーネントの有向グラフ。
- **プロベナンス / アテステーション** — SBOM が主張されたビルドプロセスによって生成され、アーティファクトに結び付いていることを示す証拠。
- **VEX (Vulnerability Exploitability eXchange)** — 既知の脆弱性が特定の製品やコンポーネントに実際に影響するかどうか、またどの条件で影響するかを示す機械処理可能な文書。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Minimum SBOM elements you should capture (practical)

At a minimum capture:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 取得すべき最小限の SBOM 要素 (実践)

少なくとも以下を取得する。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

1. Component name and version (canonicalized)
2. Unique package identifiers (purl / package URL) where available
3. Package type/ecosystem (npm, maven, pypi, deb, rpm, apk, OS image)
4. Checksum(s) (SHA256 preferred) of the package or artifact
5. Component supplier / origin (URL or VCS) where known
6. License information (if available)
7. Timestamps (generation time) and build identifiers (CI run ID)
8. Relationship edges: direct vs transitive dependency
9. SBOM generator metadata (tool, version, command)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

1. コンポーネント名とバージョン (正規化済み)
2. 利用可能な場合は一意のパッケージ識別子 (purl / package URL)
3. パッケージ種別またはエコシステム (npm、maven、pypi、deb、rpm、apk、OS イメージ)
4. パッケージまたはアーティファクトのチェックサム (SHA256 を推奨)
5. 判明している場合はコンポーネントの供給者または出所 (URL または VCS)
6. 利用可能な場合はライセンス情報
7. タイムスタンプ (生成時刻) とビルド識別子 (CI 実行 ID)
8. 関係エッジ: 直接依存か推移的依存か
9. SBOM 生成ツールのメタデータ (ツール、バージョン、コマンド)

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## SBOM Formats & Generations

- Generate SBOMs during build (after dependency resolution, before packaging) to capture exact versions and metadata.
- Use standard formats:
    1. CycloneDX — lightweight, widely supported in SCA and Dependency-Track.
    2. SPDX — rich, common in compliance/legal workflows.
- Other useful points of generation:
    1. Local/dev for early validation (best-effort).
    2. Container images: build-time + image scan to catch injected content.
    3. Runtime/deployed: telemetry to validate what executes in production.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## SBOM の形式と生成

- 正確なバージョンとメタデータを取得するために、SBOM はビルド中 (依存関係の解決後、パッケージング前) に生成する。
- 標準形式を使用する。
    1. CycloneDX — 軽量で、SCA や Dependency-Track で広くサポートされている。
    2. SPDX — 情報量が多く、コンプライアンスや法務のワークフローでよく使われる。
- その他の有用な生成ポイント:
    1. ローカル / 開発環境: 早期検証用 (ベストエフォート)。
    2. コンテナイメージ: 注入された内容を検出するため、ビルド時とイメージスキャンで生成する。
    3. ランタイム / デプロイ済み環境: 本番環境で実行されているものを検証するため、テレメトリを使用する。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Tooling & automation — pragmatic recommendations

**Generate**: Syft, CycloneDX CLI, SPDX tools, or ecosystem exporters. Run in build container/agent.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## ツールと自動化 — 実践的な推奨事項

**生成**: Syft、CycloneDX CLI、SPDX ツール、またはエコシステムごとのエクスポータ。ビルドコンテナまたはビルドエージェントで実行する。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Sign / Attest**: Cosign, Sigstore, in-toto — bind SBOM ↔ artifact to prevent tampering.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**署名 / アテスト**: Cosign、Sigstore、in-toto — 改ざんを防ぐために SBOM とアーティファクトを結び付ける。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Scan / Enrich**: Grype, OSS Index, Snyk, Dependabot — map CVEs to SBOM components.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**スキャン / エンリッチ**: Grype、OSS Index、Snyk、Dependabot — CVE を SBOM コンポーネントに対応付ける。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Store & Analyze**: Dependency-Track, SBOM managers, or registries with SBOM support.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**保存と分析**: Dependency-Track、SBOM 管理ツール、または SBOM をサポートするレジストリ。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Example commands (generation):**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**コマンド例 (生成):**

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Syft to CycloneDX JSON:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- Syft で CycloneDX JSON を生成:

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```bash
syft packages dir:. -o cyclonedx-json > sbom-cyclonedx.json
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Syft to SPDX JSON:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- Syft で SPDX JSON を生成:

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```bash
syft packages dir:. -o spdx-json > sbom-spdx.json
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- CycloneDX CLI (from a built artifact):

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- CycloneDX CLI (ビルド済みアーティファクトから):

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```bash
cyclonedx-bom -o bom.xml --input-pkg target/my-app.jar
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

(Place generator commands in your build scripts or CI job and fail the build if SBOM generation fails.)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

生成コマンドはビルドスクリプトまたは CI ジョブに配置し、SBOM 生成に失敗した場合はビルドを失敗させる。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Bind SBOM to artifacts (signing & provenance)

**Why:** Unsigned SBOMs can be forged; signing/attestation proves they come from the same trusted build.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## SBOM をアーティファクトに結び付ける (署名とプロベナンス)

**理由:** 署名されていない SBOM は偽造される可能性がある。署名とアテステーションにより、それらが同じ信頼されたビルドから来ていることを証明できる。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**How:**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**方法:**

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Generate artifact + SBOM in the same CI job.
- Use Cosign/Sigstore to sign both; optionally add in-toto/SLSA provenance.
- Push artifact, SBOM, and signatures/attestations to your registry.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- アーティファクトと SBOM を同じ CI ジョブで生成する。
- Cosign / Sigstore を使用して両方に署名する。必要に応じて in-toto / SLSA provenance を追加する。
- アーティファクト、SBOM、署名 / アテステーションをレジストリにプッシュする。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Practical flow:**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**実践的なフロー:**

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

build → generate SBOM → compute digests → sign/attest → publish.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

ビルド → SBOM 生成 → ダイジェスト計算 → 署名 / アテスト → 公開。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Ingesting & managing SBOMs at scale

Centralize in an SBOM manager (e.g., Dependency-Track) or registry with SBOM support.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 大規模な SBOM の取り込みと管理

SBOM 管理ツール (Dependency-Track など) または SBOM をサポートするレジストリに集中管理する。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Version & retain SBOMs like code for audit/incident response.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

監査やインシデント対応のために、SBOM はコードと同じようにバージョン管理し、保持する。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Normalize/deduplicate package IDs (purl) across suppliers.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

サプライヤー間でパッケージ ID (purl) を正規化し、重複排除する。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Enrich with vulnerability, license, and policy data for automated triage.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

自動トリアージのために、脆弱性、ライセンス、ポリシーデータでエンリッチする。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Vulnerability triage & remediation workflow

- **Map CVE → SBOM component(s)** to see direct vs transitive exposure.
- **Use VEX** where available to understand exploitability — suppliers or tooling may provide VEX documents that indicate whether a CVE is relevant, non-exploitable, or has available mitigations.
- **Prioritize** direct dependencies and high-severity runtime libraries.
- **Patch or Mitigate**: patch if possible; otherwise upgrade, isolate, or apply runtime controls.
- **Track** issues in your system with SBOM + VEX evidence (component, version, digest, exploitability status)
- **Verify** by regenerating SBOM to confirm the vulnerable component is gone.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 脆弱性トリアージと修復ワークフロー

- **CVE → SBOM コンポーネント** を対応付け、直接依存と推移的依存のどちらで露出しているかを確認する。
- 利用可能な場合は **VEX** を使用して悪用可能性を理解する。サプライヤーやツールが、CVE が関連するか、悪用不能か、利用可能な緩和策があるかを示す VEX 文書を提供する場合がある。
- 直接依存と高深刻度のランタイムライブラリを優先する。
- **パッチまたは緩和**: 可能であればパッチを適用する。それ以外の場合はアップグレード、分離、またはランタイム制御を適用する。
- SBOM と VEX の証拠 (コンポーネント、バージョン、ダイジェスト、悪用可能性ステータス) とともに、システム内で課題を追跡する。
- SBOM を再生成し、脆弱なコンポーネントがなくなったことを確認する。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Handling transitive dependencies and supply chain depth

- **Visualize** with dependency graphs to show why a vulnerable transitive package is included.
- **Prefer explicit direct upgrades** where possible (bump direct dependency to a version that pulls a fixed transitive release).
- **Consider mitigation patterns**: dependency replacement, patching (if legal and feasible), or runtime limitations.
- **Long-lived third-party binaries**: include policy to monitor and re-evaluate older dependencies that receive no updates.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 推移的依存関係とサプライチェーンの深さの扱い

- 脆弱な推移的パッケージがなぜ含まれているかを示すために、依存関係グラフで**可視化**する。
- 可能な場合は、明示的な直接依存のアップグレードを優先する (修正版の推移的リリースを取り込むバージョンへ直接依存を上げる)。
- 緩和パターンを検討する: 依存関係の置換、パッチ適用 (法的に可能で実行可能な場合)、またはランタイム制限。
- 長期間使われるサードパーティバイナリ: 更新されなくなった古い依存関係を監視し、再評価するポリシーを含める。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## SBOM quality — common pitfalls & how to avoid them

Incomplete generation → generate SBOM in build after dependency resolution.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## SBOM の品質 — よくある落とし穴と回避方法

不完全な生成 → 依存関係の解決後、ビルド内で SBOM を生成する。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Missing metadata → always include timestamps, checksums, and tool info.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

メタデータ不足 → タイムスタンプ、チェックサム、ツール情報を常に含める。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Inconsistent formats → stick to SPDX/CycloneDX; use extensions sparingly.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

形式の不統一 → SPDX / CycloneDX に統一し、拡張は控えめに使用する。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Unsigned SBOMs / no provenance → sign and attest artifacts.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

署名されていない SBOM / プロベナンスなし → アーティファクトに署名し、アテストする。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

No versioning or archival → retain historical SBOMs for audit/incident response.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

バージョン管理またはアーカイブなし → 監査やインシデント対応のために過去の SBOM を保持する。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Policy & governance (what to write into your SBOM policy)

Minimum policy items:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## ポリシーとガバナンス (SBOM ポリシーに書くべきこと)

最小限のポリシー項目:

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- **Required formats** (CycloneDX vX or SPDX vY), and acceptable alternates
- **Required fields** (see section 3)
- **Where to store** (artifact registry, SBOM manager) and retention policy
- **Signing & attestation requirement** (e.g., all public releases must be signed)
- **SLA for vulnerability response** based on severity and impact
- **Supplier SBOM acceptance rules** (e.g., third-party vendors must supply SBOMs in a supported spec)
- **Access controls** for SBOMs containing sensitive metadata (avoid leaking internal repository URLs if not necessary)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- **必須形式** (CycloneDX vX または SPDX vY) と許容される代替形式
- **必須フィールド** (セクション 3 を参照)
- **保存場所** (アーティファクトレジストリ、SBOM 管理ツール) と保持ポリシー
- **署名とアテステーションの要件** (例: すべての公開リリースは署名必須)
- 深刻度と影響に基づく脆弱性対応の **SLA**
- **サプライヤー SBOM の受け入れルール** (例: サードパーティベンダーはサポートされている仕様の SBOM を提供しなければならない)
- 機密メタデータを含む SBOM の **アクセス制御** (不要であれば内部リポジトリ URL の漏えいを避ける)

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Practical CI/CD snippets & patterns

**GitHub Actions (example)** — generate CycloneDX and upload as artifact, then sign with cosign.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 実践的な CI/CD スニペットとパターン

**GitHub Actions (例)** — CycloneDX を生成してアーティファクトとしてアップロードし、その後 cosign で署名する。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

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

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Fail-fast vs Warn**: In CI, fail the pipeline if SBOM generation fails, but avoid failing builds on non-actionable low-severity findings — instead surface results to triage dashboards.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**Fail-fast vs Warn**: CI では、SBOM 生成に失敗した場合はパイプラインを失敗させる。一方、対応不能な低深刻度の検出結果でビルドを失敗させることは避け、代わりにトリアージダッシュボードへ結果を表示する。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Example workflows (short)

**Supplier intake**: Vendor provides signed SBOM -> ingest into DT -> auto-enrich -> if critical CVE found, create ticket and notify procurement + security.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## ワークフロー例 (短縮版)

**サプライヤー受け入れ**: ベンダーが署名済み SBOM を提供 → DT に取り込み → 自動エンリッチ → 重大な CVE が見つかった場合はチケットを作成し、調達部門とセキュリティ部門に通知する。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Internal release**: CI builds artifact + sbom -> sign & push -> SBOM ingested to DT -> scheduled scan enrich -> policy engine flags high-sev/forbidden licenses -> create PR to remediate.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**内部リリース**: CI がアーティファクトと SBOM をビルド → 署名してプッシュ → SBOM を DT に取り込み → スケジュールされたスキャンでエンリッチ → ポリシーエンジンが高深刻度 / 禁止ライセンスをフラグ付け → 修復用 PR を作成する。

</div>
</div>

</section>
</div>

## References

<div className="referenceFooter">

- [CycloneDX specification and Authoritative Guide](https://cyclonedx.org/guides/OWASP_CycloneDX-Authoritative-Guide-to-SBOM-en.pdf)
- [SPDX and NTIA Minimum Elements for SBOM HOWTO](https://spdx.github.io/spdx-ntia-sbom-howto/)
- [CISA SBOM guidance](https://www.cisa.gov/sbom)
- [OWASP SBOM Forum](https://owasp.org/www-project-sbom-forum/)
- [Software Supply Chain Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Software_Supply_Chain_Security_Cheat_Sheet.html)
- [Vulnerable Dependency Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Vulnerable_Dependency_Management_Cheat_Sheet.html)

</div>


## Attribution

<div className="attributionFooter">

- Original: Dependency Graph and SBOM Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Dependency_Graph_SBOM_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: English original retained for comparison. Japanese translation added. Bilingual display generated from official source and local Japanese translation.
- Retrieved: 2026-05-20

</div>
