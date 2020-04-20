/**
 * Updates an XML Model with a new value
 * @param {Object} model XML Model
 * @param {String} modelRef XPath reference to model value
 * @param {String|Array} newValue New value to be inserted into model
 */
export const updateModel = (model, modelRef, newValue) => {
  const result = document.evaluate(`//${modelRef}`, model, document.createNSResolver(model), XPathResult.ANY_TYPE, null)
  const value = result.iterateNext()

  if (Array.isArray(newValue)) {
    const values = newValue.map((v) => {
      const { namespaceURI, prefix } = model
      const { value: vValue, valueElementName } = v
      const element = document.createElementNS(namespaceURI, `${prefix}:${valueElementName}`)
      element.textContent = vValue

      return element.outerHTML
    })
    value.innerHTML = values.join('')
  } else {
    value.textContent = newValue
  }

  return model
}
