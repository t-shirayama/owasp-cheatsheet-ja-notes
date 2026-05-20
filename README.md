# OWASP ASVS Cheat Sheet Japanese Notes

このリポジトリは、[OWASP Cheat Sheet Series - Index ASVS](https://cheatsheetseries.owasp.org/IndexASVS.html) を起点に、ASVS 項目に対応する OWASP Cheat Sheet Series を日本語で読みやすくする非公式ドキュメント集です。

公式翻訳ではありません。正確な判断が必要な場合は、必ず OWASP の原文と最新の公式資料を確認してください。

## このリポジトリで管理するもの

- 公式英語原文のローカル参照
- Cheat Sheet 単位の日本語訳
- GitHub Pages / Docusaurus 用の英日対訳ページ
- ASVS 項目、公式 URL、ローカルファイルの対応表
- Attribution、ライセンス、原文確認日などの運用メモ

公開用の対訳ページでは、`原文`、`翻訳`、`対比表示` の3モードで内容を確認できます。`対比表示` では、英語原文と日本語訳を同じ順序のブロックとして並べます。

## ライセンスと Attribution

OWASP Cheat Sheet Series は Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0) として公開されています。OWASP 由来の内容を翻訳・再構成する場合は、各文書に Attribution を残します。

Attribution には少なくとも次を含めます。

- 原文タイトル
- 原文 URL
- 著作者または権利者
- ライセンス名とライセンス URL
- 翻訳、英語原文保持、英日対訳化などの変更内容
- 原文を確認した日付

コード、設定ファイル、スクリプトなど、OWASP 文書の翻案ではない成果物を追加する場合は、別ライセンスにするか、このリポジトリ全体のライセンス方針を明示してください。

## フォルダ構成

```text
.
├── docs/
│   ├── asvs/          # ASVS 章別の入口と対応表
│   ├── bilingual/     # GitHub Pages 用の英日対訳表示
│   ├── originals/     # 公式英語原文のローカル参照
│   ├── translations/  # 原文に対応する日本語訳
│   └── templates/     # 新規ドキュメント作成用テンプレート
├── src/               # Docusaurus のページとスタイル
├── static/            # Docusaurus の静的アセット
├── tools/             # 生成・検証用スクリプト
└── references/        # 対応表、ライセンス方針、運用メモ
```

よく使う入口:

- [docs/bilingual/](docs/bilingual/) - 公開サイト用の英日対訳ページ
- [docs/originals/](docs/originals/) - 公式英語原文のローカル参照
- [docs/translations/](docs/translations/) - 日本語訳
- [references/source-map.md](references/source-map.md) - ASVS-to-source-to-local-file 対応表
- [references/bilingual-map.md](references/bilingual-map.md) - 公開用対訳ページ対応表
- [references/todo.md](references/todo.md) - 残作業候補

## 更新の流れ

1. 公式 OWASP 原文の URL と内容を確認します。
2. `docs/originals/<slug>.md` を必要に応じて更新します。
3. `docs/translations/<slug>.md` を原文に追従させます。
4. `tools/generate-bilingual-samples.mjs` で `docs/bilingual/<slug>.md` を更新します。
5. `references/source-map.md` と `references/bilingual-map.md` の状態を必要に応じて更新します。

生成系の変更後は、意図しない広範囲差分が出ていないか確認してください。

## 検証

Markdown の基本形とリンク確認:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File tools/Invoke-MarkdownLint.ps1
powershell -NoProfile -ExecutionPolicy Bypass -File tools/Invoke-LinkCheck.ps1
```

Docusaurus サイトの確認:

```powershell
npm install
npm run build
```

`npm run dev` でローカル開発サーバーを起動できます。GitHub Pages へのデプロイは `.github/workflows/deploy-pages.yml` で行います。

## 参考資料

- [OWASP Cheat Sheet Series - Index ASVS](https://cheatsheetseries.owasp.org/IndexASVS.html)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [OWASP Application Security Verification Standard](https://owasp.org/www-project-application-security-verification-standard/)
- [Creative Commons Attribution-ShareAlike 4.0 International](https://creativecommons.org/licenses/by-sa/4.0/)
