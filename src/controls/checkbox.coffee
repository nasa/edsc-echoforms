Input = require './input.coffee'

class Checkbox extends Input
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

module.exports = Checkbox
