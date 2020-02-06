import React from 'react'
import PropTypes from 'prop-types'

const EDSCEchoforms = ({ text }) => (
  <h1>
    Hello from EDSCEchoforms,
    {' '}
    {text}
  </h1>
)

EDSCEchoforms.defaultProps = {
  text: ''
}

EDSCEchoforms.propTypes = {
  text: PropTypes.string
}

export default EDSCEchoforms
