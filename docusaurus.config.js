const config = {
  title: 'OWASP ASVS Cheat Sheet 日本語訳',
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
        explicitSearchResultPath: true,
        highlightSearchTermsOnTargetPage: true,
      },
    ],
  ],

  themeConfig: {
    image: 'img/site-card.png',
    navbar: {
      title: 'OWASP ASVS Cheat Sheet 日本語訳',
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
    colorMode: {
      defaultMode: 'light',
      respectPrefersColorScheme: true,
    },
    prism: {
      theme: require('prism-react-renderer').themes.vsLight,
      darkTheme: require('prism-react-renderer').themes.vsDark,
      additionalLanguages: ['java'],
    },
  },
};

module.exports = config;
