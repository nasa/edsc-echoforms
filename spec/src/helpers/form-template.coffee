class window.FormTemplate
  constructor: (@template) ->
    @vars = []
    re = /{{([^}]+)}}/g
    while (match = re.exec(@template))?
      variable = match[1]
      @vars.push(variable) if @vars.indexOf(variable) == -1

  xml: (varmap={}) ->
    result = @template
    for variable in @vars
      regexp = new RegExp("{{#{variable}}}", 'g')
      value = varmap[variable] ? ''
      result = result.replace(regexp,  value)
    result

  form: (dom, varmap={}) ->
    dom.echoforms(form: @xml(varmap))

  #use for debugging.  allows you to print teh form including substitutions
  print_form_xml: (dom, varmap={}) ->
    @xml(varmap)
