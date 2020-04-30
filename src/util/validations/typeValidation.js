import { validateDateTime } from './validateDateTime'
import { validateDouble } from './validateDouble'
import { validateLong } from './validateLong'
import { validateInteger } from './validateInteger'
import { validateShort } from './validateShort'

/**
 * Runs the correct basic type validation for the given type and value
 * @param {String} type
 * @param {String} value
 */
export const typeValidation = (type, value) => {
  if (!value) return true

  switch (type) {
    case 'datetime':
      return validateDateTime(value)
    case 'double':
      return validateDouble(value)
    case 'long':
      return validateLong(value)
    case 'int':
      return validateInteger(value)
    case 'short':
      return validateShort(value)
    default:
      return true
  }
}
