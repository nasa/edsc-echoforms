import React from 'react'
import * as ReactDOM from 'react-dom'
import Adapter from 'enzyme-adapter-react-16'
import chaiEnzyme from 'chai-enzyme'
import { configure, mount } from 'enzyme'

import { EDSCEchoform } from '../../../../src'
import { parseXml } from '../../../../src/util/parseXml'
import { readOnlyXml, prepopulatedXml } from '../../../mocks/FormElement'
import { FormBody } from '../../../../src/components/FormBody/FormBody'

window.ReactDOM = ReactDOM

chai.use(chaiEnzyme())
configure({ adapter: new Adapter() })

describe('EDSCEchoform component', () => {
  it('renders a FormBody component', () => {
    const doc = parseXml(readOnlyXml)
    const uiResult = document.evaluate('//*[local-name()="ui"]', doc)
    const ui = uiResult.iterateNext()
    const modelResult = document.evaluate('//*[local-name()="instance"]/*', doc)
    const model = modelResult.iterateNext()

    const onFormModelUpdatedSpy = cy.spy().as('onFormModelUpdated')
    const onFormIsValidUpdated = cy.spy().as('onFormIsValidUpdated')

    const component = mount(<EDSCEchoform
      form={readOnlyXml}
      onFormModelUpdated={onFormModelUpdatedSpy}
      onFormIsValidUpdated={onFormIsValidUpdated}
    />)

    const formBody = component.find(FormBody)

    expect(formBody).to.have.lengthOf(1)
    expect(formBody.props().ui.outerHTML).to.eql(ui.outerHTML)
    expect(formBody.props().model.outerHTML).to.eql(model.outerHTML)
  })

  it('populates prepopulated values into the model', () => {
    const onFormModelUpdatedSpy = cy.spy().as('onFormModelUpdated')
    const onFormIsValidUpdated = cy.spy().as('onFormIsValidUpdated')

    const component = mount(<EDSCEchoform
      form={prepopulatedXml}
      prepopulateValues={{
        PREPOP: 'I am prepopulated'
      }}
      onFormModelUpdated={onFormModelUpdatedSpy}
      onFormIsValidUpdated={onFormIsValidUpdated}
    />)

    const formBody = component.find(FormBody)

    expect(formBody).to.have.lengthOf(1)
    expect(formBody.props().model.outerHTML).to.contain('<prov:textreference>I am prepopulated</prov:textreference>')
  })
})
