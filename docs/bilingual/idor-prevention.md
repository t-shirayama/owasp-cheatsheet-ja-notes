---
title: Insecure Direct Object Reference Prevention Cheat Sheet
hide_title: true
---

<div className="docHero" data-category="asvs-v8">
  <h1>IDOR 防止チートシート</h1>
  <div className="docMeta">
    <span className="docPill">最終更新: 2026-05-20</span>
    <span className="docPill">読了時間: 準備中</span>
    <span className="docPill">カテゴリ: 認可</span>
  </div>
</div>

<p className="docLead">IDOR 防止チートシートを、原文・翻訳・対比表示で確認できます。ASVS Index 対応の文脈で、公式原文と日本語訳を確認しやすく整理しています。</p>

<div className="tabbedContent">
  <input className="tabInput" type="radio" name="idor-prevention-view" id="idor-prevention-original" />
  <input className="tabInput" type="radio" name="idor-prevention-view" id="idor-prevention-translation" defaultChecked />
  <input className="tabInput" type="radio" name="idor-prevention-view" id="idor-prevention-bilingual" />

  <div className="contentTabs">
    <label htmlFor="idor-prevention-original" title="OWASP 原文">原文</label>
    <label htmlFor="idor-prevention-translation" title="日本語訳">翻訳</label>
    <label htmlFor="idor-prevention-bilingual" title="原文と翻訳を並べて確認">対比表示</label>
  </div>

<section id="idor-prevention-original-panel" className="tabPanel originalPanel contentPanel">

## Introduction

Insecure Direct Object Reference (IDOR) is a vulnerability that arises when attackers can access or modify objects by manipulating identifiers used in a web application's URLs or parameters. It occurs due to missing access control checks, which fail to verify whether a user should be allowed to access specific data.

## Examples

For instance, when a user accesses their profile, the application might generate a URL like this:

```text
https://example.org/users/123
```

The 123 in the URL is a direct reference to the user's record in the database, often represented by the primary key. If an attacker changes this number to 124 and gains access to another user's information, the application is vulnerable to Insecure Direct Object Reference. This happens because the app didn't properly check if the user had permission to view data for user 124 before displaying it.

In some cases, the identifier may not be in the URL, but rather in the POST body, as shown in the following example:

```html
<form action="/update_profile" method="post">
  <!-- Other fields for updating name, email, etc. -->
  <input type="hidden" name="user_id" value="12345">
  <button type="submit">Update Profile</button>
</form>
```

In this example, the application allows users to update their profiles by submitting a form with the user ID in a hidden field. If the app doesn't perform proper access control on the server-side, attackers can manipulate the "user_id" field to modify profiles of other users without authorization.

## Identifier complexity

In some cases, using more complex identifiers like GUIDs can make it practically impossible for attackers to guess valid values. However, even with complex identifiers, access control checks are essential. If attackers obtain URLs for unauthorized objects, the application should still block their access attempts.

## Mitigation

To mitigate IDOR, implement access control checks for each object that users try to access. Web frameworks often provide ways to facilitate this. Additionally, use complex identifiers as a defense-in-depth measure, but remember that access control is crucial even with these identifiers.

Avoid exposing identifiers in URLs and POST bodies if possible. Instead, determine the currently authenticated user from session information. When using multi-step flows, pass identifiers in the session to prevent tampering.

When looking up objects based on primary keys, use datasets that users have access to. For example, in Ruby on Rails:

```text
// vulnerable, searches all projects
@project = Project.find(params[:id])
// secure, searches projects related to the current user
@project = @current_user.projects.find(params[:id])
```

Verify the user's permission every time an access attempt is made. Implement this structurally using the recommended approach for your web framework.

As an additional defense-in-depth measure, replace enumerable numeric identifiers with more complex, random identifiers. You can achieve this by adding a column with random strings in the database table and using those strings in the URLs instead of numeric primary keys. Another option is to use UUIDs or other long random values as primary keys. Avoid encrypting identifiers as it can be challenging to do so securely.

</section>

<section id="idor-prevention-translation-panel" className="tabPanel translationPanel contentPanel">

## Introduction

Insecure Direct Object Reference (IDOR) は、Web アプリケーションの URL やパラメータで使われる識別子を攻撃者が操作することで、オブジェクトへアクセスまたは変更できる場合に発生する脆弱性です。これはアクセス制御チェックの欠落によって発生します。つまり、ユーザーが特定のデータへアクセスしてよいかを検証できていない状態です。

## Examples

たとえば、ユーザーが自分のプロフィールへアクセスするとき、アプリケーションは次のような URL を生成することがあります。

