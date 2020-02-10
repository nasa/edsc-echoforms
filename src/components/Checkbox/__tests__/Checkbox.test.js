import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { Form } from 'react-bootstrap'

import { Checkbox } from '../Checkbox'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    label: 'Test Field',
    modelRef: 'testfield',
    checked: 'true',
    onUpdateModel: jest.fn()
  }

  const enzymeWrapper = shallow(<Checkbox {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('Checkbox component', () => {
  test('renders a Form.Check component', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(Form.Check).length).toBe(1)
  })

  test('onChange calls onUpdateModel', () => {
    const { enzymeWrapper, props } = setup()

    const checkbox = enzymeWrapper.find(Form.Check)

    checkbox.props().onChange({ target: { checked: false } })

    expect(props.onUpdateModel).toHaveBeenCalledTimes(1)
    expect(props.onUpdateModel).toHaveBeenCalledWith('testfield', false)
  })
})
