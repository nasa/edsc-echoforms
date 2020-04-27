import { validateIntegerRange } from './validateIntegerRange'

/**
 * Validates a string value is a 64 bit signed long integer
 * Note: Javascript cannot handle the following two numbers precisely.
 * They are rounded, and differ from the un-rounded numbers by around 200.
 * @param {String} value
 */
export const validateLong = (value) => {
  // Don't show an error if there is no value
  if (!value) return true

  return validateIntegerRange(-(2 ** 63), (2 ** 63) - 1, value)
}
