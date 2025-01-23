import React from 'react'
import PropTypes from 'prop-types'

import { InputField } from '../InputField/InputField'

export const Number = ({
  children,
  elementHash,
  id,
  label,
  model,
  modelRef,
  parentRef,
  readOnly,
  required,
  type,
  value
}) => (
  <InputField
    elementHash={elementHash}
    id={id}
    label={label}
    model={model}
    modelRef={modelRef}
    parentRef={parentRef}
    readOnly={readOnly}
    required={required}
    type={type}
    value={value}
  >
    {children}
  </InputField>
)

Number.defaultProps = {
  children: null,
  id: '',
  parentRef: null,
  value: ''
}

Number.propTypes = {
  children: PropTypes.shape({}),
  elementHash: PropTypes.number.isRequired,
  id: PropTypes.string,
  label: PropTypes.string.isRequired,
  model: PropTypes.shape({}).isRequired,
  modelRef: PropTypes.string.isRequired,
  parentRef: PropTypes.string,
  readOnly: PropTypes.bool.isRequired,
  required: PropTypes.bool.isRequired,
  type: PropTypes.string.isRequired,
  value: PropTypes.string
}
