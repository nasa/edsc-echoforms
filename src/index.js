import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

import { EchoFormsContext } from './context/EchoFormsContext'
import { parseXml } from './util/parseXml'
import { buildXPathResolverFn } from './util/buildXPathResolverFn'
import { FormBody } from './components/FormBody/FormBody'
import { updateModel } from './util/updateModel'
import { pruneModel } from './util/pruneModel'
import { buildParentXpath } from './util/buildParentXpath'

export const EDSCEchoform = ({
  addBootstrapClasses,
  className,
  defaultRawModel,
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

  // Parse the XML form and return the XML document
  const getFormDoc = () => {
    // If we have a defaultRawModel, insert that into the form before parsing
    let formWithModel = form
    if (defaultRawModel) {
      formWithModel = form.replace(/(?:<instance>)(?:.|\n)*(?:<\/instance>)/, `<instance>\n${defaultRawModel}\n</instance>`)
    }

    // Parse the form XML
    const doc = parseXml(formWithModel.replace(/>\s+</g, '><').replace(/^\s+|\s+$/g, ''))
    resolver.current = buildXPathResolverFn(doc)

    return doc
  }

  // Extend the given model with prepopulate values
  const extendModelWithPrepopulateValues = (doc, initialModel) => {
    // Pull the prepopulate extensions out of the form
    const extensionResult = doc.evaluate('//*[local-name()="extension" and @name="pre:prepopulate"]/*', doc, resolver.current, XPathResult.ANY_TYPE, null)
    const extension = extensionResult.iterateNext()
    const extendedModel = handlePrepopulateExtension(extension, initialModel, resolver.current)

    return extendedModel
  }

  // Build the model and ui state objects to pass to FormBody
  const setupForm = () => {
    const doc = getFormDoc()

    // Pull the model out of the form
    const modelResult = doc.evaluate('//*[local-name()="instance"]', doc, resolver.current, XPathResult.ANY_TYPE, null)
    const initialModel = modelResult.iterateNext()

    const extendedModel = extendModelWithPrepopulateValues(doc, initialModel.cloneNode(true))

    // Pull the UI out of the form
    const uiResult = doc.evaluate('//*[local-name()="ui"]', doc, resolver.current, XPathResult.ANY_TYPE, null)
    const ui = uiResult.iterateNext()

    // Reset values for a newly created form
    setUpdatedAt(Date.now())
    setFormIsValid({})
    simplifiedTree.current = undefined

    // Set model and ui state
    setModel(extendedModel)
    setUi(ui)
  }

  // When the form prop changes a new form has been passed in and we need to call setupForm
  useEffect(() => {
    setupForm()
  }, [form])

  // When the prepopulateValues change update the model with the new values
  useEffect(() => {
    if (model.outerHTML && prepopulateValues) {
      const doc = getFormDoc()

      const extendedModel = extendModelWithPrepopulateValues(doc, model)

      setModel(extendedModel)
    }
  }, [prepopulateValues])

  // When the defaultRawModel prop changes, we might need to reset the form.
  // If we already have an existing model and defaultRawModel is null, the reset button was pressed and we need to run setupForm
  useEffect(() => {
    if (model.outerHTML && !defaultRawModel) {
      setupForm()
    }
  }, [defaultRawModel])

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
        Object.values(simplifiedTree.current).forEach((treeValue) => {
          const {
            parentRef,
            modelRef: treeRef,
            value,
            valueElementName
          } = treeValue

          let xpath = treeRef
          if (parentRef) {
            xpath = `${parentRef}/${treeRef}`
          }

          updatedModelWithSimplifiedTree = updateModel(
            updatedModelWithSimplifiedTree,
            resolver.current,
            xpath,
            {
              value,
              valueElementName
            }
          )
        })
      }

      onFormModelUpdated({
        model: pruneModel(updatedModelWithSimplifiedTree.cloneNode(true)).innerHTML,
        rawModel: updatedModelWithSimplifiedTree.innerHTML
      })
    }
  }, [model])

  const setSimplifiedTree = (data) => {
    simplifiedTree.current = data
  }

  const onUpdateModel = (parentRef, modelRef, newValue) => {
    const xpath = buildParentXpath(parentRef, modelRef)
    const updatedModel = updateModel(model.cloneNode(true), resolver.current, xpath, newValue)

    setModel(updatedModel)
  }

  const setRelevantFields = (newField) => {
    relevantFields.current = {
      ...relevantFields.current,
      ...newField
    }
  }

  // If the model hasn't been populated yet, don't render
  if (!model.firstElementChild) return null

  return (
    <EchoFormsContext.Provider
      value={{
        addBootstrapClasses,
        hasShapefile,
        model: model.firstElementChild.innerHTML,
        onUpdateModel,
        resolver: resolver.current,
        setFormIsValid,
        setRelevantFields,
        setSimplifiedTree,
        simplifiedTree
      }}
    >
      <FormBody
        className={className}
        key={updateAt}
        ui={ui}
        model={model.firstElementChild}
      />
    </EchoFormsContext.Provider>
  )
}

EDSCEchoform.defaultProps = {
  addBootstrapClasses: false,
  className: null,
  defaultRawModel: null,
  hasShapefile: false,
  prepopulateValues: null
}

EDSCEchoform.propTypes = {
  addBootstrapClasses: PropTypes.bool,
  className: PropTypes.string,
  defaultRawModel: PropTypes.string,
  form: PropTypes.string.isRequired,
  hasShapefile: PropTypes.bool,
  prepopulateValues: PropTypes.shape({}),
  onFormModelUpdated: PropTypes.func.isRequired,
  onFormIsValidUpdated: PropTypes.func.isRequired
}

export default EDSCEchoform
