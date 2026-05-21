---
title: Secure Code Review Cheat Sheet
hide_title: true
---

<div className="docHero" data-category="asvs-v15">
  <h1>セキュアコードレビューチートシート</h1>
  <p className="docHeroSubtitle">Secure Code Review Cheat Sheet</p>
  <div className="docMeta">
    <span className="docPill">最終更新: 2026-05-21</span>
    <span className="docPill">読了時間: 約18分</span>
    <span className="docPill">ASVS: V15.4</span>
  </div>
</div>

<input className="tabInput" type="radio" name="secure-code-review-view" id="secure-code-review-original" defaultChecked />
<input className="tabInput" type="radio" name="secure-code-review-view" id="secure-code-review-translation" />
<input className="tabInput" type="radio" name="secure-code-review-view" id="secure-code-review-bilingual" />

<div className="contentTabs" role="tablist" aria-label="表示モード">
  <label htmlFor="secure-code-review-original" title="英語原文を表示">原文</label>
  <label htmlFor="secure-code-review-translation" title="日本語訳を表示">翻訳</label>
  <label htmlFor="secure-code-review-bilingual" title="原文と翻訳を並べて確認">対比表示</label>
</div>

<section id="secure-code-review-original-panel" className="tabPanel originalPanel contentPanel">

# Secure Code Review Cheat Sheet

## Introduction

**Secure Code Review** is the process of manually examining source code to identify security vulnerabilities that automated tools often miss. It involves analyzing application logic, data flow, and implementation details to detect security flaws that require human expertise and contextual understanding.

**Manual Code Review** complements automated security testing tools (SAST/DAST) by focusing on areas where human analysis provides the most value, including business logic validation, complex security implementations, and context-specific vulnerabilities. While automated tools can assist by highlighting potential areas of concern, the core analysis relies on human judgment and domain expertise.

**Security-Focused Review** differs from functional code review by specifically targeting security concerns such as input validation, authentication mechanisms, authorization controls, cryptographic implementations, and potential attack vectors.

### Review Types

**Baseline Reviews** examine the entire codebase comprehensively. Use for:

- New applications or major releases
- Legacy system onboarding
- Compliance requirements
- Post-incident analysis

**Diff-Based Reviews** focus on code changes only. Use for:

- Pull requests and commits
- Daily development workflow
- Feature completion
- Continuous security validation

This cheat sheet provides practical guidance for conducting effective manual security code reviews, with emphasis on both baseline and incremental review methodologies.

## Review Methodology

### Preparation

**For All Reviews:**

- Understand application architecture and business requirements
- Gather threat models and previous security findings
- Identify critical assets and high-risk functions
- Review security requirements and documentation

**Additional for Baseline Reviews:**

- Map complete application boundaries and dependencies
- Analyze overall security architecture
- Review security incident history
- Audit all third-party libraries

**Additional for Diff-Based Reviews:**

- Identify modified files and affected components
- Assess impact on existing security controls
- Understand purpose of changes
- Prioritize high-risk modifications

### Review Process

**Baseline Review Steps:**

1. Architecture review for security anti-patterns
2. Entry point analysis and input validation
3. Authentication and authorization verification
4. Data flow tracing
5. Business logic analysis
6. Cryptographic implementation review
7. Error handling verification
8. Configuration and deployment review

**Diff-Based Review Steps:**

1. Analyze impact on existing security controls
2. Identify new attack vectors
3. Verify security at modified trust boundaries
4. Check new integrations
5. Ensure no security regression
6. Apply relevant security patterns

## Common Vulnerability Patterns

### Input Validation Vulnerabilities

Check for missing server-side validation, improper sanitization, and weak input filtering. For more information, see [Input Validation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html).

### Injection Vulnerabilities

**SQL Injection:**

Look for string concatenation in database queries and unsafe query construction. For more information, see [SQL Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html).

**Cross-Site Scripting (XSS):**

Review output encoding, DOM manipulation, and user input rendering. For more information, see [Cross Site Scripting Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html).

**Path Traversal:**

Check for unsafe file path construction and directory traversal vulnerabilities. For more information, see [File Upload Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html).

**Command Injection:**

Identify direct command execution with user input and unsafe system calls. For more information, see [OS Command Injection Defense Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/OS_Command_Injection_Defense_Cheat_Sheet.html).

**NoSQL Injection:**

Examine NoSQL query construction and parameter binding. For more information, see [NoSQL Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/NoSQL_Security_Cheat_Sheet.html).

### Authentication & Session Management Vulnerabilities

Review authentication mechanisms, session token generation, and user credential handling. For more information, refer to [Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html) and [Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html).

### Access Control Vulnerabilities

Examine authorization checks, role-based access controls, and privilege escalation prevention. For more information, see [Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html).

### Deserialization Vulnerabilities

**Insecure Deserialization:**

Check for unsafe deserialization of untrusted data and object injection vulnerabilities. For more information, see [Deserialization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Deserialization_Cheat_Sheet.html).

**XML External Entity (XXE):**

Review XML parsing configurations and external entity processing. For more information, see [XML External Entity Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/XML_External_Entity_Prevention_Cheat_Sheet.html).

### Cryptographic Implementation Flaws

Examine encryption algorithms, key management, and cryptographic implementations. For more information, refer to [Cryptographic Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html).

## Review Techniques

### Code Pattern Analysis

Focus on high-risk code patterns:

- Input processing and validation functions
- Database query construction and ORM usage
- File operations and path handling
- Authentication and session management logic
- Authorization and access control checks
- Cryptographic operations and key management
- Error handling and logging mechanisms
- Configuration loading and environment variables

### Data Flow Analysis

Trace data through the application:

1. **Identify Sources**: User inputs, file uploads, API calls, database reads, environment variables
2. **Follow Processing**: Validation, transformation, business logic, caching
3. **Check Sinks**: Database queries, file writes, output rendering, logging, external APIs
4. **Validate Boundaries**: Input validation and output encoding at trust boundaries
5. **Trust Zones**: Verify security controls at each trust boundary crossing
6. **Data Classification**: Ensure sensitive data receives appropriate protection

### Threat-Based Review

Align review with common attack patterns:

- **OWASP Top 10**: Focus on prevalent web application risks
- **STRIDE Model**: Spoofing, Tampering, Repudiation, Information Disclosure, DoS, Elevation
- **Attack Trees**: Map potential attack paths through the application
- **Abuse Cases**: Consider how features could be misused by attackers
- **Security Controls**: Verify defense-in-depth implementation

### Business Logic Review

Analyze application workflows for:

- State management and transition validation
- Race conditions and concurrency issues
- Transaction integrity and rollback mechanisms
- Resource limits and quota enforcement
- Authorization at each workflow step
- Workflow bypass opportunities

## Review Checklists

### Input Validation

- [ ] **Server-side validation**: All inputs validated on server regardless of client-side checks
- [ ] **Allowlist validation**: Uses allowlists rather than blocklists for input validation
- [ ] **Output encoding**: Context-appropriate encoding (HTML, JavaScript, CSS, URL, SQL)
- [ ] **File upload security**: Content-based validation, size limits, safe storage
- [ ] **SQL injection prevention**: Parameterized queries or stored procedures used
- [ ] **Length limits**: Input length restrictions enforced
- [ ] **Character handling**: Special characters and Unicode properly processed
- [ ] **Error messages**: No sensitive information disclosed in error responses

### Authentication & Session Management

- [ ] **Password security**: Strong hashing algorithms and salt usage (for more information, see [Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html))
- [ ] **Account protection**: Lockout mechanisms with appropriate thresholds
- [ ] **Session management**: Secure token generation (≥128 bits entropy)
- [ ] **Session lifecycle**: Proper invalidation on logout/timeout
- [ ] **Re-authentication**: Required for sensitive operations
- [ ] **Multi-factor authentication**: Implementation for high-risk accounts (for more information, see [Multifactor Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html))
- [ ] **Password reset**: Secure, time-limited reset mechanisms (for more information, see [Forgot Password Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html))
- [ ] **Session security**: HttpOnly, Secure, SameSite cookie attributes
- [ ] **Concurrent sessions**: Appropriate limits and monitoring

### Authorization

- [ ] **Server-side enforcement**: All access controls enforced server-side
- [ ] **Fail-safe defaults**: Default deny access policy
- [ ] **IDOR prevention**: Proper authorization for resource access
- [ ] **Function-level controls**: Administrative functions properly protected
- [ ] **Role validation**: Role assignments cannot be manipulated
- [ ] **Privilege escalation**: Horizontal and vertical escalation prevented
- [ ] **Centralized decisions**: Access control logic centralized
- [ ] **Post-authentication checks**: Authorization verified after authentication

### Cryptography

- [ ] **Strong algorithms**: Modern algorithms (AES-256, RSA-2048+, ECDSA P-256+)
- [ ] **Key management**: Proper key generation, storage, and rotation (for more information, see [Key Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Key_Management_Cheat_Sheet.html))
- [ ] **Certificate validation**: Proper validation including hostname verification
- [ ] **Random generation**: Cryptographically secure random number generation
- [ ] **Data protection**: Encryption at rest and in transit
- [ ] **IV/Nonce handling**: Unique and unpredictable initialization vectors
- [ ] **Library maintenance**: Up-to-date cryptographic libraries
- [ ] **Side-channel protection**: Consideration of timing and other side-channel attacks

### Business Logic

- [ ] **Workflow integrity**: Proper state validation in multi-step processes
- [ ] **Race condition prevention**: Synchronization in concurrent operations
- [ ] **Transaction atomicity**: Proper rollback and consistency mechanisms
- [ ] **Resource limits**: Rate limiting and resource quotas implemented
- [ ] **Business rule enforcement**: Cannot bypass rules through direct API access

### Configuration & Deployment

