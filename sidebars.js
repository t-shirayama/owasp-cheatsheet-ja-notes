const sidebars = {
  cheatsheetSidebar: [
    'index',
    {
      type: 'category',
      label: 'V1: Encoding and Sanitization',
      collapsed: false,
      items: [
        'asvs/v1',
        {
          type: 'category',
          label: 'V1.1: Encoding and Sanitization Architecture',
          collapsed: true,
          items: [
            'asvs/v1-1',
          ],
        },
        {
          type: 'category',
          label: 'V1.2: Injection Prevention',
          collapsed: true,
          items: [
            'bean-validation',
          ],
        },
        {
          type: 'category',
          label: 'V1.3: Sanitization',
          collapsed: true,
          items: [
            'csrf-prevention',
          ],
        },
        {
          type: 'category',
          label: 'V1.4: Memory, String, and Unmanaged Code',
          collapsed: true,
          items: [
            'asvs/v1-4',
          ],
        },
        {
          type: 'category',
          label: 'V1.5: Safe Deserialization',
          collapsed: true,
          items: [
            'asvs/v1-5',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'V2: Validation and Business Logic',
      collapsed: true,
      items: [
        'asvs/v2',
        {
          type: 'category',
          label: 'V2.1: Validation and Business Logic Documentation',
          collapsed: true,
          items: [
            'asvs/v2-1',
          ],
        },
        {
          type: 'category',
          label: 'V2.2: Input Validation',
          collapsed: true,
          items: [
            'asvs/v2-2',
          ],
        },
        {
          type: 'category',
          label: 'V2.3: Business Logic Security',
          collapsed: true,
          items: [
            'asvs/v2-3',
          ],
        },
        {
          type: 'category',
          label: 'V2.4: Anti-automation',
          collapsed: true,
          items: [
            'asvs/v2-4',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'V3: Web Frontend Security',
      collapsed: true,
      items: [
        'asvs/v3',

        {
          type: 'category',
          label: 'V3 全般',
          collapsed: true,
          items: [
            'csrf-prevention',
          ],
        },
        {
          type: 'category',
          label: 'V3.1: Web Frontend Security Documentation',
          collapsed: true,
          items: [
            'asvs/v3-1',
          ],
        },
        {
          type: 'category',
          label: 'V3.2: Unintended Content Interpretation',
          collapsed: true,
          items: [
            'asvs/v3-2',
          ],
        },
        {
          type: 'category',
          label: 'V3.3: Cookie Setup',
          collapsed: true,
          items: [
            'asvs/v3-3',
          ],
        },
        {
          type: 'category',
          label: 'V3.4: Browser Security Mechanism Headers',
          collapsed: true,
          items: [
            'asvs/v3-4',
          ],
        },
        {
          type: 'category',
          label: 'V3.5: Browser Origin Separation',
          collapsed: true,
          items: [
            'asvs/v3-5',
          ],
        },
        {
          type: 'category',
          label: 'V3.6: External Resource Integrity',
          collapsed: true,
          items: [
            'asvs/v3-6',
          ],
        },
        {
          type: 'category',
          label: 'V3.7: Other Browser Security Considerations',
          collapsed: true,
          items: [
            'asvs/v3-7',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'V4: API and Web Service',
      collapsed: true,
      items: [
        'asvs/v4',

        {
          type: 'category',
          label: 'V4 全般',
          collapsed: true,
          items: [
            'csrf-prevention',
          ],
        },
        {
          type: 'category',
          label: 'V4.1: Generic Web Service Security',
          collapsed: true,
          items: [
            'rest-security',
          ],
        },
        {
          type: 'category',
          label: 'V4.2: HTTP Message Structure Validation',
          collapsed: true,
          items: [
            'rest-security',
          ],
        },
        {
          type: 'category',
          label: 'V4.3: GraphQL',
          collapsed: true,
          items: [
            'rest-security',
          ],
        },
        {
          type: 'category',
          label: 'V4.4: WebSocket',
          collapsed: true,
          items: [
            'rest-security',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'V5: File Handling',
      collapsed: true,
      items: [
        'asvs/v5',
        {
          type: 'category',
          label: 'V5.1: File Handling Documentation',
          collapsed: true,
          items: [
            'asvs/v5-1',
          ],
        },
        {
          type: 'category',
          label: 'V5.2: File Upload and Content',
          collapsed: true,
          items: [
            'asvs/v5-2',
          ],
        },
        {
          type: 'category',
          label: 'V5.3: File Storage',
          collapsed: true,
          items: [
            'asvs/v5-3',
          ],
        },
        {
          type: 'category',
          label: 'V5.4: File Download',
          collapsed: true,
          items: [
            'asvs/v5-4',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'V6: Authentication',
      collapsed: true,
      items: [
        'asvs/v6',
        {
          type: 'category',
          label: 'V6.1: Authentication Documentation',
          collapsed: true,
          items: [
            'credential-stuffing-prevention',
          ],
        },
        {
          type: 'category',
          label: 'V6.2: Password Security',
          collapsed: true,
          items: [
            'authentication',
            'credential-stuffing-prevention',
            'multifactor-authentication',
          ],
        },
        {
          type: 'category',
          label: 'V6.3: General Authentication Security',
          collapsed: true,
          items: [
            'authentication',
            'credential-stuffing-prevention',
            'forgot-password',
            'multifactor-authentication',
          ],
        },
        {
          type: 'category',
          label: 'V6.4: Authentication Factor Lifecycle and Recovery',
          collapsed: true,
          items: [
            'forgot-password',
            'multifactor-authentication',
          ],
        },
        {
          type: 'category',
          label: 'V6.5: General Multi-factor authentication requirements',
          collapsed: true,
          items: [
            'authentication',
            'multifactor-authentication',
            'password-storage',
          ],
        },
        {
          type: 'category',
          label: 'V6.6: Out-of-Band authentication mechanisms',
          collapsed: true,
          items: [
            'credential-stuffing-prevention',
            'forgot-password',
          ],
        },
        {
          type: 'category',
          label: 'V6.7: Cryptographic authentication mechanism',
          collapsed: true,
          items: [
            'authentication',
          ],
        },
        {
          type: 'category',
          label: 'V6.8: Authentication with an Identity Provider',
          collapsed: true,
          items: [
            'authentication',
            'multifactor-authentication',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'V7: Session Management',
      collapsed: true,
      items: [
        'asvs/v7',

        {
          type: 'category',
          label: 'V7 全般',
          collapsed: true,
          items: [
            'session-management',
          ],
        },
        {
          type: 'category',
          label: 'V7.1: Session Management Documentation',
          collapsed: true,
          items: [
            'asvs/v7-1',
          ],
        },
        {
          type: 'category',
          label: 'V7.2: Fundamental Session Management Security',
          collapsed: true,
          items: [
            'asvs/v7-2',
          ],
        },
        {
          type: 'category',
          label: 'V7.3: Session Timeout',
          collapsed: true,
          items: [
            'asvs/v7-3',
          ],
        },
        {
          type: 'category',
          label: 'V7.4: Session Termination',
          collapsed: true,
          items: [
            'asvs/v7-4',
          ],
        },
        {
          type: 'category',
          label: 'V7.5: Defenses Against Session Abuse',
          collapsed: true,
          items: [
            'asvs/v7-5',
          ],
        },
        {
          type: 'category',
          label: 'V7.6: Federated Re-authentication',
          collapsed: true,
          items: [
            'asvs/v7-6',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'V8: Authorization',
      collapsed: true,
      items: [
        'asvs/v8',
        {
          type: 'category',
          label: 'V8.1: Authorization Documentation',
          collapsed: true,
          items: [
            'authorization',
          ],
        },
        {
          type: 'category',
          label: 'V8.2: General Authorization Design',
          collapsed: true,
          items: [
            'authorization',
          ],
        },
        {
          type: 'category',
          label: 'V8.3: Operation Level Authorization',
          collapsed: true,
          items: [
            'asvs/v8-3',
          ],
        },
        {
          type: 'category',
          label: 'V8.4: Other Authorization Considerations',
          collapsed: true,
          items: [
            'authorization',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'V9: Self-contained Tokens',
      collapsed: true,
      items: [
        'asvs/v9',
        {
          type: 'category',
          label: 'V9.1: Token source and integrity',
          collapsed: true,
          items: [
            'asvs/v9-1',
          ],
        },
        {
          type: 'category',
          label: 'V9.2: Token content',
          collapsed: true,
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
      items: [
        'asvs/v10',
        {
          type: 'category',
          label: 'V10.1: Generic OAuth and OIDC Security',
          collapsed: true,
          items: [
            'oauth2',
          ],
        },
        {
          type: 'category',
          label: 'V10.2: OAuth Client',
          collapsed: true,
          items: [
            'oauth2',
          ],
        },
        {
          type: 'category',
          label: 'V10.3: OAuth Resource Server',
          collapsed: true,
          items: [
            'oauth2',
          ],
        },
        {
          type: 'category',
          label: 'V10.4: OAuth Authorization Server',
          collapsed: true,
          items: [
            'oauth2',
          ],
        },
        {
          type: 'category',
          label: 'V10.5: OIDC Client',
          collapsed: true,
          items: [
            'oauth2',
          ],
        },
        {
          type: 'category',
          label: 'V10.6: OpenID Provider',
          collapsed: true,
          items: [
            'oauth2',
          ],
        },
        {
          type: 'category',
          label: 'V10.7: Consent Management',
          collapsed: true,
          items: [
            'logging',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'V11: Cryptography',
      collapsed: true,
      items: [
        'asvs/v11',
        {
          type: 'category',
          label: 'V11.1: Cryptographic Inventory and Documentation',
          collapsed: true,
          items: [
            'cryptographic-storage',
          ],
        },
        {
          type: 'category',
          label: 'V11.2: Secure Cryptography Implementation',
          collapsed: true,
          items: [
            'cryptographic-storage',
          ],
        },
        {
          type: 'category',
          label: 'V11.3: Encryption Algorithms',
          collapsed: true,
          items: [
            'cryptographic-storage',
          ],
        },
        {
          type: 'category',
          label: 'V11.4: Hashing and Hash-based Functions',
          collapsed: true,
          items: [
            'password-storage',
          ],
        },
        {
          type: 'category',
          label: 'V11.5: Random Values',
          collapsed: true,
          items: [
            'cryptographic-storage',
          ],
        },
        {
          type: 'category',
          label: 'V11.6: Public Key Cryptography',
          collapsed: true,
          items: [
            'asvs/v11-6',
          ],
        },
        {
          type: 'category',
          label: 'V11.7: In-Use Data Cryptography',
          collapsed: true,
          items: [
            'asvs/v11-7',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'V12: Secure Communication',
      collapsed: true,
      items: [
        'asvs/v12',
        {
          type: 'category',
          label: 'V12.1: General TLS Security Guidance',
          collapsed: true,
          items: [
            'asvs/v12-1',
          ],
        },
        {
          type: 'category',
          label: 'V12.2: HTTPS Communication with External Facing Services',
          collapsed: true,
          items: [
            'asvs/v12-2',
          ],
        },
        {
          type: 'category',
          label: 'V12.3: General Service to Service Communication Security',
          collapsed: true,
          items: [
            'asvs/v12-3',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'V13: Configuration',
      collapsed: true,
      items: [
        'asvs/v13',
        {
          type: 'category',
          label: 'V13.1: Configuration Documentation',
          collapsed: true,
          items: [
            'asvs/v13-1',
          ],
        },
        {
          type: 'category',
          label: 'V13.2: Backend Communication Configuration',
          collapsed: true,
          items: [
            'asvs/v13-2',
          ],
        },
        {
          type: 'category',
          label: 'V13.3: Secret Management',
          collapsed: true,
          items: [
            'cryptographic-storage',
          ],
        },
        {
          type: 'category',
          label: 'V13.4: Unintended Information Leakage',
          collapsed: true,
          items: [
            'asvs/v13-4',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'V14: Data Protection',
      collapsed: true,
      items: [
        'asvs/v14',
        {
          type: 'category',
          label: 'V14.1: Data Protection Documentation',
          collapsed: true,
          items: [
            'cryptographic-storage',
          ],
        },
        {
          type: 'category',
          label: 'V14.2: General Data Protection',
          collapsed: true,
          items: [
            'asvs/v14-2',
          ],
        },
        {
          type: 'category',
          label: 'V14.3: Client-side Data Protection',
          collapsed: true,
          items: [
            'asvs/v14-3',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'V15: Secure Coding and Architecture',
      collapsed: true,
      items: [
        'asvs/v15',
        {
          type: 'category',
          label: 'V15.1: Secure Coding and Architecture Documentation',
          collapsed: true,
          items: [
            'asvs/v15-1',
          ],
        },
        {
          type: 'category',
          label: 'V15.2: Security Architecture and Dependencies',
          collapsed: true,
          items: [
            'asvs/v15-2',
          ],
        },
        {
          type: 'category',
          label: 'V15.3: Defensive Coding',
          collapsed: true,
          items: [
            'asvs/v15-3',
          ],
        },
        {
          type: 'category',
          label: 'V15.4: Safe Concurrency',
          collapsed: true,
          items: [
            'asvs/v15-4',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'V16: Security Logging and Error Handling',
      collapsed: true,
      items: [
        'asvs/v16',
        {
          type: 'category',
          label: 'V16.1: Security Logging Documentation',
          collapsed: true,
          items: [
            'logging',
          ],
        },
        {
          type: 'category',
          label: 'V16.2: General Logging',
          collapsed: true,
          items: [
            'logging',
            'session-management',
          ],
        },
        {
          type: 'category',
          label: 'V16.3: Security Events',
          collapsed: true,
          items: [
            'authorization',
            'logging',
          ],
        },
        {
          type: 'category',
          label: 'V16.4: Log Protection',
          collapsed: true,
          items: [
            'logging',
          ],
        },
        {
          type: 'category',
          label: 'V16.5: Error Handling',
          collapsed: true,
          items: [
            'asvs/v16-5',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'V17: WebRTC',
      collapsed: true,
      items: [
        'asvs/v17',
        {
          type: 'category',
          label: 'V17.1: TURN Server',
          collapsed: true,
          items: [
            'asvs/v17-1',
          ],
        },
        {
          type: 'category',
          label: 'V17.2: Media',
          collapsed: true,
          items: [
            'asvs/v17-2',
          ],
        },
        {
          type: 'category',
          label: 'V17.3: Signaling',
          collapsed: true,
          items: [
            'asvs/v17-3',
          ],
        },
      ],
    },
  ],
};

module.exports = sidebars;
