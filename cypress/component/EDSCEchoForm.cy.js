/* eslint-disable react/react-in-jsx-scope, react/jsx-no-constructed-context-values */
import React, { useState } from 'react'

import {
  prepopulatedXml,
  textfieldXml,
  treeWithSimplifyOutputXml,
  notRelevantXml
} from '../mocks/FormElement'
import EDSCEchoform from '../../src'

const WrapperComponent = (initialProps) => {
  const [props, setProps] = useState(initialProps)

  const handleResetForm = () => {
    setProps({
      ...props,
      defaultRawModel: null
    })
  }
  const handleChangePrepopulatedValues = () => {
    setProps({
      ...props,
      prepopulateValues: {
        PREPOP: 'New prepopulated value'
      }
    })
  }

  return (
    <>
      <button
        type="button"
        title="Reset Form"
        id="resetform"
        onClick={() => {
          handleResetForm()
        }}
      >
        Reset Form
      </button>
      <button
        type="button"
        title="Change Pre-populated Values"
        id="changeprepopulatedvalues"
        onClick={() => {
          handleChangePrepopulatedValues()
        }}
      >
        Change Pre-populated Values
      </button>
      <EDSCEchoform {...props} />
    </>
  )
}

const setup = (file, overrideProps) => {
  const onFormModelUpdatedSpy = cy.spy().as('onFormModelUpdatedSpy')
  const onFormIsValidUpdatedSpy = cy.spy().as('onFormIsValidUpdatedSpy')

  const props = {
    form: file,
    onFormModelUpdated: onFormModelUpdatedSpy,
    onFormIsValidUpdated: onFormIsValidUpdatedSpy,
    ...overrideProps
  }

  cy.mount(<WrapperComponent {...props} />)

  // // These functions get called a couple times during initial setup of the component. Reset their history
  // // to make the tests make more sense
  // cy.get('@onFormModelUpdatedSpy').invoke('resetHistory')
}

describe('EDSCEchoform component', () => {
  it('renders a form with custom classes', () => {
    setup(textfieldXml, {
      className: 'test-class'
    })

    cy.get('.form').should('have.class', 'test-class')
  })

  it('renders a form with bootstrap classes', () => {
    setup(textfieldXml, {
      addBootstrapClasses: true
    })

    cy.get('.form').should('have.class', 'card')
  })

  it('populates the form with defaultRawModel', () => {
    setup(textfieldXml, {
      defaultRawModel: '<prov:options xmlns:prov="http://www.example.com/orderoptions"><prov:textreference>defaultRawModel value</prov:textreference></prov:options>'
    })

    cy.get('#textinput').should('have.value', 'defaultRawModel value')

    cy.get('@onFormModelUpdatedSpy').should('have.been.calledOnceWith', {
      hasChanged: true,
      model: '<prov:options xmlns:prov="http://www.example.com/orderoptions"><prov:textreference>defaultRawModel value</prov:textreference></prov:options>',
      rawModel: '<prov:options xmlns:prov="http://www.example.com/orderoptions"><prov:textreference>defaultRawModel value</prov:textreference></prov:options>'
    })
  })

  it('populates prepopulated values into the form', () => {
    setup(prepopulatedXml, {
      prepopulateValues: {
        PREPOP: 'I am prepopulated'
      }
    })

    cy.get('#textinput').should('have.value', 'I am prepopulated')

    cy.get('@onFormModelUpdatedSpy').should('have.been.calledOnceWith', {
      hasChanged: false,
      model: '<prov:options xmlns:prov="http://www.example.com/orderoptions"><prov:textreference>I am prepopulated</prov:textreference></prov:options>',
      rawModel: '<prov:options xmlns:prov="http://www.example.com/orderoptions"><prov:textreference>I am prepopulated</prov:textreference></prov:options>'
    })
  })

  it('with simplifyOutput on a tree onUpdateModel updates the model and calls onFormModelUpdated', () => {
    setup(treeWithSimplifyOutputXml)

    cy.get('@onFormModelUpdatedSpy').its('lastCall.args').should('deep.equal', [{
      hasChanged: false,
      model: '<prov:options xmlns:prov="http://www.example.com/orderoptions"><prov:treeReference><prov:data_layer>/Parent1</prov:data_layer></prov:treeReference></prov:options>',
      rawModel: '<prov:options xmlns:prov="http://www.example.com/orderoptions"><prov:treeReference><prov:data_layer>/Parent1</prov:data_layer></prov:treeReference></prov:options>'
    }])
  })

  it('removes irrelevant fields in the model', () => {
    setup(notRelevantXml)

    cy.get('@onFormModelUpdatedSpy').should('have.been.calledOnceWith', {
      hasChanged: false,
      model: '<prov:options xmlns:prov="http://www.example.com/orderoptions"><prov:boolreference>false</prov:boolreference></prov:options>',
      rawModel: '<prov:options xmlns:prov="http://www.example.com/orderoptions"><prov:boolreference>false</prov:boolreference><prov:textreference irrelevant="true">test value</prov:textreference></prov:options>'
    })
  })

  it('resets the model to the original form model by passing defaultRawModel as null', () => {
    setup(textfieldXml, {
      defaultRawModel: '<prov:options xmlns:prov="http://www.example.com/orderoptions"><prov:textreference>defaultRawModel value</prov:textreference></prov:options>'
    })

    cy.get('#textinput').should('have.value', 'defaultRawModel value')

    cy.get('@onFormModelUpdatedSpy').invoke('resetHistory')
    cy.get('#resetform').click()

    cy.get('#textinput').should('have.value', 'test value')

    cy.get('@onFormModelUpdatedSpy').should('have.been.calledWith', {
      hasChanged: false,
      model: '<prov:options xmlns:prov="http://www.example.com/orderoptions"><prov:textreference>test value</prov:textreference></prov:options>',
      rawModel: '<prov:options xmlns:prov="http://www.example.com/orderoptions"><prov:textreference>test value</prov:textreference></prov:options>'
    })
  })

  it('updates the form when the prepopulated values change', () => {
    setup(prepopulatedXml, {
      prepopulateValues: {
        PREPOP: 'I am prepopulated'
      }
    })

    cy.get('#textinput').should('have.value', 'I am prepopulated')

    cy.get('@onFormModelUpdatedSpy').invoke('resetHistory')
    cy.get('#changeprepopulatedvalues').click()

    cy.get('#textinput').should('have.value', 'New prepopulated value')

    cy.get('@onFormModelUpdatedSpy').should('have.been.calledWith', {
      hasChanged: true,
      model: '<prov:options xmlns:prov="http://www.example.com/orderoptions"><prov:textreference>New prepopulated value</prov:textreference></prov:options>',
      rawModel: '<prov:options xmlns:prov="http://www.example.com/orderoptions"><prov:textreference>New prepopulated value</prov:textreference></prov:options>'
    })
  })
})
