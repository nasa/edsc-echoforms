Input = require './input.coffee'

class Range extends Input
  @selector: 'range'

  constructor: (ui, model, controlClasses, resolver) ->
    @start = parseInt(ui.attr('start'), 10)
    @end = parseInt(ui.attr('end'), 10)
    @step = parseInt(ui.attr('step'), 10)
    super(ui, model, controlClasses, resolver)

module.exports = Range
