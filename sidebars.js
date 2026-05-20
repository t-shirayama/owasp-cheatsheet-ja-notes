const sidebars = {
  cheatsheetSidebar: [
    'index',
    {
      type: 'category',
      label: 'Encoding and Sanitization',
      collapsed: false,
      items: [
        'bean-validation',
        'csrf-prevention',
      ],
    },
    {
      type: 'category',
      label: 'Authentication',
      collapsed: false,
      items: [
        'authentication',
        'credential-stuffing-prevention',
        'forgot-password',
        'multifactor-authentication',
      ],
    },
    {
      type: 'category',
      label: 'Authorization',
      collapsed: false,
      items: [
        'authorization',
      ],
    },
    {
      type: 'category',
      label: 'API and Web Service',
      collapsed: false,
      items: [
        'oauth2',
        'rest-security',
      ],
    },
    {
      type: 'category',
      label: 'Cryptographic Storage',
      collapsed: false,
      items: [
        'cryptographic-storage',
        'password-storage',
      ],
    },
    {
      type: 'category',
      label: 'Session Management',
      collapsed: false,
      items: [
        'session-management',
      ],
    },
    {
      type: 'category',
      label: 'Logging and Monitoring',
      collapsed: false,
      items: [
        'logging',
      ],
    },
  ],
};

module.exports = sidebars;
