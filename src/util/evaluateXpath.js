/**
 * Evaluates XPATH against the given model
 * @param {String} xpath
 * @param {Object} model
 */
export const evaluateXpath = (xpath, model, resolver) => {
  if (xpath.charAt(0) === '[') {
    // eslint-disable-next-line no-param-reassign
    xpath = `self::*${xpath}`
  }

  let modelForEvaluation = model

  // If absolute xpath is provided, evaluate the xpath based on the ownerDocument of the model.
  if (xpath.startsWith('//')) {
    modelForEvaluation = model.ownerDocument
  }

  const result = model.ownerDocument.evaluate(
    xpath,
    modelForEvaluation,
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
