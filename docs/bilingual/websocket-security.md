---
title: WebSocket Security Cheat Sheet
hide_title: true
---

<div className="docHero" data-category="asvs-v4">
  <h1>WebSocket セキュリティチートシート</h1>
  <div className="docMeta">
    <span className="docPill">最終更新: 2026-05-20</span>
    <span className="docPill">読了時間: 準備中</span>
    <span className="docPill">カテゴリ: API と Web サービス</span>
  </div>
</div>

<p className="docLead">WebSocket セキュリティチートシートを、原文・翻訳・対比表示で確認できます。ASVS Index 対応の文脈で、公式原文と日本語訳を確認しやすく整理しています。</p>

<div className="tabbedContent">
  <input className="tabInput" type="radio" name="websocket-security-view" id="websocket-security-original" />
  <input className="tabInput" type="radio" name="websocket-security-view" id="websocket-security-translation" defaultChecked />
  <input className="tabInput" type="radio" name="websocket-security-view" id="websocket-security-bilingual" />

  <div className="contentTabs">
    <label htmlFor="websocket-security-original" title="OWASP 原文">原文</label>
    <label htmlFor="websocket-security-translation" title="日本語訳">翻訳</label>
    <label htmlFor="websocket-security-bilingual" title="原文と翻訳を並べて確認">対比表示</label>
  </div>

<section id="websocket-security-original-panel" className="tabPanel originalPanel contentPanel">

## Introduction

WebSockets enable real-time, bidirectional communication between clients and servers, powering applications like chat systems, live trading platforms, and collaborative tools. Unlike traditional HTTP requests, WebSocket connections remain open and allow continuous data exchange.

However, WebSockets introduce security challenges that differ from standard web application security:

- **Cross-Site WebSocket Hijacking (CSWSH)**: Attackers hijack authenticated connections from malicious websites
- **Authentication bypass**: No built-in authentication makes access control easy to forget
- **Injection attacks**: WebSocket messages can carry XSS, SQL injection, and other malicious payloads
- **Denial-of-service**: Persistent connections enable new DoS attack vectors like connection exhaustion
- **Monitoring gaps**: Traditional HTTP logs only capture the initial upgrade request, missing all message traffic

**Real-world vulnerabilities:**

