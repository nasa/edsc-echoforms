/**
 * Updates an XML Model with a new value
 * @param {Object} model XML Model
 * @param {String} modelRef XPath reference to model value
 * @param {String|Array} newValue New value to be inserted into model
 */
export const updateModel = (model, resolver, modelRef, newValue) => {
  const doc = model.ownerDocument
  const result = doc.evaluate(`//${modelRef}`, model, resolver, XPathResult.ANY_TYPE, null)
  const value = result.iterateNext()

  if (typeof newValue === 'object') {
    // Array values
    const { value: values, valueElementName } = newValue
    const { namespaceURI, prefix } = model

    const tag = [prefix, valueElementName].filter(Boolean).join(':')

    value.innerHTML = values.map((v) => {
      const element = document.createElementNS(namespaceURI, tag)
      element.textContent = v

      return element.outerHTML
    }).join('')
  } else {
    // Text values
    value.textContent = newValue
  }

  return model
}
