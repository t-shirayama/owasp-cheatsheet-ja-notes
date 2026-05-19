# パスワード保存チートシート 要約

## Attribution

- Original: Password Storage Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese summary added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../../translations/v6/password-storage.md](../../translations/v6/password-storage.md)
- 開発チェックリスト: [../../checklists/v6/password-storage.md](../../checklists/v6/password-storage.md)

## 概要

パスワードは平文や高速ハッシュで保存せず、低速でメモリハードなパスワードハッシュ関数、利用者ごとの一意なソルト、運用環境に合わせた work factor で保護する。新規実装では Argon2id を優先し、利用できない場合は scrypt、レガシーでは bcrypt、FIPS-140 要件では PBKDF2 を適切な設定で使う。

## 要点

- 平文保存と SHA-256 など高速ハッシュ単体での保存を禁止する。
- 暗号化は復号可能であり、原則としてパスワード検証用の保存には使わない。
- Argon2id は最低でも 19 MiB、反復回数 2、並列度 1 を基準にする。
- scrypt は最低でも `N=2^17`、`r=8`、`p=1` を基準にする。
- bcrypt は Argon2id や scrypt が使えないレガシー用途に限定し、work factor 10 以上と72バイト入力制限を考慮する。
- FIPS-140 準拠が必要な場合は PBKDF2-HMAC-SHA256 を 600,000 回以上で使う。
- ソルトは各パスワードで一意にし、レインボーテーブルや同一パスワード判別を防ぐ。
- pepper はパスワードデータベースとは別のシークレット保管庫や HSM に保管し、侵害時のリセット手順を用意する。
- work factor は測定して決め、ログイン時再ハッシュやリセットで将来引き上げられるようにする。
- レガシーハッシュは段階的に移行し、方式名とパラメータを保存する。

## 実装時の注意点

- work factor を過度に上げると正規ログインが遅くなり、大量ログイン試行によるサービス拒否の原因になる。
- bcrypt の前処理では、NULL バイト、base64 化、password shucking、pepper の扱いを理解していない実装を避ける。
- Unicode、絵文字、NULL バイトを含むパスワード入力に対応し、ハッシュ前にエントロピーを減らさない。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V6.5 | パスワードハッシュ関数、ソルト、work factor による認証シークレット保護 |
| V11.4 | pepper、シークレット保管庫、HSM、レガシーハッシュ移行を含む保存データ保護 |

