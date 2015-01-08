$ = require 'jquery'
#Base = require './base.coffee'

class TreeItem #extends Base
  @selector: 'item'

  inputTag: 'li'

  constructor: (ui, model, controlClasses, resolver, parent_path, separator) ->
    @separator = separator
    @label = $(ui).attr('label')
    @value = $(ui).attr('value')
    @label = @value unless @label? && @label.length > 0
    @value = parent_path + @separator + @value if separator? && separator.length > 0
    @ui = ui
    @items = for item in ui.children('item')
      new TreeItem($(item), model, controlClasses, resolver, @value, @separator)

  buildHelpDom: ->
    result = $('<span>', class: 'echoforms-help')
    for help in @ui.children('help')
      $('<p>', class: 'echoforms-help-item').text($(help).text())
      .attr(title: $(help).text()).appendTo(result)
    result

  buildElementsDom: ->
    el = $('<li>')
    el.attr(node_value: @value)
    el.text(@label)
    el.append(@buildHelpDom())
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
          setTimeout(arguments.callee, 0)
    childlist.appendTo(el) if @items.length > 0
    el

module.exports = TreeItem
