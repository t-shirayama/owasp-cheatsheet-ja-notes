# TODO

このリポジトリの未完了タスクです。完了済みの項目はこのファイルから削除します。

## 対比表示の段落ペア化

2026-05-21 に `docs/bilingual/*.md` の `bilingualPanel` を確認したところ、以下のページは `対比表示` がパラグラフ単位の英日ペアになっていない、または本文未展開のため対比表示をまだ提供できていない。

対応時は、公式原文の順序を保ち、意味のある見出し、段落、リスト項目、表行を英日ペアにする。コードブロック、画像、区切り線などの共有要素は重複させず、必要に応じて `コード・画像 (共通)` として配置する。

- [ ] [docs/bilingual/abuse-case.md](../docs/bilingual/abuse-case.md): Full ページだが、対比表示が英語全文ブロックと日本語全文ブロックに分かれており、段落単位の `bilingualPair` になっていない。
- [ ] [docs/bilingual/third-party-javascript-management.md](../docs/bilingual/third-party-javascript-management.md): Full ページだが、対比表示が `## 原文` と `## 日本語訳` の大きな連続ブロックで、段落単位の `bilingualPair` になっていない。
- [ ] [docs/bilingual/laravel-security.md](../docs/bilingual/laravel-security.md): プレースホルダー。原文、翻訳、対比表示を追加する。
- [ ] [docs/bilingual/symfony.md](../docs/bilingual/symfony.md): プレースホルダー。原文、翻訳、対比表示を追加する。
- [ ] [docs/bilingual/unvalidated-redirects-forwards.md](../docs/bilingual/unvalidated-redirects-forwards.md): プレースホルダー。原文、翻訳、対比表示を追加する。
- [ ] [docs/bilingual/websocket-security.md](../docs/bilingual/websocket-security.md): プレースホルダー。原文、翻訳、対比表示を追加する。

## 完了判定

- 対象ページの `対比表示` に、本文全体をカバーする `bilingualPair` がある。
- 英語だけ、または日本語だけの通常本文ブロックが対比表示内に残っていない。ただし共有コード、画像、参照情報、Attribution は除く。
- `原文`、`翻訳`、`対比表示` の各タブで、表示順と内容が公式原文および翻訳ファイルと整合している。
- 必要に応じて `references/bilingual-map.md` の状態や備考を更新している。
