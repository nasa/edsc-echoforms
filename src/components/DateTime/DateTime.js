import React from 'react'
import PropTypes from 'prop-types'

import { InputField } from '../InputField/InputField'

export const DateTime = ({
  children,
  elementHash,
  id,
  label,
  model,
  modelRef,
  parentRef,
  readOnly,
  required,
  value
}) => (
  <InputField
    elementHash={elementHash}
    id={id}
    label={label}
    model={model}
    modelRef={modelRef}
    parentRef={parentRef}
    placeholder="YYYY-MM-DDTHH:MM:SS"
    readOnly={readOnly}
    required={required}
    type="datetime"
    value={value}
  >
    {children}
  </InputField>
)

DateTime.defaultProps = {
  children: null,
  id: '',
  parentRef: null,
  value: ''
}

DateTime.propTypes = {
  children: PropTypes.shape({}),
  elementHash: PropTypes.number.isRequired,
  id: PropTypes.string,
  label: PropTypes.string.isRequired,
  model: PropTypes.shape({}).isRequired,
  modelRef: PropTypes.string.isRequired,
  parentRef: PropTypes.string,
  readOnly: PropTypes.bool.isRequired,
  required: PropTypes.bool.isRequired,
  value: PropTypes.string
}
