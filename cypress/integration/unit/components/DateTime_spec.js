import React from 'react'
import Adapter from 'enzyme-adapter-react-16'
import chaiEnzyme from 'chai-enzyme'
import { configure, shallow } from 'enzyme'

import { DateTime } from '../../../../src/components/DateTime/DateTime'
import { InputField } from '../../../../src/components/InputField/InputField'

chai.use(chaiEnzyme())
configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    label: 'Test Field',
    modelRef: 'testfield',
    readOnly: false,
    required: false,
    value: '2020-01-01T00:00:00',
    ...overrideProps
  }

  const enzymeWrapper = shallow(<DateTime {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('DateTime component', () => {
  it('renders a InputField component', () => {
    const { enzymeWrapper } = setup()

    const inputField = enzymeWrapper.find(InputField)

    expect(inputField).to.have.lengthOf(1)
    expect(inputField.props()).to.have.property('label', 'Test Field')
    expect(inputField.props()).to.have.property('modelRef', 'testfield')
    expect(inputField.props()).to.have.property('placeholder', 'YYYY-MM-DDTHH:MM:SS')
    expect(inputField.props()).to.have.property('readOnly', false)
    expect(inputField.props()).to.have.property('required', false)
    expect(inputField.props()).to.have.property('value', '2020-01-01T00:00:00')
  })
})
