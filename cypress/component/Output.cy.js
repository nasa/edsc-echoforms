/* eslint-disable react/react-in-jsx-scope, react/jsx-no-constructed-context-values */
import murmurhash from 'murmurhash'

import { outputXml, outputXpathXml } from '../mocks/FormElement'
import { Output } from '../../src/components/Output/Output'
import { EchoFormsContext } from '../../src/context/EchoFormsContext'
import { parseXml } from '../../src/util/parseXml'

const readXml = (file) => {
  const doc = parseXml(file)
  const inputResult = document.evaluate('//*[local-name()="output"]', doc)
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
      <Output {...props}>
        {input.children}
      </Output>
    </EchoFormsContext.Provider>
  )
}

describe('Output component', () => {
  it('renders a p element', () => {
    setup(outputXml)

    cy.get('#testfield')
      .should('have.text', 'test value')

    cy.get('label')
      .should('have.text', 'Test Field')
      .and('have.attr', 'for', 'testfield')

    cy.get('.help-text').should('have.text', 'Helpful text')
  })

  it('renders an a element when the type is anyURI', () => {
    setup(outputXml, { type: 'anyuri' })

    cy.get('#testfield')
      .should('have.text', 'test value')
      .and('have.attr', 'href', 'test value')

    cy.get('label')
      .should('have.text', 'Test Field')
      .and('have.attr', 'for', 'testfield')

    cy.get('.help-text').should('have.text', 'Helpful text')
  })

  it('renders evaluated xpath output values', () => {
    setup(outputXpathXml, {
      value: '7 * 6'
    })

    cy.get('#testfield')
      .should('have.text', '42')
  })

  it('renders the value when it is valid xpath that returns no result', () => {
    setup(outputXpathXml, {
      value: 'asdf'
    })

    cy.get('#testfield')
      .should('have.text', 'asdf')
  })
})
