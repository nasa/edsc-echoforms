window = require('window')

wgxpathInstalled = false

warn =  (args...) -> console?.warn?(args...)
error = (args...) ->
  console?.error?(args...)
  if $("#form_load_errors")?
    $("#form_load_errors").append("<div class='form_load_error'>#{args}</div>")

execXPath = (root, xpath, resolver) ->
  wgxpath?.install?(window) unless wgxpathInstalled
  wgxpathInstalled = true

  if root.length < 1
    error("Error processing xpath [#{xpath}].  Provided context node was not valid. Verify that the ref attribute of the parent group is valid (including the namespace).")

  # Handle slightly bad expressions received from providers.
  # "[foo=bar]" becomes ".[foo=bar]"
  xpath = "self::*#{xpath}" if xpath?.charAt(0) == '['

  # "true" and "false" become "true()" and "false()"
  return true if xpath == "true"
  return false if xpath == "false"

  doc = root[0].ownerDocument

  #wgxpath seems to not like '//'.  In addition, the root of the document being
  # referred to is actually <form>, not <model>, so absolute xpaths will not work as expected.
  # so we need to replace '/' at the beginning of the path, as well as '//' anywhere with:
  # descendant-or-self::node()
  # xpath = xpath.replace(/((?!http:\/\/).)*^\/+|^\/\//g, '/descendant-or-self::node()/')
  xpath = xpath.replace /^\/+|(https:)?\/\//g, ($0, $1) ->
    if $1 then $0 else '/descendant-or-self::node()/'

  wgxpath.install(document: doc) unless doc['evaluate']?
  result = doc.evaluate(xpath, root[0], resolver, XPathResult.ANY_TYPE, null)

  val = switch result.resultType
    when XPathResult.NUMBER_TYPE then result.numberValue
    when XPathResult.STRING_TYPE then result.stringValue
    when XPathResult.BOOLEAN_TYPE then result.booleanValue
    else result.iterateNext()
  val

# Parse the given xml string and return the resulting elements.
# Based on jQuery's XML parser.  We include our own because $.parseXML did
# not exist in jQuery 1.4.4
parseXML = (data) ->
  return null if !data || typeof data != 'string'

  xml = undefined
  try
    if window.DOMParser
      xml = new DOMParser().parseFromString(data, 'text/xml')
    else
      xml = new ActiveXObject("Microsoft.XMLDOM")
      xml.async = "false"
      xml.loadXML(data)
  catch err

  if !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length
    error "Invalid XML: #{data}"
  xml

buildXPathResolverFn = (xml) ->
  namespaces = {}
  defaultName = " default "

  namespaceRegexp = /\sxmlns(?::(\w+))?=\"([^\"]+)\"/g
  while (match = namespaceRegexp.exec(xml))?
    [name, uri] = match[1..2]
    namespaces[name ? defaultName] = uri

  (prefix) ->
    namespaces[prefix ? defaultName]

printDOMToString = (dom_object, ns_map = {}) ->
    output = ""
    attributes = ""
    if dom_object.nodeName == "#text"
      #use jquery to escape embedded XML entities
      return "#{output}#{$('<div/>').text(dom_object.nodeValue).html()}"
    else if dom_object.nodeName == "#comment"
      return "#{output}<!--#{dom_object.nodeValue}-->"
    #Note the raw javascript loops below.  cannot use for...in as explained here:
    #https://developer.mozilla.org/en-US/docs/Web/API/NodeList
    #using normal coffeescript macros results in for...in, or really ugly javascript.
    `for (var i=0; i < dom_object.attributes.length; i++){
            var name = dom_object.attributes[i].name;
            var value = dom_object.attributes[i].value;
            attributes += ' ' + name + '="' + value +'"';
            if (/xmlns/.test(name) && name != "xmlns"){
              ns_map[name.split(":").pop()] = value;
            }
        }`
    #if we dont have an explicit namespace, try to add it.
    if !dom_object.prefix?
      `for (prefix in ns_map){
        if (ns_map.hasOwnProperty(prefix)){
          if (ns_map[prefix] == dom_object.namespaceURI){
            dom_object.prefix = prefix;
            break;
          }
        }
      }`

    output += "<#{dom_object.nodeName}"
    output +="#{attributes}>"
    `for (var i=0; i < dom_object.childNodes.length; i++){
            output += printDOMToString(dom_object.childNodes[i], ns_map);
        }`
    return "#{output}</#{dom_object.nodeName}>"

module.exports =
  warn: warn
  error: error
  execXPath: execXPath
  parseXML: parseXML
  buildXPathResolverFn: buildXPathResolverFn
  printDOMToString:printDOMToString
