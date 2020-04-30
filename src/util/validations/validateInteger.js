import { validateIntegerRange } from './validateIntegerRange'

/**
 * Validates a string value is a 32 bit signed integer
 * @param {String} value
 */
export const validateInteger = (value) => {
  // Don't show an error if there is no value
  if (!value) return true

  if (validateIntegerRange(-(2 ** 31), (2 ** 31) - 1, value)) return true

  return 'Value must be a integer between -2,147,483,648 and 2,147,483,647'
}
