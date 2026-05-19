# ファイルアップロードチートシート 開発チェックリスト

## Attribution

- Original: File Upload Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Development checklist added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../../translations/v1/file-upload.md](../../translations/v1/file-upload.md)
- 要約: [../../summaries/v1/file-upload.md](../../summaries/v1/file-upload.md)

## 開発チェックリスト

- [ ] 拡張子とMIMEと内容を検証する。
- [ ] ファイルサイズを制限する。
- [ ] アップロードファイル名をそのまま使わない。
- [ ] Webルート外に保存する。
- [ ] マルウェアスキャンと隔離処理を検討する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V1.2, V5 | ファイルアップロードチートシート の主要な管理策 |

