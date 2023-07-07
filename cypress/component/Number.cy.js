/* eslint-disable react/react-in-jsx-scope, react/jsx-no-constructed-context-values */
import murmurhash from 'murmurhash'

import { integerXml } from '../mocks/FormElement'
import { Number } from '../../src/components/Number/Number'
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
    type: 'number',
    value: '123',
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
      <Number {...props}>
        {input.children}
      </Number>
    </EchoFormsContext.Provider>
  )
}

describe('Number component', () => {
  it('renders a InputField component', () => {
    setup(integerXml)

    cy.get('#testfield')
      .should('have.attr', 'value', '123')
      .and('have.attr', 'type', 'number')
      .and('have.attr', 'name', 'Test Field')
      .and('not.have.attr', 'readOnly', 'required')

    cy.get('label')
      .should('have.text', 'Test Field')
      .and('have.attr', 'for', 'testfield')

    cy.get('.help-text').should('have.text', 'Helpful text')
  })
})
