# ファイルアップロードチートシート 日本語訳

## Attribution

- Original: File Upload Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-20

## 日本語訳

ファイルアップロードは、マルウェア、パストラバーサル、拡張子偽装、巨大ファイル、公開ディレクトリ配置、処理系脆弱性を招きます。検証、保存、配信、スキャンを分けて設計します。

## 主要な観点

- 許可するファイル種別を明示する。
- 保存名と保存場所をユーザー入力から分離する。
- アップロード後の公開と実行を制御する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V1.2, V5 | ファイルアップロードチートシート の主要な管理策 |

