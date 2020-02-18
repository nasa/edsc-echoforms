import React from 'react'
import PropTypes from 'prop-types'
import { InputField } from '../InputField/InputField'

export const SecretField = ({
  addBootstrapClasses,
  id,
  label,
  modelRef,
  readOnly,
  required,
  value,
  onUpdateModel
}) => (
  <InputField
    addBootstrapClasses={addBootstrapClasses}
    id={id}
    label={label}
    modelRef={modelRef}
    readOnly={readOnly}
    required={required}
    type="password"
    value={value}
    onUpdateModel={onUpdateModel}
  />
)

SecretField.defaultProps = {
  addBootstrapClasses: false,
  id: '',
  value: ''
}

SecretField.propTypes = {
  addBootstrapClasses: PropTypes.bool,
  id: PropTypes.string,
  label: PropTypes.string.isRequired,
  modelRef: PropTypes.string.isRequired,
  readOnly: PropTypes.bool.isRequired,
  required: PropTypes.bool.isRequired,
  value: PropTypes.string,
  onUpdateModel: PropTypes.func.isRequired
}
