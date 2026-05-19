# DOM Clobbering防止チートシート 日本語訳

## Attribution

- Original: DOM Clobbering Prevention Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/DOM_Clobbering_Prevention_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-20

## 関連ファイル

- 要約: [../summaries/dom-clobbering-prevention.md](../summaries/dom-clobbering-prevention.md)
- 開発チェックリスト: [../checklists/dom-clobbering-prevention.md](../checklists/dom-clobbering-prevention.md)

## 日本語訳

DOM Clobberingは、HTML要素の名前やIDによってJavaScriptのグローバル変数やプロパティ解決を意図せず上書きする攻撃です。DOM参照と信頼境界を明確にします。

## 主要な観点

- グローバル変数名とDOM ID/nameの衝突を避ける。
- 信頼できないHTMLをDOMへ挿入しない。
- DOM参照は明示的なAPIで取得する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V3.2 | DOM Clobbering防止チートシート の主要な管理策 |

