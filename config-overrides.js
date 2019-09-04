//const { injectBabelPlugin } = require('react-app-rewired');

const { override, fixBabelImports, addLessLoader } = require('customize-cra');

// module.exports = function override(config, env) {
//   // do stuff with the webpack config...
//   config = injectBabelPlugin(['import', { libraryName: 'antd-mobile', style: 'css' }], config);
//   return config;
// };

module.exports =override(
  fixBabelImports('import', {
    libraryName: 'antd-mobile',
    libraryDirectory: 'es',
    style: true,
  }),
  addLessLoader({
      javascriptEnabled: true,
      modifyVars: {
        '@brand-primary': '#FF9933' ,
        '@brand-primary-tap':'#FF9900'
      },
    }),
);