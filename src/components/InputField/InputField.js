import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { ElementWrapper } from '../ElementWrapper/ElementWrapper'
import { useClasses } from '../../hooks/useClasses'
import { EchoFormsContext } from '../../context/EchoFormsContext'
import { Help } from '../Help/Help'

export const InputField = ({
  children,
  error,
  id,
  label,
  modelRef,
  placeholder,
  readOnly,
  required,
  type,
  value
}) => {
  const { onUpdateModel } = useContext(EchoFormsContext)

  const onChange = (e) => {
    onUpdateModel(modelRef, e.target.value)
  }

  let isInvalid = false
  let errorMessage = error
  if (error != null) isInvalid = true
  if (required && !value) {
    isInvalid = true
    errorMessage = 'Required field'
  }

  return (
    <ElementWrapper
      htmlFor={id}
      label={label}
    >
      <input
        className={useClasses('input', 'form-control', isInvalid)}
        id={id}
        name={label}
        placeholder={placeholder}
        readOnly={readOnly}
        type={type}
        value={value}
        onChange={onChange}
      />
      {
        isInvalid && (
          <div className="invalid-feedback">
            {errorMessage}
          </div>
        )
      }
      <Help elements={children} />
    </ElementWrapper>
  )
}

InputField.defaultProps = {
  children: null,
  error: null,
  id: '',
  placeholder: '',
  type: null,
  value: ''
}

InputField.propTypes = {
  children: PropTypes.shape({}),
  error: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.string.isRequired,
  modelRef: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  readOnly: PropTypes.bool.isRequired,
  required: PropTypes.bool.isRequired,
  type: PropTypes.string,
  value: PropTypes.string
}
