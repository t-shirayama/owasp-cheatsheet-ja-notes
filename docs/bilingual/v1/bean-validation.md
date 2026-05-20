# Bean Validation Cheat Sheet

<div className="docHero">
  <span className="docPill">Pilot bilingual view</span>
  <p className="docSubtitle">Bean Validation チートシート</p>
  <div className="docMeta">
    <span className="docPill">Retrieved: 2026-05-20</span>
    <span className="docPill">Category: Encoding and Sanitization</span>
    <span className="docPill">ASVS: V1.2</span>
    <span className="docPill">Unofficial translation</span>
  </div>
</div>

<div className="contentTabs">
  <a href="#translation">翻訳</a>
  <a href="#summary">要点</a>
  <a href="#checklist">チェックリスト</a>
  <a className="activeTab" href="#bilingual">対比表示</a>
</div>

## Attribution

- Original: Bean Validation Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Bean_Validation_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: English original retained for comparison. Japanese translation added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: https://github.com/t-shirayama/owasp-cheatsheet-ja-notes/blob/main/docs/translations/v1/bean-validation.md
- 要約: https://github.com/t-shirayama/owasp-cheatsheet-ja-notes/blob/main/docs/summaries/v1/bean-validation.md
- 開発チェックリスト: https://github.com/t-shirayama/owasp-cheatsheet-ja-notes/blob/main/docs/checklists/v1/bean-validation.md

## 翻訳

Bean Validation は、Java アプリケーションでオブジェクトや入力値に対する制約を宣言的に定義するための仕組みです。型、範囲、形式、必須条件をモデルに近い場所で表現できます。

## 要点

- 入力値の制約をアノテーションとして明示する。
- 境界値、null、文字列長、形式を検証する。
- Bean Validation だけで認可や出力エンコーディングを代替しない。

## チェックリスト

- [ ] DTO やフォームモデルに制約を定義する。
- [ ] サーバー側で必ず検証を実行する。
- [ ] カスタムバリデータをテストする。
- [ ] エラーメッセージに内部情報を含めない。
- [ ] 検証後の値も出力先に応じてエンコードする。

## 対比表示

<div className="modeToggle">
  <span>日本語のみ</span>
  <span className="activeMode">対比表示</span>
</div>

<div className="noticeBox">
  Pilot 版では、対訳 UI と運用形を確認するため、主要な導入部分と代表的な制約を先行して対訳化しています。全文展開時は同じカード形式で残りの原文段落を追加します。
</div>

### Introduction

<div className="bilingualPair">
  <div className="bilingualBlock english">
    <span className="bilingualLabel english">English (原文)</span>
    <p>This article is focused on providing clear, simple, actionable guidance for providing Java Bean Validation security functionality in your applications.</p>
  </div>
  <div className="bilingualBlock japanese">
    <span className="bilingualLabel japanese">日本語 (翻訳)</span>
    <p>この記事は、アプリケーションで Java Bean Validation のセキュリティ機能を提供するための、明確で単純かつ実行可能なガイダンスを示します。</p>
  </div>
</div>

<div className="bilingualPair">
  <div className="bilingualBlock english">
    <span className="bilingualLabel english">English (原文)</span>
    <p>Bean validation, also known as Jakarta Validation, is one of the most common ways to perform input validation in Java. It is an application layer agnostic validation specification that lets developers define validation constraints on a domain model and validate those constraints across application tiers.</p>
  </div>
  <div className="bilingualBlock japanese">
    <span className="bilingualLabel japanese">日本語 (翻訳)</span>
    <p>Bean Validation、つまり Jakarta Validation は、Java で入力検証を行う最も一般的な方法の一つです。これはアプリケーション層に依存しない検証仕様であり、開発者がドメインモデルに検証制約を定義し、アプリケーションの各層でその制約を検証できるようにします。</p>
  </div>
</div>

