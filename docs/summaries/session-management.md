# セッション管理チートシート 要約

## Attribution

- Original: Session Management Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese summary added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../translations/session-management.md](../translations/session-management.md)
- 開発チェックリスト: [../checklists/session-management.md](../checklists/session-management.md)

## 概要

セッション ID は、認証済みユーザーを継続的に識別し、アクセス制御と結び付ける高価値な秘密です。漏えい、予測、固定化、総当たりが起きると、攻撃者はユーザーになりすまして操作できます。

セッション管理では、推測困難な ID、Cookie 属性、TLS、strict mode、権限変更時の ID 更新、適切なタイムアウト、ログアウト、再認証、攻撃検知を組み合わせて守ります。

## 要点

- セッション ID は意味のないランダム値にし、少なくとも 64 ビットのエントロピーを確保する。
- セッション ID にはユーザー情報、権限、個人情報、内部状態を含めない。
- セッション ID の交換には Cookie を使い、URL や hidden フィールドで渡さない。
- Cookie には `Secure`、`HttpOnly`、`SameSite`、適切な `Domain` / `Path` / 有効期限を設定する。
- アプリケーションが発行したセッション ID だけを受け入れる strict mode にする。
- ログイン、権限変更、重要操作の前後でセッション ID 更新や再認証を行う。
- アイドルタイムアウト、絶対タイムアウト、ログアウトを実装する。
- セッションライフサイクルをログ化し、推測、異常利用、期限切れ後利用、同時ログオンを監視する。

## 実装時の注意点

- `localStorage` や `sessionStorage` は JavaScript からアクセス可能なため、セッション ID の保存先としては慎重に扱います。
- セッションを IP アドレスや User-Agent に強く固定すると、正当なユーザーを誤って遮断する可能性があります。
- ログアウト時はクライアント側 Cookie の削除だけでなく、サーバー側セッションの無効化も行います。
- セッション関連ログに生のセッション ID を記録してはいけません。必要な場合は安全な派生識別子を使います。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V7 Session Management | セッション ID、Cookie、期限切れ、ログアウト、再認証、攻撃検知 |
| V16.2 General Logging | セッション作成、利用、更新、期限切れ、破棄のログ記録 |
