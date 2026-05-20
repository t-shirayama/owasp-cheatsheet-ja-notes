export const SITE_TITLE = 'OWASP ASVS Cheat Sheet 日本語訳';

export const SITE_DESCRIPTION =
  'Unofficial Japanese ASVS-focused bilingual notes for OWASP Cheat Sheet Series';

export const REPOSITORY_URL =
  'https://github.com/t-shirayama/owasp-cheatsheet-ja-notes';

export const OFFICIAL_NOTICE =
  'This is an unofficial Japanese notes site. OWASP content is attributed on each page and reused under CC BY-SA 4.0 where applicable.';

export const FOOTER_LINK_GROUPS = [
  {
    title: 'Repository',
    links: [
      {label: 'GitHub', href: REPOSITORY_URL},
      {
        label: 'Source map',
        href: `${REPOSITORY_URL}/blob/main/references/source-map.md`,
      },
      {
        label: 'Bilingual map',
        href: `${REPOSITORY_URL}/blob/main/references/bilingual-map.md`,
      },
    ],
  },
  {
    title: 'Official Sources',
    links: [
      {label: 'OWASP Cheat Sheet Series', href: 'https://cheatsheetseries.owasp.org/'},
      {
        label: 'OWASP ASVS',
        href: 'https://owasp.org/www-project-application-security-verification-standard/',
      },
      {
        label: 'CC BY-SA 4.0',
        href: 'https://creativecommons.org/licenses/by-sa/4.0/',
      },
    ],
  },
];

export const HOME_CHEAT_SHEETS = [
  {
    title: 'Bean Validation Cheat Sheet',
    ja: 'Bean Validation チートシート',
    href: '/cheatsheets/bean-validation',
    category: 'Encoding and Sanitization',
    asvs: 'V1',
  },
  {
    title: 'Cross-Site Request Forgery Prevention Cheat Sheet',
    ja: 'CSRF防止チートシート',
    href: '/cheatsheets/csrf-prevention',
    category: 'Encoding and Sanitization',
    asvs: 'V1 / V3 / V4',
  },
  {
    title: 'Authentication Cheat Sheet',
    ja: '認証チートシート',
    href: '/cheatsheets/authentication',
    category: 'Authentication',
    asvs: 'V6',
  },
  {
    title: 'Authorization Cheat Sheet',
    ja: '認可チートシート',
    href: '/cheatsheets/authorization',
    category: 'Authorization',
    asvs: 'V8 / V16',
  },
  {
    title: 'Credential Stuffing Prevention Cheat Sheet',
    ja: 'クレデンシャルスタッフィング防止チートシート',
    href: '/cheatsheets/credential-stuffing-prevention',
    category: 'Authentication',
    asvs: 'V6',
  },
  {
    title: 'Forgot Password Cheat Sheet',
    ja: 'パスワード忘れ対応チートシート',
    href: '/cheatsheets/forgot-password',
    category: 'Authentication',
    asvs: 'V6',
  },
  {
    title: 'Logging Cheat Sheet',
    ja: 'ロギングチートシート',
    href: '/cheatsheets/logging',
    category: 'Security Logging and Error Handling',
    asvs: 'V10 / V16',
  },
  {
    title: 'Multifactor Authentication Cheat Sheet',
    ja: '多要素認証チートシート',
    href: '/cheatsheets/multifactor-authentication',
    category: 'Authentication',
    asvs: 'V6',
  },
  {
    title: 'OAuth 2.0 Protocol Cheat Sheet',
    ja: 'OAuth 2.0 プロトコルチートシート',
    href: '/cheatsheets/oauth2',
    category: 'OAuth and OIDC',
    asvs: 'V10',
  },
  {
    title: 'Cryptographic Storage Cheat Sheet',
    ja: '暗号化ストレージチートシート',
    href: '/cheatsheets/cryptographic-storage',
    category: 'Cryptography',
    asvs: 'V11 / V13 / V14',
  },
  {
    title: 'Password Storage Cheat Sheet',
    ja: 'パスワード保存チートシート',
    href: '/cheatsheets/password-storage',
    category: 'Cryptography',
    asvs: 'V6 / V11',
  },
  {
    title: 'REST Security Cheat Sheet',
    ja: 'REST セキュリティチートシート',
    href: '/cheatsheets/rest-security',
    category: 'API and Web Service',
    asvs: 'V4 / V9',
  },
  {
    title: 'Session Management Cheat Sheet',
    ja: 'セッション管理チートシート',
    href: '/cheatsheets/session-management',
    category: 'Session Management',
    asvs: 'V7 / V16',
  },
];

export const HOME_FEATURES = [
  {
    title: '原文と翻訳を比較',
    body: '英語原文と日本語訳を同じ流れで読み、解釈のずれを確認できます。',
  },
  {
    title: '翻訳を本文として読む',
    body: '日本語訳を単独表示し、必要に応じて原文へ戻れる構成にしています。',
  },
  {
    title: 'ASVS からたどる',
    body: 'ASVS 章別のナビゲーションから、関連する Cheat Sheet を探せます。',
  },
];
