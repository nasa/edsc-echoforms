Select = require './select.coffee'

# As used, selectrefs turn out to be identical to selects, with valueElementName defaulted to 'value'
# The lack of reference controls hugely simplifies client code
class Selectref extends Select
  @selector: 'selectref'

  constructor: (ui, model, controlClasses, resolver) ->
    valueElementName = ui.attr('valueElementName')
    ui.attr('valueElementName', 'value') unless valueElementName?

    super(ui, model, controlClasses, resolver)

  buildDom: ->
    super().addClass('echoforms-control-select')

module.exports = Selectref
