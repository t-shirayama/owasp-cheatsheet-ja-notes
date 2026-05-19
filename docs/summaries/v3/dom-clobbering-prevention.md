# DOM Clobbering防止チートシート 要約

## Attribution

- Original: DOM Clobbering Prevention Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/DOM_Clobbering_Prevention_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese summary added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../../translations/v3/dom-clobbering-prevention.md](../../translations/v3/dom-clobbering-prevention.md)
- 開発チェックリスト: [../../checklists/v3/dom-clobbering-prevention.md](../../checklists/v3/dom-clobbering-prevention.md)

## 概要

DOM Clobberingは、HTML要素の名前やIDによってJavaScriptのグローバル変数やプロパティ解決を意図せず上書きする攻撃です。DOM参照と信頼境界を明確にします。

## 要点

- グローバル変数名とDOM ID/nameの衝突を避ける。
- 信頼できないHTMLをDOMへ挿入しない。
- DOM参照は明示的なAPIで取得する。

## 実装時の注意点

- この要約はASVS Indexでの利用を前提にした実装者向け整理です。詳細確認時は原文を参照してください。
- 関連する認証、認可、ログ、入力検証、暗号、通信保護の管理策と組み合わせて適用します。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V3.2 | DOM Clobbering防止チートシート の主要な管理策 |

