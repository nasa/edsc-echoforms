/* eslint-disable react/react-in-jsx-scope, react/jsx-no-constructed-context-values */
import murmurhash from 'murmurhash'

import { datetimeXml } from '../mocks/FormElement'
import { DateTime } from '../../src/components/DateTime/DateTime'
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

const setup = (file, overrideProps, hasShapefile) => {
  const { input, model } = readXml(file)

  const onUpdateModelSpy = cy.spy().as('onUpdateModelSpy')
  const setFormIsValidSpy = cy.spy().as('setFormIsValidSpy')

  const elementHash = murmurhash.v3(input.outerHTML, 'seed')

  const props = {
    checked: 'true',
    elementHash,
    id: 'testfield',
    label: 'Test Field',
    model,
    modelRef: 'testfield',
    readOnly: false,
    required: false,
    value: '2020-01-01T00:00:00',
    ...overrideProps
  }

  const contextValue = {
    hasShapefile,
    onUpdateModel: onUpdateModelSpy,
    setFormIsValid: setFormIsValidSpy
  }

  cy.mount(
    <EchoFormsContext.Provider
      value={contextValue}
    >
      <DateTime {...props}>
        {input.children}
      </DateTime>
    </EchoFormsContext.Provider>
  )
}

describe('DateTime component', () => {
  it('renders a InputField component', () => {
    setup(datetimeXml)

    cy.get('#testfield')
      .should('have.attr', 'value', '2020-01-01T00:00:00')
      .and('have.attr', 'placeholder', 'YYYY-MM-DDTHH:MM:SS')
      .and('have.attr', 'name', 'Test Field')
      .and('not.have.attr', 'readOnly', 'required')

    cy.get('label')
      .should('have.text', 'Test Field')
      .and('have.attr', 'for', 'testfield')

    cy.get('.help-text').should('have.text', 'Helpful text')
  })
})
