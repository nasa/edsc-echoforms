Input = require './input.coffee'

class Secret extends Input
  @selector: 'secret'

  inputElementType: 'password'

module.exports = Secret
