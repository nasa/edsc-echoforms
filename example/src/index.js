import React, { useState } from 'react'
import { render } from 'react-dom'
import format from 'xml-formatter'

import { EDSCEchoform } from '../../src/index'

import form1 from './form1.xml'
import form2 from './form2.xml'
import form3 from './form3.xml'

import 'bootstrap/dist/css/bootstrap.min.css'
import './styles.css'

const App = () => {
  const [form, setForm] = useState(form1)
  const [tempForm, setTempForm] = useState(form)
  const [serializedModel, setSerializedModel] = useState('')
  const [serializedRawModel, setSerializedRawModel] = useState('')
  const [selectedModel, setSelectedModel] = useState('rawModel')
  const [formIsValid, setFormIsValid] = useState(true)

  const onTextAreaChange = (e) => {
    setTempForm(e.target.value)
  }

  const onTextAreaBlur = () => {
    setForm(tempForm)
  }

  const onFormModelUpdated = (value) => {
    const { model, rawModel } = value
    setSerializedModel(model)
    setSerializedRawModel(rawModel)
  }

  const onFormIsValidUpdated = (isValid) => {
    setFormIsValid(isValid)
  }

  const onSelectForm = (e) => {
    const { value } = e.target
    setForm(value)
    setTempForm(value)
  }

  const onSelectModelFormat = (e) => {
    const { value } = e.target
    setSelectedModel(value)
  }

  let modelPreview = serializedRawModel
  if (selectedModel === 'model') modelPreview = serializedModel

  return (
    <>
      <h1>
        ECHO Forms React Plugin Demo
      </h1>
      <h2>ECHO Forms XML</h2>
      <p>Enter ECHO Forms XML in the box below to see it rendered</p>
      <form>
        <div className="form-check form-check-inline">
          <input className="form-check-input" type="radio" name="form-select" id="form-select1" value={form1} onChange={onSelectForm} defaultChecked />
          <label className="form-check-label" htmlFor="form-select1">
            Form1
          </label>
        </div>
        <div className="form-check form-check-inline">
          <input className="form-check-input" type="radio" name="form-select" id="form-select2" value={form2} onChange={onSelectForm} />
          <label className="form-check-label" htmlFor="form-select2">
            Form2
          </label>
        </div>
        <div className="form-check form-check-inline">
          <input className="form-check-input" type="radio" name="form-select" id="form-select3" value={form3} onChange={onSelectForm} />
          <label className="form-check-label" htmlFor="form-select3">
            Form3
          </label>
        </div>
      </form>
      <textarea
        id="demo-echoforms-xml"
        value={tempForm}
        onBlur={onTextAreaBlur}
        onChange={onTextAreaChange}
      />
      <h2>Generated Interface</h2>
      <EDSCEchoform
        addBootstrapClasses
        form={form}
        hasShapefile
        prepopulateValues={{
          PREPOP: 'I am prepopulated'
        }}
        onFormModelUpdated={onFormModelUpdated}
        onFormIsValidUpdated={onFormIsValidUpdated}
      />
      <h2>Serialized Model</h2>
      <p>
        Form Valid:
        {' '}
        <strong>
          {formIsValid.toString()}
        </strong>
      </p>
      <form>
        <div className="form-check form-check-inline">
          <input className="form-check-input" type="radio" name="model-select" id="model-select1" value="rawModel" onChange={onSelectModelFormat} defaultChecked />
          <label className="form-check-label" htmlFor="model-select1">
            Raw Model (all fields)
          </label>
        </div>
        <div className="form-check form-check-inline">
          <input className="form-check-input" type="radio" name="model-select" id="model-select2" value="model" onChange={onSelectModelFormat} />
          <label className="form-check-label" htmlFor="model-select2">
            Model (Pruned of irrelevant fields)
          </label>
        </div>
      </form>
      <pre id="demo-echoforms-model">
        {
          modelPreview.length && (
            format(modelPreview, {
              indentation: '  '
            })
          )
        }
      </pre>
    </>
  )
}

render(<App />, document.getElementById('root'))
