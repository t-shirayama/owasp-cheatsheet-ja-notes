# Cryptographic Storage Cheat Sheet

<div className="docHero">
  <span className="docPill">ASVS bilingual view</span>
  <p className="docSubtitle">暗号化ストレージチートシート</p>
  <div className="docMeta">
    <span className="docPill">Retrieved: 2026-05-20</span>
    <span className="docPill">Category: Cryptographic Storage</span>
    <span className="docPill">ASVS: V11.1, V11.2, V11.3, V11.5</span>
    <span className="docPill">Unofficial translation</span>
  </div>
</div>

<div className="contentTabs">
  <a href="#translation">翻訳</a>
  <a href="#summary">要点</a>
  <a href="#checklist">チェックリスト</a>
  <a className="activeTab" href="#bilingual">対比表示</a>
</div>

## Attribution

- Original: Cryptographic Storage Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: English original retained for comparison. Japanese translation added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: https://github.com/t-shirayama/owasp-cheatsheet-ja-notes/blob/main/docs/translations/v11/cryptographic-storage.md
- 要約: https://github.com/t-shirayama/owasp-cheatsheet-ja-notes/blob/main/docs/summaries/v11/cryptographic-storage.md
- 開発チェックリスト: https://github.com/t-shirayama/owasp-cheatsheet-ja-notes/blob/main/docs/checklists/v11/cryptographic-storage.md

## 翻訳

このチートシートは、保存データを保護するための暗号化ストレージ設計の基本モデルを示します。パスワードは可逆暗号で保存せず、Password Storage Cheat Sheet に従って安全なパスワードハッシュを使います。

## 要点

- パスワードは可逆暗号で保存せず、安全なパスワードハッシュを使う。
- 最初に脅威モデルを定義し、どの層で暗号化するか決める。
- 対称暗号は AES 128 bit 以上、理想的には 256 bit と安全なモードを使う。
- 独自暗号を作らない。GCM/CCM など認証付き暗号を優先する。
- 鍵、IV、セッション ID、CSRF トークン、パスワードリセットトークンには CSPRNG を使う。

## チェックリスト

- [ ] 保護対象データ、保存場所、暗号化層、使用アルゴリズム、鍵 ID、鍵保管場所を一覧化する。
- [ ] 独自暗号、独自モード、独自パディングを禁止する。
- [ ] 利用可能な場合は GCM または CCM などの認証付き暗号を使う。
- [ ] 鍵、IV、トークンは CSPRNG で生成する。
- [ ] 鍵をソースコード、バージョン管理、環境変数へ置かない。

## 対比表示

<div className="modeToggle">
  <span>日本語のみ</span>
  <span className="activeMode">対比表示</span>
</div>

<div className="noticeBox">
  初期版では、対訳 UI と運用形を確認するため、導入、設計、アルゴリズム、乱数、鍵管理の主要段落を先行して対訳化しています。全文展開時は同じカード形式で残りの原文段落を追加します。
</div>

### Introduction

<div className="bilingualPair">
  <div className="bilingualBlock english">
    <span className="bilingualLabel english">English (原文)</span>
    <p>This article provides a simple model to follow when implementing solutions to protect data at rest.</p>
  </div>
  <div className="bilingualBlock japanese">
    <span className="bilingualLabel japanese">日本語 (翻訳)</span>
    <p>この記事は、保存データを保護するソリューションを実装するときに従うべき単純なモデルを示します。</p>
  </div>
</div>

<div className="bilingualPair">
  <div className="bilingualBlock english">
    <span className="bilingualLabel english">English (原文)</span>
    <p>Passwords should not be stored using reversible encryption. Secure password hashing algorithms should be used instead.</p>
  </div>
  <div className="bilingualBlock japanese">
    <span className="bilingualLabel japanese">日本語 (翻訳)</span>
    <p>パスワードは可逆暗号で保存してはいけません。代わりに安全なパスワードハッシュアルゴリズムを使用する必要があります。</p>
  </div>
</div>

### Architectural Design

<div className="bilingualPair">
  <div className="bilingualBlock english">
    <span className="bilingualLabel english">English (原文)</span>
    <p>The first step in designing any application is to consider the overall architecture of the system, as this will have a huge impact on the technical implementation.</p>
  </div>
  <div className="bilingualBlock japanese">
    <span className="bilingualLabel japanese">日本語 (翻訳)</span>
    <p>あらゆるアプリケーション設計の最初のステップは、システム全体のアーキテクチャを検討することです。これは技術的な実装に大きな影響を与えるためです。</p>
  </div>
</div>

<div className="bilingualPair">
  <div className="bilingualBlock english">
    <span className="bilingualLabel english">English (原文)</span>
    <p>This process should begin with considering the threat model of the application, meaning who you are trying to protect that data against.</p>
  </div>
  <div className="bilingualBlock japanese">
    <span className="bilingualLabel japanese">日本語 (翻訳)</span>
    <p>このプロセスは、アプリケーションの脅威モデル、つまりそのデータを誰から守ろうとしているのかを検討するところから始める必要があります。</p>
  </div>
</div>

<div className="bilingualPair">
  <div className="bilingualBlock english">
    <span className="bilingualLabel english">English (原文)</span>
    <p>Dedicated secret or key management systems can provide an additional layer of security protection and make secrets easier to manage, but they add complexity and administrative overhead.</p>
  </div>
  <div className="bilingualBlock japanese">
    <span className="bilingualLabel japanese">日本語 (翻訳)</span>
    <p>専用のシークレット管理または鍵管理システムは、追加のセキュリティ保護層を提供し、シークレット管理を大幅に容易にできます。一方で、複雑さと管理負荷も増えます。</p>
  </div>
