import fs from 'node:fs/promises';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();

const pages = [
  {
    slug: 'bean-validation',
    asvs: 'V1.2',
    title: 'Bean Validation Cheat Sheet',
    subtitle: 'Bean Validation チートシート',
    sourceName: 'Bean_Validation_Cheat_Sheet',
    categoryKey: 'encoding-and-sanitization',
    categoryLabel: 'Encoding and Sanitization',
    readTime: '約 12 分',
    jaMode: 'bilingualTranslationPanel',
  },
  {
    slug: 'csrf-prevention',
    asvs: 'V1.3, V3, V4',
    title: 'Cross-Site Request Forgery Prevention Cheat Sheet',
    subtitle: 'CSRF防止チートシート',
    sourceName: 'Cross-Site_Request_Forgery_Prevention_Cheat_Sheet',
    categoryKey: 'encoding-and-sanitization',
    categoryLabel: 'Encoding and Sanitization',
    readTime: '約 10 分',
    jaMode: 'bilingualTranslationPanel',
  },
  {
    slug: 'cryptographic-storage',
    asvs: 'V11.1, V11.2, V11.3, V11.5, V13.3, V14.1',
    title: 'Cryptographic Storage Cheat Sheet',
    subtitle: '暗号化ストレージチートシート',
    sourceName: 'Cryptographic_Storage_Cheat_Sheet',
    categoryKey: 'cryptographic-storage',
    categoryLabel: 'Cryptographic Storage',
    readTime: '約 9 分',
    jaMode: 'bilingualTranslationPanel',
  },
  {
    slug: 'authentication',
    asvs: 'V6.2, V6.3, V6.5, V6.7, V6.8',
    title: 'Authentication Cheat Sheet',
    subtitle: '認証チートシート',
    sourceName: 'Authentication_Cheat_Sheet',
    categoryKey: 'authentication',
    categoryLabel: 'Authentication',
    readTime: '約 20 分',
  },
  {
    slug: 'authorization',
    asvs: 'V8.1, V8.2, V8.4, V16.3',
    title: 'Authorization Cheat Sheet',
    subtitle: '認可チートシート',
    sourceName: 'Authorization_Cheat_Sheet',
    categoryKey: 'authorization',
    categoryLabel: 'Authorization',
    readTime: '約 12 分',
  },
  {
    slug: 'credential-stuffing-prevention',
    asvs: 'V6.1, V6.2, V6.3, V6.6',
    title: 'Credential Stuffing Prevention Cheat Sheet',
    subtitle: 'クレデンシャルスタッフィング防止チートシート',
    sourceName: 'Credential_Stuffing_Prevention_Cheat_Sheet',
    categoryKey: 'authentication',
    categoryLabel: 'Authentication',
    readTime: '約 10 分',
  },
  {
    slug: 'forgot-password',
    asvs: 'V6.3, V6.4, V6.6',
    title: 'Forgot Password Cheat Sheet',
    subtitle: 'パスワード忘れ対応チートシート',
    sourceName: 'Forgot_Password_Cheat_Sheet',
    categoryKey: 'authentication',
    categoryLabel: 'Authentication',
    readTime: '約 10 分',
  },
  {
    slug: 'logging',
    asvs: 'V10.7, V16.1, V16.2, V16.3, V16.4',
    title: 'Logging Cheat Sheet',
    subtitle: 'ロギングチートシート',
    sourceName: 'Logging_Cheat_Sheet',
    categoryKey: 'logging-monitoring',
    categoryLabel: 'Logging and Monitoring',
    readTime: '約 18 分',
  },
  {
    slug: 'multifactor-authentication',
    asvs: 'V6.2, V6.3, V6.4, V6.5, V6.8',
    title: 'Multifactor Authentication Cheat Sheet',
    subtitle: '多要素認証チートシート',
    sourceName: 'Multifactor_Authentication_Cheat_Sheet',
    categoryKey: 'authentication',
    categoryLabel: 'Authentication',
    readTime: '約 12 分',
  },
  {
    slug: 'oauth2',
    asvs: 'V10.1, V10.2, V10.3, V10.4, V10.5, V10.6',
    title: 'OAuth 2.0 Protocol Cheat Sheet',
    subtitle: 'OAuth 2.0 プロトコルチートシート',
    sourceName: 'OAuth2_Cheat_Sheet',
    categoryKey: 'api-and-web-service',
    categoryLabel: 'API and Web Service',
    readTime: '約 18 分',
  },
  {
    slug: 'password-storage',
    asvs: 'V6.5, V11.4',
    title: 'Password Storage Cheat Sheet',
    subtitle: 'パスワード保存チートシート',
    sourceName: 'Password_Storage_Cheat_Sheet',
    categoryKey: 'cryptographic-storage',
    categoryLabel: 'Cryptographic Storage',
    readTime: '約 10 分',
  },
  {
    slug: 'rest-security',
    asvs: 'V4.1, V4.2, V4.3, V4.4, V9.2',
    title: 'REST Security Cheat Sheet',
    subtitle: 'REST セキュリティチートシート',
    sourceName: 'REST_Security_Cheat_Sheet',
    categoryKey: 'api-and-web-service',
    categoryLabel: 'API and Web Service',
    readTime: '約 16 分',
  },
  {
    slug: 'session-management',
    asvs: 'V7, V16.2',
    title: 'Session Management Cheat Sheet',
    subtitle: 'セッション管理チートシート',
    sourceName: 'Session_Management_Cheat_Sheet',
    categoryKey: 'session-management',
    categoryLabel: 'Session Management',
    readTime: '約 14 分',
  },
];

const asvsChapters = [
  {
    id: 1,
    title: 'Encoding and Sanitization',
    sections: [
      { id: 'V1.1', title: 'Encoding and Sanitization Architecture' },
      { id: 'V1.2', title: 'Injection Prevention' },
      { id: 'V1.3', title: 'Sanitization' },
      { id: 'V1.4', title: 'Memory, String, and Unmanaged Code' },
      { id: 'V1.5', title: 'Safe Deserialization' },
    ],
  },
  {
    id: 2,
    title: 'Validation and Business Logic',
    sections: [
      { id: 'V2.1', title: 'Validation and Business Logic Documentation' },
      { id: 'V2.2', title: 'Input Validation' },
      { id: 'V2.3', title: 'Business Logic Security' },
      { id: 'V2.4', title: 'Anti-automation' },
    ],
  },
  {
    id: 3,
    title: 'Web Frontend Security',
    sections: [
      { id: 'V3.1', title: 'Web Frontend Security Documentation' },
      { id: 'V3.2', title: 'Unintended Content Interpretation' },
      { id: 'V3.3', title: 'Cookie Setup' },
      { id: 'V3.4', title: 'Browser Security Mechanism Headers' },
      { id: 'V3.5', title: 'Browser Origin Separation' },
      { id: 'V3.6', title: 'External Resource Integrity' },
      { id: 'V3.7', title: 'Other Browser Security Considerations' },
    ],
  },
  {
    id: 4,
    title: 'API and Web Service',
    sections: [
      { id: 'V4.1', title: 'Generic Web Service Security' },
      { id: 'V4.2', title: 'HTTP Message Structure Validation' },
      { id: 'V4.3', title: 'GraphQL' },
      { id: 'V4.4', title: 'WebSocket' },
    ],
  },
  {
    id: 5,
    title: 'File Handling',
    sections: [
      { id: 'V5.1', title: 'File Handling Documentation' },
      { id: 'V5.2', title: 'File Upload and Content' },
      { id: 'V5.3', title: 'File Storage' },
      { id: 'V5.4', title: 'File Download' },
    ],
  },
  {
    id: 6,
    title: 'Authentication',
    sections: [
      { id: 'V6.1', title: 'Authentication Documentation' },
      { id: 'V6.2', title: 'Password Security' },
      { id: 'V6.3', title: 'General Authentication Security' },
      { id: 'V6.4', title: 'Authentication Factor Lifecycle and Recovery' },
      { id: 'V6.5', title: 'General Multi-factor authentication requirements' },
      { id: 'V6.6', title: 'Out-of-Band authentication mechanisms' },
      { id: 'V6.7', title: 'Cryptographic authentication mechanism' },
      { id: 'V6.8', title: 'Authentication with an Identity Provider' },
    ],
  },
  {
    id: 7,
    title: 'Session Management',
    sections: [
      { id: 'V7.1', title: 'Session Management Documentation' },
      { id: 'V7.2', title: 'Fundamental Session Management Security' },
      { id: 'V7.3', title: 'Session Timeout' },
      { id: 'V7.4', title: 'Session Termination' },
      { id: 'V7.5', title: 'Defenses Against Session Abuse' },
      { id: 'V7.6', title: 'Federated Re-authentication' },
    ],
  },
  {
    id: 8,
    title: 'Authorization',
    sections: [
      { id: 'V8.1', title: 'Authorization Documentation' },
      { id: 'V8.2', title: 'General Authorization Design' },
      { id: 'V8.3', title: 'Operation Level Authorization' },
      { id: 'V8.4', title: 'Other Authorization Considerations' },
    ],
  },
  {
    id: 9,
    title: 'Self-contained Tokens',
    sections: [
      { id: 'V9.1', title: 'Token source and integrity' },
      { id: 'V9.2', title: 'Token content' },
    ],
  },
  {
    id: 10,
    title: 'OAuth and OIDC',
    sections: [
      { id: 'V10.1', title: 'Generic OAuth and OIDC Security' },
      { id: 'V10.2', title: 'OAuth Client' },
      { id: 'V10.3', title: 'OAuth Resource Server' },
      { id: 'V10.4', title: 'OAuth Authorization Server' },
      { id: 'V10.5', title: 'OIDC Client' },
      { id: 'V10.6', title: 'OpenID Provider' },
      { id: 'V10.7', title: 'Consent Management' },
    ],
  },
  {
    id: 11,
    title: 'Cryptography',
    sections: [
      { id: 'V11.1', title: 'Cryptographic Inventory and Documentation' },
      { id: 'V11.2', title: 'Secure Cryptography Implementation' },
      { id: 'V11.3', title: 'Encryption Algorithms' },
      { id: 'V11.4', title: 'Hashing and Hash-based Functions' },
      { id: 'V11.5', title: 'Random Values' },
      { id: 'V11.6', title: 'Public Key Cryptography' },
      { id: 'V11.7', title: 'In-Use Data Cryptography' },
    ],
  },
  {
    id: 12,
    title: 'Secure Communication',
    sections: [
      { id: 'V12.1', title: 'General TLS Security Guidance' },
      { id: 'V12.2', title: 'HTTPS Communication with External Facing Services' },
      { id: 'V12.3', title: 'General Service to Service Communication Security' },
    ],
  },
  {
    id: 13,
    title: 'Configuration',
    sections: [
      { id: 'V13.1', title: 'Configuration Documentation' },
      { id: 'V13.2', title: 'Backend Communication Configuration' },
      { id: 'V13.3', title: 'Secret Management' },
      { id: 'V13.4', title: 'Unintended Information Leakage' },
    ],
  },
  {
    id: 14,
    title: 'Data Protection',
    sections: [
      { id: 'V14.1', title: 'Data Protection Documentation' },
      { id: 'V14.2', title: 'General Data Protection' },
      { id: 'V14.3', title: 'Client-side Data Protection' },
    ],
  },
  {
    id: 15,
    title: 'Secure Coding and Architecture',
    sections: [
      { id: 'V15.1', title: 'Secure Coding and Architecture Documentation' },
      { id: 'V15.2', title: 'Security Architecture and Dependencies' },
      { id: 'V15.3', title: 'Defensive Coding' },
      { id: 'V15.4', title: 'Safe Concurrency' },
    ],
  },
  {
    id: 16,
    title: 'Security Logging and Error Handling',
    sections: [
      { id: 'V16.1', title: 'Security Logging Documentation' },
      { id: 'V16.2', title: 'General Logging' },
      { id: 'V16.3', title: 'Security Events' },
      { id: 'V16.4', title: 'Log Protection' },
      { id: 'V16.5', title: 'Error Handling' },
    ],
  },
  {
    id: 17,
    title: 'WebRTC',
    sections: [
      { id: 'V17.1', title: 'TURN Server' },
      { id: 'V17.2', title: 'Media' },
      { id: 'V17.3', title: 'Signaling' },
    ],
  },
];

