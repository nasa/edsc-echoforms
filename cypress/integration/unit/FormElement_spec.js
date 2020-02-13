import React from 'react'
import * as ReactDOM from 'react-dom'
import Adapter from 'enzyme-adapter-react-16'
import chaiEnzyme from 'chai-enzyme'
import { configure, shallow } from 'enzyme'

import { FormElement } from '../../../src/components/FormElement/FormElement'
import { parseXml } from '../../../src/util/parseXml'
import { Checkbox } from '../../../src/components/Checkbox/Checkbox'
import { TextField } from '../../../src/components/TextField/TextField'
import {
  checkboxXml,
  textfieldXml,
  notRelevantXml,
  readOnlyXml
} from '../../mocks/FormElement'

window.ReactDOM = ReactDOM

// HACK: chai-enzyme does not play nice with chai-jquery, so remove the
// problem-causing assertions that collide with chai-jquery
'visible hidden selected checked enabled disabled'.split(' ').forEach((selector) => {
  Object.defineProperty(chai.Assertion.prototype, selector, { get: () => {} })
})

chai.use(chaiEnzyme())
configure({ adapter: new Adapter() })

describe('FormElement component', () => {
  it('renders a Checkbox component', () => {
    const doc = parseXml(checkboxXml)
    const uiResult = document.evaluate('//*[local-name()="ui"]', doc)
    const ui = uiResult.iterateNext()
    const modelResult = document.evaluate('//*[local-name()="instance"]/*', doc)
    const model = modelResult.iterateNext()

    const onUpdateModelSpy = cy.spy().as('onUpdateModel')

    const component = shallow(<FormElement
      element={ui.children[0]}
      model={model}
      onUpdateModel={onUpdateModelSpy}
    />)

    const checkbox = component.find(Checkbox)

    expect(checkbox).to.have.lengthOf(1)
    expect(checkbox.props()).to.have.property('checked', 'true')
    expect(checkbox.props()).to.have.property('label', 'Bool input')
    expect(checkbox.props()).to.have.property('modelRef', 'prov:boolreference')
    expect(checkbox.props()).to.have.property('readOnly', false)
    expect(checkbox.props()).to.have.property('required', false)
  })

  it('renders a TextField component', () => {
    const doc = parseXml(textfieldXml)
    const uiResult = document.evaluate('//*[local-name()="ui"]', doc)
    const ui = uiResult.iterateNext()
    const modelResult = document.evaluate('//*[local-name()="instance"]/*', doc)
    const model = modelResult.iterateNext()

    const onUpdateModelSpy = cy.spy().as('onUpdateModel')

    const component = shallow(<FormElement
      element={ui.children[0]}
      model={model}
      onUpdateModel={onUpdateModelSpy}
    />)

    const textfield = component.find(TextField)

    expect(textfield).to.have.lengthOf(1)
    expect(textfield.props()).to.have.property('value', 'test value')
    expect(textfield.props()).to.have.property('label', 'Text input')
    expect(textfield.props()).to.have.property('modelRef', 'prov:textreference')
    expect(textfield.props()).to.have.property('readOnly', false)
    expect(textfield.props()).to.have.property('required', false)
  })

  it('does not render a field that is not relevant', () => {
    const doc = parseXml(notRelevantXml)
    const uiResult = document.evaluate('//*[local-name()="ui"]', doc)
    const ui = uiResult.iterateNext()
    const modelResult = document.evaluate('//*[local-name()="instance"]/*', doc)
    const model = modelResult.iterateNext()

    const onUpdateModelSpy = cy.spy().as('onUpdateModel')

    const component = shallow(<FormElement
      element={ui.children[1]} // render the text field
      model={model}
      onUpdateModel={onUpdateModelSpy}
    />)

    expect(component.find(TextField)).to.have.lengthOf(0)
  })

  it('renders a readonly field as readonly', () => {
    const doc = parseXml(readOnlyXml)
    const uiResult = document.evaluate('//*[local-name()="ui"]', doc)
    const ui = uiResult.iterateNext()
    const modelResult = document.evaluate('//*[local-name()="instance"]/*', doc)
    const model = modelResult.iterateNext()

    const onUpdateModelSpy = cy.spy().as('onUpdateModel')

    const component = shallow(<FormElement
      element={ui.children[1]} // render the text field
      model={model}
      onUpdateModel={onUpdateModelSpy}
    />)

    const textfield = component.find(TextField)
    expect(textfield).to.have.lengthOf(1)
    expect(textfield.props()).to.have.property('readOnly', true)
  })
})
