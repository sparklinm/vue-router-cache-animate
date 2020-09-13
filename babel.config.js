module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false,
        useBuiltIns: 'usage',
        corejs: 2,
        targets: {
          // 目标浏览器版本，该浏览器缺失某新语法，babel才会引入这个新语法
          ie: 10
        }
      }
    ]
  ],
  plugins: [
    [
      '@babel/plugin-transform-runtime',
      {
        corejs: {
          version: false // 可选 false | 2 | 3
          // proposals: true
        }
      }
    ],
    '@babel/plugin-proposal-class-properties'
    // 'external-helpers'
  ],
  ignore: ['node_modules/**']
}
