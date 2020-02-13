import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { Form } from 'react-bootstrap'

import { TextArea } from '../TextArea'

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

  const enzymeWrapper = shallow(<TextArea {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('TextArea component', () => {
  test('renders a Form.Check component', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(Form.Control).length).toBe(1)
  })

  test('onChange calls onUpdateModel', () => {
    const { enzymeWrapper, props } = setup()

    const TextArea = enzymeWrapper.find(Form.Control)

    TextArea.props().onChange({ target: { value: 'new test value' } })

    expect(props.onUpdateModel).toHaveBeenCalledTimes(1)
    expect(props.onUpdateModel).toHaveBeenCalledWith('testfield', 'new test value')
  })
})
