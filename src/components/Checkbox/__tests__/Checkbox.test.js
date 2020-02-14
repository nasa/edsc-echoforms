import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { Checkbox } from '../Checkbox'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    checked: 'true',
    label: 'Test Field',
    modelRef: 'testfield',
    readOnly: false,
    required: false,
    onUpdateModel: jest.fn()
  }

  const enzymeWrapper = shallow(<Checkbox {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('Checkbox component', () => {
  test('renders a input field', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find('input').length).toBe(1)
    expect(enzymeWrapper.find('input').props().type).toEqual('checkbox')
  })

  test('onChange calls onUpdateModel', () => {
    const { enzymeWrapper, props } = setup()

    const checkbox = enzymeWrapper.find('input')

    checkbox.props().onChange({ target: { checked: false } })

    expect(props.onUpdateModel).toHaveBeenCalledTimes(1)
    expect(props.onUpdateModel).toHaveBeenCalledWith('testfield', false)
  })
})
