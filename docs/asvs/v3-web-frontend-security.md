# ASVS V3: Web Frontend Security

## 概要

ブラウザ上で解釈されるコンテンツ、Cookie、セキュリティヘッダー、オリジン分離、外部リソースに関する章です。

## 関連 Cheat Sheet

- Content Security Policy Cheat Sheet
  - 翻訳: [Content Security Policy チートシート 日本語訳](../translations/v3/content-security-policy.md)
  - 要約: [Content Security Policy チートシート 要約](../summaries/v3/content-security-policy.md)
  - チェックリスト: [Content Security Policy チートシート 開発チェックリスト](../checklists/v3/content-security-policy.md)
- Cross-Site Request Forgery Prevention Cheat Sheet
  - 翻訳: [CSRF防止チートシート 日本語訳](../translations/v1/csrf-prevention.md)
  - 要約: [CSRF防止チートシート 要約](../summaries/v1/csrf-prevention.md)
  - チェックリスト: [CSRF防止チートシート 開発チェックリスト](../checklists/v1/csrf-prevention.md)
- DOM based XSS Prevention Cheat Sheet
  - 翻訳: [DOM Based XSS防止チートシート 日本語訳](../translations/v1/dom-based-xss-prevention.md)
  - 要約: [DOM Based XSS防止チートシート 要約](../summaries/v1/dom-based-xss-prevention.md)
  - チェックリスト: [DOM Based XSS防止チートシート 開発チェックリスト](../checklists/v1/dom-based-xss-prevention.md)
- DOM Clobbering Prevention Cheat Sheet
  - 翻訳: [DOM Clobbering防止チートシート 日本語訳](../translations/v3/dom-clobbering-prevention.md)
  - 要約: [DOM Clobbering防止チートシート 要約](../summaries/v3/dom-clobbering-prevention.md)
  - チェックリスト: [DOM Clobbering防止チートシート 開発チェックリスト](../checklists/v3/dom-clobbering-prevention.md)
- HTML5 Security Cheat Sheet
  - 翻訳: [HTML5セキュリティチートシート 日本語訳](../translations/v3/html5-security.md)
  - 要約: [HTML5セキュリティチートシート 要約](../summaries/v3/html5-security.md)
  - チェックリスト: [HTML5セキュリティチートシート 開発チェックリスト](../checklists/v3/html5-security.md)
- HTTP Strict Transport Security Cheat Sheet
  - 翻訳: [HSTSチートシート 日本語訳](../translations/v3/http-strict-transport-security.md)
  - 要約: [HSTSチートシート 要約](../summaries/v3/http-strict-transport-security.md)
  - チェックリスト: [HSTSチートシート 開発チェックリスト](../checklists/v3/http-strict-transport-security.md)
- Third Party Javascript Management Cheat Sheet
  - 翻訳: [サードパーティJavaScript管理チートシート 日本語訳](../translations/v3/third-party-javascript-management.md)
  - 要約: [サードパーティJavaScript管理チートシート 要約](../summaries/v3/third-party-javascript-management.md)
  - チェックリスト: [サードパーティJavaScript管理チートシート 開発チェックリスト](../checklists/v3/third-party-javascript-management.md)
- Transport Layer Security Cheat Sheet
  - 翻訳: [TLSチートシート 日本語訳](../translations/v3/transport-layer-security.md)
  - 要約: [TLSチートシート 要約](../summaries/v3/transport-layer-security.md)
  - チェックリスト: [TLSチートシート 開発チェックリスト](../checklists/v3/transport-layer-security.md)
- Cross Site Scripting Prevention Cheat Sheet
  - 翻訳: [XSS防止チートシート 日本語訳](../translations/v1/xss-prevention.md)
  - 要約: [XSS防止チートシート 要約](../summaries/v1/xss-prevention.md)
  - チェックリスト: [XSS防止チートシート 開発チェックリスト](../checklists/v1/xss-prevention.md)

## 章別チェック観点

- ASVS V3 に関連する Cheat Sheet の翻訳、要約、開発チェックリストを確認する。
- 実装時はチェックリストをタスク化し、設計レビュー、コードレビュー、テストで検証する。
- 詳細な対応関係は [../../references/source-map.md](../../references/source-map.md) を参照する。

## 対応表

| ASVS 項目 | Cheat Sheet | 成果物 | 状態 |
| --- | --- | --- | --- |
| V3.1 | Content Security Policy Cheat Sheet | [翻訳](../translations/v3/content-security-policy.md) / [要約](../summaries/v3/content-security-policy.md) / [チェックリスト](../checklists/v3/content-security-policy.md) | 作成済み |
| V1.3, V3, V4 | Cross-Site Request Forgery Prevention Cheat Sheet | [翻訳](../translations/v1/csrf-prevention.md) / [要約](../summaries/v1/csrf-prevention.md) / [チェックリスト](../checklists/v1/csrf-prevention.md) | 作成済み |
| V1, V3 | DOM based XSS Prevention Cheat Sheet | [翻訳](../translations/v1/dom-based-xss-prevention.md) / [要約](../summaries/v1/dom-based-xss-prevention.md) / [チェックリスト](../checklists/v1/dom-based-xss-prevention.md) | 作成済み |
| V3.2 | DOM Clobbering Prevention Cheat Sheet | [翻訳](../translations/v3/dom-clobbering-prevention.md) / [要約](../summaries/v3/dom-clobbering-prevention.md) / [チェックリスト](../checklists/v3/dom-clobbering-prevention.md) | 作成済み |
| V3, V14 | HTML5 Security Cheat Sheet | [翻訳](../translations/v3/html5-security.md) / [要約](../summaries/v3/html5-security.md) / [チェックリスト](../checklists/v3/html5-security.md) | 作成済み |
| V3, V12 | HTTP Strict Transport Security Cheat Sheet | [翻訳](../translations/v3/http-strict-transport-security.md) / [要約](../summaries/v3/http-strict-transport-security.md) / [チェックリスト](../checklists/v3/http-strict-transport-security.md) | 作成済み |
| V3, V15 | Third Party Javascript Management Cheat Sheet | [翻訳](../translations/v3/third-party-javascript-management.md) / [要約](../summaries/v3/third-party-javascript-management.md) / [チェックリスト](../checklists/v3/third-party-javascript-management.md) | 作成済み |
| V3, V4, V10, V11, V12, V17 | Transport Layer Security Cheat Sheet | [翻訳](../translations/v3/transport-layer-security.md) / [要約](../summaries/v3/transport-layer-security.md) / [チェックリスト](../checklists/v3/transport-layer-security.md) | 作成済み |
| V1, V3 | Cross Site Scripting Prevention Cheat Sheet | [翻訳](../translations/v1/xss-prevention.md) / [要約](../summaries/v1/xss-prevention.md) / [チェックリスト](../checklists/v1/xss-prevention.md) | 作成済み |

## 参考資料

- Source: https://cheatsheetseries.owasp.org/IndexASVS.html
- Retrieved: 2026-05-20