- [ ] **Secure defaults**: Security-focused default configurations
- [ ] **Environment separation**: Proper isolation between environments
- [ ] **Secrets management**: No hardcoded secrets, proper secret storage and rotation (for more information, see [Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html))
- [ ] **Error handling**: Graceful error handling without information disclosure (for more information, see [Error Handling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Error_Handling_Cheat_Sheet.html))
- [ ] **Logging security**: Sensitive data not logged, proper log protection (for more information, see [Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html))
- [ ] **Security headers**: Appropriate HTTP security headers configured (for more information, see [HTTP Headers Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html))
- [ ] **TLS configuration**: Strong cipher suites and protocol versions (for more information, see [Transport Layer Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html))
- [ ] **Dependency management**: Up-to-date libraries without known vulnerabilities (for more information, see [Vulnerable Dependency Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Vulnerable_Dependency_Management_Cheat_Sheet.html))

### Security Monitoring

- [ ] **Security events**: Authentication failures, authorization violations logged
- [ ] **Anomaly detection**: Unusual patterns and behaviors monitored
- [ ] **Audit trails**: Complete audit logs for sensitive operations
- [ ] **Real-time alerts**: Critical security events trigger immediate notifications
- [ ] **Log integrity**: Logs protected from tampering and unauthorized access
- [ ] **Incident response**: Clear procedures for security incident handling

## Tools and Techniques

### Code Editors

Use editors with security extensions:

- Visual Studio Code with ESLint, SonarLint
- IntelliJ IDEA with SpotBugs, SonarLint
- Eclipse with security plugins
- Vim/Neovim with security linters

### Command-Line Pattern Detection

```bash
# Find hardcoded secrets
grep -ri "password\s*=\|api_key\s*=\|secret\s*=" source/

# Find unsafe functions
grep -r "eval(\|exec(\|innerHTML\|document\.write" source/

# Find potential injections
grep -r "SELECT.*+\|executeQuery.*+" source/
```

### Manual Review Focus Areas

**Human Expertise Advantages:**

- **Business Logic Flaws**: Complex workflows and state management issues that require domain understanding
- **Context-Specific Vulnerabilities**: Security issues that depend on application-specific business rules
- **Authorization Logic**: Complex permission models and access control implementations
- **Race Conditions**: Timing-based vulnerabilities in concurrent operations
- **Cryptographic Misuse**: Proper implementation of cryptographic primitives and protocols
- **Architecture Security**: High-level design flaws and security anti-patterns

**Manual Analysis Techniques:**

- **Code Path Tracing**: Following execution paths through complex business logic
- **State Analysis**: Understanding application state transitions and validation
- **Trust Boundary Mapping**: Identifying and analyzing security control points
- **Threat Modeling Integration**: Applying threat models to specific code implementations
- **Attack Scenario Simulation**: Mentally simulating attack paths through the code

### Automated Tool Integration

**Supporting Manual Reviews:**

- **SAST Tool Triage**: Use automated findings to prioritize manual review areas
- **Dependency Scanning**: Identify vulnerable libraries requiring manual assessment
- **Code Quality Metrics**: Focus manual effort on complex or frequently changed code
- **Pattern Detection**: Use tools to highlight potential security anti-patterns for human analysis

**Tool Integration Strategy:**

- **Pre-Review Scanning**: Run automated tools before manual review to identify obvious issues
- **Complementary Analysis**: Use tool findings to guide deeper manual investigation
- **False Positive Filtering**: Apply human judgment to validate automated findings
- **Coverage Gaps**: Focus manual review on areas automated tools cannot effectively analyze

**Security Metrics:**

- **Manual Review Coverage**: Percentage of critical code paths reviewed by humans
- **Finding Quality**: Ratio of valid security issues to total findings
- **Review Efficiency**: Time spent on manual review vs. security value delivered
- **Trend Analysis**: Security posture improvement over time

### Documentation Templates

**Finding Report Template:**

```text
Title: [Vulnerability Type] in [Component]
Severity: [Critical/High/Medium/Low]
CWE: [CWE Number and Name]
Location: [File:Line or Function]
Description: [Detailed explanation of the vulnerability]
Impact: [Security implications and potential attack scenarios]
Reproduction: [Steps to reproduce or proof of concept]
Recommendation: [Specific fix guidance with code examples]
References: [CWE links, OWASP references, vendor documentation]
Status: [Open/In Progress/Fixed/Accepted Risk]
Assignee: [Developer responsible for fix]
Due Date: [Target fix date]
```

**Review Summary Template:**

```text
Review Summary
==============
Application: [Application Name]
Version: [Version/Commit Hash]
Reviewer(s): [Names]
Review Date: [Date]
Scope: [Files/Components Reviewed]

Findings Summary:
- Critical: [Count]
- High: [Count]
- Medium: [Count]
- Low: [Count]
- Informational: [Count]

Key Recommendations:
1. [Priority recommendation]
2. [Priority recommendation]
3. [Priority recommendation]

Overall Risk Assessment: [Low/Medium/High/Critical]
```

## Integration with SDLC

### Review Timing

#### Baseline Review Integration

- **Project Initiation**: Comprehensive security assessment of existing codebase
- **Major Releases**: Full security review before significant version releases
- **Architecture Changes**: Complete review when fundamental design changes occur
- **Compliance Cycles**: Periodic comprehensive reviews for regulatory requirements
- **Security Incidents**: Thorough review following security breaches or major vulnerabilities
- **Onboarding Legacy Systems**: Initial security assessment when bringing existing applications under secure development practices

#### Diff-Based Review Integration

- **Pull Requests**: Security-focused review of code changes as part of standard PR process
- **Pre-commit Hooks**: Lightweight security checks on developer commits
- **Feature Completion**: Security review of completed user stories or features
- **Sprint Reviews**: Regular assessment of security implications of sprint deliverables
- **Hotfix Reviews**: Rapid security assessment of emergency fixes
- **Continuous Integration**: Automated triggering of security reviews based on code changes

#### Hybrid Approach

- **Risk-Based Scheduling**: Combine baseline reviews for high-risk components with diff-based reviews for routine changes
- **Incremental Baseline Updates**: Gradually expand baseline review coverage over multiple development cycles
- **Trigger-Based Reviews**: Escalate from diff-based to baseline review when significant security concerns are identified

For CI/CD integration and automated security testing, for more information see [CI CD Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/CI_CD_Security_Cheat_Sheet.html).

### Team Collaboration

**Roles:**

- **Security reviewers**: Conduct analysis and provide guidance
- **Developers**: Implement fixes and follow secure coding practices
- **Security champions**: Bridge security and development teams

**Best Practices:**

- Use standardized checklists and templates
- Maintain a knowledge base of common issues
- Track metrics on review effectiveness
- Provide regular security training
- Integrate with existing development workflows

## Advanced Techniques

### Race Condition Analysis

Focus on Time-of-Check vs Time-of-Use (TOCTOU) vulnerabilities and ensure atomic operations.

### Business Logic Analysis

Analyze workflows for:

- State transitions and validation
- Opportunities to bypass steps or validation
- Proper validation at each workflow step
- Rollback mechanisms and cleanup on failures
- Behavior under concurrent access
- Boundary conditions and error scenarios

### Security Architecture Review

Review architecture patterns for consistent security enforcement and proper API security controls.

### Memory Safety

Review buffer management, integer overflow protection, and resource limits.

## References

**OWASP Resources:**

