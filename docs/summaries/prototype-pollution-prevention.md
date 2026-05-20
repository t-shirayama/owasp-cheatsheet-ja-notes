# プロトタイプ汚染防止チートシート 要約

## Attribution

- Original: Prototype Pollution Prevention Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Prototype_Pollution_Prevention_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese summary added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../translations/prototype-pollution-prevention.md](../translations/prototype-pollution-prevention.md)
- 開発チェックリスト: [../checklists/prototype-pollution-prevention.md](../checklists/prototype-pollution-prevention.md)

## 概要

プロトタイプ汚染は、攻撃者がJavaScriptオブジェクトの継承元を変更し、別の処理で予期しないプロパティが存在するように見せる問題です。オブジェクトの生成方法、入力キーの検証、Node.js実行時設定で攻撃面を下げます。

## 要点

- 連想データには`Map`や`Set`を優先する。
- 必要な場合はプロトタイプを持たないオブジェクトを使う。
- `__proto__`、`constructor`、`prototype`などの危険なキーを入力で許可しない。
- プロトタイプ凍結やNode.jsの`--disable-proto=delete`は防御の多層化として検討する。

## 実装時の注意点

- 深いマージ、設定結合、JSON入力の取り込み処理を重点的にレビューする。
- ライブラリ更新とテストで互換性を確認しながら対策する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V15.3 | JavaScriptフレームワークと実行時機能の安全な利用 |

