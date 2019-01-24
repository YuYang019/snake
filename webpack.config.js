const path = require('path')
const webpack = require('webpack')

// webpack-dev-server负责提供开发环境
module.exports = {
  watch: true,
  mode: 'development',
  entry: {
    index: path.join(__dirname, './src/index.js')
  },
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'bundle.js'
  },
  devServer: {
    hot: true,
    open: true,
    inline: true,
    compress: true,
    port: 8888
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: [
          'babel-loader',
          'eslint-loader'
        ]
      }
    ]
  },
  plugins: [
    // 光配置不行，还得显示的调用
    new webpack.HotModuleReplacementPlugin()
  ]
}
