/**
 * Sets the irrelevant attribute on a model element
 * @param {Object} model XML Model
 * @param {String} modelRef XPath reference to model value
 * @param {Boolean} relevant Is the field relevant
 */
export const setRelevantAttribute = (model, resolver, modelRef, relevant) => {
  const doc = model.ownerDocument
  const result = doc.evaluate(`//${modelRef}`, model, resolver, XPathResult.ANY_TYPE, null)
  const element = result.iterateNext()

  if (relevant) {
    element.removeAttribute('irrelevant')
  } else {
    element.setAttribute('irrelevant', !relevant)
  }

  return model
}
