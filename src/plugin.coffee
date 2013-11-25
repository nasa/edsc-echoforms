$ = require 'jquery'
util = require './util.coffee'
controls = require './controls/index.coffee'
{pluginName} = require './config.coffee'
EchoForm = require './echoform.coffee'

$[pluginName] =
  control: (controlClass, options={}) ->
    EchoForm.registerControl(controlClass)
    $[pluginName]['controls'][controlClass.name] = controlClass if options['export']
    this

  controls: $.extend({}, controls.classes)
  extras: $.extend({}, controls.extras)

$.fn[pluginName] = (args...) ->
  if args.length > 0 && typeof args[0] == 'string'
    # Method call
    [method, args...] = args
    result = @map ->
      form = $.data(this, pluginName)

      if !form
        util.warn "#{pluginName} not found on instance"
        this
      else if /^debug_/.test(method)
        # Calling el.echoforms('debug_attrname') returns the attribute named attrname for
        # debugging purposes
        [x, attr...] = method.split('_')
        form[attr.join('_')]
      else if method == 'destroy'
        $.removeData(this, pluginName)
        form.destroy() if typeof form?.destroy == 'function'
      else if !/^_/.test(method) && typeof form?[method] == 'function'
        # Calling el.echoforms(method, args...) calls the given method passing the given args
        form[method](args...)
      else
        util.error "Could not call #{method} on #{pluginName} instance:", this
        null
    result[0]
  else if args.length < 2
    @each ->
      # Constructor call
      options = args[0]
      # Prevent multiple instantiations
      unless $.data(this, pluginName)?
        $.data(this, pluginName, new EchoForm($(this), options))
  else
    util.error "Bad arguments to #{pluginName}:", args
    this
