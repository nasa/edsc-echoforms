/* eslint-disable react/react-in-jsx-scope, react/jsx-no-constructed-context-values */
import murmurhash from 'murmurhash'

import { groupXml } from '../mocks/FormElement'
import { Group } from '../../src/components/Group/Group'
import { EchoFormsContext } from '../../src/context/EchoFormsContext'
import { buildXPathResolverFn } from '../../src/util/buildXPathResolverFn'
import { parseXml } from '../../src/util/parseXml'

const readXml = (file) => {
  const doc = parseXml(file)
  const groupResult = document.evaluate('//*[local-name()="group"]', doc)
  const group = groupResult.iterateNext()
  const modelResult = document.evaluate('//*[local-name()="instance"]', doc)
  const model = modelResult.iterateNext()

  const resolver = buildXPathResolverFn(doc)

  return {
    group,
    // Use firstElementChild because FormElement doesn't deal with <instance>
    model: model.firstElementChild,
    resolver
  }
}

const setup = (file, overrideProps) => {
  const { group, model, resolver } = readXml(file)

  const onUpdateModelSpy = cy.spy().as('onUpdateModelSpy')
  const setFormIsValidSpy = cy.spy().as('setFormIsValidSpy')
  const setRelevantFieldsSpy = cy.spy().as('setRelevantFieldsSpy')

  const elementHash = murmurhash.v3(group.outerHTML, 'seed')

  const props = {
    elementHash,
    id: 'testgroup',
    label: 'Test Group',
    model,
    modelRef: 'prov:groupreference',
    onUpdateModel: onUpdateModelSpy,
    ...overrideProps
  }

  const contextValue = {
    onUpdateModel: onUpdateModelSpy,
    resolver,
    setFormIsValid: setFormIsValidSpy,
    setRelevantFields: setRelevantFieldsSpy
  }

  cy.mount(
    <EchoFormsContext.Provider
      value={contextValue}
    >
      <Group {...props}>
        {group.children}
      </Group>
    </EchoFormsContext.Provider>
  )
}

describe('Group component', () => {
  it('renders the grouped elements', () => {
    setup(groupXml)

    cy.get('.group__header').should('contain.text', 'Test Group')
    cy.get('.group__header').find('.help-text').should('have.text', 'Helpful group text')

    cy.get('#textinput')
      .should('have.attr', 'value', 'test value')
      .and('have.attr', 'name', 'Text input')
      .and('not.have.attr', 'readOnly', 'required')

    cy.get('label')
      .should('have.text', 'Text input')
      .and('have.attr', 'for', 'textinput')
    cy.get('.group__body').find('.help-text').should('have.text', 'Helpful text')
  })
})
