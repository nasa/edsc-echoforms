import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { Output } from '../Output'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    label: 'Test Field',
    required: false,
    value: 'test value',
    ...overrideProps
  }

  const enzymeWrapper = shallow(<Output {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('Output component', () => {
  test('renders a p element', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find('p').length).toBe(1)
    expect(enzymeWrapper.find('p').props().children).toEqual('test value')
  })

  test('renders an a element when the type is anyURI', () => {
    const { enzymeWrapper } = setup({ type: 'anyURI' })

    expect(enzymeWrapper.find('a').length).toBe(1)
    expect(enzymeWrapper.find('a').props().href).toEqual('test value')
  })
})
