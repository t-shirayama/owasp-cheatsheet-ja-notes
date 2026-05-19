# IDOR防止チートシート 開発チェックリスト

## Attribution

- Original: Insecure Direct Object Reference Prevention Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Development checklist added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../../translations/v8/idor-prevention.md](../../translations/v8/idor-prevention.md)
- 要約: [../../summaries/v8/idor-prevention.md](../../summaries/v8/idor-prevention.md)

## 開発チェックリスト

- [ ] URL、クエリ、POST ボディ、hidden field、API パラメータ、ヘッダーに含まれる ID を棚卸しする。
- [ ] クライアントから渡される利用者 ID、所有者 ID、テナント ID を信頼しない。
- [ ] 現在の認証済み利用者またはテナントからアクセス可能な集合にスコープしてオブジェクトを取得する。
- [ ] 全体集合から ID で取得してから認可する実装を、アクセス可能集合から取得する実装へ置き換える。
- [ ] 詳細、更新、削除、添付ファイル、エクスポート、非同期ジョブ結果の各経路で同じ認可条件を適用する。
- [ ] 複数ステップフローでは、オブジェクト ID を hidden field ではなくサーバ側セッションまたは署名済み状態に保持する。
- [ ] UUID やランダム ID を使う場合でも、オブジェクト単位の認可チェックを必須にする。
- [ ] 連番 ID を外部公開しない設計を検討し、公開が必要な場合は十分に長いランダム識別子を使う。
- [ ] 識別子暗号化を IDOR 対策として採用する場合は、鍵管理、改ざん検知、復号失敗、再利用をレビューする。
- [ ] 他利用者、他ロール、他テナントの ID に差し替えたアクセスを自動テストする。
- [ ] 存在しない ID と権限のない ID の応答が情報漏えいしないことを確認する。
- [ ] 認可失敗、ID 差し替え、テナント境界違反のログを記録し、対象 ID と要求者を監査できるようにする。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V8.1 | 認可チェックを構造的に適用する設計 |
| V8.2 | オブジェクト単位の所有権、テナント境界、アクセス可能集合に基づく制御 |

