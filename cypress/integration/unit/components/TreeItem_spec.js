import React from 'react'
import Adapter from 'enzyme-adapter-react-16'
import chaiEnzyme from 'chai-enzyme'
import { configure, shallow } from 'enzyme'

import { TreeItem } from '../../../../src/components/Tree/TreeItem'
import { parseXml } from '../../../../src/util/parseXml'
import { treeXml } from '../../../mocks/FormElement'

chai.use(chaiEnzyme())
configure({ adapter: new Adapter() })

function readXml(file) {
  const doc = parseXml(file)
  const modelResult = document.evaluate('//*[local-name()="instance"]/*', doc)
  const model = modelResult.iterateNext()

  return { model }
}

function setup(overrideProps, {
  childrenMatchFilter,
  matchesFilter
} = {}) {
  const { model } = readXml(treeXml)
  const onChange = cy.spy().as('onChange')
  const setChecked = cy.spy().as('setChecked')
  const setExpanded = cy.spy().as('setExpanded')

  const props = {
    item: {
      children: [{
        children: [],
        checked: true,
        disabled: false,
        expanded: true,
        id: '/Parent1/Child1',
        fullValue: '/Parent1/Child1',
        label: 'Child 1',
        level: 2,
        relevant: true,
        required: false
      }],
      checked: true,
      disabled: false,
      expanded: true,
      id: '/Parent1',
      isParent: true,
      fullValue: '/Parent1',
      label: 'Parent 1',
      level: 1,
      relevant: true,
      required: false,
      childrenMatchFilter,
      matchesFilter,
      setChecked,
      setExpanded
    },
    model,
    onChange,
    ...overrideProps
  }

  const enzymeWrapper = shallow(<TreeItem {...props} />)

  return {
    enzymeWrapper,
    props,
    model,
    setChecked,
    setExpanded
  }
}

describe('TreeItem component', () => {
  it('renders a checkbox element', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find('input').length).to.eq(1)
    expect(enzymeWrapper.find('input').props().checked).to.eq(true)
    expect(enzymeWrapper.find('input').props().disabled).to.eq(false)
    expect(enzymeWrapper.find('input').props().id).to.eq('/Parent1')
    expect(enzymeWrapper.find('input').props().value).to.eq('/Parent1')

    expect(enzymeWrapper.find('label').props().htmlFor).to.eq('/Parent1')
    expect(enzymeWrapper.find('label').text()).to.eq('Parent 1')
  })

  it('renders a child TreeItem', () => {
    const { enzymeWrapper } = setup()

    const treeItem = enzymeWrapper.find(TreeItem)

    expect(treeItem.length).to.eq(1)
    expect(treeItem.props().item).to.eql({
      children: [],
      checked: true,
      disabled: false,
      expanded: true,
      id: '/Parent1/Child1',
      fullValue: '/Parent1/Child1',
      label: 'Child 1',
      level: 2,
      relevant: true,
      required: false
    })
  })

  it('checking a checkbox calls setChecked and onChange', () => {
    const { enzymeWrapper, props, setChecked } = setup()

    enzymeWrapper.find('input').first().simulate('change', { target: { checked: false } })

    expect(setChecked.calledOnce).to.eq(true)
    expect(setChecked.getCall(0).args[0]).to.eq(false)

    expect(props.onChange.calledOnce).to.eq(true)
  })

  it('clicking expand/collapse button calls setExpanded', () => {
    const { enzymeWrapper, setExpanded } = setup()

    enzymeWrapper.find('button').simulate('click')

    expect(setExpanded.calledOnce).to.eq(true)
    expect(setExpanded.getCall(0).args[0]).to.eq(false)

    // Click the button again
    enzymeWrapper.find('button').simulate('click')

    expect(setExpanded.calledTwice).to.eq(true)
    expect(setExpanded.getCall(1).args[0]).to.eq(true)
  })

  it('does not render the node if it does not match the filterText', () => {
    const { enzymeWrapper } = setup({
      filterText: 'asdf'
    },
    {
      childrenMatchFilter: () => false,
      matchesFilter: () => false
    })
    expect(enzymeWrapper.isEmptyRender()).to.eq(true)
  })

  it('expands the node if children match the filterText', () => {
    const { enzymeWrapper } = setup({
      filterText: 'asdf'
    },
    {
      childrenMatchFilter: () => true,
      matchesFilter: () => false
    })

    expect(enzymeWrapper.find(TreeItem).length).to.eq(1)
  })
})
