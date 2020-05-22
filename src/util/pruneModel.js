/**
 * Removes elements from the model with the irrelevant attribute
 * @param {Object} model XML Model
 */
export const pruneModel = (model) => {
  const elements = model.querySelectorAll('[irrelevant=true]')

  elements.forEach(element => element.parentNode.removeChild(element))

  return model
}
