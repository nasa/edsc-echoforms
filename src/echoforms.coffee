  # Create the defaults once
  pluginName = "echoforms"
  defaults =
    controls: []

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

    # Reference controls
    SelectrefControl
    ]

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

      @namespaces = namespaces

    resolve: (prefix) =>
      @namespaces[prefix ? " default "]

  class EchoFormsInterface
    constructor: (@root, options) ->
      @options = $.extend({}, defaults, options)
      @form = form = @options['form']
      @controlClasses = controlClasses = @options['controls'].concat(defaultControls)

      unless form?
        error "You must specify a 'form' option when creating an echoforms instance"

      @resolver = resolver = new XPathResolver(form).resolve
      @doc = doc = $(parseXML(form))

      @model = model = doc.find('form > model > instance')
      @ui = ui = doc.find('form > ui')

      #xml2 = $('<div/>').append(doc.find('form > model > instance').children()).html()
      #@resolver = resolver = new XPathResolver(xml2).resolve
      #console.log xml2
      #@model = model = $(parseXML(form))

      @control = new FormControl(ui, model, controlClasses, resolver)
      @root.append(@control.element())

    destroy: ->
      @root.removeData('echoforms').empty()

    isValid: ->
      @control.isValid()

    serialize: ->
      @control.serialize()

  $.fn[pluginName] = (args...) ->
    if args.length > 0 && typeof args[0] == 'string'
      # Method call
      [method, args...] = args
      result = @map ->
        form = $.data(this, "echoforms")

        if !form
          warn "ECHO Form not found on instance"
          this
        else if /^debug_/.test(method)
          [x, attr...] = method.split('_')
          form[attr.join('_')]
        else if !/^_/.test(method) && typeof form?[method] == 'function'
          form[method](args...)
        else
          err "Could not call #{method} on echoforms instance:", this
          null
      result[0]
    else if args.length < 2
      @each ->
        # Constructor call
        options = args[0]
        # Prevent multiple instantiations
        if !$.data(this, "echoforms")
          $.data(this, "echoforms", new EchoFormsInterface($(this), options))
    else
      err "Bad arguments to echoforms:", args
      this

  $(document).ready ->
    #formatXml = (xml) ->
    #  xml.replace(/\s+/g, ' ').replace(/> </g, '>\n<')

    #$(document).bind 'echoforms:instanceChange', (event, instance) ->
    #  $('#debug').text(formatXml(instance.serialize()))
