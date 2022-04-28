import { evaluateXpath } from './evaluateXpath'

/**
 * Returns the field value from the XML model based on the ref xpath
 * @param {String} ref Model ref xpath
 * @param {Object} model XML model
 * @param {Boolean} isBooleanAttribute Boolean flag for if the node value is expected to be a boolean
 * @param {Boolean} isTree Boolean flag for if the node value is a tree value
 */
export const getNodeValue = (ref, model, resolver, isBooleanAttribute, isTree) => {
  // If the node value is 'true' or 'false', we don't need to run xpath
  if (ref === 'true' || ref === 'false') {
    return ref === 'true'
  }

  const result = evaluateXpath(ref, model, resolver)

  // If the return value is expected to be a boolean but the xpath result is null, return false
  if (isBooleanAttribute && result == null) return false

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
  return Array.from(children).map((child) => child.textContent.trim())
}
