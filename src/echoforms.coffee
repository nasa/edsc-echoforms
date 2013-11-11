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

  class EchoFormsInterface
    constructor: (@root, options) ->
      @options = $.extend({}, defaults, options)
      @form = form = @options['form']
      @controlClasses = controlClasses = @options['controls'].concat(defaultControls)

      unless form?
        err "You must specify a 'form' option when creating #{pluginName} instances"

      @resolver = resolver = buildXPathResolverFn(form) #new XPathResolver(form).resolve
      @doc = doc = $(parseXML(form))

      @model = model = doc.find('form > model > instance')
      @ui = ui = doc.find('form > ui')

      @control = new FormControl(ui, model, controlClasses, resolver)
      @root.append(@control.element())
      @control.addedToDom()

    destroy: ->
      @root.removeData(pluginName).empty()

    isValid: ->
      @control.isValid()

    serialize: ->
      @control.serialize()

  controls = {}
  controls[c.name] = c for c in defaultControls

  $[pluginName] =
    control: (controlClass, options={}) ->
      defaultControls.unshift(controlClass)
      controls[controlClass.name] = controlClass if options['export']
      this

    controls: controls

  $.fn[pluginName] = (args...) ->
    if args.length > 0 && typeof args[0] == 'string'
      # Method call
      [method, args...] = args
      result = @map ->
        form = $.data(this, pluginName)

        if !form
          warn "#{pluginName} not found on instance"
          this
        else if /^debug_/.test(method)
          # Calling el.echoforms('debug_attrname') returns the attribute named attrname for
          # debugging purposes
          [x, attr...] = method.split('_')
          form[attr.join('_')]
        else if !/^_/.test(method) && typeof form?[method] == 'function'
          # Calling el.echoforms(method, args...) calls the given method passing the given args
          form[method](args...)
        else
          err "Could not call #{method} on #{pluginName} instance:", this
          null
      result[0]
    else if args.length < 2
      @each ->
        # Constructor call
        options = args[0]
        # Prevent multiple instantiations
        unless $.data(this, pluginName)?
          $.data(this, pluginName, new EchoFormsInterface($(this), options))
    else
      err "Bad arguments to #{pluginName}:", args
      this
