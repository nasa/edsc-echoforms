  class OutputControl extends TypedControl
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

  class UrlOutputControl extends OutputControl
    @selector: 'output[type$=anyURI], output[type$=anyuri]'

    inputTag: 'a'

    inputAttrs: ->
      $.extend(super(), href: '#')

    loadFromModel: ->
      value = @refValue()
      @el.find('.echoforms-elements > a').text(value).attr('href', value) if @refExpr || @valueExpr
