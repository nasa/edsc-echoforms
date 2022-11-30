const webpackConfig = require('./cypress.webpack.config')

module.exports = {
  component: {
    setupNodeEvents(on, config) {
      console.log('setupNodeEvents for components')

      require('@cypress/code-coverage/task')(on, config)

      return config
    },
    devServer: {
      framework: 'react',
      bundler: 'webpack',
      webpackConfig
    }
  }
}
