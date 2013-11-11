  warn =  (args...) -> console?.warn?(args...)
  err = (args...) -> console?.error?(args...)

  wgxpath?.install?(window)

  execXPath = (root, xpath, resolver) ->
    # Handle slightly bad expressions received from providers.
    # "[foo=bar]" becomes ".[foo=bar]"
    xpath = "self::*#{xpath}" if xpath?.charAt(0) == '['

    # "true" and "false" become "true()" and "false()"
    return true if xpath == "true"
    return false if xpath == "false"

    doc = root[0].ownerDocument

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
    catch error

    if !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length
      err "Invalid XML: #{data}"
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
