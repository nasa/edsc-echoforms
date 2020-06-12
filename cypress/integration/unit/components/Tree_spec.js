import React from 'react'
import Adapter from 'enzyme-adapter-react-16'
import chaiEnzyme from 'chai-enzyme'
import { configure, mount } from 'enzyme'

import { Tree } from '../../../../src/components/Tree/Tree'
import { EchoFormsContext } from '../../../../src/context/EchoFormsContext'
import { parseXml } from '../../../../src/util/parseXml'
import { treeXml, treeWithMaxParametersXml } from '../../../mocks/FormElement'
import { TreeItem } from '../../../../src/components/Tree/TreeItem'
import { ElementWrapper } from '../../../../src/components/ElementWrapper/ElementWrapper'

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

function setup(overrideProps, file = treeXml) {
  const { tree, model } = readXml(file)

  const props = {
    cascade: true,
    element: tree,
    id: 'testfield',
    label: 'Test Field',
    maxParameters: null,
    model,
    modelRef: 'testfield',
    parentRef: 'parentRef',
    required: false,
    separator: '/',
    simplifyOutput: false,
    value: ['/Parent1'],
    valueElementName: 'data_layer',
    ...overrideProps
  }

  const onUpdateModel = cy.spy().as('onUpdateModel')
  const setFormIsValid = cy.spy().as('setFormIsValid')
  const setSimplifiedTree = cy.spy().as('setSimplifiedTree')
  const enzymeWrapper = mount(
    <EchoFormsContext.Provider
      value={{
        model,
        onUpdateModel,
        setFormIsValid,
        setSimplifiedTree,
        simplifiedTree: {}
      }}
    >
      <Tree {...props} />
    </EchoFormsContext.Provider>
  )

  return {
    enzymeWrapper,
    props,
    onUpdateModel,
    model,
    tree,
    setSimplifiedTree
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

  it('passes a custom classname to the container', () => {
    const { enzymeWrapper } = setup({
      className: 'edsc-echoforms'
    })

    const treeElement = enzymeWrapper.find('.edsc-echoforms')
    expect(treeElement.length).to.equal(1)
  })

  it('changing a TreeItem calls onUpdateModel', () => {
    const { enzymeWrapper, onUpdateModel } = setup()

    const treeItem = enzymeWrapper.find(TreeItem).first()

    treeItem.find('input').first().simulate('change', { target: { checked: true } })

    expect(onUpdateModel.calledOnce).to.eq(true)
    expect(onUpdateModel.getCall(0).args[0]).to.eq('parentRef')
    expect(onUpdateModel.getCall(0).args[1]).to.eq('testfield')
    expect(onUpdateModel.getCall(0).args[2].value).to.eql(['/Parent1', '/Parent1/Child1'])
    expect(onUpdateModel.getCall(0).args[2].valueElementName).to.eq('data_layer')
  })

  it('onUpdateModel isn\'t called if the tree value hasn\'t changed', () => {
    const { enzymeWrapper, onUpdateModel } = setup({})

    const treeItem = enzymeWrapper.find(TreeItem).first()

    treeItem.props().onChange()

    expect(onUpdateModel.calledOnce).to.eq(false)
  })

  it('updating a simplifyOutput tree calls setSimplifiedTree', () => {
    const { enzymeWrapper, setSimplifiedTree } = setup({ simplifyOutput: true })

    const treeItem = enzymeWrapper.find(TreeItem).first()

    treeItem.find('input').first().simulate('change', { target: { checked: true } })

    expect(setSimplifiedTree.calledOnce).to.eq(true)
    expect(setSimplifiedTree.getCall(0).args[0]).to.eql({
      testfield: {
        parentRef: 'parentRef',
        modelRef: 'testfield',
        value: ['/Parent1'],
        valueElementName: 'data_layer'
      }
    })
  })

  it('calculates the maxParameter error', () => {
    const { enzymeWrapper } = setup({
      maxParameters: 4,
      value: [
        '/Parent1',
        '/Parent1/Child1-1',
        '/Parent1/Child1-2',
        '/Parent1/Child1-2/Child1-2-1',
        '/Parent1/Child1-2/Child1-2-2',
        '/Parent1/Child1-3',
        '/Parent1/Child1-3/Child1-3-1',
        '/Parent1/Child1-3/Child1-3-2'
      ]
    }, treeWithMaxParametersXml)

    const elementWrapper = enzymeWrapper.find(ElementWrapper)

    expect(elementWrapper.props().manualError).to.eq('No more than 4 parameters can be selected.')
  })

  it('onFilterChange updates the filterText in TreeItem', () => {
    const { enzymeWrapper } = setup()

    let treeItem = enzymeWrapper.find(TreeItem).first()
    expect(treeItem.props().filterText).to.eq('')

    const filterInput = enzymeWrapper.find('.tree__filter-input')
    filterInput.props().onChange({ target: { value: 'filter text' } })
    enzymeWrapper.update()

    treeItem = enzymeWrapper.find(TreeItem).first()
    expect(treeItem.props().filterText).to.eq('filter text')
  })

  it('onFilterClear clears the filterText in TreeItem', () => {
    const { enzymeWrapper } = setup()

    let treeItem = enzymeWrapper.find(TreeItem).first()
    expect(treeItem.props().filterText).to.eq('')

    const filterInput = enzymeWrapper.find('.tree__filter-input')
    filterInput.props().onChange({ target: { value: 'filter text' } })
    enzymeWrapper.update()

    treeItem = enzymeWrapper.find(TreeItem).first()
    expect(treeItem.props().filterText).to.eq('filter text')

    const filterClearButton = enzymeWrapper.find('.tree__filter-clear-button')
    filterClearButton.simulate('click')
    enzymeWrapper.update()

    treeItem = enzymeWrapper.find(TreeItem).first()
    expect(treeItem.props().filterText).to.eq('')
  })
})
