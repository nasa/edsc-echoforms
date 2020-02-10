import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { DOMParser } from 'xmldom'
import xpath from 'xpath'
import { FormElement } from './components/FormElement/FormElement'

export const EDSCEchoform = ({ form, onFormModelUpdated }) => {
  const [model, setModel] = useState('')
  const [ui, setUi] = useState('')

  useEffect(() => {
    const doc = new DOMParser().parseFromString(form.replace(/>\s+</g, '><').replace(/^\s+|\s+$/g, ''))
    const initialModel = xpath.select('//*[local-name()="instance"]/*', doc)[0]

    setModel(initialModel)
    setUi(xpath.select('//*[local-name()="ui"]', doc))

    onFormModelUpdated(initialModel.toString())
  }, [form])

  const onUpdateModel = (modelRef, value) => {
    const newModel = model
    newModel.getElementsByTagName(modelRef)[0].childNodes[0].data = value.toString()

    onFormModelUpdated(newModel.toString())
    setModel(newModel)
  }

  return (
    <form>
      <ul>
        {
          ui.length > 0 && Array.from(ui[0].childNodes).map((element, i) => (
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
    </form>
  )
}

EDSCEchoform.propTypes = {
  form: PropTypes.string.isRequired,
  onFormModelUpdated: PropTypes.func.isRequired
}

export default EDSCEchoform
