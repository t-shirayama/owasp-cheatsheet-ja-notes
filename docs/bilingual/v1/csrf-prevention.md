# Cross-Site Request Forgery Prevention Cheat Sheet

<div className="docHero">
  <span className="docPill">ASVS bilingual view</span>
  <p className="docSubtitle">CSRF防止チートシート</p>
  <div className="docMeta">
    <span className="docPill">Retrieved: 2026-05-20</span>
    <span className="docPill">Category: Encoding and Sanitization</span>
    <span className="docPill">ASVS: V1.3, V3, V4</span>
    <span className="docPill">Unofficial translation</span>
  </div>
</div>

<div className="tabbedContent">
  <input className="tabInput" type="radio" name="csrf-prevention-view" id="csrf-prevention-translation" defaultChecked />
  <input className="tabInput" type="radio" name="csrf-prevention-view" id="csrf-prevention-summary" />
  <input className="tabInput" type="radio" name="csrf-prevention-view" id="csrf-prevention-checklist" />
  <input className="tabInput" type="radio" name="csrf-prevention-view" id="csrf-prevention-bilingual" />

  <div className="contentTabs">
    <label htmlFor="csrf-prevention-translation">翻訳</label>
    <label htmlFor="csrf-prevention-summary">要点</label>
    <label htmlFor="csrf-prevention-checklist">チェックリスト</label>
    <label htmlFor="csrf-prevention-bilingual">対比表示</label>
  </div>

  <section className="tabPanel translationPanel contentPanel">
    <h2>翻訳</h2>
    <p>CSRF は、ユーザーの認証済み状態を悪用して意図しないリクエストを送らせる攻撃です。トークン、SameSite Cookie、Origin/Referer 検証、危険操作の再認証を組み合わせて防ぎます。</p>
  </section>

  <section className="tabPanel summaryPanel contentPanel">
    <h2>要点</h2>
    <ul>
      <li>状態変更リクエストに CSRF トークンを要求する。</li>
      <li>Cookie に SameSite 属性を設定する。</li>
      <li>Origin または Referer を補助的に検証する。</li>
      <li>XSS が CSRF 対策を迂回し得ることを前提に、XSS 対策も同時に行う。</li>
    </ul>
  </section>

  <section className="tabPanel checklistPanel contentPanel">
    <h2>チェックリスト</h2>
    <ul className="checklistView">
      <li><input type="checkbox" disabled />POST/PUT/PATCH/DELETE に CSRF 対策を適用する。</li>
      <li><input type="checkbox" disabled />トークンをセッションまたはリクエストに安全に紐付ける。</li>
      <li><input type="checkbox" disabled />SameSite 属性を用途に応じて設定する。</li>
      <li><input type="checkbox" disabled />重要操作では再認証や追加確認を行う。</li>
      <li><input type="checkbox" disabled />CSRF 対策を自動テストする。</li>
    </ul>
  </section>

  <section className="tabPanel bilingualPanel">
    <h2>対比表示</h2>

<div className="noticeBox">
  初期版では、対訳 UI と運用形を確認するため、導入、主要原則、トークンベース対策を先行して対訳化しています。全文展開時は同じカード形式で残りの原文段落を追加します。
</div>

## Introduction

<div className="bilingualPair">
  <div className="bilingualBlock english">
    <span className="bilingualLabel english">English (原文)</span>
    <p>A Cross-Site Request Forgery (CSRF) attack occurs when a malicious web site, email, blog, instant message, or program tricks an authenticated user's web browser into performing an unwanted action on a trusted site.</p>
  </div>
  <div className="bilingualBlock japanese">
    <span className="bilingualLabel japanese">日本語 (翻訳)</span>
    <p>Cross-Site Request Forgery (CSRF) 攻撃は、悪意ある Web サイト、メール、ブログ、インスタントメッセージ、プログラムなどが、認証済みユーザーのブラウザをだまして、信頼されたサイト上で望まない操作を実行させるときに発生します。</p>
  </div>
</div>

<div className="bilingualPair">
  <div className="bilingualBlock english">
    <span className="bilingualLabel english">English (原文)</span>
    <p>If a target user is authenticated to the site, unprotected target sites cannot distinguish between legitimate authorized requests and forged authenticated requests.</p>
  </div>
  <div className="bilingualBlock japanese">
    <span className="bilingualLabel japanese">日本語 (翻訳)</span>
    <p>対象ユーザーがそのサイトに認証済みである場合、保護されていない対象サイトは、正当な認可済みリクエストと偽造された認証済みリクエストを区別できません。</p>
  </div>
</div>

<div className="bilingualPair">
  <div className="bilingualBlock english">
    <span className="bilingualLabel english">English (原文)</span>
    <p>Since browser requests automatically include all cookies including session cookies, this attack works unless proper authorization is used and the target site's challenge-response mechanism verifies the identity and authority of the requester.</p>
  </div>
  <div className="bilingualBlock japanese">
    <span className="bilingualLabel japanese">日本語 (翻訳)</span>
    <p>ブラウザのリクエストにはセッション Cookie を含むすべての Cookie が自動的に含まれるため、適切な認可が使われ、対象サイトのチャレンジレスポンス機構がリクエスト実行者の本人性と権限を検証していない限り、この攻撃は成立します。</p>
  </div>
</div>

