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
  <input className="tabInput" type="radio" name="security-terminology-view" id="security-terminology-translation" defaultChecked />
  <input className="tabInput" type="radio" name="security-terminology-view" id="security-terminology-summary" />
  <input className="tabInput" type="radio" name="security-terminology-view" id="security-terminology-checklist" />
  <input className="tabInput" type="radio" name="security-terminology-view" id="security-terminology-bilingual" />

  <div className="contentTabs">
    <label htmlFor="security-terminology-translation">翻訳</label>
    <label htmlFor="security-terminology-summary">要点</label>
    <label htmlFor="security-terminology-checklist">チェックリスト</label>
    <label htmlFor="security-terminology-bilingual">対比表示</label>
  </div>

<section id="security-terminology-translation-panel" className="tabPanel translationPanel contentPanel">

このチートシートは、開発者が混同しやすいセキュリティ用語を整理し、OWASP ASVSなどの要件を正しく実装するための共通語彙を提供します。

エンコーディングは公開された方式でデータ形式を変換することであり、それ自体はセキュリティ管理策ではありません。エスケープは、パーサがデータをコードや制御文字として解釈しないようにするエンコーディングの一種です。サニタイゼーションは危険な入力を削除、置換、変更する処理ですが、主要な防御ではなく補助的な防御として扱います。シリアライゼーションは保存や送信のためにオブジェクトを別形式へ変換する処理であり、信頼できないデータの復元はリモートコード実行などにつながることがあります。

暗号化は機密性のためにデータを復号可能な暗号文へ変換します。ハッシュは整合性確認などのために不可逆の固定長値を生成します。デジタル署名は送信元の真正性と改ざん検出を提供します。認証(AuthN)は利用者が誰かを確認する処理であり、認可(AuthZ)はその利用者が何を実行できるかを確認する処理です。

</section>

<section id="security-terminology-summary-panel" className="tabPanel summaryPanel contentPanel">

セキュリティ用語を正しく区別することで、要件、設計、レビュー、テストの誤解を減らします。特に、エンコーディングとエスケープ、サニタイゼーション、暗号化とハッシュ、認証と認可の違いを明確にします。

## 要点

- エンコーディングは互換性のための形式変換であり、単独では防御策ではない。
- エスケープはインタプリタが入力をコードとして解釈しないようにする。
- サニタイゼーションは補助的な防御であり、パラメータ化や出力エンコーディングを優先する。
- 暗号化、ハッシュ、署名は目的と可逆性が異なる。
- 認証は「誰か」、認可は「何を許可するか」を扱う。

## 実装時の注意点

- 設計書、レビューコメント、テストケースで同じ用語を同じ意味で使う。
- 用語の誤用が実装バグにつながる箇所は、原文や関連チートシートで確認する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V1.1, V6.1, V8.1, V11.1, V15.1 | セキュリティ用語の共通理解と適切な管理策選択 |

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

このチートシートは、開発者が混同しやすいセキュリティ用語を整理し、OWASP ASVSなどの要件を正しく実装するための共通語彙を提供します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Table of Contents

