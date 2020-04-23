import React, { useState } from 'react'
import { render } from 'react-dom'

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

  const onTextAreaChange = (e) => {
    setTempForm(e.target.value)
  }

  const onTextAreaBlur = () => {
    setForm(tempForm)
  }

  const onFormModelUpdated = (value) => {
    setSerializedModel(value)
  }

  const onSelectForm = (e) => {
    const { value } = e.target
    setForm(value)
    setTempForm(value)
  }

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
        onFormModelUpdated={onFormModelUpdated}
      />
      <h2>Serialized Model</h2>
      <pre id="demo-echoforms-model">
        {serializedModel}
      </pre>
    </>
  )
}

render(<App />, document.getElementById('root'))
