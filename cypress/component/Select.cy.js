/* eslint-disable react/react-in-jsx-scope, react/jsx-no-constructed-context-values */
import murmurhash from 'murmurhash'

import { multiSelectXml, selectXml } from '../mocks/FormElement'
import { Select } from '../../src/components/Select/Select'
import { EchoFormsContext } from '../../src/context/EchoFormsContext'
import { parseXml } from '../../src/util/parseXml'

const readXml = (file) => {
  const doc = parseXml(file)
  const inputResult = document.evaluate('//*[local-name()="select"]', doc)
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
    multiple: false,
    parentRef: 'parentRef',
    readOnly: false,
    required: false,
    value: ['test value 1'],
    valueElementName: 'value',
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
      <Select {...props}>
        {input.children}
      </Select>
    </EchoFormsContext.Provider>
  )
}

describe('Select component', () => {
  it('renders a select element', () => {
    setup(selectXml)

    cy.get('#testfield')
      .and('have.value', 'test value 1')
      .and('have.attr', 'name', 'Test Field')
      .and('have.attr', 'id', 'testfield')
      .and('not.have.attr', 'readOnly', 'multiple')

    cy.get('#testfield').children('option').should('have.length', 2)
    cy.get('#testfield').children('option').first()
      .should('have.value', 'test value 1')
      .and('have.text', 'test label 1')
    cy.get('#testfield').children('option').last()
      .should('have.value', 'test value 2')
      .and('have.text', 'test label 2')

    cy.get('label')
      .should('have.text', 'Test Field')
      .and('have.attr', 'for', 'testfield')
  })

  it('renders a select element with no default value', () => {
    setup(selectXml, { value: [] })

    cy.get('#testfield')
      .and('have.value', '-- No selection --')
      .and('have.attr', 'name', 'Test Field')
      .and('have.attr', 'id', 'testfield')
      .and('not.have.attr', 'readOnly', 'multiple')

    cy.get('#testfield').children('option').should('have.length', 3)
    cy.get('#testfield').children('option').first()
      .should('have.value', '-- No selection --')
      .and('have.text', ' -- No selection -- ')
    cy.get('#testfield').children('option').eq(1)
      .should('have.value', 'test value 1')
      .and('have.text', 'test label 1')
    cy.get('#testfield').children('option').last()
      .should('have.value', 'test value 2')
      .and('have.text', 'test label 2')

    cy.get('label')
      .should('have.text', 'Test Field')
      .and('have.attr', 'for', 'testfield')
  })

  it('renders a required select element with no default value', () => {
    setup(selectXml, {
      required: true,
      value: []
    })

    cy.get('#testfield')
      .and('have.value', '-- Select a value --')
      .and('have.attr', 'name', 'Test Field')
      .and('have.attr', 'id', 'testfield')
      .and('not.have.attr', 'readOnly', 'multiple')

    cy.get('#testfield').children('option').should('have.length', 3)
    cy.get('#testfield').children('option').first()
      .should('have.value', '-- Select a value --')
      .and('have.text', ' -- Select a value -- ')
    cy.get('#testfield').children('option').eq(1)
      .should('have.value', 'test value 1')
      .and('have.text', 'test label 1')
    cy.get('#testfield').children('option').last()
      .should('have.value', 'test value 2')
      .and('have.text', 'test label 2')

    cy.get('div.invalid-feedback').should('have.text', 'Required field')

    cy.get('label')
      .should('have.text', 'Test Field')
      .and('have.attr', 'for', 'testfield')
  })

  it('renders a multiselect element', () => {
    setup(multiSelectXml, { multiple: true })

    cy.get('#testfield')
      .and('have.attr', 'name', 'Test Field')
      .and('have.attr', 'id', 'testfield')
      .and('have.attr', 'multiple', 'multiple')
      .and('not.have.attr', 'readOnly')

    cy.get('#testfield').invoke('val')
      .should('deep.equal', ['test value 1'])

    cy.get('#testfield').children('option').should('have.length', 2)
    cy.get('#testfield').children('option').first()
      .should('have.value', 'test value 1')
      .and('have.text', 'test label 1')
    cy.get('#testfield').children('option').last()
      .should('have.value', 'test value 2')
      .and('have.text', 'test label 2')

    cy.get('label')
      .should('have.text', 'Test Field')
      .and('have.attr', 'for', 'testfield')
  })

  it('onChange calls onUpdateModel', () => {
    setup(selectXml)

    cy.get('#testfield').select('test value 2')

    cy.get('@onUpdateModelSpy')
      .should('have.been.calledOnce')
      .and('have.been.calledWith', 'parentRef', 'testfield', {
        value: ['test value 2'],
        valueElementName: 'value'
      })
  })
})
