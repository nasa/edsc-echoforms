import { buildXPathResolverFn } from './buildXPathResolverFn'

/**
 * Returns a Group's limited model from the XML model based on the ref xpath
 * @param {String} ref model ref xpath
 * @param {Object} model XML model
 */
export const getGroupModel = (ref, model) => {
  const result = model.ownerDocument.evaluate(
    ref,
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
