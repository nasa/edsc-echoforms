  # Create the defaults once
  pluginName = "echoform"
  defaults =
    controls: []

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
        warn "Bad prefix: #{prefix}.  Ignoring."
        prefix = " default "
      result

  class EchoFormsInterface
    constructor: (@root, options) ->
      @options = $.extend({}, defaults, options)
      @form = form = @options['form']
      @controlClasses = controlClasses = @options['controls'].concat(defaultControls)

      unless form?
        error "You must specify a 'form' option when creating an echoform instance"

      @resolver = resolver = new XPathResolver(form).resolve
      @doc = doc = $(parseXML(form))
      @model = model = doc.find('form > model> instance')
      @ui = ui = doc.find('form > ui')

      @control = new FormControl(ui, model, controlClasses, resolver)
      @root.append(@control.element())

    destroy: ->
      @root.removeData('echoform').empty()

    isValid: ->
      @control.isValid()

    serialize: ->
      @control.serialize()

  $.fn[pluginName] = (args...) ->
    if args.length > 0 && typeof args[0] == 'string'
      # Method call
      [method, args...] = args
      result = @map ->
        form = $.data(this, "echoform")

        if /^debug_/.test(method)
          [x, attr...] = method.split('_')
          form[attr.join('_')]
        else if !/^_/.test(method) && typeof form?[method] == 'function'
          form[method](args...)
        else
          err "Could not call #{method} on echoform instance:", this
          null
      result[0]
    else if args.length < 2
      @each ->
        # Constructor call
        options = args[0]
        # Prevent multiple instantiations
        if !$.data(this, "echoform")
          $.data(this, "echoform", new EchoFormsInterface($(this), options))
    else
      err "Bad arguments to echoform:", args
      this

  $(document).ready ->
    #formatXml = (xml) ->
    #  xml.replace(/\s+/g, ' ').replace(/> </g, '>\n<')

    #$(document).bind 'echoforms:instanceChange', (event, instance) ->
    #  $('#debug').text(formatXml(instance.serialize()))
