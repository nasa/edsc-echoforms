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

  it('onBlur calls onUpdateModel', () => {
    const { enzymeWrapper, onUpdateModel } = setup()

    const TextArea = enzymeWrapper.find('textarea')

    TextArea.props().onBlur()

    expect(onUpdateModel.calledOnce).to.eq(true)
    expect(onUpdateModel.getCall(0).args[0]).to.eq('testfield')
    expect(onUpdateModel.getCall(0).args[1]).to.eq('test value')
  })

  it('onChange sets the state', () => {
    const { enzymeWrapper } = setup()

    const textarea = enzymeWrapper.find('textarea')

    textarea.props().onChange({ target: { value: 'New Value' } })
    enzymeWrapper.update()

    expect(enzymeWrapper.find('textarea').props()).to.have.property('value', 'New Value')
  })
})
