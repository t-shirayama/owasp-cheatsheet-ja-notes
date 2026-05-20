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
            { type: 'doc', id: 'security-terminology' },
            { type: 'doc', id: 'xss-prevention' },
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
            { type: 'doc', id: 'bean-validation' },
            { type: 'doc', id: 'xss-prevention', customProps: { sidebarDuplicate: true } },
            { type: 'doc', id: 'dom-based-xss-prevention' },
            { type: 'doc', id: 'file-upload' },
            { type: 'doc', id: 'injection-prevention' },
            { type: 'doc', id: 'input-validation' },
            { type: 'doc', id: 'java-security' },
            { type: 'doc', id: 'ldap-injection-prevention' },
            { type: 'doc', id: 'os-command-injection-defense' },
            { type: 'doc', id: 'query-parameterization' },
            { type: 'doc', id: 'sql-injection-prevention' },
            { type: 'doc', id: 'xml-security' },
            { type: 'doc', id: 'xss-filter-evasion' },
            { type: 'doc', id: 'xxe-prevention' },
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
            { type: 'doc', id: 'csrf-prevention' },
            { type: 'doc', id: 'xss-prevention', customProps: { sidebarDuplicate: true } },
            { type: 'doc', id: 'dom-based-xss-prevention', customProps: { sidebarDuplicate: true } },
            { type: 'doc', id: 'injection-prevention', customProps: { sidebarDuplicate: true } },
            { type: 'doc', id: 'injection-prevention-in-java' },
            { type: 'doc', id: 'input-validation', customProps: { sidebarDuplicate: true } },
            { type: 'doc', id: 'ldap-injection-prevention', customProps: { sidebarDuplicate: true } },
            { type: 'doc', id: 'ssrf-prevention' },
            { type: 'doc', id: 'xxe-prevention', customProps: { sidebarDuplicate: true } },
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
            { type: 'doc', id: 'deserialization' },
            { type: 'doc', id: 'ssrf-prevention', customProps: { sidebarDuplicate: true } },
            { type: 'doc', id: 'xml-security', customProps: { sidebarDuplicate: true } },
            { type: 'doc', id: 'xxe-prevention', customProps: { sidebarDuplicate: true } },
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
            { type: 'doc', id: 'abuse-case' },
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
            { type: 'doc', id: 'input-validation', customProps: { sidebarDuplicate: true } },
            { type: 'doc', id: 'microservices-security' },
            { type: 'doc', id: 'web-service-security' },
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
            { type: 'doc', id: 'abuse-case', customProps: { sidebarDuplicate: true } },
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
            { type: 'doc', id: 'denial-of-service' },
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
            { type: 'doc', id: 'content-security-policy' },
            { type: 'doc', id: 'csrf-prevention', customProps: { sidebarDuplicate: true } },
            { type: 'doc', id: 'http-strict-transport-security' },
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
            { type: 'doc', id: 'csrf-prevention', customProps: { sidebarDuplicate: true } },
            { type: 'doc', id: 'dom-clobbering-prevention' },
            { type: 'doc', id: 'html5-security' },
            { type: 'doc', id: 'third-party-javascript-management' },
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
            { type: 'doc', id: 'csrf-prevention', customProps: { sidebarDuplicate: true } },
            { type: 'doc', id: 'session-management' },
            { type: 'doc', id: 'transport-layer-security' },
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
            { type: 'doc', id: 'csrf-prevention', customProps: { sidebarDuplicate: true } },
            { type: 'doc', id: 'html5-security', customProps: { sidebarDuplicate: true } },
            { type: 'doc', id: 'http-strict-transport-security', customProps: { sidebarDuplicate: true } },
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
            { type: 'doc', id: 'csrf-prevention', customProps: { sidebarDuplicate: true } },
            { type: 'doc', id: 'html5-security', customProps: { sidebarDuplicate: true } },
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
            { type: 'doc', id: 'third-party-javascript-management', customProps: { sidebarDuplicate: true } },
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
            { type: 'doc', id: 'csrf-prevention', customProps: { sidebarDuplicate: true } },
            { type: 'doc', id: 'http-strict-transport-security', customProps: { sidebarDuplicate: true } },
            { type: 'doc', id: 'third-party-javascript-management', customProps: { sidebarDuplicate: true } },
            { type: 'doc', id: 'unvalidated-redirects-forwards' },
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
            { type: 'doc', id: 'csrf-prevention', customProps: { sidebarDuplicate: true } },
            { type: 'doc', id: 'rest-assessment' },
            { type: 'doc', id: 'rest-security' },
            { type: 'doc', id: 'transport-layer-security', customProps: { sidebarDuplicate: true } },
            { type: 'doc', id: 'web-service-security', customProps: { sidebarDuplicate: true } },
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
            { type: 'doc', id: 'rest-security', customProps: { sidebarDuplicate: true } },
            { type: 'doc', id: 'web-service-security', customProps: { sidebarDuplicate: true } },
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
            { type: 'doc', id: 'graphql' },
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
            { type: 'doc', id: 'websocket-security' },
            { type: 'doc', id: 'transport-layer-security', customProps: { sidebarDuplicate: true } },
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
            { type: 'doc', id: 'input-validation', customProps: { sidebarDuplicate: true } },
            { type: 'doc', id: 'file-upload', customProps: { sidebarDuplicate: true } },
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
            { type: 'doc', id: 'input-validation', customProps: { sidebarDuplicate: true } },
            { type: 'doc', id: 'file-upload', customProps: { sidebarDuplicate: true } },
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
            { type: 'doc', id: 'input-validation', customProps: { sidebarDuplicate: true } },
            { type: 'doc', id: 'ssrf-prevention', customProps: { sidebarDuplicate: true } },
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
            { type: 'doc', id: 'file-upload', customProps: { sidebarDuplicate: true } },
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
            { type: 'doc', id: 'security-terminology', customProps: { sidebarDuplicate: true } },
            { type: 'doc', id: 'credential-stuffing-prevention' },
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
            { type: 'doc', id: 'authentication' },
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
            { type: 'doc', id: 'authentication', customProps: { sidebarDuplicate: true } },
            { type: 'doc', id: 'credential-stuffing-prevention', customProps: { sidebarDuplicate: true } },
            { type: 'doc', id: 'forgot-password' },
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
            { type: 'doc', id: 'security-questions' },
            { type: 'doc', id: 'forgot-password', customProps: { sidebarDuplicate: true } },
            { type: 'doc', id: 'multifactor-authentication' },
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
            { type: 'doc', id: 'authentication', customProps: { sidebarDuplicate: true } },
            { type: 'doc', id: 'multifactor-authentication', customProps: { sidebarDuplicate: true } },
            { type: 'doc', id: 'password-storage' },
            { type: 'doc', id: 'transaction-authorization' },
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
            { type: 'doc', id: 'forgot-password', customProps: { sidebarDuplicate: true } },
            { type: 'doc', id: 'multifactor-authentication', customProps: { sidebarDuplicate: true } },
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
            { type: 'doc', id: 'authentication', customProps: { sidebarDuplicate: true } },
            { type: 'doc', id: 'multifactor-authentication', customProps: { sidebarDuplicate: true } },
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
            { type: 'doc', id: 'authentication', customProps: { sidebarDuplicate: true } },
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
            { type: 'doc', id: 'session-management', customProps: { sidebarDuplicate: true } },
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
            { type: 'doc', id: 'session-management', customProps: { sidebarDuplicate: true } },
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
            { type: 'doc', id: 'session-management', customProps: { sidebarDuplicate: true } },
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
            { type: 'doc', id: 'session-management', customProps: { sidebarDuplicate: true } },
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
            { type: 'doc', id: 'session-management', customProps: { sidebarDuplicate: true } },
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
            { type: 'doc', id: 'session-management', customProps: { sidebarDuplicate: true } },
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
            { type: 'doc', id: 'security-terminology', customProps: { sidebarDuplicate: true } },
            { type: 'doc', id: 'authorization' },
            { type: 'doc', id: 'authorization-testing-automation' },
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
            { type: 'doc', id: 'authorization', customProps: { sidebarDuplicate: true } },
            { type: 'doc', id: 'idor-prevention' },
            { type: 'doc', id: 'session-management', customProps: { sidebarDuplicate: true } },
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
            { type: 'doc', id: 'transaction-authorization', customProps: { sidebarDuplicate: true } },
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
            { type: 'doc', id: 'authorization', customProps: { sidebarDuplicate: true } },
            { type: 'doc', id: 'multi-tenant-security' },
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
            { type: 'doc', id: 'json-web-token-for-java' },
            { type: 'doc', id: 'saml-security' },
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
            { type: 'doc', id: 'rest-security', customProps: { sidebarDuplicate: true } },
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
            { type: 'doc', id: 'oauth2' },
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
            { type: 'doc', id: 'oauth2', customProps: { sidebarDuplicate: true } },
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
            { type: 'doc', id: 'oauth2', customProps: { sidebarDuplicate: true } },
            { type: 'doc', id: 'transport-layer-security', customProps: { sidebarDuplicate: true } },
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
            { type: 'doc', id: 'oauth2', customProps: { sidebarDuplicate: true } },
            { type: 'doc', id: 'transport-layer-security', customProps: { sidebarDuplicate: true } },
            { type: 'doc', id: 'unvalidated-redirects-forwards', customProps: { sidebarDuplicate: true } },
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
            { type: 'doc', id: 'oauth2', customProps: { sidebarDuplicate: true } },
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
            { type: 'doc', id: 'oauth2', customProps: { sidebarDuplicate: true } },
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
            { type: 'doc', id: 'browser-extension-vulnerabilities' },
            { type: 'doc', id: 'logging' },
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
            { type: 'doc', id: 'security-terminology', customProps: { sidebarDuplicate: true } },
            { type: 'doc', id: 'cryptographic-storage' },
            { type: 'doc', id: 'key-management' },
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
            { type: 'doc', id: 'cryptographic-storage', customProps: { sidebarDuplicate: true } },
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
            { type: 'doc', id: 'cryptographic-storage', customProps: { sidebarDuplicate: true } },
            { type: 'doc', id: 'key-management', customProps: { sidebarDuplicate: true } },
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
            { type: 'doc', id: 'password-storage', customProps: { sidebarDuplicate: true } },
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
            { type: 'doc', id: 'cryptographic-storage', customProps: { sidebarDuplicate: true } },
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
            { type: 'doc', id: 'transport-layer-security', customProps: { sidebarDuplicate: true } },
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
            { type: 'doc', id: 'key-management', customProps: { sidebarDuplicate: true } },
            { type: 'doc', id: 'microservices-security', customProps: { sidebarDuplicate: true } },
            { type: 'doc', id: 'secrets-management' },
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
            { type: 'doc', id: 'transport-layer-security', customProps: { sidebarDuplicate: true } },
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
            { type: 'doc', id: 'transport-layer-security', customProps: { sidebarDuplicate: true } },
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
            { type: 'doc', id: 'transport-layer-security', customProps: { sidebarDuplicate: true } },
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
            { type: 'doc', id: 'ssrf-prevention', customProps: { sidebarDuplicate: true } },
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
            { type: 'doc', id: 'docker-security' },
            { type: 'doc', id: 'ssrf-prevention', customProps: { sidebarDuplicate: true } },
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
            { type: 'doc', id: 'cryptographic-storage', customProps: { sidebarDuplicate: true } },
            { type: 'doc', id: 'key-management', customProps: { sidebarDuplicate: true } },
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
            { type: 'doc', id: 'django-security' },
            { type: 'doc', id: 'graphql', customProps: { sidebarDuplicate: true } },
            { type: 'doc', id: 'laravel-security' },
            { type: 'doc', id: 'npm-security' },
            { type: 'doc', id: 'symfony' },
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
            { type: 'doc', id: 'abuse-case', customProps: { sidebarDuplicate: true } },
            { type: 'doc', id: 'cryptographic-storage', customProps: { sidebarDuplicate: true } },
            { type: 'doc', id: 'user-privacy-protection' },
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
            { type: 'doc', id: 'html5-security', customProps: { sidebarDuplicate: true } },
            { type: 'doc', id: 'user-privacy-protection', customProps: { sidebarDuplicate: true } },
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
            { type: 'doc', id: 'html5-security', customProps: { sidebarDuplicate: true } },
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
            { type: 'doc', id: 'security-terminology', customProps: { sidebarDuplicate: true } },
            { type: 'doc', id: 'abuse-case', customProps: { sidebarDuplicate: true } },
            { type: 'doc', id: 'attack-surface-analysis' },
            { type: 'doc', id: 'dependency-graph-sbom' },
            { type: 'doc', id: 'software-supply-chain-security' },
            { type: 'doc', id: 'third-party-javascript-management', customProps: { sidebarDuplicate: true } },
            { type: 'doc', id: 'threat-modeling' },
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
            { type: 'doc', id: 'software-supply-chain-security', customProps: { sidebarDuplicate: true } },
            { type: 'doc', id: 'third-party-javascript-management', customProps: { sidebarDuplicate: true } },
            { type: 'doc', id: 'virtual-patching' },
            { type: 'doc', id: 'vulnerable-dependency-management' },
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
            { type: 'doc', id: 'mass-assignment' },
            { type: 'doc', id: 'prototype-pollution-prevention' },
            { type: 'doc', id: 'unvalidated-redirects-forwards', customProps: { sidebarDuplicate: true } },
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
            { type: 'doc', id: 'secure-code-review' },
            { type: 'doc', id: 'transaction-authorization', customProps: { sidebarDuplicate: true } },
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
            { type: 'doc', id: 'logging', customProps: { sidebarDuplicate: true } },
            { type: 'doc', id: 'logging-vocabulary' },
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
            { type: 'doc', id: 'logging', customProps: { sidebarDuplicate: true } },
            { type: 'doc', id: 'session-management', customProps: { sidebarDuplicate: true } },
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
            { type: 'doc', id: 'authorization', customProps: { sidebarDuplicate: true } },
            { type: 'doc', id: 'logging', customProps: { sidebarDuplicate: true } },
            { type: 'doc', id: 'logging-vocabulary', customProps: { sidebarDuplicate: true } },
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
            { type: 'doc', id: 'logging', customProps: { sidebarDuplicate: true } },
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
            { type: 'doc', id: 'error-handling' },
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
            { type: 'doc', id: 'transport-layer-security', customProps: { sidebarDuplicate: true } },
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
