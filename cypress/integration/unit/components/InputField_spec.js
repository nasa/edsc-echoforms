import React from 'react'
import Adapter from 'enzyme-adapter-react-16'
import chaiEnzyme from 'chai-enzyme'
import { configure, mount } from 'enzyme'

import { InputField } from '../../../../src/components/InputField/InputField'
import { EchoFormsContext } from '../../../../src/util/EchoFormsContext'

chai.use(chaiEnzyme())
configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    label: 'Test Field',
    id: 'testfield',
    modelRef: 'testfield',
    placeholder: '',
    readOnly: false,
    required: false,
    value: 'test value',
    ...overrideProps
  }

  const onUpdateModel = cy.spy().as('onUpdateModel')
  const enzymeWrapper = mount(
    <EchoFormsContext.Provider value={{ onUpdateModel }}>
      <InputField {...props} />
    </EchoFormsContext.Provider>
  )

  return {
    enzymeWrapper,
    props,
    onUpdateModel
  }
}

describe('InputField component', () => {
  it('renders an input element', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find('input').length).to.eq(1)
    expect(enzymeWrapper.find('input').props()).to.have.property('value', 'test value')
    expect(enzymeWrapper.find('input').props()).to.have.property('name', 'Test Field')
    expect(enzymeWrapper.find('input').props()).to.have.property('id', 'testfield')
    expect(enzymeWrapper.find('input').props()).to.have.property('readOnly', false)
    expect(enzymeWrapper.find('input').props()).to.have.property('type', null)
  })

  it('renders an input element with a placeholder', () => {
    const { enzymeWrapper } = setup({
      placeholder: 'YYYY-MM-DDTHH:MM:SS'
    })

    expect(enzymeWrapper.find('input').length).to.eq(1)
    expect(enzymeWrapper.find('input').props()).to.have.property('value', 'test value')
    expect(enzymeWrapper.find('input').props()).to.have.property('name', 'Test Field')
    expect(enzymeWrapper.find('input').props()).to.have.property('id', 'testfield')
    expect(enzymeWrapper.find('input').props()).to.have.property('readOnly', false)
    expect(enzymeWrapper.find('input').props()).to.have.property('type', null)
    expect(enzymeWrapper.find('input').props()).to.have.property('placeholder', 'YYYY-MM-DDTHH:MM:SS')
  })

  it('onChange calls onUpdateModel', () => {
    const { enzymeWrapper, onUpdateModel } = setup()

    const input = enzymeWrapper.find('input')

    input.props().onChange({ target: { value: 'New Value' } })

    expect(onUpdateModel.calledOnce).to.eq(true)
    expect(onUpdateModel.getCall(0).args[0]).to.eq('testfield')
    expect(onUpdateModel.getCall(0).args[1]).to.eq('New Value')
  })
})