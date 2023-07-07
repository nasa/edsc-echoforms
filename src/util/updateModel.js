import { evaluateXpath } from './evaluateXpath'

/**
 * Updates an XML Model with a new value
 * @param {Object} model XML Model
 * @param {String} modelRef XPath reference to model value
 * @param {String|Array} newValue New value to be inserted into model
 */
export const updateModel = (model, resolver, modelRef, newValue) => {
  // `model` is at the <instance> level, xpath needs to be evaluated based on the first child of <instance>
  const value = evaluateXpath(modelRef, model.firstElementChild, resolver)

  if (!value) {
    console.warn('Unable to update model value, value is:', value, modelRef, model.outerHTML)
  }

  if (typeof newValue === 'object') {
    // Array values
    const { value: values, valueElementName } = newValue
    // Use the namespace information from the element modelRef points to
    const { namespaceURI, prefix } = value

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
