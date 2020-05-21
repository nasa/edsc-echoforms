import React from 'react'
import Adapter from 'enzyme-adapter-react-16'
import chaiEnzyme from 'chai-enzyme'
import { configure, shallow } from 'enzyme'

import { ElementWrapper } from '../../../../src/components/ElementWrapper/ElementWrapper'
import { Constraint } from '../../../../src/components/Constraint/Constraint'
import { Help } from '../../../../src/components/Help/Help'
import { textfieldXml } from '../../../mocks/FormElement'
import { parseXml } from '../../../../src/util/parseXml'

chai.use(chaiEnzyme())
configure({ adapter: new Adapter() })

function readXml(file) {
  const doc = parseXml(file)
  const inputResult = document.evaluate('//*[local-name()="input"]', doc)
  const input = inputResult.iterateNext()

  return input.children
}

function setup(overrideProps) {
  const props = {
    formElements: readXml(textfieldXml),
    htmlFor: 'testfield',
    label: ' Test Field',
    required: false,
    type: 'double',
    value: '123',
    ...overrideProps
  }

  const childrenSpy = cy.spy()
  const enzymeWrapper = shallow(
    <ElementWrapper {...props}>
      {childrenSpy}
    </ElementWrapper>
  )

  return {
    enzymeWrapper,
    props
  }
}

describe('ElementWrapper component', () => {
  it('renders a Constraint component', () => {
    const { enzymeWrapper } = setup()

    const constraint = enzymeWrapper.find(Constraint)

    expect(constraint).to.have.lengthOf(1)
    expect(constraint.props().elements[0].outerHTML).to.eq('<help>Helpful text</help>')
    expect(constraint.props().required).to.eq(false)
    expect(constraint.props().type).to.eq('double')
    expect(constraint.props().value).to.eq('123')
  })

  it('renders a Help component', () => {
    const { enzymeWrapper } = setup()

    const help = enzymeWrapper.find(Help)

    expect(help).to.have.lengthOf(1)
    expect(help.props().elements[0].outerHTML).to.eq('<help>Helpful text</help>')
  })
})
