const config = {
  title: 'OWASP ASVS Cheat Sheet 日本語ノート',
  tagline: 'Unofficial Japanese ASVS-focused notes and bilingual views for OWASP Cheat Sheet Series',
  favicon: 'img/logo.svg',

  url: 'https://t-shirayama.github.io',
  baseUrl: '/owasp-cheatsheet-ja-notes/',
  organizationName: 't-shirayama',
  projectName: 'owasp-cheatsheet-ja-notes',

  onBrokenLinks: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'ja',
    locales: ['ja'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          path: 'docs/bilingual',
          routeBasePath: 'cheatsheets',
          sidebarPath: require.resolve('./sidebars.js'),
          showLastUpdateTime: true,
          showLastUpdateAuthor: false,
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],

  plugins: [
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        hashed: true,
        language: ['en', 'ja'],
        indexDocs: true,
        indexPages: true,
        indexBlog: false,
        highlightSearchTermsOnTargetPage: true,
      },
    ],
  ],

  themeConfig: {
    image: 'img/site-card.png',
    navbar: {
      title: 'OWASP ASVS Cheat Sheet 日本語ノート',
      logo: {
        alt: 'OWASP Cheat Sheet Japanese Notes',
        src: 'img/logo.svg',
      },
      items: [
        {
          href: 'https://github.com/t-shirayama/owasp-cheatsheet-ja-notes',
          label: 'GitHub',
          position: 'right',
        },
        {
          href: 'https://github.com/t-shirayama/owasp-cheatsheet-ja-notes/commits/main/',
          label: '更新履歴',
          position: 'right',
        },
        {
          href: 'https://github.com/t-shirayama/owasp-cheatsheet-ja-notes/pulls',
          label: 'コントリビュート',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'light',
      links: [
        {
          title: 'Repository',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/t-shirayama/owasp-cheatsheet-ja-notes',
            },
            {
              label: 'Source map',
              href: 'https://github.com/t-shirayama/owasp-cheatsheet-ja-notes/blob/main/references/source-map.md',
            },
            {
              label: 'Bilingual map',
              href: 'https://github.com/t-shirayama/owasp-cheatsheet-ja-notes/blob/main/references/bilingual-map.md',
            },
          ],
        },
        {
          title: 'Official Sources',
          items: [
            {
              label: 'OWASP Cheat Sheet Series',
              href: 'https://cheatsheetseries.owasp.org/',
            },
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
      ],
      copyright:
        'This is an unofficial Japanese notes site. OWASP content is attributed on each page and reused under CC BY-SA 4.0 where applicable.',
    },
    colorMode: {
      defaultMode: 'light',
      respectPrefersColorScheme: true,
    },
    prism: {
      theme: require('prism-react-renderer').themes.github,
      darkTheme: require('prism-react-renderer').themes.dracula,
    },
  },
};

module.exports = config;
