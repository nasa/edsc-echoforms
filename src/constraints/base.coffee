  class BaseConstraint
    constructor: (@message) ->

    check: (value, model, resolver) ->
      warn("#{@constructor.name} must override check")
