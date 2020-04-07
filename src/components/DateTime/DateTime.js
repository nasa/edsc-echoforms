import React from 'react'
import PropTypes from 'prop-types'
import { InputField } from '../InputField/InputField'

export const DateTime = ({
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
    placeholder="YYYY-MM-DDTHH:MM:SS"
    readOnly={readOnly}
    required={required}
    value={value}
    onUpdateModel={onUpdateModel}
  />
)

DateTime.defaultProps = {
  addBootstrapClasses: false,
  id: '',
  value: ''
}

DateTime.propTypes = {
  addBootstrapClasses: PropTypes.bool,
  id: PropTypes.string,
  label: PropTypes.string.isRequired,
  modelRef: PropTypes.string.isRequired,
  readOnly: PropTypes.bool.isRequired,
  required: PropTypes.bool.isRequired,
  value: PropTypes.string,
  onUpdateModel: PropTypes.func.isRequired
}
