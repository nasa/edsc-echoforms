$ = require 'jquery'
util = require '../util.coffee'
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

  xpath: (xpath) ->
    util.execXPath(@model, xpath, @resolver)

  node_required: ->
    !(!@requiredExpr? || !@xpath(@requiredExpr))

  node_relevant: ->
    !@relevantExpr? || !!@xpath(@relevantExpr)

  handle_relevant_or_required: ->
    tree_div = @tree.tree_root
    current_node = tree_div.find("[node_value = '" + @value + "']")
    current_node.attr('item-required', @node_required())
    current_node.attr('item-relevant', @node_relevant())
    if !@node_relevant()
      tree_div.jstree('disable_node', current_node)
      current_node.css('font-style', 'italic')
      current_node.find('a').css('font-style', 'italic')
      current_node.find('a.jstree-anchor > i.jstree-icon').first().addClass('jstree-disabled-icon').removeClass('jstree-checkbox')
    else if @node_required()
      tree_div.jstree('enable_node', current_node)
      current_node.css('font-style', 'italic')
      current_node.find('a').css('font-style', 'italic')
      current_node.find('a.jstree-anchor > i.jstree-checkbox').addClass('jstree-required-icon').removeClass('jstree-checkbox')
    else
      tree_div.jstree('enable_node', current_node)
      current_node.find('a.jstree-anchor > i.jstree-icon').first().addClass('jstree-checkbox').removeClass('jstree-disabled-icon').removeClass('jstree-required-icon')

  subtree_handle_relevant_or_required: ->
    @handle_relevant_or_required()
    for item in @items
      item.subtree_handle_relevant_or_required()

  buildHelpDom: ->
    result = $('<span>', class: 'echoforms-help')
    for help in @ui.children('help')
      @addHelpText(result, $(help).text())
    result

  addHelpText: (help_container, text) ->
    $('<p>', class: 'echoforms-help-item').text(text).attr(title: text).appendTo(help_container)

  buildElementsDom: ->
    el = $('<li>')
    el.attr(node_value: @value)
    help = @buildHelpDom()
    data_jstree = {}
    model_vals = @tree.modelValues()
    if model_vals.length > 0 and @value in model_vals
      data_jstree['selected'] = true
    unless @node_relevant()
      data_jstree['disabled'] = true
      data_jstree['selected'] = false
      #may eventually want to dynamically add some help text, but will not do that now
      @addHelpText(help, '[not available]')
    if @node_required()      
      data_jstree['selected'] = true
      @addHelpText(help, '[required]')
    el.attr('item-relevant': @node_relevant())
    el.attr('item-required': @node_relevant())
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
