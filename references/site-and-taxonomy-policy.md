# Site and Taxonomy Policy

このメモは、静的サイトジェネレータ導入可否と、タグ、カテゴリ、重要度、対象ロールの付与方針をまとめたものです。

## 静的サイトジェネレータ

GitHub Pages 公開用の静的サイトジェネレータとして Docusaurus を Pilot 導入します。

理由:

- このリポジトリはドキュメント本文、出典対応表、チェックリストを管理することが主目的である。
- 既存の Markdown 構成は、GitHub 上で直接閲覧できる状態を維持する。
- 画像イメージに近いサイドバー、検索、タブ風導線、対訳カード表示を GitHub Pages で提供するには、Docusaurus が適している。
- Docusaurus の docs plugin は `docs/bilingual/` だけを読み込み対象にし、既存の `docs/translations/`、`docs/summaries/`、`docs/checklists/` は従来どおりのリポジトリ文書として残す。
- GitHub Pages へのデプロイは GitHub Actions で `npm run build` した成果物を公開する。

Pilot で確認する条件:

- 対訳ページで英語原文と日本語訳をパラグラフ単位で比較できる。
- サイドバー、検索、ナビゲーション、非公式翻訳表示、Attribution が表示できる。
- Markdown lint、link checker、Docusaurus build を通常検証に組み込める。
- Pilot 対象の `csrf-prevention`、`bean-validation`、`cryptographic-storage` を確認した後、全文展開に進める。

採用候補の比較:

| 候補 | 適する場合 | 注意点 |
| --- | --- | --- |
| GitHub Pages + Jekyll | GitHub 標準の軽い公開サイトで十分な場合 | 対訳カード、検索、タブ風 UI の追加実装が必要 |
| MkDocs | ドキュメントサイトの検索、ナビゲーション、階層管理を重視する場合 | Python 依存と設定ファイルが増える |
| Docusaurus | 多言語化、タグ、検索、将来の拡張を重視する場合 | Node.js 依存とビルド運用が増えるが、今回採用する |

## タグとカテゴリ

現時点では、全ページへの front matter 付与は行いません。かわりに、中央管理の分類表、既存インデックス、Docusaurus の sidebar で検索性を確保します。

理由:

- 全ページにタグを手作業で付けると、source map、ASVS 章、トピック別チェックリストとの不整合が起きやすい。
- 現在の優先作業は、本文の正確性、Attribution、チェックリスト粒度の維持である。
- 機械処理が必要になった時点で、source map を拡張するほうが一貫性を保ちやすい。

## 管理する分類

分類は [../docs/checklists/by-topic.md](../docs/checklists/by-topic.md) と [source-map.md](source-map.md) を主導線にする。

| 分類 | 値の例 | 管理場所 |
| --- | --- | --- |
| ASVS 章 | V1 から V17 | [source-map.md](source-map.md), [../docs/asvs/index.md](../docs/asvs/index.md) |
| トピック | 入力検証、認証、認可、暗号、ログ、サプライチェーン | [../docs/checklists/by-topic.md](../docs/checklists/by-topic.md) |
| 重要度 | high, medium, low | [todo.md](todo.md), [non-priority-detailing-plan.md](non-priority-detailing-plan.md) |
| 対象ロール | developer, reviewer, architect, sre, incident-response | [../docs/checklists/by-asvs.md](../docs/checklists/by-asvs.md) |
| 文書種別 | bilingual, translation, summary, checklist, asvs-index, reference | フォルダ構成 |

## 将来 front matter を導入する場合

導入する場合は、次の最小項目に限定する。

```yaml
---
title: "<document title>"
source: "<official source URL>"
asvs:
  - "Vx.y"
topics:
  - "<topic>"
importance: "high|medium|low"
roles:
  - "developer"
document_type: "translation|summary|checklist"
retrieved: "YYYY-MM-DD"
unofficial: true
---
```

front matter を導入した場合も、Attribution セクションは削除しない。CC BY-SA 4.0 の表示と変更内容は、本文上で読める形を維持する。
