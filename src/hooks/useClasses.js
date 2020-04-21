import { useContext } from 'react'
import { EchoFormsContext } from '../context/EchoFormsContext'

/**
 * Combines given default CSS classes and Bootstrap classes if the EchoFormsContext has addBootstrapClasses enabled
 * @param {String} defaultClasses default classes to add to the element
 * @param {String} bootstrapClasses bootstrap classes to add to the element if enabled
 */
export const useClasses = (defaultClasses, bootstrapClasses) => {
  const { addBootstrapClasses } = useContext(EchoFormsContext)

  if (addBootstrapClasses) {
    return [bootstrapClasses, defaultClasses].filter(Boolean).join(' ')
  }

  return defaultClasses
}
