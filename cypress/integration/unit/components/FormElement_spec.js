import React from 'react'
import * as ReactDOM from 'react-dom'
import Adapter from 'enzyme-adapter-react-16'
import chaiEnzyme from 'chai-enzyme'
import { configure, mount } from 'enzyme'

import { Checkbox } from '../../../../src/components/Checkbox/Checkbox'
import { DateTime } from '../../../../src/components/DateTime/DateTime'
import { FormElement } from '../../../../src/components/FormElement/FormElement'
import { Group } from '../../../../src/components/Group/Group'
import { Number } from '../../../../src/components/Number/Number'
import { Output } from '../../../../src/components/Output/Output'
import { parseXml } from '../../../../src/util/parseXml'
import { Range } from '../../../../src/components/Range/Range'
import { SecretField } from '../../../../src/components/SecretField/SecretField'
import { Select } from '../../../../src/components/Select/Select'
import { TextArea } from '../../../../src/components/TextArea/TextArea'
import { TextField } from '../../../../src/components/TextField/TextField'
import {
  checkboxXml,
  datetimeXml,
  doubleXml,
  groupXml,
  integerXml,
  longXml,
  multiSelectXml,
  notRelevantXml,
  outputXml,
  rangeXml,
  readOnlyXml,
  secretXml,
  selectXml,
  selectrefXml,
  shortXml,
  textareaXml,
  textfieldXml,
  urlOutputXml,
  treeXml
} from '../../../mocks/FormElement'
import { buildXPathResolverFn } from '../../../../src/util/buildXPathResolverFn'
import { EchoFormsContext } from '../../../../src/context/EchoFormsContext'
import { Tree } from '../../../../src/components/Tree/Tree'

window.ReactDOM = ReactDOM

chai.use(chaiEnzyme())
configure({ adapter: new Adapter() })

function readXml(file) {
  const doc = parseXml(file)
  const uiResult = document.evaluate('//*[local-name()="ui"]', doc)
  const ui = uiResult.iterateNext()
  const modelResult = document.evaluate('//*[local-name()="instance"]', doc)
  const model = modelResult.iterateNext()

  const resolver = buildXPathResolverFn(doc)

  return {
    // Use firstElementChild because FormElement doesn't deal with <instance>
    model: model.firstElementChild,
    ui,
    resolver
  }
}

function setup(props, resolver) {
  const onUpdateModel = cy.spy().as('onUpdateModel')
  const enzymeWrapper = mount(
    <EchoFormsContext.Provider
      value={{
        model: props.model,
        resolver,
        setRelevantFields: () => {},
        setFormIsValid: () => {},
        onUpdateModel: () => {}
      }}
    >
      <FormElement {...props} />
    </EchoFormsContext.Provider>
  )

  return {
    enzymeWrapper,
    props,
    onUpdateModel
  }
}

