import React from 'react'
import Adapter from 'enzyme-adapter-react-16'
import chaiEnzyme from 'chai-enzyme'
import { configure, shallow } from 'enzyme'

import { Output } from '../../../../src/components/Output/Output'

chai.use(chaiEnzyme())
configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    label: 'Test Field',
    modelRef: 'testfield',
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
  it('renders a p element', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find('p').length).to.eq(1)
    expect(enzymeWrapper.find('p').props()).to.have.property('children', 'test value')
  })

  it('renders an a element when the type is anyURI', () => {
    const { enzymeWrapper } = setup({ type: 'anyURI' })

    expect(enzymeWrapper.find('a').length).to.eq(1)
    expect(enzymeWrapper.find('a').props().href).to.eq('test value')
  })
})
