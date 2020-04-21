import React, { useState } from 'react'
import { render } from 'react-dom'
import format from 'xml-formatter'

import { EDSCEchoform } from '../../src/index'

import form1 from './form1.xml'

import 'bootstrap/dist/css/bootstrap.min.css'
import './styles.css'

const App = () => {
  const [form, setForm] = useState(form1)
  const [serializedModel, setSerializedModel] = useState('')

  const onTextAreaChange = (e) => {
    setForm(e.target.value)
  }

  const onFormModelUpdated = (value) => {
    setSerializedModel(value)
  }

  return (
    <>
      <h1>
        ECHO Forms React Plugin Demo
      </h1>
      <h2>ECHO Forms XML</h2>
      <p>Enter ECHO Forms XML in the box below to see it rendered</p>
      <textarea
        id="demo-echoforms-xml"
        value={form}
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
        {
          serializedModel.length && (
            format(serializedModel, {
              indentation: '  '
            })
          )
        }
      </pre>
    </>
  )
}

render(<App />, document.getElementById('root'))
