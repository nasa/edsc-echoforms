/**
 * Validates a string value is a double
 * @param {String} value
 */
export const validateDouble = (value) => {
  // Don't show an error if there is no value
  if (!value) return true

  if (!Number.isNaN(Number(value))) return true

  return 'Value must be a number'
}
