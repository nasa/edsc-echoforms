  # TODO look at optimization / caching
  # TODO Listen to model dom instead of page dom?

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
      @bindEvents()

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
      if @refExpr? then @xpath(@refExpr) else @model

    refValue: ->
      if @refExpr? then $.trim(@ref().text()) else undefined

    inputValue: ->
      console.warn("#{@constructor.name} must override inputValue")

    loadFromModel: ->
      @validate()

    validate: ->
      @relevant(!!@xpath(@relevantExpr)[0]) if @relevantExpr?
      @readonly(!!@xpath(@readonlyExpr)[0]) if @readonlyExpr?

      errors = (c.message for c in @constraints when !c.check(@refValue() ? @inputValue(), @model, @resolver))

      @setErrors(errors)

    saveToModel: ->

    bindEvents: ->

    xpath: (xpath) ->
      # Handle slightly bad expressions received from providers.
      # "[foo=bar]" becomes ".[foo=bar]"
      if xpath?.charAt(0) == '['
        xpath = ".#{xpath}"

      # "true" and "false" become "true()" and "false()"
      return [true] if xpath == "true"
      return [false] if xpath == "false"

      @model.xpath(xpath, @resolver)

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
          @ref().toggleClass('echoforms-pruned', !isRelevant)
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
      root = @buildControlDom()
      root.append(@buildLabelDom())
      root.append(@buildElementsDom())
      root.append(@buildHelpDom())
      root.append(@buildErrorsDom())

      root

  #####################
  # Typed Controls
  #####################

  class TypedControl extends BaseControl
    constructor: (ui, model, controlClasses, resolver) ->
      @inputType = (ui.attr('type') ? 'string').replace(/^.*:/, '').toLowerCase()
      super(ui, model, controlClasses, resolver)

    loadConstraints: ->
      super()
      @constraints.push(new TypeConstraint(@inputType))

    inputs: () ->
      @_inputs ?= @el.find(':input')

    bindEvents: ->
      @inputs().bind('click change', @onChange)

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

    buildElementsChildrenDom: ->
      element = $("<input id=\"#{@id}-element\" type=\"text\" class=\"echoforms-element-input echoforms-element-input-#{@inputType}\" autocomplete=\"off\">")
      element.attr('placeholder', 'MM/DD/YYYYTHH:MM:SS') if @inputType == 'datetime'
      element

  class CheckboxControl extends InputControl
    @selector: 'input[type$=boolean]'

    inputValue:() ->
      @inputs().is(':checked').toString()

    loadFromModel: ->
      super()
      @inputs().attr('checked', @refValue() == 'true') if @refExpr

    buildElementsChildrenDom: ->
      super().attr('type', 'checkbox')

  class OutputControl extends TypedControl
    @selector: 'output'

    constructor: (ui, model, controlClasses, resolver) ->
      @valueExpr = ui.attr('value')
      super(ui, model, controlClasses, resolver)

    inputs: () -> $()

    refValue: ->
      if @valueExpr
        @xpath(@valueExpr)[0]
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
    # TODO: Implement open selects
    @selector: 'select'

    constructor: (ui, model, controlClasses, resolver) ->
      @isOpen = ui.attr('open') == 'true'
      @isMultiple = ui.attr('multiple') == 'true'
      @valueElementName = ui.attr('valueElementName')
      @items = for item in ui.children('item')
        [label, value] = [$(item).attr('label'), $(item).attr('value')]
        [label ? value, value]

      super(ui, model, controlClasses, resolver)

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

  class RangeControl extends InputControl
    @selector: 'range'
    # TODO Implement me
    constructor: (ui, model, controlClasses, resolver) ->
      @start = ui.attr('start')
      @end = ui.attr('end')
      @step = ui.attr('step')
      super(ui, model, controlClasses, resolver)

  class SecretControl extends InputControl
    @selector: 'secret'

    buildElementsChildrenDom: ->
      super().attr('type', 'password')

  class TextareaControl extends TypedControl
    @selector: 'textarea'

    buildElementsChildrenDom: ->
      $("<textarea id=\"#{@id}-element\" class=\"echoforms-element-textarea\" autocomplete=\"off\"/>")

  #####################
  # Grouping Controls
  #####################

  class GroupingControl extends BaseControl
    # TODO Required needs to be ignored
    # TODO read only needs to be inherited
    inputs: () -> $()

    loadFromModel: ->
      super()
      control.loadFromModel() for control in @controls

    buildDom: ->
      root = super
      childModel = @ref()
      ui = @ui
      children = $()
      @controls = controls = []
      for child in ui.children()
        continue if child.nodeName == 'help'
        found = false
        for ControlClass in @controlClasses
          if $(child).is(ControlClass.selector)
            control = new ControlClass($(child), childModel, @controlClasses, @resolver)
            controls.push(control)
            children = children.add(control.el)
            found = true
            break
        console.log("No class available for element:", child) unless found
      root.find('.echoforms-elements').replaceWith($('<div class="echoforms-children"/>').append(children))
      root

  class FormControl extends GroupingControl
    constructor: (ui, model, controlClasses, resolver) ->
      ui.attr('ref', model.children()[0].nodeName)
      super(ui, model, controlClasses, resolver)
      @loadFromModel()

    bindEvents: ->
      @el.on 'echoforms:modelchange', '.echoforms-control', =>
        @loadFromModel()

  class GroupControl extends GroupingControl
    @selector: 'group'
    # TODO Headers and footers

  class RepeatInstanceControl extends GroupingControl
    # TODO Implement me

  class RepeatTemplateControl extends GroupingControl
    @selector: 'template'
    # TODO Implement me

    buildDom: ->
      $()

    loadFromModel: ->


  class RepeatControl extends GroupingControl
    @selector: 'repeat'
    # TODO Implement me
    constructor: (ui, model, controlClasses, resolver) ->
      @minItems = ui.attr('minItems')
      @minItems = parseInt(@minItems, 10) if @minItems
      @maxItems = ui.attr('maxItems')
      @maxItems = parseInt(@maxItems, 10) if @maxItems
      super(ui, model, controlClasses, resolver)

    loadConstraints: ->
      super()
      @constraints.push(new MinItemsConstraint(@minItems)) if @minItems?
      @constraints.push(new MaxItemsConstraint(@maxItems)) if @maxItems?


  #####################
  # Reference Controls
  #####################

  class ReferenceControl extends BaseControl
    constructor: (ui, model, controlClasses, resolver) ->
      @idref = ui.attr('idref')
      super(ui, model, controlClasses, resolver)

  class ControlrefControl extends ReferenceControl
    @selector: 'controlref'
    # TODO Implement me

  class SelectrefControl extends ReferenceControl
    @selector: 'selectref'
    # TODO Implement me

    constructor: (ui, model, controlClasses) ->
      @isOpen = ui.attr('open') == 'true'
      @isMultiple = ui.attr('multiple') == 'true'
      @valueElementName = ui.attr('valueElementName')
      @items = for item in ui.children('item')
        [label, value] = [$(item).attr('label'), $(item).attr('value')]
        [label ? value, value]

  defaultControls = [
    # Typed controls
    CheckboxControl, InputControl,
    UrlOutputControl, OutputControl,
    SelectControl,
    RangeControl,
    SecretControl,
    TextareaControl,

    # Grouping controls
    GroupControl,
    RepeatControl, RepeatTemplateControl,

    # Reference controls
    ControlrefControl,
    SelectrefControl,
    ]
