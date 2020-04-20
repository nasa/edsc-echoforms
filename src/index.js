import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { EchoFormsContext } from './util/EchoFormsContext'
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

  useEffect(() => {
    const doc = parseXml(form.replace(/>\s+</g, '><').replace(/^\s+|\s+$/g, ''))
    const modelResult = document.evaluate('//*[local-name()="instance"]/*', doc, buildXPathResolverFn(form), XPathResult.ANY_TYPE, null)
    const initialModel = modelResult.iterateNext()

    const uiResult = document.evaluate('//*[local-name()="ui"]', doc, buildXPathResolverFn(form), XPathResult.ANY_TYPE, null)
    const ui = uiResult.iterateNext()

    setModel(initialModel)
    setUi(ui)

    onFormModelUpdated(initialModel.outerHTML)
  }, [form])

  const onUpdateModel = (modelRef, newValue) => {
    const updatedModel = updateModel(model, modelRef, newValue)

    onFormModelUpdated(updatedModel.outerHTML)
    setModel(updatedModel)
  }

  return (
    <EchoFormsContext.Provider value={{ addBootstrapClasses, onUpdateModel }}>
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
