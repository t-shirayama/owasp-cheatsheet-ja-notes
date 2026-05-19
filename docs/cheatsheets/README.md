# Cheat Sheets

Cheat Sheet 単位の日本語翻訳・要約・開発チェックリスト本文の正本を置くディレクトリです。

## 方針

- 1つの原文 Cheat Sheet につき、原則として1つの Markdown ファイルを作成します。
- 同じ Cheat Sheet が複数 ASVS 章に対応する場合でも、本文は複製しません。
- 各ファイルには必ず `Attribution` セクションを置きます。
- ファイル名は原文タイトルに対応する ASCII kebab-case にします。

## 作成時の手順

1. 公式の OWASP Cheat Sheet ページを確認します。
2. [../templates/cheatsheet-ja.md](../templates/cheatsheet-ja.md) をもとに本文を作成します。
3. [../../references/source-map.md](../../references/source-map.md) に ASVS 対応を追記します。
4. 関連する [../asvs/](../asvs/) の章ページからリンクします。

## 作成済み

- [ログ記録チートシート](logging.md)
- [ログ語彙チートシート](logging-vocabulary.md)
