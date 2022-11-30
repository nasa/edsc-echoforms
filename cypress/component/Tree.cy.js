/* eslint-disable react/react-in-jsx-scope, react/jsx-no-constructed-context-values */
import murmurhash from 'murmurhash'

import { treeWithMaxParametersXml, treeXml } from '../mocks/FormElement'
import { Tree } from '../../src/components/Tree/Tree'
import { EchoFormsContext } from '../../src/context/EchoFormsContext'
import { parseXml } from '../../src/util/parseXml'

const readXml = (file) => {
  const doc = parseXml(file)
  const treeResult = document.evaluate('//*[local-name()="tree"]', doc)
  const tree = treeResult.iterateNext()
  const modelResult = document.evaluate('//*[local-name()="instance"]', doc)
  const model = modelResult.iterateNext()

  return {
    model,
    tree
  }
}

const setup = (overrideProps, file = treeXml) => {
  const { model, tree } = readXml(file)

  const onUpdateModelSpy = cy.spy().as('onUpdateModelSpy')
  const setFormIsValidSpy = cy.spy().as('setFormIsValidSpy')
  const setSimplifiedTreeSpy = cy.spy().as('setSimplifiedTreeSpy')

  const elementHash = murmurhash.v3(tree.outerHTML, 'seed')

  const props = {
    cascade: true,
    element: tree,
    elementHash,
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

  const contextValue = {
    model,
    onUpdateModel: onUpdateModelSpy,
    setFormIsValid: setFormIsValidSpy,
    setSimplifiedTree: setSimplifiedTreeSpy,
    simplifiedTree: {}
  }

  cy.mount(
    <EchoFormsContext.Provider
      value={contextValue}
    >
      <Tree {...props}>
        {tree.children}
      </Tree>
    </EchoFormsContext.Provider>
  )

  // These functions get called a couple times during initial setup of the component. Reset their history
  // to make the tests make more sense
  cy.get('@onUpdateModelSpy').invoke('resetHistory')
  cy.get('@setSimplifiedTreeSpy').invoke('resetHistory')
}

describe('Tree component', () => {
  it('renders a Tree', () => {
    setup()

    cy.get('.tree__filter-label').should('have.text', 'Filter')
    cy.get('#tree_filter_input').should('have.attr', 'placeholder', 'Enter text to filter bands')
    cy.get('.tree__filter-clear-button').should('have.text', 'Clear')

    cy.get('.tree__node-count-text').should('have.text', '0 of 1 bands selected')

    cy.get('.tree__list').find('input').should('have.length', 2)
    cy.get('.tree-item--is-open').should('exist')
  })

  it('changing a TreeItem calls onUpdateModel', () => {
    setup()

    cy.get('.tree__list').find('input').first().click()

    cy.get('@onUpdateModelSpy')
      .and(
        'have.been.calledOnceWith',
        'parentRef',
        'testfield',
        { value: ['/Parent1', '/Parent1/Child1'], valueElementName: 'data_layer' }
      )
  })

  it('onUpdateModel isn\'t called if the tree value hasn\'t changed', () => {
    setup()

    cy.get('@onUpdateModelSpy')
      .should('have.not.been.called')
  })

  it('updating a simplifyOutput tree calls setSimplifiedTree', () => {
    setup({ simplifyOutput: true })

    cy.get('.tree__list').find('input').first().click()

    cy.get('@setSimplifiedTreeSpy')
      .and(
        'have.been.calledOnceWith',
        {
          testfield: {
            parentRef: 'parentRef',
            modelRef: 'testfield',
            value: ['/Parent1'],
            valueElementName: 'data_layer'
          }
        }
      )
  })

  it('calculates the maxParameter error', () => {
    setup({
      maxParameters: '4',
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

    cy.get('.tree.is-invalid').should('exist')

    cy.get('.invalid-feedback').should('have.text', 'No more than 4 parameters can be selected.')
  })

  it('onFilterChange updates the filterText', () => {
    setup()

    cy.get('#tree_filter_input').type('filter text')

    cy.get('#tree_filter_input').should('have.value', 'filter text')
  })

  it('onFilterClear clears the filterText', () => {
    setup()

    cy.get('#tree_filter_input').type('filter text')

    cy.get('.tree__filter-clear-button').click()

    cy.get('#tree_filter_input').should('have.value', '')
  })
})
