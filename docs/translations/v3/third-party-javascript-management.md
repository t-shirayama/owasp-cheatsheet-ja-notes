# サードパーティJavaScript管理チートシート 日本語訳

## Attribution

- Original: Third Party Javascript Management Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Third_Party_Javascript_Management_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-20

## 関連ファイル

- 要約: [../../summaries/v3/third-party-javascript-management.md](../../summaries/v3/third-party-javascript-management.md)
- 開発チェックリスト: [../../checklists/v3/third-party-javascript-management.md](../../checklists/v3/third-party-javascript-management.md)

## 日本語訳

サードパーティJavaScriptは、ページ上で高い権限を持つ外部コードです。供給元、読み込み範囲、SRI、CSP、監視、契約上の管理が必要です。

## 主要な観点

- 読み込む外部スクリプトを最小化する。
- SRIやCSPで改ざんと実行範囲を制御する。
- 外部スクリプトの変更と影響を監視する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V3, V15 | サードパーティJavaScript管理チートシート の主要な管理策 |

