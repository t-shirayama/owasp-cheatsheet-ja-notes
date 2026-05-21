# OWASP ASVS チートシート索引 日本語版

このリポジトリは、[OWASP Cheat Sheet Series - Index ASVS](https://cheatsheetseries.owasp.org/IndexASVS.html) を起点に、ASVS 項目に対応する OWASP Cheat Sheet Series を日本語で参照しやすくする非公式ドキュメント集です。

公式翻訳ではありません。正確な判断、監査、実装基準への適用では、必ず OWASP の原文と最新の公式資料を確認してください。

## 公開サイト

- 公開ページ: <https://t-shirayama.github.io/owasp-cheatsheet-ja-notes/cheatsheets/>
- 表示モード: `原文`、`翻訳`、`対比表示`
- 状態管理: [references/catalog.json](references/catalog.json) と [references/bilingual-map.md](references/bilingual-map.md)
- 残タスク: [references/todo.md](references/todo.md)

`Full` は原文、翻訳、公開用対訳ページが揃っているページを示します。`Sample` は一部掲載、`Shell` は本文未展開の準備中ページを示します。段落単位の対比表示に追加修正が必要なページは `todo.md` で管理します。

## 管理対象

- 公式英語原文のローカル参照: [docs/originals/](docs/originals/)
- Cheat Sheet 単位の日本語訳: [docs/translations/](docs/translations/)
- GitHub Pages / Docusaurus 用の英日対訳ページ: [docs/bilingual/](docs/bilingual/)
- ASVS 章別の入口: [docs/asvs/](docs/asvs/)
- ASVS 項目、公式 URL、ローカルファイル、掲載状態の対応表: [references/](references/)

## ライセンスと Attribution

OWASP Cheat Sheet Series は Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0) として公開されています。OWASP 由来の内容を翻訳・再構成する場合は、各文書に Attribution を残します。

Attribution には、原文タイトル、原文 URL、著作者または権利者、ライセンス名とライセンス URL、変更内容、原文確認日を含めます。

コード、設定ファイル、スクリプトなど、OWASP 文書の翻案ではない成果物は [MIT License](LICENSE) として扱います。OWASP 由来の原文、翻訳、対訳ページ、画像、Attribution の扱いは [NOTICE.md](NOTICE.md) と [references/license-notes.md](references/license-notes.md) を確認してください。

## 更新の流れ

1. 公式 OWASP 原文の URL と内容を確認します。
2. `docs/originals/<slug>.md` を必要に応じて更新します。
3. `docs/translations/<slug>.md` を原文に追従させます。
4. `docs/bilingual/<slug>.md` を更新します。
5. `references/source-map.md`、`references/bilingual-map.md`、`references/catalog.json` の状態を必要に応じて更新します。
6. 掲載ページ、ASVS ナビゲーション、サイドバーを再生成します。

ナビゲーションと掲載ページだけを更新する場合:

```bash
node tools/generate-bilingual-samples.mjs --navigation-only
```bash

公式英語原文のローカル参照だけを更新する場合:

```bash
node tools/generate-bilingual-samples.mjs --originals-only
```bash

## 検証

Markdown の基本形とリンク確認:

```bash
npm run lint:md
npm run check:links
```bash

Docusaurus サイトの確認:

```bash
npm ci
npm run build
```

`npm run dev` でローカル開発サーバーを起動できます。GitHub Pages へのデプロイは [.github/workflows/deploy-pages.yml](.github/workflows/deploy-pages.yml) で行います。

## 参考資料

- [OWASP Cheat Sheet Series - Index ASVS](https://cheatsheetseries.owasp.org/IndexASVS.html)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [OWASP Application Security Verification Standard](https://owasp.org/www-project-application-security-verification-standard/)
- [Creative Commons Attribution-ShareAlike 4.0 International](https://creativecommons.org/licenses/by-sa/4.0/)
