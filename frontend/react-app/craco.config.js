const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { 
              '@primary-color': '#50C878',
              '@menu-bg': '#E3E3E3',
              '@menu-item-active-bg': '#f0fff5',
              // '@dropdown-menu-bg': '#E3E3E3',
              // '@component-background': '#E3E3E3',
              // '@background-color-light': '#E3E3E3',
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};