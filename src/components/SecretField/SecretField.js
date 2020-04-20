import React from 'react'
import PropTypes from 'prop-types'
import { InputField } from '../InputField/InputField'

export const SecretField = ({
  id,
  label,
  modelRef,
  readOnly,
  required,
  value
}) => (
  <InputField
    id={id}
    label={label}
    modelRef={modelRef}
    readOnly={readOnly}
    required={required}
    type="password"
    value={value}
  />
)

SecretField.defaultProps = {
  id: '',
  value: ''
}

SecretField.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string.isRequired,
  modelRef: PropTypes.string.isRequired,
  readOnly: PropTypes.bool.isRequired,
  required: PropTypes.bool.isRequired,
  value: PropTypes.string
}
