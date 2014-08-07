$ = require 'jquery'
Typed = require './typed.coffee'
TreeItem = require './treeitem.coffee'

class Tree extends Typed
  @selector: 'tree'

  inputTag: 'div'

  constructor: (ui, model, controlClasses, resolver) ->
    @separator = ui.attr('separator')
    @cascade = if ui.attr('cascade')? then ui.attr('cascade') == "true" else true
    @valueElementName = ui.attr('valueElementName') || 'value'
    @items = for item in ui.children('item')
      new TreeItem($(item), model, controlClasses, resolver, '', @separator)
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
    #do not support loading from model except on initial load (handled in @buildElementsDom)
    return

  modelValues: ->
    if @valueElementName? and @refExpr?
      #@validate()
      values = for value in @ref().children()
        $(value).text()
      return values
    else
      []

  inputs: () ->
    @el.find('div.jstree')

  inputValue: ->
    @inputs().find('.jstree-clicked').map (node) -> $(this).parent().attr('node_value')

  inputAttrs: ->
    $.extend(super(), separator: @separator, cascade: @cascade)

  buildElementsDom: ->
    result = super()
    root = result.children('div')
    root.addClass('jstree')
    root.append('<ul>')
    ul = root.children('ul')
    for item in @items
      node = item.buildElementsDom()
      node.appendTo(ul)
    model_val = @modelValues()
    if model_val.length > 0
      #select values based on the model value.  This could perform badly
      for node in root.find('li')
        $(node).attr('data-jstree','{"selected":true, "opened":false}') if $(node).attr("node_value") in model_val
    root.jstree
      checkbox:
        keep_selected_style: false
        three_state: @cascade
      plugins: [ "checkbox" ]
    @tree_root = root

    result

module.exports = Tree
