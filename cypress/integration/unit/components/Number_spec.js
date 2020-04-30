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
    type: 'double',
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
  })
})