describe('FormElement component', () => {
  it('renders a Checkbox component', () => {
    const { model, ui, resolver } = readXml(checkboxXml)

    const { enzymeWrapper } = setup({
      element: ui.children[0],
      model
    }, resolver)

    const checkbox = enzymeWrapper.find(Checkbox)

    expect(checkbox).to.have.lengthOf(1)
    expect(checkbox.props().checked).to.eq('true')
    expect(checkbox.props().label).to.eq('Bool input')
    expect(checkbox.props().modelRef).to.eq('prov:boolreference')
    expect(checkbox.props().readOnly).to.eq(false)
    expect(checkbox.props().required).to.eq(false)
  })

  it('renders a TextField component', () => {
    const { model, ui, resolver } = readXml(textfieldXml)

    const { enzymeWrapper } = setup({
      element: ui.children[0],
      model
    }, resolver)

    const textfield = enzymeWrapper.find(TextField)

    expect(textfield).to.have.lengthOf(1)
    expect(textfield.props().value).to.eq('test value')
    expect(textfield.props().label).to.eq('Text input')
    expect(textfield.props().modelRef).to.eq('prov:textreference')
    expect(textfield.props().readOnly).to.eq(false)
    expect(textfield.props().required).to.eq(false)
  })

  it('renders a secret TextField component', () => {
    const { model, ui, resolver } = readXml(secretXml)

    const { enzymeWrapper } = setup({
      element: ui.children[0],
      model
    }, resolver)

    const secretfield = enzymeWrapper.find(SecretField)

    expect(secretfield).to.have.lengthOf(1)
    expect(secretfield.props().value).to.eq('test value')
    expect(secretfield.props().label).to.eq('Secret')
    expect(secretfield.props().modelRef).to.eq('prov:textreference')
    expect(secretfield.props().readOnly).to.eq(false)
    expect(secretfield.props().required).to.eq(false)
  })

  it('renders a TextArea component', () => {
    const { model, ui, resolver } = readXml(textareaXml)

    const { enzymeWrapper } = setup({
      element: ui.children[0],
      model
    }, resolver)

    const textarea = enzymeWrapper.find(TextArea)

    expect(textarea).to.have.lengthOf(1)
    expect(textarea.props().value).to.eq('test value')
    expect(textarea.props().label).to.eq('Textarea input')
    expect(textarea.props().modelRef).to.eq('prov:textreference')
    expect(textarea.props().readOnly).to.eq(false)
    expect(textarea.props().required).to.eq(false)
  })

  it('renders a Select component', () => {
    const { model, ui, resolver } = readXml(selectXml)

    const { enzymeWrapper } = setup({
      element: ui.children[0],
      model
    }, resolver)

    const select = enzymeWrapper.find(Select)

    expect(select).to.have.lengthOf(1)
    expect(select.props().value).to.eql(['test value 1', 'test value 2'])
    expect(select.props().label).to.eq('Select input')
    expect(select.props().modelRef).to.eq('prov:selectreference')
    expect(select.props().multiple).to.eq(false)
    expect(select.props().readOnly).to.eq(false)
    expect(select.props().required).to.eq(false)
    expect(select.props().valueElementName).to.eq('value')
  })

  it('renders a multi-Select component', () => {
    const { model, ui, resolver } = readXml(multiSelectXml)

    const { enzymeWrapper } = setup({
      element: ui.children[0],
      model
    }, resolver)

    const select = enzymeWrapper.find(Select)

    expect(select).to.have.lengthOf(1)
    expect(select.props().value).to.eql(['value 1', 'value 2'])
    expect(select.props().label).to.eq('Select input')
    expect(select.props().modelRef).to.eq('prov:selectreference')
    expect(select.props().multiple).to.eq(true)
    expect(select.props().readOnly).to.eq(false)
    expect(select.props().required).to.eq(false)
    expect(select.props().valueElementName).to.eq('value')
  })

  it('renders a Select component for a selectref field', () => {
    const { model, ui, resolver } = readXml(selectrefXml)

    const { enzymeWrapper } = setup({
      element: ui.children[0],
      model
    }, resolver)

    const select = enzymeWrapper.find(Select)

    expect(select).to.have.lengthOf(1)
    expect(select.props().value).to.eql(['test value 1', 'test value 2'])
    expect(select.props().label).to.eq('Select input')
    expect(select.props().modelRef).to.eq('prov:selectrefReference')
    expect(select.props().multiple).to.eq(false)
    expect(select.props().readOnly).to.eq(false)
    expect(select.props().required).to.eq(false)
    expect(select.props().valueElementName).to.eq('value')
  })

  it('renders a DateTime component', () => {
    const { model, ui, resolver } = readXml(datetimeXml)

    const { enzymeWrapper } = setup({
      element: ui.children[0],
      model
    }, resolver)

    const datetime = enzymeWrapper.find(DateTime)

    expect(datetime).to.have.lengthOf(1)
    expect(datetime.props().value).to.eq('2020-01-01T00:00:00')
    expect(datetime.props().label).to.eq('DateTime input')
    expect(datetime.props().modelRef).to.eq('prov:datetimereference')
    expect(datetime.props().readOnly).to.eq(false)
    expect(datetime.props().required).to.eq(false)
  })

  it('renders an Output component', () => {
    const { model, ui, resolver } = readXml(outputXml)

    const { enzymeWrapper } = setup({
      element: ui.children[0],
      model
    }, resolver)

    const output = enzymeWrapper.find(Output)

    expect(output).to.have.lengthOf(1)
    expect(output.props().value).to.eq('test value')
    expect(output.props().label).to.eq('Output')
  })

  it('renders an URL Output component', () => {
    const { model, ui, resolver } = readXml(urlOutputXml)

    const { enzymeWrapper } = setup({
      element: ui.children[0],
      model
    }, resolver)

    const output = enzymeWrapper.find(Output)

    expect(output).to.have.lengthOf(1)
    expect(output.props().value).to.eq('test value')
    expect(output.props().label).to.eq('URL Output')
  })

  it('does not render a field that is not relevant', () => {
    const { model, ui, resolver } = readXml(notRelevantXml)

    const { enzymeWrapper } = setup({
      element: ui.children[1],
      model
    }, resolver)

    expect(enzymeWrapper.find(TextField)).to.have.lengthOf(0)
  })

  it('renders a readonly field as readonly', () => {
    const { model, ui, resolver } = readXml(readOnlyXml)

    const { enzymeWrapper } = setup({
      element: ui.children[1],
      model
    }, resolver)

    const textfield = enzymeWrapper.find(TextField)
    expect(textfield).to.have.lengthOf(1)
    expect(textfield.props().readOnly).to.eq(true)
  })

  it('renders a Group component', () => {
    const { model, ui, resolver } = readXml(groupXml)

    const { enzymeWrapper } = setup({
      element: ui.children[0],
      model
    }, resolver)

    const group = enzymeWrapper.find(Group)

    expect(group).to.have.lengthOf(1)
    expect(group.props().id).to.eq('group')
    expect(group.props().label).to.eq('Group')
    expect(group.props().modelRef).to.eq('prov:groupreference')
    expect(group.props().readOnly).to.eq(false)
  })

  it('handles parent props', () => {
    const { model, ui, resolver } = readXml(textfieldXml)

    const { enzymeWrapper } = setup({
      element: ui.children[0],
      model,
      parentReadOnly: true,
      parentRef: 'parentRef'
    }, resolver)

    const textfield = enzymeWrapper.find(TextField)

    expect(textfield).to.have.lengthOf(1)
    expect(textfield.props().value).to.eq('test value')
    expect(textfield.props().label).to.eq('Text input')
    expect(textfield.props().modelRef).to.eq('prov:textreference')
    expect(textfield.props().parentRef).to.eq('parentRef')
    expect(textfield.props().readOnly).to.eq(true)
  })

  it('renders a Range component', () => {
    const { model, ui, resolver } = readXml(rangeXml)

    const { enzymeWrapper } = setup({
      element: ui.children[0],
      model
    }, resolver)

    const range = enzymeWrapper.find(Range)

    expect(range).to.have.lengthOf(1)
    expect(range.props().value).to.eq('5')
    expect(range.props().min).to.eq('1')
    expect(range.props().max).to.eq('10')
    expect(range.props().step).to.eq('1')
    expect(range.props().label).to.eq('Range')
    expect(range.props().modelRef).to.eq('prov:rangeReference')
    expect(range.props().readOnly).to.eq(false)
    expect(range.props().required).to.eq(false)
  })

  it('renders a Number component for doubles', () => {
    const { model, ui, resolver } = readXml(doubleXml)

    const { enzymeWrapper } = setup({
      element: ui.children[0],
      model
    }, resolver)

    const datetime = enzymeWrapper.find(Number)

    expect(datetime).to.have.lengthOf(1)
    expect(datetime.props().value).to.eq('42')
    expect(datetime.props().label).to.eq('Double input')
    expect(datetime.props().modelRef).to.eq('prov:doubleReference')
    expect(datetime.props().readOnly).to.eq(false)
    expect(datetime.props().required).to.eq(false)
    expect(datetime.props().type).to.eq('double')
  })

  it('renders a Number component for integers', () => {
    const { model, ui, resolver } = readXml(integerXml)

    const { enzymeWrapper } = setup({
      element: ui.children[0],
      model
    }, resolver)

    const datetime = enzymeWrapper.find(Number)

    expect(datetime).to.have.lengthOf(1)
    expect(datetime.props().value).to.eq('42')
    expect(datetime.props().label).to.eq('Integer input')
    expect(datetime.props().modelRef).to.eq('prov:integerReference')
    expect(datetime.props().readOnly).to.eq(false)
    expect(datetime.props().required).to.eq(false)
    expect(datetime.props().type).to.eq('int')
  })

  it('renders a Number component for longs', () => {
    const { model, ui, resolver } = readXml(longXml)

    const { enzymeWrapper } = setup({
      element: ui.children[0],
      model
    }, resolver)

    const datetime = enzymeWrapper.find(Number)

    expect(datetime).to.have.lengthOf(1)
    expect(datetime.props().value).to.eq('42')
    expect(datetime.props().label).to.eq('Long input')
    expect(datetime.props().modelRef).to.eq('prov:longReference')
    expect(datetime.props().readOnly).to.eq(false)
    expect(datetime.props().required).to.eq(false)
    expect(datetime.props().type).to.eq('long')
  })

  it('renders a Number component for shorts', () => {
    const { model, ui, resolver } = readXml(shortXml)

    const { enzymeWrapper } = setup({
      element: ui.children[0],
      model
    }, resolver)

    const datetime = enzymeWrapper.find(Number)

    expect(datetime).to.have.lengthOf(1)
    expect(datetime.props().value).to.eq('42')
    expect(datetime.props().label).to.eq('Short input')
    expect(datetime.props().modelRef).to.eq('prov:shortReference')
    expect(datetime.props().readOnly).to.eq(false)
    expect(datetime.props().required).to.eq(false)
    expect(datetime.props().type).to.eq('short')
  })

  it('renders a Tree component', () => {
    const { model, ui, resolver } = readXml(treeXml)

    const { enzymeWrapper } = setup({
      element: ui.children[0],
      model
    }, resolver)

    const tree = enzymeWrapper.find(Tree)

    expect(tree).to.have.lengthOf(1)
    expect(tree.props().value).to.eql(['/Parent1'])
    expect(tree.props().cascade).to.eq(true)
    expect(tree.props().separator).to.eq('/')
    expect(tree.props().maxParameters).to.eq(null)
    expect(tree.props().valueElementName).to.eq('data_layer')
    expect(tree.props().label).to.eq('Choose datasets')
    expect(tree.props().modelRef).to.eq('prov:treeReference')
    expect(tree.props().readOnly).to.eq(false)
    expect(tree.props().required).to.eq(false)
  })
})
