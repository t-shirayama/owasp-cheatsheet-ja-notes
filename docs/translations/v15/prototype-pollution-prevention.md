# プロトタイプ汚染防止チートシート 日本語訳

## Attribution

- Original: Prototype Pollution Prevention Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Prototype_Pollution_Prevention_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-20

## 関連ファイル

- 要約: [../../summaries/v15/prototype-pollution-prevention.md](../../summaries/v15/prototype-pollution-prevention.md)
- 開発チェックリスト: [../../checklists/v15/prototype-pollution-prevention.md](../../checklists/v15/prototype-pollution-prevention.md)

## 日本語訳

プロトタイプ汚染(Prototype Pollution)は、攻撃者がJavaScriptオブジェクトのプロトタイプや継承プロパティを変更し、アプリケーション全体のオブジェクト挙動を汚染する脆弱性です。認可バイパス、権限昇格、データ漏えい、場合によってはリモートコード実行につながることがあります。

防御では、単純なオブジェクトリテラルを連想配列として使うよりも`Map`や`Set`を使うことを優先します。オブジェクトが必要な場合は`Object.create(null)`などでプロトタイプを持たないオブジェクトを作ります。`Object.freeze()`や`Object.seal()`により組み込みプロトタイプの変更を抑止できますが、ライブラリ互換性への影響を確認します。Node.jsでは`--disable-proto=delete`により`__proto__`を削除する防御層を追加できますが、`constructor.prototype`経由の攻撃には別途注意が必要です。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V15.3 | JavaScript実行環境とフレームワーク機能の安全な利用 |

