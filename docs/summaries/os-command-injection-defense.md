# OSコマンドインジェクション防御チートシート 要約

## Attribution

- Original: OS Command Injection Defense Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/OS_Command_Injection_Defense_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese summary added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../translations/os-command-injection-defense.md](../translations/os-command-injection-defense.md)
- 開発チェックリスト: [../checklists/os-command-injection-defense.md](../checklists/os-command-injection-defense.md)

## 概要

OSコマンドインジェクションは、ユーザー入力がシェルやOSコマンドとして解釈されることで発生します。可能な限りOSコマンド実行を避け、APIで代替します。

## 要点

- シェル呼び出しを避ける。
- 引数を配列として渡し、シェル展開を使わない。
- 許可リストでコマンドと引数を制限する。

## 実装時の注意点

- この要約はASVS Indexでの利用を前提にした実装者向け整理です。詳細確認時は原文を参照してください。
- 関連する認証、認可、ログ、入力検証、暗号、通信保護の管理策と組み合わせて適用します。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V1.2 | OSコマンドインジェクション防御チートシート の主要な管理策 |

