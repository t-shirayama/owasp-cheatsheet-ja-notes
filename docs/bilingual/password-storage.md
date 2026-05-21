---
title: Password Storage Cheat Sheet
hide_title: true
---

<div className="docHero" data-category="cryptographic-storage">
  <h1>パスワード保存チートシート</h1>
  <div className="docMeta">
    <span className="docPill">最終更新: 2026-05-21</span>
    <span className="docPill">読了時間: 約 10 分</span>
    <span className="docPill">カテゴリ: 認証</span>
  </div>
</div>


<div className="tabbedContent">
  <input className="tabInput" type="radio" name="password-storage-view" id="password-storage-original" />
  <input className="tabInput" type="radio" name="password-storage-view" id="password-storage-translation" defaultChecked />
  <input className="tabInput" type="radio" name="password-storage-view" id="password-storage-bilingual" />

  <div className="contentTabs">
    <label htmlFor="password-storage-original" title="OWASP 原文">原文</label>
    <label htmlFor="password-storage-translation" title="日本語訳">翻訳</label>
    <label htmlFor="password-storage-bilingual" title="原文と翻訳を並べて確認">対比表示</label>
  </div>

<section id="password-storage-original-panel" className="tabPanel originalPanel contentPanel">

## Introduction

This cheat sheet advises you on the proper methods for storing passwords for authentication. When passwords are stored, they must be protected from an attacker even if the application or database is compromised. Fortunately, a majority of modern languages and frameworks provide built-in functionality to help store passwords safely.

Passwords should never be stored in plain text. Instead, they must be protected using strong, slow hashing algorithms such as Argon2id, bcrypt, or PBKDF2. A unique salt must be added to each password to prevent attackers from using precomputed lookup tables like rainbow tables. Fast hashing algorithms such as SHA‑256 are not suitable for password storage because they allow attackers to perform large numbers of guesses quickly. Using slow, memory‑hard algorithms makes brute‑force attacks significantly more difficult, expensive, and time‑consuming.

To sum up our recommendations:

- **Use [Argon2id](#argon2id) with a minimum configuration of 19 MiB of memory, an iteration count of 2, and 1 degree of parallelism.**
- **If [Argon2id](#argon2id) is not available, use [scrypt](#scrypt) with a minimum CPU/memory cost parameter of (2^17), a minimum block size of 8 (1024 bytes), and a parallelization parameter of 1.**
- **For legacy systems using [bcrypt](#bcrypt), use a work factor of 10 or more and with a password limit of 72 bytes.**
- **If FIPS-140 compliance is required, use [PBKDF2](#pbkdf2) with a work factor of 600,000 or more and set with an internal hash function of HMAC-SHA-256.**
- **Consider using a [pepper](#peppering) to provide additional defense in depth (though alone, it provides no additional secure characteristics).**

## Background

### Hashing vs Encryption

Hashing and encryption can keep sensitive data safe, but in almost all circumstances, **Passwords should be securely hashed using modern, adaptive hashing algorithms (e.g., Argon2id, bcrypt, or PBKDF2), rather than encrypted or stored in plaintext.**

Because **hashing is a one-way function** (i.e., it is impossible to "decrypt" a hash and obtain the original plaintext value), it is the most appropriate approach for password validation. Even if an attacker obtains the hashed password, they cannot use it to log in as the victim.

Since **encryption is a two-way function**, attackers can retrieve the original plaintext from the encrypted data. It can be used to store data such as a user's address since this data is displayed in plaintext on the user's profile. Hashing their address would result in a garbled mess.

The only time encryption should be used in passwords is in edge cases where it is necessary to obtain the original plaintext password. This might be necessary if the application needs to use the password to authenticate with another system that does not support a modern way to programmatically grant access, such as OpenID Connect (OIDC). Wherever possible, an alternative architecture should be used to avoid the need to store passwords in an encrypted form.

For further guidance on encryption, see the [Cryptographic Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html).

### When Password Hashes Can Be Cracked

**Strong passwords stored with modern hashing algorithms and using hashing best practices should be effectively impossible for an attacker to crack.** It is your responsibility as an application owner to select a modern hashing algorithm.

However, there are some situations where an attacker can "crack" the hashes in some circumstances by doing the following:

- Selecting a password you think the victim has chosen (e.g.`password1!`)
- Calculating the hash
- Comparing the hash you calculated to the hash of the victim. If they match, you have correctly "cracked" the hash and now know the plaintext value of their password.

Usually, the attacker will repeat this process with a list of large number of potential candidate passwords, such as:

- Lists of passwords obtained from other compromised sites
- Brute force (trying every possible candidate)
- Dictionaries or wordlists of common passwords

While the number of permutations can be enormous, with high speed hardware (such as GPUs) and cloud services with many servers for rent, the cost to an attacker is relatively small to do successful password cracking, especially when best practices for hashing are not followed.

## Methods for Enhancing Password Storage

### Salting

A salt is a unique, randomly generated string that is added to each password as part of the hashing process. As the salt is unique for every user, an attacker has to crack hashes one at a time using the respective salt rather than calculating a hash once and comparing it against every stored hash. This makes cracking large numbers of hashes significantly harder, as the time required grows in direct proportion to the number of hashes.

Salting also protects against an attacker's pre-computing hashes using rainbow tables or database-based lookups. Finally, salting means that it is impossible to determine whether two users have the same password without cracking the hashes, as the different salts will result in different hashes even if the passwords are the same.

At the algorithm and specification level, modern password hashing functions such as [Argon2id](#argon2id), [bcrypt](#bcrypt), and [PBKDF2](#pbkdf2) require the caller to provide a salt.
However, most widely used implementations and libraries automatically generate and manage salts internally, so application developers typically do not need to handle salt generation manually when using these libraries correctly.

### Peppering

[Peppering](https://datatracker.ietf.org/doc/html/draft-ietf-kitten-password-storage-07#section-4.2) is a class of strategies that can be used in addition to salting to provide an additional layer of protection. It prevents an attacker from being able to crack any of the hashes if they only have access to the database, for example, if they have exploited a SQL injection vulnerability or obtained a backup of the database.

#### Common requirements for peppering strategies

- A pepper is **shared between stored passwords**, rather than being *unique* to an individual password like a password salt.
- Unlike a password salt, the pepper should not be public and **should not be stored along with the generated hash**. The pepper should be stored separately from the password database.
- Peppers are secrets and should be stored in "secrets vaults" or HSMs (Hardware Security Modules). See the [Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html) for more information on securely storing secrets.
- In the event of a pepper's compromise, the pepper will have to be changed. Peppers cannot be changed without knowledge of a user's password. Therefore changing a pepper will require forcing all users whose passwords were protected by the previous pepper to reset their passwords.

#### Pre-hashing peppers

In this strategy, a pepper is added to a password before being hashed by a password hashing algorithm. The computed hash is then stored in the database. In this case the pepper should be a random value generated securely. See the [Cryptographic_Storage_Cheat_Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html#secure-random-number-generation) for more information on securely generating random values.

#### Post-hashing peppers

In this strategy, a password is hashed as usual using a password hashing algorithm. The resulting password hash is then hashed again using an HMAC (e.g., HMAC-SHA256, HMAC-SHA512, depending on the desired output length) before storing the resulting hash in the database. In this case the pepper is acting as the HMAC key and should be generated as per requirements of the HMAC algorithm.

### Using Work Factors

 The work factor is the number of iterations of the hashing algorithm that are performed for each password (usually, it's actually `2^work` iterations). The work factor is typically stored in the hash output. It makes calculating the hash more computationally expensive, which in turn reduces the speed and/or increases the cost for which an attacker can attempt to crack the password hash.

When you choose a work factor, strike a balance between security and performance. Though higher work factors make hashes more difficult for an attacker to crack, they will slow down the process of verifying a login attempt. If the work factor is too high, the performance of the application may be degraded, which could be used by an attacker to carry out a denial of service attack by exhausting the server's CPU with a large number of login attempts.

There is no golden rule for the ideal work factor - it will depend on the performance of the server and the number of users on the application. Determining the optimal work factor will require experimentation on the specific server(s) used by the application. As a general rule, calculating a hash should take less than one second.

#### Upgrading the Work Factor

One key advantage of having a work factor is that it can be increased over time as hardware becomes more powerful and cheaper.

The most common approach to upgrading the work factor is to wait until the user next authenticates, then re-hash their password with the new work factor. The different hashes will have different work factors and hashes may never be upgraded if the user doesn't log back into the application. Depending on the application, it may be appropriate to remove the older password hashes and require users to reset their passwords next time they need to login in order to avoid storing older and less secure hashes.

## Password Hashing Algorithms

Some modern hashing algorithms have been specifically designed to securely store passwords. This means that they should be slow (unlike algorithms such as MD5 and SHA-1, which were designed to be fast), and you can change how slow they are by changing the work factor.

You do not need to hide which password hashing algorithm is used by an application. If you utilize a modern password hashing algorithm with proper configuration parameters, it should be safe to state in public which password hashing algorithms are in use and be listed [here](https://pulse.michalspacek.cz/passwords/storages).

When selecting a password hashing algorithm, developers should prefer modern algorithms that are designed to resist both GPU-based and memory-based attacks.
Where available, newer algorithms should be chosen for new applications, while older algorithms may still be acceptable for legacy systems with appropriate configuration.

Three hashing algorithms that should be considered.

### Argon2id

[Argon2](https://en.wikipedia.org/wiki/Argon2) was the winner of the 2015 [Password Hashing Competition](https://en.wikipedia.org/wiki/Password_Hashing_Competition). Out of the three Argon2 versions, use the  Argon2id variant since it provides a balanced approach to resisting both side-channel and GPU-based attacks.

Rather than a simple work factor like other algorithms, Argon2id has three different parameters that can be configured: the base minimum of the minimum memory size (m), the minimum number of iterations (t), and the degree of parallelism (p). We recommend the following configuration settings:

These parameters control how computationally expensive it is to compute a password hash.
Increasing memory usage, iteration count, or parallelism makes password cracking attempts significantly slower and more costly for attackers, while still remaining practical for legitimate authentication requests when tuned appropriately.

- m=47104 (46 MiB), t=1, p=1 (Do not use with Argon2i)
- m=19456 (19 MiB), t=2, p=1 (Do not use with Argon2i)
- m=12288 (12 MiB), t=3, p=1
- m=9216 (9 MiB), t=4, p=1
- m=7168 (7 MiB), t=5, p=1

These configuration settings provide an equal level of defense, and the only difference is a trade off between CPU and RAM usage.

### scrypt

[scrypt](http://www.tarsnap.com/scrypt/scrypt.pdf) is a password-based key derivation function created by [Colin Percival](https://twitter.com/cperciva). While [Argon2id](#argon2id) should be the best choice for password hashing, [scrypt](#scrypt) should be used when the former is not available.

Like [Argon2id](#argon2id), scrypt has three parameters that can be configured: the minimum memory cost parameter (N), the blocksize (r), and the degree of parallelism (p). Use one of the following settings:

- N=2^17 (128 MiB), r=8 (1024 bytes), p=1
- N=2^16 (64 MiB), r=8 (1024 bytes), p=2
- N=2^15 (32 MiB), r=8 (1024 bytes), p=3
- N=2^14 (16 MiB), r=8 (1024 bytes), p=5
- N=2^13 (8 MiB), r=8 (1024 bytes), p=10

These configuration settings provide a similar minimal level of defense, with the main trade-off between parallelism and RAM usage.

### bcrypt

The [bcrypt](https://en.wikipedia.org/wiki/bcrypt) password hashing function **should only** be used for password storage in legacy systems where Argon2 and scrypt are not available.

The work factor should be as large as verification server performance will allow, with a minimum of 10.

#### Input Limits of bcrypt

bcrypt has a maximum length input length of 72 bytes [for most implementations](https://security.stackexchange.com/questions/39849/does-bcrypt-have-a-maximum-password-length), so you should enforce a maximum password length of 72 bytes (or less if the bcrypt implementation in use has smaller limits).

#### Pre-Hashing Passwords with bcrypt

An alternative approach is to pre-hash the user-supplied password with a fast algorithm such as SHA-2, HMAC, or BLAKE3 and then to hash the resulting hash value with bcrypt (i.e., `bcrypt(H($password)), $salt, $cost)`)..
This can be **dangerous** because of null bytes in the hash output value and because of [password shucking](https://www.youtube.com/watch?v=OQD3qDYMyYQ).

The original bcrypt expects a null terminated password string, this means that the hash value will only be used to the first null byte in the hash value. (`bcrypt(H($password)), $salt, $cost) == bcrypt("", $salt, $cost)` if `H($password)[0] == 0`)
This increases the chance of finding a collision when [combining bcrypt with other hash functions](https://blog.ircmaxell.com/2015/03/security-issue-combining-bcrypt-with.html) and can be avoided by encoding the hash value to printable string with something like base64.
base64 can increases the length of the hash value above 72 characters and so there is a bit of truncation for large hash values from hashes like SHA-512, this is [negligible](https://soatok.blog/2024/11/27/beyond-bcrypt/).

Password shucking uses the fact, that it is easy to check if  `bcrypt(base64(H($password))), $salt, $cost) == bcrypt(base64($leaked_hash), $salt, $cost)`.
If the inner hash function `H` is used with the same password somewhere else and known to an attacker cracking the password can be reduced to breaking the hash function `H`.
Just using pure SHA-512, ( i.e. `bcrypt(base64(sha512($password))), $salt, $cost)`) is a **dangerous practice** and is as secure as just using pure SHA-512.
Password shucking only works if a leaked hash is known to the attacker, either through a breach database or rainbow tables.
To mitigate password shucking a [pepper](#peppering) can be used.

To summarize if bcrypt has to be used and the password should to be pre-hashed you should do `bcrypt(base64(hmac-sha384(data:$password, key:$pepper)), $salt, $cost)` and store the pepper not in the database.

### PBKDF2

Since [PBKDF2](https://en.wikipedia.org/wiki/PBKDF2) is recommended by [NIST](https://pages.nist.gov/800-63-3/sp800-63b.html#memsecretver) and has FIPS-140 validated implementations, so it should be the preferred algorithm when these are required.

The PBKDF2 algorithm requires that you select an internal hashing algorithm such as an HMAC or a variety of other hashing algorithms. HMAC-SHA-256 is widely supported and is recommended by NIST.

The work factor for PBKDF2 is implemented through an iteration count, which should set differently based on the internal hashing algorithm used.

- PBKDF2-HMAC-SHA256: 600,000 iterations (recommended)
- PBKDF2-HMAC-SHA512: 220,000 iterations
- PBKDF2-HMAC-SHA1: 1,400,000 iterations — **legacy only**, do not select for new systems. NIST SP 800-131A Rev. 2 disallows SHA-1 for new use after 2030.

### Parallel PBKDF2

- PPBKDF2-SHA512: cost 2
- PPBKDF2-SHA256: cost 5
- PPBKDF2-SHA1: cost 10

These configuration settings are equivalent in the defense they provide. ([Number as of december 2022, based on testing of RTX 4000 GPUs](https://tobtu.com/minimum-password-settings/))

#### PBKDF2 Pre-Hashing

When PBKDF2 is used with an HMAC, and the password is longer than the hash function's block size (64 bytes for SHA-256), the password will be automatically pre-hashed. For example, the password "This is a password longer than 512 bits which is the block size of SHA-256" is converted to the hash value (in hex): `fa91498c139805af73f7ba275cca071e78d78675027000c99a9925e2ec92eedd`.

Good implementations of PBKDF2 perform pre-hashing before the expensive iterated hashing phase. However, some implementations perform the conversion on each iteration, which can make hashing long passwords significantly more expensive than hashing short passwords. When users supply very long passwords, a potential denial of service vulnerability could occur, such as the one published in [Django](https://www.djangoproject.com/weblog/2013/sep/15/security/) during 2013. Manual pre-hashing can reduce this risk but requires adding a [salt](#salting) to the pre-hash step.

## Upgrading Legacy Hashes

Older applications that use less secure hashing algorithms, such as MD5 or SHA-1, can be upgraded to modern password hashing algorithms as described above. When the users enter their password (usually by authenticating on the application), that input should be re-hashed using the new algorithm. Defenders should expire the users' current password and require them to enter a new one, so that any older (less secure) hashes of their password are no longer useful to an attacker.

However, this means that old (less secure) password hashes will be stored in the database until the user logs in. You can take one of two approaches to avoid this dilemma.

Upgrade Method One: Expire and delete the password hashes of users who have been inactive for an extended period and require them to reset their passwords to login again. Although secure, this approach is not particularly user-friendly. Expiring the passwords of many users may cause issues for support staff or may be interpreted by users as an indication of a breach.

Upgrade Method Two: Use the existing password hashes as inputs for a more secure algorithm. For example, if the application originally stored passwords as `md5($password)`, this could be easily upgraded to `bcrypt(md5($password))`. Layering the hashes avoids the need to know the original password; however, it can make the hashes easier to crack. These hashes should be replaced with direct hashes of the users' passwords next time the user logs in.

Remember that once your password hashing method is selected, it will have to be upgraded in the future, so ensure that upgrading your hashing algorithm is as easy as possible. During the transition period, allow for a mix of old and new hashing algorithms. Using a mix of hashing algorithms is easier if the password hashing algorithm and work factor are stored with the password using a standard format, for example, the [modular PHC string format](https://github.com/P-H-C/phc-string-format/blob/master/phc-sf-spec.md).

### International Characters

Your hashing library must be able to accept a wide range of characters and should be compatible with all Unicode codepoints, so users can use the full range of characters available on modern devices - especially mobile keyboards. They should be able to select passwords from various languages and include pictograms. Prior to hashing the entropy of the user's entry should not be reduced, and password hashing libraries need to be able to use input that may contain a NULL byte.

</section>

<section id="password-storage-translation-panel" className="tabPanel translationPanel contentPanel">

## はじめに

このチートシートでは、認証に使うパスワードを保存するための適切な方法を示します。パスワードを保存する場合、アプリケーションやデータベースが侵害されたとしても、攻撃者から保護されなければなりません。幸いなことに、現在の多くの言語やフレームワークには、パスワードを安全に保存するための組み込み機能があります。

パスワードは決して平文で保存してはいけません。代わりに、Argon2id、bcrypt、PBKDF2 などの強力で低速なハッシュアルゴリズムを使って保護する必要があります。攻撃者がレインボーテーブルのような事前計算済み参照テーブルを使えないようにするため、各パスワードには一意のソルトを追加しなければなりません。SHA-256 のような高速ハッシュアルゴリズムは、攻撃者が大量の推測を素早く試せるため、パスワード保存には適していません。低速でメモリハードなアルゴリズムを使うことで、総当たり攻撃は大幅に難しく、高コストで、時間のかかるものになります。

推奨事項をまとめると次のとおりです。

- **[Argon2id](#argon2id) を使用し、最低構成として 19 MiB のメモリ、反復回数 2、並列度 1 を設定します。**
- **[Argon2id](#argon2id) が利用できない場合は [scrypt](#scrypt) を使用し、最低でも CPU/メモリコストパラメータ (2^17)、ブロックサイズ 8 (1024 バイト)、並列化パラメータ 1 を設定します。**
- **[bcrypt](#bcrypt) を使うレガシーシステムでは、work factor を 10 以上にし、パスワードを 72 バイト以下に制限します。**
- **FIPS-140 準拠が必要な場合は、[PBKDF2](#pbkdf2) を work factor 600,000 以上で使用し、内部ハッシュ関数を HMAC-SHA-256 に設定します。**
- **多層防御を追加するために [pepper](#peppering) の使用を検討します。ただし、pepper 単独では追加の安全特性は得られません。**

## 背景

### ハッシュ化と暗号化

ハッシュ化と暗号化はいずれも機微データの保護に役立ちますが、ほぼすべての状況で、**パスワードは暗号化や平文保存ではなく、Argon2id、bcrypt、PBKDF2 などの現在の適応的なハッシュアルゴリズムを使って安全にハッシュ化するべきです。**

**ハッシュ化は一方向関数**であり、ハッシュを「復号」して元の平文値を得ることはできないため、パスワード検証には最も適切な方法です。攻撃者がハッシュ化されたパスワードを入手しても、それを使って被害者としてログインすることはできません。

**暗号化は双方向関数**であるため、攻撃者は暗号化されたデータから元の平文を取り出せます。暗号化は、利用者のプロフィールで平文表示する必要がある住所のようなデータの保存には使えます。住所をハッシュ化しても、判読できない値になるだけです。

パスワードに暗号化を使うべきなのは、元の平文パスワードを取得する必要がある例外的な場合だけです。たとえば、OpenID Connect (OIDC) のようなプログラム的なアクセス許可の現在の方法をサポートしていない別システムに対して、アプリケーションがそのパスワードで認証しなければならない場合が該当します。可能な限り、パスワードを暗号化形式で保存する必要がない別のアーキテクチャを使用するべきです。

暗号化に関する追加のガイダンスについては、[Cryptographic Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html) を参照してください。

### パスワードハッシュが解読され得る場合

**強力なパスワードを現在のハッシュアルゴリズムとハッシュ化のベストプラクティスで保存していれば、攻撃者が解読することは実質的に不可能であるべきです。** アプリケーション所有者には、現在のハッシュアルゴリズムを選択する責任があります。

ただし、状況によっては、攻撃者が次の手順でハッシュを「解読」できる場合があります。

- 被害者が選んだと思われるパスワードを選択する (例: `password1!`)
- ハッシュを計算する
- 計算したハッシュを被害者のハッシュと比較する。一致した場合、ハッシュの「解読」に成功し、そのパスワードの平文値を知ったことになります。

通常、攻撃者は次のような多数の候補パスワードのリストを使って、この処理を繰り返します。

- 他の侵害済みサイトから得たパスワードリスト
- 総当たり (あらゆる候補を試す)
- 一般的なパスワードの辞書やワードリスト

順列の数は膨大になり得ますが、GPU などの高速ハードウェアや、多数のサーバを借りられるクラウドサービスを使えば、攻撃者がパスワード解読に成功するためのコストは比較的小さくなります。これは、ハッシュ化のベストプラクティスが守られていない場合に特に当てはまります。

## パスワード保存を強化する方法

### ソルト

ソルトは、ハッシュ化処理の一部として各パスワードに追加される、一意でランダムに生成された文字列です。ソルトは利用者ごとに一意であるため、攻撃者はハッシュを一度計算して保存済みのすべてのハッシュと比較するのではなく、それぞれのソルトを使ってハッシュを一つずつ解読しなければなりません。必要な時間はハッシュ数に正比例して増えるため、大量のハッシュを解読することは大幅に難しくなります。

ソルトは、レインボーテーブルやデータベースベースの参照を使って攻撃者がハッシュを事前計算することも防ぎます。さらに、同じパスワードであってもソルトが異なればハッシュも異なるため、ハッシュを解読しない限り、二人の利用者が同じパスワードを使っているかどうかを判断できません。

アルゴリズムや仕様のレベルでは、[Argon2id](#argon2id)、[bcrypt](#bcrypt)、[PBKDF2](#pbkdf2) などの現在のパスワードハッシュ関数は、呼び出し側がソルトを提供することを要求します。ただし、広く使われている実装やライブラリの多くは、内部でソルトを自動的に生成して管理します。そのため、これらのライブラリを正しく使っている限り、アプリケーション開発者がソルト生成を手作業で扱う必要は通常ありません。

### Peppering

[Peppering](https://datatracker.ietf.org/doc/html/draft-ietf-kitten-password-storage-07#section-4.2) は、ソルトに加えて追加の保護層を提供するために使える戦略の一種です。たとえば攻撃者が SQL インジェクション脆弱性を悪用した、またはデータベースのバックアップを入手したなど、データベースだけにアクセスできる場合に、ハッシュを解読できないようにします。

#### peppering 戦略の共通要件

- pepper はパスワードソルトのように個々のパスワードに対して*一意*ではなく、**保存済みパスワード間で共有**されます。
- パスワードソルトとは異なり、pepper は公開されるべきではなく、**生成されたハッシュと一緒に保存してはいけません**。pepper はパスワードデータベースとは別に保存するべきです。
- pepper は秘密情報であり、「シークレット保管庫」や HSM (Hardware Security Module) に保存するべきです。秘密情報の安全な保存について詳しくは、[Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html) を参照してください。
- pepper が侵害された場合、その pepper は変更しなければなりません。pepper は利用者のパスワードを知らなければ変更できません。そのため、pepper を変更するには、以前の pepper で保護されていたパスワードを持つすべての利用者にパスワードリセットを強制する必要があります。

#### ハッシュ化前の pepper

この戦略では、パスワードハッシュアルゴリズムでハッシュ化する前に pepper をパスワードへ追加します。計算されたハッシュはデータベースに保存されます。この場合、pepper は安全に生成されたランダム値であるべきです。ランダム値を安全に生成する方法について詳しくは、[Cryptographic_Storage_Cheat_Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html#secure-random-number-generation) を参照してください。

#### ハッシュ化後の pepper

この戦略では、通常どおりパスワードハッシュアルゴリズムでパスワードをハッシュ化します。その結果得られたパスワードハッシュを、データベースに保存する前に HMAC (希望する出力長に応じて HMAC-SHA256 や HMAC-SHA512 など) でもう一度ハッシュ化します。この場合、pepper は HMAC キーとして機能するため、HMAC アルゴリズムの要件に従って生成するべきです。

### Work Factor の使用

work factor は、各パスワードに対して実行されるハッシュアルゴリズムの反復回数です。通常、実際には `2^work` 回の反復です。work factor は一般にハッシュ出力の中に保存されます。work factor はハッシュ計算の計算コストを高め、それによって攻撃者がパスワードハッシュの解読を試みる速度を下げたり、コストを上げたりします。

work factor を選ぶ際は、セキュリティとパフォーマンスのバランスを取ります。work factor を高くすると攻撃者がハッシュを解読することは難しくなりますが、ログイン試行の検証処理も遅くなります。work factor が高すぎるとアプリケーションの性能が低下し、攻撃者が大量のログイン試行でサーバの CPU を枯渇させるサービス拒否攻撃に悪用できる可能性があります。

理想的な work factor に絶対的な正解はありません。サーバの性能とアプリケーションの利用者数に依存します。最適な work factor を判断するには、アプリケーションで使う具体的なサーバ上で実験する必要があります。一般的な目安として、ハッシュ計算は 1 秒未満で完了するべきです。

#### Work Factor のアップグレード

work factor を持つ主な利点の一つは、ハードウェアがより強力かつ安価になるにつれて、時間とともに値を上げられることです。

work factor をアップグレードする最も一般的な方法は、利用者が次に認証するまで待ち、そのパスワードを新しい work factor で再ハッシュすることです。異なるハッシュは異なる work factor を持つことになり、利用者がアプリケーションに再度ログインしなければハッシュがアップグレードされない可能性があります。アプリケーションによっては、古く安全性の低いハッシュを保存し続けることを避けるため、古いパスワードハッシュを削除し、次回ログイン時にパスワードリセットを要求することが適切な場合があります。

## パスワードハッシュアルゴリズム

現在のハッシュアルゴリズムの中には、パスワードを安全に保存するために特別に設計されたものがあります。これは、それらが低速であるべきこと、つまり高速に設計された MD5 や SHA-1 のようなアルゴリズムとは異なること、また work factor を変更することで低速さを調整できることを意味します。

アプリケーションが使用しているパスワードハッシュアルゴリズムを隠す必要はありません。適切な構成パラメータで現在のパスワードハッシュアルゴリズムを使っているなら、どのパスワードハッシュアルゴリズムを使用しているかを公開し、[こちら](https://pulse.michalspacek.cz/passwords/storages)に掲載しても安全であるべきです。

パスワードハッシュアルゴリズムを選ぶ際、開発者は GPU ベースの攻撃とメモリベースの攻撃の両方に耐えるよう設計された現在のアルゴリズムを優先するべきです。利用可能であれば、新規アプリケーションには新しいアルゴリズムを選ぶべきです。一方で、古いアルゴリズムも、適切に構成されたレガシーシステムでは引き続き許容される場合があります。

検討するべきハッシュアルゴリズムは三つあります。

### Argon2id

[Argon2](https://en.wikipedia.org/wiki/Argon2) は 2015 年の [Password Hashing Competition](https://en.wikipedia.org/wiki/Password_Hashing_Competition) の勝者です。三つの Argon2 バージョンのうち、サイドチャネル攻撃と GPU ベース攻撃の両方への耐性についてバランスの取れたアプローチを提供するため、Argon2id バリアントを使用します。

他のアルゴリズムのような単純な work factor ではなく、Argon2id には構成可能な三つのパラメータがあります。最低メモリサイズ (m) の基本最小値、最小反復回数 (t)、並列度 (p) です。次の構成設定を推奨します。

これらのパラメータは、パスワードハッシュの計算コストを制御します。メモリ使用量、反復回数、並列度を増やすと、パスワード解読の試行は攻撃者にとって大幅に遅く高コストになります。同時に、適切に調整すれば正当な認証要求では実用的な範囲に留められます。

- m=47104 (46 MiB), t=1, p=1 (Argon2i では使用しない)
- m=19456 (19 MiB), t=2, p=1 (Argon2i では使用しない)
- m=12288 (12 MiB), t=3, p=1
- m=9216 (9 MiB), t=4, p=1
- m=7168 (7 MiB), t=5, p=1

これらの構成設定は同等の防御レベルを提供し、違いは CPU 使用量と RAM 使用量のトレードオフだけです。

### scrypt

[scrypt](http://www.tarsnap.com/scrypt/scrypt.pdf) は、[Colin Percival](https://twitter.com/cperciva) によって作成されたパスワードベースの鍵導出関数です。[Argon2id](#argon2id) がパスワードハッシュ化の最善の選択肢であるべきですが、それが利用できない場合は [scrypt](#scrypt) を使用するべきです。

[Argon2id](#argon2id) と同様に、scrypt には構成可能な三つのパラメータがあります。最小メモリコストパラメータ (N)、ブロックサイズ (r)、並列度 (p) です。次のいずれかの設定を使用します。

- N=2^17 (128 MiB), r=8 (1024 bytes), p=1
- N=2^16 (64 MiB), r=8 (1024 bytes), p=2
- N=2^15 (32 MiB), r=8 (1024 bytes), p=3
- N=2^14 (16 MiB), r=8 (1024 bytes), p=5
- N=2^13 (8 MiB), r=8 (1024 bytes), p=10

これらの構成設定は同程度の最小防御レベルを提供し、主なトレードオフは並列度と RAM 使用量の間にあります。

### bcrypt

[bcrypt](https://en.wikipedia.org/wiki/bcrypt) パスワードハッシュ関数は、Argon2 と scrypt が利用できないレガシーシステムでのみ、パスワード保存に使用するべきです。

work factor は検証サーバの性能が許す限り大きくし、最低でも 10 にするべきです。

#### bcrypt の入力制限

bcrypt は[ほとんどの実装](https://security.stackexchange.com/questions/39849/does-bcrypt-have-a-maximum-password-length)で入力長の最大値が 72 バイトです。そのため、パスワードの最大長を 72 バイトに制限するべきです。使用中の bcrypt 実装にそれより小さい制限がある場合は、その制限以下にします。

#### bcrypt でパスワードを事前ハッシュ化する

代替アプローチとして、利用者が入力したパスワードを SHA-2、HMAC、BLAKE3 などの高速アルゴリズムで事前にハッシュ化し、その結果のハッシュ値を bcrypt でハッシュ化する方法があります (つまり `bcrypt(H($password)), $salt, $cost)`)。これは、ハッシュ出力値に含まれる NULL バイトや [password shucking](https://www.youtube.com/watch?v=OQD3qDYMyYQ) のため、**危険**になる可能性があります。

元の bcrypt は NULL 終端のパスワード文字列を想定しています。これは、ハッシュ値の最初の NULL バイトまでしか使われないことを意味します。(`H($password)[0] == 0` の場合、`bcrypt(H($password)), $salt, $cost) == bcrypt("", $salt, $cost)`) これにより、[bcrypt と他のハッシュ関数を組み合わせる](https://blog.ircmaxell.com/2015/03/security-issue-combining-bcrypt-with.html)際に衝突を見つけやすくなります。base64 のような方法でハッシュ値を表示可能な文字列にエンコードすれば回避できます。base64 はハッシュ値の長さを 72 文字より長くする可能性があるため、SHA-512 のような大きなハッシュ値では少し切り捨てが発生しますが、これは[無視できる程度](https://soatok.blog/2024/11/27/beyond-bcrypt/)です。

password shucking は、`bcrypt(base64(H($password))), $salt, $cost) == bcrypt(base64($leaked_hash), $salt, $cost)` を確認するのが容易であるという事実を利用します。内側のハッシュ関数 `H` がどこか別の場所で同じパスワードに使われていて、それが攻撃者に知られている場合、パスワード解読はハッシュ関数 `H` を破ることに単純化される可能性があります。単純な SHA-512 だけを使うこと、つまり `bcrypt(base64(sha512($password))), $salt, $cost)` は**危険な慣行**であり、純粋な SHA-512 だけを使うのと同程度の安全性しかありません。password shucking は、侵害データベースやレインボーテーブルを通じて、漏えいしたハッシュが攻撃者に知られている場合にのみ成立します。password shucking を緩和するには [pepper](#peppering) を使用できます。

まとめると、bcrypt を使わなければならず、かつパスワードを事前ハッシュ化するべき場合は、`bcrypt(base64(hmac-sha384(data:$password, key:$pepper)), $salt, $cost)` を実行し、pepper はデータベースに保存しないようにします。

### PBKDF2

[PBKDF2](https://en.wikipedia.org/wiki/PBKDF2) は [NIST](https://pages.nist.gov/800-63-3/sp800-63b.html#memsecretver) によって推奨されており、FIPS-140 検証済み実装があるため、それらが必要な場合には優先するべきアルゴリズムです。

PBKDF2 アルゴリズムでは、HMAC やその他のさまざまなハッシュアルゴリズムなど、内部ハッシュアルゴリズムを選択する必要があります。HMAC-SHA-256 は広くサポートされており、NIST によって推奨されています。

PBKDF2 の work factor は反復回数として実装されます。この値は、使用する内部ハッシュアルゴリズムに応じて異なる設定にするべきです。

- PBKDF2-HMAC-SHA256: 600,000 iterations (推奨)
- PBKDF2-HMAC-SHA512: 220,000 iterations
- PBKDF2-HMAC-SHA1: 1,400,000 iterations - **レガシーのみ**。新規システムでは選択しないでください。NIST SP 800-131A Rev. 2 は、2030 年以降の新規利用に SHA-1 を認めていません。

### Parallel PBKDF2

- PPBKDF2-SHA512: cost 2
- PPBKDF2-SHA256: cost 5
- PPBKDF2-SHA1: cost 10

これらの構成設定は、提供する防御の点で同等です。([2022 年 12 月時点の数値。RTX 4000 GPU のテストに基づく](https://tobtu.com/minimum-password-settings/))

#### PBKDF2 の事前ハッシュ化

PBKDF2 を HMAC とともに使用し、パスワードがハッシュ関数のブロックサイズ (SHA-256 では 64 バイト) より長い場合、パスワードは自動的に事前ハッシュ化されます。たとえば、パスワード "This is a password longer than 512 bits which is the block size of SHA-256" は、次のハッシュ値 (16 進数) に変換されます: `fa91498c139805af73f7ba275cca071e78d78675027000c99a9925e2ec92eedd`。

PBKDF2 の優れた実装は、高コストな反復ハッシュ化フェーズの前に事前ハッシュ化を実行します。ただし、一部の実装は各反復で変換を実行するため、長いパスワードのハッシュ化が短いパスワードより大幅に高コストになることがあります。利用者が非常に長いパスワードを入力できる場合、2013 年に [Django](https://www.djangoproject.com/weblog/2013/sep/15/security/) で公開されたもののような、潜在的なサービス拒否脆弱性が発生する可能性があります。手動の事前ハッシュ化によりこのリスクを減らせますが、事前ハッシュ化ステップに [salt](#salting) を追加する必要があります。

## レガシーハッシュのアップグレード

MD5 や SHA-1 など安全性の低いハッシュアルゴリズムを使う古いアプリケーションは、上記の現在のパスワードハッシュアルゴリズムへアップグレードできます。利用者がパスワードを入力したとき、通常はアプリケーションで認証するときに、その入力を新しいアルゴリズムで再ハッシュするべきです。防御側は利用者の現在のパスワードを失効させ、新しいパスワードを入力するよう要求するべきです。そうすることで、古い安全性の低いパスワードハッシュが攻撃者にとって有用でなくなります。

しかしこれは、利用者がログインするまで、古い安全性の低いパスワードハッシュがデータベースに保存され続けることを意味します。このジレンマを避けるには、二つのアプローチがあります。

アップグレード方法 1: 長期間非アクティブな利用者のパスワードハッシュを失効・削除し、再ログインするためにパスワードをリセットするよう要求します。これは安全ですが、特に利用者に優しい方法ではありません。多数の利用者のパスワードを失効させると、サポート担当者に問題が発生したり、利用者に侵害の兆候だと解釈されたりする可能性があります。

アップグレード方法 2: 既存のパスワードハッシュを、より安全なアルゴリズムへの入力として使用します。たとえば、アプリケーションが元々パスワードを `md5($password)` として保存していた場合、これは `bcrypt(md5($password))` に容易にアップグレードできます。ハッシュを重ねることで元のパスワードを知る必要はなくなりますが、ハッシュを解読しやすくする可能性があります。これらのハッシュは、次回利用者がログインしたときに、利用者のパスワードを直接ハッシュ化したものに置き換えるべきです。

パスワードハッシュ方式を選択した後も将来アップグレードが必要になることを忘れないでください。そのため、ハッシュアルゴリズムのアップグレードをできるだけ容易にしておきます。移行期間中は、新旧のハッシュアルゴリズムが混在することを許容します。パスワードハッシュアルゴリズムと work factor をパスワードとともに標準形式で保存しておくと、複数のハッシュアルゴリズムを混在させやすくなります。例として、[modular PHC string format](https://github.com/P-H-C/phc-string-format/blob/master/phc-sf-spec.md) があります。

### 国際文字

ハッシュライブラリは広範な文字を受け付けられる必要があり、すべての Unicode コードポイントと互換性があるべきです。これにより、利用者は現在のデバイス、特にモバイルキーボードで利用できる文字の全範囲を使えます。利用者はさまざまな言語のパスワードを選択し、ピクトグラムを含められるべきです。ハッシュ化の前に利用者入力のエントロピーを減らしてはいけません。また、パスワードハッシュライブラリは NULL バイトを含む可能性のある入力を扱える必要があります。

</section>

<section id="password-storage-bilingual-panel" className="tabPanel bilingualPanel">

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Introduction

This cheat sheet advises you on the proper methods for storing passwords for authentication. When passwords are stored, they must be protected from an attacker even if the application or database is compromised. Fortunately, a majority of modern languages and frameworks provide built-in functionality to help store passwords safely.

Passwords should never be stored in plain text. Instead, they must be protected using strong, slow hashing algorithms such as Argon2id, bcrypt, or PBKDF2. A unique salt must be added to each password to prevent attackers from using precomputed lookup tables like rainbow tables. Fast hashing algorithms such as SHA‑256 are not suitable for password storage because they allow attackers to perform large numbers of guesses quickly. Using slow, memory‑hard algorithms makes brute‑force attacks significantly more difficult, expensive, and time‑consuming.

To sum up our recommendations:

- **Use [Argon2id](#argon2id) with a minimum configuration of 19 MiB of memory, an iteration count of 2, and 1 degree of parallelism.**
- **If [Argon2id](#argon2id) is not available, use [scrypt](#scrypt) with a minimum CPU/memory cost parameter of (2^17), a minimum block size of 8 (1024 bytes), and a parallelization parameter of 1.**
- **For legacy systems using [bcrypt](#bcrypt), use a work factor of 10 or more and with a password limit of 72 bytes.**
- **If FIPS-140 compliance is required, use [PBKDF2](#pbkdf2) with a work factor of 600,000 or more and set with an internal hash function of HMAC-SHA-256.**
- **Consider using a [pepper](#peppering) to provide additional defense in depth (though alone, it provides no additional secure characteristics).**

## Background

### Hashing vs Encryption

Hashing and encryption can keep sensitive data safe, but in almost all circumstances, **Passwords should be securely hashed using modern, adaptive hashing algorithms (e.g., Argon2id, bcrypt, or PBKDF2), rather than encrypted or stored in plaintext.**

Because **hashing is a one-way function** (i.e., it is impossible to "decrypt" a hash and obtain the original plaintext value), it is the most appropriate approach for password validation. Even if an attacker obtains the hashed password, they cannot use it to log in as the victim.

Since **encryption is a two-way function**, attackers can retrieve the original plaintext from the encrypted data. It can be used to store data such as a user's address since this data is displayed in plaintext on the user's profile. Hashing their address would result in a garbled mess.

The only time encryption should be used in passwords is in edge cases where it is necessary to obtain the original plaintext password. This might be necessary if the application needs to use the password to authenticate with another system that does not support a modern way to programmatically grant access, such as OpenID Connect (OIDC). Wherever possible, an alternative architecture should be used to avoid the need to store passwords in an encrypted form.

For further guidance on encryption, see the [Cryptographic Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html).

### When Password Hashes Can Be Cracked

**Strong passwords stored with modern hashing algorithms and using hashing best practices should be effectively impossible for an attacker to crack.** It is your responsibility as an application owner to select a modern hashing algorithm.

However, there are some situations where an attacker can "crack" the hashes in some circumstances by doing the following:

- Selecting a password you think the victim has chosen (e.g.`password1!`)
- Calculating the hash
- Comparing the hash you calculated to the hash of the victim. If they match, you have correctly "cracked" the hash and now know the plaintext value of their password.

Usually, the attacker will repeat this process with a list of large number of potential candidate passwords, such as:

- Lists of passwords obtained from other compromised sites
- Brute force (trying every possible candidate)
- Dictionaries or wordlists of common passwords

While the number of permutations can be enormous, with high speed hardware (such as GPUs) and cloud services with many servers for rent, the cost to an attacker is relatively small to do successful password cracking, especially when best practices for hashing are not followed.

## Methods for Enhancing Password Storage

### Salting

A salt is a unique, randomly generated string that is added to each password as part of the hashing process. As the salt is unique for every user, an attacker has to crack hashes one at a time using the respective salt rather than calculating a hash once and comparing it against every stored hash. This makes cracking large numbers of hashes significantly harder, as the time required grows in direct proportion to the number of hashes.

Salting also protects against an attacker's pre-computing hashes using rainbow tables or database-based lookups. Finally, salting means that it is impossible to determine whether two users have the same password without cracking the hashes, as the different salts will result in different hashes even if the passwords are the same.

At the algorithm and specification level, modern password hashing functions such as [Argon2id](#argon2id), [bcrypt](#bcrypt), and [PBKDF2](#pbkdf2) require the caller to provide a salt.
However, most widely used implementations and libraries automatically generate and manage salts internally, so application developers typically do not need to handle salt generation manually when using these libraries correctly.

### Peppering

[Peppering](https://datatracker.ietf.org/doc/html/draft-ietf-kitten-password-storage-07#section-4.2) is a class of strategies that can be used in addition to salting to provide an additional layer of protection. It prevents an attacker from being able to crack any of the hashes if they only have access to the database, for example, if they have exploited a SQL injection vulnerability or obtained a backup of the database.

#### Common requirements for peppering strategies

- A pepper is **shared between stored passwords**, rather than being *unique* to an individual password like a password salt.
- Unlike a password salt, the pepper should not be public and **should not be stored along with the generated hash**. The pepper should be stored separately from the password database.
- Peppers are secrets and should be stored in "secrets vaults" or HSMs (Hardware Security Modules). See the [Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html) for more information on securely storing secrets.
- In the event of a pepper's compromise, the pepper will have to be changed. Peppers cannot be changed without knowledge of a user's password. Therefore changing a pepper will require forcing all users whose passwords were protected by the previous pepper to reset their passwords.

#### Pre-hashing peppers

In this strategy, a pepper is added to a password before being hashed by a password hashing algorithm. The computed hash is then stored in the database. In this case the pepper should be a random value generated securely. See the [Cryptographic_Storage_Cheat_Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html#secure-random-number-generation) for more information on securely generating random values.

#### Post-hashing peppers

In this strategy, a password is hashed as usual using a password hashing algorithm. The resulting password hash is then hashed again using an HMAC (e.g., HMAC-SHA256, HMAC-SHA512, depending on the desired output length) before storing the resulting hash in the database. In this case the pepper is acting as the HMAC key and should be generated as per requirements of the HMAC algorithm.

### Using Work Factors

 The work factor is the number of iterations of the hashing algorithm that are performed for each password (usually, it's actually `2^work` iterations). The work factor is typically stored in the hash output. It makes calculating the hash more computationally expensive, which in turn reduces the speed and/or increases the cost for which an attacker can attempt to crack the password hash.

When you choose a work factor, strike a balance between security and performance. Though higher work factors make hashes more difficult for an attacker to crack, they will slow down the process of verifying a login attempt. If the work factor is too high, the performance of the application may be degraded, which could be used by an attacker to carry out a denial of service attack by exhausting the server's CPU with a large number of login attempts.

There is no golden rule for the ideal work factor - it will depend on the performance of the server and the number of users on the application. Determining the optimal work factor will require experimentation on the specific server(s) used by the application. As a general rule, calculating a hash should take less than one second.

#### Upgrading the Work Factor

One key advantage of having a work factor is that it can be increased over time as hardware becomes more powerful and cheaper.

The most common approach to upgrading the work factor is to wait until the user next authenticates, then re-hash their password with the new work factor. The different hashes will have different work factors and hashes may never be upgraded if the user doesn't log back into the application. Depending on the application, it may be appropriate to remove the older password hashes and require users to reset their passwords next time they need to login in order to avoid storing older and less secure hashes.

## Password Hashing Algorithms

Some modern hashing algorithms have been specifically designed to securely store passwords. This means that they should be slow (unlike algorithms such as MD5 and SHA-1, which were designed to be fast), and you can change how slow they are by changing the work factor.

You do not need to hide which password hashing algorithm is used by an application. If you utilize a modern password hashing algorithm with proper configuration parameters, it should be safe to state in public which password hashing algorithms are in use and be listed [here](https://pulse.michalspacek.cz/passwords/storages).

When selecting a password hashing algorithm, developers should prefer modern algorithms that are designed to resist both GPU-based and memory-based attacks.
Where available, newer algorithms should be chosen for new applications, while older algorithms may still be acceptable for legacy systems with appropriate configuration.

Three hashing algorithms that should be considered.

### Argon2id

[Argon2](https://en.wikipedia.org/wiki/Argon2) was the winner of the 2015 [Password Hashing Competition](https://en.wikipedia.org/wiki/Password_Hashing_Competition). Out of the three Argon2 versions, use the  Argon2id variant since it provides a balanced approach to resisting both side-channel and GPU-based attacks.

Rather than a simple work factor like other algorithms, Argon2id has three different parameters that can be configured: the base minimum of the minimum memory size (m), the minimum number of iterations (t), and the degree of parallelism (p). We recommend the following configuration settings:

These parameters control how computationally expensive it is to compute a password hash.
Increasing memory usage, iteration count, or parallelism makes password cracking attempts significantly slower and more costly for attackers, while still remaining practical for legitimate authentication requests when tuned appropriately.

- m=47104 (46 MiB), t=1, p=1 (Do not use with Argon2i)
- m=19456 (19 MiB), t=2, p=1 (Do not use with Argon2i)
- m=12288 (12 MiB), t=3, p=1
- m=9216 (9 MiB), t=4, p=1
- m=7168 (7 MiB), t=5, p=1

These configuration settings provide an equal level of defense, and the only difference is a trade off between CPU and RAM usage.

### scrypt

[scrypt](http://www.tarsnap.com/scrypt/scrypt.pdf) is a password-based key derivation function created by [Colin Percival](https://twitter.com/cperciva). While [Argon2id](#argon2id) should be the best choice for password hashing, [scrypt](#scrypt) should be used when the former is not available.

Like [Argon2id](#argon2id), scrypt has three parameters that can be configured: the minimum memory cost parameter (N), the blocksize (r), and the degree of parallelism (p). Use one of the following settings:

- N=2^17 (128 MiB), r=8 (1024 bytes), p=1
- N=2^16 (64 MiB), r=8 (1024 bytes), p=2
- N=2^15 (32 MiB), r=8 (1024 bytes), p=3
- N=2^14 (16 MiB), r=8 (1024 bytes), p=5
- N=2^13 (8 MiB), r=8 (1024 bytes), p=10

These configuration settings provide a similar minimal level of defense, with the main trade-off between parallelism and RAM usage.

### bcrypt

The [bcrypt](https://en.wikipedia.org/wiki/bcrypt) password hashing function **should only** be used for password storage in legacy systems where Argon2 and scrypt are not available.

The work factor should be as large as verification server performance will allow, with a minimum of 10.

#### Input Limits of bcrypt

bcrypt has a maximum length input length of 72 bytes [for most implementations](https://security.stackexchange.com/questions/39849/does-bcrypt-have-a-maximum-password-length), so you should enforce a maximum password length of 72 bytes (or less if the bcrypt implementation in use has smaller limits).

#### Pre-Hashing Passwords with bcrypt

An alternative approach is to pre-hash the user-supplied password with a fast algorithm such as SHA-2, HMAC, or BLAKE3 and then to hash the resulting hash value with bcrypt (i.e., `bcrypt(H($password)), $salt, $cost)`)..
This can be **dangerous** because of null bytes in the hash output value and because of [password shucking](https://www.youtube.com/watch?v=OQD3qDYMyYQ).

The original bcrypt expects a null terminated password string, this means that the hash value will only be used to the first null byte in the hash value. (`bcrypt(H($password)), $salt, $cost) == bcrypt("", $salt, $cost)` if `H($password)[0] == 0`)
This increases the chance of finding a collision when [combining bcrypt with other hash functions](https://blog.ircmaxell.com/2015/03/security-issue-combining-bcrypt-with.html) and can be avoided by encoding the hash value to printable string with something like base64.
base64 can increases the length of the hash value above 72 characters and so there is a bit of truncation for large hash values from hashes like SHA-512, this is [negligible](https://soatok.blog/2024/11/27/beyond-bcrypt/).

Password shucking uses the fact, that it is easy to check if  `bcrypt(base64(H($password))), $salt, $cost) == bcrypt(base64($leaked_hash), $salt, $cost)`.
If the inner hash function `H` is used with the same password somewhere else and known to an attacker cracking the password can be reduced to breaking the hash function `H`.
Just using pure SHA-512, ( i.e. `bcrypt(base64(sha512($password))), $salt, $cost)`) is a **dangerous practice** and is as secure as just using pure SHA-512.
Password shucking only works if a leaked hash is known to the attacker, either through a breach database or rainbow tables.
To mitigate password shucking a [pepper](#peppering) can be used.

To summarize if bcrypt has to be used and the password should to be pre-hashed you should do `bcrypt(base64(hmac-sha384(data:$password, key:$pepper)), $salt, $cost)` and store the pepper not in the database.

### PBKDF2

Since [PBKDF2](https://en.wikipedia.org/wiki/PBKDF2) is recommended by [NIST](https://pages.nist.gov/800-63-3/sp800-63b.html#memsecretver) and has FIPS-140 validated implementations, so it should be the preferred algorithm when these are required.

The PBKDF2 algorithm requires that you select an internal hashing algorithm such as an HMAC or a variety of other hashing algorithms. HMAC-SHA-256 is widely supported and is recommended by NIST.

The work factor for PBKDF2 is implemented through an iteration count, which should set differently based on the internal hashing algorithm used.

- PBKDF2-HMAC-SHA256: 600,000 iterations (recommended)
- PBKDF2-HMAC-SHA512: 220,000 iterations
- PBKDF2-HMAC-SHA1: 1,400,000 iterations — **legacy only**, do not select for new systems. NIST SP 800-131A Rev. 2 disallows SHA-1 for new use after 2030.

### Parallel PBKDF2

- PPBKDF2-SHA512: cost 2
- PPBKDF2-SHA256: cost 5
- PPBKDF2-SHA1: cost 10

These configuration settings are equivalent in the defense they provide. ([Number as of december 2022, based on testing of RTX 4000 GPUs](https://tobtu.com/minimum-password-settings/))

#### PBKDF2 Pre-Hashing

When PBKDF2 is used with an HMAC, and the password is longer than the hash function's block size (64 bytes for SHA-256), the password will be automatically pre-hashed. For example, the password "This is a password longer than 512 bits which is the block size of SHA-256" is converted to the hash value (in hex): `fa91498c139805af73f7ba275cca071e78d78675027000c99a9925e2ec92eedd`.

Good implementations of PBKDF2 perform pre-hashing before the expensive iterated hashing phase. However, some implementations perform the conversion on each iteration, which can make hashing long passwords significantly more expensive than hashing short passwords. When users supply very long passwords, a potential denial of service vulnerability could occur, such as the one published in [Django](https://www.djangoproject.com/weblog/2013/sep/15/security/) during 2013. Manual pre-hashing can reduce this risk but requires adding a [salt](#salting) to the pre-hash step.

## Upgrading Legacy Hashes

Older applications that use less secure hashing algorithms, such as MD5 or SHA-1, can be upgraded to modern password hashing algorithms as described above. When the users enter their password (usually by authenticating on the application), that input should be re-hashed using the new algorithm. Defenders should expire the users' current password and require them to enter a new one, so that any older (less secure) hashes of their password are no longer useful to an attacker.

However, this means that old (less secure) password hashes will be stored in the database until the user logs in. You can take one of two approaches to avoid this dilemma.

Upgrade Method One: Expire and delete the password hashes of users who have been inactive for an extended period and require them to reset their passwords to login again. Although secure, this approach is not particularly user-friendly. Expiring the passwords of many users may cause issues for support staff or may be interpreted by users as an indication of a breach.

Upgrade Method Two: Use the existing password hashes as inputs for a more secure algorithm. For example, if the application originally stored passwords as `md5($password)`, this could be easily upgraded to `bcrypt(md5($password))`. Layering the hashes avoids the need to know the original password; however, it can make the hashes easier to crack. These hashes should be replaced with direct hashes of the users' passwords next time the user logs in.

Remember that once your password hashing method is selected, it will have to be upgraded in the future, so ensure that upgrading your hashing algorithm is as easy as possible. During the transition period, allow for a mix of old and new hashing algorithms. Using a mix of hashing algorithms is easier if the password hashing algorithm and work factor are stored with the password using a standard format, for example, the [modular PHC string format](https://github.com/P-H-C/phc-string-format/blob/master/phc-sf-spec.md).

### International Characters

Your hashing library must be able to accept a wide range of characters and should be compatible with all Unicode codepoints, so users can use the full range of characters available on modern devices - especially mobile keyboards. They should be able to select passwords from various languages and include pictograms. Prior to hashing the entropy of the user's entry should not be reduced, and password hashing libraries need to be able to use input that may contain a NULL byte.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## はじめに

このチートシートでは、認証に使うパスワードを保存するための適切な方法を示します。パスワードを保存する場合、アプリケーションやデータベースが侵害されたとしても、攻撃者から保護されなければなりません。幸いなことに、現在の多くの言語やフレームワークには、パスワードを安全に保存するための組み込み機能があります。

パスワードは決して平文で保存してはいけません。代わりに、Argon2id、bcrypt、PBKDF2 などの強力で低速なハッシュアルゴリズムを使って保護する必要があります。攻撃者がレインボーテーブルのような事前計算済み参照テーブルを使えないようにするため、各パスワードには一意のソルトを追加しなければなりません。SHA-256 のような高速ハッシュアルゴリズムは、攻撃者が大量の推測を素早く試せるため、パスワード保存には適していません。低速でメモリハードなアルゴリズムを使うことで、総当たり攻撃は大幅に難しく、高コストで、時間のかかるものになります。

推奨事項をまとめると次のとおりです。

- **[Argon2id](#argon2id) を使用し、最低構成として 19 MiB のメモリ、反復回数 2、並列度 1 を設定します。**
- **[Argon2id](#argon2id) が利用できない場合は [scrypt](#scrypt) を使用し、最低でも CPU/メモリコストパラメータ (2^17)、ブロックサイズ 8 (1024 バイト)、並列化パラメータ 1 を設定します。**
- **[bcrypt](#bcrypt) を使うレガシーシステムでは、work factor を 10 以上にし、パスワードを 72 バイト以下に制限します。**
- **FIPS-140 準拠が必要な場合は、[PBKDF2](#pbkdf2) を work factor 600,000 以上で使用し、内部ハッシュ関数を HMAC-SHA-256 に設定します。**
- **多層防御を追加するために [pepper](#peppering) の使用を検討します。ただし、pepper 単独では追加の安全特性は得られません。**

## 背景

### ハッシュ化と暗号化

ハッシュ化と暗号化はいずれも機微データの保護に役立ちますが、ほぼすべての状況で、**パスワードは暗号化や平文保存ではなく、Argon2id、bcrypt、PBKDF2 などの現在の適応的なハッシュアルゴリズムを使って安全にハッシュ化するべきです。**

**ハッシュ化は一方向関数**であり、ハッシュを「復号」して元の平文値を得ることはできないため、パスワード検証には最も適切な方法です。攻撃者がハッシュ化されたパスワードを入手しても、それを使って被害者としてログインすることはできません。

**暗号化は双方向関数**であるため、攻撃者は暗号化されたデータから元の平文を取り出せます。暗号化は、利用者のプロフィールで平文表示する必要がある住所のようなデータの保存には使えます。住所をハッシュ化しても、判読できない値になるだけです。

パスワードに暗号化を使うべきなのは、元の平文パスワードを取得する必要がある例外的な場合だけです。たとえば、OpenID Connect (OIDC) のようなプログラム的なアクセス許可の現在の方法をサポートしていない別システムに対して、アプリケーションがそのパスワードで認証しなければならない場合が該当します。可能な限り、パスワードを暗号化形式で保存する必要がない別のアーキテクチャを使用するべきです。

暗号化に関する追加のガイダンスについては、[Cryptographic Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html) を参照してください。

### パスワードハッシュが解読され得る場合

**強力なパスワードを現在のハッシュアルゴリズムとハッシュ化のベストプラクティスで保存していれば、攻撃者が解読することは実質的に不可能であるべきです。** アプリケーション所有者には、現在のハッシュアルゴリズムを選択する責任があります。

ただし、状況によっては、攻撃者が次の手順でハッシュを「解読」できる場合があります。

- 被害者が選んだと思われるパスワードを選択する (例: `password1!`)
- ハッシュを計算する
- 計算したハッシュを被害者のハッシュと比較する。一致した場合、ハッシュの「解読」に成功し、そのパスワードの平文値を知ったことになります。

通常、攻撃者は次のような多数の候補パスワードのリストを使って、この処理を繰り返します。

- 他の侵害済みサイトから得たパスワードリスト
- 総当たり (あらゆる候補を試す)
- 一般的なパスワードの辞書やワードリスト

順列の数は膨大になり得ますが、GPU などの高速ハードウェアや、多数のサーバを借りられるクラウドサービスを使えば、攻撃者がパスワード解読に成功するためのコストは比較的小さくなります。これは、ハッシュ化のベストプラクティスが守られていない場合に特に当てはまります。

## パスワード保存を強化する方法

### ソルト

ソルトは、ハッシュ化処理の一部として各パスワードに追加される、一意でランダムに生成された文字列です。ソルトは利用者ごとに一意であるため、攻撃者はハッシュを一度計算して保存済みのすべてのハッシュと比較するのではなく、それぞれのソルトを使ってハッシュを一つずつ解読しなければなりません。必要な時間はハッシュ数に正比例して増えるため、大量のハッシュを解読することは大幅に難しくなります。

ソルトは、レインボーテーブルやデータベースベースの参照を使って攻撃者がハッシュを事前計算することも防ぎます。さらに、同じパスワードであってもソルトが異なればハッシュも異なるため、ハッシュを解読しない限り、二人の利用者が同じパスワードを使っているかどうかを判断できません。

アルゴリズムや仕様のレベルでは、[Argon2id](#argon2id)、[bcrypt](#bcrypt)、[PBKDF2](#pbkdf2) などの現在のパスワードハッシュ関数は、呼び出し側がソルトを提供することを要求します。ただし、広く使われている実装やライブラリの多くは、内部でソルトを自動的に生成して管理します。そのため、これらのライブラリを正しく使っている限り、アプリケーション開発者がソルト生成を手作業で扱う必要は通常ありません。

### Peppering

[Peppering](https://datatracker.ietf.org/doc/html/draft-ietf-kitten-password-storage-07#section-4.2) は、ソルトに加えて追加の保護層を提供するために使える戦略の一種です。たとえば攻撃者が SQL インジェクション脆弱性を悪用した、またはデータベースのバックアップを入手したなど、データベースだけにアクセスできる場合に、ハッシュを解読できないようにします。

#### peppering 戦略の共通要件

- pepper はパスワードソルトのように個々のパスワードに対して*一意*ではなく、**保存済みパスワード間で共有**されます。
- パスワードソルトとは異なり、pepper は公開されるべきではなく、**生成されたハッシュと一緒に保存してはいけません**。pepper はパスワードデータベースとは別に保存するべきです。
- pepper は秘密情報であり、「シークレット保管庫」や HSM (Hardware Security Module) に保存するべきです。秘密情報の安全な保存について詳しくは、[Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html) を参照してください。
- pepper が侵害された場合、その pepper は変更しなければなりません。pepper は利用者のパスワードを知らなければ変更できません。そのため、pepper を変更するには、以前の pepper で保護されていたパスワードを持つすべての利用者にパスワードリセットを強制する必要があります。

#### ハッシュ化前の pepper

この戦略では、パスワードハッシュアルゴリズムでハッシュ化する前に pepper をパスワードへ追加します。計算されたハッシュはデータベースに保存されます。この場合、pepper は安全に生成されたランダム値であるべきです。ランダム値を安全に生成する方法について詳しくは、[Cryptographic_Storage_Cheat_Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html#secure-random-number-generation) を参照してください。

#### ハッシュ化後の pepper

この戦略では、通常どおりパスワードハッシュアルゴリズムでパスワードをハッシュ化します。その結果得られたパスワードハッシュを、データベースに保存する前に HMAC (希望する出力長に応じて HMAC-SHA256 や HMAC-SHA512 など) でもう一度ハッシュ化します。この場合、pepper は HMAC キーとして機能するため、HMAC アルゴリズムの要件に従って生成するべきです。

### Work Factor の使用

work factor は、各パスワードに対して実行されるハッシュアルゴリズムの反復回数です。通常、実際には `2^work` 回の反復です。work factor は一般にハッシュ出力の中に保存されます。work factor はハッシュ計算の計算コストを高め、それによって攻撃者がパスワードハッシュの解読を試みる速度を下げたり、コストを上げたりします。

work factor を選ぶ際は、セキュリティとパフォーマンスのバランスを取ります。work factor を高くすると攻撃者がハッシュを解読することは難しくなりますが、ログイン試行の検証処理も遅くなります。work factor が高すぎるとアプリケーションの性能が低下し、攻撃者が大量のログイン試行でサーバの CPU を枯渇させるサービス拒否攻撃に悪用できる可能性があります。

理想的な work factor に絶対的な正解はありません。サーバの性能とアプリケーションの利用者数に依存します。最適な work factor を判断するには、アプリケーションで使う具体的なサーバ上で実験する必要があります。一般的な目安として、ハッシュ計算は 1 秒未満で完了するべきです。

#### Work Factor のアップグレード

work factor を持つ主な利点の一つは、ハードウェアがより強力かつ安価になるにつれて、時間とともに値を上げられることです。

work factor をアップグレードする最も一般的な方法は、利用者が次に認証するまで待ち、そのパスワードを新しい work factor で再ハッシュすることです。異なるハッシュは異なる work factor を持つことになり、利用者がアプリケーションに再度ログインしなければハッシュがアップグレードされない可能性があります。アプリケーションによっては、古く安全性の低いハッシュを保存し続けることを避けるため、古いパスワードハッシュを削除し、次回ログイン時にパスワードリセットを要求することが適切な場合があります。

## パスワードハッシュアルゴリズム

現在のハッシュアルゴリズムの中には、パスワードを安全に保存するために特別に設計されたものがあります。これは、それらが低速であるべきこと、つまり高速に設計された MD5 や SHA-1 のようなアルゴリズムとは異なること、また work factor を変更することで低速さを調整できることを意味します。

アプリケーションが使用しているパスワードハッシュアルゴリズムを隠す必要はありません。適切な構成パラメータで現在のパスワードハッシュアルゴリズムを使っているなら、どのパスワードハッシュアルゴリズムを使用しているかを公開し、[こちら](https://pulse.michalspacek.cz/passwords/storages)に掲載しても安全であるべきです。

パスワードハッシュアルゴリズムを選ぶ際、開発者は GPU ベースの攻撃とメモリベースの攻撃の両方に耐えるよう設計された現在のアルゴリズムを優先するべきです。利用可能であれば、新規アプリケーションには新しいアルゴリズムを選ぶべきです。一方で、古いアルゴリズムも、適切に構成されたレガシーシステムでは引き続き許容される場合があります。

検討するべきハッシュアルゴリズムは三つあります。

### Argon2id

[Argon2](https://en.wikipedia.org/wiki/Argon2) は 2015 年の [Password Hashing Competition](https://en.wikipedia.org/wiki/Password_Hashing_Competition) の勝者です。三つの Argon2 バージョンのうち、サイドチャネル攻撃と GPU ベース攻撃の両方への耐性についてバランスの取れたアプローチを提供するため、Argon2id バリアントを使用します。

他のアルゴリズムのような単純な work factor ではなく、Argon2id には構成可能な三つのパラメータがあります。最低メモリサイズ (m) の基本最小値、最小反復回数 (t)、並列度 (p) です。次の構成設定を推奨します。

これらのパラメータは、パスワードハッシュの計算コストを制御します。メモリ使用量、反復回数、並列度を増やすと、パスワード解読の試行は攻撃者にとって大幅に遅く高コストになります。同時に、適切に調整すれば正当な認証要求では実用的な範囲に留められます。

- m=47104 (46 MiB), t=1, p=1 (Argon2i では使用しない)
- m=19456 (19 MiB), t=2, p=1 (Argon2i では使用しない)
- m=12288 (12 MiB), t=3, p=1
- m=9216 (9 MiB), t=4, p=1
- m=7168 (7 MiB), t=5, p=1

これらの構成設定は同等の防御レベルを提供し、違いは CPU 使用量と RAM 使用量のトレードオフだけです。

### scrypt

[scrypt](http://www.tarsnap.com/scrypt/scrypt.pdf) は、[Colin Percival](https://twitter.com/cperciva) によって作成されたパスワードベースの鍵導出関数です。[Argon2id](#argon2id) がパスワードハッシュ化の最善の選択肢であるべきですが、それが利用できない場合は [scrypt](#scrypt) を使用するべきです。

[Argon2id](#argon2id) と同様に、scrypt には構成可能な三つのパラメータがあります。最小メモリコストパラメータ (N)、ブロックサイズ (r)、並列度 (p) です。次のいずれかの設定を使用します。

- N=2^17 (128 MiB), r=8 (1024 bytes), p=1
- N=2^16 (64 MiB), r=8 (1024 bytes), p=2
- N=2^15 (32 MiB), r=8 (1024 bytes), p=3
- N=2^14 (16 MiB), r=8 (1024 bytes), p=5
- N=2^13 (8 MiB), r=8 (1024 bytes), p=10

これらの構成設定は同程度の最小防御レベルを提供し、主なトレードオフは並列度と RAM 使用量の間にあります。

### bcrypt

[bcrypt](https://en.wikipedia.org/wiki/bcrypt) パスワードハッシュ関数は、Argon2 と scrypt が利用できないレガシーシステムでのみ、パスワード保存に使用するべきです。

work factor は検証サーバの性能が許す限り大きくし、最低でも 10 にするべきです。

#### bcrypt の入力制限

bcrypt は[ほとんどの実装](https://security.stackexchange.com/questions/39849/does-bcrypt-have-a-maximum-password-length)で入力長の最大値が 72 バイトです。そのため、パスワードの最大長を 72 バイトに制限するべきです。使用中の bcrypt 実装にそれより小さい制限がある場合は、その制限以下にします。

#### bcrypt でパスワードを事前ハッシュ化する

代替アプローチとして、利用者が入力したパスワードを SHA-2、HMAC、BLAKE3 などの高速アルゴリズムで事前にハッシュ化し、その結果のハッシュ値を bcrypt でハッシュ化する方法があります (つまり `bcrypt(H($password)), $salt, $cost)`)。これは、ハッシュ出力値に含まれる NULL バイトや [password shucking](https://www.youtube.com/watch?v=OQD3qDYMyYQ) のため、**危険**になる可能性があります。

元の bcrypt は NULL 終端のパスワード文字列を想定しています。これは、ハッシュ値の最初の NULL バイトまでしか使われないことを意味します。(`H($password)[0] == 0` の場合、`bcrypt(H($password)), $salt, $cost) == bcrypt("", $salt, $cost)`) これにより、[bcrypt と他のハッシュ関数を組み合わせる](https://blog.ircmaxell.com/2015/03/security-issue-combining-bcrypt-with.html)際に衝突を見つけやすくなります。base64 のような方法でハッシュ値を表示可能な文字列にエンコードすれば回避できます。base64 はハッシュ値の長さを 72 文字より長くする可能性があるため、SHA-512 のような大きなハッシュ値では少し切り捨てが発生しますが、これは[無視できる程度](https://soatok.blog/2024/11/27/beyond-bcrypt/)です。

password shucking は、`bcrypt(base64(H($password))), $salt, $cost) == bcrypt(base64($leaked_hash), $salt, $cost)` を確認するのが容易であるという事実を利用します。内側のハッシュ関数 `H` がどこか別の場所で同じパスワードに使われていて、それが攻撃者に知られている場合、パスワード解読はハッシュ関数 `H` を破ることに単純化される可能性があります。単純な SHA-512 だけを使うこと、つまり `bcrypt(base64(sha512($password))), $salt, $cost)` は**危険な慣行**であり、純粋な SHA-512 だけを使うのと同程度の安全性しかありません。password shucking は、侵害データベースやレインボーテーブルを通じて、漏えいしたハッシュが攻撃者に知られている場合にのみ成立します。password shucking を緩和するには [pepper](#peppering) を使用できます。

まとめると、bcrypt を使わなければならず、かつパスワードを事前ハッシュ化するべき場合は、`bcrypt(base64(hmac-sha384(data:$password, key:$pepper)), $salt, $cost)` を実行し、pepper はデータベースに保存しないようにします。

### PBKDF2

[PBKDF2](https://en.wikipedia.org/wiki/PBKDF2) は [NIST](https://pages.nist.gov/800-63-3/sp800-63b.html#memsecretver) によって推奨されており、FIPS-140 検証済み実装があるため、それらが必要な場合には優先するべきアルゴリズムです。

PBKDF2 アルゴリズムでは、HMAC やその他のさまざまなハッシュアルゴリズムなど、内部ハッシュアルゴリズムを選択する必要があります。HMAC-SHA-256 は広くサポートされており、NIST によって推奨されています。

PBKDF2 の work factor は反復回数として実装されます。この値は、使用する内部ハッシュアルゴリズムに応じて異なる設定にするべきです。

- PBKDF2-HMAC-SHA256: 600,000 iterations (推奨)
- PBKDF2-HMAC-SHA512: 220,000 iterations
- PBKDF2-HMAC-SHA1: 1,400,000 iterations - **レガシーのみ**。新規システムでは選択しないでください。NIST SP 800-131A Rev. 2 は、2030 年以降の新規利用に SHA-1 を認めていません。

### Parallel PBKDF2

- PPBKDF2-SHA512: cost 2
- PPBKDF2-SHA256: cost 5
- PPBKDF2-SHA1: cost 10

これらの構成設定は、提供する防御の点で同等です。([2022 年 12 月時点の数値。RTX 4000 GPU のテストに基づく](https://tobtu.com/minimum-password-settings/))

#### PBKDF2 の事前ハッシュ化

PBKDF2 を HMAC とともに使用し、パスワードがハッシュ関数のブロックサイズ (SHA-256 では 64 バイト) より長い場合、パスワードは自動的に事前ハッシュ化されます。たとえば、パスワード "This is a password longer than 512 bits which is the block size of SHA-256" は、次のハッシュ値 (16 進数) に変換されます: `fa91498c139805af73f7ba275cca071e78d78675027000c99a9925e2ec92eedd`。

PBKDF2 の優れた実装は、高コストな反復ハッシュ化フェーズの前に事前ハッシュ化を実行します。ただし、一部の実装は各反復で変換を実行するため、長いパスワードのハッシュ化が短いパスワードより大幅に高コストになることがあります。利用者が非常に長いパスワードを入力できる場合、2013 年に [Django](https://www.djangoproject.com/weblog/2013/sep/15/security/) で公開されたもののような、潜在的なサービス拒否脆弱性が発生する可能性があります。手動の事前ハッシュ化によりこのリスクを減らせますが、事前ハッシュ化ステップに [salt](#salting) を追加する必要があります。

## レガシーハッシュのアップグレード

MD5 や SHA-1 など安全性の低いハッシュアルゴリズムを使う古いアプリケーションは、上記の現在のパスワードハッシュアルゴリズムへアップグレードできます。利用者がパスワードを入力したとき、通常はアプリケーションで認証するときに、その入力を新しいアルゴリズムで再ハッシュするべきです。防御側は利用者の現在のパスワードを失効させ、新しいパスワードを入力するよう要求するべきです。そうすることで、古い安全性の低いパスワードハッシュが攻撃者にとって有用でなくなります。

しかしこれは、利用者がログインするまで、古い安全性の低いパスワードハッシュがデータベースに保存され続けることを意味します。このジレンマを避けるには、二つのアプローチがあります。

アップグレード方法 1: 長期間非アクティブな利用者のパスワードハッシュを失効・削除し、再ログインするためにパスワードをリセットするよう要求します。これは安全ですが、特に利用者に優しい方法ではありません。多数の利用者のパスワードを失効させると、サポート担当者に問題が発生したり、利用者に侵害の兆候だと解釈されたりする可能性があります。

アップグレード方法 2: 既存のパスワードハッシュを、より安全なアルゴリズムへの入力として使用します。たとえば、アプリケーションが元々パスワードを `md5($password)` として保存していた場合、これは `bcrypt(md5($password))` に容易にアップグレードできます。ハッシュを重ねることで元のパスワードを知る必要はなくなりますが、ハッシュを解読しやすくする可能性があります。これらのハッシュは、次回利用者がログインしたときに、利用者のパスワードを直接ハッシュ化したものに置き換えるべきです。

パスワードハッシュ方式を選択した後も将来アップグレードが必要になることを忘れないでください。そのため、ハッシュアルゴリズムのアップグレードをできるだけ容易にしておきます。移行期間中は、新旧のハッシュアルゴリズムが混在することを許容します。パスワードハッシュアルゴリズムと work factor をパスワードとともに標準形式で保存しておくと、複数のハッシュアルゴリズムを混在させやすくなります。例として、[modular PHC string format](https://github.com/P-H-C/phc-string-format/blob/master/phc-sf-spec.md) があります。

### 国際文字

ハッシュライブラリは広範な文字を受け付けられる必要があり、すべての Unicode コードポイントと互換性があるべきです。これにより、利用者は現在のデバイス、特にモバイルキーボードで利用できる文字の全範囲を使えます。利用者はさまざまな言語のパスワードを選択し、ピクトグラムを含められるべきです。ハッシュ化の前に利用者入力のエントロピーを減らしてはいけません。また、パスワードハッシュライブラリは NULL バイトを含む可能性のある入力を扱える必要があります。

</div>
</div>

</section>
</div>



## Attribution

<div className="attributionFooter">

- Original: Password Storage Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: English original retained for comparison. Japanese translation added. Bilingual display generated from official source and local Japanese translation.
- Retrieved: 2026-05-21

</div>
