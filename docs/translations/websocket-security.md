# WebSocket セキュリティチートシート 日本語訳

## Attribution

- Original: WebSocket Security Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/WebSocket_Security_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-21

## 日本語訳

# WebSocket セキュリティチートシート

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
```

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

## References

- [Cross Site Scripting Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [SQL Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)
- [Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- [CWE-1385: Missing Origin Validation in WebSockets](https://cwe.mitre.org/data/definitions/1385.html)

## ASVS との対応

このチートシートは、主に ASVS の認証、セッション管理、アクセス制御、入力検証、通信保護、ログ記録と監視、サービス拒否対策に関係します。WebSocket を利用する機能では、接続時の origin 検証と認証だけでなく、メッセージ単位の認可、入力検証、レート制限、セッション失効時の接続終了を確認してください。
