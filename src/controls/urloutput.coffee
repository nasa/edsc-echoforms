Output = require './output.coffee'

class UrlOutput extends Output
  @selector: 'output[type$=anyURI], output[type$=anyuri]'

  inputTag: 'a'

  inputAttrs: ->
    attrs = super()
    attrs['href'] = '#'
    attrs

  loadFromModel: ->
    value = @refValue()
    @el.find('.echoforms-elements > a').text(value).attr('href', value) if @refExpr || @valueExpr

module.exports = UrlOutput
