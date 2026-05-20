# OSコマンドインジェクション防御チートシート 日本語訳

## Attribution

- Original: OS Command Injection Defense Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/OS_Command_Injection_Defense_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-20

## 日本語訳

OSコマンドインジェクションは、ユーザー入力がシェルやOSコマンドとして解釈されることで発生します。可能な限りOSコマンド実行を避け、APIで代替します。

## 主要な観点

- シェル呼び出しを避ける。
- 引数を配列として渡し、シェル展開を使わない。
- 許可リストでコマンドと引数を制限する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V1.2 | OSコマンドインジェクション防御チートシート の主要な管理策 |

