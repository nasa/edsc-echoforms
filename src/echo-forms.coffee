  # Create the defaults once
  pluginName = "echoform"
  defaults =
    controls: []

  # Encapsulates a model instance in an echo forms document.  Provides
  # methods which allow us to manipulate the model using xpaths
  class EchoForm
    constructor: (xml) ->
      @document = xmlParse(xml)
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

  class XPathResolver
    constructor: (xml) ->
      namespaces = {}

      namespaceRegexp = /\sxmlns(?::(\w+))?=\"([^\"]+)\"/g
      match = namespaceRegexp.exec(xml)
      while match?
        name = match[1] ? ' default '
        uri = match[2]
        namespaces[name] = uri
        match = namespaceRegexp.exec(xml)

      # We need these
      namespaces['xs'] = 'http://www.w3.org/2001/XMLSchema'
      namespaces['echoforms'] = 'http://echo.nasa.gov/v9/echoforms'

      @namespaces = namespaces

    resolve: (prefix) =>
      prefix = " default " unless prefix?
      result = @namespaces[prefix]
      unless result
        console.log "Bad prefix: #{prefix}.  Ignoring."
        prefix = " default "
      result

  class EchoFormsBuilder
    @uniqueId: 0

    constructor: (xml, @controlClasses) ->
      @resolver = new XPathResolver(xml).resolve

      doc = $($.parseXML(xml))
      @model = model = doc.xpath('//echoforms:form/echoforms:model/echoforms:instance', @resolver)
      @ui = ui = doc.xpath('//echoforms:form/echoforms:ui', @resolver)

      # DELETE ME
      window.ui = ui
      window.model = model
      window.resolver = @resolver

      @control = new FormControl(ui, model, @controlClasses, @resolver)

    element: ->
      @control.element()


  class EchoFormsInterface
    @inputTimeout: null

    constructor: (@root, options) ->
      @options = $.extend({}, defaults, options)
      @controlClasses = @options['controls'].concat(defaultControls)
      @_defaults = defaults
      @_name = pluginName

      @root = root = $(root)

      # root.data('echoformsInterface', this)
      # root.bind('echoforms:refresh', @waitThenRefresh)
      # root.submit(@_onSubmit)
      # TODO Is this needed?  Looks like testing code
      # root.closest('form#form-test').submit(@_onSubmit)

      @builder = new EchoFormsBuilder(root.find('.echoforms-xml').text(), @controlClasses)
      root.append(@builder.element())
      # @instance = new EchoForm(root.find('.echoforms-xml').text())
      # @initializeInstance(root)

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