const sheetCatalog = {
  'abuse-case': {
    title: 'Abuse Case Cheat Sheet',
    subtitle: 'Abuse Case チートシート',
    sourceName: 'Abuse_Case_Cheat_Sheet',
  },
  authentication: {
    title: 'Authentication Cheat Sheet',
    subtitle: '認証チートシート',
    sourceName: 'Authentication_Cheat_Sheet',
  },
  authorization: {
    title: 'Authorization Cheat Sheet',
    subtitle: '認可チートシート',
    sourceName: 'Authorization_Cheat_Sheet',
  },
  'authorization-testing-automation': {
    title: 'Authorization Testing Automation Cheat Sheet',
    subtitle: '認可テスト自動化チートシート',
    sourceName: 'Authorization_Testing_Automation_Cheat_Sheet',
  },
  'attack-surface-analysis': {
    title: 'Attack Surface Analysis Cheat Sheet',
    subtitle: '攻撃対象領域分析チートシート',
    sourceName: 'Attack_Surface_Analysis_Cheat_Sheet',
  },
  'bean-validation': {
    title: 'Bean Validation Cheat Sheet',
    subtitle: 'Bean Validation チートシート',
    sourceName: 'Bean_Validation_Cheat_Sheet',
  },
  'browser-extension-vulnerabilities': {
    title: 'Browser Extension Vulnerabilities Cheat Sheet',
    subtitle: 'ブラウザ拡張機能脆弱性チートシート',
    sourceName: 'Browser_Extension_Vulnerabilities_Cheat_Sheet',
  },
  'content-security-policy': {
    title: 'Content Security Policy Cheat Sheet',
    subtitle: 'Content Security Policy チートシート',
    sourceName: 'Content_Security_Policy_Cheat_Sheet',
  },
  'credential-stuffing-prevention': {
    title: 'Credential Stuffing Prevention Cheat Sheet',
    subtitle: 'クレデンシャルスタッフィング防止チートシート',
    sourceName: 'Credential_Stuffing_Prevention_Cheat_Sheet',
  },
  'cryptographic-storage': {
    title: 'Cryptographic Storage Cheat Sheet',
    subtitle: '暗号化ストレージチートシート',
    sourceName: 'Cryptographic_Storage_Cheat_Sheet',
  },
  'csrf-prevention': {
    title: 'Cross-Site Request Forgery Prevention Cheat Sheet',
    subtitle: 'CSRF防止チートシート',
    sourceName: 'Cross-Site_Request_Forgery_Prevention_Cheat_Sheet',
  },
  'denial-of-service': {
    title: 'Denial of Service Cheat Sheet',
    subtitle: 'Denial of Service チートシート',
    sourceName: 'Denial_of_Service_Cheat_Sheet',
  },
  'dependency-graph-sbom': {
    title: 'Dependency Graph and SBOM Cheat Sheet',
    subtitle: 'Dependency Graph and SBOM チートシート',
    sourceName: 'Dependency_Graph_SBOM_Cheat_Sheet',
  },
  deserialization: {
    title: 'Deserialization Cheat Sheet',
    subtitle: 'デシリアライゼーションチートシート',
    sourceName: 'Deserialization_Cheat_Sheet',
  },
  'django-security': {
    title: 'Django Security Cheat Sheet',
    subtitle: 'Django セキュリティチートシート',
    sourceName: 'Django_Security_Cheat_Sheet',
  },
  'docker-security': {
    title: 'Docker Security Cheat Sheet',
    subtitle: 'Docker セキュリティチートシート',
    sourceName: 'Docker_Security_Cheat_Sheet',
  },
  'dom-based-xss-prevention': {
    title: 'DOM based XSS Prevention Cheat Sheet',
    subtitle: 'DOM based XSS 防止チートシート',
    sourceName: 'DOM_based_XSS_Prevention_Cheat_Sheet',
  },
  'dom-clobbering-prevention': {
    title: 'DOM Clobbering Prevention Cheat Sheet',
    subtitle: 'DOM Clobbering 防止チートシート',
    sourceName: 'DOM_Clobbering_Prevention_Cheat_Sheet',
  },
  'error-handling': {
    title: 'Error Handling Cheat Sheet',
    subtitle: 'エラーハンドリングチートシート',
    sourceName: 'Error_Handling_Cheat_Sheet',
  },
  'file-upload': {
    title: 'File Upload Cheat Sheet',
    subtitle: 'ファイルアップロードチートシート',
    sourceName: 'File_Upload_Cheat_Sheet',
  },
  'forgot-password': {
    title: 'Forgot Password Cheat Sheet',
    subtitle: 'パスワード忘れ対応チートシート',
    sourceName: 'Forgot_Password_Cheat_Sheet',
  },
  graphql: {
    title: 'GraphQL Cheat Sheet',
    subtitle: 'GraphQL チートシート',
    sourceName: 'GraphQL_Cheat_Sheet',
  },
  'html5-security': {
    title: 'HTML5 Security Cheat Sheet',
    subtitle: 'HTML5 セキュリティチートシート',
    sourceName: 'HTML5_Security_Cheat_Sheet',
  },
  'http-strict-transport-security': {
    title: 'HTTP Strict Transport Security Cheat Sheet',
    subtitle: 'HTTP Strict Transport Security チートシート',
    sourceName: 'HTTP_Strict_Transport_Security_Cheat_Sheet',
  },
  'idor-prevention': {
    title: 'Insecure Direct Object Reference Prevention Cheat Sheet',
    subtitle: 'IDOR 防止チートシート',
    sourceName: 'Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet',
  },
  'injection-prevention': {
    title: 'Injection Prevention Cheat Sheet',
    subtitle: 'インジェクション防止チートシート',
    sourceName: 'Injection_Prevention_Cheat_Sheet',
  },
  'injection-prevention-in-java': {
    title: 'Injection Prevention Cheat Sheet in Java',
    subtitle: 'Java におけるインジェクション防止チートシート',
    sourceName: 'Injection_Prevention_in_Java_Cheat_Sheet',
  },
  'input-validation': {
    title: 'Input Validation Cheat Sheet',
    subtitle: '入力検証チートシート',
    sourceName: 'Input_Validation_Cheat_Sheet',
  },
  'java-security': {
    title: 'Java Security Cheat Sheet',
    subtitle: 'Java セキュリティチートシート',
    sourceName: 'Java_Security_Cheat_Sheet',
  },
  'json-web-token-for-java': {
    title: 'JSON Web Token Cheat Sheet for Java',
    subtitle: 'Java 向け JSON Web Token チートシート',
    sourceName: 'JSON_Web_Token_for_Java_Cheat_Sheet',
  },
  'key-management': {
    title: 'Key Management Cheat Sheet',
    subtitle: '鍵管理チートシート',
    sourceName: 'Key_Management_Cheat_Sheet',
  },
  'laravel-security': {
    title: 'Laravel Cheat Sheet',
    subtitle: 'Laravel チートシート',
    sourceName: 'Laravel_Cheat_Sheet',
  },
  'ldap-injection-prevention': {
    title: 'LDAP Injection Prevention Cheat Sheet',
    subtitle: 'LDAP インジェクション防止チートシート',
    sourceName: 'LDAP_Injection_Prevention_Cheat_Sheet',
  },
  logging: {
    title: 'Logging Cheat Sheet',
    subtitle: 'ロギングチートシート',
    sourceName: 'Logging_Cheat_Sheet',
  },
  'logging-vocabulary': {
    title: 'Logging Vocabulary Cheat Sheet',
    subtitle: 'ロギング語彙チートシート',
    sourceName: 'Logging_Vocabulary_Cheat_Sheet',
  },
  'mass-assignment': {
    title: 'Mass Assignment Cheat Sheet',
    subtitle: 'Mass Assignment チートシート',
    sourceName: 'Mass_Assignment_Cheat_Sheet',
  },
  'microservices-security': {
    title: 'Microservices Security Cheat Sheet',
    subtitle: 'マイクロサービスセキュリティチートシート',
    sourceName: 'Microservices_Security_Cheat_Sheet',
  },
  'multi-tenant-security': {
    title: 'Multi-Tenant Application Security Cheat Sheet',
    subtitle: 'マルチテナントアプリケーションセキュリティチートシート',
    sourceName: 'Multi_Tenant_Security_Cheat_Sheet',
  },
  'multifactor-authentication': {
    title: 'Multifactor Authentication Cheat Sheet',
    subtitle: '多要素認証チートシート',
    sourceName: 'Multifactor_Authentication_Cheat_Sheet',
  },
  'npm-security': {
    title: 'NPM Security Cheat Sheet',
    subtitle: 'NPM セキュリティチートシート',
    sourceName: 'NPM_Security_Cheat_Sheet',
  },
  oauth2: {
    title: 'OAuth 2.0 Protocol Cheat Sheet',
    subtitle: 'OAuth 2.0 プロトコルチートシート',
    sourceName: 'OAuth2_Cheat_Sheet',
  },
  'os-command-injection-defense': {
    title: 'OS Command Injection Defense Cheat Sheet',
    subtitle: 'OS コマンドインジェクション防御チートシート',
    sourceName: 'OS_Command_Injection_Defense_Cheat_Sheet',
  },
  'password-storage': {
    title: 'Password Storage Cheat Sheet',
    subtitle: 'パスワード保存チートシート',
    sourceName: 'Password_Storage_Cheat_Sheet',
  },
  'prototype-pollution-prevention': {
    title: 'Prototype Pollution Prevention Cheat Sheet',
    subtitle: 'Prototype Pollution 防止チートシート',
    sourceName: 'Prototype_Pollution_Prevention_Cheat_Sheet',
  },
  'query-parameterization': {
    title: 'Query Parameterization Cheat Sheet',
    subtitle: 'クエリパラメータ化チートシート',
    sourceName: 'Query_Parameterization_Cheat_Sheet',
  },
  'rest-assessment': {
    title: 'REST Assessment Cheat Sheet',
    subtitle: 'REST 評価チートシート',
    sourceName: 'REST_Assessment_Cheat_Sheet',
  },
  'rest-security': {
    title: 'REST Security Cheat Sheet',
    subtitle: 'REST セキュリティチートシート',
    sourceName: 'REST_Security_Cheat_Sheet',
  },
  'saml-security': {
    title: 'SAML Security Cheat Sheet',
    subtitle: 'SAML セキュリティチートシート',
    sourceName: 'SAML_Security_Cheat_Sheet',
  },
  'security-questions': {
    title: 'Choosing and Using Security Questions Cheat Sheet',
    subtitle: '秘密の質問の選択と利用チートシート',
    sourceName: 'Choosing_and_Using_Security_Questions_Cheat_Sheet',
  },
  'security-terminology': {
    title: 'Security Terminology Cheat Sheet',
    subtitle: 'セキュリティ用語チートシート',
    sourceName: 'Security_Terminology_Cheat_Sheet',
  },
  'session-management': {
    title: 'Session Management Cheat Sheet',
    subtitle: 'セッション管理チートシート',
    sourceName: 'Session_Management_Cheat_Sheet',
  },
  'secrets-management': {
    title: 'Secrets Management Cheat Sheet',
    subtitle: 'シークレット管理チートシート',
    sourceName: 'Secrets_Management_Cheat_Sheet',
  },
  'secure-code-review': {
    title: 'Secure Code Review Cheat Sheet',
    subtitle: 'セキュアコードレビューチートシート',
    sourceName: 'Secure_Code_Review_Cheat_Sheet',
  },
  'software-supply-chain-security': {
    title: 'Software Supply Chain Security Cheat Sheet',
    subtitle: 'ソフトウェアサプライチェーンセキュリティチートシート',
    sourceName: 'Software_Supply_Chain_Security_Cheat_Sheet',
  },
  'sql-injection-prevention': {
    title: 'SQL Injection Prevention Cheat Sheet',
    subtitle: 'SQL インジェクション防止チートシート',
    sourceName: 'SQL_Injection_Prevention_Cheat_Sheet',
  },
  'ssrf-prevention': {
    title: 'Server Side Request Forgery Prevention Cheat Sheet',
    subtitle: 'SSRF 防止チートシート',
    sourceName: 'Server_Side_Request_Forgery_Prevention_Cheat_Sheet',
  },
  symfony: {
    title: 'Symfony Cheat Sheet',
    subtitle: 'Symfony チートシート',
    sourceName: 'Symfony_Cheat_Sheet',
  },
  'third-party-javascript-management': {
    title: 'Third Party Javascript Management Cheat Sheet',
    subtitle: 'サードパーティ JavaScript 管理チートシート',
    sourceName: 'Third_Party_Javascript_Management_Cheat_Sheet',
  },
  'threat-modeling': {
    title: 'Threat Modeling Cheat Sheet',
    subtitle: '脅威モデリングチートシート',
    sourceName: 'Threat_Modeling_Cheat_Sheet',
  },
  'transaction-authorization': {
    title: 'Transaction Authorization Cheat Sheet',
    subtitle: 'トランザクション認可チートシート',
    sourceName: 'Transaction_Authorization_Cheat_Sheet',
  },
  'transport-layer-security': {
    title: 'Transport Layer Security Cheat Sheet',
    subtitle: 'Transport Layer Security チートシート',
    sourceName: 'Transport_Layer_Security_Cheat_Sheet',
  },
  'unvalidated-redirects-forwards': {
    title: 'Unvalidated Redirects and Forwards Cheat Sheet',
    subtitle: '未検証リダイレクトとフォワードチートシート',
    sourceName: 'Unvalidated_Redirects_and_Forwards_Cheat_Sheet',
  },
  'user-privacy-protection': {
    title: 'User Privacy Protection Cheat Sheet',
    subtitle: 'ユーザープライバシー保護チートシート',
    sourceName: 'User_Privacy_Protection_Cheat_Sheet',
  },
  'virtual-patching': {
    title: 'Virtual Patching Cheat Sheet',
    subtitle: '仮想パッチチートシート',
    sourceName: 'Virtual_Patching_Cheat_Sheet',
  },
  'vulnerable-dependency-management': {
    title: 'Vulnerable Dependency Management Cheat Sheet',
    subtitle: '脆弱な依存関係管理チートシート',
    sourceName: 'Vulnerable_Dependency_Management_Cheat_Sheet',
  },
  'web-service-security': {
    title: 'Web Service Security Cheat Sheet',
    subtitle: 'Web サービスセキュリティチートシート',
    sourceName: 'Web_Service_Security_Cheat_Sheet',
  },
  'websocket-security': {
    title: 'WebSocket Security Cheat Sheet',
    subtitle: 'WebSocket セキュリティチートシート',
    sourceName: 'WebSocket_Security_Cheat_Sheet',
  },
  'xml-security': {
    title: 'XML Security Cheat Sheet',
    subtitle: 'XML セキュリティチートシート',
    sourceName: 'XML_Security_Cheat_Sheet',
  },
  'xss-filter-evasion': {
    title: 'XSS Filter Evasion Cheat Sheet',
    subtitle: 'XSS フィルター回避チートシート',
    sourceName: 'XSS_Filter_Evasion_Cheat_Sheet',
  },
  'xss-prevention': {
    title: 'Cross Site Scripting Prevention Cheat Sheet',
    subtitle: 'XSS 防止チートシート',
    sourceName: 'Cross_Site_Scripting_Prevention_Cheat_Sheet',
  },
  'xxe-prevention': {
    title: 'XML External Entity Prevention Cheat Sheet',
    subtitle: 'XXE 防止チートシート',
    sourceName: 'XML_External_Entity_Prevention_Cheat_Sheet',
  },
};

