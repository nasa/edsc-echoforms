import React from 'react'
import Adapter from 'enzyme-adapter-react-16'
import chaiEnzyme from 'chai-enzyme'
import { configure, mount } from 'enzyme'

import { Constraint } from '../../../../src/components/Constraint/Constraint'
import { parseXml } from '../../../../src/util/parseXml'
import { EchoFormsContext } from '../../../../src/context/EchoFormsContext'
import { buildXPathResolverFn } from '../../../../src/util/buildXPathResolverFn'
import {
  textfieldXml,
  textFieldWithXpathConstraintXml,
  textFieldWithPatternConstraintXml
} from '../../../mocks/FormElement'

chai.use(chaiEnzyme())
configure({ adapter: new Adapter() })

function readXml(file) {
  const doc = parseXml(file)
  const inputResult = document.evaluate('//*[local-name()="input"]', doc)
  const input = inputResult.iterateNext()
  const modelResult = document.evaluate('//*[local-name()="instance"]/*', doc)
  const model = modelResult.iterateNext()

  const resolver = buildXPathResolverFn(doc)

  return { input, model, resolver }
}

function nonConstraintElements() {
  const { input, model, resolver } = readXml(textfieldXml)
  return { elements: input.children, model, resolver }
}

function constraintElements(file) {
  const { input, model, resolver } = readXml(file)
  return { elements: input.children, model, resolver }
}

function setup(overrideProps, model, resolver) {
  const props = {
    model,
    required: false,
    type: 'double',
    value: '123',
    setFieldIsValid: cy.spy(),
    ...overrideProps
  }

  const enzymeWrapper = mount(
    <EchoFormsContext.Provider value={{ model, resolver }}>
      <Constraint {...props} />
    </EchoFormsContext.Provider>
  )

  return {
    enzymeWrapper,
    props
  }
}

describe('Constraint component', () => {
  it('does not render an error with no constraints', () => {
    const { elements, model, resolver } = nonConstraintElements()
    const { enzymeWrapper, props } = setup({
      elements
    }, model, resolver)

    const { setFieldIsValid } = props

    expect(setFieldIsValid).to.be.calledWith(true)

    expect(enzymeWrapper.find('div.invalid-feedback')).to.have.length(0)
  })

  it('does not render an error with passing constraints', () => {
    const { elements, model, resolver } = constraintElements(textFieldWithPatternConstraintXml)
    const { enzymeWrapper, props } = setup({
      elements,
      type: 'string',
      value: 'test value'
    }, model, resolver)

    const { setFieldIsValid } = props

    expect(setFieldIsValid).to.be.calledWith(true)

    expect(enzymeWrapper.find('div.invalid-feedback')).to.have.length(0)
  })

  it('renders a required field error', () => {
    const { elements, model, resolver } = nonConstraintElements()
    const { enzymeWrapper, props } = setup({
      elements,
      required: true,
      value: ''
    }, model, resolver)

    const { setFieldIsValid } = props

    expect(setFieldIsValid).to.be.calledWith(false)

    const error = enzymeWrapper.find('div.invalid-feedback')
    expect(error).to.have.length(1)
    expect(error.text()).to.eq('Required field')
  })

  it('renders basic validation errors', () => {
    const { elements, model, resolver } = nonConstraintElements()
    const { enzymeWrapper, props } = setup({
      elements,
      value: 'adsf'
    }, model, resolver)

    const { setFieldIsValid } = props

    expect(setFieldIsValid).to.be.calledWith(false)

    const error = enzymeWrapper.find('div.invalid-feedback')
    expect(error).to.have.length(1)
    expect(error.text()).to.eq('Value must be a number')
  })

  it('renders xpath constraint errors', () => {
    const { elements, model, resolver } = constraintElements(textFieldWithXpathConstraintXml)
    const { enzymeWrapper, props } = setup({
      elements,
      value: ''
    }, model, resolver)

    const { setFieldIsValid } = props

    expect(setFieldIsValid).to.be.calledWith(false)

    const error = enzymeWrapper.find('div.invalid-feedback')
    expect(error).to.have.length(1)
    expect(error.text()).to.eq('Value must be "test value"')
  })

  it('renders pattern constraint errors', () => {
    const { elements, model, resolver } = constraintElements(textFieldWithPatternConstraintXml)
    const { enzymeWrapper, props } = setup({
      elements,
      value: ''
    }, model, resolver)

    const { setFieldIsValid } = props

    expect(setFieldIsValid).to.be.calledWith(false)

    const error = enzymeWrapper.find('div.invalid-feedback')
    expect(error).to.have.length(1)
    expect(error.text()).to.eq('Value must be "test value"')
  })

  it('renders a manual error', () => {
    const { elements, model, resolver } = nonConstraintElements()
    const { enzymeWrapper, props } = setup({
      elements,
      manualError: 'No more than 4 parameters can be selected.'
    }, model, resolver)

    const { setFieldIsValid } = props

    expect(setFieldIsValid).to.be.calledWith(false)

    const error = enzymeWrapper.find('div.invalid-feedback')
    expect(error).to.have.length(1)
    expect(error.text()).to.eq('No more than 4 parameters can be selected.')
  })
})
