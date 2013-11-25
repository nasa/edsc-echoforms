$ = require 'jquery'
Base = require './base.coffee'
TypeConstraint = require '../constraints/type.coffee'

class Typed extends Base
  constructor: (ui, model, controlClasses, resolver) ->
    @inputType = (ui.attr('type') ? 'string').replace(/^.*:/, '').toLowerCase()
    super(ui, model, controlClasses, resolver)
    @inputs().bind('click change', @onChange)

  loadConstraints: ->
    super()
    @constraints.push(new TypeConstraint(@inputType))

  inputs: () ->
    @_inputs ?= @el.find(':input')

  inputValue:() ->
    $.trim(@inputs().val())

  inputAttrs: ->
    id: "#{@id}-element"
    class: "echoforms-element-#{@inputElementType ? @inputClass ? @ui[0].nodeName}"
    autocomplete: "off"

  saveToModel: ->
    super()
    @ref().text(@inputValue()) if @refExpr

  loadFromModel: ->
    super()
    @inputs().val(@refValue()) if @refExpr

  buildDom: ->
    super().addClass('echoforms-typed-control')

  buildElementsDom: ->
    super().append($("<#{@inputTag}>", @inputAttrs()))

module.exports = Typed