const asvsIndexSections = [
  { id: 'V1.1', slugs: ['security-terminology', 'xss-prevention'] },
  { id: 'V1.2', slugs: ['bean-validation', 'xss-prevention', 'dom-based-xss-prevention', 'file-upload', 'injection-prevention', 'input-validation', 'java-security', 'ldap-injection-prevention', 'os-command-injection-defense', 'query-parameterization', 'sql-injection-prevention', 'xml-security', 'xss-filter-evasion', 'xxe-prevention'] },
  { id: 'V1.3', slugs: ['csrf-prevention', 'xss-prevention', 'dom-based-xss-prevention', 'injection-prevention', 'injection-prevention-in-java', 'input-validation', 'ldap-injection-prevention', 'ssrf-prevention', 'xxe-prevention'] },
  { id: 'V1.4', slugs: [] },
  { id: 'V1.5', slugs: ['deserialization', 'ssrf-prevention', 'xml-security', 'xxe-prevention'] },
  { id: 'V2.1', slugs: ['abuse-case'] },
  { id: 'V2.2', slugs: ['input-validation', 'microservices-security', 'web-service-security'] },
  { id: 'V2.3', slugs: ['abuse-case'] },
  { id: 'V2.4', slugs: ['denial-of-service'] },
  { id: 'V3.1', slugs: ['content-security-policy', 'csrf-prevention', 'http-strict-transport-security'] },
  { id: 'V3.2', slugs: ['csrf-prevention', 'dom-clobbering-prevention', 'html5-security', 'third-party-javascript-management'] },
  { id: 'V3.3', slugs: ['csrf-prevention', 'session-management', 'transport-layer-security'] },
  { id: 'V3.4', slugs: ['csrf-prevention', 'html5-security', 'http-strict-transport-security'] },
  { id: 'V3.5', slugs: ['csrf-prevention', 'html5-security'] },
  { id: 'V3.6', slugs: ['third-party-javascript-management'] },
  { id: 'V3.7', slugs: ['csrf-prevention', 'http-strict-transport-security', 'third-party-javascript-management', 'unvalidated-redirects-forwards'] },
  { id: 'V4.1', slugs: ['csrf-prevention', 'rest-assessment', 'rest-security', 'transport-layer-security', 'web-service-security'] },
  { id: 'V4.2', slugs: ['rest-security', 'web-service-security'] },
  { id: 'V4.3', slugs: ['graphql'] },
  { id: 'V4.4', slugs: ['websocket-security', 'transport-layer-security'] },
  { id: 'V5.1', slugs: ['input-validation', 'file-upload'] },
  { id: 'V5.2', slugs: ['input-validation', 'file-upload'] },
  { id: 'V5.3', slugs: ['input-validation', 'ssrf-prevention'] },
  { id: 'V5.4', slugs: ['file-upload'] },
  { id: 'V6.1', slugs: ['security-terminology', 'credential-stuffing-prevention'] },
  { id: 'V6.2', slugs: ['authentication'] },
  { id: 'V6.3', slugs: ['authentication', 'credential-stuffing-prevention', 'forgot-password'] },
  { id: 'V6.4', slugs: ['security-questions', 'forgot-password', 'multifactor-authentication'] },
  { id: 'V6.5', slugs: ['authentication', 'multifactor-authentication', 'password-storage', 'transaction-authorization'] },
  { id: 'V6.6', slugs: ['forgot-password', 'multifactor-authentication'] },
  { id: 'V6.7', slugs: ['authentication', 'multifactor-authentication'] },
  { id: 'V6.8', slugs: ['authentication'] },
  { id: 'V7.1', slugs: ['session-management'] },
  { id: 'V7.2', slugs: ['session-management'] },
  { id: 'V7.3', slugs: ['session-management'] },
  { id: 'V7.4', slugs: ['session-management'] },
  { id: 'V7.5', slugs: ['session-management'] },
  { id: 'V7.6', slugs: ['session-management'] },
  { id: 'V8.1', slugs: ['security-terminology', 'authorization', 'authorization-testing-automation'] },
  { id: 'V8.2', slugs: ['authorization', 'idor-prevention', 'session-management'] },
  { id: 'V8.3', slugs: ['transaction-authorization'] },
  { id: 'V8.4', slugs: ['authorization', 'multi-tenant-security'] },
  { id: 'V9.1', slugs: ['json-web-token-for-java', 'saml-security'] },
  { id: 'V9.2', slugs: ['rest-security'] },
  { id: 'V10.1', slugs: ['oauth2'] },
  { id: 'V10.2', slugs: ['oauth2'] },
  { id: 'V10.3', slugs: ['oauth2', 'transport-layer-security'] },
  { id: 'V10.4', slugs: ['oauth2', 'transport-layer-security', 'unvalidated-redirects-forwards'] },
  { id: 'V10.5', slugs: ['oauth2'] },
  { id: 'V10.6', slugs: ['oauth2'] },
  { id: 'V10.7', slugs: ['browser-extension-vulnerabilities', 'logging'] },
  { id: 'V11.1', slugs: ['security-terminology', 'cryptographic-storage', 'key-management'] },
  { id: 'V11.2', slugs: ['cryptographic-storage'] },
  { id: 'V11.3', slugs: ['cryptographic-storage', 'key-management'] },
  { id: 'V11.4', slugs: ['password-storage'] },
  { id: 'V11.5', slugs: ['cryptographic-storage'] },
  { id: 'V11.6', slugs: ['transport-layer-security'] },
  { id: 'V11.7', slugs: ['key-management', 'microservices-security', 'secrets-management'] },
  { id: 'V12.1', slugs: ['transport-layer-security'] },
  { id: 'V12.2', slugs: ['transport-layer-security'] },
  { id: 'V12.3', slugs: ['transport-layer-security'] },
  { id: 'V13.1', slugs: ['ssrf-prevention'] },
  { id: 'V13.2', slugs: ['docker-security', 'ssrf-prevention'] },
  { id: 'V13.3', slugs: ['cryptographic-storage', 'key-management'] },
  { id: 'V13.4', slugs: ['django-security', 'graphql', 'laravel-security', 'npm-security', 'symfony'] },
  { id: 'V14.1', slugs: ['abuse-case', 'cryptographic-storage', 'user-privacy-protection'] },
  { id: 'V14.2', slugs: ['html5-security', 'user-privacy-protection'] },
  { id: 'V14.3', slugs: ['html5-security'] },
  { id: 'V15.1', slugs: ['security-terminology', 'abuse-case', 'attack-surface-analysis', 'dependency-graph-sbom', 'software-supply-chain-security', 'third-party-javascript-management', 'threat-modeling'] },
  { id: 'V15.2', slugs: ['software-supply-chain-security', 'third-party-javascript-management', 'virtual-patching', 'vulnerable-dependency-management'] },
  { id: 'V15.3', slugs: ['mass-assignment', 'prototype-pollution-prevention', 'unvalidated-redirects-forwards'] },
  { id: 'V15.4', slugs: ['secure-code-review', 'transaction-authorization'] },
  { id: 'V16.1', slugs: ['logging', 'logging-vocabulary'] },
  { id: 'V16.2', slugs: ['logging', 'session-management'] },
  { id: 'V16.3', slugs: ['authorization', 'logging', 'logging-vocabulary'] },
  { id: 'V16.4', slugs: ['logging'] },
  { id: 'V16.5', slugs: ['error-handling'] },
  { id: 'V17.1', slugs: [] },
  { id: 'V17.2', slugs: ['transport-layer-security'] },
  { id: 'V17.3', slugs: [] },
];

