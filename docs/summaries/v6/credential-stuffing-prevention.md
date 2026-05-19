# クレデンシャルスタッフィング防止チートシート 要約

## Attribution

- Original: Credential Stuffing Prevention Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Credential_Stuffing_Prevention_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese summary added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../../translations/v6/credential-stuffing-prevention.md](../../translations/v6/credential-stuffing-prevention.md)
- 開発チェックリスト: [../../checklists/v6/credential-stuffing-prevention.md](../../checklists/v6/credential-stuffing-prevention.md)

## 概要

クレデンシャルスタッフィングは、他サービスから漏えいした利用者名とパスワードの組み合わせを試す攻撃である。パスワードスプレーや総当たり攻撃と同様、単独の対策では不十分であり、MFA、リスクベース認証、レート制限、IP/端末/接続インテリジェンス、漏えいパスワード検査、利用者通知を多層で組み合わせる。

## 要点

- MFA、パスキー、FIDO2/WebAuthn を可能な限り導入し、高リスクログインや高リスク操作ではステップアップ認証を求める。
- 新しい端末、異常な場所、匿名化サービス、複数アカウントへの試行、大量ログインなどをリスクシグナルとして扱う。
- CAPTCHA、IP 対策、デバイスフィンガープリント、接続フィンガープリント、多段階ログイン、JavaScript チャレンジは迂回され得るため、多層で使う。
- 検知量と緩和量、IP、アカウント、端末、接続特徴、成功率、失敗率などのメトリクスを監視する。
- IP ブロックや CAPTCHA は一時的・段階的に適用し、正規利用者への影響を測る。
- 利用者名をメールアドレスだけに依存しない設計は、攻撃者が漏えいリストをそのまま使う難易度を上げる。
- 新しいパスワード設定時に漏えいパスワードデータセットを照合し、既知漏えいパスワードを拒否する。
- 正しいパスワード後の MFA 失敗や、複数地点からのリセット要求など、意味のある異常イベントを利用者へ通知する。

## 実装時の注意点

- クライアント側の指紋、User-Agent、JavaScript 実行結果は偽装可能である。重要な判断では接続特徴や履歴、MFA など複数のシグナルを組み合わせる。
- 正規利用者を過剰にブロックしないよう、緩和ルールは解除条件、監視指標、サポート対応を含めて運用する。
- 通知を乱発すると利用者が無視するため、通知対象イベントと文面を設計する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V6.1 | 漏えいパスワード、弱いパスワード、利用者名再利用への対策 |
| V6.2 | MFA、パスキー、リスクベース認証、ステップアップ認証 |
| V6.3 | 異常ログイン通知、認証履歴、アクティブセッション表示と終了 |
| V6.6 | 自動化攻撃の検知、レート制限、CAPTCHA、IP/端末/接続メトリクス |

