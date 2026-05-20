---
title: Security Terminology Cheat Sheet
hide_title: true
---

<div className="docHero" data-category="encoding-and-sanitization">
  <h1>セキュリティ用語チートシート</h1>
  <div className="docMeta">
    <span className="docPill">最終更新: 2026-05-20</span>
    <span className="docPill">読了時間: 約 15 分</span>
    <span className="docPill">カテゴリ: 入力検証とサニタイズ</span>
  </div>
</div>

<div className="tabbedContent">
  <input className="tabInput" type="radio" name="security-terminology-view" id="security-terminology-original" />
  <input className="tabInput" type="radio" name="security-terminology-view" id="security-terminology-translation" defaultChecked />
  <input className="tabInput" type="radio" name="security-terminology-view" id="security-terminology-summary" />
  <input className="tabInput" type="radio" name="security-terminology-view" id="security-terminology-checklist" />
  <input className="tabInput" type="radio" name="security-terminology-view" id="security-terminology-bilingual" />

  <div className="contentTabs">
    <label htmlFor="security-terminology-original" title="OWASP 原文">原本</label>
    <label htmlFor="security-terminology-translation" title="日本語訳">翻訳</label>
    <label htmlFor="security-terminology-summary" title="短くまとめた内容">要点</label>
    <label htmlFor="security-terminology-checklist" title="実装確認用">チェックリスト</label>
    <label htmlFor="security-terminology-bilingual" title="原文と翻訳を並べて確認">対比表示</label>
  </div>

<section id="security-terminology-original-panel" className="tabPanel originalPanel contentPanel">

## Introduction

This cheat sheet provides clear definitions and distinctions for security terminology that is often confused, even by experienced developers. Understanding these terms is critical for correctly implementing security controls and following standards like the [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/).

## Table of Contents

