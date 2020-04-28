import React from 'react'
import PropTypes from 'prop-types'

import { InputField } from '../InputField/InputField'
import { validateDouble } from '../../util/validations/validateDouble'
import { validateInteger } from '../../util/validations/validateInteger'
import { validateLong } from '../../util/validations/validateLong'
import { validateShort } from '../../util/validations/validateShort'

export const Number = ({
  children,
  id,
  label,
  modelRef,
  readOnly,
  required,
  type,
  value
}) => {
  let error

  if (type === 'double' && !validateDouble(value)) {
    error = 'Value must be a number'
  }

  if (type === 'int' && !validateInteger(value)) {
    error = 'Value must be a integer between -2,147,483,648 and 2,147,483,647'
  }

  if (type === 'long' && !validateLong(value)) {
    error = 'Value must be a integer between -2^63 and 2^63-1'
  }

  if (type === 'short' && !validateShort(value)) {
    error = 'Value must be a integer between -32,768 and 32,767'
  }

  return (
    <InputField
      error={error}
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
}

Number.defaultProps = {
  children: null,
  id: '',
  value: ''
}

Number.propTypes = {
  children: PropTypes.shape({}),
  id: PropTypes.string,
  label: PropTypes.string.isRequired,
  modelRef: PropTypes.string.isRequired,
  readOnly: PropTypes.bool.isRequired,
  required: PropTypes.bool.isRequired,
  type: PropTypes.string.isRequired,
  value: PropTypes.string
}
