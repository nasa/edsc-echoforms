import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

import { EchoFormsContext } from './context/EchoFormsContext'
import { parseXml } from './util/parseXml'
import { buildXPathResolverFn } from './util/buildXPathResolverFn'
import { FormBody } from './components/FormBody/FormBody'
import { updateModel } from './util/updateModel'
import { pruneModel } from './util/pruneModel'

export const EDSCEchoform = ({
  addBootstrapClasses,
  className,
  form,
  hasShapefile,
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
  const handlePrepopulateExtension = (extension, model, resolver) => {
    if (!prepopulateValues || !extension) return model

    let updatedModel = model
    Array.from(extension.children)
      .filter(element => element.tagName === 'pre:expression')
      .forEach((expression) => {
        const ref = expression.getAttribute('ref')
        const source = expression.getAttribute('source')
        if (prepopulateValues[source]) {
          updatedModel = updateModel(updatedModel, resolver, ref, prepopulateValues[source])
        }
      })
    return updatedModel
  }

  // Build the model and ui state objects to pass to FormBody
  useEffect(() => {
    const doc = parseXml(form.replace(/>\s+</g, '><').replace(/^\s+|\s+$/g, ''))

    resolver.current = buildXPathResolverFn(doc)

    const modelResult = doc.evaluate('//*[local-name()="instance"]/*', doc, resolver.current, XPathResult.ANY_TYPE, null)
    const initialModel = modelResult.iterateNext()

    const extensionResult = doc.evaluate('//*[local-name()="extension" and @name="pre:prepopulate"]/*', doc, resolver.current, XPathResult.ANY_TYPE, null)
    const extension = extensionResult.iterateNext()
    const extendedModel = handlePrepopulateExtension(extension, initialModel.cloneNode(true), resolver.current)

    const uiResult = doc.evaluate('//*[local-name()="ui"]', doc, resolver.current, XPathResult.ANY_TYPE, null)
    const ui = uiResult.iterateNext()

    // Reset values for a newly created form
    setUpdatedAt(Date.now())
    setFormIsValid({})
    simplifiedTree.current = undefined

    // Set model and ui state
    setModel(extendedModel)
    setUi(ui)
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
  }, [formIsValid, relevantFields])

  // When the model changes, call onFormModelUpdated to update the parent app
  useEffect(() => {
    if (model.outerHTML) {
      // If there is a tree that needs simplified output, take the simplified tree output and add to the model that is give to the onFormModelUpdated callback. This leaves the verbose tree output in the internal model
      let updatedModelWithSimplifiedTree = model.cloneNode(true)
      if (simplifiedTree.current !== undefined) {
        const {
          modelRef: treeRef,
          value,
          valueElementName
        } = simplifiedTree.current

        updatedModelWithSimplifiedTree = updateModel(
          updatedModelWithSimplifiedTree,
          resolver.current,
          treeRef,
          {
            value,
            valueElementName
          }
        )
      }

      onFormModelUpdated({
        model: pruneModel(updatedModelWithSimplifiedTree.cloneNode(true)).outerHTML,
        rawModel: updatedModelWithSimplifiedTree.outerHTML
      })
    }
  }, [model.outerHTML])

  const setSimplifiedTree = (data) => {
    simplifiedTree.current = data
  }

  const onUpdateModel = (modelRef, newValue) => {
    const updatedModel = updateModel(model.cloneNode(true), resolver.current, modelRef, newValue)

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
        hasShapefile,
        model,
        onUpdateModel,
        resolver: resolver.current,
        setFormIsValid,
        setRelevantFields,
        setSimplifiedTree
      }}
    >
      <FormBody
        className={className}
        key={updateAt}
        ui={ui}
        model={model}
      />
    </EchoFormsContext.Provider>
  )
}

EDSCEchoform.defaultProps = {
  addBootstrapClasses: false,
  className: null,
  hasShapefile: false,
  prepopulateValues: null
}

EDSCEchoform.propTypes = {
  addBootstrapClasses: PropTypes.bool,
  className: PropTypes.string,
  form: PropTypes.string.isRequired,
  hasShapefile: PropTypes.bool,
  prepopulateValues: PropTypes.shape({}),
  onFormModelUpdated: PropTypes.func.isRequired,
  onFormIsValidUpdated: PropTypes.func.isRequired
}

export default EDSCEchoform
