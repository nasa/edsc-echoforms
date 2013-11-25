$ = require 'jquery'
Range = require '../range.coffee'

class RangeSlider extends Range
  @selector: 'range'

  loadFromModel: ->
    super()
    @inputs().change()

  addedToDom: ->
    super()
    input = @inputs()

    $('<div/>').addClass('slider-output').insertAfter(input)

    input.bind 'slider:ready slider:changed', (e, data) ->
      $(this).nextAll('.slider-output').html(input.val())

    input.simpleSlider
      snap: true
      range: [@start, @end]
      step: @step
      classPrefix: 'echoforms'

module.exports = RangeSlider
