# IDOR防止チートシート 要約

## Attribution

- Original: Insecure Direct Object Reference Prevention Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese summary added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../translations/idor-prevention.md](../translations/idor-prevention.md)
- 開発チェックリスト: [../checklists/idor-prevention.md](../checklists/idor-prevention.md)

## 概要

IDOR は、攻撃者が URL、POST ボディ、隠しフィールド、API パラメータの識別子を変更し、本来アクセスできないオブジェクトへアクセスする脆弱性である。防止策の中心は識別子の隠蔽ではなく、対象オブジェクトごとのサーバ側認可チェックである。

## 要点

- クライアントから渡される利用者 ID、所有者 ID、テナント ID、オブジェクト ID を信頼しない。
- 現在の認証済み利用者またはテナントからアクセス可能な集合にスコープしてオブジェクトを検索する。
- 詳細、更新、削除、添付ファイル、エクスポートなど、すべての経路で同じ認可スコープを適用する。
- UUID やランダム ID は推測を難しくする補助策であり、認可チェックの代替ではない。
- 複数ステップのフローでは、改ざん可能な hidden field ではなくサーバ側セッションに識別子を保持する。
- 識別子の暗号化は安全に運用しにくいため、IDOR 対策として安易に採用しない。

## 実装時の注意点

- 「取得後に確認」よりも「アクセス可能集合から取得」を優先する。データアクセス層やリポジトリ層で強制すると漏れが減る。
- 404 と 403 の使い分けは情報漏えいに影響する。存在有無を隠したい場合は一貫した応答にする。
- IDOR は水平権限昇格だけでなく、テナント境界、管理画面、ファイル、ジョブ、監査ログでも発生する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V8.1 | 認可チェックを構造的に適用する設計 |
| V8.2 | オブジェクト単位の所有権、テナント境界、アクセス可能集合に基づく制御 |

