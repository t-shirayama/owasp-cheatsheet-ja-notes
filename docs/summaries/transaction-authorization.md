# トランザクション認可チートシート 要約

## Attribution

- Original: Transaction Authorization Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Transaction_Authorization_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese summary added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../translations/transaction-authorization.md](../translations/transaction-authorization.md)
- 開発チェックリスト: [../checklists/transaction-authorization.md](../checklists/transaction-authorization.md)

## 概要

トランザクション認可は、送金、アカウント解除、権限変更などの高リスク操作を、具体的な操作内容と一意の承認に結び付ける仕組みである。重要データを利用者に確認させ、サーバ側で認可方式と状態遷移を強制し、承認後の改ざん、再利用、総当たり、TOCTOU を防ぐ。

## 要点

- What You See Is What You Sign の原則に従い、利用者が承認対象の重要データを識別できるようにする。
- 認可トークンや認可方式の変更は、現在のトークンまたは現在の方式で承認させる。
- 認証操作とトランザクション認可操作を利用者が区別できるようにし、認証 OTP の流用を防ぐ。
- 各トランザクションに一意で短寿命な認可資格情報、チャレンジ、シーケンス番号、ランダム値を使う。
- 認可結果、認可方式、重要なトランザクションデータはサーバ側で生成、保存、検証する。
- クライアントパラメータで認可方式を弱い方式へダウングレードできないようにする。
- トランザクション状態遷移の順序を強制し、ステップのスキップや順序変更を禁止する。
- 承認後にトランザクションデータが変更された場合は、認可資格情報を失効し、プロセスをリセットし、攻撃として記録する。
- 実行直前に、対象トランザクションが適切に承認済みであることを確認する。

## 実装時の注意点

- 同じ OTP や同じ認可応答をセッション全体で使い回すと、不正取引へ流用される。
- 認可方式を追加するときは、古い方式のパラメータで新しい方式を迂回できないかを確認する。
- 署名鍵やデバイスペアリングを使う場合は、鍵の配布、保護、置換、盗難を別途設計する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V6.5 | 一意で短寿命な認可資格情報、OTP、チャレンジ、認可方式変更時の再承認 |
| V8.3 | 高リスク操作のサーバ側認可、認可方式の強制、取引データと認可の結合 |
| V15.1 | 状態遷移の順序制御、認可スキップ、承認後改ざん、TOCTOU の防止 |
| V15.4 | 実行前の最終認可確認、監査ログ、認可済み取引と実行処理の結合 |

