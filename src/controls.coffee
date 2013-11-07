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
      @relevant(!!@xpath(@relevantExpr)) if @relevantExpr?
      @readonly(!!@xpath(@readonlyExpr)) if @readonlyExpr?

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
          ref.toggleClass('echoforms-pruned', !isRelevant)
          # Ensure there's no class="" from the previous statement
          ref.removeAttr('class') if ref.attr('class') == ''
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
        $("<label class=\"echoforms-control-label\" for=\"#{@id}-element\">#{@label}</label>")
      else
        $()

    buildHelpDom: ->
      result = $()
      for help in @ui.children('help')
        result = result.add("<label class=\"echoforms-help\" for=\"#{@id}-element\">#{$(help).text()}</label>")
      result

    buildControlDom: ->
      $("<div id=\"#{@id}\" class=\"echoforms-control echoforms-control-#{@ui[0].nodeName}\"/>")

    buildElementsDom: ->
      $('<div class="echoforms-elements"/>').append(@buildElementsChildrenDom())

    buildErrorsDom: ->
      $('<div class="echoforms-errors"/>')

    setErrors: (messages) ->
      errors = $()
      for message in messages
        error = $('<div class="echoforms-error"/>')
        error.text(message)
        errors = errors.add(error)
      @el.find('.echoforms-errors').empty().append(errors)

    buildElementsChildrenDom: ->
      $()

    buildDom: ->
      @buildControlDom()
        .append(@buildLabelDom())
        .append(@buildElementsDom())
        .append(@buildHelpDom())
        .append(@buildErrorsDom())

  #####################
  # Typed Controls
  #####################

  class TypedControl extends BaseControl
    constructor: (ui, model, controlClasses, resolver) ->
      @inputType = (ui.attr('type') ? 'string').replace(/^.*:/, '').toLowerCase()
      super(ui, model, controlClasses, resolver)
      @inputs().bind('click change', @onChange)

    loadConstraints: ->
      super()
      @constraints.push(new TypeConstraint(@inputType))

    inputs: () ->
      @_inputs ?= @el.find(':input')

    inputValue:() ->
      $.trim(@inputs().val())

    saveToModel: ->
      super()
      @ref().text(@inputValue()) if @refExpr

    loadFromModel: ->
      super()
      @inputs().val(@refValue()) if @refExpr

  class InputControl extends TypedControl
    @selector: 'input'

    inputElementType: 'text'

    buildElementsChildrenDom: ->
      element = $("<input id=\"#{@id}-element\" type=\"#{@inputElementType}\" class=\"echoforms-element-input echoforms-element-input-#{@inputType}\" autocomplete=\"off\">")
      element.attr('placeholder', 'MM/DD/YYYYTHH:MM:SS') if @inputType == 'datetime'
      element

  class CheckboxControl extends InputControl
    @selector: 'input[type$=boolean]'
    inputElementType: 'checkbox'

    inputValue:() ->
      @inputs().is(':checked').toString()

    loadFromModel: ->
      super()
      @inputs().attr('checked', @refValue() == 'true') if @refExpr

    buildDom: ->
      # Put the label after the element as is expected of checkboxes
      result = super()
      result.find('.echoforms-elements').after(result.find('.echoforms-control-label'))
      result


  class OutputControl extends TypedControl
    @selector: 'output'

    constructor: (ui, model, controlClasses, resolver) ->
      @valueExpr = ui.attr('value')
      super(ui, model, controlClasses, resolver)

    inputs: () -> $()

    refValue: ->
      if @valueExpr
        @xpath(@valueExpr)
      else
        super()

    loadFromModel: ->
      super()
      @el.find('.echoforms-elements > p').text(@refValue()) if @refExpr || @valueExpr

    buildElementsChildrenDom: ->
      $('<p/>')

  class UrlOutputControl extends OutputControl
    @selector: 'output[type$=anyURI], output[type$=anyuri]'

    loadFromModel: ->
      value = @refValue()
      @el.find('.echoforms-elements > a').text(value).attr('href', value) if @refExpr || @valueExpr

    buildElementsChildrenDom: ->
      $('<a href="#" />')

  class SelectControl extends TypedControl
    @selector: 'select'

    constructor: (ui, model, controlClasses, resolver) ->
      @isMultiple = ui.attr('multiple') == 'true'
      @valueElementName = ui.attr('valueElementName')
      @items = for item in ui.children('item')
        [label, value] = [$(item).attr('label'), $(item).attr('value')]
        [label ? value, value]

      super(ui, model, controlClasses, resolver)

    refValue: ->
      if @valueElementName? and @refExpr?
        $(child).text() for child in @ref().children(@valueElementName)
      else
        super()

    saveToModel: ->
      if @valueElementName? and @refExpr?
        root = @ref().empty()
        namespace = root[0].nodeName.split(':')[0]
        for value in @inputValue()
          node = $("<#{namespace}:#{@valueElementName}/>").text(value)
          root.append(node)
      else
        super()

    loadFromModel: ->
      if @valueElementName? and @refExpr?
        value = ($(node).text() for node in @ref().children())
        value = value[0] unless @isMultiple
        @inputs().val(value)
      else
        super()

    inputValue: ->
      result = @inputs().val()
      if @valueElementName? and !(result instanceof Array)
        result = if result? then [result] else []
      result

    buildElementsChildrenDom: ->
      el = $("<select id=\"#{@id}-element\" class=\"echoforms-element-select\" autocomplete=\"off\"/>")
      if @isMultiple
        el.addClass('echoforms-element-select-multiple')
        el.attr('multiple', 'multiple')
      else
        el.append('<option value=""> -- Select a value -- </option>')
      if @isOpen
        el.addClass('echoforms-element-select-open')
      for [label, value] in @items
        el.append("<option value=\"#{value}\">#{label}</option>")
      el

  class RangeControl extends InputControl
    @selector: 'range'

    constructor: (ui, model, controlClasses, resolver) ->
      @start = ui.attr('start')
      @end = ui.attr('end')
      @step = ui.attr('step')
      super(ui, model, controlClasses, resolver)

  class SecretControl extends InputControl
    @selector: 'secret'

    inputElementType: 'password'

  class TextareaControl extends TypedControl
    @selector: 'textarea'

    buildElementsChildrenDom: ->
      $("<textarea id=\"#{@id}-element\" class=\"echoforms-element-textarea\" autocomplete=\"off\"/>")

  #####################
  # Grouping Controls
  #####################

  class GroupingControl extends BaseControl
    constructor: (ui, model, controlClasses, resolver) ->
      # Grouping controls ignore the 'required' attribute
      ui.removeAttr('required')
      super(ui, model, controlClasses, resolver)

    inputs: () -> $()

    loadFromModel: ->
      super()
      control.loadFromModel() for control in @controls

    buildDom: ->
      root = super()
      childModel = @ref()
      ui = @ui
      children = $()
      @controls = controls = []
      for child in ui.children()
        continue if child.nodeName == 'help' || child.nodeName == 'constraints'
        found = false
        for ControlClass in @controlClasses
          if $(child).is(ControlClass.selector)
            control = new ControlClass($(child), childModel, @controlClasses, @resolver)
            controls.push(control)
            children = children.add(control.el)
            found = true
            break
        warn("No class available for element:", child) unless found
      root.find('.echoforms-elements').replaceWith($('<div class="echoforms-children"/>').append(children))
      root

    updateReadonly: (isReadonly) ->
      # Grouping controls cause child controls to inherit the readonly flag
      super(isReadonly)
      for control in @controls
        control.updateReadonly(isReadonly)

  class FormControl extends GroupingControl
    constructor: (ui, model, controlClasses, resolver) ->
      ui.attr('ref', model.children()[0].nodeName)
      super(ui, model, controlClasses, resolver)
      @el.bind 'echoforms:modelchange', => @loadFromModel()
      @loadFromModel()

    isValid: ->
      @el.find('.echoforms-error').length == 0

    serialize: ->
      model = @model.children().clone()
      model.find('.echoforms-pruned').remove()
      $('<div>').append(model).html()

  class GroupControl extends GroupingControl
    @selector: 'group'

    buildLabelDom: ->
      if @label?
        $("<h1 class=\"echoforms-control-label\">#{@label}</h1>")
      else
        $()

    buildHelpDom: ->
      result = $()
      for help in @ui.children('help')
        result = result.add("<p class=\"echoforms-help\">#{$(help).text()}</>")
      result

    buildDom: ->
      result = super()
      result.find('.echoforms-control-label').after(result.find('.echoforms-help'))
      result

  #####################
  # Reference Controls
  #####################

  # As used, selectrefs turn out to be identical to selects, with valueElementName defaulted to 'value'
  # The lack of reference controls hugely simplifies client code
  class SelectrefControl extends SelectControl
    @selector: 'selectref'

    constructor: (ui, model, controlClasses, resolver) ->
      valueElementName = ui.attr('valueElementName')
      ui.attr('valueElementName', 'value') unless valueElementName?

      super(ui, model, controlClasses, resolver)
