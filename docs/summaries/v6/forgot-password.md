# パスワードリセットチートシート 要約

## Attribution

- Original: Forgot Password Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese summary added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../../translations/v6/forgot-password.md](../../translations/v6/forgot-password.md)
- 開発チェックリスト: [../../checklists/v6/forgot-password.md](../../checklists/v6/forgot-password.md)

## 概要

パスワードリセットは、正規利用者の復旧経路であると同時に、攻撃者にとって認証を迂回する経路にもなる。安全な実装では、アカウント列挙を防ぎ、トークンや PIN を短寿命かつ単回使用にし、URL 生成とリファラ漏えいを制御し、変更後の通知と既存セッション処理まで設計する。

## 要点

- 存在するアカウントと存在しないアカウントで、メッセージと応答時間を揃える。
- アカウント単位のレート制限や CAPTCHA で大量リセット要求と通知洪水を抑える。
- トークン、コード、PIN は暗号学的に安全な乱数生成器で作り、十分な長さ、利用者への紐付け、単回使用、有効期限、安全な保存を満たす。
- リセット URL は Host ヘッダーに依存せず、固定値または信頼済みドメインの許可リストで生成し、HTTPS を使う。
- リセットページでは `noreferrer` の Referrer Policy を使い、URL トークンの外部漏えいを抑える。
- PIN 検証後のセッションはパスワード再設定だけを許可する制限付きセッションにする。
- 秘密の質問をパスワードリセットの唯一の手段として使わない。
- パスワード変更後は通知し、自動ログインではなく通常のログインフローへ戻す。
- 既存セッションは失効するか、利用者に失効を選択させる。
- リセット要求を理由にアカウントをロックしない。

## 実装時の注意点

- パスワードリセットは通常のログインより弱くなってはならない。本人確認、通知、レート制限、監査ログを一体で設計する。
- リセットトークンを JWT で実装する場合は、署名検証、失効、期限、アルゴリズム混同など JWT 固有のリスクもレビューする。
- MFA リカバリは別の問題として扱い、MFA チートシートのリセット手順と整合させる。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V6.3 | リセットトークン、PIN、制限付きセッション、既存セッション失効 |
| V6.4 | 秘密の質問を単独の回復手段にしない設計 |
| V6.6 | アカウント列挙、通知洪水、ロックアウト悪用、変更通知への対策 |

