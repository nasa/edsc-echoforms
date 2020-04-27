import React from 'react'
import PropTypes from 'prop-types'

import { InputField } from '../InputField/InputField'
import { validateDateTime } from '../../util/validations/validateDateTime'

export const DateTime = ({
  children,
  id,
  label,
  modelRef,
  readOnly,
  required,
  value
}) => {
  let error
  if (!validateDateTime(value)) error = 'Value must be a date/time with format YYYY-MM-DDTHH:MM:SS'

  return (
    <InputField
      error={error}
      id={id}
      label={label}
      modelRef={modelRef}
      placeholder="YYYY-MM-DDTHH:MM:SS"
      readOnly={readOnly}
      required={required}
      value={value}
    >
      {children}
    </InputField>
  )
}

DateTime.defaultProps = {
  children: null,
  id: '',
  value: ''
}

DateTime.propTypes = {
  children: PropTypes.shape({}),
  id: PropTypes.string,
  label: PropTypes.string.isRequired,
  modelRef: PropTypes.string.isRequired,
  readOnly: PropTypes.bool.isRequired,
  required: PropTypes.bool.isRequired,
  value: PropTypes.string
}
