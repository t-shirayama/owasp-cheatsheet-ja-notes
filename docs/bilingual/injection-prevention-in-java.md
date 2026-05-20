---
title: Injection Prevention Cheat Sheet in Java
hide_title: true
---

<div className="docHero" data-category="encoding-and-sanitization">
  <h1>Java におけるインジェクション防止チートシート</h1>
  <div className="docMeta">
    <span className="docPill">最終更新: 2026-05-20</span>
    <span className="docPill">読了時間: 約 15 分</span>
    <span className="docPill">カテゴリ: 入力検証とサニタイズ</span>
  </div>
</div>

<div className="tabbedContent">
  <input className="tabInput" type="radio" name="injection-prevention-in-java-view" id="injection-prevention-in-java-original" />
  <input className="tabInput" type="radio" name="injection-prevention-in-java-view" id="injection-prevention-in-java-translation" defaultChecked />
  <input className="tabInput" type="radio" name="injection-prevention-in-java-view" id="injection-prevention-in-java-summary" />
  <input className="tabInput" type="radio" name="injection-prevention-in-java-view" id="injection-prevention-in-java-checklist" />
  <input className="tabInput" type="radio" name="injection-prevention-in-java-view" id="injection-prevention-in-java-bilingual" />

  <div className="contentTabs">
    <label htmlFor="injection-prevention-in-java-original">原本</label>
    <label htmlFor="injection-prevention-in-java-translation">翻訳</label>
    <label htmlFor="injection-prevention-in-java-summary">要点</label>
    <label htmlFor="injection-prevention-in-java-checklist">チェックリスト</label>
    <label htmlFor="injection-prevention-in-java-bilingual">対比表示</label>
  </div>

<section id="injection-prevention-in-java-original-panel" className="tabPanel originalPanel contentPanel">

This information has been moved to the dedicated [Java Security CheatSheet](https://cheatsheetseries.owasp.org/cheatsheets/Java_Security_Cheat_Sheet.html#injection-prevention-in-java)

</section>

<section id="injection-prevention-in-java-translation-panel" className="tabPanel translationPanel contentPanel">

Javaアプリケーションでは、SQL、LDAP、XML、式言語、OSコマンドなど複数のインジェクション経路があります。安全なAPI選択とパラメータ化が基本です。

## 主要な観点

- PreparedStatementや安全なORM利用を徹底する。
- LDAPやXPathも文字列連結を避ける。
- OSコマンド実行を原則避ける。

</section>

<section id="injection-prevention-in-java-summary-panel" className="tabPanel summaryPanel contentPanel">

Javaアプリケーションでは、SQL、LDAP、XML、式言語、OSコマンドなど複数のインジェクション経路があります。安全なAPI選択とパラメータ化が基本です。

## 要点

- PreparedStatementや安全なORM利用を徹底する。
- LDAPやXPathも文字列連結を避ける。
- OSコマンド実行を原則避ける。

## 実装時の注意点

- この要約はASVS Indexでの利用を前提にした実装者向け整理です。詳細確認時は原文を参照してください。
- 関連する認証、認可、ログ、入力検証、暗号、通信保護の管理策と組み合わせて適用します。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V1.3 | Javaにおけるインジェクション防止チートシート の主要な管理策 |

</section>

<section id="injection-prevention-in-java-checklist-panel" className="tabPanel checklistPanel contentPanel">

- [ ] JDBCでPreparedStatementを使う。
- [ ] JPQL/Criteria APIの安全な使い方を確認する。
- [ ] LDAPフィルタ値をエスケープする。
- [ ] XMLパーサ設定を安全化する。
- [ ] Runtime.exec等の利用をレビューする。

</section>

<section id="injection-prevention-in-java-bilingual-panel" className="tabPanel bilingualPanel">

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

This information has been moved to the dedicated [Java Security CheatSheet](https://cheatsheetseries.owasp.org/cheatsheets/Java_Security_Cheat_Sheet.html#injection-prevention-in-java)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Javaアプリケーションでは、SQL、LDAP、XML、式言語、OSコマンドなど複数のインジェクション経路があります。安全なAPI選択とパラメータ化が基本です。

</div>
</div>

<div className="bilingualPair">

<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 主要な観点

- PreparedStatementや安全なORM利用を徹底する。

</div>
</div>

<div className="bilingualPair">

<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- LDAPやXPathも文字列連結を避ける。

</div>
</div>

<div className="bilingualPair">

<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- OSコマンド実行を原則避ける。

</div>
</div>

</section>
</div>



## Attribution

<div className="attributionFooter">

- Original: Injection Prevention Cheat Sheet in Java
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Injection_Prevention_in_Java_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: English original retained for comparison. Japanese translation added. Bilingual display generated from official source and local Japanese notes.
- Retrieved: 2026-05-20

</div>
