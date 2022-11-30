const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: [path.join(__dirname, 'src', 'index.js')],
  output: {
    path: path.resolve(__dirname, 'dist')
  },
  devtool: false,
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(css|scss)$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
          {
            loader: 'sass-resources-loader',
            options: {
              // eslint-disable-next-line import/no-dynamic-require, global-require
              resources: require(path.join(process.cwd(), '/src/css/globalUtils.js'))
            }
          }
        ]
      },
      {
        test: /\.xml$/,
        use: ['raw-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'public', 'index.html')
    }),
    new webpack.ProvidePlugin({
      React: 'react'
    })
  ]
}
