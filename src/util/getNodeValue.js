import { evaluateXpath } from './evaluateXpath'

/**
 * Returns the field value from the XML model based on the ref xpath
 * @param {String} ref model ref xpath
 * @param {Object} model XML model
 */
export const getNodeValue = (ref, model) => {
  // If the node value is 'true' or 'false', we don't need to run xpath
  if (ref === 'true' || ref === 'false') {
    return ref === 'true'
  }

  let modelRef = ref

  if (ref.charAt(0) === '[') {
    modelRef = `self::*${ref}`
  }

  const result = evaluateXpath(modelRef, model)

  if (typeof result === 'boolean') {
    return result
  }

  const { children = [] } = result

  // If children is empty get the text content of the node
  if (children.length === 0) {
    return result.textContent
  }

  // If children has values then we need to get the text content of the children
  return Array.from(children).map(child => child.textContent)
}
