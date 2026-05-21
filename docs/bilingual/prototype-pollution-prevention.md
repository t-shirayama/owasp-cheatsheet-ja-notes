---
title: Prototype Pollution Prevention Cheat Sheet
hide_title: true
---

<div className="docHero" data-category="asvs-v15">
  <h1>Prototype Pollution 防止チートシート</h1>
  <div className="docMeta">
    <span className="docPill">最終更新: 2026-05-20</span>
    <span className="docPill">読了時間: 準備中</span>
    <span className="docPill">カテゴリ: セキュアコーディングとアーキテクチャ</span>
  </div>
</div>

<p className="docLead">Prototype Pollution 防止チートシートを、原文・翻訳・対比表示で確認できます。ASVS Index 対応の文脈で、公式原文と日本語訳を確認しやすく整理しています。</p>

<div className="tabbedContent">
  <input className="tabInput" type="radio" name="prototype-pollution-prevention-view" id="prototype-pollution-prevention-original" />
  <input className="tabInput" type="radio" name="prototype-pollution-prevention-view" id="prototype-pollution-prevention-translation" defaultChecked />
  <input className="tabInput" type="radio" name="prototype-pollution-prevention-view" id="prototype-pollution-prevention-bilingual" />

  <div className="contentTabs">
    <label htmlFor="prototype-pollution-prevention-original" title="OWASP 原文">原文</label>
    <label htmlFor="prototype-pollution-prevention-translation" title="日本語訳">翻訳</label>
    <label htmlFor="prototype-pollution-prevention-bilingual" title="原文と翻訳を並べて確認">対比表示</label>
  </div>

<section id="prototype-pollution-prevention-original-panel" className="tabPanel originalPanel contentPanel">

## Explanation

Prototype Pollution is a critical vulnerability that can allow attackers to manipulate an application's JavaScript objects and properties, leading to serious security issues such as unauthorized access to data, privilege escalation, and even remote code execution.

