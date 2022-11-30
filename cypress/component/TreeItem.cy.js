/* eslint-disable react/react-in-jsx-scope, react/jsx-no-constructed-context-values */
import { treeXml } from '../mocks/FormElement'
import { TreeItem } from '../../src/components/Tree/TreeItem'
import { EchoFormsContext } from '../../src/context/EchoFormsContext'
import { parseXml } from '../../src/util/parseXml'

const readXml = (file) => {
  const doc = parseXml(file)
  const inputResult = document.evaluate('//*[local-name()="input"]', doc)
  const input = inputResult.iterateNext()
  const modelResult = document.evaluate('//*[local-name()="instance"]', doc)
  const model = modelResult.iterateNext()

  return {
    input,
    model
  }
}

const defaultItem = {
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
    required: false,
    childrenMatchFilter: () => false,
    matchesFilter: () => true
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
  required: false
}

const setup = (
  overrideProps,
  {
    childrenMatchFilter = false,
    matchesFilter = false
  } = {}
) => {
  const { model } = readXml(treeXml)

  const onUpdateModelSpy = cy.spy().as('onUpdateModelSpy')
  const setFormIsValidSpy = cy.spy().as('setFormIsValidSpy')
  const onChange = cy.spy().as('onChange')
  const setChecked = cy.spy().as('setChecked')
  const setExpanded = cy.spy().as('setExpanded')

  const props = {
    item: {
      ...defaultItem,
      childrenMatchFilter: () => childrenMatchFilter,
      matchesFilter: () => matchesFilter,
      setChecked,
      setExpanded
    },
    model,
    onChange,
    isFirst: true,
    ...overrideProps
  }

  const contextValue = {
    onUpdateModel: onUpdateModelSpy,
    setFormIsValid: setFormIsValidSpy
  }

  cy.mount(
    <EchoFormsContext.Provider
      value={contextValue}
    >
      <TreeItem {...props} />
    </EchoFormsContext.Provider>
  )
}

describe('TreeItem component', () => {
  it('renders a checkbox element', () => {
    setup()

    cy.get('input').first()
      .should('be.checked')
      .and('have.attr', 'id', '/Parent1')
      .and('not.have.attr', 'disabled')

    cy.get('label').first()
      .should('have.text', 'Parent 1')
      .and('have.attr', 'for', '/Parent1')
  })

  it('renders a child TreeItem', () => {
    setup()

    cy.get('input').last()
      .should('be.checked')
      .and('have.attr', 'id', '/Parent1/Child1')
      .and('not.have.attr', 'disabled')

    cy.get('label').last()
      .should('have.text', 'Child 1')
      .and('have.attr', 'for', '/Parent1/Child1')
  })

  it('checking a checkbox calls setChecked', () => {
    setup()

    cy.get('input').first().click()

    cy.get('@setChecked')
      .should('have.been.calledOnce')
      .and('have.been.calledWith', false)
  })

  it('clicking expand/collapse button calls setExpanded', () => {
    setup()

    cy.get('button').first().click()

    cy.get('@setExpanded')
      .should('have.been.calledOnce')
      .and('have.been.calledWith', false)

    cy.get('button').first().click()

    cy.get('@setExpanded')
      .should('have.been.calledTwice')
      .and('have.been.calledWith', true)
  })

  it('does not render the node if it does not match the filterText', () => {
    setup(
      {
        filterText: 'asdf'
      },
      {
        childrenMatchFilter: false,
        matchesFilter: false
      }
    )

    cy.get('input').should('not.exist')
  })

  it('expands the node if children match the filterText', () => {
    setup(
      {
        filterText: 'Child'
      },
      {
        childrenMatchFilter: true,
        matchesFilter: false
      }
    )

    cy.get('input').should('have.length', 2)

    cy.get('.tree-item--is-parent').should('have.class', 'tree-item--is-open')
  })

  it('adds the level modifier classname', () => {
    setup({
      item: {
        ...defaultItem,
        level: 2
      }
    })

    cy.get('.tree-item--child-2').should('exist')
  })

  describe('when the item is a parent', () => {
    it('adds the modifier classname', () => {
      setup()

      cy.get('.tree-item--is-parent').should('exist')
    })
  })

  describe('when the item is first in the list', () => {
    it('adds the modifier classname', () => {
      setup()

      cy.get('.tree-item--is-first').should('exist')
    })
  })

  describe('when the item is last in the list', () => {
    it('adds the modifier classname', () => {
      setup({
        isFirst: false,
        isLast: true
      })

      cy.get('.tree-item--is-last').should('exist')
    })
  })

  describe('when the item is is open', () => {
    it('adds the modifier classname', () => {
      setup()

      cy.get('.tree-item--is-open').should('exist')
    })
  })

  describe('when the item is is closed', () => {
    it('does not add the modifier classname', () => {
      setup()

      cy.get('button').click()

      cy.get('.tree-item--is-open').should('not.exist')
    })
  })

  describe('when the item is not relevant', () => {
    it('adds the modifier classname', () => {
      setup({
        item: {
          ...defaultItem,
          relevant: false
        }
      })

      cy.get('.tree-item--is-not-relevant').should('exist')
    })
  })
})
