$ = require 'jquery'
Typed = require './typed.coffee'

class Output extends Typed
  @selector: 'output'

  inputTag: 'p'

  constructor: (ui, model, controlClasses, resolver) ->
    @valueExpr = ui.attr('value')
    super(ui, model, controlClasses, resolver)

  inputs: () -> $()

  inputAttrs: ->
    attrs = super()
    delete attrs.autocomplete
    attrs

  refValue: ->
    if @valueExpr
      @xpath(@valueExpr)
    else
      super()

  loadFromModel: ->
    super()
    @el.find('.echoforms-elements > p').text(@refValue()) if @refExpr || @valueExpr

module.exports = Output
