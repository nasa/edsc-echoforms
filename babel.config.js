module.exports = {
  presets: [
    [
      '@babel/preset-env', {
        targets: {
          node: '24',
          esmodules: true,
          ie: '10'
        }
      }
    ],
    '@babel/preset-react'
  ],
  env: {
    test: {
      plugins: ['istanbul']
    }
  },
  sourceType: 'unambiguous',
  plugins: [
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-transform-runtime'
  ]
}
