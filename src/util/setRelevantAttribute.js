import { evaluateXpath } from './evaluateXpath'

/**
 * Sets the irrelevant attribute on a model element
 * @param {Object} model XML Model
 * @param {String} modelRef XPath reference to model value
 * @param {Boolean} relevant Is the field relevant
 */
export const setRelevantAttribute = (model, resolver, modelRef, relevant) => {
  if (!modelRef) return model

  const element = evaluateXpath(modelRef, model, resolver)

  if (relevant) {
    element.removeAttribute('irrelevant')
  } else {
    element.setAttribute('irrelevant', !relevant)
  }

  return model
}
