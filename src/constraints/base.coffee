util = require '../util.coffee'

class Base
  constructor: (@message) ->

  check: (value, model, resolver) ->
    util.warn("#{@constructor.name} must override check")

module.exports = Base
