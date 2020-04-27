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
  } else {
    value.textContent = newValue
  }

  return model
}
