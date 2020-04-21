import { createContext } from 'react'

/**
 * Sets up context for values most components need
 */
export const EchoFormsContext = createContext({
  addBootstrapClasses: false,
  doc: {},
  onUpdateModel: () => {}
})