# クレデンシャルスタッフィング防止チートシート 開発チェックリスト

## Attribution

- Original: Credential Stuffing Prevention Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Credential_Stuffing_Prevention_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Development checklist added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../translations/credential-stuffing-prevention.md](../translations/credential-stuffing-prevention.md)
- 要約: [../summaries/credential-stuffing-prevention.md](../summaries/credential-stuffing-prevention.md)

## 開発チェックリスト

- [ ] 総当たり、クレデンシャルスタッフィング、パスワードスプレーを区別して検知できるログ項目を定義する。
- [ ] MFA、パスキー、FIDO2/WebAuthn を導入し、管理者と高権限利用者では必須にする。
- [ ] 新しいブラウザ、端末、IP、通常と異なる国や場所、匿名化サービス、複数アカウントへの試行をリスクシグナルとして評価する。
- [ ] 大きな金額の取引や管理設定変更でステップアップ認証を要求する。
- [ ] IP 単位、アカウント単位、サブネット単位、送信元分類単位でレート制限や緩和を設定する。
- [ ] 短時間のバースト攻撃と長時間の低頻度分散攻撃の両方を検知するメトリクスを収集する。
- [ ] 検知した攻撃量と実際に緩和した攻撃量を別々に測定する。
- [ ] CAPTCHA をログイン全体ではなく疑わしいリクエストへ段階的に適用し、解決率と正規利用者影響を監視する。
- [ ] IP ブロックを主防御にせず、一時的な緩和として扱い、解除条件を定義する。
- [ ] 住宅回線、ホスティング事業者、VPN、プロキシ、国、地理情報などの IP インテリジェンスを緩和判断に使う。
- [ ] アカウントの過去の IP 認証履歴を保存し、直近利用 IP が緩和対象に入った場合は追加確認や通知につなげる。
- [ ] User-Agent、OS、ブラウザ、言語、画面解像度などの端末特徴を、偽装可能な補助シグナルとして扱う。
- [ ] JA3、HTTP/2 特徴、HTTP ヘッダー順序などの接続フィンガープリントを、User-Agent との矛盾検出に使う。
- [ ] 予測困難な利用者名や生成された利用者名を使う場合は、連番や氏名由来など列挙しやすい形式を避ける。
- [ ] 多段階ログインを導入する場合は、途中ステップでアカウント列挙を発生させない。
- [ ] JavaScript チャレンジやヘッドレスブラウザ検知を使う場合は、アクセシビリティへの影響と迂回可能性を評価する。
- [ ] 応答遅延、計算パズル、Proof-of-Work などの劣化策を導入する場合は、利用者体験、攻撃者の回避策、コストを評価する。
- [ ] 新しいパスワード設定時に漏えいパスワードデータセットを照合し、既知漏えいパスワードを拒否する。
- [ ] 正しいパスワード後の MFA 失敗など、アカウント侵害の可能性が高いイベントを利用者へ通知する。
- [ ] 通知を乱発しないよう、通知対象イベント、頻度、文面、サポート導線を定義する。
- [ ] 利用者が直近ログインの日時、場所、端末、アクティブセッションを確認できる画面を用意する。
- [ ] 利用者が不正なアクティブセッションを終了できるようにする。
- [ ] 攻撃検知、緩和ルール変更、ブロック解除、利用者通知、サポート対応の運用手順を記録する。
- [ ] テストで、プロキシ分散、低頻度スプレー、単一 IP バースト、CAPTCHA 迂回、多段階ログインでの列挙、通知過多を検証する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V6.1 | 漏えいパスワード、弱いパスワード、利用者名再利用への対策 |
| V6.2 | MFA、パスキー、リスクベース認証、ステップアップ認証 |
| V6.3 | 異常ログイン通知、認証履歴、アクティブセッション表示と終了 |
| V6.6 | 自動化攻撃の検知、レート制限、CAPTCHA、IP/端末/接続メトリクス |

