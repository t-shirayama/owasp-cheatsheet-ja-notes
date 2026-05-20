# プロトタイプ汚染防止チートシート 開発チェックリスト

## Attribution

- Original: Prototype Pollution Prevention Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Prototype_Pollution_Prevention_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Development checklist added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../translations/prototype-pollution-prevention.md](../translations/prototype-pollution-prevention.md)
- 要約: [../summaries/prototype-pollution-prevention.md](../summaries/prototype-pollution-prevention.md)

## 開発チェックリスト

- [ ] キーと値の集合には、通常のオブジェクトではなく`Map`または`Set`を使う。
- [ ] オブジェクトが必要な場合は`Object.create(null)`でプロトタイプなしの入れ物を作る。
- [ ] 入力キーとして`__proto__`、`prototype`、`constructor`を拒否する。
- [ ] 再帰的マージ、設定の上書き、JSON取り込みで継承プロパティを書き換えないことを確認する。
- [ ] Node.jsでは`--disable-proto=delete`の適用を検討する。
- [ ] プロトタイプ汚染のペイロードで認可バイパスや設定改ざんが起きないことをテストする。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V15.3 | 安全なJavaScript実装とフレームワーク機能利用 |

