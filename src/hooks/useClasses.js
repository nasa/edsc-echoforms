import { useContext, useCallback } from 'react'
import { EchoFormsContext } from '../context/EchoFormsContext'

/**
 * Combines given default CSS classes and Bootstrap classes if the EchoFormsContext has addBootstrapClasses enabled
 * @param {String} defaultClasses Default classes to add to the element
 * @param {String} bootstrapClasses Bootstrap classes to add to the element if enabled
 * @param {Boolean} isInvalid Flag to add is-invalid class
 */
export const useClasses = () => {
  const { addBootstrapClasses } = useContext(EchoFormsContext)

  const elementClasses = useCallback((defaultClasses, bootstrapClasses, isInvalid) => {
    let defaultWithError = defaultClasses
    if (isInvalid) defaultWithError += ' is-invalid'

    if (addBootstrapClasses) {
      return [bootstrapClasses, defaultWithError].filter(Boolean).join(' ')
    }

    return defaultWithError
  }, [addBootstrapClasses])

  return { elementClasses }
}
