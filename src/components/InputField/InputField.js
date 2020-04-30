import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { ElementWrapper } from '../ElementWrapper/ElementWrapper'
import { useClasses } from '../../hooks/useClasses'
import { EchoFormsContext } from '../../context/EchoFormsContext'

export const InputField = ({
  children,
  elementHash,
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
  const { elementClasses } = useClasses()

  const onChange = (e) => {
    onUpdateModel(modelRef, e.target.value)
  }

  return (
    <ElementWrapper
      elementHash={elementHash}
      formElements={children}
      htmlFor={id}
      label={label}
      required={required}
      type={type}
      value={value}
    >
      {
        ({ isFieldValid }) => (
          <input
            className={elementClasses('input', 'form-control', !isFieldValid)}
            id={id}
            name={label}
            placeholder={placeholder}
            readOnly={readOnly}
            type={type}
            value={value}
            onChange={onChange}
          />
        )
      }
    </ElementWrapper>
  )
}

InputField.defaultProps = {
  children: null,
  id: '',
  placeholder: '',
  type: null,
  value: ''
}

InputField.propTypes = {
  children: PropTypes.shape({}),
  elementHash: PropTypes.number.isRequired,
  id: PropTypes.string,
  label: PropTypes.string.isRequired,
  modelRef: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  readOnly: PropTypes.bool.isRequired,
  required: PropTypes.bool.isRequired,
  type: PropTypes.string,
  value: PropTypes.string
}
