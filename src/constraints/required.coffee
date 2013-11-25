Base = require './base.coffee'
{execXPath} = require '../util.coffee'

class Required extends Base
  constructor: (@xpath, message="Required field") ->
    super(message)

  check: (value, model, resolver) ->
    value = null if value instanceof Array and value.length == 0
    !!value || !execXPath(model, @xpath, resolver)

module.exports = Required
