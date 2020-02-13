/**
 * Returns the field value from the XML model based on the ref xpath
 * @param {String} ref model ref xpath
 * @param {Object} model XML model
 */
export const getNodeValue = (ref, model) => {
  let modelRef = `//${ref}`

  if (ref.startsWith('//')) modelRef = ref

  const result = document.evaluate(
    modelRef,
    model,
    document.createNSResolver(model),
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
    default:
      value = result.iterateNext().textContent
      break
  }

  return value
}
