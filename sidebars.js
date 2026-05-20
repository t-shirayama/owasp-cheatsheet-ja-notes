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
      label: 'Cryptographic Storage',
      collapsed: false,
      items: [
        'cryptographic-storage',
      ],
    },
  ],
};

module.exports = sidebars;
