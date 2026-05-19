# 仮想パッチ適用チートシート 開発チェックリスト

## Attribution

- Original: Virtual Patching Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Virtual_Patching_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Development checklist added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../translations/virtual-patching.md](../translations/virtual-patching.md)
- 要約: [../summaries/virtual-patching.md](../summaries/virtual-patching.md)

## 開発チェックリスト

- [ ] 仮想パッチの対象脆弱性、影響範囲、恒久修正予定をチケット化する。
- [ ] WAF、IPS、Webサーバプラグインなど適用層を選定する。
- [ ] 正常入力の文字種、長さ、形式を確認し、可能なら許可リスト型ルールを作る。
- [ ] 禁止リスト型ルールを使う場合は既知ペイロード専用になっていないか確認する。
- [ ] ルールID、対象URL、対象パラメータ、変換処理、ログ設定を記録する。
- [ ] 本番遮断前にログのみモードで誤検知と通常業務への影響を確認する。
- [ ] 攻撃再現テストや再診断で仮想パッチの有効性を検証する。
- [ ] コード修正後に仮想パッチの継続、調整、撤去を判断する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V15.2 | 脆弱性対応、暫定緩和、パッチ管理 |

