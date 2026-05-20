# Documentation

このディレクトリは、日本語翻訳・要約・開発チェックリストの本文を管理する場所です。

## 非公式性について

このディレクトリの文書は OWASP 公式翻訳ではなく、非公式の日本語訳・要約・チェックリストです。正確な判断、監査、実装基準への適用では、必ず各ページの Attribution にある公式原文を確認してください。

## 構成

- [asvs/](asvs/) は ASVS 章別の入口です。
- [bilingual/](bilingual/) は GitHub Pages 用の英日対訳表示です。
- [translations/](translations/) は Cheat Sheet 単位の日本語訳です。
- [summaries/](summaries/) は Cheat Sheet 単位の日本語要約です。
- [checklists/](checklists/) は実装・レビュー時に使う横断チェックリストです。
- [templates/](templates/) は新規ドキュメント作成用テンプレートです。

## 運用方針

- ASVS 章別に探す場合は [asvs/index.md](asvs/index.md) から始めます。
- 英日対訳表示は [bilingual/](bilingual/) に置き、GitHub Pages の Docusaurus サイトから公開します。
- 翻訳は [translations/](translations/) に、要約は [summaries/](summaries/) に、チェックリストは [checklists/](checklists/) に分けます。
- 同じ Cheat Sheet が複数 ASVS 項目に対応する場合、ASVS 側では本文を複製せず各成果物へリンクします。
- 出典対応表は [../references/source-map.md](../references/source-map.md) で管理します。
