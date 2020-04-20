import React from 'react'
import PropTypes from 'prop-types'
import { InputField } from '../InputField/InputField'

export const DateTime = ({
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
    placeholder="YYYY-MM-DDTHH:MM:SS"
    readOnly={readOnly}
    required={required}
    value={value}
  />
)

DateTime.defaultProps = {
  id: '',
  value: ''
}

DateTime.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string.isRequired,
  modelRef: PropTypes.string.isRequired,
  readOnly: PropTypes.bool.isRequired,
  required: PropTypes.bool.isRequired,
  value: PropTypes.string
}
