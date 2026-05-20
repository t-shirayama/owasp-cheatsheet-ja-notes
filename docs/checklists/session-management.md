# セッション管理チートシート 開発チェックリスト

## Attribution

- Original: Session Management Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Development checklist added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../translations/session-management.md](../translations/session-management.md)
- 要約: [../summaries/session-management.md](../summaries/session-management.md)

## 開発チェックリスト

### セッション ID

- [ ] セッション ID は暗号論的に安全な乱数で生成する。
- [ ] セッション ID は少なくとも 64 ビットのエントロピーを持つ。
- [ ] 独自生成が必要な場合は、128 ビット以上の一意な値を使う。
- [ ] セッション ID 名からフレームワークや言語を推測されないようにする。
- [ ] セッション ID の値にユーザー情報、権限、個人情報、内部状態を含めない。
- [ ] セッション ID をログへ直接記録しない。

### Cookie と通信

- [ ] セッション ID は Cookie で交換し、URL パラメータや hidden フィールドで渡さない。
- [ ] セッション Cookie に `Secure` を設定する。
- [ ] セッション Cookie に `HttpOnly` を設定する。
- [ ] セッション Cookie に用途に応じた `SameSite` を設定する。
- [ ] `Domain` と `Path` を必要最小限にする。
- [ ] 未認証状態を含め、セッションを扱う全画面で HTTPS を強制する。

### ライフサイクル

- [ ] アプリケーションが発行したセッション ID だけを受け入れる。
- [ ] 未知のセッション ID を受け入れず、新規セッションへ採用しない。
- [ ] セッション ID を他の入力と同様に検証する。
- [ ] ログイン後にセッション ID を更新する。
- [ ] 権限レベル変更後にセッション ID を更新する。
- [ ] パスワード変更、MFA 設定変更、支払い情報変更などのリスクイベントで再認証を要求する。
- [ ] アイドルタイムアウトを実装する。
- [ ] 絶対タイムアウトを実装する。
- [ ] ログアウト時にサーバー側セッションを無効化する。
- [ ] ログアウト時にクライアント側 Cookie を期限切れにする。

### 保存とクライアント側

- [ ] セッションストアに機密情報を保存する場合は暗号化とアクセス制御を適用する。
- [ ] `localStorage` にセッション ID を保存しない。
- [ ] `sessionStorage` を使う場合は XSS の影響を評価する。
- [ ] 機密ページのブラウザキャッシュ制御を設定する。

### 監視と検知

- [ ] セッション作成、利用、更新、期限切れ、ログアウト、破棄を記録する。
- [ ] 期限切れセッション ID の再利用を検知する。
- [ ] セッション ID 推測や総当たりの兆候を検知する。
- [ ] 同一アカウントの異常な同時セッションを検知する。
- [ ] IP アドレスや User-Agent との結び付けを使う場合は、誤検知時のユーザー影響を評価する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V7 Session Management | セッション ID、Cookie、期限切れ、ログアウト、再認証、攻撃検知 |
| V16.2 General Logging | セッション作成、利用、更新、期限切れ、破棄のログ記録 |
