import React from 'react'
import * as ReactDOM from 'react-dom'
import Adapter from 'enzyme-adapter-react-16'
import chaiEnzyme from 'chai-enzyme'
import { configure, mount } from 'enzyme'

import { EDSCEchoform } from '../../../src'
import { parseXml } from '../../../src/util/parseXml'
import { readOnlyXml } from '../../mocks/FormElement'
import { FormElement } from '../../../src/components/FormElement/FormElement'

window.ReactDOM = ReactDOM

// HACK: chai-enzyme does not play nice with chai-jquery, so remove the
// problem-causing assertions that collide with chai-jquery
'visible hidden selected checked enabled disabled'.split(' ').forEach((selector) => {
  Object.defineProperty(chai.Assertion.prototype, selector, { get: () => {} })
})

chai.use(chaiEnzyme())
configure({ adapter: new Adapter() })

describe('EDSCEchoform component', () => {
  it('renders a FormElement component for each element in the echoform', () => {
    const doc = parseXml(readOnlyXml)
    const uiResult = document.evaluate('//*[local-name()="ui"]', doc)
    const ui = uiResult.iterateNext()
    const modelResult = document.evaluate('//*[local-name()="instance"]/*', doc)
    const model = modelResult.iterateNext()

    const onFormModelUpdatedSpy = cy.spy().as('onFormModelUpdated')

    const component = mount(<EDSCEchoform
      form={readOnlyXml}
      onFormModelUpdated={onFormModelUpdatedSpy}
    />)

    const formElement = component.find(FormElement)

    expect(formElement).to.have.lengthOf(2)

    expect(formElement.first().props()).to.have.property('addBootstrapClasses', false)
    expect(formElement.first().props().element.outerHTML).to.eq(ui.children[0].outerHTML)
    expect(formElement.first().props().model.outerHTML).to.eq(model.outerHTML)

    expect(formElement.last().props()).to.have.property('addBootstrapClasses', false)
    expect(formElement.last().props().element.outerHTML).to.eq(ui.children[1].outerHTML)
    expect(formElement.last().props().model.outerHTML).to.eq(model.outerHTML)
  })
})
