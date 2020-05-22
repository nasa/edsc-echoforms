import { TreeNode } from '../../../../src/util/TreeNode'
import { parseXml } from '../../../../src/util/parseXml'
import { buildXPathResolverFn } from '../../../../src/util/buildXPathResolverFn'
import {
  treeXml,
  treeWithRequiredXml,
  treeWithIrrelevantXml,
  treeWithIndeterminateXml,
  treeWithSimplifyOutputXml
} from '../../../mocks/FormElement'

function setup(xml) {
  const doc = parseXml(xml)
  const treeResult = document.evaluate('//*[local-name()="tree"]', doc)
  const tree = treeResult.iterateNext()
  const modelResult = document.evaluate('//*[local-name()="instance"]/*', doc)
  const model = modelResult.iterateNext()

  const resolver = buildXPathResolverFn(doc)

  return {
    tree,
    model,
    resolver
  }
}

describe('TreeNode', () => {
  it('sets up allItems with cascading', () => {
    const {
      tree,
      model,
      resolver
    } = setup(treeXml)

    const checkedFields = ['/Parent1']

    const treeNode = new TreeNode({
      cascade: true,
      checkedFields,
      element: tree,
      model,
      resolver,
      separator: '/'
    })

    expect(treeNode.allItems['/Parent1'].cascade).to.eq(true)
    expect(treeNode.allItems['/Parent1'].checked).to.eq(true)
    expect(treeNode.allItems['/Parent1'].disabled).to.eq(false)
    expect(treeNode.allItems['/Parent1'].expanded).to.eq(true)
    expect(treeNode.allItems['/Parent1'].fullValue).to.eq('/Parent1')
    expect(treeNode.allItems['/Parent1'].id).to.eq('/Parent1')
    expect(treeNode.allItems['/Parent1'].label).to.eq('Parent1')
    expect(treeNode.allItems['/Parent1'].level).to.eq(1)
    expect(treeNode.allItems['/Parent1'].relevant).to.eq(true)
    expect(treeNode.allItems['/Parent1'].required).to.eq(false)
    expect(treeNode.allItems['/Parent1'].value).to.eq('Parent1')

    expect(treeNode.allItems['/Parent1/Child1'].cascade).to.eq(true)
    expect(treeNode.allItems['/Parent1/Child1'].checked).to.eq(true)
    expect(treeNode.allItems['/Parent1/Child1'].disabled).to.eq(false)
    expect(treeNode.allItems['/Parent1/Child1'].expanded).to.eq(false)
    expect(treeNode.allItems['/Parent1/Child1'].fullValue).to.eq('/Parent1/Child1')
    expect(treeNode.allItems['/Parent1/Child1'].id).to.eq('/Parent1/Child1')
    expect(treeNode.allItems['/Parent1/Child1'].label).to.eq('Child 1')
    expect(treeNode.allItems['/Parent1/Child1'].level).to.eq(2)
    expect(treeNode.allItems['/Parent1/Child1'].relevant).to.eq(true)
    expect(treeNode.allItems['/Parent1/Child1'].required).to.eq(false)
    expect(treeNode.allItems['/Parent1/Child1'].value).to.eq('Child1')
  })

  it('sets up allItems without cascading', () => {
    const {
      tree,
      model,
      resolver
    } = setup(treeXml)

    const checkedFields = ['/Parent1']

    const treeNode = new TreeNode({
      cascade: false,
      checkedFields,
      element: tree,
      model,
      resolver,
      separator: '/'
    })

    expect(treeNode.allItems['/Parent1'].cascade).to.eq(false)
    expect(treeNode.allItems['/Parent1'].checked).to.eq(true)
    expect(treeNode.allItems['/Parent1'].disabled).to.eq(false)
    expect(treeNode.allItems['/Parent1'].fullValue).to.eq('/Parent1')
    expect(treeNode.allItems['/Parent1'].id).to.eq('/Parent1')
    expect(treeNode.allItems['/Parent1'].label).to.eq('Parent1')
    expect(treeNode.allItems['/Parent1'].level).to.eq(1)
    expect(treeNode.allItems['/Parent1'].relevant).to.eq(true)
    expect(treeNode.allItems['/Parent1'].required).to.eq(false)
    expect(treeNode.allItems['/Parent1'].value).to.eq('Parent1')

    expect(treeNode.allItems['/Parent1/Child1'].cascade).to.eq(false)
    expect(treeNode.allItems['/Parent1/Child1'].checked).to.eq(false)
    expect(treeNode.allItems['/Parent1/Child1'].disabled).to.eq(false)
    expect(treeNode.allItems['/Parent1/Child1'].fullValue).to.eq('/Parent1/Child1')
    expect(treeNode.allItems['/Parent1/Child1'].id).to.eq('/Parent1/Child1')
    expect(treeNode.allItems['/Parent1/Child1'].label).to.eq('Child 1')
    expect(treeNode.allItems['/Parent1/Child1'].level).to.eq(2)
    expect(treeNode.allItems['/Parent1/Child1'].relevant).to.eq(true)
    expect(treeNode.allItems['/Parent1/Child1'].required).to.eq(false)
    expect(treeNode.allItems['/Parent1/Child1'].value).to.eq('Child1')
  })

  it('cascading handles indeterminate parents', () => {
    const {
      tree,
      model,
      resolver
    } = setup(treeWithIndeterminateXml)

    const checkedFields = ['/Parent1/Child2']

    const treeNode = new TreeNode({
      cascade: true,
      checkedFields,
      element: tree,
      model,
      resolver,
      separator: '/'
    })

    expect(treeNode.allItems['/Parent1'].cascade).to.eq(true)
    expect(treeNode.allItems['/Parent1'].checked).to.eq('indeterminate')
    expect(treeNode.allItems['/Parent1'].disabled).to.eq(false)
    expect(treeNode.allItems['/Parent1'].expanded).to.eq(true)
    expect(treeNode.allItems['/Parent1'].fullValue).to.eq('/Parent1')
    expect(treeNode.allItems['/Parent1'].id).to.eq('/Parent1')
    expect(treeNode.allItems['/Parent1'].label).to.eq('Parent1')
    expect(treeNode.allItems['/Parent1'].level).to.eq(1)
    expect(treeNode.allItems['/Parent1'].relevant).to.eq(true)
    expect(treeNode.allItems['/Parent1'].required).to.eq(false)
    expect(treeNode.allItems['/Parent1'].value).to.eq('Parent1')

    expect(treeNode.allItems['/Parent1/Child1'].cascade).to.eq(true)
    expect(treeNode.allItems['/Parent1/Child1'].checked).to.eq(false)
    expect(treeNode.allItems['/Parent1/Child1'].disabled).to.eq(false)
    expect(treeNode.allItems['/Parent1/Child1'].expanded).to.eq(false)
    expect(treeNode.allItems['/Parent1/Child1'].fullValue).to.eq('/Parent1/Child1')
    expect(treeNode.allItems['/Parent1/Child1'].id).to.eq('/Parent1/Child1')
    expect(treeNode.allItems['/Parent1/Child1'].label).to.eq('Child 1')
    expect(treeNode.allItems['/Parent1/Child1'].level).to.eq(2)
    expect(treeNode.allItems['/Parent1/Child1'].relevant).to.eq(true)
    expect(treeNode.allItems['/Parent1/Child1'].required).to.eq(false)
    expect(treeNode.allItems['/Parent1/Child1'].value).to.eq('Child1')

    expect(treeNode.allItems['/Parent1/Child2'].cascade).to.eq(true)
    expect(treeNode.allItems['/Parent1/Child2'].checked).to.eq(true)
    expect(treeNode.allItems['/Parent1/Child2'].disabled).to.eq(false)
    expect(treeNode.allItems['/Parent1/Child2'].expanded).to.eq(false)
    expect(treeNode.allItems['/Parent1/Child2'].fullValue).to.eq('/Parent1/Child2')
    expect(treeNode.allItems['/Parent1/Child2'].id).to.eq('/Parent1/Child2')
    expect(treeNode.allItems['/Parent1/Child2'].label).to.eq('Child 2')
    expect(treeNode.allItems['/Parent1/Child2'].level).to.eq(2)
    expect(treeNode.allItems['/Parent1/Child2'].relevant).to.eq(true)
    expect(treeNode.allItems['/Parent1/Child2'].required).to.eq(false)
    expect(treeNode.allItems['/Parent1/Child2'].value).to.eq('Child2')
  })

  it('updateNode updates allItems', () => {
    const {
      tree,
      model,
      resolver
    } = setup(treeXml)

    const checkedFields = ['/Parent1']

    const treeNode = new TreeNode({
      cascade: true,
      checkedFields,
      element: tree,
      model,
      resolver,
      separator: '/'
    })

    const newCheckedFields = []
    treeNode.updateNode(tree, model, newCheckedFields)

    expect(treeNode.allItems['/Parent1'].cascade).to.eq(true)
    expect(treeNode.allItems['/Parent1'].checked).to.eq(false)
    expect(treeNode.allItems['/Parent1'].disabled).to.eq(false)
    expect(treeNode.allItems['/Parent1'].expanded).to.eq(true)
    expect(treeNode.allItems['/Parent1'].fullValue).to.eq('/Parent1')
    expect(treeNode.allItems['/Parent1'].id).to.eq('/Parent1')
    expect(treeNode.allItems['/Parent1'].label).to.eq('Parent1')
    expect(treeNode.allItems['/Parent1'].level).to.eq(1)
    expect(treeNode.allItems['/Parent1'].relevant).to.eq(true)
    expect(treeNode.allItems['/Parent1'].required).to.eq(false)
    expect(treeNode.allItems['/Parent1'].value).to.eq('Parent1')

    expect(treeNode.allItems['/Parent1/Child1'].cascade).to.eq(true)
    expect(treeNode.allItems['/Parent1/Child1'].checked).to.eq(false)
    expect(treeNode.allItems['/Parent1/Child1'].disabled).to.eq(false)
    expect(treeNode.allItems['/Parent1/Child1'].expanded).to.eq(false)
    expect(treeNode.allItems['/Parent1/Child1'].fullValue).to.eq('/Parent1/Child1')
    expect(treeNode.allItems['/Parent1/Child1'].id).to.eq('/Parent1/Child1')
    expect(treeNode.allItems['/Parent1/Child1'].label).to.eq('Child 1')
    expect(treeNode.allItems['/Parent1/Child1'].level).to.eq(2)
    expect(treeNode.allItems['/Parent1/Child1'].relevant).to.eq(true)
    expect(treeNode.allItems['/Parent1/Child1'].required).to.eq(false)
    expect(treeNode.allItems['/Parent1/Child1'].value).to.eq('Child1')
  })

  it('checks and disables required fields', () => {
    const {
      tree,
      model,
      resolver
    } = setup(treeWithRequiredXml)

    const checkedFields = []

    const treeNode = new TreeNode({
      cascade: true,
      checkedFields,
      element: tree,
      model,
      resolver,
      separator: '/'
    })

    expect(treeNode.allItems['/Parent1'].cascade).to.eq(true)
    expect(treeNode.allItems['/Parent1'].checked).to.eq(true)
    expect(treeNode.allItems['/Parent1'].disabled).to.eq(false)
    expect(treeNode.allItems['/Parent1'].fullValue).to.eq('/Parent1')
    expect(treeNode.allItems['/Parent1'].id).to.eq('/Parent1')
    expect(treeNode.allItems['/Parent1'].label).to.eq('Parent1')
    expect(treeNode.allItems['/Parent1'].level).to.eq(1)
    expect(treeNode.allItems['/Parent1'].relevant).to.eq(true)
    expect(treeNode.allItems['/Parent1'].required).to.eq(false)
    expect(treeNode.allItems['/Parent1'].value).to.eq('Parent1')

    expect(treeNode.allItems['/Parent1/Child1'].cascade).to.eq(true)
    expect(treeNode.allItems['/Parent1/Child1'].checked).to.eq(true)
    expect(treeNode.allItems['/Parent1/Child1'].disabled).to.eq(true)
    expect(treeNode.allItems['/Parent1/Child1'].fullValue).to.eq('/Parent1/Child1')
    expect(treeNode.allItems['/Parent1/Child1'].id).to.eq('/Parent1/Child1')
    expect(treeNode.allItems['/Parent1/Child1'].label).to.eq('Child 1')
    expect(treeNode.allItems['/Parent1/Child1'].level).to.eq(2)
    expect(treeNode.allItems['/Parent1/Child1'].relevant).to.eq(true)
    expect(treeNode.allItems['/Parent1/Child1'].required).to.eq(true)
    expect(treeNode.allItems['/Parent1/Child1'].value).to.eq('Child1')
  })

  it('disables irrelevant fields', () => {
    const {
      tree,
      model,
      resolver
    } = setup(treeWithIrrelevantXml)

    const checkedFields = []

    const treeNode = new TreeNode({
      cascade: true,
      checkedFields,
      element: tree,
      model,
      resolver,
      separator: '/'
    })

    expect(treeNode.allItems['/Parent1'].cascade).to.eq(true)
    expect(treeNode.allItems['/Parent1'].checked).to.eq(false)
    expect(treeNode.allItems['/Parent1'].disabled).to.eq(false)
    expect(treeNode.allItems['/Parent1'].fullValue).to.eq('/Parent1')
    expect(treeNode.allItems['/Parent1'].id).to.eq('/Parent1')
    expect(treeNode.allItems['/Parent1'].label).to.eq('Parent1')
    expect(treeNode.allItems['/Parent1'].level).to.eq(1)
    expect(treeNode.allItems['/Parent1'].relevant).to.eq(true)
    expect(treeNode.allItems['/Parent1'].required).to.eq(false)
    expect(treeNode.allItems['/Parent1'].value).to.eq('Parent1')

    expect(treeNode.allItems['/Parent1/Child1'].cascade).to.eq(true)
    expect(treeNode.allItems['/Parent1/Child1'].checked).to.eq(false)
    expect(treeNode.allItems['/Parent1/Child1'].disabled).to.eq(true)
    expect(treeNode.allItems['/Parent1/Child1'].fullValue).to.eq('/Parent1/Child1')
    expect(treeNode.allItems['/Parent1/Child1'].id).to.eq('/Parent1/Child1')
    expect(treeNode.allItems['/Parent1/Child1'].label).to.eq('Child 1')
    expect(treeNode.allItems['/Parent1/Child1'].level).to.eq(2)
    expect(treeNode.allItems['/Parent1/Child1'].relevant).to.eq(false)
    expect(treeNode.allItems['/Parent1/Child1'].required).to.eq(false)
    expect(treeNode.allItems['/Parent1/Child1'].value).to.eq('Child1')
  })

  it('returns the total leaf nodes', () => {
    const {
      tree,
      model,
      resolver
    } = setup(treeXml)

    const checkedFields = []

    const treeNode = new TreeNode({
      cascade: true,
      checkedFields,
      element: tree,
      model,
      resolver,
      separator: '/'
    })

    expect(treeNode.getTotalLeafNodes()).to.eq(1)
  })

  it('returns the number of selected nodes', () => {
    const {
      tree,
      model,
      resolver
    } = setup(treeXml)

    const checkedFields = []

    const treeNode = new TreeNode({
      cascade: true,
      checkedFields,
      element: tree,
      model,
      resolver,
      separator: '/'
    })

    expect(treeNode.getNumberSelectedNodes()).to.eq(0)
  })

  it('updates the expanded property', () => {
    const {
      tree,
      model,
      resolver
    } = setup(treeXml)

    const checkedFields = []

    const treeNode = new TreeNode({
      cascade: true,
      checkedFields,
      element: tree,
      model,
      resolver,
      separator: '/'
    })

    expect(treeNode.allItems['/Parent1'].expanded).to.eq(true)

    treeNode.allItems['/Parent1'].setExpanded(false)

    expect(treeNode.allItems['/Parent1'].expanded).to.eq(false)
  })

  it('returns the seralized data', () => {
    const {
      tree,
      model,
      resolver
    } = setup(treeXml)

    const checkedFields = ['/Parent1']

    const treeNode = new TreeNode({
      cascade: true,
      checkedFields,
      element: tree,
      model,
      resolver,
      separator: '/'
    })

    expect(treeNode.seralize()).to.eql(['/Parent1', '/Parent1/Child1'])
  })

  it('returns the simplified seralized data', () => {
    const {
      tree,
      model,
      resolver
    } = setup(treeWithSimplifyOutputXml)

    let checkedFields = ['/Parent1']
    let treeNode = new TreeNode({
      cascade: true,
      checkedFields,
      element: tree,
      model,
      resolver,
      separator: '/',
      simplifyOutput: true
    })

    expect(treeNode.seralize()).to.eql([
      '/Parent1',
      '/Parent1/Child1-1',
      '/Parent1/Child1-1/Child1-1-1',
      '/Parent1/Child1-1/Child1-1-2',
      '/Parent1/Child1-1/Child1-1-3',
      '/Parent1/Child1-1/Child1-1-3/Child1-1-3-1',
      '/Parent1/Child1-1/Child1-1-3/Child1-1-3-2',
      '/Parent1/Child1-2',
      '/Parent1/Child1-2/Child1-2-1',
      '/Parent1/Child1-2/Child1-2-2',
      '/Parent1/Child1-3',
      '/Parent1/Child1-3/Child1-3-1',
      '/Parent1/Child1-3/Child1-3-2'
    ])
    expect(treeNode.simplifiedSeralize()).to.eql(['/Parent1'])


    checkedFields = [
      '/Parent1/Child1-1/Child1-1-3/Child1-1-3-1',
      '/Parent1/Child1-2/Child1-2-1',
      '/Parent1/Child1-2/Child1-2-2',
      '/Parent1/Child1-3'
    ]
    treeNode = new TreeNode({
      cascade: true,
      checkedFields,
      element: tree,
      model,
      resolver,
      separator: '/',
      simplifyOutput: true
    })
    expect(treeNode.seralize()).to.eql([
      '/Parent1/Child1-1/Child1-1-3/Child1-1-3-1',
      '/Parent1/Child1-2',
      '/Parent1/Child1-2/Child1-2-1',
      '/Parent1/Child1-2/Child1-2-2',
      '/Parent1/Child1-3',
      '/Parent1/Child1-3/Child1-3-1',
      '/Parent1/Child1-3/Child1-3-2'
    ])
    expect(treeNode.simplifiedSeralize()).to.eql([
      '/Parent1/Child1-1/Child1-1-3/Child1-1-3-1',
      '/Parent1/Child1-2',
      '/Parent1/Child1-3'
    ])
  })

  it('selecting an indeterminate parents selects all children', () => {
    const {
      tree,
      model,
      resolver
    } = setup(treeWithIndeterminateXml)

    const checkedFields = ['/Parent1/Child2']

    const treeNode = new TreeNode({
      cascade: true,
      checkedFields,
      element: tree,
      model,
      resolver,
      separator: '/'
    })

    treeNode.allItems['/Parent1'].setChecked(true)

    expect(treeNode.allItems['/Parent1'].checked).to.eq(true)
    expect(treeNode.allItems['/Parent1/Child1'].checked).to.eq(true)
    expect(treeNode.allItems['/Parent1/Child2'].checked).to.eq(true)
  })

  describe('formatFilterText', () => {
    it('removes leading and trailing spaces', () => {
      const {
        tree,
        model,
        resolver
      } = setup(treeXml)

      const checkedFields = ['/Parent1']

      const treeNode = new TreeNode({
        cascade: true,
        checkedFields,
        element: tree,
        model,
        resolver,
        separator: '/'
      })

      expect(treeNode.allItems['/Parent1'].formatFilterText('  test text  ')).to.eq('test text')
    })

    it('lowercases the filter text', () => {
      const {
        tree,
        model,
        resolver
      } = setup(treeXml)

      const checkedFields = ['/Parent1']

      const treeNode = new TreeNode({
        cascade: true,
        checkedFields,
        element: tree,
        model,
        resolver,
        separator: '/'
      })

      expect(treeNode.allItems['/Parent1'].formatFilterText('TEST')).to.eq('test')
    })
  })

  describe('matchesFilter', () => {
    it('returns true if the filter text matches the label', () => {
      const {
        tree,
        model,
        resolver
      } = setup(treeXml)

      const checkedFields = ['/Parent1']

      const treeNode = new TreeNode({
        cascade: true,
        checkedFields,
        element: tree,
        model,
        resolver,
        separator: '/'
      })

      expect(treeNode.allItems['/Parent1'].matchesFilter('ren')).to.eq(true)
    })

    it('returns false if the filter text does not matches the label', () => {
      const {
        tree,
        model,
        resolver
      } = setup(treeXml)

      const checkedFields = ['/Parent1']

      const treeNode = new TreeNode({
        cascade: true,
        checkedFields,
        element: tree,
        model,
        resolver,
        separator: '/'
      })

      expect(treeNode.allItems['/Parent1'].matchesFilter('asdf')).to.eq(false)
    })
  })

  describe('childrenMatchFilter', () => {
    it('returns true if the filter text matches any children\'s label', () => {
      const {
        tree,
        model,
        resolver
      } = setup(treeXml)

      const checkedFields = ['/Parent1']

      const treeNode = new TreeNode({
        cascade: true,
        checkedFields,
        element: tree,
        model,
        resolver,
        separator: '/'
      })

      expect(treeNode.allItems['/Parent1'].childrenMatchFilter('chi')).to.eq(true)
    })

    it('returns false if the filter text does not matches the label', () => {
      const {
        tree,
        model,
        resolver
      } = setup(treeXml)

      const checkedFields = ['/Parent1']

      const treeNode = new TreeNode({
        cascade: true,
        checkedFields,
        element: tree,
        model,
        resolver,
        separator: '/'
      })

      expect(treeNode.allItems['/Parent1'].childrenMatchFilter('asdf')).to.eq(false)
    })
  })
})