For examples of why this is dangerous, see the links in the [Other resources](#other-resources) section below.

## Suggested protection mechanisms

### Use "new Set()" or "new Map()"

Developers should use `new Set()` or `new Map()` instead of using object literals:

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

If objects have to be used then they should be created using the `Object.create(null)` API to ensure they don't inherit from the Object prototype:

```javascript
let obj = Object.create(null);
```text

If object literals are required then as a last resort you could use the `__proto__` property:

```javascript
let obj = {__proto__:null};
```text

### Use object "freeze" and "seal" mechanisms

You can also use the `Object.freeze()` and `Object.seal()` APIs to prevent built-in prototypes from being modified however this can break the application if the libraries they use modify the built-in prototypes.

### Node.js configuration flag

Node.js also offers the ability to remove the `__proto__` property completely using the `--disable-proto=delete` flag. Note this is a defense in depth measure.

Prototype pollution is still possible using `constructor.prototype` properties but removing `__proto__` helps reduce attack surface and prevent certain attacks.

### Other resources

- [What is prototype pollution? (Portswigger Web Security Academy)](https://portswigger.net/web-security/prototype-pollution)
- [Prototype pollution (Snyk Learn)](https://learn.snyk.io/lessons/prototype-pollution/javascript/)

### Credits

Credit to [Gareth Hayes](https://garethheyes.co.uk/) for providing the original protection guidance [in this comment](https://github.com/OWASP/ASVS/issues/1563#issuecomment-1470027723).

</section>

<section id="prototype-pollution-prevention-translation-panel" className="tabPanel translationPanel contentPanel">

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
```text

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

</section>

<section id="prototype-pollution-prevention-bilingual-panel" className="tabPanel bilingualPanel">

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Explanation

Prototype Pollution is a critical vulnerability that can allow attackers to manipulate an application's JavaScript objects and properties, leading to serious security issues such as unauthorized access to data, privilege escalation, and even remote code execution.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## Explanation

Prototype Pollution は、攻撃者がアプリケーションの JavaScript オブジェクトとプロパティを操作できる重大な脆弱性です。これにより、データへの不正アクセス、権限昇格、さらにはリモートコード実行など、深刻なセキュリティ問題につながる可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

For examples of why this is dangerous, see the links in the [Other resources](#other-resources) section below.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

これが危険である理由の例については、以下の [Other resources](#other-resources) セクションのリンクを参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Suggested protection mechanisms

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## Suggested protection mechanisms

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Use "new Set()" or "new Map()"

Developers should use `new Set()` or `new Map()` instead of using object literals:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Use "new Set()" or "new Map()"

開発者はオブジェクトリテラルを使う代わりに、`new Set()` または `new Map()` を使うべきです。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```javascript
let allowedTags = new Set();
allowedTags.add('b');
if(allowedTags.has('b')){
  //...
}

let options = new Map();
options.set('spaces', 1);
let spaces = options.get('spaces')
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### If objects or object literals are required

If objects have to be used then they should be created using the `Object.create(null)` API to ensure they don't inherit from the Object prototype:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### If objects or object literals are required

オブジェクトを使う必要がある場合は、`Object` プロトタイプから継承しないように、`Object.create(null)` API を使って作成すべきです。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```javascript
let obj = Object.create(null);
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

If object literals are required then as a last resort you could use the `__proto__` property:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

オブジェクトリテラルが必要な場合、最後の手段として `__proto__` プロパティを使用できます。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```javascript
let obj = {__proto__:null};
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Use object "freeze" and "seal" mechanisms

You can also use the `Object.freeze()` and `Object.seal()` APIs to prevent built-in prototypes from being modified however this can break the application if the libraries they use modify the built-in prototypes.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Use object "freeze" and "seal" mechanisms

`Object.freeze()` と `Object.seal()` API を使って、組み込みプロトタイプが変更されることを防ぐこともできます。ただし、利用しているライブラリが組み込みプロトタイプを変更する場合、アプリケーションが壊れる可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Node.js configuration flag

Node.js also offers the ability to remove the `__proto__` property completely using the `--disable-proto=delete` flag. Note this is a defense in depth measure.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Node.js configuration flag

Node.js は、`--disable-proto=delete` フラグを使って `__proto__` プロパティを完全に削除する機能も提供しています。これは多層防御の手段である点に注意してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Prototype pollution is still possible using `constructor.prototype` properties but removing `__proto__` helps reduce attack surface and prevent certain attacks.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Prototype Pollution は `constructor.prototype` プロパティを使っても依然として可能ですが、`__proto__` を削除することで攻撃対象領域を減らし、特定の攻撃を防ぎやすくなります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Other resources

- [What is prototype pollution? (Portswigger Web Security Academy)](https://portswigger.net/web-security/prototype-pollution)
- [Prototype pollution (Snyk Learn)](https://learn.snyk.io/lessons/prototype-pollution/javascript/)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Other resources

- [What is prototype pollution? (Portswigger Web Security Academy)](https://portswigger.net/web-security/prototype-pollution)
- [Prototype pollution (Snyk Learn)](https://learn.snyk.io/lessons/prototype-pollution/javascript/)

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Credits

Credit to [Gareth Hayes](https://garethheyes.co.uk/) for providing the original protection guidance [in this comment](https://github.com/OWASP/ASVS/issues/1563#issuecomment-1470027723).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Credits

元の保護ガイダンスを [このコメント](https://github.com/OWASP/ASVS/issues/1563#issuecomment-1470027723) で提供した [Gareth Hayes](https://garethheyes.co.uk/) に謝意を示します。

</div>
</div>

</section>
</div>



## Attribution

<div className="attributionFooter">

- Original: Prototype Pollution Prevention Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Prototype_Pollution_Prevention_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: English original retained for comparison. Japanese translation added. Bilingual display generated from official source and local Japanese translation.
- Retrieved: 2026-05-20

</div>
