# 暗号化ストレージチートシート 開発チェックリスト

## Attribution

- Original: Cryptographic Storage Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Development checklist added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../translations/cryptographic-storage.md](../translations/cryptographic-storage.md)
- 要約: [../summaries/cryptographic-storage.md](../summaries/cryptographic-storage.md)

## 開発チェックリスト

### V11.1 Cryptographic Inventory and Documentation

- [ ] 文書化する: 保護対象データ、保存場所、暗号化層、使用アルゴリズム、鍵 ID、鍵保管場所を一覧化する。
- [ ] 定義する: 脅威モデルに基づき、物理盗難、DB 侵害、アプリ侵害、内部者、クラウド管理面侵害のどれに対処するか決める。
- [ ] 確認する: パスワードは可逆暗号ではなく安全なパスワードハッシュで保存する。

### V11.2 Secure Cryptography Implementation

- [ ] 禁止する: 独自暗号、独自モード、独自パディングを実装すること。
- [ ] 使用する: 信頼できる標準ライブラリまたはプラットフォーム API を使う。
- [ ] 実装する: 利用可能な場合は GCM または CCM などの認証付き暗号を使う。
- [ ] 実装する: CTR または CBC を使う場合は Encrypt-then-MAC などで完全性と真正性を別途保護する。
- [ ] 禁止する: ECB を通常用途で使うこと。
- [ ] 実装する: RSA 暗号化では OAEP などのランダムパディングを有効化する。
- [ ] 実装する: 暗号化データにもサーバー側認可、アクセス制御、ログ、ネットワーク分離を適用する。

### V11.3 Encryption Algorithms

- [ ] 使用する: 対称暗号は AES 128 bit 以上、理想的には 256 bit を使う。
- [ ] 使用する: 非対称暗号は Curve25519 など安全な ECC を優先する。
- [ ] 確認する: RSA を使う場合は 2048 bit 以上の鍵長を使う。
- [ ] 確認する: アルゴリズムの既知攻撃、成熟度、第三者承認、性能、ライブラリ品質、移植性、規制要件をレビューする。

### V11.5 Random Values

- [ ] 使用する: 鍵、IV、セッション ID、CSRF トークン、パスワードリセットトークンは CSPRNG で生成する。
- [ ] 禁止する: `Math.random()`、`java.util.Random`、Python の `random()` など通常 PRNG をセキュリティ用途に使うこと。
- [ ] 確認する: UUID/GUID をセキュリティ用途に使う場合、Version 4 かつ CSPRNG に基づくことを確認する。
- [ ] 禁止する: Version 1 UUID を秘密値や予測困難性が必要な識別子として使うこと。

### V13.3 Secret Management

- [ ] 実装する: 鍵の生成、保管、配布、展開、ローテーション、廃止を含む鍵管理プロセスを定義しテストする。
- [ ] 使用する: 可能な場合は HSM、KMS、Key Vault、Vault、OS/フレームワークの安全な保管 API を使う。
- [ ] 禁止する: 鍵をソースコードへハードコードすること。
- [ ] 禁止する: 鍵をバージョン管理へコミットすること。
- [ ] 禁止する: 鍵を環境変数へ保存する設計に依存すること。
- [ ] 分離する: 鍵と暗号化データを別の保管場所または別システムへ分離する。
- [ ] 実装する: DEK と KEK を使う場合、KEK を DEK と別に保管し、KEK は DEK 以上の強度にする。
- [ ] ローテーションする: 侵害疑い、離職、暗号期間経過、データ量上限、新しい攻撃公開時に鍵をローテーションできるようにする。

### V14.1 Data Protection Documentation

- [ ] 最小化する: 保存不要な機密情報を保存しない。
- [ ] 文書化する: 機密データ分類、保存理由、保存期間、暗号化要否、規制要件を記録する。
- [ ] テストする: 鍵ローテーション、旧データ復号、バックアップ復号、鍵失効、暗号ライブラリ変更手順を検証する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V11.1 Cryptographic Inventory and Documentation | 暗号資産、鍵、データ分類、暗号化層の文書化 |
| V11.2 Secure Cryptography Implementation | 標準実装、独自暗号禁止、認証付き暗号、多層防御 |
| V11.3 Encryption Algorithms | AES、ECC、RSA、GCM/CCM、ECB 禁止 |
| V11.5 Random Values | CSPRNG、UUID/GUID、鍵・IV・トークン生成 |
| V13.3 Secret Management | KMS、Vault、HSM、鍵保管、鍵とデータの分離 |
| V14.1 Data Protection Documentation | 保存最小化、機密データ分類、規制要件 |
