---
title: Key Management Cheat Sheet
hide_title: true
---

<div className="docHero" data-category="asvs-v13">
  <h1>鍵管理チートシート</h1>
  <div className="docMeta">
    <span className="docPill">最終更新: 2026-05-21</span>
    <span className="docPill">読了時間: 約 12 分</span>
    <span className="docPill">カテゴリ: 暗号</span>
  </div>
</div>

<div className="tabbedContent">
  <input className="tabInput" type="radio" name="key-management-view" id="key-management-original" />
  <input className="tabInput" type="radio" name="key-management-view" id="key-management-translation" defaultChecked />
  <input className="tabInput" type="radio" name="key-management-view" id="key-management-bilingual" />

  <div className="contentTabs">
    <label htmlFor="key-management-original" title="OWASP 原文">原文</label>
    <label htmlFor="key-management-translation" title="日本語訳">翻訳</label>
    <label htmlFor="key-management-bilingual" title="原文と翻訳を並べて確認">対比表示</label>
  </div>

<section id="key-management-original-panel" className="tabPanel originalPanel contentPanel">

## Introduction

This Key Management Cheat Sheet provides developers with guidance for implementation of cryptographic key management within an application in a secure manner. It is important to document and harmonize rules and practices for:

1. Key life cycle management (generation, distribution, destruction)
2. Key compromise, recovery and zeroization
3. Key storage
4. Key agreement

## General Guidelines and Considerations

Formulate a plan for the overall organization's cryptographic strategy to guide developers working on different applications and ensure that each application's cryptographic capability meets minimum requirements and best practices.

Identify the cryptographic and key management requirements for your application and map all components that process or store cryptographic key material.

## Key Selection

Selection of the cryptographic and key management algorithms to use within a given application should begin with an understanding of the objectives of the application.

For example, if the application is required to store data securely, then the developer should select an algorithm suite that supports the objective of data at rest protection security. Applications that are required to transmit and receive data would select an algorithm suite that supports the objective of data in transit protection.

We have provided recommendations on the selection of crypto suites within an application based on application and security objectives. Application developers oftentimes begin the development of crypto and key management capabilities by examining what is available in a library.

However, an analysis of the real needs of the application should be conducted to determine the optimal key management approach. Begin by understanding the security objectives of the application which will then drive the selection of cryptographic protocols that are best suited. For example, the application may require:

1. Confidentiality of data at rest and confidentiality of data in transit.
2. Authenticity of the end device.
3. Authenticity of data origin.
4. Integrity of data in transit.
5. Keys to create the data encryption keys.

Once the understanding of the security needs of the application is achieved, developers can determine what protocols and algorithms are required. Once the protocols and algorithms are understood, you can begin to define the different types of keys that will support the application's objectives.

There are a diverse set of key types and certificates to consider, for example:

1. **Encryption:** [Symmetric](https://en.wikipedia.org/wiki/Symmetric-key_algorithm) encryption keys, [Asymmetric](https://en.wikipedia.org/wiki/Public-key_cryptography) encryption keys (public and private).
2. **Authentication of End Devices:** Pre-shared symmetric keys, Trusted certificates, Trust Anchors.
3. **Data Origin Authentication:** [HMAC](https://en.wikipedia.org/wiki/HMAC).
4. **Integrity Protection:** [Message Authentication Codes](https://en.wikipedia.org/wiki/Message_authentication_code) (MACs).
5. **Key Encryption Keys**.

### Algorithms and Protocols

According to `NIST SP 800-57 Part 1`, many algorithms and schemes that provide a security service use a [hash function](https://en.wikipedia.org/wiki/Hash_function) as a component of the algorithm.

Hash functions can be found in digital signature algorithms (`FIPS186`), Keyed-Hash Message Authentication Codes (HMAC) (`FIPS198`), key-derivation functions/methods (`NIST Special Publications (SP) 800-56A, 800-56B, 800-56C and 800-108`), and random number generators (`NIST SP 800-90A`). Approved hash functions are defined in `FIPS180`.

`NIST SP 800-57 Part 1` recognizes three basic classes of approved cryptographic algorithms: hash functions, symmetric- key algorithms and asymmetric-key algorithms. The classes are defined by the number of cryptographic keys that are used in conjunction with the algorithm.

The NSA released a report, [Commercial National Security Algorithm Suite 2.0](https://media.defense.gov/2025/May/30/2003728741/-1/-1/0/CSA_CNSA_2.0_ALGORITHMS.PDF) which lists the cryptographic algorithms that are expected to be remain strong even with advances in quantum computing.

#### Cryptographic hash functions

Cryptographic hash functions do not require keys. Hash functions generate a relatively small digest (hash value) from a (possibly) large input in a way that is fundamentally difficult to reverse (i.e., it is hard to find an input that will produce a given output). Hash functions are used as building blocks for key management, for example,

1. To provide data authentication and integrity services (Section 4.2.3) - the hash function is used with a key to generate a message authentication code.
2. To compress messages for digital signature generation and verification (Section 4.2.4).
3. To derive keys in key-establishment algorithms (Section 4.2.5).
4. To generate deterministic random numbers (Section 4.2.7).

#### Symmetric-key algorithms

Symmetric-key algorithms (sometimes known as secret-key algorithms) transform data in a way that is fundamentally difficult to undo without knowledge of a secret key. The key is "symmetric" because the same key is used for a cryptographic operation and its inverse (e.g., encryption and decryption).

Symmetric keys are often known by more than one entity; however, the key shall not be disclosed to entities that are not authorized access to the data protected by that algorithm and key. Symmetric key algorithms are used, for example,

1. To provide data confidentiality (Section 4.2.2); the same key is used to encrypt and decrypt data.
2. To provide authentication and integrity services (Section 4.2.3) in the form of Message Authentication Codes (MACs); the same key is used to generate the MAC and to validate it. MACs normally employ either a symmetric key-encryption algorithm or a cryptographic hash function as their cryptographic primitive.
3. As part of the key-establishment process (Section 4.2.5).
4. To generate deterministic random numbers (Section 4.2.7).

#### Asymmetric-key algorithms

Asymmetric-key algorithms, commonly known as public-key algorithms, use two related keys (i.e., a key pair) to perform their functions: a public key and a private key. The public key may be known by anyone; the private key should be under the sole control of the entity that "owns" the key pair. Even though the public and private keys of a key pair are related, knowledge of the public key does not reveal the private key. Asymmetric algorithms are used, for example,

1. To compute digital signatures (Section 4.2.4).
2. To establish cryptographic keying material (Section 4.2.5).
3. To generate random numbers (Section 4.2.7).

#### Message Authentication Codes (MACs)

Message Authentication Codes (MACs) provide data authentication and integrity. A MAC is a cryptographic checksum on the data that is used in order to provide assurance that the data has not changed and that the MAC was computed by the expected entity.

Although message integrity is often provided using non-cryptographic techniques known as error detection codes, these codes can be altered by an adversary to effect an action to the adversary's benefit. The use of an approved cryptographic mechanism, such as a MAC, can alleviate this problem.

In addition, the MAC can provide a recipient with assurance that the originator of the data is a key holder (i.e., an entity authorized to have the key). MACs are often used to authenticate the originator to the recipient when only those two parties share the MAC key.

#### Digital Signatures

[Digital signatures](https://en.wikipedia.org/wiki/Digital_signature) are used to provide authentication, integrity and [non-repudiation](https://en.wikipedia.org/wiki/Non-repudiation). Digital signatures are used in conjunction with hash functions and are computed on data of any length (up to a limit that is determined by the hash function).

`FIPS186` specifies algorithms that are approved for the computation of digital signatures.

#### Key Encryption Keys

Symmetric key-wrapping keys are used to encrypt other keys using symmetric-key algorithms. Key-wrapping keys are also known as key encrypting keys.

### Key Strength

Review `NIST SP 800-57` (Recommendation for Key Management) for recommended guidelines on key strength for specific algorithm implementations. Also, consider these best practices:

1. Establish what the application's minimum computational resistance to attack should be. Understanding the minimum computational resistance to attack should take into consideration the sophistication of your adversaries, how long data needs to be protected, where data is stored and if it is exposed. Identifying the computational resistance to attack will inform engineers as to the minimum length of the cryptographic key required to protect data over the life of that data. Consult `NIST SP 800-131a` for additional guidance on determining the appropriate key lengths for the algorithm of choice.
2. When encrypting keys for storage or distribution, always encrypt a cryptographic key with another key of equal or greater cryptographic strength.
3. When moving to [Elliptic Curve-based algorithms](https://en.wikipedia.org/wiki/Elliptic-curve_cryptography), choose a key length that meets or exceeds the comparative strength of other algorithms in use within your system. Refer to `NIST SP 800-57 Table 2`.
4. Formulate a strategy for the overall organization's cryptographic strategy to guide developers working on different applications and ensure that each application's cryptographic capability meets minimum requirements and best practices.

### Memory Management Considerations

Keys stored in memory for a long time can become "burned in". This can be mitigated by splitting the key into components that are frequently updated. `NIST SP 800-57`).

Loss or corruption of the memory media on which keys and/or certificates are stored, and recovery planning, according to `NIST SP 800-57`.

Plan for the recovery from possible corruption of the memory media necessary for key or certificate generation, registration, and/or distribution systems, subsystems, or components as recommended in `NIST SP 800-57`.

### Perfect Forward Secrecy

[Ephemeral keys](https://en.wikipedia.org/wiki/Ephemeral_key) can provide perfect forward secrecy protection, which means a compromise of the server's long term signing key does not compromise the confidentiality of past sessions. Refer to [TLS cheat sheet](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html).

### Key Usage

According to NIST, in general, a single key should be used for only one purpose (e.g., encryption, authentication, key wrapping, random number generation, or digital signatures).

There are several reasons for this:

1. The use of the same key for two different cryptographic processes may weaken the security provided by one or both of the processes.
2. Limiting the use of a key limits the damage that could be done if the key is compromised.
3. Some uses of keys interfere with each other. For example, the length of time the key may be required for each use and purpose. Retention requirements of the data may differ for different data types.

### Cryptographic Module Topics

According to `NIST SP 800-133`, cryptographic modules are the set of hardware, software, and/or firmware that implements security functions (including cryptographic algorithms and key generation) and is contained within a cryptographic module boundary to provide protection of the keys.

## Key Management Lifecycle Best Practices

### Generation

Cryptographic keys shall be generated within cryptographic module with at least a `FIPS 140-2 or 140-3` compliance. For explanatory purposes, consider the cryptographic module in which a key is generated to be the key-generating module.

Any random value required by the key-generating module shall be generated within that module; that is, the Random Bit Generator that generates the random value shall be implemented within cryptographic module with at least a `FIPS 140-2 or 140-3` compliance that generates the key.

Hardware cryptographic modules are preferred over software cryptographic modules for protection.

### Distribution

The generated keys shall be transported (when necessary) using secure channels and shall be used by their associated cryptographic algorithm within at least a `FIPS 140-2 or 140-3` compliant cryptographic modules. For additional detail for the recommendations in this section refer to `NIST Special Paper 800-133`.

### Storage

1. Developers must understand where cryptographic keys are stored within the application. Understand what memory devices the keys are stored on.
2. Keys must be protected on both volatile and persistent memory, ideally processed within secure cryptographic modules.
3. Keys should never be stored in plaintext format.
4. Ensure all keys are stored in a cryptographic vault, such as a [hardware security module](https://en.wikipedia.org/wiki/Hardware_security_module) (HSM) or isolated cryptographic service.
5. If you are planning on storing keys in offline devices/databases, then encrypt the keys using Key Encryption Keys (KEKs) prior to the export of the key material. KEK length (and algorithm) should be equivalent to or greater in strength than the keys being protected.
6. Ensure that keys have integrity protections applied while in storage (consider dual purpose algorithms that support encryption and Message Code Authentication (MAC)).
7. Ensure that standard application level code never reads or uses cryptographic keys in any way and use key management libraries.
8. Ensure that keys and cryptographic operation is done inside the sealed vault.
9. All work should be done in the vault (such as key access, encryption, decryption, signing, etc).

For a more complete guide to storing sensitive information such as keys, see the [Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html).

### Escrow and Backup

Data that has been encrypted with lost cryptographic keys will never be recovered. Therefore, it is essential that the application incorporate a secure key backup capability, especially for applications that support data at rest encryption for long-term data stores.

When backing up keys, ensure that the database that is used to store the keys is encrypted using at least a `FIPS 140-2 or 140-3` validated module. It is sometimes useful to escrow key material for use in investigations and for re-provisioning of key material to users in the event that the key is lost or corrupted.

Never escrow keys used for performing digital signatures, but consider the need to escrow keys that support encryption. Oftentimes, escrow can be performed by the [Certificate Authority](https://en.wikipedia.org/wiki/Certificate_authority) (CA) or key management system that provisions certificates and keys, however in some instances separate APIs must be implemented to allow the system to perform the escrow for the application.

### Accountability and Audit

Accountability involves the identification of those that have access to, or control of, cryptographic keys throughout their lifecycles. Accountability can be an effective tool to help prevent key compromises and to reduce the impact of compromises once they are detected.

Although it is preferred that no humans are able to view keys, as a minimum, the key management system should account for all individuals who are able to view plaintext cryptographic keys.

In addition, more sophisticated key-management systems may account for all individuals authorized to access or control any cryptographic keys, whether in plaintext or ciphertext form.

Accountability provides three significant advantages:

1. It aids in the determination of when the compromise could have occurred and what individuals could have been involved.
2. It tends to protect against compromise, because individuals with access to the key know that their access to the key is known.
3. It is very useful in recovering from a detected key compromise to know where the key was used and what data or other keys were protected by the compromised key.

Certain principles have been found to be useful in enforcing the accountability of cryptographic keys. These principles might not apply to all systems or all types of keys.

Some of the principles that apply to long-term keys controlled by humans include:

1. Uniquely identifying keys.
2. Identifying the key user.
3. Identifying the dates and times of key use, along with the data that is protected.
4. Identifying other keys that are protected by a symmetric or private key.

Two types of audit should be performed on key management systems:

1. The security plan and the procedures that are developed to support the plan should be periodically audited to ensure that they continue to support the Key Management Policy (`NIST SP 800-57 Part 2`).
2. The protective mechanisms employed should be periodically reassessed with respect to the level of security that they provide and are expected to provide in the future, and that the mechanisms correctly and effectively support the appropriate policies.

New technology developments and attacks should be taken into consideration. On a more frequent basis, the actions of the humans that use, operate and maintain the system should be reviewed to verify that the humans continue to follow established security procedures.

Strong cryptographic systems can be compromised by lax and inappropriate human actions. Highly unusual events should be noted and reviewed as possible indicators of attempted attacks on the system.

### Key Compromise and Recovery

The compromise of a key has the following implications:

1. In general, the unauthorized disclosure of a key used to provide confidentiality protection (i.e., via encryption) means that all information encrypted by that key could be exposed or known by unauthorized entities. The disclosure of a Certificate of Authorities's private signature key means that an adversary can create fraudulent certificates and Certificate Revocation Lists (CRLs).
2. A compromise of the integrity of a key means that the key is incorrect - either that the key has been modified (either deliberately or accidentally), or that another key has been substituted; this includes a deletion (non-availability) of the key. The substitution or modification of a key used to provide integrity calls into question the integrity of all information protected by the key. This information could have been provided by, or changed by, an unauthorized entity that knows the key. The substitution of a public or secret key that will be used (at a later time) to encrypt data could allow an unauthorized entity (who knows the decryption key) to decrypt data that was encrypted using the encryption key.
3. A compromise of a key's usage or application association means that the key could be used for the wrong purpose (e.g., for key establishment instead of digital signatures) or for the wrong application, and could result in the compromise of information protected by the key.
4. A compromise of a key's association with the owner or other entity means that the identity of the other entity cannot be assured (i.e., one does not know who the other entity really is) or that information cannot be processed correctly (e.g., decrypted with the correct key).
5. A compromise of a key's association with other information means that there is no association at all, or the association is with the wrong "information". This could cause the cryptographic services to fail, information to be lost, or the security of the information to be compromised. Certain protective measures may be taken in order to minimize the likelihood or consequences of a key compromise. Similar affect as ransomware, except that you can't pay the ransom and get the key back.

The following procedures are usually involved:

1. Limiting the amount of time a symmetric or private key is in plaintext form.
2. Preventing humans from viewing plaintext symmetric and private keys.
3. Restricting plaintext symmetric and private keys to physically protected containers. This includes key generators, key-transport devices, key loaders, cryptographic modules, and key-storage devices.
4. Using integrity checks to ensure that the integrity of a key or its association with other data has not been compromised. For example, keys may be wrapped (i.e., encrypted) in such a manner that unauthorized modifications to the wrapping or to the associations will be detected.
5. Employing key confirmation (see NIST SP 800-57 Part 1 Section 4.2.5.5) to help ensure that the proper key was, in fact, established.
6. Establishing an accountability system that keeps track of each access to symmetric and private keys in plaintext form.
7. Providing a cryptographic integrity check on the key (e.g., using a MAC or a digital signature).
8. The use of trusted timestamps for signed data. i. Destroying keys as soon as they are no longer needed.
9. Creating a compromise-recovery plan, especially in the case of a CA compromise.

A compromise-recovery plan is essential for restoring cryptographic security services in the event of a key compromise. A compromise-recovery plan shall be documented and easily accessible.

The compromise-recovery plan should contain:

1. The identification and contact info of the personnel to notify.
2. The identification and contact info of the personnel to perform the recovery actions.
3. The re-key method.
4. An inventory of all cryptographic keys and their use (e.g., the location of all certificates in a system).
5. The education of all appropriate personnel on the recovery procedures.
6. An identification and contact info of all personnel needed to support the recovery procedures.
7. Policies that key-revocation checking be enforced (to minimize the effect of a compromise).
8. The monitoring of the re-keying operations (to ensure that all required operations are performed for all affected keys).
9. Any other recovery procedures, which may include:
    1. Physical inspection of the equipment.
    2. Identification of all information that may be compromised as a result of the incident.
    3. Identification of all signatures that may be invalid, due to the compromise of a signing key.
    4. Distribution of new keying material, if required.

## Trust Stores

1. Design controls to secure the trust store against injection of third-party root certificates. The access controls are managed and enforced on an entity and application basis.
2. Implement integrity controls on objects stored in the trust store.
3. Do not allow for export of keys held within the trust store without authentication and authorization.
4. Setup strict policies and procedures for exporting key material from applications to network applications and other components.
5. Implement a secure process for updating the trust store.

## Cryptographic Key Management Libraries

Use only reputable crypto libraries that are well maintained and updated, as well as tested and validated by third-party organizations (e.g., `NIST`/`FIPS`).

## Documentation

- [Practical cryptography for developers](https://cryptobook.nakov.com/).

</section>

<section id="key-management-translation-panel" className="tabPanel translationPanel contentPanel">

## はじめに

この鍵管理チートシートは、アプリケーション内で暗号鍵管理を安全に実装するためのガイダンスを開発者に提供します。次の事項について、ルールと実務を文書化し、整合させることが重要です。

1. 鍵ライフサイクル管理 (生成、配布、破棄)
2. 鍵侵害、復旧、ゼロ化
3. 鍵の保管
4. 鍵合意

## 一般的なガイドラインと考慮事項

組織全体の暗号戦略について計画を策定し、複数のアプリケーションに携わる開発者を導き、各アプリケーションの暗号機能が最小要件とベストプラクティスを満たすようにします。

アプリケーションの暗号要件と鍵管理要件を特定し、暗号鍵材料を処理または保管するすべてのコンポーネントをマッピングします。

## 鍵の選択

特定のアプリケーションで使用する暗号アルゴリズムと鍵管理アルゴリズムの選択は、アプリケーションの目的を理解することから始めるべきです。

たとえば、アプリケーションがデータを安全に保管する必要がある場合、開発者は保存データ保護のセキュリティ目的を支えるアルゴリズムスイートを選択すべきです。データの送受信が必要なアプリケーションでは、転送中データ保護の目的を支えるアルゴリズムスイートを選択します。

ここでは、アプリケーションとセキュリティ目的に基づいて、アプリケーション内で暗号スイートを選択するための推奨事項を示します。アプリケーション開発者は、ライブラリで利用できるものを調べることから暗号機能や鍵管理機能の開発を始めることがよくあります。

しかし、最適な鍵管理アプローチを判断するには、アプリケーションの実際のニーズを分析する必要があります。まずアプリケーションのセキュリティ目的を理解し、それによって最適な暗号プロトコルを選択します。たとえば、アプリケーションでは次のものが必要になる場合があります。

1. 保存データの機密性と転送中データの機密性。
2. エンドデバイスの真正性。
3. データ生成元の真正性。
4. 転送中データの完全性。
5. データ暗号化鍵を作成するための鍵。

アプリケーションのセキュリティニーズを理解したら、開発者は必要なプロトコルとアルゴリズムを判断できます。プロトコルとアルゴリズムを理解したら、アプリケーションの目的を支えるさまざまな種類の鍵を定義し始めることができます。

考慮すべき鍵種別や証明書には、たとえば次のような多様なものがあります。

1. **暗号化:** [対称](https://en.wikipedia.org/wiki/Symmetric-key_algorithm)暗号鍵、[非対称](https://en.wikipedia.org/wiki/Public-key_cryptography)暗号鍵 (公開鍵と秘密鍵)。
2. **エンドデバイスの認証:** 事前共有対称鍵、信頼された証明書、信頼アンカー。
3. **データ生成元認証:** [HMAC](https://en.wikipedia.org/wiki/HMAC)。
4. **完全性保護:** [メッセージ認証コード](https://en.wikipedia.org/wiki/Message_authentication_code) (MAC)。
5. **鍵暗号化鍵**。

### アルゴリズムとプロトコル

`NIST SP 800-57 Part 1` によると、セキュリティサービスを提供する多くのアルゴリズムやスキームでは、アルゴリズムの構成要素として[ハッシュ関数](https://en.wikipedia.org/wiki/Hash_function)を使用します。

ハッシュ関数は、デジタル署名アルゴリズム (`FIPS186`)、鍵付きハッシュメッセージ認証コード (HMAC) (`FIPS198`)、鍵導出関数/方式 (`NIST Special Publications (SP) 800-56A, 800-56B, 800-56C and 800-108`)、乱数生成器 (`NIST SP 800-90A`) で使用されます。承認済みハッシュ関数は `FIPS180` で定義されています。

`NIST SP 800-57 Part 1` は、承認済み暗号アルゴリズムの基本クラスとして、ハッシュ関数、対称鍵アルゴリズム、非対称鍵アルゴリズムの三つを認めています。これらのクラスは、アルゴリズムと組み合わせて使用される暗号鍵の数によって定義されます。

NSA は、量子コンピューティングの進歩があっても強度を維持すると期待される暗号アルゴリズムを列挙した [Commercial National Security Algorithm Suite 2.0](https://media.defense.gov/2025/May/30/2003728741/-1/-1/0/CSA_CNSA_2.0_ALGORITHMS.PDF) というレポートを公開しました。

#### 暗号学的ハッシュ関数

暗号学的ハッシュ関数は鍵を必要としません。ハッシュ関数は、(場合によっては) 大きな入力から比較的小さなダイジェスト (ハッシュ値) を生成し、その逆算が本質的に困難になるようにします (つまり、特定の出力を生成する入力を見つけることが困難です)。ハッシュ関数は、たとえば次のように鍵管理の構成要素として使用されます。

1. データ認証および完全性サービスを提供するため (Section 4.2.3)。ハッシュ関数は鍵とともに使用され、メッセージ認証コードを生成します。
2. デジタル署名の生成および検証のためにメッセージを圧縮するため (Section 4.2.4)。
3. 鍵確立アルゴリズムで鍵を導出するため (Section 4.2.5)。
4. 決定論的乱数を生成するため (Section 4.2.7)。

#### 対称鍵アルゴリズム

対称鍵アルゴリズム (秘密鍵アルゴリズムとも呼ばれることがあります) は、秘密鍵を知らなければ元に戻すことが本質的に困難な方法でデータを変換します。暗号操作とその逆操作 (たとえば暗号化と復号) に同じ鍵を使用するため、その鍵は「対称」です。

対称鍵は複数のエンティティに知られていることがよくあります。ただし、そのアルゴリズムと鍵で保護されるデータへのアクセスを許可されていないエンティティに鍵を開示してはなりません。対称鍵アルゴリズムは、たとえば次の用途に使用されます。

1. データの機密性を提供するため (Section 4.2.2)。同じ鍵を使用してデータを暗号化および復号します。
2. メッセージ認証コード (MAC) の形で認証および完全性サービスを提供するため (Section 4.2.3)。同じ鍵を使用して MAC を生成し、それを検証します。MAC は通常、暗号プリミティブとして対称鍵暗号アルゴリズムまたは暗号学的ハッシュ関数を使用します。
3. 鍵確立プロセスの一部として (Section 4.2.5)。
4. 決定論的乱数を生成するため (Section 4.2.7)。

#### 非対称鍵アルゴリズム

非対称鍵アルゴリズムは、一般に公開鍵アルゴリズムとして知られ、機能を実行するために関連する二つの鍵 (つまり鍵ペア)、公開鍵と秘密鍵を使用します。公開鍵は誰でも知ることができますが、秘密鍵は鍵ペアを「所有する」エンティティの単独管理下に置くべきです。鍵ペアの公開鍵と秘密鍵は関連していますが、公開鍵を知っていても秘密鍵は明らかになりません。非対称アルゴリズムは、たとえば次の用途に使用されます。

1. デジタル署名を計算するため (Section 4.2.4)。
2. 暗号鍵材料を確立するため (Section 4.2.5)。
3. 乱数を生成するため (Section 4.2.7)。

#### メッセージ認証コード (MAC)

メッセージ認証コード (MAC) は、データ認証と完全性を提供します。MAC はデータに対する暗号学的チェックサムであり、データが変更されていないこと、および MAC が期待されるエンティティによって計算されたことについて保証を提供するために使用されます。

メッセージ完全性は、誤り検出符号と呼ばれる非暗号技術で提供されることも多いですが、これらの符号は攻撃者によって改ざんされ、攻撃者に有利な動作を引き起こされる可能性があります。MAC などの承認済み暗号メカニズムを使用すると、この問題を軽減できます。

さらに、MAC は、データの送信元が鍵保有者 (つまり、その鍵を持つことを許可されたエンティティ) であることを受信者に保証できます。MAC は、MAC 鍵を共有する二者だけがいる場合に、送信元を受信者へ認証するためによく使用されます。

#### デジタル署名

[デジタル署名](https://en.wikipedia.org/wiki/Digital_signature)は、認証、完全性、[否認防止](https://en.wikipedia.org/wiki/Non-repudiation)を提供するために使用されます。デジタル署名はハッシュ関数と組み合わせて使用され、(ハッシュ関数によって決まる制限内で) 任意の長さのデータに対して計算されます。

`FIPS186` は、デジタル署名の計算に承認されたアルゴリズムを規定しています。

#### 鍵暗号化鍵

対称鍵ラッピング鍵は、対称鍵アルゴリズムを使用して他の鍵を暗号化するために使用されます。鍵ラッピング鍵は、鍵暗号化鍵とも呼ばれます。

### 鍵強度

特定のアルゴリズム実装における鍵強度の推奨ガイドラインについては、`NIST SP 800-57` (Recommendation for Key Management) を確認してください。また、次のベストプラクティスも考慮してください。

1. アプリケーションが攻撃に対して最低限備えるべき計算量的耐性を定めます。攻撃に対する最低限の計算量的耐性を理解するには、敵対者の高度さ、データを保護する必要がある期間、データの保管場所、データが露出しているかどうかを考慮する必要があります。攻撃に対する計算量的耐性を特定することで、エンジニアはデータのライフサイクル全体でデータを保護するために必要な暗号鍵の最小長を把握できます。選択したアルゴリズムに適切な鍵長を判断するための追加ガイダンスについては、`NIST SP 800-131a` を参照してください。
2. 保管または配布のために鍵を暗号化する場合は、常に同等以上の暗号強度を持つ別の鍵で暗号鍵を暗号化します。
3. [楕円曲線ベースのアルゴリズム](https://en.wikipedia.org/wiki/Elliptic-curve_cryptography)へ移行する場合は、システム内で使用している他のアルゴリズムの比較強度を満たす、または上回る鍵長を選択します。`NIST SP 800-57 Table 2` を参照してください。
4. 組織全体の暗号戦略を策定し、複数のアプリケーションに携わる開発者を導き、各アプリケーションの暗号機能が最小要件とベストプラクティスを満たすようにします。

### メモリ管理上の考慮事項

長時間メモリに保管される鍵は、「焼き付き」状態になる可能性があります。これは、頻繁に更新されるコンポーネントへ鍵を分割することで軽減できます。`NIST SP 800-57`)。

`NIST SP 800-57` に従い、鍵や証明書が保管されるメモリ媒体の損失または破損、および復旧計画を考慮します。

`NIST SP 800-57` の推奨に従い、鍵または証明書の生成、登録、配布に必要なシステム、サブシステム、コンポーネントのメモリ媒体が破損した場合の復旧を計画します。

### 完全前方秘匿性

[一時鍵](https://en.wikipedia.org/wiki/Ephemeral_key)は完全前方秘匿性の保護を提供できます。これは、サーバーの長期署名鍵が侵害されても、過去のセッションの機密性が侵害されないことを意味します。[TLS cheat sheet](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html) を参照してください。

### 鍵の用途

NIST によると、一般に単一の鍵は一つの目的 (たとえば、暗号化、認証、鍵ラッピング、乱数生成、デジタル署名) のみに使用すべきです。

これにはいくつかの理由があります。

1. 同じ鍵を二つの異なる暗号プロセスに使用すると、一方または両方のプロセスが提供するセキュリティが弱まる可能性があります。
2. 鍵の使用を制限すると、鍵が侵害された場合に発生し得る被害を制限できます。
3. 鍵の用途同士が干渉することがあります。たとえば、それぞれの用途や目的で鍵が必要となる期間です。データ保持要件はデータ種別ごとに異なる場合があります。

### 暗号モジュールに関するトピック

`NIST SP 800-133` によると、暗号モジュールとは、セキュリティ機能 (暗号アルゴリズムや鍵生成を含む) を実装し、鍵を保護するために暗号モジュール境界内に含まれるハードウェア、ソフトウェア、ファームウェア、またはそれらの組み合わせです。

## 鍵管理ライフサイクルのベストプラクティス

### 生成

暗号鍵は、少なくとも `FIPS 140-2 or 140-3` に準拠した暗号モジュール内で生成されなければなりません。説明のため、鍵が生成される暗号モジュールを鍵生成モジュールと考えます。

鍵生成モジュールが必要とする任意のランダム値は、そのモジュール内で生成されなければなりません。つまり、ランダム値を生成する Random Bit Generator は、鍵を生成する少なくとも `FIPS 140-2 or 140-3` 準拠の暗号モジュール内に実装されなければなりません。

保護のためには、ソフトウェア暗号モジュールよりもハードウェア暗号モジュールが望まれます。

### 配布

生成された鍵は、(必要な場合) セキュアチャネルを使用して転送され、関連する暗号アルゴリズムによって、少なくとも `FIPS 140-2 or 140-3` 準拠の暗号モジュール内で使用されなければなりません。このセクションの推奨事項の詳細については、`NIST Special Paper 800-133` を参照してください。

### 保管

1. 開発者は、暗号鍵がアプリケーション内のどこに保管されているかを理解しなければなりません。鍵がどのメモリデバイスに保管されているかを理解してください。
2. 鍵は揮発性メモリと永続メモリの両方で保護されなければならず、理想的にはセキュアな暗号モジュール内で処理されます。
3. 鍵を平文形式で保管すべきではありません。
4. すべての鍵が、[ハードウェアセキュリティモジュール](https://en.wikipedia.org/wiki/Hardware_security_module) (HSM) や分離された暗号サービスなどの暗号ボールトに保管されるようにします。
5. オフラインデバイス/データベースに鍵を保管する予定がある場合は、鍵材料をエクスポートする前に、鍵暗号化鍵 (KEK) を使用して鍵を暗号化します。KEK の長さ (およびアルゴリズム) は、保護対象の鍵と同等以上の強度を持つべきです。
6. 保管中の鍵に完全性保護が適用されていることを確認します (暗号化とメッセージコード認証 (MAC) をサポートする二重目的アルゴリズムを検討してください)。
7. 標準的なアプリケーションレベルのコードが暗号鍵をいかなる形でも読み取ったり使用したりしないようにし、鍵管理ライブラリを使用します。
8. 鍵と暗号操作が封印されたボールト内で行われることを確認します。
9. すべての作業 (鍵アクセス、暗号化、復号、署名など) はボールト内で行うべきです。

鍵などの機微情報の保管に関するより完全なガイドについては、[Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html) を参照してください。

### エスクローとバックアップ

失われた暗号鍵で暗号化されたデータは、二度と復旧できません。そのため、特に長期データストアの保存データ暗号化をサポートするアプリケーションでは、アプリケーションに安全な鍵バックアップ機能を組み込むことが不可欠です。

鍵をバックアップする場合、鍵の保管に使用するデータベースが少なくとも `FIPS 140-2 or 140-3` 検証済みモジュールを使用して暗号化されていることを確認します。調査で使用するため、または鍵が失われたり破損したりした場合にユーザーへ鍵材料を再プロビジョニングするため、鍵材料をエスクローすることが有用な場合があります。

デジタル署名の実行に使用する鍵は決してエスクローしてはなりませんが、暗号化を支える鍵をエスクローする必要性は検討してください。エスクローは、多くの場合、証明書や鍵をプロビジョニングする[認証局](https://en.wikipedia.org/wiki/Certificate_authority) (CA) または鍵管理システムで実行できます。ただし、場合によっては、アプリケーションのためにシステムがエスクローを実行できるように、別個の API を実装しなければならないことがあります。

### 説明責任と監査

説明責任には、ライフサイクル全体を通じて暗号鍵へアクセスする、または暗号鍵を管理する人の識別が含まれます。説明責任は、鍵侵害を防止し、侵害が検出された後の影響を軽減するうえで有効な手段になり得ます。

人が鍵を閲覧できないことが望ましいものの、最低限、鍵管理システムは平文の暗号鍵を閲覧できるすべての個人を把握すべきです。

さらに高度な鍵管理システムでは、平文形式か暗号文形式かにかかわらず、暗号鍵にアクセスまたは制御する権限を持つすべての個人を把握する場合があります。

説明責任には三つの重要な利点があります。

1. 侵害がいつ発生した可能性があるか、どの個人が関与した可能性があるかを判断するのに役立ちます。
2. 鍵へのアクセス権を持つ個人は、自身の鍵アクセスが把握されていることを知っているため、侵害に対する抑止になりやすいです。
3. 検出された鍵侵害から復旧する際、鍵がどこで使用され、どのデータまたは他の鍵が侵害された鍵で保護されていたかを把握することは非常に有用です。

暗号鍵の説明責任を強制するうえで有用と分かっている原則がいくつかあります。これらの原則は、すべてのシステムまたはすべての種類の鍵に適用されるとは限りません。

人が管理する長期鍵に適用される原則には、次のものがあります。

1. 鍵を一意に識別する。
2. 鍵の使用者を識別する。
3. 鍵が使用された日時と、保護されるデータを識別する。
4. 対称鍵または秘密鍵によって保護される他の鍵を識別する。

鍵管理システムでは、二種類の監査を実施すべきです。

1. セキュリティ計画と、その計画を支えるために策定された手順は、鍵管理ポリシー (`NIST SP 800-57 Part 2`) を引き続き支えていることを確認するため、定期的に監査すべきです。
2. 採用されている保護メカニズムは、それらが提供しているセキュリティレベルと将来提供すると期待されるセキュリティレベル、および適切なポリシーを正しく効果的に支えていることについて、定期的に再評価すべきです。

新しい技術開発や攻撃を考慮に入れるべきです。より頻繁には、システムを使用、運用、保守する人の行動をレビューし、確立されたセキュリティ手順に引き続き従っていることを検証すべきです。

強力な暗号システムであっても、緩慢で不適切な人間の行動によって侵害される可能性があります。非常に異常なイベントは記録し、システムへの攻撃試行を示す可能性のある指標としてレビューすべきです。

### 鍵侵害と復旧

鍵の侵害には次の影響があります。

1. 一般に、機密性保護 (つまり暗号化) を提供するために使用される鍵が不正に開示されると、その鍵で暗号化されたすべての情報が、権限のないエンティティに露出または知られる可能性があります。認証局の秘密署名鍵が開示されると、攻撃者は不正な証明書や証明書失効リスト (CRL) を作成できます。
2. 鍵の完全性が侵害されると、その鍵が不正確であることを意味します。つまり、鍵が (意図的または偶発的に) 変更された、または別の鍵に置き換えられたということです。これには、鍵の削除 (利用不能) も含まれます。完全性を提供するために使用される鍵の置換または変更は、その鍵で保護されるすべての情報の完全性に疑問を生じさせます。この情報は、その鍵を知る権限のないエンティティによって提供または変更された可能性があります。後でデータの暗号化に使用される公開鍵または秘密鍵の置換は、復号鍵を知る権限のないエンティティが、その暗号化鍵で暗号化されたデータを復号できるようにする可能性があります。
3. 鍵の用途またはアプリケーションとの関連付けが侵害されると、その鍵が誤った目的 (たとえば、デジタル署名ではなく鍵確立) または誤ったアプリケーションに使用される可能性があり、その鍵で保護される情報の侵害につながる可能性があります。
4. 鍵と所有者または他のエンティティとの関連付けが侵害されると、相手エンティティのアイデンティティを保証できなくなります (つまり、相手エンティティが本当は誰なのか分からない)、または情報を正しく処理できなくなります (たとえば、正しい鍵で復号できない)。
5. 鍵と他の情報との関連付けが侵害されると、関連付けがまったく存在しない、または誤った「情報」と関連付けられていることを意味します。これにより、暗号サービスが失敗したり、情報が失われたり、情報のセキュリティが侵害されたりする可能性があります。鍵侵害の可能性や影響を最小化するために、特定の保護手段を講じることがあります。これはランサムウェアと同様の影響を持ちますが、身代金を支払って鍵を取り戻すことはできません。

通常、次の手順が関係します。

1. 対称鍵または秘密鍵が平文形式で存在する時間を制限する。
2. 人が平文の対称鍵および秘密鍵を閲覧できないようにする。
3. 平文の対称鍵および秘密鍵を物理的に保護されたコンテナに制限する。これには、鍵生成器、鍵転送デバイス、鍵ローダー、暗号モジュール、鍵保管デバイスが含まれます。
4. 完全性チェックを使用して、鍵または鍵と他のデータとの関連付けの完全性が侵害されていないことを確認する。たとえば、鍵は、ラッピングや関連付けに対する不正な変更が検出されるような方法でラップ (つまり暗号化) される場合があります。
5. 適切な鍵が実際に確立されたことを確認するため、鍵確認 (NIST SP 800-57 Part 1 Section 4.2.5.5 を参照) を採用する。
6. 平文形式の対称鍵および秘密鍵への各アクセスを追跡する説明責任システムを確立する。
7. 鍵に対して暗号学的完全性チェックを提供する (たとえば、MAC またはデジタル署名を使用)。
8. 署名データに信頼されたタイムスタンプを使用する。i. 不要になった鍵は速やかに破棄する。
9. 特に CA 侵害の場合に備え、侵害復旧計画を作成する。

鍵侵害時に暗号セキュリティサービスを復旧するには、侵害復旧計画が不可欠です。侵害復旧計画は文書化され、容易にアクセスできる必要があります。

侵害復旧計画には次の事項を含めるべきです。

1. 通知すべき担当者の識別情報と連絡先情報。
2. 復旧アクションを実行する担当者の識別情報と連絡先情報。
3. 鍵更新方法。
4. すべての暗号鍵とその用途の棚卸し (たとえば、システム内のすべての証明書の場所)。
5. 復旧手順に関するすべての適切な担当者への教育。
6. 復旧手順を支援するために必要なすべての担当者の識別情報と連絡先情報。
7. 鍵失効チェックを強制するポリシー (侵害の影響を最小化するため)。
8. 鍵更新操作の監視 (影響を受けるすべての鍵に対して必要な操作が実施されることを確認するため)。
9. その他の復旧手順。これには次のものが含まれる場合があります。
    1. 機器の物理検査。
    2. インシデントの結果として侵害される可能性のあるすべての情報の識別。
    3. 署名鍵の侵害により無効となる可能性のあるすべての署名の識別。
    4. 必要な場合、新しい鍵材料の配布。

## 信頼ストア

1. 第三者ルート証明書の注入から信頼ストアを保護するための制御を設計します。アクセス制御は、エンティティおよびアプリケーション単位で管理および強制されます。
2. 信頼ストアに保管されるオブジェクトに完全性制御を実装します。
3. 認証と認可なしに、信頼ストア内に保持される鍵のエクスポートを許可しないでください。
4. アプリケーションからネットワークアプリケーションや他のコンポーネントへ鍵材料をエクスポートするための厳格なポリシーと手順を設定します。
5. 信頼ストアを更新するための安全なプロセスを実装します。

## 暗号鍵管理ライブラリ

適切に保守および更新され、第三者組織 (例: `NIST`/`FIPS`) によってテストおよび検証された、信頼できる暗号ライブラリのみを使用してください。

## Documentation

- [Practical cryptography for developers](https://cryptobook.nakov.com/).

</section>

<section id="key-management-bilingual-panel" className="tabPanel bilingualPanel contentPanel">

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Introduction

This Key Management Cheat Sheet provides developers with guidance for implementation of cryptographic key management within an application in a secure manner. It is important to document and harmonize rules and practices for:

1. Key life cycle management (generation, distribution, destruction)
2. Key compromise, recovery and zeroization
3. Key storage
4. Key agreement

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語訳</span>

## はじめに

この鍵管理チートシートは、アプリケーション内で暗号鍵管理を安全に実装するためのガイダンスを開発者に提供します。次の事項について、ルールと実務を文書化し、整合させることが重要です。

1. 鍵ライフサイクル管理 (生成、配布、破棄)
2. 鍵侵害、復旧、ゼロ化
3. 鍵の保管
4. 鍵合意

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## General Guidelines and Considerations

Formulate a plan for the overall organization's cryptographic strategy to guide developers working on different applications and ensure that each application's cryptographic capability meets minimum requirements and best practices.

Identify the cryptographic and key management requirements for your application and map all components that process or store cryptographic key material.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語訳</span>

## 一般的なガイドラインと考慮事項

組織全体の暗号戦略について計画を策定し、複数のアプリケーションに携わる開発者を導き、各アプリケーションの暗号機能が最小要件とベストプラクティスを満たすようにします。

アプリケーションの暗号要件と鍵管理要件を特定し、暗号鍵材料を処理または保管するすべてのコンポーネントをマッピングします。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Key Selection

Selection of the cryptographic and key management algorithms to use within a given application should begin with an understanding of the objectives of the application.

For example, if the application is required to store data securely, then the developer should select an algorithm suite that supports the objective of data at rest protection security. Applications that are required to transmit and receive data would select an algorithm suite that supports the objective of data in transit protection.

We have provided recommendations on the selection of crypto suites within an application based on application and security objectives. Application developers oftentimes begin the development of crypto and key management capabilities by examining what is available in a library.

However, an analysis of the real needs of the application should be conducted to determine the optimal key management approach. Begin by understanding the security objectives of the application which will then drive the selection of cryptographic protocols that are best suited. For example, the application may require:

1. Confidentiality of data at rest and confidentiality of data in transit.
2. Authenticity of the end device.
3. Authenticity of data origin.
4. Integrity of data in transit.
5. Keys to create the data encryption keys.

Once the understanding of the security needs of the application is achieved, developers can determine what protocols and algorithms are required. Once the protocols and algorithms are understood, you can begin to define the different types of keys that will support the application's objectives.

There are a diverse set of key types and certificates to consider, for example:

1. **Encryption:** [Symmetric](https://en.wikipedia.org/wiki/Symmetric-key_algorithm) encryption keys, [Asymmetric](https://en.wikipedia.org/wiki/Public-key_cryptography) encryption keys (public and private).
2. **Authentication of End Devices:** Pre-shared symmetric keys, Trusted certificates, Trust Anchors.
3. **Data Origin Authentication:** [HMAC](https://en.wikipedia.org/wiki/HMAC).
4. **Integrity Protection:** [Message Authentication Codes](https://en.wikipedia.org/wiki/Message_authentication_code) (MACs).
5. **Key Encryption Keys**.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語訳</span>

## 鍵の選択

特定のアプリケーションで使用する暗号アルゴリズムと鍵管理アルゴリズムの選択は、アプリケーションの目的を理解することから始めるべきです。

たとえば、アプリケーションがデータを安全に保管する必要がある場合、開発者は保存データ保護のセキュリティ目的を支えるアルゴリズムスイートを選択すべきです。データの送受信が必要なアプリケーションでは、転送中データ保護の目的を支えるアルゴリズムスイートを選択します。

ここでは、アプリケーションとセキュリティ目的に基づいて、アプリケーション内で暗号スイートを選択するための推奨事項を示します。アプリケーション開発者は、ライブラリで利用できるものを調べることから暗号機能や鍵管理機能の開発を始めることがよくあります。

しかし、最適な鍵管理アプローチを判断するには、アプリケーションの実際のニーズを分析する必要があります。まずアプリケーションのセキュリティ目的を理解し、それによって最適な暗号プロトコルを選択します。たとえば、アプリケーションでは次のものが必要になる場合があります。

1. 保存データの機密性と転送中データの機密性。
2. エンドデバイスの真正性。
3. データ生成元の真正性。
4. 転送中データの完全性。
5. データ暗号化鍵を作成するための鍵。

アプリケーションのセキュリティニーズを理解したら、開発者は必要なプロトコルとアルゴリズムを判断できます。プロトコルとアルゴリズムを理解したら、アプリケーションの目的を支えるさまざまな種類の鍵を定義し始めることができます。

考慮すべき鍵種別や証明書には、たとえば次のような多様なものがあります。

1. **暗号化:** [対称](https://en.wikipedia.org/wiki/Symmetric-key_algorithm)暗号鍵、[非対称](https://en.wikipedia.org/wiki/Public-key_cryptography)暗号鍵 (公開鍵と秘密鍵)。
2. **エンドデバイスの認証:** 事前共有対称鍵、信頼された証明書、信頼アンカー。
3. **データ生成元認証:** [HMAC](https://en.wikipedia.org/wiki/HMAC)。
4. **完全性保護:** [メッセージ認証コード](https://en.wikipedia.org/wiki/Message_authentication_code) (MAC)。
5. **鍵暗号化鍵**。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Algorithms and Protocols

According to `NIST SP 800-57 Part 1`, many algorithms and schemes that provide a security service use a [hash function](https://en.wikipedia.org/wiki/Hash_function) as a component of the algorithm.

Hash functions can be found in digital signature algorithms (`FIPS186`), Keyed-Hash Message Authentication Codes (HMAC) (`FIPS198`), key-derivation functions/methods (`NIST Special Publications (SP) 800-56A, 800-56B, 800-56C and 800-108`), and random number generators (`NIST SP 800-90A`). Approved hash functions are defined in `FIPS180`.

`NIST SP 800-57 Part 1` recognizes three basic classes of approved cryptographic algorithms: hash functions, symmetric- key algorithms and asymmetric-key algorithms. The classes are defined by the number of cryptographic keys that are used in conjunction with the algorithm.

The NSA released a report, [Commercial National Security Algorithm Suite 2.0](https://media.defense.gov/2025/May/30/2003728741/-1/-1/0/CSA_CNSA_2.0_ALGORITHMS.PDF) which lists the cryptographic algorithms that are expected to be remain strong even with advances in quantum computing.

#### Cryptographic hash functions

Cryptographic hash functions do not require keys. Hash functions generate a relatively small digest (hash value) from a (possibly) large input in a way that is fundamentally difficult to reverse (i.e., it is hard to find an input that will produce a given output). Hash functions are used as building blocks for key management, for example,

1. To provide data authentication and integrity services (Section 4.2.3) - the hash function is used with a key to generate a message authentication code.
2. To compress messages for digital signature generation and verification (Section 4.2.4).
3. To derive keys in key-establishment algorithms (Section 4.2.5).
4. To generate deterministic random numbers (Section 4.2.7).

#### Symmetric-key algorithms

Symmetric-key algorithms (sometimes known as secret-key algorithms) transform data in a way that is fundamentally difficult to undo without knowledge of a secret key. The key is "symmetric" because the same key is used for a cryptographic operation and its inverse (e.g., encryption and decryption).

Symmetric keys are often known by more than one entity; however, the key shall not be disclosed to entities that are not authorized access to the data protected by that algorithm and key. Symmetric key algorithms are used, for example,

1. To provide data confidentiality (Section 4.2.2); the same key is used to encrypt and decrypt data.
2. To provide authentication and integrity services (Section 4.2.3) in the form of Message Authentication Codes (MACs); the same key is used to generate the MAC and to validate it. MACs normally employ either a symmetric key-encryption algorithm or a cryptographic hash function as their cryptographic primitive.
3. As part of the key-establishment process (Section 4.2.5).
4. To generate deterministic random numbers (Section 4.2.7).

#### Asymmetric-key algorithms

Asymmetric-key algorithms, commonly known as public-key algorithms, use two related keys (i.e., a key pair) to perform their functions: a public key and a private key. The public key may be known by anyone; the private key should be under the sole control of the entity that "owns" the key pair. Even though the public and private keys of a key pair are related, knowledge of the public key does not reveal the private key. Asymmetric algorithms are used, for example,

1. To compute digital signatures (Section 4.2.4).
2. To establish cryptographic keying material (Section 4.2.5).
3. To generate random numbers (Section 4.2.7).

#### Message Authentication Codes (MACs)

Message Authentication Codes (MACs) provide data authentication and integrity. A MAC is a cryptographic checksum on the data that is used in order to provide assurance that the data has not changed and that the MAC was computed by the expected entity.

Although message integrity is often provided using non-cryptographic techniques known as error detection codes, these codes can be altered by an adversary to effect an action to the adversary's benefit. The use of an approved cryptographic mechanism, such as a MAC, can alleviate this problem.

In addition, the MAC can provide a recipient with assurance that the originator of the data is a key holder (i.e., an entity authorized to have the key). MACs are often used to authenticate the originator to the recipient when only those two parties share the MAC key.

#### Digital Signatures

[Digital signatures](https://en.wikipedia.org/wiki/Digital_signature) are used to provide authentication, integrity and [non-repudiation](https://en.wikipedia.org/wiki/Non-repudiation). Digital signatures are used in conjunction with hash functions and are computed on data of any length (up to a limit that is determined by the hash function).

`FIPS186` specifies algorithms that are approved for the computation of digital signatures.

#### Key Encryption Keys

Symmetric key-wrapping keys are used to encrypt other keys using symmetric-key algorithms. Key-wrapping keys are also known as key encrypting keys.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語訳</span>

### アルゴリズムとプロトコル

`NIST SP 800-57 Part 1` によると、セキュリティサービスを提供する多くのアルゴリズムやスキームでは、アルゴリズムの構成要素として[ハッシュ関数](https://en.wikipedia.org/wiki/Hash_function)を使用します。

ハッシュ関数は、デジタル署名アルゴリズム (`FIPS186`)、鍵付きハッシュメッセージ認証コード (HMAC) (`FIPS198`)、鍵導出関数/方式 (`NIST Special Publications (SP) 800-56A, 800-56B, 800-56C and 800-108`)、乱数生成器 (`NIST SP 800-90A`) で使用されます。承認済みハッシュ関数は `FIPS180` で定義されています。

`NIST SP 800-57 Part 1` は、承認済み暗号アルゴリズムの基本クラスとして、ハッシュ関数、対称鍵アルゴリズム、非対称鍵アルゴリズムの三つを認めています。これらのクラスは、アルゴリズムと組み合わせて使用される暗号鍵の数によって定義されます。

NSA は、量子コンピューティングの進歩があっても強度を維持すると期待される暗号アルゴリズムを列挙した [Commercial National Security Algorithm Suite 2.0](https://media.defense.gov/2025/May/30/2003728741/-1/-1/0/CSA_CNSA_2.0_ALGORITHMS.PDF) というレポートを公開しました。

#### 暗号学的ハッシュ関数

暗号学的ハッシュ関数は鍵を必要としません。ハッシュ関数は、(場合によっては) 大きな入力から比較的小さなダイジェスト (ハッシュ値) を生成し、その逆算が本質的に困難になるようにします (つまり、特定の出力を生成する入力を見つけることが困難です)。ハッシュ関数は、たとえば次のように鍵管理の構成要素として使用されます。

1. データ認証および完全性サービスを提供するため (Section 4.2.3)。ハッシュ関数は鍵とともに使用され、メッセージ認証コードを生成します。
2. デジタル署名の生成および検証のためにメッセージを圧縮するため (Section 4.2.4)。
3. 鍵確立アルゴリズムで鍵を導出するため (Section 4.2.5)。
4. 決定論的乱数を生成するため (Section 4.2.7)。

#### 対称鍵アルゴリズム

対称鍵アルゴリズム (秘密鍵アルゴリズムとも呼ばれることがあります) は、秘密鍵を知らなければ元に戻すことが本質的に困難な方法でデータを変換します。暗号操作とその逆操作 (たとえば暗号化と復号) に同じ鍵を使用するため、その鍵は「対称」です。

対称鍵は複数のエンティティに知られていることがよくあります。ただし、そのアルゴリズムと鍵で保護されるデータへのアクセスを許可されていないエンティティに鍵を開示してはなりません。対称鍵アルゴリズムは、たとえば次の用途に使用されます。

1. データの機密性を提供するため (Section 4.2.2)。同じ鍵を使用してデータを暗号化および復号します。
2. メッセージ認証コード (MAC) の形で認証および完全性サービスを提供するため (Section 4.2.3)。同じ鍵を使用して MAC を生成し、それを検証します。MAC は通常、暗号プリミティブとして対称鍵暗号アルゴリズムまたは暗号学的ハッシュ関数を使用します。
3. 鍵確立プロセスの一部として (Section 4.2.5)。
4. 決定論的乱数を生成するため (Section 4.2.7)。

#### 非対称鍵アルゴリズム

非対称鍵アルゴリズムは、一般に公開鍵アルゴリズムとして知られ、機能を実行するために関連する二つの鍵 (つまり鍵ペア)、公開鍵と秘密鍵を使用します。公開鍵は誰でも知ることができますが、秘密鍵は鍵ペアを「所有する」エンティティの単独管理下に置くべきです。鍵ペアの公開鍵と秘密鍵は関連していますが、公開鍵を知っていても秘密鍵は明らかになりません。非対称アルゴリズムは、たとえば次の用途に使用されます。

1. デジタル署名を計算するため (Section 4.2.4)。
2. 暗号鍵材料を確立するため (Section 4.2.5)。
3. 乱数を生成するため (Section 4.2.7)。

#### メッセージ認証コード (MAC)

メッセージ認証コード (MAC) は、データ認証と完全性を提供します。MAC はデータに対する暗号学的チェックサムであり、データが変更されていないこと、および MAC が期待されるエンティティによって計算されたことについて保証を提供するために使用されます。

メッセージ完全性は、誤り検出符号と呼ばれる非暗号技術で提供されることも多いですが、これらの符号は攻撃者によって改ざんされ、攻撃者に有利な動作を引き起こされる可能性があります。MAC などの承認済み暗号メカニズムを使用すると、この問題を軽減できます。

さらに、MAC は、データの送信元が鍵保有者 (つまり、その鍵を持つことを許可されたエンティティ) であることを受信者に保証できます。MAC は、MAC 鍵を共有する二者だけがいる場合に、送信元を受信者へ認証するためによく使用されます。

#### デジタル署名

[デジタル署名](https://en.wikipedia.org/wiki/Digital_signature)は、認証、完全性、[否認防止](https://en.wikipedia.org/wiki/Non-repudiation)を提供するために使用されます。デジタル署名はハッシュ関数と組み合わせて使用され、(ハッシュ関数によって決まる制限内で) 任意の長さのデータに対して計算されます。

`FIPS186` は、デジタル署名の計算に承認されたアルゴリズムを規定しています。

#### 鍵暗号化鍵

対称鍵ラッピング鍵は、対称鍵アルゴリズムを使用して他の鍵を暗号化するために使用されます。鍵ラッピング鍵は、鍵暗号化鍵とも呼ばれます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Key Strength

Review `NIST SP 800-57` (Recommendation for Key Management) for recommended guidelines on key strength for specific algorithm implementations. Also, consider these best practices:

1. Establish what the application's minimum computational resistance to attack should be. Understanding the minimum computational resistance to attack should take into consideration the sophistication of your adversaries, how long data needs to be protected, where data is stored and if it is exposed. Identifying the computational resistance to attack will inform engineers as to the minimum length of the cryptographic key required to protect data over the life of that data. Consult `NIST SP 800-131a` for additional guidance on determining the appropriate key lengths for the algorithm of choice.
2. When encrypting keys for storage or distribution, always encrypt a cryptographic key with another key of equal or greater cryptographic strength.
3. When moving to [Elliptic Curve-based algorithms](https://en.wikipedia.org/wiki/Elliptic-curve_cryptography), choose a key length that meets or exceeds the comparative strength of other algorithms in use within your system. Refer to `NIST SP 800-57 Table 2`.
4. Formulate a strategy for the overall organization's cryptographic strategy to guide developers working on different applications and ensure that each application's cryptographic capability meets minimum requirements and best practices.

### Memory Management Considerations

Keys stored in memory for a long time can become "burned in". This can be mitigated by splitting the key into components that are frequently updated. `NIST SP 800-57`).

Loss or corruption of the memory media on which keys and/or certificates are stored, and recovery planning, according to `NIST SP 800-57`.

Plan for the recovery from possible corruption of the memory media necessary for key or certificate generation, registration, and/or distribution systems, subsystems, or components as recommended in `NIST SP 800-57`.

### Perfect Forward Secrecy

[Ephemeral keys](https://en.wikipedia.org/wiki/Ephemeral_key) can provide perfect forward secrecy protection, which means a compromise of the server's long term signing key does not compromise the confidentiality of past sessions. Refer to [TLS cheat sheet](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html).

### Key Usage

According to NIST, in general, a single key should be used for only one purpose (e.g., encryption, authentication, key wrapping, random number generation, or digital signatures).

There are several reasons for this:

1. The use of the same key for two different cryptographic processes may weaken the security provided by one or both of the processes.
2. Limiting the use of a key limits the damage that could be done if the key is compromised.
3. Some uses of keys interfere with each other. For example, the length of time the key may be required for each use and purpose. Retention requirements of the data may differ for different data types.

### Cryptographic Module Topics

According to `NIST SP 800-133`, cryptographic modules are the set of hardware, software, and/or firmware that implements security functions (including cryptographic algorithms and key generation) and is contained within a cryptographic module boundary to provide protection of the keys.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語訳</span>

### 鍵強度

特定のアルゴリズム実装における鍵強度の推奨ガイドラインについては、`NIST SP 800-57` (Recommendation for Key Management) を確認してください。また、次のベストプラクティスも考慮してください。

1. アプリケーションが攻撃に対して最低限備えるべき計算量的耐性を定めます。攻撃に対する最低限の計算量的耐性を理解するには、敵対者の高度さ、データを保護する必要がある期間、データの保管場所、データが露出しているかどうかを考慮する必要があります。攻撃に対する計算量的耐性を特定することで、エンジニアはデータのライフサイクル全体でデータを保護するために必要な暗号鍵の最小長を把握できます。選択したアルゴリズムに適切な鍵長を判断するための追加ガイダンスについては、`NIST SP 800-131a` を参照してください。
2. 保管または配布のために鍵を暗号化する場合は、常に同等以上の暗号強度を持つ別の鍵で暗号鍵を暗号化します。
3. [楕円曲線ベースのアルゴリズム](https://en.wikipedia.org/wiki/Elliptic-curve_cryptography)へ移行する場合は、システム内で使用している他のアルゴリズムの比較強度を満たす、または上回る鍵長を選択します。`NIST SP 800-57 Table 2` を参照してください。
4. 組織全体の暗号戦略を策定し、複数のアプリケーションに携わる開発者を導き、各アプリケーションの暗号機能が最小要件とベストプラクティスを満たすようにします。

### メモリ管理上の考慮事項

長時間メモリに保管される鍵は、「焼き付き」状態になる可能性があります。これは、頻繁に更新されるコンポーネントへ鍵を分割することで軽減できます。`NIST SP 800-57`)。

`NIST SP 800-57` に従い、鍵や証明書が保管されるメモリ媒体の損失または破損、および復旧計画を考慮します。

`NIST SP 800-57` の推奨に従い、鍵または証明書の生成、登録、配布に必要なシステム、サブシステム、コンポーネントのメモリ媒体が破損した場合の復旧を計画します。

### 完全前方秘匿性

[一時鍵](https://en.wikipedia.org/wiki/Ephemeral_key)は完全前方秘匿性の保護を提供できます。これは、サーバーの長期署名鍵が侵害されても、過去のセッションの機密性が侵害されないことを意味します。[TLS cheat sheet](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html) を参照してください。

### 鍵の用途

NIST によると、一般に単一の鍵は一つの目的 (たとえば、暗号化、認証、鍵ラッピング、乱数生成、デジタル署名) のみに使用すべきです。

これにはいくつかの理由があります。

1. 同じ鍵を二つの異なる暗号プロセスに使用すると、一方または両方のプロセスが提供するセキュリティが弱まる可能性があります。
2. 鍵の使用を制限すると、鍵が侵害された場合に発生し得る被害を制限できます。
3. 鍵の用途同士が干渉することがあります。たとえば、それぞれの用途や目的で鍵が必要となる期間です。データ保持要件はデータ種別ごとに異なる場合があります。

### 暗号モジュールに関するトピック

`NIST SP 800-133` によると、暗号モジュールとは、セキュリティ機能 (暗号アルゴリズムや鍵生成を含む) を実装し、鍵を保護するために暗号モジュール境界内に含まれるハードウェア、ソフトウェア、ファームウェア、またはそれらの組み合わせです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Key Management Lifecycle Best Practices

### Generation

Cryptographic keys shall be generated within cryptographic module with at least a `FIPS 140-2 or 140-3` compliance. For explanatory purposes, consider the cryptographic module in which a key is generated to be the key-generating module.

Any random value required by the key-generating module shall be generated within that module; that is, the Random Bit Generator that generates the random value shall be implemented within cryptographic module with at least a `FIPS 140-2 or 140-3` compliance that generates the key.

Hardware cryptographic modules are preferred over software cryptographic modules for protection.

### Distribution

The generated keys shall be transported (when necessary) using secure channels and shall be used by their associated cryptographic algorithm within at least a `FIPS 140-2 or 140-3` compliant cryptographic modules. For additional detail for the recommendations in this section refer to `NIST Special Paper 800-133`.

### Storage

1. Developers must understand where cryptographic keys are stored within the application. Understand what memory devices the keys are stored on.
2. Keys must be protected on both volatile and persistent memory, ideally processed within secure cryptographic modules.
3. Keys should never be stored in plaintext format.
4. Ensure all keys are stored in a cryptographic vault, such as a [hardware security module](https://en.wikipedia.org/wiki/Hardware_security_module) (HSM) or isolated cryptographic service.
5. If you are planning on storing keys in offline devices/databases, then encrypt the keys using Key Encryption Keys (KEKs) prior to the export of the key material. KEK length (and algorithm) should be equivalent to or greater in strength than the keys being protected.
6. Ensure that keys have integrity protections applied while in storage (consider dual purpose algorithms that support encryption and Message Code Authentication (MAC)).
7. Ensure that standard application level code never reads or uses cryptographic keys in any way and use key management libraries.
8. Ensure that keys and cryptographic operation is done inside the sealed vault.
9. All work should be done in the vault (such as key access, encryption, decryption, signing, etc).

For a more complete guide to storing sensitive information such as keys, see the [Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html).

### Escrow and Backup

Data that has been encrypted with lost cryptographic keys will never be recovered. Therefore, it is essential that the application incorporate a secure key backup capability, especially for applications that support data at rest encryption for long-term data stores.

When backing up keys, ensure that the database that is used to store the keys is encrypted using at least a `FIPS 140-2 or 140-3` validated module. It is sometimes useful to escrow key material for use in investigations and for re-provisioning of key material to users in the event that the key is lost or corrupted.

Never escrow keys used for performing digital signatures, but consider the need to escrow keys that support encryption. Oftentimes, escrow can be performed by the [Certificate Authority](https://en.wikipedia.org/wiki/Certificate_authority) (CA) or key management system that provisions certificates and keys, however in some instances separate APIs must be implemented to allow the system to perform the escrow for the application.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語訳</span>

## 鍵管理ライフサイクルのベストプラクティス

### 生成

暗号鍵は、少なくとも `FIPS 140-2 or 140-3` に準拠した暗号モジュール内で生成されなければなりません。説明のため、鍵が生成される暗号モジュールを鍵生成モジュールと考えます。

鍵生成モジュールが必要とする任意のランダム値は、そのモジュール内で生成されなければなりません。つまり、ランダム値を生成する Random Bit Generator は、鍵を生成する少なくとも `FIPS 140-2 or 140-3` 準拠の暗号モジュール内に実装されなければなりません。

保護のためには、ソフトウェア暗号モジュールよりもハードウェア暗号モジュールが望まれます。

### 配布

生成された鍵は、(必要な場合) セキュアチャネルを使用して転送され、関連する暗号アルゴリズムによって、少なくとも `FIPS 140-2 or 140-3` 準拠の暗号モジュール内で使用されなければなりません。このセクションの推奨事項の詳細については、`NIST Special Paper 800-133` を参照してください。

### 保管

1. 開発者は、暗号鍵がアプリケーション内のどこに保管されているかを理解しなければなりません。鍵がどのメモリデバイスに保管されているかを理解してください。
2. 鍵は揮発性メモリと永続メモリの両方で保護されなければならず、理想的にはセキュアな暗号モジュール内で処理されます。
3. 鍵を平文形式で保管すべきではありません。
4. すべての鍵が、[ハードウェアセキュリティモジュール](https://en.wikipedia.org/wiki/Hardware_security_module) (HSM) や分離された暗号サービスなどの暗号ボールトに保管されるようにします。
5. オフラインデバイス/データベースに鍵を保管する予定がある場合は、鍵材料をエクスポートする前に、鍵暗号化鍵 (KEK) を使用して鍵を暗号化します。KEK の長さ (およびアルゴリズム) は、保護対象の鍵と同等以上の強度を持つべきです。
6. 保管中の鍵に完全性保護が適用されていることを確認します (暗号化とメッセージコード認証 (MAC) をサポートする二重目的アルゴリズムを検討してください)。
7. 標準的なアプリケーションレベルのコードが暗号鍵をいかなる形でも読み取ったり使用したりしないようにし、鍵管理ライブラリを使用します。
8. 鍵と暗号操作が封印されたボールト内で行われることを確認します。
9. すべての作業 (鍵アクセス、暗号化、復号、署名など) はボールト内で行うべきです。

鍵などの機微情報の保管に関するより完全なガイドについては、[Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html) を参照してください。

### エスクローとバックアップ

失われた暗号鍵で暗号化されたデータは、二度と復旧できません。そのため、特に長期データストアの保存データ暗号化をサポートするアプリケーションでは、アプリケーションに安全な鍵バックアップ機能を組み込むことが不可欠です。

鍵をバックアップする場合、鍵の保管に使用するデータベースが少なくとも `FIPS 140-2 or 140-3` 検証済みモジュールを使用して暗号化されていることを確認します。調査で使用するため、または鍵が失われたり破損したりした場合にユーザーへ鍵材料を再プロビジョニングするため、鍵材料をエスクローすることが有用な場合があります。

デジタル署名の実行に使用する鍵は決してエスクローしてはなりませんが、暗号化を支える鍵をエスクローする必要性は検討してください。エスクローは、多くの場合、証明書や鍵をプロビジョニングする[認証局](https://en.wikipedia.org/wiki/Certificate_authority) (CA) または鍵管理システムで実行できます。ただし、場合によっては、アプリケーションのためにシステムがエスクローを実行できるように、別個の API を実装しなければならないことがあります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Accountability and Audit

Accountability involves the identification of those that have access to, or control of, cryptographic keys throughout their lifecycles. Accountability can be an effective tool to help prevent key compromises and to reduce the impact of compromises once they are detected.

Although it is preferred that no humans are able to view keys, as a minimum, the key management system should account for all individuals who are able to view plaintext cryptographic keys.

In addition, more sophisticated key-management systems may account for all individuals authorized to access or control any cryptographic keys, whether in plaintext or ciphertext form.

Accountability provides three significant advantages:

1. It aids in the determination of when the compromise could have occurred and what individuals could have been involved.
2. It tends to protect against compromise, because individuals with access to the key know that their access to the key is known.
3. It is very useful in recovering from a detected key compromise to know where the key was used and what data or other keys were protected by the compromised key.

Certain principles have been found to be useful in enforcing the accountability of cryptographic keys. These principles might not apply to all systems or all types of keys.

Some of the principles that apply to long-term keys controlled by humans include:

1. Uniquely identifying keys.
2. Identifying the key user.
3. Identifying the dates and times of key use, along with the data that is protected.
4. Identifying other keys that are protected by a symmetric or private key.

Two types of audit should be performed on key management systems:

1. The security plan and the procedures that are developed to support the plan should be periodically audited to ensure that they continue to support the Key Management Policy (`NIST SP 800-57 Part 2`).
2. The protective mechanisms employed should be periodically reassessed with respect to the level of security that they provide and are expected to provide in the future, and that the mechanisms correctly and effectively support the appropriate policies.

New technology developments and attacks should be taken into consideration. On a more frequent basis, the actions of the humans that use, operate and maintain the system should be reviewed to verify that the humans continue to follow established security procedures.

Strong cryptographic systems can be compromised by lax and inappropriate human actions. Highly unusual events should be noted and reviewed as possible indicators of attempted attacks on the system.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語訳</span>

### 説明責任と監査

説明責任には、ライフサイクル全体を通じて暗号鍵へアクセスする、または暗号鍵を管理する人の識別が含まれます。説明責任は、鍵侵害を防止し、侵害が検出された後の影響を軽減するうえで有効な手段になり得ます。

人が鍵を閲覧できないことが望ましいものの、最低限、鍵管理システムは平文の暗号鍵を閲覧できるすべての個人を把握すべきです。

さらに高度な鍵管理システムでは、平文形式か暗号文形式かにかかわらず、暗号鍵にアクセスまたは制御する権限を持つすべての個人を把握する場合があります。

説明責任には三つの重要な利点があります。

1. 侵害がいつ発生した可能性があるか、どの個人が関与した可能性があるかを判断するのに役立ちます。
2. 鍵へのアクセス権を持つ個人は、自身の鍵アクセスが把握されていることを知っているため、侵害に対する抑止になりやすいです。
3. 検出された鍵侵害から復旧する際、鍵がどこで使用され、どのデータまたは他の鍵が侵害された鍵で保護されていたかを把握することは非常に有用です。

暗号鍵の説明責任を強制するうえで有用と分かっている原則がいくつかあります。これらの原則は、すべてのシステムまたはすべての種類の鍵に適用されるとは限りません。

人が管理する長期鍵に適用される原則には、次のものがあります。

1. 鍵を一意に識別する。
2. 鍵の使用者を識別する。
3. 鍵が使用された日時と、保護されるデータを識別する。
4. 対称鍵または秘密鍵によって保護される他の鍵を識別する。

鍵管理システムでは、二種類の監査を実施すべきです。

1. セキュリティ計画と、その計画を支えるために策定された手順は、鍵管理ポリシー (`NIST SP 800-57 Part 2`) を引き続き支えていることを確認するため、定期的に監査すべきです。
2. 採用されている保護メカニズムは、それらが提供しているセキュリティレベルと将来提供すると期待されるセキュリティレベル、および適切なポリシーを正しく効果的に支えていることについて、定期的に再評価すべきです。

新しい技術開発や攻撃を考慮に入れるべきです。より頻繁には、システムを使用、運用、保守する人の行動をレビューし、確立されたセキュリティ手順に引き続き従っていることを検証すべきです。

強力な暗号システムであっても、緩慢で不適切な人間の行動によって侵害される可能性があります。非常に異常なイベントは記録し、システムへの攻撃試行を示す可能性のある指標としてレビューすべきです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Key Compromise and Recovery

The compromise of a key has the following implications:

1. In general, the unauthorized disclosure of a key used to provide confidentiality protection (i.e., via encryption) means that all information encrypted by that key could be exposed or known by unauthorized entities. The disclosure of a Certificate of Authorities's private signature key means that an adversary can create fraudulent certificates and Certificate Revocation Lists (CRLs).
2. A compromise of the integrity of a key means that the key is incorrect - either that the key has been modified (either deliberately or accidentally), or that another key has been substituted; this includes a deletion (non-availability) of the key. The substitution or modification of a key used to provide integrity calls into question the integrity of all information protected by the key. This information could have been provided by, or changed by, an unauthorized entity that knows the key. The substitution of a public or secret key that will be used (at a later time) to encrypt data could allow an unauthorized entity (who knows the decryption key) to decrypt data that was encrypted using the encryption key.
3. A compromise of a key's usage or application association means that the key could be used for the wrong purpose (e.g., for key establishment instead of digital signatures) or for the wrong application, and could result in the compromise of information protected by the key.
4. A compromise of a key's association with the owner or other entity means that the identity of the other entity cannot be assured (i.e., one does not know who the other entity really is) or that information cannot be processed correctly (e.g., decrypted with the correct key).
5. A compromise of a key's association with other information means that there is no association at all, or the association is with the wrong "information". This could cause the cryptographic services to fail, information to be lost, or the security of the information to be compromised. Certain protective measures may be taken in order to minimize the likelihood or consequences of a key compromise. Similar affect as ransomware, except that you can't pay the ransom and get the key back.

The following procedures are usually involved:

1. Limiting the amount of time a symmetric or private key is in plaintext form.
2. Preventing humans from viewing plaintext symmetric and private keys.
3. Restricting plaintext symmetric and private keys to physically protected containers. This includes key generators, key-transport devices, key loaders, cryptographic modules, and key-storage devices.
4. Using integrity checks to ensure that the integrity of a key or its association with other data has not been compromised. For example, keys may be wrapped (i.e., encrypted) in such a manner that unauthorized modifications to the wrapping or to the associations will be detected.
5. Employing key confirmation (see NIST SP 800-57 Part 1 Section 4.2.5.5) to help ensure that the proper key was, in fact, established.
6. Establishing an accountability system that keeps track of each access to symmetric and private keys in plaintext form.
7. Providing a cryptographic integrity check on the key (e.g., using a MAC or a digital signature).
8. The use of trusted timestamps for signed data. i. Destroying keys as soon as they are no longer needed.
9. Creating a compromise-recovery plan, especially in the case of a CA compromise.

A compromise-recovery plan is essential for restoring cryptographic security services in the event of a key compromise. A compromise-recovery plan shall be documented and easily accessible.

The compromise-recovery plan should contain:

1. The identification and contact info of the personnel to notify.
2. The identification and contact info of the personnel to perform the recovery actions.
3. The re-key method.
4. An inventory of all cryptographic keys and their use (e.g., the location of all certificates in a system).
5. The education of all appropriate personnel on the recovery procedures.
6. An identification and contact info of all personnel needed to support the recovery procedures.
7. Policies that key-revocation checking be enforced (to minimize the effect of a compromise).
8. The monitoring of the re-keying operations (to ensure that all required operations are performed for all affected keys).
9. Any other recovery procedures, which may include:
    1. Physical inspection of the equipment.
    2. Identification of all information that may be compromised as a result of the incident.
    3. Identification of all signatures that may be invalid, due to the compromise of a signing key.
    4. Distribution of new keying material, if required.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語訳</span>

### 鍵侵害と復旧

鍵の侵害には次の影響があります。

1. 一般に、機密性保護 (つまり暗号化) を提供するために使用される鍵が不正に開示されると、その鍵で暗号化されたすべての情報が、権限のないエンティティに露出または知られる可能性があります。認証局の秘密署名鍵が開示されると、攻撃者は不正な証明書や証明書失効リスト (CRL) を作成できます。
2. 鍵の完全性が侵害されると、その鍵が不正確であることを意味します。つまり、鍵が (意図的または偶発的に) 変更された、または別の鍵に置き換えられたということです。これには、鍵の削除 (利用不能) も含まれます。完全性を提供するために使用される鍵の置換または変更は、その鍵で保護されるすべての情報の完全性に疑問を生じさせます。この情報は、その鍵を知る権限のないエンティティによって提供または変更された可能性があります。後でデータの暗号化に使用される公開鍵または秘密鍵の置換は、復号鍵を知る権限のないエンティティが、その暗号化鍵で暗号化されたデータを復号できるようにする可能性があります。
3. 鍵の用途またはアプリケーションとの関連付けが侵害されると、その鍵が誤った目的 (たとえば、デジタル署名ではなく鍵確立) または誤ったアプリケーションに使用される可能性があり、その鍵で保護される情報の侵害につながる可能性があります。
4. 鍵と所有者または他のエンティティとの関連付けが侵害されると、相手エンティティのアイデンティティを保証できなくなります (つまり、相手エンティティが本当は誰なのか分からない)、または情報を正しく処理できなくなります (たとえば、正しい鍵で復号できない)。
5. 鍵と他の情報との関連付けが侵害されると、関連付けがまったく存在しない、または誤った「情報」と関連付けられていることを意味します。これにより、暗号サービスが失敗したり、情報が失われたり、情報のセキュリティが侵害されたりする可能性があります。鍵侵害の可能性や影響を最小化するために、特定の保護手段を講じることがあります。これはランサムウェアと同様の影響を持ちますが、身代金を支払って鍵を取り戻すことはできません。

通常、次の手順が関係します。

1. 対称鍵または秘密鍵が平文形式で存在する時間を制限する。
2. 人が平文の対称鍵および秘密鍵を閲覧できないようにする。
3. 平文の対称鍵および秘密鍵を物理的に保護されたコンテナに制限する。これには、鍵生成器、鍵転送デバイス、鍵ローダー、暗号モジュール、鍵保管デバイスが含まれます。
4. 完全性チェックを使用して、鍵または鍵と他のデータとの関連付けの完全性が侵害されていないことを確認する。たとえば、鍵は、ラッピングや関連付けに対する不正な変更が検出されるような方法でラップ (つまり暗号化) される場合があります。
5. 適切な鍵が実際に確立されたことを確認するため、鍵確認 (NIST SP 800-57 Part 1 Section 4.2.5.5 を参照) を採用する。
6. 平文形式の対称鍵および秘密鍵への各アクセスを追跡する説明責任システムを確立する。
7. 鍵に対して暗号学的完全性チェックを提供する (たとえば、MAC またはデジタル署名を使用)。
8. 署名データに信頼されたタイムスタンプを使用する。i. 不要になった鍵は速やかに破棄する。
9. 特に CA 侵害の場合に備え、侵害復旧計画を作成する。

鍵侵害時に暗号セキュリティサービスを復旧するには、侵害復旧計画が不可欠です。侵害復旧計画は文書化され、容易にアクセスできる必要があります。

侵害復旧計画には次の事項を含めるべきです。

1. 通知すべき担当者の識別情報と連絡先情報。
2. 復旧アクションを実行する担当者の識別情報と連絡先情報。
3. 鍵更新方法。
4. すべての暗号鍵とその用途の棚卸し (たとえば、システム内のすべての証明書の場所)。
5. 復旧手順に関するすべての適切な担当者への教育。
6. 復旧手順を支援するために必要なすべての担当者の識別情報と連絡先情報。
7. 鍵失効チェックを強制するポリシー (侵害の影響を最小化するため)。
8. 鍵更新操作の監視 (影響を受けるすべての鍵に対して必要な操作が実施されることを確認するため)。
9. その他の復旧手順。これには次のものが含まれる場合があります。
    1. 機器の物理検査。
    2. インシデントの結果として侵害される可能性のあるすべての情報の識別。
    3. 署名鍵の侵害により無効となる可能性のあるすべての署名の識別。
    4. 必要な場合、新しい鍵材料の配布。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Trust Stores

1. Design controls to secure the trust store against injection of third-party root certificates. The access controls are managed and enforced on an entity and application basis.
2. Implement integrity controls on objects stored in the trust store.
3. Do not allow for export of keys held within the trust store without authentication and authorization.
4. Setup strict policies and procedures for exporting key material from applications to network applications and other components.
5. Implement a secure process for updating the trust store.

## Cryptographic Key Management Libraries

Use only reputable crypto libraries that are well maintained and updated, as well as tested and validated by third-party organizations (e.g., `NIST`/`FIPS`).

## Documentation

- [Practical cryptography for developers](https://cryptobook.nakov.com/).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語訳</span>

## 信頼ストア

1. 第三者ルート証明書の注入から信頼ストアを保護するための制御を設計します。アクセス制御は、エンティティおよびアプリケーション単位で管理および強制されます。
2. 信頼ストアに保管されるオブジェクトに完全性制御を実装します。
3. 認証と認可なしに、信頼ストア内に保持される鍵のエクスポートを許可しないでください。
4. アプリケーションからネットワークアプリケーションや他のコンポーネントへ鍵材料をエクスポートするための厳格なポリシーと手順を設定します。
5. 信頼ストアを更新するための安全なプロセスを実装します。

## 暗号鍵管理ライブラリ

適切に保守および更新され、第三者組織 (例: `NIST`/`FIPS`) によってテストおよび検証された、信頼できる暗号ライブラリのみを使用してください。

## Documentation

- [Practical cryptography for developers](https://cryptobook.nakov.com/).

</div>
</div>

</section>

</div>

## Attribution

<div className="attributionFooter">

- Original: Key Management Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Key_Management_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: English original retained for comparison. Japanese translation added.
- Retrieved: 2026-05-21

</div>
