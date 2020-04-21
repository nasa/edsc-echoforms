import React from 'react'
import Adapter from 'enzyme-adapter-react-16'
import chaiEnzyme from 'chai-enzyme'
import { configure, mount } from 'enzyme'

import { Range } from '../../../../src/components/Range/Range'
import { EchoFormsContext } from '../../../../src/context/EchoFormsContext'

chai.use(chaiEnzyme())
configure({ adapter: new Adapter() })

function setup() {
  const props = {
    label: 'Test Field',
    id: 'testfield',
    max: '10',
    min: '0',
    modelRef: 'testfield',
    readOnly: false,
    required: false,
    step: '1',
    value: 5,
    onUpdateModel: cy.spy().as('onUpdateModel')
  }

  const onUpdateModel = cy.spy().as('onUpdateModel')
  const enzymeWrapper = mount(
    <EchoFormsContext.Provider value={{ onUpdateModel }}>
      <Range {...props} />
    </EchoFormsContext.Provider>
  )

  return {
    enzymeWrapper,
    props,
    onUpdateModel
  }
}

describe('Range component', () => {
  it('renders a range element', () => {
    const { enzymeWrapper } = setup()

    const range = enzymeWrapper.find('input')

    expect(range.length).to.eq(1)
    expect(range.props()).to.have.property('value', 5)
    expect(range.props()).to.have.property('name', 'Test Field')
    expect(range.props()).to.have.property('id', 'testfield')
    expect(range.props()).to.have.property('readOnly', false)
    expect(range.props()).to.have.property('max', '10')
    expect(range.props()).to.have.property('min', '0')
    expect(range.props()).to.have.property('step', '1')

    expect(enzymeWrapper.find('.range__min')).to.have.text('0')
    expect(enzymeWrapper.find('.range__max')).to.have.text('10')
    expect(enzymeWrapper.find('.range__value')).to.have.text('5')
  })

  it('onChange calls onUpdateModel', () => {
    const { enzymeWrapper, onUpdateModel } = setup()

    const range = enzymeWrapper.find('input')

    range.props().onChange({ target: { value: 4 } })

    expect(onUpdateModel.calledOnce).to.eq(true)
    expect(onUpdateModel.getCall(0).args[0]).to.eq('testfield')
    expect(onUpdateModel.getCall(0).args[1]).to.eq(4)
  })
})