const v1FullSlugs = [
  ...new Set(
    asvsIndexSections
      .filter((section) => section.id.startsWith('V1.'))
      .flatMap((section) => section.slugs),
  ),
];

for (const slug of v1FullSlugs) {
  if (pages.some((page) => page.slug === slug)) {
    continue;
  }
  const catalogPage = sheetCatalog[slug];
  if (!catalogPage) {
    throw new Error(`Missing sheet catalog entry for V1 full page ${slug}`);
  }
  pages.push({
    slug,
    ...catalogPage,
    categoryKey: 'encoding-and-sanitization',
    categoryLabel: 'Encoding and Sanitization',
    readTime: '約 15 分',
    jaMode: 'bilingualTranslationPanel',
  });
}

const chapterJapaneseTitles = {
  1: '入力検証とサニタイズ',
  2: '検証とビジネスロジック',
  3: 'Web フロントエンドセキュリティ',
  4: 'API と Web サービス',
  5: 'ファイル処理',
  6: '認証',
  7: 'セッション管理',
  8: '認可',
  9: 'セルフコンテインドトークン',
  10: 'OAuth と OIDC',
  11: '暗号',
  12: '安全な通信',
  13: '設定',
  14: 'データ保護',
  15: 'セキュアコーディングとアーキテクチャ',
  16: 'セキュリティログとエラーハンドリング',
  17: 'WebRTC',
};

const sectionJapaneseTitles = {
  'V1.1': '入力検証アーキテクチャ',
  'V1.2': 'インジェクション対策',
  'V1.3': 'データサニタイズ',
  'V1.4': 'メモリ・文字列・アンマネージドコード',
  'V1.5': '安全なシリアライズ',
  'V2.1': '検証とビジネスロジック文書化',
  'V2.2': '入力検証',
  'V2.3': 'ビジネスロジックセキュリティ',
  'V2.4': '自動化対策',
  'V3.1': 'Web フロントエンド文書化',
  'V3.2': '意図しないコンテンツ解釈',
  'V3.3': 'Cookie 設定',
  'V3.4': 'ブラウザセキュリティヘッダー',
  'V3.5': 'ブラウザオリジン分離',
  'V3.6': '外部リソース完全性',
  'V3.7': 'その他のブラウザセキュリティ考慮事項',
  'V4.1': '一般的な Web サービスセキュリティ',
  'V4.2': 'HTTP メッセージ構造検証',
  'V4.3': 'GraphQL',
  'V4.4': 'WebSocket',
  'V5.1': 'ファイル処理文書化',
  'V5.2': 'ファイルアップロードとコンテンツ',
  'V5.3': 'ファイル保存',
  'V5.4': 'ファイルダウンロード',
  'V6.1': '認証文書化',
  'V6.2': 'パスワードセキュリティ',
  'V6.3': '一般的な認証セキュリティ',
  'V6.4': '認証要素のライフサイクルと復旧',
  'V6.5': '一般的な多要素認証要件',
  'V6.6': 'アウトオブバンド認証機構',
  'V6.7': '暗号学的認証機構',
  'V6.8': 'ID プロバイダによる認証',
  'V7.1': 'セッション管理文書化',
  'V7.2': '基本的なセッション管理セキュリティ',
  'V7.3': 'セッションタイムアウト',
  'V7.4': 'セッション終了',
  'V7.5': 'セッション悪用への防御',
  'V7.6': '連携再認証',
  'V8.1': '認可文書化',
  'V8.2': '一般的な認可設計',
  'V8.3': '操作レベル認可',
  'V8.4': 'その他の認可考慮事項',
  'V9.1': 'トークンの出所と完全性',
  'V9.2': 'トークン内容',
  'V10.1': '一般的な OAuth / OIDC セキュリティ',
  'V10.2': 'OAuth クライアント',
  'V10.3': 'OAuth リソースサーバ',
  'V10.4': 'OAuth 認可サーバ',
  'V10.5': 'OIDC クライアント',
  'V10.6': 'OpenID Provider',
  'V10.7': '同意管理',
  'V11.1': '暗号インベントリと文書化',
  'V11.2': '安全な暗号実装',
  'V11.3': '暗号アルゴリズム',
  'V11.4': 'ハッシュとハッシュベース関数',
  'V11.5': '乱数値',
  'V11.6': '公開鍵暗号',
  'V11.7': '使用中データの暗号化',
  'V12.1': '一般的な TLS セキュリティガイダンス',
  'V12.2': '外部公開サービスとの HTTPS 通信',
  'V12.3': 'サービス間通信セキュリティ',
  'V13.1': '設定文書化',
  'V13.2': 'バックエンド通信設定',
  'V13.3': 'シークレット管理',
  'V13.4': '意図しない情報漏えい',
  'V14.1': 'データ保護文書化',
  'V14.2': '一般的なデータ保護',
  'V14.3': 'クライアント側データ保護',
  'V15.1': 'セキュアコーディングとアーキテクチャ文書化',
  'V15.2': 'セキュリティアーキテクチャと依存関係',
  'V15.3': '防御的コーディング',
  'V15.4': '安全な並行処理',
  'V16.1': 'セキュリティログ文書化',
  'V16.2': '一般的なロギング',
  'V16.3': 'セキュリティイベント',
  'V16.4': 'ログ保護',
  'V16.5': 'エラーハンドリング',
  'V17.1': 'TURN サーバ',
  'V17.2': 'メディア',
  'V17.3': 'シグナリング',
};

