/* eslint-disable react/react-in-jsx-scope, react/jsx-no-constructed-context-values */
import { selectXml, textfieldXml } from '../mocks/FormElement'
import { Help } from '../../src/components/Help/Help'
import { parseXml } from '../../src/util/parseXml'

const readXml = (file, type) => {
  const doc = parseXml(file)
  const inputResult = document.evaluate(`//*[local-name()="${type}"]`, doc)
  const input = inputResult.iterateNext()

  return { input }
}

const setup = (file, type, manualHelp) => {
  const { input } = readXml(file, type)

  cy.mount(
    <Help
      elements={input.children}
      manualHelp={manualHelp}
    />
  )
}

describe('Help component', () => {
  it('renders help text', () => {
    setup(textfieldXml, 'input')

    cy.get('small').should('have.text', 'Helpful text')
  })

  it('only renders help elements', () => {
    setup(selectXml, 'select')

    cy.get('small')
      .should('have.lengthOf', 1)
      .and('have.text', 'Helpful text')
  })

  it('renders manualHelp', () => {
    setup(textfieldXml, 'input', 'Manual Help Message')

    cy.get('small')
      .should('have.lengthOf', 2)
      .last().should('have.text', 'Manual Help Message')
  })
})
