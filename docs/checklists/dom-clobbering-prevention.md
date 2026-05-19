# DOM Clobbering防止チートシート 開発チェックリスト

## Attribution

- Original: DOM Clobbering Prevention Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/DOM_Clobbering_Prevention_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Development checklist added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../translations/dom-clobbering-prevention.md](../translations/dom-clobbering-prevention.md)
- 要約: [../summaries/dom-clobbering-prevention.md](../summaries/dom-clobbering-prevention.md)

## 開発チェックリスト

- [ ] 信頼できないHTML挿入を禁止またはサニタイズする。
- [ ] window上の暗黙プロパティ参照を避ける。
- [ ] 重要なDOM参照を型と存在確認つきで扱う。
- [ ] CSPでスクリプト実行を制限する。
- [ ] DOM Clobberingのテストケースを追加する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V3.2 | DOM Clobbering防止チートシート の主要な管理策 |

