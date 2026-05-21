# プロトタイプ汚染防止チートシート 日本語訳

## Attribution

- Original: Prototype Pollution Prevention Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Prototype_Pollution_Prevention_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-21

## 日本語訳

## Explanation

Prototype Pollution は、攻撃者がアプリケーションの JavaScript オブジェクトとプロパティを操作できる重大な脆弱性です。これにより、データへの不正アクセス、権限昇格、さらにはリモートコード実行など、深刻なセキュリティ問題につながる可能性があります。

これが危険である理由の例については、以下の [Other resources](#other-resources) セクションのリンクを参照してください。

## Suggested protection mechanisms

### Use "new Set()" or "new Map()"

開発者はオブジェクトリテラルを使う代わりに、`new Set()` または `new Map()` を使うべきです。

```javascript
let allowedTags = new Set();
allowedTags.add('b');
if(allowedTags.has('b')){
  //...
}

let options = new Map();
options.set('spaces', 1);
let spaces = options.get('spaces')
```text

### If objects or object literals are required

オブジェクトを使う必要がある場合は、`Object` プロトタイプから継承しないように、`Object.create(null)` API を使って作成すべきです。

```javascript
let obj = Object.create(null);
```text

オブジェクトリテラルが必要な場合、最後の手段として `__proto__` プロパティを使用できます。

```javascript
let obj = {__proto__:null};
```

### Use object "freeze" and "seal" mechanisms

`Object.freeze()` と `Object.seal()` API を使って、組み込みプロトタイプが変更されることを防ぐこともできます。ただし、利用しているライブラリが組み込みプロトタイプを変更する場合、アプリケーションが壊れる可能性があります。

### Node.js configuration flag

Node.js は、`--disable-proto=delete` フラグを使って `__proto__` プロパティを完全に削除する機能も提供しています。これは多層防御の手段である点に注意してください。

Prototype Pollution は `constructor.prototype` プロパティを使っても依然として可能ですが、`__proto__` を削除することで攻撃対象領域を減らし、特定の攻撃を防ぎやすくなります。

### Other resources

- [What is prototype pollution? (Portswigger Web Security Academy)](https://portswigger.net/web-security/prototype-pollution)
- [Prototype pollution (Snyk Learn)](https://learn.snyk.io/lessons/prototype-pollution/javascript/)

### Credits

元の保護ガイダンスを [このコメント](https://github.com/OWASP/ASVS/issues/1563#issuecomment-1470027723) で提供した [Gareth Hayes](https://garethheyes.co.uk/) に謝意を示します。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V15.3 | JavaScript 実行環境とフレームワーク機能の安全な利用 |
