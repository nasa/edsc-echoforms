  # Note: There's a pretty fantastic opportunity for optimization here.
  # All node xpaths are alphanumeric with at least one colon and 0 or
  # more forward slashes, periods, and dashes, possibly (rarely) followed
  # by a single bracketed expression.
  # Because of this, we should be able to pick out node selectors from
  # within xpaths, see which model nodes they reference, and listen for
  # change events on those nodes only.  Instead of refreshing the whole
  # UI, we should only have to refresh elements which actually change.
  # If we do this, we should strip bracketed expressions before listening.
  # They are rare and evaluating them up-front is unnecessary and has
  # pitfalls.
  #

  echoformsControlUniqueId = 0

  class BaseControl
    constructor: (@ui, @model, @controlClasses, @resolver) ->
      @refExpr      = ui.attr('ref')
      @id           = ui.attr('id') ? "echoforms-control-#{echoformsControlUniqueId++}"
      @relevantExpr = ui.attr('relevant')
      @requiredExpr = ui.attr('required')
      @readonlyExpr = ui.attr('readonly')
      @label        = ui.attr('label')
      @help         = $(help).text() for help in ui.children('help')

      @loadConstraints()
      @el = @buildDom()

    loadConstraints: ->
      @constraints  = []
      if @requiredExpr
        @constraints.push(new RequiredConstraint(@requiredExpr))

      constraintNodes = @ui.children('constraints')
      for node in constraintNodes.children('constraint')
        node = $ node
        message = node.children('alert').text()
        patternNode = node.children('pattern')
        xpathNode = node.children('xpath')
        if patternNode.length > 0
          @constraints.push(new PatternConstraint(patternNode.text(), message))
        if xpathNode.length > 0
          @constraints.push(new XPathConstraint(xpathNode.text(), message))

    ref: ->
      if @refExpr? then $(@xpath(@refExpr)) else @model

    refValue: ->
      if @refExpr? then $.trim(@ref().text()) else undefined

    inputValue: ->
      warn("#{@constructor.name} must override inputValue")

    loadFromModel: ->
      @validate()

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
      @el.find('.echoforms-errors').empty().append(errors)

    buildDom: (classes=null)->
      @buildControlDom()
        .append(@buildLabelDom())
        .append(@buildElementsDom())
        .append(@buildErrorsDom())
        .append(@buildHelpDom())

    addedToDom: ->
