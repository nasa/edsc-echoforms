import React from 'react'
import Adapter from 'enzyme-adapter-react-16'
import chaiEnzyme from 'chai-enzyme'
import { configure, mount } from 'enzyme'

import { Select } from '../../../../src/components/Select/Select'
import { EchoFormsContext } from '../../../../src/context/EchoFormsContext'
import { selectXml } from '../../../mocks/FormElement'
import { parseXml } from '../../../../src/util/parseXml'

chai.use(chaiEnzyme())
configure({ adapter: new Adapter() })

function readXml(file) {
  const doc = parseXml(file)
  const selectResult = document.evaluate('//*[local-name()="select"]', doc)
  const select = selectResult.iterateNext()

  return { select }
}

function setup(overrideProps) {
  const { select } = readXml(selectXml)
  const props = {
    id: 'testfield',
    label: 'Test Field',
    modelRef: 'testfield',
    multiple: false,
    readOnly: false,
    required: false,
    value: ['test value'],
    valueElementName: 'value',
    ...overrideProps
  }

  const onUpdateModel = cy.spy().as('onUpdateModel')
  const enzymeWrapper = mount(
    <EchoFormsContext.Provider value={{ onUpdateModel }}>
      <Select {...props}>
        {select.children}
      </Select>
    </EchoFormsContext.Provider>
  )

  return {
    enzymeWrapper,
    props,
    onUpdateModel
  }
}

describe('Select component', () => {
  it('renders a select element', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find('select').length).to.eq(1)
    expect(enzymeWrapper.find('select').props().value).to.eq('test value')
    expect(enzymeWrapper.find('select').props().name).to.eq('Test Field')
    expect(enzymeWrapper.find('select').props().id).to.eq('testfield')
    expect(enzymeWrapper.find('select').props().readOnly).to.eq(false)
    expect(enzymeWrapper.find('select').props().multiple).to.eq(false)
    expect(enzymeWrapper.find('select').props().children[0].props).to.eql({
      value: 'test value 1',
      children: 'test label 1'
    })
    expect(enzymeWrapper.find('select').props().children[1].props).to.eql({
      value: 'test value 2',
      children: 'test label 2'
    })
  })

  it('renders a multiselect element', () => {
    const { enzymeWrapper } = setup({ multiple: true })

    expect(enzymeWrapper.find('select').length).to.eq(1)
    expect(enzymeWrapper.find('select').props().value).to.eql(['test value'])
    expect(enzymeWrapper.find('select').props().name).to.eq('Test Field')
    expect(enzymeWrapper.find('select').props().id).to.eq('testfield')
    expect(enzymeWrapper.find('select').props().readOnly).to.eq(false)
    expect(enzymeWrapper.find('select').props().multiple).to.eq(true)
    expect(enzymeWrapper.find('select').props().children[0].props).to.eql({
      value: 'test value 1',
      children: 'test label 1'
    })
    expect(enzymeWrapper.find('select').props().children[1].props).to.eql({
      value: 'test value 2',
      children: 'test label 2'
    })
  })

  it('onChange calls onUpdateModel', () => {
    const { enzymeWrapper, onUpdateModel } = setup()

    const Select = enzymeWrapper.find('select')

    Select.props().onChange({ target: { selectedOptions: [{ value: 'New Value' }] } })

    expect(onUpdateModel.calledOnce).to.eq(true)
    expect(onUpdateModel.getCall(0).args[0]).to.eq('testfield')
    expect(onUpdateModel.getCall(0).args[1]).to.eql([{
      value: 'New Value',
      valueElementName: 'value'
    }])
  })
})
