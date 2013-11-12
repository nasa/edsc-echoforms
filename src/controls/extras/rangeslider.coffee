do ($ = jQuery, controls = jQuery.echoforms.controls, window, document) ->

  class RangeSliderControl extends controls.RangeControl
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

  $.echoforms.control(RangeSliderControl, export: true)
