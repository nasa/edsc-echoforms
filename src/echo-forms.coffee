# Note that when compiling with coffeescript, the plugin is wrapped in another
# anonymous function. We do not need to pass in undefined as well, since
# coffeescript uses (void 0) instead.
do ($ = jQuery, window, document) ->

  # Needed for IE < 8 compatibility.  This is defined in 1.8.1
  String.prototype.trim ?= -> this.replace(/^\s*/, "").replace(/\s*$/, "");

  isFunction = (obj) ->
    !!(object && getClass.call(object) == '[object Function]')

  nearest = (el, selector) ->
    $(el).find(selector).filter ->
      !$(this).parentsUntil(el, selector).length


  defaultControls = [
    EchoFormsContainerControl,
    EchoFormsCheckboxControl,
    EchoFormsOutputControl,
    EchoFormsDefaultControl
    ]

  # Create the defaults once
  pluginName = "echoform"
  defaults =
    controls: []

  # Encapsulates a model instance in an echo forms document.  Provides
  # methods which allow us to manipulate the model using xpaths
  class EchoForm
    constructor: (xml) ->
      console.log(xml)
      @document = xmlParse(xml)
      console.log(@document)
      @root = @document.firstChild
      @root.prefixElements()
      $(document).trigger('echoforms:instanceChange', this)

    find: (parent, xpath) ->
      context = new ExprContext(parent ? @root)
      xpathParse(xpath).evaluate(context).value

    update: (parent, xpath, valueElement, value) ->
      valueElement = @namespace(parent, valueElement) if valueElement?
      nodes = if xpath then @find(parent, xpath) else [parent]

      node.setValues(value, valueElement) for node in nodes
      $(document).trigger('echoforms:instanceChange', this)

    namespace: (parentNode, childName) ->
      childNode = XNode.create(DOM_ELEMENT_NODE, childName, null, null)
      unless childNode.getNamespacePrefix()?
        childNode.setNamespacePrefix(parentNode.getNamespacePrefix())
      childNode.nodeName

    prune: (parent, xpath) ->
      XNode.removeAll(@find(parent, xpath))

    serialize: ->
      xmlText(@document)


  class BaseEchoFormsControl
    # TODO caching opportunities
    constructor: (@el) ->
      # TODO Not fantastic performance here
      @inputs().bind('click change', onChange)

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
          el.toggleClass('echoforms-irrelevant', !isRelevant)
          el.toggle(isRelevant)
      else
        !el.hasClass('echoforms-irrelevant')

    readonly: (arg) ->
      if arg?
        isReadonly = !!arg
        if isReadonly != @readonly()
          el.toggleClass('echoforms-readonly ui-state-disabled', isReadonly)
          @updateReadonly(isReadonly)
      else
        el.hasClass('echoforms-readonly')

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

  class EchoFormsContainerControl extends BaseEchoFormsControl
    @selector: '.echoforms-group, .echoforms-repeat'

    inputs: () -> $()

    getValue: () ->
      if @el.data('echoformsRef')
        # FIXME this shouldn't really be referencing the form if possible
        # FIXME instanceValue needs to be updated to use jQuery data attributes
        ui = @el.closest('.echoforms-echoform').data('echoformsInterface')
        ui.instanceValue(@el, 'echoformsRef')

  class EchoFormsCheckboxControl extends BaseEchoFormsControl
    @selector: '.echoforms-control-checkbox'

    inputSelector: ':checkbox'

    getValue: () ->
      @inputs().is(':checked')

    setValue: (value) ->
      @inputs().attr('checked', value.toString() == true)

  class EchoFormsOutputControl extends BaseEchoFormsControl
      @selector: '.echoforms-control-output'

      inputs: () -> $()

      getValue: () ->
        @el.find('.elements > a, .elements p').text()

      setValue: (value) ->
        outputEl = @el.find('.elements > a, .elements p')
        outputEl.attr('href', value) if outputEl.is('a')
        outputEl.text(value)

  class EchoFormsDefaultControl extends BaseEchoFormsControl
    @selector: '.echoforms-control'

    getValue: () ->
      @inputs().val()

    setValue: (value) ->
      @inputs().val(value)

  class BaseEchoFormsConstraint
    constructor: (@attrs) ->

    message: -> @attrs.alert

  class EchoFormsInterface
    @inputTimeout: null

    constructor: (@root, options) ->
      @options = $.extend({}, defaults, options)
      @controlClasses = @options['controls'].concat(defaultControls)
      @_defaults = defaults
      @_name = pluginName

      @root = root = $(root)

      root.data('echoformsInterface', this)
      root.bind('echoforms:refresh', @waitThenRefresh)
      root.submit(@_onSubmit)
      # TODO Is this needed?  Looks like testing code
      root.closest('form#form-test').submit(@_onSubmit)

      @instance = new EchoForm(root.find('.echoforms-model').text())
      @initializeInstance(root)

    initializeInstance: (localRoot, refresh) ->
      # FIXME Reverb does styling stuff and control initialization here.
      # It'll need a callback for that.

      @refresh()

      self = this

      controls = localRoot.find('.echoforms-control')
      controls.each ->
        el = $(this)
        unless el.data('echoformsControl')
          for ControlClass in self.controlClasses
            if el.is(ControlClass.selector)
              if isFunction(ControlClass)
                el.data('echoformsControl', new ControlClass(el))
              else
                el.data('echoformsControl', new Object(ControlClass))
              break

      controls.bind('echoforms:controlchange', @_onControlChange)

      @root.trigger('echoforms:instanceInitialized', localRoot)

    _onControlChange: (e, el, control, newValue) =>
      context = @instanceContext(el)
      # TODO valueElementName?  Why is it no longer used?
      @instance.update(context, el.data('echoformsRef'), null, newValue)
      el.addClass('echoforms-updating')
      @waitThenRefresh()

    _waitThenRefresh: ->
      clearTimeout(EchoFormInterface.inputTimeout)
      timeoutfn =
        "$('.echoform:visible').each(function() {" +
        "   $(this).data('echoformsUi').refresh();" +
        "});"
      EchoFormInterface.inputTimeout = setTimeout(timeoutfn, 500)

    _onSubmit: (e) =>
      @refresh()
      if @root.hasClass('echoforms-invalid')
        message = 'Please correct errors identified in bold before ' +
          'submitting the form'
        @root.find('.echoforms-alert').text(message).show()
        e.preventDefault()
        return false
      else
        # TODO: I don't like how this works.  We clone the instance,
        # destroy the existing one, then set the instance to the cloned
        # one.  Why not destroy the clone?
        instance = new EchoForm(@instance.serialize())
        self = this
        @root.find('.echoforms-irrelevant').each ->
          el = $ this
          @instance.prune(self.instanceContext(el), el.data('echoformsRef'))
        @root.find('.model').val(@instance.serialize())
        @instance = instance

    refresh: ->
      # TODO Repeats need to update their data-ref attr here
      @root.trigger('echoforms:beforerefresh', this)

      self = this
      @root.find('.echoforms-control').each ->
        el = $(this)
        control = $(this).data('echoformsControl')
        if control?
          control.value(self.instanceValue(el, 'echoformsRef'))
          isRelevant = @instanceValue(el, 'echoformsRelevant', default: true)
          control.relevant(isRelevant)
          isReadonly = @instanceValue(el, 'echoformsReadonly', default: false)
          control.readonly(isReadonly)

      @root.trigger('echoforms:refresh', this)


    validate: ->
      console.log("TODO: Validations")

    # el is assumed to be an echoforms-control
    instanceContext: (el) ->
      refParent = el.parentsUntil('echoform', '[data-echoforms-ref]').first()
      if refParent.length > 0
        @instanceXPath(refParent, 'echoformsRef')[0]
      else
        @instance.root

    instanceXPath: (el, xpathAttr) ->
      xpath = el.data(xpathAttr)
      return null unless xpath?

      context = @instanceContext(el)
      @instance.find(context, xpath)

    instanceValue: (el, xpathAttr, options={}) ->
      result = @instanceXPath(el, xpathAttr)
      if result instanceof Array
        result = result[0].getValues(el.data('echoformsValueElementName'))
      result ? options['default']

  # A really lightweight plugin wrapper around the constructor,
  # preventing against multiple instantiations
  $.fn[pluginName] = (options) ->
    @each ->
    if !$.data(this, "echoformsInterface")
      $.data(this, "echoformsInterface", new EchoFormsInterface(this, options))

  $(document).ready ->
    formatXml = (xml) ->
      xml.replace(/\s+/g, ' ').replace(/> </g, '>\n<')

    $(document).bind 'echoforms:instanceChange', (event, instance) ->
      $('#debug').text(formatXml(instance.serialize()))