const { injectBabelPlugin } = require('react-app-rewired');

const { override, fixBabelImports, addLessLoader,addDecoratorsLegacy, } = require('customize-cra');

// module.exports = function override(config, env) {
//   // do stuff with the webpack config...
//   // config=override(
//   //   fixBabelImports('import', {
//   //     libraryName: 'antd-mobile',
//   //     libraryDirectory: 'es',
//   //     style: true,
//   //   }),
//   //   addLessLoader({
//   //       javascriptEnabled: true,
//   //       modifyVars: {
//   //         '@brand-primary': '#FF9933' ,
//   //         '@brand-primary-tap':'#FF9900'
//   //       },
//   //     }),
//   // );
//   // config = injectBabelPlugin(['import', { libraryName: 'antd-mobile', style: 'css' }], config);
//   config=injectBabelPlugin(['@babel/plugin-proposal-decorators', { "legacy": true }], config)   //{ "legacy": true }一定不能掉，否则报错
//   return config;
// };

module.exports =override(
  addDecoratorsLegacy(),
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