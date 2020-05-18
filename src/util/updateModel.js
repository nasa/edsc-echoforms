import { buildXPathResolverFn } from './buildXPathResolverFn'

/**
 * Updates an XML Model with a new value
 * @param {Object} model XML Model
 * @param {String} modelRef XPath reference to model value
 * @param {String|Array} newValue New value to be inserted into model
 */
export const updateModel = (model, modelRef, newValue) => {
  const doc = model.ownerDocument
  const result = doc.evaluate(`//${modelRef}`, model, buildXPathResolverFn(doc), XPathResult.ANY_TYPE, null)
  const value = result.iterateNext()

  // Select values
  if (Array.isArray(newValue)) {
    const values = newValue.map((v) => {
      const { namespaceURI, prefix } = model
      const { value: vValue, valueElementName } = v
      const tag = [prefix, valueElementName].filter(Boolean).join(':')

      const element = document.createElementNS(namespaceURI, tag)
      element.textContent = vValue

      return element.outerHTML
    })
    value.innerHTML = values.join('')
  } else if (typeof newValue === 'object') {
    // Tree values
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
