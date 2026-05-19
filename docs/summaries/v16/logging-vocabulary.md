# ログ語彙チートシート 要約

## Attribution

- Original: Logging Vocabulary Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Logging_Vocabulary_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese summary added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../../translations/v16/logging-vocabulary.md](../../translations/v16/logging-vocabulary.md)
- 開発チェックリスト: [../../checklists/v16/logging-vocabulary.md](../../checklists/v16/logging-vocabulary.md)

## 概要

ログ語彙は、アプリケーションごとにばらばらになりがちなセキュリティイベント名を統一し、監視、アラート、調査をしやすくするための標準です。開発者が同じ意味のイベントに同じ名前を付ければ、SRE、SOC、インシデント対応チームはアプリケーション横断で検知ルールを作りやすくなります。

## 要点

- ログ語彙は、開発者、アーキテクト、SRE、SOC、インシデント対応チームの共通言語として定義する。
- イベントは構造化形式で記録し、日時は UTC オフセット付き ISO 8601 形式を使う。
- 認証は `authn`、認可は `authz`、セッションは `session`、入力検証は `input`、攻撃シグナルは `malicious` など、カテゴリ接頭辞を統一する。
- ユーザー ID、リソース ID、送信元などの調査属性は含めるが、パスワード、アクセストークン、秘密鍵、直接のセッション ID は含めない。
- 語彙は監視基盤や SIEM が機械的にパースできる形式で使う。

## 実装時の注意点

- 語彙の統一は監視ルールのための設計です。イベント名を人間に読みやすくするだけでなく、機械的に集計、相関、アラート化できる形式にします。
- ログレベルはイベントの意味と運用方針に合わせます。
- イベント名に自由入力値を混ぜないでください。ログインジェクションや監視ルールの誤作動につながります。
- 語彙を追加する場合は、既存カテゴリで表現できないか確認し、追加理由、重要度、必要属性、監視方法を記録します。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V16.1 Security Logging Documentation | ログイベント名、分類、属性、レベルの標準化 |
| V16.3 Security Events | 認証、認可、セッション、機密データ、システムイベントの語彙化 |
