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

    input.ionRangeSlider
      step: @step
      min: @start
      max: @end

module.exports = RangeSlider
