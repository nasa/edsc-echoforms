import React from 'react'
import PropTypes from 'prop-types'

import { InputField } from '../InputField/InputField'

export const DateTime = ({
  children,
  id,
  label,
  modelRef,
  readOnly,
  required,
  value
}) => {
  const checkDateTime = (value) => {
    // Don't show an error if there is no value
    if (!value) return true

    if (!value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/)) {
      return false
    }

    const [date, time] = Array.from(value.split('T'))
    const [year, month, day] = date.split('-').map(x => parseInt(x, 10))
    const [hour, minute, second] = time.split(':').map(x => parseInt(x, 10))

    return (
      year
      && (month >= 1 && month <= 12)
      && (day >= 1 && day <= 31)
      && (hour < 24)
      && (minute < 60)
      && (second < 60)
    )
  }

  let error
  if (!checkDateTime(value)) error = 'Value must be a date/time with format YYYY-MM-DDTHH:MM:SS'

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
