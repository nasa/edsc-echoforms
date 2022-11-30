/* eslint-disable react/react-in-jsx-scope, react/jsx-no-constructed-context-values */
import {
  checkboxXml,
  datetimeXml,
  doubleXml,
  groupXml,
  integerXml,
  longXml,
  multiSelectXml,
  notRelevantXml,
  outputXml,
  rangeXml,
  readOnlyXml,
  secretXml,
  selectrefXml,
  selectXml,
  shortXml,
  textareaXml,
  textfieldXml,
  treeXml,
  urlOutputXml
} from '../mocks/FormElement'
import EDSCEchoform from '../../src'

const setup = (file, overrideProps) => {
  const onFormModelUpdatedSpy = cy.spy().as('onFormModelUpdatedSpy')
  const onFormIsValidUpdatedSpy = cy.spy().as('onFormIsValidUpdatedSpy')

  const props = {
    form: file,
    onFormModelUpdated: onFormModelUpdatedSpy,
    onFormIsValidUpdated: onFormIsValidUpdatedSpy,
    ...overrideProps
  }

  // This test is testing FormElement logic, but its just easier to load the xml into the EDSCEchoform component
  cy.mount(
    <EDSCEchoform {...props} />
  )
}

describe('FormElement component', () => {
  it('renders a Checkbox component', () => {
    setup(checkboxXml)

    cy.get('#boolinput').should('exist')
  })

  it('renders a TextField component', () => {
    setup(textfieldXml)

    cy.get('#textinput').should('exist')
  })

  it('renders a secret TextField component', () => {
    setup(secretXml)

    cy.get('#secret').should('exist')
  })

  it('renders a TextArea component', () => {
    setup(textareaXml)

    cy.get('#textinput').should('exist')
  })

  it('renders a Select component', () => {
    setup(selectXml)

    cy.get('#selectinput').should('exist')
  })

  it('renders a multi-Select component', () => {
    setup(multiSelectXml)

    cy.get('#selectinput').should('exist')
  })

  it('renders a Select component for a selectref field', () => {
    setup(selectrefXml)

    cy.get('#selectinput').should('exist')
  })

  it('renders a DateTime component', () => {
    setup(datetimeXml)

    cy.get('#datetimeinput').should('exist')
  })

  it('renders an Output component', () => {
    setup(outputXml)

    cy.get('#output').should('exist')
  })

  it('renders a URL Output component', () => {
    setup(urlOutputXml)

    cy.get('#output').should('exist')
  })

  it('does not render a field that is not relevant', () => {
    setup(notRelevantXml)

    cy.get('#textinput').should('not.exist')
  })

  it('renders a readonly field as readonly', () => {
    setup(readOnlyXml)

    cy.get('#textinput')
      .should('exist')
      .and('have.attr', 'readonly')
  })

  it('renders a Group component', () => {
    setup(groupXml)

    cy.get('#group').should('exist')
    cy.get('#group').find('#textinput').should('exist')
  })

  it('renders a Range component', () => {
    setup(rangeXml)

    cy.get('#range').should('exist')
  })

  it('renders a Number component for doubles', () => {
    setup(doubleXml)

    cy.get('#double').should('exist')
  })

  it('renders a Number component for integers', () => {
    setup(integerXml)

    cy.get('#integer').should('exist')
  })

  it('renders a Number component for longs', () => {
    setup(longXml)

    cy.get('#long').should('exist')
  })

  it('renders a Number component for shorts', () => {
    setup(shortXml)

    cy.get('#short').should('exist')
  })

  it('renders a Tree component', () => {
    setup(treeXml)

    cy.get('#subset_datalayer_tree').should('exist')
  })
})
