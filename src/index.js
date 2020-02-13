import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Form } from 'react-bootstrap'

import { FormElement } from './components/FormElement/FormElement'
import { parseXml } from './util/parseXml'
import { buildXPathResolverFn } from './util/buildXPathResolverFn'

import 'bootstrap/dist/css/bootstrap.min.css'

export const EDSCEchoform = ({ form, onFormModelUpdated }) => {
  const [model, setModel] = useState('')
  const [ui, setUi] = useState('')

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
    const newModel = model

    const result = document.evaluate(`//${modelRef}`, newModel, document.createNSResolver(newModel), XPathResult.ANY_TYPE, null)
    const value = result.iterateNext()
    value.textContent = newValue

    onFormModelUpdated(newModel.outerHTML)
    setModel(newModel)
  }

  return (
    <Form>
      <ul>
        {
          ui.childElementCount > 0 && Array.from(ui.children).map((element, i) => (
            <FormElement
              // eslint-disable-next-line react/no-array-index-key
              key={`fix-this-later-${i}`}
              element={element}
              model={model}
              onUpdateModel={onUpdateModel}
            />
          ))
        }
      </ul>
    </Form>
  )
}

EDSCEchoform.propTypes = {
  form: PropTypes.string.isRequired,
  onFormModelUpdated: PropTypes.func.isRequired
}

export default EDSCEchoform
