import React from 'react'
import Adapter from 'enzyme-adapter-react-16'
import chaiEnzyme from 'chai-enzyme'
import { configure, mount } from 'enzyme'

import { Output } from '../../../../src/components/Output/Output'
import { parseXml } from '../../../../src/util/parseXml'
import { outputXml } from '../../../mocks/FormElement'

chai.use(chaiEnzyme())
configure({ adapter: new Adapter() })

function readXml(file) {
  const doc = parseXml(file)
  const outputResult = document.evaluate('//*[local-name()="output"]', doc)
  const output = outputResult.iterateNext()

  return { output }
}

function setup(overrideProps) {
  const { output } = readXml(outputXml)
  const props = {
    label: 'Test Field',
    modelRef: 'testfield',
    value: 'test value',
    ...overrideProps
  }

  const enzymeWrapper = mount(
    <Output {...props}>
      {output.children}
    </Output>
  )

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
    const { enzymeWrapper } = setup({ type: 'anyuri' })

    expect(enzymeWrapper.find('a').length).to.eq(1)
    expect(enzymeWrapper.find('a').props().href).to.eq('test value')
  })
})
