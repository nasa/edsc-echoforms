  wgxpath.install(window)

  execXPath = (root, xpath, resolver) ->
    # Handle slightly bad expressions received from providers.
    # "[foo=bar]" becomes ".[foo=bar]"
    xpath = "self::*#{xpath}" if xpath?.charAt(0) == '['

    # "true" and "false" become "true()" and "false()"
    return true if xpath == "true"
    return false if xpath == "false"

    result = document.evaluate(xpath, root[0], resolver, XPathResult.ANY_TYPE, null)
    switch result.resultType
      when XPathResult.NUMBER_TYPE then result.numberValue
      when XPathResult.STRING_TYPE then result.stringValue
      when XPathResult.BOOLEAN_TYPE then result.booleanValue
      else result.iterateNext()
