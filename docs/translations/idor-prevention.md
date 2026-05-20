# IDOR防止チートシート 日本語訳

## Attribution

- Original: Insecure Direct Object Reference Prevention Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-20

## 日本語訳

Insecure Direct Object Reference (IDOR) は、URL、POST ボディ、隠しフィールド、API パラメータなどに含まれる識別子を攻撃者が変更することで、本来アクセスできないオブジェクトを参照または変更できる脆弱性である。原因は識別子の推測しやすさではなく、対象オブジェクトに対する認可チェックが欠落していることである。

数値 ID を UUID やランダム文字列に置き換えると、攻撃者が有効な値を推測しにくくなるため防御の多層化にはなる。しかし、複雑な識別子が漏えいした場合でも、アプリケーションは権限のない利用者のアクセスを拒否しなければならない。ID の複雑化を認可チェックの代替にしてはならない。

IDOR を防ぐには、利用者がアクセスしようとするすべてのオブジェクトについて認可チェックを実施する。フレームワークの推奨機能を使い、個別コントローラに散らばった ad hoc な条件ではなく、構造的に適用する。可能な場合は、現在認証済みの利用者をセッションや認証済みクレームから決定し、クライアントから渡された利用者 ID や所有者 ID を信頼しない。複数ステップのフローでは、改ざん可能なフォーム値ではなくサーバ側セッションに識別子を保持する。

主キーでオブジェクトを取得する場合は、全体集合から検索して後で確認するのではなく、利用者がアクセス可能な集合にスコープして検索する。たとえば「全プロジェクトから ID で検索する」のではなく、「現在利用者に属するプロジェクト集合から ID で検索する」。一覧取得、詳細取得、更新、削除、添付ファイル取得、エクスポートなど、同じオブジェクトに触れるすべての経路で同じスコープを適用する。

識別子を URL や POST ボディに露出しない設計も検討する。露出が必要な場合でも、連番 ID の代わりに UUID や十分に長いランダム値を使う。識別子を暗号化して隠す方法は安全に設計・運用するのが難しいため、IDOR 対策として安易に採用しない。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V8.1 | 認可チェックをフレームワークやデータアクセス層で構造的に適用する設計 |
| V8.2 | オブジェクト単位の所有権、テナント境界、アクセス可能集合に基づく参照・更新・削除制御 |