function chapterLabel(chapter) {
  return `V${chapter.id}: ${chapterJapaneseTitles[chapter.id] ?? chapter.title}`;
}

function sectionLabel(section) {
  return `${section.id}: ${sectionJapaneseTitles[section.id] ?? section.title}`;
}

function pageDisplayTitle(page) {
  return page.subtitle || page.title.replace(/\bCheat Sheet\b/g, 'チートシート').replace(/\bCheatsheet\b/g, 'チートシート');
}

function pageCategoryLabel(page) {
  const [firstSection] = asvsSectionIds(page.asvs);
  const chapter = firstSection ? chapterForSection(firstSection) : asvsChapters.find((candidate) => asvsChapterIds(page.asvs).includes(candidate.id));
  return chapter ? chapterJapaneseTitles[chapter.id] ?? chapter.title : page.categoryLabel;
}

function mdPath(...parts) {
  return path.join(root, ...parts);
}

function officialPageUrl(page) {
  return `https://cheatsheetseries.owasp.org/cheatsheets/${page.sourceName}.html`;
}

function originalSourceMarkdown(page, official) {
  return `# ${page.title}

## Attribution

- Original: ${page.title}
- Source: ${officialPageUrl(page)}
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: English original source Markdown stored locally for reference.
- Retrieved: 2026-05-20

## English Original

${normalizeNewlines(official).trim()}
`;
}

function chapterForSection(sectionId) {
  const chapterId = Number.parseInt(sectionId.match(/^V(\d{1,2})\./)?.[1] ?? '0', 10);
  return asvsChapters.find((chapter) => chapter.id === chapterId);
}

function buildPageIndex() {
  const generated = new Map(pages.map((page) => [page.slug, { ...page, status: page.jaMode === 'bilingualTranslationPanel' ? 'Full' : 'Sample' }]));
  const merged = new Map();

  for (const section of asvsIndexSections) {
    const chapter = chapterForSection(section.id);
    for (const slug of section.slugs) {
      const catalogPage = sheetCatalog[slug];
      if (!catalogPage) {
        throw new Error(`Missing sheet catalog entry for ${slug}`);
      }
      const current = merged.get(slug);
      const asvs = current?.asvs ? `${current.asvs}, ${section.id}` : section.id;
      const base = generated.get(slug) ?? {};
      merged.set(slug, {
        slug,
        ...catalogPage,
        categoryKey: base.categoryKey ?? `asvs-v${chapter?.id ?? 0}`,
        categoryLabel: base.categoryLabel ?? chapter?.title ?? 'ASVS',
        readTime: base.readTime ?? '準備中',
        ...base,
        asvs,
        status: base.status ?? 'Shell',
      });
    }
  }

  return [...merged.values()].sort((left, right) => left.title.localeCompare(right.title, 'en'));
}

function pageBySlug(slug) {
  const page = buildPageIndex().find((candidate) => candidate.slug === slug);
  if (!page) {
    throw new Error(`Missing page entry for ${slug}`);
  }
  return page;
}

function asvsChapterIds(asvs) {
  const ids = new Set();
  for (const match of asvs.matchAll(/\bV(\d{1,2})(?:\.\d+)?\b/g)) {
    const id = Number.parseInt(match[1], 10);
    if (id >= 1 && id <= 17) {
      ids.add(id);
    }
  }
  return [...ids].sort((left, right) => left - right);
}

function asvsSectionIds(asvs) {
  const ids = new Set();
  for (const match of asvs.matchAll(/\bV(\d{1,2})\.(\d+)\b/g)) {
    const chapter = Number.parseInt(match[1], 10);
    const section = Number.parseInt(match[2], 10);
    if (chapter >= 1 && chapter <= 17) {
      ids.add(`V${chapter}.${section}`);
    }
  }
  return [...ids].sort((left, right) => {
    const [leftChapter, leftSection] = left.slice(1).split('.').map(Number);
    const [rightChapter, rightSection] = right.slice(1).split('.').map(Number);
    return leftChapter - rightChapter || leftSection - rightSection;
  });
}

function pagesForChapter(chapterId) {
  return buildPageIndex().filter((page) => asvsChapterIds(page.asvs).includes(chapterId));
}

function pagesForSection(sectionId) {
  const section = asvsIndexSections.find((candidate) => candidate.id === sectionId);
  return section ? section.slugs.map(pageBySlug) : [];
}

function pagesForWholeChapter(chapterId) {
  return buildPageIndex().filter((page) => {
    const chapters = asvsChapterIds(page.asvs);
    const sections = asvsSectionIds(page.asvs);
    return chapters.includes(chapterId) && !sections.some((sectionId) => sectionId.startsWith(`V${chapterId}.`));
  });
}

async function readIfExists(file) {
  try {
    return await fs.readFile(file, 'utf8');
  } catch {
    return '';
  }
}

