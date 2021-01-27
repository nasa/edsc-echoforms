/**
 * Compare two form model strings to determine if they are different, removing irrelevant fields before comparing
 * @param {String} model1
 * @param {String} model2
 */
export const hasModelChanged = (model1, model2) => {
  let strippedModel1 = model1
  let strippedModel2 = model2

  // Strip the email field out of both models
  strippedModel1 = strippedModel1.replace(/<ecs:email>.*<\/ecs:email>/, '')
  strippedModel1 = strippedModel1.replace(/<ecs:email\/>/, '')
  strippedModel2 = strippedModel2.replace(/<ecs:email>.*<\/ecs:email>/, '')
  strippedModel2 = strippedModel2.replace(/<ecs:email\/>/, '')

  // Strip the INCLUDE_META field out of both models
  strippedModel1 = strippedModel1.replace(/<ecs:INCLUDE_META>.*<\/ecs:INCLUDE_META>/, '')
  strippedModel2 = strippedModel2.replace(/<ecs:INCLUDE_META>.*<\/ecs:INCLUDE_META>/, '')

  return strippedModel1 !== strippedModel2
}
