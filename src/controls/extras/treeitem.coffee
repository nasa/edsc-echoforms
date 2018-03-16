$ = require 'jquery'
util = require '../../util.coffee'
#Base = require './base.coffee'

class TreeItem #extends Base
  @selector: 'item'

  inputTag: 'li'

  constructor: (ui, model, controlClasses, resolver, parent_path, separator, tree) ->
    @separator = separator
    @label = $(ui).attr('label')
    @value = $(ui).attr('value')
    @relevantExpr = $(ui).attr('relevant')
    @requiredExpr = $(ui).attr('required')
    @model = model
    @resolver = resolver
    @label = @value unless @label? && @label.length > 0
    @value = parent_path + @separator + @value if separator? && separator.length > 0
    @ui = ui
    @tree = tree
    @items = for item in ui.children('item')
      new TreeItem($(item), model, controlClasses, resolver, @value, @separator, tree)
    @start = new Date()

  xpath: (xpath) ->
    util.execXPath(@model, xpath, @resolver)

  node_required: ->
    !(!@requiredExpr? || !@xpath(@requiredExpr))

  node_relevant: ->
    !@relevantExpr? || !!@xpath(@relevantExpr)

  handle_relevant_or_required: (allTreeItems) ->
    tree_div = @tree.tree_root
    current_node = tree_div.find("[node_value = '" + @value + "']")
    current_node.attr('item-required', @node_required())
    current_node.attr('item-relevant', @node_relevant())
    #remove any existing required/not available text and re add later
    was_disabled = false
    help = current_node.find('span.echoforms-help')
    if(tree_div.jstree('is_disabled', current_node).toString() == "true")
      was_disabled = true
    help.find('.not-available-or-required-text').remove()
    #reset the node icon
    current_node.find('a.jstree-anchor > i.jstree-icon').first().addClass('jstree-checkbox').removeClass('jstree-disabled-icon').removeClass('jstree-required-icon')
    current_node_obj = allTreeItems[current_node.attr('id')] if current_node

    if !@node_relevant()
      @addNotAvailableRequiredText(help, '[not available]')
      tree_div.jstree('disable_node', current_node)
      current_node.find('a').css('font-style', 'italic')
      current_node.find('a.jstree-anchor > i.jstree-icon').first().addClass('jstree-disabled-icon').removeClass('jstree-checkbox')

      if current_node_obj?.li_attr['conditionally-relevant'] == 'true'
        current_node_obj.li_attr['item-relevant'] = 'false'
        current_node_obj.state.selected = false
        current_node_obj.state.disabled = true
    else if @node_required()
      @addNotAvailableRequiredText(help, '[required]')
      tree_div.jstree('enable_node', current_node)
      tree_div.jstree('check_node', current_node)
      current_node.find('a').css('font-style', 'italic')
      current_node.find('a.jstree-anchor > i.jstree-checkbox').addClass('jstree-required-icon').removeClass('jstree-checkbox')
      # set item-required to 'true' in li_attr

      if current_node_obj?.li_attr['item-required'] == 'false'
        current_node_obj.li_attr['conditionally-required'] = 'true'
        current_node_obj.li_attr['item-required'] = 'true'
        current_node_obj.state.disabled = false
        current_node_obj.state.selected = true
    else
      tree_div.jstree('enable_node', current_node)
      current_node.find('a').css('font-style', 'normal')

      if current_node_obj?.li_attr['conditionally-required'] == 'true'
        current_node_obj.li_attr['item-required'] = 'false'
        current_node_obj.state.selected = false

      current_node.find('a.jstree-anchor > i.jstree-icon').first().addClass('jstree-checkbox').removeClass('jstree-disabled-icon').removeClass('jstree-required-icon')
      if(was_disabled)
        tree_div.jstree('select_node', current_node)
        current_node_obj.li_attr['item-relevant'] = 'true'
        current_node_obj.li_attr['conditionally-relevant'] = 'true'
        current_node_obj.state.selected = true
        current_node_obj.state.disabled = false

  subtree_handle_relevant_or_required: (allTreeItems) ->
    @handle_relevant_or_required(allTreeItems)
    for item in @items
      item.subtree_handle_relevant_or_required(allTreeItems)

  buildHelpDom: ->
    result = $('<span>', class: 'echoforms-help')
    for help in @ui.children('help')
      @addHelpText(result, $(help).text())
    result

  addNotAvailableRequiredText: (help_container,text) ->
    @addHelpText(help_container, text).addClass('not-available-or-required-text')

  addHelpText: (help_container, text) ->
    $('<span>', class: 'echoforms-help-item').text(text).attr(title: text).appendTo(help_container)

  buildElementsDom: ->
    el = $('<li>')
    el.attr(node_value: @value)
    el.addClass('jstree-open')
    help = @buildHelpDom()
    data_jstree = {}
    model_vals = @tree.modelValues()
    unless @node_relevant()
      data_jstree['disabled'] = true
      data_jstree['selected'] = true #this will be filtered out at output generation, but will ensure the node is loaded.
      @addNotAvailableRequiredText(help, '[not available]')
    if @node_required()
      data_jstree['selected'] = true
      @addNotAvailableRequiredText(help, '[required]')
    el.attr('item-relevant': @node_relevant())
    el.attr('item-required': @node_required())
    el.attr('data-jstree' : JSON.stringify(data_jstree)) if Object.keys(data_jstree).length > 0
    el.text(@label)
    el.append(help)
    childlist = $('<ul>')
    i = 0
    items = @items
    do () ->
      start = new Date().getTime()
      for j in [i..items.length - 1] by 1
        item = items[j]
        break unless item?
        node = item.buildElementsDom()
        node.appendTo(childlist)
        if i < (items.length - 1) and (new Date().getTime() - start > 40)
          console.log ("TreeItem construction yielding to browser to avoid unresponsive script")
          postMessage("script-timeout-message","*");
    childlist.appendTo(el) if @items.length > 0
    el

module.exports = TreeItem
