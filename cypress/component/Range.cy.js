/* eslint-disable react/react-in-jsx-scope, react/jsx-no-constructed-context-values */
import murmurhash from 'murmurhash'

import { rangeXml } from '../mocks/FormElement'
import { Range } from '../../src/components/Range/Range'
import { EchoFormsContext } from '../../src/context/EchoFormsContext'
import { parseXml } from '../../src/util/parseXml'

const readXml = (file) => {
  const doc = parseXml(file)
  const inputResult = document.evaluate('//*[local-name()="range"]', doc)
  const input = inputResult.iterateNext()
  const modelResult = document.evaluate('//*[local-name()="instance"]', doc)
  const model = modelResult.iterateNext()

  return {
    input,
    model
  }
}

const setup = (overrideProps) => {
  const { input, model } = readXml(rangeXml)

  const onUpdateModelSpy = cy.spy().as('onUpdateModelSpy')
  const setFormIsValidSpy = cy.spy().as('setFormIsValidSpy')

  const elementHash = murmurhash.v3(input.outerHTML, 'seed')

  const props = {
    checked: 'true',
    elementHash,
    id: 'testfield',
    label: 'Test Field',
    max: '10',
    min: '0',
    model,
    modelRef: 'testfield',
    readOnly: false,
    required: false,
    step: '1',
    value: '5',
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
      <Range {...props}>
        {input.children}
      </Range>
    </EchoFormsContext.Provider>
  )
}

describe('Range component', () => {
  it('renders an input field', () => {
    setup()

    cy.get('#testfield')
      .should('have.attr', 'type', 'range')
      .and('have.attr', 'name', 'Test Field')
      .and('have.attr', 'max', '10')
      .and('have.attr', 'min', '0')
      .and('have.attr', 'step', '1')
      .and('have.value', '5')
      .and('not.have.attr', 'readOnly')

    cy.get('label')
      .should('have.text', 'Test Field')
      .and('have.attr', 'for', 'testfield')

    cy.get('.help-text').should('have.text', 'Helpful text')

    cy.get('.range__min').should('have.text', '0')
    cy.get('.range__max').should('have.text', '10')
    cy.get('.range__value').should('have.text', '5')
  })

  it('onChange sets the state', () => {
    setup()

    cy.get('#testfield')
      .then(($el) => $el[0].stepUp(2))
      .trigger('change')

    cy.get('#testfield').should('have.value', '7')
    cy.get('.range__value').should('have.text', '7')
  })

  it('onKeyUp calls onUpdateModel', () => {
    setup()

    cy.get('#testfield')
      .then(($el) => $el[0].stepUp(2))
      .trigger('keyup')

    cy.get('@onUpdateModelSpy')
      .should('have.been.calledOnce')
      .and('have.been.calledWith', null, 'testfield', '7')
  })

  it('onMouseUp calls onUpdateModel', () => {
    setup()

    cy.get('#testfield')
      .then(($el) => $el[0].stepUp(2))
      .trigger('mouseup')

    cy.get('@onUpdateModelSpy')
      .should('have.been.calledOnce')
      .and('have.been.calledWith', null, 'testfield', '7')
  })
})
