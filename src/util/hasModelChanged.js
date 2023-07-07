import { diffAsXml } from 'diff-js-xml'
import { evaluateXpath } from './evaluateXpath'

/**
 * Determines if the provided element has an irrelevant attribute set to 'true', or any parents of that element
 * @param {Object} element XML element
 */
const isNodeOrParentIrrelevant = (element) => {
  // If there is no element or the element does not have a getAttribute function
  // return false (top of the parent tree)
  if (!element || !element.getAttribute) return false

  // If the element has the irrelevant attribute set to 'true', return true
  const nodeIrrelevant = element.getAttribute('irrelevant')
  if (nodeIrrelevant === 'true') return true

  // Check the parent node for the irrelevant attribute
  const { parentNode } = element

  return isNodeOrParentIrrelevant(parentNode)
}

/**
 * Compare two form models to determine if they are different, ignoring irrelevant fields before comparing
 * @param {Object} originalModel Original form model
 * @param {Object} updatedModel Form model with updated values from edits
 * @param {Function} resolver XML resolver used to evaluate XPath
 */
export const hasModelChanged = (originalModel, updatedModel, resolver) => {
  let modelChanged = false

  // `diffAsXml` will compare the two XML strings
  diffAsXml(originalModel.innerHTML, updatedModel.innerHTML, {
    'ecs:email': { skipKey: true },
    'ecs:INCLUDE_META': { skipKey: true }
  }, {}, (results) => {
    // `results` will be an array of differance objects
    if (results.length > 0) {
      // Keep track of how many irrelevant fields are without the results diffs
      let irrelevantFields = 0

      // Loop through the diffs to find any irrelevant fields that have changed
      results.forEach((result) => {
        const { path = '' } = result
        const element = evaluateXpath(path.replaceAll('.', '/'), updatedModel, resolver)

        const irrelevant = isNodeOrParentIrrelevant(element)

        // If the node reported or any parents of that node are irrelevant, count that field to be ignored
        if (irrelevant) irrelevantFields += 1
      })

      // If not all of the results were irrelevant, the model has changed
      if (irrelevantFields !== results.length) {
        modelChanged = true
      }
    }
  })

  return modelChanged
}
