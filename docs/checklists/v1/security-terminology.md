# セキュリティ用語チートシート 開発チェックリスト

## Attribution

- Original: Security Terminology Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Security_Terminology_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Development checklist added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../../translations/v1/security-terminology.md](../../translations/v1/security-terminology.md)
- 要約: [../../summaries/v1/security-terminology.md](../../summaries/v1/security-terminology.md)

## 開発チェックリスト

- [ ] 認証(AuthN)と認可(AuthZ)を設計、実装、テストで区別する。
- [ ] エンコーディングをセキュリティ制御として過大評価していないことを確認する。
- [ ] インジェクション対策では、入力サニタイズだけでなくパラメータ化や適切な出力エンコーディングを実装する。
- [ ] 暗号化、ハッシュ、デジタル署名の目的を設計書に明記する。
- [ ] 信頼できないデータのデシリアライズを禁止または厳格に制御する。
- [ ] レビューで用語の誤用による要件漏れやテスト漏れを確認する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V1.1, V6.1, V8.1, V11.1, V15.1 | 共通語彙、暗号、データ保護、入力処理、管理プロセス |

