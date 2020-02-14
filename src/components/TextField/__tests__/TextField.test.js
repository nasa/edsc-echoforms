import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { TextField } from '../TextField'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    label: 'Test Field',
    modelRef: 'testfield',
    readOnly: false,
    required: false,
    value: 'test value',
    onUpdateModel: jest.fn(),
    ...overrideProps
  }

  const enzymeWrapper = shallow(<TextField {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('TextField component', () => {
  test('renders a input field', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find('input').length).toBe(1)
  })

  test('renders a password field when the type is password', () => {
    const { enzymeWrapper } = setup({ type: 'password' })

    expect(enzymeWrapper.find('input').length).toBe(1)
    expect(enzymeWrapper.find('input').props().type).toEqual('password')
  })

  test('onChange calls onUpdateModel', () => {
    const { enzymeWrapper, props } = setup()

    const TextField = enzymeWrapper.find('input')

    TextField.props().onChange({ target: { value: 'new test value' } })

    expect(props.onUpdateModel).toHaveBeenCalledTimes(1)
    expect(props.onUpdateModel).toHaveBeenCalledWith('testfield', 'new test value')
  })
})
