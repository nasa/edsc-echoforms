const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const htmlWebpackPlugin = new HtmlWebpackPlugin({
  template: path.join(__dirname, 'src/index.html'),
  filename: './index.html',
  favicon: './example/favicon.ico'
})

module.exports = {
  entry: path.join(__dirname, 'src/index.jsx'),
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
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                silenceDeprecations: ['mixed-decls', 'color-functions', 'global-builtin', 'import']
              }
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
    htmlWebpackPlugin,
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      stream: false
    })
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
    fallback: {
      buffer: require.resolve('buffer'),
      stream: require.resolve('stream-browserify')
    }
  },
  devtool: 'source-map',
  devServer: {
    port: 3010
  }
}