- [Data Handling: Encoding, Escaping, Sanitization, and Serialization](#data-handling-encoding-escaping-sanitization-and-serialization)
- [Cryptography: Encryption, Hashing, and Signatures](#cryptography-encryption-hashing-and-signatures)
- [Identity: Authentication and Authorization](#identity-authentication-and-authorization)
- [Federated Identity Terms](#federated-identity-terms)
- [References](#references)

## Data Handling: Encoding, Escaping, Sanitization, and Serialization

These terms relate to how data is transformed for transport, storage, or display.

### Encoding

**Definition:** Transforming data into a different format using a publicly available scheme, so that it can be safely consumed by a different system.

- **Purpose:** Not for security, but for data usability and compatibility.
- **Reversibility:** Always reversible.
- **Examples:** Base64, URL Encoding, HTML Entity Encoding.
- **Security Context:** Using the wrong encoding can lead to vulnerabilities, but encoding itself is not a security control.

### Escaping

**Definition:** A sub-type of encoding where specific characters are prefixed with a "signal" character (like a backslash) to prevent them from being misinterpreted by a parser as control characters.

- **Purpose:** To ensure the interpreter treats the data as text rather than code/commands.
- **Examples:** `\\'` in SQL, `\\n` in strings, `&lt;` in HTML.
- **Security Context:** Essential for preventing Injection attacks (XSS, SQLi).

### Sanitization

**Definition:** The process of cleaning or filtering input by removing, replacing, or modifying potentially dangerous characters or content.

- **Purpose:** To make "dirty" input "clean" according to a security policy.
- **Examples:** Stripping `<script>` tags from HTML input, removing special characters from a filename.
- **Security Context:** Use as a secondary defense; prefer parameterized queries or output escaping where possible.

### Serialization

**Definition:** Converting an object or data structure into a format that can be stored or transmitted (e.g., a byte stream) and later reconstructed.

- **Purpose:** Data persistence and communication.
- **Security Context:** **Insecure Deserialization** occurs when untrusted data is used to reconstruct an object, potentially leading to Remote Code Execution (RCE).

---

## Cryptography: Encryption, Hashing, and Signatures

These terms relate to protecting the confidentiality, integrity, and authenticity of data.

### Encryption

**Definition:** Transforming data (plaintext) into an unreadable format (ciphertext) using a secret key.

- **Purpose:** **Confidentiality**. Only authorized parties with the key can read the data.
- **Reversibility:** Reversible (Decryption) with the correct key.
- **Types:** Symmetric (same key) and Asymmetric (public/private keys).

### Hashing

**Definition:** Transforming data into a fixed-size string (a "hash" or "digest") using a mathematical function.

- **Purpose:** **Integrity**. A small change in the input results in a completely different hash.
- **Reversibility:** One-way (non-reversible).
- **Security Context:** Used for password storage (with salt) and verifying file integrity.
- **Examples:** SHA-256, Argon2, bcrypt.

### Signatures (Digital Signatures)

**Definition:** Using asymmetric cryptography to provide proof of the origin and integrity of a message.

- **Purpose:** **Authenticity** and **Non-repudiation**. Proves who sent the message and that it wasn't altered.
- **Mechanism:** The sender signs a hash of the message with their *private key*; the receiver verifies it with the sender's *public key*.
- **Example:** JWT signatures, GPG signatures.

---

## Identity: Authentication and Authorization

### Authentication (AuthN)

**Definition:** The process of verifying who a user is.

- **Question:** "Who are you?"
- **Factors:** Something you know (password), something you have (token), something you are (biometrics).

### Authorization (AuthZ)

**Definition:** The process of verifying what a user has permission to do.

- **Question:** "Are you allowed to do this?"
- **Security Context:** Occurs *after* successful authentication.
- **Examples:** Role-Based Access Control (RBAC), Attribute-Based Access Control (ABAC).

---

## Federated Identity Terms

When working with OAuth2, SAML, or OIDC, these terms are frequently used:

| Term | Definition | Context |
| :--- | :--- | :--- |
| **Identity Provider (IdP)** | The system that creates, maintains, and manages identity information and provides authentication services. | Google, Okta, Azure AD |
| **Relying Party (RP)** | An application or service that relies on an IdP to authenticate users. | Your web app using "Login with Google" |
| **Service Provider (SP)** | In SAML, the equivalent of a Relying Party. | Your enterprise app using SAML |
| **Principal** | The entity (user, service, or device) being authenticated. | The user logging in |

</section>

<section id="security-terminology-translation-panel" className="tabPanel translationPanel contentPanel">

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

</section>

<section id="security-terminology-summary-panel" className="tabPanel summaryPanel contentPanel">

- エンコーディングは互換性のための形式変換であり、単独では防御策ではない。
- エスケープはインタプリタが入力をコードとして解釈しないようにする。
- サニタイゼーションは補助的な防御であり、パラメータ化や出力エンコーディングを優先する。
- 暗号化、ハッシュ、署名は目的と可逆性が異なる。
- 認証は「誰か」、認可は「何を許可するか」を扱う。

</section>

<section id="security-terminology-checklist-panel" className="tabPanel checklistPanel contentPanel">

- [ ] 認証(AuthN)と認可(AuthZ)を設計、実装、テストで区別する。
- [ ] エンコーディングをセキュリティ制御として過大評価していないことを確認する。
- [ ] インジェクション対策では、入力サニタイズだけでなくパラメータ化や適切な出力エンコーディングを実装する。
- [ ] 暗号化、ハッシュ、デジタル署名の目的を設計書に明記する。
- [ ] 信頼できないデータのデシリアライズを禁止または厳格に制御する。
- [ ] レビューで用語の誤用による要件漏れやテスト漏れを確認する。

</section>

<section id="security-terminology-bilingual-panel" className="tabPanel bilingualPanel">

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Introduction

This cheat sheet provides clear definitions and distinctions for security terminology that is often confused, even by experienced developers. Understanding these terms is critical for correctly implementing security controls and following standards like the [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## Introduction

このチートシートは、経験豊富な開発者でも混同しがちなセキュリティ用語について、明確な定義と区別を示します。これらの用語を理解することは、セキュリティ管理策を正しく実装し、[OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/) のような標準に従うために重要です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Table of Contents

- [Data Handling: Encoding, Escaping, Sanitization, and Serialization](#data-handling-encoding-escaping-sanitization-and-serialization)
- [Cryptography: Encryption, Hashing, and Signatures](#cryptography-encryption-hashing-and-signatures)
- [Identity: Authentication and Authorization](#identity-authentication-and-authorization)
- [Federated Identity Terms](#federated-identity-terms)
- [References](#references)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## Table of Contents

- [データ処理: エンコーディング、エスケープ、サニタイゼーション、シリアライゼーション](#data-handling-encoding-escaping-sanitization-and-serialization)

- [暗号: 暗号化、ハッシュ、署名](#cryptography-encryption-hashing-and-signatures)

- [アイデンティティ: 認証と認可](#identity-authentication-and-authorization)

- [フェデレーションアイデンティティ用語](#federated-identity-terms)

- [参考資料](#references)

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Data Handling: Encoding, Escaping, Sanitization, and Serialization

These terms relate to how data is transformed for transport, storage, or display.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## Data Handling: Encoding, Escaping, Sanitization, and Serialization

これらの用語は、転送、保存、表示のためにデータをどのように変換するかに関係します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Encoding

**Definition:** Transforming data into a different format using a publicly available scheme, so that it can be safely consumed by a different system.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Encoding

**定義:** 公開された方式を使ってデータを別の形式に変換し、別のシステムが安全に処理できるようにすることです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- **Purpose:** Not for security, but for data usability and compatibility.
- **Reversibility:** Always reversible.
- **Examples:** Base64, URL Encoding, HTML Entity Encoding.
- **Security Context:** Using the wrong encoding can lead to vulnerabilities, but encoding itself is not a security control.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- **目的:** セキュリティのためではなく、データの利用性と互換性のためです。

- **可逆性:** 常に元に戻せます。

- **例:** Base64、URL Encoding、HTML Entity Encoding。

- **セキュリティ上の文脈:** 誤ったエンコーディングを使うと脆弱性につながることがありますが、エンコーディング自体はセキュリティ管理策ではありません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Escaping

**Definition:** A sub-type of encoding where specific characters are prefixed with a "signal" character (like a backslash) to prevent them from being misinterpreted by a parser as control characters.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Escaping

**定義:** エンコーディングの一種であり、特定の文字にバックスラッシュのような「合図」文字を前置して、パーサがそれらを制御文字として誤解しないようにすることです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- **Purpose:** To ensure the interpreter treats the data as text rather than code/commands.
- **Examples:** `\\'` in SQL, `\\n` in strings, `&lt;` in HTML.
- **Security Context:** Essential for preventing Injection attacks (XSS, SQLi).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- **目的:** インタプリタがデータをコードやコマンドではなくテキストとして扱うようにすることです。

- **例:** SQL での `\\'`、文字列での `\\n`、HTML での `&lt;`。

- **セキュリティ上の文脈:** XSS や SQL インジェクションなどのインジェクション攻撃を防ぐために不可欠です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Sanitization

**Definition:** The process of cleaning or filtering input by removing, replacing, or modifying potentially dangerous characters or content.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Sanitization

**定義:** 危険な可能性のある文字やコンテンツを削除、置換、変更して、入力をクリーニングまたはフィルタリングする処理です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- **Purpose:** To make "dirty" input "clean" according to a security policy.
- **Examples:** Stripping `<script>` tags from HTML input, removing special characters from a filename.
- **Security Context:** Use as a secondary defense; prefer parameterized queries or output escaping where possible.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- **目的:** セキュリティポリシーに従って、「汚れた」入力を「きれいな」入力にすることです。

- **例:** HTML 入力から `<script>` タグを取り除く、ファイル名から特殊文字を削除する。

- **セキュリティ上の文脈:** 二次的な防御として使用します。可能な場合は、パラメータ化クエリや出力エスケープを優先します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Serialization

**Definition:** Converting an object or data structure into a format that can be stored or transmitted (e.g., a byte stream) and later reconstructed.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Serialization

**定義:** オブジェクトやデータ構造を、保存または送信でき、後で再構築できる形式、たとえばバイトストリームに変換することです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- **Purpose:** Data persistence and communication.
- **Security Context:** **Insecure Deserialization** occurs when untrusted data is used to reconstruct an object, potentially leading to Remote Code Execution (RCE).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- **目的:** データの永続化と通信です。

- **セキュリティ上の文脈:** 信頼できないデータを使ってオブジェクトを再構築すると、**安全でないデシリアライゼーション**が発生し、リモートコード実行 (RCE) につながる可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Cryptography: Encryption, Hashing, and Signatures

These terms relate to protecting the confidentiality, integrity, and authenticity of data.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## Cryptography: Encryption, Hashing, and Signatures

これらの用語は、データの機密性、完全性、真正性の保護に関係します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Encryption

**Definition:** Transforming data (plaintext) into an unreadable format (ciphertext) using a secret key.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Encryption

**定義:** 秘密鍵を使ってデータ、つまり平文を読めない形式、つまり暗号文に変換することです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- **Purpose:** **Confidentiality**. Only authorized parties with the key can read the data.
- **Reversibility:** Reversible (Decryption) with the correct key.
- **Types:** Symmetric (same key) and Asymmetric (public/private keys).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- **目的:** **機密性**です。鍵を持つ認可された当事者だけがデータを読めます。

- **可逆性:** 正しい鍵があれば復号により元に戻せます。

- **種類:** 対称暗号、つまり同じ鍵を使う方式と、非対称暗号、つまり公開鍵と秘密鍵を使う方式があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Hashing

**Definition:** Transforming data into a fixed-size string (a "hash" or "digest") using a mathematical function.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Hashing

**定義:** 数学的な関数を使って、データを固定長の文字列、つまり「ハッシュ」または「ダイジェスト」に変換することです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- **Purpose:** **Integrity**. A small change in the input results in a completely different hash.
- **Reversibility:** One-way (non-reversible).
- **Security Context:** Used for password storage (with salt) and verifying file integrity.
- **Examples:** SHA-256, Argon2, bcrypt.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- **目的:** **完全性**です。入力が少し変わるだけで、まったく異なるハッシュになります。

- **可逆性:** 一方向であり、元に戻せません。

- **セキュリティ上の文脈:** ソルトを併用したパスワード保存や、ファイルの完全性検証に使われます。

- **例:** SHA-256、Argon2、bcrypt。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Signatures (Digital Signatures)

**Definition:** Using asymmetric cryptography to provide proof of the origin and integrity of a message.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Signatures (Digital Signatures)

**定義:** 非対称暗号を使って、メッセージの送信元と完全性を証明することです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- **Purpose:** **Authenticity** and **Non-repudiation**. Proves who sent the message and that it wasn't altered.
- **Mechanism:** The sender signs a hash of the message with their *private key*; the receiver verifies it with the sender's *public key*.
- **Example:** JWT signatures, GPG signatures.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- **目的:** **真正性**と**否認防止**です。誰がメッセージを送信したか、およびメッセージが改ざんされていないことを証明します。

- **仕組み:** 送信者はメッセージのハッシュに自分の*秘密鍵*で署名し、受信者は送信者の*公開鍵*でそれを検証します。

- **例:** JWT 署名、GPG 署名。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Identity: Authentication and Authorization

### Authentication (AuthN)

**Definition:** The process of verifying who a user is.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## Identity: Authentication and Authorization

### Authentication (AuthN)

**定義:** 利用者が誰であるかを検証する処理です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- **Question:** "Who are you?"
- **Factors:** Something you know (password), something you have (token), something you are (biometrics).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- **問い:** 「あなたは誰ですか?」

- **要素:** 知っているもの、たとえばパスワード、持っているもの、たとえばトークン、本人自身であるもの、たとえば生体情報です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Authorization (AuthZ)

**Definition:** The process of verifying what a user has permission to do.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Authorization (AuthZ)

**定義:** 利用者に何を実行する権限があるかを検証する処理です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- **Question:** "Are you allowed to do this?"
- **Security Context:** Occurs *after* successful authentication.
- **Examples:** Role-Based Access Control (RBAC), Attribute-Based Access Control (ABAC).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- **問い:** 「これを実行することは許可されていますか?」

- **セキュリティ上の文脈:** 認証に成功した*後*に行われます。

- **例:** ロールベースアクセス制御 (RBAC)、属性ベースアクセス制御 (ABAC)。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Federated Identity Terms

When working with OAuth2, SAML, or OIDC, these terms are frequently used:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## Federated Identity Terms

OAuth2、SAML、OIDC を扱うとき、次の用語がよく使われます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

| Term | Definition | Context |
| :--- | :--- | :--- |
| **Identity Provider (IdP)** | The system that creates, maintains, and manages identity information and provides authentication services. | Google, Okta, Azure AD |
| **Relying Party (RP)** | An application or service that relies on an IdP to authenticate users. | Your web app using "Login with Google" |
| **Service Provider (SP)** | In SAML, the equivalent of a Relying Party. | Your enterprise app using SAML |
| **Principal** | The entity (user, service, or device) being authenticated. | The user logging in |

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

| 用語 | 定義 | 文脈 |
| :--- | :--- | :--- |
| **Identity Provider (IdP)** | アイデンティティ情報を作成、維持、管理し、認証サービスを提供するシステムです。 | Google、Okta、Azure AD |
| **Relying Party (RP)** | IdP に依存して利用者を認証するアプリケーションまたはサービスです。 | 「Google でログイン」を使う Web アプリ |
| **Service Provider (SP)** | SAML において Relying Party に相当するものです。 | SAML を使うエンタープライズアプリ |
| **Principal** | 認証されるエンティティ、つまり利用者、サービス、またはデバイスです。 | ログインする利用者 |

</div>
</div>

</section>
</div>

## References

<div className="referenceFooter">

- [OWASP ASVS Standard](https://owasp.org/www-project-application-security-verification-standard/)
- [OWASP Key Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Key_Management_Cheat_Sheet.html)
- [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- [OWASP Input Validation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)

</div>


## Attribution

<div className="attributionFooter">

- Original: Security Terminology Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Security_Terminology_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: English original retained for comparison. Japanese translation added. Bilingual display generated from official source and local Japanese notes.
- Retrieved: 2026-05-20

</div>
