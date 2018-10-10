Base = require './base.coffee'

class TreeMaxParameters extends Base
  constructor: (maxParameters, message) ->
    @maxParameters = maxParameters
    super(message ? 'Invalid')

  check: (value, model, resolver) ->
    value <= @maxParameters

module.exports = TreeMaxParameters
