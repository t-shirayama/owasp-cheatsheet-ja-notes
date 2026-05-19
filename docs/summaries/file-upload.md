# ファイルアップロードチートシート 要約

## Attribution

- Original: File Upload Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese summary added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../translations/file-upload.md](../translations/file-upload.md)
- 開発チェックリスト: [../checklists/file-upload.md](../checklists/file-upload.md)

## 概要

ファイルアップロードは、マルウェア、パストラバーサル、拡張子偽装、巨大ファイル、公開ディレクトリ配置、処理系脆弱性を招きます。検証、保存、配信、スキャンを分けて設計します。

## 要点

- 許可するファイル種別を明示する。
- 保存名と保存場所をユーザー入力から分離する。
- アップロード後の公開と実行を制御する。

## 実装時の注意点

- この要約はASVS Indexでの利用を前提にした実装者向け整理です。詳細確認時は原文を参照してください。
- 関連する認証、認可、ログ、入力検証、暗号、通信保護の管理策と組み合わせて適用します。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V1.2, V5 | ファイルアップロードチートシート の主要な管理策 |

