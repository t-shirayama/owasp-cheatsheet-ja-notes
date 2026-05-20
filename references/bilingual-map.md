# Bilingual Map

パラグラフ単位で英語原文と日本語訳を上下に並べる対訳ドキュメントの対応表です。

## 方針

- 対訳ファイルは `docs/bilingual/<slug>.md` に置く。
- 既存の `docs/translations/`、`docs/summaries/`、`docs/checklists/` は残し、対訳表示は別系統で管理する。
- Pilot から Full に進めるページでは、公式ページの見出し、段落、箇条書き、表、コードブロック、画像を可能な限り同じ順序で再現する。
- 公式ページ内の画像はローカル保存し、対訳ページから `static/img/owasp-cheatsheets/<slug>/` 配下のファイルを参照する。
- 各対訳ファイルには Attribution を置き、英語原文を比較用に保持していることを `Changes` に明記する。

## 対応表

| ASVS 項目 | 公式 Cheat Sheet | 公式 URL | 対訳 | 翻訳 | 要約 | チェックリスト | 状態 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| V1.2 | Bean Validation Cheat Sheet | https://cheatsheetseries.owasp.org/cheatsheets/Bean_Validation_Cheat_Sheet.html | [docs/bilingual/bean-validation.md](../docs/bilingual/bean-validation.md) | [docs/translations/bean-validation.md](../docs/translations/bean-validation.md) | [docs/summaries/bean-validation.md](../docs/summaries/bean-validation.md) | [docs/checklists/bean-validation.md](../docs/checklists/bean-validation.md) | Full |
| V1.3, V3, V4 | Cross-Site Request Forgery Prevention Cheat Sheet | https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html | [docs/bilingual/csrf-prevention.md](../docs/bilingual/csrf-prevention.md) | [docs/translations/csrf-prevention.md](../docs/translations/csrf-prevention.md) | [docs/summaries/csrf-prevention.md](../docs/summaries/csrf-prevention.md) | [docs/checklists/csrf-prevention.md](../docs/checklists/csrf-prevention.md) | Full |
| V11.1, V11.2, V11.3, V11.5, V13.3, V14.1 | Cryptographic Storage Cheat Sheet | https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html | [docs/bilingual/cryptographic-storage.md](../docs/bilingual/cryptographic-storage.md) | [docs/translations/cryptographic-storage.md](../docs/translations/cryptographic-storage.md) | [docs/summaries/cryptographic-storage.md](../docs/summaries/cryptographic-storage.md) | [docs/checklists/cryptographic-storage.md](../docs/checklists/cryptographic-storage.md) | Full |
