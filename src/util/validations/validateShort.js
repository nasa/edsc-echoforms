import { validateIntegerRange } from './validateIntegerRange'

/**
 * Validates a string value is a 16 bit signed short integer
 * @param {String} value
 */
export const validateShort = (value) => {
  // Don't show an error if there is no value
  if (!value) return true

  if (validateIntegerRange(-(2 ** 15), (2 ** 15) - 1, value)) return true

  return 'Value must be a integer between -32,768 and 32,767'
}
