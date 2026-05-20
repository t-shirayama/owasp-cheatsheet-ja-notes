# セキュリティ用語チートシート 日本語訳

## Attribution

- Original: Security Terminology Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Security_Terminology_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-20

## 日本語訳

## Introduction

このチートシートは、経験豊富な開発者でも混同しがちなセキュリティ用語について、明確な定義と区別を示します。これらの用語を理解することは、セキュリティ管理策を正しく実装し、[OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/) のような標準に従うために重要です。

## Table of Contents

- [データ処理: エンコーディング、エスケープ、サニタイゼーション、シリアライゼーション](#data-handling-encoding-escaping-sanitization-and-serialization)

- [暗号: 暗号化、ハッシュ、署名](#cryptography-encryption-hashing-and-signatures)

- [アイデンティティ: 認証と認可](#identity-authentication-and-authorization)

- [フェデレーションアイデンティティ用語](#federated-identity-terms)

- [参考資料](#references)

## Data Handling: Encoding, Escaping, Sanitization, and Serialization

これらの用語は、転送、保存、表示のためにデータをどのように変換するかに関係します。

### Encoding

**定義:** 公開された方式を使ってデータを別の形式に変換し、別のシステムが安全に処理できるようにすることです。

- **目的:** セキュリティのためではなく、データの利用性と互換性のためです。

- **可逆性:** 常に元に戻せます。

- **例:** Base64、URL Encoding、HTML Entity Encoding。

- **セキュリティ上の文脈:** 誤ったエンコーディングを使うと脆弱性につながることがありますが、エンコーディング自体はセキュリティ管理策ではありません。

### Escaping

**定義:** エンコーディングの一種であり、特定の文字にバックスラッシュのような「合図」文字を前置して、パーサがそれらを制御文字として誤解しないようにすることです。

- **目的:** インタプリタがデータをコードやコマンドではなくテキストとして扱うようにすることです。

- **例:** SQL での `\\'`、文字列での `\\n`、HTML での `&lt;`。

- **セキュリティ上の文脈:** XSS や SQL インジェクションなどのインジェクション攻撃を防ぐために不可欠です。

### Sanitization

**定義:** 危険な可能性のある文字やコンテンツを削除、置換、変更して、入力をクリーニングまたはフィルタリングする処理です。

- **目的:** セキュリティポリシーに従って、「汚れた」入力を「きれいな」入力にすることです。

- **例:** HTML 入力から `<script>` タグを取り除く、ファイル名から特殊文字を削除する。

- **セキュリティ上の文脈:** 二次的な防御として使用します。可能な場合は、パラメータ化クエリや出力エスケープを優先します。

### Serialization

**定義:** オブジェクトやデータ構造を、保存または送信でき、後で再構築できる形式、たとえばバイトストリームに変換することです。

- **目的:** データの永続化と通信です。

- **セキュリティ上の文脈:** 信頼できないデータを使ってオブジェクトを再構築すると、**安全でないデシリアライゼーション**が発生し、リモートコード実行 (RCE) につながる可能性があります。

---

## Cryptography: Encryption, Hashing, and Signatures

これらの用語は、データの機密性、完全性、真正性の保護に関係します。

### Encryption

**定義:** 秘密鍵を使ってデータ、つまり平文を読めない形式、つまり暗号文に変換することです。

- **目的:** **機密性**です。鍵を持つ認可された当事者だけがデータを読めます。

- **可逆性:** 正しい鍵があれば復号により元に戻せます。

- **種類:** 対称暗号、つまり同じ鍵を使う方式と、非対称暗号、つまり公開鍵と秘密鍵を使う方式があります。

### Hashing

**定義:** 数学的な関数を使って、データを固定長の文字列、つまり「ハッシュ」または「ダイジェスト」に変換することです。

- **目的:** **完全性**です。入力が少し変わるだけで、まったく異なるハッシュになります。

- **可逆性:** 一方向であり、元に戻せません。

- **セキュリティ上の文脈:** ソルトを併用したパスワード保存や、ファイルの完全性検証に使われます。

- **例:** SHA-256、Argon2、bcrypt。

### Signatures (Digital Signatures)

**定義:** 非対称暗号を使って、メッセージの送信元と完全性を証明することです。

- **目的:** **真正性**と**否認防止**です。誰がメッセージを送信したか、およびメッセージが改ざんされていないことを証明します。

- **仕組み:** 送信者はメッセージのハッシュに自分の*秘密鍵*で署名し、受信者は送信者の*公開鍵*でそれを検証します。

- **例:** JWT 署名、GPG 署名。

---

## Identity: Authentication and Authorization

### Authentication (AuthN)

**定義:** 利用者が誰であるかを検証する処理です。

- **問い:** 「あなたは誰ですか?」

- **要素:** 知っているもの、たとえばパスワード、持っているもの、たとえばトークン、本人自身であるもの、たとえば生体情報です。

### Authorization (AuthZ)

**定義:** 利用者に何を実行する権限があるかを検証する処理です。

- **問い:** 「これを実行することは許可されていますか?」

- **セキュリティ上の文脈:** 認証に成功した*後*に行われます。

- **例:** ロールベースアクセス制御 (RBAC)、属性ベースアクセス制御 (ABAC)。

---

## Federated Identity Terms

OAuth2、SAML、OIDC を扱うとき、次の用語がよく使われます。

| 用語 | 定義 | 文脈 |
| :--- | :--- | :--- |
| **Identity Provider (IdP)** | アイデンティティ情報を作成、維持、管理し、認証サービスを提供するシステムです。 | Google、Okta、Azure AD |
| **Relying Party (RP)** | IdP に依存して利用者を認証するアプリケーションまたはサービスです。 | 「Google でログイン」を使う Web アプリ |
| **Service Provider (SP)** | SAML において Relying Party に相当するものです。 | SAML を使うエンタープライズアプリ |
| **Principal** | 認証されるエンティティ、つまり利用者、サービス、またはデバイスです。 | ログインする利用者 |

---

## References

- [OWASP ASVS Standard](https://owasp.org/www-project-application-security-verification-standard/)

- [OWASP Key Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Key_Management_Cheat_Sheet.html)

- [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)

- [OWASP Input Validation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V1.1 | セキュリティ要件とアーキテクチャで用語を一貫させる |
| V6.1 | 暗号化、ハッシュ、署名を正しく区別する |
| V8.1 | データ保護とデータ処理の語彙を明確にする |
| V11.1 | 入力、出力、エンコーディングの用語を明確にする |
| V15.1 | セキュリティ管理プロセスで共通語彙を使う |
