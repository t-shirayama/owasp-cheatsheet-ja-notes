# ASVS V1: Encoding and Sanitization

## 概要

エンコーディング、サニタイズ、入力検証、インジェクション防止、デシリアライゼーションなどに関する章です。

## 関連 Cheat Sheet

- Bean Validation Cheat Sheet
  - 翻訳: [Bean Validation チートシート 日本語訳](../translations/bean-validation.md)
- Cross-Site Request Forgery Prevention Cheat Sheet
  - 翻訳: [CSRF防止チートシート 日本語訳](../translations/csrf-prevention.md)
- Deserialization Cheat Sheet
  - 翻訳: [デシリアライゼーションチートシート 日本語訳](../translations/deserialization.md)
- DOM based XSS Prevention Cheat Sheet
  - 翻訳: [DOM Based XSS防止チートシート 日本語訳](../translations/dom-based-xss-prevention.md)
- File Upload Cheat Sheet
  - 翻訳: [ファイルアップロードチートシート 日本語訳](../translations/file-upload.md)
- Injection Prevention Cheat Sheet
  - 翻訳: [インジェクション防止チートシート 日本語訳](../translations/injection-prevention.md)
- Injection Prevention in Java Cheat Sheet
  - 翻訳: [Javaにおけるインジェクション防止チートシート 日本語訳](../translations/injection-prevention-in-java.md)
- Input Validation Cheat Sheet
  - 翻訳: [入力検証チートシート 日本語訳](../translations/input-validation.md)
- Java Security Cheat Sheet
  - 翻訳: [Javaセキュリティチートシート 日本語訳](../translations/java-security.md)
- LDAP Injection Prevention Cheat Sheet
  - 翻訳: [LDAPインジェクション防止チートシート 日本語訳](../translations/ldap-injection-prevention.md)
- OS Command Injection Defense Cheat Sheet
  - 翻訳: [OSコマンドインジェクション防御チートシート 日本語訳](../translations/os-command-injection-defense.md)
- Query Parameterization Cheat Sheet
  - 翻訳: [クエリパラメータ化チートシート 日本語訳](../translations/query-parameterization.md)
- Security Terminology Cheat Sheet
  - 翻訳: [セキュリティ用語チートシート 日本語訳](../translations/security-terminology.md)
- SQL Injection Prevention Cheat Sheet
  - 翻訳: [SQLインジェクション防止チートシート 日本語訳](../translations/sql-injection-prevention.md)
- Server Side Request Forgery Prevention Cheat Sheet
  - 翻訳: [SSRF防止チートシート 日本語訳](../translations/ssrf-prevention.md)
- XML Security Cheat Sheet
  - 翻訳: [XMLセキュリティチートシート 日本語訳](../translations/xml-security.md)
- XSS Filter Evasion Cheat Sheet
  - 翻訳: [XSSフィルタ回避チートシート 日本語訳](../translations/xss-filter-evasion.md)
- Cross Site Scripting Prevention Cheat Sheet
  - 翻訳: [XSS防止チートシート 日本語訳](../translations/xss-prevention.md)
- XML External Entity Prevention Cheat Sheet
  - 翻訳: [XXE防止チートシート 日本語訳](../translations/xxe-prevention.md)

## 章別確認観点

- ASVS V1 に関連する Cheat Sheet の翻訳と公開用英日対訳ページを確認する。
- 実装時は公式原文と日本語訳を照合し、設計レビュー、コードレビュー、テスト観点へ落とし込む。
- 詳細な対応関係は [../../references/source-map.md](../../references/source-map.md) を参照する。

## 対応表

| ASVS 項目 | Cheat Sheet | 成果物 | 状態 |
| --- | --- | --- | --- |
| V1.2 | Bean Validation Cheat Sheet | [翻訳](../translations/bean-validation.md) | 作成済み |
| V1.3, V3, V4 | Cross-Site Request Forgery Prevention Cheat Sheet | [翻訳](../translations/csrf-prevention.md) | 作成済み |
| V1.5 | Deserialization Cheat Sheet | [翻訳](../translations/deserialization.md) | 作成済み |
| V1, V3 | DOM based XSS Prevention Cheat Sheet | [翻訳](../translations/dom-based-xss-prevention.md) | 作成済み |
| V1.2, V5 | File Upload Cheat Sheet | [翻訳](../translations/file-upload.md) | 作成済み |
| V1 | Injection Prevention Cheat Sheet | [翻訳](../translations/injection-prevention.md) | 作成済み |
| V1.3 | Injection Prevention in Java Cheat Sheet | [翻訳](../translations/injection-prevention-in-java.md) | 作成済み |
| V1, V2, V5 | Input Validation Cheat Sheet | [翻訳](../translations/input-validation.md) | 作成済み |
| V1.2 | Java Security Cheat Sheet | [翻訳](../translations/java-security.md) | 作成済み |
| V1 | LDAP Injection Prevention Cheat Sheet | [翻訳](../translations/ldap-injection-prevention.md) | 作成済み |
| V1.2 | OS Command Injection Defense Cheat Sheet | [翻訳](../translations/os-command-injection-defense.md) | 作成済み |
| V1.2 | Query Parameterization Cheat Sheet | [翻訳](../translations/query-parameterization.md) | 作成済み |
| V1.1; V6.1; V8.1; V11.1; V15.1 | Security Terminology Cheat Sheet | [翻訳](../translations/security-terminology.md) | 作成済み |
| V1.2 | SQL Injection Prevention Cheat Sheet | [翻訳](../translations/sql-injection-prevention.md) | 作成済み |
| V1.3, V5.3, V13 | Server Side Request Forgery Prevention Cheat Sheet | [翻訳](../translations/ssrf-prevention.md) | 作成済み |
| V1, V9 | XML Security Cheat Sheet | [翻訳](../translations/xml-security.md) | 作成済み |
| V1.2 | XSS Filter Evasion Cheat Sheet | [翻訳](../translations/xss-filter-evasion.md) | 作成済み |
| V1.2 Injection Prevention; V1.3 Sanitization; V3.2 Unintended Content Interpretation; V3.4 Browser Security Mechanism Headers | Cross Site Scripting Prevention Cheat Sheet | [翻訳](../translations/xss-prevention.md) | 詳細化済み |
| V1 | XML External Entity Prevention Cheat Sheet | [翻訳](../translations/xxe-prevention.md) | 作成済み |

## 参考資料

- Source: https://cheatsheetseries.owasp.org/IndexASVS.html
- Retrieved: 2026-05-20
