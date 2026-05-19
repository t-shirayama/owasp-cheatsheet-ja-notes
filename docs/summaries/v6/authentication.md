# 認証チートシート 要約

## Attribution

- Original: Authentication Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese summary added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../../translations/v6/authentication.md](../../translations/v6/authentication.md)
- 開発チェックリスト: [../../checklists/v6/authentication.md](../../checklists/v6/authentication.md)

## 概要

認証は、主体が主張どおりであることを認証器で検証する機能です。安全な認証では、ユーザー識別子、パスワード強度、保存と比較、リカバリ、パスワード変更、TLS、再認証、エラーメッセージ、自動攻撃対策、MFA、ログ、IdP 連携、リスクベース認証を一貫したフローとして設計します。

## 要点

- User ID は予測困難にし、内部用の機密アカウントを公開 UI からログイン可能にしない。
- パスワードは MFA ありなら 8 文字未満、MFA なしなら 15 文字未満を弱いとみなし、少なくとも 64 文字まで許可する。
- パスワードを黙って切り詰めず、Unicode と空白を含む文字を許可し、漏えい済みパスワードをブロックする。
- パスワード保存は Password Storage Cheat Sheet に従い、比較は安全な比較関数または定数時間比較を使う。
- パスワード変更、メール変更、支払い情報変更などの機密操作では、現在パスワード、MFA、チャレンジなどで再認証する。
- 認証失敗、パスワードリカバリ、アカウント作成では、本文、HTTP ステータスコード、処理時間がアカウント列挙につながらないようにする。
- ブルートフォース、クレデンシャルスタッフィング、パスワードスプレーには、MFA、スロットリング、ロックアウト、CAPTCHA を多層防御として組み合わせる。
- ロックアウトの失敗カウンターはアカウントに関連付け、他ユーザーをロックするサービス拒否に注意する。
- 認証失敗、パスワード失敗、アカウントロックアウトをログに記録し、レビューする。
- OIDC は認証/SSO、OAuth は API 認可に使い、ID Token は issuer、audience、署名、有効期限を検証する。
- SAML、FIDO、WebAuthn、Passkey などのプロトコルは、ユーザー名とパスワードを第三者アプリに保存させないための選択肢になる。
- パスワードマネージャーを妨げない標準フォーム、貼り付け許可、適切な `type` 属性を実装する。
- リスクベース認証では、IP、位置情報、デバイス、行動、時刻などからリスク階層を決め、許可、CAPTCHA、step-up MFA、ブロック、セッション失効を一貫して適用する。

## 実装時の注意点

- 認証の UX 改善は重要ですが、ユーザー列挙、トークン漏えい、セッション乗っ取りにつながる差分を作らないようにします。
- MFA は強力ですが、回復手順、登録メール変更、サポート窓口が弱いと迂回経路になります。
- CAPTCHA とロックアウトは補助防御です。ユーザー体験、サービス拒否、攻撃コストのバランスを設計します。
- OIDC、SAML、FIDO はライブラリとプロバイダ設定に依存する部分が大きいため、独自実装よりも保守された SDK と discovery/JWKS などの標準メカニズムを優先します。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V6.2 Password Security | パスワード強度、漏えい済みパスワード、保存、比較、変更、TLS |
| V6.3 General Authentication Security | 再認証、エラーメッセージ、列挙防止、自動攻撃対策、ログ |
| V6.5 General Multi-factor authentication requirements | MFA、step-up、トランザクション認証 |
| V6.7 Cryptographic authentication mechanism | TLS クライアント認証、FIDO、WebAuthn、Passkey |
| V6.8 Authentication with an Identity Provider | OIDC、SAML、IdP、パスワードレス/フェデレーション |
