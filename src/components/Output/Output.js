import React from 'react'
import PropTypes from 'prop-types'
import { ElementWrapper } from '../ElementWrapper/ElementWrapper'

export const Output = ({
  addBootstrapClasses,
  id,
  label,
  type,
  value
}) => (
  <ElementWrapper
    addBootstrapClasses={addBootstrapClasses}
    htmlFor={id}
    label={label}
  >
    {
      type && type.includes('anyURI') && (
        <a id={id} href={value}>{value}</a>
      )
    }
    {
      (!type || !type.includes('anyURI')) && (
        <p id={id}>{value}</p>
      )
    }
  </ElementWrapper>
)

Output.defaultProps = {
  addBootstrapClasses: false,
  id: '',
  type: '',
  value: ''
}

Output.propTypes = {
  addBootstrapClasses: PropTypes.bool,
  id: PropTypes.string,
  label: PropTypes.string.isRequired,
  required: PropTypes.bool.isRequired,
  type: PropTypes.string,
  value: PropTypes.string
}
