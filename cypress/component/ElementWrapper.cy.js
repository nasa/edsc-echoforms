/* eslint-disable react/react-in-jsx-scope, react/jsx-no-constructed-context-values */
import { textFieldWithPatternConstraintXml } from '../mocks/FormElement'
import { ElementWrapper } from '../../src/components/ElementWrapper/ElementWrapper'
import { EchoFormsContext } from '../../src/context/EchoFormsContext'
import { parseXml } from '../../src/util/parseXml'

function readXml(file) {
  const doc = parseXml(file)
  const inputResult = document.evaluate('//*[local-name()="input"]', doc)
  const input = inputResult.iterateNext()
  const modelResult = document.evaluate('//*[local-name()="instance"]', doc)
  const model = modelResult.iterateNext()

  return {
    input,
    model
  }
}

const setup = (overrideProps) => {
  const { input, model } = readXml(textFieldWithPatternConstraintXml)
  const setFormIsValidSpy = cy.spy().as('setFormIsValidSpy')

  const props = {
    model,
    formElements: input.children,
    htmlFor: 'testfield',
    label: ' Test Field',
    required: false,
    value: 'test value',
    ...overrideProps
  }

  const contextValue = {
    model,
    setFormIsValid: setFormIsValidSpy
  }

  const childrenSpy = cy.spy().as('childrenSpy')

  cy.mount(
    <EchoFormsContext.Provider
      value={contextValue}
    >
      <ElementWrapper {...props}>
        {childrenSpy}
      </ElementWrapper>
    </EchoFormsContext.Provider>
  )
}

describe('ElementWrapper component', () => {
  it('renders a Constraint component', () => {
    setup({
      manualError: 'mock error'
    })

    cy.get('.invalid-feedback').should('have.text', 'mock error')
  })

  it('renders a Help component', () => {
    setup()
    cy.get('.help-text').should('have.text', 'Helpful text')
  })
})
