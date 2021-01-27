/**
 * Removes the irrelevant attribute from model elements
 * @param {Object} model XML Model
 */
export const removeIrrelevantAttribute = (model) => {
  const elements = model.querySelectorAll('[irrelevant=true]')

  elements.forEach(element => element.removeAttribute('irrelevant'))

  return model
}
