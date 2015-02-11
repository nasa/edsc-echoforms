Base = require './base.coffee'

class Pattern extends Base
  constructor: (patternStr, message) ->
    @pattern = new RegExp('^' + patternStr + '$')
    super(message ? 'Invalid')

  check: (value, model, resolver) ->
    !value || (value instanceof Array && value.length == 0) || @pattern.exec(value) != null;

module.exports = Pattern
