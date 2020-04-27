import { validateIntegerRange } from './validateIntegerRange'

/**
 * Validates a string value is a 16 bit signed short integer
 * @param {String} value
 */
export const validateShort = (value) => {
  // Don't show an error if there is no value
  if (!value) return true

  return validateIntegerRange(-(2 ** 15), (2 ** 15) - 1, value)
}
