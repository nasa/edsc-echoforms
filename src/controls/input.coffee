  class InputControl extends TypedControl
    @selector: 'input'

    inputClass: 'input'
    inputTag: 'input'
    inputElementType: 'text'

    inputAttrs: ->
      attrs = $.extend(super(), type: @inputElementType)
      attrs['placeholder'] = 'MM-DD-YYYYTHH:MM:SS' if @inputType == 'datetime'
      attrs

  class CheckboxControl extends InputControl
    @selector: 'input[type$=boolean]'

    inputClass: 'checkbox'
    inputElementType: 'checkbox'

    inputValue:() ->
      @inputs()[0].checked.toString()

    loadFromModel: ->
      super()
      @inputs()[0].checked = @refValue() == 'true' if @refExpr

    buildDom: ->
      # Put the label after the element as is expected of checkboxes
      result = super()
      result.addClass('echoforms-control-checkbox')
      result.children('.echoforms-elements').after(result.children('.echoforms-label'))
      result
