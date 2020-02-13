/**
 * Queries the model with the xpath found in ref. Used to determine relevant, readonly and required fields
 * @param {String} ref model ref xpath
 * @param {Object} model XML model
 */
export const checkRelevant = (ref, model) => {
  if (!ref || ref === 'true()') return true
  if (ref === 'false()') return false

  let modelRef = `//${ref}`

  if (ref.startsWith('//')) modelRef = ref

  const result = document.evaluate(
    modelRef,
    model,
    document.createNSResolver(model),
    XPathResult.BOOLEAN_TYPE,
    null
  )

  return result.booleanValue
}
