  class FormControl extends GroupingControl
    constructor: (ui, model, controlClasses, resolver) ->
      super(ui, model, controlClasses, resolver)
      @el.bind 'echoforms:modelchange', =>
        @loadFromModel()
        @validate()
      @loadFromModel()
      @validate()

    ref: ->
      @model.children()

    isValid: ->
      @el.find('.echoforms-error:visible').length == 0

    serialize: ->
      model = @model.children().clone()
      model.find('*[pruned=true]').remove()
      $('<div>').append(model).html()
