# 多要素認証チートシート 要約

## Attribution

- Original: Multifactor Authentication Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese summary added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../translations/multifactor-authentication.md](../translations/multifactor-authentication.md)
- 開発チェックリスト: [../checklists/multifactor-authentication.md](../checklists/multifactor-authentication.md)

## 概要

多要素認証 (MFA) は、パスワード漏えい、クレデンシャルスタッフィング、パスワードスプレーによるアカウント侵害を減らすための主要な認証制御である。効果を出すには、独立した認証要素を選び、登録、変更、リセット、失敗時通知まで含めて安全に運用する必要がある。

## 要点

- 同じ種類の要素を複数要求しても MFA ではない。知識、所持、本人要素など、独立した要素を組み合わせる。
- すべての利用者に MFA を提供し、管理者や高権限利用者、重要操作では必須にする。
- Web UI、API、モバイルアプリ、管理画面など、すべての認証経路に MFA または同等の保護を適用する。
- OTP は短い有効期限、単回使用、試行回数制限、成功時失効を実装し、ログ出力や長期平文保存を禁止する。
- パスキー、U2F、WebAuthn/FIDO2 など、フィッシング耐性の高い方式を優先する。
- SMS や電話によるコードは制限付き認証器として扱い、高価値または PII 取り扱いアプリでは避ける。
- MFA リセットや要素変更はアカウント乗っ取りの迂回経路になり得るため、再認証、本人確認、通知、遅延適用を組み合わせる。
- リスクベース認証により、新端末、新しい場所、高リスク操作でステップアップ認証を求める。

## 実装時の注意点

- MFA は導入しただけでは十分ではない。リカバリ手続き、サポート運用、通知、ログ、レート制限が弱いと、攻撃者はそこを迂回経路として使う。
- MFA as a Service を使う場合は、外部サービス侵害時の影響、可用性、監査ログ、シークレット管理、契約上のインシデント通知を確認する。
- 利用者体験を改善する場合も、MFA の無効化ではなくリスクベース適用やパスキーなど摩擦の少ない強い方式を優先する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V6.2 | MFA の適用対象、認証経路、高権限利用者の保護 |
| V6.3 | OTP、復旧コード、MFA リセットの安全な取り扱い |
| V6.4 | 秘密の質問を弱い回復要素として使わない設計 |
| V6.5 | 認証要素の強度、保存、フィッシング耐性の評価 |
| V6.8 | リスクベース認証と高リスク操作のステップアップ認証 |

