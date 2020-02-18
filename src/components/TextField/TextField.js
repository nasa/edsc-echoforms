import React from 'react'
import PropTypes from 'prop-types'
import { InputField } from '../InputField/InputField'

export const TextField = ({
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
    value={value}
    onUpdateModel={onUpdateModel}
  />
)

TextField.defaultProps = {
  addBootstrapClasses: false,
  id: '',
  value: ''
}

TextField.propTypes = {
  addBootstrapClasses: PropTypes.bool,
  id: PropTypes.string,
  label: PropTypes.string.isRequired,
  modelRef: PropTypes.string.isRequired,
  readOnly: PropTypes.bool.isRequired,
  required: PropTypes.bool.isRequired,
  value: PropTypes.string,
  onUpdateModel: PropTypes.func.isRequired
}
