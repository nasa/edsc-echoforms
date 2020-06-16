import React from 'react'
import Adapter from 'enzyme-adapter-react-16'
import chaiEnzyme from 'chai-enzyme'
import { configure, mount } from 'enzyme'

import { Group } from '../../../../src/components/Group/Group'
import { FormElement } from '../../../../src/components/FormElement/FormElement'
import { parseXml } from '../../../../src/util/parseXml'
import { groupXml } from '../../../mocks/FormElement'
import { Help } from '../../../../src/components/Help/Help'
import { EchoFormsContext } from '../../../../src/context/EchoFormsContext'
import { buildXPathResolverFn } from '../../../../src/util/buildXPathResolverFn'

chai.use(chaiEnzyme())
configure({ adapter: new Adapter() })

function readXml(file) {
  const doc = parseXml(file)
  const groupResult = document.evaluate('//*[local-name()="group"]', doc)
  const group = groupResult.iterateNext()
  const modelResult = document.evaluate('//*[local-name()="instance"]', doc)
  const model = modelResult.iterateNext()

  const resolver = buildXPathResolverFn(doc)

  return {
    // Use firstElementChild because FormElement doesn't deal with <instance>
    model: model.firstElementChild,
    group,
    resolver
  }
}

function setup(overrideProps) {
  const { model, group, resolver } = readXml(groupXml)
  const props = {
    id: 'testgroup',
    label: 'Test Group',
    model,
    modelRef: 'prov:groupreference',
    onUpdateModel: cy.spy().as('onUpdateModel'),
    ...overrideProps
  }

  const enzymeWrapper = mount(
    <EchoFormsContext.Provider
      value={{
        resolver,
        setRelevantFields: () => {},
        setFormIsValid: () => {},
        onUpdateModel: () => {}
      }}
    >
      <Group {...props}>
        {group.children}
      </Group>
    </EchoFormsContext.Provider>
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
    expect(enzymeWrapper.find('.group__header').text()).to.contain('Test Group')

    const formElement = enzymeWrapper.find(FormElement)

    expect(formElement.length).to.eq(1)
    expect(formElement.props().model.outerHTML).to.eq('<prov:groupreference xmlns:prov="http://www.example.com/orderoptions"><prov:textreference>test value</prov:textreference></prov:groupreference>')
    expect(formElement.props().parentReadOnly).to.eq(undefined)
    expect(formElement.props().parentRef).to.eq('prov:groupreference')

    expect(formElement.props().element.outerHTML).to.eq('<input id="textinput" label="Text input" ref="prov:textreference" type="xs:string"><help>Helpful text</help></input>')
  })

  it('renders a FormElement component and with a combined parentRef', () => {
    const { enzymeWrapper } = setup({
      parentRef: 'prov:parent'
    })

    expect(enzymeWrapper.find(FormElement).props().parentRef).to.eq('prov:parent/prov:groupreference')
  })

  it('renders a FormElement component and passes on readonly prop', () => {
    const { enzymeWrapper } = setup({
      readOnly: true
    })

    expect(enzymeWrapper.find(FormElement).props().parentReadOnly).to.eq(true)
  })

  it('renders a help component in the group header', () => {
    const { enzymeWrapper } = setup()
    const header = enzymeWrapper.find('.group__header')

    expect(header.find(Help).props().elements[0].outerHTML).to.eq('<help>Helpful group text</help>')
  })
})
