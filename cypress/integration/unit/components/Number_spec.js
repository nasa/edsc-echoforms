import React from 'react'
import Adapter from 'enzyme-adapter-react-16'
import chaiEnzyme from 'chai-enzyme'
import { configure, shallow } from 'enzyme'

import { Number } from '../../../../src/components/Number/Number'
import { InputField } from '../../../../src/components/InputField/InputField'

chai.use(chaiEnzyme())
configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    label: 'Test Field',
    modelRef: 'testfield',
    readOnly: false,
    required: false,
    type: 'xs:double',
    value: '123',
    ...overrideProps
  }

  const enzymeWrapper = shallow(<Number {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('Number component', () => {
  it('renders a InputField component', () => {
    const { enzymeWrapper } = setup()

    const inputField = enzymeWrapper.find(InputField)

    expect(inputField).to.have.lengthOf(1)
    expect(inputField.props()).to.have.property('label', 'Test Field')
    expect(inputField.props()).to.have.property('modelRef', 'testfield')
    expect(inputField.props()).to.have.property('readOnly', false)
    expect(inputField.props()).to.have.property('required', false)
    expect(inputField.props()).to.have.property('value', '123')
    expect(inputField.props()).to.have.property('error', null)
  })

  it('renders a validation message for doubles', () => {
    const { enzymeWrapper } = setup({
      value: 'asdf'
    })

    expect(enzymeWrapper.find(InputField).props().value).to.eq('asdf')
    expect(enzymeWrapper.find(InputField).props().error).to.eq('Value must be a number')
  })

  it('renders a validation message for integers', () => {
    const { enzymeWrapper } = setup({
      type: 'xs:int',
      value: 'asdf'
    })

    expect(enzymeWrapper.find(InputField).props().value).to.eq('asdf')
    expect(enzymeWrapper.find(InputField).props().error).to.eq('Value must be a integer between -2,147,483,648 and 2,147,483,647')
  })

  it('renders a validation message for short integers', () => {
    const { enzymeWrapper } = setup({
      type: 'xs:short',
      value: 'asdf'
    })

    expect(enzymeWrapper.find(InputField).props().value).to.eq('asdf')
    expect(enzymeWrapper.find(InputField).props().error).to.eq('Value must be a integer between -32,768 and 32,767')
  })

  it('renders a validation message for long integers', () => {
    const { enzymeWrapper } = setup({
      type: 'xs:long',
      value: 'asdf'
    })

    expect(enzymeWrapper.find(InputField).props().value).to.eq('asdf')
    expect(enzymeWrapper.find(InputField).props().error).to.eq('Value must be a integer between -2^63 and 2^63-1')
  })

  it('does not render a validation message for an empty value', () => {
    const { enzymeWrapper } = setup({
      value: ''
    })

    expect(enzymeWrapper.find(InputField).props().error).to.eq(null)
  })
})
