---
title: Choosing and Using Security Questions Cheat Sheet
hide_title: true
---

<div className="docHero" data-category="asvs-v6">
  <h1>秘密の質問の選択と利用チートシート</h1>
  <div className="docMeta">
    <span className="docPill">最終更新: 2026-05-21</span>
    <span className="docPill">読了時間: 約 8 分</span>
    <span className="docPill">カテゴリ: 認証</span>
  </div>
</div>

<div className="tabbedContent">
  <input className="tabInput" type="radio" name="security-questions-view" id="security-questions-original" />
  <input className="tabInput" type="radio" name="security-questions-view" id="security-questions-translation" defaultChecked />
  <input className="tabInput" type="radio" name="security-questions-view" id="security-questions-bilingual" />

  <div className="contentTabs">
    <label htmlFor="security-questions-original" title="OWASP 原文">原文</label>
    <label htmlFor="security-questions-translation" title="日本語訳">翻訳</label>
    <label htmlFor="security-questions-bilingual" title="原文と翻訳を並べて確認">対比表示</label>
  </div>

<section id="security-questions-original-panel" className="tabPanel originalPanel contentPanel">

## Introduction

**WARNING: Security questions are no longer recognized as an acceptable authentication factor per [NIST SP 800-63](https://pages.nist.gov/800-63-3/sp800-63b.html). Account recovery is just an alternate way to authenticate so it should be no weaker than regular authentication. See [SP 800-63B sec 5.1.1.2 paragraph 4](https://pages.nist.gov/800-63-3/sp800-63b.html#sec5): *Verifiers SHALL NOT prompt subscribers to use specific types of information (e.g., “What was the name of your first pet?”) when choosing memorized secrets*.**

If you are curious, please have a look at this [study](https://www.microsoft.com/en-us/research/publication/its-no-secret-measuring-the-security-and-reliability-of-authentication-via-secret-questions/) by Microsoft Research in 2009 and this [study](https://research.google/pubs/pub43783/) performed at Google in 2015. The accompanying [Security blog](https://security.googleblog.com/2015/05/new-research-some-tough-questions-for.html) update includes an infographic on the issues identified with security questions.

**Please Note:** While there are no acceptable uses of security questions in secure software, this cheat sheet provides guidance on how to choose strong security questions for legacy purposes.

## Choosing Security Questions

### Desired Characteristics

Any security questions presented to users to reset forgotten passwords must meet the following characteristics:

| Characteristic | Explanation |
| --- | --- |
| Memorable | The user must be able to recall the answer to the question, potentially years after creating their account. |
| Consistent | The answer to the question must not change over time. |
| Applicable | The user must be able to answer the question. |
| Confidential | The answer to the question must be hard for an attacker to obtain. |
| Specific | The answer should be clear to the user. |

### Types of Security Questions

Security questions fall into two main types. With *user defined* security questions, the user must choose a question from a list, and provide an answer to the question. Common examples are "What is your favourite colour?" or "What was your first car?"

These are easy for applications to implement, as the additional information required is provided by the user when they first create their account. However, users will often choose weak or easily discovered answers to these questions.

*System defined* security questions are based on information that is already known about the user. This approach avoids having to ask the user to provide specific security questions and answers, and also prevents them from being able to choose weak details. However it relies on sufficient information already being stored about the user, and on this information being hard for an attacker to obtain.

### User Defined Security Questions

#### Bad Questions

Any questions that do not have all of the characteristics discussed above should be avoided. The table below gives some examples of bad security questions:

| Question | Problem |
| --- | --- |
| When is your date of birth? | Easy for an attacker to discover. |
| What is your memorable date? | Most users will just enter their birthday. |
| What is your favourite movie? | Likely to change over time. |
| What is your favourite cricket team? | Not applicable to most users. |
| What is the make and model of your first car? | Fairly small range of likely answers. |
| What is your nickname? | This could be guessed by glancing through social media posts. |

Additionally, the context of the application must be considered when deciding whether questions are good or bad. For example, a question such as "What was your maths teacher's surname in your 8th year of school?" would be very easy to guess if it was using in a virtual learning environment for your school (as other students probably know this information), but would be much stronger for an online gaming website.

#### Good Questions

Many good security questions are not applicable to all users, so the best approach is to give the user a list of security questions that they can choose from. This allows you to have more specific questions (with more secure answers), while still providing every user with questions that they can answer.

The following list provides some examples of good questions:

- What is the name of a college you applied to but didn’t attend?
- What was the name of the first school you remember attending?
- Where was the destination of your most memorable school field trip?
- What was your maths teacher's surname in your 8th year of school?
- What was the name of your first stuffed toy?
- What was your driving instructor's first name?

Much like passwords, there is a risk that users will re-use recovery questions between different sites, which could expose the users if the other site is compromised. As such, there are benefits to having unique security questions that are unlikely to be shared between sites. An easy way to achieve this is to create more targeted questions based on the type of application. For example, on a share dealing platform, financial related questions such as "What is the first company you owned shares in?" could be used.

#### Allowing Users to Write Their Own Questions

Allowing users to write their own security questions can result in them choosing very strong and unique questions that would be very hard for an attacker to guess. However, there is also a significant risk that users will choose weak questions. In some cases, users might even set a recovery question to a reminder of what their password is - allowing anyone guessing their email address to compromise their account.

As such, it is generally best not to allow users to write their own questions.

#### Restricting Answers

Enforcing a minimum length for answers can prevent users from entering strings such as "a" or "123" for their answers. However, depending on the questions asked, it could also prevent users from being able to correctly answer the question. For example, asking for a first name or surname could result in a two letter answer such as "Li", and a colour-based question could be four letters such as "blue".

Answers should also be checked against a denylist, including:

- The username or email address.
- The user's current password.
- Common strings such as "123" or "password".

#### Renewing Security Questions

If the security questions are not used as part of the main authentication process, then consider periodically (such as when they are changing their passwords after expiration) prompting the user to review their security questions and verify that they still know the answers. This should give them a chance to update any answers that may have changed (although ideally this shouldn't happen with good questions), and increases the likelihood that they will remember them if they ever need to recover their account.

### System Defined Security Questions

System defined security questions are based on information that is already known about the user. The users' personal details are often used, including the full name, address and date of birth. However these can easily be obtained by an attacker from social media, and as such provide a very weak level of authentication.

The questions that can be used will vary hugely depending on the application, and how much information is already held about the user. When deciding which bits of information may be usable for security questions, the following areas should be considered:

- Will the user be able to remember the answer to the question?
- Could an attacker easily obtain this information from social media or other sources?
- Is the answer likely to be the same for a large number of users, or easily guessable?

## Using Security Questions

### When to Use Security Questions

Applications should generally use a password along with a second authentication factor (such as an OTP code) to authenticate users. The combination of a password and security questions **does not constitute MFA**, as both factors as the same (i.e. something you know)..

**Security questions should never be relied upon as the sole mechanism to authenticate a user**. However, they can provide a useful additional layer of security when other stronger factors are not available. Common cases where they would be used include:

- Logging in.
- Resetting a forgotten password.
- Resetting a lost MFA token.

#### Authentication Flow

Security questions may be used as part of the main authentication flow to supplement passwords where MFA is not available. A typical authentication flow would be:

- The user enters their username and password.
- If the username and password are correct, the user is presented with the security question(s).
- If the answers are correct, the user is logged in.

If the answers to the security questions are incorrect, then this should be counted as a failed login attempt, and the account lockout counter should be incremented for the user.

#### Forgotten Password or Lost MFA Token Flow

Forgotten password functionality often provides a mechanism for attackers to enumerate user accounts if it is not correctly implemented. The following flow avoids this issue by only displaying the security questions once the user has proved ownership of the email address:

- The user enters email address (and solves a CAPTCHA).
- The application displays a generic message such as "If the email address was correct, an email will be sent to it".
- An email with a randomly generated, single-use link is sent to the user.
- The user clicks the link.
- The user is presented with the security question(s).
- If the answer is correct, the user can enter a new password.

### How to Use Security Questions

#### Storing Answers

The answers to security questions may contain personal information about the user, and may also be re-used by the user between different applications. As such, they should be treated in the same way as passwords, and stored using a secure hashing algorithm such as Bcrypt. The [password storage cheat sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html) contains further guidance on this.

#### Comparing Answers

Comparing the answers provided by the user with the stored answer in a case insensitive manner makes it much easier for the user. The simplest way to do this is to convert the answer to lowercase before hashing the answer to store it, and then lowercase the user-provided answer before comparing them.

It is also beneficial to give the user some indication of the format that they should use to enter answers. This could be done through input validation, or simply by recommending that the user enters their details in a specific format. For example, when asking for a date, indicating that the format should be "DD/MM/YYYY" will mean that the user doesn't have to try and guess what format they entered when registering.

#### Updating Answers

When the user updates the answers to their security questions, this should be treated as a sensitive operation within the application. As such, the user should be required to re-authenticate themselves by entering their password (or ideally using MFA), in order to prevent an attacker updating the questions if they gain temporary access to the user's account.

#### Multiple Security Questions

When security questions are used, the user can either be asked a single question, or can be asked multiple questions at the same time. This provides a greater level of assurance, especially if the questions are diverse, as an attacker would need to obtain more information about the target user. A mixture of user-defined and system-defined questions can be very effective for this.

If the user is asked a single question out of a bank of possible questions, then this question **should not** be changed until the user has answered it correctly. If the attacker is allowed to try answering all of the different security questions, this greatly increases the chance that they will be able to guess or obtain the answer to one of them.

</section>

<section id="security-questions-translation-panel" className="tabPanel translationPanel contentPanel">

## はじめに

**警告: NIST SP 800-63 によれば、秘密の質問は受け入れ可能な認証要素とはもはや認められていません。アカウント回復は認証の代替手段にすぎないため、通常の認証より弱くしてはなりません。[SP 800-63B 5.1.1.2 節 第 4 段落](https://pages.nist.gov/800-63-3/sp800-63b.html#sec5)を参照してください。そこでは「検証者は、記憶シークレットを選択する際に、特定の種類の情報 (例: "最初のペットの名前は何ですか?") を使用するよう加入者に促してはならない」とされています。**

関心がある場合は、Microsoft Research による 2009 年の[研究](https://www.microsoft.com/en-us/research/publication/its-no-secret-measuring-the-security-and-reliability-of-authentication-via-secret-questions/)と、Google で 2015 年に行われた[研究](https://research.google/pubs/pub43783/)を参照してください。関連する [Security blog](https://security.googleblog.com/2015/05/new-research-some-tough-questions-for.html) の更新には、秘密の質問で特定された問題に関するインフォグラフィックが含まれています。

**注意:** 安全なソフトウェアにおいて秘密の質問の受け入れ可能な用途はありませんが、このチートシートでは、レガシー目的で強い秘密の質問を選ぶ方法に関するガイダンスを提供します。

## 秘密の質問の選択

### 望ましい特性

忘れたパスワードをリセットするために利用者へ提示する秘密の質問は、以下の特性を満たす必要があります。

| 特性 | 説明 |
| --- | --- |
| 記憶可能 | 利用者は、アカウント作成から何年も経った後でも、その質問の答えを思い出せる必要があります。 |
| 一貫性 | 質問の答えは時間の経過で変わってはなりません。 |
| 適用可能 | 利用者はその質問に答えられる必要があります。 |
| 機密性 | 質問の答えは、攻撃者が入手しにくい必要があります。 |
| 具体性 | 答えは利用者にとって明確であるべきです。 |

### 秘密の質問の種類

秘密の質問は大きく二つの種類に分けられます。*利用者定義*の秘密の質問では、利用者が一覧から質問を選び、その質問への答えを提供する必要があります。一般的な例には「好きな色は何ですか?」や「最初の車は何でしたか?」があります。

これらは、利用者が最初にアカウントを作成するときに必要な追加情報を提供するため、アプリケーションにとって実装しやすいものです。しかし、利用者はしばしば、これらの質問に対して弱い答えや簡単に発見できる答えを選びます。

*システム定義*の秘密の質問は、利用者についてすでに知られている情報に基づきます。この方法では、利用者に特定の秘密の質問と答えを提供してもらう必要がなく、利用者が弱い情報を選ぶことも防げます。しかし、利用者について十分な情報がすでに保存されていること、そしてその情報を攻撃者が入手しにくいことに依存します。

### 利用者定義の秘密の質問

#### 悪い質問

上記で説明した特性をすべて備えていない質問は避けるべきです。以下の表は、悪い秘密の質問の例を示しています。

| 質問 | 問題 |
| --- | --- |
| 生年月日はいつですか? | 攻撃者が簡単に発見できます。 |
| 思い出の日付は何ですか? | ほとんどの利用者は誕生日を入力します。 |
| 好きな映画は何ですか? | 時間の経過で変わる可能性があります。 |
| 好きなクリケットチームはどこですか? | ほとんどの利用者には当てはまりません。 |
| 最初の車のメーカーとモデルは何ですか? | 想定される答えの範囲がかなり小さいです。 |
| ニックネームは何ですか? | ソーシャルメディアの投稿をざっと見るだけで推測できる可能性があります。 |

さらに、質問が良いか悪いかを判断するときは、アプリケーションの文脈を考慮する必要があります。たとえば「学校の 8 年目の数学教師の姓は何でしたか?」のような質問は、自分の学校の仮想学習環境で使う場合には、他の生徒もこの情報を知っている可能性が高いため非常に推測しやすいですが、オンラインゲームサイトでははるかに強い質問になるでしょう。

#### 良い質問

多くの良い秘密の質問はすべての利用者に当てはまるわけではないため、最善の方法は、利用者が選択できる秘密の質問の一覧を提示することです。これにより、すべての利用者に答えられる質問を提供しながら、より具体的な質問、つまりより安全な答えを持つ質問を用意できます。

以下の一覧は、良い質問の例を示しています。

- 出願したが通わなかった大学の名前は何ですか?
- 覚えている中で最初に通った学校の名前は何でしたか?
- 最も思い出深い学校の遠足の行き先はどこでしたか?
- 学校の 8 年目の数学教師の姓は何でしたか?
- 最初のぬいぐるみの名前は何でしたか?
- 運転教官の下の名前は何でしたか?

パスワードと同じように、利用者が複数のサイトで回復用の質問を再利用するリスクがあり、他のサイトが侵害された場合に利用者が危険にさらされる可能性があります。そのため、サイト間で共有されにくい一意の秘密の質問には利点があります。これを実現する簡単な方法は、アプリケーションの種類に基づいて、より対象を絞った質問を作ることです。たとえば株式取引プラットフォームでは、「最初に株式を保有した会社は何ですか?」のような金融関連の質問を使用できます。

#### 利用者が独自の質問を書けるようにすること

利用者が独自の秘密の質問を書けるようにすると、攻撃者が推測するのが非常に難しい、強く一意な質問を選べる場合があります。しかし、利用者が弱い質問を選ぶ重大なリスクもあります。場合によっては、利用者が回復用の質問をパスワードのヒントに設定してしまい、メールアドレスを推測できる人であれば誰でもアカウントを侵害できるようになる可能性すらあります。

したがって、一般的には、利用者が独自の質問を書けるようにしないことが最善です。

#### 回答の制限

回答に最小長を適用すると、利用者が回答として「a」や「123」のような文字列を入力することを防げます。しかし、質問によっては、利用者が質問に正しく答えられなくなる可能性もあります。たとえば、名や姓を尋ねると「Li」のような 2 文字の答えになることがあり、色に関する質問では「blue」のような 4 文字の答えになることがあります。

回答は、以下を含む拒否リストとも照合すべきです。

- ユーザー名またはメールアドレス。
- 利用者の現在のパスワード。
- 「123」や「password」のような一般的な文字列。

#### 秘密の質問の更新

秘密の質問が主な認証プロセスの一部として使われていない場合は、定期的に、たとえば有効期限後にパスワードを変更するときなどに、利用者へ秘密の質問を見直し、まだ答えを知っていることを確認するよう促すことを検討してください。これにより、変わってしまった可能性のある答えを更新する機会を与えられます。理想的には、良い質問では答えは変わらないはずです。また、将来アカウントを回復する必要が生じたときに、利用者が答えを思い出せる可能性も高まります。

### システム定義の秘密の質問

システム定義の秘密の質問は、利用者についてすでに知られている情報に基づきます。氏名、住所、生年月日などの利用者の個人情報がよく使われます。しかし、これらは攻撃者がソーシャルメディアから簡単に入手できるため、非常に弱い認証レベルしか提供しません。

使用できる質問は、アプリケーションや、利用者についてすでに保持している情報の量によって大きく異なります。秘密の質問に利用できる可能性がある情報を判断するときは、以下の点を考慮すべきです。

- 利用者はその質問の答えを覚えていられるか?
- 攻撃者はソーシャルメディアやその他の情報源からこの情報を簡単に入手できるか?
- 答えは多数の利用者で同じになりやすいか、または簡単に推測できるか?

## 秘密の質問の利用

### 秘密の質問を使う場合

アプリケーションでは通常、利用者を認証するために、パスワードを第二の認証要素 (OTP コードなど) と組み合わせて使用すべきです。パスワードと秘密の質問の組み合わせは、両方の要素が同じもの、つまり「知っているもの」であるため、**MFA にはなりません**。

**秘密の質問を、利用者を認証する唯一の仕組みとして信頼してはなりません**。ただし、他のより強い要素が利用できない場合には、有用な追加のセキュリティレイヤーを提供できます。使用される一般的なケースには以下があります。

- ログイン。
- 忘れたパスワードのリセット。
- 紛失した MFA トークンのリセット。

#### 認証フロー

MFA が利用できない場合、秘密の質問は、パスワードを補完するために主な認証フローの一部として使用できます。典型的な認証フローは次のようになります。

- 利用者がユーザー名とパスワードを入力します。
- ユーザー名とパスワードが正しい場合、利用者に秘密の質問が提示されます。
- 答えが正しい場合、利用者はログインできます。

秘密の質問への答えが正しくない場合は、これをログイン失敗として数え、その利用者のアカウントロックアウトカウンターを増やすべきです。

#### 忘れたパスワードまたは紛失した MFA トークンのフロー

パスワード忘れ機能は、正しく実装されていない場合、攻撃者が利用者アカウントを列挙する仕組みになりがちです。以下のフローは、利用者がメールアドレスの所有を証明した後にだけ秘密の質問を表示することで、この問題を避けます。

- 利用者がメールアドレスを入力します (そして CAPTCHA を解きます)。
- アプリケーションは「メールアドレスが正しければ、そのアドレスにメールが送信されます」のような汎用的なメッセージを表示します。
- ランダムに生成された単回使用リンクを含むメールが利用者に送信されます。
- 利用者がリンクをクリックします。
- 利用者に秘密の質問が提示されます。
- 答えが正しい場合、利用者は新しいパスワードを入力できます。

### 秘密の質問の使い方

#### 回答の保存

秘密の質問への回答には利用者の個人情報が含まれる可能性があり、また利用者が複数のアプリケーションで再利用している可能性もあります。そのため、回答はパスワードと同じように扱い、Bcrypt などの安全なハッシュアルゴリズムを使って保存すべきです。これについては、[パスワード保存チートシート](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)に詳しいガイダンスがあります。

#### 回答の比較

利用者が提供した回答を、保存済みの回答と大文字小文字を区別せずに比較すると、利用者にとってはるかに使いやすくなります。これを行う最も簡単な方法は、保存用に回答をハッシュする前に小文字へ変換し、比較前にも利用者が提供した回答を小文字へ変換することです。

また、回答を入力するときに使うべき形式を利用者へ何らかの形で示すことも有益です。これは入力検証によって行うことも、利用者に特定の形式で詳細を入力するよう単に推奨することでも実現できます。たとえば日付を尋ねる場合、形式を「DD/MM/YYYY」と示せば、利用者は登録時にどの形式で入力したかを推測し直す必要がなくなります。

#### 回答の更新

利用者が秘密の質問への回答を更新するとき、この操作はアプリケーション内の機微な操作として扱うべきです。そのため、攻撃者が利用者のアカウントへ一時的にアクセスできた場合に質問を更新することを防ぐため、利用者にはパスワードの入力、または理想的には MFA の使用による再認証を求めるべきです。

#### 複数の秘密の質問

秘密の質問を使用する場合、利用者には単一の質問を尋ねることも、複数の質問を同時に尋ねることもできます。複数の質問、特に多様な質問を使うと、攻撃者は対象利用者についてより多くの情報を入手する必要があるため、より高い保証レベルを提供できます。利用者定義の質問とシステム定義の質問を組み合わせることは非常に効果的です。

利用者に、候補となる質問群から単一の質問を提示する場合、その質問は、利用者が正しく答えるまで変更**すべきではありません**。攻撃者が異なる秘密の質問すべてに回答を試せるようにしてしまうと、攻撃者がそのうち一つの答えを推測または入手できる可能性が大幅に高まります。

</section>

<section id="security-questions-bilingual-panel" className="tabPanel bilingualPanel contentPanel">

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Introduction

**WARNING: Security questions are no longer recognized as an acceptable authentication factor per [NIST SP 800-63](https://pages.nist.gov/800-63-3/sp800-63b.html). Account recovery is just an alternate way to authenticate so it should be no weaker than regular authentication. See [SP 800-63B sec 5.1.1.2 paragraph 4](https://pages.nist.gov/800-63-3/sp800-63b.html#sec5): *Verifiers SHALL NOT prompt subscribers to use specific types of information (e.g., “What was the name of your first pet?”) when choosing memorized secrets*.**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語訳</span>

## はじめに

**警告: NIST SP 800-63 によれば、秘密の質問は受け入れ可能な認証要素とはもはや認められていません。アカウント回復は認証の代替手段にすぎないため、通常の認証より弱くしてはなりません。[SP 800-63B 5.1.1.2 節 第 4 段落](https://pages.nist.gov/800-63-3/sp800-63b.html#sec5)を参照してください。そこでは「検証者は、記憶シークレットを選択する際に、特定の種類の情報 (例: "最初のペットの名前は何ですか?") を使用するよう加入者に促してはならない」とされています。**

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

If you are curious, please have a look at this [study](https://www.microsoft.com/en-us/research/publication/its-no-secret-measuring-the-security-and-reliability-of-authentication-via-secret-questions/) by Microsoft Research in 2009 and this [study](https://research.google/pubs/pub43783/) performed at Google in 2015. The accompanying [Security blog](https://security.googleblog.com/2015/05/new-research-some-tough-questions-for.html) update includes an infographic on the issues identified with security questions.

**Please Note:** While there are no acceptable uses of security questions in secure software, this cheat sheet provides guidance on how to choose strong security questions for legacy purposes.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語訳</span>

関心がある場合は、Microsoft Research による 2009 年の[研究](https://www.microsoft.com/en-us/research/publication/its-no-secret-measuring-the-security-and-reliability-of-authentication-via-secret-questions/)と、Google で 2015 年に行われた[研究](https://research.google/pubs/pub43783/)を参照してください。関連する [Security blog](https://security.googleblog.com/2015/05/new-research-some-tough-questions-for.html) の更新には、秘密の質問で特定された問題に関するインフォグラフィックが含まれています。

**注意:** 安全なソフトウェアにおいて秘密の質問の受け入れ可能な用途はありませんが、このチートシートでは、レガシー目的で強い秘密の質問を選ぶ方法に関するガイダンスを提供します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Choosing Security Questions

### Desired Characteristics

Any security questions presented to users to reset forgotten passwords must meet the following characteristics:

| Characteristic | Explanation |
| --- | --- |
| Memorable | The user must be able to recall the answer to the question, potentially years after creating their account. |
| Consistent | The answer to the question must not change over time. |
| Applicable | The user must be able to answer the question. |
| Confidential | The answer to the question must be hard for an attacker to obtain. |
| Specific | The answer should be clear to the user. |

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語訳</span>

## 秘密の質問の選択

### 望ましい特性

忘れたパスワードをリセットするために利用者へ提示する秘密の質問は、以下の特性を満たす必要があります。

| 特性 | 説明 |
| --- | --- |
| 記憶可能 | 利用者は、アカウント作成から何年も経った後でも、その質問の答えを思い出せる必要があります。 |
| 一貫性 | 質問の答えは時間の経過で変わってはなりません。 |
| 適用可能 | 利用者はその質問に答えられる必要があります。 |
| 機密性 | 質問の答えは、攻撃者が入手しにくい必要があります。 |
| 具体性 | 答えは利用者にとって明確であるべきです。 |

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Types of Security Questions

Security questions fall into two main types. With *user defined* security questions, the user must choose a question from a list, and provide an answer to the question. Common examples are "What is your favourite colour?" or "What was your first car?"

These are easy for applications to implement, as the additional information required is provided by the user when they first create their account. However, users will often choose weak or easily discovered answers to these questions.

*System defined* security questions are based on information that is already known about the user. This approach avoids having to ask the user to provide specific security questions and answers, and also prevents them from being able to choose weak details. However it relies on sufficient information already being stored about the user, and on this information being hard for an attacker to obtain.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語訳</span>

### 秘密の質問の種類

秘密の質問は大きく二つの種類に分けられます。*利用者定義*の秘密の質問では、利用者が一覧から質問を選び、その質問への答えを提供する必要があります。一般的な例には「好きな色は何ですか?」や「最初の車は何でしたか?」があります。

これらは、利用者が最初にアカウントを作成するときに必要な追加情報を提供するため、アプリケーションにとって実装しやすいものです。しかし、利用者はしばしば、これらの質問に対して弱い答えや簡単に発見できる答えを選びます。

*システム定義*の秘密の質問は、利用者についてすでに知られている情報に基づきます。この方法では、利用者に特定の秘密の質問と答えを提供してもらう必要がなく、利用者が弱い情報を選ぶことも防げます。しかし、利用者について十分な情報がすでに保存されていること、そしてその情報を攻撃者が入手しにくいことに依存します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### User Defined Security Questions

#### Bad Questions

Any questions that do not have all of the characteristics discussed above should be avoided. The table below gives some examples of bad security questions:

| Question | Problem |
| --- | --- |
| When is your date of birth? | Easy for an attacker to discover. |
| What is your memorable date? | Most users will just enter their birthday. |
| What is your favourite movie? | Likely to change over time. |
| What is your favourite cricket team? | Not applicable to most users. |
| What is the make and model of your first car? | Fairly small range of likely answers. |
| What is your nickname? | This could be guessed by glancing through social media posts. |

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語訳</span>

### 利用者定義の秘密の質問

#### 悪い質問

上記で説明した特性をすべて備えていない質問は避けるべきです。以下の表は、悪い秘密の質問の例を示しています。

| 質問 | 問題 |
| --- | --- |
| 生年月日はいつですか? | 攻撃者が簡単に発見できます。 |
| 思い出の日付は何ですか? | ほとんどの利用者は誕生日を入力します。 |
| 好きな映画は何ですか? | 時間の経過で変わる可能性があります。 |
| 好きなクリケットチームはどこですか? | ほとんどの利用者には当てはまりません。 |
| 最初の車のメーカーとモデルは何ですか? | 想定される答えの範囲がかなり小さいです。 |
| ニックネームは何ですか? | ソーシャルメディアの投稿をざっと見るだけで推測できる可能性があります。 |

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Additionally, the context of the application must be considered when deciding whether questions are good or bad. For example, a question such as "What was your maths teacher's surname in your 8th year of school?" would be very easy to guess if it was using in a virtual learning environment for your school (as other students probably know this information), but would be much stronger for an online gaming website.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語訳</span>

さらに、質問が良いか悪いかを判断するときは、アプリケーションの文脈を考慮する必要があります。たとえば「学校の 8 年目の数学教師の姓は何でしたか?」のような質問は、自分の学校の仮想学習環境で使う場合には、他の生徒もこの情報を知っている可能性が高いため非常に推測しやすいですが、オンラインゲームサイトでははるかに強い質問になるでしょう。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Good Questions

Many good security questions are not applicable to all users, so the best approach is to give the user a list of security questions that they can choose from. This allows you to have more specific questions (with more secure answers), while still providing every user with questions that they can answer.

The following list provides some examples of good questions:

- What is the name of a college you applied to but didn’t attend?
- What was the name of the first school you remember attending?
- Where was the destination of your most memorable school field trip?
- What was your maths teacher's surname in your 8th year of school?
- What was the name of your first stuffed toy?
- What was your driving instructor's first name?

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語訳</span>

#### 良い質問

多くの良い秘密の質問はすべての利用者に当てはまるわけではないため、最善の方法は、利用者が選択できる秘密の質問の一覧を提示することです。これにより、すべての利用者に答えられる質問を提供しながら、より具体的な質問、つまりより安全な答えを持つ質問を用意できます。

以下の一覧は、良い質問の例を示しています。

- 出願したが通わなかった大学の名前は何ですか?
- 覚えている中で最初に通った学校の名前は何でしたか?
- 最も思い出深い学校の遠足の行き先はどこでしたか?
- 学校の 8 年目の数学教師の姓は何でしたか?
- 最初のぬいぐるみの名前は何でしたか?
- 運転教官の下の名前は何でしたか?

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Much like passwords, there is a risk that users will re-use recovery questions between different sites, which could expose the users if the other site is compromised. As such, there are benefits to having unique security questions that are unlikely to be shared between sites. An easy way to achieve this is to create more targeted questions based on the type of application. For example, on a share dealing platform, financial related questions such as "What is the first company you owned shares in?" could be used.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語訳</span>

パスワードと同じように、利用者が複数のサイトで回復用の質問を再利用するリスクがあり、他のサイトが侵害された場合に利用者が危険にさらされる可能性があります。そのため、サイト間で共有されにくい一意の秘密の質問には利点があります。これを実現する簡単な方法は、アプリケーションの種類に基づいて、より対象を絞った質問を作ることです。たとえば株式取引プラットフォームでは、「最初に株式を保有した会社は何ですか?」のような金融関連の質問を使用できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Allowing Users to Write Their Own Questions

Allowing users to write their own security questions can result in them choosing very strong and unique questions that would be very hard for an attacker to guess. However, there is also a significant risk that users will choose weak questions. In some cases, users might even set a recovery question to a reminder of what their password is - allowing anyone guessing their email address to compromise their account.

As such, it is generally best not to allow users to write their own questions.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語訳</span>

#### 利用者が独自の質問を書けるようにすること

利用者が独自の秘密の質問を書けるようにすると、攻撃者が推測するのが非常に難しい、強く一意な質問を選べる場合があります。しかし、利用者が弱い質問を選ぶ重大なリスクもあります。場合によっては、利用者が回復用の質問をパスワードのヒントに設定してしまい、メールアドレスを推測できる人であれば誰でもアカウントを侵害できるようになる可能性すらあります。

したがって、一般的には、利用者が独自の質問を書けるようにしないことが最善です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Restricting Answers

Enforcing a minimum length for answers can prevent users from entering strings such as "a" or "123" for their answers. However, depending on the questions asked, it could also prevent users from being able to correctly answer the question. For example, asking for a first name or surname could result in a two letter answer such as "Li", and a colour-based question could be four letters such as "blue".

Answers should also be checked against a denylist, including:

- The username or email address.
- The user's current password.
- Common strings such as "123" or "password".

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語訳</span>

#### 回答の制限

回答に最小長を適用すると、利用者が回答として「a」や「123」のような文字列を入力することを防げます。しかし、質問によっては、利用者が質問に正しく答えられなくなる可能性もあります。たとえば、名や姓を尋ねると「Li」のような 2 文字の答えになることがあり、色に関する質問では「blue」のような 4 文字の答えになることがあります。

回答は、以下を含む拒否リストとも照合すべきです。

- ユーザー名またはメールアドレス。
- 利用者の現在のパスワード。
- 「123」や「password」のような一般的な文字列。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Renewing Security Questions

If the security questions are not used as part of the main authentication process, then consider periodically (such as when they are changing their passwords after expiration) prompting the user to review their security questions and verify that they still know the answers. This should give them a chance to update any answers that may have changed (although ideally this shouldn't happen with good questions), and increases the likelihood that they will remember them if they ever need to recover their account.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語訳</span>

#### 秘密の質問の更新

秘密の質問が主な認証プロセスの一部として使われていない場合は、定期的に、たとえば有効期限後にパスワードを変更するときなどに、利用者へ秘密の質問を見直し、まだ答えを知っていることを確認するよう促すことを検討してください。これにより、変わってしまった可能性のある答えを更新する機会を与えられます。理想的には、良い質問では答えは変わらないはずです。また、将来アカウントを回復する必要が生じたときに、利用者が答えを思い出せる可能性も高まります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### System Defined Security Questions

System defined security questions are based on information that is already known about the user. The users' personal details are often used, including the full name, address and date of birth. However these can easily be obtained by an attacker from social media, and as such provide a very weak level of authentication.

The questions that can be used will vary hugely depending on the application, and how much information is already held about the user. When deciding which bits of information may be usable for security questions, the following areas should be considered:

- Will the user be able to remember the answer to the question?
- Could an attacker easily obtain this information from social media or other sources?
- Is the answer likely to be the same for a large number of users, or easily guessable?

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語訳</span>

### システム定義の秘密の質問

システム定義の秘密の質問は、利用者についてすでに知られている情報に基づきます。氏名、住所、生年月日などの利用者の個人情報がよく使われます。しかし、これらは攻撃者がソーシャルメディアから簡単に入手できるため、非常に弱い認証レベルしか提供しません。

使用できる質問は、アプリケーションや、利用者についてすでに保持している情報の量によって大きく異なります。秘密の質問に利用できる可能性がある情報を判断するときは、以下の点を考慮すべきです。

- 利用者はその質問の答えを覚えていられるか?
- 攻撃者はソーシャルメディアやその他の情報源からこの情報を簡単に入手できるか?
- 答えは多数の利用者で同じになりやすいか、または簡単に推測できるか?

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Using Security Questions

### When to Use Security Questions

Applications should generally use a password along with a second authentication factor (such as an OTP code) to authenticate users. The combination of a password and security questions **does not constitute MFA**, as both factors as the same (i.e. something you know)..

**Security questions should never be relied upon as the sole mechanism to authenticate a user**. However, they can provide a useful additional layer of security when other stronger factors are not available. Common cases where they would be used include:

- Logging in.
- Resetting a forgotten password.
- Resetting a lost MFA token.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語訳</span>

## 秘密の質問の利用

### 秘密の質問を使う場合

アプリケーションでは通常、利用者を認証するために、パスワードを第二の認証要素 (OTP コードなど) と組み合わせて使用すべきです。パスワードと秘密の質問の組み合わせは、両方の要素が同じもの、つまり「知っているもの」であるため、**MFA にはなりません**。

**秘密の質問を、利用者を認証する唯一の仕組みとして信頼してはなりません**。ただし、他のより強い要素が利用できない場合には、有用な追加のセキュリティレイヤーを提供できます。使用される一般的なケースには以下があります。

- ログイン。
- 忘れたパスワードのリセット。
- 紛失した MFA トークンのリセット。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Authentication Flow

Security questions may be used as part of the main authentication flow to supplement passwords where MFA is not available. A typical authentication flow would be:

- The user enters their username and password.
- If the username and password are correct, the user is presented with the security question(s).
- If the answers are correct, the user is logged in.

If the answers to the security questions are incorrect, then this should be counted as a failed login attempt, and the account lockout counter should be incremented for the user.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語訳</span>

#### 認証フロー

MFA が利用できない場合、秘密の質問は、パスワードを補完するために主な認証フローの一部として使用できます。典型的な認証フローは次のようになります。

- 利用者がユーザー名とパスワードを入力します。
- ユーザー名とパスワードが正しい場合、利用者に秘密の質問が提示されます。
- 答えが正しい場合、利用者はログインできます。

秘密の質問への答えが正しくない場合は、これをログイン失敗として数え、その利用者のアカウントロックアウトカウンターを増やすべきです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Forgotten Password or Lost MFA Token Flow

Forgotten password functionality often provides a mechanism for attackers to enumerate user accounts if it is not correctly implemented. The following flow avoids this issue by only displaying the security questions once the user has proved ownership of the email address:

- The user enters email address (and solves a CAPTCHA).
- The application displays a generic message such as "If the email address was correct, an email will be sent to it".
- An email with a randomly generated, single-use link is sent to the user.
- The user clicks the link.
- The user is presented with the security question(s).
- If the answer is correct, the user can enter a new password.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語訳</span>

#### 忘れたパスワードまたは紛失した MFA トークンのフロー

パスワード忘れ機能は、正しく実装されていない場合、攻撃者が利用者アカウントを列挙する仕組みになりがちです。以下のフローは、利用者がメールアドレスの所有を証明した後にだけ秘密の質問を表示することで、この問題を避けます。

- 利用者がメールアドレスを入力します (そして CAPTCHA を解きます)。
- アプリケーションは「メールアドレスが正しければ、そのアドレスにメールが送信されます」のような汎用的なメッセージを表示します。
- ランダムに生成された単回使用リンクを含むメールが利用者に送信されます。
- 利用者がリンクをクリックします。
- 利用者に秘密の質問が提示されます。
- 答えが正しい場合、利用者は新しいパスワードを入力できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### How to Use Security Questions

#### Storing Answers

The answers to security questions may contain personal information about the user, and may also be re-used by the user between different applications. As such, they should be treated in the same way as passwords, and stored using a secure hashing algorithm such as Bcrypt. The [password storage cheat sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html) contains further guidance on this.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語訳</span>

### 秘密の質問の使い方

#### 回答の保存

秘密の質問への回答には利用者の個人情報が含まれる可能性があり、また利用者が複数のアプリケーションで再利用している可能性もあります。そのため、回答はパスワードと同じように扱い、Bcrypt などの安全なハッシュアルゴリズムを使って保存すべきです。これについては、[パスワード保存チートシート](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)に詳しいガイダンスがあります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Comparing Answers

Comparing the answers provided by the user with the stored answer in a case insensitive manner makes it much easier for the user. The simplest way to do this is to convert the answer to lowercase before hashing the answer to store it, and then lowercase the user-provided answer before comparing them.

It is also beneficial to give the user some indication of the format that they should use to enter answers. This could be done through input validation, or simply by recommending that the user enters their details in a specific format. For example, when asking for a date, indicating that the format should be "DD/MM/YYYY" will mean that the user doesn't have to try and guess what format they entered when registering.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語訳</span>

#### 回答の比較

利用者が提供した回答を、保存済みの回答と大文字小文字を区別せずに比較すると、利用者にとってはるかに使いやすくなります。これを行う最も簡単な方法は、保存用に回答をハッシュする前に小文字へ変換し、比較前にも利用者が提供した回答を小文字へ変換することです。

また、回答を入力するときに使うべき形式を利用者へ何らかの形で示すことも有益です。これは入力検証によって行うことも、利用者に特定の形式で詳細を入力するよう単に推奨することでも実現できます。たとえば日付を尋ねる場合、形式を「DD/MM/YYYY」と示せば、利用者は登録時にどの形式で入力したかを推測し直す必要がなくなります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Updating Answers

When the user updates the answers to their security questions, this should be treated as a sensitive operation within the application. As such, the user should be required to re-authenticate themselves by entering their password (or ideally using MFA), in order to prevent an attacker updating the questions if they gain temporary access to the user's account.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語訳</span>

#### 回答の更新

利用者が秘密の質問への回答を更新するとき、この操作はアプリケーション内の機微な操作として扱うべきです。そのため、攻撃者が利用者のアカウントへ一時的にアクセスできた場合に質問を更新することを防ぐため、利用者にはパスワードの入力、または理想的には MFA の使用による再認証を求めるべきです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Multiple Security Questions

When security questions are used, the user can either be asked a single question, or can be asked multiple questions at the same time. This provides a greater level of assurance, especially if the questions are diverse, as an attacker would need to obtain more information about the target user. A mixture of user-defined and system-defined questions can be very effective for this.

If the user is asked a single question out of a bank of possible questions, then this question **should not** be changed until the user has answered it correctly. If the attacker is allowed to try answering all of the different security questions, this greatly increases the chance that they will be able to guess or obtain the answer to one of them.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語訳</span>

#### 複数の秘密の質問

秘密の質問を使用する場合、利用者には単一の質問を尋ねることも、複数の質問を同時に尋ねることもできます。複数の質問、特に多様な質問を使うと、攻撃者は対象利用者についてより多くの情報を入手する必要があるため、より高い保証レベルを提供できます。利用者定義の質問とシステム定義の質問を組み合わせることは非常に効果的です。

利用者に、候補となる質問群から単一の質問を提示する場合、その質問は、利用者が正しく答えるまで変更**すべきではありません**。攻撃者が異なる秘密の質問すべてに回答を試せるようにしてしまうと、攻撃者がそのうち一つの答えを推測または入手できる可能性が大幅に高まります。

</div>
</div>

</section>
</div>

## Attribution

<div className="attributionFooter">

- Original: Choosing and Using Security Questions Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Choosing_and_Using_Security_Questions_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: English original retained for comparison. Japanese translation added. Bilingual display generated from official source and local Japanese translation.
- Retrieved: 2026-05-21

</div>
