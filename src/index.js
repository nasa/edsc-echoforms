import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

import { EchoFormsContext } from './context/EchoFormsContext'
import { parseXml } from './util/parseXml'
import { buildXPathResolverFn } from './util/buildXPathResolverFn'
import { FormBody } from './components/FormBody/FormBody'
import { updateModel } from './util/updateModel'

export const EDSCEchoform = ({
  addBootstrapClasses,
  form,
  prepopulateValues,
  onFormModelUpdated,
  onFormIsValidUpdated
}) => {
  const [model, setModel] = useState({})
  const [ui, setUi] = useState({})
  // formIsValid holds a hash of each field, and tells us if that field is valid
  const [formIsValid, setFormIsValid] = useState({})

  // relevantFields holds a hash of each field, and tells us if that field is relevant
  const relevantFields = useRef({})

  // Take any prepopulate extensions and update the model
  const handlePrepopulateExtension = (extension, model) => {
    if (!prepopulateValues || !extension) return model

    let updatedModel = model
    Array.from(extension.children)
      .filter(element => element.tagName === 'pre:expression')
      .forEach((expression) => {
        const ref = expression.getAttribute('ref')
        const source = expression.getAttribute('source')
        if (prepopulateValues[source]) {
          updatedModel = updateModel(updatedModel, ref, prepopulateValues[source])
        }
      })
    return updatedModel
  }

  useEffect(() => {
    const doc = parseXml(form.replace(/>\s+</g, '><').replace(/^\s+|\s+$/g, ''))
    const modelResult = doc.evaluate('//*[local-name()="instance"]/*', doc, buildXPathResolverFn(doc), XPathResult.ANY_TYPE, null)
    const initialModel = modelResult.iterateNext()

    const extensionResult = doc.evaluate('//*[local-name()="extension" and @name="pre:prepopulate"]/*', doc, buildXPathResolverFn(doc), XPathResult.ANY_TYPE, null)
    const extension = extensionResult.iterateNext()
    const extendedModel = handlePrepopulateExtension(extension, initialModel)

    const uiResult = doc.evaluate('//*[local-name()="ui"]', doc, buildXPathResolverFn(doc), XPathResult.ANY_TYPE, null)
    const ui = uiResult.iterateNext()

    setFormIsValid({})
    setModel(extendedModel)
    setUi(ui)

    onFormModelUpdated(extendedModel.outerHTML)
  }, [form])

  useEffect(() => {
    // This effect compares each field for relevancy and validity.
    // valid is true if all of the relevantFields also have valid values.
    const relevantInvalidFields = Object.keys(formIsValid)
      .filter((key) => {
        const fieldValid = formIsValid[key]
        const fieldRelevant = relevantFields.current[key]

        // Return only relevant invalid fields
        return fieldRelevant && !fieldValid
      })

    // if there are no relevantInvalidFields, the form is valid
    onFormIsValidUpdated(!relevantInvalidFields.length)
  }, [formIsValid, relevantFields, onFormIsValidUpdated])

  const onUpdateModel = (modelRef, newValue) => {
    const updatedModel = updateModel(model, modelRef, newValue)

    onFormModelUpdated(updatedModel.outerHTML)
    setModel(updatedModel)
  }

  const setRelevantFields = (newField) => {
    relevantFields.current = {
      ...relevantFields.current,
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
  addBootstrapClasses: false,
  prepopulateValues: null
}

EDSCEchoform.propTypes = {
  addBootstrapClasses: PropTypes.bool,
  form: PropTypes.string.isRequired,
  prepopulateValues: PropTypes.shape({}),
  onFormModelUpdated: PropTypes.func.isRequired,
  onFormIsValidUpdated: PropTypes.func.isRequired
}

export default EDSCEchoform
