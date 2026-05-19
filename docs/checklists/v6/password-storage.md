# パスワード保存チートシート 開発チェックリスト

## Attribution

- Original: Password Storage Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Development checklist added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../../translations/v6/password-storage.md](../../translations/v6/password-storage.md)
- 要約: [../../summaries/v6/password-storage.md](../../summaries/v6/password-storage.md)

## 開発チェックリスト

- [ ] 平文パスワードを保存しない。
- [ ] パスワードを復号可能な暗号化データとして保存しない。必要な場合は代替アーキテクチャを検討する。
- [ ] SHA-256、MD5、SHA-1 など高速ハッシュ関数単体をパスワード保存に使わない。
- [ ] 新規実装では Argon2id を優先し、最低でも 19 MiB、反復回数 2、並列度 1 を設定する。
- [ ] Argon2id が使えない場合は scrypt を選び、最低でも `N=2^17`、`r=8`、`p=1` を設定する。
- [ ] bcrypt はレガシー用途に限定し、work factor 10 以上を設定する。
- [ ] bcrypt の72バイト入力制限を確認し、長いパスワードの切り捨てを防ぐ。
- [ ] FIPS-140 準拠が必要な場合は PBKDF2-HMAC-SHA256 を 600,000 回以上で設定する。
- [ ] 各パスワードに一意なソルトを使う。ライブラリが自動管理する場合は設定と保存形式を確認する。
- [ ] pepper を使う場合は、パスワードデータベースとは別のシークレット保管庫または HSM に保管する。
- [ ] pepper の侵害時に、影響利用者へパスワードリセットを求める手順を用意する。
- [ ] work factor を本番相当環境で測定し、1回のハッシュ計算が過度に遅くならないよう調整する。
- [ ] ログイン試行のレート制限を組み合わせ、ハッシュ計算コストを悪用したサービス拒否を防ぐ。
- [ ] ハッシュ出力にアルゴリズム名、パラメータ、work factor を保存する。
- [ ] ハードウェア性能の向上に合わせて work factor を引き上げる計画を用意する。
- [ ] 利用者の次回ログイン時に古い work factor のハッシュを再ハッシュできるようにする。
- [ ] 非アクティブ利用者の古いハッシュを保持し続けないよう、期限切れとパスワードリセット手順を定義する。
- [ ] MD5、SHA-1 などのレガシーハッシュは、次回ログインまたはリセット時に現代的な方式へ移行する。
- [ ] 移行期間中に複数ハッシュ方式が混在しても検証できる保存形式を使う。
- [ ] bcrypt の前処理を行う場合は、NULL バイト、base64 化、password shucking、pepper の影響をレビューする。
- [ ] パスワードハッシュライブラリが Unicode、絵文字、NULL バイトを含む入力を扱えることを確認する。
- [ ] ハッシュ前にパスワードを不必要に切り詰めたり、正規化でエントロピーを落としたりしない。
- [ ] テストで、同一パスワードの異なるソルト、長いパスワード、Unicode 入力、旧ハッシュ移行、pepper 不在時の失敗を検証する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V6.5 | パスワードハッシュ関数、ソルト、work factor による認証シークレット保護 |
| V11.4 | pepper、シークレット保管庫、HSM、レガシーハッシュ移行を含む保存データ保護 |

