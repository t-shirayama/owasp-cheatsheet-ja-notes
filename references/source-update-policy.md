# Source Update Policy

このメモは、OWASP Cheat Sheet Series / ASVS 由来ドキュメントの `Retrieved` 更新と原文更新追従のルールです。

## 基本方針

- `Retrieved` は、対象の公式原文ページを実際に確認した日付を `YYYY-MM-DD` で記録する。
- 原文を確認せずに `Retrieved` だけを機械的に更新しない。
- 公式原文は `cheatsheetseries.owasp.org`、`owasp.org`、公式 OWASP GitHub リポジトリを優先する。
- 原文 URL が変更されている場合は、各ドキュメントの `Source` と [source-map.md](source-map.md) の公式 URL を同時に更新する。

## 更新が必要な場合

- 翻訳または公開用の英日対訳ページを新規作成した。
- 既存の翻訳または英日対訳ページを原文内容に基づいて実質更新した。
- OWASP 原文のタイトル、URL、ライセンス表示、著作者表示、本文、推奨値、設定値が変わっていることを確認した。
- `references/source-map.md` の ASVS 対応、状態、備考を更新した。

## 更新しない場合

- 誤字修正、内部リンク修正、Markdown 整形など、原文確認を伴わないローカル編集だけを行った。
- README、テンプレート、検査スクリプトなど、OWASP 原文から派生していない運用ファイルだけを編集した。
- `Retrieved` の日付だけを揃える目的の編集を行う。

## 追従手順

1. 対象ページを [source-map.md](source-map.md) で確認する。
2. 公式原文 URL を開き、タイトル、ライセンス、著作者または権利者、本文の変更有無を確認する。
3. 変更がある場合は、翻訳と公開用の英日対訳ページの必要箇所を更新する。
4. `Attribution` の `Retrieved` を確認日へ更新する。
5. 必要に応じて `Changes` を実態に合わせる。
6. [source-map.md](source-map.md) の ASVS 対応、状態、備考、参考資料の `Retrieved` を更新する。
7. Markdown lint と link checker を実行する。

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File tools/Invoke-MarkdownLint.ps1
powershell -NoProfile -ExecutionPolicy Bypass -File tools/Invoke-LinkCheck.ps1
```

## 記録粒度

- 1つの Cheat Sheet につき、翻訳、英日対訳ページ、source map の更新を同じコミットにまとめる。
- 複数ページを横断する用語統一やリンク修正は、内容が明確に分かる別コミットにする。
- 原文との差分判断が難しい場合は、対象ファイルまたはコミットメッセージで「確認のみ」か「内容更新あり」かを明示する。
