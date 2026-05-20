# Bilingual Map

パラグラフ単位で英語原文と日本語訳を上下に並べる対訳ドキュメントの対応表です。

## 方針

- 対訳ファイルは `docs/bilingual/v<chapter>/<slug>.md` に置く。
- 既存の `docs/translations/`、`docs/summaries/`、`docs/checklists/` は残し、対訳表示は別系統で管理する。
- Pilot では代表的な本文ブロックを先行して対訳化し、全文展開時に同じカード形式で不足段落を追加する。
- 各対訳ファイルには Attribution を置き、英語原文を比較用に保持していることを `Changes` に明記する。

## 対応表

| ASVS 項目 | 公式 Cheat Sheet | 公式 URL | 対訳 | 翻訳 | 要約 | チェックリスト | 状態 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| V1.2 | Bean Validation Cheat Sheet | https://cheatsheetseries.owasp.org/cheatsheets/Bean_Validation_Cheat_Sheet.html | [docs/bilingual/v1/bean-validation.md](../docs/bilingual/v1/bean-validation.md) | [docs/translations/v1/bean-validation.md](../docs/translations/v1/bean-validation.md) | [docs/summaries/v1/bean-validation.md](../docs/summaries/v1/bean-validation.md) | [docs/checklists/v1/bean-validation.md](../docs/checklists/v1/bean-validation.md) | Pilot |
| V1.3, V3, V4 | Cross-Site Request Forgery Prevention Cheat Sheet | https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html | [docs/bilingual/v1/csrf-prevention.md](../docs/bilingual/v1/csrf-prevention.md) | [docs/translations/v1/csrf-prevention.md](../docs/translations/v1/csrf-prevention.md) | [docs/summaries/v1/csrf-prevention.md](../docs/summaries/v1/csrf-prevention.md) | [docs/checklists/v1/csrf-prevention.md](../docs/checklists/v1/csrf-prevention.md) | Pilot |
| V11.1, V11.2, V11.3, V11.5, V13.3, V14.1 | Cryptographic Storage Cheat Sheet | https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html | [docs/bilingual/v11/cryptographic-storage.md](../docs/bilingual/v11/cryptographic-storage.md) | [docs/translations/v11/cryptographic-storage.md](../docs/translations/v11/cryptographic-storage.md) | [docs/summaries/v11/cryptographic-storage.md](../docs/summaries/v11/cryptographic-storage.md) | [docs/checklists/v11/cryptographic-storage.md](../docs/checklists/v11/cryptographic-storage.md) | Pilot |
