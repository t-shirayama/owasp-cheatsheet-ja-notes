# サードパーティJavaScript管理チートシート 要約

## Attribution

- Original: Third Party Javascript Management Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Third_Party_Javascript_Management_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese summary added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../../translations/v3/third-party-javascript-management.md](../../translations/v3/third-party-javascript-management.md)
- 開発チェックリスト: [../../checklists/v3/third-party-javascript-management.md](../../checklists/v3/third-party-javascript-management.md)

## 概要

サードパーティJavaScriptは、ページ上で高い権限を持つ外部コードです。供給元、読み込み範囲、SRI、CSP、監視、契約上の管理が必要です。

## 要点

- 読み込む外部スクリプトを最小化する。
- SRIやCSPで改ざんと実行範囲を制御する。
- 外部スクリプトの変更と影響を監視する。

## 実装時の注意点

- この要約はASVS Indexでの利用を前提にした実装者向け整理です。詳細確認時は原文を参照してください。
- 関連する認証、認可、ログ、入力検証、暗号、通信保護の管理策と組み合わせて適用します。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V3, V15 | サードパーティJavaScript管理チートシート の主要な管理策 |

