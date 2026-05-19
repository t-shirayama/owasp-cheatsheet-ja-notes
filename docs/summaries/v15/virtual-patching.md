# 仮想パッチ適用チートシート 要約

## Attribution

- Original: Virtual Patching Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Virtual_Patching_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese summary added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../../translations/v15/virtual-patching.md](../../translations/v15/virtual-patching.md)
- 開発チェックリスト: [../../checklists/v15/virtual-patching.md](../../checklists/v15/virtual-patching.md)

## 概要

仮想パッチは、コード修正までの間にWAFなどの制御層で悪用を遮断し、露出時間を短縮するリスク低減策です。恒久対策としてのコード修正と並行して運用します。

## 要点

- 仮想パッチはコード修正の代替ではなく暫定防御である。
- 事前にログ、承認、ツール、運用手順を準備しておく。
- 可能なら許可リスト型のルールで正常入力を定義する。
- 禁止リスト型は早いが回避されやすいため過信しない。
- ルールID、対象脆弱性、発火状況、撤去条件をチケットで管理する。

## 実装時の注意点

- 最初はログのみで誤検知を確認し、正規トラフィックを遮断しないことを検証する。
- コード修正後に仮想パッチを継続するか撤去するかを再評価する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V15.2 | 脆弱性対応とパッチ管理 |