```text
https://example.org/users/123
```

URL 内の `123` は、データベース内のユーザーレコードへの直接参照であり、多くの場合は主キーで表されます。攻撃者がこの番号を `124` に変更し、別ユーザーの情報へアクセスできる場合、そのアプリケーションは Insecure Direct Object Reference に対して脆弱です。これは、アプリケーションがユーザー `124` のデータを表示する前に、そのユーザーへ閲覧権限があるかを適切に確認していないために起こります。

識別子が URL ではなく、次の例のように POST ボディに含まれる場合もあります。

```html
<form action="/update_profile" method="post">
  <!-- Other fields for updating name, email, etc. -->
  <input type="hidden" name="user_id" value="12345">
  <button type="submit">Update Profile</button>
</form>
```

この例では、アプリケーションは hidden フィールド内のユーザー ID を含むフォームを送信することで、ユーザーが自分のプロフィールを更新できるようにしています。アプリケーションがサーバー側で適切なアクセス制御を実施していない場合、攻撃者は `user_id` フィールドを操作し、認可なしに他のユーザーのプロフィールを変更できます。

## Identifier complexity

場合によっては、GUID のようなより複雑な識別子を使うことで、攻撃者が有効な値を推測することを実質的に不可能にできます。ただし、複雑な識別子を使っていても、アクセス制御チェックは不可欠です。攻撃者が認可されていないオブジェクトの URL を入手した場合でも、アプリケーションはそのアクセス試行をブロックすべきです。

## Mitigation

IDOR を緩和するには、ユーザーがアクセスしようとする各オブジェクトに対してアクセス制御チェックを実装します。Web フレームワークは、多くの場合これを支援する方法を提供しています。加えて、多層防御として複雑な識別子を使用します。ただし、そのような識別子を使っていてもアクセス制御が重要であることを忘れてはいけません。

可能であれば、URL や POST ボディで識別子を露出しないようにします。代わりに、現在認証済みのユーザーをセッション情報から判断します。複数ステップのフローを使う場合は、改ざんを防ぐために識別子をセッションで受け渡します。

主キーに基づいてオブジェクトを検索する場合は、ユーザーがアクセスできるデータセットを使います。Ruby on Rails の例を示します。

```ruby
// vulnerable, searches all projects
@project = Project.find(params[:id])
// secure, searches projects related to the current user
@project = @current_user.projects.find(params[:id])
```

アクセス試行が行われるたびに、ユーザーの権限を検証します。使用している Web フレームワークの推奨アプローチを使い、これを構造的に実装します。

追加の多層防御として、列挙可能な数値識別子を、より複雑でランダムな識別子に置き換えます。これは、データベーステーブルにランダム文字列の列を追加し、数値主キーの代わりにその文字列を URL で使うことで実現できます。UUID やその他の長いランダム値を主キーとして使うことも選択肢です。識別子の暗号化は、安全に行うことが難しい場合があるため避けます。

</section>

<section id="idor-prevention-bilingual-panel" className="tabPanel bilingualPanel">

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Introduction

Insecure Direct Object Reference (IDOR) is a vulnerability that arises when attackers can access or modify objects by manipulating identifiers used in a web application's URLs or parameters. It occurs due to missing access control checks, which fail to verify whether a user should be allowed to access specific data.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## Introduction

Insecure Direct Object Reference (IDOR) は、Web アプリケーションの URL やパラメータで使われる識別子を攻撃者が操作することで、オブジェクトへアクセスまたは変更できる場合に発生する脆弱性です。これはアクセス制御チェックの欠落によって発生します。つまり、ユーザーが特定のデータへアクセスしてよいかを検証できていない状態です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Examples

For instance, when a user accesses their profile, the application might generate a URL like this:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## Examples

たとえば、ユーザーが自分のプロフィールへアクセスするとき、アプリケーションは次のような URL を生成することがあります。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```text
https://example.org/users/123
```

```text
https://example.org/users/123
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The 123 in the URL is a direct reference to the user's record in the database, often represented by the primary key. If an attacker changes this number to 124 and gains access to another user's information, the application is vulnerable to Insecure Direct Object Reference. This happens because the app didn't properly check if the user had permission to view data for user 124 before displaying it.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

URL 内の `123` は、データベース内のユーザーレコードへの直接参照であり、多くの場合は主キーで表されます。攻撃者がこの番号を `124` に変更し、別ユーザーの情報へアクセスできる場合、そのアプリケーションは Insecure Direct Object Reference に対して脆弱です。これは、アプリケーションがユーザー `124` のデータを表示する前に、そのユーザーへ閲覧権限があるかを適切に確認していないために起こります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

In some cases, the identifier may not be in the URL, but rather in the POST body, as shown in the following example:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

識別子が URL ではなく、次の例のように POST ボディに含まれる場合もあります。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```html
<form action="/update_profile" method="post">
  <!-- Other fields for updating name, email, etc. -->
  <input type="hidden" name="user_id" value="12345">
  <button type="submit">Update Profile</button>
