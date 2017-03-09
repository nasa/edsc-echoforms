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
    allTreeItems = @tree_root.jstree('get_json', '#', {flat: true}).map ((node) => @tree_root.jstree('get_node', node.id))
      .reduce((hash, obj) -> # Grab a little performance gain by looking a tree item up from a hash using its id in @handle_relevant_or_required.
        hash[obj.id] = obj
        hash
      , {})

    for item in @items
      item.subtree_handle_relevant_or_required(allTreeItems)
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
    #Get all nodes which are required, explicitely checked, or implicitely checked (i.e. all children are checked)
    #Explicitly checked or imlicitely checked (i.e. all descendants checked, required, or irrelevant)
    all_nodes = @inputs().jstree('get_json', '#', {flat: true}).map (node) =>
      @inputs().jstree('get_node', node.id)

    checked = all_nodes.filter (node) ->
      node.state.selected && node.li_attr.node_value?.length > 0 && node.li_attr['item-relevant'] == 'true'

    required = all_nodes.filter (node) ->
      node.li_attr['item-relevant'] == 'true' && node.li_attr['item-required'] == 'true' && node.li_attr.node_value?.length > 0 && node.children.length == 0

    checked_required_nodes = @_removeDupNodes([checked..., required...])

    if @simplify_output
      #Filter values to include only
      #    - 'full parent' nodes (parents whose descendants are all selected [and relevant])
      #    - 'true leaf' nodes (leaves which do not descend from any 'full parent' nodes)
      #Note that irrelevant descendants will cause a node not to be a 'full parent' even if it is rendered as a checked node.

      #select clicked or required <li>s
      true_leaves = checked_required_nodes.filter (node) ->
        node.children.length == 0 && node.state.selected || node.li_attr['item-required'] == 'true'

      #select clicked <li>s which have children
      #remove <li>s with irrelevant descendants
      full_parents = checked_required_nodes.filter (node) =>
        checked_children = node.children.filter (child_id) =>
          child = @inputs().jstree('get_node', child_id)
          selected_and_relevant = child.state.selected && child.li_attr['item-relevant'] == 'true'
          has_irrelevant_descendants = @_hasIrrelevantDescendants(child)
          selected_and_relevant && !has_irrelevant_descendants
        node.children.length > 0 && checked_children.length == node.children.length

      #remove any <li>s whose parent is selected AND who do not have any irrelevant cousins
      checked_required_nodes = [true_leaves..., full_parents...].filter (node) =>
        parent = @inputs().jstree('get_node', node.parent)
        return true if parent.id == '#'
        return true unless parent.state.selected
        for sibling_id in parent.children when sibling_id != node.id
          sibling = @inputs().jstree('get_node', sibling_id)
          if sibling.state.selected
            if sibling.li_attr['item-relevant'] == 'true'
              return @_hasIrrelevantDescendants(sibling)
            else
              return true
          else
            return true
        false

    checked_required_nodes = @_removeDupNodes(checked_required_nodes)
    checked_required_nodes.map (node)->
      node.li_attr.node_value

  _hasIrrelevantDescendants: (node) ->
    for child_id in node.children
      child = @inputs().jstree('get_node', child_id)
      if child.children.length == 0
        if child.li_attr['item-relevant'] == 'false'
          return true
      else
        return @_hasIrrelevantDescendants(child)
    return false

  _removeDupNodes: (arr) ->
    results = {}
    results[arr[key].id] = arr[key] for key in [0...arr.length]
    value for key, value of results


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

    timer = false
    
    root.jstree
      checkbox:
        keep_selected_style: false
        three_state: @cascade
      search:
        fuzzy: false
      plugins: [ "checkbox", "search" ]
    .on 'ready.jstree', ->
      rootBandId = root.find('li').first().attr('id')
      root.jstree('close_all').jstree('open_node', rootBandId)
      bandsCountId = $(this).attr('id') + "-bands-count"
      bandsFilterId = $(this).attr('id') + "-bands-filter" 
      selectedBandsId = $(this).attr('id') + "-selected-bands-count"
      totalCount = root.jstree('get_json', '#', flat: true).length
      checkedCount = root.jstree('get_checked').length
      root.prepend('<i class="jstree-spinner fa fa-spinner fa-spin fa-fw" style="display: none"></i>')
      root.prepend("<div id='#{bandsCountId}' class='bands-count'><span id='#{selectedBandsId}' class='selected-bands-count'>#{checkedCount} of #{totalCount}</span> bands selected</div>")
      root.prepend("<input id='#{bandsFilterId}' class='bands-filter' placeholder='Filter bands here'></input>")
    .on 'changed.jstree', ->
      totalCount = root.jstree('get_json', '#', flat: true).length
      checkedCount = root.jstree('get_checked').length
      bandsCountId =  $(this).attr('id') + "-bands-count"
      selectedBandsId = $(this).attr('id') + "-selected-bands-count" 
      $('#' + bandsCountId).html("<div id='#{bandsCountId}' class='bands-count'><span id='#{selectedBandsId}' class='selected-bands-count'>#{checkedCount} of #{totalCount}</span> bands selected</div>")
    .on 'keyup', '#' + $(this).attr('id') + "-bands-filter", ->
      clearTimeout(timer) if timer
      timer = setTimeout (->
        text = $('#' + bandsFilterId).val()
        root.jstree('search', text) if text.length > 1), 250
    .on 'before_open.jstree', ->
      $('.jstree-spinner').show()
    .on 'after_open.jstree', ->
      $('.jstree-spinner').hide()

    @tree_root = root

    result

module.exports = Tree
