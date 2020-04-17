import React from 'react'
import * as ReactDOM from 'react-dom'
import Adapter from 'enzyme-adapter-react-16'
import chaiEnzyme from 'chai-enzyme'
import { configure, shallow } from 'enzyme'

import { Checkbox } from '../../../../src/components/Checkbox/Checkbox'
import { FormElement } from '../../../../src/components/FormElement/FormElement'
import { Output } from '../../../../src/components/Output/Output'
import { parseXml } from '../../../../src/util/parseXml'
import { SecretField } from '../../../../src/components/SecretField/SecretField'
import { Select } from '../../../../src/components/Select/Select'
import { TextArea } from '../../../../src/components/TextArea/TextArea'
import { TextField } from '../../../../src/components/TextField/TextField'
import {
  checkboxXml,
  datetimeXml,
  groupXml,
  multiSelectXml,
  notRelevantXml,
  outputXml,
  readOnlyXml,
  secretXml,
  selectXml,
  textareaXml,
  textfieldXml,
  urlOutputXml
} from '../../../mocks/FormElement'
import { DateTime } from '../../../../src/components/DateTime/DateTime'
import { Group } from '../../../../src/components/Group/Group'

window.ReactDOM = ReactDOM

chai.use(chaiEnzyme())
configure({ adapter: new Adapter() })

function readXml(file) {
  const doc = parseXml(file)
  const uiResult = document.evaluate('//*[local-name()="ui"]', doc)
  const ui = uiResult.iterateNext()
  const modelResult = document.evaluate('//*[local-name()="instance"]/*', doc)
  const model = modelResult.iterateNext()

  return { model, ui }
}

