$ = require 'jquery'
Typed = require './typed.coffee'

class Select extends Typed
  @selector: 'select'

  inputTag: 'select'

  constructor: (ui, model, controlClasses, resolver) ->
    @isMultiple = ui.attr('multiple') == 'true'
    @valueElementName = ui.attr('valueElementName')
    @items = for item in ui.children('item')
      [label, value] = [$(item).attr('label'), $(item).attr('value')]
      [label ? value, value]

    super(ui, model, controlClasses, resolver)

  valueElementTagName: (root=@ref()) ->
    nameParts = [@valueElementName]
    #Get namespace only if it exists
    ns = root[0].nodeName.split(':').shift() if /:/.test(root[0].nodeName)
    nameParts.unshift(ns) if ns?
    nameParts.join(':')

  refValue: ->
    if @valueElementName? and @refExpr?
      $(child).text() for child in @ref().children()
    else
      super()

  saveToModel: ->
    if @valueElementName? and @refExpr?
      root = @ref().empty()
      tagname = @valueElementTagName(root)
      for value in @inputValue()
        element = document.createElementNS(root[0].namespaceURI, tagname)
        node = $(element).text(value)
        root.append(node)
        node[0].namespaceURI = root[0].namespaceURI
    else
      super()

  loadFromModel: ->
    if @valueElementName? and @refExpr?
      @validate()
      value = ($(node).text() for node in @ref().children())
      value = value[0] unless @isMultiple
      @inputs().val(value)
    else
      super()

  inputValue: ->
    result = @inputs().val()
    if @valueElementName? and !(result instanceof Array)
      result = if result? && result != '' then [result] else []
    result

  inputAttrs: ->
    $.extend(super(), multiple: @isMultiple)

  buildElementsDom: ->
    result = super()
    el = result.children('select')
    el.append('<option value=""> -- Select a value -- </option>') unless @multiple
    for [label, value] in @items
      $('<option>', value: value).text(label).appendTo(el)
    result

module.exports = Select
