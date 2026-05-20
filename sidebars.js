const sidebars = {
  cheatsheetSidebar: [
    'index',
    {
      type: 'category',
      label: 'Encoding and Sanitization',
      collapsed: false,
      items: [
        'v1/bean-validation',
        'v1/csrf-prevention',
      ],
    },
    {
      type: 'category',
      label: 'Cryptographic Storage',
      collapsed: false,
      items: [
        'v11/cryptographic-storage',
      ],
    },
  ],
};

module.exports = sidebars;