- [Data Handling: Encoding, Escaping, Sanitization, and Serialization](#data-handling-encoding-escaping-sanitization-and-serialization)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

エンコーディングは公開された方式でデータ形式を変換することであり、それ自体はセキュリティ管理策ではありません。エスケープは、パーサがデータをコードや制御文字として解釈しないようにするエンコーディングの一種です。サニタイゼーションは危険な入力を削除、置換、変更する処理ですが、主要な防御ではなく補助的な防御として扱います。シリアライゼーションは保存や送信のためにオブジェクトを別形式へ変換する処理であり、信頼できないデータの復元はリモートコード実行などにつながることがあります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- [Cryptography: Encryption, Hashing, and Signatures](#cryptography-encryption-hashing-and-signatures)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

暗号化は機密性のためにデータを復号可能な暗号文へ変換します。ハッシュは整合性確認などのために不可逆の固定長値を生成します。デジタル署名は送信元の真正性と改ざん検出を提供します。認証(AuthN)は利用者が誰かを確認する処理であり、認可(AuthZ)はその利用者が何を実行できるかを確認する処理です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- [Identity: Authentication and Authorization](#identity-authentication-and-authorization)

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- [Federated Identity Terms](#federated-identity-terms)

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- [References](#references)

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Data Handling: Encoding, Escaping, Sanitization, and Serialization

These terms relate to how data is transformed for transport, storage, or display.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Encoding

**Definition:** Transforming data into a different format using a publicly available scheme, so that it can be safely consumed by a different system.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- **Purpose:** Not for security, but for data usability and compatibility.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- **Reversibility:** Always reversible.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- **Examples:** Base64, URL Encoding, HTML Entity Encoding.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- **Security Context:** Using the wrong encoding can lead to vulnerabilities, but encoding itself is not a security control.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Escaping

**Definition:** A sub-type of encoding where specific characters are prefixed with a "signal" character (like a backslash) to prevent them from being misinterpreted by a parser as control characters.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- **Purpose:** To ensure the interpreter treats the data as text rather than code/commands.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- **Examples:** `\\'` in SQL, `\\n` in strings, `&lt;` in HTML.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- **Security Context:** Essential for preventing Injection attacks (XSS, SQLi).

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Sanitization

**Definition:** The process of cleaning or filtering input by removing, replacing, or modifying potentially dangerous characters or content.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- **Purpose:** To make "dirty" input "clean" according to a security policy.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- **Examples:** Stripping `<script>` tags from HTML input, removing special characters from a filename.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- **Security Context:** Use as a secondary defense; prefer parameterized queries or output escaping where possible.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Serialization

**Definition:** Converting an object or data structure into a format that can be stored or transmitted (e.g., a byte stream) and later reconstructed.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- **Purpose:** Data persistence and communication.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- **Security Context:** **Insecure Deserialization** occurs when untrusted data is used to reconstruct an object, potentially leading to Remote Code Execution (RCE).

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

---

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Cryptography: Encryption, Hashing, and Signatures

These terms relate to protecting the confidentiality, integrity, and authenticity of data.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Encryption

**Definition:** Transforming data (plaintext) into an unreadable format (ciphertext) using a secret key.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- **Purpose:** **Confidentiality**. Only authorized parties with the key can read the data.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- **Reversibility:** Reversible (Decryption) with the correct key.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- **Types:** Symmetric (same key) and Asymmetric (public/private keys).

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Hashing

**Definition:** Transforming data into a fixed-size string (a "hash" or "digest") using a mathematical function.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- **Purpose:** **Integrity**. A small change in the input results in a completely different hash.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- **Reversibility:** One-way (non-reversible).

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- **Security Context:** Used for password storage (with salt) and verifying file integrity.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- **Examples:** SHA-256, Argon2, bcrypt.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Signatures (Digital Signatures)

**Definition:** Using asymmetric cryptography to provide proof of the origin and integrity of a message.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- **Purpose:** **Authenticity** and **Non-repudiation**. Proves who sent the message and that it wasn't altered.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- **Mechanism:** The sender signs a hash of the message with their *private key*; the receiver verifies it with the sender's *public key*.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- **Example:** JWT signatures, GPG signatures.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

---

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Identity: Authentication and Authorization

### Authentication (AuthN)

**Definition:** The process of verifying who a user is.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- **Question:** "Who are you?"

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- **Factors:** Something you know (password), something you have (token), something you are (biometrics).

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Authorization (AuthZ)

**Definition:** The process of verifying what a user has permission to do.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- **Question:** "Are you allowed to do this?"

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- **Security Context:** Occurs *after* successful authentication.

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- **Examples:** Role-Based Access Control (RBAC), Attribute-Based Access Control (ABAC).

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

---

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Federated Identity Terms

When working with OAuth2, SAML, or OIDC, these terms are frequently used:

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

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

---

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## References

- [OWASP ASVS Standard](https://owasp.org/www-project-application-security-verification-standard/)

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- [OWASP Key Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Key_Management_Cheat_Sheet.html)

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)

</div>

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- [OWASP Input Validation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)

</div>

</div>

</section>
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
