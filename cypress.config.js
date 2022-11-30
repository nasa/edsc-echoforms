const webpackConfig = require('./cypress.webpack.config')

module.exports = {
  component: {
    setupNodeEvents(on, config) {
      // eslint-disable-next-line global-require
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
