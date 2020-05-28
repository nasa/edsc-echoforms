import { evaluateXpath } from './evaluateXpath'

/**
 * Returns the field value from the XML model based on the ref xpath
 * @param {String} ref model ref xpath
 * @param {Object} model XML model
 * @param {Boolean} isTree flag for if the node value is a tree value
 */
export const getNodeValue = (ref, model, resolver, isTree) => {
  // If the node value is 'true' or 'false', we don't need to run xpath
  if (ref === 'true' || ref === 'false') {
    return ref === 'true'
  }

  const result = evaluateXpath(ref, model, resolver)

  if (typeof result === 'boolean') {
    return result
  }

  const { children = [] } = result

  // If children is empty get the text content of the node
  if (children.length === 0) {
    // Tree values are arrays, but we need to return an empty array if the children are empty
    if (isTree) return []

    return result.textContent.trim()
  }

  // If children has values then we need to get the text content of the children
  return Array.from(children).map(child => child.textContent.trim())
}
