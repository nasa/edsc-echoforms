import React from 'react'
import Adapter from 'enzyme-adapter-react-16'
import chaiEnzyme from 'chai-enzyme'
import { configure, mount } from 'enzyme'

import { Tree } from '../../../../src/components/Tree/Tree'
import { EchoFormsContext } from '../../../../src/context/EchoFormsContext'
import { parseXml } from '../../../../src/util/parseXml'
import { treeXml } from '../../../mocks/FormElement'
import { TreeItem } from '../../../../src/components/Tree/TreeItem'

chai.use(chaiEnzyme())
configure({ adapter: new Adapter() })

function readXml(file) {
  const doc = parseXml(file)
  const treeResult = document.evaluate('//*[local-name()="tree"]', doc)
  const tree = treeResult.iterateNext()
  const modelResult = document.evaluate('//*[local-name()="instance"]/*', doc)
  const model = modelResult.iterateNext()

  return { tree, model }
}

function setup(overrideProps) {
  const { tree, model } = readXml(treeXml)

  const props = {
    cascade: true,
    element: tree,
    id: 'testfield',
    label: 'Test Field',
    maxParameters: null,
    model,
    modelRef: 'testfield',
    required: false,
    separator: '/',
    value: ['/Parent1'],
    valueElementName: 'data_layer',
    ...overrideProps
  }

  const onUpdateModel = cy.spy().as('onUpdateModel')
  const setFormIsValid = cy.spy().as('setFormIsValid')
  const enzymeWrapper = mount(
    <EchoFormsContext.Provider value={{ onUpdateModel, setFormIsValid }}>
      <Tree {...props} />
    </EchoFormsContext.Provider>
  )

  return {
    enzymeWrapper,
    props,
    onUpdateModel,
    model,
    tree
  }
}

describe('Tree component', () => {
  it('renders a Tree element', () => {
    const { enzymeWrapper, model, tree } = setup()

    const treeElement = enzymeWrapper.find(Tree)
    expect(treeElement.length).to.eq(1)
    expect(treeElement.props().value).to.eql(['/Parent1'])
    expect(treeElement.props().element.outerHTML).to.eq(tree.outerHTML)
    expect(treeElement.props().id).to.eq('testfield')
    expect(treeElement.props().label).to.eq('Test Field')
    expect(treeElement.props().maxParameters).to.eq(null)
    expect(treeElement.props().model.outerHTML).to.eq(model.outerHTML)
    expect(treeElement.props().modelRef).to.eq('testfield')
    expect(treeElement.props().required).to.eq(false)
    expect(treeElement.props().separator).to.eq('/')
    expect(treeElement.props().valueElementName).to.eq('data_layer')
  })

  it('changing a TreeItem calls onUpdateModel', () => {
    const { enzymeWrapper, onUpdateModel } = setup()

    const treeItem = enzymeWrapper.find(TreeItem).first()

    treeItem.find('input').first().simulate('change', { target: { checked: true } })

    expect(onUpdateModel.calledOnce).to.eq(true)
    expect(onUpdateModel.getCall(0).args[0]).to.eq('testfield')
    expect(onUpdateModel.getCall(0).args[1].value).to.eql(['/Parent1', '/Parent1/Child1'])
    expect(onUpdateModel.getCall(0).args[1].valueElementName).to.eq('data_layer')
  })

  it('onUpdateModel isn\'t called if the tree value hasn\'t changed', () => {
    const { enzymeWrapper, onUpdateModel } = setup()

    const treeItem = enzymeWrapper.find(TreeItem).first()

    treeItem.props().onChange()

    expect(onUpdateModel.calledOnce).to.eq(false)
  })
})
