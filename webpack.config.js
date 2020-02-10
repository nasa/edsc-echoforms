const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const htmlWebpackPlugin = new HtmlWebpackPlugin({
  template: path.join(__dirname, 'example/src/index.html'),
  filename: './index.html'
})

module.exports = {
  entry: path.join(__dirname, 'example/src/index.js'),
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.xml$/,
        use: ['raw-loader']
      }
    ]
  },
  plugins: [htmlWebpackPlugin],
  resolve: {
    extensions: ['.js', '.jsx']
  },
  devtool: 'source-map',
  devServer: {
    port: 3002
  }
}
