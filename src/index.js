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
  onFormModelUpdated
}) => {
  const [model, setModel] = useState({})
  const [ui, setUi] = useState({})
  const [doc, setDoc] = useState({})

  useEffect(() => {
    const doc = parseXml(form.replace(/>\s+</g, '><').replace(/^\s+|\s+$/g, ''))
    setDoc(doc)
    const modelResult = doc.evaluate('//*[local-name()="instance"]/*', doc, buildXPathResolverFn(form), XPathResult.ANY_TYPE, null)
    const initialModel = modelResult.iterateNext()

    const uiResult = doc.evaluate('//*[local-name()="ui"]', doc, buildXPathResolverFn(form), XPathResult.ANY_TYPE, null)
    const ui = uiResult.iterateNext()

    setModel(initialModel)
    setUi(ui)

    onFormModelUpdated(initialModel.outerHTML)
  }, [form])

  const onUpdateModel = (modelRef, newValue) => {
    const updatedModel = updateModel(model, modelRef, newValue, doc)

    onFormModelUpdated(updatedModel.outerHTML)
    setModel(updatedModel)
  }

  return (
    <EchoFormsContext.Provider value={{ addBootstrapClasses, doc, onUpdateModel }}>
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
  onFormModelUpdated: PropTypes.func.isRequired
}

export default EDSCEchoform
