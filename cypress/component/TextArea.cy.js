/* eslint-disable react/react-in-jsx-scope, react/jsx-no-constructed-context-values */
import murmurhash from 'murmurhash'

import { textareaXml } from '../mocks/FormElement'
import { TextArea } from '../../src/components/TextArea/TextArea'
import { EchoFormsContext } from '../../src/context/EchoFormsContext'
import { parseXml } from '../../src/util/parseXml'

const readXml = (file) => {
  const doc = parseXml(file)
  const inputResult = document.evaluate('//*[local-name()="textarea"]', doc)
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
      <TextArea {...props}>
        {input.children}
      </TextArea>
    </EchoFormsContext.Provider>
  )
}

describe('TextArea component', () => {
  it('renders a textarea field', () => {
    setup(textareaXml)

    cy.get('#testfield')
      .should('have.text', 'test value')
      .and('have.attr', 'name', 'Test Field')
      .and('not.have.attr', 'readOnly', 'required')

    cy.get('label')
      .should('have.text', 'Test Field')
      .and('have.attr', 'for', 'testfield')
    cy.get('.help-text').should('have.text', 'Helpful text')
  })

  it('onBlur calls onUpdateModel', () => {
    setup(textareaXml)

    cy.get('#testfield').focus().blur()

    cy.get('@onUpdateModelSpy')
      .should('have.been.calledOnce')
      .and('have.been.calledWith', 'parentRef', 'testfield', 'test value')
  })

  it('onChange sets the state', () => {
    setup(textareaXml)

    cy.get('#testfield').clear().type('New Value')

    cy.get('#testfield').should('have.value', 'New Value')
  })
})
