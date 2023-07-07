/* eslint-disable react/react-in-jsx-scope, react/jsx-no-constructed-context-values */
import murmurhash from 'murmurhash'

import { checkboxXml, shapeFileCheckboxXml } from '../mocks/FormElement'
import { Checkbox } from '../../src/components/Checkbox/Checkbox'
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

const setup = (file, overrideProps, hasShapefile) => {
  const { input, model } = readXml(file)

  const onUpdateModelSpy = cy.spy().as('onUpdateModelSpy')
  const setFormIsValidSpy = cy.spy().as('setFormIsValidSpy')

  const elementHash = murmurhash.v3(input.outerHTML, 'seed')

  const props = {
    checked: 'true',
    elementHash,
    id: 'testfield',
    label: 'Test Field',
    model,
    modelRef: 'testfield',
    readOnly: false,
    required: false,
    ...overrideProps
  }

  const contextValue = {
    hasShapefile,
    onUpdateModel: onUpdateModelSpy,
    setFormIsValid: setFormIsValidSpy
  }

  cy.mount(
    <EchoFormsContext.Provider
      value={contextValue}
    >
      <Checkbox {...props}>
        {input.children}
      </Checkbox>
    </EchoFormsContext.Provider>
  )
}

describe('Checkbox component', () => {
  it('renders an input field', () => {
    setup(checkboxXml)

    cy.get('#testfield')
      .should('be.checked')
      .and('have.attr', 'type', 'checkbox')
      .and('have.attr', 'name', 'Test Field')
      .and('not.have.attr', 'readOnly')

    cy.get('label')
      .should('have.text', 'Test Field')
      .and('have.attr', 'for', 'testfield')

    cy.get('.help-text').should('have.text', 'Helpful text')
  })

  it('onChange calls onUpdateModel', () => {
    setup(checkboxXml)

    cy.get('#testfield').click()

    cy.get('@onUpdateModelSpy')
      .should('have.been.calledOnce')
      .and('have.been.calledWith', null, 'testfield', false)
  })

  it('renders a required message', () => {
    setup(checkboxXml, {
      checked: '',
      required: true
    })

    cy.get('#testfield').should('have.class', 'is-invalid')
    cy.get('.invalid-feedback').should('have.text', 'Required field')
  })

  describe('shapefiles', () => {
    it('renders a help message for a shapefile field when a shapefile exists', () => {
      setup(shapeFileCheckboxXml, { id: 'test-use-shapefile' }, true)

      cy.get('.help-text')
        .should('have.text', 'Complex shapefiles may take longer to process. You will receive an email when your files are finished processing.')
    })

    it('renders a help message for a shapefile field when a shapefile does not exists', () => {
      setup(shapeFileCheckboxXml, { id: 'test-use-shapefile' }, false)

      cy.get('input')
        .should('have.attr', 'disabled')

      cy.get('.help-text')
        .should('have.text', 'Click Back to Search and upload a KML or Shapefile to enable this option.')
    })
  })
})
