/**
 * Validates a string value is an integer that falls between min and max bounds
 * @param {Number} min
 * @param {Number} max
 * @param {String} value
 */
export const validateIntegerRange = (min, max, value) => {
  const number = Number(value)
  return !Number.isNaN(number) && number >= min && number <= max && value.indexOf('.') === -1
}
