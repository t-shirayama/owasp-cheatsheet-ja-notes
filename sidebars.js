const sidebars = {
  cheatsheetSidebar: [
    'index',
    {
      type: 'category',
      label: 'V1: 入力検証とサニタイズ',
      collapsed: false,
      link: {
        type: 'doc',
        id: 'asvs/v1',
      },
      items: [
        {
          type: 'category',
          label: 'V1.1: 入力検証アーキテクチャ',
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
          label: 'V1.2: インジェクション対策',
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
          label: 'V1.3: データサニタイズ',
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
          label: 'V1.4: メモリ・文字列・アンマネージドコード',
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
          label: 'V1.5: 安全なシリアライズ',
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
      label: 'V2: 検証とビジネスロジック',
      collapsed: true,
      link: {
        type: 'doc',
        id: 'asvs/v2',
      },
      items: [
        {
          type: 'category',
          label: 'V2.1: 検証とビジネスロジック文書化',
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
          label: 'V2.2: 入力検証',
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
          label: 'V2.3: ビジネスロジックセキュリティ',
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
          label: 'V2.4: 自動化対策',
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
      label: 'V3: Web フロントエンドセキュリティ',
      collapsed: true,
      link: {
        type: 'doc',
        id: 'asvs/v3',
      },
      items: [
        {
          type: 'category',
          label: 'V3.1: Web フロントエンド文書化',
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
          label: 'V3.2: 意図しないコンテンツ解釈',
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
          label: 'V3.3: Cookie 設定',
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
          label: 'V3.4: ブラウザセキュリティヘッダー',
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
          label: 'V3.5: ブラウザオリジン分離',
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
          label: 'V3.6: 外部リソース完全性',
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
          label: 'V3.7: その他のブラウザセキュリティ考慮事項',
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
      label: 'V4: API と Web サービス',
      collapsed: true,
      link: {
        type: 'doc',
        id: 'asvs/v4',
      },
      items: [
        {
          type: 'category',
          label: 'V4.1: 一般的な Web サービスセキュリティ',
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
          label: 'V4.2: HTTP メッセージ構造検証',
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
      label: 'V5: ファイル処理',
      collapsed: true,
      link: {
        type: 'doc',
        id: 'asvs/v5',
      },
      items: [
        {
          type: 'category',
          label: 'V5.1: ファイル処理文書化',
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
          label: 'V5.2: ファイルアップロードとコンテンツ',
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
          label: 'V5.3: ファイル保存',
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
          label: 'V5.4: ファイルダウンロード',
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
      label: 'V6: 認証',
      collapsed: true,
      link: {
        type: 'doc',
        id: 'asvs/v6',
      },
      items: [
        {
          type: 'category',
          label: 'V6.1: 認証文書化',
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
          label: 'V6.2: パスワードセキュリティ',
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
          label: 'V6.3: 一般的な認証セキュリティ',
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
          label: 'V6.4: 認証要素のライフサイクルと復旧',
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
          label: 'V6.5: 一般的な多要素認証要件',
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
          label: 'V6.6: アウトオブバンド認証機構',
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
          label: 'V6.7: 暗号学的認証機構',
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
          label: 'V6.8: ID プロバイダによる認証',
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
      label: 'V7: セッション管理',
      collapsed: true,
      link: {
        type: 'doc',
        id: 'asvs/v7',
      },
      items: [
        {
          type: 'category',
          label: 'V7.1: セッション管理文書化',
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
          label: 'V7.2: 基本的なセッション管理セキュリティ',
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
          label: 'V7.3: セッションタイムアウト',
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
          label: 'V7.4: セッション終了',
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
          label: 'V7.5: セッション悪用への防御',
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
          label: 'V7.6: 連携再認証',
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
      label: 'V8: 認可',
      collapsed: true,
      link: {
        type: 'doc',
        id: 'asvs/v8',
      },
      items: [
        {
          type: 'category',
          label: 'V8.1: 認可文書化',
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
          label: 'V8.2: 一般的な認可設計',
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
          label: 'V8.3: 操作レベル認可',
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
          label: 'V8.4: その他の認可考慮事項',
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
      label: 'V9: セルフコンテインドトークン',
      collapsed: true,
      link: {
        type: 'doc',
        id: 'asvs/v9',
      },
      items: [
        {
          type: 'category',
          label: 'V9.1: トークンの出所と完全性',
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
          label: 'V9.2: トークン内容',
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
      label: 'V10: OAuth と OIDC',
      collapsed: true,
      link: {
        type: 'doc',
        id: 'asvs/v10',
      },
      items: [
        {
          type: 'category',
          label: 'V10.1: 一般的な OAuth / OIDC セキュリティ',
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
          label: 'V10.2: OAuth クライアント',
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
          label: 'V10.3: OAuth リソースサーバ',
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
          label: 'V10.4: OAuth 認可サーバ',
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
          label: 'V10.5: OIDC クライアント',
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
          label: 'V10.7: 同意管理',
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
      label: 'V11: 暗号',
      collapsed: true,
      link: {
        type: 'doc',
        id: 'asvs/v11',
      },
      items: [
        {
          type: 'category',
          label: 'V11.1: 暗号インベントリと文書化',
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
          label: 'V11.2: 安全な暗号実装',
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
          label: 'V11.3: 暗号アルゴリズム',
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
          label: 'V11.4: ハッシュとハッシュベース関数',
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
          label: 'V11.5: 乱数値',
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
          label: 'V11.6: 公開鍵暗号',
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
          label: 'V11.7: 使用中データの暗号化',
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
      label: 'V12: 安全な通信',
      collapsed: true,
      link: {
        type: 'doc',
        id: 'asvs/v12',
      },
      items: [
        {
          type: 'category',
          label: 'V12.1: 一般的な TLS セキュリティガイダンス',
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
          label: 'V12.2: 外部公開サービスとの HTTPS 通信',
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
          label: 'V12.3: サービス間通信セキュリティ',
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
      label: 'V13: 設定',
      collapsed: true,
      link: {
        type: 'doc',
        id: 'asvs/v13',
      },
      items: [
        {
          type: 'category',
          label: 'V13.1: 設定文書化',
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
          label: 'V13.2: バックエンド通信設定',
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
          label: 'V13.3: シークレット管理',
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
          label: 'V13.4: 意図しない情報漏えい',
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
      label: 'V14: データ保護',
      collapsed: true,
      link: {
        type: 'doc',
        id: 'asvs/v14',
      },
      items: [
        {
          type: 'category',
          label: 'V14.1: データ保護文書化',
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
          label: 'V14.2: 一般的なデータ保護',
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
          label: 'V14.3: クライアント側データ保護',
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
      label: 'V15: セキュアコーディングとアーキテクチャ',
      collapsed: true,
      link: {
        type: 'doc',
        id: 'asvs/v15',
      },
      items: [
        {
          type: 'category',
          label: 'V15.1: セキュアコーディングとアーキテクチャ文書化',
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
          label: 'V15.2: セキュリティアーキテクチャと依存関係',
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
          label: 'V15.3: 防御的コーディング',
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
          label: 'V15.4: 安全な並行処理',
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
      label: 'V16: セキュリティログとエラーハンドリング',
      collapsed: true,
      link: {
        type: 'doc',
        id: 'asvs/v16',
      },
      items: [
        {
          type: 'category',
          label: 'V16.1: セキュリティログ文書化',
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
          label: 'V16.2: 一般的なロギング',
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
          label: 'V16.3: セキュリティイベント',
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
          label: 'V16.4: ログ保護',
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
          label: 'V16.5: エラーハンドリング',
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
          label: 'V17.1: TURN サーバ',
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
          label: 'V17.2: メディア',
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
          label: 'V17.3: シグナリング',
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
