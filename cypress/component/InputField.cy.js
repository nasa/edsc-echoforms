/* eslint-disable react/react-in-jsx-scope, react/jsx-no-constructed-context-values */
import murmurhash from 'murmurhash'

import { textfieldXml } from '../mocks/FormElement'
import { InputField } from '../../src/components/InputField/InputField'
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

const setup = (overrideProps) => {
  const { input, model } = readXml(textfieldXml)

  const onUpdateModelSpy = cy.spy().as('onUpdateModelSpy')
  const setFormIsValidSpy = cy.spy().as('setFormIsValidSpy')

  const elementHash = murmurhash.v3(input.outerHTML, 'seed')

  const props = {
    elementHash,
    label: 'Test Field',
    id: 'testfield',
    model,
    modelRef: 'testfield',
    placeholder: '',
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
      <InputField {...props}>
        {input.children}
      </InputField>
    </EchoFormsContext.Provider>
  )
}

describe('InputField component', () => {
  it('renders an input element', () => {
    setup()

    cy.get('input')
      .should('have.lengthOf', 1)
      .and('have.value', 'test value')
      .and('have.attr', 'name', 'Test Field')
      .and('have.attr', 'id', 'testfield')
      .and('not.have.attr', 'readOnly', 'type')
  })

  it('renders an input element with a placeholder', () => {
    setup({
      placeholder: 'YYYY-MM-DDTHH:MM:SS'
    })

    cy.get('input')
      .should('have.lengthOf', 1)
      .and('have.value', 'test value')
      .and('have.attr', 'name', 'Test Field')
      .and('have.attr', 'id', 'testfield')
      .and('have.attr', 'placeholder', 'YYYY-MM-DDTHH:MM:SS')
      .and('not.have.attr', 'readOnly', 'type')
  })

  it('onBlur calls onUpdateModel', () => {
    setup({
      parentRef: 'parentRef'
    })

    cy.get('input').focus().blur()

    cy.get('@onUpdateModelSpy')
      .should('have.been.calledOnce')
      .and('have.been.calledWith', 'parentRef', 'testfield', 'test value')
  })

  it('onChange sets the state', () => {
    setup()

    cy.get('input').clear().type('New Value')

    cy.get('input').should('have.value', 'New Value')
  })
})