function readFromHead(repoPath) {
  try {
    return execFileSync('git', ['show', `HEAD:${repoPath}`], {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
  } catch {
    return '';
  }
}

function normalizeNewlines(text) {
  return text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}

function stripAttributionSections(text) {
  let value = normalizeNewlines(text);
  value = value.replace(/^---\n[\s\S]*?\n---\n+/, '');
  value = value.replace(/^# .+?\n+/, '');
  value = value.replace(/## Attribution[\s\S]*?(?=\n## |\n$)/, '');
  value = value.replace(/## 関連ファイル[\s\S]*?(?=\n## |\n$)/, '');
  return value.trim();
}

function extractSection(text, heading, stopHeadings = []) {
  const normalized = normalizeNewlines(text);
  const start = normalized.indexOf(`\n## ${heading}`);
  if (start === -1 && !normalized.startsWith(`## ${heading}`)) {
    return '';
  }
  const sectionStart = start === -1 ? 0 : start + 1;
  const contentStart = normalized.indexOf('\n', sectionStart) + 1;
  const stops = stopHeadings
    .map((stop) => normalized.indexOf(`\n## ${stop}`, contentStart))
    .filter((index) => index !== -1);
  const end = stops.length > 0 ? Math.min(...stops) : normalized.length;
  return normalized.slice(contentStart, end).trim();
}

function extractPanel(text, panelClass) {
  const normalized = normalizeNewlines(text);
  const start = normalized.search(new RegExp(`<section[^>]*${panelClass}[^>]*>`));
  if (start === -1) {
    return '';
  }
  const contentStart = normalized.indexOf('\n', start) + 1;
  const closing = /\n\s*<\/section>/.exec(normalized.slice(contentStart));
  if (!closing) {
    return '';
  }
  return normalized.slice(contentStart, contentStart + closing.index).trim();
}

function splitReferenceSection(markdown) {
  const normalized = normalizeNewlines(markdown).trim();
  const lines = normalized.split('\n');
  const body = [];
  const references = [];
  let index = 0;

  const heading = (line) => /^(#{2,6})\s+(.+?)\s*$/.exec(line.trim());
  const isReferenceHeading = (title) => /\breferences?\b|^reference\b|参考資料|リファレンス/i.test(title);

  while (index < lines.length) {
    const match = heading(lines[index]);
    if (!match || !isReferenceHeading(match[2])) {
      body.push(lines[index]);
      index += 1;
      continue;
    }

    const level = match[1].length;
    const section = [lines[index]];
    index += 1;
    while (index < lines.length) {
      const nextHeading = heading(lines[index]);
      if (nextHeading && nextHeading[1].length <= level) {
        break;
      }
      section.push(lines[index]);
      index += 1;
    }
    references.push(section.join('\n').trim());
  }

  return {
    body: body.join('\n').replace(/\n{3,}/g, '\n\n').replace(/\n{0,2}---\s*$/, '').trim(),
    references: references.join('\n\n').replace(/\n{3,}/g, '\n\n').trim(),
  };
}

function stripReferenceSections(markdown) {
  return splitReferenceSection(markdown).body;
}

function sanitizeMarkdown(text) {
  const lines = normalizeNewlines(text).split('\n');
  let inFence = false;
  return lines
    .map((line) => {
      const trimmedLine = line.replace(/[ \t]+$/g, '');
      if (line.trim().startsWith('```')) {
        inFence = !inFence;
        return trimmedLine;
      }
      if (inFence) {
        return trimmedLine;
      }
      return trimmedLine
        .replace(/\\/g, '\\\\')
        .replace(/\{/g, '&#123;')
        .replace(/\}/g, '&#125;')
        .replace(/<=/g, '&lt;=')
        .replace(/<details\b([^>]*)>/gi, '&lt;details$1&gt;')
        .replace(/<\/details>/gi, '&lt;/details&gt;')
        .replace(/<summary\b([^>]*)>/gi, '&lt;summary$1&gt;')
        .replace(/<\/summary>/gi, '&lt;/summary&gt;')
        .replace(/<([A-Z][A-Za-z0-9]*)/g, '&lt;$1')
        .replace(/<\/([A-Z][A-Za-z0-9]*)>/g, '&lt;/$1&gt;');
    })
    .join('\n');
}

function encodeUrlParens(text) {
  const angleEncoded = text.replace(/<https?:\/\/[^>]+>/g, (url) =>
    url.replace(/\(/g, '%28').replace(/\)/g, '%29'),
  );
  return angleEncoded.replace(/https?:\/\/[^\s<>)]+(?:\([^\s<>)]*\)[^\s<>)]*)*/g, (url) =>
    url.replace(/\(/g, '%28').replace(/\)/g, '%29'),
  );
}

function officialLinkTarget(target) {
  const trimmed = target.trim();
  const wrapped = trimmed.startsWith('<') && trimmed.endsWith('>');
  const raw = wrapped ? trimmed.slice(1, -1) : trimmed;
  const [pathPart, anchorPart] = raw.split('#', 2);
  const anchor = anchorPart ? `#${anchorPart}` : '';
  let resolved = raw;

  if (pathPart.startsWith('/img/')) {
    return wrapped ? `<${raw}>` : raw;
  }

  if (!/^(https?|mailto):/.test(pathPart) && pathPart.length > 0) {
    const normalized = pathPart.replace(/^\.\//, '').replace(/^\.\.\//, '');
    if (normalized.endsWith('.md')) {
      resolved = `https://cheatsheetseries.owasp.org/cheatsheets/${path.basename(normalized, '.md')}.html${anchor}`;
    } else if (normalized.startsWith('assets/')) {
      resolved = `https://cheatsheetseries.owasp.org/${normalized}${anchor}`;
    } else if (normalized.endsWith('.html')) {
      resolved = `https://cheatsheetseries.owasp.org/cheatsheets/${path.basename(normalized)}${anchor}`;
    } else if (normalized.startsWith('/')) {
      resolved = `https://cheatsheetseries.owasp.org${normalized}${anchor}`;
    }
  }

  const encoded = resolved.replace(/\(/g, '%28').replace(/\)/g, '%29');
  return wrapped ? `<${encoded}>` : encoded;
}

function rewriteOfficialLinks(text) {
  return encodeUrlParens(text).replace(/\]\(([^)]+)\)/g, (match, target) => {
    const trimmed = target.trim();
    if (trimmed.startsWith('#') || /^(https?|mailto):/.test(trimmed)) {
      return `](${officialLinkTarget(trimmed)})`;
    }
    return `](${officialLinkTarget(trimmed)})`;
  });
}

function smoothHeadings(text) {
  const lines = normalizeNewlines(text).split('\n');
  let inFence = false;
  let previousLevel = 1;

  return lines
    .map((line) => {
      if (line.trim().startsWith('```')) {
        inFence = !inFence;
        return line;
      }
      if (inFence) {
        return line;
      }
      const match = /^(#{1,6})\s+(.+)$/.exec(line);
      if (!match) {
        return line;
      }
      let level = match[1].length;
      if (level > previousLevel + 1) {
        level = previousLevel + 1;
      }
      previousLevel = level;
      return `${'#'.repeat(level)} ${match[2]}`;
    })
    .join('\n');
}

function normalizeOfficialMarkdown(text, page) {
  let value = normalizeNewlines(text).trim();
  value = value.replace(/^---\n[\s\S]*?\n---\n+/, '');
  value = value.replace(/^# .+?\n+/, '');
  if (page.slug === 'bean-validation') {
    value = value
      .replace(/\]\([^)]*Bean_Validation_Cheat_Sheet_Typical\.png\)/g, '](/img/owasp-cheatsheets/bean-validation/typical.png)')
      .replace(/\]\([^)]*Bean_Validation_Cheat_Sheet_JSR\.png\)/g, '](/img/owasp-cheatsheets/bean-validation/jsr.png)');
  }
  return smoothHeadings(sanitizeMarkdown(rewriteOfficialLinks(value)));
}

function splitSections(text) {
  const lines = normalizeNewlines(text).trim().split('\n');
  const sections = [];
  let current = [];
  let inFence = false;

  const flush = () => {
    const section = current.join('\n').trim();
    if (section) {
      sections.push(section);
    }
    current = [];
  };

  for (const line of lines) {
    if (line.trim().startsWith('```')) {
      current.push(line);
      inFence = !inFence;
      if (!inFence) {
        flush();
      }
      continue;
    }
    if (inFence) {
      current.push(line);
      continue;
    }
    if (line.match(/^##\s+/)) {
      flush();
      current.push(line);
      continue;
    }
    current.push(line);
  }
  flush();
  return sections;
}

function imageKey(line) {
  const markdown = /!\[[^\]]*]\(([^)]+)\)/.exec(line);
  if (markdown) {
    return `image:${markdown[1].trim()}`;
  }
  const html = /<img[^>]+src=["']([^"']+)["'][^>]*>/i.exec(line);
  if (html) {
    return `image:${html[1].trim()}`;
  }
  return `image:${line.trim()}`;
}

function codeKey(content) {
  const normalized = normalizeNewlines(content)
    .replace(/\u00a0/g, ' ')
    .split('\n')
    .map((line) => line.replace(/[ \t]+$/g, '').replace(/[ \t]+/g, ' ').trim())
    .join('\n')
    .trim();
  return `code:${normalized}`;
}

function extractSharedBlocks(markdown) {
  const lines = normalizeNewlines(markdown).split('\n');
  const body = [];
  const shared = [];
  let inFence = false;
  let fence = [];

  const pushFence = () => {
    const content = fence.join('\n').trim();
    if (content) {
      shared.push({ key: codeKey(content), content });
    }
    fence = [];
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('```')) {
      fence.push(line);
      inFence = !inFence;
      if (!inFence) {
        pushFence();
      }
      continue;
    }
    if (inFence) {
      fence.push(line);
      continue;
    }
    if (/^!\[[^\]]*]\([^)]+\)\s*$/.test(trimmed) || /^<img\b/i.test(trimmed)) {
      shared.push({ key: imageKey(trimmed), content: trimmed });
      continue;
    }
    body.push(line);
  }

  if (fence.length > 0) {
    body.push(...fence);
  }

  return {
    text: body.join('\n').replace(/\n{3,}/g, '\n\n').trim(),
    shared,
  };
}

function splitSharedSegments(markdown) {
  const lines = normalizeNewlines(markdown).split('\n');
  const segments = [];
  let text = [];
  let shared = [];
  let inFence = false;
  let fence = [];

  const flush = () => {
    const body = text.join('\n').replace(/\n{3,}/g, '\n\n').trim();
    if (body || shared.length > 0) {
      segments.push({ text: body, shared });
    }
    text = [];
    shared = [];
  };

  const pushFence = () => {
    const content = fence.join('\n').trim();
    if (content) {
      shared.push({ key: codeKey(content), content });
      flush();
    }
    fence = [];
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('```')) {
      fence.push(line);
      inFence = !inFence;
      if (!inFence) {
        pushFence();
      }
      continue;
    }
    if (inFence) {
      fence.push(line);
      continue;
    }
    if (/^!\[[^\]]*]\([^)]+\)\s*$/.test(trimmed) || /^<img\b/i.test(trimmed)) {
      shared.push({ key: imageKey(trimmed), content: trimmed });
      flush();
      continue;
    }
    text.push(line);
  }

  if (fence.length > 0) {
    text.push(...fence);
  }
  flush();
  return segments;
}

function uniqueSharedBlocks(...groups) {
  const seen = new Set();
  const shared = [];
  for (const group of groups) {
    for (const block of group) {
      if (seen.has(block.key)) {
        continue;
      }
      seen.add(block.key);
      shared.push(block.content);
    }
  }
  return shared;
}

