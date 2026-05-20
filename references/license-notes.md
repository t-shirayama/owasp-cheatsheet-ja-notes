# License Notes

このリポジトリで OWASP Cheat Sheet Series / ASVS 由来のドキュメントを作成する際のライセンス運用メモです。

## 基本方針

- OWASP 由来の翻訳、要約、チェックリストは Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0) の条件に従います。
- 各ドキュメントには `Attribution` セクションを置きます。
- 原文タイトル、原文 URL、著作者または権利者、ライセンス、ライセンス URL、変更内容、取得日を記載します。
- このリポジトリは非公式であり、OWASP 公式翻訳として表示しません。
- Web 公開用の対訳ページでは、公式ページの見出し、段落、箇条書き、表、コードブロック、画像を可能な限り同じ順序で再現します。
- 公式ページ内の画像を再利用する場合は、ホットリンクせず `static/img/owasp-cheatsheets/<slug>/` にローカル保存し、各ページの `Attribution` に画像の公式ソース URL と変更内容を記録します。
- OWASP のロゴや商標は CC BY-SA の著作権許諾とは別に扱い、公式翻訳または OWASP による承認を示唆する見せ方を避けます。

## Attribution テンプレート

```markdown
## Attribution

- Original: <Original title>
- Source: <Source URL>
- Copyright: <Copyright holder or author shown by source>
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: YYYY-MM-DD
```

要約ファイルでは `Changes` を次のようにします。

```markdown
- Changes: Japanese summary added.
```

チェックリストファイルでは `Changes` を次のようにします。

```markdown
- Changes: Development checklist added.
```

対訳ページで英語原文、翻訳、ローカル保存画像を含める場合は `Changes` を次のようにします。

```markdown
- Changes: English original retained for comparison. Japanese translation added. Source images stored locally.
```

## 参考資料

- OWASP Cheat Sheet Series: https://cheatsheetseries.owasp.org/
- OWASP ASVS Index: https://cheatsheetseries.owasp.org/IndexASVS.html
- CC BY-SA 4.0: https://creativecommons.org/licenses/by-sa/4.0/
