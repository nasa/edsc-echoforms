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
    @simplify_output = if ui.attr('simplify_output')? then ui.attr('simplify_output') == "true" else true
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

    #TODO - we really should be using the 'correct' approach mentioned above and storing custoimized info (e.g.
    #'required') in the jstree object rather than using jquery selectors.  Unfortunately, jstree removes hidden
    #nodes from the DOM, so with the current approach we need to ensure that all nodes are expanded at all times
    #which is fairly ugly.

    #Get all nodes which are required, explicitely checked, or implicitely checked (i.e. all children are checked)
    #Explicitly checked or imlicitely checked (i.e. all descendants checked, required, or irrelevant)
    checked = @inputs().find('a.jstree-clicked').parent('[node_value][item-relevant=true][item-required=false]')
    #Required nodes
    required = @inputs().find('li[item-required=true][node_value][item-relevant= true]')
    checked_required_nodes = checked.add(required)

    if @simplify_output
      #Filter values to include only
      #    - 'full parent' nodes (parents whose descendants are all selected [and relevant])
      #    - 'true leaf' nodes (leaves which do not descend from any 'full parent' nodes)
      #Note that irrelevant descendants will cause a node not to be a 'full parent' even if it is rendered as a checked node.
      true_leaves = checked_required_nodes
          .filter('li.jstree-leaf[item-required=true], li.jstree-leaf:has(a.jstree-clicked)') #select clicked or required <li>s
      full_parents = checked_required_nodes
          .filter('li:has(a.jstree-clicked + ul.jstree-children)') #select clicked <li>s which have children
          .not('li:has(li[item-relevant=false])') #remove <li>s with irrelevant descendants
      checked_required_nodes = true_leaves.add(full_parents)
          .not('li.jstree-node > a.jstree-clicked + ul:not(:has(li[item-relevant=false])) > li') #remove any <li>s whose parent is selected AND who do not have any irrelevant cousins

    checked_required_nodes.map ->
      $(this).attr('node_value')

  inputAttrs: ->
    $.extend(super(), separator: @separator, cascade: @cascade)

  buildElementsDom: ->
    console.log "--------- tree buildElementsDom"
    start = new Date().getTime()
    result = super()
    root = result.children('div')

#    searchInput = document.createElement("div")
#    root[0].appendChild(searchInput)

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
      plugins: [ "checkbox", "search" ]
    @tree_root = root
    #prevent closing of tree nodes as they need to stay open in order to be eligible for inclusion in output
#    root.find('i.jstree-ocl').on 'click', (e, data) ->
#      e.stopPropagation()

    result

module.exports = Tree
