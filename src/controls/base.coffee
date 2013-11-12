  # This class is the base of all ECHO Forms controls.  It exposes many methods to
  # make it easier to produce new controls.
  class BaseControl

    # We need to generate id attributes so our labels can point to something.  This
    # we'll increment this number to ensure they're unique across all instance of
    # the plugin
    @echoformsControlUniqueId: 0

    # Constructs the control
    # Parameters:
    #   ui - The xml element in the ECHO Form which caused this class to be constructed
    #   model - The ECHO Forms model.  For descendants of grouping controls, this may be
    #           a node somewhere within the overall model instance
    #   controlClasses - A list of classes to use when constructing child controls.  This
    #           is only used by grouping controls
    #   resolver - A function used to resolve xpath namespaces, used by the `xpath` method.
    constructor: (@ui, @model, @controlClasses, @resolver) ->
      # Read and store common attributes
      @refExpr      = ui.attr('ref')
      @id           = ui.attr('id') ? "echoforms-control-#{BaseControl.echoformsControlUniqueId++}"
      @relevantExpr = ui.attr('relevant')
      @requiredExpr = ui.attr('required')
      @readonlyExpr = ui.attr('readonly')
      @label        = ui.attr('label')
      @help         = $(help).text() for help in ui.children('help')

      # Load validation constraints
      @loadConstraints()

      # Build the HTML elements used to display the control
      @el = @buildDom()

    # Loads the constraints used to validate this control, producing an array, @constraints,
    # containing Constraint objects (see `BaseConstraint`).
    loadConstraints: ->
      @constraints  = []

      # We treat the "required" attribute as a constraint, since it acts similarly
      if @requiredExpr
        @constraints.push(new RequiredConstraint(@requiredExpr))

      # Look for constraint elements and build the appropriate constraint type
      for node in @ui.find('> constraints > constraint')
        node = $(node)
        message = node.children('alert').text()
        patternNode = node.children('pattern')
        xpathNode = node.children('xpath')
        if patternNode.length > 0
          @constraints.push(new PatternConstraint(patternNode.text(), message))
        if xpathNode.length > 0
          @constraints.push(new XPathConstraint(xpathNode.text(), message))

    # Retrieve the node pointed to by the ref attribute, or the entire model if
    # there is no ref attribute (useful for grouping controls)
    ref: ->
      if @refExpr? then $(@xpath(@refExpr)) else @model

    # Retrieve the trimmed text value of the node pointed to by the ref attribute,
    # or undefined if there is no ref attribute
    refValue: ->
      if @refExpr? then $.trim(@ref().text()) else undefined

    inputValue: ->
      warn("#{@constructor.name} must override inputValue")

    loadFromModel: ->
      #@validate()

    validate: ->
      relevant = !@relevantExpr? || !!@xpath(@relevantExpr)
      readonly = @readonlyExpr?  && !!@xpath(@readonlyExpr)
      @relevant(relevant) if @relevantExpr?
      @readonly(readonly) if @readonlyExpr?

      errors = (c.message for c in @constraints when !c.check(@refValue() ? @inputValue(), @model, @resolver))

      @setErrors(errors)

    saveToModel: ->

    xpath: (xpath) ->
      execXPath(@model, xpath, @resolver)

    element: ->
      @el ?= @buildDom()

    isChanged: (newValue) ->
      @refValue() != @inputValue() || !@refExpr

    changed: () =>
      @el.trigger('echoforms:modelchange')

    relevant: (arg) ->
      if arg?
        isRelevant = !!arg
        if isRelevant != @relevant()
          @el.toggleClass('echoforms-irrelevant', !isRelevant)
          @el.toggle(isRelevant)
          ref = @ref()
          if isRelevant
            ref[0].removeAttribute('pruned')
          else
            ref[0].setAttribute('pruned', 'true')
      else
        !@el.hasClass('echoforms-irrelevant')

    readonly: (arg) ->
      if arg?
        isReadonly = !!arg
        if isReadonly != @readonly()
          @el.toggleClass('echoforms-readonly ui-state-disabled', isReadonly)
          @updateReadonly(isReadonly)
      else
        @el.hasClass('echoforms-readonly')

    updateReadonly: (isReadonly) ->
      @inputs().attr('disabled', isReadonly)
      @inputs().attr('readonly', isReadonly)

    onChange: (e) =>
      if @isChanged()
        @saveToModel()
        @changed()

    buildLabelDom: ->
      if @label?
        $('<label>', class: 'echoforms-label', for: "#{@id}-element").text(@label)
      else
        $()

    buildHelpDom: ->
      result = $('<div>', class: 'echoforms-help')
      for help in @ui.children('help')
        $('<p>', class: 'echoforms-help-item').text($(help).text()).appendTo(result)
      result

    buildControlDom: ->
      $("<div>", id: @id, class: "echoforms-control echoforms-control-#{@ui[0].nodeName}")

    buildElementsDom: ->
      $('<div>', class: 'echoforms-elements')

    buildErrorsDom: ->
      $('<div>', class: 'echoforms-errors')

    setErrors: (messages) ->
      errors = $()
      for message in messages
        error = $('<div class="echoforms-error">')
        error.text(message)
        errors = errors.add(error)
      @el.children('.echoforms-errors').empty().append(errors)

    buildDom: (classes=null)->
      @buildControlDom()
        .append(@buildLabelDom())
        .append(@buildElementsDom())
        .append(@buildErrorsDom())
        .append(@buildHelpDom())

    addedToDom: ->
