import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { DOMParser } from 'xmldom'
import xpath from 'xpath'

import { FormElement } from '../FormElement'
import { checkboxXml } from './mocks'
import { Checkbox } from '../../Checkbox/Checkbox'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    element: null,
    model: null,
    onUpdateModel: jest.fn(),
    ...overrideProps
  }

  const enzymeWrapper = shallow(<FormElement {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('FormElement component', () => {
  test('renders a checkbox component', () => {
    const doc = new DOMParser().parseFromString(checkboxXml)
    const ui = xpath.select('//*[local-name()="ui"]', doc)[0]
    const model = xpath.select('//*[local-name()="instance"]', doc)[0]

    const { enzymeWrapper } = setup({ model, element: ui.childNodes[0] })

    expect(enzymeWrapper.find(Checkbox).length).toBe(1)
    expect(enzymeWrapper.find(Checkbox).props().checked).toEqual('true')
    expect(enzymeWrapper.find(Checkbox).props().label).toEqual('Bool input')
    expect(enzymeWrapper.find(Checkbox).props().modelRef).toEqual('prov:boolreference')
  })
})
