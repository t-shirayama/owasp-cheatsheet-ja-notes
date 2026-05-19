# デシリアライゼーションチートシート 開発チェックリスト

## Attribution

- Original: Deserialization Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Deserialization_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Development checklist added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../../translations/v1/deserialization.md](../../translations/v1/deserialization.md)
- 要約: [../../summaries/v1/deserialization.md](../../summaries/v1/deserialization.md)

## 開発チェックリスト

- [ ] デシリアライズ箇所を棚卸しする。
- [ ] 危険な汎用オブジェクト復元を避ける。
- [ ] 許可された型だけを復元する。
- [ ] シリアライズデータの署名を検証する。
- [ ] 既知のガジェットチェーン対策を適用する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V1.5 | デシリアライゼーションチートシート の主要な管理策 |

