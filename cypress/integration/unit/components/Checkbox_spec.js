import React from 'react'
import Adapter from 'enzyme-adapter-react-16'
import chaiEnzyme from 'chai-enzyme'
import { configure, shallow } from 'enzyme'

import { Checkbox } from '../../../../src/components/Checkbox/Checkbox'

chai.use(chaiEnzyme())
configure({ adapter: new Adapter() })

function setup() {
  const props = {
    checked: 'true',
    label: 'Test Field',
    id: 'testfield',
    modelRef: 'testfield',
    readOnly: false,
    required: false,
    onUpdateModel: cy.spy().as('onUpdateModel')
  }

  const enzymeWrapper = shallow(<Checkbox {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('Checkbox component', () => {
  it('renders a input field', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find('input').length).to.eq(1)
    expect(enzymeWrapper.find('input').props()).to.have.property('type', 'checkbox')
    expect(enzymeWrapper.find('input').props()).to.have.property('checked', true)
    expect(enzymeWrapper.find('input').props()).to.have.property('name', 'Test Field')
    expect(enzymeWrapper.find('input').props()).to.have.property('id', 'testfield')
    expect(enzymeWrapper.find('input').props()).to.have.property('readOnly', false)

    expect(enzymeWrapper.find('label').props()).to.have.property('children', 'Test Field')
  })

  it('onChange calls onUpdateModel', () => {
    const { enzymeWrapper, props } = setup()

    const checkbox = enzymeWrapper.find('input')

    checkbox.props().onChange({ target: { checked: false } })

    expect(props.onUpdateModel.calledOnce).to.eq(true)
    expect(props.onUpdateModel.getCall(0).args[0]).to.eq('testfield')
    expect(props.onUpdateModel.getCall(0).args[1]).to.eq(false)
  })
})
