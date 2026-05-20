---
title: Cryptographic Storage Cheat Sheet
hide_title: true
---

<div className="docHero" data-category="cryptographic-storage">
  <h1>暗号化ストレージチートシート</h1>
  <div className="docMeta">
    <span className="docPill">最終更新: 2026-05-20</span>
    <span className="docPill">読了時間: 約 9 分</span>
    <span className="docPill">カテゴリ: 暗号</span>
  </div>
</div>


<div className="tabbedContent">
  <input className="tabInput" type="radio" name="cryptographic-storage-view" id="cryptographic-storage-original" />
  <input className="tabInput" type="radio" name="cryptographic-storage-view" id="cryptographic-storage-translation" defaultChecked />
  <input className="tabInput" type="radio" name="cryptographic-storage-view" id="cryptographic-storage-summary" />
  <input className="tabInput" type="radio" name="cryptographic-storage-view" id="cryptographic-storage-checklist" />
  <input className="tabInput" type="radio" name="cryptographic-storage-view" id="cryptographic-storage-bilingual" />

  <div className="contentTabs">
    <label htmlFor="cryptographic-storage-original" title="OWASP 原文">原本</label>
    <label htmlFor="cryptographic-storage-translation" title="日本語訳">翻訳</label>
    <label htmlFor="cryptographic-storage-summary" title="短くまとめた内容">要点</label>
    <label htmlFor="cryptographic-storage-checklist" title="実装確認用">チェックリスト</label>
    <label htmlFor="cryptographic-storage-bilingual" title="原文と翻訳を並べて確認">対比表示</label>
  </div>

<section id="cryptographic-storage-original-panel" className="tabPanel originalPanel contentPanel">

## Introduction

This article provides a simple model to follow when implementing solutions to protect data at rest.

Passwords should not be stored using reversible encryption - secure password hashing algorithms should be used instead. The [Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html) contains further guidance on storing passwords.

## Architectural Design

The first step in designing any application is to consider the overall architecture of the system, as this will have a huge impact on the technical implementation.

This process should begin with considering the [threat model](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html) of the application (i.e, who you are trying to protect that data against).

The use of dedicated secret or key management systems can provide an additional layer of security protection, as well as making the management of secrets significantly easier - however it comes at the cost of additional complexity and administrative overhead - so may not be feasible for all applications. Note that many cloud environments provide these services, so these should be taken advantage of where possible. The [Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html) contains further guidance on this topic.

### Where to Perform Encryption

Encryption can be performed on a number of levels in the application stack, such as:

