import { validateIntegerRange } from './validateIntegerRange'

/**
 * Validates a string value is a 32 bit signed integer
 * @param {String} value
 */
export const validateInteger = (value) => {
  // Don't show an error if there is no value
  if (!value) return true

  return validateIntegerRange(-(2 ** 31), (2 ** 31) - 1, value)
}
