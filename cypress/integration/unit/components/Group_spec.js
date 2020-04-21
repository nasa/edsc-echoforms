import React from 'react'
import Adapter from 'enzyme-adapter-react-16'
import chaiEnzyme from 'chai-enzyme'
import { configure, shallow } from 'enzyme'

import { Group } from '../../../../src/components/Group/Group'
import { FormElement } from '../../../../src/components/FormElement/FormElement'
import { parseXml } from '../../../../src/util/parseXml'
import { groupXml } from '../../../mocks/FormElement'

chai.use(chaiEnzyme())
configure({ adapter: new Adapter() })

function createItem(label, value) {
  const input = document.createElementNS('', 'input')
  input.setAttribute('id', 'testfield')
  input.setAttribute('label', label)
  input.setAttribute('ref', 'childref')
  input.setAttribute('value', value)
  return input
}

function readXml(file) {
  const doc = parseXml(file)
  const uiResult = document.evaluate('//*[local-name()="ui"]', doc)
  const ui = uiResult.iterateNext()
  const modelResult = document.evaluate('//*[local-name()="instance"]/*', doc)
  const model = modelResult.iterateNext()

  return { model, ui }
}

function setup(overrideProps) {
  const { model } = readXml(groupXml)
  const props = {
    id: 'testgroup',
    label: 'Test Group',
    model,
    modelRef: 'prov:groupreference',
    onUpdateModel: cy.spy().as('onUpdateModel'),
    ...overrideProps
  }

  const children = [
    createItem('test label 1', 'test value 1')
  ]

  const enzymeWrapper = shallow(
    <Group {...props}>
      {children}
    </Group>
  )

  return {
    enzymeWrapper,
    props
  }
}

describe('Group component', () => {
  it('renders a FormElement component', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find('div.group').props().id).to.eq('testgroup')
    expect(enzymeWrapper.find('.group__header').text()).to.eq('Test Group')

    const formElement = enzymeWrapper.find(FormElement)

    expect(formElement.length).to.eq(1)
    expect(formElement.props().model.outerHTML).to.eq('<prov:groupreference xmlns:prov="http://www.example.com/orderoptions"><prov:textreference>test value</prov:textreference></prov:groupreference>')
    expect(formElement.props().parentReadOnly).to.eq(undefined)

    expect(formElement.props().element.attributes.id.value).to.eq('testfield')
    expect(formElement.props().element.attributes.label.value).to.eq('test label 1')
    expect(formElement.props().element.attributes.ref.value).to.eq('childref')
    expect(formElement.props().element.attributes.value.value).to.eq('test value 1')
  })

  it('renders a FormElement component and passes on readonly prop', () => {
    const { enzymeWrapper } = setup({
      readOnly: true
    })

    expect(enzymeWrapper.find(FormElement).props().parentReadOnly).to.eq(true)
  })
})