<div className="bilingualPair">
  <div className="bilingualBlock english">
    <span className="bilingualLabel english">English (原文)</span>
    <p>One advantage of this approach is that validation constraints and the corresponding validators are written once, reducing duplication of effort and helping ensure uniformity.</p>
  </div>
  <div className="bilingualBlock japanese">
    <span className="bilingualLabel japanese">日本語 (翻訳)</span>
    <p>この方式の利点は、検証制約と対応するバリデータを一度だけ記述すればよいことです。これにより作業の重複が減り、一貫性を保ちやすくなります。</p>
  </div>
</div>

### Basics

<div className="bilingualPair">
  <div className="bilingualBlock english">
    <span className="bilingualLabel english">English (原文)</span>
    <p>To get started using Bean Validation, add validation constraints such as <code>@Pattern</code>, <code>@Digits</code>, <code>@Min</code>, <code>@Max</code>, <code>@Size</code>, <code>@Past</code>, <code>@Future</code>, <code>@CreditCardNumber</code>, <code>@Email</code>, and <code>@URL</code> to your model and use the <code>@Valid</code> annotation when passing the model through application layers.</p>
  </div>
  <div className="bilingualBlock japanese">
    <span className="bilingualLabel japanese">日本語 (翻訳)</span>
    <p>Bean Validation を使い始めるには、<code>@Pattern</code>、<code>@Digits</code>、<code>@Min</code>、<code>@Max</code>、<code>@Size</code>、<code>@Past</code>、<code>@Future</code>、<code>@CreditCardNumber</code>、<code>@Email</code>、<code>@URL</code> などの検証制約をモデルに追加し、アプリケーション層をまたいでモデルを渡すときに <code>@Valid</code> アノテーションを使用します。</p>
  </div>
</div>

<div className="bilingualPair">
  <div className="bilingualBlock english">
    <span className="bilingualLabel english">English (原文)</span>
    <p>Constraints can be applied to fields, properties, and classes. In Bean Validation 1.1 and later, they can also be applied to parameters, return values, and constructors.</p>
  </div>
  <div className="bilingualBlock japanese">
    <span className="bilingualLabel japanese">日本語 (翻訳)</span>
    <p>制約はフィールド、プロパティ、クラスに適用できます。Bean Validation 1.1 以降では、パラメータ、戻り値、コンストラクタにも適用できます。</p>
  </div>
</div>

### Predefined Constraints

<div className="bilingualPair">
  <div className="bilingualBlock english">
    <span className="bilingualLabel english">English (原文)</span>
    <p><code>@Pattern</code> checks whether the annotated string matches the regular expression, considering the specified flags.</p>
  </div>
  <div className="bilingualBlock japanese">
    <span className="bilingualLabel japanese">日本語 (翻訳)</span>
    <p><code>@Pattern</code> は、アノテーションが付いた文字列が指定されたフラグを考慮して正規表現に一致するかを確認します。</p>
  </div>
</div>

<div className="bilingualPair">
  <div className="bilingualBlock english">
    <span className="bilingualLabel english">English (原文)</span>
    <p><code>@Digits</code> checks whether the annotated value is a number with up to the specified number of integer and fractional digits.</p>
  </div>
  <div className="bilingualBlock japanese">
    <span className="bilingualLabel japanese">日本語 (翻訳)</span>
    <p><code>@Digits</code> は、アノテーションが付いた値が、指定された整数桁数と小数桁数の範囲内にある数値かを確認します。</p>
  </div>
</div>

<div className="bilingualPair">
  <div className="bilingualBlock english">
    <span className="bilingualLabel english">English (原文)</span>
    <p><code>@Size</code> checks whether the annotated element's size is between the configured minimum and maximum values, inclusive.</p>
  </div>
  <div className="bilingualBlock japanese">
    <span className="bilingualLabel japanese">日本語 (翻訳)</span>
    <p><code>@Size</code> は、アノテーションが付いた要素のサイズが、指定された最小値と最大値の範囲内にあるかを確認します。</p>
  </div>
</div>
