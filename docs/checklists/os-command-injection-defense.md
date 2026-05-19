# OSコマンドインジェクション防御チートシート 開発チェックリスト

## Attribution

- Original: OS Command Injection Defense Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/OS_Command_Injection_Defense_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Development checklist added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../translations/os-command-injection-defense.md](../translations/os-command-injection-defense.md)
- 要約: [../summaries/os-command-injection-defense.md](../summaries/os-command-injection-defense.md)

## 開発チェックリスト

- [ ] OSコマンド実行箇所を棚卸しする。
- [ ] 標準ライブラリAPIで代替する。
- [ ] ユーザー入力をコマンド名に使わない。
- [ ] 引数を許可リストで検証する。
- [ ] 実行ユーザーを最小権限にする。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V1.2 | OSコマンドインジェクション防御チートシート の主要な管理策 |

