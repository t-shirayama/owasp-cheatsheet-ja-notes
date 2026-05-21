# TODO

このリポジトリの残作業候補です。

## 未完了タスク

### 原文比較で見つかった全文翻訳不足候補

2026-05-20 に OWASP Cheat Sheet Series の公式 Markdown 原文と `docs/translations/` の `## 日本語訳` 以下を機械比較した。本文量比が概ね 0.35 未満、または原文見出しに対して翻訳側の見出し対応が少ないファイルを、全文翻訳不足候補として追加する。

注: `docs/translations/injection-prevention-in-java.md` は、現在の原文が Java Security Cheat Sheet への移動告知のみであるため、この不足候補から除外する。

### GitHub Pages 対訳サイトの残作業

- [ ] Pilot 対訳ページの `docs/bilingual/csrf-prevention.md`、`docs/bilingual/bean-validation.md`、`docs/bilingual/cryptographic-storage.md` を公式原文全文に対応する段落ペアへ拡張する。
- [ ] Pilot 確認後、`references/bilingual-map.md` に対象を追加しながら、残りの Cheat Sheet へ `docs/bilingual/` 対訳ページを展開する。

- [x] [docs/translations/bean-validation.md](../docs/translations/bean-validation.md): Bean Validation Cheat Sheet を原文全文と照合し、不足している日本語訳を追加する。完了: 2026-05-21, 公式原文と照合し全文訳へ拡張。
- [ ] [docs/translations/csrf-prevention.md](../docs/translations/csrf-prevention.md): Cross-Site Request Forgery Prevention Cheat Sheet を原文全文と照合し、不足している日本語訳を追加する。現状: 作成済み, 本文量比 約 0, 見出し 1/46。
- [x] [docs/translations/deserialization.md](../docs/translations/deserialization.md): 完了: 2026-05-21, 公式原文と照合し全文訳と公開対訳ページへ拡張。
- [x] [docs/translations/dom-based-xss-prevention.md](../docs/translations/dom-based-xss-prevention.md): 完了: 2026-05-21, 公式原文と照合し全文訳と公開対訳ページへ拡張。
- [x] [docs/translations/file-upload.md](../docs/translations/file-upload.md): File Upload Cheat Sheet を原文全文と照合し、不足している日本語訳を追加する。完了: 2026-05-21, 公式原文と照合し全文訳と公開対訳ページへ拡張。
- [x] [docs/translations/injection-prevention.md](../docs/translations/injection-prevention.md): Injection Prevention Cheat Sheet を原文全文と照合し、不足している日本語訳を追加する。完了: 2026-05-21, 公式原文と照合し全文訳と公開対訳ページへ拡張。
- [x] [docs/translations/input-validation.md](../docs/translations/input-validation.md): Input Validation Cheat Sheet を原文全文と照合し、不足している日本語訳を追加する。完了: 2026-05-21, 公式原文と照合し全文訳と公開対訳ページへ拡張。
- [ ] [docs/translations/java-security.md](../docs/translations/java-security.md): Java Security Cheat Sheet を原文全文と照合し、不足している日本語訳を追加する。現状: 作成済み, 本文量比 約 0.01, 見出し 1/49。
- [x] [docs/translations/ldap-injection-prevention.md](../docs/translations/ldap-injection-prevention.md): LDAP Injection Prevention Cheat Sheet を原文全文と照合し、不足している日本語訳を追加する。完了: 2026-05-21, 公式原文と照合し全文訳と公開対訳ページへ拡張。
- [x] [docs/translations/os-command-injection-defense.md](../docs/translations/os-command-injection-defense.md): OS Command Injection Defense Cheat Sheet を原文全文と照合し、不足している日本語訳を追加する。完了: 2026-05-21, 公式原文と照合し全文訳と公開対訳ページへ拡張。
- [x] [docs/translations/query-parameterization.md](../docs/translations/query-parameterization.md): Query Parameterization Cheat Sheet を原文全文と照合し、不足している日本語訳を追加する。完了: 2026-05-21, 公式原文と照合し全文訳と公開対訳ページへ拡張。
- [x] [docs/translations/security-terminology.md](../docs/translations/security-terminology.md): Security Terminology Cheat Sheet を原文全文と照合し、不足している日本語訳を追加する。完了: 2026-05-21, 公式原文と照合し全文訳・公開対訳ページを確認。
- [x] [docs/translations/sql-injection-prevention.md](../docs/translations/sql-injection-prevention.md): SQL Injection Prevention Cheat Sheet を原文全文と照合し、不足している日本語訳を追加する。完了: 2026-05-21, 公式原文と照合し全文訳と公開対訳ページへ拡張。
- [x] [docs/translations/ssrf-prevention.md](../docs/translations/ssrf-prevention.md): Server Side Request Forgery Prevention Cheat Sheet を原文全文と照合し、不足している日本語訳を追加する。完了: 2026-05-21, 公式原文と照合し全文訳と公開対訳ページへ拡張。
- [ ] [docs/translations/xml-security.md](../docs/translations/xml-security.md): XML Security Cheat Sheet を原文全文と照合し、不足している日本語訳を追加する。現状: 作成済み, 本文量比 約 0.01, 見出し 1/30。
- [ ] [docs/translations/xss-filter-evasion.md](../docs/translations/xss-filter-evasion.md): XSS Filter Evasion Cheat Sheet を原文全文と照合し、不足している日本語訳を追加する。現状: 詳細化済み, 本文量比 約 0.02, 見出し 0/105。
- [x] [docs/translations/xss-prevention.md](../docs/translations/xss-prevention.md): Cross Site Scripting Prevention Cheat Sheet を原文全文と照合し、不足している日本語訳を追加する。完了: 2026-05-21, 公式原文と照合し全文訳と公開対訳ページへ拡張。
- [ ] [docs/translations/xxe-prevention.md](../docs/translations/xxe-prevention.md): XML External Entity Prevention Cheat Sheet を原文全文と照合し、不足している日本語訳を追加する。現状: 作成済み, 本文量比 約 0.01, 見出し 1/60。
- [x] [docs/translations/browser-extension-vulnerabilities.md](../docs/translations/browser-extension-vulnerabilities.md): Browser Extension Vulnerabilities Cheat Sheet を原文全文と照合し、不足している日本語訳を追加する。完了: 2026-05-21, 公式原文と照合し全文訳と公開対訳ページへ拡張。
- [x] [docs/translations/logging.md](../docs/translations/logging.md): 完了: 2026-05-21, 公式原文と照合し全文訳と公開対訳ページへ拡張。
- [x] [docs/translations/cryptographic-storage.md](../docs/translations/cryptographic-storage.md): Cryptographic Storage Cheat Sheet を原文全文と照合し、不足している日本語訳を追加する。完了: 2026-05-21, 公式原文と照合し全文訳へ拡張。
- [x] [docs/translations/key-management.md](../docs/translations/key-management.md): Key Management Cheat Sheet を原文全文と照合し、不足している日本語訳を追加する。完了: 2026-05-21, 公式原文と照合し全文訳と公開対訳ページへ拡張。
- [ ] [docs/translations/secrets-management.md](../docs/translations/secrets-management.md): Secrets Management Cheat Sheet を原文全文と照合し、不足している日本語訳を追加する。現状: 詳細化済み, 本文量比 約 0.01, 見出し 0/70。
- [x] [docs/translations/django-security.md](../docs/translations/django-security.md): Django Security Cheat Sheet を原文全文と照合し、不足している日本語訳を追加する。完了: 2026-05-21, 公式原文と照合し全文訳と公開対訳ページへ拡張。
- [x] [docs/translations/docker-security.md](../docs/translations/docker-security.md): 完了: 2026-05-21, 公式原文と照合し全文訳と公開対訳ページへ拡張。
- [x] [docs/translations/user-privacy-protection.md](../docs/translations/user-privacy-protection.md): User Privacy Protection Cheat Sheet を原文全文と照合し、不足している日本語訳を追加する。完了: 2026-05-21, 公式原文と照合し全文訳と公開対訳ページへ拡張。
- [x] [docs/translations/attack-surface-analysis.md](../docs/translations/attack-surface-analysis.md): Attack Surface Analysis Cheat Sheet を原文全文と照合し、不足している日本語訳を追加する。完了: 2026-05-21, 公式原文と照合し全文訳と公開対訳ページへ拡張。
- [x] [docs/translations/dependency-graph-sbom.md](../docs/translations/dependency-graph-sbom.md): Dependency Graph and SBOM Cheat Sheet を原文全文と照合し、不足している日本語訳を追加する。完了: 2026-05-21, 公式原文と照合し全文訳と公開対訳ページへ拡張。
- [x] [docs/translations/mass-assignment.md](../docs/translations/mass-assignment.md): Mass Assignment Cheat Sheet を原文全文と照合し、不足している日本語訳を追加する。完了: 2026-05-21, 公式原文と照合し全文訳と公開対訳ページへ拡張。
- [x] [docs/translations/npm-security.md](../docs/translations/npm-security.md): NPM Security Cheat Sheet を原文全文と照合し、不足している日本語訳を追加する。完了: 2026-05-21, 公式原文と照合し全文訳と公開対訳ページへ拡張。
- [x] [docs/translations/prototype-pollution-prevention.md](../docs/translations/prototype-pollution-prevention.md): Prototype Pollution Prevention Cheat Sheet を原文全文と照合し、不足している日本語訳を追加する。完了: 2026-05-21, 公式原文と照合し全文訳と公開対訳ページへ拡張。
- [x] [docs/translations/secure-code-review.md](../docs/translations/secure-code-review.md): 完了: 2026-05-21, 公式原文と照合し全文訳と公開対訳ページへ拡張。
- [x] [docs/translations/software-supply-chain-security.md](../docs/translations/software-supply-chain-security.md): Software Supply Chain Security Cheat Sheet を原文全文と照合し、不足している日本語訳を追加する。完了: 2026-05-21, 公式原文と照合し全文訳と公開対訳ページへ拡張。
- [x] [docs/translations/threat-modeling.md](../docs/translations/threat-modeling.md): Threat Modeling Cheat Sheet を原文全文と照合し、不足している日本語訳を追加する。完了: 2026-05-21, 公式原文と照合し全文訳と公開対訳ページへ拡張。
- [x] [docs/translations/virtual-patching.md](../docs/translations/virtual-patching.md): Virtual Patching Cheat Sheet を原文全文と照合し、不足している日本語訳を追加する。完了: 2026-05-21, 公式原文と照合し全文訳と公開対訳ページへ拡張。
- [x] [docs/translations/vulnerable-dependency-management.md](../docs/translations/vulnerable-dependency-management.md): Vulnerable Dependency Management Cheat Sheet を原文全文と照合し、不足している日本語訳を追加する。完了: 2026-05-21, 公式原文と照合し全文訳と公開対訳ページへ拡張。
- [x] [docs/translations/error-handling.md](../docs/translations/error-handling.md): 完了: 2026-05-21, 公式原文と照合し全文訳と公開対訳ページへ拡張。
- [ ] [docs/translations/logging-vocabulary.md](../docs/translations/logging-vocabulary.md): Logging Vocabulary Cheat Sheet を原文全文と照合し、不足している日本語訳を追加する。現状: 詳細化済み, 本文量比 約 0.09, 見出し 6/75。
- [x] [docs/translations/abuse-case.md](../docs/translations/abuse-case.md): 完了: 2026-05-21, 公式原文と照合し全文訳と公開対訳ページへ拡張。
- [x] [docs/translations/denial-of-service.md](../docs/translations/denial-of-service.md): Denial of Service Cheat Sheet を原文全文と照合し、不足している日本語訳を追加する。完了: 2026-05-21, 公式原文と照合し全文訳と公開対訳ページへ拡張。
- [x] [docs/translations/microservices-security.md](../docs/translations/microservices-security.md): Microservices Security Cheat Sheet を原文全文と照合し、不足している日本語訳を追加する。完了: 2026-05-21, 公式原文と照合し全文訳と公開対訳ページへ拡張。
- [x] [docs/translations/web-service-security.md](../docs/translations/web-service-security.md): Web Service Security Cheat Sheet を原文全文と照合し、不足している日本語訳を追加する。完了: 2026-05-21, 公式原文と照合し全文訳と公開対訳ページへ拡張。
- [x] [docs/translations/content-security-policy.md](../docs/translations/content-security-policy.md): 完了: 2026-05-21, 公式原文と照合し全文訳と公開対訳ページへ拡張。
- [x] [docs/translations/dom-clobbering-prevention.md](../docs/translations/dom-clobbering-prevention.md): DOM Clobbering Prevention Cheat Sheet を原文全文と照合し、不足している日本語訳を追加する。完了: 2026-05-21, 公式原文と照合し全文訳と公開対訳ページへ拡張。
- [x] [docs/translations/html5-security.md](../docs/translations/html5-security.md): HTML5 Security Cheat Sheet を原文全文と照合し、不足している日本語訳を追加する。完了: 2026-05-21, 公式原文と照合し全文訳と公開対訳ページへ拡張。
- [x] [docs/translations/http-strict-transport-security.md](../docs/translations/http-strict-transport-security.md): HTTP Strict Transport Security Cheat Sheet を原文全文と照合し、不足している日本語訳を追加する。完了: 2026-05-21, 公式原文と照合し全文訳と公開対訳ページへ拡張。
- [x] [docs/translations/third-party-javascript-management.md](../docs/translations/third-party-javascript-management.md): Third Party Javascript Management Cheat Sheet を原文全文と照合し、不足している日本語訳を追加する。完了: 2026-05-21, 公式原文と照合し全文訳と公開対訳ページへ拡張。
- [x] [docs/translations/transport-layer-security.md](../docs/translations/transport-layer-security.md): Transport Layer Security Cheat Sheet を原文全文と照合し、不足している日本語訳を追加する。完了: 2026-05-21, 公式原文と照合し全文訳と公開対訳ページへ拡張。
- [x] [docs/translations/graphql.md](../docs/translations/graphql.md): GraphQL Cheat Sheet を原文全文と照合し、不足している日本語訳を追加する。完了: 2026-05-21, 公式原文と照合し全文訳と公開対訳ページへ拡張。
- [x] [docs/translations/rest-assessment.md](../docs/translations/rest-assessment.md): REST Assessment Cheat Sheet を原文全文と照合し、不足している日本語訳を追加する。完了: 2026-05-21, 公式原文と照合し全文訳と公開対訳ページへ拡張。
- [x] [docs/translations/rest-security.md](../docs/translations/rest-security.md): REST Security Cheat Sheet を原文全文と照合し、不足している日本語訳を追加する。完了: 2026-05-21, 公式原文と照合し全文訳と公開対訳ページへ拡張。
- [x] [docs/translations/authentication.md](../docs/translations/authentication.md): 完了: 2026-05-21, 公式原文と照合し全文訳と公開対訳ページへ拡張。
- [x] [docs/translations/credential-stuffing-prevention.md](../docs/translations/credential-stuffing-prevention.md): Credential Stuffing Prevention Cheat Sheet を原文全文と照合し、不足している日本語訳を追加する。完了: 2026-05-21, 公式原文と照合し全文訳と公開対訳ページへ拡張。
- [x] [docs/translations/forgot-password.md](../docs/translations/forgot-password.md): Forgot Password Cheat Sheet を原文全文と照合し、不足している日本語訳を追加する。完了: 2026-05-21, 公式原文と照合し全文訳と公開対訳ページへ拡張。
- [x] [docs/translations/multifactor-authentication.md](../docs/translations/multifactor-authentication.md): 完了: 2026-05-21, 公式原文と照合し全文訳と公開対訳ページへ拡張。
- [x] [docs/translations/password-storage.md](../docs/translations/password-storage.md): Password Storage Cheat Sheet を原文全文と照合し、不足している日本語訳を追加する。完了: 2026-05-21, 公式原文と照合し全文訳と公開対訳ページへ拡張。
- [x] [docs/translations/security-questions.md](../docs/translations/security-questions.md): Choosing and Using Security Questions Cheat Sheet を原文全文と照合し、不足している日本語訳を追加する。完了: 2026-05-21, 公式原文と照合し全文訳と公開対訳ページへ拡張。
- [x] [docs/translations/transaction-authorization.md](../docs/translations/transaction-authorization.md): Transaction Authorization Cheat Sheet を原文全文と照合し、不足している日本語訳を追加する。完了: 2026-05-21, 公式原文と照合し全文訳と公開対訳ページへ拡張。
- [ ] [docs/translations/session-management.md](../docs/translations/session-management.md): Session Management Cheat Sheet を原文全文と照合し、不足している日本語訳を追加する。現状: 作成済み, 本文量比 約 0.06, 見出し 8/59。
- [ ] [docs/translations/authorization-testing-automation.md](../docs/translations/authorization-testing-automation.md): Authorization Testing Automation Cheat Sheet を原文全文と照合し、不足している日本語訳を追加する。現状: 詳細化済み, 本文量比 約 0.14, 見出し 0/9。
- [x] [docs/translations/authorization.md](../docs/translations/authorization.md): Authorization Cheat Sheet を原文全文と照合し、不足している日本語訳を追加する。完了: 2026-05-21, 公式原文と照合し全文訳と公開対訳ページへ拡張。
- [x] [docs/translations/idor-prevention.md](../docs/translations/idor-prevention.md): Insecure Direct Object Reference Prevention Cheat Sheet を原文全文と照合し、不足している日本語訳を追加する。完了: 2026-05-21, 公式原文と照合し全文訳と公開対訳ページへ拡張。
- [ ] [docs/translations/multi-tenant-security.md](../docs/translations/multi-tenant-security.md): Multi Tenant Security Cheat Sheet を原文全文と照合し、不足している日本語訳を追加する。現状: 詳細化済み, 本文量比 約 0.2, 見出し 0/13。
- [ ] [docs/translations/json-web-token-for-java.md](../docs/translations/json-web-token-for-java.md): JSON Web Token for Java Cheat Sheet を原文全文と照合し、不足している日本語訳を追加する。現状: 作成済み, 本文量比 約 0.01, 見出し 1/29。
- [x] [docs/translations/saml-security.md](../docs/translations/saml-security.md): SAML Security Cheat Sheet を原文全文と照合し、不足している日本語訳を追加する。完了: 2026-05-21, 公式原文と照合し全文訳と公開対訳ページへ拡張。

## 完了判定の目安

- すべての対象 Cheat Sheet について、翻訳ファイルと公開用の英日対訳ページが揃っている。
- 各公開ページから公式原文、ローカル原文、翻訳ファイルの関係を辿れる。
- 各翻訳ファイルに Attribution がある。
- `references/source-map.md` に空欄や未作成がない。
- README、AGENTS、テンプレートが現在のフォルダ構成と一致している。