</form>
```

```html
<form action="/update_profile" method="post">
  <!-- Other fields for updating name, email, etc. -->
  <input type="hidden" name="user_id" value="12345">
  <button type="submit">Update Profile</button>
</form>
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

In this example, the application allows users to update their profiles by submitting a form with the user ID in a hidden field. If the app doesn't perform proper access control on the server-side, attackers can manipulate the "user_id" field to modify profiles of other users without authorization.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

この例では、アプリケーションは hidden フィールド内のユーザー ID を含むフォームを送信することで、ユーザーが自分のプロフィールを更新できるようにしています。アプリケーションがサーバー側で適切なアクセス制御を実施していない場合、攻撃者は `user_id` フィールドを操作し、認可なしに他のユーザーのプロフィールを変更できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Identifier complexity

In some cases, using more complex identifiers like GUIDs can make it practically impossible for attackers to guess valid values. However, even with complex identifiers, access control checks are essential. If attackers obtain URLs for unauthorized objects, the application should still block their access attempts.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## Identifier complexity

場合によっては、GUID のようなより複雑な識別子を使うことで、攻撃者が有効な値を推測することを実質的に不可能にできます。ただし、複雑な識別子を使っていても、アクセス制御チェックは不可欠です。攻撃者が認可されていないオブジェクトの URL を入手した場合でも、アプリケーションはそのアクセス試行をブロックすべきです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Mitigation

To mitigate IDOR, implement access control checks for each object that users try to access. Web frameworks often provide ways to facilitate this. Additionally, use complex identifiers as a defense-in-depth measure, but remember that access control is crucial even with these identifiers.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## Mitigation

IDOR を緩和するには、ユーザーがアクセスしようとする各オブジェクトに対してアクセス制御チェックを実装します。Web フレームワークは、多くの場合これを支援する方法を提供しています。加えて、多層防御として複雑な識別子を使用します。ただし、そのような識別子を使っていてもアクセス制御が重要であることを忘れてはいけません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Avoid exposing identifiers in URLs and POST bodies if possible. Instead, determine the currently authenticated user from session information. When using multi-step flows, pass identifiers in the session to prevent tampering.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

可能であれば、URL や POST ボディで識別子を露出しないようにします。代わりに、現在認証済みのユーザーをセッション情報から判断します。複数ステップのフローを使う場合は、改ざんを防ぐために識別子をセッションで受け渡します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

When looking up objects based on primary keys, use datasets that users have access to. For example, in Ruby on Rails:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

主キーに基づいてオブジェクトを検索する場合は、ユーザーがアクセスできるデータセットを使います。Ruby on Rails の例を示します。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```text
// vulnerable, searches all projects
@project = Project.find(params[:id])
// secure, searches projects related to the current user
@project = @current_user.projects.find(params[:id])
```

```ruby
// vulnerable, searches all projects
@project = Project.find(params[:id])
// secure, searches projects related to the current user
@project = @current_user.projects.find(params[:id])
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Verify the user's permission every time an access attempt is made. Implement this structurally using the recommended approach for your web framework.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

アクセス試行が行われるたびに、ユーザーの権限を検証します。使用している Web フレームワークの推奨アプローチを使い、これを構造的に実装します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

As an additional defense-in-depth measure, replace enumerable numeric identifiers with more complex, random identifiers. You can achieve this by adding a column with random strings in the database table and using those strings in the URLs instead of numeric primary keys. Another option is to use UUIDs or other long random values as primary keys. Avoid encrypting identifiers as it can be challenging to do so securely.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

追加の多層防御として、列挙可能な数値識別子を、より複雑でランダムな識別子に置き換えます。これは、データベーステーブルにランダム文字列の列を追加し、数値主キーの代わりにその文字列を URL で使うことで実現できます。UUID やその他の長いランダム値を主キーとして使うことも選択肢です。識別子の暗号化は、安全に行うことが難しい場合があるため避けます。

</div>
</div>

</section>
</div>



## Attribution

<div className="attributionFooter">

- Original: Insecure Direct Object Reference Prevention Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: English original retained for comparison. Japanese translation added. Bilingual display generated from official source and local Japanese translation.
- Retrieved: 2026-05-20

</div>
