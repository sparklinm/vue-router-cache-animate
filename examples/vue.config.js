module.exports = {
  publicPath: '/vue-router-cache-animate/examples',
  outputDir: '../docs/examples',
  configureWebpack: {
    resolve: {
      // Add `.ts` and `.tsx` as a resolvable extension.
      extensions: ['.ts', '.tsx', '.js']
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          loader: 'ts-loader'
        }
      ]
    }
  }
}