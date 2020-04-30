import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { EchoFormsContext } from './context/EchoFormsContext'
import { parseXml } from './util/parseXml'
import { buildXPathResolverFn } from './util/buildXPathResolverFn'
import { FormBody } from './components/FormBody/FormBody'
import { updateModel } from './util/updateModel'

export const EDSCEchoform = ({
  addBootstrapClasses,
  form,
  onFormModelUpdated,
  onFormIsValidUpdated
}) => {
  const [model, setModel] = useState({})
  const [ui, setUi] = useState({})
  // formIsValid holds a hash of each field, and tells us if that field is valid
  const [formIsValid, setFormIsValid] = useState({})

  // relevantFields holds a hash of each field, and tells us if that field is relevant
  let relevantFields = {}

  useEffect(() => {
    const doc = parseXml(form.replace(/>\s+</g, '><').replace(/^\s+|\s+$/g, ''))
    const modelResult = doc.evaluate('//*[local-name()="instance"]/*', doc, buildXPathResolverFn(doc), XPathResult.ANY_TYPE, null)
    const initialModel = modelResult.iterateNext()

    const uiResult = doc.evaluate('//*[local-name()="ui"]', doc, buildXPathResolverFn(doc), XPathResult.ANY_TYPE, null)
    const ui = uiResult.iterateNext()

    setFormIsValid({})
    setModel(initialModel)
    setUi(ui)

    onFormModelUpdated(initialModel.outerHTML)
  }, [form])

  useEffect(() => {
    // This effect compares each field for relevancy and validity.
    // valid is true if all of the relevantFields also have valid values.
    const valid = Object.keys(relevantFields)
      .filter((key) => {
        const value = formIsValid[key]
        const relevant = relevantFields[key]

        // Return only relevant invalid fields
        return relevant && value === false
      }).length === 0 // if no fields are returned, the form is valid

    onFormIsValidUpdated(valid)
  }, [formIsValid, relevantFields, onFormIsValidUpdated])

  const onUpdateModel = (modelRef, newValue) => {
    const updatedModel = updateModel(model, modelRef, newValue)

    onFormModelUpdated(updatedModel.outerHTML)
    setModel(updatedModel)
  }

  const setRelevantFields = (newField) => {
    relevantFields = {
      ...relevantFields,
      ...newField
    }
  }

  return (
    <EchoFormsContext.Provider
      value={{
        addBootstrapClasses,
        model,
        onUpdateModel,
        setFormIsValid,
        setRelevantFields
      }}
    >
      <form>
        <FormBody
          ui={ui}
          model={model}
        />
      </form>
    </EchoFormsContext.Provider>
  )
}

EDSCEchoform.defaultProps = {
  addBootstrapClasses: false
}

EDSCEchoform.propTypes = {
  addBootstrapClasses: PropTypes.bool,
  form: PropTypes.string.isRequired,
  onFormModelUpdated: PropTypes.func.isRequired,
  onFormIsValidUpdated: PropTypes.func.isRequired
}

export default EDSCEchoform
