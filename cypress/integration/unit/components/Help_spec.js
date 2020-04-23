import React from 'react'
import * as ReactDOM from 'react-dom'
import Adapter from 'enzyme-adapter-react-16'
import chaiEnzyme from 'chai-enzyme'
import { configure, shallow } from 'enzyme'

import { Help } from '../../../../src/components/Help/Help'
import { textfieldXml, selectXml } from '../../../mocks/FormElement'
import { parseXml } from '../../../../src/util/parseXml'

window.ReactDOM = ReactDOM

chai.use(chaiEnzyme())
configure({ adapter: new Adapter() })

function readXml(file, type) {
  const doc = parseXml(file)
  const inputResult = document.evaluate(`//*[local-name()="${type}"]`, doc)
  const input = inputResult.iterateNext()

  return { input }
}

function setup(file, type) {
  const { input } = readXml(file, type)

  const enzymeWrapper = shallow(
    <Help
      elements={input.children}
    />
  )

  return {
    enzymeWrapper
  }
}

describe('Help component', () => {
  it('renders help text', () => {
    const { enzymeWrapper } = setup(textfieldXml, 'input')

    expect(enzymeWrapper.find('small')).to.have.text('Helpful text')
  })

  it('only renders help elements', () => {
    const { enzymeWrapper } = setup(selectXml, 'select')

    expect(enzymeWrapper.find('small')).to.have.length(1)
    expect(enzymeWrapper.find('small')).to.have.text('Helpful text')
  })
})