- At the application level.
- At the database level (e.g, [SQL Server TDE](https://docs.microsoft.com/en-us/sql/relational-databases/security/encryption/transparent-data-encryption?view=sql-server-ver15))
- At the filesystem level (e.g, BitLocker or LUKS)
- At the hardware level (e.g, encrypted RAID cards or SSDs)

Which layer(s) are most appropriate will depend on the threat model. For example, hardware level encryption is effective at protecting against the physical theft of the server, but will provide no protection if an attacker is able to compromise the server remotely.

### Minimise the Storage of Sensitive Information

The best way to protect sensitive information is to not store it in the first place. Although this applies to all kinds of information, it is most often applicable to credit card details, as they are highly desirable for attackers, and PCI DSS has such stringent requirements for how they must be stored. Wherever possible, the storage of sensitive information should be avoided.

## Algorithms

For symmetric encryption **AES** with a key that's at least **128 bits** (ideally **256 bits**) and a secure [mode](#cipher-modes) should be used as the preferred algorithm.

For asymmetric encryption, use elliptical curve cryptography (ECC) with a secure curve such as **Curve25519** as a preferred algorithm. If ECC is not available and  **RSA** must be used, then ensure that the key is at least **2048 bits**.

Many other symmetric and asymmetric algorithms are available which have their own pros and cons, and they may be better or worse than AES or Curve25519 in specific use cases. When considering these, a number of factors should be taken into account, including:

- Key size.
- Known attacks and weaknesses of the algorithm.
- Maturity of the algorithm.
- Approval by third parties such as [NIST's algorithmic validation program](https://csrc.nist.gov/projects/cryptographic-algorithm-validation-program).
- Performance (both for encryption and decryption).
- Quality of the libraries available.
- Portability of the algorithm (i.e, how widely supported is it).

In some cases there may be regulatory requirements that limit the algorithms that can be used, such as [FIPS 140-2](https://csrc.nist.gov/csrc/media/publications/fips/140/2/final/documents/fips1402annexa.pdf) or [PCI DSS](https://www.pcisecuritystandards.org/pci_security/glossary#Strong%20Cryptography).

### Custom Algorithms

Don't do this.

### Cipher Modes

There are various [modes](https://en.wikipedia.org/wiki/Block_cipher_mode_of_operation) that can be used to allow block ciphers (such as AES) to encrypt arbitrary amounts of data, in the same way that a stream cipher would. These modes have different security and performance characteristics, and a full discussion of them is outside the scope of this cheat sheet. Some of the modes have requirements to generate secure initialisation vectors (IVs) and other attributes, but these should be handled automatically by the library.

Where available, authenticated modes should always be used. These provide guarantees of the integrity and authenticity of the data, as well as confidentiality. The most commonly used authenticated modes are **[GCM](https://en.wikipedia.org/wiki/Galois/Counter_Mode)** and **[CCM](https://en.wikipedia.org/wiki/CCM_mode)**, which should be used as a first preference.

If GCM or CCM are not available, then [CTR](https://en.wikipedia.org/wiki/Block_cipher_mode_of_operation#Counter_%28CTR%29) mode or [CBC](https://en.wikipedia.org/wiki/Block_cipher_mode_of_operation#Cipher_Block_Chaining_%28CBC%29) mode should be used. As these do not provide any guarantees about the authenticity of the data, separate authentication should be implemented, such as using the [Encrypt-then-MAC](https://en.wikipedia.org/wiki/Authenticated_encryption#Encrypt-then-MAC_%28EtM%29) technique. Care needs to be taken when using this method with [variable length messages](https://en.wikipedia.org/wiki/CBC-MAC#Security_with_fixed_and_variable-length_messages)

[ECB](https://en.wikipedia.org/wiki/Block_cipher_mode_of_operation#ECB) should not be used outside of very specific circumstances.

### Random Padding

For RSA, it is essential to enable Random Padding. Random Padding is also known as OAEP or Optimal Asymmetric Encryption Padding. This class of defense protects against Known Plain Text Attacks by adding randomness at the beginning of the payload.

The Padding Schema of [PKCS#1](https://wikipedia.org/wiki/RSA_%28cryptosystem)#Padding_schemes) is typically used in this case.

### Secure Random Number Generation

Random numbers (or strings) are needed for various security critical functionality, such as generating encryption keys, IVs, session IDs, CSRF tokens or password reset tokens. As such, it is important that these are generated securely, and that it is not possible for an attacker to guess and predict them.

It is generally not possible for computers to generate truly random numbers (without special hardware), so most systems and languages provide two different types of randomness.

Pseudo-Random Number Generators (PRNG) provide low-quality randomness that are much faster, and can be used for non-security related functionality (such as ordering results on a page, or randomising UI elements). However, they **must not** be used for anything security critical, as it is often possible for attackers to guess or predict the output.

Cryptographically Secure Pseudo-Random Number Generators (CSPRNG) are designed to produce a much higher quality of randomness (more strictly, a greater amount of entropy), making them safe to use for security-sensitive functionality. However, they are slower and more CPU intensive, can end up blocking in some circumstances when large amounts of random data are requested. As such, if large amounts of non-security related randomness are needed, they may not be appropriate.

The table below shows the recommended algorithms for each language, as well as insecure functions that should not be used.

| Language    | Unsafe Functions                                                                                                                   | Cryptographically Secure Functions                                                                                                                                                                                                                                                                                                                                         |
|-------------|------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| C           | `random()`, `rand()`                                                                                                               | [getrandom(2)](http://man7.org/linux/man-pages/man2/getrandom.2.html) |
| Java        | `Math.random()`, `StrictMath.random()`, `java.util.Random`, `java.util.SplittableRandom`, `java.util.concurrent.ThreadLocalRandom` | [java.security.SecureRandom](https://docs.oracle.com/javase/8/docs/api/java/security/SecureRandom.html), [java.util.UUID.randomUUID()](https://docs.oracle.com/javase/8/docs/api/java/util/UUID.html#randomUUID--) |
| PHP         | `array_rand()`, `lcg_value()`, `mt_rand()`, `rand()`, `uniqid()`                                                                   | [random_bytes()](https://www.php.net/manual/en/function.random-bytes.php), [Random\\Engine\\Secure](https://www.php.net/manual/en/class.random-engine-secure.php) in PHP 8, [random_int()](https://www.php.net/manual/en/function.random-int.php) in PHP 7, [openssl_random_pseudo_bytes()](https://www.php.net/manual/en/function.openssl-random-pseudo-bytes.php) in PHP 5 |
| .NET/C#     | `Random()`                                                                                                                         | [RandomNumberGenerator](https://learn.microsoft.com/en-us/dotnet/api/system.security.cryptography.randomnumbergenerator?view=net-6.0) |
| Objective-C | `arc4random()`/`arc4random_uniform()` (Uses RC4 Cipher), subclasses of`GKRandomSource`, rand(), random()                           | [SecRandomCopyBytes](https://developer.apple.com/documentation/security/1399291-secrandomcopybytes?language=objc) |
| Python      | `random()`                                                                                                                         | [secrets()](https://docs.python.org/3/library/secrets.html#module-secrets) |
| Ruby        | `rand()`, `Random`                                                                                                                 | [SecureRandom](https://ruby-doc.org/stdlib-2.5.1/libdoc/securerandom/rdoc/SecureRandom.html) |
| Go          | `rand` using `math/rand` package                                                                                                   | [crypto.rand](https://golang.org/pkg/crypto/rand/) package |
| Rust        | `rand::prng::XorShiftRng`                                                                                                          | [rand::prng::chacha::ChaChaRng](https://docs.rs/rand/0.5.0/rand/prng/chacha/struct.ChaChaRng.html) and the rest of the Rust library [CSPRNGs.](https://docs.rs/rand/0.5.0/rand/prng/index.html#cryptographically-secure-pseudo-random-number-generators-csprngs) |
| Node.js     | `Math.random()`                                                                                                                    | [crypto.randomBytes()](https://nodejs.org/api/crypto.html#cryptorandombytessize-callback), [crypto.randomInt()](https://nodejs.org/api/crypto.html#cryptorandomintmin-max-callback), [crypto.randomUUID()](https://nodejs.org/api/crypto.html#cryptorandomuuidoptions) |

#### UUIDs and GUIDs

Universally unique identifiers (UUIDs or GUIDs) are sometimes used as a quick way to generate random strings. Although they can provide a reasonable source of randomness, this will depend on the [type or version](https://en.wikipedia.org/wiki/Universally_unique_identifier#Versions) of the UUID that is created.

Specifically, version 1 UUIDs are comprised of a high precision timestamp and the MAC address of the system that generated them, so are **not random** (although they may be hard to guess, given the timestamp is to the nearest 100ns). Type 4 UUIDs are randomly generated, although whether this is done using a CSPRNG will depend on the implementation. Unless this is known to be secure in the specific language or framework, the randomness of UUIDs should not be relied upon.

### Defence in Depth

Applications should be designed to still be secure even if cryptographic controls fail. Any information that is stored in an encrypted form should also be protected by additional layers of security. Application should also not rely on the security of encrypted URL parameters, and should enforce strong access control to prevent unauthorised access to information.

## Key Management

### Processes

Formal processes should be implemented (and tested) to cover all aspects of key management, including:

- Generating and storing new keys.
- Distributing keys to the required parties.
- Deploying keys to application servers.
- Rotating and decommissioning old keys

### Key Generation

Keys should be randomly generated using a cryptographically secure function, such as those discussed in the [Secure Random Number Generation](#secure-random-number-generation) section. Keys **should not** be based on common words or phrases, or on "random" characters generated by mashing the keyboard.

Where multiple keys are used (such as data separate data-encrypting and key-encrypting keys), they should be fully independent from each other.

### Key Lifetimes and Rotation

Encryption keys should be changed (or rotated) based on a number of different criteria:

- If the previous key is known (or suspected) to have been compromised.
    - This could also be caused by a someone who had access to the key leaving the organisation.
- After a specified period of time has elapsed (known as the cryptoperiod).
    - There are many factors that could affect what an appropriate cryptoperiod is, including the size of the key, the sensitivity of the data, and the threat model of the system. See section 5.3 of [NIST SP 800-57](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-57pt1r4.pdf) for further guidance.
- After the key has been used to encrypt a specific amount of data.
    - This would typically be `2^35` bytes (~34GB) for 64-bit keys and `2^68` bytes (~295 exabytes) for 128-bit block size.
- If there is a significant change to the security provided by the algorithm (such as a new attack being announced).

Once one of these criteria have been met, a new key should be generated and used for encrypting any new data. There are two main approaches for how existing data that was encrypted with the old key(s) should be handled:

1. Decrypting it and re-encrypting it with the new key.
2. Marking each item with the ID of the key that was used to encrypt it, and storing multiple keys to allow the old data to be decrypted.

The first option should generally be preferred, as it greatly simplifies both the application code and key management processes; however, it may not always be feasible. Note that old keys should generally be stored for a certain period after they have been retired, in case old backups of copies of the data need to be decrypted.

It is important that the code and processes required to rotate a key are in place **before** they are required, so that keys can be quickly rotated in the event of a compromise. Additionally, processes should also be implemented to allow the encryption algorithm or library to be changed, in case a new vulnerability is found in the algorithm or implementation.

## Key Storage

Securely storing cryptographic keys is one of the hardest problems to solve, as the application always needs to have some level of access to the keys in order to decrypt the data. While it may not be possible to fully protect the keys from an attacker who has fully compromised the application, a number of steps can be taken to make it harder for them to obtain the keys.

Where available, the secure storage mechanisms provided by the operating system, framework or cloud service provider should be used. These include:

- A physical Hardware Security Module (HSM).
- A virtual HSM.
- Key vaults such as [Amazon KMS](https://aws.amazon.com/kms/) or [Azure Key Vault](https://azure.microsoft.com/en-gb/services/key-vault/).
- An external secrets management service such as [Conjur](https://github.com/cyberark/conjur) or [HashiCorp Vault](https://github.com/hashicorp/vault).
- Secure storage APIs provided by the [ProtectedData](https://docs.microsoft.com/en-us/dotnet/api/system.security.cryptography.protecteddata?redirectedfrom=MSDN&view=netframework-4.8) class in the .NET framework.

There are many advantages to using these types of secure storage over simply putting keys in configuration files. The specifics of these will vary depending on the solution used, but they include:

- Central management of keys, especially in containerised environments.
- Easy key rotation and replacement.
- Secure key generation.
- Simplifying compliance with regulatory standards such as FIPS 140 or PCI DSS.
- Making it harder for an attacker to export or steal keys.

In some cases none of these will be available, such as in a shared hosting environment, meaning that it is not possible to obtain a high degree of protection for any encryption keys. However, the following basic rules can still be followed:

- Do not hard-code keys into the application source code.
- Do not check keys into version control systems.
- Protect the configuration files containing the keys with restrictive permissions.
- Avoid storing keys in environment variables, as these can be accidentally exposed through functions such as [phpinfo()](https://www.php.net/manual/en/function.phpinfo.php) or through the `/proc/self/environ` file.

The [Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html) provides more details on securely storing secrets.

### Separation of Keys and Data

Where possible, encryption keys should be stored in a separate location from encrypted data. For example, if the data is stored in a database, the keys should be stored in the filesystem. This means that if an attacker only has access to one of these (for example through directory traversal or SQL injection), they cannot access both the keys and the data.

Depending on the architecture of the environment, it may be possible to store the keys and data on separate systems, which would provide a greater degree of isolation.

### Encrypting Stored Keys

Where possible, encryption keys should themselves be stored in an encrypted form. At least two separate keys are required for this:

- The Data Encryption Key (DEK) is used to encrypt the data.
- The Key Encryption Key (KEK) is used to encrypt the DEK.

For this to be effective, the KEK must be stored separately from the DEK. The encrypted DEK can be stored with the data, but will only be usable if an attacker is able to also obtain the KEK, which is stored on another system.

The KEK should also be at least as strong as the DEK. The [envelope encryption](https://cloud.google.com/kms/docs/envelope-encryption) guidance from Google contains further details on how to manage DEKs and KEKs.

In simpler application architectures (such as shared hosting environments) where the KEK and DEK cannot be stored separately, there is limited value to this approach, as an attacker is likely to be able to obtain both of the keys at the same time. However, it can provide an additional barrier to unskilled attackers.

A key derivation function (KDF) could be used to generate a KEK from user-supplied input (such a passphrase), which would then be used to encrypt a randomly generated DEK. This allows the KEK to be easily changed (when the user changes their passphrase), without needing to re-encrypt the data (as the DEK remains the same).

</section>

<section id="cryptographic-storage-translation-panel" className="tabPanel translationPanel contentPanel">

## Introduction

この記事は、保存データを保護するソリューションを実装する際に従うための単純なモデルを提供します。

パスワードは可逆暗号で保存してはいけません。代わりに安全なパスワードハッシュアルゴリズムを使用する必要があります。[Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html) には、パスワード保存に関する追加のガイダンスがあります。

## Architectural Design

アプリケーション設計の最初のステップは、システム全体のアーキテクチャを検討することです。これは技術的な実装に大きな影響を与えるためです。

このプロセスは、アプリケーションの [脅威モデル](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html) を検討することから始めるべきです。つまり、誰からそのデータを保護しようとしているのかを明確にします。

専用のシークレット管理または鍵管理システムを使用すると、追加のセキュリティ保護層を提供でき、シークレット管理も大幅に容易になります。ただし、複雑さと管理上のオーバーヘッドが増えるため、すべてのアプリケーションで実現可能とは限りません。多くのクラウド環境ではこれらのサービスが提供されているため、可能な場合は活用すべきです。このトピックの詳細は [Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html) を参照してください。

### Where to Perform Encryption

暗号化は、アプリケーションスタックのさまざまなレベルで実行できます。

- アプリケーションレベル
- データベースレベル（例: [SQL Server TDE](https://docs.microsoft.com/en-us/sql/relational-databases/security/encryption/transparent-data-encryption?view=sql-server-ver15)）
- ファイルシステムレベル（例: BitLocker または LUKS）
- ハードウェアレベル（例: 暗号化 RAID カードまたは SSD）

どの層が最も適切かは、脅威モデルによって異なります。たとえば、ハードウェアレベルの暗号化はサーバーの物理的盗難に対して有効ですが、攻撃者がリモートからサーバーを侵害できる場合には保護になりません。

### Minimise the Storage of Sensitive Information

機密情報を保護する最良の方法は、そもそも保存しないことです。これはあらゆる種類の情報に当てはまりますが、攻撃者にとって価値が高く、PCI DSS が保存方法に厳格な要件を課しているクレジットカード情報に特に当てはまります。可能な限り、機密情報の保存は避けるべきです。

## Algorithms

対称暗号では、少なくとも **128 bit**、理想的には **256 bit** の鍵を持つ **AES** と安全な [モード](#cipher-modes) を優先アルゴリズムとして使用すべきです。

非対称暗号では、**Curve25519** などの安全な曲線を用いる楕円曲線暗号（ECC）を優先アルゴリズムとして使用します。ECC が利用できず **RSA** を使用しなければならない場合は、鍵長が少なくとも **2048 bit** であることを確認します。

他にも多数の対称・非対称アルゴリズムがあり、それぞれ長所と短所があります。特定のユースケースでは AES や Curve25519 より適している場合も、不適切な場合もあります。検討時には、次の要素を考慮します。

- 鍵長
- アルゴリズムに対する既知の攻撃と弱点
- アルゴリズムの成熟度
- [NIST のアルゴリズム検証プログラム](https://csrc.nist.gov/projects/cryptographic-algorithm-validation-program) など第三者による承認
- 性能（暗号化と復号の両方）
- 利用可能なライブラリの品質
- アルゴリズムの移植性、つまりどの程度広くサポートされているか

場合によっては、[FIPS 140-2](https://csrc.nist.gov/csrc/media/publications/fips/140/2/final/documents/fips1402annexa.pdf) や [PCI DSS](https://www.pcisecuritystandards.org/pci_security/glossary#Strong%20Cryptography) など、使用できるアルゴリズムを制限する規制要件が存在することがあります。

### Custom Algorithms

これを行ってはいけません。

### Cipher Modes

AES などのブロック暗号が、ストリーム暗号と同じように任意量のデータを暗号化できるようにするために、さまざまな [モード](https://en.wikipedia.org/wiki/Block_cipher_mode_of_operation) を使用できます。これらのモードには異なるセキュリティ特性と性能特性があり、詳細な議論はこのチートシートの範囲外です。一部のモードでは安全な初期化ベクトル（IV）やその他の属性の生成が必要ですが、これはライブラリによって自動的に処理されるべきです。

利用可能な場合は、認証付きモードを常に使用すべきです。これらは機密性に加えて、データの完全性と真正性を保証します。最も一般的に使われる認証付きモードは **[GCM](https://en.wikipedia.org/wiki/Galois/Counter_Mode)** と **[CCM](https://en.wikipedia.org/wiki/CCM_mode)** であり、第一候補として使用すべきです。

GCM または CCM が利用できない場合は、[CTR](https://en.wikipedia.org/wiki/Block_cipher_mode_of_operation#Counter_%28CTR%29) モードまたは [CBC](https://en.wikipedia.org/wiki/Block_cipher_mode_of_operation#Cipher_Block_Chaining_%28CBC%29) モードを使用すべきです。これらはデータの真正性を保証しないため、[Encrypt-then-MAC](https://en.wikipedia.org/wiki/Authenticated_encryption#Encrypt-then-MAC_%28EtM%29) などを使って別途認証を実装する必要があります。この方法を [可変長メッセージ](https://en.wikipedia.org/wiki/CBC-MAC#Security_with_fixed_and_variable-length_messages) に使用する際には注意が必要です。

[ECB](https://en.wikipedia.org/wiki/Block_cipher_mode_of_operation#ECB) は、非常に特殊な状況を除いて使用すべきではありません。

### Random Padding

RSA では Random Padding を有効にすることが不可欠です。Random Padding は OAEP、つまり Optimal Asymmetric Encryption Padding とも呼ばれます。この防御は、ペイロードの先頭にランダム性を追加することで、既知平文攻撃から保護します。

通常、この場合は [PKCS#1](https://wikipedia.org/wiki/RSA_(cryptosystem)#Padding_schemes) の Padding Schema が使用されます。

### Secure Random Number Generation

暗号鍵、IV、セッション ID、CSRF トークン、パスワードリセットトークンなど、セキュリティ上重要な機能では乱数または文字列が必要です。そのため、これらは安全に生成され、攻撃者が推測または予測できないようにすることが重要です。

コンピュータが特殊なハードウェアなしで真の乱数を生成することは一般にできないため、多くのシステムと言語では2種類のランダム性が提供されます。

疑似乱数生成器（PRNG）は品質の低いランダム性を提供しますが、高速であり、ページ上の結果の並び替えや UI 要素のランダム化など、セキュリティに関係しない機能に使用できます。しかし、攻撃者が出力を推測または予測できる場合が多いため、セキュリティ上重要な用途には **絶対に使用してはいけません**。

暗号学的に安全な疑似乱数生成器（CSPRNG）は、より高品質なランダム性、より厳密にはより大きなエントロピーを生成するように設計されており、セキュリティに敏感な機能に安全に使用できます。ただし、より低速で CPU 負荷が高く、大量のランダムデータが要求される場合には状況によってブロックされることがあります。そのため、セキュリティに関係しない大量のランダム性が必要な場合には適さないことがあります。

次の表は、各言語で推奨されるアルゴリズムと、使用してはいけない安全でない関数を示します。

| Language | Unsafe Functions | Cryptographically Secure Functions |
| --- | --- | --- |
| C | `random()`, `rand()` | [getrandom(2)](http://man7.org/linux/man-pages/man2/getrandom.2.html) |
| Java | `Math.random()`, `StrictMath.random()`, `java.util.Random`, `java.util.SplittableRandom`, `java.util.concurrent.ThreadLocalRandom` | [java.security.SecureRandom](https://docs.oracle.com/javase/8/docs/api/java/security/SecureRandom.html), [java.util.UUID.randomUUID()](https://docs.oracle.com/javase/8/docs/api/java/util/UUID.html#randomUUID--) |
| PHP | `array_rand()`, `lcg_value()`, `mt_rand()`, `rand()`, `uniqid()` | [random_bytes()](https://www.php.net/manual/en/function.random-bytes.php), [Random\Engine\Secure](https://www.php.net/manual/en/class.random-engine-secure.php), [random_int()](https://www.php.net/manual/en/function.random-int.php), [openssl_random_pseudo_bytes()](https://www.php.net/manual/en/function.openssl-random-pseudo-bytes.php) |
| .NET/C# | `Random()` | [RandomNumberGenerator](https://learn.microsoft.com/en-us/dotnet/api/system.security.cryptography.randomnumbergenerator?view=net-6.0) |
| Objective-C | `arc4random()`/`arc4random_uniform()`、`GKRandomSource` のサブクラス、`rand()`、`random()` | [SecRandomCopyBytes](https://developer.apple.com/documentation/security/1399291-secrandomcopybytes?language=objc) |
| Python | `random()` | [secrets()](https://docs.python.org/3/library/secrets.html#module-secrets) |
| Ruby | `rand()`, `Random` | [SecureRandom](https://ruby-doc.org/stdlib-2.5.1/libdoc/securerandom/rdoc/SecureRandom.html) |
| Go | `math/rand` パッケージの `rand` | [crypto.rand](https://golang.org/pkg/crypto/rand/) パッケージ |
| Rust | `rand::prng::XorShiftRng` | [rand::prng::chacha::ChaChaRng](https://docs.rs/rand/0.5.0/rand/prng/chacha/struct.ChaChaRng.html) と Rust ライブラリの [CSPRNGs](https://docs.rs/rand/0.5.0/rand/prng/index.html#cryptographically-secure-pseudo-random-number-generators-csprngs) |
| Node.js | `Math.random()` | [crypto.randomBytes()](https://nodejs.org/api/crypto.html#cryptorandombytessize-callback), [crypto.randomInt()](https://nodejs.org/api/crypto.html#cryptorandomintmin-max-callback), [crypto.randomUUID()](https://nodejs.org/api/crypto.html#cryptorandomuuidoptions) |

#### UUIDs and GUIDs

Universally unique identifier（UUID または GUID）は、ランダム文字列を生成する手軽な方法として使われることがあります。ある程度のランダム性を提供する場合もありますが、それは作成される UUID の [タイプまたはバージョン](https://en.wikipedia.org/wiki/Universally_unique_identifier#Versions) に依存します。

具体的には、バージョン 1 UUID は高精度タイムスタンプと生成したシステムの MAC アドレスで構成されるため、**ランダムではありません**（タイムスタンプが 100ns 単位であるため推測しにくい場合はあります）。タイプ 4 UUID はランダムに生成されますが、CSPRNG を使用するかどうかは実装に依存します。特定の言語またはフレームワークで安全であることが分かっていない限り、UUID のランダム性に依存すべきではありません。

### Defence in Depth

アプリケーションは、暗号制御が失敗した場合でも安全であり続けるように設計すべきです。暗号化形式で保存される情報も、追加のセキュリティ層で保護すべきです。また、暗号化された URL パラメータの安全性だけに依存せず、情報への不正アクセスを防ぐために強力なアクセス制御を実施すべきです。

## Key Management

### Processes

鍵管理のすべての側面をカバーする正式なプロセスを実装し、テストすべきです。これには次が含まれます。

- 新しい鍵の生成と保存
- 必要な相手への鍵の配布
- アプリケーションサーバーへの鍵の展開
- 古い鍵のローテーションと廃止

### Key Generation

鍵は、[Secure Random Number Generation](#secure-random-number-generation) セクションで説明したような暗号学的に安全な関数を使ってランダムに生成すべきです。鍵は一般的な単語やフレーズ、またはキーボードを適当に叩いて生成した「ランダム」文字列に基づいてはいけません。

複数の鍵を使用する場合（データ暗号化鍵と鍵暗号化鍵など）は、それらを互いに完全に独立させるべきです。

### Key Lifetimes and Rotation

暗号鍵は、次のような複数の基準に基づいて変更またはローテーションすべきです。

- 以前の鍵が侵害されたことが分かっている、または疑われる場合
  - これは鍵にアクセスできた人物が組織を離れた場合にも発生し得ます。
- 指定された期間、つまり暗号期間が経過した場合
  - 適切な暗号期間に影響する要素は、鍵のサイズ、データの機密性、システムの脅威モデルなど多数あります。詳細は [NIST SP 800-57](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-57pt1r4.pdf) の 5.3 節を参照してください。
- 鍵が特定量のデータを暗号化するために使用された場合
  - これは通常、64 bit 鍵で `2^35` バイト（約 34GB）、128 bit ブロックサイズで `2^68` バイト（約 295 エクサバイト）です。
- 新しい攻撃が発表されるなど、アルゴリズムが提供するセキュリティに重大な変化があった場合

これらの基準のいずれかに該当したら、新しい鍵を生成し、新しいデータの暗号化に使用すべきです。古い鍵で暗号化された既存データの扱いには、主に2つの方式があります。

1. 復号して新しい鍵で再暗号化する。
2. 各項目に暗号化に使われた鍵 ID を付与し、古いデータを復号できるように複数の鍵を保管する。

通常は1つ目の方式が望ましいです。アプリケーションコードと鍵管理プロセスの両方を大幅に単純化できるためです。ただし、常に実現可能とは限りません。古いバックアップやデータコピーを復号する必要がある場合に備えて、廃止された古い鍵を一定期間保存する必要があることにも注意してください。

鍵が侵害された場合に迅速にローテーションできるよう、鍵ローテーションに必要なコードとプロセスは、それが必要になる **前に** 用意しておくことが重要です。さらに、アルゴリズムまたは実装に新しい脆弱性が見つかった場合に備えて、暗号アルゴリズムまたはライブラリを変更できるプロセスも実装すべきです。

## Key Storage

暗号鍵を安全に保存することは、解決が最も難しい問題の一つです。アプリケーションはデータを復号するために常に何らかのレベルで鍵へアクセスする必要があるためです。アプリケーションを完全に侵害した攻撃者から鍵を完全に保護することはできない場合がありますが、鍵の取得を難しくするためにいくつかの対策を取ることができます。

利用可能な場合は、OS、フレームワーク、またはクラウドサービスプロバイダが提供する安全な保存メカニズムを使用すべきです。これには次が含まれます。

- 物理 Hardware Security Module（HSM）
- 仮想 HSM
- [Amazon KMS](https://aws.amazon.com/kms/) や [Azure Key Vault](https://azure.microsoft.com/en-gb/services/key-vault/) などの key vault
- [Conjur](https://github.com/cyberark/conjur) や [HashiCorp Vault](https://github.com/hashicorp/vault) などの外部シークレット管理サービス
- .NET Framework の [ProtectedData](https://docs.microsoft.com/en-us/dotnet/api/system.security.cryptography.protecteddata?redirectedfrom=MSDN&view=netframework-4.8) クラスが提供する安全な保存 API

この種の安全な保存を使用することには、単に設定ファイルへ鍵を置く場合と比べて多くの利点があります。具体的な内容は使用するソリューションによって異なりますが、次のようなものがあります。

- 特にコンテナ化環境での鍵の集中管理
- 鍵の容易なローテーションと置換
- 安全な鍵生成
- FIPS 140 や PCI DSS などの規制標準への準拠の簡素化
- 攻撃者が鍵をエクスポートまたは窃取することの困難化

共有ホスティング環境など、これらを利用できない場合もあります。その場合、暗号鍵に高い保護を与えることはできません。しかし、次の基本ルールには従えます。

- 鍵をアプリケーションソースコードにハードコードしない。
- 鍵をバージョン管理システムにコミットしない。
- 鍵を含む設定ファイルを制限的な権限で保護する。
- 鍵を環境変数に保存することを避ける。環境変数は [phpinfo()](https://www.php.net/manual/en/function.phpinfo.php) や `/proc/self/environ` ファイルを通じて偶発的に露出する可能性があります。

[Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html) には、シークレットを安全に保存するための詳細があります。

### Separation of Keys and Data

可能な場合、暗号鍵は暗号化データとは別の場所に保存すべきです。たとえばデータがデータベースに保存されている場合、鍵はファイルシステムに保存します。これにより、攻撃者がディレクトリトラバーサルや SQL インジェクションなどで片方にしかアクセスできない場合、鍵とデータの両方へアクセスすることを防げます。

環境のアーキテクチャによっては、鍵とデータを別々のシステムに保存できる場合があり、これにより分離の度合いを高められます。

### Encrypting Stored Keys

可能な場合、暗号鍵自体も暗号化された形式で保存すべきです。そのためには少なくとも2つの別々の鍵が必要です。

- Data Encryption Key（DEK）はデータの暗号化に使用します。
- Key Encryption Key（KEK）は DEK の暗号化に使用します。

これを有効にするには、KEK を DEK とは別に保存する必要があります。暗号化された DEK はデータと一緒に保存できますが、別システムに保存された KEK も入手しない限り、攻撃者はそれを使用できません。

KEK も DEK と少なくとも同等の強度を持つべきです。Google の [envelope encryption](https://cloud.google.com/kms/docs/envelope-encryption) ガイダンスには、DEK と KEK の管理方法に関する詳細があります。

共有ホスティング環境のように KEK と DEK を分離して保存できない単純なアプリケーションアーキテクチャでは、この方式の価値は限定的です。攻撃者が両方の鍵を同時に入手できる可能性が高いためです。ただし、熟練していない攻撃者に対する追加の障壁にはなり得ます。

鍵導出関数（KDF）を使用して、ユーザーが入力したパスフレーズなどから KEK を生成し、それを使ってランダムに生成された DEK を暗号化することもできます。これにより、DEK は同じまま、ユーザーがパスフレーズを変更したときに KEK を容易に変更できます。

</section>

<section id="cryptographic-storage-summary-panel" className="tabPanel summaryPanel contentPanel">

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

</section>

<section id="cryptographic-storage-checklist-panel" className="tabPanel checklistPanel contentPanel">

## V11.1 Cryptographic Inventory and Documentation

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

</section>

<section id="cryptographic-storage-bilingual-panel" className="tabPanel bilingualPanel">

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Introduction

This article provides a simple model to follow when implementing solutions to protect data at rest.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## Introduction

この記事は、保存データを保護するソリューションを実装する際に従うための単純なモデルを提供します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Passwords should not be stored using reversible encryption - secure password hashing algorithms should be used instead. The [Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html) contains further guidance on storing passwords.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

パスワードは可逆暗号で保存してはいけません。代わりに安全なパスワードハッシュアルゴリズムを使用する必要があります。[Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html) には、パスワード保存に関する追加のガイダンスがあります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Architectural Design

The first step in designing any application is to consider the overall architecture of the system, as this will have a huge impact on the technical implementation.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## Architectural Design

アプリケーション設計の最初のステップは、システム全体のアーキテクチャを検討することです。これは技術的な実装に大きな影響を与えるためです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

This process should begin with considering the [threat model](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html) of the application (i.e, who you are trying to protect that data against).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

このプロセスは、アプリケーションの [脅威モデル](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html) を検討することから始めるべきです。つまり、誰からそのデータを保護しようとしているのかを明確にします。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The use of dedicated secret or key management systems can provide an additional layer of security protection, as well as making the management of secrets significantly easier - however it comes at the cost of additional complexity and administrative overhead - so may not be feasible for all applications. Note that many cloud environments provide these services, so these should be taken advantage of where possible. The [Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html) contains further guidance on this topic.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

専用のシークレット管理または鍵管理システムを使用すると、追加のセキュリティ保護層を提供でき、シークレット管理も大幅に容易になります。ただし、複雑さと管理上のオーバーヘッドが増えるため、すべてのアプリケーションで実現可能とは限りません。多くのクラウド環境ではこれらのサービスが提供されているため、可能な場合は活用すべきです。このトピックの詳細は [Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html) を参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Where to Perform Encryption

Encryption can be performed on a number of levels in the application stack, such as:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Where to Perform Encryption

暗号化は、アプリケーションスタックのさまざまなレベルで実行できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- At the application level.
- At the database level (e.g, [SQL Server TDE](https://docs.microsoft.com/en-us/sql/relational-databases/security/encryption/transparent-data-encryption?view=sql-server-ver15))
- At the filesystem level (e.g, BitLocker or LUKS)
- At the hardware level (e.g, encrypted RAID cards or SSDs)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- アプリケーションレベル
- データベースレベル（例: [SQL Server TDE](https://docs.microsoft.com/en-us/sql/relational-databases/security/encryption/transparent-data-encryption?view=sql-server-ver15)）
- ファイルシステムレベル（例: BitLocker または LUKS）
- ハードウェアレベル（例: 暗号化 RAID カードまたは SSD）

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Which layer(s) are most appropriate will depend on the threat model. For example, hardware level encryption is effective at protecting against the physical theft of the server, but will provide no protection if an attacker is able to compromise the server remotely.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

どの層が最も適切かは、脅威モデルによって異なります。たとえば、ハードウェアレベルの暗号化はサーバーの物理的盗難に対して有効ですが、攻撃者がリモートからサーバーを侵害できる場合には保護になりません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Minimise the Storage of Sensitive Information

The best way to protect sensitive information is to not store it in the first place. Although this applies to all kinds of information, it is most often applicable to credit card details, as they are highly desirable for attackers, and PCI DSS has such stringent requirements for how they must be stored. Wherever possible, the storage of sensitive information should be avoided.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Minimise the Storage of Sensitive Information

機密情報を保護する最良の方法は、そもそも保存しないことです。これはあらゆる種類の情報に当てはまりますが、攻撃者にとって価値が高く、PCI DSS が保存方法に厳格な要件を課しているクレジットカード情報に特に当てはまります。可能な限り、機密情報の保存は避けるべきです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Algorithms

For symmetric encryption **AES** with a key that's at least **128 bits** (ideally **256 bits**) and a secure [mode](#cipher-modes) should be used as the preferred algorithm.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## Algorithms

対称暗号では、少なくとも **128 bit**、理想的には **256 bit** の鍵を持つ **AES** と安全な [モード](#cipher-modes) を優先アルゴリズムとして使用すべきです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

For asymmetric encryption, use elliptical curve cryptography (ECC) with a secure curve such as **Curve25519** as a preferred algorithm. If ECC is not available and  **RSA** must be used, then ensure that the key is at least **2048 bits**.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

非対称暗号では、**Curve25519** などの安全な曲線を用いる楕円曲線暗号（ECC）を優先アルゴリズムとして使用します。ECC が利用できず **RSA** を使用しなければならない場合は、鍵長が少なくとも **2048 bit** であることを確認します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Many other symmetric and asymmetric algorithms are available which have their own pros and cons, and they may be better or worse than AES or Curve25519 in specific use cases. When considering these, a number of factors should be taken into account, including:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

他にも多数の対称・非対称アルゴリズムがあり、それぞれ長所と短所があります。特定のユースケースでは AES や Curve25519 より適している場合も、不適切な場合もあります。検討時には、次の要素を考慮します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Key size.
- Known attacks and weaknesses of the algorithm.
- Maturity of the algorithm.
- Approval by third parties such as [NIST's algorithmic validation program](https://csrc.nist.gov/projects/cryptographic-algorithm-validation-program).
- Performance (both for encryption and decryption).
- Quality of the libraries available.
- Portability of the algorithm (i.e, how widely supported is it).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- 鍵長
- アルゴリズムに対する既知の攻撃と弱点
- アルゴリズムの成熟度
- [NIST のアルゴリズム検証プログラム](https://csrc.nist.gov/projects/cryptographic-algorithm-validation-program) など第三者による承認
- 性能（暗号化と復号の両方）
- 利用可能なライブラリの品質
- アルゴリズムの移植性、つまりどの程度広くサポートされているか

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

In some cases there may be regulatory requirements that limit the algorithms that can be used, such as [FIPS 140-2](https://csrc.nist.gov/csrc/media/publications/fips/140/2/final/documents/fips1402annexa.pdf) or [PCI DSS](https://www.pcisecuritystandards.org/pci_security/glossary#Strong%20Cryptography).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

場合によっては、[FIPS 140-2](https://csrc.nist.gov/csrc/media/publications/fips/140/2/final/documents/fips1402annexa.pdf) や [PCI DSS](https://www.pcisecuritystandards.org/pci_security/glossary#Strong%20Cryptography) など、使用できるアルゴリズムを制限する規制要件が存在することがあります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Custom Algorithms

Don't do this.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Custom Algorithms

これを行ってはいけません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Cipher Modes

There are various [modes](https://en.wikipedia.org/wiki/Block_cipher_mode_of_operation) that can be used to allow block ciphers (such as AES) to encrypt arbitrary amounts of data, in the same way that a stream cipher would. These modes have different security and performance characteristics, and a full discussion of them is outside the scope of this cheat sheet. Some of the modes have requirements to generate secure initialisation vectors (IVs) and other attributes, but these should be handled automatically by the library.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Cipher Modes

AES などのブロック暗号が、ストリーム暗号と同じように任意量のデータを暗号化できるようにするために、さまざまな [モード](https://en.wikipedia.org/wiki/Block_cipher_mode_of_operation) を使用できます。これらのモードには異なるセキュリティ特性と性能特性があり、詳細な議論はこのチートシートの範囲外です。一部のモードでは安全な初期化ベクトル（IV）やその他の属性の生成が必要ですが、これはライブラリによって自動的に処理されるべきです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Where available, authenticated modes should always be used. These provide guarantees of the integrity and authenticity of the data, as well as confidentiality. The most commonly used authenticated modes are **[GCM](https://en.wikipedia.org/wiki/Galois/Counter_Mode)** and **[CCM](https://en.wikipedia.org/wiki/CCM_mode)**, which should be used as a first preference.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

利用可能な場合は、認証付きモードを常に使用すべきです。これらは機密性に加えて、データの完全性と真正性を保証します。最も一般的に使われる認証付きモードは **[GCM](https://en.wikipedia.org/wiki/Galois/Counter_Mode)** と **[CCM](https://en.wikipedia.org/wiki/CCM_mode)** であり、第一候補として使用すべきです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

If GCM or CCM are not available, then [CTR](https://en.wikipedia.org/wiki/Block_cipher_mode_of_operation#Counter_%28CTR%29) mode or [CBC](https://en.wikipedia.org/wiki/Block_cipher_mode_of_operation#Cipher_Block_Chaining_%28CBC%29) mode should be used. As these do not provide any guarantees about the authenticity of the data, separate authentication should be implemented, such as using the [Encrypt-then-MAC](https://en.wikipedia.org/wiki/Authenticated_encryption#Encrypt-then-MAC_%28EtM%29) technique. Care needs to be taken when using this method with [variable length messages](https://en.wikipedia.org/wiki/CBC-MAC#Security_with_fixed_and_variable-length_messages)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

GCM または CCM が利用できない場合は、[CTR](https://en.wikipedia.org/wiki/Block_cipher_mode_of_operation#Counter_%28CTR%29) モードまたは [CBC](https://en.wikipedia.org/wiki/Block_cipher_mode_of_operation#Cipher_Block_Chaining_%28CBC%29) モードを使用すべきです。これらはデータの真正性を保証しないため、[Encrypt-then-MAC](https://en.wikipedia.org/wiki/Authenticated_encryption#Encrypt-then-MAC_%28EtM%29) などを使って別途認証を実装する必要があります。この方法を [可変長メッセージ](https://en.wikipedia.org/wiki/CBC-MAC#Security_with_fixed_and_variable-length_messages) に使用する際には注意が必要です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

[ECB](https://en.wikipedia.org/wiki/Block_cipher_mode_of_operation#ECB) should not be used outside of very specific circumstances.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

[ECB](https://en.wikipedia.org/wiki/Block_cipher_mode_of_operation#ECB) は、非常に特殊な状況を除いて使用すべきではありません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Random Padding

For RSA, it is essential to enable Random Padding. Random Padding is also known as OAEP or Optimal Asymmetric Encryption Padding. This class of defense protects against Known Plain Text Attacks by adding randomness at the beginning of the payload.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Random Padding

RSA では Random Padding を有効にすることが不可欠です。Random Padding は OAEP、つまり Optimal Asymmetric Encryption Padding とも呼ばれます。この防御は、ペイロードの先頭にランダム性を追加することで、既知平文攻撃から保護します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The Padding Schema of [PKCS#1](https://wikipedia.org/wiki/RSA_%28cryptosystem)#Padding_schemes) is typically used in this case.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

通常、この場合は [PKCS#1](https://wikipedia.org/wiki/RSA_(cryptosystem)#Padding_schemes) の Padding Schema が使用されます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Secure Random Number Generation

Random numbers (or strings) are needed for various security critical functionality, such as generating encryption keys, IVs, session IDs, CSRF tokens or password reset tokens. As such, it is important that these are generated securely, and that it is not possible for an attacker to guess and predict them.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Secure Random Number Generation

暗号鍵、IV、セッション ID、CSRF トークン、パスワードリセットトークンなど、セキュリティ上重要な機能では乱数または文字列が必要です。そのため、これらは安全に生成され、攻撃者が推測または予測できないようにすることが重要です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

It is generally not possible for computers to generate truly random numbers (without special hardware), so most systems and languages provide two different types of randomness.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

コンピュータが特殊なハードウェアなしで真の乱数を生成することは一般にできないため、多くのシステムと言語では2種類のランダム性が提供されます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Pseudo-Random Number Generators (PRNG) provide low-quality randomness that are much faster, and can be used for non-security related functionality (such as ordering results on a page, or randomising UI elements). However, they **must not** be used for anything security critical, as it is often possible for attackers to guess or predict the output.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

疑似乱数生成器（PRNG）は品質の低いランダム性を提供しますが、高速であり、ページ上の結果の並び替えや UI 要素のランダム化など、セキュリティに関係しない機能に使用できます。しかし、攻撃者が出力を推測または予測できる場合が多いため、セキュリティ上重要な用途には **絶対に使用してはいけません**。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Cryptographically Secure Pseudo-Random Number Generators (CSPRNG) are designed to produce a much higher quality of randomness (more strictly, a greater amount of entropy), making them safe to use for security-sensitive functionality. However, they are slower and more CPU intensive, can end up blocking in some circumstances when large amounts of random data are requested. As such, if large amounts of non-security related randomness are needed, they may not be appropriate.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

暗号学的に安全な疑似乱数生成器（CSPRNG）は、より高品質なランダム性、より厳密にはより大きなエントロピーを生成するように設計されており、セキュリティに敏感な機能に安全に使用できます。ただし、より低速で CPU 負荷が高く、大量のランダムデータが要求される場合には状況によってブロックされることがあります。そのため、セキュリティに関係しない大量のランダム性が必要な場合には適さないことがあります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The table below shows the recommended algorithms for each language, as well as insecure functions that should not be used.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

次の表は、各言語で推奨されるアルゴリズムと、使用してはいけない安全でない関数を示します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

| Language    | Unsafe Functions                                                                                                                   | Cryptographically Secure Functions                                                                                                                                                                                                                                                                                                                                         |
|-------------|------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| C           | `random()`, `rand()`                                                                                                               | [getrandom(2)](http://man7.org/linux/man-pages/man2/getrandom.2.html) |
| Java        | `Math.random()`, `StrictMath.random()`, `java.util.Random`, `java.util.SplittableRandom`, `java.util.concurrent.ThreadLocalRandom` | [java.security.SecureRandom](https://docs.oracle.com/javase/8/docs/api/java/security/SecureRandom.html), [java.util.UUID.randomUUID()](https://docs.oracle.com/javase/8/docs/api/java/util/UUID.html#randomUUID--) |
| PHP         | `array_rand()`, `lcg_value()`, `mt_rand()`, `rand()`, `uniqid()`                                                                   | [random_bytes()](https://www.php.net/manual/en/function.random-bytes.php), [Random\\Engine\\Secure](https://www.php.net/manual/en/class.random-engine-secure.php) in PHP 8, [random_int()](https://www.php.net/manual/en/function.random-int.php) in PHP 7, [openssl_random_pseudo_bytes()](https://www.php.net/manual/en/function.openssl-random-pseudo-bytes.php) in PHP 5 |
| .NET/C#     | `Random()`                                                                                                                         | [RandomNumberGenerator](https://learn.microsoft.com/en-us/dotnet/api/system.security.cryptography.randomnumbergenerator?view=net-6.0) |
| Objective-C | `arc4random()`/`arc4random_uniform()` (Uses RC4 Cipher), subclasses of`GKRandomSource`, rand(), random()                           | [SecRandomCopyBytes](https://developer.apple.com/documentation/security/1399291-secrandomcopybytes?language=objc) |
| Python      | `random()`                                                                                                                         | [secrets()](https://docs.python.org/3/library/secrets.html#module-secrets) |
| Ruby        | `rand()`, `Random`                                                                                                                 | [SecureRandom](https://ruby-doc.org/stdlib-2.5.1/libdoc/securerandom/rdoc/SecureRandom.html) |
| Go          | `rand` using `math/rand` package                                                                                                   | [crypto.rand](https://golang.org/pkg/crypto/rand/) package |
| Rust        | `rand::prng::XorShiftRng`                                                                                                          | [rand::prng::chacha::ChaChaRng](https://docs.rs/rand/0.5.0/rand/prng/chacha/struct.ChaChaRng.html) and the rest of the Rust library [CSPRNGs.](https://docs.rs/rand/0.5.0/rand/prng/index.html#cryptographically-secure-pseudo-random-number-generators-csprngs) |
| Node.js     | `Math.random()`                                                                                                                    | [crypto.randomBytes()](https://nodejs.org/api/crypto.html#cryptorandombytessize-callback), [crypto.randomInt()](https://nodejs.org/api/crypto.html#cryptorandomintmin-max-callback), [crypto.randomUUID()](https://nodejs.org/api/crypto.html#cryptorandomuuidoptions) |

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

| Language | Unsafe Functions | Cryptographically Secure Functions |
| --- | --- | --- |
| C | `random()`, `rand()` | [getrandom(2)](http://man7.org/linux/man-pages/man2/getrandom.2.html) |
| Java | `Math.random()`, `StrictMath.random()`, `java.util.Random`, `java.util.SplittableRandom`, `java.util.concurrent.ThreadLocalRandom` | [java.security.SecureRandom](https://docs.oracle.com/javase/8/docs/api/java/security/SecureRandom.html), [java.util.UUID.randomUUID()](https://docs.oracle.com/javase/8/docs/api/java/util/UUID.html#randomUUID--) |
| PHP | `array_rand()`, `lcg_value()`, `mt_rand()`, `rand()`, `uniqid()` | [random_bytes()](https://www.php.net/manual/en/function.random-bytes.php), [Random\Engine\Secure](https://www.php.net/manual/en/class.random-engine-secure.php), [random_int()](https://www.php.net/manual/en/function.random-int.php), [openssl_random_pseudo_bytes()](https://www.php.net/manual/en/function.openssl-random-pseudo-bytes.php) |
| .NET/C# | `Random()` | [RandomNumberGenerator](https://learn.microsoft.com/en-us/dotnet/api/system.security.cryptography.randomnumbergenerator?view=net-6.0) |
| Objective-C | `arc4random()`/`arc4random_uniform()`、`GKRandomSource` のサブクラス、`rand()`、`random()` | [SecRandomCopyBytes](https://developer.apple.com/documentation/security/1399291-secrandomcopybytes?language=objc) |
| Python | `random()` | [secrets()](https://docs.python.org/3/library/secrets.html#module-secrets) |
| Ruby | `rand()`, `Random` | [SecureRandom](https://ruby-doc.org/stdlib-2.5.1/libdoc/securerandom/rdoc/SecureRandom.html) |
| Go | `math/rand` パッケージの `rand` | [crypto.rand](https://golang.org/pkg/crypto/rand/) パッケージ |
| Rust | `rand::prng::XorShiftRng` | [rand::prng::chacha::ChaChaRng](https://docs.rs/rand/0.5.0/rand/prng/chacha/struct.ChaChaRng.html) と Rust ライブラリの [CSPRNGs](https://docs.rs/rand/0.5.0/rand/prng/index.html#cryptographically-secure-pseudo-random-number-generators-csprngs) |
| Node.js | `Math.random()` | [crypto.randomBytes()](https://nodejs.org/api/crypto.html#cryptorandombytessize-callback), [crypto.randomInt()](https://nodejs.org/api/crypto.html#cryptorandomintmin-max-callback), [crypto.randomUUID()](https://nodejs.org/api/crypto.html#cryptorandomuuidoptions) |

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### UUIDs and GUIDs

Universally unique identifiers (UUIDs or GUIDs) are sometimes used as a quick way to generate random strings. Although they can provide a reasonable source of randomness, this will depend on the [type or version](https://en.wikipedia.org/wiki/Universally_unique_identifier#Versions) of the UUID that is created.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### UUIDs and GUIDs

Universally unique identifier（UUID または GUID）は、ランダム文字列を生成する手軽な方法として使われることがあります。ある程度のランダム性を提供する場合もありますが、それは作成される UUID の [タイプまたはバージョン](https://en.wikipedia.org/wiki/Universally_unique_identifier#Versions) に依存します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Specifically, version 1 UUIDs are comprised of a high precision timestamp and the MAC address of the system that generated them, so are **not random** (although they may be hard to guess, given the timestamp is to the nearest 100ns). Type 4 UUIDs are randomly generated, although whether this is done using a CSPRNG will depend on the implementation. Unless this is known to be secure in the specific language or framework, the randomness of UUIDs should not be relied upon.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

具体的には、バージョン 1 UUID は高精度タイムスタンプと生成したシステムの MAC アドレスで構成されるため、**ランダムではありません**（タイムスタンプが 100ns 単位であるため推測しにくい場合はあります）。タイプ 4 UUID はランダムに生成されますが、CSPRNG を使用するかどうかは実装に依存します。特定の言語またはフレームワークで安全であることが分かっていない限り、UUID のランダム性に依存すべきではありません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Defence in Depth

Applications should be designed to still be secure even if cryptographic controls fail. Any information that is stored in an encrypted form should also be protected by additional layers of security. Application should also not rely on the security of encrypted URL parameters, and should enforce strong access control to prevent unauthorised access to information.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Defence in Depth

アプリケーションは、暗号制御が失敗した場合でも安全であり続けるように設計すべきです。暗号化形式で保存される情報も、追加のセキュリティ層で保護すべきです。また、暗号化された URL パラメータの安全性だけに依存せず、情報への不正アクセスを防ぐために強力なアクセス制御を実施すべきです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Key Management

### Processes

Formal processes should be implemented (and tested) to cover all aspects of key management, including:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## Key Management

### Processes

鍵管理のすべての側面をカバーする正式なプロセスを実装し、テストすべきです。これには次が含まれます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Generating and storing new keys.
- Distributing keys to the required parties.
- Deploying keys to application servers.
- Rotating and decommissioning old keys

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- 新しい鍵の生成と保存
- 必要な相手への鍵の配布
- アプリケーションサーバーへの鍵の展開
- 古い鍵のローテーションと廃止

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Key Generation

Keys should be randomly generated using a cryptographically secure function, such as those discussed in the [Secure Random Number Generation](#secure-random-number-generation) section. Keys **should not** be based on common words or phrases, or on "random" characters generated by mashing the keyboard.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Key Generation

鍵は、[Secure Random Number Generation](#secure-random-number-generation) セクションで説明したような暗号学的に安全な関数を使ってランダムに生成すべきです。鍵は一般的な単語やフレーズ、またはキーボードを適当に叩いて生成した「ランダム」文字列に基づいてはいけません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Where multiple keys are used (such as data separate data-encrypting and key-encrypting keys), they should be fully independent from each other.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

複数の鍵を使用する場合（データ暗号化鍵と鍵暗号化鍵など）は、それらを互いに完全に独立させるべきです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Key Lifetimes and Rotation

Encryption keys should be changed (or rotated) based on a number of different criteria:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Key Lifetimes and Rotation

暗号鍵は、次のような複数の基準に基づいて変更またはローテーションすべきです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- If the previous key is known (or suspected) to have been compromised.
    - This could also be caused by a someone who had access to the key leaving the organisation.
- After a specified period of time has elapsed (known as the cryptoperiod).
    - There are many factors that could affect what an appropriate cryptoperiod is, including the size of the key, the sensitivity of the data, and the threat model of the system. See section 5.3 of [NIST SP 800-57](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-57pt1r4.pdf) for further guidance.
- After the key has been used to encrypt a specific amount of data.
    - This would typically be `2^35` bytes (~34GB) for 64-bit keys and `2^68` bytes (~295 exabytes) for 128-bit block size.
- If there is a significant change to the security provided by the algorithm (such as a new attack being announced).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- 以前の鍵が侵害されたことが分かっている、または疑われる場合
  - これは鍵にアクセスできた人物が組織を離れた場合にも発生し得ます。
- 指定された期間、つまり暗号期間が経過した場合
  - 適切な暗号期間に影響する要素は、鍵のサイズ、データの機密性、システムの脅威モデルなど多数あります。詳細は [NIST SP 800-57](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-57pt1r4.pdf) の 5.3 節を参照してください。
- 鍵が特定量のデータを暗号化するために使用された場合
  - これは通常、64 bit 鍵で `2^35` バイト（約 34GB）、128 bit ブロックサイズで `2^68` バイト（約 295 エクサバイト）です。
- 新しい攻撃が発表されるなど、アルゴリズムが提供するセキュリティに重大な変化があった場合

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Once one of these criteria have been met, a new key should be generated and used for encrypting any new data. There are two main approaches for how existing data that was encrypted with the old key(s) should be handled:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

これらの基準のいずれかに該当したら、新しい鍵を生成し、新しいデータの暗号化に使用すべきです。古い鍵で暗号化された既存データの扱いには、主に2つの方式があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

1. Decrypting it and re-encrypting it with the new key.
2. Marking each item with the ID of the key that was used to encrypt it, and storing multiple keys to allow the old data to be decrypted.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

1. 復号して新しい鍵で再暗号化する。
2. 各項目に暗号化に使われた鍵 ID を付与し、古いデータを復号できるように複数の鍵を保管する。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The first option should generally be preferred, as it greatly simplifies both the application code and key management processes; however, it may not always be feasible. Note that old keys should generally be stored for a certain period after they have been retired, in case old backups of copies of the data need to be decrypted.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

通常は1つ目の方式が望ましいです。アプリケーションコードと鍵管理プロセスの両方を大幅に単純化できるためです。ただし、常に実現可能とは限りません。古いバックアップやデータコピーを復号する必要がある場合に備えて、廃止された古い鍵を一定期間保存する必要があることにも注意してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

It is important that the code and processes required to rotate a key are in place **before** they are required, so that keys can be quickly rotated in the event of a compromise. Additionally, processes should also be implemented to allow the encryption algorithm or library to be changed, in case a new vulnerability is found in the algorithm or implementation.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

鍵が侵害された場合に迅速にローテーションできるよう、鍵ローテーションに必要なコードとプロセスは、それが必要になる **前に** 用意しておくことが重要です。さらに、アルゴリズムまたは実装に新しい脆弱性が見つかった場合に備えて、暗号アルゴリズムまたはライブラリを変更できるプロセスも実装すべきです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Key Storage

Securely storing cryptographic keys is one of the hardest problems to solve, as the application always needs to have some level of access to the keys in order to decrypt the data. While it may not be possible to fully protect the keys from an attacker who has fully compromised the application, a number of steps can be taken to make it harder for them to obtain the keys.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## Key Storage

暗号鍵を安全に保存することは、解決が最も難しい問題の一つです。アプリケーションはデータを復号するために常に何らかのレベルで鍵へアクセスする必要があるためです。アプリケーションを完全に侵害した攻撃者から鍵を完全に保護することはできない場合がありますが、鍵の取得を難しくするためにいくつかの対策を取ることができます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Where available, the secure storage mechanisms provided by the operating system, framework or cloud service provider should be used. These include:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

利用可能な場合は、OS、フレームワーク、またはクラウドサービスプロバイダが提供する安全な保存メカニズムを使用すべきです。これには次が含まれます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- A physical Hardware Security Module (HSM).
- A virtual HSM.
- Key vaults such as [Amazon KMS](https://aws.amazon.com/kms/) or [Azure Key Vault](https://azure.microsoft.com/en-gb/services/key-vault/).
- An external secrets management service such as [Conjur](https://github.com/cyberark/conjur) or [HashiCorp Vault](https://github.com/hashicorp/vault).
- Secure storage APIs provided by the [ProtectedData](https://docs.microsoft.com/en-us/dotnet/api/system.security.cryptography.protecteddata?redirectedfrom=MSDN&view=netframework-4.8) class in the .NET framework.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- 物理 Hardware Security Module（HSM）
- 仮想 HSM
- [Amazon KMS](https://aws.amazon.com/kms/) や [Azure Key Vault](https://azure.microsoft.com/en-gb/services/key-vault/) などの key vault
- [Conjur](https://github.com/cyberark/conjur) や [HashiCorp Vault](https://github.com/hashicorp/vault) などの外部シークレット管理サービス
- .NET Framework の [ProtectedData](https://docs.microsoft.com/en-us/dotnet/api/system.security.cryptography.protecteddata?redirectedfrom=MSDN&view=netframework-4.8) クラスが提供する安全な保存 API

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

There are many advantages to using these types of secure storage over simply putting keys in configuration files. The specifics of these will vary depending on the solution used, but they include:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

この種の安全な保存を使用することには、単に設定ファイルへ鍵を置く場合と比べて多くの利点があります。具体的な内容は使用するソリューションによって異なりますが、次のようなものがあります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Central management of keys, especially in containerised environments.
- Easy key rotation and replacement.
- Secure key generation.
- Simplifying compliance with regulatory standards such as FIPS 140 or PCI DSS.
- Making it harder for an attacker to export or steal keys.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- 特にコンテナ化環境での鍵の集中管理
- 鍵の容易なローテーションと置換
- 安全な鍵生成
- FIPS 140 や PCI DSS などの規制標準への準拠の簡素化
- 攻撃者が鍵をエクスポートまたは窃取することの困難化

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

In some cases none of these will be available, such as in a shared hosting environment, meaning that it is not possible to obtain a high degree of protection for any encryption keys. However, the following basic rules can still be followed:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

共有ホスティング環境など、これらを利用できない場合もあります。その場合、暗号鍵に高い保護を与えることはできません。しかし、次の基本ルールには従えます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Do not hard-code keys into the application source code.
- Do not check keys into version control systems.
- Protect the configuration files containing the keys with restrictive permissions.
- Avoid storing keys in environment variables, as these can be accidentally exposed through functions such as [phpinfo()](https://www.php.net/manual/en/function.phpinfo.php) or through the `/proc/self/environ` file.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- 鍵をアプリケーションソースコードにハードコードしない。
- 鍵をバージョン管理システムにコミットしない。
- 鍵を含む設定ファイルを制限的な権限で保護する。
- 鍵を環境変数に保存することを避ける。環境変数は [phpinfo()](https://www.php.net/manual/en/function.phpinfo.php) や `/proc/self/environ` ファイルを通じて偶発的に露出する可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The [Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html) provides more details on securely storing secrets.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

[Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html) には、シークレットを安全に保存するための詳細があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Separation of Keys and Data

Where possible, encryption keys should be stored in a separate location from encrypted data. For example, if the data is stored in a database, the keys should be stored in the filesystem. This means that if an attacker only has access to one of these (for example through directory traversal or SQL injection), they cannot access both the keys and the data.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Separation of Keys and Data

可能な場合、暗号鍵は暗号化データとは別の場所に保存すべきです。たとえばデータがデータベースに保存されている場合、鍵はファイルシステムに保存します。これにより、攻撃者がディレクトリトラバーサルや SQL インジェクションなどで片方にしかアクセスできない場合、鍵とデータの両方へアクセスすることを防げます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Depending on the architecture of the environment, it may be possible to store the keys and data on separate systems, which would provide a greater degree of isolation.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

環境のアーキテクチャによっては、鍵とデータを別々のシステムに保存できる場合があり、これにより分離の度合いを高められます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Encrypting Stored Keys

Where possible, encryption keys should themselves be stored in an encrypted form. At least two separate keys are required for this:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Encrypting Stored Keys

可能な場合、暗号鍵自体も暗号化された形式で保存すべきです。そのためには少なくとも2つの別々の鍵が必要です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- The Data Encryption Key (DEK) is used to encrypt the data.
- The Key Encryption Key (KEK) is used to encrypt the DEK.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- Data Encryption Key（DEK）はデータの暗号化に使用します。
- Key Encryption Key（KEK）は DEK の暗号化に使用します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

For this to be effective, the KEK must be stored separately from the DEK. The encrypted DEK can be stored with the data, but will only be usable if an attacker is able to also obtain the KEK, which is stored on another system.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

これを有効にするには、KEK を DEK とは別に保存する必要があります。暗号化された DEK はデータと一緒に保存できますが、別システムに保存された KEK も入手しない限り、攻撃者はそれを使用できません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The KEK should also be at least as strong as the DEK. The [envelope encryption](https://cloud.google.com/kms/docs/envelope-encryption) guidance from Google contains further details on how to manage DEKs and KEKs.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

KEK も DEK と少なくとも同等の強度を持つべきです。Google の [envelope encryption](https://cloud.google.com/kms/docs/envelope-encryption) ガイダンスには、DEK と KEK の管理方法に関する詳細があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

In simpler application architectures (such as shared hosting environments) where the KEK and DEK cannot be stored separately, there is limited value to this approach, as an attacker is likely to be able to obtain both of the keys at the same time. However, it can provide an additional barrier to unskilled attackers.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

共有ホスティング環境のように KEK と DEK を分離して保存できない単純なアプリケーションアーキテクチャでは、この方式の価値は限定的です。攻撃者が両方の鍵を同時に入手できる可能性が高いためです。ただし、熟練していない攻撃者に対する追加の障壁にはなり得ます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

A key derivation function (KDF) could be used to generate a KEK from user-supplied input (such a passphrase), which would then be used to encrypt a randomly generated DEK. This allows the KEK to be easily changed (when the user changes their passphrase), without needing to re-encrypt the data (as the DEK remains the same).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

鍵導出関数（KDF）を使用して、ユーザーが入力したパスフレーズなどから KEK を生成し、それを使ってランダムに生成された DEK を暗号化することもできます。これにより、DEK は同じまま、ユーザーがパスフレーズを変更したときに KEK を容易に変更できます。

</div>
</div>

</section>
</div>



## Attribution

<div className="attributionFooter">

- Original: Cryptographic Storage Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: English original retained for comparison. Japanese translation added. Bilingual display generated from official source and local Japanese notes.
- Retrieved: 2026-05-20

</div>
