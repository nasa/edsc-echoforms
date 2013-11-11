do ($ = jQuery, controls = jQuery.echoforms.controls, window, document) ->

  class RangeControl extends controls.InputControl
    @selector: 'range'

    constructor: (args...) ->
      super(args...)


  $.echoforms.control(RangeControl, export: true)
