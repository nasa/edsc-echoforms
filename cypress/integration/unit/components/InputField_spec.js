import React from 'react'
import Adapter from 'enzyme-adapter-react-16'
import chaiEnzyme from 'chai-enzyme'
import { configure, shallow } from 'enzyme'

import { InputField } from '../../../../src/components/InputField/InputField'

chai.use(chaiEnzyme())
configure({ adapter: new Adapter() })

function setup() {
  const props = {
    label: 'Test Field',
    id: 'testfield',
    modelRef: 'testfield',
    readOnly: false,
    required: false,
    value: 'test value',
    onUpdateModel: cy.spy().as('onUpdateModel')
  }

  const enzymeWrapper = shallow(<InputField {...props} />)

  return {
    enzymeWrapper,
    props
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

  it('onChange calls onUpdateModel', () => {
    const { enzymeWrapper, props } = setup()

    const input = enzymeWrapper.find('input')

    input.props().onChange({ target: { value: 'New Value' } })

    expect(props.onUpdateModel.calledOnce).to.eq(true)
    expect(props.onUpdateModel.getCall(0).args[0]).to.eq('testfield')
    expect(props.onUpdateModel.getCall(0).args[1]).to.eq('New Value')
  })
})
