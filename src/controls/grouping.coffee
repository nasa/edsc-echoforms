$ = require 'jquery'
Base = require './base.coffee'
util = require '../util.coffee'

class Grouping extends Base
  constructor: (ui, model, controlClasses, resolver) ->
    # Grouping controls ignore the 'required' attribute
    ui.removeAttr('required')
    super(ui, model, controlClasses, resolver)

  inputs: () -> $()

  loadFromModel: ->
    super()
    control.loadFromModel() for control in @controls

  buildLabelDom: ->
    # Use an <h1> for the label instead of the default <label>
    if @label?
      $('<h1>', class: 'echoforms-label').text(@label)
    else
      $()

  buildDom: ->
    root = super().addClass('echoforms-grouping-control')

    # Put help near the title of the control instead of near the bottom, since there
    # can be a lot of controls between the title and the help
    root.children('.echoforms-label').after(root.children('.echoforms-help'))

    childModel = @ref()
    util.error("Could not find the model element associated with this group.  Verify that @ref [#{@refExpr}] is correct and that the namespace is set correctly") if childModel.length < 1
    ui = @ui
    children = $()
    @controls = controls = []
    for child in ui.children()
      continue if child.nodeName == 'help' || child.nodeName == 'constraints'
      for ControlClass in @controlClasses
        if $(child).is(ControlClass.selector)
          control = new ControlClass($(child), childModel, @controlClasses, @resolver)
          controls.push(control)
          children = children.add(control.el)
          break
    root.find('.echoforms-elements').replaceWith($('<div class="echoforms-children">').append(children))
    root

  updateReadonly: (isReadonly) ->
    # Grouping controls cause child controls to inherit the readonly flag
    super(isReadonly)
    for control in @controls
      control.updateReadonly(isReadonly)

  validate: ->
    super()
    prune = true
    for control in @controls
      relevant = !control.relevantExpr? || !!control.xpath(control.relevantExpr)
      prune = false if !relevant && control.relevant()
      control.validate()
    @ref()[0].removeAttribute('pruned') unless prune

  addedToDom: ->
    super()
    for control in @controls
      control.addedToDom()

module.exports = Grouping
