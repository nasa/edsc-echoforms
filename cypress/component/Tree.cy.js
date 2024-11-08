/* eslint-disable react/react-in-jsx-scope, react/jsx-no-constructed-context-values */
import murmurhash from 'murmurhash'

import {
  treeWithMaxParametersXml,
  treeWithNestedDisabledFieldsXml,
  treeWithNestedScrollableXml,
  treeXml
} from '../mocks/FormElement'
import { Tree } from '../../src/components/Tree/Tree'
import { EchoFormsContext } from '../../src/context/EchoFormsContext'
import { parseXml } from '../../src/util/parseXml'
import EDSCEchoform from '../../src'

const readXml = (file) => {
  const doc = parseXml(file)
  const treeResult = doc.evaluate('//*[local-name()="tree"]', doc)
  const tree = treeResult.iterateNext()
  const modelResult = doc.evaluate('//*[local-name()="instance"]', doc)
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
    readOnly: false,
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

    cy.get('.ef-tree__filter-label').should('have.text', 'Filter')
    cy.get('#ef-tree_filter_input').should('have.attr', 'placeholder', 'Enter text to filter bands')
    cy.get('.ef-tree__filter-clear-button').should('have.text', 'Clear')

    cy.get('.ef-tree__node-count-text').should('have.text', '0 of 1 bands selected')

    cy.get('.ef-tree__list').find('input').should('have.length', 2)
    cy.get('.ef-tree-item--is-open').should('exist')
  })

  it('changing a TreeItem calls onUpdateModel', () => {
    setup()

    cy.get('.ef-tree__list').find('input').first().click()

    cy.get('@onUpdateModelSpy')
      .and(
        'have.been.calledOnceWith',
        'parentRef',
        'testfield',
        {
          value: ['/Parent1', '/Parent1/Child1'],
          valueElementName: 'data_layer'
        }
      )
  })

  it('onUpdateModel isn\'t called if the tree value hasn\'t changed', () => {
    setup()

    cy.get('@onUpdateModelSpy')
      .should('have.not.been.called')
  })

  it('updating a simplifyOutput tree calls setSimplifiedTree', () => {
    setup({ simplifyOutput: true })

    cy.get('.ef-tree__list').find('input').first().click()

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

    cy.get('#ef-tree_filter_input').type('filter text')

    cy.get('#ef-tree_filter_input').should('have.value', 'filter text')
  })

  it('onFilterClear clears the filterText', () => {
    setup()

    cy.get('#ef-tree_filter_input').type('filter text')

    cy.get('.ef-tree__filter-clear-button').click()

    cy.get('#ef-tree_filter_input').should('have.value', '')
  })

  // These tests need the full form loaded to properly test the tree interactions,
  // so it mounts EDSCEchoform instead of Tree
  describe('nested disabled fields', () => {
    it('selects the initial fields correctly', () => {
      const onFormModelUpdatedSpy = cy.spy().as('onFormModelUpdatedSpy')
      const onFormIsValidUpdatedSpy = cy.spy().as('onFormIsValidUpdatedSpy')

      cy.mount(
        <EDSCEchoform
          form={treeWithNestedDisabledFieldsXml}
          onFormModelUpdated={onFormModelUpdatedSpy}
          onFormIsValidUpdated={onFormIsValidUpdatedSpy}
        />
      )

      // Expand tree
      cy.get('[data-cy="ef-tree-item__parent-button-2"]').click()
      cy.get('[data-cy="ef-tree-item__parent-button-3"]').click()

      cy.get('[data-cy="/Parent1"]:indeterminate').should('exist')
      cy.get('[data-cy="/Parent1/Child1-1"]:indeterminate').should('exist')
      cy.get('[data-cy="/Parent1/Child1-1/Child1-1-1"]').should('be.checked')
      cy.get('[data-cy="/Parent1/Child1-1/Child1-1-2"]:indeterminate').should('exist')
      cy.get('[data-cy="/Parent1/Child1-1/Child1-1-2/Child1-1-2-1"]').should('be.checked')
      cy.get('[data-cy="/Parent1/Child1-1/Child1-1-2/Child1-1-2-2"]').should('not.be.checked')
    })

    it('unchecks all fields correctly', () => {
      const onFormModelUpdatedSpy = cy.spy().as('onFormModelUpdatedSpy')
      const onFormIsValidUpdatedSpy = cy.spy().as('onFormIsValidUpdatedSpy')

      cy.mount(
        <EDSCEchoform
          form={treeWithNestedDisabledFieldsXml}
          onFormModelUpdated={onFormModelUpdatedSpy}
          onFormIsValidUpdated={onFormIsValidUpdatedSpy}
        />
      )

      // Expand tree
      cy.get('[data-cy="ef-tree-item__parent-button-2"]').click()
      cy.get('[data-cy="ef-tree-item__parent-button-3"]').click()

      // Uncheck top parent
      cy.get('[data-cy="/Parent1"]').click()

      cy.get('[data-cy="/Parent1"]').should('not.be.checked')
      cy.get('[data-cy="/Parent1/Child1-1"]').should('not.be.checked')
      cy.get('[data-cy="/Parent1/Child1-1/Child1-1-1"]').should('not.be.checked')
      cy.get('[data-cy="/Parent1/Child1-1/Child1-1-2"]').should('not.be.checked')
      cy.get('[data-cy="/Parent1/Child1-1/Child1-1-2/Child1-1-2-1"]').should('not.be.checked')
      cy.get('[data-cy="/Parent1/Child1-1/Child1-1-2/Child1-1-2-2"]').should('not.be.checked')
    })

    it('handles middle parent correctly', () => {
      const onFormModelUpdatedSpy = cy.spy().as('onFormModelUpdatedSpy')
      const onFormIsValidUpdatedSpy = cy.spy().as('onFormIsValidUpdatedSpy')

      cy.mount(
        <EDSCEchoform
          form={treeWithNestedDisabledFieldsXml}
          onFormModelUpdated={onFormModelUpdatedSpy}
          onFormIsValidUpdated={onFormIsValidUpdatedSpy}
        />
      )

      // Expand tree
      cy.get('[data-cy="ef-tree-item__parent-button-2"]').click()
      cy.get('[data-cy="ef-tree-item__parent-button-3"]').click()

      // Uncheck middle parent
      cy.get('[data-cy="/Parent1/Child1-1"]').click()

      cy.get('[data-cy="/Parent1"]').should('not.be.checked')
      cy.get('[data-cy="/Parent1/Child1-1"]').should('not.be.checked')
      cy.get('[data-cy="/Parent1/Child1-1/Child1-1-1"]').should('not.be.checked')
      cy.get('[data-cy="/Parent1/Child1-1/Child1-1-2"]').should('not.be.checked')
      cy.get('[data-cy="/Parent1/Child1-1/Child1-1-2/Child1-1-2-1"]').should('not.be.checked')
      cy.get('[data-cy="/Parent1/Child1-1/Child1-1-2/Child1-1-2-2"]').should('not.be.checked')

      // Check middle parent
      cy.get('[data-cy="/Parent1/Child1-1"]').click()

      cy.get('[data-cy="/Parent1"]:indeterminate').should('exist')
      cy.get('[data-cy="/Parent1/Child1-1"]:indeterminate').should('exist')
      cy.get('[data-cy="/Parent1/Child1-1/Child1-1-1"]').should('be.checked')
      cy.get('[data-cy="/Parent1/Child1-1/Child1-1-2"]:indeterminate').should('exist')
      cy.get('[data-cy="/Parent1/Child1-1/Child1-1-2/Child1-1-2-1"]').should('be.checked')
      cy.get('[data-cy="/Parent1/Child1-1/Child1-1-2/Child1-1-2-2"]').should('not.be.checked')
    })

    it('handles lower parent correctly', () => {
      const onFormModelUpdatedSpy = cy.spy().as('onFormModelUpdatedSpy')
      const onFormIsValidUpdatedSpy = cy.spy().as('onFormIsValidUpdatedSpy')

      cy.mount(
        <EDSCEchoform
          form={treeWithNestedDisabledFieldsXml}
          onFormModelUpdated={onFormModelUpdatedSpy}
          onFormIsValidUpdated={onFormIsValidUpdatedSpy}
        />
      )

      // Expand tree
      cy.get('[data-cy="ef-tree-item__parent-button-2"]').click()
      cy.get('[data-cy="ef-tree-item__parent-button-3"]').click()

      // Uncheck middle parent
      cy.get('[data-cy="/Parent1/Child1-1/Child1-1-2"]').click()

      cy.get('[data-cy="/Parent1"]:indeterminate').should('exist')
      cy.get('[data-cy="/Parent1/Child1-1"]:indeterminate').should('exist')
      cy.get('[data-cy="/Parent1/Child1-1/Child1-1-1"]').should('be.checked')
      cy.get('[data-cy="/Parent1/Child1-1/Child1-1-2"]').should('not.be.checked')
      cy.get('[data-cy="/Parent1/Child1-1/Child1-1-2/Child1-1-2-1"]').should('not.be.checked')
      cy.get('[data-cy="/Parent1/Child1-1/Child1-1-2/Child1-1-2-2"]').should('not.be.checked')

      // Check middle parent
      cy.get('[data-cy="/Parent1/Child1-1"]').click()

      cy.get('[data-cy="/Parent1"]:indeterminate').should('exist')
      cy.get('[data-cy="/Parent1/Child1-1"]:indeterminate').should('exist')
      cy.get('[data-cy="/Parent1/Child1-1/Child1-1-1"]').should('be.checked')
      cy.get('[data-cy="/Parent1/Child1-1/Child1-1-2"]:indeterminate').should('exist')
      cy.get('[data-cy="/Parent1/Child1-1/Child1-1-2/Child1-1-2-1"]').should('be.checked')
      cy.get('[data-cy="/Parent1/Child1-1/Child1-1-2/Child1-1-2-2"]').should('not.be.checked')
    })

    it('handles middle leaf correctly', () => {
      const onFormModelUpdatedSpy = cy.spy().as('onFormModelUpdatedSpy')
      const onFormIsValidUpdatedSpy = cy.spy().as('onFormIsValidUpdatedSpy')

      cy.mount(
        <EDSCEchoform
          form={treeWithNestedDisabledFieldsXml}
          onFormModelUpdated={onFormModelUpdatedSpy}
          onFormIsValidUpdated={onFormIsValidUpdatedSpy}
        />
      )

      // Expand tree
      cy.get('[data-cy="ef-tree-item__parent-button-2"]').click()
      cy.get('[data-cy="ef-tree-item__parent-button-3"]').click()

      // Uncheck middle value parent
      cy.get('[data-cy="/Parent1/Child1-1/Child1-1-1"]').click()

      cy.get('[data-cy="/Parent1"]:indeterminate').should('exist')
      cy.get('[data-cy="/Parent1/Child1-1"]:indeterminate').should('exist')
      cy.get('[data-cy="/Parent1/Child1-1/Child1-1-1"]').should('not.be.checked')
      cy.get('[data-cy="/Parent1/Child1-1/Child1-1-2"]:indeterminate').should('exist')
      cy.get('[data-cy="/Parent1/Child1-1/Child1-1-2/Child1-1-2-1"]').should('be.checked')
      cy.get('[data-cy="/Parent1/Child1-1/Child1-1-2/Child1-1-2-2"]').should('not.be.checked')

      // Check middle value parent
      cy.get('[data-cy="/Parent1/Child1-1/Child1-1-1"]').click()

      cy.get('[data-cy="/Parent1"]:indeterminate').should('exist')
      cy.get('[data-cy="/Parent1/Child1-1"]:indeterminate').should('exist')
      cy.get('[data-cy="/Parent1/Child1-1/Child1-1-1"]').should('be.checked')
      cy.get('[data-cy="/Parent1/Child1-1/Child1-1-2"]:indeterminate').should('exist')
      cy.get('[data-cy="/Parent1/Child1-1/Child1-1-2/Child1-1-2-1"]').should('be.checked')
      cy.get('[data-cy="/Parent1/Child1-1/Child1-1-2/Child1-1-2-2"]').should('not.be.checked')
    })

    it('handles lower leaf correctly', () => {
      const onFormModelUpdatedSpy = cy.spy().as('onFormModelUpdatedSpy')
      const onFormIsValidUpdatedSpy = cy.spy().as('onFormIsValidUpdatedSpy')

      cy.mount(
        <EDSCEchoform
          form={treeWithNestedDisabledFieldsXml}
          onFormModelUpdated={onFormModelUpdatedSpy}
          onFormIsValidUpdated={onFormIsValidUpdatedSpy}
        />
      )

      // Expand tree
      cy.get('[data-cy="ef-tree-item__parent-button-2"]').click()
      cy.get('[data-cy="ef-tree-item__parent-button-3"]').click()

      // Uncheck lower leaf
      cy.get('[data-cy="/Parent1/Child1-1/Child1-1-2/Child1-1-2-1"]').click()

      cy.get('[data-cy="/Parent1"]:indeterminate').should('exist')
      cy.get('[data-cy="/Parent1/Child1-1"]:indeterminate').should('exist')
      cy.get('[data-cy="/Parent1/Child1-1/Child1-1-1"]').should('be.checked')
      cy.get('[data-cy="/Parent1/Child1-1/Child1-1-2"]').should('not.be.checked')
      cy.get('[data-cy="/Parent1/Child1-1/Child1-1-2/Child1-1-2-1"]').should('not.be.checked')
      cy.get('[data-cy="/Parent1/Child1-1/Child1-1-2/Child1-1-2-2"]').should('not.be.checked')

      // Check lower leaf
      cy.get('[data-cy="/Parent1/Child1-1/Child1-1-2/Child1-1-2-1"]').click()

      cy.get('[data-cy="/Parent1"]:indeterminate').should('exist')
      cy.get('[data-cy="/Parent1/Child1-1"]:indeterminate').should('exist')
      cy.get('[data-cy="/Parent1/Child1-1/Child1-1-1"]').should('be.checked')
      cy.get('[data-cy="/Parent1/Child1-1/Child1-1-2"]:indeterminate').should('exist')
      cy.get('[data-cy="/Parent1/Child1-1/Child1-1-2/Child1-1-2-1"]').should('be.checked')
      cy.get('[data-cy="/Parent1/Child1-1/Child1-1-2/Child1-1-2-2"]').should('not.be.checked')
    })

    it('handles mixed nested values correctly', () => {
      const onFormModelUpdatedSpy = cy.spy().as('onFormModelUpdatedSpy')
      const onFormIsValidUpdatedSpy = cy.spy().as('onFormIsValidUpdatedSpy')

      cy.mount(
        <EDSCEchoform
          form={treeWithNestedDisabledFieldsXml}
          onFormModelUpdated={onFormModelUpdatedSpy}
          onFormIsValidUpdated={onFormIsValidUpdatedSpy}
        />
      )

      // Expand tree
      cy.get('[data-cy="ef-tree-item__parent-button-2"]').click()
      cy.get('[data-cy="ef-tree-item__parent-button-3"]').click()

      // Uncheck middle leaf
      cy.get('[data-cy="/Parent1/Child1-1/Child1-1-1"]').click()

      cy.get('[data-cy="/Parent1"]:indeterminate').should('exist')
      cy.get('[data-cy="/Parent1/Child1-1"]:indeterminate').should('exist')
      cy.get('[data-cy="/Parent1/Child1-1/Child1-1-1"]').should('not.be.checked')
      cy.get('[data-cy="/Parent1/Child1-1/Child1-1-2"]:indeterminate').should('exist')
      cy.get('[data-cy="/Parent1/Child1-1/Child1-1-2/Child1-1-2-1"]').should('be.checked')
      cy.get('[data-cy="/Parent1/Child1-1/Child1-1-2/Child1-1-2-2"]').should('not.be.checked')

      // Check top parent
      cy.get('[data-cy="/Parent1"]').click()

      cy.get('[data-cy="/Parent1"]:indeterminate').should('exist')
      cy.get('[data-cy="/Parent1/Child1-1"]:indeterminate').should('exist')
      cy.get('[data-cy="/Parent1/Child1-1/Child1-1-1"]').should('be.checked')
      cy.get('[data-cy="/Parent1/Child1-1/Child1-1-2"]:indeterminate').should('exist')
      cy.get('[data-cy="/Parent1/Child1-1/Child1-1-2/Child1-1-2-1"]').should('be.checked')
      cy.get('[data-cy="/Parent1/Child1-1/Child1-1-2/Child1-1-2-2"]').should('not.be.checked')

      // Uncheck lower leaf
      cy.get('[data-cy="/Parent1/Child1-1/Child1-1-2/Child1-1-2-1"]').click()

      cy.get('[data-cy="/Parent1"]:indeterminate').should('exist')
      cy.get('[data-cy="/Parent1/Child1-1"]:indeterminate').should('exist')
      cy.get('[data-cy="/Parent1/Child1-1/Child1-1-1"]').should('be.checked')
      cy.get('[data-cy="/Parent1/Child1-1/Child1-1-2"]').should('not.be.checked')
      cy.get('[data-cy="/Parent1/Child1-1/Child1-1-2/Child1-1-2-1"]').should('not.be.checked')
      cy.get('[data-cy="/Parent1/Child1-1/Child1-1-2/Child1-1-2-2"]').should('not.be.checked')

      // Check top parent
      cy.get('[data-cy="/Parent1"]').click()

      cy.get('[data-cy="/Parent1"]:indeterminate').should('exist')
      cy.get('[data-cy="/Parent1/Child1-1"]:indeterminate').should('exist')
      cy.get('[data-cy="/Parent1/Child1-1/Child1-1-1"]').should('be.checked')
      cy.get('[data-cy="/Parent1/Child1-1/Child1-1-2"]:indeterminate').should('exist')
      cy.get('[data-cy="/Parent1/Child1-1/Child1-1-2/Child1-1-2-1"]').should('be.checked')
      cy.get('[data-cy="/Parent1/Child1-1/Child1-1-2/Child1-1-2-2"]').should('not.be.checked')

      // We shouldn't be able to scroll because the leaf labels are not long enough
      cy.get('.ef-tree__list-wrapper').scrollTo('right', { ensureScrollable: false })
    })

    it('scrolls for long leaf label', () => {
      const onFormModelUpdatedSpy = cy.spy().as('onFormModelUpdatedSpy')
      const onFormIsValidUpdatedSpy = cy.spy().as('onFormIsValidUpdatedSpy')

      cy.mount(
        <EDSCEchoform
          form={treeWithNestedScrollableXml}
          onFormModelUpdated={onFormModelUpdatedSpy}
          onFormIsValidUpdated={onFormIsValidUpdatedSpy}
        />
      )

      // Expand tree
      cy.get('[data-cy="ef-tree-item__parent-button-2"]').click()
      cy.get('[data-cy="ef-tree-item__parent-button-3"]').click()

      // Scroll to right edge and verify that with the longer leaf label value, this element will be scrollable
      cy.get('.ef-tree__list-wrapper').scrollTo('right', { ensureScrollable: true })
    })
  })
})
