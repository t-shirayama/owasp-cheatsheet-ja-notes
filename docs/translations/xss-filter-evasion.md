# XSSフィルタ回避チートシート 日本語訳

## Attribution

- Original: XSS Filter Evasion Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/XSS_Filter_Evasion_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-20

## 日本語訳

XSS Filter Evasion は、XSS テスト担当者向けに、入力フィルタや WAF がどのように迂回されるかを示す資料である。多様なペイロード例は、単純なブラックリスト、文字列置換、正規表現、危険文字の部分的削除だけでは XSS を防げないことを示している。

回避手法には、不完全な HTML、イベントハンドラ、引用符省略、文字参照、16進/10進エンコード、タブや改行、NULL、スクリプト終端、URL エンコード、混合エンコード、SVG、CSS、META、IFRAME、BASE、OBJECT、HTTP Parameter Pollution、WAF バイパス文字列などが含まれる。ブラウザのパーサは寛容であり、サーバ側フィルタが想定する文字列と実際にブラウザが解釈する DOM や実行コンテキストが一致しない場合がある。

防御は、フィルタ回避ペイロードを追いかけることではなく、出力先コンテキストに応じたエンコーディング、安全なサニタイズ、安全な DOM API、CSP、入力検証を組み合わせることである。HTML、属性、URL、CSS、JavaScript 文字列、DOM シンクのそれぞれに適した処理を行い、危険なコンテキストへ信頼できないデータを入れない。WAF や入力フィルタは補助策であり、アプリケーション本体の出力制御の代替にはならない。

この資料のペイロードは、テストケース、回帰テスト、教育目的で使う。攻撃パターンを確認する際は、保存型、反射型、DOM Based XSS、リダイレクト経由、HTTP Parameter Pollution など複数の流れを試し、フィルタがどの位置で適用されているかを確認する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V1.2 | ブラックリスト依存の禁止、出力コンテキスト別エンコーディング、XSS 回帰テスト |
| V3.2 | ブラウザ解釈差、DOM Based XSS、CSP と組み合わせたクライアント側防御 |

