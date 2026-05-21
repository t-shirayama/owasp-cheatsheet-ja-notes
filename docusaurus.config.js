const config = {
  title: 'OWASP ASVS チートシート索引 日本語版',
  tagline: 'OWASP Cheat Sheet Series を ASVS 索引から参照できる非公式日本語版',
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
    docs: {
      sidebar: {
        hideable: true,
      },
    },
    navbar: {
      title: 'OWASP ASVS チートシート索引 日本語版',
      logo: {
        alt: 'OWASP ASVS チートシート索引 日本語版',
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
      additionalLanguages: [
        'apacheconf',
        'bash',
        'cfscript',
        'cpp',
        'csharp',
        'docker',
        'graphql',
        'http',
        'ini',
        'java',
        'json',
        'jsx',
        'log',
        'markdown',
        'perl',
        'php',
        'powershell',
        'python',
        'ruby',
        'rust',
        'sql',
        'twig',
        'typescript',
        'vbnet',
        'xml',
        'xslt',
        'yaml',
      ],
    },
  },
};

module.exports = config;
