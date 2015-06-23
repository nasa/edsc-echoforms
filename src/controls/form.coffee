Grouping = require './grouping.coffee'
util = require '../util.coffee'

class Form extends Grouping
  constructor: (ui, model, controlClasses, resolver) ->
    super(ui, model, controlClasses, resolver)
    @el.bind 'echoforms:modelchange', =>
      @loadFromModel()
      @validate()
    @loadFromModel()
    @validate()

  ref: ->
    @model.children()

  isValid: ->
    @el.find('.echoforms-error:visible').length == 0

  serialize: (options={}) ->
    model = @model.children().clone()
    model.find('*[pruned=true]').remove() if !options.prune? || options.prune == true
    model.find('*:hasNoValue').remove() if !options.prune? || options.prune == true
    #new XMLSerializer().serializeToString(model[0])
    util.printDOMToString(model[0])

module.exports = Form
