# OWASP Cheat Sheet Series ASVS Japanese Notes

このリポジトリは、[OWASP Cheat Sheet Series - Index ASVS](https://cheatsheetseries.owasp.org/IndexASVS.html) を起点に、関連する OWASP Cheat Sheet Series / ASVS の内容を日本語で翻訳・要約し、開発チェックリストとして使いやすく整理する非公式ドキュメント集です。

公式翻訳ではありません。正確な判断が必要な場合は、必ず OWASP の原文と最新の公式資料を確認してください。

## 目的

- OWASP Cheat Sheet Series と ASVS の内容を日本語で読みやすくする
- 開発者が実装時に確認できるチェックリストへ落とし込む
- セキュリティレビュー、設計レビュー、実装タスク化に使える形で整理する
- 出典、著作者、ライセンス、変更有無を明示して再利用しやすくする

## 想定するドキュメント

各ドキュメントは、原則として次の構成で作成します。

```markdown
# 日本語タイトル

## Attribution

- Original: <原文タイトル>
- Source: <原文URL>
- Copyright: OWASP Foundation / Cheat Sheets Series Team など、原文に記載された著作者・権利者
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation, summary, and development checklist added.
- Retrieved: YYYY-MM-DD

## 概要

## 日本語訳・要約

## 開発チェックリスト

## 実装時の注意点

## 参考資料
```

## ライセンスと Attribution

OWASP Cheat Sheet Series は、サイト上で Creative Commons Attribution-ShareAlike 4.0 International と表示されています。Creative Commons の CC BY-SA 4.0 では、共有や翻案が許可される一方で、適切なクレジット表示、ライセンスへのリンク、変更有無の表示、同一ライセンスでの共有が求められます。

このリポジトリで作成する翻訳・要約・チェックリストなど、OWASP の CC BY-SA 4.0 コンテンツを翻案したドキュメントは、原則として CC BY-SA 4.0 のもとで公開します。各ページには必ず Attribution セクションを置き、少なくとも次を記載してください。

- 原文タイトル
- 原文 URL
- 著作者または権利者
- ライセンス名とライセンス URL
- 翻訳、要約、チェックリスト化などの変更内容
- 原文を確認した日付

コード、設定ファイル、スクリプトなど、OWASP 文書の翻案ではない成果物を追加する場合は、別ライセンスにするか、このリポジトリ全体のライセンス方針を明示してください。

## フォルダ構成

このリポジトリは、ASVS 章別を主導線にしつつ、翻訳本文は Cheat Sheet 単位で一元管理します。同じ Cheat Sheet が複数の ASVS 項目に紐づく場合でも、翻訳本文は重複させず、ASVS 側から正本へリンクします。

```text
.
├── docs/
│   ├── asvs/          # ASVS 章別の入口と対応表
│   ├── cheatsheets/   # 翻訳・要約・開発チェックリスト本文の正本
│   ├── checklists/    # 横断的な実装・レビュー用チェックリスト
│   └── templates/     # 新規ドキュメント作成用テンプレート
└── references/        # 出典対応表、ライセンス方針、運用メモ
```

- ASVS 章から探す場合は [docs/asvs/index.md](docs/asvs/index.md) を起点にします。
- Cheat Sheet 単位の正本は [docs/cheatsheets/](docs/cheatsheets/) に置きます。
- 横断チェックリストは [docs/checklists/](docs/checklists/) にまとめます。
- 出典対応表は [references/source-map.md](references/source-map.md) で管理します。

## Codex への依頼例

```text
OWASP Cheat Sheet Series の <対象ページURL> を確認して、
AGENTS.md のルールに従い、日本語翻訳・要約・開発チェックリストを作成してください。
Attribution セクションを必ず入れてください。
```

## 品質方針

- 原文の意味を変えない
- MUST、SHOULD、MAY などの規範的な強さを保つ
- セキュリティ上の条件、例外、前提を省略しない
- チェックリストは実装者が行動できる粒度にする
- 不明点や原文の曖昧さは推測で補わず、注記として残す
- 古い情報の可能性がある場合は、原文の確認日を明示する

## 参考資料

- [OWASP Cheat Sheet Series - Index ASVS](https://cheatsheetseries.owasp.org/IndexASVS.html)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [OWASP Application Security Verification Standard](https://owasp.org/www-project-application-security-verification-standard/)
- [Creative Commons Attribution-ShareAlike 4.0 International](https://creativecommons.org/licenses/by-sa/4.0/)
- [AGENTS.md](https://agents.md/)
