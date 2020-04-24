import React from 'react'
import PropTypes from 'prop-types'
import { ElementWrapper } from '../ElementWrapper/ElementWrapper'
import { Help } from '../Help/Help'

export const Output = ({
  children,
  id,
  label,
  type,
  value
}) => (
  <ElementWrapper
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
    <Help elements={children} />
  </ElementWrapper>
)

Output.defaultProps = {
  children: null,
  id: '',
  type: '',
  value: ''
}

Output.propTypes = {
  children: PropTypes.shape({}),
  id: PropTypes.string,
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  value: PropTypes.string
}
