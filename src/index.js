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

  // The Tree component needs to keep a verbose record of the nodes to ensure speed and accuracy, so we save a simplified output here if the tree form element has simplifyOutput set
  const simplifiedTree = useRef(undefined)

  // Updating this value will force a rerender of the component because it is used as a key prop in FormBody
  const [updateAt, setUpdatedAt] = useState(Date.now())

  const resolver = useRef(undefined)

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

    resolver.current = buildXPathResolverFn(doc)

    const modelResult = doc.evaluate('//*[local-name()="instance"]/*', doc, resolver.current, XPathResult.ANY_TYPE, null)
    const initialModel = modelResult.iterateNext()

    const extensionResult = doc.evaluate('//*[local-name()="extension" and @name="pre:prepopulate"]/*', doc, resolver.current, XPathResult.ANY_TYPE, null)
    const extension = extensionResult.iterateNext()
    const extendedModel = handlePrepopulateExtension(extension, initialModel)

    const uiResult = doc.evaluate('//*[local-name()="ui"]', doc, resolver.current, XPathResult.ANY_TYPE, null)
    const ui = uiResult.iterateNext()

    setUpdatedAt(Date.now())
    setFormIsValid({})
    setModel(extendedModel)
    setUi(ui)
    simplifiedTree.current = undefined

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

  const setSimplifiedTree = (data) => {
    simplifiedTree.current = data
  }

  const onUpdateModel = (modelRef, newValue) => {
    const updatedModel = updateModel(model.cloneNode(true), modelRef, newValue)

    setModel(updatedModel)

    // If the tree needs simplified output, take the simplified tree output and add to the model that is give to the onFormModelUpdated callback. This leaves the verbose tree output in the internal model
    let updatedModelWithSimplifiedTree = updatedModel.cloneNode(true)
    if (simplifiedTree.current !== undefined) {
      const {
        modelRef: treeRef,
        value,
        valueElementName
      } = simplifiedTree.current
      updatedModelWithSimplifiedTree = updateModel(updatedModelWithSimplifiedTree, treeRef, { value, valueElementName })
    }

    onFormModelUpdated(updatedModelWithSimplifiedTree.outerHTML)
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
        resolver: resolver.current,
        setSimplifiedTree,
        onUpdateModel,
        setFormIsValid,
        setRelevantFields
      }}
    >
      <form>
        <FormBody
          key={updateAt}
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