function takeTrailingHeading(text, options = {}) {
  const lines = normalizeNewlines(text).trimEnd().split('\n');
  while (lines.length > 0 && lines[lines.length - 1].trim() === '') {
    lines.pop();
  }
  const lastLine = lines[lines.length - 1] ?? '';
  const headingMatch = /^(#{2,6})\s+(.+?)\s*$/.exec(lastLine);
  if (headingMatch) {
    lines.pop();
    return {
      text: lines.join('\n').replace(/\n{3,}/g, '\n\n').trim(),
      heading: {
        level: headingMatch[1].length,
        title: headingMatch[2],
      },
    };
  }

  const labelMatch = /^\*\*(.+?)\*\*:\s*$/.exec(lastLine) || /^(.+?):\s*$/.exec(lastLine);
  if (!labelMatch || labelMatch[1].length > 80) {
    const plainLine = lastLine.trim();
    const canTreatPlainLineAsHeading =
      options.allowPlainLine &&
      plainLine.length > 0 &&
      plainLine.length <= 120 &&
      !plainLine.startsWith('#') &&
      !plainLine.startsWith('- ') &&
      !plainLine.startsWith('|') &&
      !plainLine.startsWith('```');
    if (canTreatPlainLineAsHeading) {
      lines.pop();
      return {
        text: lines.join('\n').replace(/\n{3,}/g, '\n\n').trim(),
        heading: {
          level: 4,
          title: plainLine,
        },
      };
    }
    return { text: text.trim(), heading: null };
  }
  lines.pop();
  return {
    text: lines.join('\n').replace(/\n{3,}/g, '\n\n').trim(),
    heading: {
      level: 4,
      title: labelMatch[1],
    },
  };
}

function sharedHeading(englishHeading, japaneseHeading) {
  if (!englishHeading && !japaneseHeading) {
    return null;
  }
  return {
    level: englishHeading?.level ?? japaneseHeading.level,
    title: englishHeading?.title ?? japaneseHeading.title,
  };
}

function splitTextCards(text) {
  const blocks = normalizeNewlines(text)
    .trim()
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter((block) => block && !/^(?:-{3,}|\*{3,}|_{3,})$/.test(block));
  const cards = [];
  let pendingHeading = '';

  const splitListBlock = (block) => {
    const lines = block.split('\n');
    if (!lines.some((line) => /^\s{0,3}(?:[-*+]|\d+[.)])\s+/.test(line))) {
      return [block];
    }

    const items = [];
    let current = [];
    for (const line of lines) {
      const startsTopLevelItem = /^\s{0,3}(?:[-*+]|\d+[.)])\s+/.test(line);
      if (startsTopLevelItem && current.length > 0) {
        items.push(current.join('\n').trim());
        current = [];
      }
      current.push(line);
    }
    if (current.length > 0) {
      items.push(current.join('\n').trim());
    }
    return items.length > 1 ? items : [block];
  };

  for (const block of blocks) {
    const isHeadingOnly = /^#{2,6}\s+.+$/.test(block);
    if (isHeadingOnly) {
      pendingHeading = pendingHeading ? `${pendingHeading}\n\n${block}` : block;
      continue;
    }

    for (const [index, card] of splitListBlock(block).entries()) {
      cards.push(index === 0 && pendingHeading ? `${pendingHeading}\n\n${card}` : card);
    }
    pendingHeading = '';
  }

  if (pendingHeading) {
    cards.push(pendingHeading);
  }

  return cards;
}

function bilingualPairs(english, japanese) {
  const englishSections = splitSections(english);
  const japaneseSections = splitSections(japanese);
  const useSectionPairs =
    englishSections.length > 1 &&
    japaneseSections.length > 1 &&
    japaneseSections.length >= Math.ceil(englishSections.length * 0.5);
  const englishBlocks = useSectionPairs ? englishSections : [english.trim()];
  const japaneseBlocks = useSectionPairs ? japaneseSections : [japanese.trim()];
  const count = Math.max(englishBlocks.length, japaneseBlocks.length);
  const chunks = [];

  for (let index = 0; index < count; index++) {
    const enSegments = splitSharedSegments(englishBlocks[index] || '');
    const jaSegments = splitSharedSegments(japaneseBlocks[index] || '');
    const segmentCount = Math.max(enSegments.length, jaSegments.length);

    for (let segmentIndex = 0; segmentIndex < segmentCount; segmentIndex++) {
      const enParts = enSegments[segmentIndex] ?? { text: '', shared: [] };
      const jaParts = jaSegments[segmentIndex] ?? { text: '', shared: [] };
      const shared = uniqueSharedBlocks(enParts.shared, jaParts.shared).join('\n\n');
      const enText = shared ? takeTrailingHeading(enParts.text) : { text: enParts.text, heading: null };
      const jaText = shared
        ? takeTrailingHeading(jaParts.text, { allowPlainLine: Boolean(enText.heading) })
        : { text: jaParts.text, heading: null };
      const en = enText.text;
      const ja = jaText.text;
      const heading = sharedHeading(enText.heading, jaText.heading);
      const enCards = splitTextCards(en);
      const jaCards = splitTextCards(ja);
      const cardCount = Math.max(enCards.length, jaCards.length);

      for (let cardIndex = 0; cardIndex < cardCount; cardIndex++) {
        const englishBlock = enCards[cardIndex]
          ? `<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

${enCards[cardIndex]}

</div>`
          : '';
        const japaneseBlock = jaCards[cardIndex]
          ? `<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

${jaCards[cardIndex]}

</div>`
          : '';
        if (englishBlock || japaneseBlock) {
          chunks.push(`<div className="bilingualPair">
${englishBlock}
${japaneseBlock}
</div>`);
        }
      }

      const sharedBlock = shared
        ? `<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>
${heading ? `${'#'.repeat(heading.level)} ${heading.title}\n` : ''}

${shared}

</div>`
        : '';
      if (sharedBlock) {
        chunks.push(sharedBlock);
      }
    }
  }

  return smoothHeadings(chunks.join('\n\n'));
}

async function fetchOfficialMarkdown(page) {
  const url = `https://raw.githubusercontent.com/OWASP/CheatSheetSeries/master/cheatsheets/${page.sourceName}.md`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }
  return response.text();
}

async function localJapanese(page) {
  const translation = await readIfExists(mdPath('docs', 'translations', `${page.slug}.md`));
  const translationBody = smoothHeadings(extractSection(translation, '日本語訳', ['ASVS との対応']) || stripAttributionSections(translation));

  if (page.jaMode === 'bilingualTranslationPanel') {
    const current = await readIfExists(mdPath('docs', 'bilingual', `${page.slug}.md`));
    const panel = extractPanel(current, 'translationPanel');
    const committed = readFromHead(`docs/bilingual/${page.slug}.md`);
    const committedPanel = extractPanel(committed, 'translationPanel');
    const existingPanel = [panel, committedPanel]
      .filter(Boolean)
      .sort((left, right) => right.length - left.length)[0];
    if (translationBody && (!existingPanel || translationBody.length >= existingPanel.length || existingPanel.length < 3000)) {
      return translationBody;
    }
    if (existingPanel) {
      return smoothHeadings(existingPanel);
    }
  }

  return translationBody;
}

