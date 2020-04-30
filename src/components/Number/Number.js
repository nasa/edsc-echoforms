import React from 'react'
import PropTypes from 'prop-types'

import { InputField } from '../InputField/InputField'

export const Number = ({
  children,
  elementHash,
  id,
  label,
  modelRef,
  readOnly,
  required,
  type,
  value
}) => (
  <InputField
    elementHash={elementHash}
    id={id}
    label={label}
    modelRef={modelRef}
    readOnly={readOnly}
    required={required}
    type={type}
    value={value}
  >
    {children}
  </InputField>
)

Number.defaultProps = {
  children: null,
  id: '',
  value: ''
}

Number.propTypes = {
  children: PropTypes.shape({}),
  elementHash: PropTypes.number.isRequired,
  id: PropTypes.string,
  label: PropTypes.string.isRequired,
  modelRef: PropTypes.string.isRequired,
  readOnly: PropTypes.bool.isRequired,
  required: PropTypes.bool.isRequired,
  type: PropTypes.string.isRequired,
  value: PropTypes.string
}
