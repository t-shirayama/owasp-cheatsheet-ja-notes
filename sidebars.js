const sidebars = {
  cheatsheetSidebar: [
    'index',
    {
      type: 'category',
      label: 'V1: Encoding and Sanitization',
      collapsed: false,
      link: {
        type: 'doc',
        id: 'asvs/v1',
      },
      items: [
        {
          type: 'category',
          label: 'V1.1: Encoding and Sanitization Architecture',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'asvs/v1-1',
          },
          items: [
            'security-terminology',
            'xss-prevention',
          ],
        },
        {
          type: 'category',
          label: 'V1.2: Injection Prevention',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'asvs/v1-2',
          },
          items: [
            'bean-validation',
            'xss-prevention',
            'dom-based-xss-prevention',
            'file-upload',
            'injection-prevention',
            'input-validation',
            'java-security',
            'ldap-injection-prevention',
            'os-command-injection-defense',
            'query-parameterization',
            'sql-injection-prevention',
            'xml-security',
            'xss-filter-evasion',
            'xxe-prevention',
          ],
        },
        {
          type: 'category',
          label: 'V1.3: Sanitization',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'asvs/v1-3',
          },
          items: [
            'csrf-prevention',
            'xss-prevention',
            'dom-based-xss-prevention',
            'injection-prevention',
            'injection-prevention-in-java',
            'input-validation',
            'ldap-injection-prevention',
            'ssrf-prevention',
            'xxe-prevention',
          ],
        },
        {
          type: 'category',
          label: 'V1.4: Memory, String, and Unmanaged Code',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'asvs/v1-4',
          },
          items: [

          ],
        },
        {
          type: 'category',
          label: 'V1.5: Safe Deserialization',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'asvs/v1-5',
          },
          items: [
            'deserialization',
            'ssrf-prevention',
            'xml-security',
            'xxe-prevention',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'V2: Validation and Business Logic',
      collapsed: true,
      link: {
        type: 'doc',
        id: 'asvs/v2',
      },
      items: [
        {
          type: 'category',
          label: 'V2.1: Validation and Business Logic Documentation',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'asvs/v2-1',
          },
          items: [
            'abuse-case',
          ],
        },
        {
          type: 'category',
          label: 'V2.2: Input Validation',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'asvs/v2-2',
          },
          items: [
            'input-validation',
            'microservices-security',
            'web-service-security',
          ],
        },
        {
          type: 'category',
          label: 'V2.3: Business Logic Security',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'asvs/v2-3',
          },
          items: [
            'abuse-case',
          ],
        },
        {
          type: 'category',
          label: 'V2.4: Anti-automation',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'asvs/v2-4',
          },
          items: [
            'denial-of-service',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'V3: Web Frontend Security',
      collapsed: true,
      link: {
        type: 'doc',
        id: 'asvs/v3',
      },
      items: [
        {
          type: 'category',
          label: 'V3.1: Web Frontend Security Documentation',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'asvs/v3-1',
          },
          items: [
            'content-security-policy',
            'csrf-prevention',
            'http-strict-transport-security',
          ],
        },
        {
          type: 'category',
          label: 'V3.2: Unintended Content Interpretation',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'asvs/v3-2',
          },
          items: [
            'csrf-prevention',
            'dom-clobbering-prevention',
            'html5-security',
            'third-party-javascript-management',
          ],
        },
        {
          type: 'category',
          label: 'V3.3: Cookie Setup',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'asvs/v3-3',
          },
          items: [
            'csrf-prevention',
            'session-management',
            'transport-layer-security',
          ],
        },
        {
          type: 'category',
          label: 'V3.4: Browser Security Mechanism Headers',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'asvs/v3-4',
          },
          items: [
            'csrf-prevention',
            'html5-security',
            'http-strict-transport-security',
          ],
        },
        {
          type: 'category',
          label: 'V3.5: Browser Origin Separation',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'asvs/v3-5',
          },
          items: [
            'csrf-prevention',
            'html5-security',
          ],
        },
        {
          type: 'category',
          label: 'V3.6: External Resource Integrity',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'asvs/v3-6',
          },
          items: [
            'third-party-javascript-management',
          ],
        },
        {
          type: 'category',
          label: 'V3.7: Other Browser Security Considerations',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'asvs/v3-7',
          },
          items: [
            'csrf-prevention',
            'http-strict-transport-security',
            'third-party-javascript-management',
            'unvalidated-redirects-forwards',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'V4: API and Web Service',
      collapsed: true,
      link: {
        type: 'doc',
        id: 'asvs/v4',
      },
      items: [
        {
          type: 'category',
          label: 'V4.1: Generic Web Service Security',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'asvs/v4-1',
          },
          items: [
            'csrf-prevention',
            'rest-assessment',
            'rest-security',
            'transport-layer-security',
            'web-service-security',
          ],
        },
        {
          type: 'category',
          label: 'V4.2: HTTP Message Structure Validation',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'asvs/v4-2',
          },
          items: [
            'rest-security',
            'web-service-security',
          ],
        },
        {
          type: 'category',
          label: 'V4.3: GraphQL',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'asvs/v4-3',
          },
          items: [
            'graphql',
          ],
        },
        {
          type: 'category',
          label: 'V4.4: WebSocket',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'asvs/v4-4',
          },
          items: [
            'websocket-security',
            'transport-layer-security',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'V5: File Handling',
      collapsed: true,
      link: {
        type: 'doc',
        id: 'asvs/v5',
      },
      items: [
        {
          type: 'category',
          label: 'V5.1: File Handling Documentation',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'asvs/v5-1',
          },
          items: [
            'input-validation',
            'file-upload',
          ],
        },
        {
          type: 'category',
          label: 'V5.2: File Upload and Content',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'asvs/v5-2',
          },
          items: [
            'input-validation',
            'file-upload',
          ],
        },
        {
          type: 'category',
          label: 'V5.3: File Storage',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'asvs/v5-3',
          },
          items: [
            'input-validation',
            'ssrf-prevention',
          ],
        },
        {
          type: 'category',
          label: 'V5.4: File Download',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'asvs/v5-4',
          },
          items: [
            'file-upload',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'V6: Authentication',
      collapsed: true,
      link: {
        type: 'doc',
        id: 'asvs/v6',
      },
      items: [
        {
          type: 'category',
          label: 'V6.1: Authentication Documentation',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'asvs/v6-1',
          },
          items: [
            'security-terminology',
            'credential-stuffing-prevention',
          ],
        },
        {
          type: 'category',
          label: 'V6.2: Password Security',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'asvs/v6-2',
          },
          items: [
            'authentication',
          ],
        },
        {
          type: 'category',
          label: 'V6.3: General Authentication Security',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'asvs/v6-3',
          },
          items: [
            'authentication',
            'credential-stuffing-prevention',
            'forgot-password',
          ],
        },
        {
          type: 'category',
          label: 'V6.4: Authentication Factor Lifecycle and Recovery',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'asvs/v6-4',
          },
          items: [
            'security-questions',
            'forgot-password',
            'multifactor-authentication',
          ],
        },
        {
          type: 'category',
          label: 'V6.5: General Multi-factor authentication requirements',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'asvs/v6-5',
          },
          items: [
            'authentication',
            'multifactor-authentication',
            'password-storage',
            'transaction-authorization',
          ],
        },
        {
          type: 'category',
          label: 'V6.6: Out-of-Band authentication mechanisms',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'asvs/v6-6',
          },
          items: [
            'forgot-password',
            'multifactor-authentication',
          ],
        },
        {
          type: 'category',
          label: 'V6.7: Cryptographic authentication mechanism',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'asvs/v6-7',
          },
          items: [
            'authentication',
            'multifactor-authentication',
          ],
        },
        {
          type: 'category',
          label: 'V6.8: Authentication with an Identity Provider',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'asvs/v6-8',
          },
          items: [
            'authentication',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'V7: Session Management',
      collapsed: true,
      link: {
        type: 'doc',
        id: 'asvs/v7',
      },
      items: [
        {
          type: 'category',
          label: 'V7.1: Session Management Documentation',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'asvs/v7-1',
          },
          items: [
            'session-management',
          ],
        },
        {
          type: 'category',
          label: 'V7.2: Fundamental Session Management Security',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'asvs/v7-2',
          },
          items: [
            'session-management',
          ],
        },
        {
          type: 'category',
          label: 'V7.3: Session Timeout',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'asvs/v7-3',
          },
          items: [
            'session-management',
          ],
        },
        {
          type: 'category',
          label: 'V7.4: Session Termination',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'asvs/v7-4',
          },
          items: [
            'session-management',
          ],
        },
        {
          type: 'category',
          label: 'V7.5: Defenses Against Session Abuse',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'asvs/v7-5',
          },
          items: [
            'session-management',
          ],
        },
        {
          type: 'category',
          label: 'V7.6: Federated Re-authentication',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'asvs/v7-6',
          },
          items: [
            'session-management',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'V8: Authorization',
      collapsed: true,
      link: {
        type: 'doc',
        id: 'asvs/v8',
      },
      items: [
        {
          type: 'category',
          label: 'V8.1: Authorization Documentation',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'asvs/v8-1',
          },
          items: [
            'security-terminology',
            'authorization',
            'authorization-testing-automation',
          ],
        },
        {
          type: 'category',
          label: 'V8.2: General Authorization Design',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'asvs/v8-2',
          },
          items: [
            'authorization',
            'idor-prevention',
            'session-management',
          ],
        },
        {
          type: 'category',
          label: 'V8.3: Operation Level Authorization',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'asvs/v8-3',
          },
          items: [
            'transaction-authorization',
          ],
        },
        {
          type: 'category',
          label: 'V8.4: Other Authorization Considerations',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'asvs/v8-4',
          },
          items: [
            'authorization',
            'multi-tenant-security',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'V9: Self-contained Tokens',
      collapsed: true,
      link: {
        type: 'doc',
        id: 'asvs/v9',
      },
      items: [
        {
          type: 'category',
          label: 'V9.1: Token source and integrity',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'asvs/v9-1',
          },
          items: [
            'json-web-token-for-java',
            'saml-security',
          ],
        },
        {
          type: 'category',
          label: 'V9.2: Token content',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'asvs/v9-2',
          },
          items: [
            'rest-security',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'V10: OAuth and OIDC',
      collapsed: true,
      link: {
        type: 'doc',
        id: 'asvs/v10',
      },
      items: [
        {
          type: 'category',
          label: 'V10.1: Generic OAuth and OIDC Security',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'asvs/v10-1',
          },
          items: [
            'oauth2',
          ],
        },
        {
          type: 'category',
          label: 'V10.2: OAuth Client',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'asvs/v10-2',
          },
          items: [
            'oauth2',
          ],
        },
        {
          type: 'category',
          label: 'V10.3: OAuth Resource Server',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'asvs/v10-3',
          },
          items: [
            'oauth2',
            'transport-layer-security',
          ],
        },
        {
          type: 'category',
          label: 'V10.4: OAuth Authorization Server',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'asvs/v10-4',
          },
          items: [
            'oauth2',
            'transport-layer-security',
            'unvalidated-redirects-forwards',
          ],
        },
        {
          type: 'category',
          label: 'V10.5: OIDC Client',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'asvs/v10-5',
          },
          items: [
            'oauth2',
          ],
        },
        {
          type: 'category',
          label: 'V10.6: OpenID Provider',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'asvs/v10-6',
          },
          items: [
            'oauth2',
          ],
        },
        {
          type: 'category',
          label: 'V10.7: Consent Management',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'asvs/v10-7',
          },
          items: [
            'browser-extension-vulnerabilities',
            'logging',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'V11: Cryptography',
      collapsed: true,
      link: {
        type: 'doc',
        id: 'asvs/v11',
      },
      items: [
        {
          type: 'category',
          label: 'V11.1: Cryptographic Inventory and Documentation',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'asvs/v11-1',
          },
          items: [
            'security-terminology',
            'cryptographic-storage',
            'key-management',
          ],
        },
        {
          type: 'category',
          label: 'V11.2: Secure Cryptography Implementation',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'asvs/v11-2',
          },
          items: [
            'cryptographic-storage',
          ],
        },
        {
          type: 'category',
          label: 'V11.3: Encryption Algorithms',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'asvs/v11-3',
          },
          items: [
            'cryptographic-storage',
            'key-management',
          ],
        },
        {
          type: 'category',
          label: 'V11.4: Hashing and Hash-based Functions',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'asvs/v11-4',
          },
          items: [
            'password-storage',
          ],
        },
        {
          type: 'category',
          label: 'V11.5: Random Values',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'asvs/v11-5',
          },
          items: [
            'cryptographic-storage',
          ],
        },
        {
          type: 'category',
          label: 'V11.6: Public Key Cryptography',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'asvs/v11-6',
          },
          items: [
            'transport-layer-security',
          ],
        },
        {
          type: 'category',
          label: 'V11.7: In-Use Data Cryptography',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'asvs/v11-7',
          },
          items: [
            'key-management',
            'microservices-security',
            'secrets-management',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'V12: Secure Communication',
      collapsed: true,
      link: {
        type: 'doc',
        id: 'asvs/v12',
      },
      items: [
        {
          type: 'category',
          label: 'V12.1: General TLS Security Guidance',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'asvs/v12-1',
          },
          items: [
            'transport-layer-security',
          ],
        },
        {
          type: 'category',
          label: 'V12.2: HTTPS Communication with External Facing Services',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'asvs/v12-2',
          },
          items: [
            'transport-layer-security',
          ],
        },
        {
          type: 'category',
          label: 'V12.3: General Service to Service Communication Security',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'asvs/v12-3',
          },
          items: [
            'transport-layer-security',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'V13: Configuration',
      collapsed: true,
      link: {
        type: 'doc',
        id: 'asvs/v13',
      },
      items: [
        {
          type: 'category',
          label: 'V13.1: Configuration Documentation',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'asvs/v13-1',
          },
          items: [
            'ssrf-prevention',
          ],
        },
        {
          type: 'category',
          label: 'V13.2: Backend Communication Configuration',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'asvs/v13-2',
          },
          items: [
            'docker-security',
            'ssrf-prevention',
          ],
        },
        {
          type: 'category',
          label: 'V13.3: Secret Management',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'asvs/v13-3',
          },
          items: [
            'cryptographic-storage',
            'key-management',
          ],
        },
        {
          type: 'category',
          label: 'V13.4: Unintended Information Leakage',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'asvs/v13-4',
          },
          items: [
            'django-security',
            'graphql',
            'laravel-security',
            'npm-security',
            'symfony',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'V14: Data Protection',
      collapsed: true,
      link: {
        type: 'doc',
        id: 'asvs/v14',
      },
      items: [
        {
          type: 'category',
          label: 'V14.1: Data Protection Documentation',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'asvs/v14-1',
          },
          items: [
            'abuse-case',
            'cryptographic-storage',
            'user-privacy-protection',
          ],
        },
        {
          type: 'category',
          label: 'V14.2: General Data Protection',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'asvs/v14-2',
          },
          items: [
            'html5-security',
            'user-privacy-protection',
          ],
        },
        {
          type: 'category',
          label: 'V14.3: Client-side Data Protection',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'asvs/v14-3',
          },
          items: [
            'html5-security',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'V15: Secure Coding and Architecture',
      collapsed: true,
      link: {
        type: 'doc',
        id: 'asvs/v15',
      },
      items: [
        {
          type: 'category',
          label: 'V15.1: Secure Coding and Architecture Documentation',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'asvs/v15-1',
          },
          items: [
            'security-terminology',
            'abuse-case',
            'attack-surface-analysis',
            'dependency-graph-sbom',
            'software-supply-chain-security',
            'third-party-javascript-management',
            'threat-modeling',
          ],
        },
        {
          type: 'category',
          label: 'V15.2: Security Architecture and Dependencies',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'asvs/v15-2',
          },
          items: [
            'software-supply-chain-security',
            'third-party-javascript-management',
            'virtual-patching',
            'vulnerable-dependency-management',
          ],
        },
        {
          type: 'category',
          label: 'V15.3: Defensive Coding',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'asvs/v15-3',
          },
          items: [
            'mass-assignment',
            'prototype-pollution-prevention',
            'unvalidated-redirects-forwards',
          ],
        },
        {
          type: 'category',
          label: 'V15.4: Safe Concurrency',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'asvs/v15-4',
          },
          items: [
            'secure-code-review',
            'transaction-authorization',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'V16: Security Logging and Error Handling',
      collapsed: true,
      link: {
        type: 'doc',
        id: 'asvs/v16',
      },
      items: [
        {
          type: 'category',
          label: 'V16.1: Security Logging Documentation',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'asvs/v16-1',
          },
          items: [
            'logging',
            'logging-vocabulary',
          ],
        },
        {
          type: 'category',
          label: 'V16.2: General Logging',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'asvs/v16-2',
          },
          items: [
            'logging',
            'session-management',
          ],
        },
        {
          type: 'category',
          label: 'V16.3: Security Events',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'asvs/v16-3',
          },
          items: [
            'authorization',
            'logging',
            'logging-vocabulary',
          ],
        },
        {
          type: 'category',
          label: 'V16.4: Log Protection',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'asvs/v16-4',
          },
          items: [
            'logging',
          ],
        },
        {
          type: 'category',
          label: 'V16.5: Error Handling',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'asvs/v16-5',
          },
          items: [
            'error-handling',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'V17: WebRTC',
      collapsed: true,
      link: {
        type: 'doc',
        id: 'asvs/v17',
      },
      items: [
        {
          type: 'category',
          label: 'V17.1: TURN Server',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'asvs/v17-1',
          },
          items: [

          ],
        },
        {
          type: 'category',
          label: 'V17.2: Media',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'asvs/v17-2',
          },
          items: [
            'transport-layer-security',
          ],
        },
        {
          type: 'category',
          label: 'V17.3: Signaling',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'asvs/v17-3',
          },
          items: [

          ],
        },
      ],
    },
  ],
};

module.exports = sidebars;
