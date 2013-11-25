Typed = require './typed.coffee'

class Input extends Typed
  @selector: 'input'

  inputClass: 'input'
  inputTag: 'input'
  inputElementType: 'text'

  inputAttrs: ->
    attrs = super()
    attrs['type'] = @inputElementType
    attrs['placeholder'] = 'YYYY-MM-DDTHH:MM:SS' if @inputType == 'datetime'
    attrs

module.exports = Input
