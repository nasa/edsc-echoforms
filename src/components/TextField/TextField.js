import React from 'react'
import PropTypes from 'prop-types'
import { InputField } from '../InputField/InputField'

export const TextField = ({
  children,
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
    value={value}
  >
    {children}
  </InputField>
)

TextField.defaultProps = {
  children: null,
  id: '',
  value: ''
}

TextField.propTypes = {
  children: PropTypes.shape({}),
  id: PropTypes.string,
  label: PropTypes.string.isRequired,
  modelRef: PropTypes.string.isRequired,
  readOnly: PropTypes.bool.isRequired,
  required: PropTypes.bool.isRequired,
  value: PropTypes.string
}
