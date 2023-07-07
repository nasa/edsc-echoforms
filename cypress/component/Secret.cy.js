/* eslint-disable react/react-in-jsx-scope, react/jsx-no-constructed-context-values */
import murmurhash from 'murmurhash'

import { secretXml } from '../mocks/FormElement'
import { SecretField } from '../../src/components/SecretField/SecretField'
import { EchoFormsContext } from '../../src/context/EchoFormsContext'
import { parseXml } from '../../src/util/parseXml'

const readXml = (file) => {
  const doc = parseXml(file)
  const inputResult = document.evaluate('//*[local-name()="secret"]', doc)
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
    id: 'testfield',
    label: 'Test Field',
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
      <SecretField {...props}>
        {input.children}
      </SecretField>
    </EchoFormsContext.Provider>
  )
}

describe('SecretField component', () => {
  it('renders a InputField component', () => {
    setup(secretXml)

    cy.get('#testfield')
      .should('have.attr', 'value', 'test value')
      .and('have.attr', 'type', 'password')
      .and('have.attr', 'name', 'Test Field')
      .and('not.have.attr', 'readOnly', 'required')

    cy.get('label')
      .should('have.text', 'Test Field')
      .and('have.attr', 'for', 'testfield')

    cy.get('.help-text').should('have.text', 'Helpful text')
  })
})
