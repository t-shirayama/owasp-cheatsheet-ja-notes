# 多要素認証チートシート 開発チェックリスト

## Attribution

- Original: Multifactor Authentication Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Development checklist added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../translations/multifactor-authentication.md](../translations/multifactor-authentication.md)
- 要約: [../summaries/multifactor-authentication.md](../summaries/multifactor-authentication.md)

## 開発チェックリスト

- [ ] MFA で使う要素が独立していることを確認する。同じ攻撃で侵害されるパスワードと PIN だけの組み合わせを MFA として扱わない。
- [ ] すべての利用者に MFA を提供し、管理者、高権限利用者、高価値アカウントでは MFA を必須にする。
- [ ] Web UI、API、モバイルアプリ、管理画面など、すべてのログイン経路で MFA または同等の保護を要求する。
- [ ] パスワード変更、秘密の質問変更、メールアドレス変更、MFA 無効化、管理者権限への昇格で再認証またはステップアップ MFA を要求する。
- [ ] TOTP を実装する場合は、標準方式を採用し、利用者を特定ベンダー専用アプリに固定しない。
- [ ] OTP に短い有効期限を設定し、検証成功時または再送時に既存 OTP を失効させる。
- [ ] OTP の試行回数をアカウント単位とセッション単位で制限し、総当たりやリプレイを検知する。
- [ ] OTP、TOTP シード、復旧コードをログ、メトリクス、エラーレポート、デバッグ出力に含めない。
- [ ] OTP を長期に平文保存しない。短時間の露出を抑えるため、保存が必要な OTP はハッシュ化する。
- [ ] 復旧コードは単回使用にし、発行時だけ表示し、保存時はシークレットとして扱う。
- [ ] SMS または電話コードを使う場合は、高価値または PII 取り扱いアプリで禁止するか、リスク受容、レート制限、SIM スワップ監視、移行計画を記録する。
- [ ] パスキー、U2F、WebAuthn/FIDO2 などフィッシング耐性の高い方式を優先候補として評価する。
- [ ] MFA 失敗時に、別要素の試行、復旧手続き、利用者への通知を提供し、不審な試行ではパスワード変更を促す。
- [ ] MFA 失敗通知には、時刻、ブラウザ、接続元の地理的情報など、利用者が不審性を判断できる情報を含める。
- [ ] MFA リセット手続きで、本人確認、単回復旧コード、複数要素登録、サポート承認など、通常認証より弱くならない制御を実装する。
- [ ] MFA 要素の変更前に、既存の登録済み要素で再認証を要求し、アクティブセッションだけに依存しない。
- [ ] MFA 要素の変更、無効化、復旧コード再発行をアウトオブバンド経路で通知する。
- [ ] 高価値アカウントでは、MFA 要素変更に遅延適用または追加承認を設定する。
- [ ] リスクベース認証で、新端末、新しい場所、高リスク地域、重要操作を検知し、追加 MFA を要求する。
- [ ] MFA as a Service を使う場合は、外部サービス障害、侵害、ログ取得、シークレット管理、契約上の通知要件をレビューする。
- [ ] MFA 登録、失敗、リセット、要素変更、無効化のイベントを監査ログに記録し、シークレット値は記録しない。
- [ ] テストで、OTP 再利用、期限切れ OTP、過剰試行、別ログイン経路からの MFA バイパス、MFA リセット悪用を検証する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V6.2 | MFA 適用対象、全ログイン経路、高権限利用者の保護 |
| V6.3 | OTP、復旧コード、MFA リセットのシークレット管理 |
| V6.4 | 秘密の質問や回復手続きによる認証強度低下の防止 |
| V6.5 | 認証要素の保存、強度、フィッシング耐性の確認 |
| V6.8 | 高リスク操作の再認証、リスクベース認証、ステップアップ MFA |

