# Site and Taxonomy Policy

このメモは、静的サイトジェネレータ導入可否と、タグ、カテゴリ、重要度、対象ロールの付与方針をまとめたものです。

## 静的サイトジェネレータ

現時点では、静的サイトジェネレータは導入しません。

理由:

- このリポジトリはドキュメント本文、出典対応表、チェックリストを管理することが主目的である。
- 現在の Markdown 構成は、GitHub 上で直接閲覧でき、追加のビルド手順なしで運用できる。
- パッケージマネージャ、ビルド設定、テーマ、生成物管理を追加すると、翻訳・要約・チェックリストの更新よりも運用負荷が増える。
- 検索性と導線は、ASVS 章別索引、トピック別チェックリスト、source map、非重点ページ詳細化計画で当面補える。

導入を再検討する条件:

- GitHub 上の Markdown 閲覧だけでは検索性や横断導線が不足する。
- タグ、カテゴリ、重要度、対象ロールをページ単位で機械的に扱う必要が出る。
- 公開サイトとして継続運用する方針が決まり、生成物の配置、URL、ライセンス表示、非公式翻訳表示を保てる。
- Markdown lint、link checker、外部リンク確認、Attribution 検査をサイト生成ワークフローへ統合できる。

導入する場合の候補:

| 候補 | 適する場合 | 注意点 |
| --- | --- | --- |
| GitHub Pages + Jekyll | GitHub 標準の軽い公開サイトで十分な場合 | テーマと front matter の管理が必要 |
| MkDocs | ドキュメントサイトの検索、ナビゲーション、階層管理を重視する場合 | Python 依存と設定ファイルが増える |
| Docusaurus | 多言語化、タグ、検索、将来の拡張を重視する場合 | Node.js 依存とビルド運用が重くなる |

## タグとカテゴリ

現時点では、全ページへの front matter 付与は行いません。かわりに、中央管理の分類表と既存インデックスで検索性を確保します。

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
| 文書種別 | translation, summary, checklist, asvs-index, reference | フォルダ構成 |

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
