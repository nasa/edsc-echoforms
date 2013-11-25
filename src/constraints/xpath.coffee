Base = require './base.coffee'
{execXPath} = require '../util.coffee'

class XPath extends Base
  constructor: (@xpath, message) ->
    super(message ? 'Invalid')

  check: (value, model, resolver) ->
    execXPath(model, @xpath, resolver)

module.exports = XPath
