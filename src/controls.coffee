  echoformsControlUniqueId = 0

  class BaseEchoFormsControl
    # TODO caching opportunities
    constructor: (@ui, @model, @controlClasses) ->
      @refExpr = ui.attr('ref')
      @relevantExpr = ui.attr('relevant')
      @requiredExpr = ui.attr('required')
      @readonlyExpr = ui.attr('readonly')
      @el = @buildDom()
      # TODO Not fantastic performance here
      @inputs().bind('click change', @onChange)

    element: ->
      @el ?= @buildDom()

    isChanged: (newValue) ->
      @getValue().toString().trim() != newValue.toString().trim()

    changed: (newValue) =>
      @el.trigger('echoforms:controlchange', @el, this, newValue)

    inputSelector: ':input'

    inputs: () ->
      @inputs ?= @el.find(@inputSelector)

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

    getValue: () ->

    setValue: () ->

    onChange: (e) =>
      @changed(@getValue())

    id: () ->
      @_id ?= @ui.attr('id') ? "echoforms-control-#{echoformsControlUniqueId++}"

    buildLabelDom: ->
      label = @ui.attr('label')
      if label?
        $("<label class=\"echoforms-control-label\" for=\"#{@id()}-element\">#{label}</label>")
      else
        $()

    buildHelpDom: ->
      result = $()
      for help in @ui.children('help')
        result = result.add("<label class=\"echoforms-help\" for=\"#{@id()}-element\">#{$(help).text()}</label>")
      result

    buildControlDom: ->
      $("<div id=\"#{@id()}\" class=\"echoforms-control echoforms-control-#{@ui[0].nodeName}\"/>")

    buildElementsDom: ->
      $('<div class="echoforms-elements"/>')

    buildDom: ->
      root = @buildControlDom()
      root.append(@buildLabelDom())
      root.append(@buildElementsDom())
      root.append(@buildHelpDom())

      root

  class EchoFormsContainerControl extends BaseEchoFormsControl
    inputs: () -> $()

    getValue: () ->
      if @el.data('echoformsRef')
        # FIXME this shouldn't really be referencing the form if possible
        # FIXME instanceValue needs to be updated to use jQuery data attributes
        ui = @el.closest('.echoforms-echoform').data('echoformsInterface')
        ui.instanceValue(@el, 'echoformsRef')

    buildDom: ->
      root = super
      model = @model
      ui = @ui
      children = $()
      @controls = controls = []
      for child in ui.children()
        found = false
        for ControlClass in @controlClasses
          if $(child).is(ControlClass.selector)
            control = new ControlClass($(child), model, @controlClasses)
            controls.push(control)
            children = children.add(control.el)
            found = true
            break
        console.log("No class available for element:", child) unless found
      root.find('.echoforms-elements').replaceWith($('<div class="echoforms-children"/>').append(children))
      root


  class EchoFormsFormControl extends EchoFormsContainerControl

  class EchoFormsGroupControl extends EchoFormsContainerControl
    @selector: 'group'

  class EchoFormsRepeatControl extends EchoFormsContainerControl
    @selector: 'repeat'
    # TODO Implement me
    # TODO Attrs template, minItems, maxItems

  class EchoFormsOutputControl extends BaseEchoFormsControl
    # TODO Implement DOM
    # TODO Attrs value
    @selector: 'output'

    inputs: () -> $()

    getValue: () ->
      @el.find('.elements > a, .elements p').text()

    setValue: (value) ->
      outputEl = @el.find('.elements > a, .elements p')
      outputEl.attr('href', value) if outputEl.is('a')
      outputEl.text(value)

  class EchoFormsInputControl extends BaseEchoFormsControl
    @selector: 'input'

    getValue: () ->
      @inputs().val()

    setValue: (value) ->
      @inputs().val(value)

    inputType: ->
      @_inputType ?= (@ui.attr('type') ? '').replace(/^.*:/, '').toLowerCase()

    buildElementsDom: ->
      inputType = @inputType()
      element = "<input id=\"#{@id()}\" type=\"text\" class\"echoforms-element-input echoforms-element-input-#{inputType}\" autocomplete=\"off\">"
      element.attr('placeholder', 'MM/DD/YYYY HH:MM:SS') if inputType == 'datetime'
      super().append(element)

  class EchoFormsCheckboxControl extends EchoFormsInputControl
    @selector: 'input[type=xsd\\:boolean], input[type=xs\\:boolean]'

    inputSelector: ':checkbox'

    getValue: () ->
      @inputs().is(':checked')

    setValue: (value) ->
      @inputs().attr('checked', value.toString() == true)

    buildElementsDom: ->
      result = super()
      result.children('input').attr('type', 'checkbox')
      result

  class EchoFormsSecretControl extends BaseEchoFormsControl
    @selector: 'secret'
    # TODO Implement me

  class EchoFormsTextareaControl extends BaseEchoFormsControl
    @selector: 'textarea'
    # TODO Implement me

  class EchoFormsSelectControl extends BaseEchoFormsControl
    @selector: 'select'
    # TODO Implement me
    # TODO Attrs open, valueElementName, multiple

  class EchoFormsControlrefControl extends BaseEchoFormsControl
    @selector: 'controlref'
    # TODO Implement me
    # TODO Attrs idref

  class EchoFormsSelectrefControl extends BaseEchoFormsControl
    @selector: 'selectref'
    # TODO Implement me
    # TODO Attrs item, idref

  class EchoFormsRangeControl extends BaseEchoFormsControl
    @selector: 'range'
    # TODO Implement me
    # TODO Attrs start, end, step

  defaultControls = [
    EchoFormsGroupControl,
    EchoFormsRepeatControl,
    EchoFormsOutputControl,
    EchoFormsSecretControl,
    EchoFormsTextareaControl,
    EchoFormsSelectControl,
    EchoFormsSelectrefControl,
    EchoFormsControlrefControl,
    EchoFormsRangeControl,
    EchoFormsCheckboxControl,
    EchoFormsInputControl
    ]
