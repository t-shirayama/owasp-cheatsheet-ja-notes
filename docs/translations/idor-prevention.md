# IDOR 防止チートシート 日本語訳

## Attribution

- Original: Insecure Direct Object Reference Prevention Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-21

## 日本語訳

## Introduction

Insecure Direct Object Reference (IDOR) は、Web アプリケーションの URL やパラメータで使われる識別子を攻撃者が操作することで、オブジェクトへアクセスまたは変更できる場合に発生する脆弱性です。これはアクセス制御チェックの欠落によって発生します。つまり、ユーザーが特定のデータへアクセスしてよいかを検証できていない状態です。

## Examples

たとえば、ユーザーが自分のプロフィールへアクセスするとき、アプリケーションは次のような URL を生成することがあります。

```text
https://example.org/users/123
```text

URL 内の `123` は、データベース内のユーザーレコードへの直接参照であり、多くの場合は主キーで表されます。攻撃者がこの番号を `124` に変更し、別ユーザーの情報へアクセスできる場合、そのアプリケーションは Insecure Direct Object Reference に対して脆弱です。これは、アプリケーションがユーザー `124` のデータを表示する前に、そのユーザーへ閲覧権限があるかを適切に確認していないために起こります。

識別子が URL ではなく、次の例のように POST ボディに含まれる場合もあります。

```html
<form action="/update_profile" method="post">
  <!-- Other fields for updating name, email, etc. -->
  <input type="hidden" name="user_id" value="12345">
  <button type="submit">Update Profile</button>
</form>
```text

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

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V8.1 | 認可チェックをフレームワークやデータアクセス層で構造的に適用する設計 |
| V8.2 | オブジェクト単位の所有権、テナント境界、アクセス可能集合に基づく参照・更新・削除制御 |
