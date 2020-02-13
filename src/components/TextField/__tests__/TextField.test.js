import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { Form } from 'react-bootstrap'

import { TextField } from '../TextField'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    label: 'Test Field',
    modelRef: 'testfield',
    readOnly: false,
    required: false,
    value: 'test value',
    onUpdateModel: jest.fn()
  }

  const enzymeWrapper = shallow(<TextField {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('TextField component', () => {
  test('renders a Form.Check component', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(Form.Control).length).toBe(1)
  })

  test('onChange calls onUpdateModel', () => {
    const { enzymeWrapper, props } = setup()

    const TextField = enzymeWrapper.find(Form.Control)

    TextField.props().onChange({ target: { value: 'new test value' } })

    expect(props.onUpdateModel).toHaveBeenCalledTimes(1)
    expect(props.onUpdateModel).toHaveBeenCalledWith('testfield', 'new test value')
  })
})
