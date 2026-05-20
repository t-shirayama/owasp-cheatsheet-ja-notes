# 暗号化ストレージチートシート 要約

## Attribution

- Original: Cryptographic Storage Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese summary added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../translations/cryptographic-storage.md](../translations/cryptographic-storage.md)
- 開発チェックリスト: [../checklists/cryptographic-storage.md](../checklists/cryptographic-storage.md)

## 概要

暗号化ストレージは、保存データを脅威モデルに応じて保護する設計領域です。何を保存しないか、どの層で暗号化するか、どの標準アルゴリズムとモードを使うか、鍵をどう生成・保管・配布・ローテーションするかを一体で設計します。

## 要点

- パスワードは可逆暗号で保存せず、安全なパスワードハッシュを使う。
- 最初に脅威モデルを定義し、アプリケーション、データベース、ファイルシステム、ハードウェアのどの層で暗号化するか決める。
- 機密情報は可能な限り保存しない。保存する場合は分類、保存場所、規制要件を文書化する。
- 対称暗号は AES 128 bit 以上、理想的には 256 bit と安全なモードを使う。
- 非対称暗号は Curve25519 などの ECC を優先し、RSA の場合は 2048 bit 以上と OAEP を使う。
- 独自暗号を作らない。GCM/CCM など認証付き暗号を優先し、ECB を避ける。
- 鍵、IV、セッション ID、CSRF トークン、パスワードリセットトークンには CSPRNG を使う。
- UUID/GUID は実装が CSPRNG を使うことを確認できない限り、セキュリティ用途の乱数として扱わない。
- 鍵管理プロセスには、生成、保管、配布、展開、ローテーション、廃止、侵害時対応を含める。
- 鍵は KMS、Vault、HSM などで保管し、ソースコード、バージョン管理、環境変数へ置かない。
- 鍵とデータを分離し、必要に応じて DEK と KEK による envelope encryption を使う。

## 実装時の注意点

- 暗号化だけに依存せず、認可、アクセス制御、ログ、ネットワーク分離を組み合わせます。
- 古い鍵で暗号化されたデータとバックアップをどう復号するか、鍵ローテーション前に決めておきます。
- 規制要件がある場合は、FIPS、PCI DSS などが許容するアルゴリズムと実装を確認します。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V11.1 Cryptographic Inventory and Documentation | 暗号資産、鍵、データ分類、暗号化層の文書化 |
| V11.2 Secure Cryptography Implementation | 標準実装、独自暗号禁止、認証付き暗号、多層防御 |
| V11.3 Encryption Algorithms | AES、ECC、RSA、GCM/CCM、ECB 禁止 |
| V11.5 Random Values | CSPRNG、UUID/GUID、鍵・IV・トークン生成 |
| V13.3 Secret Management | KMS、Vault、HSM、鍵保管、鍵とデータの分離 |
| V14.1 Data Protection Documentation | 保存最小化、機密データ分類、規制要件 |
