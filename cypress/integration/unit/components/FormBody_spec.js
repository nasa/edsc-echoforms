import React from 'react'
import * as ReactDOM from 'react-dom'
import Adapter from 'enzyme-adapter-react-16'
import chaiEnzyme from 'chai-enzyme'
import { configure, shallow } from 'enzyme'

import { FormBody } from '../../../../src/components/FormBody/FormBody'
import { parseXml } from '../../../../src/util/parseXml'
import { readOnlyXml } from '../../../mocks/FormElement'
import { FormElement } from '../../../../src/components/FormElement/FormElement'

window.ReactDOM = ReactDOM

chai.use(chaiEnzyme())
configure({ adapter: new Adapter() })

describe('FormBody component', () => {
  it('renders a FormElement component for each element in the echoform', () => {
    const doc = parseXml(readOnlyXml)
    const uiResult = document.evaluate('//*[local-name()="ui"]', doc)
    const ui = uiResult.iterateNext()
    const modelResult = document.evaluate('//*[local-name()="instance"]/*', doc)
    const model = modelResult.iterateNext()

    const component = shallow(
      <FormBody
        model={model}
        ui={ui}
      />
    )

    const formElement = component.find(FormElement)

    expect(formElement).to.have.lengthOf(2)

    expect(formElement.first().props().element.outerHTML).to.eq(ui.children[0].outerHTML)
    expect(formElement.first().props().model.outerHTML).to.eq(model.outerHTML)

    expect(formElement.last().props().element.outerHTML).to.eq(ui.children[1].outerHTML)
    expect(formElement.last().props().model.outerHTML).to.eq(model.outerHTML)
  })
})
