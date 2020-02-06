import React from 'react'
import { render } from 'react-dom'

import EDSCEchoforms from '../../src/index'

const App = () => (
  <EDSCEchoforms text="testing react echoforms" />
)

render(<App />, document.getElementById('root'))
