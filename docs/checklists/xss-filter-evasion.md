# XSSフィルタ回避チートシート 開発チェックリスト

## Attribution

- Original: XSS Filter Evasion Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/XSS_Filter_Evasion_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Development checklist added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../translations/xss-filter-evasion.md](../translations/xss-filter-evasion.md)
- 要約: [../summaries/xss-filter-evasion.md](../summaries/xss-filter-evasion.md)

## 開発チェックリスト

- [ ] ブラックリスト型フィルタ、文字列置換、危険文字削除を主要防御にしない。
- [ ] HTML、属性、URL、CSS、JavaScript、DOM シンクごとの出力エンコーディングを確認する。
- [ ] HTML サニタイザを許可リスト方式で設定する。
- [ ] 不完全 HTML、イベントハンドラ、引用符省略、文字参照、16進/10進エンコード、タブ、改行、NULL をテストする。
- [ ] SVG、CSS、META、IFRAME、BASE、OBJECT、URL エンコード、混合エンコードをテストする。
- [ ] HTTP Parameter Pollution により XSS 影響が拡大しないことを確認する。
- [ ] WAF や入力フィルタの検知を補助策として扱い、アプリケーション側の出力制御を確認する。
- [ ] 保存型、反射型、DOM Based XSS、リダイレクト経由の各フローで回帰テストを用意する。
- [ ] CSP が主要ペイロードの実行を抑制することを確認する。
- [ ] テスト結果を、入力源、出力先コンテキスト、実行ブラウザ、期待される防御に紐付けて記録する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V1.2 | ブラックリスト依存の禁止、出力コンテキスト別エンコーディング、XSS 回帰テスト |
| V3.2 | ブラウザ解釈差、DOM Based XSS、CSP と組み合わせたクライアント側防御 |

