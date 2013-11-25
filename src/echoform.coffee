$ = require 'jquery'
util = require './util.coffee'
controls = require './controls/index.coffee'
FormControl = require './controls/form.coffee'

defaultControls = controls.matchList.concat()

defaults =
  controls: []

class EchoForm
  @registerControl = (controlClass, options={}) ->
    defaultControls.unshift(controlClass)

  constructor: (@root, options) ->
    @options = $.extend({}, defaults, options)
    @form = form = @options['form']
    @controlClasses = controlClasses = @options['controls'].concat(defaultControls)

    unless form?
      util.error "You must specify a 'form' option when creating a new ECHO Forms instance"

    @resolver = resolver = util.buildXPathResolverFn(form)
    @doc = doc = $(util.parseXML(form))

    @model = model = doc.find('form > model > instance')
    @ui = ui = doc.find('form > ui')

    @control = new FormControl(ui, model, controlClasses, resolver)
    @root.append(@control.element())
    @control.addedToDom()

  destroy: ->
    @root.empty()

  isValid: ->
    @control.isValid()

  serialize: ->
    @control.serialize()

module.exports = EchoForm
