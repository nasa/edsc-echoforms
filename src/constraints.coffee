  class BaseEchoFormsConstraint
    constructor: (@attrs) ->

    message: -> @attrs.alert
