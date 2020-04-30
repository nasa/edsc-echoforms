import React from 'react'
import Adapter from 'enzyme-adapter-react-16'
import chaiEnzyme from 'chai-enzyme'
import { configure, mount } from 'enzyme'

import { TextArea } from '../../../../src/components/TextArea/TextArea'
import { EchoFormsContext } from '../../../../src/context/EchoFormsContext'
import { parseXml } from '../../../../src/util/parseXml'
import { textareaXml } from '../../../mocks/FormElement'

chai.use(chaiEnzyme())
configure({ adapter: new Adapter() })

function readXml(file) {
  const doc = parseXml(file)
  const textareaResult = document.evaluate('//*[local-name()="textarea"]', doc)
  const textarea = textareaResult.iterateNext()

  return { textarea }
}

function setup(overrideProps) {
  const { textarea } = readXml(textareaXml)

  const props = {
    label: 'Test Field',
    id: 'testfield',
    modelRef: 'testfield',
    readOnly: false,
    required: false,
    value: 'test value',
    ...overrideProps
  }

  const onUpdateModel = cy.spy().as('onUpdateModel')
  const setFormIsValid = cy.spy().as('setFormIsValid')
  const enzymeWrapper = mount(
    <EchoFormsContext.Provider value={{ onUpdateModel, setFormIsValid }}>
      <TextArea {...props}>
        {textarea.children}
      </TextArea>
    </EchoFormsContext.Provider>
  )

  return {
    enzymeWrapper,
    props,
    onUpdateModel
  }
}

describe('TextArea component', () => {
  it('renders a textarea element', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find('textarea').length).to.eq(1)
    expect(enzymeWrapper.find('textarea').props()).to.have.property('value', 'test value')
    expect(enzymeWrapper.find('textarea').props()).to.have.property('name', 'Test Field')
    expect(enzymeWrapper.find('textarea').props()).to.have.property('id', 'testfield')
    expect(enzymeWrapper.find('textarea').props()).to.have.property('readOnly', false)
  })

  it('onChange calls onUpdateModel', () => {
    const { enzymeWrapper, onUpdateModel } = setup()

    const TextArea = enzymeWrapper.find('textarea')

    TextArea.props().onChange({ target: { value: 'New Value' } })

    expect(onUpdateModel.calledOnce).to.eq(true)
    expect(onUpdateModel.getCall(0).args[0]).to.eq('testfield')
    expect(onUpdateModel.getCall(0).args[1]).to.eq('New Value')
  })
})
