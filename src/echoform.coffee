$ = require 'jquery'
util = require './util.coffee'
controls = require './controls/index.coffee'
FormControl = require './controls/form.coffee'

jQuery.expr[':'].hasNoValue = (obj) ->
  jQuery.trim(jQuery(obj).text()).length ==0;

defaultControls = controls.matchList.concat()

defaults =
  controls: []

class EchoForm
  @registerControl = (controlClass, options={}) ->
    defaultControls.unshift(controlClass)

  constructor: (@root, options) ->
    try
      @options = $.extend({}, defaults, options)
      @form = form = @options['form']
      @skipValidation = skipValidation = @options['skipValidation']
      @controlClasses = controlClasses = @options['controls'].concat(defaultControls)

      unless form?
        util.error "You must specify a 'form' option when creating a new ECHO Forms instance"

      @resolver = resolver = util.buildXPathResolverFn(form)
      @doc = doc = $(util.parseXML(form))

      @model = model = doc.find('form > model > instance')

      prepopulate = @options.prepopulate
      if prepopulate
        expressionsFirefox = doc.find('form > model > extension[name="pre:prepopulate"] pre\\:expression')
        expressionsAllOthers = doc.find('form > model > extension[name="pre:prepopulate"] expression')
        if expressionsFirefox.length > expressionsAllOthers.length
          expressions = expressionsFirefox;
        else
          expressions = expressionsAllOthers;
        for expression in expressions
          source = expression.getAttribute('source')
          if prepopulate.hasOwnProperty(source)
            ref = expression.getAttribute('ref')
            $(util.execXPath(model.children(), ref, resolver)).text(prepopulate[source])

      @ui = ui = doc.find('form > ui')

      @control = new FormControl(ui, model, controlClasses, resolver, skipValidation)
      @root.append(@control.element())
      @control.addedToDom()

      # There will be more than one trees if there are more than one processors
      visibleTree = $('#' + jstree.id) for jstree in $('.jstree') when $('#' + jstree.id).is(':visible')

      # Band filtering
      timer = false
      visibleTree.on 'keyup', '#bands-filter', ->
        clearTimeout(timer) if timer
        timer = setTimeout (->
          text = $('#bands-filter').val()
          visibleTree.jstree('search', text) if text.length > 1), 250

      # Selected band counter
      totalCount = visibleTree.jstree('get_json', '#', flat: true).length
      visibleTree.on 'click', '.jstree-node', (e)->
        checkedCount = visibleTree.jstree('get_selected').length
        $('#bands-count').html("<div id='bands-count'><span id='selected-bands-count'>#{checkedCount} of #{totalCount}</span> bands selected</div>")
      checkedCount = visibleTree.jstree('get_selected').length
      visibleTree.prepend("<div id='bands-count'><span id='selected-bands-count'>#{checkedCount} of #{totalCount}</span> bands selected</div>")
      visibleTree.prepend("<input id='bands-filter' placeholder='Filter bands here'></input>")

      # Expand the first level bands
      rootBandId = visibleTree.find('li').first().attr('id')
      visibleTree.jstree('close_all').jstree('open_node', rootBandId)
    catch exception
      util.error(exception)
      throw exception

  destroy: ->
    @root.empty()

  isValid: ->
    @control.isValid()

  serialize: (options) ->
    @control.serialize(options)

module.exports = EchoForm