describe('FormElement component', () => {
  it('renders a Checkbox component', () => {
    const { model, ui } = readXml(checkboxXml)

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
    const { model, ui } = readXml(textfieldXml)

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

  it('renders a secret TextField component', () => {
    const { model, ui } = readXml(secretXml)

    const onUpdateModelSpy = cy.spy().as('onUpdateModel')

    const component = shallow(<FormElement
      element={ui.children[0]}
      model={model}
      onUpdateModel={onUpdateModelSpy}
    />)

    const secretfield = component.find(SecretField)

    expect(secretfield).to.have.lengthOf(1)
    expect(secretfield.props()).to.have.property('value', 'test value')
    expect(secretfield.props()).to.have.property('label', 'Secret')
    expect(secretfield.props()).to.have.property('modelRef', 'prov:textreference')
    expect(secretfield.props()).to.have.property('readOnly', false)
    expect(secretfield.props()).to.have.property('required', false)
  })

  it('renders a TextArea component', () => {
    const { model, ui } = readXml(textareaXml)

    const onUpdateModelSpy = cy.spy().as('onUpdateModel')

    const component = shallow(<FormElement
      element={ui.children[0]}
      model={model}
      onUpdateModel={onUpdateModelSpy}
    />)

    const textarea = component.find(TextArea)

    expect(textarea).to.have.lengthOf(1)
    expect(textarea.props()).to.have.property('value', 'test value')
    expect(textarea.props()).to.have.property('label', 'Textarea input')
    expect(textarea.props()).to.have.property('modelRef', 'prov:textreference')
    expect(textarea.props()).to.have.property('readOnly', false)
    expect(textarea.props()).to.have.property('required', false)
  })

  it('renders a Select component', () => {
    const { model, ui } = readXml(selectXml)

    const onUpdateModelSpy = cy.spy().as('onUpdateModel')

    const component = shallow(<FormElement
      element={ui.children[0]}
      model={model}
      onUpdateModel={onUpdateModelSpy}
    />)

    const select = component.find(Select)

    expect(select).to.have.lengthOf(1)
    expect(select.props().value).to.eql(['value 1', 'value 2'])
    expect(select.props()).to.have.property('label', 'Select input')
    expect(select.props()).to.have.property('modelRef', 'prov:selectreference')
    expect(select.props()).to.have.property('multiple', false)
    expect(select.props()).to.have.property('readOnly', false)
    expect(select.props()).to.have.property('required', false)
    expect(select.props()).to.have.property('valueElementName', 'value')
  })

  it('renders a multi-Select component', () => {
    const { model, ui } = readXml(multiSelectXml)

    const onUpdateModelSpy = cy.spy().as('onUpdateModel')

    const component = shallow(<FormElement
      element={ui.children[0]}
      model={model}
      onUpdateModel={onUpdateModelSpy}
    />)

    const select = component.find(Select)

    expect(select).to.have.lengthOf(1)
    expect(select.props().value).to.eql(['value 1', 'value 2'])
    expect(select.props()).to.have.property('label', 'Select input')
    expect(select.props()).to.have.property('modelRef', 'prov:selectreference')
    expect(select.props()).to.have.property('multiple', true)
    expect(select.props()).to.have.property('readOnly', false)
    expect(select.props()).to.have.property('required', false)
    expect(select.props()).to.have.property('valueElementName', 'value')
  })

  it('renders a DateTime component', () => {
    const { model, ui } = readXml(datetimeXml)

    const onUpdateModelSpy = cy.spy().as('onUpdateModel')

    const component = shallow(<FormElement
      element={ui.children[0]}
      model={model}
      onUpdateModel={onUpdateModelSpy}
    />)

    const datetime = component.find(DateTime)

    expect(datetime).to.have.lengthOf(1)
    expect(datetime.props()).to.have.property('value', '2020-01-01T00:00:00')
    expect(datetime.props()).to.have.property('label', 'DateTime input')
    expect(datetime.props()).to.have.property('modelRef', 'prov:datetimereference')
    expect(datetime.props()).to.have.property('readOnly', false)
    expect(datetime.props()).to.have.property('required', false)
  })

  it('renders an Output component', () => {
    const { model, ui } = readXml(outputXml)

    const onUpdateModelSpy = cy.spy().as('onUpdateModel')

    const component = shallow(<FormElement
      element={ui.children[0]}
      model={model}
      onUpdateModel={onUpdateModelSpy}
    />)

    const output = component.find(Output)

    expect(output).to.have.lengthOf(1)
    expect(output.props()).to.have.property('value', 'test value')
    expect(output.props()).to.have.property('label', 'Output')
    expect(output.props()).to.have.property('required', false)
  })

  it('renders an URL Output component', () => {
    const { model, ui } = readXml(urlOutputXml)

    const onUpdateModelSpy = cy.spy().as('onUpdateModel')

    const component = shallow(<FormElement
      element={ui.children[0]}
      model={model}
      onUpdateModel={onUpdateModelSpy}
    />)

    const output = component.find(Output)

    expect(output).to.have.lengthOf(1)
    expect(output.props()).to.have.property('value', 'test value')
    expect(output.props()).to.have.property('label', 'URL Output')
    expect(output.props()).to.have.property('required', false)
  })

  it('does not render a field that is not relevant', () => {
    const { model, ui } = readXml(notRelevantXml)

    const onUpdateModelSpy = cy.spy().as('onUpdateModel')

    const component = shallow(<FormElement
      element={ui.children[1]} // render the text field
      model={model}
      onUpdateModel={onUpdateModelSpy}
    />)

    expect(component.find(TextField)).to.have.lengthOf(0)
  })

  it('renders a readonly field as readonly', () => {
    const { model, ui } = readXml(readOnlyXml)

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

  it('renders a Group component', () => {
    const { model, ui } = readXml(groupXml)

    const onUpdateModelSpy = cy.spy().as('onUpdateModel')

    const component = shallow(<FormElement
      element={ui.children[0]}
      model={model}
      onUpdateModel={onUpdateModelSpy}
    />)

    const group = component.find(Group)

    expect(group).to.have.lengthOf(1)
    expect(group.props()).to.have.property('id', 'group')
    expect(group.props()).to.have.property('label', 'Group')
    expect(group.props()).to.have.property('modelRef', 'prov:groupreference')
    expect(group.props()).to.have.property('readOnly', false)
    expect(group.props()).to.have.property('required', false)
  })

  it('handles parent props', () => {
    const { model, ui } = readXml(textfieldXml)

    const onUpdateModelSpy = cy.spy().as('onUpdateModel')

    const component = shallow(<FormElement
      element={ui.children[0]}
      model={model}
      parentModelRef="prov:groupreference"
      parentReadOnly
      parentRequired
      onUpdateModel={onUpdateModelSpy}
    />)

    const textfield = component.find(TextField)

    expect(textfield).to.have.lengthOf(1)
    expect(textfield.props()).to.have.property('value', 'test value')
    expect(textfield.props()).to.have.property('label', 'Text input')
    expect(textfield.props()).to.have.property('modelRef', 'prov:groupreference/prov:textreference')
    expect(textfield.props()).to.have.property('readOnly', true)
    expect(textfield.props()).to.have.property('required', true)
  })
})
