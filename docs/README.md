# Documentation

このディレクトリは、日本語翻訳、英語原文のローカル参照、公開用の英日対訳ページを管理する場所です。

## 非公式性について

このディレクトリの文書は OWASP 公式翻訳ではなく、非公式の日本語訳・英日対訳ページです。正確な判断、監査、実装基準への適用では、必ず各ページの Attribution にある公式原文を確認してください。

## 構成

- [asvs/](asvs/) は ASVS 章別の入口です。
- [bilingual/](bilingual/) は GitHub Pages 用の英日対訳表示です。
- [originals/](originals/) は公式英語原文のローカル参照です。
- [translations/](translations/) は Cheat Sheet 単位の日本語訳です。
- [templates/](templates/) は新規ドキュメント作成用テンプレートです。

## 運用方針

- ASVS 章別に探す場合は [asvs/index.md](asvs/index.md) から始めます。
- 英日対訳表示は [bilingual/](bilingual/) に置き、GitHub Pages の Docusaurus サイトから公開します。
- 翻訳は [translations/](translations/) に置き、公開ページは [bilingual/](bilingual/) へ生成・配置します。
- 同じ Cheat Sheet が複数 ASVS 項目に対応する場合、ASVS 側では本文を複製せず各成果物へリンクします。
- 出典対応表は [../references/source-map.md](../references/source-map.md) で管理します。
