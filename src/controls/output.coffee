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
    try
      super()
      @el.find('.echoforms-elements > p').text(@refValue()) if @refExpr || @valueExpr
    catch exception
      throw "#{exception}<br/>Error found while setting initial value of output control: [#{$('<div/>').text(this.ui[0].outerHTML).html()}]."

module.exports = Output
