import React from 'react'
import Adapter from 'enzyme-adapter-react-16'
import chaiEnzyme from 'chai-enzyme'
import { configure, mount } from 'enzyme'

import { Checkbox } from '../../../../src/components/Checkbox/Checkbox'
import { EchoFormsContext } from '../../../../src/context/EchoFormsContext'
import { Help } from '../../../../src/components/Help/Help'
import { parseXml } from '../../../../src/util/parseXml'
import { checkboxXml, shapeFileCheckboxXml } from '../../../mocks/FormElement'

chai.use(chaiEnzyme())
configure({ adapter: new Adapter() })

function readXml(file) {
  const doc = parseXml(file)
  const inputResult = document.evaluate('//*[local-name()="input"]', doc)
  const input = inputResult.iterateNext()

  return { input }
}

function setup(file, overrideProps, hasShapefile) {
  const { input } = readXml(file)
  const props = {
    checked: 'true',
    label: 'Test Field',
    id: 'testfield',
    modelRef: 'testfield',
    readOnly: false,
    required: false,
    ...overrideProps
  }

  const onUpdateModel = cy.spy().as('onUpdateModel')
  const setFormIsValid = cy.spy().as('setFormIsValid')
  const enzymeWrapper = mount(
    <EchoFormsContext.Provider value={{ hasShapefile, onUpdateModel, setFormIsValid }}>
      <Checkbox {...props}>
        {input.children}
      </Checkbox>
    </EchoFormsContext.Provider>
  )

  return {
    enzymeWrapper,
    props,
    onUpdateModel
  }
}

describe('Checkbox component', () => {
  it('renders an input field', () => {
    const { enzymeWrapper } = setup(checkboxXml)

    expect(enzymeWrapper.find('input').length).to.eq(1)
    expect(enzymeWrapper.find('input').props()).to.have.property('type', 'checkbox')
    expect(enzymeWrapper.find('input').props()).to.have.property('checked', true)
    expect(enzymeWrapper.find('input').props()).to.have.property('name', 'Test Field')
    expect(enzymeWrapper.find('input').props()).to.have.property('id', 'testfield')
    expect(enzymeWrapper.find('input').props()).to.have.property('readOnly', false)

    expect(enzymeWrapper.find('label').last().props()).to.have.property('children', 'Test Field')

    expect(enzymeWrapper.find(Help).props().elements[0].outerHTML).to.eq('<help>Helpful text</help>')
  })

  it('onChange calls onUpdateModel', () => {
    const { enzymeWrapper, onUpdateModel } = setup(checkboxXml)

    const checkbox = enzymeWrapper.find('input')

    checkbox.props().onChange({ target: { checked: false } })

    expect(onUpdateModel.calledOnce).to.eq(true)
    expect(onUpdateModel.getCall(0).args[0]).to.eq('testfield')
    expect(onUpdateModel.getCall(0).args[1]).to.eq(false)
  })

  it('renders a required message', () => {
    const { enzymeWrapper } = setup(checkboxXml, {
      checked: '',
      required: true
    })

    expect(enzymeWrapper.find('input').props().className).to.include('is-invalid')
    expect(enzymeWrapper.find('div.invalid-feedback').text()).to.eq('Required field')
  })

  describe('shapefiles', () => {
    it('renders a help message for a shapefile field when a shapefile exists', () => {
      const { enzymeWrapper } = setup(shapeFileCheckboxXml, { id: 'test-use-shapefile' }, true)

      expect(enzymeWrapper.find(Help).props().manualHelp).to.eq('Complex shapefiles may take longer to process. You will receive an email when your files are finished processing.')
    })

    it('renders a help message for a shapefile field when a shapefile does not exists', () => {
      const { enzymeWrapper } = setup(shapeFileCheckboxXml, { id: 'test-use-shapefile' }, false)

      expect(enzymeWrapper.find('input').props()).to.have.property('disabled', true)
      expect(enzymeWrapper.find(Help).props().manualHelp).to.eql((
        <span>
          Click
          {' '}
          <b>Back to Search</b>
          {' '}
          and upload a KML or Shapefile to enable this option.
        </span>
      ))
    })
  })
})