async function localSummary(page) {
  const summary = await readIfExists(mdPath('docs', 'summaries', `${page.slug}.md`));
  const body = extractSection(summary, '要点', ['実装時の注意点', 'ASVS との対応'])
    || stripAttributionSections(summary)
    .replace(/^## 概要\n?/, '')
    .replace(/## 実装時の注意点[\s\S]*?(?=\n## |\n$)/g, '')
    .replace(/## ASVS との対応[\s\S]*?(?=\n## |\n$)/g, '')
    .trim();
  return smoothHeadings(body || '<p>要点は今後拡充します。</p>');
}

async function localChecklist(page) {
  const checklist = await readIfExists(mdPath('docs', 'checklists', `${page.slug}.md`));
  const body = extractSection(checklist, '開発チェックリスト', ['ASVS との対応']) || stripAttributionSections(checklist);
  return smoothHeadings(body || '<p>チェックリストは今後拡充します。</p>');
}

function pageMarkdown(page, english, japanese, summary, checklist) {
  const sourceUrl = officialPageUrl(page);
  const englishParts = splitReferenceSection(english);
  const englishBody = englishParts.body;
  const japaneseBody = stripReferenceSections(japanese);
  const referenceBody = englishParts.references
    .replace(/^#{2,6}\s+.*(?:\breferences?\b|^reference\b|参考資料|リファレンス).*$/gim, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  const references = englishParts.references
    ? `## References

<div className="referenceFooter">

${referenceBody}

</div>
`
    : '';
  return `---
title: ${page.title}
hide_title: true
---

<div className="docHero" data-category="${page.categoryKey}">
  <h1>${pageDisplayTitle(page)}</h1>
  <div className="docMeta">
    <span className="docPill">最終更新: 2026-05-20</span>
    <span className="docPill">読了時間: ${page.readTime}</span>
    <span className="docPill">カテゴリ: ${pageCategoryLabel(page)}</span>
  </div>
</div>

<div className="tabbedContent">
  <input className="tabInput" type="radio" name="${page.slug}-view" id="${page.slug}-original" />
  <input className="tabInput" type="radio" name="${page.slug}-view" id="${page.slug}-translation" defaultChecked />
  <input className="tabInput" type="radio" name="${page.slug}-view" id="${page.slug}-summary" />
  <input className="tabInput" type="radio" name="${page.slug}-view" id="${page.slug}-checklist" />
  <input className="tabInput" type="radio" name="${page.slug}-view" id="${page.slug}-bilingual" />

  <div className="contentTabs">
    <label htmlFor="${page.slug}-original">原本</label>
    <label htmlFor="${page.slug}-translation">翻訳</label>
    <label htmlFor="${page.slug}-summary">要点</label>
    <label htmlFor="${page.slug}-checklist">チェックリスト</label>
    <label htmlFor="${page.slug}-bilingual">対比表示</label>
  </div>

<section id="${page.slug}-original-panel" className="tabPanel originalPanel contentPanel">

${englishBody}

</section>

<section id="${page.slug}-translation-panel" className="tabPanel translationPanel contentPanel">

${japaneseBody}

</section>

<section id="${page.slug}-summary-panel" className="tabPanel summaryPanel contentPanel">

${summary}

</section>

<section id="${page.slug}-checklist-panel" className="tabPanel checklistPanel contentPanel">

${checklist}

</section>

<section id="${page.slug}-bilingual-panel" className="tabPanel bilingualPanel">

${bilingualPairs(englishBody, japaneseBody)}

</section>
</div>

${references}

## Attribution

<div className="attributionFooter">

- Original: ${page.title}
- Source: ${sourceUrl}
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: English original retained for comparison. Japanese translation added. Bilingual display generated from official source and local Japanese notes.
- Retrieved: 2026-05-20

</div>
`.replace(/[ \t]+$/gm, '');
}

function scaffoldMarkdown(page) {
  const sourceUrl = officialPageUrl(page);
  return `---
title: ${page.title}
hide_title: true
---

<div className="docHero" data-category="${page.categoryKey}">
  <h1>${pageDisplayTitle(page)}</h1>
  <div className="docMeta">
    <span className="docPill">最終更新: 2026-05-20</span>
    <span className="docPill">読了時間: 準備中</span>
    <span className="docPill">カテゴリ: ${pageCategoryLabel(page)}</span>
  </div>
</div>

<div className="contentPanel">

このページは、OWASP ASVS Index と同じサイドメニュー構成を先に完成させるための準備中ページです。

- 公式ページ: [${page.title}](${sourceUrl})
- ASVS 対応: ${page.asvs}
- 状態: 本文、要点、チェックリスト、対比表示は今後追加します。

</div>

## Attribution

<div className="attributionFooter">

- Original: ${page.title}
- Source: ${sourceUrl}
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Placeholder navigation page added. No translated OWASP body content copied yet.
- Retrieved: 2026-05-20

</div>
`.replace(/[ \t]+$/gm, '');
}

async function writeSidebars() {
  const groups = asvsChapters
    .map((chapter) => {
      const sectionItems = chapter.sections.map((section) => {
        const sectionPages = pagesForSection(section.id);
        return `        {
          type: 'category',
          label: '${sectionLabel(section)}',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'asvs/${section.id.toLowerCase().replace('.', '-')}',
          },
          items: [
${sectionPages.map((page) => `            '${page.slug}',`).join('\n')}
          ],
        },`;
      });
      return `    {
      type: 'category',
      label: '${chapterLabel(chapter)}',
      collapsed: ${chapter.id === 1 ? 'false' : 'true'},
      link: {
        type: 'doc',
        id: 'asvs/v${chapter.id}',
      },
      items: [
${sectionItems.join('\n')}
      ],
    }`;
    })
    .join(',\n');

  const content = `const sidebars = {
  cheatsheetSidebar: [
    'index',
${groups},
  ],
};

module.exports = sidebars;
`;
  await fs.writeFile(mdPath('sidebars.js'), content, 'utf8');
}

async function writeAsvsChapterPages() {
  await fs.mkdir(mdPath('docs', 'bilingual', 'asvs'), { recursive: true });

  for (const chapter of asvsChapters) {
    const chapterPages = pagesForChapter(chapter.id);
    const pageLinks = chapterPages.length > 0
      ? chapterPages.map((page) => `- [${page.title}](../${page.slug}.md) - ${page.status}`).join('\n')
      : '- 現在、この章に対応する公開済み対訳ページはありません。';
    const sectionLinks = chapter.sections
      .map((section) => {
        const sectionPages = pagesForSection(section.id);
        const count = sectionPages.length;
        return `- [${sectionLabel(section)}](${section.id.toLowerCase().replace('.', '-')}.md) (${count}件)`;
      })
      .join('\n');
    const content = `# ${chapterLabel(chapter)}

OWASP ASVS Index の V${chapter.id} に対応する英日対訳ページの一覧です。

## ASVS 小項目

${sectionLinks}

## 掲載中の対訳ページ

${pageLinks}

## 補足

Shell のページはサイドメニュー完成用の準備中ページです。本文、要点、チェックリスト、対比表示は順次追加します。
`;
    await fs.writeFile(mdPath('docs', 'bilingual', 'asvs', `v${chapter.id}.md`), content, 'utf8');

    for (const section of chapter.sections) {
      const sectionPages = pagesForSection(section.id);
      const sectionPageLinks = sectionPages.length > 0
        ? sectionPages.map((page) => `- [${page.title}](../${page.slug}.md) - ${page.status}`).join('\n')
        : '- OWASP ASVS Index では、この小項目に対応する Cheat Sheet は None とされています。';
      const sectionContent = `# ${sectionLabel(section)}

OWASP ASVS Index の ${section.id} に対応する英日対訳ページの一覧です。

## 掲載中の対訳ページ

${sectionPageLinks}

## 補足

Shell のページはサイドメニュー完成用の準備中ページです。本文、要点、チェックリスト、対比表示は順次追加します。
`;
      await fs.writeFile(
        mdPath('docs', 'bilingual', 'asvs', `${section.id.toLowerCase().replace('.', '-')}.md`),
        sectionContent,
        'utf8',
      );
    }
  }
}

async function writeBilingualIndex() {
  const cards = buildPageIndex()
    .map((page) => `- [${page.title}](${page.slug}.md) - ${page.categoryLabel} - ${page.status}`)
    .join('\n');
  const content = `# ASVS Index 対応 Cheat Sheet 英日対訳

OWASP Cheat Sheet Series の ASVS Index 対応ページを、日本語訳、要点、チェックリスト、英日対比表示で確認するための Docusaurus 公開用ドキュメントです。

## 表示方針

- \`翻訳\`、\`要点\`、\`チェックリスト\`、\`対比表示\` を同じ Cheat Sheet ページ内で確認できるようにする。
- \`対比表示\` は、公式原文と日本語訳を同じ順序のブロックとして上下に並べる。
- このサイトは OWASP 公式翻訳ではありません。各ページ下部の Attribution を確認してください。

## 掲載ページ

${cards}
`;
  await fs.writeFile(mdPath('docs', 'bilingual', 'index.md'), content, 'utf8');
}

async function existingRepoLink(label, repoPath) {
  const absolute = mdPath(...repoPath.split('/'));
  try {
    await fs.access(absolute);
    return `[${label}](../${repoPath})`;
  } catch {
    return '未作成';
  }
}

async function writeBilingualMap() {
  const rows = await Promise.all(buildPageIndex()
    .map(async (page) => {
      const sourceUrl = officialPageUrl(page);
      const bilingual = await existingRepoLink(`docs/bilingual/${page.slug}.md`, `docs/bilingual/${page.slug}.md`);
      const original = await existingRepoLink(`docs/originals/${page.slug}.md`, `docs/originals/${page.slug}.md`);
      const translation = await existingRepoLink(`docs/translations/${page.slug}.md`, `docs/translations/${page.slug}.md`);
      const summary = await existingRepoLink(`docs/summaries/${page.slug}.md`, `docs/summaries/${page.slug}.md`);
      const checklist = await existingRepoLink(`docs/checklists/${page.slug}.md`, `docs/checklists/${page.slug}.md`);
      return `| ${page.asvs} | ${page.title} | ${sourceUrl} | ${bilingual} | ${original} | ${translation} | ${summary} | ${checklist} | ${page.status} |`;
    }));
  const content = `# Bilingual Map

パラグラフ単位で英語原文と日本語訳を上下に並べる対訳ドキュメントの対応表です。

## 方針

- 対訳ファイルは \`docs/bilingual/<slug>.md\` に置く。
- 英語原文のローカル参照ファイルは \`docs/originals/<slug>.md\` に置く。
- 既存の \`docs/translations/\`、\`docs/summaries/\`、\`docs/checklists/\` は残し、対訳表示は別系統で管理する。
- Full/Sample に進めるページでは、公式ページの見出し、段落、箇条書き、表、コードブロック、画像を可能な限り同じ順序で再現する。
- 公式ページ内の画像は、必要に応じてローカル保存し、対訳ページから \`static/img/owasp-cheatsheets/<slug>/\` 配下のファイルを参照する。
- 各対訳ファイルには Attribution を置き、英語原文を比較用に保持していることを \`Changes\` に明記する。
- Docusaurus のサイドバーは OWASP ASVS Index と同じ V1〜V17 章ベースで構成し、複数章対応ページは該当するすべての章に掲載する。

## 対応表

| ASVS 項目 | 公式 Cheat Sheet | 公式 URL | 対訳 | 英語原文 | 翻訳 | 要約 | チェックリスト | 状態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
${rows.join('\n')}
`;
  await fs.writeFile(mdPath('references', 'bilingual-map.md'), content, 'utf8');
}

async function writeOriginalSource(page, official) {
  await fs.mkdir(mdPath('docs', 'originals'), { recursive: true });
  await fs.writeFile(mdPath('docs', 'originals', `${page.slug}.md`), originalSourceMarkdown(page, official), 'utf8');
}

async function main() {
  const indexedPages = buildPageIndex();
  const indexedBySlug = new Map(indexedPages.map((page) => [page.slug, page]));
  const generatedSlugs = new Set(pages.map((page) => page.slug));
  const originalsOnly = process.argv.includes('--originals-only');

  for (const configuredPage of pages) {
    const page = indexedBySlug.get(configuredPage.slug) ?? configuredPage;
    const official = await fetchOfficialMarkdown(page);
    await writeOriginalSource(page, official);
    if (originalsOnly) {
      console.log(`generated original ${page.slug}`);
      continue;
    }
    const english = normalizeOfficialMarkdown(official, page);
    const japanese = await localJapanese(page);
    const summary = await localSummary(page);
    const checklist = await localChecklist(page);
    const content = pageMarkdown(page, english, japanese, summary, checklist);
    await fs.writeFile(mdPath('docs', 'bilingual', `${page.slug}.md`), content, 'utf8');
    console.log(`generated ${page.slug}`);
  }

  if (originalsOnly) {
    await writeBilingualMap();
    return;
  }

  for (const page of indexedPages.filter((candidate) => !generatedSlugs.has(candidate.slug))) {
    await fs.writeFile(mdPath('docs', 'bilingual', `${page.slug}.md`), scaffoldMarkdown(page), 'utf8');
    console.log(`generated shell ${page.slug}`);
  }

  await writeSidebars();
  await writeAsvsChapterPages();
  await writeBilingualIndex();
  await writeBilingualMap();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