<div className="bilingualPair">
  <div className="bilingualBlock english">
    <span className="bilingualLabel english">English (原文)</span>
    <p>Successful CSRF attacks can only exploit the capabilities exposed by the vulnerable application and the user's privileges. Depending on the user's credentials, the attacker can transfer funds, change a password, make an unauthorized purchase, elevate privileges for a target account, or take any action that the user is permitted to do.</p>
  </div>
  <div className="bilingualBlock japanese">
    <span className="bilingualLabel japanese">日本語 (翻訳)</span>
    <p>成功した CSRF 攻撃が悪用できるのは、脆弱なアプリケーションが公開している機能と、そのユーザーの権限に限られます。ユーザーの認証情報に応じて、攻撃者は送金、パスワード変更、不正購入、対象アカウントの権限昇格、またはユーザーに許可された任意の操作を実行できる可能性があります。</p>
  </div>
</div>

## Core Principles

<div className="bilingualPair">
  <div className="bilingualBlock english">
    <span className="bilingualLabel english">English (原文)</span>
    <p>Remember that Cross-Site Scripting (XSS) can defeat all CSRF mitigation techniques. CSRF tokens remain essential for web applications that rely on cookies for authentication, but the client and authentication method should determine the best approach for CSRF protection.</p>
  </div>
  <div className="bilingualBlock japanese">
    <span className="bilingualLabel japanese">日本語 (翻訳)</span>
    <p>Cross-Site Scripting (XSS) はすべての CSRF 緩和策を破れる可能性があることを忘れてはいけません。Cookie 認証に依存する Web アプリケーションでは CSRF トークンは依然として必須ですが、最適な CSRF 保護方式はクライアントと認証方式に基づいて決める必要があります。</p>
  </div>
</div>

<div className="bilingualPair">
  <div className="bilingualBlock english">
    <span className="bilingualLabel english">English (原文)</span>
    <p>First, check if your framework has built-in CSRF protection and use it. If the framework does not have built-in CSRF protection, add CSRF tokens to all state-changing requests and validate them on the backend.</p>
  </div>
  <div className="bilingualBlock japanese">
    <span className="bilingualLabel japanese">日本語 (翻訳)</span>
    <p>まず、利用しているフレームワークに組み込みの CSRF 保護があるかを確認し、それを使用します。フレームワークに組み込みの CSRF 保護がない場合は、すべての状態変更リクエストに CSRF トークンを追加し、バックエンドで検証します。</p>
  </div>
</div>

<div className="bilingualPair">
  <div className="bilingualBlock english">
    <span className="bilingualLabel english">English (原文)</span>
    <p>Do not use GET requests for state changing operations. If for any reason you do it, protect those resources against CSRF.</p>
  </div>
  <div className="bilingualBlock japanese">
    <span className="bilingualLabel japanese">日本語 (翻訳)</span>
    <p>状態を変更する操作に GET リクエストを使用してはいけません。何らかの理由で使用する場合は、そのリソースにも CSRF 対策を適用します。</p>
  </div>
</div>

## Token-Based Mitigation

<div className="bilingualPair">
  <div className="bilingualBlock english">
    <span className="bilingualLabel english">English (原文)</span>
    <p>The synchronizer token pattern is one of the most popular and recommended methods to mitigate CSRF.</p>
  </div>
  <div className="bilingualBlock japanese">
    <span className="bilingualLabel japanese">日本語 (翻訳)</span>
    <p>Synchronizer Token Pattern は、CSRF を緩和するための最も一般的で推奨される方法の一つです。</p>
  </div>
</div>

<div className="bilingualPair">
  <div className="bilingualBlock english">
    <span className="bilingualLabel english">English (原文)</span>
    <p>CSRF tokens should be generated on the server side and generated only once per user session or once for each request. Per-request tokens are more secure because the time range for an attacker to exploit stolen tokens is minimal, but they may introduce usability concerns.</p>
  </div>
  <div className="bilingualBlock japanese">
    <span className="bilingualLabel japanese">日本語 (翻訳)</span>
    <p>CSRF トークンはサーバー側で生成し、ユーザーセッションごと、またはリクエストごとに生成する必要があります。リクエストごとのトークンは、盗まれたトークンを攻撃者が悪用できる時間が最小になるためより安全ですが、ユーザビリティ上の懸念を生むことがあります。</p>
  </div>
</div>

<div className="bilingualPair">
  <div className="bilingualBlock english">
    <span className="bilingualLabel english">English (原文)</span>
    <p>When a client issues a request, the server-side component must verify the existence and validity of the token in that request and compare it to the token found in the user session. The request should be rejected if the token is missing or does not match.</p>
  </div>
  <div className="bilingualBlock japanese">
    <span className="bilingualLabel japanese">日本語 (翻訳)</span>
    <p>クライアントがリクエストを発行するとき、サーバー側コンポーネントはそのリクエスト内のトークンの存在と妥当性を確認し、ユーザーセッション内のトークンと比較する必要があります。トークンがない場合、または一致しない場合は、リクエストを拒否します。</p>
  </div>
</div>

<div className="bilingualPair">
  <div className="bilingualBlock english">
    <span className="bilingualLabel english">English (原文)</span>
    <p>CSRF tokens should be unique per user session, secret, and unpredictable, using a large random value generated by a secure method.</p>
  </div>
  <div className="bilingualBlock japanese">
    <span className="bilingualLabel japanese">日本語 (翻訳)</span>
    <p>CSRF トークンはユーザーセッションごとに一意で、秘密であり、安全な方法で生成された大きな乱数値として予測困難である必要があります。</p>
  </div>
</div>

  </section>
</div>

## Attribution

<div className="attributionFooter">

- Original: Cross-Site Request Forgery Prevention Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: English original retained for comparison. Japanese translation added.
- Retrieved: 2026-05-20

</div>
