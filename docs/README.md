# Documentation

このディレクトリは、日本語翻訳・要約・開発チェックリストの本文を管理する場所です。

## 構成

- [asvs/](asvs/) は ASVS 章別の入口です。
- [cheatsheets/](cheatsheets/) は Cheat Sheet 単位の翻訳本文の正本です。
- [checklists/](checklists/) は実装・レビュー時に使う横断チェックリストです。
- [templates/](templates/) は新規ドキュメント作成用テンプレートです。

## 運用方針

- ASVS 章別に探す場合は [asvs/index.md](asvs/index.md) から始めます。
- 翻訳・要約・チェックリスト本文は [cheatsheets/](cheatsheets/) に一元化します。
- 同じ Cheat Sheet が複数 ASVS 項目に対応する場合、ASVS 側では本文を複製せずリンクします。
- 出典対応表は [../references/source-map.md](../references/source-map.md) で管理します。