- [OWASP Code Review Guide](https://owasp.org/www-project-code-review-guide/)
- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Application Security Verification Standard (ASVS)](https://owasp.org/www-project-application-security-verification-standard/)
- [OWASP Secure Coding Practices](https://owasp.org/www-project-secure-coding-practices-quick-reference-guide/)

**Related OWASP Cheat Sheets:**

- [Threat Modeling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html)
- [Abuse Case Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Abuse_Case_Cheat_Sheet.html)
- [Attack Surface Analysis Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Attack_Surface_Analysis_Cheat_Sheet.html)
- [Secure Product Design Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secure_Product_Design_Cheat_Sheet.html)
- [Mass Assignment Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Mass_Assignment_Cheat_Sheet.html)
- [Insecure Direct Object Reference Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html)
- [Cross-Site Request Forgery Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
- [Server Side Request Forgery Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html)
- [Unvalidated Redirects and Forwards Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html)
- [Denial of Service Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Denial_of_Service_Cheat_Sheet.html)

**Industry Standards:**

- [CWE/SANS Top 25 Most Dangerous Software Errors](https://cwe.mitre.org/top25/)
- [NIST Secure Software Development Framework (SSDF)](https://csrc.nist.gov/Projects/ssdf)
- [ISO/IEC 27034 - Application Security](https://www.iso.org/standard/44378.html)

**Additional Resources:**

- [Microsoft Security Development Lifecycle (SDL)](https://www.microsoft.com/en-us/securityengineering/sdl/)
- [CERT Secure Coding Standards](https://wiki.sei.cmu.edu/confluence/display/seccode)

</section>

<section id="secure-code-review-translation-panel" className="tabPanel translationPanel contentPanel">

# セキュアコードレビューチートシート

## はじめに

**セキュアコードレビュー**は、自動ツールでは見逃しやすいセキュリティ脆弱性を特定するために、ソースコードを手動で調べるプロセスです。人間の専門性と文脈理解を必要とするセキュリティ欠陥を検出するために、アプリケーションロジック、データフロー、実装の詳細を分析します。

**手動コードレビュー**は、ビジネスロジックの妥当性確認、複雑なセキュリティ実装、文脈依存の脆弱性など、人間による分析が最も価値を発揮する領域に注目することで、自動セキュリティテストツール (SAST/DAST) を補完します。自動ツールは懸念箇所の候補を示す補助として利用できますが、中核となる分析は人間の判断とドメイン専門知識に依存します。

**セキュリティ重視レビュー**は、入力検証、認証メカニズム、認可制御、暗号実装、潜在的な攻撃ベクトルなどのセキュリティ上の懸念を特に対象とする点で、機能コードレビューとは異なります。

### レビューの種類

**ベースラインレビュー**は、コードベース全体を包括的に調べます。次の場合に使用します。

- 新規アプリケーションまたはメジャーリリース
- レガシーシステムのオンボーディング
- コンプライアンス要件
- インシデント後の分析

**差分ベースレビュー**は、コード変更のみを対象にします。次の場合に使用します。

- プルリクエストとコミット
- 日常的な開発ワークフロー
- 機能完成時
- 継続的なセキュリティ検証

このチートシートは、ベースラインとインクリメンタルの両方のレビュー方法論に重点を置き、有効な手動セキュリティコードレビューを実施するための実践的なガイダンスを提供します。

## レビュー方法論

### 準備

**すべてのレビュー向け:**

- アプリケーションアーキテクチャとビジネス要件を理解する
- 脅威モデルと過去のセキュリティ指摘を収集する
- 重要資産と高リスク機能を特定する
- セキュリティ要件とドキュメントをレビューする

**ベースラインレビューで追加すること:**

- アプリケーション境界と依存関係の全体をマッピングする
- 全体的なセキュリティアーキテクチャを分析する
- セキュリティインシデント履歴をレビューする
- すべてのサードパーティライブラリを監査する

**差分ベースレビューで追加すること:**

- 変更されたファイルと影響を受けるコンポーネントを特定する
- 既存のセキュリティ制御への影響を評価する
- 変更の目的を理解する
- 高リスクな変更を優先する

### レビュープロセス

**ベースラインレビューの手順:**

1. セキュリティアンチパターンを対象としたアーキテクチャレビュー
2. エントリポイント分析と入力検証
3. 認証と認可の検証
4. データフローの追跡
5. ビジネスロジック分析
6. 暗号実装レビュー
7. エラー処理の検証
8. 設定とデプロイメントのレビュー

**差分ベースレビューの手順:**

1. 既存のセキュリティ制御への影響を分析する
2. 新しい攻撃ベクトルを特定する
3. 変更された信頼境界でセキュリティを検証する
4. 新しい連携を確認する
5. セキュリティリグレッションがないことを確認する
6. 関連するセキュリティパターンを適用する

## 一般的な脆弱性パターン

### 入力検証の脆弱性

サーバー側検証の欠如、不適切なサニタイズ、弱い入力フィルタリングを確認します。詳細については、[Input Validation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html) を参照してください。

### インジェクションの脆弱性

**SQL インジェクション:**

データベースクエリでの文字列連結と安全でないクエリ構築を探します。詳細については、[SQL Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html) を参照してください。

**クロスサイトスクリプティング (XSS):**

出力エンコーディング、DOM 操作、ユーザー入力のレンダリングをレビューします。詳細については、[Cross Site Scripting Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html) を参照してください。

**パストラバーサル:**

安全でないファイルパス構築とディレクトリトラバーサル脆弱性を確認します。詳細については、[File Upload Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html) を参照してください。

**コマンドインジェクション:**

ユーザー入力を伴う直接的なコマンド実行と安全でないシステムコールを特定します。詳細については、[OS Command Injection Defense Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/OS_Command_Injection_Defense_Cheat_Sheet.html) を参照してください。

**NoSQL インジェクション:**

NoSQL クエリ構築とパラメータバインディングを調べます。詳細については、[NoSQL Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/NoSQL_Security_Cheat_Sheet.html) を参照してください。

### 認証とセッション管理の脆弱性

認証メカニズム、セッショントークン生成、ユーザー認証情報の取り扱いをレビューします。詳細については、[Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html) と [Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html) を参照してください。

### アクセス制御の脆弱性

認可チェック、ロールベースアクセス制御、権限昇格防止を調べます。詳細については、[Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html) を参照してください。

### デシリアライゼーションの脆弱性

**安全でないデシリアライゼーション:**

信頼できないデータの安全でないデシリアライゼーションとオブジェクトインジェクション脆弱性を確認します。詳細については、[Deserialization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Deserialization_Cheat_Sheet.html) を参照してください。

**XML 外部エンティティ (XXE):**

XML 解析設定と外部エンティティ処理をレビューします。詳細については、[XML External Entity Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/XML_External_Entity_Prevention_Cheat_Sheet.html) を参照してください。

### 暗号実装の欠陥

暗号化アルゴリズム、鍵管理、暗号実装を調べます。詳細については、[Cryptographic Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html) を参照してください。

## レビュー技法

### コードパターン分析

高リスクなコードパターンに注目します。

- 入力処理と検証関数
- データベースクエリ構築と ORM の使用
- ファイル操作とパス処理
- 認証とセッション管理ロジック
- 認可とアクセス制御チェック
- 暗号操作と鍵管理
- エラー処理とロギングメカニズム
- 設定の読み込みと環境変数

### データフロー分析

アプリケーション内のデータを追跡します。

1. **ソースの特定**: ユーザー入力、ファイルアップロード、API 呼び出し、データベース読み取り、環境変数
2. **処理の追跡**: 検証、変換、ビジネスロジック、キャッシュ
3. **シンクの確認**: データベースクエリ、ファイル書き込み、出力レンダリング、ロギング、外部 API
4. **境界の検証**: 信頼境界での入力検証と出力エンコーディング
5. **信頼ゾーン**: 各信頼境界通過時のセキュリティ制御を検証する
6. **データ分類**: 機密データが適切な保護を受けていることを確認する

### 脅威ベースレビュー

一般的な攻撃パターンにレビューを合わせます。

- **OWASP Top 10**: 一般的な Web アプリケーションリスクに注目する
- **STRIDE モデル**: なりすまし、改ざん、否認、情報漏えい、DoS、権限昇格
- **攻撃ツリー**: アプリケーション内の潜在的な攻撃経路をマッピングする
- **悪用ケース**: 機能が攻撃者にどのように悪用され得るかを考慮する
- **セキュリティ制御**: 多層防御の実装を検証する

### ビジネスロジックレビュー

次の観点でアプリケーションワークフローを分析します。

- 状態管理と遷移検証
- 競合状態と並行性の問題
- トランザクション整合性とロールバックメカニズム
- リソース制限とクォータ適用
- 各ワークフローステップでの認可
- ワークフロー回避の機会

## レビューチェックリスト

### 入力検証

- [ ] **サーバー側検証**: クライアント側チェックの有無にかかわらず、すべての入力をサーバーで検証している
- [ ] **許可リスト検証**: 入力検証に拒否リストではなく許可リストを使用している
- [ ] **出力エンコーディング**: 文脈に適したエンコーディング (HTML、JavaScript、CSS、URL、SQL) を行っている
- [ ] **ファイルアップロードセキュリティ**: 内容ベースの検証、サイズ制限、安全な保存を行っている
- [ ] **SQL インジェクション防止**: パラメータ化クエリまたはストアドプロシージャを使用している
- [ ] **長さ制限**: 入力長の制限を適用している
- [ ] **文字処理**: 特殊文字と Unicode を適切に処理している
- [ ] **エラーメッセージ**: エラーレスポンスで機密情報を開示していない

### 認証とセッション管理

- [ ] **パスワードセキュリティ**: 強力なハッシュアルゴリズムとソルトを使用している (詳細については [Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html) を参照)
- [ ] **アカウント保護**: 適切なしきい値を持つロックアウトメカニズムを備えている
- [ ] **セッション管理**: 安全なトークン生成 (128 ビット以上のエントロピー) を行っている
- [ ] **セッションライフサイクル**: ログアウトまたはタイムアウト時に適切に無効化している
- [ ] **再認証**: 機密性の高い操作で再認証を必須にしている
- [ ] **多要素認証**: 高リスクアカウントに実装している (詳細については [Multifactor Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html) を参照)
- [ ] **パスワードリセット**: 安全で時間制限付きのリセットメカニズムを使用している (詳細については [Forgot Password Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html) を参照)
- [ ] **セッションセキュリティ**: HttpOnly、Secure、SameSite Cookie 属性を使用している
- [ ] **同時セッション**: 適切な制限と監視を行っている

### 認可

- [ ] **サーバー側適用**: すべてのアクセス制御をサーバー側で適用している
- [ ] **フェイルセーフデフォルト**: デフォルト拒否のアクセスポリシーを採用している
- [ ] **IDOR 防止**: リソースアクセスに対して適切に認可している
- [ ] **機能レベル制御**: 管理機能を適切に保護している
- [ ] **ロール検証**: ロール割り当てを改ざんできない
- [ ] **権限昇格**: 水平および垂直方向の権限昇格を防止している
- [ ] **集中化された判断**: アクセス制御ロジックを集中化している
- [ ] **認証後チェック**: 認証後に認可を検証している

### 暗号

- [ ] **強力なアルゴリズム**: 最新のアルゴリズム (AES-256、RSA-2048+、ECDSA P-256+) を使用している
- [ ] **鍵管理**: 適切な鍵生成、保存、ローテーションを行っている (詳細については [Key Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Key_Management_Cheat_Sheet.html) を参照)
- [ ] **証明書検証**: ホスト名検証を含む適切な検証を行っている
- [ ] **乱数生成**: 暗号学的に安全な乱数生成を使用している
- [ ] **データ保護**: 保存時と転送時に暗号化している
- [ ] **IV/Nonce の取り扱い**: 一意で予測困難な初期化ベクトルを使用している
- [ ] **ライブラリ保守**: 最新の暗号ライブラリを使用している
- [ ] **サイドチャネル保護**: タイミング攻撃などのサイドチャネル攻撃を考慮している

### ビジネスロジック

- [ ] **ワークフロー整合性**: 複数ステップのプロセスで適切な状態検証を行っている
- [ ] **競合状態防止**: 並行操作で同期を行っている
- [ ] **トランザクション原子性**: 適切なロールバックと一貫性メカニズムを備えている
- [ ] **リソース制限**: レート制限とリソースクォータを実装している
- [ ] **ビジネスルール適用**: 直接 API アクセスによってルールを回避できない

### 設定とデプロイメント

- [ ] **安全なデフォルト**: セキュリティ重視のデフォルト設定を使用している
- [ ] **環境分離**: 環境間を適切に分離している
- [ ] **シークレット管理**: ハードコードされたシークレットがなく、適切なシークレット保存とローテーションを行っている (詳細については [Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html) を参照)
- [ ] **エラー処理**: 情報開示を伴わない安全なエラー処理を行っている (詳細については [Error Handling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Error_Handling_Cheat_Sheet.html) を参照)
- [ ] **ロギングセキュリティ**: 機密データをログに記録せず、ログを適切に保護している (詳細については [Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html) を参照)
- [ ] **セキュリティヘッダー**: 適切な HTTP セキュリティヘッダーを設定している (詳細については [HTTP Headers Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html) を参照)
- [ ] **TLS 設定**: 強力な暗号スイートとプロトコルバージョンを使用している (詳細については [Transport Layer Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html) を参照)
- [ ] **依存関係管理**: 既知の脆弱性がない最新のライブラリを使用している (詳細については [Vulnerable Dependency Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Vulnerable_Dependency_Management_Cheat_Sheet.html) を参照)

### セキュリティ監視

- [ ] **セキュリティイベント**: 認証失敗、認可違反をログに記録している
- [ ] **異常検知**: 通常と異なるパターンや振る舞いを監視している
- [ ] **監査証跡**: 機密性の高い操作について完全な監査ログを保持している
- [ ] **リアルタイムアラート**: 重大なセキュリティイベントが即時通知を発生させる
- [ ] **ログ完全性**: ログを改ざんと不正アクセスから保護している
- [ ] **インシデント対応**: セキュリティインシデント対応の明確な手順を備えている

## ツールと技法

### コードエディタ

セキュリティ拡張機能を備えたエディタを使用します。

- ESLint、SonarLint を備えた Visual Studio Code
- SpotBugs、SonarLint を備えた IntelliJ IDEA
- セキュリティプラグインを備えた Eclipse
- セキュリティリンターを備えた Vim/Neovim

### コマンドラインによるパターン検出

```bash
# Find hardcoded secrets
grep -ri "password\s*=\|api_key\s*=\|secret\s*=" source/

# Find unsafe functions
grep -r "eval(\|exec(\|innerHTML\|document\.write" source/

# Find potential injections
grep -r "SELECT.*+\|executeQuery.*+" source/
```

### 手動レビューの重点領域

**人間の専門性による利点:**

- **ビジネスロジックの欠陥**: ドメイン理解を必要とする複雑なワークフローと状態管理の問題
- **文脈依存の脆弱性**: アプリケーション固有のビジネスルールに依存するセキュリティ問題
- **認可ロジック**: 複雑な権限モデルとアクセス制御実装
- **競合状態**: 並行操作におけるタイミング依存の脆弱性
- **暗号の誤用**: 暗号プリミティブとプロトコルの適切な実装
- **アーキテクチャセキュリティ**: 高レベル設計の欠陥とセキュリティアンチパターン

**手動分析技法:**

- **コードパストレーシング**: 複雑なビジネスロジック内の実行経路を追跡する
- **状態分析**: アプリケーションの状態遷移と検証を理解する
- **信頼境界マッピング**: セキュリティ制御ポイントを特定して分析する
- **脅威モデリング連携**: 特定のコード実装に脅威モデルを適用する
- **攻撃シナリオシミュレーション**: コード内の攻撃経路を頭の中でシミュレートする

### 自動ツール連携

**手動レビューの支援:**

- **SAST ツールのトリアージ**: 自動検出結果を使用して手動レビュー領域の優先順位を付ける
- **依存関係スキャン**: 手動評価を必要とする脆弱なライブラリを特定する
- **コード品質メトリクス**: 複雑なコードや頻繁に変更されるコードに手動作業を集中する
- **パターン検出**: ツールを使用して、人間による分析が必要な潜在的セキュリティアンチパターンを目立たせる

**ツール連携戦略:**

- **レビュー前スキャン**: 明らかな問題を特定するため、手動レビュー前に自動ツールを実行する
- **補完的分析**: ツール検出結果を使用して、より深い手動調査を導く
- **誤検知フィルタリング**: 人間の判断を適用して自動検出結果を妥当性確認する
- **カバレッジギャップ**: 自動ツールでは有効に分析できない領域に手動レビューを集中する

**セキュリティメトリクス:**

- **手動レビューカバレッジ**: 人間がレビューした重要コードパスの割合
- **検出品質**: 検出総数に対する有効なセキュリティ問題の比率
- **レビュー効率**: 手動レビューに費やした時間と提供されたセキュリティ価値
- **傾向分析**: 時間経過に伴うセキュリティ態勢の改善

### ドキュメントテンプレート

**検出事項レポートテンプレート:**

```text
Title: [Vulnerability Type] in [Component]
Severity: [Critical/High/Medium/Low]
CWE: [CWE Number and Name]
Location: [File:Line or Function]
Description: [Detailed explanation of the vulnerability]
Impact: [Security implications and potential attack scenarios]
Reproduction: [Steps to reproduce or proof of concept]
Recommendation: [Specific fix guidance with code examples]
References: [CWE links, OWASP references, vendor documentation]
Status: [Open/In Progress/Fixed/Accepted Risk]
Assignee: [Developer responsible for fix]
Due Date: [Target fix date]
```

**レビューサマリーテンプレート:**

```text
Review Summary
==============
Application: [Application Name]
Version: [Version/Commit Hash]
Reviewer(s): [Names]
Review Date: [Date]
Scope: [Files/Components Reviewed]

Findings Summary:
- Critical: [Count]
- High: [Count]
- Medium: [Count]
- Low: [Count]
- Informational: [Count]

Key Recommendations:
1. [Priority recommendation]
2. [Priority recommendation]
3. [Priority recommendation]

Overall Risk Assessment: [Low/Medium/High/Critical]
```

## SDLC との連携

### レビューのタイミング

#### ベースラインレビュー連携

- **プロジェクト開始**: 既存コードベースの包括的なセキュリティ評価
- **メジャーリリース**: 重要なバージョンリリース前の完全なセキュリティレビュー
- **アーキテクチャ変更**: 基本設計が変更される場合の完全なレビュー
- **コンプライアンスサイクル**: 規制要件に応じた定期的な包括レビュー
- **セキュリティインシデント**: セキュリティ侵害または重大な脆弱性後の詳細レビュー
- **レガシーシステムのオンボーディング**: 既存アプリケーションをセキュア開発プラクティスに組み込む際の初期セキュリティ評価

#### 差分ベースレビュー連携

- **プルリクエスト**: 標準 PR プロセスの一部として行うコード変更のセキュリティ重視レビュー
- **プリコミットフック**: 開発者コミットに対する軽量なセキュリティチェック
- **機能完成**: 完成したユーザーストーリーまたは機能のセキュリティレビュー
- **スプリントレビュー**: スプリント成果物のセキュリティ上の影響に関する定期評価
- **ホットフィックスレビュー**: 緊急修正に対する迅速なセキュリティ評価
- **継続的インテグレーション**: コード変更に基づくセキュリティレビューの自動トリガー

#### ハイブリッドアプローチ

- **リスクベーススケジューリング**: 高リスクコンポーネントへのベースラインレビューと、通常変更への差分ベースレビューを組み合わせる
- **インクリメンタルなベースライン更新**: 複数の開発サイクルにわたってベースラインレビューのカバレッジを段階的に拡大する
- **トリガーベースレビュー**: 重要なセキュリティ懸念が特定された場合、差分ベースレビューからベースラインレビューへエスカレーションする

CI/CD 連携と自動セキュリティテストの詳細については、[CI CD Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/CI_CD_Security_Cheat_Sheet.html) を参照してください。

### チームコラボレーション

**ロール:**

- **セキュリティレビュー担当者**: 分析を実施し、ガイダンスを提供する
- **開発者**: 修正を実装し、セキュアコーディングプラクティスに従う
- **セキュリティチャンピオン**: セキュリティチームと開発チームをつなぐ

**ベストプラクティス:**

- 標準化されたチェックリストとテンプレートを使用する
- 一般的な問題のナレッジベースを維持する
- レビュー有効性に関するメトリクスを追跡する
- 定期的なセキュリティトレーニングを提供する
- 既存の開発ワークフローに統合する

## 高度な技法

### 競合状態分析

Time-of-Check vs Time-of-Use (TOCTOU) 脆弱性に注目し、操作の原子性を確保します。

### ビジネスロジック分析

次の観点でワークフローを分析します。

- 状態遷移と検証
- ステップまたは検証を回避する機会
- 各ワークフローステップでの適切な検証
- 障害時のロールバックメカニズムとクリーンアップ
- 並行アクセス時の振る舞い
- 境界条件とエラーシナリオ

### セキュリティアーキテクチャレビュー

一貫したセキュリティ適用と適切な API セキュリティ制御の観点から、アーキテクチャパターンをレビューします。

### メモリ安全性

バッファ管理、整数オーバーフロー保護、リソース制限をレビューします。

## References

**OWASP Resources:**

- [OWASP Code Review Guide](https://owasp.org/www-project-code-review-guide/)
- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Application Security Verification Standard (ASVS)](https://owasp.org/www-project-application-security-verification-standard/)
- [OWASP Secure Coding Practices](https://owasp.org/www-project-secure-coding-practices-quick-reference-guide/)

**Related OWASP Cheat Sheets:**

- [Threat Modeling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html)
- [Abuse Case Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Abuse_Case_Cheat_Sheet.html)
- [Attack Surface Analysis Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Attack_Surface_Analysis_Cheat_Sheet.html)
- [Secure Product Design Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secure_Product_Design_Cheat_Sheet.html)
- [Mass Assignment Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Mass_Assignment_Cheat_Sheet.html)
- [Insecure Direct Object Reference Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html)
- [Cross-Site Request Forgery Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
- [Server Side Request Forgery Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html)
- [Unvalidated Redirects and Forwards Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html)
- [Denial of Service Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Denial_of_Service_Cheat_Sheet.html)

**Industry Standards:**

- [CWE/SANS Top 25 Most Dangerous Software Errors](https://cwe.mitre.org/top25/)
- [NIST Secure Software Development Framework (SSDF)](https://csrc.nist.gov/Projects/ssdf)
- [ISO/IEC 27034 - Application Security](https://www.iso.org/standard/44378.html)

**Additional Resources:**

- [Microsoft Security Development Lifecycle (SDL)](https://www.microsoft.com/en-us/securityengineering/sdl/)
- [CERT Secure Coding Standards](https://wiki.sei.cmu.edu/confluence/display/seccode)

</section>

<section id="secure-code-review-bilingual-panel" className="tabPanel bilingualPanel">

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

# Secure Code Review Cheat Sheet

## Introduction

**Secure Code Review** is the process of manually examining source code to identify security vulnerabilities that automated tools often miss. It involves analyzing application logic, data flow, and implementation details to detect security flaws that require human expertise and contextual understanding.

**Manual Code Review** complements automated security testing tools (SAST/DAST) by focusing on areas where human analysis provides the most value, including business logic validation, complex security implementations, and context-specific vulnerabilities. While automated tools can assist by highlighting potential areas of concern, the core analysis relies on human judgment and domain expertise.

**Security-Focused Review** differs from functional code review by specifically targeting security concerns such as input validation, authentication mechanisms, authorization controls, cryptographic implementations, and potential attack vectors.

### Review Types

**Baseline Reviews** examine the entire codebase comprehensively. Use for:

- New applications or major releases
- Legacy system onboarding
- Compliance requirements
- Post-incident analysis

**Diff-Based Reviews** focus on code changes only. Use for:

- Pull requests and commits
- Daily development workflow
- Feature completion
- Continuous security validation

This cheat sheet provides practical guidance for conducting effective manual security code reviews, with emphasis on both baseline and incremental review methodologies.

## Review Methodology

### Preparation

**For All Reviews:**

- Understand application architecture and business requirements
- Gather threat models and previous security findings
- Identify critical assets and high-risk functions
- Review security requirements and documentation

**Additional for Baseline Reviews:**

- Map complete application boundaries and dependencies
- Analyze overall security architecture
- Review security incident history
- Audit all third-party libraries

**Additional for Diff-Based Reviews:**

- Identify modified files and affected components
- Assess impact on existing security controls
- Understand purpose of changes
- Prioritize high-risk modifications

### Review Process

**Baseline Review Steps:**

1. Architecture review for security anti-patterns
2. Entry point analysis and input validation
3. Authentication and authorization verification
4. Data flow tracing
5. Business logic analysis
6. Cryptographic implementation review
7. Error handling verification
8. Configuration and deployment review

**Diff-Based Review Steps:**

1. Analyze impact on existing security controls
2. Identify new attack vectors
3. Verify security at modified trust boundaries
4. Check new integrations
5. Ensure no security regression
6. Apply relevant security patterns

## Common Vulnerability Patterns

### Input Validation Vulnerabilities

Check for missing server-side validation, improper sanitization, and weak input filtering. For more information, see [Input Validation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html).

### Injection Vulnerabilities

**SQL Injection:**

Look for string concatenation in database queries and unsafe query construction. For more information, see [SQL Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html).

**Cross-Site Scripting (XSS):**

Review output encoding, DOM manipulation, and user input rendering. For more information, see [Cross Site Scripting Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html).

**Path Traversal:**

Check for unsafe file path construction and directory traversal vulnerabilities. For more information, see [File Upload Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html).

**Command Injection:**

Identify direct command execution with user input and unsafe system calls. For more information, see [OS Command Injection Defense Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/OS_Command_Injection_Defense_Cheat_Sheet.html).

**NoSQL Injection:**

Examine NoSQL query construction and parameter binding. For more information, see [NoSQL Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/NoSQL_Security_Cheat_Sheet.html).

### Authentication & Session Management Vulnerabilities

Review authentication mechanisms, session token generation, and user credential handling. For more information, refer to [Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html) and [Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html).

### Access Control Vulnerabilities

Examine authorization checks, role-based access controls, and privilege escalation prevention. For more information, see [Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html).

### Deserialization Vulnerabilities

**Insecure Deserialization:**

Check for unsafe deserialization of untrusted data and object injection vulnerabilities. For more information, see [Deserialization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Deserialization_Cheat_Sheet.html).

**XML External Entity (XXE):**

Review XML parsing configurations and external entity processing. For more information, see [XML External Entity Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/XML_External_Entity_Prevention_Cheat_Sheet.html).

### Cryptographic Implementation Flaws

Examine encryption algorithms, key management, and cryptographic implementations. For more information, refer to [Cryptographic Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html).

## Review Techniques

### Code Pattern Analysis

Focus on high-risk code patterns:

- Input processing and validation functions
- Database query construction and ORM usage
- File operations and path handling
- Authentication and session management logic
- Authorization and access control checks
- Cryptographic operations and key management
- Error handling and logging mechanisms
- Configuration loading and environment variables

### Data Flow Analysis

Trace data through the application:

1. **Identify Sources**: User inputs, file uploads, API calls, database reads, environment variables
2. **Follow Processing**: Validation, transformation, business logic, caching
3. **Check Sinks**: Database queries, file writes, output rendering, logging, external APIs
4. **Validate Boundaries**: Input validation and output encoding at trust boundaries
5. **Trust Zones**: Verify security controls at each trust boundary crossing
6. **Data Classification**: Ensure sensitive data receives appropriate protection

### Threat-Based Review

Align review with common attack patterns:

- **OWASP Top 10**: Focus on prevalent web application risks
- **STRIDE Model**: Spoofing, Tampering, Repudiation, Information Disclosure, DoS, Elevation
- **Attack Trees**: Map potential attack paths through the application
- **Abuse Cases**: Consider how features could be misused by attackers
- **Security Controls**: Verify defense-in-depth implementation

### Business Logic Review

Analyze application workflows for:

- State management and transition validation
- Race conditions and concurrency issues
- Transaction integrity and rollback mechanisms
- Resource limits and quota enforcement
- Authorization at each workflow step
- Workflow bypass opportunities

## Review Checklists

### Input Validation

- [ ] **Server-side validation**: All inputs validated on server regardless of client-side checks
- [ ] **Allowlist validation**: Uses allowlists rather than blocklists for input validation
- [ ] **Output encoding**: Context-appropriate encoding (HTML, JavaScript, CSS, URL, SQL)
- [ ] **File upload security**: Content-based validation, size limits, safe storage
- [ ] **SQL injection prevention**: Parameterized queries or stored procedures used
- [ ] **Length limits**: Input length restrictions enforced
- [ ] **Character handling**: Special characters and Unicode properly processed
- [ ] **Error messages**: No sensitive information disclosed in error responses

### Authentication & Session Management

- [ ] **Password security**: Strong hashing algorithms and salt usage (for more information, see [Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html))
- [ ] **Account protection**: Lockout mechanisms with appropriate thresholds
- [ ] **Session management**: Secure token generation (≥128 bits entropy)
- [ ] **Session lifecycle**: Proper invalidation on logout/timeout
- [ ] **Re-authentication**: Required for sensitive operations
- [ ] **Multi-factor authentication**: Implementation for high-risk accounts (for more information, see [Multifactor Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html))
- [ ] **Password reset**: Secure, time-limited reset mechanisms (for more information, see [Forgot Password Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html))
- [ ] **Session security**: HttpOnly, Secure, SameSite cookie attributes
- [ ] **Concurrent sessions**: Appropriate limits and monitoring

### Authorization

- [ ] **Server-side enforcement**: All access controls enforced server-side
- [ ] **Fail-safe defaults**: Default deny access policy
- [ ] **IDOR prevention**: Proper authorization for resource access
- [ ] **Function-level controls**: Administrative functions properly protected
- [ ] **Role validation**: Role assignments cannot be manipulated
- [ ] **Privilege escalation**: Horizontal and vertical escalation prevented
- [ ] **Centralized decisions**: Access control logic centralized
- [ ] **Post-authentication checks**: Authorization verified after authentication

### Cryptography

- [ ] **Strong algorithms**: Modern algorithms (AES-256, RSA-2048+, ECDSA P-256+)
- [ ] **Key management**: Proper key generation, storage, and rotation (for more information, see [Key Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Key_Management_Cheat_Sheet.html))
- [ ] **Certificate validation**: Proper validation including hostname verification
- [ ] **Random generation**: Cryptographically secure random number generation
- [ ] **Data protection**: Encryption at rest and in transit
- [ ] **IV/Nonce handling**: Unique and unpredictable initialization vectors
- [ ] **Library maintenance**: Up-to-date cryptographic libraries
- [ ] **Side-channel protection**: Consideration of timing and other side-channel attacks

### Business Logic

- [ ] **Workflow integrity**: Proper state validation in multi-step processes
- [ ] **Race condition prevention**: Synchronization in concurrent operations
- [ ] **Transaction atomicity**: Proper rollback and consistency mechanisms
- [ ] **Resource limits**: Rate limiting and resource quotas implemented
- [ ] **Business rule enforcement**: Cannot bypass rules through direct API access

### Configuration & Deployment

- [ ] **Secure defaults**: Security-focused default configurations
- [ ] **Environment separation**: Proper isolation between environments
- [ ] **Secrets management**: No hardcoded secrets, proper secret storage and rotation (for more information, see [Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html))
- [ ] **Error handling**: Graceful error handling without information disclosure (for more information, see [Error Handling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Error_Handling_Cheat_Sheet.html))
- [ ] **Logging security**: Sensitive data not logged, proper log protection (for more information, see [Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html))
- [ ] **Security headers**: Appropriate HTTP security headers configured (for more information, see [HTTP Headers Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html))
- [ ] **TLS configuration**: Strong cipher suites and protocol versions (for more information, see [Transport Layer Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html))
- [ ] **Dependency management**: Up-to-date libraries without known vulnerabilities (for more information, see [Vulnerable Dependency Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Vulnerable_Dependency_Management_Cheat_Sheet.html))

### Security Monitoring

- [ ] **Security events**: Authentication failures, authorization violations logged
- [ ] **Anomaly detection**: Unusual patterns and behaviors monitored
- [ ] **Audit trails**: Complete audit logs for sensitive operations
- [ ] **Real-time alerts**: Critical security events trigger immediate notifications
- [ ] **Log integrity**: Logs protected from tampering and unauthorized access
- [ ] **Incident response**: Clear procedures for security incident handling

## Tools and Techniques

### Code Editors

Use editors with security extensions:

- Visual Studio Code with ESLint, SonarLint
- IntelliJ IDEA with SpotBugs, SonarLint
- Eclipse with security plugins
- Vim/Neovim with security linters

### Command-Line Pattern Detection

```bash
# Find hardcoded secrets
grep -ri "password\s*=\|api_key\s*=\|secret\s*=" source/

# Find unsafe functions
grep -r "eval(\|exec(\|innerHTML\|document\.write" source/

# Find potential injections
grep -r "SELECT.*+\|executeQuery.*+" source/
```

### Manual Review Focus Areas

**Human Expertise Advantages:**

- **Business Logic Flaws**: Complex workflows and state management issues that require domain understanding
- **Context-Specific Vulnerabilities**: Security issues that depend on application-specific business rules
- **Authorization Logic**: Complex permission models and access control implementations
- **Race Conditions**: Timing-based vulnerabilities in concurrent operations
- **Cryptographic Misuse**: Proper implementation of cryptographic primitives and protocols
- **Architecture Security**: High-level design flaws and security anti-patterns

**Manual Analysis Techniques:**

- **Code Path Tracing**: Following execution paths through complex business logic
- **State Analysis**: Understanding application state transitions and validation
- **Trust Boundary Mapping**: Identifying and analyzing security control points
- **Threat Modeling Integration**: Applying threat models to specific code implementations
- **Attack Scenario Simulation**: Mentally simulating attack paths through the code

### Automated Tool Integration

**Supporting Manual Reviews:**

- **SAST Tool Triage**: Use automated findings to prioritize manual review areas
- **Dependency Scanning**: Identify vulnerable libraries requiring manual assessment
- **Code Quality Metrics**: Focus manual effort on complex or frequently changed code
- **Pattern Detection**: Use tools to highlight potential security anti-patterns for human analysis

**Tool Integration Strategy:**

- **Pre-Review Scanning**: Run automated tools before manual review to identify obvious issues
- **Complementary Analysis**: Use tool findings to guide deeper manual investigation
- **False Positive Filtering**: Apply human judgment to validate automated findings
- **Coverage Gaps**: Focus manual review on areas automated tools cannot effectively analyze

**Security Metrics:**

- **Manual Review Coverage**: Percentage of critical code paths reviewed by humans
- **Finding Quality**: Ratio of valid security issues to total findings
- **Review Efficiency**: Time spent on manual review vs. security value delivered
- **Trend Analysis**: Security posture improvement over time

### Documentation Templates

**Finding Report Template:**

```text
Title: [Vulnerability Type] in [Component]
Severity: [Critical/High/Medium/Low]
CWE: [CWE Number and Name]
Location: [File:Line or Function]
Description: [Detailed explanation of the vulnerability]
Impact: [Security implications and potential attack scenarios]
Reproduction: [Steps to reproduce or proof of concept]
Recommendation: [Specific fix guidance with code examples]
References: [CWE links, OWASP references, vendor documentation]
Status: [Open/In Progress/Fixed/Accepted Risk]
Assignee: [Developer responsible for fix]
Due Date: [Target fix date]
```

**Review Summary Template:**

```text
Review Summary
==============
Application: [Application Name]
Version: [Version/Commit Hash]
Reviewer(s): [Names]
Review Date: [Date]
Scope: [Files/Components Reviewed]

Findings Summary:
- Critical: [Count]
- High: [Count]
- Medium: [Count]
- Low: [Count]
- Informational: [Count]

Key Recommendations:
1. [Priority recommendation]
2. [Priority recommendation]
3. [Priority recommendation]

Overall Risk Assessment: [Low/Medium/High/Critical]
```

## Integration with SDLC

### Review Timing

#### Baseline Review Integration

- **Project Initiation**: Comprehensive security assessment of existing codebase
- **Major Releases**: Full security review before significant version releases
- **Architecture Changes**: Complete review when fundamental design changes occur
- **Compliance Cycles**: Periodic comprehensive reviews for regulatory requirements
- **Security Incidents**: Thorough review following security breaches or major vulnerabilities
- **Onboarding Legacy Systems**: Initial security assessment when bringing existing applications under secure development practices

#### Diff-Based Review Integration

- **Pull Requests**: Security-focused review of code changes as part of standard PR process
- **Pre-commit Hooks**: Lightweight security checks on developer commits
- **Feature Completion**: Security review of completed user stories or features
- **Sprint Reviews**: Regular assessment of security implications of sprint deliverables
- **Hotfix Reviews**: Rapid security assessment of emergency fixes
- **Continuous Integration**: Automated triggering of security reviews based on code changes

#### Hybrid Approach

- **Risk-Based Scheduling**: Combine baseline reviews for high-risk components with diff-based reviews for routine changes
- **Incremental Baseline Updates**: Gradually expand baseline review coverage over multiple development cycles
- **Trigger-Based Reviews**: Escalate from diff-based to baseline review when significant security concerns are identified

For CI/CD integration and automated security testing, for more information see [CI CD Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/CI_CD_Security_Cheat_Sheet.html).

### Team Collaboration

**Roles:**

- **Security reviewers**: Conduct analysis and provide guidance
- **Developers**: Implement fixes and follow secure coding practices
- **Security champions**: Bridge security and development teams

**Best Practices:**

- Use standardized checklists and templates
- Maintain a knowledge base of common issues
- Track metrics on review effectiveness
- Provide regular security training
- Integrate with existing development workflows

## Advanced Techniques

### Race Condition Analysis

Focus on Time-of-Check vs Time-of-Use (TOCTOU) vulnerabilities and ensure atomic operations.

### Business Logic Analysis

Analyze workflows for:

- State transitions and validation
- Opportunities to bypass steps or validation
- Proper validation at each workflow step
- Rollback mechanisms and cleanup on failures
- Behavior under concurrent access
- Boundary conditions and error scenarios

### Security Architecture Review

Review architecture patterns for consistent security enforcement and proper API security controls.

### Memory Safety

Review buffer management, integer overflow protection, and resource limits.

## References

**OWASP Resources:**

- [OWASP Code Review Guide](https://owasp.org/www-project-code-review-guide/)
- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Application Security Verification Standard (ASVS)](https://owasp.org/www-project-application-security-verification-standard/)
- [OWASP Secure Coding Practices](https://owasp.org/www-project-secure-coding-practices-quick-reference-guide/)

**Related OWASP Cheat Sheets:**

- [Threat Modeling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html)
- [Abuse Case Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Abuse_Case_Cheat_Sheet.html)
- [Attack Surface Analysis Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Attack_Surface_Analysis_Cheat_Sheet.html)
- [Secure Product Design Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secure_Product_Design_Cheat_Sheet.html)
- [Mass Assignment Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Mass_Assignment_Cheat_Sheet.html)
- [Insecure Direct Object Reference Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html)
- [Cross-Site Request Forgery Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
- [Server Side Request Forgery Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html)
- [Unvalidated Redirects and Forwards Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html)
- [Denial of Service Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Denial_of_Service_Cheat_Sheet.html)

**Industry Standards:**

- [CWE/SANS Top 25 Most Dangerous Software Errors](https://cwe.mitre.org/top25/)
- [NIST Secure Software Development Framework (SSDF)](https://csrc.nist.gov/Projects/ssdf)
- [ISO/IEC 27034 - Application Security](https://www.iso.org/standard/44378.html)

**Additional Resources:**

- [Microsoft Security Development Lifecycle (SDL)](https://www.microsoft.com/en-us/securityengineering/sdl/)
- [CERT Secure Coding Standards](https://wiki.sei.cmu.edu/confluence/display/seccode)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

# セキュアコードレビューチートシート

## はじめに

**セキュアコードレビュー**は、自動ツールでは見逃しやすいセキュリティ脆弱性を特定するために、ソースコードを手動で調べるプロセスです。人間の専門性と文脈理解を必要とするセキュリティ欠陥を検出するために、アプリケーションロジック、データフロー、実装の詳細を分析します。

**手動コードレビュー**は、ビジネスロジックの妥当性確認、複雑なセキュリティ実装、文脈依存の脆弱性など、人間による分析が最も価値を発揮する領域に注目することで、自動セキュリティテストツール (SAST/DAST) を補完します。自動ツールは懸念箇所の候補を示す補助として利用できますが、中核となる分析は人間の判断とドメイン専門知識に依存します。

**セキュリティ重視レビュー**は、入力検証、認証メカニズム、認可制御、暗号実装、潜在的な攻撃ベクトルなどのセキュリティ上の懸念を特に対象とする点で、機能コードレビューとは異なります。

### レビューの種類

**ベースラインレビュー**は、コードベース全体を包括的に調べます。次の場合に使用します。

- 新規アプリケーションまたはメジャーリリース
- レガシーシステムのオンボーディング
- コンプライアンス要件
- インシデント後の分析

**差分ベースレビュー**は、コード変更のみを対象にします。次の場合に使用します。

- プルリクエストとコミット
- 日常的な開発ワークフロー
- 機能完成時
- 継続的なセキュリティ検証

このチートシートは、ベースラインとインクリメンタルの両方のレビュー方法論に重点を置き、有効な手動セキュリティコードレビューを実施するための実践的なガイダンスを提供します。

## レビュー方法論

### 準備

**すべてのレビュー向け:**

- アプリケーションアーキテクチャとビジネス要件を理解する
- 脅威モデルと過去のセキュリティ指摘を収集する
- 重要資産と高リスク機能を特定する
- セキュリティ要件とドキュメントをレビューする

**ベースラインレビューで追加すること:**

- アプリケーション境界と依存関係の全体をマッピングする
- 全体的なセキュリティアーキテクチャを分析する
- セキュリティインシデント履歴をレビューする
- すべてのサードパーティライブラリを監査する

**差分ベースレビューで追加すること:**

- 変更されたファイルと影響を受けるコンポーネントを特定する
- 既存のセキュリティ制御への影響を評価する
- 変更の目的を理解する
- 高リスクな変更を優先する

### レビュープロセス

**ベースラインレビューの手順:**

1. セキュリティアンチパターンを対象としたアーキテクチャレビュー
2. エントリポイント分析と入力検証
3. 認証と認可の検証
4. データフローの追跡
5. ビジネスロジック分析
6. 暗号実装レビュー
7. エラー処理の検証
8. 設定とデプロイメントのレビュー

**差分ベースレビューの手順:**

1. 既存のセキュリティ制御への影響を分析する
2. 新しい攻撃ベクトルを特定する
3. 変更された信頼境界でセキュリティを検証する
4. 新しい連携を確認する
5. セキュリティリグレッションがないことを確認する
6. 関連するセキュリティパターンを適用する

## 一般的な脆弱性パターン

### 入力検証の脆弱性

サーバー側検証の欠如、不適切なサニタイズ、弱い入力フィルタリングを確認します。詳細については、[Input Validation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html) を参照してください。

### インジェクションの脆弱性

**SQL インジェクション:**

データベースクエリでの文字列連結と安全でないクエリ構築を探します。詳細については、[SQL Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html) を参照してください。

**クロスサイトスクリプティング (XSS):**

出力エンコーディング、DOM 操作、ユーザー入力のレンダリングをレビューします。詳細については、[Cross Site Scripting Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html) を参照してください。

**パストラバーサル:**

安全でないファイルパス構築とディレクトリトラバーサル脆弱性を確認します。詳細については、[File Upload Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html) を参照してください。

**コマンドインジェクション:**

ユーザー入力を伴う直接的なコマンド実行と安全でないシステムコールを特定します。詳細については、[OS Command Injection Defense Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/OS_Command_Injection_Defense_Cheat_Sheet.html) を参照してください。

**NoSQL インジェクション:**

NoSQL クエリ構築とパラメータバインディングを調べます。詳細については、[NoSQL Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/NoSQL_Security_Cheat_Sheet.html) を参照してください。

### 認証とセッション管理の脆弱性

認証メカニズム、セッショントークン生成、ユーザー認証情報の取り扱いをレビューします。詳細については、[Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html) と [Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html) を参照してください。

### アクセス制御の脆弱性

認可チェック、ロールベースアクセス制御、権限昇格防止を調べます。詳細については、[Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html) を参照してください。

### デシリアライゼーションの脆弱性

**安全でないデシリアライゼーション:**

信頼できないデータの安全でないデシリアライゼーションとオブジェクトインジェクション脆弱性を確認します。詳細については、[Deserialization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Deserialization_Cheat_Sheet.html) を参照してください。

**XML 外部エンティティ (XXE):**

XML 解析設定と外部エンティティ処理をレビューします。詳細については、[XML External Entity Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/XML_External_Entity_Prevention_Cheat_Sheet.html) を参照してください。

### 暗号実装の欠陥

暗号化アルゴリズム、鍵管理、暗号実装を調べます。詳細については、[Cryptographic Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html) を参照してください。

## レビュー技法

### コードパターン分析

高リスクなコードパターンに注目します。

- 入力処理と検証関数
- データベースクエリ構築と ORM の使用
- ファイル操作とパス処理
- 認証とセッション管理ロジック
- 認可とアクセス制御チェック
- 暗号操作と鍵管理
- エラー処理とロギングメカニズム
- 設定の読み込みと環境変数

### データフロー分析

アプリケーション内のデータを追跡します。

1. **ソースの特定**: ユーザー入力、ファイルアップロード、API 呼び出し、データベース読み取り、環境変数
2. **処理の追跡**: 検証、変換、ビジネスロジック、キャッシュ
3. **シンクの確認**: データベースクエリ、ファイル書き込み、出力レンダリング、ロギング、外部 API
4. **境界の検証**: 信頼境界での入力検証と出力エンコーディング
5. **信頼ゾーン**: 各信頼境界通過時のセキュリティ制御を検証する
6. **データ分類**: 機密データが適切な保護を受けていることを確認する

### 脅威ベースレビュー

一般的な攻撃パターンにレビューを合わせます。

- **OWASP Top 10**: 一般的な Web アプリケーションリスクに注目する
- **STRIDE モデル**: なりすまし、改ざん、否認、情報漏えい、DoS、権限昇格
- **攻撃ツリー**: アプリケーション内の潜在的な攻撃経路をマッピングする
- **悪用ケース**: 機能が攻撃者にどのように悪用され得るかを考慮する
- **セキュリティ制御**: 多層防御の実装を検証する

### ビジネスロジックレビュー

次の観点でアプリケーションワークフローを分析します。

- 状態管理と遷移検証
- 競合状態と並行性の問題
- トランザクション整合性とロールバックメカニズム
- リソース制限とクォータ適用
- 各ワークフローステップでの認可
- ワークフロー回避の機会

## レビューチェックリスト

### 入力検証

- [ ] **サーバー側検証**: クライアント側チェックの有無にかかわらず、すべての入力をサーバーで検証している
- [ ] **許可リスト検証**: 入力検証に拒否リストではなく許可リストを使用している
- [ ] **出力エンコーディング**: 文脈に適したエンコーディング (HTML、JavaScript、CSS、URL、SQL) を行っている
- [ ] **ファイルアップロードセキュリティ**: 内容ベースの検証、サイズ制限、安全な保存を行っている
- [ ] **SQL インジェクション防止**: パラメータ化クエリまたはストアドプロシージャを使用している
- [ ] **長さ制限**: 入力長の制限を適用している
- [ ] **文字処理**: 特殊文字と Unicode を適切に処理している
- [ ] **エラーメッセージ**: エラーレスポンスで機密情報を開示していない

### 認証とセッション管理

- [ ] **パスワードセキュリティ**: 強力なハッシュアルゴリズムとソルトを使用している (詳細については [Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html) を参照)
- [ ] **アカウント保護**: 適切なしきい値を持つロックアウトメカニズムを備えている
- [ ] **セッション管理**: 安全なトークン生成 (128 ビット以上のエントロピー) を行っている
- [ ] **セッションライフサイクル**: ログアウトまたはタイムアウト時に適切に無効化している
- [ ] **再認証**: 機密性の高い操作で再認証を必須にしている
- [ ] **多要素認証**: 高リスクアカウントに実装している (詳細については [Multifactor Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html) を参照)
- [ ] **パスワードリセット**: 安全で時間制限付きのリセットメカニズムを使用している (詳細については [Forgot Password Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html) を参照)
- [ ] **セッションセキュリティ**: HttpOnly、Secure、SameSite Cookie 属性を使用している
- [ ] **同時セッション**: 適切な制限と監視を行っている

### 認可

- [ ] **サーバー側適用**: すべてのアクセス制御をサーバー側で適用している
- [ ] **フェイルセーフデフォルト**: デフォルト拒否のアクセスポリシーを採用している
- [ ] **IDOR 防止**: リソースアクセスに対して適切に認可している
- [ ] **機能レベル制御**: 管理機能を適切に保護している
- [ ] **ロール検証**: ロール割り当てを改ざんできない
- [ ] **権限昇格**: 水平および垂直方向の権限昇格を防止している
- [ ] **集中化された判断**: アクセス制御ロジックを集中化している
- [ ] **認証後チェック**: 認証後に認可を検証している

### 暗号

- [ ] **強力なアルゴリズム**: 最新のアルゴリズム (AES-256、RSA-2048+、ECDSA P-256+) を使用している
- [ ] **鍵管理**: 適切な鍵生成、保存、ローテーションを行っている (詳細については [Key Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Key_Management_Cheat_Sheet.html) を参照)
- [ ] **証明書検証**: ホスト名検証を含む適切な検証を行っている
- [ ] **乱数生成**: 暗号学的に安全な乱数生成を使用している
- [ ] **データ保護**: 保存時と転送時に暗号化している
- [ ] **IV/Nonce の取り扱い**: 一意で予測困難な初期化ベクトルを使用している
- [ ] **ライブラリ保守**: 最新の暗号ライブラリを使用している
- [ ] **サイドチャネル保護**: タイミング攻撃などのサイドチャネル攻撃を考慮している

### ビジネスロジック

- [ ] **ワークフロー整合性**: 複数ステップのプロセスで適切な状態検証を行っている
- [ ] **競合状態防止**: 並行操作で同期を行っている
- [ ] **トランザクション原子性**: 適切なロールバックと一貫性メカニズムを備えている
- [ ] **リソース制限**: レート制限とリソースクォータを実装している
- [ ] **ビジネスルール適用**: 直接 API アクセスによってルールを回避できない

### 設定とデプロイメント

- [ ] **安全なデフォルト**: セキュリティ重視のデフォルト設定を使用している
- [ ] **環境分離**: 環境間を適切に分離している
- [ ] **シークレット管理**: ハードコードされたシークレットがなく、適切なシークレット保存とローテーションを行っている (詳細については [Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html) を参照)
- [ ] **エラー処理**: 情報開示を伴わない安全なエラー処理を行っている (詳細については [Error Handling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Error_Handling_Cheat_Sheet.html) を参照)
- [ ] **ロギングセキュリティ**: 機密データをログに記録せず、ログを適切に保護している (詳細については [Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html) を参照)
- [ ] **セキュリティヘッダー**: 適切な HTTP セキュリティヘッダーを設定している (詳細については [HTTP Headers Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html) を参照)
- [ ] **TLS 設定**: 強力な暗号スイートとプロトコルバージョンを使用している (詳細については [Transport Layer Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html) を参照)
- [ ] **依存関係管理**: 既知の脆弱性がない最新のライブラリを使用している (詳細については [Vulnerable Dependency Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Vulnerable_Dependency_Management_Cheat_Sheet.html) を参照)

### セキュリティ監視

- [ ] **セキュリティイベント**: 認証失敗、認可違反をログに記録している
- [ ] **異常検知**: 通常と異なるパターンや振る舞いを監視している
- [ ] **監査証跡**: 機密性の高い操作について完全な監査ログを保持している
- [ ] **リアルタイムアラート**: 重大なセキュリティイベントが即時通知を発生させる
- [ ] **ログ完全性**: ログを改ざんと不正アクセスから保護している
- [ ] **インシデント対応**: セキュリティインシデント対応の明確な手順を備えている

## ツールと技法

### コードエディタ

セキュリティ拡張機能を備えたエディタを使用します。

- ESLint、SonarLint を備えた Visual Studio Code
- SpotBugs、SonarLint を備えた IntelliJ IDEA
- セキュリティプラグインを備えた Eclipse
- セキュリティリンターを備えた Vim/Neovim

### コマンドラインによるパターン検出

```bash
# Find hardcoded secrets
grep -ri "password\s*=\|api_key\s*=\|secret\s*=" source/

# Find unsafe functions
grep -r "eval(\|exec(\|innerHTML\|document\.write" source/

# Find potential injections
grep -r "SELECT.*+\|executeQuery.*+" source/
```

### 手動レビューの重点領域

**人間の専門性による利点:**

- **ビジネスロジックの欠陥**: ドメイン理解を必要とする複雑なワークフローと状態管理の問題
- **文脈依存の脆弱性**: アプリケーション固有のビジネスルールに依存するセキュリティ問題
- **認可ロジック**: 複雑な権限モデルとアクセス制御実装
- **競合状態**: 並行操作におけるタイミング依存の脆弱性
- **暗号の誤用**: 暗号プリミティブとプロトコルの適切な実装
- **アーキテクチャセキュリティ**: 高レベル設計の欠陥とセキュリティアンチパターン

**手動分析技法:**

- **コードパストレーシング**: 複雑なビジネスロジック内の実行経路を追跡する
- **状態分析**: アプリケーションの状態遷移と検証を理解する
- **信頼境界マッピング**: セキュリティ制御ポイントを特定して分析する
- **脅威モデリング連携**: 特定のコード実装に脅威モデルを適用する
- **攻撃シナリオシミュレーション**: コード内の攻撃経路を頭の中でシミュレートする

### 自動ツール連携

**手動レビューの支援:**

- **SAST ツールのトリアージ**: 自動検出結果を使用して手動レビュー領域の優先順位を付ける
- **依存関係スキャン**: 手動評価を必要とする脆弱なライブラリを特定する
- **コード品質メトリクス**: 複雑なコードや頻繁に変更されるコードに手動作業を集中する
- **パターン検出**: ツールを使用して、人間による分析が必要な潜在的セキュリティアンチパターンを目立たせる

**ツール連携戦略:**

- **レビュー前スキャン**: 明らかな問題を特定するため、手動レビュー前に自動ツールを実行する
- **補完的分析**: ツール検出結果を使用して、より深い手動調査を導く
- **誤検知フィルタリング**: 人間の判断を適用して自動検出結果を妥当性確認する
- **カバレッジギャップ**: 自動ツールでは有効に分析できない領域に手動レビューを集中する

**セキュリティメトリクス:**

- **手動レビューカバレッジ**: 人間がレビューした重要コードパスの割合
- **検出品質**: 検出総数に対する有効なセキュリティ問題の比率
- **レビュー効率**: 手動レビューに費やした時間と提供されたセキュリティ価値
- **傾向分析**: 時間経過に伴うセキュリティ態勢の改善

### ドキュメントテンプレート

**検出事項レポートテンプレート:**

```text
Title: [Vulnerability Type] in [Component]
Severity: [Critical/High/Medium/Low]
CWE: [CWE Number and Name]
Location: [File:Line or Function]
Description: [Detailed explanation of the vulnerability]
Impact: [Security implications and potential attack scenarios]
Reproduction: [Steps to reproduce or proof of concept]
Recommendation: [Specific fix guidance with code examples]
References: [CWE links, OWASP references, vendor documentation]
Status: [Open/In Progress/Fixed/Accepted Risk]
Assignee: [Developer responsible for fix]
Due Date: [Target fix date]
```

**レビューサマリーテンプレート:**

```text
Review Summary
==============
Application: [Application Name]
Version: [Version/Commit Hash]
Reviewer(s): [Names]
Review Date: [Date]
Scope: [Files/Components Reviewed]

Findings Summary:
- Critical: [Count]
- High: [Count]
- Medium: [Count]
- Low: [Count]
- Informational: [Count]

Key Recommendations:
1. [Priority recommendation]
2. [Priority recommendation]
3. [Priority recommendation]

Overall Risk Assessment: [Low/Medium/High/Critical]
```

## SDLC との連携

### レビューのタイミング

#### ベースラインレビュー連携

- **プロジェクト開始**: 既存コードベースの包括的なセキュリティ評価
- **メジャーリリース**: 重要なバージョンリリース前の完全なセキュリティレビュー
- **アーキテクチャ変更**: 基本設計が変更される場合の完全なレビュー
- **コンプライアンスサイクル**: 規制要件に応じた定期的な包括レビュー
- **セキュリティインシデント**: セキュリティ侵害または重大な脆弱性後の詳細レビュー
- **レガシーシステムのオンボーディング**: 既存アプリケーションをセキュア開発プラクティスに組み込む際の初期セキュリティ評価

#### 差分ベースレビュー連携

- **プルリクエスト**: 標準 PR プロセスの一部として行うコード変更のセキュリティ重視レビュー
- **プリコミットフック**: 開発者コミットに対する軽量なセキュリティチェック
- **機能完成**: 完成したユーザーストーリーまたは機能のセキュリティレビュー
- **スプリントレビュー**: スプリント成果物のセキュリティ上の影響に関する定期評価
- **ホットフィックスレビュー**: 緊急修正に対する迅速なセキュリティ評価
- **継続的インテグレーション**: コード変更に基づくセキュリティレビューの自動トリガー

#### ハイブリッドアプローチ

- **リスクベーススケジューリング**: 高リスクコンポーネントへのベースラインレビューと、通常変更への差分ベースレビューを組み合わせる
- **インクリメンタルなベースライン更新**: 複数の開発サイクルにわたってベースラインレビューのカバレッジを段階的に拡大する
- **トリガーベースレビュー**: 重要なセキュリティ懸念が特定された場合、差分ベースレビューからベースラインレビューへエスカレーションする

CI/CD 連携と自動セキュリティテストの詳細については、[CI CD Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/CI_CD_Security_Cheat_Sheet.html) を参照してください。

### チームコラボレーション

**ロール:**

- **セキュリティレビュー担当者**: 分析を実施し、ガイダンスを提供する
- **開発者**: 修正を実装し、セキュアコーディングプラクティスに従う
- **セキュリティチャンピオン**: セキュリティチームと開発チームをつなぐ

**ベストプラクティス:**

- 標準化されたチェックリストとテンプレートを使用する
- 一般的な問題のナレッジベースを維持する
- レビュー有効性に関するメトリクスを追跡する
- 定期的なセキュリティトレーニングを提供する
- 既存の開発ワークフローに統合する

## 高度な技法

### 競合状態分析

Time-of-Check vs Time-of-Use (TOCTOU) 脆弱性に注目し、操作の原子性を確保します。

### ビジネスロジック分析

次の観点でワークフローを分析します。

- 状態遷移と検証
- ステップまたは検証を回避する機会
- 各ワークフローステップでの適切な検証
- 障害時のロールバックメカニズムとクリーンアップ
- 並行アクセス時の振る舞い
- 境界条件とエラーシナリオ

### セキュリティアーキテクチャレビュー

一貫したセキュリティ適用と適切な API セキュリティ制御の観点から、アーキテクチャパターンをレビューします。

### メモリ安全性

バッファ管理、整数オーバーフロー保護、リソース制限をレビューします。

## References

**OWASP Resources:**

- [OWASP Code Review Guide](https://owasp.org/www-project-code-review-guide/)
- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Application Security Verification Standard (ASVS)](https://owasp.org/www-project-application-security-verification-standard/)
- [OWASP Secure Coding Practices](https://owasp.org/www-project-secure-coding-practices-quick-reference-guide/)

**Related OWASP Cheat Sheets:**

- [Threat Modeling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html)
- [Abuse Case Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Abuse_Case_Cheat_Sheet.html)
- [Attack Surface Analysis Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Attack_Surface_Analysis_Cheat_Sheet.html)
- [Secure Product Design Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secure_Product_Design_Cheat_Sheet.html)
- [Mass Assignment Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Mass_Assignment_Cheat_Sheet.html)
- [Insecure Direct Object Reference Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html)
- [Cross-Site Request Forgery Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
- [Server Side Request Forgery Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html)
- [Unvalidated Redirects and Forwards Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html)
- [Denial of Service Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Denial_of_Service_Cheat_Sheet.html)

**Industry Standards:**

- [CWE/SANS Top 25 Most Dangerous Software Errors](https://cwe.mitre.org/top25/)
- [NIST Secure Software Development Framework (SSDF)](https://csrc.nist.gov/Projects/ssdf)
- [ISO/IEC 27034 - Application Security](https://www.iso.org/standard/44378.html)

**Additional Resources:**

- [Microsoft Security Development Lifecycle (SDL)](https://www.microsoft.com/en-us/securityengineering/sdl/)
- [CERT Secure Coding Standards](https://wiki.sei.cmu.edu/confluence/display/seccode)

</div>
</div>

</section>

## Attribution

<div className="attributionFooter">

- Original: Secure Code Review Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Secure_Code_Review_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: English original retained for comparison. Japanese translation added.
- Retrieved: 2026-05-21

</div>
