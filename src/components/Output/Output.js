import React from 'react'
import PropTypes from 'prop-types'
import { ElementWrapper } from '../ElementWrapper/ElementWrapper'

export const Output = ({
  children,
  elementHash,
  id,
  label,
  type,
  value
}) => (
  <ElementWrapper
    elementHash={elementHash}
    formElements={children}
    htmlFor={id}
    label={label}
  >
    {
      () => (
        <>
          {
            type === 'anyuri' && (
              <a id={id} href={value}>{value}</a>
            )
          }
          {
            (!type || !type === 'anyuri') && (
              <p id={id}>{value}</p>
            )
          }
        </>
      )
    }
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
  elementHash: PropTypes.number.isRequired,
  id: PropTypes.string,
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  value: PropTypes.string
}
