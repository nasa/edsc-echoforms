/**
 * Evaluates XPATH against the given model
 * @param {String} xpath
 * @param {Object} model
 */
export const evaluateXpath = (xpath, model, resolver) => {
  let updatedXpath = xpath
  if (xpath.charAt(0) === '[') {
    updatedXpath = `self::*${xpath}`
  }

  // The root of the document being referred to is actually <form>,
  // not <model>, so absolute xpaths will not work as expected.
  // so we need to replace '/' at the beginning of the path, as well as '//' anywhere with:
  // descendant-or-self::node()
  updatedXpath = updatedXpath.replace(/^\/+|(https:)?\/\//g, ($0, $1) => {
    if ($1) { return $0 }

    return '/descendant-or-self::node()/'
  })

  const doc = model.ownerDocument

  const result = doc.evaluate(
    updatedXpath,
    model,
    resolver,
    XPathResult.ANY_TYPE,
    null
  )

  let value
  switch (result.resultType) {
    case XPathResult.NUMBER_TYPE:
      value = result.numberValue
      break
    case XPathResult.STRING_TYPE:
      value = result.stringValue
      break
    case XPathResult.BOOLEAN_TYPE:
      value = result.booleanValue
      break
    default: {
      value = result.iterateNext()
    }
  }

  return value
}
