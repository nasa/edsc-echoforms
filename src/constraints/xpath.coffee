  class XPathConstraint extends BaseConstraint
    constructor: (@xpath, message) ->
      super(message ? 'Invalid')

    check: (value, model, resolver) ->
      execXPath(model, @xpath, resolver)
