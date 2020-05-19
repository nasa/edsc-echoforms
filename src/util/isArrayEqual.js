/**
 * Determine if two arrays are equal
 * @param {Array} array1
 * @param {Array} array2
 */
export const isArrayEqual = (array1, array2) => {
  if (array1.length !== array2.length) return false

  let i
  for (i = 0; i < array1.length; i += 1) {
    if (array1[i] !== array2[i]) {
      return false
    }
  }

  return true
}
