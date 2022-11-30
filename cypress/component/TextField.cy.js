/* eslint-disable react/react-in-jsx-scope, react/jsx-no-constructed-context-values */
import murmurhash from 'murmurhash'

import { textFieldWithPatternConstraintXml, textfieldXml } from '../mocks/FormElement'
import { TextField } from '../../src/components/TextField/TextField'
import { EchoFormsContext } from '../../src/context/EchoFormsContext'
import { parseXml } from '../../src/util/parseXml'

const readXml = (file) => {
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

const setup = (file, overrideProps) => {
  const { input, model } = readXml(file)

  const onUpdateModelSpy = cy.spy().as('onUpdateModelSpy')
  const setFormIsValidSpy = cy.spy().as('setFormIsValidSpy')

  const elementHash = murmurhash.v3(input.outerHTML, 'seed')

  const props = {
    elementHash,
    label: 'Test Field',
    id: 'testfield',
    model,
    modelRef: 'testfield',
    parentRef: 'parentRef',
    readOnly: false,
    required: false,
    value: 'test value',
    ...overrideProps
  }

  const contextValue = {
    onUpdateModel: onUpdateModelSpy,
    setFormIsValid: setFormIsValidSpy
  }

  cy.mount(
    <EchoFormsContext.Provider
      value={contextValue}
    >
      <TextField {...props}>
        {input.children}
      </TextField>
    </EchoFormsContext.Provider>
  )
}

describe('TextField component', () => {
  it('renders a InputField component', () => {
    setup(textfieldXml)

    cy.get('#testfield')
      .should('have.attr', 'value', 'test value')
      .and('have.attr', 'name', 'Test Field')
      .and('not.have.attr', 'readOnly', 'required')

    cy.get('label')
      .should('have.text', 'Test Field')
      .and('have.attr', 'for', 'testfield')
    cy.get('.help-text').should('have.text', 'Helpful text')
  })

  it('renders constraint errors', () => {
    setup(textFieldWithPatternConstraintXml, { value: '' })

    cy.get('#testfield').clear().type('invalid').blur()

    cy.get('.invalid-feedback').should('have.text', 'Value must be "test value"')
  })
})
