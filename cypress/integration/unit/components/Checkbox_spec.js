import React from 'react'
import Adapter from 'enzyme-adapter-react-16'
import chaiEnzyme from 'chai-enzyme'
import { configure, mount } from 'enzyme'

import { Checkbox } from '../../../../src/components/Checkbox/Checkbox'
import { EchoFormsContext } from '../../../../src/context/EchoFormsContext'

chai.use(chaiEnzyme())
configure({ adapter: new Adapter() })

function setup() {
  const props = {
    checked: 'true',
    label: 'Test Field',
    id: 'testfield',
    modelRef: 'testfield',
    readOnly: false,
    required: false
  }

  const onUpdateModel = cy.spy().as('onUpdateModel')
  const enzymeWrapper = mount(
    <EchoFormsContext.Provider value={{ onUpdateModel }}>
      <Checkbox {...props} />
    </EchoFormsContext.Provider>
  )

  return {
    enzymeWrapper,
    props,
    onUpdateModel
  }
}

describe('Checkbox component', () => {
  it('renders an input field', () => {
    const { enzymeWrapper } = setup()
    console.log('enzymeWrapper', enzymeWrapper.debug())

    expect(enzymeWrapper.find('input').length).to.eq(1)
    expect(enzymeWrapper.find('input').props()).to.have.property('type', 'checkbox')
    expect(enzymeWrapper.find('input').props()).to.have.property('checked', true)
    expect(enzymeWrapper.find('input').props()).to.have.property('name', 'Test Field')
    expect(enzymeWrapper.find('input').props()).to.have.property('id', 'testfield')
    expect(enzymeWrapper.find('input').props()).to.have.property('readOnly', false)

    expect(enzymeWrapper.find('label').first().props()).to.have.property('children', 'Test Field')
  })

  it('onChange calls onUpdateModel', () => {
    const { enzymeWrapper, onUpdateModel } = setup()

    const checkbox = enzymeWrapper.find('input')

    checkbox.props().onChange({ target: { checked: false } })

    expect(onUpdateModel.calledOnce).to.eq(true)
    expect(onUpdateModel.getCall(0).args[0]).to.eq('testfield')
    expect(onUpdateModel.getCall(0).args[1]).to.eq(false)
  })
})