</div>

### Algorithms

<div className="bilingualPair">
  <div className="bilingualBlock english">
    <span className="bilingualLabel english">English (原文)</span>
    <p>For symmetric encryption, AES with a key that is at least 128 bits, ideally 256 bits, and a secure mode should be used as the preferred algorithm.</p>
  </div>
  <div className="bilingualBlock japanese">
    <span className="bilingualLabel japanese">日本語 (翻訳)</span>
    <p>対称暗号では、少なくとも 128 bit、理想的には 256 bit の鍵を持つ AES と安全なモードを、優先アルゴリズムとして使用する必要があります。</p>
  </div>
</div>

<div className="bilingualPair">
  <div className="bilingualBlock english">
    <span className="bilingualLabel english">English (原文)</span>
    <p>For asymmetric encryption, use elliptic curve cryptography with a secure curve such as Curve25519 as a preferred algorithm. If ECC is not available and RSA must be used, ensure that the key is at least 2048 bits.</p>
  </div>
  <div className="bilingualBlock japanese">
    <span className="bilingualLabel japanese">日本語 (翻訳)</span>
    <p>非対称暗号では、Curve25519 など安全な曲線を用いた楕円曲線暗号を優先アルゴリズムとして使用します。ECC が利用できず RSA を使用する必要がある場合は、鍵長が少なくとも 2048 bit であることを確認します。</p>
  </div>
</div>

<div className="bilingualPair">
  <div className="bilingualBlock english">
    <span className="bilingualLabel english">English (原文)</span>
    <p>Do not create custom algorithms.</p>
  </div>
  <div className="bilingualBlock japanese">
    <span className="bilingualLabel japanese">日本語 (翻訳)</span>
    <p>独自アルゴリズムを作成してはいけません。</p>
  </div>
</div>

### Secure Random Number Generation

<div className="bilingualPair">
  <div className="bilingualBlock english">
    <span className="bilingualLabel english">English (原文)</span>
    <p>Random numbers or strings are needed for security-critical functionality such as generating encryption keys, IVs, session IDs, CSRF tokens, or password reset tokens. They must be generated securely so that attackers cannot guess or predict them.</p>
  </div>
  <div className="bilingualBlock japanese">
    <span className="bilingualLabel japanese">日本語 (翻訳)</span>
    <p>暗号鍵、IV、セッション ID、CSRF トークン、パスワードリセットトークンなど、セキュリティ上重要な機能には乱数またはランダム文字列が必要です。攻撃者が推測または予測できないよう、安全に生成する必要があります。</p>
  </div>
</div>

<div className="bilingualPair">
  <div className="bilingualBlock english">
    <span className="bilingualLabel english">English (原文)</span>
    <p>Pseudo-Random Number Generators provide low-quality randomness that is faster and can be used for non-security functionality. They must not be used for security-critical purposes because attackers may be able to guess or predict the output.</p>
  </div>
  <div className="bilingualBlock japanese">
    <span className="bilingualLabel japanese">日本語 (翻訳)</span>
    <p>疑似乱数生成器は低品質ながら高速なランダム性を提供し、セキュリティに関係しない機能には使用できます。しかし、攻撃者が出力を推測または予測できる可能性があるため、セキュリティ上重要な用途には使用してはいけません。</p>
  </div>
</div>

<div className="bilingualPair">
  <div className="bilingualBlock english">
    <span className="bilingualLabel english">English (原文)</span>
    <p>Cryptographically Secure Pseudo-Random Number Generators are designed to produce a much higher quality of randomness, making them safe for security-sensitive functionality.</p>
  </div>
  <div className="bilingualBlock japanese">
    <span className="bilingualLabel japanese">日本語 (翻訳)</span>
    <p>暗号学的に安全な疑似乱数生成器は、より高品質なランダム性を生成するよう設計されており、セキュリティ上重要な機能に安全に使用できます。</p>
  </div>
</div>

### Key Management

<div className="bilingualPair">
  <div className="bilingualBlock english">
    <span className="bilingualLabel english">English (原文)</span>
    <p>Formal processes should be implemented and tested to cover all aspects of key management, including generating and storing new keys, distributing keys, deploying keys to application servers, and rotating or decommissioning old keys.</p>
  </div>
  <div className="bilingualBlock japanese">
    <span className="bilingualLabel japanese">日本語 (翻訳)</span>
    <p>新しい鍵の生成と保管、鍵の配布、アプリケーションサーバーへの展開、古い鍵のローテーションまたは廃止など、鍵管理のすべての側面を扱う正式なプロセスを実装し、テストする必要があります。</p>
  </div>
</div>

<div className="bilingualPair">
  <div className="bilingualBlock english">
    <span className="bilingualLabel english">English (原文)</span>
    <p>Keys should be randomly generated using a cryptographically secure function. They should not be based on common words, phrases, or random-looking characters generated by mashing the keyboard.</p>
  </div>
  <div className="bilingualBlock japanese">
    <span className="bilingualLabel japanese">日本語 (翻訳)</span>
    <p>鍵は暗号学的に安全な関数を使ってランダムに生成する必要があります。一般的な単語やフレーズ、キーボードを適当に叩いて生成したランダム風の文字列に基づいてはいけません。</p>
  </div>
</div>
