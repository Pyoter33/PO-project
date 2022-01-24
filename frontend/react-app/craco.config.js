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
              '@table-header-bg': '#50c87859',
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};