- **Gitpod CSWSH (2023)**: [Insufficient origin validation](https://github.com/advisories/GHSA-f53g-frr2-jhpf) allowed full account takeover via hijacked WebSocket connections
- **Spring RCE vulnerability**: [CVE-2018-1270](https://spring.io/security/cve-2018-1270) let attackers execute code through crafted STOMP messages

## Primary Defenses

### Transport Security

#### Always Use WSS (WebSocket Secure)

Never use unencrypted `ws://` connections in production. Unencrypted `ws://` connections allow eavesdropping and tampering.

```javascript
// Secure - always use this
const socket = new WebSocket('wss://app.example.com/socket');

// Insecure - never use in production
// const socket = new WebSocket('ws://app.example.com/socket');
```text

See the [Transport Layer Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html) for more details.

#### WebSocket Protocol Configuration

**Use modern protocol versions:**

Only support [RFC 6455](https://datatracker.ietf.org/doc/html/rfc6455) (the current WebSocket standard). Drop backward compatibility for outdated versions like [Hixie-76](https://datatracker.ietf.org/doc/html/draft-hixie-thewebsocketprotocol-76) and [hybi-00](https://datatracker.ietf.org/doc/html/draft-ietf-hybi-thewebsocketprotocol-00) which have known security vulnerabilities.

**Compression security:**

Disable `permessage-deflate` compression unless specifically needed. Compression can introduce security vulnerabilities similar to CRIME/BREACH attacks where compression combined with secret data can leak information.

```javascript
// Node.js - disable compression for security
const wss = new WebSocket.Server({
  perMessageDeflate: false
});
```text

#### Infrastructure Configuration

**Proxy and load balancer support:**

Ensure reverse proxies, load balancers, and CDNs are configured to handle WebSocket upgrades:

- Configure proxy to support HTTP/1.1 upgrade mechanism
- Pass `Upgrade` and `Connection: upgrade` headers correctly
- Set proper read timeouts for long-lived connections
- Ensure WebSocket traffic isn't blocked by security policies

**WAF support:**

Check that your WAF supports WebSocket traffic inspection beyond the initial handshake. If not, rely on server-side validation and application logging.

### Authentication and Authorization

WebSockets don't have built-in authentication. Browsers include cookies in WebSocket handshake requests, making WebSocket applications vulnerable to Cross-Site WebSocket Hijacking (CSWSH).

CSWSH allows attackers to hijack authenticated WebSocket connections from malicious websites:

1. User logs into your application (session cookie established)
2. User later visits a malicious website
3. Malicious site opens WebSocket to your application, browser sends cookies automatically
4. Server accepts the connection → attacker gets live, authenticated WebSocket access

#### Origin Header Validation

Validate the `Origin` header on every handshake. Always use an explicit allowlist of trusted origins. Browsers include this header and malicious JavaScript cannot override it.

```javascript
const wss = new WebSocket.Server({
  verifyClient: (info) => {
    const allowedOrigins = ['https://app.example.com'];
    if (!allowedOrigins.includes(info.origin)) {
      console.log(`Rejected unauthorized origin: ${info.origin}`);
      return false;
    }
    return true;
  }
});
```text

**Important:** Use an allowlist, not a denylist. Avoid wildcards or substring matching which are error-prone.

#### Additional CSWSH Protections

For applications already using CSRF protection, include **CSRF tokens** in WebSocket handshakes.

#### Session Management

WebSocket connections often outlive normal sessions, requiring special handling.

**Use SameSite cookies** (`SameSite=Lax` or `Strict`) to prevent cross-site cookie transmission and strengthen CSWSH defenses.

**Handle session expiration** by implementing server-side validation for long-running connections. Close WebSocket connections when sessions expire. Re-validate user sessions periodically (every 30 minutes is common) to ensure they remain valid.

```javascript
// Example: Close WebSocket on session expiry
function validateSession(ws, sessionId) {
  if (!isSessionValid(sessionId)) {
    ws.close(1008, 'Session expired');
    return false;
  }
  return true;
}
```text

**When users log out**, close all their WebSocket connections immediately. Maintain a mapping of sessions to active connections so you can invalidate WebSocket access the moment logout occurs.

**Token-based authentication:**

For enhanced security, use token-based authentication instead of relying solely on cookies. Tokens can be passed in query strings (note: tokens will appear in access logs and should be redacted) or as part of WebSocket messages after connection establishment. Message-based token passing avoids log exposure but requires protocol design considerations.

**Token refresh:**

Rotate tokens in long-lived connections to prevent hijacked sessions from persisting.

#### Message-Level Authorization

Don't assume WebSocket connection equals unlimited access. Check authorization for each action:

```javascript
ws.on('message', (data) => {
  const message = JSON.parse(data);

  // Check authorization for each action
  if (message.action === 'delete_user' && !user.hasRole('admin')) {
    ws.send(JSON.stringify({type: 'error', message: 'Access denied'}));
    return;
  }

  handleAuthorizedMessage(ws, user, message);
});
```text

### Input Validation

Treat all WebSocket messages as untrusted input. WebSocket messages can carry injection payloads such as SQLi, XSS, and command injection.

**Validate message structure and content** using JSON schemas and allow-lists. Set reasonable size limits (typically 64KB or less) and implement rate limiting to prevent message flooding.

**For binary data**, verify file types using magic numbers rather than trusting content-type headers. Scan uploads for malware when appropriate, and use safe deserialization for protocols like protobuf or MessagePack.

```javascript
ws.on('message', (data, isBinary) => {
  if (isBinary) {
    // Validate binary data
    if (data.length > MAX_BINARY_SIZE) {
      ws.close(1009, 'Message too large');
      return;
    }

    // Check file type by magic numbers
    if (!isValidFileType(data)) {
      ws.close(1008, 'Invalid file type');
      return;
    }
  }

  processBinaryData(data);
});
```text

**To prevent message replay attacks** include timestamps or nonces in messages and reject duplicates to ensure old messages cannot be maliciously resent.

```javascript
ws.on('message', (data) => {
  const message = JSON.parse(data);

  // Check timestamp or nonce to prevent replay
  if (!isValidNonce(message.nonce)) {
    ws.close(1008, 'Replay detected');
    return;
  }

  processMessage(message);
});
```text

**Always use `JSON.parse()` instead of `eval()`** for JSON processing - `eval()` enables code execution from untrusted input.

```javascript
// Safe
const message = JSON.parse(data);

// Dangerous - enables code execution
// const message = eval('(' + data + ')');
```text

See the [Input Validation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html) for more details.

### Service Tunneling Risks

While WebSockets can tunnel TCP services (VNC, FTP, SSH), this creates security risks. If your application has XSS vulnerabilities, attackers could access these services directly from victims' browsers. If tunneling is necessary, implement additional authentication and access controls beyond the WebSocket layer.

### Denial-of-Service Protection

Persistent WebSocket connections increase DoS risk.

**Limit connections and resources** by restricting total connections and implementing per-user limits (preferred) or per-IP limits where user identification isn't available. Set **message size limits** (typically 64KB or less) and implement **rate limiting** to prevent message flooding - 100 messages per minute is a common starting point.

**Handle idle and dead connections** by implementing idle timeouts to close inactive connections. Use **heartbeat monitoring** with ping/pong frames to detect and clean up dead connections.

**Implement backpressure controls** to prevent memory exhaustion from fast message producers. Many WebSocket implementations lack proper flow control, allowing attackers to overwhelm server memory by sending messages faster than they can be processed.

```javascript
const wss = new WebSocket.Server({
  maxPayload: 64 * 1024
});
```text

### Security Monitoring and Logging

Traditional HTTP access logs only capture the initial WebSocket upgrade request, not subsequent message traffic. You'll miss auth failures, injection attempts, rate-limit violations, and abuse.

**Log WebSocket events** including connection establishment and termination (with user identity, IP, and origin), authentication and authorization events during handshake and message processing, security violations like rate limiting triggers and message validation failures, and abnormal disconnections and protocol errors.

**Avoid logging sensitive data** - never log complete message contents, authentication tokens, session IDs, or personal information that could violate privacy regulations.

See the [Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html) for more details.

### Testing WebSocket Security

**Key security tests:**

- **Origin validation**: Connect from unauthorized domains
- **Authentication bypass**: Attempt connections without proper credentials
- **Message injection**: Send XSS, SQL injection, and command injection payloads
- **DoS resistance**: Test connection limits, message flooding, and oversized messages
- **Session management**: Test session expiration and logout handling

**Testing tools:**

- Browser developer tools for manual testing
- [wscat](https://github.com/websockets/wscat) for command-line WebSocket connections
- Custom scripts for automated vulnerability testing
- OWASP ZAP (includes WebSocket security testing features)

### Framework-Specific Best Practices

**Node.js:** Use the `verifyClient` callback for origin and authentication checks, set `maxPayload` limits, and disable `perMessageDeflate` compression to prevent security issues.

**Python:** With Django Channels, implement authentication middleware and origin validation. Use async exception handling to prevent application crashes from malformed WebSocket messages.

**Java Spring:** Configure allowed origins explicitly and integrate Spring Security for authorization. Set message size limits in your WebSocket container configuration to prevent resource exhaustion.

**Go:** When using Gorilla WebSocket, implement validation in your `CheckOrigin` function - don't just return `true`. Set read limits, implement timeouts, and use context cancellation for graceful connection cleanup.

#### Keep Dependencies Updated

Regularly update WebSocket libraries and monitor security advisories. Past versions of popular libraries (`ws`, Spring STOMP, Python `websockets`) have had critical security vulnerabilities including DoS and RCE issues.

</section>

<section id="websocket-security-translation-panel" className="tabPanel translationPanel contentPanel">

## はじめに

WebSocket は、クライアントとサーバー間のリアルタイムな双方向通信を可能にし、チャットシステム、ライブ取引プラットフォーム、共同編集ツールなどのアプリケーションを支えます。従来の HTTP リクエストと異なり、WebSocket 接続は開いたまま維持され、継続的なデータ交換を可能にします。

しかし、WebSocket には標準的な Web アプリケーションセキュリティとは異なるセキュリティ上の課題があります。

- **Cross-Site WebSocket Hijacking (CSWSH)**: 攻撃者が悪意のある Web サイトから認証済み接続を乗っ取る
- **認証バイパス**: 組み込みの認証がないため、アクセス制御を忘れやすい
- **インジェクション攻撃**: WebSocket メッセージは XSS、SQL インジェクション、その他の悪意あるペイロードを運ぶ可能性がある
- **サービス拒否**: 永続接続により、接続枯渇などの新しい DoS 攻撃ベクトルが生じる
- **監視の抜け**: 従来の HTTP ログは最初のアップグレードリクエストしか記録せず、すべてのメッセージトラフィックを見逃す

**実際の脆弱性:**

- **Gitpod CSWSH (2023)**: [不十分な origin 検証](https://github.com/advisories/GHSA-f53g-frr2-jhpf)により、乗っ取られた WebSocket 接続を通じてアカウントの完全な乗っ取りが可能になった
- **Spring RCE 脆弱性**: [CVE-2018-1270](https://spring.io/security/cve-2018-1270) により、攻撃者が細工した STOMP メッセージを通じてコードを実行できた

## 主要な防御策

### トランスポートセキュリティ

#### 常に WSS (WebSocket Secure) を使用する

本番環境では暗号化されていない `ws://` 接続を決して使用しないでください。暗号化されていない `ws://` 接続は、盗聴や改ざんを許します。

```javascript
// Secure - always use this
const socket = new WebSocket('wss://app.example.com/socket');

// Insecure - never use in production
// const socket = new WebSocket('ws://app.example.com/socket');
```text

詳細は [Transport Layer Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html) を参照してください。

#### WebSocket プロトコル設定

**最新のプロトコルバージョンを使用する:**

現在の WebSocket 標準である [RFC 6455](https://datatracker.ietf.org/doc/html/rfc6455) のみをサポートしてください。既知のセキュリティ脆弱性がある [Hixie-76](https://datatracker.ietf.org/doc/html/draft-hixie-thewebsocketprotocol-76) や [hybi-00](https://datatracker.ietf.org/doc/html/draft-ietf-hybi-thewebsocketprotocol-00) のような古いバージョンとの後方互換性は廃止してください。

**圧縮のセキュリティ:**

明確に必要な場合を除き、`permessage-deflate` 圧縮を無効化してください。圧縮は、秘密データと組み合わさることで情報漏えいにつながる CRIME/BREACH 攻撃に似たセキュリティ脆弱性を生む可能性があります。

```javascript
// Node.js - disable compression for security
const wss = new WebSocket.Server({
  perMessageDeflate: false
});
```text

#### インフラストラクチャ設定

**プロキシとロードバランサーのサポート:**

リバースプロキシ、ロードバランサー、CDN が WebSocket アップグレードを処理できるように設定されていることを確認してください。

- HTTP/1.1 アップグレード機構をサポートするようにプロキシを設定する
- `Upgrade` ヘッダーと `Connection: upgrade` ヘッダーを正しく渡す
- 長時間維持される接続に適切な読み取りタイムアウトを設定する
- WebSocket トラフィックがセキュリティポリシーによってブロックされないようにする

**WAF サポート:**

使用している WAF が、最初のハンドシェイクだけでなく WebSocket トラフィックの検査をサポートしているか確認してください。サポートしていない場合は、サーバー側の検証とアプリケーションログに依存してください。

### 認証と認可

WebSocket には組み込みの認証がありません。ブラウザは WebSocket ハンドシェイクリクエストに Cookie を含めるため、WebSocket アプリケーションは Cross-Site WebSocket Hijacking (CSWSH) に対して脆弱になります。

CSWSH では、攻撃者が悪意のある Web サイトから認証済み WebSocket 接続を乗っ取ることができます。

1. ユーザーがアプリケーションにログインする (セッション Cookie が確立される)
2. その後、ユーザーが悪意のある Web サイトにアクセスする
3. 悪意のあるサイトがアプリケーションへの WebSocket を開き、ブラウザが Cookie を自動的に送信する
4. サーバーが接続を受け入れる → 攻撃者がライブの認証済み WebSocket アクセスを得る

#### Origin ヘッダー検証

すべてのハンドシェイクで `Origin` ヘッダーを検証してください。常に信頼済み origin の明示的な許可リストを使用してください。ブラウザはこのヘッダーを含め、悪意のある JavaScript はこれを上書きできません。

```javascript
const wss = new WebSocket.Server({
  verifyClient: (info) => {
    const allowedOrigins = ['https://app.example.com'];
    if (!allowedOrigins.includes(info.origin)) {
      console.log(`Rejected unauthorized origin: ${info.origin}`);
      return false;
    }
    return true;
  }
});
```text

**重要:** 拒否リストではなく許可リストを使用してください。ワイルドカードや部分文字列一致は誤りやすいため避けてください。

#### 追加の CSWSH 防御策

すでに CSRF 防御を使用しているアプリケーションでは、WebSocket ハンドシェイクに **CSRF トークン**を含めてください。

#### セッション管理

WebSocket 接続は通常のセッションより長く存続することが多く、特別な対応が必要です。

**SameSite Cookie を使用**し (`SameSite=Lax` または `Strict`)、クロスサイトでの Cookie 送信を防ぎ、CSWSH に対する防御を強化してください。

長時間実行される接続では、サーバー側の検証を実装して**セッションの有効期限を処理**してください。セッションが期限切れになったら WebSocket 接続を閉じてください。ユーザーセッションが引き続き有効であることを確認するため、定期的に再検証してください (30 分ごとが一般的です)。

```javascript
// Example: Close WebSocket on session expiry
function validateSession(ws, sessionId) {
  if (!isSessionValid(sessionId)) {
    ws.close(1008, 'Session expired');
    return false;
  }
  return true;
}
```text

**ユーザーがログアウトしたとき**は、そのユーザーのすべての WebSocket 接続をただちに閉じてください。ログアウトが発生した瞬間に WebSocket アクセスを無効化できるよう、セッションとアクティブな接続の対応関係を維持してください。

**トークンベース認証:**

セキュリティを高めるには、Cookie だけに依存せず、トークンベース認証を使用してください。トークンはクエリ文字列で渡すことができます (注意: トークンはアクセスログに現れるため、秘匿化する必要があります)。または、接続確立後の WebSocket メッセージの一部として渡すこともできます。メッセージベースでトークンを渡すとログへの露出は避けられますが、プロトコル設計上の検討が必要です。

**トークン更新:**

長時間維持される接続では、乗っ取られたセッションが存続し続けることを防ぐため、トークンをローテーションしてください。

#### メッセージレベルの認可

WebSocket 接続があることを、無制限のアクセス権があることと見なしてはいけません。各アクションごとに認可を確認してください。

```javascript
ws.on('message', (data) => {
  const message = JSON.parse(data);

  // Check authorization for each action
  if (message.action === 'delete_user' && !user.hasRole('admin')) {
    ws.send(JSON.stringify({type: 'error', message: 'Access denied'}));
    return;
  }

  handleAuthorizedMessage(ws, user, message);
});
```text

### 入力検証

すべての WebSocket メッセージを信頼できない入力として扱ってください。WebSocket メッセージは、SQLi、XSS、コマンドインジェクションなどのインジェクションペイロードを運ぶ可能性があります。

JSON スキーマと許可リストを使用して、**メッセージ構造と内容を検証**してください。妥当なサイズ制限 (通常は 64KB 以下) を設定し、メッセージフラッディングを防ぐためにレート制限を実装してください。

**バイナリデータ**については、content-type ヘッダーを信頼するのではなく、マジックナンバーを使用してファイルタイプを検証してください。必要に応じてアップロードをマルウェアスキャンし、protobuf や MessagePack などのプロトコルでは安全なデシリアライズを使用してください。

```javascript
ws.on('message', (data, isBinary) => {
  if (isBinary) {
    // Validate binary data
    if (data.length > MAX_BINARY_SIZE) {
      ws.close(1009, 'Message too large');
      return;
    }

    // Check file type by magic numbers
    if (!isValidFileType(data)) {
      ws.close(1008, 'Invalid file type');
      return;
    }
  }

  processBinaryData(data);
});
```text

**メッセージリプレイ攻撃を防ぐため**、メッセージにタイムスタンプまたは nonce を含め、重複を拒否して、古いメッセージが悪意を持って再送されないようにしてください。

```javascript
ws.on('message', (data) => {
  const message = JSON.parse(data);

  // Check timestamp or nonce to prevent replay
  if (!isValidNonce(message.nonce)) {
    ws.close(1008, 'Replay detected');
    return;
  }

  processMessage(message);
});
```text

JSON 処理では、**常に `eval()` ではなく `JSON.parse()` を使用**してください。`eval()` は信頼できない入力からのコード実行を可能にします。

```javascript
// Safe
const message = JSON.parse(data);

// Dangerous - enables code execution
// const message = eval('(' + data + ')');
```text

詳細は [Input Validation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html) を参照してください。

### サービストンネリングのリスク

WebSocket は TCP サービス (VNC、FTP、SSH) をトンネリングできますが、これはセキュリティリスクを生みます。アプリケーションに XSS 脆弱性がある場合、攻撃者は被害者のブラウザからこれらのサービスへ直接アクセスできる可能性があります。トンネリングが必要な場合は、WebSocket 層を超えた追加の認証とアクセス制御を実装してください。

### サービス拒否への防御

永続的な WebSocket 接続は DoS リスクを高めます。

総接続数を制限し、ユーザー識別が可能な場合はユーザーごとの制限 (推奨)、利用できない場合は IP ごとの制限を実装して、**接続とリソースを制限**してください。**メッセージサイズ制限** (通常は 64KB 以下) を設定し、メッセージフラッディングを防ぐために**レート制限**を実装してください。1 分あたり 100 メッセージが一般的な開始点です。

非アクティブな接続を閉じるアイドルタイムアウトを実装して、**アイドル状態または死んだ接続を処理**してください。ping/pong フレームによる**ハートビート監視**を使用し、死んだ接続を検出してクリーンアップしてください。

高速なメッセージ送信元によるメモリ枯渇を防ぐため、**バックプレッシャー制御を実装**してください。多くの WebSocket 実装には適切なフロー制御がなく、攻撃者が処理能力を超える速度でメッセージを送信することで、サーバーメモリを圧迫できてしまいます。

```javascript
const wss = new WebSocket.Server({
  maxPayload: 64 * 1024
});
```text

### セキュリティ監視とログ記録

従来の HTTP アクセスログは、最初の WebSocket アップグレードリクエストだけを記録し、その後のメッセージトラフィックは記録しません。そのため、認証失敗、インジェクションの試行、レート制限違反、不正利用を見逃します。

**WebSocket イベントをログ記録**してください。これには、接続の確立と終了 (ユーザー ID、IP、origin を含む)、ハンドシェイクおよびメッセージ処理中の認証・認可イベント、レート制限の発火やメッセージ検証失敗などのセキュリティ違反、異常切断やプロトコルエラーが含まれます。

**機密データのログ記録を避けてください**。完全なメッセージ内容、認証トークン、セッション ID、プライバシー規制に違反する可能性のある個人情報を決してログに記録しないでください。

詳細は [Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html) を参照してください。

### WebSocket セキュリティのテスト

**主要なセキュリティテスト:**

- **Origin 検証**: 許可されていないドメインから接続する
- **認証バイパス**: 適切な認証情報なしで接続を試みる
- **メッセージインジェクション**: XSS、SQL インジェクション、コマンドインジェクションのペイロードを送信する
- **DoS 耐性**: 接続制限、メッセージフラッディング、過大なメッセージをテストする
- **セッション管理**: セッション有効期限とログアウト処理をテストする

**テストツール:**

- 手動テスト用のブラウザ開発者ツール
- コマンドライン WebSocket 接続用の [wscat](https://github.com/websockets/wscat)
- 自動脆弱性テスト用のカスタムスクリプト
- OWASP ZAP (WebSocket セキュリティテスト機能を含む)

### フレームワーク固有のベストプラクティス

**Node.js:** origin と認証のチェックには `verifyClient` コールバックを使用し、`maxPayload` 制限を設定し、セキュリティ上の問題を防ぐために `perMessageDeflate` 圧縮を無効化してください。

**Python:** Django Channels では、認証ミドルウェアと origin 検証を実装してください。不正な形式の WebSocket メッセージによってアプリケーションがクラッシュしないよう、非同期例外処理を使用してください。

**Java Spring:** 許可する origin を明示的に設定し、認可のために Spring Security と統合してください。リソース枯渇を防ぐため、WebSocket コンテナ設定でメッセージサイズ制限を設定してください。

**Go:** Gorilla WebSocket を使用する場合は、`CheckOrigin` 関数で検証を実装してください。単に `true` を返してはいけません。読み取り制限を設定し、タイムアウトを実装し、接続を適切にクリーンアップするためにコンテキストキャンセルを使用してください。

#### 依存関係を最新に保つ

WebSocket ライブラリを定期的に更新し、セキュリティアドバイザリを監視してください。広く使われているライブラリ (`ws`、Spring STOMP、Python `websockets`) の過去のバージョンには、DoS や RCE を含む重大なセキュリティ脆弱性がありました。

</section>

<section id="websocket-security-bilingual-panel" className="tabPanel bilingualPanel">

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Introduction

WebSockets enable real-time, bidirectional communication between clients and servers, powering applications like chat systems, live trading platforms, and collaborative tools. Unlike traditional HTTP requests, WebSocket connections remain open and allow continuous data exchange.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## はじめに

WebSocket は、クライアントとサーバー間のリアルタイムな双方向通信を可能にし、チャットシステム、ライブ取引プラットフォーム、共同編集ツールなどのアプリケーションを支えます。従来の HTTP リクエストと異なり、WebSocket 接続は開いたまま維持され、継続的なデータ交換を可能にします。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

However, WebSockets introduce security challenges that differ from standard web application security:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

しかし、WebSocket には標準的な Web アプリケーションセキュリティとは異なるセキュリティ上の課題があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- **Cross-Site WebSocket Hijacking (CSWSH)**: Attackers hijack authenticated connections from malicious websites
- **Authentication bypass**: No built-in authentication makes access control easy to forget
- **Injection attacks**: WebSocket messages can carry XSS, SQL injection, and other malicious payloads
- **Denial-of-service**: Persistent connections enable new DoS attack vectors like connection exhaustion
- **Monitoring gaps**: Traditional HTTP logs only capture the initial upgrade request, missing all message traffic

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- **Cross-Site WebSocket Hijacking (CSWSH)**: 攻撃者が悪意のある Web サイトから認証済み接続を乗っ取る
- **認証バイパス**: 組み込みの認証がないため、アクセス制御を忘れやすい
- **インジェクション攻撃**: WebSocket メッセージは XSS、SQL インジェクション、その他の悪意あるペイロードを運ぶ可能性がある
- **サービス拒否**: 永続接続により、接続枯渇などの新しい DoS 攻撃ベクトルが生じる
- **監視の抜け**: 従来の HTTP ログは最初のアップグレードリクエストしか記録せず、すべてのメッセージトラフィックを見逃す

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Real-world vulnerabilities:**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**実際の脆弱性:**

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- **Gitpod CSWSH (2023)**: [Insufficient origin validation](https://github.com/advisories/GHSA-f53g-frr2-jhpf) allowed full account takeover via hijacked WebSocket connections
- **Spring RCE vulnerability**: [CVE-2018-1270](https://spring.io/security/cve-2018-1270) let attackers execute code through crafted STOMP messages

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- **Gitpod CSWSH (2023)**: [不十分な origin 検証](https://github.com/advisories/GHSA-f53g-frr2-jhpf)により、乗っ取られた WebSocket 接続を通じてアカウントの完全な乗っ取りが可能になった
- **Spring RCE 脆弱性**: [CVE-2018-1270](https://spring.io/security/cve-2018-1270) により、攻撃者が細工した STOMP メッセージを通じてコードを実行できた

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Primary Defenses

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 主要な防御策

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Transport Security

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### トランスポートセキュリティ

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Always Use WSS (WebSocket Secure)

Never use unencrypted `ws://` connections in production. Unencrypted `ws://` connections allow eavesdropping and tampering.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 常に WSS (WebSocket Secure) を使用する

本番環境では暗号化されていない `ws://` 接続を決して使用しないでください。暗号化されていない `ws://` 接続は、盗聴や改ざんを許します。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```javascript
// Secure - always use this
const socket = new WebSocket('wss://app.example.com/socket');

// Insecure - never use in production
// const socket = new WebSocket('ws://app.example.com/socket');
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

See the [Transport Layer Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html) for more details.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

詳細は [Transport Layer Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html) を参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### WebSocket Protocol Configuration

**Use modern protocol versions:**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### WebSocket プロトコル設定

**最新のプロトコルバージョンを使用する:**

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Only support [RFC 6455](https://datatracker.ietf.org/doc/html/rfc6455) (the current WebSocket standard). Drop backward compatibility for outdated versions like [Hixie-76](https://datatracker.ietf.org/doc/html/draft-hixie-thewebsocketprotocol-76) and [hybi-00](https://datatracker.ietf.org/doc/html/draft-ietf-hybi-thewebsocketprotocol-00) which have known security vulnerabilities.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

現在の WebSocket 標準である [RFC 6455](https://datatracker.ietf.org/doc/html/rfc6455) のみをサポートしてください。既知のセキュリティ脆弱性がある [Hixie-76](https://datatracker.ietf.org/doc/html/draft-hixie-thewebsocketprotocol-76) や [hybi-00](https://datatracker.ietf.org/doc/html/draft-ietf-hybi-thewebsocketprotocol-00) のような古いバージョンとの後方互換性は廃止してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Compression security:**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**圧縮のセキュリティ:**

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Disable `permessage-deflate` compression unless specifically needed. Compression can introduce security vulnerabilities similar to CRIME/BREACH attacks where compression combined with secret data can leak information.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

明確に必要な場合を除き、`permessage-deflate` 圧縮を無効化してください。圧縮は、秘密データと組み合わさることで情報漏えいにつながる CRIME/BREACH 攻撃に似たセキュリティ脆弱性を生む可能性があります。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```javascript
// Node.js - disable compression for security
const wss = new WebSocket.Server({
  perMessageDeflate: false
});
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Infrastructure Configuration

**Proxy and load balancer support:**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### インフラストラクチャ設定

**プロキシとロードバランサーのサポート:**

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Ensure reverse proxies, load balancers, and CDNs are configured to handle WebSocket upgrades:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

リバースプロキシ、ロードバランサー、CDN が WebSocket アップグレードを処理できるように設定されていることを確認してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Configure proxy to support HTTP/1.1 upgrade mechanism
- Pass `Upgrade` and `Connection: upgrade` headers correctly
- Set proper read timeouts for long-lived connections
- Ensure WebSocket traffic isn't blocked by security policies

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- HTTP/1.1 アップグレード機構をサポートするようにプロキシを設定する
- `Upgrade` ヘッダーと `Connection: upgrade` ヘッダーを正しく渡す
- 長時間維持される接続に適切な読み取りタイムアウトを設定する
- WebSocket トラフィックがセキュリティポリシーによってブロックされないようにする

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**WAF support:**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**WAF サポート:**

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Check that your WAF supports WebSocket traffic inspection beyond the initial handshake. If not, rely on server-side validation and application logging.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

使用している WAF が、最初のハンドシェイクだけでなく WebSocket トラフィックの検査をサポートしているか確認してください。サポートしていない場合は、サーバー側の検証とアプリケーションログに依存してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Authentication and Authorization

WebSockets don't have built-in authentication. Browsers include cookies in WebSocket handshake requests, making WebSocket applications vulnerable to Cross-Site WebSocket Hijacking (CSWSH).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 認証と認可

WebSocket には組み込みの認証がありません。ブラウザは WebSocket ハンドシェイクリクエストに Cookie を含めるため、WebSocket アプリケーションは Cross-Site WebSocket Hijacking (CSWSH) に対して脆弱になります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

CSWSH allows attackers to hijack authenticated WebSocket connections from malicious websites:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

CSWSH では、攻撃者が悪意のある Web サイトから認証済み WebSocket 接続を乗っ取ることができます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

1. User logs into your application (session cookie established)
2. User later visits a malicious website
3. Malicious site opens WebSocket to your application, browser sends cookies automatically
4. Server accepts the connection → attacker gets live, authenticated WebSocket access

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

1. ユーザーがアプリケーションにログインする (セッション Cookie が確立される)
2. その後、ユーザーが悪意のある Web サイトにアクセスする
3. 悪意のあるサイトがアプリケーションへの WebSocket を開き、ブラウザが Cookie を自動的に送信する
4. サーバーが接続を受け入れる → 攻撃者がライブの認証済み WebSocket アクセスを得る

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Origin Header Validation

Validate the `Origin` header on every handshake. Always use an explicit allowlist of trusted origins. Browsers include this header and malicious JavaScript cannot override it.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### Origin ヘッダー検証

すべてのハンドシェイクで `Origin` ヘッダーを検証してください。常に信頼済み origin の明示的な許可リストを使用してください。ブラウザはこのヘッダーを含め、悪意のある JavaScript はこれを上書きできません。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```javascript
const wss = new WebSocket.Server({
  verifyClient: (info) => {
    const allowedOrigins = ['https://app.example.com'];
    if (!allowedOrigins.includes(info.origin)) {
      console.log(`Rejected unauthorized origin: ${info.origin}`);
      return false;
    }
    return true;
  }
});
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Important:** Use an allowlist, not a denylist. Avoid wildcards or substring matching which are error-prone.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**重要:** 拒否リストではなく許可リストを使用してください。ワイルドカードや部分文字列一致は誤りやすいため避けてください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Additional CSWSH Protections

For applications already using CSRF protection, include **CSRF tokens** in WebSocket handshakes.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 追加の CSWSH 防御策

すでに CSRF 防御を使用しているアプリケーションでは、WebSocket ハンドシェイクに **CSRF トークン**を含めてください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Session Management

WebSocket connections often outlive normal sessions, requiring special handling.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### セッション管理

WebSocket 接続は通常のセッションより長く存続することが多く、特別な対応が必要です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Use SameSite cookies** (`SameSite=Lax` or `Strict`) to prevent cross-site cookie transmission and strengthen CSWSH defenses.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**SameSite Cookie を使用**し (`SameSite=Lax` または `Strict`)、クロスサイトでの Cookie 送信を防ぎ、CSWSH に対する防御を強化してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Handle session expiration** by implementing server-side validation for long-running connections. Close WebSocket connections when sessions expire. Re-validate user sessions periodically (every 30 minutes is common) to ensure they remain valid.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

長時間実行される接続では、サーバー側の検証を実装して**セッションの有効期限を処理**してください。セッションが期限切れになったら WebSocket 接続を閉じてください。ユーザーセッションが引き続き有効であることを確認するため、定期的に再検証してください (30 分ごとが一般的です)。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```javascript
// Example: Close WebSocket on session expiry
function validateSession(ws, sessionId) {
  if (!isSessionValid(sessionId)) {
    ws.close(1008, 'Session expired');
    return false;
  }
  return true;
}
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**When users log out**, close all their WebSocket connections immediately. Maintain a mapping of sessions to active connections so you can invalidate WebSocket access the moment logout occurs.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**ユーザーがログアウトしたとき**は、そのユーザーのすべての WebSocket 接続をただちに閉じてください。ログアウトが発生した瞬間に WebSocket アクセスを無効化できるよう、セッションとアクティブな接続の対応関係を維持してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Token-based authentication:**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**トークンベース認証:**

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

For enhanced security, use token-based authentication instead of relying solely on cookies. Tokens can be passed in query strings (note: tokens will appear in access logs and should be redacted) or as part of WebSocket messages after connection establishment. Message-based token passing avoids log exposure but requires protocol design considerations.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

セキュリティを高めるには、Cookie だけに依存せず、トークンベース認証を使用してください。トークンはクエリ文字列で渡すことができます (注意: トークンはアクセスログに現れるため、秘匿化する必要があります)。または、接続確立後の WebSocket メッセージの一部として渡すこともできます。メッセージベースでトークンを渡すとログへの露出は避けられますが、プロトコル設計上の検討が必要です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Token refresh:**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**トークン更新:**

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Rotate tokens in long-lived connections to prevent hijacked sessions from persisting.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

長時間維持される接続では、乗っ取られたセッションが存続し続けることを防ぐため、トークンをローテーションしてください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Message-Level Authorization

Don't assume WebSocket connection equals unlimited access. Check authorization for each action:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### メッセージレベルの認可

WebSocket 接続があることを、無制限のアクセス権があることと見なしてはいけません。各アクションごとに認可を確認してください。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```javascript
ws.on('message', (data) => {
  const message = JSON.parse(data);

  // Check authorization for each action
  if (message.action === 'delete_user' && !user.hasRole('admin')) {
    ws.send(JSON.stringify({type: 'error', message: 'Access denied'}));
    return;
  }

  handleAuthorizedMessage(ws, user, message);
});
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Input Validation

Treat all WebSocket messages as untrusted input. WebSocket messages can carry injection payloads such as SQLi, XSS, and command injection.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 入力検証

すべての WebSocket メッセージを信頼できない入力として扱ってください。WebSocket メッセージは、SQLi、XSS、コマンドインジェクションなどのインジェクションペイロードを運ぶ可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Validate message structure and content** using JSON schemas and allow-lists. Set reasonable size limits (typically 64KB or less) and implement rate limiting to prevent message flooding.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

JSON スキーマと許可リストを使用して、**メッセージ構造と内容を検証**してください。妥当なサイズ制限 (通常は 64KB 以下) を設定し、メッセージフラッディングを防ぐためにレート制限を実装してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**For binary data**, verify file types using magic numbers rather than trusting content-type headers. Scan uploads for malware when appropriate, and use safe deserialization for protocols like protobuf or MessagePack.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**バイナリデータ**については、content-type ヘッダーを信頼するのではなく、マジックナンバーを使用してファイルタイプを検証してください。必要に応じてアップロードをマルウェアスキャンし、protobuf や MessagePack などのプロトコルでは安全なデシリアライズを使用してください。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```javascript
ws.on('message', (data, isBinary) => {
  if (isBinary) {
    // Validate binary data
    if (data.length > MAX_BINARY_SIZE) {
      ws.close(1009, 'Message too large');
      return;
    }

    // Check file type by magic numbers
    if (!isValidFileType(data)) {
      ws.close(1008, 'Invalid file type');
      return;
    }
  }

  processBinaryData(data);
});
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**To prevent message replay attacks** include timestamps or nonces in messages and reject duplicates to ensure old messages cannot be maliciously resent.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**メッセージリプレイ攻撃を防ぐため**、メッセージにタイムスタンプまたは nonce を含め、重複を拒否して、古いメッセージが悪意を持って再送されないようにしてください。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```javascript
ws.on('message', (data) => {
  const message = JSON.parse(data);

  // Check timestamp or nonce to prevent replay
  if (!isValidNonce(message.nonce)) {
    ws.close(1008, 'Replay detected');
    return;
  }

  processMessage(message);
});
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Always use `JSON.parse()` instead of `eval()`** for JSON processing - `eval()` enables code execution from untrusted input.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

JSON 処理では、**常に `eval()` ではなく `JSON.parse()` を使用**してください。`eval()` は信頼できない入力からのコード実行を可能にします。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```javascript
// Safe
const message = JSON.parse(data);

// Dangerous - enables code execution
// const message = eval('(' + data + ')');
```html

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

See the [Input Validation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html) for more details.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

詳細は [Input Validation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html) を参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Service Tunneling Risks

While WebSockets can tunnel TCP services (VNC, FTP, SSH), this creates security risks. If your application has XSS vulnerabilities, attackers could access these services directly from victims' browsers. If tunneling is necessary, implement additional authentication and access controls beyond the WebSocket layer.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### サービストンネリングのリスク

WebSocket は TCP サービス (VNC、FTP、SSH) をトンネリングできますが、これはセキュリティリスクを生みます。アプリケーションに XSS 脆弱性がある場合、攻撃者は被害者のブラウザからこれらのサービスへ直接アクセスできる可能性があります。トンネリングが必要な場合は、WebSocket 層を超えた追加の認証とアクセス制御を実装してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Denial-of-Service Protection

Persistent WebSocket connections increase DoS risk.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### サービス拒否への防御

永続的な WebSocket 接続は DoS リスクを高めます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Limit connections and resources** by restricting total connections and implementing per-user limits (preferred) or per-IP limits where user identification isn't available. Set **message size limits** (typically 64KB or less) and implement **rate limiting** to prevent message flooding - 100 messages per minute is a common starting point.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

総接続数を制限し、ユーザー識別が可能な場合はユーザーごとの制限 (推奨)、利用できない場合は IP ごとの制限を実装して、**接続とリソースを制限**してください。**メッセージサイズ制限** (通常は 64KB 以下) を設定し、メッセージフラッディングを防ぐために**レート制限**を実装してください。1 分あたり 100 メッセージが一般的な開始点です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Handle idle and dead connections** by implementing idle timeouts to close inactive connections. Use **heartbeat monitoring** with ping/pong frames to detect and clean up dead connections.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

非アクティブな接続を閉じるアイドルタイムアウトを実装して、**アイドル状態または死んだ接続を処理**してください。ping/pong フレームによる**ハートビート監視**を使用し、死んだ接続を検出してクリーンアップしてください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Implement backpressure controls** to prevent memory exhaustion from fast message producers. Many WebSocket implementations lack proper flow control, allowing attackers to overwhelm server memory by sending messages faster than they can be processed.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

高速なメッセージ送信元によるメモリ枯渇を防ぐため、**バックプレッシャー制御を実装**してください。多くの WebSocket 実装には適切なフロー制御がなく、攻撃者が処理能力を超える速度でメッセージを送信することで、サーバーメモリを圧迫できてしまいます。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```javascript
const wss = new WebSocket.Server({
  maxPayload: 64 * 1024
});
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Security Monitoring and Logging

Traditional HTTP access logs only capture the initial WebSocket upgrade request, not subsequent message traffic. You'll miss auth failures, injection attempts, rate-limit violations, and abuse.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### セキュリティ監視とログ記録

従来の HTTP アクセスログは、最初の WebSocket アップグレードリクエストだけを記録し、その後のメッセージトラフィックは記録しません。そのため、認証失敗、インジェクションの試行、レート制限違反、不正利用を見逃します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Log WebSocket events** including connection establishment and termination (with user identity, IP, and origin), authentication and authorization events during handshake and message processing, security violations like rate limiting triggers and message validation failures, and abnormal disconnections and protocol errors.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**WebSocket イベントをログ記録**してください。これには、接続の確立と終了 (ユーザー ID、IP、origin を含む)、ハンドシェイクおよびメッセージ処理中の認証・認可イベント、レート制限の発火やメッセージ検証失敗などのセキュリティ違反、異常切断やプロトコルエラーが含まれます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Avoid logging sensitive data** - never log complete message contents, authentication tokens, session IDs, or personal information that could violate privacy regulations.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**機密データのログ記録を避けてください**。完全なメッセージ内容、認証トークン、セッション ID、プライバシー規制に違反する可能性のある個人情報を決してログに記録しないでください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

See the [Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html) for more details.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

詳細は [Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html) を参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Testing WebSocket Security

**Key security tests:**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### WebSocket セキュリティのテスト

**主要なセキュリティテスト:**

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- **Origin validation**: Connect from unauthorized domains
- **Authentication bypass**: Attempt connections without proper credentials
- **Message injection**: Send XSS, SQL injection, and command injection payloads
- **DoS resistance**: Test connection limits, message flooding, and oversized messages
- **Session management**: Test session expiration and logout handling

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- **Origin 検証**: 許可されていないドメインから接続する
- **認証バイパス**: 適切な認証情報なしで接続を試みる
- **メッセージインジェクション**: XSS、SQL インジェクション、コマンドインジェクションのペイロードを送信する
- **DoS 耐性**: 接続制限、メッセージフラッディング、過大なメッセージをテストする
- **セッション管理**: セッション有効期限とログアウト処理をテストする

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Testing tools:**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**テストツール:**

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Browser developer tools for manual testing
- [wscat](https://github.com/websockets/wscat) for command-line WebSocket connections
- Custom scripts for automated vulnerability testing
- OWASP ZAP (includes WebSocket security testing features)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- 手動テスト用のブラウザ開発者ツール
- コマンドライン WebSocket 接続用の [wscat](https://github.com/websockets/wscat)
- 自動脆弱性テスト用のカスタムスクリプト
- OWASP ZAP (WebSocket セキュリティテスト機能を含む)

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Framework-Specific Best Practices

**Node.js:** Use the `verifyClient` callback for origin and authentication checks, set `maxPayload` limits, and disable `perMessageDeflate` compression to prevent security issues.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### フレームワーク固有のベストプラクティス

**Node.js:** origin と認証のチェックには `verifyClient` コールバックを使用し、`maxPayload` 制限を設定し、セキュリティ上の問題を防ぐために `perMessageDeflate` 圧縮を無効化してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Python:** With Django Channels, implement authentication middleware and origin validation. Use async exception handling to prevent application crashes from malformed WebSocket messages.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**Python:** Django Channels では、認証ミドルウェアと origin 検証を実装してください。不正な形式の WebSocket メッセージによってアプリケーションがクラッシュしないよう、非同期例外処理を使用してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Java Spring:** Configure allowed origins explicitly and integrate Spring Security for authorization. Set message size limits in your WebSocket container configuration to prevent resource exhaustion.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**Java Spring:** 許可する origin を明示的に設定し、認可のために Spring Security と統合してください。リソース枯渇を防ぐため、WebSocket コンテナ設定でメッセージサイズ制限を設定してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Go:** When using Gorilla WebSocket, implement validation in your `CheckOrigin` function - don't just return `true`. Set read limits, implement timeouts, and use context cancellation for graceful connection cleanup.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**Go:** Gorilla WebSocket を使用する場合は、`CheckOrigin` 関数で検証を実装してください。単に `true` を返してはいけません。読み取り制限を設定し、タイムアウトを実装し、接続を適切にクリーンアップするためにコンテキストキャンセルを使用してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Keep Dependencies Updated

Regularly update WebSocket libraries and monitor security advisories. Past versions of popular libraries (`ws`, Spring STOMP, Python `websockets`) have had critical security vulnerabilities including DoS and RCE issues.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 依存関係を最新に保つ

WebSocket ライブラリを定期的に更新し、セキュリティアドバイザリを監視してください。広く使われているライブラリ (`ws`、Spring STOMP、Python `websockets`) の過去のバージョンには、DoS や RCE を含む重大なセキュリティ脆弱性がありました。

</div>
</div>

</section>
</div>

## References

<div className="referenceFooter">

- [Cross Site Scripting Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [SQL Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)
- [Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- [CWE-1385: Missing Origin Validation in WebSockets](https://cwe.mitre.org/data/definitions/1385.html)

</div>


## Attribution

<div className="attributionFooter">

- Original: WebSocket Security Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/WebSocket_Security_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: English original retained for comparison. Japanese translation added. Bilingual display generated from official source and local Japanese translation.
- Retrieved: 2026-05-20

</div>
