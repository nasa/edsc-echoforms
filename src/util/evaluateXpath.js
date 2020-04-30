import { buildXPathResolverFn } from './buildXPathResolverFn'

/**
 * Evaluates XPATH against the given model
 * @param {String} xpath
 * @param {Object} model
 */
export const evaluateXpath = (xpath, model) => {
  const result = model.ownerDocument.evaluate(
    xpath,
    model,
    buildXPathResolverFn(model.ownerDocument),
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
