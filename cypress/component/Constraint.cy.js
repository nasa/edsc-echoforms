/* eslint-disable react/react-in-jsx-scope, react/jsx-no-constructed-context-values */
import {
  textFieldWithPatternConstraintXml,
  textFieldWithXpathConstraintXml,
  textfieldXml
} from '../mocks/FormElement'
import { Constraint } from '../../src/components/Constraint/Constraint'
import { EchoFormsContext } from '../../src/context/EchoFormsContext'
import { buildXPathResolverFn } from '../../src/util/buildXPathResolverFn'
import { parseXml } from '../../src/util/parseXml'

function readXml(file) {
  const doc = parseXml(file)
  const inputResult = document.evaluate('//*[local-name()="input"]', doc)
  const input = inputResult.iterateNext()
  const modelResult = document.evaluate('//*[local-name()="instance"]', doc)
  const model = modelResult.iterateNext()

  const resolver = buildXPathResolverFn(doc)

  return {
    input,
    model,
    resolver
  }
}

const nonConstraintElements = () => {
  const { input, model, resolver } = readXml(textfieldXml)

  return {
    elements: input.children,
    model,
    resolver
  }
}

const constraintElements = (file) => {
  const { input, model, resolver } = readXml(file)

  return {
    elements: input.children,
    model,
    resolver
  }
}

const setup = (overrideProps, model, resolver) => {
  const setFormIsValidSpy = cy.spy().as('setFormIsValidSpy')

  const props = {
    model,
    required: false,
    type: 'double',
    value: '123',
    setFieldIsValid: setFormIsValidSpy,
    ...overrideProps
  }

  const contextValue = {
    model,
    resolver
  }

  cy.mount(
    <EchoFormsContext.Provider
      value={contextValue}
    >
      <Constraint {...props} />
    </EchoFormsContext.Provider>
  )
}

describe('Constraint component', () => {
  it('does not render an error with no constraints', () => {
    const { elements, model, resolver } = nonConstraintElements()
    setup({
      elements
    }, model, resolver)

    cy.get('@setFormIsValidSpy')
      .should('have.been.calledOnce')
      .and('have.been.calledWith', true)

    cy.get('div.invalid-feedback').should('not.exist')
  })

  it('does not render an error with passing constraints', () => {
    const { elements, model, resolver } = constraintElements(textFieldWithPatternConstraintXml)
    setup({
      elements,
      type: 'string',
      value: 'test value'
    }, model, resolver)

    cy.get('@setFormIsValidSpy')
      .should('have.been.calledOnce')
      .and('have.been.calledWith', true)

    cy.get('div.invalid-feedback').should('not.exist')
  })

  it('renders a required field error', () => {
    const { elements, model, resolver } = nonConstraintElements()
    setup({
      elements,
      required: true,
      value: ''
    }, model, resolver)

    cy.get('@setFormIsValidSpy')
      .should('have.been.calledOnce')
      .and('have.been.calledWith', false)

    cy.get('div.invalid-feedback').should('have.text', 'Required field')
  })

  it('renders basic validation errors', () => {
    const { elements, model, resolver } = nonConstraintElements()
    setup({
      elements,
      value: 'adsf'
    }, model, resolver)

    cy.get('@setFormIsValidSpy')
      .should('have.been.calledOnce')
      .and('have.been.calledWith', false)

    cy.get('div.invalid-feedback').should('have.text', 'Value must be a number')
  })

  it('renders xpath constraint errors', () => {
    const { elements, model, resolver } = constraintElements(textFieldWithXpathConstraintXml)
    setup({
      elements,
      value: ''
    }, model, resolver)

    cy.get('@setFormIsValidSpy')
      .should('have.been.calledOnce')
      .and('have.been.calledWith', false)

    cy.get('div.invalid-feedback').should('have.text', 'Value must be "test value"')
  })

  it('renders pattern constraint errors', () => {
    const { elements, model, resolver } = constraintElements(textFieldWithPatternConstraintXml)
    setup({
      elements,
      value: ''
    }, model, resolver)

    cy.get('@setFormIsValidSpy')
      .should('have.been.calledOnce')
      .and('have.been.calledWith', false)

    cy.get('div.invalid-feedback').should('have.text', 'Value must be "test value"')
  })

  it('renders a manual error', () => {
    const { elements, model, resolver } = nonConstraintElements()
    setup({
      elements,
      manualError: 'No more than 4 parameters can be selected.'
    }, model, resolver)

    cy.get('@setFormIsValidSpy')
      .should('have.been.calledOnce')
      .and('have.been.calledWith', false)

    cy.get('div.invalid-feedback').should('have.text', 'No more than 4 parameters can be selected.')
  })
})
