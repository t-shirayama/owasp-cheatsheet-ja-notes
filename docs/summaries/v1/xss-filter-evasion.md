# XSSフィルタ回避チートシート 要約

## Attribution

- Original: XSS Filter Evasion Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/XSS_Filter_Evasion_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese summary added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../../translations/v1/xss-filter-evasion.md](../../translations/v1/xss-filter-evasion.md)
- 開発チェックリスト: [../../checklists/v1/xss-filter-evasion.md](../../checklists/v1/xss-filter-evasion.md)

## 概要

XSS Filter Evasion は、ブラックリスト、文字列置換、単純な正規表現、WAF が多様なブラウザ解釈やエンコードで迂回されることを示すテスト資料である。防御の中心は、フィルタではなく、出力コンテキスト別エンコーディング、安全なサニタイズ、安全な DOM API、CSP である。

## 要点

- ブラックリスト型フィルタや危険文字削除を主要防御にしない。
- HTML、属性、URL、CSS、JavaScript、DOM シンクごとに処理を分ける。
- 文字参照、混合エンコード、タブ、改行、不完全 HTML、SVG、CSS、BASE、IFRAME、HTTP Parameter Pollution をテスト観点に含める。
- WAF は補助策として扱い、アプリケーション本体の出力制御を必須にする。
- ペイロード集を教育、テスト、回帰検証に使う。

## 実装時の注意点

- 回避ペイロードを追いかけるだけでは防御は完成しない。信頼境界と出力先コンテキストを修正する。
- DOM Based XSS、保存型、反射型、リダイレクト経由を分けてテストする。
- ブラウザやパーサの寛容な補完を前提にレビューする。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V1.2 | ブラックリスト依存の禁止、出力コンテキスト別エンコーディング、XSS 回帰テスト |
| V3.2 | ブラウザ解釈差、DOM Based XSS、CSP と組み合わせたクライアント側防御 |

