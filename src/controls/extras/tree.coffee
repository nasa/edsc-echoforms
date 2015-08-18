$ = require 'jquery'
Typed = require '../typed.coffee'
TreeItem = require './treeitem.coffee'
Base = require '../base.coffee'

class Tree extends Typed
  @selector: 'tree'

  inputTag: 'div'

  constructor: (ui, model, controlClasses, resolver) ->
    #Need to ensure that ID is unique, including between different copies of the same form which may exist in the same client DOM
    #duplicate IDs break jstree.  however, allow id 'control' through un modified, as this is used in jasmine tests,
    id = ui.attr('id')
    if id and id != 'control'
      id += "-#{Base.echoformsControlUniqueId++}"
      ui.attr('id', id)
    @separator = ui.attr('separator')
    @cascade = if ui.attr('cascade')? then ui.attr('cascade') == "true" else true
    @valueElementName = ui.attr('valueElementName') || 'value'
    @items = for item in ui.children('item')
      new TreeItem($(item), model, controlClasses, resolver, '', @separator, this)
    super(ui, model, controlClasses, resolver)

  validate: ->
    super()
    for item in @items
      item.subtree_handle_relevant_or_required()
    #propagate relevancy/required rules in the ui to the model
    @saveToModel() if @el?

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
    #The commented out section is the 'correct' way to do this, but we need to be able to
    #  get tree selections before the tree is fully loaded into the DOM, in order to ensure
    #  'required' nodes are automatically selected and 'irrelevant' nodes are unselected,
    #  so we will use this  hack
    #@inputs().jstree("get_selected", "full").map (node) ->
    #  if node.li_attr and node.li_attr.node_value and node.li_attr.relevant == 'true'
    #    node.li_attr.node_value
    @inputs().find('a.jstree-clicked').parent().map ->
      node = $(this)
      if node.attr('node_value') and node.attr('relevant') == 'true'
        node.attr('node_value')

  inputAttrs: ->
    $.extend(super(), separator: @separator, cascade: @cascade)

  buildElementsDom: ->
    start = new Date().getTime()
    result = super()
    root = result.children('div')
    root.addClass('jstree')
    root.append('<ul>')
    ul = root.children('ul')
    i = 0
    items = @items
    do () ->
      for j in [i..items.length - 1] by 1
        item = items[j]
        break unless item?
        node = item.buildElementsDom()
        node.appendTo(ul)
        if i < (items.length - 1) and (new Date().getTime() - start > 40)
          console.log ("Tree construction yielding to browser to avoid unresponsive script")
          setTimeout(arguments.callee, 0)
    root.jstree
      checkbox:
        keep_selected_style: false
        three_state: @cascade
      plugins: [ "checkbox" ]
    @tree_root = root
    console.log "Completed building Tree control in " + (new Date().getTime() - start)/1000 + " seconds"

    result

module.exports = Tree
