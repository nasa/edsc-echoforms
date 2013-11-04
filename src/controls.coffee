  # TODO look at optimization / caching

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

    isRelevant: ->
      if @relevantExpr? then @xpath(@relevantExpr) else true

    isRequired: ->
      if @requiredExpr? then @xpath(@requiredExpr) else false

    isReadonly: ->
      if @readonlyExpr? then @xpath(@readonlyExpr) else false

    ref: ->
      if @refExpr? then @xpath(@refExpr) else @model

    refValue: ->
      if @refExpr? then @ref().text().trim() else ""

    inputValue: ->
      console.warn("#{@constructor.name} must override inputValue")

    loadFromModel: ->
      console.warn("#{@constructor.name} must override loadFromModel")

    saveToModel: ->
      console.warn("#{@constructor.name} must override saveToModel")

    bindEvents: ->

    xpath: (xpath) ->
      @model.xpath(xpath, @resolver)

    element: ->
      @el ?= @buildDom()

    isChanged: (newValue) ->
      @refValue().toString().trim() != @inputValue().toString().trim()

    changed: () =>
      console.log('triggering on', @el)
      @el.trigger('echoforms:modelchange')

    inputSelector: ':input'

    inputs: () ->
      @_inputs ?= @el.find(@inputSelector)

    relevant: (arg) ->
      if arg?
        isRelevant = !!arg
        if isRelevant != @relevant()
          @el.toggleClass('echoforms-irrelevant', !isRelevant)
          @el.toggle(isRelevant)
      else
        !el.hasClass('echoforms-irrelevant')

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

    value: (arg) ->
      if arg?
        if @isChanged()
          @setValue(arg)
          @changed(arg)
      else
        @getValue()

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

    buildElementsChildrenDom: ->
      $()

    buildDom: ->
      root = @buildControlDom()
      root.append(@buildLabelDom())
      root.append(@buildElementsDom())
      root.append(@buildHelpDom())

      root

  #####################
  # Typed Controls
  #####################

  class TypedControl extends BaseControl
    constructor: (ui, model, controlClasses, resolver) ->
      @inputType = (ui.attr('inputType') ? 'string').replace(/^.*:/, '').toLowerCase()
      super(ui, model, controlClasses, resolver)

    loadConstraints: ->
      super()
      @constraints.push(new TypeConstraint(@inputType))

    bindEvents: ->
      @inputs().bind('click change', @onChange)

    inputValue:() ->
      @inputs().val()

    saveToModel: ->
      @ref().text(@inputValue())

    loadFromModel: ->
      @inputs().val(@refValue())

    getValue: () ->
      @inputs().val()

    setValue: (value) ->
      @inputs().val(value)

  class InputControl extends TypedControl
    @selector: 'input'

    buildElementsChildrenDom: ->
      element = $("<input id=\"#{@id}-element\" type=\"text\" class=\"echoforms-element-input echoforms-element-input-#{@inputType}\" autocomplete=\"off\">")
      element.attr('placeholder', 'MM/DD/YYYY HH:MM:SS') if @inputType == 'datetime'
      element

  class CheckboxControl extends InputControl
    @selector: 'input[type$=boolean]'

    inputSelector: ':checkbox'

    loadFromModel: ->
      @inputs().attr('checked', @refValue().toString().trim() == 'true')

    getValue: () ->
      @inputs().is(':checked')

    setValue: (value) ->
      @inputs().attr('checked', value.toString().trim() == 'true')

    buildElementsChildrenDom: ->
      super().attr('type', 'checkbox')

  class OutputControl extends TypedControl
    @selector: 'output'

    constructor: (ui, model, controlClasses, resolver) ->
      @valueExpr = ui.attr('value')
      super(ui, model, controlClasses, resolver)

    inputs: () -> $()

    getValue: () ->
      @el.find('.echoforms-elements > p').text()

    setValue: (value) ->
      @el.find('.echoforms-elements > p').text(value)

    buildElementsChildrenDom: ->
      $('<p/>')

  class UrlOutputControl extends OutputControl
    @selector: 'input[type$=anyURI], input[type$=anyuri]'

    getValue: () ->
      @el.find('.echoforms-elements > a').text()

    setValue: (value) ->
      @el.find('.echoforms-elements > a').text(value).attr('href', value)

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

    getValue: () ->
      if @el.data('echoformsRef')
        # FIXME this shouldn't really be referencing the form if possible
        # FIXME instanceValue needs to be updated to use jQuery data attributes
        ui = @el.closest('.echoforms-echoform').data('echoformsInterface')
        ui.instanceValue(@el, 'echoformsRef')

    loadFromModel: ->
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
