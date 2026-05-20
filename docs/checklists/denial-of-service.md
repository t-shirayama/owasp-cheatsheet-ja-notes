# サービス拒否対策チートシート 開発チェックリスト

## Attribution

- Original: Denial of Service Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Denial_of_Service_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Development checklist added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../translations/denial-of-service.md](../translations/denial-of-service.md)
- 要約: [../summaries/denial-of-service.md](../summaries/denial-of-service.md)

## 開発チェックリスト

- [ ] APIごとにレート制限を設定する。
- [ ] アップロードやリクエスト本文のサイズを制限する。
- [ ] 外部呼び出しにタイムアウトを設定する。
- [ ] 高コスト検索やエクスポートを制御する。
- [ ] DoS兆候を監視しアラート化する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V2.4 | サービス拒否対策チートシート の主要な管理策 |

